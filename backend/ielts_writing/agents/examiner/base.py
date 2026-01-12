import json
import os
from langchain_openai import ChatOpenAI  # Kept for backwards-compat; model comes from llm_factory
from langchain_core.messages import SystemMessage, HumanMessage

from ...models import ExaminerEvaluation, TaskType
from ...prompts.examiner import EXAMINER_SYSTEM_PROMPT, build_examiner_prompt
from ..llm_factory import get_chat_model, add_cache_tag


class ExaminerAgent:
    """Strict scoring agent — no coaching, just facts.

    NOTE: This class was originally defined in
    ``backend.ielts_writing.agents.examiner`` and has been moved into
    ``agents/examiner/base.py`` without behavioral changes.
    """

    def __init__(self, model: str | None = None):
        # Default to environment variable or fallback to Claude Sonnet 4.5
        model_name = model or os.getenv(
            "IELTS_WRITING_MODEL",
            "claude-sonnet-4-5-20250929",
        )

        self.llm = get_chat_model(
            model_name=model_name,
            temperature=0.1,  # Low temp for consistent scoring
            max_tokens=2048,
        )

    async def evaluate(
        self,
        task_type: TaskType,
        question: str,
        essay: str,
        image_url: str | None = None,
        chart_type: str | None = None,
    ) -> ExaminerEvaluation:
        """Score the essay strictly by IELTS criteria."""

        user_prompt = build_examiner_prompt(
            task_type=task_type.value,
            question=question,
            essay=essay,
            image_url=image_url,
            chart_type=chart_type,
        )

        system_msg = SystemMessage(content=EXAMINER_SYSTEM_PROMPT)

        # Apply prompt caching for Claude models (SKIP for 4.5 beta as it causes 404)
        if hasattr(self.llm, "model"):
            model_name = str(self.llm.model).lower()
            if "claude" in model_name and "4-5" not in model_name:
                system_msg = add_cache_tag(system_msg)
        elif hasattr(self.llm, "model_name"):
            model_name = str(self.llm.model_name).lower()
            if "claude" in model_name and "4-5" not in model_name:
                system_msg = add_cache_tag(system_msg)

        # Build messages array
        messages = [system_msg]

        # For Task 1 with image, add vision content
        if task_type == TaskType.TASK1 and image_url:
            # Prepare image data
            image_data = self._prepare_image(image_url)

            # Claude requires specific format for images
            messages.append(
                HumanMessage(
                    content=[
                        {"type": "image_url", "image_url": {"url": image_data}},
                        {"type": "text", "text": user_prompt},
                    ]
                )
            )
        else:
            messages.append(HumanMessage(content=user_prompt))

        response = await self.llm.ainvoke(messages)

        # Parse response
        try:
            # Handle potential markdown fencing or extra text
            content = response.content.strip()
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()

            # Final fallback: find the first { and last }
            if "{" in content and "}" in content:
                start = content.find("{")
                end = content.rfind("}") + 1
                content = content[start:end]

            result = json.loads(content)
        except (json.JSONDecodeError, IndexError):
            raise ValueError(f"Failed to parse JSON response: {response.content}")

        # Calculate overall band (average, rounded to 0.5)
        scores = [s["band"] for s in result["criterion_scores"]]
        avg = sum(scores) / len(scores)
        overall = round(avg * 2) / 2  # Round to nearest 0.5
        result["overall_band"] = overall

        # Calculate band_range (±0.5 from overall)
        result["band_range"] = {
            "low": max(0.0, overall - 0.5),
            "high": min(9.0, overall + 0.5),
        }

        # Calculate word_count_ok based on task type
        word_count = result.get("word_count", 0)
        min_words = 150 if task_type == TaskType.TASK1 else 250
        result["word_count_ok"] = word_count >= min_words

        # Keep word_count_penalty for backward compatibility
        result["word_count_penalty"] = not result["word_count_ok"]

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


