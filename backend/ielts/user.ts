import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { AuthData } from "../auth/auth";
import { supabaseAdmin } from "./db";
import { getPlanLimit } from "./limits";

export interface User {
  id: string;
  name: string;
  targetBand: number;
  examDate?: string;
  language: string;
  theme: string;
  plan: string;
  essaysUsed: number;
  activeAnalysis: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EssayLimits {
  plan: string;
  essaysUsed: number;
  limit: number;
  remaining: number;
  activeAnalysis: boolean;
}

export interface CreateUserRequest {
  id: string; // Supabase UUID
  name: string;
  targetBand: number;
  examDate?: string;
  language?: string;
  theme?: string;
}

export interface UpdateUserRequest {
  id: string;
  name?: string;
  targetBand?: number;
  examDate?: string;
  language?: string;
  theme?: string;
}

// Creates a new user profile.
export const createUser = api<CreateUserRequest, User>(
  { expose: true, method: "POST", path: "/users", auth: true },
  async (req) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== req.id) {
      throw APIError.permissionDenied("You can only create a profile for yourself");
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({
        id: req.id,
        name: req.name,
        target_band: req.targetBand,
        exam_date: req.examDate || null,
        language: req.language || "en",
        theme: req.theme || "light",
      })
      .select("id, name, target_band, exam_date, language, theme, plan, essays_used, active_analysis, created_at, updated_at")
      .single();

    if (error) throw APIError.internal(`Failed to create user: ${error.message}`);

    return mapUser(data);
  }
);

// Retrieves a user by ID.
export const getUser = api<{ id: string }, User>(
  { expose: true, method: "GET", path: "/users/:id", auth: true },
  async ({ id }) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== id) {
      throw APIError.permissionDenied("You can only access your own profile");
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, name, target_band, exam_date, language, theme, plan, essays_used, active_analysis, created_at, updated_at")
      .eq("id", id)
      .single();

    if (error || !data) throw APIError.notFound("User not found");

    return mapUser(data);
  }
);

// Updates a user profile.
export const updateUser = api<UpdateUserRequest, User>(
  { expose: true, method: "PUT", path: "/users/:id", auth: true },
  async (req) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== req.id) {
      throw APIError.permissionDenied("You can only update your own profile");
    }

    const updates: Record<string, any> = {};
    if (req.name !== undefined)       updates.name = req.name;
    if (req.targetBand !== undefined) updates.target_band = req.targetBand;
    if (req.examDate !== undefined)   updates.exam_date = req.examDate;
    if (req.language !== undefined)   updates.language = req.language;
    if (req.theme !== undefined)      updates.theme = req.theme;

    if (Object.keys(updates).length === 0) {
      throw APIError.invalidArgument("No fields to update");
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .update(updates)
      .eq("id", req.id)
      .select("id, name, target_band, exam_date, language, theme, plan, essays_used, active_analysis, created_at, updated_at")
      .single();

    if (error || !data) throw APIError.notFound("User not found");

    return mapUser(data);
  }
);

// ─── Essay Limit Endpoints ────────────────────────────────────────────────────

// Returns the current essay usage and plan limits for a user.
export const getEssayLimits = api<{ id: string }, { plan: string; essaysUsed: number; limit: number; remaining: number; activeAnalysis: boolean }>(
  { expose: true, method: "GET", path: "/users/:id/essay-limits", auth: true },
  async ({ id }) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== id) {
      throw APIError.permissionDenied("You can only access your own limits");
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .select("plan, essays_used, active_analysis")
      .eq("id", id)
      .single();

    if (error || !data) throw APIError.notFound("User not found");

    const limit = getPlanLimit(data.plan);
    return {
      plan:           data.plan,
      essaysUsed:     data.essays_used,
      limit,
      remaining:      Math.max(0, limit - data.essays_used),
      activeAnalysis: data.active_analysis,
    };
  }
);

// Atomically checks the essay limit and locks the user for analysis.
export const checkAndLockEssay = api(
  { expose: true, method: "POST", path: "/essay-limits/check-and-lock", auth: true },
  async () => {
    const auth = getAuthData() as AuthData | null;
    if (!auth?.userID) throw APIError.unauthenticated("Not authenticated");

    const { error } = await supabaseAdmin.rpc("check_and_lock_user", { user_id: auth.userID });

    if (error) {
      const msg = error.message ?? "";
      if (msg.includes("ALREADY_ANALYZING")) {
        throw APIError.resourceExhausted("You already have an analysis in progress. Please wait.");
      }
      if (msg.includes("LIMIT_REACHED")) {
        const { data: row } = await supabaseAdmin
          .from("users").select("plan").eq("id", auth.userID).single();
        const limit = getPlanLimit(row?.plan ?? "free");
        throw APIError.resourceExhausted(
          `You have used all ${limit} essays on your ${row?.plan ?? "free"} plan. Please upgrade.`
        );
      }
      throw APIError.internal(error.message);
    }

    return {};
  }
);

// Unlocks the user after analysis. Increments essay credit only on success.
export const completeEssayAnalysis = api<{ success: boolean }>(
  { expose: true, method: "POST", path: "/essay-limits/complete", auth: true },
  async ({ success }) => {
    const auth = getAuthData() as AuthData | null;
    if (!auth?.userID) throw APIError.unauthenticated("Not authenticated");

    if (success) {
      await supabaseAdmin.rpc("increment_essays_used", { user_id: auth.userID });
    }

    // Always unlock regardless of success/failure
    await supabaseAdmin
      .from("users")
      .update({ active_analysis: false, analysis_started_at: null })
      .eq("id", auth.userID);

    return {};
  }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapUser(row: any): User {
  return {
    id:             row.id,
    name:           row.name,
    targetBand:     row.target_band,
    examDate:       row.exam_date ?? undefined,
    language:       row.language,
    theme:          row.theme,
    plan:           row.plan ?? "free",
    essaysUsed:     row.essays_used ?? 0,
    activeAnalysis: row.active_analysis ?? false,
    createdAt:      row.created_at,
    updatedAt:      row.updated_at,
  };
}
