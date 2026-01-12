import json
import os
from datetime import datetime
from typing import List, Optional
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

from ..models import TutorFeedback, ExaminerEvaluation, BandGap, Criterion
from ..prompts.tutor import TUTOR_SYSTEM_PROMPT, build_tutor_prompt


from .llm_factory import get_chat_model, add_cache_tag

class TutorAgent:
    """Coaching agent — provides actionable improvement steps."""
    
    def __init__(self, model: str = None):
        # Default to environment variable or fallback to Claude Sonnet 4.5
        model_name = model or os.getenv("IELTS_WRITING_MODEL", "claude-sonnet-4-5-20250929")
        
        self.llm = get_chat_model(
            model_name=model_name,
            temperature=0.4,  # Slightly higher for creative coaching
            max_tokens=8192  # Increased to prevent truncation
        )
    
    async def coach(
        self,
        question: str,
        essay: str,
        evaluation: ExaminerEvaluation,
        target_band: float = 7.0,
        error_history: list[dict] | None = None
    ) -> TutorFeedback:
        """Generate coaching feedback based on examiner's evaluation."""
        
        # Convert evaluation to dict for prompt
        eval_dict = evaluation.model_dump()
        
        user_prompt = build_tutor_prompt(
            question=question,
            essay=essay,
            examiner_evaluation=eval_dict,
            target_band=target_band,
            error_history=error_history
        )
        
        system_msg = SystemMessage(content=TUTOR_SYSTEM_PROMPT)
        
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
        
        content = response.content.strip()
        try:
            # Handle potential markdown fencing or extra text
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
            # Enhanced logging for debugging
            with open("tutor_debug.log", "a", encoding="utf-8") as f:
                f.write(f"\n{'='*50}\n")
                f.write(f"FAILED JSON PARSE at {datetime.now()}\n")
                f.write(f"{'='*50}\n")
                f.write(f"Error: {str(e)}\n")
                f.write(f"Content length: {len(response.content)} chars\n")
                f.write(f"Content preview (first 500 chars):\n{response.content[:500]}\n")
                f.write(f"Content end (last 500 chars):\n{response.content[-500:]}\n")
                
                # Detect truncation
                if "Expecting" in str(e) and len(response.content) > 5000:
                    f.write("\n⚠️  LIKELY TRUNCATION - Response seems incomplete\n")
                    f.write("   → Solution: Increase max_tokens in tutor.py\n")
                f.write(f"{'='*50}\n\n")
            
            raise ValueError(
                f"Failed to parse JSON response. "
                f"Error: {str(e)}. "
                f"Content length: {len(response.content)}. "
                f"Check tutor_debug.log for full details."
            )
        
        # Ensure band gaps are calculated correctly
        result["target_band"] = target_band
        if "band_gaps" not in result or not result["band_gaps"]:
            result["band_gaps"] = self._calculate_band_gaps(
                evaluation, target_band
            )
        
        # Ensure all required list fields exist (safety net)
        list_fields = [
            "action_plan", "strengths", "weaknesses", 
            "grammar_errors", "vocabulary_suggestions", "coherence_issues",
            "band_gaps", "rewrites", "micro_tasks"
        ]
        for field in list_fields:
            if field not in result:
                result[field] = []
        
        # Fix micro_tasks that use 'task' instead of 'instruction'
        import re
        for mt in result.get("micro_tasks", []):
            # Handle 'task' field as fallback for 'instruction'
            if "task" in mt and not mt.get("instruction"):
                mt["instruction"] = mt.pop("task")
            
            # Handle duration strings like "10-15 minutes"
            if "duration" in mt and "duration_minutes" not in mt:
                duration_str = mt.pop("duration")
                # Extract first number from "10-15 minutes" or "15 minutes"
                numbers = re.findall(r'\d+', str(duration_str))
                mt["duration_minutes"] = int(numbers[0]) if numbers else 15
            
            # Ensure required fields have defaults
            mt.setdefault("title", "Practice Task")
            mt.setdefault("duration_minutes", 15)
            mt.setdefault("instruction", "")
            mt.setdefault("example", "")
        
        return TutorFeedback(**result)
    
    def _calculate_band_gaps(
        self,
        evaluation: ExaminerEvaluation,
        target_band: float
    ) -> list[dict]:
        """Calculate band gaps for each criterion."""
        gaps = []
        for score in evaluation.criterion_scores:
            gap = target_band - score.band
            if gap > 0:
                gaps.append({
                    "criterion": score.criterion,
                    "current_band": score.band,
                    "target_band": target_band,
                    "gap": gap,
                    "specific_gaps": []  # Tutor will fill these
                })
        
        # Sort by largest gap first
        gaps.sort(key=lambda x: x["gap"], reverse=True)
        return gaps
