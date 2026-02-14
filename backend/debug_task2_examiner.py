
import os
import sys
import asyncio
import json

# Setup path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ielts_writing.agents.examiner.task2_examiner import Task2Examiner

async def run_debug():
    print("--- STARTING EXAMINER DEBUG RUN ---")
    
    # Force use of OpenRouter (simulating user config)
    # Note: Requires OPENROUTER_API_KEY in environment
    
    model_name = "anthropic/claude-3.5-sonnet"
    print(f"Testing Examiner with model: {model_name}")
    
    try:
        examiner = Task2Examiner(model=model_name)
        
        essay = "This is a test essay about environmental issues. We should protect nature because it is good."
        question = "Some people think we should protect the environment. Others say economy is more important. Discuss both views."
        
        print("Sending request to LLM (via OpenRouter)...")
        result = examiner.evaluate(essay=essay, question=question)
        
        print("\n--- RESULT ---")
        print(f"Overall Band: {result.band_scores.overall}")
        
        if result.detailed_feedback:
            print("\n--- DETAILED FEEDBACK ---")
            print(result.detailed_feedback.model_dump_json(indent=2))
        else:
            print("\n❌ NO DETAILED FEEDBACK FOUND")
            
        print("Success!")

    except Exception as e:
        print(f"CRASH: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Ensure loop policy for Windows if needed, though asyncio.run usually handles it
    asyncio.run(run_debug())
