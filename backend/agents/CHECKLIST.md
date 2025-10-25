# Setup and Verification Checklist

Use this checklist to ensure the IELTS Reading Feedback Agent is properly installed and configured.

## ✅ Pre-Installation Checklist

- [ ] Python 3.11+ installed
  ```bash
  python --version
  # Should show: Python 3.11.x or higher
  ```

- [ ] pip installed and updated
  ```bash
  python -m pip --version
  ```

- [ ] OpenAI API key obtained
  - [ ] Account created at https://platform.openai.com
  - [ ] API key generated
  - [ ] Billing configured (if required)

- [ ] Internet connection available
  - Required for downloading dependencies
  - Required for OpenAI API calls

## 📦 Installation Checklist

- [ ] Navigated to agents directory
  ```bash
  cd backend/agents
  ```

- [ ] Ran setup script
  - [ ] Windows: `.\setup.ps1`
  - [ ] macOS/Linux: `chmod +x setup.sh && ./setup.sh`

- [ ] Virtual environment created
  ```bash
  # Should see venv/ directory
  ls venv/  # or dir venv\ on Windows
  ```

- [ ] Dependencies installed
  ```bash
  # Activate venv first
  # Windows: .\venv\Scripts\Activate.ps1
  # macOS/Linux: source venv/bin/activate
  
  pip list | grep langchain
  # Should show: langchain, langchain-openai, langchain-core
  ```

- [ ] Environment file created
  - [ ] `.env` file exists
  - [ ] Contains OPENAI_API_KEY
  - [ ] API key is valid (starts with sk-)

## 🚀 First Run Checklist

- [ ] Service starts without errors
  ```bash
  python main.py
  # Should show: "Agent initialized successfully"
  ```

- [ ] Health check passes
  - Open browser: http://localhost:8000/health
  - [ ] Status: "healthy"
  - [ ] Model: "gpt-4-turbo-preview"

- [ ] API docs accessible
  - [ ] Swagger UI: http://localhost:8000/docs
  - [ ] Shows POST /api/feedback endpoint
  - [ ] Shows POST /api/feedback/batch endpoint

- [ ] Root endpoint works
  - [ ] http://localhost:8000/ shows API information

## 🧪 Testing Checklist

- [ ] Test script runs successfully
  ```bash
  python test_agent.py
  ```
  - [ ] Agent initializes
  - [ ] All 5 test cases pass
  - [ ] No errors in output

- [ ] Manual API test works
  ```bash
  # Windows PowerShell
  $body = Get-Content example_request.json -Raw
  Invoke-WebRequest -Uri http://localhost:8000/api/feedback -Method POST -Body $body -ContentType "application/json"
  
  # macOS/Linux
  curl -X POST http://localhost:8000/api/feedback \
    -H "Content-Type: application/json" \
    -d @example_request.json
  ```
  - [ ] Response received
  - [ ] Contains `is_correct` field
  - [ ] Contains `feedback` text
  - [ ] Contains `reasoning` text

- [ ] Response quality check
  - [ ] Feedback is relevant to the question
  - [ ] Reasoning references passage content
  - [ ] Strategy tip is educational
  - [ ] Passage reference is an actual quote

## 📊 Quality Assurance Checklist

### Response Validation

Test with different question types:

- [ ] Multiple Choice
  - [ ] Correct answer → is_correct: true
  - [ ] Incorrect answer → is_correct: false
  - [ ] Feedback explains why

- [ ] True/False/Not Given
  - [ ] True statement → correct evaluation
  - [ ] False statement → correct evaluation
  - [ ] Not Given → correct evaluation

- [ ] Short Answer Questions
  - [ ] Exact match → correct
  - [ ] Paraphrase → evaluated appropriately
  - [ ] Spelling errors → evaluated per IELTS rules

### Anti-Hallucination Check

- [ ] Feedback only references passage content
- [ ] No external knowledge introduced
- [ ] Passage references are actual quotes
- [ ] "Not Given" responses when appropriate

## 🔌 Integration Checklist

### Backend Integration (Optional)

- [ ] axios installed in backend
  ```bash
  cd backend
  npm install axios
  ```

- [ ] FEEDBACK_SERVICE_URL configured
  - [ ] Added to backend .env file
  - [ ] Points to http://localhost:8000

- [ ] Integration code added to reading.ts
  - [ ] See INTEGRATION_EXAMPLE.ts
  - [ ] `getReadingAIFeedback` endpoint created
  - [ ] Error handling implemented

- [ ] Both services start together
  - [ ] Updated start-app.ps1
  - [ ] Python service starts first
  - [ ] Encore backend starts after

### Frontend Integration (Optional)

- [ ] Frontend can call feedback endpoint
  ```typescript
  const feedback = await backend.ielts.getReadingAIFeedback({...});
  ```

- [ ] Loading states implemented
- [ ] Error handling in place
- [ ] Feedback displayed to user
- [ ] Strategy tips shown

## 🐳 Docker Checklist (Optional)

- [ ] Docker installed
  ```bash
  docker --version
  ```

- [ ] Docker image builds
  ```bash
  docker build -t ielts-feedback-agent .
  ```

- [ ] Container runs
  ```bash
  docker run -d \
    --name feedback-agent \
    -p 8000:8000 \
    -e OPENAI_API_KEY=your-key \
    ielts-feedback-agent
  ```

- [ ] Container is healthy
  ```bash
  docker ps
  # Should show: STATUS "healthy"
  ```

- [ ] Docker Compose works
  ```bash
  docker-compose up -d
  # Should start service successfully
  ```

## 🔒 Security Checklist

- [ ] .env file NOT committed to git
  ```bash
  git status
  # Should NOT show .env
  ```

- [ ] API key kept secret
  - [ ] Not in code
  - [ ] Not in logs
  - [ ] Not in error messages

- [ ] CORS configured appropriately
  - [ ] Development: `CORS_ORIGINS=*` OK
  - [ ] Production: Specific origins only

- [ ] Rate limiting considered (for production)

## 📈 Performance Checklist

- [ ] Response times acceptable
  - [ ] Single feedback: 2-5 seconds
  - [ ] Batch of 10: 20-50 seconds
  - [ ] No timeouts

- [ ] OpenAI API usage monitored
  - [ ] Check usage at https://platform.openai.com/usage
  - [ ] Costs within budget
  - [ ] No rate limit errors

- [ ] Logs are clean
  - [ ] No repeated errors
  - [ ] Success messages for requests
  - [ ] Appropriate log levels

## 📚 Documentation Checklist

- [ ] README.md reviewed
- [ ] QUICKSTART.md followed
- [ ] INTEGRATION_EXAMPLE.ts understood
- [ ] STRUCTURE.md reviewed

## ✨ Final Verification

Run this comprehensive test:

```bash
# 1. Ensure virtual environment is activated
# Windows: .\venv\Scripts\Activate.ps1
# macOS/Linux: source venv/bin/activate

# 2. Verify Python packages
pip list | grep -E "langchain|openai|fastapi"

# 3. Check environment variables
# Windows: Get-Content .env
# macOS/Linux: cat .env

# 4. Start service
python main.py &

# 5. Wait for startup
sleep 5

# 6. Health check
curl http://localhost:8000/health

# 7. Run tests
python test_agent.py

# 8. Check logs for errors
# Should see: "Agent initialized successfully"
# Should see: "Feedback generated successfully"
```

## ✅ Success Criteria

You have successfully set up the feedback agent if:

1. ✅ Service starts without errors
2. ✅ Health endpoint returns "healthy"
3. ✅ Test script shows all PASS
4. ✅ API docs are accessible
5. ✅ Sample request returns valid feedback
6. ✅ Feedback references passage content only
7. ✅ Response times are acceptable (2-5 sec)
8. ✅ No errors in logs

## 🐛 Troubleshooting

If any checklist item fails, see:

- [ ] README.md - Troubleshooting section
- [ ] QUICKSTART.md - Common issues
- [ ] Logs in console output
- [ ] OpenAI API status page

## 🎉 Ready for Production?

Additional checklist for production deployment:

- [ ] Rate limiting implemented
- [ ] Monitoring/alerting configured
- [ ] Error tracking (e.g., Sentry)
- [ ] Load testing completed
- [ ] Backup/failover strategy
- [ ] Documentation updated
- [ ] Team trained on usage
- [ ] Cost monitoring in place

---

## Quick Status Check

Run this one-liner to check everything:

**Windows PowerShell:**
```powershell
Write-Host "Checking installation..." -ForegroundColor Yellow
if (Test-Path .env) { Write-Host "✅ .env exists" -ForegroundColor Green } else { Write-Host "❌ .env missing" -ForegroundColor Red }
if (Test-Path venv) { Write-Host "✅ venv exists" -ForegroundColor Green } else { Write-Host "❌ venv missing" -ForegroundColor Red }
try { $health = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get; Write-Host "✅ Service healthy: $($health.status)" -ForegroundColor Green } catch { Write-Host "❌ Service not running" -ForegroundColor Red }
```

**macOS/Linux:**
```bash
echo "Checking installation..."
[ -f .env ] && echo "✅ .env exists" || echo "❌ .env missing"
[ -d venv ] && echo "✅ venv exists" || echo "❌ venv missing"
curl -s http://localhost:8000/health > /dev/null && echo "✅ Service healthy" || echo "❌ Service not running"
```

---

**Last Updated:** October 22, 2025  
**Version:** 1.0.0

