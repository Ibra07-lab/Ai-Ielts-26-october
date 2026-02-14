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
// Score Explanation (Teacher Output)
// ----------------------------------------------------------------------------

export interface ScoreExplanation {
    why_this_score: string;
    band_descriptor_evidence: string;
    path_to_improvement: string;
}

// ----------------------------------------------------------------------------
// Criterion Explanations (from Explanation Agent)
// ----------------------------------------------------------------------------

export interface ExplanationItem {
    label: string;
    quote: string;
    comment: string;
}

export interface MainIssue {
    label: string;
    why_it_matters: string;
    frequency: string;
    examples: string[];
    fix: string;
}

export interface ImprovementStep {
    description: string;
    improved_example: string;
}

export interface CriterionExplanation {
    criterion: string;
    band: number;
    summary: string;
    what_you_did_well: ExplanationItem[];
    main_issues: MainIssue[];
    why_not_higher: string;
    improvement_step: ImprovementStep;
}

export interface WritingExplanations {
    task_achievement: CriterionExplanation;
    coherence_cohesion: CriterionExplanation;
    lexical_resource: CriterionExplanation;
    grammatical_range_accuracy: CriterionExplanation;
}

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
    teacher_feedback?: {
        task_achievement?: { score_explanation?: ScoreExplanation;[key: string]: any };
        coherence_cohesion?: { score_explanation?: ScoreExplanation;[key: string]: any };
        lexical_resource?: { score_explanation?: ScoreExplanation;[key: string]: any };
        grammatical_range?: { score_explanation?: ScoreExplanation;[key: string]: any };
        [key: string]: any;
    };
    feedback_markdown?: string;
    // Criterion explanations (concise, actionable feedback)
    explanations?: WritingExplanations;
    explanations_status?: 'complete' | 'timeout' | 'error' | 'not_requested';
    explanations_message?: string;
    timing?: {
        examiner?: number;
        teacher?: number;
        explanations?: number;
    };
    // Detailed rich feedback for Reports
    detailed_feedback?: DetailedFeedback;
}

export interface CriterionFeedback {
    band: number;
    summary: string;
    why_score_is_here: string;
    weak_spots: string[];
    strengths: string[];
}

export interface DetailedFeedback {
    task_response: CriterionFeedback;
    coherence: CriterionFeedback;
    lexical: CriterionFeedback;
    grammar: CriterionFeedback;
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
    suggestion?: string;  // Legacy field
    corrected?: string;   // New field - the improved version
    reason: string;
}

export interface TopicAnalysis {
    topic: string;
    count: number;
    category: string;
    description: string;
    why_it_matters: string;
}

export interface TopicWord {
    word: string;
    example: string;
}

export interface TopicVocabulary {
    topic: string;
    useful_words: TopicWord[];
    useful_collocations: TopicWord[];
}

export interface CoherenceAdvice {
    strategy: string;
    specific_direction: string;
    example: string;
}

export interface CoachingResult {
    action_plan: string[]; // Array of 3 priority fixes
    strengths: string[]; // Things done well
    weaknesses: string[]; // Areas to improve
    topic_analysis?: TopicAnalysis[]; // NEW
    topic_vocabulary?: TopicVocabulary; // NEW - Topic Word Bank
    coherence_advice?: CoherenceAdvice; // NEW - Strategic Flow Advice
    grammar_errors: GrammarError[];
    vocabulary_suggestions: VocabularySuggestion[];
    coherence_issues: CoherenceIssue[];
    raw_coach_output?: any; // Pass through full backend response
    raw_explainer_output?: any; // Pass through full explainer response (rewrites, etc)
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
