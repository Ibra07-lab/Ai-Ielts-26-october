-- Rollback migration
ALTER TABLE listening_sessions 
DROP COLUMN IF EXISTS test_id,
DROP COLUMN IF EXISTS band_score;
