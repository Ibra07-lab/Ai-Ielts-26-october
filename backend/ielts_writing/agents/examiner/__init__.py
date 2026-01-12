"""Examiner package: shared base + task-specific examiners.

This package replaces the legacy ``backend.ielts_writing.agents.examiner`` module.

Backwards-compatible:
- ``ExaminerAgent`` is still importable from ``backend.ielts_writing.agents.examiner``
- Existing pipeline code continues to work unchanged
"""

from .base import ExaminerAgent

try:
    # Task-specific wrappers and factory (may be extended over time)
    from .task1_examiner import Task1Examiner  # type: ignore[F401]
    from .task2_examiner import Task2Examiner  # type: ignore[F401]
    from .factory import get_examiner_for_task  # type: ignore[F401]
except Exception:  # pragma: no cover - defensive import for partial deployments
    Task1Examiner = None  # type: ignore[assignment]
    Task2Examiner = None  # type: ignore[assignment]
    get_examiner_for_task = None  # type: ignore[assignment]

__all__ = [
    "ExaminerAgent",
    "Task1Examiner",
    "Task2Examiner",
    "get_examiner_for_task",
]


