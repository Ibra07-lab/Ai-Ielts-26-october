import os
from pathlib import Path
from dotenv import load_dotenv
from agents.direct_llm_client import DirectLLMClient

# Load .env file from backend/ielts_writing directory
backend_dir = Path(__file__).resolve().parent.parent  # Go up from agents/llm_factory.py to backend/ielts_writing/
load_dotenv(dotenv_path=backend_dir / ".env", override=True)

def get_chat_model(model_name: str = "gpt-4o", temperature: float = 0.0, max_tokens: int = 1024):
    """
    Factory to get the appropriate Chat Model based on the model name.
    Now returns a wrapper that uses DirectLLMClient.
    """
    client = DirectLLMClient()
    
    class ModelWrapper:
        def __init__(self, model_name, temperature, max_tokens):
            self.model = model_name
            self.temperature = temperature
            self.max_tokens = max_tokens
            
        def invoke(self, messages):
            # messages is usually a list of strings or tuples for direct client
            # But here we might get LangChain like objects if some parts still use it
            # We'll handle basic list of dicts or strings
            system = ""
            user = ""
            for msg in messages:
                if isinstance(msg, dict):
                    if msg.get("role") == "system": system = msg.get("content")
                    else: user = msg.get("content")
                elif hasattr(msg, "content"):
                    if "System" in type(msg).__name__: system = msg.content
                    else: user = msg.content
            
            if "claude" in self.model.lower():
                return client.call_anthropic(self.model, system, user, self.temperature, self.max_tokens)
            else:
                return client.call_openai(self.model, system, user, self.temperature, self.max_tokens)

    return ModelWrapper(model_name, temperature, max_tokens)
