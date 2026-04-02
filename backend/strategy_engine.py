"""
Strategy Engine — Pure deterministic math brain.
Takes a StudentProfile from onboarding and calculates:
  - Optimal per-section targets (strategic vs balanced)
  - Weekly time allocation across skills
  - Plan phases (Foundation → Acceleration → Performance → Peak)

No AI/LLM calls — everything is calculated with math.
"""

import math
from dataclasses import dataclass, field
from typing import Dict, Optional, List


@dataclass
class StudentProfile:
    target_overall: float
    weeks_available: int
    current_scores: Dict[str, float]     # {"L","R","W"}
    min_sections: Optional[Dict[str, float]]
    daily_minutes: int
    days_per_week: int
    l1_language: str
    weakest_skill: str
    specific_challenges: List[str]
    purpose: str
    university_name: Optional[str] = None
    
    @property
    def weekly_minutes(self) -> int:
        return self.daily_minutes * self.days_per_week
    
    @property
    def current_overall(self) -> float:
        # Only use L, R, W for the overall calculation (3 sections)
        s = sum(self.current_scores.get(k, 5.0) for k in ["L", "R", "W"])
        return round_ielts(s / 3)


@dataclass 
class Strategy:
    strategy_type: str            # "strategic" or "balanced"
    target_sections: Dict[str, float]
    weekly_allocation: Dict[str, float]  # percentages
    phases: List[dict]
    total_weeks: int
    risk_level: str
    min_sum_needed: float
    current_sum: float
    time_saved_vs_balanced: int   # weeks


def round_ielts(score: float) -> float:
    """Round to nearest 0.5 using IELTS rules.
    .25 and .75 round UP."""
    return math.floor(score * 2 + 0.5) / 2


def round_to_half(value: float) -> float:
    """Round any value to nearest 0.5"""
    return round(value * 2) / 2


def minimum_sum_for_overall(target_overall: float) -> float:
    """
    IELTS rounds .25 and .75 UP.
    Note: With 3 sections (no Speaking), we calculate based on
    the available sections only.
    So for target 7.0 with 3 sections: min sum = 7.0 * 3 = 21.0
    But we allow a small buffer: min_average = target - 0.25
    """
    min_average = target_overall - 0.25
    min_sum = min_average * 3  # 3 sections
    # Section scores come in 0.5 increments
    min_sum = math.ceil(min_sum * 2) / 2
    return min_sum


def get_difficulty_weights(l1_language: str, 
                           current_scores: Dict[str, float]) -> Dict[str, float]:
    """
    Base difficulty weights adjusted for L1 and current level.
    Lower = easier to improve.
    """
    
    base = {"R": 1.0, "L": 1.3, "W": 3.0}
    
    # L1 adjustments
    high_listening_l1 = [
        "chinese", "mandarin", "cantonese", "japanese", 
        "korean", "thai", "vietnamese"
    ]
    
    lang = l1_language.lower()
    
    if lang in high_listening_l1:
        base["L"] *= 1.4
    
    # Level-based adjustments: diminishing returns above 7.0
    for skill in base:
        current = current_scores[skill]
        if current >= 7.0:
            base[skill] *= 1.5   # much harder to improve above 7
        elif current >= 6.5:
            base[skill] *= 1.2   # somewhat harder above 6.5
    
    return base


def get_realistic_ceiling(skill: str, current: float, 
                          weeks: int, l1: str) -> float:
    """
    Maximum realistic band achievable given current level,
    time available, and L1 background.
    """
    
    # Max improvement rates (bands per week of FOCUSED study)
    rates = {
        "R": {(0, 5.5): 0.25, (5.5, 7.0): 0.15, 
              (7.0, 8.5): 0.08, (8.5, 9.0): 0.03},
        "L": {(0, 5.5): 0.20, (5.5, 7.0): 0.12, 
              (7.0, 8.0): 0.06, (8.0, 9.0): 0.02},
        "W": {(0, 5.5): 0.10, (5.5, 6.5): 0.06, 
              (6.5, 7.0): 0.03, (7.0, 9.0): 0.01},
    }
    
    projected = current
    remaining = weeks
    
    for band_range, rate in rates[skill].items():
        low, high = band_range
        if projected >= high:
            continue
        
        start = float(max(projected, low))
        room = float(high - start)
        gain = float(min(room, remaining * rate))
        projected = float(start + gain)
        weeks_used = float(gain / rate if rate > 0 else 0)
        remaining -= weeks_used
        
        if remaining <= 0:
            break
    
    return round_to_half(min(projected, 9.0))


def calculate_optimal_targets(profile: StudentProfile) -> Dict[str, float]:
    """
    Core strategy engine: find the optimal per-section targets
    that reach the overall target with minimum total effort.
    """
    
    current = profile.current_scores
    target_overall = profile.target_overall
    mins = profile.min_sections or {}
    weeks = profile.weeks_available
    
    min_sum = minimum_sum_for_overall(target_overall)
    current_sum = sum(current.values())
    
    # Check if student already meets the target
    if current_sum >= min_sum:
        all_mins_met = all(
            current.get(s, 0) >= mins.get(s, 0) 
            for s in ["L", "R", "W"]
        )
        if all_mins_met:
            return current.copy()  # already qualifies
    
    difficulty = get_difficulty_weights(profile.l1_language, current)
    
    # Start with minimums as floor
    targets: Dict[str, float] = {}
    for skill in ["L", "R", "W"]:
        targets[skill] = float(max(
            current[skill],
            mins.get(skill, current[skill])
        ))
    
    # Calculate remaining gap after minimums
    remaining_gap = min_sum - sum(targets.values())
    
    if remaining_gap > 0:
        # Distribute gap inversely proportional to difficulty
        # AND capped by realistic ceiling
        skills_by_ease = sorted(
            ["L", "R", "W"], 
            key=lambda s: difficulty[s]
        )
        
        for _ in range(20):  # iterate to fill gap
            if remaining_gap <= 0:
                break
            
            total_inv_diff = sum(
                1 / difficulty[s] for s in skills_by_ease
                if targets[s] < get_realistic_ceiling(
                    s, current[s], weeks, profile.l1_language
                )
            )
            
            if total_inv_diff == 0:
                break
            
            for skill in skills_by_ease:
                ceiling = get_realistic_ceiling(
                    skill, current[skill], weeks, profile.l1_language
                )
                if targets[skill] >= ceiling:
                    continue
                
                weight = (1.0 / difficulty[skill]) / total_inv_diff
                boost = float(round_to_half(remaining_gap * weight))
                boost = float(min(boost, ceiling - targets[skill]))
                boost = float(max(boost, 0.0))
                
                targets[skill] += boost
            
            remaining_gap = min_sum - sum(targets.values())
    
    # --- COMPENSATORY STRATEGY LOGIC ---
    # The user requested: "different strategies to get goal band. For example to get overall 7 
    # student can get higher band on reading and listening and then lower score at writing"
    # We enforce a strong preference for boosting L and R if W is struggling or ceiling is low.
    
    # Check if we still need points to hit the min_sum
    if sum(targets.values()) < min_sum:
        # First priority: Push Reading and Listening to max realistic ceiling
        for skill in sorted(["R", "L"]):
            ceiling = get_realistic_ceiling(skill, current[skill], weeks, profile.l1_language)
            while sum(targets.values()) < min_sum and targets[skill] < float(ceiling):
                targets[skill] += 0.5
        
        # Second priority: If still short, push Writing
        if sum(targets.values()) < min_sum:
            ceiling_w = get_realistic_ceiling("W", current["W"], weeks, profile.l1_language)
            while sum(targets.values()) < min_sum and targets["W"] < float(ceiling_w):
                targets["W"] += 0.5
        
        # Final safety fallback (ignore ceiling, just give them a math path)
        while sum(targets.values()) < min_sum:
            for skill in ["R", "L", "W"]:
                if targets[skill] < 9.0:
                    targets[skill] += 0.5
                    break
                    
    # Also add a strategic buffer if possible:
    # If Writing is particularly weak/gap is large, aim 0.5 higher in L/R 
    # to protect the overall band score against a bad writing day.
    if (targets["W"] - current["W"]) >= 1.0 or targets["W"] < targets["R"] - 1.0:
        for skill in ["R", "L"]:  # Prefer R then L
            if targets[skill] < 9.0:
                targets[skill] += 0.5
                break # Just one booster needed to give 0.5 sum buffer
    
    return targets


def calculate_balanced_targets(profile: StudentProfile) -> Dict[str, float]:
    """Equal improvement across all sections."""
    
    target = float(profile.target_overall)
    return {"L": target, "R": target, "W": target}


def calculate_weekly_allocation(
    targets: Dict[str, float],
    current: Dict[str, float],
    difficulty: Dict[str, float],
    weakest_skill: str = ""
) -> Dict[str, float]:
    """
    Distribute weekly study time across skills.
    
    effort_needed = gap x difficulty_weight
    Higher effort = more time allocated.
    
    Writing is split into Task 1 (33%) and Task 2 (67%).
    Vocabulary and Strategy get fixed minimums.
    """
    
    gaps: Dict[str, float] = {}
    for skill in ["R", "L", "W"]:
        gaps[skill] = float(max(0.0, targets[skill] - current[skill]))
    
    # Calculate effort per skill
    efforts = {
        "R": gaps["R"] * difficulty["R"],
        "L": gaps["L"] * difficulty["L"],
        "W_T2": gaps["W"] * difficulty["W"] * 0.67,  # Task 2 = 67%
        "W_T1": gaps["W"] * difficulty["W"] * 0.33,  # Task 1 = 33%
    }
    
    # ── Applying Student-Defined Priority ──────────────────────
    # If the student manually flagged a skill as "hardest", 
    # we boost its effort to ensure more study time.
    priority_multiplier = 1.2 # +20% focus
    
    if weakest_skill == "reading":
        efforts["R"] *= priority_multiplier
    elif weakest_skill == "listening":
        efforts["L"] *= priority_multiplier
    elif weakest_skill == "writing":
        efforts["W_T1"] *= priority_multiplier
        efforts["W_T2"] *= priority_multiplier

    total_effort = sum(efforts.values())
    
    # Fixed allocations (percentage)
    fixed = {
        "vocabulary": 10,
        "strategy": 5,
        "podcast": 15, # High-value multi-skill task
    }
    variable_pool = 100 - sum(fixed.values())  # 70%
    
    allocation: Dict[str, float] = {}
    
    if total_effort > 0:
        for skill, effort in efforts.items():
            pct = (effort / total_effort) * variable_pool
            allocation[skill] = float(round(pct))
    else:
        # No gap — maintenance mode
        allocation = {"R": 25.0, "L": 25.0, "W_T2": 20.0, 
                      "W_T1": 15.0}
    
    allocation["vocabulary"] = float(fixed["vocabulary"])
    allocation["strategy"] = float(fixed["strategy"])
    allocation["podcast"] = float(fixed["podcast"])
    
    # Enforce minimums: core skills (L, R, W) should always have at least 5% for maintenance
    for skill in ["R", "L", "W_T2", "W_T1"]:
        if allocation.get(skill, 0) < 5:
            allocation[skill] = 5.0
    
    # Normalize to 100%
    total = sum(allocation.values())
    if total != 100:
        diff = 100 - total
        # Add/subtract from the largest allocation
        largest = str(max(allocation, key=lambda k: allocation[k]))
        allocation[largest] += diff
    
    return allocation


def calculate_phases(total_weeks: int, current_overall: float = 5.0, gap: float = 2.0) -> List[dict]:
    """
    Split the plan into phases with names that reflect the student's level.
    - High-level students (6.5+, small gap): Refinement → Precision → Exam Simulation → Peak
    - Mid-level students (5.0-6.5): Skill Building → Acceleration → Test Conditions → Peak
    - Low-level students (<5.0 or big gap): Fundamentals → Core Building → Practice → Peak
    """
    
    # Choose phase name set based on student level
    if current_overall >= 6.5 and gap <= 1.5:
        # Advanced student, small gap
        names = ["Refinement", "Precision", "Exam Simulation", "Peak"]
        names_short = ["Intensive Refinement", "Peak"]
    elif current_overall >= 5.0:
        # Intermediate student
        names = ["Skill Building", "Acceleration", "Test Conditions", "Peak"]
        names_short = ["Intensive Practice", "Peak"]
    else:
        # Beginner / large gap
        names = ["Fundamentals", "Core Building", "Practice Mode", "Exam Prep"]
        names_short = ["Foundation & Practice", "Exam Prep"]
    
    if total_weeks >= 16:
        return [
            {"name": names[0],  "weeks_start": 1,  
             "weeks_end": 4,  "focus": "core_skills"},
            {"name": names[1],  "weeks_start": 5,  
             "weeks_end": 8,  "focus": "push_primary"},
            {"name": names[2],  "weeks_start": 9,  
             "weeks_end": 12, "focus": "test_conditions"},
            {"name": names[3],  "weeks_start": 13, 
             "weeks_end": total_weeks, "focus": "mock_polish"},
        ]
    elif total_weeks >= 12:
        return [
            {"name": names[0],  "weeks_start": 1,  
             "weeks_end": 3,  "focus": "core_skills"},
            {"name": names[1],  "weeks_start": 4,  
             "weeks_end": 6,  "focus": "push_primary"},
            {"name": names[2],  "weeks_start": 7,  
             "weeks_end": 9,  "focus": "test_conditions"},
            {"name": names[3],  "weeks_start": 10, 
             "weeks_end": total_weeks, "focus": "mock_polish"},
        ]
    elif total_weeks >= 8:
        return [
            {"name": names[0],  "weeks_start": 1,  
             "weeks_end": 2,  "focus": "core_skills"},
            {"name": names[1],  "weeks_start": 3,  
             "weeks_end": 4,  "focus": "push_primary"},
            {"name": names[2],  "weeks_start": 5,  
             "weeks_end": 6,  "focus": "test_conditions"},
            {"name": names[3],  "weeks_start": 7,  
             "weeks_end": total_weeks, "focus": "mock_polish"},
        ]
    else:  # 4-7 weeks — compressed
        mid = total_weeks // 2
        return [
            {"name": names_short[0],  "weeks_start": 1,  
             "weeks_end": mid, "focus": "core_skills"},
            {"name": names_short[1],  "weeks_start": mid + 1, 
             "weeks_end": total_weeks, "focus": "mock_polish"},
        ]


def estimate_balanced_weeks(profile: StudentProfile) -> int:
    """Estimate how many weeks a balanced path would take."""
    
    difficulty = get_difficulty_weights(
        profile.l1_language, profile.current_scores
    )
    max_gap = max(
        profile.target_overall - profile.current_scores[s] 
        for s in ["L", "R", "W"]
    )
    # Balanced path is bottlenecked by the hardest section
    hardest_diff = max(difficulty.values())
    return int(max_gap * hardest_diff * 5)  # rough estimate


def build_strategy(profile: StudentProfile, strategy_preference: str = "compensatory") -> Strategy:
    """
    Main entry point: takes a student profile,
    returns a complete strategy object.
    """
    
    # ── Cap at 10 weeks (current content limit) ────────────────
    MAX_PLAN_WEEKS = 10
    if profile.weeks_available > MAX_PLAN_WEEKS:
        profile.weeks_available = MAX_PLAN_WEEKS
    
    difficulty = get_difficulty_weights(
        profile.l1_language, profile.current_scores
    )
    
    if strategy_preference == "balanced":
        optimal_targets = calculate_balanced_targets(profile)
    else:
        optimal_targets = calculate_optimal_targets(profile)
    
    allocation = calculate_weekly_allocation(
        optimal_targets, profile.current_scores, difficulty, profile.weakest_skill
    )
    
    phases = calculate_phases(
        profile.weeks_available,
        current_overall=profile.current_overall,
        gap=profile.target_overall - profile.current_overall
    )
    
    min_sum = minimum_sum_for_overall(profile.target_overall)
    current_sum = sum(profile.current_scores.values())
    
    balanced_weeks = estimate_balanced_weeks(profile)
    time_saved = max(0, balanced_weeks - profile.weeks_available)
    
    return Strategy(
        strategy_type=strategy_preference,
        target_sections=optimal_targets,
        weekly_allocation=allocation,
        phases=phases,
        total_weeks=profile.weeks_available,
        risk_level="moderate",
        min_sum_needed=min_sum,
        current_sum=current_sum,
        time_saved_vs_balanced=time_saved
    )
