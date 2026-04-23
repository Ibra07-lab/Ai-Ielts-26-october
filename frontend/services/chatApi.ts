import backend from '@/backend';

// Types matching backend Pydantic models
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  userId: string;
  session_id: string;
  messages: ChatMessage[];
  dropped_question_id?: string | null;
}

/**
 * Send a chat message and get AI response through Encore proxy (metered)
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatMessage> {
  console.log('Sending chat message through Encore proxy:', request);
  try {
    const aiMessage = await backend.ielts.proxyReadingChat({
      userId: request.userId,
      session_id: request.session_id,
      messages: request.messages as any[],
      dropped_question_id: request.dropped_question_id,
    });

    return aiMessage as ChatMessage;
  } catch (error: any) {
    console.error('Error sending chat message through Encore:', error);
    throw new Error(error.message || 'Failed to send chat message');
  }
}

// Stream chat messages in real-time
// NOTE: Temporarily falling back to non-streaming via the proxy to ensure credit enforcement.
// We can implement streaming in Encore later if needed.
export async function streamChatMessage(
  request: ChatRequest,
  onChunk: (text: string) => void,
): Promise<void> {
  console.log('Streaming requested, but using metered proxy (non-streaming) for now');
  const aiMessage = await sendChatMessage(request);
  onChunk(aiMessage.content);
}

// Generate a unique session ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}


// ============================================================
// Training Session API
// ============================================================

export interface RecentError {
  question: string;
  correct_answer: string;
  student_answer: string;
  passage_statement?: string;
}

export interface TrainingStartRequest {
  userId: string;
  session_id: string;
  skill: string;
  student_id: string;
  accuracy: number;
  total_attempted: number;
  correct: number;
  recent_errors: RecentError[];
}

export interface TrainingStartResponse {
  session_id: string;
  first_message: string;
}

// Start a multi-phase training session through Encore proxy (metered)
export async function startTrainingSession(
  request: TrainingStartRequest
): Promise<TrainingStartResponse> {
  console.log('Starting training session through Encore proxy:', request);
  try {
    const data = await backend.ielts.proxyTrainingStart({
      userId: request.userId,
      session_id: request.session_id,
      skill: request.skill,
      student_id: request.student_id,
      accuracy: request.accuracy,
      total_attempted: request.total_attempted,
      correct: request.correct,
      recent_errors: request.recent_errors,
    });

    return data as TrainingStartResponse;
  } catch (error: any) {
    console.error('Error starting training session through Encore:', error);
    throw new Error(error.message || 'Failed to start training session');
  }
}
