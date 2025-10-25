# IELTS Reading Feedback API - New Features

AI-powered feedback system with vector storage and text explanation for IELTS Reading practice.

## Features

### 1. Feedback Agent
Provides detailed AI feedback on student answers using GPT-4 Turbo.

### 2. Explain Agent
Explains vocabulary and phrases from passages using GPT-4o-mini.

### 3. Vector Store
Stores passages in ChromaDB for semantic search and retrieval.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview
EXPLAIN_MODEL=gpt-4o-mini
TEMPERATURE=0.2
MAX_TOKENS=1000
PORT=8000
```

### 3. Run the Service

```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check

**GET** `/health`

Check service status.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "feedback_model": "gpt-4-turbo-preview",
  "explain_model": "gpt-4o-mini",
  "vector_store_count": 5
}
```

### Get Feedback

**POST** `/api/feedback`

Get AI feedback on a student's answer.

**Request:**
```json
{
  "passage": "The Arctic is experiencing unprecedented changes...",
  "question": "How fast is the Arctic warming?",
  "question_type": "Short Answer",
  "correct_answer": "Twice the rate",
  "student_answer": "Two times faster"
}
```

**Response:**
```json
{
  "is_correct": true,
  "feedback": "Your answer is correct! 'Two times faster' is equivalent to 'twice the rate'.",
  "reasoning": "The passage states the Arctic is warming at twice the rate of the global average. Your answer 'two times faster' expresses the same concept using different words.",
  "strategy_tip": "For short answer questions, remember that synonyms and paraphrasing are often acceptable if they convey the same meaning.",
  "passage_reference": "the region is warming at twice the rate of the global average"
}
```

### Explain Text

**POST** `/api/explain`

Explain a word or phrase from a passage.

**Request:**
```json
{
  "passage": "The Arctic is experiencing unprecedented changes due to climate change. Scientists have observed that the region is warming at twice the rate of the global average, a phenomenon known as Arctic amplification.",
  "selected_text": "Arctic amplification"
}
```

**Response:**
```json
{
  "word": "Arctic amplification",
  "definition": "A phenomenon where the Arctic region warms at a faster rate than the rest of the planet.",
  "context_meaning": "In this passage, it refers to the scientific observation that the Arctic is warming twice as fast as the global average.",
  "example_sentence": "Arctic amplification is causing rapid melting of sea ice in polar regions."
}
```

**Test with:**
```bash
curl -X POST http://localhost:8000/api/explain \
  -H "Content-Type: application/json" \
  -d @test_explain.json
```

### Add Passage to Vector Store

**POST** `/api/passages/add`

Add a reading passage to the vector database for semantic search.

**Request:**
```json
{
  "passage_text": "The Industrial Revolution, which began in Britain...",
  "test_id": 1,
  "passage_id": 1,
  "title": "The Industrial Revolution",
  "level": "academic"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Passage added successfully",
  "doc_id": "abc123xyz"
}
```

**Test with:**
```bash
curl -X POST http://localhost:8000/api/passages/add \
  -H "Content-Type: application/json" \
  -d @example_add_passage.json
```

### Search Passages

**POST** `/api/passages/search`

Search for similar passages using semantic search.

**Request:**
```json
{
  "query": "industrial revolution technology",
  "k": 3,
  "level": "academic"
}
```

**Response:**
```json
[
  {
    "text": "The Industrial Revolution, which began in Britain...",
    "metadata": {
      "test_id": 1,
      "passage_id": 1,
      "title": "The Industrial Revolution",
      "level": "academic"
    }
  }
]
```

### Get All Passages

**GET** `/api/passages/all?limit=100`

Retrieve all passages from the vector store.

**Response:**
```json
[
  {
    "text": "The Industrial Revolution...",
    "metadata": {
      "test_id": 1,
      "passage_id": 1,
      "title": "The Industrial Revolution",
      "level": "academic"
    }
  }
]
```

## Testing

### Test Feedback Endpoint

```bash
curl -X POST http://localhost:8000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "passage": "The Arctic is experiencing unprecedented changes...",
    "question": "How fast is the Arctic warming?",
    "question_type": "Short Answer",
    "correct_answer": "Twice the rate",
    "student_answer": "Two times faster"
  }'
```

### Test Explain Endpoint

```bash
curl -X POST http://localhost:8000/api/explain \
  -H "Content-Type: application/json" \
  -d @test_explain.json
```

### Test Add Passage

```bash
curl -X POST http://localhost:8000/api/passages/add \
  -H "Content-Type: application/json" \
  -d @example_add_passage.json
```

## API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Architecture

```
backend/
├── agents/
│   ├── reading_feedback_agent.py  # Feedback analysis
│   ├── explain_agent.py           # Text explanation
│   ├── vector_store.py            # ChromaDB storage
│   ├── prompts.py                 # Feedback prompts
│   └── explain_prompts.py         # Explain prompts
├── main.py                        # FastAPI application
├── requirements.txt               # Dependencies
└── .env                          # Configuration
```

## Models Used

- **Feedback**: `gpt-4-turbo-preview` (high accuracy for grading)
- **Explain**: `gpt-4o-mini` (faster, cheaper for explanations)
- **Embeddings**: `text-embedding-3-small` (for vector search)

## Vector Store

The vector store uses ChromaDB to store passages with semantic embeddings. This enables:
- Semantic search for similar passages
- Quick retrieval of relevant content
- Metadata filtering (by test, level, etc.)

Data is persisted in `./chroma_db/` directory.

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `500 Internal Server Error` - Server error

Error responses include detailed messages:
```json
{
  "detail": "Failed to generate feedback: OpenAI API error"
}
```

## Performance

- **Feedback**: ~2-5 seconds (GPT-4 Turbo)
- **Explain**: ~1-3 seconds (GPT-4o-mini)
- **Vector Search**: <1 second (local ChromaDB)

## Cost Estimation

Per 1000 requests (approximate):
- **Feedback**: $10-30 (GPT-4 Turbo)
- **Explain**: $1-3 (GPT-4o-mini)
- **Embeddings**: $0.10 (text-embedding-3-small)

## Next Steps

1. **Bulk Import**: Add script to import all passages from `backend/data/reading-tests/`
2. **Caching**: Implement response caching for common queries
3. **Rate Limiting**: Add rate limiting for production
4. **Frontend Integration**: Connect to React frontend
5. **Analytics**: Track usage and feedback quality

## Troubleshooting

### Import Error: No module named 'agents'

Make sure you're running from the `backend/` directory:
```bash
cd backend
python main.py
```

### OpenAI API Error

Check your `.env` file has a valid API key:
```bash
cat .env | grep OPENAI_API_KEY
```

### ChromaDB Error

Delete the database and restart:
```bash
rm -rf chroma_db/
python main.py
```

## Support

For issues or questions, see:
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

## License

Part of the AI IELTS App project.

