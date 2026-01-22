"""
IELTS Reading Feedback Agent using LangChain and OpenAI GPT-4 Turbo.

This module provides an intelligent agent that analyzes student answers to IELTS 
reading questions and provides detailed, constructive feedback based solely on 
the provided passage content.
"""

import os
import json
import logging
import re
from pathlib import Path
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field, validator
from .direct_llm_client import DirectLLMClient

from .prompts import (
    SYSTEM_PROMPT,
    FEEDBACK_TEMPLATE,
    get_question_type_guidance
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class FeedbackInput(BaseModel):
    """Input schema for feedback generation."""
    
    passage: str = Field(..., min_length=50, description="The reading passage text")
    question: str = Field(..., min_length=5, description="The question text")
    question_type: str = Field(..., description="Type of IELTS reading question")
    correct_answer: str = Field(..., description="The correct answer")
    student_answer: str = Field(..., description="Student's submitted answer")
    
    @validator('question_type')
    def validate_question_type(cls, v):
        """Validate question type against allowed IELTS question types."""
        valid_types = [
            "Multiple Choice",
            "True/False/Not Given",
            "Yes/No/Not Given",
            "Matching Headings",
            "Matching Information",
            "Matching Features",
            "Matching Sentence Endings",
            "Sentence Completion",
            "Summary Completion",
            "Note Completion",
            "Table Completion",
            "Flow Chart Completion",
            "Diagram Label Completion",
            "Short Answer Questions"
        ]
        if v not in valid_types:
            logger.warning(f"Unknown question type: {v}. Proceeding with generic guidance.")
        return v
    
    @validator('passage')
    def validate_passage_length(cls, v):
        """Ensure passage is not too short."""
        if len(v.strip()) < 50:
            raise ValueError("Passage must be at least 50 characters long")
        return v.strip()
    
    @validator('student_answer', 'correct_answer')
    def validate_answers(cls, v):
        """Normalize answer formatting."""
        return v.strip()


class FeedbackOutput(BaseModel):
    """Output schema for feedback response."""
    
    is_correct: bool = Field(..., description="Whether the student's answer is correct")
    feedback: str = Field(..., description="Detailed explanation of correctness")
    reasoning: str = Field(..., description="Step-by-step analysis based on passage")
    strategy_tip: str = Field(..., description="How to approach similar questions")
    passage_reference: str = Field(..., description="Quote from passage supporting the answer")
    confidence: Optional[str] = Field(
        default="high",
        description="Agent's confidence level in the assessment"
    )


class ReadingFeedbackAgent:
    """
    LangChain agent for generating intelligent feedback on IELTS Reading answers.
    
    This agent uses GPT-4 Turbo with strict constraints to ensure feedback is:
    - Based solely on passage content
    - Aligned with official IELTS criteria
    - Educational and constructive
    - Free from hallucinations
    """
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        model_name: str = "gpt-4o-mini",
        temperature: float = 0.2,
        max_tokens: int = 1000
    ):
        """
        Initialize the Reading Feedback Agent.
        """
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError(
                "OpenAI API key must be provided or set in OPENAI_API_KEY environment variable"
            )
        
        self.model_name = model_name
        self.temperature = temperature
        self.max_tokens = max_tokens
        
        # Initialize Direct Client
        self.client = DirectLLMClient()
        
        # Load theory data
        self.theory_data = self._load_theory_data()
        
        logger.info(
            f"ReadingFeedbackAgent initialized with model={model_name}, "
            f"temperature={temperature} (Direct API Mode)"
        )
    
    async def generate_feedback(
        self,
        feedback_input: FeedbackInput
    ) -> FeedbackOutput:
        """Generate detailed feedback for a student's answer."""
        try:
            logger.info(
                f"Generating feedback for question_type={feedback_input.question_type}"
            )
            
            # Prepare prompts
            format_instructions = "Return the response as a valid JSON object with the fields: is_correct (boolean), feedback (string), reasoning (string), strategy_tip (string), passage_reference (string), and confidence (string)."
            question_type_guidance = self._get_dynamic_theory(feedback_input.question_type)
            
            user_prompt = FEEDBACK_TEMPLATE.format(
                passage=feedback_input.passage,
                question=feedback_input.question,
                question_type=feedback_input.question_type,
                correct_answer=feedback_input.correct_answer,
                student_answer=feedback_input.student_answer,
                format_instructions=format_instructions,
                question_type_guidance=question_type_guidance
            )
            
            # Call Direct API
            response_text = self.client.call_openai(
                model=self.model_name,
                system_prompt=SYSTEM_PROMPT,
                user_prompt=user_prompt,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            # Parse JSON
            result = self._parse_json_response(response_text)
            
            # Validate output
            feedback_output = FeedbackOutput(**result)
            
            logger.info(
                f"Feedback generated successfully: is_correct={feedback_output.is_correct}"
            )
            
            return feedback_output
            
        except Exception as e:
            logger.error(f"Error generating feedback: {str(e)}", exc_info=True)
            raise Exception(f"Failed to generate feedback: {str(e)}")

    def _parse_json_response(self, response: str) -> Dict[str, Any]:
        """Parse JSON from LLM response with robustness."""
        json_pattern = r'```json\s*(.*?)\s*```'
        match = re.search(json_pattern, response, re.DOTALL)
        if match:
            content = match.group(1).strip()
        else:
            match = re.search(r'```\s*(.*?)\s*```', response, re.DOTALL)
            if match:
                content = match.group(1).strip()
            else:
                match = re.search(r'(\{.*\})', response, re.DOTALL)
                content = match.group(1).strip() if match else response.strip()
        
        content = re.sub(r',\s*([\}\]])', r'\1', content)
        return json.loads(content)
    
    def generate_feedback_sync(
        self,
        feedback_input: FeedbackInput
    ) -> FeedbackOutput:
        """Synchronous version of generate_feedback."""
        import asyncio
        return asyncio.run(self.generate_feedback(feedback_input))

    def _load_theory_data(self) -> Dict[str, Any]:
        """Load reading theory data from JSON file."""
        try:
            # Path relative to this file: ../data/reading-theory.json
            base_path = Path(__file__).parent.parent
            theory_path = base_path / "data" / "reading-theory.json"
            
            if not theory_path.exists():
                logger.warning(f"Theory file not found at {theory_path}. Using fallback guidance.")
                return {"questionTypes": []}
                
            with open(theory_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading theory data: {e}")
            return {"questionTypes": []}

    def _get_dynamic_theory(self, question_type: str) -> str:
        """Extract and format theory for a specific question type."""
        # Find matching theory in JSON
        theory_item = None
        
        # Normalize question_type for searching
        search_id = question_type.lower().replace("/", "-").replace(" ", "-")
        
        # Try finding by ID first
        for item in self.theory_data.get("questionTypes", []):
            if item.get("id") == search_id or item.get("name") == question_type:
                theory_item = item
                break
        
        if not theory_item:
            # Fallback to hardcoded guidance if not found in JSON
            return get_question_type_guidance(question_type)
            
        # Format theory for LLM consumption
        guidance_parts = [f"GUIDANCE FOR {question_type.upper()}:"]
        
        # Add basic description
        what_is_it = theory_item.get("whatIsIt", {})
        if what_is_it.get("description"):
            guidance_parts.append(f"Description: {what_is_it['description']}")
            
        # Add strategy steps if available in detailedTheory
        detailed = theory_item.get("detailedTheory", {})
        sections = detailed.get("sections", [])
        
        # Look for strategy/step-by-step section
        for section in sections:
            title = section.get("title", "").upper()
            if "STRATEGY" in title or "STEP-BY-STEP" in title:
                guidance_parts.append("\nSTRATEGY STEPS:")
                for sub in section.get("subsections", []):
                    if sub.get("steps"):
                        for step in sub["steps"]:
                            guidance_parts.append(f"- Step {step.get('step')}: {step.get('title')}")
                            if step.get("actions"):
                                for action in step["actions"]:
                                    guidance_parts.append(f"  • {action}")
                    elif sub.get("actions"):
                         for action in sub["actions"]:
                            guidance_parts.append(f"- {action}")

        # Add common mistakes
        common_mistakes = theory_item.get("commonMistakes")
        if not common_mistakes:
            # Check for section named "COMMON MISTAKES"
            for section in sections:
                title = section.get("title", "").upper()
                if "MISTAKE" in title or "PITFALL" in title:
                    for sub in section.get("subsections", []):
                        if sub.get("mistakes"):
                            common_mistakes = sub["mistakes"]
                            break
        
        if common_mistakes:
            guidance_parts.append("\nCOMMON MISTAKES TO WATCH FOR:")
            for m in common_mistakes[:5]: # Take top 5 to save tokens
                guidance_parts.append(f"- {m.get('title')}: {m.get('trap', m.get('description', ''))}")

        return "\n".join(guidance_parts)
    
    def update_temperature(self, temperature: float) -> None:
        """Update the temperature parameter."""
        if not 0.0 <= temperature <= 2.0:
            raise ValueError("Temperature must be between 0.0 and 2.0")
        
        self.temperature = temperature
        logger.info(f"Temperature updated to {temperature}")


# Factory function for easy agent creation
def create_reading_feedback_agent(
    api_key: Optional[str] = None,
    **kwargs
) -> ReadingFeedbackAgent:
    """
    Factory function to create a ReadingFeedbackAgent instance.
    
    Args:
        api_key: OpenAI API key
        **kwargs: Additional arguments for ReadingFeedbackAgent
        
    Returns:
        Configured ReadingFeedbackAgent instance
    """
    return ReadingFeedbackAgent(api_key=api_key, **kwargs)

