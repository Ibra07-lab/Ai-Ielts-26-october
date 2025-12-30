import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

// New "Cool" Palette
const COLORS = {
    listening: "#22D3EE", // Cyan
    reading: "#3B82F6",   // Blue
    writing: "#6366F1",   // Indigo
    speaking: "#A855F7",  // Purple
    vocabulary: "#F43F5E" // Pink (Accent)
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-[#1E293B] border border-[#334155] p-4 rounded-xl shadow-xl text-white min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
                <p className="text-slate-400 text-sm mb-2 font-medium">{data.fullDate}</p>
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-[#334155]">
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
    return (
        <Card className="bg-[#1E293B] border-[#334155] shadow-sm overflow-hidden">
            <CardHeader className="border-b border-[#334155] pb-4">
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
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
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
                            barSize={32} // Thicker bars
                        >
                            <CartesianGrid
                                strokeDasharray="" // Solid line
                                vertical={false}
                                stroke="#334155" // Faint solid line
                                strokeOpacity={0.4}
                            />
                            <XAxis
                                dataKey="date"
                                stroke="#64748b"
                                tick={{ fill: '#94A3B8', fontSize: 12 }} // Slate-400
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#64748b"
                                tick={{ fill: '#94A3B8', fontSize: 12 }} // Slate-400
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                                domain={[0, 'auto']}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: '#334155', opacity: 0.2, radius: 4 }}
                            />

                            {/* Stacked Bars with Border Radius on Top */}
                            <Bar dataKey="listening" stackId="a" fill={COLORS.listening} radius={[0, 0, 0, 0]} />
                            <Bar dataKey="reading" stackId="a" fill={COLORS.reading} radius={[0, 0, 0, 0]} />
                            <Bar dataKey="writing" stackId="a" fill={COLORS.writing} radius={[0, 0, 0, 0]} />
                            <Bar dataKey="speaking" stackId="a" fill={COLORS.speaking} radius={[0, 0, 0, 0]} />
                            {/* The last one in the stack gets the radius if it has value, but since it's stacked, 
                                we can give the top-most possible item a radius. 
                                Recharts stacking radius logic can be tricky. 
                                A common workaround is applying radius to the last item, but if that item is 0, it might look odd.
                                For now, let's try applying it to the top one (vocabulary) and see.
                                Ideally, we'd check which is the top-most non-zero value, but that requires custom shape.
                                Let's stick to standard top radius for the last element in stack order.
                            */}
                            <Bar dataKey="vocabulary" stackId="a" fill={COLORS.vocabulary} radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
