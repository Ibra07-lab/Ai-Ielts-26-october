# Progress Tracker Setup Instructions

## What Was Built

A complete AI IELTS Progress Tracker with:
- **Backend (Encore + Postgres)**:
  - New `tasks` table with migration `3_create_tasks.up.sql`
  - Task CRUD endpoints + AI suggestion generator
  - Heuristic-based AI that analyzes weak areas from last 14 days
  
- **Frontend (React)**:
  - New page at `/progress-tracker`
  - Dark study goal card with gradient progress bar
  - Task list with checkbox UI (matching Design System style)
  - Add Task modal + AI Suggest drawer
  - Confetti animation on completion

## How to Run

### 1. Start the Encore Backend

```bash
cd backend
encore run
```

This will:
- Start the Encore app on port 4000
- Automatically run migrations (including the new tasks table)
- Expose all task endpoints

### 2. Start the Frontend (separate terminal)

```bash
cd frontend
npm run dev
```

This will start Vite dev server (usually on port 5173)

### 3. Access the Progress Tracker

1. Open your browser to the frontend URL (e.g., http://localhost:5173)
2. If you don't have a user profile, go to Settings first to create one
3. Navigate to **"Progress Tracker"** from the sidebar menu
4. You should see:
   - Dark study goal card at top with "Add Task" button
   - Circular progress indicator
   - Task list with tabs (All/Planned/In Progress/Completed)
   - Floating "Get AI Plan" button (bottom-right)

## How to Use

### Manual Task Creation
1. Click "Add Task" button in the study goal card
2. Fill in:
   - Task name
   - Category (reading/writing/speaking/listening/vocabulary/grammar)
   - Difficulty (easy/medium/hard)
   - Estimated minutes
   - Due date
3. Click "Create Task"

### AI Task Generation
1. Click "AI Suggest" or "Get AI Plan" button
2. Select time range (Daily/Weekly/Monthly)
3. Enter available time in minutes
4. Click "Generate Suggestions"
5. Review AI-generated tasks (based on your weak areas)
6. Click "Accept Plan" to add them

### Task Management
- Click the checkbox to mark tasks complete (triggers confetti!)
- Tasks are grouped with progress bars showing completion %
- Switch tabs to filter by status

## Troubleshooting

### "No tasks yet" shows even after adding tasks
- **Cause**: Backend might not be running or migration didn't execute
- **Fix**: 
  1. Restart `encore run` in backend directory
  2. Check console for migration errors
  3. Verify Postgres is running

### API calls return 404
- **Cause**: Frontend is calling wrong endpoints
- **Fix**: Ensure backend is running on port 4000 and frontend is configured correctly

### Changes not visible
- **Cause**: Frontend dev server needs refresh or browser cache
- **Fix**:
  1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
  2. Clear browser cache
  3. Restart frontend dev server

## File Structure

```
backend/
  ielts/
    migrations/
      3_create_tasks.up.sql    ← New migration
    tasks.ts                    ← Task endpoints
    aiSuggest.ts                ← Heuristic generator
    
frontend/
  pages/
    ProgressTracker.tsx         ← Main page
  components/progress/
    CircularProgress.tsx        ← Progress ring
    TaskCard.tsx                ← Individual task item
    AddTaskModal.tsx            ← Manual entry form
    AISuggestDrawer.tsx         ← AI suggestion UI
    ProgressTrends.tsx          ← Sparkline chart
    Confetti.tsx                ← Celebration animation
  api/
    progress.ts                 ← API client wrappers
```

## Navigation

The Progress Tracker is accessible via:
- Sidebar menu: "Progress Tracker" link
- Direct URL: `/progress-tracker`

## Next Steps

If you're still not seeing the changes:

1. **Verify backend is running**: Open http://localhost:4000 - you should see Encore running
2. **Check browser console**: Press F12 and look for errors in Console tab
3. **Check Network tab**: See if API calls are being made to /progress/* endpoints
4. **Restart both servers**: Stop both backend and frontend, then start again

If problems persist, share the error messages from:
- Backend console (where `encore run` is running)
- Browser console (F12 → Console tab)
- Browser network tab (F12 → Network tab, filter by "progress")

