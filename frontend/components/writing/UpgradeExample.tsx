import React from 'react';
import { ArrowUpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { QuoteHighlight } from './QuoteHighlight';
import { cn } from '@/lib/utils';

interface UpgradeExampleProps {
    original: string;
    improved: string;
    explanation?: string;
    className?: string;
}

export function UpgradeExample({ original, improved, explanation, className }: UpgradeExampleProps) {
    return (
        <div className={cn("flex flex-col gap-3 my-4", className)}>
            {/* Original Version */}
            <div className="flex gap-3 group">
                <div className="mt-1">
                    <XCircle className="w-5 h-5 text-red-400 opacity-60" />
                </div>
                <div className="flex-1 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20 text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-xs uppercase tracking-wider text-red-500 mb-1 block">Original</span>
                    <QuoteHighlight text={original} />
                </div>
            </div>

            {/* Improved Version */}
            <div className="flex gap-3 relative">
                <div className="mt-1 z-10">
                    <ArrowUpCircle className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                </div>

                {/* Connector Line */}
                <div className="absolute left-[9.5px] -top-5 bottom-5 w-0.5 bg-gradient-to-b from-red-200 via-emerald-200 to-transparent opacity-50 -z-0" />

                <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border-l-4 border-emerald-500 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">✨ Improved Version</span>
                    </div>

                    <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        <QuoteHighlight text={improved} />
                    </p>

                    {explanation && (
                        <p className="mt-3 text-xs text-emerald-700 dark:text-emerald-300 italic border-t border-emerald-200 dark:border-emerald-800/50 pt-2">
                            💡 {explanation}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
