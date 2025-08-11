CREATE TABLE reading_highlights (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  passage_title TEXT NOT NULL,
  highlighted_text TEXT NOT NULL,
  start_position INTEGER NOT NULL,
  end_position INTEGER NOT NULL,
  highlight_type TEXT NOT NULL DEFAULT 'word', -- 'word' or 'sentence'
  highlight_color TEXT NOT NULL DEFAULT 'yellow',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, passage_title, start_position, end_position)
);

CREATE TABLE vocabulary_translations (
  id BIGSERIAL PRIMARY KEY,
  word_id BIGINT NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  language TEXT NOT NULL, -- 'uz', 'ru', 'en'
  translation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(word_id, language)
);

-- Add some sample translations for existing vocabulary
INSERT INTO vocabulary_translations (word_id, language, translation) VALUES
(1, 'uz', 'Barqaror'),
(1, 'ru', 'Устойчивый'),
(2, 'uz', 'O''quv dasturi'),
(2, 'ru', 'Учебная программа'),
(3, 'uz', 'Infratuzilma'),
(3, 'ru', 'Инфраструктура'),
(4, 'uz', 'Biologik xilma-xillik'),
(4, 'ru', 'Биоразнообразие'),
(5, 'uz', 'Innovatsiya'),
(5, 'ru', 'Инновация');
