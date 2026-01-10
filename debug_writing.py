import traceback
try:
    from ielts_writing.agents.pipeline import get_pipeline
    pipeline = get_pipeline()
    print("Pipeline import successful")
except Exception as e:
    print(f"PIPELINE ERROR: {e}")
    traceback.print_exc()

try:
    from ielts_writing.prompts.teacher_report import build_teacher_report_prompt
    print("Prompt import successful")
except Exception as e:
    print(f"PROMPT ERROR: {e}")
    traceback.print_exc()
