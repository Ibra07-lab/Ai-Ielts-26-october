CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  target_band DOUBLE PRECISION NOT NULL DEFAULT 7.0,
  exam_date DATE,
  language TEXT NOT NULL DEFAULT 'en',
  theme TEXT NOT NULL DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL, -- 'speaking', 'writing', 'reading', 'listening'
  estimated_band DOUBLE PRECISION,
  practice_count INTEGER DEFAULT 0,
  last_practice_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill)
);

CREATE TABLE speaking_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  part INTEGER NOT NULL, -- 1, 2, or 3
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
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_type INTEGER NOT NULL, -- 1 or 2
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  band_score DOUBLE PRECISION,
  grammar_feedback TEXT,
  vocabulary_feedback TEXT,
  structure_feedback TEXT,
  coherence_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE vocabulary_words (
  id BIGSERIAL PRIMARY KEY,
  word TEXT NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  example_sentence TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty_level INTEGER DEFAULT 1,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_vocabulary (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_id BIGINT NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'learning', -- 'learning', 'known', 'review'
  next_review_date DATE,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

CREATE TABLE reading_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  passage_title TEXT NOT NULL,
  passage_content TEXT NOT NULL,
  questions JSONB NOT NULL,
  user_answers JSONB NOT NULL,
  correct_answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE listening_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  audio_title TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  questions JSONB NOT NULL,
  user_answers JSONB NOT NULL,
  correct_answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE daily_goals (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_date DATE NOT NULL,
  target_minutes INTEGER NOT NULL DEFAULT 30,
  completed_minutes INTEGER DEFAULT 0,
  activities_completed INTEGER DEFAULT 0,
  target_activities INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, goal_date)
);

-- Insert sample vocabulary words
INSERT INTO vocabulary_words (word, definition, example_sentence, topic, difficulty_level) VALUES
('Sustainable', 'Able to be maintained at a certain rate or level without depleting natural resources', 'The company adopted sustainable practices to reduce their environmental impact.', 'Environment', 2),
('Curriculum', 'The subjects comprising a course of study in a school or college', 'The new curriculum includes more emphasis on digital literacy.', 'Education', 2),
('Infrastructure', 'The basic physical and organizational structures needed for operation', 'The government invested heavily in improving the country''s infrastructure.', 'Government', 3),
('Biodiversity', 'The variety of plant and animal life in the world or in a particular habitat', 'Climate change poses a serious threat to global biodiversity.', 'Environment', 3),
('Innovation', 'The action or process of innovating; a new method, idea, or product', 'Technological innovation has transformed the way we communicate.', 'Technology', 2);
