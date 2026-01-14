// ============================================================================
// ENHANCED WRITING FEEDBACK TYPES
// ============================================================================
// This file defines the TypeScript types for the comprehensive feedback system
// including evaluation scores, coaching feedback, and essay markup highlights.

// ----------------------------------------------------------------------------
// Core Types
// ----------------------------------------------------------------------------

export type TaskType = "task1" | "task2";

export type Criterion =
    | "task_response"
    | "task_achievement"
    | "coherence_cohesion"
    | "lexical_resource"
    | "grammatical_range_accuracy";

export type HighlightType = "grammar" | "vocabulary" | "coherence" | "strength";

// ----------------------------------------------------------------------------
// Evaluation Result (Examiner Output)
// ----------------------------------------------------------------------------

export interface CriterionScore {
    criterion: Criterion;
    band: number;
    justification: string;
}

export interface BandRange {
    low: number;
    high: number;
}

export interface EvaluationResult {
    overall_band: number;
    band_range: BandRange;
    criterion_scores: CriterionScore[];
    word_count: number;
    word_count_ok: boolean;
    // New fields for split feedback flow
    teacher_feedback_status?: 'complete' | 'timeout' | 'error' | 'loading' | 'not_requested';
    teacher_feedback_message?: string;
    teacher_feedback?: any;
    feedback_markdown?: string;
    timing?: {
        examiner?: number;
        teacher?: number;
    };
}

// ----------------------------------------------------------------------------
// Coaching Result (Tutor Output)
// ----------------------------------------------------------------------------

export interface GrammarError {
    original: string;
    corrected: string;
    explanation: string;
    tip: string;
}

export interface VocabularySuggestion {
    original: string;
    better_options: string[];
    context: string;
}

export interface CoherenceIssue {
    text: string;
    suggestion: string;
    reason: string;
}

export interface CoachingResult {
    action_plan: string[]; // Array of 3 priority fixes
    strengths: string[]; // Things done well
    weaknesses: string[]; // Areas to improve
    grammar_errors: GrammarError[];
    vocabulary_suggestions: VocabularySuggestion[];
    coherence_issues: CoherenceIssue[];
}

// ----------------------------------------------------------------------------
// Highlight (For Essay Markup)
// ----------------------------------------------------------------------------

export interface Highlight {
    id: string;
    type: HighlightType;
    start: number; // Character position in essay
    end: number; // Character position in essay
    original: string;
    corrected?: string; // Optional, not present for "strength" type
    reason: string;
    tip?: string;
    justification: string;
    improvement_tip: string;
}

// ----------------------------------------------------------------------------
// Complete Feedback Response
// ----------------------------------------------------------------------------

export interface EnhancedFeedbackResponse {
    evaluation: EvaluationResult;
    coaching: CoachingResult;
    highlights: Highlight[];
    timestamp: string;
}

// ----------------------------------------------------------------------------
// Helper Types for Frontend Transformation
// ----------------------------------------------------------------------------

/**
 * Raw backend response before transformation
 */
export interface RawBackendFeedback {
    evaluation: {
        overall_band: number;
        band_range: { low: number; high: number };
        criterion_scores: CriterionScore[];
        word_count: number;
        word_count_ok: boolean;
    };
    coaching: {
        action_plan: string[];
        strengths: string[];
        weaknesses: string[];
        grammar_errors: GrammarError[];
        vocabulary_suggestions: VocabularySuggestion[];
        coherence_issues: CoherenceIssue[];
    };
}

/**
 * Position information for text matching
 */
export interface TextPosition {
    start: number;
    end: number;
    text: string;
}

/**
 * Utility type for highlight generation
 */
export interface HighlightSource {
    type: HighlightType;
    original: string;
    corrected?: string;
    reason: string;
    tip: string;
    bandImpact?: string;
}

// ----------------------------------------------------------------------------
// Request Types
// ----------------------------------------------------------------------------

export interface EvaluateRequest {
    task_type: TaskType;
    question: string;
    essay: string;
    target_band?: number;
    user_id?: string;
}

// ----------------------------------------------------------------------------
// Utility Functions Type Definitions
// ----------------------------------------------------------------------------

/**
 * Function type for finding text positions in essay
 */
export type FindTextPosition = (
    essay: string,
    searchText: string,
    startOffset?: number
) => TextPosition | null;

/**
 * Function type for transforming backend response to highlights
 */
export type TransformToHighlights = (
    essay: string,
    coaching: CoachingResult
) => Highlight[];

/**
 * Function type for generating unique highlight IDs
 */
export type GenerateHighlightId = (
    type: HighlightType,
    index: number
) => string;
