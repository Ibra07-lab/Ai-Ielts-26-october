import asyncio
import os
import sys

# Ensure backend path is in python path
backend_path = os.path.join(os.getcwd(), "backend")
sys.path.append(backend_path)

from ielts_writing.pipelines.task1_pipeline import Task1Pipeline

async def test_image_description():
    print("Testing Image Description Feature with Water Consumption Data...")
    
    # 1. Define inputs
    question = "The bar chart shows the average daily water consumption per person in five cities in 2010 and 2020, measured in litres per person per day."
    
    # Sample essay for this specific chart
    # Note: I'm adding a deliberate error (175 instead of 170 for City C) to test validation
    essay = """
    The bar chart compares the daily amount of water used by individuals in five different cities (A, B, C, D, and E) between 2010 and 2020.
    
    Overall, it is clear that daily water consumption per person fell slightly in four of the five cities over the ten-year period. However, City C was the only city to see an increase in its figures. Additionally, City D remained the city with the highest water usage throughout the period.
    
    Regarding the cities where consumption decreased, City D saw the most significant drop from 240 to 205 litres. Cities A, B, and E followed a similar pattern, with moderate declines of approximately 15 litres each. Specifically, City A fell to 165 litres, while City B and City E dropped to 195 and 185 litres respectively.
    
    In contrast, the amount of water used in City C rose from 160 litres to 175 litres per day. Despite this increase, City C still maintained the lowest water consumption figures among all five cities in both 2010 and 2020.
    """
    
    # Your provided Factual description (Source of Truth)
    image_description = {
        "chart_type": "bar_chart",
        "title": "Average Daily Water Consumption per Person (2010 vs 2020)",
        "x_axis_label": "City",
        "y_axis_label": "Litres per person per day",
        "series": [{"name": "2010"}, {"name": "2020"}],
        "data_points": [
            {"category": "City A", "series": "2010", "value": 180},
            {"category": "City A", "series": "2020", "value": 165},
            {"category": "City B", "series": "2010", "value": 210},
            {"category": "City B", "series": "2020", "value": 195},
            {"category": "City C", "series": "2010", "value": 160},
            {"category": "City C", "series": "2020", "value": 170},
            {"category": "City D", "series": "2010", "value": 240},
            {"category": "City D", "series": "2020", "value": 205},
            {"category": "City E", "series": "2010", "value": 200},
            {"category": "City E", "series": "2020", "value": 185}
        ],
        "key_features": [
            {
                "feature_type": "overall_trend",
                "description": "Between 2010 and 2020 daily water consumption per person fell slightly in four of the five cities.",
                "priority": "critical"
            },
            {
                "feature_type": "exception",
                "description": "City C was the only city where water use increased, from 160 to 170 litres per person per day.",
                "priority": "high"
            },
            {
                "feature_type": "extreme_high",
                "description": "City D had the highest consumption in both years, at 240 litres in 2010 and 205 litres in 2020.",
                "priority": "critical"
            },
            {
                "feature_type": "extreme_low",
                "description": "City C had the lowest figures in both years among the five cities.",
                "priority": "medium"
            },
            {
                "feature_type": "largest_change",
                "description": "The biggest decrease occurred in City D, where daily use dropped by 35 litres.",
                "priority": "medium"
            },
            {
                "feature_type": "similar_pattern",
                "description": "Cities A, B and E all showed similar moderate falls of about 15 litres per person per day.",
                "priority": "low"
            }
        ]
    }
    
    # 2. Initialize pipeline
    pipeline = Task1Pipeline()
    
    # 3. Run evaluation
    print("\nRunning evaluation with PRO image_description...")
    result = await pipeline.evaluate_async(
        essay=essay,
        question=question,
        image_description=image_description,
        chart_type="bar_chart"
    )
    
    # 4. Check results
    if result["success"]:
        print("\n✅ Evaluation Successful!")
        print(f"Overall Band: {result['scores']['overall_band']}")
        
        # Verify examiner used the description
        # We can't easily check internal prompts, but success implies it didn't fail on missing image
        examiner_result = result["examiner_result"]
        data_accuracy = examiner_result.get("data_accuracy")
        print(f"Data Accuracy: {data_accuracy}")
        
        # Check if hallucination check worked (essay has correct numbers)
        if data_accuracy == "accurate":
             print("✅ Data verified as accurate against description.")
        else:
             print(f"⚠️ Data accuracy issue: {data_accuracy}")
             
        # Check if red flags list mentions missing image (it shouldn't)
        print("Red flags:", examiner_result.get("red_flags", []))
        
        if result.get("teacher_feedback"):
            print("\n✅ Teacher feedback generated successfully.")
    else:
        print("\n❌ Evaluation Failed!")
        print(result.get("error"))

if __name__ == "__main__":
    asyncio.run(test_image_description())
