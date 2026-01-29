import { useState } from "react";
import { Check, X, ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
}

export interface SynonymSwapProps {
    // Legacy format
    sentence?: string;
    targetWord?: string;
    options?: Option[];

    // New enhanced format
    instruction?: string;
    sentence_original?: string;
    replace_this?: string;
    sentence_answer?: string;
    target_word?: string;

    onComplete: () => void;
}

export default function SynonymSwap(props: SynonymSwapProps) {
    const { onComplete } = props;
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [userInput, setUserInput] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Determine mode
    const isLegacy = !!props.options && props.options.length > 0;

    // Derived values
    const text = isLegacy ? props.sentence! : props.sentence_original!;
    const highlight = isLegacy ? props.targetWord! : props.replace_this!;
    const instruction = isLegacy ? "Replace the highlighted word with a more academic alternative." : props.instruction;

    // Split text for highlighting
    // For legacy: split by targetWord
    // For new: split by replace_this
    const parts = text.split(highlight);

    // Legacy Logic
    const handleSelect = (id: string) => {
        if (isSubmitted) return;
        setSelectedOption(id);
    };

    // New Input Logic
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const handleSubmit = () => {
        if (isLegacy && !selectedOption) return;
        if (!isLegacy && !userInput.trim()) return;
        setIsSubmitted(true);
    };

    const handleNext = () => {
        setSelectedOption(null);
        setUserInput("");
        setIsSubmitted(false);
        onComplete();
    };

    // Check correctness
    const isCorrect = isLegacy
        ? props.options?.find(o => o.id === selectedOption)?.isCorrect
        : userInput.trim().toLowerCase() === props.target_word?.toLowerCase();

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Synonym Swap</h2>
                <p className="text-gray-500 dark:text-gray-400">{instruction}</p>
            </div>

            <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none">
                <CardContent className="p-8 md:p-12 text-center">
                    <p className="text-2xl md:text-3xl font-medium leading-relaxed text-gray-800 dark:text-gray-300">
                        {parts[0]}
                        <span className={cn(
                            "px-2 py-1 rounded-md transition-all duration-300 font-bold border-b-2",
                            isSubmitted
                                ? isCorrect
                                    ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-500"
                                    : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-500"
                                : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500 animate-pulse"
                        )}>
                            {isSubmitted
                                ? (isLegacy ? props.options?.find(o => o.id === selectedOption)?.text : userInput)
                                : highlight}
                        </span>
                        {parts[1]}
                    </p>
                </CardContent>
            </Card>

            {isLegacy ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {props.options?.map((option) => (
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
            ) : (
                <div className="max-w-md mx-auto space-y-4">
                    <Input
                        value={userInput}
                        onChange={handleInputChange}
                        disabled={isSubmitted}
                        placeholder="Type the academic word..."
                        className="text-lg p-6 text-center font-medium bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 focus-visible:ring-sky-500"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && userInput.trim() && !isSubmitted) {
                                handleSubmit();
                            }
                        }}
                    />
                </div>
            )}

            {isSubmitted && (
                <div className={cn(
                    "p-4 rounded-lg border flex items-start gap-3 animate-in slide-in-from-bottom-2",
                    isCorrect
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-500/30"
                )}>
                    {isCorrect ? (
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
                            isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                        )}>
                            {isCorrect ? "+1 Lexical Resource!" : "Not quite academic enough."}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {isLegacy
                                ? props.options?.find(o => o.id === selectedOption)?.feedback
                                : isCorrect
                                    ? `Correct! "${props.target_word}" is the right word.`
                                    : `The correct word was "${props.target_word}".`
                            }
                        </p>
                    </div>
                    <Button onClick={handleNext} size="sm" className={cn(
                        isCorrect ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white"
                    )}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}

            {!isSubmitted && (
                <div className="flex justify-center">
                    <Button
                        onClick={handleSubmit}
                        disabled={isLegacy ? !selectedOption : !userInput.trim()}
                        size="lg"
                        className="w-full md:w-auto px-8 font-bold bg-gray-900 dark:bg-primary text-white hover:bg-gray-800 dark:hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg shadow-sky-500/20"
                    >
                        Check Answer
                    </Button>
                </div>
            )}
        </div>
    );
}
