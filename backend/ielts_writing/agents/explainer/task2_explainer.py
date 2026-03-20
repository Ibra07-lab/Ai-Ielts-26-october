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
import re
import logging
from typing import Optional

logger = logging.getLogger(__name__)

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

        # Use GPT-4.1 via OpenRouter for speed and reliability
        explainer_model = os.getenv("EXPLAINER_MODEL", "openai/gpt-4.1")
        
        response_text = self.client.call_openrouter(
            model=explainer_model,
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.3,
            max_tokens=8000,
            timeout=300.0
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

    def _repair_truncated_json(self, content: str) -> str:
        """Attempt to repair truncated JSON by closing unclosed braces/brackets.
        
        When the LLM output is truncated due to max_tokens, the JSON may be
        cut off mid-string, mid-key, or mid-value. This method:
        1. Tracks the nesting stack of { and [ in order
        2. Handles truncated strings
        3. Strips trailing incomplete key-value pairs
        4. Closes all open delimiters in correct LIFO order
        """
        # Track nesting stack in order (needed for correct close order)
        stack = []  # list of '{' or '['
        in_string = False
        escape_next = False
        last_complete_pos = 0  # Position after last complete value
        
        i = 0
        while i < len(content):
            char = content[i]
            if escape_next:
                escape_next = False
                i += 1
                continue
            if char == '\\' and in_string:
                escape_next = True
                i += 1
                continue
            if char == '"':
                in_string = not in_string
                i += 1
                continue
            if in_string:
                i += 1
                continue
            # Outside string
            if char == '{':
                stack.append('{')
            elif char == '[':
                stack.append('[')
            elif char == '}':
                if stack and stack[-1] == '{':
                    stack.pop()
                    last_complete_pos = i + 1
            elif char == ']':
                if stack and stack[-1] == '[':
                    stack.pop()
                    last_complete_pos = i + 1
            elif char == ',' or char == ':':
                pass  # normal delimiters
            i += 1
        
        if not stack and not in_string:
            return content  # JSON is already balanced
        
        logger.warning(f"Repairing truncated JSON: stack={stack}, in_string={in_string}")
        
        repaired = content
        
        # If we were mid-string, close the string
        if in_string:
            # Find the last complete string boundary and truncate there if possible
            # or just close the string
            repaired = repaired.rstrip()
            repaired += '"'
        
        # Clean up trailing partial content
        repaired = repaired.rstrip()
        
        # Strip trailing comma (common after truncation)
        while repaired.endswith(','):
            repaired = repaired[:-1].rstrip()
        
        # Close all open delimiters in reverse order (LIFO)
        for opener in reversed(stack):
            if opener == '{':
                repaired += '}'
            elif opener == '[':
                repaired += ']'
        
        return repaired

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
        logger.info(f"Raw Explainer response length: {len(content)} chars")
        
        # Handle markdown fencing
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            parts = content.split("```")
            if len(parts) >= 2:
                content = parts[1].strip()

        # Find the start of JSON (first {)
        if "{" in content:
            start = content.find("{")
            content = content[start:]

        # First attempt: try parsing as-is (handles complete JSON)
        try:
            data = json.loads(content)
            logger.info("JSON parsed successfully on first attempt")
            return ExplainerOutput(**data)
        except json.JSONDecodeError as e:
            logger.warning(f"JSON parse failed ({e}), attempting repair...")
            
            # Try repairing truncated JSON
            repaired = self._repair_truncated_json(content)
            try:
                data = json.loads(repaired)
                logger.info("JSON repair successful!")
                return ExplainerOutput(**data)
            except json.JSONDecodeError as e2:
                # Last resort: try to salvage by finding the deepest valid JSON
                logger.warning(f"Repair still failed ({e2}), trying aggressive repair...")
                try:
                    # Try removing the last incomplete array element
                    # Find last complete }, then close everything
                    last_brace = repaired.rfind('}')
                    if last_brace > 0:
                        # Walk backwards to find a clean cut point
                        aggressive = repaired[:last_brace + 1]
                        aggressive = self._repair_truncated_json(aggressive)
                        data = json.loads(aggressive)
                        logger.info("Aggressive JSON repair successful!")
                        return ExplainerOutput(**data)
                except (json.JSONDecodeError, ValidationError):
                    pass
                    
                # DEBUG: Write failing content to file
                with open("explainer_debug_dump.txt", "w", encoding="utf-8") as f:
                    f.write(f"=== ORIGINAL (len={len(content)}) ===\n")
                    f.write(content)
                    f.write(f"\n\n=== REPAIRED (len={len(repaired)}) ===\n")
                    f.write(repaired)
                raise ValueError(f"Invalid JSON from Explainer (even after repair): {e2}")
            except ValidationError as e2:
                # JSON parsed but Pydantic validation failed
                with open("explainer_debug_dump.txt", "w", encoding="utf-8") as f:
                    f.write(repaired)
                raise ValueError(f"JSON parsed but validation failed: {e2}")
        except ValidationError as e:
            # JSON parsed but Pydantic validation failed
            with open("explainer_debug_dump.txt", "w", encoding="utf-8") as f:
                f.write(content)
            raise ValueError(f"JSON parsed but validation failed: {e}")

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
