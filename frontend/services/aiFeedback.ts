/**
 * AI Feedback Service
 * Connects to the Python LangChain feedback API
 */

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
export async function getAIFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
  // Log outgoing request for debugging 422 issues
  console.log('Sending AI Feedback request:', request);

  const response = await fetch(`${FEEDBACK_API_URL}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    // Try to read detailed error from backend
    let errorDetail = response.statusText;
    try {
      const errorData = await response.json();
      console.error('AI Feedback API error details:', errorData);
      if (typeof errorData === 'string') {
        errorDetail = errorData;
      } else if (errorData?.detail) {
        errorDetail = Array.isArray(errorData.detail)
          ? errorData.detail.map((d: any) => d.msg || JSON.stringify(d)).join('; ')
          : errorData.detail;
      } else if (errorData?.message) {
        errorDetail = errorData.message;
      }
    } catch {
      // ignore JSON parse errors, fall back to statusText
    }

    throw new Error(`AI Feedback API error: ${errorDetail}`);
  }

  return response.json();
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

