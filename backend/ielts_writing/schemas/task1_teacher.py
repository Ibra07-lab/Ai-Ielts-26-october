"""
Pydantic schemas for Task 1 Teacher feedback responses.

These schemas are specific to Task 1 (Academic) — describing visual data.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from enum import Enum


class StatusLevel(str, Enum):
    """Performance status for each criterion."""
    STRONG = "strong"
    DEVELOPING = "developing"
    NEEDS_WORK = "needs_work"


class OverviewQuality(str, Enum):
    """Quality of the overview paragraph."""
    EXCELLENT = "excellent"
    GOOD = "good"
    BASIC = "basic"
    UNCLEAR = "unclear"
    MISSING = "missing"


class DataAccuracy(str, Enum):
    """Accuracy of data cited in the essay."""
    ACCURATE = "accurate"
    MINOR_ERRORS = "minor_errors"
    SIGNIFICANT_ERRORS = "significant_errors"


# ============== Component Schemas ==============

class CriterionScore(BaseModel):
    """Score for a single criterion."""
    criterion: str
    band: float = Field(ge=0, le=9)
    status: StatusLevel
    

class StrengthItem(BaseModel):
    """A specific strength with quoted evidence."""
    category: str  # e.g., "Overview", "Data Selection", "Vocabulary"
    quote: str     # Exact quote from essay
    explanation: str  # Why this is effective
    

class ErrorExample(BaseModel):
    """An error with original and corrected versions."""
    original: str
    corrected: str
    explanation: Optional[str] = None


class WeaknessPattern(BaseModel):
    """A recurring error pattern."""
    pattern_name: str  # e.g., "Missing Articles with Data"
    description: str   # Brief explanation of the pattern
    examples: List[ErrorExample]
    frequency: int = Field(ge=1, description="How many times this error occurred")
    impact: str  # How this affects band score
    is_recurring: bool = False  # True if this was flagged in previous essays


class MicroTask(BaseModel):
    """A short practice task for improvement."""
    task_type: str  # e.g., "Rewrite", "Fill-in", "Practice"
    instruction: str
    examples: Optional[List[str]] = None  # Example sentences to work with
    time_minutes: int = Field(ge=5, le=20)


class Tip(BaseModel):
    """An actionable improvement tip."""
    tip: str
    priority: Literal["high", "medium", "low"] = "medium"


# ============== Criterion Feedback Schemas ==============

class TaskAchievementFeedback(BaseModel):
    """Feedback specific to Task Achievement (Task 1)."""
    
    band: float = Field(ge=0, le=9)
    status: StatusLevel
    
    # Task 1 specific assessments
    overview_quality: OverviewQuality
    overview_feedback: str  # Specific feedback about their overview
    data_accuracy: DataAccuracy
    key_features_covered: bool
    comparisons_made: bool
    
    # General feedback components
    what_it_measures: List[str]
    strengths: List[StrengthItem]
    weakness_patterns: List[WeaknessPattern]
    tips: List[Tip]
    micro_task: MicroTask
    
    # Sample improved overview (if theirs was weak)
    improved_overview_example: Optional[str] = None


class CoherenceCohesionFeedback(BaseModel):
    """Feedback for Coherence & Cohesion."""
    
    band: float = Field(ge=0, le=9)
    status: StatusLevel
    
    # Task 1 specific assessments
    paragraph_structure_ok: bool  # Overview → Details organization
    logical_data_grouping: bool   # Did they group data logically?
    
    what_it_measures: List[str]
    strengths: List[StrengthItem]
    weakness_patterns: List[WeaknessPattern]
    tips: List[Tip]
    micro_task: MicroTask
    
    # Suggested linkers for Task 1
    suggested_linkers: Optional[List[str]] = None


class LexicalResourceFeedback(BaseModel):
    """Feedback for Lexical Resource."""
    
    band: float = Field(ge=0, le=9)
    status: StatusLevel
    
    # Task 1 specific assessments
    trend_vocabulary_range: Literal["excellent", "good", "adequate", "limited"]
    comparison_vocabulary_range: Literal["excellent", "good", "adequate", "limited"]
    collocations_accurate: bool
    spelling_issues: List[str]  # List of misspelled words
    
    what_it_measures: List[str]
    strengths: List[StrengthItem]
    weakness_patterns: List[WeaknessPattern]
    tips: List[Tip]
    micro_task: MicroTask
    
    # Vocabulary suggestions
    vocabulary_upgrades: Optional[List[dict]] = None  # {"basic": "increased", "academic": "rose sharply"}


class GrammaticalRangeFeedback(BaseModel):
    """Feedback for Grammatical Range & Accuracy."""
    
    band: float = Field(ge=0, le=9)
    status: StatusLevel
    
    # Task 1 specific assessments
    tense_consistency: bool      # Appropriate tense usage
    passive_voice_usage: bool    # For processes especially
    article_accuracy: bool       # Common Task 1 issue
    sentence_variety: Literal["excellent", "good", "adequate", "limited"]
    
    what_it_measures: List[str]
    strengths: List[StrengthItem]
    weakness_patterns: List[WeaknessPattern]
    tips: List[Tip]
    micro_task: MicroTask
    
    # Grammar focus for Task 1
    grammar_focus_areas: Optional[List[str]] = None


# ============== Summary and Action Plan ==============

class OverallSummary(BaseModel):
    """Overall summary at the top of the report."""
    
    personal_note: str  # 2-3 sentences using student name
    
    scores: List[CriterionScore]
    estimated_overall: float = Field(ge=0, le=9)
    
    superpower: str  # Their strongest skill
    superpower_example: str  # Quoted example
    
    priority: str  # Their biggest improvement opportunity
    priority_quick_win: str  # One thing they can fix immediately


class PracticeDay(BaseModel):
    """One day's practice in the action plan."""
    day: int
    focus: str
    task: str
    time_minutes: int


class ActionPlan(BaseModel):
    """Final action plan for improvement."""
    
    priority_focus: str  # Which criterion to focus on
    priority_reason: str  # Why this is the priority
    
    practice_schedule: List[PracticeDay]  # 3-day schedule
    
    pre_writing_checklist: List[str]  # Checklist before next essay
    
    closing_message: str  # Encouraging final message


# ============== Main Response Schema ==============

class Task1TeacherFeedbackResponse(BaseModel):
    """Complete teacher feedback response for Task 1."""
    
    # Metadata
    student_name: str
    task_type: Literal["task1"] = "task1"
    chart_type: Optional[str] = None
    word_count: int
    attempt_number: int = 1
    
    # Overall summary
    overall_summary: OverallSummary
    
    # Criterion-by-criterion feedback
    task_achievement: TaskAchievementFeedback
    coherence_cohesion: CoherenceCohesionFeedback
    lexical_resource: LexicalResourceFeedback
    grammatical_range: GrammaticalRangeFeedback
    
    # Action plan
    action_plan: ActionPlan
    
    # Optional: Track improvement over time
    improvement_notes: Optional[str] = None  # Compared to previous attempts


class Task1TeacherFeedbackRequest(BaseModel):
    """Request model for Task 1 teacher feedback."""
    
    student_name: str
    essay: str
    question: str
    
    # Optional context
    chart_type: Optional[str] = None  # line, bar, pie, table, map, process
    image_url: Optional[str] = None
    
    # For pattern tracking
    previous_errors: Optional[List[str]] = None
    attempt_number: int = 1
    
    # Examiner scores (from examiner agent)
    examiner_scores: Optional[dict] = None