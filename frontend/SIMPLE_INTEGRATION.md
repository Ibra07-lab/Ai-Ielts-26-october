# Simple AI Feedback Integration

## What You're Adding

After students submit their Reading test, they'll see:
- Results (correct/incorrect) - **ALREADY EXISTS**
- NEW: "🤖 Get AI Feedback" button for incorrect answers
- AI explains why the answer is wrong and how to improve

## Step-by-Step Integration

### Step 1: Import the AI Feedback Service

At the **top of `frontend/pages/ReadingPractice.tsx`**, add this import (around line 15):

```typescript
import { getAIFeedback } from '../services/aiFeedback';
```

### Step 2: Add State for AI Feedback

Inside your `ReadingPractice` component, add this state (around line 150, with other useState):

```typescript
const [aiFeedback, setAIFeedback] = useState<Record<number, any>>({});
const [loadingFeedback, setLoadingFeedback] = useState<Set<number>>(new Set());
```

### Step 3: Add AI Feedback Handler

Add this function inside your `ReadingPractice` component (around line 200):

```typescript
const handleGetAIFeedback = async (questionId: number, question: any, studentAnswer: string, correctAnswer: string) => {
  setLoadingFeedback(prev => new Set(prev).add(questionId));
  
  try {
    const feedback = await getAIFeedback({
      passage: passage?.paragraphs?.map(p => p.text).join('\n\n') || '',
      question: question.questionText || question.sentenceBeginning || '',
      question_type: question.type || 'Multiple Choice',
      correct_answer: correctAnswer,
      student_answer: studentAnswer
    });
    
    setAIFeedback(prev => ({
      ...prev,
      [questionId]: feedback
    }));
    
    toast({
      title: "AI Feedback Ready",
      description: "Scroll down to see detailed feedback",
    });
  } catch (error) {
    console.error('Error getting AI feedback:', error);
    toast({
      title: "Error",
      description: "Failed to get AI feedback. Please try again.",
      variant: "destructive"
    });
  } finally {
    setLoadingFeedback(prev => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
  }
};
```

### Step 4: Update QuestionResult Component

Replace your existing `QuestionResult` function (around line 53) with this:

```typescript
// Collapsible question result component
function QuestionResult({ 
  question, 
  answer, 
  correctAnswer, 
  explanation,
  aiFeedback,
  onGetAIFeedback,
  isLoadingFeedback
}: { 
  question: any; 
  answer: string; 
  correctAnswer: string; 
  explanation: string;
  aiFeedback?: any;
  onGetAIFeedback?: () => void;
  isLoadingFeedback?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isCorrect = answer === correctAnswer;

  return (
    <div 
      className={`p-3 rounded-lg border-l-4 cursor-pointer transition-colors ${
        isCorrect 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-500 hover:bg-green-100 dark:hover:bg-green-900/30' 
          : 'bg-red-50 dark:bg-red-900/20 border-red-500 hover:bg-red-100 dark:hover:bg-red-900/30'
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm ${
            isCorrect ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {isCorrect ? '✓' : '✗'}
          </div>
          <span className="font-medium">
            Q{question.id}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {expanded ? '▼' : '▶'}
        </span>
      </div>
      
      {expanded && (
        <div className="mt-3 pl-8 text-sm space-y-2 border-t pt-3">
          <p><strong>Question:</strong> {question.questionText || question.sentenceBeginning}</p>
          <p><strong>Your answer:</strong> <span className="font-semibold">{answer || "Not answered"}</span></p>
          <p><strong>Correct answer:</strong> <span className="font-semibold text-green-700 dark:text-green-400">{correctAnswer}</span></p>
          <p className={isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
            {explanation}
          </p>
          
          {/* NEW: AI Feedback Section */}
          {!isCorrect && onGetAIFeedback && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              {!aiFeedback && !isLoadingFeedback && (
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onGetAIFeedback();
                  }}
                  size="sm"
                  variant="outline"
                  className="w-full bg-white hover:bg-blue-50"
                >
                  🤖 Get AI Tutor Feedback
                </Button>
              )}
              
              {isLoadingFeedback && (
                <div className="text-center py-2">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">AI is analyzing...</p>
                </div>
              )}
              
              {aiFeedback && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🤖</span>
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300">AI Tutor Feedback</h4>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                    <p className="text-sm">{aiFeedback.feedback}</p>
                  </div>
                  
                  <details className="cursor-pointer">
                    <summary className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                      📖 View Detailed Analysis
                    </summary>
                    <div className="mt-3 space-y-3 pl-4">
                      <div>
                        <strong className="text-xs uppercase text-gray-500">Reasoning:</strong>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-line">
                          {aiFeedback.reasoning}
                        </p>
                      </div>
                      
                      <div>
                        <strong className="text-xs uppercase text-gray-500">Strategy Tip:</strong>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          💡 {aiFeedback.strategy_tip}
                        </p>
                      </div>
                      
                      <div>
                        <strong className="text-xs uppercase text-gray-500">Passage Reference:</strong>
                        <p className="text-sm italic text-gray-600 dark:text-gray-400 mt-1 border-l-2 border-gray-300 pl-3">
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

### Step 5: Update the QuestionResult Usage

Find where you use `<QuestionResult>` (around line 1697) and update it to pass the new props:

```typescript
<QuestionResult
  key={q.id}
  question={q}
  answer={answers[q.id]}
  correctAnswer={result.correctAnswers[q.id]}
  explanation={result.explanations[q.id]}
  aiFeedback={aiFeedback[q.id]}
  onGetAIFeedback={() => handleGetAIFeedback(
    q.id,
    q,
    answers[q.id],
    result.correctAnswers[q.id]
  )}
  isLoadingFeedback={loadingFeedback.has(q.id)}
/>
```

## That's It!

Now when students:
1. Complete the test
2. Submit answers
3. See incorrect answers
4. Click "🤖 Get AI Tutor Feedback" button
5. Wait 2-5 seconds
6. See detailed AI explanation!

## Make Sure Backend is Running

Before testing, make sure the Python backend is running:

```powershell
cd backend
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## Test It

1. Go to your Reading Practice page
2. Complete a test
3. Get some answers wrong
4. Submit
5. Click the AI feedback button on an incorrect answer
6. See AI explain why you're wrong!

---

**This integrates AI feedback into your EXISTING webapp** - no new app needed! 🎉

