import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreImpactBadgeProps {
    impact: 'high' | 'medium' | 'low';
    className?: string;
}

export function ScoreImpactBadge({ impact, className }: ScoreImpactBadgeProps) {
    const config = {
        high: {
            icon: '🔴',
            label: 'High Impact',
            subtitle: 'Limits Band 7',
            className: 'bg-red-500/10 text-red-400 border-red-500/30'
        },
        medium: {
            icon: '🟡',
            label: 'Medium Impact',
            subtitle: 'Affects 0.5 bands',
            className: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        },
        low: {
            icon: '🟢',
            label: 'Minor',
            subtitle: 'Small improvement',
            className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        }
    };

    const { icon, label, subtitle, className: configClassName } = config[impact];

    return (
        <div className={cn("px-2 py-1 rounded border text-[10px] font-bold inline-flex flex-col items-center", configClassName, className)}>
            <div className="flex items-center gap-1">
                <span>{icon}</span>
                <span>{label}</span>
            </div>
            <div className="text-[8px] opacity-70 font-normal">{subtitle}</div>
        </div>
    );
}
