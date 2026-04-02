import json
import re


def extract_json(text: str) -> dict:
    """
    Safely extract JSON from LLM response.
    Handles markdown code fences, trailing commas, and whitespace.
    """
    if not text:
        raise ValueError("Empty response from model")

    text = text.strip()

    # Remove markdown code fences: ```json ... ``` or ``` ... ```
    if text.startswith("```"):
        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```\s*$', '', text)
        text = text.strip()

    # Find the outermost JSON object or array
    # This handles cases where there's text before or after the JSON
    start = text.find('{')
    if start == -1:
        start = text.find('[')
    if start != -1:
        text = text[start:]

    # Find matching closing brace
    end = text.rfind('}')
    if end == -1:
        end = text.rfind(']')
    if end != -1:
        text = text[:end + 1]

    # Remove trailing commas before } or ] — common LLM mistake
    text = re.sub(r',\s*([}\]])', r'\1', text)

    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON response: {text[:200]}...") from e
