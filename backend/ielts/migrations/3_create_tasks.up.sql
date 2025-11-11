-- Enable pgcrypto for gen_random_uuid (UUID generation)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tasks table to support AI IELTS Progress Tracker
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('reading','writing','speaking','listening','vocabulary','grammar')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','in_progress','completed')),
  estimated_minutes INT NOT NULL DEFAULT 20,
  progress INT NOT NULL DEFAULT 0,
  due_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Helpful index for range queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_due ON tasks (user_id, due_at);


