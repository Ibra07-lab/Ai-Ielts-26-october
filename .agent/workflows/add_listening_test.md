---
description: How to add a new IELTS Listening Test (Audio, Data, and Frontend)
---

This workflow guides you through adding a new listening test to the platform. This process involves three main steps: adding the audio file, creating the JSON data file, and updating the frontend component to render the specific layout.

> [!CAUTION]
> **CRITICAL ARCHITECTURE RULES** — Read these before making ANY changes to `ListeningWorksheet.tsx`.
> 
> 1. **Each Part has its OWN rendering section.** The file has separate top-level sections for Part 1, Part 2, Part 3, and Part 4. Search for `{/* Part 1 Content */}`, `{/* Part 2 Content */}`, etc. to find them. **NEVER** put Part 2 content inside the Part 1 section (or vice versa). Content placed in the wrong section will be invisible when the user switches parts.
> 
> 2. **Each Part section has a ternary chain** of `test.id === X ? (...) : test.id === Y ? (...) : (fallback)`. You MUST add your new test as an explicit branch (`test.id === N ? (...)`) in this chain. **NEVER** rely on the fallback — it contains old content from another test and will render wrong questions/maps/titles.
> 
> 3. **Use shared helper functions** instead of writing inline rendering logic:
>    - `renderMultipleChoice(q)` — for A/B/C radio button questions
>    - `renderPickTwo(q1, q2)` — for "Choose TWO letters" checkbox questions
>    - `renderMatching(questions, options, boxTitle, instruction, columnTitle)` — for matching/labelling
>    - `renderMapDiagram(imagePath, questions)` — for map labelling with image
>    - `renderBlank(id, width, showNumber?)` — for fill-in-the-blank inputs
> 
> 4. **Do NOT invent question content.** Only use the exact questions, options, and titles provided by the user. Never copy content from other tests.
> 
> 5. **Do NOT add map images or diagrams** unless the user explicitly provides them or asks for them.

## 1. Add Audio File

1.  **Prepare your audio file**: Ensure it is in `.mp3` or `.wav` format.
2.  **Move the file**: Place the audio file in the frontend public directory:
    -   Path: `frontend/public/audio/`
    -   *Example*: `frontend/public/audio/test-12.mp3`

## 2. Create Data File (JSON)

1.  **Create a new JSON file** in the backend data directory:
    -   Path: `backend/data/listening-tests/test-[ID].json`
    -   *Example*: `backend/data/listening-tests/test-12.json`
    -   *Note*: The ID in the filename MUST match the `id` field in the JSON.

2.  **Use the correct Schema**:
    -   **CRITICAL**: You MUST use `question` (NOT `text`) and `correctAnswer` (NOT `answer`).
    -   **Structure**:
        ```json
        {
          "id": 12,
          "title": "Test 12",
          "section": 1,
          "difficulty": "medium",
          "audioFile": "/audio/test-12.mp3",
          "duration": 1800,
          "questions": [
            {
              "id": 1,
              "type": "fill-in-blank",
              "questionNumber": 1,
              "question": "Example question text...",
              "correctAnswer": "answer key",
              "explanation": "Optional explanation"
            }
          ],
          "transcripts": [
             {
                "title": "Part 1",
                "lines": [
                   { "speaker": "A", "text": "Hello world" }
                ]
             }
          ]
        }
        ```

## 3. Register Frontend Layout

The frontend does **not** automatically render new tests because each test has a unique layout (tables, maps, diagrams). You must manually add the rendering logic.

1.  **Open the Worksheet Component**:
    -   File: `frontend/components/listening/ListeningWorksheet.tsx`

2.  **Find the CORRECT Part section** for the content you are adding:
    -   Search for `{/* Part 1 Content */}` → contains `activePart === 1` wrapper
    -   Search for `{/* Part 2 Content */}` → contains `activePart === 2` wrapper
    -   Search for `{/* Part 3 Content */}` → contains `activePart === 3` wrapper
    -   Search for `{/* Part 4 Content */}` → contains `activePart === 4` wrapper

> [!WARNING]
> **Each Part MUST be added to its own section.** If you are adding Part 2 content, you MUST place it inside the `activePart === 2` section. Placing it inside the Part 1 section wrapper will make it invisible when Part 2 is selected.

3.  **Add your test as a new branch in the ternary chain**:
    -   Inside the correct Part section, find the existing ternary chain: `test.id === X ? (...) : test.id === Y ? (...) : (`
    -   Add your test BEFORE the final fallback `) : (`:
    ```tsx
    ) : test.id === NEW_ID ? (
        <div className="animate-in fade-in duration-300">
            {/* Your Part content here */}
        </div>
    ) : (
    ```

> [!IMPORTANT]
> **NEVER rely on the fallback `else` branch.** The fallback contains hardcoded content from an older test (e.g., "Stanthorpe Twinning Association", map images). Always add an explicit `test.id === N` branch.

4.  **Use shared helper functions** — do NOT write custom inline rendering:

    ```tsx
    {/* Multiple Choice (A, B, C) */}
    {[11, 12, 13].map(id => {
        const q = test.questions.find((q: any) => q.id === id);
        return q ? renderMultipleChoice(q) : null;
    })}

    {/* Pick Two (Choose TWO letters) */}
    {renderPickTwo(
        test.questions.find((q: any) => q.id === 19),
        test.questions.find((q: any) => q.id === 20)
    )}

    {/* Fill-in-blank */}
    {renderBlank(1, "w-48")}

    {/* Map Diagram */}
    {renderMapDiagram("/images/test-N-map.png", questions)}
    ```

## 4. Register Test in ListeningPractice.tsx

The `ListeningPractice` component has logic to determine whether to use the custom worksheet layout or not. You must add your new test ID to this list.

1.  **Open ListeningPractice**:
    -   File: `frontend/pages/ListeningPractice.tsx`

2.  **Locate `isWorksheetTest` function**:
    -   Find the function `const isWorksheetTest = (testId: number) => {`.

3.  **Add your Test ID**:
    -   Add your new test ID to the array.
    ```tsx
    const isWorksheetTest = (testId: number) => {
        return [1, 3, 4, ..., 13, 14].includes(testId);
    };
    ```

## 5. Verification

1.  **Restart the backend** (if needed, though it usually hot-reloads JSON).
2.  **Navigate to the Listening Page**: `http://localhost:5173/listening`
3.  **Select the new test** from the list (it should appear automatically if the JSON is valid).
4.  **Verify ALL parts** — click through Part 1, Part 2, Part 3, and Part 4. Ensure:
    -   Each part shows the correct questions (not content from another test).
    -   No map images or titles appear unless they were explicitly intended.
    -   Question inputs (radio buttons, checkboxes, text fields) are functional.
    -   No blank/empty sections appear when switching parts.
