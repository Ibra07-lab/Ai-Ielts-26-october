# setup_database.ps1
# Run this script after PostgreSQL installation completes

Write-Host "PostgreSQL Setup for IELTS Tutor" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Auto-generated password from installation
$PG_PASSWORD = "ce347ea718c643fabe976ddae552b74b"

Write-Host "`n1. Updating .env file with database credentials..." -ForegroundColor Yellow

# Update .env file
$envPath = "app\.env"
$envContent = Get-Content $envPath -Raw
if ($envContent -notmatch "DATABASE_URL") {
    Add-Content $envPath "`nDATABASE_URL=postgresql+asyncpg://postgres:$PG_PASSWORD@localhost:5432/ielts_tutor"
    Write-Host "   ✅ DATABASE_URL added to .env" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  DATABASE_URL already exists in .env" -ForegroundColor Yellow
}

Write-Host "`n2. Creating database..." -ForegroundColor Yellow
# Wait for PostgreSQL to be ready
Start-Sleep -Seconds 5

# Set password environment variable
$env:PGPASSWORD = $PG_PASSWORD

# Create database
$createDbCommand = "CREATE DATABASE ielts_tutor;"
echo $createDbCommand | & 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -U postgres -h localhost 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Database 'ielts_tutor' created successfully" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Database might already exist or there was an issue" -ForegroundColor Yellow
}

Write-Host "`n3. Running migrations..." -ForegroundColor Yellow
python -m migrations.run_migrations

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nYou can now restart your application with database persistence enabled." -ForegroundColor Cyan
