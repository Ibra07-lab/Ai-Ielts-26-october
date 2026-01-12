"""Task 2 specific prompt builder for the examiner agent."""

from __future__ import annotations

from ...models import TaskType
from ...prompts.examiner import build_examiner_prompt


def build_task2_examiner_prompt(
    question: str,
    essay: str,
) -> str:
    """Build a Task 2 examiner prompt using the shared core builder."""

    return build_examiner_prompt(
        task_type=TaskType.TASK2.value,
        question=question,
        essay=essay,
        image_url=None,
        chart_type=None,
    )


