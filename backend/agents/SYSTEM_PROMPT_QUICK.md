# Step 3: System Prompt Setup - Quick Guide

## What You Just Got

I've created 3 files to help you with Step 3 (System Prompt Configuration):

### 1. `SYSTEM_PROMPT.md` - Full Documentation
- Complete system prompt with all instructions
- Question-type specific guidance
- Error pattern identification
- Response format specification
- Examples for each scenario
- Testing checklist

### 2. `openai_config.json` - Ready-to-Use Configuration
- Drop-in configuration for OpenAI platform
- Pre-configured with optimal settings
- Includes MCP server connection details
- JSON format for easy import

### 3. `openai_agent_example.py` - Code Example
- Python script showing programmatic usage
- Uses OpenAI Agents SDK
- Example of calling "Get Deeper Feedback"
- Can be integrated into your backend

## Quick Setup Options

### Option A: OpenAI Platform (Web Interface)

**Best for**: Testing and manual configuration

1. Go to: https://platform.openai.com/assistants
2. Click "Create Assistant"
3. Fill in:
   - **Name**: IELTS Reading Examiner
   - **Model**: gpt-4-turbo-preview
   - **Instructions**: Copy from `SYSTEM_PROMPT.md` (Enhanced version)
   - **Tools**: Add MCP Server
     - Type: stdio
     - Command: `python backend/agents/mcp_server.py`
     - Working Dir: `C:\Users\Honor\Ai-Ielts-26-october-10`
4. Save and test

### Option B: OpenAI API (Programmatic)

**Best for**: Production integration

```python
import openai

client = openai.OpenAI(api_key="your-key")

assistant = client.beta.assistants.create(
    name="IELTS Reading Examiner",
    instructions=open('backend/agents/SYSTEM_PROMPT.md').read(),
    model="gpt-4-turbo-preview",
    tools=[{
        "type": "function",
        # MCP tools will be auto-discovered
    }]
)
```

### Option C: OpenAI Agents SDK

**Best for**: Advanced integration with MCP

```bash
pip install openai-agents
python backend/agents/openai_agent_example.py
```

## The System Prompt in Action

### Input Flow:
```
Student clicks "Get Deeper Feedback" on Q13
         ↓
Frontend calls OpenAI API with:
  - user_id: 123
  - test_id: 1
  - passage_id: 2
  - question_id: 13
         ↓
OpenAI reads System Prompt (your instructions)
         ↓
OpenAI calls MCP tools:
  • get_passage(1, 2)
  • get_question(1, 2, 13)
  • get_correct_answer(1, 2, 13)
  • get_student_answer(123, 1, 2, 13)
  • get_error_profile(123)
         ↓
OpenAI generates structured feedback
following System Prompt rules
         ↓
Returns JSON to frontend
```

### Output Example:
```json
{
  "verdict": "INCORRECT",
  "correctAnswer": "NOT GIVEN",
  "whyStudentIsWrong": {
    "reason": "The passage doesn't state whether...",
    "studentMistakePattern": "False vs Not Given confusion"
  },
  "evidence": {
    "quote": "While some farmers have switched...",
    "analysis": "This tells us the current state, not trends"
  },
  "strategyTip": {
    "name": "TFNG Decision Tree",
    "steps": [...]
  },
  "personalizedAdvice": "You often choose FALSE when info is missing (65% on NG). Remember: FALSE = opposite stated, NOT GIVEN = no info either way."
}
```

## Key Features of This System Prompt

✅ **Evidence-Based**: Always quotes exact passage text
✅ **Pattern Recognition**: Identifies WHY student made the mistake
✅ **Strategic**: Teaches how to approach similar questions
✅ **Personalized**: Uses error_profile for targeted advice
✅ **Structured**: Consistent JSON output format
✅ **IELTS-Specific**: Follows official assessment criteria

## Testing Your Setup

### Test Case 1: Correct Answer
**Expected**: Positive reinforcement + brief explanation

### Test Case 2: TFNG - FALSE Chosen (Correct: NOT GIVEN)
**Expected**: Explains difference between FALSE and NOT GIVEN

### Test Case 3: Matching Headings - Keyword Match Error
**Expected**: Teaches main idea vs keyword matching

### Test Case 4: No Error Profile Data
**Expected**: Still provides feedback, skips personalization

## Customization Tips

### Make it Stricter:
Add to prompt: "Never accept partial answers. Only mark correct if exactly matching the passage."

### Make it More Encouraging:
Add to prompt: "Always start with positive reinforcement before correction."

### Add More Question Types:
Extend the "Question Type Specific Guidance" section with:
- Diagram labeling strategies
- Flow chart completion techniques
- Table completion approaches

### Adjust Tone:
- **For beginners**: "Use simple, clear language. Avoid technical terms."
- **For advanced**: "Use IELTS terminology and reference band descriptors."

## Troubleshooting

### "Feedback is too generic"
→ Ensure MCP tools are returning correct data
→ Check error_profile is being used

### "Not providing evidence quotes"
→ Strengthen "Step 3: Provide Evidence" in prompt
→ Add: "You MUST quote exact text"

### "Wrong mistake pattern identification"
→ Add more examples in prompt
→ Expand "Mistake Pattern" section

### "JSON format inconsistent"
→ Add to prompt: "Always return valid JSON. Never deviate."
→ Use `response_format: {"type": "json_object"}` in API call

## Next Steps After Setup

1. **Test with real questions** from your test bank
2. **Monitor feedback quality** - collect student ratings
3. **Iterate on prompt** based on actual usage
4. **A/B test** different prompt variations
5. **Expand patterns** as you discover new mistake types

## Files Created

📄 `backend/agents/SYSTEM_PROMPT.md` - Full documentation
📄 `backend/agents/openai_config.json` - Configuration template  
📄 `backend/agents/openai_agent_example.py` - Code example
📄 `backend/agents/SYSTEM_PROMPT_QUICK.md` - This guide

## Ready to Use! ✅

Your system prompt configuration is complete. Choose your integration method (Platform, API, or SDK) and start testing!

---

**Pro Tip**: Start with Option A (Web Interface) for testing, then move to Option B or C for production integration.

