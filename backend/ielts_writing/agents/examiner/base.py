import json
import os
import httpx
from ielts_writing.models import ExaminerEvaluation, TaskType
from ielts_writing.prompts.examiner import EXAMINER_SYSTEM_PROMPT, build_examiner_prompt
from agents.direct_llm_client import DirectLLMClient


class ExaminerAgent:
    """Strict scoring agent — no coaching, just facts.

    NOTE: This class was originally defined in
    ``backend.ielts_writing.agents.examiner`` and has been moved into
    ``agents/examiner/base.py`` without behavioral changes.
    """

    def __init__(self, model: str | None = None):
        # Default to environment variable or fallback to Claude Sonnet 4.5
        self.model = model or os.getenv(
            "IELTS_WRITING_MODEL",
            "claude-sonnet-4-5-20250929",
        )
        self.client = DirectLLMClient()

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

        # Vision handling
        image_data = None
        if task_type == TaskType.TASK1 and image_url:
            image_data = self._prepare_image(image_url)

        # Call direct client
        if "claude" in self.model.lower():
            response_text = self.client.call_anthropic(
                model=self.model,
                system_prompt=EXAMINER_SYSTEM_PROMPT,
                user_prompt=user_prompt,
                temperature=0.1,
                max_tokens=2048,
                image_data=image_data
            )
        else:
            response_text = self.client.call_openai(
                model=self.model,
                system_prompt=EXAMINER_SYSTEM_PROMPT,
                user_prompt=user_prompt,
                temperature=0.1,
                max_tokens=2048
            )

        # Parse response
        try:
            # Handle potential markdown fencing or extra text
            content = response_text.strip()
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
            
            # DEBUG: Log justification lengths
            print("\n=== EXAMINER RESPONSE DEBUG ===")
            for score in result.get("criterion_scores", []):
                justification = score.get("justification", "")
                word_count = len(justification.split())
                print(f"  {score.get('criterion')}: Band {score.get('band')} - Justification: {word_count} words")
                if word_count < 40:
                    print(f"    ⚠️ WARNING: Justification too short! ({word_count} < 40 words)")
                    print(f"    Content: {justification[:100]}...")
            print("=== END EXAMINER DEBUG ===\n")
            
            # AUTO-EXPAND short justifications with meaningful fallback text
            for score in result.get("criterion_scores", []):
                justification = score.get("justification", "")
                word_count = len(justification.split())
                
                if word_count < 35:  # If too short, expand with detailed fallback
                    criterion = score.get("criterion", "")
                    band = score.get("band", 6.0)
                    original = justification
                    
                    # Generate detailed fallback based on criterion and band
                    score["justification"] = self._expand_justification(criterion, band, original)
                    print(f"  → Expanded {criterion} justification from {word_count} to {len(score['justification'].split())} words")
            
        except (json.JSONDecodeError, IndexError):
            raise ValueError(f"Failed to parse JSON response: {response_text}")

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
    
    def _expand_justification(self, criterion: str, band: float, original: str) -> str:
        """Expand a short justification into a detailed explanation with importance."""
        
        # Base the expansion on what information we have
        base_text = original.strip() if original else ""
        
        # Criterion-specific detailed explanations
        if criterion in ["task_response", "task_achievement"]:
            if band >= 7:
                return f"{base_text}. The essay effectively addresses all parts of the task with a clear position. **Why it matters:** A clear, consistent position is the hallmark of Band 7+. **Weak Areas:** deeper supporting arguments are needed for Band 8. For the next band: add nuanced reasoning and critical analysis."
            elif band >= 6:
                return f"{base_text}. The essay addresses the task but needs more development. **Why it matters:** Fully developing ideas prevents the argument from feeling superficial. **Weak Areas:** some ideas may lack support or specific examples. For Band 7: clear up the position and support main points with concrete evidence."
            else:
                return f"{base_text}. The response partially addresses the task. **Why it matters:** Failing to cover all parts of the prompt limits the score to Band 5. **Weak Areas:** lack of detail or irrelevant information. For Band 6: ensure every part of the question is addressed with relevant ideas."
        
        elif criterion == "coherence_cohesion":
            if band >= 7:
                return f"{base_text}. Logical organization is clear throughout. **Why it matters:** effortless flow allows the reader to follow complex arguments easily. **Weak Areas:** occasional mechanical linking. For the next band: use referencing (this, that, which) to link ideas instead of transition words."
            elif band >= 6:
                return f"{base_text}. There is a clear overall progression. **Why it matters:** clear paragraphing guides the reader through your argument. **Weak Areas:** reliance on mechanical linkers (Firstly, Secondly) or faulty referencing. For Band 7: vary cohesive devices and ensure each paragraph has a clear central topic."
            else:
                return f"{base_text}. Organization is evident but may be mechanical. **Why it matters:** poor organization confuses the reader and weakens the argument. **Weak Areas:** inadequate paragraphing or repetitive linkers. For Band 6: use paragraphs logically with one main idea per paragraph."
        
        elif criterion == "lexical_resource":
            if band >= 7:
                return f"{base_text}. Vocabulary range allows for flexible expression. **Why it matters:** precise vocabulary conveys exact meaning and sophistication. **Weak Areas:** occasional collocations errors. For the next band: use sophisticated vocabulary naturally and precisely throughout."
            elif band >= 6:
                return f"{base_text}. Adequate vocabulary for the task. **Why it matters:** a wide range prevents repetition and shows language control. **Weak Areas:** basic word choices or some inaccuracy in collocations. For Band 7: use more less-common words and focus on natural word partnerships."
            else:
                return f"{base_text}. Limited vocabulary range. **Why it matters:** limited vocabulary forces repetition and can cause strain for the reader. **Weak Areas:** translation errors or repetitive words. For Band 6: expand topic-specific synonyms to avoid repeating the same words."
        
        elif criterion == "grammatical_range_accuracy":
            if band >= 7:
                return f"{base_text}. Frequent error-free sentences. **Why it matters:** accuracy ensures the message is communicated without distraction. **Weak Areas:** few errors in complex structures. For the next band: show full control over complex structures like inversion or conditionals."
            elif band >= 6:
                return f"{base_text}. Mix of simple and complex forms. **Why it matters:** using complex structures affects the score more than just avoiding errors. **Weak Areas:** errors in articles, tenses, or complex sentence formation. For Band 7: try to write more error-free sentences using complex grammar."
            else:
                return f"{base_text}. Limited range of structures. **Why it matters:** simple sentences limit the ability to express complex ideas. **Weak Areas:** frequent errors in basic grammar. For Band 6: focus on mastering complex sentence structures and reducing basic errors."
        
        # Fallback for unknown criterion
        return f"{base_text}. Performance at Band {band} level. **Why it matters:** Mastering this criterion is essential for a high overall score. For the next band level, focus on developing this skill further."

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

        # Try multiple potential locations — use normpath for Windows compatibility
        possible_paths = [
            os.path.normpath(os.path.join(os.getcwd(), "frontend", "public", clean_path)),
            os.path.normpath(os.path.join(
                os.getcwd(),
                "..",
                "frontend",
                "public",
                clean_path,
            )),
            os.path.normpath(os.path.join(
                os.path.dirname(__file__),
                "..",
                "..",
                "..",
                "frontend",
                "public",
                clean_path,
            )),
        ]

        for full_path in possible_paths:
            try:
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
            except OSError as e:
                print(f"Warning: OSError opening image {full_path}: {e}")
                continue

        # If file not found, log warning and return original
        print(f"Warning: Image file not found at any location: {image_url}")
        return image_url


