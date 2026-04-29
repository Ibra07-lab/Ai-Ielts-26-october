# AI IELTS App Startup Script for PowerShell
# This script starts both the backend (Encore) and frontend (Vite) services
#
# Usage:
#   .\start-app.ps1          # Production mode (multi-worker, no reload)
#   .\start-app.ps1 -Dev     # Development mode (single worker, hot reload)

param(
    [switch]$Dev
)

if ($Dev) {
    Write-Host "Starting AI IELTS App (DEVELOPMENT mode)..." -ForegroundColor Yellow
} else {
    Write-Host "Starting AI IELTS App (PRODUCTION mode)..." -ForegroundColor Green
}

# ========================================
# CLEANUP: Kill old servers before starting new ones
# ========================================
Write-Host "Cleaning up old server processes..." -ForegroundColor Yellow

# Function to kill processes on a specific port
function Stop-ProcessOnPort {
    param([int]$Port)
    
    $connections = netstat -ano | Select-String ":$Port.*LISTENING"
    if ($connections) {
        $connections | ForEach-Object {
            if ($_ -match '\s+(\d+)\s*$') {
                $processId = $matches[1]
                try {
                    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    Write-Host "  Killed process $processId on port $Port" -ForegroundColor Gray
                } catch {
                    # Silently continue if process can't be killed
                }
            }
        }
    }
}

# Kill old servers on common ports
Stop-ProcessOnPort -Port 8001  # FastAPI Python port
Stop-ProcessOnPort -Port 8002  # FastAPI Python alternate port
Stop-ProcessOnPort -Port 4000  # Encore backend port
Stop-ProcessOnPort -Port 5173  # Vite frontend port

Write-Host "Cleanup complete. Starting fresh servers..." -ForegroundColor Green
Start-Sleep -Seconds 1

# ========================================
# START SERVERS
# ========================================

# Start Backend (Encore)
Write-Host "Starting Backend (Encore)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; encore run"

# Start Backend (FastAPI Python) - Using port 8002 for Task 1 routes
Write-Host "Starting Backend (FastAPI Python)..." -ForegroundColor Yellow
if ($Dev) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn main:app --reload --port 8002"
} else {
    # Production: 4 workers, no reload — handles ~20 concurrent AI evaluations
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn main:app --workers 4 --port 8002 --host 0.0.0.0"
}

# Start AI Tutor Backend (App) - Using port 8001 for Reading Mentor
Write-Host "Starting AI Tutor Backend (App)..." -ForegroundColor Yellow
if ($Dev) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd app; python -m uvicorn main:app --reload --port 8001"
} else {
    # Production: 2 workers for chat (lighter workload)
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd app; python -m uvicorn main:app --workers 2 --port 8001 --host 0.0.0.0"
}

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend (Vite)
Write-Host "Starting Frontend (Vite)..." -ForegroundColor Yellow
if ($Dev) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location frontend; bun install; bun run dev"
} else {
    # Production: build and serve with preview (or use Nginx/Caddy in real production)
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location frontend; bun install; bun run build; bun run preview --host 0.0.0.0"
}

Write-Host "`nAll services starting..." -ForegroundColor Green
if ($Dev) {
    Write-Host "  Mode:               DEVELOPMENT (hot reload)" -ForegroundColor Yellow
} else {
    Write-Host "  Mode:               PRODUCTION (multi-worker)" -ForegroundColor Green
    Write-Host "  Writing workers:    4" -ForegroundColor Green
    Write-Host "  AI Tutor workers:   2" -ForegroundColor Green
}
Write-Host "Backend (Encore):     http://localhost:4000" -ForegroundColor Cyan
Write-Host "Backend (FastAPI):    http://localhost:8002" -ForegroundColor Cyan
Write-Host "Frontend:             http://localhost:5173" -ForegroundColor Cyan
Write-Host "`nTask 1 API Docs:      http://localhost:8002/docs" -ForegroundColor Magenta
Write-Host "`nPress any key to exit this script..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
