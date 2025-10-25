# AI Feedback Integration Guide

## 🎯 Where to Find It

### 1. Test the API in Your Browser

**Open:** http://localhost:8000/docs

This opens the **Swagger UI** where you can:
- Browse all endpoints
- Test requests directly
- See example responses
- Get API key if needed

### 2. Use in Your React App

The AI feedback is available at: `http://localhost:8000/api/feedback`

## 📱 Integration Steps

### Step 1: Use the Service File

I've created `frontend/services/aiFeedback.ts` for you. Import it in your components:

```typescript
import { getAIFeedback, FeedbackRequest } from '../services/aiFeedback';
```

### Step 2: Add to ReadingPractice.tsx

Here's how to integrate AI feedback into your existing Reading Practice page:

```typescript
// Add this import at the top of ReadingPractice.tsx
import { getAIFeedback } from '../services/aiFeedback';

// Inside your component, add state for AI feedback
const [aiFeedback, setAIFeedback] = useState<Record<number, any>>({});
const [loadingFeedback, setLoadingFeedback] = useState(false);

// When showing results, add a button to get AI feedback
const handleGetAIFeedback = async (questionId: number, question: any, studentAnswer: string) => {
  setLoadingFeedback(true);
  try {
    const feedback = await getAIFeedback({
      passage: passageText, // Your current passage text
      question: question.questionText || question.sentenceBeginning,
      question_type: question.type, // e.g., "Multiple Choice", "True/False/Not Given"
      correct_answer: question.correctAnswer,
      student_answer: studentAnswer
    });
    
    setAIFeedback(prev => ({
      ...prev,
      [questionId]: feedback
    }));
    
    toast({
      title: "AI Feedback Ready",
      description: "Click to expand the question to see detailed feedback",
    });
  } catch (error) {
    console.error('Error getting AI feedback:', error);
    toast({
      title: "Error",
      description: "Failed to get AI feedback. Please try again.",
      variant: "destructive"
    });
  } finally {
    setLoadingFeedback(false);
  }
};
```

### Step 3: Display AI Feedback in Results

Update the `QuestionResult` component to show AI feedback:

```typescript
function QuestionResult({ 
  question, 
  answer, 
  correctAnswer, 
  explanation,
  aiFeedback, // Add this prop
  onGetAIFeedback // Add this prop
}: { 
  question: any; 
  answer: string; 
  correctAnswer: string; 
  explanation: string;
  aiFeedback?: any;
  onGetAIFeedback?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isCorrect = answer === correctAnswer;

  return (
    <div className="...">
      {/* Existing content */}
      
      {expanded && (
        <div className="mt-3 pl-8 text-sm space-y-2 border-t pt-3">
          <p><strong>Question:</strong> {question.questionText}</p>
          <p><strong>Your answer:</strong> {answer || "Not answered"}</p>
          <p><strong>Correct answer:</strong> {correctAnswer}</p>
          <p>{explanation}</p>
          
          {/* NEW: AI Feedback Section */}
          {!isCorrect && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              {!aiFeedback && (
                <Button 
                  onClick={onGetAIFeedback}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  🤖 Get AI Feedback
                </Button>
              )}
              
              {aiFeedback && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                    🤖 AI Tutor Feedback
                  </h4>
                  <p className="text-sm">{aiFeedback.feedback}</p>
                  
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium">
                      View Detailed Analysis
                    </summary>
                    <div className="mt-2 space-y-2 text-sm pl-4">
                      <div>
                        <strong>Reasoning:</strong>
                        <p className="text-gray-700 dark:text-gray-300">
                          {aiFeedback.reasoning}
                        </p>
                      </div>
                      <div>
                        <strong>Strategy Tip:</strong>
                        <p className="text-gray-700 dark:text-gray-300">
                          {aiFeedback.strategy_tip}
                        </p>
                      </div>
                      <div>
                        <strong>Passage Reference:</strong>
                        <p className="italic text-gray-600 dark:text-gray-400">
                          "{aiFeedback.passage_reference}"
                        </p>
                      </div>
                    </div>
                  </details>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### Step 4: Pass AI Feedback to Results

When rendering results, pass the AI feedback data:

```typescript
{results.map((result, index) => (
  <QuestionResult
    key={index}
    question={result.question}
    answer={result.userAnswer}
    correctAnswer={result.correctAnswer}
    explanation={result.explanation}
    aiFeedback={aiFeedback[result.question.id]} // Pass AI feedback
    onGetAIFeedback={() => handleGetAIFeedback(
      result.question.id,
      result.question,
      result.userAnswer
    )}
  />
))}
```

## 🎨 UI Flow

1. Student completes the reading test
2. Clicks "Submit"
3. Sees results with correct/incorrect answers
4. For **incorrect answers**, sees a button: "🤖 Get AI Feedback"
5. Clicks the button
6. AI analyzes the answer (takes 2-5 seconds)
7. Shows detailed feedback with:
   - **Feedback**: Why the answer is wrong
   - **Reasoning**: Step-by-step analysis
   - **Strategy Tip**: How to approach similar questions
   - **Passage Reference**: Quote from the passage

## 🔧 Configuration

The API URL is currently: `http://localhost:8000`

To change it for production, update `frontend/services/aiFeedback.ts`:

```typescript
const FEEDBACK_API_URL = process.env.VITE_FEEDBACK_API_URL || 'http://localhost:8000';
```

Then add to your `.env` file:
```
VITE_FEEDBACK_API_URL=https://your-production-api.com
```

## 📊 Features Available

### Single Feedback
- Analyze one question at a time
- Get detailed educational feedback
- Takes 2-5 seconds

### Batch Feedback
- Analyze up to 40 questions at once
- Useful for complete test review
- Takes 1-3 minutes for full test

### Example Usage

```typescript
// Single question
const feedback = await getAIFeedback({
  passage: "The Arctic is warming...",
  question: "How fast is the Arctic warming?",
  question_type: "Short Answer",
  correct_answer: "Twice the rate",
  student_answer: "Two times faster"
});

// Batch (multiple questions)
const batchResult = await getAIFeedbackBatch([
  { passage: "...", question: "...", ... },
  { passage: "...", question: "...", ... },
]);
```

## 🚀 Quick Test

1. Open http://localhost:8000/docs
2. Click "POST /api/feedback"
3. Click "Try it out"
4. Use this example:

```json
{
  "passage": "The Industrial Revolution began in Britain in the late 18th century. It marked a major turning point in human history.",
  "question": "When did the Industrial Revolution begin?",
  "question_type": "Short Answer",
  "correct_answer": "late 18th century",
  "student_answer": "19th century"
}
```

5. Click "Execute"
6. See the AI feedback response!

## 📱 Where You'll See It

Once integrated, students will see AI feedback:
- **In the Reading Practice page** (`/reading`)
- **After submitting a test**
- **For each incorrect answer**
- **With expandable detailed analysis**

---

**Your AI Feedback API is ready!** 🎉

Backend running at: http://localhost:8000
Frontend needs: Integration code above

