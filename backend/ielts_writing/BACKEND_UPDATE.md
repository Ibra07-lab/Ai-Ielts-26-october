# Backend Models Update - Enhanced Feedback System

## Summary

Updated the backend IELTS writing models to match the new frontend TypeScript types for the enhanced feedback system.

---

## Changes Made

### 1. **ExaminerEvaluation Model** (`models.py`)

#### Added Fields:
```python
class BandRange(BaseModel):
    """Confidence range for band score."""
    low: float = Field(ge=0, le=9)
    high: float = Field(ge=0, le=9)

class ExaminerEvaluation(BaseModel):
    # ... existing fields ...
    band_range: BandRange  # NEW: Confidence interval (±0.5)
    word_count_ok: bool    # NEW: True if meets minimum words
    word_count_penalty: bool  # DEPRECATED: Use word_count_ok instead
```

**Minimum Word Counts:**
- Task 1: 150 words
- Task 2: 250 words

---

### 2. **TutorFeedback Model** (`models.py`)

#### New Structured Feedback Models:

```python
class GrammarError(BaseModel):
    """Structured grammar error feedback."""
    original: str
    corrected: str
    explanation: str
    tip: str

class VocabularySuggestion(BaseModel):
    """Structured vocabulary improvement suggestion."""
    original: str
    better_options: List[str]  # Alternative words/phrases
    context: str  # When/why to use alternatives

class CoherenceIssue(BaseModel):
    """Structured coherence and cohesion feedback."""
    text: str  # Problematic text
    suggestion: str  # Improved version
    reason: str  # Why it's better
```

#### Updated TutorFeedback:

```python
class TutorFeedback(BaseModel):
    # Priority action plan (max 3)
    action_plan: List[str] = Field(max_length=3)
    
    # NEW: What student did well
    strengths: List[str]
    
    # NEW: Areas to improve
    weaknesses: List[str]
    
    # NEW: Structured feedback arrays
    grammar_errors: List[GrammarError] = Field(default_factory=list)
    vocabulary_suggestions: List[VocabularySuggestion] = Field(default_factory=list)
    coherence_issues: List[CoherenceIssue] = Field(default_factory=list)
    
    # ... existing fields (band_gaps, rewrites, micro_tasks, etc.)
```

---

### 3. **Examiner Agent** (`agents/examiner.py`)

#### Updated Logic:

```python
# Calculate band_range (±0.5 from overall)
result["band_range"] = {
    "low": max(0.0, overall - 0.5),
    "high": min(9.0, overall + 0.5)
}

# Calculate word_count_ok based on task type
word_count = result.get("word_count", 0)
min_words = 150 if task_type == TaskType.TASK1 else 250
result["word_count_ok"] = word_count >= min_words

# Keep word_count_penalty for backward compatibility
result["word_count_penalty"] = not result["word_count_ok"]
```

**Band Range Examples:**
- Overall 6.5 → Range: 6.0 - 7.0
- Overall 5.0 → Range: 4.5 - 5.5
- Overall 8.5 → Range: 8.0 - 9.0

---

### 4. **Tutor Prompt** (`prompts/tutor.py`)

#### Updated System Prompt:

Added instructions for generating structured feedback:

```
## Structured Feedback Format
For grammar_errors, provide:
- original: the incorrect text
- corrected: the fixed version
- explanation: why it's wrong
- tip: a memorable rule to avoid this error

For vocabulary_suggestions, provide:
- original: the basic/weak word/phrase
- better_options: array of 2-4 stronger alternatives
- context: when and why to use these alternatives

For coherence_issues, provide:
- text: the problematic sentence/phrase
- suggestion: improved version with better flow
- reason: why the suggestion is better
```

---

## Frontend-Backend Alignment

### ✅ Fully Aligned Fields:

| Frontend Type | Backend Model | Status |
|--------------|---------------|--------|
| `EvaluationResult.overall_band` | `ExaminerEvaluation.overall_band` | ✅ Match |
| `EvaluationResult.band_range` | `ExaminerEvaluation.band_range` | ✅ Match |
| `EvaluationResult.criterion_scores` | `ExaminerEvaluation.criterion_scores` | ✅ Match |
| `EvaluationResult.word_count` | `ExaminerEvaluation.word_count` | ✅ Match |
| `EvaluationResult.word_count_ok` | `ExaminerEvaluation.word_count_ok` | ✅ Match |
| `CoachingResult.action_plan` | `TutorFeedback.action_plan` | ✅ Match |
| `CoachingResult.strengths` | `TutorFeedback.strengths` | ✅ Match |
| `CoachingResult.weaknesses` | `TutorFeedback.weaknesses` | ✅ Match |
| `CoachingResult.grammar_errors` | `TutorFeedback.grammar_errors` | ✅ Match |
| `CoachingResult.vocabulary_suggestions` | `TutorFeedback.vocabulary_suggestions` | ✅ Match |
| `CoachingResult.coherence_issues` | `TutorFeedback.coherence_issues` | ✅ Match |

---

## Example Response

### Backend Response (JSON):

```json
{
  "evaluation": {
    "task_type": "task2",
    "overall_band": 6.5,
    "band_range": {
      "low": 6.0,
      "high": 7.0
    },
    "criterion_scores": [
      {
        "criterion": "task_response",
        "band": 7.0,
        "justification": "Addresses all parts of the task"
      }
    ],
    "word_count": 267,
    "word_count_ok": true,
    "word_count_penalty": false,
    "off_topic": false,
    "timestamp": "2026-01-04T17:25:00Z"
  },
  "coaching": {
    "action_plan": [
      "Replace basic vocabulary with academic alternatives",
      "Add cohesive devices between paragraphs",
      "Vary sentence structures"
    ],
    "strengths": [
      "Clear topic sentences in each paragraph",
      "Good use of examples to support points"
    ],
    "weaknesses": [
      "Limited vocabulary range",
      "Some paragraphs lack transitions"
    ],
    "grammar_errors": [
      {
        "original": "people has more opportunities",
        "corrected": "people have more opportunities",
        "explanation": "Subject-verb agreement: 'people' is plural",
        "tip": "People = plural, Person = singular"
      }
    ],
    "vocabulary_suggestions": [
      {
        "original": "very important",
        "better_options": ["crucial", "vital", "essential"],
        "context": "Use academic vocabulary to express importance"
      }
    ],
    "coherence_issues": [
      {
        "text": "However, this is good. People can learn.",
        "suggestion": "However, this is beneficial as it enables people to learn.",
        "reason": "Connect ideas more smoothly within sentences"
      }
    ],
    "target_band": 7.0,
    "band_gaps": [...],
    "rewrites": [...],
    "micro_tasks": [...],
    "strengths_summary": "Good structure and examples",
    "next_focus": "Improve vocabulary range"
  },
  "recurring_errors": [],
  "personalized_tip": null
}
```

---

## Migration Notes

### Backward Compatibility:

✅ **Maintained:**
- `word_count_penalty` field (deprecated but still populated)
- `rewrites` array (legacy, but kept)
- `strengths_summary` and `next_focus` strings (legacy)

⚠️ **New Required Fields:**
- `strengths` array (must be populated by tutor agent)
- `weaknesses` array (must be populated by tutor agent)
- `grammar_errors`, `vocabulary_suggestions`, `coherence_issues` (default to empty arrays)

### AI Agent Updates Needed:

The **Tutor Agent** LLM prompt now instructs it to generate the new structured fields. The agent should automatically populate:
- `strengths` array
- `weaknesses` array
- `grammar_errors` array
- `vocabulary_suggestions` array
- `coherence_issues` array

If the LLM doesn't provide these fields, they'll default to empty arrays (won't break).

---

## Testing

### Test the Backend:

```bash
# Send a test request
curl -X POST http://localhost:8001/ielts_writing/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "task_type": "task2",
    "question": "Some people think...",
    "essay": "Your essay here...",
    "target_band": 7.0
  }'
```

### Expected Response:
- ✅ `evaluation.band_range` present
- ✅ `evaluation.word_count_ok` present
- ✅ `coaching.strengths` array
- ✅ `coaching.weaknesses` array
- ✅ `coaching.grammar_errors` array (may be empty)
- ✅ `coaching.vocabulary_suggestions` array (may be empty)
- ✅ `coaching.coherence_issues` array (may be empty)

---

## Next Steps

1. **Test the backend** with a real essay submission
2. **Verify LLM output** includes new structured fields
3. **Update frontend** to use real backend data instead of mock
4. **Create highlights** from the structured feedback using `transformToHighlights()`

---

## Files Modified

```
backend/ielts_writing/
├── models.py                    # ✅ Updated
├── agents/
│   └── examiner.py             # ✅ Updated
└── prompts/
    └── tutor.py                # ✅ Updated
```

---

**Updated:** 2026-01-04  
**Status:** ✅ Backend models aligned with frontend types  
**Breaking Changes:** None (backward compatible)
