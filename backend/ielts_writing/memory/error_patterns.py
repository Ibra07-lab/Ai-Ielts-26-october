import json
from datetime import datetime
# import encore.storage.sqldb as sqldb
from ..models import ErrorPattern


# db = sqldb.Database("ielts_writing_db")

# Temporary in-memory storage
_memory_store = {
    "patterns": {},  # user_id -> list of patterns
    "submissions": [] # list of submissions
}

class ErrorPatternMemory:
    """Stores and retrieves user error patterns for personalization."""
    
    async def get_user_patterns(
        self,
        user_id: str
    ) -> list[ErrorPattern]:
        """Get recurring error patterns for a user."""
        # Simple in-memory match
        return _memory_store["patterns"].get(user_id, [])
    
    async def update_patterns(
        self,
        user_id: str,
        new_patterns: list[dict]
    ):
        """Update error patterns with new observations."""
        current = _memory_store["patterns"].get(user_id, [])
        now = datetime.utcnow()
        
        for p in new_patterns:
            # Check if exists
            existing = next((x for x in current if x.pattern_type == p["pattern_type"]), None)
            if existing:
                existing.frequency += 1
                existing.last_seen = now
                if p["example"] not in existing.examples:
                    existing.examples.append(p["example"])
            else:
                current.append(ErrorPattern(
                    pattern_type=p["pattern_type"],
                    examples=[p["example"]],
                    frequency=1,
                    first_seen=now,
                    last_seen=now
                ))
        
        _memory_store["patterns"][user_id] = current

    
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
            "weakest_criterion": None
        }
