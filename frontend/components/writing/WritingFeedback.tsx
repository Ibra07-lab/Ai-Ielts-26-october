import React, { useState } from 'react';
import { EvaluationResult } from '@/types/writing-feedback';
import { ArrowLeft, CheckCircle, LayoutList, BookOpen, Scale, Sparkles, BarChart2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { CriterionContent } from './CriterionContent';
import { HighlightedEssay, HighlightRange } from './HighlightedEssay';
import { OverallSummary } from './OverallSummary';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";

interface WritingFeedbackProps {
    result: EvaluationResult;
    essayText?: string;
    onRetryFeedback?: () => void;
    isLoadingFeedback?: boolean;
    onBack?: () => void;
}

export const WritingFeedback: React.FC<WritingFeedbackProps> = ({
    result,
    essayText = "",
    onRetryFeedback,
    isLoadingFeedback = false,
    onBack
}) => {
    // Default to 'overall_summary' to show the dashboard first
    const [selectedCriterion, setSelectedCriterion] = useState<string>('overall_summary');

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

    // Determine View Logic
    const isOverall = selectedCriterion === 'overall_summary';
    const isHolistic = selectedCriterion === 'holistic_report';
    const isCriterion = !isOverall && !isHolistic;

    const currentData = isCriterion ? getCriterionData(selectedCriterion) : null;
    const currentCriterionDef = criteriaList.find(c => c.id === selectedCriterion);

    // Extract Highlights
    const getHighlights = (): HighlightRange[] => {
        if (!isCriterion || !currentData) return [];

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
        <div className="h-screen bg-[#121212] flex flex-col overflow-hidden">
            {/* Top Navigation Bar - Full Width */}
            <header className="flex justify-between items-center px-6 py-4 border-b border-slate-800/40">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Tests
                    </button>
                    <h1 className="text-xl font-bold text-white">Test 3: Academic Task 1</h1>
                </div>

                <div className="flex items-center gap-6">
                    {/* Word Count */}
                    <div className="flex items-center gap-2">
                        <span className="text-teal-400 font-bold text-lg">{result.word_count}</span>
                        <span className="text-slate-500 text-sm">/ 150</span>
                    </div>

                    {/* Timer */}
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <span>⏱</span>
                        <span>19:36</span>
                    </div>

                    {/* Analysis Status */}
                    <div className="px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-medium">
                        Analysis Complete: {result.overall_band} Band
                    </div>
                </div>
            </header>

            {/* 3-Column Grid Layout - Full Width, Full Height */}
            <div className="grid grid-cols-[260px_1fr_350px] gap-0 flex-1 overflow-hidden">

                {/* 1. LEFT SIDEBAR - Minimal styling */}
                <div className="bg-slate-950/50 border-r border-slate-800/40 flex flex-col overflow-hidden">
                    {/* Sidebar Header */}
                    <div className="p-5 pb-4 border-b border-slate-800/40">
                        <h2 className="text-base font-bold text-white mb-2">Essay Analysis</h2>
                        <div className="flex items-center gap-3">
                            <span className={cn(
                                "px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide border",
                                result.overall_band >= 7 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                    result.overall_band >= 6 ? "bg-teal-500/10 text-teal-400 border-teal-500/20" :
                                        "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            )}>
                                Band {result.overall_band}
                            </span>
                            <span className="text-slate-500 text-[10px] font-medium tracking-wide">
                                {result.word_count} Words
                            </span>
                        </div>
                    </div>

                    {/* Criteria List */}
                    <div className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
                        {criteriaList.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedCriterion(item.id)}
                                className={cn(
                                    "p-3 rounded-lg border-2 transition-all cursor-pointer",
                                    selectedCriterion === item.id
                                        ? "bg-slate-800/50 border-teal-500 text-teal-400"
                                        : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800/30 hover:border-slate-700"
                                )}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="space-y-0.5">
                                        <h4 className={cn(
                                            "text-[13px] font-semibold transition-colors",
                                            selectedCriterion === item.id ? "text-teal-400" : "text-slate-300"
                                        )}>
                                            {item.label}
                                        </h4>
                                        <p className="text-[10px] text-slate-600 line-clamp-1 font-medium">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <span className={cn(
                                        "font-bold text-sm",
                                        item.score >= 7 ? "text-emerald-400" :
                                            item.score >= 6 ? "text-teal-400" : "text-amber-400"
                                    )}>{item.score}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Buttons */}
                    <div className="p-3 space-y-2 border-t border-slate-800/40">
                        <button
                            onClick={() => setSelectedCriterion('overall_summary')}
                            className={cn(
                                "w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-full transition-all text-sm font-medium",
                                selectedCriterion === 'overall_summary'
                                    ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                                    : "bg-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
                            )}
                        >
                            <BarChart2 className="w-4 h-4" />
                            Overall Summary
                        </button>
                        <button
                            onClick={() => setSelectedCriterion('holistic_report')}
                            className={cn(
                                "w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-full transition-all text-sm font-medium",
                                selectedCriterion === 'holistic_report'
                                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                    : "bg-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
                            )}
                        >
                            <Sparkles className="w-4 h-4" />
                            Holistic Report
                        </button>
                    </div>
                </div>

                {/* 2. CENTER - ESSAY (Editor-style, no card) */}
                <div className="bg-[#0D0D0D] flex flex-col overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-800/40 flex justify-between items-center">
                        <h3 className="font-semibold text-white text-sm">Your Essay</h3>
                        <div className="flex gap-4 text-[9px] font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1.5 text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" /> Strength
                            </span>
                            <span className="flex items-center gap-1.5 text-amber-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]" /> Improvement
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* Centered text content with max-width for readability */}
                        <div className="max-w-[750px] mx-auto px-12 py-10">
                            {essayText ? (
                                <div className="text-[18px] leading-[1.8] text-slate-200">
                                    <HighlightedEssay essayText={essayText} highlights={highlights} />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-500">
                                    No essay text available.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. RIGHT - FEEDBACK */}
                <div className="bg-slate-950/50 border-l border-slate-800/40 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                        {isOverall && (
                            <OverallSummary result={result} />
                        )}

                        {isHolistic && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="border-b border-slate-800 pb-6 mb-2">
                                    <h2 className="text-2xl font-bold text-white mb-2">Teacher's Report</h2>
                                    <p className="text-slate-400 text-sm">Comprehensive holistic feedback and corrections.</p>
                                </div>
                                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-slate-200 prose-p:text-slate-400 prose-strong:text-emerald-400 prose-li:text-slate-400">
                                    <ReactMarkdown>{result.feedback_markdown || "No detailed feedback available."}</ReactMarkdown>
                                </div>
                            </div>
                        )}

                        {isCriterion && currentCriterionDef && (
                            <CriterionContent
                                score={currentCriterionDef.score}
                                title={currentCriterionDef.label}
                                data={currentData}
                                color={currentCriterionDef.color}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
