import React from 'react';
import { Volume2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WordOfDayCardProps {
    word: string;
    phonetic: string;
    partOfSpeech: string;
    definition: string;
    onAddClick?: () => void;
    onSpeakClick?: () => void;
    className?: string;
}

export function WordOfDayCard({
    word,
    phonetic,
    partOfSpeech,
    definition,
    onAddClick,
    onSpeakClick,
    className
}: WordOfDayCardProps) {
    return (
        <div className={cn(
            "relative p-8 rounded-[1.5rem] shadow-xl bg-gradient-to-br from-sky-500 to-indigo-600 border-2 border-b-[6px] border-sky-400 dark:border-indigo-500/50 text-white overflow-hidden group min-h-[280px] flex flex-col hover:-translate-y-1 hover:shadow-sky-500/25 transition-all duration-300",
            className
        )}>
            {/* Background decorative pattern */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/20 blur-3xl rounded-full pointer-events-none group-hover:scale-110 transition-all duration-700" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-900/30 blur-3xl rounded-full pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-sky-100/90 shadow-sm">Word of the Day</h3>
                <button
                    onClick={onSpeakClick}
                    className="p-2.5 rounded-[1rem] bg-white/10 text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all backdrop-blur-sm border border-white/10"
                >
                    <Volume2 className="w-5 h-5" />
                </button>
            </div>

            <div className="mb-4 relative z-10">
                <h4 className="text-4xl font-black tracking-tight text-white mb-2 drop-shadow-sm">{word}</h4>
                <p className="text-sm font-semibold text-sky-100">
                    {partOfSpeech} <span className="mx-1 opacity-50">/</span> {phonetic}
                </p>
            </div>

            <p className="text-base leading-relaxed text-sky-50 font-medium mb-auto relative z-10 max-w-md">
                {definition}
            </p>

            <div className="mt-8 relative z-10">
                <Button
                    variant="outline"
                    onClick={onAddClick}
                    className="w-full h-12 px-6 text-sm font-bold border-white/20 bg-white/10 hover:bg-white text-white hover:text-indigo-600 rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-sm shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    Add to my deck
                </Button>
            </div>
        </div>
    );
}
