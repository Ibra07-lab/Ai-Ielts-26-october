# app/models/db_models.py

from sqlalchemy import Column, String, TIMESTAMP, text
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from app.core.db import Base

class StudentProfileDB(Base):
    """Database model for student profiles."""
    __tablename__ = "student_profiles"
    
    student_id = Column(String, primary_key=True, index=True)
    profile_data = Column(JSONB, nullable=False)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(TIMESTAMP, nullable=False, server_default=text('CURRENT_TIMESTAMP'), onupdate=datetime.now)
    
    def __repr__(self):
        return f"<StudentProfile(student_id={self.student_id})>"


class ConversationMemoryDB(Base):
    """Database model for conversation memory."""
    __tablename__ = "conversation_memories"
    
    session_id = Column(String, primary_key=True, index=True)
    student_id = Column(String, nullable=False, index=True)
    memory_data = Column(JSONB, nullable=False)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(TIMESTAMP, nullable=False, server_default=text('CURRENT_TIMESTAMP'), onupdate=datetime.now)
    
    def __repr__(self):
        return f"<ConversationMemory(session_id={self.session_id}, student_id={self.student_id})>"
