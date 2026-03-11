import asyncio
import json
import sys
import os

# Ensure backend directory is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ielts_writing.task2_pipeline import Task2Pipeline

QUESTION = """Some people say that the best way to improve public health is by increasing the number of sports facilities. Others, however, say that this would have little effect on public health and that other measures are required. Discuss both these views and give your own opinion."""

ESSAY = """A problem of modern societies is the declining level of health in the general population, with the result that many people suffer from lifestyle related diseases. Some people say that by building more sports facilities we can improve public health. However, others argue that this depends on other measures. I think that although more sports facilities are useful, other measures are more important.

On the one hand, building more sports facilities would help to improve public health. This is because if there are more places to play sports, more people will play them. For example, if a city builds a new swimming pool, many people who did not swim before will start to go there. As a result, they will be healthier. Furthermore, sports facilities provide a place for young people to do healthy activities instead of playing video games.

On the other hand, just having more facilities is not enough. This is because many people are too busy or lazy to use them. If the government builds a gym but people do not want to exercise, it will be empty. Therefore, other measures are needed. One measure is education. Schools should teach children about the importance of a healthy diet and regular exercise. Another measure is to make healthy food cheaper and junk food more expensive.

In conclusion, while increasing the number of sports facilities can help to improve public health, it is not enough on its own. Education and a healthy diet are also very important measures that should be taken to solve this problem."""

async def main():
    print(f"Testing real IELTS essay (approx Band 6.0/6.5)...\n")
    print(f"Question: {QUESTION}")
    print(f"Essay ({len(ESSAY.split())} words):\n{ESSAY}\n")
    
    print("Running Task 2 Pipeline...")
    pipeline = Task2Pipeline()
    try:
        result = await pipeline.evaluate_essay(ESSAY, QUESTION)
        print("\n--- RESULTS ---\n")
        
        eval_data = result.get('evaluation')
        if not eval_data:
            print("Evaluation failed or returned empty data.")
            return

        scores = eval_data.band_scores
        print(f"Overall Band: {scores.overall}")
        print(f"TR (Task Response): {scores.task_response}")
        print(f"CC (Coherence & Cohesion): {scores.coherence_cohesion}")
        print(f"LR (Lexical Resource): {scores.lexical_resource}")
        print(f"GRA (Grammatical Range & Accuracy): {scores.grammatical_range_accuracy}")
        
        import json
        with open('test_result.json', 'w') as f:
            # result might be a dict containing pydantic models or dicts
            # let's write it as a formatted string
            pass
        
        # Save evaluation data to json manually
        eval_dict = eval_data.model_dump()
        with open('test_result.json', 'w', encoding='utf-8') as f:
            json.dump(eval_dict, f, indent=2)
            
        print("Detailed results saved to test_result.json")
    except Exception as e:
        print(f"Error evaluating essay: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
