"""
Test script for Task 1 Writing Feedback with new teacher_report.py prompt
"""
import requests
import json

# Sample Task 1 essay
SAMPLE_ESSAY = """The line graph shows internet users in three countries from 1999 to 2009. Overall, all countries increased. The USA had the most users throughout. FINAL VERIFICATION RUN.

In 1999, the USA had about 20% internet users. This rose steadily to around 80% by 2009. Canada started at approximately 10% in 1999. It increased gradually to about 100% in 2009.

Mexico had the lowest percentage in 1999 at around 5%. The figure remained low until 2005, when it was still only about 25%. However, from 2005 to 2009, Mexico experienced rapid growth, reaching approximately 40% by the end of the period.

In conclusion, all three countries showed an upward trend in internet usage over the ten-year period, with Canada showing the most dramatic increase."""

SAMPLE_QUESTION = "The graph below shows the percentage of internet users in three countries between 1999 and 2009. Summarize the information by selecting and reporting the main features, and make comparisons where relevant."

# API endpoint
API_URL = "http://localhost:8002/task1/evaluate"

# Request payload
payload = {
    "essay": SAMPLE_ESSAY,
    "question": SAMPLE_QUESTION,
    "student_name": "Test Student",
    "chart_type": "Line Graph",
    "image_url": None,
    "include_teacher_feedback": True,
    "include_markdown": True
}

print("=" * 80)
print("TESTING TASK 1 FEEDBACK WITH NEW TEACHER_REPORT.PY PROMPT")
print("=" * 80)
print(f"\nSending request to: {API_URL}")
print(f"Essay length: {len(SAMPLE_ESSAY.split())} words")
print("\nWaiting for response (this may take 30-60 seconds)...\n")

try:
    response = requests.post(API_URL, json=payload, timeout=120)
    
    if response.status_code == 200:
        data = response.json()
        
        print("SUCCESS - Response received!")
        print("=" * 80)
        
        # Display scores
        if "scores" in data:
            scores = data["scores"]
            print(f"OVERALL BAND: {scores.get('overall_band', 'N/A')}")
            print(f"Word Count: {scores.get('word_count', 'N/A')}")
            print("\nCriterion Scores:")
            for criterion in scores.get("criterion_scores", []):
                print(f"  * {criterion['criterion']}: {criterion['band']}")
        
        # Check teacher feedback status
        print(f"\nTeacher Feedback Status: {data.get('teacher_feedback_status', 'N/A')}")
        
        # Display teacher feedback structure if available
        if data.get("teacher_feedback"):
            tf = data["teacher_feedback"]
            print("\nTeacher Feedback Structure:")
            print(f"  - Has overall_summary: {bool(tf.get('overall_summary'))}")
            print(f"  - Has task_achievement: {bool(tf.get('task_achievement'))}")
            print(f"  - Has coherence_cohesion: {bool(tf.get('coherence_cohesion'))}")
            print(f"  - Has lexical_resource: {bool(tf.get('lexical_resource'))}")
            print(f"  - Has grammatical_range: {bool(tf.get('grammatical_range'))}")
            print(f"  - Has action_plan: {bool(tf.get('action_plan'))}")
            
            # Show a sample of the overall summary
            if tf.get('overall_summary'):
                summary = tf['overall_summary']
                print(f"\nOverall Summary Preview:")
                print(f"  Student Name: {summary.get('student_name', 'N/A')}")
                print(f"  Personal Note: {summary.get('personal_note', 'N/A')[:100]}...")
                print(f"  Superpower: {summary.get('superpower', 'N/A')[:80]}...")
                print(f"  Priority: {summary.get('priority', 'N/A')[:80]}...")
        
        # Check markdown feedback
        if data.get("feedback_markdown"):
            markdown_length = len(data["feedback_markdown"])
            print(f"\nMarkdown Feedback: {markdown_length} characters")
            print(f"  Preview (first 200 chars):")
            print(f"  {data['feedback_markdown'][:200]}...")
        
        # Timing info
        if data.get("timing"):
            timing = data["timing"]
            print(f"\nTiming:")
            print(f"  Examiner: {timing.get('examiner', 'N/A')}s")
            print(f"  Teacher: {timing.get('teacher', 'N/A')}s")
        
        print("\n" + "=" * 80)
        print("TEST COMPLETED SUCCESSFULLY")
        print("=" * 80)
        
        # Save full response to file for inspection
        with open("test_task1_response.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print("\nFull response saved to: test_task1_response.json")
        
    else:
        print(f"ERROR - Status Code: {response.status_code}")
        try:
            print(f"Response: {response.text}")
        except:
            print(f"Response (raw): {response.content}")
        
except requests.exceptions.Timeout:
    print("ERROR - Request timed out after 120 seconds")
except requests.exceptions.ConnectionError:
    print("ERROR - Could not connect to the API. Is the backend running?")
except Exception as e:
    print(f"ERROR - {type(e).__name__}: {str(e)}")
