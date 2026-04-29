from fastapi import APIRouter, Depends, Response
from fastapi.responses import StreamingResponse
from langchain_community.callbacks.manager import get_openai_callback

from app.services.agent_service import AgentService, DeeperFeedbackResponse
from app.models.chat_models import (
    DeeperFeedbackRequest,
    ChatRequest,
    ChatMessage,
    TrainingStartRequest,
    TrainingStartResponse,
)


# Initialize router
router = APIRouter()


# Singleton instance to persist sessions across requests
_agent_service_instance = None

# Dependency function
def get_agent_service():
    global _agent_service_instance
    if _agent_service_instance is None:
        _agent_service_instance = AgentService()
    return _agent_service_instance


# POST endpoint for deeper feedback
@router.post("/feedback/deeper", response_model=DeeperFeedbackResponse)
async def get_deeper_feedback(
    request: DeeperFeedbackRequest,
    service: AgentService = Depends(get_agent_service)
):
    # Get full context for the question
    context = await service.get_full_context_for_question(
        request.question_id,
        request.student_answer
    )
    
    # Generate deeper feedback
    result = await service.generate_deeper_feedback(context)
    
    return result


@router.post("/chat/message", response_model=ChatMessage)
async def post_chat_message(
    request: ChatRequest,
    response: Response,
    service: AgentService = Depends(get_agent_service)
):
    """
    This is the main endpoint for the interactive chat.
    It receives the current conversation history and returns the agent's next message.
    """
    with get_openai_callback() as cb:
        response_message = await service.handle_chat_message(
            session_id=request.session_id,
            messages=request.messages,
            dropped_question_id=request.dropped_question_id
        )
    
    response.headers["X-API-Cost"] = str(cb.total_cost)
    return response_message


@router.post("/chat/stream")
async def post_chat_message_stream(
    request: ChatRequest,
    service: AgentService = Depends(get_agent_service)
):
    """
    Streaming variant of the main chat endpoint.
    Yields text chunks as Alex generates them in real-time.
    """
    async def text_stream():
        async for chunk in service.stream_chat_message(
            session_id=request.session_id,
            messages=request.messages,
            dropped_question_id=request.dropped_question_id
        ):
            # Plain text chunks; frontend concatenates them
            yield chunk

    return StreamingResponse(text_stream(), media_type="text/plain")


@router.post("/training/start", response_model=TrainingStartResponse)
async def start_training(
    request: TrainingStartRequest,
    response: Response,
    service: AgentService = Depends(get_agent_service)
):
    """
    Start a multi-phase training session for a specific reading skill.
    Returns the AI's first message (Phase 1 diagnostic).
    """
    context_payload = {
        "student_id": request.student_id,
        "skill": request.skill,
        "accuracy": request.accuracy,
        "total_attempted": request.total_attempted,
        "correct": request.correct,
        "recent_errors": [e.model_dump() for e in request.recent_errors],
    }
    
    with get_openai_callback() as cb:
        first_message = await service.start_training_session(
            session_id=request.session_id,
            skill=request.skill,
            context_payload=context_payload,
        )
    
    response.headers["X-API-Cost"] = str(cb.total_cost)
    
    return TrainingStartResponse(
        session_id=request.session_id,
        first_message=first_message,
    )
