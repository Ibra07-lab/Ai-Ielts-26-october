// API client for FastAPI chat backend

const API_BASE_URL = 'http://localhost:8001/api';

// Types matching backend Pydantic models
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  session_id: string;
  messages: ChatMessage[];
  dropped_question_id?: string | null;
}

export interface DeeperFeedbackRequest {
  passage_id: string;
  question_id: string;
  student_answer: string;
}

export interface DeeperFeedbackResponse {
  errorAnalysis: string;
  strategyTip: string;
  evidenceQuote: string;
  motivationalMessage: string;
}

// Send a chat message and get AI response
export async function sendChatMessage(request: ChatRequest): Promise<ChatMessage> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

// Get deeper feedback for a specific question
export async function getDeeperFeedback(
  request: DeeperFeedbackRequest
): Promise<DeeperFeedbackResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback/deeper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting deeper feedback:', error);
    throw error;
  }
}

// Generate a unique session ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

