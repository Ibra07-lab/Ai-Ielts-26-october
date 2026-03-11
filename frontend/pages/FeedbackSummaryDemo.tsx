
// ============================================================================
// FEEDBACK SUMMARY DEMO PAGE
// ============================================================================
// Demo page showing the FeedbackSummaryView with sample data

import { useState } from "react";
import { FeedbackSummaryView } from "@/components/writing/FeedbackSummaryView";
import { FeedbackDeepDiveView } from "@/components/writing/FeedbackDeepDiveView";
import type { EvaluationResult, Criterion, CoachingResult } from "@/types/writing-feedback";

// Sample data for demonstration
const SAMPLE_EVALUATION: EvaluationResult = {
    overall_band: 6.5,
    band_range: {
        low: 6.0,
        high: 7.0,
    },
    criterion_scores: [
        {
            criterion: "task_response",
            band: 7.0,
            justification: "Addresses all parts of the task with relevant, extended and supported ideas",
        },
        {
            criterion: "coherence_cohesion",
            band: 6.5,
            justification: "Information and ideas are generally arranged coherently with clear progression",
        },
        {
            criterion: "lexical_resource",
            band: 6.0,
            justification: "Uses an adequate range of vocabulary with some errors in word choice",
        },
        {
            criterion: "grammatical_range_accuracy",
            band: 6.5,
            justification: "Uses a mix of simple and complex sentence forms with good control",
        },
    ],
    word_count: 267,
    word_count_ok: true,
};



// Sample coaching data matching the evaluation
const SAMPLE_COACHING: CoachingResult = {
    action_plan: [
        "Focus on subject-verb agreement in complex sentences",
        "Expand vocabulary for specific topics",
        "Use more formal linking words"
    ],
    weaknesses: [
        "Some repetitive vocabulary in the second paragraph",
        "Minor punctuation errors with compound sentences"
    ],
    grammar_errors: [
        {
            original: "People is believing",
            corrected: "People believe",
            explanation: "Subject-verb agreement error. 'People' is plural.",
            tip: "Always check if your subject is singular or plural.",
        }
    ],
    vocabulary_suggestions: [
        {
            original: "good things",
            better_options: ["benefits", "advantages", "positive aspects"],
            context: "Using more precise academic vocabulary improves Lexical Resource score.",
        }
    ],
    coherence_issues: [
        {
            text: "And also",
            suggestion: "Furthermore / In addition",
            reason: "Avoid starting sentences with 'And also' in formal writing.",
        }
    ],
};


const SAMPLE_ESSAY = `In today's fast-paced world, many people argue that technology has done more harm than good. While there are certainly drawbacks to our increasing reliance on digital devices, I firmly believe that the benefits far outweigh the negatives.

Firstly, technology has revolutionized communication. People is believing that social media separates us, but in fact, it allows us to stay connected with loved ones across the globe. For example, video calls enable face-to-face interaction regardless of distance. And also, it has made information accessible to everyone.

However, there are good things and bad things. The main drawback is the sedentary lifestyle it encourages.`;

export default function FeedbackSummaryDemo() {
    const [view, setView] = useState<"summary" | "deep-dive">("summary");
    const [selectedCriterion, setSelectedCriterion] = useState<Criterion | null>(null);

    const handleCriterionClick = (criterion: Criterion) => {
        setSelectedCriterion(criterion);
        setView("deep-dive");
    };

    const handleBack = () => {
        setView("summary");
        setSelectedCriterion(null);
    };

    // Select data based on active example
    const currentEvaluation = SAMPLE_EVALUATION;

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col items-center">

            {view === "summary" ? (
                <div className="w-full py-12 flex flex-col items-center animate-in fade-in duration-500">
                    <div className="w-full max-w-5xl">
                        <FeedbackSummaryView
                            evaluation={currentEvaluation}
                            taskType="task2"
                            onCriterionClick={handleCriterionClick}
                        />
                    </div>

                    <p className="fixed bottom-4 text-xs text-slate-600 font-mono">
                        Design Mode: Clean Dark • Bento Grid v2.0
                    </p>
                </div>
            ) : (
                <div className="w-full h-screen animate-in slide-in-from-right duration-300">
                    <FeedbackDeepDiveView
                        essay={SAMPLE_ESSAY}
                        evaluation={currentEvaluation}
                        coaching={SAMPLE_COACHING}
                        activeCriterion={selectedCriterion}
                        onBack={handleBack}
                        onCriterionChange={setSelectedCriterion}
                    />
                </div>
            )}
        </div>
    );
}
