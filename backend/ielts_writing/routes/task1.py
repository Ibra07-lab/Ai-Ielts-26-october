"""
API routes for Task 1 evaluation.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List

from ..pipelines.task1_pipeline import Task1Pipeline

router = APIRouter(prefix="/task1", tags=["IELTS Writing Task 1"])

# Initialize pipeline lazily
_pipeline = None

def get_pipeline():
    global _pipeline
    if _pipeline is None:
        _pipeline = Task1Pipeline()
    return _pipeline


class Task1EvaluationRequest(BaseModel):
    """Request model for Task 1 evaluation."""
    essay: str
    question: str
    student_name: str = "Student"
    chart_type: Optional[str] = None  # line, bar, pie, table, map, process
    image_url: Optional[str] = None
    previous_errors: Optional[List[str]] = None
    attempt_number: int = 1
    include_teacher_feedback: bool = True
    include_markdown: bool = True


class QuickScoreRequest(BaseModel):
    """Request for quick scoring (no teacher feedback)."""
    essay: str
    question: str
    chart_type: Optional[str] = None
    image_url: Optional[str] = None


class VocabularyHelpRequest(BaseModel):
    """Request for vocabulary suggestions."""
    chart_type: str
    weak_areas: Optional[List[str]] = None


@router.post("/evaluate")
async def evaluate_task1(request: Task1EvaluationRequest):
    """
    Full Task 1 evaluation with examiner scoring and teacher feedback.
    
    Returns:
    - Examiner scores (4 criteria + overall)
    - Task 1 specific analysis (overview, data accuracy)
    - Personalized teacher feedback
    - Markdown-formatted report
    """
    try:
        pipeline = get_pipeline()
        result = await pipeline.evaluate(
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
            raise HTTPException(status_code=500, detail=result.get("error"))
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/quick-score")
async def quick_score_task1(request: QuickScoreRequest):
    """
    Quick Task 1 scoring - examiner scores only, no teacher feedback.
    Use for fast checks or batch processing.
    """
    try:
        pipeline = get_pipeline()
        return await pipeline.quick_score(
            essay=request.essay,
            question=request.question,
            chart_type=request.chart_type,
            image_url=request.image_url
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/vocabulary-help")
async def get_vocabulary_help(request: VocabularyHelpRequest):
    """
    Get vocabulary suggestions for a specific chart type.
    Useful for students who need vocabulary building.
    """
    try:
        pipeline = get_pipeline()
        return pipeline.get_vocabulary_help(
            chart_type=request.chart_type,
            weak_areas=request.weak_areas
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Check if Task 1 service is running."""
    try:
        pipeline = get_pipeline()
        return {
            "status": "healthy",
            "task_type": "task1",
            "examiner_model": pipeline.examiner.model,
            "teacher_model": pipeline.teacher.model
        }
    except Exception as e:
        return {
            "status": "error",
            "task_type": "task1",
            "error": str(e)
        }