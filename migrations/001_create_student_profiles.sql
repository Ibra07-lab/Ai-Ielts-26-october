# migrations/001_create_student_profiles.sql

-- Create student_profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
    student_id VARCHAR(255) PRIMARY KEY,
    profile_data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on updated_at for efficient queries
CREATE INDEX IF NOT EXISTS idx_student_profiles_updated_at ON student_profiles(updated_at);

-- Create conversation_memories table
CREATE TABLE IF NOT EXISTS conversation_memories (
    session_id VARCHAR(255) PRIMARY KEY,
    student_id VARCHAR(255) NOT NULL,
    memory_data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for conversation_memories
CREATE INDEX IF NOT EXISTS idx_conversation_memories_student_id ON conversation_memories(student_id);
CREATE INDEX IF NOT EXISTS idx_conversation_memories_updated_at ON conversation_memories(updated_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE
    ON student_profiles FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversation_memories_updated_at BEFORE UPDATE
    ON conversation_memories FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
