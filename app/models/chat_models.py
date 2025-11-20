from pydantic import BaseModel
from typing import Literal


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

