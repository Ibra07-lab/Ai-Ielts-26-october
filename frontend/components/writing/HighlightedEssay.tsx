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
            <div className="prose prose-slate dark:prose-invert max-w-none leading-relaxed whitespace-pre-wrap font-serif text-lg p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                {essayText}
            </div>
        );
    }

    const patternString = validHighlights.map(h => escapeRegExp(h.text)).join('|');
    const regex = new RegExp(`(${patternString})`, 'gi');

    const parts = essayText.split(regex);

    return (
        <div className="prose prose-slate dark:prose-invert max-w-none leading-relaxed whitespace-pre-wrap font-serif text-lg p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-full overflow-y-auto custom-scrollbar">
            {parts.map((part, index) => {
                // Check if this part matches any highlight (case insensitive)
                const matchedHighlight = validHighlights.find(h => h.text.toLowerCase() === part.toLowerCase());

                if (matchedHighlight) {
                    return (
                        <mark
                            key={index}
                            className={cn(
                                "px-1 rounded mx-0.5 transition-colors duration-300",
                                matchedHighlight.type === 'strength'
                                    ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100 border-b-2 border-emerald-400"
                                    : "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100 border-b-2 border-amber-400"
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
    );
};
