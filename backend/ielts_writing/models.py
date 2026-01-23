from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Any, Union


class TaskType(str, Enum):
    TASK1 = "task1"
    TASK2 = "task2"


class Criterion(str, Enum):
    TASK_RESPONSE = "task_response"
    TASK_ACHIEVEMENT = "task_achievement"
    COHERENCE_COHESION = "coherence_cohesion"
    LEXICAL_RESOURCE = "lexical_resource"
    GRAMMAR = "grammatical_range_accuracy"


# --- Examiner Output (immutable) ---
class CriterionScore(BaseModel):
    criterion: Criterion
    band: float = Field(ge=0, le=9)
    justification: Optional[str] = None  # ≤25 words roughly


class BandRange(BaseModel):
    """Confidence range for band score."""
    low: float = Field(ge=0, le=9)
    high: float = Field(ge=0, le=9)


class ExaminerEvaluation(BaseModel):
    """Strict scoring output - no advice, just facts."""
    task_type: TaskType
    overall_band: float
    band_range: BandRange  # NEW: Confidence interval
    criterion_scores: List[CriterionScore]
    word_count: int
    word_count_ok: bool  # NEW: True if meets minimum (150 for Task 1, 250 for Task 2)
    word_count_penalty: bool  # DEPRECATED: Use word_count_ok instead
    off_topic: Optional[bool] = False
    copying_detected: Optional[dict] = None  # Plagiarism check results
    visual_description: Optional[Union[str, Any]] = None  # StructuredVisualDescription or legacy string (if provided)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# --- Tutor Output ---
class SentenceRewrite(BaseModel):
    original: str
    improved: str
    explanation: str  # Why this is better


class GrammarError(BaseModel):
    """Structured grammar error feedback."""
    original: str
    corrected: str
    explanation: str
    tip: str


class VocabularySuggestion(BaseModel):
    """Structured vocabulary improvement suggestion."""
    original: str
    better_options: List[str]  # Alternative words/phrases
    context: str  # When/why to use alternatives


class CoherenceIssue(BaseModel):
    """Structured coherence and cohesion feedback."""
    text: str  # Problematic text
    suggestion: str  # Improved version
    reason: str  # Why it's better


class MicroTask(BaseModel):
    title: str = "Practice Task"
    duration_minutes: int = 15
    instruction: str = ""
    task: Optional[str] = None # Fallback for when LLM uses 'task' instead of 'instruction'
    example: str = ""
    targets_criterion: Optional[Criterion] = None


class BandGap(BaseModel):
    criterion: Criterion
    current_band: float
    target_band: float
    gap: float
    specific_gaps: List[str]  # What's missing to reach target


class TutorFeedback(BaseModel):
    """Coaching output based on examiner's evaluation."""
    
    # Priority action plan (max 3)
    action_plan: List[str] # Priority action plan (max 3)
    
    # What student did well
    strengths: List[str] = Field(default_factory=list)
    
    # Areas to improve
    weaknesses: List[str] = Field(default_factory=list)
    
    # Structured feedback arrays (NEW)
    grammar_errors: List[GrammarError] = Field(default_factory=list)
    vocabulary_suggestions: List[VocabularySuggestion] = Field(default_factory=list)
    coherence_issues: List[CoherenceIssue] = Field(default_factory=list)
    
    # Band gap analysis
    target_band: float
    band_gaps: List[BandGap]
    
    # Concrete rewrites
    rewrites: List[SentenceRewrite] = Field(default_factory=list)
    
    # Targeted practice
    micro_tasks: List[MicroTask] = Field(default_factory=list)
    
    # Encouragement (LEGACY - use strengths/weaknesses instead)
    strengths_summary: Optional[str] = None
    next_focus: Optional[str] = None


# --- Error Memory ---
class ErrorPattern(BaseModel):
    pattern_type: str  # "articles", "verb_tense", "weak_vocabulary", etc.
    examples: List[str]
    frequency: int
    first_seen: datetime
    last_seen: datetime


class UserErrorProfile(BaseModel):
    user_id: str
    patterns: List[ErrorPattern]
    total_submissions: int
    average_band: float
    strongest_criterion: Criterion
    weakest_criterion: Criterion


# --- Combined Response ---
class WritingFeedbackResponse(BaseModel):
    """Complete response combining both agents."""
    
    # From Examiner (immutable facts)
    evaluation: ExaminerEvaluation
    
    # From Tutor (actionable coaching)
    coaching: TutorFeedback
    
    # From Memory (personalized)
    recurring_errors: List[ErrorPattern]
    personalized_tip: Optional[str] = None


class WritingFeedbackWithTeacherReport(WritingFeedbackResponse):
    """Extended response that includes comprehensive teacher report."""
    
    teacher_report: Optional[Any] = None  # TeacherFeedbackReport - using Any to avoid circular import


# --- Request ---
class EvaluateRequest(BaseModel):
    task_type: TaskType
    question: str
    essay: str
    target_band: float = 7.0
    user_id: Optional[str] = None  # For error memory
    student_name: Optional[str] = None  # For personalized teacher reports
    image_url: Optional[str] = None  # Path or URL to chart/graph for Task 1
    chart_type: Optional[str] = None  # "Bar Chart", "Line Graph", "Pie Chart", "Map", etc.


# Rebuild models to resolve forward references
WritingFeedbackWithTeacherReport.model_rebuild()
