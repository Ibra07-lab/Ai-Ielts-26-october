"""
IELTS Reading Feedback Agent using LangChain and OpenAI GPT-4 Turbo.

This module provides an intelligent agent that analyzes student answers to IELTS 
reading questions and provides detailed, constructive feedback based solely on 
the provided passage content.
"""

import os
import logging
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field, validator
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnablePassthrough

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
        model_name: str = "gpt-40-mini",
        temperature: float = 0.2,
        max_tokens: int = 1000
    ):
        """
        Initialize the Reading Feedback Agent.
        
        Args:
            api_key: OpenAI API key (defaults to OPENAI_API_KEY env var)
            model_name: OpenAI model to use
            temperature: Sampling temperature (lower = more deterministic)
            max_tokens: Maximum tokens in response
        """
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError(
                "OpenAI API key must be provided or set in OPENAI_API_KEY environment variable"
            )
        
        self.model_name = model_name
        self.temperature = temperature
        self.max_tokens = max_tokens
        
        # Initialize LLM with strict parameters to minimize hallucinations
        self.llm = ChatOpenAI(
            model=model_name,
            temperature=temperature,
            max_tokens=max_tokens,
            api_key=self.api_key,
            model_kwargs={
                "top_p": 0.1,  # Nucleus sampling for more focused responses
                "frequency_penalty": 0.0,
                "presence_penalty": 0.0
            }
        )
        
        # Initialize output parser
        self.output_parser = JsonOutputParser(pydantic_object=FeedbackOutput)
        
        # Build the prompt template
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("human", FEEDBACK_TEMPLATE)
        ])
        
        # Create the chain using LCEL (LangChain Expression Language)
        self.chain = (
            RunnablePassthrough.assign(
                format_instructions=lambda _: self.output_parser.get_format_instructions(),
                question_type_guidance=lambda x: get_question_type_guidance(x["question_type"])
            )
            | self.prompt
            | self.llm
            | self.output_parser
        )
        
        logger.info(
            f"ReadingFeedbackAgent initialized with model={model_name}, "
            f"temperature={temperature}"
        )
    
    async def generate_feedback(
        self,
        feedback_input: FeedbackInput
    ) -> FeedbackOutput:
        """
        Generate detailed feedback for a student's answer.
        
        Args:
            feedback_input: Validated input containing passage, question, and answers
            
        Returns:
            FeedbackOutput with detailed analysis and educational feedback
            
        Raises:
            Exception: If LLM invocation fails or output parsing fails
        """
        try:
            logger.info(
                f"Generating feedback for question_type={feedback_input.question_type}"
            )
            
            # Prepare input for the chain
            chain_input = {
                "passage": feedback_input.passage,
                "question": feedback_input.question,
                "question_type": feedback_input.question_type,
                "correct_answer": feedback_input.correct_answer,
                "student_answer": feedback_input.student_answer
            }
            
            # Invoke the chain
            result = await self.chain.ainvoke(chain_input)
            
            # Validate output
            feedback_output = FeedbackOutput(**result)
            
            logger.info(
                f"Feedback generated successfully: is_correct={feedback_output.is_correct}"
            )
            
            return feedback_output
            
        except Exception as e:
            logger.error(f"Error generating feedback: {str(e)}", exc_info=True)
            raise Exception(f"Failed to generate feedback: {str(e)}")
    
    def generate_feedback_sync(
        self,
        feedback_input: FeedbackInput
    ) -> FeedbackOutput:
        """
        Synchronous version of generate_feedback.
        
        Args:
            feedback_input: Validated input containing passage, question, and answers
            
        Returns:
            FeedbackOutput with detailed analysis and educational feedback
        """
        try:
            logger.info(
                f"Generating feedback (sync) for question_type={feedback_input.question_type}"
            )
            
            # Prepare input for the chain
            chain_input = {
                "passage": feedback_input.passage,
                "question": feedback_input.question,
                "question_type": feedback_input.question_type,
                "correct_answer": feedback_input.correct_answer,
                "student_answer": feedback_input.student_answer
            }
            
            # Invoke the chain synchronously
            result = self.chain.invoke(chain_input)
            
            # Validate output
            feedback_output = FeedbackOutput(**result)
            
            logger.info(
                f"Feedback generated successfully: is_correct={feedback_output.is_correct}"
            )
            
            return feedback_output
            
        except Exception as e:
            logger.error(f"Error generating feedback: {str(e)}", exc_info=True)
            raise Exception(f"Failed to generate feedback: {str(e)}")
    
    def update_temperature(self, temperature: float) -> None:
        """
        Update the temperature parameter for the LLM.
        
        Args:
            temperature: New temperature value (0.0 to 2.0)
        """
        if not 0.0 <= temperature <= 2.0:
            raise ValueError("Temperature must be between 0.0 and 2.0")
        
        self.temperature = temperature
        self.llm.temperature = temperature
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

