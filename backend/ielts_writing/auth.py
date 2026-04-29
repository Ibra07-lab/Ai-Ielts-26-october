"""
JWT Authentication middleware for FastAPI.

Verifies Supabase JWT tokens by calling Supabase's get_user() API.
This handles all algorithm types (HS256, ES256) automatically.
"""

import logging
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .supabase_client import get_supabase

logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str | None:
    """
    Verify Supabase JWT token and return the user ID.
    """
    if not credentials:
        return None
    
    token = credentials.credentials
    
    try:
        supabase = get_supabase()
        # Verify token by fetching the user from Supabase
        # This is the most reliable way as it handles ES256/HS256 automatically
        response = supabase.auth.get_user(token)
        
    except Exception as e:
        logger.error(f"❌ Auth verification failed: {e}")
        # Return none to allow "fail open" if desired, or raise if strict
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

    # Check result OUTSIDE the try/except to avoid catching HTTPException
    if not response or not response.user:
        logger.error("❌ Supabase returned no user for provided token")
        raise HTTPException(status_code=401, detail="Invalid session")
        
    user_id = response.user.id
    logger.info(f"✅ Authenticated user: {user_id[:8]}...")
    return user_id


async def require_auth(
    user_id: str | None = Depends(get_current_user),
) -> dict:
    """Strict auth dependency — raises 401 if not authenticated."""
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
    return {"uid": user_id}

WRITING_PLAN_LIMITS = {
    "free": 2,
    "basic": 15,
    "pro": 40,
    "pro_plus": 80,
}

async def check_writing_credits(
    user_id: str | None = Depends(get_current_user),
) -> dict:
    """Check if user has enough writing credits based on their plan."""
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    try:
        supabase = get_supabase()
        response = supabase.table("users").select("plan, essays_used").eq("id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="User profile not found")
            
        user_data = response.data[0]
        plan = user_data.get("plan") or "free"
        used = user_data.get("essays_used") or 0
        limit = WRITING_PLAN_LIMITS.get(plan, 2)
        
        if used >= limit:
            raise HTTPException(
                status_code=429,
                detail=f"Writing credit limit reached ({used}/{limit}). Please upgrade your plan to evaluate more essays."
            )
            
        return {"uid": user_id, "plan": plan, "essays_used": used}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error checking writing credits: {e}")
        # Fail safe - allow request if DB check fails temporarily
        return {"uid": user_id}
