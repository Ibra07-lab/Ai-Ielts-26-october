"""
Task 2 Examiner Agent — Deficit-Scoring Implementation

This examiner uses the Logic Checks A-D methodology to evaluate essays
with rigorous, evidence-based scoring.
"""

from __future__ import annotations

import json
import os
from typing import Dict, List, Optional, Any

from ielts_writing.schemas.task2 import (
    IELTSEvaluation,
    validate_evaluation,
    TaskType
)
from ielts_writing.agents.prompts.task2_examiner_prompt import (
    get_task2_examiner_system_prompt,
    build_task2_examiner_user_prompt
)
from ielts_writing.domain.task2_criteria import (
    detect_task_type,
    TASK_TYPES
)
from agents.direct_llm_client import DirectLLMClient


class Task2Examiner:
    """Task 2 examiner with deficit-scoring methodology.
    
    Uses Logic Checks A-D to systematically evaluate essays:
    - Logic Check A: Task Response (thesis, task type match, circular arguments)
    - Logic Check B: Coherence (linker density audit)
    - Logic Check C: Lexical (cliché hunter)
    - Logic Check D: Grammar (error classification)
    """

    def __init__(self, model: str | None = None):
        """Initialize the Task 2 examiner.
        
        Args:
            model: Optional model override. Defaults to IELTS_WRITING_MODEL env var
                   or claude-sonnet-4-5-20250929.
        """
        import logging
        logger = logging.getLogger(__name__)
        
        self.model = model or os.getenv(
            "IELTS_WRITING_MODEL",
            "claude-sonnet-4-5-20250929",
        )

        # Force reload .env if stale configuration detected
        if self.model and "20250929" in self.model:
            logger.warning("Stale configuration detected in Task2Examiner. Reloading .env...")
            from dotenv import load_dotenv
            load_dotenv(override=True)
            self.model = os.getenv("IELTS_WRITING_MODEL", "claude-sonnet-4-5-20250929")
            logger.info(f"Reloaded configuration. New model: {self.model}")

        self.client = DirectLLMClient()
        logger.info(f"Task2Examiner initialized with model: {self.model}")
        
        # Verify keys
        if self.client._is_openrouter_key(self.client.anthropic_key):
             logger.info("Task2Examiner detected OpenRouter key for Anthropic")
        else:
             logger.warning(f"Task2Examiner using standard Anthropic key: {self.client.anthropic_key[:10]}...")

    def evaluate(
        self,
        essay: str,
        question: str,
    ) -> IELTSEvaluation:
        """
        Evaluate Task 2 essay using deficit-scoring methodology.
        
        Args:
            essay: The student's essay text
            question: The task question/prompt
        
        Returns:
            IELTSEvaluation: Complete evaluation with all Logic Check results.
        """
        # Pre-detect task type
        detected_task_type = detect_task_type(question)
        
        # Build prompts
        system_prompt = get_task2_examiner_system_prompt()
        user_prompt = build_task2_examiner_user_prompt(
            question=question,
            essay=essay,
            detected_task_type=detected_task_type
        )

        # Call LLM
        # Call LLM based on model type
        if self.model.startswith("openrouter/") or self.model.startswith("openai/") or self.model.startswith("anthropic/"):
            response_text = self.client.call_openrouter(
                model=self.model,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.1,
                max_tokens=4000
            )
        elif "claude" in self.model.lower():
            response_text = self.client.call_anthropic(
                model=self.model,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.1,
                max_tokens=4000,
                image_data=None
            )
        else:
            response_text = self.client.call_openai(
                model=self.model,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.1,
                max_tokens=4000
            )

        # Parse and validate response
        evaluation = self._parse_response(response_text)
        
        return evaluation

    async def evaluate_raw(
        self,
        essay: str,
        question: str,
    ) -> dict:
        """
        Evaluate and return raw dict (for backward compatibility).
        
        Args:
            essay: The student's essay text
            question: The task question/prompt
        
        Returns:
            dict: Raw evaluation data
        """
        evaluation = await self.evaluate(essay=essay, question=question)
        return evaluation.model_dump()

    def _parse_response(self, response_text: str) -> IELTSEvaluation:
        """Parse and validate JSON response from LLM.
        
        Args:
            response_text: Raw text response from LLM
            
        Returns:
            IELTSEvaluation: Validated Pydantic model
            
        Raises:
            ValueError: If JSON parsing or validation fails
        """
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

        # Validate using the schema function
        return validate_evaluation(content)

    def get_quick_summary(self, evaluation: IELTSEvaluation) -> dict:
        """Extract quick summary for UI display.
        
        Args:
            evaluation: The full evaluation
            
        Returns:
            dict: Summary with key metrics
        """
        return {
            "overall_band": evaluation.band_scores.overall,
            "task_response": evaluation.band_scores.task_response,
            "coherence_cohesion": evaluation.band_scores.coherence_cohesion,
            "lexical_resource": evaluation.band_scores.lexical_resource,
            "grammatical_range_accuracy": evaluation.band_scores.grammatical_range_accuracy,
            "fatal_flaws": evaluation.fatal_flaws,
            "word_count": evaluation.analysis.word_count,
            "task_type_match": evaluation.analysis.task_type_match,
            "cliches_found": evaluation.analysis.cliche_audit.total_cliche_count,
            "linker_ratio": evaluation.analysis.linker_audit.mechanical_linker_ratio,
            "improvement_priorities": evaluation.improvement_priorities[:3],
        }


# Convenience function for quick evaluation
async def evaluate_task2_essay(
    essay: str,
    question: str,
    model: str | None = None
) -> IELTSEvaluation:
    """Quick function to evaluate a Task 2 essay.
    
    Args:
        essay: The student's essay
        question: The essay question/prompt
        model: Optional model override
        
    Returns:
        IELTSEvaluation: Complete evaluation
    """
    examiner = Task2Examiner(model=model)
    return await examiner.evaluate(essay=essay, question=question)
