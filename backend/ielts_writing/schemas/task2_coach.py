"""
IELTS Task 2 Coach Schemas — The Output Contract

This module defines the Pydantic models for the Coach Agent output,
focused on "The One Big Change" coaching philosophy.

Pipeline Position:
- Agent 1 (Examiner): Scores → IELTSEvaluation
- Agent 2 (Explainer): Feedback → ExplainerOutput
- Agent 3 (Coach): Focused Plan → CoachOutput ← THIS FILE
"""

from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from enum import Enum
from ielts_writing.models import TopicVocabulary, CoherenceAdvice

class TopicAnalysis(BaseModel):
    """Specific study topic recommendation."""
    topic: str = Field(..., description="Name of the topic (e.g. 'Inversion')")
    count: int = Field(..., description="Priority/Relevance score (1-10)")
    category: str = Field(..., description="Type: Grammar, Vocabulary, Coherence, Task Response")
    description: str = Field(..., description="What exactly to study (e.g. 'Using Not Only/But Also for emphasis')")
    why_it_matters: str = Field(..., description="The specific score benefit (e.g. 'Boosts GRA complexity')")



# ============================================================================
# ENUMS
# ============================================================================

class RootCauseType(str, Enum):
    """Classification of the fundamental issue blocking score improvement."""
    STRUCTURAL_MISUNDERSTANDING = "structural_misunderstanding"  # Wrong essay type
    PROMPT_MISREADING = "prompt_misreading"                      # Off-topic
    LOGIC_GAP = "logic_gap"                                      # Underdeveloped arguments
    COHESION_CRUTCH = "cohesion_crutch"                          # Mechanical linkers
    GRAMMAR_PATTERN = "grammar_pattern"                          # Systematic errors
    TEMPLATE_DEPENDENCY = "template_dependency"                  # Cliché overuse
    POLISH_NEEDED = "polish_needed"                              # Minor refinements


class DrillType(str, Enum):
    """Types of micro-drills that can be assigned."""
    PROMPT_CLASSIFICATION = "prompt_classification"
    KEY_WORD_EXTRACTION = "key_word_extraction"
    PEEL_EXPANSION = "peel_expansion"
    THESIS_WRITING = "thesis_writing"
    LINKER_ELIMINATION = "linker_elimination"
    SENTENCE_COMBINING = "sentence_combining"
    PATTERN_DRILLING = "pattern_drilling"
    ORIGINAL_EXPRESSION = "original_expression"
    PARAGRAPH_ORDERING = "paragraph_ordering"
    TOPIC_SENTENCE_WRITING = "topic_sentence_writing"
    TIMED_PLANNING = "timed_planning"
    ERROR_HUNTING = "error_hunting"


class ConstraintCategory(str, Enum):
    """Categories of constraints for next essay practice."""
    STRUCTURAL = "structural"
    COHESION = "cohesion"
    GRAMMAR = "grammar"
    VOCABULARY = "vocabulary"
    PROCESS = "process"
    BAN_BASED = "ban_based"
    WORD_LIMIT = "word_limit"


class CoachingPriority(str, Enum):
    """Which level of the coaching hierarchy is being addressed."""
    LEVEL_1_TASK_RESPONSE = "level_1_task_response"
    LEVEL_2_COHERENCE = "level_2_coherence"
    LEVEL_3_GRAMMAR = "level_3_grammar"
    LEVEL_4_VOCABULARY = "level_4_vocabulary"


# ============================================================================
# DIAGNOSIS MODELS
# ============================================================================

class RootCauseAnalysis(BaseModel):
    """Analysis of the fundamental issue blocking improvement."""
    
    root_cause_type: RootCauseType = Field(
        ...,
        description="The classified type of root cause"
    )
    coaching_priority: str = Field(
        ...,
        description="Which level of the hierarchy this falls under"
    )
    blocking_criterion: str = Field(
        ...,
        description="Which IELTS criterion is most affected (TR, CC, LR, GRA)"
    )
    score_cap_explanation: str = Field(
        ...,
        description="Why this issue caps their score at a specific level"
    )
    evidence_from_essay: str = Field(
        ...,
        description="Specific example from their essay demonstrating this issue"
    )


class DiagnosisSummary(BaseModel):
    """Two-sentence summary of why the student received their score."""
    
    strength_acknowledged: str = Field(
        ...,
        description="One genuine positive aspect of their essay (specific)"
    )
    core_limitation: str = Field(
        ...,
        description="The one thing blocking their score improvement"
    )
    full_summary: str = Field(
        ...,
        description="The complete 2-sentence diagnosis summary"
    )


# ============================================================================
# PATTERN BREAKER MODELS
# ============================================================================

class BannedItem(BaseModel):
    """An item the student is forbidden from using in their next essay."""
    
    banned_element: str = Field(
        ...,
        description="The word, phrase, or pattern that is banned"
    )
    why_banned: str = Field(
        ...,
        description="Brief explanation of why this is problematic"
    )
    alternative_to_use: str = Field(
        ...,
        description="What to use instead"
    )
    example_transformation: str = Field(
        ...,
        description="Before → After example"
    )


class RequiredElement(BaseModel):
    """An element the student MUST include in their next essay."""
    
    required_technique: str = Field(
        ...,
        description="The technique or element that must be used"
    )
    minimum_instances: int = Field(
        ...,
        ge=1,
        description="How many times this must appear"
    )
    how_to_implement: str = Field(
        ...,
        description="Brief instruction on how to do this"
    )
    example: str = Field(
        ...,
        description="Example of this technique in action"
    )


class PatternBreaker(BaseModel):
    """Container for banned and required elements."""
    
    habit_identified: str = Field(
        ...,
        description="The specific bad habit that was identified"
    )
    habit_frequency: str = Field(
        ...,
        description="How often this habit appeared (e.g., '6 out of 15 sentences')"
    )
    banned_list: List[BannedItem] = Field(
        ...,
        min_length=1,
        max_length=5,
        description="Items banned from the next essay"
    )
    required_list: List[RequiredElement] = Field(
        ...,
        min_length=1,
        max_length=3,
        description="Techniques required in the next essay"
    )


# ============================================================================
# MICRO-DRILL MODELS
# ============================================================================

class SuccessCriterion(BaseModel):
    """A checkable criterion for drill completion."""
    
    criterion: str = Field(
        ...,
        description="The specific success criterion"
    )
    how_to_check: str = Field(
        ...,
        description="How the student can verify they met this criterion"
    )


class MicroDrill(BaseModel):
    """A specific, timed exercise targeting the root cause."""
    
    drill_type: str = Field(
        ...,
        description="Classification of the drill type"
    )
    drill_name: str = Field(
        ...,
        description="A memorable name for this drill"
    )
    time_limit_minutes: int = Field(
        ...,
        ge=1,
        le=15,
        description="How long the drill should take (1-15 minutes)"
    )
    purpose: str = Field(
        ...,
        description="What skill this drill develops (1 sentence)"
    )
    instructions: str = Field(
        ...,
        description="Step-by-step instructions for completing the drill"
    )
    practice_content: str = Field(
        ...,
        description="The actual exercise content (prompts, sentences, etc.)"
    )
    success_criteria: List[SuccessCriterion] = Field(
        ...,
        description="How to know if the drill was completed successfully"
    )
    variation_for_tomorrow: str = Field(
        ...,
        description="How to do a similar drill tomorrow with different content"
    )
    alternative_drill: Optional[str] = Field(
        None,
        description="Alternative version if student wants variety"
    )


# ============================================================================
# CONSTRAINT MODELS
# ============================================================================

class EssayConstraint(BaseModel):
    """A specific rule for the student's next practice essay."""
    
    constraint_id: int = Field(
        ...,
        ge=1,
        description="Constraint number for reference"
    )
    category: str = Field(
        ...,
        description="Category of this constraint"
    )
    rule: str = Field(
        ...,
        description="The specific rule to follow"
    )
    rationale: str = Field(
        ...,
        description="Why this constraint helps (1 sentence)"
    )
    how_to_verify: str = Field(
        ...,
        description="How to check if the constraint was followed"
    )


class NextEssayPlan(BaseModel):
    """Complete plan for the student's next practice essay."""
    
    recommended_prompt: Optional[str] = Field(
        None,
        description="A specific practice prompt recommendation (if applicable)"
    )
    prompt_type_to_practice: str = Field(
        ...,
        description="What type of prompt they should practice"
    )
    rewrite_original: bool = Field(
        default=False,
        description="Whether to rewrite the same essay vs. new prompt"
    )
    constraints: List[EssayConstraint] = Field(
        ...,
        description="Rules to follow in the next essay"
    )
    pre_writing_checklist: List[str] = Field(
        ...,
        description="Things to do/check before starting to write"
    )
    target_word_count: int = Field(
        default=280,
        description="Target word count for the essay"
    )
    time_allocation: dict = Field(
        ...,
        description="Recommended time split (planning, writing, reviewing)"
    )


# ============================================================================
# MOTIVATION MODEL
# ============================================================================

class Motivation(BaseModel):
    """Encouraging but realistic closing message."""
    
    current_level_context: str = Field(
        ...,
        description="Acknowledgment of where they are now"
    )
    specific_progress_marker: str = Field(
        ...,
        description="A concrete indicator of progress to look for"
    )
    achievable_next_milestone: str = Field(
        ...,
        description="The next achievable goal (specific band or behavior)"
    )
    closing_message: str = Field(
        ...,
        description="The complete motivational message (2-3 sentences)"
    )


# ============================================================================
# SCORE CONTEXT MODEL
# ============================================================================

class ScoreContext(BaseModel):
    """Context about current scores and improvement potential."""
    
    current_overall: float = Field(
        ...,
        description="Current overall band score"
    )
    lowest_criterion: str = Field(
        ...,
        description="The criterion with the lowest score"
    )
    lowest_score: float = Field(
        ...,
        description="The lowest criterion score"
    )
    highest_criterion: str = Field(
        ...,
        description="The criterion with the highest score"
    )
    highest_score: float = Field(
        ...,
        description="The highest criterion score"
    )
    realistic_next_target: float = Field(
        ...,
        description="Realistic overall band target for next attempt"
    )
    if_change_implemented: float = Field(
        ...,
        description="Projected score if the one big change is made"
    )
    improvement_timeline: str = Field(
        ...,
        description="Realistic timeline for improvement (e.g., '2-4 essays')"
    )


# ============================================================================
# THE ONE BIG CHANGE MODEL
# ============================================================================

class TheOneBigChange(BaseModel):
    """The single most important behavior change."""
    
    change_statement: str = Field(
        ...,
        max_length=300,
        description="One clear sentence stating the change needed"
    )
    why_this_matters_most: str = Field(
        ...,
        description="Why this specific change has the highest impact"
    )
    what_to_stop_doing: str = Field(
        ...,
        description="The specific behavior to eliminate"
    )
    what_to_start_doing: str = Field(
        ...,
        description="The specific behavior to adopt"
    )
    visual_reminder: str = Field(
        ...,
        description="A short phrase to write on a sticky note"
    )


# ============================================================================
# ROOT OUTPUT MODEL
# ============================================================================

class CoachOutput(BaseModel):
    """
    Complete output from the IELTS Coach Agent.
    
    This is the final synthesis of the evaluation pipeline,
    providing focused, actionable coaching for score improvement.
    
    Philosophy: "One Big Change" — Focus on the single most impactful
    behavior change rather than overwhelming with comprehensive feedback.
    """
    
    # ===== SCORE CONTEXT =====
    score_context: ScoreContext = Field(
        ...,
        description="Current score situation and improvement potential"
    )
    
    # ===== DIAGNOSIS =====
    root_cause_analysis: RootCauseAnalysis = Field(
        ...,
        description="Analysis of the fundamental blocking issue"
    )
    diagnosis_summary: DiagnosisSummary = Field(
        ...,
        description="2-sentence summary of score diagnosis"
    )
    
    # ===== THE ONE BIG CHANGE =====
    the_one_big_change: TheOneBigChange = Field(
        ...,
        description="The single most important behavior to change"
    )
    
    # ===== PATTERN BREAKER =====
    pattern_breaker: PatternBreaker = Field(
        ...,
        description="Banned items and required techniques for habit change"
    )
    
    # ===== MICRO-DRILL =====
    micro_drill: MicroDrill = Field(
        ...,
        description="Specific 5-15 minute exercise for targeted practice"
    )
    
    # ===== NEXT ESSAY PLAN =====
    next_essay_plan: NextEssayPlan = Field(
        ...,
        description="Complete plan for the next practice essay"
    )
    
    # ===== MOTIVATION =====
    motivation: Motivation = Field(
        ...,
        description="Encouraging but realistic closing"
    )
    
    # ===== META =====
    coaching_focus_level: CoachingPriority = Field(
        ...,
        description="Which hierarchy level this coaching addresses"
    )
    
    # ===== NEW FEATURES (Topic & Coherence) =====
    topic_vocabulary: Optional[TopicVocabulary] = Field(
        None,
        description="Topic-specific vocabulary suggestions"
    )
    
    # ===== TOPIC ANALYSIS (New) =====
    topic_analysis: List[TopicAnalysis] = Field(
        default_factory=list,
        description="Recommended study topics based on errors"
    )

    coherence_advice: Optional[CoherenceAdvice] = Field(
        None,
        description="Specific flowchart advice for coherence"
    )

    issues_intentionally_ignored: List[str] = Field(
        default_factory=list,
        description="Lower-priority issues that were deliberately not addressed"
    )
    when_to_revisit: str = Field(
        ...,
        description="When the student should focus on the ignored issues"
    )
    
    @field_validator('coaching_focus_level', mode='before')
    @classmethod
    def fix_coaching_level_enum(cls, v):
        if isinstance(v, str):
            v_lower = v.lower()
            # 1. Try exact match first
            for member in CoachingPriority:
                if member.value == v_lower:
                    return v_lower
            
            # 2. Map known hallucinations
            if v_lower == 'level_2_coherence_cohesion':
                return 'level_2_coherence'
            
            # 3. Fuzzy matching or Default fallback
            if 'grammar' in v_lower: return 'level_3_grammar'
            if 'vocabulary' in v_lower or 'lexical' in v_lower: return 'level_4_vocabulary'
            if 'response' in v_lower or 'achievement' in v_lower: return 'level_1_task_response'
            if 'coherence' in v_lower or 'cohesion' in v_lower: return 'level_2_coherence'
            
            # 4. Ultimate fallback (Safety net)
            return 'level_1_task_response'
        return v

    @field_validator('root_cause_analysis', mode='before')
    @classmethod
    def lower_case_enums(cls, v):
        if isinstance(v, dict) and 'root_cause_type' in v:
            val = v['root_cause_type'].lower()
            
            # 1. Check if valid
            is_valid = False
            for member in RootCauseType:
                if member.value == val:
                    is_valid = True
                    break
            
            if not is_valid:
                # 2. Map known hallucinations
                if val in ['evidence_specificity_gap', 'insufficient_concrete_examples', 'underdeveloped_ideas']:
                    val = 'logic_gap'
                elif 'grammar' in val:
                    val = 'grammar_pattern'
                elif 'cohesion' in val:
                    val = 'cohesion_crutch'
                elif 'template' in val:
                    val = 'template_dependency'
                else:
                    # 3. Safe fallback
                    val = 'polish_needed'
            
            v['root_cause_type'] = val
        return v

    @field_validator('score_context')
    @classmethod
    def validate_scores(cls, v):
        """Ensure band scores are valid."""
        for field in ['current_overall', 'lowest_score', 'highest_score', 
                      'realistic_next_target', 'if_change_implemented']:
            score = getattr(v, field)
            if score % 0.5 != 0:
                raise ValueError(f"{field} must be in 0.5 increments")
            if score < 0 or score > 9:
                raise ValueError(f"{field} must be between 0 and 9")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "score_context": {
                    "current_overall": 5.5,
                    "lowest_criterion": "TR",
                    "lowest_score": 5.0,
                    "highest_criterion": "GRA",
                    "highest_score": 6.0,
                    "realistic_next_target": 6.0,
                    "if_change_implemented": 6.5,
                    "improvement_timeline": "2-3 focused practice essays"
                },
                "diagnosis_summary": {
                    "strength_acknowledged": "Your grammar shows good control with few errors",
                    "core_limitation": "Body paragraphs state claims without explaining why they are true",
                    "full_summary": "Your grammar shows good control with varied sentence structures. However, your body paragraphs state claims without explaining *why* they are true, which caps your Task Response at 5.0 and blocks access to Band 6+."
                },
                "the_one_big_change": {
                    "change_statement": "After every topic sentence, write 2 sentences explaining WHY before giving an example.",
                    "why_this_matters_most": "This single change will unlock Band 6.5 Task Response",
                    "what_to_stop_doing": "Writing: claim → example → next claim",
                    "what_to_start_doing": "Writing: claim → WHY → HOW → example",
                    "visual_reminder": "WHY before WHAT"
                },
                "motivation": {
                    "current_level_context": "At 5.5, you have solid foundations in grammar and vocabulary",
                    "specific_progress_marker": "When your body paragraphs reach 80+ words with clear reasoning",
                    "achievable_next_milestone": "Band 6.0 overall is achievable in your next 2-3 essays",
                    "closing_message": "You're at a crucial turning point. Students who learn PEEL paragraph development at your level often see 0.5-1.0 band jumps within weeks. Focus only on the drill this week—everything else can wait."
                }
            }
        }
