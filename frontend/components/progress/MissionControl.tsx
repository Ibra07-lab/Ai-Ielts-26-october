import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, BrainCircuit, CheckCircle2, Circle, Trash2, Crosshair, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { listTasks, createTask, updateTask, deleteTask, generateSuggestions, acceptSuggestions, Task } from "@/api/progress";
import { useUser } from "../../contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function MissionControl() {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [newTaskName, setNewTaskName] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const { data: tasksData } = useQuery({
        queryKey: ["glow-tasks", user?.id, "daily", "all"],
        queryFn: () => user ? listTasks(user.id, "daily", "all") : { tasks: [] },
        enabled: !!user,
    });

    const tasks = tasksData?.tasks || [];
    const plannedTasks = tasks.filter(t => t.status !== "completed");
    const completedTasks = tasks.filter(t => t.status === "completed");

    const createMutation = useMutation({
        mutationFn: (name: string) => createTask({
            userId: user!.id,
            name,
            category: "reading", // Default for quick add
            difficulty: "medium",
            dueAt: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["glow-tasks"] });
            setNewTaskName("");
            toast({ title: "Objective Added", description: "Tactical objective logged." });
        },
    });

    const toggleMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: "planned" | "completed" }) =>
            updateTask(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["glow-tasks"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["glow-tasks"] });
        },
    });

    const handleGenerate = async () => {
        if (!user) return;
        setIsGenerating(true);
        try {
            // 1. Generate
            const { suggestions } = await generateSuggestions({
                userId: user.id,
                range: "daily",
                timeAvailableMinutes: 60,
            });

            // 2. Accept (Auto-add for now for smooth UX)
            await acceptSuggestions({ userId: user.id, suggestions });

            queryClient.invalidateQueries({ queryKey: ["glow-tasks"] });
            toast({
                title: "Tactical Analysis Complete",
                description: `${suggestions.length} missions added to your log.`,
            });
        } catch (e) {
            toast({ title: "Analysis Failed", description: "Could not generate missions.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAdd = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newTaskName.trim()) return;
        createMutation.mutate(newTaskName);
    };

    return (
        <div className="flex flex-col h-full bg-background border border-border p-6 relative overflow-hidden group">
            {/* Decorator Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <Crosshair className="w-6 h-6 text-cyan-500" />
                        Mission<span className="text-muted-foreground">Log</span>
                    </h3>
                    <p className="text-[10px] font-mono tracking-widest text-muted-foreground mt-1 text-cyan-500/80">
                    // DAILY TACTICAL OPERATIONS
                    </p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="border-cyan-500/20 hover:border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 uppercase tracking-widest text-[10px] font-black h-8"
                >
                    {isGenerating ? <BrainCircuit className="w-3 h-3 mr-2 animate-pulse" /> : <Sparkles className="w-3 h-3 mr-2" />}
                    {isGenerating ? "Analyzing..." : "Auto-Intel"}
                </Button>
            </div>

            {/* Input */}
            <form onSubmit={handleAdd} className="flex gap-2 mb-8">
                <div className="relative flex-grow">
                    <Input
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        placeholder="ENTER OBJECTIVE COORDINATES..."
                        className="bg-muted/20 border-border rounded-none focus-visible:ring-cyan-500 font-mono text-xs tracking-wider h-10 pl-4 uppercase placeholder:text-muted-foreground/50"
                    />
                    <div className="absolute right-0 top-0 h-full w-1 bg-cyan-500/50" />
                </div>
                <Button
                    type="submit"
                    className="rounded-none bg-foreground text-background hover:bg-cyan-500 hover:text-white transition-colors w-10 p-0"
                    disabled={!newTaskName.trim()}
                >
                    <Plus className="w-5 h-5" />
                </Button>
            </form>

            {/* Mission List */}
            <div className="flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
                <AnimatePresence mode="popLayout">
                    {plannedTasks.length === 0 && completedTasks.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-center py-10 border border-dashed border-border"
                        >
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">No Active Missions</p>
                        </motion.div>
                    )}

                    {plannedTasks.map((task) => (
                        <MissionItem
                            key={task.id}
                            task={task}
                            onToggle={() => toggleMutation.mutate({ id: task.id, status: "completed" })}
                            onDelete={() => deleteMutation.mutate(task.id)}
                        />
                    ))}

                    {completedTasks.length > 0 && (
                        <div className="pt-4 mt-4 border-t border-dashed border-border/50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 opacity-50">Mission Debrief (Completed)</p>
                            {completedTasks.map((task) => (
                                <MissionItem
                                    key={task.id}
                                    task={task}
                                    onToggle={() => toggleMutation.mutate({ id: task.id, status: "planned" })}
                                    onDelete={() => deleteMutation.mutate(task.id)}
                                    completed
                                />
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function MissionItem({ task, onToggle, onDelete, completed = false }: { task: Task, onToggle: () => void, onDelete: () => void, completed?: boolean }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`group/item flex items-center justify-between p-3 border border-l-2 transition-all ${completed ? "bg-muted/10 border-border border-l-emerald-500/50 opacity-60" : "bg-background border-border border-l-cyan-500 hover:border-cyan-500/50 hover:bg-muted/20"}`}
        >
            <div className="flex items-center gap-4 overflow-hidden">
                <button onClick={onToggle} className="text-muted-foreground hover:text-cyan-500 transition-colors">
                    {completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
                </button>
                <div className="overflow-hidden">
                    <p className={`text-xs font-bold uppercase tracking-wider truncate ${completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {task.name}
                    </p>
                    <div className="flex gap-2 text-[9px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5">
                        <span className={task.category === 'reading' ? 'text-blue-400' : 'text-orange-400'}>{task.category}</span>
                        <span>//{task.difficulty}</span>
                        <span>[{task.estimatedMinutes}m]</span>
                    </div>
                </div>
            </div>

            <button
                onClick={onDelete}
                className="opacity-0 group-hover/item:opacity-100 transition-opacity text-muted-foreground hover:text-cyan-500 p-1"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
