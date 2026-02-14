# How to Add IELTS Listening Tests

This guide explains how to upload audio, transcript, and answers for IELTS Listening practice.

## Quick Start

1. **Add your audio file** to `static/audio/`
2. **Create a JSON test file** in `backend/data/listening-tests/`
3. **Restart the backend** - tests will be automatically loaded

---

## Step 1: Prepare Your Audio File

Place your MP3 audio file in:
```
static/audio/listening-section1-test1.mp3
```

**Naming convention:** `listening-section{N}-test{N}.mp3`

---

## Step 2: Create Test JSON File

Create a file in `backend/data/listening-tests/test-{N}.json`:

```json
{
  "id": 3,
  "title": "Section 1: Your Title",
  "section": 1,
  "difficulty": "easy",
  "audioFile": "/audio/listening-section1-test3.mp3",
  "duration": 360,
  "instructions": "You will hear...",
  "transcript": [
    {
      "speaker": "Narrator",
      "timestamp": "00:00",
      "text": "Introduction text..."
    },
    {
      "speaker": "A",
      "timestamp": "00:10",
      "text": "First speaker's dialogue..."
    }
  ],
  "questions": [
    {
      "id": 1,
      "type": "fill-in-blank",
      "questionNumber": 1,
      "question": "The customer wants ____ tickets.",
      "correctAnswer": "two",
      "alternativeAnswers": ["2"],
      "explanation": "The speaker says 'I need two tickets'"
    },
    {
      "id": 2,
      "type": "multiple-choice",
      "questionNumber": 2,
      "question": "What time does the event start?",
      "options": ["7 PM", "8 PM", "9 PM"],
      "correctAnswer": "8 PM",
      "explanation": "The event begins at 8 o'clock"
    }
  ]
}
```

---

## Test JSON Structure

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique test ID |
| `title` | string | Test display title |
| `section` | number | IELTS section (1-4) |
| `difficulty` | string | "easy" / "medium" / "hard" |
| `audioFile` | string | Path to audio file |
| `duration` | number | Audio duration in seconds |
| `transcript` | array | Array of transcript lines |
| `questions` | array | Array of questions |

### Question Types

**Fill-in-blank:**
```json
{
  "type": "fill-in-blank",
  "question": "The price is ____ dollars.",
  "correctAnswer": "fifty",
  "alternativeAnswers": ["50"]
}
```

**Multiple-choice:**
```json
{
  "type": "multiple-choice",
  "question": "What is the main topic?",
  "options": ["Option A", "Option B", "Option C"],
  "correctAnswer": "Option B"
}
```

---

## File Location Reference

```
Ai-Ielts-26-october/
├── backend/
│   ├── data/
│   │   └── listening-tests/
│   │       ├── test-1.json    ✅ Your tests here
│   │       ├── test-2.json
│   │       └── test-3.json
│   └── ielts/
│       └── listening.ts       ✅ API endpoints
├── static/
│   └── audio/
│       └── *.mp3              ✅ Your audio files here
└── frontend/
    └── pages/
        └── ListeningPractice.tsx
```

---

## Testing

1. Start the backend: `npm run dev` (in backend folder)
2. Start the frontend: `npm run dev` (in frontend folder)
3. Navigate to Listening Practice
4. Your new tests should appear automatically
