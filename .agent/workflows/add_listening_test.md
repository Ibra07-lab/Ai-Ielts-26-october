---
description: How to add a new IELTS Listening Test (Audio, Data, and Frontend)
---

This workflow guides you through adding a new listening test to the platform. This process involves three main steps: adding the audio file, creating the JSON data file, and updating the frontend component to render the specific layout.

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

2.  **Locate the Active Part Section**:
    -   Find `{activePart === 1 && (`, `{activePart === 2 && (`, etc., depending on which part you are implementing.

3.  **Add the Test Condition**:
    -   Add a new conditional block for your test ID.
    ```tsx
    {test.id === 12 && (
        <div className="animate-in fade-in duration-300">
            {/* INSTRUCTIONS */}
            <p className="italic mb-2">Complete the notes below.</p>
            <p className="italic mb-6">Write <strong>ONE WORD ONLY</strong> for each answer.</p>

            {/* QUESTIONS LAYOUT */}
            <div className="border border-black p-8 bg-white">
                <h3 className="text-xl font-bold mb-6">Topic Header</h3>
                
                {/* Example Filling in Blank */}
                <div className="flex flex-wrap items-baseline gap-2">
                    <span>Question text before</span>
                    {renderBlank(1, "w-48")} 
                    <span>text after.</span>
                </div>

                 {/* Example Multiple Choice */}
                 <div className="mt-8">
                    {[2, 3, 4].map(id => {
                        const q = test.questions.find((q: any) => q.id === id);
                        return q ? renderMultipleChoice(q) : null;
                    })}
                 </div>
            </div>
        </div>
    )}
    ```

## 4. Verification

1.  **Restart the backend** (if needed, though it usually hot-reloads JSON).
2.  **Navigate to the Listening Page**: `http://localhost:5173/listening`
3.  **Select the new test** from the list (it should appear automatically if the JSON is valid).
4.  **Verify the layout** matches the design and that inputs work.
