
import React, { useState, useMemo } from "react";
import { Highlight, HighlightType, Criterion } from "@/types/writing-feedback";
import { motion } from "framer-motion";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
    XCircle,
    CheckCircle2,
    Lightbulb,
    TrendingUp,
    ArrowRight
} from "lucide-react";

interface HighlightedEssayProps {
    text: string;
    highlights: Highlight[];
    activeCriterion?: Criterion | null;
}

// Map criterion to highlight types
const ALL_HIGHLIGHT_TYPES: HighlightType[] = ["grammar", "vocabulary", "coherence", "strength"];

const CRITERION_TO_HIGHLIGHT_TYPE: Record<Criterion, HighlightType[]> = {
    task_response: ["strength"], // Mostly strengths or specific task issues
    coherence_cohesion: ["coherence", "strength"],
    lexical_resource: ["vocabulary", "strength"],
    grammatical_range_accuracy: ["grammar", "strength"],
};

// Colors for underlines and badges - Added text colors for better contrast
const TYPE_CONFIG: Record<HighlightType, { color: string; textColor: string; label: string; bg: string; border: string }> = {
    grammar: {
        color: "decoration-red-500",
        textColor: "text-red-500 dark:text-red-400",
        label: "Grammar",
        bg: "bg-red-100 dark:bg-red-900/30",
        border: "border-red-200 dark:border-red-800"
    },
    vocabulary: {
        color: "decoration-purple-500",
        textColor: "text-purple-600 dark:text-purple-400",
        label: "Vocabulary",
        bg: "bg-purple-100 dark:bg-purple-900/30",
        border: "border-purple-200 dark:border-purple-800"
    },
    coherence: {
        color: "decoration-blue-500",
        textColor: "text-blue-600 dark:text-blue-400",
        label: "Coherence",
        bg: "bg-blue-100 dark:bg-blue-900/30",
        border: "border-blue-200 dark:border-blue-800"
    },
    strength: {
        color: "decoration-green-500",
        textColor: "text-green-600 dark:text-green-400",
        label: "Strength",
        bg: "bg-green-100 dark:bg-green-900/30",
        border: "border-green-200 dark:border-green-800"
    },
};

export function HighlightedEssay({ text, highlights, activeCriterion }: HighlightedEssayProps) {
    // Filter highlights based on active criterion
    const filteredHighlights = useMemo(() => {
        if (!activeCriterion) return highlights;
        const allowedTypes = CRITERION_TO_HIGHLIGHT_TYPE[activeCriterion] || ALL_HIGHLIGHT_TYPES;
        return highlights.filter(h => allowedTypes.includes(h.type));
    }, [highlights, activeCriterion]);

    // Calculate counts for the legend from the *filtered* highlights (or original? usually original to show context)
    // Actually typically context is better, so let's count from 'highlights' but dim them if filtered out
    const typeCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        highlights.forEach(h => {
            counts[h.type] = (counts[h.type] || 0) + 1;
        });
        return counts;
    }, [highlights]);

    // Segment text... (same as before)
    const segments = useMemo(() => {
        const sorted = [...filteredHighlights].sort((a, b) => a.start - b.start);
        const parts: Array<{ text: string; highlight?: Highlight }> = [];
        let lastIndex = 0;

        sorted.forEach(highlight => {
            if (highlight.start > lastIndex) {
                parts.push({ text: text.slice(lastIndex, highlight.start) });
            }
            parts.push({
                text: text.slice(highlight.start, highlight.end),
                highlight
            });
            lastIndex = highlight.end;
        });

        if (lastIndex < text.length) {
            parts.push({ text: text.slice(lastIndex) });
        }
        return parts;
    }, [text, filteredHighlights]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Legend Header */}
            <div className="flex flex-wrap gap-3 p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                {Object.entries(TYPE_CONFIG).map(([type, config]) => {
                    const isRelevant = !activeCriterion ||
                        (CRITERION_TO_HIGHLIGHT_TYPE[activeCriterion] || []).includes(type as HighlightType);

                    const count = typeCounts[type] || 0;
                    if (count === 0 && isRelevant) return null; // Optional: hide if 0? Maybe keep for consistency. Let's keep.

                    return (
                        <div key={type} className={cn(
                            "flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition-opacity duration-200",
                            config.bg,
                            config.border,
                            // Ensure text contrast is high
                            type === 'grammar' ? "text-red-700 dark:text-red-200" :
                                type === 'vocabulary' ? "text-purple-700 dark:text-purple-200" :
                                    type === 'coherence' ? "text-blue-700 dark:text-blue-200" :
                                        "text-green-700 dark:text-green-200",
                            !isRelevant && "opacity-30 grayscale"
                        )}>
                            <div className={cn("w-2 h-2 rounded-full", config.color.replace("decoration-", "bg-"))} />
                            <span>{config.label}</span>
                            <span className="ml-1 opacity-80 px-1.5 py-0.5 bg-white/50 dark:bg-black/20 rounded-md text-[10px]">
                                {count}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Essay Content */}
            <div className="p-6 md:p-8 font-mono text-base leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-300">
                {segments.map((part, i) => {
                    if (!part.highlight) {
                        return <span key={i}>{part.text}</span>;
                    }

                    const config = TYPE_CONFIG[part.highlight.type];
                    const isStrength = part.highlight.type === "strength";

                    return (
                        <HighlightPopover key={part.highlight.id} highlight={part.highlight}>
                            <motion.span
                                initial={{ opacity: 0, backgroundColor: "transparent" }}
                                animate={{ opacity: 1 }}
                                whileHover={{ opacity: 1, backgroundColor: "rgba(0,0,0,0.05)" }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    "cursor-pointer rounded px-0.5 border-b-[2px]",
                                    // Base style: background + text color
                                    config.bg, // Add background color for better visibility
                                    config.textColor,

                                    // Underline style: Wavy for errors, Solid/Double for Strength
                                    isStrength
                                        ? "decoration-solid border-transparent" // Clean look for strengths
                                        : "decoration-wavy underline-offset-4 border-transparent",

                                    // Underline color (if we keep underline)
                                    // Actually, if we use border-b, we don't need decoration-*, but user asked for wavy.
                                    // Let's use 'underline' utility for wavy
                                    isStrength ? "no-underline" : "underline",
                                    config.color
                                )}
                            >
                                {part.text}
                            </motion.span>
                        </HighlightPopover>
                    );
                })}
            </div>
        </div>
    );
}

function HighlightPopover({ highlight, children }: { highlight: Highlight; children: React.ReactNode }) {
    const config = TYPE_CONFIG[highlight.type];
    const isStrength = highlight.type === "strength";

    // Animation variants for the content
    const contentVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 5 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } }
    };

    return (
        <Popover>
            <PopoverTrigger>
                {/* Wrap children to ensure ref handling works reliably if children is a motion component */}
                <span className="cursor-pointer" role="button" tabIndex={0}>
                    {children}
                </span>
            </PopoverTrigger>
            <PopoverContent className="w-[340px] p-0 overflow-hidden border-slate-700 bg-slate-900 shadow-2xl z-50 rounded-xl" sideOffset={5}>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={contentVariants}
                    className="flex flex-col"
                >
                    {/* 1. Header with Badge & Impact */}
                    <div className={cn("px-4 py-3 flex items-center justify-between border-b border-slate-700/50", config.bg)}>
                        <div className="flex items-center gap-2">
                            {isStrength ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                            ) : (
                                <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                            )}
                            <span className={cn("text-sm font-bold", isStrength ? "text-green-700 dark:text-green-300" : "text-slate-800 dark:text-slate-200")}>
                                {config.label}
                            </span>
                        </div>
                        {/* Fake "Impact" badge for now, strictly visual as requested */}
                        {!isStrength && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                Major Impact
                            </span>
                        )}
                    </div>

                    <div className="p-4 space-y-5">
                        {/* 2. Correction Block */}
                        {!isStrength && highlight.corrected && (
                            <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800 flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-slate-400 text-sm line-through decoration-red-500/50 decoration-2">
                                    <XCircle className="w-3.5 h-3.5 text-red-500/70" />
                                    <span>{highlight.original}</span>
                                </div>
                                <div className="flex items-center gap-2 text-green-400 font-medium text-sm">
                                    <div className="min-w-[14px]">
                                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                                    </div>
                                    <span>{highlight.corrected}</span>
                                </div>
                            </div>
                        )}

                        {/* 3. Analysis / Justification */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>Analysis</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                {highlight.justification}
                            </p>
                        </div>

                        {/* 4. Pro Tip / Improvement */}
                        <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                            <div className="flex items-center gap-2 mb-1.5 text-blue-400">
                                <Lightbulb className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wide">Pro Tip</span>
                            </div>
                            <p className="text-sm text-blue-100/90 leading-relaxed">
                                {highlight.improvement_tip}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </PopoverContent>
        </Popover>
    );
}
