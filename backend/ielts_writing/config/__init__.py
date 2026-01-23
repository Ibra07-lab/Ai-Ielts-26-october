"""
Configuration module for IELTS Writing API.

Provides validation and management of environment variables and API configurations.
"""

from .validator import (
    validate_all_configs,
    validate_teacher_config,
    validate_examiner_config,
    ConfigurationError,
    get_model_recommendations,
    VALID_OPENROUTER_MODELS,
    VALID_ANTHROPIC_MODELS,
)

__all__ = [
    "validate_all_configs",
    "validate_teacher_config",
    "validate_examiner_config",
    "ConfigurationError",
    "get_model_recommendations",
    "VALID_OPENROUTER_MODELS",
    "VALID_ANTHROPIC_MODELS",
]
