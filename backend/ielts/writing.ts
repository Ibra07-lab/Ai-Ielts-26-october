import { api } from "encore.dev/api";
import { ieltsDB } from "./db";

export interface WritingPrompt {
  taskType: number;
  prompt: string;
}

export interface WritingSubmission {
  userId: number;
  taskType: number;
  prompt: string;
  content: string;
}

export interface WritingFeedback {
  id: number;
  bandScore: number;
  grammarFeedback: string;
  vocabularyFeedback: string;
  structureFeedback: string;
  coherenceFeedback: string;
}

export interface WritingSession {
  id: number;
  taskType: number;
  prompt: string;
  content: string;
  bandScore?: number;
  grammarFeedback?: string;
  vocabularyFeedback?: string;
  structureFeedback?: string;
  coherenceFeedback?: string;
  createdAt: string;
}

const writingPrompts: Record<number, string[]> = {
  1: [
    "The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
    "The diagram below shows the process of making chocolate. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
    "The table below shows the proportion of different categories of families living in poverty in Australia in 1999. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
  ],
  2: [
    "Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake, regardless of whether the course is useful to an employer. What, in your opinion, should be the main function of a university?",
    "In many countries, children are engaged in some kind of paid work. Some people regard this as completely wrong, while others consider it as valuable work experience, important for learning and taking responsibility. Discuss both these views and give your own opinion.",
    "Some people believe that technology has made man more social. To what extent do you agree or disagree with this opinion?",
  ],
};

// Retrieves a random writing prompt for a specific task type.
export const getWritingPrompt = api<{ taskType: number }, WritingPrompt>(
  { expose: true, method: "GET", path: "/writing/prompt/:taskType" },
  async ({ taskType }) => {
    const prompts = writingPrompts[taskType] || [];
    const randomIndex = Math.floor(Math.random() * prompts.length);
    const prompt = prompts[randomIndex];

    return {
      taskType,
      prompt,
    };
  }
);

// Submits a writing task for evaluation.
export const submitWriting = api<WritingSubmission, WritingFeedback>(
  { expose: true, method: "POST", path: "/writing/submit" },
  async (req) => {
    // Mock AI evaluation - in a real app, this would call an AI service
    const wordCount = req.content.split(/\s+/).length;
    const bandScore = Math.round((Math.random() * 3 + 5) * 10) / 10; // 5.0-8.0 range

    const grammarFeedback = bandScore >= 7 
      ? "Good grammar usage with minor errors. Consider reviewing complex sentence structures."
      : "Focus on improving grammar accuracy. Pay attention to verb tenses and subject-verb agreement.";

    const vocabularyFeedback = bandScore >= 7
      ? "Good range of vocabulary. Try to use more sophisticated and topic-specific words."
      : "Expand your vocabulary range. Use more varied and precise words to express your ideas.";

    const structureFeedback = req.taskType === 1
      ? "Ensure you have a clear introduction, body paragraphs describing the data, and a conclusion."
      : "Make sure you have a clear introduction, body paragraphs with supporting arguments, and a conclusion.";

    const coherenceFeedback = wordCount < 150
      ? "Your response is too short. Aim for at least 150 words for Task 1 or 250 words for Task 2."
      : "Good coherence and cohesion. Use more linking words to improve flow between ideas.";

    const session = await ieltsDB.queryRow<WritingFeedback>`
      INSERT INTO writing_submissions 
      (user_id, task_type, prompt, content, band_score, grammar_feedback, 
       vocabulary_feedback, structure_feedback, coherence_feedback)
      VALUES (${req.userId}, ${req.taskType}, ${req.prompt}, ${req.content}, 
              ${bandScore}, ${grammarFeedback}, ${vocabularyFeedback}, 
              ${structureFeedback}, ${coherenceFeedback})
      RETURNING id, band_score as "bandScore", grammar_feedback as "grammarFeedback",
                vocabulary_feedback as "vocabularyFeedback", structure_feedback as "structureFeedback",
                coherence_feedback as "coherenceFeedback"
    `;

    if (!session) {
      throw new Error("Failed to save writing submission");
    }

    return session;
  }
);

// Retrieves user's writing session history.
export const getWritingSessions = api<{ userId: number }, { sessions: WritingSession[] }>(
  { expose: true, method: "GET", path: "/users/:userId/writing/sessions" },
  async ({ userId }) => {
    const sessions = await ieltsDB.queryAll<WritingSession>`
      SELECT id, task_type as "taskType", prompt, content, band_score as "bandScore",
             grammar_feedback as "grammarFeedback", vocabulary_feedback as "vocabularyFeedback",
             structure_feedback as "structureFeedback", coherence_feedback as "coherenceFeedback",
             created_at as "createdAt"
      FROM writing_submissions 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 20
    `;

    return { sessions };
  }
);
