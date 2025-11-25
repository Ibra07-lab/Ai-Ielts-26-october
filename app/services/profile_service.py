# app/services/profile_service.py

from typing import Dict, Optional
from datetime import datetime
from app.models.student_profile import StudentProfile, SkillProfile, create_default_profile, ConversationMemory

class ProfileService:
    """Service to manage student profiles and conversation memory (in-memory storage)."""
    
    def __init__(self):
        # In-memory storage
        self.profiles: Dict[str, StudentProfile] = {}
        self.memories: Dict[str, ConversationMemory] = {}
    
    def get_or_create_profile(
        self, 
        student_id: str, 
        name: Optional[str] = None
    ) -> StudentProfile:
        """Get existing profile or create new one."""
        if student_id not in self.profiles:
            self.profiles[student_id] = create_default_profile(student_id, name)
        return self.profiles[student_id]
    
    def get_profile(self, student_id: str) -> Optional[StudentProfile]:
        """Get profile if exists."""
        return self.profiles.get(student_id)
    
    def save_profile(self, profile: StudentProfile) -> None:
        """Save/update profile."""
        profile.updated_at = datetime.now()
        self.profiles[profile.student_id] = profile
    
    def update_skill(
        self,
        student_id: str,
        skill_name: str,
        correct: bool,
        time_taken_seconds: float
    ) -> None:
        """Update skill performance."""
        profile = self.get_or_create_profile(student_id)
        
        # Get or create skill profile
        if skill_name not in profile.skills:
            profile.skills[skill_name] = SkillProfile()
        
        skill = profile.skills[skill_name]
        skill.attempts += 1
        if correct:
            skill.correct += 1
        
        # Update average time (running average)
        if skill.avg_time_seconds == 0:
            skill.avg_time_seconds = time_taken_seconds
        else:
            skill.avg_time_seconds = (
                (skill.avg_time_seconds * (skill.attempts - 1) + time_taken_seconds)
                / skill.attempts
            )
        
        skill.last_practiced = datetime.now()
        skill.update_level()
        
        # Update overall accuracy
        total_attempts = sum(s.attempts for s in profile.skills.values())
        total_correct = sum(s.correct for s in profile.skills.values())
        if total_attempts > 0:
            profile.overall_accuracy = (total_correct / total_attempts) * 100
        
        self.save_profile(profile)
    
    def record_session(
        self,
        student_id: str,
        duration_minutes: int
    ) -> None:
        """Record a completed session."""
        profile = self.get_or_create_profile(student_id)
        
        profile.sessions_completed += 1
        profile.total_practice_minutes += duration_minutes
        profile.update_streak()
        
        # Check for achievements
        if profile.sessions_completed == 1:
            profile.add_achievement("first_session")
        elif profile.sessions_completed == 10:
            profile.add_achievement("10_sessions")
        elif profile.sessions_completed == 50:
            profile.add_achievement("50_sessions")
        
        if profile.current_streak_days == 7:
            profile.add_achievement("week_streak")
        elif profile.current_streak_days == 30:
            profile.add_achievement("month_streak")
        
        self.save_profile(profile)
    
    def add_win(self, student_id: str, win_description: str) -> None:
        """Record a recent win."""
        profile = self.get_or_create_profile(student_id)
        profile.recent_wins.append(win_description)
        if len(profile.recent_wins) > 5:
            profile.recent_wins = profile.recent_wins[-5:]
        self.save_profile(profile)
    
    def add_struggle(self, student_id: str, struggle_description: str) -> None:
        """Record a struggle for future reference."""
        profile = self.get_or_create_profile(student_id)
        if struggle_description not in profile.previous_struggles:
            profile.previous_struggles.append(struggle_description)
        self.save_profile(profile)
    
    def add_frustration_trigger(self, student_id: str, trigger: str) -> None:
        """Record what frustrates the student."""
        profile = self.get_or_create_profile(student_id)
        if trigger not in profile.frustration_triggers:
            profile.frustration_triggers.append(trigger)
        self.save_profile(profile)
    
    def get_personalized_context(self, student_id: str) -> Dict:
        """Get context for personalized responses."""
        profile = self.get_or_create_profile(student_id)
        return profile.get_personalized_greeting_context()
    
    # Conversation Memory Methods
    
    def get_or_create_memory(
        self,
        session_id: str,
        student_id: str
    ) -> ConversationMemory:
        """Get or create conversation memory for session."""
        if session_id not in self.memories:
            self.memories[session_id] = ConversationMemory(
                session_id=session_id,
                student_id=student_id
            )
        return self.memories[session_id]
    
    def update_memory(self, memory: ConversationMemory) -> None:
        """Update conversation memory."""
        self.memories[memory.session_id] = memory
    
    def record_question_attempt(
        self,
        session_id: str,
        student_id: str,
        correct: bool
    ) -> None:
        """Record a question attempt in current session."""
        memory = self.get_or_create_memory(session_id, student_id)
        memory.questions_attempted += 1
        if correct:
            memory.questions_correct += 1
        self.update_memory(memory)


# Singleton instance
profile_service = ProfileService()
