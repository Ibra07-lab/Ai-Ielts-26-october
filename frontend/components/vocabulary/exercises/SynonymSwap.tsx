import { useState } from "react";
import { Check, X, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
}

interface SynonymSwapProps {
    sentence: string;
    targetWord: string;
    options: Option[];
    onComplete: () => void;
}

export default function SynonymSwap({ sentence, targetWord, options, onComplete }: SynonymSwapProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const parts = sentence.split(targetWord);
    const correctOption = options.find(o => o.isCorrect);

    const handleSelect = (id: string) => {
        if (isSubmitted) return;
        setSelectedOption(id);
    };

    const handleSubmit = () => {
        if (!selectedOption) return;
        setIsSubmitted(true);
    };

    const handleNext = () => {
        setSelectedOption(null);
        setIsSubmitted(false);
        onComplete();
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Synonym Swap</h2>
                <p className="text-gray-500 dark:text-gray-400">Replace the highlighted word with a more academic alternative.</p>
            </div>

            <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none">
                <CardContent className="p-8 md:p-12 text-center">
                    <p className="text-2xl md:text-3xl font-medium leading-relaxed text-gray-800 dark:text-gray-300">
                        {parts[0]}
                        <span className={cn(
                            "px-2 py-1 rounded-md transition-all duration-300 font-bold border-b-2",
                            isSubmitted && selectedOption
                                ? options.find(o => o.id === selectedOption)?.isCorrect
                                    ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-500"
                                    : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-500"
                                : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500 animate-pulse"
                        )}>
                            {isSubmitted && selectedOption
                                ? options.find(o => o.id === selectedOption)?.text
                                : targetWord}
                        </span>
                        {parts[1]}
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleSelect(option.id)}
                        disabled={isSubmitted}
                        className={cn(
                            "p-4 rounded-xl border-2 text-lg font-medium transition-all duration-200 relative overflow-hidden group",
                            selectedOption === option.id
                                ? "border-sky-500 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-white"
                                : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20",
                            isSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400",
                            isSubmitted && !option.isCorrect && selectedOption === option.id && "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400",
                            isSubmitted && !option.isCorrect && selectedOption !== option.id && "opacity-50"
                        )}
                    >
                        {option.text}
                        {isSubmitted && option.isCorrect && (
                            <div className="absolute top-2 right-2">
                                <Check className="h-4 w-4 text-green-500" />
                            </div>
                        )}
                        {isSubmitted && !option.isCorrect && selectedOption === option.id && (
                            <div className="absolute top-2 right-2">
                                <X className="h-4 w-4 text-red-500" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {isSubmitted && (
                <div className={cn(
                    "p-4 rounded-lg border flex items-start gap-3 animate-in slide-in-from-bottom-2",
                    options.find(o => o.id === selectedOption)?.isCorrect
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-500/30"
                )}>
                    {options.find(o => o.id === selectedOption)?.isCorrect ? (
                        <div className="p-1 bg-green-100 dark:bg-green-500/20 rounded-full">
                            <Check className="h-5 w-5 text-green-600 dark:text-green-500" />
                        </div>
                    ) : (
                        <div className="p-1 bg-red-100 dark:bg-red-500/20 rounded-full">
                            <X className="h-5 w-5 text-red-600 dark:text-red-500" />
                        </div>
                    )}
                    <div className="flex-1">
                        <h4 className={cn(
                            "font-bold mb-1",
                            options.find(o => o.id === selectedOption)?.isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                        )}>
                            {options.find(o => o.id === selectedOption)?.isCorrect ? "+1 Lexical Resource!" : "Not quite academic enough."}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {options.find(o => o.id === selectedOption)?.feedback}
                        </p>
                    </div>
                    <Button onClick={handleNext} size="sm" className={cn(
                        options.find(o => o.id === selectedOption)?.isCorrect ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white"
                    )}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}

            {!isSubmitted && (
                <div className="flex justify-center">
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedOption}
                        size="lg"
                        className="w-full md:w-auto px-8 font-bold bg-gray-900 dark:bg-primary text-white hover:bg-gray-800 dark:hover:bg-primary/90"
                    >
                        Check Answer
                    </Button>
                </div>
            )}
        </div>
    );
}
