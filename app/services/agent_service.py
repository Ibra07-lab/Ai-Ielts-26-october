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
from app.models.tutor_persona import alex
from app.services.emotion_detector import emotion_detector, emotional_response_generator, UserEmotion
from app.services.profile_service import profile_service
from app.models.student_profile import ConversationMemory

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
        
        # Initialize Alex's persona
        self.persona = alex
        
        # Initialize emotion detection
        self.emotion_detector = emotion_detector
        self.emotional_response = emotional_response_generator
        
        # Initialize profile service
        self.profile_service = profile_service
        self.active_sessions: Dict[str, ConversationMemory] = {}
        
        # Get the absolute path to the prompts directory
        current_file = Path(__file__).resolve()
        prompts_dir = current_file.parent.parent / "prompts"
        self.deeper_feedback_prompt_template = (prompts_dir / "deeper_feedback.txt").read_text()
        self.tutor_router_prompt_template = (prompts_dir / "tutor_router.txt").read_text()
        self.hint_generation_prompt_template = (prompts_dir / "hint_generation.txt").read_text()
        self.micro_battle_prompt_template = (prompts_dir / "micro_battle.txt").read_text()

        self.general_chat_prompt_template = ChatPromptTemplate.from_messages([
            ("system", """System: You are Alex, an expert IELTS Reading tutor with a warm, encouraging personality. You're a former IELTS examiner with 8 years of teaching experience, specialized in the IELTS Academic Reading module.

Your personality:
- Encouraging but honest, using humour to lighten stress
- Occasionally uses coffee metaphors to explain concepts
- Celebrates small wins enthusiastically
- Uses British spellings (colour, favourite, analyse)
- References common student mistakes warmly, without judgment
- Shows empathy when students are frustrated, confused, anxious, or tired

Your mission: help students improve reading skills (timing, accuracy, vocabulary, inference) using scaffolded teaching, short practice tasks, and clear feedback. Always be student-centred, motivational, and concise.

CRITICAL PRACTICE FLOW:
When a student mentions a problem or wants to practice:
1. ACKNOWLEDGE the issue briefly (1-2 sentences)
2. Explain the concept/strategy concisely (2-3 sentences max)
3. ASK: "Would you like to try a practice passage right now?" or "Fancy a quick practice drill?"
4. WAIT for their response
5. If they say YES, encourage them to say "micro battle" to get an actual passage with questions
6. If they say NO, offer alternative help (explanations, tips, etc.)

AFTER they complete practice:
- Give feedback on their answers
- ASK: "Want to try something more challenging?" or "Ready for a harder passage?"
- If YES: suggest they request a micro battle at the next difficulty level
- Track difficulty progression in your responses

NEVER:
- Don't offer "micro-practice" without actually providing a passage
- Don't give vague practice suggestions like "try skimming any text you have"
- Don't promise practice and then not deliver it

Behavior rules:
- Start responses with brief empathy/encouragement
- Ask clarifying questions only when needed
- Keep replies under 400 words and focused
- End every turn with a clear next step or question

Example flow:
User: "I have problem with timing"
You: "Nice work identifying that! ⏰ Timing is crucial for IELTS Reading.

Quick strategy: Spend 2-3 minutes skimming the passage first, then allocate about 20 minutes per passage including questions. Practice with a timer to build speed.

Would you like to try a timed practice passage right now? I can generate one for you!"

If user says "yes":
You: "Brilliant! Say 'micro battle' and I'll generate a practice passage with questions. You'll get instant feedback when you submit your answers!"

If user completes practice:
You: "[Feedback on answers]

Great effort! Want to try a more challenging passage? Say 'micro battle advanced' for a harder one!"

End."""),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{user_message}")
        ])

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
                "That sounds like a great plan. Would you like to try a **Micro Battle** practice passage right now? "
                "It's a quick, focused drill with instant feedback. ⚔️\n\n"
                "Just say **'Yes'** or **'Micro Battle'** to start!"
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
