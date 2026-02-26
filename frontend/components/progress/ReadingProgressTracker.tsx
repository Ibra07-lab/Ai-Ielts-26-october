import { motion } from "framer-motion";
import { BookOpen, TrendingUp, AlertCircle } from "lucide-react";
import { useUser } from "../../contexts/UserContext";

interface ReadingSkill {
    type: string;
    total: number;
    correct: number;
    accuracy: number;
}

export default function ReadingProgressTracker() {
    const { user } = useUser();

    const skills: ReadingSkill[] = [
        { type: "Matching Headings", total: 0, correct: 0, accuracy: 0 },
        { type: "True/False/Not Given", total: 0, correct: 0, accuracy: 0 },
        { type: "Multiple Choice", total: 0, correct: 0, accuracy: 0 },
        { type: "Gap Fill", total: 0, correct: 0, accuracy: 0 },
        { type: "Sentence Completion", total: 0, correct: 0, accuracy: 0 },
        { type: "Summary Completion", total: 0, correct: 0, accuracy: 0 },
        { type: "Matching Features", total: 0, correct: 0, accuracy: 0 },
        { type: "Short Answer", total: 0, correct: 0, accuracy: 0 },
    ];

    const hasData = skills.some(s => s.total > 0);

    const getBarColor = (accuracy: number) => {
        if (accuracy >= 80) return "from-emerald-400 to-emerald-500";
        if (accuracy >= 60) return "from-blue-400 to-blue-500";
        if (accuracy >= 40) return "from-amber-400 to-amber-500";
        return "from-rose-400 to-rose-500";
    };

    const getBarBg = (accuracy: number) => {
        if (accuracy >= 80) return "bg-emerald-100 dark:bg-emerald-950/30";
        if (accuracy >= 60) return "bg-blue-100 dark:bg-blue-950/30";
        if (accuracy >= 40) return "bg-amber-100 dark:bg-amber-950/30";
        return "bg-rose-100 dark:bg-rose-950/30";
    };

    const getAccuracyColor = (accuracy: number) => {
        if (accuracy >= 80) return "text-emerald-600 dark:text-emerald-400";
        if (accuracy >= 60) return "text-blue-600 dark:text-blue-400";
        if (accuracy >= 40) return "text-amber-600 dark:text-amber-400";
        return "text-rose-600 dark:text-rose-400";
    };

    if (!hasData) {
        return (
            <div className="rounded-2xl border border-border/60 bg-white/80 dark:bg-white/[0.04] p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-foreground">Reading Skills Breakdown</h3>
                        <p className="text-xs text-muted-foreground">Track accuracy by question type</p>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center mb-4">
                        <AlertCircle className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-1">No reading data yet</p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                        Complete a few reading practice tests to see your accuracy breakdown across all 8 question types.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-border/60 bg-white/80 dark:bg-white/[0.04] p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-foreground">Reading Skills Breakdown</h3>
                        <p className="text-xs text-muted-foreground">Accuracy by question type</p>
                    </div>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                    {skills.filter(s => s.accuracy >= 70).length}/{skills.length} skills above 70%
                </div>
            </div>

            <div className="space-y-4">
                {skills.map((skill, i) => (
                    <motion.div
                        key={skill.type}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className="group"
                    >
                        <div className="flex items-center gap-4">
                            <span className="w-44 text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors truncate">
                                {skill.type}
                            </span>
                            <div className="flex-1 relative">
                                <div className={`h-3 rounded-full overflow-hidden ${getBarBg(skill.accuracy)} transition-colors`}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${Math.max(skill.accuracy, 2)}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.05 }}
                                        className={`h-full rounded-full bg-gradient-to-r ${getBarColor(skill.accuracy)} shadow-sm`}
                                    />
                                </div>
                            </div>
                            <span className={`w-12 text-right text-sm font-bold tabular-nums ${getAccuracyColor(skill.accuracy)}`}>
                                {skill.accuracy}%
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
