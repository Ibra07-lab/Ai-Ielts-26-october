import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, RotateCcw, ArrowRight, Star, Sparkles, BookOpen, MessageSquare, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface WordData {
    id: number;
    word: string;
    definition: string;
    exampleSentence: string;
    difficultyLevel: number;
    topic: string;
    audioUrl?: string;
    context?: string;
    collocations?: string[];
    synonyms?: { word: string; level: string }[];
}

interface WordDeckProps {
    word: WordData;
    onKnow: () => void;
    onDontKnow: () => void;
    onBack: () => void;
    remainingCount: number;
}

export default function WordDeck({ word, onKnow, onDontKnow, onBack, remainingCount }: WordDeckProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [synonymLevel, setSynonymLevel] = useState(0);
    const [exitDirection, setExitDirection] = useState<"right" | "left" | null>(null);

    // Reset flip state when word changes
    useEffect(() => {
        setIsFlipped(false);
    }, [word.id]);

    const handleFlip = () => setIsFlipped(!isFlipped);

    const playAudio = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Mock audio playback
        console.log("Playing audio for:", word.word);
    };

    const handleKnowClick = () => {
        console.log("Know clicked. Setting exit direction to right.");
        setExitDirection("right");
        // Small delay to ensure state update is reflected and allow button animation
        setTimeout(() => {
            console.log("Calling onKnow");
            onKnow();
        }, 50);
    };

    const handleDontKnowClick = () => {
        console.log("DontKnow clicked. Setting exit direction to left.");
        setExitDirection("left");
        setTimeout(() => {
            console.log("Calling onDontKnow");
            onDontKnow();
        }, 50);
    };

    console.log("Render WordDeck. ExitDirection:", exitDirection);

    // Mock data if not provided
    const context = word.context || "Often used in Speaking Part 1 (Work) or Writing Task 2.";
    const collocations = word.collocations || ["Highly lucrative", "Lucrative market", "Lucrative deal"];
    const synonyms = word.synonyms || [
        { word: "Good money", level: "Basic" },
        { word: "Profitable", level: "Better" },
        { word: "Lucrative", level: "Band 9" }
    ];

    const cardVariants = {
        enter: (direction: "right" | "left" | null) => ({
            x: direction === "left" ? 300 : 0, // If prev was left (dont know), enter from right
            y: 0, // Always enter at y=0 (no slide from top)
            opacity: 0,
            scale: direction === "right" ? 1 : 0.9, // Instant scale for "I Know"
        }),
        center: {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                duration: 0.4,
                type: "spring" as const,
                stiffness: 300,
                damping: 25
            }
        },
        exit: (direction: "right" | "left" | null) => {
            console.log("EXIT ANIMATION. Direction:", direction);
            if (direction === "right") {
                // "I Know" - Throw Right
                return {
                    x: 600,
                    rotate: 8,
                    opacity: 0,
                    transition: { duration: 0.3, ease: "easeIn" as const }
                };
            } else {
                // "I Don't Know" - Throw Left (Default)
                return {
                    x: -600,
                    rotate: -8,
                    opacity: 0,
                    transition: { duration: 0.4, ease: "easeIn" as const }
                };
            }
        }
    };

    const textVariants = {
        center: { color: "transparent", textShadow: "none" }, // Reset
        exit: (direction: "right" | "left" | null) => ({
            color: direction === "left" ? "#f97316" : "transparent", // Orange warning if left
            textShadow: direction === "right"
                ? "-20px 0 30px rgba(16, 185, 129, 0.8)" // Green trail if right
                : "none",
            transition: { duration: 0.2 }
        })
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <RotateCcw className="mr-2 h-4 w-4" /> Back to Topics
                </Button>
                <Badge variant="outline" className="border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-500/10">
                    {remainingCount} words remaining
                </Badge>
            </div>

            <div className="relative h-[500px] w-full perspective-1000">
                <AnimatePresence mode="popLayout" custom={exitDirection}>
                    <motion.div
                        key={word.id}
                        custom={exitDirection}
                        variants={cardVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 w-full h-full"
                        style={{ transformStyle: "preserve-3d" }} // Ensure 3d works with motion
                    >
                        {/* Inner container for Flip Animation (CSS) */}
                        <div
                            className={cn(
                                "w-full h-full transition-all duration-700 transform-style-3d cursor-pointer",
                                isFlipped ? "rotate-y-180" : ""
                            )}
                            onClick={handleFlip}
                        >
                            {/* Front of Card */}
                            <Card className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl flex flex-col items-center justify-center p-8 group hover:border-sky-500/30 transition-colors">
                                <div className="absolute top-6 right-6">
                                    <Star className="h-6 w-6 text-yellow-500/20 group-hover:text-yellow-500 transition-colors" />
                                </div>

                                <div className="text-center space-y-6">
                                    <motion.h2
                                        variants={textVariants}
                                        className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-600"
                                    >
                                        {word.word}
                                    </motion.h2>

                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="rounded-full h-16 w-16 p-0 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 hover:scale-110 transition-all"
                                        onClick={playAudio}
                                    >
                                        <Volume2 className="h-8 w-8 text-sky-500 dark:text-sky-400" />
                                    </Button>

                                    <p className="text-gray-400 dark:text-gray-500 mt-8 animate-pulse">Click to flip</p>
                                </div>
                            </Card>

                            {/* Back of Card */}
                            <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white dark:bg-neutral-900 border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl overflow-y-auto custom-scrollbar">
                                <CardContent className="p-8 space-y-6">
                                    {/* Definition Section */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 mb-1">
                                            <BookOpen className="h-4 w-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Definition</span>
                                        </div>
                                        <p className="text-xl font-medium text-gray-900 dark:text-white leading-relaxed">
                                            {word.definition}
                                        </p>
                                    </div>

                                    {/* Context Section */}
                                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-500/20 space-y-2">
                                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                                            <Sparkles className="h-4 w-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">IELTS Context</span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                                            {context}
                                        </p>
                                    </div>

                                    {/* Collocation Chain */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                                            <Layers className="h-4 w-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Collocation Chain</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {collocations.map((col, i) => (
                                                <Badge key={i} variant="secondary" className="bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-500/20 border-purple-200 dark:border-purple-500/20 py-1.5 px-3">
                                                    {col.split(" ").map((part, idx) =>
                                                        part.toLowerCase().includes(word.word.toLowerCase())
                                                            ? <span key={idx} className="font-bold text-purple-900 dark:text-white mx-1">{part}</span>
                                                            : <span key={idx} className="mx-1">{part}</span>
                                                    )}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Synonym Slider */}
                                    <div className="space-y-4 pt-2">
                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                                            <MessageSquare className="h-4 w-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Synonym Ladder</span>
                                        </div>

                                        <div className="px-2">
                                            <Slider
                                                defaultValue={[2]}
                                                max={2}
                                                step={1}
                                                className="py-4"
                                                onValueChange={(vals) => setSynonymLevel(vals[0])}
                                            />
                                            <div className="flex justify-between mt-2">
                                                {synonyms.map((syn, i) => (
                                                    <div key={i} className={cn("text-center transition-opacity duration-300", synonymLevel === i ? "opacity-100 scale-110" : "opacity-40")}>
                                                        <p className={cn("font-bold text-sm", synonymLevel === i ? "text-gray-900 dark:text-white" : "text-gray-500")}>{syn.word}</p>
                                                        <p className="text-[10px] text-gray-500 uppercase">{syn.level}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex justify-center gap-4 pt-4">
                <motion.button
                    whileTap={{ scale: 1, backgroundColor: "#9f1239" }}
                    transition={{ duration: 0.1 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFlipped(false);
                        handleDontKnowClick();
                    }}
                    className="w-full md:w-40 h-11 rounded-md border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-bold bg-transparent"
                >
                    I Don't Know
                </motion.button>

                <motion.button
                    whileTap={{ scale: 1.05, boxShadow: "0 0 20px 5px rgba(16, 185, 129, 0.5)" }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFlipped(false);
                        handleKnowClick();
                    }}
                    className="w-full md:w-40 h-11 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                    I Know
                </motion.button>
            </div>
        </div>
    );
}
