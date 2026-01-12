"""Factory utilities for returning the correct examiner implementation."""

from __future__ import annotations

from typing import Union

from ...models import TaskType
from .task1_examiner import Task1Examiner
from .task2_examiner import Task2Examiner
from .base import ExaminerAgent


def get_examiner_for_task(
    task_type: Union[TaskType, str],
    model: str | None = None,
) -> ExaminerAgent:
    """Return a task-specific examiner where available.

    Falls back to the generic :class:`ExaminerAgent` so existing code paths
    remain valid even if new task-specific logic is not used.
    """

    if isinstance(task_type, str):
        task_type = TaskType(task_type)

    if task_type == TaskType.TASK1:
        return Task1Examiner(model=model)
    if task_type == TaskType.TASK2:
        return Task2Examiner(model=model)

    # Fallback – should not normally happen
    return ExaminerAgent(model=model)


