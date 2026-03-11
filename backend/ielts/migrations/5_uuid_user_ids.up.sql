-- Migration 5: Change user IDs from BIGSERIAL (numeric) to TEXT (Supabase UUID strings)
-- WARNING: This drops and recreates all tables that reference users(id).

-- 1. Drop dependent tables (in reverse dependency order)
DROP TABLE IF EXISTS daily_goals CASCADE;
DROP TABLE IF EXISTS listening_sessions CASCADE;
DROP TABLE IF EXISTS reading_sessions CASCADE;
DROP TABLE IF EXISTS user_vocabulary CASCADE;
DROP TABLE IF EXISTS writing_submissions CASCADE;
DROP TABLE IF EXISTS speaking_sessions CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS reading_highlights CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Recreate users table with TEXT id (stores Supabase UUID)
CREATE TABLE users (
  id TEXT PRIMARY KEY,  -- Supabase UUID string, e.g. 'a1b2c3d4-e5f6-...'
  name TEXT NOT NULL,
  target_band DOUBLE PRECISION NOT NULL DEFAULT 7.0,
  exam_date DATE,
  language TEXT NOT NULL DEFAULT 'en',
  theme TEXT NOT NULL DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Recreate dependent tables with TEXT user_id
CREATE TABLE user_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  estimated_band DOUBLE PRECISION,
  practice_count INTEGER DEFAULT 0,
  last_practice_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill)
);

CREATE TABLE speaking_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  part INTEGER NOT NULL,
  question TEXT NOT NULL,
  transcription TEXT,
  audio_url TEXT,
  band_score DOUBLE PRECISION,
  fluency_score DOUBLE PRECISION,
  grammar_score DOUBLE PRECISION,
  pronunciation_score DOUBLE PRECISION,
  coherence_score DOUBLE PRECISION,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE writing_submissions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_type INTEGER NOT NULL,
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  band_score DOUBLE PRECISION,
  grammar_feedback TEXT,
  vocabulary_feedback TEXT,
  structure_feedback TEXT,
  coherence_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_vocabulary (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_id BIGINT NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'learning',
  next_review_date DATE,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

CREATE TABLE reading_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  passage_title TEXT NOT NULL,
  passage_content TEXT NOT NULL,
  questions JSONB NOT NULL,
  user_answers JSONB NOT NULL,
  correct_answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE listening_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  audio_title TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  questions JSONB NOT NULL,
  user_answers JSONB NOT NULL,
  correct_answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE daily_goals (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_date DATE NOT NULL,
  target_minutes INTEGER NOT NULL DEFAULT 30,
  completed_minutes INTEGER DEFAULT 0,
  activities_completed INTEGER DEFAULT 0,
  target_activities INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, goal_date)
);

-- Recreate reading_highlights if it existed (from migration 2)
CREATE TABLE IF NOT EXISTS reading_highlights (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  passage_title TEXT NOT NULL,
  highlighted_text TEXT NOT NULL,
  start_position INTEGER NOT NULL,
  end_position INTEGER NOT NULL,
  note TEXT,
  color TEXT DEFAULT 'yellow',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate tasks if it existed (from migration 3)
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'reading',
  difficulty TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'planned',
  estimated_minutes INTEGER DEFAULT 30,
  progress INTEGER DEFAULT 0,
  due_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
