import backend from '@/backend';

const FEEDBACK_API_URL = 'http://localhost:8000';

export interface FeedbackRequest {
  passage: string;
  question: string;
  question_type: string;
  correct_answer: string;
  student_answer: string;
}

export interface FeedbackResponse {
  is_correct: boolean;
  feedback: string;
  reasoning: string;
  strategy_tip: string;
  passage_reference: string;
  confidence?: string;
}

/**
 * Get AI-powered feedback for a student's answer
 */
export async function getAIFeedback(request: FeedbackRequest & { userId: string }): Promise<FeedbackResponse> {
  // Log outgoing request for debugging
  console.log('Sending AI Feedback request through Encore:', request);

  try {
    const feedback = await backend.ielts.proxyReadingFeedback({
      userId: request.userId,
      passage: request.passage,
      question: request.question,
      question_type: request.question_type,
      correct_answer: request.correct_answer,
      student_answer: request.student_answer,
    });

    return feedback as FeedbackResponse;
  } catch (error: any) {
    console.error('AI Feedback error through Encore:', error);
    throw new Error(error.message || "Failed to get AI feedback");
  }
}

/**
 * Get AI feedback for multiple questions (batch)
 */
export async function getAIFeedbackBatch(requests: FeedbackRequest[]): Promise<{
  results: Array<{
    index: number;
    status: 'success' | 'error';
    feedback?: FeedbackResponse;
    error?: string;
  }>;
  total: number;
  successful: number;
  failed: number;
}> {
  const response = await fetch(`${FEEDBACK_API_URL}/api/feedback/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requests),
  });

  if (!response.ok) {
    throw new Error(`AI Feedback Batch API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check if AI feedback service is available
 */
export async function checkAIFeedbackHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${FEEDBACK_API_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('AI Feedback service is not available:', error);
    return false;
  }
}

