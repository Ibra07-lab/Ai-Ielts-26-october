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
    exclamation_rate: float = 0.10  # How often to use ! vs . (calm punctuation)
    metaphor_rate: float = 0.03   # How often to use metaphors (very rare)
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
            "Welcome back. Let's pick up from the last skill we trained.",
            "Good to see you again. What are we focusing on today?",
            "You're back. What shall we work on?",
        ],
        "new_user": [
            "Hi. I'm Alex. Tell me your target band and your deadline.",
            "Hi. Let's keep this simple: what's hardest for you in IELTS Reading?",
            "Hello. We'll work step by step. What are you practising today?",
        ],
        "after_break": [
            "You're back. Fresh eyes help. Ready?",
            "Welcome back. Let's continue.",
        ],
        "morning": [
            "Good morning. One focused task, then we stop.",
            "Morning. Let's start focused.",
        ],
        "evening": [
            "Good evening. Let's do calm, clean practice.",
            "Evening. Let's make this count.",
        ],
        "struggling_return": [
            "Welcome back. Yesterday was heavy. Today we'll make it clearer.",
            "You came back. That's the important part. Let's rebuild the method.",
        ],
    })

    # ============================================================
    # Encouragements - Result-based responses
    # ============================================================
    
    ENCOURAGEMENTS: Dict[str, List[str]] = field(default_factory=lambda: {
        "correct_answer": [
            "Good. Your answer matches the text.",
            "Correct. You followed the evidence, not the words.",
            "Yes. Clean logic and clean proof.",
            "That's right. You found the key line.",
            "Good. You anchored to the passage.",
        ],
        "wrong_but_close": [
            "Close. Your idea is reasonable—one detail flips it.",
            "You're reading the right area. Now we tighten the meaning.",
            "Almost. One twist here.",
            "Right direction. Let's anchor it to one line.",
        ],
        "wrong_answer": [
            "Not this one. The passage points the other way.",
            "This is a common trap. Let's anchor it to one line.",
            "Let's look at what the text actually says.",
        ],
        "improvement": [
            "I've noticed you're getting faster. Your timing has improved by {percent}%.",
            "You're handling {question_type} more smoothly now.",
            "Your accuracy on {skill} has increased. The practice shows.",
            "You just did in 2 minutes what used to take you 5.",
            "Three in a row. You're building consistency.",
        ],
        "struggling": [
            "Let's slow down and make the rule simple.",
            "This feels messy because the question is designed to pull you off the text.",
            "Let's break it into smaller steps.",
        ],
        "persistence": [
            "Keep going. This skill improves with repetition, not talent.",
            "You're building the right habit. That's what matters.",
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
        "Let's take it step by step.",
        "Okay. Let's anchor this to the text.",
        "Here's the clean way to decide.",
        "Here's what I do.",
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
        ],
        "matching_headings": [
            "Headings are about the paragraph's job, not one keyword.",
            "One paragraph. One main idea. Then we match.",
        ],
        "multiple_choice": [
            "Multiple choice is mostly elimination. We remove what the text doesn't support.",
            "One answer has evidence. The others have problems.",
        ],
        "fill_blanks": [
            "Gap fills are strict. Meaning first, grammar second.",
            "Exact words from the passage. Correct form. Both required.",
        ],
        "general_strategy": [
            "Keep it simple: meaning, evidence, decision.",
            "Here's the clean way to decide.",
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
        "Good work today. Keep the method simple and repeat it tomorrow.",
        "That's enough for today. You practised with focus.",
        "Stop here. Let your brain keep the pattern.",
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
