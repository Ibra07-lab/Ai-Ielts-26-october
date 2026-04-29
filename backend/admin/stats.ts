import { api, APIError } from "encore.dev/api";
import { supabaseAdmin } from "../ielts/db";
import { getAuthData } from "~encore/auth";
import { AuthData } from "../auth/auth";

export interface AdminStatsResponse {
  totalUsers: number;
  totalEssaysUsed: number;
  totalReadingMessages: number;
  totalApiCostUsd: number;
  currentMonthApiCostUsd: number;
  topExpensiveUsers: {
    id: string;
    email: string;
    plan: string;
    cumulative_api_cost: number;
    current_month_cost: number;
    reading_credits_used: number;
    essays_used: number;
  }[];
}

// Ensure the user is an admin (we'll just check if their role is admin or allow specific emails for now)
async function requireAdmin() {
  const auth = getAuthData() as AuthData | null;
  if (!auth) {
    throw APIError.unauthenticated("You must be logged in");
  }
  
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("id", auth.userID)
    .single();
    
  if (user?.role !== "admin") {
    // If you don't have an admin role set up yet, you could check for your specific email here
    // but for now we enforce the 'admin' role in the database.
    throw APIError.permissionDenied("You must be an admin to view this data");
  }
}

export const getAdminStats = api<void, AdminStatsResponse>(
  { expose: true, method: "GET", path: "/admin/stats", auth: true },
  async () => {
    await requireAdmin();

    // 1. Get aggregate stats
    // Note: In a large production DB, you'd use a postgres function/view for this
    // For now, we sum over the users table
    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("id, email, plan, essays_used, reading_credits_used, cumulative_api_cost, current_month_cost")
      .order("cumulative_api_cost", { ascending: false, nullsFirst: false });

    if (error) {
      throw APIError.internal(`Failed to fetch users: ${error.message}`);
    }

    let totalEssaysUsed = 0;
    let totalReadingMessages = 0;
    let totalApiCostUsd = 0;
    let currentMonthApiCostUsd = 0;

    for (const u of users) {
      totalEssaysUsed += (u.essays_used || 0);
      totalReadingMessages += (u.reading_credits_used || 0);
      totalApiCostUsd += (u.cumulative_api_cost || 0);
      currentMonthApiCostUsd += (u.current_month_cost || 0);
    }

    // Get Top 5% most expensive users (min 5 users)
    const topCount = Math.max(5, Math.ceil(users.length * 0.05));
    const topExpensiveUsers = users.slice(0, topCount).map(u => ({
      id: u.id,
      email: u.email || "Unknown",
      plan: u.plan || "free",
      cumulative_api_cost: u.cumulative_api_cost || 0,
      current_month_cost: u.current_month_cost || 0,
      reading_credits_used: u.reading_credits_used || 0,
      essays_used: u.essays_used || 0
    }));

    return {
      totalUsers: users.length,
      totalEssaysUsed,
      totalReadingMessages,
      totalApiCostUsd,
      currentMonthApiCostUsd,
      topExpensiveUsers
    };
  }
);
