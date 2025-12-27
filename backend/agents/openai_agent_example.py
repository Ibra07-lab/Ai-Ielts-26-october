"""
Example: Using IELTS Reading MCP Server with OpenAI Agents SDK

This script shows how to integrate the MCP server with OpenAI's Agents SDK
for programmatic access to the "Get Deeper Feedback" functionality.

Prerequisites:
    pip install openai-agents
    
Usage:
    python openai_agent_example.py
"""

import os
from openai_agents import Agent
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# System prompt for IELTS Reading Examiner
SYSTEM_PROMPT = """You are an expert IELTS Reading examiner with deep knowledge of all 14 IELTS Reading question types and common student mistakes.

## Core Principles
1. Explain strictly based on the passage - never infer or assume information
2. Quote exact evidence from the passage to support all explanations
3. Identify the specific cognitive mistake the student made
4. Provide actionable strategies, not just corrections
5. Use the student's error profile to personalize advice

## When Analyzing Incorrect Answers

### Step 1: State the Verdict
- Clearly indicate CORRECT or INCORRECT
- State the correct answer

### Step 2: Explain Why Student is Wrong
Identify the mistake pattern (over-inference, false vs not given confusion, etc.)

### Step 3: Provide Evidence
- Quote exact sentences from passage
- Explain what the quote means

### Step 4: Give Strategy Tips
Provide question-type specific strategies

### Step 5: Personalize Advice
Use error_profile to provide targeted advice

## Response Format
Always return JSON with: verdict, correctAnswer, whyStudentIsWrong, evidence, strategyTip, personalizedAdvice
"""


def create_ielts_reading_agent():
    """
    Create an OpenAI agent with MCP server for IELTS Reading feedback.
    
    Returns:
        Agent instance configured with MCP tools
    """
    # Note: Adjust the command path based on your system
    agent = Agent(
        name="IELTS Reading Examiner",
        instructions=SYSTEM_PROMPT,
        model="gpt-4-turbo-preview",
        mcp_servers=[
            {
                "name": "ielts-reading",
                "transport": "stdio",
                "command": "python",
                "args": ["backend/agents/mcp_server.py"],
                # Adjust working_directory to your project path
                "working_directory": os.getcwd()
            }
        ],
        temperature=0.3,
    )
    
    return agent


async def get_deeper_feedback(
    agent: Agent,
    user_id: int,
    test_id: int,
    passage_id: int,
    question_id: int,
    prompt: str = "Explain why my answer is wrong and how to improve"
):
    """
    Get deeper feedback for a specific question using the agent.
    
    Args:
        agent: The OpenAI Agent instance
        user_id: Student user ID
        test_id: Test number
        passage_id: Passage number within test
        question_id: Question number
        prompt: User's request for feedback
        
    Returns:
        Structured feedback JSON
    """
    # Create the conversation context
    message = f"""Please analyze this student's answer:

User ID: {user_id}
Test: {test_id}
Passage: {passage_id}
Question: {question_id}

Request: {prompt}

Use the MCP tools to:
1. Get the passage content
2. Get the question details
3. Get the correct answer
4. Get the student's submitted answer
5. Get the student's error profile

Then provide detailed feedback following the response format.
"""
    
    # Run the agent
    response = await agent.run(message)
    
    return response


# Example usage
if __name__ == "__main__":
    import asyncio
    import json
    
    async def main():
        print("Creating IELTS Reading Examiner agent...")
        agent = create_ielts_reading_agent()
        
        print("Getting deeper feedback for Question 13...")
        feedback = await get_deeper_feedback(
            agent=agent,
            user_id=1,
            test_id=1,
            passage_id=2,
            question_id=13,
            prompt="Explain why my answer is wrong"
        )
        
        print("\n" + "="*80)
        print("FEEDBACK RESPONSE")
        print("="*80)
        print(json.dumps(feedback, indent=2))
    
    # Run the async main function
    asyncio.run(main())

