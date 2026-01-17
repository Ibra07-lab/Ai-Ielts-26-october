import React, { useEffect, useState } from 'react';
import { X, Trophy, MessageCircle, ArrowRight, Lightbulb, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { QuoteHighlight } from './QuoteHighlight';
import { UpgradeExample } from './UpgradeExample';

interface CriterionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    criterionName: string;
    score: number;
    data: any; // The criterion data object from teacher_feedback
    color: 'blue' | 'indigo' | 'amber' | 'emerald';
}

export function CriterionDrawer({ isOpen, onClose, criterionName, score, data, color }: CriterionDrawerProps) {
    const [isVisible, setIsVisible] = useState(false);

    // Handle animation delay for smooth entrance
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Wait for exit animation
            document.body.style.overflow = '';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !isVisible) return null;

    // Helper for color styles
    const colorStyles = {
        blue: "bg-blue-500 text-blue-500 border-blue-200 bg-blue-50",
        indigo: "bg-indigo-500 text-indigo-500 border-indigo-200 bg-indigo-50",
        amber: "bg-amber-500 text-amber-500 border-amber-200 bg-amber-50",
        emerald: "bg-emerald-500 text-emerald-500 border-emerald-200 bg-emerald-50",
    };

    const headerBg = {
        blue: "from-blue-500 to-blue-600",
        indigo: "from-indigo-500 to-indigo-600",
        amber: "from-amber-500 to-amber-600",
        emerald: "from-emerald-500 to-emerald-600",
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                className={cn(
                    "relative w-full max-w-lg h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className={cn("relative p-6 text-white shrink-0 overflow-hidden bg-gradient-to-br", headerBg[color])}>
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Target size={120} />
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white"
                    >
                        <X size={20} />
                    </button>

                    <div className="relative z-10 mt-4">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-0.5 bg-black/20 rounded text-xs font-semibold uppercase tracking-wider text-white/90">
                                Detailed Breakdown
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold mb-1">{criterionName}</h2>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-baseline gap-1 bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md">
                                <span className="text-2xl font-bold">{score.toFixed(1)}</span>
                                <span className="text-sm opacity-80">/ 9.0</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* 1. The "Why" Section */}
                    {data.score_explanation?.why_this_score && (
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                                <MessageCircle size={16} />
                                Examiner's Verdict
                            </h3>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                    "{data.score_explanation.why_this_score}"
                                </p>
                                {data.score_explanation.band_descriptor_evidence && (
                                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                                        <span className="font-semibold text-slate-600 dark:text-slate-400">Official Standard: </span>
                                        {data.score_explanation.band_descriptor_evidence}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* 2. What You Did Well (Strengths) */}
                    {data.strengths && data.strengths.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-2">
                                <Trophy size={16} />
                                What You Did Well
                            </h3>
                            <div className="space-y-3">
                                {data.strengths.map((strength: any, idx: number) => (
                                    <div key={idx} className="flex gap-3 items-start">
                                        <div className="mt-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                                        <div>
                                            {/* QuoteHighlight applies yellow highlight to quoted text */}
                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                <QuoteHighlight text={strength.quote || strength.text || ""} />
                                            </p>
                                            {strength.explanation && (
                                                <p className="text-xs text-slate-500 mt-1">{strength.explanation}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 3. What's Holding You Back (Weaknesses) */}
                    {data.weakness_patterns && data.weakness_patterns.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-2">
                                <Lightbulb size={16} />
                                Things to Improve
                            </h3>
                            <div className="space-y-4">
                                {data.weakness_patterns.map((weakness: any, idx: number) => (
                                    <div key={idx} className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/20">
                                        <div className="font-medium text-amber-900 dark:text-amber-100 mb-2 text-sm">
                                            {weakness.pattern_name}
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                                            <QuoteHighlight text={weakness.description || ""} />
                                        </p>
                                        {weakness.fix && (
                                            <div className="text-xs bg-white dark:bg-white/5 p-2 rounded border border-amber-100 dark:border-white/10 text-slate-600 dark:text-slate-400">
                                                <span className="font-semibold">Correction: </span>
                                                <QuoteHighlight text={weakness.fix} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}


                    {/* 4. Actionable Improvements (Upgrade Examples) */}
                    {(data.vocabulary_upgrades || data.sentence_structure_upgrades || data.grammar_focus_areas) && (
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 mb-3 flex items-center gap-2">
                                <Target size={16} />
                                Level-Up Examples
                            </h3>

                            {/* Sentence Upgrades */}
                            {data.sentence_structure_upgrades && data.sentence_structure_upgrades.map((upgrade: any, idx: number) => (
                                <UpgradeExample
                                    key={`sentence-${idx}`}
                                    original={upgrade.original}
                                    improved={upgrade.improved}
                                    explanation={upgrade.explanation}
                                />
                            ))}

                            {/* Vocab Upgrades (if inline array format which new prompt uses) */}
                            {data.vocabulary_grammar_upgrade?.sentence_structure_upgrades && data.vocabulary_grammar_upgrade.sentence_structure_upgrades.map((upgrade: any, idx: number) => (
                                <UpgradeExample
                                    key={`vocab-sentence-${idx}`}
                                    original={upgrade.original}
                                    improved={upgrade.improved}
                                    explanation={upgrade.explanation}
                                />
                            ))}
                        </section>
                    )}


                    {/* 5. Path to Next Band */}
                    {data.score_explanation?.path_to_improvement && (
                        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
                            <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                                Next Steps for Band {Math.min(9, Math.floor(score + 1))}
                                <ArrowRight size={16} />
                            </h3>
                            <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                                {data.score_explanation.path_to_improvement}
                            </p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
