"""
Unified Explanation Agent for IELTS Writing Task 1

This agent generates concise, actionable explanations for all 4 criteria
in a single call, using the examiner scores as input.
"""

import os
import json
import logging
import re
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
        self.model = model_name or os.getenv("IELTS_WRITING_MODEL", "claude-sonnet-4-5-20250929")
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
        try:
            logger.info("Generating explanations for all 4 criteria...")
            
            # Extract criterion scores
            criterion_scores = {
                score['criterion']: score
                for score in examiner_scores.get('criterion_scores', [])
            }
            
            # Generate each explanation
            ta_explanation = self._generate_criterion_explanation(
                criterion="task_achievement",
                essay=essay,
                question=question,
                band=criterion_scores.get('task_achievement', {}).get('band', 5.0),
                examiner_notes=self._extract_ta_notes(examiner_scores),
                visual_description=visual_description
            )
            
            cc_explanation = self._generate_criterion_explanation(
                criterion="coherence_cohesion",
                essay=essay,
                question=question,
                band=criterion_scores.get('coherence_cohesion', {}).get('band', 5.0),
                examiner_notes=self._extract_cc_notes(examiner_scores)
            )
            
            lr_explanation = self._generate_criterion_explanation(
                criterion="lexical_resource",
                essay=essay,
                question=question,
                band=criterion_scores.get('lexical_resource', {}).get('band', 5.0),
                examiner_notes=self._extract_lr_notes(examiner_scores)
            )
            
            gra_explanation = self._generate_criterion_explanation(
                criterion="grammatical_range_accuracy",
                essay=essay,
                question=question,
                band=criterion_scores.get('grammatical_range_accuracy', {}).get('band', 5.0),
                examiner_notes=self._extract_gra_notes(examiner_scores)
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
            
        except Exception as e:
            logger.error(f"Error generating explanations: {str(e)}")
            raise
    
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
            # Sanitize description to prevent prompt breakage
            sanitized_desc = visual_description.replace('"', '\\"').replace("'''", "").replace('"""', "")
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


