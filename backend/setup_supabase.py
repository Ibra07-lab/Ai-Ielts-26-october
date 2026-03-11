"""
Run this script to create the required tables in Supabase.
Usage: python setup_supabase.py
"""
import os
import sys
from dotenv import load_dotenv
load_dotenv()

from supabase import create_client

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

if not url or not key:
    print("❌ SUPABASE_URL and SUPABASE_KEY must be set in .env")
    sys.exit(1)

supabase = create_client(url, key)

# Read and execute SQL schema
schema_path = os.path.join(os.path.dirname(__file__), "ielts_writing", "supabase_schema.sql")
with open(schema_path, "r") as f:
    sql = f.read()

print(f"📦 Connecting to Supabase: {url}")
print(f"📄 Executing schema...")

try:
    # Execute via Supabase's RPC or REST - we'll use the postgrest endpoint
    # For DDL statements, we need to use the management API or SQL editor
    # Let's try using rpc
    result = supabase.rpc("exec_sql", {"query": sql}).execute()
    print(f"✅ Schema created successfully!")
    print(result)
except Exception as e:
    print(f"⚠️ Direct RPC failed (expected): {e}")
    print()
    print("=" * 60)
    print("📋 Please run the following SQL in your Supabase SQL Editor:")
    print("   https://supabase.com/dashboard/project/hybpdeunlpxmfwcthrfy/sql/new")
    print("=" * 60)
    print()
    print(sql)
    print()
    print("=" * 60)
    print("After running the SQL, try inserting a test record...")
    
    # Try to verify if tables already exist by doing a simple query
    try:
        test = supabase.table("writing_evaluations").select("id").limit(1).execute()
        print(f"✅ Table 'writing_evaluations' already exists! ({len(test.data)} rows)")
    except Exception as e2:
        print(f"❌ Table 'writing_evaluations' does not exist yet. Please run the SQL above.")
    
    try:
        test = supabase.table("error_patterns").select("id").limit(1).execute()
        print(f"✅ Table 'error_patterns' already exists! ({len(test.data)} rows)")
    except Exception as e2:
        print(f"❌ Table 'error_patterns' does not exist yet. Please run the SQL above.")
