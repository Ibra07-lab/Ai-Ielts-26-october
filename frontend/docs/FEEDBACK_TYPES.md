# Writing Feedback System - Type Definitions & Usage Guide

This document describes the TypeScript type system for the IELTS Writing feedback feature, including evaluation scores, coaching feedback, and essay markup highlights.

---

## 📁 File Structure

```
frontend/
├── types/
│   ├── writing-feedback.ts      # Core type definitions
│   └── writing.ts                # Legacy types (to be migrated)
├── utils/
│   └── feedback-transform.ts     # Transformation utilities
└── examples/
    └── feedback-usage.tsx        # Usage examples
```

---

## 🎯 Core Types Overview

### 1. **EvaluationResult** (Examiner Output)

Represents the objective scoring from the examiner agent.

```typescript
interface EvaluationResult {
    overall_band: number;              // e.g., 6.5
    band_range: { low: number; high: number };  // e.g., { low: 6.0, high: 7.0 }
    criterion_scores: CriterionScore[];
    word_count: number;
    word_count_ok: boolean;
}

interface CriterionScore {
    criterion: Criterion;
    band: number;
    justification: string;
}

type Criterion =
    | "task_response"
    | "coherence_cohesion"
    | "lexical_resource"
    | "grammatical_range_accuracy";
```

**Key Fields:**
- `overall_band`: The final band score (0-9, in 0.5 increments)
- `band_range`: Confidence interval for the score
- `criterion_scores`: Individual scores for each IELTS criterion
- `word_count_ok`: `true` if meets minimum (150 for Task 1, 250 for Task 2)

---

### 2. **CoachingResult** (Tutor Output)

Represents actionable coaching feedback from the tutor agent.

```typescript
interface CoachingResult {
    action_plan: string[];                    // 3 priority fixes
    strengths: string[];                      // Things done well
    weaknesses: string[];                     // Areas to improve
    grammar_errors: GrammarError[];
    vocabulary_suggestions: VocabularySuggestion[];
    coherence_issues: CoherenceIssue[];
}
```

**Detailed Sub-types:**

```typescript
interface GrammarError {
    original: string;       // "people has more opportunities"
    corrected: string;      // "people have more opportunities"
    explanation: string;    // "Subject-verb agreement: 'people' is plural"
    tip: string;           // "People = plural, Person = singular"
}

interface VocabularySuggestion {
    original: string;           // "very important"
    better_options: string[];   // ["crucial", "vital", "essential"]
    context: string;            // "Use more academic vocabulary"
}

interface CoherenceIssue {
    text: string;        // Original problematic text
    suggestion: string;  // Improved version
    reason: string;      // Why it's better
}
```

---

### 3. **Highlight** (Essay Markup)

Represents a highlighted section in the essay for visual feedback.

```typescript
interface Highlight {
    id: string;                    // Unique identifier
    start: number;                 // Character position (0-indexed)
    end: number;                   // Character position (0-indexed)
    type: HighlightType;
    original: string;              // The highlighted text
    corrected?: string;            // Suggested correction (optional)
    reason: string;                // Explanation
    tip: string;                   // Actionable tip
    bandImpact?: string;           // e.g., "Could improve from 6.0 to 6.5"
}

type HighlightType = "grammar" | "vocabulary" | "coherence" | "strength";
```

**Highlight Types:**
- `grammar`: Red - grammatical errors
- `vocabulary`: Blue - word choice improvements
- `coherence`: Yellow - flow and connection issues
- `strength`: Green - things done well (no `corrected` field)

---

## 🔄 Transformation Flow

### Backend → Frontend

The backend returns `RawBackendFeedback`, which the frontend transforms into `EnhancedFeedbackResponse`:

```typescript
// 1. Backend returns this
interface RawBackendFeedback {
    evaluation: EvaluationResult;
    coaching: CoachingResult;
}

// 2. Frontend transforms to this
interface EnhancedFeedbackResponse {
    evaluation: EvaluationResult;
    coaching: CoachingResult;
    highlights: Highlight[];      // ← Generated from coaching
    timestamp: string;
}
```

### Transformation Process

```typescript
import { transformToHighlights } from "@/utils/feedback-transform";

const essay = "Your essay text here...";
const backendResponse = await fetchFeedback();

// Transform coaching feedback into highlights
const highlights = transformToHighlights(essay, backendResponse.coaching);
```

**How it works:**
1. Extracts `original` text from `grammar_errors`, `vocabulary_suggestions`, etc.
2. Finds the character positions of each text snippet in the essay
3. Creates `Highlight` objects with position data
4. Handles fuzzy matching for minor whitespace/punctuation differences

---

## 🛠️ Utility Functions

### Finding Text Positions

```typescript
import { findTextPosition } from "@/utils/feedback-transform";

const position = findTextPosition(essay, "people has more opportunities");
// Returns: { start: 45, end: 73, text: "people has more opportunities" }
```

### Merging Overlapping Highlights

```typescript
import { mergeOverlappingHighlights } from "@/utils/feedback-transform";

const merged = mergeOverlappingHighlights(highlights);
// Prioritizes: grammar > vocabulary > coherence > strength
```

### Grouping by Type

```typescript
import { groupHighlightsByType } from "@/utils/feedback-transform";

const grouped = groupHighlightsByType(highlights);
// Returns: { grammar: [...], vocabulary: [...], coherence: [...], strength: [...] }
```

### Getting Statistics

```typescript
import { getHighlightStats } from "@/utils/feedback-transform";

const stats = getHighlightStats(highlights);
// Returns: { total: 12, grammar: 5, vocabulary: 4, coherence: 2, strength: 1 }
```

---

## 💡 Usage Examples

### Example 1: Processing Backend Response

```typescript
import { processBackendFeedback } from "@/examples/feedback-usage";

async function handleSubmit(essay: string) {
    const backendData = await fetch("/api/writing/evaluate", {
        method: "POST",
        body: JSON.stringify({ essay, task_type: "task2" }),
    }).then(res => res.json());

    const enhancedFeedback = processBackendFeedback(essay, backendData);

    // Now you have:
    // - enhancedFeedback.evaluation (scores)
    // - enhancedFeedback.coaching (action plan, strengths, etc.)
    // - enhancedFeedback.highlights (for essay markup)
}
```

### Example 2: Rendering Highlighted Essay

```typescript
function EssayDisplay({ essay, highlights }: { essay: string; highlights: Highlight[] }) {
    const segments = buildSegments(essay, highlights);

    return (
        <div className="essay">
            {segments.map((seg, i) => 
                seg.highlight ? (
                    <mark 
                        key={i}
                        className={`highlight-${seg.highlight.type}`}
                        title={seg.highlight.reason}
                    >
                        {seg.text}
                    </mark>
                ) : (
                    <span key={i}>{seg.text}</span>
                )
            )}
        </div>
    );
}
```

### Example 3: Displaying Feedback Panel

```typescript
function FeedbackPanel({ feedback }: { feedback: EnhancedFeedbackResponse }) {
    return (
        <div>
            {/* Score Overview */}
            <div className="score">
                <h2>Overall Band: {feedback.evaluation.overall_band}</h2>
                <p>Range: {feedback.evaluation.band_range.low} - {feedback.evaluation.band_range.high}</p>
            </div>

            {/* Action Plan */}
            <div className="action-plan">
                <h3>Priority Fixes</h3>
                <ol>
                    {feedback.coaching.action_plan.map((action, i) => (
                        <li key={i}>{action}</li>
                    ))}
                </ol>
            </div>

            {/* Strengths */}
            <div className="strengths">
                <h3>What You Did Well</h3>
                <ul>
                    {feedback.coaching.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
```

---

## 🎨 UI Integration Guidelines

### Color Coding

```css
.highlight-grammar {
    background-color: rgba(239, 68, 68, 0.2);  /* Red */
    border-bottom: 2px solid rgb(239, 68, 68);
}

.highlight-vocabulary {
    background-color: rgba(59, 130, 246, 0.2);  /* Blue */
    border-bottom: 2px solid rgb(59, 130, 246);
}

.highlight-coherence {
    background-color: rgba(234, 179, 8, 0.2);  /* Yellow */
    border-bottom: 2px solid rgb(234, 179, 8);
}

.highlight-strength {
    background-color: rgba(34, 197, 94, 0.2);  /* Green */
    border-bottom: 2px solid rgb(34, 197, 94);
}
```

### Interactive Tooltips

```typescript
<span
    className="highlight"
    onMouseEnter={() => showTooltip(highlight)}
    onClick={() => showDetailModal(highlight)}
>
    {highlight.original}
</span>
```

---

## 🔍 Type Safety Benefits

1. **Compile-time checks**: TypeScript ensures all required fields are present
2. **Autocomplete**: IDEs provide intelligent suggestions
3. **Refactoring safety**: Changes to types are caught immediately
4. **Documentation**: Types serve as inline documentation

---

## 🚀 Migration from Legacy Types

If you're using the old `WritingFeedbackResponse` type from `types/writing.ts`, here's how to migrate:

### Old Type (Legacy)
```typescript
interface WritingFeedbackResponse {
    evaluation: ExaminerEvaluation;
    coaching: TutorFeedback;
    recurring_errors: ErrorPattern[];
    personalized_tip?: string;
}
```

### New Type (Enhanced)
```typescript
interface EnhancedFeedbackResponse {
    evaluation: EvaluationResult;
    coaching: CoachingResult;
    highlights: Highlight[];
    timestamp: string;
}
```

**Key Differences:**
- `EvaluationResult` now includes `band_range` and `word_count_ok`
- `CoachingResult` has structured arrays for errors/suggestions
- `highlights` array replaces manual text parsing
- Removed `recurring_errors` (moved to separate feature)

---

## 📝 Best Practices

1. **Always validate backend responses** before transforming
2. **Handle missing text gracefully** - use fuzzy matching
3. **Merge overlapping highlights** to avoid UI clutter
4. **Sort highlights by position** before rendering
5. **Provide fallback UI** if transformation fails

---

## 🐛 Troubleshooting

### Highlight not found in essay
```typescript
// Check console warnings
console.warn(`Could not find text: "${original}"`);

// Use fuzzy matching (already built-in)
const position = findTextPosition(essay, text);  // Tries exact then fuzzy
```

### Overlapping highlights
```typescript
// Merge them with priority
const merged = mergeOverlappingHighlights(highlights);
```

### Type errors
```typescript
// Ensure you're using the correct import
import type { EnhancedFeedbackResponse } from "@/types/writing-feedback";
// NOT from "@/types/writing"
```

---

## 📚 Additional Resources

- See `frontend/examples/feedback-usage.tsx` for complete working examples
- See `frontend/utils/feedback-transform.ts` for transformation logic
- Backend models: `backend/ielts_writing/models.py`

---

**Last Updated:** 2026-01-04  
**Version:** 1.0.0
