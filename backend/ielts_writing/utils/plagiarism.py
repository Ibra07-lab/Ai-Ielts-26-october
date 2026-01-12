"""Plagiarism detection utilities for IELTS writing."""
from difflib import SequenceMatcher


def calculate_text_similarity(text1: str, text2: str) -> float:
    """
    Calculate similarity between two texts (0.0 to 1.0).
    Returns the ratio of matching characters.
    
    Args:
        text1: First text to compare
        text2: Second text to compare
        
    Returns:
        Similarity score from 0.0 (completely different) to 1.0 (identical)
    """
    return SequenceMatcher(None, text1.lower(), text2.lower()).ratio()


def extract_introduction(essay: str) -> str:
    """
    Extract the first paragraph (introduction) from the essay.
    
    Args:
        essay: The complete essay text
        
    Returns:
        The introduction paragraph
    """
    # Try to split by double newlines first (paragraph breaks)
    paragraphs = essay.strip().split('\n\n')
    if paragraphs and len(paragraphs[0].strip()) > 0:
        return paragraphs[0].strip()
    
    # Fallback to first line if no paragraph breaks
    lines = essay.split('\n')
    if lines:
        return lines[0].strip()
    
    return essay.strip()


def check_introduction_copying(question: str, essay: str) -> dict:
    """
    Check if the essay introduction is copied from the question.
    
    This is particularly important for IELTS Task 1, where students must
    paraphrase the task description in their introduction.
    
    Args:
        question: The original question/task description
        essay: The student's essay
        
    Returns:
        Dictionary containing:
        - is_copied: bool - True if >70% similar (clear copying)
        - similarity_score: float - 0.0 to 1.0
        - penalty_recommended: bool - True if ≥50% similar
        - details: str - Human-readable explanation
        - intro_text: str - The extracted introduction
    """
    intro = extract_introduction(essay)
    
    # Calculate raw similarity
    similarity = calculate_text_similarity(question, intro)
    
    # Thresholds based on IELTS marking criteria
    HIGH_COPYING = 0.70  # >70% similar = obvious copying
    MODERATE_COPYING = 0.50  # 50-70% = needs review
    
    is_copied = similarity >= HIGH_COPYING
    penalty_recommended = similarity >= MODERATE_COPYING
    
    # Generate human-readable feedback
    if similarity >= HIGH_COPYING:
        details = (
            f"Introduction is {similarity:.0%} similar to the question. "
            f"Clear copying detected. In IELTS, you must paraphrase the task description "
            f"using your own words to demonstrate vocabulary range."
        )
    elif similarity >= MODERATE_COPYING:
        details = (
            f"Introduction is {similarity:.0%} similar to the question. "
            f"Limited paraphrasing detected. Try to rephrase more of the task description "
            f"using synonyms and different sentence structures."
        )
    else:
        details = f"Introduction shows adequate paraphrasing ({similarity:.0%} similarity)."
    
    return {
        "is_copied": is_copied,
        "similarity_score": similarity,
        "penalty_recommended": penalty_recommended,
        "details": details,
        "intro_text": intro
    }
