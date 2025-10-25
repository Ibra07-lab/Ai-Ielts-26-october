/**
 * Integration Example: Using the Python Feedback Agent from Encore Backend
 * 
 * This file shows how to integrate the LangChain feedback agent into your
 * existing Encore TypeScript backend.
 * 
 * File location: backend/ielts/reading.ts (add to existing file)
 */

import { api } from "encore.dev/api";
import axios from "axios";

// ============================================================================
// Configuration
// ============================================================================

const FEEDBACK_SERVICE_URL = process.env.FEEDBACK_SERVICE_URL || "http://localhost:8000";
const FEEDBACK_TIMEOUT = 30000; // 30 seconds

// ============================================================================
// TypeScript Interfaces (matching Python Pydantic models)
// ============================================================================

interface FeedbackRequest {
  passage: string;
  question: string;
  questionType: string;
  correctAnswer: string;
  studentAnswer: string;
}

interface FeedbackResponse {
  is_correct: boolean;
  feedback: string;
  reasoning: string;
  strategy_tip: string;
  passage_reference: string;
  confidence?: string;
}

interface BatchFeedbackRequest {
  feedbacks: FeedbackRequest[];
}

interface BatchFeedbackResponse {
  results: Array<{
    index: number;
    status: "success" | "error";
    feedback?: FeedbackResponse;
    error?: string;
  }>;
  total: number;
  successful: number;
  failed: number;
}

// ============================================================================
// API Endpoint: Single Feedback
// ============================================================================

/**
 * Get AI-powered feedback for a single IELTS Reading answer.
 * 
 * This endpoint calls the Python LangChain feedback service and returns
 * intelligent, educational feedback based on the passage content.
 * 
 * @example
 * const feedback = await backend.ielts.getReadingAIFeedback({
 *   passage: "The Industrial Revolution...",
 *   question: "When did it begin?",
 *   questionType: "Short Answer Questions",
 *   correctAnswer: "late 18th century",
 *   studentAnswer: "late 1700s"
 * });
 */
export const getReadingAIFeedback = api(
  { 
    expose: true, 
    method: "POST", 
    path: "/reading/ai-feedback" 
  },
  async (params: FeedbackRequest): Promise<FeedbackResponse> => {
    try {
      console.log(`[AI Feedback] Requesting feedback for question type: ${params.questionType}`);
      
      // Call Python feedback service
      const response = await axios.post<FeedbackResponse>(
        `${FEEDBACK_SERVICE_URL}/api/feedback`,
        {
          passage: params.passage,
          question: params.question,
          question_type: params.questionType, // Note: snake_case for Python
          correct_answer: params.correctAnswer,
          student_answer: params.studentAnswer,
        },
        {
          timeout: FEEDBACK_TIMEOUT,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`[AI Feedback] Received feedback: is_correct=${response.data.is_correct}`);
      return response.data;
      
    } catch (error: any) {
      console.error("[AI Feedback] Error:", error.message);
      
      // Handle specific error cases
      if (error.code === "ECONNREFUSED") {
        throw new Error(
          "AI Feedback service is not available. Please ensure the Python service is running."
        );
      }
      
      if (error.response?.status === 400) {
        throw new Error(
          `Invalid input: ${error.response.data?.detail || "Please check your request parameters"}`
        );
      }
      
      if (error.code === "ECONNABORTED") {
        throw new Error(
          "AI Feedback service timeout. The request took too long to process."
        );
      }
      
      throw new Error(
        `Failed to generate AI feedback: ${error.message}`
      );
    }
  }
);

// ============================================================================
// API Endpoint: Batch Feedback
// ============================================================================

/**
 * Get AI-powered feedback for multiple IELTS Reading answers.
 * 
 * Useful for processing a complete test (up to 40 questions) at once.
 * 
 * @example
 * const batchResult = await backend.ielts.getReadingAIFeedbackBatch({
 *   feedbacks: [
 *     { passage: "...", question: "...", ... },
 *     { passage: "...", question: "...", ... },
 *   ]
 * });
 */
export const getReadingAIFeedbackBatch = api(
  { 
    expose: true, 
    method: "POST", 
    path: "/reading/ai-feedback/batch" 
  },
  async (params: BatchFeedbackRequest): Promise<BatchFeedbackResponse> => {
    try {
      console.log(`[AI Feedback Batch] Processing ${params.feedbacks.length} questions`);
      
      // Validate batch size
      if (params.feedbacks.length > 40) {
        throw new Error("Maximum batch size is 40 questions");
      }
      
      if (params.feedbacks.length === 0) {
        throw new Error("Batch cannot be empty");
      }
      
      // Convert camelCase to snake_case for Python API
      const pythonPayload = params.feedbacks.map(feedback => ({
        passage: feedback.passage,
        question: feedback.question,
        question_type: feedback.questionType,
        correct_answer: feedback.correctAnswer,
        student_answer: feedback.studentAnswer,
      }));
      
      // Call Python feedback service
      const response = await axios.post<BatchFeedbackResponse>(
        `${FEEDBACK_SERVICE_URL}/api/feedback/batch`,
        pythonPayload,
        {
          timeout: FEEDBACK_TIMEOUT * params.feedbacks.length, // Scale timeout with batch size
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `[AI Feedback Batch] Complete: ${response.data.successful}/${response.data.total} successful`
      );
      
      return response.data;
      
    } catch (error: any) {
      console.error("[AI Feedback Batch] Error:", error.message);
      
      if (error.code === "ECONNREFUSED") {
        throw new Error(
          "AI Feedback service is not available. Please ensure the Python service is running."
        );
      }
      
      throw new Error(
        `Failed to generate batch feedback: ${error.message}`
      );
    }
  }
);

// ============================================================================
// API Endpoint: Health Check
// ============================================================================

/**
 * Check if the AI Feedback service is healthy and responsive.
 * 
 * @example
 * const health = await backend.ielts.checkAIFeedbackHealth();
 * console.log(`Service status: ${health.status}`);
 */
export const checkAIFeedbackHealth = api(
  { 
    expose: true, 
    method: "GET", 
    path: "/reading/ai-feedback/health" 
  },
  async (): Promise<{ status: string; version: string; model: string }> => {
    try {
      const response = await axios.get(
        `${FEEDBACK_SERVICE_URL}/health`,
        { timeout: 5000 }
      );
      
      return response.data;
      
    } catch (error: any) {
      console.error("[AI Feedback Health] Error:", error.message);
      throw new Error("AI Feedback service is not healthy");
    }
  }
);

// ============================================================================
// Helper Function: Enhanced Submit with AI Feedback
// ============================================================================

/**
 * Enhanced version of submitReading that includes AI feedback.
 * 
 * This extends your existing submitReading endpoint to automatically
 * generate AI feedback for each incorrect answer.
 */
export const submitReadingWithAIFeedback = api(
  { expose: true, method: "POST", path: "/reading/submit-with-ai" },
  async (params: {
    testId: number;
    passageId: number;
    answers: Record<number, string>;
  }): Promise<{
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    results: Array<{
      questionId: number;
      isCorrect: boolean;
      correctAnswer: string;
      studentAnswer: string;
      aiFeedback?: FeedbackResponse; // Added AI feedback
    }>;
  }> => {
    // 1. Get passage and questions (use existing logic)
    // const passage = await getPassageById(params.passageId);
    
    // 2. Grade answers (use existing logic)
    const results = []; // Your existing grading logic here
    
    // 3. For each incorrect answer, get AI feedback
    const feedbackPromises = results
      .filter(result => !result.isCorrect)
      .map(async (result) => {
        try {
          const feedback = await getReadingAIFeedback({
            passage: "passage.text", // Use actual passage text
            question: "result.questionText",
            questionType: "result.questionType",
            correctAnswer: result.correctAnswer,
            studentAnswer: result.studentAnswer,
          });
          
          result.aiFeedback = feedback;
        } catch (error) {
          console.error(`Failed to get AI feedback for question ${result.questionId}:`, error);
          // Don't fail the entire submission if AI feedback fails
          result.aiFeedback = undefined;
        }
      });
    
    // Wait for all feedback requests
    await Promise.all(feedbackPromises);
    
    // 4. Return enhanced results
    return {
      score: 0, // Calculate from results
      totalQuestions: results.length,
      correctAnswers: results.filter(r => r.isCorrect).length,
      results,
    };
  }
);

// ============================================================================
// Frontend Integration Example (React/TypeScript)
// ============================================================================

/**
 * Example usage from ReadingPractice.tsx:
 * 
 * ```typescript
 * import backend from './client';
 * 
 * const handleSubmit = async () => {
 *   try {
 *     setLoading(true);
 *     
 *     // Submit with AI feedback
 *     const result = await backend.ielts.submitReadingWithAIFeedback({
 *       testId: selectedTestId,
 *       passageId: activePassageId,
 *       answers: userAnswers
 *     });
 *     
 *     // Display results
 *     setResults(result.results);
 *     
 *     // Show AI feedback for incorrect answers
 *     result.results.forEach(answer => {
 *       if (!answer.isCorrect && answer.aiFeedback) {
 *         console.log('Feedback:', answer.aiFeedback.feedback);
 *         console.log('Strategy:', answer.aiFeedback.strategy_tip);
 *         console.log('Reference:', answer.aiFeedback.passage_reference);
 *       }
 *     });
 *     
 *   } catch (error) {
 *     console.error('Submission failed:', error);
 *   } finally {
 *     setLoading(false);
 *   }
 * };
 * ```
 * 
 * Or use the single feedback endpoint for real-time feedback:
 * 
 * ```typescript
 * const handleAnswerChange = async (questionId: number, answer: string) => {
 *   setAnswers(prev => ({ ...prev, [questionId]: answer }));
 *   
 *   // Optional: Get instant AI feedback
 *   if (answer) {
 *     try {
 *       const feedback = await backend.ielts.getReadingAIFeedback({
 *         passage: passageText,
 *         question: questions[questionId].text,
 *         questionType: questions[questionId].type,
 *         correctAnswer: questions[questionId].correctAnswer,
 *         studentAnswer: answer
 *       });
 *       
 *       // Show feedback in UI
 *       setInstantFeedback(prev => ({
 *         ...prev,
 *         [questionId]: feedback
 *       }));
 *     } catch (error) {
 *       console.error('Failed to get instant feedback:', error);
 *     }
 *   }
 * };
 * ```
 */

// ============================================================================
// Environment Setup
// ============================================================================

/**
 * Add to your .env file:
 * 
 * # AI Feedback Service
 * FEEDBACK_SERVICE_URL=http://localhost:8000
 * 
 * For production, use your deployed service URL:
 * FEEDBACK_SERVICE_URL=https://feedback.yourdomain.com
 */

// ============================================================================
// Package Dependencies
// ============================================================================

/**
 * Add to backend/package.json:
 * 
 * {
 *   "dependencies": {
 *     "axios": "^1.6.7"
 *   }
 * }
 * 
 * Then run: npm install
 */

// ============================================================================
// Starting Both Services
// ============================================================================

/**
 * Update start-app.ps1:
 * 
 * # Start Python Feedback Service
 * Write-Host "Starting AI Feedback Service..." -ForegroundColor Yellow
 * Start-Process powershell -ArgumentList @(
 *     "-NoExit",
 *     "-Command",
 *     "cd backend/agents; if (Test-Path venv/Scripts/Activate.ps1) { .\venv\Scripts\Activate.ps1 }; python main.py"
 * )
 * 
 * Start-Sleep -Seconds 5
 * 
 * # Check feedback service health
 * try {
 *     $health = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get
 *     Write-Host "✅ Feedback service is healthy" -ForegroundColor Green
 * } catch {
 *     Write-Host "⚠️  Warning: Feedback service may not be ready" -ForegroundColor Yellow
 * }
 * 
 * # Continue with Encore backend startup...
 */

