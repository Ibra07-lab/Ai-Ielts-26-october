"""
IELTS Reading Explain Agent
Объясняет слова и фразы из пассажей
"""

import os
import json
import logging
from typing import Dict, Any
from dotenv import load_dotenv

from .direct_llm_client import DirectLLMClient

from .explain_prompts import EXPLAIN_SYSTEM_PROMPT, EXPLAIN_USER_TEMPLATE

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Загрузка переменных окружения
load_dotenv()


class ExplainAgent:
    """
    Агент для объяснения слов и фраз из IELTS Reading пассажей
    """
    
    def __init__(
        self,
        model: str = None,
        temperature: float = 0.3,
        max_tokens: int = 500
    ):
        self.model = model or os.getenv("EXPLAIN_MODEL", "gpt-4o-mini")
        self.temperature = temperature
        self.max_tokens = max_tokens
        
        # Инициализация Direct Client
        self.client = DirectLLMClient()
        
        logger.info(f"ExplainAgent initialized with model: {self.model} (Direct API Mode)")
    
    def explain_text(
        self,
        passage: str,
        selected_text: str
    ) -> Dict[str, Any]:
        """
        Объяснить выбранный текст из пассажа
        """
        try:
            # Валидация входных данных
            if not passage or not selected_text:
                raise ValueError("Passage and selected_text must be non-empty")
            
            logger.info(f"Explaining text: '{selected_text}'")
            
            # Prepare prompt
            user_prompt = EXPLAIN_USER_TEMPLATE.format(
                passage=passage,
                selected_text=selected_text
            )

            # Call Direct API
            response_text = self.client.call_openai(
                model=self.model,
                system_prompt=EXPLAIN_SYSTEM_PROMPT,
                user_prompt=user_prompt,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            # Парсинг JSON ответа
            explanation = self._parse_json_response(response_text)
            
            logger.info(f"Explanation generated successfully for: '{selected_text}'")
            
            return explanation
            
        except Exception as e:
            logger.error(f"Error explaining text: {str(e)}")
            return {
                "word": selected_text,
                "definition": f"Sorry, unable to generate explanation. Error: {str(e)}",
                "context_meaning": "",
                "example_sentence": "",
                "error": str(e)
            }
    
    def _parse_json_response(self, response: str) -> Dict[str, Any]:
        """Parse JSON response with robustness."""
        import re
        json_pattern = r'```json\s*(.*?)\s*```'
        match = re.search(json_pattern, response, re.DOTALL)
        if match:
            content = match.group(1).strip()
        else:
            match = re.search(r'```\s*(.*?)\s*```', response, re.DOTALL)
            if match:
                content = match.group(1).strip()
            else:
                match = re.search(r'(\{.*\})', response, re.DOTALL)
                content = match.group(1).strip() if match else response.strip()
        
        content = re.sub(r',\s*([\}\]])', r'\1', content)
        
        try:
            data = json.loads(content)
            # Проверка наличия обязательных полей
            required_fields = ["word", "definition", "context_meaning", "example_sentence"]
            for field in required_fields:
                if field not in data:
                    data[field] = ""
            return data
        except json.JSONDecodeError:
            logger.warning("Response is not valid JSON, returning as plain text")
            return {
                "word": "",
                "definition": response,
                "context_meaning": "",
                "example_sentence": ""
            }

