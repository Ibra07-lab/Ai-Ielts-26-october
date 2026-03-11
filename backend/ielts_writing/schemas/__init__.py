"""IELTS Writing evaluation schemas.

This module exports Pydantic models for both Task 1 and Task 2 evaluations.
"""

from .base import (
    StatusLevel,
    BandRange,
    CriterionScoreBase,
    ErrorPattern,
    MicroTask,
    ActionPlanDay,
)

from .task1 import (
    # Enums
    ChartType,
    OverviewQuality,
    DataAccuracy,
    # Examiner
    Task1CriterionScore,
    Task1ExaminerRequest,
    Task1ExaminerResponse,
    # Teacher
    Task1CriterionFeedback,
    Task1OverallSummary,
    Task1TeacherRequest,
    Task1TeacherResponse,
    # Pipeline
    Task1PipelineResponse,
)

from .task2 import (
    # Enums
    TaskType,
    GrammarErrorType,
    DevelopmentQuality,
    # Score models
    BandScores,
    ScoreCap,
    # Logic Check models
    ThesisAnalysis,
    LinkerAudit,
    ClicheAudit,
    GrammarAudit,
    # Paragraph analysis
    ParagraphBreakdown,
    # Combined
    Analysis,
    # Root model
    IELTSEvaluation,
    # Utilities
    validate_evaluation,
    get_coaching_data,
)

from .task2_explainer import (
    # Enums
    MicroErrorType,
    MacroIssueType,
    CohesionTechnique,
    PriorityLevel,
    GrammarRuleCategory,
    # Micro feedback
    MicroFeedbackItem,
    CohesionFix,
    # Macro feedback
    PEELBreakdown,
    MacroFeedbackItem,
    # Vocabulary
    ClicheReplacement,
    VocabularyUpgrade,
    VocabularyFeedback,
    # Grammar
    GrammarErrorExample,
    GrammarPatternLesson,
    ComplexitySuggestion,
    GrammarFeedback,
    # Summary
    ImprovementPriority,
    ScoreProjection,
    # Root model
    ExplainerOutput,
)

from .task2_coach import (
    # Enums
    RootCauseType,
    DrillType,
    ConstraintCategory,
    CoachingPriority,
    # Diagnosis models
    RootCauseAnalysis,
    DiagnosisSummary,
    # Pattern breaker
    BannedItem,
    RequiredElement,
    PatternBreaker,
    # Drill models
    SuccessCriterion,
    MicroDrill,
    # Constraint models
    EssayConstraint,
    NextEssayPlan,
    # Other models
    Motivation,
    ScoreContext,
    TheOneBigChange,
    # Root model
    CoachOutput,
)

__all__ = [
    # Base
    "StatusLevel",
    "BandRange",
    "CriterionScoreBase",
    "ErrorPattern",
    "MicroTask",
    "ActionPlanDay",
    # Task 1
    "ChartType",
    "OverviewQuality",
    "DataAccuracy",
    "Task1CriterionScore",
    "Task1ExaminerRequest",
    "Task1ExaminerResponse",
    "Task1CriterionFeedback",
    "Task1OverallSummary",
    "Task1TeacherRequest",
    "Task1TeacherResponse",
    "Task1PipelineResponse",
    # Task 2 - Examiner
    "TaskType",
    "GrammarErrorType",
    "DevelopmentQuality",
    "BandScores",
    "ScoreCap",
    "ThesisAnalysis",
    "LinkerAudit",
    "ClicheAudit",
    "GrammarAudit",
    "ParagraphBreakdown",
    "Analysis",
    "IELTSEvaluation",
    "validate_evaluation",
    "get_coaching_data",
    # Task 2 - Explainer
    "MicroErrorType",
    "MacroIssueType",
    "CohesionTechnique",
    "PriorityLevel",
    "GrammarRuleCategory",
    "MicroFeedbackItem",
    "CohesionFix",
    "PEELBreakdown",
    "MacroFeedbackItem",
    "ClicheReplacement",
    "VocabularyUpgrade",
    "VocabularyFeedback",
    "GrammarErrorExample",
    "GrammarPatternLesson",
    "ComplexitySuggestion",
    "GrammarFeedback",
    "ImprovementPriority",
    "ScoreProjection",
    "ExplainerOutput",
    # Task 2 - Coach
    "RootCauseType",
    "DrillType",
    "ConstraintCategory",
    "CoachingPriority",
    "RootCauseAnalysis",
    "DiagnosisSummary",
    "BannedItem",
    "RequiredElement",
    "PatternBreaker",
    "SuccessCriterion",
    "MicroDrill",
    "EssayConstraint",
    "NextEssayPlan",
    "Motivation",
    "ScoreContext",
    "TheOneBigChange",
    "CoachOutput",
]


