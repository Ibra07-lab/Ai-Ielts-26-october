from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.services.agent_service import AgentService, DeeperFeedbackResponse
from app.models.chat_models import DeeperFeedbackRequest, ChatRequest, ChatMessage


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
    service: AgentService = Depends(get_agent_service)
):
    """
    This is the main endpoint for the interactive chat.
    It receives the current conversation history and returns the agent's next message.
    """
    response_message = await service.handle_chat_message(
        session_id=request.session_id,
        messages=request.messages,
        dropped_question_id=request.dropped_question_id
    )
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

