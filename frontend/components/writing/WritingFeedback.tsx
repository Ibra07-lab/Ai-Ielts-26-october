import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { EvaluationResult, ScoreExplanation } from '@/types/writing-feedback';
import { ChevronDown, ChevronUp, Clock, AlertCircle, CheckCircle, Loader2, Scale, Link2, Zap, LayoutList } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface WritingFeedbackProps {
    result: EvaluationResult;
    onRetryFeedback?: () => void;
    isLoadingFeedback?: boolean;
}

export const WritingFeedback: React.FC<WritingFeedbackProps> = ({
    result,
    onRetryFeedback,
    isLoadingFeedback = false
}) => {
    const [showFullFeedback, setShowFullFeedback] = useState(false);
    const status = result.teacher_feedback_status || 'not_requested';

    // Calculate band range
    const low = Math.max(0, result.overall_band - 0.5);
    const high = Math.min(9, result.overall_band + 0.5);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* 1. TOP SECTION: Circular Band Score */}
            <div className="flex flex-col items-center justify-center space-y-4">
                <CircularBandScore score={result.overall_band} />

                <div className="text-center">
                    <p className="text-slate-400 font-medium">Estimated Range: <span className="text-white font-bold">{low} - {high}</span></p>
                    {result.timing?.examiner && (
                        <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1">
                            <Clock className="w-3 h-3" /> Scored in {result.timing.examiner}s
                        </p>
                    )}
                </div>
            </div>

            {/* 2. EXAMINER CRITERIA GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.criterion_scores.map((score, idx) => {
                    // Map examiner criterion name to teacher feedback key
                    // Examiner uses "grammatical_range_accuracy", teacher uses "grammatical_range"
                    const getTeacherFeedbackKey = (criterion: string): keyof NonNullable<typeof result.teacher_feedback> | null => {
                        if (criterion === "task_achievement") return "task_achievement";
                        if (criterion === "coherence_cohesion") return "coherence_cohesion";
                        if (criterion === "lexical_resource") return "lexical_resource";
                        if (criterion === "grammatical_range_accuracy") return "grammatical_range";
                        return null;
                    };
                    
                    const teacherKey = getTeacherFeedbackKey(score.criterion);
                    const teacherExplanation = teacherKey && result.teacher_feedback?.[teacherKey]?.score_explanation;
                    
                    return (
                        <ScoreCard
                            key={idx}
                            criterion={score.criterion}
                            band={score.band}
                            justification={score.justification}
                            explanation={teacherExplanation}
                        />
                    );
                })}
            </div>

            {/* 3. DETAILED FEEDBACK SECTION */}
            <div className="space-y-4">

                {/* State: COMPLETE */}
                {status === 'complete' && result.feedback_markdown && (
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col">
                        <div
                            className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex-shrink-0"
                            onClick={() => setShowFullFeedback(!showFullFeedback)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Detailed Feedback Ready</h3>
                                    <p className="text-xs text-slate-500 font-medium">Click to expand analysis</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">
                                {showFullFeedback ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                        </div>

                        {showFullFeedback && (
                            <div className="flex-1 overflow-y-auto max-h-[600px] animate-in slide-in-from-top-2 duration-300">
                                <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
                                    <ReactMarkdown>{result.feedback_markdown}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </Card>
                )}

                {/* State: TIMEOUT / ERROR */}
                {(status === 'timeout' || status === 'error') && (
                    <Card className="p-4 border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-rose-500" />
                                <div>
                                    <p className="font-medium text-rose-700 dark:text-rose-300">Detailed feedback unavailable</p>
                                    <p className="text-xs text-rose-600/80 dark:text-rose-400/80">
                                        {result.teacher_feedback_message || "An error occurred during verification."}
                                    </p>
                                </div>
                            </div>
                            {onRetryFeedback && (
                                <Button
                                    onClick={onRetryFeedback}
                                    variant="outline"
                                    size="sm"
                                    disabled={isLoadingFeedback}
                                    className="border-rose-200 hover:bg-rose-100 hover:text-rose-700 dark:border-rose-800 dark:hover:bg-rose-900/40"
                                >
                                    {isLoadingFeedback ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : "Retry"}
                                </Button>
                            )}
                        </div>
                    </Card>
                )}

                {/* State: LOADING */}
                {(status === 'loading' || isLoadingFeedback) && (
                    <Card className="p-8 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col items-center justify-center text-center space-y-4">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <div className="space-y-1">
                            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Analyzing your writing...</h3>
                            <p className="text-sm text-slate-500 max-w-md">
                                Our AI teacher is reviewing your essay for grammar, vocabulary, and coherence. This usually takes about 30 seconds.
                            </p>
                        </div>
                    </Card>
                )}

                {/* State: NOT REQUESTED */}
                {status === 'not_requested' && !isLoadingFeedback && (
                    <Card className="p-6 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col items-center justify-center text-center">
                        <div className="max-w-md space-y-4">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Want detailed feedback?</h3>
                            <p className="text-sm text-slate-500">
                                Get a comprehensive review including grammar corrections, vocabulary suggestions, and an improved version of your essay.
                            </p>
                            {/* Button here is optional if we assume analysis happens automatically */}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

// --- Sub-components ---

const CircularBandScore: React.FC<{ score: number }> = ({ score }) => {
    const size = 120;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 9) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* SVG Circle */}
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-slate-800"
                />
                {/* Progress Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="text-indigo-500 transition-all duration-1000 ease-out"
                />
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall</span>
                <span className="text-4xl font-bold text-white">{score}</span>
            </div>
        </div>
    );
};

const ScoreCard: React.FC<{
    criterion: string;
    band: number;
    justification: string;
    explanation?: ScoreExplanation;
}> = ({ criterion, band, justification, explanation }) => {
    // Icon mapping
    const getIcon = (c: string) => {
        const lower = c.toLowerCase();
        if (lower.includes('task') || lower.includes('achievement')) return <Scale className="w-5 h-5" />;
        if (lower.includes('coherence')) return <Link2 className="w-5 h-5" />;
        if (lower.includes('lexical')) return <Zap className="w-5 h-5" />; // Zap or Book
        if (lower.includes('grammatical')) return <CheckCircle className="w-5 h-5" />;
        return <LayoutList className="w-5 h-5" />;
    };

    const formatCriterion = (c: string) => {
        return c.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    };

    // Progress bar width
    const percentage = (band / 9) * 100;

    return (
        <Card className="p-5 bg-slate-900 border border-slate-800 shadow-lg hover:border-slate-700 transition-colors">

            {/* Header: Icon + Title + Score */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 text-slate-200">
                    {getIcon(criterion)}
                    <h3 className="font-semibold text-sm">{formatCriterion(criterion)}</h3>
                </div>
                <span className="text-xl font-bold text-emerald-400">{band}</span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full mb-4 overflow-hidden">
                <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Examiner Justification */}
            <p className="text-xs text-slate-400 leading-relaxed">
                {justification}
            </p>

            {/* Score Explanations (from Teacher) */}
            {explanation && (
                <div className="mt-4 space-y-3 pt-3 border-t border-slate-700/50">
                    <div>
                        <h4 className="text-xs font-bold text-slate-300 mb-1">Why This Score?</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{explanation.why_this_score}</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-300 mb-1">Band Descriptor Match</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{explanation.band_descriptor_evidence}</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-emerald-400 mb-1">Path to Next Band</h4>
                        <p className="text-xs text-emerald-300/80 leading-relaxed">{explanation.path_to_improvement}</p>
                    </div>
                </div>
            )}
        </Card>
    );
};
