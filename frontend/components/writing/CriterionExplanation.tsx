import React, { useState } from 'react';
import { CriterionExplanation as CriterionExplanationType } from '@/types/writing-feedback';
import { cn } from '@/lib/utils';
import { ClipboardCheck, Sparkles, AlertCircle, TrendingUp, Info } from 'lucide-react';

interface CriterionExplanationProps {
    explanation: CriterionExplanationType;
    criterionName: string;
}

type Section = 'report' | 'strengths' | 'issues';

export function CriterionExplanation({ explanation, criterionName }: CriterionExplanationProps) {
    const [activeSection, setActiveSection] = useState<Section>('report');
    const { band, summary, what_you_did_well, main_issues, why_not_higher, improvement_step } = explanation;

    const sections = [
        { id: 'report', label: 'Report', icon: Info },
        { id: 'strengths', label: 'Strengths', icon: Sparkles },
        { id: 'issues', label: 'Issues', icon: AlertCircle },
    ];

    return (
        <div className="h-full flex flex-col overflow-hidden bg-[#0A0F1D]/50">
            {/* 1. Header with Criterion Info */}
            <div className="px-6 py-3 border-b border-white/5">

                {/* 2. Segmented Control (Tabs) */}
                <div className="flex p-1 bg-slate-900/80 rounded-xl border border-white/5">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id as Section)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                                    isActive
                                        ? "bg-teal-500 text-slate-900 shadow-lg shadow-teal-500/20"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {section.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3. Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                {activeSection === 'report' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        {/* Summary */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Info className="w-4 h-4 text-teal-500" />
                                Growth Context
                            </h3>
                            <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-6 text-[16px] leading-relaxed text-slate-200">
                                {summary}
                            </div>
                        </section>

                        {/* Why not higher */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                Development Blockers
                            </h3>
                            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 text-[16px] leading-relaxed text-slate-300">
                                {why_not_higher}
                            </div>
                        </section>

                        {/* How to improve (Roadmap) */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                Roadmap
                            </h3>
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 space-y-4">
                                <p className="text-slate-200 leading-relaxed font-bold text-lg">
                                    {improvement_step.description}
                                </p>
                                <div className="bg-black/20 border border-white/5 rounded-xl p-5">
                                    <p className="text-xs font-black text-teal-400 uppercase mb-2">Improved Example:</p>
                                    <p className="text-[15px] text-slate-300 italic leading-relaxed">
                                        "{improvement_step.improved_example}"
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeSection === 'strengths' && (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                        {what_you_did_well.map((item, index) => (
                            <div key={index} className="group bg-green-500/5 border border-green-500/10 rounded-2xl p-6 space-y-4 transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-green-500/20 p-2 rounded-lg">
                                        <Sparkles className="w-5 h-5 text-green-400" />
                                    </div>
                                    <h4 className="font-bold text-green-300 text-xl leading-tight">{item.label}</h4>
                                </div>
                                <blockquote className="border-l-4 border-green-500/30 pl-4 py-1">
                                    <p className="text-slate-400 italic text-sm leading-relaxed">"{item.quote}"</p>
                                </blockquote>
                                <div className="bg-black/20 p-4 rounded-xl">
                                    <p className="text-[15px] text-slate-200 leading-relaxed">{item.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeSection === 'issues' && (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                        {main_issues.map((issue, index) => (
                            <div key={index} className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 space-y-4 transition-all">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 bg-amber-500/20 p-2 rounded-lg">
                                            <AlertCircle className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <h4 className="font-bold text-amber-200 text-xl leading-tight">{issue.label}</h4>
                                    </div>
                                    <span className="text-[10px] uppercase font-black text-amber-500/60 bg-amber-500/10 px-3 py-1 rounded tracking-widest border border-amber-500/10 shrink-0">
                                        {issue.frequency}
                                    </span>
                                </div>
                                <p className="text-[16px] text-slate-200 leading-relaxed font-medium">{issue.why_it_matters}</p>

                                {issue.examples && issue.examples.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Evidence:</p>
                                        <div className="space-y-2">
                                            {issue.examples.map((example, exIndex) => (
                                                <div key={exIndex} className="text-[15px] text-slate-400 bg-black/10 border-l-4 border-red-500/30 pl-4 py-2 rounded-r-lg italic leading-relaxed">
                                                    "{example}"
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="bg-teal-500/5 border border-teal-500/10 rounded-xl p-4">
                                    <p className="text-xs font-black text-teal-400 uppercase tracking-widest mb-1">Targeted Fix:</p>
                                    <p className="text-[16px] text-slate-100 leading-relaxed">{issue.fix}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
