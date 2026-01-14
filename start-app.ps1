# AI IELTS App Startup Script for PowerShell
# This script starts both the backend (Encore) and frontend (Vite) services

Write-Host "Starting AI IELTS App..." -ForegroundColor Green

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
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn main:app --reload --port 8002"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend (Vite)
Write-Host "Starting Frontend (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location frontend; bun install; bun run dev"

Write-Host "`nAll services starting..." -ForegroundColor Green
Write-Host "Backend (Encore):     http://localhost:4000" -ForegroundColor Cyan
Write-Host "Backend (FastAPI):    http://localhost:8002" -ForegroundColor Cyan
Write-Host "Frontend:             http://localhost:5173" -ForegroundColor Cyan
Write-Host "`nTask 1 API Docs:      http://localhost:8002/docs" -ForegroundColor Magenta
Write-Host "`nPress any key to exit this script..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
