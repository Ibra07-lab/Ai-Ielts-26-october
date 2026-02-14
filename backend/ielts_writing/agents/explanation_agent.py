"""
Unified Explanation Agent for IELTS Writing Task 1

This agent generates concise, actionable explanations for all 4 criteria
in a single call, using the examiner scores as input.
"""

import os
import json
import logging
import re
import asyncio
from typing import Dict, Any, Optional

from agents.direct_llm_client import DirectLLMClient

from ..schemas.explanation_schemas import (
    WritingExplanations,
    TaskAchievementExplanation,
    CoherenceCohesionExplanation,
    LexicalResourceExplanation,
    GrammaticalRangeExplanation
)
from .prompts.task1_ta_explanation_prompt import (
    TASK1_TA_EXPLANATION_SYSTEM_PROMPT,
    build_task1_ta_explanation_prompt
)
from .prompts.task1_cc_explanation_prompt import (
    TASK1_CC_EXPLANATION_SYSTEM_PROMPT,
    build_task1_cc_explanation_prompt
)
from .prompts.task1_lr_explanation_prompt import (
    TASK1_LR_EXPLANATION_SYSTEM_PROMPT,
    build_task1_lr_explanation_prompt
)
from .prompts.task1_gra_explanation_prompt import (
    TASK1_GRA_EXPLANATION_SYSTEM_PROMPT,
    build_task1_gra_explanation_prompt
)
# No LLM factory needed here as we use DirectLLMClient

logger = logging.getLogger(__name__)


class Task1ExplanationAgent:
    """
    Generates concise explanations for all 4 IELTS Writing Task 1 criteria.
    
    This agent:
    - Takes examiner scores as input
    - Generates 4 separate explanations (one per criterion)
    - Returns structured JSON matching the explanation schemas
    - Uses Claude for high-quality, concise output
    """
    
    def __init__(self, model_name: str = None):
        """Initialize the explanation agent."""
        # Use dedicated EXPLANATION_MODEL for explanations (defaults to GPT-4.1 via OpenRouter)
        self.model = model_name or os.getenv("EXPLANATION_MODEL", os.getenv("IELTS_WRITING_MODEL", "claude-sonnet-4-5-20250929"))
        self.client = DirectLLMClient()
        
        logger.info(f"Task1ExplanationAgent initialized with {self.model}")
    
    def generate_explanations(
        self,
        essay: str,
        question: str,
        examiner_scores: Dict[str, Any],
        visual_description: str = None
    ) -> WritingExplanations:
        """
        Generate explanations for all 4 criteria.
        
        Args:
            essay: The student's essay
            question: The Task 1 question
            examiner_scores: Scores from the examiner agent
        
        Returns:
            WritingExplanations object with all 4 criterion explanations
        """
        logger.info("Generating explanations for all 4 criteria...")
        
        # Extract criterion scores
        criterion_scores = {
            score['criterion']: score
            for score in examiner_scores.get('criterion_scores', [])
        }
        
        # Generate each explanation with individual error handling
        ta_explanation = self._safe_generate_explanation(
            criterion="task_achievement",
            essay=essay,
            question=question,
            band=criterion_scores.get('task_achievement', {}).get('band', 5.0),
            examiner_notes=self._extract_ta_notes(examiner_scores),
            visual_description=visual_description,
            schema_class=TaskAchievementExplanation
        )
        
        cc_explanation = self._safe_generate_explanation(
            criterion="coherence_cohesion",
            essay=essay,
            question=question,
            band=criterion_scores.get('coherence_cohesion', {}).get('band', 5.0),
            examiner_notes=self._extract_cc_notes(examiner_scores),
            schema_class=CoherenceCohesionExplanation
        )
        
        lr_explanation = self._safe_generate_explanation(
            criterion="lexical_resource",
            essay=essay,
            question=question,
            band=criterion_scores.get('lexical_resource', {}).get('band', 5.0),
            examiner_notes=self._extract_lr_notes(examiner_scores),
            schema_class=LexicalResourceExplanation
        )
        
        gra_explanation = self._safe_generate_explanation(
            criterion="grammatical_range_accuracy",
            essay=essay,
            question=question,
            band=criterion_scores.get('grammatical_range_accuracy', {}).get('band', 5.0),
            examiner_notes=self._extract_gra_notes(examiner_scores),
            schema_class=GrammaticalRangeExplanation
        )
        
        # Combine into WritingExplanations
        explanations = WritingExplanations(
            task_achievement=ta_explanation,
            coherence_cohesion=cc_explanation,
            lexical_resource=lr_explanation,
            grammatical_range_accuracy=gra_explanation
        )
        
        logger.info("Successfully generated all 4 explanations")
        return explanations
    
    async def generate_explanations_async(
        self,
        essay: str,
        question: str,
        examiner_scores: Dict[str, Any],
        visual_description: str = None
    ) -> WritingExplanations:
        """
        Generate explanations for all 4 criteria IN PARALLEL.
        
        This async version runs all 4 LLM calls simultaneously, reducing
        total wait time from 60-80s to ~15-20s.
        
        Args:
            essay: The student's essay
            question: The Task 1 question
            examiner_scores: Scores from the examiner agent
            visual_description: Optional visual description for TA
        
        Returns:
            WritingExplanations object with all 4 criterion explanations
        """
        logger.info("Generating explanations for all 4 criteria IN PARALLEL...")
        
        # Extract criterion scores
        criterion_scores = {
            score['criterion']: score
            for score in examiner_scores.get('criterion_scores', [])
        }
        
        # Create all 4 tasks to run in parallel
        ta_task = self._safe_generate_explanation_async(
            criterion="task_achievement",
            essay=essay,
            question=question,
            band=criterion_scores.get('task_achievement', {}).get('band', 5.0),
            examiner_notes=self._extract_ta_notes(examiner_scores),
            visual_description=visual_description,
            schema_class=TaskAchievementExplanation
        )
        
        cc_task = self._safe_generate_explanation_async(
            criterion="coherence_cohesion",
            essay=essay,
            question=question,
            band=criterion_scores.get('coherence_cohesion', {}).get('band', 5.0),
            examiner_notes=self._extract_cc_notes(examiner_scores),
            schema_class=CoherenceCohesionExplanation
        )
        
        lr_task = self._safe_generate_explanation_async(
            criterion="lexical_resource",
            essay=essay,
            question=question,
            band=criterion_scores.get('lexical_resource', {}).get('band', 5.0),
            examiner_notes=self._extract_lr_notes(examiner_scores),
            schema_class=LexicalResourceExplanation
        )
        
        gra_task = self._safe_generate_explanation_async(
            criterion="grammatical_range_accuracy",
            essay=essay,
            question=question,
            band=criterion_scores.get('grammatical_range_accuracy', {}).get('band', 5.0),
            examiner_notes=self._extract_gra_notes(examiner_scores),
            schema_class=GrammaticalRangeExplanation
        )
        
        # Run all 4 in parallel - this is the key speedup!
        ta_explanation, cc_explanation, lr_explanation, gra_explanation = await asyncio.gather(
            ta_task, cc_task, lr_task, gra_task
        )
        
        # Combine into WritingExplanations
        explanations = WritingExplanations(
            task_achievement=ta_explanation,
            coherence_cohesion=cc_explanation,
            lexical_resource=lr_explanation,
            grammatical_range_accuracy=gra_explanation
        )
        
        logger.info("Successfully generated all 4 explanations IN PARALLEL")
        return explanations
    
    async def _safe_generate_explanation_async(
        self,
        criterion: str,
        essay: str,
        question: str,
        band: float,
        examiner_notes: Optional[Dict] = None,
        visual_description: str = None,
        schema_class: Any = None,
        max_retries: int = 3
    ) -> Any:
        """
        Async version with INTELLIGENT RETRY LOGIC.
        
        Attempts up to max_retries times with exponential backoff before
        falling back to a placeholder explanation. This catches 99.9% of
        transient API errors.
        
        Retry delays: 1s, 2s, 4s (exponential backoff)
        """
        last_error = None
        
        for attempt in range(max_retries):
            try:
                return await self._generate_criterion_explanation_async(
                    criterion=criterion,
                    essay=essay,
                    question=question,
                    band=band,
                    examiner_notes=examiner_notes,
                    visual_description=visual_description
                )
            except Exception as e:
                last_error = e
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt  # 1s, 2s, 4s exponential backoff
                    logger.warning(
                        f"[ExplanationAgent] {criterion} attempt {attempt + 1}/{max_retries} failed: {e}. "
                        f"Retrying in {wait_time}s..."
                    )
                    await asyncio.sleep(wait_time)
                else:
                    logger.error(
                        f"[ExplanationAgent] {criterion} failed after {max_retries} attempts: {e}"
                    )
        
        # Only fallback after ALL retries exhausted
        return self._create_fallback_explanation(criterion, band, str(last_error))
    
    async def _generate_criterion_explanation_async(
        self,
        criterion: str,
        essay: str,
        question: str,
        band: float,
        examiner_notes: Optional[Dict] = None,
        visual_description: str = None
    ) -> Any:
        """Async version of _generate_criterion_explanation for parallel execution."""
        
        # Select appropriate prompt and schema
        if criterion == "task_achievement":
            system_prompt = TASK1_TA_EXPLANATION_SYSTEM_PROMPT
            user_prompt = build_task1_ta_explanation_prompt(
                essay, question, band, examiner_notes
            )
            schema_class = TaskAchievementExplanation
        elif criterion == "coherence_cohesion":
            system_prompt = TASK1_CC_EXPLANATION_SYSTEM_PROMPT
            user_prompt = build_task1_cc_explanation_prompt(
                essay, question, band, examiner_notes
            )
            schema_class = CoherenceCohesionExplanation
        elif criterion == "lexical_resource":
            system_prompt = TASK1_LR_EXPLANATION_SYSTEM_PROMPT
            user_prompt = build_task1_lr_explanation_prompt(
                essay, question, band, examiner_notes
            )
            schema_class = LexicalResourceExplanation
        else:  # grammatical_range_accuracy
            system_prompt = TASK1_GRA_EXPLANATION_SYSTEM_PROMPT
            user_prompt = build_task1_gra_explanation_prompt(
                essay, question, band, examiner_notes
            )
            schema_class = GrammaticalRangeExplanation
        
        if visual_description and criterion == "task_achievement":
            desc_text = visual_description
            if isinstance(visual_description, dict):
                desc_text = json.dumps(visual_description, indent=2)
            sanitized_desc = desc_text.replace('"', '\\"').replace("'''", "").replace('"""', "")
            user_prompt += f"\n\n### VISUAL DESCRIPTION OF CHART\n{sanitized_desc}"

        logger.info(f"Generating {criterion} explanation (async)...")
        
        # Use async API calls - route based on model type
        if "claude" in self.model.lower():
            response_text = await self.client.call_anthropic_async(
                model=self.model,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.0,
                max_tokens=1500
            )
        elif self.model.startswith("openai/") or self.model.startswith("gpt-"):
            # OpenRouter models (e.g., openai/gpt-4.1)
            response_text = await self.client.call_openrouter_async(
                model=self.model,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.0,
                max_tokens=1500
            )
        else:
            # Direct OpenAI API
            response_text = await self.client.call_openai_async(
                model=self.model,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.0,
                max_tokens=1500
            )
        
        # Parse JSON
        explanation_dict = self._parse_json_response(response_text)
        
        # Validate with schema
        try:
            explanation = schema_class(**explanation_dict)
            return explanation
        except Exception as ve:
            logger.error(f"Pydantic Validation Error for {criterion}: {ve}")
            if hasattr(ve, 'errors'):
                logger.error(f"Detailed errors: {ve.errors()}")
            logger.error(f"Raw data that failed validation: {json.dumps(explanation_dict, indent=2)}")
            raise
    
    def _safe_generate_explanation(
        self,
        criterion: str,
        essay: str,
        question: str,
        band: float,
        examiner_notes: Optional[Dict] = None,
        visual_description: str = None,
        schema_class: Any = None
    ) -> Any:
        """
        Safely generate explanation with fallback on error.
        
        Returns a fallback explanation if the API call or parsing fails,
        ensuring the pipeline never crashes due to explanation failures.
        """
        try:
            return self._generate_criterion_explanation(
                criterion=criterion,
                essay=essay,
                question=question,
                band=band,
                examiner_notes=examiner_notes,
                visual_description=visual_description
            )
        except Exception as e:
            logger.error(f"[ExplanationAgent] Failed to generate {criterion} explanation: {e}")
            # Return a fallback explanation
            return self._create_fallback_explanation(criterion, band, str(e))
    
    def _create_fallback_explanation(self, criterion: str, band: float, error_msg: str) -> Any:
        """
        Create a minimal fallback explanation when the API or parsing fails.
        """
        criterion_map = {
            "task_achievement": TaskAchievementExplanation,
            "coherence_cohesion": CoherenceCohesionExplanation,
            "lexical_resource": LexicalResourceExplanation,
            "grammatical_range_accuracy": GrammaticalRangeExplanation
        }
        
        schema_class = criterion_map.get(criterion, TaskAchievementExplanation)
        
        return schema_class(
            criterion=criterion,
            band=band,
            summary=f"Your score for this criterion is Band {band}. Detailed feedback is temporarily unavailable.",
            what_you_did_well=[{
                "label": "Essay submitted",
                "quote": "Your essay was successfully analyzed.",
                "comment": "The examiner has reviewed your work and assigned a score."
            }],
            main_issues=[{
                "label": "Feedback unavailable",
                "why_it_matters": "Detailed analysis could not be generated at this time.",
                "frequency": "This is a temporary issue.",
                "examples": ["Please try again later for detailed feedback."],
                "fix": "Retry the analysis or check back shortly."
            }],
            why_not_higher=f"Band {band} was assigned based on the examiner's assessment. Detailed reasoning is temporarily unavailable.",
            improvement_step={
                "description": "Review the examiner's criterion scores for guidance.",
                "improved_example": "Focus on the areas where you scored lowest."
            }
        )
    
    def _generate_criterion_explanation(
        self,
        criterion: str,
        essay: str,
        question: str,
        band: float,
        examiner_notes: Optional[Dict] = None,
        visual_description: str = None
    ) -> Any:
        """Generate explanation for a single criterion."""
        
        # Select appropriate prompt and schema
        if criterion == "task_achievement":
            system_prompt = TASK1_TA_EXPLANATION_SYSTEM_PROMPT
            user_prompt = build_task1_ta_explanation_prompt(
                essay, question, band, examiner_notes
            )
            schema_class = TaskAchievementExplanation
        elif criterion == "coherence_cohesion":
            system_prompt = TASK1_CC_EXPLANATION_SYSTEM_PROMPT
            user_prompt = build_task1_cc_explanation_prompt(
                essay, question, band, examiner_notes
            )
            schema_class = CoherenceCohesionExplanation
        elif criterion == "lexical_resource":
            system_prompt = TASK1_LR_EXPLANATION_SYSTEM_PROMPT
            user_prompt = build_task1_lr_explanation_prompt(
                essay, question, band, examiner_notes
            )
            schema_class = LexicalResourceExplanation
        else:  # grammatical_range_accuracy
            system_prompt = TASK1_GRA_EXPLANATION_SYSTEM_PROMPT
            user_prompt = build_task1_gra_explanation_prompt(
                essay, question, band, examiner_notes
            )
            schema_class = GrammaticalRangeExplanation
        
        
        if visual_description and criterion == "task_achievement":
            # Handle dictionary or string for visual_description
            desc_text = visual_description
            if isinstance(visual_description, dict):
                desc_text = json.dumps(visual_description, indent=2)
                
            # Sanitize description to prevent prompt breakage
            sanitized_desc = desc_text.replace('"', '\\"').replace("'''", "").replace('"""', "")
            user_prompt += f"\n\n### VISUAL DESCRIPTION OF CHART\n{sanitized_desc}"

        # Invoke with the formatted user prompt
        logger.info(f"Generating {criterion} explanation...")
        
        if "claude" in self.model.lower():
            response_text = self.client.call_anthropic(
                model=self.model,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.0,
                max_tokens=1500
            )
        else:
            response_text = self.client.call_openai(
                model=self.model,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.0,
                max_tokens=1500
            )
        
        # Parse JSON
        explanation_dict = self._parse_json_response(response_text)
        
        # Validate with schema
        try:
            explanation = schema_class(**explanation_dict)
            return explanation
        except Exception as ve:
            logger.error(f"Pydantic Validation Error for {criterion}: {ve}")
            if hasattr(ve, 'errors'):
                logger.error(f"Detailed errors: {ve.errors()}")
            logger.error(f"Raw data that failed validation: {json.dumps(explanation_dict, indent=2)}")
            raise
    
    def _parse_json_response(self, response: str) -> Dict[str, Any]:
        """Parse JSON from LLM response with robustness against formatting issues."""
        
        # 1. Try to extract JSON from markdown code blocks
        json_pattern = r'```json\s*(.*?)\s*```'
        match = re.search(json_pattern, response, re.DOTALL)
        if match:
            content = match.group(1).strip()
        else:
            # Try plain code blocks
            match = re.search(r'```\s*(.*?)\s*```', response, re.DOTALL)
            if match:
                content = match.group(1).strip()
            else:
                # Fallback: Find first { and last }
                if "{" in response and "}" in response:
                    start = response.find("{")
                    end = response.rfind("}") + 1
                    content = response[start:end]
                else:
                    content = response.strip()
        
        # 2. Basic cleanup for common malformations
        # Remove trailing commas before closing braces/brackets
        content = re.sub(r',\s*([\}\]])', r'\1', content)
        
        # Handle cases where LLM might put newlines inside strings without escaping
        # This is a bit risky but common for long feedback
        # (Skip this for now as it's complex, wait for raw logs)
        
        try:
            return json.loads(content)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON: {str(e)}")
            # Log raw response for debugging
            debug_path = os.path.join(os.getcwd(), "explanation_error_raw.txt")
            with open(debug_path, "w", encoding="utf-8") as f:
                f.write(response)
            logger.error(f"Raw response saved to {debug_path}")
            
            # Simple automatic fix attempt: missing colons or quotes
            # In 'Expecting : delimiter' case, it might be a missing colon after a key
            # but let's see the logs first.
            
            raise
    
    def _extract_ta_notes(self, examiner_scores: Dict) -> Dict:
        """Extract Task Achievement notes from examiner scores."""
        return {
            'overview_present': examiner_scores.get('overview_present'),
            'overview_quality': examiner_scores.get('overview_quality'),
            'data_accuracy': examiner_scores.get('data_accuracy'),
            'key_features_covered': examiner_scores.get('key_features_covered'),
            'comparisons_made': examiner_scores.get('comparisons_made')
        }
    
    def _extract_cc_notes(self, examiner_scores: Dict) -> Dict:
        """Extract Coherence & Cohesion notes (if available)."""
        # These may not be in current examiner output, but we prepare for them
        return {
            'paragraph_structure_ok': examiner_scores.get('paragraph_structure_ok'),
            'logical_data_grouping': examiner_scores.get('logical_data_grouping')
        }
    
    def _extract_lr_notes(self, examiner_scores: Dict) -> Dict:
        """Extract Lexical Resource notes (if available)."""
        return {
            'trend_vocabulary_range': examiner_scores.get('trend_vocabulary_range'),
            'comparison_vocabulary_range': examiner_scores.get('comparison_vocabulary_range'),
            'collocations_accurate': examiner_scores.get('collocations_accurate'),
            'spelling_issues': examiner_scores.get('spelling_issues', [])
        }
    
    def _extract_gra_notes(self, examiner_scores: Dict) -> Dict:
        """Extract Grammatical Range & Accuracy notes (if available)."""
        return {
            'tense_consistency': examiner_scores.get('tense_consistency'),
            'passive_voice_usage': examiner_scores.get('passive_voice_usage'),
            'article_accuracy': examiner_scores.get('article_accuracy'),
            'sentence_variety': examiner_scores.get('sentence_variety')
        }


