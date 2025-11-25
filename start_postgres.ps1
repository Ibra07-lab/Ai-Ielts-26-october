# start_postgres.ps1
# Script to initialize and start PostgreSQL

Write-Host "Starting PostgreSQL..." -ForegroundColor Green

$PG_BIN = "C:\Program Files\PostgreSQL\18\bin"
$PG_DATA = "C:\Program Files\PostgreSQL\18\data"
$PG_PASSWORD = "ce347ea718c643fabe976ddae552b74b"

# Check if data directory exists
if (!(Test-Path $PG_DATA)) {
    Write-Host "Initializing PostgreSQL data directory..." -ForegroundColor Yellow
    & "$PG_BIN\initdb.exe" -D $PG_DATA -U postgres --pwfile=<(echo $PG_PASSWORD)
}

# Start PostgreSQL server
Write-Host "Starting PostgreSQL server..." -ForegroundColor Yellow
Start-Process "$PG_BIN\pg_ctl.exe" -ArgumentList "start", "-D", "$PG_DATA", "-l", "$PG_DATA\logfile" -WindowStyle Hidden

Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if running
$process = Get-Process postgres -ErrorAction SilentlyContinue
if ($process) {
    Write-Host "✅ PostgreSQL is running!" -ForegroundColor Green
}
else {
    Write-Host "❌ PostgreSQL failed to start" -ForegroundColor Red
}
