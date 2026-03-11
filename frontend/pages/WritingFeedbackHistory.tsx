import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedbackContainer } from '@/components/writing/FeedbackContainer';
import type { EvaluationResult } from '@/types/writing-feedback';
import backend from '@/backend';

export default function WritingFeedbackHistory() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: sessionData, isLoading, error, refetch } = useQuery({
        queryKey: ['writingSession', id],
        queryFn: async () => {
            if (!id) throw new Error('Missing session ID');

            const response = await fetch(`http://localhost:8002/writing/history/session/${id}`);
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

    const coachingData = sessionData.coaching_json || {
        action_plan: ["Historical session available."],
        strengths: ["Evaluation loaded from history."],
        weaknesses: ["Cannot regenerate micro feedback."],
        grammar_errors: [],
        vocabulary_suggestions: [],
        coherence_issues: [],
    };

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
