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
