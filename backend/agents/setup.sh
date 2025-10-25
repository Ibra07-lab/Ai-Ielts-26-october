#!/bin/bash

# IELTS Reading Feedback Agent - Setup Script
# This script automates the setup process for Unix-based systems (macOS, Linux)

set -e  # Exit on error

echo "=============================================="
echo "IELTS Reading Feedback Agent - Setup"
echo "=============================================="
echo ""

# Check Python version
echo "Checking Python version..."
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
REQUIRED_VERSION="3.11"

if ! python3 -c "import sys; exit(0 if sys.version_info >= (3,11) else 1)"; then
    echo "❌ Error: Python 3.11+ is required. Found: Python $PYTHON_VERSION"
    echo "Please install Python 3.11 or higher and try again."
    exit 1
fi

echo "✅ Python $PYTHON_VERSION found"
echo ""

# Create virtual environment
echo "Creating virtual environment..."
if [ -d "venv" ]; then
    echo "⚠️  Virtual environment already exists. Skipping..."
else
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi
echo ""

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
echo "✅ Virtual environment activated"
echo ""

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip --quiet
echo "✅ pip upgraded"
echo ""

# Install dependencies
echo "Installing dependencies from requirements.txt..."
pip install -r requirements.txt --quiet
echo "✅ Dependencies installed"
echo ""

# Create .env file
echo "Setting up environment variables..."
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Skipping..."
else
    cp env.template .env
    echo "✅ .env file created from template"
    echo ""
    echo "⚠️  IMPORTANT: You need to edit .env and add your OpenAI API key!"
    echo "   Run: nano .env"
    echo "   Set: OPENAI_API_KEY=sk-your-actual-api-key-here"
fi
echo ""

# Check if .env has API key
if grep -q "sk-your-openai-api-key-here" .env 2>/dev/null; then
    echo "⚠️  WARNING: Default API key detected in .env"
    echo "   Please update .env with your actual OpenAI API key"
fi
echo ""

# Summary
echo "=============================================="
echo "Setup Complete! 🎉"
echo "=============================================="
echo ""
echo "Next steps:"
echo "1. Edit .env and add your OpenAI API key:"
echo "   nano .env"
echo ""
echo "2. Start the service:"
echo "   python main.py"
echo ""
echo "3. Test the service:"
echo "   python test_agent.py"
echo ""
echo "4. View API docs:"
echo "   http://localhost:8000/docs"
echo ""
echo "For more information, see README.md and QUICKSTART.md"
echo ""

