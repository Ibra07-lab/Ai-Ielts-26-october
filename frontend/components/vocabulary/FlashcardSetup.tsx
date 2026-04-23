import { useState, useMemo } from "react";
import { X, Check, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Topic, WordData } from "@/data/vocabulary/types";
import { getWordsByTopicId } from "@/data/vocabulary";

interface FlashcardSetupProps {
    topics: Topic[];
    onStart: (words: WordData[]) => void;
    onClose: () => void;
}

const WORD_COUNT_OPTIONS = [10, 20, 30, 50] as const;

// Per-topic colors matching TopicCard palettes
const topicAccent: Record<string, { bg: string; border: string; check: string }> = {
    "Business & Work": { bg: "bg-indigo-100 dark:bg-indigo-500/20", border: "border-indigo-300 dark:border-indigo-500/50", check: "text-indigo-600" },
    "Environment": { bg: "bg-emerald-100 dark:bg-emerald-500/20", border: "border-emerald-300 dark:border-emerald-500/50", check: "text-emerald-600" },
    "Education": { bg: "bg-amber-100 dark:bg-amber-500/20", border: "border-amber-300 dark:border-amber-500/50", check: "text-amber-600" },
    "Speaking Part 1": { bg: "bg-sky-100 dark:bg-sky-500/20", border: "border-sky-300 dark:border-sky-500/50", check: "text-sky-600" },
    "Speaking Part 2": { bg: "bg-teal-100 dark:bg-teal-500/20", border: "border-teal-300 dark:border-teal-500/50", check: "text-teal-600" },
    "Speaking Part 3": { bg: "bg-rose-100 dark:bg-rose-500/20", border: "border-rose-300 dark:border-rose-500/50", check: "text-rose-600" },
    "Shopping": { bg: "bg-orange-100 dark:bg-orange-500/20", border: "border-orange-300 dark:border-orange-500/50", check: "text-orange-600" },
};

const defaultAccent = { bg: "bg-slate-100 dark:bg-slate-700", border: "border-slate-300 dark:border-slate-600", check: "text-slate-600" };

export default function FlashcardSetup({ topics, onStart, onClose }: FlashcardSetupProps) {
    const [selectedTopicIds, setSelectedTopicIds] = useState<Set<number>>(new Set());
    const [wordCount, setWordCount] = useState<number>(20);

    const toggleTopic = (id: number) => {
        setSelectedTopicIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const selectAll = () => {
        if (selectedTopicIds.size === topics.length) {
            setSelectedTopicIds(new Set());
        } else {
            setSelectedTopicIds(new Set(topics.map(t => t.id)));
        }
    };

    // Get available words from selected topics
    const availableWords = useMemo(() => {
        const words: WordData[] = [];
        selectedTopicIds.forEach(id => {
            words.push(...getWordsByTopicId(id));
        });
        return words;
    }, [selectedTopicIds]);

    const handleStart = () => {
        if (availableWords.length === 0) return;

        // Shuffle and slice to requested count
        const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(wordCount, shuffled.length));
        onStart(selected);
    };

    const actualCount = Math.min(wordCount, availableWords.length);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
            <div
                className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden opacity-0 animate-[fadeSlideUp_0.35s_ease-out_forwards]"
            >
                {/* Header */}
                <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-lg">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Flashcards</h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500">Choose topics & start practicing</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Topics */}
                <div className="px-8 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Select Topics</span>
                        <button
                            onClick={selectAll}
                            className="text-[10px] font-bold text-sky-500 hover:text-sky-600 uppercase tracking-widest transition-colors"
                        >
                            {selectedTopicIds.size === topics.length ? "Deselect All" : "Select All"}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        {topics.map((topic) => {
                            const isSelected = selectedTopicIds.has(topic.id);
                            const accent = topicAccent[topic.name] || defaultAccent;

                            return (
                                <button
                                    key={topic.id}
                                    onClick={() => toggleTopic(topic.id)}
                                    className={cn(
                                        "relative flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 text-left",
                                        isSelected
                                            ? cn(accent.bg, accent.border, "shadow-sm")
                                            : "bg-slate-50 dark:bg-white/5 border-transparent hover:border-slate-200 dark:hover:border-white/10"
                                    )}
                                >
                                    <span className="text-2xl">{topic.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <span className={cn(
                                            "text-sm font-bold block truncate",
                                            isSelected ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                                        )}>
                                            {topic.name}
                                        </span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{topic.wordsCount} words</span>
                                    </div>
                                    {isSelected && (
                                        <Check className={cn("w-4 h-4 shrink-0", accent.check)} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Word Count */}
                <div className="px-8 py-4">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3">
                        How many words?
                    </span>
                    <div className="flex gap-2">
                        {WORD_COUNT_OPTIONS.map((count) => (
                            <button
                                key={count}
                                onClick={() => setWordCount(count)}
                                className={cn(
                                    "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border-2",
                                    wordCount === count
                                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg"
                                        : "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-white/10"
                                )}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Start Button */}
                <div className="px-8 pb-8 pt-2">
                    <button
                        onClick={handleStart}
                        disabled={selectedTopicIds.size === 0}
                        className={cn(
                            "w-full py-4 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg",
                            selectedTopicIds.size > 0
                                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0"
                                : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none"
                        )}
                    >
                        {selectedTopicIds.size === 0
                            ? "Select at least one topic"
                            : `Start with ${actualCount} words`
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
