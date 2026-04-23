"""
Task 1 Explainer Agent — Actionable Feedback Generator

This agent takes the Examiner's evaluation and generates concrete,
actionable feedback for Task 1 (chart/graph/process description) essays.

Pipeline Position:
- Agent 1 (Examiner): Scores the essay → dict
- Agent 2 (Explainer): Generates feedback → Task1ExplainerOutput ← YOU ARE HERE
- Agent 3 (Coach): Creates action plan → CoachOutput

Mirrors the Task 2 Explainer structure but uses Task 1-specific
schema (Task1ExplainerOutput) with honest field names.
"""

from __future__ import annotations

import json
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

from ielts_writing.schemas.task1_explainer import Task1ExplainerOutput
from ielts_writing.agents.prompts.task1_explainer_prompt import (
    get_task1_explainer_system_prompt,
    build_task1_explainer_user_prompt
)
from agents.direct_llm_client import DirectLLMClient


class Task1Explainer:
    """Task 1 Explainer with actionable feedback generation.
    
    Takes the Examiner's evaluation and generates:
    - Overview quality analysis and rewrite
    - Data coverage analysis (key features covered vs missed)
    - Trend description fixes (vague → specific)
    - Sentence-level grammar/vocabulary corrections
    - Cohesion fixes for mechanical linkers
    - Task 1-specific vocabulary upgrades (trend/comparison words)
    - Grammar lessons focused on tenses, passive voice, articles
    - Priority-ranked improvement summary
    """

    def __init__(self, model: str | None = None):
        """Initialize the Task 1 explainer.
        
        Args:
            model: Optional model override. Uses EXPLAINER_MODEL env var,
                   or falls back to IELTS_WRITING_MODEL, or default.
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
        examiner_scores: dict,
        chart_type: str | None = None,
        visual_description: str | dict | None = None,
    ) -> Task1ExplainerOutput:
        """
        Generate actionable feedback for a Task 1 essay.
        
        Args:
            essay: The student's original essay
            question: The Task 1 question/prompt
            examiner_scores: The examiner evaluation dict
            visual_description: Optional chart/data description
        
        Returns:
            Task1ExplainerOutput: Complete feedback with rewrites and lessons.
        """
        # Build prompts
        system_prompt = get_task1_explainer_system_prompt()
        
        # Convert visual description if needed
        vis_desc = visual_description
        if isinstance(vis_desc, dict):
            vis_desc = json.dumps(vis_desc, indent=2)
        
        user_prompt = build_task1_explainer_user_prompt(
            essay=essay,
            question=question,
            examiner_scores=examiner_scores,
            chart_type=chart_type,
            visual_description=vis_desc
        )

        # Use the same model routing as Task 2 explainer
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
        examiner_scores: dict,
        chart_type: str | None = None,
        visual_description: str | dict | None = None,
    ) -> dict:
        """
        Generate feedback and return raw dict.
        
        Args:
            essay: The student's essay
            question: The Task 1 question/prompt
            examiner_scores: The examiner evaluation dict
            visual_description: Optional chart/data description
        
        Returns:
            dict: Raw feedback data
        """
        output = self.explain(
            essay=essay,
            question=question,
            examiner_scores=examiner_scores,
            chart_type=chart_type,
            visual_description=visual_description
        )
        return output.model_dump()

    def _repair_truncated_json(self, content: str) -> str:
        """Attempt to repair truncated JSON by closing unclosed braces/brackets.
        
        When the LLM output is truncated due to max_tokens, the JSON may be
        cut off mid-string. This method tracks nesting and closes all 
        open delimiters in correct LIFO order.
        """
        stack = []
        in_string = False
        escape_next = False
        
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
            if char == '{':
                stack.append('{')
            elif char == '[':
                stack.append('[')
            elif char == '}':
                if stack and stack[-1] == '{':
                    stack.pop()
            elif char == ']':
                if stack and stack[-1] == '[':
                    stack.pop()
            i += 1
        
        if not stack and not in_string:
            return content  # JSON is already balanced
        
        logger.warning(f"Repairing truncated JSON: stack={stack}, in_string={in_string}")
        
        repaired = content
        
        # Close open string
        if in_string:
            repaired = repaired.rstrip()
            repaired += '"'
        
        # Clean up trailing partial content
        repaired = repaired.rstrip()
        
        # Strip trailing comma
        while repaired.endswith(','):
            repaired = repaired[:-1].rstrip()
        
        # Close all open delimiters in reverse order (LIFO)
        for opener in reversed(stack):
            if opener == '{':
                repaired += '}'
            elif opener == '[':
                repaired += ']'
        
        return repaired

    def _parse_response(self, response_text: str) -> Task1ExplainerOutput:
        """Parse and validate JSON response from LLM.
        
        Args:
            response_text: Raw text response from LLM
            
        Returns:
            Task1ExplainerOutput: Validated Pydantic model
            
        Raises:
            ValueError: If JSON parsing or validation fails
        """
        from pydantic import ValidationError
        
        content = response_text.strip()
        logger.info(f"Raw Task1 Explainer response length: {len(content)} chars")
        
        # Handle markdown fencing
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            parts = content.split("```")
            if len(parts) >= 2:
                content = parts[1].strip()

        # Find the start of JSON
        if "{" in content:
            start = content.find("{")
            content = content[start:]

        # First attempt: try parsing as-is
        try:
            data = json.loads(content)
            logger.info("JSON parsed successfully on first attempt")
            return Task1ExplainerOutput(**data)
        except json.JSONDecodeError as e:
            logger.warning(f"JSON parse failed ({e}), attempting repair...")
            
            # Try repairing truncated JSON
            repaired = self._repair_truncated_json(content)
            try:
                data = json.loads(repaired)
                logger.info("JSON repair successful!")
                return Task1ExplainerOutput(**data)
            except json.JSONDecodeError as e2:
                # Aggressive repair
                logger.warning(f"Repair still failed ({e2}), trying aggressive repair...")
                try:
                    last_brace = repaired.rfind('}')
                    if last_brace > 0:
                        aggressive = repaired[:last_brace + 1]
                        aggressive = self._repair_truncated_json(aggressive)
                        data = json.loads(aggressive)
                        logger.info("Aggressive JSON repair successful!")
                        return Task1ExplainerOutput(**data)
                except (json.JSONDecodeError, ValidationError):
                    pass
                    
                # DEBUG: Write failing content
                try:
                    with open("task1_explainer_debug_dump.txt", "w", encoding="utf-8") as f:
                        f.write(f"=== ORIGINAL (len={len(content)}) ===\n")
                        f.write(content)
                        f.write(f"\n\n=== REPAIRED (len={len(repaired)}) ===\n")
                        f.write(repaired)
                except Exception:
                    pass
                raise ValueError(f"Invalid JSON from Task1 Explainer (even after repair): {e2}")
            except ValidationError as e2:
                try:
                    with open("task1_explainer_debug_dump.txt", "w", encoding="utf-8") as f:
                        f.write(repaired)
                except Exception:
                    pass
                raise ValueError(f"JSON parsed but validation failed: {e2}")
        except ValidationError as e:
            try:
                with open("task1_explainer_debug_dump.txt", "w", encoding="utf-8") as f:
                    f.write(content)
            except Exception:
                pass
            raise ValueError(f"JSON parsed but validation failed: {e}")

    def get_priority_actions(self, output: Task1ExplainerOutput) -> list[dict]:
        """Extract priority actions for quick display."""
        return [
            {
                "rank": p.rank,
                "area": p.area,
                "action": p.action_step,
                "impact": p.score_impact
            }
            for p in output.priority_summary
        ]

    def get_quick_summary(self, output: Task1ExplainerOutput) -> dict:
        """Extract quick summary for UI display."""
        return {
            "current_band": output.current_overall_band,
            "target_band": output.target_band_demonstrated,
            "overview_quality": output.overview_feedback.overview_quality if output.overview_feedback else None,
            "data_coverage": f"{output.data_coverage.features_covered}/{output.data_coverage.total_key_features}" if output.data_coverage else None,
            "trend_fixes": len(output.trend_fixes),
            "micro_fixes": len(output.micro_fixes),
            "cohesion_fixes": len(output.cohesion_fixes),
            "grammar_lessons": len(output.grammar_feedback.pattern_lessons) if output.grammar_feedback else 0,
            "top_priority": output.priority_summary[0].area if output.priority_summary else None,
            "immediate_focus": output.immediate_focus,
            "one_thing_done_well": output.one_thing_done_well,
        }
