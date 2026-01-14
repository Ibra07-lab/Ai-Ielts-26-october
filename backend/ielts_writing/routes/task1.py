"""
Task 1 API Routes - FIXED TIMEOUT VERSION

Key changes:
1. Separate endpoints for quick vs full evaluation
2. Better error messages
3. Timing info in response
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List
import asyncio
import logging

from ..pipelines.task1_pipeline import Task1Pipeline

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/task1", tags=["IELTS Writing Task 1"])

# Initialize pipeline
pipeline = Task1Pipeline()


class Task1EvaluationRequest(BaseModel):
    essay: str
    question: str
    student_name: str = "Student"
    chart_type: Optional[str] = None
    image_url: Optional[str] = None
    previous_errors: Optional[List[str]] = None
    attempt_number: int = 1
    include_teacher_feedback: bool = True
    include_markdown: bool = True


@router.post("/evaluate")
async def evaluate_task1(request: Task1EvaluationRequest):
    """
    Full Task 1 evaluation.
    
    Timeout behavior:
    - Examiner: 30s max (required)
    - Teacher: 45s max (optional, will return examiner results if timeout)
    
    Response includes:
    - scores: Always present if examiner succeeds
    - teacher_feedback: Present if teacher succeeds
    - teacher_feedback_status: "complete", "timeout", or "error"
    - timing: How long each step took
    """
    
    logger.info(f"[API] Task 1 evaluate request for {request.student_name}")
    
    try:
        result = await pipeline.evaluate_async(
            essay=request.essay,
            question=request.question,
            student_name=request.student_name,
            chart_type=request.chart_type,
            image_url=request.image_url,
            previous_errors=request.previous_errors,
            attempt_number=request.attempt_number,
            include_teacher_feedback=request.include_teacher_feedback,
            return_markdown=request.include_markdown
        )
        
        if not result.get("success"):
            raise HTTPException(
                status_code=500,
                detail={
                    "error": result.get("error"),
                    "message": "Evaluation failed. Please try again."
                }
            )
        
        return result
        
    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=504,
            detail={
                "error": "Request timed out",
                "message": "The evaluation took too long. Please try again."
            }
        )
    except Exception as e:
        logger.error(f"[API] Error evaluating: {type(e).__name__}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "message": "An error occurred. Please try again."
            }
        )


@router.get("/health")
async def health_check():
    """Service health check."""
    return {
        "status": "healthy",
        "task_type": "task1",
        "timeouts": {
            "examiner": f"{pipeline.EXAMINER_TIMEOUT}s",
            "teacher": f"{pipeline.TEACHER_TIMEOUT}s",
            "total": f"{pipeline.TOTAL_TIMEOUT}s"
        }
    }


@router.get("/health/detailed")
async def detailed_health():
    """Check if Anthropic API is responsive."""
    import time
    
    try:
        start = time.time()
        response = pipeline.teacher.client.messages.create(
            model=pipeline.teacher.model,
            max_tokens=10,
            messages=[{"role": "user", "content": "Say 'OK'"}]
        )
        latency = time.time() - start
        
        return {
            "status": "healthy",
            "anthropic_latency": f"{latency:.2f}s",
            "anthropic_status": "responsive",
            "cache_size": len(pipeline.teacher.cache),
            "cache_max": pipeline.teacher.cache.maxsize
        }
        
    except Exception as e:
        logger.error(f"[API] Health check failed: {e}")
        return {
            "status": "degraded",
            "anthropic_status": "error",
            "error": str(e)
        }