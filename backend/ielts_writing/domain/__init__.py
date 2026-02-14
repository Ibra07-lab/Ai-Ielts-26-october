"""Domain module for IELTS Writing Task 2 rules and criteria."""

from .task2_criteria import (
    TASK_TYPES,
    COMMON_CLICHES,
    TASK_RESPONSE_BAND_DESCRIPTORS,
    OVERUSED_LINKERS,
    ARGUMENT_QUALITY_INDICATORS,
    detect_task_type,
    detect_cliches,
    check_linker_overuse
)

__all__ = [
    "TASK_TYPES",
    "COMMON_CLICHES",
    "TASK_RESPONSE_BAND_DESCRIPTORS",
    "OVERUSED_LINKERS",
    "ARGUMENT_QUALITY_INDICATORS",
    "detect_task_type",
    "detect_cliches",
    "check_linker_overuse"
]
