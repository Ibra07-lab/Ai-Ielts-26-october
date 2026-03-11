import logging
from datetime import datetime
from ..models import ErrorPattern

logger = logging.getLogger(__name__)


class ErrorPatternMemory:
    """Stores and retrieves user error patterns using Supabase for persistence."""

    def _get_supabase(self):
        try:
            from ..supabase_client import get_supabase
            return get_supabase()
        except Exception as e:
            logger.warning(f"⚠️ Supabase not available for error patterns: {e}")
            return None

    async def get_user_patterns(self, user_id: str) -> list[ErrorPattern]:
        """Get recurring error patterns for a user."""
        supabase = self._get_supabase()
        if not supabase:
            return []
        
        try:
            result = supabase.table("error_patterns") \
                .select("*") \
                .eq("user_id", user_id) \
                .order("frequency", desc=True) \
                .execute()
            
            return [
                ErrorPattern(
                    pattern_type=row["pattern_type"],
                    examples=row.get("examples", []),
                    frequency=row.get("frequency", 1),
                )
                for row in result.data
            ]
        except Exception as e:
            logger.error(f"Error fetching patterns for {user_id}: {e}")
            return []

    async def update_patterns(self, user_id: str, new_patterns: list[dict]):
        """Update error patterns with new observations."""
        supabase = self._get_supabase()
        if not supabase:
            return
        
        now = datetime.utcnow().isoformat()
        
        for p in new_patterns:
            try:
                # Check if pattern exists
                existing = supabase.table("error_patterns") \
                    .select("*") \
                    .eq("user_id", user_id) \
                    .eq("pattern_type", p["pattern_type"]) \
                    .execute()
                
                if existing.data:
                    row = existing.data[0]
                    examples = row.get("examples", [])
                    if p.get("example") and p["example"] not in examples:
                        examples.append(p["example"])
                    
                    supabase.table("error_patterns") \
                        .update({
                            "frequency": row["frequency"] + 1,
                            "examples": examples,
                            "last_seen": now,
                        }) \
                        .eq("id", row["id"]) \
                        .execute()
                else:
                    supabase.table("error_patterns") \
                        .insert({
                            "user_id": user_id,
                            "pattern_type": p["pattern_type"],
                            "examples": [p["example"]] if p.get("example") else [],
                            "frequency": 1,
                            "first_seen": now,
                            "last_seen": now,
                        }) \
                        .execute()
            except Exception as e:
                logger.error(f"Error updating pattern {p.get('pattern_type')}: {e}")

    async def get_user_profile(self, user_id: str) -> dict | None:
        """Get user's overall error profile."""
        patterns = await self.get_user_patterns(user_id)
        if not patterns:
            return None

        return {
            "user_id": user_id,
            "patterns": patterns,
            "total_submissions": 0,
            "average_band": 0.0,
            "strongest_criterion": None,
            "weakest_criterion": None,
        }

