"""
Diagnostic script: Calls Task 1 evaluate endpoint with proper JWT.
"""
import httpx
import json
import sys
import os
import traceback
import time
import base64

def main():
    from dotenv import load_dotenv
    load_dotenv()
    
    # Generate JWT with PyJWT
    import jwt as pyjwt
    jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
    token = pyjwt.encode(
        {"sub": "test-debug-user", "role": "authenticated", "iat": time.time(), "exp": time.time() + 3600},
        base64.b64decode(jwt_secret),
        algorithm="HS256"
    )
    print(f"Generated JWT: {token[:50]}...")
    
    payload = {
        "essay": "The bar chart shows the number of visitors to three London museums between 2007 and 2012. Overall, the British Museum had the most visitors throughout the period, while the Science Museum had the fewest. The British Museum started with approximately 5 million visitors in 2007 and rose steadily to about 5.9 million in 2012. The National Gallery began at around 4.2 million visitors in 2007. It experienced some fluctuations but ended the period at roughly 5.2 million in 2012. The Science Museum had the most stable trend, beginning at about 2.7 million visitors in 2007 and ending at approximately 3.3 million in 2012.",
        "question": "The bar chart below shows the number of visitors to three London museums between 2007 and 2012. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
        "student_name": "DebugTest",
        "chart_type": "bar_chart",
        "image_url": None,
        "image_description": "Bar chart showing visitor numbers (millions) for British Museum, National Gallery, Science Museum from 2007-2012. British Museum: 5.0, 5.2, 5.3, 5.5, 5.8, 5.9. National Gallery: 4.2, 4.4, 4.1, 4.8, 5.0, 5.2. Science Museum: 2.7, 2.8, 2.9, 3.0, 3.1, 3.3.",
        "include_teacher_feedback": True,
        "include_markdown": True
    }
    
    print(f"\nSending request to http://localhost:8002/task1/evaluate ...")
    
    try:
        with httpx.Client(timeout=180.0) as client:
            response = client.post(
                "http://localhost:8002/task1/evaluate",
                json=payload,
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                }
            )
            
            print(f"\nStatus: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"SUCCESS! Overall band: {result.get('scores', {}).get('overall_band')}")
                with open("debug_task1_success.json", "w", encoding="utf-8") as f:
                    json.dump(result, f, indent=2, ensure_ascii=False)
                print("Full result saved to debug_task1_success.json")
            else:
                print(f"FAILED with status {response.status_code}")
                print(f"Response body:\n{response.text}")
                with open("debug_task1_error.json", "w", encoding="utf-8") as f:
                    f.write(response.text)
                    
    except Exception as e:
        print(f"\nConnection error: {type(e).__name__}: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    main()
