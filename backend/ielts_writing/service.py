"""
DEPRECATED: Legacy IELTS Writing routes.

This module provides the old 2-agent pipeline (Examiner + Tutor).
The frontend has migrated to the new 3-agent pipeline:
  - POST /task2/evaluate  (full evaluation)
  - POST /task2/score     (quick scoring only)
  - POST /task1/evaluate  (Task 1 evaluation)

These legacy endpoints remain functional but log deprecation warnings.
They will be removed in a future release.
"""

from fastapi import APIRouter
import os
import traceback
import warnings
import logging
from datetime import datetime

from .models import (
    EvaluateRequest,
    WritingFeedbackResponse,
    WritingFeedbackWithTeacherReport,
    UserErrorProfile
)
try:
    from .agents.pipeline import get_pipeline
except ImportError:
    get_pipeline = None  # Legacy pipeline module removed

try:
    from .memory.error_patterns import ErrorPatternMemory
except ImportError:
    ErrorPatternMemory = None

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ielts_writing", tags=["IELTS Writing (DEPRECATED)"])


@router.post("/evaluate")
async def evaluate_writing(
    request: EvaluateRequest
) -> WritingFeedbackResponse:
    """
    DEPRECATED: Use POST /task2/evaluate instead.
    
    Evaluate writing with two-agent pipeline.
    
    1. Examiner scores strictly by IELTS criteria
    2. Tutor provides actionable coaching
    3. Error memory tracks recurring patterns
    """
    logger.warning(
        "⚠️ DEPRECATED: /ielts_writing/evaluate was called. "
        "This endpoint uses the old 2-agent pipeline. "
        "Please migrate to POST /task2/evaluate for the new 3-agent pipeline."
    )
    print(f"\n[BACKEND] Received evaluation request!")
    print(f"Task Type: {request.task_type}")
    print(f"Question: {request.question[:50]}...")
    print(f"Essay ({len(request.essay)} chars): {request.essay[:50]}...")
    
    if get_pipeline is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail="Legacy pipeline removed. Use POST /task2/evaluate instead.")
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
    DEPRECATED: Use POST /task2/evaluate instead.
    
    Evaluate writing with comprehensive teacher feedback report.
    """
    logger.warning(
        "⚠️ DEPRECATED: /ielts_writing/evaluate/teacher-report was called. "
        "Please migrate to POST /task2/evaluate."
    )
    if get_pipeline is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail="Legacy pipeline removed. Use POST /task2/evaluate instead.")
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

