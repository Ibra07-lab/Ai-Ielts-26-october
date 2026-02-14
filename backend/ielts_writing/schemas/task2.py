"""
IELTS Task 2 Evaluation Schemas

This module defines the Pydantic models for the IELTSEvaluation output,
designed to match the deficit-scoring examiner prompt with Logic Checks A-D.
"""

import json
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from enum import Enum


# ============================================================
# ENUMS
# ============================================================

class TaskType(str, Enum):
    """Classification of IELTS Task 2 question types."""
    OPINION = "opinion"
    DISCUSSION = "discussion"
    PROBLEM_SOLUTION = "problem_solution"
    ADVANTAGES_DISADVANTAGES = "advantages_disadvantages"
    TWO_PART_QUESTION = "two_part_question"
    HYBRID = "hybrid"


class GrammarErrorType(str, Enum):
    """Classification of grammatical error patterns."""
    MINIMAL = "minimal"           # Very few errors, high accuracy
    MOSTLY_SLIPS = "mostly_slips" # Occasional errors, typically in complex structures
    SYSTEMATIC = "systematic"     # Repeated error patterns
    SEVERE = "severe"             # Errors impede meaning


class DevelopmentQuality(str, Enum):
    """Quality rating for paragraph development."""
    FULLY_DEVELOPED = "fully_developed"
    ADEQUATELY_DEVELOPED = "adequately_developed"
    UNDERDEVELOPED = "underdeveloped"
    SEVERELY_UNDERDEVELOPED = "severely_underdeveloped"
    CIRCULAR = "circular"
    OFF_TOPIC = "off_topic"


# ============================================================
# SCORE MODELS
# ============================================================

class BandScores(BaseModel):
    """Individual and overall IELTS band scores."""
    
    task_response: float = Field(
        ...,
        ge=0.0,
        le=9.0,
        description="Task Response score (0.0-9.0 in 0.5 increments)"
    )
    coherence_cohesion: float = Field(
        ...,
        ge=0.0,
        le=9.0,
        description="Coherence and Cohesion score (0.0-9.0 in 0.5 increments)"
    )
    lexical_resource: float = Field(
        ...,
        ge=0.0,
        le=9.0,
        description="Lexical Resource score (0.0-9.0 in 0.5 increments)"
    )
    grammatical_range_accuracy: float = Field(
        ...,
        ge=0.0,
        le=9.0,
        description="Grammatical Range and Accuracy score (0.0-9.0 in 0.5 increments)"
    )
    overall: float = Field(
        ...,
        ge=0.0,
        le=9.0,
        description="Overall band score (average rounded to nearest 0.5)"
    )

    @field_validator('task_response', 'coherence_cohesion', 
                     'lexical_resource', 'grammatical_range_accuracy', 'overall')
    @classmethod
    def validate_half_band(cls, v: float) -> float:
        """Ensure scores are in 0.5 increments."""
        if v % 0.5 != 0:
            raise ValueError(f"Score {v} must be in 0.5 increments")
        return v


class ScoreCap(BaseModel):
    """Documentation of a score cap that was applied."""
    
    criterion: str = Field(
        ...,
        description="Which criterion was capped (TR, CC, LR, GRA)"
    )
    cap_value: float = Field(
        ...,
        description="The maximum score allowed"
    )
    reason: str = Field(
        ...,
        description="Why the cap was applied"
    )
    evidence: str = Field(
        ...,
        description="Specific evidence from the essay justifying the cap"
    )


# ============================================================
# LOGIC CHECK A: THESIS ANALYSIS
# ============================================================

class ThesisAnalysis(BaseModel):
    """Analysis of the essay's thesis statement."""
    
    thesis_found: bool = Field(
        ...,
        description="Whether a clear thesis statement was identified"
    )
    thesis_statement: Optional[str] = Field(
        None,
        description="The extracted thesis statement, if found"
    )
    thesis_quality: str = Field(
        ...,
        description="Assessment: 'clear_and_specific', 'vague', 'missing', 'merely_restates_prompt'"
    )
    position_maintained: bool = Field(
        ...,
        description="Whether the position is consistent throughout the essay"
    )


# ============================================================
# LOGIC CHECK B: LINKER AUDIT
# ============================================================

class LinkerAudit(BaseModel):
    """Results of the mechanical linker density analysis."""
    
    total_sentences: int = Field(
        ...,
        ge=0,
        description="Total number of sentences in the essay"
    )
    mechanical_linker_count: int = Field(
        ...,
        ge=0,
        description="Number of sentences starting with mechanical linkers"
    )
    mechanical_linker_ratio: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Ratio of mechanical linker sentences to total sentences"
    )
    mechanical_linkers_found: List[str] = Field(
        default_factory=list,
        description="List of mechanical linkers found at sentence starts"
    )
    referencing_devices_used: List[str] = Field(
        default_factory=list,
        description="Examples of good referencing devices used (this, such, etc.)"
    )
    cohesion_verdict: str = Field(
        ...,
        description="'natural', 'adequate', 'mechanical', 'severely_mechanical'"
    )


# ============================================================
# LOGIC CHECK C: CLICHE AUDIT
# ============================================================

class ClicheAudit(BaseModel):
    """Results of the memorized phrase detection."""
    
    tier1_cliches: List[str] = Field(
        default_factory=list,
        description="Severe memorized phrases found (Tier 1)"
    )
    tier2_cliches: List[str] = Field(
        default_factory=list,
        description="Formulaic/empty phrases found (Tier 2)"
    )
    total_cliche_count: int = Field(
        ...,
        ge=0,
        description="Total count of clichés detected"
    )
    lexical_penalty_applied: Optional[float] = Field(
        default=0.0,
        ge=0.0,
        description="Points deducted from LR due to clichés",
        alias="penalty_points"
    )
    memorized_language_verdict: str = Field(
        ...,
        description="'none', 'minimal', 'moderate', 'excessive'"
    )


# ============================================================
# LOGIC CHECK D: GRAMMAR AUDIT
# ============================================================

class GrammarAudit(BaseModel):
    """Results of the grammatical error classification."""
    
    error_type: str = Field(
        ...,
        description="Overall classification of error patterns"
    )
    systematic_errors_identified: List[str] = Field(
        default_factory=list,
        description="Patterns of repeated errors (e.g., 'subject-verb agreement', 'article usage')"
    )
    error_examples: List[str] = Field(
        default_factory=list,
        description="Specific examples of errors found in the essay"
    )
    complex_structures_attempted: bool = Field(
        ...,
        description="Whether the essay attempts complex grammatical structures"
    )
    sentence_variety: str = Field(
        ...,
        description="'excellent', 'good', 'limited', 'very_limited'"
    )


# ============================================================
# PARAGRAPH ANALYSIS
# ============================================================

class ParagraphBreakdown(BaseModel):
    """Analysis of an individual paragraph."""
    
    paragraph_number: int = Field(
        ...,
        ge=1,
        description="Paragraph number (1-indexed)"
    )
    paragraph_type: str = Field(
        ...,
        description="'introduction', 'body', 'conclusion'"
    )
    word_count: Optional[int] = Field(
        default=None,
        ge=0,
        description="Number of words in this paragraph"
    )
    main_idea: Optional[str] = Field(
        default=None,
        description="The central idea/topic of this paragraph"
    )
    function: Optional[str] = Field(
        default=None,
        description="What this paragraph does - e.g., 'States thesis'"
    )
    topic_sentence_present: Optional[bool] = Field(
        default=None,
        description="Whether a clear topic sentence exists"
    )
    topic_sentence_quality: Optional[str] = Field(
        default=None,
        description="'clear', 'weak', 'missing'"
    )
    supporting_details: Optional[str] = Field(
        default=None,
        description="Summary of supporting evidence/examples provided"
    )
    development_quality: Optional[str] = Field(
        default=None,
        description="Assessment of how well the paragraph develops its idea"
    )
    issues_identified: List[str] = Field(
        default_factory=list,
        description="Specific problems found in this paragraph"
    )


# ============================================================
# COMBINED ANALYSIS
# ============================================================

class Analysis(BaseModel):
    """Comprehensive analysis container for all Logic Checks."""
    
    # Basic metrics
    word_count: int = Field(
        ...,
        ge=0,
        description="Total word count of the essay"
    )
    paragraph_count: int = Field(
        ...,
        ge=0,
        description="Total number of paragraphs"
    )
    
    # Logic Check A: Task Response
    thesis_analysis: ThesisAnalysis = Field(
        ...,
        description="Results of thesis detection and analysis"
    )
    task_type_match: bool = Field(
        ...,
        description="Whether essay structure matches required task type"
    )
    circular_arguments_detected: bool = Field(
        ...,
        description="Whether circular/repetitive arguments were found"
    )
    all_parts_addressed: bool = Field(
        ...,
        description="Whether all parts of the prompt are addressed"
    )
    
    # Logic Check B: Coherence & Cohesion
    linker_audit: LinkerAudit = Field(
        ...,
        description="Results of the mechanical linker density analysis"
    )
    
    # Logic Check C: Lexical Resource
    cliche_audit: ClicheAudit = Field(
        ...,
        description="Results of memorized phrase detection"
    )
    vocabulary_range: str = Field(
        ...,
        description="'wide', 'sufficient', 'adequate', 'limited', 'very_limited'"
    )
    
    grammar_audit: GrammarAudit = Field(
        ...,
        description="Results of grammatical error classification"
    )


# ============================================================
# DETAILED FEEDBACK (FOR REPORT UI)
# ============================================================

class CriterionFeedback(BaseModel):
    """Rich feedback for a single criterion."""
    band: float
    summary: str = Field(..., description="Short verdict e.g. 'Mostly slips'")
    why_score_is_here: str = Field(..., description="Explanation of the score level")
    weak_spots: List[str] = Field(default_factory=list, description="Specific weaknesses")
    strengths: List[str] = Field(default_factory=list, description="Specific strengths")

    @field_validator("weak_spots", "strengths", mode="before")
    @classmethod
    def ensure_list(cls, v):
        if isinstance(v, str):
            return [v]
        return v


class DetailedFeedback(BaseModel):
    """Container for detailed feedback across all criteria."""
    task_response: CriterionFeedback
    coherence: CriterionFeedback
    lexical: CriterionFeedback
    grammar: CriterionFeedback


# ============================================================
# ROOT MODEL: IELTS EVALUATION
# ============================================================

class IELTSEvaluation(BaseModel):
    """
    Complete IELTS Task 2 Evaluation Output.
    
    This is the root model containing all evaluation data.
    Downstream coaching agents consume this structure.
    """
    
    # Task Classification
    prompt_analyzed: str = Field(
        ...,
        description="The original prompt that was provided"
    )
    task_type_required: str = Field(
        ...,
        description="The task type the prompt requires"
    )
    task_type_detected: str = Field(
        ...,
        description="The task type the student actually wrote"
    )
    
    # Scores
    band_scores: BandScores = Field(
        ...,
        description="All band scores (TR, CC, LR, GRA, Overall)"
    )
    
    # Critical Issues
    fatal_flaws: List[str] = Field(
        default_factory=list,
        description="List of critical issues that severely impact scoring"
    )
    score_caps_applied: List[ScoreCap] = Field(
        default_factory=list,
        description="Documentation of any score caps that were enforced"
    )
    
    # Detailed Analysis
    analysis: Analysis = Field(
        ...,
        description="Comprehensive analysis from all Logic Checks"
    )

    # Detailed Feedback (New for Reports)
    detailed_feedback: Optional[DetailedFeedback] = Field(
        None,
        description="Structured rich feedback for each criterion (Why/Weaknesses/Strengths)"
    )
    
    # Paragraph-level breakdown
    paragraph_breakdown: List[ParagraphBreakdown] = Field(
        ...,
        description="Detailed analysis of each paragraph"
    )
    
    # Justification & Recommendations
    scoring_justification: str = Field(
        ...,
        description="Detailed explanation of how scores were derived from evidence"
    )
    improvement_priorities: List[str] = Field(
        ...,
        description="Ranked list of the most important areas for improvement"
    )
    
    # Metadata
    evaluation_confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Evaluator's confidence in the assessment (0.0-1.0)"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "prompt_analyzed": "Some people believe that technology has made our lives too complex. To what extent do you agree or disagree?",
                "task_type_required": "opinion",
                "task_type_detected": "advantages_disadvantages",
                "band_scores": {
                    "task_response": 6.0,
                    "coherence_cohesion": 6.0,
                    "lexical_resource": 5.5,
                    "grammatical_range_accuracy": 6.0,
                    "overall": 6.0
                },
                "fatal_flaws": [
                    "Task Type Mismatch",
                    "Mechanical/Overused Linkers"
                ],
                "scoring_justification": "TR capped at 6.0 due to task type mismatch...",
                "improvement_priorities": [
                    "Understand prompt types and respond appropriately",
                    "Reduce mechanical linker usage",
                    "Eliminate memorized phrases"
                ],
                "evaluation_confidence": "high"
            }
        }


# ============================================================
# UTILITY FUNCTIONS
# ============================================================

def validate_evaluation(raw_json: str) -> IELTSEvaluation:
    """
    Parse and validate the LLM's output against the schema.
    Raises ValidationError if the output doesn't conform.
    """
    from pydantic import ValidationError
    
    try:
        data = json.loads(raw_json)
        evaluation = IELTSEvaluation(**data)
        return evaluation
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON: {e}")
    except ValidationError as e:
        raise ValueError(f"Schema validation failed: {e}")


def get_coaching_data(evaluation: IELTSEvaluation) -> dict:
    """
    Extract key data for downstream coaching agents.
    """
    return {
        "overall_band": evaluation.band_scores.overall,
        "weakest_criterion": min(
            [
                ("TR", evaluation.band_scores.task_response),
                ("CC", evaluation.band_scores.coherence_cohesion),
                ("LR", evaluation.band_scores.lexical_resource),
                ("GRA", evaluation.band_scores.grammatical_range_accuracy),
            ],
            key=lambda x: x[1]
        )[0],
        "fatal_flaws": evaluation.fatal_flaws,
        "top_priority": evaluation.improvement_priorities[0] if evaluation.improvement_priorities else None,
        "cliches_to_eliminate": evaluation.analysis.cliche_audit.tier1_cliches,
        "grammar_focus": evaluation.analysis.grammar_audit.systematic_errors_identified,
    }
