"""
Tests for the Task 2 Pipeline — Agents, Parsing, and Validation.

These tests mock the LLM layer so no real API calls are made.
They verify:
1. Pipeline output shape (correct keys + Pydantic types)
2. Response parsing (JSON → Pydantic for each agent)
3. Malformed response handling (garbage input doesn't crash silently)
4. Band score validation (0.5 increments enforced)
"""

import json
import asyncio
import pytest
from unittest.mock import patch, MagicMock

# Import schemas
from ielts_writing.schemas.task2 import IELTSEvaluation, BandScores
from ielts_writing.schemas.task2_explainer import ExplainerOutput
from ielts_writing.schemas.task2_coach import CoachOutput

# Import agents
from ielts_writing.agents.examiner.task2_examiner import Task2Examiner
from ielts_writing.agents.explainer.task2_explainer import Task2Explainer
from ielts_writing.agents.coach.task2_coach import Task2Coach

# Import pipeline
from ielts_writing.task2_pipeline import Task2Pipeline

# Import fixtures
from .conftest import (
    SAMPLE_ESSAY,
    SAMPLE_QUESTION,
    MOCK_EXAMINER_RESPONSE,
    MOCK_EXPLAINER_RESPONSE,
    MOCK_COACH_RESPONSE,
)


# ============================================================
# TEST 1: Pipeline Output Shape
# ============================================================

class TestPipelineOutputShape:
    """Verify the pipeline returns the correct structure with valid Pydantic models."""

    @pytest.mark.asyncio
    async def test_pipeline_returns_correct_keys(self):
        """Pipeline result must have 'evaluation', 'explanation', 'coaching' keys."""
        pipeline = Task2Pipeline()

        # Mock all three LLM calls to return our fixtures
        with patch.object(
            pipeline.examiner, 'evaluate',
            return_value=IELTSEvaluation.model_validate_json(MOCK_EXAMINER_RESPONSE)
        ), patch.object(
            pipeline.explainer, 'explain',
            return_value=ExplainerOutput(**json.loads(MOCK_EXPLAINER_RESPONSE))
        ), patch.object(
            pipeline.coach, 'generate_plan',
            return_value=CoachOutput.model_validate_json(MOCK_COACH_RESPONSE)
        ):
            result = await pipeline.evaluate_essay(SAMPLE_ESSAY, SAMPLE_QUESTION)

        # Verify keys
        assert "evaluation" in result
        assert "explanation" in result
        assert "coaching" in result

    @pytest.mark.asyncio
    async def test_pipeline_returns_pydantic_models(self):
        """Pipeline values must be Pydantic model instances, not dicts."""
        pipeline = Task2Pipeline()

        with patch.object(
            pipeline.examiner, 'evaluate',
            return_value=IELTSEvaluation.model_validate_json(MOCK_EXAMINER_RESPONSE)
        ), patch.object(
            pipeline.explainer, 'explain',
            return_value=ExplainerOutput(**json.loads(MOCK_EXPLAINER_RESPONSE))
        ), patch.object(
            pipeline.coach, 'generate_plan',
            return_value=CoachOutput.model_validate_json(MOCK_COACH_RESPONSE)
        ):
            result = await pipeline.evaluate_essay(SAMPLE_ESSAY, SAMPLE_QUESTION)

        assert isinstance(result["evaluation"], IELTSEvaluation)
        assert isinstance(result["explanation"], ExplainerOutput)
        assert isinstance(result["coaching"], CoachOutput)

    @pytest.mark.asyncio
    async def test_pipeline_band_scores_accessible(self):
        """Verify band scores are accessible from the pipeline result."""
        pipeline = Task2Pipeline()

        with patch.object(
            pipeline.examiner, 'evaluate',
            return_value=IELTSEvaluation.model_validate_json(MOCK_EXAMINER_RESPONSE)
        ), patch.object(
            pipeline.explainer, 'explain',
            return_value=ExplainerOutput(**json.loads(MOCK_EXPLAINER_RESPONSE))
        ), patch.object(
            pipeline.coach, 'generate_plan',
            return_value=CoachOutput.model_validate_json(MOCK_COACH_RESPONSE)
        ):
            result = await pipeline.evaluate_essay(SAMPLE_ESSAY, SAMPLE_QUESTION)

        scores = result["evaluation"].band_scores
        assert scores.overall == 6.0
        assert scores.task_response == 6.0
        assert scores.grammatical_range_accuracy == 6.5


# ============================================================
# TEST 2: Response Parsing (JSON → Pydantic)
# ============================================================

class TestResponseParsing:
    """Verify each agent correctly parses raw JSON → Pydantic model."""

    def test_examiner_parses_valid_json(self):
        """Examiner should parse valid JSON into IELTSEvaluation."""
        examiner = Task2Examiner.__new__(Task2Examiner)
        result = examiner._parse_response(MOCK_EXAMINER_RESPONSE)
        assert isinstance(result, IELTSEvaluation)
        assert result.band_scores.overall == 6.0

    def test_examiner_parses_markdown_fenced_json(self):
        """Examiner should handle JSON wrapped in ```json ... ``` fencing."""
        examiner = Task2Examiner.__new__(Task2Examiner)
        fenced = f"Here are results:\n```json\n{MOCK_EXAMINER_RESPONSE}\n```\nDone!"
        result = examiner._parse_response(fenced)
        assert isinstance(result, IELTSEvaluation)
        assert result.band_scores.overall == 6.0

    def test_explainer_parses_valid_json(self):
        """Explainer should parse valid JSON into ExplainerOutput."""
        explainer = Task2Explainer.__new__(Task2Explainer)
        result = explainer._parse_response(MOCK_EXPLAINER_RESPONSE)
        assert isinstance(result, ExplainerOutput)
        assert result.one_thing_done_well is not None

    def test_coach_parses_valid_json(self):
        """Coach should parse valid JSON into CoachOutput."""
        coach = Task2Coach.__new__(Task2Coach)
        result = coach._parse_response(MOCK_COACH_RESPONSE)
        assert isinstance(result, CoachOutput)
        assert result.the_one_big_change.change_statement is not None


# ============================================================
# TEST 3: Malformed Response Handling
# ============================================================

class TestMalformedResponseHandling:
    """Verify agents raise clear errors on garbage/invalid input."""

    def test_examiner_rejects_garbage_input(self):
        """Examiner should raise ValueError on non-JSON input."""
        examiner = Task2Examiner.__new__(Task2Examiner)
        with pytest.raises((ValueError, Exception)):
            examiner._parse_response("This is not JSON at all, just random text.")

    def test_explainer_rejects_garbage_input(self):
        """Explainer should raise ValueError on non-JSON input."""
        explainer = Task2Explainer.__new__(Task2Explainer)
        with pytest.raises((ValueError, Exception)):
            explainer._parse_response("totally invalid response lol")

    def test_coach_rejects_garbage_input(self):
        """Coach should raise on non-JSON input."""
        coach = Task2Coach.__new__(Task2Coach)
        with pytest.raises((ValueError, Exception)):
            coach._parse_response("not even close to valid json")

    def test_examiner_rejects_incomplete_json(self):
        """Examiner should raise on JSON missing required fields."""
        examiner = Task2Examiner.__new__(Task2Examiner)
        incomplete = json.dumps({"band_scores": {"overall": 5.0}})
        with pytest.raises((ValueError, Exception)):
            examiner._parse_response(incomplete)

    def test_explainer_accepts_empty_json_with_defaults(self):
        """Explainer should accept empty JSON — all fields are optional."""
        explainer = Task2Explainer.__new__(Task2Explainer)
        result = explainer._parse_response("{}")
        assert isinstance(result, ExplainerOutput)
        # All top-level fields are Optional so they should be None/empty
        assert result.one_thing_done_well is None


# ============================================================
# TEST 4: Band Score Validation
# ============================================================

class TestBandScoreValidation:
    """Verify BandScores enforces 0.5 increments and valid ranges."""

    def test_valid_half_band_scores(self):
        """Valid scores in 0.5 increments should pass validation."""
        scores = BandScores(
            task_response=6.5,
            coherence_cohesion=7.0,
            lexical_resource=5.5,
            grammatical_range_accuracy=6.0,
            overall=6.5,
        )
        assert scores.overall == 6.5

    def test_invalid_band_score_not_half_increment(self):
        """Scores not in 0.5 increments (e.g., 6.3) should be rejected."""
        with pytest.raises(Exception):
            BandScores(
                task_response=6.3,  # Invalid: not a 0.5 increment
                coherence_cohesion=7.0,
                lexical_resource=5.5,
                grammatical_range_accuracy=6.0,
                overall=6.0,
            )

    def test_band_score_out_of_range_high(self):
        """Scores above 9.0 should be rejected."""
        with pytest.raises(Exception):
            BandScores(
                task_response=9.5,  # Invalid: above 9.0
                coherence_cohesion=7.0,
                lexical_resource=5.5,
                grammatical_range_accuracy=6.0,
                overall=6.0,
            )

    def test_band_score_out_of_range_low(self):
        """Scores below 0.0 should be rejected."""
        with pytest.raises(Exception):
            BandScores(
                task_response=-1.0,  # Invalid: below 0.0
                coherence_cohesion=7.0,
                lexical_resource=5.5,
                grammatical_range_accuracy=6.0,
                overall=6.0,
            )

    def test_band_score_zero_is_valid(self):
        """A score of 0.0 should be valid (worst possible)."""
        scores = BandScores(
            task_response=0.0,
            coherence_cohesion=0.0,
            lexical_resource=0.0,
            grammatical_range_accuracy=0.0,
            overall=0.0,
        )
        assert scores.overall == 0.0

    def test_band_score_nine_is_valid(self):
        """A score of 9.0 should be valid (best possible)."""
        scores = BandScores(
            task_response=9.0,
            coherence_cohesion=9.0,
            lexical_resource=9.0,
            grammatical_range_accuracy=9.0,
            overall=9.0,
        )
        assert scores.overall == 9.0
