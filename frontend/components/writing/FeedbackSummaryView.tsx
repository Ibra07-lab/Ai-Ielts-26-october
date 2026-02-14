
// ============================================================================
// FEEDBACK SUMMARY VIEW COMPONENT - CLEAN DARK DESIGN
// ============================================================================

import { useState } from "react";
import { CircularProgress } from "./CircularProgress";
import type { EvaluationResult, Criterion } from "@/types/writing-feedback";
import { cn } from "@/lib/utils";
import {
    PenTool,
    Scale,
    Link,
    CheckCircle2,
    Info
} from "lucide-react";
import { motion } from "framer-motion";

interface FeedbackSummaryViewProps {
    evaluation: EvaluationResult;
    taskType?: "task1" | "task2";
    onCriterionClick?: (criterion: Criterion) => void;
}

const CRITERION_ICONS: Record<string, React.ElementType> = {
    task_response: Scale,
    task_achievement: Scale,
    coherence_cohesion: Link,
    lexical_resource: PenTool,
    grammatical_range_accuracy: CheckCircle2,
};

const CRITERION_LABELS: Record<string, string> = {
    task_response: "Task Response",
    task_achievement: "Task Achievement",
    coherence_cohesion: "Coherence & Cohesion",
    lexical_resource: "Lexical Resource",
    grammatical_range_accuracy: "Grammar & Accuracy",
};

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        } as any // Cast to any to avoid strict type mismatch with 'type' string
    }
};

export function FeedbackSummaryView({
    evaluation,
    taskType = "task2",
    onCriterionClick,
}: FeedbackSummaryViewProps) {
    const [selectedCriterion, setSelectedCriterion] = useState<Criterion | null>(null);

    const handleCriterionClick = (criterion: Criterion) => {
        setSelectedCriterion(criterion);
        onCriterionClick?.(criterion);
    };

    // Helper to get color for scores
    const getScoreColor = (score: number) => {
        if (score >= 7) return "text-emerald-400";
        if (score >= 5.5) return "text-amber-400";
        return "text-red-400";
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-4xl mx-auto space-y-8 p-4 md:p-8"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center space-y-2">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    Writing Analysis Report
                </h2>
                <p className="text-slate-400 text-sm">
                    AI-powered assessment based on official IELTS criteria
                </p>
            </motion.div>

            {/* Hero Section - Overall Score */}
            <motion.div variants={itemVariants} className="relative flex justify-center py-4">
                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full" />

                <div className="relative">
                    <CircularProgress
                        value={evaluation?.overall_band || 0}
                        max={9}
                        color="#6366f1" // Indigo-500
                        size="lg"
                        strokeWidth={8}
                        showValue={false} // We'll do custom value rendering
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-100">
                        <span className="text-sm font-medium text-slate-400 uppercase tracking-widest text-[10px]">
                            Overall
                        </span>
                        <div className="flex items-baseline -mt-1">
                            <span className="text-5xl font-bold tracking-tighter">
                                {evaluation?.overall_band || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Range Indicator */}
            {evaluation?.band_range && (
                <motion.div variants={itemVariants} className="text-center -mt-4 mb-8">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Estimated Range: <span className="text-slate-300">{evaluation.band_range.low} - {evaluation.band_range.high}</span>
                    </p>
                </motion.div>
            )}

            {/* Criteria Grid - 2x2 Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evaluation?.criterion_scores?.map((score) => {
                    const Icon = CRITERION_ICONS[score.criterion] || Scale;
                    const label = (taskType === "task1" && score.criterion === "task_response") || score.criterion === "task_achievement"
                        ? "Task Achievement"
                        : CRITERION_LABELS[score.criterion] || score.criterion;

                    const scoreColorClass = getScoreColor(score.band);
                    const isSelected = selectedCriterion === score.criterion;

                    return (
                        <motion.div
                            key={score.criterion}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, boxShadow: "0 0 20px -10px rgba(99,102,241,0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCriterionClick(score.criterion)}
                            className={cn(
                                "group relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-colors duration-200",
                                "bg-[#1E293B] border border-slate-800",
                                "hover:border-indigo-500/50",
                                isSelected && "ring-1 ring-indigo-500 border-indigo-500/50"
                            )}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-slate-800/50 text-slate-300 group-hover:text-white transition-colors">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold text-slate-200 text-sm">
                                        {label}
                                    </h3>
                                </div>
                                <span className={cn("text-xl font-bold font-mono", scoreColorClass)}>
                                    {score.band}
                                </span>
                            </div>

                            {/* Mini Bar Chart / Progress Line */}
                            <div className="h-1.5 w-full bg-slate-800 rounded-full mb-3 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(score.band / 9) * 100}%` }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                                    className={cn("h-full rounded-full",
                                        score.band >= 7 ? "bg-emerald-500" :
                                            score.band >= 5.5 ? "bg-amber-500" : "bg-red-500"
                                    )}
                                />
                            </div>

                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                {(score.justification || "Analysis pending...").split(/(Score capped|capped at Band|-\d band|Band \d MAX)/gi).map((part, i) => {
                                    const isPenalty = /Score capped|capped at Band|-\d band|Band \d MAX/i.test(part);
                                    return isPenalty ? (
                                        <span key={i} className="text-rose-400 font-medium">⚠️ {part}</span>
                                    ) : (
                                        <span key={i}>{part}</span>
                                    );
                                })}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer / Disclaimer */}
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-2 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
                    <Info className="w-3 h-3" />
                    <span>AI estimation. Official scores may vary. Word Count: {evaluation.word_count} ({evaluation.word_count_ok ? "Valid" : "Too Short"})</span>
                </div>
            </motion.div>
        </motion.div>
    );
}
