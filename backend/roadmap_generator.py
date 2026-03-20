"""
Roadmap Generator — Pure deterministic task builder.
Takes a Strategy and StudentProfile, produces the complete
week-by-week task structure that maps directly to the UI.

No AI/LLM calls — generates structure only.
AI fills in title/description/tip fields later.
"""

import math
from dataclasses import dataclass
from typing import List, Optional, Dict

# Import from strategy engine (same package)
from strategy_engine import (
    StudentProfile, Strategy, 
    get_difficulty_weights, round_to_half
)


# ═══════════════════════════════════════════════
#  DATA MODELS — These map directly to the UI
# ═══════════════════════════════════════════════

@dataclass
class Task:
    """Single task — maps to a task card in Center Column."""
    
    id: str                  # "w3_d2_t1" (week3, day2, task1)
    week: int
    day: int                 # 1-7
    day_name: str            # "Monday"
    
    skill: str               # "reading","writing","listening",
                             # "vocabulary","strategy","mock"
    skill_color: str         # Maps to UI color system
    
    task_type: str           # "reading_passage","writing_task2",
                             # "writing_task1","listening_section",
                             # "vocab_set","strategy_lesson",
                             # "mock_test"
    
    title: str               # AI-generated later
    description: str         # AI-generated later
    tip: str                 # AI-generated later
    
    duration_minutes: int
    difficulty_band: float   # e.g. 6.5
    
    content_id: Optional[str]  # reference to content DB
    
    status: str              # "locked","pending","in_progress",
                             # "completed","skipped"
    
    # Task 1 specific
    chart_type: Optional[str]   # "line_graph","bar_chart", etc.
    # Task 2 specific
    essay_type: Optional[str]   # "agree_disagree", etc.
    # Reading specific
    question_types: Optional[List[str]]


@dataclass
class WeekPlan:
    """Single week — maps to Left Column item + 
    Center Column content."""
    
    week_number: int
    phase_name: str          # "Foundation","Acceleration", etc.
    
    # Left Column data
    status: str              # "locked","in_progress","done"
    tasks_total: int
    tasks_completed: int
    progress_pct: float      # 0.0 - 1.0
    
    # Center Column data
    goal: str                # AI-generated — week's learning goal
    ai_coach_message: str    # AI-generated — plan adjustment note
    tasks: List[Task]
    
    # Allocation for this specific week (may vary from base)
    allocation: dict         # skill -> percentage
    
    # Per-section expected bands by end of this week
    expected_bands: dict     # {"L": 5.75, "R": 6.0, ...}


@dataclass
class RoadmapData:
    """Complete roadmap — feeds all 3 columns of the UI."""
    
    # Left Column
    weeks: List[WeekPlan]
    total_weeks: int
    
    # Right Column — Goal Card
    current_overall: float
    target_overall: float
    current_sections: dict
    target_sections: dict
    projected_eta_week: int
    projected_eta_date: Optional[str]
    
    # Right Column — Skill Breakdown
    skill_breakdown: List[dict]
    
    # Right Column — Trajectory (for the predictive graph)
    trajectory: List[dict]   # [{week, actual, target_line}, ...]
    
    # Strategy metadata
    strategy_type: str
    risk_level: str
    min_sum_needed: float
    time_saved: int


# ═══════════════════════════════════════════
#  SKILL COLOR MAP — Matches UI spec
# ═══════════════════════════════════════════

SKILL_COLORS = {
    "reading":    "blue",
    "writing":    "purple",
    "listening":  "teal",
    "vocabulary": "amber",
    "strategy":   "gray",
    "mock":       "indigo",
}

SKILL_FROM_ALLOCATION_KEY = {
    "R":          "reading",
    "L":          "listening",
    "W_T2":       "writing",
    "W_T1":       "writing",
    "vocabulary": "vocabulary",
    "strategy":   "strategy",
}


# ═══════════════════════════════════════════════
#  TASK TEMPLATES — What tasks exist per skill
# ═══════════════════════════════════════════════

# Reading task types rotate by question focus
READING_QUESTION_ROTATIONS = [
    ["true_false_ng", "matching_info"],
    ["sentence_completion", "summary_completion"],
    ["matching_headings", "multiple_choice"],
    ["true_false_ng", "short_answer"],
    ["matching_info", "sentence_completion"],
]

# Writing Task 2 essay types rotate
ESSAY_TYPE_ROTATION = [
    "agree_disagree",
    "discuss_both_views",
    "advantages_disadvantages",
    "problem_solution",
    "two_part_question",
]

# Writing Task 1 chart types rotate
CHART_TYPE_ROTATION = [
    "line_graph",
    "bar_chart",
    "pie_chart",
    "table",
    "process_diagram",
    "map",
    "mixed_charts",
]

# Listening section types
LISTENING_SECTIONS = [
    {"section": 1, "type": "conversation", "context": "everyday"},
    {"section": 2, "type": "monologue", "context": "everyday"},
    {"section": 3, "type": "discussion", "context": "academic"},
    {"section": 4, "type": "lecture", "context": "academic"},
]

# Vocabulary AWL sets (570 words / ~20 per set = 28 sets)
VOCAB_SETS = [f"AWL Set {i+1}" for i in range(28)]


# ═══════════════════════════════════════════
#  PHASE-SPECIFIC ALLOCATION ADJUSTMENTS
# ═══════════════════════════════════════════

def adjust_allocation_for_phase(
    base_allocation: dict, 
    phase_focus: str, 
    week_in_phase: int, 
    total_phase_weeks: int
) -> dict:
    """
    Phase-based adjustments to the base allocation.
    
    Foundation: more strategy, more vocab, less mock
    Acceleration: base allocation, push primary skills
    Performance: add mock tests, more timed practice
    Peak: heavy mock, light new content
    """
    
    adjusted = base_allocation.copy()
    
    if phase_focus == "core_skills":
        # Foundation: boost strategy + vocab
        adjusted["strategy"] = adjusted.get("strategy", 5) + 5
        adjusted["vocabulary"] = adjusted.get("vocabulary", 10) + 5
        # Reduce from the largest skill allocation to compensate
        skill_keys = [k for k in adjusted 
                      if k not in ("strategy", "vocabulary")]
        if skill_keys:
            largest = max(skill_keys, key=lambda k: adjusted[k])
            adjusted[largest] -= 10
        
    elif phase_focus == "push_primary":
        # Acceleration: base allocation is already optimized
        pass
        
    elif phase_focus == "test_conditions":
        # Performance: add mock test time
        adjusted["mock"] = 10
        # Reduce strategy (student should know strategies by now)
        adjusted["strategy"] = max(0, adjusted.get("strategy", 5) - 3)
        # Reduce vocab (shift to review mode)
        adjusted["vocabulary"] = max(5, adjusted.get("vocabulary", 10) - 3)
        
    elif phase_focus == "mock_polish":
        # Peak: heavy mock, minimal new content
        adjusted["mock"] = 20
        adjusted["strategy"] = 0
        adjusted["vocabulary"] = 5
        # Scale down everything else proportionally
        remaining = 75  # 100 - 20 - 0 - 5
        skill_keys = [k for k in adjusted 
                      if k not in ("mock", "strategy", "vocabulary")]
        skill_total = sum(adjusted[k] for k in skill_keys)
        if skill_total > 0:
            for k in skill_keys:
                adjusted[k] = round(adjusted[k] / skill_total * remaining)
    
    # Normalize to 100
    total = sum(adjusted.values())
    if total != 100 and total > 0:
        largest = max(adjusted, key=adjusted.get)
        adjusted[largest] += (100 - total)
    
    return adjusted


# ═══════════════════════════════════════════
#  DAILY TASK DISTRIBUTION ENGINE
# ═══════════════════════════════════════════

def distribute_tasks_across_days(
    allocation: dict,
    weekly_minutes: int,
    days_per_week: int,
    daily_minutes: int,
    week_number: int,
    current_bands: dict,
    phase_focus: str
) -> List[Task]:
    """
    Takes weekly allocation percentages and produces
    a list of Task objects distributed across study days.
    """
    
    tasks: List[Task] = []
    task_counter = 0
    
    # Map day numbers to day names
    day_names = ["Monday", "Tuesday", "Wednesday", "Thursday",
                 "Friday", "Saturday", "Sunday"]
    study_days = list(range(1, days_per_week + 1))
    
    # Calculate minutes per skill
    skill_minutes: Dict[str, int] = {}
    for skill, pct in allocation.items():
        if pct > 0:
            skill_minutes[skill] = round(weekly_minutes * pct / 100)
    
    # Define task durations and counts per skill
    task_specs = _get_task_specs(skill_minutes, phase_focus)
    
    # Distribute tasks across days
    task_specs.sort(key=lambda s: 0 if s["task_type"] == "writing_task2" else 1)
    
    day_loads: Dict[int, int] = {d: 0 for d in study_days}
    wt2_days = []
    
    for spec in task_specs:
        chosen_day = None
        
        # If this is a vocab task, try to pair it with a previously placed writing_task2
        if spec["task_type"] == "vocab_set" and wt2_days:
            for d in wt2_days:
                # Be slightly more lenient with daily minutes limit for paired thematic tasks
                if day_loads[d] + spec["duration"] <= daily_minutes + 15:
                    chosen_day = d
                    wt2_days.remove(d)  # Pair one vocab per writing task
                    break
        
        if not chosen_day:
            # Find the day with least load that hasn't exceeded daily limit
            eligible_days = [
                d for d in study_days
                if day_loads[d] + spec["duration"] <= daily_minutes + 5
            ]
            
            if not eligible_days:
                # All days full — find best fit
                eligible_days = sorted(study_days, key=lambda d: day_loads[d])
            
            # Apply spacing rules
            if spec["task_type"] == "writing_task2":
                # Don't put 2 Task 2 essays on consecutive days
                essay_days = [
                    t.day for t in tasks if t.task_type == "writing_task2"
                ]
                eligible_days = [
                    d for d in eligible_days 
                    if all(abs(d - ed) > 1 for ed in essay_days)
                ] or eligible_days
            
            chosen_day = min(eligible_days, key=lambda d: day_loads[d])
            
        # Record if we placed a writing_task2 so vocab can find it later
        if spec["task_type"] == "writing_task2":
            wt2_days.append(chosen_day)
            
        day_loads[chosen_day] += spec["duration"]
        
        task_counter += 1
        task_id = f"w{week_number}_d{chosen_day}_t{task_counter}"
        
        task = Task(
            id=task_id,
            week=week_number,
            day=chosen_day,
            day_name=day_names[chosen_day - 1],
            skill=spec["skill"],
            skill_color=SKILL_COLORS.get(spec["skill"], "gray"),
            task_type=spec["task_type"],
            title="",           # AI fills this
            description="",     # AI fills this
            tip="",             # AI fills this
            duration_minutes=spec["duration"],
            difficulty_band=spec["difficulty"],
            content_id=None,    # Content DB fills this
            status="locked" if week_number > 1 else "pending",
            chart_type=spec.get("chart_type"),
            essay_type=spec.get("essay_type"),
            question_types=spec.get("question_types"),
        )
        
        tasks.append(task)
    
    # Sort tasks by day, then by preferred skill order within day
    skill_order = {"reading": 1, "writing": 2, "listening": 3,
                   "vocabulary": 4, "strategy": 5, "mock": 0}
    tasks.sort(key=lambda t: (t.day, skill_order.get(t.skill, 9)))
    
    return tasks


def _get_task_specs(skill_minutes: dict, phase_focus: str) -> List[dict]:
    """
    Convert allocated minutes per skill into concrete task specs.
    Each spec defines: skill, task_type, duration, difficulty, metadata.
    """
    
    specs: List[dict] = []
    
    # Track rotation indices (in production, persist these per student)
    rotations = {
        "reading_q": 0, "essay": 0, "chart": 0, 
        "listening": 0, "vocab": 0
    }
    
    for skill_key, minutes in skill_minutes.items():
        if minutes <= 0:
            continue
        
        if skill_key == "R":
            # Reading: ~20-25 min per passage
            num_tasks = max(1, round(minutes / 22))
            per_task = minutes // num_tasks
            
            for i in range(num_tasks):
                q_idx = (rotations["reading_q"] + i) % len(
                    READING_QUESTION_ROTATIONS
                )
                specs.append({
                    "skill": "reading",
                    "task_type": "reading_passage",
                    "duration": max(15, min(25, per_task)),
                    "difficulty": 6.0,  # adjusted per student later
                    "question_types": READING_QUESTION_ROTATIONS[q_idx],
                })
            rotations["reading_q"] += num_tasks
            
        elif skill_key == "L":
            # Listening: ~15-20 min per section
            num_tasks = max(1, round(minutes / 18))
            per_task = minutes // num_tasks
            
            for i in range(num_tasks):
                sec_idx = (rotations["listening"] + i) % len(
                    LISTENING_SECTIONS
                )
                sec = LISTENING_SECTIONS[sec_idx]
                specs.append({
                    "skill": "listening",
                    "task_type": "listening_section",
                    "duration": max(10, min(22, per_task)),
                    "difficulty": 6.0,
                    "listening_section": sec["section"],
                    "listening_context": sec["context"],
                })
            rotations["listening"] += num_tasks
            
        elif skill_key == "W_T2":
            # Writing Task 2: 25-40 min per essay
            num_tasks = max(1, round(minutes / 30))
            per_task = minutes // num_tasks
            
            for i in range(num_tasks):
                e_idx = (rotations["essay"] + i) % len(
                    ESSAY_TYPE_ROTATION
                )
                specs.append({
                    "skill": "writing",
                    "task_type": "writing_task2",
                    "duration": max(25, min(40, per_task)),
                    "difficulty": 6.0,
                    "essay_type": ESSAY_TYPE_ROTATION[e_idx],
                })
            rotations["essay"] += num_tasks
            
        elif skill_key == "W_T1":
            # Writing Task 1: 15-25 min per report
            num_tasks = max(1, round(minutes / 20))
            per_task = minutes // num_tasks
            
            for i in range(num_tasks):
                c_idx = (rotations["chart"] + i) % len(
                    CHART_TYPE_ROTATION
                )
                specs.append({
                    "skill": "writing",
                    "task_type": "writing_task1",
                    "duration": max(15, min(25, per_task)),
                    "difficulty": 6.0,
                    "chart_type": CHART_TYPE_ROTATION[c_idx],
                })
            rotations["chart"] += num_tasks
            
        elif skill_key == "vocabulary":
            # Vocabulary: 10-15 min per set
            num_tasks = max(1, round(minutes / 12))
            per_task = minutes // num_tasks
            
            for i in range(num_tasks):
                specs.append({
                    "skill": "vocabulary",
                    "task_type": "vocab_set",
                    "duration": max(8, min(15, per_task)),
                    "difficulty": 0,  # N/A for vocab
                })
            rotations["vocab"] += num_tasks
            
        elif skill_key == "strategy":
            if minutes >= 8:
                specs.append({
                    "skill": "strategy",
                    "task_type": "strategy_lesson",
                    "duration": min(15, minutes),
                    "difficulty": 0,
                })
            
        elif skill_key == "podcast":
            # Podcast Power Task: 45 min high-value multi-skill session
            num_tasks = max(1, round(minutes / 45))
            per_task = minutes // num_tasks
            
            for i in range(num_tasks):
                specs.append({
                    "skill": "podcast",
                    "task_type": "podcast_power_task",
                    "duration": max(30, min(50, per_task)),
                    "difficulty": 0.0,
                })
            rotations["podcast"] = rotations.get("podcast", 0) + num_tasks
            
        return specs


# ═══════════════════════════════════════════════
#  TRAJECTORY CALCULATOR — For the Right Column Graph
# ═══════════════════════════════════════════════

def calculate_trajectory(
    current_scores: dict,
    target_sections: dict,
    total_weeks: int,
    phases: list
) -> List[dict]:
    """
    Generate target trajectory data points for the 
    predictive graph in the Right Column.
    
    Returns one data point per week with expected 
    overall band on the target line.
    """
    
    trajectory: List[dict] = []
    
    for week in range(total_weeks + 1):
        # S-curve interpolation per section
        week_bands: Dict[str, float] = {}
        for skill in ["L", "R", "W"]:
            start = current_scores[skill]
            end = target_sections[skill]
            
            if total_weeks > 0:
                # S-curve: slower start, faster middle, plateau at end
                progress = week / total_weeks
                # Sigmoid-like curve
                s_progress = 1 / (1 + math.exp(-10 * (progress - 0.5)))
                week_bands[skill] = start + (end - start) * s_progress
            else:
                week_bands[skill] = start
        
        week_overall = sum(week_bands.values()) / 3  # 3 sections
        
        trajectory.append({
            "week": week,
            "target_line": round(week_overall, 2),
            "actual": round(current_scores["L"], 1) if week == 0 else None,
            "bands": {
                s: round(v, 2) for s, v in week_bands.items()
            }
        })
    
    return trajectory


# ═══════════════════════════════════════════════
#  MAIN ROADMAP BUILDER
# ═══════════════════════════════════════════════

def build_roadmap(profile: StudentProfile, 
                  strategy: Strategy) -> RoadmapData:
    """
    Master function: builds the complete roadmap 
    that feeds all 3 UI columns.
    """
    
    weeks: List[WeekPlan] = []
    
    for week_num in range(1, strategy.total_weeks + 1):
        
        # Determine which phase this week belongs to
        phase = None
        week_in_phase = 0
        total_phase_weeks = 0
        
        for p in strategy.phases:
            if p["weeks_start"] <= week_num <= p["weeks_end"]:
                phase = p
                week_in_phase = week_num - p["weeks_start"] + 1
                total_phase_weeks = p["weeks_end"] - p["weeks_start"] + 1
                break
        
        # Adjust allocation for this phase
        phase_allocation = adjust_allocation_for_phase(
            strategy.weekly_allocation,
            phase["focus"] if phase else "push_primary",
            week_in_phase,
            total_phase_weeks
        )
        
        # Calculate expected bands by end of this week
        expected: Dict[str, float] = {}
        for skill in ["L", "R", "W"]:
            start = profile.current_scores[skill]
            target = strategy.target_sections[skill]
            progress = week_num / strategy.total_weeks
            expected[skill] = round_to_half(
                start + (target - start) * progress
            )
        
        # Set difficulty for tasks based on current progression
        task_difficulty: Dict[str, float] = {}
        for skill in ["L", "R", "W"]:
            task_difficulty[skill] = expected[skill] - 0.5
        
        # Generate tasks for this week
        tasks = distribute_tasks_across_days(
            allocation=phase_allocation,
            weekly_minutes=profile.weekly_minutes,
            days_per_week=profile.days_per_week,
            daily_minutes=profile.daily_minutes,
            week_number=week_num,
            current_bands=expected,
            phase_focus=phase["focus"] if phase else "push_primary"
        )
        
        # Update task difficulties based on skill
        for task in tasks:
            skill_key = {
                "reading": "R", "writing": "W", "listening": "L",
            }.get(task.skill, None)
            if skill_key and skill_key in task_difficulty:
                task.difficulty_band = task_difficulty[skill_key]
        
        week_plan = WeekPlan(
            week_number=week_num,
            phase_name=phase["name"] if phase else "Study",
            status="pending" if week_num == 1 else "locked",
            tasks_total=len(tasks),
            tasks_completed=0,
            progress_pct=0.0,
            goal="",                # AI fills this
            ai_coach_message="",    # AI fills this
            tasks=tasks,
            allocation=phase_allocation,
            expected_bands=expected,
        )
        
        weeks.append(week_plan)
    
    # Build skill breakdown for Right Column
    skill_breakdown: List[dict] = []
    for skill_name, skill_key in [
        ("Listening", "L"), ("Reading", "R"), ("Writing", "W")
    ]:
        current = profile.current_scores[skill_key]
        target = strategy.target_sections[skill_key]
        
        skill_breakdown.append({
            "skill": skill_name,
            "skill_key": skill_key,
            "current": current,
            "target": target,
            "gap": target - current,
            "progress_pct": 0.0,
            "band_variance": "+0.0",
            "color": SKILL_COLORS.get(skill_name.lower(), "gray"),
        })
    
    # Build trajectory for predictive graph
    trajectory = calculate_trajectory(
        profile.current_scores,
        strategy.target_sections,
        strategy.total_weeks,
        strategy.phases
    )
    
    # Projected ETA
    projected_date = None
    if hasattr(profile, 'test_date') and getattr(profile, 'test_date', None):
        projected_date = profile.test_date
    
    roadmap = RoadmapData(
        weeks=weeks,
        total_weeks=strategy.total_weeks,
        current_overall=profile.current_overall,
        target_overall=profile.target_overall,
        current_sections=profile.current_scores,
        target_sections=strategy.target_sections,
        projected_eta_week=strategy.total_weeks,
        projected_eta_date=projected_date,
        skill_breakdown=skill_breakdown,
        trajectory=trajectory,
        strategy_type=strategy.strategy_type,
        risk_level=strategy.risk_level,
        min_sum_needed=strategy.min_sum_needed,
        time_saved=strategy.time_saved_vs_balanced,
    )
    
    return roadmap
