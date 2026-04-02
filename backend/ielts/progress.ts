import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { AuthData } from "../auth/auth";
import { supabaseAdmin } from "./db";

export interface UserProgress {
  skill: string;
  estimatedBand?: number;
  practiceCount: number;
  lastPracticeDate?: string;
}

export interface ProgressOverview {
  overall: UserProgress[];
  weeklyActivity: number;
  studyStreak: number;
  totalPracticeTime: number;
}

export interface DailyGoal {
  goalDate: string;
  targetMinutes: number;
  completedMinutes: number;
  activitiesCompleted: number;
  targetActivities: number;
}

// Retrieves user progress overview.
export const getProgress = api<{ userId: string }, ProgressOverview>(
  { expose: true, method: "GET", path: "/users/:userId/progress", auth: true },
  async ({ userId }) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== userId) {
      throw APIError.permissionDenied("You can only access your own progress");
    }

    const { data, error } = await supabaseAdmin
      .from("user_progress")
      .select("skill, estimated_band, practice_count, last_practice_date")
      .eq("user_id", userId)
      .order("skill");

    if (error) throw APIError.internal(error.message);

    const progress: UserProgress[] = (data || []).map((row: any) => ({
      skill:            row.skill,
      estimatedBand:    row.estimated_band ?? undefined,
      practiceCount:    row.practice_count,
      lastPracticeDate: row.last_practice_date ?? undefined,
    }));

    return {
      overall:           progress,
      weeklyActivity:    75,
      studyStreak:       5,
      totalPracticeTime: 120,
    };
  }
);

// Updates user progress for a specific skill.
export const updateProgress = api<{ userId: string; skill: string; estimatedBand?: number }, void>(
  { expose: true, method: "POST", path: "/users/:userId/progress/:skill", auth: true },
  async ({ userId, skill, estimatedBand }) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== userId) {
      throw APIError.permissionDenied("You can only update your own progress");
    }

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabaseAdmin
      .from("user_progress")
      .upsert(
        {
          user_id:            userId,
          skill,
          estimated_band:     estimatedBand ?? null,
          practice_count:     1,
          last_practice_date: today,
          updated_at:         new Date().toISOString(),
        },
        { onConflict: "user_id,skill" }
      );

    if (error) throw APIError.internal(error.message);
  }
);

// Retrieves today's daily goal for a user.
export const getDailyGoal = api<{ userId: string }, DailyGoal>(
  { expose: true, method: "GET", path: "/users/:userId/daily-goal", auth: true },
  async ({ userId }) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== userId) {
      throw APIError.permissionDenied("You can only access your own daily goals");
    }

    const today = new Date().toISOString().split("T")[0];

    // 1. Try fetching existing goal for today
    const { data: existing } = await supabaseAdmin
      .from("daily_goals")
      .select("goal_date, target_minutes, completed_minutes, activities_completed, target_activities")
      .eq("user_id", userId)
      .eq("goal_date", today)
      .maybeSingle();

    if (existing) return mapGoal(existing);

    // 2. Insert new daily goal (auto-create user row if missing)
    try {
      const { data: newGoal, error } = await supabaseAdmin
        .from("daily_goals")
        .insert({ user_id: userId, goal_date: today, target_minutes: 30, target_activities: 3 })
        .select("goal_date, target_minutes, completed_minutes, activities_completed, target_activities")
        .single();

      if (error) {
        // FK violation — user row missing, create stub then retry
        if (error.code === "23503" || error.message?.includes("foreign key")) {
          await supabaseAdmin.from("users").insert({
            id: userId, name: "Student", target_band: 7.0, language: "en", theme: "light"
          }).select().single();

          const { data: retry, error: retryErr } = await supabaseAdmin
            .from("daily_goals")
            .insert({ user_id: userId, goal_date: today, target_minutes: 30, target_activities: 3 })
            .select("goal_date, target_minutes, completed_minutes, activities_completed, target_activities")
            .single();

          if (retryErr) throw APIError.internal(retryErr.message);
          return mapGoal(retry);
        }
        throw APIError.internal(error.message);
      }

      return mapGoal(newGoal);
    } catch (err: any) {
      throw APIError.internal(err?.message ?? "Unknown error");
    }
  }
);

// Updates daily goal progress.
export const updateDailyGoal = api<{ userId: string; minutesCompleted: number; activitiesCompleted: number }, void>(
  { expose: true, method: "POST", path: "/users/:userId/daily-goal/update", auth: true },
  async ({ userId, minutesCompleted, activitiesCompleted }) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== userId) {
      throw APIError.permissionDenied("You can only update your own daily goals");
    }

    const today = new Date().toISOString().split("T")[0];

    // Fetch current values first, then increment
    const { data: current } = await supabaseAdmin
      .from("daily_goals")
      .select("completed_minutes, activities_completed")
      .eq("user_id", userId)
      .eq("goal_date", today)
      .single();

    if (!current) return; // No goal for today — silently ignore

    await supabaseAdmin
      .from("daily_goals")
      .update({
        completed_minutes:    (current.completed_minutes || 0) + minutesCompleted,
        activities_completed: (current.activities_completed || 0) + activitiesCompleted,
      })
      .eq("user_id", userId)
      .eq("goal_date", today);
  }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapGoal(row: any): DailyGoal {
  return {
    goalDate:            row.goal_date,
    targetMinutes:       row.target_minutes,
    completedMinutes:    row.completed_minutes ?? 0,
    activitiesCompleted: row.activities_completed ?? 0,
    targetActivities:    row.target_activities,
  };
}
