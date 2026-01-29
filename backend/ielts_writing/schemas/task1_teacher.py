"""
Pydantic schemas for Task 1 Teacher feedback responses.

These schemas are specific to Task 1 (Academic) — describing visual data.
"""

from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Literal, Any
from enum import Enum


# ============== New Educational Sections ==============

class WordPhraseUpgrade(BaseModel):
    """A vocabulary upgrade example."""
    basic: str  # Student's original phrase
    improved: str  # Academic upgrade


class SentenceStructureUpgrade(BaseModel):
    """A sentence structure upgrade example."""
    original: str  # Student's original sentence
    improved: str  # Improved with complex grammar
    explanation: Optional[str] = None  # Why it's better


class VocabularyGrammarUpgrade(BaseModel):
    """Vocabulary and grammar upgrade section."""
    word_phrase_upgrades: List[WordPhraseUpgrade] = Field(min_length=4, max_length=6)
    sentence_structure_upgrades: List[SentenceStructureUpgrade] = Field(min_length=1, max_length=2)


class PrioritizedAction(BaseModel):
    """One prioritized action for band improvement."""
    action: str  # What to fix (command form)
    why: str  # Why it matters
    location: str  # Where it appears in their essay


class BandImprovementPath(BaseModel):
    """Band improvement path section."""
    current_band: float = Field(ge=0, le=9)
    target_band: float = Field(ge=0, le=9)
    prioritized_actions: List[PrioritizedAction] = Field(min_length=3, max_length=3)


class Band7ModelUpgrade(BaseModel):
    """Band 7 model upgrade section."""
    original_paragraph: str  # Student's original paragraph (3-4 sentences)
    improved_paragraph: str  # Band 7 version
    explanation: str  # Why it's better


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


class BandUpgrade(BaseModel):
    """Shows what a better version looks like."""
    current_band: str  # e.g., "6"
    target_band: str  # e.g., "7"
    original: str  # Student's actual sentence
    improved: str  # Band 7 version
    what_changed: str  # Brief explanation (vocabulary/grammar/tone)


class WeaknessPattern(BaseModel):
    """A recurring error pattern."""
    pattern_name: str  # e.g., "Missing Articles with Data"
    description: str   # Brief explanation of the pattern
    examples: List[str]
    frequency: int = Field(ge=1, description="How many times this error occurred")
    impact: str  # How this affects band score
    is_recurring: bool = False  # True if this was flagged in previous essays
    fix: Optional[str] = None
    
    # NEW: Premium feedback enhancements
    score_impact: Literal["high", "medium", "low"] = Field(
        default="medium",
        description="Impact on band score: high (limits Band 7), medium (affects 0.5), low (minor)"
    )
    concrete_example: Optional[str] = Field(
        None,
        description="Specific, actionable clarification starting with 'For example,'"
    )
    band_upgrade: Optional[BandUpgrade] = Field(
        None,
        description="Shows Band 6 vs Band 7 version for high/medium impact issues"
    )

    @field_validator('examples', mode='before')
    @classmethod
    def wrap_string_in_list(cls, v):
        if isinstance(v, str):
            return [v]
        return v


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


class ScoreExplanation(BaseModel):
    """Detailed explanation for a criterion score."""
    
    why_this_score: str = Field(
        ..., 
        description="2-3 sentences explaining why student received this band",
        max_length=300
    )
    band_descriptor_evidence: str = Field(
        ...,
        description="How their work matches official IELTS band descriptors",
        max_length=200
    )
    path_to_improvement: str = Field(
        ...,
        description="Specific advice to reach next band (max 2 sentences)",
        max_length=150
    )
    why_not_higher: Optional[str] = Field(
        None,
        description="1 sentence explaining why not the next band up",
        max_length=200
    )


# ============== Criterion Feedback Schemas ==============

class TaskAchievementFeedback(BaseModel):
    """Feedback specific to Task Achievement (Task 1)."""
    
    band: float = Field(ge=0, le=9)
    status: StatusLevel
    
    # Score explanation
    score_explanation: ScoreExplanation
    
    # Task 1 specific assessments
    overview_quality: OverviewQuality
    overview_feedback: str  # Specific feedback about their overview
    data_accuracy: DataAccuracy
    key_features_covered: bool
    comparisons_made: bool
    
    # General feedback components
    what_it_measures: List[str]
    strengths: List[StrengthItem] = Field(
        ...,
        min_length=2,
        max_length=5,
        description="2-5 specific strengths with exact quotes from the essay"
    )
    weakness_patterns: List[WeaknessPattern] = Field(
        ...,
        min_length=2,
        max_length=5,
        description="2-5 recurring error patterns sorted by score_impact (high→medium→low)"
    )
    tips: List[Tip]
    micro_task: MicroTask
    
    # Sample improved overview (if theirs was weak)
    improved_overview_example: Optional[str] = None


class CoherenceCohesionFeedback(BaseModel):
    """Feedback for Coherence & Cohesion."""
    
    band: float = Field(ge=0, le=9)
    status: StatusLevel
    
    # Score explanation
    score_explanation: ScoreExplanation
    
    # Task 1 specific assessments
    paragraph_structure_ok: bool  # Overview → Details organization
    logical_data_grouping: bool   # Did they group data logically?
    
    what_it_measures: List[str]
    strengths: List[StrengthItem] = Field(
        ...,
        min_length=2,
        max_length=5,
        description="2-5 specific strengths with exact quotes from the essay"
    )
    weakness_patterns: List[WeaknessPattern] = Field(
        ...,
        min_length=2,
        max_length=5,
        description="2-5 recurring error patterns sorted by score_impact (high→medium→low)"
    )
    tips: List[Tip]
    micro_task: MicroTask
    
    # Suggested linkers for Task 1
    suggested_linkers: Optional[List[str]] = None


class LexicalResourceFeedback(BaseModel):
    """Feedback for Lexical Resource."""
    
    band: float = Field(ge=0, le=9)
    status: StatusLevel
    
    # Score explanation
    score_explanation: ScoreExplanation
    
    # Task 1 specific assessments
    trend_vocabulary_range: Literal["excellent", "good", "adequate", "limited"]
    comparison_vocabulary_range: Literal["excellent", "good", "adequate", "limited"]
    collocations_accurate: bool
    spelling_issues: List[str]  # List of misspelled words
    
    what_it_measures: List[str]
    strengths: List[StrengthItem] = Field(
        ...,
        min_length=2,
        max_length=5,
        description="2-5 specific strengths with exact quotes from the essay"
    )
    weakness_patterns: List[WeaknessPattern] = Field(
        ...,
        min_length=2,
        max_length=5,
        description="2-5 recurring error patterns sorted by score_impact (high→medium→low)"
    )
    tips: List[Tip]
    micro_task: MicroTask
    
    # Vocabulary suggestions
    vocabulary_upgrades: Optional[List[dict]] = None  # {"basic": "increased", "academic": "rose sharply"}


class GrammaticalRangeFeedback(BaseModel):
    """Feedback for Grammatical Range & Accuracy."""
    
    band: float = Field(ge=0, le=9)
    status: StatusLevel
    
    # Score explanation
    score_explanation: ScoreExplanation
    
    # Task 1 specific assessments
    tense_consistency: bool      # Appropriate tense usage
    passive_voice_usage: bool    # For processes especially
    article_accuracy: bool       # Common Task 1 issue
    sentence_variety: Literal["excellent", "good", "adequate", "limited"]
    
    what_it_measures: List[str]
    strengths: List[StrengthItem] = Field(
        ...,
        min_length=2,
        max_length=5,
        description="2-5 specific strengths with exact quotes from the essay"
    )
    weakness_patterns: List[WeaknessPattern] = Field(
        ...,
        min_length=2,
        max_length=5,
        description="2-5 recurring error patterns sorted by score_impact (high→medium→low)"
    )
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
    
    # New educational sections
    vocabulary_grammar_upgrade: Optional[VocabularyGrammarUpgrade] = None
    band_improvement_path: Optional[BandImprovementPath] = None
    band7_model_upgrade: Optional[Band7ModelUpgrade] = None
    teachers_final_comment: Optional[str] = None
    
    # Feature coverage feedback (for Task 1 visual analysis)
    feature_coverage_summary: Optional[str] = Field(
        default=None,
        description="Summary of visual features covered (e.g., 'You covered 7/10 key features')"
    )
    missed_critical_features: Optional[List[str]] = Field(
        default=None,
        description="List of critical features student missed"
    )
    data_accuracy_feedback: Optional[List[str]] = Field(
        default=None,
        description="Specific data accuracy corrections"
    )
    
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
    visual_description: Optional[Any] = None  # StructuredVisualDescription or legacy string
    
    # For pattern tracking
    previous_errors: Optional[List[str]] = None
    attempt_number: int = 1
    
    # Examiner scores (from examiner agent)
    examiner_scores: Optional[dict] = None