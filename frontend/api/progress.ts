export type TaskCategory = "reading" | "writing" | "speaking" | "listening" | "vocabulary" | "grammar";
export type TaskDifficulty = "easy" | "medium" | "hard";
export type SummaryRange = "daily" | "weekly" | "monthly";

export interface Task {
	id: string;
	userId: string;
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
const API_ORIGIN = (import.meta as any).env?.VITE_BACKEND_BASE_URL || "http://localhost:4000";

// Helper: get auth headers for Encore API calls
import { supabase } from "../lib/supabase";

async function getAuthHeaders(): Promise<Record<string, string>> {
	try {
		const { data: { session } } = await supabase.auth.getSession();
		if (session?.access_token) {
			return { "Authorization": `Bearer ${session.access_token}` };
		}
	} catch (e) {
		console.warn("Failed to get auth session for progress API:", e);
	}
	return {};
}

export async function getSummary(userId: string, range: SummaryRange = "weekly"): Promise<ProgressSummary> {
	const url = new URL(`/progress/summary`, API_ORIGIN);
	url.searchParams.set("userId", String(userId));
	url.searchParams.set("range", range);
	const authHeaders = await getAuthHeaders();
	const resp = await fetch(url.toString(), { headers: authHeaders });
	if (!resp.ok) throw new Error(`Failed to fetch summary: ${resp.status}`);
	return await resp.json();
}

export async function listTasks(userId: string, range: "daily" | "weekly" | "monthly" = "weekly", status: "all" | "planned" | "in-progress" | "completed" = "all"): Promise<{ tasks: Task[] }> {
	const url = new URL(`/progress/tasks`, API_ORIGIN);
	url.searchParams.set("userId", String(userId));
	url.searchParams.set("range", range);
	url.searchParams.set("status", status);
	const authHeaders = await getAuthHeaders();
	const resp = await fetch(url.toString(), { headers: authHeaders });
	if (!resp.ok) throw new Error(`Failed to list tasks: ${resp.status}`);
	return await resp.json();
}

export async function createTask(task: {
	userId: string;
	name: string;
	category: TaskCategory;
	difficulty: TaskDifficulty;
	estimatedMinutes?: number;
	dueAt?: string;
}): Promise<Task> {
	const authHeaders = await getAuthHeaders();
	const resp = await fetch(`${API_ORIGIN}/progress/tasks`, {
		method: "POST",
		headers: { "Content-Type": "application/json", ...authHeaders },
		body: JSON.stringify(task),
	});
	if (!resp.ok) throw new Error(`Failed to create task: ${resp.status}`);
	return await resp.json();
}

export async function updateTask(id: string, updates: { progress?: number; status?: "planned" | "in-progress" | "completed"; completedAt?: string }): Promise<Task> {
	const authHeaders = await getAuthHeaders();
	const resp = await fetch(`${API_ORIGIN}/progress/tasks/${encodeURIComponent(id)}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json", ...authHeaders },
		body: JSON.stringify(updates),
	});
	if (!resp.ok) throw new Error(`Failed to update task: ${resp.status}`);
	return await resp.json();
}

export async function deleteTask(id: string): Promise<void> {
	const authHeaders = await getAuthHeaders();
	const resp = await fetch(`${API_ORIGIN}/progress/tasks/${encodeURIComponent(id)}`, {
		method: "DELETE",
		headers: authHeaders,
	});
	if (!resp.ok) throw new Error(`Failed to delete task: ${resp.status}`);
}

export async function generateSuggestions(params: { userId: string; range: SummaryRange; timeAvailableMinutes: number; targetBand?: number }): Promise<{ suggestions: TaskSuggestion[] }> {
	const authHeaders = await getAuthHeaders();
	const resp = await fetch(`${API_ORIGIN}/progress/ai/generate`, {
		method: "POST",
		headers: { "Content-Type": "application/json", ...authHeaders },
		body: JSON.stringify(params),
	});
	if (!resp.ok) throw new Error(`Failed to generate suggestions: ${resp.status}`);
	return await resp.json();
}

export async function acceptSuggestions(params: { userId: string; suggestions: TaskSuggestion[] }): Promise<{ tasks: Task[] }> {
	const authHeaders = await getAuthHeaders();
	const resp = await fetch(`${API_ORIGIN}/progress/ai/accept`, {
		method: "POST",
		headers: { "Content-Type": "application/json", ...authHeaders },
		body: JSON.stringify(params),
	});
	if (!resp.ok) throw new Error(`Failed to accept suggestions: ${resp.status}`);
	return await resp.json();
}
