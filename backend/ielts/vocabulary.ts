import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { AuthData } from "../auth/auth";
import { supabaseAdmin } from "./db";

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
export const getVocabularyWords = api<{ userId: string; topic?: string; limit?: number }, { words: VocabularyWord[] }>(
  { expose: true, method: "GET", path: "/users/:userId/vocabulary", auth: true },
  async ({ userId, topic, limit = 10 }) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== userId) {
      throw APIError.permissionDenied("You can only access your own vocabulary");
    }

    // Fetch all vocabulary words (with optional topic filter), then join user_vocabulary separately
    let wordsQuery = supabaseAdmin
      .from("vocabulary_words")
      .select("id, word, definition, example_sentence, topic, difficulty_level, audio_url")
      .limit(limit);

    if (topic) wordsQuery = wordsQuery.eq("topic", topic);

    // Supabase doesn't support ORDER BY RANDOM() via API, so we shuffle in JS
    const { data: words, error: wordsErr } = await wordsQuery;
    if (wordsErr) throw APIError.internal(wordsErr.message);

    const wordList = words || [];

    // Shuffle randomly
    wordList.sort(() => Math.random() - 0.5);

    if (wordList.length === 0) return { words: [] };

    // Fetch user vocabulary status for these words
    const wordIds = wordList.map((w: any) => w.id);
    const { data: uvRows } = await supabaseAdmin
      .from("user_vocabulary")
      .select("word_id, status, next_review_date, review_count")
      .eq("user_id", userId)
      .in("word_id", wordIds);

    const uvMap = new Map<number, any>();
    for (const uv of (uvRows || [])) uvMap.set(uv.word_id, uv);

    const result: VocabularyWord[] = wordList.map((w: any) => {
      const uv = uvMap.get(w.id);
      return {
        id:              w.id,
        word:            w.word,
        definition:      w.definition,
        exampleSentence: w.example_sentence,
        topic:           w.topic,
        difficultyLevel: w.difficulty_level,
        audioUrl:        w.audio_url ?? undefined,
        status:          uv?.status ?? undefined,
        nextReviewDate:  uv?.next_review_date ?? undefined,
        reviewCount:     uv?.review_count ?? undefined,
      };
    });

    return { words: result };
  }
);

// Updates user's vocabulary word status.
export const updateVocabularyStatus = api<{ userId: string; wordId: number; status: string }, void>(
  { expose: true, method: "POST", path: "/users/:userId/vocabulary/:wordId/status", auth: true },
  async ({ userId, wordId, status }) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== userId) {
      throw APIError.permissionDenied("You can only update your own vocabulary status");
    }

    const nextReviewDate = status === "review"
      ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      : null;

    const { data: existing } = await supabaseAdmin
      .from("user_vocabulary")
      .select("review_count")
      .eq("user_id", userId)
      .eq("word_id", wordId)
      .maybeSingle();

    await supabaseAdmin
      .from("user_vocabulary")
      .upsert(
        {
          user_id:          userId,
          word_id:          wordId,
          status,
          next_review_date: nextReviewDate,
          review_count:     (existing?.review_count ?? 0) + 1,
          updated_at:       new Date().toISOString(),
        },
        { onConflict: "user_id,word_id" }
      );
  }
);

// Retrieves vocabulary progress for a user.
export const getVocabularyProgress = api<{ userId: string }, VocabularyProgress>(
  { expose: true, method: "GET", path: "/users/:userId/vocabulary/progress", auth: true },
  async ({ userId }) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== userId) {
      throw APIError.permissionDenied("You can only access your own vocabulary progress");
    }

    // Total words
    const { count: totalWords } = await supabaseAdmin
      .from("vocabulary_words")
      .select("id", { count: "exact", head: true });

    // Known / learning / review per status
    const { data: uvRows } = await supabaseAdmin
      .from("user_vocabulary")
      .select("status")
      .eq("user_id", userId);

    let knownWords = 0, learningWords = 0, reviewWords = 0;
    for (const row of (uvRows || [])) {
      if (row.status === "known")    knownWords++;
      if (row.status === "learning") learningWords++;
      if (row.status === "review")   reviewWords++;
    }

    return {
      totalWords:    totalWords ?? 0,
      knownWords,
      learningWords,
      reviewWords,
    };
  }
);

// Retrieves vocabulary topics.
export const getVocabularyTopics = api<void, { topics: string[] }>(
  { expose: true, method: "GET", path: "/vocabulary/topics" },
  async () => {
    const { data: rows, error } = await supabaseAdmin
      .from("vocabulary_words")
      .select("topic");

    if (error) throw APIError.internal(error.message);

    const topics = [...new Set((rows || []).map((r: any) => r.topic))].sort();
    return { topics };
  }
);
