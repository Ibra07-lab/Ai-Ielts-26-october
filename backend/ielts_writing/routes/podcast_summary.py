"""
Podcast Summary Evaluation API Routes.

POST /podcast-summary/evaluate — Evaluate a student's podcast summary using Gemini 2.0 Flash.
"""

import asyncio
import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field

from ..agents.podcast_summary_agent import PodcastSummaryAgent
from ..auth import require_auth

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/podcast-summary", tags=["Podcast Summary Evaluation"])

# ─── Agent Initialization ───────────────────────────────────────────────

_agent: Optional[PodcastSummaryAgent] = None


def _get_agent() -> PodcastSummaryAgent:
    """Lazy-initialize the Podcast Summary Agent."""
    global _agent
    if _agent is None:
        try:
            _agent = PodcastSummaryAgent()
            logger.info("✅ PodcastSummaryAgent initialized successfully")
        except Exception as e:
            logger.error(f"❌ Failed to initialize PodcastSummaryAgent: {e}")
            raise HTTPException(
                status_code=503,
                detail=f"Podcast Summary Agent is not available: {str(e)}"
            )
    return _agent


# ─── Request / Response Models ──────────────────────────────────────────

class PodcastSummaryRequest(BaseModel):
    """Request body for podcast summary evaluation."""
    summary_text: str = Field(..., min_length=10, description="Student's summary text")
    lesson_title: str = Field(..., description="Title of the video lesson")
    summary_prompt: str = Field(..., description="The writing prompt given to the student")
    vocabulary_words: list[str] = Field(..., description="List of vocabulary words from the lesson")
    summary_requirements: list[str] = Field(default=[], description="Key points the student should cover")
    transcript_phrases: list[str] = Field(default=[], description="Transcript phrases for copy-detection")
    full_transcript: Optional[str] = Field(default=None, description="Full transcript of the podcast")
    min_words: int = Field(default=100, description="Minimum word count")
    max_words: int = Field(default=200, description="Maximum word count")


# ─── Endpoints ──────────────────────────────────────────────────────────

@router.post("/evaluate")
async def evaluate_podcast_summary(request: PodcastSummaryRequest, auth: dict = Depends(require_auth)):
    """
    Evaluate a student's podcast summary writing using Gemini 2.0 Flash.
    
    Returns structured JSON feedback with:
    - 5 category scores (Content, Vocabulary, Own Words, Language, Structure)
    - Total score out of 100
    - 3 strengths, 3 improvements, vocabulary analysis
    - Copied phrase detection
    - Overall encouraging feedback
    """
    logger.info(f"[API] Podcast summary evaluate request for: {request.lesson_title}")

    agent = _get_agent()

    try:
        # Set a 45-second timeout for the AI evaluation
        result = await asyncio.wait_for(
            agent.evaluate(
                summary_text=request.summary_text,
                lesson_title=request.lesson_title,
                summary_prompt=request.summary_prompt,
                vocabulary_words=request.vocabulary_words,
                summary_requirements=request.summary_requirements,
                transcript_phrases=request.transcript_phrases,
                full_transcript=request.full_transcript,
                min_words=request.min_words,
                max_words=request.max_words,
            ),
            timeout=45.0,
        )

        logger.info(f"[API] ✅ Podcast summary evaluation complete: {result.get('totalScore', '?')}/100")
        return result

    except asyncio.TimeoutError:
        logger.error("[API] Podcast summary evaluation timed out (45s)")
        raise HTTPException(
            status_code=504,
            detail={
                "error": "Evaluation timed out",
                "message": "The AI evaluation took too long. Please try again.",
            }
        )
    except ValueError as e:
        logger.error(f"[API] Value error in podcast summary evaluation: {e}")
        raise HTTPException(
            status_code=422,
            detail={
                "error": str(e),
                "message": "The AI returned an unexpected response. Please try again.",
            }
        )
    except Exception as e:
        logger.error(f"[API] Error in podcast summary evaluation: {type(e).__name__}: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "message": f"Evaluation failed: {str(e)}",
            }
        )


@router.get("/health")
async def health_check():
    """Check if the Podcast Summary Agent is available."""
    try:
        agent = _get_agent()
        return {
            "status": "healthy",
            "model": agent.model,
            "service": "podcast-summary",
        }
    except Exception as e:
        return {
            "status": "unavailable",
            "error": str(e),
            "service": "podcast-summary",
        }
