# IELTS Reading Feedback Agent - Setup Script
# This script automates the setup process for Windows PowerShell

$ErrorActionPreference = "Stop"

Write-Host "=============================================="
Write-Host "IELTS Reading Feedback Agent - Setup"
Write-Host "=============================================="
Write-Host ""

# Check Python version
Write-Host "Checking Python version..." -ForegroundColor Yellow
try {
    $pythonVersion = & python --version 2>&1
    Write-Host "✅ $pythonVersion found" -ForegroundColor Green
    
    # Extract version number and check if >= 3.11
    $versionMatch = [regex]::Match($pythonVersion, "(\d+)\.(\d+)")
    $major = [int]$versionMatch.Groups[1].Value
    $minor = [int]$versionMatch.Groups[2].Value
    
    if ($major -lt 3 -or ($major -eq 3 -and $minor -lt 11)) {
        Write-Host "❌ Error: Python 3.11+ is required. Found: Python $major.$minor" -ForegroundColor Red
        Write-Host "Please install Python 3.11 or higher from https://www.python.org/downloads/" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Error: Python not found. Please install Python 3.11+" -ForegroundColor Red
    Write-Host "Download from: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Create virtual environment
Write-Host "Creating virtual environment..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Host "⚠️  Virtual environment already exists. Skipping..." -ForegroundColor DarkYellow
} else {
    python -m venv venv
    Write-Host "✅ Virtual environment created" -ForegroundColor Green
}
Write-Host ""

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1
Write-Host "✅ Virtual environment activated" -ForegroundColor Green
Write-Host ""

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip --quiet
Write-Host "✅ pip upgraded" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "Installing dependencies from requirements.txt..." -ForegroundColor Yellow
Write-Host "(This may take a few minutes...)" -ForegroundColor DarkGray
pip install -r requirements.txt --quiet
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Create .env file
Write-Host "Setting up environment variables..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "⚠️  .env file already exists. Skipping..." -ForegroundColor DarkYellow
} else {
    Copy-Item env.template .env
    Write-Host "✅ .env file created from template" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: You need to edit .env and add your OpenAI API key!" -ForegroundColor Yellow
    Write-Host "   Run: notepad .env" -ForegroundColor Cyan
    Write-Host "   Set: OPENAI_API_KEY=sk-your-actual-api-key-here" -ForegroundColor Cyan
}
Write-Host ""

# Check if .env has default API key
if (Test-Path ".env") {
    $envContent = Get-Content .env -Raw
    if ($envContent -match "sk-your-openai-api-key-here") {
        Write-Host "⚠️  WARNING: Default API key detected in .env" -ForegroundColor Yellow
        Write-Host "   Please update .env with your actual OpenAI API key" -ForegroundColor Yellow
    }
}
Write-Host ""

# Summary
Write-Host "=============================================="
Write-Host "Setup Complete! 🎉" -ForegroundColor Green
Write-Host "=============================================="
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env and add your OpenAI API key:" -ForegroundColor White
Write-Host "   notepad .env" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start the service:" -ForegroundColor White
Write-Host "   python main.py" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test the service:" -ForegroundColor White
Write-Host "   python test_agent.py" -ForegroundColor Gray
Write-Host ""
Write-Host "4. View API docs:" -ForegroundColor White
Write-Host "   http://localhost:8000/docs" -ForegroundColor Gray
Write-Host ""
Write-Host "For more information, see README.md and QUICKSTART.md" -ForegroundColor DarkGray
Write-Host ""

# Offer to open .env for editing
$response = Read-Host "Would you like to open .env for editing now? (Y/N)"
if ($response -eq 'Y' -or $response -eq 'y') {
    notepad .env
}

