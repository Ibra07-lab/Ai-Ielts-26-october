
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";

// ... previous imports

const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};
import { Button } from "@/components/ui/button";
import { HighlightedEssay } from "./HighlightedEssay";
import { EvaluationResult, CoachingResult, Criterion, Highlight } from "@/types/writing-feedback";
import { transformToHighlights } from "@/utils/feedback-transform";
import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FeedbackDeepDiveViewProps {
    essay: string;
    evaluation: EvaluationResult;
    coaching: CoachingResult;
    activeCriterion: Criterion | null;
    onBack: () => void;
    onCriterionChange: (criterion: Criterion) => void;
}

const CRITERIA_ORDER: Criterion[] = [
    "task_response",
    "task_achievement",
    "coherence_cohesion",
    "lexical_resource",
    "grammatical_range_accuracy"
];

const CRITERION_LABELS: Record<string, string> = {
    task_response: "Task Response",
    task_achievement: "Task Achievement",
    coherence_cohesion: "Coherence",
    lexical_resource: "Vocabulary",
    grammatical_range_accuracy: "Grammar"
};

const CRITERION_DESCRIPTIONS: Record<string, string> = {
    task_response: "How well you addressed the prompt and developed your ideas.",
    task_achievement: "How well you achieved the task requirements and presented information.",
    coherence_cohesion: "The flow of your essay and how well ideas are connected.",
    lexical_resource: "The range and accuracy of vocabulary used.",
    grammatical_range_accuracy: "Variety of sentence structures and grammatical correctness."
};

export function FeedbackDeepDiveView({
    essay,
    evaluation,
    coaching,
    activeCriterion,
    onBack,
    onCriterionChange
}: FeedbackDeepDiveViewProps) {

    // Transform coaching data into linear highlights
    const highlights = useMemo(() => {
        return transformToHighlights(essay, coaching);
    }, [essay, coaching]);

    // Calculate stats for each criterion
    const stats = useMemo(() => {
        const counts = {
            task_response: 0,
            coherence_cohesion: 0,
            lexical_resource: 0,
            grammatical_range_accuracy: 0
        };

        highlights.forEach(h => {
            if (h.type === "grammar") counts.grammatical_range_accuracy++;
            if (h.type === "vocabulary") counts.lexical_resource++;
            if (h.type === "coherence") counts.coherence_cohesion++;
            // Strength contributes to active criterion or all?
            // For now let's keep it simple
        });
        return counts;
    }, [highlights]);

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900/50">
            {/* Header Navigation */}
            <div className="flex items-center gap-4 px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 sticky top-0 z-10">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Summary
                </Button>

                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Detailed Analysis</span>
                    {activeCriterion && (
                        <>
                            <ChevronRight className="w-4 h-4" />
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {CRITERION_LABELS[activeCriterion]}
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Criteria Selector */}
                <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto hidden md:block">
                    <div className="p-4 space-y-2">
                        <div className="px-2 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Select Focus
                        </div>
                        {CRITERIA_ORDER.filter(c => evaluation.criterion_scores.some(s => s.criterion === c)).map(criterion => {
                            const score = evaluation.criterion_scores.find(s => s.criterion === criterion);
                            const isActive = activeCriterion === criterion;

                            return (
                                <button
                                    key={criterion}
                                    onClick={() => onCriterionChange(criterion)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
                                        isActive
                                            ? "bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500/20"
                                            : "hover:bg-slate-50 dark:hover:bg-slate-800"
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={cn(
                                            "font-medium text-sm",
                                            isActive ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"
                                        )}>
                                            {CRITERION_LABELS[criterion]}
                                        </span>
                                        {score && (
                                            <span className={cn(
                                                "text-xs font-bold px-1.5 py-0.5 rounded",
                                                score.band >= 7 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                                    score.band >= 6 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            )}>
                                                {score.band}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                        {CRITERION_DESCRIPTIONS[criterion]}
                                    </p>

                                    {/* Active Indicator Bar */}
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content - Essay with Highlights */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <ScrollArea className="flex-1 p-6 md:p-10">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="space-y-2 mb-8">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {activeCriterion ? CRITERION_LABELS[activeCriterion] : "Full Essay Analysis"}
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                                    {activeCriterion
                                        ? evaluation.criterion_scores.find(s => s.criterion === activeCriterion)?.justification
                                        : "Review your essay with detailed feedback highlights below."
                                    }
                                </p>
                            </div>

                            <HighlightedEssay
                                essayText={essay}
                                highlights={highlights.map(h => ({
                                    text: h.original,
                                    type: h.type === 'strength' ? 'strength' : 'weakness'
                                }))}
                            />
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
