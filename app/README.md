# IELTS AI Tutor - FastAPI Backend

This is the FastAPI backend for the IELTS AI Reading Tutor with intelligent chat routing.

## Setup

### 1. Install Dependencies

```bash
cd app
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `app` directory:

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```

You can get your OpenAI API key from: https://platform.openai.com/api-keys

### 3. Run the Server

**Recommended: Run directly with Python**
```bash
cd app
python main.py
```

**Alternative: Using uvicorn with auto-reload**
```bash
cd app
python -m uvicorn main:app --reload --port 8000
```

The API will be available at: `http://localhost:8000`

**Test the API:**
- Health check: http://localhost:8000/health
- Swagger UI (interactive docs): http://localhost:8000/docs
- ReDoc (alternative docs): http://localhost:8000/redoc

## API Endpoints

### Chat Message
- **POST** `/api/chat/message`
- Send a chat message and get AI tutor response
- Request body:
  ```json
  {
    "session_id": "string",
    "messages": [
      {"role": "user|assistant|system", "content": "string"}
    ],
    "dropped_question_id": "string (optional)"
  }
  ```
- Response: `ChatMessage` object

### Deeper Feedback
- **POST** `/api/feedback/deeper`
- Get detailed feedback for a specific question
- Request body:
  ```json
  {
    "passage_id": "string",
    "question_id": "string",
    "student_answer": "string"
  }
  ```
- Response: `DeeperFeedbackResponse` object with error analysis, strategy tips, evidence, and motivation

### Health Check
- **GET** `/health`
- Returns: `{"status": "healthy"}`

## Project Structure

```
app/
├── api/
│   └── chat.py          # API router with endpoints
├── core/
│   └── config.py        # Configuration and settings
├── models/
│   └── chat_models.py   # Pydantic request/response models
├── services/
│   └── agent_service.py # AI agent logic with LangChain
├── prompts/
│   ├── deeper_feedback.txt
│   ├── hint_generation.txt
│   └── tutor_router.txt
├── main.py              # FastAPI application entry point
└── requirements.txt     # Python dependencies
```

## Features

### Intelligent Routing
The AI tutor automatically routes user requests to appropriate handlers:
- **GENERATE_EXPLANATION**: Full explanation of why an answer was wrong
- **GENERATE_HINT**: Small clues without giving away the answer
- **ASK_SOCRATIC_QUESTION**: Questions to make students think critically
- **ANSWER_GENERAL_QUESTION**: General IELTS reading strategies
- **CHITCHAT**: Casual conversation and encouragement

### LangChain Integration
- Uses GPT-4o for quality explanations
- Uses GPT-4o-mini for faster responses (hints, routing, general chat)
- Structured output parsing with Pydantic models
- Prompt templates from text files for easy modification

## Development

### API Documentation
When the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Adding New Endpoints
1. Add endpoint function to `app/api/chat.py`
2. Add Pydantic models to `app/models/chat_models.py`
3. Add business logic to `app/services/agent_service.py`

### Modifying Prompts
Edit the prompt templates in `app/prompts/`:
- `deeper_feedback.txt` - For detailed error analysis
- `hint_generation.txt` - For generating hints
- `tutor_router.txt` - For routing decisions

## Troubleshooting

### "Module not found" errors
Make sure you've installed all dependencies:
```bash
pip install -r requirements.txt
```

### OpenAI API errors
- Check that your `.env` file contains a valid `OPENAI_API_KEY`
- Ensure you have sufficient credits in your OpenAI account

### CORS errors from frontend
The backend is configured to allow requests from `localhost:5173` (Vite dev server). If you're using a different port, update the CORS settings in `main.py`.

