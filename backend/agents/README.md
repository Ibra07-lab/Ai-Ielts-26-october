# IELTS Reading Feedback Agent

An intelligent feedback system for IELTS Reading practice using LangChain and OpenAI GPT-4 Turbo.

## Features

- **Intelligent Feedback**: Generates detailed, educational feedback based solely on passage content
- **Multiple Question Types**: Supports all 14 IELTS Reading question types
- **Hallucination Prevention**: Low temperature (0.2) and strict prompts minimize AI hallucinations
- **IELTS Standards**: Follows official IELTS Reading assessment criteria
- **Production-Ready**: Comprehensive error handling, logging, and type safety
- **Async Support**: Fully asynchronous for high performance
- **Batch Processing**: Process multiple questions in a single request

## Tech Stack

- **LangChain 0.1+**: Modern chain composition with LCEL
- **OpenAI GPT-4 Turbo**: Latest language model for accurate analysis
- **FastAPI**: High-performance async web framework
- **Pydantic**: Data validation and settings management
- **Python 3.11+**: Latest Python features and performance

## Installation

### 1. Install Dependencies

```bash
cd backend/agents
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file based on the example:

```bash
# Copy the example
cp .env.example .env

# Edit with your actual values
nano .env
```

Required environment variables:
```env
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview
TEMPERATURE=0.2
MAX_TOKENS=1000
PORT=8000
```

### 3. Run the Service

**Development mode (with auto-reload):**
```bash
python main.py
# or
uvicorn main:app --reload --port 8000
```

**Production mode:**
```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## API Usage

### Single Feedback Request

**Endpoint:** `POST /api/feedback`

**Request:**
```json
{
  "passage": "The Industrial Revolution, which began in Britain in the late 18th century, marked a major turning point in human history. It transformed societies from agrarian to industrial, introducing new manufacturing processes and technologies.",
  "question": "When did the Industrial Revolution begin?",
  "question_type": "Short Answer Questions",
  "correct_answer": "late 18th century",
  "student_answer": "1780s"
}
```

**Response:**
```json
{
  "is_correct": true,
  "feedback": "Your answer '1780s' is correct. The passage states that the Industrial Revolution began in the 'late 18th century,' and the 1780s falls within this timeframe.",
  "reasoning": "Step 1: Located the relevant sentence in the passage: 'The Industrial Revolution, which began in Britain in the late 18th century...'\nStep 2: The late 18th century typically refers to 1780-1799\nStep 3: Your answer '1780s' accurately represents this timeframe\nStep 4: The answer shows good understanding of historical dating conventions",
  "strategy_tip": "For date-related questions, understand that approximate time references (like 'late 18th century') can be answered with specific decades or dates that fall within that period. Always check if the passage gives an exact date or a timeframe.",
  "passage_reference": "The Industrial Revolution, which began in Britain in the late 18th century, marked a major turning point in human history.",
  "confidence": "high"
}
```

### Batch Feedback Request

**Endpoint:** `POST /api/feedback/batch`

**Request:**
```json
[
  {
    "passage": "...",
    "question": "...",
    "question_type": "Multiple Choice",
    "correct_answer": "...",
    "student_answer": "..."
  },
  {
    "passage": "...",
    "question": "...",
    "question_type": "True/False/Not Given",
    "correct_answer": "...",
    "student_answer": "..."
  }
]
```

**Response:**
```json
{
  "results": [
    {
      "index": 0,
      "status": "success",
      "feedback": { /* FeedbackOutput object */ }
    },
    {
      "index": 1,
      "status": "success",
      "feedback": { /* FeedbackOutput object */ }
    }
  ],
  "total": 2,
  "successful": 2,
  "failed": 0
}
```

### Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "model": "gpt-4-turbo-preview"
}
```

## Supported Question Types

1. **Multiple Choice**
2. **True/False/Not Given**
3. **Yes/No/Not Given**
4. **Matching Headings**
5. **Matching Information**
6. **Matching Features**
7. **Matching Sentence Endings**
8. **Sentence Completion**
9. **Summary Completion**
10. **Note Completion**
11. **Table Completion**
12. **Flow Chart Completion**
13. **Diagram Label Completion**
14. **Short Answer Questions**

## Architecture

### Components

```
backend/agents/
├── __init__.py                    # Package initialization
├── reading_feedback_agent.py      # Main agent class
├── prompts.py                     # System prompts and templates
├── main.py                        # FastAPI application
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment template
└── README.md                      # This file
```

### Agent Flow

```
Request → Input Validation → LangChain Chain → LLM (GPT-4) → Output Parser → Response
                                    ↓
                            Prompt Template
                            + System Rules
                            + Question Guidance
```

### LangChain Chain (LCEL)

```python
chain = (
    RunnablePassthrough.assign(
        format_instructions=...,
        question_type_guidance=...
    )
    | prompt
    | llm
    | output_parser
)
```

## Key Features Explained

### 1. Hallucination Prevention

- **Low Temperature (0.2)**: Reduces randomness in responses
- **Top-p Sampling (0.1)**: Further focuses on high-probability outputs
- **Strict System Prompt**: Explicitly forbids external knowledge
- **Passage-Only Rule**: All feedback must reference passage content

### 2. IELTS Compliance

- **Official Criteria**: Follows IELTS Reading assessment guidelines
- **Question-Type Specific**: Tailored guidance for each question type
- **Scoring Rules**: Considers spelling, synonyms, paraphrasing appropriately
- **Educational Focus**: Teaches strategies, not just correctness

### 3. Production Quality

- **Error Handling**: Comprehensive try-catch blocks
- **Logging**: Structured logging for debugging and monitoring
- **Type Safety**: Full Pydantic validation
- **Async/Await**: Non-blocking I/O for scalability
- **CORS Support**: Configurable cross-origin requests
- **Health Checks**: Service monitoring endpoints

## Integration with Encore Backend

### Option 1: Direct HTTP Calls

From your TypeScript backend (`backend/ielts/reading.ts`):

```typescript
import axios from 'axios';

const FEEDBACK_SERVICE_URL = process.env.FEEDBACK_SERVICE_URL || 'http://localhost:8000';

export const getAIFeedback = api(
  { expose: true, method: "POST", path: "/reading/feedback" },
  async (params: {
    passage: string;
    question: string;
    questionType: string;
    correctAnswer: string;
    studentAnswer: string;
  }): Promise<FeedbackResponse> => {
    try {
      const response = await axios.post(`${FEEDBACK_SERVICE_URL}/api/feedback`, {
        passage: params.passage,
        question: params.question,
        question_type: params.questionType,
        correct_answer: params.correctAnswer,
        student_answer: params.studentAnswer
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      throw new Error('Failed to generate feedback');
    }
  }
);
```

### Option 2: Run as Sidecar Service

Add to your `start-app.ps1`:

```powershell
# Start Python Feedback Service
Write-Host "Starting Python Feedback Service..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/agents; python main.py"

# Wait for service to be ready
Start-Sleep -Seconds 3
```

### Option 3: Docker Compose

```yaml
version: '3.8'
services:
  feedback-agent:
    build: ./backend/agents
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OPENAI_MODEL=gpt-4-turbo-preview
    restart: unless-stopped
```

## Testing

### Manual Testing with curl

```bash
# Health check
curl http://localhost:8000/health

# Single feedback
curl -X POST http://localhost:8000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "passage": "Your passage text here...",
    "question": "What is the main idea?",
    "question_type": "Multiple Choice",
    "correct_answer": "Option B",
    "student_answer": "Option B"
  }'
```

### Testing with Python

```python
import requests

response = requests.post(
    "http://localhost:8000/api/feedback",
    json={
        "passage": "...",
        "question": "...",
        "question_type": "Multiple Choice",
        "correct_answer": "...",
        "student_answer": "..."
    }
)

print(response.json())
```

## Performance Considerations

- **Response Time**: Typically 2-5 seconds per question (depends on GPT-4 API)
- **Batch Processing**: Use `/api/feedback/batch` for multiple questions (up to 40)
- **Rate Limits**: OpenAI has rate limits; consider implementing caching
- **Cost**: GPT-4 Turbo costs ~$0.01-0.03 per feedback request

## Error Handling

The service returns structured errors:

```json
{
  "error": "Input validation failed",
  "detail": "passage: field required",
  "status_code": 400
}
```

Common error codes:
- **400**: Invalid input (validation failed)
- **500**: Internal server error (LLM or processing error)
- **503**: Service unavailable (agent not initialized)

## Logging

Logs are written to stdout with structured format:

```
2025-10-22 10:30:45 - main - INFO - Received feedback request for question_type=Multiple Choice
2025-10-22 10:30:48 - reading_feedback_agent - INFO - Feedback generated successfully: is_correct=True
```

## Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API key | - | ✅ Yes |
| `OPENAI_MODEL` | Model to use | `gpt-4-turbo-preview` | No |
| `TEMPERATURE` | LLM temperature | `0.2` | No |
| `MAX_TOKENS` | Max response tokens | `1000` | No |
| `HOST` | Server host | `0.0.0.0` | No |
| `PORT` | Server port | `8000` | No |
| `CORS_ORIGINS` | Allowed origins | `*` | No |
| `LOG_LEVEL` | Logging level | `info` | No |

## Troubleshooting

### Agent Not Initializing

**Error:** `Agent not initialized`

**Solution:** Check that `OPENAI_API_KEY` is set correctly in `.env`

### OpenAI Rate Limits

**Error:** `RateLimitError: You exceeded your current quota`

**Solution:** 
- Check your OpenAI account billing
- Implement request caching
- Use exponential backoff retry logic

### Slow Response Times

**Issue:** Requests taking > 10 seconds

**Solution:**
- Reduce `MAX_TOKENS` in `.env`
- Use `gpt-3.5-turbo` for faster (but lower quality) responses
- Implement response caching for common questions

### CORS Issues

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:** Set `CORS_ORIGINS` in `.env` to include your frontend domain

## Future Enhancements

- [ ] Response caching (Redis)
- [ ] Request rate limiting
- [ ] Analytics and monitoring
- [ ] Multiple language support
- [ ] Confidence scoring improvements
- [ ] Fine-tuned model for IELTS specificity
- [ ] Webhook support for async processing

## License

This service is part of the AI IELTS App project.

## Support

For issues or questions, please contact the development team or create an issue in the project repository.

