import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SubSkillData {
    skill: string; // e.g., "Grammar", "Vocabulary"
    score: number; // 0-9
    fullMark: number;
}

interface SubSkillRadarProps {
    title: string;
    description?: string;
    data: SubSkillData[];
    color?: string; // hex color for the radar area
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 text-white p-2 rounded text-xs shadow-lg border border-slate-700">
                <p className="font-semibold">{label}</p>
                <p>Score: {payload[0].value}/9</p>
            </div>
        );
    }
    return null;
};

export default function SubSkillRadar({ title, description, data, color = "#3b82f6" }: SubSkillRadarProps) {
    return (
        <Card className="bg-white dark:bg-[#1E293B] border-slate-200 dark:border-[#334155] shadow-sm h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                    {title}
                </CardTitle>
                {description && (
                    <CardDescription className="text-xs text-gray-500 dark:text-slate-400">
                        {description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#94a3b8" strokeOpacity={0.3} />
                        <PolarAngleAxis
                            dataKey="skill"
                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 9]}
                            tick={false}
                            axisLine={false}
                        />
                        <Radar
                            name={title}
                            dataKey="score"
                            stroke={color}
                            strokeWidth={2}
                            fill={color}
                            fillOpacity={0.4}
                        />
                        <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
