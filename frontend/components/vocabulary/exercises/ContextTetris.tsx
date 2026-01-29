import { useState, useMemo } from "react";
import { Check, X, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Legacy format interfaces
interface Gap {
    id: string;
    correctWordId: string;
    placeholder: string;
}

interface WordBubble {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
}

// New enhanced format interfaces
interface NewFormatItem {
    item_id: number;
    gap_sentence: string;
    answer: string;
}

interface ContextTetrisProps {
    // Legacy format props
    paragraph?: string;
    gaps?: Gap[];
    bubbles?: WordBubble[];
    // New enhanced format props
    id?: number;
    set_name?: string;
    instruction?: string;
    word_bank?: string[];
    items?: NewFormatItem[];
    // Common
    onComplete: () => void;
}

export default function ContextTetris(props: ContextTetrisProps) {
    const { onComplete } = props;

    // Determine if using new format
    const isNewFormat = !!(props.word_bank && props.items);

    // Transform new format to internal format
    const { paragraph, gaps, bubbles, instruction } = useMemo(() => {
        if (isNewFormat && props.items && props.word_bank) {
            // Convert new format to internal format
            const internalGaps: Gap[] = props.items.map((item, index) => ({
                id: `gap-${index + 1}`,
                correctWordId: `word-${props.word_bank!.indexOf(item.answer)}`,
                placeholder: "___"
            }));

            const internalBubbles: WordBubble[] = props.word_bank.map((word, index) => ({
                id: `word-${index}`,
                text: word,
                isCorrect: true,
                feedback: "Try another word."
            }));

            // Create a paragraph-like structure or return items separately
            // For new format, we'll render items as separate sentences
            return {
                paragraph: "", // Not used in new format rendering
                gaps: internalGaps,
                bubbles: internalBubbles,
                instruction: props.instruction || "Choose the correct word to complete each sentence."
            };
        }

        // Legacy format - use as-is with defaults
        return {
            paragraph: props.paragraph || "",
            gaps: props.gaps || [],
            bubbles: props.bubbles || [],
            instruction: "Drag (or click) words to complete the paragraph with the correct academic tone."
        };
    }, [isNewFormat, props.items, props.word_bank, props.paragraph, props.gaps, props.bubbles, props.instruction]);

    const [filledGaps, setFilledGaps] = useState<Record<string, string>>({}); // gapId -> bubbleId
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    // Parse paragraph to render gaps (legacy format)
    const renderParagraph = () => {
        if (!paragraph) return null;
        const parts = paragraph.split(/(\{gap-\d+\})/g);
        return parts.map((part, index) => {
            const gapMatch = part.match(/\{gap-(\d+)\}/);
            if (gapMatch) {
                const gapId = `gap-${gapMatch[1]}`;
                const gap = gaps.find(g => g.id === gapId);
                const filledBubbleId = filledGaps[gapId];
                const filledBubble = bubbles.find(b => b.id === filledBubbleId);

                return (
                    <span
                        key={index}
                        className={cn(
                            "inline-block min-w-[100px] border-b-2 mx-1 text-center transition-all duration-300 px-2 py-0.5 rounded-t-md cursor-pointer",
                            filledBubble
                                ? "bg-sky-500/20 border-sky-500 text-sky-300 font-bold"
                                : "border-gray-600 bg-gray-800/50 text-gray-500 border-dashed hover:bg-gray-800"
                        )}
                        onClick={() => handleGapClick(gapId)}
                    >
                        {filledBubble ? filledBubble.text : gap?.placeholder || "___"}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    // Render new format items as separate sentences
    const renderNewFormatItems = () => {
        if (!props.items) return null;
        return props.items.map((item, index) => {
            const gapId = `gap-${index + 1}`;
            const filledBubbleId = filledGaps[gapId];
            const filledBubble = bubbles.find(b => b.id === filledBubbleId);

            // Split sentence by ___ placeholder
            const parts = item.gap_sentence.split(/___/);

            return (
                <div key={item.item_id} className="py-3 border-b border-gray-200 dark:border-white/10 last:border-b-0">
                    <span className="text-gray-600 dark:text-gray-400 mr-2">{index + 1}.</span>
                    {parts[0]}
                    <span
                        className={cn(
                            "inline-block min-w-[120px] border-b-2 mx-1 text-center transition-all duration-300 px-3 py-1 rounded-t-md cursor-pointer",
                            filledBubble
                                ? "bg-sky-500/20 border-sky-500 text-sky-300 font-bold"
                                : "border-gray-600 bg-gray-800/50 text-gray-500 border-dashed hover:bg-gray-800"
                        )}
                        onClick={() => handleGapClick(gapId)}
                    >
                        {filledBubble ? filledBubble.text : "___"}
                    </span>
                    {parts[1] || ""}
                </div>
            );
        });
    };

    const handleBubbleClick = (bubbleId: string) => {
        // Find first empty gap
        const emptyGap = gaps.find(g => !filledGaps[g.id]);
        if (emptyGap) {
            setFilledGaps(prev => ({ ...prev, [emptyGap.id]: bubbleId }));
            setFeedback(null);
        }
    };

    const handleGapClick = (gapId: string) => {
        // Clear the gap
        if (filledGaps[gapId]) {
            const newFilled = { ...filledGaps };
            delete newFilled[gapId];
            setFilledGaps(newFilled);
            setFeedback(null);
            setIsSuccess(false);
        }
    };

    const checkAnswers = () => {
        let allCorrect = true;
        let firstError = null;

        for (const gap of gaps) {
            const bubbleId = filledGaps[gap.id];
            if (!bubbleId) {
                setFeedback("Please fill all gaps first.");
                return;
            }
            if (bubbleId !== gap.correctWordId) {
                allCorrect = false;
                const bubble = bubbles.find(b => b.id === bubbleId);
                if (!firstError) firstError = bubble?.feedback || "Incorrect word for this context.";
            }
        }

        if (allCorrect) {
            setIsSuccess(true);
            setFeedback("Perfect! All words fit the academic context.");
        } else {
            setFeedback(firstError);
            setIsSuccess(false);
        }
    };

    const availableBubbles = bubbles.filter(b => !Object.values(filledGaps).includes(b.id));

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Context Tetris</h2>
                <p className="text-gray-500 dark:text-gray-400">{instruction}</p>
            </div>

            <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                <CardContent className="p-8 leading-loose text-lg text-gray-800 dark:text-gray-300">
                    {isNewFormat ? renderNewFormatItems() : renderParagraph()}
                </CardContent>
            </Card>

            {/* Floating Bubbles Area */}
            <div className="min-h-[100px] p-6 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-wrap gap-4 justify-center items-center">
                {availableBubbles.length > 0 ? (
                    availableBubbles.map((bubble) => (
                        <button
                            key={bubble.id}
                            onClick={() => handleBubbleClick(bubble.id)}
                            className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all active:scale-95"
                        >
                            {bubble.text}
                        </button>
                    ))
                ) : (
                    <p className="text-gray-500 italic">All words placed. Check your answers!</p>
                )}
            </div>

            {feedback && (
                <div className={cn(
                    "p-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-bottom-2",
                    isSuccess ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400"
                )}>
                    {isSuccess ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    <p className="font-medium">{feedback}</p>
                </div>
            )}

            <div className="flex justify-center gap-4">
                <Button
                    variant="outline"
                    onClick={() => {
                        setFilledGaps({});
                        setFeedback(null);
                        setIsSuccess(false);
                    }}
                    className="border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white"
                >
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>

                {isSuccess ? (
                    <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700 text-white">
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={checkAnswers}
                        disabled={Object.keys(filledGaps).length !== gaps.length}
                        className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                    >
                        Check Answers
                    </Button>
                )}
            </div>
        </div>
    );
}
