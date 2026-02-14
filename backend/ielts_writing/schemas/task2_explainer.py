"""
IELTS Task 2 Explainer Schemas

This module defines the Pydantic models for the Explainer Agent output,
which translates abstract scores into concrete, actionable corrections.

The Explainer Agent is Agent 2 in the pipeline:
- Agent 1 (Examiner): Scores the essay
- Agent 2 (Explainer): Provides detailed feedback and rewrites
"""

from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Union, Dict, Any
from enum import Enum


# ============================================================================
# ENUMS
# ============================================================================

class MicroErrorType(str, Enum):
    """Classification of sentence-level errors."""
    GRAMMAR = "grammar"
    VOCABULARY = "vocabulary"
    COHESION = "cohesion"
    STYLE = "style"
    PUNCTUATION = "punctuation"
    SPELLING = "spelling"


class MacroIssueType(str, Enum):
    """Classification of paragraph-level logic issues."""
    CIRCULAR_ARGUMENT = "circular_argument"
    UNDERDEVELOPED = "underdeveloped"
    OFF_TOPIC = "off_topic"
    MISSING_TOPIC_SENTENCE = "missing_topic_sentence"
    WEAK_EXAMPLES = "weak_examples"
    NO_LINK_TO_THESIS = "no_link_to_thesis"
    ASSERTION_WITHOUT_SUPPORT = "assertion_without_support"
    MISSING_CONCLUSION = "missing_conclusion"
    TASK_TYPE_MISMATCH = "task_type_mismatch"


class CohesionTechnique(str, Enum):
    """Types of cohesion improvement techniques."""
    DEMONSTRATIVE_REFERENCE = "demonstrative_reference"  # This, That, Such
    LEXICAL_COHESION = "lexical_cohesion"                # Synonym chains
    THEMATIC_PROGRESSION = "thematic_progression"        # Known → New
    SUBSTITUTION = "substitution"                        # One, ones, do so
    ELLIPSIS = "ellipsis"                                # Omission for flow


class PriorityLevel(str, Enum):
    """Priority levels for feedback items."""
    P1_CRITICAL = "P1_critical"      # Score-capping issues
    P2_IMPORTANT = "P2_important"    # Band-limiting patterns
    P3_MODERATE = "P3_moderate"      # Polish issues
    P4_MINOR = "P4_minor"            # Nice-to-fix


class GrammarRuleCategory(str, Enum):
    """Categories of grammar rules for teaching."""
    SUBJECT_VERB_AGREEMENT = "subject_verb_agreement"
    TENSE_CONSISTENCY = "tense_consistency"
    ARTICLE_USAGE = "article_usage"
    PREPOSITION_USAGE = "preposition_usage"
    COUNTABLE_UNCOUNTABLE = "countable_uncountable"
    PRONOUN_REFERENCE = "pronoun_reference"
    SENTENCE_FRAGMENTS = "sentence_fragments"
    RUN_ON_SENTENCES = "run_on_sentences"
    PARALLEL_STRUCTURE = "parallel_structure"
    CONDITIONAL_FORMS = "conditional_forms"
    RELATIVE_CLAUSES = "relative_clauses"
    PASSIVE_VOICE = "passive_voice"
    WORD_ORDER = "word_order"
    OTHER = "other"


# ============================================================================
# MICRO-FEEDBACK MODELS (Sentence Level)
# ============================================================================

class MicroFeedbackItem(BaseModel):
    """A single sentence-level correction with explanation."""
    
    original_sentence: Optional[str] = Field(
        default=None,
        description="The exact sentence from the student's essay containing the error"
    )
    corrected_sentence: Optional[str] = Field(
        default=None,
        description="The corrected version of the sentence"
    )
    error_type: Optional[str] = Field(
        default=None,
        description="Classification of the error type"
    )
    specific_error: Optional[str] = Field(
        default=None,
        description="Precise identification of what was wrong"
    )
    explanation: Optional[str] = Field(
        default=None,
        description="Plain-English explanation of why this is wrong"
    )
    priority: Optional[str] = Field(
        default=None,
        description="How important this fix is for the student's score"
    )
    paragraph_location: Optional[int] = Field(
        default=None,
        ge=1,
        description="Which paragraph this sentence appears in (1-indexed)"
    )


class CohesionFix(BaseModel):
    """A specific fix for mechanical linker overuse."""
    
    original_sentence: Optional[str] = Field(
        default=None,
        description="The sentence starting with a mechanical linker"
    )
    mechanical_linker_used: Optional[str] = Field(
        default=None,
        description="The specific linker that was overused"
    )
    improved_sentence: Optional[str] = Field(
        default=None,
        description="The rewritten sentence using better cohesion"
    )
    technique_used: Optional[str] = Field(
        default=None,
        description="Which cohesion technique was applied"
    )
    technique_explanation: Optional[str] = Field(
        default=None,
        description="Brief explanation of why this technique works better"
    )
    preceding_sentence: Optional[str] = Field(
        None,
        description="The sentence before (for context)"
    )


# ============================================================================
# MACRO-FEEDBACK MODELS (Paragraph Level)
# ============================================================================

class PEELBreakdown(BaseModel):
    """Breakdown of a paragraph using the PEEL method."""
    
    point: Optional[str] = Field(
        default=None,
        description="The topic sentence / main claim"
    )
    explain: Optional[str] = Field(
        default=None,
        description="The reasoning / elaboration"
    )
    example: Optional[str] = Field(
        default=None,
        description="The concrete, specific example"
    )
    link: Optional[str] = Field(
        default=None,
        description="Connection back to thesis or transition"
    )


class MacroFeedbackItem(BaseModel):
    """A paragraph-level logic fix with full rewrite."""
    
    paragraph_index: Optional[int] = Field(
        default=None,
        ge=1,
        description="Which paragraph is being addressed (1-indexed)"
    )
    issue_identified: Optional[str] = Field(
        default=None,
        description="The type of logic/structure issue found"
    )
    original_paragraph: Optional[str] = Field(
        default=None,
        description="The student's original paragraph"
    )
    logic_diagnosis: Optional[str] = Field(
        default=None,
        description="Explanation of what is logically broken"
    )
    student_intended_point: Optional[str] = Field(
        default=None,
        description="What the student was TRYING to argue"
    )
    improved_paragraph: Optional[str] = Field(
        default=None,
        description="Full rewrite demonstrating Band 7.5-8.0"
    )
    peel_breakdown: Optional[PEELBreakdown] = Field(
        default=None,
        description="The improved paragraph broken down into PEEL"
    )
    key_changes_made: List[str] = Field(
        default_factory=list,
        description="Bullet points explaining what was added/changed"
    )
    word_count_original: Optional[int] = Field(
        default=None,
        ge=0,
        description="Word count of original paragraph"
    )
    word_count_improved: Optional[int] = Field(
        default=None,
        ge=0,
        description="Word count of improved paragraph"
    )
    priority: Optional[str] = Field(
        default=None,
        description="Logic issues are typically P1"
    )


# ============================================================================
# VOCABULARY MODELS
# ============================================================================

class ClicheReplacement(BaseModel):
    """A context-specific replacement for a detected cliché."""
    
    cliche_found: Optional[str] = Field(
        default=None,
        description="The exact cliché phrase detected"
    )
    lazy_meaning: Optional[str] = Field(
        default=None,
        description="What this cliché is lazily trying to express"
    )
    essay_context: Optional[str] = Field(
        default=None,
        description="How it was used in this specific essay"
    )
    alternatives: List[str] = Field(
        default_factory=list,
        description="2-4 context-appropriate alternatives"
    )
    original_sentence: Optional[str] = Field(
        default=None,
        description="The full sentence containing the cliché"
    )
    improved_sentence: Optional[str] = Field(
        default=None,
        description="The sentence rewritten with the best alternative"
    )
    why_better: Optional[str] = Field(
        default=None,
        description="Brief explanation of why the replacement is more effective"
    )


class VocabularyUpgrade(BaseModel):
    """An upgrade suggestion for basic/imprecise vocabulary."""
    
    basic_word: Optional[str] = Field(
        default=None,
        description="The basic or imprecise word used"
    )
    context_sentence: Optional[str] = Field(
        default=None,
        description="The sentence where this word appears"
    )
    upgrade_options: List[str] = Field(
        default_factory=list,
        description="More precise/academic alternatives"
    )
    best_fit: Optional[str] = Field(
        default=None,
        description="The recommended replacement for this context"
    )
    why_best_fit: Optional[str] = Field(
        default=None,
        description="Why this particular upgrade suits the context"
    )
    improved_sentence: Optional[str] = Field(
        default=None,
        description="The sentence with the upgrade applied"
    )


class VocabularyFeedback(BaseModel):
    """Container for all vocabulary-related feedback."""
    
    cliche_replacements: List[ClicheReplacement] = Field(
        default_factory=list,
        description="Replacements for all detected clichés"
    )
    word_upgrades: List[VocabularyUpgrade] = Field(
        default_factory=list,
        description="Upgrades for basic/imprecise vocabulary"
    )
    topic_specific_vocabulary: List[Union[str, Dict[str, Any]]] = Field(
        default_factory=list,
        description="List of sophisticated words relevant to this essay's topic that the student could incorporate"
    )


# ============================================================================
# GRAMMAR TEACHING MODELS
# ============================================================================

class GrammarErrorExample(BaseModel):
    """A single example of a grammar error with correction."""
    
    original: Optional[str] = Field(
        default=None,
        description="The sentence containing the error"
    )
    corrected: Optional[str] = Field(
        default=None,
        description="The corrected sentence"
    )
    error_highlighted: Optional[str] = Field(
        default=None,
        description="The specific word(s) that were wrong"
    )


class GrammarPatternLesson(BaseModel):
    """A mini-lesson on a systematic grammar error pattern."""
    
    error_pattern: Optional[str] = Field(
        default=None,
        description="The grammar pattern being taught"
    )
    pattern_name_friendly: Optional[str] = Field(
        default=None,
        description="Plain English name for this error type"
    )
    examples_from_essay: List[GrammarErrorExample] = Field(
        default_factory=list,
        description="2-5 examples from the student's essay"
    )
    the_rule: Optional[str] = Field(
        default=None,
        description="Simple explanation of the grammar rule"
    )
    memory_trick: Optional[str] = Field(
        default=None,
        description="A mnemonic or self-check technique"
    )
    practice_tip: Optional[str] = Field(
        None,
        description="Optional suggestion for practice"
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
        description="Grammar structures used in the upgrade"
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


class GrammarFeedback(BaseModel):
    """Container for all grammar-related feedback."""
    
    pattern_lessons: List[GrammarPatternLesson] = Field(
        default_factory=list,
        description="Lessons for each systematic error pattern"
    )
    complexity_suggestions: List[ComplexitySuggestion] = Field(
        default_factory=list,
        description="Suggestions for sentence complexity upgrades"
    )
    grammar_priority: Optional[str] = Field(
        default=None,
        description="Overall assessment: 'critical', 'important', 'minor', 'not_needed'"
    )


# ============================================================================
# PRIORITY & SUMMARY MODELS
# ============================================================================

class ImprovementPriority(BaseModel):
    """A prioritized improvement area with action steps."""
    
    rank: Optional[int] = Field(
        default=None,
        ge=1,
        le=5,
        description="Priority rank (1 = most important)"
    )
    area: Optional[str] = Field(
        default=None,
        description="The area needing improvement"
    )
    current_problem: Optional[str] = Field(
        default=None,
        description="What is currently wrong"
    )
    score_impact: Optional[str] = Field(
        default=None,
        description="How this affects the score"
    )
    action_step: Optional[str] = Field(
        default=None,
        description="Specific, actionable instruction"
    )
    where_to_look: Optional[str] = Field(
        default=None,
        description="Reference to which part of the feedback addresses this"
    )


class ScoreProjection(BaseModel):
    """Projected score improvement if feedback is implemented."""
    
    criterion: str = Field(
        ...,
        description="TR, CC, LR, or GRA"
    )
    current_score: float = Field(
        ...,
        description="Current score from Agent 1"
    )
    achievable_score: float = Field(
        ...,
        description="Realistically achievable score if feedback is implemented"
    )
    key_changes_needed: List[str] = Field(
        ...,
        description="What must change to achieve this score"
    )


class CriterionStrength(BaseModel):
    """AI-generated personalized strength description for a specific criterion."""
    
    criterion: str = Field(
        ...,
        description="The criterion: 'task_response', 'coherence_cohesion', 'lexical_resource', or 'grammatical_range_accuracy'"
    )
    title: str = Field(
        ...,
        description="A short, encouraging title for this strength (3-6 words)"
    )
    description: str = Field(
        ...,
        description="A detailed 40-60 word explanation of what the student did well in this specific essay, with concrete examples from their writing"
    )
    evidence_from_essay: Optional[str] = Field(
        default=None,
        description="A specific quote or example from the essay that demonstrates this strength"
    )


# ============================================================================
# ROOT OUTPUT MODEL
# ============================================================================

class ExplainerOutput(BaseModel):
    """
    Complete output from the IELTS Explainer Agent.
    
    This structured feedback document translates the Examiner's 
    abstract scores into concrete, actionable corrections.
    """
    
    # ===== METADATA =====
    essay_word_count: Optional[int] = Field(
        default=None,
        description="Word count of the student's essay"
    )
    current_overall_band: Optional[float] = Field(
        default=None,
        description="Current overall band from Agent 1"
    )
    target_band_demonstrated: Optional[float] = Field(
        default=None,
        description="The band level demonstrated in rewrites (typically current + 1.0-1.5)"
    )
    
    # ===== PRIORITY SUMMARY =====
    priority_summary: List[ImprovementPriority] = Field(
        default_factory=list,
        description="Ranked list of top 3-5 priorities for improvement"
    )
    
    # ===== MACRO FEEDBACK (Logic/Paragraph Level) =====
    macro_feedback: List[MacroFeedbackItem] = Field(
        default_factory=list,
        description="Paragraph-level rewrites for logic issues"
    )
    
    # ===== MICRO FEEDBACK (Sentence Level) =====
    micro_feedback: List[MicroFeedbackItem] = Field(
        default_factory=list,
        description="Sentence-level corrections"
    )
    
    # ===== COHESION FEEDBACK =====
    cohesion_fixes: List[CohesionFix] = Field(
        default_factory=list,
        description="Specific fixes for mechanical linker overuse"
    )
    
    # ===== VOCABULARY FEEDBACK =====
    vocabulary_feedback: Optional[VocabularyFeedback] = Field(
        default=None,
        description="All vocabulary-related improvements"
    )
    
    # ===== GRAMMAR FEEDBACK =====
    grammar_feedback: Optional[GrammarFeedback] = Field(
        default=None,
        description="All grammar-related lessons and fixes"
    )
    
    # ===== SCORE PROJECTIONS =====
    score_projections: List[ScoreProjection] = Field(
        default_factory=list,
        description="Projected scores for each criterion if feedback is implemented"
    )
    
    # ===== CRITERION-SPECIFIC STRENGTHS (AI-Generated) =====
    criterion_strengths: List[CriterionStrength] = Field(
        default_factory=list,
        description="AI-generated personalized strength descriptions for each criterion (TR, CC, LR, GRA), based on the specific essay content"
    )
    
    # ===== ENCOURAGEMENT (Brief) =====
    one_thing_done_well: Optional[str] = Field(
        default=None,
        description="One genuine positive aspect of the essay (be specific, not generic)"
    )
    
    # ===== NEXT STEPS =====
    immediate_focus: Optional[str] = Field(
        default=None,
        description="The ONE thing to focus on in their next essay"
    )
    practice_suggestion: Optional[str] = Field(
        default=None,
        description="A specific practice exercise recommendation"
    )

    @field_validator('current_overall_band', 'target_band_demonstrated')
    @classmethod
    def validate_band_score(cls, v: float) -> float:
        """Ensure band scores are in 0.5 increments."""
        if v % 0.5 != 0:
            raise ValueError(f"Band score {v} must be in 0.5 increments")
        if v < 0 or v > 9:
            raise ValueError(f"Band score {v} must be between 0 and 9")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "essay_word_count": 267,
                "current_overall_band": 6.0,
                "target_band_demonstrated": 7.5,
                "priority_summary": [
                    {
                        "rank": 1,
                        "area": "Paragraph Development",
                        "current_problem": "Body paragraphs state claims without explaining them",
                        "score_impact": "Caps Task Response at 6.0",
                        "action_step": "Add 2-3 sentences of explanation after each topic sentence",
                        "where_to_look": "See macro_feedback items 1 and 2"
                    }
                ],
                "immediate_focus": "Before writing your next body paragraph, ask yourself: 'Have I explained WHY this is true?'",
                "practice_suggestion": "Take your body paragraph 2 and rewrite it three times, each time adding one more sentence of explanation."
            }
        }
