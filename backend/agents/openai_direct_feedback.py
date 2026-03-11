"""
Direct OpenAI Chat Completion approach (no Assistant API).
This module manually calls your MCP tools and passes data to GPT.
"""

import os
import sys
import json
import asyncio
from typing import Dict, Any

from openai import OpenAI
from dotenv import load_dotenv

# Make sure we can import reading_mcp_tools
sys.path.append("backend/agents")
from reading_mcp_tools import (
    get_passage,
    get_question,
    get_correct_answer,
    get_student_answer,
    get_error_profile,
)

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# System prompt (can be shortened or replaced with the full one from SYSTEM_PROMPT.md)
SYSTEM_PROMPT = """
You are an expert IELTS Reading examiner.

- Explain strictly based on the passage (no assumptions).
- Always quote evidence from the passage.
- Identify the student's mistake pattern.
- Provide a strategy tip for this question type.
- Personalize advice using the student's error profile.

Always respond as a JSON object with:
{
  "verdict": "CORRECT" | "INCORRECT",
  "correctAnswer": "...",
  "whyStudentIsWrong": {
    "reason": "...",
    "studentMistakePattern": "..."
  },
  "evidence": {
    "quote": "...",
    "analysis": "..."
  },
  "strategyTip": {
    "name": "...",
    "steps": ["...", "..."]
  },
  "personalizedAdvice": "..."
}
""".strip()


async def get_deeper_feedback_direct(
    user_id: int,
    test_id: int,
    passage_id: int,
    question_id: int,
) -> Dict[str, Any]:
    """
    Get feedback by manually calling MCP tools and passing data to GPT.

    This approach DOES NOT require OpenAI MCP integration.
    """
    # Step 1: Gather data via MCP tools
    print("Fetching data from MCP tools...")

    passage_data = await get_passage(test_id, passage_id)
    question_data = await get_question(test_id, passage_id, question_id)
    correct_answer_data = await get_correct_answer(test_id, passage_id, question_id)
    student_answer_data = await get_student_answer(user_id, test_id, passage_id, question_id)
    error_profile_data = await get_error_profile(user_id)

    # Step 2: Build user message
    user_message = f"""Please analyze this student's IELTS Reading answer:

**Passage Information**
Title: {passage_data.get('title', '')}
Paragraphs: {json.dumps(passage_data.get('paragraphs', []), indent=2)}

**Question**
{question_data.get('questionText', '')}
Type: {question_data.get('type', '')}
Options: {json.dumps(question_data.get('options', []))}

**Correct Answer**
{correct_answer_data.get('correctAnswer', '')}

**Student's Answer**
{student_answer_data.get('studentAnswer', '')}

**Student's Error Profile**
- Overall Accuracy: {error_profile_data.get('overallAccuracy', 0.0) * 100:.1f}%
- Total Sessions: {error_profile_data.get('totalSessions', 0)}
- Total Questions: {error_profile_data.get('totalQuestions', 0)}
- Total Correct: {error_profile_data.get('totalCorrect', 0)}

Please provide detailed, structured feedback in the JSON format described in the system instructions.
"""

    # Step 3: Call OpenAI
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        temperature=0.3,
        response_format={"type": "json_object"},
    )

    # Step 4: Parse JSON content
    content = response.choices[0].message.content
    try:
        feedback = json.loads(content)
    except json.JSONDecodeError:
        # Fallback: wrap raw content
        feedback = {
            "verdict": "ERROR",
            "correctAnswer": "",
            "whyStudentIsWrong": {
                "reason": "Model did not return valid JSON",
                "studentMistakePattern": "",
            },
            "evidence": {"quote": "", "analysis": content},
            "strategyTip": {"name": "Parsing error", "steps": []},
            "personalizedAdvice": "",
        }
    return feedback


def get_feedback_sync(
    user_id: int,
    test_id: int,
    passage_id: int,
    question_id: int,
) -> Dict[str, Any]:
    """Synchronous wrapper for use from Node/Encore."""
    return asyncio.run(
        get_deeper_feedback_direct(user_id, test_id, passage_id, question_id)
    )


if __name__ == "__main__":
    """
    CLI usage:
        python openai_direct_feedback.py <user_id> <test_id> <passage_id> <question_id>
    Prints JSON feedback to stdout.
    """
    if len(sys.argv) != 5:
        print(
            json.dumps(
                {
                    "verdict": "ERROR",
                    "correctAnswer": "",
                    "whyStudentIsWrong": {
                        "reason": "Usage: python openai_direct_feedback.py <user_id> <test_id> <passage_id> <question_id>",
                        "studentMistakePattern": "",
                    },
                    "evidence": {"quote": "", "analysis": ""},
                    "strategyTip": {"name": "Usage error", "steps": []},
                    "personalizedAdvice": "",
                }
            )
        )
        sys.exit(1)

    _user_id = int(sys.argv[1])
    _test_id = int(sys.argv[2])
    _passage_id = int(sys.argv[3])
    _question_id = int(sys.argv[4])

    result = get_feedback_sync(_user_id, _test_id, _passage_id, _question_id)
    print(json.dumps(result))