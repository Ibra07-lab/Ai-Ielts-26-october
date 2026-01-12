"""Task 2 specific examiner wrapper.

This provides a clearer entrypoint for Task 2 marking while delegating
all core logic to ``ExaminerAgent`` in ``base.py``.
"""

from __future__ import annotations

from ...models import TaskType, ExaminerEvaluation
from .base import ExaminerAgent


class Task2Examiner(ExaminerAgent):
    """Task 2 examiner – opinion/discussion/argument essays."""

    async def evaluate_task(
        self,
        question: str,
        essay: str,
    ) -> ExaminerEvaluation:
        """Convenience wrapper that fixes the task type to Task 2."""

        return await super().evaluate(
            task_type=TaskType.TASK2,
            question=question,
            essay=essay,
            image_url=None,
            chart_type=None,
        )


