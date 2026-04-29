# Backend Startup Script with Process Management
# Automatically handles cleanup and validation

Write-Host "🚀 IELTS Writing API - Backend Startup" -ForegroundColor Cyan
Write-Host "=" * 60

# =============================================================================
# Step 1: Kill existing processes on port 8002
# =============================================================================
Write-Host "`n🔍 Checking for existing processes on port 8002..." -ForegroundColor Yellow

$connections = Get-NetTCPConnection -LocalPort 8002 -ErrorAction SilentlyContinue
if ($connections) {
    $processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    Write-Host "⚠️  Found $($processIds.Count) process(es) using port 8002" -ForegroundColor Yellow

    foreach ($p in $processIds) {
        try {
            $process = Get-Process -Id $p -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "   Stopping process: $($process.Name) (PID: $p)" -ForegroundColor Gray
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
        } catch {
            Write-Host "   Could not stop PID $pid (may be already stopped)" -ForegroundColor Gray
        }
    }
    
    Write-Host "✅ Port 8002 cleanup complete" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "✅ Port 8002 is free" -ForegroundColor Green
}

# =============================================================================
# Step 2: Validate .env file exists
# =============================================================================
Write-Host "`n🔍 Checking configuration..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    Write-Host "❌ ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "`nPlease create .env file:" -ForegroundColor Yellow
    Write-Host "  1. Copy .env.example to .env" -ForegroundColor White
    Write-Host "  2. Fill in your API keys" -ForegroundColor White
    Write-Host "`nExample:" -ForegroundColor Yellow
    Write-Host "  copy .env.example .env" -ForegroundColor Gray
    Write-Host "  notepad .env" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ .env file found" -ForegroundColor Green

# =============================================================================
# Step 3: Check Python is available
# =============================================================================
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Python not found!" -ForegroundColor Red
    Write-Host "   Please install Python 3.8 or higher" -ForegroundColor Yellow
    exit 1
}

# =============================================================================
# Step 4: Start the backend
# =============================================================================
Write-Host "`n🚀 Starting backend on port 8002..." -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host ""

# Check for --dev flag
$isDev = $args -contains "--dev" -or $args -contains "-Dev"

if ($isDev) {
    Write-Host "  Mode: DEVELOPMENT (hot reload, 1 worker)" -ForegroundColor Yellow
    python -m uvicorn main:app --reload --port 8002
} else {
    Write-Host "  Mode: PRODUCTION (4 workers, no reload)" -ForegroundColor Green
    Write-Host "  Handles ~20 concurrent AI evaluations" -ForegroundColor Green
    python -m uvicorn main:app --workers 4 --port 8002 --host 0.0.0.0
}

# This line will only execute if uvicorn exits
Write-Host "`n⚠️  Backend stopped" -ForegroundColor Yellow
