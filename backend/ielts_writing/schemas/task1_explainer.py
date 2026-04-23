"""
IELTS Task 1 Explainer Schemas

Task 1-specific schema with honest field names for chart/graph/process description.
Unlike Task 2 (essay arguments), Task 1 focuses on data description, trend language,
comparisons, and overview quality.

Reuses generic concepts from Task 2 where they truly are generic:
- CohesionFix (cohesion is cohesion)
- ImprovementPriority (generic ranking)
- ScoreProjection (generic projection)
"""

from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any
from enum import Enum

# Reuse genuinely generic models from Task 2
from ielts_writing.schemas.task2_explainer import (
    CohesionFix,
    ImprovementPriority,
    ScoreProjection,
)


# ============================================================================
# OVERVIEW FEEDBACK (Task 1 Specific)
# ============================================================================

class OverviewFeedback(BaseModel):
    """Feedback on the essay's overview/summary paragraph.
    
    The overview is the most critical element of Task 1 — a missing or weak
    overview caps Task Achievement at Band 5.
    """
    
    overview_present: bool = Field(
        ...,
        description="Whether an overview/summary paragraph was found"
    )
    position_correct: bool = Field(
        ...,
        description="Whether the overview is logically placed (usually directly after intro or at the absolute end)"
    )
    detected_position: Optional[str] = Field(
        default=None,
        description="Where it was placed: 'start' (after intro), 'end' (conclusion), 'buried' (hidden in body), or 'missing'"
    )
    overview_quality: str = Field(
        ...,
        description="Quality assessment: 'strong', 'adequate', 'weak', 'missing'"
    )
    original_overview: Optional[str] = Field(
        default=None,
        description="The student's original overview sentence(s), if present"
    )
    issues: List[str] = Field(
        default_factory=list,
        description="Specific problems with the overview (e.g., 'lists data instead of summarizing trends', 'buried in body paragraph')"
    )
    improved_overview: Optional[str] = Field(
        default=None,
        description="A rewritten Band 7-8 overview for this chart/data"
    )
    key_changes_made: List[str] = Field(
        default_factory=list,
        description="What was changed and why"
    )

# ============================================================================
# COHERENCE & COHESION (Task 1 Specific)
# ============================================================================

class ParagraphStructureFeedback(BaseModel):
    """Feedback on paragraphing and structural flow."""
    paragraph_count: int = Field(
        ...,
        description="Number of logical paragraphs detected"
    )
    has_clear_breaks: bool = Field(
        ...,
        description="Whether there are clear line breaks separating paragraphs"
    )
    expected_structure: List[str] = Field(
        ...,
        description="The expected structure for this specific chart type, e.g., ['Introduction', 'Overview', 'Body 1', 'Body 2']"
    )
    detected_structure: List[str] = Field(
        ...,
        description="The structure actually found in the student's essay, e.g., ['Intro + Overview', 'Body 1']"
    )
    feedback_message: str = Field(
        ...,
        description="A message explaining how to fix the structure if it's wrong"
    )

class DataGroupingFix(BaseModel):
    """Fix for scattered data points that should be grouped."""
    scattered_sentences: List[str] = Field(
        default_factory=list,
        description="List of isolated data sentences from the student"
    )
    grouped_sentence: str = Field(
        ...,
        description="A rewritten sentence combining them with comparison words (while, whereas, compared to)"
    )
    explanation: str = Field(
        ...,
        description="Why grouping these points makes the essay more cohesive"
    )

class ReferencingError(BaseModel):
    """Fix for ambiguous pronoun references."""
    original_sentence: str = Field(
        ...,
        description="The sentence with the vague pronoun"
    )
    ambiguous_pronoun: str = Field(
        ...,
        description="The specific vague word, e.g., 'it', 'they', 'this'"
    )
    corrected_sentence: str = Field(
        ...,
        description="The corrected sentence with a clear subject noun"
    )

class ConnectorAnalysis(BaseModel):
    """Analysis of linking words and mechanical connectors."""
    overused_connectors: List[str] = Field(
        default_factory=list,
        description="Connectors that are repeated too frequently (e.g., 'furthermore', 'moreover')"
    )
    cohesion_fixes: List[CohesionFix] = Field(
        default_factory=list,
        description="Specific fixes for mechanical linker overuse"
    )

class ComparisonLanguage(BaseModel):
    """Feedback on how well data points are connected/compared."""
    comparisons_used: List[str] = Field(
        default_factory=list,
        description="Comparison phrases the student successfully used"
    )
    missing_comparisons: List[str] = Field(
        default_factory=list,
        description="Recommended comparison phrases for this specific chart"
    )
    feedback_message: str = Field(
        ...,
        description="Assessment of their comparison cohesion"
    )

class Task1CoherenceFeedback(BaseModel):
    """Complete Coherence & Cohesion feedback for Task 1."""
    paragraph_structure: ParagraphStructureFeedback = Field(
        ...,
        description="Analysis of paragraph breaks and section ordering"
    )
    overview_feedback: OverviewFeedback = Field(
        ...,
        description="Analysis of the overview paragraph, including its positioning"
    )
    data_grouping_fixes: List[DataGroupingFix] = Field(
        default_factory=list,
        description="Fixes for scattered/listed data points"
    )
    referencing_errors: List[ReferencingError] = Field(
        default_factory=list,
        description="Fixes for ambiguous pronouns"
    )
    connector_analysis: ConnectorAnalysis = Field(
        ...,
        description="Analysis of linking words, including fixes for overuse"
    )
    comparison_language: ComparisonLanguage = Field(
        ...,
        description="Analysis of language used to link data points"
    )


# ============================================================================
# DATA COVERAGE ANALYSIS (Task 1 Specific)
# ============================================================================

class DataCoverageItem(BaseModel):
    """Analysis of a single key feature from the chart/data."""
    
    feature_description: str = Field(
        ...,
        description="What this key feature is (e.g., 'highest value in 2020', 'overall upward trend')"
    )
    covered_in_essay: bool = Field(
        ...,
        description="Whether the student mentioned this feature"
    )
    how_covered: Optional[str] = Field(
        default=None,
        description="Quote from essay showing how the student described this feature"
    )
    why_important: str = Field(
        ...,
        description="Why an examiner expects this feature to be mentioned"
    )
    suggested_sentence: Optional[str] = Field(
        default=None,
        description="Model sentence for this feature, if student missed it"
    )


class DataAccuracyFix(BaseModel):
    """Significant data inaccuracy or hallucination.
    
    Only record gross errors: wrong trend direction, fabricated numbers (off by >15%),
    or data assigned to the wrong category/period. Minor approximations from 
    chart reading (e.g. 47% vs 45%) are normal and should NOT be flagged.
    """
    original_sentence: str = Field(..., description="The quote from the essay containing the inaccurate data")
    issue_description: str = Field(..., description="Explanation of why this is a significant misread (not a minor approximation)")
    corrected_data: str = Field(..., description="The correct figure/trend that should have been reported")


class DataCoverageAnalysis(BaseModel):
    """Complete analysis of which key features were selected and described.
    
    This replaces Task 2's 'idea development' — in Task 1, you don't 
    develop arguments, you select and describe key data features.
    """
    
    total_key_features: int = Field(
        ...,
        ge=0,
        description="Total number of key features identified in the data"
    )
    features_covered: int = Field(
        ...,
        ge=0,
        description="How many key features the student mentioned"
    )
    features_missed: int = Field(
        ...,
        ge=0,
        description="How many key features the student missed"
    )
    feature_map: List[DataCoverageItem] = Field(
        default_factory=list,
        description="Detailed analysis of each key feature"
    )
    data_accuracy_issues: List[DataAccuracyFix] = Field(
        default_factory=list,
        description="Specific data inaccuracies found (wrong numbers, wrong trends)"
    )
    ignored_dual_chart: bool = Field(
        default=False,
        description="True if the task has two charts and the student completely ignored one"
    )
    has_personal_opinion: bool = Field(
        default=False,
        description="True if the student speculated about reasons or gave an opinion"
    )
    opinion_sentence: Optional[str] = Field(
        default=None,
        description="The sentence where the student expressed an opinion, if any"
    )
    overall_assessment: str = Field(
        ...,
        description="1-2 sentence summary of data coverage quality"
    )


# ============================================================================
# TREND DESCRIPTION FIXES (Task 1 Specific)
# ============================================================================

class TrendDescriptionFix(BaseModel):
    """A fix for weak or inaccurate trend/data description.
    
    This replaces Task 2's 'macro_feedback' (paragraph rewrite using PEEL) —
    in Task 1, the fixes are about how data/trends are described, not 
    argument structure.
    """
    
    original_sentence: str = Field(
        ...,
        description="The student's original sentence"
    )
    issue: str = Field(
        ...,
        description="What's wrong: 'vague_trend', 'missing_data_point', 'wrong_comparison', 'mechanical_listing', 'no_comparison', 'inaccurate_figure'"
    )
    corrected_sentence: str = Field(
        ...,
        description="The corrected version demonstrating Band 7-8 quality"
    )
    explanation: str = Field(
        ...,
        description="Why the correction is better (1-2 sentences)"
    )
    paragraph_location: Optional[int] = Field(
        default=None,
        ge=0,
        description="Which paragraph this appears in"
    )


# ============================================================================
# MICRO SENTENCE CORRECTIONS (generic, same as Task 2)
# ============================================================================

class MicroFix(BaseModel):
    """A single sentence-level correction (grammar, spelling, style)."""
    
    original_sentence: Optional[str] = Field(
        default=None,
        description="The exact sentence from the student's essay"
    )
    corrected_sentence: Optional[str] = Field(
        default=None,
        description="The corrected version"
    )
    error_type: Optional[str] = Field(
        default=None,
        description="Classification: 'grammar', 'vocabulary', 'spelling', 'punctuation', 'style'"
    )
    specific_error: Optional[str] = Field(
        default=None,
        description="What specifically was wrong"
    )
    explanation: Optional[str] = Field(
        default=None,
        description="Why this is wrong and how to avoid it"
    )
    priority: Optional[str] = Field(
        default=None,
        description="P1_critical, P2_important, P3_moderate, P4_minor"
    )
    paragraph_location: Optional[int] = Field(
        default=None,
        ge=0,
        description="Which paragraph this appears in"
    )


# ============================================================================
# VOCABULARY FEEDBACK (Task 1 Specific)
# ============================================================================

class Task1VocabularyUpgrade(BaseModel):
    """Upgrade for Task 1-specific vocabulary (trends, comparisons, data description)."""
    
    basic_phrase: str = Field(
        ...,
        description="The basic/vague phrase the student used"
    )
    context_sentence: str = Field(
        ...,
        description="The full sentence containing this phrase"
    )
    upgrade_options: List[str] = Field(
        default_factory=list,
        description="2-3 more precise/academic alternatives"
    )
    best_fit: str = Field(
        ...,
        description="The recommended replacement for this context"
    )
    improved_sentence: str = Field(
        ...,
        description="The sentence rewritten with the upgrade"
    )


class Task1VocabularyFeedback(BaseModel):
    """All vocabulary feedback for Task 1.
    
    Focuses on trend language, comparison phrases, and data description 
    vocabulary — NOT cliché detection (which is a Task 2 concern about
    memorized essay phrases).
    """
    
    trend_vocabulary_used: List[str] = Field(
        default_factory=list,
        description="Trend words the student actually used (e.g., 'increased', 'declined')"
    )
    comparison_vocabulary_used: List[str] = Field(
        default_factory=list,
        description="Comparison words used (e.g., 'while', 'in contrast')"
    )
    missing_trend_words: List[str] = Field(
        default_factory=list,
        description="Useful trend words the student could have used"
    )
    missing_comparison_words: List[str] = Field(
        default_factory=list,
        description="Useful comparison/linking words the student could have used"
    )
    word_upgrades: List[Task1VocabularyUpgrade] = Field(
        default_factory=list,
        description="Specific vocabulary upgrade suggestions"
    )
    topic_word_bank: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Chart-type specific vocabulary bank (e.g., line graph trend words)"
    )
    
    # ── Deterministic analysis fields (computed in Python, not by LLM) ──
    paraphrase_analysis: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Word overlap between prompt and student intro (computed post-LLM)"
    )
    word_repetitions: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Words repeated excessively with synonym suggestions (computed post-LLM)"
    )
    vocabulary_stats: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Vocabulary variety score vs band benchmarks (computed post-LLM)"
    )


# ============================================================================
# GRAMMAR FEEDBACK (Task 1 Specific focus)
# ============================================================================

class GrammarErrorExample(BaseModel):
    """A single example of a grammar error with correction."""
    
    original: Optional[str] = Field(default=None, description="Sentence with error")
    corrected: Optional[str] = Field(default=None, description="Corrected version")
    error_highlighted: Optional[str] = Field(default=None, description="The specific error word(s)")


class Task1GrammarLesson(BaseModel):
    """Grammar lesson with Task 1 focus (tenses, passive, articles, data language)."""
    
    error_pattern: str = Field(
        ...,
        description="The grammar pattern being taught"
    )
    pattern_name_friendly: str = Field(
        ...,
        description="Plain English name (e.g., 'Past Tense Consistency')"
    )
    examples_from_essay: List[GrammarErrorExample] = Field(
        default_factory=list,
        description="2-5 examples from the student's essay"
    )
    the_rule: str = Field(
        ...,
        description="Simple explanation of the rule (1 sentence max)"
    )
    memory_trick: str = Field(
        ...,
        description="A mnemonic or self-check technique"
    )
    practice_tip: Optional[str] = Field(
        default=None,
        description="Optional practice suggestion"
    )


class ComplexitySuggestion(BaseModel):
    """Suggestion for upgrading simple sentences to complex structures."""
    
    simple_sentences: List[str] = Field(
        default_factory=list,
        description="The simple sentences from the essay"
    )
    complex_version: Optional[str] = Field(
        default=None,
        description="The combined complex sentence"
    )
    structures_demonstrated: List[str] = Field(
        default_factory=list,
        description="Grammar structures used (e.g., 'while clause', 'relative clause')"
    )
    explanation: Optional[str] = Field(
        default=None,
        description="How the combination was achieved"
    )

    @field_validator("simple_sentences", "structures_demonstrated", mode="before")
    @classmethod
    def ensure_list(cls, v):
        if isinstance(v, str):
            return [v]
        return v


class Task1GrammarFeedback(BaseModel):
    """All grammar feedback for Task 1.
    
    Special focus on tense consistency (past vs present), passive voice usage,
    article accuracy, and complex sentence structures for data description.
    """
    
    pattern_lessons: List[Task1GrammarLesson] = Field(
        default_factory=list,
        description="Lessons for each systematic error pattern"
    )
    complexity_suggestions: List[ComplexitySuggestion] = Field(
        default_factory=list,
        description="Suggestions for sentence complexity upgrades"
    )
    tense_consistency_issues: List[str] = Field(
        default_factory=list,
        description="Specific tense inconsistencies found"
    )
    passive_voice_usage: Optional[str] = Field(
        default=None,
        description="Assessment: 'appropriate', 'overused', 'underused', 'absent'"
    )
    grammar_priority: Optional[str] = Field(
        default=None,
        description="Overall: 'critical', 'important', 'minor', 'not_needed'"
    )
    simple_sentence_count: Optional[int] = Field(
        default=None,
        description="Number of simple sentences (S+V+O only) in the essay"
    )
    complex_sentence_count: Optional[int] = Field(
        default=None,
        description="Number of complex sentences (with subordination) in the essay"
    )
    recommended_tense: Optional[str] = Field(
        default=None,
        description="Primary tense for this chart: 'past_simple' for historical data, 'present_simple' for processes, 'mixed' for multi-period charts"
    )
    tense_rule_summary: Optional[str] = Field(
        default=None,
        description="One-line tense rule for this chart type, e.g., 'Use past simple for all historical data (1990-2020). Use present simple only when describing the chart itself.'"
    )


# ============================================================================
# ROOT OUTPUT MODEL
# ============================================================================

class Task1ExplainerOutput(BaseModel):
    """
    Complete output from the Task 1 Explainer Agent.
    
    This is the Task 1-specific equivalent of Task 2's ExplainerOutput,
    with honest field names reflecting chart/graph description context:
    - overview_feedback (not macro_feedback / PEEL rewrites)
    - data_coverage (not idea_development / thesis analysis)
    - trend_fixes (not argument logic repairs)
    """
    
    # ===== METADATA =====
    essay_word_count: Optional[int] = Field(
        default=None,
        description="Word count of the student's essay"
    )
    current_overall_band: Optional[float] = Field(
        default=None,
        description="Current overall band from Examiner"
    )
    target_band_demonstrated: Optional[float] = Field(
        default=None,
        description="Band level demonstrated in rewrites (typically current + 0.5-1.0)"
    )
    
    # ===== PRIORITY SUMMARY (generic, reused from T2) =====
    priority_summary: List[ImprovementPriority] = Field(
        default_factory=list,
        description="Ranked list of top 3-5 priorities"
    )
    
    # ===== TASK 1 SPECIFIC FEEDBACK =====
    coherence_feedback: Optional[Task1CoherenceFeedback] = Field(
        default=None,
        description="Comprehensive Coherence & Cohesion feedback for Task 1 (paragraphs, overview position, data grouping, referencing)"
    )
    data_coverage: Optional[DataCoverageAnalysis] = Field(
        default=None,
        description="Which key features were covered vs missed"
    )
    trend_fixes: List[TrendDescriptionFix] = Field(
        default_factory=list,
        description="Fixes for weak/inaccurate trend descriptions"
    )
    
    # ===== SENTENCE-LEVEL CORRECTIONS =====
    micro_fixes: List[MicroFix] = Field(
        default_factory=list,
        description="Sentence-level grammar/vocabulary/style corrections"
    )
    
    # ===== COHESION (Now handled in coherence_feedback) =====
    # (Removed generic Task 2 cohesion_fixes field)
    
    # ===== VOCABULARY (Task 1 specific) =====
    vocabulary_feedback: Optional[Task1VocabularyFeedback] = Field(
        default=None,
        description="Task 1 specific vocabulary improvements"
    )
    
    # ===== GRAMMAR (Task 1 specific focus) =====
    grammar_feedback: Optional[Task1GrammarFeedback] = Field(
        default=None,
        description="Grammar lessons with Task 1 focus"
    )
    
    # ===== SCORE PROJECTIONS (generic, reused from T2) =====
    score_projections: List[ScoreProjection] = Field(
        default_factory=list,
        description="Projected scores if feedback is implemented"
    )
    
    # ===== ENCOURAGEMENT =====
    one_thing_done_well: Optional[str] = Field(
        default=None,
        description="One genuine positive aspect (specific, not generic)"
    )
    immediate_focus: Optional[str] = Field(
        default=None,
        description="The ONE thing to focus on in their next Task 1 essay"
    )
    practice_suggestion: Optional[str] = Field(
        default=None,
        description="A specific practice exercise recommendation"
    )

    @field_validator('current_overall_band', 'target_band_demonstrated', mode='before')
    @classmethod
    def validate_band_score(cls, v):
        if v is None:
            return v
        if v % 0.5 != 0:
            # Round to nearest 0.5 instead of failing
            return round(v * 2) / 2
        return v
