"""
JWT Authentication middleware for FastAPI.

Verifies Supabase JWT tokens from the Authorization header.
Extracts the user's Supabase UUID for use in route handlers.
"""

import os
import logging
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)

# Supabase JWT secret — found in Supabase Dashboard → Settings → API → JWT Secret
# For now, we verify using the public JWKS or skip verification in development
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str | None:
    """
    Extract user ID from Supabase JWT token.
    
    Returns:
        User UUID string if authenticated, None if no token provided.
    
    Usage in routes:
        @router.post("/evaluate")
        async def evaluate(request: ..., user_id: str | None = Depends(get_current_user)):
            ...
    """
    if not credentials:
        return None  # Allow anonymous access for now
    
    token = credentials.credentials
    
    try:
        if SUPABASE_JWT_SECRET:
            # Full verification with secret
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
            )
        else:
            # Development mode: decode without verification
            payload = jwt.decode(
                token,
                options={"verify_signature": False},
                algorithms=["HS256"],
            )
            logger.warning("⚠️ JWT decoded WITHOUT verification (set SUPABASE_JWT_SECRET for production)")
        
        user_id = payload.get("sub")  # Supabase stores user UUID in 'sub' claim
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: no user ID")
        
        return user_id
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        logger.error(f"JWT validation error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logger.error(f"Auth error: {e}")
        return None  # Fail open in development


async def require_auth(
    user_id: str | None = Depends(get_current_user),
) -> str:
    """Strict auth dependency — raises 401 if not authenticated."""
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user_id
