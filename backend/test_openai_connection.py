"""
Test OpenAI API connection and quota
"""
import os
from dotenv import load_dotenv
import openai

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    print("[ERROR] OPENAI_API_KEY not found in .env file")
    exit(1)

print(f"[OK] API Key found: {api_key[:10]}...{api_key[-4:]}")
print("\n[TESTING] OpenAI connection...")

try:
    client = openai.OpenAI(api_key=api_key)
    
    # Try a minimal request
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # Cheaper model for testing
        messages=[{"role": "user", "content": "Say 'OK' if you can hear me"}],
        max_tokens=10
    )
    
    print("[SUCCESS] OpenAI API is working!")
    print(f"[RESPONSE] {response.choices[0].message.content}")
    print(f"[TOKENS] Used: {response.usage.total_tokens}")
    
except openai.RateLimitError as e:
    print(f"[RATE LIMIT ERROR] {e}")
    print("\n[SOLUTION]")
    print("   1. Go to https://platform.openai.com/account/billing")
    print("   2. Add credits to your account (minimum $5)")
    print("   3. Or wait if you're on free tier limits")
    
except openai.AuthenticationError as e:
    print(f"[AUTH ERROR] {e}")
    print("\n[SOLUTION]")
    print("   1. Check your API key is correct in .env file")
    print("   2. Go to https://platform.openai.com/api-keys")
    print("   3. Generate a new key if needed")
    
except Exception as e:
    print(f"[ERROR] {e}")
    print(f"   Error type: {type(e).__name__}")

print("\n" + "="*50)

