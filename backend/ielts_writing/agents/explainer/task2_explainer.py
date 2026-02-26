"""
Task 2 Explainer Agent — Actionable Feedback Generator

This agent takes the Examiner's evaluation and generates concrete,
actionable feedback with rewrites demonstrating Band 8.0 quality.

Pipeline Position:
- Agent 1 (Examiner): Scores the essay → IELTSEvaluation
- Agent 2 (Explainer): Generates feedback → ExplainerOutput ← YOU ARE HERE
"""

from __future__ import annotations

import json
import os
from typing import Optional

from ielts_writing.schemas.task2 import IELTSEvaluation
from ielts_writing.schemas.task2_explainer import ExplainerOutput
from ielts_writing.agents.prompts.task2_explainer_prompt import (
    get_task2_explainer_system_prompt,
    build_task2_explainer_user_prompt
)
from agents.direct_llm_client import DirectLLMClient


class Task2Explainer:
    """Task 2 Explainer with actionable feedback generation.
    
    Takes the Examiner's evaluation and generates:
    - Macro-level paragraph rewrites (using PEEL method)
    - Micro-level sentence corrections
    - Cohesion fixes for mechanical linkers
    - Cliché replacements with context-specific alternatives
    - Grammar lessons for systematic error patterns
    - Priority-ranked improvement summary
    """

    def __init__(self, model: str | None = None):
        """Initialize the Task 2 explainer.
        
        Args:
            model: Optional model override. Defaults to IELTS_WRITING_MODEL env var
                   or claude-sonnet-4-5-20250929.
        """
        self.model = model or os.getenv(
            "IELTS_WRITING_MODEL",
            "claude-sonnet-4-5-20250929",
        )
        self.client = DirectLLMClient()

    def explain(
        self,
        essay: str,
        question: str,
        evaluation: IELTSEvaluation | dict,
    ) -> ExplainerOutput:
        """
        Generate actionable feedback for a Task 2 essay.
        
        Args:
            essay: The student's original essay
            question: The essay question/prompt
            evaluation: The IELTSEvaluation from Agent 1 (Examiner)
        
        Returns:
            ExplainerOutput: Complete feedback with rewrites and lessons.
        """
        # Build prompts
        system_prompt = get_task2_explainer_system_prompt()
        user_prompt = build_task2_explainer_user_prompt(
            essay=essay,
            question=question,
            evaluation=evaluation
        )

        # Call LLM based on model type
        if self.model.startswith("openrouter/") or self.model.startswith("openai/") or self.model.startswith("anthropic/"):
            response_text = self.client.call_openrouter(
                model=self.model,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.3,
                max_tokens=6000
            )
        elif "claude" in self.model.lower():
            response_text = self.client.call_anthropic(
                model=self.model,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.3,  # Slightly higher for creative rewrites
                max_tokens=6000,  # Optimized for integrity (was 4500)
                image_data=None
            )
        else:
            response_text = self.client.call_openai(
                model=self.model,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.3,
                max_tokens=6000
            )

        # Parse and validate response
        output = self._parse_response(response_text)
        
        return output

    def explain_raw(
        self,
        essay: str,
        question: str,
        evaluation: IELTSEvaluation | dict,
    ) -> dict:
        """
        Generate feedback and return raw dict (for backward compatibility).
        
        Args:
            essay: The student's essay
            question: The essay question/prompt
            evaluation: The IELTSEvaluation from Agent 1
        
        Returns:
            dict: Raw feedback data
        """
        output = self.explain(
            essay=essay,
            question=question,
            evaluation=evaluation
        )
        return output.model_dump()

    def _parse_response(self, response_text: str) -> ExplainerOutput:
        """Parse and validate JSON response from LLM.
        
        Args:
            response_text: Raw text response from LLM
            
        Returns:
            ExplainerOutput: Validated Pydantic model
            
        Raises:
            ValueError: If JSON parsing or validation fails
        """
        from pydantic import ValidationError
        
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

        try:
            data = json.loads(content)
            return ExplainerOutput(**data)
        except (json.JSONDecodeError, ValidationError) as e:
            # DEBUG: Write failing content to file
            with open("explainer_debug_dump.txt", "w", encoding="utf-8") as f:
                f.write(content)
            raise ValueError(f"Invalid JSON from Explainer: {e}")

    def get_priority_actions(self, output: ExplainerOutput) -> list[dict]:
        """Extract priority actions for quick display.
        
        Args:
            output: The full ExplainerOutput
            
        Returns:
            list: Top priorities with action steps
        """
        return [
            {
                "rank": p.rank,
                "area": p.area,
                "action": p.action_step,
                "impact": p.score_impact
            }
            for p in output.priority_summary
        ]

    def get_quick_summary(self, output: ExplainerOutput) -> dict:
        """Extract quick summary for UI display.
        
        Args:
            output: The full ExplainerOutput
            
        Returns:
            dict: Summary with key metrics
        """
        return {
            "current_band": output.current_overall_band,
            "target_band": output.target_band_demonstrated,
            "macro_rewrites": len(output.macro_feedback),
            "micro_fixes": len(output.micro_feedback),
            "cohesion_fixes": len(output.cohesion_fixes),
            "cliches_replaced": len(output.vocabulary_feedback.cliche_replacements),
            "grammar_lessons": len(output.grammar_feedback.pattern_lessons),
            "top_priority": output.priority_summary[0].area if output.priority_summary else None,
            "immediate_focus": output.immediate_focus,
            "one_thing_done_well": output.one_thing_done_well,
        }


# ============================================================
# CONVENIENCE FUNCTIONS
# ============================================================

async def explain_task2_essay(
    essay: str,
    question: str,
    evaluation: IELTSEvaluation | dict,
    model: str | None = None
) -> ExplainerOutput:
    """Quick function to generate feedback for a Task 2 essay.
    
    Args:
        essay: The student's essay
        question: The essay question/prompt
        evaluation: The IELTSEvaluation from Agent 1
        model: Optional model override
        
    Returns:
        ExplainerOutput: Complete feedback
    """
    explainer = Task2Explainer(model=model)
    return await explainer.explain(
        essay=essay,
        question=question,
        evaluation=evaluation
    )


async def run_full_task2_pipeline(
    essay: str,
    question: str,
    model: str | None = None
) -> tuple[IELTSEvaluation, ExplainerOutput]:
    """Run the complete Task 2 pipeline: Examine → Explain.
    
    Args:
        essay: The student's essay
        question: The essay question/prompt
        model: Optional model override
        
    Returns:
        tuple: (IELTSEvaluation, ExplainerOutput)
    """
    from ielts_writing.agents.examiner import Task2Examiner
    
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
    
    return evaluation, feedback
