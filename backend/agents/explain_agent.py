"""
IELTS Reading Explain Agent
Объясняет слова и фразы из пассажей
"""

import os
import json
import logging
from typing import Dict, Any
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser

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
        """
        Инициализация агента
        
        Args:
            model: Название модели OpenAI (по умолчанию gpt-4o-mini)
            temperature: Температура генерации
            max_tokens: Максимальное количество токенов
        """
        self.model = model or os.getenv("EXPLAIN_MODEL", "gpt-4o-mini")
        self.temperature = temperature
        self.max_tokens = max_tokens
        
        # Инициализация LLM
        self.llm = ChatOpenAI(
            model=self.model,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # Создание промпта
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", EXPLAIN_SYSTEM_PROMPT),
            ("human", EXPLAIN_USER_TEMPLATE)
        ])
        
        # Создание цепочки
        self.chain = self.prompt | self.llm | StrOutputParser()
        
        logger.info(f"ExplainAgent initialized with model: {self.model}")
    
    def explain_text(
        self,
        passage: str,
        selected_text: str
    ) -> Dict[str, Any]:
        """
        Объяснить выбранный текст из пассажа
        
        Args:
            passage: Полный текст пассажа
            selected_text: Выбранное слово или фраза для объяснения
            
        Returns:
            Словарь с полями: word, definition, context_meaning, example_sentence
        """
        try:
            # Валидация входных данных
            if not passage or not selected_text:
                raise ValueError("Passage and selected_text must be non-empty")
            
            logger.info(f"Explaining text: '{selected_text}'")
            
            # Вызов цепочки
            response = self.chain.invoke({
                "passage": passage,
                "selected_text": selected_text
            })
            
            # Парсинг JSON ответа
            explanation = self._parse_response(response)
            
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
    
    def _parse_response(self, response: str) -> Dict[str, Any]:
        """
        Парсинг ответа от LLM в JSON
        
        Args:
            response: Строковый ответ от модели
            
        Returns:
            Распарсенный словарь
        """
        try:
            # Попытка распарсить как JSON
            # Иногда модель возвращает JSON в markdown блоке
            if "```json" in response:
                response = response.split("```json")[1].split("```")[0].strip()
            elif "```" in response:
                response = response.split("```")[1].split("```")[0].strip()
            
            data = json.loads(response)
            
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

