"""
Simple test script for IELTS Reading Feedback Agent.

This script tests the agent with sample data to verify functionality.
Run with: python test_agent.py
"""

import asyncio
import json
from reading_feedback_agent import (
    ReadingFeedbackAgent,
    FeedbackInput,
    create_reading_feedback_agent
)

# Test data
SAMPLE_PASSAGE = """
The Industrial Revolution, which began in Britain in the late 18th century, marked a major turning point in human history. Previous to this period, manufacturing was often done in people's homes, using hand tools or basic machines. The Industrial Revolution introduced new manufacturing processes, including the transition to new chemical manufacturing and iron production processes, the increasing use of steam power and water power, the development of machine tools and the rise of the mechanized factory system. The revolution also brought about a massive increase in population and urbanization, as people moved from rural areas to cities in search of factory work. This transformation had profound effects on economic, social, and cultural conditions, fundamentally changing the way people lived and worked. The textile industry was one of the first to adopt these new methods, with innovations such as the spinning jenny and the power loom dramatically increasing production capacity. While the Industrial Revolution brought economic growth and technological advancement, it also created new social problems, including poor working conditions in factories, child labor, and increased pollution in industrial cities.
"""

# Test cases
TEST_CASES = [
    {
        "name": "Correct Answer - Paraphrased",
        "input": FeedbackInput(
            passage=SAMPLE_PASSAGE,
            question="According to the passage, when did the Industrial Revolution begin?",
            question_type="Short Answer Questions",
            correct_answer="late 18th century",
            student_answer="late 1700s"
        )
    },
    {
        "name": "Incorrect Answer",
        "input": FeedbackInput(
            passage=SAMPLE_PASSAGE,
            question="According to the passage, when did the Industrial Revolution begin?",
            question_type="Short Answer Questions",
            correct_answer="late 18th century",
            student_answer="early 19th century"
        )
    },
    {
        "name": "True/False/Not Given - True",
        "input": FeedbackInput(
            passage=SAMPLE_PASSAGE,
            question="The textile industry was among the first to adopt Industrial Revolution methods.",
            question_type="True/False/Not Given",
            correct_answer="True",
            student_answer="True"
        )
    },
    {
        "name": "True/False/Not Given - Incorrect",
        "input": FeedbackInput(
            passage=SAMPLE_PASSAGE,
            question="The Industrial Revolution began in France.",
            question_type="True/False/Not Given",
            correct_answer="False",
            student_answer="Not Given"
        )
    },
    {
        "name": "Multiple Choice",
        "input": FeedbackInput(
            passage=SAMPLE_PASSAGE,
            question="What was a consequence of the Industrial Revolution mentioned in the passage?",
            question_type="Multiple Choice",
            correct_answer="Increased urbanization as people moved to cities",
            student_answer="Increased urbanization as people moved to cities"
        )
    }
]


async def test_agent():
    """Test the feedback agent with sample cases."""
    
    print("=" * 80)
    print("IELTS Reading Feedback Agent - Test Suite")
    print("=" * 80)
    print()
    
    # Create agent
    try:
        print("Initializing agent...")
        agent = create_reading_feedback_agent()
        print("✓ Agent initialized successfully\n")
    except Exception as e:
        print(f"✗ Failed to initialize agent: {str(e)}")
        print("\nMake sure OPENAI_API_KEY is set in your .env file")
        return
    
    # Run test cases
    results = []
    for i, test_case in enumerate(TEST_CASES, 1):
        print(f"Test Case {i}/{len(TEST_CASES)}: {test_case['name']}")
        print("-" * 80)
        
        try:
            # Generate feedback
            feedback = await agent.generate_feedback(test_case['input'])
            
            # Display results
            print(f"Question: {test_case['input'].question}")
            print(f"Question Type: {test_case['input'].question_type}")
            print(f"Correct Answer: {test_case['input'].correct_answer}")
            print(f"Student Answer: {test_case['input'].student_answer}")
            print()
            print(f"✓ Is Correct: {feedback.is_correct}")
            print(f"Confidence: {feedback.confidence}")
            print()
            print("Feedback:")
            print(f"  {feedback.feedback}")
            print()
            print("Reasoning:")
            for line in feedback.reasoning.split('\n'):
                print(f"  {line}")
            print()
            print("Strategy Tip:")
            print(f"  {feedback.strategy_tip}")
            print()
            print("Passage Reference:")
            print(f"  \"{feedback.passage_reference}\"")
            print()
            
            results.append({
                "test_case": test_case['name'],
                "status": "PASS",
                "is_correct": feedback.is_correct
            })
            
        except Exception as e:
            print(f"✗ Error: {str(e)}")
            print()
            results.append({
                "test_case": test_case['name'],
                "status": "FAIL",
                "error": str(e)
            })
        
        print("=" * 80)
        print()
    
    # Summary
    print("\nTest Summary:")
    print("-" * 80)
    passed = sum(1 for r in results if r['status'] == 'PASS')
    failed = sum(1 for r in results if r['status'] == 'FAIL')
    print(f"Total: {len(results)}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print()
    
    for result in results:
        status_symbol = "✓" if result['status'] == 'PASS' else "✗"
        print(f"{status_symbol} {result['test_case']}: {result['status']}")
        if result['status'] == 'FAIL':
            print(f"  Error: {result.get('error', 'Unknown error')}")
    
    print()


def test_agent_sync():
    """Synchronous test of the agent."""
    
    print("=" * 80)
    print("IELTS Reading Feedback Agent - Synchronous Test")
    print("=" * 80)
    print()
    
    try:
        print("Initializing agent...")
        agent = create_reading_feedback_agent()
        print("✓ Agent initialized successfully\n")
        
        # Test with first case
        test_case = TEST_CASES[0]
        print(f"Testing: {test_case['name']}")
        print("-" * 80)
        
        feedback = agent.generate_feedback_sync(test_case['input'])
        
        print(f"✓ Is Correct: {feedback.is_correct}")
        print(f"Feedback: {feedback.feedback}")
        print()
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        print("\nMake sure OPENAI_API_KEY is set in your .env file")


if __name__ == "__main__":
    import sys
    from dotenv import load_dotenv
    
    # Load environment variables
    load_dotenv()
    
    # Check for sync flag
    if len(sys.argv) > 1 and sys.argv[1] == "--sync":
        test_agent_sync()
    else:
        # Run async tests
        asyncio.run(test_agent())

