import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Target,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    Clock,
    Lightbulb,
    BookOpen,
    Repeat,
} from "lucide-react";
import type { WritingFeedbackResponse, BandGap } from "@/types/writing";
import { cn } from "@/lib/utils";

interface FeedbackDisplayProps {
    feedback: WritingFeedbackResponse;
}

const CRITERION_LABELS: Record<string, string> = {
    task_response: "Task Response",
    coherence_cohesion: "Coherence & Cohesion",
    lexical_resource: "Lexical Resource",
    grammatical_range_accuracy: "Grammar",
};

function getBandColor(band: number): string {
    if (band >= 7.5) return "text-green-600";
    if (band >= 6.5) return "text-blue-600";
    if (band >= 5.5) return "text-amber-600";
    return "text-red-600";
}

function BandGapCard({ gap }: { gap: BandGap }) {
    const gapPercentage = (gap.current_band / gap.target_band) * 100;

    return (
        <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
                <span className="font-medium text-sm">
                    {CRITERION_LABELS[gap.criterion]}
                </span>
                <Badge variant="outline" className={getBandColor(gap.current_band)}>
                    {gap.current_band} → {gap.target_band}
                </Badge>
            </div>

            <Progress value={gapPercentage} className="h-2" />

            <div className="text-xs text-muted-foreground">
                Gap: <span className="font-medium text-red-600">{gap.gap.toFixed(1)}</span> bands
            </div>

            {gap.specific_gaps.length > 0 && (
                <ul className="text-xs space-y-1">
                    {gap.specific_gaps.map((g, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <ArrowRight className="h-3 w-3 mt-0.5 text-muted-foreground" />
                            {g}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
    const { evaluation, coaching, recurring_errors, personalized_tip } = feedback;

    return (
        <div className="space-y-6">
            {/* Personalized Warning */}
            {personalized_tip && (
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="py-4 flex items-center gap-3">
                        <Repeat className="h-5 w-5 text-amber-600" />
                        <p className="text-sm text-amber-800">{personalized_tip}</p>
                    </CardContent>
                </Card>
            )}

            {/* Overall Score Card */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Score Overview
                        </CardTitle>
                        <div className="text-right">
                            <span className={cn("text-4xl font-bold", getBandColor(evaluation.overall_band))}>
                                {evaluation.overall_band}
                            </span>
                            <p className="text-sm text-muted-foreground">
                                Target: {coaching.target_band}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Criterion scores */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {evaluation.criterion_scores.map((score) => (
                            <div
                                key={score.criterion}
                                className="rounded-lg bg-muted p-3"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium">
                                        {CRITERION_LABELS[score.criterion]}
                                    </span>
                                    <Badge variant="secondary" className={getBandColor(score.band)}>
                                        {score.band}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {score.justification}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Word count warning */}
                    {evaluation.word_count_penalty && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
                            <AlertTriangle className="h-4 w-4" />
                            Word count ({evaluation.word_count}) below minimum
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tabs for detailed feedback */}
            <Tabs defaultValue="action" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="action">Action Plan</TabsTrigger>
                    <TabsTrigger value="gaps">Band Gaps</TabsTrigger>
                    <TabsTrigger value="rewrites">Rewrites</TabsTrigger>
                    <TabsTrigger value="practice">Practice</TabsTrigger>
                </TabsList>

                {/* Action Plan */}
                <TabsContent value="action" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                Priority Action Plan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ol className="space-y-3">
                                {coaching.action_plan.map((action, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                            {i + 1}
                                        </span>
                                        <span className="text-sm">{action}</span>
                                    </li>
                                ))}
                            </ol>

                            <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-4">
                                <p className="text-sm font-medium text-green-800 mb-2">
                                    <CheckCircle2 className="h-4 w-4 inline mr-1" />
                                    What you did well
                                </p>
                                <p className="text-sm text-green-700">{coaching.strengths_summary}</p>
                            </div>

                            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                                <p className="text-sm font-medium text-blue-800 mb-2">
                                    <Lightbulb className="h-4 w-4 inline mr-1" />
                                    Next focus
                                </p>
                                <p className="text-sm text-blue-700">{coaching.next_focus}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Band Gap Analysis */}
                <TabsContent value="gaps" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Band Gap Analysis (Target: {coaching.target_band})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {coaching.band_gaps.map((gap) => (
                                    <BandGapCard key={gap.criterion} gap={gap} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Rewrites */}
                <TabsContent value="rewrites" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Sentence Improvements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {coaching.rewrites.map((rewrite, i) => (
                                <div key={i} className="space-y-3 pb-4 border-b last:border-0">
                                    <div className="rounded bg-red-50 p-3">
                                        <p className="text-xs text-red-600 font-medium mb-1">Original</p>
                                        <p className="text-sm line-through text-red-700">
                                            {rewrite.original}
                                        </p>
                                    </div>

                                    <div className="rounded bg-green-50 p-3">
                                        <p className="text-xs text-green-600 font-medium mb-1">Improved</p>
                                        <p className="text-sm text-green-700 font-medium">
                                            {rewrite.improved}
                                        </p>
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        <strong>Why:</strong> {rewrite.explanation}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Practice Tasks */}
                <TabsContent value="practice" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Micro-Tasks (10-15 min each)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {coaching.micro_tasks.map((task, i) => (
                                <div
                                    key={i}
                                    className="rounded-lg border p-4 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">{task.title}</h4>
                                        <Badge variant="outline">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {task.duration_minutes} min
                                        </Badge>
                                    </div>

                                    <p className="text-sm text-muted-foreground">
                                        {task.instruction}
                                    </p>

                                    {task.example && (
                                        <div className="rounded bg-muted p-3">
                                            <p className="text-xs font-medium mb-1">Example:</p>
                                            <p className="text-sm">{task.example}</p>
                                        </div>
                                    )}

                                    <Badge variant="secondary">
                                        Targets: {CRITERION_LABELS[task.targets_criterion]}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Recurring Errors */}
            {recurring_errors.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Repeat className="h-5 w-5 text-amber-500" />
                            Recurring Patterns
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {recurring_errors.map((error) => (
                                <Badge
                                    key={error.pattern_type}
                                    variant="outline"
                                    className="text-amber-700 border-amber-300"
                                >
                                    {error.pattern_type} ({error.frequency}x)
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
