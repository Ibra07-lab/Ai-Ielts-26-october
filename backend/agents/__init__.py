"""
IELTS Reading Feedback Agent Package.

This package provides an intelligent feedback system for IELTS Reading practice
using LangChain and OpenAI GPT-4 Turbo.
"""

from .reading_feedback_agent import (
    ReadingFeedbackAgent,
    FeedbackInput,
    FeedbackOutput,
    create_reading_feedback_agent
)
from .explain_agent import ExplainAgent
from .vector_store import PassageVectorStore

__version__ = "1.0.0"
__all__ = [
    "ReadingFeedbackAgent",
    "FeedbackInput",
    "FeedbackOutput",
    "create_reading_feedback_agent",
    "ExplainAgent",
    "PassageVectorStore"
]

