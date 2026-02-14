"""
Task 2 Coach Agent — Focused Coaching Plan Generator

This agent synthesizes the Examiner's evaluation and Explainer's feedback
into a focused "One Big Change" coaching plan.

Pipeline Position:
- Agent 1 (Examiner): Scores → IELTSEvaluation
- Agent 2 (Explainer): Feedback → ExplainerOutput
- Agent 3 (Coach): Focused Plan → CoachOutput ← YOU ARE HERE
"""

from __future__ import annotations

import os
import json

from ielts_writing.schemas.task2 import IELTSEvaluation
from ielts_writing.schemas.task2_explainer import ExplainerOutput
from ielts_writing.schemas.task2_coach import CoachOutput
from ielts_writing.agents.prompts.task2_coach_prompt import (
    COACH_SYSTEM_PROMPT,
    build_coach_user_prompt,
    build_task2_coach_user_prompt,
)
from agents.direct_llm_client import DirectLLMClient


class Task2Coach:
    """Task 2 Coach with 'One Big Change' philosophy.
    
    Synthesizes evaluation and feedback into focused coaching:
    - Root cause diagnosis
    - The One Big Change (single most important behavior change)
    - Pattern breaker (banned items, required techniques)
    - Micro-drill (5-15 min focused exercise)
    - Next essay constraints
    - Motivation and score projections
    """

    def __init__(self, model: str | None = None):
        """Initialize the Task 2 coach.
        
        Args:
            model: Optional model override. Defaults to IELTS_WRITING_MODEL env var
                   or claude-sonnet-4-5-20250929.
        """
        self.model = model or os.getenv(
            "COACH_MODEL",
            os.getenv("IELTS_WRITING_MODEL", "claude-sonnet-4-5-20250929")
        )
        self.client = DirectLLMClient()

    def generate_plan(
        self,
        examiner_data: IELTSEvaluation | dict,
        explainer_data: ExplainerOutput | dict,
        essay: str = "",
        question: str = "",
    ) -> CoachOutput:
        """
        Generate focused coaching plan from upstream agent outputs.
        
        Args:
            examiner_data: The IELTSEvaluation from Agent 1
            explainer_data: The ExplainerOutput from Agent 2
            essay: Optional - the student's original essay
            question: Optional - the essay question/prompt
        
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
        if essay and question:
            user_content = build_task2_coach_user_prompt(
                essay=essay,
                question=question,
                evaluation=examiner_dict,
                explainer_output=explainer_dict
            )
        else:
            user_content = build_coach_user_prompt(examiner_dict, explainer_dict)

        # Call LLM based on model type
        if self.model.startswith("openai/") or self.model.startswith("anthropic/"):
             response_text = self.client.call_openrouter(
                model=self.model,
                system_prompt=COACH_SYSTEM_PROMPT,
                user_prompt=user_content,
                temperature=0.3,
                max_tokens=8000
            )
        elif "gpt" in self.model.lower():
            response_text = self.client.call_openai(
                model=self.model,
                system_prompt=COACH_SYSTEM_PROMPT,
                user_prompt=user_content,
                temperature=0.3,
                max_tokens=8000
            )
        else:
            response_text = self.client.call_anthropic(
                model=self.model,
                system_prompt=COACH_SYSTEM_PROMPT,
                user_prompt=user_content,
                temperature=0.3,
                max_tokens=8000,
                image_data=None
            )

        # Parse JSON response
        return self._parse_response(response_text)

    async def coach(
        self,
        essay: str,
        question: str,
        evaluation: IELTSEvaluation | dict,
        explainer_output: ExplainerOutput | dict,
    ) -> CoachOutput:
        """
        Async version - Generate coaching plan.
        
        Args:
            essay: The student's original essay
            question: The essay question/prompt
            evaluation: The IELTSEvaluation from Agent 1
            explainer_output: The ExplainerOutput from Agent 2
        
        Returns:
            CoachOutput: Focused coaching plan
        """
        return self.generate_plan(
            examiner_data=evaluation,
            explainer_data=explainer_output,
            essay=essay,
            question=question
        )

    async def coach_raw(
        self,
        essay: str,
        question: str,
        evaluation: IELTSEvaluation | dict,
        explainer_output: ExplainerOutput | dict,
    ) -> dict:
        """
        Generate coaching plan and return raw dict.
        """
        output = await self.coach(
            essay=essay,
            question=question,
            evaluation=evaluation,
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
        return CoachOutput.model_validate_json(content)

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

    def get_micro_drill(self, output: CoachOutput) -> dict:
        """Extract the micro drill for practice display."""
        return {
            "name": output.micro_drill.drill_name,
            "type": output.micro_drill.drill_type.value,
            "time": output.micro_drill.time_limit_minutes,
            "purpose": output.micro_drill.purpose,
            "instructions": output.micro_drill.instructions,
            "content": output.micro_drill.practice_content,
            "success_criteria": [
                {"criterion": s.criterion, "check": s.how_to_check}
                for s in output.micro_drill.success_criteria
            ],
            "tomorrow_variation": output.micro_drill.variation_for_tomorrow,
        }


# ============================================================
# CONVENIENCE FUNCTIONS
# ============================================================

async def coach_task2_essay(
    essay: str,
    question: str,
    evaluation: IELTSEvaluation | dict,
    explainer_output: ExplainerOutput | dict,
    model: str | None = None
) -> CoachOutput:
    """Quick function to generate coaching plan for a Task 2 essay."""
    coach = Task2Coach(model=model)
    return await coach.coach(
        essay=essay,
        question=question,
        evaluation=evaluation,
        explainer_output=explainer_output
    )


async def run_complete_task2_pipeline(
    essay: str,
    question: str,
    model: str | None = None
) -> tuple[IELTSEvaluation, ExplainerOutput, CoachOutput]:
    """Run the complete Task 2 pipeline: Examine → Explain → Coach."""
    from ielts_writing.agents.examiner import Task2Examiner
    from ielts_writing.agents.explainer import Task2Explainer
    
    # Step 1: Examine
    examiner = Task2Examiner(model=model)
    evaluation = await examiner.evaluate(essay=essay, question=question)
    
    # Step 2: Explain
    explainer = Task2Explainer(model=model)
    feedback = await explainer.explain(
        essay=essay,
        question=question,
        evaluation=evaluation
    )
    
    # Step 3: Coach
    coach = Task2Coach(model=model)
    learning_plan = await coach.coach(
        essay=essay,
        question=question,
        evaluation=evaluation,
        explainer_output=feedback
    )
    
    return evaluation, feedback, learning_plan
