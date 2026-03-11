from pydantic import BaseModel
from typing import Literal, Optional, List, Dict, Any


# This file will contain all models related to chat interactions.


class ChatMessage(BaseModel):
    """Represents a single message in the chat history."""
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    """Represents the data sent from the frontend for each chat turn."""
    session_id: str
    messages: list[ChatMessage]
    # This field will be present when a user drags and drops a question
    dropped_question_id: str | None = None


class DeeperFeedbackRequest(BaseModel):
    passage_id: str
    question_id: str
    student_answer: str


class RecentError(BaseModel):
    """A recent wrong answer for training context."""
    question: str
    correct_answer: str
    student_answer: str
    passage_statement: Optional[str] = None


class TrainingStartRequest(BaseModel):
    """Request body for starting a training session."""
    session_id: str
    skill: str  # e.g. "tfng"
    student_id: str
    accuracy: float  # e.g. 30.0
    total_attempted: int
    correct: int
    recent_errors: List[RecentError] = []


class TrainingStartResponse(BaseModel):
    """Response from starting a training session."""
    session_id: str
    first_message: str
