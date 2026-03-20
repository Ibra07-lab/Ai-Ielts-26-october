"""
Task 1 API Routes - FIXED TIMEOUT VERSION

Key changes:
1. Separate endpoints for quick vs full evaluation
2. Better error messages
3. Timing info in response
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel
from typing import Optional, List
import asyncio
import logging

from ..pipelines.task1_pipeline import Task1Pipeline
from ..auth import require_auth

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
    image_description: Optional[str] = None
    previous_errors: Optional[List[str]] = None
    attempt_number: int = 1
    include_teacher_feedback: bool = True
    include_markdown: bool = True


@router.post("/evaluate")
async def evaluate_task1(request: Task1EvaluationRequest, auth: dict = Depends(require_auth)):
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
            image_description=request.image_description,
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
        
        # ── Save to Supabase ──
        try:
            from ..supabase_client import get_supabase
            import time as _time
            supabase = get_supabase()
            
            # Extract band scores from result
            scores = result.get("scores", {})
            save_data = {
                "user_id": user_id,
                "task_type": "task1",
                "question": request.question,
                "essay": request.essay,
                "overall_band": scores.get("overall"),
                "task_response_band": scores.get("task_achievement") or scores.get("task_response"),
                "coherence_cohesion_band": scores.get("coherence_cohesion"),
                "lexical_resource_band": scores.get("lexical_resource"),
                "grammar_band": scores.get("grammatical_range_accuracy"),
                "evaluation_json": result.get("scores"),
                "explanation_json": result.get("teacher_feedback"),
                "coaching_json": None,
                "total_seconds": result.get("timing", {}).get("total_seconds"),
                "student_name": request.student_name,
            }
            save_result = supabase.table("writing_evaluations").insert(save_data).execute()
            saved_id = save_result.data[0]["id"] if save_result.data else None
            result["saved_id"] = saved_id
            logger.info(f"[API] ✅ Task 1 evaluation saved to Supabase (id={saved_id})")
        except Exception as db_err:
            logger.warning(f"[API] ⚠️ Failed to save Task 1 to Supabase: {db_err}")
            result["saved_id"] = None
        
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
                "message": f"An error occurred: {str(e)}"
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