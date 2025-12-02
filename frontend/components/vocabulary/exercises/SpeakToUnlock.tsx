import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Check, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SpeakToUnlockProps {
    question: string;
    targetWords: string[];
    onComplete: () => void;
}

export default function SpeakToUnlock({ question, targetWords, onComplete }: SpeakToUnlockProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [matchedWords, setMatchedWords] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                const currentText = (finalTranscript + interimTranscript).toLowerCase();
                setTranscript(currentText);
                checkMatches(currentText);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                if (event.error === 'not-allowed') {
                    setError("Microphone access denied. Please allow access to use this feature.");
                } else {
                    setError("Speech recognition error. Please try again.");
                }
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            setError("Speech recognition is not supported in this browser.");
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const checkMatches = (text: string) => {
        const newMatches = targetWords.filter(word =>
            text.includes(word.toLowerCase()) && !matchedWords.includes(word)
        );

        if (newMatches.length > 0) {
            setMatchedWords(prev => [...prev, ...newMatches]);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setError(null);
            setTranscript("");
            setMatchedWords([]);
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    // Simulation for testing without mic
    const simulateSpeaking = () => {
        const text = `I think this job would be very ${targetWords[0]} because it offers a great ${targetWords[2]} and is quite ${targetWords[1]}.`;
        setTranscript(text);
        checkMatches(text.toLowerCase());
    };

    const allMatched = targetWords.every(w => matchedWords.includes(w));

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Speak to Unlock</h2>
                <p className="text-gray-500 dark:text-gray-400">Answer the question using the target vocabulary words.</p>
            </div>

            <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none">
                <CardContent className="p-8 text-center space-y-6">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        "{question}"
                    </h3>

                    <div className="flex flex-wrap justify-center gap-3">
                        {targetWords.map((word) => (
                            <div
                                key={word}
                                className={cn(
                                    "px-4 py-2 rounded-full border-2 font-bold transition-all duration-500",
                                    matchedWords.includes(word)
                                        ? "bg-green-100 dark:bg-green-500/20 border-green-500 text-green-700 dark:text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)] scale-110"
                                        : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400"
                                )}
                            >
                                {word}
                                {matchedWords.includes(word) && <Check className="inline-block ml-2 h-4 w-4" />}
                            </div>
                        ))}
                    </div>

                    <div className="min-h-[100px] p-4 rounded-lg bg-gray-50 dark:bg-black/30 text-left text-gray-600 dark:text-gray-300 italic border border-gray-200 dark:border-transparent">
                        {transcript || "Your answer will appear here..."}
                    </div>

                    {error && (
                        <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
                {!allMatched ? (
                    <>
                        <Button
                            size="lg"
                            onClick={toggleListening}
                            className={cn(
                                "rounded-full h-16 w-16 p-0 transition-all duration-300",
                                isListening
                                    ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                                    : "bg-sky-500 hover:bg-sky-600 shadow-[0_0_20px_rgba(14,165,233,0.4)]"
                            )}
                        >
                            {isListening ? <MicOff className="h-8 w-8 text-white" /> : <Mic className="h-8 w-8 text-white" />}
                        </Button>

                        {/* Dev/Test Helper */}
                        <Button variant="ghost" size="sm" onClick={simulateSpeaking} className="absolute bottom-4 right-4 text-xs text-gray-500 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400">
                            (Simulate)
                        </Button>
                    </>
                ) : (
                    <div className="space-y-4 text-center animate-in zoom-in duration-300">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 font-bold">
                            <Check className="h-5 w-5" /> Great Speaking!
                        </div>
                        <div>
                            <Button onClick={onComplete} size="lg" className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold px-8">
                                Complete Exercise <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
