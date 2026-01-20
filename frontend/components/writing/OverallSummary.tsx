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
        <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
            
            {/* Header */}
            <div>
                 <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-white">Overall Summary</h2>
                    <div className="flex flex-col items-end">
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Performance</span>
                         <div className="w-12 h-14 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center">
                            <span className="text-[8px] font-bold text-emerald-400 uppercase">BAND</span>
                            <span className="text-xl font-black text-emerald-400 leading-none">{result.overall_band}</span>
                         </div>
                    </div>
                </div>
                <p className="text-slate-400 text-sm -mt-8">PERFORMANCE OVERVIEW</p>
            </div>


            {/* Radar Chart */}
            <div className="h-[280px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                         <PolarAngleAxis 
                            dataKey="subject" 
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                         />
                         <PolarRadiusAxis angle={30} domain={[0, 9]} tick={false} axisLine={false} />
                        <Radar
                            name="Score"
                            dataKey="A"
                            stroke="#10b981"
                            strokeWidth={2}
                            fill="#10b981"
                            fillOpacity={0.2}
                        />
                    </RadarChart>
                </ResponsiveContainer>
                {/* Center Score Overlay */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <span className="text-2xl font-black text-white/10">{result.overall_band}</span>
                 </div>
            </div>

            {/* Insight Cards */}
            <div className="grid grid-cols-2 gap-4">
                {/* Strongest */}
                <Card className="bg-slate-900/50 border-slate-800 p-4 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-2 opacity-50"><TrendingUp className="w-4 h-4 text-emerald-500"/></div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Strongest
                    </p>
                    <h4 className="text-sm font-bold text-white mb-1">{strongest.label}</h4>
                    <span className="text-2xl font-black text-emerald-400">{strongest.score}</span>
                </Card>

                 {/* Focus Area */}
                 <Card className="bg-slate-900/50 border-slate-800 p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-50"><Target className="w-4 h-4 text-amber-500"/></div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Focus Area
                    </p>
                    <h4 className="text-sm font-bold text-white mb-1">{weakest.label}</h4>
                     <span className="text-2xl font-black text-amber-400">{weakest.score}</span>
                </Card>
            </div>

            {/* Stats */}
             <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/30 rounded-xl p-4 flex flex-col justify-between">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider"><Target className="w-3 h-3 inline mr-1"/> Average</span>
                       <span className="text-xl font-bold text-white">6.0</span>
                  </div>
                   <div className="bg-slate-900/30 rounded-xl p-4 flex flex-col justify-between">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider"><Award className="w-3 h-3 inline mr-1"/> Band Score</span>
                       <span className="text-xl font-bold text-cyan-400">{result.overall_band}</span>
                  </div>
             </div>

             {/* Score Breakdown Bars (Mini) */}
              <div className="pt-2">
                 <h4 className="text-xs font-bold text-slate-400 mb-3">Score Breakdown</h4>
                 <div className="space-y-3">
                     {sortedScores.map((s) => (
                         <div key={s.id} className="space-y-1">
                             <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                                 <span>{s.label}</span>
                                 <span className={cn(
                                     s.score >= 7 ? "text-emerald-400" : s.score >= 6 ? "text-blue-400" : "text-amber-400"
                                 )}>{s.score}</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                 <div 
                                    className={cn("h-full rounded-full",
                                         s.score >= 7 ? "bg-emerald-500" : s.score >= 6 ? "bg-blue-500" : "bg-amber-500"
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
