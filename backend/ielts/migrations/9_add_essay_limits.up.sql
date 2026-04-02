-- Add essay limit columns to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS plan               TEXT        NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS essays_used        INTEGER     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS active_analysis    BOOLEAN     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS analysis_started_at TIMESTAMPTZ;

-- ─── Atomic check-and-lock with auto-unlock ─────────────────────────────────
-- Checks the plan limit and locks the user for analysis in a single transaction.
-- Raises exceptions that the caller must catch:
--   ALREADY_ANALYZING  – user has a live analysis (started < 5 min ago)
--   LIMIT_REACHED      – essays_used >= plan limit
CREATE OR REPLACE FUNCTION check_and_lock_user(user_id TEXT)
RETURNS void AS $$
BEGIN
  -- 1. Auto-unlock if a previous analysis got stuck (tab closed, crash, etc.)
  UPDATE users
  SET active_analysis      = false,
      analysis_started_at  = NULL
  WHERE id = user_id::uuid
    AND active_analysis = true
    AND analysis_started_at < NOW() - INTERVAL '5 minutes';

  -- 2. Fail if another analysis is already in progress
  IF EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id::uuid AND active_analysis = true
  ) THEN
    RAISE EXCEPTION 'ALREADY_ANALYZING';
  END IF;

  -- 3. Fail if the user has hit their plan's essay limit
  IF EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = user_id::uuid
      AND u.essays_used >= CASE u.plan
            WHEN 'basic'    THEN 15
            WHEN 'pro'      THEN 40
            WHEN 'pro_plus' THEN 80
            ELSE 2          -- 'free' and any unknown plan
          END
  ) THEN
    RAISE EXCEPTION 'LIMIT_REACHED';
  END IF;

  -- 4. Lock the user
  UPDATE users
  SET active_analysis      = true,
      analysis_started_at  = NOW()
  WHERE id = user_id::uuid;
END;
$$ LANGUAGE plpgsql;

-- ─── Atomic increment ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_essays_used(user_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET essays_used = essays_used + 1
  WHERE id = user_id::uuid;
END;
$$ LANGUAGE plpgsql;
