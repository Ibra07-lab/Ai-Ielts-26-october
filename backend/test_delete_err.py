import asyncio
import os
from dotenv import load_dotenv

async def test_delete():
    load_dotenv("backend/.env")
    from ielts_writing.supabase_client import get_supabase
    
    supabase = get_supabase()
    session_id = 5
    
    try:
        result = supabase.table("writing_evaluations").select("user_id").eq("id", session_id).execute()
        print("RESULT DATA:", result.data)
        
        # If we use .single()
        print("Trying .single()...")
        single_result = supabase.table("writing_evaluations").select("user_id").eq("id", session_id).single().execute()
        print("SINGLE RESULT:", single_result.data)
    except Exception as e:
        print("EXCEPTION CAUGHT:", type(e), str(e))

if __name__ == "__main__":
    asyncio.run(test_delete())
