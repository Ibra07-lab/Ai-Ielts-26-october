import { api } from "encore.dev/api";
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
export const getProgress = api<{ userId: number }, ProgressOverview>(
  { expose: true, method: "GET", path: "/users/:userId/progress" },
  async ({ userId }) => {
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
export const updateProgress = api<{ userId: number; skill: string; estimatedBand?: number }, void>(
  { expose: true, method: "POST", path: "/users/:userId/progress/:skill" },
  async ({ userId, skill, estimatedBand }) => {
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
export const getDailyGoal = api<{ userId: number }, DailyGoal>(
  { expose: true, method: "GET", path: "/users/:userId/daily-goal" },
  async ({ userId }) => {
    const goal = await ieltsDB.queryRow<DailyGoal>`
      SELECT goal_date as "goalDate", target_minutes as "targetMinutes", 
             completed_minutes as "completedMinutes", activities_completed as "activitiesCompleted",
             target_activities as "targetActivities"
      FROM daily_goals 
      WHERE user_id = ${userId} AND goal_date = CURRENT_DATE
    `;

    if (!goal) {
      // Create a new daily goal for today
      const newGoal = await ieltsDB.queryRow<DailyGoal>`
        INSERT INTO daily_goals (user_id, goal_date, target_minutes, target_activities)
        VALUES (${userId}, CURRENT_DATE, 30, 3)
        RETURNING goal_date as "goalDate", target_minutes as "targetMinutes", 
                  completed_minutes as "completedMinutes", activities_completed as "activitiesCompleted",
                  target_activities as "targetActivities"
      `;
      return newGoal!;
    }

    return goal;
  }
);

// Updates daily goal progress.
export const updateDailyGoal = api<{ userId: number; minutesCompleted: number; activitiesCompleted: number }, void>(
  { expose: true, method: "POST", path: "/users/:userId/daily-goal/update" },
  async ({ userId, minutesCompleted, activitiesCompleted }) => {
    await ieltsDB.exec`
      UPDATE daily_goals 
      SET completed_minutes = completed_minutes + ${minutesCompleted},
          activities_completed = activities_completed + ${activitiesCompleted}
      WHERE user_id = ${userId} AND goal_date = CURRENT_DATE
    `;
  }
);
