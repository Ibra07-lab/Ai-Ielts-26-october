import React, { useState, useRef, useEffect } from 'react';

interface Highlight {
    id: string;
    start: number;
    end: number;
    text: string;
}

interface SmartHighlighterProps {
    content: string;
    onHighlightsChange?: (highlights: Highlight[]) => void;
}

const SmartHighlighter: React.FC<SmartHighlighterProps> = ({ content, onHighlightsChange }) => {
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseUp = () => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || !containerRef.current) return;

        // Verify selection is within our container
        if (!containerRef.current.contains(selection.anchorNode)) return;

        const range = selection.getRangeAt(0);
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(containerRef.current);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);

        // Calculate raw offset
        const start = preSelectionRange.toString().length;
        const end = start + selection.toString().length;

        const newHighlight: Highlight = {
            id: crypto.randomUUID(),
            start,
            end,
            text: selection.toString(),
        };

        // Sort by start position
        const updated = [...highlights, newHighlight].sort((a, b) => a.start - b.start);
        setHighlights(updated);
        onHighlightsChange?.(updated);

        selection.removeAllRanges(); // Clear selection UI
    };

    const removeHighlight = (id: string) => {
        const updated = highlights.filter(h => h.id !== id);
        setHighlights(updated);
        onHighlightsChange?.(updated);
    };

    const renderContent = () => {
        if (highlights.length === 0) return content;

        const result = [];
        let lastIndex = 0;

        // Simply slice content based on sorted highlights. 
        // Note: This simple approach assumes no overlaps. 
        // If overlaps occur, a more complex "flattening" or stack-based approach is needed.
        // For now, we use the user's provided logic which is clean for non-overlapping cases.
        highlights.forEach((h) => {
            // Safety check for unsorted or overlapping (basic)
            if (h.start < lastIndex) return;

            // Add text before highlight
            result.push(content.substring(lastIndex, h.start));
            // Add highlighted span
            result.push(
                <span
                    key={h.id}
                    onClick={() => removeHighlight(h.id)}
                    className="bg-[#eef2ff] text-[#1e40af] rounded-[2px] cursor-pointer hover:bg-red-50 transition-colors px-0.5 border border-transparent hover:border-red-200"
                    title="Click to remove highlight"
                >
                    {content.substring(h.start, h.end)}
                </span>
            );
            lastIndex = h.end;
        });

        // Add remaining text
        if (lastIndex < content.length) {
            result.push(content.substring(lastIndex));
        }
        return result;
    };

    return (
        <div
            ref={containerRef}
            onMouseUp={handleMouseUp}
            className="prose prose-slate max-w-none leading-relaxed select-text p-4 border rounded-md bg-white shadow-sm"
        >
            {renderContent()}
        </div>
    );
};

export default SmartHighlighter;
