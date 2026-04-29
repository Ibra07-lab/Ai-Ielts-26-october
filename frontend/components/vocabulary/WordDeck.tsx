import { useState, useEffect } from "react";
import { useMotionValue, useTransform, motion, AnimatePresence } from "framer-motion";
import { Volume2, RotateCcw, ArrowRight, Star, Sparkles, BookOpen, MessageSquare, Layers, Mic, PenTool, ArrowLeftRight, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { WordData } from "@/data/vocabulary/types";

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
    const x = useMotionValue(0);
    const opacityKnow = useTransform(x, [50, 150], [0, 1]);
    const opacityDontKnow = useTransform(x, [-50, -150], [0, 1]);
    const [isEntering, setIsEntering] = useState(true);

    // Reset flip state when word changes
    useEffect(() => {
        setIsFlipped(false);
        setExitDirection(null);
        setIsEntering(true);
        const timer = setTimeout(() => setIsEntering(false), 600);
        return () => clearTimeout(timer);
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
        // Increased delay to allow the exit animation to play out (0.5s)
        setTimeout(() => {
            console.log("Calling onKnow");
            onKnow();
        }, 500);
    };

    const handleDontKnowClick = () => {
        console.log("DontKnow clicked. Setting exit direction to left.");
        setExitDirection("left");
        setTimeout(() => {
            console.log("Calling onDontKnow");
            onDontKnow();
        }, 500);
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

    const cardVariants: any = {
        enter: (direction: "right" | "left" | null) => ({
            x: direction === "left" ? 400 : direction === "right" ? -400 : 0,
            y: direction === "left" ? 100 : 0,
            opacity: 0,
            scale: 0.8,
            rotate: direction === "left" ? -10 : direction === "right" ? 10 : 0,
        }),
        center: {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                duration: 0.6,
                type: "spring",
                stiffness: 260,
                damping: 20
            }
        },
        exit: (direction: "right" | "left" | null) => {
            if (direction === "right") {
                // Success - Fly off top-right with rotation and glow
                return {
                    x: 600,
                    y: -150,
                    rotate: 25,
                    opacity: 0,
                    scale: 1.1,
                    transition: { 
                        duration: 0.5, 
                        ease: "easeOut" 
                    }
                } as any;
            } else {
                // Failure - Drop down with a shake
                return {
                    x: [0, -20, 20, -20, 0, -400],
                    y: [0, 0, 0, 0, 0, 400],
                    rotate: [0, -2, 2, -2, 0, -15],
                    opacity: [1, 1, 1, 1, 1, 0],
                    transition: { 
                        times: [0, 0.1, 0.2, 0.3, 0.4, 1],
                        duration: 0.6,
                        ease: "easeInOut"
                    }
                };
            }
        }
    };

    const textVariants = {
        center: { color: "transparent", textShadow: "none" },
        exit: (direction: "right" | "left" | null) => ({
            color: direction === "left" ? "#f43f5e" : "transparent",
            textShadow: direction === "right"
                ? "0 0 40px rgba(16, 185, 129, 0.9)"
                : "none",
            transition: { duration: 0.3 }
        })
    };

    return (
        <div className="relative w-full h-full min-h-[600px] flex items-center justify-center overflow-hidden p-4 sm:p-8">
            {/* Ambient Environment Blobs */}
            <motion.div 
                animate={{ 
                    x: [0, 50, -50, 0],
                    y: [0, -30, 30, 0],
                    scale: [1, 1.1, 0.9, 1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[130px] rounded-full" 
            />
            <motion.div 
                animate={{ 
                    x: [0, -40, 40, 0],
                    y: [0, 40, -40, 0],
                    scale: [1, 0.9, 1.1, 1]
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[130px] rounded-full" 
            />

            <div className="max-w-2xl w-full mx-auto space-y-8 relative z-10">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={onBack} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 backdrop-blur-sm">
                        <RotateCcw className="mr-2 h-4 w-4" /> Back to Topics
                    </Button>
                    <Badge variant="outline" className="border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-100/50 dark:bg-sky-500/10 backdrop-blur-md px-4 py-1.5 rounded-full">
                        {remainingCount} words remaining
                    </Badge>
                </div>

                <div className="relative h-[480px] w-full perspective-1000">
                    <AnimatePresence mode="popLayout" custom={exitDirection}>
                        <motion.div
                            key={word.id}
                            custom={exitDirection}
                            variants={cardVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            style={{ x, transformStyle: "preserve-3d" }}
                            whileHover={{ y: -8 }}
                            onDragEnd={(_, info) => {
                                const swipeThreshold = 100;
                                if (info.offset.x > swipeThreshold) {
                                    handleKnowClick();
                                } else if (info.offset.x < -swipeThreshold) {
                                    handleDontKnowClick();
                                }
                            }}
                            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                        >
                        {/* Swipe Feedback Overlays */}
                        {!isEntering && (
                            <>
                                <motion.div
                                    className="absolute inset-0 z-50 pointer-events-none rounded-3xl flex items-center justify-center border-4 border-emerald-500 bg-emerald-500/20"
                                    style={{ opacity: opacityKnow }}
                                >
                                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-full font-bold text-2xl shadow-lg transform rotate-12">
                                        I KNOW
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="absolute inset-0 z-50 pointer-events-none rounded-3xl flex items-center justify-center border-4 border-rose-500 bg-rose-500/20"
                                    style={{ opacity: opacityDontKnow }}
                                >
                                    <div className="bg-rose-500 text-white px-6 py-3 rounded-full font-bold text-2xl shadow-lg transform -rotate-12">
                                        NOT YET
                                    </div>
                                </motion.div>
                            </>
                        )}
                        
                        {/* Springy Flip Container */}
                        <motion.div
                            className="w-full h-full transform-style-3d cursor-pointer relative"
                            animate={{ 
                                rotateY: isFlipped ? 180 : 0
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                mass: 1,
                                bounce: 0.4,
                                duration: 0.8
                            }}
                            onClick={handleFlip}
                        >
                            {/* Front of Card */}
                            <Card className={cn(
                                "absolute inset-0 w-full h-full backface-hidden bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl border-t-white/20 border-l-white/10 dark:border-t-white/10 border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.4)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center p-8 group transition-all rounded-[2.5rem]",
                                isFlipped ? "z-0" : "z-10"
                            )}>
                                <div className="absolute top-8 right-8">
                                    <Star className="h-6 w-6 text-yellow-500/20 group-hover:text-yellow-500 transition-colors" />
                                </div>

                                <div className="text-center space-y-8">
                                    <div className="space-y-2">
                                        <motion.h2
                                            variants={textVariants}
                                            className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 dark:from-sky-300 dark:to-blue-500 filter drop-shadow-[0_0_15px_rgba(0,150,255,0.3)] py-4"
                                        >
                                            {word.word}
                                        </motion.h2>
                                        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-sky-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="rounded-full h-20 w-20 p-0 border-white/10 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md shadow-lg hover:scale-110 active:scale-95 transition-all group/play"
                                        onClick={playAudio}
                                    >
                                        <Volume2 className="h-10 w-10 text-sky-500 dark:text-sky-400 group-hover/play:scale-110 transition-transform" />
                                    </Button>

                                    <div className="flex flex-col items-center gap-2 mt-8 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <p className="text-gray-400 dark:text-gray-500 text-sm font-medium tracking-widest uppercase">Click to flip</p>
                                        <RotateCcw className="h-4 w-4 text-gray-400 animate-spin-slow" />
                                    </div>
                                </div>
                            </Card>

                            {/* Back of Card */}
                            <Card 
                                className={cn(
                                    "absolute inset-0 w-full h-full backface-hidden bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl border-t-white/30 dark:border-t-white/10 border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.4)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center p-12 group transition-all rounded-[2.5rem]",
                                    isFlipped ? "z-10" : "z-0"
                                )}
                                style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                            >
                                <CardContent className="p-0 flex flex-col items-center justify-center h-full text-center space-y-6">
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={isFlipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                        className="flex items-center gap-3 text-sky-500 dark:text-sky-400"
                                    >
                                        <BookOpen className="h-6 w-6" />
                                        <span className="text-xs font-black uppercase tracking-[0.3em]">Definition</span>
                                    </motion.div>
                                    <motion.p 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={isFlipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                        transition={{ delay: 0.35, duration: 0.5 }}
                                        className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white leading-[1.6] max-w-[90%] mx-auto"
                                    >
                                        {word.definition}
                                    </motion.p>
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={isFlipped ? { width: 48 } : { width: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="h-1 bg-sky-500/20 rounded-full mt-4" 
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

                <div className="flex items-center justify-center gap-6 pt-8">
                    <motion.button
                        whileHover={{ 
                            scale: 1.05, 
                            backgroundColor: "rgba(244, 63, 94, 0.05)",
                            borderColor: "rgba(244, 63, 94, 0.6)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFlipped(false);
                            handleDontKnowClick();
                        }}
                        className="flex-1 max-w-[200px] h-14 rounded-full border-2 border-rose-500/30 text-rose-500 hover:border-rose-500 transition-all font-bold text-lg flex items-center justify-center gap-2 relative overflow-hidden group/btn"
                    >
                        <span className="relative z-10">Not Yet</span>
                        <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </motion.button>

                    <motion.button
                        whileHover={{ 
                            scale: 1.05, 
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                            boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.5)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFlipped(false);
                            handleKnowClick();
                        }}
                        className="flex-1 max-w-[200px] h-14 rounded-full bg-emerald-500 text-white font-bold text-lg shadow-[0_8px_20px_rgba(16,185,129,0.3)] transition-colors flex items-center justify-center gap-2 relative overflow-hidden group/btn-know"
                    >
                        <span className="relative z-10 transition-transform group-hover/btn-know:scale-110">I Know</span>
                        {/* Ripple/Glow Effect Emulation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn-know:translate-x-full transition-transform duration-1000 ease-in-out" />
                        <motion.div 
                            className="absolute inset-0 bg-white/30 rounded-full opacity-0"
                            whileTap={{ opacity: 1, scale: 2, transition: { duration: 0.4 } }}
                        />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
