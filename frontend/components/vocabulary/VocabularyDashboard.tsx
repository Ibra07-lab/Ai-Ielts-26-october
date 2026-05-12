import { useState, useMemo } from "react";
import {
    Layers
} from "lucide-react";
import type { Topic, WordData } from "@/data/vocabulary/types";
import { cn, speakText } from "@/lib/utils";
import FlashcardMode from "./FlashcardMode";
import FlashcardSetup from "./FlashcardSetup";

import { TopicCard } from "./TopicCard";
import { WordOfDayCard } from "./WordOfDayCard";
import { useVocabulary } from "@/contexts/VocabularyContext";
import { generateAggregateCurveData } from "@/lib/vocabulary/forgetting-curve";

interface VocabularyDashboardProps {
    topics: Topic[];
    allWords: WordData[];
    onTopicSelect: (topicId: number, mode?: "speaking" | "writing") => void;
    isPreview?: boolean;
    onShowSignupModal?: () => void;
}

export default function VocabularyDashboard({ topics, allWords, onTopicSelect, isPreview = false, onShowSignupModal }: VocabularyDashboardProps) {
    const [isFlashcardSetupOpen, setIsFlashcardSetupOpen] = useState(false);
    const [flashcardWords, setFlashcardWords] = useState<WordData[] | null>(null);
    const { userProgress } = useVocabulary();
    const retentionData = useMemo(() => generateAggregateCurveData(userProgress), [userProgress]);

    const handleStartFlashcards = (words: WordData[]) => {
        setFlashcardWords(words);
        setIsFlashcardSetupOpen(false);
    };

    const handleCloseFlashcards = () => {
        setFlashcardWords(null);
    };

    return (
        <div className="h-full overflow-y-auto bg-gradient-to-b from-[#EEF4FF] to-[#F8FAFC] dark:bg-none dark:bg-background text-slate-800 font-sans p-0 relative">
            {/* Mesh gradient orbs for premium dark mode */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none hidden dark:block" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none hidden dark:block" />

            {/* Flashcard Setup Modal */}
            {isFlashcardSetupOpen && (
                <FlashcardSetup
                    topics={topics}
                    onStart={handleStartFlashcards}
                    onClose={() => setIsFlashcardSetupOpen(false)}
                />
            )}

            {/* Flashcard Mode */}
            {flashcardWords && flashcardWords.length > 0 && (
                <FlashcardMode
                    words={flashcardWords}
                    onClose={handleCloseFlashcards}
                    onComplete={handleCloseFlashcards}
                />
            )}

            <main className="w-full h-full p-6">
                {/* Header */}
                <header className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white premium-gradient-text pb-1">Vocabulary Library</h1>
                        </div>

                        {/* Start Flashcards Button */}
                        <button
                            onClick={() => isPreview && onShowSignupModal ? onShowSignupModal() : setIsFlashcardSetupOpen(true)}
                            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                        >
                            <Layers className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Flashcards
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-8">
                    {/* Left & Middle Content */}
                    <div className="col-span-12 xl:col-span-9 space-y-8">

                        {/* Active Topics */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Active Topics</h2>
                                <button className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 hover:text-sky-500 transition-colors">
                                    Manage topics
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {topics.map((topic, index) => (
                                    <TopicCard
                                        key={topic.id}
                                        topic={topic}
                                        index={index}
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
                                        onSpeakClick={() => speakText(wordOfDay.word)}
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
