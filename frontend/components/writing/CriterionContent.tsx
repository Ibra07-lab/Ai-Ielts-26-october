import React, { useState } from 'react';
import { Trophy, MessageCircle, ArrowRight, Lightbulb, Target, Sparkles, ChevronDown, BookOpen, CheckCircle, AlertTriangle } from 'lucide-react';
import { QuoteHighlight } from './QuoteHighlight';
import { UpgradeExample } from './UpgradeExample';
import { SeverityBadge } from './FeedbackIcons';
import { ScoreImpactBadge } from './ScoreImpactBadge';
import { DetailedExplanationModal } from './DetailedExplanationModal';
import { ExplanationDisplay } from './ExplanationDisplay';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { CriterionExplanation } from '@/types/writing-feedback';

interface CriterionContentProps {
    score: number;
    title: string;
    data: any; // The criterion data object from teacher_feedback
    explanation?: CriterionExplanation | null; // Explanation from explanation agent
    hasError?: boolean;
    errorMessage?: string;
    color: 'blue' | 'indigo' | 'amber' | 'emerald';
}

export function CriterionContent({ score, title, data, explanation, hasError, errorMessage, color }: CriterionContentProps) {
    // Modal state
    const [selectedWeakness, setSelectedWeakness] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Collapsible state
    const [strengthsOpen, setStrengthsOpen] = useState(true);
    const [weaknessesOpen, setWeaknessesOpen] = useState(true);

    const openModal = (weakness: any) => {
        setSelectedWeakness(weakness);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedWeakness(null);
    };

    // Helper for color styles for headers/bgs if needed
    const colorStyles = {
        blue: "text-blue-600 bg-blue-50 border-blue-200",
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-200",
        amber: "text-amber-600 bg-amber-50 border-amber-200",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
    };

    if (!data) return <div className="p-8 text-center text-slate-400">No data available for this criterion.</div>;

    return (
        <>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Header Section */}
                <div className="flex items-center justify-between pb-6 border-b border-white/5 relative">
                    <div className="space-y-1 relative z-10">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-teal-500/80 mb-1">
                            Criterion Analysis
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight leading-none">{title}</h2>
                    </div>
                    <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl skeuo-glass border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] group hover:scale-105 transition-transform duration-500">
                        <span className="text-[10px] font-black text-teal-500/60 uppercase tracking-widest mb-0.5">Band</span>
                        <span className="text-3xl font-black text-teal-400 drop-shadow-[0_0_12px_rgba(45,212,191,0.4)] leading-none">{score}</span>
                    </div>
                </div>

                {/* Quick Feedback (Explanations) */}
                {explanation ? (
                    <ExplanationDisplay explanation={explanation} />
                ) : hasError ? (
                    <div className="mb-8 p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/20 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-[12px] font-bold text-amber-400 mb-1">Quick Feedback Unavailable</h4>
                            <p className="text-[11px] text-slate-400">{errorMessage || "Unable to load quick feedback."}</p>
                        </div>
                    </div>
                ) : null}

                {/* Examiner's Statement */}
                {data.score_explanation?.why_this_score && (
                    <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 group overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-transparent opacity-50" />
                        <p className="text-[15px] text-slate-300 leading-relaxed font-medium italic relative z-10">
                            "{data.score_explanation.why_this_score}"
                        </p>
                    </div>
                )}

                {/* Feedback Sections */}
                <div className="space-y-8">
                    {/* Strengths Section */}
                    {data.strengths && data.strengths.length > 0 && (
                        <Collapsible open={strengthsOpen} onOpenChange={setStrengthsOpen} className="space-y-4">
                            <CollapsibleTrigger className="w-full flex items-center justify-between group">
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600/80 dark:text-emerald-400/80 flex items-center gap-2">
                                    <Trophy size={14} className="stroke-[2.5]" />
                                    Strengths ({data.strengths.length})
                                </span>
                                <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1 mx-4" />
                                <ChevronDown className={cn(
                                    "w-4 h-4 text-slate-300 transition-transform duration-300",
                                    strengthsOpen && "rotate-180"
                                )} />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pt-1">
                                {data.strengths.map((strength: any, idx: number) => (
                                    <div key={idx} className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 shadow-sm group">
                                        <div className="flex gap-4 items-start">
                                            <div className="mt-1 p-2 rounded-lg bg-emerald-500/10 shrink-0">
                                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                {strength.label && (
                                                    <h4 className="text-[14px] font-bold text-white tracking-tight">
                                                        {strength.label}
                                                    </h4>
                                                )}
                                                <p className="text-[12px] text-slate-400 leading-relaxed italic">
                                                    <QuoteHighlight text={strength.explanation} />
                                                </p>
                                                <div className="bg-emerald-500/5 px-4 py-3 rounded-xl border border-emerald-500/10 relative overflow-hidden">
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/30" />
                                                    <p className="text-[12px] font-semibold text-emerald-100/90 italic">
                                                        "{strength.quote || strength.text || ""}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                    )}

                    {/* Weaknesses Section */}
                    {data.weakness_patterns && data.weakness_patterns.length > 0 && (
                        <Collapsible open={weaknessesOpen} onOpenChange={setWeaknessesOpen} className="space-y-4">
                            <CollapsibleTrigger className="w-full flex items-center justify-between group">
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-600/80 dark:text-amber-400/80 flex items-center gap-2">
                                    <Lightbulb size={14} className="stroke-[2.5]" />
                                    Priorities ({data.weakness_patterns.length})
                                </span>
                                <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1 mx-4" />
                                <ChevronDown className={cn(
                                    "w-4 h-4 text-slate-300 transition-transform duration-300",
                                    weaknessesOpen && "rotate-180"
                                )} />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pt-1">
                                {/* Sort by score_impact: high -> medium -> low */}
                                {[...data.weakness_patterns]
                                    .sort((a, b) => {
                                        const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
                                        return (order[a.score_impact as string] || 1) - (order[b.score_impact as string] || 1);
                                    })
                                    .map((weakness: any, idx: number) => {
                                        // Determine the "Original" text
                                        const originalText = weakness.identified_issue || weakness.example || (weakness.examples && weakness.examples[0]);
                                        const correction = weakness.fix;

                                        return (
                                            <div key={idx} className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 group relative overflow-hidden">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500/30 group-hover:bg-amber-500/50 transition-colors" />

                                                <div className="relative">
                                                    {/* Top Row: Pattern Name and Score Impact */}
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="p-1.5 rounded-lg bg-amber-500/10">
                                                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                                            </div>
                                                            <h4 className="text-[14px] font-bold text-white tracking-tight">
                                                                {weakness.pattern_name || "Identified Issue"}
                                                            </h4>
                                                        </div>
                                                        <ScoreImpactBadge impact={weakness.score_impact || "medium"} />
                                                    </div>

                                                    {/* Diff View (Original -> Correction) */}
                                                    {originalText && correction ? (
                                                        <div className="flex flex-col gap-3 mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[12px] font-medium flex-1 italic">
                                                                    {originalText}
                                                                </div>
                                                                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                                                                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[12px] font-bold flex-1 italic">
                                                                    {correction}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        /* Fallback if no correction pair */
                                                        <div className="mb-4 bg-amber-500/[0.03] p-3.5 rounded-xl border border-amber-500/10 text-[12px] text-amber-200/80 italic leading-relaxed">
                                                            "{originalText || weakness.problem || weakness.description}"
                                                        </div>
                                                    )}


                                                    {/* Concrete Example */}
                                                    {weakness.concrete_example && (
                                                        <div className="mb-4 p-4 rounded-xl bg-teal-500/[0.03] border border-teal-500/10">
                                                            <p className="text-[12px] text-teal-300 leading-relaxed italic">
                                                                <span className="text-teal-500 font-bold mr-2">💡 EXPLANATION:</span>
                                                                {weakness.concrete_example}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Band Upgrade Example */}
                                                    {weakness.band_upgrade && (
                                                        <div className="mb-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 shadow-inner">
                                                            <div className="text-[10px] uppercase font-black text-slate-500 mb-3 tracking-widest flex items-center justify-between">
                                                                <span>Level Up Example</span>
                                                                <span className="text-emerald-500">Band {weakness.band_upgrade.current_band} → {weakness.band_upgrade.target_band}</span>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div className="grid grid-cols-[80px_1fr] gap-3">
                                                                    <div className="text-[10px] uppercase text-slate-600 font-bold self-center">Original:</div>
                                                                    <div className="text-[12px] text-rose-400/90 font-mono bg-rose-500/5 p-2 rounded-lg leading-snug break-words">"{weakness.band_upgrade.original}"</div>
                                                                </div>
                                                                <div className="grid grid-cols-[80px_1fr] gap-3">
                                                                    <div className="text-[10px] uppercase text-emerald-600 font-black self-center tracking-tighter">Premium:</div>
                                                                    <div className="text-[12px] text-emerald-400 font-mono bg-emerald-500/10 p-2 rounded-lg leading-snug border border-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.05)] break-words">"{weakness.band_upgrade.improved}"</div>
                                                                </div>
                                                                <div className="text-[11px] text-slate-400 italic pt-3 border-t border-white/5 flex items-start gap-2">
                                                                    <Sparkles size={12} className="text-teal-500 shrink-0 mt-0.5" />
                                                                    <span>{weakness.band_upgrade.what_changed}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Action / Analysis Link */}
                                                    <div className="flex justify-end pt-2">
                                                        <button
                                                            onClick={() => openModal(weakness)}
                                                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 text-[11px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all group/btn shadow-sm"
                                                        >
                                                            Detailed Analysis
                                                            <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </CollapsibleContent>
                        </Collapsible>
                    )}

                    {/* Level Up Section */}
                    {(data.vocabulary_upgrades || data.sentence_structure_upgrades || data.grammar_focus_areas) && (
                        <div className="pt-4">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-600/80 dark:text-purple-400/80 flex items-center gap-2 mb-6">
                                <Target size={14} className="stroke-[2.5]" />
                                Performance Upgrades
                                <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1 ml-4" />
                            </h3>
                            <div className="grid gap-4">
                                {data.sentence_structure_upgrades && data.sentence_structure_upgrades.map((upgrade: any, idx: number) => (
                                    <UpgradeExample
                                        key={`sentence-${idx}`}
                                        original={upgrade.original}
                                        improved={upgrade.improved}
                                        explanation={upgrade.explanation}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {selectedWeakness && (
                <DetailedExplanationModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    weakness={selectedWeakness}
                />
            )}
        </>
    );
}
