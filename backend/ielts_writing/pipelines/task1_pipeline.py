"""
Complete pipeline for Task 1 evaluation and feedback.
"""

import logging
import asyncio
from typing import Optional, List, Dict, Any

from ..agents.examiner.task1_examiner import Task1Examiner
from ..agents.teacher.task1_teacher import Task1Teacher
from ..schemas.task1_teacher import Task1TeacherFeedbackRequest

logger = logging.getLogger(__name__)


class Task1Pipeline:
    """
    Complete evaluation pipeline for IELTS Writing Task 1.
    
    Combines:
    - Task1Examiner for strict IELTS scoring
    - Task1Teacher for personalized feedback
    """
    
    def __init__(self, model: str = None):
        self.examiner = Task1Examiner(model=model)
        self.teacher = Task1Teacher(model=model)
        self.model = model
    
    async def evaluate(
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
        Full Task 1 evaluation with examiner scoring and teacher feedback.
        
        Args:
            essay: Student's essay describing the visual data
            question: The Task 1 question/prompt
            student_name: Student's name for personalization
            chart_type: Type of visual (line, bar, pie, table, map, process)
            image_url: URL to chart image (for vision models)
            previous_errors: Error patterns from previous essays
            attempt_number: Which attempt this is
            include_teacher_feedback: Whether to generate teacher feedback
            return_markdown: Include markdown-formatted feedback
            
        Returns:
            Complete evaluation results
        """
        
        logger.info(f"[Task1Pipeline] Starting evaluation for {student_name}")
        logger.info(f"[Task1Pipeline] Chart type: {chart_type}")
        logger.info(f"[Task1Pipeline] Essay length: {len(essay.split())} words")
        
        result = {
            "success": True,
            "task_type": "task1",
            "student_name": student_name,
            "chart_type": chart_type,
            "word_count": len(essay.split())
        }
        
        try:
            # ============== STEP 1: EXAMINER SCORING ==============
            logger.info("[Task1Pipeline] Running Task 1 Examiner...")
            
            examiner_result = await self.examiner.evaluate(
                essay=essay,
                question=question,
                image_url=image_url,
                chart_type=chart_type
            )
            
            result["examiner_result"] = examiner_result
            result["scores"] = {
                "overall_band": examiner_result.get("overall_band"),
                "band_range": examiner_result.get("band_range"),
                "criterion_scores": examiner_result.get("criterion_scores")
            }
            result["analysis"] = {
                "word_count_ok": examiner_result.get("word_count_ok"),
                "word_count_penalty": examiner_result.get("word_count_penalty"),
                "overview_present": examiner_result.get("overview_present"),
                "overview_quality": examiner_result.get("overview_quality"),
                "data_accuracy": examiner_result.get("data_accuracy"),
                "key_features_covered": examiner_result.get("key_features_covered"),
                "red_flags": examiner_result.get("red_flags", [])
            }
            
            logger.info(f"[Task1Pipeline] Examiner score: {result['scores']['overall_band']}")
            
            # ============== STEP 2: TEACHER FEEDBACK ==============
            if include_teacher_feedback:
                logger.info("[Task1Pipeline] Running Task 1 Teacher...")
                
                try:
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
                    
                    # Set 35-second timeout (5s buffer over teacher's 30s)
                    teacher_feedback = await asyncio.wait_for(
                        asyncio.to_thread(self.teacher.generate_feedback, teacher_request),
                        timeout=35.0
                    )
                    result["teacher_feedback"] = teacher_feedback.model_dump()
                    
                    if return_markdown:
                        result["feedback_markdown"] = self.teacher.format_as_markdown(
                            teacher_feedback
                        )
                    
                    logger.info("[Task1Pipeline] Teacher feedback generated")
                    
                except asyncio.TimeoutError:
                    logger.warning("[Task1Pipeline] Teacher feedback timed out after 35s, returning examiner only")
                    result["teacher_feedback"] = {
                        "overall_message": "Analysis complete. Detailed feedback unavailable due to timeout.",
                        "strengths": [],
                        "grammar_errors": [],
                        "vocabulary_suggestions": [],
                        "coherence_issues": [],
                        "next_steps": [],
                        "student_name": student_name,
                        "task_type": "task1",
                        "chart_type": chart_type,
                        "word_count": len(essay.split()),
                        "attempt_number": attempt_number
                    }
                    
                except Exception as e:
                    logger.error(f"[Task1Pipeline] Teacher error: {e}")
                    # Return partial result with examiner only
                    result["teacher_feedback"] = {
                        "overall_message": f"Error generating detailed feedback: {str(e)}",
                        "strengths": [],
                        "grammar_errors": [],
                        "vocabulary_suggestions": [],
                        "coherence_issues": [],
                        "next_steps": [],
                        "student_name": student_name,
                        "task_type": "task1",
                        "chart_type": chart_type,
                        "word_count": len(essay.split()),
                        "attempt_number": attempt_number
                    }
            
            logger.info(f"[Task1Pipeline] Complete. Overall band: {result['scores']['overall_band']}")
            return result
            
        except Exception as e:
            logger.error(f"[Task1Pipeline] Error: {e}")
            return {
                "success": False,
                "error": str(e),
                "task_type": "task1",
                "student_name": student_name
            }
    
    async def quick_score(
        self,
        essay: str,
        question: str,
        chart_type: str = None,
        image_url: str = None
    ) -> Dict[str, Any]:
        """
        Quick scoring without teacher feedback.
        Faster and cheaper for batch processing or initial checks.
        
        Args:
            essay: Student's essay
            question: Task question
            chart_type: Type of chart
            image_url: Chart image URL
            
        Returns:
            Examiner scores only
        """
        return await self.examiner.evaluate(
            essay=essay,
            question=question,
            image_url=image_url,
            chart_type=chart_type
        )
    
    async def get_vocabulary_help(
        self,
        chart_type: str,
        weak_areas: List[str] = None
    ) -> Dict[str, Any]:
        """
        Get vocabulary suggestions for a specific chart type.
        
        Args:
            chart_type: Type of chart
            weak_areas: Areas where help is needed
            
        Returns:
            Vocabulary suggestions
        """
        return await asyncio.to_thread(
            self.teacher.get_vocabulary_suggestions,
            chart_type=chart_type,
            weak_areas=weak_areas
        )
