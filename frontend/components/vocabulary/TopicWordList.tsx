import { useState, useMemo } from "react";
import { Play, BookOpen, MessageSquare, Mic, Layers, ArrowRight, ChevronDown, ChevronUp, PenTool, ArrowLeftRight, Link2, Search, Filter, CheckCircle2 } from "lucide-react";
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

// Type badge color mapping
const typeBadgeColors: Record<string, string> = {
    academic: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    phrasal_verb: "bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20",
    idiom: "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
};

const typeLabels: Record<string, string> = {
    academic: "Academic",
    phrasal_verb: "Phrasal Verb",
    idiom: "Idiom",
};

export default function TopicWordList({ topicName, words, onStartLearning, onStartExercise, onBack }: TopicWordListProps) {
    const [expandedWordId, setExpandedWordId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "mastered" | "new">("all");

    // "Solo-Expansion" Logic: Toggle current, close others (already inherent in state design)
    const toggleExpand = (wordId: number) => {
        setExpandedWordId(expandedWordId === wordId ? null : wordId);
    };

    // Filter Logic
    const filteredWords = useMemo(() => {
        return words.filter(word => {
            const matchesSearch = word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                word.definition.toLowerCase().includes(searchQuery.toLowerCase());
            // Mock status filtering for now as WordData doesn't explicitly store 'status' per user yet in this view
            // Assuming 'new' for all unless we pass in progress data. 
            // For UI demo, we'll just check "all" or pass through.
            const matchesFilter = filterStatus === "all" ? true : true;

            return matchesSearch && matchesFilter;
        });
    }, [words, searchQuery, filterStatus]);

    const activeWord = words.find(w => w.id === expandedWordId);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{topicName} Vocabulary</h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xl">Master these high-frequency words to boost your score. Use the "Solo" mode to focus on one word at a time.</p>
                </div>
                <Button variant="outline" onClick={onBack} className="border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white">
                    Back to Topics
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content (List) - Span 8 */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Search & Filter Bar */}
                    <div className="sticky top-4 z-30 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search words..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={filterStatus === "all" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterStatus("all")}
                                className={cn("rounded-full", filterStatus === "all" ? "bg-gray-900 dark:bg-white text-white dark:text-black" : "border-gray-200 dark:border-white/10")}
                            >
                                All
                            </Button>
                            {/* Placeholders for future status filtering */}
                            <Button variant="outline" size="sm" className="rounded-full border-gray-200 dark:border-white/10 opacity-50 cursor-not-allowed">New</Button>
                            <Button variant="outline" size="sm" className="rounded-full border-gray-200 dark:border-white/10 opacity-50 cursor-not-allowed">Mastered</Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <BookOpen className="h-4 w-4" /> Word List
                            </h2>
                            <span className="text-xs text-gray-400">{filteredWords.length} visible</span>
                        </div>

                        {filteredWords.map((word) => (
                            <Card
                                key={word.id}
                                className={cn(
                                    "bg-white dark:bg-[#151B2B] border-gray-200 dark:border-white/5 transition-all duration-300 group overflow-hidden",
                                    expandedWordId === word.id
                                        ? "ring-2 ring-blue-500/20 dark:ring-blue-500/30 shadow-lg"
                                        : "hover:border-blue-300 dark:hover:border-blue-500/30 cursor-pointer"
                                )}
                                onClick={() => toggleExpand(word.id)}
                            >
                                <CardContent className="p-0">
                                    {/* Collapsed Header state */}
                                    <div className="p-5 flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className={cn("text-lg font-bold transition-colors", expandedWordId === word.id ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white")}>
                                                    {word.word}
                                                </h3>
                                                <div className="flex gap-2">
                                                    <Badge variant="outline" className="text-[10px] text-gray-500 border-gray-200 dark:border-white/10 uppercase font-medium">{word.partOfSpeech}</Badge>
                                                    <Badge variant="secondary" className="text-[10px] bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">Band {word.difficultyLevel}</Badge>
                                                    {word.type && <Badge variant="secondary" className={cn("text-[10px]", typeBadgeColors[word.type])}>{typeLabels[word.type]}</Badge>}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed max-w-xl">{word.definition}</p>
                                        </div>
                                        <div className={cn("mt-1 transition-transform duration-300", expandedWordId === word.id ? "rotate-180" : "")}>
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Expanded Content "Accordion" */}
                                    {expandedWordId === word.id && (
                                        <div className="bg-slate-50/50 dark:bg-slate-900/30 border-t border-gray-100 dark:border-white/5 p-5 space-y-6 animate-in slide-in-from-top-2 duration-300">
                                            {/* Collocations */}
                                            {word.collocations && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                        <Layers className="h-3 w-3" /> Collocations
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {word.collocations.map((col, i) => (
                                                            <div key={i} className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 text-sm text-gray-700 dark:text-slate-300 font-medium">
                                                                {col}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Registers: Speaking vs Writing */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Speaking: Informal/Chatty - Green/Teal */}
                                                {word.speakingExample && (
                                                    <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 space-y-2 relative overflow-hidden group/speak">
                                                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/speak:opacity-20 transition-opacity">
                                                            <MessageSquare className="h-12 w-12 text-emerald-500" />
                                                        </div>
                                                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 mb-1">
                                                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-md">
                                                                <MessageSquare className="h-3.5 w-3.5" />
                                                            </div>
                                                            <span className="text-[10px] font-bold uppercase tracking-wider">Speaking (Natural)</span>
                                                        </div>
                                                        <p className="text-sm text-gray-800 dark:text-slate-200 italic font-medium leading-relaxed">"{word.speakingExample}"</p>
                                                    </div>
                                                )}

                                                {/* Writing: Formal/Academic - Blue/Amber */}
                                                {word.writingExample && (
                                                    <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 space-y-2 relative overflow-hidden group/write">
                                                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/write:opacity-20 transition-opacity">
                                                            <PenTool className="h-12 w-12 text-blue-500" />
                                                        </div>
                                                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-1">
                                                            <div className="p-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-md">
                                                                <PenTool className="h-3.5 w-3.5" />
                                                            </div>
                                                            <span className="text-[10px] font-bold uppercase tracking-wider">Writing (Academic)</span>
                                                        </div>
                                                        <p className="text-sm text-gray-800 dark:text-slate-200 font-serif leading-relaxed border-l-2 border-blue-300 dark:border-blue-500/30 pl-3">"{word.writingExample}"</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Synonyms & Antonyms */}
                                            <div className="flex gap-6 pt-2 border-t border-gray-200 dark:border-white/5">
                                                {word.synonyms && (
                                                    <div className="space-y-2">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Synonyms</span>
                                                        <div className="flex gap-2 text-sm text-gray-600 dark:text-slate-400">
                                                            {word.synonyms.map(s => s.word).join(", ")}
                                                        </div>
                                                    </div>
                                                )}
                                                {word.antonyms && (
                                                    <div className="space-y-2">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Antonyms</span>
                                                        <div className="flex gap-2 text-sm text-rose-600 dark:text-rose-400">
                                                            {word.antonyms.join(", ")}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}

                        {filteredWords.length === 0 && (
                            <div className="text-center py-20 text-gray-500">
                                <p>No words found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar (Quick Actions) - Span 4 */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Practice CTA */}
                    <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-fullblur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                        <CardContent className="p-8 space-y-6 relative z-10">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Ready to Practice?</h3>
                                <p className="text-indigo-100 text-sm opacity-90">Start with flashcards to learn, then test your knowledge.</p>
                            </div>
                            <Button
                                onClick={onStartLearning}
                                className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold h-12 rounded-xl shadow-lg border-0"
                            >
                                <Play className="w-4 h-4 mr-2 fill-current" /> Start Learning
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Exercises Sidebar */}
                    <div className="bg-white dark:bg-[#151B2B] rounded-2xl border border-gray-200 dark:border-white/5 p-2 shadow-sm">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 mb-2">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Exercises</h3>
                        </div>

                        <div className="space-y-1">
                            {/* Context-Aware Exercise Buttons */}
                            {[
                                { id: "synonym", label: "Synonym Swap", desc: "Replace basic words", icon: MessageSquare, color: "text-sky-500", bg: "bg-sky-500/10", border: "group-hover:border-sky-500/30" },
                                { id: "tetris", label: "Context Tetris", desc: "Fill in the gaps", icon: Layers, color: "text-purple-500", bg: "bg-purple-500/10", border: "group-hover:border-purple-500/30" },
                                { id: "speak", label: "Speak to Unlock", desc: "Use words in speech", icon: Mic, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "group-hover:border-emerald-500/30" }
                            ].map((ex) => (
                                <button
                                    key={ex.id}
                                    onClick={() => onStartExercise(ex.id as any)}
                                    className={cn(
                                        "w-full p-3 rounded-xl flex items-center gap-4 text-left group transition-all duration-200 border border-transparent hover:bg-slate-50 dark:hover:bg-white/5",
                                        ex.border
                                    )}
                                >
                                    <div className={cn("p-2.5 rounded-lg transition-colors", ex.bg, ex.color)}>
                                        <ex.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-500 transition-colors">{ex.label}</h4>
                                            {/* Progress Ring Simulation */}
                                            <div className="h-4 w-4 rounded-full border-2 border-slate-200 dark:border-white/10 group-hover:border-current group-hover:text-green-500 transition-colors flex items-center justify-center">
                                                {/* <CheckCircle2 className="h-3 w-3" /> */}
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 group-hover:text-gray-500">
                                            {activeWord ? `Practice with "${activeWord.word}"` : ex.desc}
                                        </p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
