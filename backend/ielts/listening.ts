import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { AuthData } from "../auth/auth";
import { supabaseAdmin } from "./db";
import * as fs from "node:fs";
import * as path from "node:path";

export interface ListeningTranscriptLine {
  speaker: string;
  timestamp?: string;
  text: string;
}

export interface ListeningTranscriptSection {
  title: string;
  lines: ListeningTranscriptLine[];
}

export interface ListeningQuestion {
  id: number;
  type: "multiple-choice" | "fill-in-blank" | "matching" | "pick-two";
  questionNumber: number;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  alternativeAnswers?: string[];
  explanation?: string;
}

export interface ListeningTest {
  id: number;
  title: string;
  section: number;
  difficulty: "easy" | "medium" | "hard";
  audioFile: string;
  duration: number;
  instructions?: string;
  transcript?: ListeningTranscriptLine[];
  transcripts?: ListeningTranscriptSection[];
  questions: ListeningQuestion[];
}

export interface ListeningTestMeta {
  id: number;
  title: string;
  section: number;
  difficulty: string;
  questionCount: number;
  duration: number;
}

export interface ListeningSubmission {
  userId: string;
  testId: number;
  userAnswers: Record<number, string>;
  timeTaken?: number;
}

export interface ListeningResult {
  id: number;
  score: number;
  totalQuestions: number;
  correctAnswers: Record<number, string | string[]>;
  userAnswers: Record<number, string>;
  explanations: Record<number, string>;
  bandScore: number;
}

export interface ListeningSession {
  id: number;
  testId: number;
  testTitle: string;
  score: number;
  totalQuestions: number;
  bandScore: number;
  timeTaken?: number;
  createdAt: string;
}

// =============================================================================
// Data Loading Functions
// =============================================================================

// Use process.cwd() since Encore runs from the backend directory
const listeningTestsPath = path.join(process.cwd(), "data/listening-tests");

function loadAllListeningTests(): ListeningTest[] {
  try {
    if (!fs.existsSync(listeningTestsPath)) {
      console.warn(`Listening tests directory not found: ${listeningTestsPath}`);
      return [];
    }

    const files = fs.readdirSync(listeningTestsPath).filter(f => f.endsWith(".json"));
    const tests: ListeningTest[] = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(listeningTestsPath, file), "utf-8");
        const test = JSON.parse(content) as ListeningTest;
        tests.push(test);
      } catch (err) {
        console.error(`Failed to load listening test ${file}:`, err);
      }
    }

    return tests.sort((a, b) => a.id - b.id);
  } catch (err) {
    console.error("Failed to load listening tests:", err);
    return [];
  }
}

function loadListeningTestById(testId: number): ListeningTest | null {
  try {
    const testFile = path.join(listeningTestsPath, `test-${testId}.json`);
    if (!fs.existsSync(testFile)) {
      return null;
    }
    const content = fs.readFileSync(testFile, "utf-8");
    return JSON.parse(content) as ListeningTest;
  } catch (err) {
    console.error(`Failed to load listening test ${testId}:`, err);
    return null;
  }
}

// Calculate IELTS band score based on raw score (40 questions total)
function calculateBandScore(score: number, total: number): number {
  // Scale the score to be out of 40 (since real IELTS has 40 questions)
  const rawScore = Math.round((score / total) * 40);

  if (rawScore >= 39) return 9.0;
  if (rawScore >= 37) return 8.5;
  if (rawScore >= 35) return 8.0;
  if (rawScore >= 32) return 7.5;
  if (rawScore >= 30) return 7.0;
  if (rawScore >= 26) return 6.5;
  if (rawScore >= 23) return 6.0;
  if (rawScore >= 18) return 5.5;
  if (rawScore >= 16) return 5.0;
  if (rawScore >= 13) return 4.5;
  if (rawScore >= 10) return 4.0;
  if (rawScore >= 7) return 3.5;
  if (rawScore >= 5) return 3.0;
  if (rawScore >= 3) return 2.5;
  if (rawScore >= 2) return 2.0;
  if (rawScore >= 1) return 1.0;
  return 0.0;
}

// =============================================================================
// API Endpoints
// =============================================================================

// Get list of all available listening tests
export const getListeningTests = api<void, { tests: ListeningTestMeta[] }>(
  { expose: true, method: "GET", path: "/listening/tests" },
  async () => {
    const tests = loadAllListeningTests();
    return {
      tests: tests.map(t => ({
        id: t.id,
        title: t.title,
        section: t.section,
        difficulty: t.difficulty,
        questionCount: t.questions.length,
        duration: t.duration,
      })),
    };
  }
);

// Get a specific listening test by ID (without correct answers for practice)
export const getListeningTest = api<{ testId: number }, ListeningTest>(
  { expose: true, method: "GET", path: "/listening/tests/:testId" },
  async ({ testId }) => {
    const test = loadListeningTestById(testId);
    if (!test) {
      throw new Error(`Listening test ${testId} not found`);
    }

    // Return test without correct answers for practice mode
    return {
      ...test,
      questions: test.questions.map(q => ({
        ...q,
        correctAnswer: "", // Hide correct answer
        alternativeAnswers: undefined,
        explanation: undefined,
      })),
    };
  }
);

// Get transcript for a test (can be shown after submission or during practice based on settings)
export const getListeningTranscript = api<{ testId: number }, { transcript: ListeningTranscriptLine[], transcripts?: ListeningTranscriptSection[] }>(
  { expose: true, method: "GET", path: "/listening/tests/:testId/transcript" },
  async ({ testId }) => {
    const test = loadListeningTestById(testId);
    if (!test) {
      throw new Error(`Listening test ${testId} not found`);
    }
    return {
      transcript: test.transcript || [],
      transcripts: test.transcripts
    };
  }
);

// Submit listening answers for evaluation
export const submitListening = api<ListeningSubmission, ListeningResult>(
  { expose: true, method: "POST", path: "/listening/submit", auth: true },
  async (req) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== req.userId) {
      throw APIError.permissionDenied("You can only submit for yourself");
    }

    const test = loadListeningTestById(req.testId);
    if (!test) {
      throw new Error(`Listening test ${req.testId} not found`);
    }

    let score = 0;
    const correctAnswers: Record<number, string | string[]> = {};
    const explanations: Record<number, string> = {};

    // Calculate score
    test.questions.forEach(question => {
      correctAnswers[question.id] = question.correctAnswer;
      const userAnswer = req.userAnswers[question.id]?.trim() || "";

      let isCorrect = false;

      if (question.type === "pick-two" || Array.isArray(question.correctAnswer)) {
        const correctAnswer = question.correctAnswer;
        const correctParts = Array.isArray(correctAnswer)
          ? correctAnswer
          : (typeof correctAnswer === 'string' ? correctAnswer.split(',') : []);

        const normalizedParts = correctParts.map(a => a.trim().toUpperCase());
        isCorrect = normalizedParts.includes(userAnswer.toUpperCase());
      } else {
        const correctAnswer = (question.correctAnswer as string).toLowerCase().trim();
        const alternatives = question.alternativeAnswers?.map(a => a.toLowerCase().trim()) || [];
        isCorrect = userAnswer.toLowerCase() === correctAnswer || alternatives.includes(userAnswer.toLowerCase());
      }

      if (isCorrect) {
        score++;
        explanations[question.id] = "✓ Correct!";
      } else {
        const displayAnswer = Array.isArray(question.correctAnswer)
          ? question.correctAnswer.join(", ")
          : question.correctAnswer;
        explanations[question.id] = question.explanation || `The correct answer is: ${displayAnswer}`;
      }
    });

    const bandScore = calculateBandScore(score, test.questions.length);

    // Save session to database
    const { data: session, error: sessionErr } = await supabaseAdmin
      .from("listening_sessions")
      .insert({
        user_id:         req.userId,
        test_id:         test.id,
        audio_title:     test.title,
        audio_url:       test.audioFile,
        questions:       JSON.stringify(test.questions),
        user_answers:    JSON.stringify(req.userAnswers),
        correct_answers: JSON.stringify(correctAnswers),
        score,
        total_questions: test.questions.length,
        band_score:      bandScore,
        time_taken:      req.timeTaken || null,
      })
      .select("id")
      .single();

    if (sessionErr || !session) throw new Error("Failed to save listening session");

    return {
      id: session.id,
      score,
      totalQuestions: test.questions.length,
      correctAnswers,
      userAnswers: req.userAnswers,
      explanations,
      bandScore,
    };
  }
);

// Get user's listening session history
export const getListeningSessions = api<{ userId: string }, { sessions: ListeningSession[] }>(
  { expose: true, method: "GET", path: "/users/:userId/listening/sessions", auth: true },
  async ({ userId }) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== userId) {
      throw APIError.permissionDenied("You can only access your own listening sessions");
    }

    const { data: rows, error } = await supabaseAdmin
      .from("listening_sessions")
      .select("id, test_id, audio_title, score, total_questions, band_score, time_taken, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw APIError.internal(error.message);

    const sessions: ListeningSession[] = (rows || []).map((row: any) => ({
      id:             row.id,
      testId:         row.test_id,
      testTitle:      row.audio_title,
      score:          row.score,
      totalQuestions: row.total_questions,
      bandScore:      row.band_score,
      timeTaken:      row.time_taken ?? undefined,
      createdAt:      row.created_at,
    }));

    return { sessions };
  }
);

// Legacy endpoint for backward compatibility
export const getListeningAudio = api<void, ListeningTest>(
  { expose: true, method: "GET", path: "/listening/audio" },
  async () => {
    const tests = loadAllListeningTests();
    if (tests.length === 0) {
      throw new Error("No listening tests available");
    }
    const randomTest = tests[Math.floor(Math.random() * tests.length)];
    return randomTest;
  }
);

