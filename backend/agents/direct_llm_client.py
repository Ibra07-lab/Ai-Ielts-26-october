import os
import json
import logging
import time
import asyncio
import httpx
from typing import List, Dict, Any, Optional

# Retry configuration
MAX_RETRIES = 3
RETRY_DELAYS = [5, 15, 30]  # seconds between retries (exponential backoff)

logger = logging.getLogger(__name__)

# Claude Sonnet 4.5 pricing (per 1M tokens)
CLAUDE_SONNET_INPUT_PRICE = 3.00  # $3.00 per 1M input tokens
CLAUDE_SONNET_OUTPUT_PRICE = 15.00  # $15.00 per 1M output tokens

# GPT-4o pricing (per 1M tokens)
GPT4O_INPUT_PRICE = 2.50  # $2.50 per 1M input tokens
GPT4O_OUTPUT_PRICE = 10.00  # $10.00 per 1M output tokens

# GPT-4.1 pricing via OpenRouter (per 1M tokens) - from screenshot
GPT41_INPUT_PRICE = 2.00  # $2.00 per 1M input tokens
GPT41_OUTPUT_PRICE = 8.00  # $8.00 per 1M output tokens

# Claude prompt caching pricing (90% discount on cached input tokens)
CLAUDE_CACHED_INPUT_PRICE = 0.30  # $0.30 per 1M cached input tokens (90% off)
CLAUDE_CACHE_WRITE_PRICE = 3.75  # $3.75 per 1M tokens to write to cache (25% premium)

# Feature toggle for prompt caching
ENABLE_PROMPT_CACHING = os.getenv("ENABLE_PROMPT_CACHING", "true").lower() == "true"

class DirectLLMClient:
    """
    Direct client for interacting with AI models without LangChain.
    Supports Anthropic and OpenAI.
    """
    
    def __init__(self):
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.openrouter_key = os.getenv("OPENROUTER_API_KEY")  # Dedicated OpenRouter key
        
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
        image_media_type: Optional[str] = None,
        enable_caching: bool = None,  # None = use global toggle
        timeout: float = 120.0  # Per-call timeout in seconds
    ) -> str:
        """Call Anthropic API directly with optional prompt caching.
        
        Args:
            enable_caching: Enable prompt caching for system prompt.
                           If None, uses ENABLE_PROMPT_CACHING env var.
        """
        print(f"[DEBUG] call_anthropic called with model={model}", flush=True)  # DEBUG LINE
        
        # Check if we should use OpenRouter for Claude
        if self._is_openrouter_key(self.anthropic_key):
            return self.call_openrouter(model, system_prompt, user_prompt, temperature, max_tokens)

        # Determine if caching should be enabled
        use_caching = enable_caching if enable_caching is not None else ENABLE_PROMPT_CACHING

        headers = {
            "x-api-key": self.anthropic_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        
        # Add beta header for prompt caching
        if use_caching:
            headers["anthropic-beta"] = "prompt-caching-2024-07-31"
        
        # Simplify content structure if possible
        if image_data:
            content = [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": image_media_type or "image/png",
                        "data": image_data.split(",")[-1] if "," in image_data else image_data
                    }
                },
                {"type": "text", "text": user_prompt}
            ]
            final_messages = [{"role": "user", "content": content}]
        else:
            # Use simple string content for text-only requests (more robust)
            final_messages = [{"role": "user", "content": user_prompt}]

        # Build system prompt - always use list format for consistency
        system_content = [
            {
                "type": "text",
                "text": system_prompt
            }
        ]
        
        # Add cache_control if caching is enabled
        if use_caching:
            system_content[0]["cache_control"] = {"type": "ephemeral"}

        # Only send image data if present
        messages = []
        if image_data:
             messages.append({
                "role": "user", 
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image_media_type or "image/png",
                            "data": image_data.split(",")[-1] if "," in image_data else image_data
                        }
                    },
                    {"type": "text", "text": user_prompt}
                ]
            })
        else:
            messages.append({"role": "user", "content": user_prompt})

        data = {
            "model": model,
            "system": system_content,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }

        last_exception = None
        for attempt in range(MAX_RETRIES):
            try:
                with httpx.Client(timeout=timeout) as client:
                    response = client.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)
                    if response.status_code >= 500:
                        raise httpx.HTTPStatusError(
                            f"Server error {response.status_code}", 
                            request=response.request, 
                            response=response
                        )
                    if response.status_code >= 400:
                        logger.error(f"Anthropic API Error: {response.text}")
                    response.raise_for_status()
                    response_json = response.json()
                    
                    # Log token usage and cost (with caching breakdown)
                    usage = response_json.get("usage", {})
                    input_tokens = usage.get("input_tokens", 0)
                    output_tokens = usage.get("output_tokens", 0)
                    cache_read_tokens = usage.get("cache_read_input_tokens", 0)
                    cache_creation_tokens = usage.get("cache_creation_input_tokens", 0)
                    
                    # Calculate cost with caching discounts
                    uncached_input = input_tokens - cache_read_tokens
                    input_cost = (uncached_input / 1_000_000 * CLAUDE_SONNET_INPUT_PRICE)
                    cached_cost = (cache_read_tokens / 1_000_000 * CLAUDE_CACHED_INPUT_PRICE)
                    cache_write_cost = (cache_creation_tokens / 1_000_000 * CLAUDE_CACHE_WRITE_PRICE)
                    output_cost = (output_tokens / 1_000_000 * CLAUDE_SONNET_OUTPUT_PRICE)
                    total_cost = input_cost + cached_cost + cache_write_cost + output_cost
                    
                    # Calculate savings from caching
                    cost_without_cache = (input_tokens / 1_000_000 * CLAUDE_SONNET_INPUT_PRICE) + output_cost
                    savings = cost_without_cache - total_cost if cache_read_tokens > 0 else 0
                    
                    if cache_read_tokens > 0 or cache_creation_tokens > 0:
                        log_msg = (f"[TOKEN_USAGE] Anthropic | Model: {model} | Input: {input_tokens} | Output: {output_tokens} | "
                                   f"Cache Read: {cache_read_tokens} | Cache Write: {cache_creation_tokens} | "
                                   f"Cost: ${total_cost:.4f} | Saved: ${savings:.4f}")
                        logger.info(log_msg)
                        print(log_msg, flush=True)
                    else:
                        log_msg = f"[TOKEN_USAGE] Anthropic | Model: {model} | Input: {input_tokens} | Output: {output_tokens} | Cost: ${total_cost:.4f}"
                        logger.info(log_msg)
                        print(log_msg, flush=True)
                    
                    return response_json["content"][0]["text"]
                    
            except (httpx.ReadTimeout, httpx.ConnectTimeout, httpx.HTTPStatusError) as e:
                last_exception = e
                delay = RETRY_DELAYS[min(attempt, len(RETRY_DELAYS) - 1)]
                logger.warning(f"[RETRY] Anthropic call failed (attempt {attempt + 1}/{MAX_RETRIES}): {type(e).__name__}. Retrying in {delay}s...")
                print(f"[RETRY] Attempt {attempt + 1}/{MAX_RETRIES} failed: {type(e).__name__}. Retrying in {delay}s...", flush=True)
                if attempt < MAX_RETRIES - 1:
                    time.sleep(delay)
        
        # All retries exhausted
        logger.error(f"[RETRY EXHAUSTED] Anthropic call failed after {MAX_RETRIES} attempts")
        raise last_exception

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

        with httpx.Client(timeout=120.0) as client:
            response = client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data)
            response.raise_for_status()
            response_json = response.json()
            
            # Log token usage and cost
            usage = response_json.get("usage", {})
            input_tokens = usage.get("prompt_tokens", 0)
            output_tokens = usage.get("completion_tokens", 0)
            cost = (input_tokens / 1_000_000 * GPT4O_INPUT_PRICE) + (output_tokens / 1_000_000 * GPT4O_OUTPUT_PRICE)
            logger.info(f"[TOKEN_USAGE] OpenAI | Model: {model} | Input: {input_tokens} | Output: {output_tokens} | Cost: ${cost:.4f}")
            
            return response_json["choices"][0]["message"]["content"]

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

        with httpx.Client(timeout=120.0) as client:
            response = client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]

    # ============== ASYNC METHODS FOR PARALLEL EXECUTION ==============
    
    async def call_anthropic_async(
        self, 
        model: str, 
        system_prompt: str, 
        user_prompt: str, 
        temperature: float = 0.0,
        max_tokens: int = 1024,
        image_data: Optional[str] = None,
        image_media_type: Optional[str] = None,
        enable_caching: bool = None,  # None = use global toggle
        timeout: float = 120.0  # Per-call timeout in seconds
    ) -> str:
        """Async version of call_anthropic for parallel execution with prompt caching.
        
        Args:
            enable_caching: Enable prompt caching for system prompt.
                           If None, uses ENABLE_PROMPT_CACHING env var.
        """
        
        # Check if we should use OpenRouter for Claude
        if self._is_openrouter_key(self.anthropic_key):
            return await self.call_openrouter_async(model, system_prompt, user_prompt, temperature, max_tokens)

        # Validate API key
        if not self.anthropic_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable is not set")

        # Determine if caching should be enabled
        use_caching = enable_caching if enable_caching is not None else ENABLE_PROMPT_CACHING

        headers = {
            "x-api-key": self.anthropic_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        
        # Add beta header for prompt caching
        if use_caching:
            headers["anthropic-beta"] = "prompt-caching-2024-07-31"
        
        if image_data:
            content = [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": image_media_type or "image/png",
                        "data": image_data.split(",")[-1] if "," in image_data else image_data
                    }
                },
                {"type": "text", "text": user_prompt}
            ]
            final_messages = [{"role": "user", "content": content}]
        else:
            final_messages = [{"role": "user", "content": user_prompt}]

        # Build system prompt - use cache_control format when caching is enabled
        if use_caching:
            system_content = [
                {
                    "type": "text",
                    "text": system_prompt,
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        else:
            system_content = system_prompt

        data = {
            "model": model,
            "system": system_content,
            "messages": final_messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }

        last_exception = None
        for attempt in range(MAX_RETRIES):
            try:
                async with httpx.AsyncClient(timeout=timeout) as client:
                    response = await client.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)
                    if response.status_code >= 500:
                        raise httpx.HTTPStatusError(
                            f"Server error {response.status_code}",
                            request=response.request,
                            response=response
                        )
                    if response.status_code >= 400:
                        logger.error(f"Anthropic API Error: {response.text}")
                    response.raise_for_status()
                    response_json = response.json()
                    
                    # Log token usage and cost (with caching breakdown)
                    usage = response_json.get("usage", {})
                    input_tokens = usage.get("input_tokens", 0)
                    output_tokens = usage.get("output_tokens", 0)
                    cache_read_tokens = usage.get("cache_read_input_tokens", 0)
                    cache_creation_tokens = usage.get("cache_creation_input_tokens", 0)
                    
                    # Calculate cost with caching discounts
                    uncached_input = input_tokens - cache_read_tokens
                    input_cost = (uncached_input / 1_000_000 * CLAUDE_SONNET_INPUT_PRICE)
                    cached_cost = (cache_read_tokens / 1_000_000 * CLAUDE_CACHED_INPUT_PRICE)
                    cache_write_cost = (cache_creation_tokens / 1_000_000 * CLAUDE_CACHE_WRITE_PRICE)
                    output_cost = (output_tokens / 1_000_000 * CLAUDE_SONNET_OUTPUT_PRICE)
                    total_cost = input_cost + cached_cost + cache_write_cost + output_cost
                    
                    # Calculate savings from caching
                    cost_without_cache = (input_tokens / 1_000_000 * CLAUDE_SONNET_INPUT_PRICE) + output_cost
                    savings = cost_without_cache - total_cost if cache_read_tokens > 0 else 0
                    
                    if cache_read_tokens > 0 or cache_creation_tokens > 0:
                        logger.info(f"[TOKEN_USAGE] Anthropic Async | Model: {model} | Input: {input_tokens} | Output: {output_tokens} | "
                                   f"Cache Read: {cache_read_tokens} | Cache Write: {cache_creation_tokens} | "
                                   f"Cost: ${total_cost:.4f} | Saved: ${savings:.4f}")
                    else:
                        logger.info(f"[TOKEN_USAGE] Anthropic Async | Model: {model} | Input: {input_tokens} | Output: {output_tokens} | Cost: ${total_cost:.4f}")
                    
                    return response_json["content"][0]["text"]
                    
            except (httpx.ReadTimeout, httpx.ConnectTimeout, httpx.HTTPStatusError) as e:
                last_exception = e
                delay = RETRY_DELAYS[min(attempt, len(RETRY_DELAYS) - 1)]
                logger.warning(f"[RETRY] Anthropic Async call failed (attempt {attempt + 1}/{MAX_RETRIES}): {type(e).__name__}. Retrying in {delay}s...")
                print(f"[RETRY] Async attempt {attempt + 1}/{MAX_RETRIES} failed: {type(e).__name__}. Retrying in {delay}s...", flush=True)
                if attempt < MAX_RETRIES - 1:
                    await asyncio.sleep(delay)
        
        # All retries exhausted
        logger.error(f"[RETRY EXHAUSTED] Anthropic Async call failed after {MAX_RETRIES} attempts")
        raise last_exception

    async def call_openai_async(
        self, 
        model: str, 
        system_prompt: str, 
        user_prompt: str, 
        temperature: float = 0.2,
        max_tokens: int = 1000
    ) -> str:
        """Async version of call_openai for parallel execution."""
        
        # Validate API key
        if not self.openai_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")

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

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data)
            response.raise_for_status()
            response_json = response.json()
            
            # Log token usage and cost
            usage = response_json.get("usage", {})
            input_tokens = usage.get("prompt_tokens", 0)
            output_tokens = usage.get("completion_tokens", 0)
            cost = (input_tokens / 1_000_000 * GPT4O_INPUT_PRICE) + (output_tokens / 1_000_000 * GPT4O_OUTPUT_PRICE)
            logger.info(f"[TOKEN_USAGE] OpenAI Async | Model: {model} | Input: {input_tokens} | Output: {output_tokens} | Cost: ${cost:.4f}")
            
            return response_json["choices"][0]["message"]["content"]


    async def call_openrouter_async(
        self,
        model: str,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 2000
    ) -> str:
        """Async version of call_openrouter for parallel execution."""
        
        # Validate API key
        if not self.openrouter_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is not set")

        headers = {
            "Authorization": f"Bearer {self.openrouter_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": os.getenv("OPENROUTER_SITE_URL", "http://localhost:5173"),
            "X-Title": os.getenv("OPENROUTER_APP_NAME", "IELTS AI")
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

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
            if response.status_code >= 400:
                logger.error(f"OpenRouter API Error: {response.text}")
            response.raise_for_status()
            response_json = response.json()
            
            # Log token usage and cost (using GPT-4.1 pricing for OpenRouter)
            usage = response_json.get("usage", {})
            input_tokens = usage.get("prompt_tokens", 0)
            output_tokens = usage.get("completion_tokens", 0)
            cost = (input_tokens / 1_000_000 * GPT41_INPUT_PRICE) + (output_tokens / 1_000_000 * GPT41_OUTPUT_PRICE)
            logger.info(f"[TOKEN_USAGE] OpenRouter Async | Model: {model} | Input: {input_tokens} | Output: {output_tokens} | Cost: ${cost:.4f}")
            
            return response_json["choices"][0]["message"]["content"]


