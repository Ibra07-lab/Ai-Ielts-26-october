import { useState, useMemo } from "react";
import { Check, X, ArrowRight, RotateCcw, GripVertical, Lightbulb, Zap, Target, BookOpen, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
// Color palette for word cards - Modernized & Muted
const WORD_COLORS = [
    { bg: "bg-slate-500", light: "bg-slate-500/10", border: "border-slate-500/20", text: "text-slate-600 dark:text-slate-400" },
    { bg: "bg-blue-500", light: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-600 dark:text-blue-400" },
    { bg: "bg-indigo-500", light: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-600 dark:text-indigo-400" },
    { bg: "bg-violet-500", light: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-600 dark:text-violet-400" },
    { bg: "bg-emerald-500", light: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400" },
    { bg: "bg-teal-500", light: "bg-teal-500/10", border: "border-teal-500/20", text: "text-teal-600 dark:text-teal-400" },
    { bg: "bg-cyan-500", light: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-600 dark:text-cyan-400" },
    { bg: "bg-amber-500", light: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-600 dark:text-amber-400" },
    { bg: "bg-rose-500", light: "bg-rose-500/10", border: "border-rose-500/20", text: "text-rose-600 dark:text-rose-400" },
    { bg: "bg-gray-500", light: "bg-gray-500/10", border: "border-gray-500/20", text: "text-gray-600 dark:text-gray-400" },
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
                    "py-5 transition-all duration-300",
                    index < (props.items?.length || 0) - 1 && "border-b border-gray-100 dark:border-white/[0.03]"
                )}>
                    <div className="leading-loose text-[15px] sm:text-base text-gray-700 dark:text-gray-300">
                        {parts[0]}
                        {/* === GAP === */}
                        <span
                            className={cn(
                                "inline-flex items-center gap-1.5 min-w-[140px] mx-1 px-4 py-1.5 rounded-xl text-center cursor-pointer transition-all duration-300 text-sm font-semibold border-2",
                                gapState === "correct" && "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
                                gapState === "incorrect" && "bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
                                gapState === "filled" && cn(color.light, color.border, color.text, "shadow-sm"),
                                gapState === "selected" && "bg-blue-500/10 border-blue-500/40 text-blue-500 dark:text-blue-400 border-dashed animate-pulse ring-4 ring-blue-500/5",
                                gapState === "empty" && "bg-gray-100/50 dark:bg-white/[0.02] border-gray-300 dark:border-white/10 text-gray-400 dark:text-gray-600 border-dashed hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors"
                            )}
                            onClick={() => handleGapClick(gapId)}
                        >
                            {gapState === "correct" && <Check className="h-4 w-4" />}
                            {gapState === "incorrect" && <X className="h-4 w-4" />}
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
                            <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full animate-in zoom-in-95 duration-300">
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
                                "inline-flex items-center gap-1.5 min-w-[120px] mx-1 px-4 py-1.5 rounded-xl text-center cursor-pointer transition-all duration-300 text-sm font-semibold border-2",
                                gapState === "correct" && "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
                                gapState === "incorrect" && "bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
                                gapState === "filled" && cn(color.light, color.border, color.text),
                                gapState === "selected" && "bg-blue-500/10 border-blue-500/40 text-blue-500 border-dashed animate-pulse ring-4 ring-blue-500/5",
                                gapState === "empty" && "bg-gray-100/50 dark:bg-white/[0.02] border-gray-300 dark:border-white/10 text-gray-400 border-dashed hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors"
                            )}
                            onClick={() => handleGapClick(gapId)}
                        >
                            {gapState === "correct" && <Check className="h-4 w-4" />}
                            {gapState === "incorrect" && <X className="h-4 w-4" />}
                            {filledBubble ? filledBubble.text : isSelected ? "Select ↓" : gap?.placeholder || "Drop Word Here"}
                        </span>
                        {hasChecked && result && !result.isCorrect && (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full ml-1 animate-in zoom-in-95">
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
        <div className="relative animate-in fade-in duration-700 space-y-6 pb-12">
            {/* Ambient background glow - Wrapped to prevent horizontal overflow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-500/5 blur-[120px] rounded-full" />
            </div>

            {/* ═══ HEADER ═══ */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <div className="p-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 dark:bg-blue-500 shadow-lg shadow-blue-500/20 flex items-center justify-center">
                            <Target className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                                Semantic Slotting
                            </h2>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{instruction}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ MAIN BENTO GRID ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LEFT — READING PASSAGE CARD */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                    <div className="bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden flex flex-col transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                        {/* Card Header */}
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-white/[0.03] flex items-center justify-between bg-white/50 dark:bg-white/[0.01]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Reading Passage</div>
                                    <div className="text-base font-bold text-gray-900 dark:text-white leading-none">
                                        {props.set_name || "Complete the Sentences"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sentences with more spacing */}
                        <div className="px-10 py-8 flex-1">
                            {isNewFormat ? renderNewFormatItems() : (
                                <div className="leading-[2.2] text-gray-700 dark:text-gray-300 text-lg">
                                    {renderParagraph()}
                                </div>
                            )}
                        </div>

                        {/* Progress Footer */}
                        <div className="px-10 pb-10 pt-2">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Question Progress</span>
                                <span className="text-xs font-black text-gray-900 dark:text-white">{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden",
                                        isSuccess ? "bg-emerald-500" : "bg-blue-500"
                                    )}
                                    style={{ width: `${progressPercent}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 w-full h-full skew-x-12 animate-[shimmer_2s_infinite]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Banner */}
                    {hasChecked && (
                        <div className={cn(
                            "p-6 rounded-[2rem] border-2 flex items-start gap-5 animate-in slide-in-from-bottom-6 duration-500 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
                            isSuccess
                                ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-500/20"
                                : "bg-amber-50/50 dark:bg-amber-900/10 border-amber-500/20"
                        )}>
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                                isSuccess ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                            )}>
                                {isSuccess ? <Check className="h-6 w-6" /> : <RotateCcw className="h-6 w-6" />}
                            </div>
                            <div className="space-y-1">
                                <h4 className={cn(
                                    "font-black text-lg tracking-tight",
                                    isSuccess ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"
                                )}>
                                    {isSuccess ? "Excellent Work!" : "Almost There!"}
                                </h4>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {feedback}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN — BENTO STACK */}
                <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                    
                    {/* 1. Stats Card (Mini Bento) */}
                    <div className="bg-white/50 dark:bg-neutral-900/20 backdrop-blur-xl rounded-[2.5rem] border border-gray-200 dark:border-white/10 p-6 shadow-lg grid grid-cols-3 gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                        <div className="flex flex-col items-center justify-center p-4 rounded-[1.75rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05]">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Words</div>
                            <div className="text-2xl font-black text-gray-900 dark:text-white tabular-nums leading-none tracking-tight">{filledCount}/{totalGaps}</div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-[1.75rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05]">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tries</div>
                            <div className="text-2xl font-black text-gray-900 dark:text-white tabular-nums leading-none tracking-tight">{attempts}</div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-[1.75rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05]">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Acc</div>
                            <div className={cn(
                                "text-2xl font-black tabular-nums leading-none tracking-tight",
                                hasChecked
                                    ? accuracy === 100 ? "text-emerald-400 dark:text-white" : accuracy >= 70 ? "text-amber-400 dark:text-white" : "text-rose-400 dark:text-white"
                                    : "text-gray-400"
                            )}>
                                {hasChecked ? `${accuracy}%` : "—"}
                            </div>
                        </div>
                    </div>

                    {/* 2. Word Queue Card */}
                    <div className="bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden flex flex-col shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                        <div className="px-8 py-5 border-b border-gray-100 dark:border-white/[0.03] flex items-center justify-between bg-white/50 dark:bg-white/[0.01]">
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Word Queue</span>
                            {selectedGapId && (
                                <Badge className="bg-blue-500 text-white font-black text-[10px] px-3 py-1 rounded-full animate-pulse shadow-lg shadow-blue-500/20 border-none">
                                    PLACE WORD
                                </Badge>
                            )}
                        </div>
                        <div className="p-6 space-y-3 max-h-[480px] overflow-y-auto custom-scrollbar">
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
                                                "w-full flex items-center gap-4 p-4 min-h-[58px] rounded-2xl border transition-all duration-300 text-left group relative outline-none",
                                                isSuccess
                                                    ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-white/5 border-transparent"
                                                    : selectedGapId
                                                        ? "bg-white dark:bg-white/[0.05] border-blue-500/30 hover:border-blue-500 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer ring-0 focus:ring-2 ring-blue-500/50"
                                                        : "bg-white dark:bg-white/[0.03] border-gray-100 dark:border-white/[0.05] hover:border-blue-500/30 hover:bg-gray-50 dark:hover:bg-white/[0.06] hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                                            )}
                                        >
                                            {/* Tactile Avatar - Muted Muti-color */}
                                            <div className={cn(
                                                "w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 transition-colors duration-300 shadow-sm",
                                                "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10",
                                                "group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-400 group-hover:shadow-lg group-hover:shadow-blue-500/20"
                                            )}>
                                                {firstLetter}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-sm text-gray-900 dark:text-white truncate tracking-tight">
                                                    {bubble.text}
                                                </div>
                                            </div>
                                            <GripVertical className="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="py-12 text-center space-y-4">
                                    <div className="w-20 h-20 rounded-[2.5rem] bg-emerald-500/10 dark:bg-emerald-500/10 flex items-center justify-center mx-auto shadow-inner border border-emerald-500/20">
                                        <Check className="h-10 w-10 text-emerald-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Well Done!</p>
                                        <p className="text-sm font-medium text-gray-400 dark:text-gray-500">All words have been placed.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. Pro Tip Bento Card */}
                    {!hasChecked && (
                        <div className="bg-amber-500/5 dark:bg-amber-500/5 backdrop-blur-md rounded-[2.5rem] border border-amber-500/20 p-6 relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
                                    <Lightbulb className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-amber-900 dark:text-amber-400 tracking-tight uppercase tracking-widest">Pro Tip</p>
                                    <p className="text-xs font-medium text-amber-800/80 dark:text-amber-400/80 leading-relaxed italic">
                                        Tap any blank gap first, then pick a word from the queue. You can fill gaps in any order!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. Action Card */}
                    <div className="flex gap-4">
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
                            className="h-16 w-16 rounded-[2rem] border-2 border-gray-100 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-400 transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                        >
                            <RotateCcw className="h-6 w-6" />
                        </Button>

                        <div className="flex-1 flex gap-4">
                            {isSuccess ? (
                                <Button
                                    onClick={onComplete}
                                    className="flex-1 h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black tracking-tight text-lg shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Continue <ArrowRight className="ml-2 h-6 w-6" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={checkAnswers}
                                    disabled={filledCount !== totalGaps}
                                    className="flex-1 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black tracking-tight text-lg shadow-xl shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:scale-100 disabled:shadow-none"
                                >
                                    <Zap className="mr-2 h-6 w-6 fill-white" /> Check Answers
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
