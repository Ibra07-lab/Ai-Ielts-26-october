import { useEffect, useMemo, useState } from "react";
import { Sparkles, Wand2, CheckCircle, Circle, CircleDot, Plus, Calendar, Target } from "lucide-react";
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
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
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
  reading: "bg-gradient-to-r from-emerald-400 to-cyan-500 shadow-[0_0_15px_rgba(52,211,153,0.6)]",
  speaking: "bg-gradient-to-r from-rose-400 to-orange-500 shadow-[0_0_15px_rgba(251,113,133,0.6)]",
  writing: "bg-gradient-to-r from-blue-400 to-indigo-500 shadow-[0_0_15px_rgba(96,165,250,0.6)]",
  listening: "bg-gradient-to-r from-violet-400 to-fuchsia-500 shadow-[0_0_15px_rgba(167,139,250,0.6)]",
  vocabulary: "bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_15px_rgba(251,191,36,0.6)]",
  grammar: "bg-gradient-to-r from-slate-400 to-gray-500 shadow-[0_0_15px_rgba(148,163,184,0.6)]",
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
      } catch { }
    }
  }, [planType, planTypeProp]);
  useEffect(() => {
    if (!dueProp) {
      try {
        if (dueISO) localStorage.setItem(DUE_LS_KEY, dueISO);
        else localStorage.removeItem(DUE_LS_KEY);
      } catch { }
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
        "relative overflow-hidden rounded-3xl p-6 md:p-8 transition-all duration-300 group",
        "bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950",
        "border border-white/10 shadow-2xl shadow-indigo-500/10",
        className
      )}
      aria-expanded={isOpen}
      onClick={() => setIsOpen((v) => !v)}
    >
      {/* Background Effects */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:opacity-70 transition-opacity duration-500"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

      {/* Header */}
      <div className="relative flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight leading-none">
              {title}
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Track your goals</p>
          </div>
        </div>

        {/* Plan Type Selector */}
        <div onClick={(e) => e.stopPropagation()}>
          <Select value={planType} onValueChange={(v) => handlePlanType(v as PlanType)}>
            <SelectTrigger className="h-8 rounded-full bg-white/5 border-white/10 text-slate-200 px-3 text-xs font-medium hover:bg-white/10 hover:text-white transition-colors focus:ring-0 focus:ring-offset-0 w-[110px]">
              <SelectValue placeholder="Plan type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
              <SelectItem value="daily">Daily plan</SelectItem>
              <SelectItem value="weekly">Weekly plan</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Progress Area */}
      <div className="relative mt-8 z-10">
        <div className="flex items-end justify-between mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-indigo-200 tracking-tighter">
              {derivedPercent}
            </span>
            <span className="text-2xl font-medium text-indigo-200/60 mb-1">%</span>
          </div>
          <div className="text-right mb-2">
            <div className="text-sm font-medium text-slate-300">
              <span className="text-white font-bold">{doneTasks}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span className="text-slate-400">{totalTasks} tasks</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 w-full rounded-full bg-slate-950/50 ring-1 ring-white/5 overflow-hidden">
          <div
            className="absolute inset-0 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${derivedPercent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-20 blur-sm"></div>
          </div>

          <div className="relative h-full w-full flex rounded-full overflow-hidden">
            {computeCategorySegments(tasks, derivedPercent).map((seg, i) => {
              const colorClass = CATEGORY_COLORS[seg.category] || "bg-slate-500";
              return (
                <div
                  key={`${seg.category}-${i}`}
                  className={`h-full ${colorClass} transition-all duration-500 hover:brightness-110`}
                  style={{ width: `${seg.width}%` }}
                  title={`${seg.category} • ${seg.width}%`}
                />
              );
            })}
            {/* Fallback fill if no categories but percent > 0 */}
            {derivedPercent > 0 && tasks.filter(t => t.status === 'completed').length === 0 && (
              <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full" style={{ width: `${derivedPercent}%` }} />
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="relative mt-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            className="h-9 rounded-full bg-white text-slate-900 hover:bg-indigo-50 border-0 font-medium px-4 shadow-lg shadow-white/5 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Task
          </Button>
          <Button
            size="sm"
            onClick={() => onAiSuggest?.()}
            className="h-9 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 font-medium px-4 transition-all hover:text-indigo-200"
          >
            <Wand2 className="h-3.5 w-3.5 mr-1.5" />
            AI Suggest
          </Button>
        </div>

        {/* Due Date */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          {!editingDue ? (
            <button
              type="button"
              onClick={() => setEditingDue(true)}
              className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/5"
            >
              <Calendar className="h-3.5 w-3.5" />
              {dueISO ? dueDisplay : "Set due date"}
            </button>
          ) : (
            <input
              autoFocus
              type="date"
              className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-white border border-slate-700 outline-none focus:border-indigo-500 transition-colors"
              value={toInputDate(dueISO)}
              onChange={handleDueInput}
              onBlur={() => setEditingDue(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") setEditingDue(false);
              }}
            />
          )}
        </div>
      </div>

      {/* Expanded Task List Area */}
      <div
        className={cn(
          "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden",
          isOpen ? "max-h-[800px] opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl bg-slate-950/50 border border-white/5 p-1 backdrop-blur-md">
          {totalTasks === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-3 border border-slate-800">
                <Sparkles className="h-5 w-5 text-slate-500" />
              </div>
              <p className="text-sm text-slate-400 font-medium">No tasks yet</p>
              <p className="text-xs text-slate-500 mt-1">Add tasks to start tracking progress</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {tasks.map((t) => {
                const isDone = t.status === "completed";
                const isInProgress = t.status === "in_progress";
                return (
                  <li
                    key={t.id}
                    className="group relative overflow-hidden rounded-xl transition-all duration-200 hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3 p-3">
                      <button
                        type="button"
                        className="flex-shrink-0 transition-transform active:scale-90"
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
                            console.error("Failed to toggle task", err);
                          }
                        }}
                      >
                        {isDone ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                        ) : isInProgress ? (
                          <CircleDot className="h-5 w-5 text-indigo-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "text-sm font-medium transition-colors",
                          isDone ? "text-slate-500 line-through decoration-slate-600" : "text-slate-200 group-hover:text-white"
                        )}>
                          {t.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-medium border",
                            isDone
                              ? "bg-slate-900/50 border-slate-800 text-slate-600"
                              : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                          )}>
                            {t.category}
                          </span>
                          {t.estimatedMinutes && (
                            <span className="text-[10px] text-slate-500">
                              {t.estimatedMinutes}m
                            </span>
                          )}
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
            console.error("Failed to create task", e);
          }
        }}
      />
    </div>
  );
}
