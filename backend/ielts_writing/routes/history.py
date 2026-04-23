"""
Writing History API Routes — Retrieve persisted evaluations from Supabase.

Endpoints:
    GET /writing/history/{user_id}       — All evaluations for a user
    GET /writing/history/session/{id}    — Single evaluation by ID
"""

from fastapi import APIRouter, HTTPException, Depends
import logging
from ..auth import require_auth

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/writing", tags=["Writing History"])


@router.get("/history/{user_id}")
async def get_writing_history(user_id: str, auth: dict = Depends(require_auth), limit: int = 20):
    """
    Get all writing evaluations for a user, ordered by most recent first.
    """
    if user_id != auth["uid"]:
        raise HTTPException(status_code=403, detail="You can only access your own history")
        
    try:
        from ..supabase_client import get_supabase
        supabase = get_supabase()
        
        result = supabase.table("writing_evaluations") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .limit(limit) \
            .execute()
        
        return {
            "success": True,
            "sessions": result.data,
            "count": len(result.data)
        }
    except Exception as e:
        logger.error(f"[API] Error fetching writing history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/session/{session_id}")
async def get_writing_session(session_id: int, auth: dict = Depends(require_auth)):
    """
    Get a single writing evaluation by its ID (with ownership check).
    """
    try:
        from ..supabase_client import get_supabase
        supabase = get_supabase()
        
        result = supabase.table("writing_evaluations") \
            .select("*") \
            .eq("id", session_id) \
            .single() \
            .execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Session not found")
            
        # IDOR check
        if result.data.get("user_id") != auth["uid"]:
            raise HTTPException(status_code=403, detail="Access denied to this session")
        
        return {
            "success": True,
            "session": result.data
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[API] Error fetching session {session_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/all")
async def get_all_writing_history(auth: dict = Depends(require_auth), limit: int = 50):
    """
    Returns only the authenticated user's history (restricted for production).
    """
    try:
        from ..supabase_client import get_supabase
        supabase = get_supabase()
        
        result = supabase.table("writing_evaluations") \
            .select("id, user_id, task_type, overall_band, student_name, created_at, question") \
            .eq("user_id", auth["uid"]) \
            .order("created_at", desc=True) \
            .limit(limit) \
            .execute()
        
        return {
            "success": True,
            "sessions": result.data,
            "count": len(result.data)
        }
    except Exception as e:
        logger.error(f"[API] Error fetching history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/history/session/{session_id}")
async def delete_writing_session(session_id: int, auth: dict = Depends(require_auth)):
    """
    Delete a single writing evaluation by its ID (with ownership check).
    """
    import traceback
    try:
        from ..supabase_client import get_supabase
        supabase = get_supabase()
        
        # First check ownership without single() to avoid APIError on missing record
        result = supabase.table("writing_evaluations") \
            .select("user_id") \
            .eq("id", session_id) \
            .execute()
            
        if not result.data or len(result.data) == 0:
            raise HTTPException(status_code=404, detail="Session not found")
            
        session_owner = result.data[0].get("user_id")
        if session_owner != auth["uid"]:
            raise HTTPException(status_code=403, detail="Access denied to delete this session")
            
        # Delete the session
        delete_result = supabase.table("writing_evaluations") \
            .delete() \
            .eq("id", session_id) \
            .execute()
            
        return {
            "success": True,
            "message": "Session deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[API] Error deleting session {session_id}:\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))
