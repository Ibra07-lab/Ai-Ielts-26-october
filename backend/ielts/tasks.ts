import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { AuthData } from "../auth/auth";
import { supabaseAdmin } from "./db";
import { difficultyPoints, generateSuggestions, getRangeBounds, TaskSuggestion, TaskCategory, TaskDifficulty } from "./aiSuggest";

/** Normalize a date to midnight local time so due_at represents a clean day boundary. */
function normalizeToStartOfDay(d: Date | string | null | undefined): string | null {
	if (!d) return null;
	const date = new Date(d);
	date.setHours(0, 0, 0, 0);
	return date.toISOString();
}

type SummaryRange = "daily" | "weekly" | "monthly";

export interface Task {
	id: string;
	userId: string;
	name: string;
	category: TaskCategory;
	difficulty: TaskDifficulty;
	status: "planned" | "in_progress" | "completed";
	estimatedMinutes: number;
	progress: number;
	dueAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	completedAt?: Date | null;
}

export interface ProgressSummary {
	percent: number;
	totals: {
		planned: number;
		completed: number;
		points: { easy: number; medium: number; hard: number };
	};
}

function mapRowToTask(r: any): Task {
	return {
		id: r.id,
		userId: r.user_id,
		name: r.name,
		category: r.category,
		difficulty: r.difficulty,
		status: r.status,
		estimatedMinutes: r.estimated_minutes,
		progress: r.progress,
		dueAt: r.due_at || undefined,
		createdAt: r.created_at,
		updatedAt: r.updated_at,
		completedAt: r.completed_at,
	};
}

function mapStatusFilter(status: string | undefined): string | null {
	if (!status || status === "all") return null;
	if (status === "in-progress") return "in_progress";
	return status;
}

// GET /progress/summary
export const getProgressSummary = api(
	{ expose: true, method: "GET", path: "/progress/summary", auth: true },
	async (params: { userId: string; range?: SummaryRange }): Promise<ProgressSummary> => {
		const { userId, range = "weekly" } = params;
		const auth = getAuthData() as AuthData | null;
		if (auth?.userID !== userId) {
			throw APIError.permissionDenied("You can only access your own progress summary");
		}
		const { from, to } = getRangeBounds(range);
		const fromISO = from.toISOString();
		const toISO = to.toISOString();

		// planned tasks in range
		const { count: plannedCount } = await supabaseAdmin
			.from("tasks")
			.select("id", { count: "exact", head: true })
			.eq("user_id", userId)
			.not("due_at", "is", null)
			.gte("due_at", fromISO)
			.lte("due_at", toISO);

		// completed tasks in range
		const { count: completedCount } = await supabaseAdmin
			.from("tasks")
			.select("id", { count: "exact", head: true })
			.eq("user_id", userId)
			.eq("status", "completed")
			.not("due_at", "is", null)
			.gte("due_at", fromISO)
			.lte("due_at", toISO);

		// points by difficulty (planned)
		const { data: pointsRows } = await supabaseAdmin
			.from("tasks")
			.select("difficulty")
			.eq("user_id", userId)
			.not("due_at", "is", null)
			.gte("due_at", fromISO)
			.lte("due_at", toISO);

		let plannedPoints = 0;
		const points = { easy: 0, medium: 0, hard: 0 };
		for (const r of (pointsRows || [])) {
			const diff = r.difficulty as TaskDifficulty;
			if (diff in points) {
				const p = difficultyPoints(diff);
				plannedPoints += p;
				points[diff] += p;
			}
		}

		// completed points
		const { data: completedPointsRows } = await supabaseAdmin
			.from("tasks")
			.select("difficulty")
			.eq("user_id", userId)
			.eq("status", "completed")
			.not("due_at", "is", null)
			.gte("due_at", fromISO)
			.lte("due_at", toISO);

		let completedPoints = 0;
		for (const r of (completedPointsRows || [])) {
			completedPoints += difficultyPoints(r.difficulty as TaskDifficulty);
		}

		const percent = plannedPoints > 0 ? Math.max(0, Math.min(100, Math.round((completedPoints / plannedPoints) * 100))) : 0;
		return {
			percent,
			totals: {
				planned:   plannedCount ?? 0,
				completed: completedCount ?? 0,
				points,
			},
		};
	}
);

// GET /progress/tasks
export const listTasks = api(
	{ expose: true, method: "GET", path: "/progress/tasks", auth: true },
	async (params: { userId: string; range?: "daily" | "weekly" | "monthly"; status?: "all" | "planned" | "in-progress" | "completed" }): Promise<{ tasks: Task[] }> => {
		const { userId, range = "weekly", status = "all" } = params;
		const auth = getAuthData() as AuthData | null;
		if (auth?.userID !== userId) {
			throw APIError.permissionDenied("You can only list your own tasks");
		}
		const { from, to } = getRangeBounds(range);
		const fromISO = from.toISOString();
		const toISO = to.toISOString();
		const statusFilter = mapStatusFilter(status);

		let query = supabaseAdmin
			.from("tasks")
			.select("*")
			.eq("user_id", userId);

		if (statusFilter) {
			query = query.eq("status", statusFilter);
		}

		// Filter by date range
		query = query.or(
			`and(status.eq.completed,completed_at.gte.${fromISO},completed_at.lte.${toISO}),and(status.neq.completed,due_at.gte.${fromISO},due_at.lte.${toISO})`
		);

		const { data: rows, error } = await query.order("created_at", { ascending: false });
		if (error) throw APIError.internal(error.message);

		return { tasks: (rows || []).map(mapRowToTask) };
	}
);

// POST /progress/tasks
export const createTask = api(
	{ expose: true, method: "POST", path: "/progress/tasks", auth: true },
	async (body: {
		userId: string;
		name: string;
		category: TaskCategory;
		difficulty: TaskDifficulty;
		estimatedMinutes?: number;
		dueAt?: Date;
	}): Promise<Task> => {
		const { userId, name, category, difficulty } = body;
		const auth = getAuthData() as AuthData | null;
		if (auth?.userID !== userId) {
			throw APIError.permissionDenied("You can only create tasks for yourself");
		}
		const estimatedMinutes = body.estimatedMinutes ?? 20;
		const dueAt = normalizeToStartOfDay(body.dueAt);

		const { data: row, error } = await supabaseAdmin
			.from("tasks")
			.insert({ user_id: userId, name, category, difficulty, estimated_minutes: estimatedMinutes, due_at: dueAt })
			.select("*")
			.single();

		if (error || !row) throw APIError.internal(error?.message ?? "Failed to create task");
		return mapRowToTask(row);
	}
);

// PATCH /progress/tasks/:id
export const updateTask = api(
	{ expose: true, method: "PATCH", path: "/progress/tasks/:id", auth: true },
	async (params: { id: string; progress?: number; status?: "planned" | "in-progress" | "completed"; completedAt?: Date }): Promise<Task> => {
		const auth = getAuthData() as AuthData | null;

		// IDOR check
		const { data: task } = await supabaseAdmin
			.from("tasks").select("user_id").eq("id", params.id).single();
		if (task && task.user_id !== auth?.userID) {
			throw APIError.permissionDenied("You can only update your own tasks");
		}

		const status = params.status === "in-progress" ? "in_progress" : params.status ?? null;
		const updates: Record<string, any> = { updated_at: new Date().toISOString() };

		if (params.progress !== undefined) updates.progress = params.progress;
		if (status) {
			updates.status = status;
			if (status === "completed") {
				updates.completed_at = params.completedAt ? new Date(params.completedAt).toISOString() : new Date().toISOString();
			} else {
				updates.completed_at = null;
			}
		}

		const { data: row, error } = await supabaseAdmin
			.from("tasks").update(updates).eq("id", params.id).select("*").single();

		if (error || !row) throw APIError.notFound("Task not found");
		return mapRowToTask(row);
	}
);

// DELETE /progress/tasks/:id
export const deleteTask = api(
	{ expose: true, method: "DELETE", path: "/progress/tasks/:id", auth: true },
	async (params: { id: string }): Promise<void> => {
		const auth = getAuthData() as AuthData | null;
		const { data: task } = await supabaseAdmin
			.from("tasks").select("user_id").eq("id", params.id).single();
		if (task && task.user_id !== auth?.userID) {
			throw APIError.permissionDenied("You can only delete your own tasks");
		}
		await supabaseAdmin.from("tasks").delete().eq("id", params.id);
	}
);

// POST /progress/ai/generate
export const generateTaskSuggestions = api(
	{ expose: true, method: "POST", path: "/progress/ai/generate", auth: true },
	async (body: { userId: string; range: SummaryRange; timeAvailableMinutes: number; targetBand?: number }): Promise<{ suggestions: TaskSuggestion[] }> => {
		const auth = getAuthData() as AuthData | null;
		if (auth?.userID !== body.userId) {
			throw APIError.permissionDenied("You can only generate suggestions for yourself");
		}
		const suggestions = await generateSuggestions({
			userId: body.userId,
			range: body.range,
			timeAvailableMinutes: body.timeAvailableMinutes,
			targetBand: body.targetBand,
		});
		return { suggestions };
	}
);

// POST /progress/ai/accept
export const acceptTaskSuggestions = api(
	{ expose: true, method: "POST", path: "/progress/ai/accept", auth: true },
	async (body: { userId: string; suggestions: TaskSuggestion[] }): Promise<{ tasks: Task[] }> => {
		const auth = getAuthData() as AuthData | null;
		if (auth?.userID !== body.userId) {
			throw APIError.permissionDenied("You can only accept suggestions for yourself");
		}

		const inserts = body.suggestions.map(s => ({
			user_id:           body.userId,
			name:              s.name,
			category:          s.category,
			difficulty:        s.difficulty,
			estimated_minutes: s.estimatedMinutes ?? 20,
			due_at:            normalizeToStartOfDay(s.dueAt),
		}));

		const { data: rows, error } = await supabaseAdmin
			.from("tasks").insert(inserts).select("*");

		if (error) throw APIError.internal(error.message);
		return { tasks: (rows || []).map(mapRowToTask) };
	}
);
