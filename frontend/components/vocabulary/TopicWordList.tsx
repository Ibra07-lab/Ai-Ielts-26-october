import { useState, useMemo } from "react";
import { Play, BookOpen, MessageSquare, Mic, Layers, ArrowRight, ChevronDown, ChevronUp, PenTool, ArrowLeftRight, Link2, Search, Filter, CheckCircle2, Volume2, Heart, ArrowLeft, Quote, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { WordData } from "@/data/vocabulary/types";

interface TopicWordListProps {
    topicName: string;
    words: WordData[];
    onStartLearning: () => void;
    onStartExercise: (type: "synonym" | "tetris" | "speak") => void;
    onBack: () => void;
}

// Type badge color mapping - Darkened text for better contrast
const typeBadgeColors: Record<string, string> = {
    academic: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20",
    phrasal_verb: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/20",
    idiom: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/20",
};

const typeLabels: Record<string, string> = {
    academic: "Academic",
    phrasal_verb: "Phrasal Verb",
    idiom: "Idiom",
};

export default function TopicWordList({ topicName, words, onStartLearning, onStartExercise, onBack }: TopicWordListProps) {
    const [selectedWordId, setSelectedWordId] = useState<number | null>(words[0]?.id || null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "speaking" | "writing">("all");
    const [bookmarkedWords, setBookmarkedWords] = useState<Set<number>>(new Set());

    const toggleBookmark = (e: React.MouseEvent, wordId: number) => {
        e.stopPropagation();
        setBookmarkedWords(prev => {
            const next = new Set(prev);
            if (next.has(wordId)) {
                next.delete(wordId);
            } else {
                next.add(wordId);
            }
            return next;
        });
    };

    const playAudio = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-GB';
        window.speechSynthesis.speak(utterance);
    };

    const filteredWords = useMemo(() => {
        return words.filter(word => {
            const matchesSearch = word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                word.definition.toLowerCase().includes(searchQuery.toLowerCase());

            let matchesFilter = true;
            if (filterStatus === "speaking") matchesFilter = !!word.speakingExample;
            else if (filterStatus === "writing") matchesFilter = !!word.writingExample;

            return matchesSearch && matchesFilter;
        });
    }, [words, searchQuery, filterStatus]);

    // Update selected word if the list changes or filter causes current selection to disappear
    // But try to keep selection if possible
    const activeWord = words.find(w => w.id === selectedWordId) || filteredWords[0];

    const hasWritingWords = useMemo(() => words.some(w => !!w.writingExample), [words]);
    const hasSpeakingWords = useMemo(() => words.some(w => !!w.speakingExample), [words]);

    return (
        <div className="w-full h-full flex flex-col space-y-2">
            <div className="flex items-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white group -ml-2 h-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Topics
                </Button>
            </div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                {topicName}
            </h1>

            {/* Master-Detail Layout */}
            <div className="grid grid-cols-12 gap-8 h-full">
                {/* Left Sidebar: Word List */}
                <div className="col-span-4 flex flex-col bg-white dark:bg-card rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
                    <div className="p-3 border-b border-gray-100 dark:border-white/5 sticky top-0 bg-white/95 dark:bg-card/95 backdrop-blur z-10 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <BookOpen className="h-4 w-4" /> Word List
                            </div>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300">
                                {filteredWords.length}
                            </Badge>
                        </div>

                        {/* Filter Tabs - Only show if there's a mix of speaking and writing words */}
                        {hasWritingWords && hasSpeakingWords && (
                            <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-lg">
                                {(["all", "speaking", "writing"] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setFilterStatus(tab)}
                                        className={cn(
                                            "flex-1 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                                            filterStatus === tab
                                                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                        {filteredWords.map((word) => (
                            <div
                                key={word.id}
                                onClick={() => setSelectedWordId(word.id)}
                                className={cn(
                                    "p-4 rounded-xl cursor-pointer transition-all duration-200 group border text-left",
                                    selectedWordId === word.id
                                        ? "bg-blue-50/80 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 shadow-sm"
                                        : "bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-200 dark:hover:border-white/10"
                                )}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={cn(
                                        "font-bold text-lg font-serif transition-colors",
                                        selectedWordId === word.id
                                            ? "text-blue-700 dark:text-blue-400"
                                            : "text-gray-900 dark:text-white"
                                    )}>
                                        {word.word}
                                    </h3>
                                    {bookmarkedWords.has(word.id) && (
                                        <Heart className="h-3 w-3 text-rose-500 fill-current" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                    {word.definition}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {word.type && (
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide",
                                            word.type === 'phrasal_verb' ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300" :
                                                word.type === 'idiom' ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300" :
                                                    "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                                        )}>
                                            {typeLabels[word.type]}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Word Detail */}
                <div className="col-span-8 overflow-y-auto custom-scrollbar pr-2 pb-8">
                    {activeWord ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Word Card */}
                            <div className="bg-white dark:bg-card rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden relative">
                                {/* Decorative blob */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-800/50 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />

                                <div className="p-6 relative z-10">
                                    {/* Header Row */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
                                                {activeWord.word}
                                            </h2>
                                            <button
                                                onClick={() => playAudio(activeWord.word)}
                                                className="p-3 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                                            >
                                                <Volume2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => toggleBookmark(e, activeWord.id)}
                                                className={cn(
                                                    "p-2 rounded-full transition-colors",
                                                    bookmarkedWords.has(activeWord.id)
                                                        ? "text-rose-500 bg-rose-50 dark:bg-rose-500/10"
                                                        : "text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                                                )}
                                            >
                                                <Heart className={cn("h-6 w-6", bookmarkedWords.has(activeWord.id) && "fill-current")} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                                                <MoreHorizontal className="h-6 w-6" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex gap-3 mb-6">
                                        <Badge variant="secondary" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 hover:bg-purple-200">
                                            {typeLabels[activeWord.type || "academic"]}
                                        </Badge>

                                        <Badge variant="outline" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 border-gray-200 dark:border-white/10">
                                            {topicName}
                                        </Badge>
                                    </div>

                                    {/* Definition */}
                                    <div className="mb-6">
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Definition</div>
                                        <p className="text-2xl text-gray-900 dark:text-gray-100 font-serif leading-relaxed">
                                            {activeWord.definition}
                                        </p>
                                    </div>

                                    {/* Example Usage */}
                                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-white/5 mb-6">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                            <Quote className="h-3 w-3" /> Example Usage
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-lg text-gray-700 dark:text-gray-300 font-serif italic">
                                                "{activeWord.exampleSentence.split(new RegExp(`(${activeWord.word})`, 'gi')).map((part, i) =>
                                                    part.toLowerCase() === activeWord.word.toLowerCase()
                                                        ? <span key={i} className="text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-500/10 px-1 rounded">{part}</span>
                                                        : part
                                                )}"
                                            </p>
                                        </div>
                                        {activeWord.speakingExample && activeWord.speakingExample !== activeWord.exampleSentence && (
                                            <div className="space-y-2 mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                                                <div className="flex items-center gap-2 text-xs font-bold text-purple-500 uppercase tracking-widest">
                                                    <Mic className="h-3 w-3" /> Speaking Example
                                                </div>
                                                <p className="text-lg text-gray-700 dark:text-gray-300 font-serif italic">
                                                    "{activeWord.speakingExample.split(new RegExp(`(${activeWord.word})`, 'gi')).map((part, i) =>
                                                        part.toLowerCase() === activeWord.word.toLowerCase()
                                                            ? <span key={i} className="text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-500/10 px-1 rounded">{part}</span>
                                                            : part
                                                    )}"
                                                </p>
                                            </div>
                                        )}
                                        {activeWord.writingExample && activeWord.writingExample !== activeWord.exampleSentence && (
                                            <div className="space-y-2 mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                                                <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest">
                                                    <PenTool className="h-3 w-3" /> Writing Example
                                                </div>
                                                <p className="text-lg text-gray-700 dark:text-gray-300 font-serif italic">
                                                    "{activeWord.writingExample.split(new RegExp(`(${activeWord.word})`, 'gi')).map((part, i) =>
                                                        part.toLowerCase() === activeWord.word.toLowerCase()
                                                            ? <span key={i} className="text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-500/10 px-1 rounded">{part}</span>
                                                            : part
                                                    )}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Synonyms & Collocations */}
                                    <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
                                        {activeWord.synonyms && activeWord.synonyms.length > 0 && (
                                            <div>
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Synonyms</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {activeWord.synonyms.map((syn, i) => (
                                                        <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-white/10">
                                                            {syn.word}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {activeWord.collocations && activeWord.collocations.length > 0 && (
                                            <div>
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Collocations</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {activeWord.collocations.map((col, i) => (
                                                        <span key={i} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-lg">
                                                            ~ {col.replace(activeWord.word, "").trim() || col}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Exercise Hub */}
                            <div className="bg-white dark:bg-card rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Exercise Hub</h3>
                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                                        3 Available
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <button
                                        onClick={() => onStartExercise("flashcards" as any)}
                                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-amber-50 dark:hover:bg-amber-500/10 border border-transparent hover:border-amber-200 dark:hover:border-amber-500/20 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                                            <Layers className="h-4 w-4" />
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-white mb-0.5 text-sm">Flashcards</span>
                                        <span className="text-[10px] text-gray-500">Swipe to verify</span>
                                    </button>
                                    <button
                                        onClick={() => onStartExercise("synonym")}
                                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-transparent hover:border-blue-200 dark:hover:border-blue-500/20 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                                            <Link2 className="h-4 w-4" />
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-white mb-0.5 text-sm">Synonym Swap</span>
                                        <span className="text-[10px] text-gray-500">Find the right word</span>
                                    </button>
                                    <button
                                        onClick={() => onStartExercise("tetris")}
                                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-purple-50 dark:hover:bg-purple-500/10 border border-transparent hover:border-purple-200 dark:hover:border-purple-500/20 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                                            <PenTool className="h-4 w-4" />
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-white mb-0.5 text-sm">Usage Practice</span>
                                        <span className="text-[10px] text-gray-500">Fill in the blanks</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Select a word to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
