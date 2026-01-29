import React, { useState } from 'react';
import { EvaluationResult } from '@/types/writing-feedback';
import { ArrowLeft, CheckCircle, LayoutList, BookOpen, Scale, BarChart2, ChevronRight } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { CriterionExplanation } from './CriterionExplanation';
import { HighlightedEssay, HighlightRange } from './HighlightedEssay';
import { Button } from "@/components/ui/button";
import { OverallSummary } from './OverallSummary';

interface WritingFeedbackProps {
    result: EvaluationResult;
    essayText?: string;
    onRetryFeedback?: () => void;
    isLoadingFeedback?: boolean;
    onBack?: () => void;
    taskType?: 1 | 2;
}

export const WritingFeedback: React.FC<WritingFeedbackProps> = ({
    result,
    essayText = "",
    onRetryFeedback,
    isLoadingFeedback = false,
    onBack,
    taskType = 1
}) => {
    // Current tab selection: specific criterion ID, 'summary', or 'holistic'
    const [selectedTab, setSelectedTab] = useState<string>('task_achievement');

    // Helper to find specific criterion score
    const getScore = (criteria: string) => {
        return result.criterion_scores.find(s => s.criterion === criteria)?.band || 0;
    };

    const taskAchievement = getScore('task_achievement') || getScore('task_response');
    const coherence = getScore('coherence_cohesion');
    const lexical = getScore('lexical_resource');
    const grammar = getScore('grammatical_range_accuracy') || getScore('grammatical_range');

    const criteriaList = [
        {
            id: 'task_achievement',
            label: 'Task Achievement',
            score: taskAchievement,
        },
        {
            id: 'coherence_cohesion',
            label: 'Coherence',
            score: coherence,
        },
        {
            id: 'lexical_resource',
            label: 'Vocabulary',
            score: lexical,
        },
        {
            id: 'grammatical_range_accuracy',
            label: 'Grammar',
            score: grammar,
        },
    ];

    // Get current criterion explanation
    const getCriterionExplanation = (criterion: string) => {
        if (!result.explanations) return null;
        if (criterion === 'grammatical_range_accuracy') {
            return result.explanations.grammatical_range_accuracy;
        }
        // @ts-ignore
        return result.explanations[criterion] || null;
    };

    const currentTabDef = criteriaList.find(c => c.id === selectedTab);
    const currentExplanation = getCriterionExplanation(selectedTab);

    // Extract Highlights from Explanation
    const getHighlights = (): HighlightRange[] => {
        if (!currentExplanation) return [];
        const highlights: HighlightRange[] = [];

        // Strengths (Green)
        if (currentExplanation.what_you_did_well && Array.isArray(currentExplanation.what_you_did_well)) {
            currentExplanation.what_you_did_well.forEach((item: any) => {
                if (item.quote) highlights.push({ text: item.quote, type: 'strength' });
            });
        }

        // Weaknesses (Amber)
        if (currentExplanation.main_issues && Array.isArray(currentExplanation.main_issues)) {
            currentExplanation.main_issues.forEach((issue: any) => {
                if (issue.examples && Array.isArray(issue.examples)) {
                    issue.examples.forEach((ex: string) => {
                        highlights.push({ text: ex, type: 'weakness' });
                    });
                }
            });
        }
        return highlights;
    };

    return (
        <div className="h-full bg-[#0f172a] text-slate-100 flex flex-col overflow-hidden">
            {/* 1. TOP HEADER */}
            <header className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#1e293b]/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Tests
                    </button>
                    <div className="h-4 w-px bg-white/10" />
                    <h1 className="text-base font-bold text-white">Test 3: Academic Task 1</h1>
                </div>

                <div className="flex items-center gap-6">
                    {/* Word Count Pill */}
                    <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <span className="text-xs opacity-70">WORDS</span>
                        <span>{result.word_count}</span>
                        <span className="text-xs opacity-50 font-medium">/ {taskType === 1 ? 150 : 250}</span>
                    </div>

                    {/* Timer Pill */}
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        <span className="opacity-70 text-[10px]">⏱</span>
                        <span>19:36</span>
                    </div>

                    {/* Analysis Complete Pill */}
                    <div className="px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-bold tracking-tight flex items-center gap-2">
                        <span className="text-teal-500">✓</span>
                        Analysis Complete: <span className="text-white ml-1">{result.overall_band} Band</span>

                        {/* Development Tool: Export JSON */}
                        <button
                            onClick={() => {
                                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
                                const downloadAnchorNode = document.createElement('a');
                                downloadAnchorNode.setAttribute("href", dataStr);
                                downloadAnchorNode.setAttribute("download", `feedback_snapshot_${new Date().getTime()}.json`);
                                document.body.appendChild(downloadAnchorNode);
                                downloadAnchorNode.click();
                                downloadAnchorNode.remove();
                            }}
                            className="ml-2 p-1 hover:bg-white/10 rounded-md transition-colors opacity-30 hover:opacity-100"
                            title="Export JSON for Development"
                        >
                            <div className="w-3.5 h-3.5 border border-current rounded-[3px] flex items-center justify-center text-[8px] font-black">JSON</div>
                        </button>
                    </div>
                </div>
            </header>

            {/* 2. SUB-NAVIGATION BAR (Top horizontal nav as requested) */}
            <div className="px-6 py-3 border-b border-white/5 bg-[#1e293b]/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {criteriaList.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedTab(item.id)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border",
                                selectedTab === item.id
                                    ? "bg-teal-500/20 border-teal-500/50 text-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                                    : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                            )}
                        >
                            {item.label}
                            <span className={cn(
                                "ml-1 opacity-80",
                                item.score >= 7 ? "text-emerald-400" :
                                    item.score >= 6 ? "text-teal-400" : "text-amber-400"
                            )}>{item.score}</span>
                        </button>
                    ))}

                    <div className="h-6 w-px bg-white/10 mx-2" />

                    <button
                        onClick={() => setSelectedTab('summary')}
                        className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border",
                            selectedTab === 'summary'
                                ? "bg-teal-500/20 border-teal-500/50 text-teal-400"
                                : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                        )}
                    >
                        <BarChart2 className="w-3.5 h-3.5" />
                        Summary
                    </button>

                </div>
            </div>

            {/* 3. MAIN CONTENT AREA */}
            <div className="flex-1 overflow-hidden relative">
                {selectedTab === 'summary' ? (
                    <div className="h-full overflow-y-auto custom-scrollbar p-8 bg-[#0f172a]">
                        <div className="max-w-[1600px] mx-auto">
                            <OverallSummary result={result} />
                        </div>
                    </div>
                ) : (
                    /* 2-Column Grid Layout: Essay | Feedback */
                    <div className="grid grid-cols-[1fr_600px] h-full overflow-hidden">
                        {/* LEFT: ESSAY */}
                        <div className="bg-[#0f172a] flex flex-col overflow-hidden relative border-r border-white/5">
                            {/* Subtle gradient background */}
                            <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none" />

                            <div className="px-8 py-5 flex justify-between items-center relative z-10">
                                <h3 className="font-bold text-white text-sm tracking-wide">Your Essay</h3>
                                <div className="flex gap-5 text-[10px] font-black uppercase tracking-widest">
                                    <span className="flex items-center gap-2 text-emerald-400">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Strength
                                    </span>
                                    <span className="flex items-center gap-2 text-amber-500">
                                        <span className="w-2 h-2 rounded-full bg-amber-500" /> Improvement
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar px-12 py-6 relative z-10">
                                <div className="max-w-3xl mx-auto leading-[2]">
                                    <HighlightedEssay
                                        essayText={essayText}
                                        highlights={getHighlights()}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: CRITERION FEEDBACK */}
                        <div className="bg-[#111827] flex flex-col overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.3)]">
                            <div className="px-6 py-4 border-b border-white/5 bg-[#1e293b]/20 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-white leading-none mb-1">
                                        {currentTabDef?.label}
                                    </h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Criterion Analysis</p>
                                </div>
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex flex-col items-center justify-center border",
                                    (currentTabDef?.score || 0) >= 7 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                        (currentTabDef?.score || 0) >= 6 ? "bg-teal-500/10 border-teal-500/20 text-teal-400" :
                                            "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                )}>
                                    <span className="text-[8px] font-black opacity-60">BAND</span>
                                    <span className="text-xl font-black">{currentTabDef?.score}</span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {currentTabDef && currentExplanation ? (
                                    <CriterionExplanation
                                        explanation={currentExplanation}
                                        criterionName={currentTabDef.label}
                                    />
                                ) : (
                                    <div className="p-12 text-center text-slate-500">
                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <BookOpen className="w-6 h-6 opacity-20" />
                                        </div>
                                        <p className="text-sm">Feedback is loading or unavailable for this criterion.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
