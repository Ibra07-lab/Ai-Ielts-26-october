from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Union, Literal
from .models import Criterion


class BandUpgrade(BaseModel):
    """Shows what a better version looks like."""
    current_band: str  # e.g., "6"
    target_band: str  # e.g., "7"
    original: str  # Student's actual sentence
    improved: str  # Band 7 version
    what_changed: str  # Brief explanation (vocabulary/grammar/tone)


class WeaknessPattern(BaseModel):
    """A pattern of errors holding the student back."""
    pattern_name: str  # e.g., "Incomplete Overview", "Overusing Simple Linkers"
    examples: List[str]  # List of direct quotes highlighting the error
    problem: str  # Explanation of why this loses marks
    fix: str  # Corrected version or specific solution
    frequency: int = 1 # How many times this pattern occurred
    
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


class ImprovementTip(BaseModel):
    """Actionable improvement advice."""
    tip: str  # Specific actionable advice
    micro_task: str  # 5-15 minute exercise targeting this criterion


class CriterionFeedback(BaseModel):
    """Detailed feedback for one criterion (TA, CC, LR, or GRA)."""
    criterion: Criterion
    band: float = Field(ge=0, le=9)
    
    # What This Measures section
    measures: List[str]  # 3-4 bullet points explaining what this criterion assesses
    
    # What's Holding You Back
    weaknesses: List[WeaknessPattern] = Field(default_factory=list)
    
    # How to Improve
    improvement: ImprovementTip


class OverallSummary(BaseModel):
    """Personal summary addressing the student."""
    personal_note: str  # 2-3 sentences using student's name
    superpower: str  # Strongest criterion + why (1 sentence)
    priority: str  # Weakest criterion + fastest fix (1 sentence)


class FinalActionPlan(BaseModel):
    """What the student should focus on immediately."""
    priority_criterion: Criterion  # The weakest criterion
    reason: str  # 1-sentence explanation of why this gives fastest improvement


class TeacherFeedbackReport(BaseModel):
    """
    Comprehensive teacher feedback report with personalized, 
    criterion-specific feedback following IELTS band descriptors.
    """
    
    # Student Information
    student_name: str
    
    # Overall Summary
    overall_summary: OverallSummary
    
    # Criterion-Specific Feedback (4 sections)
    task_achievement: CriterionFeedback
    coherence_cohesion: CriterionFeedback
    lexical_resource: CriterionFeedback
    grammatical_range_accuracy: CriterionFeedback
    
    # Final Action Plan
    final_action_plan: FinalActionPlan
    
    def get_criterion_feedback(self, criterion: Criterion) -> CriterionFeedback:
        """Helper to get feedback for a specific criterion."""
        mapping = {
            Criterion.TASK_RESPONSE: self.task_achievement,
            Criterion.COHERENCE_COHESION: self.coherence_cohesion,
            Criterion.LEXICAL_RESOURCE: self.lexical_resource,
            Criterion.GRAMMAR: self.grammatical_range_accuracy
        }
        return mapping[criterion]
