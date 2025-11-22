import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface DailyProgressData {
    date: string;
    fullDate: string;
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
    vocabulary: number;
    total: number;
}

interface DailyProgressChartProps {
    data: DailyProgressData[];
}

const COLORS = {
    listening: "#8b5cf6", // Purple
    reading: "#10b981",   // Green
    writing: "#0ea5e9",   // Light Blue
    speaking: "#ef4444",  // Red
    vocabulary: "#f97316" // Orange
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-xl text-white min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
                <p className="text-slate-400 text-sm mb-2 font-medium">{data.fullDate}</p>
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-800">
                    <span className="font-bold text-lg">Overall Progress</span>
                    <span className="font-bold text-lg">{data.total} Tasks</span>
                </div>
                <div className="space-y-2">
                    {Object.entries(COLORS).map(([key, color]) => {
                        const value = data[key as keyof DailyProgressData];
                        if (value === 0) return null;
                        return (
                            <div key={key} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                    <span className="capitalize text-slate-300">{key}</span>
                                </div>
                                <span className="font-mono font-medium">{value}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
    return null;
};

export default function DailyProgressChart({ data }: DailyProgressChartProps) {
    // Calculate max value for Y-axis domain to add some headroom
    const maxValue = Math.max(...data.map(d => d.total), 5);

    return (
        <Card className="bg-slate-950 border-slate-900 shadow-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-900/50 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            Daily Activity
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Your daily learning breakdown across all skills
                        </CardDescription>
                    </div>
                    <div className="flex gap-4 text-xs">
                        {Object.entries(COLORS).map(([key, color]) => (
                            <div key={key} className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
                                <span className="capitalize text-slate-400">{key}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 pl-0">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                            barSize={40}
                        >
                            <defs>
                                {/* Add gradients/glows if needed, but solid colors with shadow effect are cleaner for stacked bars */}
                                <pattern id="hatched" patternUnits="userSpaceOnUse" width="4" height="4">
                                    <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" style={{ stroke: '#334155', strokeWidth: 1 }} />
                                </pattern>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#1e293b"
                            />
                            <XAxis
                                dataKey="date"
                                stroke="#64748b"
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#64748b"
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                                domain={[0, 'auto']}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 4 }}
                            />

                            {/* Stacked Bars */}
                            <Bar dataKey="listening" stackId="a" fill={COLORS.listening} radius={[0, 0, 4, 4]} />
                            <Bar dataKey="reading" stackId="a" fill={COLORS.reading} />
                            <Bar dataKey="writing" stackId="a" fill={COLORS.writing} />
                            <Bar dataKey="speaking" stackId="a" fill={COLORS.speaking} />
                            <Bar dataKey="vocabulary" stackId="a" fill={COLORS.vocabulary} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
