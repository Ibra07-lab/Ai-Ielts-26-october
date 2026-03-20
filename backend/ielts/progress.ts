import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { AuthData } from "./auth";
import { ieltsDB } from "./db";

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

    const progress = await ieltsDB.queryAll<UserProgress>`
      SELECT skill, estimated_band as "estimatedBand", practice_count as "practiceCount", 
             last_practice_date as "lastPracticeDate"
      FROM user_progress 
      WHERE user_id = ${userId}
      ORDER BY skill
    `;

    // Calculate weekly activity (mock calculation)
    const weeklyActivity = 75; // Percentage

    // Calculate study streak (mock calculation)
    const studyStreak = 5; // Days

    // Calculate total practice time (mock calculation)
    const totalPracticeTime = 120; // Minutes

    return {
      overall: progress,
      weeklyActivity,
      studyStreak,
      totalPracticeTime,
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

    await ieltsDB.exec`
      INSERT INTO user_progress (user_id, skill, estimated_band, practice_count, last_practice_date)
      VALUES (${userId}, ${skill}, ${estimatedBand || null}, 1, CURRENT_DATE)
      ON CONFLICT (user_id, skill)
      DO UPDATE SET 
        estimated_band = COALESCE(${estimatedBand || null}, user_progress.estimated_band),
        practice_count = user_progress.practice_count + 1,
        last_practice_date = CURRENT_DATE,
        updated_at = NOW()
    `;
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

    // 1. Try fetching the existing goal for today
    const goal = await ieltsDB.queryRow<DailyGoal>`
      SELECT goal_date as "goalDate", target_minutes as "targetMinutes", 
             completed_minutes as "completedMinutes", activities_completed as "activitiesCompleted",
             target_activities as "targetActivities"
      FROM daily_goals 
      WHERE user_id = ${userId} AND goal_date = CURRENT_DATE
    `;

    if (goal) {
      return goal;
    }

    // 2. Insert new daily goal (and gracefully handle foreign key violation if the user doesn't exist yet)
    try {
      const newGoal = await ieltsDB.queryRow<DailyGoal>`
        INSERT INTO daily_goals (user_id, goal_date, target_minutes, target_activities)
        VALUES (${userId}, CURRENT_DATE, 30, 3)
        RETURNING goal_date as "goalDate", target_minutes as "targetMinutes", 
                  completed_minutes as "completedMinutes", activities_completed as "activitiesCompleted",
                  target_activities as "targetActivities"
      `;
      return newGoal!;
    } catch (error: any) {
      // If it's a foreign key constraint violation (code 23503), the user doesn't exist in our table.
      if (error?.code === "23503" || error?.message?.includes("foreign key constraint")) {
        await ieltsDB.exec`
          INSERT INTO users (id, name, target_band, language, theme)
          VALUES (${userId}, 'Student', 7.0, 'en', 'light')
          ON CONFLICT (id) DO NOTHING
        `;

        // Retry creating the daily goal
        const retryGoal = await ieltsDB.queryRow<DailyGoal>`
          INSERT INTO daily_goals (user_id, goal_date, target_minutes, target_activities)
          VALUES (${userId}, CURRENT_DATE, 30, 3)
          RETURNING goal_date as "goalDate", target_minutes as "targetMinutes", 
                    completed_minutes as "completedMinutes", activities_completed as "activitiesCompleted",
                    target_activities as "targetActivities"
        `;
        return retryGoal!;
      }
      throw error;
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

    await ieltsDB.exec`
      UPDATE daily_goals 
      SET completed_minutes = completed_minutes + ${minutesCompleted},
          activities_completed = activities_completed + ${activitiesCompleted}
      WHERE user_id = ${userId} AND goal_date = CURRENT_DATE
    `;
  }
);

