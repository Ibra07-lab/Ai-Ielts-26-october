"""Agent-local prompt helpers for IELTS writing.

These wrap or re-export the core prompts in ``backend.ielts_writing.prompts``
so that agent code can depend on a stable interface even if the underlying
prompt wording evolves.
"""

from .shared_descriptors import (
    get_shared_examiner_prompt,
    EXAMINER_BASE_INSTRUCTIONS,
    COHERENCE_COHESION_DESCRIPTORS,
    LEXICAL_RESOURCE_DESCRIPTORS,
    GRAMMATICAL_RANGE_ACCURACY_DESCRIPTORS,
)

__all__ = [
    "get_shared_examiner_prompt",
    "EXAMINER_BASE_INSTRUCTIONS",
    "COHERENCE_COHESION_DESCRIPTORS",
    "LEXICAL_RESOURCE_DESCRIPTORS",
    "GRAMMATICAL_RANGE_ACCURACY_DESCRIPTORS",
]

