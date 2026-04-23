// ─── Plan limits ─────────────────────────────────────────────────────────────
export const PLAN_LIMITS: Record<string, number> = {
  free:     2,
  basic:    15,
  pro:      40,
  pro_plus: 80,
};

export const READING_LIMITS: Record<string, number> = {
  free:     15,
  basic:    300,
  pro:      800,
  pro_plus: -1, // -1 means unlimited
};

export function getPlanLimit(plan: string): number {
  return PLAN_LIMITS[plan] ?? 2; // default to free
}

export function getReadingLimit(plan: string): number {
  return READING_LIMITS[plan] ?? 15; // default to free
}
