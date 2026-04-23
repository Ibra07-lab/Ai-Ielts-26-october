import { useState, useMemo } from 'react';
import { diffWords } from 'diff';
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, AlertTriangle, BookOpen, PenTool, Layout, Scale, AlignLeft, AlertCircle, ArrowRight, Info, Target, FileText, Sparkles, Merge, Activity, ShieldAlert, Dumbbell, Clock, ListChecks, Lightbulb, Map, Compass, TrendingUp, ArrowUpCircle, List, Table, Check, X, XCircle, Type, Anchor, GitMerge, ChevronRight, RefreshCw, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HighlightedEssay, Correction } from "./HighlightedEssay";
import { ImprovedIntroduction } from "./ImprovedIntroduction";
import { EvaluationResult, CoachingResult, Criterion, Highlight } from "@/types/writing-feedback";
import { transformToHighlights } from "@/utils/feedback-transform";
import { cn } from "@/lib/utils";

interface FeedbackDeepDiveViewProps {
    essay: string;
    evaluation: EvaluationResult;
    coaching: CoachingResult;
    activeCriterion: Criterion | null;
    taskType?: "task1" | "task2";
    onBack: () => void;
    onCriterionChange: (criterion: Criterion) => void;
}

const CRITERIA_CONFIG: Record<string, { label: string, icon: any, description: string }> = {
    task_response: {
        label: "Task Response",
        icon: Scale,
        description: "How well you addressed the prompt and developed your ideas."
    },
    task_achievement: {
        label: "Task Achievement",
        icon: Scale,
        description: "How well you achieved the task requirements."
    },
    coherence_cohesion: {
        label: "Coherence",
        icon: Layout,
        description: "The flow of your essay and how well ideas are connected."
    },
    lexical_resource: {
        label: "Vocabulary",
        icon: BookOpen,
        description: "The range and accuracy of vocabulary used."
    },
    grammatical_range_accuracy: {
        label: "Grammar",
        icon: PenTool,
        description: "Variety of sentence structures and grammatical correctness."
    }
};

const CC_BAND_DESCRIPTORS_TASK1: Record<number, string> = {
    4: "Little or no data grouping. Frequent mechanical repetition.",
    5: "Organization is inadequate. Data is rarely grouped. Repetitive mechanical linking.",
    6: "Information is arranged coherently. Cohesion is effective but sometimes mechanical or listed.",
    7: "Logically organizes data with clear progression. Uses a range of cohesive devices appropriately.",
    8: "Data is grouped by trend, not listed mechanically. Overview is perfectly positioned. Connectors are varied and natural. No ambiguous pronoun references.",
    9: "Uses cohesion in such a way that it attracts no attention. Sequences informational trends naturally and seamlessly."
};

const CC_BAND_DESCRIPTORS_TASK2: Record<number, string> = {
    4: "Basic communication of ideas. Very limited cohesion.",
    5: "Organization is inadequate. Linking devices are repetitive or lacking. Referencing is unclear.",
    6: "Information is arranged coherently with a clear progression. Cohesion is effective but sometimes mechanical.",
    7: "Logically organizes information with clear progression. Uses a range of cohesive devices appropriately.",
    8: "Sequences information logically. Manages all aspects of cohesion well. Paragraphing used seamlessly.",
    9: "Uses cohesion in such a way that it attracts no attention. Sequences information naturally and seamlessly."
};

function CCBandLadder({ rawCurrentScore, taskType }: { rawCurrentScore: number, taskType?: "task1" | "task2" }) {
    const targetScore = Math.min(Math.floor(rawCurrentScore) + 1, 9);
    const scoreToUse = Math.floor(rawCurrentScore);
    const isHalfBand = rawCurrentScore % 1 !== 0;
    
    // We'll show bands 5 through 8 (or 9 if target is 9)
    const bandsToShow = [8, 7, 6, 5];
    if (targetScore >= 9) {
        if (!bandsToShow.includes(9)) bandsToShow.unshift(9);
    }
    if (scoreToUse < 5) {
        bandsToShow.push(4);
    }
    
    const descriptors = taskType === 'task1' ? CC_BAND_DESCRIPTORS_TASK1 : CC_BAND_DESCRIPTORS_TASK2;

    const getSessionTip = () => {
        if (taskType === 'task1') {
            return rawCurrentScore >= 7 
                ? "Vary your paragraph transitions and eliminate the mechanical time marker repetition identified in this session."
                : "Vary your linking devices - avoid mechanical patterns. Improve paragraph transitions through flow, not just mechanical listing.";
        }
        return rawCurrentScore >= 7 
            ? "To break into Band 8, focus on eliminating mechanical linking patterns. Use sophisticated referencing naturally (this approach, such findings)."
            : "Vary your linking devices - avoid mechanical patterns like 'Firstly, Secondly'. Improve paragraph transitions through meaning.";
    };

    return (
        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mb-6">
            <div className="bg-fuchsia-50 dark:bg-fuchsia-900/20 p-5 pl-6 border-b border-fuchsia-100 dark:border-fuchsia-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-fuchsia-100 dark:bg-fuchsia-500/20 rounded-xl text-fuchsia-600 dark:text-fuchsia-400"><Target className="w-5 h-5" /></div>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Coherence Score Ladder</span>
                </div>
            </div>
            <div className="p-5 sm:p-6 pl-8">
                <div className="relative border-l border-slate-200 dark:border-slate-700/80 ml-2 space-y-6 pb-2">
                    {bandsToShow.map((band) => {
                        const isCurrentDesc = band === scoreToUse;
                        const isTarget = band === targetScore;
                        const isCompleted = band < scoreToUse;
                        const opacity = (band > targetScore || band < scoreToUse - 1) ? 'opacity-40' : 'opacity-100';
                        const descriptor = descriptors[band] || "Basic communication of ideas.";
                        
                        return (
                            <div key={band} className="contents">
                                {/* Inject explicit half-band row floating above the integer equivalent! */}
                                {isCurrentDesc && isHalfBand && (
                                    <div className="relative pl-8 opacity-100 mb-6">
                                        <div className="absolute -left-[9px] top-1 w-[17px] h-[17px] rounded-full border-[3px] border-amber-500 bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)] z-20" />
                                        <div className="flex flex-wrap items-center gap-3 mb-1.5">
                                            <span className="text-[12px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded shadow-sm flex items-center gap-1.5 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
                                                <AlignLeft className="w-3 h-3" />
                                                Band {rawCurrentScore}
                                            </span>
                                            <span className="text-[11px] font-bold text-amber-600/80 dark:text-amber-500/70 uppercase tracking-wider bg-white dark:bg-transparent rounded px-1">&larr; YOUR SCORE</span>
                                        </div>
                                    </div>
                                )}

                                <div className={`relative pl-8 ${opacity} transition-opacity duration-300 ${!isCurrentDesc || !isHalfBand ? '' : 'mt-[-0.75rem] opacity-70'}`}>
                                    {/* Node dot only for whole bands */}
                                    <div className={`absolute -left-[9px] top-1 w-[17px] h-[17px] rounded-full border-[3px] bg-white dark:bg-slate-900 ${
                                        isCurrentDesc && !isHalfBand ? 'border-amber-500 bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]' : 
                                        isTarget ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 
                                        isCompleted || isCurrentDesc ? 'border-indigo-400/50 dark:border-indigo-500/30' :
                                        'border-slate-200 dark:border-slate-700'
                                    } z-10`} />
                                    
                                    {/* Connecting line highlight (only between current and target) */}
                                    {isTarget && (band !== bandsToShow[bandsToShow.length - 1]) && (
                                        <div className="absolute -left-[2px] top-4 w-[2px] h-[calc(100%+8px)] bg-gradient-to-b from-emerald-400/50 to-amber-400/50 z-0 hidden sm:block" style={{ transform: 'translateY(4px)' }} />
                                    )}
                                    
                                    {/* Label badge */}
                                    <div className="flex flex-wrap items-center gap-3 mb-1.5">
                                        <span className={`text-[12px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded shadow-sm flex items-center gap-1.5 ${
                                            isCurrentDesc && !isHalfBand ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20' : 
                                            isTarget ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20' : 
                                            isCompleted || isCurrentDesc ? 'bg-slate-50 text-slate-500 dark:bg-slate-800/40 dark:text-slate-500 border border-transparent' :
                                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700'
                                        }`}>
                                            {isTarget && <ArrowUpCircle className="w-3 h-3" />}
                                            {(isCurrentDesc && !isHalfBand) && <AlignLeft className="w-3 h-3" />}
                                            {(isCompleted || (isCurrentDesc && isHalfBand)) && <CheckCircle2 className="w-3 h-3" />}
                                            Band {band}
                                        </span>
                                        {isCurrentDesc && !isHalfBand && <span className="text-[11px] font-bold text-amber-600/80 dark:text-amber-500/70 uppercase tracking-wider bg-white dark:bg-transparent rounded px-1">&larr; YOUR SCORE</span>}
                                        {isTarget && <span className="text-[11px] font-bold text-emerald-600/80 dark:text-emerald-500/70 uppercase tracking-wider bg-white dark:bg-transparent rounded px-1">&larr; NEXT MILESTONE</span>}
                                    </div>
                                    
                                    <p className={`text-[14px] leading-[1.6] ${
                                        isCurrentDesc && !isHalfBand ? 'text-slate-800 dark:text-slate-200 font-semibold' : 
                                        isTarget ? 'text-slate-700 dark:text-slate-300 font-medium' : 
                                        'text-slate-500 dark:text-slate-400 font-medium'
                                    }`}>
                                        {descriptor}
                                    </p>

                                    {/* Target Band Action Tip */}
                                    {isTarget && (
                                        <div className="mt-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 border-l-2 border-l-emerald-400/70 dark:border-l-emerald-500/50 p-3.5 rounded-r-xl rounded-l-sm shadow-sm relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/30 to-transparent dark:from-emerald-900/20 mix-blend-multiply opacity-50 z-0"></div>
                                            <p className="text-[13px] text-emerald-800 dark:text-emerald-300 leading-relaxed relative z-10">
                                                <strong className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest text-[11px] block mb-1.5 flex items-center gap-1.5 content-center">
                                                    <Target className="w-3.5 h-3.5" /> To get here:
                                                </strong>
                                                <span className="opacity-90">{getSessionTip()}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const TA_BAND_DESCRIPTORS_TASK1: Record<number, string> = {
    4: "Attempts the task but covers data inadequately. May add personal opinions. No overview.",
    5: "Recounts some detail but no clear overview. Presents limited key features. May misread data points.",
    6: "Addresses the task. Presents an overview with key features, but may be unclear or lack detail. Data is generally accurate.",
    7: "Covers all key features with clear overview. Data is accurate. Key trends are well-selected and supported.",
    8: "Covers all requirements sufficiently. Clearly presents and highlights key features. Data is fully accurate with appropriate detail.",
    9: "Fully satisfies all requirements. Comprehensive overview with precisely selected and compared key features."
};

const TA_BAND_DESCRIPTORS_TASK2: Record<number, string> = {
    4: "Responds to the task only in a minimal way. May be tangential or off-topic in places.",
    5: "Addresses the task only partially. Ideas may be underdeveloped or irrelevant. Position is unclear.",
    6: "Addresses all parts of the task. Presents a relevant position. Main ideas are relevant but may be inadequately developed.",
    7: "Addresses all parts of the task. Presents a clear position throughout. Main ideas are extended and supported.",
    8: "Sufficiently addresses all parts of the task. Presents a well-developed response with relevant extended ideas.",
    9: "Fully addresses all parts of the task. Presents a fully developed position with well-supported ideas."
};

function TABandLadder({ rawCurrentScore, taskType, dataCoverage }: { rawCurrentScore: number, taskType?: "task1" | "task2", dataCoverage?: any }) {
    const targetScore = Math.min(Math.floor(rawCurrentScore) + 1, 9);
    const scoreToUse = Math.floor(rawCurrentScore);
    const isHalfBand = rawCurrentScore % 1 !== 0;

    const bandsToShow = [8, 7, 6, 5];
    if (targetScore >= 9) {
        if (!bandsToShow.includes(9)) bandsToShow.unshift(9);
    }
    if (scoreToUse < 5) {
        bandsToShow.push(4);
    }

    const descriptors = taskType === 'task1' ? TA_BAND_DESCRIPTORS_TASK1 : TA_BAND_DESCRIPTORS_TASK2;

    const getSessionTip = () => {
        if (taskType === 'task1') {
            if (rawCurrentScore >= 7) {
                return "Ensure every key feature is covered with precise data. Strengthen your overview to highlight the 2-3 most significant trends without citing specific numbers.";
            }
            return "Write a clear overview sentence summarising the main trends. Cover all key features from the chart and double-check every data value you cite.";
        }
        return rawCurrentScore >= 7
            ? "Extend and support each main idea with specific examples. Ensure your position is consistent throughout."
            : "Clearly state your position in the introduction. Develop each main idea with relevant examples and explanations.";
    };

    return (
        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mb-6">
            <div className="bg-sky-50 dark:bg-sky-900/20 p-5 pl-6 border-b border-sky-100 dark:border-sky-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-100 dark:bg-sky-500/20 rounded-xl text-sky-600 dark:text-sky-400"><Target className="w-5 h-5" /></div>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                        {taskType === 'task1' ? 'Task Achievement' : 'Task Response'} Score Ladder
                    </span>
                </div>
                {dataCoverage && (
                    <div className="hidden sm:flex items-center gap-2 text-xs font-bold">
                        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                            {dataCoverage.features_covered ?? '?'}/{dataCoverage.total_key_features ?? '?'} covered
                        </span>
                    </div>
                )}
            </div>
            <div className="p-5 sm:p-6 pl-8">
                <div className="relative border-l border-slate-200 dark:border-slate-700/80 ml-2 space-y-6 pb-2">
                    {bandsToShow.map((band) => {
                        const isCurrentDesc = band === scoreToUse;
                        const isTarget = band === targetScore;
                        const isCompleted = band < scoreToUse;
                        const opacity = (band > targetScore || band < scoreToUse - 1) ? 'opacity-40' : 'opacity-100';
                        const descriptor = descriptors[band] || "Basic task attempt.";

                        return (
                            <div key={band} className="contents">
                                {isCurrentDesc && isHalfBand && (
                                    <div className="relative pl-8 opacity-100 mb-6">
                                        <div className="absolute -left-[9px] top-1 w-[17px] h-[17px] rounded-full border-[3px] border-amber-500 bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)] z-20" />
                                        <div className="flex flex-wrap items-center gap-3 mb-1.5">
                                            <span className="text-[12px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded shadow-sm flex items-center gap-1.5 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
                                                <AlignLeft className="w-3 h-3" />
                                                Band {rawCurrentScore}
                                            </span>
                                            <span className="text-[11px] font-bold text-amber-600/80 dark:text-amber-500/70 uppercase tracking-wider bg-white dark:bg-transparent rounded px-1">&larr; YOUR SCORE</span>
                                        </div>
                                    </div>
                                )}

                                <div className={`relative pl-8 ${opacity} transition-opacity duration-300 ${!isCurrentDesc || !isHalfBand ? '' : 'mt-[-0.75rem] opacity-70'}`}>
                                    <div className={`absolute -left-[9px] top-1 w-[17px] h-[17px] rounded-full border-[3px] bg-white dark:bg-slate-900 ${
                                        isCurrentDesc && !isHalfBand ? 'border-amber-500 bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]' :
                                        isTarget ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 shadow-[0_0_8px_rgba(16,185,129,0.3)]' :
                                        isCompleted || isCurrentDesc ? 'border-sky-400/50 dark:border-sky-500/30' :
                                        'border-slate-200 dark:border-slate-700'
                                    } z-10`} />

                                    {isTarget && (band !== bandsToShow[bandsToShow.length - 1]) && (
                                        <div className="absolute -left-[2px] top-4 w-[2px] h-[calc(100%+8px)] bg-gradient-to-b from-emerald-400/50 to-amber-400/50 z-0 hidden sm:block" style={{ transform: 'translateY(4px)' }} />
                                    )}

                                    <div className="flex flex-wrap items-center gap-3 mb-1.5">
                                        <span className={`text-[12px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded shadow-sm flex items-center gap-1.5 ${
                                            isCurrentDesc && !isHalfBand ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20' :
                                            isTarget ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20' :
                                            isCompleted || isCurrentDesc ? 'bg-slate-50 text-slate-500 dark:bg-slate-800/40 dark:text-slate-500 border border-transparent' :
                                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700'
                                        }`}>
                                            {isTarget && <ArrowUpCircle className="w-3 h-3" />}
                                            {(isCurrentDesc && !isHalfBand) && <AlignLeft className="w-3 h-3" />}
                                            {(isCompleted || (isCurrentDesc && isHalfBand)) && <CheckCircle2 className="w-3 h-3" />}
                                            Band {band}
                                        </span>
                                        {isCurrentDesc && !isHalfBand && <span className="text-[11px] font-bold text-amber-600/80 dark:text-amber-500/70 uppercase tracking-wider bg-white dark:bg-transparent rounded px-1">&larr; YOUR SCORE</span>}
                                        {isTarget && <span className="text-[11px] font-bold text-emerald-600/80 dark:text-emerald-500/70 uppercase tracking-wider bg-white dark:bg-transparent rounded px-1">&larr; NEXT MILESTONE</span>}
                                    </div>

                                    <p className={`text-[14px] leading-[1.6] ${
                                        isCurrentDesc && !isHalfBand ? 'text-slate-800 dark:text-slate-200 font-semibold' :
                                        isTarget ? 'text-slate-700 dark:text-slate-300 font-medium' :
                                        'text-slate-500 dark:text-slate-400 font-medium'
                                    }`}>
                                        {descriptor}
                                    </p>

                                    {isTarget && (
                                        <div className="mt-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 border-l-2 border-l-emerald-400/70 dark:border-l-emerald-500/50 p-3.5 rounded-r-xl rounded-l-sm shadow-sm relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/30 to-transparent dark:from-emerald-900/20 mix-blend-multiply opacity-50 z-0"></div>
                                            <p className="text-[13px] text-emerald-800 dark:text-emerald-300 leading-relaxed relative z-10">
                                                <strong className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest text-[11px] block mb-1.5 flex items-center gap-1.5 content-center">
                                                    <Target className="w-3.5 h-3.5" /> To get here:
                                                </strong>
                                                <span className="opacity-90">{getSessionTip()}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function TAPriorityBanner({ dataCoverage, overviewFeedback }: { dataCoverage?: any, overviewFeedback?: any }) {
    const alerts: { icon: React.ReactNode; label: string; detail: string; severity: 'critical' | 'high' }[] = [];

    // Check overview missing (critical)
    if (overviewFeedback && !overviewFeedback.overview_present) {
        alerts.push({
            icon: <AlertCircle className="w-4 h-4" />,
            label: "No Overview",
            detail: "Missing overview caps TA at Band 5. Add a sentence summarising the 2-3 main trends.",
            severity: 'critical'
        });
    }

    if (dataCoverage) {
        // Check ignored dual chart (critical)
        if (dataCoverage.ignored_dual_chart) {
            alerts.push({
                icon: <AlertCircle className="w-4 h-4" />,
                label: "Chart Ignored",
                detail: "One chart was completely ignored. Both charts must be addressed to score above Band 5.",
                severity: 'critical'
            });
        }

        // Check personal opinion (high)
        if (dataCoverage.has_personal_opinion) {
            alerts.push({
                icon: <AlertTriangle className="w-4 h-4" />,
                label: "Personal Opinion Detected",
                detail: `Task 1 is strict reporting — remove: "${dataCoverage.opinion_sentence?.substring(0, 80)}${(dataCoverage.opinion_sentence?.length || 0) > 80 ? '...' : ''}"`,
                severity: 'high'
            });
        }

        // Check data accuracy (high — only significant misreads)
        if (dataCoverage.data_accuracy_issues?.length > 0) {
            alerts.push({
                icon: <AlertTriangle className="w-4 h-4" />,
                label: `${dataCoverage.data_accuracy_issues.length} Significant Data Error${dataCoverage.data_accuracy_issues.length > 1 ? 's' : ''}`,
                detail: "Wrong trend or significantly inaccurate figures found. Minor approximations from chart reading are fine — these are larger errors.",
                severity: 'high'
            });
        }

        // Check missed key features (high if many)
        const missedCount = dataCoverage.feature_map?.filter((f: any) => !f.covered_in_essay)?.length || 0;
        if (missedCount >= 2) {
            alerts.push({
                icon: <AlertTriangle className="w-4 h-4" />,
                label: `${missedCount} Key Features Missed`,
                detail: "Covering fewer than half the key features limits TA to Band 5-6.",
                severity: 'high'
            });
        }
    }

    if (alerts.length === 0) return null;

    return (
        <div className="rounded-2xl overflow-hidden mb-6 border border-rose-200/60 dark:border-rose-800/40 shadow-[0_4px_24px_rgba(225,29,72,0.08)]">
            <div className="bg-gradient-to-r from-rose-50 via-rose-50 to-amber-50 dark:from-rose-950/30 dark:via-rose-950/20 dark:to-amber-950/20 p-4 sm:p-5 border-b border-rose-100 dark:border-rose-900/30">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-rose-100 dark:bg-rose-500/20 rounded-lg text-rose-600 dark:text-rose-400">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-extrabold text-rose-800 dark:text-rose-200 uppercase tracking-widest">Fix This First</span>
                    <span className="text-[11px] font-bold text-rose-500/70 dark:text-rose-400/50 ml-auto">{alerts.length} issue{alerts.length > 1 ? 's' : ''}</span>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-900 divide-y divide-rose-50 dark:divide-rose-900/20">
                {alerts.map((alert, i) => (
                    <div key={i} className="px-4 sm:px-5 py-3.5 flex items-start gap-3">
                        <div className={`mt-0.5 p-1 rounded-md flex-shrink-0 ${
                            alert.severity === 'critical'
                                ? 'text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-500/15'
                                : 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/15'
                        }`}>
                            {alert.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className={`text-[12px] font-black uppercase tracking-wider ${
                                    alert.severity === 'critical' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                                }`}>
                                    {alert.label}
                                </span>
                                {alert.severity === 'critical' && (
                                    <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">Critical</span>
                                )}
                            </div>
                            <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{alert.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Removed hardcoded ORDERED_CRITERIA to evaluate dynamically based on taskType


export function FeedbackDeepDiveView({
    essay,
    evaluation,
    coaching,
    activeCriterion,
    taskType = "task2",
    onBack,
    onCriterionChange
}: FeedbackDeepDiveViewProps) {
    // Helper to map frontend criterion keys to backend detailed_feedback keys
    const getDetailedFeedback = (crit: Criterion) => {
        if (!evaluation.detailed_feedback) return null;
        switch (crit) {
            case 'task_response': return evaluation.detailed_feedback.task_response;
            case 'task_achievement': return evaluation.detailed_feedback.task_response; // Map both to TR
            case 'coherence_cohesion': return evaluation.detailed_feedback.coherence;
            case 'lexical_resource': return evaluation.detailed_feedback.lexical;
            case 'grammatical_range_accuracy': return evaluation.detailed_feedback.grammar;
            default: return null;
        }
    };

    const orderedCriteria: Criterion[] = taskType === 'task1'
        ? ["task_achievement", "coherence_cohesion", "lexical_resource", "grammatical_range_accuracy"]
        : ["task_response", "coherence_cohesion", "lexical_resource", "grammatical_range_accuracy"];

    // Default to first criterion if none active
    const currentCriterion = activeCriterion || orderedCriteria[0];

    // Transform coaching text into highlights
    const highlights = useMemo(() => {
        return transformToHighlights(essay, coaching);
    }, [essay, coaching]);

    // Helper to get specific feedback items for the Right Column
    const getFeedbackItems = (criterion: Criterion) => {
        const items: { type: 'weakness' | 'info', title: string, content: string }[] = [];

        if (criterion === 'task_response' || criterion === 'task_achievement') {
            coaching.weaknesses?.forEach(w => items.push({ type: 'weakness', title: 'Improvement Area', content: w }));
            if (coaching.action_plan) {
                items.push({ type: 'info', title: 'Action Plan', content: coaching.action_plan[0] });
            }
        } else if (criterion === 'coherence_cohesion') {
            const ccScore = evaluation.criterion_scores.find(s => s.criterion === 'coherence_cohesion')?.band || 0;

            coaching.coherence_issues?.forEach(i => items.push({
                type: 'weakness',
                title: 'Cohesion Issue',
                content: `${i.text} -> ${i.corrected || i.suggestion} (${i.reason || 'see suggestion'})`
            }));
        } else if (criterion === 'lexical_resource') {
            const lrScore = evaluation.criterion_scores.find(s => s.criterion === 'lexical_resource')?.band || 0;

            coaching.vocabulary_suggestions?.forEach(v => items.push({
                type: 'weakness',
                title: 'Vocabulary Upgrade',
                content: `**"${v.original}"** is quite basic. Consider using: **${v.better_options.join(", ")}** instead. ${v.context}`
            }));

            if (lrScore < 8 && lrScore >= 5) {
                items.push({
                    type: 'info', title: 'Path to Improvement', content: lrScore >= 7
                        ? "To break into Band 8, focus on natural collocation use. Avoid overused phrases and demonstrate precise word choice."
                        : "Focus on learning topic-specific collocations and synonyms for common words. Avoid repeating the same words."
                });
            }
        } else if (criterion === 'grammatical_range_accuracy') {
            const grScore = evaluation.criterion_scores.find(s => s.criterion === 'grammatical_range_accuracy')?.band || 0;

            coaching.grammar_errors?.forEach(g => items.push({
                type: 'weakness',
                title: 'Grammar Correction',
                content: `**Original:** "${g.original}" → **Corrected:** "${g.corrected}" — ${g.explanation}`
            }));

            if (grScore < 8 && grScore >= 5) {
                items.push({
                    type: 'info', title: 'Path to Improvement', content: grScore >= 7
                        ? "To reach Band 8, focus on consistent accuracy in complex structures. Practice inversions, cleft sentences, and participle clauses."
                        : "Focus on eliminating systematic errors: article usage, subject-verb agreement, and tense consistency are common problem areas."
                });
            }
        }

        return items;
    };

    // Tab State
    const [activeTab, setActiveTab] = useState<'report' | 'issues' | 'summary'>('report');

    // Essay View Mode: 'original' or 'improved'
    const [essayViewMode, setEssayViewMode] = useState<'original' | 'improved'>('original');

    // Reset tab when criterion changes
    useMemo(() => {
        setActiveTab('report');
    }, [currentCriterion]);

    // Build corrections array from coaching data
    const corrections: Correction[] = useMemo(() => {
        const result: Correction[] = [];

        // 1. Grammar errors
        if (coaching.grammar_errors) {
            for (const err of coaching.grammar_errors) {
                if (err.original && err.corrected) {
                    result.push({
                        original: err.original,
                        corrected: err.corrected,
                        explanation: err.explanation || 'Grammar correction',
                        type: 'grammar',
                        tip: err.tip
                    });
                }
            }
        }

        // 2. Vocabulary suggestions 
        if (coaching.vocabulary_suggestions) {
            for (const sug of coaching.vocabulary_suggestions) {
                if (sug.original && sug.better_options && sug.better_options.length > 0) {
                    result.push({
                        original: sug.original,
                        corrected: sug.better_options[0], // Use first suggestion
                        explanation: sug.context || 'Better vocabulary choice',
                        type: 'vocabulary'
                    });
                }
            }
        }

        // 3. Coherence issues
        if (coaching.coherence_issues) {
            for (const issue of coaching.coherence_issues) {
                const corrected = issue.corrected || issue.suggestion;
                if (issue.text && corrected) {
                    result.push({
                        original: issue.text,
                        corrected: corrected,
                        explanation: issue.reason || 'Improved coherence',
                        type: 'coherence'
                    });
                }
            }
        }

        // 4. Macro Feedback (Paragraph Rewrites)
        const explainer = coaching.raw_explainer_output;
        if (explainer?.macro_feedback) {
            for (const macro of explainer.macro_feedback) {
                if (macro.original_paragraph && macro.improved_paragraph) {
                    result.push({
                        original: macro.original_paragraph,
                        corrected: macro.improved_paragraph,
                        explanation: macro.logic_diagnosis || 'Structural logic improvement',
                        type: 'coherence'
                    });
                }
            }
        }

        // 5. Cohesion Fixes
        if (explainer?.cohesion_fixes) {
            for (const fix of explainer.cohesion_fixes) {
                if (fix.original_sentence && fix.improved_sentence) {
                    result.push({
                        original: fix.original_sentence,
                        corrected: fix.improved_sentence,
                        explanation: fix.technique_explanation || 'Improved cohesion and flow',
                        type: 'coherence'
                    });
                }
            }
        }

        // 6. Cliche Replacements
        if (explainer?.vocabulary_feedback?.cliche_replacements) {
            for (const rel of explainer.vocabulary_feedback.cliche_replacements) {
                if (rel.original_sentence && rel.improved_sentence) {
                    result.push({
                        original: rel.original_sentence,
                        corrected: rel.improved_sentence,
                        explanation: rel.why_better || 'Better lexical choice',
                        type: 'vocabulary'
                    });
                }
            }
        }

        // 7. Task 1: Overview Feedback
        const coherence = explainer?.coherence_feedback;
        if (coherence?.overview_feedback) {
            const ov = coherence.overview_feedback;
            if (ov.original_overview && ov.improved_overview) {
                result.push({
                    original: ov.original_overview,
                    corrected: ov.improved_overview,
                    explanation: ov.issues?.join(' / ') || 'Improved overview positioning or quality',
                    type: 'coherence'
                });
            }
        }

        // 8. Task 1: Trend Fixes
        if (explainer?.trend_fixes) {
            for (const fix of explainer.trend_fixes) {
                if (fix.original_description && fix.improved_description) {
                    result.push({
                        original: fix.original_description,
                        corrected: fix.improved_description,
                        explanation: fix.why_better || 'More precise trend vocabulary',
                        type: 'vocabulary'
                    });
                }
            }
        }

        return result;
    }, [coaching]);

    const feedbackItems = getFeedbackItems(currentCriterion);
    const Icon = CRITERIA_CONFIG[currentCriterion].icon;
    const currentScore = evaluation.criterion_scores.find(s => s.criterion === currentCriterion)?.band || 0;

    // Filter items for tabs
    const issueItems = feedbackItems.filter(i => i.type === 'weakness' || (i.type === 'info' && i.title !== 'Action Plan' && i.title !== 'To Reach Band 8'));
    const actionItems = feedbackItems.filter(i => i.title === 'Action Plan' || i.title === 'To Reach Band 8');

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 overflow-hidden">

            {/* TOP BAR: Scores & Criteria Selection */}
            <div className="shrink-0 pt-1.5 px-3 md:px-5 w-full mx-auto z-[100] relative">
                <div className="bg-white dark:bg-[#0f172a] rounded-lg border border-slate-200/80 dark:border-slate-800/80 flex items-center px-3 justify-between shadow-sm flex-wrap gap-3 py-2 md:h-11 md:py-0">
                    {/* Left: Back Button + Overall Score */}
                    <div className="flex items-center gap-3 shrink-0">
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 h-7 px-2.5 text-xs"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back
                        </Button>

                        <div className="h-6 w-px bg-slate-100 dark:bg-slate-800" />

                        <div className="flex items-baseline gap-2">
                            <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Band {evaluation.overall_band}</span>
                            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-500 bg-slate-100/80 dark:bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700">{evaluation.word_count}w</span>
                        </div>
                    </div>

                    {/* Right: Criteria Selection */}
                    <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar w-full md:w-auto pb-1 md:pb-0">
                        {orderedCriteria.map(crit => {
                            const config = CRITERIA_CONFIG[crit];
                            const score = evaluation.criterion_scores.find(s => s.criterion === crit)?.band || 0;
                            const isActive = currentCriterion === crit;

                            let scoreColor = "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10";
                            if (score >= 7) scoreColor = "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10";
                            else if (score >= 6) scoreColor = "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10";

                            return (
                                <button
                                    key={crit}
                                    onClick={() => onCriterionChange(crit)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 border",
                                        isActive
                                            ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm text-slate-900 dark:text-white"
                                            : "border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
                                    )}
                                >
                                    <config.icon className="w-3.5 h-3.5" />
                                    <span>{config.label.split(' ')[0]}</span>
                                    <span className={cn("px-1.5 py-0.5 rounded text-[10px] leading-none", scoreColor)}>
                                        {score}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 w-full mx-auto overflow-y-auto custom-scrollbar scroll-smooth relative flex flex-col lg:flex-row gap-6 items-start md:px-6 pt-2 pb-4">

                {/* SECTION 1: TOP ESSAY (Left side on desktop) */}
                <div className="relative flex flex-col shrink-0 bg-slate-50 dark:bg-[#0B1120] rounded-xl md:border border-slate-200/60 dark:border-slate-800/80 md:shadow-[0_2px_20px_rgb(0,0,0,0.02)] w-full lg:w-[40%] lg:max-w-none" id="essay-top">



                    {/* SECTION 1: TOP ESSAY (Full height) */}
                    <div className="flex flex-col relative w-full">
                        {/* Toggle Buttons */}
                        <div className="shrink-0 px-6 py-4 bg-transparent z-10 flex flex-col items-center justify-center">
                            <div className="flex bg-white dark:bg-slate-900/80 p-1.5 rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 w-fit">
                                <button
                                    onClick={() => setEssayViewMode('original')}
                                    className={cn(
                                        "px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2",
                                        essayViewMode === 'original'
                                            ? "bg-slate-200 dark:bg-slate-700 text-white shadow-lg"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-700/50"
                                    )}
                                >
                                    <FileText className="w-3.5 h-3.5" />
                                    Original
                                </button>
                                <button
                                    onClick={() => setEssayViewMode('improved')}
                                    className={cn(
                                        "px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2",
                                        essayViewMode === 'improved'
                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                                            : "text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                                    )}
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Improved
                                </button>
                            </div>

                        </div>
                    </div>

                    <div className="px-5 pb-8 mx-auto w-full">
                        <div className="leading-relaxed text-lg text-slate-800 dark:text-slate-200 font-serif">
                            <HighlightedEssay
                                essayText={essay}
                                highlights={highlights
                                    .map(h => ({
                                        text: h.original,
                                        type: 'weakness' as const
                                    }))}
                                corrections={corrections}
                                viewMode={essayViewMode}
                            />
                        </div>
                        <div className="h-8" /> {/* Bottom padding */}
                    </div>

                    {/* Floating Action Button (Mobile/Small Screens) */}
                    <motion.div
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 md:hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Button
                            className="bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 rounded-full px-6 flex items-center gap-2"
                            onClick={() => {
                                document.getElementById('feedback-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            View Feedback <ArrowRight className="w-4 h-4" />
                        </Button>
                    </motion.div>
                </div>

                {/* SECTION 2: BOTTOM FEEDBACK (Right side on desktop) */}
                <div className="relative flex flex-col shrink-0 bg-slate-50 dark:bg-[#0B1120] rounded-xl border-t md:border border-slate-200/60 dark:border-slate-800/80 md:shadow-[0_2px_20px_rgb(0,0,0,0.02)] p-4 md:p-6 w-full flex-1 lg:max-w-[60%] lg:sticky lg:top-4 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto hide-scrollbar" id="feedback-section">
                    {/* Header Banner - Floating Tabs Style */}
                    <div className="sticky top-0 z-20 w-full mx-auto mb-2 pt-1 pb-2 bg-slate-50 dark:bg-[#0B1120]">
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none border border-slate-200/60 dark:border-slate-800/80 px-3 py-1.5 flex flex-col items-start gap-1">
                            {/* Top: Criterion label + score badge */}
                            <div className="flex items-center gap-2 min-w-0 w-full">
                                {Icon && <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                                <h2 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-wider truncate flex-1">
                                    {CRITERIA_CONFIG[currentCriterion].label}
                                </h2>
                            </div>

                            {/* Middle: Tabs */}
                            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg w-full">
                                <button
                                    onClick={() => setActiveTab('report')}
                                    className={cn(
                                        "flex-1 py-1 rounded-md text-[10px] font-bold transition-all flex justify-center items-center gap-1.5",
                                        activeTab === 'report'
                                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                    )}
                                >
                                    <Layout className="w-3 h-3" /> Report
                                </button>
                                <button
                                    onClick={() => setActiveTab('issues')}
                                    className={cn(
                                        "flex-1 py-1 rounded-md text-[10px] font-bold transition-all flex justify-center items-center gap-1.5",
                                        activeTab === 'issues'
                                            ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm"
                                            : "text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
                                    )}
                                >
                                    <AlertTriangle className="w-3 h-3" /> Issues
                                    <span className="bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 px-1 py-0.5 rounded text-[8px] leading-none">{issueItems.length}</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('summary')}
                                    className={cn(
                                        "flex-1 py-1 rounded-md text-[10px] font-bold transition-all flex justify-center items-center gap-1.5",
                                        activeTab === 'summary'
                                            ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                                            : "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                                    )}
                                >
                                    <Target className="w-3 h-3" /> Plan
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex flex-col relative p-4 md:p-6 mx-auto space-y-8 w-full">

                        {/* TAB: REPORT */}
                        {activeTab === 'report' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

                                {/* SCORE OVERVIEW (shows for ALL criteria) */}
                                {(() => {
                                    const criterionScore = evaluation.criterion_scores.find(s => s.criterion === currentCriterion);
                                    const justification = criterionScore?.justification || '';
                                    const score = criterionScore?.band || 0;

                                    return justification && (
                                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden">
                                            <div className="p-5 border-b border-slate-50 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "p-2 rounded-xl text-white shadow-sm",
                                                        score >= 7 ? "bg-emerald-500 shadow-emerald-500/20" : score >= 6 ? "bg-amber-500 shadow-amber-500/20" : "bg-rose-500 shadow-rose-500/20"
                                                    )}>
                                                        <BookOpen className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Score Overview</span>
                                                </div>
                                                <span className={cn(
                                                    "text-lg font-black px-4 py-1.5 rounded-xl border",
                                                    score >= 7 ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" : score >= 6 ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" : "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                                                )}>
                                                    Band {score}
                                                </span>
                                            </div>
                                            <div className="p-5 sm:p-6">
                                                {/* Unified Narrative Overview */}
                                                <div className="relative">
                                                    <div className="text-[17px] text-slate-800 dark:text-slate-200 leading-[1.8] font-serif italic">
                                                        {(() => {
                                                            const details = getDetailedFeedback(currentCriterion);
                                                            // Prefer detailed narrative, fallback to justification
                                                            const displayContent = details?.why_score_is_here || justification;
                                                            
                                                            return displayContent.split(/(Score capped at Band \d|capped at Band \d|-\d band|Band \d MAX)/gi).map((part, i) => {
                                                                const isPenalty = /Score capped|capped at Band|-\d band|Band \d MAX/i.test(part);
                                                                return isPenalty ? (
                                                                    <span key={i} className="bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 px-2 py-0.5 rounded font-sans not-italic font-bold border border-rose-200 dark:border-rose-500/30">
                                                                        ⚠️ {part}
                                                                    </span>
                                                                ) : (
                                                                    <span key={i}>
                                                                        {part.split(/(\*\*.*?\*\*)/g).map((subPart, j) =>
                                                                            subPart.startsWith('**') && subPart.endsWith('**') ? (
                                                                                <strong key={j} className="text-slate-900 dark:text-white font-sans not-italic font-bold bg-slate-100 dark:bg-slate-800 px-1.5 rounded">{subPart.slice(2, -2)}</strong>
                                                                            ) : subPart
                                                                        )}
                                                                    </span>
                                                                );
                                                            });
                                                        })()}
                                                    </div>
                                                </div>

                                                {/* Improvement tip section for scores below 8 */}
                                                {score < 8 && (
                                                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="p-1 bg-indigo-50 dark:bg-indigo-500/10 rounded-md">
                                                                <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                            </div>
                                                            <span className="text-[13px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">
                                                                To reach Band {Math.min(score + 0.5, 9)}
                                                            </span>
                                                        </div>
                                                        <p className="text-[16px] text-slate-700 dark:text-slate-300 leading-[1.8] font-medium">
                                                            {(currentCriterion === 'task_response' || currentCriterion === 'task_achievement') && score < 7 && (taskType === 'task1' ? "Ensure all key features are covered, check your data for accuracy, and write a clear overview." : "Develop your position more fully with specific examples, concrete evidence, and deeper analysis of the issue.")}
                                                            {(currentCriterion === 'task_response' || currentCriterion === 'task_achievement') && score >= 7 && (taskType === 'task1' ? "Focus on presenting a clear, expansive overview and effortlessly integrating sophisticated data comparisons." : "Add more nuanced reasoning with sophisticated examples. Show deeper critical thinking and address potential counterarguments.")}
                                                            {currentCriterion === 'coherence_cohesion' && score < 7 && "Vary your cohesive devices - avoid mechanical patterns like 'Firstly, Secondly'. Improve paragraph transitions and logical flow."}
                                                            {currentCriterion === 'coherence_cohesion' && score >= 7 && "Ensure seamless paragraph transitions and use referencing naturally (this, such, these). Cohesion should be effortless."}
                                                            {currentCriterion === 'lexical_resource' && score < 7 && "Expand your vocabulary range with less common words. Focus on collocations and avoid basic word choices like 'very good'."}
                                                            {currentCriterion === 'lexical_resource' && score >= 7 && "Use more sophisticated vocabulary with natural collocations. Show precise word choice and awareness of style throughout."}
                                                            {currentCriterion === 'grammatical_range_accuracy' && (() => {
                                                                const gf = coaching.raw_explainer_output?.grammar_feedback;
                                                                if (gf?.grammar_priority) {
                                                                    const priorityMsg = gf.grammar_priority === 'critical'
                                                                        ? `Critical: Fix the ${gf.pattern_lessons?.length || 0} systematic error pattern(s) below — they are directly capping your score.`
                                                                        : gf.grammar_priority === 'important'
                                                                            ? `Focus on the ${gf.pattern_lessons?.length || 0} grammar pattern(s) identified below. Fixing them can push your score up by 0.5-1.0 bands.`
                                                                            : gf.grammar_priority === 'minor'
                                                                                ? "Your grammar is mostly accurate. Focus on sentence complexity upgrades below for the next band."
                                                                                : "Your grammar control is strong. See complexity suggestions to demonstrate range.";
                                                                    return priorityMsg;
                                                                }
                                                                return score < 7
                                                                    ? "Use more complex sentence structures (relative clauses, conditionals). Reduce basic errors in articles and tenses."
                                                                    : "Increase error-free complex sentences. Show consistent accuracy in advanced structures like inversion and emphasis.";
                                                            })()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* NEW: Examiner's Breakdown Card (Weaknesses/Strengths from Detailed Report) */}
                                {(() => {
                                    const details = getDetailedFeedback(currentCriterion);
                                    if (!details) return null;

                                    const hasWeakSpots = details.weak_spots && details.weak_spots.length > 0;

                                    if (!hasWeakSpots) return null;

                                    return (
                                        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20 shadow-lg">
                                            <div className="bg-slate-100 dark:bg-slate-800/40 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                                                <div className="p-1.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300"><FileText className="w-4 h-4" /></div>
                                                <span className="text-[16px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">Detailed Analysis</span>
                                            </div>
                                            <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {/* Weak Spots */}
                                                {hasWeakSpots && (
                                                    <div className="space-y-3 md:col-span-2">
                                                        <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase flex items-center gap-2">
                                                            <AlertCircle className="w-3.5 h-3.5" /> Weak Points
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {details.weak_spots.map((spot, idx) => (
                                                                <li key={idx} className="text-[16px] text-slate-700 dark:text-slate-300 bg-rose-50 dark:bg-rose-950/10 p-2.5 rounded border border-rose-200 dark:border-rose-900/20 flex items-start gap-2">
                                                                    <span className="text-rose-500 mt-0.5">•</span>
                                                                    <span>{spot}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* SCORE PROJECTIONS CARD */}
                                {coaching.raw_explainer_output?.score_projections?.length > 0 && (
                                    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mt-6">
                                        <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-900/40 p-5 pl-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <span className="text-[16px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">Score Projections</span>
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full ml-auto shadow-sm border border-slate-200/50 dark:border-slate-700/50">If feedback applied</span>
                                        </div>
                                        <div className="p-5 sm:p-6 space-y-8">
                                            {coaching.raw_explainer_output.score_projections
                                                .filter((proj: any) => {
                                                    const critMap: Record<string, string[]> = {
                                                        task_response: ["TASK RESPONSE"],
                                                        task_achievement: ["TASK ACHIEVEMENT", "TASK RESPONSE"],
                                                        coherence_cohesion: ["COHERENCE & COHESION", "COHERENCE", "COHESION"],
                                                        lexical_resource: ["LEXICAL RESOURCE", "VOCABULARY", "LEXICAL"],
                                                        grammatical_range_accuracy: ["GRAMMATICAL RANGE & ACCURACY", "GRAMMAR", "GRA"]
                                                    };
                                                    return critMap[currentCriterion].includes(proj.criterion?.toUpperCase());
                                                })
                                                .map((proj: any, idx: number) => {
                                                    const current = proj.current_score || 0;
                                                    const achievable = proj.achievable_score || 0;
                                                    const improvement = achievable - current;
                                                    const barWidth = (current / 9) * 100;
                                                    const projWidth = (achievable / 9) * 100;

                                                    return (
                                                        <div key={`proj-${idx}`} className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[14px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{proj.criterion}</span>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[17px] font-black text-slate-500 dark:text-slate-400">{current}</span>
                                                                    <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0" />
                                                                    <span className="text-[17px] font-black text-indigo-600 dark:text-indigo-300">{achievable}</span>
                                                                    {improvement > 0 && (
                                                                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-500/20 shadow-sm ml-1">+{improvement}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {/* Progress bar */}
                                                            <div className="relative h-4 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden shadow-inner flex items-center">
                                                                <div
                                                                    className="absolute inset-y-0 left-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-full transition-all"
                                                                    style={{ width: `${projWidth}%` }}
                                                                />
                                                                <div
                                                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-indigo-400 dark:from-indigo-600 dark:to-indigo-500 rounded-full transition-all shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                                                                    style={{ width: `${barWidth}%` }}
                                                                />
                                                            </div>
                                                            {/* Key changes */}
                                                            {proj.key_changes_needed?.length > 0 && (
                                                                <div className="flex flex-col gap-2 pt-2">
                                                                    {proj.key_changes_needed.map((change: string, i: number) => (
                                                                        <div key={i} className="text-[14px] font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm leading-relaxed">
                                                                            {change}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                )}

                                {/* STRATEGIC FOCUS CARDS - Different data for each criterion */}

                                {/* 1. STRATEGY CARD - Task Response OR Task Achievement */}
                                {(currentCriterion === 'task_response' || currentCriterion === 'task_achievement') && coaching.raw_coach_output?.the_one_big_change && (
                                    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mt-6">
                                        <div className="bg-white dark:bg-slate-800/40 p-5 pl-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400"><Layout className="w-5 h-5" /></div>
                                            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Strategic Focus</span>
                                        </div>
                                        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-3 col-span-1 sm:col-span-2 mb-2">
                                                <p className="text-[17px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-indigo-200 dark:border-indigo-500/50 pl-4">
                                                    "{coaching.raw_coach_output.the_one_big_change.why_this_matters_most}"
                                                </p>
                                            </div>
                                            <div className="col-span-1 space-y-3">
                                                <div className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                    <div className="text-rose-500 bg-rose-50 dark:bg-rose-500/10 p-1 rounded-md"><AlertCircle className="w-4 h-4" /></div> Stop Doing
                                                </div>
                                                <p className="text-[16px] text-slate-700 dark:text-slate-300 bg-transparent h-full pt-1">
                                                    {coaching.raw_coach_output.the_one_big_change.what_to_stop_doing}
                                                </p>
                                            </div>
                                            <div className="col-span-1 space-y-3">
                                                <div className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                    <div className="text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 p-1 rounded-md"><CheckCircle2 className="w-4 h-4" /></div> Start Doing
                                                </div>
                                                <p className="text-[16px] text-slate-700 dark:text-slate-300 bg-transparent h-full pt-1">
                                                    {coaching.raw_coach_output.the_one_big_change.what_to_start_doing}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 0. TA PRIORITY BANNER */}
                                {(currentCriterion === 'task_achievement' || currentCriterion === 'task_response') && (
                                    <TAPriorityBanner
                                        dataCoverage={coaching.raw_explainer_output?.data_coverage}
                                        overviewFeedback={coaching.raw_explainer_output?.coherence_feedback?.overview_feedback}
                                    />
                                )}

                                {/* 1B. STRATEGY CARD - Data Coverage (Task 1 Only) */}
                                {currentCriterion === 'task_achievement' && coaching.raw_explainer_output?.data_coverage && (
                                    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mt-6">
                                        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 pl-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400"><FileText className="w-5 h-5" /></div>
                                            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Data Coverage Analysis</span>
                                        </div>
                                        <div className="p-5 sm:p-6 space-y-6">
                                            {(() => {
                                                const dc = coaching.raw_explainer_output.data_coverage;
                                                return (
                                                    <div className="flex flex-col gap-6">
                                                        {dc.feature_map?.filter((f: any) => !f.covered_in_essay).length > 0 && (
                                                            <div className="space-y-3">
                                                                <h4 className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                                    <div className="text-rose-500 bg-rose-50 dark:bg-rose-500/10 p-1 rounded-md"><AlertCircle className="w-4 h-4" /></div> Missed Key Features
                                                                </h4>
                                                                <ul className="space-y-2">
                                                                    {dc.feature_map.filter((f: any) => !f.covered_in_essay).map((item: any, i: number) => (
                                                                        <li key={i} className="text-[15px] text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-rose-50/50 dark:bg-rose-950/20 p-2.5 rounded border border-rose-100 dark:border-rose-900/30 flex-col">
                                                                            <div className="flex gap-2">
                                                                                <span className="text-rose-500 mt-0.5">•</span> 
                                                                                <span className="font-semibold">{item.feature_description}</span>
                                                                            </div>
                                                                            {item.why_important && (
                                                                                <span className="text-sm text-slate-500 dark:text-slate-400 pl-4">{item.why_important}</span>
                                                                            )}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        {dc.data_accuracy_issues?.length > 0 && (
                                                            <div className="space-y-3">
                                                                <h4 className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                                    <div className="text-amber-500 bg-amber-50 dark:bg-amber-500/10 p-1 rounded-md"><AlertTriangle className="w-4 h-4" /></div> Data Inaccuracies
                                                                </h4>
                                                                <ul className="space-y-3">
                                                                    {dc.data_accuracy_issues.map((item: any, i: number) => (
                                                                        <li key={i} className="text-[15px] text-slate-700 dark:text-slate-300 flex flex-col gap-2 bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded border border-amber-100 dark:border-amber-900/30">
                                                                            <div className="flex items-start gap-2">
                                                                                <span className="text-amber-500 mt-0.5">•</span> 
                                                                                <span className="line-through decoration-rose-400/50 italic text-amber-700/80 dark:text-amber-300/70">"{item.original_sentence}"</span>
                                                                            </div>
                                                                            <div className="pl-4 text-sm font-medium text-amber-700 dark:text-amber-400">
                                                                                Issue: {item.issue_description}
                                                                            </div>
                                                                            <div className="pl-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                                                Correct data: {item.corrected_data}
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        {dc.feature_map?.filter((f: any) => f.covered_in_essay).length > 0 && (
                                                            <div className="space-y-3">
                                                                <h4 className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                                    <div className="text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 p-1 rounded-md"><CheckCircle2 className="w-4 h-4" /></div> Accurately Reported
                                                                </h4>
                                                                <ul className="space-y-2">
                                                                    {dc.feature_map.filter((f: any) => f.covered_in_essay).map((item: any, i: number) => (
                                                                        <li key={i} className="text-[15px] text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded border border-emerald-100 dark:border-emerald-900/30 flex-col">
                                                                            <div className="flex gap-2">
                                                                                <span className="text-emerald-500 mt-0.5">✓</span> 
                                                                                <span>{item.feature_description}</span>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                )}

                                {/* 1C. STRATEGY CARD - Overview Feedback (Task 1 Only) */}
                                {currentCriterion === 'task_achievement' && coaching.raw_explainer_output?.coherence_feedback?.overview_feedback && (
                                    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mt-6">
                                        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 pl-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400"><Layout className="w-5 h-5" /></div>
                                            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Overview Analysis</span>
                                        </div>
                                        <div className="p-5 sm:p-6 space-y-6">
                                            {(() => {
                                                const ov = coaching.raw_explainer_output!.coherence_feedback!.overview_feedback;
                                                return (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 relative">
                                                        {/* Status bar */}
                                                        <div className="col-span-1 sm:col-span-2 flex gap-4 text-[13px] font-bold pb-2">
                                                            <div className={`px-2 py-1 rounded ${ov.overview_present ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                                                                Present: {ov.overview_present ? 'Yes' : 'No'}
                                                            </div>
                                                            <div className={`px-2 py-1 rounded ${ov.position_correct ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                                                                Position: {ov.detected_position || 'None'}
                                                            </div>
                                                            <div className="px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                                                                Quality: {ov.overview_quality || 'N/A'}
                                                            </div>
                                                        </div>

                                                        {ov.original_overview && (
                                                            <div className="space-y-2">
                                                                <div className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                                    <div className="text-rose-400"><AlertCircle className="w-3.5 h-3.5" /></div> Original
                                                                </div>
                                                                <p className="text-[16px] text-amber-700/80 dark:text-amber-300/70 line-through decoration-rose-400/50 pl-3 border-l-2 border-amber-300 dark:border-amber-600/50 leading-relaxed italic bg-amber-50/40 dark:bg-amber-950/20 py-1.5 rounded-r">
                                                                    "{ov.original_overview}"
                                                                </p>
                                                            </div>
                                                        )}
                                                        {ov.improved_overview && (
                                                            <div className="space-y-2">
                                                                <div className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                                    <div className="text-emerald-500"><Sparkles className="w-3.5 h-3.5" /></div> Improved
                                                                </div>
                                                                <p className="text-[16px] font-semibold text-slate-800 dark:text-slate-200 pl-2 border-l-2 border-emerald-400 dark:border-emerald-500/50 leading-relaxed">
                                                                    "{ov.improved_overview}"
                                                                </p>
                                                            </div>
                                                        )}
                                                        {ov.issues && ov.issues.length > 0 && (
                                                            <div className="col-span-1 sm:col-span-2 text-[14px] text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/50 p-3 rounded">
                                                                <span className="text-blue-600 dark:text-blue-400 font-bold">Issues Detected: </span>
                                                                {ov.issues.join(', ')}
                                                            </div>
                                                        )}
                                                        {ov.key_changes_made && ov.key_changes_made.length > 0 && (
                                                            <div className="col-span-1 sm:col-span-2 text-[14px] text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/50 p-3 rounded mt-2">
                                                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Fixes Made: </span>
                                                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                                                    {ov.key_changes_made.map((c: string, i: number) => <li key={`kc-${i}`}>{c}</li>)}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                )}

                                {/* 1D. TA BAND LADDER */}
                                {(currentCriterion === 'task_achievement' || currentCriterion === 'task_response') && (
                                    <TABandLadder rawCurrentScore={currentScore} taskType={taskType} dataCoverage={coaching.raw_explainer_output?.data_coverage} />
                                )}

                                {/* 2. CC BAND LADDER */}
                                {currentCriterion === 'coherence_cohesion' && (
                                    <CCBandLadder rawCurrentScore={currentScore} taskType={taskType} />
                                )}

                                {/* 3. STRATEGY CARD - Coherence & Cohesion (Legacy and Task 2) */}
                                {currentCriterion === 'coherence_cohesion' && (coaching.coherence_issues?.length > 0 || (!coaching.raw_explainer_output?.coherence_feedback && coaching.raw_explainer_output?.cohesion_fixes?.length > 0)) && (
                                    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mt-6">
                                        <div className="bg-white dark:bg-slate-800/40 p-5 pl-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-3">
                                            <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400"><Layout className="w-5 h-5" /></div>
                                            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Cohesion Improvements</span>
                                        </div>
                                        <div className="p-5 sm:p-6 space-y-6">
                                            {coaching.coherence_issues?.slice(0, 2).map((issue: any, idx: number) => (
                                                <div key={`coh-${idx}`} className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 relative">
                                                    <div className="space-y-2">
                                                        <div className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                            <div className="text-rose-400"><AlertCircle className="w-3.5 h-3.5" /></div> Original
                                                        </div>
                                                        <p className="text-[16px] text-amber-700/80 dark:text-amber-300/70 line-through decoration-rose-400/50 pl-3 border-l-2 border-amber-300 dark:border-amber-600/50 leading-relaxed italic bg-amber-50/40 dark:bg-amber-950/20 py-1.5 rounded-r">
                                                            "{issue.text}"
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                            <div className="text-emerald-500"><Sparkles className="w-3.5 h-3.5" /></div> Improved
                                                        </div>
                                                        <p className="text-[16px] font-semibold text-slate-800 dark:text-slate-200 pl-2 border-l-2 border-emerald-400 dark:border-emerald-500/50 leading-relaxed">
                                                            "{issue.suggestion || issue.corrected}"
                                                        </p>
                                                    </div>
                                                    {issue.reason && (
                                                        <div className="col-span-2 text-[14px] text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/50 p-2.5 rounded">
                                                            <span className="text-amber-600 dark:text-amber-400 font-bold">Why: </span>{issue.reason}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {coaching.coherence_issues?.length === 0 && coaching.raw_explainer_output?.cohesion_fixes?.slice(0, 2).map((fix: any, idx: number) => (
                                                <div key={`fix-${idx}`} className="space-y-3">
                                                    <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded border border-amber-200 dark:border-amber-900/30">
                                                        <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mb-1">Technique: {fix.technique_explanation}</div>
                                                        <p className="text-sm text-slate-700 dark:text-slate-300">"{fix.improved_sentence}"</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 2b. TASK 1 SPECIFIC COHERENCE VISUALS */}
                                {currentCriterion === 'coherence_cohesion' && coaching.raw_explainer_output?.coherence_feedback && (
                                    <div className="space-y-6 mt-6">
                                        
                                        {/* A. Paragraph Map */}
                                        {coaching.raw_explainer_output.coherence_feedback.paragraph_structure && (
                                            <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden">
                                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 pl-6 border-b border-indigo-100 dark:border-indigo-800/50 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400"><Layout className="w-5 h-5" /></div>
                                                        <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Paragraph Map</span>
                                                    </div>
                                                    <div className={`px-2 py-1 rounded text-xs font-bold ${coaching.raw_explainer_output.coherence_feedback.paragraph_structure.has_clear_breaks ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400'}`}>
                                                        {coaching.raw_explainer_output.coherence_feedback.paragraph_structure.has_clear_breaks ? 'Clear Breaks' : 'Missing Breaks'}
                                                    </div>
                                                </div>
                                                <div className="p-5 sm:p-6 space-y-6">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">{coaching.raw_explainer_output.coherence_feedback.paragraph_structure.feedback_message}</p>
                                                    {(() => {
                                                        const hasGoodBreaks = coaching.raw_explainer_output.coherence_feedback.paragraph_structure.has_clear_breaks;
                                                        return (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                <div>
                                                                    <div className={`text-[11px] font-black uppercase tracking-widest mb-3 ${hasGoodBreaks ? 'text-indigo-500/80 dark:text-indigo-400/80' : 'text-rose-500'}`}>Your Structure</div>
                                                                    <div className="flex flex-col gap-2">
                                                                        {coaching.raw_explainer_output.coherence_feedback.paragraph_structure.detected_structure.map((p: string, i: number) => (
                                                                            <div key={`ds-${i}`} className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                                                                                hasGoodBreaks 
                                                                                    ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300' 
                                                                                    : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-300'
                                                                            }`}>
                                                                                {p}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[11px] font-black text-emerald-500 uppercase tracking-widest mb-3">Expected Structure</div>
                                                                    <div className="flex flex-col gap-2">
                                                                        {coaching.raw_explainer_output.coherence_feedback.paragraph_structure.expected_structure.map((p: string, i: number) => (
                                                                            <div key={`es-${i}`} className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-lg text-sm text-emerald-800 dark:text-emerald-300 font-medium flex items-center justify-between">
                                                                                <span>{p}</span>
                                                                                <CheckCircle2 className="w-4 h-4 opacity-50" />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        )}

                                        {/* B. Data Grouping */}
                                        {coaching.raw_explainer_output.coherence_feedback.data_grouping_fixes && coaching.raw_explainer_output.coherence_feedback.data_grouping_fixes.length > 0 && (
                                            <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden">
                                                <div className="bg-amber-50 dark:bg-amber-900/20 p-5 pl-6 border-b border-amber-100 dark:border-amber-800/50 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400">
                                                            <TrendingUp className="w-5 h-5" />
                                                        </div>
                                                        <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                                                            Data Grouping
                                                        </span>
                                                    </div>
                                                    <span className="text-[12px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-500/10 px-2 py-1 rounded">
                                                        {coaching.raw_explainer_output.coherence_feedback.data_grouping_fixes.length} instance{coaching.raw_explainer_output.coherence_feedback.data_grouping_fixes.length > 1 ? 's' : ''} found
                                                    </span>
                                                </div>
                                                <div className="p-5 sm:p-6 space-y-8">
                                                    {/* Scoring Rationale */}
                                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex items-start gap-3">
                                                        <Info className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                                                        <p className="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                                            <strong className="text-rose-500 dark:text-rose-400 font-semibold">
                                                                {currentScore >= 7 ? "Mechanical listing prevents Band 8+" : "Mechanical listing caps Coherence at Band 6"}
                                                            </strong><br/>
                                                            {currentScore >= 7 
                                                                ? "Even for high-scoring essays, isolated cases of scattered data limit your flow. Consistently grouped comparisons are required for top bands."
                                                                : "Grouped comparisons are structurally required to achieve Band 7+."
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="space-y-6">
                                                        {coaching.raw_explainer_output.coherence_feedback.data_grouping_fixes.map((fix: any, idx: number) => (
                                                            <div key={`dg-${idx}`} className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8 last:border-0 last:pb-0 relative">
                                                                <div className="text-[15px] text-slate-600 dark:text-slate-400 mb-2 italic">
                                                                    "{fix.explanation}"
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {/* SCATTERED LIST (RED BOX) */}
                                                                    <div className="bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl p-4 flex flex-col h-full">
                                                                        <div className="text-[12px] font-black tracking-widest text-rose-500 dark:text-rose-400 uppercase flex items-center gap-2 mb-3">
                                                                            <XCircle className="w-4 h-4" /> Scattered List
                                                                        </div>
                                                                        <div className="space-y-2 flex-grow">
                                                                            {fix.scattered_sentences.map((s: string, i: number) => (
                                                                                <p key={`ss-${i}`} className="text-[14px] text-rose-800/80 dark:text-rose-300/80 font-medium leading-relaxed">
                                                                                    {s}
                                                                                </p>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    {/* GROUPED OUTPUT (GREEN BOX) */}
                                                                    <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-4 shadow-sm flex flex-col h-full">
                                                                        <div className="text-[12px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-2 mb-3">
                                                                            <CheckCircle2 className="w-4 h-4" /> Grouped Output
                                                                        </div>
                                                                        <p className="text-[15px] font-semibold text-emerald-800 dark:text-emerald-300 leading-relaxed flex-grow">
                                                                            "{fix.grouped_sentence}"
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* C. Referencing Errors */}
                                        {coaching.raw_explainer_output.coherence_feedback.referencing_errors && coaching.raw_explainer_output.coherence_feedback.referencing_errors.length > 0 && (
                                            <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden">
                                                <div className="bg-orange-50 dark:bg-orange-900/20 p-5 pl-6 border-b border-orange-100 dark:border-orange-800/50 flex items-center gap-3">
                                                    <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-xl text-orange-600 dark:text-orange-400"><RefreshCw className="w-5 h-5" /></div>
                                                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Referencing Accuracy</span>
                                                </div>
                                                <div className="p-5 sm:p-6 space-y-6">
                                                    {coaching.raw_explainer_output.coherence_feedback.referencing_errors.map((err: any, idx: number) => (
                                                        <div key={`re-${idx}`} className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 relative border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                                                            <div className="space-y-2">
                                                                <div className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                                    <div className="text-rose-400"><AlertCircle className="w-3.5 h-3.5" /></div> Ambiguous: "{err.ambiguous_pronoun}"
                                                                </div>
                                                                <p className="text-[15px] text-amber-700/80 dark:text-amber-300/70 pl-3 border-l-2 border-amber-300 dark:border-amber-600/50 leading-relaxed italic bg-amber-50/40 dark:bg-amber-950/20 py-1.5 rounded-r">
                                                                    "{err.original_sentence}"
                                                                </p>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                                    <div className="text-emerald-500"><Sparkles className="w-3.5 h-3.5" /></div> Clear Reference
                                                                </div>
                                                                <p className="text-[15px] font-semibold text-slate-800 dark:text-slate-200 pl-2 border-l-2 border-emerald-400 dark:border-emerald-500/50 leading-relaxed">
                                                                    "{err.corrected_sentence}"
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* D. Connector Heatmap & Analysis */}
                                        {coaching.raw_explainer_output.coherence_feedback.connector_analysis && coaching.raw_explainer_output.coherence_feedback.connector_analysis.cohesion_fixes?.length > 0 && (
                                            <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden">
                                                <div className="bg-sky-50 dark:bg-sky-900/20 p-5 pl-6 border-b border-sky-100 dark:border-sky-800/50 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-sky-100 dark:bg-sky-500/20 rounded-xl text-sky-600 dark:text-sky-400"><Link className="w-5 h-5" /></div>
                                                        <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Connectors & Linking</span>
                                                    </div>
                                                </div>
                                                <div className="p-5 sm:p-6 space-y-6">
                                                    {coaching.raw_explainer_output.coherence_feedback.connector_analysis.overused_connectors && coaching.raw_explainer_output.coherence_feedback.connector_analysis.overused_connectors.length > 0 && (
                                                        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30 text-sm">
                                                        <strong className="text-red-700 dark:text-red-400 block mb-1">Repetitive Connectors & Time Markers:</strong>
                                                            <div className="flex gap-2 flex-wrap">
                                                                {coaching.raw_explainer_output.coherence_feedback.connector_analysis.overused_connectors.map((c: string, idx: number) => (
                                                                    <span key={`oc-${idx}`} className="px-2 py-1 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-300 shadow-sm">{c}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {coaching.raw_explainer_output.coherence_feedback.connector_analysis.cohesion_fixes.map((fix: any, idx: number) => (
                                                        <div key={`cf-${idx}`} className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative border-b border-slate-100 dark:border-slate-800 pb-5 last:border-0 last:pb-0">
                                                            <div className="lg:col-span-2 space-y-4">
                                                                <div className="space-y-1">
                                                                    <div className="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">Mechanical Sentence</div>
                                                                    <p className="text-[14px] text-slate-500 dark:text-slate-400 line-through decoration-rose-400/50 leading-relaxed">{fix.original_sentence}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="text-[11px] font-black tracking-widest text-emerald-500 uppercase">Improved Rewrite</div>
                                                                    <p className="text-[15px] font-semibold text-slate-800 dark:text-slate-200 leading-relaxed bg-emerald-50/50 dark:bg-emerald-900/10 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800/30">{fix.improved_sentence}</p>
                                                                </div>
                                                            </div>
                                                            <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800 h-fit self-center">
                                                                <div className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1">{fix.technique_used}</div>
                                                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{fix.technique_explanation}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ═══ PARAPHRASE CHECKER — prompt vs intro overlap ═══ */}
                                {currentCriterion === 'lexical_resource' && (() => {
                                    const pa = coaching.raw_explainer_output?.vocabulary_feedback?.paraphrase_analysis;
                                    if (!pa || pa.severity === 'none') return null;
                                    
                                    const severityConfig: Record<string, { label: string; color: string; icon: string }> = {
                                        critical: { label: 'Critical — Direct Copy', color: 'rose', icon: '🚨' },
                                        high: { label: 'High Overlap', color: 'amber', icon: '⚠️' },
                                        low: { label: 'Minor Overlap', color: 'sky', icon: 'ℹ️' },
                                    };
                                    const cfg = severityConfig[pa.severity] || severityConfig.low;
                                    const overlapPct = Math.round((pa.overlap_percentage || 0) * 100);
                                    const overlapWords = pa.overlap_words || [];
                                    
                                    // Highlight overlapping words in a text
                                    const highlightOverlap = (text: string, words: string[], isPrompt: boolean) => {
                                        if (!words.length) return <span>{text}</span>;
                                        const regex = new RegExp(`\\b(${words.join('|')})\\b`, 'gi');
                                        const parts = text.split(regex);
                                        return parts.map((part: string, i: number) => {
                                            const isMatch = words.some(w => w.toLowerCase() === part.toLowerCase());
                                            if (isMatch) {
                                                return (
                                                    <span key={i} className={`font-extrabold px-1 rounded-sm ${
                                                        isPrompt 
                                                            ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-b-2 border-rose-300 dark:border-rose-500/50' 
                                                            : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-b-2 border-rose-300 dark:border-rose-500/50'
                                                    }`}>{part}</span>
                                                );
                                            }
                                            return <span key={i}>{part}</span>;
                                        });
                                    };
                                    
                                    return (
                                        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mt-6">
                                            <div className={`bg-gradient-to-r ${
                                                cfg.color === 'rose' ? 'from-rose-50 to-white dark:from-rose-950/20 dark:to-slate-900/40' :
                                                cfg.color === 'amber' ? 'from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900/40' :
                                                'from-sky-50 to-white dark:from-sky-950/20 dark:to-slate-900/40'
                                            } p-5 pl-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-3`}>
                                                <div className={`p-2 rounded-xl shadow-sm ${
                                                    cfg.color === 'rose' ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                                    cfg.color === 'amber' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                                    'bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400'
                                                }`}>
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Paraphrase Checker</span>
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full ml-auto shadow-sm border ${
                                                    cfg.color === 'rose' ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20' :
                                                    cfg.color === 'amber' ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' :
                                                    'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20'
                                                }`}>{cfg.icon} {overlapPct}% overlap</span>
                                            </div>
                                            <div className="p-5 sm:p-6 space-y-5">
                                                <div className={`text-[14px] font-semibold p-3.5 rounded-xl border ${
                                                    cfg.color === 'rose' ? 'text-rose-800 dark:text-rose-300 bg-rose-50/80 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/20' :
                                                    cfg.color === 'amber' ? 'text-amber-800 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20' :
                                                    'text-sky-800 dark:text-sky-300 bg-sky-50/80 dark:bg-sky-500/5 border-sky-200 dark:border-sky-500/20'
                                                }`}>
                                                    {pa.severity === 'critical' && "Your introduction copies too many words directly from the question. Examiners penalize this heavily — paraphrase ALL key terms."}
                                                    {pa.severity === 'high' && "Several words from the question appear unchanged in your introduction. Aim to rephrase every key term."}
                                                    {pa.severity === 'low' && "Minor word overlap detected. Good attempt at paraphrasing, but a few terms could still be rephrased."}
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                                    <div className="space-y-2">
                                                        <div className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                            <div className="text-slate-400"><FileText className="w-3.5 h-3.5" /></div> Prompt
                                                        </div>
                                                        <p className="text-[15px] text-slate-600 dark:text-slate-400 pl-2 border-l-2 border-slate-200 dark:border-slate-700 leading-[1.8]">
                                                            {highlightOverlap(pa.prompt_text || '', overlapWords, true)}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                            <div className="text-rose-400"><AlertCircle className="w-3.5 h-3.5" /></div> Your Introduction
                                                        </div>
                                                        <p className="text-[15px] text-slate-700 dark:text-slate-300 pl-2 border-l-2 border-rose-300 dark:border-rose-500/50 leading-[1.8] font-medium">
                                                            {highlightOverlap(pa.student_intro || '', overlapWords, false)}
                                                        </p>
                                                    </div>
                                                </div>
                                                {overlapWords.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                        <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest self-center mr-1">Copied words:</span>
                                                        {overlapWords.map((word: string, i: number) => (
                                                            <span key={i} className="px-2.5 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[13px] font-bold rounded-lg border border-rose-200 dark:border-rose-500/20">
                                                                {word}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                
                                                {/* Render Improved Introduction if available and overlap > 40% */}
                                                {pa.overlap_percentage > 0.30 && pa.improved && (
                                                    <ImprovedIntroduction
                                                        improvedText={pa.improved.improved_introduction}
                                                        overlapPercent={pa.improved.overlap_percent}
                                                        changes={pa.improved.changes || []}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* ═══ VOCABULARY VARIETY SCORE — unique trend verbs vs benchmark ═══ */}
                                {currentCriterion === 'lexical_resource' && (() => {
                                    const vs = coaching.raw_explainer_output?.vocabulary_feedback?.vocabulary_stats;
                                    const vocabFb = coaching.raw_explainer_output?.vocabulary_feedback;
                                    if (!vs || !vocabFb) return null;
                                    
                                    const trendPct = Math.round((vs.trend_percentage || 0) * 100);
                                    const compPct = Math.round((vs.comparison_percentage || 0) * 100);
                                    
                                    const getBarColor = (pct: number) => {
                                        if (pct < 50) return 'from-rose-500 to-rose-400';
                                        if (pct < 100) return 'from-amber-500 to-amber-400';
                                        return 'from-emerald-500 to-emerald-400';
                                    };

                                    const renderVocabSection = (
                                        title: string,
                                        usedCount: number,
                                        targetCount: number,
                                        targetBand: number,
                                        pct: number,
                                        barColor: string,
                                        usedWords: string[],
                                        missingWords: string[]
                                    ) => (
                                        <div className="space-y-4 pt-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[16px] font-extrabold text-slate-800 dark:text-slate-200">{title}</span>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-[13px] font-bold text-slate-500 dark:text-slate-400">
                                                    <div className="flex-1 mr-4">
                                                        <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                                            <div
                                                                className={`h-full bg-gradient-to-r ${barColor} transition-all duration-700 shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
                                                                style={{ width: `${Math.min(pct, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="shrink-0 tracking-wide text-slate-400 dark:text-slate-500">
                                                        <span className="text-slate-700 dark:text-slate-300 font-extrabold">{usedCount}</span> used / <span className="text-slate-700 dark:text-slate-300">{targetCount}+</span> for Band {targetBand}
                                                    </div>
                                                </div>
                                            </div>

                                            {usedWords && usedWords.length > 0 && (
                                                <div className="space-y-2 mt-4">
                                                    <span className="text-[12px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">You used:</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {usedWords.map((w: string, i: number) => (
                                                            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-[13px] font-bold rounded-lg border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {w}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {missingWords && missingWords.length > 0 && (
                                                <div className="space-y-2 mt-5">
                                                    <span className="text-[12px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Add for Band {targetBand}:</span>
                                                    <div className="flex flex-wrap items-center leading-relaxed">
                                                        {missingWords.map((w: string, i: number) => (
                                                            <span key={i} className="text-[14px] font-bold text-slate-600 dark:text-slate-300">
                                                                {w}
                                                                {i < missingWords.length - 1 && <span className="text-slate-300 dark:text-slate-600 font-normal px-2.5">·</span>}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );

                                    return (
                                        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mt-6">
                                            <div className="bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900/40 p-5 pl-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-3">
                                                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm">
                                                    <Activity className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Vocabulary Variety</span>
                                            </div>
                                            <div className="p-5 sm:p-6 space-y-8">
                                                {renderVocabSection(
                                                    "Trend Verbs",
                                                    vs.unique_trend_verbs || 0,
                                                    vs.target_trend_verbs || 0,
                                                    vs.target_band || 7.0,
                                                    trendPct,
                                                    getBarColor(trendPct),
                                                    vocabFb.trend_vocabulary_used || [],
                                                    vocabFb.missing_trend_words || []
                                                )}
                                                
                                                <div className="h-px w-full bg-slate-100 dark:bg-slate-800/50" />
                                                
                                                {renderVocabSection(
                                                    "Comparison Words",
                                                    vs.unique_comparison_words || 0,
                                                    vs.target_comparison_words || 0,
                                                    vs.target_band || 7.0,
                                                    compPct,
                                                    getBarColor(compPct),
                                                    vocabFb.comparison_vocabulary_used || [],
                                                    vocabFb.missing_comparison_words || []
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* ═══ WORD REPETITION — excessively repeated words with synonyms ═══ */}
                                {currentCriterion === 'lexical_resource' && (() => {
                                    const reps = coaching.raw_explainer_output?.vocabulary_feedback?.word_repetitions;
                                    if (!reps || reps.length === 0) return null;
                                    
                                    return (
                                        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mt-6">
                                            <div className="bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-slate-900/40 p-5 pl-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-3">
                                                <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-xl text-orange-600 dark:text-orange-400 shadow-sm">
                                                    <AlertCircle className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Word Repetition</span>
                                                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-3 py-1 rounded-full ml-auto shadow-sm border border-orange-200 dark:border-orange-500/20">
                                                    {reps.length} {reps.length === 1 ? 'word' : 'words'} overused
                                                </span>
                                            </div>
                                            <div className="p-5 sm:p-6 space-y-4">
                                                <p className="text-[14px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                                                    Repeating the same word signals limited vocabulary. Replace some instances with the synonyms below.
                                                </p>
                                                <div className="space-y-3">
                                                    {reps.map((rep: any, idx: number) => {
                                                        const isCritical = rep.severity === 'critical';
                                                        const isModerate = rep.severity === 'moderate';
                                                        const isIgnore = rep.severity === 'ignore';
                                                        
                                                        return (
                                                            <div key={`rep-${idx}`} className={cn(
                                                                "flex flex-col gap-2 p-4 rounded-xl border transition-colors",
                                                                isCritical ? "bg-rose-50/50 dark:bg-rose-500/5 border-rose-100 dark:border-rose-500/20" :
                                                                isModerate ? "bg-amber-50/50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/20" :
                                                                "bg-slate-50/80 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/50 opacity-70"
                                                            )}>
                                                                <div className="flex items-center gap-3 flex-wrap">
                                                                    <div className={cn(
                                                                        "w-2.5 h-2.5 rounded-full shrink-0 shadow-sm",
                                                                        isCritical ? "bg-rose-500" :
                                                                        isModerate ? "bg-amber-500" :
                                                                        "bg-slate-300 dark:bg-slate-600 outline outline-1 outline-slate-400 dark:outline-slate-500"
                                                                    )} />
                                                                    <span className={cn(
                                                                        "text-[16px] font-extrabold",
                                                                        isCritical ? "text-rose-700 dark:text-rose-300" :
                                                                        isModerate ? "text-amber-700 dark:text-amber-300" :
                                                                        "text-slate-600 dark:text-slate-400"
                                                                    )}>"{rep.word}"</span>
                                                                    <span className={cn(
                                                                        "text-xs font-bold px-2 py-0.5 rounded-full shadow-sm",
                                                                        isCritical ? "text-white bg-rose-500 dark:bg-rose-600" :
                                                                        isModerate ? "text-white bg-amber-500 dark:bg-amber-600" :
                                                                        "text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700"
                                                                    )}>
                                                                        ×{rep.count}
                                                                    </span>
                                                                    
                                                                    {isModerate && (
                                                                        <span className="text-xs font-medium text-amber-600/80 dark:text-amber-400/80 ml-1">
                                                                            (topic word — some repetition ok)
                                                                        </span>
                                                                    )}
                                                                    {isIgnore && (
                                                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">
                                                                            (unit/year — cannot paraphrase, ignore)
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                
                                                                {!isIgnore && rep.synonyms?.length > 0 && (
                                                                    <div className="flex sm:items-center gap-2 mt-1 ml-6 flex-col sm:flex-row">
                                                                        <span className="text-[13px] font-black text-slate-400 uppercase tracking-widest shrink-0">Try:</span>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {rep.synonyms.map((syn: string, si: number) => (
                                                                                <span key={si} className="px-3 py-1 bg-white/60 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 text-[13px] font-bold rounded-md border border-slate-200 dark:border-slate-700/50 shadow-sm">
                                                                                    {syn}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* 3. STRATEGY CARD - Lexical Resource */}
                                {currentCriterion === 'lexical_resource' && coaching.vocabulary_suggestions?.length > 0 && (
                                    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mt-6">
                                        <div className="bg-white dark:bg-slate-800/40 p-5 pl-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-3">
                                            <div className="p-2 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl text-cyan-600 dark:text-cyan-400"><Layout className="w-5 h-5" /></div>
                                            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Vocabulary Upgrades</span>
                                        </div>
                                        <div className="p-5 sm:p-6 space-y-5">
                                            {coaching.vocabulary_suggestions.slice(0, 3).map((vocab: any, idx: number) => (
                                                <div key={`vocab-${idx}`} className="flex items-center gap-4 bg-slate-100/50 dark:bg-slate-800/30 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50">
                                                    <div className="flex-1">
                                                        <span className="text-sm text-amber-700/80 dark:text-amber-300/70 line-through decoration-rose-500/50 italic">"{vocab.original}"</span>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-cyan-500 shrink-0" />
                                                    <div className="flex-1">
                                                        <div className="text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase mb-1.5 flex items-center gap-2">
                                                            Band Booster
                                                            <span className="bg-cyan-100 dark:bg-cyan-500/20 px-1.5 py-0.5 rounded text-[10px] text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30">Level +1.0</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {vocab.better_options.map((opt: string, i: number) => (
                                                                <span key={i} className="px-2 py-1 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-900 dark:text-cyan-200 text-sm rounded-lg border border-cyan-300 dark:border-cyan-500/30">
                                                                    {opt}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {coaching.vocabulary_suggestions.length > 0 && coaching.vocabulary_suggestions[0].context && (
                                                <div className="text-[14px] text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/50 p-3.5 rounded border border-slate-200 dark:border-slate-700/50">
                                                    <span className="text-cyan-700 dark:text-cyan-400 font-bold">Tip: </span>{coaching.vocabulary_suggestions[0].context}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* LEXICAL RESOURCE BREAKDOWN (LR criterion only) */}
                                {currentCriterion === 'lexical_resource' && coaching.raw_explainer_output?.lexical_breakdown && (() => {
                                    const lr = coaching.raw_explainer_output.lexical_breakdown;
                                    const rangeConfig: Record<string, { label: string; color: string; width: string }> = {
                                        wide: { label: 'Wide', color: 'emerald', width: 'w-full' },
                                        sufficient: { label: 'Sufficient', color: 'sky', width: 'w-3/4' },
                                        adequate: { label: 'Adequate', color: 'amber', width: 'w-1/2' },
                                        limited: { label: 'Limited', color: 'rose', width: 'w-1/4' },
                                    };
                                    const accuracyConfig: Record<string, { label: string; color: string; width: string }> = {
                                        precise: { label: 'Precise', color: 'emerald', width: 'w-full' },
                                        generally_accurate: { label: 'Generally Accurate', color: 'sky', width: 'w-3/4' },
                                        some_errors: { label: 'Some Errors', color: 'amber', width: 'w-1/2' },
                                        frequent_errors: { label: 'Frequent Errors', color: 'rose', width: 'w-1/4' },
                                    };
                                    const range = rangeConfig[lr.range_score] || rangeConfig.adequate;
                                    const accuracy = accuracyConfig[lr.accuracy_score] || accuracyConfig.some_errors;

                                    return (
                                        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mt-6">
                                            {/* Header */}
                                            <div className="p-5 pl-6 border-b border-slate-50 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
                                                        <BookOpen className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Lexical Resource Breakdown</span>
                                                </div>
                                            </div>

                                            <div className="p-5 sm:p-6 space-y-6">
                                                {/* Range vs Accuracy Bars */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Range */}
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-[13px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Vocabulary Range</span>
                                                            <span className={cn(
                                                                "text-[12px] font-bold uppercase px-2 py-0.5 rounded-full",
                                                                range.color === 'emerald' && "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10",
                                                                range.color === 'sky' && "text-sky-700 bg-sky-50 dark:text-sky-400 dark:bg-sky-500/10",
                                                                range.color === 'amber' && "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10",
                                                                range.color === 'rose' && "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10",
                                                            )}>{range.label}</span>
                                                        </div>
                                                        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div className={cn(
                                                                "h-full rounded-full transition-all duration-500",
                                                                range.width,
                                                                range.color === 'emerald' && "bg-gradient-to-r from-emerald-400 to-emerald-500",
                                                                range.color === 'sky' && "bg-gradient-to-r from-sky-400 to-sky-500",
                                                                range.color === 'amber' && "bg-gradient-to-r from-amber-400 to-amber-500",
                                                                range.color === 'rose' && "bg-gradient-to-r from-rose-400 to-rose-500",
                                                            )} />
                                                        </div>
                                                        <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{lr.range_details}</p>
                                                    </div>

                                                    {/* Accuracy */}
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-[13px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Vocabulary Accuracy</span>
                                                            <span className={cn(
                                                                "text-[12px] font-bold uppercase px-2 py-0.5 rounded-full",
                                                                accuracy.color === 'emerald' && "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10",
                                                                accuracy.color === 'sky' && "text-sky-700 bg-sky-50 dark:text-sky-400 dark:bg-sky-500/10",
                                                                accuracy.color === 'amber' && "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10",
                                                                accuracy.color === 'rose' && "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10",
                                                            )}>{accuracy.label}</span>
                                                        </div>
                                                        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div className={cn(
                                                                "h-full rounded-full transition-all duration-500",
                                                                accuracy.width,
                                                                accuracy.color === 'emerald' && "bg-gradient-to-r from-emerald-400 to-emerald-500",
                                                                accuracy.color === 'sky' && "bg-gradient-to-r from-sky-400 to-sky-500",
                                                                accuracy.color === 'amber' && "bg-gradient-to-r from-amber-400 to-amber-500",
                                                                accuracy.color === 'rose' && "bg-gradient-to-r from-rose-400 to-rose-500",
                                                            )} />
                                                        </div>
                                                        <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{lr.accuracy_details}</p>
                                                    </div>
                                                </div>

                                                {/* Vocabulary Drills */}
                                                {lr.vocab_drills?.length > 0 && (
                                                    <div className="border-t border-slate-100 dark:border-slate-800/50 pt-5">
                                                        <div className="text-[13px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
                                                            <Dumbbell className="w-4 h-4" /> Vocabulary Drills
                                                        </div>
                                                        <div className="space-y-4">
                                                            {lr.vocab_drills.map((drill: any, idx: number) => (
                                                                <div key={idx} className="bg-gradient-to-br from-purple-50/40 to-white dark:from-purple-950/20 dark:to-slate-900 rounded-xl border border-purple-100/60 dark:border-purple-500/10 p-4 sm:p-5">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs font-black">{idx + 1}</span>
                                                                        <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">{drill.drill_name}</h5>
                                                                        <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-full ml-auto">{drill.weakness_targeted}</span>
                                                                    </div>
                                                                    <p className="text-[14px] text-slate-600 dark:text-slate-400 mb-3">{drill.instructions}</p>

                                                                    {/* Practice items */}
                                                                    {drill.practice_items?.length > 0 && (
                                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                                            {drill.practice_items.map((item: string, i: number) => (
                                                                                <span key={i} className="text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 px-2.5 py-1 rounded-lg">
                                                                                    {item}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    {/* Before/After example */}
                                                                    {(drill.example_before || drill.example_after) && (
                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                                                            {drill.example_before && (
                                                                                <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-500/10 rounded-lg px-3 py-2">
                                                                                    <div className="text-[9px] font-bold uppercase text-rose-500 mb-1">Before</div>
                                                                                    <p className="text-xs text-slate-600 dark:text-slate-400 line-through decoration-rose-400/50">{drill.example_before}</p>
                                                                                </div>
                                                                            )}
                                                                            {drill.example_after && (
                                                                                <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-500/10 rounded-lg px-3 py-2">
                                                                                    <div className="text-[9px] font-bold uppercase text-emerald-500 mb-1">After</div>
                                                                                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{drill.example_after}</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Topic Word Bank */}
                                                {lr.topic_word_bank && (
                                                    <div className="border-t border-slate-100 dark:border-slate-800/50 pt-5">
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-2">
                                                            <FileText className="w-3.5 h-3.5" /> Topic Word Bank
                                                        </div>
                                                        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-4">{lr.topic_word_bank.topic}</p>

                                                        {/* Words grid */}
                                                        {lr.topic_word_bank.words?.length > 0 && (
                                                            <div className="mb-6">
                                                                <div className="text-[9px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-3 tracking-widest pl-1">Key Words</div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    {lr.topic_word_bank.words.map((w: any, idx: number) => (
                                                                        <div key={idx} className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 rounded-xl p-4 flex flex-col justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                                            <div className="mb-2">
                                                                                <span className="text-sm font-extrabold text-purple-700 dark:text-purple-400 mr-2">{w.term}</span>
                                                                                {w.definition && <span className="text-[11px] text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 pl-2">— {w.definition}</span>}
                                                                            </div>
                                                                            <p className="text-[12px] text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800/50 leading-relaxed mt-auto shadow-sm">"{w.example_sentence}"</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Collocations flex wrap */}
                                                        {lr.topic_word_bank.collocations?.length > 0 && (
                                                            <div className="relative">
                                                                <div className="text-[9px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-3 tracking-widest pl-1">Useful Collocations</div>
                                                                <div className="flex flex-wrap gap-2.5">
                                                                    {lr.topic_word_bank.collocations.map((c: any, idx: number) => (
                                                                        <div key={`colloc-${idx}`} className="group relative">
                                                                            <div className="bg-white dark:bg-purple-950/20 border border-purple-100 dark:border-purple-500/20 rounded-full px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/40 hover:border-purple-200 dark:hover:border-purple-500/40 transition-all cursor-crosshair shadow-sm hover:shadow-md">
                                                                                <span className="text-sm font-bold text-purple-700 dark:text-purple-300 tracking-tight">{c.term}</span>
                                                                            </div>
                                                                            {/* Tooltip on hover */}
                                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[250px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                                                                <div className="bg-slate-800 text-white text-xs p-2.5 rounded-lg shadow-xl border border-slate-700 text-center font-medium italic relative">
                                                                                    "{c.example_sentence}"
                                                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Overall Assessment */}
                                                {lr.overall_lr_assessment && (
                                                    <div className="border-t border-slate-100 dark:border-slate-800/50 pt-4">
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{lr.overall_lr_assessment}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* TENSE REFERENCE CARD & ERROR BREAKDOWN */}
                                {currentCriterion === 'grammatical_range_accuracy' && (() => {
                                    const tenseInfo = coaching.raw_explainer_output?.grammar_feedback || {};
                                    const recommendedTense = tenseInfo.recommended_tense;
                                    const tenseRule = tenseInfo.tense_rule_summary;
                                    const tenseExamples = tenseInfo.tense_examples || [];
                                    const tenseApplicability = tenseInfo.tense_applicability || [];
                                    const studentTenseErrors = tenseInfo.student_tense_error_count || 0;
                                    
                                    const microFixes = coaching.raw_explainer_output?.micro_fixes || [];
                                    const rawGrammarErrors = coaching.grammar_errors || [];
                                    
                                    // Group fixes by type for the breakdown
                                    const groupedErrors: Record<string, any[]> = {};
                                    microFixes.forEach((fix: any) => {
                                        const type = fix.specific_error || fix.error_type || 'grammar';
                                        if (!groupedErrors[type]) groupedErrors[type] = [];
                                        groupedErrors[type].push(fix);
                                    });

                                    const errorTypes = Object.entries(groupedErrors)
                                        .sort((a, b) => b[1].length - a[1].length);

                                    if (!recommendedTense && !tenseRule && errorTypes.length === 0) return null;

                                    return (
                                        <div className="space-y-8 mt-6">
                                            {/* Component C: Tense Reference Card */}
                                            {(recommendedTense || tenseRule) && (
                                                <div className="rounded-2xl border border-blue-200/60 dark:border-blue-900/40 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                                                    <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 border-b border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                                                                <Clock className="w-5 h-5" />
                                                            </div>
                                                            <span className="text-[14px] font-black text-blue-900 dark:text-blue-300 uppercase tracking-widest">Tense Guide For This Chart</span>
                                                        </div>
                                                        {studentTenseErrors > 0 && (
                                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full border border-rose-100 dark:border-rose-500/20 animate-pulse">
                                                                <AlertTriangle className="w-3.5 h-3.5" />
                                                                <span className="text-[11px] font-bold uppercase tracking-tight">Requires Attention</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="p-5 sm:p-6 space-y-6">
                                                        {/* The Essential Rule */}
                                                        <div className="space-y-3">
                                                            <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Master Rule</div>
                                                            <p className="text-[17px] font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                                                                {tenseRule || `Use ${(recommendedTense || 'past_simple').replace(/_/g, ' ')} for describing the data in this chart.`}
                                                            </p>
                                                        </div>

                                                        {/* Student Mistake Warning */}
                                                        {studentTenseErrors > 0 && (
                                                            <div className="bg-rose-50/50 dark:bg-rose-500/5 rounded-xl border border-rose-100 dark:border-rose-500/20 p-4 flex gap-3">
                                                                <div className="p-2 bg-rose-100 dark:bg-rose-500/20 rounded-lg text-rose-600 dark:text-rose-400 h-fit">
                                                                    <AlertCircle className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-[13px] font-bold text-rose-900 dark:text-rose-200">Tense errors detected</div>
                                                                    <p className="text-[13px] text-rose-700/80 dark:text-rose-400/80 mt-0.5">
                                                                        You used the wrong tense {studentTenseErrors} {studentTenseErrors === 1 ? 'time' : 'times'}. Refer to the examples below to fix these.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                                                            {/* Examples Column */}
                                                            {tenseExamples.length > 0 && (
                                                                <div className="space-y-4">
                                                                    <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Chart-Specific Examples
                                                                    </div>
                                                                    <div className="space-y-3">
                                                                        {tenseExamples.map((ex: any, i: number) => (
                                                                            <div key={i} className="space-y-2.5">
                                                                                <div className="flex items-start gap-2 text-[14px]">
                                                                                    <div className="mt-1 w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                                                                        <span className="text-[10px]">✅</span>
                                                                                    </div>
                                                                                    <span className="font-medium text-slate-700 dark:text-slate-300">"{ex.correct}"</span>
                                                                                </div>
                                                                                <div className="flex items-start gap-2 text-[14px]">
                                                                                    <div className="mt-1 w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                                                                                        <span className="text-[10px]">❌</span>
                                                                                    </div>
                                                                                    <span className="font-medium text-slate-500 dark:text-slate-400 line-through">"{ex.incorrect}"</span>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Applicability Column */}
                                                            {tenseApplicability.length > 0 && (
                                                                <div className="space-y-4">
                                                                    <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                                        <Table className="w-3.5 h-3.5 text-blue-500" /> Tense Usage Table
                                                                    </div>
                                                                    <div className="space-y-2.5">
                                                                        {tenseApplicability.map((item: any, i: number) => (
                                                                            <div key={i} className={`flex items-center justify-between p-2.5 rounded-lg border text-[13px] ${item.is_correct ? 'bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-100/50 dark:border-emerald-500/10' : 'bg-rose-50/30 dark:bg-rose-500/5 border-rose-100/50 dark:border-rose-500/10 opacity-75'}`}>
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className={`font-bold ${item.is_correct ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>{item.tense}</span>
                                                                                    <span className="text-slate-400 dark:text-slate-500">•</span>
                                                                                    <span className="text-slate-600 dark:text-slate-400 font-medium">{item.context}</span>
                                                                                </div>
                                                                                <div className={`p-0.5 rounded-full ${item.is_correct ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-600'}`}>
                                                                                    {item.is_correct ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Component A: Error Type Breakdown */}
                                            {errorTypes.length > 0 && (
                                                <div className="space-y-5">
                                                    <div className="flex items-center gap-2 text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                                                        <Activity className="w-4 h-4 text-rose-400" /> Errors found in your essay
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {errorTypes.map(([type, fixes]) => {
                                                            const count = fixes.length;
                                                            const sampleFix = fixes[0];
                                                            
                                                            // Theme mapping
                                                            let theme = {
                                                                bg: "bg-slate-50 dark:bg-slate-800/40",
                                                                border: "border-slate-100 dark:border-slate-800",
                                                                accent: "bg-slate-400",
                                                                text: "text-slate-700 dark:text-slate-300",
                                                                label: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
                                                                Icon: AlertCircle
                                                            };
                                                            
                                                            if (type.includes('tense')) {
                                                                theme = { ...theme, bg: "bg-rose-50/40 dark:bg-rose-500/5", border: "border-rose-100 dark:border-rose-500/20", accent: "bg-rose-500", label: "bg-rose-100/80 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400", Icon: Clock };
                                                            } else if (type.includes('article')) {
                                                                theme = { ...theme, bg: "bg-orange-50/40 dark:bg-orange-500/5", border: "border-orange-100 dark:border-orange-500/20", accent: "bg-orange-500", label: "bg-orange-100/80 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400", Icon: Type };
                                                            } else if (type.includes('preposition')) {
                                                                theme = { ...theme, bg: "bg-amber-50/40 dark:bg-amber-500/5", border: "border-amber-100 dark:border-amber-500/20", accent: "bg-amber-500", label: "bg-amber-100/80 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400", Icon: Anchor };
                                                            } else if (type.includes('subject_verb')) {
                                                                theme = { ...theme, bg: "bg-indigo-50/40 dark:bg-indigo-500/5", border: "border-indigo-100 dark:border-indigo-500/20", accent: "bg-indigo-500", label: "bg-indigo-100/80 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400", Icon: GitMerge };
                                                            } else if (type.includes('comparison')) {
                                                                theme = { ...theme, bg: "bg-blue-50/40 dark:bg-blue-500/5", border: "border-blue-100 dark:border-blue-500/20", accent: "bg-blue-500", label: "bg-blue-100/80 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400", Icon: Scale };
                                                            } else if (type.includes('style') || type.includes('complex')) {
                                                                theme = { ...theme, bg: "bg-violet-50/40 dark:bg-violet-500/5", border: "border-violet-100 dark:border-violet-500/20", accent: "bg-violet-500", label: "bg-violet-100/80 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400", Icon: Sparkles };
                                                            }

                                                            const formattedType = type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

                                                            return (
                                                                <div key={type} className={`group rounded-2xl border ${theme.border} ${theme.bg} overflow-hidden shadow-sm hover:shadow-md transition-all`}>
                                                                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                                        <div className="flex items-start gap-4">
                                                                            <div className={`mt-1 h-10 w-10 rounded-xl ${theme.label} flex items-center justify-center shrink-0`}>
                                                                                <theme.Icon className="w-5 h-5" />
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <div className="flex items-center gap-2">
                                                                                    <h4 className="text-[16px] font-black text-slate-800 dark:text-slate-100 tracking-tight">{formattedType}</h4>
                                                                                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${theme.label}`}>
                                                                                        {count} {count === 1 ? 'Error' : 'Errors'}
                                                                                    </span>
                                                                                </div>
                                                                                <p className="text-[14px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                                                                                    {sampleFix.explanation || `Recurring issue with ${formattedType.toLowerCase()} found in the essay.`}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100/50 dark:border-slate-800/50 sm:w-64 shrink-0">
                                                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 items-center flex gap-1.5 font-sans">
                                                                                <ChevronRight className="w-3 h-3 text-emerald-500" /> Example Fix
                                                                            </div>
                                                                            <div className="text-[13px] font-semibold text-slate-700 dark:text-slate-200 truncate-2-lines leading-snug">
                                                                                {sampleFix.corrected_sentence || sampleFix.corrected || 'Refer to detail view'}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* 4a. GRAMMAR PATTERN LESSONS — Grouped error patterns with examples from the essay */}
                                {currentCriterion === 'grammatical_range_accuracy' && coaching.raw_explainer_output?.grammar_feedback?.pattern_lessons?.length > 0 && (
                                    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mt-6">
                                        <div className="bg-white dark:bg-slate-800/40 p-5 pl-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-3">
                                            <div className="p-2 bg-violet-50 dark:bg-violet-500/10 rounded-xl text-violet-600 dark:text-violet-400"><PenTool className="w-5 h-5" /></div>
                                            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Grammar Lessons</span>
                                        </div>
                                        <div className="p-5 sm:p-6 space-y-12">
                                            {coaching.raw_explainer_output.grammar_feedback.pattern_lessons.map((lesson: any, idx: number) => (
                                                <div key={`lesson-${idx}`} className="relative">
                                                    {/* Left Accent Bar connected to content */}
                                                    <div className="absolute left-0 top-1 bottom-0 w-8 flex flex-col items-center">
                                                        <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 border-2 border-white dark:border-slate-900 flex items-center justify-center z-10 shadow-sm">
                                                            <span className="text-violet-600 dark:text-violet-400 font-black text-[12px]">{idx + 1}</span>
                                                        </div>
                                                        {idx < coaching.raw_explainer_output.grammar_feedback.pattern_lessons.length - 1 && (
                                                            <div className="w-0.5 h-full bg-slate-100 dark:bg-slate-800/80 -mt-2"></div>
                                                        )}
                                                    </div>

                                                    <div className="pl-12 space-y-5 pb-2">
                                                        {/* Pattern Header */}
                                                        <div className="pt-1">
                                                            <h4 className="text-[16px] font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                                                                {lesson.pattern_name_friendly || lesson.error_pattern || 'Grammar Pattern'}
                                                            </h4>
                                                        </div>

                                                        {/* The Rule */}
                                                        {lesson.the_rule && (
                                                            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 rounded-xl p-5 relative overflow-hidden group">
                                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-400 dark:bg-violet-500 rounded-l-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                                                                <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                                    <BookOpen className="w-4 h-4 text-violet-500" /> The Rule
                                                                </div>
                                                                <p className="text-[17px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{lesson.the_rule}</p>
                                                            </div>
                                                        )}

                                                        {/* Examples from the essay */}
                                                        {lesson.examples_from_essay?.length > 0 && (
                                                            <div className="space-y-4 pt-2">
                                                                <div className="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">Examples from your essay:</div>
                                                                {lesson.examples_from_essay.map((ex: any, exIdx: number) => {
                                                                    const isIdentical = ex.original?.trim() === ex.corrected?.trim();
                                                                    return (
                                                                        <div key={`ex-${idx}-${exIdx}`} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
                                                                            {isIdentical ? (
                                                                                <div className="space-y-2">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                                                                        <div className="text-[11px] font-black tracking-widest text-emerald-500 uppercase">Excellent Usage</div>
                                                                                    </div>
                                                                                    <p className="text-[17px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                                                                        "{ex.original}"
                                                                                    </p>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                                                                    {(() => {
                                                                                        const diffs = diffWords(ex.original || '', ex.corrected || '');
                                                                                        return (
                                                                                            <>
                                                                                                <div className="space-y-3">
                                                                                                    <div className="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                                                                        <div className="w-5 h-5 rounded bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500"><AlertCircle className="w-3.5 h-3.5" /></div> Original
                                                                                                    </div>
                                                                                                    <div className="text-[16px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                                                                                        {ex.error_highlighted ? (
                                                                                                            <>
                                                                                                                {ex.original?.split(ex.error_highlighted).map((part: string, pi: number, arr: string[]) => (
                                                                                                                    <span key={pi}>
                                                                                                                        {part}
                                                                                                                        {pi < arr.length - 1 && (
                                                                                                                            <span className="text-rose-600 dark:text-rose-400 font-extrabold bg-rose-50 dark:bg-rose-500/10 px-1 rounded-sm border-b-2 border-rose-300 dark:border-rose-500/50">
                                                                                                                                {ex.error_highlighted}
                                                                                                                            </span>
                                                                                                                        )}
                                                                                                                    </span>
                                                                                                                ))}
                                                                                                            </>
                                                                                                        ) : (
                                                                                                            <>
                                                                                                                "{diffs.map((part: any, i: number) => (
                                                                                                                    <span key={i} className={part.added ? "hidden" : part.removed ? "text-rose-600 dark:text-rose-400 font-extrabold bg-rose-50 dark:bg-rose-500/10 px-1 rounded-sm border-b-2 border-rose-300 dark:border-rose-500/50" : ""}>
                                                                                                                        {!part.added && part.value}
                                                                                                                    </span>
                                                                                                                ))}"
                                                                                                            </>
                                                                                                        )}
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="space-y-3">
                                                                                                    <div className="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                                                                        <div className="w-5 h-5 rounded bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Sparkles className="w-3.5 h-3.5" /></div> Corrected
                                                                                                    </div>
                                                                                                    <div className="text-[16px] text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                                                                                                        "{diffs.map((part: any, i: number) => (
                                                                                                            <span key={i} className={part.removed ? "hidden" : part.added ? "text-emerald-700 dark:text-emerald-300 font-extrabold bg-emerald-50 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded-md border-b-2 border-emerald-300 dark:border-emerald-500/50" : ""}>
                                                                                                                {!part.removed && part.value}
                                                                                                            </span>
                                                                                                        ))}"
                                                                                                    </div>
                                                                                                </div>
                                                                                            </>
                                                                                        );
                                                                                    })()}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}

                                                        {/* Memory Trick */}
                                                        {lesson.memory_trick && (
                                                            <div className="flex items-start gap-4 bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-xl p-4 mt-6">
                                                                <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                                                                    <Lightbulb className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-[11px] font-black tracking-widest text-amber-600 dark:text-amber-500 uppercase mb-1">Memory Trick</div>
                                                                    <p className="text-[14px] font-medium text-amber-900/80 dark:text-amber-200/90 leading-relaxed">{lesson.memory_trick}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 4b. SENTENCE COMPLEXITY UPGRADES */}
                                {currentCriterion === 'grammatical_range_accuracy' && coaching.raw_explainer_output?.grammar_feedback?.complexity_suggestions?.length > 0 && (
                                    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mt-6">
                                        <div className="bg-white dark:bg-slate-800/40 p-5 pl-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-3">
                                            <div className="p-2 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl text-cyan-600 dark:text-cyan-400"><ArrowRight className="w-5 h-5" /></div>
                                            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Sentence Complexity Upgrades</span>
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto hidden sm:block tracking-widest font-black uppercase">Combine simple sentences</span>
                                        </div>
                                        <div className="p-5 sm:p-6 space-y-6">
                                            {coaching.raw_explainer_output.grammar_feedback.complexity_suggestions.map((sug: any, idx: number) => (
                                                <div key={`comp-${idx}`} className="flex flex-col bg-slate-50/80 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                                                    {/* Top: Simple sentences */}
                                                    <div className="p-4 bg-slate-100/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-700/50 relative">
                                                        <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Your Simple Sentences</div>
                                                        <div className="space-y-1.5 relative z-10">
                                                            {sug.simple_sentences?.map((s: string, si: number) => (
                                                                <p key={si} className="text-sm text-slate-700 dark:text-slate-300">
                                                                    "{s}"
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Visual Merge Connector */}
                                                    <div className="flex justify-center -my-3.5 relative z-20">
                                                        <div className="bg-slate-100 dark:bg-slate-800 border border-slate-600 rounded-full p-1 shadow-md flex items-center justify-center">
                                                            <Merge className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
                                                        </div>
                                                    </div>

                                                    {/* Bottom: Complex version */}
                                                    <div className="p-4 pt-5 bg-emerald-500/5 relative">
                                                        <div className="text-[10px] font-bold text-emerald-400 uppercase mb-2">Band 7+ Version</div>
                                                        <p className="text-sm text-emerald-800 dark:text-emerald-100 leading-relaxed font-medium">
                                                            "{sug.complex_version}"
                                                        </p>

                                                        {/* Structures used */}
                                                        {sug.structures_demonstrated?.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mt-3">
                                                                {sug.structures_demonstrated.map((struct: string, si: number) => (
                                                                    <span key={si} className="px-2 py-1 bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 text-[11px] rounded-full border border-cyan-500/20 font-medium">
                                                                        {struct}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Explanation */}
                                                        {sug.explanation && (
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 flex gap-2 mt-3">
                                                                <Info className="w-3.5 h-3.5 shrink-0 text-cyan-700 dark:text-cyan-400 mt-0.5" />
                                                                <span>{sug.explanation}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Component B: Structure Variety Indicator */}
                                            {(() => {
                                                const simpleCount = coaching.raw_explainer_output?.grammar_feedback?.simple_sentence_count;
                                                const complexCount = coaching.raw_explainer_output?.grammar_feedback?.complex_sentence_count;
                                                
                                                if (simpleCount === undefined || complexCount === undefined) return null;
                                                
                                                const total = simpleCount + complexCount;
                                                if (total === 0) return null;
                                                
                                                const complexRatio = complexCount / total;
                                                const complexPercentage = Math.round(complexRatio * 100);
                                                
                                                const bandScore = evaluation?.overall_band || 6.0;
                                                let targetRatio = 0.3; // Default for Band 6-7
                                                if (bandScore >= 8.0) targetRatio = 0.4;
                                                else if (bandScore >= 7.0) targetRatio = 0.3;
                                                else if (bandScore >= 6.0) targetRatio = 0.2;
                                                else targetRatio = 0.15; // Band 5 and below
                                                
                                                let message = "";
                                                let colorClass = "";
                                                if (complexRatio < targetRatio) {
                                                    message = `Add 1-2 more complex structures for Band ${Math.ceil(Math.max(bandScore, 6))}`;
                                                    colorClass = "bg-amber-400";
                                                } else if (complexRatio < targetRatio + 0.1) {
                                                    message = `Good mix — on track for Band ${Math.ceil(Math.max(bandScore, 6))}`;
                                                    colorClass = "bg-emerald-400";
                                                } else {
                                                    message = "Strong structural variety";
                                                    colorClass = "bg-emerald-500";
                                                }

                                                return (
                                                    <div className="mt-8 border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900/50">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="text-[11px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-2">
                                                                <List className="w-3.5 h-3.5 text-cyan-500" /> Structure Variety
                                                            </div>
                                                            <div className="text-[12px] font-bold text-slate-600 dark:text-slate-400">
                                                                <span className="text-slate-800 dark:text-slate-200">{simpleCount}</span> simple / <span className="text-slate-800 dark:text-slate-200">{complexCount}</span> complex
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Progress Bar */}
                                                        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex mb-3">
                                                            <div className="h-full bg-slate-300 dark:bg-slate-600 transition-all duration-500" style={{ width: `${100 - complexPercentage}%` }} />
                                                            <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: `${complexPercentage}%` }} />
                                                        </div>
                                                        
                                                        <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-lg">
                                                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                                            <div className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
                                                                {message}
                                                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Target: at least {Math.round(targetRatio * 100)}% complex sentences.</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                )}

                                {/* 4c. STRATEGY CARD - Grammar Corrections (micro_feedback fallback) */}
                                {(() => {
                                    if (currentCriterion !== 'grammatical_range_accuracy' || !coaching.grammar_errors?.length) return null;
                                    
                                    // Filter out errors that are exactly matching examples already shown in 4a (Grammar lessons)
                                    const patternLessons = coaching.raw_explainer_output?.grammar_feedback?.pattern_lessons || [];
                                    const patternExamples = new Set(
                                        patternLessons.flatMap((l: any) => l.examples_from_essay?.map((ex: any) => ex.original?.trim()))
                                    );
                                    
                                    const uniqueErrors = coaching.grammar_errors.filter(
                                        (err: any) => !patternExamples.has(err.original?.trim())
                                    );
                                    
                                    if (uniqueErrors.length === 0) return null;
                                    
                                    return (
                                        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mt-6">
                                            <div className="bg-white dark:bg-slate-800/40 p-5 pl-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-3">
                                                <div className="p-2 bg-violet-50 dark:bg-violet-500/10 rounded-xl text-violet-600 dark:text-violet-400"><Layout className="w-5 h-5" /></div>
                                                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Sentence-Level Corrections</span>
                                            </div>
                                            <div className="p-5 sm:p-6 space-y-6">
                                                {uniqueErrors.slice(0, 5).map((err: any, idx: number) => (
                                                    <div key={`gram-${idx}`} className="space-y-4 relative">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                                        <div className="space-y-2">
                                                            <div className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                                <div className="text-rose-400"><AlertCircle className="w-4 h-4" /></div> Original
                                                            </div>
                                                            <p className="text-[14px] text-amber-700/80 dark:text-amber-300/70 line-through decoration-rose-400/50 pl-3 border-l-2 border-amber-300 dark:border-amber-600/50 leading-relaxed italic bg-amber-50/40 dark:bg-amber-950/20 py-1.5 rounded-r">
                                                                "{err.original}"
                                                            </p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                                <div className="text-emerald-500"><Sparkles className="w-4 h-4" /></div> Corrected
                                                            </div>
                                                            <p className="text-[14px] font-medium text-slate-800 dark:text-slate-200 pl-2 border-l-2 border-emerald-400 dark:border-emerald-500/50 leading-relaxed">
                                                                "{err.corrected}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 text-[14px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                                        <Info className="w-3.5 h-3.5 shrink-0 text-violet-400 mt-0.5" />
                                                        <span>{err.explanation}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* ACTION PLAN ITEMS (from feedback items) */}
                                {actionItems.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-[14px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2 mt-8">
                                            <Layout className="w-4 h-4" /> Action Plan
                                        </h4>
                                        <div className="grid gap-4">
                                            {actionItems.map((item, idx) => (
                                                <div key={`act-${idx}`} className="p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 relative overflow-hidden group">
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500" />
                                                    <div className="font-extrabold text-[16px] uppercase text-slate-800 dark:text-slate-200 mb-2 pl-2 flex items-center gap-2">{item.title}</div>
                                                    <div className="text-slate-600 dark:text-slate-400 text-[17px] leading-relaxed pl-2 font-medium">
                                                        {(item.content || '').split(/(\*\*.*?\*\*)/g).map((part, pIdx) =>
                                                            part.startsWith('**') && part.endsWith('**') ? (
                                                                <strong key={pIdx} className="text-blue-600 dark:text-blue-400 font-bold">{part.slice(2, -2)}</strong>
                                                            ) : (
                                                                <span key={pIdx}>{part}</span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* MICRO DRILL (Alternative) */}
                                {currentCriterion === 'task_response' && coaching.raw_coach_output?.micro_drill && (
                                    <div className="rounded-xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/10 overflow-hidden mt-6">
                                        <div className="bg-blue-100/50 dark:bg-blue-900/20 p-3 border-b border-blue-500/20 flex items-center justify-between">
                                            <span className="text-[13px] font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wider">Training Drill</span>
                                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400 px-2.5 py-1 rounded-md shadow-sm border border-emerald-200 dark:border-emerald-800/50">Score Booster</span>
                                        </div>
                                        <div className="p-4 flex flex-col gap-4">
                                            <div className="flex flex-col sm:flex-row gap-5 border-b border-blue-200/50 dark:border-blue-900/50 pb-4">
                                                <div className="flex-1 space-y-2">
                                                    <h4 className="font-bold text-slate-800 dark:text-white text-lg">{coaching.raw_coach_output.micro_drill.drill_name}</h4>
                                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{coaching.raw_coach_output.micro_drill.instructions}</p>
                                                </div>
                                                <div className="w-full sm:w-48 shrink-0">
                                                    <div className="text-xs text-blue-700 dark:text-blue-300 font-mono bg-blue-50 dark:bg-blue-950/50 p-3 rounded border border-blue-200 dark:border-blue-900/50 h-full">
                                                        <div className="uppercase text-xs text-blue-600 dark:text-blue-500 font-bold mb-1">Goal</div>
                                                        {coaching.raw_coach_output.micro_drill.purpose}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* NEW: Examiner Insight */}
                                            <div className="flex gap-2.5 bg-white/60 dark:bg-slate-900/40 p-3 rounded-lg">
                                                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                                <p className="text-[13px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                                                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Why it matters:</span> 
                                                    {coaching.raw_coach_output.micro_drill.examiner_insight || "Examiners actively look for these specific skills to distinguish high-band essays. Mastering this exercise directly contributes to a higher Task Response score."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* LOGIC REPAIRS */}
                                {currentCriterion === 'task_response' && coaching.raw_explainer_output?.macro_feedback?.map((macro: any, idx: number) => {
                                    // Calculate target band (current TR score + 1, max 8)
                                    const trScore = evaluation.criterion_scores.find(s => s.criterion === 'task_response')?.band || 6;
                                    const targetBand = Math.min(trScore + 1, 8);

                                    return (
                                        <div key={`macro-${idx}`} className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mt-6">
                                            <div className="bg-white dark:bg-slate-800/40 p-5 pl-6 border-b border-slate-50 dark:border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
                                                        <Lightbulb className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-[16px] font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Logic Repair</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs uppercase font-black tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-100 dark:border-amber-500/20">{macro.issue_identified?.replace(/_/g, ' ')}</span>
                                                    <span className="text-xs font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1.5 rounded-lg uppercase border border-emerald-100 dark:border-emerald-500/20">Target: Band {targetBand}</span>
                                                </div>
                                            </div>
                                            <div className="p-5 sm:p-6 space-y-6">
                                                <div className="text-[15px] text-slate-700 dark:text-slate-300 italic font-medium border-l-2 border-amber-400/50 dark:border-amber-500/40 pl-4 py-1 leading-relaxed">"{macro.logic_diagnosis}"</div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                                                    <div className="flex flex-col space-y-3 h-full">
                                                        <div className="text-[13px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-2">
                                                            <div className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"><AlertCircle className="w-4 h-4" /></div> Original
                                                        </div>
                                                        <p className="text-[16px] text-slate-500 dark:text-slate-400 line-through decoration-rose-400/50 decoration-2 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800/50 leading-relaxed overflow-y-auto custom-scrollbar flex-1">{macro.original_paragraph}</p>
                                                    </div>
                                                    <div className="flex flex-col space-y-3 h-full">
                                                        <div className="text-[13px] uppercase font-black tracking-widest text-emerald-500 flex items-center gap-2 shrink-0">
                                                            <div className="w-5 h-5 rounded bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Sparkles className="w-4 h-4" /></div>
                                                            Band {targetBand} Rewrite
                                                            <span className="text-amber-500 dark:text-amber-400/70 lowercase font-medium">({macro.improved_paragraph?.split(/\s+/).length || 0} words)</span>
                                                        </div>
                                                        <p className="text-[16px] font-semibold text-slate-800 dark:text-slate-200 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-xl leading-relaxed overflow-y-auto custom-scrollbar flex-1 shadow-inner">{macro.improved_paragraph}</p>
                                                    </div>
                                                </div>

                                                {macro.key_changes_made?.length > 0 && (
                                                    <div className="border-t border-slate-100 dark:border-slate-800/50 pt-5 mt-4">
                                                        <div className="text-[13px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2 mb-3">
                                                            <CheckCircle2 className="w-4 h-4 text-amber-500" /> Key Changes Log
                                                        </div>
                                                        <ul className="space-y-3 pl-1">
                                                            {macro.key_changes_made.map((change: string, i: number) => (
                                                                <li key={i} className="flex gap-3 text-[16px] text-slate-700 dark:text-slate-300 font-medium items-start">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
                                                                    <span className="leading-relaxed">{change}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* IDEA DEVELOPMENT ANALYSIS (Task Response only) */}
                                {currentCriterion === 'task_response' && coaching.raw_explainer_output?.idea_development && (() => {
                                    const ideaDev = coaching.raw_explainer_output.idea_development;
                                    const clarityConfig: Record<string, { label: string; color: string; icon: string }> = {
                                        clear: { label: 'Clear', color: 'emerald', icon: '✅' },
                                        vague: { label: 'Vague', color: 'amber', icon: '⚠️' },
                                        missing: { label: 'Missing', color: 'rose', icon: '❌' },
                                    };
                                    const levelConfig: Record<string, { label: string; color: string; dot: string }> = {
                                        well_developed: { label: 'Well Developed', color: 'emerald', dot: 'bg-emerald-500' },
                                        partially_developed: { label: 'Partially Developed', color: 'amber', dot: 'bg-amber-500' },
                                        underdeveloped: { label: 'Underdeveloped', color: 'rose', dot: 'bg-rose-500' },
                                        missing: { label: 'Missing', color: 'slate', dot: 'bg-slate-400' },
                                    };
                                    const clarity = clarityConfig[ideaDev.thesis_clarity] || clarityConfig.vague;

                                    return (
                                        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mt-6">
                                            {/* Header */}
                                            <div className="p-5 pl-6 border-b border-slate-50 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                                                        <Map className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Idea Development</span>
                                                </div>
                                            </div>

                                            <div className="p-5 sm:p-6 space-y-6">
                                                {/* Thesis Assessment */}
                                                <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                                                    <div className="flex-1">
                                                        <div className="text-[13px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-2">
                                                            <Target className="w-4 h-4" /> Your Thesis
                                                        </div>
                                                        <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic border-l-2 border-indigo-400/50 dark:border-indigo-500/40 pl-4">
                                                            "{ideaDev.essay_thesis}"
                                                        </p>
                                                    </div>
                                                    <span className={cn(
                                                        "text-[12px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border shrink-0",
                                                        clarity.color === 'emerald' && "text-emerald-600 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20",
                                                        clarity.color === 'amber' && "text-amber-600 bg-amber-50 border-amber-100 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20",
                                                        clarity.color === 'rose' && "text-rose-600 bg-rose-50 border-rose-100 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20",
                                                    )}>
                                                        {clarity.icon} {clarity.label}
                                                    </span>
                                                </div>

                                                {/* Argument Map Timeline */}
                                                {ideaDev.idea_map?.length > 0 && (
                                                    <div className="border-t border-slate-100 dark:border-slate-800/50 pt-5">
                                                        <div className="text-[13px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
                                                            <AlignLeft className="w-4 h-4" /> Argument Map
                                                        </div>
                                                        <div className="relative space-y-0">
                                                            {/* Timeline connector line */}
                                                            <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-indigo-300 via-slate-200 to-slate-200 dark:from-indigo-600 dark:via-slate-700 dark:to-slate-700" />

                                                            {ideaDev.idea_map.map((node: any, idx: number) => {
                                                                const level = levelConfig[node.development_level] || levelConfig.underdeveloped;
                                                                return (
                                                                    <div key={idx} className="relative flex gap-4 py-3">
                                                                        {/* Timeline dot */}
                                                                        <div className={cn("w-[23px] h-[23px] rounded-full border-[3px] border-white dark:border-slate-900 shrink-0 z-10 shadow-sm", level.dot)} />

                                                                        <div className="flex-1 -mt-0.5">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <span className={cn(
                                                                                    "text-[11px] font-bold uppercase px-2 py-0.5 rounded-full",
                                                                                    level.color === 'emerald' && "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10",
                                                                                    level.color === 'amber' && "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10",
                                                                                    level.color === 'rose' && "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10",
                                                                                    level.color === 'slate' && "text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-800",
                                                                                )}>
                                                                                    {level.label}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-[16px] text-slate-700 dark:text-slate-200 leading-relaxed font-bold">{node.idea_summary}</p>
                                                                            <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-1">{node.development_details}</p>

                                                                            {node.evidence_used && (
                                                                                <div className="mt-2 text-[14px] text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/10 inline-block">
                                                                                    <strong>Evidence:</strong> {node.evidence_used}
                                                                                </div>
                                                                            )}

                                                                            {node.missing_elements?.length > 0 && (
                                                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                                                    {node.missing_elements.map((el: string, i: number) => (
                                                                                        <span key={i} className="text-[12px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-100 dark:border-rose-500/20">
                                                                                            ✗ {el}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Alternative Ideas */}
                                                {ideaDev.alternative_ideas?.length > 0 && (
                                                    <div className="border-t border-slate-100 dark:border-slate-800/50 pt-5">
                                                        <div className="text-[13px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
                                                            <Compass className="w-4 h-4" /> Alternative Arguments You Could Explore
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                            {ideaDev.alternative_ideas.map((alt: any, idx: number) => (
                                                                <div key={idx} className="group relative bg-gradient-to-br from-indigo-50/40 to-white dark:from-indigo-950/20 dark:to-slate-900 rounded-xl border border-indigo-100/60 dark:border-indigo-500/10 p-4 hover:shadow-md transition-all duration-200 hover:border-indigo-200 dark:hover:border-indigo-500/20">
                                                                    <div className="flex items-start gap-2 mb-2">
                                                                        <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5 text-xs font-black">{idx + 1}</div>
                                                                        <h5 className="text-[14px] font-bold text-slate-800 dark:text-slate-200 leading-snug">{alt.idea}</h5>
                                                                    </div>
                                                                    <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">{alt.why_strong}</p>
                                                                    <div className="bg-white dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-lg px-3.5 py-2.5 text-[14px] text-indigo-700 dark:text-indigo-300 italic font-medium">
                                                                        "{alt.example_sentence}"
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Overall Assessment */}
                                                {ideaDev.overall_assessment && (
                                                    <div className="border-t border-slate-100 dark:border-slate-800/50 pt-4">
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{ideaDev.overall_assessment}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {currentCriterion === 'task_response' && !coaching.raw_coach_output?.the_one_big_change && actionItems.length === 0 && (
                                    <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                        <p className="text-slate-600 dark:text-slate-500">No high-level report items for this criterion.</p>
                                    </div>
                                )}
                            </div>
                        )}




                        {/* TAB: ISSUES */}
                        {activeTab === 'issues' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 relative z-10 max-w-4xl mx-auto py-4">
                                {issueItems.length > 0 ? issueItems.map((item, idx) => (
                                    <div key={`imp-${idx}`} className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 relative overflow-hidden group">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-400 to-rose-500" />
                                        <div className="p-5 sm:p-6 pl-6">
                                            <div className="font-extrabold text-[14px] uppercase text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2 tracking-widest">
                                                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" /> {item.title}
                                            </div>
                                            {/* Structured - Cohesion Issue */}
                                            {item.title === 'Cohesion Issue' && (item.content || '').includes('->') ? (() => {
                                                // ... (keep existing parsing logic for Cohesion Issue) ...
                                                const parts = (item.content || '').split('->');
                                                const problem = parts[0].trim();
                                                const rest = parts[1] || '';
                                                const fixEndIndex = rest.lastIndexOf('(');
                                                const fix = fixEndIndex > 0 ? rest.substring(0, fixEndIndex).trim() : rest.trim();
                                                const reason = fixEndIndex > 0 ? rest.substring(fixEndIndex + 1, rest.lastIndexOf(')')).trim() : 'Improve flow';

                                                return (
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                                            <div className="space-y-2">
                                                                <div className="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                                    <div className="text-rose-400"><AlertCircle className="w-3.5 h-3.5" /></div> Original
                                                                </div>
                                                                <p className="text-[16px] text-slate-500 dark:text-slate-400 line-through decoration-rose-400/50 pl-2 border-l-2 border-slate-200 dark:border-slate-700 leading-relaxed italic">
                                                                    "{problem}"
                                                                </p>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                                                                    <div className="text-emerald-500"><Sparkles className="w-3.5 h-3.5" /></div> Improved
                                                                </div>
                                                                <p className="text-[16px] font-semibold text-slate-800 dark:text-slate-200 pl-2 border-l-2 border-emerald-400 dark:border-emerald-500/50 leading-relaxed">
                                                                    "{fix}"
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 text-[14px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 mt-2">
                                                            <Info className="w-3.5 h-3.5 shrink-0 text-indigo-400 mt-0.5" />
                                                            <span><span className="font-bold text-slate-600 dark:text-slate-300">Why:</span> {reason}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })() : (
                                                /* Standard Text Content with Markdown Parsing */
                                                <div className="text-[17px] font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                                                    {(item.content || '').split(/(\*\*.*?\*\*)/).map((part, i) => {
                                                        if (part.startsWith('**') && part.endsWith('**')) {
                                                            return <strong key={i} className="font-extrabold text-rose-600 dark:text-rose-400">{part.slice(2, -2)}</strong>;
                                                        }
                                                        return <span key={i} className="opacity-90">{part}</span>;
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                        <p className="text-slate-600 dark:text-slate-500">No specific issues detected! Great job.</p>
                                    </div>
                                )}

                                {/* Pattern Breaker - Banned Items */}
                                {currentCriterion === 'task_response' && coaching.raw_coach_output?.pattern_breaker?.banned_list.map((item: any, i: number) => (
                                    <div key={`ban-${i}`} className="p-4 bg-rose-50/50 dark:bg-rose-950/5 space-y-2 border border-rose-200 dark:border-rose-900/30 rounded-xl">
                                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase">
                                            <AlertTriangle className="w-3.5 h-3.5" /> Avoid This
                                        </div>
                                        <div className="font-mono text-sm text-rose-700 dark:text-rose-200">"{item.banned_element}"</div>
                                        <div className="text-[14px] text-slate-600 dark:text-slate-400">{item.why_banned}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* TAB: ACTION PLAN (Summary) */}
                        {activeTab === 'summary' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 relative z-10 max-w-4xl mx-auto py-4">

                                {/* 1. SCORE CONTEXT & DIAGNOSIS */}
                                {coaching.score_context && coaching.diagnosis_summary && (
                                    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden">
                                        <div className="bg-white dark:bg-slate-800/40 p-5 pl-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                                                    <Activity className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">The Diagnosis</span>
                                            </div>
                                            <span className="text-[11px] font-black tracking-widest px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase">
                                                Target: Band {coaching.score_context.realistic_next_target}
                                            </span>
                                        </div>
                                        <div className="p-5 sm:p-6 space-y-6">
                                            <div className="flex gap-4 items-start">
                                                <div className="w-1.5 h-1.5 mt-2 bg-emerald-400 rounded-full shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                                                <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                                    <span className="text-slate-400 dark:text-slate-500 uppercase text-[11px] tracking-widest font-black block mb-1">Strength</span>
                                                    {coaching.diagnosis_summary.strength_acknowledged}
                                                </p>
                                            </div>
                                            <div className="flex gap-4 items-start">
                                                <div className="w-1.5 h-1.5 mt-2 bg-rose-400 rounded-full shrink-0 shadow-[0_0_8px_rgba(251,113,133,0.5)]"></div>
                                                <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                                    <span className="text-slate-400 dark:text-slate-500 uppercase text-[11px] tracking-widest font-black block mb-1">Core Limitation</span>
                                                    {coaching.diagnosis_summary.core_limitation}
                                                </p>
                                            </div>
                                            {coaching.motivation && (
                                                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/50 text-center">
                                                    <p className="text-[15px] text-indigo-400 dark:text-indigo-300/80 italic font-serif opacity-90 leading-relaxed tracking-wide">"{coaching.motivation.closing_message}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 2. THE ONE BIG CHANGE */}
                                {coaching.the_one_big_change && (
                                    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-500/30 overflow-hidden shadow-lg dark:shadow-amber-900/5 relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl -mr-16 -mt-16 rounded-full"></div>
                                        <div className="p-6 relative z-10">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black uppercase tracking-wider">
                                                    <Target className="w-5 h-5" /> The One Big Change
                                                </div>
                                                {coaching.the_one_big_change.visual_reminder && (
                                                    <span className="px-3 py-1 bg-amber-200 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase rounded border border-amber-300 dark:border-amber-500/30">
                                                        {coaching.the_one_big_change.visual_reminder}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-6 leading-relaxed">
                                                {coaching.the_one_big_change.change_statement}
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/20 p-4 rounded-lg">
                                                    <div className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase mb-2 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> Stop Doing</div>
                                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{coaching.the_one_big_change.what_to_stop_doing}</p>
                                                </div>
                                                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 p-4 rounded-lg">
                                                    <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Start Doing</div>
                                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{coaching.the_one_big_change.what_to_start_doing}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 3. PATTERN BREAKER */}
                                {coaching.pattern_breaker && coaching.pattern_breaker.banned_list.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-slate-800/60 mt-8">
                                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                            <h3 className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Crucial Constraints</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {coaching.pattern_breaker.banned_list.map((ban, i) => (
                                                <div key={`ban-${i}`} className="bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 p-4 rounded-lg flex flex-col items-start pt-3 shadow hover:border-slate-600 transition-colors">
                                                    <div className="flex items-center gap-2 w-full mb-3">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30 uppercase shrink-0">Banned</span>
                                                        <span className="font-mono text-[13px] text-slate-800 dark:text-slate-300 truncate">"{ban.banned_element}"</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed line-clamp-2">{ban.why_banned}</p>
                                                    <div className="bg-slate-50/80 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800 w-full mt-auto">
                                                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400/80 uppercase font-bold mb-1.5 tracking-wider">Use Instead</div>
                                                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 leading-relaxed">"{ban.alternative_to_use}"</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 4. MICRO-DRILL */}
                                {coaching.micro_drill && (
                                    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 overflow-hidden mt-8">
                                        <div className="bg-white dark:bg-slate-800/40 p-5 pl-6 border-b border-slate-50 dark:border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                                    <Dumbbell className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">{coaching.micro_drill.drill_name}</h3>
                                                    <p className="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">{coaching.micro_drill.purpose}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center gap-1.5 text-[11px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/50 uppercase">
                                                <ArrowUpCircle className="w-3.5 h-3.5" /> Score Booster
                                            </div>
                                        </div>
                                        <div className="p-5 sm:p-6 space-y-6">
                                            {/* EXAMINER INSIGHT */}
                                            <div className="flex gap-3 bg-amber-50/80 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20 p-4 rounded-xl items-start">
                                                <div className="mt-0.5 p-1 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
                                                    <Lightbulb className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black tracking-widest text-amber-800 dark:text-amber-500 uppercase overflow-hidden mb-1">Why this matters</p>
                                                    <p className="text-[13.5px] font-medium text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                                                        {coaching.micro_drill.examiner_insight || "Examiners actively evaluate these exact skills to distinguish high-scoring essays. Mastering this targeted exercise will directly elevate your score in the actual test."}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Info className="w-3.5 h-3.5 text-indigo-400" /> Instructions
                                                </h4>
                                                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 rounded-xl p-5">
                                                    <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">{coaching.micro_drill.instructions}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                    <PenTool className="w-3.5 h-3.5 text-indigo-400" /> Practice Material
                                                </h4>
                                                <div className="bg-slate-100/50 dark:bg-slate-800/30 p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                                                    <pre className="text-[14px] text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">{coaching.micro_drill.practice_content}</pre>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 5. NEXT ESSAY PLAN */}
                                {coaching.next_essay_plan && (
                                    <div className="space-y-6 mt-10">
                                        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                                            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400"><ListChecks className="w-4 h-4" /></div>
                                            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Next Essay Checklist</h3>
                                        </div>
                                        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/80 p-5 sm:p-6 relative overflow-hidden group">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-500" />

                                            <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4 pl-2">
                                                <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 dark:border-emerald-500/20 inline-block w-fit">
                                                    Target: {coaching.next_essay_plan.target_word_count} words
                                                </span>
                                                <span className="text-[15px] text-slate-700 dark:text-slate-300 font-medium">
                                                    {coaching.next_essay_plan.rewrite_original ? "Rewrite this exact essay applying the feedback." : `Write a new essay focusing on: ${coaching.next_essay_plan.prompt_type_to_practice}`}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 pl-2">
                                                <div className="space-y-4">
                                                    <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        Before Writing <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                                                    </h4>
                                                    <ul className="space-y-4">
                                                        {coaching.next_essay_plan.pre_writing_checklist.map((item, i) => (
                                                            <li key={`pre-${i}`} className="flex gap-3 text-[14px] text-slate-700 dark:text-slate-300 font-medium items-start group">
                                                                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0 mt-1.5 group-hover:bg-emerald-400 transition-colors" />
                                                                <span className="leading-relaxed group-hover:text-slate-800 dark:text-slate-200 dark:group-hover:text-white transition-colors">{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="space-y-4">
                                                    <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        While Writing <Scale className="w-3.5 h-3.5 text-slate-400" />
                                                    </h4>
                                                    <ul className="space-y-4">
                                                        {coaching.next_essay_plan.constraints.map((constraint, i) => (
                                                            <li key={`c-${i}`} className="flex flex-col gap-1 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                                                                <span className="font-bold text-rose-600 dark:text-rose-400 text-[14px] leading-relaxed flex items-center gap-2">
                                                                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                                                    {constraint.rule}
                                                                </span>
                                                                <span className="text-[12px] text-slate-500 dark:text-slate-400 font-medium pl-5 mt-1">
                                                                    Why: {constraint.rationale}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ORIGINAL TOPICS / VOCAB / COHERENCE (Fallback to bottom) */}
                                {/* We keep these sections from the old summary tab but moved them below the heavy coaching features */}

                                {((coaching.topic_analysis?.length ?? 0) > 0 || coaching.topic_vocabulary || coaching.coherence_advice) && (
                                    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/50 space-y-6">
                                        <div className="flex items-center gap-2 pb-1 border-b border-slate-800/60">
                                            <BookOpen className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                                            <h3 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Additional Study Material</h3>
                                        </div>

                                        {/* Topic Vocabulary from previous activeTab==='summary' code */}
                                        {coaching.topic_vocabulary && (
                                            <div className="bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-500/20 rounded-xl overflow-hidden mb-6">
                                                <div className="bg-emerald-500/10 p-4 border-b border-emerald-500/20 flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-xs tracking-wider">
                                                        <BookOpen className="w-4 h-4" /> Word Bank: {coaching.topic_vocabulary.topic}
                                                    </div>
                                                    <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">Band 9.0 Lexis</span>
                                                </div>
                                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Essential Words */}
                                                    <div className="space-y-3">
                                                        <div className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Essential Terms
                                                        </div>
                                                        <div className="space-y-2">
                                                            {coaching.topic_vocabulary.useful_words?.slice(0, 5).map((w: any, idx: number) => (
                                                                <div key={`cw-${idx}`} className="text-sm">
                                                                    <span className="font-bold text-emerald-700 dark:text-emerald-300">{w.word}</span>
                                                                    <div className="text-xs text-slate-500 dark:text-slate-400 italic">"{w.example}"</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {/* Collocations */}
                                                    <div className="space-y-3">
                                                        <div className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Power Collocations
                                                        </div>
                                                        <div className="space-y-2">
                                                            {coaching.topic_vocabulary.useful_collocations?.slice(0, 5).map((w: any, idx: number) => (
                                                                <div key={`cc-${idx}`} className="text-sm">
                                                                    <span className="font-bold text-cyan-800 dark:text-cyan-300">{w.word}</span>
                                                                    <div className="text-xs text-slate-500 dark:text-slate-400 italic">"{w.example}"</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* COHERENCE STRATEGY */}
                                        {coaching.coherence_advice && (
                                            <div className="bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-500/20 rounded-xl overflow-hidden mb-6">
                                                <div className="bg-indigo-100/50 dark:bg-indigo-500/10 p-4 border-b border-indigo-500/20 flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold uppercase text-xs tracking-wider">
                                                        <Layout className="w-4 h-4" /> Strategic Flow Advice
                                                    </div>
                                                    <span className="text-[10px] bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">Structure</span>
                                                </div>
                                                <div className="p-4 space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <div className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase">Core Strategy</div>
                                                            <p className="text-sm text-indigo-700 dark:text-indigo-200 font-medium">{coaching.coherence_advice.strategy}</p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase">Specific Direction</div>
                                                            <p className="text-sm text-slate-700 dark:text-slate-300">{coaching.coherence_advice.specific_direction}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-indigo-500/5 p-3 rounded border border-indigo-500/10">
                                                        <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1">Example Transition</div>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">"{coaching.coherence_advice.example}"</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 1. AGENT-GENERATED TOPICS */}
                                        {coaching.topic_analysis && coaching.topic_analysis.length > 0 && (
                                            <div className="space-y-3 mt-6">
                                                {coaching.topic_analysis.map((topic, i) => (
                                                    <div key={i} className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-[#1e293b]/50 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-300 dark:border-slate-700 transition-colors">
                                                        {/* Header: Score + Title + Category */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className={cn(
                                                                    "w-7 h-7 rounded-md flex items-center justify-center font-black text-[11px]",
                                                                    topic.category === 'Grammar' ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" :
                                                                        topic.category === 'Vocabulary' ? "bg-emerald-500/20 text-emerald-400" :
                                                                            "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                                                )}>
                                                                    {topic.count}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{topic.topic}</div>
                                                                    <div className="text-[10px] text-slate-600 dark:text-slate-500 uppercase tracking-wider">{topic.category}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Rich Details: Description + Why It Matters + Evidence */}
                                                        {(topic.description || topic.why_it_matters || topic.evidence_from_essay) && (
                                                            <div className="pl-10 space-y-1.5">
                                                                {topic.description && (
                                                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                                                        {topic.description}
                                                                    </p>
                                                                )}
                                                                {topic.why_it_matters && (
                                                                    <div className="flex items-start gap-2 text-xs text-indigo-700 dark:text-indigo-300/80 bg-indigo-50/50 dark:bg-indigo-500/5 p-2 rounded border border-indigo-100 dark:border-indigo-500/10">
                                                                        <div className="shrink-0 mt-0.5">💡</div>
                                                                        <span><strong>Why it matters:</strong> {topic.why_it_matters}</span>
                                                                    </div>
                                                                )}
                                                                {topic.evidence_from_essay && (
                                                                    <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300/80 bg-amber-50/50 dark:bg-amber-500/5 p-2.5 rounded border border-amber-100 dark:border-amber-500/15">
                                                                        <div className="shrink-0 mt-0.5">📝</div>
                                                                        <div>
                                                                            <strong className="text-amber-700 dark:text-amber-400">From your essay:</strong>
                                                                            <p className="mt-1 italic text-amber-800/70 dark:text-amber-200/70">"{topic.evidence_from_essay}"</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                )}

                                {/* 6. FALLBACK: General Focus Areas (Only if no agent coaching at all) */}
                                {(!coaching.root_cause_analysis && (!coaching.topic_analysis || coaching.topic_analysis.length === 0)) && (
                                    <div className="space-y-6">
                                        <div className="text-center py-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-xl border border-indigo-500/20">
                                            <BookOpen className="w-8 h-8 mx-auto text-indigo-600 dark:text-indigo-400 mb-2" />
                                            <p className="text-slate-800 dark:text-slate-200 text-sm font-medium">
                                                Personalized Study Plan
                                            </p>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                                                Focus on these areas to improve your band score:
                                            </p>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                Recommended Study Areas
                                            </h4>
                                            {evaluation.criterion_scores
                                                .sort((a, b) => a.band - b.band)
                                                .slice(0, 4)
                                                .map((score, i) => {
                                                    const focusInfo: Record<string, { topic: string; description: string; color: string }> = {
                                                        task_response: {
                                                            topic: "Task Response & Thesis Development",
                                                            description: "Strengthen your position with specific examples and deeper analysis",
                                                            color: "amber"
                                                        },
                                                        coherence_cohesion: {
                                                            topic: "Coherence & Paragraph Structure",
                                                            description: "Improve logical flow, transitions, and referencing",
                                                            color: "indigo"
                                                        },
                                                        lexical_resource: {
                                                            topic: "Vocabulary Range & Accuracy",
                                                            description: "Expand academic vocabulary and learn natural collocations",
                                                            color: "emerald"
                                                        },
                                                        grammatical_range_accuracy: {
                                                            topic: "Grammar Range & Accuracy",
                                                            description: "Practice complex structures and reduce common errors",
                                                            color: "rose"
                                                        },
                                                    };
                                                    const info = focusInfo[score.criterion];
                                                    if (!info) return null;

                                                    const colorClass = {
                                                        amber: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
                                                        indigo: "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
                                                        emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                                                        rose: "bg-rose-500/20 text-rose-400 border-rose-500/30",
                                                    }[info.color];

                                                    return (
                                                        <div key={i} className={cn(
                                                            "p-4 rounded-xl border flex items-start gap-4",
                                                            colorClass?.replace('text-', 'border-').replace('/20', '/30') || "border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/30"
                                                        )}>
                                                            <div className={cn(
                                                                "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0",
                                                                colorClass
                                                            )}>
                                                                {score.band}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-bold text-slate-800 dark:text-slate-200">{info.topic}</div>
                                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{info.description}</div>
                                                            </div>
                                                            <div className="text-xs font-medium text-slate-600 dark:text-slate-500 bg-slate-100/80 dark:bg-slate-800/50 px-2 py-1 rounded">
                                                                Band {score.band}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Bottom Spacer */}
                        <div className="h-24 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
