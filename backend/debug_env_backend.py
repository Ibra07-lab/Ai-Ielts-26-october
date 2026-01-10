import os
import sys

# Force UTF-8 for output
sys.stdout.reconfigure(encoding='utf-8')

print("--- DEBUGGING ENVIRONMENT ---")

# 1. Check file content directly
try:
    with open(".env", "r", encoding="utf-8") as f:
        print("\n[.env FILE CONTENT]")
        for line in f:
            if "IELTS_WRITING_MODEL" in line:
                print(f"Active Line: {line.strip()}")
except Exception as e:
    print(f"\nCould not read .env: {e}")

# 2. Check loaded environment
from dotenv import load_dotenv
print("\n[PYTHON ENVIRONMENT BEFORE LOAD]")
print(f"IELTS_WRITING_MODEL = {os.environ.get('IELTS_WRITING_MODEL', 'Not Set')}")

print("\n--- Loading .env ---")
load_dotenv(override=True)

print("\n[PYTHON ENVIRONMENT AFTER LOAD]")
print(f"IELTS_WRITING_MODEL = {os.environ.get('IELTS_WRITING_MODEL', 'Not Set')}")
