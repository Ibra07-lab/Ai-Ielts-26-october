// ─── Plan limits ─────────────────────────────────────────────────────────────
export const PLAN_LIMITS: Record<string, number> = {
  free:     2,
  basic:    15,
  pro:      40,
  pro_plus: 80,
};

export function getPlanLimit(plan: string): number {
  return PLAN_LIMITS[plan] ?? 2; // default to free
}
