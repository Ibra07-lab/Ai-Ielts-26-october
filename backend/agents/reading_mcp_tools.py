"""
IELTS Reading MCP Tools - Data Retrieval Functions for OpenAI MCP Server

This module provides async functions that wrap Encore backend endpoints,
exposing IELTS Reading data (passages, questions, answers, error profiles)
for the MCP server to call.
"""

import os
import logging
from typing import Any, Dict, List, Optional

import httpx

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Base URL of your Encore backend (where reading.ts runs)
IELTS_BACKEND_URL = os.getenv("IELTS_BACKEND_URL", "http://localhost:4000")


class ReadingDataError(Exception):
    """Custom exception for data retrieval errors."""
    pass


async def _get_json(client: httpx.AsyncClient, url: str) -> Any:
    """
    Helper function to make GET requests and return JSON.
    
    Args:
        client: httpx AsyncClient instance
        url: URL to fetch (relative to base URL)
        
    Returns:
        Parsed JSON response
        
    Raises:
        ReadingDataError: If request fails or returns non-200 status
    """
    try:
        resp = await client.get(url, timeout=10.0)
        resp.raise_for_status()
        return resp.json()
    except httpx.HTTPError as e:
        logger.error(f"HTTP error fetching {url}: {str(e)}")
        raise ReadingDataError(f"Failed to fetch data from {url}: {str(e)}")


# ---------------------------------------------------------------------------
# Tool 1: get_passage(test_id, passage_id)
# ---------------------------------------------------------------------------
async def get_passage(test_id: int, passage_id: int) -> Dict[str, Any]:
    """
    Fetch a single passage (including all question groups) from a test.

    Backed by: GET /reading/tests/:testId (getReadingTestById in reading.ts:440)
    
    Args:
        test_id: The test number (1-16)
        passage_id: The passage number within test (1-3)
        
    Returns:
        Dictionary with passage data:
        {
            "id": int,
            "title": str,
            "level": str,
            "estimatedTime": int,
            "paragraphs": List[{id, text}],
            "questions": List[question_groups]
        }
        
    Raises:
        ReadingDataError: If test or passage not found
    """
    logger.info(f"Fetching passage: test_id={test_id}, passage_id={passage_id}")
    
    async with httpx.AsyncClient(base_url=IELTS_BACKEND_URL) as client:
        data = await _get_json(client, f"/reading/tests/{test_id}")
    
    # Extract the specific passage from the 3 passages
    passages = data.get("passages", [])
    
    if not passages:
        raise ReadingDataError(f"No passages found in test {test_id}")
    
    # Find passage by id (passages are numbered 1, 2, 3)
    passage = None
    for p in passages:
        if p.get("id") == passage_id:
            passage = p
            break
    
    if not passage:
        raise ReadingDataError(
            f"Passage {passage_id} not found in test {test_id}. "
            f"Available passage IDs: {[p.get('id') for p in passages]}"
        )
    
    # Return trimmed passage data
    return {
        "id": passage["id"],
        "title": passage.get("title", ""),
        "level": passage.get("level", ""),
        "estimatedTime": passage.get("estimatedTime", 20),
        "paragraphs": passage.get("paragraphs", []),
        "questions": passage.get("questions", []),
    }


# ---------------------------------------------------------------------------
# Helper: flatten questions from nested question groups
# ---------------------------------------------------------------------------
def _flatten_questions(passage: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Flattens ReadingQuestionGroup[] into a flat list with group metadata.
    
    Args:
        passage: Passage dict containing nested question groups
        
    Returns:
        List of questions with flattened structure including group metadata
    """
    flat: List[Dict[str, Any]] = []
    
    for group in passage.get("questions", []):
        group_id = group.get("id")
        group_title = group.get("title")
        group_type = group.get("type")
        group_instructions = group.get("instructions")
        
        for q in group.get("questions", []):
            flat.append(
                {
                    **q,
                    "groupId": group_id,
                    "groupTitle": group_title,
                    "groupType": group_type,
                    "groupInstructions": group_instructions,
                }
            )
    
    return flat


# ---------------------------------------------------------------------------
# Tool 2: get_question(test_id, passage_id, question_id)
# ---------------------------------------------------------------------------
async def get_question(
    test_id: int, 
    passage_id: int, 
    question_id: int
) -> Dict[str, Any]:
    """
    Fetch a specific question within a passage by its numeric id.

    Assumes question ids are unique within a passage (which matches your schema).
    
    Args:
        test_id: The test number
        passage_id: The passage number within test
        question_id: The question number
        
    Returns:
        Dictionary with question details:
        {
            "id": int,
            "questionText": str,
            "options": List[str],
            "type": str,
            "groupTitle": str,
            "instructions": str,
            "correctAnswer": str | List[str]
        }
        
    Raises:
        ReadingDataError: If question not found
    """
    logger.info(
        f"Fetching question: test_id={test_id}, passage_id={passage_id}, "
        f"question_id={question_id}"
    )
    
    passage = await get_passage(test_id, passage_id)
    all_questions = _flatten_questions(passage)

    for q in all_questions:
        if int(q["id"]) == int(question_id):
            return {
                "id": q["id"],
                "questionText": q.get("questionText") or q.get("text", ""),
                "options": q.get("options", []),
                "type": q.get("groupType", ""),
                "groupTitle": q.get("groupTitle", ""),
                "instructions": q.get("groupInstructions", ""),
                "correctAnswer": q.get("correctAnswer"),
                "context": q.get("context", ""),
                "evidenceQuote": q.get("evidence_quote", ""),
                "evidenceLocation": q.get("evidence_location", ""),
            }

    raise ReadingDataError(
        f"Question {question_id} not found in test {test_id}, passage {passage_id}"
    )


# ---------------------------------------------------------------------------
# Tool 3: get_correct_answer(test_id, passage_id, question_id)
# ---------------------------------------------------------------------------
async def get_correct_answer(
    test_id: int,
    passage_id: int,
    question_id: int
) -> Dict[str, Any]:
    """
    Returns the correct answer for a specific question.
    
    Args:
        test_id: The test number
        passage_id: The passage number
        question_id: The question number
        
    Returns:
        Dictionary with:
        {
            "questionId": int,
            "correctAnswer": str | List[str]
        }
        
    Raises:
        ReadingDataError: If question not found
    """
    logger.info(
        f"Fetching correct answer: test_id={test_id}, passage_id={passage_id}, "
        f"question_id={question_id}"
    )
    
    passage = await get_passage(test_id, passage_id)
    all_questions = _flatten_questions(passage)

    for q in all_questions:
        if int(q["id"]) == int(question_id):
            return {
                "questionId": q["id"],
                "correctAnswer": q.get("correctAnswer"),
            }

    raise ReadingDataError(
        f"Correct answer for question {question_id} not found in "
        f"test {test_id}, passage {passage_id}"
    )


# ---------------------------------------------------------------------------
# Tool 4: get_student_answer(user_id, test_id, passage_id, question_id)
# NOTE: This requires the new Encore endpoint getLatestReadingSession
# ---------------------------------------------------------------------------
async def get_student_answer(
    user_id: int,
    test_id: int,
    passage_id: int,
    question_id: int,
) -> Dict[str, Any]:
    """
    Fetch the student's latest answer for this question from Encore.

    Requires Encore endpoint:
      GET /users/:userId/reading/sessions/latest?testId=...&passageId=...

    Returns:
      {
        "userId": int,
        "sessionId": int,
        "testId": int,
        "passageId": int,
        "questionId": int,
        "studentAnswer": str,
        "submittedAt": str
      }
      
    Args:
        user_id: The user ID
        test_id: The test number
        passage_id: The passage number
        question_id: The question number
        
    Returns:
        Dictionary with student's answer details
        
    Raises:
        ReadingDataError: If session or answer not found
    """
    logger.info(
        f"Fetching student answer: user_id={user_id}, test_id={test_id}, "
        f"passage_id={passage_id}, question_id={question_id}"
    )
    
    async with httpx.AsyncClient(base_url=IELTS_BACKEND_URL) as client:
        url = (
            f"/users/{user_id}/reading/sessions/latest"
            f"?testId={test_id}&passageId={passage_id}"
        )
        data = await _get_json(client, url)

    user_answers: Dict[str, Any] = data.get("userAnswers", {})
    
    # Try both string and int keys for question_id
    student_answer: Optional[str] = (
        user_answers.get(str(question_id)) or 
        user_answers.get(question_id)
    )

    return {
        "userId": user_id,
        "sessionId": data.get("id"),
        "testId": test_id,
        "passageId": passage_id,
        "questionId": question_id,
        "studentAnswer": student_answer,
        "submittedAt": data.get("createdAt"),
    }


# ---------------------------------------------------------------------------
# Tool 5: get_error_profile(user_id)
# Simple heuristic based on reading_sessions - can be enhanced later
# ---------------------------------------------------------------------------
async def get_error_profile(user_id: int) -> Dict[str, Any]:
    """
    Return a coarse error profile for the user.

    For now this is a simple heuristic based on reading_sessions.
    Later you can replace it with a dedicated Encore endpoint.
    
    Args:
        user_id: The user ID
        
    Returns:
        Dictionary with:
        {
            "userId": int,
            "overallAccuracy": float,
            "totalSessions": int,
            "totalQuestions": int,
            "totalCorrect": int,
            "notes": str
        }
        
    Raises:
        ReadingDataError: If fetch fails
    """
    logger.info(f"Fetching error profile: user_id={user_id}")
    
    async with httpx.AsyncClient(base_url=IELTS_BACKEND_URL) as client:
        # Reuse existing summary endpoint: /users/:userId/reading/sessions
        data = await _get_json(client, f"/users/{user_id}/reading/sessions")

    sessions = data.get("sessions", [])

    total = 0
    total_correct = 0
    
    for s in sessions:
        total += s.get("totalQuestions", 0)
        total_correct += s.get("score", 0)

    accuracy = (total_correct / total) if total else 0.0

    return {
        "userId": user_id,
        "overallAccuracy": round(accuracy, 3),
        "totalSessions": len(sessions),
        "totalQuestions": total,
        "totalCorrect": total_correct,
        # You can later extend this with per-question-type breakdowns
        "notes": (
            "Placeholder error profile based on reading_sessions summary. "
            "Can be enhanced with question-type-specific analytics."
        ),
    }

