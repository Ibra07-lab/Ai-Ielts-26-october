# Configuration Validation & Error Prevention

This document explains the preventive measures implemented to avoid configuration errors.

## 🛡️ **What's Protected**

### 1. **Startup Configuration Validation**

The backend now validates ALL configuration on startup before attempting to make API calls:

- ✅ Checks if API keys are set
- ✅ Validates model names against known valid options
- ✅ Provides clear error messages with solutions
- ✅ Prevents silent failures

### 2. **Improved Error Messages**

When API calls fail, you now get specific, actionable error messages:

**Before:**
```
❌ Error: 400 Bad Request
```

**After:**
```
❌ Invalid model configuration: 'openai/gpt-4.1'
   Error from OpenRouter: Model not found

   Valid models include:
     - openai/gpt-4o (recommended)
     - openai/gpt-4o-mini
     - openai/gpt-4-turbo

   Update TEACHER_MODEL in backend/.env file
```

### 3. **Process Management**

New startup script that:
- ✅ Automatically kills old processes on port 8002
- ✅ Validates .env file exists
- ✅ Checks Python installation
- ✅ Provides clear feedback during startup

---

## 🚀 **How to Use**

### Starting the Backend

**Option 1: Use the new startup script (Recommended)**

```powershell
cd backend
.\start_backend.ps1
```

This will:
1. Clean up old processes
2. Validate configuration
3. Start the backend with clear status messages

**Option 2: Manual start**

```powershell
cd backend
python -m uvicorn main:app --reload --port 8002
```

You'll see validation status on startup.

---

## 🔍 **Health Check Endpoints**

### Check Configuration Status

```bash
curl http://localhost:8002/health/config
```

**Response (Healthy):**
```json
{
  "status": "healthy",
  "services": {
    "teacher": {
      "status": "configured",
      "model": "openai/gpt-4o",
      "api_key_set": true
    },
    "examiner": {
      "status": "configured",
      "model": "claude-sonnet-4-5-20250929",
      "api_key_set": true
    }
  }
}
```

**Response (Unhealthy):**
```json
{
  "status": "unhealthy",
  "error": "Invalid TEACHER_MODEL: 'openai/gpt-4.1'...",
  "services": {
    "teacher": {"status": "error"},
    "examiner": {"status": "error"}
  }
}
```

---

## 📝 **Configuration Files**

### `.env.example` Template

Copy this to create your `.env` file:

```bash
cp .env.example .env
notepad .env  # Edit with your API keys
```

The template includes:
- ✅ Valid model examples
- ✅ Comments explaining each option
- ✅ Links to get API keys
- ✅ Recommended settings

---

## 🔧 **Valid Model Options**

### Teacher Agent (OpenRouter)

✅ **Recommended:**
- `openai/gpt-4o` - Best quality, moderate cost
- `openai/gpt-4o-mini` - Good for development, lower cost

✅ **Also Valid:**
- `openai/gpt-4-turbo`
- `anthropic/claude-3-opus`
- `anthropic/claude-3-sonnet`

See full list: https://openrouter.ai/models

### Examiner Agent (Anthropic)

✅ **Recommended:**
- `claude-sonnet-4-5-20250929` - Latest, best quality

✅ **Also Valid:**
- `claude-3-opus-20240229`
- `claude-3-sonnet-20240229`
- `claude-3-haiku-20240307`

---

## 🚨 **Common Errors & Solutions**

### Error: "Invalid TEACHER_MODEL"

**Cause:** Model name doesn't exist or is misspelled

**Solution:**
1. Open `backend/.env`
2. Update `TEACHER_MODEL` to a valid option (see above)
3. Restart backend

### Error: "OPENROUTER_API_KEY is not set"

**Cause:** Missing API key

**Solution:**
1. Get key from https://openrouter.ai/keys
2. Add to `backend/.env`:
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```
3. Restart backend

### Error: "OpenRouter API key is invalid"

**Cause:** Expired or incorrect API key

**Solution:**
1. Verify key at https://openrouter.ai/keys
2. Update in `backend/.env`
3. Restart backend

### Error: "Rate limit exceeded"

**Cause:** Too many requests to OpenRouter

**Solution:**
1. Wait a few minutes
2. Consider upgrading your OpenRouter plan
3. Or switch to a different model temporarily

---

## 🧪 **Testing Configuration**

### Manual Test

```bash
# Check if configuration is valid
curl http://localhost:8002/health/config

# Should return {"status": "healthy", ...}
```

### Python Test

```python
from ielts_writing.config.validator import validate_all_configs

try:
    config = validate_all_configs()
    print("✅ Configuration valid!")
    print(f"Teacher: {config['teacher']['model']}")
    print(f"Examiner: {config['examiner']['model']}")
except Exception as e:
    print(f"❌ Configuration error: {e}")
```

---

## 📚 **What Was Changed**

### New Files

1. `backend/ielts_writing/config/validator.py` - Configuration validation logic
2. `backend/ielts_writing/config/__init__.py` - Module exports
3. `backend/.env.example` - Configuration template
4. `backend/start_backend.ps1` - Smart startup script
5. `backend/CONFIG_VALIDATION.md` - This documentation

### Modified Files

1. `backend/main.py` - Added startup validation and health check endpoint
2. `backend/ielts_writing/agents/teacher/task1_teacher.py` - Improved error messages
3. `backend/.env` - Fixed invalid model name

---

## 💡 **Best Practices**

1. **Always use `.env.example` as a template**
   - Copy it to create your `.env`
   - This ensures you don't miss required variables

2. **Check health endpoint after changes**
   - After updating `.env`, check `/health/config`
   - Ensures changes are valid before testing

3. **Use the startup script**
   - `start_backend.ps1` handles cleanup automatically
   - Provides clear feedback on startup issues

4. **Don't commit `.env` to git**
   - Only commit `.env.example`
   - Keep your API keys private

---

## 🎯 **Quick Reference**

| Task | Command |
|------|---------|
| Start backend | `.\start_backend.ps1` |
| Check config | `curl http://localhost:8002/health/config` |
| View valid models | Check `validator.py` or `.env.example` |
| Get API keys | OpenRouter: https://openrouter.ai/keys<br>Anthropic: https://console.anthropic.com/settings/keys |

---

**Need help?** Check the error message - it now includes specific solutions! 🎉
