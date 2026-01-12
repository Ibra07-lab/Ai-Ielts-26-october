"""
Task 1 Teacher Agent

Provides personalized, teacher-level feedback specifically for
IELTS Writing Task 1 (Academic) — describing visual data.
"""

import os
import json
import logging
from typing import Optional, Dict, Any

from anthropic import Anthropic

from ..prompts.task1_teacher_prompt_optimized import (
    get_optimized_task1_teacher_prompt,
    build_concise_user_prompt
)
from ...schemas.task1_teacher import (
    Task1TeacherFeedbackResponse,
    Task1TeacherFeedbackRequest
)

logger = logging.getLogger(__name__)


class Task1Teacher:
    """
    Teacher agent specialized for IELTS Writing Task 1.
    
    Provides:
    - Personalized feedback using student name
    - Task 1-specific guidance (overview, data accuracy, trends)
    - Pattern-based error detection
    - Chart-type specific vocabulary suggestions
    - Actionable micro-tasks for improvement
    """
    
    def __init__(self, model: str = None):
        self.model = model or os.getenv(
            "IELTS_WRITING_MODEL",
            "claude-sonnet-4-5-20250929"
        )
        # Create Anthropic client with 30-second timeout
        self.client = Anthropic(
            api_key=os.getenv("ANTHROPIC_API_KEY"),
            timeout=30.0  # Simple timeout in seconds
        )
        self.temperature = 0.3  # Lower for more consistent output
        self.max_tokens = 3000  # Reduced from 6000 for faster response
        
    def generate_feedback(
        self,
        request: Task1TeacherFeedbackRequest
    ) -> Task1TeacherFeedbackResponse:
        """
        Generate comprehensive teacher feedback for a Task 1 essay.
        
        Args:
            request: Task1TeacherFeedbackRequest with essay and context
            
        Returns:
            Task1TeacherFeedbackResponse with structured feedback
        """
        
        logger.info(f"[Task1Teacher] Generating feedback for {request.student_name}")
        
        # Use optimized prompt (150 lines vs 601 lines)
        system_prompt = get_optimized_task1_teacher_prompt()
        
        # Build concise user prompt with only essential context
        user_prompt = build_concise_user_prompt(
            student_name=request.student_name,
            essay=request.essay,
            question=request.question,
            examiner_scores=request.examiner_scores or {},
            chart_type=request.chart_type
        )
        
        try:
            # Call the LLM with optimized prompts and timeout
            response = self.client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_prompt}
                ]
            )
            
            content = response.content[0].text
            
            # Parse JSON response
            feedback_data = self._parse_json_response(content)
            
            # Add metadata
            feedback_data["student_name"] = request.student_name
            feedback_data["task_type"] = "task1"
            feedback_data["chart_type"] = request.chart_type
            feedback_data["word_count"] = len(request.essay.split())
            feedback_data["attempt_number"] = request.attempt_number
            
            # Validate and return
            return Task1TeacherFeedbackResponse(**feedback_data)
            
        except json.JSONDecodeError as e:
            logger.error(f"[Task1Teacher] JSON parse error: {e}")
            self._log_debug(content, e)
            raise ValueError(f"Failed to parse feedback: {e}")
        
        except Exception as e:
            logger.error(f"[Task1Teacher] Error generating feedback: {e}")
            raise
    
    def generate_feedback_markdown(
        self,
        request: Task1TeacherFeedbackRequest
    ) -> str:
        """
        Generate feedback and format as markdown for display.
        
        Args:
            request: Task1TeacherFeedbackRequest
            
        Returns:
            Formatted markdown string
        """
        feedback = self.generate_feedback(request)
        return self.format_as_markdown(feedback)
    
    def format_as_markdown(
        self,
        feedback: Task1TeacherFeedbackResponse
    ) -> str:
        """
        Convert structured feedback to markdown format.
        
        Args:
            feedback: Task1TeacherFeedbackResponse
            
        Returns:
            Markdown formatted string
        """
        
        # Status emoji mapping
        status_emoji = {
            "strong": "🟢",
            "developing": "🟡",
            "needs_work": "🔴"
        }
        
        md = []
        
        # ============== OVERALL SUMMARY ==============
        md.append("# 📊 OVERALL FEEDBACK SUMMARY\n")
        md.append(f"### Personal Note\n{feedback.overall_summary.personal_note}\n")
        
        # Score table
        md.append("### Score Snapshot")
        md.append("| Criterion | Band | Status |")
        md.append("|-----------|------|--------|")
        for score in feedback.overall_summary.scores:
            emoji = status_emoji.get(score.status.value, "🟡")
            status_text = score.status.value.replace("_", " ").title()
            md.append(f"| {score.criterion} | {score.band} | {emoji} {status_text} |")
        md.append(f"| **Estimated Overall** | **{feedback.overall_summary.estimated_overall}** | |")
        md.append("")
        
        # Superpower and Priority
        md.append("### At a Glance")
        md.append(f"- **🌟 Your Superpower**: {feedback.overall_summary.superpower}")
        md.append(f"  - *\"{feedback.overall_summary.superpower_example}\"*")
        md.append(f"- **🎯 Your Priority**: {feedback.overall_summary.priority}")
        md.append(f"  - Quick win: {feedback.overall_summary.priority_quick_win}")
        md.append("")
        
        # ============== TASK ACHIEVEMENT ==============
        md.append("---\n")
        md.append("# 📝 TASK ACHIEVEMENT\n")
        md.append(f"**Your Band: {feedback.task_achievement.band}** {status_emoji.get(feedback.task_achievement.status.value, '')}\n")
        
        # Overview assessment
        overview_emoji = {
            "excellent": "✅",
            "good": "✅",
            "basic": "⚠️",
            "unclear": "❌",
            "missing": "❌"
        }
        md.append(f"**Overview Quality**: {overview_emoji.get(feedback.task_achievement.overview_quality.value, '❓')} {feedback.task_achievement.overview_quality.value.title()}")
        md.append(f"> {feedback.task_achievement.overview_feedback}\n")
        
        if feedback.task_achievement.improved_overview_example:
            md.append("**💡 Suggested Overview:**")
            md.append(f"> {feedback.task_achievement.improved_overview_example}\n")
        
        # What it measures
        md.append("### What This Measures")
        for item in feedback.task_achievement.what_it_measures:
            md.append(f"- {item}")
        md.append("")
        
        # Strengths
        md.append("### ✅ What You Did Well")
        for strength in feedback.task_achievement.strengths:
            md.append(f"- **{strength.category}**: \"{strength.quote}\"")
            md.append(f"  - {strength.explanation}")
        md.append("")
        
        # Weaknesses
        if feedback.task_achievement.weakness_patterns:
            md.append("### ⚠️ Patterns to Fix")
            for pattern in feedback.task_achievement.weakness_patterns:
                recurring_badge = " 🔄 *RECURRING*" if pattern.is_recurring else ""
                md.append(f"**Pattern: {pattern.pattern_name}**{recurring_badge}")
                md.append(f"> {pattern.description}")
                for ex in pattern.examples:
                    md.append(f"- ❌ \"{ex.original}\"")
                    md.append(f"- ✅ \"{ex.corrected}\"")
                    if ex.explanation:
                        md.append(f"  - *{ex.explanation}*")
                md.append(f"- **Impact**: {pattern.impact}")
                md.append("")
        
        # Tips
        md.append("### 🎯 How to Improve")
        for tip in feedback.task_achievement.tips:
            priority_icon = {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(tip.priority, "")
            md.append(f"- {priority_icon} {tip.tip}")
        md.append("")
        
        # Micro-task
        md.append(f"### 📌 Practice Task ({feedback.task_achievement.micro_task.time_minutes} min)")
        md.append(f"**{feedback.task_achievement.micro_task.task_type}**: {feedback.task_achievement.micro_task.instruction}")
        if feedback.task_achievement.micro_task.examples:
            md.append("Examples to practice with:")
            for ex in feedback.task_achievement.micro_task.examples:
                md.append(f"- {ex}")
        md.append("")
        
        # ============== COHERENCE & COHESION ==============
        md.append("---\n")
        md.append("# 🔗 COHERENCE & COHESION\n")
        md.append(f"**Your Band: {feedback.coherence_cohesion.band}** {status_emoji.get(feedback.coherence_cohesion.status.value, '')}\n")
        
        # CC-specific assessments
        md.append("**Quick Check:**")
        md.append(f"- Paragraph Structure: {'✅' if feedback.coherence_cohesion.paragraph_structure_ok else '❌'}")
        md.append(f"- Logical Data Grouping: {'✅' if feedback.coherence_cohesion.logical_data_grouping else '❌'}")
        md.append("")
        
        md.append("### What This Measures")
        for item in feedback.coherence_cohesion.what_it_measures:
            md.append(f"- {item}")
        md.append("")
        
        md.append("### ✅ What You Did Well")
        for strength in feedback.coherence_cohesion.strengths:
            md.append(f"- **{strength.category}**: \"{strength.quote}\"")
            md.append(f"  - {strength.explanation}")
        md.append("")
        
        if feedback.coherence_cohesion.weakness_patterns:
            md.append("### ⚠️ Patterns to Fix")
            for pattern in feedback.coherence_cohesion.weakness_patterns:
                recurring_badge = " 🔄 *RECURRING*" if pattern.is_recurring else ""
                md.append(f"**Pattern: {pattern.pattern_name}**{recurring_badge}")
                for ex in pattern.examples:
                    md.append(f"- ❌ \"{ex.original}\" → ✅ \"{ex.corrected}\"")
                md.append(f"- **Impact**: {pattern.impact}")
                md.append("")
        
        if feedback.coherence_cohesion.suggested_linkers:
            md.append("### 💡 Useful Linkers for Task 1")
            md.append(", ".join(feedback.coherence_cohesion.suggested_linkers))
            md.append("")
        
        md.append("### 🎯 How to Improve")
        for tip in feedback.coherence_cohesion.tips:
            md.append(f"- {tip.tip}")
        md.append("")
        
        md.append(f"### 📌 Practice Task ({feedback.coherence_cohesion.micro_task.time_minutes} min)")
        md.append(f"**{feedback.coherence_cohesion.micro_task.task_type}**: {feedback.coherence_cohesion.micro_task.instruction}")
        md.append("")
        
        # ============== LEXICAL RESOURCE ==============
        md.append("---\n")
        md.append("# 📚 LEXICAL RESOURCE\n")
        md.append(f"**Your Band: {feedback.lexical_resource.band}** {status_emoji.get(feedback.lexical_resource.status.value, '')}\n")
        
        md.append("**Vocabulary Assessment:**")
        md.append(f"- Trend Vocabulary: {feedback.lexical_resource.trend_vocabulary_range.title()}")
        md.append(f"- Comparison Vocabulary: {feedback.lexical_resource.comparison_vocabulary_range.title()}")
        md.append(f"- Collocations: {'✅ Accurate' if feedback.lexical_resource.collocations_accurate else '⚠️ Some issues'}")
        md.append("")
        
        if feedback.lexical_resource.spelling_issues:
            md.append("**Spelling to Fix:**")
            md.append(", ".join(f"~~{word}~~" for word in feedback.lexical_resource.spelling_issues))
            md.append("")
        
        md.append("### What This Measures")
        for item in feedback.lexical_resource.what_it_measures:
            md.append(f"- {item}")
        md.append("")
        
        md.append("### ✅ What You Did Well")
        for strength in feedback.lexical_resource.strengths:
            md.append(f"- **{strength.category}**: \"{strength.quote}\"")
            md.append(f"  - {strength.explanation}")
        md.append("")
        
        if feedback.lexical_resource.weakness_patterns:
            md.append("### ⚠️ Patterns to Fix")
            for pattern in feedback.lexical_resource.weakness_patterns:
                md.append(f"**Pattern: {pattern.pattern_name}**")
                for ex in pattern.examples:
                    md.append(f"- ❌ \"{ex.original}\" → ✅ \"{ex.corrected}\"")
                md.append(f"- **Impact**: {pattern.impact}")
                md.append("")
        
        if feedback.lexical_resource.vocabulary_upgrades:
            md.append("### 📈 Vocabulary Upgrades")
            md.append("| Basic | Academic Alternative |")
            md.append("|-------|---------------------|")
            for upgrade in feedback.lexical_resource.vocabulary_upgrades:
                md.append(f"| {upgrade.get('basic', '')} | {upgrade.get('academic', '')} |")
            md.append("")
        
        md.append("### 🎯 How to Improve")
        for tip in feedback.lexical_resource.tips:
            md.append(f"- {tip.tip}")
        md.append("")
        
        md.append(f"### 📌 Practice Task ({feedback.lexical_resource.micro_task.time_minutes} min)")
        md.append(f"**{feedback.lexical_resource.micro_task.task_type}**: {feedback.lexical_resource.micro_task.instruction}")
        md.append("")
        
        # ============== GRAMMATICAL RANGE ==============
        md.append("---\n")
        md.append("# ✏️ GRAMMATICAL RANGE & ACCURACY\n")
        md.append(f"**Your Band: {feedback.grammatical_range.band}** {status_emoji.get(feedback.grammatical_range.status.value, '')}\n")
        
        md.append("**Grammar Check:**")
        md.append(f"- Tense Consistency: {'✅' if feedback.grammatical_range.tense_consistency else '❌'}")
        md.append(f"- Passive Voice (if needed): {'✅' if feedback.grammatical_range.passive_voice_usage else '⚠️'}")
        md.append(f"- Article Accuracy: {'✅' if feedback.grammatical_range.article_accuracy else '❌'}")
        md.append(f"- Sentence Variety: {feedback.grammatical_range.sentence_variety.title()}")
        md.append("")
        
        md.append("### What This Measures")
        for item in feedback.grammatical_range.what_it_measures:
            md.append(f"- {item}")
        md.append("")
        
        md.append("### ✅ What You Did Well")
        for strength in feedback.grammatical_range.strengths:
            md.append(f"- **{strength.category}**: \"{strength.quote}\"")
            md.append(f"  - {strength.explanation}")
        md.append("")
        
        if feedback.grammatical_range.weakness_patterns:
            md.append("### ⚠️ Patterns to Fix")
            for pattern in feedback.grammatical_range.weakness_patterns:
                recurring_badge = " 🔄 *RECURRING*" if pattern.is_recurring else ""
                md.append(f"**Pattern: {pattern.pattern_name}**{recurring_badge}")
                for ex in pattern.examples:
                    md.append(f"- ❌ \"{ex.original}\"")
                    md.append(f"- ✅ \"{ex.corrected}\"")
                md.append(f"- **Impact**: {pattern.impact}")
                md.append("")
        
        if feedback.grammatical_range.grammar_focus_areas:
            md.append("### 🎯 Grammar Focus Areas for Task 1")
            for area in feedback.grammatical_range.grammar_focus_areas:
                md.append(f"- {area}")
            md.append("")
        
        md.append("### 🎯 How to Improve")
        for tip in feedback.grammatical_range.tips:
            md.append(f"- {tip.tip}")
        md.append("")
        
        md.append(f"### 📌 Practice Task ({feedback.grammatical_range.micro_task.time_minutes} min)")
        md.append(f"**{feedback.grammatical_range.micro_task.task_type}**: {feedback.grammatical_range.micro_task.instruction}")
        md.append("")
        
        # ============== ACTION PLAN ==============
        md.append("---\n")
        md.append("# 🚀 YOUR ACTION PLAN\n")
        
        md.append(f"### Priority Focus: {feedback.action_plan.priority_focus}")
        md.append(f"> {feedback.action_plan.priority_reason}\n")
        
        md.append("### 3-Day Practice Schedule")
        md.append("| Day | Focus | Task | Time |")
        md.append("|-----|-------|------|------|")
        for day in feedback.action_plan.practice_schedule:
            md.append(f"| Day {day.day} | {day.focus} | {day.task} | {day.time_minutes} min |")
        md.append("")
        
        md.append("### ✅ Before Your Next Task 1 Essay")
        for item in feedback.action_plan.pre_writing_checklist:
            md.append(f"- [ ] {item}")
        md.append("")
        
        md.append(f"---\n\n**{feedback.action_plan.closing_message}** 💪")
        
        # Improvement notes if available
        if feedback.improvement_notes:
            md.append(f"\n\n---\n*📈 Progress Note: {feedback.improvement_notes}*")
        
        return "\n".join(md)
    
    def get_vocabulary_suggestions(
        self,
        chart_type: str = None,
        weak_areas: list = None
    ) -> Dict[str, Any]:
        """
        Get vocabulary suggestions for Task 1 based on chart type.
        
        Args:
            chart_type: Type of chart (line, bar, pie, etc.)
            weak_areas: Areas where student needs vocabulary help
            
        Returns:
            Dictionary of vocabulary suggestions
        """
        suggestions = {}
        
        # Add general vocabulary bank
        for category, levels in TASK1_VOCABULARY_BANK.items():
            if weak_areas is None or category in weak_areas:
                suggestions[category] = levels
        
        # Add chart-specific examples
        if chart_type and chart_type.lower() in OVERVIEW_EXAMPLES:
            suggestions["overview_examples"] = OVERVIEW_EXAMPLES[chart_type.lower()]
        
        return suggestions
    
    def _parse_json_response(self, content: str) -> Dict:
        """Parse JSON from LLM response."""
        
        # Handle markdown code blocks
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        
        return json.loads(content.strip())
    
    def _log_debug(self, content: str, error: Exception) -> None:
        """Log debug information for failed responses."""
        
        with open("task1_teacher_debug.log", "a") as f:
            f.write(f"\n{'='*60}\n")
            f.write(f"Error: {error}\n")
            f.write(f"Response:\n{content[:2000]}...\n")