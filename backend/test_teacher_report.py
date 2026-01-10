"""
Test script for Teacher Feedback Report generation.
Run this to verify the teacher report system works correctly.
"""

import asyncio
import json
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from ielts_writing.models import EvaluateRequest, TaskType
from ielts_writing.agents.pipeline import get_pipeline


# Sample Task 1 essay (intentionally has errors for testing)
SAMPLE_QUESTION = """
The chart below shows the percentage of households in owned and rented 
accommodation in England and Wales between 1918 and 2011.

Summarize the information by selecting and reporting the main features, 
and make comparisons where relevant.
"""

SAMPLE_ESSAY = """
The bar chart illustrates the proportion of households that owned and rented 
accommodation in England and Wales from 1918 to 2011. Overall, there was a 
significant increase in home ownership over the period, while renting shows 
opposite trend.

In 1918, around 23% of households owned their homes, with the remaining 77% 
renting. This figure steadily rise until it peaked at approximately 69% in 
2001. However, after this point, home ownership declined slightly to around 
65% by 2011.

In contrast, the percentage of rented accommodation fell dramatically 
throughout the period. Starting from 77% in 1918, it decreased to it's 
lowest point of roughly 31% in 2001. Similar to home ownership, there was 
a small increase to about 35% in 2011.

It is clear that home ownership became increasingly popular during the 
20th century, with more and more people owning rather than renting.
"""


async def test_teacher_report():
    """Test teacher report generation with a sample essay."""
    
    print("=" * 70)
    print("TESTING TEACHER FEEDBACK REPORT GENERATION")
    print("=" * 70)
    print()
    
    # Create request
    request = EvaluateRequest(
        task_type=TaskType.TASK1,
        question=SAMPLE_QUESTION,
        essay=SAMPLE_ESSAY,
        target_band=7.0,
        student_name="Sarah"  # Test personalization
    )
    
    print(f"Student Name: {request.student_name}")
    print(f"Task Type: {request.task_type}")
    print(f"Target Band: {request.target_band}")
    print(f"Essay Length: {len(SAMPLE_ESSAY)} characters")
    print()
    print("-" * 70)
    print("Generating teacher report (this may take 30-60 seconds)...")
    print("-" * 70)
    print()
    
    # Get pipeline and generate report
    pipeline = get_pipeline()
    
    try:
        result = await pipeline.evaluate_with_teacher_report(request)
        
        print("✅ Teacher report generated successfully!")
        print()
        print("=" * 70)
        print("REPORT STRUCTURE VERIFICATION")
        print("=" * 70)
        print()
        
        # Check if report exists
        if result.teacher_report:
            report = result.teacher_report
            
            print(f"✅ Student Name Used: {report.student_name}")
            print(f"✅ Overall Summary Present: {bool(report.overall_summary)}")
            print(f"   - Superpower: {report.overall_summary.superpower[:60]}...")
            print(f"   - Priority: {report.overall_summary.priority[:60]}...")
            print()
            
            # Check each criterion
            criteria = [
                ("Task Achievement", report.task_achievement),
                ("Coherence & Cohesion", report.coherence_cohesion),
                ("Lexical Resource", report.lexical_resource),
                ("Grammatical Range & Accuracy", report.grammatical_range_accuracy)
            ]
            
            for name, criterion_feedback in criteria:
                print(f"✅ {name}: Band {criterion_feedback.band}")
                print(f"   - Strengths: {len(criterion_feedback.strengths)}")
                print(f"   - Weaknesses: {len(criterion_feedback.weaknesses)}")
                print(f"   - Improvement tip present: {bool(criterion_feedback.improvement.tip)}")
                
                # Show first strength with quote
                if criterion_feedback.strengths:
                    first_strength = criterion_feedback.strengths[0]
                    print(f"   - Example strength: \"{first_strength.quote[:50]}...\"")
                
                # Show first weakness pattern
                if criterion_feedback.weaknesses:
                    first_weakness = criterion_feedback.weaknesses[0]
                    print(f"   - Example weakness: {first_weakness.pattern_name}")
                print()
            
            print(f"✅ Final Action Plan:")
            print(f"   - Priority: {report.final_action_plan.priority_criterion}")
            print(f"   - Reason: {report.final_action_plan.reason}")
            print()
            
            # Save full report to file for inspection
            output_file = "teacher_report_sample.json"
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(result.model_dump(), f, indent=2, default=str)
            
            print(f"📄 Full report saved to: {output_file}")
            print()
            print("=" * 70)
            print("TEST PASSED ✅")
            print("=" * 70)
            
        else:
            print("❌ ERROR: Teacher report was not generated")
            print("   Check that student_name is provided in request")
            
    except Exception as e:
        print(f"❌ ERROR: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        print()
        print("=" * 70)
        print("TEST FAILED ❌")
        print("=" * 70)


if __name__ == "__main__":
    asyncio.run(test_teacher_report())
