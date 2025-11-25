# app/utils/language_variations.py

import random
from typing import Dict, List

class LanguageVariator:
    """Add natural variation to repeated phrases with Alex's personality."""
    
    VARIATIONS: Dict[str, List[str]] = {
        "correct": [
            "Correct! ✓",
            "That's right!",
            "Spot on!",
            "Yes! Nailed it.",
            "Exactly right!",
            "You got it!",
            "Perfect!",
            "Bingo! 🎯",
            "Brilliant!",
            "Absolutely!",
        ],
        "incorrect": [
            "Not quite.",
            "Hmm, not this time.",
            "Close, but not exactly.",
            "That's not it, but good try.",
            "Let me help you see why that's not right.",
            "Almost there, but not quite.",
            "Good effort, but let's look at this again.",
        ],
        "lets_continue": [
            "Let's keep going!",
            "Ready for more?",
            "Shall we continue?",
            "On to the next one!",
            "Let's try another!",
            "Moving on!",
            "Next up:",
            "Right, let's tackle the next one.",
        ],
        "thinking": [
            "Good question. Let me think...",
            "Hmm, let's see...",
            "That's interesting. Here's my take:",
            "Let me break this down:",
            "Interesting point. Here's how I see it:",
            "Let me analyse this...",  # British spelling
        ],
        "encouragement": [
            "You're doing great!",
            "Keep it up!",
            "Nice work so far!",
            "You're making progress!",
            "That's the spirit!",
            "Brilliant progress!",
            "You're getting the hang of this!",
            "Keep that momentum going!",
        ],
        "explain_again": [
            "Let me try explaining that differently:",
            "Here's another way to think about it:",
            "OK, let me put it this way:",
            "Maybe this analogy helps:",
            "Let me rephrase that:",
            "Here's a different angle:",
        ],
        # Alex-specific variations
        "time_check": [
            "How long did that take you?",
            "Did you time yourself?",
            "What was your timing on that?",
            "How are you doing time-wise?",
        ],
        "good_effort": [
            "I appreciate the effort!",
            "Good thinking there!",
            "I like how you approached that!",
            "Nice reasoning!",
            "That's solid logic!",
        ],
        "transition": [
            "Now,",
            "Alright,",
            "Right,",
            "OK,",
            "So,",
            "Here's the thing:",
        ],
        "acknowledge": [
            "I see.",
            "Got it.",
            "Understood.",
            "Fair point.",
            "Right, okay.",
            "Fair enough.",
        ],
        "celebrate": [
            "Fantastic! 🎉",
            "Excellent work! ⭐",
            "You smashed that! 💪",
            "Outstanding!",
            "Superb!",
            "You're on fire! 🔥",
        ],
        # Coffee metaphors (optional - use sparingly)
        "coffee_energy": [
            "That answer was strong like espresso! ☕",
            "You're brewing up some great answers!",
            "Your reading skills are percolating nicely!",
        ],
    }
    
    # Track recent usage to avoid repetition
    _recent_usage: Dict[str, List[str]] = {}
    
    @classmethod
    def get(cls, category: str, fallback: str = "") -> str:
        """Get a varied phrase, avoiding recent repetition."""
        if category not in cls.VARIATIONS:
            return fallback
        
        options = cls.VARIATIONS[category]
        recent = cls._recent_usage.get(category, [])
        
        # Filter out recently used
        available = [opt for opt in options if opt not in recent]
        if not available:
            # All have been used recently, reset
            available = options
            cls._recent_usage[category] = []
        
        choice = random.choice(available)
        
        # Track usage
        if category not in cls._recent_usage:
            cls._recent_usage[category] = []
        cls._recent_usage[category].append(choice)
        cls._recent_usage[category] = cls._recent_usage[category][-3:]  # Keep last 3
        
        return choice
    
    @classmethod
    def reset_category(cls, category: str) -> None:
        """Reset tracking for a specific category."""
        if category in cls._recent_usage:
            cls._recent_usage[category] = []
    
    @classmethod
    def reset_all(cls) -> None:
        """Reset all tracking (e.g., for new session)."""
        cls._recent_usage = {}


# Singleton-style accessor
def vary(category: str, fallback: str = "") -> str:
    """Quick accessor for getting variations."""
    return LanguageVariator.get(category, fallback)
