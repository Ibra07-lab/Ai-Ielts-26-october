import { api } from "encore.dev/api";
import { ieltsDB } from "./db";

export interface SpeakingQuestion {
  part: number;
  question: string;
}

export interface SpeakingSubmission {
  userId: number;
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
  { expose: true, method: "POST", path: "/speaking/submit" },
  async (req) => {
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

    const session = await ieltsDB.queryRow<SpeakingFeedback>`
      INSERT INTO speaking_sessions 
      (user_id, part, question, transcription, audio_url, band_score, fluency_score, 
       grammar_score, pronunciation_score, coherence_score, feedback)
      VALUES (${req.userId}, ${req.part}, ${req.question}, ${req.transcription || null}, 
              ${req.audioUrl || null}, ${bandScore}, ${fluencyScore}, ${grammarScore}, 
              ${pronunciationScore}, ${coherenceScore}, ${feedback})
      RETURNING id, band_score as "bandScore", fluency_score as "fluencyScore", 
                grammar_score as "grammarScore", pronunciation_score as "pronunciationScore",
                coherence_score as "coherenceScore", feedback, transcription
    `;

    if (!session) {
      throw new Error("Failed to save speaking session");
    }

    return session;
  }
);

// Retrieves user's speaking session history.
export const getSpeakingSessions = api<{ userId: number }, { sessions: SpeakingSession[] }>(
  { expose: true, method: "GET", path: "/users/:userId/speaking/sessions" },
  async ({ userId }) => {
    const sessions = await ieltsDB.queryAll<SpeakingSession>`
      SELECT id, part, question, transcription, audio_url as "audioUrl",
             band_score as "bandScore", fluency_score as "fluencyScore",
             grammar_score as "grammarScore", pronunciation_score as "pronunciationScore",
             coherence_score as "coherenceScore", feedback, created_at as "createdAt"
      FROM speaking_sessions 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 20
    `;

    return { sessions };
  }
);
