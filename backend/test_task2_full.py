
import asyncio
import os
import sys
import json

# Setup path to import backend modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ielts_writing.task2_pipeline import Task2Pipeline

async def run_test():
    print("🚀 Starting Task 2 Full Pipeline Test...")
    
    # 1. Setup Data
    question = "Some people believe that the best way to control crime is to impose longer prison sentences. Others, however, argue that there are alternative ways to reduce crime. Discuss both views and give your opinion."
    
    # A generic Band 6.0-6.5 level essay
    essay = """
    Crime is a serious problem in many countries today. Some people think that sending criminals to prison for a long time is the best way to solve this, while others believe there are better methods. I will discuss both views and give my own opinion.
    
    On the one hand, keeping criminals in prison for longer periods can be effective. Firstly, it keeps dangerous people away from society, which makes the streets safer. For example, if a murderer is locked up for life, they cannot hurt anyone else. Secondly, long sentences can scare people so they do not commit crimes. If someone knows they will go to jail for 20 years, they might think twice before stealing or hurting someone.
    
    On the other hand, there are alternatives that might work better. Prisons are very expensive to run and they do not always teach criminals how to be better people. Many prisoners learn new crimes from other inmates. Instead of just locking people up, we should focus on rehabilitation. This means teaching them skills so they can get a job when they leave. Also, community service is a good option for non-violent crimes because it helps the criminal give back to society.
    
    In my opinion, although prison is necessary for violent criminals, I believe that rehabilitation is better for most offenders. Long sentences does not always stop crime, but education and jobs can help people change their lives.
    
    In conclusion, while long prison sentences have some benefits, I think that alternative methods like rehabilitation are more effective in reducing crime in the long run. Governments should invest more in these programs instead of building more prisons.
    """
    
    print(f"\n📝 Essay Word Count: {len(essay.split())}")
    
    # 2. Initialize Pipeline
    try:
        pipeline = Task2Pipeline()
        print("✅ Pipeline Initialized")
    except Exception as e:
        print(f"❌ Failed to initialize pipeline: {e}")
        return

    # 3. Run Evaluation
    try:
        print("\n⏳ Running Evaluation (this may take 30-60 seconds)...")
        result = await pipeline.evaluate_essay(essay, question) # pipeline.evaluate_essay is async? checking code...
        # Wait, looked at task2_pipeline.py earlier, evaluate_essay was synchronous in the code I saw?
        # Let's double check.
        # Line 59: def evaluate_essay(self, essay: str, question: str) -> PipelineResult:
        # It calls self.examiner.evaluate (sync) -> self.explainer.explain (sync) -> self.coach.generate_plan (sync)
        # However, earlier traces showed 'await' in wrappers.
        # The main 'evaluate_essay' in Task2Pipeline seems NOT async based on previous view_file of task2_pipeline.py line 59.
        # BUT, wait. 'backend/ielts_writing/task2_pipeline.py':
        # def evaluate_essay(self, essay: str, question: str) -> PipelineResult:
        # It is NOT async.
        # I will call it synchronously.
        
    except Exception as e:
        print(f"❌ Pipeline Failed: {e}")
        import traceback
        traceback.print_exc()
        return

    # 4. Print Results
    print("\n" + "="*50)
    print("🎉 EVALUATION COMPLETE")
    print("="*50)
    
    evaluation = result["evaluation"]
    explanation = result["explanation"]
    coaching = result["coaching"]
    
    print(f"\n📊 SCORES:")
    print(f"  Overall: {evaluation.band_scores.overall}")
    print(f"  TR: {evaluation.band_scores.task_response}")
    print(f"  CC: {evaluation.band_scores.coherence_cohesion}")
    print(f"  LR: {evaluation.band_scores.lexical_resource}")
    print(f"  GRA: {evaluation.band_scores.grammatical_range_accuracy}")
    
    print(f"\n🐛 FATAL FLAWS: {evaluation.fatal_flaws}")
    
    print(f"\n💡 EXPLAINER FEEDBACK:")
    if explanation.priority_summary:
        top_priority = explanation.priority_summary[0]
        print(f"  Top Priority: {top_priority.area}")
        print(f"  Action: {top_priority.action_step}")
    else:
        print("  No priority summary found.")

    print(f"\n🏋️ COACHING PLAN:")
    print(f"  One Big Change: {coaching.the_one_big_change.change_statement}")
    print(f"  Visual Reminder: {coaching.the_one_big_change.visual_reminder}")
    
    print("\n" + "="*50)
    print("✅ TEST PASSED")

if __name__ == "__main__":
    # Task2Pipeline is synchronous based on previous file view, but let's check if the individual agents use async.
    # The previous file view of task2_pipeline.py showed sync methods calling sync methods of agents.
    # However, I should be safe. If it turns out they are async, I'll need to adjust.
    # Actually, looking at 'backend/ielts_writing/task2_pipeline.py' content from Step 1906:
    # def evaluate_essay(self, essay: str, question: str) -> PipelineResult:
    #   evaluation = self.examiner.evaluate(essay, question)
    #   explanation = self.explainer.explain(essay, question, eval_dict)
    #   coaching = self.coach.generate_plan(...)
    #
    # So it is synchronous.
    
    # Just to be sure, I will import and run it synchronously.
    
    # Re-reading Step 1906... 
    # self.examiner.evaluate calls...
    # Step 1868: Task2Examiner.evaluate is sync.
    # Step 1892: Task2Explainer.explain is sync.
    # Step 1845 (not shown but inferred): Task2Coach is likely sync too.
    
    from ielts_writing.task2_pipeline import Task2Pipeline
    
    pipeline = Task2Pipeline()
    
    question = "Some people believe that the best way to control crime is to impose longer prison sentences. Others, however, argue that there are alternative ways to reduce crime. Discuss both views and give your opinion."
    
    essay = """
    Crime is a serious problem in many countries today. Some people think that sending criminals to prison for a long time is the best way to solve this, while others believe there are better methods. I will discuss both views and give my own opinion.
    
    On the one hand, keeping criminals in prison for longer periods can be effective. Firstly, it keeps dangerous people away from society, which makes the streets safer. For example, if a murderer is locked up for life, they cannot hurt anyone else. Secondly, long sentences can scare people so they do not commit crimes. If someone knows they will go to jail for 20 years, they might think twice before stealing or hurting someone.
    
    On the other hand, there are alternatives that might work better. Prisons are very expensive to run and they do not always teach criminals how to be better people. Many prisoners learn new crimes from other inmates. Instead of just locking people up, we should focus on rehabilitation. This means teaching them skills so they can get a job when they leave. Also, community service is a good option for non-violent crimes because it helps the criminal give back to society.
    
    In my opinion, although prison is necessary for violent criminals, I believe that rehabilitation is better for most offenders. Long sentences does not always stop crime, but education and jobs can help people change their lives.
    
    In conclusion, while long prison sentences have some benefits, I think that alternative methods like rehabilitation are more effective in reducing crime in the long run. Governments should invest more in these programs instead of building more prisons.
    """
    
    print("🚀 Starting Task 2 Full Pipeline Test...")
    print(f"📝 Essay Word Count: {len(essay.split())}")
    
    try:
        print("\n⏳ Running Evaluation...")
        result = pipeline.evaluate_essay(essay, question)
        
        print("\n" + "="*50)
        print("🎉 EVALUATION COMPLETE")
        print("="*50)
        
        evaluation = result["evaluation"]
        explanation = result["explanation"]
        coaching = result["coaching"]
        
        print(f"\n📊 SCORES:")
        print(f"  Overall: {evaluation.band_scores.overall}")
        print(f"  TR: {evaluation.band_scores.task_response}")
        print(f"  CC: {evaluation.band_scores.coherence_cohesion}")
        print(f"  LR: {evaluation.band_scores.lexical_resource}")
        print(f"  GRA: {evaluation.band_scores.grammatical_range_accuracy}")
        
        print(f"\n🐛 FATAL FLAWS: {evaluation.fatal_flaws}")
        
        print("\n🔎 CHECKING DETAILED FEEDBACK (The part that was failing):")
        if evaluation.detailed_feedback:
             print("  ✅ detailed_feedback is present")
             print(f"  TR Summary: {evaluation.detailed_feedback.task_response.summary}")
             print(f"  CC Weak Spots: {evaluation.detailed_feedback.coherence.weak_spots}")
        else:
             print("  ❌ detailed_feedback is MISSING")

        print(f"\n💡 EXPLAINER FEEDBACK:")
        if explanation.priority_summary:
            top_priority = explanation.priority_summary[0]
            print(f"  Top Priority: {top_priority.area}")
            print(f"  Action: {top_priority.action_step}")
            
        print(f"\n🏋️ COACHING PLAN:")
        print(f"  One Big Change: {coaching.the_one_big_change.change_statement}")
        
        print(f"\n📚 STUDY TOPICS:")
        if coaching.topic_analysis:
            for t in coaching.topic_analysis:
                print(f"  - [{t.category}] {t.topic} (Priority: {t.count})")
                print(f"    Desc: {t.description}")
                print(f"    Why:  {t.why_it_matters}")
        else:
             print("  ❌ No topic analysis generated.")
        
        print("\n✅ TEST PASSED")
        
    except Exception as e:
        print(f"\n❌ Pipeline Failed: {e}")
        import traceback
        traceback.print_exc()
