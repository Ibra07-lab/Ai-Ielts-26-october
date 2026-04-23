import httpx
import json

url = "http://localhost:8002/task1/evaluate"
headers = {"Content-Type": "application/json"}
payload = {
    "essay": "Test essay",
    "question": "Test question",
    "student_name": "Test",
    "chart_type": "bar_chart",
    "image_url": "blob:http://localhost:5173/test",
    "image_description": "Test"
}

print("Making POST request...")
try:
    response = httpx.post(url, json=payload, timeout=30.0)
    print(f"Status Code: {response.status_code}")
    print(f"Raw Response Body: {response.text}")
    print(f"Parsed JSON: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Request failed: {e}")
