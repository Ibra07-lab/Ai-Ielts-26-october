import React, { useState } from 'react';
import { EvaluationResult } from '@/types/writing-feedback';
import { ArrowLeft, CheckCircle, LayoutList, BookOpen, Scale, Sparkles, AlertCircle } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { CriterionContent } from './CriterionContent';
import { HighlightedEssay, HighlightRange } from './HighlightedEssay';
import ReactMarkdown from 'react-markdown';

interface WritingFeedbackProps {
    result: EvaluationResult;
    essayText?: string;
    onRetryFeedback?: () => void;
    isLoadingFeedback?: boolean;
}

export const WritingFeedback: React.FC<WritingFeedbackProps> = ({
    result,
    essayText = "",
    onRetryFeedback,
    isLoadingFeedback = false
}) => {
    // Default to 'task_achievement' or the first criterion
    const [selectedCriterion, setSelectedCriterion] = useState<string>('task_achievement');

    // Helper to find specific criterion score
    const getScore = (criteria: string) => {
        return result.criterion_scores.find(s => s.criterion === criteria)?.band || 0;
    };

    const taskAchievement = getScore('task_achievement') || getScore('task_response');
    const coherence = getScore('coherence_cohesion');
    const lexical = getScore('lexical_resource');
    const grammar = getScore('grammatical_range_accuracy') || getScore('grammatical_range');

    // Get current criterion data 
    const getCriterionData = (criterion: string) => {
        if (!result.teacher_feedback) return {};
        // Handle name mismatch for grammar
        if (criterion === 'grammatical_range_accuracy') {
            // @ts-ignore
            return result.teacher_feedback['grammatical_range'] || result.teacher_feedback['grammatical_range_accuracy'] || {};
        }
        // @ts-ignore
        return result.teacher_feedback[criterion] || {};
    };

    const criteriaList = [
        {
            id: 'task_achievement',
            label: 'Task Achievement',
            score: taskAchievement,
            desc: "How well you achieved the task requirements.",
            color: 'blue' as const,
            icon: <CheckCircle className="w-4 h-4" />
        },
        {
            id: 'coherence_cohesion',
            label: 'Coherence',
            score: coherence,
            desc: "The flow of your essay and connection of ideas.",
            color: 'indigo' as const,
            icon: <LayoutList className="w-4 h-4" />

        },
        {
            id: 'lexical_resource',
            label: 'Vocabulary',
            score: lexical,
            desc: "The range and accuracy of vocabulary used.",
            color: 'amber' as const,
            icon: <BookOpen className="w-4 h-4" />
        },
        {
            id: 'grammatical_range_accuracy',
            label: 'Grammar',
            score: grammar,
            desc: "Variety of sentence structures and accuracy.",
            color: 'emerald' as const,
            icon: <Scale className="w-4 h-4" />
        },
    ];

    // Determine Logic
    const showFullFeedback = selectedCriterion === 'full_feedback';
    const currentData = !showFullFeedback ? getCriterionData(selectedCriterion) : null;
    const currentCriterionDef = criteriaList.find(c => c.id === selectedCriterion) || criteriaList[0];

    // Extract Highlights
    const getHighlights = (): HighlightRange[] => {
        if (showFullFeedback || !currentData) return [];

        const highlights: HighlightRange[] = [];

        // Strengths (Green)
        if (currentData.strengths && Array.isArray(currentData.strengths)) {
            currentData.strengths.forEach((s: any) => {
                // The 'quote' field often contains the exact text to highlight
                if (s.quote) highlights.push({ text: s.quote, type: 'strength' });
                else if (s.text) highlights.push({ text: s.text, type: 'strength' });
            });
        }

        // Weaknesses (Amber)
        if (currentData.weakness_patterns && Array.isArray(currentData.weakness_patterns)) {
            currentData.weakness_patterns.forEach((w: any) => {
                if (w.identified_issue) {
                    highlights.push({ text: w.identified_issue, type: 'weakness' });
                }
            });
        }

        return highlights;
    };

    const highlights = getHighlights();

    return (
        <Card className="w-full bg-slate-950 border-slate-900 shadow-2xl overflow-hidden flex flex-col h-full border-0 rounded-none md:rounded-2xl">

            <div className="flex-1 flex overflow-hidden">
                {/* 1. LEFT SIDEBAR */}
                <div className="w-[280px] bg-slate-950 border-r border-slate-900/80 flex flex-col shrink-0 z-10">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-slate-900/80">
                        <button className="flex items-center text-slate-500 hover:text-white mb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                            <ArrowLeft className="w-2.5 h-2.5 mr-2" />
                            Back
                        </button>
                        <h2 className="text-sm font-black text-white/90 uppercase tracking-wider mb-2">Essay Analysis</h2>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-wider border border-emerald-500/20">
                                BAND {result.overall_band}
                            </span>
                            <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">{result.word_count} Words</span>
                        </div>
                    </div>

                    {/* Criteria List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {criteriaList.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedCriterion(item.id)}
                                className={cn(
                                    "cursor-pointer px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                    selectedCriterion === item.id
                                        ? "bg-slate-900 text-white"
                                        : "bg-transparent hover:bg-slate-900/50 text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {/* Active Indicator Line */}
                                {selectedCriterion === item.id && (
                                    <div className={cn("absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full",
                                        item.color === 'blue' ? "bg-blue-500" :
                                            item.color === 'indigo' ? "bg-indigo-500" :
                                                item.color === 'amber' ? "bg-amber-500" : "bg-emerald-500"
                                    )} />
                                )}

                                <div className="flex justify-between items-center mb-0.5">
                                    <h4 className="font-bold text-xs flex items-center gap-2 tracking-tight">
                                        {item.label}
                                    </h4>
                                    <span className={cn(
                                        "font-black text-[10px] px-1.5 py-0.5 rounded-md",
                                        item.score >= 7 ? "text-emerald-400 bg-emerald-950/40" :
                                            item.score >= 6 ? "text-blue-400 bg-blue-950/40" : "text-amber-400 bg-amber-950/40"
                                    )}>{item.score}</span>
                                </div>
                                <p className="text-[10px] text-slate-600 group-hover:text-slate-500 font-medium leading-tight">
                                    {item.desc}
                                </p>
                            </div>
                        ))}

                        <div className="h-px bg-slate-900/50 mx-4 my-3" />

                        {/* Full Analysis Item */}
                        <div
                            onClick={() => setSelectedCriterion('full_feedback')}
                            className={cn(
                                "cursor-pointer mx-1 px-4 py-3 rounded-xl border transition-all duration-300 group relative overflow-hidden",
                                selectedCriterion === 'full_feedback'
                                    ? "bg-slate-900 border-purple-500/30 text-white"
                                    : "bg-transparent border-transparent hover:bg-slate-900/50 hover:border-slate-800 text-slate-500"
                            )}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className={cn("p-1.5 rounded-lg shrink-0", selectedCriterion === 'full_feedback' ? "bg-purple-500/20 text-purple-400" : "bg-slate-800/50 text-slate-500 group-hover:text-slate-400")}>
                                    <Sparkles className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <h4 className={cn("font-bold text-xs tracking-tight", selectedCriterion === 'full_feedback' ? "text-white" : "group-hover:text-slate-300")}>
                                        Holistic Report
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. MIDDLE - ESSAY CONTENT */}
                {!showFullFeedback && (
                    <div className="flex-1 bg-slate-900/50 border-r border-slate-800/50 min-w-[500px] flex flex-col relative w-full">
                        <div className="p-4 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur top-0 sticky z-10 flex justify-between items-center">
                            <h3 className="font-bold text-slate-300 text-sm uppercase tracking-wider">Your Essay</h3>
                            {highlights.length > 0 && (
                                <div className="flex gap-3 text-[10px] font-bold uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5 text-emerald-400">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Strength
                                    </span>
                                    <span className="flex items-center gap-1.5 text-amber-400">
                                        <span className="w-2 h-2 rounded-full bg-amber-500" /> Improvement
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-950/30">
                            {essayText ? (
                                <HighlightedEssay essayText={essayText} highlights={highlights} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-500">
                                    No essay text available.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. RIGHT - CRITERION DETAILS */}
                <div className={cn(
                    "bg-slate-950 overflow-hidden flex flex-col relative transition-all duration-300",
                    showFullFeedback ? "flex-1 w-full" : "w-[450px] shrink-0 border-l border-slate-800/50"
                )}>
                    {/* Scrollable Content */}
                    <div className={cn(
                        "flex-1 overflow-y-auto custom-scrollbar",
                        showFullFeedback ? "px-8 py-8" : "px-6 py-6"
                    )}>
                        <div className={cn("mx-auto", showFullFeedback ? "max-w-4xl" : "")}>
                            {showFullFeedback ? (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="border-b border-slate-800 pb-6 mb-6">
                                        <h2 className="text-3xl font-bold text-white mb-2">Teacher's Report</h2>
                                        <p className="text-slate-400">Comprehensive holistic feedback and line-by-line corrections.</p>
                                    </div>
                                    <div className="prose prose-invert max-w-none prose-headings:text-slate-200 prose-p:text-slate-400 prose-strong:text-slate-200 prose-li:text-slate-400">
                                        <ReactMarkdown>{result.feedback_markdown || "No detailed feedback available."}</ReactMarkdown>
                                    </div>
                                </div>
                            ) : (
                                <CriterionContent
                                    score={currentCriterionDef.score}
                                    title={currentCriterionDef.label}
                                    data={currentData}
                                    color={currentCriterionDef.color}
                                />
                            )}
                        </div>
                    </div>

                    {/* Bottom fading gradient to indicate scroll */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
                </div>
            </div>
        </Card>
    );
};
