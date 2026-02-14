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

from .task1_prompt import (
    get_task1_examiner_system_prompt,
)

from .task2_examiner_prompt import (
    get_task2_examiner_system_prompt,
    build_task2_examiner_user_prompt,
)

from .task2_explainer_prompt import (
    get_task2_explainer_system_prompt,
    build_task2_explainer_user_prompt,
)

from .task2_coach_prompt import (
    get_task2_coach_system_prompt,
    build_task2_coach_user_prompt,
)

__all__ = [
    # Shared
    "get_shared_examiner_prompt",
    "EXAMINER_BASE_INSTRUCTIONS",
    "COHERENCE_COHESION_DESCRIPTORS",
    "LEXICAL_RESOURCE_DESCRIPTORS",
    "GRAMMATICAL_RANGE_ACCURACY_DESCRIPTORS",
    # Task 1
    "get_task1_examiner_system_prompt",
    # Task 2 - Examiner
    "get_task2_examiner_system_prompt",
    "build_task2_examiner_user_prompt",
    # Task 2 - Explainer
    "get_task2_explainer_system_prompt",
    "build_task2_explainer_user_prompt",
    # Task 2 - Coach
    "get_task2_coach_system_prompt",
    "build_task2_coach_user_prompt",
]

