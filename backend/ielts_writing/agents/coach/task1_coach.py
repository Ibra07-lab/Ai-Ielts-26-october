"""
Task 1 Coach Agent — Focused Coaching Plan Generator

This agent synthesizes the Examiner's evaluation and Explainer's feedback
into a focused coaching plan for Task 1 (chart/graph/process description).

Pipeline Position:
- Agent 1 (Examiner): Scores → dict
- Agent 2 (Explainer): Feedback → Task1ExplainerOutput
- Agent 3 (Coach): Focused Plan → CoachOutput ← YOU ARE HERE

Uses the shared CoachOutput schema (it's genuinely generic), but with
Task 1-specific prompts and root cause types.
"""

from __future__ import annotations

import os
import json
import logging

from ielts_writing.schemas.task1_explainer import Task1ExplainerOutput
from ielts_writing.schemas.task2_coach import CoachOutput
from ielts_writing.agents.prompts.task1_coach_prompt import (
    TASK1_COACH_SYSTEM_PROMPT,
    build_task1_coach_user_prompt,
)
from agents.direct_llm_client import DirectLLMClient

logger = logging.getLogger(__name__)


class Task1Coach:
    """Task 1 Coach with 'One Big Change' philosophy.
    
    Synthesizes examiner evaluation and explainer feedback into focused
    Task 1 coaching:
    - Root cause diagnosis (missing overview, poor data selection, etc.)
    - The One Big Change (single most important behavior change)
    - Pattern breaker (banned items, required techniques)
    - Micro-drill (5 min focused exercise for Task 1 skills)
    - Next essay constraints
    - Motivation and score projections
    """

    def __init__(self, model: str | None = None):
        """Initialize the Task 1 coach.
        
        Args:
            model: Optional model override. Defaults to COACH_MODEL env var,
                   or IELTS_WRITING_MODEL, or default.
        """
        self.model = model or os.getenv(
            "COACH_MODEL",
            os.getenv("IELTS_WRITING_MODEL", "claude-sonnet-4-5-20250929")
        )
        self.client = DirectLLMClient()

    def generate_plan(
        self,
        examiner_data: dict,
        explainer_data: Task1ExplainerOutput | dict,
        essay: str = "",
        question: str = "",
    ) -> CoachOutput:
        """
        Generate focused coaching plan from upstream agent outputs.
        
        Args:
            examiner_data: The examiner evaluation dict from Agent 1
            explainer_data: The Task1ExplainerOutput from Agent 2
            essay: The student's original essay
            question: The Task 1 question/prompt
        
        Returns:
            CoachOutput: Focused coaching plan
        """
        # Convert to dict if Pydantic model
        if hasattr(examiner_data, 'model_dump'):
            examiner_dict = examiner_data.model_dump()
        else:
            examiner_dict = examiner_data
            
        if hasattr(explainer_data, 'model_dump'):
            explainer_dict = explainer_data.model_dump()
        else:
            explainer_dict = explainer_data

        # Build user prompt
        user_content = build_task1_coach_user_prompt(
            essay=essay,
            question=question,
            examiner_scores=examiner_dict,
            explainer_output=explainer_dict
        )

        # Use GPT-4.1 via OpenRouter for speed and reliability
        coach_model = os.getenv("COACH_MODEL", "openai/gpt-4.1")
        
        response_text = self.client.call_openrouter(
            model=coach_model,
            system_prompt=TASK1_COACH_SYSTEM_PROMPT,
            user_prompt=user_content,
            temperature=0.3,
            max_tokens=4000
        )

        # Parse JSON response
        return self._parse_response(response_text)

    async def coach(
        self,
        essay: str,
        question: str,
        examiner_scores: dict,
        explainer_output: Task1ExplainerOutput | dict,
    ) -> CoachOutput:
        """
        Async version — Generate coaching plan.
        
        Args:
            essay: The student's original essay
            question: The Task 1 question/prompt
            examiner_scores: The examiner evaluation dict
            explainer_output: The Task1ExplainerOutput from Agent 2
        
        Returns:
            CoachOutput: Focused coaching plan
        """
        return self.generate_plan(
            examiner_data=examiner_scores,
            explainer_data=explainer_output,
            essay=essay,
            question=question
        )

    async def coach_raw(
        self,
        essay: str,
        question: str,
        examiner_scores: dict,
        explainer_output: Task1ExplainerOutput | dict,
    ) -> dict:
        """Generate coaching plan and return raw dict."""
        output = await self.coach(
            essay=essay,
            question=question,
            examiner_scores=examiner_scores,
            explainer_output=explainer_output
        )
        return output.model_dump()

    def _parse_response(self, response_text: str) -> CoachOutput:
        """Parse and validate JSON response from LLM."""
        content = response_text.strip()
        
        # Handle markdown fencing
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            parts = content.split("```")
            if len(parts) >= 2:
                content = parts[1].strip()

        # Find JSON object boundaries
        if "{" in content and "}" in content:
            start = content.find("{")
            end = content.rfind("}") + 1
            content = content[start:end]

        # Validate with Pydantic
        try:
            return CoachOutput.model_validate_json(content)
        except Exception as e:
            logger.error(f"Coach JSON parse failed: {e}")
            # Debug dump
            try:
                with open("task1_coach_debug_dump.txt", "w", encoding="utf-8") as f:
                    f.write(content)
            except Exception:
                pass
            raise ValueError(f"Failed to parse Coach output: {e}")

    # ===== HELPER METHODS =====

    def get_quick_summary(self, output: CoachOutput) -> dict:
        """Extract quick summary for UI display."""
        return {
            "current_band": output.score_context.current_overall,
            "target_band": output.score_context.realistic_next_target,
            "projected_if_changed": output.score_context.if_change_implemented,
            "the_one_big_change": output.the_one_big_change.change_statement,
            "visual_reminder": output.the_one_big_change.visual_reminder,
            "root_cause": output.root_cause_analysis.root_cause_type.value,
            "blocking_criterion": output.root_cause_analysis.blocking_criterion,
            "drill_name": output.micro_drill.drill_name,
            "drill_time": output.micro_drill.time_limit_minutes,
            "banned_items": [b.banned_element for b in output.pattern_breaker.banned_list],
            "coaching_level": output.coaching_focus_level.value,
        }

    def get_one_big_change(self, output: CoachOutput) -> dict:
        """Extract The One Big Change for prominent display."""
        return {
            "change": output.the_one_big_change.change_statement,
            "why": output.the_one_big_change.why_this_matters_most,
            "stop": output.the_one_big_change.what_to_stop_doing,
            "start": output.the_one_big_change.what_to_start_doing,
            "reminder": output.the_one_big_change.visual_reminder,
        }
