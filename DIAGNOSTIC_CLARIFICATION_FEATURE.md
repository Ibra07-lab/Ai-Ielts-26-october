# Diagnostic Clarification Questions Feature

## Overview
Enhanced ALEX to ask **diagnostic clarifying questions** when students mention problems, instead of immediately dumping full explanations. This creates a more personalized, targeted teaching experience.

## Problem Statement

**Before:** When a student said "I have problem with t/f/ng", ALEX would immediately provide:
- Full definition
- 3-step strategy
- All tips
- Mini examples for TRUE/FALSE/NOT GIVEN

**Issue:** Student might only need help with ONE specific aspect (e.g., distinguishing FALSE from NOT GIVEN), but gets overwhelmed with ALL information.

## Solution

### New Three-Tier Approach:

```
Tier 1: COMPLETELY VAGUE
"I'm struggling" → Ask what area (timing, vocab, question types)

Tier 2: GENERAL PROBLEM TYPE  
"I have problem with t/f/ng" → Ask specific aspect (definitions, FALSE vs NOT GIVEN, finding info, timing)

Tier 3: SPECIFIC ASPECT
"Can't tell FALSE from NOT GIVEN" → Provide FOCUSED explanation on that one thing
```

---

## Implementation

### 1. **Router Logic Update** (`app/prompts/tutor_router.txt`)

Enhanced Rule 15 with three-tier detection:

#### Tier 1: General Problem Type → ASK_FOR_CLARIFICATION
```txt
If user mentions "t/f/ng" WITHOUT specific aspect
→ action: ASK_FOR_CLARIFICATION
→ target_skill: "tfng"
→ ALEX asks: "What specifically are you finding tricky?"
```

#### Tier 2: Specific Aspect → ANSWER_GENERAL_QUESTION
```txt
If user mentions specific sub-problems like:
- "can't distinguish FALSE from NOT GIVEN"
- "take too long"
- "can't find information"
→ action: ANSWER_GENERAL_QUESTION
→ target_skill: "tfng", sub_skill: "false_vs_not_given"
→ ALEX gives FOCUSED explanation
```

#### Tier 3: Completely Vague → ASK_FOR_CLARIFICATION (no target_skill)
```txt
If user says "I'm struggling" WITHOUT ANY specifics
→ action: ASK_FOR_CLARIFICATION
→ no target_skill
→ ALEX asks: "What area? (timing, vocab, question types)"
```

### 2. **Enhanced ASK_FOR_CLARIFICATION Handler** (`app/services/agent_service.py`)

Added problem-specific diagnostic questions for each skill:

#### T/F/NG Questions
```python
"What specifically are you finding tricky?"

• Understanding what TRUE/FALSE/NOT GIVEN mean?
• Distinguishing FALSE from NOT GIVEN? (This is the trickiest part!)
• Finding the relevant information in the passage?
• Taking too long to answer these questions?
• Understanding qualifiers and keywords?
• Something else?
```

#### Matching Headings
```python
"What's giving you trouble?"

• Understanding what 'main idea' means?
• Getting distracted by keywords instead of themes?
• Differentiating between similar headings?
• Not sure how to skim paragraphs effectively?
• Taking too much time?
```

#### Timing
```python
"Where are you struggling?"

• Reading the passage too slowly?
• Spending too long on difficult questions?
• Not sure how to allocate time across passages?
• Getting stuck and can't move on?
• Running out of time at the end?
```

#### Vocabulary
```python
"What's the main issue?"

• Too many unknown words overall?
• Don't know how to guess word meanings from context?
• Academic vocabulary is too advanced?
• Words look similar but mean different things?
• Unfamiliar technical terms?
```

#### Multiple Choice
```python
"Where do you get stuck?"

• All answers seem correct?
• Falling for distractor answers?
• Can't find the information in the passage?
• Don't understand paraphrasing?
• Taking too long to decide?
```

#### Gap Fill
```python
"What's difficult for you?"

• Don't know where to find the answer in the passage?
• Not sure what type of word fits grammatically?
• Finding the word but it doesn't fit?
• Exceeding the word limit?
• Choosing between similar words?
```

#### Short Answer
```python
"What's the issue?"

• Can't find the answer in the passage?
• Answer is longer than the word limit?
• Not sure if you should use exact passage words?
• Don't understand what the question is asking?
• Finding multiple possible answers?
```

---

## Example Interactions

### Example 1: T/F/NG - Full Diagnostic Flow

```
👤 Student: "I have problem with t/f/ng"

🤖 ALEX: "I can help with T/F/NG questions! 📝 Let me understand better 
          so I can give you the most useful advice.
          
          What specifically are you finding tricky?
          
          • Understanding what TRUE/FALSE/NOT GIVEN mean?
          • Distinguishing FALSE from NOT GIVEN? (This is the trickiest part!)
          • Finding the relevant information in the passage?
          • Taking too long to answer these questions?
          • Understanding qualifiers and keywords?
          • Something else?
          
          Let me know and I'll give you targeted strategies!"

👤 Student: "I can't tell the difference between FALSE and NOT GIVEN"

🤖 ALEX: "Ah, that's THE most common struggle with T/F/NG! This is where 
          most students get confused. Let me break down the key difference:
          
          **FALSE = Direct Contradiction**
          The passage SAYS something that CONTRADICTS the statement.
          You CAN quote the opposing information.
          
          **NOT GIVEN = No Information**
          The passage DOESN'T MENTION this topic at all.
          You CANNOT find any relevant information.
          
          **The Two-Question Test:**
          1. Does the passage discuss this topic?
             - If NO → NOT GIVEN (stop here)
             - If YES → Go to question 2
          2. Does it agree or contradict?
             - Agrees → TRUE
             - Contradicts → FALSE
          
          **Example:**
          📖 Passage: 'The study involved 50 local participants.'
          
          Statement 1: 'International participants were involved'
          → Question 1: Does passage discuss participants? YES ✓
          → Question 2: Does it agree? NO, says 'local' not 'international'
          → Answer: FALSE (contradiction!)
          
          Statement 2: 'The study was expensive'
          → Question 1: Does passage discuss cost/expense? NO ✗
          → Answer: NOT GIVEN (topic not mentioned)
          
          See the difference? FALSE contradicts something stated, 
          NOT GIVEN isn't discussed at all.
          
          Does this clear it up? Want to try a practice question?"
```

### Example 2: Matching Headings - Focused Help

```
👤 Student: "I struggle with matching headings"

🤖 ALEX: "I can help with Matching Headings! 📋 Let me understand your 
          specific challenge.
          
          What's giving you trouble?
          
          • Understanding what 'main idea' means?
          • Getting distracted by keywords instead of themes?
          • Differentiating between similar headings?
          • Not sure how to skim paragraphs effectively?
          • Taking too much time?
          
          Tell me more and I'll help you tackle it!"

👤 Student: "I get distracted by keywords"

🤖 ALEX: "Ah yes! This is a classic trap - I see it all the time. 📚
          
          **The Keyword Trap:**
          You see a word in the paragraph that matches a heading, 
          so you think 'That's it!' But the heading might be about 
          something completely different!
          
          **The Solution - Focus on THEME, not WORDS:**
          1. Read the paragraph and ask: 'What is this MAINLY about?'
          2. Summarize in YOUR OWN WORDS (1 sentence)
          3. Then match to heading with that MEANING
          4. Ignore keyword matches - they're often distractors!
          
          **Example:**
          📄 Paragraph: 'While caffeine initially boosts concentration, 
          studies show it leads to energy crashes later. Experts recommend 
          limiting intake to avoid dependency.'
          
          ❌ Wrong thinking: 'I see 'caffeine' and 'concentration' so 
          the heading must be 'Benefits of caffeine''
          
          ✅ Right thinking: 'What's this MAINLY about? It mentions a 
          benefit BUT focuses more on problems (crashes, dependency). 
          The MAIN IDEA is negative effects.'
          
          → Correct heading: 'The drawbacks of caffeine consumption'
          
          Pro tip: Cover the paragraph, summarize the main point from 
          memory, THEN look at headings!
          
          Make sense? Ready to try one?"
```

### Example 3: Completely Vague → Narrowing Down

```
👤 Student: "I'm struggling with reading"

🤖 ALEX: "I'm here to help! 💪 Let's narrow down what you need.
          
          What area are you struggling with?
          
          • Question types: T/F/NG, Matching Headings, Multiple Choice, etc.?
          • Skills: Timing, Vocabulary, Finding information?
          • Understanding: What questions are asking, passage structure?
          • Strategy: How to approach passages, what to read first?
          
          Let me know your priority and I'll give you focused help!"

👤 Student: "timing"

🤖 ALEX: "Timing issues are super common! ⏰ Let's pinpoint where you're 
          losing time.
          
          Where are you struggling?
          
          • Reading the passage too slowly?
          • Spending too long on difficult questions?
          • Not sure how to allocate time across passages?
          • Getting stuck and can't move on?
          • Running out of time at the end?
          
          Which one sounds most like your situation?"

👤 Student: "I get stuck on hard questions and can't move on"

🤖 ALEX: "Ah, the classic 'stuck syndrome'! This kills your timing. ⏰
          
          Here's the fix - The 2-Minute Rule:
          
          **If you can't answer in 2 minutes:**
          1. Circle it / mark it
          2. Make your BEST GUESS
          3. MOVE ON immediately
          4. Come back at the end if time allows
          
          **Why this works:**
          - Easy questions give you confidence momentum
          - Your brain processes the hard one subconsciously
          - Coming back fresh often makes it click
          - You don't sacrifice other questions
          
          **Example:**
          Q5 is super confusing → 2 minutes up
          → Guess B (reasonable guess)
          → Move to Q6, Q7, Q8 (nail these!)
          → Return to Q5 with 5 minutes left
          → Often the answer is now obvious!
          
          The key is: SOME points from easy questions beats ZERO points 
          from being stuck!
          
          Ready to practice this strategy?"
```

---

## Benefits

### 1. **More Personalized**
- Students get exactly what they need
- No information overload
- Targeted to their actual problem

### 2. **Better Diagnosis**
- ALEX understands the root issue
- Can track common sub-problems
- More effective teaching

### 3. **Efficient Learning**
- Faster to the solution
- Student stays engaged (interactive)
- Less overwhelming

### 4. **Scalable**
- Easy to add new sub-problem types
- Each problem type has clear diagnostic paths
- Consistent structure across all types

### 5. **Natural Conversation**
- Feels like talking to a tutor
- Not just info dump
- Builds rapport

---

## Diagnostic Question Design Principles

### 1. **5-7 Options Maximum**
Don't overwhelm with choices. Cover the most common issues.

### 2. **Friendly Tone**
Use emojis, encouraging language, "Which one sounds like you?"

### 3. **Mark the Tricky One**
E.g., "(This is the trickiest part!)" helps students self-identify

### 4. **Include "Something else?"**
Gives escape hatch for edge cases

### 5. **End with Invitation**
"Let me know...", "Tell me more..." - encourages response

---

## Router Priority Flow

```
User Message
     ↓
[Check 1] Contains SPECIFIC ASPECT keywords?
           (e.g., "can't distinguish FALSE from NOT GIVEN")
     ↓ YES
   ANSWER_GENERAL_QUESTION (focused explanation)
     
     ↓ NO
[Check 2] Contains GENERAL PROBLEM TYPE?
           (e.g., "problem with t/f/ng")
     ↓ YES
   ASK_FOR_CLARIFICATION (with target_skill)
   → Show diagnostic questions
     
     ↓ NO
[Check 3] Completely vague?
           (e.g., "I'm struggling")
     ↓ YES
   ASK_FOR_CLARIFICATION (no target_skill)
   → Show general area questions
```

---

## Testing Scenarios

### Test 1: Direct to Specific Aspect
```
Input: "I don't understand the difference between FALSE and NOT GIVEN"
Expected: Focused explanation on that distinction only (no clarification needed)
```

### Test 2: General Problem Type
```
Input: "I have problem with t/f/ng"
Expected: Diagnostic questions about 5-6 specific aspects
```

### Test 3: Completely Vague
```
Input: "I'm struggling with reading"
Expected: High-level area questions (timing, vocab, question types, etc.)
```

### Test 4: Two-Step Clarification
```
Input: "I need help" 
→ ALEX asks area
Input: "question types"
→ ALEX asks which type
Input: "matching headings"
→ ALEX asks specific aspect
Input: "main idea"
→ ALEX gives focused explanation on identifying main ideas
```

---

## Files Modified

### 1. `app/prompts/tutor_router.txt` (Rule 15)
- Changed SPECIFIC PROBLEMS to route to ASK_FOR_CLARIFICATION (not ANSWER_GENERAL_QUESTION)
- Added tier system: Vague → General → Specific
- Added specific aspect detection for follow-up responses

### 2. `app/services/agent_service.py` (lines 834-935)
- Enhanced ASK_FOR_CLARIFICATION handler
- Added 7 problem-specific diagnostic question sets
- Added generic clarification for completely vague problems

---

## Deployment

**Restart Python backend:**
```bash
cd C:\Users\Honor\Ai-Ielts-26-october-4\app
# Press CTRL+C if running
python main.py
```

After restart, students will get diagnostic clarification questions!

---

## Success Criteria

✅ General problem mention → Diagnostic clarification questions  
✅ Student clarifies → Focused explanation on that aspect only  
✅ Vague problem → Area clarification → Type clarification → Aspect clarification  
✅ Specific aspect from start → Direct focused explanation  
✅ 5-7 relevant diagnostic options per problem type  
✅ Friendly, engaging question format  
✅ No information overload  

---

**Implementation Date:** December 3, 2025  
**Status:** ✅ Complete  
**Impact:** High - Transforms teaching from broadcast to diagnostic conversation

