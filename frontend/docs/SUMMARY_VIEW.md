# Feedback Summary View - Component Documentation

## Overview

The Feedback Summary View displays IELTS writing feedback in a beautiful bento grid layout with circular progress rings showing band scores.

## Components Created

### 1. CircularProgress Component
**Location:** `frontend/components/writing/CircularProgress.tsx`

Displays band scores as animated circular progress rings.

**Props:**
- `value: number` - The band score (e.g., 6.5)
- `max?: number` - Maximum band (default: 9)
- `color: string` - Stroke color based on band level
- `size?: "sm" | "md" | "lg"` - Size variant
- `showValue?: boolean` - Whether to show number in center (default: true)
- `strokeWidth?: number` - Custom stroke width

**Sizes:**
- `sm`: 80x80px, stroke 6px, text-xl
- `md`: 120x120px, stroke 8px, text-3xl
- `lg`: 160x160px, stroke 10px, text-4xl

**Helper Functions:**
```typescript
getBandColor(band: number): string
// Returns: "#10B981" (green) for 7.0+
//          "#F59E0B" (amber) for 5.5-6.5
//          "#EF4444" (red) for 1.0-5.0

getBandBgColor(band: number): string
// Returns background colors for the same ranges
```

**Features:**
- ✅ Smooth 0.5s animation on mount
- ✅ Starts from 12 o'clock position
- ✅ Rounded stroke ends (strokeLinecap: round)
- ✅ Gray background circle with colored progress arc

---

### 2. FeedbackSummaryView Component
**Location:** `frontend/components/writing/FeedbackSummaryView.tsx`

Main summary view with hero card and criterion grid.

**Props:**
```typescript
interface FeedbackSummaryViewProps {
    evaluation: EvaluationResult;
    taskType?: "task1" | "task2";
    onCriterionClick?: (criterion: Criterion) => void;
}
```

**Layout Structure:**

#### Hero Card (Top)
- Large overall band score (6.5)
- Band range in parentheses (6.0 - 7.0)
- Warning: "AI estimate for practice only"
- Large circular progress ring on the right
- Border color matches band score color

#### Criterion Grid (Below)
- 4 columns on desktop (lg)
- 2 columns on tablet (md)
- 1 column on mobile
- Each card shows:
  - Circular progress ring (md size)
  - Criterion name
  - "Click to explore" hint
  - Background color based on band
  - Hover: scales to 1.02
  - Selected: blue ring (ring-2 ring-blue-500)

#### Word Count Card (Bottom)
- Shows word count
- Green if valid, red if below minimum
- Badge showing "✓ Valid" or "✗ Too Short"

**Color Coding:**
- 🔴 **Red** (1.0-5.0): `#FEE2E2` bg, `#EF4444` ring
- 🟡 **Amber** (5.5-6.5): `#FEF3C7` bg, `#F59E0B` ring
- 🟢 **Green** (7.0-9.0): `#D1FAE5` bg, `#10B981` ring

**Criterion Labels:**
- Task 1: "Task Achievement"
- Task 2: "Task Response"
- Both: "Coherence & Cohesion", "Lexical Resource", "Grammatical Range & Accuracy"

---

### 3. Demo Page
**Location:** `frontend/pages/FeedbackSummaryDemo.tsx`

Demo page with three sample evaluations.

**Route:** `/writing/feedback-demo`

**Sample Data:**
1. **Mid-Range (6.5)** - Balanced scores, valid word count
2. **Lower (5.5)** - Below minimum word count (142 words)
3. **High (7.5)** - Strong scores across all criteria

---

## Usage Example

```tsx
import { FeedbackSummaryView } from "@/components/writing/FeedbackSummaryView";
import type { EvaluationResult } from "@/types/writing-feedback";

function MyComponent() {
    const evaluation: EvaluationResult = {
        overall_band: 6.5,
        band_range: { low: 6.0, high: 7.0 },
        criterion_scores: [
            {
                criterion: "task_response",
                band: 7.0,
                justification: "Addresses all parts of the task"
            },
            // ... other criteria
        ],
        word_count: 267,
        word_count_ok: true,
    };

    const handleCriterionClick = (criterion) => {
        console.log("Navigate to deep dive:", criterion);
        // Navigate to detailed view
    };

    return (
        <FeedbackSummaryView
            evaluation={evaluation}
            taskType="task2"
            onCriterionClick={handleCriterionClick}
        />
    );
}
```

---

## Styling Details

### Animations
- Circular progress: 0.5s ease-in-out fill animation
- Card hover: 0.2s scale transition
- All transitions use `transition-all duration-200`

### Responsive Breakpoints
- Mobile: 1 column grid
- Tablet (md): 2 column grid
- Desktop (lg): 4 column grid

### Accessibility
- Clickable cards have cursor-pointer
- Selected state with visible ring
- Color-coded with sufficient contrast
- Hover states for better UX

---

## Integration with Types

Uses the new type system from `frontend/types/writing-feedback.ts`:

```typescript
import type {
    EvaluationResult,
    Criterion,
    CriterionScore,
    BandRange,
} from "@/types/writing-feedback";
```

---

## Next Steps

To integrate with WritingTask.tsx:

1. Import the component:
```tsx
import { FeedbackSummaryView } from "@/components/writing/FeedbackSummaryView";
```

2. Add state for view mode:
```tsx
const [viewMode, setViewMode] = useState<"summary" | "deepdive">("summary");
const [selectedCriterion, setSelectedCriterion] = useState<Criterion | null>(null);
```

3. Render conditionally:
```tsx
{feedbackData && (
    <>
        {viewMode === "summary" && (
            <FeedbackSummaryView
                evaluation={feedbackData.evaluation}
                taskType={currentTask === 1 ? "task1" : "task2"}
                onCriterionClick={(criterion) => {
                    setSelectedCriterion(criterion);
                    setViewMode("deepdive");
                }}
            />
        )}
        {viewMode === "deepdive" && (
            <DeepDiveView criterion={selectedCriterion} />
        )}
    </>
)}
```

---

## Testing

Visit `/writing/feedback-demo` to see:
- ✅ Three different score ranges
- ✅ Animated circular progress rings
- ✅ Hover effects on cards
- ✅ Click interactions (console logs)
- ✅ Responsive grid layout
- ✅ Color coding system
- ✅ Word count validation display

---

**Created:** 2026-01-04  
**Components:** CircularProgress, FeedbackSummaryView, FeedbackSummaryDemo
