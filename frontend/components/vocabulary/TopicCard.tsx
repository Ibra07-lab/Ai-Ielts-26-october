import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SegmentedProgressBar } from "./SegmentedProgressBar";
import type { Topic } from "@/data/vocabulary/types";
import { cn } from "@/lib/utils";
import { Play, Sparkles } from "lucide-react";

interface TopicCardProps {
    topic: Topic;
    onClick: () => void;
}

// Color mapping for IELTS sections - Refined Semantic System
const sectionColors: Record<string, { bg: string, text: string, bar: string, border: string, iconBg: string }> = {
    writing: {
        bg: "hover:border-blue-500/30",
        text: "text-blue-500 dark:text-blue-400",
        bar: "from-blue-500 to-blue-400",
        border: "border-blue-100 dark:border-blue-500/20",
        iconBg: "bg-blue-50 dark:bg-blue-500/10"
    },
    reading: {
        bg: "hover:border-blue-500/30",
        text: "text-blue-500 dark:text-blue-400",
        bar: "from-blue-500 to-blue-400",
        border: "border-blue-100 dark:border-blue-500/20",
        iconBg: "bg-blue-50 dark:bg-blue-500/10"
    },
    speaking: {
        bg: "hover:border-amber-500/30",
        text: "text-amber-500 dark:text-amber-400",
        bar: "from-amber-500 to-amber-400",
        border: "border-amber-100 dark:border-amber-500/20",
        iconBg: "bg-amber-50 dark:bg-amber-500/10"
    },
    listening: {
        bg: "hover:border-emerald-500/30",
        text: "text-emerald-500 dark:text-emerald-400",
        bar: "from-emerald-500 to-emerald-400",
        border: "border-emerald-100 dark:border-emerald-500/20",
        iconBg: "bg-emerald-50 dark:bg-emerald-500/10"
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
    const [isHovered, setIsHovered] = useState(false);

    // Default to 'writing' if not specified or unknown
    const section = topic.ieltsSection || "writing";
    const colors = sectionColors[section] || sectionColors.writing;
    const progress = topic.progress || 0;
    const status = topic.status || "new";
    const percentage = Math.round((progress / topic.wordsCount) * 100);

    // Determine bar color: Use status color if exists, else fallback to section color
    const barColorClass = progressColors[status] || colors.bar;

    return (
        <Card
            className={cn(
                "group relative cursor-pointer overflow-hidden border-slate-100 dark:border-white/5 bg-white dark:bg-[#151B2B] transition-all duration-500 hover:shadow-xl dark:hover:shadow-lg dark:hover:shadow-blue-900/5 hover:-translate-y-1 rounded-[1.25rem]",
                colors.bg
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                section === 'listening' ? "from-emerald-500/5 to-transparent" :
                    section === 'speaking' ? "from-amber-500/5 to-transparent" :
                        "from-blue-500/5 to-transparent"
            )}></div>

            <CardContent className="p-6 space-y-6 relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-5">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 shadow-sm", colors.iconBg)}>
                            {topic.icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{topic.name}</h3>
                                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">[{topic.wordsCount}]</span>
                            </div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Band 6.0-7.5 vocabulary</p>
                        </div>
                    </div>
                </div>

                {/* Progress Visual - New Style */}
                <div className="space-y-3">
                    {/* Continuous Bar instead of Segmented */}
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r", colors.bar)}
                            style={{ width: `${Math.max(percentage, 5)}%` }} // Min 5% so bar is visible
                        ></div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                        <Badge variant="secondary" className={cn("text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg border", statusColors[status])}>
                            {statusLabels[status]}
                        </Badge>
                        <span className="text-slate-400 font-medium">{progress}/{topic.wordsCount} words</span>
                    </div>
                </div>

                {/* Hover Overlay - Preview Words */}
                <div
                    className={cn(
                        "absolute inset-0 bg-[#0B0F19]/95 backdrop-blur-md p-6 flex flex-col justify-center transition-all duration-300 border border-white/10",
                        isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                    )}
                >
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Preview Words</p>
                            <div className="text-sm font-medium text-slate-200 leading-relaxed font-serif italic">
                                "{topic.previewWords?.join(", ") || "essential vocabulary..."}"
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Button
                                size="sm"
                                className={cn("w-full font-bold text-white shadow-lg border-0 bg-gradient-to-r hover:opacity-90", colors.bar)}
                            >
                                <Play className="w-3.5 h-3.5 mr-2 fill-current" /> Continue
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full border-white/10 hover:bg-white/5 text-slate-300 hover:text-white"
                            >
                                <Sparkles className="w-3.5 h-3.5 mr-2" /> Browse
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
