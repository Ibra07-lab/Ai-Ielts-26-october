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
    
    # Internal Fallbacks (passed to enricher)
    fallback_title: Optional[str] = None
    fallback_desc: Optional[str] = None
    
    # Multi-step session (listening study sessions)
    steps: Optional[List[dict]] = None


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

# Hardcoded test IDs mapped by exact type to match frontend existing tests
TASK1_TEST_IDS = {
    "bar_chart": ["3", "5", "14", "15", "16", "24"],
    "line_graph": ["1", "7", "11", "12"],
    "pie_chart": ["17", "18", "19"],
    "table": ["10", "20", "21", "41"],
    "map": ["42"],
    "process_diagram": ["22", "23"],
    "mixed_charts": ["9", "13"]
}

TASK2_TEST_IDS = {
    "agree_disagree": ["2", "4", "6", "8"],
    "discuss_both_views": ["25", "26", "27", "28"],
    "advantages_disadvantages": ["29", "30", "31", "32"],
    "problem_solution": ["33", "34", "35", "36"],
    "two_part_question": ["37", "38", "39", "40"]
}

TEST_TOPICS = {
    "1": "Internet Access in Countries", "3": "Teenagers Daily Activities",
    "5": "Water Consumption in Cities", "7": "Transport Commuters",
    "9": "Energy Consumption and Bills", "10": "Crop Yields and Farming Methods",
    "11": "Cinema Attendance by Age", "12": "Ocean Temperature Anomalies",
    "13": "Screen Time: Phone vs Computer", "14": "Carbon Emissions by Sector",
    "15": "University Applications", "16": "Municipal Waste Composition",
    "17": "National Budget Allocation", "18": "Tourist Spending Patterns",
    "19": "Marine Plastic Pollution", "20": "Healthcare Metrics",
    "21": "Museum Statistics and Satisfaction", "22": "Rainwater Harvesting System",
    "23": "Coffee Production Process", "24": "Access to Technology",
    "41": "Secondary School Types", "42": "Town Development Map",
    "2": "Education: Homework", "4": "Technology: AI & Jobs",
    "6": "Environment: Carbon Footprint", "8": "Health: Sports Facilities",
    "25": "Urbanization: Traffic", "26": "Globalization: Local Economies",
    "27": "Education: Foreign Languages", "28": "Crime: Purpose of Prison",
    "29": "Technology: Social Media", "30": "Work: Remote Work",
    "31": "Education: Online Courses", "32": "Tourism: Historic Sites",
    "33": "Environment: Air Pollution", "34": "Health: Obesity Rates",
    "35": "Urbanization: Housing", "36": "Education: Youth Employment",
    "37": "Technology: Online Shopping", "38": "Family: Working Parents",
    "39": "Environment: Water Shortages", "40": "Culture: Traditional Festivals"
}

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
    phase_focus: str,
    target_sections: dict = None,
    weeks_available: int = 12,
    strategy_type: str = "balanced",
    rotations: dict = None,
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
    task_specs = _get_task_specs(
        skill_minutes, phase_focus,
        current_bands=current_bands,
        target_sections=target_sections or {},
        weeks_available=weeks_available,
        strategy_type=strategy_type,
        rotations=rotations,
    )
    
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
            content_id=spec.get("content_id"),    # Set by specs, or content DB fills this later
            status="pending",
            chart_type=spec.get("chart_type"),
            essay_type=spec.get("essay_type"),
            question_types=spec.get("question_types"),
            fallback_title=spec.get("fallback_title"),
            fallback_desc=spec.get("fallback_desc"),
            steps=spec.get("steps"),
        )
        
        tasks.append(task)
    
    # Sort tasks by day, then by preferred skill order within day
    skill_order = {"reading": 1, "writing": 2, "listening": 3,
                   "vocabulary": 4, "strategy": 5, "mock": 0}
    tasks.sort(key=lambda t: (t.day, skill_order.get(t.skill, 9)))
    
    return tasks


def _round_5(val: int) -> int:
    """Round a duration to the nearest 5 minutes."""
    return max(5, int(round(val / 5.0) * 5))


# ═══════════════════════════════════════════════
#  LISTENING SESSION STEP BUILDER
# ═══════════════════════════════════════════════

def _build_listening_steps(
    current_L: float,
    target_L: float,
    allocated_minutes: int,
    weeks_available: int,
    strategy_type: str,
    listening_section: int,
) -> List[dict]:
    """
    Build a list of study session steps for a listening task.
    Steps are selectively included based on student profile.
    Returns steps that fit within allocated_minutes.
    
    Each step: {step_number, name, what, why, duration_minutes, speed?}
    """
    
    gap = target_L - current_L
    
    # ── Define all possible steps ──────────────────────────────
    
    all_steps = []
    
    # Step 1: Full Listen (ALWAYS included)
    all_steps.append({
        "step_number": 1,
        "name": "Full Listen",
        "what": "Listen to the full audio without pausing or replaying. Answer all questions as you go, just like the real exam.",
        "why": "This simulates real IELTS exam conditions. Your brain needs to practice processing speech at full speed without replaying. Every time you replay in practice, you train a habit that won't exist in the exam room.",
        "duration_minutes": 30,
        "required": True,
    })
    
    # Step 2: Review Mistakes (ALWAYS included)
    all_steps.append({
        "step_number": 2,
        "name": "Review Mistakes",
        "what": "Check your answers. For every wrong answer, find the exact moment in the audio where the answer was said. Write down what you heard vs what was actually said.",
        "why": "Most listening mistakes follow patterns — you miss numbers, you mishear similar sounds, or you lose focus after one wrong answer. Finding your specific error pattern is more valuable than just knowing you were wrong.",
        "duration_minutes": 10,
        "required": True,
    })
    
    # Step 3: Vocabulary from Audio (for lower bands / big gaps)
    include_vocab = current_L < 6.5 or gap >= 1.5
    if include_vocab:
        all_steps.append({
            "step_number": 3,
            "name": "Vocabulary from Audio",
            "what": "Read the transcript. Highlight every word you didn't know or weren't sure about. Add 5-10 new words to your vocabulary list with example sentences from the audio.",
            "why": "IELTS listening uses the same academic and topic-specific vocabulary repeatedly across tests. Every word you learn from a real audio is a word you might hear again. Reading the transcript also shows you how spoken English differs from written English.",
            "duration_minutes": 15,
            "required": False,
        })
    
    # Step 4: Shadowing (for intermediate+ students pushing higher)
    include_shadowing = (
        current_L >= 5.5 and target_L >= 6.5
        and strategy_type in ("compensatory", "receptive_specialist", "balanced")
    )
    if include_shadowing:
        all_steps.append({
            "step_number": 4,
            "name": "Shadowing",
            "what": "Play the audio and read the transcript out loud at the same time. Match the speaker's speed, rhythm, and pronunciation exactly. Do not pause or slow down.",
            "why": "Shadowing trains your ear and mouth simultaneously. When you can reproduce the sounds yourself, your brain recognizes them faster when you hear them. This is the fastest proven method for improving listening comprehension and accent familiarity.",
            "duration_minutes": 25,
            "required": False,
        })
    
    # Step 5: Speed Challenge (for advanced students or short prep time)
    include_speed = (
        (current_L >= 6.0 and target_L >= 7.5)
        or (weeks_available <= 6 and gap >= 1.0)
    )
    if include_speed:
        # Pick speed based on current level
        if current_L >= 7.0:
            speed = "1.75x"
        elif current_L >= 6.5:
            speed = "1.5x"
        else:
            speed = "1.25x"
        
        # Target the harder parts (3 or 4)
        target_part = 4 if listening_section <= 2 else 3
        
        all_steps.append({
            "step_number": 5,
            "name": "Speed Challenge",
            "what": f"Replay Part {target_part} at {speed} speed. Answer the questions again without looking at your previous answers. Then compare and analyze where the increased speed caused you to miss information.",
            "why": f"If you can understand Part {target_part} at {speed}, normal speed will feel slow and easy. This trains your brain to process faster speech patterns, which directly improves your accuracy under exam conditions. Each IELTS part is ~7 min, so this is a focused, high-intensity drill.",
            "duration_minutes": 15,
            "speed": speed,
            "target_part": target_part,
            "required": False,
        })
    
    # ── Select steps that fit within the time budget ──────────
    
    selected = []
    time_remaining = allocated_minutes
    
    for step in all_steps:
        if step.get("required"):
            selected.append(step)
            time_remaining -= step["duration_minutes"]
        elif time_remaining >= step["duration_minutes"]:
            selected.append(step)
            time_remaining -= step["duration_minutes"]
    
    # Clean up internal keys before returning
    for s in selected:
        s.pop("required", None)
    
    return selected


# ═══════════════════════════════════════════════
#  READING SESSION STEP BUILDER
# ═══════════════════════════════════════════════

def _build_reading_steps(
    current_R: float,
    target_R: float,
    allocated_minutes: int,
    weeks_available: int,
    question_types: List[str] = None,
) -> List[dict]:
    """
    Build a list of study session steps for a reading task.
    Steps are selectively included based on student profile.
    Returns steps that fit within allocated_minutes.
    """
    
    gap = target_R - current_R
    q_label = " & ".join(t.replace("_", " ").title() for t in (question_types or ["mixed"]))
    
    all_steps = []
    
    # Step 1: Full Passage Read (ALWAYS included)
    all_steps.append({
        "step_number": 1,
        "name": "Full Passage Read",
        "what": f"Read the single passage and answer all questions ({q_label}) under strict 20-minute timed conditions. Do not look up words or re-read sections more than once.",
        "why": "IELTS gives you 60 minutes for 3 passages, so you have exactly 20 minutes per passage. Training under this exact time pressure builds the speed and focus you need on exam day.",
        "duration_minutes": 20,
        "required": True,
    })
    
    # Step 2: Review Answers & Analyze (ALWAYS included)
    all_steps.append({
        "step_number": 2,
        "name": "Review Answers & Analyze",
        "what": "Check each answer. Read the evidence shown for correct answers. For wrong answers, find the exact sentence in the passage that contains the answer.",
        "why": "IELTS reading answers always come directly from the passage. Training yourself to locate evidence — not guess — is the single most important reading skill. Analyzing your mistakes deeply is where the real learning happens.",
        "duration_minutes": 20,
        "required": True,
    })
    
    # Step 3: AI Explanation (for students with gap >= 1.0 or lower bands)
    include_ai = current_R < 7.0 or gap >= 1.0
    if include_ai:
        all_steps.append({
            "step_number": 3,
            "name": "AI Explanation",
            "what": "For any answer you still do not understand after reading the evidence, use the AI explanation. Ask it to clarify why that specific answer is correct.",
            "why": "Sometimes the evidence is clear but the reasoning is not. The AI explains the logic behind the answer — why this word means that, why this option is wrong, why paraphrasing makes it tricky. Understanding the reasoning prevents the same mistake next time.",
            "duration_minutes": 10,
            "required": False,
        })
    
    # Step 4: Skill Breakdown & Theory (for students below 7.5)
    include_breakdown_theory = current_R < 7.5
    if include_breakdown_theory:
        all_steps.append({
            "step_number": 4,
            "name": "Skill Breakdown & Theory",
            "what": "Open your reading skill breakdown. Find any question type where your accuracy is below 40% (or your lowest score). Go to the Theory section and read the strategy, tips, and common mistakes for that specific type.",
            "why": "Most reading mistakes come from not knowing the specific strategy for a question type (like True/False/Not Given or Matching). Identifying your critical weak area (<40%) and learning its strategy fixes a pattern that costs you points.",
            "duration_minutes": 15,
            "required": False,
        })
    
    # Step 5: Practice with Alex (for students targeting 6.5+ who benefit from AI tutoring)
    include_alex = current_R >= 5.0 and target_R >= 6.5 and gap >= 1.0
    if include_alex:
        all_steps.append({
            "step_number": 5,
            "name": "Practice with Alex",
            "what": "Open Alex. Tell him the weak area you just identified (<40%) and ask for 10 focused practice questions on that specific type to apply the theory you just learned.",
            "why": "Random practice improves slowly. Targeted practice on your proven weak area improves fast. Alex gives you questions, explains mistakes in real time, and helps you apply the theory directly.",
            "duration_minutes": 20,
            "required": False,
        })
    
    # Select steps that fit within the time budget
    selected = []
    time_remaining = allocated_minutes
    
    for step in all_steps:
        if step.get("required"):
            selected.append(step)
            time_remaining -= step["duration_minutes"]
        elif time_remaining >= step["duration_minutes"]:
            selected.append(step)
            time_remaining -= step["duration_minutes"]
    
    # Clean up internal keys
    for s in selected:
        s.pop("required", None)
    
    return selected

def _get_task_specs(
    skill_minutes: dict,
    phase_focus: str,
    current_bands: dict = None,
    target_sections: dict = None,
    weeks_available: int = 12,
    strategy_type: str = "balanced",
    rotations: dict = None,
) -> List[dict]:
    """
    Convert allocated minutes per skill into concrete task specs.
    Each spec defines: skill, task_type, duration, difficulty, metadata.
    """
    current_bands = current_bands or {}
    target_sections = target_sections or {}
    
    specs: List[dict] = []
    
    # Track rotation indices (in production, persist these per student)
    if rotations is None:
        rotations = {
            "reading_q": 0, "essay": 0, "chart": 0, 
            "listening": 0, "vocab": 0
        }
    
    for skill_key, minutes in skill_minutes.items():
        if minutes <= 0:
            continue
        
        if skill_key == "R":
            # Reading: structured multi-step study sessions
            current_R = current_bands.get("R", 5.5)
            target_R = target_sections.get("R", 6.5)
            
            # Minimum session: 40 min (Full Read + Review)
            min_session = 40
            num_tasks = max(1, round(minutes / max(min_session, minutes)))
            per_task = minutes // num_tasks
            
            for i in range(num_tasks):
                q_idx = (rotations["reading_q"] + i) % len(
                    READING_QUESTION_ROTATIONS
                )
                q_types = READING_QUESTION_ROTATIONS[q_idx]
                q_label = " & ".join(t.replace("_", " ").title() for t in q_types)
                
                # Build study session steps based on student profile
                steps = _build_reading_steps(
                    current_R=current_R,
                    target_R=target_R,
                    allocated_minutes=per_task,
                    weeks_available=weeks_available,
                    question_types=q_types,
                )
                
                # Total duration = sum of all selected steps
                total_duration = sum(s["duration_minutes"] for s in steps)
                step_names = " → ".join(s["name"] for s in steps)
                
                specs.append({
                    "skill": "reading",
                    "task_type": "reading_passage",
                    "duration": total_duration,
                    "difficulty": 6.0,
                    "question_types": q_types,
                    "steps": steps,
                    "fallback_title": f"Reading Session: {q_label} Focus",
                    "fallback_desc": f"Study session: {step_names}. Total {total_duration} min.",
                })
            rotations["reading_q"] += num_tasks
            
        elif skill_key == "L":
            # Listening: structured multi-step study sessions
            current_L = current_bands.get("L", 5.5)
            target_L = target_sections.get("L", 6.5)
            
            # Each listening session is a full study block
            # Minimum session: 40 min (Full Listen + Review)
            min_session = 40
            num_tasks = max(1, round(minutes / max(min_session, minutes)))
            per_task = minutes // num_tasks
            
            for i in range(num_tasks):
                sec_idx = (rotations["listening"] + i) % len(
                    LISTENING_SECTIONS
                )
                sec = LISTENING_SECTIONS[sec_idx]
                
                # Build study session steps based on student profile
                steps = _build_listening_steps(
                    current_L=current_L,
                    target_L=target_L,
                    allocated_minutes=per_task,
                    weeks_available=weeks_available,
                    strategy_type=strategy_type,
                    listening_section=sec["section"],
                )
                
                # Total duration = sum of all selected steps
                total_duration = sum(s["duration_minutes"] for s in steps)
                step_names = " → ".join(s["name"] for s in steps)
                
                specs.append({
                    "skill": "listening",
                    "task_type": "listening_section",
                    "duration": total_duration,
                    "difficulty": 6.0,
                    "listening_section": sec["section"],
                    "listening_context": sec["context"],
                    "steps": steps,
                    "fallback_title": f"Listening Session: Section {sec['section']} ({sec['context'].title()} {sec['type'].title()})",
                    "fallback_desc": f"Study session: {step_names}. Total {total_duration} min.",
                })
            rotations["listening"] += num_tasks
            
        elif skill_key == "W_T2":
            # Writing Task 2: 30-50 min per essay
            num_tasks = max(1, round(minutes / 35))
            per_task = minutes // num_tasks
            
            for i in range(num_tasks):
                e_idx = (rotations["essay"] + i) % len(
                    ESSAY_TYPE_ROTATION
                )
                essay_type = ESSAY_TYPE_ROTATION[e_idx]
                essay_label = essay_type.replace("_", " ").title()
                duration_val = _round_5(max(25, min(50, per_task)))
                
                type_ids = TASK2_TEST_IDS[essay_type]
                t2_id_idx = (rotations["essay"] + i) % len(type_ids)
                content_id_val = type_ids[t2_id_idx]
                topic_str = TEST_TOPICS.get(content_id_val, essay_label)
                
                specs.append({
                    "skill": "writing",
                    "task_type": "writing_task2",
                    "duration": duration_val,
                    "difficulty": 6.0,
                    "essay_type": essay_type,
                    "fallback_title": f"Writing Task 2: {essay_label} ({topic_str})",
                    "fallback_desc": f"Write a full Task 2 essay on: {topic_str}. {duration_val} min timed.",
                    "content_id": content_id_val,
                })
            rotations["essay"] += num_tasks
            
        elif skill_key == "W_T1":
            # Writing Task 1: 15-30 min per report
            num_tasks = max(1, round(minutes / 22))
            per_task = minutes // num_tasks
            
            for i in range(num_tasks):
                c_idx = (rotations["chart"] + i) % len(
                    CHART_TYPE_ROTATION
                )
                chart_type = CHART_TYPE_ROTATION[c_idx]
                chart_label = chart_type.replace("_", " ").title()
                duration_val = _round_5(max(15, min(30, per_task)))
                
                type_ids = TASK1_TEST_IDS[chart_type]
                t1_id_idx = (rotations["chart"] + i) % len(type_ids)
                content_id_val = type_ids[t1_id_idx]
                topic_str = TEST_TOPICS.get(content_id_val, chart_label)
                
                specs.append({
                    "skill": "writing",
                    "task_type": "writing_task1",
                    "duration": duration_val,
                    "difficulty": 6.0,
                    "chart_type": chart_type,
                    "fallback_title": f"Writing Task 1: {chart_label} ({topic_str})",
                    "fallback_desc": f"Write a Task 1 report describing: {topic_str}. {duration_val} min.",
                    "content_id": content_id_val,
                })
            rotations["chart"] += num_tasks
            
        elif skill_key == "vocabulary":
            # Vocabulary: 10-15 min per set
            num_tasks = max(1, round(minutes / 12))
            per_task = minutes // num_tasks
            
            for i in range(num_tasks):
                duration_val = _round_5(max(10, min(15, per_task)))
                specs.append({
                    "skill": "vocabulary",
                    "task_type": "vocab_set",
                    "duration": duration_val,
                    "difficulty": 0,
                    "fallback_title": f"Academic Vocabulary Set",
                    "fallback_desc": f"Learn and practice {duration_val} min of academic vocabulary.",
                })
            rotations["vocab"] += num_tasks
            
        elif skill_key == "strategy":
            if minutes >= 8:
                duration_val = _round_5(min(15, minutes))
                specs.append({
                    "skill": "strategy",
                    "task_type": "strategy_lesson",
                    "duration": duration_val,
                    "difficulty": 0,
                    "fallback_title": "IELTS Strategy Lesson",
                    "fallback_desc": f"Learn a key IELTS test-taking strategy ({duration_val} min).",
                })
            
        elif skill_key == "podcast":
            # Podcast Power Task: 30-50 min high-value multi-skill session
            num_tasks = max(1, round(minutes / 45))
            per_task = minutes // num_tasks
            
            for i in range(num_tasks):
                duration_val = _round_5(max(30, min(50, per_task)))
                specs.append({
                    "skill": "podcast",
                    "task_type": "podcast_power_task",
                    "duration": duration_val,
                    "difficulty": 0.0,
                    "fallback_title": "Podcast Power Task (Multi-Skill)",
                    "fallback_desc": f"BBC podcast session: listen, answer comprehension questions, and write a summary. {duration_val} min.",
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
    
    rotations = {
        "reading_q": 0, "essay": 0, "chart": 0, 
        "listening": 0, "vocab": 0
    }
    
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
            phase_focus=phase["focus"] if phase else "push_primary",
            target_sections=strategy.target_sections,
            weeks_available=strategy.total_weeks - week_num + 1,
            strategy_type=strategy.strategy_type,
            rotations=rotations,
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
            status="in_progress",
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
