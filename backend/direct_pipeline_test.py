"""Direct pipeline test - bypasses HTTP/auth to catch [Errno 22] traceback."""
import asyncio
import os
import sys
import traceback

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

# Load env
from dotenv import load_dotenv
load_dotenv()

async def main():
    print("=" * 60)
    print("DIRECT PIPELINE TEST - Bypassing HTTP")
    print(f"CWD: {os.getcwd()}")
    print(f"Python: {sys.executable}")
    print("=" * 60)
    
    try:
        print("\n1. Importing Task1Pipeline...")
        from ielts_writing.pipelines.task1_pipeline import Task1Pipeline
        print("   OK")
        
        print("\n2. Creating pipeline instance...")
        pipeline = Task1Pipeline()
        print(f"   OK - Examiner model: {pipeline.examiner.model}")
        
        print("\n3. Calling evaluate_async...")
        result = await pipeline.evaluate_async(
            essay="The bar chart shows the number of visitors to three London museums between 2007 and 2012. Overall, the British Museum had the most visitors throughout the period. The British Museum started with approximately 5 million visitors in 2007 and rose steadily to about 5.9 million in 2012. The National Gallery began at around 4.2 million in 2007 and ended at roughly 5.2 million in 2012. The Science Museum had the most stable trend beginning at about 2.7 million in 2007 and ending at approximately 3.3 million in 2012.",
            question="The bar chart below shows the number of visitors to three London museums between 2007 and 2012.",
            student_name="DirectTest",
            chart_type="bar_chart",
            image_url=None,
            image_description="Bar chart showing visitor numbers for British Museum National Gallery Science Museum from 2007 to 2012.",
            include_teacher_feedback=True,
            return_markdown=True
        )
        
        print(f"\n4. Result received:")
        print(f"   success: {result.get('success')}")
        print(f"   error: {result.get('error')}")
        if result.get('traceback'):
            print(f"\n   TRACEBACK:\n{result.get('traceback')}")
        if result.get('success'):
            print(f"   overall_band: {result.get('scores', {}).get('overall_band')}")
            print(f"   explanations_status: {result.get('explanations_status')}")
        
    except Exception as e:
        print(f"\n!!! EXCEPTION CAUGHT !!!")
        print(f"Type: {type(e).__name__}")
        print(f"Message: {e}")
        print(f"\nFULL TRACEBACK:")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
