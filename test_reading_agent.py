import requests
import json
import uuid

BASE_URL = "http://localhost:8001/api"

def test_chat():
    session_id = f"test_{str(uuid.uuid4())[:8]}"
    print(f"Testing Reading Agent (Session: {session_id})...")
    
    # Initial message
    payload = {
        "session_id": session_id,
        "messages": [
            {"role": "user", "content": "Hello, I want to practice reading."}
        ]
    }
    
    try:
        response = requests.post(f"{BASE_URL}/chat/message", json=payload)
        response.raise_for_status()
        result = response.json()
        
        print("\nUser: Hello, I want to practice reading.")
        print(f"Agent: {result['content']}")
        print("\n✅ Test Passed!")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ error: Could not connect to backend at http://localhost:8001")
        print("Make sure the app/main.py service is running.")
    except Exception as e:
        print(f"\n❌ Test Failed: {e}")
        if 'response' in locals():
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")

if __name__ == "__main__":
    test_chat()
