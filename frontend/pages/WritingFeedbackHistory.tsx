import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedbackContainer } from '@/components/writing/FeedbackContainer';
import type { EvaluationResult } from '@/types/writing-feedback';
import { useUser } from '../contexts/UserContext';
import backend from '@/backend';

export default function WritingFeedbackHistory() {
    const { session } = useUser();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: sessionData, isLoading, error, refetch } = useQuery({
        queryKey: ['writingSession', id],
        queryFn: async () => {
            if (!id) throw new Error('Missing session ID');

            const response = await fetch(`/writing/history/session/${id}`, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token || ''}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch session');

            const data = await response.json();
            return data.session;
        },
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">
                    Loading your evaluation history...
                </p>
            </div>
        );
    }

    if (error || !sessionData) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 max-w-md mx-auto text-center px-4">
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mb-2 shadow-sm ring-4 ring-rose-50 dark:ring-rose-900/10">
                    <RefreshCw className="w-8 h-8 opacity-80" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-4 mb-2">Evaluation Not Found</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        We couldn't load this writing session. It may have been deleted or the link is invalid.
                    </p>
                </div>
                <div className="flex gap-4 w-full">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/progress')}
                        className="flex-1 border-slate-200 dark:border-slate-800"
                    >
                        <ArrowLeft className="w-4 h-4 text-slate-500 mr-2" />
                        Back to Progress
                    </Button>
                    <Button
                        onClick={() => refetch()}
                        className="flex-1 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    // Use the full evaluation and coaching JSONs saved directly by the Python pipeline
    const evaluationData: EvaluationResult = sessionData.evaluation_json || {
        overall_band: sessionData.overall_band || 0,
        band_range: {
            low: sessionData.overall_band || 0,
            high: sessionData.overall_band || 0
        },
        criterion_scores: [
            { criterion: 'task_response', band: sessionData.task_response_band || 0, justification: 'No detailed feedback.' },
            { criterion: 'coherence_cohesion', band: sessionData.coherence_cohesion_band || 0, justification: 'No detailed feedback.' },
            { criterion: 'lexical_resource', band: sessionData.lexical_resource_band || 0, justification: 'No detailed feedback.' },
            { criterion: 'grammatical_range_accuracy', band: sessionData.grammar_band || 0, justification: 'No detailed feedback.' }
        ],
        word_count: sessionData.essay ? sessionData.essay.split(/\s+/).filter(Boolean).length : 0,
        word_count_ok: true,
        teacher_feedback_status: 'complete',
        explanations: sessionData.explanation_json ? sessionData.explanation_json.explanations : []
    };

    // Normalize coaching data — must match the shape expected by FeedbackDeepDiveView
    // The database stores raw agent outputs; we need to transform them into the CoachingResult interface.
    const buildCoachingData = () => {
        const coachData = sessionData.coaching_json || {};
        const explainData = sessionData.explanation_json || {};
        const isTask1 = sessionData.task_type === 'task1';

        if (isTask1) {
            return {
                action_plan: coachData?.the_one_big_change ? [
                    coachData.the_one_big_change.change_statement,
                    coachData.micro_drill ? `Drill: ${coachData.micro_drill.drill_name}` : "",
                ].filter(Boolean) : [],
                strengths: [coachData?.diagnosis_summary?.strength_acknowledged].filter(Boolean),
                weaknesses: [coachData?.diagnosis_summary?.core_limitation].filter(Boolean),
                grammar_errors: (explainData.micro_fixes || [])
                    .filter((f: any) => f.error_type === 'grammar' || f.error_type === 'punctuation' || f.error_type === 'style' || f.error_type === 'comparison' || f.error_type === 'tense')
                    .map((f: any) => ({
                        original: f.original_sentence,
                        corrected: f.corrected_sentence,
                        explanation: f.explanation,
                        tip: f.specific_error || "Watch out for this error pattern.",
                        specific_error: f.specific_error // Preserve for descriptive breakdown
                    })),
                vocabulary_suggestions: [
                    ...(explainData.micro_fixes || [])
                        .filter((f: any) => f.error_type === 'vocabulary')
                        .map((f: any) => ({
                            original: f.original_sentence,
                            better_options: [f.corrected_sentence].filter(Boolean),
                            context: f.explanation
                        })),
                    ...(explainData.vocabulary_feedback?.word_upgrades || [])
                        .map((u: any) => ({
                            original: u.basic_phrase,
                            better_options: u.upgrade_options && u.upgrade_options.length > 0 ? u.upgrade_options : [u.best_fit],
                            context: `Context: "${u.context_sentence}"\n\nImproved: "${u.improved_sentence}"`
                        }))
                ],
                coherence_issues: (explainData.cohesion_fixes || []).map((c: any) => ({
                    text: c.original_sentence || c.quote,
                    suggestion: c.improved_sentence || c.corrected_sentence || c.suggestion,
                    reason: c.technique_explanation || c.explanation
                })),
                raw_coach_output: coachData,
                raw_explainer_output: explainData,
                topic_analysis: coachData.topic_analysis || [],
                topic_vocabulary: coachData.topic_vocabulary || undefined,
                coherence_advice: coachData.coherence_advice || undefined,
                score_context: coachData.score_context,
                root_cause_analysis: coachData.root_cause_analysis,
                diagnosis_summary: coachData.diagnosis_summary,
                the_one_big_change: coachData.the_one_big_change,
                pattern_breaker: coachData.pattern_breaker,
                micro_drill: coachData.micro_drill,
                next_essay_plan: coachData.next_essay_plan,
                motivation: coachData.motivation,
            };
        } else {
            // Task 2 normalization
            return {
                action_plan: [
                    coachData.the_one_big_change ? coachData.the_one_big_change.change_statement : "",
                    coachData.micro_drill ? `Drill: ${coachData.micro_drill.drill_name}` : "",
                    coachData.score_context?.realistic_next_target ? `Next Target: Band ${coachData.score_context.realistic_next_target}` : "Keep practicing"
                ].filter(Boolean),
                strengths: [coachData.diagnosis_summary?.strength_acknowledged].filter(Boolean),
                weaknesses: explainData.priority_summary
                    ? explainData.priority_summary.map((p: any) =>
                        `**${p.area}**: ${p.current_problem} ${p.action_step}`
                    )
                    : [coachData.diagnosis_summary?.core_limitation].filter(Boolean),
                grammar_errors: (explainData.micro_feedback || explainData.micro_fixes || [])
                    .filter((f: any) => (f.error_type === 'grammar' || f.error_type === 'punctuation' || f.error_type === 'tense' || f.error_type === 'article' || f.error_type === 'comparison' || f.error_type === 'style' || f.issue_type === 'grammar') && (f.corrected_sentence || f.correction || f.improved_sentence))
                    .map((f: any) => ({
                        original: f.original_sentence || f.quote,
                        corrected: f.corrected_sentence || f.correction,
                        explanation: f.explanation,
                        tip: "Watch for this grammar pattern."
                    })),
                vocabulary_suggestions: [
                    ...(explainData.micro_feedback || explainData.micro_fixes || [])
                        .filter((f: any) => f.error_type === 'vocabulary' && (f.corrected_sentence || f.correction || f.improved_sentence))
                        .map((f: any) => ({
                            original: f.original_sentence || f.quote,
                            better_options: [f.corrected_sentence || f.correction || f.improved_sentence],
                            context: f.explanation
                        })),
                    ...(explainData.vocabulary_feedback?.word_upgrades || [])
                        .filter((u: any) => u.upgrade_options && u.upgrade_options.length > 0)
                        .map((u: any) => ({
                            original: u.basic_word,
                            better_options: u.upgrade_options,
                            context: u.why_best_fit
                        }))
                ],
                coherence_issues: [
                    ...(explainData.micro_feedback || [])
                        .filter((f: any) => f.error_type === 'cohesion' || f.error_type === 'coherence')
                        .map((f: any) => ({
                            text: f.original_sentence || f.quote,
                            suggestion: f.corrected_sentence || f.correction,
                            reason: f.explanation
                        })),
                    ...(explainData.cohesion_fixes || []).map((c: any) => ({
                        text: c.original_sentence || c.quote,
                        suggestion: c.improved_sentence || c.corrected_sentence || c.suggestion,
                        reason: c.technique_explanation || c.explanation
                    }))
                ],
                raw_coach_output: coachData,
                raw_explainer_output: explainData,
                topic_analysis: coachData.topic_analysis || [],
                topic_vocabulary: coachData.topic_vocabulary || undefined,
                coherence_advice: coachData.coherence_advice || undefined,
                score_context: coachData.score_context,
                root_cause_analysis: coachData.root_cause_analysis,
                diagnosis_summary: coachData.diagnosis_summary,
                the_one_big_change: coachData.the_one_big_change,
                pattern_breaker: coachData.pattern_breaker,
                micro_drill: coachData.micro_drill,
                next_essay_plan: coachData.next_essay_plan,
                motivation: coachData.motivation,
            };
        }
    };

    const coachingData = buildCoachingData();

    return (
        <div className="w-full h-[calc(100vh-100px)] flex flex-col overflow-hidden animate-in fade-in duration-500">
            <FeedbackContainer
                evaluation={evaluationData}
                coaching={coachingData as any}
                essay={sessionData.essay || ""}
                taskType={sessionData.task_type === 'task1' ? "task1" : "task2"}
                onBack={() => navigate('/progress')}
            />
        </div>
    );
}
