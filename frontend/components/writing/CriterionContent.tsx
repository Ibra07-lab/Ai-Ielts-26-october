import React, { useState } from 'react';
import { Trophy, MessageCircle, ArrowRight, Lightbulb, Target, Sparkles, ChevronDown, BookOpen, CheckCircle } from 'lucide-react';
import { QuoteHighlight } from './QuoteHighlight';
import { UpgradeExample } from './UpgradeExample';
import { SeverityBadge } from './FeedbackIcons';
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
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                            Criterion Analysis
                        </div>
                    </div>
                    <div className={cn(
                        "flex flex-col items-center justify-center min-w-[64px] h-[64px] rounded-2xl border-2 shadow-sm",
                        color === 'blue' ? "bg-blue-50 border-blue-100 text-blue-600" :
                            color === 'indigo' ? "bg-indigo-50 border-indigo-100 text-indigo-600" :
                                color === 'amber' ? "bg-amber-50 border-amber-100 text-amber-600" :
                                    "bg-emerald-50 border-emerald-100 text-emerald-600"
                    )}>
                        <span className="text-[10px] font-black uppercase leading-none opacity-60">Band</span>
                        <span className="text-2xl font-black leading-none mt-0.5">{score}</span>
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
                                    <div key={idx} className="bg-white dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-all duration-300">
                                        <div className="flex gap-4 items-start">
                                            <div className="mt-1 p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg shrink-0 border border-emerald-100/50 dark:border-emerald-800/30">
                                                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                {strength.label && (
                                                    <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">
                                                        {strength.label}
                                                    </h4>
                                                )}
                                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                                    <QuoteHighlight text={strength.explanation} />
                                                </p>
                                                <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-lg border-l-2 border-emerald-500/50">
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
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
                                {data.weakness_patterns.map((weakness: any, idx: number) => (
                                    <div key={idx} className="bg-white dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                                        {/* Status Accent */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[40px] rounded-full -mr-16 -mt-16 pointer-events-none" />

                                        <div className="relative">
                                            {/* Top Row: Name and Frequency */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                    <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                                                        {weakness.pattern_name}
                                                    </h4>
                                                </div>
                                                <SeverityBadge frequency={weakness.frequency} />
                                            </div>

                                            {/* Description Card */}
                                            <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-snug mb-4">
                                                <QuoteHighlight text={weakness.problem || weakness.description || ""} />
                                            </p>

                                            {/* The Error Quotes */}
                                            {weakness.examples && Array.isArray(weakness.examples) && weakness.examples.length > 0 ? (
                                                <div className="space-y-2 mb-4">
                                                    {weakness.examples.map((ex: string, eIdx: number) => (
                                                        <div key={eIdx} className="bg-amber-50/50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100/50 dark:border-amber-900/20 font-mono text-[11px] text-amber-900 dark:text-amber-200">
                                                            "{ex}"
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (weakness.example || weakness.identified_issue) && (
                                                <div className="mb-4 bg-amber-50/50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100/50 dark:border-amber-900/20 font-mono text-[11px] text-amber-900 dark:text-amber-200">
                                                    "{weakness.example || weakness.identified_issue}"
                                                </div>
                                            )}

                                            {/* Actionable Fix */}
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/50 gap-4">
                                                {weakness.fix && (
                                                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                                                            <CheckCircle size={12} className="text-emerald-600 dark:text-emerald-400" />
                                                        </div>
                                                        <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate">
                                                            {weakness.fix}
                                                        </span>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => openModal(weakness)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 transition-all"
                                                >
                                                    Analysis
                                                    <ArrowRight size={10} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
