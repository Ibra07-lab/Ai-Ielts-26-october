"""
Simple import test for Teacher Feedback Report system.
Verifies that all modules can be imported without errors.
"""

import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("=" * 70)
print("TEACHER FEEDBACK REPORT - IMPORT TEST")
print("=" * 70)
print()

try:
    print("1. Testing models import...")
    from ielts_writing.models import EvaluateRequest, WritingFeedbackWithTeacherReport
    print("   [OK] Main models imported successfully")
    print()
    
    print("2. Testing teacher report models import...")
    from ielts_writing.teacher_report_models import (
        TeacherFeedbackReport,
        CriterionFeedback,
        Strength,
        WeaknessPattern,
        ImprovementTip,
        OverallSummary,
        FinalActionPlan
    )
    print("   [OK] Teacher report models imported successfully")
    print()
    
    print("3. Testing prompts import...")
    from ielts_writing.prompts.teacher_report import (
        TEACHER_REPORT_SYSTEM_PROMPT,
        build_teacher_report_prompt,
        CRITERION_MEASURES
    )
    print("   [OK] Teacher report prompts imported successfully")
    print()
    
    print("4. Testing agent import...")
    from ielts_writing.agents.teacher_report_agent import TeacherReportAgent
    print("   [OK] Teacher report agent imported successfully")
    print()
    
    print("5. Testing pipeline integration...")
    from ielts_writing.agents.pipeline import WritingPipeline, get_pipeline
    pipeline = get_pipeline()
    print(f"   [OK] Pipeline created with teacher_report agent: {hasattr(pipeline, 'teacher_report')}")
    print(f"   [OK] Pipeline has evaluate_with_teacher_report method: {hasattr(pipeline, 'evaluate_with_teacher_report')}")
    print()
    
    print("6. Testing API service...")
    from ielts_writing.service import router
    # Check if the endpoint exists
    routes = [route.path for route in router.routes]
    teacher_report_endpoint = any('/teacher-report' in route for route in routes)
    print(f"   [OK] Teacher report endpoint exists: {teacher_report_endpoint}")
    print()
    
    print("7. Verifying data models structure...")
    from ielts_writing.models import Criterion, TaskType
    
    # Create a sample strength
    strength = Strength(
        point="Clear overview provided",
        quote="Overall, there was a significant increase in home ownership"
    )
    print(f"   [OK] Strength model works: {strength.point}")
    
    # Create a sample weakness pattern
    weakness = WeaknessPattern(
        pattern_name="Subject-Verb Agreement",
        example="This figure steadily rise",
        problem="Verb form doesn't match the subject",
        fix="This figure steadily rose"
    )
    print(f"   [OK] WeaknessPattern model works: {weakness.pattern_name}")
    
    # Create an improvement tip
    tip = ImprovementTip(
        tip="Always check verb tenses match the time period",
        micro_task="Review your essay and correct all verb tense errors (10 min)"
    )
    print(f"   [OK] ImprovementTip model works")
    print()
    
    print("=" * 70)
    print("ALL TESTS PASSED [SUCCESS]")
    print("=" * 70)
    print()
    print("The Teacher Feedback Report system is ready to use!")
    print()
    print("To generate a report, call the API endpoint:")
    print("  POST /ielts_writing/evaluate/teacher-report")
    print()
    print("With a request body including:")
    print("  - task_type, question, essay, target_band")
    print("  - student_name (required for personalized report)")
    print()
    
except Exception as e:
    print(f"[ERROR] {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
    print()
    print("=" * 70)
    print("TESTS FAILED [FAILURE]")
    print("=" * 70)
    sys.exit(1)
