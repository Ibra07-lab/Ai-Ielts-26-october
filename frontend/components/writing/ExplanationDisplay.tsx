import React from 'react';
import { CheckCircle, AlertTriangle, TrendingUp, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CriterionExplanation } from '@/types/writing-feedback';

interface ExplanationDisplayProps {
    explanation: CriterionExplanation;
}

export function ExplanationDisplay({ explanation }: ExplanationDisplayProps) {
    return (
        <div className="space-y-6 mb-8 pb-8 border-b border-white/5">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-teal-400" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-400/80">
                    Quick Feedback
                </h3>
                <div className="h-px bg-slate-800 flex-1 ml-4" />
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-teal-500/[0.05] border border-teal-500/20">
                <p className="text-[13px] text-slate-200 leading-relaxed">
                    {explanation.summary}
                </p>
            </div>

            {/* What You Did Well */}
            {explanation.what_you_did_well && explanation.what_you_did_well.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            What You Did Well
                        </h4>
                    </div>
                    <div className="space-y-2">
                        {explanation.what_you_did_well.map((item, idx) => (
                            <div key={idx} className="bg-emerald-500/[0.05] p-3 rounded-lg border border-emerald-500/10">
                                <div className="text-[11px] font-semibold text-emerald-300 mb-1">
                                    {item.label}
                                </div>
                                {item.quote && (
                                    <div className="text-[11px] text-emerald-200/70 italic mb-2 pl-3 border-l-2 border-emerald-500/30">
                                        "{item.quote}"
                                    </div>
                                )}
                                <div className="text-[11px] text-slate-400">
                                    {item.comment}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Issues */}
            {explanation.main_issues && explanation.main_issues.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                            Main Issues to Fix
                        </h4>
                    </div>
                    <div className="space-y-3">
                        {explanation.main_issues.map((issue, idx) => (
                            <div key={idx} className="bg-amber-500/[0.05] p-4 rounded-lg border border-amber-500/10">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="text-[11px] font-semibold text-amber-300">
                                        {issue.label}
                                    </div>
                                    <div className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                                        {issue.frequency}
                                    </div>
                                </div>
                                <div className="text-[11px] text-slate-400 mb-3">
                                    {issue.why_it_matters}
                                </div>
                                {issue.examples && issue.examples.length > 0 && (
                                    <div className="space-y-1 mb-3">
                                        {issue.examples.map((example, exIdx) => (
                                            <div key={exIdx} className="text-[10px] text-amber-200/60 italic pl-3 border-l-2 border-amber-500/30">
                                                "{example}"
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-start gap-2 pt-2 border-t border-amber-500/10">
                                    <span className="text-[9px] font-bold uppercase text-emerald-400 tracking-wider shrink-0">Fix:</span>
                                    <span className="text-[11px] text-emerald-300">{issue.fix}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Why Not Higher */}
            {explanation.why_not_higher && (
                <div className="p-4 rounded-xl bg-purple-500/[0.05] border border-purple-500/10">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                            Why Not Band {explanation.band + 0.5}?
                        </h4>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                        {explanation.why_not_higher}
                    </p>
                </div>
            )}

            {/* Next Step */}
            {explanation.improvement_step && (
                <div className="p-4 rounded-xl bg-teal-500/[0.05] border border-teal-500/20">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center">
                            <span className="text-[10px] font-black text-teal-400">1</span>
                        </div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                            Your Next Step
                        </h4>
                    </div>
                    <p className="text-[12px] text-slate-200 mb-3 font-medium">
                        {explanation.improvement_step.description}
                    </p>
                    {explanation.improvement_step.improved_example && (
                        <div className="bg-teal-500/10 p-3 rounded-lg border border-teal-500/20">
                            <div className="text-[9px] uppercase font-bold text-teal-500 mb-2 tracking-wider">
                                Example:
                            </div>
                            <div className="text-[11px] text-teal-200 italic leading-relaxed">
                                "{explanation.improvement_step.improved_example}"
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
