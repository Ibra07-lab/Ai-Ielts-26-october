# Cleanup Script - Kill All Server Processes
# Run this if you need to manually clean up stuck server processes

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Server Cleanup Utility" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Function to kill processes on a specific port
function Stop-ProcessOnPort {
    param(
        [int]$Port,
        [string]$ServiceName
    )
    
    Write-Host "Checking port $Port ($ServiceName)..." -ForegroundColor Yellow
    
    $connections = netstat -ano | Select-String ":$Port.*LISTENING"
    $killedCount = 0
    
    if ($connections) {
        $connections | ForEach-Object {
            if ($_ -match '\s+(\d+)\s*$') {
                $pid = $matches[1]
                try {
                    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                    if ($process) {
                        $processName = $process.ProcessName
                        Stop-Process -Id $pid -Force -ErrorAction Stop
                        Write-Host "  ✓ Killed $processName (PID: $pid)" -ForegroundColor Green
                        $killedCount++
                    }
                } catch {
                    Write-Host "  ✗ Could not kill PID $pid (may be protected)" -ForegroundColor Red
                }
            }
        }
        
        if ($killedCount -eq 0) {
            Write-Host "  ⚠ Found processes but couldn't kill them (protected)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ✓ No processes found on port $Port" -ForegroundColor Gray
    }
}

# Kill servers on all common ports
Stop-ProcessOnPort -Port 4000 -ServiceName "Encore Backend"
Stop-ProcessOnPort -Port 8001 -ServiceName "FastAPI (old)"
Stop-ProcessOnPort -Port 8002 -ServiceName "FastAPI (new)"
Stop-ProcessOnPort -Port 5173 -ServiceName "Vite Frontend"

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Cleanup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now run ./start-app.ps1 to start fresh servers." -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
