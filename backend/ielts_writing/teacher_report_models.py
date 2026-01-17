from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Union
from .models import Criterion


class Strength(BaseModel):
    """A specific strength with quoted example from the essay."""
    point: str  # The strength statement
    quote: str  # Direct quote from essay demonstrating this strength


class WeaknessPattern(BaseModel):
    """A pattern of errors holding the student back."""
    pattern_name: str  # e.g., "Incomplete Overview", "Overusing Simple Linkers"
    examples: List[str]  # List of direct quotes highlighting the error
    problem: str  # Explanation of why this loses marks
    fix: str  # Corrected version or specific solution
    frequency: int = 1 # How many times this pattern occurred

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
    
    # What You Did Well
    strengths: List[Strength] = Field(default_factory=list)
    
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
