import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

interface SkillData {
    subject: string;
    A: number; // Current Score
    B: number; // Target Score
    fullMark: number;
}

interface SkillRadarProps {
    data: SkillData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        // payload order depends on the order of Radar components
        // We need to find them by name or dataKey
        const current = payload.find((p: any) => p.name === 'Current')?.value;
        const target = payload.find((p: any) => p.name === 'Target')?.value;

        // Calculate gap if both values exist
        const gap = (current !== undefined && target !== undefined) ? target - current : 0;

        return (
            <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <p className="font-bold text-gray-900 dark:text-white mb-1">{label}</p>
                <div className="space-y-1">
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">
                        Current: <span className="font-semibold">{current}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Target: {target}
                    </p>
                </div>
                {gap > 0 ? (
                    <p className="text-xs text-amber-600 mt-2 font-medium">
                        Needs {gap.toFixed(1)} more
                    </p>
                ) : (
                    <p className="text-xs text-green-600 mt-2 font-medium">
                        Target Reached!
                    </p>
                )}
            </div>
        );
    }
    return null;
};

const CustomTick = ({ payload, x, y, textAnchor, data }: any) => {
    const subjectData = data.find((d: any) => d.subject === payload.value);
    const current = subjectData?.A;
    const target = subjectData?.B;

    return (
        <g transform={`translate(${x},${y})`}>
            <text textAnchor={textAnchor} y={-5} className="font-bold" style={{ fontSize: '16px', fontFamily: 'Inter, sans-serif' }}>
                <tspan fill="#2563eb">{current}</tspan> {/* Blue-600 for better contrast */}
                <tspan fill="#9ca3af" fontSize="12px"> / </tspan>
                <tspan fill="#059669">{target}</tspan> {/* Emerald-600 for better contrast */}
            </text>
            <text textAnchor={textAnchor} y={12} fill="#4b5563" className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>
                {payload.value}
            </text>
        </g>
    );
};

export default function SkillRadar({ data }: SkillRadarProps) {
    const id = React.useId();
    const currentGradientId = `currentGradient-${id}`;
    const targetGradientId = `targetGradient-${id}`;
    // Removed glow filter as it washes out lines on white background

    return (
        <div className="w-full h-[450px] flex items-center justify-center py-4">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
                    <defs>
                        {/* Current Score Gradient (Blue) */}
                        <linearGradient id={currentGradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>

                        {/* Target Score Gradient (Green) */}
                        <linearGradient id={targetGradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>

                    <PolarGrid
                        gridType="polygon"
                        stroke="#e5e7eb" // Gray-200
                        strokeWidth={2}
                        strokeOpacity={0.8} // Increased opacity for visibility
                        className="dark:stroke-gray-700"
                    />

                    <PolarAngleAxis
                        dataKey="subject"
                        tick={(props) => <CustomTick {...props} data={data} />}
                    />

                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 9]}
                        tick={false}
                        axisLine={false}
                    />

                    {/* Target Layer (Green) */}
                    <Radar
                        name="Target"
                        dataKey="B"
                        stroke="#059669" // Emerald-600 (Darker Green)
                        strokeWidth={3}
                        fill={`url(#${targetGradientId})`}
                        fillOpacity={1}
                    />

                    {/* Current Layer (Blue) */}
                    <Radar
                        name="Current"
                        dataKey="A"
                        stroke="#2563eb" // Blue-600 (Darker Blue)
                        strokeWidth={3}
                        fill={`url(#${currentGradientId})`}
                        fillOpacity={1}
                    />

                    <Tooltip content={<CustomTooltip />} cursor={false} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
