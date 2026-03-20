import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    progressValue?: number;
    progressColor?: string;
    avatars?: React.ReactNode;
    className?: string;
}

export function StatCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    progressValue,
    progressColor = "bg-sky-500",
    avatars,
    className
}: StatCardProps) {
    return (
        <Card className={cn(
            "group overflow-hidden bg-white dark:bg-card border-2 border-b-[6px] border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-[1.5rem]",
            className
        )}>
            <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                    <span className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">{title}</span>
                    {icon && (
                        <div className="flex items-center justify-center w-12 h-12 rounded-[1rem] bg-sky-50 dark:bg-sky-500/10 text-sky-500 dark:text-sky-400 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            {icon}
                        </div>
                    )}
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{value}</span>
                    {trend && (
                        <span className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded-lg border",
                            trend.isPositive 
                                ? "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20" 
                                : "text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20"
                        )}>
                            {trend.value}
                        </span>
                    )}
                    {subtitle && <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{subtitle}</span>}
                </div>

                {progressValue !== undefined && (
                    <div className="mt-8 w-full h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner flex">
                        <div
                            className={cn("h-full rounded-full transition-all duration-1000", progressColor, progressColor.includes('bg-') ? '' : 'bg-sky-500')}
                            style={{ width: `${progressValue}%` }}
                        />
                    </div>
                )}

                {avatars && (
                    <div className="mt-6">
                        {avatars}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
