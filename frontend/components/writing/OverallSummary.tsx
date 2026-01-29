import React from 'react';
import { EvaluationResult } from '@/types/writing-feedback';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis } from 'recharts';
import { TrendingUp, Target, Zap, Search, PenTool, Clock, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OverallSummaryProps {
    result: EvaluationResult;
}

import { useEffect, useState } from 'react';

export const OverallSummary: React.FC<OverallSummaryProps> = ({ result }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        console.log('OverallSummary mounted. Result:', result);
        console.log('Teacher Feedback:', result.teacher_feedback);
    }, [result]);
    const getScore = (criteria: string) => {
        return result.criterion_scores.find(s => s.criterion === criteria)?.band || 0;
    };

    const taskAchievement = getScore('task_achievement') || getScore('task_response');
    const coherence = getScore('coherence_cohesion');
    const lexical = getScore('lexical_resource');
    const grammar = getScore('grammatical_range_accuracy') || getScore('grammatical_range');

    const chartData = [
        { subject: 'Task Ach.', A: taskAchievement, fullMark: 9 },
        { subject: 'Coh.', A: coherence, fullMark: 9 },
        { subject: 'Vocabulary', A: lexical, fullMark: 9 },
        { subject: 'Grammar', A: grammar, fullMark: 9 },
    ];

    // Access Teacher Feedback Content safely
    const teacherFeedback = result.teacher_feedback || {};
    const summary = teacherFeedback.overall_summary || {};
    const actionPlan = teacherFeedback.action_plan || {};
    const practiceSchedule = actionPlan.practice_schedule || [];

    // Check if we are in a fallback/error state
    const hasError = result.teacher_feedback_status === 'error' || result.teacher_feedback_status === 'timeout';
    const errorMessage = result.teacher_feedback_message || "Detailed feedback could not be generated.";

    // Helper to extract Title vs Description from "Title: Description" string
    const parseDNA = (text?: string) => {
        if (!text) return { title: "Not available", desc: "" };
        const parts = text.split(':');
        if (parts.length > 1) {
            return { title: parts[0].trim(), desc: parts.slice(1).join(':').trim() };
        }
        // If no colon, treat the first sentence or first 5 words as title if long
        return { title: text, desc: "" };
    };

    const superpower = parseDNA(summary.superpower);
    const priority = parseDNA(summary.priority);

    // Criteria List for Actionable Insights Table
    const criteriaInsights = [
        {
            id: 'task_achievement',
            label: 'Task Achievement',
            score: taskAchievement,
            // @ts-ignore
            quickWin: teacherFeedback.task_achievement?.top_tip || "Review task requirements",
            color: 'blue'
        },
        {
            id: 'coherence_cohesion',
            label: 'Coherence',
            score: coherence,
            // @ts-ignore
            quickWin: teacherFeedback.coherence_cohesion?.top_tip || "Use varied linking words",
            color: 'indigo'
        },
        {
            id: 'lexical_resource',
            label: 'Vocabulary',
            score: lexical,
            // @ts-ignore
            quickWin: teacherFeedback.lexical_resource?.top_tip || "Use precise vocabulary",
            color: 'amber'
        },
        {
            id: 'grammatical_range_accuracy',
            label: 'Grammar',
            score: grammar,
            // @ts-ignore
            quickWin: teacherFeedback.grammatical_range?.top_tip || teacherFeedback.grammatical_range_accuracy?.top_tip || "Check sentence structures",
            color: 'emerald'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 h-full flex flex-col pb-12">

            {/* Header */}
            <div className="flex items-center justify-between mb-2 px-1">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-teal-500/80">
                        Performance Overview
                    </div>
                </div>
            </div>

            {/* 1. Overall Score & Radar Chart */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 relative overflow-hidden shadow-2xl">
                {/* Decorative background elements */}
                <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="flex flex-col lg:flex-row items-stretch gap-10 relative z-10">
                    {/* Score Left - Premium Circular Look */}
                    <div className="flex flex-col items-center justify-center lg:items-start lg:justify-start min-w-[200px]">
                        <div className="relative group">
                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-2xl group-hover:bg-teal-500/30 transition-all duration-500" />

                            <div className="relative w-32 h-32 rounded-full border-4 border-white/5 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-md shadow-inner">
                                <span className="text-sm font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Band</span>
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-5xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                        {result.overall_band || "?"}
                                    </span>
                                </div>
                                <div className="absolute -bottom-2 px-3 py-1 rounded-full bg-teal-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg shadow-teal-500/40">
                                    Mastery
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-2 text-center lg:text-left">
                            <h3 className="text-white text-lg font-bold">Overall Performance</h3>
                            <p className="text-slate-400 text-xs leading-relaxed max-w-[180px]">
                                Your current level is based on all four IELTS criteria assessment.
                            </p>
                            <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-[0.1em]">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Analysis Complete
                            </div>
                        </div>
                    </div>

                    {/* Chart Right - Advanced Radar & Visual Grid */}
                    <div className="flex-1 flex flex-col xl:flex-row items-center justify-between gap-8 bg-white/[0.03] rounded-[1.5rem] border border-white/5 p-8">
                        {/* Radar Chart Section */}
                        <div className="w-full h-[240px] max-w-[320px] relative">
                            {mounted ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                        <defs>
                                            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.2} />
                                            </linearGradient>
                                        </defs>
                                        <PolarGrid stroke="#1e293b" strokeDasharray="3 3" />
                                        <PolarAngleAxis
                                            dataKey="subject"
                                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: '800', letterSpacing: '0.05em' }}
                                        />
                                        <PolarRadiusAxis
                                            angle={90}
                                            domain={[0, 9]}
                                            tick={false}
                                            axisLine={false}
                                        />
                                        {/* Outer Glow Layer */}
                                        <Radar
                                            dataKey="A"
                                            stroke="#2dd4bf"
                                            strokeWidth={1}
                                            fill="transparent"
                                            fillOpacity={0}
                                        />
                                        {/* Main Filled Layer */}
                                        <Radar
                                            name="Score"
                                            dataKey="A"
                                            stroke="#2dd4bf"
                                            strokeWidth={3}
                                            fill="url(#radarGradient)"
                                            fillOpacity={0.6}
                                            dot={{ r: 5, fill: '#2dd4bf', strokeWidth: 3, stroke: '#0f172a' }}
                                            label={{
                                                fill: '#fff',
                                                fontSize: 12,
                                                fontWeight: '900',
                                                position: 'top',
                                                offset: 10,
                                                className: "drop-shadow-md"
                                            }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-700">Loading Analysis...</div>
                            )}
                        </div>

                        {/* Visual High-Contrast Grid */}
                        <div className="grid grid-cols-2 gap-4 w-full max-w-[320px]">
                            {criteriaInsights.map((insight) => (
                                <div
                                    key={insight.id}
                                    className={cn(
                                        "relative group p-4 rounded-2xl border transition-all duration-300",
                                        insight.color === 'blue' ? "bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10" :
                                            insight.color === 'indigo' ? "bg-indigo-500/5 border-indigo-500/20 hover:bg-indigo-500/10" :
                                                insight.color === 'amber' ? "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10" :
                                                    "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10"
                                    )}
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-wider opacity-60",
                                            insight.color === 'blue' ? "text-blue-400" :
                                                insight.color === 'indigo' ? "text-indigo-400" :
                                                    insight.color === 'amber' ? "text-amber-400" :
                                                        "text-emerald-400"
                                        )}>
                                            {insight.label.split(' ')[0]}
                                        </span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-white tabular-nums leading-none">
                                                {insight.score}
                                            </span>
                                            <span className="text-[10px] text-slate-600 font-bold">/ 9</span>
                                        </div>
                                    </div>
                                    {/* Subtle category bar at bottom */}
                                    <div className={cn(
                                        "absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-40 capitalize",
                                        insight.color === 'blue' ? "bg-blue-500" :
                                            insight.color === 'indigo' ? "bg-indigo-500" :
                                                insight.color === 'amber' ? "bg-amber-500" :
                                                    "bg-emerald-500"
                                    )} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 1.5 Teacher's Holistic Comment - Official Evaluation Look */}
            <div className={cn(
                "relative group overflow-hidden rounded-3xl border transition-all duration-500",
                hasError
                    ? "bg-red-500/[0.02] border-red-500/20 shadow-lg shadow-red-500/5"
                    : "bg-teal-500/[0.02] border-white/5 shadow-2xl"
            )}>
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <PenTool className="w-24 h-24" />
                </div>

                <div className="p-8 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-xl",
                                hasError ? "bg-red-500/10" : "bg-teal-500/10"
                            )}>
                                <PenTool className={cn(
                                    "w-5 h-5",
                                    hasError ? "text-red-400" : "text-teal-400"
                                )} />
                            </div>
                            <div>
                                <h3 className="text-white text-base font-bold tracking-tight">Teacher's Evaluation</h3>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Holistic Feedback Report</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Official AI Review
                        </div>
                    </div>

                    {(() => {
                        const finalComment = teacherFeedback.teachers_final_comment;
                        const personalNote = summary.personal_note;
                        const displayText = finalComment || personalNote || "Feedback processing...";

                        if (hasError) {
                            return (
                                <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                                    <p className="text-sm text-red-200 font-medium mb-1">Feedback Generation Paused</p>
                                    <p className="text-xs text-red-400/80 italic italic">"{errorMessage}"</p>
                                </div>
                            );
                        }

                        return (
                            <div className="relative">
                                <span className="absolute -left-2 top-0 text-4xl text-teal-500/20 font-serif leading-none">"</span>
                                <div className="text-sm sm:text-base text-slate-200 leading-[1.8] font-medium pl-4 py-1 italic opacity-90">
                                    {displayText}
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-end">
                                    <div className="text-right">
                                        <div className="text-xs font-black text-white/50 uppercase tracking-[0.2em] mb-1">Signed by</div>
                                        <div className="text-sm font-serif italic text-teal-400/80">AI Writing Examiner</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* 2. Performance DNA - Side-by-Side Modern Grid */}
            {(superpower.title !== "Not available" || priority.title !== "Not available") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Superpower Card */}
                    {superpower.title !== "Not available" && (
                        <div className="relative group overflow-hidden bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 transition-all duration-300 hover:border-emerald-500/30">
                            {/* Animated Background Pulse */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />

                            <div className="flex flex-col h-full relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10">
                                        <Zap className="w-5 h-5 fill-emerald-500/20" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em] mb-1">Superpower</span>
                                        <h4 className="text-base font-black text-white">{superpower.title}</h4>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed italic opacity-80">
                                    "{superpower.desc || summary.superpower_example || "You demonstrate exceptional control in this area, setting a strong foundation for your target band."}"
                                </p>
                                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Strength Verified</span>
                                    <CheckCircle className="w-4 h-4 text-emerald-500/40" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Priority Focus Card */}
                    {priority.title !== "Not available" && (
                        <div className="relative group overflow-hidden bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 transition-all duration-300 hover:border-amber-500/30">
                            {/* Animated Background Pulse */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />

                            <div className="flex flex-col h-full relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 shadow-lg shadow-amber-500/10">
                                        <Target className="w-5 h-5 fill-amber-500/20" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-amber-500 tracking-[0.2em] mb-1">Priority Focus</span>
                                        <h4 className="text-base font-black text-white">{priority.title}</h4>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed italic opacity-80">
                                    "{priority.desc || summary.priority_quick_win || "Focusing on this will bring the highest immediate impact to your overall band score."}"
                                </p>
                                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Growth Opportunity</span>
                                    <ArrowRight className="w-4 h-4 text-amber-500/40" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 3. Actionable Insights Table */}
            <div className="space-y-4">
                <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-widest px-1">Actionable Insights</h3>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider w-[30%]">Category</th>
                                <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider w-[15%] text-center">Score</th>
                                <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Quick Win</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {criteriaInsights.map((c) => (
                                <tr key={c.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <span className={cn("text-xs font-bold",
                                            c.color === 'blue' ? 'text-blue-400' :
                                                c.color === 'indigo' ? 'text-indigo-400' :
                                                    c.color === 'amber' ? 'text-amber-400' : 'text-emerald-400'
                                        )}>
                                            {c.label}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={cn("inline-block px-2 py-0.5 rounded-md text-xs font-black bg-white/5",
                                            c.score >= 7 ? "text-emerald-400" :
                                                c.score >= 6 ? "text-teal-400" : "text-amber-400"
                                        )}>
                                            {c.score}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-300">
                                            <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                                            {c.quickWin}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. 3-Day Fast Track Plan */}
            {practiceSchedule && practiceSchedule.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        3-Day Fast Track Plan
                    </h3>
                    <div className="grid gap-3">
                        {practiceSchedule.map((day: any, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all group">
                                <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-teal-500/10 border border-teal-500/20 group-hover:scale-105 transition-transform">
                                    <span className="text-[9px] uppercase font-black text-teal-600/80 dark:text-teal-500/80">Day</span>
                                    <span className="text-xl font-black text-teal-400 leading-none">{day.day}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-bold text-white truncate">{day.task || "Practice Task"}</h4>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-semibold text-slate-400">
                                            <Clock className="w-3 h-3" />
                                            {day.time_minutes} min
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50" />
                                        Focus: <span className="text-slate-300">{day.focus || "Improvement"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}


        </div>
    );
};
