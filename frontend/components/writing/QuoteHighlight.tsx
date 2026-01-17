import React from 'react';

interface QuoteHighlightProps {
    text: string;
    className?: string; // Optional for additional styling
}

export function QuoteHighlight({ text, className = "" }: QuoteHighlightProps) {
    // Regex to match text in double or single quotes
    // Matches "quote" or 'quote'
    const parts = text.split(/(".*?"|'.*?')/g);

    return (
        <span className={className}>
            {parts.map((part, index) => {
                // Check if the part starts and ends with quotes
                if ((part.startsWith('"') && part.endsWith('"')) ||
                    (part.startsWith("'") && part.endsWith("'"))) {
                    // Remove the quotes for display, or keep them if preferred. 
                    // Keeping quotes is usually clearer as it indicates exact text.
                    return (
                        <span key={index} className="bg-yellow-200 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-100 rounded px-1 font-medium mx-0.5">
                            {part}
                        </span>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </span>
    );
}
