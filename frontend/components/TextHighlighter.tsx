import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookMarked, X, Volume2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "../contexts/UserContext";
import backend from "~backend/client";

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
}

interface PopupMenu {
  x: number;
  y: number;
  selectedText: string;
  startPosition: number;
  endPosition: number;
  highlightType: string;
}

interface Translation {
  originalText: string;
  translatedText: string;
  targetLanguage: string;
  definition?: string;
  exampleSentence?: string;
  audioUrl?: string;
}

export default function TextHighlighter({ 
  content, 
  passageTitle, 
  highlights = [], 
  onHighlightsChange,
  showLabels = true,
}: TextHighlighterProps) {
  const [popupMenu, setPopupMenu] = useState<PopupMenu | null>(null);
  const [deletePopup, setDeletePopup] = useState<{ x: number; y: number; highlightId: number } | null>(null);
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isAddingToVocab, setIsAddingToVocab] = useState(false);
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

  // Note: Translate action removed from selection popup per new minimalist UI

  const handleAddToVocabulary = async (translationData?: Translation) => {
    if (!popupMenu || !user) return;

    setIsAddingToVocab(true);
    try {
      let definition = `Definition of "${popupMenu.selectedText}"`;
      let translationText = popupMenu.selectedText;
      
      if (translationData) {
        definition = translationData.definition || definition;
        translationText = translationData.translatedText;
      }

      await backend.ielts.addToVocabulary({
        userId: user.id,
        text: popupMenu.selectedText,
        definition,
        translation: translationText,
        targetLanguage: user.language,
        exampleSentence: `"${popupMenu.selectedText}" is used in this context.`,
        topic: "Reading",
      });

      // Create highlight
      await createHighlight();

      toast({
        title: "Added to Vocabulary!",
        description: `"${popupMenu.selectedText}" has been saved to your vocabulary.`,
      });

      setPopupMenu(null);
      setTranslation(null);
    } catch (error) {
      console.error("Failed to add to vocabulary:", error);
      toast({
        title: "Error",
        description: "Failed to add to vocabulary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToVocab(false);
    }
  };

  const createHighlight = async (color: 'yellow' | 'blue' | 'green' = 'yellow') => {
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
      await backend.ielts.deleteHighlight({ userId: user.id, highlightId });

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

  const playAudio = (audioUrl?: string) => {
    if (audioUrl) {
      // In a real app, this would play the actual audio
      toast({
        title: "🔊 Audio",
        description: "Playing pronunciation...",
      });
    }
  };

  const renderSegmentWithHighlights = (segmentText: string, segmentStart: number) => {
    const segmentEnd = segmentStart + segmentText.length;
    const overlapping = currentHighlights
      .filter(h => h.endPosition > segmentStart && h.startPosition < segmentEnd)
      .sort((a, b) => a.startPosition - b.startPosition);

    if (overlapping.length === 0) return segmentText as any;

    const colorClassMap: Record<string, string> = {
      yellow: 'bg-yellow-200 dark:bg-yellow-800',
      blue: 'bg-blue-200 dark:bg-blue-800',
      lightblue: 'bg-blue-200 dark:bg-blue-800', // legacy stored value
      green: 'bg-green-200 dark:bg-green-800',
    };

    let result: any[] = [];
    let lastIndex = 0;
    overlapping.forEach((h) => {
      const start = Math.max(h.startPosition, segmentStart) - segmentStart;
      const end = Math.min(h.endPosition, segmentEnd) - segmentStart;
      if (start > lastIndex) {
        result.push(segmentText.slice(lastIndex, start));
      }
      const highlightClass = colorClassMap[h.highlightColor] || 'bg-yellow-200 dark:bg-yellow-800';
      result.push(
        <span
          key={`highlight-${h.id}-${segmentStart}`}
          className={`${highlightClass} cursor-pointer relative px-1 rounded`}
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
          {segmentText.slice(start, end)}
        </span>
      );
      lastIndex = end;
    });
    if (lastIndex < segmentText.length) {
      result.push(segmentText.slice(lastIndex));
    }
    return result;
  };

  return (
    <div
      ref={contentRef}
      className="prose prose-sm max-w-none dark:prose-invert leading-relaxed select-text cursor-text relative"
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
            <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">
              {showLabels && <span className="mr-2 font-semibold">{label}</span>}
              <span data-segment-start={paraStart}>{body}</span>
            </p>
          );
        });
      })()}

      {/* Selection Popup Menu - Minimalist: Green, Blue, Yellow, Trash */}
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
              aria-label="Apply Green Highlight"
              className="w-6 h-6 rounded-full bg-green-400 dark:bg-green-500 border border-green-600/40"
              onClick={() => createHighlight('green')}
            />
            <button
              aria-label="Apply Blue Highlight"
              className="w-6 h-6 rounded-full bg-blue-400 dark:bg-blue-500 border border-blue-600/40"
              onClick={() => createHighlight('blue')}
            />
            <button
              aria-label="Apply Yellow Highlight"
              className="w-6 h-6 rounded-full bg-yellow-400 dark:bg-yellow-500 border border-yellow-600/40"
              onClick={() => createHighlight('yellow')}
            />
            <button
              aria-label="Clear selection"
              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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

      {/* Translation Overlay */}
      {translation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Translation</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setTranslation(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Badge variant="outline" className="mb-2">Original</Badge>
                  <p className="text-sm font-medium">{translation?.originalText}</p>
                </div>

                <div>
                  <Badge variant="outline" className="mb-2">Translation</Badge>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {translation?.translatedText}
                    </p>
                    {translation?.audioUrl && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => playAudio(translation?.audioUrl)}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {translation?.definition && (
                  <div>
                    <Badge variant="outline" className="mb-2">Definition</Badge>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {translation?.definition}
                    </p>
                  </div>
                )}

                {translation?.exampleSentence && (
                  <div>
                    <Badge variant="outline" className="mb-2">Example</Badge>
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                      {translation?.exampleSentence}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleAddToVocabulary(translation || undefined)}
                    disabled={isAddingToVocab}
                    className="flex-1"
                  >
                    <BookMarked className="h-4 w-4 mr-2" />
                    {isAddingToVocab ? "Adding..." : "Save to Vocabulary"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
