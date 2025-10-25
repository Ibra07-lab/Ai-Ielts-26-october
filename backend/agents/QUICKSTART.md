# Quick Start Guide

Get the IELTS Reading Feedback Agent running in 5 minutes.

## Prerequisites

- Python 3.11 or higher
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))
- pip (Python package manager)

## Installation

### 1. Navigate to the agents directory

```bash
cd backend/agents
```

### 2. Create a virtual environment (recommended)

**Windows:**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up environment variables

Create a `.env` file:

```bash
# Copy the template
cp env.template .env

# Edit the file (use your preferred editor)
notepad .env       # Windows
nano .env          # macOS/Linux
```

Add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview
TEMPERATURE=0.2
MAX_TOKENS=1000
PORT=8000
```

## Running the Service

### Option 1: Development Mode (with auto-reload)

```bash
python main.py
```

The service will start on `http://localhost:8000`

### Option 2: Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Option 3: With Gunicorn (production)

```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Testing the Service

### 1. Check Health

Open your browser and go to:
```
http://localhost:8000/health
```

You should see:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "model": "gpt-4-turbo-preview"
}
```

### 2. Test with Example Request

**Using curl (Windows PowerShell):**
```powershell
$body = Get-Content example_request.json -Raw
Invoke-WebRequest -Uri http://localhost:8000/api/feedback -Method POST -Body $body -ContentType "application/json"
```

**Using curl (macOS/Linux):**
```bash
curl -X POST http://localhost:8000/api/feedback \
  -H "Content-Type: application/json" \
  -d @example_request.json
```

**Using Python:**
```bash
python test_agent.py
```

### 3. View API Documentation

Interactive API docs are available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Example Usage

### Python Client

```python
import requests

response = requests.post(
    "http://localhost:8000/api/feedback",
    json={
        "passage": "Your IELTS reading passage here...",
        "question": "What is the main idea?",
        "question_type": "Multiple Choice",
        "correct_answer": "Option B",
        "student_answer": "Option B"
    }
)

result = response.json()
print(f"Is Correct: {result['is_correct']}")
print(f"Feedback: {result['feedback']}")
```

### JavaScript/TypeScript Client

```typescript
const response = await fetch('http://localhost:8000/api/feedback', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    passage: "Your IELTS reading passage here...",
    question: "What is the main idea?",
    question_type: "Multiple Choice",
    correct_answer: "Option B",
    student_answer: "Option B"
  })
});

const result = await response.json();
console.log('Is Correct:', result.is_correct);
console.log('Feedback:', result.feedback);
```

## Integration with Encore Backend

### Add to your TypeScript service

In `backend/ielts/reading.ts`:

```typescript
import axios from 'axios';

const FEEDBACK_SERVICE_URL = 'http://localhost:8000';

export const getReadingFeedback = api(
  { expose: true, method: "POST", path: "/reading/ai-feedback" },
  async (params: {
    passage: string;
    question: string;
    questionType: string;
    correctAnswer: string;
    studentAnswer: string;
  }): Promise<any> => {
    const response = await axios.post(
      `${FEEDBACK_SERVICE_URL}/api/feedback`,
      {
        passage: params.passage,
        question: params.question,
        question_type: params.questionType,
        correct_answer: params.correctAnswer,
        student_answer: params.studentAnswer
      }
    );
    
    return response.data;
  }
);
```

### Update your start script

Add to `start-app.ps1`:

```powershell
# Start Python Feedback Service
Write-Host "Starting AI Feedback Service..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd backend/agents; if (Test-Path venv) { .\venv\Scripts\activate }; python main.py"
)

Start-Sleep -Seconds 3
```

## Docker Deployment (Optional)

### Build and Run

```bash
# Build image
docker build -t ielts-feedback-agent .

# Run container
docker run -d \
  --name feedback-agent \
  -p 8000:8000 \
  -e OPENAI_API_KEY=your-api-key-here \
  ielts-feedback-agent
```

### Using Docker Compose

```bash
docker-compose up -d
```

## Troubleshooting

### Issue: "OPENAI_API_KEY not set"

**Solution:** Make sure you've created `.env` file with your API key:
```bash
echo "OPENAI_API_KEY=sk-your-key-here" > .env
```

### Issue: Port 8000 already in use

**Solution:** Change the port in `.env`:
```env
PORT=8001
```

Or specify a different port when running:
```bash
PORT=8001 python main.py
```

### Issue: Import errors

**Solution:** Make sure you're in the correct directory and virtual environment:
```bash
cd backend/agents
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Issue: Slow responses

**Solution:** 
1. Check your internet connection
2. Try using `gpt-3.5-turbo` for faster responses:
   ```env
   OPENAI_MODEL=gpt-3.5-turbo
   ```
3. Reduce MAX_TOKENS:
   ```env
   MAX_TOKENS=500
   ```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore API endpoints at `http://localhost:8000/docs`
- Run the test suite: `python test_agent.py`
- Customize prompts in `prompts.py`
- Integrate with your frontend

## Support

For issues or questions:
1. Check the logs for error messages
2. Review the [README.md](README.md) for detailed information
3. Contact the development team

---

**Happy coding! 🚀**

