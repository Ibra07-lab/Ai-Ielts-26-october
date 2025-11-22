import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, Plus, Sparkles, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyGoalCardProps {
    tasks: {
        listening: number;
        reading: number;
        writing: number;
        speaking: number;
        vocabulary: number;
    };
    dailyGoal?: number;
}

export default function DailyGoalCard({ tasks, dailyGoal = 5 }: DailyGoalCardProps) {
    const totalTasks = Object.values(tasks).reduce((a, b) => a + b, 0);
    const progressPercentage = Math.min(Math.round((totalTasks / dailyGoal) * 100), 100);

    // Calculate width percentages for each segment relative to the *total width of the bar* (which represents 100% of the goal)
    // If totalTasks > dailyGoal, we might need to adjust, but for now let's cap visual at 100%
    // Actually, a better way for the segmented bar is:
    // The bar represents the GOAL (100%).
    // Each segment width = (task_count / goal) * 100.

    const getSegmentWidth = (count: number) => {
        return (count / dailyGoal) * 100;
    };

    const segments = [
        { key: 'listening', value: tasks.listening, color: 'bg-purple-500' },
        { key: 'reading', value: tasks.reading, color: 'bg-emerald-500' },
        { key: 'writing', value: tasks.writing, color: 'bg-sky-500' },
        { key: 'speaking', value: tasks.speaking, color: 'bg-rose-500' },
        { key: 'vocabulary', value: tasks.vocabulary, color: 'bg-orange-500' },
    ];

    return (
        <Card className="bg-slate-950 border-slate-900 p-6 relative overflow-hidden group">
            {/* Background Glow Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-sky-500 to-orange-500 opacity-50"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>

            <div className="relative z-10 space-y-8">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                            <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Daily Progress</h3>
                            <p className="text-slate-400 text-sm">Track your daily goals</p>
                        </div>
                    </div>

                    <Button variant="outline" size="sm" className="bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white gap-2 rounded-full px-4">
                        Daily plan
                        <ChevronDown className="w-3 h-3" />
                    </Button>
                </div>

                {/* Progress Stats */}
                <div className="flex items-end justify-between">
                    <div className="flex items-baseline gap-1">
                        <span className="text-6xl font-bold text-white tracking-tighter">{progressPercentage}</span>
                        <span className="text-2xl font-medium text-slate-500">%</span>
                    </div>
                    <div className="text-right mb-2">
                        <span className="text-white font-bold">{totalTasks}</span>
                        <span className="text-slate-500"> / {dailyGoal} tasks</span>
                    </div>
                </div>

                {/* Segmented Progress Bar */}
                <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex">
                    {segments.map((segment, index) => {
                        const width = getSegmentWidth(segment.value);
                        if (width <= 0) return null;
                        return (
                            <div
                                key={segment.key}
                                className={cn("h-full transition-all duration-500", segment.color)}
                                style={{ width: `${width}%` }}
                            />
                        );
                    })}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                        <Button className="bg-white text-slate-950 hover:bg-slate-200 rounded-full font-semibold gap-2 px-5">
                            <Plus className="w-4 h-4" />
                            Add Task
                        </Button>
                        <Button variant="outline" className="bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white rounded-full gap-2 px-5">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            AI Suggest
                        </Button>
                    </div>

                    <Button variant="ghost" className="text-slate-400 hover:text-white gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        Set due date
                    </Button>
                </div>
            </div>
        </Card>
    );
}
