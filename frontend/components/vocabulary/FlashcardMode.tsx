import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { X, Volume2, ThumbsDown, ThumbsUp, RotateCcw } from "lucide-react";
import { cn, speakText } from "@/lib/utils";
import { WordData } from "@/data/vocabulary/types";
import { useVocabulary } from "@/contexts/VocabularyContext";
import { SRSGrade } from "@/lib/vocabulary/srs-engine";

interface FlashcardModeProps {
    words: WordData[];
    onClose: () => void;
    onComplete: () => void;
}

// Topic color accents for the tracker
const topicColors: Record<string, { bg: string; text: string; bar: string }> = {
    "Business & Work": { bg: "bg-indigo-100 dark:bg-indigo-500/20", text: "text-indigo-600 dark:text-indigo-400", bar: "bg-indigo-500" },
    "Environment": { bg: "bg-emerald-100 dark:bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500" },
    "Education": { bg: "bg-amber-100 dark:bg-amber-500/20", text: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500" },
    "Speaking Part 1": { bg: "bg-sky-100 dark:bg-sky-500/20", text: "text-sky-600 dark:text-sky-400", bar: "bg-sky-500" },
    "Speaking Part 2": { bg: "bg-teal-100 dark:bg-teal-500/20", text: "text-teal-600 dark:text-teal-400", bar: "bg-teal-500" },
    "Speaking Part 3": { bg: "bg-rose-100 dark:bg-rose-500/20", text: "text-rose-600 dark:text-rose-400", bar: "bg-rose-500" },
    "Shopping": { bg: "bg-orange-100 dark:bg-orange-500/20", text: "text-orange-600 dark:text-orange-400", bar: "bg-orange-500" },
};
const defaultTopicColor = { bg: "bg-slate-100 dark:bg-slate-700", text: "text-slate-600 dark:text-slate-400", bar: "bg-slate-500" };

export default function FlashcardMode({ words, onClose, onComplete }: FlashcardModeProps) {
    const { markWordAsReviewed } = useVocabulary();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionStats, setSessionStats] = useState({ known: 0, unknown: 0 });
    const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
    const [isExiting, setIsExiting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    // Per-topic tracking: { topicName: { total, correct } }
    const [topicStats, setTopicStats] = useState<Record<string, { total: number; correct: number }>>({});

    // Build topic breakdown from words
    const topicBreakdown = useMemo(() => {
        const breakdown: Record<string, number> = {};
        words.forEach(w => {
            const topic = w.topic || "Other";
            breakdown[topic] = (breakdown[topic] || 0) + 1;
        });
        return breakdown;
    }, [words]);

    // Swipe tracking
    const touchStartX = useRef(0);
    const touchCurrentX = useRef(0);
    const [dragOffset, setDragOffset] = useState(0);

    const currentWord = words[currentIndex];
    const progressPercent = ((currentIndex) / words.length) * 100;

    useEffect(() => {
        setIsFlipped(false);
        setSwipeDirection(null);
        setIsExiting(false);
        setDragOffset(0);
    }, [currentIndex]);

    const handleAnswer = useCallback((known: boolean) => {
        if (isExiting) return;

        setSwipeDirection(known ? "right" : "left");
        setIsExiting(true);

        // Update SRS
        markWordAsReviewed(
            currentWord.id,
            known ? SRSGrade.GOOD : SRSGrade.AGAIN
        );

        // Update session stats
        setSessionStats(prev => ({
            known: prev.known + (known ? 1 : 0),
            unknown: prev.unknown + (known ? 0 : 1),
        }));

        // Update per-topic stats
        const topic = currentWord.topic || "Other";
        setTopicStats(prev => ({
            ...prev,
            [topic]: {
                total: (prev[topic]?.total || 0) + 1,
                correct: (prev[topic]?.correct || 0) + (known ? 1 : 0),
            }
        }));

        // Move to next card after animation
        setTimeout(() => {
            if (currentIndex >= words.length - 1) {
                setIsComplete(true);
            } else {
                setCurrentIndex(prev => prev + 1);
            }
        }, 300);
    }, [currentIndex, currentWord, isExiting, markWordAsReviewed, words.length]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isComplete) return;

            if (!isFlipped) {
                if (e.code === "Space" || e.code === "Enter") {
                    e.preventDefault();
                    setIsFlipped(true);
                }
                return;
            }

            if (e.key === "ArrowLeft" || e.key === "1") {
                handleAnswer(false);
            } else if (e.key === "ArrowRight" || e.key === "2") {
                handleAnswer(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isFlipped, isComplete, handleAnswer]);

    // Touch handlers for swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!isFlipped) return;
        touchStartX.current = e.touches[0].clientX;
        touchCurrentX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isFlipped || isExiting) return;
        touchCurrentX.current = e.touches[0].clientX;
        const diff = touchCurrentX.current - touchStartX.current;
        setDragOffset(diff);
    };

    const handleTouchEnd = () => {
        if (!isFlipped || isExiting) return;
        const diff = touchCurrentX.current - touchStartX.current;

        if (Math.abs(diff) > 80) {
            handleAnswer(diff > 0);
        } else {
            setDragOffset(0);
        }
    };

    const playAudio = (e: React.MouseEvent) => {
        e.stopPropagation();
        speakText(currentWord.word);
    };

    // Completion screen
    if (isComplete) {
        const total = sessionStats.known + sessionStats.unknown;
        const percent = total > 0 ? Math.round((sessionStats.known / total) * 100) : 0;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-10 text-center opacity-0 animate-[fadeSlideUp_0.4s_ease-out_forwards] max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Session Complete!</h2>
                    <p className="text-slate-400 dark:text-slate-500 mb-8">You reviewed {total} words</p>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 mb-8">
                        <div className="text-center">
                            <div className="text-3xl font-black text-emerald-500">{sessionStats.known}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Known</div>
                        </div>
                        <div className="w-px bg-slate-200 dark:bg-white/10" />
                        <div className="text-center">
                            <div className="text-3xl font-black text-rose-500">{sessionStats.unknown}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">To Review</div>
                        </div>
                        <div className="w-px bg-slate-200 dark:bg-white/10" />
                        <div className="text-center">
                            <div className="text-3xl font-black text-sky-500">{percent}%</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Score</div>
                        </div>
                    </div>

                    {/* Per-topic breakdown */}
                    <div className="text-left mb-8">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Topic Breakdown</span>
                        <div className="space-y-3">
                            {Object.entries(topicStats).map(([topic, stats]) => {
                                const color = topicColors[topic] || defaultTopicColor;
                                const topicPercent = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

                                return (
                                    <div key={topic}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className={cn("text-xs font-bold", color.text)}>{topic}</span>
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                                {stats.correct}/{stats.total}
                                                <span className="text-slate-300 dark:text-slate-600 ml-1">({topicPercent}%)</span>
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-500", color.bar)}
                                                style={{ width: `${topicPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onComplete}
                            className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                        >
                            Done
                        </button>
                        <button
                            onClick={() => {
                                setCurrentIndex(0);
                                setIsFlipped(false);
                                setIsComplete(false);
                                setSessionStats({ known: 0, unknown: 0 });
                                setTopicStats({});
                            }}
                            className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg hover:shadow-sky-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" /> Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentWord) return null;

    // Determine swipe visual feedback
    const showKnown = dragOffset > 40;
    const showUnknown = dragOffset < -40;
    const currentTopic = currentWord.topic || "Other";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {currentIndex + 1}
                            <span className="text-slate-400 dark:text-slate-500 font-medium"> / {words.length}</span>
                        </span>
                    </div>

                    {/* Session stats mini */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                            <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400">{sessionStats.known}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                            <ThumbsDown className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-rose-600 dark:text-rose-400">{sessionStats.unknown}</span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-slate-100 dark:bg-white/5 w-full">
                    <div
                        className="h-full bg-gradient-to-r from-sky-400 to-blue-600 transition-all duration-500 rounded-r-full"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* Topic tracker strip */}
                <div className="px-6 py-2.5 border-b border-slate-50 dark:border-white/5 flex items-center gap-3 overflow-x-auto custom-scrollbar">
                    {Object.entries(topicBreakdown).map(([topic]) => {
                        const color = topicColors[topic] || defaultTopicColor;
                        const stats = topicStats[topic];
                        const isActive = currentTopic === topic;

                        return (
                            <div
                                key={topic}
                                className={cn(
                                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 transition-all",
                                    isActive
                                        ? cn(color.bg, color.text, "ring-1 ring-current/20")
                                        : "text-slate-400 dark:text-slate-500"
                                )}
                            >
                                <span>{topic}</span>
                                {stats && (
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded text-[9px] font-black",
                                        stats.correct === stats.total && stats.total > 0
                                            ? "bg-emerald-500 text-white"
                                            : "bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                                    )}>
                                        {stats.correct}/{stats.total}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Card — clicking the card flips it */}
                <div
                    className="flex-1 relative min-h-[400px] overflow-hidden select-none cursor-pointer"
                    onClick={() => { if (!isFlipped && !isExiting) setIsFlipped(true); }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Swipe feedback overlays */}
                    <div className={cn(
                        "absolute inset-0 bg-emerald-500/10 z-10 flex items-center justify-end pr-12 transition-opacity duration-200 pointer-events-none",
                        showKnown ? "opacity-100" : "opacity-0"
                    )}>
                        <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">I KNOW ✓</div>
                    </div>
                    <div className={cn(
                        "absolute inset-0 bg-rose-500/10 z-10 flex items-center justify-start pl-12 transition-opacity duration-200 pointer-events-none",
                        showUnknown ? "opacity-100" : "opacity-0"
                    )}>
                        <div className="bg-rose-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">DON'T KNOW ✗</div>
                    </div>

                    <div
                        className={cn(
                            "absolute inset-0 flex flex-col items-center justify-center p-8 transition-all",
                            isExiting && swipeDirection === "right" && "translate-x-full opacity-0 duration-300",
                            isExiting && swipeDirection === "left" && "-translate-x-full opacity-0 duration-300",
                            !isExiting && "duration-150",
                        )}
                        style={!isExiting ? { transform: `translateX(${dragOffset}px)` } : undefined}
                    >
                        {/* Front — tap to reveal */}
                        {!isFlipped ? (
                            <div className="text-center">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6 block">
                                    What does this mean?
                                </span>
                                <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                                    {currentWord.word}
                                </h2>

                                <button
                                    onClick={playAudio}
                                    className="p-3.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors mb-6"
                                >
                                    <Volume2 className="w-7 h-7" />
                                </button>


                            </div>
                        ) : (
                            /* Back — definition + answer buttons */
                            <div className="w-full max-w-lg mx-auto space-y-5" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-center gap-4">
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">{currentWord.word}</h2>
                                    <button onClick={playAudio} className="text-slate-400 hover:text-sky-600 transition-colors">
                                        <Volume2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {currentWord.pronunciation && (
                                    <p className="text-center text-sm text-slate-400 dark:text-slate-500 italic">
                                        {currentWord.partOfSpeech} / {currentWord.pronunciation} /
                                    </p>
                                )}

                                <div className="bg-sky-50/80 dark:bg-sky-500/10 p-5 rounded-2xl border border-sky-100 dark:border-sky-500/20">
                                    <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-medium text-center">
                                        {currentWord.definition}
                                    </p>
                                </div>

                                {currentWord.exampleSentence && (
                                    <p className="text-slate-500 dark:text-slate-400 italic text-center text-sm leading-relaxed">
                                        "{currentWord.exampleSentence}"
                                    </p>
                                )}

                                {/* Know / Don't Know buttons */}
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <button
                                        onClick={() => handleAnswer(false)}
                                        className="flex flex-col items-center gap-2 py-4 rounded-2xl border-2 border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        <ThumbsDown className="w-6 h-6" />
                                        <span className="text-sm font-bold">Don't Know</span>
                                    </button>

                                    <button
                                        onClick={() => handleAnswer(true)}
                                        className="flex flex-col items-center gap-2 py-4 rounded-2xl border-2 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        <ThumbsUp className="w-6 h-6" />
                                        <span className="text-sm font-bold">I Know</span>

                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
