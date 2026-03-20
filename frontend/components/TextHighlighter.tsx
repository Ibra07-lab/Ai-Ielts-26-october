import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookMarked, X, Volume2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "../contexts/UserContext";
import backend from "@/backend";

interface Highlight {
  id: number;
  highlightedText: string;
  startPosition: number;
  endPosition: number;
  highlightType: string;
  highlightColor: string;
}

interface TextHighlighterProps {
  content: string;
  passageTitle: string;
  highlights?: Highlight[];
  onHighlightsChange?: (highlights: Highlight[]) => void;
  showLabels?: boolean;
  evidenceQuotes?: Array<{ quote: string; questionId: number }>;
  showEvidenceHighlights?: boolean;
  className?: string;
}

interface PopupMenu {
  x: number;
  y: number;
  selectedText: string;
  startPosition: number;
  endPosition: number;
  highlightType: string;
}

export default function TextHighlighter({
  content,
  passageTitle,
  highlights = [],
  onHighlightsChange,
  showLabels = true,
  evidenceQuotes = [],
  showEvidenceHighlights = false,
  className,
}: TextHighlighterProps) {
  const [popupMenu, setPopupMenu] = useState<PopupMenu | null>(null);
  const [deletePopup, setDeletePopup] = useState<{ x: number; y: number; highlightId: number } | null>(null);
  const [currentHighlights, setCurrentHighlights] = useState<Highlight[]>(highlights);
  const contentRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    setCurrentHighlights(highlights);
  }, [highlights]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !contentRef.current) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    const range = selection.getRangeAt(0);
    const contentElement = contentRef.current;

    // Find nearest paragraph body wrapper to compute offsets relative to raw content
    let containerForOffset: HTMLElement | null = null;
    const startNode = range.startContainer as Node;
    if ((startNode as any).nodeType === 3) {
      containerForOffset = (startNode.parentElement || null);
    } else {
      containerForOffset = (startNode as HTMLElement);
    }
    const paragraphBody = containerForOffset?.closest('[data-segment-start]') as HTMLElement | null;

    let startPosition = 0;
    let endPosition = 0;
    if (paragraphBody && paragraphBody.dataset.segmentStart) {
      const segmentStart = parseInt(paragraphBody.dataset.segmentStart, 10) || 0;
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(paragraphBody);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      const relStart = preCaretRange.toString().length;
      startPosition = segmentStart + relStart;
      endPosition = startPosition + selectedText.length;
    } else {
      // Fallback: calculate positions relative to entire content block (may be offset by labels)
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(contentElement);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      startPosition = preCaretRange.toString().length;
      endPosition = startPosition + selectedText.length;
    }

    // Determine if it's a word or sentence
    const isWord = !selectedText.includes(' ') || selectedText.split(' ').length <= 3;
    const highlightType = isWord ? 'word' : 'sentence';

    // Get selection coordinates for popup positioning
    const rect = range.getBoundingClientRect();
    const containerRect = contentElement.getBoundingClientRect();
    const topWithin = rect.top - containerRect.top;
    const bottomWithin = rect.bottom - containerRect.top;
    let popupY = topWithin - 36; // try above selection first
    if (popupY < 0) {
      popupY = bottomWithin + 8; // place below if not enough space above
    }

    setPopupMenu({
      x: rect.left - containerRect.left + rect.width / 2,
      y: popupY,
      selectedText,
      startPosition,
      endPosition,
      highlightType,
    });

    // Clear selection
    selection.removeAllRanges();
    setDeletePopup(null);
  };



  const createHighlight = async (color: 'yellow' | 'blue' | 'green' | 'orange' = 'yellow') => {
    if (!popupMenu || !user) return;

    try {
      const highlight = await backend.ielts.createHighlight({
        userId: user.id,
        passageTitle,
        highlightedText: popupMenu.selectedText,
        startPosition: popupMenu.startPosition,
        endPosition: popupMenu.endPosition,
        highlightType: popupMenu.highlightType,
        highlightColor: color,
      });

      const newHighlights = [...currentHighlights, highlight];
      setCurrentHighlights(newHighlights);
      onHighlightsChange?.(newHighlights);

      setPopupMenu(null);
    } catch (error) {
      console.error("Failed to create highlight:", error);
      toast({
        title: "Error",
        description: "Failed to create highlight. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteHighlight = async (highlightId: number) => {
    if (!user) return;

    try {
      await backend.ielts.deleteHighlight(user.id, highlightId);

      const newHighlights = currentHighlights.filter(h => h.id !== highlightId);
      setCurrentHighlights(newHighlights);
      onHighlightsChange?.(newHighlights);

      toast({
        title: "Highlight Removed",
        description: "The highlight has been removed.",
      });
    } catch (error) {
      console.error("Failed to delete highlight:", error);
      toast({
        title: "Error",
        description: "Failed to remove highlight. Please try again.",
        variant: "destructive",
      });
    }
  };


  const renderSegmentWithHighlights = (segmentText: string, segmentStart: number) => {
    const segmentEnd = segmentStart + segmentText.length;
    const overlapping = currentHighlights
      .filter(h => h.endPosition > segmentStart && h.startPosition < segmentEnd)
      .sort((a, b) => a.startPosition - b.startPosition);

    // Find evidence quotes in this segment
    const evidenceMatches: Array<{ start: number; end: number; quote: string; questionId: number }> = [];
    if (showEvidenceHighlights && evidenceQuotes.length > 0) {
      evidenceQuotes.forEach(evidenceItem => {
        if (!evidenceItem || !evidenceItem.quote || !evidenceItem.quote.trim()) return;

        // cleaning helper: escape regex special chars THEN collapse whitespace
        const cleanForRegex = (str: string) => str.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');

        // Remove wrapping quotes if present (some datasets like test-15.json have them)
        let rawQuote = evidenceItem.quote.trim();
        if (rawQuote.startsWith('"') && rawQuote.endsWith('"')) {
          rawQuote = rawQuote.slice(1, -1);
        }
        // Remove wrapping single quotes too just in case
        if (rawQuote.startsWith("'") && rawQuote.endsWith("'")) {
          rawQuote = rawQuote.slice(1, -1);
        }

        // Handle quotes with ellipses "..."
        const parts = rawQuote.split(/\.{3,}/).filter(p => p.trim().length > 0);

        if (parts.length === 0) return;

        // Construct a regex that matches the parts in order, with optional chars in between
        // We match strict on the parts but loose in between
        let patternStr = "";
        parts.forEach((part, i) => {
          if (i > 0) {
            // Between parts, allow up to 100 characters of anything (wildcard matching for ellipses)
            patternStr += ".{0,100}?";
          }
          patternStr += cleanForRegex(part);
        });

        const regex = new RegExp(patternStr, 'gi');
        let match;

        // Reset lastIndex because we're reusing regex? No, new regex each time here.
        while ((match = regex.exec(segmentText)) !== null) {
          evidenceMatches.push({
            start: match.index,
            end: match.index + match[0].length,
            quote: match[0], // Use the actual matched text from segment
            questionId: evidenceItem.questionId,
          });

          // Prevent infinite loops on zero-length matches (unlikely here but good practice)
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      });
    }

    if (overlapping.length === 0 && evidenceMatches.length === 0) return segmentText as any;

    const colorClassMap: Record<string, string> = {
      yellow: 'bg-yellow-200 dark:bg-yellow-800',
      blue: 'bg-blue-200 dark:bg-blue-800',
      lightblue: 'bg-blue-200 dark:bg-blue-800',
      green: 'bg-green-200 dark:bg-green-800',
      orange: 'bg-orange-200 dark:bg-orange-800', // Added orange
    };

    // Combine user highlights and evidence highlights
    const allHighlights: Array<{ start: number; end: number; type: 'user' | 'evidence'; data?: any; questionIds?: number[] }> = [];

    overlapping.forEach(h => {
      const start = Math.max(h.startPosition, segmentStart) - segmentStart;
      const end = Math.min(h.endPosition, segmentEnd) - segmentStart;
      allHighlights.push({ start, end, type: 'user', data: h });
    });

    // Merge overlapping evidence quotes and collect all question IDs
    const mergedEvidence: Map<string, { start: number; end: number; questionIds: number[] }> = new Map();
    evidenceMatches.forEach(em => {
      const key = `${em.start}-${em.end}`;
      if (mergedEvidence.has(key)) {
        mergedEvidence.get(key)!.questionIds.push(em.questionId);
      } else {
        mergedEvidence.set(key, { start: em.start, end: em.end, questionIds: [em.questionId] });
      }
    });

    mergedEvidence.forEach(evidence => {
      allHighlights.push({ start: evidence.start, end: evidence.end, type: 'evidence', questionIds: evidence.questionIds });
    });

    // Sort by start position
    allHighlights.sort((a, b) => a.start - b.start);

    let result: any[] = [];
    let lastIndex = 0;
    allHighlights.forEach((hl, idx) => {
      if (hl.start > lastIndex) {
        result.push(segmentText.slice(lastIndex, hl.start));
      }

      if (hl.type === 'evidence') {
        result.push(
          <React.Fragment key={`evidence-${segmentStart}-${hl.start}-${idx}`}>
            <mark className="bg-green-200 dark:bg-green-800 text-inherit font-medium border-b-2 border-green-500 dark:border-green-600 rounded-sm">
              {segmentText.slice(hl.start, hl.end)}
            </mark>
            {hl.questionIds && hl.questionIds.map((qId: number, i: number) => (
              <span key={`q-${qId}`} className="ml-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-green-600 rounded-full align-top cursor-help" title={`Evidence for Q${qId}`}>
                {qId}
              </span>
            ))}
          </React.Fragment>
        );
      } else {
        const h = hl.data;
        const highlightClass = colorClassMap[h.highlightColor] || 'bg-yellow-200 dark:bg-yellow-800';
        result.push(
          <span
            key={`highlight-${h.id}-${segmentStart}`}
            className={`${highlightClass} cursor-pointer relative rounded transition-colors`}
            onClick={(e) => {
              e.stopPropagation();
              if (!contentRef.current) return;
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              const containerRect = contentRef.current.getBoundingClientRect();
              const topWithin = rect.top - containerRect.top;
              let y = topWithin - 36;
              if (y < 0) y = rect.bottom - containerRect.top + 8;
              setDeletePopup({
                x: rect.left - containerRect.left + rect.width / 2,
                y,
                highlightId: h.id,
              });
            }}
          >
            {segmentText.slice(hl.start, hl.end)}
          </span>
        );
      }
      lastIndex = hl.end;
    });
    if (lastIndex < segmentText.length) {
      result.push(segmentText.slice(lastIndex));
    }
    return result;
  };

  return (
    <div
      ref={contentRef}
      className={`${className || 'prose prose-lg max-w-none dark:prose-invert leading-relaxed'} select-text cursor-text relative`}
      onMouseUp={handleTextSelection}
      onTouchEnd={handleTextSelection}
    >
      {(() => {
        const parts = content.split('\n\n');
        let searchFrom = 0;
        return parts.map((paragraph, index) => {
          // remove any existing "A. ", "B. ", etc. at the start to avoid duplication
          const clean = paragraph.replace(/^[A-Za-z][.)]\s+|^[A-Za-z]\.\s+/, '');
          const label = String.fromCharCode(65 + index) + "."; // A., B., C., ...
          const paraStart = content.indexOf(paragraph, searchFrom);
          const paraEnd = paraStart >= 0 ? paraStart + paragraph.length : searchFrom + paragraph.length;
          searchFrom = paraEnd + 2; // skip past this part and the two newlines
          const body = renderSegmentWithHighlights(clean, paraStart);

          return (
            <p key={index} className="mb-6 text-gray-800 dark:text-gray-200 text-[17px]">
              {showLabels && <span className="mr-3 font-bold text-gray-900 dark:text-white">{label}</span>}
              <span data-segment-start={paraStart}>{body}</span>
            </p>
          );
        });
      })()}

      {/* Selection Popup Menu - Minimalist: Orange, Blue, Yellow, Trash */}
      {popupMenu && (
        <div
          className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2"
          style={{
            left: `${popupMenu!.x}px`,
            top: `${popupMenu!.y}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="flex items-center gap-2">
            <button
              aria-label="Apply Orange Highlight"
              className="w-6 h-6 rounded-full bg-orange-400 dark:bg-orange-500 border border-orange-600/40 hover:scale-110 transition-transform"
              onClick={() => createHighlight('orange')}
            />
            <button
              aria-label="Apply Blue Highlight"
              className="w-6 h-6 rounded-full bg-blue-400 dark:bg-blue-500 border border-blue-600/40 hover:scale-110 transition-transform"
              onClick={() => createHighlight('blue')}
            />
            <button
              aria-label="Apply Yellow Highlight"
              className="w-6 h-6 rounded-full bg-yellow-400 dark:bg-yellow-500 border border-yellow-600/40 hover:scale-110 transition-transform"
              onClick={() => createHighlight('yellow')}
            />
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
            <button
              aria-label="Clear selection"
              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 hover:text-red-500 transition-colors"
              onClick={() => setPopupMenu(null)}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Delete-only Popup when clicking existing highlight */}
      {deletePopup && (
        <div
          className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1"
          style={{
            left: `${deletePopup.x}px`,
            top: `${deletePopup.y}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <button
            aria-label="Remove this highlight"
            className="w-7 h-7 rounded-md border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              deleteHighlight(deletePopup.highlightId);
              setDeletePopup(null);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

    </div>
  );
}
