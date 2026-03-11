import asyncio
import json
import sys
import os

# Ensure backend directory is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ielts_writing.task2_pipeline import Task2Pipeline

# Official IELTS Band 7.5 example
# Source: Cambridge IELTS 14 Test 1 Writing Task 2
# Prompt: Some people believe that it is best to accept a bad situation, such as an unsatisfactory job or shortage of money. Others argue that it is better to try and improve such situations. Discuss both these views and give your own opinion.

QUESTION = """Some people believe that it is best to accept a bad situation, such as an unsatisfactory job or shortage of money. Others argue that it is better to try and improve such situations. Discuss both these views and give your own opinion."""

# This is an official Band 7 essay response
ESSAY = """Some people believe that it is best to accept a bad situation, such as an unsatisfactory job or shortage of money. Others argue that it is better to try and improve such situations. Discuss both these views and give your own opinion.

In society, there are two distinct attitudes towards difficult situations like an unsatisfactory job or shortage of money. Some people think it is best to accept them, while others think it is better to try and improve them. Both of these views have their merit, but I personally align with the latter perspective.

On the one hand, those who advocate accepting a bad situation often emphasize the importance of contentment and stability. From their viewpoint, constantly striving for improvement can lead to chronic dissatisfaction and stress. For instance, if someone is unhappy with their job, continuously looking for a new one might result in frequent job changes, which can be perceived negatively by future employers. Moreover, focusing on what one lacks, such as money, can overshadow the positive aspects of life. Therefore, accepting one's current circumstances can bring a sense of peace and allow individuals to appreciate what they already have.

On the other hand, proponents of trying to improve bad situations argue that human progress relies on the desire for better conditions. According to this view, accepting a bad job or financial hardship can lead to stagnation and unfulfilled potential. By actively seeking to enhance their circumstances, individuals can discover new opportunities, acquire new skills, and ultimately achieve a higher quality of life. For example, resigning from an unfulfilling job to pursue further education or a different career path can lead to greater job satisfaction and financial stability in the long run. Action, they argue, is necessary for positive change.

In my opinion, while accepting a difficult situation can be a temporary coping mechanism, the long-term goal should be to improve it. Accepting a bad situation indefinitely can lead to a sense of helplessness and resignation. It is essential to acknowledge reality but use it as a starting point for positive action. By taking proactive steps to address the root causes of the problem, individuals can empower themselves to create a better future. 

In conclusion, although accepting bad situations might offer short-term relief from stress, the pursuit of improvement is crucial for personal development and long-term satisfaction. Therefore, individuals should endeavor to change unsatisfactory aspects of their lives whenever possible."""

async def main():
    print(f"Testing real IELTS official proxy essay (approx Band 7.0/7.5)...\n")
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
        
        print("\nExaminer Justification:")
        if eval_data.detailed_feedback:
            print(f"TR: {eval_data.detailed_feedback.task_response.why_score_is_here}")
            print(f"CC: {eval_data.detailed_feedback.coherence.why_score_is_here}")
            print(f"LR: {eval_data.detailed_feedback.lexical.why_score_is_here}")
            print(f"GRA: {eval_data.detailed_feedback.grammar.why_score_is_here}")
        else:
            print("No detailed feedback generated.")
            
        import json
        eval_dict = eval_data.model_dump()
        with open('test_result_7.json', 'w', encoding='utf-8') as f:
            json.dump(eval_dict, f, indent=2)
            
        print("\nDetailed results saved to test_result_7.json")
    except Exception as e:
        print(f"Error evaluating essay: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
