-- Migration 8: Fix reading_highlights schema mismatch and add unique constraint
-- These columns were renamed or lost in Migration 5.

-- 1. Rename columns if they exist with wrong names
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reading_highlights' AND column_name='note') THEN
        ALTER TABLE reading_highlights RENAME COLUMN note TO highlight_type;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reading_highlights' AND column_name='color') THEN
        ALTER TABLE reading_highlights RENAME COLUMN color TO highlight_color;
    END IF;
END $$;

-- 2. Ensure columns exist with correct types and defaults (in case they don't exist at all)
ALTER TABLE reading_highlights 
ADD COLUMN IF NOT EXISTS highlight_type TEXT NOT NULL DEFAULT 'word',
ADD COLUMN IF NOT EXISTS highlight_color TEXT NOT NULL DEFAULT 'yellow';

-- 3. Add the missing UNIQUE constraint for ON CONFLICT support
-- First, remove any potential duplicate rows that might prevent adding the constraint
DELETE FROM reading_highlights a USING reading_highlights b
WHERE a.id < b.id 
  AND a.user_id = b.user_id 
  AND a.passage_title = b.passage_title 
  AND a.start_position = b.start_position 
  AND a.end_position = b.end_position;

-- Now add the constraint safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reading_highlights_user_passage_pos_unique') THEN
        ALTER TABLE reading_highlights 
        ADD CONSTRAINT reading_highlights_user_passage_pos_unique 
        UNIQUE(user_id, passage_title, start_position, end_position);
    END IF;
END $$;
