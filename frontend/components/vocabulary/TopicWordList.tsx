import { Play, BookOpen, MessageSquare, Mic, Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WordSummary {
    id: number;
    word: string;
    definition: string;
    partOfSpeech: string;
    difficultyLevel: number;
}

interface TopicWordListProps {
    topicName: string;
    words: WordSummary[];
    onStartLearning: () => void;
    onStartExercise: (type: "synonym" | "tetris" | "speak") => void;
    onBack: () => void;
}

export default function TopicWordList({ topicName, words, onStartLearning, onStartExercise, onBack }: TopicWordListProps) {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{topicName} Vocabulary</h1>
                    <p className="text-gray-500 dark:text-gray-400">Master these high-frequency words to boost your score.</p>
                </div>
                <Button variant="outline" onClick={onBack} className="border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white">
                    Back to Topics
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Word List Section */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-sky-500" />
                            Word List
                        </h2>
                        <Badge variant="secondary" className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                            {words.length} words
                        </Badge>
                    </div>

                    <div className="space-y-3">
                        {words.map((word, index) => (
                            <Card key={word.id} className="bg-white dark:bg-neutral-900/50 border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors group shadow-sm dark:shadow-none">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                                {word.word}
                                            </h3>
                                            <Badge variant="outline" className="text-[10px] border-gray-200 dark:border-white/10 text-gray-500 uppercase">
                                                {word.partOfSpeech}
                                            </Badge>
                                            <Badge variant="secondary" className="text-[10px] bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
                                                Band {word.difficultyLevel}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{word.definition}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Practice Options Section */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 border-indigo-100 dark:border-indigo-500/20 overflow-hidden shadow-sm dark:shadow-none">
                        <CardContent className="p-6 space-y-6">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-indigo-900 dark:text-white">Ready to Practice?</h3>
                                <p className="text-sm text-indigo-700 dark:text-gray-300">Start with flashcards to learn, then test your knowledge.</p>
                            </div>

                            <Button
                                onClick={onStartLearning}
                                className="w-full h-12 text-lg font-bold bg-indigo-600 dark:bg-white text-white dark:text-indigo-950 hover:bg-indigo-700 dark:hover:bg-indigo-50 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                            >
                                <Play className="mr-2 h-5 w-5 fill-current" /> Start Learning
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quick Exercises</h3>

                        <button
                            onClick={() => onStartExercise("synonym")}
                            className="w-full p-4 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/5 hover:border-sky-500/30 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all flex items-center gap-4 group text-left shadow-sm dark:shadow-none"
                        >
                            <div className="p-3 rounded-lg bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">Synonym Swap</h4>
                                <p className="text-xs text-gray-500">Replace basic words with academic ones</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-600 group-hover:text-sky-500 dark:group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                        </button>

                        <button
                            onClick={() => onStartExercise("tetris")}
                            className="w-full p-4 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/5 hover:border-purple-500/30 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all flex items-center gap-4 group text-left shadow-sm dark:shadow-none"
                        >
                            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                <Layers className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Context Tetris</h4>
                                <p className="text-xs text-gray-500">Fill in the gaps with the right context</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-600 group-hover:text-purple-500 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                        </button>

                        <button
                            onClick={() => onStartExercise("speak")}
                            className="w-full p-4 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/5 hover:border-green-500/30 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all flex items-center gap-4 group text-left shadow-sm dark:shadow-none"
                        >
                            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                <Mic className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Speak to Unlock</h4>
                                <p className="text-xs text-gray-500">Use target words in your speech</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-600 group-hover:text-green-500 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
