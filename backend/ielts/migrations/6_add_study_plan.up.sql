-- Migration 6: Add study_plan to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS study_plan JSONB;
