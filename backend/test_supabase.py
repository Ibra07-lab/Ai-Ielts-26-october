"""Quick test: write → read → delete a test record in Supabase."""
import os, sys
from dotenv import load_dotenv
load_dotenv()
from supabase import create_client

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

print("📝 Inserting test record...")
result = supabase.table("writing_evaluations").insert({
    "user_id": "test_user",
    "task_type": "task2",
    "question": "Test question",
    "essay": "Test essay content",
    "overall_band": 7.0,
    "task_response_band": 7.0,
    "coherence_cohesion_band": 6.5,
    "lexical_resource_band": 7.0,
    "grammar_band": 6.5,
    "evaluation_json": {"test": True},
    "student_name": "Test Student",
}).execute()

test_id = result.data[0]["id"]
print(f"✅ Inserted! ID = {test_id}")

print("📖 Reading back...")
read = supabase.table("writing_evaluations").select("*").eq("id", test_id).single().execute()
print(f"   Task type: {read.data['task_type']}")
print(f"   Band: {read.data['overall_band']}")
print(f"   Created: {read.data['created_at']}")

print("🗑️  Cleaning up test record...")
supabase.table("writing_evaluations").delete().eq("id", test_id).execute()
print("✅ Test complete! Supabase is working perfectly.")
