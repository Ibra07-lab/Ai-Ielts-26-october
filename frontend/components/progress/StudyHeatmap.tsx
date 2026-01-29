import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface HeatmapDataPoint {
    date: string; // YYYY-MM-DD
    count: number;
}

interface StudyHeatmapProps {
    data: HeatmapDataPoint[];
    year?: number;
}

export default function StudyHeatmap({ data, year = new Date().getFullYear() }: StudyHeatmapProps) {
    // Generate dates for the full year
    const generateYearDates = (year: number) => {
        const dates = [];
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);

        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d));
        }
        return dates;
    };

    const allDates = generateYearDates(year);

    // Map data to easy lookup
    const dataMap = new Map(data.map(item => [item.date, item.count]));

    // Helper to get color intensity
    const getColor = (count: number) => {
        if (count === 0) return "bg-slate-100 dark:bg-slate-800/50";
        if (count <= 2) return "bg-blue-200 dark:bg-blue-900/40";
        if (count <= 4) return "bg-blue-400 dark:bg-blue-700/60";
        if (count <= 6) return "bg-blue-600 dark:bg-blue-500/80";
        return "bg-blue-800 dark:bg-blue-400";
    };

    // Helper to format date
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
    };

    // Group by week for grid layout
    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    // Pad start of year if it doesn't start on Sunday
    const startDay = allDates[0].getDay(); // 0 is Sunday
    // GitHub starts weeks on Sunday usually.
    for (let i = 0; i < startDay; i++) {
        currentWeek.push(null);
    }

    allDates.forEach(date => {
        currentWeek.push(new Date(date)); // Clone to avoid reference issues if date obj is mutated
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    if (currentWeek.length > 0) {
        // Pad the end
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        weeks.push(currentWeek);
    }

    return (
        <Card className="bg-white dark:bg-[#1E293B] border-slate-200 dark:border-[#334155] shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            Study Consistency
                        </CardTitle>
                        <CardDescription className="text-gray-500 dark:text-slate-400 text-sm">
                            {data.reduce((acc, curr) => acc + curr.count, 0)} sessions completed in {year}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <span>Less</span>
                        <div className="w-2.5 h-2.5 bg-slate-100 dark:bg-slate-800/50 rounded-[2px] border border-slate-200 dark:border-white/5"></div>
                        <div className="w-2.5 h-2.5 bg-blue-200 dark:bg-blue-900/40 rounded-[2px] border border-blue-300 dark:border-white/5"></div>
                        <div className="w-2.5 h-2.5 bg-blue-400 dark:bg-blue-700/60 rounded-[2px] border border-blue-500 dark:border-white/5"></div>
                        <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-500/80 rounded-[2px] border border-blue-600 dark:border-white/5"></div>
                        <div className="w-2.5 h-2.5 bg-blue-800 dark:bg-blue-400 rounded-[2px] border border-blue-700 dark:border-white/5"></div>
                        <span>More</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    <div className="min-w-max flex gap-1">
                        {/* Days Labels Column */}
                        <div className="flex flex-col gap-1 pt-5 text-[9px] text-gray-400 font-medium h-[90px] justify-between pr-1">
                            <span className="h-2.5"></span> {/* Sun placeholder */}
                            <span className="h-2.5 leading-none">Mon</span>
                            <span className="h-2.5"></span>
                            <span className="h-2.5 leading-none">Wed</span>
                            <span className="h-2.5"></span>
                            <span className="h-2.5 leading-none">Fri</span>
                            <span className="h-2.5"></span>
                        </div>

                        {/* Weeks Columns */}
                        {weeks.map((week, wIndex) => (
                            <div key={wIndex} className="flex flex-col gap-1">
                                {/* Month Label (only for first week of month) */}
                                <div className="h-4 text-[9px] text-gray-500 dark:text-slate-500 font-medium">
                                    {week[0] && week[0].getDate() <= 7 && week[0]?.toLocaleString('default', { month: 'short' })}
                                </div>

                                {/* Days Cells */}
                                {week.map((date, dIndex) => {
                                    if (!date) return <div key={dIndex} className="w-2.5 h-2.5" />; // Empty placeholder

                                    const dateStr = formatDate(date);
                                    const count = dataMap.get(dateStr) || 0;

                                    return (
                                        <TooltipProvider key={dateStr}>
                                            <Tooltip delayDuration={50}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className={`w-2.5 h-2.5 rounded-[2px] ${getColor(count)} transition-all hover:scale-125 hover:z-10 border border-slate-200 dark:border-white/5`}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-slate-900 text-xs px-2 py-1">
                                                    <p>{count} sessions on {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
