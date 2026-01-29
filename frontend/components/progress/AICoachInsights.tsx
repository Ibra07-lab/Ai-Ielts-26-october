import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, AlertTriangle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Insight {
    type: 'success' | 'warning' | 'info' | 'tip';
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface AICoachInsightsProps {
    insights?: Insight[];
    userName?: string;
}

export default function AICoachInsights({ insights = [], userName = "Student" }: AICoachInsightsProps) {
    // Mock insights if none provided
    const displayInsights = insights.length > 0 ? insights : [
        {
            type: 'success',
            message: "You've maintained a 3-day streak in Speaking practice! Consistency is key to fluency.",
        },
        {
            type: 'warning',
            message: "Your Writing Task 2 Cohesion score has dipped slightly. Try focusing on linking words.",
            action: { label: "Practice Cohesion", onClick: () => console.log("Navigate to cohesion") }
        },
        {
            type: 'tip',
            message: "Tip: Try recording your speaking answers and listening back to identify pronunciation errors.",
        }
    ] as Insight[];

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <Trophy className="w-5 h-5 text-yellow-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'tip': return <Sparkles className="w-5 h-5 text-purple-500" />;
            default: return <TrendingUp className="w-5 h-5 text-blue-500" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case 'success': return "bg-yellow-500/10 border-yellow-500/20";
            case 'warning': return "bg-orange-500/10 border-orange-500/20";
            case 'tip': return "bg-purple-500/10 border-purple-500/20";
            default: return "bg-blue-500/10 border-blue-500/20";
        }
    };

    return (
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-900/10 border-indigo-100 dark:border-indigo-500/20 overflow-hidden relative">
            {/* Absolute positioning for decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-indigo-900 dark:text-indigo-100">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    AI Coach Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {displayInsights.map((insight, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg border ${getBgColor(insight.type)} flex gap-3 items-start transition-all hover:shadow-sm`}
                    >
                        <div className="mt-0.5 shrink-0">
                            {getIcon(insight.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                            <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                                {insight.message}
                            </p>
                            {insight.action && (
                                <Button
                                    variant="link"
                                    className="h-auto p-0 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                                    onClick={insight.action.onClick}
                                >
                                    {insight.action.label} →
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
