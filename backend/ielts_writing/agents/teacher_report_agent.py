import json
import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

from ..models import ExaminerEvaluation, TaskType
from ..teacher_report_models import TeacherFeedbackReport
from ..prompts.teacher_report import (
    TEACHER_REPORT_SYSTEM_PROMPT, 
    build_teacher_report_prompt
)

from typing import Any

from .llm_factory import get_chat_model, add_cache_tag


class TeacherReportAgent:
    """
    Generates comprehensive, personalized teacher feedback reports.
    Transforms examiner evaluation into student-friendly, actionable feedback.
    """
    
    def __init__(self, model: str = None):
        # Use Claude 3.5 Sonnet for best JSON adherence and reasoning
        model_name = model or os.getenv("IELTS_WRITING_MODEL", "claude-3-5-sonnet-latest")
        
        self.llm = get_chat_model(
            model_name=model_name,
            temperature=0.3,  # Balance between consistency and creativity
            max_tokens=4096  # Larger for comprehensive reports
        )
    
    async def generate_report(
        self,
        student_name: str,
        task_type: TaskType,
        question: str,
        essay: str,
        evaluation: ExaminerEvaluation,
        coaching: Any  # TutorFeedback
    ) -> TeacherFeedbackReport:
        """
        Synthesize reports from Teachers 1 and 2 into a Head Teacher report.
        """
        
        # Convert evaluations to dicts for prompt
        eval_dict = evaluation.model_dump()
        tutor_dict = coaching.model_dump() if hasattr(coaching, 'model_dump') else coaching
        
        user_prompt = build_teacher_report_prompt(
            student_name=student_name,
            question=question,
            essay=essay,
            examiner_evaluation=eval_dict,
            tutor_feedback=tutor_dict
        )
        
        system_msg = SystemMessage(content=TEACHER_REPORT_SYSTEM_PROMPT)
        
        # Apply prompt caching for Claude models
        if hasattr(self.llm, 'model') and 'claude' in str(self.llm.model).lower():
            system_msg = add_cache_tag(system_msg)
        elif hasattr(self.llm, 'model_name') and 'claude' in str(self.llm.model_name).lower():
            system_msg = add_cache_tag(system_msg)
            
        messages = [
            system_msg,
            HumanMessage(content=user_prompt)
        ]
        
        response = await self.llm.ainvoke(messages)
        
        # Parse response
        try:
            # Handle potential markdown fencing or extra text
            content = response.content.strip()
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            # Final fallback: find the first { and last }
            if "{" in content and "}" in content:
                start = content.find("{")
                end = content.rfind("}") + 1
                content = content[start:end]
                
            result = json.loads(content)
        except (json.JSONDecodeError, IndexError) as e:
            raise ValueError(f"Failed to parse teacher report JSON: {e}\n{response.content}")
        
        # Validate and return
        return TeacherFeedbackReport(**result)
    
    def _identify_strongest_criterion(self, evaluation: ExaminerEvaluation) -> str:
        """Helper to identify the criterion with highest band score."""
        scores = evaluation.criterion_scores
        strongest = max(scores, key=lambda x: x.band)
        return strongest.criterion.value
    
    def _identify_weakest_criterion(self, evaluation: ExaminerEvaluation) -> str:
        """Helper to identify the criterion with lowest band score."""
        scores = evaluation.criterion_scores
        weakest = min(scores, key=lambda x: x.band)
        return weakest.criterion.value
