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
