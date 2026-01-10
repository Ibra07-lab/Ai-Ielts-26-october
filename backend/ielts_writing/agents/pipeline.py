from ..models import (
    EvaluateRequest,
    WritingFeedbackResponse,
    WritingFeedbackWithTeacherReport,
    ExaminerEvaluation,
    TutorFeedback,
    ErrorPattern
)
from ..teacher_report_models import TeacherFeedbackReport
from .examiner import ExaminerAgent
from .tutor import TutorAgent
from .teacher_report_agent import TeacherReportAgent
from ..memory.error_patterns import ErrorPatternMemory


class WritingPipeline:
    """Orchestrates Examiner → Tutor pipeline with error memory."""
    
    def __init__(self):
        self.examiner = ExaminerAgent()
        self.tutor = TutorAgent()
        self.teacher_report = TeacherReportAgent()
        self.memory = ErrorPatternMemory()
    
    async def evaluate(
        self,
        request: EvaluateRequest
    ) -> WritingFeedbackResponse:
        """Run the full evaluation pipeline."""
        try:
            # Step 1: Get error history if user is known
            error_history = None
            recurring_errors = []
            if request.user_id:
                # Assuming memory operations are async
                error_history = await self.memory.get_user_patterns(
                    request.user_id
                )
                recurring_errors = error_history or []
            
            # Step 2: Examiner scores the essay (strict, no advice)
            evaluation = await self.examiner.evaluate(
                task_type=request.task_type,
                question=request.question,
                essay=request.essay
            )
            
            # Step 3: Tutor provides coaching (based on immutable evaluation)
            coaching = await self.tutor.coach(
                question=request.question,
                essay=request.essay,
                evaluation=evaluation,
                target_band=request.target_band,
                error_history=[e.model_dump() for e in recurring_errors] if recurring_errors else None
            )
            
            # Step 4: Update error memory
            personalized_tip = None
            if request.user_id:
                # Extract new error patterns from evaluation
                new_patterns = self._extract_error_patterns(
                    evaluation, coaching
                )
                await self.memory.update_patterns(
                    request.user_id, new_patterns
                )
                
                # Generate personalized tip based on recurring errors
                personalized_tip = self._generate_personalized_tip(
                    recurring_errors, coaching
                )
            
            return WritingFeedbackResponse(
                evaluation=evaluation,
                coaching=coaching,
                recurring_errors=recurring_errors,
                personalized_tip=personalized_tip
            )
        except Exception as e:
            import traceback
            with open("pipeline_error.log", "a", encoding="utf-8") as f:
                f.write(f"\n--- PIPELINE ERROR ---")
                f.write(traceback.format_exc())
            raise e
    
    async def evaluate_with_teacher_report(
        self,
        request: EvaluateRequest
    ) -> WritingFeedbackWithTeacherReport:
        """
        Run the full evaluation pipeline including teacher report.
        Requires student_name in request.
        """
        
        # Run standard evaluation first
        standard_feedback = await self.evaluate(request)
        
        # Step 4: Final Synthesis (Teacher 3)
        teacher_report = None
        if request.student_name:
            # Teacher 3 (Head Teacher) receives reports from Teacher 1 and Teacher 2
            teacher_report = await self.teacher_report.generate_report(
                student_name=request.student_name,
                task_type=request.task_type,
                question=request.question,
                essay=request.essay,
                evaluation=standard_feedback.evaluation, # From Teacher 1
                coaching=standard_feedback.coaching      # From Teacher 2
            )
        
        return WritingFeedbackWithTeacherReport(
            evaluation=standard_feedback.evaluation,
            coaching=standard_feedback.coaching,
            recurring_errors=standard_feedback.recurring_errors,
            personalized_tip=standard_feedback.personalized_tip,
            teacher_report=teacher_report
        )
    
    def _extract_error_patterns(
        self,
        evaluation: ExaminerEvaluation,
        coaching: TutorFeedback
    ) -> list[dict]:
        """Extract error patterns from feedback."""
        patterns = []
        
        # Extract from rewrites
        for rewrite in coaching.rewrites:
            pattern_type = self._classify_error(rewrite.explanation)
            if pattern_type:
                patterns.append({
                    "pattern_type": pattern_type,
                    "example": rewrite.original
                })
        
        # Extract from weak criteria
        for gap in coaching.band_gaps:
            if gap.gap >= 1.0:  # Significant gap
                patterns.append({
                    "pattern_type": f"weak_{gap.criterion.value}",
                    "example": f"Band {gap.current_band} in {gap.criterion.value}"
                })
        
        return patterns
    
    def _classify_error(self, explanation: str) -> str | None:
        """Classify error type from explanation."""
        explanation_lower = explanation.lower()
        
        if any(w in explanation_lower for w in ["article", "a/an", "the"]):
            return "articles"
        if any(w in explanation_lower for w in ["tense", "verb form", "past", "present"]):
            return "verb_tense"
        if any(w in explanation_lower for w in ["vocabulary", "word choice", "synonym"]):
            return "weak_vocabulary"
        if any(w in explanation_lower for w in ["comma", "punctuation", "period"]):
            return "punctuation"
        if any(w in explanation_lower for w in ["coherence", "linking", "transition"]):
            return "coherence"
        if any(w in explanation_lower for w in ["thesis", "position", "opinion"]):
            return "task_response"
        
        return None
    
    def _generate_personalized_tip(
        self,
        recurring_errors: list[ErrorPattern],
        coaching: TutorFeedback
    ) -> str | None:
        """Generate tip based on recurring errors."""
        if not recurring_errors:
            return None
        
        # Find most frequent error
        most_frequent = max(recurring_errors, key=lambda e: e.frequency)
        
        if most_frequent.frequency >= 3:
            return (
                f"⚠️ You've made '{most_frequent.pattern_type}' errors in "
                f"{most_frequent.frequency} submissions. This should be your #1 focus."
            )
        
        return None


# Singleton
_pipeline: WritingPipeline | None = None


def get_pipeline() -> WritingPipeline:
    global _pipeline
    if _pipeline is None:
        _pipeline = WritingPipeline()
    return _pipeline
