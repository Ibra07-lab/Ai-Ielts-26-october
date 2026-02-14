import os
import sys
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)

# 1. Simulate STALE environment
os.environ["IELTS_WRITING_MODEL"] = "claude-sonnet-4-5-20250929"
# Old key (REMOVED)
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-api03-REPLACED-FOR-SECURITY"

print(f"Initial Model: {os.environ['IELTS_WRITING_MODEL']}")

# 2. Import Task2Examiner (which should trigger the fix)
sys.path.append(os.getcwd())
from ielts_writing.agents.examiner.task2_examiner import Task2Examiner

try:
    examiner = Task2Examiner()
    print(f"Examiner Model after init: {examiner.model}")
    
    if "anthropic/claude-sonnet-4.5" in examiner.model:
        print("SUCCESS: Model updated to OpenRouter version.")
    else:
        print("FAILURE: Model still stale.")
        
    if examiner.client._is_openrouter_key(examiner.client.anthropic_key):
        print("SUCCESS: Client using OpenRouter key.")
    else:
        print(f"FAILURE: Client using standard Anthropic key: {examiner.client.anthropic_key[:10]}...")

except Exception as e:
    print(f"Exception during init: {e}")
