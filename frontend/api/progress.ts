export type TaskCategory = "reading" | "writing" | "speaking" | "listening" | "vocabulary" | "grammar";
export type TaskDifficulty = "easy" | "medium" | "hard";
export type SummaryRange = "daily" | "weekly" | "monthly";

export interface Task {
	id: string;
	userId: number;
	name: string;
	category: TaskCategory;
	difficulty: TaskDifficulty;
	status: "planned" | "in_progress" | "completed";
	estimatedMinutes: number;
	progress: number;
	dueAt?: string;
	createdAt: string;
	updatedAt: string;
	completedAt?: string | null;
}

export interface ProgressSummary {
	percent: number;
	totals: {
		planned: number;
		completed: number;
		points: { easy: number; medium: number; hard: number };
	};
}

export interface TaskSuggestion {
	name: string;
	category: TaskCategory;
	difficulty: TaskDifficulty;
	estimatedMinutes: number;
	dueAt?: string;
}

// Base origin for backend API calls.
// In dev, set VITE_BACKEND_BASE_URL=http://localhost:4000 to call Encore directly.
const API_ORIGIN = (import.meta as any).env?.VITE_BACKEND_BASE_URL || window.location.origin;

export async function getSummary(userId: number, range: SummaryRange = "weekly"): Promise<ProgressSummary> {
	const url = new URL(`/progress/summary`, API_ORIGIN);
	url.searchParams.set("userId", String(userId));
	url.searchParams.set("range", range);
	const resp = await fetch(url.toString(), { credentials: "include" });
	if (!resp.ok) throw new Error(`Failed to fetch summary: ${resp.status}`);
	return await resp.json();
}

export async function listTasks(userId: number, range: "daily" | "weekly" = "weekly", status: "all" | "planned" | "in-progress" | "completed" = "all"): Promise<{ tasks: Task[] }> {
	const url = new URL(`/progress/tasks`, API_ORIGIN);
	url.searchParams.set("userId", String(userId));
	url.searchParams.set("range", range);
	url.searchParams.set("status", status);
	const resp = await fetch(url.toString(), { credentials: "include" });
	if (!resp.ok) throw new Error(`Failed to list tasks: ${resp.status}`);
	return await resp.json();
}

export async function createTask(task: {
	userId: number;
	name: string;
	category: TaskCategory;
	difficulty: TaskDifficulty;
	estimatedMinutes?: number;
	dueAt?: string;
}): Promise<Task> {
	const resp = await fetch(`${API_ORIGIN}/progress/tasks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(task),
	});
	if (!resp.ok) throw new Error(`Failed to create task: ${resp.status}`);
	return await resp.json();
}

export async function updateTask(id: string, updates: { progress?: number; status?: "planned" | "in-progress" | "completed"; completedAt?: string }): Promise<Task> {
	const resp = await fetch(`${API_ORIGIN}/progress/tasks/${encodeURIComponent(id)}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(updates),
	});
	if (!resp.ok) throw new Error(`Failed to update task: ${resp.status}`);
	return await resp.json();
}

export async function deleteTask(id: string): Promise<void> {
	const resp = await fetch(`${API_ORIGIN}/progress/tasks/${encodeURIComponent(id)}`, {
		method: "DELETE",
		credentials: "include",
	});
	if (!resp.ok) throw new Error(`Failed to delete task: ${resp.status}`);
}

export async function generateSuggestions(params: { userId: number; range: SummaryRange; timeAvailableMinutes: number; targetBand?: number }): Promise<{ suggestions: TaskSuggestion[] }> {
	const resp = await fetch(`${API_ORIGIN}/progress/ai/generate`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(params),
	});
	if (!resp.ok) throw new Error(`Failed to generate suggestions: ${resp.status}`);
	return await resp.json();
}

export async function acceptSuggestions(params: { userId: number; suggestions: TaskSuggestion[] }): Promise<{ tasks: Task[] }> {
	const resp = await fetch(`${API_ORIGIN}/progress/ai/accept`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(params),
	});
	if (!resp.ok) throw new Error(`Failed to accept suggestions: ${resp.status}`);
	return await resp.json();
}


