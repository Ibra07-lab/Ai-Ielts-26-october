import { useEffect, useMemo, useState } from "react";
import { Sparkles, Wand2, CheckCircle, Circle, CircleDot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/contexts/UserContext";
import * as progressApi from "@/api/progress";
import AddTaskModal from "@/components/progress/AddTaskModal";

type PlanType = "daily" | "weekly" | "custom";

type GlowingProgressCardProps = {
  title?: string;
  percent: number;
  planType?: PlanType;
  dueDateISO?: string;
  onEditDueDate?: (iso: string) => void;
  onPlanTypeChange?: (v: PlanType) => void;
  onAiSuggest?: () => void;
  className?: string;
};

const PLAN_LS_KEY = "progress.planType";
const DUE_LS_KEY = "progress.dueISO";

function clampPercent(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function toInputDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

function formatDueShort(iso?: string) {
  if (!iso) return "Set due date";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "long", day: "numeric" });
  } catch {
    return "Set due date";
  }
}

// Convert ISO string to 'YYYY-MM-DDTHH:mm' for datetime-local input
function toDateTimeLocal(iso?: string) {
  const d = iso ? new Date(iso) : new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
}

const CATEGORY_COLORS: Record<string, string> = {
  reading: "bg-green-500 neon-fill--reading",
  speaking: "bg-red-500 neon-fill--speaking",
  writing: "bg-blue-500 neon-fill--writing",
  listening: "bg-purple-500 neon-fill--listening",
  vocabulary: "bg-amber-500 neon-fill--amber",
  grammar: "bg-slate-500 neon-fill--slate",
};

function computeCategorySegments(
  tasks: Array<{ category?: string; status?: string }>,
  totalFillPercent: number
) {
  const done = tasks.filter((t) => t.status === "completed");
  const totalDone = done.length;
  if (!totalDone || totalFillPercent <= 0) return [];

  const byCat: Record<string, number> = {};
  for (const t of done) {
    const key = t.category ?? "other";
    byCat[key] = (byCat[key] || 0) + 1;
  }

  return Object.entries(byCat).map(([category, count]) => ({
    category,
    width: Math.max(0, Math.min(100, Math.round((count / totalDone) * totalFillPercent))),
  }));
}

async function toggleTaskStatus(
  t: { id: string; status: string },
  updateFn: (id: string, updates: { progress?: number; status?: "planned" | "in-progress" | "completed"; completedAt?: string }) => Promise<any>,
  invalidate: () => Promise<void>
) {
  const next: "planned" | "in-progress" | "completed" = t.status === "completed" ? "planned" : "completed";
  await updateFn(t.id, { status: next });
  await invalidate();
}

export default function GlowingProgressCard({
  title = "Project Progress",
  percent,
  planType: planTypeProp,
  dueDateISO: dueProp,
  onEditDueDate,
  onPlanTypeChange,
  onAiSuggest,
  className,
}: GlowingProgressCardProps) {
  const clamped = clampPercent(percent);
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Local persistent state when uncontrolled
  const [planType, setPlanType] = useState<PlanType>(() => {
    if (planTypeProp) return planTypeProp;
    const raw = typeof window !== "undefined" ? localStorage.getItem(PLAN_LS_KEY) : null;
    return (raw as PlanType) || "daily";
  });
  const [dueISO, setDueISO] = useState<string | undefined>(() => {
    if (dueProp) return dueProp;
    return typeof window !== "undefined" ? localStorage.getItem(DUE_LS_KEY) || undefined : undefined;
  });
  const [editingDue, setEditingDue] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  // Sync controlled props if provided
  useEffect(() => {
    if (planTypeProp) setPlanType(planTypeProp);
  }, [planTypeProp]);
  useEffect(() => {
    if (dueProp) setDueISO(dueProp);
  }, [dueProp]);

  // Persist when uncontrolled
  useEffect(() => {
    if (!planTypeProp) {
      try {
        localStorage.setItem(PLAN_LS_KEY, planType);
      } catch {}
    }
  }, [planType, planTypeProp]);
  useEffect(() => {
    if (!dueProp) {
      try {
        if (dueISO) localStorage.setItem(DUE_LS_KEY, dueISO);
        else localStorage.removeItem(DUE_LS_KEY);
      } catch {}
    }
  }, [dueISO, dueProp]);

  const dueDisplay = useMemo(() => formatDueShort(dueISO), [dueISO]);

  const handlePlanType = (v: PlanType) => {
    setPlanType(v);
    onPlanTypeChange?.(v);
  };

  const handleDueInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // yyyy-mm-dd
    if (!value) {
      setDueISO(undefined);
      onEditDueDate?.("");
      return;
    }
    const iso = new Date(value + "T00:00:00").toISOString();
    setDueISO(iso);
    onEditDueDate?.(iso);
  };

  // Fetch tasks when expanded; map planType -> range
  const apiRange = planType === "daily" ? "daily" : "weekly";
  const { data: tasksRes } = useQuery({
    queryKey: ["glow-tasks", user?.id, apiRange],
    queryFn: () => (user ? progressApi.listTasks(user.id, apiRange, "all") : Promise.resolve({ tasks: [] })),
    enabled: !!user,
  });
  const tasks = tasksRes?.tasks ?? [];
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "completed").length;
  const derivedPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : clamped;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-6 md:p-7 frosted-card radial-tl",
        "text-white",
        className
      )}
      aria-expanded={isOpen}
      onClick={() => setIsOpen((v) => !v)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 text-white/80">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg md:text-xl font-medium text-white/90 tracking-tight">
              {title}
            </h3>

            {/* Plan Type pill with Select */}
            <div onClick={(e) => e.stopPropagation()}>
              <Select value={planType} onValueChange={(v) => handlePlanType(v as PlanType)}>
                <SelectTrigger className="h-7 rounded-full bg-white/10 border-white/10 text-white/90 px-3 py-1 text-xs font-medium backdrop-blur-sm hover:bg-white/15">
                <SelectValue placeholder="Plan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily plan</SelectItem>
                <SelectItem value="weekly">Weekly plan</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Actions: Add Task + AI Suggest */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            className="bg-white/10 hover:bg-white/15 text-white border-0 backdrop-blur-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
          <Button
            size="sm"
            onClick={() => onAiSuggest?.()}
            className="bg-white/10 hover:bg-white/15 text-white border-0 backdrop-blur-sm"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            AI Suggest
          </Button>
        </div>
      </div>

      {/* Massive percentage */}
      <div className="mt-5 md:mt-6">
        <div className="text-[44px] md:text-[64px] leading-none font-extrabold text-white/90 tracking-tight">
          {derivedPercent}
          <span className="text-white/70">%</span>
        </div>
      </div>

      {/* Glowing progress bar with due chip */}
      <div className="mt-6 md:mt-7">
        <div className="relative h-5 md:h-6 w-full rounded-full neon-track overflow-visible">
          <div
            className="h-full rounded-full overflow-hidden transition-all duration-500"
            style={{ width: `${derivedPercent}%` }}
          >
            {computeCategorySegments(tasks, derivedPercent).map((seg, i) => {
              const colorClass = CATEGORY_COLORS[seg.category] || "bg-gray-400 neon-fill";
              return (
                <div
                  key={`${seg.category}-${i}`}
                  className={`h-full inline-block ${colorClass}`}
                  style={{ width: `${seg.width}%` }}
                  title={`${seg.category} • ${seg.width}% of fill`}
                />
              );
            })}
          </div>
          {/* Due chip on right end of the bar */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-0">
            {!editingDue ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingDue(true);
                }}
                className="whitespace-nowrap select-none px-3 py-1 rounded-full text-xs md:text-sm bg-white/20 text-white/80 backdrop-blur-sm border border-white/25"
              >
                {dueISO ? `Due ${dueDisplay}` : "Set due date"}
              </button>
            ) : (
              <input
                autoFocus
                type="date"
                className="px-3 py-1 rounded-full text-xs md:text-sm bg-white/90 text-gray-900 border border-white/50 outline-none"
                value={toInputDate(dueISO)}
                onChange={handleDueInput}
                onBlur={() => setEditingDue(false)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") setEditingDue(false);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Task List Area */}
      <div
        className={cn(
          "transition-[max-height,opacity,margin] duration-500 ease-out overflow-hidden",
          isOpen ? "opacity-100 mt-6 md:mt-7" : "opacity-0 mt-0"
        )}
        style={{ maxHeight: isOpen ? 800 : 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-xl bg-white text-gray-900 dark:bg-neutral-900 dark:text-white border border-gray-100 dark:border-white/10 p-4 md:p-5 shadow-sm">
          

          {/* Checklist */}
          {totalTasks === 0 ? (
            <div className="text-sm text-gray-600 dark:text-gray-300 py-4">
              <div>No tasks yet. Add some to track progress.</div>
              <Button className="mt-3" size="sm" onClick={() => setAddOpen(true)}>
                Add Task
              </Button>
            </div>
          ) : (
            <ul className="mt-2 space-y-2">
              {tasks.map((t) => {
                const isDone = t.status === "completed";
                const isInProgress = t.status === "in_progress";
                return (
                  <li
                    key={t.id}
                    className="relative pl-4 border-l border-gray-200/70 dark:border-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        className="mt-0.5"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await toggleTaskStatus(
                              t,
                              progressApi.updateTask,
                              async () => {
                                await queryClient.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "glow-tasks" });
                                await queryClient.refetchQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "glow-tasks" });
                              }
                            );
                          } catch (err) {
                            // eslint-disable-next-line no-console
                            console.error("Failed to toggle task", err);
                          }
                        }}
                        aria-label={isDone ? "Mark as planned" : "Mark as completed"}
                        title={isDone ? "Mark as planned" : "Mark as completed"}
                      >
                        {isDone ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : isInProgress ? (
                          <CircleDot className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                          {t.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {t.category} · {t.estimatedMinutes ?? 0}m
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        defaultDueISO={toDateTimeLocal(dueISO)}
        onSubmit={async (data) => {
          if (!user) return;
          try {
            await progressApi.createTask({
              userId: user.id,
              name: data.name,
              category: data.category,
              difficulty: data.difficulty,
              estimatedMinutes: data.estimatedMinutes,
              dueAt: data.dueAt ? new Date(data.dueAt).toISOString() : undefined,
            });
            setAddOpen(false);
            await queryClient.invalidateQueries({
              predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "glow-tasks"
            });
            await queryClient.refetchQueries({
              predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "glow-tasks"
            });
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error("Failed to create task", e);
          }
        }}
      />
    </div>
  );
}


