import { ieltsDB } from "./db";

export type TaskCategory = "reading" | "writing" | "speaking" | "listening" | "vocabulary" | "grammar";
export type TaskDifficulty = "easy" | "medium" | "hard";
export type SummaryRange = "daily" | "weekly" | "monthly";

export interface TaskSuggestion {
	name: string;
	category: TaskCategory;
	difficulty: TaskDifficulty;
	estimatedMinutes: number;
	dueAt?: Date;
}

const DIFFICULTY_POINTS: Record<TaskDifficulty, number> = { easy: 1, medium: 1.5, hard: 2 };

function startOfDay(d: Date): Date {
	const x = new Date(d);
	x.setHours(0, 0, 0, 0);
	return x;
}
function endOfDay(d: Date): Date {
	const x = new Date(d);
	x.setHours(23, 59, 59, 999);
	return x;
}
function startOfWeek(d: Date): Date {
	const day = d.getDay(); // 0=Sun..6=Sat
	const mondayOffset = (day + 6) % 7; // 0 for Mon
	const x = new Date(d);
	x.setDate(d.getDate() - mondayOffset);
	return startOfDay(x);
}
function endOfWeek(d: Date): Date {
	const s = startOfWeek(d);
	const x = new Date(s);
	x.setDate(s.getDate() + 6);
	return endOfDay(x);
}
function startOfMonth(d: Date): Date {
	return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}
function endOfMonth(d: Date): Date {
	return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function getRangeBounds(range: SummaryRange, now = new Date()): { from: Date; to: Date } {
	switch (range) {
		case "daily":
			return { from: startOfDay(now), to: endOfDay(now) };
		case "weekly":
			return { from: startOfWeek(now), to: endOfWeek(now) };
		case "monthly":
			return { from: startOfMonth(now), to: endOfMonth(now) };
		default:
			return { from: startOfDay(now), to: endOfDay(now) };
	}
}

const CATEGORY_TEMPLATES: Record<TaskCategory, string[]> = {
	listening: ["20-min Listening practice (Academic topics)", "IELTS Listening Section 3 practice"],
	reading: ["Complete Reading Practice passage", "Skim and scan 2 articles for keywords"],
	writing: ["Review Writing Task 2 feedback", "Outline essay for Task 2 topic"],
	vocabulary: ["Master 15 academic collocations", "Revise 20 vocabulary flashcards"],
	grammar: ["Review complex sentence structures", "Practice 10 complex sentences"],
	speaking: ["Record 10-min response: Part 2 topics", "Mock Speaking Part 3 Q&A (10 min)"],
};

export async function computeWeakAreas(userId: number): Promise<TaskCategory[]> {
	// Simple heuristic: count completions in last 14 days per category; fewer completions -> weaker.
	const rows = await ieltsDB.queryAll<{ category: TaskCategory; cnt: number }>`
		SELECT category, COUNT(*)::int AS cnt
		FROM tasks
		WHERE user_id = ${userId}
		  AND status = 'completed'
		  AND completed_at >= NOW() - INTERVAL '14 days'
		GROUP BY category
	`;
	const counts: Record<TaskCategory, number> = {
		reading: 0, writing: 0, speaking: 0, listening: 0, vocabulary: 0, grammar: 0,
	};
	for (const r of rows) counts[r.category] = r.cnt;
	// Sort ascending (lowest activity first)
	return (Object.keys(counts) as TaskCategory[]).sort((a, b) => counts[a] - counts[b]);
}

export function pickDifficultyMix(totalMinutes: number): TaskDifficulty[] {
	// Simple mix: prefer medium; include at most one hard if time >= 45; otherwise mostly easy/medium.
	const mix: TaskDifficulty[] = [];
	if (totalMinutes >= 60) {
		mix.push("hard", "medium", "medium");
	} else if (totalMinutes >= 45) {
		mix.push("medium", "medium", "easy");
	} else {
		mix.push("medium", "easy", "easy");
	}
	// Ensure between 3-5 entries
	while (mix.length < 3) mix.push("easy");
	if (mix.length < 5 && totalMinutes >= 75) mix.push("medium");
	return mix.slice(0, 5);
}

export function estimateMinutesFor(difficulty: TaskDifficulty): number {
	switch (difficulty) {
		case "easy":
			return 15;
		case "medium":
			return 20;
		case "hard":
			return 25;
	}
}

export async function generateSuggestions(params: {
	userId: number;
	range: SummaryRange;
	timeAvailableMinutes: number;
	targetBand?: number;
	now?: Date;
}): Promise<TaskSuggestion[]> {
	const { userId, range, timeAvailableMinutes, now = new Date() } = params;
	const [weakFirst] = await Promise.all([computeWeakAreas(userId)]);
	const bounds = getRangeBounds(range, now);

	const difficulties = pickDifficultyMix(timeAvailableMinutes);

	const suggestions: TaskSuggestion[] = [];
	let usedMinutes = 0;
	let catIdx = 0;
	for (const diff of difficulties) {
		const est = estimateMinutesFor(diff);
		if (usedMinutes + est > timeAvailableMinutes) continue;
		const cat = weakFirst[catIdx % weakFirst.length] ?? "reading";
		catIdx++;
		const templates = CATEGORY_TEMPLATES[cat];
		const name = templates[Math.floor(Math.random() * templates.length)];
		const dueAt = range === "daily" ? now : bounds.to;
		suggestions.push({ name, category: cat, difficulty: diff, estimatedMinutes: est, dueAt });
		usedMinutes += est;
	}
	// Ensure we return at least 3 items; if not, backfill easy tasks in reading.
	while (suggestions.length < 3) {
		const est = 15;
		if (usedMinutes + est > timeAvailableMinutes) break;
		suggestions.push({
			name: CATEGORY_TEMPLATES.reading[0],
			category: "reading",
			difficulty: "easy",
			estimatedMinutes: est,
			dueAt: range === "daily" ? now : bounds.to,
		});
		usedMinutes += est;
	}
	return suggestions.slice(0, 5);
}

export function difficultyPoints(d: TaskDifficulty): number {
	return DIFFICULTY_POINTS[d];
}


