import React from 'react';
import { Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface StudyPreferencesProps {
    className?: string;
}

export function StudyPreferences({ className }: StudyPreferencesProps) {
    return (
        <Card className={cn("border-slate-100 dark:border-white/5 bg-white dark:bg-[#151B2B] shadow-sm rounded-[1.25rem]", className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Study Preferences</h3>
                    <Settings className="w-4 h-4 text-slate-400" />
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Spaced Repetition</span>
                        <Switch defaultChecked className="data-[state=checked]:bg-sky-500" />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Auto-pronounce</span>
                        <Switch className="data-[state=checked]:bg-sky-500" />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Example Sentences</span>
                        <Switch defaultChecked className="data-[state=checked]:bg-sky-500" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
