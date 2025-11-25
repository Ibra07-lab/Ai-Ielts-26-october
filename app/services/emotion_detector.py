# app/services/emotion_detector.py

from enum import Enum
from typing import Tuple
import re
import random

class UserEmotion(Enum):
    FRUSTRATED = "frustrated"
    CONFUSED = "confused"
    CONFIDENT = "confident"
    ANXIOUS = "anxious"
    TIRED = "tired"
    MOTIVATED = "motivated"
    NEUTRAL = "neutral"

class EmotionDetector:
    """Detect user emotional state from messages."""
    
    EMOTION_PATTERNS = {
        UserEmotion.FRUSTRATED: [
            r"i (don'?t|cant|cannot) (get|understand|do) (this|it)",
            r"(ugh|argh|grrr|damn|shit|fuck)",
            r"this is (so )?(hard|difficult|impossible|stupid|annoying)",
            r"i('m| am) (so )?(frustrated|angry|upset|done)",
            r"(hate|can't stand) (this|ielts|reading)",
            r"give up|giving up|quit",
            r"what('s| is) the point",
            r"(waste of|wasting) time",
        ],
        UserEmotion.CONFUSED: [
            r"i (don'?t|do not) (understand|get|know)",
            r"(what|how) (do you mean|does this mean)",
            r"(confused|lost|stuck)",
            r"\?\?\?+",
            r"(huh|what)\??$",
            r"can you (explain|clarify|help)",
            r"i('m| am) not sure",
            r"makes no sense",
        ],
        UserEmotion.ANXIOUS: [
            r"(exam|test) (is )?(tomorrow|soon|next week|in \d+ days?)",
            r"(nervous|anxious|scared|worried|stressed)",
            r"(what if|afraid) i (fail|don'?t pass)",
            r"(not )?ready",
            r"running out of time",
            r"panic|panicking",
            r"need (band )?\d+ (score)?",
        ],
        UserEmotion.TIRED: [
            r"(tired|exhausted|sleepy|drowsy)",
            r"(can'?t|cannot) (focus|concentrate|think)",
            r"(brain|head) (hurts?|fried|dead)",
            r"(need|taking) a break",
            r"been (studying|practicing) (for|all) (hours|\d+)",
            r"(late|early) (at night|morning)",
        ],
        UserEmotion.CONFIDENT: [
            r"(i )?(got|get) (it|this)",
            r"(easy|simple|no problem)",
            r"(i'?m|feel) (ready|confident|good)",
            r"bring it on|let'?s go",
            r"(nailed|aced|crushed) (it|this|that)",
            r"(making|getting) (progress|better)",
        ],
        UserEmotion.MOTIVATED: [
            r"let'?s (do|go|start|try)",
            r"(ready|excited|pumped|eager)",
            r"(want|need) to (improve|practice|learn)",
            r"(one|another) more",
            r"keep going|continue",
            r"show me|teach me|give me",
        ],
    }
    
    EMOTION_INTENSITY_MARKERS = {
        "high": [r"so ", r"very ", r"really ", r"extremely ", r"super ", r"!!!+", r"fuck", r"shit"],
        "low": [r"a (bit|little) ", r"kind of ", r"somewhat ", r"maybe "],
    }

    def detect(self, message: str) -> Tuple[UserEmotion, float]:
        """
        Detect emotion and intensity (0.0 to 1.0).
        Returns (emotion, intensity).
        """
        message_lower = message.lower()
        
        emotion_scores = {}
        for emotion, patterns in self.EMOTION_PATTERNS.items():
            score = sum(1 for p in patterns if re.search(p, message_lower, re.IGNORECASE))
            if score > 0:
                emotion_scores[emotion] = score
        
        if not emotion_scores:
            return UserEmotion.NEUTRAL, 0.5
        
        # Get dominant emotion
        dominant_emotion = max(emotion_scores, key=emotion_scores.get)
        
        # Calculate intensity
        intensity = 0.5
        for marker in self.EMOTION_INTENSITY_MARKERS["high"]:
            if re.search(marker, message_lower):
                intensity = min(1.0, intensity + 0.2)
        for marker in self.EMOTION_INTENSITY_MARKERS["low"]:
            if re.search(marker, message_lower):
                intensity = max(0.1, intensity - 0.15)
        
        # Exclamation marks and caps increase intensity
        if message.count("!") > 2:
            intensity = min(1.0, intensity + 0.1)
        if sum(1 for c in message if c.isupper()) / max(len(message), 1) > 0.5:
            intensity = min(1.0, intensity + 0.15)
            
        return dominant_emotion, round(intensity, 2)


class EmotionalResponseGenerator:
    """Generate emotionally appropriate responses."""
    
    EMPATHY_RESPONSES = {
        UserEmotion.FRUSTRATED: {
            "high": [
                "I hear you — this IS genuinely frustrating. Let's pause and try a completely different angle. 💪",
                "Take a breath. Seriously. I've seen students go from exactly where you are to Band 7+. This bump in the road is temporary.",
                "You know what? Let's step back from this question. It's not worth your sanity. We'll build up to it.",
            ],
            "medium": [
                "I get it — these questions can be maddening. But here's the thing: frustration often comes right before a breakthrough.",
                "This one's a tricky beast. Let me show you a technique that makes it click.",
            ],
            "low": [
                "A bit challenging, isn't it? That's actually a good sign — you're pushing your limits.",
            ]
        },
        UserEmotion.CONFUSED: {
            "high": [
                "Okay, let me try explaining this completely differently. Forget what I said before.",
                "You know what, that was confusing even for me looking back. Let's start fresh.",
            ],
            "medium": [
                "Let me break this down step by step. We'll go slower.",
                "Good that you said something — I'd rather you ask than stay confused!",
            ],
            "low": [
                "Fair question! Here's another way to think about it...",
            ]
        },
        UserEmotion.ANXIOUS: {
            "high": [
                "I can feel the pressure you're under. But listen — panic is your enemy, not the test. Let's focus on what you CAN control right now.",
                "Deep breath. I've coached students who felt exactly like this the week before their exam — and they surprised themselves. Let's make a plan.",
            ],
            "medium": [
                "Test anxiety is real, but so is your preparation. Let's channel that nervous energy into focused practice.",
                "Remember: the exam tests skills, and skills can be trained. That's exactly what we're doing.",
            ],
            "low": [
                "A little nervousness is actually good — it keeps you sharp. Let's use that energy!",
            ]
        },
        UserEmotion.TIRED: {
            "high": [
                "You sound exhausted. Honestly? Pushing through when you're this tired often does more harm than good. Can you take a 20-minute break? Even a quick nap helps memory consolidation.",
                "Your brain needs rest to process what you've learned. Maybe we should pick this up tomorrow when you're fresh?",
            ],
            "medium": [
                "Feeling the fatigue? Let's do something lighter — maybe a quick vocabulary game instead of heavy passages?",
                "How about we do one more short exercise and then call it for today? Quality over quantity.",
            ],
            "low": [
                "Getting a bit tired? That's normal after focused practice. Let's wrap up this section and take stock.",
            ]
        },
        UserEmotion.CONFIDENT: [
            "Love that energy! Let's put it to the test with something challenging! 🔥",
            "That's the spirit! Ready to level up?",
            "You're in the zone! Let's capitalize on this momentum.",
        ],
        UserEmotion.MOTIVATED: [
            "I love your enthusiasm! Let's make it count.",
            "That's what I like to hear! Here we go...",
            "Your energy is contagious! Let's do this! 💪",
        ],
    }

    def get_empathy_prefix(self, emotion: UserEmotion, intensity: float) -> str:
        """Get an empathy response based on emotion and intensity."""
        responses = self.EMPATHY_RESPONSES.get(emotion)
        
        if responses is None:
            return ""
        
        if isinstance(responses, list):
            return random.choice(responses)
        
        # Dict with intensity levels
        if intensity >= 0.7:
            level = "high"
        elif intensity >= 0.4:
            level = "medium"
        else:
            level = "low"
        
        return random.choice(responses.get(level, responses.get("medium", [""])))


# Singleton instances for easy import
emotion_detector = EmotionDetector()
emotional_response_generator = EmotionalResponseGenerator()
