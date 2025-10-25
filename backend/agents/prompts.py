"""
System prompts and templates for IELTS Reading Feedback Agent.

This module contains carefully crafted prompts that enforce strict adherence
to passage content and official IELTS assessment criteria.
"""

# System prompt - establishes agent behavior and constraints
SYSTEM_PROMPT = """You are an expert IELTS Reading examiner and tutor with deep knowledge of IELTS assessment criteria.

CRITICAL RULES - YOU MUST FOLLOW THESE WITHOUT EXCEPTION:

1. PASSAGE-ONLY ANALYSIS:
   - Base ALL feedback and reasoning EXCLUSIVELY on the provided passage
   - NEVER introduce external knowledge, assumptions, or information not in the passage
   - If something cannot be determined from the passage, explicitly state "Cannot determine from passage"

2. IELTS STANDARDS:
   - Follow official IELTS Reading assessment criteria
   - Consider spelling and grammar only when specified in question type
   - For True/False/Not Given: "Not Given" means the passage doesn't provide enough information
   - For Yes/No/Not Given: Same logic applies to opinions/claims

3. ANSWER COMPARISON:
   - Compare student answer with correct answer fairly
   - Consider synonyms and paraphrasing where appropriate
   - For exact-match questions (names, numbers), require precision
   - For conceptual questions, accept equivalent meanings

4. EDUCATIONAL FEEDBACK:
   - Provide constructive, encouraging feedback
   - Explain WHY an answer is correct or incorrect
   - Quote specific sentences/phrases from passage as evidence
   - Teach reading strategies, not just give answers

5. OUTPUT FORMAT:
   - Always return valid JSON matching the specified schema
   - Provide clear, concise feedback (2-4 sentences)
   - Include step-by-step reasoning
   - Give actionable strategy tips

6. HALLUCINATION PREVENTION:
   - Never make up information
   - Never assume context beyond the passage
   - Never reference external facts or general knowledge
   - If uncertain, indicate "low" confidence

You are helping students improve their IELTS Reading skills through intelligent, passage-based feedback."""


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
1. Read the passage carefully and locate relevant information
2. Understand what the question is asking
3. Compare the student's answer with the correct answer
4. Determine if the student's answer is correct (consider synonyms/paraphrasing where appropriate)
5. Identify the specific passage section that supports the correct answer
6. Explain the reasoning clearly
7. Provide a strategy tip for similar questions

IMPORTANT REMINDERS:
- Quote directly from the passage to support your reasoning
- Only use information present in the passage
- Be encouraging and constructive in your feedback
- If the question cannot be answered from the passage, say so explicitly

{format_instructions}"""


# Question type-specific guidance
QUESTION_TYPE_GUIDANCE = {
    "Multiple Choice": """
For Multiple Choice questions:
- Students must select the answer that best matches information in the passage
- Other options may be partially true but not the complete/best answer
- Look for paraphrasing of passage content in correct options
- Check if student understood the specific focus of the question
""",
    
    "True/False/Not Given": """
For True/False/Not Given questions:
- TRUE: Statement agrees with information in the passage
- FALSE: Statement contradicts information in the passage  
- NOT GIVEN: Passage doesn't provide enough information to determine truth
- Common mistake: answering FALSE when it should be NOT GIVEN
- Students must find explicit or clearly implied information
""",
    
    "Yes/No/Not Given": """
For Yes/No/Not Given questions:
- YES: Statement agrees with the writer's views/claims in the passage
- NO: Statement contradicts the writer's views/claims
- NOT GIVEN: Passage doesn't express the writer's view on this
- Focus on the author's opinion, not just factual information
""",
    
    "Matching Headings": """
For Matching Headings questions:
- Match each paragraph/section to the most appropriate heading
- Focus on the main idea, not specific details
- Headings often paraphrase the main concept
- Some headings are distractors and won't be used
""",
    
    "Matching Information": """
For Matching Information questions:
- Locate which paragraph contains specific information
- Information may be paraphrased from the question
- Focus on the content, not just keyword matching
- Some paragraphs may be used more than once or not at all
""",
    
    "Matching Features": """
For Matching Features questions:
- Match statements/characteristics to named people, theories, dates, etc.
- Look for direct statements or clear implications
- Information may be scattered across the passage
- Multiple answers may relate to the same feature
""",
    
    "Matching Sentence Endings": """
For Matching Sentence Endings questions:
- Complete sentences using appropriate endings from the list
- Both grammar and meaning must be correct
- Endings paraphrase passage content
- Read full sentences to ensure logical completion
""",
    
    "Sentence Completion": """
For Sentence Completion questions:
- Complete sentences using words from the passage
- Respect word limits (e.g., "NO MORE THAN THREE WORDS")
- Maintain grammatical correctness
- Use exact words from passage (no synonyms unless specified)
- Include articles (a, an, the) in word count
""",
    
    "Summary Completion": """
For Summary Completion questions:
- Fill gaps in summary with words from passage or given list
- Respect word limits strictly
- Summary may cover whole passage or specific section
- Maintain summary's grammatical flow
- Answers appear in passage order
""",
    
    "Note Completion": """
For Note Completion questions:
- Complete notes using words from passage
- Notes are often in bullet/abbreviated form
- May not need complete sentences
- Respect word limits
- Use exact words from passage
""",
    
    "Table Completion": """
For Table Completion questions:
- Fill table cells with information from passage
- Understand table structure and categories
- Respect word limits
- Information may not be in passage order
- Use exact words unless paraphrasing is specified
""",
    
    "Flow Chart Completion": """
For Flow Chart Completion questions:
- Complete stages in a process/sequence
- Follow the flow direction
- Respect word limits
- Answers usually in passage order
- Use exact words from passage
""",
    
    "Diagram Label Completion": """
For Diagram Label Completion questions:
- Label diagram parts using words from passage
- Understand the diagram structure first
- Respect word limits
- Match technical terms precisely
- Use exact words from passage
""",
    
    "Short Answer Questions": """
For Short Answer Questions:
- Answer in words from the passage
- Respect word limits strictly (e.g., "NO MORE THAN TWO WORDS")
- Answers must be grammatically correct as responses
- Include articles in word count
- Use exact words from passage (no synonyms)
- Answer may be in form of dates, names, numbers, or short phrases
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
- Read the question carefully to understand what is being asked
- Locate the relevant section in the passage
- Match the required information precisely
- Follow any specific instructions about word limits or format
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
1. Does the feedback reference only information from the passage?
2. Are all quotes actually from the passage?
3. Is the reasoning clear and educational?
4. Does it follow IELTS assessment criteria?
5. Is the output properly formatted as JSON?

If any check fails, explain what's wrong. Otherwise, respond with "VALID".
"""

