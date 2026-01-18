import os
from pathlib import Path

# Load .env file from backend directory
from dotenv import load_dotenv
backend_dir = Path(__file__).resolve().parent.parent.parent  # Go up from agents/llm_factory.py to backend/
load_dotenv(dotenv_path=backend_dir / ".env", override=True)

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

def _is_openrouter_key(api_key: str) -> bool:
    """Check if an API key is an OpenRouter key."""
    if not api_key:
        return False
    # OpenRouter keys typically start with "sk-or-v1-" or "sk-or-"
    return api_key.startswith("sk-or-") or api_key.startswith("sk-or-v1-")


def get_chat_model(model_name: str = "gpt-4o", temperature: float = 0.0, max_tokens: int = 1024) -> BaseChatModel:
    """
    Factory to get the appropriate Chat Model based on the model name.
    Supports OpenAI (gpt-*), Anthropic (claude-*), and OpenRouter (for Claude models).
    
    If ANTHROPIC_API_KEY is detected as an OpenRouter key, routes Claude models
    through OpenRouter gateway instead of direct Anthropic API.
    """
    
    # Check if we should use Anthropic or OpenRouter for Claude models
    if model_name.lower().startswith("claude"):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable is not set but a Claude model was requested.")
        
        # Check if the key is actually an OpenRouter key
        if _is_openrouter_key(api_key):
            # Route through OpenRouter using ChatOpenAI with OpenRouter base URL
            return ChatOpenAI(
                model=model_name,
                temperature=temperature,
                max_tokens=max_tokens,
                api_key=api_key,
                base_url="https://openrouter.ai/api/v1"
            )
        
        # Use direct Anthropic API
        if not ANTHROPIC_AVAILABLE:
            raise ImportError("langchain_anthropic is not installed. Install it with: pip install langchain-anthropic")
            
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
