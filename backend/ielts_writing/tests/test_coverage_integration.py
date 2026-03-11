"""
Integration test for visual description coverage in Task1Teacher.
"""

import os
import json
import unittest
from unittest.mock import MagicMock, patch

# Configure path for imports if needed
import sys
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# from ielts_writing.agents.teacher.task1_teacher import Task1Teacher
from ielts_writing.schemas.task1_teacher import Task1TeacherFeedbackRequest
from ielts_writing.schemas.visual_description import (
    StructuredVisualDescription,
    VisualFeature,
    DataPoint,
    FeatureType,
    FeaturePriority,
    ChartType
)

@unittest.skip("Task1Teacher has been deprecated and removed")
class TestCoverageIntegration(unittest.TestCase):
    """Test that coverage data is correctly integrated into the teacher response."""

    @patch('ielts_writing.agents.teacher.task1_teacher.Task1Teacher._call_openrouter')
    def test_coverage_fields_populated(self, mock_call):
        """Test that coverage metadata is correctly mapped to the response."""
        
        # 1. Setup mock response from LLM
        mock_lite_response = {
            "overall_summary": {
                "personal_note": "Great job, student!",
                "estimated_overall": 6.5,
                "superpower": "Data selection",
                "priority": "Grouping",
                "priority_quick_win": "Use linkers"
            },
            "task_achievement": {"band": 6.5, "weakness_patterns": [], "top_tip": "Add overview"},
            "coherence_cohesion": {"band": 6.0, "weakness_patterns": [], "top_tip": "Link ideas"},
            "lexical_resource": {"band": 6.5, "weakness_patterns": [], "top_tip": "Vary words"},
            "grammatical_range": {"band": 6.0, "weakness_patterns": [], "top_tip": "Check tenses"},
            "action_plan": {"priority_focus": "Grammar", "quick_wins": ["Review tenses"]}
        }
        mock_call.return_value = json.dumps(mock_lite_response)

        # 2. Create structured visual description
        visual_desc = StructuredVisualDescription(
            chart_type=ChartType.LINE_GRAPH,
            data_points=[
                DataPoint(label="Turkey 2020", value=250, unit="L/capita")
            ],
            key_features=[
                VisualFeature(
                    feature_type=FeatureType.EXTREME,
                    description="Turkey highest",
                    priority=FeaturePriority.CRITICAL,
                    expected_mention="Turkey highest"
                ),
                VisualFeature(
                    feature_type=FeatureType.TREND,
                    description="Sharp increase",
                    priority=FeaturePriority.CRITICAL,
                    expected_mention="increased sharply"
                )
            ],
            text_summary="Line graph of water consumption."
        )

        # teacher = Task1Teacher()
        
        # 3. Create request with essay that misses one critical feature and has a data error
        request = Task1TeacherFeedbackRequest(
            student_name="Test Student",
            essay="The graph shows Turkey highest at 350. It was a good day.",
            question="Analyze the chart.",
            chart_type="line_graph",
            visual_description=visual_desc,
            examiner_scores={"overall_band": 6.5, "criterion_scores": []}
        )

        # 4. Generate feedback
        # response = teacher._generate_full_feedback(request)

        # 5. Verify coverage fields
        # Note: validator should find:
        # - "Turkey highest" mentioned
        # - "Sharp increase" missed (Critical)
        # - Data error: 350 vs 250 (Major)
        
        self.assertIsNotNone(response.feature_coverage_summary)
        self.assertIn("50.0%", response.feature_coverage_summary)
        self.assertIn("1/2 features", response.feature_coverage_summary)
        
        self.assertIsNotNone(response.missed_critical_features)
        self.assertEqual(len(response.missed_critical_features), 1)
        self.assertIn("Sharp increase", response.missed_critical_features[0])
        
        self.assertIsNotNone(response.data_accuracy_feedback)
        self.assertEqual(len(response.data_accuracy_feedback), 1)
        self.assertIn("Turkey 2020", response.data_accuracy_feedback[0])
        self.assertIn("350", response.data_accuracy_feedback[0])
        self.assertIn("250", response.data_accuracy_feedback[0])

        # 6. Verify markdown output includes coverage info
        md = teacher.format_as_markdown(response)
        self.assertIn("Visual Data Coverage", md)
        self.assertIn("50.0%", md)
        self.assertIn("Missed Critical Features", md)
        self.assertIn("Data Accuracy Issues", md)

if __name__ == "__main__":
    unittest.main()
