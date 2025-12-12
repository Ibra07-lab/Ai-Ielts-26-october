# Smart Problem Detection Update

## Overview
Enhanced ALEX (IELTS Reading Mentor) to intelligently distinguish between **specific** and **vague** student problems, providing targeted solutions or requesting clarification as appropriate.

## Changes Made

### 1. **Router Logic Enhancement** (`app/prompts/tutor_router.txt`)

#### Added Rule 13: PROBLEM SPECIFICITY DETECTION

**For SPECIFIC Problems** → Routes to `ANSWER_GENERAL_QUESTION` with targeted `target_skill`:
- **T/F/NG questions** → `target_skill: "tfng"`
- **Matching headings** → `target_skill: "matching_headings"`
- **Timing issues** → `target_skill: "timing"`
- **Vocabulary problems** → `target_skill: "vocabulary"`
- **Inference issues** → `target_skill: "inference"`
- **Multiple choice** → `target_skill: "multiple_choice"`
- **Gap fill/sentence completion** → `target_skill: "gap_fill"`
- **Short answer questions** → `target_skill: "short_answer"`

**For VAGUE Problems** → Routes to `ASK_FOR_CLARIFICATION`:
- "I have a problem" (no specifics)
- "I'm struggling" (no context)
- "I need help" (no details)
- "I'm confused" (no area specified)

#### Updated Parameters
Added new target_skill options: `"tfng"`, `"multiple_choice"`, `"gap_fill"`, `"short_answer"`

### 2. **Enhanced Chat Prompt** (`app/services/agent_service.py`)

#### Added SPECIFIC PROBLEM STRATEGIES Section

Provides targeted strategies for each problem type:

**T/F/NG Questions:**
- Test whether statements match exactly (True), contradict (False), or aren't mentioned (Not Given)
- Key tip: Don't use outside knowledge—stick to what's written
- Look for exact matches or clear contradictions

**Matching Headings:**
- Understand MAIN IDEA of each paragraph
- Don't get distracted by keywords
- Watch out for distractor headings

**Timing Issues:**
- 20 minutes per passage strategy
- 2-3 minutes skimming first
- Don't get stuck on one question

**Vocabulary Problems:**
- Use context clues
- Read sentences before and after
- Look for synonyms nearby

**Multiple Choice:**
- Read question stem carefully
- Eliminate wrong answers
- Watch for paraphrasing

**Gap Fill/Sentence Completion:**
- Read around the gap
- Use words directly from passage
- Check grammar fit

**Short Answer:**
- Answer briefly and precisely
- Use passage words (don't paraphrase)
- Stick to word limit

#### Updated Example Flows

Added three example scenarios:

1. **Specific Problem (T/F/NG):**
   - User: "I have problem with t/f/ng type of question"
   - ALEX provides targeted T/F/NG strategy + offers practice

2. **Vague Problem:**
   - User: "I'm struggling with reading"
   - ALEX asks clarifying questions about timing, vocabulary, or question types

3. **Specific Problem (Timing):**
   - User: "I have problem with timing"
   - ALEX provides timing strategy + offers practice

## How It Works

### Flow Diagram

```
Student Message
       ↓
   Router Analysis
       ↓
   ┌───────────────────────┐
   │ Check for Keywords    │
   └───────────────────────┘
       ↓           ↓
   SPECIFIC     VAGUE
       ↓           ↓
   Set          Ask for
   target_skill Clarification
       ↓
   ANSWER_GENERAL_QUESTION
       ↓
   Provide targeted strategy
       +
   Offer practice session
```

### Example Interactions

#### Before Update:
```
Student: "I have problem with my t/f/ng type of question"
ALEX: "Please paste the passage or questions you'd like help with."
❌ Asks for passage instead of providing strategy
```

#### After Update:
```
Student: "I have problem with my t/f/ng type of question"
ALEX: "Ah, True/False/Not Given questions! 📝 These can be tricky but totally manageable.

Quick strategy: Read each statement carefully, then scan the passage for that specific information. TRUE means it matches exactly, FALSE means it contradicts the passage, and NOT GIVEN means it's not mentioned at all. The key is NOT using your own knowledge—stick strictly to what's written!

Would you like to try a practice passage with T/F/NG questions right now? I can generate one for you!"
✅ Provides targeted strategy + offers practice
```

#### Vague Problem Handling:
```
Student: "I'm struggling"
ALEX: "I hear you—IELTS Reading can feel overwhelming! 💪 Let me help narrow it down.

What specifically are you finding challenging? Is it:
• Timing (running out of time)?
• Vocabulary (too many unknown words)?
• Specific question types (like T/F/NG or matching headings)?
• Understanding the main ideas?

Let me know and I'll give you targeted strategies!"
✅ Asks for clarification to provide better help
```

## Benefits

1. **Smarter Response Routing**: Agent now distinguishes between specific and vague problems
2. **Targeted Strategies**: Each problem type gets specific, actionable advice
3. **Better User Experience**: Students get immediate help for specific issues
4. **Efficient Guidance**: Vague problems prompt clarification before providing help
5. **Consistent Behavior**: Same logic applied across all chat interactions

## Testing Recommendations

Test these scenarios:

### Specific Problems (Should provide strategy + offer practice):
- ✅ "I have problem with t/f/ng questions"
- ✅ "I struggle with matching headings"
- ✅ "I'm too slow with timing"
- ✅ "I don't understand vocabulary in passages"
- ✅ "Multiple choice questions are hard for me"

### Vague Problems (Should ask for clarification):
- ✅ "I'm struggling"
- ✅ "I need help"
- ✅ "I have a problem with reading"
- ✅ "Can you help me?"
- ✅ "I'm confused"

### Edge Cases:
- ✅ "I have problem with T/F/NG and timing" (multiple specific issues)
- ✅ "Help with reading" (vague + general keyword)

## Files Modified

1. `app/prompts/tutor_router.txt`
   - Added rule 13 for problem specificity detection
   - Updated target_skill parameter options

2. `app/services/agent_service.py`
   - Added SPECIFIC PROBLEM STRATEGIES section (2 occurrences)
   - Updated example flows with specific and vague scenarios

## Deployment

**No database changes or migrations required.**

To apply changes:
```bash
# Restart the backend service
cd backend
encore run
```

The changes are in the prompt templates and will take effect immediately when the service restarts.

## Success Criteria

✅ Specific problem mentions → Receive targeted strategy  
✅ Vague problem mentions → Asked for clarification  
✅ Router confidence > 0.75 for specific problems  
✅ Router confidence > 0.7 for vague problems  
✅ No regression in existing functionality  

---
**Implementation Date:** December 3, 2025  
**Status:** ✅ Complete  

