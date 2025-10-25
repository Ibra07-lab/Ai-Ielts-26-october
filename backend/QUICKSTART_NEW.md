# Quick Start - New Features

Get the IELTS Reading API with Vector Store running in 3 minutes.

## Prerequisites

- Python 3.11+
- OpenAI API key (already in your .env)

## Installation

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

This installs:
- LangChain with OpenAI and Community extensions
- ChromaDB for vector storage
- FastAPI for the API server

### 3. Check environment variables

Make sure your `.env` file (or `.env.template`) has:
```env
OPENAI_API_KEY=sk-your-actual-key
OPENAI_MODEL=gpt-4-turbo-preview
EXPLAIN_MODEL=gpt-4o-mini
TEMPERATURE=0.2
MAX_TOKENS=1000
PORT=8000
```

## Start the Service

```bash
python main.py
```

You should see:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## Test It

### 1. Check Health
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "feedback_model": "gpt-4-turbo-preview",
  "explain_model": "gpt-4o-mini",
  "vector_store_count": 0
}
```

### 2. Test Explain (NEW Feature)

```bash
# Windows PowerShell
$body = Get-Content test_explain.json -Raw
Invoke-WebRequest -Uri http://localhost:8000/api/explain -Method POST -Body $body -ContentType "application/json"

# macOS/Linux
curl -X POST http://localhost:8000/api/explain \
  -H "Content-Type: application/json" \
  -d @test_explain.json
```

Expected response:
```json
{
  "word": "Arctic amplification",
  "definition": "A phenomenon where the Arctic region warms faster than the rest of the planet",
  "context_meaning": "In this passage, it refers to the Arctic warming at twice the rate of the global average",
  "example_sentence": "Arctic amplification is causing rapid melting of sea ice."
}
```

### 3. Add Passage to Vector Store (NEW Feature)

```bash
# Windows PowerShell
$body = Get-Content example_add_passage.json -Raw
Invoke-WebRequest -Uri http://localhost:8000/api/passages/add -Method POST -Body $body -ContentType "application/json"

# macOS/Linux
curl -X POST http://localhost:8000/api/passages/add \
  -H "Content-Type: application/json" \
  -d @example_add_passage.json
```

Expected response:
```json
{
  "success": true,
  "message": "Passage added successfully",
  "doc_id": "abc123xyz"
}
```

### 4. Test Feedback (Existing Feature)

```bash
curl -X POST http://localhost:8000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "passage": "The Arctic is experiencing unprecedented changes due to climate change. Scientists have observed that the region is warming at twice the rate of the global average.",
    "question": "How fast is the Arctic warming compared to global average?",
    "question_type": "Short Answer",
    "correct_answer": "Twice the rate",
    "student_answer": "Two times faster"
  }'
```

## API Documentation

Open your browser and go to:
**http://localhost:8000/docs**

You'll see interactive Swagger UI where you can:
- View all endpoints
- Test requests directly in browser
- See request/response schemas
- Download OpenAPI spec

## What's Available

### Feedback Endpoint (Existing)
`POST /api/feedback` - Get AI feedback on student answers
- Uses GPT-4 Turbo
- Detailed reasoning and strategy tips
- Based on IELTS standards

### Explain Endpoint (NEW)
`POST /api/explain` - Explain vocabulary from passages
- Uses GPT-4o-mini (faster, cheaper)
- Context-specific definitions
- Example sentences

### Vector Store Endpoints (NEW)
- `POST /api/passages/add` - Add passages to database
- `POST /api/passages/search` - Semantic search for passages
- `GET /api/passages/all` - List all passages

## Common Issues

### Import Error
```
ModuleNotFoundError: No module named 'langchain_community'
```

**Fix**: Install dependencies
```bash
pip install -r requirements.txt
```

### ChromaDB Error
```
Error in ChromaDB initialization
```

**Fix**: Delete the database and restart
```bash
rm -rf chroma_db/
python main.py
```

### OpenAI API Error
```
AuthenticationError: Invalid API key
```

**Fix**: Check your .env file has correct API key
```bash
cat .env | grep OPENAI_API_KEY
```

## Next Steps

1. ✅ **Bulk Import**: Add all passages from `data/reading-tests/`
2. ✅ **Frontend Integration**: Connect React app to these endpoints
3. ✅ **Test More**: Try different question types and passages
4. ✅ **Customize**: Adjust prompts in `agents/explain_prompts.py`

## Directory Reference

```
backend/
├── main.py                    ← Start this file
├── requirements.txt           ← Dependencies
├── .env                       ← Your API keys
├── test_explain.json          ← Test data
├── example_add_passage.json   ← Test data
└── agents/
    ├── reading_feedback_agent.py  ← Feedback logic
    ├── explain_agent.py           ← NEW: Explain logic
    └── vector_store.py            ← NEW: ChromaDB storage
```

## Parallel Implementation

You can run BOTH implementations:

**Simple version** (this one):
```bash
cd backend
python main.py  # Port 8000
```

**Comprehensive version** (original):
```bash
cd backend/agents
python main.py  # Port 8000 (change if needed)
```

---

**Ready to go!** 🚀

For complete documentation, see:
- **README_NEW.md** - Full API docs
- **IMPLEMENTATION_COMPLETE.md** - Implementation details
- **http://localhost:8000/docs** - Interactive API docs


