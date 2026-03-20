import { useState, useMemo } from "react";
import {
    History, Upload, PlayCircle, Star, BookOpen, Clock, Brain
} from "lucide-react";
import type { Topic, WordData } from "@/data/vocabulary/types";
import { cn } from "@/lib/utils";
import FlashcardMode from "./FlashcardMode";

import { TopicCard } from "./TopicCard";
import { StatCard } from "./StatCard";
import { WordOfDayCard } from "./WordOfDayCard";
import { useVocabulary } from "@/contexts/VocabularyContext";
import { generateAggregateCurveData } from "@/lib/vocabulary/forgetting-curve";

interface VocabularyDashboardProps {
    topics: Topic[];
    allWords: WordData[];
    onTopicSelect: (topicId: number, mode?: "speaking" | "writing") => void;
}

export default function VocabularyDashboard({ topics, allWords, onTopicSelect }: VocabularyDashboardProps) {
    const [isFlashcardModeOpen, setIsFlashcardModeOpen] = useState(false);
    const { dueWords, userProgress } = useVocabulary();

    const studyList = allWords ? allWords.filter(word => dueWords.includes(word.id)) : [];
    const retentionData = useMemo(() => generateAggregateCurveData(userProgress), [userProgress]);

    return (
        <div className="h-full overflow-y-auto bg-[#F8FAFC] dark:bg-background text-slate-800 font-sans p-0">
            {isFlashcardModeOpen && studyList.length > 0 && (
                <FlashcardMode
                    words={studyList}
                    onClose={() => setIsFlashcardModeOpen(false)}
                    onComplete={() => setIsFlashcardModeOpen(false)}
                />
            )}

            <main className="w-full h-full p-6">
                {/* Header */}
                <header className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-500/20 uppercase tracking-widest">Advanced Level</span>
                                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">/ 1,420 words learned</span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Vocabulary Library</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold border dark:border-white/10 rounded-xl transition-all shadow-sm bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300">
                                <Upload className="w-4 h-4" />
                                Import List
                            </button>

                            <button
                                onClick={() => studyList.length > 0 && setIsFlashcardModeOpen(true)}
                                disabled={studyList.length === 0}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-lg border",
                                    studyList.length > 0
                                        ? "bg-sky-500 border-sky-400 text-white hover:bg-sky-600 shadow-sky-200 dark:shadow-none"
                                        : "bg-slate-100 border-slate-200 dark:bg-white/5 dark:border-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                                )}
                            >
                                <PlayCircle className="w-4 h-4" />
                                Study Mode
                            </button>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-8">
                    {/* Left & Middle Content */}
                    <div className="col-span-12 xl:col-span-9 space-y-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <StatCard
                                title="Mastery Rate"
                                value={`${allWords?.length ? ((Object.values(userProgress).filter(p => p.srs.repetition >= 4).length / allWords.length) * 100).toFixed(1) : "0.0"}%`}
                                progressValue={allWords?.length ? (Object.values(userProgress).filter(p => p.srs.repetition >= 4).length / allWords.length) * 100 : 0}
                                icon={<Star className="w-5 h-5" />}
                            />
                            <StatCard
                                title="Words Today"
                                value={Object.values(userProgress).filter(p => p.history.some(h => new Date(h.date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0))).length.toString()}
                                subtitle="Goal: 30"
                                icon={<BookOpen className="w-5 h-5" />}
                                avatars={
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#151624] bg-sky-100 text-sky-600 flex items-center justify-center text-[10px] font-bold">A1</div>
                                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#151624] bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold">B2</div>
                                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#151624] bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-bold">+2</div>
                                    </div>
                                }
                            />
                        </div>



                        {/* Active Topics */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Active Topics</h2>
                                <button className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 hover:text-sky-500 transition-colors">
                                    Manage topics
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {topics.map((topic) => (
                                    <TopicCard
                                        key={topic.id}
                                        topic={topic}
                                        onClick={(mode) => onTopicSelect(topic.id, mode)}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Sidebar */}
                    <aside className="col-span-12 xl:col-span-3 space-y-8">
                        {allWords?.length > 0 && (
                            (() => {
                                const dateStr = new Date().toDateString();
                                let hash = 0;
                                for (let i = 0; i < dateStr.length; i++) hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
                                const wordOfDay = allWords[Math.abs(hash) % allWords.length];
                                return (
                                    <WordOfDayCard
                                        word={wordOfDay.word}
                                        phonetic={wordOfDay.pronunciation || "N/A"}
                                        partOfSpeech={wordOfDay.partOfSpeech}
                                        definition={wordOfDay.definition}
                                    />
                                );
                            })()
                        )}

                    </aside>
                </div>
            </main >
        </div >
    );
}
