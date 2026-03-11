-- writing_evaluations: Stores full AI evaluation results
CREATE TABLE IF NOT EXISTS writing_evaluations (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT DEFAULT 'anonymous',
    task_type TEXT NOT NULL,            -- 'task1' or 'task2'
    question TEXT NOT NULL,
    essay TEXT NOT NULL,
    
    -- Band scores
    overall_band DOUBLE PRECISION,
    task_response_band DOUBLE PRECISION,
    coherence_cohesion_band DOUBLE PRECISION,
    lexical_resource_band DOUBLE PRECISION,
    grammar_band DOUBLE PRECISION,
    
    -- Full AI output (stored as JSONB for flexibility)
    evaluation_json JSONB,              -- Full examiner output
    explanation_json JSONB,             -- Full explainer output  
    coaching_json JSONB,                -- Full coach output
    
    -- Timing
    total_seconds DOUBLE PRECISION,
    
    -- Metadata
    student_name TEXT DEFAULT 'Student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional, for future auth)
ALTER TABLE writing_evaluations ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (no auth yet)
CREATE POLICY "Allow all operations on writing_evaluations"
    ON writing_evaluations FOR ALL
    USING (true)
    WITH CHECK (true);

-- error_patterns: Stores user error patterns for personalization
CREATE TABLE IF NOT EXISTS error_patterns (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    pattern_type TEXT NOT NULL,
    examples TEXT[] DEFAULT '{}',
    frequency INTEGER DEFAULT 1,
    first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, pattern_type)
);

ALTER TABLE error_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on error_patterns"
    ON error_patterns FOR ALL
    USING (true)
    WITH CHECK (true);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_writing_evaluations_user_id ON writing_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_writing_evaluations_created_at ON writing_evaluations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_patterns_user_id ON error_patterns(user_id);
