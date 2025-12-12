# Educational Requests Update - Teaching vs Practice Detection

## Problem
ALEX was too focused on generating practice passages and didn't recognize when students wanted **theoretical explanations with concrete examples** instead of practice. When students asked questions like "show me the logic when doing t/f/ng with examples," ALEX would keep asking to generate passages instead of teaching the concepts.

## Root Causes
1. **Router didn't detect teaching requests**: No logic to distinguish "teach me" from "test me"
2. **Examples always pushed for practice**: Every flow ended with "Would you like to try a practice passage?"
3. **No concrete examples in responses**: Strategies were too abstract without real T/F/NG examples

## Solution Overview
Enhanced ALEX to distinguish between three types of requests:
- **Educational requests** → Provide theory + concrete examples
- **Practice requests** → Generate passages
- **Problem mentions** → Ask if they want explanation or practice

---

## Changes Made

### 1. **Router Logic Update** (`app/prompts/tutor_router.txt`)

#### Added Rule 9: EDUCATIONAL/TEACHING REQUESTS DETECTION

Detects when students want to LEARN rather than PRACTICE:

**Educational Keywords Detected:**
- "show me", "explain", "teach me"
- "what's the logic", "how do I approach", "what's the strategy"
- "give me examples", "demonstrate", "walk me through"
- "how should I think", "how does it work"
- "what's the method", "what's the process"
- "with examples", "step by step", "the logic"

**Routing Decision:**
- Routes to `ANSWER_GENERAL_QUESTION` with `target_skill` set to the topic
- Sets high confidence (>0.8) for educational requests
- **PRIORITY**: Educational requests override practice requests

**Example Routing:**
```
User: "show me the logic when doing t/f/ng with examples"
→ Action: ANSWER_GENERAL_QUESTION
→ Parameters: {target_skill: "tfng"}
→ Confidence: 0.85
```

#### Renumbered Existing Rules
- Old rule 9 → New rule 10
- Old rule 10 → New rule 11
- Old rule 11 → New rule 12
- Old rule 12 → New rule 13
- Old rule 13 → New rule 14

### 2. **Agent Behavior Update** (`app/services/agent_service.py`)

#### Replaced "CRITICAL PRACTICE FLOW" with "EDUCATIONAL REQUESTS VS PRACTICE REQUESTS"

**For Educational Requests (teach me):**
1. Provide clear explanation with 2-3 CONCRETE EXAMPLES
2. Use simple language, break down step-by-step
3. DON'T immediately push for practice
4. End with: "Does this make sense? Want more examples, or shall we try applying this?"

**For Practice Requests (test me):**
1. Acknowledge briefly
2. Ask for level immediately
3. Generate practice passage

**For Problem Mentions (I struggle with X):**
1. Acknowledge issue (1 sentence)
2. Give quick strategy (2-3 sentences)
3. Ask: "Would you like more explanation with examples, or jump straight into practice?"
4. Wait for response

#### Updated Example Flows with Concrete T/F/NG Examples

**Added TEACHING REQUEST Example:**
```
User: "Can you show me the logic when doing t/f/ng questions with examples?"

ALEX Response:
"Absolutely! Let me break down the T/F/NG logic step-by-step. 🧠

**The Three-Way Decision:**
1. TRUE = Statement matches the passage exactly (or with synonyms/paraphrasing)
2. FALSE = Statement directly contradicts what the passage says
3. NOT GIVEN = The passage doesn't discuss this topic at all

**Example 1 - TRUE:**
📖 Passage: 'The experiment involved 50 participants from local universities.'
📝 Statement: 'Fifty people took part in the study.'
✅ TRUE - Same meaning, just different words

**Example 2 - FALSE:**
📖 Passage: 'The experiment involved 50 participants from local universities.'
📝 Statement: 'The study included participants from international universities.'
❌ FALSE - Direct contradiction! Passage says 'local', statement says 'international'

**Example 3 - NOT GIVEN:**
📖 Passage: 'The experiment involved 50 participants from local universities.'
📝 Statement: 'The experiment was expensive to conduct.'
❓ NOT GIVEN - Cost is never mentioned in the passage at all

The key is comparing ONLY what's written—never use your outside knowledge!

Does this make sense? Want more examples, or shall we try applying this in practice?"
```

**Updated SPECIFIC PROBLEM Example:**
```
User: "I have problem with t/f/ng type of question"

ALEX Response:
"Ah, True/False/Not Given questions! 📝 These can be tricky but totally manageable.

Quick strategy: Read each statement carefully, then scan the passage for that specific information. TRUE means it matches exactly, FALSE means it contradicts the passage, and NOT GIVEN means it's not mentioned at all. The key is NOT using your own knowledge—stick strictly to what's written!

Would you like more explanation with examples, or jump straight into practice?"
```

---

## Behavior Changes

### Before Update ❌
```
Student: "Can you show me the logic for t/f/ng with examples?"
ALEX: "T/F/NG questions test whether statements match the passage.
       Would you like to try a practice passage?"
       
❌ No concrete examples
❌ Immediately pushes for practice
❌ Student doesn't understand the logic yet
```

### After Update ✅
```
Student: "Can you show me the logic for t/f/ng with examples?"
ALEX: [Provides 3 concrete examples with passages and statements]
      "Does this make sense? Want more examples, or shall we try applying this?"
      
✅ Concrete examples with real passages
✅ Asks if they understand before offering practice
✅ Student learns the logic first
```

---

## Request Type Decision Tree

```
Student Message
       ↓
Contains educational keywords?
(show me, explain, teach, logic, examples)
       ↓
   YES ─→ ANSWER_GENERAL_QUESTION
          Provide theory + concrete examples
          End: "Want more examples or practice?"
       ↓
   NO
       ↓
Contains practice keywords?
(give me practice, test me, generate passage)
       ↓
   YES ─→ GENERATE_MICRO_BATTLE
          Ask for level
          Generate practice immediately
       ↓
   NO
       ↓
Mentions problem/struggle?
(I have problem with X)
       ↓
   YES ─→ ANSWER_GENERAL_QUESTION
          Give quick strategy
          Ask: "Explanation or practice?"
          Wait for response
```

---

## Testing Scenarios

### Educational Requests (Should provide theory + examples):
- ✅ "Can you show me the logic when doing t/f/ng?"
- ✅ "Explain matching headings with examples"
- ✅ "Teach me how to approach vocabulary questions"
- ✅ "What's the strategy for timing step by step?"
- ✅ "Demonstrate the process for multiple choice"
- ✅ "Walk me through gap fill questions with examples"

### Practice Requests (Should generate passage immediately):
- ✅ "Give me a practice passage"
- ✅ "Let's try some t/f/ng questions"
- ✅ "Test me on matching headings"
- ✅ "Generate a beginner passage"
- ✅ "I want to practice intermediate level"

### Problem Mentions (Should ask: explanation or practice?):
- ✅ "I have problem with t/f/ng"
- ✅ "I struggle with matching headings"
- ✅ "Timing is difficult for me"
- ✅ "I'm having trouble with vocabulary"

### Vague Requests (Should ask for clarification):
- ✅ "I'm struggling"
- ✅ "I need help"
- ✅ "Can you help me with reading?"

---

## Key Improvements

1. **Smarter Intent Detection**: Router now distinguishes teaching vs testing intent
2. **Concrete Examples**: ALEX provides real passage examples, not just abstract strategies
3. **Student-Centered**: Asks "explanation or practice?" instead of always pushing practice
4. **Better Learning Flow**: Students understand theory BEFORE practicing
5. **More Flexible**: ALEX adapts to what student needs, not what it wants to do

---

## Files Modified

1. **`app/prompts/tutor_router.txt`**
   - Added rule 9: Educational/Teaching Requests Detection
   - Renumbered subsequent rules (9→10, 10→11, etc.)
   - Added educational keywords detection
   - Set priority for educational requests over practice

2. **`app/services/agent_service.py`**
   - Replaced "CRITICAL PRACTICE FLOW" with "EDUCATIONAL REQUESTS VS PRACTICE REQUESTS"
   - Added teaching request handling with concrete examples
   - Updated all example flows to show appropriate responses
   - Changed "problem" responses to ask for preference (explanation vs practice)

---

## Deployment

**No database changes or migrations required.**

To apply changes:
```bash
# Restart the Python backend
cd C:\Users\Honor\Ai-Ielts-26-october-4\app
# Stop with CTRL+C if running
python main.py
```

The changes are in prompt templates and will take effect immediately when the service restarts.

---

## Success Criteria

✅ Educational keywords → Receive theory with concrete examples  
✅ Practice keywords → Generate passage immediately  
✅ Problem mentions → Asked for preference (explanation or practice)  
✅ No more forcing practice when student wants to learn theory  
✅ Concrete T/F/NG examples in responses  
✅ Router confidence > 0.8 for educational requests  
✅ No regression in existing functionality  

---

## Example Interaction

```
👤 Student: "Can you show me the logic when doing t/f/ng with examples?"

🤖 ALEX: "Absolutely! Let me break down the T/F/NG logic step-by-step. 🧠

**The Three-Way Decision:**
1. TRUE = Statement matches the passage exactly (or with synonyms)
2. FALSE = Statement directly contradicts what the passage says  
3. NOT GIVEN = The passage doesn't discuss this topic at all

**Example 1 - TRUE:**
📖 Passage: 'The experiment involved 50 participants from local universities.'
📝 Statement: 'Fifty people took part in the study.'
✅ TRUE - Same meaning, different words ('50' = 'fifty', 'involved' = 'took part')

**Example 2 - FALSE:**
📖 Passage: 'The experiment involved 50 participants from local universities.'
📝 Statement: 'The study included participants from international universities.'
❌ FALSE - Direct contradiction! Passage says 'local', statement says 'international'

**Example 3 - NOT GIVEN:**
📖 Passage: 'The experiment involved 50 participants from local universities.'
📝 Statement: 'The experiment was expensive to conduct.'
❓ NOT GIVEN - Cost is never mentioned in the passage at all

The key is comparing ONLY what's written—never use your outside knowledge!

Does this make sense? Want more examples, or shall we try applying this in practice?"

👤 Student: "That makes sense! Let me try practice now"

🤖 ALEX: "Brilliant! Just tell me your level (Beginner/Intermediate/Advanced or 1/2/3) 
and I'll generate a Practice Session with T/F/NG questions. You'll get instant feedback!"
```

---

**Implementation Date:** December 3, 2025  
**Status:** ✅ Complete  
**Impact:** High - Fundamentally improves ALEX's teaching ability and responsiveness to student needs

