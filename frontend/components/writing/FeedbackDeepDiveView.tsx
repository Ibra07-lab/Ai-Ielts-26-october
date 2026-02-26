import { useState, useMemo } from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, AlertTriangle, BookOpen, PenTool, Layout, Scale, AlignLeft, AlertCircle, ArrowRight, Info, Target, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HighlightedEssay, Correction } from "./HighlightedEssay";
import { EvaluationResult, CoachingResult, Criterion, Highlight } from "@/types/writing-feedback";
import { transformToHighlights } from "@/utils/feedback-transform";
import { cn } from "@/lib/utils";

interface FeedbackDeepDiveViewProps {
    essay: string;
    evaluation: EvaluationResult;
    coaching: CoachingResult;
    activeCriterion: Criterion | null;
    onBack: () => void;
    onCriterionChange: (criterion: Criterion) => void;
}

const CRITERIA_CONFIG: Record<string, { label: string, icon: any, description: string }> = {
    task_response: {
        label: "Task Response",
        icon: Scale,
        description: "How well you addressed the prompt and developed your ideas."
    },
    task_achievement: {
        label: "Task Achievement",
        icon: Scale,
        description: "How well you achieved the task requirements."
    },
    coherence_cohesion: {
        label: "Coherence",
        icon: Layout,
        description: "The flow of your essay and how well ideas are connected."
    },
    lexical_resource: {
        label: "Vocabulary",
        icon: BookOpen,
        description: "The range and accuracy of vocabulary used."
    },
    grammatical_range_accuracy: {
        label: "Grammar",
        icon: PenTool,
        description: "Variety of sentence structures and grammatical correctness."
    }
};

const ORDERED_CRITERIA: Criterion[] = [
    "task_response",
    "coherence_cohesion",
    "lexical_resource",
    "grammatical_range_accuracy"
];

export function FeedbackDeepDiveView({
    essay,
    evaluation,
    coaching,
    activeCriterion,
    onBack,
    onCriterionChange
}: FeedbackDeepDiveViewProps) {
    // Helper to map frontend criterion keys to backend detailed_feedback keys
    const getDetailedFeedback = (crit: Criterion) => {
        if (!evaluation.detailed_feedback) return null;
        switch (crit) {
            case 'task_response': return evaluation.detailed_feedback.task_response;
            case 'task_achievement': return evaluation.detailed_feedback.task_response; // Map both to TR
            case 'coherence_cohesion': return evaluation.detailed_feedback.coherence;
            case 'lexical_resource': return evaluation.detailed_feedback.lexical;
            case 'grammatical_range_accuracy': return evaluation.detailed_feedback.grammar;
            default: return null;
        }
    };

    // Default to first criterion if none active
    const currentCriterion = activeCriterion || "task_response";

    // Transform coaching text into highlights
    const highlights = useMemo(() => {
        return transformToHighlights(essay, coaching);
    }, [essay, coaching]);

    // Helper to get specific feedback items for the Right Column
    const getFeedbackItems = (criterion: Criterion) => {
        const items: { type: 'strength' | 'weakness' | 'info', title: string, content: string }[] = [];

        // Helper to get AI-generated strength for a criterion
        const getAIStrength = (criterionKey: string) => {
            return coaching.raw_explainer_output?.criterion_strengths?.find(
                (s: any) => s.criterion === criterionKey
            );
        };

        if (criterion === 'task_response' || criterion === 'task_achievement') {
            coaching.strengths.forEach(s => items.push({ type: 'strength', title: 'Strength', content: s }));
            coaching.weaknesses.forEach(w => items.push({ type: 'weakness', title: 'Improvement Area', content: w }));
            if (coaching.action_plan) {
                items.push({ type: 'info', title: 'Action Plan', content: coaching.action_plan[0] });
            }
        } else if (criterion === 'coherence_cohesion') {
            const ccScore = evaluation.criterion_scores.find(s => s.criterion === 'coherence_cohesion')?.band || 0;
            const aiStrength = getAIStrength('coherence_cohesion');

            if (aiStrength) {
                items.push({
                    type: 'strength',
                    title: aiStrength.title,
                    content: aiStrength.description + (aiStrength.evidence_from_essay ? ` For example: "${aiStrength.evidence_from_essay}"` : '')
                });
            } else {
                // Fallback templates
                if (ccScore >= 8) {
                    items.push({ type: 'strength', title: 'Masterful Essay Flow', content: "Your essay demonstrates exceptional coherence with ideas flowing naturally from one to the next. Paragraph transitions are seamless, and you use sophisticated referencing techniques (this, such, these) to connect ideas." });
                } else if (ccScore >= 7) {
                    items.push({ type: 'strength', title: 'Strong Logical Organization', content: "Your ideas are well-organized with clear logical progression throughout the essay. Each paragraph builds upon the previous one, and your use of cohesive devices generally helps guide the reader." });
                } else if (ccScore >= 6) {
                    items.push({ type: 'strength', title: 'Clear Essay Structure', content: "Your essay has a recognizable structure with an introduction, body paragraphs, and conclusion. Paragraphing is logical, and each paragraph generally focuses on one main idea." });
                } else if (ccScore >= 5) {
                    items.push({ type: 'strength', title: 'Basic Organization Present', content: "You've made an effort to organize your ideas into paragraphs, which shows understanding of essay structure. Building on this foundation will significantly boost your coherence score." });
                }
            }

            coaching.coherence_issues.forEach(i => items.push({
                type: 'weakness',
                title: 'Cohesion Issue',
                content: `${i.text} -> ${i.corrected || i.suggestion} (${i.reason || 'see suggestion'})`
            }));

            if (ccScore < 8 && ccScore >= 5) {
                items.push({
                    type: 'info', title: 'Path to Improvement', content: ccScore >= 7
                        ? "To break into Band 8, focus on eliminating mechanical linking patterns. Use sophisticated referencing naturally (this approach, such findings)."
                        : "Vary your linking devices - avoid mechanical patterns like 'Firstly, Secondly'. Improve paragraph transitions through meaning, not just adding connectors."
                });
            }
        } else if (criterion === 'lexical_resource') {
            const lrScore = evaluation.criterion_scores.find(s => s.criterion === 'lexical_resource')?.band || 0;
            const aiStrength = getAIStrength('lexical_resource');

            if (aiStrength) {
                items.push({
                    type: 'strength',
                    title: aiStrength.title,
                    content: aiStrength.description + (aiStrength.evidence_from_essay ? ` For example: "${aiStrength.evidence_from_essay}"` : '')
                });
            } else {
                // Fallback templates
                if (lrScore >= 8) {
                    items.push({ type: 'strength', title: 'Sophisticated Word Choice', content: "Your vocabulary demonstrates sophistication and precision throughout the essay. You use less common words naturally and accurately, showing awareness of collocations and subtle word meanings." });
                } else if (lrScore >= 7) {
                    items.push({ type: 'strength', title: 'Good Vocabulary Range', content: "You show a solid range of vocabulary with some less common words used appropriately. Your word choices are generally accurate and contribute to the clarity of your argument." });
                } else if (lrScore >= 6) {
                    items.push({ type: 'strength', title: 'Adequate Vocabulary', content: "Your vocabulary is sufficient for the task, and you've attempted to use some less common words. You can express your ideas clearly, which is the foundation for good vocabulary use." });
                } else if (lrScore >= 5) {
                    items.push({ type: 'strength', title: 'Basic Vocabulary Present', content: "You have basic vocabulary to express your main ideas. While some word choices may be limited, you're able to communicate your position." });
                }
            }

            coaching.vocabulary_suggestions.forEach(v => items.push({
                type: 'weakness',
                title: 'Vocabulary Upgrade',
                content: `**"${v.original}"** is quite basic. Consider using: **${v.better_options.join(", ")}** instead. ${v.context}`
            }));

            if (lrScore < 8 && lrScore >= 5) {
                items.push({
                    type: 'info', title: 'Path to Improvement', content: lrScore >= 7
                        ? "To break into Band 8, focus on natural collocation use. Avoid overused phrases and demonstrate precise word choice."
                        : "Focus on learning topic-specific collocations and synonyms for common words. Avoid repeating the same words."
                });
            }
        } else if (criterion === 'grammatical_range_accuracy') {
            const grScore = evaluation.criterion_scores.find(s => s.criterion === 'grammatical_range_accuracy')?.band || 0;
            const aiStrength = getAIStrength('grammatical_range_accuracy');

            if (aiStrength) {
                items.push({
                    type: 'strength',
                    title: aiStrength.title,
                    content: aiStrength.description + (aiStrength.evidence_from_essay ? ` For example: "${aiStrength.evidence_from_essay}"` : '')
                });
            } else {
                // Fallback templates
                if (grScore >= 8) {
                    items.push({ type: 'strength', title: 'Excellent Grammar Control', content: "Your essay demonstrates excellent grammatical control with a wide range of complex structures used accurately. Any errors are rare and do not impede communication." });
                } else if (grScore >= 7) {
                    items.push({ type: 'strength', title: 'Good Grammatical Range', content: "You use a variety of sentence structures including complex sentences with reasonable accuracy. Your grammar generally supports clear communication." });
                } else if (grScore >= 6) {
                    items.push({ type: 'strength', title: 'Adequate Grammar', content: "Your grammar is generally understandable with a mix of simple and complex sentences. While errors occur, they don't significantly impair meaning." });
                } else if (grScore >= 5) {
                    items.push({ type: 'strength', title: 'Basic Structures Present', content: "You can form basic sentences that communicate your meaning. While errors are noticeable, core ideas come through." });
                }
            }

            coaching.grammar_errors.forEach(g => items.push({
                type: 'weakness',
                title: 'Grammar Correction',
                content: `**Original:** "${g.original}" → **Corrected:** "${g.corrected}" — ${g.explanation}`
            }));

            if (grScore < 8 && grScore >= 5) {
                items.push({
                    type: 'info', title: 'Path to Improvement', content: grScore >= 7
                        ? "To reach Band 8, focus on consistent accuracy in complex structures. Practice inversions, cleft sentences, and participle clauses."
                        : "Focus on eliminating systematic errors: article usage, subject-verb agreement, and tense consistency are common problem areas."
                });
            }
        }

        return items;
    };

    // Tab State
    const [activeTab, setActiveTab] = useState<'report' | 'strengths' | 'issues' | 'summary'>('report');

    // Essay View Mode: 'original' or 'improved'
    const [essayViewMode, setEssayViewMode] = useState<'original' | 'improved'>('original');

    // Reset tab when criterion changes
    useMemo(() => {
        setActiveTab('report');
    }, [currentCriterion]);

    // Build corrections array from coaching data
    const corrections: Correction[] = useMemo(() => {
        const result: Correction[] = [];

        // Grammar errors
        if (coaching.grammar_errors) {
            for (const err of coaching.grammar_errors) {
                if (err.original && err.corrected) {
                    result.push({
                        original: err.original,
                        corrected: err.corrected,
                        explanation: err.explanation || 'Grammar correction',
                        type: 'grammar',
                        tip: err.tip
                    });
                }
            }
        }

        // Vocabulary suggestions 
        if (coaching.vocabulary_suggestions) {
            for (const sug of coaching.vocabulary_suggestions) {
                if (sug.original && sug.better_options && sug.better_options.length > 0) {
                    result.push({
                        original: sug.original,
                        corrected: sug.better_options[0], // Use first suggestion
                        explanation: sug.context || 'Better vocabulary choice',
                        type: 'vocabulary'
                    });
                }
            }
        }

        // Coherence issues
        if (coaching.coherence_issues) {
            for (const issue of coaching.coherence_issues) {
                const corrected = issue.corrected || issue.suggestion;
                if (issue.text && corrected) {
                    result.push({
                        original: issue.text,
                        corrected: corrected,
                        explanation: issue.reason || 'Improved coherence',
                        type: 'coherence'
                    });
                }
            }
        }

        return result;
    }, [coaching]);

    const feedbackItems = getFeedbackItems(currentCriterion);
    const Icon = CRITERIA_CONFIG[currentCriterion].icon;
    const currentScore = evaluation.criterion_scores.find(s => s.criterion === currentCriterion)?.band || 0;

    // Filter items for tabs
    const strengthItems = feedbackItems.filter(i => i.type === 'strength');
    const issueItems = feedbackItems.filter(i => i.type === 'weakness' || (i.type === 'info' && i.title !== 'Action Plan' && i.title !== 'To Reach Band 8'));
    const actionItems = feedbackItems.filter(i => i.title === 'Action Plan' || i.title === 'To Reach Band 8');

    return (
        <div className="flex flex-col h-full bg-[#0f172a] text-slate-100 overflow-hidden">

            {/* TOP BAR: Scores & Criteria Selection */}
            <div className="h-14 shrink-0 bg-[#0f172a] border-b border-slate-800 flex items-center px-4 justify-between z-30">
                {/* Left: Back Button + Overall Score */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800 h-8 px-3 text-xs"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back
                    </Button>

                    <div className="h-7 w-px bg-slate-800" />

                    <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-white tracking-tight">Band {evaluation.overall_band}</span>
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-700">{evaluation.word_count}w</span>
                    </div>

                    <div className="h-7 w-px bg-slate-800" />

                    {/* Criteria Tabs - Horizontal */}
                    <div className="flex items-center gap-1">
                        {ORDERED_CRITERIA.map(crit => {
                            const config = CRITERIA_CONFIG[crit];
                            const score = evaluation.criterion_scores.find(s => s.criterion === crit);
                            const isActive = currentCriterion === crit;
                            const scoreVal = score?.band || 0;

                            let scoreColor = "text-rose-400";
                            if (scoreVal >= 7) scoreColor = "text-emerald-400";
                            else if (scoreVal >= 6) scoreColor = "text-amber-400";

                            return (
                                <button
                                    key={crit}
                                    onClick={() => onCriterionChange(crit)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all duration-200",
                                        isActive
                                            ? "bg-slate-800 border-slate-600 shadow-md"
                                            : "bg-transparent border-transparent hover:bg-slate-800/50"
                                    )}
                                >
                                    <span className={cn("text-[11px] font-bold whitespace-nowrap", isActive ? "text-white" : "text-slate-400")}>
                                        {config.label}
                                    </span>
                                    <span className={cn("text-xs font-mono font-black", scoreColor)}>
                                        {scoreVal}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Legend */}
                <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest pl-4 border-l border-slate-800 items-center">
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Strength</span>
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Weakness</span>
                </div>
            </div>

            {/* MAIN CONTENT AREA: 2 Columns */}
            <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* COLUMN 1: LEFT ESSAY (40%) */}
                <div className="w-[40%] flex flex-col bg-[#0f172a] relative border-r border-slate-800/50 min-h-0 overflow-hidden">
                    {/* Toggle Buttons */}
                    <div className="shrink-0 px-6 py-3 border-b border-slate-800/50 bg-slate-900/50">
                        <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700 w-fit">
                            <button
                                onClick={() => setEssayViewMode('original')}
                                className={cn(
                                    "px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2",
                                    essayViewMode === 'original'
                                        ? "bg-slate-700 text-white shadow-lg"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                                )}
                            >
                                <FileText className="w-3.5 h-3.5" />
                                Original
                            </button>
                            <button
                                onClick={() => setEssayViewMode('improved')}
                                className={cn(
                                    "px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2",
                                    essayViewMode === 'improved'
                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                                        : "text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/20"
                                )}
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Improved
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2">
                            {essayViewMode === 'original'
                                ? "🔍 Hover over underlined text to see corrections"
                                : "✨ Showing essay with all corrections applied"}
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4">
                        <div className="leading-relaxed text-lg text-slate-200 font-serif">
                            <HighlightedEssay
                                essayText={essay}
                                highlights={highlights
                                    .filter(h => {
                                        if (activeTab === 'strengths') return h.type === 'strength';
                                        if (activeTab === 'issues') return h.type !== 'strength';
                                        return true;
                                    })
                                    .map(h => ({
                                        text: h.original,
                                        type: h.type === 'strength' ? 'strength' : 'weakness'
                                    }))}
                                corrections={corrections}
                                viewMode={essayViewMode}
                            />
                        </div>
                        <div className="h-20" /> {/* Bottom padding */}
                    </div>
                </div>

                {/* COLUMN 2: RIGHT FEEDBACK (60%) */}
                <div className="w-[60%] bg-[#111827] flex flex-col min-h-0 overflow-hidden relative">
                    {/* Feedback Header - compact */}
                    <div className="px-5 py-2.5 border-b border-slate-800 bg-[#1e293b]/30 shrink-0 z-20 flex items-center justify-between gap-4">
                        {/* Left: Criterion label + score badge */}
                        <div className="flex items-center gap-3 min-w-0">
                            {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-black text-white text-sm leading-tight">{CRITERIA_CONFIG[currentCriterion].label}</h3>
                                    <div className={cn(
                                        "px-2 py-0.5 rounded text-xs font-black shrink-0",
                                        currentScore >= 7 ? "bg-emerald-500/15 text-emerald-400" :
                                            currentScore >= 6 ? "bg-amber-500/15 text-amber-400" :
                                                "bg-rose-500/15 text-rose-400"
                                    )}>
                                        B{currentScore}
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-tight truncate">{CRITERIA_CONFIG[currentCriterion].description}</p>
                            </div>
                        </div>

                        {/* Right: Tabs */}
                        <div className="flex bg-slate-900/60 p-0.5 rounded-lg border border-slate-800 shrink-0">
                            <button
                                onClick={() => setActiveTab('report')}
                                className={cn(
                                    "px-3 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5",
                                    activeTab === 'report'
                                        ? "bg-indigo-500 text-white shadow-md"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                )}
                            >
                                <Layout className="w-3 h-3" /> Report
                            </button>
                            <button
                                onClick={() => setActiveTab('strengths')}
                                className={cn(
                                    "px-3 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5",
                                    activeTab === 'strengths'
                                        ? "bg-emerald-500 text-white shadow-md"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                )}
                            >
                                <CheckCircle2 className="w-3 h-3" /> Strengths
                                <span className="bg-white/10 px-1 py-px rounded text-[9px]">{strengthItems.length}</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('issues')}
                                className={cn(
                                    "px-3 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5",
                                    activeTab === 'issues'
                                        ? "bg-rose-500 text-white shadow-md"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                )}
                            >
                                <AlertTriangle className="w-3 h-3" /> Issues
                                <span className="bg-white/10 px-1 py-px rounded text-[9px]">{issueItems.length}</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('summary')}
                                className={cn(
                                    "px-3 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5",
                                    activeTab === 'summary'
                                        ? "bg-amber-500 text-white shadow-md"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                )}
                            >
                                <Target className="w-3 h-3" /> Topics
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 h-0">

                        {/* TAB: REPORT */}
                        {activeTab === 'report' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

                                {/* SCORE OVERVIEW (shows for ALL criteria) */}
                                {(() => {
                                    const criterionScore = evaluation.criterion_scores.find(s => s.criterion === currentCriterion);
                                    const justification = criterionScore?.justification || '';
                                    const score = criterionScore?.band || 0;

                                    return justification && (
                                        <div className="rounded-xl border border-slate-700 bg-slate-800/30 overflow-hidden">
                                            <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "p-1.5 rounded text-white",
                                                        score >= 7 ? "bg-emerald-500" : score >= 6 ? "bg-amber-500" : "bg-rose-500"
                                                    )}>
                                                        <BookOpen className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Score Overview</span>
                                                </div>
                                                <span className={cn(
                                                    "text-sm font-bold px-3 py-1 rounded-full",
                                                    score >= 7 ? "bg-emerald-500/20 text-emerald-400" : score >= 6 ? "bg-amber-500/20 text-amber-400" : "bg-rose-500/20 text-rose-400"
                                                )}>
                                                    Band {score}
                                                </span>
                                            </div>
                                            <div className="p-5 space-y-4">
                                                {/* Highlight penalty messages in justification */}
                                                <p className="text-sm text-slate-300 leading-relaxed">
                                                    {justification.split(/(Score capped at Band \d|capped at Band \d|-\d band|Band \d MAX)/gi).map((part, i) => {
                                                        const isPenalty = /Score capped|capped at Band|-\d band|Band \d MAX/i.test(part);
                                                        return isPenalty ? (
                                                            <span key={i} className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-medium border border-rose-500/30">
                                                                ⚠️ {part}
                                                            </span>
                                                        ) : (
                                                            <span key={i}>
                                                                {part.split(/(\*\*.*?\*\*)/g).map((subPart, j) =>
                                                                    subPart.startsWith('**') && subPart.endsWith('**') ? (
                                                                        <strong key={j} className="text-white font-bold bg-indigo-500/10 px-1 rounded">{subPart.slice(2, -2)}</strong>
                                                                    ) : subPart
                                                                )}
                                                            </span>
                                                        );
                                                    })}
                                                </p>

                                                {/* NEW: Detailed Feedback "Why Score Is Here" */}
                                                {(() => {
                                                    const details = getDetailedFeedback(currentCriterion);
                                                    if (details?.why_score_is_here) {
                                                        return (
                                                            <div className="mt-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                                                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                                                                    <Info className="w-3 h-3" /> Examiner's Verdict
                                                                </h4>
                                                                <p className="text-sm text-slate-200 italic leading-relaxed">
                                                                    "{details.why_score_is_here}"
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })()}

                                                {/* Improvement tip section for scores below 8 */}
                                                {score < 8 && (
                                                    <div className="pt-3 border-t border-slate-700">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <ArrowRight className="w-4 h-4 text-indigo-400" />
                                                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                                                To reach Band {Math.min(score + 1, 9)}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-400 leading-relaxed">
                                                            {currentCriterion === 'task_response' && score < 7 && "Develop your position more fully with specific examples, concrete evidence, and deeper analysis of the issue."}
                                                            {currentCriterion === 'task_response' && score >= 7 && "Add more nuanced reasoning with sophisticated examples. Show deeper critical thinking and address potential counterarguments."}
                                                            {currentCriterion === 'coherence_cohesion' && score < 7 && "Vary your cohesive devices - avoid mechanical patterns like 'Firstly, Secondly'. Improve paragraph transitions and logical flow."}
                                                            {currentCriterion === 'coherence_cohesion' && score >= 7 && "Ensure seamless paragraph transitions and use referencing naturally (this, such, these). Cohesion should be effortless."}
                                                            {currentCriterion === 'lexical_resource' && score < 7 && "Expand your vocabulary range with less common words. Focus on collocations and avoid basic word choices like 'very good'."}
                                                            {currentCriterion === 'lexical_resource' && score >= 7 && "Use more sophisticated vocabulary with natural collocations. Show precise word choice and awareness of style throughout."}
                                                            {currentCriterion === 'grammatical_range_accuracy' && (() => {
                                                                const gf = coaching.raw_explainer_output?.grammar_feedback;
                                                                if (gf?.grammar_priority) {
                                                                    const priorityMsg = gf.grammar_priority === 'critical'
                                                                        ? `Critical: Fix the ${gf.pattern_lessons?.length || 0} systematic error pattern(s) below — they are directly capping your score.`
                                                                        : gf.grammar_priority === 'important'
                                                                            ? `Focus on the ${gf.pattern_lessons?.length || 0} grammar pattern(s) identified below. Fixing them can push your score up by 0.5-1.0 bands.`
                                                                            : gf.grammar_priority === 'minor'
                                                                                ? "Your grammar is mostly accurate. Focus on sentence complexity upgrades below for the next band."
                                                                                : "Your grammar control is strong. See complexity suggestions to demonstrate range.";
                                                                    return priorityMsg;
                                                                }
                                                                return score < 7
                                                                    ? "Use more complex sentence structures (relative clauses, conditionals). Reduce basic errors in articles and tenses."
                                                                    : "Increase error-free complex sentences. Show consistent accuracy in advanced structures like inversion and emphasis.";
                                                            })()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* NEW: Examiner's Breakdown Card (Weaknesses/Strengths from Detailed Report) */}
                                {(() => {
                                    const details = getDetailedFeedback(currentCriterion);
                                    if (!details) return null;

                                    const hasWeakSpots = details.weak_spots && details.weak_spots.length > 0;
                                    const hasStrengths = details.strengths && details.strengths.length > 0;

                                    if (!hasWeakSpots && !hasStrengths) return null;

                                    return (
                                        <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800/20 shadow-lg">
                                            <div className="bg-slate-800/40 p-4 border-b border-slate-700 flex items-center gap-2">
                                                <div className="p-1.5 bg-slate-700 rounded text-slate-300"><FileText className="w-4 h-4" /></div>
                                                <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Detailed Analysis</span>
                                            </div>
                                            <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {/* Weak Spots */}
                                                {hasWeakSpots && (
                                                    <div className="space-y-3">
                                                        <h4 className="text-xs font-bold text-rose-400 uppercase flex items-center gap-2">
                                                            <AlertCircle className="w-3.5 h-3.5" /> Weak Points
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {details.weak_spots.map((spot, idx) => (
                                                                <li key={idx} className="text-sm text-slate-300 bg-rose-950/10 p-2.5 rounded border border-rose-900/20 flex items-start gap-2">
                                                                    <span className="text-rose-500 mt-0.5">•</span>
                                                                    <span>{spot}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Strengths */}
                                                {hasStrengths && (
                                                    <div className="space-y-3">
                                                        <h4 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-2">
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Key Strengths
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {details.strengths.map((strength, idx) => (
                                                                <li key={idx} className="text-sm text-slate-300 bg-emerald-950/10 p-2.5 rounded border border-emerald-900/20 flex items-start gap-2">
                                                                    <span className="text-emerald-500 mt-0.5">•</span>
                                                                    <span>{strength}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* STRATEGIC FOCUS CARDS - Different data for each criterion */}

                                {/* 1. STRATEGY CARD - Task Response */}
                                {currentCriterion === 'task_response' && coaching.raw_coach_output?.the_one_big_change && (
                                    <div className="rounded-xl overflow-hidden border border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 shadow-xl">
                                        <div className="bg-indigo-500/10 p-4 border-b border-indigo-500/20 flex items-center gap-2">
                                            <div className="p-1.5 bg-indigo-500 rounded text-white"><Layout className="w-4 h-4" /></div>
                                            <span className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Strategic Focus</span>
                                        </div>
                                        <div className="p-4 grid grid-cols-2 gap-4">
                                            <div className="space-y-3 col-span-2">
                                                <p className="text-sm text-indigo-200/80 italic border-l-2 border-indigo-500/50 pl-3">
                                                    "{coaching.raw_coach_output.the_one_big_change.why_this_matters_most}"
                                                </p>
                                            </div>
                                            <div className="col-span-1 space-y-2">
                                                <div className="text-[10px] font-bold text-rose-400 uppercase flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Stop Doing</div>
                                                <p className="text-sm text-slate-300 bg-rose-950/20 p-3 rounded border border-rose-900/30 h-full">
                                                    {coaching.raw_coach_output.the_one_big_change.what_to_stop_doing}
                                                </p>
                                            </div>
                                            <div className="col-span-1 space-y-2">
                                                <div className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Start Doing</div>
                                                <p className="text-sm text-slate-300 bg-emerald-950/20 p-3 rounded border border-emerald-900/30 h-full">
                                                    {coaching.raw_coach_output.the_one_big_change.what_to_start_doing}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 2. STRATEGY CARD - Coherence & Cohesion */}
                                {currentCriterion === 'coherence_cohesion' && (coaching.coherence_issues?.length > 0 || coaching.raw_explainer_output?.cohesion_fixes?.length > 0) && (
                                    <div className="rounded-xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-orange-900/20 shadow-xl">
                                        <div className="bg-amber-500/10 p-4 border-b border-amber-500/20 flex items-center gap-2">
                                            <div className="p-1.5 bg-amber-500 rounded text-white"><Layout className="w-4 h-4" /></div>
                                            <span className="text-sm font-bold text-amber-300 uppercase tracking-wider">Cohesion Improvements</span>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            {coaching.coherence_issues?.slice(0, 2).map((issue: any, idx: number) => (
                                                <div key={`coh-${idx}`} className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <div className="text-[10px] font-bold text-rose-400 uppercase">Original</div>
                                                        <p className="text-sm text-slate-400 line-through decoration-rose-500/50 bg-rose-950/20 p-3 rounded border border-rose-900/30">
                                                            "{issue.text}"
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="text-[10px] font-bold text-emerald-400 uppercase">Improved</div>
                                                        <p className="text-sm text-emerald-100 bg-emerald-950/20 p-3 rounded border border-emerald-900/30">
                                                            "{issue.suggestion}"
                                                        </p>
                                                    </div>
                                                    {issue.reason && (
                                                        <div className="col-span-2 text-xs text-slate-400 bg-slate-800/50 p-2 rounded">
                                                            <span className="text-amber-400 font-bold">Why: </span>{issue.reason}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {coaching.coherence_issues?.length === 0 && coaching.raw_explainer_output?.cohesion_fixes?.slice(0, 2).map((fix: any, idx: number) => (
                                                <div key={`fix-${idx}`} className="space-y-3">
                                                    <div className="bg-amber-950/30 p-3 rounded border border-amber-900/30">
                                                        <div className="text-[10px] font-bold text-amber-400 mb-1">Technique: {fix.technique_explanation}</div>
                                                        <p className="text-sm text-slate-300">"{fix.improved_sentence}"</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 3. STRATEGY CARD - Lexical Resource */}
                                {currentCriterion === 'lexical_resource' && coaching.vocabulary_suggestions?.length > 0 && (
                                    <div className="rounded-xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 shadow-xl">
                                        <div className="bg-cyan-500/10 p-4 border-b border-cyan-500/20 flex items-center gap-2">
                                            <div className="p-1.5 bg-cyan-500 rounded text-white"><Layout className="w-4 h-4" /></div>
                                            <span className="text-sm font-bold text-cyan-300 uppercase tracking-wider">Vocabulary Upgrades</span>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {coaching.vocabulary_suggestions.slice(0, 3).map((vocab: any, idx: number) => (
                                                <div key={`vocab-${idx}`} className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                                                    <div className="flex-1">
                                                        <span className="text-sm text-rose-300 line-through decoration-rose-500/50">"{vocab.original}"</span>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-cyan-500 shrink-0" />
                                                    <div className="flex-1">
                                                        <div className="text-[10px] font-bold text-cyan-400 uppercase mb-1.5 flex items-center gap-2">
                                                            Band Booster
                                                            <span className="bg-cyan-500/20 px-1.5 py-0.5 rounded text-[9px] text-cyan-300 border border-cyan-500/30">Level +1.0</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {vocab.better_options.map((opt: string, i: number) => (
                                                                <span key={i} className="px-2 py-1 bg-cyan-500/20 text-cyan-200 text-sm rounded-lg border border-cyan-500/30">
                                                                    {opt}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {coaching.vocabulary_suggestions.length > 0 && coaching.vocabulary_suggestions[0].context && (
                                                <div className="text-xs text-slate-400 bg-slate-800/50 p-3 rounded border border-slate-700/50">
                                                    <span className="text-cyan-400 font-bold">Tip: </span>{coaching.vocabulary_suggestions[0].context}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 4a. GRAMMAR PATTERN LESSONS — Grouped error patterns with examples from the essay */}
                                {currentCriterion === 'grammatical_range_accuracy' && coaching.raw_explainer_output?.grammar_feedback?.pattern_lessons?.length > 0 && (
                                    <div className="rounded-xl overflow-hidden border border-violet-500/30 bg-gradient-to-br from-violet-900/20 to-purple-900/20 shadow-xl">
                                        <div className="bg-violet-500/10 p-4 border-b border-violet-500/20 flex items-center gap-2">
                                            <div className="p-1.5 bg-violet-500 rounded text-white"><PenTool className="w-4 h-4" /></div>
                                            <span className="text-sm font-bold text-violet-300 uppercase tracking-wider">Grammar Lessons from Your Essay</span>
                                        </div>
                                        <div className="p-6 space-y-6">
                                            {coaching.raw_explainer_output.grammar_feedback.pattern_lessons.map((lesson: any, idx: number) => (
                                                <div key={`lesson-${idx}`} className="space-y-4">
                                                    {/* Pattern Header */}
                                                    <div className="flex items-center gap-3">
                                                        <span className="bg-violet-500/20 text-violet-300 px-2.5 py-1 rounded-full text-xs font-bold border border-violet-500/30">
                                                            Pattern {idx + 1}
                                                        </span>
                                                        <h4 className="text-sm font-bold text-white">
                                                            {lesson.pattern_name_friendly || lesson.error_pattern || 'Grammar Pattern'}
                                                        </h4>
                                                    </div>

                                                    {/* The Rule */}
                                                    {lesson.the_rule && (
                                                        <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-lg p-4">
                                                            <div className="text-[10px] font-bold text-indigo-400 uppercase mb-2 flex items-center gap-1.5">
                                                                <BookOpen className="w-3 h-3" /> The Rule
                                                            </div>
                                                            <p className="text-sm text-slate-200 leading-relaxed">{lesson.the_rule}</p>
                                                        </div>
                                                    )}

                                                    {/* Examples from the essay */}
                                                    {lesson.examples_from_essay?.length > 0 && (
                                                        <div className="space-y-3">
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase">From Your Essay:</div>
                                                            {lesson.examples_from_essay.map((ex: any, exIdx: number) => (
                                                                <div key={`ex-${idx}-${exIdx}`} className="grid grid-cols-2 gap-3">
                                                                    <div className="space-y-1">
                                                                        <div className="text-[10px] font-bold text-rose-400 uppercase">Your Version</div>
                                                                        <p className="text-sm text-rose-200/80 bg-rose-950/20 p-3 rounded border border-rose-900/30">
                                                                            {ex.error_highlighted ? (
                                                                                <>
                                                                                    {ex.original?.split(ex.error_highlighted).map((part: string, pi: number, arr: string[]) => (
                                                                                        <span key={pi}>
                                                                                            {part}
                                                                                            {pi < arr.length - 1 && (
                                                                                                <span className="bg-rose-500/30 text-rose-200 px-1 rounded font-bold underline decoration-wavy decoration-rose-500">
                                                                                                    {ex.error_highlighted}
                                                                                                </span>
                                                                                            )}
                                                                                        </span>
                                                                                    ))}
                                                                                </>
                                                                            ) : (
                                                                                <span className="line-through decoration-rose-500/50">"{ex.original}"</span>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <div className="text-[10px] font-bold text-emerald-400 uppercase">Correct Version</div>
                                                                        <p className="text-sm text-emerald-100 bg-emerald-950/20 p-3 rounded border border-emerald-900/30">
                                                                            "{ex.corrected}"
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Memory Trick */}
                                                    {lesson.memory_trick && (
                                                        <div className="flex items-start gap-2 bg-amber-950/20 border border-amber-500/20 rounded-lg p-3">
                                                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                                            <div>
                                                                <div className="text-[10px] font-bold text-amber-400 uppercase mb-1">Memory Trick</div>
                                                                <p className="text-xs text-amber-100/80">{lesson.memory_trick}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Divider between lessons */}
                                                    {idx < coaching.raw_explainer_output.grammar_feedback.pattern_lessons.length - 1 && (
                                                        <div className="border-t border-slate-700/50 pt-2" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 4b. SENTENCE COMPLEXITY UPGRADES */}
                                {currentCriterion === 'grammatical_range_accuracy' && coaching.raw_explainer_output?.grammar_feedback?.complexity_suggestions?.length > 0 && (
                                    <div className="rounded-xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 shadow-xl">
                                        <div className="bg-cyan-500/10 p-4 border-b border-cyan-500/20 flex items-center gap-2">
                                            <div className="p-1.5 bg-cyan-500 rounded text-white"><ArrowRight className="w-4 h-4" /></div>
                                            <span className="text-sm font-bold text-cyan-300 uppercase tracking-wider">Sentence Complexity Upgrades</span>
                                            <span className="text-[10px] text-cyan-400/60 ml-auto">Combine simple sentences → Band 7+ structures</span>
                                        </div>
                                        <div className="p-6 space-y-5">
                                            {coaching.raw_explainer_output.grammar_feedback.complexity_suggestions.map((sug: any, idx: number) => (
                                                <div key={`comp-${idx}`} className="space-y-3 bg-slate-800/20 p-4 rounded-lg border border-slate-700/50">
                                                    {/* Simple sentences */}
                                                    <div className="space-y-2">
                                                        <div className="text-[10px] font-bold text-rose-400 uppercase">Your Simple Sentences</div>
                                                        {sug.simple_sentences?.map((s: string, si: number) => (
                                                            <p key={si} className="text-sm text-rose-200/70 bg-rose-950/20 p-2.5 rounded border border-rose-900/20">
                                                                "{s}"
                                                            </p>
                                                        ))}
                                                    </div>

                                                    {/* Arrow */}
                                                    <div className="flex justify-center">
                                                        <div className="flex items-center gap-2 text-cyan-400">
                                                            <div className="h-px w-8 bg-cyan-500/50" />
                                                            <ArrowRight className="w-4 h-4" />
                                                            <span className="text-[10px] font-bold uppercase">Combined</span>
                                                            <div className="h-px w-8 bg-cyan-500/50" />
                                                        </div>
                                                    </div>

                                                    {/* Complex version */}
                                                    <div className="space-y-1">
                                                        <div className="text-[10px] font-bold text-emerald-400 uppercase">Band 7+ Version</div>
                                                        <p className="text-sm text-emerald-100 bg-emerald-950/20 p-3 rounded border border-emerald-900/30 leading-relaxed">
                                                            "{sug.complex_version}"
                                                        </p>
                                                    </div>

                                                    {/* Structures used */}
                                                    {sug.structures_demonstrated?.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {sug.structures_demonstrated.map((struct: string, si: number) => (
                                                                <span key={si} className="px-2 py-1 bg-cyan-500/15 text-cyan-300 text-[11px] rounded-full border border-cyan-500/25 font-medium">
                                                                    {struct}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Explanation */}
                                                    {sug.explanation && (
                                                        <div className="text-xs text-slate-400 flex gap-2 mt-1">
                                                            <Info className="w-3.5 h-3.5 shrink-0 text-cyan-400 mt-0.5" />
                                                            <span>{sug.explanation}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 4c. STRATEGY CARD - Grammar Corrections (micro_feedback fallback) */}
                                {currentCriterion === 'grammatical_range_accuracy' && coaching.grammar_errors?.length > 0 && (
                                    <div className="rounded-xl overflow-hidden border border-violet-500/30 bg-gradient-to-br from-violet-900/20 to-purple-900/20 shadow-xl">
                                        <div className="bg-violet-500/10 p-4 border-b border-violet-500/20 flex items-center gap-2">
                                            <div className="p-1.5 bg-violet-500 rounded text-white"><Layout className="w-4 h-4" /></div>
                                            <span className="text-sm font-bold text-violet-300 uppercase tracking-wider">Sentence-Level Corrections</span>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {coaching.grammar_errors.slice(0, 5).map((err: any, idx: number) => (
                                                <div key={`gram-${idx}`} className="space-y-3 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <div className="text-[10px] font-bold text-rose-400 uppercase">Original</div>
                                                            <p className="text-sm text-rose-200/80 line-through decoration-rose-500/50 bg-rose-950/20 p-3 rounded border border-rose-900/30">
                                                                "{err.original}"
                                                            </p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="text-[10px] font-bold text-emerald-400 uppercase">Corrected</div>
                                                            <p className="text-sm text-emerald-100 bg-emerald-950/20 p-3 rounded border border-emerald-900/30">
                                                                "{err.corrected}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-slate-400 flex gap-2">
                                                        <Info className="w-3.5 h-3.5 shrink-0 text-violet-400 mt-0.5" />
                                                        <span>{err.explanation}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ACTION PLAN ITEMS (from feedback items) */}
                                {actionItems.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                            <Layout className="w-4 h-4" /> Action Plan
                                        </h4>
                                        <div className="grid gap-3">
                                            {actionItems.map((item, idx) => (
                                                <div key={`act-${idx}`} className="p-4 rounded-xl border border-blue-900/30 bg-blue-950/10">
                                                    <div className="font-bold text-xs uppercase text-blue-400 mb-1">{item.title}</div>
                                                    <div className="text-slate-300 text-sm leading-relaxed">
                                                        {item.content.split(/(\*\*.*?\*\*)/g).map((part, pIdx) =>
                                                            part.startsWith('**') && part.endsWith('**') ? (
                                                                <strong key={pIdx} className="text-blue-200 font-bold bg-blue-500/10 px-1 rounded">{part.slice(2, -2)}</strong>
                                                            ) : (
                                                                <span key={pIdx}>{part}</span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* MICRO DRILL */}
                                {currentCriterion === 'task_response' && coaching.raw_coach_output?.micro_drill && (
                                    <div className="rounded-xl border border-blue-500/30 bg-blue-950/10 overflow-hidden mt-6">
                                        <div className="bg-blue-900/20 p-3 border-b border-blue-500/20 flex items-center justify-between">
                                            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Training Drill</span>
                                            <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full shadow-lg shadow-blue-500/20">{coaching.raw_coach_output.micro_drill.time_limit_minutes} min</span>
                                        </div>
                                        <div className="p-5 flex gap-6">
                                            <div className="flex-1 space-y-2">
                                                <h4 className="font-bold text-white text-lg">{coaching.raw_coach_output.micro_drill.drill_name}</h4>
                                                <p className="text-sm text-slate-300 leading-relaxed">{coaching.raw_coach_output.micro_drill.instructions}</p>
                                            </div>
                                            <div className="w-48 shrink-0">
                                                <div className="text-xs text-blue-300 font-mono bg-blue-950/50 p-3 rounded border border-blue-900/50 h-full">
                                                    <div className="uppercase text-[10px] text-blue-500 font-bold mb-1">Goal</div>
                                                    {coaching.raw_coach_output.micro_drill.purpose}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* LOGIC REPAIRS */}
                                {currentCriterion === 'task_response' && coaching.raw_explainer_output?.macro_feedback?.map((macro: any, idx: number) => {
                                    // Calculate target band (current TR score + 1, max 8)
                                    const trScore = evaluation.criterion_scores.find(s => s.criterion === 'task_response')?.band || 6;
                                    const targetBand = Math.min(trScore + 1, 8);

                                    return (
                                        <div key={`macro-${idx}`} className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-slate-900/50 overflow-hidden shadow-lg">
                                            <div className="bg-amber-900/20 p-4 border-b border-amber-500/20 flex items-center justify-between">
                                                <span className="text-sm font-bold text-amber-400 uppercase tracking-wider">Logic Repair: Paragraph {macro.paragraph_index}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] uppercase font-bold text-amber-500/70 bg-amber-950/40 px-2 py-1 rounded">{macro.issue_identified?.replace(/_/g, ' ')}</span>
                                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded">Target: Band {targetBand}</span>
                                                </div>
                                            </div>
                                            <div className="p-5 space-y-4">
                                                <div className="text-sm text-slate-300 italic border-l-2 border-amber-500/40 pl-3">"{macro.logic_diagnosis}"</div>
                                                <div className="grid grid-cols-2 gap-4 pt-2">
                                                    <div className="space-y-2">
                                                        <div className="text-[10px] uppercase text-slate-500 font-bold">Original</div>
                                                        <p className="text-sm text-slate-400 line-through decoration-rose-500/50 decoration-2 bg-slate-900/50 p-3 rounded leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">{macro.original_paragraph}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="text-[10px] uppercase text-emerald-500 font-bold flex items-center gap-2">
                                                            Band {targetBand} Rewrite
                                                            <span className="text-amber-400/70">({macro.improved_paragraph?.split(/\s+/).length || 0} words)</span>
                                                        </div>
                                                        <p className="text-sm text-slate-200 bg-emerald-950/10 border border-emerald-900/30 p-3 rounded leading-relaxed max-h-48 overflow-y-auto custom-scrollbar">{macro.improved_paragraph}</p>
                                                    </div>
                                                </div>
                                                {macro.key_changes_made?.length > 0 && (
                                                    <div className="text-xs text-slate-400 bg-slate-800/50 p-3 rounded space-y-1">
                                                        <div className="font-bold text-amber-400 uppercase text-[10px]">Key Changes</div>
                                                        <ul className="list-disc list-inside space-y-0.5">
                                                            {macro.key_changes_made.map((change: string, i: number) => (
                                                                <li key={i} className="text-slate-300">{change}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {currentCriterion === 'task_response' && !coaching.raw_coach_output?.the_one_big_change && actionItems.length === 0 && (
                                    <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-xl">
                                        <p className="text-slate-500">No high-level report items for this criterion.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB: STRENGTHS */}
                        {activeTab === 'strengths' && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {strengthItems.length > 0 ? strengthItems.map((item, idx) => (
                                    <div key={`str-${idx}`} className="p-4 rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-slate-900/50 relative overflow-hidden group hover:border-emerald-500/40 transition-colors shadow-lg shadow-emerald-900/5">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600" />
                                        <div className="pl-4">
                                            <div className="font-bold text-xs uppercase text-emerald-400 mb-2 flex items-center gap-2 tracking-wide">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {item.title}
                                            </div>
                                            <div className="text-slate-300 text-sm leading-relaxed opacity-90">{item.content}</div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-xl">
                                        <p className="text-slate-500">No specific strengths listed for this criterion.</p>
                                    </div>
                                )}

                                {/* Pattern Breaker - Required Items */}
                                {currentCriterion === 'task_response' && coaching.raw_coach_output?.pattern_breaker?.required_list.map((item: any, i: number) => (
                                    <div key={`req-${i}`} className="p-4 bg-emerald-950/5 space-y-2 border border-emerald-900/30 rounded-xl">
                                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Required Technique
                                        </div>
                                        <div className="font-mono text-sm text-emerald-200">{item.required_technique}</div>
                                        <div className="text-xs text-slate-400">{item.how_to_implement}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* TAB: ISSUES */}
                        {activeTab === 'issues' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {issueItems.length > 0 ? issueItems.map((item, idx) => (
                                    <div key={`imp-${idx}`} className="rounded-xl border border-rose-500/20 bg-gradient-to-br from-rose-950/20 to-slate-900/50 overflow-hidden group hover:border-rose-500/40 transition-all shadow-lg shadow-rose-900/5">

                                        {/* Header */}
                                        <div className="flex items-center gap-2 p-3 border-b border-rose-500/10 bg-rose-500/5">
                                            <div className="p-1 rounded-md bg-rose-500/20 text-rose-400">
                                                <AlertTriangle className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="font-bold text-xs uppercase text-rose-300 tracking-wide">{item.title}</span>
                                        </div>

                                        <div className="p-5 space-y-4">
                                            {/* Structured - Cohesion Issue */}
                                            {item.title === 'Cohesion Issue' && item.content.includes('->') ? (() => {
                                                // ... (keep existing parsing logic for Cohesion Issue) ...
                                                const parts = item.content.split('->');
                                                const problem = parts[0].trim();
                                                const rest = parts[1] || '';
                                                const fixEndIndex = rest.lastIndexOf('(');
                                                const fix = fixEndIndex > 0 ? rest.substring(0, fixEndIndex).trim() : rest.trim();
                                                const reason = fixEndIndex > 0 ? rest.substring(fixEndIndex + 1, rest.lastIndexOf(')')).trim() : 'Improve flow';

                                                return (
                                                    <div className="space-y-4">
                                                        <div className="bg-rose-950/30 rounded-lg p-4 border border-rose-500/20 relative">
                                                            <div className="absolute top-0 right-0 px-2 py-1 bg-rose-500/20 text-[10px] font-bold text-rose-300 rounded-bl-lg">ORIGINAL</div>
                                                            <div className="text-slate-300 text-sm italic font-serif opacity-90 leading-relaxed">"{problem}"</div>
                                                        </div>

                                                        <div className="flex justify-center -my-2 relative z-10">
                                                            <div className="bg-slate-900 rounded-full p-1.5 border border-slate-700 text-emerald-500 shadow-sm">
                                                                <ArrowRight className="w-4 h-4" />
                                                            </div>
                                                        </div>

                                                        <div className="bg-emerald-950/20 rounded-lg p-4 border border-emerald-500/20 relative">
                                                            <div className="absolute top-0 right-0 px-2 py-1 bg-emerald-500/20 text-[10px] font-bold text-emerald-300 rounded-bl-lg">IMPROVED</div>
                                                            <div className="text-emerald-100/90 text-sm font-medium leading-relaxed">"{fix}"</div>
                                                        </div>

                                                        <div className="flex gap-3 items-start text-xs text-slate-400 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                                            <Info className="w-4 h-4 mt-0.5 shrink-0 text-indigo-400" />
                                                            <span className="leading-relaxed"><span className="text-indigo-300 font-bold">Why:</span> {reason}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })() : (
                                                /* Standard Text Content with Markdown Parsing */
                                                <div className="text-slate-300 text-sm leading-7">
                                                    {item.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
                                                        if (part.startsWith('**') && part.endsWith('**')) {
                                                            return <strong key={i} className="font-bold text-rose-200">{part.slice(2, -2)}</strong>;
                                                        }
                                                        return <span key={i}>{part}</span>;
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-xl">
                                        <p className="text-slate-500">No specific issues detected! Great job.</p>
                                    </div>
                                )}

                                {/* Pattern Breaker - Banned Items */}
                                {currentCriterion === 'task_response' && coaching.raw_coach_output?.pattern_breaker?.banned_list.map((item: any, i: number) => (
                                    <div key={`ban-${i}`} className="p-4 bg-rose-950/5 space-y-2 border border-rose-900/30 rounded-xl">
                                        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
                                            <AlertTriangle className="w-3.5 h-3.5" /> Avoid This
                                        </div>
                                        <div className="font-mono text-sm text-rose-200">"{item.banned_element}"</div>
                                        <div className="text-xs text-slate-400">{item.why_banned}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* TAB: SUMMARY (Topics) */}
                        {activeTab === 'summary' && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center gap-2 pb-1 border-b border-slate-800/60">
                                    <Target className="w-3.5 h-3.5 text-amber-400" />
                                    <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Priority Study Areas</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {/* 1. AGENT-GENERATED TOPICS */}
                                    {coaching.topic_analysis && coaching.topic_analysis.length > 0 && (
                                        <div className="space-y-3">
                                            {coaching.topic_analysis.map((topic, i) => (
                                                <div key={i} className="flex flex-col gap-2 p-3 bg-[#1e293b]/50 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors">
                                                    {/* Header: Score + Title + Category */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "w-7 h-7 rounded-md flex items-center justify-center font-black text-[11px]",
                                                                topic.category === 'Grammar' ? "bg-indigo-500/20 text-indigo-400" :
                                                                    topic.category === 'Vocabulary' ? "bg-emerald-500/20 text-emerald-400" :
                                                                        "bg-amber-500/20 text-amber-400"
                                                            )}>
                                                                {topic.count}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-sm text-slate-200">{topic.topic}</div>
                                                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{topic.category}</div>
                                                            </div>
                                                        </div>
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded",
                                                            topic.category === 'Grammar' ? "bg-indigo-500/10 text-indigo-400" :
                                                                topic.category === 'Vocabulary' ? "bg-emerald-500/10 text-emerald-400" :
                                                                    "bg-amber-500/10 text-amber-400"
                                                        )}>{topic.category}</span>
                                                    </div>

                                                    {/* Rich Details: Description + Why It Matters + Evidence */}
                                                    {(topic.description || topic.why_it_matters || topic.evidence_from_essay) && (
                                                        <div className="pl-10 space-y-1.5">
                                                            {topic.description && (
                                                                <p className="text-sm text-slate-300">
                                                                    {topic.description}
                                                                </p>
                                                            )}
                                                            {topic.why_it_matters && (
                                                                <div className="flex items-start gap-2 text-xs text-indigo-300/80 bg-indigo-500/5 p-2 rounded border border-indigo-500/10">
                                                                    <div className="shrink-0 mt-0.5">💡</div>
                                                                    <span><strong>Why it matters:</strong> {topic.why_it_matters}</span>
                                                                </div>
                                                            )}
                                                            {topic.evidence_from_essay && (
                                                                <div className="flex items-start gap-2 text-xs text-amber-300/80 bg-amber-500/5 p-2.5 rounded border border-amber-500/15">
                                                                    <div className="shrink-0 mt-0.5">📝</div>
                                                                    <div>
                                                                        <strong className="text-amber-400">From your essay:</strong>
                                                                        <p className="mt-1 italic text-amber-200/70">"{topic.evidence_from_essay}"</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* 2. TOPIC VOCABULARY TOOLKIT (Always show if available) */}
                                    {coaching.topic_vocabulary && (
                                        <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-xl overflow-hidden mb-6">
                                            <div className="bg-emerald-500/10 p-4 border-b border-emerald-500/20 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-xs tracking-wider">
                                                    <BookOpen className="w-4 h-4" /> Word Bank: {coaching.topic_vocabulary.topic}
                                                </div>
                                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">Band 9.0 Lexis</span>
                                            </div>
                                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Essential Words */}
                                                <div className="space-y-3">
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Essential Terms
                                                    </div>
                                                    <div className="space-y-2">
                                                        {coaching.topic_vocabulary.useful_words?.slice(0, 5).map((w: any, idx: number) => (
                                                            <div key={`cw-${idx}`} className="text-sm">
                                                                <span className="font-bold text-emerald-300">{w.word}</span>
                                                                <div className="text-xs text-slate-400 italic">"{w.example}"</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* Collocations */}
                                                <div className="space-y-3">
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Power Collocations
                                                    </div>
                                                    <div className="space-y-2">
                                                        {coaching.topic_vocabulary.useful_collocations?.slice(0, 5).map((w: any, idx: number) => (
                                                            <div key={`cc-${idx}`} className="text-sm">
                                                                <span className="font-bold text-cyan-300">{w.word}</span>
                                                                <div className="text-xs text-slate-400 italic">"{w.example}"</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 3. COHERENCE STRATEGY (Always show if available) */}
                                    {coaching.coherence_advice && (
                                        <div className="bg-indigo-950/10 border border-indigo-500/20 rounded-xl overflow-hidden mb-6">
                                            <div className="bg-indigo-500/10 p-4 border-b border-indigo-500/20 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase text-xs tracking-wider">
                                                    <Layout className="w-4 h-4" /> Strategic Flow Advice
                                                </div>
                                                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">Structure</span>
                                            </div>
                                            <div className="p-4 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <div className="text-[10px] font-bold text-slate-500 uppercase">Core Strategy</div>
                                                        <p className="text-sm text-indigo-200 font-medium">{coaching.coherence_advice.strategy}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="text-[10px] font-bold text-slate-500 uppercase">Specific Direction</div>
                                                        <p className="text-sm text-slate-300">{coaching.coherence_advice.specific_direction}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-indigo-500/5 p-3 rounded border border-indigo-500/10">
                                                    <div className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Example Transition</div>
                                                    <p className="text-sm text-slate-400 italic">"{coaching.coherence_advice.example}"</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 4. FALLBACK: General Focus Areas (Only if no agent topics) */}
                                    {(!coaching.topic_analysis || coaching.topic_analysis.length === 0) && (
                                        <div className="space-y-6">
                                            <div className="text-center py-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-xl border border-indigo-500/20">
                                                <BookOpen className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
                                                <p className="text-slate-200 text-sm font-medium">
                                                    Personalized Study Plan
                                                </p>
                                                <p className="text-slate-400 text-xs mt-1">
                                                    Focus on these areas to improve your band score:
                                                </p>
                                            </div>
                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4" />
                                                    Recommended Study Areas
                                                </h4>
                                                {evaluation.criterion_scores
                                                    .sort((a, b) => a.band - b.band)
                                                    .slice(0, 4)
                                                    .map((score, i) => {
                                                        const focusInfo: Record<string, { topic: string; description: string; color: string }> = {
                                                            task_response: {
                                                                topic: "Task Response & Thesis Development",
                                                                description: "Strengthen your position with specific examples and deeper analysis",
                                                                color: "amber"
                                                            },
                                                            coherence_cohesion: {
                                                                topic: "Coherence & Paragraph Structure",
                                                                description: "Improve logical flow, transitions, and referencing",
                                                                color: "indigo"
                                                            },
                                                            lexical_resource: {
                                                                topic: "Vocabulary Range & Accuracy",
                                                                description: "Expand academic vocabulary and learn natural collocations",
                                                                color: "emerald"
                                                            },
                                                            grammatical_range_accuracy: {
                                                                topic: "Grammar Range & Accuracy",
                                                                description: "Practice complex structures and reduce common errors",
                                                                color: "rose"
                                                            },
                                                        };
                                                        const info = focusInfo[score.criterion];
                                                        if (!info) return null;

                                                        const colorClass = {
                                                            amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
                                                            indigo: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
                                                            emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                                                            rose: "bg-rose-500/20 text-rose-400 border-rose-500/30",
                                                        }[info.color];

                                                        return (
                                                            <div key={i} className={cn(
                                                                "p-4 rounded-xl border flex items-start gap-4",
                                                                colorClass?.replace('text-', 'border-').replace('/20', '/30') || "border-slate-700 bg-slate-800/30"
                                                            )}>
                                                                <div className={cn(
                                                                    "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0",
                                                                    colorClass
                                                                )}>
                                                                    {score.band}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="font-bold text-slate-200">{info.topic}</div>
                                                                    <div className="text-xs text-slate-400 mt-1">{info.description}</div>
                                                                </div>
                                                                <div className="text-xs font-medium text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                                                                    Band {score.band}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Bottom Spacer */}
                        <div className="h-24 w-full" />
                    </div>
                </div>

            </div>
        </div>
    );
}
