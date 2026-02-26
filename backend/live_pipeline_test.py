"""
Live test: Run the Task 2 pipeline with a sample essay and save full output.
This calls real LLMs — requires valid API keys.
"""
import asyncio
import json
import time
import sys
import io

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
sys.path.insert(0, ".")

from ielts_writing.task2_pipeline import Task2Pipeline

SAMPLE_ESSAY = """In today's world, the debate about whether governments should invest more in public transport has become increasingly relevant. In my opinion, governments should prioritize investment in public transportation systems.

Firstly, public transport reduces traffic congestion. When more people use buses and trains, fewer private cars are on the roads. For example, cities like London and Tokyo have efficient metro systems that significantly reduce the number of vehicles on the road.

Secondly, public transport is more environmentally friendly. Buses and trains produce fewer emissions per passenger compared to individual cars. This is crucial in the fight against climate change.

In conclusion, investing in public transport is essential for reducing both congestion and environmental damage. Governments should allocate more funds to improve and expand public transportation networks."""

SAMPLE_QUESTION = "Some people think that governments should invest more money in public transport. Others believe that there are better ways to spend government money. Discuss both views and give your own opinion."


async def main():
    print("=" * 60)
    print("LIVE PIPELINE TEST — Task 2 Evaluation")
    print("=" * 60)
    print(f"\nEssay: {len(SAMPLE_ESSAY.split())} words")
    print(f"Question: {SAMPLE_QUESTION[:80]}...")
    print("\nStarting pipeline (this takes ~30-60 seconds)...\n")

    pipeline = Task2Pipeline()
    start = time.time()

    try:
        result = await pipeline.evaluate_essay(SAMPLE_ESSAY, SAMPLE_QUESTION)
        elapsed = time.time() - start

        print(f"\n✅ Pipeline complete in {elapsed:.1f}s\n")

        # Save full output
        output = {
            "evaluation": result["evaluation"].model_dump(),
            "explanation": result["explanation"].model_dump(),
            "coaching": result["coaching"].model_dump(),
            "timing_seconds": round(elapsed, 2)
        }

        with open("live_test_output.json", "w", encoding="utf-8") as f:
            json.dump(output, f, indent=2, ensure_ascii=False, default=str)

        print("📄 Full output saved to: live_test_output.json")

        # Print key highlights
        eval_data = result["evaluation"]
        expl_data = result["explanation"]
        coach_data = result["coaching"]

        print("\n" + "=" * 60)
        print("EXAMINER — Band Scores")
        print("=" * 60)
        scores = eval_data.band_scores
        print(f"  Task Response:    {scores.task_response}")
        print(f"  Coherence:        {scores.coherence_cohesion}")
        print(f"  Lexical Resource: {scores.lexical_resource}")
        print(f"  Grammar:          {scores.grammatical_range_accuracy}")
        print(f"  OVERALL:          {scores.overall}")
        print(f"  Fatal Flaws:      {eval_data.fatal_flaws}")

        print("\n" + "=" * 60)
        print("EXPLAINER — Priority Summary")
        print("=" * 60)
        if expl_data.priority_summary:
            for i, p in enumerate(expl_data.priority_summary, 1):
                print(f"\n  Priority {i}:")
                # Handle both possible field names
                area = getattr(p, 'area', None)
                impact = getattr(p, 'current_impact', None) or getattr(p, 'current_problem', None) or getattr(p, 'score_impact', None)
                action = getattr(p, 'recommended_action', None) or getattr(p, 'action_step', None)
                if area:
                    print(f"    Area: {area}")
                if impact:
                    print(f"    Impact: {impact}")
                if action:
                    print(f"    Action: {action}")

        print(f"\n  One thing done well: {expl_data.one_thing_done_well}")
        print(f"  Immediate focus: {expl_data.immediate_focus}")

        if expl_data.macro_feedback:
            print("\n  MACRO FEEDBACK (Paragraph Rewrites):")
            for m in expl_data.macro_feedback[:2]:
                issue_type = getattr(m, 'issue_type', None) or getattr(m, 'issue_identified', None)
                print(f"    Paragraph {m.paragraph_index}: {issue_type}")
                if m.peel_breakdown:
                    print(f"      P: {m.peel_breakdown.point}")
                    print(f"      E: {m.peel_breakdown.explain}")
                    print(f"      E: {m.peel_breakdown.example}")
                    print(f"      L: {m.peel_breakdown.link}")

        print("\n" + "=" * 60)
        print("COACH — One Big Change")
        print("=" * 60)
        obc = coach_data.the_one_big_change
        print(f"  Statement: {obc.change_statement}")
        print(f"  Why:       {obc.why_this_matters_most}")
        print(f"  Stop:      {obc.what_to_stop_doing}")
        print(f"  Start:     {obc.what_to_start_doing}")
        print(f"  Visual:    {obc.visual_reminder}")

        print("\n" + "=" * 60)
        print(f"Done! Full JSON in live_test_output.json")
        print("=" * 60)

    except Exception as e:
        import traceback
        elapsed = time.time() - start
        print(f"\n❌ Pipeline failed after {elapsed:.1f}s")
        print(f"Error: {type(e).__name__}: {e}")
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
