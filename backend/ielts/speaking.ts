import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { AuthData } from "../auth/auth";
import { supabaseAdmin } from "./db";

export interface SpeakingQuestion {
  part: number;
  question: string;
}

export interface SpeakingSubmission {
  userId: string;
  part: number;
  question: string;
  transcription?: string;
  audioUrl?: string;
}

export interface SpeakingFeedback {
  id: number;
  bandScore: number;
  fluencyScore: number;
  grammarScore: number;
  pronunciationScore: number;
  coherenceScore: number;
  feedback: string;
  transcription?: string;
}

export interface SpeakingSession {
  id: number;
  part: number;
  question: string;
  transcription?: string;
  audioUrl?: string;
  bandScore?: number;
  fluencyScore?: number;
  grammarScore?: number;
  pronunciationScore?: number;
  coherenceScore?: number;
  feedback?: string;
  createdAt: string;
}

const speakingQuestions: Record<number, string[]> = {
  1: [
    "What is your full name?",
    "Where are you from?",
    "Do you work or study?",
    "What do you like about your hometown?",
    "Do you prefer to stay at home or go out in your free time?",
  ],
  2: [
    "Describe a book you have recently read. You should say: what the book was about, why you chose to read it, what you learned from it, and explain whether you would recommend it to others.",
    "Describe a place you would like to visit. You should say: where it is, how you learned about this place, what you would like to do there, and explain why you want to visit this place.",
    "Describe a skill you would like to learn. You should say: what the skill is, why you want to learn it, how you would learn it, and explain how this skill would be useful to you.",
  ],
  3: [
    "How has technology changed the way people communicate?",
    "What are the advantages and disadvantages of social media?",
    "Do you think traditional books will disappear in the future?",
    "How important is it for people to learn foreign languages?",
    "What role should governments play in protecting the environment?",
  ],
};

// Retrieves a random speaking question for a specific part.
export const getSpeakingQuestion = api<{ part: number }, SpeakingQuestion>(
  { expose: true, method: "GET", path: "/speaking/question/:part" },
  async ({ part }) => {
    const questions = speakingQuestions[part] || [];
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];

    return {
      part,
      question,
    };
  }
);

// Submits a speaking response for evaluation.
export const submitSpeaking = api<SpeakingSubmission, SpeakingFeedback>(
  { expose: true, method: "POST", path: "/speaking/submit", auth: true },
  async (req) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== req.userId) {
      throw APIError.permissionDenied("You can only submit for yourself");
    }

    // Mock AI evaluation - in a real app, this would call an AI service
    const bandScore = Math.round((Math.random() * 3 + 5) * 10) / 10; // 5.0-8.0 range
    const fluencyScore = Math.round((Math.random() * 3 + 5) * 10) / 10;
    const grammarScore = Math.round((Math.random() * 3 + 5) * 10) / 10;
    const pronunciationScore = Math.round((Math.random() * 3 + 5) * 10) / 10;
    const coherenceScore = Math.round((Math.random() * 3 + 5) * 10) / 10;

    const feedback = `Good effort! Your response shows ${bandScore >= 7 ? 'strong' : 'developing'} speaking skills. 
    Focus on improving fluency and using more varied vocabulary. 
    ${grammarScore < 6 ? 'Pay attention to grammar accuracy, particularly with complex sentence structures.' : ''}
    ${pronunciationScore < 6 ? 'Work on pronunciation clarity and word stress.' : ''}`;

    const { data: session, error } = await supabaseAdmin
      .from("speaking_sessions")
      .insert({
        user_id:             req.userId,
        part:                req.part,
        question:            req.question,
        transcription:       req.transcription || null,
        audio_url:           req.audioUrl || null,
        band_score:          bandScore,
        fluency_score:       fluencyScore,
        grammar_score:       grammarScore,
        pronunciation_score: pronunciationScore,
        coherence_score:     coherenceScore,
        feedback,
      })
      .select("id, band_score, fluency_score, grammar_score, pronunciation_score, coherence_score, feedback, transcription")
      .single();

    if (error || !session) throw new Error("Failed to save speaking session");

    return {
      id:                 session.id,
      bandScore:          session.band_score,
      fluencyScore:       session.fluency_score,
      grammarScore:       session.grammar_score,
      pronunciationScore: session.pronunciation_score,
      coherenceScore:     session.coherence_score,
      feedback:           session.feedback,
      transcription:      session.transcription ?? undefined,
    };
  }
);

// Retrieves user's speaking session history.
export const getSpeakingSessions = api<{ userId: string }, { sessions: SpeakingSession[] }>(
  { expose: true, method: "GET", path: "/users/:userId/speaking/sessions", auth: true },
  async ({ userId }) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== userId) {
      throw APIError.permissionDenied("You can only access your own speaking sessions");
    }

    const { data: rows, error } = await supabaseAdmin
      .from("speaking_sessions")
      .select("id, part, question, transcription, audio_url, band_score, fluency_score, grammar_score, pronunciation_score, coherence_score, feedback, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw APIError.internal(error.message);

    const sessions: SpeakingSession[] = (rows || []).map((row: any) => ({
      id:                 row.id,
      part:               row.part,
      question:           row.question,
      transcription:      row.transcription ?? undefined,
      audioUrl:           row.audio_url ?? undefined,
      bandScore:          row.band_score ?? undefined,
      fluencyScore:       row.fluency_score ?? undefined,
      grammarScore:       row.grammar_score ?? undefined,
      pronunciationScore: row.pronunciation_score ?? undefined,
      coherenceScore:     row.coherence_score ?? undefined,
      feedback:           row.feedback ?? undefined,
      createdAt:          row.created_at,
    }));

    return { sessions };
  }
);

