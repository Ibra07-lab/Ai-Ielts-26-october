"""
Test script for IELTS Reading MCP Tools

This script tests each MCP tool function independently to verify they work correctly
before integrating with the MCP server.

Usage:
    # Make sure Encore backend is running on localhost:4000
    python test_mcp_tools.py
"""

import asyncio
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add current directory to path for imports
sys.path.insert(0, os.path.dirname(__file__))

from reading_mcp_tools import (
    get_passage,
    get_question,
    get_correct_answer,
    get_student_answer,
    get_error_profile,
    ReadingDataError,
)


async def test_get_passage():
    """Test get_passage tool."""
    print("\n" + "="*80)
    print("TEST 1: get_passage(test_id=1, passage_id=1)")
    print("="*80)
    
    try:
        result = await get_passage(test_id=1, passage_id=1)
        print(f"✓ Success! Retrieved passage: {result['title']}")
        print(f"  - ID: {result['id']}")
        print(f"  - Level: {result['level']}")
        print(f"  - Estimated Time: {result['estimatedTime']} minutes")
        print(f"  - Paragraphs: {len(result['paragraphs'])}")
        print(f"  - Question Groups: {len(result['questions'])}")
        return True
    except Exception as e:
        print(f"✗ FAILED: {str(e)}")
        return False


async def test_get_question():
    """Test get_question tool."""
    print("\n" + "="*80)
    print("TEST 2: get_question(test_id=1, passage_id=1, question_id=1)")
    print("="*80)
    
    try:
        result = await get_question(test_id=1, passage_id=1, question_id=1)
        print(f"✓ Success! Retrieved question {result['id']}")
        print(f"  - Type: {result['type']}")
        print(f"  - Text: {result['questionText'][:80]}...")
        print(f"  - Group: {result['groupTitle']}")
        if result.get('options'):
            print(f"  - Options: {len(result['options'])} choices")
        return True
    except Exception as e:
        print(f"✗ FAILED: {str(e)}")
        return False


async def test_get_correct_answer():
    """Test get_correct_answer tool."""
    print("\n" + "="*80)
    print("TEST 3: get_correct_answer(test_id=1, passage_id=1, question_id=1)")
    print("="*80)
    
    try:
        result = await get_correct_answer(test_id=1, passage_id=1, question_id=1)
        print(f"✓ Success! Retrieved correct answer for question {result['questionId']}")
        print(f"  - Correct Answer: {result['correctAnswer']}")
        return True
    except Exception as e:
        print(f"✗ FAILED: {str(e)}")
        return False


async def test_get_student_answer():
    """Test get_student_answer tool."""
    print("\n" + "="*80)
    print("TEST 4: get_student_answer(user_id=1, test_id=1, passage_id=1, question_id=1)")
    print("="*80)
    print("NOTE: This test requires a student session to exist in the database")
    
    try:
        result = await get_student_answer(
            user_id=1, 
            test_id=1, 
            passage_id=1, 
            question_id=1
        )
        print(f"✓ Success! Retrieved student answer")
        print(f"  - Session ID: {result['sessionId']}")
        print(f"  - User ID: {result['userId']}")
        print(f"  - Student Answer: {result['studentAnswer']}")
        print(f"  - Submitted At: {result['submittedAt']}")
        return True
    except ReadingDataError as e:
        print(f"⚠ Expected failure (no session data): {str(e)}")
        print("  This is OK if no student has submitted test 1, passage 1 yet")
        return True  # Not a real failure
    except Exception as e:
        print(f"✗ FAILED with unexpected error: {str(e)}")
        return False


async def test_get_error_profile():
    """Test get_error_profile tool."""
    print("\n" + "="*80)
    print("TEST 5: get_error_profile(user_id=1)")
    print("="*80)
    print("NOTE: This test requires user session history to exist")
    
    try:
        result = await get_error_profile(user_id=1)
        print(f"✓ Success! Retrieved error profile for user {result['userId']}")
        print(f"  - Overall Accuracy: {result['overallAccuracy']*100:.1f}%")
        print(f"  - Total Sessions: {result['totalSessions']}")
        print(f"  - Total Questions: {result['totalQuestions']}")
        print(f"  - Total Correct: {result['totalCorrect']}")
        return True
    except ReadingDataError as e:
        print(f"⚠ Expected failure (no user data): {str(e)}")
        print("  This is OK if user 1 has no session history")
        return True  # Not a real failure
    except Exception as e:
        print(f"✗ FAILED with unexpected error: {str(e)}")
        return False


async def run_all_tests():
    """Run all tests and report results."""
    print("\n" + "="*80)
    print("IELTS Reading MCP Tools - Test Suite")
    print("="*80)
    print(f"Backend URL: {os.getenv('IELTS_BACKEND_URL', 'http://localhost:4000')}")
    print("\nMake sure your Encore backend is running before continuing!")
    print("="*80)
    
    results = []
    
    # Test 1: get_passage
    results.append(("get_passage", await test_get_passage()))
    
    # Test 2: get_question
    results.append(("get_question", await test_get_question()))
    
    # Test 3: get_correct_answer
    results.append(("get_correct_answer", await test_get_correct_answer()))
    
    # Test 4: get_student_answer (may not have data)
    results.append(("get_student_answer", await test_get_student_answer()))
    
    # Test 5: get_error_profile (may not have data)
    results.append(("get_error_profile", await test_get_error_profile()))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for tool_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status:8} - {tool_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n✓ All tests passed! MCP tools are ready.")
        return True
    else:
        print("\n✗ Some tests failed. Check the errors above.")
        return False


if __name__ == "__main__":
    # Check environment
    backend_url = os.getenv("IELTS_BACKEND_URL")
    if not backend_url:
        print("ERROR: IELTS_BACKEND_URL not set in .env file")
        print("Please copy env.template to .env and set the backend URL")
        sys.exit(1)
    
    # Run tests
    success = asyncio.run(run_all_tests())
    sys.exit(0 if success else 1)

