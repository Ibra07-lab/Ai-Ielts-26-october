import json
import urllib.request
import urllib.parse

BASE_URL = "http://localhost:4000"

payload = {
    "userId": 1,
    "passageTitle": "Seeded Test Data",
    "passageContent": "Sample content for testing skills matrix.",
    "questions": [
        {
            "id": 1,
            "type": "matching-headings",
            "questionText": "Q1",
            "correctAnswer": "A"
        },
        {
            "id": 2,
            "type": "multiple-choice",
            "questionText": "Q2",
            "correctAnswer": "B"
        },
        {
            "id": 3,
            "type": "true-false-not-given",
            "questionText": "Q3",
            "correctAnswer": "True"
        },
        {
            "id": 4,
            "type": "matching-headings",
            "questionText": "Q4",
            "correctAnswer": "A"
        },
        {
            "id": 5,
            "type": "gap-fill",
            "questionText": "Q5",
            "correctAnswer": "word"
        }
    ],
    "userAnswers": {
        "1": "A", # Correct (matching-headings)
        "2": "C", # Incorrect (multiple-choice)
        "3": "True", # Correct (TFNG)
        "4": "A", # Correct (matching-headings)
        "5": "wrong" # Incorrect (gap-fill)
    },
    "timeTaken": 120
}

data = json.dumps(payload).encode('utf-8')
headers = {'Content-Type': 'application/json'}
req = urllib.request.Request(f"{BASE_URL}/reading/submit", data=data, headers=headers)

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.status}")
        print(response.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
