import { api } from "encore.dev/api";
import { ieltsDB } from "./db";
import { difficultyPoints, generateSuggestions, getRangeBounds, TaskSuggestion, TaskCategory, TaskDifficulty } from "./aiSuggest";

type SummaryRange = "daily" | "weekly" | "monthly";

export interface Task {
	id: string;
	userId: number;
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

function mapStatusFilter(status: string | undefined): ("planned" | "in_progress" | "completed")[] | null {
	if (!status || status === "all") return null;
	if (status === "in-progress") return ["in_progress"];
	if (status === "planned") return ["planned"];
	if (status === "completed") return ["completed"];
	return null;
}

// GET /progress/summary
export const getProgressSummary = api(
	{ expose: true, method: "GET", path: "/progress/summary" },
	async (params: { userId: number; range?: SummaryRange }): Promise<ProgressSummary> => {
		const { userId, range = "weekly" } = params;
		const { from, to } = getRangeBounds(range);

		// planned tasks in range
		const planned = await ieltsDB.queryRow<{ planned: number }>`
			SELECT COUNT(*)::int AS planned
			FROM tasks
			WHERE user_id = ${userId}
			  AND due_at IS NOT NULL
			  AND due_at >= ${from}
			  AND due_at <= ${to}
		`;

		// completed tasks in range
		const completed = await ieltsDB.queryRow<{ completed: number }>`
			SELECT COUNT(*)::int AS completed
			FROM tasks
			WHERE user_id = ${userId}
			  AND status = 'completed'
			  AND due_at IS NOT NULL
			  AND due_at >= ${from}
			  AND due_at <= ${to}
		`;

		// points by difficulty in planned window
		const pointsRows = await ieltsDB.queryAll<{ difficulty: TaskDifficulty; cnt: number }>`
			SELECT difficulty, COUNT(*)::int AS cnt
			FROM tasks
			WHERE user_id = ${userId}
			  AND due_at IS NOT NULL
			  AND due_at >= ${from}
			  AND due_at <= ${to}
			GROUP BY difficulty
		`;

		let plannedPoints = 0;
		const points = { easy: 0, medium: 0, hard: 0 };
		for (const r of pointsRows) {
			const p = difficultyPoints(r.difficulty) * r.cnt;
			plannedPoints += p;
			points[r.difficulty] += p;
		}

		const completedPointsRow = await ieltsDB.queryAll<{ difficulty: TaskDifficulty; cnt: number }>`
			SELECT difficulty, COUNT(*)::int AS cnt
			FROM tasks
			WHERE user_id = ${userId}
			  AND status = 'completed'
			  AND due_at IS NOT NULL
			  AND due_at >= ${from}
			  AND due_at <= ${to}
			GROUP BY difficulty
		`;
		let completedPoints = 0;
		for (const r of completedPointsRow) {
			completedPoints += difficultyPoints(r.difficulty) * r.cnt;
		}

		const percent = plannedPoints > 0 ? Math.max(0, Math.min(100, Math.round((completedPoints / plannedPoints) * 100))) : 0;
		return {
			percent,
			totals: {
				planned: planned?.planned ?? 0,
				completed: completed?.completed ?? 0,
				points,
			},
		};
	}
);

// GET /progress/tasks
export const listTasks = api(
	{ expose: true, method: "GET", path: "/progress/tasks" },
	async (params: { userId: number; range?: "daily" | "weekly"; status?: "all" | "planned" | "in-progress" | "completed" }): Promise<{ tasks: Task[] }> => {
	  const { userId, range = "weekly", status = "all" } = params;
	  const { from, to } = getRangeBounds(range);
	  const statusFilter = mapStatusFilter(status);
  
	  let rows: any[];
	  if (statusFilter) {
		rows = await ieltsDB.queryAll<any>`
		  SELECT *
		  FROM tasks
		  WHERE user_id = ${userId}
			AND (due_at IS NULL OR (due_at >= ${from} AND due_at <= ${to}))
			AND status = ${statusFilter[0]}
		  ORDER BY COALESCE(due_at, created_at) ASC, created_at DESC
		`;
	  } else {
		rows = await ieltsDB.queryAll<any>`
		  SELECT *
		  FROM tasks
		  WHERE user_id = ${userId}
			AND (due_at IS NULL OR (due_at >= ${from} AND due_at <= ${to}))
		  ORDER BY COALESCE(due_at, created_at) ASC, created_at DESC
		`;
	  }
	  return { tasks: rows.map(mapRowToTask) };
	}
  );

// POST /progress/tasks
export const createTask = api(
	{ expose: true, method: "POST", path: "/progress/tasks" },
	async (body: {
		userId: number;
		name: string;
		category: TaskCategory;
		difficulty: TaskDifficulty;
		estimatedMinutes?: number;
		dueAt?: Date;
	}): Promise<Task> => {
		const { userId, name, category, difficulty } = body;
		const estimatedMinutes = body.estimatedMinutes ?? 20;
		const dueAt = body.dueAt ? new Date(body.dueAt) : null;
		const row = await ieltsDB.queryRow<any>`
			INSERT INTO tasks (user_id, name, category, difficulty, estimated_minutes, due_at)
			VALUES (${userId}, ${name}, ${category}, ${difficulty}, ${estimatedMinutes}, ${dueAt})
			RETURNING *
		`;
		return mapRowToTask(row);
	}
);

// PATCH /progress/tasks/:id
export const updateTask = api(
	{ expose: true, method: "PATCH", path: "/progress/tasks/:id" },
	async (params: { id: string; progress?: number; status?: "planned" | "in-progress" | "completed"; completedAt?: Date }): Promise<Task> => {
		const progress = params.progress ?? null;
		const status = params.status === "in-progress" ? "in_progress" : params.status ?? null;
		const completedAt = params.completedAt ? new Date(params.completedAt) : null;
		const row = await ieltsDB.queryRow<any>`
			UPDATE tasks
			SET
				progress = COALESCE(${progress}, progress),
				status = COALESCE(${status}::text, status),
				completed_at = COALESCE(${completedAt}, completed_at),
				updated_at = NOW()
			WHERE id = ${params.id}
			RETURNING *
		`;
		return mapRowToTask(row);
	}
);

// DELETE /progress/tasks/:id
export const deleteTask = api(
	{ expose: true, method: "DELETE", path: "/progress/tasks/:id" },
	async (params: { id: string }): Promise<void> => {
		await ieltsDB.exec`DELETE FROM tasks WHERE id = ${params.id}`;
	}
);

// POST /progress/ai/generate
export const generateTaskSuggestions = api(
	{ expose: true, method: "POST", path: "/progress/ai/generate" },
	async (body: { userId: number; range: SummaryRange; timeAvailableMinutes: number; targetBand?: number }): Promise<{ suggestions: TaskSuggestion[] }> => {
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
	{ expose: true, method: "POST", path: "/progress/ai/accept" },
	async (body: { userId: number; suggestions: TaskSuggestion[] }): Promise<{ tasks: Task[] }> => {
		const tasks: Task[] = [];
		for (const s of body.suggestions) {
			const row = await ieltsDB.queryRow<any>`
				INSERT INTO tasks (user_id, name, category, difficulty, estimated_minutes, due_at)
				VALUES (${body.userId}, ${s.name}, ${s.category}, ${s.difficulty}, ${s.estimatedMinutes ?? 20}, ${s.dueAt ?? null})
				RETURNING *
			`;
			tasks.push(mapRowToTask(row));
		}
		return { tasks };
	}
);


