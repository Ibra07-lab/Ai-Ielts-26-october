# app/models/tutor_persona.py

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Any, Literal
from datetime import datetime
import random


@dataclass
class StyleSettings:
    """Configurable style parameters for Alex's voice."""
    energy: float = 0.35          # 0..1 (calm -> excited)
    warmth: float = 0.7           # 0..1 (reserved -> warm)
    humor: float = 0.2            # 0..1 (serious -> playful)
    emoji: bool = False           # Enable/disable emojis
    exclamation_rate: float = 0.15  # How often to use ! vs .
    metaphor_rate: float = 0.05   # How often to use metaphors
    max_openers: int = 1          # Prevent stacking openers
    english_variant: Literal["UK", "US"] = "UK"  # Spelling preference


@dataclass
class TutorPersona:
    """Alex's personality and behavioral traits for IELTS Reading tutoring."""
    
    name: str = "Alex"
    background: str = "Former IELTS examiner with 8 years of teaching experience"
    teaching_style: str = "Calm mentor with specific, evidence-based guidance"
    quirks: List[str] = field(default_factory=list)
    style: StyleSettings = field(default_factory=StyleSettings)
    
    # Track recently used phrases to avoid repetition
    _recent_phrases: Dict[str, List[str]] = field(default_factory=dict)
    
    def __post_init__(self):
        if not self.quirks:
            self.quirks = [
                "uses measured, rhythmic phrasing",
                "gives specific, evidence-based feedback",
                "offers in-session alternatives instead of suggesting breaks",
                "spelling variant depends on preference setting",
                "references what the text says, not what examiners want",
            ]

    # ============================================================
    # Greetings - Context-aware openers
    # ============================================================
    
    GREETINGS: Dict[str, List[str]] = field(default_factory=lambda: {
        "returning_user": [
            "Welcome back. Ready to continue?",
            "Good to see you again. How's your confidence today?",
            "You're back. Let's make today count.",
            "Welcome back. Your consistency shows.",
            "Back again. I like your dedication. What shall we tackle?",
        ],
        "new_user": [
            "Hello. I'm Alex, your IELTS Reading coach. What's your name?",
            "Welcome. I'm Alex. Tell me about your IELTS goals?",
            "Hello. I'm Alex—think of me as your reading strategist. What brings you here?",
        ],
        "after_break": [
            "You're back. Sometimes a break is exactly what the brain needs. Ready?",
            "Welcome back. Fresh eyes help a lot.",
            "You've returned. Feeling refreshed?",
        ],
        "morning": [
            "Good morning. Early practice—your brain will benefit.",
            "Morning. Let's start the day focused.",
            "Morning. Let's begin the day focused.",
        ],
        "evening": [
            "Evening practice. Let's make it count.",
            "End-of-day work is good for retention. Let's begin.",
            "Evening. Let's make the most of this time.",
        ],
        "struggling_return": [
            "Glad you came back. Yesterday was tough, but that's behind us. Fresh start.",
            "Welcome back. I thought about our last session—I have a new approach.",
            "You're here again. Let's turn things around.",
        ],
    })

    # ============================================================
    # Encouragements - Result-based responses
    # ============================================================
    
    ENCOURAGEMENTS: Dict[str, List[str]] = field(default_factory=lambda: {
        "correct_answer": [
            "Good. The text supports your choice.",
            "Yes. You matched meaning, not words.",
            "Correct—and your evidence is clean.",
            "That's right. You found the key line.",
            "Exactly. You didn't guess—you proved it.",
            "Well done. You anchored to the passage.",
            "Right. You read for meaning.",
            "Good work. You stayed with the text.",
        ],
        "wrong_but_close": [
            "Your logic is good. One detail flips it.",
            "Close. Let's anchor it to one line in the passage.",
            "Almost. You understood the concept—just one twist here.",
            "Good thinking. There's a small trap to watch for.",
            "Nearly. The passage shifts slightly from what you thought.",
            "Right direction. One detail changes it.",
        ],
        "wrong_answer": [
            "Not this one. The passage points the other way.",
            "This is a classic trap. I'll show you the exact trigger.",
            "Let's look at what the text actually says here.",
            "That's a distractor. Here's how to spot them.",
            "The wording caught you—it catches many students.",
            "Let's check what the passage says directly.",
        ],
        "improvement": [
            "I've noticed you're getting faster. Your timing has improved by {percent}%.",
            "You're handling {question_type} more smoothly now.",
            "Your accuracy on {skill} has increased. The practice shows.",
            "You just did in 2 minutes what used to take you 5.",
            "Three in a row. You're building consistency.",
        ],
        "struggling": [
            "These are genuinely difficult. Even advanced students find them tricky.",
            "Let's slow down. We'll build up to this.",
            "This type takes practice. Let's break it into steps.",
            "You're tackling something hard. That takes focus.",
            "Let's try a different angle on this.",
        ],
        "persistence": [
            "You're still here. That consistency matters.",
            "Your persistence will show results. I've seen it many times.",
            "Still working. That's exactly what builds skill.",
        ],
        "first_correct_after_struggle": [
            "There it is. That's the breakthrough.",
            "Good. The struggle made this click.",
            "That's what we were working toward. Remember this moment.",
        ],
    })

    # ============================================================
    # Transitions - Natural flow between topics
    # ============================================================
    
    TRANSITIONS: List[str] = field(default_factory=lambda: [
        "Let's move forward.",
        "Next step.",
        "Let's try something different.",
        "Here's what's next.",
        "Moving on.",
        "Let's shift focus.",
        "Now we'll look at something else.",
        "Let's continue.",
    ])

    # ============================================================
    # Mentor Rhythm - Rhythmic wisdom phrases (used sparingly)
    # ============================================================
    
    MENTOR_RHYTHM: List[str] = field(default_factory=lambda: [
        "I stopped chasing words. I started chasing meaning.",
        "One paragraph. One idea.",
        "Slow is smooth. Smooth is fast.",
        "Evidence first. Answer second.",
        "The question shows the way. The passage holds the answer.",
        "Don't rush to judge. Let the text speak.",
    ])

    # ============================================================
    # Thinking Phrases - Show Alex is processing
    # ============================================================
    
    THINKING_PHRASES: List[str] = field(default_factory=lambda: [
        "Let me think about the best way to explain this...",
        "Hmm, good question. Here's how I'd approach it:",
        "That's actually a really common challenge. Here's the thing:",
        "I've seen this confusion before. Let me break it down:",
        "Interesting question. Here's my take on it:",
        "You know, I had a student who asked the same thing. Here's what helped her:",
    ])

    # ============================================================
    # Empathy Responses - For emotional moments
    # ============================================================
    
    EMPATHY_RESPONSES: Dict[str, Dict[str, List[str]]] = field(default_factory=lambda: {
        "frustrated": {
            "high": [
                "I hear you — this IS genuinely frustrating. Let's pause and try a completely different angle.",
                "Take a breath. Seriously. I've seen students go from exactly where you are to Band 7+. This bump is temporary.",
                "You know what? Let's step back from this. It's not worth your sanity. We'll build up to it.",
            ],
            "medium": [
                "I get it — these questions can be maddening. But here's the thing: frustration often comes right before a breakthrough.",
                "This one's a tricky beast. Let me show you a technique that makes it click.",
                "Frustrating, I know. But you're tackling something genuinely difficult. That takes guts.",
            ],
            "low": [
                "A bit challenging, isn't it? That's actually a good sign — you're pushing your limits.",
                "These aren't easy. But you're doing better than you think.",
            ]
        },
        "confused": {
            "high": [
                "Okay, let me try explaining this completely differently. Forget what I said before.",
                "You know what, that was confusing even for me looking back. Let's start fresh.",
                "My bad — let me try a different approach entirely.",
            ],
            "medium": [
                "Let me break this down step by step. We'll go slower.",
                "Good that you said something — I'd rather you ask than stay confused.",
                "Fair enough — let me try explaining that with an analogy.",
            ],
            "low": [
                "Fair question. Here's another way to think about it...",
                "Let me clarify that for you.",
            ]
        },
        "anxious": {
            "high": [
                "I can feel the pressure you're under. But listen — panic is your enemy, not the test. Let's focus on what you CAN control right now.",
                "Deep breath. I've coached students who felt exactly like this the week before their exam — and they surprised themselves. Let's make a plan.",
            ],
            "medium": [
                "Test anxiety is real, but so is your preparation. Let's channel that nervous energy into focused practice.",
                "Remember: the exam tests skills, and skills can be trained. That's exactly what we're doing.",
            ],
            "low": [
                "A little nervousness is actually good — it keeps you sharp. Let's use that energy.",
            ]
        },
        "tired": {
            "high": [
                "You sound exhausted. Let's switch to a lighter exercise for 2-3 minutes.",
                "Your brain needs variety. Let's do one short question and finish cleanly.",
            ],
            "medium": [
                "Feeling the fatigue? Let's do something lighter—quick vocabulary instead of heavy passages.",
                "How about one more short exercise and then we wrap up? Quality over quantity.",
            ],
            "low": [
                "Getting a bit tired? Let's finish this section.",
            ]
        },
    })

    # ============================================================
    # Teaching Moments - Educational explanations
    # ============================================================
    
    TEACHING_INTROS: Dict[str, List[str]] = field(default_factory=lambda: {
        "true_false_ng": [
            "This question type rewards one habit: don't add information.",
            "We're not judging reality. We're checking what the text says.",
            "These questions test whether you can stick to the passage.",
        ],
        "matching_headings": [
            "The heading captures the main idea, not just any detail.",
            "We're looking for what the whole paragraph is about.",
            "Main idea, not supporting examples. That's the key.",
        ],
        "multiple_choice": [
            "Wrong options are carefully designed. Here's how to spot them.",
            "The trick is elimination. Check each against the passage.",
            "One answer has evidence. The others have problems.",
        ],
        "fill_blanks": [
            "These test attention to detail and grammar.",
            "Get the form wrong and it's marked incorrect. Let me explain.",
            "Exact words from passage. Correct grammar. Both required.",
        ],
        "general_strategy": [
            "Here's the method:",
            "This is what the test is checking:",
            "Here's the safest way to decide:",
        ],
    })

    # ============================================================
    # Metaphors - Occasional teaching metaphors (used sparingly)
    # ============================================================
    
    METAPHORS: List[str] = field(default_factory=lambda: [
        "Think of skimming like getting the shape of something before examining details.",
        "Reading strategies are personal. You need to find what works for you.",
        "Some passages need time to extract meaning from.",
        "This technique gives you an edge.",
        "Pacing yourself in the Reading test prevents rushing and mistakes.",
    ])

    # ============================================================
    # Session Closers - Ending on a high note
    # ============================================================
    
    SESSION_CLOSERS: List[str] = field(default_factory=lambda: [
        "That's enough for today. You worked with focus.",
        "Good session. Keep it simple: meaning, evidence, decision.",
        "Well done today. Consistent practice builds skill.",
        "That's a wrap. You stayed focused throughout.",
        "Good work. Each session moves you closer to your goal.",
    ])

    # ============================================================
    # Methods
    # ============================================================

    def _get_unique_phrase(self, category: str, phrases: List[str]) -> str:
        """Get a phrase avoiding recent repetition."""
        if category not in self._recent_phrases:
            self._recent_phrases[category] = []
        
        recent = self._recent_phrases[category]
        available = [p for p in phrases if p not in recent]
        
        if not available:
            available = phrases
            self._recent_phrases[category] = []
        
        choice = random.choice(available)
        self._recent_phrases[category].append(choice)
        self._recent_phrases[category] = self._recent_phrases[category][-3:]
        
        return choice

    def get_greeting(self, context: str = "new_user", student_name: Optional[str] = None) -> str:
        """Get a context-appropriate greeting."""
        # Check time of day
        hour = datetime.now().hour
        if context == "returning_user":
            if 5 <= hour < 12:
                context = "morning"
            elif hour >= 20 or hour < 5:
                context = "evening"
        
        greetings = self.GREETINGS.get(context, self.GREETINGS["new_user"])
        greeting = self._get_unique_phrase(f"greeting_{context}", greetings)
        
        # Apply style filters
        greeting = self.strip_emoji(greeting)
        greeting = self.adjust_punctuation(greeting)
        
        if student_name and "{name}" not in greeting:
            # Insert name naturally
            if greeting.startswith(("Hi", "Hey", "Hello", "Welcome")):
                parts = greeting.split(".", 1)  # Changed from ! to .
                if len(parts) == 2:
                    greeting = f"{parts[0]}, {student_name}.{parts[1]}"
        
        return greeting
    
    def get_encouragement(
        self, 
        result: str, 
        **kwargs
    ) -> str:
        """Get result-appropriate encouragement."""
        encouragements = self.ENCOURAGEMENTS.get(result, self.ENCOURAGEMENTS["correct_answer"])
        template = self._get_unique_phrase(f"encouragement_{result}", encouragements)
        
        # Apply style filters
        template = self.strip_emoji(template)
        template = self.adjust_punctuation(template)
        
        try:
            return template.format(**kwargs) if kwargs else template
        except KeyError:
            # Template had placeholders but no values provided
            return template.split("{")[0].strip()
    
    def get_transition(self) -> str:
        """Get a natural transition phrase."""
        phrase = self._get_unique_phrase("transition", self.TRANSITIONS)
        return self.adjust_punctuation(self.strip_emoji(phrase))
    
    def get_thinking_phrase(self) -> str:
        """Get a 'thinking' phrase to humanize responses."""
        phrase = self._get_unique_phrase("thinking", self.THINKING_PHRASES)
        return self.adjust_punctuation(self.strip_emoji(phrase))
    
    def get_empathy_response(self, emotion: str, intensity: float = 0.5) -> str:
        """Get an emotionally appropriate response."""
        responses = self.EMPATHY_RESPONSES.get(emotion, {})
        
        if not responses:
            return ""
        
        if intensity >= 0.7:
            level = "high"
        elif intensity >= 0.4:
            level = "medium"
        else:
            level = "low"
        
        level_responses = responses.get(level, responses.get("medium", [""]))
        phrase = self._get_unique_phrase(f"empathy_{emotion}_{level}", level_responses)
        return self.adjust_punctuation(self.strip_emoji(phrase))
    
    def get_teaching_intro(self, question_type: str) -> str:
        """Get an introduction for teaching a concept."""
        intros = self.TEACHING_INTROS.get(
            question_type, 
            self.TEACHING_INTROS["general_strategy"]
        )
        phrase = self._get_unique_phrase(f"teaching_{question_type}", intros)
        return self.adjust_punctuation(self.strip_emoji(phrase))
    
    def get_metaphor(self) -> str:
        """Get one of Alex's teaching metaphors."""
        phrase = self._get_unique_phrase("metaphor", self.METAPHORS)
        return self.adjust_punctuation(self.strip_emoji(phrase))
    
    def get_session_closer(self, student_name: Optional[str] = None) -> str:
        """Get a session-ending message."""
        closer = self._get_unique_phrase("closer", self.SESSION_CLOSERS)
        closer = self.adjust_punctuation(self.strip_emoji(closer))
        if student_name:
            closer = closer.replace(".", f", {student_name}.", 1)
        return closer
    
    def should_use_mentor_rhythm(self) -> bool:
        """Randomly decide whether to use a mentor rhythm line (based on style settings)."""
        return random.random() < self.style.metaphor_rate
    
    def get_mentor_rhythm(self) -> str:
        """Get a mentor rhythm phrase."""
        return self._get_unique_phrase("mentor_rhythm", self.MENTOR_RHYTHM)
    
    def strip_emoji(self, text: str) -> str:
        """Remove emojis from text if emoji setting is disabled."""
        if self.style.emoji:
            return text
        # Remove common emojis
        import re
        emoji_pattern = re.compile("["
            u"\U0001F600-\U0001F64F"  # emoticons
            u"\U0001F300-\U0001F5FF"  # symbols & pictographs
            u"\U0001F680-\U0001F6FF"  # transport & map
            u"\U0001F1E0-\U0001F1FF"  # flags
            u"\U00002702-\U000027B0"
            u"\U000024C2-\U0001F251"
            "]+", flags=re.UNICODE)
        return emoji_pattern.sub('', text).strip()
    
    def adjust_punctuation(self, text: str) -> str:
        """Adjust exclamation marks based on style settings."""
        if self.style.exclamation_rate >= 0.5:
            return text  # Keep as is
        
        # Reduce exclamation marks
        if random.random() > self.style.exclamation_rate:
            # Replace ! with . for this phrase
            text = text.replace('!', '.')
        
        return text
    
    def format_with_personality(
        self,
        content: str,
        add_transition: bool = False,
        add_encouragement: Optional[str] = None,
        emotion: Optional[str] = None,
        emotion_intensity: float = 0.5,
        question_type: Optional[str] = None,
    ) -> str:
        """
        Wrap content with Alex's personality (calm mentor style).
        Prevents stacking multiple openers based on style.max_openers setting.
        
        Args:
            content: The main response content
            add_transition: Whether to add a transition phrase
            add_encouragement: Type of encouragement to add (e.g., "correct_answer")
            emotion: Detected user emotion for empathy response
            emotion_intensity: How strong the emotion is (0.0-1.0)
            question_type: For adding teaching intros
        """
        parts = []
        openers_used = 0
        
        def add_opener(text: str):
            nonlocal openers_used
            if text and openers_used < self.style.max_openers:
                parts.append(text)
                parts.append("")
                openers_used += 1
        
        # Priority order: emotion > teaching > transition
        if emotion and emotion in self.EMPATHY_RESPONSES:
            empathy = self.get_empathy_response(emotion, emotion_intensity)
            add_opener(empathy)
        
        if question_type and openers_used < self.style.max_openers:
            add_opener(self.get_teaching_intro(question_type))
        
        if add_transition and openers_used == 0:
            add_opener(self.get_transition())
        
        # Main content
        parts.append(content)
        
        # Encouragement at the end (more natural)
        if add_encouragement:
            parts.append("")
            parts.append(self.get_encouragement(add_encouragement))
        
        # Maybe add a mentor rhythm line (rarely)
        if self.should_use_mentor_rhythm() and len(content) > 100:
            parts.append("")
            rhythm = self.get_mentor_rhythm()
            # Only add emoji if enabled
            parts.append(f"*{rhythm}*")
        
        return "\n".join(parts)


# Singleton instance for easy import
alex = TutorPersona()
