import { api } from "encore.dev/api";
import { ieltsDB } from "./db";

export interface VocabularyWord {
  id: number;
  word: string;
  definition: string;
  exampleSentence: string;
  topic: string;
  difficultyLevel: number;
  audioUrl?: string;
  status?: string;
  nextReviewDate?: string;
  reviewCount?: number;
}

export interface VocabularyProgress {
  totalWords: number;
  knownWords: number;
  learningWords: number;
  reviewWords: number;
}

// Retrieves vocabulary words for practice.
export const getVocabularyWords = api<{ userId: number; topic?: string; limit?: number }, { words: VocabularyWord[] }>(
  { expose: true, method: "GET", path: "/users/:userId/vocabulary" },
  async ({ userId, topic, limit = 10 }) => {
    let query = `
      SELECT v.id, v.word, v.definition, v.example_sentence as "exampleSentence", 
             v.topic, v.difficulty_level as "difficultyLevel", v.audio_url as "audioUrl",
             uv.status, uv.next_review_date as "nextReviewDate", uv.review_count as "reviewCount"
      FROM vocabulary_words v
      LEFT JOIN user_vocabulary uv ON v.id = uv.word_id AND uv.user_id = $1
    `;
    
    const params: any[] = [userId];
    
    if (topic) {
      query += ` WHERE v.topic = $${params.length + 1}`;
      params.push(topic);
    }
    
    query += ` ORDER BY RANDOM() LIMIT $${params.length + 1}`;
    params.push(limit);

    const words = await ieltsDB.rawQueryAll<VocabularyWord>(query, ...params);

    return { words };
  }
);

// Updates user's vocabulary word status.
export const updateVocabularyStatus = api<{ userId: number; wordId: number; status: string }, void>(
  { expose: true, method: "POST", path: "/users/:userId/vocabulary/:wordId/status" },
  async ({ userId, wordId, status }) => {
    const nextReviewDate = status === 'review' 
      ? new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
      : null;

    await ieltsDB.exec`
      INSERT INTO user_vocabulary (user_id, word_id, status, next_review_date, review_count)
      VALUES (${userId}, ${wordId}, ${status}, ${nextReviewDate}, 1)
      ON CONFLICT (user_id, word_id)
      DO UPDATE SET 
        status = ${status},
        next_review_date = ${nextReviewDate},
        review_count = user_vocabulary.review_count + 1,
        updated_at = NOW()
    `;
  }
);

// Retrieves vocabulary progress for a user.
export const getVocabularyProgress = api<{ userId: number }, VocabularyProgress>(
  { expose: true, method: "GET", path: "/users/:userId/vocabulary/progress" },
  async ({ userId }) => {
    const progress = await ieltsDB.queryRow<VocabularyProgress>`
      SELECT 
        COUNT(*) as "totalWords",
        COUNT(CASE WHEN uv.status = 'known' THEN 1 END) as "knownWords",
        COUNT(CASE WHEN uv.status = 'learning' THEN 1 END) as "learningWords",
        COUNT(CASE WHEN uv.status = 'review' THEN 1 END) as "reviewWords"
      FROM vocabulary_words v
      LEFT JOIN user_vocabulary uv ON v.id = uv.word_id AND uv.user_id = ${userId}
    `;

    return progress || { totalWords: 0, knownWords: 0, learningWords: 0, reviewWords: 0 };
  }
);

// Retrieves vocabulary topics.
export const getVocabularyTopics = api<void, { topics: string[] }>(
  { expose: true, method: "GET", path: "/vocabulary/topics" },
  async () => {
    const topics = await ieltsDB.queryAll<{ topic: string }>`
      SELECT DISTINCT topic FROM vocabulary_words ORDER BY topic
    `;

    return { topics: topics.map(t => t.topic) };
  }
);
