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
        const current = payload.find((p: any) => p.name === 'Current')?.value;
        const target = payload.find((p: any) => p.name === 'Target')?.value;
        const gap = (current !== undefined && target !== undefined) ? target - current : 0;

        return (
            <div className="bg-[#1E293B] border border-[#334155] p-3 rounded-lg shadow-lg z-50">
                <p className="font-bold text-white mb-1">{label}</p>
                <div className="space-y-1">
                    <p className="text-sm text-cyan-400">
                        Current: <span className="font-semibold">{current}</span>
                    </p>
                    <p className="text-sm text-slate-400">
                        Target: {target}
                    </p>
                </div>
                {gap > 0 ? (
                    <p className="text-xs text-amber-500 mt-2 font-medium">
                        Needs {gap.toFixed(1)} more
                    </p>
                ) : (
                    <p className="text-xs text-green-500 mt-2 font-medium">
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
    // const target = subjectData?.B; // We can hide target number to reduce clutter if preferred, but user guide asked simply to fix labels

    return (
        <g transform={`translate(${x},${y})`}>
            <text textAnchor={textAnchor} y={-5} className="font-bold" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                <tspan fill="#F8FAFC" fontWeight="600">{payload.value}</tspan> {/* White/Slate-50 label name */}
            </text>
            <text textAnchor={textAnchor} y={14} style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>
                {/* Ensure contrast for values */}
                <tspan fill="#22D3EE" fontWeight="bold">{current}</tspan>
                <tspan fill="#64748b"> / </tspan>
                <tspan fill="#94A3B8">{subjectData?.fullMark || 9}</tspan>
            </text>
        </g>
    );
};

export default function SkillRadar({ data }: SkillRadarProps) {
    const id = React.useId();
    const currentGradientId = `currentGradient-${id}`;

    return (
        <div className="w-full h-[450px] flex items-center justify-center py-4 relative">
            {/* Render pure CSS glow filter for the stroke via style injection or similar if SVG filters are tricky in Recharts. 
                 Recharts supports 'filter' prop on Radar. Let's define the filter. */}
            <svg style={{ height: 0, width: 0, position: 'absolute' }}>
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>

            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
                    <defs>
                        {/* Current Score Gradient (Cyan-Blue) */}
                        <linearGradient id={currentGradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>

                    <PolarGrid
                        gridType="polygon"
                        stroke="#334155" // Slate-700 equivalent
                        strokeWidth={1}
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

                    {/* Target Layer (Dashed, White/Faint) - Render first to be behind current if overlapping */}
                    <Radar
                        name="Target"
                        dataKey="B"
                        stroke="#94A3B8" // Slate-400
                        strokeWidth={2}
                        strokeDasharray="4 4" // Dashed line
                        fill="transparent"
                        fillOpacity={0}
                    />

                    {/* Current Layer (Glowy, Filled) */}
                    <Radar
                        name="Current"
                        dataKey="A"
                        stroke="#22D3EE" // Cyan
                        strokeWidth={3}
                        fill={`url(#${currentGradientId})`}
                        fillOpacity={1}
                        filter="url(#glow)" // Apply SVG filter
                    />

                    <Tooltip content={<CustomTooltip />} cursor={false} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
