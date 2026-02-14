"""
IELTS Task 2 Criteria and Rules Knowledge Base.

This module contains the "examiner knowledge" - hardcoded IELTS rules,
band descriptors, cliche detection, and evaluation criteria.

Keeping this separate from prompts allows:
1. Easy updates to rules without changing prompt structure
2. Reusable detection functions for automated checks
3. Clean separation between data and logic
"""

from typing import Dict, List, Tuple, Optional
import re


# ============================================================
# TASK TYPES - 5 Standard Task 2 Question Types
# ============================================================

TASK_TYPES: Dict[str, Dict] = {
    "opinion": {
        "name": "Opinion Essay",
        "description": "State and defend your personal position on an issue",
        "keywords": [
            "to what extent do you agree or disagree",
            "do you agree or disagree",
            "what is your opinion",
            "what do you think",
            "is this a positive or negative development",
            "do you think this is a positive or negative trend"
        ],
        "structure_required": [
            "Clear position in introduction",
            "Maintain position throughout",
            "Do not sit on the fence (unless partially agree)"
        ],
        "common_errors": [
            "Changing position mid-essay",
            "No clear thesis statement",
            "Presenting both sides equally without taking a stance"
        ],
        "penalties": {
            "no_position": 1.0,
            "position_changes": 0.5,
            "fence_sitting": 0.5
        }
    },
    
    "discussion": {
        "name": "Discussion Essay",
        "description": "Present both sides of a debate, then give your opinion",
        "keywords": [
            "discuss both views and give your opinion",
            "discuss both sides",
            "some people think.*others believe",
            "some people argue.*while others",
            "there are two opposing views"
        ],
        "structure_required": [
            "Present BOTH sides fairly",
            "Give own opinion (can be in introduction or conclusion)",
            "Don't be one-sided"
        ],
        "common_errors": [
            "Only discussing one side",
            "Forgetting to give own opinion",
            "Unbalanced treatment of views"
        ],
        "penalties": {
            "one_sided": 1.0,
            "no_opinion": 0.5,
            "unbalanced": 0.5
        }
    },
    
    "advantages_disadvantages": {
        "name": "Advantages & Disadvantages Essay",
        "description": "Analyze pros and cons of a situation",
        "keywords": [
            "what are the advantages and disadvantages",
            "discuss the advantages and disadvantages",
            "outweigh",
            "do the advantages outweigh the disadvantages",
            "benefits and drawbacks"
        ],
        "structure_required": [
            "Discuss BOTH advantages and disadvantages",
            "If 'outweigh' in question, give clear opinion",
            "Balance both sides unless asked to evaluate"
        ],
        "common_errors": [
            "Only discussing advantages OR disadvantages",
            "Not answering 'outweigh' part",
            "Superficial points without development"
        ],
        "penalties": {
            "missing_side": 1.5,
            "no_evaluation_when_asked": 1.0
        }
    },
    
    "problem_solution": {
        "name": "Problem & Solution Essay",
        "description": "Identify problems and propose solutions",
        "keywords": [
            "what are the problems and solutions",
            "what problems does this cause",
            "how can these problems be solved",
            "what problems.*what solutions",
            "causes and solutions"
        ],
        "structure_required": [
            "Address BOTH problems AND solutions",
            "Problems and solutions should be related",
            "Practical, realistic solutions"
        ],
        "common_errors": [
            "Only discussing problems OR solutions",
            "Solutions don't address the problems mentioned",
            "Vague or impractical solutions"
        ],
        "penalties": {
            "missing_problems": 1.5,
            "missing_solutions": 1.5,
            "unrelated_solutions": 0.5
        }
    },
    
    "two_part": {
        "name": "Two-Part Question",
        "description": "Answer two distinct questions about a topic",
        "keywords": [
            "why.*and what",
            "what.*and how",
            "do you think.*why",
            "two questions about the same topic",
            # Usually has "?" twice or two clear questions
        ],
        "structure_required": [
            "Answer BOTH questions explicitly",
            "Dedicate clear sections to each question",
            "Don't ignore either part"
        ],
        "common_errors": [
            "Only answering one question",
            "Mixing the two questions without clear structure",
            "Unequal treatment of questions"
        ],
        "penalties": {
            "missing_part": 1.5,
            "unbalanced": 0.5
        }
    }
}


# ============================================================
# COMMON CLICHES - Memorized Phrases to Detect and Flag
# ============================================================

COMMON_CLICHES: List[str] = [
    # Classic overused phrases
    "every coin has two sides",
    "double-edged sword",
    "part and parcel",
    "in today's modern world",
    "in this day and age",
    "since time immemorial",
    "since the dawn of time",
    "it is a well-known fact",
    "it goes without saying",
    "needless to say",
    
    # Template introductions
    "the topic of .* is a controversial one",
    "this essay will discuss",
    "this essay will examine",
    "in the following paragraphs",
    "there are two sides to every argument",
    
    # Overused transitions
    "firstly, secondly, thirdly, finally",
    "first and foremost",
    "last but not least",
    "to begin with",
    "in conclusion, to sum up",
    
    # Generic statements
    "everything has its pros and cons",
    "nothing is perfect",
    "rome was not built in a day",
    "where there's a will there's a way",
    "money can't buy happiness",
    
    # Vague fillers
    "the root cause of",
    "play a vital role",
    "plays an important role",
    "is of great importance",
    "cannot be ignored",
    "is worth mentioning",
    
    # Dramatic openings
    "nowadays",  # Only flag if it's the very first word repeatedly
    "in recent years",
    "throughout history",
    "since the beginning of time",
    
    # Weak conclusions
    "in a nutshell",
    "to cut a long story short",
    "all in all",
    "at the end of the day",
    "when all is said and done",
    
    # Regional/test-prep cliches
    "the given topic",
    "the above-mentioned points",
    "summing up the above discussion",
    "based on the above analysis"
]


# ============================================================
# TASK RESPONSE BAND DESCRIPTORS (Task 2 Specific)
# ============================================================

TASK_RESPONSE_BAND_DESCRIPTORS: Dict[int, str] = {
    9: (
        "Fully addresses all parts of the task. "
        "Presents a fully developed position in answer to the question "
        "with relevant, fully extended and well supported ideas."
    ),
    8: (
        "Sufficiently addresses all parts of the task. "
        "Presents a well-developed response to the question "
        "with relevant, extended and supported ideas."
    ),
    7: (
        "Addresses all parts of the task. "
        "Presents a clear position throughout the response. "
        "Presents, extends and supports main ideas, but there may be "
        "a tendency to over-generalise and/or supporting ideas may lack focus."
    ),
    6: (
        "Addresses all parts of the task although some parts "
        "may be more fully covered than others. "
        "Presents a relevant position although the conclusions may become "
        "unclear or repetitive. Presents relevant main ideas but some may be "
        "inadequately developed/unclear."
    ),
    5: (
        "Addresses the task only partially; the format may be inappropriate in places. "
        "Expresses a position but the development is not always clear and there may "
        "be no conclusions drawn. Presents some main ideas but these are limited "
        "and not sufficiently developed; there may be irrelevant detail."
    ),
    4: (
        "Responds to the task only in a minimal way or the answer is tangential; "
        "the format may be inappropriate. Presents a position but this is unclear. "
        "Presents some main ideas but these are difficult to identify and may be "
        "repetitive, irrelevant or not well supported."
    ),
    3: (
        "Does not adequately address any part of the task. "
        "Does not express a clear position. Presents few ideas, which are largely "
        "undeveloped or irrelevant."
    ),
    2: (
        "Barely responds to the task. "
        "Does not express a position. May attempt to present one or two ideas "
        "but there is no development."
    ),
    1: (
        "Answer is completely unrelated to the task. "
        "Any copied rubric must be discounted."
    ),
    0: (
        "Does not attend. Does not attempt the task in any way. "
        "Writes a totally memorised response."
    )
}


# ============================================================
# OVERUSED LINKERS - Mechanical Transition Detection
# ============================================================

OVERUSED_LINKERS: Dict[str, any] = {
    "mechanical_patterns": [
        # These exact sequences suggest template use
        ["firstly", "secondly", "thirdly"],
        ["firstly", "secondly", "finally"],
        ["first of all", "secondly", "lastly"],
        ["to begin with", "moving on", "finally"],
        ["in the first place", "in the second place", "in the third place"],
    ],
    
    "repetition_threshold": 3,  # Same linker 3+ times = mechanical
    
    "common_linkers": [
        # Track frequency of these
        "firstly", "secondly", "thirdly", "finally", "lastly",
        "furthermore", "moreover", "however", "therefore", "thus",
        "in addition", "on the other hand", "in contrast",
        "for example", "for instance", "such as"
    ],
    
    "penalty_rules": {
        "mechanical_sequence": 0.5,  # Using exact firstly/secondly/thirdly pattern
        "same_linker_3x": 0.5,       # Same linker 3+ times
        "every_sentence_starts": 0.5  # Every sentence starts with a linker
    }
}


# ============================================================
# ARGUMENT QUALITY INDICATORS
# ============================================================

ARGUMENT_QUALITY_INDICATORS: Dict[str, Dict] = {
    "strong_argument_markers": [
        # Evidence of developed ideas
        "for example",
        "for instance",
        "such as",
        "this means that",
        "as a result",
        "consequently",
        "this leads to",
        "research shows",
        "studies indicate",
        "according to"
    ],
    
    "weak_argument_markers": [
        # Signs of undeveloped ideas
        "i think",
        "in my opinion",  # Without supporting evidence
        "many people",
        "some people say",
        "it is obvious",
        "everyone knows",
        "it is clear that"  # Without proving it
    ],
    
    "thesis_indicators": [
        # Phrases that typically introduce a thesis
        "i believe that",
        "i strongly believe",
        "in my view",
        "this essay argues that",
        "i am convinced that",
        "i firmly believe",
        "my position is that"
    ],
    
    "counter_argument_markers": [
        # Shows they addressed opposing views
        "although some argue",
        "while it is true that",
        "critics may say",
        "opponents argue",
        "on the other hand",
        "despite this",
        "however, others believe",
        "admittedly"
    ]
}


# ============================================================
# DETECTION FUNCTIONS
# ============================================================

def detect_task_type(question: str) -> str:
    """
    Detect the Task 2 question type from the question text.
    
    Args:
        question: The essay question/prompt
        
    Returns:
        Task type key: 'opinion', 'discussion', 'advantages_disadvantages', 
                       'problem_solution', 'two_part', or 'unknown'
    """
    question_lower = question.lower()
    
    # Check each task type's keywords
    for task_type, config in TASK_TYPES.items():
        for keyword in config["keywords"]:
            # Handle regex patterns
            if ".*" in keyword:
                if re.search(keyword, question_lower):
                    return task_type
            else:
                if keyword in question_lower:
                    return task_type
    
    # Additional two-part detection: check for multiple question marks
    if question.count("?") >= 2:
        return "two_part"
    
    return "unknown"


def detect_cliches(essay: str) -> List[str]:
    """
    Detect common cliches and memorized phrases in the essay.
    
    Args:
        essay: The student's essay text
        
    Returns:
        List of detected cliches
    """
    essay_lower = essay.lower()
    detected = []
    
    for cliche in COMMON_CLICHES:
        # Handle regex patterns
        if ".*" in cliche:
            if re.search(cliche, essay_lower):
                detected.append(cliche)
        else:
            if cliche in essay_lower:
                detected.append(cliche)
    
    return detected


def check_linker_overuse(essay: str) -> Tuple[bool, List[str], float]:
    """
    Check for mechanical/overused linkers in the essay.
    
    Args:
        essay: The student's essay text
        
    Returns:
        Tuple of (is_overused, details, penalty)
    """
    essay_lower = essay.lower()
    details = []
    penalty = 0.0
    is_overused = False
    
    # Check for mechanical patterns
    for pattern in OVERUSED_LINKERS["mechanical_patterns"]:
        if all(word in essay_lower for word in pattern):
            # Check if they appear in order
            positions = [essay_lower.find(word) for word in pattern]
            if positions == sorted(positions):
                details.append(f"Mechanical sequence: {' → '.join(pattern)}")
                penalty += OVERUSED_LINKERS["penalty_rules"]["mechanical_sequence"]
                is_overused = True
    
    # Check for repetition
    linker_counts = {}
    for linker in OVERUSED_LINKERS["common_linkers"]:
        count = essay_lower.count(linker)
        if count >= OVERUSED_LINKERS["repetition_threshold"]:
            linker_counts[linker] = count
            details.append(f"'{linker}' used {count} times")
            penalty += OVERUSED_LINKERS["penalty_rules"]["same_linker_3x"]
            is_overused = True
    
    # Cap penalty at 1.0
    penalty = min(penalty, 1.0)
    
    return is_overused, details, penalty


def check_copied_question(essay: str, question: str) -> Tuple[bool, float]:
    """
    Check if the essay introduction copies the question.
    
    Args:
        essay: The student's essay
        question: The original question
        
    Returns:
        Tuple of (is_copied, similarity_percentage)
    """
    # Get first sentence/paragraph of essay
    first_para = essay.split('\n')[0] if '\n' in essay else essay[:200]
    
    # Normalize text
    essay_words = set(re.findall(r'\b\w+\b', first_para.lower()))
    question_words = set(re.findall(r'\b\w+\b', question.lower()))
    
    # Remove common stop words
    stop_words = {'the', 'a', 'an', 'is', 'are', 'to', 'of', 'and', 'in', 'that', 'it'}
    essay_words -= stop_words
    question_words -= stop_words
    
    if not question_words:
        return False, 0.0
    
    # Calculate overlap
    overlap = len(essay_words & question_words)
    similarity = overlap / len(question_words) * 100
    
    # >60% overlap = copied
    is_copied = similarity > 60
    
    return is_copied, similarity


def count_paragraphs(essay: str) -> int:
    """Count the number of paragraphs in the essay."""
    # Split by double newline or single newline with significant gap
    paragraphs = [p.strip() for p in re.split(r'\n\s*\n|\n', essay) if p.strip()]
    return len(paragraphs)


def extract_thesis_candidates(essay: str) -> List[str]:
    """
    Extract potential thesis statements from the essay.
    
    Looks in the introduction (first paragraph) for thesis indicators.
    """
    # Get first paragraph
    paragraphs = [p.strip() for p in re.split(r'\n\s*\n', essay) if p.strip()]
    if not paragraphs:
        return []
    
    intro = paragraphs[0]
    candidates = []
    
    # Check for thesis indicator phrases
    for indicator in ARGUMENT_QUALITY_INDICATORS["thesis_indicators"]:
        if indicator in intro.lower():
            # Extract the sentence containing the indicator
            sentences = re.split(r'[.!?]', intro)
            for sentence in sentences:
                if indicator in sentence.lower():
                    candidates.append(sentence.strip())
    
    return candidates
