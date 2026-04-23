"""
Lexical Analysis Utilities — Deterministic Post-Processing

Pure Python functions that enrich the Explainer's output with
vocabulary metrics that don't require LLM inference:

1. Paraphrase overlap detection (prompt vs intro)
2. Word repetition detection with hardcoded synonyms
3. Vocabulary variety scoring against band benchmarks
"""

import re
import string
from collections import Counter
from typing import List, Optional, Dict, Any


# ============================================================================
# STOPWORDS — common English words to ignore in overlap / repetition analysis
# ============================================================================

STOPWORDS = frozenset({
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "shall",
    "should", "may", "might", "must", "can", "could",
    "i", "you", "he", "she", "it", "we", "they", "me", "him", "her",
    "us", "them", "my", "your", "his", "its", "our", "their",
    "this", "that", "these", "those", "which", "who", "whom", "whose",
    "what", "where", "when", "how", "why",
    "and", "but", "or", "nor", "not", "no", "so", "if", "then",
    "than", "too", "very", "just", "also", "only",
    "in", "on", "at", "to", "for", "of", "with", "by", "from",
    "up", "about", "into", "through", "during", "before", "after",
    "above", "below", "between", "under", "over", "out",
    "per",  # unit preposition — cannot be paraphrased
    "as", "each", "every", "both", "all", "any", "some",
    "there", "here", "more", "most", "other", "many", "much",
    "such", "own", "same", "measured", "shows", "show",
})

# Words that are part of the task format itself — ignore these in overlap
TASK_FORMAT_WORDS = frozenset({
    "write", "report", "summarise", "summarize", "describe",
    "information", "selecting", "reporting", "main", "features",
    "make", "comparisons", "relevant", "words", "least",
    "ielts", "task", "writing", "academic", "general",
    "below", "following", "given", "figure", "table",
})

# ============================================================================
# UNITS, NUMBERS & FACTUAL WORDS — cannot be paraphrased, exclude from overlap
# ============================================================================

# Written-out number words — students cannot paraphrase "five" or "three"
NUMBER_WORDS = frozenset({
    "one", "two", "three", "four", "five", "six", "seven", "eight",
    "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
    "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
    "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
    "hundred", "thousand", "million", "billion",
    "first", "second", "third", "fourth", "fifth",
})

# Units of measurement — factual, cannot be paraphrased
UNIT_WORDS = frozenset({
    "litres", "liters", "kilometres", "kilometers", "metres", "meters",
    "kilograms", "grams", "tonnes", "tons", "miles", "feet", "inches",
    "percent", "percentage",
    "day", "days", "week", "weeks", "month", "months", "year", "years",
    "hour", "hours", "minute", "minutes",
    "kg", "km", "cm", "mm", "ml",
})


def _is_numeric(word: str) -> bool:
    """Check if a word is a number (year, digit, etc.). e.g. '2010', '500', '3.5'"""
    try:
        float(word)
        return True
    except ValueError:
        return False


# ============================================================================
# HARDCODED SYNONYM BANK — common Task 1 words with alternatives
# ============================================================================

SYNONYM_BANK: Dict[str, List[str]] = {
    # Increase verbs
    "increase": ["rise", "grow", "climb", "surge"],
    "increased": ["rose", "grew", "climbed", "surged"],
    "increasing": ["rising", "growing", "climbing"],
    "rise": ["increase", "grow", "climb", "surge"],
    "rose": ["increased", "grew", "climbed", "surged"],
    "grow": ["increase", "rise", "expand", "climb"],
    "grew": ["increased", "rose", "expanded", "climbed"],
    
    # Decrease verbs
    "decrease": ["decline", "fall", "drop", "dip"],
    "decreased": ["declined", "fell", "dropped", "dipped"],
    "decreasing": ["declining", "falling", "dropping"],
    "fall": ["decrease", "decline", "drop", "dip"],
    "fell": ["decreased", "declined", "dropped", "dipped"],
    "drop": ["decrease", "decline", "fall", "dip"],
    "dropped": ["decreased", "declined", "fell", "dipped"],
    
    # Stability
    "remain": ["stay", "hold steady", "stabilize"],
    "remained": ["stayed", "held steady", "stabilized"],
    "stable": ["constant", "steady", "unchanged"],
    
    # Magnitude adverbs
    "significantly": ["substantially", "considerably", "markedly"],
    "slightly": ["marginally", "modestly", "fractionally"],
    "dramatically": ["sharply", "steeply", "rapidly"],
    "gradually": ["steadily", "progressively", "slowly"],
    
    # Common Task 1 nouns
    "number": ["figure", "quantity", "total"],
    "percentage": ["proportion", "share", "fraction"],
    "amount": ["quantity", "volume", "level"],
    "rate": ["level", "pace", "speed"],
    "people": ["individuals", "respondents", "participants"],
    "countries": ["nations", "states", "regions"],
    "year": ["period", "time frame", "decade"],
    "chart": ["graph", "diagram", "figure"],
    
    # Common descriptors
    "highest": ["peak", "maximum", "top"],
    "lowest": ["minimum", "bottom", "trough"],
    "big": ["large", "substantial", "considerable"],
    "small": ["minor", "slight", "modest"],
    "important": ["significant", "notable", "key"],
    "different": ["varied", "diverse", "distinct"],
    "similar": ["comparable", "alike", "analogous"],
    "show": ["illustrate", "depict", "demonstrate"],
    "shows": ["illustrates", "depicts", "demonstrates"],
    
    # New additions from user
    "down": ["declined", "dropped", "fell", "decreased"],
    "city": ["urban area", "town", "municipality", "metropolitan area"],
    "cities": ["urban areas", "towns", "municipalities", "metropolitan areas"],
    "water": ["water consumption", "water usage", "this resource"],
    "use": ["consumption", "usage", "intake", "demand"],
}


# ============================================================================
# FUNCTION 1: PARAPHRASE OVERLAP DETECTION
# ============================================================================

def _tokenize(text: str) -> List[str]:
    """Lowercase, strip punctuation, split into words."""
    text = text.lower()
    text = text.translate(str.maketrans("", "", string.punctuation))
    return text.split()


def _extract_intro_sentences(essay: str, max_sentences: int = 2) -> str:
    """Extract the first 1-2 sentences of the essay as the introduction."""
    # Split on sentence-ending punctuation
    sentences = re.split(r'(?<=[.!?])\s+', essay.strip())
    intro = " ".join(sentences[:max_sentences])
    return intro


def detect_paraphrase_overlap(question: str, essay: str) -> Dict[str, Any]:
    """
    Detect how much of the prompt/question the student copied verbatim
    into their introduction.
    
    Args:
        question: The original Task 1 question/prompt text
        essay: The student's full essay
        
    Returns:
        Dict with overlap_words, overlap_percentage, severity, 
        student_intro, prompt_text
    """
    intro = _extract_intro_sentences(essay)
    
    # Tokenize both
    prompt_tokens = _tokenize(question)
    intro_tokens = _tokenize(intro)
    
    # Remove stopwords, task-format words, numbers, units from comparison
    # Only keep meaningful content words that students SHOULD paraphrase:
    # subject nouns, adjectives, chart-type words, descriptors
    def _is_paraphraseable(w: str) -> bool:
        if w in STOPWORDS or w in TASK_FORMAT_WORDS:
            return False
        if w in NUMBER_WORDS or w in UNIT_WORDS:
            return False
        if _is_numeric(w):       # years (2010), numbers (500), decimals (3.5)
            return False
        if len(w) <= 2:          # too short to be meaningful
            return False
        return True
    
    prompt_content = [w for w in prompt_tokens if _is_paraphraseable(w)]
    intro_content = [w for w in intro_tokens if _is_paraphraseable(w)]
    
    if not prompt_content:
        return {
            "overlap_words": [],
            "overlap_percentage": 0.0,
            "severity": "none",
            "student_intro": intro,
            "prompt_text": question,
        }
    
    # Find words from the prompt that appear in the intro
    prompt_set = set(prompt_content)
    intro_set = set(intro_content)
    overlap = prompt_set & intro_set
    
    # Calculate overlap as % of prompt content words found in intro
    overlap_pct = len(overlap) / len(prompt_set) if prompt_set else 0.0
    
    # Determine severity
    if overlap_pct >= 0.5:
        severity = "critical"
    elif overlap_pct >= 0.3:
        severity = "high"
    elif overlap_pct >= 0.15:
        severity = "low"
    else:
        severity = "none"
    
    return {
        "overlap_words": sorted(list(overlap)),
        "overlap_percentage": round(overlap_pct, 3),
        "severity": severity,
        "student_intro": intro,
        "prompt_text": question,
    }


# ============================================================================
# FUNCTION 2: WORD REPETITION DETECTION
# ============================================================================

def detect_word_repetition(
    essay: str, 
    threshold_per_100_words: float = 3.0,
    min_absolute_count: int = 4,
) -> List[Dict[str, Any]]:
    """
    Detect words that are repeated excessively in the essay.
    
    Args:
        essay: The student's full essay
        threshold_per_100_words: Flag if a word appears this many times per 100 words
        min_absolute_count: Minimum absolute count to flag (avoids noise in short essays)
        
    Returns:
        List of dicts with word, count, synonyms (from hardcoded bank)
    """
    tokens = _tokenize(essay)
    word_count = len(tokens)
    
    # Filter to content words only
    content_words = [w for w in tokens if w not in STOPWORDS and len(w) > 2]
    
    # Count frequencies
    freq = Counter(content_words)
    
    # Calculate dynamic threshold based on essay length
    # For a 160-word essay, threshold_per_100_words=3.0 means flag at 4.8 ≈ 5
    dynamic_threshold = max(
        min_absolute_count,
        int(word_count * threshold_per_100_words / 100)
    )
    
    repetitions = []
    for word, count in freq.most_common():
        if count >= dynamic_threshold:
            # Determine severity and synonyms
            is_ignore = word in UNIT_WORDS or word in NUMBER_WORDS or _is_numeric(word)
            
            # Look up synonyms from hardcoded bank
            synonyms = SYNONYM_BANK.get(word, [])
            base = word.rstrip("s").rstrip("ed").rstrip("ing")
            if not synonyms:
                # Try the base form (rudimentary stemming)
                synonyms = SYNONYM_BANK.get(base, [])
            
            # Limit to 4 synonyms
            synonyms = synonyms[:4]
            
            if is_ignore:
                severity = "ignore"
            elif word in SYNONYM_BANK or base in SYNONYM_BANK:
                severity = "critical"
                # EXCEPTIONS: if we explicitly added topic words like water/use to the bank for the demo
                if word in ["water", "use"]:
                    severity = "moderate"
            else:
                severity = "moderate"

            repetitions.append({
                "word": word,
                "count": count,
                "synonyms": synonyms,
                "severity": severity
            })
    
    return repetitions


# ============================================================================
# FUNCTION 3: VOCABULARY VARIETY SCORING
# ============================================================================

# Band benchmarks for unique trend verbs
TARGET_BENCHMARKS = {
    6.0: {"trend_verbs": 4, "comparison_words": 3},
    7.0: {"trend_verbs": 6, "comparison_words": 4},
    8.0: {"trend_verbs": 8, "comparison_words": 5},
}


def _get_target_benchmark(current_band: float) -> Dict[str, Any]:
    """Get the benchmark for the target band."""
    if current_band < 6.0:
        target = 6.0
    elif current_band < 7.0:
        target = 7.0
    elif current_band < 8.0:
        target = 8.0
    else:
        target = 9.0
        
    bench = TARGET_BENCHMARKS.get(target, TARGET_BENCHMARKS[8.0])
    return {
        "target_band": target,
        "trend_verbs": bench["trend_verbs"],
        "comparison_words": bench["comparison_words"]
    }


def compute_vocabulary_stats(
    trend_vocabulary_used: List[str],
    comparison_vocabulary_used: Optional[List[str]] = None,
    current_band: float = 6.0,
) -> Dict[str, Any]:
    """
    Compute vocabulary variety metrics and compare against band benchmarks.
    
    Args:
        trend_vocabulary_used: List of trend words the student used (from Explainer)
        comparison_vocabulary_used: List of comparison words used (from Explainer)
        current_band: Current LR band score for benchmark selection
        
    Returns:
        Dict with unique counts, targets, benchmark label, percentage
    """
    unique_trends = len(set(w.lower() for w in trend_vocabulary_used)) if trend_vocabulary_used else 0
    unique_comparisons = len(set(w.lower() for w in (comparison_vocabulary_used or [])))
    
    # Get next band target
    benchmark = _get_target_benchmark(current_band)
    target_trends = benchmark["trend_verbs"]
    target_comparisons = benchmark["comparison_words"]
    
    # Calculate percentage toward target
    trend_pct = min(1.0, unique_trends / target_trends) if target_trends > 0 else 1.0
    comp_pct = min(1.0, unique_comparisons / target_comparisons) if target_comparisons > 0 else 1.0
    
    return {
        "unique_trend_verbs": unique_trends,
        "unique_comparison_words": unique_comparisons,
        "target_trend_verbs": target_trends,
        "target_comparison_words": target_comparisons,
        "trend_percentage": round(trend_pct, 2),
        "comparison_percentage": round(comp_pct, 2),
        "target_band": benchmark["target_band"],
        "current_band": current_band,
    }
