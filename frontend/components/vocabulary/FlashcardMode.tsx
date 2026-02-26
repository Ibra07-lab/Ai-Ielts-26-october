import { useState, useEffect } from "react";
import {
    X, RotateCcw, Check, ChevronRight, Brain,
    Volume2, ArrowRight, Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WordData } from "@/data/vocabulary/types";
import { useVocabulary } from "@/contexts/VocabularyContext";
import { SRSGrade } from "@/lib/vocabulary/srs-engine";

interface FlashcardModeProps {
    words: WordData[];
    onClose: () => void;
    onComplete: () => void;
}

export default function FlashcardMode({ words, onClose, onComplete }: FlashcardModeProps) {
    const { markWordAsReviewed } = useVocabulary();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

    const currentWord = words[currentIndex];
    const isLastCard = currentIndex === words.length - 1;

    useEffect(() => {
        // Reset state when word changes
        setIsFlipped(false);
    }, [currentIndex]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isFlipped) {
                if (e.code === 'Space' || e.code === 'Enter') {
                    setIsFlipped(true);
                }
                return;
            }

            switch (e.key) {
                case '1': handleGrade(SRSGrade.AGAIN); break;
                case '2': handleGrade(SRSGrade.HARD); break;
                case '3': handleGrade(SRSGrade.GOOD); break;
                case '4': handleGrade(SRSGrade.EASY); break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFlipped, currentIndex]);

    const handleGrade = (grade: SRSGrade) => {
        markWordAsReviewed(currentWord.id, grade);

        if (grade >= SRSGrade.GOOD) {
            setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
        }
        setSessionStats(prev => ({ ...prev, total: prev.total + 1 }));

        if (isLastCard) {
            onComplete();
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const playAudio = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Placeholder for TTS or audio file
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        window.speechSynthesis.speak(utterance);
    };

    if (!currentWord) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-sm">
                            {currentIndex + 1}
                        </div>
                        <span className="text-slate-500 text-sm font-medium">of {words.length} cards</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Card Content */}
                <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center min-h-[400px] perspective-1000">

                    {/* Front Side */}
                    <div className={cn(
                        "text-center transition-all duration-500 absolute inset-0 flex flex-col items-center justify-center p-12 backface-hidden",
                        isFlipped ? "opacity-0 rotate-y-180 pointer-events-none" : "opacity-100 rotate-y-0"
                    )}>
                        <span className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-6">Define this word</span>
                        <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">{currentWord.word}</h2>

                        <button
                            onClick={playAudio}
                            className="p-4 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors mb-8"
                        >
                            <Volume2 className="w-8 h-8" />
                        </button>

                        <button
                            onClick={() => setIsFlipped(true)}
                            className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                            Show Answer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="mt-4 text-xs text-slate-400">Press Space to flip</p>
                    </div>

                    {/* Back Side */}
                    <div className={cn(
                        "text-center transition-all duration-500 absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden",
                        isFlipped ? "opacity-100 rotate-y-0" : "opacity-0 -rotate-y-180 pointer-events-none"
                    )}>
                        <div className="w-full max-w-lg mx-auto space-y-6">
                            <div className="flex items-center justify-center gap-4 mb-2">
                                <h2 className="text-3xl font-bold text-slate-900">{currentWord.word}</h2>
                                <button onClick={playAudio} className="text-slate-400 hover:text-sky-600">
                                    <Volume2 className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100">
                                <p className="text-lg text-slate-700 leading-relaxed font-medium">
                                    {currentWord.definition}
                                </p>
                            </div>

                            {currentWord.exampleSentence && (
                                <div className="text-slate-500 italic">
                                    "{currentWord.exampleSentence}"
                                </div>
                            )}

                            {/* Grading Buttons */}
                            <div className="grid grid-cols-4 gap-3 pt-6 w-full">
                                <button
                                    onClick={() => handleGrade(SRSGrade.AGAIN)}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                                >
                                    <span className="text-xs font-bold uppercase tracking-wider">Again</span>
                                    <span className="text-[10px] opacity-70">&lt; 1m</span>
                                    <div className="text-xs font-mono bg-white/50 px-1.5 rounded border border-rose-200">1</div>
                                </button>

                                <button
                                    onClick={() => handleGrade(SRSGrade.HARD)}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 transition-colors"
                                >
                                    <span className="text-xs font-bold uppercase tracking-wider">Hard</span>
                                    <span className="text-[10px] opacity-70">2d</span>
                                    <div className="text-xs font-mono bg-white/50 px-1.5 rounded border border-orange-200">2</div>
                                </button>

                                <button
                                    onClick={() => handleGrade(SRSGrade.GOOD)}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors"
                                >
                                    <span className="text-xs font-bold uppercase tracking-wider">Good</span>
                                    <span className="text-[10px] opacity-70">4d</span>
                                    <div className="text-xs font-mono bg-white/50 px-1.5 rounded border border-sky-200">3</div>
                                </button>

                                <button
                                    onClick={() => handleGrade(SRSGrade.EASY)}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                                >
                                    <span className="text-xs font-bold uppercase tracking-wider">Easy</span>
                                    <span className="text-[10px] opacity-70">7d</span>
                                    <div className="text-xs font-mono bg-white/50 px-1.5 rounded border border-emerald-200">4</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
