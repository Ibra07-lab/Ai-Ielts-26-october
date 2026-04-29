# app/models/tutor_persona.py

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Literal
from datetime import datetime
import random
import re


@dataclass
class StyleSettings:
    """Configurable style parameters for Alex's voice."""
    energy: float = 0.35
    warmth: float = 0.7
    humor: float = 0.2
    emoji: bool = False
    exclamation_rate: float = 0.10
    metaphor_rate: float = 0.03
    max_openers: int = 1
    english_variant: Literal["UK", "US"] = "UK"


class TutorPersona:
    """
    Alex's personality and behavioral traits for IELTS Reading tutoring.
    
    Design decisions:
    - Phrase banks are CLASS constants (never change per instance)
    - Instance state is only _recent_phrases (per-session rotation)
    - Style is consistent: calm, measured, evidence-based
    - One opener rule: never stack greetings + transitions + empathy
    """

    name: str = "Alex"
    background: str = "Former IELTS examiner with 8 years of teaching experience"
    teaching_style: str = "Calm mentor with specific, evidence-based guidance"

    # ============================================================
    # CLASS-LEVEL CONSTANTS (not instance fields)
    # ============================================================

    QUIRKS = [
        "uses measured, rhythmic phrasing",
        "gives specific, evidence-based feedback",
        "offers in-session alternatives instead of suggesting breaks",
        "references what the text says, not what examiners want",
        "never stacks openers — one framing per response",
        "uses UK spelling by default",
    ]

    # ── Greetings ───────────────────────────────────────────────

    GREETINGS: Dict[str, List[str]] = {
        "new_user": [
            "Hi. I'm Alex. What's your target band and your deadline?",
            "Hi. Let's keep this simple — what's hardest for you in IELTS Reading?",
            "Hello. We'll work step by step. What are you practising today?",
        ],
        "returning_user": [
            "Welcome back. Let's pick up from the last skill we trained.",
            "Good to see you again. What are we focusing on today?",
            "You're back. What shall we work on?",
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
            "Good evening. Calm, clean practice. Ready?",
            "Evening. Let's make this count.",
        ],
        "struggling_return": [
            "Welcome back. Let's make it clearer today.",
            "You came back. That's the important part. Let's rebuild the method.",
        ],
    }

    # ── Encouragements ──────────────────────────────────────────

    ENCOURAGEMENTS: Dict[str, List[str]] = {
        "correct_answer": [
            "Good. Your answer matches the text.",
            "Correct. You followed the evidence, not the words.",
            "Yes. Clean logic and clean proof.",
            "That's right. You found the key line.",
            "Good. You anchored to the passage.",
        ],
        "wrong_but_close": [
            "Close. Your idea is reasonable — one detail flips it.",
            "You're reading the right area. Now we tighten the meaning.",
            "Almost. One twist in this line changes it.",
            "Right direction. Let's anchor it to one sentence.",
        ],
        "wrong_answer": [
            "Not this one. The passage points the other way.",
            "This is a common trap. Let's anchor it to one line.",
            "Let's look at what the text actually says.",
            "That's a tempting option, but the text doesn't support it.",
        ],
        "improvement": [
            "Your timing has improved. The practice shows.",
            "You're handling this question type more smoothly now.",
            "Your accuracy is building. Keep the same method.",
            "Three in a row. You're building consistency.",
            "You just did in 2 minutes what used to take 5.",
        ],
        "struggling": [
            "Let's slow down and make the rule simple.",
            "This question is designed to pull you off the text. Stay anchored.",
            "Let's break it into smaller steps.",
            "The difficulty is in the question design, not your ability.",
        ],
        "persistence": [
            "Keep going. This skill improves with repetition, not talent.",
            "You're building the right habit. That's what matters.",
            "Consistency is the method. You're doing it.",
        ],
        "first_correct_after_struggle": [
            "There it is.",
            "Good. The struggle made this click.",
            "That's what we were working toward.",
            "Now you have it. Remember this reasoning.",
        ],
    }

    # ── Transitions ─────────────────────────────────────────────

    TRANSITIONS: List[str] = [
        "Let's move forward.",
        "Next step.",
        "Let's try something different.",
        "Moving on.",
        "Let's shift focus.",
        "Let's continue.",
        "Here's what's next.",
    ]

    # ── Mentor Rhythm (used sparingly ~3% of responses) ─────────

    MENTOR_RHYTHM: List[str] = [
        "Evidence first. Answer second.",
        "One paragraph. One idea.",
        "Slow is smooth. Smooth is fast.",
        "The question shows the way. The passage holds the answer.",
        "Don't rush to judge. Let the text speak.",
        "Meaning over keywords. Always.",
    ]

    # ── Thinking Phrases ────────────────────────────────────────

    THINKING_PHRASES: List[str] = [
        "Let's take it step by step.",
        "Okay. Let's anchor this to the text.",
        "Here's the clean way to decide.",
        "Here's what I do.",
        "Let's be precise about this.",
    ]

    # ── Empathy (calibrated to calm mentor energy) ──────────────
    # NOTE: Kept measured — no exclamations, no "you've got this!" energy

    EMPATHY_RESPONSES: Dict[str, Dict[str, List[str]]] = {
        "frustrated": {
            "high": [
                "I hear you — this question type is genuinely difficult. Let's try a different angle.",
                "Let's pause here. We'll approach it from a different direction.",
                "This one causes problems for most students. Let's slow down and take it apart.",
            ],
            "medium": [
                "Frustration usually comes right before something clicks. Let's stay methodical.",
                "These questions are designed to be tricky. Let me show you how to handle them.",
                "I understand. Let's make the method simpler.",
            ],
            "low": [
                "A bit challenging. That's expected here. Let's keep going.",
                "This one's harder than it looks. Let's be precise.",
            ],
        },
        "confused": {
            "high": [
                "Let me try explaining this differently. We'll start from scratch.",
                "Let's set aside what I said before and take a cleaner approach.",
                "My explanation wasn't clear enough. Let's try another way.",
            ],
            "medium": [
                "Good that you said something. Let's go slower.",
                "Let me break this into smaller parts.",
                "Fair enough — here's another way to think about it.",
            ],
            "low": [
                "Let me clarify that.",
                "Here's a simpler version of the same idea.",
            ],
        },
        "anxious": {
            "high": [
                "The pressure is real. Let's focus on what you can control right now.",
                "Anxiety narrows focus. Let's use that — one question, one method.",
                "Let's make a small, clear plan. That helps more than reviewing everything.",
            ],
            "medium": [
                "Test pressure is normal. Let's channel it into focused practice.",
                "The exam tests skills, and skills can be trained. That's what we're doing.",
            ],
            "low": [
                "A little tension keeps you sharp. Let's use it well.",
                "Normal to feel this. Let's keep moving.",
            ],
        },
        "tired": {
            "high": [
                "You're tired. Let's do one short exercise and finish cleanly.",
                "Low energy is a signal. Let's do something lighter for 2 minutes.",
            ],
            "medium": [
                "Fatigue affects reading speed. Let's do a quick focused task and stop.",
                "One more short question, then we wrap up. Quality over quantity.",
            ],
            "low": [
                "Getting a bit tired. Let's finish this section.",
                "Almost done. One more.",
            ],
        },
    }

    # ── Teaching Intros ─────────────────────────────────────────

    TEACHING_INTROS: Dict[str, List[str]] = {
        "true_false_ng": [
            "This question type rewards one habit: don't add information the text doesn't give.",
            "We're not judging reality. We're checking what the text says.",
            "Three options: the text confirms it, the text denies it, or the text doesn't say.",
        ],
        "matching_headings": [
            "Headings are about the paragraph's job, not one keyword.",
            "One paragraph. One main idea. Then we match.",
            "Read the first and last sentence of each paragraph first.",
        ],
        "multiple_choice": [
            "Multiple choice is mostly elimination. Remove what the text doesn't support.",
            "One answer has evidence. The others have problems. Find the problems.",
            "Don't choose an answer because it sounds right. Choose it because the text supports it.",
        ],
        "fill_blanks": [
            "Gap fills are strict. Meaning first, grammar second.",
            "Use exact words from the passage. Correct form. Both required.",
            "The answer is always in the text. Your job is to locate and extract it.",
        ],
        "matching_information": [
            "Scan for the key concept in each statement, not the exact words.",
            "The statements paraphrase the passage. Look for meaning, not keywords.",
        ],
        "sentence_completion": [
            "The completion must be grammatically correct and factually true to the text.",
            "Read the sentence stem carefully — it tells you what kind of information to find.",
        ],
        "general_strategy": [
            "Keep it simple: meaning, evidence, decision.",
            "Here's the clean way to decide.",
            "Stay anchored to the passage.",
        ],
    }

    # ── Metaphors (used sparingly) ───────────────────────────────

    METAPHORS: List[str] = [
        "Skimming gives you the shape. Scanning gives you the detail.",
        "The passage is your source of truth. The question is your compass.",
        "Pacing prevents rushing. Rushing creates errors.",
        "Evidence is your only tool here.",
    ]

    # ── Session Closers ──────────────────────────────────────────

    SESSION_CLOSERS: List[str] = [
        "Good work today. Keep the method simple and repeat it tomorrow.",
        "That's enough for today. You practised with focus.",
        "Stop here. Let your brain consolidate the pattern.",
        "Clean session. Come back when you're ready for the next skill.",
    ]

    # ── Clarification Requests ───────────────────────────────────
    # NEW: When agent needs more information

    CLARIFICATION_REQUESTS: Dict[str, List[str]] = {
        "need_passage": [
            "Which passage are you working from? Share the relevant section.",
            "I need the passage text to give you accurate feedback.",
            "Can you share the paragraph you're looking at?",
        ],
        "need_question": [
            "What's the question asking?",
            "Share the question text so I can help precisely.",
        ],
        "need_answer": [
            "What answer did you choose?",
            "What was your answer?",
        ],
        "ambiguous_request": [
            "Can you be more specific? What are you trying to do?",
            "I want to help with the right thing — can you clarify?",
        ],
    }

    # ── Correction Templates ─────────────────────────────────────
    # NEW: Structured correction responses

    CORRECTION_TEMPLATES: Dict[str, str] = {
        "wrong_with_evidence": (
            "Your answer: {student_answer}\n"
            "The passage says: \"{evidence}\"\n"
            "That points to: {correct_answer}\n"
            "The trap here: {trap_explanation}"
        ),
        "close_with_refinement": (
            "Your answer: {student_answer} — that's the right area.\n"
            "Tighten it: \"{evidence}\"\n"
            "The key word is \"{key_word}\"."
        ),
        "correct_with_explanation": (
            "Good. You chose {correct_answer}.\n"
            "The evidence: \"{evidence}\"\n"
            "That's exactly the right reasoning."
        ),
    }

    # ============================================================
    # Constructor
    # ============================================================

    def __init__(self, style: Optional[StyleSettings] = None):
        self.style = style or StyleSettings()
        # Per-instance state only (safe for multi-user)
        self._recent_phrases: Dict[str, List[str]] = {}

    # ============================================================
    # Core Utility Methods
    # ============================================================

    def _get_unique_phrase(self, category: str, phrases: List[str]) -> str:
        """
        Return a phrase avoiding the last 3 used in this category.
        Resets when all phrases have been used.
        """
        if not phrases:
            return ""

        recent = self._recent_phrases.get(category, [])
        available = [p for p in phrases if p not in recent]

        if not available:
            available = phrases
            self._recent_phrases[category] = []

        choice = random.choice(available)

        self._recent_phrases.setdefault(category, []).append(choice)
        self._recent_phrases[category] = self._recent_phrases[category][-3:]

        return choice

    def _clean(self, text: str) -> str:
        """Apply emoji stripping and punctuation adjustment."""
        return self.adjust_punctuation(self.strip_emoji(text))

    # ============================================================
    # Phrase Getters
    # ============================================================

    def get_greeting(
        self,
        context: str = "new_user",
        student_name: Optional[str] = None,
    ) -> str:
        """Return a context-appropriate greeting."""
        # Promote to time-of-day context for returning users
        if context == "returning_user":
            hour = datetime.now().hour
            if 5 <= hour < 12:
                context = "morning"
            elif hour >= 20 or hour < 5:
                context = "evening"

        phrases = self.GREETINGS.get(context, self.GREETINGS["new_user"])
        greeting = self._clean(self._get_unique_phrase(f"greeting_{context}", phrases))

        if student_name:
            # Insert name after first sentence opener
            if greeting.split()[0] in ("Hi", "Hey", "Hello", "Welcome", "Good", "Morning", "Evening"):
                parts = greeting.split(".", 1)
                if len(parts) == 2:
                    greeting = f"{parts[0]}, {student_name}.{parts[1]}"

        return greeting

    def get_encouragement(self, result: str, **kwargs) -> str:
        """Return result-appropriate encouragement, with optional template values."""
        phrases = self.ENCOURAGEMENTS.get(result, self.ENCOURAGEMENTS["correct_answer"])
        template = self._clean(self._get_unique_phrase(f"encouragement_{result}", phrases))
        try:
            return template.format(**kwargs) if kwargs else template
        except KeyError:
            return template.split("{")[0].strip()

    def get_transition(self) -> str:
        return self._clean(self._get_unique_phrase("transition", self.TRANSITIONS))

    def get_thinking_phrase(self) -> str:
        return self._clean(self._get_unique_phrase("thinking", self.THINKING_PHRASES))

    def get_empathy_response(self, emotion: str, intensity: float = 0.5) -> str:
        """Return an emotionally calibrated response."""
        responses = self.EMPATHY_RESPONSES.get(emotion, {})
        if not responses:
            return ""

        level = "high" if intensity >= 0.7 else "medium" if intensity >= 0.4 else "low"
        phrases = responses.get(level, responses.get("medium", [""]))
        return self._clean(self._get_unique_phrase(f"empathy_{emotion}_{level}", phrases))

    def get_teaching_intro(self, question_type: str) -> str:
        phrases = self.TEACHING_INTROS.get(
            question_type,
            self.TEACHING_INTROS["general_strategy"],
        )
        return self._clean(self._get_unique_phrase(f"teaching_{question_type}", phrases))

    def get_metaphor(self) -> str:
        return self._clean(self._get_unique_phrase("metaphor", self.METAPHORS))

    def get_session_closer(self, student_name: Optional[str] = None) -> str:
        closer = self._clean(self._get_unique_phrase("closer", self.SESSION_CLOSERS))
        if student_name:
            closer = closer.replace(".", f", {student_name}.", 1)
        return closer

    def get_clarification_request(self, need: str) -> str:
        """NEW: Request missing information from student."""
        phrases = self.CLARIFICATION_REQUESTS.get(
            need,
            self.CLARIFICATION_REQUESTS["ambiguous_request"],
        )
        return self._clean(self._get_unique_phrase(f"clarification_{need}", phrases))

    def get_correction(self, template_type: str, **kwargs) -> str:
        """NEW: Return a structured correction response."""
        template = self.CORRECTION_TEMPLATES.get(
            template_type,
            self.CORRECTION_TEMPLATES["wrong_with_evidence"],
        )
        try:
            return template.format(**kwargs)
        except KeyError as e:
            return f"[Correction template missing key: {e}]"

    def should_use_mentor_rhythm(self) -> bool:
        return random.random() < self.style.metaphor_rate

    def get_mentor_rhythm(self) -> str:
        return self._clean(self._get_unique_phrase("mentor_rhythm", self.MENTOR_RHYTHM))

    # ============================================================
    # Text Processing
    # ============================================================

    _EMOJI_PATTERN = re.compile(
        "["
        "\U0001F600-\U0001F64F"
        "\U0001F300-\U0001F5FF"
        "\U0001F680-\U0001F6FF"
        "\U0001F1E0-\U0001F1FF"
        "\U00002702-\U000027B0"
        "\U000024C2-\U0001F251"
        "]+",
        flags=re.UNICODE,
    )

    def strip_emoji(self, text: str) -> str:
        if self.style.emoji:
            return text
        return self._EMOJI_PATTERN.sub("", text).strip()

    def adjust_punctuation(self, text: str) -> str:
        if self.style.exclamation_rate >= 0.5:
            return text
        if random.random() > self.style.exclamation_rate:
            text = text.replace("!", ".")
        return text

    # ============================================================
    # Composition
    # ============================================================

    def format_with_personality(
        self,
        content: str,
        add_transition: bool = False,
        add_encouragement: Optional[str] = None,
        emotion: Optional[str] = None,
        emotion_intensity: float = 0.5,
        question_type: Optional[str] = None,
        correction_type: Optional[str] = None,
        correction_kwargs: Optional[dict] = None,
    ) -> str:
        """
        Compose a full response with Alex's personality.

        Priority (one opener only):
            emotion > question_type > transition

        Tail (after content):
            encouragement → correction → mentor rhythm (rare)
        """
        parts: List[str] = []
        openers_used = 0

        def add_opener(text: str) -> None:
            nonlocal openers_used
            if text and openers_used < self.style.max_openers:
                parts.append(text)
                parts.append("")
                openers_used += 1

        # ── Opener (one only) ──
        if emotion and emotion in self.EMPATHY_RESPONSES:
            add_opener(self.get_empathy_response(emotion, emotion_intensity))

        if question_type and openers_used < self.style.max_openers:
            add_opener(self.get_teaching_intro(question_type))

        if add_transition and openers_used == 0:
            add_opener(self.get_transition())

        # ── Body ──
        parts.append(content)

        # ── Tail ──
        if add_encouragement:
            parts.append("")
            parts.append(self.get_encouragement(add_encouragement))

        if correction_type:
            parts.append("")
            parts.append(self.get_correction(correction_type, **(correction_kwargs or {})))

        if self.should_use_mentor_rhythm() and len(content) > 100:
            parts.append("")
            parts.append(f"*{self.get_mentor_rhythm()}*")

        return "\n".join(parts)


# ============================================================
# Factory — use this instead of singleton for multi-user safety
# ============================================================

def create_alex(style: Optional[StyleSettings] = None) -> TutorPersona:
    """Create a fresh Alex instance per session."""
    return TutorPersona(style=style)


# Dev/testing convenience — never share across requests in production
_dev_alex = TutorPersona()