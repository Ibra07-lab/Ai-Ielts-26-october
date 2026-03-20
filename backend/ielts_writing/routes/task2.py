"""
Task 2 API Routes — Full Pipeline Endpoint

Runs the complete Task 2 evaluation pipeline:
1. Examiner (Agent 1): Scores the essay
2. Explainer (Agent 2): Generates detailed feedback
3. Coach (Agent 3): Creates focused action plan

Usage:
    POST /task2/evaluate
    {
        "essay": "Your essay text...",
        "question": "The essay prompt..."
    }
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, ValidationError
from typing import Optional, List
import asyncio
import logging
import time

from ..task2_pipeline import Task2Pipeline
from ..auth import require_auth

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/task2", tags=["IELTS Writing Task 2"])


class Task2EvaluationRequest(BaseModel):
    """Request body for Task 2 evaluation."""
    essay: str
    question: str
    student_name: str = "Student"
    include_coaching: bool = True


class Task2QuickRequest(BaseModel):
    """Request body for quick scoring only (no coaching)."""
    essay: str
    question: str


@router.post("/evaluate")
async def evaluate_task2(request: Task2EvaluationRequest, auth: dict = Depends(require_auth)):
    """
    Full Task 2 evaluation pipeline.
    
    Runs three agents in sequence:
    1. Examiner: Scores the essay (TR, CC, LR, GRA)
    2. Explainer: Generates actionable feedback with rewrites
    3. Coach: Creates "One Big Change" action plan
    
    Response includes:
    - evaluation: Band scores, fatal flaws, analysis
    - explanation: Micro/macro feedback, vocabulary upgrades
    - coaching: One big change, micro drill, next essay constraints
    - timing: How long each step took
    """
    
    logger.info(f"[API] Task 2 evaluate request for {request.student_name}")
    start_time = time.time()
    
    try:
        # Initialize pipeline
        pipeline = Task2Pipeline()
        
        # Time each step
        examiner_start = time.time()
        
        # Run the full pipeline (async — does not block the event loop)
        result = await pipeline.evaluate_essay(
            essay=request.essay,
            question=request.question
        )
        
        total_time = time.time() - start_time
        
        # Build response
        response = {
            "success": True,
            "student_name": request.student_name,
            
            # Core results
            "evaluation": result["evaluation"].model_dump(),
            "explanation": result["explanation"].model_dump(),
            "coaching": result["coaching"].model_dump() if request.include_coaching else None,
            
            # Quick access
            "summary": {
                "overall_band": result["evaluation"].band_scores.overall,
                "task_response": result["evaluation"].band_scores.task_response,
                "coherence_cohesion": result["evaluation"].band_scores.coherence_cohesion,
                "lexical_resource": result["evaluation"].band_scores.lexical_resource,
                "grammatical_range": result["evaluation"].band_scores.grammatical_range_accuracy,
                "fatal_flaws": result["evaluation"].fatal_flaws,
                "one_big_change": result["coaching"].the_one_big_change.change_statement if request.include_coaching else None,
                "visual_reminder": result["coaching"].the_one_big_change.visual_reminder if request.include_coaching else None,
            },
            
            # Timing info
            "timing": {
                "total_seconds": round(total_time, 2),
            }
        }
        
        # ── Save to Supabase ──
        try:
            from ..supabase_client import get_supabase
            supabase = get_supabase()
            
            band_scores = result["evaluation"].band_scores
            save_result = supabase.table("writing_evaluations").insert({
                "user_id": user_id,
                "task_type": "task2",
                "question": request.question,
                "essay": request.essay,
                "overall_band": band_scores.overall,
                "task_response_band": band_scores.task_response,
                "coherence_cohesion_band": band_scores.coherence_cohesion,
                "lexical_resource_band": band_scores.lexical_resource,
                "grammar_band": band_scores.grammatical_range_accuracy,
                "evaluation_json": result["evaluation"].model_dump(),
                "explanation_json": result["explanation"].model_dump(),
                "coaching_json": result["coaching"].model_dump() if request.include_coaching else None,
                "total_seconds": round(total_time, 2),
                "student_name": request.student_name,
            }).execute()
            
            saved_id = save_result.data[0]["id"] if save_result.data else None
            response["saved_id"] = saved_id
            logger.info(f"[API] ✅ Evaluation saved to Supabase (id={saved_id})")
        except Exception as db_err:
            logger.warning(f"[API] ⚠️ Failed to save to Supabase: {db_err}")
            response["saved_id"] = None
        
        logger.info(f"[API] Task 2 evaluation complete in {total_time:.2f}s - Band: {result['evaluation'].band_scores.overall}")
        
        return response
        
    except ValidationError as e:
        logger.error(f"[API] Validation Error in Task 2: {str(e)}")
        raise HTTPException(
            status_code=422,
            detail={
                "error": str(e),
                "message": f"Validation Error: {str(e)}"
            }
        )
    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=504,
            detail={
                "error": "Request timed out",
                "message": "The evaluation took too long. Please try again."
            }
        )
    except Exception as e:
        import traceback
        error_msg = f"{type(e).__name__}: {str(e)}\n{traceback.format_exc()}"
        logger.error(f"[API] Error evaluating Task 2: {error_msg}")
        
        # Write to file for debugging
        with open("last_error.txt", "w", encoding="utf-8") as f:
            f.write(error_msg)
            
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "message": "An error occurred during evaluation. Please try again."
            }
        )


@router.post("/score")
async def score_task2_quick(request: Task2QuickRequest, auth: dict = Depends(require_auth)):
    """
    Quick Task 2 scoring only (Examiner only).
    
    Faster endpoint that only runs Agent 1 for quick band scores.
    Use /evaluate for full pipeline with coaching.
    """
    
    logger.info("[API] Task 2 quick score request")
    start_time = time.time()
    
    try:
        from ..agents.examiner import Task2Examiner
        
        examiner = Task2Examiner()
        loop = asyncio.get_event_loop()
        evaluation = await loop.run_in_executor(
            None, examiner.evaluate, request.essay, request.question
        )
        
        return {
            "success": True,
            "evaluation": evaluation.model_dump(),
            "summary": {
                "overall_band": evaluation.band_scores.overall,
                "task_response": evaluation.band_scores.task_response,
                "coherence_cohesion": evaluation.band_scores.coherence_cohesion,
                "lexical_resource": evaluation.band_scores.lexical_resource,
                "grammatical_range": evaluation.band_scores.grammatical_range_accuracy,
                "fatal_flaws": evaluation.fatal_flaws,
            },
            "timing": {
                "total_seconds": round(time.time() - start_time, 2)
            }
        }
        
    except Exception as e:
        logger.error(f"[API] Error in quick score: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={"error": str(e)}
        )


@router.get("/health")
async def health_check():
    """Service health check."""
    return {
        "status": "healthy",
        "task_type": "task2",
        "agents": ["examiner", "explainer", "coach"],
        "pipeline": "ready"
    }
