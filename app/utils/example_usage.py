# Example: How to use Language Variations

from app.utils.language_variations import vary, LanguageVariator

# Simple usage with the vary() helper
response = vary("correct")  # Returns: "Correct! ✓" or "Spot on!" etc.
response = vary("incorrect")  # Returns varied incorrect feedback
response = vary("encouragement")  # Returns varied encouragement

# Example in practice:
def give_feedback(is_correct: bool) -> str:
    if is_correct:
        return f"{vary('correct')} {vary('encouragement')}"
    else:
        return f"{vary('incorrect')} {vary('explain_again')}"

# Using specific categories
transition = vary("transition")  # "Now,", "Alright,", "Right," etc.
acknowledgment = vary("acknowledge")  # "I see.", "Got it.", etc.

# For celebrations
celebration = vary("celebrate")  # "Fantastic! 🎉", "You smashed that! 💪"

# Coffee metaphors (use sparingly for Alex's quirk)
if random.random() < 0.1:  # 10% chance
    coffee_phrase = vary("coffee_energy")
    # "That answer was strong like espresso! ☕"

# Reset tracking for new session
LanguageVariator.reset_all()

# Reset specific category
LanguageVariator.reset_category("correct")

# Full example in agent service:
"""
# In agent_service.py

from app.utils.language_variations import vary

# Instead of hardcoded "Correct!":
if user_answer_correct:
    response = f"{vary('correct')} {vary('encouragement')}"
    
# Instead of hardcoded "Let's continue":
response += f"\n\n{vary('lets_continue')}"

# For question transitions:
response = f"{vary('transition')} let's look at the next question type."

# For celebrations after streaks:
if student.current_streak_days == 7:
    response = f"{vary('celebrate')} You've hit a 7-day streak!"
"""
