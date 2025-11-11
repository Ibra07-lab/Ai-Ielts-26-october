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
import backend from "~backend/client";

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
				<p className="text-gray-600 dark:text-gray-300">Please set up your profile to use Progress Tracker.</p>
			</div>
		);
	}

	return (
		<div className="pb-24">
			<Confetti trigger={celebrateTick} />
			{/* Today's Study Goal Card - Green gradient */}
			<Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-900">
				<CardContent className="px-6 py-6">
					{(() => {
						const completed = dailyGoal?.completedMinutes ?? 0;
						const target = dailyGoal?.targetMinutes ?? 30;
						const pct = target > 0 ? Math.round((completed / target) * 100) : 0;
						const due = new Date().toLocaleDateString(undefined, { month: "long", day: "numeric" });
						return (
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="text-base font-semibold text-gray-900 dark:text-white">
										🎯 Today's Study Goal
									</div>
									<div className="flex items-center gap-2">
										<div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium">
											Daily plan
										</div>
										<Button
											size="sm"
											onClick={() => setAddOpen(true)}
											className="bg-green-600 hover:bg-green-700 text-white border-0"
										>
											<Plus className="h-3 w-3 mr-1" />
											Add Task
										</Button>
									</div>
								</div>
								
								<div className="text-sm text-gray-700 dark:text-gray-300">
									Target: Band {user.targetBand}
								</div>
								
								<div>
									<div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Study Progress</div>
									<div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
										{completed} / {target} minutes
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
										{pct}% complete • {completed} min completed
									</div>
									
									<div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
										<div
											className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
											style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
										/>
									</div>
								</div>
								
								<div className="flex items-center justify-between pt-2 border-t border-green-200 dark:border-green-900">
									<div className="text-sm text-gray-700 dark:text-gray-300">
										🔥 {overview?.studyStreak ?? 0} days streak
									</div>
									<Button
										size="sm"
										variant="ghost"
										onClick={() => setAiOpen(true)}
										className="text-green-700 hover:text-green-900 hover:bg-green-100 dark:text-green-300 dark:hover:text-green-100 dark:hover:bg-green-900/30"
									>
										<Wand2 className="h-3 w-3 mr-1" />
										AI Suggest
									</Button>
								</div>
							</div>
						);
					})()}
				</CardContent>
			</Card>

			<div className="flex flex-col items-center gap-4 my-6">
				<CircularProgress percent={percent} />
				<Button onClick={() => setAddOpen(true)}>
					<Plus className="h-4 w-4 mr-2" />
					Add Task / Generate with AI
				</Button>
			</div>

			<Card className="mb-6">
				<CardContent className="p-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Badge variant="secondary">Range</Badge>
						<div className="flex gap-2">
							<Button variant={range === "daily" ? "default" : "outline"} size="sm" onClick={() => setRange("daily")}>Daily</Button>
							<Button variant={range === "weekly" ? "default" : "outline"} size="sm" onClick={() => setRange("weekly")}>Weekly</Button>
							<Button variant={range === "monthly" ? "default" : "outline"} size="sm" onClick={() => setRange("monthly")}>Monthly</Button>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm" onClick={() => setAiOpen(true)}>
							<Wand2 className="h-4 w-4 mr-2" />
							AI Suggest
						</Button>
					</div>
				</CardContent>
			</Card>

			<Tabs defaultValue="all" onValueChange={(v) => setFilter(v as any)}>
				<TabsList className="grid grid-cols-4 w-full mb-4">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="planned">Planned</TabsTrigger>
					<TabsTrigger value="in-progress">In Progress</TabsTrigger>
					<TabsTrigger value="completed">Completed</TabsTrigger>
				</TabsList>
				<TabsContent value="all">
					<TaskGroupCard tasks={tasks} onToggle={(t) => {
						if (t.status === "completed") {
							updateTask.mutate({ id: t.id, updates: { status: "planned", completedAt: undefined, progress: 0 } });
						} else {
							updateTask.mutate({ id: t.id, updates: { status: "completed", completedAt: new Date().toISOString(), progress: 100 } });
							setCelebrateTick((x) => x + 1);
						}
					}} />
				</TabsContent>
				<TabsContent value="planned">
					<TaskGroupCard tasks={tasks.filter(t => t.status === "planned")} onToggle={(t) => { updateTask.mutate({ id: t.id, updates: { status: "completed", completedAt: new Date().toISOString(), progress: 100 } }); setCelebrateTick((x)=>x+1); }} />
				</TabsContent>
				<TabsContent value="in-progress">
					<TaskGroupCard tasks={tasks.filter(t => t.status === "in_progress")} onToggle={(t) => { updateTask.mutate({ id: t.id, updates: { status: "completed", completedAt: new Date().toISOString(), progress: 100 } }); setCelebrateTick((x)=>x+1); }} />
				</TabsContent>
				<TabsContent value="completed">
					<TaskGroupCard tasks={tasks.filter(t => t.status === "completed")} onToggle={(t) => updateTask.mutate({ id: t.id, updates: { status: "planned", completedAt: undefined, progress: 0 } })} />
				</TabsContent>
			</Tabs>

			<div className="mt-6">
				<p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Weekly trend</p>
				<ProgressTrends data={[2, 3, 4, 3, 5, 6, 4]} />
			</div>

			{/* Floating FAB */}
			<Button
				className="fixed bottom-6 right-6 rounded-full shadow-lg"
				onClick={() => setAiOpen(true)}
				aria-label="AI Suggest"
			>
				<Wand2 className="h-5 w-5 mr-2" />
				Get AI Plan
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
			<Card>
				<CardContent className="p-8 text-center">
					<p className="text-gray-600 dark:text-gray-300">No tasks yet.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-gray-200 dark:border-gray-700">
			<CardContent className="p-6">
				{/* Header with icon, title, progress count, progress bar, percentage */}
				<div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
					<div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
						<div className="w-5 h-5 rounded border-2 border-gray-400 dark:border-gray-500" />
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-3 mb-2">
							<span className="text-base font-semibold text-gray-900 dark:text-white">Study Tasks</span>
							<span className="text-xs text-gray-500 dark:text-gray-400">{completed} of {total}</span>
							<div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
								<div
									className="h-full bg-green-500 transition-all duration-300"
									style={{ width: `${percent}%` }}
								/>
							</div>
							<span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">{percent}%</span>
						</div>
					</div>
				</div>

				{/* Task list */}
				<div className="space-y-0">
					{tasks.map((t) => (
						<TaskCard key={t.id} task={t} onToggleComplete={onToggle} />
					))}
				</div>
			</CardContent>
		</Card>
	);
}



