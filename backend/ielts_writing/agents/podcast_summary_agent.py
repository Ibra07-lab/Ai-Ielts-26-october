"""
Podcast Summary Evaluation Agent using Gemini 2.5 Flash via OpenRouter.

Evaluates student podcast summary writing across 5 categories:
- Content & Comprehension (30 pts)
- Vocabulary Use (25 pts)
- Own Words (20 pts)
- Language Accuracy (15 pts)
- Structure & Flow (10 pts)
"""

import os
import json
import logging
from typing import Optional
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend directory
backend_dir = Path(__file__).resolve().parent.parent.parent  # agents/ -> ielts_writing/ -> backend/
load_dotenv(dotenv_path=backend_dir / ".env", override=True)

logger = logging.getLogger(__name__)


# ─── System Prompt ──────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are a friendly English learning assistant that evaluates podcast summary writing for B1-B2 level students preparing for the IELTS exam. You evaluate summaries that students write after completing a video lesson about a BBC Learning English podcast.

Your tone should be encouraging and constructive. These are learners, not exam candidates. Your goal is to help them improve, not to judge them.

EVALUATION CRITERIA:

Category 1 — Content and Comprehension (0 to 30 points):
Check whether the student identified the main topic of the podcast.
If "KEY POINTS" are provided, check if those are included. 
If no "KEY POINTS" are provided, determine the 3-5 most important points from the "FULL TRANSCRIPT" and check if the student covered them.
Check whether their understanding of the podcast content is accurate (no misinterpretations).
Check whether they stayed within the word limit.
30 points means every required point is covered accurately.

Category 2 — Vocabulary Use (0 to 25 points):
Count how many vocabulary words from the lesson the student used.
Check whether each vocabulary word is used CORRECTLY and in a natural context.
A word used incorrectly does not count.
A word forced awkwardly into a sentence gets partial credit.

Category 3 — Own Words (0 to 20 points):
Check whether the student expressed ideas in their own words.
If "FULL TRANSCRIPT" is provided, check if they copied specific sentences or unique multi-word phrases directly from it.
If "TRANSCRIPT PHRASES" are provided, use them as specific examples of what NOT to copy.
Look for genuine paraphrasing where the student has changed both vocabulary AND sentence structure.
20 points means fully original expression throughout.

Category 4 — Language Accuracy (0 to 15 points):
... (rest of categories)

Category 5 — Structure and Flow (0 to 10 points):
...

IMPORTANT RULES:

Be generous but honest. Encourage the student while giving them real areas to improve.
Always give exactly 3 specific things the student did well. 
Always give exactly 3 specific improvements with the exact sentence that needs fixing and your corrected version.
If the student copied phrases from the transcript, identify them and suggest how to paraphrase. Use the "FULL TRANSCRIPT" to verify originality.
List which vocabulary words they used correctly, which they missed, and which they used incorrectly.
Do NOT mention IELTS band scores.
End with one short, encouraging sentence.

RESPONSE FORMAT:
Respond ONLY in valid JSON. No text before or after. Use this exact structure:

{
  "scores": {
    "contentComprehension": {
      "score": 24,
      "maxScore": 30,
      "comment": "Your explanation of why the score was given"
    },
    "vocabularyUse": {
      "score": 18,
      "maxScore": 25,
      "comment": "Your explanation"
    },
    "ownWords": {
      "score": 14,
      "maxScore": 20,
      "comment": "Your explanation"
    },
    "languageAccuracy": {
      "score": 10,
      "maxScore": 15,
      "comment": "Your explanation"
    },
    "structureFlow": {
      "score": 7,
      "maxScore": 10,
      "comment": "Your explanation"
    }
  },
  "totalScore": 73,
  "totalMaxScore": 100,
  "scoreLabel": "Good",
  "wordCount": 95,
  "vocabularyUsed": ["inflation", "volatile", "sustained"],
  "vocabularyMissed": ["recession", "effective"],
  "vocabularyUsedIncorrectly": [],
  "strengths": [
    "Specific strength with example from their writing",
    "Specific strength with example from their writing",
    "Specific strength with example from their writing"
  ],
  "improvements": [
    {
      "issue": "Short description",
      "originalSentence": "Their exact sentence",
      "correctedSentence": "Your corrected version",
      "explanation": "Why this is better"
    },
    {
      "issue": "Short description",
      "originalSentence": "...",
      "correctedSentence": "...",
      "explanation": "..."
    },
    {
      "issue": "Short description",
      "originalSentence": "...",
      "correctedSentence": "...",
      "explanation": "..."
    }
  ],
  "copiedPhrases": [
    {
      "studentPhrase": "the phrase they copied",
      "originalPhrase": "the phrase from the transcript",
      "suggestedParaphrase": "how they could rewrite it"
    }
  ],
  "overallFeedback": "2-3 encouraging sentences about their performance and one specific thing to focus on in the next lesson"
}"""


# ─── Agent Class ────────────────────────────────────────────────────────

class PodcastSummaryAgent:
    """Evaluates podcast summary writing using Gemini 2.5 Flash via OpenRouter."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            raise ValueError(
                "OPENROUTER_API_KEY is required. Set it in .env or pass it directly."
            )

        self.model = "google/gemini-2.5-flash"
        self.base_url = "https://openrouter.ai/api/v1"
        self.site_url = os.getenv("OPENROUTER_SITE_URL", "http://localhost:5173")
        self.app_name = os.getenv("OPENROUTER_APP_NAME", "IELTS-AI")

        # Use OpenAI SDK with OpenRouter base URL
        import openai
        self.client = openai.AsyncOpenAI(
            api_key=self.api_key,
            base_url=self.base_url,
        )

        logger.info(f"✅ PodcastSummaryAgent initialized with model: {self.model} (via OpenRouter)")

    def _build_user_message(
        self,
        summary_text: str,
        lesson_title: str,
        summary_prompt: str,
        vocabulary_words: list[str],
        summary_requirements: list[str] | None = None,
        transcript_phrases: list[str] | None = None,
        full_transcript: str | None = None,
        min_words: int = 100,
        max_words: int = 200,
    ) -> str:
        """Build the user message with all context for the AI."""

        parts = [
            f"LESSON TITLE: {lesson_title}",
            f"\nTASK GIVEN TO STUDENT:\n{summary_prompt}",
            f"\nWORD LIMIT: {min_words}–{max_words} words",
            f"\nVOCABULARY WORDS FROM THE LESSON:\n{', '.join(vocabulary_words)}",
        ]

        if summary_requirements:
            parts.append(
                f"\nKEY POINTS THE STUDENT SHOULD COVER:\n"
                + "\n".join(f"- {req}" for req in summary_requirements)
            )

        if transcript_phrases:
            parts.append(
                f"\nTRANSCRIPT PHRASES (for quick copy-detection):\n"
                + "\n".join(f'- "{phrase}"' for phrase in transcript_phrases)
            )

        if full_transcript:
            parts.append(f"\nFULL TRANSCRIPT:\n\"\"\"\n{full_transcript}\n\"\"\"")

        parts.append(f"\n\nSTUDENT'S SUMMARY:\n\"\"\"\n{summary_text}\n\"\"\"")

        parts.append("\nPlease evaluate this summary and respond with the JSON evaluation.")

        return "\n".join(parts)

    async def evaluate(
        self,
        summary_text: str,
        lesson_title: str,
        summary_prompt: str,
        vocabulary_words: list[str],
        summary_requirements: list[str] | None = None,
        transcript_phrases: list[str] | None = None,
        full_transcript: str | None = None,
        min_words: int = 100,
        max_words: int = 200,
    ) -> dict:
        """
        Evaluate a student's podcast summary using Gemini 2.5 Flash via OpenRouter.
        
        Returns the parsed JSON evaluation result.
        """
        user_message = self._build_user_message(
            summary_text=summary_text,
            lesson_title=lesson_title,
            summary_prompt=summary_prompt,
            vocabulary_words=vocabulary_words,
            summary_requirements=summary_requirements,
            transcript_phrases=transcript_phrases,
            full_transcript=full_transcript,
            min_words=min_words,
            max_words=max_words,
        )

        logger.info(f"[PodcastSummaryAgent] Evaluating summary for lesson: {lesson_title}")
        logger.info(f"[PodcastSummaryAgent] Student word count: {len(summary_text.split())}")

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_message},
                ],
                temperature=0.3,
                max_tokens=4096,
                response_format={"type": "json_object"},
                extra_headers={
                    "HTTP-Referer": self.site_url,
                    "X-Title": self.app_name,
                },
            )

            raw_text = response.choices[0].message.content.strip()
            logger.info(f"[PodcastSummaryAgent] Got response, length: {len(raw_text)}")

            # Parse JSON response
            result = json.loads(raw_text)

            # Calculate actual word count and override LLM estimation (it often hallucinations)
            actual_word_count = len(summary_text.split())
            result["wordCount"] = actual_word_count

            # Validate required fields
            required_fields = ["scores", "totalScore", "scoreLabel", "strengths", "improvements", "wordCount"]
            for field in required_fields:
                if field not in result:
                    raise ValueError(f"Missing required field in response: {field}")

            # Ensure totalMaxScore is set
            result["totalMaxScore"] = 100

            logger.info(f"[PodcastSummaryAgent] ✅ Evaluation complete. Score: {result['totalScore']}/100, Words: {actual_word_count}")
            return result

        except json.JSONDecodeError as e:
            logger.error(f"[PodcastSummaryAgent] Failed to parse JSON response: {e}")
            logger.error(f"[PodcastSummaryAgent] Raw response: {raw_text[:500]}")
            raise ValueError(f"AI returned invalid JSON: {str(e)}")

        except Exception as e:
            logger.error(f"[PodcastSummaryAgent] Error during evaluation: {type(e).__name__}: {str(e)}")
            raise
