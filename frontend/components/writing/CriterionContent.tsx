import React, { useState } from 'react';
import { Trophy, MessageCircle, ArrowRight, Lightbulb, Target, Sparkles, ChevronDown, BookOpen, CheckCircle, AlertTriangle } from 'lucide-react';
import { QuoteHighlight } from './QuoteHighlight';
import { UpgradeExample } from './UpgradeExample';
import { SeverityBadge } from './FeedbackIcons';
import { ScoreImpactBadge } from './ScoreImpactBadge';
import { DetailedExplanationModal } from './DetailedExplanationModal';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface CriterionContentProps {
    score: number;
    title: string;
    data: any; // The criterion data object from teacher_feedback
    color: 'blue' | 'indigo' | 'amber' | 'emerald';
}

export function CriterionContent({ score, title, data, color }: CriterionContentProps) {
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
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60">
                    <div className="space-y-0.5">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
                        <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-slate-500">
                            Criterion Analysis
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-teal-500/10 border-2 border-teal-500">
                        <span className="text-[10px] font-bold text-teal-400 uppercase">Band</span>
                        <span className="text-2xl font-black text-teal-400">{score}</span>
                    </div>
                </div>

                {/* Examiner's Statement */}
                {data.score_explanation?.why_this_score && (
                    <div className="relative group">
                        <div className="absolute -left-1 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-700/50 rounded-full group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-colors" />
                        <p className="pl-5 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">
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
                                    <div key={idx} className="bg-transparent p-4 border-b border-slate-100 dark:border-slate-800/80 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors duration-200">
                                        <div className="flex gap-4 items-start">
                                            <div className="mt-1 p-1 shrink-0">
                                                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                {strength.label && (
                                                    <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">
                                                        {strength.label}
                                                    </h4>
                                                )}
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                                    <QuoteHighlight text={strength.explanation} />
                                                </p>
                                                <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-lg border-l-2 border-emerald-500/50">
                                                    <p className="text-[11px] font-medium text-slate-800 dark:text-slate-200 italic">
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
                                            <div key={idx} className="bg-transparent p-5 border-b border-slate-100 dark:border-slate-800/80 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors duration-200 group">

                                                <div className="relative">
                                                    {/* Top Row: Pattern Name and Score Impact */}
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500/80" />
                                                            <h4 className="text-[13px] font-bold text-slate-900 dark:text-white tracking-tight">
                                                                {weakness.pattern_name || "Identified Issue"}
                                                            </h4>
                                                        </div>
                                                        <ScoreImpactBadge impact={weakness.score_impact || "medium"} />
                                                    </div>

                                                    {/* Diff View (Original -> Correction) */}
                                                    {originalText && correction ? (
                                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                                            <div className="px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium">
                                                                {originalText}
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-slate-600" />
                                                            <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                                                                {correction}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        /* Fallback if no correction pair */
                                                        <div className="mb-3 bg-amber-50/5 dark:bg-amber-900/10 p-2.5 rounded-lg border border-amber-500/10 text-[11px] text-amber-200/90 italic leading-relaxed">
                                                            "{originalText || weakness.problem || weakness.description}"
                                                        </div>
                                                    )}


                                                    {/* Concrete Example (NEW) */}
                                                    {weakness.concrete_example && (
                                                        <div className="mb-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                                                            <p className="text-[11px] text-blue-400 leading-relaxed italic">
                                                                💡 {weakness.concrete_example}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Band Upgrade Example (NEW) */}
                                                    {weakness.band_upgrade && (
                                                        <div className="mb-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                                                            <div className="text-[9px] uppercase tracking-widest font-bold text-slate-500 mb-2">
                                                                📈 Band {weakness.band_upgrade.current_band} → Band {weakness.band_upgrade.target_band}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div>
                                                                    <div className="text-[9px] uppercase text-slate-600 mb-1">Your version:</div>
                                                                    <div className="text-[11px] text-rose-400 font-mono">"{weakness.band_upgrade.original}"</div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[9px] uppercase text-slate-600 mb-1">Band 7 version:</div>
                                                                    <div className="text-[11px] text-emerald-400 font-mono">"{weakness.band_upgrade.improved}"</div>
                                                                </div>
                                                                <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-700">
                                                                    ✨ {weakness.band_upgrade.what_changed}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Action / Analysis Link */}
                                                    <div className="flex justify-start">
                                                        <button
                                                            onClick={() => openModal(weakness)}
                                                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors group/btn opacity-80 hover:opacity-100"
                                                        >
                                                            Analysis
                                                            <ArrowRight size={10} className="group-hover/btn:translate-x-0.5 transition-transform" />
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
