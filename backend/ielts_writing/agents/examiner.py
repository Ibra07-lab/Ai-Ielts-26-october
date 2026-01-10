import json
import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

from ..models import ExaminerEvaluation, TaskType
from ..prompts.examiner import EXAMINER_SYSTEM_PROMPT, build_examiner_prompt
from .llm_factory import get_chat_model, add_cache_tag

class ExaminerAgent:
    """Strict scoring agent — no coaching, just facts."""
    
    def __init__(self, model: str = None):
        # Default to environment variable or fallback to gpt-4o
        model_name = model or os.getenv("IELTS_WRITING_MODEL", "gpt-4o")
        
        self.llm = get_chat_model(
            model_name=model_name,
            temperature=0.1,  # Low temp for consistent scoring
            max_tokens=2048
        )
    
    async def evaluate(
        self,
        task_type: TaskType,
        question: str,
        essay: str
    ) -> ExaminerEvaluation:
        """Score the essay strictly by IELTS criteria."""
        
        user_prompt = build_examiner_prompt(
            task_type=task_type.value,
            question=question,
            essay=essay
        )
        
        system_msg = SystemMessage(content=EXAMINER_SYSTEM_PROMPT)
        
        # Apply prompt caching for Claude models
        # Apply prompt caching for Claude models (SKIP for 4.5 beta as it causes 404)
        if hasattr(self.llm, 'model'):
            model_name = str(self.llm.model).lower()
            if 'claude' in model_name and '4-5' not in model_name:
                system_msg = add_cache_tag(system_msg)
        elif hasattr(self.llm, 'model_name'):
             model_name = str(self.llm.model_name).lower()
             if 'claude' in model_name and '4-5' not in model_name:
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
        except (json.JSONDecodeError, IndexError):
            raise ValueError(f"Failed to parse JSON response: {response.content}")
        
        # Calculate overall band (average, rounded to 0.5)
        scores = [s["band"] for s in result["criterion_scores"]]
        avg = sum(scores) / len(scores)
        overall = round(avg * 2) / 2  # Round to nearest 0.5
        result["overall_band"] = overall
        
        # Calculate band_range (±0.5 from overall)
        result["band_range"] = {
            "low": max(0.0, overall - 0.5),
            "high": min(9.0, overall + 0.5)
        }
        
        # Calculate word_count_ok based on task type
        word_count = result.get("word_count", 0)
        min_words = 150 if task_type == TaskType.TASK1 else 250
        result["word_count_ok"] = word_count >= min_words
        
        # Keep word_count_penalty for backward compatibility
        result["word_count_penalty"] = not result["word_count_ok"]
        
        return ExaminerEvaluation(**result)
