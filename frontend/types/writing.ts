// Enums
export type TaskType = "task1" | "task2";
export type Criterion =
    | "task_response"
    | "coherence_cohesion"
    | "lexical_resource"
    | "grammatical_range_accuracy";

// Examiner Output (immutable)
export interface CriterionScore {
    criterion: Criterion;
    band: number;
    justification: string;
}

export interface ExaminerEvaluation {
    task_type: TaskType;
    overall_band: number;
    criterion_scores: CriterionScore[];
    word_count: number;
    word_count_penalty: boolean;
    off_topic: boolean;
    timestamp: string;
}

// Tutor Output
export interface SentenceRewrite {
    original: string;
    improved: string;
    explanation: string;
}

export interface MicroTask {
    title: string;
    duration_minutes: number;
    instruction: string;
    example?: string;
    targets_criterion: Criterion;
}

export interface BandGap {
    criterion: Criterion;
    current_band: number;
    target_band: number;
    gap: number;
    specific_gaps: string[];
}

export interface TutorFeedback {
    action_plan: string[];
    target_band: number;
    band_gaps: BandGap[];
    rewrites: SentenceRewrite[];
    micro_tasks: MicroTask[];
    strengths_summary: string;
    next_focus: string;
}

// Error Memory
export interface ErrorPattern {
    pattern_type: string;
    examples: string[];
    frequency: number;
    first_seen: string;
    last_seen: string;
}

// Combined Response
export interface WritingFeedbackResponse {
    evaluation: ExaminerEvaluation;
    coaching: TutorFeedback;
    recurring_errors: ErrorPattern[];
    personalized_tip?: string;
}

// Request
export interface EvaluateRequest {
    task_type: TaskType;
    question: string;
    essay: string;
    target_band?: number;
    user_id?: string;
}
