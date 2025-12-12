# Socratic Questioning Feature for Wrong Answers

## Overview
Implemented a powerful Socratic questioning system where ALEX asks students "Why did you choose X?" for wrong answers BEFORE providing explanations. This helps identify and address specific misconceptions rather than just giving standard corrections.

## Feature Description

When a student submits answers and gets some wrong, ALEX:
1. Shows results (✅ correct, ❌ incorrect)
2. **Asks about the first wrong answer:** "Why did you choose X? What sentence or words made you think so?"
3. **Waits for student's reasoning** or allows them to skip
4. **Provides targeted explanation** based on their specific misconception
5. **Moves to next wrong answer** and repeats the process

This creates deeper learning by addressing the actual reasoning errors, not just showing correct answers.

---

## User Flow

```
Step 1: Student submits answers → "A, B, C"

Step 2: ALEX checks and responds
┌──────────────────────────────────────────┐
│ Your Results:                             │
│                                           │
│ ✅ Q1: Your answer A (TRUE) is correct!  │
│ ❌ Q2: Your answer B (FALSE) is incorrect│
│ ❌ Q3: Your answer A (TRUE) is incorrect │
│                                           │
│ Let's understand Q2:                      │
│                                           │
│ ❓ Why did you choose 'B (FALSE)'?       │
│ What sentence or words in the passage     │
│ made you think so?                        │
│                                           │
│ (Or say 'skip' if you want me to         │
│  explain directly)                        │
└──────────────────────────────────────────┘

Step 3a: Student explains reasoning
Student: "I chose FALSE because paragraph 3 says 
         'the project started in 2018' but the 
         statement says 'before 2018'"

ALEX: "I see why you thought that! You correctly 
       identified the date in paragraph 3. However, 
       the key word you missed is 'proposed' vs 
       'started'. The passage says the project 
       'started in 2018' but was 'proposed in late 
       2017' - which means it WAS proposed before 
       2018, making the answer TRUE, not FALSE.
       
       Tip: Watch for words like 'proposed', 
       'initiated', 'began' - they indicate different 
       phases of a project!"
       
       [Continues to Q3...]

Step 3b: Student skips
Student: "skip"

ALEX: [Provides standard explanation]
      
      Why it's wrong: The statement says...
      Evidence from passage: "..."
      Strategy tip: ...
      
      [Continues to Q3...]
```

---

## Implementation Details

### 1. **ConversationMemory Enhancement** (`app/models/student_profile.py`)

Added three new fields to track Socratic questioning state:

```python
class ConversationMemory(BaseModel):
    # ... existing fields ...
    
    # Socratic questioning state for wrong answers
    pending_socratic_questions: Dict[int, Dict[str, Any]] = Field(default_factory=dict)
    # Stores: {question_id: {student_answer, correct_answer, question_text}}
    
    waiting_for_reasoning: Optional[int] = None
    # The question_id we're currently waiting for student reasoning on
    
    student_reasoning: Dict[int, str] = Field(default_factory=dict)
    # Stores: {question_id: reasoning_text}
```

**Purpose:**
- `pending_socratic_questions`: Queue of wrong answers to process
- `waiting_for_reasoning`: Tracks which question we're currently asking about
- `student_reasoning`: Records what students said (for analysis/future features)

### 2. **Router Rule Addition** (`app/prompts/tutor_router.txt`)

Added **Rule 4**: SOCRATIC REASONING DETECTION

```txt
4. SOCRATIC REASONING DETECTION (when ALEX recently asked "Why did you choose X?"):
   - Check chat_history: If ALEX recently asked "Why did you choose..." or 
     "What sentence or words made you think..."
   - If user is responding with reasoning → choose ASK_SOCRATIC_QUESTION 
     with parameters: {"follow_up": true}
     * Look for: "because", "I thought", "I chose", "the passage says", 
       "paragraph", "it says", "I saw", "I read", "I assumed"
   - If user says "skip", "just tell me", "explain", "I don't know" 
     → choose GENERATE_EXPLANATION with parameters: {"skip_socratic": true}
   - PRIORITY: Check for Socratic context FIRST before other routing rules
```

**Detection Logic:**
- Checks if ALEX just asked "Why did you choose...?" in chat history
- Routes based on whether student is explaining or skipping
- High priority to capture the context before other rules

### 3. **PROVIDE_FEEDBACK Handler Update** (`app/services/agent_service.py`)

Enhanced to initiate Socratic questioning:

**Changes:**
- Tracks wrong answers in a list
- Stores all wrong answers in `memory.pending_socratic_questions`
- Asks about the FIRST wrong answer immediately
- Sets `memory.waiting_for_reasoning` to the question ID
- Provides skip option

**Code Flow:**
```python
# After checking all answers
if wrong_answers:
    # Store all wrong answers
    memory.pending_socratic_questions = {wa["id"]: wa for wa in wrong_answers}
    
    # Ask about first wrong answer
    first_wrong = wrong_answers[0]
    memory.waiting_for_reasoning = first_wrong["id"]
    
    response_content += f"\n\n**Let's understand Q{first_wrong['id']}:**\n\n"
    response_content += f"❓ **Why did you choose '{first_wrong['student_answer']}'?**\n\n"
    response_content += "What sentence or words in the passage made you think so?\n\n"
    response_content += "_(Or say 'skip' if you want me to explain directly)_"
```

### 4. **New ASK_SOCRATIC_QUESTION Handler** (`app/services/agent_service.py`)

Processes student's reasoning and provides targeted explanation:

**Functionality:**
1. Retrieves student's reasoning from their message
2. Stores it in `memory.student_reasoning[q_id]`
3. Gets passage context for the question
4. Generates explanation addressing their specific misconception
5. Removes question from pending queue
6. Moves to next wrong answer if any remain

**LLM Prompt for Explanation:**
```python
socratic_prompt = f"""The student answered Question {q_id} incorrectly.

Question: {wrong_q['question_text']}
Student's answer: {wrong_q['student_answer']}
Correct answer: {wrong_q['correct_answer']}

Student's reasoning: "{user_message}"

Relevant passage excerpt: {context['passage_text'][:600]}

Based on the student's reasoning, provide a response that:
1. Acknowledges their thinking (e.g., "I see why you thought that!")
2. Identifies the specific misconception that led them astray
3. Explains what they missed or misunderstood in the passage
4. Shows the correct reasoning with evidence from the passage
5. Gives a tip to avoid this mistake in future

Be warm and supportive. Focus on fixing the misconception, not blaming them."""
```

**Key Features:**
- Addresses the student's ACTUAL reasoning
- Warm and supportive tone
- Identifies specific misconception
- Provides evidence from passage
- Gives actionable tip

### 5. **GENERATE_EXPLANATION Enhancement** (`app/services/agent_service.py`)

Added support for skip_socratic parameter:

**Skip Flow:**
```python
if params.get("skip_socratic") and session_id in self.active_sessions:
    memory = self.active_sessions[session_id]
    
    if memory.waiting_for_reasoning:
        q_id = memory.waiting_for_reasoning
        wrong_q = memory.pending_socratic_questions[q_id]
        
        # Generate standard explanation (not based on reasoning)
        feedback_model = await self.generate_deeper_feedback(feedback_context)
        
        # Show explanation
        response_content = f"**Q{q_id} Explanation:**\n\n"
        response_content += f"**Why it's wrong:** {feedback_model.error_analysis}\n\n"
        response_content += f"**Evidence:** {feedback_model.evidence_quote}\n\n"
        response_content += f"**Tip:** {feedback_model.strategy_tip}\n\n"
        
        # Move to next question
        del memory.pending_socratic_questions[q_id]
        memory.waiting_for_reasoning = None
        
        # Continue with next wrong answer if any...
```

---

## Example Interactions

### Example 1: Student Explains Reasoning

```
👤 Student: "A, B, C"

🤖 ALEX: "Your Results:

✅ Q1: Your answer A (TRUE) is correct!
❌ Q2: Your answer B (FALSE) is incorrect.
❌ Q3: Your answer C (NOT GIVEN) is incorrect.

Let's understand Q2:

❓ Why did you choose 'B (FALSE)'?
What sentence or words in the passage made you think so?

(Or say 'skip' if you want me to explain directly)"

👤 Student: "I chose FALSE because paragraph 2 says 'some students' 
            but the statement says 'all students', so it contradicts"

🤖 ALEX: "Q2 Explanation:

I see why you thought that! You correctly spotted the difference between 
'some students' and 'all students'. That's great attention to detail!

However, the question asks about a different part of the passage. 
The statement isn't about students at all - it's about the research 
methodology. If you look at paragraph 3, it says 'the study examined 
teaching methods' which directly supports the statement 'the research 
focused on teaching approaches' - making it TRUE, not FALSE.

Tip: Make sure you're matching the statement to the RIGHT part of the 
passage. Sometimes similar wording appears in different contexts!

Let's look at Q3 now:

❓ Why did you choose 'C (NOT GIVEN)'?
What made you think so?

(Or say 'skip' to see the explanation)"
```

### Example 2: Student Skips

```
👤 Student: "A, B, C"

🤖 ALEX: [Same initial feedback as above]

👤 Student: "skip"

🤖 ALEX: "Q2 Explanation:

**Why it's wrong:** The statement matches the passage content in 
paragraph 3. The passage explicitly states 'the study examined teaching 
methods' which means the research DID focus on teaching approaches, 
making the answer TRUE, not FALSE.

**Evidence from passage:** 'The study, conducted over three years, 
examined various teaching methods and their effectiveness.'

**Strategy tip:** For T/F/NG questions, scan the entire passage for 
relevant information. Don't stop at the first mention of keywords!

Let's look at Q3 now:

❓ Why did you choose 'C (NOT GIVEN)'?
[...]"
```

### Example 3: Multiple Wrong Answers Flow

```
📊 Wrong Answers: Q2, Q3, Q5

Flow:
1. Ask about Q2 → Student explains → ALEX addresses misconception
2. Ask about Q3 → Student explains → ALEX addresses misconception  
3. Ask about Q5 → Student skips → ALEX provides standard explanation
4. All done → "✅ All questions reviewed! Ready for another practice?"
```

---

## Benefits

### 1. **Deeper Learning**
- Addresses actual misconceptions, not just surface errors
- Students understand WHY they were wrong
- More memorable than standard explanations

### 2. **Personalized Teaching**
- Each explanation is tailored to student's reasoning
- Identifies individual thinking patterns
- Builds on what student already understands

### 3. **Metacognitive Development**
- Forces students to articulate their thinking
- Develops self-awareness about reasoning process
- Improves critical thinking skills

### 4. **Flexibility**
- Optional - students can skip if they want
- Processes all wrong answers systematically
- Works with any question type (T/F/NG, MC, etc.)

### 5. **Better Engagement**
- Interactive dialogue instead of one-way correction
- Students feel heard and understood
- More engaging than passive learning

---

## Technical Architecture

### State Machine

```
State 1: IDLE
   ↓ (student submits answers)
   
State 2: CHECKING_ANSWERS
   ↓ (found wrong answers)
   
State 3: WAITING_FOR_REASONING
   ↓
   ├─→ Student explains → State 4: PROCESSING_REASONING
   │   ↓ (generate targeted explanation)
   │   └─→ Move to next wrong answer → back to State 3
   │       OR all done → State 1: IDLE
   │
   └─→ Student skips → State 5: SKIP_TO_EXPLANATION
       ↓ (generate standard explanation)
       └─→ Move to next wrong answer → back to State 3
           OR all done → State 1: IDLE
```

### Data Flow

```
1. PROVIDE_FEEDBACK
   ├─→ Checks answers
   ├─→ Identifies wrong answers
   ├─→ Stores in memory.pending_socratic_questions
   ├─→ Sets memory.waiting_for_reasoning = first_wrong_id
   └─→ Asks "Why did you choose X?"

2. Router analyzes response
   ├─→ Detects reasoning keywords → ASK_SOCRATIC_QUESTION
   └─→ Detects skip keywords → GENERATE_EXPLANATION

3a. ASK_SOCRATIC_QUESTION
   ├─→ Retrieves context
   ├─→ Generates targeted explanation
   ├─→ Removes from pending queue
   └─→ Asks about next wrong answer OR finishes

3b. GENERATE_EXPLANATION (skip flow)
   ├─→ Generates standard explanation
   ├─→ Removes from pending queue
   └─→ Asks about next wrong answer OR finishes
```

---

## Testing Scenarios

### Scenario 1: All Wrong Answers with Reasoning
```
Input: 3 wrong answers out of 3
Student explains reasoning for each
Expected: 3 targeted explanations, all addressing specific misconceptions
```

### Scenario 2: Mixed Skip and Reasoning
```
Input: 3 wrong answers
Student: explains Q1, skips Q2, explains Q3
Expected: Targeted explanation for Q1, standard for Q2, targeted for Q3
```

### Scenario 3: All Skip
```
Input: 3 wrong answers
Student: skips all
Expected: 3 standard explanations in sequence
```

### Scenario 4: All Correct
```
Input: 3 correct answers
Expected: Congratulations message, no Socratic questioning
```

### Scenario 5: Edge Cases
```
- Student gives ambiguous response → Router clarifies
- Student changes topic mid-flow → Gracefully handles
- Session expires → Handles missing context
```

---

## Future Enhancements

### Potential Improvements:
1. **Pattern Analysis**: Track common misconceptions across sessions
2. **Adaptive Difficulty**: Adjust future questions based on reasoning patterns
3. **Misconception Database**: Build library of common errors
4. **Reasoning Quality**: Analyze depth of student's reasoning
5. **Peer Learning**: Share anonymized reasoning patterns
6. **Visual Feedback**: Highlight passage sections mentioned in reasoning
7. **Reasoning Score**: Rate quality of student's explanations

---

## Files Modified

### 1. `app/models/student_profile.py`
- Added `pending_socratic_questions` field
- Added `waiting_for_reasoning` field
- Added `student_reasoning` field

### 2. `app/prompts/tutor_router.txt`
- Added Rule 4: SOCRATIC REASONING DETECTION
- Renumbered subsequent rules (old 4→5, 5→6, etc.)

### 3. `app/services/agent_service.py`
- Enhanced PROVIDE_FEEDBACK handler to initiate Socratic questioning
- Added ASK_SOCRATIC_QUESTION handler for processing reasoning
- Enhanced GENERATE_EXPLANATION handler to support skip flow

---

## Deployment

**No database migrations required** - fields are added to in-memory models only.

To apply changes:
```bash
# Restart Python backend
cd C:\Users\Honor\Ai-Ielts-26-october-4\app
# Press CTRL+C if running
python main.py
```

Changes take effect immediately upon restart.

---

## Success Criteria

✅ Wrong answers trigger "Why did you choose X?" question  
✅ Student can provide reasoning or skip  
✅ Reasoning-based explanations address specific misconceptions  
✅ Skip provides standard explanation  
✅ Multiple wrong answers processed in sequence  
✅ All correct answers skip Socratic flow  
✅ State persists across conversation turns  
✅ No regression in existing functionality  

---

## Educational Research Basis

This feature is based on:

1. **Socratic Method**: Questioning to stimulate critical thinking
2. **Misconception-Based Teaching**: Addressing specific errors, not general concepts
3. **Metacognition**: Encouraging students to think about their thinking
4. **Constructivist Learning**: Building on existing (even if incorrect) understanding
5. **Formative Assessment**: Learning through the correction process itself

---

**Implementation Date:** December 3, 2025  
**Status:** ✅ Complete  
**Impact:** High - Transforms correction from passive to active learning

