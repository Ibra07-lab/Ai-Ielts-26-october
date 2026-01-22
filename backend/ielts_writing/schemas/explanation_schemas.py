"""
Pydantic schemas for criterion-specific explanations.

This module provides concise, structured explanations for each IELTS Writing
criterion. These complement the existing verbose teacher feedback with
short, actionable insights.
"""

from pydantic import BaseModel, Field
from typing import List, Literal


class WhatYouDidWell(BaseModel):
    """A specific strength with evidence."""
    label: str = Field(..., min_length=3, max_length=100, description="3-6 words describing the strength")
    quote: str = Field(..., description="Exact quote from essay")
    comment: str = Field(..., max_length=300, description="Max 18 words explaining why this is good")


class MainIssue(BaseModel):
    """A recurring error pattern (not a single mistake)."""
    label: str = Field(..., min_length=3, max_length=100, description="3-6 words naming the pattern")
    why_it_matters: str = Field(..., max_length=300, description="1 sentence, max 18 words")
    frequency: str = Field(..., description="e.g., 'about 3 times', 'in several sentences', 'throughout the essay'")
    examples: List[str] = Field(..., min_items=1, max_items=10, description="1-10 short quotes from essay")
    fix: str = Field(..., max_length=300, description="1 short sentence starting with 'Add…', 'Change…', or 'Summarise…'")


class ImprovementStep(BaseModel):
    """One concrete action to reach the next band."""
    description: str = Field(..., description="One main action that would most quickly raise this criterion")
    improved_example: str = Field(..., description="Improved sentence or paragraph showing the fix")


class CriterionExplanation(BaseModel):
    """
    Base explanation structure for any criterion.
    
    This format is designed to be:
    - SHORT (summary ≤40 words)
    - CLEAR (simple language, direct address)
    - ACTIONABLE (specific fixes, not theory)
    """
    criterion: str = Field(..., description="Criterion name: task_achievement, coherence_cohesion, lexical_resource, grammatical_range_accuracy")
    band: float = Field(..., ge=0, le=9, description="Band score for this criterion")
    
    summary: str = Field(
        ..., 
        max_length=500,
        description="Exactly 2 sentences, max 40 words total. Sentence 1: overall judgment. Sentence 2: main reason + missing piece"
    )
    
    what_you_did_well: List[WhatYouDidWell] = Field(
        ..., 
        min_items=1, 
        max_items=20,
        description="List of specific strengths with quotes"
    )
    
    main_issues: List[MainIssue] = Field(
        ..., 
        min_items=1, 
        max_items=20,
        description="List of PATTERNS (not single mistakes)"
    )
    
    why_not_higher: str = Field(
        ..., 
        max_length=500,
        description="1-2 sentences explaining why Band X.X and NOT Band X+0.5"
    )
    
    improvement_step: ImprovementStep = Field(
        ...,
        description="One concrete action + improved example"
    )


class TaskAchievementExplanation(CriterionExplanation):
    """Task Achievement explanation for Task 1."""
    criterion: Literal["task_achievement"] = "task_achievement"


class CoherenceCohesionExplanation(CriterionExplanation):
    """Coherence & Cohesion explanation."""
    criterion: Literal["coherence_cohesion"] = "coherence_cohesion"


class LexicalResourceExplanation(CriterionExplanation):
    """Lexical Resource explanation."""
    criterion: Literal["lexical_resource"] = "lexical_resource"


class GrammaticalRangeExplanation(CriterionExplanation):
    """Grammatical Range & Accuracy explanation."""
    criterion: Literal["grammatical_range_accuracy"] = "grammatical_range_accuracy"


class WritingExplanations(BaseModel):
    """
    Complete set of explanations for all 4 criteria.
    
    This is added to the main Task 1 response alongside existing
    teacher_feedback and examiner scores.
    """
    task_achievement: TaskAchievementExplanation
    coherence_cohesion: CoherenceCohesionExplanation
    lexical_resource: LexicalResourceExplanation
    grammatical_range_accuracy: GrammaticalRangeExplanation
