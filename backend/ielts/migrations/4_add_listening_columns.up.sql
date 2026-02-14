-- Add missing columns to listening_sessions table
ALTER TABLE listening_sessions 
ADD COLUMN IF NOT EXISTS test_id INTEGER,
ADD COLUMN IF NOT EXISTS band_score DOUBLE PRECISION;

-- Update existing rows with default values
UPDATE listening_sessions SET test_id = 0 WHERE test_id IS NULL;
UPDATE listening_sessions SET band_score = 0 WHERE band_score IS NULL;
