"""
Task 2 Pipeline — The Conductor

Orchestrates all three Task 2 agents in sequence:
1. Examiner (Agent 1): Scores the essay → IELTSEvaluation
2. Explainer (Agent 2): Generates feedback → ExplainerOutput
3. Coach (Agent 3): Creates action plan → CoachOutput

Usage:
    pipeline = Task2Pipeline()
    result = pipeline.evaluate_essay(essay, question)
    
    # Access results
    print(result["evaluation"].band_scores.overall)
    print(result["explanation"].priority_summary[0].area)
    print(result["coaching"].the_one_big_change.change_statement)
"""

from __future__ import annotations

from typing import TypedDict

from ielts_writing.schemas.task2 import IELTSEvaluation
from ielts_writing.schemas.task2_explainer import ExplainerOutput
from ielts_writing.schemas.task2_coach import CoachOutput

from .agents.examiner.task2_examiner import Task2Examiner
from .agents.explainer.task2_explainer import Task2Explainer
from .agents.coach.task2_coach import Task2Coach


class PipelineResult(TypedDict):
    """Type hint for pipeline output."""
    evaluation: IELTSEvaluation
    explanation: ExplainerOutput
    coaching: CoachOutput


class Task2Pipeline:
    """
    Complete Task 2 evaluation pipeline.
    
    Runs three agents in sequence to provide:
    - Strict, evidence-based scoring (Examiner)
    - Actionable corrections and rewrites (Explainer)
    - Focused coaching with "One Big Change" (Coach)
    """

    def __init__(self, model: str | None = None):
        """Initialize all three agents.
        
        Args:
            model: Optional model override for all agents.
        """
        self.examiner = Task2Examiner(model=model)
        self.explainer = Task2Explainer(model=model)
        self.coach = Task2Coach(model=model)

    def evaluate_essay(self, essay: str, question: str) -> PipelineResult:
        """
        Run the complete evaluation pipeline.
        
        Args:
            essay: The student's essay text
            question: The essay prompt/question
            
        Returns:
            dict with 'evaluation', 'explanation', and 'coaching' keys
        """
        # 1. Evaluate (Strict Scoring)
        print("🔍 1. Running Examiner...")
        evaluation = self.examiner.evaluate(essay, question)
        eval_dict = evaluation.model_dump()
        print(f"   → Overall Band: {evaluation.band_scores.overall}")

        # 2. Explain (Edits & Rewrites)
        print("📝 2. Running Explainer...")
        explanation = self.explainer.explain(essay, question, eval_dict)
        explainer_dict = explanation.model_dump()
        print(f"   → Top Priority: {explanation.priority_summary[0].area if explanation.priority_summary else 'N/A'}")

        # 3. Coach (Action Plan)
        print("🎯 3. Running Coach...")
        coaching = self.coach.generate_plan(
            examiner_data=eval_dict, 
            explainer_data=explainer_dict,
            essay=essay,
            question=question
        )
        print(f"   → Focus: {coaching.the_one_big_change.visual_reminder}")

        print("✅ Pipeline complete!")

        return {
            "evaluation": evaluation,
            "explanation": explanation,
            "coaching": coaching
        }

    def evaluate_essay_dict(self, essay: str, question: str) -> dict:
        """
        Run pipeline and return all results as dicts.
        
        Useful for JSON serialization.
        """
        result = self.evaluate_essay(essay, question)
        return {
            "evaluation": result["evaluation"].model_dump(),
            "explanation": result["explanation"].model_dump(),
            "coaching": result["coaching"].model_dump(),
        }

    def get_summary(self, result: PipelineResult) -> dict:
        """
        Extract a quick summary from pipeline results.
        
        Args:
            result: Output from evaluate_essay()
            
        Returns:
            dict with key metrics for UI display
        """
        evaluation = result["evaluation"]
        explanation = result["explanation"]
        coaching = result["coaching"]
        
        return {
            # Scores
            "overall_band": evaluation.band_scores.overall,
            "task_response": evaluation.band_scores.task_response,
            "coherence_cohesion": evaluation.band_scores.coherence_cohesion,
            "lexical_resource": evaluation.band_scores.lexical_resource,
            "grammatical_range": evaluation.band_scores.grammatical_range_accuracy,
            
            # Key issues
            "fatal_flaws": evaluation.fatal_flaws,
            "root_cause": coaching.root_cause_analysis.root_cause_type.value,
            
            # The One Big Change
            "one_big_change": coaching.the_one_big_change.change_statement,
            "visual_reminder": coaching.the_one_big_change.visual_reminder,
            
            # Drill
            "drill_name": coaching.micro_drill.drill_name,
            "drill_time": coaching.micro_drill.time_limit_minutes,
            
            # Projection
            "target_band": coaching.score_context.realistic_next_target,
            "if_changed": coaching.score_context.if_change_implemented,
            
            # Counts
            "macro_rewrites": len(explanation.macro_feedback),
            "micro_fixes": len(explanation.micro_feedback),
            "banned_items": len(coaching.pattern_breaker.banned_list),
        }


# ============================================================
# CONVENIENCE FUNCTION
# ============================================================

def run_task2_pipeline(essay: str, question: str, model: str | None = None) -> PipelineResult:
    """
    Quick function to run the complete Task 2 pipeline.
    
    Args:
        essay: The student's essay
        question: The essay prompt
        model: Optional model override
        
    Returns:
        PipelineResult with evaluation, explanation, and coaching
    """
    pipeline = Task2Pipeline(model=model)
    return pipeline.evaluate_essay(essay, question)
