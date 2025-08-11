import { api } from "encore.dev/api";
import { ieltsDB } from "./db";

export interface ReadingPassage {
  title: string;
  content: string;
  questions: ReadingQuestion[];
}

export interface ReadingQuestion {
  id: number;
  type: string; // 'multiple-choice', 'true-false-not-given', 'matching', 'fill-in-blank'
  question: string;
  options?: string[];
  correctAnswer: string;
}

export interface ReadingSubmission {
  userId: number;
  passageTitle: string;
  passageContent: string;
  questions: ReadingQuestion[];
  userAnswers: Record<number, string>;
  timeTaken?: number;
}

export interface ReadingResult {
  id: number;
  score: number;
  totalQuestions: number;
  correctAnswers: Record<number, string>;
  explanations: Record<number, string>;
}

export interface ReadingSession {
  id: number;
  passageTitle: string;
  score: number;
  totalQuestions: number;
  timeTaken?: number;
  createdAt: string;
}

export interface ReadingHighlight {
  id: number;
  highlightedText: string;
  startPosition: number;
  endPosition: number;
  highlightType: string;
  highlightColor: string;
  createdAt: string;
}

export interface CreateHighlightRequest {
  userId: number;
  passageTitle: string;
  highlightedText: string;
  startPosition: number;
  endPosition: number;
  highlightType: string;
  highlightColor?: string;
}

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  targetLanguage: string;
  definition?: string;
  exampleSentence?: string;
  audioUrl?: string;
}

export interface AddToVocabularyRequest {
  userId: number;
  text: string;
  definition: string;
  translation: string;
  targetLanguage: string;
  exampleSentence: string;
  topic?: string;
}

const samplePassages: ReadingPassage[] = [
  {
    title: "The Impact of Social Media on Modern Communication",
    content: `Social media has fundamentally transformed the way people communicate in the 21st century. Platforms like Facebook, Twitter, and Instagram have created new forms of interaction that were unimaginable just two decades ago. These platforms have enabled instant global communication, allowing people to connect across vast distances in real-time.

However, this digital revolution has also brought challenges. Critics argue that social media has led to a decline in face-to-face communication skills and has contributed to the spread of misinformation. Studies have shown that excessive use of social media can lead to feelings of isolation and depression, particularly among young people.

Despite these concerns, social media continues to play an increasingly important role in business, education, and social movements. Companies use these platforms for marketing and customer service, while educators leverage them for distance learning and student engagement. Social movements have also found social media to be a powerful tool for organizing and raising awareness about important issues.

The future of social media remains uncertain, but its impact on human communication is undeniable. As technology continues to evolve, society must find ways to harness the benefits of these platforms while mitigating their potential negative effects.`,
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "According to the passage, social media has:",
        options: [
          "Only positive effects on communication",
          "Only negative effects on communication", 
          "Both positive and negative effects on communication",
          "No significant impact on communication"
        ],
        correctAnswer: "Both positive and negative effects on communication"
      },
      {
        id: 2,
        type: "true-false-not-given",
        question: "Social media platforms were widely used 30 years ago.",
        correctAnswer: "False"
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "Which of the following is NOT mentioned as a use of social media?",
        options: [
          "Marketing",
          "Education",
          "Medical diagnosis",
          "Social movements"
        ],
        correctAnswer: "Medical diagnosis"
      }
    ]
  }
];

// Retrieves a random reading passage with questions.
export const getReadingPassage = api<void, ReadingPassage>(
  { expose: true, method: "GET", path: "/reading/passage" },
  async () => {
    const randomIndex = Math.floor(Math.random() * samplePassages.length);
    return samplePassages[randomIndex];
  }
);

// Submits reading answers for evaluation.
export const submitReading = api<ReadingSubmission, ReadingResult>(
  { expose: true, method: "POST", path: "/reading/submit" },
  async (req) => {
    let score = 0;
    const correctAnswers: Record<number, string> = {};
    const explanations: Record<number, string> = {};

    // Calculate score and prepare explanations
    req.questions.forEach(question => {
      correctAnswers[question.id] = question.correctAnswer;
      const userAnswer = req.userAnswers[question.id];
      
      if (userAnswer === question.correctAnswer) {
        score++;
        explanations[question.id] = "Correct! Well done.";
      } else {
        explanations[question.id] = `Incorrect. The correct answer is: ${question.correctAnswer}`;
      }
    });

    // Save session to database
    const session = await ieltsDB.queryRow<{ id: number }>`
      INSERT INTO reading_sessions 
      (user_id, passage_title, passage_content, questions, user_answers, correct_answers, 
       score, total_questions, time_taken)
      VALUES (${req.userId}, ${req.passageTitle}, ${req.passageContent}, 
              ${JSON.stringify(req.questions)}, ${JSON.stringify(req.userAnswers)}, 
              ${JSON.stringify(correctAnswers)}, ${score}, ${req.questions.length}, 
              ${req.timeTaken || null})
      RETURNING id
    `;

    if (!session) {
      throw new Error("Failed to save reading session");
    }

    return {
      id: session.id,
      score,
      totalQuestions: req.questions.length,
      correctAnswers,
      explanations,
    };
  }
);

// Retrieves user's reading session history.
export const getReadingSessions = api<{ userId: number }, { sessions: ReadingSession[] }>(
  { expose: true, method: "GET", path: "/users/:userId/reading/sessions" },
  async ({ userId }) => {
    const sessions = await ieltsDB.queryAll<ReadingSession>`
      SELECT id, passage_title as "passageTitle", score, total_questions as "totalQuestions",
             time_taken as "timeTaken", created_at as "createdAt"
      FROM reading_sessions 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 20
    `;

    return { sessions };
  }
);

// Creates a new highlight for a reading passage.
export const createHighlight = api<CreateHighlightRequest, ReadingHighlight>(
  { expose: true, method: "POST", path: "/reading/highlights" },
  async (req) => {
    const highlight = await ieltsDB.queryRow<ReadingHighlight>`
      INSERT INTO reading_highlights 
      (user_id, passage_title, highlighted_text, start_position, end_position, highlight_type, highlight_color)
      VALUES (${req.userId}, ${req.passageTitle}, ${req.highlightedText}, 
              ${req.startPosition}, ${req.endPosition}, ${req.highlightType}, 
              ${req.highlightColor || 'yellow'})
      ON CONFLICT (user_id, passage_title, start_position, end_position)
      DO UPDATE SET 
        highlighted_text = ${req.highlightedText},
        highlight_type = ${req.highlightType},
        highlight_color = ${req.highlightColor || 'yellow'}
      RETURNING id, highlighted_text as "highlightedText", start_position as "startPosition",
                end_position as "endPosition", highlight_type as "highlightType",
                highlight_color as "highlightColor", created_at as "createdAt"
    `;

    if (!highlight) {
      throw new Error("Failed to create highlight");
    }

    return highlight;
  }
);

// Retrieves highlights for a specific passage and user.
export const getHighlights = api<{ userId: number; passageTitle: string }, { highlights: ReadingHighlight[] }>(
  { expose: true, method: "GET", path: "/users/:userId/reading/highlights/:passageTitle" },
  async ({ userId, passageTitle }) => {
    const highlights = await ieltsDB.queryAll<ReadingHighlight>`
      SELECT id, highlighted_text as "highlightedText", start_position as "startPosition",
             end_position as "endPosition", highlight_type as "highlightType",
             highlight_color as "highlightColor", created_at as "createdAt"
      FROM reading_highlights 
      WHERE user_id = ${userId} AND passage_title = ${passageTitle}
      ORDER BY start_position ASC
    `;

    return { highlights };
  }
);

// Deletes a highlight.
export const deleteHighlight = api<{ userId: number; highlightId: number }, void>(
  { expose: true, method: "DELETE", path: "/users/:userId/reading/highlights/:highlightId" },
  async ({ userId, highlightId }) => {
    await ieltsDB.exec`
      DELETE FROM reading_highlights 
      WHERE id = ${highlightId} AND user_id = ${userId}
    `;
  }
);

// Translates text to the target language.
export const translateText = api<TranslationRequest, TranslationResponse>(
  { expose: true, method: "POST", path: "/reading/translate" },
  async (req) => {
    // Mock translation service - in a real app, this would call a translation API
    const translations: Record<string, Record<string, string>> = {
      "social media": {
        "uz": "ijtimoiy tarmoqlar",
        "ru": "социальные сети",
        "en": "social media"
      },
      "communication": {
        "uz": "aloqa",
        "ru": "общение",
        "en": "communication"
      },
      "technology": {
        "uz": "texnologiya",
        "ru": "технология",
        "en": "technology"
      },
      "platform": {
        "uz": "platforma",
        "ru": "платформа",
        "en": "platform"
      },
      "digital": {
        "uz": "raqamli",
        "ru": "цифровой",
        "en": "digital"
      },
      "revolution": {
        "uz": "inqilob",
        "ru": "революция",
        "en": "revolution"
      },
      "misinformation": {
        "uz": "noto'g'ri ma'lumot",
        "ru": "дезинформация",
        "en": "misinformation"
      },
      "isolation": {
        "uz": "izolyatsiya",
        "ru": "изоляция",
        "en": "isolation"
      },
      "depression": {
        "uz": "depressiya",
        "ru": "депрессия",
        "en": "depression"
      },
      "engagement": {
        "uz": "jalb qilish",
        "ru": "вовлечение",
        "en": "engagement"
      }
    };

    const lowerText = req.text.toLowerCase().trim();
    const translatedText = translations[lowerText]?.[req.targetLanguage] || `[Translation for "${req.text}" not available]`;

    // Mock definition and example
    const definition = `Definition of "${req.text}" - a comprehensive explanation would be provided here.`;
    const exampleSentence = `Example: "${req.text}" is commonly used in modern contexts.`;

    return {
      originalText: req.text,
      translatedText,
      targetLanguage: req.targetLanguage,
      definition,
      exampleSentence,
      audioUrl: `/audio/${req.text.toLowerCase().replace(/\s+/g, '-')}.mp3`
    };
  }
);

// Adds highlighted text to user's vocabulary.
export const addToVocabulary = api<AddToVocabularyRequest, { success: boolean; wordId: number }>(
  { expose: true, method: "POST", path: "/reading/add-to-vocabulary" },
  async (req) => {
    // First, check if the word already exists
    let word = await ieltsDB.queryRow<{ id: number }>`
      SELECT id FROM vocabulary_words WHERE LOWER(word) = LOWER(${req.text})
    `;

    let wordId: number;

    if (!word) {
      // Create new vocabulary word
      const newWord = await ieltsDB.queryRow<{ id: number }>`
        INSERT INTO vocabulary_words (word, definition, example_sentence, topic, difficulty_level)
        VALUES (${req.text}, ${req.definition}, ${req.exampleSentence}, ${req.topic || 'Reading'}, 2)
        RETURNING id
      `;
      
      if (!newWord) {
        throw new Error("Failed to create vocabulary word");
      }
      
      wordId = newWord.id;
    } else {
      wordId = word.id;
    }

    // Add translation
    await ieltsDB.exec`
      INSERT INTO vocabulary_translations (word_id, language, translation)
      VALUES (${wordId}, ${req.targetLanguage}, ${req.translation})
      ON CONFLICT (word_id, language)
      DO UPDATE SET translation = ${req.translation}
    `;

    // Add to user's vocabulary
    await ieltsDB.exec`
      INSERT INTO user_vocabulary (user_id, word_id, status)
      VALUES (${req.userId}, ${wordId}, 'learning')
      ON CONFLICT (user_id, word_id)
      DO NOTHING
    `;

    return { success: true, wordId };
  }
);
