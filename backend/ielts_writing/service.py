from fastapi import APIRouter
import os
import traceback
from datetime import datetime

from .models import (
    EvaluateRequest,
    WritingFeedbackResponse,
    WritingFeedbackWithTeacherReport,
    UserErrorProfile
)
from .agents.pipeline import get_pipeline
from .memory.error_patterns import ErrorPatternMemory


router = APIRouter(prefix="/ielts_writing", tags=["IELTS Writing"])


@router.post("/evaluate")
async def evaluate_writing(
    request: EvaluateRequest
) -> WritingFeedbackResponse:
    """
    Evaluate writing with two-agent pipeline.
    
    1. Examiner scores strictly by IELTS criteria
    2. Tutor provides actionable coaching
    3. Error memory tracks recurring patterns
    """
    print(f"\n[BACKEND] Received evaluation request!")
    print(f"Task Type: {request.task_type}")
    print(f"Question: {request.question[:50]}...")
    print(f"Essay ({len(request.essay)} chars): {request.essay[:50]}...")
    
    try:
        pipeline = get_pipeline()
        return await pipeline.evaluate(request)
    except Exception as e:
        with open("error_debug.log", "a", encoding="utf-8") as f:
            f.write(f"\n--- ERROR at {datetime.now()} ---\n")
            f.write(traceback.format_exc())
            f.write("-" * 30 + "\n")
        raise e


@router.post("/evaluate/teacher-report")
async def evaluate_with_teacher_report(
    request: EvaluateRequest
) -> WritingFeedbackWithTeacherReport:
    """
    Evaluate writing with comprehensive teacher feedback report.
    
    Requires student_name in request for personalized feedback.
    
    1. Examiner scores strictly by IELTS criteria
    2. Tutor provides actionable coaching
    3. Teacher report generates comprehensive, section-by-section feedback
    4. Error memory tracks recurring patterns
    """
    pipeline = get_pipeline()
    return await pipeline.evaluate_with_teacher_report(request)


@router.get("/profile/{user_id}")
async def get_error_profile(user_id: str) -> UserErrorProfile | None:
    """Get user's error pattern profile."""
    memory = ErrorPatternMemory()
    result = await memory.get_user_profile(user_id)
    if result:
        return UserErrorProfile(**result)
    return None
