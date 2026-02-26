import React from 'react';
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ReviewItem {
    topic: string;
    time: string;
    color: string;
}

interface NextReviewsProps {
    reviews: ReviewItem[];
    className?: string;
}

export function NextReviews({ reviews, className }: NextReviewsProps) {
    return (
        <Card className={cn("border-slate-100 dark:border-white/5 bg-white dark:bg-[#151B2B] shadow-sm rounded-[1.25rem]", className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Next Reviews</h3>
                    <Clock className="w-4 h-4 text-slate-400" />
                </div>

                <div className="space-y-2">
                    {reviews.map((review, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors group cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn("h-2 w-2 rounded-full", review.color)} />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                    {review.topic}
                                </span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-lg shadow-sm">
                                {review.time}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
