from dotenv import load_dotenv
import os
import httpx

# Load .env
load_dotenv(".env")

api_key = os.getenv("OPENROUTER_API_KEY")
print(f"API Key present: {bool(api_key)}")

url = "https://openrouter.ai/api/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "IELTS AI Verification"
}

data = {
    "model": "anthropic/claude-sonnet-4.5",
    "messages": [
        {"role": "user", "content": "Say 'OpenRouter is working' if you can read this."}
    ]
}

print(f"Sending request to {url}...")
try:
    response = httpx.post(url, headers=headers, json=data, timeout=30.0)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Response:", response.json()['choices'][0]['message']['content'])
    else:
        print("Error Response:", response.text)
except Exception as e:
    print(f"Exception: {e}")
