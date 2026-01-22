"""
Vector Store для хранения и поиска релевантных частей passage
Использует FAISS вместо ChromaDB (не требует компилятора)
"""

import os
import logging
import json
import math
import numpy as np
from typing import List, Dict, Any, Optional
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

class SimpleTextSplitter:
    """A simple replacement for RecursiveCharacterTextSplitter."""
    def __init__(self, chunk_size: int = 300, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_text(self, text: str) -> List[str]:
        if not text:
            return []
        
        chunks = []
        start = 0
        while start < len(text):
            end = start + self.chunk_size
            chunk = text[start:end]
            chunks.append(chunk)
            if end >= len(text):
                break
            start += (self.chunk_size - self.chunk_overlap)
        return chunks


class PassageVectorStore:
    """
    Хранилище для passage с векторным поиском (Simple Embedding + Cosine Similarity)
    """
    
    def __init__(self, persist_directory: str = "./data/faiss_db"):
        """
        Инициализация векторного хранилища
        """
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=self.api_key)
        self.persist_directory = persist_directory
        self.text_splitter = SimpleTextSplitter(
            chunk_size=300,
            chunk_overlap=50
        )
        
        # Создаем директорию если не существует
        os.makedirs(persist_directory, exist_ok=True)
        
        logger.info(f"PassageVectorStore initialized at: {persist_directory} (Direct API Mode)")
    
    def add_passage(
        self,
        passage_id: str,
        passage_text: str,
        metadata: Dict[str, Any] = None
    ) -> None:
        """
        Добавить passage в векторную БД
        """
        try:
            # Разбиваем текст на чанки
            chunks = self.text_splitter.split_text(passage_text)
            
            # Получаем эмбеддинги для всех чанков
            response = self.client.embeddings.create(
                input=chunks,
                model="text-embedding-3-small"
            )
            embeddings = [data.embedding for data in response.data]
            
            # Сохраняем в JSON-файл (просто и надежно для небольших данных)
            data_to_store = []
            for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                item = {
                    "content": chunk,
                    "embedding": embedding,
                    "metadata": {
                        "passage_id": passage_id,
                        "chunk_index": i,
                        "total_chunks": len(chunks)
                    }
                }
                if metadata:
                    item["metadata"].update(metadata)
                data_to_store.append(item)
            
            save_path = os.path.join(self.persist_directory, f"{passage_id}.json")
            with open(save_path, "w", encoding="utf-8") as f:
                json.dump(data_to_store, f, ensure_ascii=False, indent=2)
            
            logger.info(f"Added passage '{passage_id}' with {len(chunks)} chunks to direct store")
            
        except Exception as e:
            logger.error(f"Error adding passage to store: {str(e)}")
            raise
    
    def search_relevant_context(
        self,
        passage_id: str,
        query: str,
        k: int = 2
    ) -> List[str]:
        """
        Найти релевантные куски passage для вопроса
        """
        try:
            save_path = os.path.join(self.persist_directory, f"{passage_id}.json")
            if not os.path.exists(save_path):
                logger.warning(f"Store for passage '{passage_id}' not found")
                return []
                
            with open(save_path, "r", encoding="utf-8") as f:
                passage_data = json.load(f)
            
            # Получаем эмбеддинг для запроса
            response = self.client.embeddings.create(
                input=[query],
                model="text-embedding-3-small"
            )
            query_embedding = np.array(response.data[0].embedding)
            
            # Считаем косинусное сходство
            similarities = []
            for item in passage_data:
                chunk_embedding = np.array(item["embedding"])
                similarity = np.dot(query_embedding, chunk_embedding) / (
                    np.linalg.norm(query_embedding) * np.linalg.norm(chunk_embedding)
                )
                similarities.append((similarity, item["content"]))
            
            # Сортируем и берем топ-k
            similarities.sort(key=lambda x: x[0], reverse=True)
            contexts = [content for score, content in similarities[:k]]
            
            logger.info(f"Found {len(contexts)} relevant chunks in passage '{passage_id}'")
            return contexts
            
        except Exception as e:
            logger.error(f"Error searching store: {str(e)}")
            return []
    
    def passage_exists(self, passage_id: str) -> bool:
        """Проверить существует ли passage в БД"""
        save_path = os.path.join(self.persist_directory, f"{passage_id}.json")
        return os.path.exists(save_path)
