import requests
import json
import time

# --- TASK 1 QUESTION & ESSAY ---
QUESTION = "The graph below shows the percentage of internet users in three countries between 1999 and 2009. Summarize the information by selecting and reporting the main features, and make comparisons where relevant."

# Drafting a Band 7+ response
ESSAY = """The line graph illustrates the proportion of the population using the internet in the USA, Canada, and Mexico over a ten-year period from 1999 to 2009.

Overall, it is clear that internet usage increased significantly in all three nations throughout the period. The USA and Canada maintained higher percentages of users compared to Mexico, which showed the most rapid growth in the latter half of the decade.

In 1999, the USA led with roughly 20% of its population online, while Canada followed closely at 10%. By 2005, both countries saw a steady rise, with the USA reaching approximately 70% and Canada overtaking it to reach nearly 80%. By the end of the period in 2009, Canadian internet users peaked at about 90%, slightly outstripping the USA, which finished at 80%.

Mexico, by contrast, started with a negligible percentage of users in 1999 (about 5%). This figure grew slowly to 25% by 2005. However, between 2005 and 2009, the country experienced a surge in connectivity, with the number of users jumping to 40%. Despite this substantial increase, Mexico's usage remained below that of the other two countries for the entire duration."""

# --- TEST EXECUTION ---
API_URL = "http://localhost:8002/task1/evaluate"

payload = {
    "essay": ESSAY,
    "question": QUESTION,
    "student_name": "Antigravity AI",
    "chart_type": "Line Graph",
    "image_url": None,
    "include_teacher_feedback": True,
    "include_markdown": True
}

def run_test():
    print("=" * 60)
    print("IELTS WRITING TASK 1 TERMINAL TEST")
    print("=" * 60)
    print(f"\nPrompt: {QUESTION[:100]}...")
    print(f"Submitting high-quality essay ({len(ESSAY.split())} words)...")
    
    start_time = time.time()
    try:
        response = requests.post(API_URL, json=payload, timeout=180)
        duration = time.time() - start_time
        
        if response.status_code == 200:
            result = response.json()
            print(f"\nSUCCESS! Request took {duration:.2f} seconds.")
            print("-" * 60)
            
            # --- ROBUST DATA ACCESS ---
            # Using key pattern: val = item.get('key') or default
            
            # Show Scores
            scores = result.get('scores') or {}
            print(f"OVERALL BAND SCORE: {scores.get('overall_band', 'N/A')}")
            
            print("\nCRITERION BREAKDOWN:")
            criterion_scores = scores.get('criterion_scores') or []
            for s in criterion_scores:
                # s could theoretically be None if the list has nulls, though unlikely in this schema
                if not s: continue 
                
                name = str(s.get('criterion', 'Unknown')).replace('_', ' ').title()
                band = s.get('band', 'N/A')
                # Access score_explanation safely
                expl = s.get('score_explanation') or {}
                just = expl.get('why_this_score') or s.get('justification', 'No justification provided.')
                why_not = expl.get('why_not_higher')
                
                print(f"  - {name}: {band}")
                print(f"    Reasoning: {just}")
                if why_not:
                    print(f"    Why not higher? {why_not}")
                
                # Show Strong/Weak analysis
                strengths = s.get('strengths') or []
                if strengths:
                    print(f"    [+] {len(strengths)} Strength(s):")
                    for st in strengths:
                        q = st.get('quote')
                        if q: print(f"        - \"{q}\" ({st.get('explanation')})")
                
                weaknesses = s.get('weakness_patterns') or []
                if weaknesses:
                    print(f"    [-] {len(weaknesses)} Weakness Pattern(s):")
                    for w in weaknesses:
                        desc = w.get('description')
                        examples = w.get('examples') or []
                        print(f"        - {desc}")
                        if examples:
                            print(f"          Examples: {examples}")
                
                tips = s.get('tips') or []
                if tips:
                     print(f"    [!] Top Tip: {tips[0].get('tip')}")
            
            # Show Teacher Feedback Summary
            tf = result.get('teacher_feedback') or {}
            if tf:
                summary = tf.get('overall_summary') or {}
                # Check optional sub-sections safely
                
                print("\n" + "=" * 60)
                print("TEACHER'S ADVICE")
                print("=" * 60)
                print(f"Advice: {summary.get('personal_note', 'N/A')}")
                print(f"Your Superpower: {summary.get('superpower', 'N/A')}")
                print(f"Key Improvement: {summary.get('priority', 'N/A')}")
            
            # Save Result
            with open('terminal_task1_result.json', 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            print(f"\nFull detailed feedback saved to: terminal_task1_result.json")
                
        else:
            print(f"FAIL: Status code {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"SCRIPT ERROR: {str(e)}")
        # Print trace for debugging if needed
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_test()
