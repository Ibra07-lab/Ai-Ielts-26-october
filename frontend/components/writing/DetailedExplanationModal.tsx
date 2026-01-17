import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, Lightbulb, Target, AlertCircle } from 'lucide-react';
import { QuoteHighlight } from './QuoteHighlight';

interface DetailedExplanationModalProps {
    isOpen: boolean;
    onClose: () => void;
    weakness: {
        pattern_name: string;
        identified_issue?: string;
        description: string;
        fix: string;
        frequency?: number;
        // Optional detailed explanation fields
        detailed_explanation?: {
            why_it_matters?: string;
            the_rule?: string;
            examples?: Array<{ wrong: string; right: string; note?: string }>;
            practice_task?: string;
        };
    };
}

export const DetailedExplanationModal: React.FC<DetailedExplanationModalProps> = ({
    isOpen,
    onClose,
    weakness,
}) => {
    // Generate default detailed content if not provided by backend
    const getDefaultExplanation = () => {
        return {
            why_it_matters: `This pattern affects your ${getCategory(weakness.pattern_name)} score. Fixing it will help you move toward the next band level.`,
            the_rule: weakness.description,
            examples: weakness.identified_issue ? [{
                wrong: weakness.identified_issue,
                right: weakness.fix,
                note: undefined
            }] : [],
            practice_task: `Review your essay and find similar instances of this pattern. Apply the same fix to each one.`,
        };
    };

    const explanation = weakness.detailed_explanation || getDefaultExplanation();

    // Helper to determine category from pattern name
    function getCategory(patternName: string): string {
        const lower = patternName.toLowerCase();
        if (lower.includes('article') || lower.includes('tense') || lower.includes('subject') || lower.includes('verb')) {
            return 'Grammar';
        }
        if (lower.includes('vocabulary') || lower.includes('word') || lower.includes('repetition')) {
            return 'Vocabulary';
        }
        if (lower.includes('comparison') || lower.includes('overview') || lower.includes('data')) {
            return 'Task Achievement';
        }
        if (lower.includes('linking') || lower.includes('cohesion') || lower.includes('paragraph')) {
            return 'Coherence';
        }
        return 'Writing';
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-950 border-slate-800 text-slate-100">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-blue-400" />
                        {weakness.pattern_name}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Deep dive into this issue and how to fix it
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Why It Matters */}
                    {explanation.why_it_matters && (
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Why This Matters
                            </h3>
                            <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                {explanation.why_it_matters}
                            </p>
                        </section>
                    )}

                    {/* The Rule */}
                    {explanation.the_rule && (
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" />
                                The Rule
                            </h3>
                            <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                <QuoteHighlight text={explanation.the_rule} />
                            </p>
                        </section>
                    )}

                    {/* Examples */}
                    {explanation.examples && explanation.examples.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Examples
                            </h3>
                            <div className="space-y-3">
                                {explanation.examples.map((example, idx) => (
                                    <div key={idx} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                        {/* Wrong */}
                                        <div className="mb-3">
                                            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1 block">
                                                ❌ Incorrect
                                            </span>
                                            <p className="text-slate-300 font-mono text-sm bg-rose-950/20 p-2 rounded border-l-2 border-rose-500">
                                                "{example.wrong}"
                                            </p>
                                        </div>
                                        {/* Right */}
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 block">
                                                ✓ Correct
                                            </span>
                                            <p className="text-slate-300 font-mono text-sm bg-emerald-950/20 p-2 rounded border-l-2 border-emerald-500">
                                                "{example.right}"
                                            </p>
                                        </div>
                                        {/* Note */}
                                        {example.note && (
                                            <p className="mt-2 text-xs text-slate-400 italic">
                                                💡 {example.note}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Practice Task */}
                    {explanation.practice_task && (
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Practice Task (5 min)
                            </h3>
                            <div className="bg-emerald-950/20 p-4 rounded-lg border border-emerald-800/30">
                                <p className="text-slate-300 leading-relaxed">
                                    {explanation.practice_task}
                                </p>
                            </div>
                        </section>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
