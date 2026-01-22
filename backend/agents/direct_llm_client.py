import os
import json
import logging
import httpx
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

class DirectLLMClient:
    """
    Direct client for interacting with AI models without LangChain.
    Supports Anthropic and OpenAI.
    """
    
    def __init__(self):
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.openrouter_key = os.getenv("ANTHROPIC_API_KEY") # Sometimes mapped to OpenRouter
        
    def _is_openrouter_key(self, api_key: str) -> bool:
        return api_key and (api_key.startswith("sk-or-") or "openrouter" in os.getenv("ANTHROPIC_API_BASE", "").lower())

    def call_anthropic(
        self, 
        model: str, 
        system_prompt: str, 
        user_prompt: str, 
        temperature: float = 0.0,
        max_tokens: int = 1024,
        image_data: Optional[str] = None,
        image_media_type: Optional[str] = None
    ) -> str:
        """Call Anthropic API directly."""
        
        # Check if we should use OpenRouter for Claude
        if self._is_openrouter_key(self.anthropic_key):
            return self.call_openrouter(model, system_prompt, user_prompt, temperature, max_tokens)

        headers = {
            "x-api-key": self.anthropic_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        
        content = []
        if image_data:
            content.append({
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": image_media_type or "image/png",
                    "data": image_data.split(",")[-1] if "," in image_data else image_data
                }
            })
        
        content.append({"type": "text", "text": user_prompt})

        data = {
            "model": model,
            "system": system_prompt,
            "messages": [{"role": "user", "content": content}],
            "max_tokens": max_tokens,
            "temperature": temperature,
        }

        with httpx.Client(timeout=60.0) as client:
            response = client.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)
            response.raise_for_status()
            return response.json()["content"][0]["text"]

    def call_openai(
        self, 
        model: str, 
        system_prompt: str, 
        user_prompt: str, 
        temperature: float = 0.2,
        max_tokens: int = 1000
    ) -> str:
        """Call OpenAI API directly."""
        
        headers = {
            "Authorization": f"Bearer {self.openai_key}",
            "Content-Type": "application/json",
        }

        data = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "max_tokens": max_tokens,
            "temperature": temperature,
        }

        with httpx.Client(timeout=60.0) as client:
            response = client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]

    def call_openrouter(
        self,
        model: str,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 2000
    ) -> str:
        """Call OpenRouter API."""
        
        headers = {
            "Authorization": f"Bearer {self.openrouter_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "IELTS AI"
        }

        data = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "max_tokens": max_tokens,
            "temperature": temperature,
        }

        with httpx.Client(timeout=60.0) as client:
            response = client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
