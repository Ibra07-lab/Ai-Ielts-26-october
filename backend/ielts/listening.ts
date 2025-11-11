import { api } from "encore.dev/api";
import { ieltsDB } from "./db";

export interface ListeningAudio {
  title: string;
  audioUrl: string;
  questions: ListeningQuestion[];
}

export interface ListeningQuestion {
  id: number;
  type: string; // 'multiple-choice', 'fill-in-blank', 'matching'
  question: string;
  options?: string[];
  correctAnswer: string;
}

export interface ListeningSubmission {
  userId: number;
  audioTitle: string;
  audioUrl: string;
  questions: ListeningQuestion[];
  userAnswers: Record<number, string>;
  timeTaken?: number;
}

export interface ListeningResult {
  id: number;
  score: number;
  totalQuestions: number;
  correctAnswers: Record<number, string>;
  explanations: Record<number, string>;
}

export interface ListeningSession {
  id: number;
  audioTitle: string;
  score: number;
  totalQuestions: number;
  timeTaken?: number;
  createdAt: string;
}

const sampleAudios: ListeningAudio[] = [
  {
    title: "University Lecture: Climate Change",
    audioUrl: "/audio/climate-change-lecture.mp3", // Mock URL
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "What is the main cause of climate change according to the lecturer?",
        options: [
          "Natural weather patterns",
          "Human activities",
          "Solar radiation",
          "Ocean currents"
        ],
        correctAnswer: "Human activities"
      },
      {
        id: 2,
        type: "fill-in-blank",
        question: "The global temperature has increased by _____ degrees Celsius since 1880.",
        correctAnswer: "1.1"
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "Which sector contributes most to greenhouse gas emissions?",
        options: [
          "Transportation",
          "Agriculture",
          "Energy production",
          "Manufacturing"
        ],
        correctAnswer: "Energy production"
      }
    ]
  }
];

// Retrieves a random listening audio with questions.
export const getListeningAudio = api<void, ListeningAudio>(
  { expose: true, method: "GET", path: "/listening/audio" },
  async () => {
    const randomIndex = Math.floor(Math.random() * sampleAudios.length);
    return sampleAudios[randomIndex];
  }
);

// Submits listening answers for evaluation.
export const submitListening = api<ListeningSubmission, ListeningResult>(
  { expose: true, method: "POST", path: "/listening/submit" },
  async (req) => {
    let score = 0;
    const correctAnswers: Record<number, string> = {};
    const explanations: Record<number, string> = {};

    // Calculate score and prepare explanations
    req.questions.forEach(question => {
      correctAnswers[question.id] = question.correctAnswer;
      const userAnswer = req.userAnswers[question.id];
      
      if (userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
        score++;
        explanations[question.id] = "Correct! Well done.";
      } else {
        // Omit generic incorrect message unless provided in data
        explanations[question.id] = "";
      }
    });

    // Save session to database
    const session = await ieltsDB.queryRow<{ id: number }>`
      INSERT INTO listening_sessions 
      (user_id, audio_title, audio_url, questions, user_answers, correct_answers, 
       score, total_questions, time_taken)
      VALUES (${req.userId}, ${req.audioTitle}, ${req.audioUrl}, 
              ${JSON.stringify(req.questions)}, ${JSON.stringify(req.userAnswers)}, 
              ${JSON.stringify(correctAnswers)}, ${score}, ${req.questions.length}, 
              ${req.timeTaken || null})
      RETURNING id
    `;

    if (!session) {
      throw new Error("Failed to save listening session");
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

// Retrieves user's listening session history.
export const getListeningSessions = api<{ userId: number }, { sessions: ListeningSession[] }>(
  { expose: true, method: "GET", path: "/users/:userId/listening/sessions" },
  async ({ userId }) => {
    const sessions = await ieltsDB.queryAll<ListeningSession>`
      SELECT id, audio_title as "audioTitle", score, total_questions as "totalQuestions",
             time_taken as "timeTaken", created_at as "createdAt"
      FROM listening_sessions 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 20
    `;

    return { sessions };
  }
);
