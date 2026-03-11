import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DailyProgressData {
    date: string;
    fullDate: string;
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
    vocabulary: number;
    grammar: number;
    total: number;
    goal?: number;
}

interface DailyProgressChartProps {
    data: DailyProgressData[];
    days: number;
    onDaysChange: (days: number) => void;
}

const COLORS = {
    listening: "#f472b6",
    reading: "#34d399",
    writing: "#22d3ee",
    speaking: "#60a5fa",
    vocabulary: "#fbbf24",
    grammar: "#8b5cf6"
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as DailyProgressData;
        const categories = [
            { key: 'listening', label: 'Listening' },
            { key: 'reading', label: 'Reading' },
            { key: 'writing', label: 'Writing' },
            { key: 'speaking', label: 'Speaking' },
            { key: 'vocabulary', label: 'Vocabulary' },
            { key: 'grammar', label: 'Grammar' }
        ];

        const goal = data.goal || 5;
        const percentage = Math.min(100, Math.round((data.total / goal) * 100));

        return (
            <div className="bg-slate-900 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-md min-w-[180px]">
                <div className="flex justify-between items-start mb-3 border-b border-white/5 pb-2">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{data.fullDate}</p>
                    <div className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter",
                        percentage >= 100 ? "bg-emerald-500/20 text-emerald-500" : "bg-indigo-500/20 text-indigo-400"
                    )}>
                        {percentage}% Goal
                    </div>
                </div>
                <div className="space-y-2 mb-3">
                    {categories.map(cat => {
                        const val = (data as any)[cat.key];
                        if (val > 0) {
                            return (
                                <div key={cat.key} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: (COLORS as any)[cat.key] }} />
                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{cat.label}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-white tabular-nums">{val}</span>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total</span>
                    <span className="text-sm font-black text-white tabular-nums">{data.total} / {goal}</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function DailyProgressChart({ data, days, onDaysChange }: DailyProgressChartProps) {
    const totalActivity = data.reduce((acc, curr) => acc + curr.total, 0);

    const chartData = data.map(d => {
        const userGoal = d.goal || 5;
        const pct = Math.round((d.total / userGoal) * 100);
        return {
            ...d,
            displayValue: Math.min(100, pct),
            goal: userGoal,
            percentageLabel: d.total > 0 ? `${Math.min(100, pct)}%` : ""
        };
    });

    // Calculate max value for Y-Axis (percentage)
    const maxVal = 100;

    return (
        <div className="w-full h-full bg-transparent flex flex-col">
            <div className="px-8 pt-8 pb-4 flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-indigo-400 dark:text-indigo-300 uppercase tracking-[0.3em]">{days}-Day Activity</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-foreground tracking-tighter tabular-nums">
                            {totalActivity}
                        </span>
                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Points</span>
                    </div>
                </div>
                <div className="flex gap-4 bg-slate-100 dark:bg-white/5 p-1.5 rounded-full border border-slate-200 dark:border-white/10">
                    <button
                        onClick={() => onDaysChange(7)}
                        className={cn(
                            "px-5 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-full",
                            days === 7
                                ? "bg-white dark:bg-white text-slate-900 shadow-lg"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        7D
                    </button>
                    <button
                        onClick={() => onDaysChange(14)}
                        className={cn(
                            "px-5 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-full",
                            days === 14
                                ? "bg-white dark:bg-white text-slate-900 shadow-lg"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        14D
                    </button>
                </div>
            </div>

            <CardContent className="px-8 pt-12 pb-4 flex-grow">
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 0, left: -40, bottom: 0 }}
                            barSize={36}
                        >
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#d4ff00" />
                                    <stop offset="100%" stopColor="#00ffd5" />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }}
                                className="text-slate-500 dark:text-slate-400"
                                tickLine={false}
                                axisLine={false}
                                dy={15}
                            />
                            <YAxis
                                hide={true}
                                domain={[0, maxVal]}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'currentColor', radius: 10, opacity: 0.05 }}
                            />

                            <Bar
                                dataKey="displayValue"
                                name="Activity"
                                fill="url(#barGradient)"
                                radius={[20, 20, 20, 20]}
                                className="transition-all duration-300 hover:opacity-80"
                            >
                                <LabelList
                                    dataKey="percentageLabel"
                                    position="top"
                                    offset={10}
                                    className="fill-slate-600 dark:fill-slate-300 text-[10px] font-black"
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </div>
    );
}
