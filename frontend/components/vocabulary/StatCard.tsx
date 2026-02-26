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
        <Card className={cn("overflow-hidden border-slate-100 dark:border-white/5 bg-white dark:bg-card shadow-sm rounded-[1.25rem]", className)}>
            <CardContent className="p-8">
                <div className="flex items-start justify-between mb-4">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
                    {icon && <div className="text-sky-500 dark:text-sky-400">{icon}</div>}
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</span>
                    {trend && (
                        <span className={cn(
                            "text-xs font-bold px-1.5 py-0.5 rounded-full",
                            trend.isPositive ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" : "text-rose-500 bg-rose-50 dark:bg-rose-500/10"
                        )}>
                            {trend.value}
                        </span>
                    )}
                    {subtitle && <span className="text-sm text-slate-400 dark:text-slate-500">{subtitle}</span>}
                </div>

                {progressValue !== undefined && (
                    <div className="mt-6 w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full rounded-full transition-all duration-1000", progressColor)}
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
