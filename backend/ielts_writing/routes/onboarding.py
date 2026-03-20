from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging
import sys
import os

# Add parent dir to path to import modules from backend root
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from strategy_engine import StudentProfile, build_strategy, calculate_optimal_targets, calculate_balanced_targets
from roadmap_generator import build_roadmap
from roadmap_enricher import enrich_roadmap
from ielts_writing.supabase_client import get_supabase
from ..auth import require_auth

router = APIRouter(prefix="/api/onboarding", tags=["Onboarding & Study Plan"])
logger = logging.getLogger(__name__)

class OnboardingData(BaseModel):
    userId: str
    target_overall: float
    test_date: Optional[str] = None
    weeks_available: int
    has_previous_scores: bool
    current_scores: Optional[Dict[str, float]] = None
    has_minimums: bool
    min_sections: Optional[Dict[str, float]] = None
    university_name: Optional[str] = None
    weakest_skill: str
    specific_challenges: List[str]
    daily_minutes: int
    days_per_week: int
    l1_language: Optional[str] = "en"
    purpose: Optional[str] = "academic"
    strategy_preference: Optional[str] = "compensatory"

class StrategyOptionsRequest(BaseModel):
    target_overall: float
    current_scores: Dict[str, float]
    weeks_available: int
    l1_language: Optional[str] = "en"

@router.post("/strategy-options")
async def get_strategy_options(data: StrategyOptionsRequest, auth: dict = Depends(require_auth)):
    """Calculates and returns mathematical paths to reach the target band."""
    profile = StudentProfile(
        target_overall=data.target_overall,
        weeks_available=data.weeks_available,
        current_scores=data.current_scores,
        min_sections=None,
        daily_minutes=60,
        days_per_week=5,
        l1_language=data.l1_language or "en",
        weakest_skill="writing",
        specific_challenges=[],
        purpose="academic"
    )
    
    comp_targets = calculate_optimal_targets(profile)
    comp_boost = sum(max(0, comp_targets[s] - data.current_scores[s]) for s in ["L", "R", "W"])
    
    bal_targets = calculate_balanced_targets(profile)
    bal_boost = sum(max(0, bal_targets[s] - data.current_scores[s]) for s in ["L", "R", "W"])
    
    return [
        {
            "id": "compensatory",
            "title": "Play to Strengths",
            "description": "Reach your goal faster by pushing your best skills higher.",
            "targets": comp_targets,
            "total_boost_needed": comp_boost
        },
        {
            "id": "balanced",
            "title": "Balanced Path",
            "description": "Equal focus across all sections to reach a well-rounded score.",
            "targets": bal_targets,
            "total_boost_needed": bal_boost
        }
    ]

@router.post("/generate")
async def generate_study_plan(data: OnboardingData, auth: dict = Depends(require_auth)):
    """
    Receives onboarding data, runs the strategy engine, generates a structural
    roadmap, passes it to the LLM (roadmap_enricher) for textual population,
    saves it to Supabase against the user_id, and returns the result.
    """
    # IDOR check: Ensure user can only generate plan for themselves
    if data.userId != auth["uid"]:
        raise HTTPException(status_code=403, detail="Cannot generate plan for another user")

    logger.info(f"Generating study plan for user: {data.userId}")
    
    try:
        # 1. Build Student Profile
        # If no current scores, default them to avoid crashes.
        current = data.current_scores if data.current_scores else {"L": 5.0, "R": 5.0, "W": 5.0}
        
        profile = StudentProfile(
            target_overall=data.target_overall,
            weeks_available=data.weeks_available,
            current_scores=current,
            min_sections=data.min_sections if data.has_minimums else None,
            daily_minutes=data.daily_minutes,
            days_per_week=data.days_per_week,
            l1_language=data.l1_language or "en",
            weakest_skill=data.weakest_skill,
            specific_challenges=data.specific_challenges,
            purpose=data.purpose or "academic",
            university_name=data.university_name
        )
        
        # 2. Build Strategy (Deterministic math)
        strategy = build_strategy(profile, data.strategy_preference)
        
        # 3. Build Roadmap Skeleton (Deterministic scheduling)
        roadmap = build_roadmap(profile, strategy)
        
        # 4. Enrich Roadmap (AI Text Generation)
        enriched_data = await enrich_roadmap(profile, strategy, roadmap)
        
        # 5. Save to Supabase
        supabase = get_supabase()
        
        # We assume the user already exists in 'users' table because Encore handles User creation or Supabase Auth handles it.
        # But just in case, we do an upsert on users or just an update. Since it's just the study plan, we update.
        result = supabase.table("users").update({"study_plan": enriched_data}).eq("id", data.userId).execute()
        
        if len(result.data) == 0:
            logger.warning(f"User {data.userId} not found in database. Trying to insert placeholder user...")
            # Supabase doesn't let us upsert partial data cleanly without checking if it exists.
            try:
               supabase.table("users").insert({
                   "id": data.userId, 
                   "name": "Student", 
                   "study_plan": enriched_data
               }).execute()
            except Exception as e:
                logger.error(f"Failed to create placeholder user: {e}")
                # We still return the enriched data so UI doesn't break
        
        logger.info(f"Successfully generated and saved study plan for user: {data.userId}")
        return enriched_data
        
    except Exception as e:
        logger.error(f"Error generating study plan: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}")
async def get_study_plan(user_id: str, auth: dict = Depends(require_auth)):
    """Fetch existing study plan for a user."""
    # IDOR check
    if user_id != auth["uid"]:
        raise HTTPException(status_code=403, detail="Cannot access another user's plan")

    try:
        supabase = get_supabase()
        result = supabase.table("users").select("study_plan").eq("id", user_id).execute()
        
        if len(result.data) == 0 or not result.data[0].get("study_plan"):
            raise HTTPException(status_code=404, detail="Study plan not found")
            
        return result.data[0]["study_plan"]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching study plan for {user_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
