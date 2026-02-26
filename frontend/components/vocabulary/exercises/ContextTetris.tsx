import { useState, useMemo } from "react";
import { Check, X, ArrowRight, RotateCcw, GripVertical, Lightbulb, Zap, Target, BookOpen, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    paragraph?: string;
    gaps?: Gap[];
    bubbles?: WordBubble[];
    id?: number;
    set_name?: string;
    instruction?: string;
    word_bank?: string[];
    items?: NewFormatItem[];
    onComplete: () => void;
}

interface GapResult {
    isCorrect: boolean;
    correctWord: string;
}

// Color palette for word cards
const WORD_COLORS = [
    { bg: "bg-blue-500", light: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-200 dark:border-blue-500/20", text: "text-blue-600 dark:text-blue-400" },
    { bg: "bg-emerald-500", light: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400" },
    { bg: "bg-violet-500", light: "bg-violet-50 dark:bg-violet-500/10", border: "border-violet-200 dark:border-violet-500/20", text: "text-violet-600 dark:text-violet-400" },
    { bg: "bg-amber-500", light: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/20", text: "text-amber-600 dark:text-amber-400" },
    { bg: "bg-rose-500", light: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-200 dark:border-rose-500/20", text: "text-rose-600 dark:text-rose-400" },
    { bg: "bg-cyan-500", light: "bg-cyan-50 dark:bg-cyan-500/10", border: "border-cyan-200 dark:border-cyan-500/20", text: "text-cyan-600 dark:text-cyan-400" },
    { bg: "bg-orange-500", light: "bg-orange-50 dark:bg-orange-500/10", border: "border-orange-200 dark:border-orange-500/20", text: "text-orange-600 dark:text-orange-400" },
    { bg: "bg-pink-500", light: "bg-pink-50 dark:bg-pink-500/10", border: "border-pink-200 dark:border-pink-500/20", text: "text-pink-600 dark:text-pink-400" },
    { bg: "bg-indigo-500", light: "bg-indigo-50 dark:bg-indigo-500/10", border: "border-indigo-200 dark:border-indigo-500/20", text: "text-indigo-600 dark:text-indigo-400" },
    { bg: "bg-teal-500", light: "bg-teal-50 dark:bg-teal-500/10", border: "border-teal-200 dark:border-teal-500/20", text: "text-teal-600 dark:text-teal-400" },
];

export default function ContextTetris(props: ContextTetrisProps) {
    const { onComplete } = props;
    const isNewFormat = !!(props.word_bank && props.items);

    const { paragraph, gaps, bubbles, instruction } = useMemo(() => {
        if (isNewFormat && props.items && props.word_bank) {
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

            return {
                paragraph: "",
                gaps: internalGaps,
                bubbles: internalBubbles,
                instruction: props.instruction || "Drag the correct term to complete each sentence."
            };
        }

        return {
            paragraph: props.paragraph || "",
            gaps: props.gaps || [],
            bubbles: props.bubbles || [],
            instruction: "Drag (or click) words to complete the paragraph with the correct academic tone."
        };
    }, [isNewFormat, props.items, props.word_bank, props.paragraph, props.gaps, props.bubbles, props.instruction]);

    const [filledGaps, setFilledGaps] = useState<Record<string, string>>({});
    const [selectedGapId, setSelectedGapId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [gapResults, setGapResults] = useState<Record<string, GapResult>>({});
    const [hasChecked, setHasChecked] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const handleGapClick = (gapId: string) => {
        if (isSuccess) return;
        if (filledGaps[gapId]) {
            const newFilled = { ...filledGaps };
            delete newFilled[gapId];
            setFilledGaps(newFilled);
            setSelectedGapId(gapId);
            setFeedback(null);
            setGapResults({});
            setHasChecked(false);
        } else {
            setSelectedGapId(prev => prev === gapId ? null : gapId);
        }
    };

    const handleBubbleClick = (bubbleId: string) => {
        if (isSuccess) return;
        const targetGap = selectedGapId || gaps.find(g => !filledGaps[g.id])?.id;
        if (targetGap) {
            setFilledGaps(prev => ({ ...prev, [targetGap]: bubbleId }));
            setSelectedGapId(null);
            setFeedback(null);
            setGapResults({});
            setHasChecked(false);
        }
    };

    const checkAnswers = () => {
        let allCorrect = true;
        const results: Record<string, GapResult> = {};
        let correctCount = 0;

        for (const gap of gaps) {
            const bubbleId = filledGaps[gap.id];
            if (!bubbleId) {
                setFeedback("Please fill all gaps first.");
                return;
            }
            const correctBubble = bubbles.find(b => b.id === gap.correctWordId);
            const isCorrect = bubbleId === gap.correctWordId;
            results[gap.id] = { isCorrect, correctWord: correctBubble?.text || "" };
            if (isCorrect) correctCount++;
            else allCorrect = false;
        }

        setGapResults(results);
        setHasChecked(true);
        setAttempts(prev => prev + 1);

        if (allCorrect) {
            setIsSuccess(true);
            setFeedback(`Perfect! All ${gaps.length} answers are correct!`);
        } else {
            setFeedback(`${correctCount} of ${gaps.length} correct. Fix the red answers and try again.`);
            setIsSuccess(false);
        }
    };

    const availableBubbles = bubbles.filter(b => !Object.values(filledGaps).includes(b.id));
    const filledCount = Object.keys(filledGaps).length;
    const totalGaps = gaps.length;
    const correctCount = Object.values(gapResults).filter(r => r.isCorrect).length;
    const accuracy = hasChecked ? Math.round((correctCount / totalGaps) * 100) : 100;
    const progressPercent = (filledCount / totalGaps) * 100;

    const getGapStyle = (gapId: string, filledBubble: WordBubble | undefined, isSelected: boolean) => {
        const result = gapResults[gapId];
        if (hasChecked && result && filledBubble) {
            if (result.isCorrect) return "correct";
            return "incorrect";
        }
        if (filledBubble) return "filled";
        if (isSelected) return "selected";
        return "empty";
    };

    // Render sentences (new format)
    const renderNewFormatItems = () => {
        if (!props.items) return null;
        return props.items.map((item, index) => {
            const gapId = `gap-${index + 1}`;
            const filledBubbleId = filledGaps[gapId];
            const filledBubble = bubbles.find(b => b.id === filledBubbleId);
            const isSelected = selectedGapId === gapId;
            const parts = item.gap_sentence.split(/___/);
            const result = gapResults[gapId];
            const gapState = getGapStyle(gapId, filledBubble, isSelected);
            const bubbleIndex = filledBubble ? bubbles.indexOf(filledBubble) : 0;
            const color = WORD_COLORS[bubbleIndex % WORD_COLORS.length];

            return (
                <div key={item.item_id} className={cn(
                    "py-4 transition-all duration-300",
                    index < (props.items?.length || 0) - 1 && "border-b border-gray-100 dark:border-white/5"
                )}>
                    <div className="leading-relaxed text-[15px] sm:text-base text-gray-700 dark:text-gray-300">
                        {parts[0]}
                        {/* === GAP === */}
                        <span
                            className={cn(
                                "inline-flex items-center gap-1.5 min-w-[130px] mx-1 px-3 py-1 rounded-lg text-center cursor-pointer transition-all duration-200 text-sm font-medium border-2",
                                gapState === "correct" && "bg-emerald-50 dark:bg-emerald-500/15 border-emerald-400 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300",
                                gapState === "incorrect" && "bg-red-50 dark:bg-red-500/15 border-red-400 dark:border-red-500/40 text-red-600 dark:text-red-400",
                                gapState === "filled" && cn(color.light, color.border, color.text),
                                gapState === "selected" && "bg-blue-50 dark:bg-blue-500/10 border-blue-400 dark:border-blue-500/40 text-blue-500 dark:text-blue-400 border-dashed animate-pulse",
                                gapState === "empty" && "bg-gray-50 dark:bg-white/5 border-gray-300 dark:border-white/15 text-gray-400 dark:text-gray-500 border-dashed hover:border-blue-300 dark:hover:border-blue-500/30 hover:bg-blue-50/50 dark:hover:bg-blue-500/5"
                            )}
                            onClick={() => handleGapClick(gapId)}
                        >
                            {gapState === "correct" && <Check className="h-3.5 w-3.5" />}
                            {gapState === "incorrect" && <X className="h-3.5 w-3.5" />}
                            {filledBubble
                                ? filledBubble.text
                                : isSelected
                                    ? "Select Word ↓"
                                    : "Drop Word Here"
                            }
                        </span>
                        {parts[1] || ""}
                        {/* Correct answer hint */}
                        {hasChecked && result && !result.isCorrect && (
                            <span className="ml-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full animate-in fade-in duration-300">
                                ✓ {result.correctWord}
                            </span>
                        )}
                    </div>
                </div>
            );
        });
    };

    // Legacy paragraph renderer
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
                const isSelected = selectedGapId === gapId;
                const result = gapResults[gapId];
                const gapState = getGapStyle(gapId, filledBubble, isSelected);
                const bubbleIndex = filledBubble ? bubbles.indexOf(filledBubble) : 0;
                const color = WORD_COLORS[bubbleIndex % WORD_COLORS.length];

                return (
                    <span key={index}>
                        <span
                            className={cn(
                                "inline-flex items-center gap-1.5 min-w-[110px] mx-1 px-3 py-1 rounded-lg text-center cursor-pointer transition-all duration-200 text-sm font-medium border-2",
                                gapState === "correct" && "bg-emerald-50 dark:bg-emerald-500/15 border-emerald-400 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300",
                                gapState === "incorrect" && "bg-red-50 dark:bg-red-500/15 border-red-400 dark:border-red-500/40 text-red-600 dark:text-red-400",
                                gapState === "filled" && cn(color.light, color.border, color.text),
                                gapState === "selected" && "bg-blue-50 dark:bg-blue-500/10 border-blue-400 dark:border-blue-500/40 text-blue-500 border-dashed animate-pulse",
                                gapState === "empty" && "bg-gray-50 dark:bg-white/5 border-gray-300 dark:border-white/15 text-gray-400 border-dashed hover:border-blue-300 hover:bg-blue-50/50"
                            )}
                            onClick={() => handleGapClick(gapId)}
                        >
                            {gapState === "correct" && <Check className="h-3.5 w-3.5" />}
                            {gapState === "incorrect" && <X className="h-3.5 w-3.5" />}
                            {filledBubble ? filledBubble.text : isSelected ? "Select ↓" : gap?.placeholder || "Drop Word Here"}
                        </span>
                        {hasChecked && result && !result.isCorrect && (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full ml-1">
                                ✓ {result.correctWord}
                            </span>
                        )}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="animate-in fade-in duration-500 space-y-3">
            {/* ═══ HEADER ═══ */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                            <Target className="h-4 w-4 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Semantic Slotting
                        </h2>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{instruction}</p>
                </div>
                {/* Score Bar */}
                <div className="flex items-center gap-0 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden flex-shrink-0">
                    <div className="px-3 py-2 text-center border-r border-gray-100 dark:border-white/5">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Words</div>
                        <div className="text-base font-bold text-gray-900 dark:text-white tabular-nums">{filledCount}/{totalGaps}</div>
                    </div>
                    <div className="px-3 py-2 text-center border-r border-gray-100 dark:border-white/5">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Attempts</div>
                        <div className="text-base font-bold text-gray-900 dark:text-white tabular-nums">{attempts}</div>
                    </div>
                    <div className="px-3 py-2 text-center">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Accuracy</div>
                        <div className={cn(
                            "text-base font-bold tabular-nums",
                            hasChecked
                                ? accuracy === 100 ? "text-emerald-600 dark:text-emerald-400" : accuracy >= 70 ? "text-amber-600 dark:text-amber-400" : "text-red-500 dark:text-red-400"
                                : "text-gray-400"
                        )}>
                            {hasChecked ? `${accuracy}%` : "—"}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ MAIN TWO-COLUMN LAYOUT ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">

                {/* LEFT — READING PASSAGE */}
                <div className="lg:col-span-7 xl:col-span-8">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
                        {/* Card Header */}
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Reading Passage</div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {props.set_name || "Complete the Sentences"}
                                </div>
                            </div>
                        </div>
                        {/* Sentences */}
                        <div className="px-4 py-3">
                            {isNewFormat ? renderNewFormatItems() : (
                                <div className="leading-[2] text-gray-700 dark:text-gray-300">
                                    {renderParagraph()}
                                </div>
                            )}
                        </div>
                        {/* Progress Bar */}
                        <div className="px-4 pb-3">
                            <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-500",
                                        isSuccess ? "bg-emerald-500" : "bg-blue-500"
                                    )}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ═══ FEEDBACK BANNER ═══ */}
                    {hasChecked && (
                        <div className={cn(
                            "mt-3 p-3 rounded-lg border flex items-start gap-2.5 animate-in slide-in-from-bottom-4 duration-400",
                            isSuccess
                                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-500/30"
                                : "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-500/20"
                        )}>
                            <div className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                isSuccess ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-amber-100 dark:bg-amber-500/20"
                            )}>
                                {isSuccess
                                    ? <Check className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
                                    : <X className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                                }
                            </div>
                            <div>
                                <p className={cn(
                                    "font-bold text-sm",
                                    isSuccess ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"
                                )}>
                                    {feedback}
                                </p>
                                {!isSuccess && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Tap any <span className="text-red-500 font-semibold">red</span> gap to change it, then check again.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT — WORD QUEUE + ACTIONS */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-3">
                    {/* Word Queue */}
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Word Queue</span>
                            {selectedGapId && (
                                <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full animate-pulse">
                                    SELECT ONE
                                </span>
                            )}
                        </div>
                        <div className="p-2 space-y-1.5 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {availableBubbles.length > 0 ? (
                                availableBubbles.map((bubble) => {
                                    const idx = bubbles.indexOf(bubble);
                                    const color = WORD_COLORS[idx % WORD_COLORS.length];
                                    const firstLetter = bubble.text.charAt(0).toUpperCase();

                                    return (
                                        <button
                                            key={bubble.id}
                                            onClick={() => handleBubbleClick(bubble.id)}
                                            disabled={isSuccess}
                                            className={cn(
                                                "w-full flex items-center gap-2.5 p-2.5 rounded-lg border transition-all duration-200 text-left group",
                                                isSuccess
                                                    ? "opacity-40 cursor-not-allowed bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                                    : selectedGapId
                                                        ? cn(color.light, color.border, "hover:shadow-md hover:-translate-y-0.5 cursor-pointer")
                                                        : "bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                                            )}
                                        >
                                            {/* Letter avatar */}
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0",
                                                color.bg
                                            )}>
                                                {firstLetter}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                                    {bubble.text}
                                                </div>
                                            </div>
                                            <GripVertical className="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="py-6 text-center">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                                        <Check className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">All words placed</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Check your answers below</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pro Tip */}
                    {!hasChecked && (
                        <div className="bg-amber-50 dark:bg-amber-500/5 rounded-lg border border-amber-200 dark:border-amber-500/15 p-3">
                            <div className="flex items-start gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Lightbulb className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-amber-700 dark:text-amber-300">Pro Tip</p>
                                    <p className="text-xs text-amber-600/80 dark:text-amber-400/70 mt-0.5 leading-relaxed">
                                        Tap any blank gap first, then pick a word from the queue. You can fill gaps in any order!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setFilledGaps({});
                                setFeedback(null);
                                setIsSuccess(false);
                                setSelectedGapId(null);
                                setGapResults({});
                                setHasChecked(false);
                            }}
                            className="flex-1 h-10 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 rounded-lg"
                        >
                            <RotateCcw className="mr-2 h-4 w-4" /> Reset
                        </Button>

                        {isSuccess ? (
                            <Button
                                onClick={onComplete}
                                className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-lg shadow-emerald-500/20"
                            >
                                Continue <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={checkAnswers}
                                disabled={filledCount !== totalGaps}
                                className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:shadow-none"
                            >
                                <Zap className="mr-2 h-4 w-4" /> Check
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
