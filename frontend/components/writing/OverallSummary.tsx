import React from 'react';
import { EvaluationResult } from '@/types/writing-feedback';
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis } from 'recharts';
import { TrendingUp, Target, Award, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OverallSummaryProps {
    result: EvaluationResult;
}

export const OverallSummary: React.FC<OverallSummaryProps> = ({ result }) => {
    // Helper to find score
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

    // Determine strongest and weakest
    const scores = [
        { id: 'task_achievement', label: 'Task Achievement', score: taskAchievement },
        { id: 'coherence_cohesion', label: 'Coherence', score: coherence },
        { id: 'lexical_resource', label: 'Vocabulary', score: lexical },
        { id: 'grammatical_range_accuracy', label: 'Grammar', score: grammar },
    ];

    const sortedScores = [...scores].sort((a, b) => b.score - a.score);
    const strongest = sortedScores[0];
    const weakest = sortedScores[sortedScores.length - 1];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 h-full flex flex-col">

            {/* Header */}
            <div className="relative">
                <div className="flex items-center justify-between mb-1">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-teal-500/80">
                            Performance Overview
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Overall Summary</h2>
                    </div>
                </div>
            </div>


            {/* Radar Chart Section */}
            <div className="relative group">
                <div className="absolute -inset-4 bg-teal-500/5 blur-3xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity pointer-events-none" />
                <div className="h-[280px] w-full relative z-10 bg-white/[0.02] rounded-3xl border border-white/5 p-4 shadow-inner overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                            <PolarGrid stroke="#ffffff10" strokeDasharray="4 4" />
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}
                            />
                            <PolarRadiusAxis angle={30} domain={[0, 9]} tick={false} axisLine={false} />
                            <Radar
                                name="Score"
                                dataKey="A"
                                stroke="#2dd4bf"
                                strokeWidth={3}
                                fill="url(#radarGradient)"
                                fillOpacity={0.4}
                            />
                            <defs>
                                <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.2} />
                                </linearGradient>
                            </defs>
                        </RadarChart>
                    </ResponsiveContainer>
                    {/* Center Score Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-4xl font-black text-white/5 tracking-tighter">{result.overall_band}</span>
                    </div>
                </div>
            </div>

            {/* Insight Cards */}
            <div className="grid grid-cols-2 gap-4">
                {/* Strongest */}
                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:bg-white/[0.04] transition-all">
                    <div className="absolute top-0 right-0 p-3 opacity-20"><TrendingUp className="w-5 h-5 text-emerald-400" /></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Strongest
                    </p>
                    <h4 className="text-[13px] font-bold text-slate-300 mb-1 leading-tight">{strongest.label}</h4>
                    <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">{strongest.score}</span>
                </div>

                {/* Focus Area */}
                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:bg-white/[0.04] transition-all">
                    <div className="absolute top-0 right-0 p-3 opacity-20"><Target className="w-5 h-5 text-amber-400" /></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-500" /> Focus Area
                    </p>
                    <h4 className="text-[13px] font-bold text-slate-300 mb-1 leading-tight">{weakest.label}</h4>
                    <span className="text-3xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">{weakest.score}</span>
                </div>
            </div>

            {/* Score Breakdown Bars */}
            <div className="bg-white/[0.01] rounded-2xl p-6 border border-white/5 space-y-5">
                <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Detailed Breakdown</h4>
                <div className="space-y-4">
                    {sortedScores.map((s) => (
                        <div key={s.id} className="space-y-2">
                            <div className="flex justify-between items-end text-[11px] font-bold uppercase tracking-wider">
                                <span className="text-slate-400">{s.label}</span>
                                <span className={cn(
                                    "text-sm font-black",
                                    s.score >= 7 ? "text-emerald-400" : s.score >= 6 ? "text-teal-400" : "text-amber-400"
                                )}>{s.score}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className={cn("h-full rounded-full transition-all duration-1000",
                                        s.score >= 7 ? "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]" :
                                            s.score >= 6 ? "bg-gradient-to-r from-teal-500 to-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.4)]" :
                                                "bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                                    )}
                                    style={{ width: `${(s.score / 9) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
};
