import React from 'react';
import { cn } from '@/lib/utils';

export interface HighlightRange {
    text: string;
    type: 'strength' | 'weakness' | 'mixed';
}

interface HighlightedEssayProps {
    essayText: string;
    highlights: HighlightRange[];
}

export const HighlightedEssay: React.FC<HighlightedEssayProps> = ({ essayText, highlights }) => {

    // Sort highlights by length (descending) to match longest phrases first
    // This is a simple strategy to avoid sub-match issues, though not perfect for overlaps
    const sortedHighlights = [...highlights].sort((a, b) => b.text.length - a.text.length);

    // Escape regex characters
    const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    // Create a composite regex pattern
    // We match any of the highlight texts. 
    // Capturing groups are not ideal if we want to know WHICH type it matched easily in one go efficiently without named groups or indices.
    // Instead, let's just split the text by these patterns and then for each part check if it matches a highlight.

    // Filter out empty strings
    const validHighlights = sortedHighlights.filter(h => h.text && h.text.trim().length > 2);

    if (validHighlights.length === 0) {
        return (
            <div className="bg-white dark:bg-neutral-900/90 p-10 rounded-3xl border border-slate-200 dark:border-white/5 shadow-2xl min-h-full font-serif text-[20px] leading-[1.8] text-slate-800 dark:text-slate-100/90 tracking-wide selection:bg-teal-500/30">
                {essayText}
            </div>
        );
    }

    const patternString = validHighlights.map(h => escapeRegExp(h.text)).join('|');
    const regex = new RegExp(`(${patternString})`, 'gi');

    const parts = essayText.split(regex);

    return (
        <div className="bg-white dark:bg-neutral-900/90 p-10 rounded-3xl border border-slate-200 dark:border-white/5 shadow-2xl min-h-full font-serif text-[20px] leading-[1.8] text-slate-800 dark:text-slate-100/90 tracking-wide selection:bg-teal-500/30 overflow-y-auto custom-scrollbar relative">
            {/* Subtle Paper Texture for Light Mode */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] dark:hidden" />

            <div className="relative z-10">
                {parts.map((part, index) => {
                    // Check if this part matches any highlight (case insensitive)
                    const matchedHighlight = validHighlights.find(h => h.text.toLowerCase() === part.toLowerCase());

                    if (matchedHighlight) {
                        return (
                            <mark
                                key={index}
                                className={cn(
                                    "px-1 mx-0.5 rounded-sm transition-all duration-300 font-medium cursor-help",
                                    matchedHighlight.type === 'strength'
                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border-b-2 border-emerald-500/30 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 shadow-[0_4px_12px_rgba(16,185,129,0.05)]"
                                        : "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border-b-2 border-amber-500/30 hover:bg-amber-200 dark:hover:bg-amber-500/20 shadow-[0_4px_12px_rgba(245,158,11,0.05)]"
                                )}
                                title={matchedHighlight.type === 'strength' ? "Effective usage" : "Area for improvement"}
                            >
                                {part}
                            </mark>
                        );
                    }
                    return <span key={index}>{part}</span>;
                })}
            </div>
        </div>
    );
};
