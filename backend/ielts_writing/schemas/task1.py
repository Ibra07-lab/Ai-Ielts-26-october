"""
Task 1 specific schemas.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Union, Any, Dict
from enum import Enum

from ielts_writing.schemas.base import (
    StatusLevel,
    CriterionScoreBase,
    BandRange,
    ErrorPattern,
    StrengthItem,
    MicroTask,
    ActionPlanDay
)


# ============================================================
# TASK 1 ENUMS
# ============================================================

class ChartType(str, Enum):
    """Types of visual data in Task 1."""
    LINE_GRAPH = "line_graph"
    BAR_CHART = "bar_chart"
    PIE_CHART = "pie_chart"
    TABLE = "table"
    MAP = "map"
    PROCESS_DIAGRAM = "process_diagram"
    MIXED = "mixed"  # Multiple chart types
    UNKNOWN = "unknown"


class OverviewQuality(str, Enum):
    """Quality of the overview paragraph."""
    CLEAR = "clear"           # Band 7+ quality
    ADEQUATE = "adequate"     # Band 6 quality
    UNCLEAR = "unclear"       # Band 5 quality
    MISSING = "missing"       # No overview present


class DataAccuracy(str, Enum):
    """Accuracy of data mentioned in the essay."""
    ACCURATE = "accurate"                 # All data correct
    MINOR_ERRORS = "minor_errors"         # 1-2 small inaccuracies
    SIGNIFICANT_ERRORS = "significant_errors"  # Major inaccuracies


# ============================================================
# EXAMINER RESPONSE MODELS
# ============================================================

class Task1CriterionScore(CriterionScoreBase):
    """Task 1 specific criterion score."""
    criterion: Literal[
        "task_achievement",
        "coherence_cohesion", 
        "lexical_resource",
        "grammatical_range_accuracy"
    ]


class Task1ExaminerRequest(BaseModel):
    """Request model for Task 1 examiner."""
    essay: str = Field(min_length=50, description="Student's essay text")
    question: str = Field(description="The task question/prompt")
    image_url: Optional[str] = Field(default=None, description="URL to chart/graph image")
    chart_type: Optional[ChartType] = Field(default=None, description="Type of visual")
    image_description: Optional[Union[str, Dict[str, Any]]] = Field(
        default=None, 
        description="Text or structured description of the chart/image (IMAGE_METADATA). When provided, this is used as the source of truth instead of analyzing the image."
    )
    

class Task1ExaminerResponse(BaseModel):
    """Complete response from Task 1 examiner."""
    
    # Basic info
    task_type: Literal["task1"] = "task1"
    chart_type: ChartType = ChartType.UNKNOWN
    
    # Scores
    overall_band: float = Field(ge=0, le=9)
    band_range: BandRange
    criterion_scores: List[Task1CriterionScore] = Field(min_length=4, max_length=4)
    
    # Word count analysis
    word_count: int = Field(ge=0)
    word_count_ok: bool
    word_count_penalty: bool = False
    word_count_penalty_amount: float = Field(default=0, ge=0, le=1)
    
    # Task 1 specific checks
    overview_present: bool
    overview_quality: OverviewQuality
    data_accuracy: DataAccuracy
    key_features_covered: bool
    comparisons_made: bool
    
    # Quality flags
    off_topic: bool = False
    memorized_content_detected: bool = False
    question_copied: bool = False  # Did they copy the question word-for-word?
    
    # Issues found
    red_flags: List[str] = Field(default_factory=list)
    
    # Visual description (structured or legacy string)
    visual_description: Optional[Union[dict, str, Any]] = Field(
        default=None,
        description="Structured visual description (StructuredVisualDescription) or legacy string format"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "task_type": "task1",
                "chart_type": "line_graph",
                "overall_band": 6.5,
                "band_range": {"low": 6.0, "high": 7.0},
                "criterion_scores": [
                    {"criterion": "task_achievement", "band": 6.5, "justification": "Clear overview present. Key features identified with data."},
                    {"criterion": "coherence_cohesion", "band": 6.0, "justification": "Logical structure but mechanical use of linkers."},
                    {"criterion": "lexical_resource", "band": 7.0, "justification": "Good range: 'fluctuated', 'witnessed'. Minor spelling error."},
                    {"criterion": "grammatical_range_accuracy", "band": 6.5, "justification": "Mix of structures. Some article errors."}
                ],
                "word_count": 172,
                "word_count_ok": True,
                "word_count_penalty": False,
                "overview_present": True,
                "overview_quality": "clear",
                "data_accuracy": "accurate",
                "key_features_covered": True,
                "comparisons_made": True,
                "red_flags": []
            }
        }


# ============================================================
# TEACHER FEEDBACK MODELS
# ============================================================

class Task1CriterionFeedback(BaseModel):
    """Detailed feedback for one criterion in Task 1."""
    
    criterion_name: Literal[
        "Task Achievement",
        "Coherence & Cohesion",
        "Lexical Resource", 
        "Grammatical Range & Accuracy"
    ]
    band: float = Field(ge=0, le=9)
    status: StatusLevel
    
    # What this measures (Task 1 specific descriptions)
    what_it_measures: List[str]
    
    # Strengths with evidence
    strengths: List[StrengthItem] = Field(max_length=3)
    
    # Weakness patterns (not individual errors)
    weakness_patterns: List[ErrorPattern] = Field(max_length=3)
    
    # Actionable tips
    tips: List[str] = Field(min_length=1, max_length=3)
    
    # Micro-task for practice
    micro_task: MicroTask


class Task1OverallSummary(BaseModel):
    """Overall summary section of teacher feedback."""
    
    personal_note: str = Field(
        description="2-3 sentences addressing student by name",
        min_length=50,
        max_length=500
    )
    
    scores: List[Task1CriterionScore]
    estimated_overall: float = Field(ge=0, le=9)
    
    superpower: str = Field(description="Their strongest area with brief explanation")
    priority: str = Field(description="Most important area to improve with quick fix")
    
    # Task 1 specific summary
    overview_status: str = Field(description="Assessment of their overview")
    data_handling: str = Field(description="How well they used data")


class Task1TeacherRequest(BaseModel):
    """Request for Task 1 teacher feedback."""
    
    student_name: str = Field(min_length=1, max_length=100)
    essay: str = Field(min_length=50)
    question: str
    
    # Optional context
    chart_type: Optional[ChartType] = None
    image_url: Optional[str] = None
    previous_errors: Optional[List[str]] = Field(
        default=None,
        description="Error patterns from previous essays"
    )
    
    # Examiner scores (if already available)
    examiner_result: Optional[Task1ExaminerResponse] = None


class Task1TeacherResponse(BaseModel):
    """Complete teacher feedback for Task 1."""
    
    # Student info
    student_name: str
    task_type: Literal["task1"] = "task1"
    chart_type: ChartType
    
    # Overall summary
    overall_summary: Task1OverallSummary
    
    # Section-by-section feedback
    task_achievement: Task1CriterionFeedback
    coherence_cohesion: Task1CriterionFeedback
    lexical_resource: Task1CriterionFeedback
    grammatical_range: Task1CriterionFeedback
    
    # Task 1 specific feedback
    overview_feedback: str = Field(description="Specific feedback on their overview")
    data_description_feedback: str = Field(description="How they described data")
    comparison_feedback: str = Field(description="How they made comparisons")
    
    # Vocabulary specific to Task 1
    trend_vocabulary_used: List[str] = Field(description="Good trend words they used")
    trend_vocabulary_to_learn: List[str] = Field(description="Useful words they should learn")
    
    # Action plan
    priority_focus: str
    priority_reason: str
    practice_schedule: List[ActionPlanDay] = Field(min_length=3, max_length=3)
    pre_essay_checklist: List[str] = Field(min_length=3, max_length=5)
    
    # Closing
    closing_message: str = Field(description="Encouraging closing with student name")
    
    class Config:
        json_schema_extra = {
            "example": {
                "student_name": "Ahmed",
                "task_type": "task1",
                "chart_type": "line_graph",
                "overall_summary": {
                    "personal_note": "Ahmed, you've written a well-organized response...",
                    "scores": [],
                    "estimated_overall": 6.5,
                    "superpower": "Lexical Resource — your trend vocabulary is strong",
                    "priority": "Task Achievement — add a clearer overview",
                    "overview_status": "Present but could be more comprehensive",
                    "data_handling": "Good use of specific figures"
                }
            }
        }


# ============================================================
# COMBINED PIPELINE RESPONSE
# ============================================================

class Task1PipelineResponse(BaseModel):
    """Complete response from the Task 1 pipeline."""
    
    success: bool
    student_name: str
    task_type: Literal["task1"] = "task1"
    
    # Examiner results
    examiner_result: Task1ExaminerResponse
    
    # Quick access to scores
    scores: dict = Field(description="Quick access to band scores")
    
    # Teacher feedback (optional)
    teacher_feedback: Optional[Task1TeacherResponse] = None
    
    # Markdown formatted feedback (optional)
    feedback_markdown: Optional[str] = None
    
    # Error info if failed
    error: Optional[str] = None