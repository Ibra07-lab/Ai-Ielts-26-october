# app/models/student_profile.py

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum

class SkillLevel(str, Enum):
    WEAK = "weak"
    DEVELOPING = "developing"
    COMPETENT = "competent"
    STRONG = "strong"

class QuestionType(str, Enum):
    TRUE_FALSE_NG = "true_false_not_given"
    MATCHING_HEADINGS = "matching_headings"
    MULTIPLE_CHOICE = "multiple_choice"
    FILL_BLANKS = "fill_in_blanks"
    MATCHING_INFO = "matching_information"
    SENTENCE_COMPLETION = "sentence_completion"
    SHORT_ANSWER = "short_answer"

class SkillProfile(BaseModel):
    """Track proficiency in each skill area."""
    level: SkillLevel = SkillLevel.DEVELOPING
    attempts: int = 0
    correct: int = 0
    avg_time_seconds: float = 0.0
    last_practiced: Optional[datetime] = None
    common_mistakes: List[str] = Field(default_factory=list)
    
    @property
    def accuracy(self) -> float:
        return (self.correct / self.attempts * 100) if self.attempts > 0 else 0.0
    
    def update_level(self) -> None:
        """Automatically update skill level based on accuracy and attempts."""
        if self.attempts < 5:
            return  # Not enough data
        
        accuracy = self.accuracy
        if accuracy >= 85 and self.attempts >= 10:
            self.level = SkillLevel.STRONG
        elif accuracy >= 70:
            self.level = SkillLevel.COMPETENT
        elif accuracy >= 50:
            self.level = SkillLevel.DEVELOPING
        else:
            self.level = SkillLevel.WEAK

class StudentProfile(BaseModel):
    """Comprehensive student profile for personalization."""
    
    # Basic info
    student_id: str
    name: Optional[str] = None
    target_band: Optional[float] = None
    exam_date: Optional[datetime] = None
    native_language: Optional[str] = None
    
    # Learning preferences
    preferred_topics: List[str] = Field(default_factory=list)
    avoided_topics: List[str] = Field(default_factory=list)
    preferred_session_length_minutes: int = 30
    prefers_hints: bool = True
    prefers_detailed_explanations: bool = True
    
    # Performance tracking
    skills: Dict[str, SkillProfile] = Field(default_factory=dict)
    overall_accuracy: float = 0.0
    total_practice_minutes: int = 0
    sessions_completed: int = 0
    current_streak_days: int = 0
    longest_streak_days: int = 0
    last_session_date: Optional[datetime] = None
    
    # Emotional/engagement tracking
    frustration_triggers: List[str] = Field(default_factory=list)
    motivation_level: float = 0.7  # 0.0 to 1.0
    recent_emotions: List[str] = Field(default_factory=list, max_length=10)
    
    # Achievements & milestones
    achievements: List[str] = Field(default_factory=list)
    milestones: Dict[str, datetime] = Field(default_factory=dict)
    
    # Conversation memory
    important_facts: List[str] = Field(default_factory=list)
    previous_struggles: List[str] = Field(default_factory=list)
    recent_wins: List[str] = Field(default_factory=list, max_length=5)
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
    def get_weakest_skills(self, n: int = 3) -> List[str]:
        """Get the n weakest skill areas."""
        if not self.skills:
            return []
        sorted_skills = sorted(
            self.skills.items(), 
            key=lambda x: (x[1].accuracy, x[1].attempts)
        )
        return [skill for skill, _ in sorted_skills[:n]]
    
    def get_strongest_skills(self, n: int = 3) -> List[str]:
        """Get the n strongest skill areas."""
        if not self.skills:
            return []
        sorted_skills = sorted(
            self.skills.items(),
            key=lambda x: (-x[1].accuracy, -x[1].attempts)
        )
        return [skill for skill, _ in sorted_skills[:n]]
    
    def get_neglected_skills(self, days: int = 7) -> List[str]:
        """Get skills not practiced in the last n days."""
        cutoff = datetime.now() - timedelta(days=days)
        return [
            skill for skill, profile in self.skills.items()
            if profile.last_practiced is None or profile.last_practiced < cutoff
        ]
    
    def days_until_exam(self) -> Optional[int]:
        """Calculate days until exam."""
        if self.exam_date:
            delta = self.exam_date - datetime.now()
            return max(0, delta.days)
        return None
    
    def update_streak(self) -> None:
        """Update practice streak."""
        today = datetime.now().date()
        if self.last_session_date:
            last_date = self.last_session_date.date()
            if last_date == today - timedelta(days=1):
                self.current_streak_days += 1
            elif last_date != today:
                self.current_streak_days = 1
        else:
            self.current_streak_days = 1
        
        self.longest_streak_days = max(self.longest_streak_days, self.current_streak_days)
        self.last_session_date = datetime.now()
        self.updated_at = datetime.now()
    
    def add_achievement(self, achievement: str) -> bool:
        """Add achievement if not already earned. Returns True if new."""
        if achievement not in self.achievements:
            self.achievements.append(achievement)
            self.milestones[achievement] = datetime.now()
            self.updated_at = datetime.now()
            return True
        return False
    
    def record_emotion(self, emotion: str) -> None:
        """Record recent emotion (keeps last 10)."""
        self.recent_emotions.append(emotion)
        if len(self.recent_emotions) > 10:
            self.recent_emotions = self.recent_emotions[-10:]
        self.updated_at = datetime.now()
    
    def get_personalized_greeting_context(self) -> Dict[str, Any]:
        """Get context for personalized greetings."""
        context = {
            "name": self.name,
            "streak": self.current_streak_days,
            "days_until_exam": self.days_until_exam(),
            "weakest_skill": self.get_weakest_skills(1)[0] if self.skills else None,
            "recent_win": self.recent_wins[-1] if self.recent_wins else None,
            "sessions": self.sessions_completed,
            "returning": self.sessions_completed > 0,
        }
        
        # Add time-based context
        if self.exam_date and self.days_until_exam():
            days = self.days_until_exam()
            if days <= 7:
                context["exam_urgency"] = "high"
            elif days <= 30:
                context["exam_urgency"] = "medium"
            else:
                context["exam_urgency"] = "low"
        
        return context


class ConversationMemory(BaseModel):
    """Short and long-term conversation memory."""
    
    session_id: str
    student_id: str
    
    # Current session context
    current_topic: Optional[str] = None
    current_passage: Optional[str] = None
    current_questions: List[Dict[str, Any]] = Field(default_factory=list)
    questions_attempted: int = 0
    questions_correct: int = 0
    session_start: datetime = Field(default_factory=datetime.now)
    
    # What Alex "remembers" to reference
    mentioned_topics: List[str] = Field(default_factory=list)
    user_stated_goals: List[str] = Field(default_factory=list)
    user_shared_info: Dict[str, str] = Field(default_factory=dict)
    
    # Promises/commitments Alex made
    alex_promises: List[str] = Field(default_factory=list)
    
    # Callbacks for later
    follow_up_items: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Student's submitted answers {question_id: answer}
    student_answers: Dict[int, str] = Field(default_factory=dict)
    
    # Socratic questioning state for wrong answers
    pending_socratic_questions: Dict[int, Dict[str, Any]] = Field(default_factory=dict)  # {question_id: {student_answer, correct_answer, question_text}}
    waiting_for_reasoning: Optional[int] = None  # question_id we're waiting for student reasoning on
    student_reasoning: Dict[int, str] = Field(default_factory=dict)  # {question_id: reasoning_text}
    
    def add_follow_up(self, item: str, trigger_after: int = 3) -> None:
        """Add something to follow up on after n exchanges."""
        self.follow_up_items.append({
            "item": item,
            "trigger_after_exchanges": trigger_after,
            "exchanges_since": 0,
            "added_at": datetime.now().isoformat()
        })
    
    def get_due_follow_ups(self) -> List[str]:
        """Get follow-ups that are due."""
        due = []
        for item in self.follow_up_items:
            item["exchanges_since"] += 1
            if item["exchanges_since"] >= item["trigger_after_exchanges"]:
                due.append(item["item"])
        
        # Remove triggered items
        self.follow_up_items = [
            item for item in self.follow_up_items 
            if item["exchanges_since"] < item["trigger_after_exchanges"]
        ]
        return due
    
    def get_session_duration_minutes(self) -> int:
        """Get current session duration in minutes."""
        delta = datetime.now() - self.session_start
        return int(delta.total_seconds() / 60)
    
    def get_session_accuracy(self) -> float:
        """Get accuracy for current session."""
        if self.questions_attempted == 0:
            return 0.0
        return (self.questions_correct / self.questions_attempted) * 100


# Helper function to create default profile
def create_default_profile(student_id: str, name: Optional[str] = None) -> StudentProfile:
    """Create a new student profile with sensible defaults."""
    return StudentProfile(
        student_id=student_id,
        name=name,
        preferred_session_length_minutes=30,
        prefers_hints=True,
        prefers_detailed_explanations=True,
        motivation_level=0.7
    )
