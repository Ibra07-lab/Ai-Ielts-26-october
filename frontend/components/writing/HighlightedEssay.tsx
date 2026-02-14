import React from 'react';
import { cn } from '@/lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';
import { AlertCircle, CheckCircle2, Lightbulb, BookOpen, PenTool, Layout } from 'lucide-react';

export interface HighlightRange {
    text: string;
    type: 'strength' | 'weakness' | 'mixed';
}

export interface Correction {
    original: string;
    corrected: string;
    explanation: string;
    type: 'grammar' | 'vocabulary' | 'coherence';
    tip?: string;
}

interface HighlightedEssayProps {
    essayText: string;
    highlights: HighlightRange[];
    corrections?: Correction[];
    viewMode?: 'original' | 'improved';
}

const TYPE_CONFIG = {
    grammar: {
        icon: PenTool,
        label: 'Grammar',
        color: 'rose',
        bgClass: 'bg-rose-500/10',
        borderClass: 'border-rose-500/30',
        textClass: 'text-rose-400',
    },
    vocabulary: {
        icon: BookOpen,
        label: 'Vocabulary',
        color: 'emerald',
        bgClass: 'bg-emerald-500/10',
        borderClass: 'border-emerald-500/30',
        textClass: 'text-emerald-400',
    },
    coherence: {
        icon: Layout,
        label: 'Coherence',
        color: 'indigo',
        bgClass: 'bg-indigo-500/10',
        borderClass: 'border-indigo-500/30',
        textClass: 'text-indigo-400',
    },
};

export const HighlightedEssay: React.FC<HighlightedEssayProps> = ({
    essayText,
    highlights,
    corrections = [],
    viewMode = 'original'
}) => {
    // Escape regex characters
    const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    // Build the corrected essay text for "improved" mode
    const getImprovedText = () => {
        let improvedText = essayText;
        // Sort by length (descending) to replace longer matches first
        const sortedCorrections = [...corrections].sort((a, b) => b.original.length - a.original.length);

        for (const correction of sortedCorrections) {
            if (correction.original && correction.corrected) {
                // Use case-insensitive replacement
                const regex = new RegExp(escapeRegExp(correction.original), 'gi');
                improvedText = improvedText.replace(regex, correction.corrected);
            }
        }
        return improvedText;
    };

    // In improved mode, show the corrected essay with green highlights
    if (viewMode === 'improved') {
        const improvedText = getImprovedText();

        // Highlight the corrections in the improved text
        const validCorrections = corrections.filter(c => c.original && c.corrected && c.corrected.trim().length > 2);

        if (validCorrections.length === 0) {
            return (
                <div className="font-serif text-[20px] leading-[1.8] text-slate-800 dark:text-slate-100/90 tracking-wide selection:bg-teal-500/30">
                    {improvedText}
                </div>
            );
        }

        // Create pattern from corrected texts
        const patternString = validCorrections.map(c => escapeRegExp(c.corrected)).join('|');
        const regex = new RegExp(`(${patternString})`, 'gi');
        const parts = improvedText.split(regex);

        return (
            <Tooltip.Provider delayDuration={200}>
                <div className="font-serif text-[20px] leading-[1.8] text-slate-800 dark:text-slate-100/90 tracking-wide selection:bg-teal-500/30 overflow-y-auto custom-scrollbar relative">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] dark:hidden" />

                    <div className="relative z-10">
                        {parts.map((part, index) => {
                            // Find matching correction by corrected text
                            const matchedCorrection = validCorrections.find(
                                c => c.corrected.toLowerCase() === part.toLowerCase()
                            );

                            if (matchedCorrection) {
                                const config = TYPE_CONFIG[matchedCorrection.type];
                                const IconComponent = config.icon;

                                return (
                                    <Tooltip.Root key={index}>
                                        <Tooltip.Trigger asChild>
                                            <mark className="bg-emerald-500/20 border-b-2 border-emerald-500/60 rounded-t-lg px-1 mx-0.5 cursor-help text-inherit transition-all duration-300 hover:bg-emerald-500/30">
                                                {part}
                                            </mark>
                                        </Tooltip.Trigger>
                                        <Tooltip.Portal>
                                            <Tooltip.Content
                                                className="z-50 w-[350px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-0 overflow-hidden animate-in fade-in-0 zoom-in-95"
                                                sideOffset={8}
                                            >
                                                {/* Header */}
                                                <div className={cn("px-4 py-2 border-b border-slate-700 flex items-center gap-2", config.bgClass)}>
                                                    <IconComponent className={cn("w-4 h-4", config.textClass)} />
                                                    <span className={cn("text-xs font-bold uppercase tracking-wider", config.textClass)}>
                                                        {config.label} Improvement
                                                    </span>
                                                </div>

                                                {/* Content */}
                                                <div className="p-4 space-y-3">
                                                    {/* Original */}
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs font-medium text-rose-400">
                                                            <AlertCircle className="w-3 h-3" />
                                                            <span>Original</span>
                                                        </div>
                                                        <p className="text-sm text-slate-400 line-through pl-5">
                                                            "{matchedCorrection.original}"
                                                        </p>
                                                    </div>

                                                    {/* Improved */}
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            <span>Improved</span>
                                                        </div>
                                                        <p className="text-sm text-emerald-300 font-medium pl-5">
                                                            "{matchedCorrection.corrected}"
                                                        </p>
                                                    </div>

                                                    {/* Explanation */}
                                                    <div className="space-y-1 pt-2 border-t border-slate-700/50">
                                                        <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
                                                            <Lightbulb className="w-3 h-3" />
                                                            <span>Why this is better</span>
                                                        </div>
                                                        <p className="text-sm text-slate-300 pl-5">
                                                            {matchedCorrection.explanation}
                                                        </p>
                                                    </div>
                                                </div>

                                                <Tooltip.Arrow className="fill-slate-700" />
                                            </Tooltip.Content>
                                        </Tooltip.Portal>
                                    </Tooltip.Root>
                                );
                            }
                            return <span key={index}>{part}</span>;
                        })}
                    </div>
                </div>
            </Tooltip.Provider>
        );
    }

    // Original mode - show errors with hover tooltips
    // Sort highlights by length (descending) to match longest phrases first
    const sortedHighlights = [...highlights].sort((a, b) => b.text.length - a.text.length);
    const validHighlights = sortedHighlights.filter(h => h.text && h.text.trim().length > 2);

    // Also prepare corrections for matching
    const validCorrections = corrections.filter(c => c.original && c.original.trim().length > 2);

    // Combine patterns from both highlights and corrections
    const allPatterns = [
        ...validHighlights.map(h => h.text),
        ...validCorrections.map(c => c.original)
    ];
    const uniquePatterns = [...new Set(allPatterns)];

    if (uniquePatterns.length === 0) {
        return (
            <div className="font-serif text-[20px] leading-[1.8] text-slate-800 dark:text-slate-100/90 tracking-wide selection:bg-teal-500/30">
                {essayText}
            </div>
        );
    }

    const patternString = uniquePatterns.map(p => escapeRegExp(p)).join('|');
    const regex = new RegExp(`(${patternString})`, 'gi');
    const parts = essayText.split(regex);

    return (
        <Tooltip.Provider delayDuration={200}>
            <div className="font-serif text-[20px] leading-[1.8] text-slate-800 dark:text-slate-100/90 tracking-wide selection:bg-teal-500/30 overflow-y-auto custom-scrollbar relative">
                {/* Subtle Paper Texture for Light Mode */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] dark:hidden" />

                <div className="relative z-10">
                    {parts.map((part, index) => {
                        // First check if it matches a correction (has more info)
                        const matchedCorrection = validCorrections.find(
                            c => c.original.toLowerCase() === part.toLowerCase()
                        );

                        if (matchedCorrection) {
                            const config = TYPE_CONFIG[matchedCorrection.type];
                            const IconComponent = config.icon;

                            return (
                                <Tooltip.Root key={index}>
                                    <Tooltip.Trigger asChild>
                                        <mark className="bg-transparent underline decoration-red-500 decoration-2 underline-offset-4 cursor-help text-inherit transition-all duration-300 hover:bg-red-500/10">
                                            {part}
                                        </mark>
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                        <Tooltip.Content
                                            className="z-50 w-[350px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-0 overflow-hidden animate-in fade-in-0 zoom-in-95"
                                            sideOffset={8}
                                        >
                                            {/* Header */}
                                            <div className={cn("px-4 py-2 border-b border-slate-700 flex items-center gap-2", config.bgClass)}>
                                                <IconComponent className={cn("w-4 h-4", config.textClass)} />
                                                <span className={cn("text-xs font-bold uppercase tracking-wider", config.textClass)}>
                                                    {config.label} Issue
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 space-y-3">
                                                {/* Original */}
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-rose-400">
                                                        <AlertCircle className="w-3 h-3" />
                                                        <span>Original</span>
                                                    </div>
                                                    <p className="text-sm text-slate-400 pl-5">
                                                        "{matchedCorrection.original}"
                                                    </p>
                                                </div>

                                                {/* Improved */}
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        <span>Suggested Improvement</span>
                                                    </div>
                                                    <p className="text-sm text-emerald-300 font-medium pl-5">
                                                        "{matchedCorrection.corrected}"
                                                    </p>
                                                </div>

                                                {/* Explanation */}
                                                <div className="space-y-1 pt-2 border-t border-slate-700/50">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
                                                        <Lightbulb className="w-3 h-3" />
                                                        <span>Why</span>
                                                    </div>
                                                    <p className="text-sm text-slate-300 pl-5">
                                                        {matchedCorrection.explanation}
                                                    </p>
                                                </div>

                                                {/* Tip if available */}
                                                {matchedCorrection.tip && (
                                                    <div className="text-xs text-slate-500 pl-5 italic">
                                                        💡 {matchedCorrection.tip}
                                                    </div>
                                                )}
                                            </div>

                                            <Tooltip.Arrow className="fill-slate-700" />
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                            );
                        }

                        // Check if it matches a simple highlight (strength/weakness)
                        const matchedHighlight = validHighlights.find(
                            h => h.text.toLowerCase() === part.toLowerCase()
                        );

                        if (matchedHighlight) {
                            return (
                                <Tooltip.Root key={index}>
                                    <Tooltip.Trigger asChild>
                                        <mark
                                            className={cn(
                                                "transition-all duration-300 cursor-help text-inherit",
                                                matchedHighlight.type === 'strength'
                                                    ? "bg-emerald-500/10 border-b-2 border-emerald-500/60 rounded-t-lg px-1 mx-0.5 hover:bg-emerald-500/20"
                                                    : "bg-transparent underline decoration-red-500 decoration-2 underline-offset-4 hover:bg-red-500/10"
                                            )}
                                        >
                                            {part}
                                        </mark>
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                        <Tooltip.Content
                                            className="z-50 max-w-[250px] bg-slate-900 border border-slate-700 rounded-lg shadow-xl px-3 py-2 text-sm text-slate-200"
                                            sideOffset={5}
                                        >
                                            {matchedHighlight.type === 'strength'
                                                ? "✅ Effective usage"
                                                : "⚠️ Area for improvement"}
                                            <Tooltip.Arrow className="fill-slate-700" />
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                            );
                        }

                        return <span key={index}>{part}</span>;
                    })}
                </div>
            </div>
        </Tooltip.Provider>
    );
};
