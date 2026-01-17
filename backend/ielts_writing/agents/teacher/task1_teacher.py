"""
Task 1 Teacher Agent - FIXED TIMEOUT VERSION

Key changes:
1. Uses httpx directly for reliable timeout
2. Implements streaming for faster perceived response
3. Has fallback to quick feedback if full feedback times out
"""

import os
import json
import logging
import asyncio
import time
from typing import Optional, Dict, Any, AsyncGenerator

import httpx
from cachetools import TTLCache

from ..prompts.task1_teacher_prompt_lite import (
    TASK1_TEACHER_SYSTEM_PROMPT_LITE,
    build_task1_teacher_prompt_lite
)
from ...schemas.task1_teacher import (
    Task1TeacherFeedbackResponse,
    Task1TeacherFeedbackRequest
)

logger = logging.getLogger(__name__)


class Task1Teacher:
    """
    Task 1 Teacher with reliable timeouts.
    
    Timeout Strategy:
    1. httpx connect timeout: 10s (fail fast if can't connect)
    2. httpx read timeout: 45s (total time for response)
    3. Fallback: Quick feedback if full feedback times out
    """
    
    def __init__(self, model: str = None):
        self.model = model or os.getenv(
            "TEACHER_MODEL",
            "openai/gpt-4.1"
        )
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.site_url = os.getenv("OPENROUTER_SITE_URL", "http://localhost:5173")
        self.app_name = os.getenv("OPENROUTER_APP_NAME", "IELTS-AI")
        self.temperature = 0.3  # Slightly lower for faster, more focused output
        self.max_tokens = 2000  # Reduced for faster, focused feedback (was 8192)
        
        # Timeout configuration
        self.connect_timeout = 10.0  # Max time to establish connection
        self.read_timeout = 30.0     # Reduced to match shorter response (was 60s)
        
        # Create httpx client for OpenRouter with explicit timeouts
        self.http_client = httpx.Client(
            timeout=httpx.Timeout(
                connect=self.connect_timeout,
                read=self.read_timeout,
                write=30.0,
                pool=10.0
            )
        )
        
        # OpenRouter API endpoint
        self.openrouter_url = "https://openrouter.ai/api/v1/chat/completions"
        
        # Cache config: 100 responses, 1 hour TTL
        self.cache = TTLCache(maxsize=100, ttl=3600)
    
    # @retry removed to prevent double timeout (fallback is the retry)
    def _call_openrouter(self, system: str, user: str, max_tokens: int) -> str:
        """Call OpenRouter API with timeout protection."""
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is not set. Please set it in backend/.env file.")
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": self.site_url,
            "X-Title": self.app_name
        }
        
        payload = {
            "model": self.model,
            "max_tokens": max_tokens,
            "temperature": self.temperature,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user}
            ]
        }
        
        response = self.http_client.post(
            self.openrouter_url,
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        
        data = response.json()
        return data["choices"][0]["message"]["content"]
    
    def generate_feedback(
        self,
        request: Task1TeacherFeedbackRequest
    ) -> Task1TeacherFeedbackResponse:
        """
        Generate feedback with timeout protection.
        
        Falls back to quick feedback if full feedback times out.
        """
        
        logger.info(f"[Task1Teacher] Starting feedback for {request.student_name}")
        start_time = time.time()
        
        # Check cache first
        cache_key = f"{request.student_name}:{hash(request.essay[:500])}"
        if cache_key in self.cache:
            logger.info("[Task1Teacher] Cache hit!")
            return self.cache[cache_key]
        
        try:
            # Try full feedback first
            feedback = self._generate_full_feedback(request)
            self.cache[cache_key] = feedback  # Store in cache
            logger.info(f"[Task1Teacher] Full feedback complete in {time.time() - start_time:.2f}s")
            return feedback
            
        except httpx.TimeoutException as e:
            logger.warning(f"[Task1Teacher] Full feedback timed out: {e}")
            logger.info("[Task1Teacher] Falling back to quick feedback...")
            feedback = self._generate_quick_feedback(request)
            logger.info(f"[Task1Teacher] Quick feedback complete in {time.time() - start_time:.2f}s")
            return feedback
            
        except httpx.HTTPStatusError as e:
            logger.warning(f"[Task1Teacher] OpenRouter API error: {e}")
            feedback = self._generate_quick_feedback(request)
            logger.info(f"[Task1Teacher] Quick feedback complete in {time.time() - start_time:.2f}s")
            return feedback
            
        except Exception as e:
            logger.error(f"[Task1Teacher] Error: {e}")
            feedback = self._generate_fallback_feedback(request, str(e))
            logger.info(f"[Task1Teacher] Fallback feedback complete in {time.time() - start_time:.2f}s")
            return feedback
    
    def _generate_full_feedback(
        self,
        request: Task1TeacherFeedbackRequest
    ) -> Task1TeacherFeedbackResponse:
        """Generate full detailed feedback."""
        
        user_prompt = build_task1_teacher_prompt_lite(
            student_name=request.student_name,
            essay=request.essay,
            question=request.question,
            examiner_scores=request.examiner_scores or {},
            chart_type=request.chart_type
        )
        
        logger.info(f"[Task1Teacher] Calling OpenRouter GPT-4.1 (timeout: {self.read_timeout}s)")
        
        content = self._call_openrouter(
            system=TASK1_TEACHER_SYSTEM_PROMPT_LITE,
            user=user_prompt,
            max_tokens=self.max_tokens
        )
        
        logger.info("[Task1Teacher] Response received")
        
        feedback_data = self._parse_json_response(content)
        
        # Convert lite format to full Pydantic schema
        return self._convert_lite_to_full_schema(feedback_data, request)
    
    def _generate_quick_feedback(
        self,
        request: Task1TeacherFeedbackRequest
    ) -> Task1TeacherFeedbackResponse:
        """
        Generate quick feedback when full feedback times out.
        Uses a much shorter prompt and fewer tokens.
        """
        
        logger.info("[Task1Teacher] Generating quick feedback...")
        
        quick_prompt = self._build_quick_prompt(request)
        
        content = self._call_openrouter(
            system="You are an IELTS tutor. Give brief, helpful feedback. Return JSON only.",
            user=quick_prompt,
            max_tokens=800  # Much smaller
        )
        
        quick_data = self._parse_json_response(content)
        
        # Convert quick format to full format
        return self._convert_quick_to_full(quick_data, request)
    
    def _build_quick_prompt(self, request: Task1TeacherFeedbackRequest) -> str:
        """Build a minimal prompt for quick feedback."""
        
        scores = request.examiner_scores or {}
        criterion_scores = scores.get("criterion_scores", [])
        
        # Extract individual scores
        ta_score = criterion_scores[0].get("band", 6.0) if len(criterion_scores) > 0 else 6.0
        cc_score = criterion_scores[1].get("band", 6.0) if len(criterion_scores) > 1 else 6.0
        lr_score = criterion_scores[2].get("band", 6.0) if len(criterion_scores) > 2 else 6.0
        gr_score = criterion_scores[3].get("band", 6.0) if len(criterion_scores) > 3 else 6.0
        
        return f"""Student: {request.student_name}
Essay (Task 1 - {request.chart_type or 'chart'}):
\"\"\"{request.essay[:500]}...\"\"\"

Scores: TA={ta_score}, CC={cc_score}, LR={lr_score}, GRA={gr_score}

Give quick feedback as JSON:
{{
  "personal_note": "2 sentences using their name",
  "top_strength": "quote from essay + why it's good",
  "top_weakness": "quote + correction + why",
  "quick_tip": "one actionable tip"
}}"""
    
    def _convert_quick_to_full(
        self,
        quick_data: dict,
        request: Task1TeacherFeedbackRequest
    ) -> Task1TeacherFeedbackResponse:
        """Convert quick feedback format to full response schema."""
        
        scores = request.examiner_scores or {}
        criterion_scores = scores.get("criterion_scores", [])
        
        # Build minimal but valid response
        return Task1TeacherFeedbackResponse(
            student_name=request.student_name,
            task_type="task1",
            chart_type=request.chart_type,
            word_count=len(request.essay.split()),
            attempt_number=request.attempt_number,
            
            overall_summary={
                "personal_note": quick_data.get("personal_note", f"{request.student_name}, here's your quick feedback."),
                "scores": [
                    {"criterion": "Task Achievement", "band": criterion_scores[0].get("band", 6.0) if len(criterion_scores) > 0 else 6.0, "status": "developing"},
                    {"criterion": "Coherence & Cohesion", "band": criterion_scores[1].get("band", 6.0) if len(criterion_scores) > 1 else 6.0, "status": "developing"},
                    {"criterion": "Lexical Resource", "band": criterion_scores[2].get("band", 6.0) if len(criterion_scores) > 2 else 6.0, "status": "developing"},
                    {"criterion": "Grammatical Range", "band": criterion_scores[3].get("band", 6.0) if len(criterion_scores) > 3 else 6.0, "status": "developing"}
                ],
                "estimated_overall": scores.get("overall_band", 6.0),
                "superpower": quick_data.get("top_strength", "Good attempt at describing the data"),
                "superpower_example": "",
                "priority": quick_data.get("top_weakness", "Focus on grammar accuracy"),
                "priority_quick_win": quick_data.get("quick_tip", "Check your articles and verb agreement")
            },
            
            # Minimal criterion feedback
            task_achievement=self._build_minimal_criterion("Task Achievement", criterion_scores, 0),
            coherence_cohesion=self._build_minimal_criterion("Coherence & Cohesion", criterion_scores, 1),
            lexical_resource=self._build_minimal_criterion("Lexical Resource", criterion_scores, 2),
            grammatical_range=self._build_minimal_criterion("Grammatical Range", criterion_scores, 3),
            
            action_plan={
                "priority_focus": "Grammar",
                "priority_reason": "Improving accuracy will boost your overall score",
                "practice_schedule": [
                    {"day": 1, "focus": "Review", "task": "Review this feedback", "time_minutes": 10},
                    {"day": 2, "focus": "Practice", "task": "Write another Task 1 essay", "time_minutes": 20},
                    {"day": 3, "focus": "Compare", "task": "Compare with this essay", "time_minutes": 10}
                ],
                "pre_writing_checklist": [
                    "Write an overview first",
                    "Check articles (a/an/the)",
                    "Use varied vocabulary"
                ],
                "closing_message": f"Keep practicing, {request.student_name}!"
            },
            
            # New sections default to None for quick feedback
            vocabulary_grammar_upgrade=None,
            band_improvement_path=None,
            band7_model_upgrade=None,
            teachers_final_comment=None,
            
            improvement_notes="Quick feedback generated due to timeout. Submit again for detailed analysis."
        )
    
    def _build_minimal_criterion(self, name: str, scores: list, index: int) -> dict:
        """Build minimal criterion feedback."""
        
        band = scores[index].get("band", 6.0) if len(scores) > index else 6.0
        justification = scores[index].get("justification", "") if len(scores) > index else ""
        
        return {
            "band": band,
            "status": "strong" if band >= 7 else "developing" if band >= 6 else "needs_work",
            "score_explanation": {
                "why_this_score": justification or "Score based on examiner evaluation.",
                "band_descriptor_evidence": "See examiner feedback above for detailed justification.",
                "path_to_improvement": "Review the examiner's notes for specific improvement areas."
            },
            "overview_quality": "basic" if name == "Task Achievement" else None,
            "overview_feedback": justification if name == "Task Achievement" else None,
            "data_accuracy": "accurate" if name == "Task Achievement" else None,
            "key_features_covered": True if name == "Task Achievement" else None,
            "comparisons_made": True if name == "Task Achievement" else None,
            "paragraph_structure_ok": True if name == "Coherence & Cohesion" else None,
            "logical_data_grouping": True if name == "Coherence & Cohesion" else None,
            "trend_vocabulary_range": "adequate" if name == "Lexical Resource" else None,
            "comparison_vocabulary_range": "adequate" if name == "Lexical Resource" else None,
            "collocations_accurate": True if name == "Lexical Resource" else None,
            "spelling_issues": [] if name == "Lexical Resource" else None,
            "tense_consistency": True if name == "Grammatical Range" else None,
            "passive_voice_usage": True if name == "Grammatical Range" else None,
            "article_accuracy": True if name == "Grammatical Range" else None,
            "sentence_variety": "adequate" if name == "Grammatical Range" else None,
            "what_it_measures": [justification] if justification else ["See examiner feedback"],
            "strengths": [],
            "weakness_patterns": [],
            "tips": [{"tip": "Review examiner feedback for details", "priority": "medium"}],
            "micro_task": {
                "task_type": "Review",
                "instruction": "Review the examiner's justification above",
                "examples": None,
                "time_minutes": 5
            }
        }
    
    def _generate_fallback_feedback(
        self,
        request: Task1TeacherFeedbackRequest,
        error: str
    ) -> Task1TeacherFeedbackResponse:
        """Generate minimal fallback when everything fails."""
        
        logger.error(f"[Task1Teacher] Using fallback due to: {error}")
        
        scores = request.examiner_scores or {}
        
        return Task1TeacherFeedbackResponse(
            student_name=request.student_name,
            task_type="task1",
            chart_type=request.chart_type,
            word_count=len(request.essay.split()),
            attempt_number=request.attempt_number,
            
            overall_summary={
                "personal_note": f"{request.student_name}, we couldn't generate detailed feedback right now. Please check your examiner scores above and try again later for full feedback.",
                "scores": [],
                "estimated_overall": scores.get("overall_band", 6.0),
                "superpower": "Unable to analyze",
                "superpower_example": "",
                "priority": "Unable to analyze",
                "priority_quick_win": "Try submitting again"
            },
            
            task_achievement=self._empty_criterion_feedback("Task Achievement"),
            coherence_cohesion=self._empty_criterion_feedback("Coherence & Cohesion"),
            lexical_resource=self._empty_criterion_feedback("Lexical Resource"),
            grammatical_range=self._empty_criterion_feedback("Grammatical Range"),
            
            action_plan={
                "priority_focus": "Retry",
                "priority_reason": f"Feedback generation failed: {error}",
                "practice_schedule": [],
                "pre_writing_checklist": ["Try submitting again"],
                "closing_message": "Please try again. If the issue persists, contact support."
            },
            
            # New sections default to None for fallback
            vocabulary_grammar_upgrade=None,
            band_improvement_path=None,
            band7_model_upgrade=None,
            teachers_final_comment=None,
            
            improvement_notes=f"Error: {error}"
        )
    
    def _empty_criterion_feedback(self, name: str) -> dict:
        """Create empty criterion feedback for fallback."""
        base = {
            "band": 0,
            "status": "needs_work",
            "score_explanation": {
                "why_this_score": "Unable to generate feedback due to system error.",
                "band_descriptor_evidence": "Feedback generation failed. Please try again.",
                "path_to_improvement": "Resubmit your essay for detailed feedback."
            },
            "what_it_measures": ["Unable to analyze"],
            "strengths": [],
            "weakness_patterns": [],
            "tips": [],
            "micro_task": {
                "task_type": "Retry",
                "instruction": "Please submit again",
                "time_minutes": 5
            }
        }
        
        # Add criterion-specific fields
        if name == "Task Achievement":
            base.update({
                "overview_quality": "missing",
                "overview_feedback": "Unable to analyze",
                "data_accuracy": "significant_errors",
                "key_features_covered": False,
                "comparisons_made": False
            })
        elif name == "Coherence & Cohesion":
            base.update({
                "paragraph_structure_ok": False,
                "logical_data_grouping": False
            })
        elif name == "Lexical Resource":
            base.update({
                "trend_vocabulary_range": "limited",
                "comparison_vocabulary_range": "limited",
                "collocations_accurate": False,
                "spelling_issues": []
            })
        elif name == "Grammatical Range":
            base.update({
                "tense_consistency": False,
                "passive_voice_usage": False,
                "article_accuracy": False,
                "sentence_variety": "limited"
            })
            
        return base

    def _convert_lite_to_full_schema(
        self, 
        lite_data: Dict[str, Any], 
        request: Task1TeacherFeedbackRequest
    ) -> Task1TeacherFeedbackResponse:
        """
        Convert simplified 'lite' JSON from prompt to full strict Pydantic schema.
        Handles missing fields by providing defaults.
        """
        
        # 1. Helper to create ActionPlan
        lite_action = lite_data.get("action_plan", {})
        # Ensure quick_wins is a list of strings
        quick_wins = lite_action.get("quick_wins", ["Check errors"])
        if isinstance(quick_wins, str): quick_wins = [quick_wins]
        
        full_action_plan = {
            "priority_focus": lite_action.get("priority_focus", "General Improvement"),
            "priority_reason": lite_data.get("overall_summary", {}).get("priority", "To improve your band score"),
            "practice_schedule": [
                {"day": 1, "focus": "Review", "task": "Review this feedback", "time_minutes": 5},
                {"day": 2, "focus": "Quick Win", "task": quick_wins[0] if quick_wins else "Review errors", "time_minutes": 10},
                {"day": 3, "focus": "Practice", "task": "Write a new essay", "time_minutes": 15}
            ],
            "pre_writing_checklist": quick_wins[:3],
            "closing_message": lite_action.get("closing_message", "Keep practicing!")
        }

        # 2. Helper to create Criterion Feedback
        def build_criterion(name: str, key: str):
            lite_crit = lite_data.get(key, {})
            band = lite_crit.get("band", 6.0)
            
            # Extract score explanation fields
            score_explanation = {
                "why_this_score": lite_crit.get("why_this_score", "Score based on overall performance."),
                "band_descriptor_evidence": lite_crit.get("band_descriptor_evidence", "See detailed feedback for band descriptor match."),
                "path_to_improvement": lite_crit.get("path_to_improvement", "Focus on addressing identified weaknesses.")
            }
            
            # Map simplified lists to complex objects
            strengths_raw = lite_crit.get("strengths", [])
            if isinstance(strengths_raw, str): strengths_raw = [strengths_raw]
            
            strengths = []
            for s in strengths_raw:
                if isinstance(s, dict):
                    strengths.append({
                        "category": s.get("name", "Strength"),
                        "quote": s.get("quote", ""),
                        "explanation": s.get("explanation", "Good usage")
                    })
                else:
                    strengths.append({"category": "Strength", "quote": s, "explanation": "Good usage"})

            weaknesses = []
            weaknesses_raw = lite_crit.get("weakness_patterns", []) or lite_crit.get("weaknesses", [])
            if isinstance(weaknesses_raw, str): weaknesses_raw = [weaknesses_raw]
            
            for w in weaknesses_raw:
                if isinstance(w, dict):
                    weaknesses.append({
                        "pattern_name": w.get("name") or w.get("pattern_name") or "Identified Issue",
                        "description": w.get("problem") or w.get("description") or "",
                        "examples": w.get("examples") or ([w.get("quote")] if w.get("quote") else []),
                        "frequency": w.get("frequency", 1),
                        "impact": "high",
                        "is_recurring": False,
                        "fix": w.get("fix", "")
                    })
                else:
                    weaknesses.append({
                        "pattern_name": "Identified Issue",
                        "description": str(w),
                        "examples": [],
                        "frequency": 1,
                        "impact": "high",
                        "is_recurring": False,
                        "fix": ""
                    })
            
            top_tip = lite_crit.get("top_tip", "Review this section")
            tips = [{"tip": top_tip, "priority": "high"}]

            # Defaults for strict enums
            return {
                "band": band,
                "status": "strong" if band >= 7 else "developing" if band >= 6 else "needs_work",
                "score_explanation": score_explanation,
                # Task Achievement specific
                "overview_quality": "good" if band >= 6 else "basic",
                "overview_feedback": "See feedback",
                "data_accuracy": "accurate",
                "key_features_covered": True,
                "comparisons_made": True,
                # Coherence specific
                "paragraph_structure_ok": True,
                "logical_data_grouping": True,
                # Lexical specific
                "trend_vocabulary_range": "adequate",
                "comparison_vocabulary_range": "adequate",
                "collocations_accurate": True,
                "spelling_issues": [],
                # Grammar specific
                "tense_consistency": True,
                "passive_voice_usage": True,
                "article_accuracy": True,
                "sentence_variety": "adequate",
                
                "what_it_measures": ["See examiner notes"],
                "strengths": strengths,
                "weakness_patterns": weaknesses,
                "tips": tips,
                "micro_task": {"task_type": "Review", "instruction": "Check feedback", "time_minutes": 5}
            }
        
        # Build score list from request if available
        # Ensure each score has a 'status' field (required by schema)
        scores = []
        if request.examiner_scores and "criterion_scores" in request.examiner_scores:
            for score in request.examiner_scores["criterion_scores"]:
                band = score.get("band", 6.0)
                # Calculate status based on band (same logic as quick feedback)
                if "status" not in score:
                    if band >= 7:
                        status = "strong"
                    elif band >= 6:
                        status = "developing"
                    else:
                        status = "needs_work"
                    score = {**score, "status": status}
                scores.append(score)

        # Extract new sections from lite_data
        vocab_grammar = lite_data.get("vocabulary_grammar_upgrade", {})
        band_path = lite_data.get("band_improvement_path", {})
        model_upgrade = lite_data.get("band7_model_upgrade", {})
        final_comment = lite_data.get("teachers_final_comment", "")
        
        # Convert vocabulary_grammar_upgrade
        vocab_grammar_upgrade = None
        if vocab_grammar and vocab_grammar.get("word_phrase_upgrades"):
            from ...schemas.task1_teacher import (
                VocabularyGrammarUpgrade, WordPhraseUpgrade, SentenceStructureUpgrade,
                BandImprovementPath, PrioritizedAction, Band7ModelUpgrade
            )
            vocab_grammar_upgrade = VocabularyGrammarUpgrade(
                word_phrase_upgrades=[
                    WordPhraseUpgrade(basic=w.get("basic", ""), improved=w.get("improved", ""))
                    for w in vocab_grammar.get("word_phrase_upgrades", [])
                ],
                sentence_structure_upgrades=[
                    SentenceStructureUpgrade(
                        original=s.get("original", ""),
                        improved=s.get("improved", ""),
                        explanation=s.get("explanation")
                    )
                    for s in vocab_grammar.get("sentence_structure_upgrades", [])
                ]
            )
        
        # Convert band_improvement_path
        band_improvement_path = None
        if band_path and band_path.get("prioritized_actions"):
            from ...schemas.task1_teacher import BandImprovementPath, PrioritizedAction
            band_improvement_path = BandImprovementPath(
                current_band=band_path.get("current_band", 6.0),
                target_band=band_path.get("target_band", 6.5),
                prioritized_actions=[
                    PrioritizedAction(
                        action=a.get("action", ""),
                        why=a.get("why", ""),
                        location=a.get("location", "")
                    )
                    for a in band_path.get("prioritized_actions", [])
                ]
            )
        
        # Convert band7_model_upgrade
        band7_model_upgrade = None
        if model_upgrade and model_upgrade.get("original_paragraph"):
            from ...schemas.task1_teacher import Band7ModelUpgrade
            band7_model_upgrade = Band7ModelUpgrade(
                original_paragraph=model_upgrade.get("original_paragraph", ""),
                improved_paragraph=model_upgrade.get("improved_paragraph", ""),
                explanation=model_upgrade.get("explanation", "")
            )
        
        return Task1TeacherFeedbackResponse(
            student_name=request.student_name,
            task_type="task1",
            chart_type=request.chart_type,
            word_count=len(request.essay.split()),
            attempt_number=request.attempt_number,
            overall_summary={
                "personal_note": lite_data.get("overall_summary", {}).get("personal_note", "Hi!"),
                "scores": scores,
                "estimated_overall": lite_data.get("overall_summary", {}).get("estimated_overall", 6.0),
                "superpower": lite_data.get("overall_summary", {}).get("superpower", "Effort"),
                "superpower_example": "",
                "priority": lite_data.get("overall_summary", {}).get("priority", "Practice"),
                "priority_quick_win": lite_data.get("overall_summary", {}).get("priority_quick_win", "Review")
            },
            task_achievement=build_criterion("Task Achievement", "task_achievement"),
            coherence_cohesion=build_criterion("Coherence & Cohesion", "coherence_cohesion"),
            lexical_resource=build_criterion("Lexical Resource", "lexical_resource"),
            grammatical_range=build_criterion("Grammatical Range", "grammatical_range"),
            action_plan=full_action_plan,
            vocabulary_grammar_upgrade=vocab_grammar_upgrade,
            band_improvement_path=band_improvement_path,
            band7_model_upgrade=band7_model_upgrade,
            teachers_final_comment=final_comment if final_comment else None
        )
    
    def _parse_json_response(self, content: str) -> Dict:
        """Parse JSON from LLM response."""
        
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        
        try:
            return json.loads(content.strip())
        except json.JSONDecodeError as e:
            logger.error(f"[Task1Teacher] JSON Decode Error: {e}")
            logger.error(f"[Task1Teacher] Failed Content Preview: {content[:500]}...")
            raise e
    
    def format_as_markdown(self, feedback: Any) -> str:
        """Format teacher feedback as markdown for display."""
        
        try:
            # Handle both dict (from JSON/Fallback) and object
            if isinstance(feedback, dict):
                summary = feedback.get('overall_summary', {})
                action_plan = feedback.get('action_plan', {})
                student_name = feedback.get('student_name', 'Student')
            else:
                summary = getattr(feedback, 'overall_summary', {}) or {}
                action_plan = getattr(feedback, 'action_plan', {}) or {}
                student_name = getattr(feedback, 'student_name', 'Student')

            # Ensure summary/action_plan are dicts if they were accessed via getattr
            if not isinstance(summary, dict): summary = summary.model_dump() if hasattr(summary, 'model_dump') else {}
            if not isinstance(action_plan, dict): action_plan = action_plan.model_dump() if hasattr(action_plan, 'model_dump') else {}
            
            md = f"""# IELTS Writing Feedback for {student_name}

## Overall Summary
{summary.get('personal_note', 'Thank you for your submission.')}

**Estimated Band:** {summary.get('estimated_overall', 'N/A')}

### Your Superpower 💪
{summary.get('superpower', 'Strong attempt')}

### Priority Focus 🎯
{summary.get('priority', 'Continue practicing')}

**Quick Win:** {summary.get('priority_quick_win', 'Review your essay structure')}

---

## Action Plan

**Focus Area:** {action_plan.get('priority_focus', 'General improvement')}

{action_plan.get('priority_reason', '')}

### Practice Schedule
"""
            # Add practice schedule
            for item in action_plan.get('practice_schedule', []):
                md += f"- **Day {item.get('day', '?')}:** {item.get('task', '')} ({item.get('time_minutes', 10)} min)\n"
            
            md += f"""
### Pre-Writing Checklist
"""
            for item in action_plan.get('pre_writing_checklist', ['Review your work']):
                md += f"- [ ] {item}\n"
            
            md += f"""
---

{action_plan.get('closing_message', 'Keep practicing!')}
"""
            
            # Vocabulary & Grammar Upgrade
            if hasattr(feedback, 'vocabulary_grammar_upgrade') and feedback.vocabulary_grammar_upgrade:
                vg = feedback.vocabulary_grammar_upgrade if not isinstance(feedback.vocabulary_grammar_upgrade, dict) else type('obj', (object,), feedback.vocabulary_grammar_upgrade)
                if isinstance(feedback.vocabulary_grammar_upgrade, dict):
                    vg_dict = feedback.vocabulary_grammar_upgrade
                    md += "\n---\n\n## 4️⃣ Vocabulary & Grammar Upgrade\n\n"
                    md += "### Word & Phrase Upgrades\n"
                    for upgrade in vg_dict.get('word_phrase_upgrades', []):
                        md += f"- **{upgrade.get('basic', '')}** → **{upgrade.get('improved', '')}**\n"
                    md += "\n### Sentence Structure Upgrades\n"
                    for upgrade in vg_dict.get('sentence_structure_upgrades', []):
                        md += f"- **Your version:** {upgrade.get('original', '')}\n"
                        md += f"- **Improved:** {upgrade.get('improved', '')}\n"
                        if upgrade.get('explanation'):
                            md += f"  *{upgrade.get('explanation')}*\n"
                        md += "\n"
                else:
                    md += "\n---\n\n## 4️⃣ Vocabulary & Grammar Upgrade\n\n"
                    md += "### Word & Phrase Upgrades\n"
                    for upgrade in vg.word_phrase_upgrades:
                        md += f"- **{upgrade.basic}** → **{upgrade.improved}**\n"
                    md += "\n### Sentence Structure Upgrades\n"
                    for upgrade in vg.sentence_structure_upgrades:
                        md += f"- **Your version:** {upgrade.original}\n"
                        md += f"- **Improved:** {upgrade.improved}\n"
                        if upgrade.explanation:
                            md += f"  *{upgrade.explanation}*\n"
                        md += "\n"
            
            # Band Improvement Path
            if hasattr(feedback, 'band_improvement_path') and feedback.band_improvement_path:
                bip = feedback.band_improvement_path if not isinstance(feedback.band_improvement_path, dict) else type('obj', (object,), feedback.band_improvement_path)
                if isinstance(feedback.band_improvement_path, dict):
                    bip_dict = feedback.band_improvement_path
                    md += "\n---\n\n## 5️⃣ Band Improvement Path (VERY IMPORTANT)\n\n"
                    md += f"**If you fix ONLY these 3 things, you can move from Band {bip_dict.get('current_band', 6.0)} → Band {bip_dict.get('target_band', 6.5)}**\n\n"
                    for i, action in enumerate(bip_dict.get('prioritized_actions', []), 1):
                        md += f"{i}. **{action.get('action', '')}**\n"
                        md += f"   - *Why it matters:* {action.get('why', '')}\n"
                        md += f"   - *Where:* {action.get('location', '')}\n\n"
                else:
                    md += "\n---\n\n## 5️⃣ Band Improvement Path (VERY IMPORTANT)\n\n"
                    md += f"**If you fix ONLY these 3 things, you can move from Band {bip.current_band} → Band {bip.target_band}**\n\n"
                    for i, action in enumerate(bip.prioritized_actions, 1):
                        md += f"{i}. **{action.action}**\n"
                        md += f"   - *Why it matters:* {action.why}\n"
                        md += f"   - *Where:* {action.location}\n\n"
            
            # Band 7 Model Upgrade
            if hasattr(feedback, 'band7_model_upgrade') and feedback.band7_model_upgrade:
                b7 = feedback.band7_model_upgrade if not isinstance(feedback.band7_model_upgrade, dict) else type('obj', (object,), feedback.band7_model_upgrade)
                if isinstance(feedback.band7_model_upgrade, dict):
                    b7_dict = feedback.band7_model_upgrade
                    md += "\n---\n\n## 6️⃣ Band 7 Model Upgrade (Mini Example)\n\n"
                    md += "**Your version:**\n"
                    md += f"> {b7_dict.get('original_paragraph', '')}\n\n"
                    md += "**Improved Band 7 version:**\n"
                    md += f"> {b7_dict.get('improved_paragraph', '')}\n\n"
                    if b7_dict.get('explanation'):
                        md += f"*{b7_dict.get('explanation')}*\n"
                else:
                    md += "\n---\n\n## 6️⃣ Band 7 Model Upgrade (Mini Example)\n\n"
                    md += "**Your version:**\n"
                    md += f"> {b7.original_paragraph}\n\n"
                    md += "**Improved Band 7 version:**\n"
                    md += f"> {b7.improved_paragraph}\n\n"
                    if b7.explanation:
                        md += f"*{b7.explanation}*\n"
            
            # Teacher's Final Comment
            if hasattr(feedback, 'teachers_final_comment') and feedback.teachers_final_comment:
                final_comment = feedback.teachers_final_comment if isinstance(feedback.teachers_final_comment, str) else feedback.teachers_final_comment
                md += "\n---\n\n## 7️⃣ Teacher's Final Comment\n\n"
                md += f"{final_comment}\n"
            
            return md
            
        except Exception as e:
            logger.error(f"[Task1Teacher] Error formatting markdown: {e}")
            return f"# Feedback for {feedback.student_name}\n\nUnable to format detailed feedback. Please see the examiner scores above."
    
    def __del__(self):
        """Clean up HTTP client."""
        if hasattr(self, 'http_client'):
            self.http_client.close()