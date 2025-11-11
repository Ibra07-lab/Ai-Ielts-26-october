# Quick Start Checklist - Progress Tracker

## ✅ Files Created (Already Done)

- ✅ Backend migration: `backend/ielts/migrations/3_create_tasks.up.sql`
- ✅ Backend endpoints: `backend/ielts/tasks.ts`
- ✅ Backend AI logic: `backend/ielts/aiSuggest.ts`
- ✅ Frontend API: `frontend/api/progress.ts`
- ✅ Frontend page: `frontend/pages/ProgressTracker.tsx`
- ✅ Frontend components: All in `frontend/components/progress/`
- ✅ Routing: Updated `frontend/App.tsx`
- ✅ Navigation: Updated `frontend/components/Layout.tsx`

## 🔴 ACTION REQUIRED - You Must Do This Now

### Step 1: Restart Backend (REQUIRED!)

The new task endpoints won't work until you restart Encore:

```powershell
# Stop the current backend (Ctrl+C)
# Then restart:
cd backend
encore run
```

**Wait for**: "API server listening" message

### Step 2: Restart Frontend (REQUIRED!)

The new page won't load until you restart Vite:

```powershell
# Stop the current frontend (Ctrl+C)  
# Then restart:
cd frontend
npm run dev
```

**Wait for**: Dev server URL (e.g., http://localhost:5173)

### Step 3: Access Progress Tracker

1. Open browser to frontend URL
2. Look for **"Progress Tracker"** in the sidebar menu
3. Click it to go to `/progress-tracker`

## 🎯 What You Should See

After restarting both servers, you should see:

1. **Top Card (Dark)**: 
   - Large percentage (0% initially)
   - Green gradient progress bar
   - "Add Task" button (top right)
   - "AI Suggest" button (bottom right)

2. **Circular Progress Ring** (Below card)

3. **Task List Section**:
   - Tabs: All | Planned | In Progress | Completed
   - If no tasks: "No tasks yet." message
   - After adding: Tasks with checkboxes in clean list format

4. **Floating Button** (Bottom-right): "Get AI Plan"

## 🐛 Still Not Working?

### Check 1: Is Backend Running?
Open: http://localhost:4000

You should see Encore running. If not, backend isn't started.

### Check 2: Migration Ran?
Look at backend console output when you ran `encore run`. You should see:
```
Running migrations...
Migration 3_create_tasks.up.sql: ✓
```

If you see errors about "tasks table doesn't exist", the migration failed.

### Check 3: Frontend Console Errors?
Press `F12` in browser → Console tab. Look for errors related to:
- Import errors
- Component rendering errors
- API call failures

### Check 4: Network Requests?
Press `F12` → Network tab → Filter by "progress"

When you open `/progress-tracker`, you should see requests to:
- `/progress/summary`
- `/progress/tasks`
- `/users/{id}/daily-goal`
- `/users/{id}/progress`

If these are missing or returning 404, backend isn't exposing the endpoints.

## 💡 Common Issues

### "Cannot read properties of undefined"
- **Cause**: User context not loaded
- **Fix**: Go to Settings first, create a user profile

### Blank page at /progress-tracker
- **Cause**: Component import error or frontend not restarted
- **Fix**: Hard refresh (Ctrl+Shift+R) and check Console for errors

### "Add Task" button does nothing
- **Cause**: Modal component not rendering
- **Fix**: Check browser Console for React errors

### Tasks don't save
- **Cause**: Backend endpoints not working
- **Fix**: Check Network tab for 404/500 errors on POST /progress/tasks

## 📞 Need Help?

If still not working after restarting both servers, share:
1. Backend console output (entire log from `encore run`)
2. Browser console errors (F12 → Console)
3. Network tab errors (F12 → Network, filter "progress")
4. Screenshot of what you see at `/progress-tracker`

