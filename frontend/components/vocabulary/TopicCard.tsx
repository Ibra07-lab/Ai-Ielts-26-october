import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SegmentedProgressBar } from "./SegmentedProgressBar";
import type { Topic } from "@/data/vocabulary/types";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TopicCardProps {
    topic: Topic;
    onClick: (mode?: "speaking" | "writing") => void;
}

// Color mapping for IELTS sections - Refined Semantic System
const sectionColors: Record<string, { bg: string, text: string, bar: string, border: string, iconBg: string, cardGradient: string, hoverBorder: string }> = {
    writing: {
        bg: "hover:shadow-blue-500/20",
        hoverBorder: "hover:border-blue-300 dark:hover:border-blue-500/30",
        text: "text-blue-600 dark:text-blue-400",
        bar: "from-blue-500 to-blue-400",
        border: "border-blue-100 dark:border-blue-500/20",
        iconBg: "bg-blue-100/50 dark:bg-blue-500/20",
        cardGradient: "bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-500/5 dark:to-card"
    },
    reading: {
        bg: "hover:shadow-blue-500/20",
        hoverBorder: "hover:border-blue-300 dark:hover:border-blue-500/30",
        text: "text-blue-600 dark:text-blue-400",
        bar: "from-blue-500 to-blue-400",
        border: "border-blue-100 dark:border-blue-500/20",
        iconBg: "bg-blue-100/50 dark:bg-blue-500/20",
        cardGradient: "bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-500/5 dark:to-card"
    },
    speaking: {
        bg: "hover:shadow-amber-500/20",
        hoverBorder: "hover:border-amber-300 dark:hover:border-amber-500/30",
        text: "text-amber-600 dark:text-amber-400",
        bar: "from-amber-500 to-amber-400",
        border: "border-amber-100 dark:border-amber-500/20",
        iconBg: "bg-amber-100/50 dark:bg-amber-500/20",
        cardGradient: "bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-500/5 dark:to-card"
    },
    listening: {
        bg: "hover:shadow-emerald-500/20",
        hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-500/30",
        text: "text-emerald-600 dark:text-emerald-400",
        bar: "from-emerald-500 to-emerald-400",
        border: "border-emerald-100 dark:border-emerald-500/20",
        iconBg: "bg-emerald-100/50 dark:bg-emerald-500/20",
        cardGradient: "bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-500/5 dark:to-card"
    },
};

const statusColors: Record<string, string> = {
    new: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10",
    in_progress: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
    mastered: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
};

const statusLabels: Record<string, string> = {
    new: "New",
    in_progress: "In Progress",
    mastered: "Mastered",
};

// Colors for progress bars specifically
const progressColors: Record<string, string> = {
    new: "bg-slate-300 dark:bg-slate-700",
    in_progress: "bg-gradient-to-r from-amber-400 to-amber-500",
    mastered: "bg-gradient-to-r from-emerald-400 to-emerald-500",
};

export function TopicCard({ topic, onClick }: TopicCardProps) {
    const section = topic.ieltsSection || "writing";
    const colors = sectionColors[section] || sectionColors.writing;
    const progress = topic.progress || 0;
    const status = topic.status || "new";
    const percentage = Math.round((progress / topic.wordsCount) * 100);

    const statusLabels: Record<string, string> = {
        new: "NEW",
        in_progress: "NEEDS REVIEW",
        mastered: "MASTERED",
    };

    const statusStyles: Record<string, string> = {
        new: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20",
        in_progress: "text-orange-500 bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20",
        mastered: "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20",
    };

    return (
        <Card
            className={cn(
                "group relative cursor-pointer overflow-hidden border-2 border-b-[6px] border-slate-100 dark:border-white/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-[1.5rem] shadow-sm",
                colors.bg,
                colors.cardGradient,
                colors.hoverBorder
            )}
            onClick={() => onClick()}
        >
            <CardContent className="p-7">
                <div className="flex justify-between items-start mb-6">
                    <div className={cn("w-14 h-14 rounded-[1rem] flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300", colors.iconBg)}>
                        {topic.icon}
                    </div>
                    <Badge variant="outline" className={cn("text-[10px] font-bold px-2 py-1 rounded-lg border", statusStyles[status])}>
                        {statusLabels[status]}
                    </Badge>
                </div>

                <div className="mb-6">
                    <h3 className="font-black text-xl text-slate-900 dark:text-white mb-1 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">{topic.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Band 7.5+ • Advanced
                    </p>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Mastery</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">{percentage}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100/80 dark:bg-white/5 rounded-full overflow-hidden shadow-inner flex">
                        <div
                            className={cn("h-full rounded-full transition-all duration-1000 bg-gradient-to-r relative", colors.bar)}
                            style={{ width: `${percentage}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 w-full h-full skew-x-12 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">12 to review</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{topic.wordsCount} Total</span>
                </div>
            </CardContent>
        </Card>
    );
}
