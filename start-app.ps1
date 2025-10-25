# AI IELTS App Startup Script for PowerShell
# This script starts both the backend (Encore) and frontend (Vite) services

Write-Host "Starting AI IELTS App..." -ForegroundColor Green

# Start Backend (Encore)
Write-Host "Starting Backend (Encore)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; encore run"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend (Vite)
Write-Host "Starting Frontend (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location frontend; bun install; bun run dev"

Write-Host "Both services should now be starting..." -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Press any key to exit this script..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
