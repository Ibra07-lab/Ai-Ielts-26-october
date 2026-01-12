# Server Management Guide

## Quick Start

### Start All Services
```powershell
./start-app.ps1
```

This will:
1. **Automatically kill** any old servers on ports 4000, 8001, 8002, 5173
2. Start **Encore backend** (port 4000)
3. Start **FastAPI backend** (port 8002) - with Task 1 routes
4. Start **Vite frontend** (port 5173)

### Manual Cleanup Only
If servers are stuck or you just want to clean up:
```powershell
./cleanup-servers.ps1
```

---

## Port Allocation

| Service | Port | Purpose |
|---------|------|---------|
| Encore Backend | 4000 | Main backend API |
| FastAPI Backend | 8002 | IELTS Writing evaluation (Task 1 & 2) |
| Vite Frontend | 5173 | React application |

---

## Common Issues

### Issue 1: "Port Already in Use"
**Cause:** Old server processes are protected and couldn't be killed automatically.

**Solution:**
1. Press **Alt+Tab** to find PowerShell windows with green "INFO:" text
2. Press **Ctrl+C** in each window to stop servers
3. Run `./start-app.ps1` again

### Issue 2: "Failed to initialize agent: API key not found"
**Cause:** Missing environment variables in `backend/.env`

**Solution:**
Create/edit `backend/.env` and add:
```env
ANTHROPIC_API_KEY=your_anthropic_key_here
OPENAI_API_KEY=your_openai_key_here
IELTS_WRITING_MODEL=claude-sonnet-4-5-20250929
```

### Issue 3: Task 1 Essays Return 404
**Cause:** FastAPI server not running or frontend pointing to wrong port.

**Solution:**
1. Verify server is running: `http://localhost:8002/docs`
2. Check frontend uses port 8002 for Task 1 (in `WritingTask.tsx`)
3. Restart servers with `./start-app.ps1`

---

## API Documentation

- **FastAPI Docs (Swagger):** `http://localhost:8002/docs`
- **Task 1 Health Check:** `http://localhost:8002/task1/health`
- **Encore Dashboard:** `http://localhost:4000` (when Encore is running)

---

## Manual Port Checking

To see what's running on each port:
```powershell
netstat -ano | findstr ":8002"
netstat -ano | findstr ":4000"
netstat -ano | findstr ":5173"
```

---

## Architecture Notes

### Why Two Backend Servers?

- **Encore (Port 4000):** Handles general app logic (reading practice, vocabulary, etc.)
- **FastAPI (Port 8002):** Handles AI-powered writing evaluation with LLM agents

Both are needed and work together. The frontend talks to both services.

### Task 1 vs Task 2

- **Task 1:** Uses new `/task1/evaluate` endpoint with enhanced prompts and calibration
- **Task 2:** Uses existing `/ielts_writing/evaluate` endpoint

Both run on the same FastAPI server (port 8002).
