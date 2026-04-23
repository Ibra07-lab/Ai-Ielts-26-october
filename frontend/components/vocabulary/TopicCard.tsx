import { Card, CardContent } from "@/components/ui/card";
import type { Topic } from "@/data/vocabulary/types";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TopicCardProps {
    topic: Topic;
    onClick: (mode?: "speaking" | "writing") => void;
    index?: number; // For stagger animation
}

// Per-topic color palettes — refined for premium light and dark themes
const topicColorMap: Record<string, {
    gradient: string;
    border: string;
    hoverShadow: string;
    iconBg: string;
    bar: string;
    chipBg: string;
    chipText: string;
}> = {
    "Business & Work": {
        gradient: "bg-gradient-to-br from-indigo-100 via-indigo-50 to-white dark:from-indigo-500/20 dark:via-transparent dark:to-card",
        border: "border-indigo-200 dark:border-indigo-500/40",
        hoverShadow: "hover:shadow-indigo-500/20",
        iconBg: "bg-indigo-200/80 dark:bg-indigo-500/30",
        bar: "from-indigo-400 to-indigo-600",
        chipBg: "bg-indigo-100 dark:bg-indigo-500/15",
        chipText: "text-indigo-600 dark:text-indigo-300",
    },
    "Environment": {
        gradient: "bg-gradient-to-br from-emerald-100 via-emerald-50 to-white dark:from-emerald-500/20 dark:via-transparent dark:to-card",
        border: "border-emerald-200 dark:border-emerald-500/40",
        hoverShadow: "hover:shadow-emerald-500/20",
        iconBg: "bg-emerald-200/80 dark:bg-emerald-500/30",
        bar: "from-emerald-400 to-teal-600",
        chipBg: "bg-emerald-100 dark:bg-emerald-500/15",
        chipText: "text-emerald-600 dark:text-emerald-300",
    },
    "Education": {
        gradient: "bg-gradient-to-br from-amber-100 via-amber-50 to-white dark:from-amber-500/20 dark:via-transparent dark:to-card",
        border: "border-amber-200 dark:border-amber-500/40",
        hoverShadow: "hover:shadow-amber-500/20",
        iconBg: "bg-amber-200/80 dark:bg-amber-500/30",
        bar: "from-amber-400 to-orange-600",
        chipBg: "bg-amber-100 dark:bg-amber-500/15",
        chipText: "text-amber-600 dark:text-amber-300",
    },
    "Speaking Part 1": {
        gradient: "bg-gradient-to-br from-sky-100 via-sky-50 to-white dark:from-sky-500/20 dark:via-transparent dark:to-card",
        border: "border-sky-200 dark:border-sky-500/40",
        hoverShadow: "hover:shadow-sky-500/20",
        iconBg: "bg-sky-200/80 dark:bg-sky-500/30",
        bar: "from-sky-400 to-blue-600",
        chipBg: "bg-sky-100 dark:bg-sky-500/15",
        chipText: "text-sky-600 dark:text-sky-300",
    },
    "Speaking Part 2": {
        gradient: "bg-gradient-to-br from-teal-100 via-teal-50 to-white dark:from-teal-500/20 dark:via-transparent dark:to-card",
        border: "border-teal-200 dark:border-teal-500/40",
        hoverShadow: "hover:shadow-teal-500/20",
        iconBg: "bg-teal-200/80 dark:bg-teal-500/30",
        bar: "from-teal-400 to-cyan-600",
        chipBg: "bg-teal-100 dark:bg-teal-500/15",
        chipText: "text-teal-600 dark:text-teal-300",
    },
    "Speaking Part 3": {
        gradient: "bg-gradient-to-br from-rose-100 via-rose-50 to-white dark:from-rose-500/20 dark:via-transparent dark:to-card",
        border: "border-rose-200 dark:border-rose-500/40",
        hoverShadow: "hover:shadow-rose-500/20",
        iconBg: "bg-rose-200/80 dark:bg-rose-500/30",
        bar: "from-rose-400 to-pink-600",
        chipBg: "bg-rose-100 dark:bg-rose-500/15",
        chipText: "text-rose-600 dark:text-rose-300",
    },
    "Shopping": {
        gradient: "bg-gradient-to-br from-pink-100 via-pink-50 to-white dark:from-pink-500/20 dark:via-transparent dark:to-card",
        border: "border-pink-200 dark:border-pink-500/40",
        hoverShadow: "hover:shadow-pink-500/20",
        iconBg: "bg-pink-200/80 dark:bg-pink-500/30",
        bar: "from-pink-400 to-rose-600",
        chipBg: "bg-pink-100 dark:bg-pink-500/15",
        chipText: "text-pink-600 dark:text-pink-300",
    },
    "Transport & Mobility": {
        gradient: "bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-blue-500/20 dark:via-transparent dark:to-card",
        border: "border-blue-200 dark:border-blue-500/40",
        hoverShadow: "hover:shadow-blue-500/20",
        iconBg: "bg-blue-200/80 dark:bg-blue-500/30",
        bar: "from-blue-400 to-indigo-600",
        chipBg: "bg-blue-100 dark:bg-blue-500/15",
        chipText: "text-blue-600 dark:text-blue-300",
    },
};

// Fallback palette for unknown topics
const defaultColors = {
    gradient: "bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-slate-500/20 dark:via-transparent dark:to-card",
    border: "border-slate-200 dark:border-slate-500/40",
    hoverShadow: "hover:shadow-slate-500/20",
    iconBg: "bg-slate-200/80 dark:bg-slate-500/30",
    bar: "from-slate-400 to-slate-600",
    chipBg: "bg-slate-100 dark:bg-slate-500/15",
    chipText: "text-slate-600 dark:text-slate-300",
};

export function TopicCard({ topic, onClick, index = 0 }: TopicCardProps) {
    const colors = topicColorMap[topic.name] || defaultColors;
    const progress = topic.progress || 0;
    const percentage = Math.round((progress / (topic.wordsCount || 1)) * 100);

    return (
        <Card
            className={cn(
                "group relative cursor-pointer overflow-hidden border-2 border-b-[6px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-[1.5rem] shadow-sm",
                "opacity-0 animate-[fadeSlideUp_0.5s_ease-out_forwards]",
                colors.border,
                colors.hoverShadow,
                colors.gradient
            )}
            style={{ animationDelay: `${index * 80}ms` }}
            onClick={() => onClick()}
        >
            {/* Gloss and glow effects */}
            <div className="absolute -top-[110%] -right-[60%] w-[250%] h-[250%] bg-white/20 dark:bg-white/5 rotate-12 pointer-events-none transition-transform duration-1000 group-hover:scale-110 group-hover:-translate-y-4" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full translate-x-12 -translate-y-12 pointer-events-none" />
            
            {/* Inner highlight for dark mode depth */}
            <div className="absolute inset-0 border border-white/5 rounded-[1.5rem] pointer-events-none" />

            <CardContent className="p-7 relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className={cn("w-14 h-14 rounded-[1rem] flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300", colors.iconBg)}>
                        {topic.icon}
                    </div>
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

                {/* Preview Word Chips */}
                {topic.previewWords && topic.previewWords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                        {topic.previewWords.slice(0, 3).map((word) => (
                            <span
                                key={word}
                                className={cn(
                                    "text-[10px] font-semibold px-2.5 py-1 rounded-full italic",
                                    colors.chipBg,
                                    colors.chipText
                                )}
                            >
                                {word}
                            </span>
                        ))}
                    </div>
                )}

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
