# Fixed Installation Guide

## Problem Fixed

1. **ChromaDB → FAISS**: Replaced ChromaDB with FAISS-CPU (no compiler needed on Windows)
2. **Import Error**: Fixed relative import issues in agents/main.py

## Installation Steps

### 1. Navigate to backend directory
```powershell
cd backend
```

### 2. Install dependencies
```powershell
pip install -r requirements.txt
```

This now installs FAISS instead of ChromaDB - no Rust compiler needed!

### 3. Check your .env file

Make sure you have `.env` in the `backend` directory (not `backend/agents`):

```env
OPENAI_API_KEY=sk-your-actual-key-here
OPENAI_MODEL=gpt-4-turbo-preview
EXPLAIN_MODEL=gpt-4o-mini
TEMPERATURE=0.2
MAX_TOKENS=1000
PORT=8000
```

If you don't have it, copy from template:
```powershell
# If .env.template doesn't exist, create it
cp agents/env.template .env
# or
copy agents\env.template .env
```

### 4. Run the service

**From the backend directory**, run:
```powershell
python main.py
```

**NOT** from `backend/agents` directory!

## Two Versions Available

### Simple Version (NEW - with FAISS vector store)
```powershell
cd backend
python main.py
```

Endpoints:
- POST /api/feedback - AI feedback
- POST /api/explain - Explain vocabulary
- POST /api/passages/add - Add passage to FAISS
- POST /api/passages/search - Search relevant context
- GET /health

### Comprehensive Version (Original)
```powershell
cd backend
python -m agents.main
```

This runs the comprehensive version as a module.

## Testing

### 1. Check health
```powershell
curl http://localhost:8000/health
```

### 2. Test explain
```powershell
$body = Get-Content test_explain.json -Raw
Invoke-WebRequest -Uri http://localhost:8000/api/explain -Method POST -Body $body -ContentType "application/json"
```

### 3. Add passage to FAISS
```powershell
$body = Get-Content example_add_passage.json -Raw
Invoke-WebRequest -Uri http://localhost:8000/api/passages/add -Method POST -Body $body -ContentType "application/json"
```

### 4. Search relevant context
```powershell
$body = @"
{
  "passage_id": "test-1-passage-1",
  "query": "When did industrial revolution begin?",
  "k": 2
}
"@
Invoke-WebRequest -Uri http://localhost:8000/api/passages/search -Method POST -Body $body -ContentType "application/json"
```

## What Changed

### FAISS vs ChromaDB

**FAISS** (Facebook AI Similarity Search):
- ✅ Pure Python + NumPy (no compiler needed)
- ✅ Fast similarity search
- ✅ Saves to local files
- ✅ Works on Windows without issues

**ChromaDB** (removed):
- ❌ Requires Rust compiler
- ❌ Installation problems on Windows
- ❌ Overkill for this use case

### New Vector Store API

The FAISS vector store works differently:

**Old (ChromaDB)**:
- Store multiple passages in one database
- Search across all passages

**New (FAISS)**:
- Each passage has its own FAISS index
- Search within a specific passage for relevant context
- Better for question-answering (find relevant parts of passage)

### Updated Endpoints

**POST /api/passages/add**
```json
{
  "passage_id": "test-1-passage-1",
  "passage_text": "...",
  "title": "Industrial Revolution",
  "test_id": 1,
  "level": "academic"
}
```

**POST /api/passages/search**
```json
{
  "passage_id": "test-1-passage-1",
  "query": "When did it begin?",
  "k": 2
}
```

Returns 2 most relevant text chunks from that passage.

**GET /api/passages/check/{passage_id}**
Check if a passage exists in FAISS.

## Directory Structure

```
backend/
├── main.py                 ← Run this!
├── requirements.txt        ← Updated (FAISS instead of ChromaDB)
├── .env                    ← Your API keys
├── test_explain.json
├── example_add_passage.json ← Updated format
├── agents/
│   ├── vector_store.py     ← Now uses FAISS!
│   ├── explain_agent.py
│   ├── reading_feedback_agent.py
│   └── ...
└── data/
    └── faiss_db/          ← FAISS indexes stored here
        └── test-1-passage-1/  ← Each passage gets a folder
```

## Troubleshooting

### Still getting import errors?

Make sure you're running from the **backend** directory:
```powershell
cd c:\Users\Honor\app\ai-ielts-app\backend
python main.py
```

### FAISS not installing?

Try:
```powershell
pip install --upgrade pip
pip install faiss-cpu==1.7.4
```

### OpenAI API error?

Check your .env file:
```powershell
type .env
```

Make sure `OPENAI_API_KEY` is set correctly.

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

**All fixed! No compiler needed. Ready to use.** 🎉


