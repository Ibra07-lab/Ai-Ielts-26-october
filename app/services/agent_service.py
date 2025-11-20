# app/services/agent_service.py

from pathlib import Path
from typing import Literal, Dict, Any, Optional, List

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from pydantic import BaseModel, Field

from app.core.config import settings 
from app.models.chat_models import ChatMessage
from typing import Optional, List

class MicroBattleQuestion(BaseModel):
    id: int
    skill: Literal["GIST", "DETAIL", "INFERENCE"]
    format: Literal["multiple-choice", "short-answer", "true-false-not-given"]
    question_text: str
    options: Optional[List[str]] = None
    correct_answer: str
    rationale: str

class MicroBattle(BaseModel):
    level: Literal["beginner", "intermediate", "advanced"]
    topic: str
    time_target_seconds: int
    words_count: int
    passage: List[str]
    questions: List[MicroBattleQuestion]

    def __repr__(self) -> str:
        return f"MicroBattle(level={self.level}, topic={self.topic}, words={self.words_count})"


def format_micro_battle_for_chat(battle: MicroBattle) -> str:
    """Format a Micro‑Passage Battle into the requested chat layout."""
    level_emoji_map = {"beginner": "🟢", "intermediate": "🟡", "advanced": "🔴"}
    level_emoji = level_emoji_map.get(battle.level, "🟡")
    mm = battle.time_target_seconds // 60
    ss = battle.time_target_seconds % 60
    sep = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    lines: List[str] = []
    # Header
    lines.append(f"{level_emoji} Level: {battle.level.capitalize()} ")
    lines.append(f"📚 Topic: {battle.topic}")
    lines.append(f"📏 Length: {battle.words_count} words")
    lines.append(f"⏱️ Target Time: {mm:01d}:{ss:02d}")
    lines.append("")
    lines.append(sep)
    lines.append("")
    # Passage
    lines.append("📄 PASSAGE")
    lines.append("")
    for p in battle.passage:
        lines.append(p)
    lines.append("")
    lines.append(sep)
    lines.append("")
    # Questions
    lines.append("❓ QUESTIONS")
    lines.append("")

    for q in battle.questions:
        lines.append(sep)
        lines.append("")
        lines.append(f"**Q{q.id}.**")
        if q.format == "multiple-choice" and q.options:
            for opt in q.options:
                # Expect options already like "A) ..."
                lines.append(opt)
        elif q.format == "short-answer":
            lines.append("Write your answer (one–three words or a number).")
        elif q.format == "true-false-not-given":
            lines.append("A) TRUE")
            lines.append("B) FALSE")
            lines.append("C) NOT GIVEN")
        lines.append("")

    lines.append(sep)
    lines.append("")
    lines.append('Type your answers (e.g., "1-C, 2-A, 3-C") and I\'ll give you instant feedback! 🎯')
    return "\n".join(lines)

# --- Pydantic модели для парсинга вывода LLM ---

class DeeperFeedbackResponse(BaseModel):
    """Модель для структурированного ответа от deeper_feedback_chain."""
    error_analysis: str = Field(alias="errorAnalysis")
    strategy_tip: str = Field(alias="strategyTip")
    evidence_quote: str = Field(alias="evidenceQuote")
    motivational_message: str = Field(alias="motivationalMessage")


class RouterOutput(BaseModel):
    """Модель для вывода из цепочки-роутера."""
    action: Literal[
        "GENERATE_EXPLANATION",
        "GENERATE_HINT",
        "ASK_SOCRATIC_QUESTION",
        "ANSWER_GENERAL_QUESTION",
        "CHITCHAT",
        "REQUEST_USER_TEXT",
        "REQUEST_PRACTICE",
        "PROVIDE_FEEDBACK",
        "ASK_FOR_CLARIFICATION",
        "GENERATE_MICRO_BATTLE",
    ]
    parameters: Dict[str, Any] = {}


class MicroBattleQuestion(BaseModel):
    id: int
    skill: Literal["GIST", "DETAIL", "INFERENCE"]
    format: Literal["multiple-choice", "short-answer", "true-false-not-given"]
    question_text: str
    options: Optional[List[str]] = None
    correct_answer: str
    rationale: str


class MicroBattle(BaseModel):
    level: Literal["beginner", "intermediate", "advanced"]
    topic: str
    time_target_seconds: int
    words_count: int
    passage: List[str]
    questions: List[MicroBattleQuestion]


class AgentService:
    def __init__(self):
        # Параметры (api_key) передаются напрямую в конструкторы моделей
        self.quality_llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.2,
            api_key=settings.OPENAI_API_KEY 
        )
        self.fast_llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.2,
            api_key=settings.OPENAI_API_KEY
        )
        
        # Get the absolute path to the prompts directory
        current_file = Path(__file__).resolve()
        prompts_dir = current_file.parent.parent / "prompts"
        self.deeper_feedback_prompt_template = (prompts_dir / "deeper_feedback.txt").read_text()
        self.tutor_router_prompt_template = (prompts_dir / "tutor_router.txt").read_text()
        self.hint_generation_prompt_template = (prompts_dir / "hint_generation.txt").read_text()
        self.micro_battle_prompt_template = (prompts_dir / "micro_battle.txt").read_text()

        self.general_chat_prompt_template = ChatPromptTemplate.from_messages([
            ("system", """System: You are an expert IELTS Reading tutor named Alex — a supportive, encouraging AI tutor specialized in the IELTS Academic Reading module. Your mission: help students improve reading skills (timing, accuracy, vocabulary, inference) using scaffolded teaching, short practice tasks, and clear feedback. Always be student-centered, motivational, and concise.

Behavior rules:
- Start responses with brief empathy/encouragement (e.g., “Nice work — let’s tackle this.”).
- Ask one clarifying question only if user intent is unclear (goal: timing, accuracy, vocabulary, or general practice).
- Structure each reply: 1) acknowledgement, 2) concept (short), 3) step-by-step strategy or drill, 4) one short example or micro-practice, 5) suggested next action and a closing question.
- Use clear, conversational English. Avoid unexplained jargon; use simple analogies.
- When user provides a passage or questions: first ask their target (speed/score/skill), then offer a micro-assessment (1–3 questions), show one modeled solution with thought process, then provide 2 practice items or a timed drill.
- Do not provide or invent actual exam content or answers to real copyrighted test forms. Use user-provided text only when they paste it.
- Avoid absolute score guarantees or numeric promises. Encourage measurement: “let’s track time and accuracy over 3 attempts.”
- Keep most replies under 500 words and focused. For multi-step lesson plans, label sections and give an estimated time per activity.
- End every turn positively (e.g., “Great effort — ready for a 5-min drill?”).

Defaults & tools:
- Default drill length: 10 minutes. Default hint policy: max 3 hints per practice item.
- If user asks for resources, recommend reputable sources generically (e.g., Cambridge practice books, AWL apps) without linking to copyrighted exam items.

Example starter prompt for students:
User: “I struggle with matching headings and run out of time.”
Agent should respond: Acknowledge → Ask whether priority is timing or accuracy → Give 3 quick strategies for headings → Model one example in 60–90 seconds → Offer a 5-min timed drill and ask to start.

End.
"""),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{user_message}")
        ])

    async def generate_deeper_feedback(self, context: dict) -> DeeperFeedbackResponse:
        """Генерирует глубокий анализ и возвращает Pydantic модель."""
        parser = JsonOutputParser(pydantic_object=DeeperFeedbackResponse)
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.deeper_feedback_prompt_template),
            ("system", "Output format instructions: {format_instructions}"),
            ("user", "Here is the data: {passage_text}, {question_statement}, {student_answer}, {correct_answer}, {question_type_theory}")
        ]).partial(format_instructions=parser.get_format_instructions())
        
        chain = prompt | self.quality_llm | parser
        result = await chain.ainvoke(context)
        return result

    async def generate_micro_battle(self, level: str | None, topic: str | None, chat_history: str) -> 'MicroBattle':
        """Генерирует Micro‑Passage Battle согласно спецификации и возвращает Pydantic модель."""
        parser = JsonOutputParser(pydantic_object=MicroBattle)
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.micro_battle_prompt_template),
            ("user", "Level: {level}\nTopic: {topic}\nChat context: {chat_history}")
        ])
        chain = prompt | self.quality_llm | parser
        normalized_level = (level or "auto").strip().lower()
        normalized_topic = (topic or "").strip()
        result = await chain.ainvoke({
            "level": normalized_level,
            "topic": normalized_topic,
            "chat_history": chat_history[:2000],
        })
        return result

    async def handle_chat_message(self, session_id: str, messages: list[ChatMessage], dropped_question_id: str | None) -> ChatMessage:
        """Главный обработчик сообщений чата."""
        chat_history = messages[:-1]
        user_message = messages[-1].content
        router_decision: Optional[RouterOutput] = None

        # Shortcut: if user clearly asks for a micro-battle, route directly to GENERATE_MICRO_BATTLE
        lower_msg = user_message.lower()
        micro_battle_keywords = [
            "micro battle", "micro-battle", "micro passage", "micro-passage",
            "3-minute drill", "three minute drill", "micro drill", "short practice",
            "micro reading", "micro exercise", "micro passage battle"
        ]
        if any(k in lower_msg for k in micro_battle_keywords):
            router_decision = RouterOutput(action="GENERATE_MICRO_BATTLE", parameters={})
        
        try:
            if router_decision is None:
                router_chain = (
                    ChatPromptTemplate.from_template(self.tutor_router_prompt_template)
                    | self.fast_llm 
                    | JsonOutputParser(pydantic_object=RouterOutput)
                )
                
                formatted_history = "\n".join([f"{m.role}: {m.content}" for m in chat_history])
                router_result = await router_chain.ainvoke({
                    "chat_history": formatted_history,
                    "user_message": user_message
                })
                # Convert dict to RouterOutput if needed
                if isinstance(router_result, dict):
                    router_decision = RouterOutput(**router_result)
                else:
                    router_decision = router_result
        except Exception as e:
            print(f"Error in router or parsing: {e}")
            # Fallback to general chat if routing fails
            router_decision = RouterOutput(action="CHITCHAT", parameters={})
        
        if router_decision.action == "GENERATE_EXPLANATION":
            question_id = dropped_question_id or "q1"
            student_answer = "some answer"
            context = await self.get_full_context_for_question(question_id, student_answer)
            
            feedback_model = await self.generate_deeper_feedback(context)
            response_content = (
                f"**Here's a breakdown of your answer:**\n\n"
                f"**Why it's incorrect:**\n{feedback_model.error_analysis}\n\n"
                f"**Pro Tip:**\n{feedback_model.strategy_tip}\n\n"
                f"**Evidence from the text:**\n> {feedback_model.evidence_quote}"
            )

        elif router_decision.action == "GENERATE_HINT":
            hint_chain = (
                ChatPromptTemplate.from_template(self.hint_generation_prompt_template)
                | self.fast_llm
                | StrOutputParser()
            )
            # Use dropped_question_id or fall back to a default
            question_id = dropped_question_id if dropped_question_id else "q1"
            context = await self.get_full_context_for_question(question_id, "")
            response_content = await hint_chain.ainvoke({
                "passage_text": context["passage_text"],
                "question_statement": context["question_statement"]
            })

        elif router_decision.action == "GENERATE_MICRO_BATTLE":
            params = router_decision.parameters or {}
            mb_level = (params.get("level") or params.get("target_level") or "").strip().lower()
            mb_topic = params.get("topic")

            if mb_level not in {"beginner", "intermediate", "advanced"}:
                response_content = (
                    "Choose your level:\n"
                    "🟢 Beginner (IELTS 4–5)\n"
                    "🟡 Intermediate (IELTS 6–6.5)\n"
                    "🔴 Advanced (IELTS 7+)\n"
                    "⚡ Auto (I'll choose based on your performance)"
                )
            else:
                formatted_history_mb = "\n".join([f"{m.role}: {m.content}" for m in chat_history])
                battle = await self.generate_micro_battle(mb_level, mb_topic, formatted_history_mb)
                response_content = format_micro_battle_for_chat(battle)
        
        elif router_decision.action == "REQUEST_USER_TEXT":
            response_content = (
                "Please paste the passage or the specific IELTS Reading questions you'd like help with. "
                "I will analyze them and guide you step by step."
            )

        elif router_decision.action == "REQUEST_PRACTICE":
            response_content = (
                "Would you like a quick practice session?\n"
                "- Option A: 5-minute timed drill focusing on timing\n"
                "- Option B: Two practice items focusing on accuracy\n\n"
                "Reply with 'timed_drill' or 'practice_items' to begin."
            )

        elif router_decision.action == "PROVIDE_FEEDBACK":
            feedback_chain = (
                ChatPromptTemplate.from_messages([
                    ("system", "Provide 2–4 sentences of targeted, constructive feedback for an IELTS Reading student based on their last message and brief context. Be concise, specific, and action-oriented. Avoid full explanations; suggest the next concrete step."),
                    ("user", "Recent chat (may be brief): {chat_history}\nLatest user message: {user_message}")
                ])
                | self.fast_llm
                | StrOutputParser()
            )
            formatted_history_fb = "\n".join([f"{m.role}: {m.content}" for m in chat_history])
            response_content = await feedback_chain.ainvoke({
                "chat_history": formatted_history_fb,
                "user_message": user_message
            })

        elif router_decision.action == "ASK_FOR_CLARIFICATION":
            response_content = (
                "To help best, could you clarify your priority right now: timing, accuracy, "
                "vocabulary, matching headings, or general practice?"
            )
        
        else: # Обработка для CHITCHAT, ASK_SOCRATIC_QUESTION и т.д.
            try:
                general_chain = self.general_chat_prompt_template | self.fast_llm | StrOutputParser()
                # Convert ChatMessage objects to LangChain message objects
                history_messages = []
                for m in chat_history:
                    if m.role == "user":
                        history_messages.append(HumanMessage(content=m.content))
                    elif m.role == "assistant":
                        history_messages.append(AIMessage(content=m.content))
                    elif m.role == "system":
                        history_messages.append(SystemMessage(content=m.content))
                
                response_content = await general_chain.ainvoke({
                    "chat_history": history_messages,
                    "user_message": user_message
                })
            except Exception as e:
                print(f"Error in general chat: {e}")
                response_content = (
                    "Hi! 👋 I'm ALEX — your IELTS Reading Mentor. "
                    "Tell me what you want to work on today: timing, accuracy, vocabulary, "
                    "matching headings, or general practice. 😊"
                )

        return ChatMessage(role="assistant", content=response_content)

    async def get_full_context_for_question(self, question_id, student_answer):
        """Мок-функция для получения контекста. Позже будет заменена на вызов БД."""
        # В реальном приложении здесь будет асинхронный запрос к PostgreSQL
        return {
            "passage_text": "The project, which has been ongoing since 2018, aims to map the ocean floor in unprecedented detail. This initiative was first proposed at a conference in late 2017.",
            "question_statement": "The research began before 2018.",
            "student_answer": student_answer,
            "correct_answer": "FALSE",
            "question_type_theory": "For a statement to be 'TRUE', it must be directly confirmed by the passage. For it to be 'FALSE', it must be directly contradicted."
        }
