import { useState, useRef, useEffect, useCallback } from 'react';

export interface ContextMenuState {
    x: number;
    y: number;
    show: boolean;
    canHighlight?: boolean;
}

export const useHighlighter = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const highlightRanges = useRef<Range[]>([]);
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
    const savedSelection = useRef<Range | null>(null);
    const [, setRefresh] = useState(0);

    const triggerRefresh = useCallback(() => setRefresh(prev => prev + 1), []);

    // Inject CSS for highlight pseudo-element
    useEffect(() => {
        const style = document.createElement("style");
        style.id = "yellow-highlighter-style";
        style.innerHTML = `
          ::highlight(yellow-highlighter) {
            background-color: #fde047;
            color: black;
          }
        `;
        document.head.appendChild(style);

        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);

        return () => {
            const existingStyle = document.getElementById("yellow-highlighter-style");
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Native Context Menu Handler
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleNativeContextMenu = (e: MouseEvent) => {
            // Allow default context menu on inputs
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

            const selection = window.getSelection();
            const hasSelection = selection && selection.rangeCount > 0 && !selection.isCollapsed;

            if (hasSelection) {
                const range = selection.getRangeAt(0);
                if (container.contains(range.commonAncestorContainer)) {
                    e.preventDefault();
                    savedSelection.current = range.cloneRange();
                    setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        show: true,
                        canHighlight: true
                    });
                    return;
                }
            }

            // Normal context menu but with 'clear' option if right-clicking inside container
            if (container.contains(target)) {
                if (highlightRanges.current.length > 0) {
                    e.preventDefault();
                    setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        show: true,
                        canHighlight: false
                    });
                }
            }
        };

        container.addEventListener('contextmenu', handleNativeContextMenu);
        return () => {
            container.removeEventListener('contextmenu', handleNativeContextMenu);
        };
    }, [containerRef.current]);

    const applyHighlight = useCallback(() => {
        if (!savedSelection.current || !containerRef.current) return;

        const range = savedSelection.current;
        highlightRanges.current.push(range);

        // Filter out detached ranges
        highlightRanges.current = highlightRanges.current.filter(r => r.commonAncestorContainer.isConnected);

        // Check for Custom Highlight API support
        // @ts-ignore
        if (typeof Highlight !== 'undefined' && CSS.highlights) {
            // @ts-ignore
            const highlight = new Highlight(...highlightRanges.current);
            // @ts-ignore
            CSS.highlights.set("yellow-highlighter", highlight);
        }

        setContextMenu(null);
        savedSelection.current = null;
        window.getSelection()?.removeAllRanges();
        triggerRefresh();
    }, [triggerRefresh]);

    const clearHighlights = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const selection = window.getSelection();
        const selectionRange = (selection && selection.rangeCount > 0) ? selection.getRangeAt(0) : savedSelection.current;

        if (!selectionRange) {
            // If no selection, clear ALL highlights
            highlightRanges.current = [];
        } else {
            // Overlap detection logic
            const newRanges: Range[] = [];
            highlightRanges.current.forEach(r => {
                if (!r.commonAncestorContainer.isConnected) return;

                try {
                    const startsAfterSelectionEnds = r.compareBoundaryPoints(Range.START_TO_END, selectionRange) >= 0;
                    const endsBeforeSelectionStarts = r.compareBoundaryPoints(Range.END_TO_START, selectionRange) <= 0;

                    if (startsAfterSelectionEnds || endsBeforeSelectionStarts) {
                        newRanges.push(r);
                    } else {
                        if (r.compareBoundaryPoints(Range.START_TO_START, selectionRange) < 0) {
                            const beforeRange = r.cloneRange();
                            beforeRange.setEnd(selectionRange.startContainer, selectionRange.startOffset);
                            newRanges.push(beforeRange);
                        }
                        if (r.compareBoundaryPoints(Range.END_TO_END, selectionRange) > 0) {
                            const afterRange = r.cloneRange();
                            afterRange.setStart(selectionRange.endContainer, selectionRange.endOffset);
                            newRanges.push(afterRange);
                        }
                    }
                } catch (err) {
                    newRanges.push(r);
                }
            });
            highlightRanges.current = newRanges;
        }

        highlightRanges.current = highlightRanges.current.filter(r => r.commonAncestorContainer.isConnected);

        // @ts-ignore
        if (typeof CSS !== 'undefined' && CSS.highlights) {
            // @ts-ignore
            if (highlightRanges.current.length > 0) {
                // @ts-ignore
                const highlight = new Highlight(...highlightRanges.current);
                // @ts-ignore
                CSS.highlights.set("yellow-highlighter", highlight);
            } else {
                // @ts-ignore
                CSS.highlights.delete("yellow-highlighter");
            }
        }

        setContextMenu(null);
        window.getSelection()?.removeAllRanges();
        savedSelection.current = null;
        triggerRefresh();
    }, [triggerRefresh]);

    return {
        containerRef,
        contextMenu,
        setContextMenu,
        applyHighlight,
        clearHighlights,
        hasHighlights: highlightRanges.current.length > 0,
        // @ts-ignore
        isSupported: typeof Highlight !== 'undefined' && typeof CSS !== 'undefined' && !!CSS.highlights
    };
};
