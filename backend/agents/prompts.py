"""
Streamlined system prompts for IELTS Reading Feedback Agent.
Optimized for token efficiency while maintaining educational quality.
"""

# Streamlined system prompt - acknowledges dynamic theory injection
SYSTEM_PROMPT = """You are an expert IELTS Reading tutor providing passage-based feedback.

CORE RULES:
1. Base ALL analysis ONLY on the provided passage - never use external knowledge
2. Follow official IELTS Reading assessment criteria
3. Compare answers fairly (accept synonyms/paraphrasing where appropriate)
4. Quote specific passage text as evidence
5. Teach strategies based on the provided QUESTION TYPE GUIDANCE
6. Return valid JSON matching the schema
7. If uncertain, indicate "low" confidence

Be constructive and encouraging. Help students improve their IELTS Reading skills."""


# Main feedback generation template
FEEDBACK_TEMPLATE = """Analyze the student's answer to this IELTS Reading question and provide detailed feedback.

PASSAGE:
{passage}

QUESTION TYPE: {question_type}
QUESTION: {question}
CORRECT ANSWER: {correct_answer}
STUDENT'S ANSWER: {student_answer}

QUESTION TYPE GUIDANCE:
{question_type_guidance}

ANALYSIS STEPS:
1. Locate relevant passage section
2. Compare student answer with correct answer
3. Quote passage evidence
4. Explain reasoning clearly
5. Provide strategy tip based on the guidance above

{format_instructions}"""


# Fallback guidance (minimal version for edge cases)
QUESTION_TYPE_GUIDANCE = {
    "General": """
For this question type:
- Read question carefully to understand what is asked
- Locate relevant section in passage
- Match required information precisely
- Follow specific instructions about word limits or format
"""
}


def get_question_type_guidance(question_type: str) -> str:
    """
    Get fallback guidance for a question type.
    
    Args:
        question_type: Type of IELTS reading question
        
    Returns:
        Minimal guidance text
    """
    return QUESTION_TYPE_GUIDANCE.get("General")


# Error response template
ERROR_FEEDBACK_TEMPLATE = {
    "is_correct": False,
    "feedback": "Unable to assess answer due to an error. Please try again.",
    "reasoning": "An error occurred during analysis.",
    "strategy_tip": "Ensure all required information is provided correctly.",
    "passage_reference": "N/A",
    "confidence": "low"
}


# Validation prompt for checking agent output
VALIDATION_PROMPT = """Review this feedback and ensure it follows all rules:

FEEDBACK:
{feedback}

PASSAGE:
{passage}

CHECK:
1. Does feedback reference only passage information?
2. Are all quotes actually from passage?
3. Is reasoning clear and educational?
4. Does it follow IELTS assessment criteria?
5. Is output properly formatted as JSON?

If any check fails, explain what's wrong. Otherwise, respond with "VALID".
"""
