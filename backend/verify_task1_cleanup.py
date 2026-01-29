
import asyncio
import os
import json
import logging
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure we can import from backend
import sys
sys.path.append(os.getcwd())

from ielts_writing.pipelines.task1_pipeline import Task1Pipeline

async def main():
    print("\n--- Starting Task 1 Cleanup Verification ---\n")
    
    pipeline = Task1Pipeline()
    
    question = "The chart below shows the number of men and women in further education in Britain in three periods and whether they were studying full-time or part-time. Summarise the information by selecting and reporting the main features, and make comparisons where relevant."
    
    essay = """
    The bar chart illustrates the number of men and women in further education in Britain in three time periods (1970/71, 1980/81 and 1990/91). It also indicates whether they were studying full-time or part-time.

    Overall, it is clear that the number of people in further education increased over the period shown. In addition, majority of people were studying part-time rather than full-time.

    In 1970/71, the number of men studying part-time was about 1 million, which was highest among all categories. This number remained stable until 1990/91. On the other hand, the number of women studying part-time started at around 700,000 and increased steadily to over 1.1 million in 1990/91, overtaking the number of men.

    Regarding full-time education, the numbers were significantly lower. The number of men studying full-time started at about 100,000 and rose to around 200,000 in 1990/91. Similarly, the number of women in full-time education increased from under 100,000 to over 200,000 at the end of the period.
    """
    
    print("Evaluating essay...")
    try:
        result = await pipeline.evaluate_async(
            essay=essay,
            question=question,
            chart_type="bar_chart",
            student_name="TestUser"
        )
        
        print("\n--- Evaluation Complete ---\n")
        
        # Check scores
        scores = result.get('scores', {})
        print(f"Overall Band: {scores.get('overall_band')}")
        print(f"Task Achievement: {scores.get('criterion_scores', [{}])[0].get('band')}")
        
        # Check explanations
        explanations = result.get('explanations')
        if explanations:
            print("\n✅ Explanations FOUND!")
            print(f"Type of explanation: {type(explanations)}")
            if hasattr(explanations, 'task_achievement'):
                print(f"TA Explanation: {explanations.task_achievement.explanation[:100]}...")
            elif isinstance(explanations, dict):
                 print(f"TA Explanation: {explanations.get('task_achievement', {}).get('explanation', '')[:100]}...")
            else:
                 print(f"Raw explanation: {str(explanations)[:100]}...")
        else:
            print("\n❌ Explanations MISSING or None")
            
        # Check teacher feedback (should be None)
        teacher = result.get('teacher_feedback')
        print(f"\nTeacher Feedback (should be None): {teacher}")
        
    except Exception as e:
        print(f"\n❌ Error during evaluation: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
