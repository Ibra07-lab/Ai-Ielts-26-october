import React, { useState, useEffect } from "react";
import { FeedbackDeepDiveView } from "./FeedbackDeepDiveView";
import { EvaluationResult, CoachingResult, Criterion } from "@/types/writing-feedback";

interface FeedbackContainerProps {
    evaluation: EvaluationResult;
    coaching: CoachingResult;
    essay: string;
    taskType: "task1" | "task2";
    onBack?: () => void;
}

export function FeedbackContainer({ evaluation, coaching, essay, taskType, onBack }: FeedbackContainerProps) {
    const [activeCriterion, setActiveCriterion] = useState<Criterion | null>(null);

    return (
        <div className="w-full flex-1 flex flex-col bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 min-h-0 overflow-hidden">
            <main className="flex-1 flex flex-col relative overflow-hidden min-h-0">
                <FeedbackDeepDiveView
                    essay={essay}
                    evaluation={evaluation}
                    coaching={coaching}
                    activeCriterion={activeCriterion}
                    onBack={onBack || (() => { })}
                    onCriterionChange={setActiveCriterion}
                />
            </main>
        </div>
    );
}
