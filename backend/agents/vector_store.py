"""
Vector Store для хранения и поиска релевантных частей passage
Использует FAISS вместо ChromaDB (не требует компилятора)
"""

import os
import logging
import pickle
from typing import List, Dict, Any
from dotenv import load_dotenv

from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS  # Вместо Chroma!
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

load_dotenv()
logger = logging.getLogger(__name__)


class PassageVectorStore:
    """
    Хранилище для passage с векторным поиском (FAISS)
    """
    
    def __init__(self, persist_directory: str = "./data/faiss_db"):
        """
        Инициализация векторного хранилища
        
        Args:
            persist_directory: Путь для сохранения векторной БД
        """
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-3-small",
            api_key=os.getenv("OPENAI_API_KEY")
        )
        self.persist_directory = persist_directory
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=300,
            chunk_overlap=50,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
        
        # Создаем директорию если не существует
        os.makedirs(persist_directory, exist_ok=True)
        
        logger.info(f"PassageVectorStore initialized with FAISS at: {persist_directory}")
    
    def add_passage(
        self,
        passage_id: str,
        passage_text: str,
        metadata: Dict[str, Any] = None
    ) -> None:
        """
        Добавить passage в векторную БД
        
        Args:
            passage_id: Уникальный ID passage
            passage_text: Полный текст passage
            metadata: Дополнительные метаданные
        """
        try:
            # Разбиваем текст на чанки
            chunks = self.text_splitter.split_text(passage_text)
            
            # Создаем документы с метаданными
            documents = []
            for i, chunk in enumerate(chunks):
                doc_metadata = {
                    "passage_id": passage_id,
                    "chunk_index": i,
                    "total_chunks": len(chunks)
                }
                if metadata:
                    doc_metadata.update(metadata)
                
                documents.append(Document(
                    page_content=chunk,
                    metadata=doc_metadata
                ))
            
            # Создаём FAISS index
            vectorstore = FAISS.from_documents(
                documents=documents,
                embedding=self.embeddings
            )
            
            # Сохраняем на диск
            save_path = os.path.join(self.persist_directory, passage_id)
            vectorstore.save_local(save_path)
            
            logger.info(f"Added passage '{passage_id}' with {len(chunks)} chunks to FAISS")
            
        except Exception as e:
            logger.error(f"Error adding passage to FAISS: {str(e)}")
            raise
    
    def search_relevant_context(
        self,
        passage_id: str,
        query: str,
        k: int = 2
    ) -> List[str]:
        """
        Найти релевантные куски passage для вопроса
        
        Args:
            passage_id: ID passage
            query: Вопрос или текст для поиска
            k: Количество релевантных чанков
            
        Returns:
            Список релевантных текстовых фрагментов
        """
        try:
            save_path = os.path.join(self.persist_directory, passage_id)
            
            # Загружаем FAISS index
            vectorstore = FAISS.load_local(
                save_path,
                embeddings=self.embeddings,
                allow_dangerous_deserialization=True  # Нужно для FAISS
            )
            
            # Поиск похожих документов
            docs = vectorstore.similarity_search(query, k=k)
            
            # Извлекаем только текст
            contexts = [doc.page_content for doc in docs]
            
            logger.info(f"Found {len(contexts)} relevant chunks in passage '{passage_id}'")
            
            return contexts
            
        except Exception as e:
            logger.error(f"Error searching FAISS: {str(e)}")
            return []
    
    def passage_exists(self, passage_id: str) -> bool:
        """
        Проверить существует ли passage в БД
        
        Args:
            passage_id: ID passage
            
        Returns:
            True если существует
        """
        save_path = os.path.join(self.persist_directory, passage_id)
        return os.path.exists(save_path)