import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface AccuracyData {
    type: string;
    accuracy: number; // 0-100 (Current)
    prevAccuracy?: number; // 0-100 (Previous Average)
}

interface QuestionTypeAccuracyProps {
    title: string;
    description?: string;
    data: AccuracyData[];
    targetBandScore?: number; // Target score in percentage (e.g., 75 for Band 7)
}

const COLORS = {
    BLUE: '#3b82f6',
    CYAN: '#06b6d4',
    EMERALD: '#10b981',
    AMBER: '#f59e0b',
    SLATE: '#64748b'
};

const getCategoryColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('tfng') || t.includes('true-false')) return COLORS.BLUE;
    if (t.includes('matching information') || t.includes('matching info')) return COLORS.CYAN;
    if (t.includes('matching headings')) return COLORS.AMBER;
    if (t.includes('multiple choice')) return COLORS.EMERALD;
    if (t.includes('gap fill') || t.includes('completion')) return COLORS.CYAN;
    return COLORS.SLATE;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-md min-w-[140px]">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 border-b border-white/5 pb-2">{label}</p>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Accuracy</span>
                    <span className="font-black text-white text-lg">{payload[0].value}%</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function QuestionTypeAccuracy({ title, data }: QuestionTypeAccuracyProps) {
    const sortedData = [...data].sort((a, b) => b.accuracy - a.accuracy);
    const avgAccuracy = Math.round(data.reduce((acc, curr) => acc + curr.accuracy, 0) / (data.length || 1));
    const targetBandScore = 75; // Example target percentage

    const minHeight = 380;
    const dynamicHeight = Math.max(minHeight, data.length * 50);

    return (
        <div className="w-full h-full bg-transparent flex flex-col">
            <div className="px-8 pt-8 pb-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">Overall Accuracy</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-foreground tracking-tighter tabular-nums">
                        {avgAccuracy}
                    </span>
                    <span className="text-xl font-black text-foreground tracking-tighter opacity-30">%</span>
                </div>
            </div>

            <div className="w-full px-8 pt-4 pb-8" style={{ height: dynamicHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={sortedData}
                        layout="vertical"
                        margin={{ top: 0, right: 30, left: 10, bottom: 20 }}
                        barSize={20}
                    >
                        <XAxis
                            type="number"
                            domain={[0, 100]}
                            hide={true}
                        />
                        <YAxis
                            dataKey="type"
                            type="category"
                            width={140}
                            axisLine={false}
                            tickLine={false}
                            className="text-muted-foreground/50"
                            tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'currentColor', radius: 4, opacity: 0.05 }}
                        />
                        <ReferenceLine
                            x={targetBandScore}
                            stroke="#f59e0b"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            label={{
                                position: 'top',
                                value: 'TARGET',
                                fill: '#f59e0b',
                                fontSize: 9,
                                fontWeight: 900,
                                letterSpacing: '0.2em'
                            }}
                        />
                        <Bar
                            dataKey="accuracy"
                            radius={[0, 10, 10, 0]}
                        >
                            {sortedData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getCategoryColor(entry.type)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
