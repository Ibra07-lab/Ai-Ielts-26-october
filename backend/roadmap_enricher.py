"""
Roadmap Enricher — AI Text Generation Layer.
Takes the deterministic structure from Roadmap Generator 
and uses an LLM to add week goals, task titles, descriptions,
and coaching messages.
"""

import os
import json
import logging
import itertools
from typing import Dict, Any

from roadmap_generator import RoadmapData
from strategy_engine import StudentProfile, Strategy
from agents.direct_llm_client import DirectLLMClient

logger = logging.getLogger(__name__)

ROADMAP_ENRICHMENT_SYSTEM = """
You are the AI study coach inside NewBand, an IELTS Academic preparation 
app. Your job is to take a pre-calculated study roadmap structure and 
generate human-readable text: week goals, daily task titles, task 
descriptions, study tips, and coaching messages.

CRITICAL RULES:

1. NEVER change the roadmap structure. The weeks, tasks, allocations, 
   and targets are mathematically optimized. You only add text to 
   empty fields.

2. Write at a B1-B2 English level. Your students are IELTS learners 
   — they are NOT native speakers. Use clear, simple sentences. 

3. Every task title must be specific and actionable. If it is a Reading task, direct the student to ALEX (the reading agent):
   BAD:  "Reading Practice"
   GOOD: "Academic Reading with ALEX: True/False/Not Given Focus"

4. Every task description must tell the student exactly what they 
   will do. For Reading tasks with specific question types, explicitly tell them to practice with ALEX:
   BAD:  "Practice your reading skills"
   GOOD: "Go to ALEX (Reading Agent) and practice 20 questions focusing on True/False/Not Given. Time: 20 min."

5. For Listening tasks, instruct the student to:
   - Complete the section/test once at normal speed.
   - Re-listen to the parts where they made mistakes and analyze WHY.
   - Extract and learn 3-5 new academic words from the transcript.
   - **Challenge Step**: Suggest re-listening at 1.25x speed to build faster processing (Speed Training).

6. For Podcast Power Tasks, explain the Multi-Skill benefits:
   - **Listening**: Authentic BBC audio for accent exposure.
   - **Reading**: Comprehension questions train the same logic as IELTS Reading.
   - **Writing**: The summary is a direct bridge to Task 2 structure and Task 1 synthesis.
   - **Vocab**: Learning words in context through the transcript and exercises.

7. Tips must be concrete and skill-specific.
8. Week goals must reference the specific skill targets.
9. AI coach messages must explain WHY the plan looks the way it does.
10. Reference the student by their strategy context.

**THEMATIC PAIRING RULE:**
When a Vocabulary task (`vocab_set`) and a Writing Task 2 (`writing_task2`) are scheduled on the EXACT SAME DAY, you MUST assign them the exact same thematic topic from the 'Vocabulary & Writing Themes' list below. 
- The Vocabulary task description MUST instruct the user to learn 5-10 specific words related to that theme (e.g., "Learn 5-10 advanced words related to the Environment, such as sustainability and emissions").
- The Writing Task 2 description MUST assign an essay prompt on that exact same theme, expressly telling the user to practice using the vocabulary they just learned in Task 1.

**COMPENSATORY STRATEGY KNOWLEDGE:**
If you notice that the student's Writing Target (tW) is noticeably lower than their Reading (tR) or Listening (tL) targets (e.g. tL=8.0, tW=6.5 to get an overall 7.0), you MUST explicitly explain this in the `strategy_explanation.summary`. Tell them this is a "Compensatory Strategy": we aim for very high scores in Reading and Listening to secure the overall Target Band, which takes the pressure off Writing. 
CRITICAL: You MUST explicitly state that they will still rigorously train ALL sections every week, including Writing, to improve their skills. NEVER tell the student to "ignore" a section, "keep a score low", or that they don't need to practice something. The tone must be motivating and comprehensive.

IELTS ACADEMIC KNOWLEDGE & APP CONTENT CONSTRAINTS:

Reading (Use ONLY these real topics from our database):
{reading_topics}

Listening (Use ONLY these real contexts):
{listening_contexts}

Podcasts (BBC 6-Minute English / Power Tasks):
- The Benefits of Doing Nothing, Inflation Explained, Following Your Dreams, Future of Work, Artificial Intelligence.

Writing Task 1 (Academic):
- Line Graph, Bar Chart, Pie Chart, Data Table, Process Diagram, Map Comparison, Mixed Data

Writing Task 2 (Essays) & Vocabulary Themes (USE EXACTLY THESE):
- Business
- Environment
- Education
- Shopping
- Transport & Mobility
- Health & Society
- Speaking Part 1 Topics (Everyday Life)
- Speaking Part 2 Topics (Storytelling & Experiences)
- Speaking Part 3 Topics (Abstract & Social Issues)
"""

ROADMAP_ENRICHMENT_USER = """
Generate all text content for this IELTS Academic study roadmap.

═══ STUDENT PROFILE ═══
Target Overall: {target_overall}
Current Scores: L:{L} R:{R} W:{W}
Section Targets: L:{tL} R:{tR} W:{tW}
Strategy Type: {strategy_type}
Total Weeks: {total_weeks}
Weakest Skill: {weakest_skill}
Specific Challenges: {challenges}
Daily Study Time: {daily_minutes} min
Study Days: {days_per_week}/week

═══ STRATEGY CONTEXT ═══
Min Sum Needed: {min_sum}
Time Saved vs Balanced: {time_saved} weeks
Risk Level: {risk_level}

═══ ROADMAP SKELETON ═══
{roadmap_skeleton_json}

═══ OUTPUT FORMAT ═══
Return ONLY a valid JSON object with this EXACT structure:

{{
  "strategy_explanation": {{
    "headline": "Your {total_weeks}-Week Smart Strategy to Band {target_overall}",
    "summary": "2-3 sentences explaining the core strategic insight"
  }},
  
  "weeks": [
    {{
      "week_number": 1,
      "goal": "Clear, specific week goal (1-2 sentences)",
      "ai_coach_message": "Explains why this week's plan looks this way",
      "tasks": [
        {{
          "task_id": "w1_d1_t1",
          "title": "Specific task title with topic and focus area",
          "description": "What the student will do, how long, what to focus on",
          "tip": "One concrete, actionable tip"
        }}
      ]
    }}
  ]
}}
"""

def get_available_test_content() -> tuple[str, str]:
    """Scans local JSON files to tell the AI what content actually exists."""
    reading_dir = os.path.join(os.path.dirname(__file__), "data", "reading-tests")
    listening_dir = os.path.join(os.path.dirname(__file__), "data", "listening-tests")
    
    reading_content = []
    if os.path.exists(reading_dir):
        for f in os.listdir(reading_dir):
            if f.endswith(".json") and f.startswith("test-") and f != "backend-response.json":
                try:
                    test_id = f.replace("test-", "").replace(".json", "")
                    with open(os.path.join(reading_dir, f), encoding="utf-8") as file:
                        data = json.load(file)
                        test_name = data.get("testName") or data.get("title") or "Reading Test"
                        # For reading, we usually have passages
                        passages = []
                        for part in data.get("passages", []) or data.get("parts", []):
                            if "title" in part:
                                passages.append(part["title"].strip())
                        
                        if passages:
                            reading_content.append({"id": test_id, "title": test_name, "topics": passages})
                        else:
                            reading_content.append({"id": test_id, "title": test_name})
                except Exception:
                    pass

    listening_content = []
    if os.path.exists(listening_dir):
        for f in os.listdir(listening_dir):
            if f.endswith(".json") and f.startswith("test-"):
                try:
                    test_id = f.replace("test-", "").replace(".json", "")
                    with open(os.path.join(listening_dir, f), encoding="utf-8") as file:
                        data = json.load(file)
                        test_name = data.get("testName") or data.get("title") or f"Listening Test {test_id}"
                        listening_content.append({"id": test_id, "title": test_name})
                except Exception:
                    pass

    r_str = "\n".join([f"ID {c['id']}: {c['title']} (Topics: {', '.join(c.get('topics', []))})" for c in itertools.islice(reading_content, 15)]) if reading_content else "- Various Academic Topics"
    l_str = "\n".join([f"ID {c['id']}: {c['title']}" for c in itertools.islice(listening_content, 15)]) if listening_content else "- Everyday and Academic contexts"
    
    return r_str, l_str

BATCH_ENRICHMENT_USER = """
Generate text content for THESE specific weeks of an IELTS study roadmap.

═══ STUDENT CONTEXT ═══
Target Overall: {target_overall}
Current Scores: L:{L} R:{R} W:{W}
Section Targets: L:{tL} R:{tR} W:{tW}
Weakest Skill: {weakest_skill}
Daily Study: {daily_minutes} min, {days_per_week} days/week

═══ WEEKS TO ENRICH (Batch {batch_num}/{total_batches}) ═══
{batch_skeleton_json}

═══ OUTPUT FORMAT ═══
Return ONLY a valid JSON object:
{{
  "weeks": [
    {{
      "week_number": <number>,
      "goal": "Clear, specific week goal (1-2 sentences)",
      "ai_coach_message": "Explains why this week's plan looks this way",
      "tasks": [
        {{
          "task_id": "<keep the same task_id>",
          "title": "Specific task title with topic and focus area",
          "description": "What the student will do, how long, what to focus on",
          "tip": "One concrete, actionable tip",
          "reason": "Why this task is assigned — strategic reasoning in 1 sentence (e.g. 'You need to improve T/F/NG accuracy from 60%% to 80%% to reach Band 6.5 in Reading')",
          "content_id": "<ID from the available content list if applicable (string), else null>"
        }}
      ]
    }}
  ]
}}

Return pure JSON, no markdown fences.
"""


async def enrich_roadmap(profile: StudentProfile, strategy: Strategy, roadmap: RoadmapData) -> Dict[str, Any]:
    """
    Calls LLM to fill in the missing text fields of the structural roadmap.
    Processes weeks in batches of 3 to avoid JSON truncation.
    """
    
    # 1. Get real database content
    reading_topics_str, listening_contexts_str = get_available_test_content()
    
    sys_prompt = ROADMAP_ENRICHMENT_SYSTEM.format(
        reading_topics=reading_topics_str,
        listening_contexts=listening_contexts_str
    )
    
    # 2. Extract full skeleton
    all_week_skeletons = []
    for w in roadmap.weeks:
        all_week_skeletons.append({
            "week_number": w.week_number,
            "phase_name": w.phase_name,
            "allocation": w.allocation,
            "tasks": [
                {
                    "task_id": t.id,
                    "skill": t.skill,
                    "task_type": t.task_type,
                    "duration": t.duration_minutes,
                    "difficulty": t.difficulty_band,
                    "chart_type": getattr(t, 'chart_type', None),
                    "essay_type": getattr(t, 'essay_type', None),
                    "question_types": getattr(t, 'question_types', None),
                    "fallback_title": getattr(t, 'fallback_title', None),
                    "fallback_desc": getattr(t, 'fallback_desc', None),
                    "steps": getattr(t, 'steps', None),
                    "content_id": getattr(t, 'content_id', None),
                } for t in w.tasks
            ]
        })
    
    # 3. Process in batches of 1 week to avoid 4096-token limit
    BATCH_SIZE = 1
    batches = [
        all_week_skeletons[i:i + BATCH_SIZE]
        for i in range(0, len(all_week_skeletons), BATCH_SIZE)
    ]
    total_batches = len(batches)
    
    client = DirectLLMClient()
    all_enriched_weeks = []
    
    logger.info(f"Enriching roadmap: {len(all_week_skeletons)} weeks in {total_batches} batches of {BATCH_SIZE}")
    
    for batch_idx, batch in enumerate(batches):
        batch_num = batch_idx + 1
        logger.info(f"  Batch {batch_num}/{total_batches}: weeks {batch[0]['week_number']}-{batch[-1]['week_number']}")
        
        # Strip verbose 'steps' field before sending to LLM to save tokens,
        # but KEEP fallback_title and fallback_desc so the LLM knows the session structure.
        llm_batch = []
        for week in batch:
            llm_week = {k: v for k, v in week.items() if k != 'tasks'}
            llm_week['tasks'] = []
            for t in week['tasks']:
                llm_t = {k: v for k, v in t.items() if k != 'steps'}
                llm_week['tasks'].append(llm_t)
            llm_batch.append(llm_week)
            
        user_prompt = BATCH_ENRICHMENT_USER.format(
            target_overall=profile.target_overall,
            L=profile.current_scores.get('L', 0),
            R=profile.current_scores.get('R', 0),
            W=profile.current_scores.get('W', 0),
            tL=strategy.target_sections.get('L', 0),
            tR=strategy.target_sections.get('R', 0),
            tW=strategy.target_sections.get('W', 0),
            weakest_skill=profile.weakest_skill,
            daily_minutes=profile.daily_minutes,
            days_per_week=profile.days_per_week,
            batch_num=batch_num,
            total_batches=total_batches,
            batch_skeleton_json=json.dumps({"weeks": llm_batch}, indent=2)
        )
        
        try:
            response_text = await client.call_openai_async(
                model="gpt-4o",
                system_prompt=sys_prompt,
                user_prompt=user_prompt,
                temperature=0.2,
                max_tokens=4096
            )
            
            # Clean up possible markdown fences
            text = response_text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            
            batch_data = json.loads(text.strip())
            batch_weeks = batch_data.get("weeks", [])
        except Exception as e:
            logger.error(f"  Batch {batch_num} failed: {e}")
            batch_weeks = []
            
        # Merge LLM output (if any) with the original skeletons
        for week_skel in batch:
            # Find the corresponding LLM-enriched week
            llm_week = next((w for w in batch_weeks if w.get("week_number") == week_skel["week_number"]), None)
            
            merged_week = {
                "week_number": week_skel["week_number"],
                "goal": llm_week.get("goal", f"Week {week_skel['week_number']} — {week_skel['phase_name']} phase") if llm_week else f"Week {week_skel['week_number']} — {week_skel['phase_name']} phase",
                "ai_coach_message": llm_week.get("ai_coach_message", "Keep studying consistently to reach your target.") if llm_week else "Keep studying consistently to reach your target.",
                "tasks": []
            }
            
            # Merge each task
            llm_tasks = llm_week.get("tasks", []) if llm_week else []
            llm_tasks_dict = {str(t.get("task_id")): t for t in llm_tasks if "task_id" in t}
            
            for skel_t in week_skel["tasks"]:
                t_id = str(skel_t["task_id"])
                llm_t = llm_tasks_dict.get(t_id, {})
                
                merged_task = skel_t.copy()  # Keeps skill, duration, etc.
                fallback_title = skel_t.get("fallback_title", f"{skel_t['skill'].title()} Practice")
                fallback_desc = skel_t.get("fallback_desc", f"{skel_t['duration']} minute {skel_t['skill']} practice session.")
                merged_task.update({
                    "title": llm_t.get("title", fallback_title),
                    "description": llm_t.get("description", fallback_desc),
                    "tip": llm_t.get("tip", "Focus on accuracy before speed."),
                    "reason": llm_t.get("reason", "Scheduled by your AI coach based on your skill profile."),
                    "content_id": llm_t.get("content_id") or skel_t.get("content_id")
                })
                # Remove internal-only fields
                merged_task.pop("fallback_title", None)
                merged_task.pop("fallback_desc", None)
                merged_week["tasks"].append(merged_task)
                
            all_enriched_weeks.append(merged_week)
    
    # 4. Build final result
    enriched_data = {
        "strategy_explanation": {
            "headline": f"Your {strategy.total_weeks}-Week Smart Strategy to Band {profile.target_overall}",
            "summary": f"This plan prioritizes your weakest areas to maximize your score efficiently over {strategy.total_weeks} weeks."
        },
        "weeks": all_enriched_weeks
    }
    
    logger.info(f"Roadmap enrichment complete: {len(all_enriched_weeks)} total weeks")
    return enriched_data
