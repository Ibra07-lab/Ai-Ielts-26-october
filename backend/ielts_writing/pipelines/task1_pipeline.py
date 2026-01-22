"""
Task 1 Pipeline - FIXED TIMEOUT VERSION

Key changes:
1. Examiner runs first, returns immediately
2. Teacher runs with strict timeout
3. If teacher times out, examiner results still returned
"""

import logging
import asyncio
from typing import Optional, List, Dict, Any
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeout

from ..agents.examiner.task1_examiner import Task1Examiner
from ..agents.teacher.task1_teacher import Task1Teacher
from ..agents.explanation_agent import Task1ExplanationAgent
from ..schemas.task1_teacher import Task1TeacherFeedbackRequest

logger = logging.getLogger(__name__)

# Thread pool for running sync code
executor = ThreadPoolExecutor(max_workers=4)


class Task1Pipeline:
    """
    Task 1 evaluation pipeline with timeout protection.
    
    Strategy:
    1. Examiner first (fast, 10-15s)
    2. Teacher second (slower, 30-45s max)
    3. If teacher fails, return examiner results only
    """
    
    # Timeout configuration
    EXAMINER_TIMEOUT = 30.0      # 30 seconds for examiner
    EXPLANATION_TIMEOUT = 90.0   # 90s for all 4 criterion explanations
    TEACHER_TIMEOUT = 60.0       # 60s for multimodal teacher feedback
    TOTAL_TIMEOUT = 160.0        # Increased safety net
    
    def __init__(self, model: str = None):
        self.examiner = Task1Examiner(model=model)
        self.explanation_agent = Task1ExplanationAgent()
        self.teacher = Task1Teacher(model=model)
        self.model = model
    
    async def evaluate_async(
        self,
        essay: str,
        question: str,
        student_name: str = "Student",
        chart_type: str = None,
        image_url: str = None,
        previous_errors: List[str] = None,
        attempt_number: int = 1,
        include_teacher_feedback: bool = True,
        return_markdown: bool = True
    ) -> Dict[str, Any]:
        """
        Async evaluation with proper timeout handling.
        """
        
        logger.info(f"[Task1Pipeline] Starting async evaluation for {student_name}")
        
        result = {
            "success": True,
            "task_type": "task1",
            "student_name": student_name,
            "chart_type": chart_type,
            "word_count": len(essay.split()),
            "timing": {}
        }
        
        try:
            # ============== STEP 1: EXAMINER (with timeout) ==============
            logger.info("[Task1Pipeline] Running examiner...")
            examiner_start = asyncio.get_event_loop().time()
            
            try:
                # examiner.evaluate() is async, so await it directly
                examiner_result = await asyncio.wait_for(
                    self.examiner.evaluate(
                        essay=essay,
                        question=question,
                        image_url=image_url,
                        chart_type=chart_type
                    ),
                    timeout=self.EXAMINER_TIMEOUT
                )
                
                examiner_time = asyncio.get_event_loop().time() - examiner_start
                result["timing"]["examiner"] = round(examiner_time, 2)
                logger.info(f"[Task1Pipeline] Examiner complete in {examiner_time:.1f}s")
                
            except asyncio.TimeoutError:
                logger.error(f"[Task1Pipeline] Examiner timed out after {self.EXAMINER_TIMEOUT}s")
                return {
                    "success": False,
                    "error": "Examiner timed out. Please try again.",
                    "task_type": "task1",
                    "student_name": student_name
                }
            
            # Store examiner results
            result["examiner_result"] = examiner_result
            result["scores"] = {
                "overall_band": examiner_result.get("overall_band"),
                "band_range": examiner_result.get("band_range"),
                "criterion_scores": examiner_result.get("criterion_scores")
            }
            result["analysis"] = {
                "word_count_ok": examiner_result.get("word_count_ok"),
                "overview_present": examiner_result.get("overview_present"),
                "overview_quality": examiner_result.get("overview_quality"),
                "data_accuracy": examiner_result.get("data_accuracy"),
                "red_flags": examiner_result.get("red_flags", [])
            }
            
            # ============== STEP 2: EXPLANATIONS (concise criterion feedback) ==============
            logger.info("[Task1Pipeline] Generating criterion explanations...")
            explanation_start = asyncio.get_event_loop().time()
            
            try:
                explanations = await asyncio.wait_for(
                    asyncio.get_event_loop().run_in_executor(
                        executor,
                        lambda: self.explanation_agent.generate_explanations(
                            essay=essay,
                            question=question,
                            examiner_scores=examiner_result,
                            visual_description=examiner_result.get("visual_description")
                        )
                    ),
                    timeout=self.EXPLANATION_TIMEOUT
                )
                
                explanation_time = asyncio.get_event_loop().time() - explanation_start
                result["timing"]["explanations"] = round(explanation_time, 2)
                logger.info(f"[Task1Pipeline] Explanations complete in {explanation_time:.1f}s")
                
                # Store explanations
                result["explanations"] = explanations.model_dump()
                result["explanations_status"] = "complete"
                
            except asyncio.TimeoutError:
                explanation_time = asyncio.get_event_loop().time() - explanation_start
                logger.warning(f"[Task1Pipeline] Explanations timed out after {explanation_time:.1f}s")
                
                result["explanations"] = None
                result["explanations_status"] = "timeout"
                result["timing"]["explanations"] = round(explanation_time, 2)
                
            except Exception as e:
                logger.error(f"[Task1Pipeline] Explanation error: {e}")
                
                result["explanations"] = None
                result["explanations_status"] = "error"
                result["explanations_message"] = str(e)
            
            # ============== STEP 3: TEACHER (optional, with timeout) ==============
            if include_teacher_feedback:
                logger.info("[Task1Pipeline] Running teacher...")
                teacher_start = asyncio.get_event_loop().time()
                
                teacher_request = Task1TeacherFeedbackRequest(
                    student_name=student_name,
                    essay=essay,
                    question=question,
                    chart_type=chart_type,
                    image_url=image_url,
                    previous_errors=previous_errors,
                    attempt_number=attempt_number,
                    examiner_scores=examiner_result
                )
                
                try:
                    teacher_feedback = await asyncio.wait_for(
                        asyncio.get_event_loop().run_in_executor(
                            executor,
                            lambda: self.teacher.generate_feedback(teacher_request)
                        ),
                        timeout=self.TEACHER_TIMEOUT
                    )
                    
                    teacher_time = asyncio.get_event_loop().time() - teacher_start
                    result["timing"]["teacher"] = round(teacher_time, 2)
                    logger.info(f"[Task1Pipeline] Teacher complete in {teacher_time:.1f}s")
                    
                    # Check if this is a fallback response (contains error messages)
                    feedback_dict = teacher_feedback.model_dump()
                    is_fallback = False
                    error_message = None
                    
                    # Check if any criterion has the fallback error messages
                    for criterion_key in ["task_achievement", "coherence_cohesion", "lexical_resource", "grammatical_range"]:
                        criterion = feedback_dict.get(criterion_key, {})
                        score_explanation = criterion.get("score_explanation", {})
                        if score_explanation.get("why_this_score") == "Unable to generate feedback due to system error.":
                            is_fallback = True
                            # Extract error from action_plan if available
                            action_plan = feedback_dict.get("action_plan", {})
                            priority_reason = action_plan.get("priority_reason", "")
                            if "Feedback generation failed:" in priority_reason:
                                error_message = priority_reason.split("Feedback generation failed:")[-1].strip()
                            break
                    
                    if is_fallback:
                        logger.warning(f"[Task1Pipeline] Teacher returned fallback response: {error_message}")
                        result["teacher_feedback"] = None
                        result["teacher_feedback_status"] = "error"
                        result["teacher_feedback_message"] = error_message or "Feedback generation failed. Please check your OpenRouter API key and try again."
                    else:
                        result["teacher_feedback"] = feedback_dict
                        result["teacher_feedback_status"] = "complete"
                        
                        if return_markdown:
                            result["feedback_markdown"] = self.teacher.format_as_markdown(teacher_feedback)
                    
                except asyncio.TimeoutError:
                    teacher_time = asyncio.get_event_loop().time() - teacher_start
                    logger.warning(f"[Task1Pipeline] Teacher timed out after {teacher_time:.1f}s")
                    
                    result["teacher_feedback"] = None
                    result["teacher_feedback_status"] = "timeout"
                    result["teacher_feedback_message"] = "Detailed feedback timed out. Examiner scores are available."
                    result["timing"]["teacher"] = round(teacher_time, 2)
                    
                except Exception as e:
                    logger.error(f"[Task1Pipeline] Teacher error: {e}")
                    
                    result["teacher_feedback"] = None
                    result["teacher_feedback_status"] = "error"
                    result["teacher_feedback_message"] = str(e)
            
            logger.info(f"[Task1Pipeline] Complete. Overall: {result['scores']['overall_band']}")
            return result
            
        except Exception as e:
            logger.error(f"[Task1Pipeline] Pipeline error: {e}")
            return {
                "success": False,
                "error": str(e),
                "task_type": "task1",
                "student_name": student_name
            }
    
    def evaluate(
        self,
        essay: str,
        question: str,
        student_name: str = "Student",
        chart_type: str = None,
        image_url: str = None,
        previous_errors: List[str] = None,
        attempt_number: int = 1,
        include_teacher_feedback: bool = True,
        return_markdown: bool = True
    ) -> Dict[str, Any]:
        """
        Sync wrapper for evaluate_async.
        """
        
        # Create new event loop if needed
        try:
            loop = asyncio.get_event_loop()
            if loop.is_closed():
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        
        return loop.run_until_complete(
            self.evaluate_async(
                essay=essay,
                question=question,
                student_name=student_name,
                chart_type=chart_type,
                image_url=image_url,
                previous_errors=previous_errors,
                attempt_number=attempt_number,
                include_teacher_feedback=include_teacher_feedback,
                return_markdown=return_markdown
            )
        )
    
    async def evaluate_examiner_only(
        self,
        essay: str,
        question: str,
        chart_type: str = None,
        image_url: str = None
    ) -> Dict[str, Any]:
        """
        Fast evaluation - examiner only, no teacher feedback.
        Use for quick checks (10-15 seconds).
        """
        
        logger.info("[Task1Pipeline] Running examiner-only evaluation")
        
        try:
            # examiner.evaluate() is async, so await it directly
            result = await asyncio.wait_for(
                self.examiner.evaluate(
                    essay=essay,
                    question=question,
                    image_url=image_url,
                    chart_type=chart_type
                ),
                timeout=self.EXAMINER_TIMEOUT
            )
            
            return {
                "success": True,
                "task_type": "task1",
                "scores": result,
                "teacher_feedback_status": "not_requested"
            }
            
        except asyncio.TimeoutError:
            logger.error("[Task1Pipeline] Examiner timed out")
            return {
                "success": False,
                "error": "Examiner timed out",
                "task_type": "task1"
            }
        except Exception as e:
            logger.error(f"[Task1Pipeline] Examiner error: {e}", exc_info=True)
            return {
                "success": False,
                "error": str(e),
                "task_type": "task1"
            }