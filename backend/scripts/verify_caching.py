import socket
import json
import time
import urllib.request
import urllib.error

# Use 127.0.0.1 to avoid localhost resolution issues
URL = "http://127.0.0.1:8002/task1/evaluate"
PAYLOAD = {
    "essay": "The chart shows water consumption in the UK. In 2000 it was 100 liters, rising to 150 in 2020. Overall, consumption increased.",
    "question": "The chart below shows water consumption. Summarize the information.",
    "student_name": "TestUser",
    "include_teacher_feedback": False,
    "include_markdown": False
}

def run_test():
    print(f"Targeting: {URL}")
    print("Sending Request 1... (Warmup / Cache Create)")
    try:
        data = json.dumps(PAYLOAD).encode('utf-8')
        req = urllib.request.Request(URL, data=data, headers={
            'Content-Type': 'application/json',
            'User-Agent': 'VerificationScript'
        })
        # Add timeout to avoid hanging
        with urllib.request.urlopen(req, timeout=30) as f:
            print(f"Response 1: {f.status}")
            print(f"Headers: {f.getheaders()}")
    except urllib.error.HTTPError as e:
        print(f"HTTPError 1: {e.code} - {e.read().decode()}")
    except Exception as e:
        print(f"Error 1: {e}")

    print("\nWaiting 5s for cache consistency...")
    time.sleep(5)

    print("Sending Request 2... (Cache Hit Expected)")
    try:
        data = json.dumps(PAYLOAD).encode('utf-8')
        req = urllib.request.Request(URL, data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=30) as f:
            print(f"Response 2: {f.status}")
    except urllib.error.HTTPError as e:
        print(f"HTTPError 2: {e.code} - {e.read().decode()}")
    except Exception as e:
        print(f"Error 2: {e}")

if __name__ == "__main__":
    run_test()
