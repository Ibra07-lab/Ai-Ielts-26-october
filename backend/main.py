"""
FastAPI application for IELTS Reading Feedback Service.

This service provides an API endpoint for generating intelligent feedback
on IELTS Reading answers using LangChain and OpenAI GPT-4 Turbo.
"""

# Load environment variables FIRST, before any other imports
from dotenv import load_dotenv
load_dotenv(override=True)
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".pip")

import os
import logging
from typing import Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import uvicorn

from agents.reading_feedback_agent import (
    ReadingFeedbackAgent,
    FeedbackInput,
    FeedbackOutput,
    create_reading_feedback_agent
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global agent instance
agent: ReadingFeedbackAgent = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI application.
    Handles startup and shutdown events.
    """
    # Startup
    global agent
    
    # Validate configuration FIRST
    logger.info("=" * 60)
    logger.info("🚀 Starting IELTS Writing API...")
    logger.info("=" * 60)
    
    try:
        from ielts_writing.config.validator import validate_all_configs, ConfigurationError
        logger.info("🔍 Validating configuration...")
        config = validate_all_configs()
        logger.info("✅ Configuration validated successfully")
        logger.info(f"   Teacher: {config['teacher']['model']}")
        logger.info(f"   Examiner: {config['examiner']['model']}")
    except ConfigurationError as e:
        logger.error("=" * 60)
        logger.error("❌ CONFIGURATION ERROR")
        logger.error("=" * 60)
        logger.error(str(e))
        logger.error("=" * 60)
        logger.error("⚠️  Backend will start but AI features will not work!")
        logger.error("   Please fix the configuration and restart.")
        logger.error("=" * 60)
        # Don't crash - allow health checks and other endpoints to work
    except Exception as e:
        logger.error(f"⚠️  Configuration validation error: {e}")
    
    # Initialize reading feedback agent (optional)
    try:
        logger.info("Initializing Reading Feedback Agent...")
        agent = create_reading_feedback_agent(
            api_key=os.getenv("OPENAI_API_KEY"),
            model_name=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            temperature=float(os.getenv("TEMPERATURE", "0.2")),
            max_tokens=int(os.getenv("MAX_TOKENS", "1000"))
        )
        logger.info("✅ Reading Feedback Agent initialized")
    except Exception as e:
        logger.warning(f"⚠️  Reading Feedback Agent initialization failed: {str(e)}")
        # Do not crash the app; allow non-AI endpoints to work
        agent = None
    
    logger.info("=" * 60)
    logger.info("✅ Backend startup complete!")
    logger.info("   API URL: http://127.0.0.1:8002")
    logger.info("   API Docs: http://127.0.0.1:8002/docs")
    logger.info("=" * 60)
    
    yield
    
    # Shutdown
    logger.info("Shutting down Reading Feedback Service...")


# Initialize FastAPI app
app = FastAPI(
    title="IELTS Reading Feedback API",
    description="Intelligent feedback system for IELTS Reading practice using LangChain and GPT-4 Turbo",
    version="1.0.0",
    lifespan=lifespan
)

# Rate limiting — protect AI endpoints from abuse
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

from ielts_writing.service import router as writing_router  # DEPRECATED — legacy 2-agent pipeline
from ielts_writing.routes.task1 import router as task1_router
from ielts_writing.routes.task2 import router as task2_router
from ielts_writing.routes.history import router as history_router
from ielts_writing.routes.podcast_summary import router as podcast_summary_router
from ielts_writing.routes.onboarding import router as onboarding_router

# Configure CORS - restrict to known origins
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:4000,http://127.0.0.1:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    expose_headers=["Content-Length"],
)

# Include Routers
app.include_router(writing_router)
app.include_router(task1_router)
app.include_router(task2_router)
app.include_router(history_router)
app.include_router(podcast_summary_router)
app.include_router(onboarding_router)


# Health check models
class HealthResponse(BaseModel):
    """Health check response model."""
    status: str
    version: str
    model: str


class ErrorResponse(BaseModel):
    """Error response model."""
    error: str
    detail: str
    status_code: int


# API Endpoints

@app.get("/health/config")
async def health_check_config():
    """
    Check configuration health for all AI agents.
    Useful for debugging and monitoring.
    """
    from ielts_writing.config.validator import validate_all_configs, ConfigurationError
    
    try:
        config = validate_all_configs()
        return {
            "status": "healthy",
            "services": {
                "teacher": {
                    "status": "configured",
                    "model": config["teacher"]["model"],
                    "api_key_set": config["teacher"]["api_key_set"]
                },
                "examiner": {
                    "status": "configured",
                    "model": config["examiner"]["model"],
                    "api_key_set": config["examiner"]["api_key_set"]
                }
            }
        }
    except ConfigurationError as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "services": {
                "teacher": {"status": "error"},
                "examiner": {"status": "error"}
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }


@app.get("/", response_model=Dict[str, Any])
async def root():
    """Root endpoint with API information."""
    return {
        "service": "IELTS Reading Feedback API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "health": "/health",
            "feedback": "/api/feedback",
            "docs": "/docs"
        }
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint.
    
    Returns service status and configuration.
    """
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        model=str(os.getenv("OPENAI_MODEL", "gpt-4o-mini"))
    )


@app.post(
    "/api/feedback",
    response_model=FeedbackOutput,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid input"},
        429: {"description": "Rate limit exceeded"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    }
)
@limiter.limit("10/minute")
async def generate_feedback(request: Request, feedback_input: FeedbackInput):
    """
    Generate intelligent feedback for an IELTS Reading answer.
    
    This endpoint analyzes a student's answer to an IELTS Reading question
    and provides detailed, educational feedback based solely on the passage content.
    
    **Input:**
    - passage: The reading passage text
    - question: The question text
    - question_type: Type of IELTS question (e.g., "Multiple Choice", "True/False/Not Given")
    - correct_answer: The correct answer
    - student_answer: Student's submitted answer
    
    **Output:**
    - is_correct: Boolean indicating if answer is correct
    - feedback: Detailed explanation of correctness
    - reasoning: Step-by-step analysis based on passage
    - strategy_tip: How to approach similar questions
    - passage_reference: Quote from passage supporting the answer
    - confidence: Agent's confidence level in the assessment
    
    **Example Request:**
    ```json
    {
        "passage": "The Industrial Revolution marked a major turning point...",
        "question": "When did the Industrial Revolution begin?",
        "question_type": "Short Answer Questions",
        "correct_answer": "late 18th century",
        "student_answer": "1780s"
    }
    ```
    """
    try:
        logger.info(f"Received feedback request for question_type={feedback_input.question_type}")
        
        # Validate agent is initialized
        if agent is None:
            logger.error("Agent not initialized")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Feedback agent is not initialized. Please try again later."
            )
        
        # Generate feedback
        result = await agent.generate_feedback(feedback_input)
        
        logger.info("Feedback generated successfully")
        return result
        
    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Input validation failed: {str(e)}"
        )
    
    except Exception as e:
        logger.error(f"Error generating feedback: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred while generating feedback. Please try again later."
        )


@app.post("/api/feedback/batch", response_model=Dict[str, Any])
@limiter.limit("5/minute")
async def generate_feedback_batch(request: Request, feedback_inputs: list[FeedbackInput]):
    """
    Generate feedback for multiple questions in batch.
    
    This endpoint processes multiple feedback requests in a single call,
    useful for analyzing a complete test or passage.
    
    **Input:**
    - Array of FeedbackInput objects
    
    **Output:**
    - results: Array of FeedbackOutput objects
    - total: Total number of questions processed
    - successful: Number of successful feedback generations
    - failed: Number of failed feedback generations
    
    **Note:** Maximum batch size is 40 questions (typical IELTS Reading test size).
    """
    try:
        # Validate batch size
        if len(feedback_inputs) > 40:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Batch size exceeds maximum of 40 questions"
            )
        
        if not feedback_inputs:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Batch cannot be empty"
            )
        
        logger.info(f"Processing batch of {len(feedback_inputs)} questions")
        
        results = []
        failed: int = 0
        
        for idx, feedback_input in enumerate(feedback_inputs):
            try:
                if agent is None:
                    raise Exception("Agent not initialized")
                result = await agent.generate_feedback(feedback_input)
                results.append({
                    "index": idx,
                    "status": "success",
                    "feedback": result.dict()
                })
            except Exception as e:
                logger.error(f"Failed to process question {idx}: {str(e)}")
                results.append({
                    "index": idx,
                    "status": "error",
                    "error": str(e)
                })
                failed = failed + 1
        
        logger.info(f"Batch processing complete: {len(results) - int(failed)} successful, {failed} failed")
        
        return {
            "results": results,
            "total": len(feedback_inputs),
            "successful": len(results) - int(failed),
            "failed": failed
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Batch processing error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Batch processing failed due to an internal error. Please try again later."
        )


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for unhandled errors."""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "detail": "An unexpected error occurred. Please try again later.",
            "status_code": 500
        }
    )


# Development server
if __name__ == "__main__":
    # Validate required environment variables (already loaded at top)
    if not os.getenv("OPENAI_API_KEY"):
        logger.error("OPENAI_API_KEY environment variable not set")
        raise ValueError("OPENAI_API_KEY is required")
    
    # Run server
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    
    logger.info(f"Starting server on {host}:{port}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=os.getenv("RELOAD", "false").lower() == "true",
        log_level=os.getenv("LOG_LEVEL", "info").lower()
    )

