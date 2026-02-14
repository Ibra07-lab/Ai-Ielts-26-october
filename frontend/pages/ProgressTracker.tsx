import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/contexts/UserContext";
import * as api from "@/api/progress";
import CircularProgress from "@/components/progress/CircularProgress";
import TaskCard from "@/components/progress/TaskCard";
import AddTaskModal from "@/components/progress/AddTaskModal";
import AISuggestDrawer from "@/components/progress/AISuggestDrawer";
import ProgressTrends from "@/components/progress/ProgressTrends";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Confetti from "@/components/progress/Confetti";
import backend from "@/backend";

export default function ProgressTracker() {
	const { user } = useUser();
	const qc = useQueryClient();
	const { toast } = useToast();

	const [range, setRange] = useState<api.SummaryRange>("weekly");
	const [filter, setFilter] = useState<"all" | "planned" | "in-progress" | "completed">("all");
	const [addOpen, setAddOpen] = useState(false);
	const [aiOpen, setAiOpen] = useState(false);
	const [celebrateTick, setCelebrateTick] = useState(0);

	const { data: dailyGoal } = useQuery({
		queryKey: ["daily-goal", user?.id],
		enabled: !!user,
		queryFn: () => backend.ielts.getDailyGoal({ userId: user!.id }),
	});
	const { data: overview } = useQuery({
		queryKey: ["progress-overview", user?.id],
		enabled: !!user,
		queryFn: () => backend.ielts.getProgress({ userId: user!.id }),
	});

	const { data: summary } = useQuery({
		queryKey: ["progress-summary", user?.id, range],
		enabled: !!user,
		queryFn: () => api.getSummary(user!.id, range),
	});

	const { data: tasksData } = useQuery({
		queryKey: ["progress-tasks", user?.id, range, filter],
		enabled: !!user,
		queryFn: () => api.listTasks(user!.id, range === "daily" ? "daily" : "weekly", filter),
	});

	const createTask = useMutation({
		mutationFn: api.createTask,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["progress-tasks"] });
			qc.invalidateQueries({ queryKey: ["progress-summary"] });
			toast({ title: "Task added" });
		},
	});
	const updateTask = useMutation({
		mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof api.updateTask>[1] }) => api.updateTask(id, updates),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["progress-tasks"] });
			qc.invalidateQueries({ queryKey: ["progress-summary"] });
		},
	});
	const delTask = useMutation({
		mutationFn: api.deleteTask,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["progress-tasks"] });
			qc.invalidateQueries({ queryKey: ["progress-summary"] });
		},
	});

	const percent = summary?.percent ?? 0;
	const tasks = tasksData?.tasks ?? [];
	const dueISO = useMemo(() => new Date().toISOString().slice(0, 16), []);

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-muted-foreground">Please set up your profile to use Progress Tracker.</p>
			</div>
		);
	}

	return (
		<div className="pb-24 space-y-8">
			<Confetti trigger={celebrateTick} />

			{/* Flat Today's Study Goal */}
			<div className="py-12 border-b border-border">
				{(() => {
					const completed = dailyGoal?.completedMinutes ?? 0;
					const target = dailyGoal?.targetMinutes ?? 30;
					const pct = target > 0 ? Math.round((completed / target) * 100) : 0;
					return (
						<div className="space-y-8">
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Today's Study Goal</h2>
									<div className="flex items-center gap-3">
										<span className="text-4xl font-black text-foreground tabular-nums">{completed} / {target}</span>
										<span className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-50">Minutes</span>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<div className="text-right hidden sm:block">
										<div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
											🔥 {overview?.studyStreak ?? 0} Day Streak
										</div>
									</div>
									<Button
										size="sm"
										onClick={() => setAddOpen(true)}
										className="bg-foreground text-background hover:bg-foreground/90 rounded-none h-10 px-6 font-bold"
									>
										<Plus className="h-4 w-4 mr-2" />
										Add Task
									</Button>
								</div>
							</div>

							<div className="relative h-1 w-full bg-muted rounded-full overflow-hidden">
								<div
									className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-1000"
									style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex gap-8">
									<div>
										<div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Target</div>
										<div className="text-sm font-bold text-foreground">Band {user.targetBand}</div>
									</div>
									<div>
										<div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Status</div>
										<div className="text-sm font-bold text-foreground">{pct}% Complete</div>
									</div>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setAiOpen(true)}
									className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground h-8 px-4"
								>
									<Wand2 className="h-3.5 w-3.5 mr-2" />
									AI Refresh
								</Button>
							</div>
						</div>
					);
				})()}
			</div>

			<div className="flex flex-col items-center gap-8 my-16 border-b border-border pb-16">
				<CircularProgress percent={percent} />
				<Button onClick={() => setAddOpen(true)} className="rounded-none px-10 h-12 font-black uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all">
					<Plus className="h-4 w-4 mr-2" />
					Compose New Task
				</Button>
			</div>

			<div className="flex items-center justify-between py-6">
				<div className="flex items-center gap-8">
					<div className="flex gap-1 border-b border-border">
						{["daily", "weekly", "monthly"].map((r) => (
							<button
								key={r}
								className={`text-[10px] font-black uppercase tracking-[0.2em] h-10 px-4 transition-all border-b-2 ${range === r ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
								onClick={() => setRange(r as any)}
							>
								{r}
							</button>
						))}
					</div>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setAiOpen(true)}
					className="h-9 px-6 rounded-none border-border font-bold hover:bg-muted"
				>
					<Wand2 className="h-3.5 w-3.5 mr-2 text-primary" />
					AI Refresh
				</Button>
			</div>

			<Tabs defaultValue="all" onValueChange={(v) => setFilter(v as any)} className="w-full">
				<TabsList className="bg-transparent w-full flex gap-10 p-0 h-auto mb-10 border-b border-border">
					{["all", "planned", "in-progress", "completed"].map((v) => (
						<TabsTrigger
							key={v}
							value={v}
							className="bg-transparent p-0 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground data-[state=active]:text-foreground border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-12 transition-all"
						>
							{v.replace("-", " ")}
						</TabsTrigger>
					))}
				</TabsList>
				<TabsContent value="all" className="mt-0">
					<TaskGroupCard tasks={tasks} onToggle={(t) => {
						if (t.status === "completed") {
							updateTask.mutate({ id: t.id, updates: { status: "planned", completedAt: undefined, progress: 0 } });
						} else {
							updateTask.mutate({ id: t.id, updates: { status: "completed", completedAt: new Date().toISOString(), progress: 100 } });
							setCelebrateTick((x) => x + 1);
						}
					}} />
				</TabsContent>
				<TabsContent value="planned" className="mt-0">
					<TaskGroupCard tasks={tasks.filter(t => t.status === "planned")} onToggle={(t) => { updateTask.mutate({ id: t.id, updates: { status: "completed", completedAt: new Date().toISOString(), progress: 100 } }); setCelebrateTick((x) => x + 1); }} />
				</TabsContent>
				<TabsContent value="in-progress" className="mt-0">
					<TaskGroupCard tasks={tasks.filter(t => t.status === "in_progress")} onToggle={(t) => { updateTask.mutate({ id: t.id, updates: { status: "completed", completedAt: new Date().toISOString(), progress: 100 } }); setCelebrateTick((x) => x + 1); }} />
				</TabsContent>
				<TabsContent value="completed" className="mt-0">
					<TaskGroupCard tasks={tasks.filter(t => t.status === "completed")} onToggle={(t) => updateTask.mutate({ id: t.id, updates: { status: "planned", completedAt: undefined, progress: 0 } })} />
				</TabsContent>
			</Tabs>

			<div className="pt-8 border-t border-border">
				<p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Weekly trend</p>
				<div className="h-16 flex items-center">
					<ProgressTrends data={[2, 3, 4, 3, 5, 6, 4]} />
				</div>
			</div>

			<Button
				className="fixed bottom-10 right-10 rounded-none h-14 px-10 font-black uppercase tracking-[0.2em] bg-foreground text-background hover:bg-foreground/90 transition-all z-50 border-2 border-background"
				onClick={() => setAiOpen(true)}
			>
				<Wand2 className="h-5 w-5 mr-3" />
				AI Architect
			</Button>
			<AddTaskModal
				open={addOpen}
				onClose={() => setAddOpen(false)}
				onSubmit={(d) => {
					createTask.mutate({
						userId: user.id,
						name: d.name,
						category: d.category,
						difficulty: d.difficulty,
						estimatedMinutes: d.estimatedMinutes,
						dueAt: d.dueAt,
					});
				}}
				defaultDueISO={dueISO}
			/>

			<AISuggestDrawer
				open={aiOpen}
				onClose={() => setAiOpen(false)}
				initialRange={range}
				onGenerate={async ({ range, timeAvailableMinutes }) => {
					const res = await api.generateSuggestions({ userId: user.id, range, timeAvailableMinutes });
					return res.suggestions;
				}}
				onAccept={async (suggestions) => {
					await api.acceptSuggestions({ userId: user.id, suggestions });
					qc.invalidateQueries({ queryKey: ["progress-tasks"] });
					qc.invalidateQueries({ queryKey: ["progress-summary"] });
					toast({ title: "AI plan added" });
				}}
			/>
		</div>
	);
}

function TaskGroupCard({ tasks, onToggle }: { tasks: api.Task[]; onToggle: (t: api.Task) => void }) {
	const completed = tasks.filter(t => t.status === "completed").length;
	const total = tasks.length;
	const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

	if (!tasks.length) {
		return (
			<div className="py-20 text-center border-t border-dashed border-border">
				<p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-30">No tasks active</p>
			</div>
		);
	}

	return (
		<div className="space-y-12">
			<div className="flex items-end justify-between border-b border-border pb-6">
				<div className="space-y-2">
					<h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.4em]">Task Inventory</h3>
					<div className="text-xs font-bold text-muted-foreground opacity-50">{completed} of {total} items resolved</div>
				</div>
				<div className="flex items-center gap-6">
					<div className="w-48 h-1 bg-muted rounded-full overflow-hidden hidden sm:block">
						<div className="h-full bg-primary transition-all duration-1000" style={{ width: `${percent}%` }} />
					</div>
					<span className="text-xl font-black text-foreground tabular-nums">{percent}%</span>
				</div>
			</div>

			<div className="divide-y divide-border">
				{tasks.map((t) => (
					<div key={t.id} className="py-2">
						<TaskCard task={t} onToggleComplete={onToggle} />
					</div>
				))}
			</div>
		</div>
	);
}
