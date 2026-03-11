"""
Supabase client singleton for persistent storage.

Usage:
    from ielts_writing.supabase_client import get_supabase
    supabase = get_supabase()
    supabase.table("writing_evaluations").insert({...}).execute()
"""

import os
import logging
from supabase import create_client, Client

logger = logging.getLogger(__name__)

_client: Client | None = None


def get_supabase() -> Client:
    """Get or create Supabase client singleton."""
    global _client
    if _client is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        
        if not url or not key:
            raise RuntimeError(
                "SUPABASE_URL and SUPABASE_KEY must be set in .env. "
                "Get these from your Supabase project settings."
            )
        
        _client = create_client(url, key)
        logger.info("✅ Supabase client initialized")
    
    return _client
