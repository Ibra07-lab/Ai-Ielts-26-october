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

export type HighlightType = "grammar" | "vocabulary" | "coherence";

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
    score_overview?: string;
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
}

export interface DetailedFeedback {
    task_response: CriterionFeedback;
    coherence: CriterionFeedback;
    lexical: CriterionFeedback;
    grammar: CriterionFeedback;
}

// ----------------------------------------------------------------------------
// Idea Development Analysis (from Explainer - Task 2)
// ----------------------------------------------------------------------------

export interface IdeaNode {
    paragraph_index: number;
    idea_summary: string;
    development_level: 'well_developed' | 'partially_developed' | 'underdeveloped' | 'missing';
    development_details: string;
    evidence_used?: string;
    missing_elements: string[];
}

export interface AlternativeIdea {
    idea: string;
    why_strong: string;
    example_sentence: string;
    topic_relevance: string;
}

export interface IdeaDevelopmentAnalysis {
    essay_thesis: string;
    thesis_clarity: 'clear' | 'vague' | 'missing';
    idea_map: IdeaNode[];
    alternative_ideas: AlternativeIdea[];
    overall_assessment: string;
}

// ----------------------------------------------------------------------------
// Lexical Resource Breakdown (from Explainer)
// ----------------------------------------------------------------------------

export interface VocabDrill {
    drill_name: string;
    weakness_targeted: string;
    instructions: string;
    practice_items: string[];
    example_before?: string;
    example_after?: string;
}

export interface TopicWordBankItem {
    term: string;
    definition?: string;
    example_sentence: string;
}

export interface TopicWordBank {
    topic: string;
    words: TopicWordBankItem[];
    collocations: TopicWordBankItem[];
}

export interface LexicalBreakdown {
    range_score: 'wide' | 'sufficient' | 'adequate' | 'limited';
    range_details: string;
    accuracy_score: 'precise' | 'generally_accurate' | 'some_errors' | 'frequent_errors';
    accuracy_details: string;
    vocab_drills: VocabDrill[];
    topic_word_bank?: TopicWordBank;
    overall_lr_assessment?: string;
}

// ----------------------------------------------------------------------------
// Task 1 Explainer Outputs
// ----------------------------------------------------------------------------

export interface Task1OverviewFeedback {
    original_overview: string;
    improved_overview: string;
    diagnosis: string;
}

export interface DataAccuracyFix {
    original_sentence: string;
    issue_description: string;
    corrected_data: string;
}

export interface DataCoverageItem {
    feature_description: string;
    covered_in_essay: boolean;
    how_covered?: string;
    why_important: string;
    suggested_sentence?: string;
}

export interface Task1DataCoverageAnalysis {
    total_key_features: number;
    features_covered: number;
    features_missed: number;
    feature_map: DataCoverageItem[];
    data_accuracy_issues: DataAccuracyFix[];
    ignored_dual_chart: boolean;
    has_personal_opinion: boolean;
    opinion_sentence?: string;
    overall_assessment: string;
}

export interface Task1TrendDescriptionFix {
    original_description: string;
    improved_description: string;
    why_better: string;
}

// ----------------------------------------------------------------------------
// Task 1 Coherence & Cohesion (New Pipeline)
// ----------------------------------------------------------------------------

export interface ParagraphStructureFeedback {
    paragraph_count: number;
    has_clear_breaks: boolean;
    expected_structure: string[];
    detected_structure: string[];
    feedback_message: string;
}

export interface Task1OverviewPositionFeedback {
    overview_present: boolean;
    position_correct: boolean;
    detected_position: string | null;
    overview_quality: string;
    original_overview: string | null;
    issues: string[];
    improved_overview: string | null;
    key_changes_made: string[];
}

export interface DataGroupingFix {
    scattered_sentences: string[];
    grouped_sentence: string;
    explanation: string;
}

export interface ReferencingError {
    original_sentence: string;
    ambiguous_pronoun: string;
    corrected_sentence: string;
}

export interface ConnectorAnalysis {
    overused_connectors: string[];
    cohesion_fixes: CohesionIssueFix[]; // renamed slightly to avoid confusion, or use existing if any
}

export interface CohesionIssueFix {
    original_sentence: string;
    mechanical_linker_used: string;
    improved_sentence: string;
    technique_used: string;
    technique_explanation: string;
}

export interface ComparisonLanguage {
    comparisons_used: string[];
    missing_comparisons: string[];
    feedback_message: string;
}

export interface Task1CoherenceFeedback {
    paragraph_structure: ParagraphStructureFeedback;
    overview_feedback: Task1OverviewPositionFeedback;
    data_grouping_fixes: DataGroupingFix[];
    referencing_errors: ReferencingError[];
    connector_analysis: ConnectorAnalysis;
    comparison_language: ComparisonLanguage;
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
    type?: string;        // 'mapping', 'connector', 'grouping', 'referencing'
}

export interface TopicAnalysis {
    topic: string;
    count: number;
    category: string;
    description: string;
    why_it_matters: string;
    evidence_from_essay?: string;
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

export interface RootCauseAnalysis {
    root_cause_type: string;
    coaching_priority: string;
    blocking_criterion: string;
    score_cap_explanation: string;
    evidence_from_essay: string;
}

export interface DiagnosisSummary {
    strength_acknowledged: string;
    core_limitation: string;
    full_summary: string;
}

export interface TheOneBigChange {
    change_statement: string;
    why_this_matters_most: string;
    what_to_stop_doing: string;
    what_to_start_doing: string;
    visual_reminder: string;
}

export interface BannedItem {
    banned_element: string;
    why_banned: string;
    alternative_to_use: string;
    example_transformation: string;
}

export interface RequiredElement {
    required_technique: string;
    minimum_instances: number;
    how_to_implement: string;
    example: string;
}

export interface PatternBreaker {
    habit_identified: string;
    habit_frequency: string;
    banned_list: BannedItem[];
    required_list: RequiredElement[];
}

export interface SuccessCriterion {
    criterion: string;
    how_to_check: string;
}

export interface MicroDrill {
    drill_type: string;
    drill_name: string;
    time_limit_minutes: number;
    purpose: string;
    examiner_insight?: string;
    instructions: string;
    practice_content: string;
    success_criteria: SuccessCriterion[];
    variation_for_tomorrow: string;
    alternative_drill?: string;
}

export interface EssayConstraint {
    constraint_id: number;
    category: string;
    rule: string;
    rationale: string;
    how_to_verify: string;
}

export interface NextEssayPlan {
    recommended_prompt?: string;
    prompt_type_to_practice: string;
    rewrite_original: boolean;
    constraints: EssayConstraint[];
    pre_writing_checklist: string[];
    target_word_count: number;
    time_allocation: any; // Dict
}

export interface Motivation {
    current_level_context: string;
    specific_progress_marker: string;
    achievable_next_milestone: string;
    closing_message: string;
}

export interface ScoreContext {
    current_overall: number;
    lowest_criterion: string;
    lowest_score: number;
    highest_criterion: string;
    highest_score: number;
    realistic_next_target: number;
    if_change_implemented: number;
    improvement_timeline: string;
}

export interface CoachingResult {
    action_plan: string[]; // Array of 3 priority fixes
    weaknesses: string[]; // Areas to improve
    topic_analysis?: TopicAnalysis[]; // NEW
    topic_vocabulary?: TopicVocabulary; // NEW - Topic Word Bank
    coherence_advice?: CoherenceAdvice; // NEW - Strategic Flow Advice
    grammar_errors: GrammarError[];
    vocabulary_suggestions: VocabularySuggestion[];
    coherence_issues: CoherenceIssue[];

    // Advanced Coaching
    score_context?: ScoreContext;
    root_cause_analysis?: RootCauseAnalysis;
    diagnosis_summary?: DiagnosisSummary;
    the_one_big_change?: TheOneBigChange;
    pattern_breaker?: PatternBreaker;
    micro_drill?: MicroDrill;
    next_essay_plan?: NextEssayPlan;
    motivation?: Motivation;

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
    corrected?: string; // Optional
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
