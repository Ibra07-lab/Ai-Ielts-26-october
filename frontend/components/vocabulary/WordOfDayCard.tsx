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
            "relative p-8 rounded-[1.25rem] shadow-xl bg-white dark:bg-card border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white overflow-hidden group min-h-[280px] flex flex-col",
            className
        )}>
            {/* Background decorative element */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-sky-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-sky-500/20 transition-all duration-700" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Word of the Day</h3>
                <button
                    onClick={onSpeakClick}
                    className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-sky-400 transition-colors"
                >
                    <Volume2 className="w-5 h-5" />
                </button>
            </div>

            <div className="mb-4 relative z-10">
                <h4 className="text-4xl font-bold tracking-tight text-white mb-2">{word}</h4>
                <p className="text-sm font-medium text-slate-400 italic">
                    {partOfSpeech} <span className="mx-1">/</span> {phonetic}
                </p>
            </div>

            <p className="text-lg leading-relaxed text-slate-300 mb-auto relative z-10 max-w-md">
                {definition}
            </p>

            <div className="mt-8 relative z-10">
                <Button
                    variant="outline"
                    onClick={onAddClick}
                    className="h-11 px-6 text-sm font-semibold border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white rounded-xl transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add to my deck
                </Button>
            </div>
        </div>
    );
}
