"""
Configuration Validator for IELTS Writing API

Validates environment variables and API configurations on startup
to prevent runtime errors and provide clear error messages.
"""

import os
import logging
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

# Valid model configurations
VALID_OPENROUTER_MODELS = [
    "openai/gpt-4o",
    "openai/gpt-4o-mini",
    "openai/gpt-4-turbo",
    "openai/gpt-3.5-turbo",
    "anthropic/claude-3-opus",
    "anthropic/claude-3-sonnet",
    "anthropic/claude-3-haiku",
    "anthropic/claude-sonnet-4-5-20250929",
]

VALID_ANTHROPIC_MODELS = [
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
    "claude-sonnet-4-5-20250929",
]

VALID_OPENAI_MODELS = [
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-4-turbo",
    "gpt-3.5-turbo",
]


class ConfigurationError(Exception):
    """Raised when configuration validation fails"""
    pass


def validate_teacher_config() -> Dict[str, any]:
    """
    Validate teacher agent configuration.
    
    Returns:
        dict: Configuration details
        
    Raises:
        ConfigurationError: If configuration is invalid
    """
    model = os.getenv("TEACHER_MODEL", "").strip()
    api_key = os.getenv("OPENROUTER_API_KEY", "").strip()
    
    if not model:
        raise ConfigurationError(
            "TEACHER_MODEL environment variable is not set.\n"
            "Please set it in backend/.env file.\n"
            f"Valid options: {', '.join(VALID_OPENROUTER_MODELS[:3])}..."
        )
    
    if not api_key:
        raise ConfigurationError(
            "OPENROUTER_API_KEY environment variable is not set.\n"
            "Please set it in backend/.env file.\n"
            "Get your key from: https://openrouter.ai/keys"
        )
    
    if model not in VALID_OPENROUTER_MODELS:
        raise ConfigurationError(
            f"Invalid TEACHER_MODEL: '{model}'\n\n"
            f"Valid OpenRouter models:\n" +
            "\n".join(f"  - {m}" for m in VALID_OPENROUTER_MODELS) +
            f"\n\nUpdate TEACHER_MODEL in backend/.env file"
        )
    
    logger.info(f"✅ Teacher configuration valid: {model}")
    return {
        "model": model,
        "api_key_set": True,
        "api_key_length": len(api_key)
    }


def validate_examiner_config() -> Dict[str, any]:
    """
    Validate examiner agent configuration.
    
    Returns:
        dict: Configuration details
        
    Raises:
        ConfigurationError: If configuration is invalid
    """
    model = os.getenv("IELTS_WRITING_MODEL", "").strip()
    api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    
    if not model:
        raise ConfigurationError(
            "IELTS_WRITING_MODEL environment variable is not set.\n"
            "Please set it in backend/.env file.\n"
            f"Valid options: {', '.join(VALID_ANTHROPIC_MODELS[:3])}..."
        )
    
    if not api_key:
        raise ConfigurationError(
            "ANTHROPIC_API_KEY environment variable is not set.\n"
            "Please set it in backend/.env file.\n"
            "Get your key from: https://console.anthropic.com/settings/keys"
        )
    
    if model not in VALID_ANTHROPIC_MODELS:
        raise ConfigurationError(
            f"Invalid IELTS_WRITING_MODEL: '{model}'\n\n"
            f"Valid Anthropic models:\n" +
            "\n".join(f"  - {m}" for m in VALID_ANTHROPIC_MODELS) +
            f"\n\nUpdate IELTS_WRITING_MODEL in backend/.env file"
        )
    
    logger.info(f"✅ Examiner configuration valid: {model}")
    return {
        "model": model,
        "api_key_set": True,
        "api_key_length": len(api_key)
    }


def validate_all_configs() -> Dict[str, Dict[str, any]]:
    """
    Validate all configuration settings.
    
    Returns:
        dict: All configuration details
        
    Raises:
        ConfigurationError: If any configuration is invalid
    """
    results = {}
    
    try:
        results["teacher"] = validate_teacher_config()
    except ConfigurationError as e:
        logger.error(f"❌ Teacher configuration error: {e}")
        raise
    
    try:
        results["examiner"] = validate_examiner_config()
    except ConfigurationError as e:
        logger.error(f"❌ Examiner configuration error: {e}")
        raise
    
    logger.info("✅ All configurations validated successfully")
    return results


def get_model_recommendations() -> str:
    """Get recommended model configurations"""
    return """
    Recommended Model Configurations:
    
    For Teacher (OpenRouter):
    - openai/gpt-4o          → Best quality, moderate cost
    - openai/gpt-4o-mini     → Good quality, low cost (recommended for development)
    - openai/gpt-4-turbo     → High quality, higher cost
    
    For Examiner (Anthropic):
    - claude-sonnet-4-5-20250929  → Latest, best quality (recommended)
    - claude-3-opus-20240229      → High quality, higher cost
    - claude-3-sonnet-20240229    → Balanced quality/cost
    """
