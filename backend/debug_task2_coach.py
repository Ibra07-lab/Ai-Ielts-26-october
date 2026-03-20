
import os
import sys
import asyncio
import json
from datetime import datetime

# Setup path so we can import backend modules
# Add the backend directory to the search path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)


from ielts_writing.agents.coach.task2_coach import Task2Coach
from ielts_writing.schemas.task2 import IELTSEvaluation, BandScores
from ielts_writing.schemas.task2_explainer import ExplainerOutput

async def run_debug():
    print("--- STARTING DEBUG RUN ---")
    
    # Mock Data
    examiner_data = {
        "band_scores": {"overall": 5.5, "task_response": 5.0, "coherence_cohesion": 5.5, "lexical_resource": 6.0, "grammatical_range_accuracy": 5.5},
        "fatal_flaws": ["Circular/Underdeveloped Arguments"],
        "score_caps_applied": [],
        "task_type_required": "Opinion",
        "task_type_detected": "Opinion",
        "paragraph_breakdown": [],
        "analysis": {
            "linker_audit": {"mechanical_linker_ratio": 0.4},
            "cliche_audit": {"tier1_cliches": []},
            "grammar_audit": {"error_type": "SLIPS", "systematic_errors_identified": []}
        }
    }
    
    explainer_data = {
        "priority_summary": [{"area": "Task Response", "issue": "Ideas not developed"}],
        "macro_feedback": [],
        "cohesion_fixes": [],
        "vocabulary_feedback": {"cliche_replacements": []},
        "grammar_feedback": {"pattern_lessons": []},
        "immediate_focus": "Development"
    }
    
    # Initialize Coach
    try:
        coach = Task2Coach()
        print(f"Loaded Task2Coach with model: {coach.model}")
        
        # Run Generation
        print("Sending request to LLM...")
        result = await coach.coach(
            essay="This is a test essay about education.",
            question="Some people say education is important. Do you agree?",
            evaluation=examiner_data,
            explainer_output=explainer_data
        )
        
        print("\n--- RESULT ---")
        
        # Check Fields
        data = result.model_dump()
        
        print(f"Topic Vocabulary Present? {'topic_vocabulary' in data and data['topic_vocabulary'] is not None}")
        if 'topic_vocabulary' in data and data['topic_vocabulary']:
            print(json.dumps(data['topic_vocabulary'], indent=2, default=str))
            
        print(f"Coherence Advice Present? {'coherence_advice' in data and data['coherence_advice'] is not None}")
        if 'coherence_advice' in data and data['coherence_advice']:
            print(json.dumps(data['coherence_advice'], indent=2, default=str))

    except Exception as e:
        print(f"CRASH: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(run_debug())
