
import sys
import os

# Mimic the debug script's path setup
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    import ielts_writing
    print(f"IELTS Writing Package: {ielts_writing.__file__}")
except ImportError:
    print("Could not import ielts_writing")

try:
    from ielts_writing.agents.prompts import task2_examiner_prompt
    print(f"Prompts Module: {task2_examiner_prompt.__file__}")
    
    # Check content directly
    print("--- FIRST 100 CHARS OF PROMPT ---")
    print(task2_examiner_prompt.TASK2_SYSTEM_PROMPT[:100].replace('\n', '\\n'))
except ImportError as e:
    print(f"Error importing prompts: {e}")

try:
    from ielts_writing.agents.examiner import task2_examiner
    print(f"Examiner Module: {task2_examiner.__file__}")
except ImportError as e:
    print(f"Error importing examiner: {e}")
