import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles, Wand2, CheckCircle, Circle, CircleDot, Plus, Calendar, Target, Trash2, BookOpen, PenTool, Mic, Headphones, Book, AlignLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/contexts/UserContext";
import * as progressApi from "@/api/progress";
import AddTaskModal from "@/components/progress/AddTaskModal";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

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

const CATEGORY_ICONS: Record<string, any> = {
  reading: BookOpen,
  writing: PenTool,
  speaking: Mic,
  listening: Headphones,
  vocabulary: Book,
  grammar: AlignLeft,
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
  const { user, session } = useUser();
  const { theme } = useTheme();
  const navigate = useNavigate();
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

  // Fetch manual tasks when expanded; map planType -> range
  const apiRange = planType === "daily" ? "daily" : "weekly";
  const { data: tasksRes } = useQuery({
    queryKey: ["glow-tasks", user?.id, apiRange],
    queryFn: () => (user ? progressApi.listTasks(user.id, apiRange, "all") : Promise.resolve({ tasks: [] })),
    enabled: !!user,
  });
  const manualTasks = tasksRes?.tasks ?? [];

  // ── Fetch today's Roadmap tasks from the study plan ──
  const { data: studyPlan } = useQuery({
    queryKey: ["study-plan-today", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const API_BASE = import.meta.env.VITE_FASTAPI_WRITING_URL || "";
      const res = await fetch(`${API_BASE}/api/onboarding/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // cache for 5 min
  });

  // Track roadmap task completion in localStorage
  const ROADMAP_DONE_KEY = `roadmap_done_${user?.id || "anonymous"}`;
  const [roadmapDone, setRoadmapDone] = useState<Set<string>>(new Set());

  // Load from local storage once user id is known
  useEffect(() => {
    if (!user?.id) return;
    const key = `roadmap_done_${user.id}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) setRoadmapDone(new Set(JSON.parse(raw)));
    } catch {}
  }, [user?.id]);

  const toggleRoadmapDone = (id: string) => {
    setRoadmapDone(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem(`roadmap_done_${user?.id || "anonymous"}`, JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  // Extract today's tasks from the study plan (week 1, grouped into days of ~3 tasks)
  const roadmapTasks = useMemo(() => {
    if (!studyPlan?.weeks?.length) return [];
    const week1 = studyPlan.weeks[0];
    if (!week1?.tasks?.length) return [];
    
    // Group tasks into days of 3 (same as Roadmap.tsx)
    const allTasks = week1.tasks;
    const tasksPerDay = 3;
    const now = new Date();
    const currentHour = now.getHours();
    // After 12pm, show tomorrow's tasks
    const effectiveDay = currentHour >= 12 ? (now.getDay() + 1) % 7 : now.getDay();
    // Map to 0-indexed day (Mon=0, Tue=1, ..., Sun=6)
    const dayIndex = effectiveDay === 0 ? 6 : effectiveDay - 1;
    
    const startIdx = dayIndex * tasksPerDay;
    const todaySlice = allTasks.slice(startIdx, startIdx + tasksPerDay);
    
    // If no tasks for today (weekend or plan is short), fall back to first chunk
    const displayTasks = todaySlice.length > 0 ? todaySlice : allTasks.slice(0, tasksPerDay);
    
    return displayTasks.map((t: any, i: number) => ({
      id: `roadmap-${week1.week_number || 1}-d${dayIndex}-${i}`,
      userId: user?.id || "",
      name: t.title || t.description || "Study Task",
      category: (t.skill || t.type || "reading") as any,
      difficulty: "medium" as const,
      status: roadmapDone.has(`roadmap-${week1.week_number || 1}-d${dayIndex}-${i}`) ? "completed" : "planned",
      estimatedMinutes: t.duration || t.minutes || 20,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueAt: new Date().toISOString(),
      _isRoadmap: true,
    }));
  }, [studyPlan, roadmapDone, user?.id]);

  // Merge: roadmap tasks first, then manual tasks
  const tasks = [...roadmapTasks, ...manualTasks];
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "completed").length;
  const derivedPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : clamped;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl p-6 md:p-8 transition-all duration-300 group",
        theme === "dark"
          ? "bg-slate-900 border border-white/10 shadow-2xl shadow-indigo-500/10"
          : "bg-white/40 backdrop-blur-xl border border-white/50 shadow-sm",
        className
      )}
      aria-expanded={isOpen}
      onClick={() => setIsOpen((v) => !v)}
    >
      {/* Background Effects (Removed for a cleaner look) */}

      {/* Header */}
      <div className="relative flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 bg-slate-100 dark:bg-white/5 rounded-2xl ring-1 ring-slate-200 dark:ring-white/10 shrink-0">
            <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className={cn(
              "text-lg font-semibold tracking-tight leading-none",
              theme === "dark" ? "text-white" : "text-slate-900"
            )}>
              {title}
            </h3>
            <p className={cn(
              "text-xs font-bold mt-1",
              theme === "dark" ? "text-slate-300" : "text-slate-500"
            )}>
              Track your goals
            </p>
          </div>
        </div>

      </div>

      {/* Main Progress Area */}
      <div className="relative mt-8 z-10">
        <div className="flex items-end justify-between mb-4">
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "text-6xl font-bold tracking-tighter",
              theme === "dark" ? "text-white" : "text-slate-900"
            )}>
              {derivedPercent}
            </span>
            <span className={cn(
              "text-2xl font-bold mb-1",
              theme === "dark" ? "text-indigo-200" : "text-slate-400"
            )}>%</span>
          </div>
          <div className="text-right mb-2">
            <div className={cn(
              "text-sm font-bold",
              theme === "dark" ? "text-cyan-200" : "text-indigo-600"
            )}>
              <span className={cn("font-black", theme === "dark" ? "text-cyan-100" : "text-indigo-700")}>{doneTasks}</span>
              <span className={cn("mx-1", theme === "dark" ? "text-cyan-400/80" : "text-indigo-400")}>/</span>
              <span className={cn(theme === "dark" ? "text-cyan-200" : "text-indigo-500")}>{totalTasks} tasks</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={cn("relative h-4 w-full rounded-full ring-1 overflow-hidden shadow-inner", theme === "dark" ? "bg-slate-800/80 ring-white/5" : "bg-slate-200/50 ring-black/5")}>
          {/* Visual Gradient Background Layer */}
          <div
            className="absolute inset-0 rounded-full transition-all duration-[4000ms] ease-in-out bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#a855f7]"
            style={{ width: `${derivedPercent}%` }}
          />

          {/* Glowing blur intentionally removed for cleaner look */}

          {/* Interactive Segments Layer (Transparent) */}
          <div className="relative h-full w-full flex rounded-full overflow-hidden">
            {computeCategorySegments(tasks, derivedPercent)
              .sort((a, b) => a.category.localeCompare(b.category))
              .map((seg, i) => {
                return (
                  <div
                    key={`${seg.category}`}
                    className="h-full bg-transparent transition-colors duration-300 hover:bg-white/20 cursor-help"
                    style={{ width: `${seg.width}%` }}
                    title={`${seg.category} • ${seg.width}%`}
                  />
                );
              })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="relative mt-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            className={cn(
              "h-9 rounded-full border-0 font-medium px-4 shadow-lg transition-all hover:scale-105 active:scale-95",
              theme === "dark"
                ? "bg-white text-slate-900 hover:bg-indigo-50 shadow-white/5"
                : "bg-slate-900 text-white hover:bg-black shadow-black/5"
            )}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Task
          </Button>
          <Button
            size="sm"
            onClick={() => onAiSuggest?.()}
            className={cn(
              "h-9 rounded-full border font-medium px-4 transition-all",
              theme === "dark"
                ? "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/20 hover:text-indigo-200"
                : "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 border-indigo-500/20 hover:text-indigo-700"
            )}
          >
            <Wand2 className="h-3.5 w-3.5 mr-1.5" />
            AI Suggest
          </Button>
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
        <div className={cn(
          "rounded-2xl border p-1 backdrop-blur-md shadow-sm mt-4",
          theme === "dark" ? "bg-slate-950/50 border-white/5" : "bg-white/60 border-white/40"
        )}>
          {totalTasks === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-3 border",
                theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"
              )}>
                <Sparkles className={cn("h-5 w-5", theme === "dark" ? "text-slate-500" : "text-slate-300")} />
              </div>
              <p className={cn("text-sm font-medium", theme === "dark" ? "text-slate-400" : "text-slate-600")}>No tasks yet</p>
              <p className={cn("text-xs mt-1", theme === "dark" ? "text-slate-500" : "text-slate-400")}>Add tasks to start tracking progress</p>
            </div>
          ) : (
            <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {tasks.map((t) => {
                const isDone = t.status === "completed";
                const isInProgress = t.status === "in_progress";
                const Icon = CATEGORY_ICONS[t.category] || Target;

                return (
                  <li
                    key={t.id}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl transition-all duration-300 border",
                      theme === "dark"
                        ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 hover:shadow-lg hover:shadow-indigo-500/10"
                        : "bg-white border-slate-100 hover:border-indigo-100 hover:shadow-md hover:-translate-y-0.5"
                    )}
                  >
                    <div className={cn(
                      "flex items-center gap-4 p-4 md:p-5 transition-opacity",
                      isDone ? "opacity-60 grayscale hover:grayscale-0 hover:opacity-100" : "opacity-100"
                    )}>
                      <button
                        type="button"
                        className={cn(
                          "flex-shrink-0 transition-transform active:scale-95",
                          isDone ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                        )}
                        onClick={async (e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          // Roadmap tasks use localStorage, manual tasks use API
                          if ((t as any)._isRoadmap) {
                            toggleRoadmapDone(t.id);
                            return;
                          }
                          try {
                            const nextStatus = isDone ? "planned" : "completed";
                            // Optimistic Update
                            queryClient.setQueryData<any>(["glow-tasks", user?.id, apiRange], (old: any) => {
                              if (!old || !old.tasks) return old;
                              return {
                                ...old,
                                tasks: old.tasks.map((task: any) =>
                                  task.id === t.id ? { ...task, status: nextStatus } : task
                                )
                              };
                            });

                            await progressApi.updateTask(t.id, { status: nextStatus });
                            await queryClient.invalidateQueries({
                              predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "glow-tasks"
                            });
                          } catch (err) {
                            console.error("Failed to toggle task", err);
                            // Revert on error
                            await queryClient.invalidateQueries({
                              predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "glow-tasks"
                            });
                          }
                        }}
                      >
                        {isDone ? (
                          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                          </div>
                        ) : isInProgress ? (
                          <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <CircleDot className="h-5 w-5 text-indigo-500" />
                          </div>
                        ) : (
                          <div className={cn(
                            "h-8 w-8 rounded-full border-2 flex items-center justify-center transition-colors",
                            theme === "dark" ? "border-slate-700 group-hover:border-slate-500" : "border-slate-300 group-hover:border-indigo-300"
                          )}>
                            <Circle className={cn("h-5 w-5 transition-colors opacity-0 group-hover:opacity-100", theme === "dark" ? "text-slate-500" : "text-indigo-300")} />
                          </div>
                        )}
                      </button>

                      {/* Icon Box */}
                      <div className={cn(
                        "hidden sm:flex items-center justify-center w-12 h-12 rounded-xl",
                        theme === "dark" ? "bg-white/5" : "bg-slate-50"
                      )}>
                        <Icon className={cn("h-6 w-6", theme === "dark" ? "text-slate-400" : "text-slate-500")} />
                      </div>

                      <div className="flex-1 min-w-0 py-1">
                        <div className={cn(
                          "text-lg font-semibold transition-colors mb-1.5",
                          isDone
                            ? (theme === "dark" ? "text-slate-500 line-through decoration-slate-600" : "text-slate-400 line-through decoration-slate-300")
                            : (theme === "dark" ? "text-slate-100 group-hover:text-white" : "text-slate-800 group-hover:text-indigo-900")
                        )}>
                          {t.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border",
                            isDone
                              ? (theme === "dark" ? "bg-slate-900/50 border-slate-800 text-slate-600" : "bg-slate-100 border-slate-200 text-slate-400")
                              : "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                          )}>
                            <Icon className="h-3 w-3" />
                            <span className="capitalize">{t.category} Module</span>
                          </span>

                          {t.estimatedMinutes && (
                            <span className={cn(
                              "text-xs font-medium flex items-center gap-1",
                              theme === "dark" ? "text-slate-500" : "text-slate-500"
                            )}>
                              <span className="w-1 h-1 rounded-full bg-slate-500 inline-block" />
                              {t.estimatedMinutes} min
                            </span>
                          )}

                          {t.dueAt && (
                            <span className={cn(
                              "text-xs font-medium flex items-center gap-1",
                              theme === "dark" ? "text-slate-500" : "text-slate-500"
                            )}>
                              <span className="w-1 h-1 rounded-full bg-slate-500 inline-block" />
                              {new Date(t.dueAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>

                      {!(t as any)._isRoadmap && (
                      <button
                        type="button"
                        className={cn(
                          "opacity-0 group-hover:opacity-100 transition-all p-2.5 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 hover:scale-110 mr-2",
                          theme === "dark" ? "text-slate-600" : "text-slate-300"
                        )}
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await progressApi.deleteTask(t.id);
                            await queryClient.invalidateQueries({
                              predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "glow-tasks"
                            });
                          } catch (err) {
                            console.error("Failed to delete task", err);
                          }
                        }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Add Task Modal via Portal to avoid CSS constraints */}
      {typeof document !== 'undefined' && createPortal(
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
                dueAt: data.dueAt ? new Date(new Date(data.dueAt).setHours(0, 0, 0, 0)).toISOString() : new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              });
              setAddOpen(false);
              await queryClient.invalidateQueries({ queryKey: ["glow-tasks"] });
            } catch (e) {
              console.error("Failed to create task", e);
            }
          }}
        />,
        document.body
      )}
    </div>
  );
}
