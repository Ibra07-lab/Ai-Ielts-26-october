"""Task 1 specific examiner wrapper.

This provides Task 1-specific prompts and logic, including the calibration
reminder system for strict IELTS scoring.
"""

from __future__ import annotations

import json
import os
from ielts_writing.models import TaskType, ExaminerEvaluation
from ielts_writing.agents.examiner.base import ExaminerAgent
from ielts_writing.agents.prompts.task1_prompt import get_task1_examiner_system_prompt
from agents.direct_llm_client import DirectLLMClient


def build_task1_examiner_user_prompt(
    question: str,
    essay: str,
    image_url: str = None,
    chart_type: str = None,
    image_description: str = None
) -> str:
    """Build the user prompt for Task 1 Examiner with word count analysis.
    
    Args:
        question: The Task 1 question/prompt
        essay: The student's essay
        image_url: Optional URL to chart/graph image
        chart_type: Optional type of chart (line_graph, bar_chart, etc.)
        image_description: Optional text description of the chart (IMAGE_METADATA).
                          When provided, this is used as the source of truth
                          instead of analyzing the image.
        
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
    
    # Add image/chart information or text description
    if image_description:
        # Handle dict or string description
        desc_text = image_description
        if isinstance(image_description, dict):
            desc_text = json.dumps(image_description, indent=2)
            
        # Use provided text description as source of truth
        prompt += f"""### IMAGE METADATA (Source of Truth)
Chart Type: {chart_type or "Not specified"}

The following is the FACTUAL DESCRIPTION of the visual data. Use this as the ABSOLUTE SOURCE OF TRUTH when evaluating the student's essay.

---
{desc_text}
---

⚠️ DATA VERIFICATION REQUIRED (CRITICAL):
1. If the student mentions data NOT in this metadata → FLAG as "Hallucination" in red_flags
2. If the student misses a "Key Trend" from the metadata → LOWER their Task Achievement score
3. Verify ALL numbers mentioned in the essay against this metadata
4. Check that trends described match the metadata exactly
5. Note any made-up or incorrect figures as red flags

For the 'visual_description' field in your response:
- Copy the key data from this metadata into a structured format.
- Include 'key_features' from the metadata (treat these as MANDATORY features).
- DYNAMIC DISCOVERY: If the student identifies a valid trend, comparison, or extreme using the provided 'data_points' that was NOT in my metadata, ADD it to the 'key_features' list in your response. 
- This ensures downstream agents (Teacher/Explanation) reward the student for valid insights.
- Include chart_type, data_points, and text_summary as usual.

"""
    else:
        # Use image analysis (original behavior)
        prompt += f"""### Visual Data
Chart Type: {chart_type or "Not specified"}
Image: Visual data is provided

⚠️ DATA VERIFICATION REQUIRED:
When evaluating Task Achievement:
1. GENERATE A STRUCTURED VISUAL DESCRIPTION: Create a detailed 'visual_description' object with:
   - chart_type, axes, units, time_period
   - data_points: Extract ALL key numbers from the chart with labels
   - key_features: Identify 3-5 important features students should mention
     * Mark CRITICAL features (e.g., highest/lowest values, overall trend)
     * Mark IMPORTANT features (e.g., significant changes, comparisons)
     * Include expected_mention keywords for each feature
   - text_summary: Plain text description for backward compatibility
   - expected_elements: Checklist of what should be covered
   This structured description will be used by downstream agents to validate student essays.
2. Check ALL numbers mentioned in the essay against the chart
3. Verify trends described match the visual data
4. Note any made-up or incorrect figures as red flags
5. Check if key features are accurately identified

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
        # Default to environment variable or fallback to Claude Sonnet 4.5
        import logging
        logger = logging.getLogger(__name__)

        self.model = model or os.getenv(
            "IELTS_WRITING_MODEL",
            "claude-sonnet-4-5-20250929",
        )
        
        # Force reload .env if stale configuration detected
        if self.model and "20250929" in self.model:
            logger.warning("Stale configuration detected in Task1Examiner. Reloading .env...")
            from dotenv import load_dotenv
            load_dotenv(override=True)
            self.model = os.getenv("IELTS_WRITING_MODEL", "anthropic/claude-sonnet-4.5")
            logger.info(f"Reloaded configuration. New model: {self.model}")

        self.client = DirectLLMClient()
        logger.info(f"Task1Examiner initialized with model: {self.model}")

    async def evaluate(
        self,
        essay: str,
        question: str,
        image_url: str | None = None,
        chart_type: str | None = None,
        image_description: str | None = None,
    ) -> dict:
        """
        Evaluate Task 1 essay using calibration reminder prompts.
        
        Args:
            essay: The student's essay text
            question: The task question/prompt
            image_url: Optional URL to chart/graph image
            chart_type: Optional type of chart (line_graph, bar_chart, etc.)
            image_description: Optional text description of the chart (IMAGE_METADATA).
                              When provided, this is used instead of image analysis.
        
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
            image_description=image_description,
        )

        # Only process image if image_description is not provided
        image_data = None
        if image_url and not image_description:
            image_data = self._prepare_image(image_url)

        # Call direct client
        if "claude" in self.model.lower():
            response_text = self.client.call_anthropic(
                model=self.model,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.1,
                max_tokens=2048,
                image_data=image_data
            )
        else:
            response_text = self.client.call_openai(
                model=self.model,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.1,
                max_tokens=2048
            )

        # Parse JSON response
        try:
            content = response_text.strip()
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
            raise ValueError(f"Failed to parse JSON response: {response_text}")

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
        image_description: str | None = None,
    ) -> ExaminerEvaluation:
        """Convenience wrapper that returns ExaminerEvaluation for backward compatibility."""
        result = await self.evaluate(
            essay=essay,
            question=question,
            image_url=image_url,
            chart_type=chart_type,
            image_description=image_description,
        )
        
        # Convert dict to ExaminerEvaluation
        return ExaminerEvaluation(**result)

    def _prepare_image(self, image_url: str) -> str:
        """
        Prepare image for vision model.
        Converts local file paths to base64 data URLs.
        Detects MIME type from content to handle mismatched extensions.
        """
        import base64

        # If it's already a URL, return as is
        if image_url.startswith("http"):
            return image_url

        # Handle local file path
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
                    header = f.read(12)
                    f.seek(0)
                    image_data = base64.b64encode(f.read()).decode("utf-8")
                    
                    # Detect MIME type from magic bytes
                    mime_type = "image/png" # Default
                    if header.startswith(b'\xff\xd8\xff'):
                        mime_type = "image/jpeg"
                    elif header.startswith(b'\x89PNG\r\n\x1a\n'):
                        mime_type = "image/png"
                    elif header.startswith(b'GIF87a') or header.startswith(b'GIF89a'):
                        mime_type = "image/gif"
                    elif header.startswith(b'RIFF') and header[8:12] == b'WEBP':
                        mime_type = "image/webp"
                    else:
                        # Fallback to extension if signature unknown
                        ext = os.path.splitext(full_path)[1].lower().lstrip(".")
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


