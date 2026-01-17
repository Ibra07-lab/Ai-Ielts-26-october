import React from 'react';
import { Trophy, Lightbulb, AlertCircle, Clock, BookOpen, Link2, BarChart3, FileText } from 'lucide-react';

// Icon mapping for different feedback types
export const FeedbackIcons = {
    // Strengths
    strength: Trophy,

    // Categories
    grammar: FileText,
    vocabulary: BookOpen,
    taskAchievement: BarChart3,
    coherence: Link2,

    // Specific issues
    tense: Clock,
    article: FileText,
    comparison: BarChart3,
    linking: Link2,

    // General
    improvement: Lightbulb,
    issue: AlertCircle,
};

// Severity badge component
interface SeverityBadgeProps {
    frequency?: number;
    severity?: 'critical' | 'moderate' | 'minor';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ frequency, severity }) => {
    if (!frequency && !severity) return null;

    // Determine severity from frequency if not explicitly provided
    const level = severity || (
        frequency && frequency >= 3 ? 'critical' :
            frequency && frequency >= 2 ? 'moderate' : 'minor'
    );

    const colors = {
        critical: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        moderate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        minor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };

    const icons = {
        critical: '🔴',
        moderate: '🟡',
        minor: '🟢',
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${colors[level]}`}>
            <span>{icons[level]}</span>
            {frequency && <span>{frequency}×</span>}
        </span>
    );
};

// Category icon component
interface CategoryIconProps {
    category: keyof typeof FeedbackIcons;
    className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = "w-4 h-4" }) => {
    const Icon = FeedbackIcons[category] || AlertCircle;
    return <Icon className={className} />;
};
