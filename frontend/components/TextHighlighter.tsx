import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookMarked, Languages, X, Volume2, Trash2 } from "lucide-react";
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
  onHighlightsChange 
}: TextHighlighterProps) {
  const [popupMenu, setPopupMenu] = useState<PopupMenu | null>(null);
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
    
    // Calculate positions relative to the content
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(contentElement);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    const startPosition = preCaretRange.toString().length;
    const endPosition = startPosition + selectedText.length;

    // Determine if it's a word or sentence
    const isWord = !selectedText.includes(' ') || selectedText.split(' ').length <= 3;
    const highlightType = isWord ? 'word' : 'sentence';

    // Get selection coordinates for popup positioning
    const rect = range.getBoundingClientRect();
    const containerRect = contentElement.getBoundingClientRect();
    
    setPopupMenu({
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 10,
      selectedText,
      startPosition,
      endPosition,
      highlightType,
    });

    // Clear selection
    selection.removeAllRanges();
  };

  const handleTranslate = async () => {
    if (!popupMenu || !user) return;

    setIsTranslating(true);
    try {
      const result = await backend.ielts.translateText({
        text: popupMenu.selectedText,
        targetLanguage: user.language,
      });
      setTranslation(result);
    } catch (error) {
      console.error("Translation failed:", error);
      toast({
        title: "Translation Error",
        description: "Failed to translate text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

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

  const createHighlight = async () => {
    if (!popupMenu || !user) return;

    try {
      const highlight = await backend.ielts.createHighlight({
        userId: user.id,
        passageTitle,
        highlightedText: popupMenu.selectedText,
        startPosition: popupMenu.startPosition,
        endPosition: popupMenu.endPosition,
        highlightType: popupMenu.highlightType,
        highlightColor: popupMenu.highlightType === 'word' ? 'yellow' : 'lightblue',
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
      await backend.ielts.deleteHighlight({
        userId: user.id,
        highlightId,
      });

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

  const renderHighlightedContent = () => {
    if (currentHighlights.length === 0) {
      return content;
    }

    // Sort highlights by start position
    const sortedHighlights = [...currentHighlights].sort((a, b) => a.startPosition - b.startPosition);
    
    let result = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, index) => {
      // Add text before highlight
      if (highlight.startPosition > lastIndex) {
        result.push(content.slice(lastIndex, highlight.startPosition));
      }

      // Add highlighted text
      const highlightClass = highlight.highlightType === 'word' 
        ? 'bg-yellow-200 dark:bg-yellow-800' 
        : 'bg-blue-200 dark:bg-blue-800';
      
      result.push(
        <span
          key={`highlight-${highlight.id}`}
          className={`${highlightClass} cursor-pointer relative group px-1 rounded`}
          onClick={(e) => {
            e.stopPropagation();
            // Show delete option on click
          }}
        >
          {highlight.highlightedText}
          <button
            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
            onClick={(e) => {
              e.stopPropagation();
              deleteHighlight(highlight.id);
            }}
          >
            <X className="w-2 h-2" />
          </button>
        </span>
      );

      lastIndex = highlight.endPosition;
    });

    // Add remaining text
    if (lastIndex < content.length) {
      result.push(content.slice(lastIndex));
    }

    return result;
  };

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className="prose prose-sm max-w-none dark:prose-invert leading-relaxed select-text cursor-text"
        onMouseUp={handleTextSelection}
        onTouchEnd={handleTextSelection}
      >
        {content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">
            {index === 0 ? renderHighlightedContent() : paragraph}
          </p>
        ))}
      </div>

      {/* Popup Menu */}
      {popupMenu && (
        <div
          className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2"
          style={{
            left: `${popupMenu.x}px`,
            top: `${popupMenu.y}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleTranslate}
              disabled={isTranslating}
            >
              <Languages className="h-3 w-3 mr-1" />
              {isTranslating ? "..." : "Translate"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddToVocabulary()}
              disabled={isAddingToVocab}
            >
              <BookMarked className="h-3 w-3 mr-1" />
              {isAddingToVocab ? "..." : "Add to Vocab"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPopupMenu(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
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
                  <p className="text-sm font-medium">{translation.originalText}</p>
                </div>

                <div>
                  <Badge variant="outline" className="mb-2">Translation</Badge>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {translation.translatedText}
                    </p>
                    {translation.audioUrl && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => playAudio(translation.audioUrl)}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {translation.definition && (
                  <div>
                    <Badge variant="outline" className="mb-2">Definition</Badge>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {translation.definition}
                    </p>
                  </div>
                )}

                {translation.exampleSentence && (
                  <div>
                    <Badge variant="outline" className="mb-2">Example</Badge>
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                      {translation.exampleSentence}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleAddToVocabulary(translation)}
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
