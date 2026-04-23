"""
Task 1 API Routes — 3-Agent Pipeline

Runs the complete Task 1 evaluation pipeline:
1. Examiner (Agent 1): Scores the essay
2. Explainer (Agent 2): Generates detailed feedback  
3. Coach (Agent 3): Creates focused action plan

Response structure aligned with Task 2 route:
- evaluation: Band scores, analysis
- explanation: Detailed feedback with rewrites
- coaching: One big change, drills, plan
- Each with independent _status fields
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import asyncio
import logging
import time
import json
from datetime import datetime, date

def json_serializable(obj):
    """Convert objects that are not JSON serializable."""
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")

def make_serializable(data):
    """Recursively convert a dict to be JSON serializable."""
    if data is None:
        return None
    return json.loads(json.dumps(data, default=json_serializable))

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
    Full Task 1 evaluation pipeline (3 agents).
    
    Runs three agents in sequence:
    1. Examiner: Scores the essay (TA, CC, LR, GRA)
    2. Explainer: Generates actionable feedback with rewrites
    3. Coach: Creates "One Big Change" action plan
    
    Response includes:
    - evaluation: Always present if examiner succeeds
    - explanation: Present or None with status
    - coaching: Present or None with status
    - timing: How long each step took
    """
    
    logger.info(f"[API] Task 1 evaluate request for {request.student_name}")
    start_time = time.time()
    
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
            logger.error(f"[API] Pipeline returned failure: {result.get('error')}")
            raise HTTPException(
                status_code=500,
                detail={
                    "error": result.get("error"),
                    "traceback": result.get("traceback", "No traceback available"),
                    "message": "Evaluation failed. Please try again."
                }
            )
        
        # ── Save to Supabase ──
        try:
            from ..supabase_client import get_supabase
            supabase = get_supabase()
            
            user_id = auth.get("uid")
            scores = result.get("scores", {})
            
            # Extract queryable fields from coaching data
            coaching_data = result.get("coaching")
            root_cause = None
            weakest_criterion = None
            if coaching_data and isinstance(coaching_data, dict):
                root_cause = coaching_data.get("root_cause_analysis", {}).get("root_cause_type")
                weakest_criterion = coaching_data.get("score_context", {}).get("lowest_criterion")
            
            save_data = {
                "user_id": user_id,
                "task_type": "task1",
                "question": request.question,
                "essay": request.essay,
                "overall_band": scores.get("overall_band") or scores.get("overall"),
                "task_response_band": scores.get("task_achievement"),
                "coherence_cohesion_band": scores.get("coherence_cohesion"),
                "lexical_resource_band": scores.get("lexical_resource"),
                "grammar_band": scores.get("grammatical_range_accuracy"),
                # Full JSON blobs for rendering
                "evaluation_json": make_serializable(result.get("evaluation")),
                "explanation_json": make_serializable(result.get("explanation")),
                "coaching_json": make_serializable(coaching_data),
                # Queryable columns for analytics
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
        
        total_time = time.time() - start_time
        logger.info(
            f"[API] Task 1 evaluation complete in {total_time:.2f}s - "
            f"Band: {result.get('scores', {}).get('overall_band')} | "
            f"Explainer: {result.get('explanation_status', 'unknown')} | "
            f"Coach: {result.get('coaching_status', 'unknown')}"
        )
        
        return result
        
    except HTTPException:
        raise
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
        tb_text = traceback.format_exc()
        logger.error(f"FULL ERROR TRACEBACK:\n{tb_text}")
        try:
            with open("task1_crash.txt", "w", encoding="utf-8") as f:
                f.write(tb_text)
        except Exception:
            pass

        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "traceback": tb_text,
                "message": "Evaluation failed. Please try again."
            }
        )


@router.get("/health")
async def health_check():
    """Service health check."""
    return {
        "status": "healthy",
        "task_type": "task1",
        "agents": ["examiner", "explainer", "coach"],
        "pipeline": "ready",
        "timeouts": {
            "examiner": f"{pipeline.EXAMINER_TIMEOUT}s",
            "explainer": f"{pipeline.EXPLAINER_TIMEOUT}s",
            "coach": f"{pipeline.COACH_TIMEOUT}s",
            "total": f"{pipeline.TOTAL_TIMEOUT}s"
        }
    }


@router.get("/health/detailed")
async def detailed_health():
    """Check if LLM API is responsive."""
    import time as _time
    
    try:
        start = _time.time()
        # Quick ping through the client
        response = pipeline.explainer.client.call_openrouter(
            model="openai/gpt-4.1",
            system_prompt="Say OK",
            user_prompt="Reply with just 'OK'",
            temperature=0,
            max_tokens=5,
            timeout=10.0
        )
        latency = _time.time() - start
        
        return {
            "status": "healthy",
            "llm_latency": f"{latency:.2f}s",
            "llm_status": "responsive",
            "pipeline_agents": ["examiner", "explainer", "coach"]
        }
        
    except Exception as e:
        logger.error(f"[API] Health check failed: {e}")
        return {
            "status": "degraded",
            "llm_status": "error",
            "error": str(e)
        }