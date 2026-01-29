"""
Simple test to count strengths and mistakes in Explanation Agent output
"""
import os
import sys

# Load environment variables from backend/.env
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), 'backend', '.env'))

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

import asyncio
import json
from ielts_writing.pipelines.task1_pipeline import Task1Pipeline

async def test_explanation_counts():
    # Test essay with deliberate data error
    question = """The bar chart shows the average daily water consumption per person in five cities in 2010 and 2020. It is measured by litres per day."""
    
    essay = """The bar chart show the average daily water consumption per person in five cities in 2010 and 2020, it is measured by litres per day. Overall, it is clear that water consumption was decreased in most of the cities during the ten years. City D is the city which had the highest water use in both years, and City C use the lowest water in 2010. In 2010, City D had the highest number with about 240 litres per person in a day. City B and City E was after that, which was around 210 and 200 litres. City A consume nearly 180 litres, while City C was the lowest one with about 160 litres per day. In 2020, water usage fall in four cities except City C."""
    
    image_description = {
        "chart_type": "bar_chart",
        "title": "Average Daily Water Consumption per Person (2010 vs 2020)",
        "data_points": [
            {"city": "City A", "year": 2010, "value": 180, "unit": "litres/day"},
            {"city": "City A", "year": 2020, "value": 160, "unit": "litres/day"},
            {"city": "City B", "year": 2010, "value": 210, "unit": "litres/day"},
            {"city": "City B", "year": 2020, "value": 190, "unit": "litres/day"},
            {"city": "City C", "year": 2010, "value": 160, "unit": "litres/day"},
            {"city": "City C", "year": 2020, "value": 170, "unit": "litres/day"},
            {"city": "City D", "year": 2010, "value": 240, "unit": "litres/day"},
            {"city": "City D", "year": 2020, "value": 220, "unit": "litres/day"},
            {"city": "City E", "year": 2010, "value": 200, "unit": "litres/day"},
            {"city": "City E", "year": 2020, "value": 180, "unit": "litres/day"}
        ]
    }
    
    print("\\n" + "="*60)
    print("TESTING EXPLANATION AGENT - COUNTING FEEDBACK ITEMS")
    print("="*60)
    
    pipeline = Task1Pipeline()
    
    print("\\nRunning evaluation...")
    result = await pipeline.evaluate_async(
        essay=essay,
        question=question,
        image_description=json.dumps(image_description),
        include_teacher_feedback=False
    )
    
    if result.get('explanations'):
        explanations = result['explanations']
        print("\\n" + "="*60)
        print("RESULTS - FEEDBACK ITEM COUNTS")
        print("="*60)
        
        criteria = [
            ('task_achievement', 'Task Achievement'),
            ('coherence_cohesion', 'Coherence & Cohesion'),
            ('lexical_resource', 'Lexical Resource'),
            ('grammatical_range_accuracy', 'Grammatical Range & Accuracy')
        ]
        
        total_strengths = 0
        total_issues = 0
        
        for key, name in criteria:
            if key in explanations:
                exp = explanations[key]
                strengths_count = len(exp.get('what_you_did_well', []))
                issues_count = len(exp.get('main_issues', []))
                total_strengths += strengths_count
                total_issues += issues_count
                
                print(f"\\n{name}:")
                print(f"  - Strengths: {strengths_count}")
                print(f"  - Issues: {issues_count}")
        
        print("\\n" + "-"*60)
        print(f"TOTAL ACROSS ALL CRITERIA:")
        print(f"  - Total Strengths: {total_strengths}")
        print(f"  - Total Issues: {total_issues}")
        print("="*60)
        
        # Show sample from Task Achievement
        if 'task_achievement' in explanations:
            ta = explanations['task_achievement']
            print("\\nSAMPLE - Task Achievement Strengths:")
            for i, item in enumerate(ta.get('what_you_did_well', [])[:3], 1):
                print(f"  {i}. {item.get('label', 'N/A')}")
            
            print("\\nSAMPLE - Task Achievement Issues:")
            for i, item in enumerate(ta.get('main_issues', [])[:3], 1):
                print(f"  {i}. {item.get('label', 'N/A')}")
    else:
        print("\\nNo explanations found in result!")
        print(f"Result keys: {list(result.keys())}")

if __name__ == "__main__":
    asyncio.run(test_explanation_counts())
