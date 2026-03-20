import requests
import json
import sys

BASE_URL = "http://localhost:4000"
USER_ID = "530d0ef3-8033-4b00-a2a7-2f89279a35d4"
PASSAGE_TITLE = "The Transformative Influence of Artificial Intelligence on the Global Labor Market"

def test_create_highlight():
    print(f"Testing POST /reading/highlights...")
    url = f"{BASE_URL}/reading/highlights"
    payload = {
        "userId": USER_ID,
        "passageTitle": PASSAGE_TITLE,
        "highlightedText": "artificial intelligence",
        "startPosition": 10,
        "endPosition": 33,
        "highlightType": "word",
        "highlightColor": "yellow"
    }
    
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Successfully created highlight.")
            return True
        else:
            print(f"Failed to create highlight: {response.text}")
            return False
    except Exception as e:
        print(f"Error connecting to server: {e}")
        return False

def test_get_highlights():
    print(f"\nTesting GET /users/{USER_ID}/reading/highlights/{PASSAGE_TITLE}...")
    # Need to URL encode the title
    encoded_title = requests.utils.quote(PASSAGE_TITLE)
    url = f"{BASE_URL}/users/{USER_ID}/reading/highlights/{encoded_title}"
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Successfully retrieved highlights.")
            # print(json.dumps(response.json(), indent=2))
            return True
        else:
            print(f"Failed to retrieve highlights: {response.text}")
            return False
    except Exception as e:
        print(f"Error connecting to server: {e}")
        return False

if __name__ == "__main__":
    create_ok = test_create_highlight()
    get_ok = test_get_highlights()
    
    if create_ok and get_ok:
        print("\nAll highlight tests passed!")
        sys.exit(0)
    else:
        print("\nSome tests failed.")
        sys.exit(1)
