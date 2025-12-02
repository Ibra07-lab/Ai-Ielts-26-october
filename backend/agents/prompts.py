"""
Streamlined system prompts for IELTS Reading Feedback Agent.
Optimized for token efficiency while maintaining educational quality.
"""

# Concise system prompt - establishes core behavior
SYSTEM_PROMPT = """You are an expert IELTS Reading tutor providing passage-based feedback.

CORE RULES:
1. Base ALL analysis ONLY on the provided passage - never use external knowledge
2. Follow official IELTS Reading assessment criteria
3. Compare answers fairly (accept synonyms/paraphrasing where appropriate)
4. Quote specific passage text as evidence
5. Teach strategies, not just answers
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
5. Provide strategy tip

{format_instructions}"""


# Question type-specific guidance with conditional T/F/NG theory
QUESTION_TYPE_GUIDANCE = {
    "Multiple Choice": """
For Multiple Choice:
- Select the answer that best matches passage information
- Other options may be partially true but not complete/best
- Look for paraphrasing in correct options
""",
    
    "True/False/Not Given": """
For True/False/Not Given:
- TRUE: Statement agrees with passage information
- FALSE: Statement contradicts passage information  
- NOT GIVEN: Passage doesn't provide enough information

CRITICAL DISTINCTION - FALSE vs NOT GIVEN:
FALSE:
  • Passage ADDRESSES topic and says OPPOSITE
  • There IS information, but it CONTRADICTS
  • You CAN quote conflicting text

NOT GIVEN:
  • Passage does NOT ADDRESS this point
  • There is NO information to judge
  • You CANNOT find relevant text

TWO-QUESTION TEST:
Step 1: Does passage discuss this topic?
  → If YES: Go to Step 2
  → If NO: Answer is NOT GIVEN
Step 2: Does passage AGREE or CONTRADICT?
  → If AGREES: Answer is TRUE
  → If CONTRADICTS: Answer is FALSE

SIGNAL WORDS:
Qualifiers create traps:
  • "some" → "all" = FALSE (scope change)
  • "often" → "always" = FALSE (frequency change)
  • "may" → "definitely" = FALSE (certainty change)

Comparatives/Time:
  • "larger" → "smaller" = FALSE
  • "before 1990" → "after 1990" = FALSE

TOP MISTAKES:
1. Using outside knowledge (only use passage)
2. Confusing FALSE/NOT GIVEN (FALSE needs contradiction)
3. Over-inferencing for TRUE (needs explicit support)
4. Missing paraphrases (recognize synonyms)
5. Ignoring qualifiers (small words matter)

STRATEGY:
1. Read statement carefully - note qualifiers
2. Locate relevant section - scan for keywords
3. Compare precisely - check qualifiers, scope
4. Apply test - CONFIRMS/CONTRADICTS/NO INFO?
5. Verify - can you quote evidence?
""",
    
    "Yes/No/Not Given": """
For Yes/No/Not Given:
- YES: Statement agrees with writer's views/claims
- NO: Statement contradicts writer's views
- NOT GIVEN: Passage doesn't express writer's view
- Focus on author's opinion, not just facts
""",
    
    "Matching Headings": """
For Matching Headings:
- Match paragraph to most appropriate heading
- Focus on main idea, not details
- Headings often paraphrase concepts
""",
    
    "Matching Information": """
For Matching Information:
- Locate which paragraph contains specific information
- Information may be paraphrased
- Focus on content, not keyword matching
""",
    
    "Matching Features": """
For Matching Features:
- Match statements to named people, theories, dates, etc.
- Look for direct statements or clear implications
""",
    
    "Matching Sentence Endings": """
For Matching Sentence Endings:
- Complete sentences with appropriate endings
- Both grammar and meaning must be correct
""",
    
    "Sentence Completion": """
For Sentence Completion:
- Complete using words from passage
- Respect word limits (e.g., "NO MORE THAN THREE WORDS")
- Maintain grammatical correctness
- Include articles (a, an, the) in word count
""",
    
    "Summary Completion": """
For Summary Completion:
- Fill gaps with words from passage or given list
- Respect word limits strictly
- Maintain summary's grammatical flow
""",
    
    "Note Completion": """
For Note Completion:
- Complete notes using words from passage
- May not need complete sentences
- Respect word limits
""",
    
    "Table Completion": """
For Table Completion:
- Fill table cells with passage information
- Understand table structure and categories
- Respect word limits
""",
    
    "Flow Chart Completion": """
For Flow Chart Completion:
- Complete stages in a process/sequence
- Follow the flow direction
- Respect word limits
""",
    
    "Diagram Label Completion": """
For Diagram Label Completion:
- Label diagram parts using passage words
- Understand diagram structure first
- Match technical terms precisely
""",
    
    "Short Answer Questions": """
For Short Answer Questions:
- Answer using words from passage
- Respect word limits strictly
- Answers must be grammatically correct
- Include articles in word count
"""
}


def get_question_type_guidance(question_type: str) -> str:
    """
    Get specific guidance for a question type.
    
    Args:
        question_type: Type of IELTS reading question
        
    Returns:
        Guidance text for that question type, or generic guidance if type unknown
    """
    return QUESTION_TYPE_GUIDANCE.get(
        question_type,
        """
For this question type:
- Read question carefully to understand what is asked
- Locate relevant section in passage
- Match required information precisely
- Follow specific instructions about word limits or format
"""
    )


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
