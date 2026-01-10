import sys
sys.path.insert(0, 'backend')

from ielts_writing.agents.pipeline import get_pipeline

p = get_pipeline()
print(f"Has teacher_report: {hasattr(p, 'teacher_report')}")
print(f"Has method: {hasattr(p, 'evaluate_with_teacher_report')}")
print("SUCCESS!")
