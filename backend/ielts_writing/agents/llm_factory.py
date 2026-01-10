import os
from langchain_openai import ChatOpenAI
try:
    from langchain_anthropic import ChatAnthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False
    ChatAnthropic = None
    
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import BaseMessage, SystemMessage, HumanMessage

def add_cache_tag(message: BaseMessage) -> BaseMessage:
    """
    Injects Anthropic prompt caching tags into a message's content.
    Only applies if content is a list (multimodal format), which is how 
    caching is specified in LangChain-Anthropic.
    """
    if not isinstance(message.content, list):
        # Convert string content to list format required for caching
        text = message.content
        message.content = [
            {
                "type": "text",
                "text": text,
                "cache_control": {"type": "ephemeral"}
            }
        ]
    else:
        # If already a list, find the last text block and add cache control
        for item in reversed(message.content):
            if isinstance(item, dict) and item.get("type") == "text":
                item["cache_control"] = {"type": "ephemeral"}
                break
    return message

def get_chat_model(model_name: str = "gpt-4o", temperature: float = 0.0, max_tokens: int = 1024) -> BaseChatModel:
    """
    Factory to get the appropriate Chat Model based on the model name.
    Supports OpenAI (gpt-*) and Anthropic (claude-*).
    """
    
    # Check if we should use Anthropic
    if model_name.lower().startswith("claude"):
        if not ANTHROPIC_AVAILABLE:
            raise ImportError("langchain_anthropic is not installed. Install it with: pip install langchain-anthropic")
            
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable is not set but a Claude model was requested.")
            
        return ChatAnthropic(
            model=model_name,
            temperature=temperature,
            max_tokens=max_tokens,
            api_key=api_key
        )
        
    # Default to OpenAI
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        # Fallback check - maybe they want to use OpenAI but haven't set key, 
        # or maybe they set ANTHROPIC_API_KEY and want to use that by default if model name isn't specific.
        # But for now, let's assume default is OpenAI.
        pass
        
    return ChatOpenAI(
        model=model_name,
        temperature=temperature,
        max_tokens=max_tokens,
        api_key=api_key
    )
