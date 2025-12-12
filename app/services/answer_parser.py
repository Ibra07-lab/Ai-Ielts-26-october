import re
from typing import Dict, Optional

def parse_student_answers(message: str) -> Dict[int, str]:
    """
    Extract student answers from a message.
    
    Supports formats:
    - "1-A, 2-B, 3-C"
    - "Q1: A, Q2: B, Q3: C"
    - "1. A 2. B 3. C"
    - "my answers: A, B, C" (assumes sequential order)
    - "1-TRUE, 2-FALSE, 3-NOT GIVEN"
    
    Args:
        message: User's message text
        
    Returns:
        Dict mapping question_id to answer (e.g., {1: "A", 2: "B", 3: "C"})
    """
    answers = {}

    # Pattern 0: Letter-number mappings like "A-2, B-1, C-4"
    # Common in Matching Headings where items are A/B/C/D and answers are 1..n
    pattern0 = r'\b([A-Za-z])\s*[-:]\s*(\d{1,2})\b'
    pairs0 = list(re.finditer(pattern0, message))
    if pairs0:
        for m in pairs0:
            letter = m.group(1).upper()
            q_num = ord(letter) - ord('A') + 1  # A->1, B->2, ...
            answers[q_num] = m.group(2)  # keep numeric answer as string (e.g., "2")

    # If we parsed any A-1 style pairs, return early to avoid conflicting patterns
    if answers:
        return answers
    
    # Pattern 1: "1-A, 2-B, 3-C" or "Q1-A, Q2-B" or "1-TRUE, 2-FALSE"
    pattern1 = r'(?:Q|q)?(\d+)\s*[-:]\s*([A-Ca-c]|TRUE|FALSE|NOT GIVEN|True|False|Not Given|true|false|not given)'
    matches = re.finditer(pattern1, message)
    for match in matches:
        q_num = int(match.group(1))
        answer = match.group(2).upper()
        answers[q_num] = answer
    
    # Pattern 2: "1. A, 2. B" or "Q1. A, Q2. B"
    if not answers:
        pattern2 = r'(?:Q|q)?(\d+)\.\s*([A-Ca-c]|TRUE|FALSE|NOT GIVEN|True|False|Not Given|true|false|not given)'
        matches = re.finditer(pattern2, message)
        for match in matches:
            q_num = int(match.group(1))
            answer = match.group(2).upper()
            answers[q_num] = answer
    
    # Pattern 3: Sequential answers "A, B, C" or "my answers are A, B, C"
    # Only use this if we didn't find explicit question numbers
    if not answers:
        # Look for sequences like "A, B, C" or "TRUE, FALSE, NOT GIVEN"
        pattern3 = r'\b([A-Ca-c]|TRUE|FALSE|NOT GIVEN|True|False|Not Given|true|false|not given)\b'
        matches = re.findall(pattern3, message)
        if matches and len(matches) <= 5:  # Reasonable limit to avoid false positives
            for idx, answer in enumerate(matches, start=1):
                answers[idx] = answer.upper()
    
    return answers


def extract_question_id_from_message(message: str) -> Optional[int]:
    """
    Extract a question number when user asks about a specific question.
    
    Supports:
    - "why is question 2 wrong"
    - "explain Q3"
    - "second question"
    - "the third one"
    
    Returns:
        Question number (int) or None if not found
    """
    # Pattern 1: "question 2", "Q2", "question number 2"
    pattern1 = r'(?:question|q)\s*(?:number\s*)?(\d+)'
    match = re.search(pattern1, message, re.IGNORECASE)
    if match:
        return int(match.group(1))
    
    # Pattern 2: Ordinal words
    ordinals = {
        'first': 1, '1st': 1,
        'second': 2, '2nd': 2,
        'third': 3, '3rd': 3,
        'fourth': 4, '4th': 4,
        'fifth': 5, '5th': 5,
    }
    
    for word, num in ordinals.items():
        if word in message.lower():
            return num
    
    return None
