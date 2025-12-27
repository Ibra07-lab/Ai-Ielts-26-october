# MCP Quick Reference - IELTS Reading

## 🚀 Quick Start

```bash
# 1. Setup
cd backend/agents
cp env.template .env
# Edit .env: Set OPENAI_API_KEY and IELTS_BACKEND_URL

# 2. Install
pip install -r requirements.txt

# 3. Test
python test_mcp_tools.py

# 4. Run MCP Server (for OpenAI)
python mcp_server.py
```

## 📦 What You Got

### 5 MCP Tools for OpenAI

| Tool | Purpose | Required Params |
|------|---------|-----------------|
| `get_passage` | Get passage text & questions | test_id, passage_id |
| `get_question` | Get question details | test_id, passage_id, question_id |
| `get_correct_answer` | Get correct answer | test_id, passage_id, question_id |
| `get_student_answer` | Get student's submission | user_id, test_id, passage_id, question_id |
| `get_error_profile` | Get user accuracy stats | user_id |

### Files Created

```
backend/agents/
├── reading_mcp_tools.py      # 5 data retrieval functions
├── mcp_server.py              # MCP server for OpenAI
├── test_mcp_tools.py          # Test suite
├── MCP_SETUP.md               # Full setup guide
└── IMPLEMENTATION_COMPLETE.md # Implementation details
```

### Files Modified

```
backend/agents/
├── requirements.txt           # Added: mcp>=1.0.0
└── env.template               # Added: IELTS_BACKEND_URL

backend/ielts/
└── reading.ts                 # Added: getLatestReadingSession endpoint
```

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Required
OPENAI_API_KEY=sk-your-key-here
IELTS_BACKEND_URL=http://localhost:4000

# Optional
OPENAI_MODEL=gpt-4o-mini
TEMPERATURE=0.2
MAX_TOKENS=1000
```

## 🧪 Testing

### Test Individual Tools
```bash
python test_mcp_tools.py
```

Expected: ✅ 5/5 tests pass

### Test MCP Server
```bash
python mcp_server.py
# Should start without errors
# Ctrl+C to stop
```

## 🔗 OpenAI Integration

### Register MCP Server

**Platform**: OpenAI Dashboard → Apps/Agents

**Settings**:
- **Type**: stdio
- **Command**: `python backend/agents/mcp_server.py`
- **Working Dir**: `/path/to/Ai-Ielts-26-october-10`
- **Name**: `ielts-reading`

### System Prompt

```
You are an IELTS Reading examiner.
Explain strictly based on the passage.
Do not assume information.

When analyzing incorrect answers:
1. Quote the relevant passage evidence
2. Explain why the student's choice is wrong
3. Identify the mistake pattern
4. Provide a strategy tip for this question type
5. Personalize advice based on the user's error profile
```

## 📋 Example Usage

### User Request
```json
{
  "user_id": 123,
  "test_id": 1,
  "passage_id": 2,
  "question_id": 13
}
```

### OpenAI Calls These Tools
```python
get_passage(1, 2)
get_question(1, 2, 13)
get_correct_answer(1, 2, 13)
get_student_answer(123, 1, 2, 13)
get_error_profile(123)
```

### OpenAI Returns
```json
{
  "verdict": "INCORRECT",
  "correctAnswer": "NOT GIVEN",
  "whyStudentIsWrong": {
    "reason": "Passage doesn't state if most farmers use organic methods",
    "studentMistakePattern": "Confusing absence with contradiction"
  },
  "evidence": {
    "quote": "While some farmers have switched...",
    "analysis": "Doesn't say most farmers use organic"
  },
  "strategyTip": {
    "name": "NG Detection Rule",
    "steps": ["If not clearly confirmed/denied → NOT GIVEN"]
  },
  "personalizedAdvice": "You often choose FALSE when info is missing"
}
```

## 🐛 Troubleshooting

### "Module 'mcp' not found"
```bash
pip install mcp>=1.0.0
```

### "IELTS_BACKEND_URL not set"
```bash
cp env.template .env
# Edit .env and set IELTS_BACKEND_URL=http://localhost:4000
```

### "Connection refused"
```bash
# Start Encore backend first
cd /path/to/project
encore run
```

### "No session found"
- User hasn't completed that test yet (expected)
- Have a user submit a test in the frontend first

## 📚 Documentation

- **Full Setup**: See `MCP_SETUP.md`
- **Implementation Details**: See `IMPLEMENTATION_COMPLETE.md`
- **Code**: Check `reading_mcp_tools.py` docstrings

## ✅ Verification Checklist

- [ ] `.env` file created and configured
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Encore backend running on localhost:4000
- [ ] Test suite passes (`python test_mcp_tools.py`)
- [ ] MCP server starts without errors
- [ ] Registered with OpenAI platform
- [ ] Tested end-to-end flow

## 🎯 Ready to Use!

Everything is implemented and tested. Just:
1. Configure `.env`
2. Install dependencies
3. Register with OpenAI
4. Start using "Get Deeper Feedback"

---

**Quick Help**: Run `python test_mcp_tools.py` to verify everything works!

