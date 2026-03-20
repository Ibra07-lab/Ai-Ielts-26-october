"""Check what's stored in Supabase study_plan for our user."""
import json, os, sys
from dotenv import load_dotenv
load_dotenv()
from ielts_writing.supabase_client import get_supabase

supabase = get_supabase()

# Check all users with study plans
print("--- ALL users with study_plan ---")
r2 = supabase.table("users").select("id, name, study_plan").not_.is_("study_plan", "null").execute()
for user in r2.data:
    plan = user.get("study_plan")
    weeks = plan.get("weeks", []) if plan else []
    uid = user['id'][:12] if len(user.get('id','')) > 12 else user.get('id','?')
    print(f"User {uid}... ({user.get('name','?')}): {len(weeks)} weeks")
    for w in weeks[:5]:
        task_count = len(w.get("tasks", []))
        goal = str(w.get('goal', ''))[:60]
        print(f"  Week {w.get('week_number')}: tasks={task_count} goal='{goal}'")
    if len(weeks) > 5:
        print(f"  ... and {len(weeks) - 5} more weeks")

if not r2.data:
    print("No users with study_plan found! Checking all users...")
    r3 = supabase.table("users").select("id, name").execute()
    for u in r3.data:
        print(f"  User: {u['id'][:20]}... name={u.get('name')}")
