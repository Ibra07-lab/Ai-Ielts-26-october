"""
Base schemas for IELTS Writing evaluation.
Shared across examiner and teacher agents.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Any
from enum import Enum


class StatusLevel(str, Enum):
    """Performance status for each criterion."""
    STRONG = "strong"
    DEVELOPING = "developing"
    NEEDS_WORK = "needs_work"


class BandRange(BaseModel):
    """Confidence range for band score."""
    low: float = Field(ge=0, le=9)
    high: float = Field(ge=0, le=9)


class CriterionScoreBase(BaseModel):
    """Base model for criterion scores."""
    band: float = Field(ge=0, le=9)
    justification: str = Field(..., description="Evidence for the score")


class ErrorPattern(BaseModel):
    """Represents a recurring error pattern."""
    pattern_name: str
    description: str
    examples: List[str] = Field(default_factory=list)
    frequency: int = 1
    fix: Optional[str] = None



class MicroTask(BaseModel):
    """A short practice task."""
    task_type: str
    instruction: str
    examples: Optional[List[str]] = None
    time_minutes: int = Field(ge=5, le=30)


class ActionPlanDay(BaseModel):
    """One day's practice in an action plan."""
    day: int
    focus: str
    task: str
    time_minutes: int
