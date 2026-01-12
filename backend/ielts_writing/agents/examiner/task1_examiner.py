"""Task 1 specific examiner wrapper.

This provides Task 1-specific prompts and logic, including the calibration
reminder system for strict IELTS scoring.
"""

from __future__ import annotations

import json
import os
from langchain_core.messages import SystemMessage, HumanMessage

from ...models import TaskType, ExaminerEvaluation
from .base import ExaminerAgent
from ..prompts.task1_prompt import get_task1_examiner_system_prompt
from ..llm_factory import get_chat_model, add_cache_tag


def build_task1_examiner_user_prompt(
    question: str,
    essay: str,
    image_url: str = None,
    chart_type: str = None
) -> str:
    """Build the user prompt for Task 1 Examiner with word count analysis.
    
    Args:
        question: The Task 1 question/prompt
        essay: The student's essay
        image_url: Optional URL to chart/graph image
        chart_type: Optional type of chart (line_graph, bar_chart, etc.)
        
    Returns:
        Formatted user prompt string
    """
    word_count = len(essay.split())
    
    # Determine word count status
    if word_count >= 150:
        wc_status = "✅ Meets minimum (150+)"
        wc_instruction = "No word count penalty needed."
    elif word_count >= 140:
        wc_status = "⚠️ Slightly under (140-149 words)"
        wc_instruction = "Apply -0.5 penalty to Task Achievement."
    elif word_count >= 120:
        wc_status = "❌ Under minimum (120-139 words)"
        wc_instruction = "Cap Task Achievement at Band 5."
    else:
        wc_status = "❌ Significantly under (<120 words)"
        wc_instruction = "Cap Task Achievement at Band 4. Consider overall cap at Band 4 if <100 words."
    
    # Build prompt
    prompt = f"""## TASK 1 EVALUATION REQUEST

### Task Question
{question}

"""
    
    # Add image/chart information if provided
    if image_url:
        prompt += f"""### Visual Data
Chart Type: {chart_type or "Not specified"}
Image: Visual data is provided

⚠️ DATA VERIFICATION REQUIRED:
When evaluating Task Achievement:
1. Check ALL numbers mentioned in the essay against the chart
2. Verify trends described match the visual data
3. Note any made-up or incorrect figures as red flags
4. Check if key features are accurately identified

"""
    
    prompt += f"""### Student Essay
\"\"\"{essay}\"\"\"

### Word Count Analysis
- Counted: {word_count} words
- Minimum Required: 150 words
- Status: {wc_status}
- Action: {wc_instruction}

### Evaluation Instructions
1. Read the essay carefully
2. Check for overview — Is there a clear summary of main trends/features?
3. Assess data accuracy — Are figures and trends reported correctly?
4. Score each criterion using the band descriptors
5. Identify red flags — Missing overview? Copied question? Mechanical listing?
6. Calculate overall band — Arithmetic mean, rounded to nearest 0.5
7. Return JSON only — No other text or explanation

Be STRICT. Real IELTS examiners are strict. Most Task 1 essays score between 5.5 and 6.5.
"""
    
    return prompt


class Task1Examiner(ExaminerAgent):
    """Task 1 examiner with calibration reminder for strict IELTS scoring."""

    def __init__(self, model: str | None = None):
        # Initialize with same logic as base class
        model_name = model or os.getenv(
            "IELTS_WRITING_MODEL",
            "claude-sonnet-4-5-20250929",
        )

        self.llm = get_chat_model(
            model_name=model_name,
            temperature=0.1,  # Low temp for consistent scoring
            max_tokens=2048,
        )
        
        # Expose model name for health check
        self.model = getattr(self.llm, "model", None) or getattr(self.llm, "model_name", None) or model_name

    async def evaluate(
        self,
        essay: str,
        question: str,
        image_url: str | None = None,
        chart_type: str | None = None,
    ) -> dict:
        """
        Evaluate Task 1 essay using calibration reminder prompts.
        
        Returns dict (not ExaminerEvaluation) for pipeline compatibility.
        """
        # Use Task 1 specific system prompt with calibration reminder
        system_prompt = get_task1_examiner_system_prompt()
        
        # Use Task 1 specific user prompt builder
        user_prompt = build_task1_examiner_user_prompt(
            question=question,
            essay=essay,
            image_url=image_url,
            chart_type=chart_type,
        )

        system_msg = SystemMessage(content=system_prompt)

        # Apply caching for Claude (skip 4.5 beta to avoid 404)
        model_name = str(getattr(self.llm, "model", getattr(self.llm, "model_name", ""))).lower()
        if "claude" in model_name and "4-5" not in model_name:
            system_msg = add_cache_tag(system_msg)

        messages = [system_msg]

        # Handle image content for vision models
        if image_url:
            image_data = self._prepare_image(image_url)
            messages.append(HumanMessage(content=[
                {"type": "image_url", "image_url": {"url": image_data}},
                {"type": "text", "text": user_prompt},
            ]))
        else:
            messages.append(HumanMessage(content=user_prompt))

        response = await self.llm.ainvoke(messages)

        # Parse JSON response
        try:
            content = response.content.strip()
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()

            if "{" in content and "}" in content:
                start = content.find("{")
                end = content.rfind("}") + 1
                content = content[start:end]

            result = json.loads(content)
        except (json.JSONDecodeError, IndexError):
            raise ValueError(f"Failed to parse JSON response: {response.content}")

        # Calculate overall band if not present
        if "overall_band" not in result and "criterion_scores" in result:
            scores = [s["band"] for s in result["criterion_scores"]]
            avg = sum(scores) / len(scores)
            result["overall_band"] = round(avg * 2) / 2  # Round to nearest 0.5

        # Calculate band_range if not present
        if "band_range" not in result and "overall_band" in result:
            overall = result["overall_band"]
            result["band_range"] = {
                "low": max(0.0, overall - 0.5),
                "high": min(9.0, overall + 0.5),
            }

        # Add safety defaults for pipeline access
        result.setdefault("word_count", len(essay.split()))
        result.setdefault("word_count_ok", result["word_count"] >= 150)
        result.setdefault("word_count_penalty", not result["word_count_ok"])
        result.setdefault("overview_present", None)
        result.setdefault("overview_quality", None)
        result.setdefault("data_accuracy", None)
        result.setdefault("key_features_covered", None)
        result.setdefault("comparisons_made", None)
        result.setdefault("red_flags", [])

        return result

    async def evaluate_task(
        self,
        question: str,
        essay: str,
        *,
        image_url: str | None = None,
        chart_type: str | None = None,
    ) -> ExaminerEvaluation:
        """Convenience wrapper that returns ExaminerEvaluation for backward compatibility."""
        result = await self.evaluate(
            essay=essay,
            question=question,
            image_url=image_url,
            chart_type=chart_type,
        )
        
        # Convert dict to ExaminerEvaluation
        return ExaminerEvaluation(**result)

    def _prepare_image(self, image_url: str) -> str:
        """
        Prepare image for vision model.
        Converts local file paths to base64 data URLs.
        """
        import base64

        # If it's already a URL, return as is
        if image_url.startswith("http"):
            return image_url

        # Handle local file path
        # Remove leading slash if present
        clean_path = image_url.lstrip("/")

        # Try multiple potential locations
        possible_paths = [
            os.path.join(os.getcwd(), "frontend", "public", clean_path),
            os.path.join(
                os.getcwd(),
                "..",
                "frontend",
                "public",
                clean_path,
            ),
            os.path.join(
                os.path.dirname(__file__),
                "..",
                "..",
                "..",
                "frontend",
                "public",
                clean_path,
            ),
        ]

        for full_path in possible_paths:
            if os.path.exists(full_path):
                with open(full_path, "rb") as f:
                    image_data = base64.b64encode(f.read()).decode("utf-8")
                    # Detect image type from extension
                    ext = os.path.splitext(full_path)[1].lower().lstrip(".")
                    # Map extensions to MIME types
                    mime_map = {
                        "jpg": "image/jpeg",
                        "jpeg": "image/jpeg",
                        "png": "image/png",
                        "gif": "image/gif",
                        "webp": "image/webp",
                    }
                    mime_type = mime_map.get(ext, "image/png")
                    return f"data:{mime_type};base64,{image_data}"

        # If file not found, log warning and return original
        print(f"Warning: Image file not found at any location: {image_url}")
        return image_url


