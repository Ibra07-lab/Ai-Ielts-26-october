# IELTS Reading MCP Server - Setup & Testing Guide

This guide covers setting up and testing the Model Context Protocol (MCP) server for OpenAI integration.

## Overview

The MCP server exposes 5 data retrieval tools that OpenAI can call to generate personalized IELTS Reading feedback:

1. **get_passage** - Retrieve a reading passage from a test
2. **get_question** - Get specific question details
3. **get_correct_answer** - Get the correct answer for a question
4. **get_student_answer** - Get student's submitted answer
5. **get_error_profile** - Get user's error patterns and accuracy

## Prerequisites

1. **Python 3.11+** installed
2. **Encore backend running** on `http://localhost:4000`
3. **OpenAI API key** (for production use with OpenAI)

## Installation

### 1. Install Dependencies

```bash
cd backend/agents
pip install -r requirements.txt
```

This will install:
- MCP SDK (`mcp>=1.0.0`)
- httpx for HTTP requests
- All existing dependencies

### 2. Configure Environment Variables

Copy the template and edit values:

```bash
cp env.template .env
```

Edit `.env` and set:

```bash
# Required: OpenAI API key (if using with OpenAI)
OPENAI_API_KEY=sk-your-actual-api-key

# Required: Encore backend URL
IELTS_BACKEND_URL=http://localhost:4000

# Optional: Model configuration
OPENAI_MODEL=gpt-4o-mini
TEMPERATURE=0.2
```

## Testing

### Step 1: Test Individual Tools

First, verify each MCP tool works independently:

```bash
# Make sure Encore backend is running first!
cd backend/agents
python test_mcp_tools.py
```

Expected output:
```
================================================================================
IELTS Reading MCP Tools - Test Suite
================================================================================
Backend URL: http://localhost:4000

================================================================================
TEST 1: get_passage(test_id=1, passage_id=1)
================================================================================
✓ Success! Retrieved passage: The Silk Road: Pathways of Trade...
  - ID: 1
  - Level: academic
  - Estimated Time: 20 minutes
  - Paragraphs: 4
  - Question Groups: 2

... (more tests)

================================================================================
TEST SUMMARY
================================================================================
✓ PASS   - get_passage
✓ PASS   - get_question
✓ PASS   - get_correct_answer
⚠ PASS   - get_student_answer (may have no data)
⚠ PASS   - get_error_profile (may have no data)

Total: 5/5 tests passed

✓ All tests passed! MCP tools are ready.
```

**Note**: Tests 4 and 5 may show "no data" warnings if:
- No student has submitted test answers yet
- The database has no user sessions

This is expected and not an error.

### Step 2: Test MCP Server Startup

Verify the MCP server can start without errors:

```bash
cd backend/agents
python mcp_server.py
```

Expected behavior:
- Server starts and waits for stdin/stdout communication
- No errors displayed
- Press `Ctrl+C` to stop

If you see errors:
- Check that MCP SDK is installed: `pip list | grep mcp`
- Verify `.env` file exists with `IELTS_BACKEND_URL` set
- Ensure `reading_mcp_tools.py` has no syntax errors

## OpenAI Integration

### Register MCP Server in OpenAI

1. **Go to OpenAI Platform** → Apps/Agents section

2. **Add MCP Server**:
   - **Type**: stdio
   - **Command**: `python backend/agents/mcp_server.py`
   - **Working Directory**: `/path/to/Ai-Ielts-26-october-10`
   - **Server Name**: `ielts-reading`

3. **Configure Agent System Prompt**:
   ```
   You are an IELTS Reading examiner.
   Explain strictly based on the passage.
   Do not assume information.
   
   When analyzing incorrect answers:
   1. Quote the relevant passage evidence
   2. Explain why the student's choice is wrong
   3. Identify the mistake pattern (e.g., confusing "False" with "Not Given")
   4. Provide a strategy tip for this question type
   5. Personalize advice based on the user's error profile
   ```

4. **Tool Discovery**: OpenAI will auto-discover the 5 tools via MCP

### Example Usage Flow

**User Action**: Click "Get Deeper Feedback" on Question 13

**Request to OpenAI**:
```json
{
  "user_id": 123,
  "test_id": 1,
  "passage_id": 2,
  "question_id": 13,
  "prompt": "Explain why my answer is wrong"
}
```

**OpenAI Process**:
1. Calls MCP tools:
   - `get_passage(1, 2)`
   - `get_question(1, 2, 13)`
   - `get_correct_answer(1, 2, 13)`
   - `get_student_answer(123, 1, 2, 13)`
   - `get_error_profile(123)`

2. Receives all data

3. Generates structured response:
```json
{
  "verdict": "INCORRECT",
  "correctAnswer": "NOT GIVEN",
  "whyStudentIsWrong": {
    "reason": "The passage does not state whether most farmers currently use organic methods.",
    "studentMistakePattern": "Confusing absence of information with contradiction"
  },
  "evidence": {
    "quote": "While some farmers have switched to organic methods...",
    "analysis": "This sentence does not say that most farmers use organic farming."
  },
  "strategyTip": {
    "name": "NG Detection Rule",
    "steps": [
      "If the passage does not clearly confirm or deny → NOT GIVEN",
      "Do not infer trends or assume change over time"
    ]
  },
  "personalizedAdvice": "You often choose FALSE when information is missing (65% accuracy on NG questions). Slow down and ask: is the opposite stated?"
}
```

## Troubleshooting

### "Module 'mcp' not found"
```bash
pip install mcp>=1.0.0
```

### "IELTS_BACKEND_URL not set"
```bash
# Create .env file from template
cp env.template .env
# Edit .env and set IELTS_BACKEND_URL=http://localhost:4000
```

### "Connection refused" errors in tests
- Ensure Encore backend is running: `encore run` in project root
- Verify backend is accessible at `http://localhost:4000`
- Check firewall/port settings

### "No session found for user/test/passage"
This is expected if:
- The user hasn't submitted that test yet
- Database has no session records

To fix: Have a user complete a test in the frontend first.

### MCP Server won't start
1. Check Python version: `python --version` (needs 3.11+)
2. Check for syntax errors: `python -m py_compile mcp_server.py`
3. Check imports: `python -c "from reading_mcp_tools import get_passage"`
4. Check MCP SDK version: `pip show mcp`

## Architecture

```
┌──────────────┐
│  Frontend UI │
└──────┬───────┘
       │ Request: user_id, test_id, passage_id, question_id
       ▼
┌──────────────┐
│  OpenAI API  │
└──────┬───────┘
       │ Call MCP Tools
       ▼
┌──────────────┐
│  MCP Server  │ ◄─── mcp_server.py (stdio)
│  (Python)    │
└──────┬───────┘
       │ Uses
       ▼
┌──────────────┐
│   Tools      │ ◄─── reading_mcp_tools.py
│  Functions   │      (5 async functions)
└──────┬───────┘
       │ HTTP Requests
       ▼
┌──────────────┐
│    Encore    │ ◄─── backend/ielts/reading.ts
│   Backend    │
└──────┬───────┘
       │ SQL Queries
       ▼
┌──────────────┐
│  PostgreSQL  │
│   Database   │
└──────────────┘
```

## Files Created

- **`reading_mcp_tools.py`** - 5 async data retrieval functions
- **`mcp_server.py`** - MCP stdio server for OpenAI
- **`test_mcp_tools.py`** - Test script for tools
- **`MCP_SETUP.md`** - This file

## Files Modified

- **`requirements.txt`** - Added `mcp>=1.0.0`
- **`env.template`** - Added `IELTS_BACKEND_URL`
- **`backend/ielts/reading.ts`** - Added `getLatestReadingSession` endpoint

## Next Steps

1. ✅ Complete testing with `test_mcp_tools.py`
2. ✅ Verify MCP server starts without errors
3. Register MCP server in OpenAI platform
4. Test end-to-end flow with real user questions
5. Monitor OpenAI tool call logs for debugging
6. Add authentication/rate limiting for production

## Notes

- The MCP SDK API may vary; consult official docs at `github.com/modelcontextprotocol`
- Consider caching passage data to reduce Encore API calls
- Add structured logging in production for debugging
- Monitor OpenAI API usage costs

## Support

For issues:
1. Check test output: `python test_mcp_tools.py`
2. Check server logs when running `mcp_server.py`
3. Verify Encore backend endpoints are accessible
4. Review OpenAI platform MCP server logs

