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
    
    try {
        $connections = netstat -ano | Select-String ":$Port.*LISTENING"
        $killedCount = 0
        
        if ($connections) {
            foreach ($line in $connections) {
                if ($line -match '\s+(\d+)\s*$') {
                    $procIdValue = $matches[1]
                    try {
                        $proc = Get-Process -Id $procIdValue -ErrorAction SilentlyContinue
                        if ($proc) {
                            $name = $proc.ProcessName
                            Stop-Process -Id $procIdValue -Force -ErrorAction Stop
                            Write-Host "  ✓ Killed $name (PID: $procIdValue)" -ForegroundColor Green
                            $killedCount++
                        }
                    }
                    catch {
                        Write-Host "  ✗ Could not kill PID $procIdValue" -ForegroundColor Red
                    }
                }
            }
            
            if ($killedCount -eq 0) {
                Write-Host "  ⚠ Processes found but none could be killed." -ForegroundColor Yellow
            }
        }
        else {
            Write-Host "  ✓ No processes found on port $Port" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "  ✗ Error checking port $Port" -ForegroundColor Red
    }
}

# Kill servers on common ports
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

# ReadKey can fail in non-interactive sessions, so we wrapped it
try {
    if ($null -ne $Host.UI.RawUI) {
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}
catch {}
