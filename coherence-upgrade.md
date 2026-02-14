# Coherence Feedback Upgrade

## Overview
Upgrade "Coherence & Paragraph Structure" feedback to be dynamic and directive. Replace generic advice like "Improve logical flow" with specific strategies, focus points, and examples derived from the student's essay.

## Project Type
WEB (Full Stack)

## Success Criteria
- [ ] Coherence card in "Recommended Study Areas" displays specific, actionable advice.
- [ ] Backend generates `coherence_advice` containing strategy, focus, and example.
- [ ] Frontend types and UI support the new dynamic data.

## Tech Stack
- Backend: Python (Pydantic, Prompts)
- Frontend: React (TypeScript, Tailwind)

## File Structure
- `backend/ielts_writing/models.py` (Update)
- `backend/ielts_writing/prompts/tutor.py` (Update)
- `frontend/types/writing-feedback.ts` (Update)
- `frontend/components/writing/FeedbackDeepDiveView.tsx` (Update)

## Task Breakdown

### 1. Backend: Model Update
- **Goal**: Add `CoherenceAdvice` data structure.
- **Input**: `backend/ielts_writing/models.py`
- **Output**: New `CoherenceAdvice` model (strategy, specific_direction, example). Field added to `TutorFeedback`.
- **Status**: ✅ Complete

### 2. Backend: Prompt Update
- **Goal**: Instruct Tutor Agent to generate specific coherence advice.
- **Input**: `backend/ielts_writing/prompts/tutor.py`
- **Output**: Updated prompt schema asking for `coherence_advice` object.
- **Status**: ✅ Complete

### 3. Frontend: Type Definitions
- **Goal**: Sync frontend types with backend.
- **Input**: `frontend/types/writing-feedback.ts`
- **Output**: `CoherenceAdvice` interface and update `CoachingResult`.
- **Status**: ✅ Complete

### 4. Frontend: UI Implementation
- **Goal**: Display specific advice in "Recommended Study Areas".
- **Input**: `frontend/components/writing/FeedbackDeepDiveView.tsx`
- **Output**: Conditional rendering to show `coherence_advice` if available, replacing generic text.
- **Status**: ✅ Complete

## Phase X: Verification
- [x] Manual check of new UI card.
- [x] Types synced.
- [x] Prompt verified.

## ✅ PHASE X COMPLETE
- Update: ✅ Success
- Plan: ✅ Followed
- Date: 2026-02-05
