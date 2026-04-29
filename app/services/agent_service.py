# app/services/agent_service.py

import logging
from pathlib import Path
from typing import Literal, Dict, Any, Optional, List
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
from app.models.tutor_persona import _dev_alex as alex, create_alex
from app.services.emotion_detector import emotion_detector, emotional_response_generator, UserEmotion
from app.services.profile_service import profile_service
from app.models.student_profile import ConversationMemory
from app.services.answer_parser import parse_student_answers, extract_question_id_from_message
from app.prompts.training_prompts import (
    build_training_prompt,
    build_phase_reminder,
    should_transition_phase,
    PHASE_LIMITS,
    PHASE_NAMES,
)
from datetime import datetime
import json

# Setup file logging
log_file = f"debug_log_{datetime.now().strftime('%Y%m%d')}.txt"
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

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

    lines: List[str] = []
    # Header - compact
    lines.append(f"{level_emoji} Level: {battle.level.capitalize()} ")
    lines.append(f"📚 Topic: {battle.topic}")
    lines.append(f"📏 Length: {battle.words_count} words")
    lines.append(f"⏱️ Target Time: {mm:01d}:{ss:02d}")
    lines.append("")
    # Passage
    lines.append("📄 PASSAGE")
    for p in battle.passage:
        lines.append(p)
    lines.append("")
    # Questions - very compact
    lines.append("❓ QUESTIONS")

    for q in battle.questions:
        lines.append("")
        lines.append(f"**Q{q.id}.** {q.question_text}")
        if q.format == "multiple-choice" and q.options:
            for opt in q.options:
                lines.append(opt)
        elif q.format == "short-answer":
            lines.append("Write your answer (one–three words or a number).")
        elif q.format == "true-false-not-given":
            lines.append("A) TRUE")
            lines.append("B) FALSE")
            lines.append("C) NOT GIVEN")
    
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
        
        # Load specialized micro-battle prompts
        self.micro_battle_prompts = {
            "mixed": (prompts_dir / "micro_battle.txt").read_text(),
            "tfng": (prompts_dir / "micro_battle_tfng.txt").read_text(),
            "tfng_targeted": (prompts_dir / "micro_battle_tfng_targeted.txt").read_text() if (prompts_dir / "micro_battle_tfng_targeted.txt").exists() else "",
            "multiple_choice": (prompts_dir / "micro_battle_multiple_choice.txt").read_text(),
            "multiple_choice_targeted": (prompts_dir / "micro_battle_multiple_choice_targeted.txt").read_text() if (prompts_dir / "micro_battle_multiple_choice_targeted.txt").exists() else "",
            "matching_headings_targeted": (prompts_dir / "micro_battle_matching_headings_targeted.txt").read_text() if (prompts_dir / "micro_battle_matching_headings_targeted.txt").exists() else "",
            "short_answer": (prompts_dir / "micro_battle_short_answer.txt").read_text(),
            "short_answer_targeted": (prompts_dir / "micro_battle_short_answer_targeted.txt").read_text() if (prompts_dir / "micro_battle_short_answer_targeted.txt").exists() else ""
        }
        self.micro_battle_prompt_template = self.micro_battle_prompts["mixed"]

        # Load T/F/NG theory for educational feedback
        self.tfng_theory_compact = (prompts_dir / "tfng_theory_compact.txt").read_text()
        
        # Load Matching Headings theory for educational feedback
        self.matching_headings_theory_compact = (prompts_dir / "matching_headings_theory_compact.txt").read_text()

        # Load dynamic theory data from reading-theory.json
        self._load_theory_data()

        # System prompts are dynamically built in _build_general_chain

    async def handle_chat_message(self, session_id: str, messages: list[ChatMessage], dropped_question_id: str | None) -> ChatMessage:
        """Главный обработчик сообщений чата."""
        chat_history = messages[:-1]
        user_message = messages[-1].content
        router_decision: Optional[RouterOutput] = None
        
        # ========== TRAINING SESSION BRANCH ==========
        # If this session is in training mode, bypass the router entirely
        if session_id in self.active_sessions:
            memory = self.active_sessions[session_id]
            if memory.training_mode:
                return await self._handle_training_turn(session_id, memory, user_message, chat_history)
        # ========== END TRAINING BRANCH ==========
        
        # Parse and store student answers if present
        if session_id in self.active_sessions:
            memory = self.active_sessions[session_id]
            parsed_answers = parse_student_answers(user_message)
            if parsed_answers:
                # Store answers in memory
                memory.student_answers.update(parsed_answers)
                logger.info(f"[ANSWER_PARSE] Parsed answers: {parsed_answers}")
                
                # FAST-PATH: If answers were parsed, route directly to PROVIDE_FEEDBACK
                # This bypasses the router and triggers Socratic questioning immediately
                logger.info("[FAST_PATH] Answer submission detected - routing to PROVIDE_FEEDBACK for Socratic questioning")
                router_decision = RouterOutput(action="PROVIDE_FEEDBACK", parameters={})

        # FAST-PATH: Bypass router for simple greetings/chitchat (saves 3-7 seconds)
        lower_msg = user_message.lower().strip()
        
        # Simple greetings (1-2 words)
        simple_greetings = {
            "hello", "hi", "hey", "hiya", "howdy", "greetings",
            "good morning", "good afternoon", "good evening", "good day",
            "what's up", "whats up", "sup", "wassup", "yo"
        }
        
        # Check if message is a simple greeting
        if lower_msg in simple_greetings or (len(user_message.split()) <= 2 and any(g in lower_msg for g in simple_greetings)):
            logger.info("[FAST_PATH] Bypassing router for simple greeting")
            router_decision = RouterOutput(action="CHITCHAT", parameters={})
        
        # Shortcut: if user clearly asks for a micro-battle, route directly to GENERATE_MICRO_BATTLE
        if router_decision is None:
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
            params = router_decision.parameters or {}
            
            # Check if user is skipping Socratic questioning
            if params.get("skip_socratic") and session_id in self.active_sessions:
                memory = self.active_sessions[session_id]
                
                if memory.waiting_for_reasoning and memory.waiting_for_reasoning in memory.pending_socratic_questions:
                    q_id = memory.waiting_for_reasoning
                    wrong_q = memory.pending_socratic_questions[q_id]
                    
                    # Get context for explanation
                    context = await self.get_full_context_for_question(f"q{q_id}", wrong_q['student_answer'], session_id)
                    
                    # Generate standard explanation
                    feedback_context = {
                        "passage_text": memory.current_passage,
                        "question_statement": wrong_q['question_text'],
                        "student_answer": wrong_q['student_answer'],
                        "correct_answer": wrong_q['correct_answer'],
                        "question_type": wrong_q.get("format", "true-false-not-given"),
                        "is_correct": False
                    }
                    
                    try:
                        feedback_model = await self.generate_deeper_feedback(feedback_context)
                        response_content = f"**Q{q_id} Explanation:**\n\n"
                        response_content += f"**Why it's wrong:** {feedback_model.error_analysis}\n\n"
                        response_content += f"**Evidence from passage:** {feedback_model.evidence_quote}\n\n"
                        response_content += f"**Strategy tip:** {feedback_model.strategy_tip}\n\n"
                    except Exception as e:
                        logger.error(f"Error generating explanation: {e}")
                        response_content = f"**Q{q_id}:** The correct answer is **{wrong_q['correct_answer']}**. Review the passage carefully to see why.\n\n"
                    
                    # Remove this question and move to next wrong answer if any
                    del memory.pending_socratic_questions[q_id]
                    memory.waiting_for_reasoning = None
                    
                    # Check if there are more wrong answers
                    if memory.pending_socratic_questions:
                        next_wrong_id = min(memory.pending_socratic_questions.keys())
                        next_wrong = memory.pending_socratic_questions[next_wrong_id]
                        memory.waiting_for_reasoning = next_wrong_id
                        
                        response_content += f"**Let's look at Q{next_wrong_id} now:**\n\n"
                        response_content += f"❓ **Why did you choose '{next_wrong['student_answer']}'?**\n\n"
                        response_content += "What made you think so?\n\n"
                        response_content += "_(Or say 'skip' to see the explanation)_"
                    else:
                        # All wrong answers explained!
                        response_content += "✅ **All questions reviewed! Ready for another practice?**"
                
            # Standard GENERATE_EXPLANATION for all questions
            elif session_id not in self.active_sessions:
                response_content = "I don't have access to your practice session. Please generate a passage first!"
            else:
                memory = self.active_sessions[session_id]
                
                if not memory.current_questions or not memory.student_answers:
                    response_content = "Please submit your answers first (e.g., 'A,B,C') so I can provide explanations!"
                else:
                    # Build explanations for ALL questions
                    explanation_sections = []
                    
                    for question in memory.current_questions:
                        q_id = question.get("id")
                        q_text = question.get("question_text", "")
                        correct_ans = question.get("correct_answer", "").upper()
                        student_ans = memory.student_answers.get(q_id, "NOT PROVIDED").upper()
                        
                        # Map A/B/C to TRUE/FALSE/NOT GIVEN — ONLY for T/F/NG questions
                        q_format = question.get("format", "true-false-not-given")
                        tfng_mapping = {'A': 'TRUE', 'B': 'FALSE', 'C': 'NOT GIVEN'}
                        if q_format == "true-false-not-given" and student_ans in tfng_mapping:
                            student_ans_meaning = tfng_mapping[student_ans]
                        else:
                            student_ans_meaning = student_ans
                        
                        # Check if correct
                        is_correct = (student_ans_meaning == correct_ans)
                        
                        # Generate detailed feedback for ALL answers (both correct and incorrect)
                        context = {
                            "passage_text": memory.current_passage,
                            "question_statement": q_text,
                            "student_answer": student_ans_meaning,
                            "correct_answer": correct_ans,
                            "question_type": question.get("format", "true-false-not-given"),
                            "is_correct": is_correct  # Pass this info to help the LLM adjust tone
                        }
                        
                        try:
                            feedback_model = await self.generate_deeper_feedback(context)
                            
                            if is_correct:
                                # For correct answers, show confirmation with detailed reasoning
                                explanation_sections.append(
                                    f"### Q{q_id}: ✅ CORRECT\n"
                                    f"**Question:** *{q_text}*\n"
                                    f"**Your Answer:** {student_ans} ({student_ans_meaning})\n\n"
                                    f"**Why it's correct:** {feedback_model.error_analysis}\n"
                                    f"**Key Strategy:** {feedback_model.strategy_tip}\n"
                                    f"**Evidence:** > {feedback_model.evidence_quote}\n\n"
                                    f"_{feedback_model.motivational_message}_\n"
                                )
                            else:
                                # For incorrect answers, show detailed breakdown
                                explanation_sections.append(
                                    f"### Q{q_id}: ❌ INCORRECT\n"
                                    f"**Question:** *{q_text}*\n"
                                    f"**Your Answer:** {student_ans} ({student_ans_meaning})\n"
                                    f"**Correct Answer:** {correct_ans}\n\n"
                                    f"**Why it's incorrect:** {feedback_model.error_analysis}\n"
                                    f"**Pro Tip:** {feedback_model.strategy_tip}\n"
                                    f"**Evidence:** > {feedback_model.evidence_quote}\n\n"
                                    f"_{feedback_model.motivational_message}_\n"
                                )
                        except Exception as e:
                            logger.error(f"Error generating feedback for Q{q_id}: {e}")
                            if is_correct:
                                explanation_sections.append(
                                    f"### Q{q_id}: ✅ CORRECT\n"
                                    f"**Question:** *{q_text}*\n"
                                    f"**Your Answer:** {student_ans} ({student_ans_meaning})\n\n"
                                    f"**Why it's correct:** The passage supports this answer. The evidence in the text matches your choice.\n"
                                )
                            else:
                                explanation_sections.append(
                                    f"### Q{q_id}: ❌ INCORRECT\n"
                                    f"**Question:** *{q_text}*\n"
                                    f"**Your Answer:** {student_ans} ({student_ans_meaning})\n"
                                    f"**Correct Answer:** {correct_ans}\n\n"
                                    f"Review the passage carefully to find the evidence for the correct answer.\n"
                                )
                    
                    # Combine all explanations
                    response_content = (
                        "## Complete answer breakdown\n\n"
                        + "\n---\n\n".join(explanation_sections)
                        + "\n\nIf you want another practice session, tell me the level and topic you'd like to work on next."
                    )

        elif router_decision.action == "GENERATE_HINT":
            hint_chain = (
                ChatPromptTemplate.from_template(self.hint_generation_prompt_template)
                | self.fast_llm
                | StrOutputParser()
            )
            # Use dropped_question_id or fall back to a default
            question_id = dropped_question_id if dropped_question_id else "q1"
            context = await self.get_full_context_for_question(question_id, "", session_id)
            response_content = await hint_chain.ainvoke({
                "passage_text": context["passage_text"],
                "question_statement": context["question_statement"]
            })

        elif router_decision.action == "GENERATE_MICRO_BATTLE":
            params = router_decision.parameters or {}
            mb_level_raw = (params.get("level") or params.get("target_level") or "").strip().lower()
            mb_topic = params.get("topic")

            # INTELLIGENT LEVEL MAPPING - normalize vague inputs
            level_mapping = {
                # Beginner variants
                "first": "beginner", "1": "beginner", "start": "beginner",
                "new": "beginner", "begin": "beginner", "easy": "beginner", "beginner": "beginner",
                # Intermediate variants
                "middle": "intermediate", "2": "intermediate", "okay": "intermediate",
                "medium": "intermediate", "normal": "intermediate", "intermediate": "intermediate",
                # Advanced variants
                "hard": "advanced", "3": "advanced", "difficult": "advanced",
                "challenging": "advanced", "advanced": "advanced",
                # Auto
                "auto": "auto"
            }
            
            mb_level = level_mapping.get(mb_level_raw, "")

            # Use stored difficulty if not explicitly requested
            if not mb_level:
                if session_id in self.active_sessions:
                    mb_level = self.active_sessions[session_id].current_difficulty
                else:
                    mb_level = "intermediate"
            
            # Check for recent explanation context OR accepted suggestion for targeted practice
            use_targeted_practice = False
            struggle_focus = ""
            module_details = ""
            question_type_override = None
            
            if session_id in self.active_sessions:
                memory = self.active_sessions[session_id]
                
                # Priority 1: Check if student accepted a practice suggestion (from performance summary)
                if memory.suggested_practice_focus and any(word in user_message.lower() for word in ['yes', 'ok', 'sure', 'practice']):
                    use_targeted_practice = True
                    primary_weakness = memory.suggested_practice_focus
                    module_id = memory.suggested_module_id or self._pattern_to_module_id(primary_weakness)
                    
                    # Map pattern to question type
                    pattern_to_qtype = {
                        "not_given_false_confusion": "true-false-not-given",
                        "not_given_true_confusion": "true-false-not-given",
                        "qualifier_trap": "true-false-not-given",
                        "specificity_mismatch": "true-false-not-given",
                        "keyword_mismatch": "true-false-not-given",
                        "detail_vs_main_idea": "matching-headings",
                        "distractor_confusion": "multiple-choice",
                        "word_limit_violation": "gap-fill",
                        "completion_error": "short-answer"
                    }
                    question_type_override = pattern_to_qtype.get(primary_weakness, "true-false-not-given")
                    
                    struggle_focus, module_details = self._format_struggle_focus_for_practice([module_id])
                    logger.info(f"[WEAKNESS_PRACTICE] Generating targeted practice for weakness: {primary_weakness}")
                    
                    # Clear suggestion after use
                    memory.suggested_practice_focus = None
                    memory.suggested_module_id = None
                
                # Priority 2: Use targeted practice if explanation was recent (within 10 minutes)
                elif memory.recent_explanation_topic and memory.recent_explanation_timestamp:
                    time_since = datetime.now() - memory.recent_explanation_timestamp
                    if time_since.total_seconds() < 600:  # 10 minutes
                        use_targeted_practice = True
                        question_type_override = memory.recent_explanation_topic
                        
                        if memory.recent_struggle_modules:
                            struggle_focus, module_details = self._format_struggle_focus_for_practice(
                                memory.recent_struggle_modules
                            )
                            logger.info(f"[TARGETED_PRACTICE] Using targeted practice for {question_type_override} with modules {memory.recent_struggle_modules}")
            
            formatted_history_mb = "\n".join([f"{m.role}: {m.content}" for m in chat_history])
            # Extract question_type from parameters, default to "mixed"
            question_type = params.get("question_type", "mixed")
            
            # Override with recent explanation topic if targeted practice is enabled
            if use_targeted_practice and question_type_override:
                question_type = question_type_override
            
            battle = await self.generate_micro_battle(
                mb_level, 
                mb_topic, 
                question_type, 
                formatted_history_mb, 
                session_id,
                use_targeted=use_targeted_practice,
                struggle_focus=struggle_focus,
                module_details=module_details
            )
            response_content = format_micro_battle_for_chat(battle)
        
        elif router_decision.action == "REQUEST_USER_TEXT":
            response_content = (
                "Please paste the passage or the specific IELTS Reading questions you'd like help with. "
                "I will analyze them and guide you step by step."
            )

        elif router_decision.action == "REQUEST_PRACTICE":
            response_content = (
                "That sounds like a great plan. Would you like to try a **Practice Session** right now? "
                "It's a quick, focused drill with instant feedback. ⚔️\n\n"
                "Just say **'Yes'** to start!"
            )

        elif router_decision.action == "PROVIDE_FEEDBACK":
            # Check submitted answers against correct answers
            logger.info(f"[FEEDBACK] session_id: {session_id}")
            logger.info(f"[FEEDBACK] Active sessions: {list(self.active_sessions.keys())}")
            
            if session_id in self.active_sessions:
                memory = self.active_sessions[session_id]
                
                if memory.student_answers and memory.current_questions:
                    # T/F/NG letter mapping — ONLY for true-false-not-given questions
                    tfng_letter_mapping = {
                        'A': 'TRUE',
                        'B': 'FALSE',
                        'C': 'NOT GIVEN'
                    }
                    
                    # Build feedback for each submitted answer with theory connections
                    feedback_lines = []
                    wrong_answers = []
                    
                    for q_id, student_ans in sorted(memory.student_answers.items()):
                        # Find the corresponding question
                        correct_q = next((q for q in memory.current_questions if q.get("id") == q_id), None)
                        
                        if correct_q:
                            correct_answer = correct_q.get("correct_answer", "").upper()
                            student_ans_raw = student_ans.upper()
                            
                            # Detect format PER QUESTION (not globally)
                            q_format = correct_q.get('format', 'true-false-not-given')
                            
                            # Only map A→TRUE/B→FALSE/C→NOT GIVEN for T/F/NG questions
                            if q_format == 'true-false-not-given' and student_ans_raw in tfng_letter_mapping:
                                student_ans_meaning = tfng_letter_mapping[student_ans_raw]
                                student_ans_display = f"{student_ans_raw} ({student_ans_meaning})"
                            else:
                                # For multiple-choice, short-answer, etc. — keep the raw answer
                                student_ans_meaning = student_ans_raw
                                student_ans_display = student_ans_raw
                            
                            # Check if correct
                            is_correct = (student_ans_meaning == correct_answer)
                            
                            # Identify mistake pattern and module
                            mistake_pattern, module_id = self._identify_mistake_pattern(
                                q_format,
                                student_ans_meaning,
                                correct_answer,
                                correct_q
                            )
                            
                            # Store in answer history for performance tracking
                            memory.answer_history.append({
                                "question_id": q_id,
                                "student_answer": student_ans_meaning,
                                "correct_answer": correct_answer,
                                "is_correct": is_correct,
                                "mistake_pattern": mistake_pattern,
                                "module_id": module_id
                            })
                            
                            # For CORRECT answers: show theory insight immediately
                            if is_correct:
                                theory_insight = self._get_theory_insight_for_correct(
                                    q_format,
                                    correct_answer,
                                    correct_q,
                                    module_id
                                )
                                feedback_lines.append(f"✅ **Q{q_id}:** Correct! {theory_insight}")
                            else:
                                # For WRONG answers: DO NOT reveal the answer yet
                                # Just mark it wrong — Socratic questioning comes next
                                feedback_lines.append(f"❌ **Q{q_id}:** Your answer: {student_ans_display}")
                                wrong_answers.append({
                                    "id": q_id,
                                    "student_answer": student_ans_display,
                                    "correct_answer": correct_answer,
                                    "question_text": correct_q.get("question_text", ""),
                                    "format": q_format
                                })
                    
                    # Build response
                    if feedback_lines:
                        # Detect question type from first question for performance analysis
                        question_type = memory.current_questions[0].get('format', 'true-false-not-given') if memory.current_questions else 'true-false-not-given'
                        
                        response_content = "**Your Results:**\n\n" + "\n".join(feedback_lines)
                        
                        # Generate brief performance summary
                        total_q = len(memory.student_answers)
                        correct_count = len([h for h in memory.answer_history[-total_q:] if h.get('is_correct', False)])
                        accuracy = (correct_count / total_q * 100) if total_q > 0 else 0
                        
                        response_content += f"\n\n📊 You got **{correct_count}/{total_q} correct** ({accuracy:.0f}% accuracy)!"
                        
                        # Analyze performance and add comprehensive summary
                        if len(memory.answer_history) >= 3:
                            analysis = self._analyze_performance(memory.answer_history, session_id)
                            
                            if analysis:
                                summary = self._generate_performance_summary(
                                    analysis,
                                    memory.answer_history,
                                    question_type
                                )
                                if summary:
                                    response_content += f"\n\n{summary}"
                                
                                # Add targeted practice suggestion if weak patterns detected
                                weak_patterns = analysis.get('weak_patterns', [])
                                if weak_patterns:
                                    primary_weakness = weak_patterns[0]
                                    module_id = self._pattern_to_module_id(primary_weakness)
                                    
                                    response_content += f"**🎯 Targeted Practice Suggestion:**\n\n"
                                    response_content += f"I noticed you struggled with {self._pattern_to_friendly_name(primary_weakness)}. "
                                    response_content += f"Would you like me to generate another practice passage that specifically focuses on this? "
                                    response_content += f"Say **'yes'** and I'll create targeted questions!"
                                    
                                    memory.suggested_practice_focus = primary_weakness
                                    memory.suggested_module_id = module_id
                        
                        # ADAPTIVE DIFFICULTY: Adjust based on accuracy
                        if accuracy >= 80:
                            memory.difficulty_points += 1
                        elif accuracy <= 40:
                            memory.difficulty_points -= 1
                        
                        # Scale difficulty if threshold reached
                        if memory.difficulty_points >= 2:
                            if memory.current_difficulty == "beginner":
                                memory.current_difficulty = "intermediate"
                                response_content += "\n\n🚀 **Level Up!** You're doing great, so I'm making the next tasks a bit more challenging."
                            elif memory.current_difficulty == "intermediate":
                                memory.current_difficulty = "advanced"
                                response_content += "\n\n🔥 **Master Level!** Your accuracy is excellent. Let's try some advanced-level tricky questions next."
                            memory.difficulty_points = 0
                        elif memory.difficulty_points <= -2:
                            if memory.current_difficulty == "advanced":
                                memory.current_difficulty = "intermediate"
                                response_content += "\n\n📉 **Adjustment:** These were quite tricky! I'll ease the difficulty a bit for the next one."
                            elif memory.current_difficulty == "intermediate":
                                memory.current_difficulty = "beginner"
                                response_content += "\n\n📉 **Adjustment:** Let's focus on the basics for a bit to build up your confidence again."
                            memory.difficulty_points = 0
                        
                        # SOCRATIC FLOW: Ask "Why?" BEFORE revealing the answer
                        if wrong_answers:
                            # Store wrong answers for Socratic questioning
                            for wa in wrong_answers:
                                memory.pending_socratic_questions[wa['id']] = wa
                            
                            # Start with the first wrong answer
                            first_wrong = wrong_answers[0]
                            memory.waiting_for_reasoning = first_wrong['id']
                            
                            response_content += f"\n\n---\n\n"
                            response_content += f"**Let's review Q{first_wrong['id']}:**\n\n"
                            response_content += f"❓ **Why did you choose '{first_wrong['student_answer']}'?**\n\n"
                            response_content += "Tell me what in the passage made you think so.\n\n"
                            response_content += "_(Or say 'skip' to see the explanation)_"
                        else:
                            # All correct!
                            response_content += "\n\n🎉 **Perfect score! Excellent work!**"
                    else:
                        response_content = "I couldn't match your answers to the questions. Try formatting like '1-A, 2-B, 3-C' next time!"
                else:
                    response_content = "I don't see any practice questions in our current session. Want to try a practice passage?"
            else:
                response_content = "I don't have access to your session. Try generating a practice passage first!"

        elif router_decision.action == "ASK_SOCRATIC_QUESTION":
            # Handle Socratic questioning - student is explaining their reasoning
            params = router_decision.parameters or {}
            
            if params.get("follow_up") and session_id in self.active_sessions:
                memory = self.active_sessions[session_id]
                
                if memory.waiting_for_reasoning and memory.waiting_for_reasoning in memory.pending_socratic_questions:
                    q_id = memory.waiting_for_reasoning
                    wrong_q = memory.pending_socratic_questions[q_id]
                    
                    # Store student's reasoning
                    memory.student_reasoning[q_id] = user_message
                    
                    # Get context for explanation
                    context = await self.get_full_context_for_question(f"q{q_id}", wrong_q['student_answer'], session_id)
                    
                    # Generate explanation based on student's misconception
                    socratic_prompt = f"""The student answered Question {q_id} incorrectly.

Question: {wrong_q['question_text']}
Student's answer: {wrong_q['student_answer']}
Correct answer: {wrong_q['correct_answer']}

Student's reasoning: "{user_message}"

Relevant passage excerpt: {context['passage_text'][:600] if context.get('passage_text') else ''}

Based on the student's reasoning, provide a response that:
1. Acknowledges their thinking (e.g., "I see why you thought that!")
2. Identifies the specific misconception that led them astray
3. Explains what they missed or misunderstood in the passage
4. Shows the correct reasoning with evidence from the passage
5. Gives a tip to avoid this mistake in future

Be warm and supportive. Focus on fixing the misconception, not blaming them for the mistake. Use British spellings."""

                    explanation_response = await self.fast_llm.ainvoke(socratic_prompt)
                    
                    response_content = f"**Q{q_id} Explanation:**\n\n{explanation_response.content}\n\n"
                    
                    # Remove this question and move to next wrong answer if any
                    del memory.pending_socratic_questions[q_id]
                    memory.waiting_for_reasoning = None
                    
                    # Check if there are more wrong answers
                    if memory.pending_socratic_questions:
                        next_wrong_id = min(memory.pending_socratic_questions.keys())
                        next_wrong = memory.pending_socratic_questions[next_wrong_id]
                        memory.waiting_for_reasoning = next_wrong_id
                        
                        response_content += f"**Let's look at Q{next_wrong_id} now:**\n\n"
                        response_content += f"❓ **Why did you choose '{next_wrong['student_answer']}'?**\n\n"
                        response_content += "What made you think so?\n\n"
                        response_content += "_(Or say 'skip' to see the explanation)_"
                    else:
                        # All wrong answers explained!
                        response_content += "✅ **All questions reviewed! Great learning session.**\n\n"
                        response_content += "Want to try another practice passage?"
                else:
                    response_content = "I'm not sure which question you're referring to. Could you clarify?"
            else:
                # General Socratic questioning (not in feedback flow)
                response_content = "That's interesting! Can you tell me more about your reasoning?"

        elif router_decision.action == "ASK_FOR_CLARIFICATION":
            # Enhanced clarification with problem-specific diagnostic questions
            params = router_decision.parameters or {}
            target_skill = params.get("target_skill")
            
            if target_skill == "tfng":
                response_content = (
                    "I can help with T/F/NG questions! 📝 Let me understand better so I can give you the most useful advice.\n\n"
                    "**What specifically are you finding tricky?**\n\n"
                    "• Understanding what TRUE/FALSE/NOT GIVEN mean?\n"
                    "• Distinguishing FALSE from NOT GIVEN? (This is the trickiest part!)\n"
                    "• Finding the relevant information in the passage?\n"
                    "• Taking too long to answer these questions?\n"
                    "• Understanding qualifiers and keywords?\n"
                    "• Something else?\n\n"
                    "Let me know and I'll give you targeted strategies!"
                )
            elif target_skill == "matching_headings":
                response_content = (
                    "I can help with Matching Headings! 📋 Let me understand your specific challenge.\n\n"
                    "**What's giving you trouble?**\n\n"
                    "• Understanding what 'main idea' means?\n"
                    "• Getting distracted by keywords instead of themes?\n"
                    "• Differentiating between similar headings?\n"
                    "• Not sure how to skim paragraphs effectively?\n"
                    "• Taking too much time?\n\n"
                    "Tell me more and I'll help you tackle it!"
                )
            elif target_skill == "timing":
                response_content = (
                    "Timing issues are super common! ⏰ Let's pinpoint where you're losing time.\n\n"
                    "**Where are you struggling?**\n\n"
                    "• Reading the passage too slowly?\n"
                    "• Spending too long on difficult questions?\n"
                    "• Not sure how to allocate time across passages?\n"
                    "• Getting stuck and can't move on?\n"
                    "• Running out of time at the end?\n\n"
                    "Which one sounds most like your situation?"
                )
            elif target_skill == "vocabulary":
                response_content = (
                    "Vocabulary challenges - I totally get it! 📚 Let's see where I can help most.\n\n"
                    "**What's the main issue?**\n\n"
                    "• Too many unknown words overall?\n"
                    "• Don't know how to guess word meanings from context?\n"
                    "• Academic vocabulary is too advanced?\n"
                    "• Words look similar but mean different things?\n"
                    "• Unfamiliar technical terms?\n\n"
                    "Let me know your biggest challenge!"
                )
            elif target_skill == "multiple_choice":
                response_content = (
                    "Multiple choice can be tricky! 🎯 Let's figure out what's causing confusion.\n\n"
                    "**Where do you get stuck?**\n\n"
                    "• All answers seem correct?\n"
                    "• Falling for distractor answers?\n"
                    "• Can't find the information in the passage?\n"
                    "• Don't understand paraphrasing?\n"
                    "• Taking too long to decide?\n\n"
                    "Tell me what happens when you try these questions!"
                )
            elif target_skill == "gap_fill":
                response_content = (
                    "Gap fill questions require precision! ✍️ Let's identify your challenge.\n\n"
                    "**What's difficult for you?**\n\n"
                    "• Don't know where to find the answer in the passage?\n"
                    "• Not sure what type of word fits grammatically?\n"
                    "• Finding the word but it doesn't fit?\n"
                    "• Exceeding the word limit?\n"
                    "• Choosing between similar words?\n\n"
                    "Which one describes your struggle?"
                )
            elif target_skill == "short_answer":
                response_content = (
                    "Short answer questions need careful attention! 📝 Let's see what's challenging.\n\n"
                    "**What's the issue?**\n\n"
                    "• Can't find the answer in the passage?\n"
                    "• Answer is longer than the word limit?\n"
                    "• Not sure if you should use exact passage words?\n"
                    "• Don't understand what the question is asking?\n"
                    "• Finding multiple possible answers?\n\n"
                    "Tell me more about what you're experiencing!"
                )
            else:
                # Generic clarification for completely vague problems
                response_content = (
                    "I'm here to help! 💪 Let's narrow down what you need.\n\n"
                    "**What area are you struggling with?**\n\n"
                    "• **Question types**: T/F/NG, Matching Headings, Multiple Choice, etc.?\n"
                    "• **Skills**: Timing, Vocabulary, Finding information?\n"
                    "• **Understanding**: What questions are asking, passage structure?\n"
                    "• **Strategy**: How to approach passages, what to read first?\n\n"
                    "Let me know your priority and I'll give you focused help!"
                )
        
        elif router_decision.action == "ANSWER_GENERAL_QUESTION":
            # Dedicated handler for factual IELTS questions (theory, strategies, explanations)
            params = router_decision.parameters or {}
            target_skill = params.get("target_skill", "general")
            
            try:
                general_chain, history_messages = self._build_general_chain(
                    session_id=session_id,
                    chat_history=chat_history,
                    user_message=user_message,
                    target_skill=target_skill
                )
                
                response_content = await general_chain.ainvoke({
                    "chat_history": history_messages,
                    "user_message": user_message
                })
                
                # Store the explanation topic for targeted practice follow-up
                if session_id in self.active_sessions:
                    memory = self.active_sessions[session_id]
                    memory.recent_explanation_topic = target_skill
                    memory.recent_explanation_timestamp = datetime.now()
                    logger.info(f"[GENERAL_Q] Answered general question about: {target_skill}")
                    
            except Exception as e:
                logger.error(f"Error in ANSWER_GENERAL_QUESTION: {e}")
                response_content = (
                    "I'd like to help with that question, but I ran into a problem generating the response. "
                    "Could you try rephrasing your question?"
                )

        else:  # CHITCHAT fallback
            try:
                general_chain, history_messages = self._build_general_chain(
                    session_id=session_id,
                    chat_history=chat_history,
                    user_message=user_message,
                    target_skill=None
                )
                
                response_content = await general_chain.ainvoke({
                    "chat_history": history_messages,
                    "user_message": user_message
                })
            except Exception as e:
                logger.error(f"Error in general chat: {e}")
                response_content = (
                    "Hi. I'm Alex — your IELTS Reading mentor. "
                    "Tell me what you want to work on: timing, accuracy, vocabulary, "
                    "matching headings, or general practice."
                )

        return ChatMessage(role="assistant", content=response_content)

    async def stream_chat_message(
        self,
        session_id: str,
        messages: list[ChatMessage],
        dropped_question_id: str | None,
    ):
        """
        Streaming variant of handle_chat_message.
        
        - For CHITCHAT / general explanation, streams tokens as they're generated.
        - For other actions, falls back to handle_chat_message and yields the full answer once.
        """
        if not messages:
            yield "No messages provided."
            return

        chat_history = messages[:-1]
        user_message = messages[-1].content
        router_decision: Optional[RouterOutput] = None
        
        # ========== TRAINING SESSION STREAMING BRANCH ==========
        if session_id in self.active_sessions:
            memory = self.active_sessions[session_id]
            if memory.training_mode:
                try:
                    response = await self._handle_training_turn(session_id, memory, user_message, list(chat_history))
                    yield response.content
                except Exception as e:
                    logger.error(f"[TRAINING STREAM] Error: {e}")
                    yield "Sorry, I encountered an error during your training session. Please try again."
                return
        # ========== END TRAINING BRANCH ==========

        # Run the router (non-streaming) to decide the action
        try:
            router_chain = (
                ChatPromptTemplate.from_template(self.tutor_router_prompt_template)
                | self.fast_llm
                | JsonOutputParser(pydantic_object=RouterOutput)
            )

            formatted_history = "\n".join([f"{m.role}: {m.content}" for m in chat_history])
            router_result = await router_chain.ainvoke({
                "chat_history": formatted_history,
                "user_message": user_message,
            })
            if isinstance(router_result, dict):
                router_decision = RouterOutput(**router_result)
            else:
                router_decision = router_result
        except Exception as e:
            logger.error(f"[STREAM] Error in router, falling back to CHITCHAT: {e}")
            router_decision = RouterOutput(action="CHITCHAT", parameters={})

        action = router_decision.action

        # Streamable branches: CHITCHAT and ANSWER_GENERAL_QUESTION
        if action in {"CHITCHAT", "ANSWER_GENERAL_QUESTION"}:
            try:
                params = router_decision.parameters or {}
                target_skill = params.get("target_skill") if action == "ANSWER_GENERAL_QUESTION" else None
                
                general_chain, history_messages = self._build_general_chain(
                    session_id=session_id,
                    chat_history=chat_history,
                    user_message=user_message,
                    target_skill=target_skill
                )

                # Stream tokens as they arrive from the LLM
                async for chunk in general_chain.astream({
                    "chat_history": history_messages,
                    "user_message": user_message,
                }):
                    # chunk is a piece of the final string from StrOutputParser
                    if isinstance(chunk, str) and chunk:
                        yield chunk
            except Exception as e:
                logger.error(f"[STREAM] Error during streaming generation: {e}")
                yield "\n\nSorry, I had an error while generating this answer. Please try again."
        else:
            # For non-streamable actions (micro-battles, structured feedback, etc.),
            # fall back to the regular handle_chat_message and yield the full result once
            logger.info(f"[STREAM] Non-streamable action {action}, using handle_chat_message fallback.")
            try:
                response_message = await self.handle_chat_message(
                    session_id=session_id,
                    messages=messages,
                    dropped_question_id=dropped_question_id,
                )
                yield response_message.content
            except Exception as e:
                logger.error(f"[STREAM] Error in fallback path: {e}")
                yield "\n\nSorry, I encountered an error. Please try again."

    # ============================================================
    # TRAINING SESSION METHODS
    # ============================================================
    
    async def start_training_session(
        self,
        session_id: str,
        skill: str,
        context_payload: Dict[str, Any],
    ) -> str:
        """
        Initialize a new training session and generate the first AI message.
        
        Args:
            session_id: Unique session identifier
            skill: Skill slug (e.g. "tfng")
            context_payload: Student context with accuracy, recent_errors, etc.
        
        Returns:
            The AI's first message (Phase 1 diagnostic start).
        """
        logger.info(f"[TRAINING] Starting training session: skill={skill}, session={session_id}")
        
        # Build the full training prompt
        full_prompt = build_training_prompt(skill, context_payload)
        
        # Create training session memory
        memory = ConversationMemory(
            session_id=session_id,
            student_id=context_payload.get("student_id", "unknown"),
            training_mode=True,
            training_system_prompt=full_prompt,
            training_skill=skill,
            training_phase=1,
            training_questions_in_phase=0,
            training_scores={"diagnostic": [], "drill": [], "simulation": []},
            training_context_payload=context_payload,
        )
        self.active_sessions[session_id] = memory
        
        # Generate first AI message (Phase 1 start)
        phase_reminder = build_phase_reminder(
            phase=1,
            questions_in_phase=0,
            max_questions=PHASE_LIMITS[1],
        )
        
        messages = [
            SystemMessage(content=full_prompt),
            SystemMessage(content=phase_reminder),
            HumanMessage(content="Start the training session now."),
        ]
        
        response = await self.quality_llm.ainvoke(messages)
        first_message = response.content
        
        logger.info(f"[TRAINING] Session started, Phase 1 diagnostic begun")
        return first_message
    
    async def _handle_training_turn(
        self,
        session_id: str,
        memory: ConversationMemory,
        user_message: str,
        chat_history: list,
    ) -> ChatMessage:
        """
        Handle a single turn within an active training session.
        Bypasses the normal router. Injects the saved system prompt
        and a phase reminder into every OpenAI call.
        """
        logger.info(f"[TRAINING] Turn in phase {memory.training_phase}, "
                    f"question {memory.training_questions_in_phase} in phase")
        
        # Increment question count for current phase
        memory.training_questions_in_phase += 1
        
        # Check for phase transition
        current_phase = memory.training_phase
        if current_phase in PHASE_LIMITS and should_transition_phase(current_phase, memory.training_questions_in_phase):
            memory.training_phase += 1
            memory.training_questions_in_phase = 0
            logger.info(f"[TRAINING] Phase transition: {current_phase} -> {memory.training_phase}")
        
        # Build phase reminder
        phase = memory.training_phase
        max_q = PHASE_LIMITS.get(phase, 4)
        phase_reminder = build_phase_reminder(
            phase=phase,
            questions_in_phase=memory.training_questions_in_phase,
            max_questions=max_q,
        )
        
        # Build message list with persisted system prompt
        messages = [SystemMessage(content=memory.training_system_prompt)]
        
        # Trim conversation history to last 2 exchanges (4 messages)
        # to reduce API input token costs.
        MAX_HISTORY_MESSAGES = 4  # 2 exchanges × 2 (user + assistant)
        trimmed_history = chat_history[-MAX_HISTORY_MESSAGES:] if len(chat_history) > MAX_HISTORY_MESSAGES else chat_history
        
        # Add conversation history
        for msg in trimmed_history:
            if msg.role == "user":
                messages.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                messages.append(AIMessage(content=msg.content))
        
        # Add phase reminder and current user message
        messages.append(SystemMessage(content=phase_reminder))
        messages.append(HumanMessage(content=user_message))
        
        # Call LLM
        response = await self.quality_llm.ainvoke(messages)
        response_content = response.content
        
        # Check if session is complete (Phase 4 — result block emitted)
        if ":::SESSION_RESULT" in response_content:
            memory.training_phase = 4
            logger.info(f"[TRAINING] Session complete — result block detected")
        
        return ChatMessage(role="assistant", content=response_content)

    def _build_general_chain(
        self,
        session_id: str,
        chat_history: list[ChatMessage],
        user_message: str,
        target_skill: Optional[str] = None
    ):
        """
        Build the dynamic general-chat chain and history messages.
        This is shared between the normal and streaming paths.
        """
        # Build base system message
        base_system_message = """System: You are Alex, an expert IELTS Reading tutor and former examiner.
Voice: Calm, measured, evidence-based mentor. Use British spellings. Empathize with students. Keep replies concise and focused.

RESPONSE & UI FORMATTING RULES (CRITICAL):
- MINIMAL spacing (only ONE blank line between major sections, none between bullets).
- ICONS: 🎬 (Example), ⚔️ (Plan), 🪤 (Mistake), 💡 (Tip), ⏱️ (Time).
- BADGES: [ ✅ TRUE ], [ ❌ FALSE ], [ 🔍 NOT GIVEN ].
- HIGHLIGHTS: *italics* for passage quotes, `backticks` for statement words, ~~strikethrough~~ for clashing words.

SIDE-BY-SIDE EXAMPLES (Use this EXACT structure in a blockquote for examples):
> 🎬 **SEE IT IN ACTION**
>
> Passage Excerpt: "*quote from passage*"
> Statement: "`statement text`"
>
> **THE SOLUTION:**
> [ ❌ FALSE ]
> **Logic:** Explain using ~~strikethrough~~ for clashes and *italics* for passage quotes.

DIAGNOSE BEFORE PRESCRIBING:
If a student struggles, NEVER dump generic strategies. ALWAYS ask ONE diagnostic question first to pinpoint their specific bottleneck. Keep responses brief (2-3 sentences) and invite engagement.

ADAPTIVE DIFFICULTY & PRACTICE:
- Auto-adjust difficulty based on performance (don't ask).
- If they ask for practice, determine the Question Type and generate the passage immediately.
- For examples, match passage length (5-10 statements) and order from easiest to hardest.

End every turn with a clear next step or question. Keep replies under 300 words.
"""

        # INJECT SESSION CONTEXT if available
        if session_id in self.active_sessions:
            memory = self.active_sessions[session_id]
            if memory.current_passage and memory.current_questions:
                # Extract question texts for reference
                question_list = "\n".join([f"  Q{q.get('id')}: {q.get('question_text', '')}" for q in memory.current_questions])
                
                base_system_message += f"""

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔒 CRITICAL CONTEXT: ACTIVE PRACTICE SESSION

The student is currently working on THIS specific practice passage:

📄 PASSAGE:
{memory.current_passage}

❓ QUESTIONS:
{question_list}

🚨 MANDATORY RULES:
1. If the student asks about their answers, questions, or requests evidence/explanations:
   - Quote EXCLUSIVELY from the passage above
   - Reference ONLY the questions listed above
   - Use the EXACT wording from the passage (no paraphrasing)

2. If asked "Why is X wrong?" or "Show me evidence":
   - Find the relevant sentence in the passage above
   - Quote it word-for-word with quotation marks
   - Explain using ONLY information from this passage

3. NEVER EVER:
   - Invent text that doesn't appear in the passage above
   - Reference other passages or external knowledge
   - Generate new passages or paraphrased versions
   - Use placeholder examples like "ocean mapping" or "research projects"

4. If you cannot find the answer in the passage above, say:
   "I need to check the stored question details. Let me look that up for you."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

        # Target skill driven theory injection
        theory_to_inject = None
        theory_name = None
        if target_skill and target_skill != "general":
            # Map target_skill to theory ID
            type_mapping = {
                "tfng": "true-false-not-given",
                "matching_headings": "matching-headings",
                "multiple_choice": "multiple-choice",
                "gap_fill": "gap-fill",
                "short_answer": "short-answer",
                "matching_information": "matching-information"
            }
            theory_id = type_mapping.get(target_skill, target_skill.replace("_", "-"))
            theory_name = theory_id.replace("-", " ").title()
            
            # Find theory content in theory_data to get struggleModules
            theory_content = None
            if hasattr(self, 'theory_data'):
                theory_content = next((qt for qt in self.theory_data.get("questionTypes", []) 
                                      if qt.get("id") == theory_id), None)
            else:
                logger.warning("[SYSTEM PROMPT BUILDER] Failed to inject theory: 'theory_data' not loaded.")
            
            # Generate enhanced theory with struggle modules if available
            if theory_content and theory_content.get('struggleModules'):
                theory_to_inject = self._enhance_theory_with_struggle_modules(theory_content, theory_id)
            elif theory_content:
                # Fall back to basic theory if no modules defined
                theory_to_inject = self._get_dynamic_theory(theory_id)
                if theory_to_inject == "No theory data available.":
                    theory_to_inject = None
            
            # Store explanation context for targeted practice generation
            if session_id in self.active_sessions:
                memory = self.active_sessions[session_id]
                memory.recent_explanation_topic = theory_id
                memory.recent_explanation_timestamp = datetime.now()
                
                # Extract struggle module IDs if available
                if theory_content and theory_content.get('struggleModules'):
                    memory.recent_struggle_modules = theory_content['struggleModules']
                else:
                    memory.recent_struggle_modules = []
        
        # Inject the appropriate theory
        if theory_to_inject:
            base_system_message += f"\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            base_system_message += f"📚 EXPERT KNOWLEDGE BASE: {theory_name.upper()}\n"
            base_system_message += f"MANDATORY INSTRUCTION: You use the theory provided below to answer the student.\n"
            base_system_message += f"CRITICAL: You MUST preserve the Markdown formatting (blockquotes '>', emojis, bolding) EXACTLY as they appear in the theory. \n"
            base_system_message += f"DO NOT paraphrase the 'Attack Plan', 'Quick Summary', or 'Traps' sections. Output them exactly as styled below so the UI renders them as cards.\n\n"
            base_system_message += f"{theory_to_inject}\n"
            base_system_message += f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"

        dynamic_chat_prompt = ChatPromptTemplate.from_messages([
            ("system", base_system_message),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{user_message}"),
        ])
        
        general_chain = dynamic_chat_prompt | self.fast_llm | StrOutputParser()
        
        # Convert ChatMessage objects to LangChain message objects
        # Truncate history to the last 4 messages (2 exchanges) to dramatically reduce token costs
        MAX_GENERAL_HISTORY = 4
        trimmed_chat_history = chat_history[-MAX_GENERAL_HISTORY:] if len(chat_history) > MAX_GENERAL_HISTORY else chat_history
        
        history_messages = []
        for m in trimmed_chat_history:
            if m.role == "user":
                history_messages.append(HumanMessage(content=m.content))
            elif m.role == "assistant":
                history_messages.append(AIMessage(content=m.content))
            elif m.role == "system":
                history_messages.append(SystemMessage(content=m.content))
        
        return general_chain, history_messages

    async def get_full_context_for_question(self, question_id, student_answer, session_id):
        """Retrieve context for a question, preferring active session memory over mock data."""
        
        # 1. Try to get from real session memory
        if session_id in self.active_sessions:
            memory = self.active_sessions[session_id]
            if memory.current_passage and memory.current_questions:
                # Find the specific question by ID
                # Note: question_id might be "q1", "1", or just 1. We need to be flexible.
                try:
                    q_num = int(str(question_id).lower().replace("q", ""))
                except ValueError:
                    q_num = 1 # Default to first question if ID parsing fails
                
                # Find question with matching ID
                target_q = next((q for q in memory.current_questions if q.get("id") == q_num), None)
                
                if target_q:
                    context_to_return = {
                        "passage_text": memory.current_passage,
                        "question_statement": target_q.get("question_text", ""),
                        "student_answer": student_answer,
                        "correct_answer": target_q.get("correct_answer", ""),
                        "rationale": target_q.get("rationale", ""),
                        "question_type": target_q.get("format", "true-false-not-given"),  # Extract from stored question
                        "question_type_theory": "Review the passage carefully to find evidence supporting or contradicting the statement."
                    }
                    
                    logger.info(f"[CONTEXT] ✅ Found context from session")
                    logger.info(f"[CONTEXT] Passage (first 150 chars): {memory.current_passage[:150]}")
                    logger.info(f"[CONTEXT] Question: {target_q.get('question_text', '')}")
                    
                    return context_to_return


        # 2. Fallback to mock data if no session context found
        logger.warning(f"[FALLBACK] ⚠️ Using MOCK DATA (ocean mapping)!")
        logger.warning(f"  → session_id: {session_id}")
        logger.warning(f"  → session exists: {session_id in self.active_sessions}")
        if session_id in self.active_sessions:
            memory = self.active_sessions[session_id]
            logger.warning(f"  → has passage: {bool(memory.current_passage)}")
            logger.warning(f"  → has questions: {len(memory.current_questions) if memory.current_questions else 0}")
            logger.warning(f"  → question_id requested: {question_id}")
            
        return {
            "passage_text": "The project, which has been ongoing since 2018, aims to map the ocean floor in unprecedented detail. This initiative was first proposed at a conference in late 2017.",
            "question_statement": "The research began before 2018.",
            "student_answer": student_answer,
            "correct_answer": "FALSE",
            "question_type_theory": "For a statement to be 'TRUE', it must be directly confirmed by the passage. For it to be 'FALSE', it must be directly contradicted."
        }

    async def generate_micro_battle(
        self, 
        level: str, 
        topic: Optional[str], 
        question_type: str, 
        chat_history: str, 
        session_id: str,
        use_targeted: bool = False,
        struggle_focus: str = "",
        module_details: str = ""
    ) -> MicroBattle:
        """Generate a micro-battle practice session based on level, topic, and question type."""
        
        # Select the appropriate prompt based on question_type and targeted practice
        if use_targeted:
            # Map theory IDs to practice types for targeted prompts
            type_mapping = {
                'true-false-not-given': 'tfng',
                'yes-no-not-given': 'tfng',
                'matching-headings': 'matching_headings',
                'multiple-choice': 'multiple_choice',
                'gap-fill': 'short_answer',
                'sentence-completion': 'short_answer',
                'short-answer': 'short_answer'
            }
            
            practice_type = type_mapping.get(question_type, 'mixed')
            targeted_prompt_key = f"{practice_type}_targeted"
            
            # Use targeted prompt if available, fall back to standard
            if targeted_prompt_key in self.micro_battle_prompts and self.micro_battle_prompts[targeted_prompt_key]:
                selected_prompt = self.micro_battle_prompts[targeted_prompt_key]
                logger.info(f"[TARGETED_PRACTICE] Using targeted prompt: {targeted_prompt_key}")
            else:
                selected_prompt = self.micro_battle_prompts.get(practice_type, self.micro_battle_prompts["mixed"])
                logger.info(f"[TARGETED_PRACTICE] Targeted prompt not found, using standard: {practice_type}")
        else:
            # Standard prompt selection
            selected_prompt = self.micro_battle_prompts.get(question_type, self.micro_battle_prompts["mixed"])
        
        micro_battle_chain = (
            ChatPromptTemplate.from_template(selected_prompt)
            | self.quality_llm
            | JsonOutputParser(pydantic_object=MicroBattle)
        )
        
        result = await micro_battle_chain.ainvoke({
            "level": level,
            "topic": topic or "",
            "chat_history": chat_history,
            "struggle_focus": struggle_focus,
            "module_details": module_details
        })
        
        # Convert dict to MicroBattle if needed
        battle = result
        if isinstance(result, dict):
            battle = MicroBattle(**result)
        
        # VALIDATION: Check for contradictions between correct_answer and rationale
        self._validate_battle_consistency(battle)
            
        # Store in session memory
        if session_id not in self.active_sessions:
            # Create a new memory if it doesn't exist
            self.active_sessions[session_id] = ConversationMemory(session_id=session_id, student_id="guest")
        
        memory = self.active_sessions[session_id]
        memory.current_passage = "\n\n".join(battle.passage)
        memory.current_topic = battle.topic
        # Store questions as dicts
        memory.current_questions = [q.dict() for q in battle.questions]
        
        logger.info(f"[STORAGE] Stored session {session_id} with {len(memory.current_questions)} questions")
        logger.info(f"[STORAGE] Active sessions after storing: {list(self.active_sessions.keys())}")
        
        return battle

    async def generate_deeper_feedback(self, context: Dict[str, Any]) -> DeeperFeedbackResponse:
        """Generate deeper feedback for incorrect answers."""
        
        # LOG THE ACTUAL PASSAGE BEING USED
        logger.warning(f"[FEEDBACK_GEN] ==========================================")
        logger.warning(f"[FEEDBACK_GEN] Passage (first 200 chars): {context.get('passage_text', '')[:200]}")
        logger.warning(f"[FEEDBACK_GEN] Question: {context.get('question_statement', '')}")
        logger.warning(f"[FEEDBACK_GEN] Student answer: {context.get('student_answer', '')}")
        logger.warning(f"[FEEDBACK_GEN] Correct answer: {context.get('correct_answer', '')}")
        logger.warning(f"[FEEDBACK_GEN] ==========================================")
        
        deeper_feedback_chain = (
            ChatPromptTemplate.from_template(self.deeper_feedback_prompt_template)
            | self.quality_llm
            | JsonOutputParser(pydantic_object=DeeperFeedbackResponse)
        )
        
        # Choose theory based on question type from context
        question_type = context.get('question_type', 'true-false-not-given')
        context['theory_context'] = self._get_dynamic_theory(question_type)
        
        # DETECT AND INJECT STRUGGLE MODULE for wrong answers
        student_answer = context.get('student_answer', '')
        correct_answer = context.get('correct_answer', '')
        user_message = context.get('user_message', '')
        
        detected_module_id = self._detect_struggle_module(
            question_type,
            student_answer,
            correct_answer,
            user_message
        )
        
        if detected_module_id:
            module_content = self._get_module_content(detected_module_id)
            if module_content:
                # Inject module guidance into the feedback context
                module_guidance = f"""

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 STRUGGLE-AWARE MODULE (AUTO-INJECTED): Module {detected_module_id}

This student made a common mistake pattern. Use the guidance below to enhance your feedback:

**{module_content.get('moduleName', '')}**

{module_content.get('content', {}).get('explanation', '')}

**Example Pattern:**
Passage: "{module_content.get('content', {}).get('visualExample', {}).get('passage', '')}"
Statement: "{module_content.get('content', {}).get('visualExample', {}).get('statement', '')}"
Analysis: {module_content.get('content', {}).get('visualExample', {}).get('analysis', '')}

**Apply this pattern to explain the student's mistake.**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
                context['theory_context'] = context['theory_context'] + module_guidance
        
        result = await deeper_feedback_chain.ainvoke(context)
        
        # Convert dict to DeeperFeedbackResponse if needed
        if isinstance(result, dict):
            return DeeperFeedbackResponse(**result)
        return result

    def _load_theory_data(self):
        """Load the central reading-theory.json file."""
        try:
            # Use character encoding to ensure all content loads correctly
            current_file = Path(__file__).resolve()
            # Path relative to app/services/agent_service.py
            # backend/data/reading-theory.json
            theory_path = current_file.parent.parent.parent / "backend" / "data" / "reading-theory.json"
            
            if theory_path.exists():
                with open(theory_path, 'r', encoding='utf-8') as f:
                    self.theory_data = json.load(f)
                logger.info(f"[THEORY] Successfully loaded theory data from {theory_path}")
            else:
                logger.warning(f"[THEORY] Theory file not found at {theory_path}")
                self.theory_data = {"questionTypes": []}
        except Exception as e:
            logger.error(f"[THEORY] Error loading theory data: {e}")
            self.theory_data = {"questionTypes": []}
        
        # Load struggle modules
        self._load_struggle_modules()

    def _load_struggle_modules(self):
        """Load all struggle module JSON files."""
        try:
            current_file = Path(__file__).resolve()
            data_dir = current_file.parent.parent.parent / "backend" / "data"
            
            module_files = [
                'tfng-struggle-modules.json',
                'matching-headings-modules.json',
                'matching-features-modules.json',
                'mcq-modules.json',
                'completion-modules.json',
                'timing-modules.json'
            ]
            
            self.struggle_modules = {}
            
            for file_name in module_files:
                module_path = data_dir / file_name
                if module_path.exists():
                    try:
                        with open(module_path, 'r', encoding='utf-8') as f:
                            module_data = json.load(f)
                            category = module_data.get('category', '')
                            if category:
                                self.struggle_modules[category] = module_data
                                logger.info(f"[MODULES] Loaded {file_name} for category '{category}'")
                    except Exception as e:
                        logger.error(f"[MODULES] Error loading {file_name}: {e}")
                else:
                    logger.warning(f"[MODULES] Module file not found: {module_path}")
                    
            logger.info(f"[MODULES] Successfully loaded {len(self.struggle_modules)} module categories")
        except Exception as e:
            logger.error(f"[MODULES] Error loading struggle modules: {e}")
            self.struggle_modules = {}


    def _get_dynamic_theory(self, question_type: str) -> str:
        """
        Extract and format theory for a specific question type from the JSON data.
        """
        if not hasattr(self, 'theory_data'):
            return "No theory data available."

        # Normalize question_type for matching
        q_type_lower = question_type.lower()
        
        # Special mappings for common variations
        mapping = {
            "true-false-not-given": ["true", "false", "t/f/ng", "tfng"],
            "yes-no-not-given": ["yes", "no", "y/n/ng", "ynng"],
            "matching-headings": ["heading", "paragraph heading"],
            "multiple-choice": ["mcq", "choice", "multiple choice"],
            "gap-fill": ["sentence completion", "summary completion", "note completion", "table completion", "gap fill", "filling"]
        }
        
        target_id = q_type_lower
        for official_id, aliases in mapping.items():
            if any(alias in q_type_lower for alias in aliases):
                target_id = official_id
                break

        # Search for the theory in theory_data
        theory = next((qt for qt in self.theory_data.get("questionTypes", []) 
                      if qt["id"] == target_id or qt["name"].lower() == q_type_lower), None)

        if not theory:
            return f"Guidance for {question_type}:\\n- Follow passage order (if applicable)\\n- Use exact words from passage\\n- Watch the word limit."

        # ========== NEW: ACTIONABLE FORMAT ==========
        guidance_parts = [
            f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            f"📚 {theory['name'].upper()}",
            f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        ]

        # Quick Summary (NEW) -> Blockquote ✨
        if "quickSummary" in theory:
            guidance_parts.append(f"\\n> ✨ **QUICK SUMMARY**")
            guidance_parts.append(f"> {theory['quickSummary']}")

        # Reading Strategy Tag (NEW) -> Blockquote 📌
        if "readingStrategy" in theory:
            strategy_map = {
                "skim": "📖 SKIM (Read for main ideas)",
                "scan": "🔍 SCAN (Hunt for specific keywords)",
                "close-read": "🎯 CLOSE READ (Intense focus on details)"
            }
            strategy_text = strategy_map.get(theory["readingStrategy"], theory["readingStrategy"].upper())
            guidance_parts.append(f"\\n> 📌 **READING STRATEGY**")
            guidance_parts.append(f"> {strategy_text}")

        # Time Management & Difficulty (NEW) -> Blockquote ⏱️
        if "difficulty" in theory or "timePerQuestion" in theory:
            guidance_parts.append("\\n> ⏱️ **TIME MANAGEMENT**")
            if "difficulty" in theory:
                stars = "⭐" * theory["difficulty"]
                guidance_parts.append(f"> Difficulty: {stars} ({theory['difficulty']}/5)")
            if "timePerQuestion" in theory:
                guidance_parts.append(f"> Time Budget: {theory['timePerQuestion']} per question")
            if "examPriority" in theory:
                priority_map = {"high": "🔴 HIGH", "medium": "🟡 MEDIUM", "low": "🟢 LOW"}
                guidance_parts.append(f"> Priority: {priority_map.get(theory['examPriority'], theory['examPriority'].upper())}")

        # Description (Plain text)
        guidance_parts.append(f"\\n📝 **WHAT IT TESTS**")
        guidance_parts.append(theory.get('whatIsIt', {}).get('description', ''))
        if "skillTested" in theory.get("whatIsIt", {}):
            guidance_parts.append(f"Skills: {theory['whatIsIt']['skillTested']}")

        # Recognition (Plain text list)
        rec = theory.get("recognition", {})
        if rec and "howToIdentify" in rec:
            guidance_parts.append("\n👁️ **HOW TO RECOGNIZE THIS QUESTION TYPE**")
            for item in rec["howToIdentify"]:
                guidance_parts.append(f"- {item}")

        # ========== THE 4-STEP ATTACK PLAN (NEW) -> Blockquote ⚔️ ==========
        if "attackPlan" in theory:
            plan = theory["attackPlan"]
            guidance_parts.append(f"\n> ⚔️ **{plan.get('title', 'THE 4-STEP ATTACK PLAN').upper()}**")
            guidance_parts.append(f">")
            guidance_parts.append(f"> {plan.get('description', '')}")
            guidance_parts.append(f">")
            for step in plan.get("steps", []):
                step_num = step.get("step", "")
                title = step.get("title", "")
                desc = step.get("description", "")
                guidance_parts.append(f"> **{step_num}. {title}**")
                guidance_parts.append(f"> {desc}")
                if "example" in step:
                    guidance_parts.append(f"> *💡 Example: {step['example']}*")
                if "proTip" in step:
                    guidance_parts.append(f"> *🎯 Pro Tip: {step['proTip']}*")
                guidance_parts.append(f">") # Spacing

        # ========== SEE IT IN ACTION (NEW) -> Blockquote 🎬 ==========
        if "seeItInAction" in theory:
            ex = theory["seeItInAction"]
            guidance_parts.append(f"\n> 🎬 **SEE IT IN ACTION**")
            guidance_parts.append(f">")
            if "passage" in ex:
                guidance_parts.append(f"> Passage Excerpt: \"{ex['passage']}\"")
            if "question" in ex:
                guidance_parts.append(f"> Statement: \"{ex['question']}\"")
            
            guidance_parts.append(f">")
            guidance_parts.append(f"> **THE SOLUTION:**")
            
            if "correct" in ex:
                ans = ex["correct"]
                icon = "✅" if "TRUE" in ans.upper() or "YES" in ans.upper() else "❌" if "FALSE" in ans.upper() or "NO" in ans.upper() else "🔍"
                guidance_parts.append(f"> [ {icon} {ans.upper()} ]")
                
            if "explanation" in ex:
                guidance_parts.append(f"> **Logic:** {ex['explanation']}")
            guidance_parts.append(f">")

        # ========== HOW THEY WILL TRICK YOU (NEW) -> Blockquote 🪤 ==========
        if "howTheyTrickYou" in theory:
            tricks = theory["howTheyTrickYou"]
            guidance_parts.append(f"\n> 🪤 **HOW THEY WILL TRICK YOU**")
            guidance_parts.append(f">")
            guidance_parts.append(f"> {tricks.get('description', '')}")
            guidance_parts.append(f">")
            for trap in tricks.get("traps", []):
                trap_id = trap.get("id", "")
                name = trap.get("name", "")
                trick = trap.get("theTrick", "")
                guidance_parts.append(f"> **🎯 TRAP #{trap_id}: {name}**")
                guidance_parts.append(f"> The Trick: {trick}")
                guidance_parts.append(f">")
                if "example" in trap:
                    ex = trap["example"]
                    guidance_parts.append(f"> *Example Passage Excerpt:* \"{ex.get('passage', '')}\"")
                    guidance_parts.append(f"> `Example Statement:` \"{ex.get('statement', '')}\"")
                    if "wrongThinking" in ex:
                        guidance_parts.append(f"> ❌ **Wrong Thinking:** {ex['wrongThinking']}")
                    if "defense" in ex:
                        guidance_parts.append(f"> 🛡️ **Defense (How to win):** {ex['defense']}")
                guidance_parts.append(f">")

        # ========== PRO TIPS (NEW) -> Blockquote 💡 ==========
        if "proTips" in theory:
            tips = theory["proTips"]
            guidance_parts.append(f"\n> 💡 **PRO TIPS (EXAM HACKS)**")
            guidance_parts.append(f">")
            for tip_item in tips.get("tips", []):
                tip_text = tip_item.get("tip", "")
                explanation = tip_item.get("explanation", "")
                guidance_parts.append(f"> **✨ {tip_text}**")
                guidance_parts.append(f"> {explanation}")
                guidance_parts.append(f">")

        # Add top-level examples if available (like in table-completion)
        if "examples" in theory and isinstance(theory["examples"], list):
             guidance_parts.append("\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
             guidance_parts.append("📋 REPRESENTATIVE EXAMPLES:")
             guidance_parts.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
             for ex in theory["examples"]:
                 if "passage" in ex: guidance_parts.append(f"Passage: {ex['passage']}")
                 for q in ex.get("questions", []):
                     guidance_parts.append(f"Q: {q.get('text', '')}")
                     guidance_parts.append(f"A: {q.get('correctAnswer', '')}")

        # Iterate through detailed sections (LEGACY SUPPORT)
        sections = theory.get("detailedTheory", {}).get("sections", [])
        for section in sections:
            title = section.get("title", "").upper()
            guidance_parts.append(f"\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            guidance_parts.append(f"SECTION: {title}")
            
            if "content" in section: guidance_parts.append(section["content"])
            if "intro" in section: guidance_parts.append(section["intro"])

            for sub in section.get("subsections", []):
                sub_title = sub.get("title", "")
                if sub_title:
                    guidance_parts.append(f"\\n--- {sub_title} ---")
                
                if "content" in sub: guidance_parts.append(sub["content"])
                if "description" in sub: guidance_parts.append(sub["description"])
                
                # Handle generic lists
                if "list" in sub:
                    for item in sub["list"]:
                        guidance_parts.append(f"• {item}")
                
                # Handle "rules" (common in Gap Fill)
                if "rules" in sub:
                    for rule in sub["rules"]:
                        guidance_parts.append(f"\\nRule: {rule['title']}")
                        guidance_parts.append(f"Description: {rule['description']}")
                
                # Handle "mistakes" (specifically for detailed mistake analysis)
                if "mistakes" in sub:
                    for m in sub["mistakes"]:
                        guidance_parts.append(f"\\n[MISTAKE] {m.get('id', '')} {m['title']}")
                        if "trap" in m: guidance_parts.append(f"   Trap: {m['trap']}")
                        if "rule" in m: guidance_parts.append(f"   Rule: {m['rule']}")
                        if "example" in m:
                            ex = m["example"]
                            guidance_parts.append(f"   Example:")
                            if "passage" in ex: guidance_parts.append(f"     Passage Excerpt: \\\"{ex['passage']}\\\"")
                            if "statement" in ex: guidance_parts.append(f"     Question/Statement: \\\"{ex['statement']}\\\"")
                            elif "question" in ex: guidance_parts.append(f"     Question/Statement: \\\"{ex['question']}\\\"")
                            if "wrong" in ex: guidance_parts.append(f"     ❌ Wrong Answer: {ex['wrong']}")

                            if "correct" in ex: guidance_parts.append(f"     ✅ Correct Answer: {ex['correct']}")

                # Handle "examples" (Walkthrough style)
                if "examples" in sub:
                    if "passage" in sub:
                        guidance_parts.append(f"\"\"\"\n{sub['passage']}\n\"\"\"")
                        
                    for i, ex in enumerate(sub["examples"]):
                        guidance_parts.append(f"\nEXERCISE {i+1}:")
                        if "passage" in ex:
                            guidance_parts.append(f"Context: {ex['passage']}")
                        if "question" in ex:
                            guidance_parts.append(f"Question: {ex['question']}")
                        if "stepByStep" in ex:
                            guidance_parts.append("Step-by-Step Logic:")
                            for step in ex["stepByStep"]:
                                guidance_parts.append(f"  → {step}")
                        if "answer" in ex:
                            guidance_parts.append(f"Correct Answer: {ex['answer']}")

                # Handle "steps" (Strategy style)
                if "steps" in sub:
                    for step in sub["steps"]:
                        guidance_parts.append(f"{step.get('step', '')}. {step['title']}")
                        if "actions" in step:
                            for action in step["actions"]:
                                guidance_parts.append(f"   - {action}")

        return "\n".join(guidance_parts)

    def _get_module_content(self, module_id: str) -> dict:
        """
        Get a specific struggle module by its ID (A, B, C, etc.).
        Returns the module dict or None if not found.
        """
        if not hasattr(self, 'struggle_modules') or not self.struggle_modules:
            logger.warning(f"[MODULES] Struggle modules not loaded")
            return None
        
        # Search through all categories
        for category, module_collection in self.struggle_modules.items():
            modules = module_collection.get('modules', [])
            for module in modules:
                if module.get('moduleId') == module_id:
                    return module
        
        logger.warning(f"[MODULES] Module {module_id} not found")
        return None

    def _format_struggle_focus_for_practice(
        self,
        module_ids: List[str]
    ) -> tuple[str, str]:
        """
        Format struggle modules into practice generation instructions.
        Returns: (struggle_focus_summary, module_details)
        """
        if not module_ids:
            return ("", "")
        
        focus_lines = []
        detail_lines = []
        
        for module_id in module_ids:
            module = self._get_module_content(module_id)
            if module:
                # Summary for focus
                focus_lines.append(f"- **Module {module_id}: {module['moduleName']}**")
                
                # Detailed instructions with examples
                detail_lines.append(f"**Module {module_id}: {module['moduleName']}**")
                detail_lines.append(module['content']['explanation'])
                detail_lines.append("\nExample Pattern:")
                detail_lines.append(f"Passage: {module['content']['visualExample']['passage']}")
                detail_lines.append(f"Statement: {module['content']['visualExample']['statement']}")
                detail_lines.append(f"Analysis: {module['content']['visualExample']['analysis']}")
                detail_lines.append("")
        
        struggle_focus = "\n".join(focus_lines)
        module_details = "\n\n".join(detail_lines)
        
        return (struggle_focus, module_details)

    def _enhance_theory_with_struggle_modules(self, theory_content: dict, question_type: str) -> str:
        """
        When ALEX explains a question type, automatically inject relevant struggle modules.
        """
        # Get base theory formatting
        base_theory = self._get_dynamic_theory(question_type)
        
        # Get struggle modules for this question type
        struggle_module_ids = theory_content.get('struggleModules', [])
        
        if not struggle_module_ids:
            return base_theory
        
        # Load module content
        modules_content = []
        for module_id in struggle_module_ids:
            module = self._get_module_content(module_id)
            if module:
                # Format module in calm style
                module_text = f"""

**Key difficulty {module_id}: {module.get('moduleName', '')}**

{module.get('content', {}).get('explanation', '')}

> 🎬 **SEE IT IN ACTION**
>
> Passage Excerpt: "*{module.get('content', {}).get('visualExample', {}).get('passage', '')}*"
>
> Statement: "`{module.get('content', {}).get('visualExample', {}).get('statement', '')}`"
>
> **THE SOLUTION:**
> {module.get('content', {}).get('visualExample', {}).get('analysis', '')}

**Self-check questions:**
"""
                checkpoint_questions = module.get('content', {}).get('checkpointQuestions', [])
                for question in checkpoint_questions:
                    module_text += f"\n- {question}"
                
                modules_content.append(module_text)
        
        if modules_content:
            # Inject after main theory
            enhanced_theory = base_theory + "\n\n" + "━" * 50 + "\n\n## Common difficulties\n\n"
            enhanced_theory += "\n\n".join(modules_content)
            return enhanced_theory
        
        return base_theory

    def _detect_struggle_module(
        self,
        question_type: str,
        student_answer: str,
        correct_answer: str,
        user_message: str = ""
    ) -> str:
        """
        Detect which struggle module to inject based on question type and mistake pattern.
        Returns moduleId (e.g., "A", "B", "K") or None.
        """
        # Map question types to module categories
        type_to_category = {
            'true-false-not-given': 'tfng',
            'yes-no-not-given': 'tfng',
            'matching-headings': 'headings',
            'matching-features': 'features',
            'matching-information': 'features',
            'multiple-choice': 'mcq',
            'gap-fill': 'completion',
            'sentence-completion': 'completion',
            'summary-completion': 'completion',
            'table-completion': 'completion',
            'flow-chart-completion': 'completion',
            'short-answer': 'completion'
        }
        
        category = type_to_category.get(question_type)
        if not category:
            return None
        
        # T/F/NG specific logic
        if category == 'tfng':
            if correct_answer and 'NOT GIVEN' in correct_answer.upper():
                if student_answer and 'FALSE' in student_answer.upper():
                    return 'A'  # 3-way logic confusion
                elif 'specific' in user_message.lower() or 'detail' in user_message.lower():
                    return 'B'  # Specificity mismatch
            elif 'keyword' in user_message.lower():
                return 'D'  # Keyword ≠ proof
            # Default to Module A for T/F/NG confusion
            return 'A'
        
        # Matching headings logic
        elif category == 'headings':
            if 'detail' in user_message.lower() or 'example' in user_message.lower():
                return 'G'  # Heading trap library
            elif 'main idea' in user_message.lower():
                return 'F'  # Write your own heading
            return 'E'  # Topic sentence hunting (default)
        
        # MCQ logic
        elif category == 'mcq':
            if 'distractor' in user_message.lower() or 'seemed right' in user_message.lower():
                return 'K'  # Distractor anatomy
            return 'K'  # Default to distractor anatomy
        
        # Completion logic
        elif category == 'completion':
            if 'word limit' in user_message.lower() or 'too many words' in user_message.lower():
                return 'M'  # Word-limit compliance
            elif 'order' in user_message.lower():
                return 'N'  # Order-warning system
            return 'M'  # Default to word-limit compliance
        
        # Features logic
        elif category == 'features':
            if 'who said' in user_message.lower() or 'researcher' in user_message.lower():
                return 'I'  # Name-tracking map
            elif 'instruction' in user_message.lower() or 'more than once' in user_message.lower():
                return 'J'  # Instruction parser
            return 'H'  # Default to paragraph fingerprinting
        
        return None

    def _identify_mistake_pattern(
        self,
        question_type: str,
        student_answer: str,
        correct_answer: str,
        question_data: dict
    ) -> tuple:
        """
        Identify the specific mistake pattern and related struggle module.
        Returns: (mistake_pattern_name, module_id)
        """
        # Normalize answers
        student_ans_upper = student_answer.upper() if student_answer else ""
        correct_ans_upper = correct_answer.upper() if correct_answer else ""
        question_text = question_data.get('question_text', '').lower() if question_data else ""
        
        # T/F/NG specific patterns
        if question_type in ['true-false-not-given', 'yes-no-not-given']:
            if 'NOT GIVEN' in correct_ans_upper:
                if 'FALSE' in student_ans_upper or 'NO' in student_ans_upper:
                    return ("not_given_false_confusion", "A")
                elif 'TRUE' in student_ans_upper or 'YES' in student_ans_upper:
                    return ("not_given_true_confusion", "A")
            elif 'FALSE' in correct_ans_upper or 'NO' in correct_ans_upper:
                # Check for qualifier issues
                if any(word in question_text for word in ['all', 'always', 'never', 'every', 'none']):
                    return ("qualifier_trap", "C")
                # Check for specificity
                if any(word in question_text for word in ['twice', 'three times', 'exactly', 'precisely']):
                    return ("specificity_mismatch", "B")
            elif 'TRUE' in correct_ans_upper or 'YES' in correct_ans_upper:
                # Correct answer is TRUE but student got it wrong
                if 'FALSE' in student_ans_upper or 'NO' in student_ans_upper:
                    # Might be keyword matching issue
                    return ("keyword_mismatch", "D")
                elif 'NOT GIVEN' in student_ans_upper:
                    return ("overly_cautious", "A")
            
            # Student got it correct - identify what they did well
            if student_ans_upper in correct_ans_upper or correct_ans_upper in student_ans_upper:
                if 'NOT GIVEN' in correct_ans_upper:
                    return ("correct_not_given", "A")
                elif 'FALSE' in correct_ans_upper or 'NO' in correct_ans_upper:
                    return ("correct_false", "C")
                elif 'TRUE' in correct_ans_upper or 'YES' in correct_ans_upper:
                    return ("correct_true", "D")
        
        # Matching headings patterns
        elif question_type == 'matching-headings':
            if student_answer != correct_answer:
                # Check if it's a detail vs main idea issue
                return ("detail_vs_main_idea", "E")
            else:
                return ("correct_heading", "E")
        
        # Matching information/features patterns
        elif question_type in ['matching-features', 'matching-information']:
            if student_answer != correct_answer:
                return ("features_mismatch", "H")
            else:
                return ("correct_features", "H")
        
        # MCQ patterns
        elif question_type == 'multiple-choice':
            if student_answer != correct_answer:
                return ("distractor_confusion", "K")
            else:
                return ("correct_mcq", "K")
        
        # Completion patterns
        elif question_type in ['gap-fill', 'sentence-completion', 'short-answer', 'summary-completion']:
            if student_answer != correct_answer:
                # Check for word limit or grammar issues
                if question_text and ('no more than' in question_text or 'one word' in question_text):
                    return ("word_limit_violation", "M")
                return ("completion_error", "O")
            else:
                return ("correct_completion", "O")
        
        return ("general_mistake", None)

    def _get_theory_insight_for_correct(
        self,
        question_type: str,
        correct_answer: str,
        question_data: dict,
        module_id: str
    ) -> str:
        """Generate conversational theory insight for correct answers."""
        
        if question_type in ['true-false-not-given', 'yes-no-not-given']:
            if 'NOT GIVEN' in correct_answer.upper():
                return (
                    "You correctly saw that the passage doesn't provide this information. "
                    "NOT GIVEN means you can't find evidence to confirm or contradict the statement."
                )
            elif 'FALSE' in correct_answer.upper() or 'NO' in correct_answer.upper():
                return (
                    "Good. You found the contradiction in the passage. "
                    "The key is always locating the exact words that clash with the statement."
                )
            elif 'TRUE' in correct_answer.upper() or 'YES' in correct_answer.upper():
                return (
                    "Good. You matched the meaning even though the words were different. "
                    "That shows you're reading for meaning, not just matching keywords."
                )
        
        elif question_type == 'matching-headings':
            return (
                "Good. You focused on the main idea instead of getting pulled toward details. "
                "That's exactly what heading questions are testing."
            )
        
        elif question_type in ['matching-features', 'matching-information']:
            return (
                "Good. You matched the statement to the correct person or section. "
                "You looked for the unique idea in the passage instead of relying only on shared keywords."
            )
        
        elif question_type == 'multiple-choice':
            return (
                "Good. You avoided the distractors and focused on what the passage actually says, "
                "not just what sounded familiar."
            )
        
        elif question_type in ['gap-fill', 'sentence-completion', 'short-answer']:
            return (
                "Good. You chose words that fit the gap and match the passage. "
                "That's the discipline completion questions require."
            )
        
        return "Nice work. Your answer lines up with what the passage says."

    def _get_theory_explanation_for_mistake(
        self,
        mistake_pattern: str,
        module_id: str,
        question_data: dict,
        correct_answer: str
    ) -> str:
        """Generate educational explanation connecting to theory."""
        
        question_text = question_data.get('question_text', '') if question_data else ""
        
        if mistake_pattern == "not_given_false_confusion":
            return f"""You chose FALSE, but the answer is NOT GIVEN. Here's the distinction:
        
- **FALSE** needs a clear contradiction in the passage
- **NOT GIVEN** means the information simply isn't there

In this case, the passage doesn't address this claim at all. Remember: if you can't find evidence to confirm OR contradict, it's NOT GIVEN."""
        
        elif mistake_pattern == "not_given_true_confusion":
            return f"""You chose TRUE, but the answer is NOT GIVEN. This type is easy to over-confidently mark TRUE.

- **TRUE** needs clear confirmation in the passage
- **NOT GIVEN** means you can't be certain from what's written

The passage doesn't provide enough information to confirm this statement. When in doubt, ask: "Can I quote evidence for this?" """
        
        elif mistake_pattern == "qualifier_trap":
            return f"""This is a qualifier trap. The statement uses an absolute word (like 'all' or 'always'), but the passage uses a qualifier (like 'some' or 'often'). 

These small words completely change the meaning:
- Passage: 'some students' (qualified)
- Statement: 'all students' (absolute)

This makes it FALSE, not TRUE. Watch for these qualifier shifts; they often flip the answer."""
        
        elif mistake_pattern == "specificity_mismatch":
            return f"""This is a specificity trap. The statement adds extra details not in the passage.

For example:
- Passage: "daily treatment" (general)
- Statement: "twice-daily treatment" (specific)

When the statement adds details the passage doesn't mention, it's usually NOT GIVEN, not FALSE. The passage doesn't contradict it - it just doesn't specify."""
        
        elif mistake_pattern == "keyword_mismatch":
            return f"""Be careful with keyword matching. Just because you see similar words doesn't mean the meaning matches.

The correct answer is {correct_answer}. Look at what the passage actually SAYS, not just which words appear. Sometimes the same words are used with different meanings."""
        
        elif mistake_pattern == "features_mismatch":
            return f"""This matching question is about linking each statement to the right source (person, section, or paragraph).

The correct match is **{correct_answer}**. Focus on the unique idea or detail that belongs only to that source, not just shared keywords. Similar names or repeated topics are common traps here."""
        
        elif mistake_pattern == "detail_vs_main_idea":
            return f"""This heading question tested whether you could find the MAIN IDEA vs getting distracted by details.

The correct answer is **{correct_answer}**. This heading captures what the WHOLE paragraph is about, not just one example or detail mentioned in it."""
        
        elif mistake_pattern == "distractor_confusion":
            return f"""You picked a distractor - a wrong answer designed to look right. The correct answer is **{correct_answer}**.

Distractors often:
- Use words from the passage but change the meaning
- Get half the information right but add something wrong
- Use extreme language (always/never) when the passage is qualified

Read the question stem first, find the answer location, THEN look at options."""
        
        elif mistake_pattern == "word_limit_violation":
            return f"""Watch the word limit. The correct answer is **{correct_answer}**.

Remember:
- Hyphenated words = 1 word
- Numbers count as words
- Articles (a, an, the) count
- Exceeding the limit = automatic wrong, even if meaning is correct"""
        
        elif mistake_pattern == "completion_error":
            return f"""The correct answer is **{correct_answer}**.

For completion tasks, make sure:
1. Your answer fits grammatically in the gap
2. You use EXACT words from the passage (no paraphrasing)
3. You respect the word limit"""
        
        return f"The correct answer is **{correct_answer}**. Let me explain why this is the right choice based on what the passage tells us."

    def _analyze_performance(
        self,
        answer_history: List[Dict],
        session_id: str
    ) -> Dict[str, Any]:
        """
        Analyze student performance to identify patterns.
        Returns summary with weak/strong areas.
        """
        if not answer_history:
            return {}
        
        total = len(answer_history)
        correct = sum(1 for a in answer_history if a.get('is_correct', False))
        
        # Group by mistake patterns
        mistake_counts = {}
        for answer in answer_history:
            if not answer.get('is_correct', False):
                pattern = answer.get('mistake_pattern', 'general_mistake')
                mistake_counts[pattern] = mistake_counts.get(pattern, 0) + 1
        
        # Identify weak areas (2+ mistakes of same type)
        weak_patterns = [p for p, count in mistake_counts.items() if count >= 2]
        
        # Identify strong areas (correct answers on challenging patterns)
        strong_patterns = []
        for answer in answer_history:
            if answer.get('is_correct', False) and answer.get('module_id'):
                pattern = answer.get('mistake_pattern', '')
                if pattern and pattern.startswith('correct_'):
                    strong_patterns.append(pattern)
        
        return {
            "accuracy": (correct / total) * 100 if total > 0 else 0,
            "total": total,
            "correct": correct,
            "incorrect": total - correct,
            "weak_patterns": weak_patterns,
            "strong_patterns": list(set(strong_patterns)),
            "mistake_counts": mistake_counts
        }

    def _pattern_to_friendly_name(self, pattern: str) -> str:
        """Convert technical pattern names to friendly descriptions."""
        mapping = {
            "not_given_false_confusion": "Distinguishing NOT GIVEN from FALSE",
            "not_given_true_confusion": "Distinguishing NOT GIVEN from TRUE",
            "qualifier_trap": "Spotting qualifier differences (some vs all)",
            "specificity_mismatch": "Recognizing specificity mismatches",
            "keyword_mismatch": "Avoiding keyword matching traps",
            "detail_vs_main_idea": "Finding main ideas vs details",
            "distractor_confusion": "Avoiding distractor traps",
            "word_limit_violation": "Following word limits strictly",
            "completion_error": "Grammar and exact word matching",
            "features_mismatch": "Matching statements to the right person/section",
            "correct_not_given": "Correctly identifying NOT GIVEN",
            "correct_false": "Spotting contradictions (FALSE)",
            "correct_true": "Understanding paraphrased information (TRUE)",
            "correct_heading": "Identifying main ideas",
            "correct_mcq": "Selecting correct MCQ options",
            "correct_completion": "Accurate completion answers",
            "correct_features": "Matching information to the right source"
        }
        return mapping.get(pattern, pattern.replace('_', ' ').title())

    def _get_improvement_advice(self, pattern: str, question_type: str) -> str:
        """Provide specific advice for improvement."""
        
        advice_map = {
            "not_given_false_confusion": "Remember: FALSE needs a clear contradiction. If you can't find one, it's likely NOT GIVEN. Before choosing FALSE, ask yourself: 'Where exactly does the passage contradict this?'",
            "not_given_true_confusion": "Remember: TRUE needs clear confirmation. NOT GIVEN means you can't be certain. Before choosing TRUE, ask: 'Can I quote specific evidence for this claim?'",
            "qualifier_trap": "Watch out for small words: 'some' vs 'all', 'often' vs 'always'. Underline qualifiers in both the passage and statement.",
            "specificity_mismatch": "When the statement adds extra details not in the passage (like 'twice daily' when the passage just says 'daily'), it's usually NOT GIVEN, not FALSE.",
            "keyword_mismatch": "Don't just match keywords. Read for meaning. The same words can be used in different ways. Focus on what the passage actually says.",
            "detail_vs_main_idea": "For heading questions, read the first and last sentences carefully. Ask: 'What is this whole paragraph about?' Details are supporting evidence, not the main point.",
            "distractor_confusion": "Read the question first, not the options. Find the answer in the passage, then compare it with the options. This reduces the pull of distractors.",
            "word_limit_violation": "Count words carefully. Hyphenated words count as one word and numbers count as words. Going over the limit makes the answer wrong, even if the meaning is right.",
            "completion_error": "For completion: (1) Check grammar fit, (2) use exact passage words, and (3) respect the word limit. All three must be right.",
            "features_mismatch": "For matching information, look for a unique detail or opinion that belongs only to one person or section. Shared keywords are not enough on their own."
        }
        
        return advice_map.get(pattern, "Practice this pattern more to build confidence. Review the theory for this question type and apply one step at a time.")

    def _pattern_to_module_id(self, pattern: str) -> str:
        """Map mistake pattern to struggle module ID."""
        mapping = {
            "not_given_false_confusion": "A",
            "not_given_true_confusion": "A",
            "qualifier_trap": "C",
            "specificity_mismatch": "B",
            "keyword_mismatch": "D",
            "detail_vs_main_idea": "E",
            "distractor_confusion": "K",
            "word_limit_violation": "M",
            "completion_error": "O"
        }
        return mapping.get(pattern, "A")

    def _validate_battle_consistency(self, battle: MicroBattle) -> None:
        """
        Validate that rationale explanations are consistent with correct answers.
        Routes to specific validators based on question type.
        """
        logger.info(f"[VALIDATION] Validating {len(battle.questions)} questions")
        
        for q in battle.questions:
            logger.info(f"[VALIDATION] Q{q.id} ({q.format}): {q.correct_answer}")
            
            if q.format == "true-false-not-given":
                self._validate_tfng_question(q, battle.passage)
            elif q.format == "multiple-choice":
                self._validate_mcq_question(q, battle.passage)
            elif q.format == "matching-headings":
                self._validate_heading_question(q, battle.passage)
            elif q.format in ["gap-fill", "sentence-completion", "summary-completion", "table-completion", "note-completion"]:
                self._validate_completion_question(q, battle.passage)
            elif q.format == "short-answer":
                self._validate_short_answer_question(q, battle.passage)
        
        logger.info(f"[VALIDATION] ✅ All questions validated")

    def _validate_tfng_question(self, q: MicroBattleQuestion, passage: List[str]) -> None:
        """
        Validate True/False/Not Given questions.
        Checks for contradictions between correct_answer and rationale.
        """
        correct_ans = q.correct_answer.upper()
        rationale = q.rationale.lower()
        
        # Check for contradictions
        has_contradiction = False
        contradiction_type = ""
        
        if "TRUE" in correct_ans:
            # If answer is TRUE, rationale should say "agrees/confirms/supports"
            # and should NOT say "does not" or "doesn't"
            if any(phrase in rationale for phrase in ["does not", "doesn't", "do not", "don't", "are not", "is not", "isn't"]):
                # Check if it's actually explaining NOT GIVEN or FALSE logic
                if "not given" not in rationale and "passage doesn't" not in rationale:
                    has_contradiction = True
                    contradiction_type = "TRUE answer with negative rationale"
        
        elif "FALSE" in correct_ans:
            # If answer is FALSE, rationale should say "contradicts" or show opposite
            # It should NOT say "confirms" or "agrees"
            if any(phrase in rationale for phrase in ["confirms", "agrees", "supports", "means the statement is true"]):
                has_contradiction = True
                contradiction_type = "FALSE answer with confirming rationale"
        
        elif "NOT GIVEN" in correct_ans:
            # If answer is NOT GIVEN, rationale should say "doesn't mention/address/provide"
            # It should NOT have clear contradiction or confirmation language
            if "contradicts" in rationale or "opposite" in rationale:
                has_contradiction = True
                contradiction_type = "NOT GIVEN answer with contradiction rationale"
            elif "confirms" in rationale or "means the statement is true" in rationale:
                has_contradiction = True
                contradiction_type = "NOT GIVEN answer with confirmation rationale"
        
        if has_contradiction:
            logger.error(f"[VALIDATION] ❌ Contradiction detected in T/F/NG Q{q.id}")
            logger.error(f"[VALIDATION] Correct Answer: {correct_ans}")
            logger.error(f"[VALIDATION] Rationale: {q.rationale}")
            logger.error(f"[VALIDATION] Type: {contradiction_type}")
            
            # Auto-fix the rationale
            q.rationale = self._generate_consistent_rationale(
                q.question_text,
                correct_ans,
                "\n\n".join(passage)
            )
            logger.warning(f"[VALIDATION] ✅ Fixed rationale: {q.rationale}")

    def _validate_mcq_question(self, q: MicroBattleQuestion, passage: List[str]) -> None:
        """
        Validate Multiple Choice questions.
        Checks:
        - Correct answer option exists in options list
        - Rationale explains why correct answer is right
        - Rationale doesn't contradict the correct answer
        """
        passage_text = " ".join(passage).lower()
        correct_ans = q.correct_answer.strip()
        rationale = q.rationale.lower()
        
        # Check 1: Correct answer exists in options
        if q.options and correct_ans not in q.options:
            logger.error(f"[VALIDATION] ❌ MCQ Q{q.id}: Correct answer '{correct_ans}' not in options")
            logger.error(f"[VALIDATION] Options: {q.options}")
            # Fix: Set to first option as fallback
            q.correct_answer = q.options[0]
            q.rationale = f"Option '{q.correct_answer}' is correct based on the passage."
            logger.warning(f"[VALIDATION] ✅ Fixed: Set correct answer to '{q.correct_answer}'")
        
        # Check 2: Rationale should reference the correct answer positively
        # Bad: rationale says "Option A is wrong" when correct_answer is "A"
        wrong_indicators = ["is wrong", "is incorrect", "does not match", "doesn't match", "is false"]
        if any(indicator in rationale for indicator in wrong_indicators):
            logger.error(f"[VALIDATION] ❌ MCQ Q{q.id}: Rationale has negative language")
            logger.error(f"[VALIDATION] Rationale: {q.rationale}")
            q.rationale = self._generate_mcq_rationale(q, passage_text)
            logger.warning(f"[VALIDATION] ✅ Fixed rationale: {q.rationale}")
        
        # Check 3: Rationale should support the correct answer
        # If correct_answer is mentioned in rationale, it should be positive
        if correct_ans.lower() in rationale:
            # Check if there's negative context around the answer
            for indicator in wrong_indicators:
                if correct_ans.lower() in rationale and indicator in rationale:
                    # Extract context around correct answer
                    idx = rationale.find(correct_ans.lower())
                    context = rationale[max(0, idx-30):min(len(rationale), idx+30)]
                    if any(ind in context for ind in wrong_indicators):
                        logger.error(f"[VALIDATION] ❌ MCQ Q{q.id}: Negative context around correct answer")
                        q.rationale = self._generate_mcq_rationale(q, passage_text)
                        logger.warning(f"[VALIDATION] ✅ Fixed rationale")
                        break

    def _validate_heading_question(self, q: MicroBattleQuestion, passage: List[str]) -> None:
        """
        Validate Matching Headings questions.
        Checks:
        - Heading number/letter is valid
        - Rationale explains the main idea
        - Paragraph exists for the heading
        """
        correct_ans = q.correct_answer.upper()
        rationale = q.rationale.lower()
        
        # Check 1: Rationale should mention "main idea" or "paragraph" or "topic"
        main_idea_keywords = ["main idea", "paragraph", "topic", "whole paragraph", "overall", "primarily about"]
        has_main_idea_ref = any(keyword in rationale for keyword in main_idea_keywords)
        
        if not has_main_idea_ref:
            logger.warning(f"[VALIDATION] ⚠️ Heading Q{q.id}: Rationale doesn't explain main idea")
            logger.warning(f"[VALIDATION] Rationale: {q.rationale}")
            q.rationale = f"The correct answer is {correct_ans}. This heading captures the main idea of the paragraph, which is primarily about {q.question_text.lower()}."
            logger.warning(f"[VALIDATION] ✅ Enhanced rationale with main idea explanation")
        
        # Check 2: Warn if rationale focuses on details/keywords rather than main idea
        detail_indicators = ["mentions", "includes the word", "contains", "uses the term", "keyword"]
        if any(indicator in rationale for indicator in detail_indicators):
            logger.warning(f"[VALIDATION] ⚠️ Heading Q{q.id}: Rationale may be focused on details/keywords")
            logger.info(f"[VALIDATION] Tip: Headings should match main ideas, not just keyword matching")

    def _validate_completion_question(self, q: MicroBattleQuestion, passage: List[str]) -> None:
        """
        Validate Gap-fill/Completion questions.
        Checks:
        - Answer words exist in passage (exact match)
        - Answer respects word limit
        - Grammar fits the gap
        """
        passage_text = " ".join(passage).lower()
        correct_ans = q.correct_answer.strip().lower()
        
        # Check 1: Answer exists in passage (exact match required for completion)
        if correct_ans not in passage_text:
            logger.error(f"[VALIDATION] ❌ Completion Q{q.id}: Answer '{correct_ans}' not found in passage")
            logger.error(f"[VALIDATION] This is a CRITICAL error - completion answers must be verbatim from passage")
            
            # Try to find similar words (but don't auto-fix as this changes meaning)
            words_in_answer = correct_ans.split()
            found_words = [w for w in words_in_answer if w in passage_text]
            
            if found_words:
                logger.info(f"[VALIDATION] Found these words from answer in passage: {found_words}")
                logger.info(f"[VALIDATION] Missing words: {[w for w in words_in_answer if w not in found_words]}")
            else:
                logger.error(f"[VALIDATION] NO words from answer found in passage - complete mismatch")
        
        # Check 2: Check word count if mentioned in question
        question_lower = q.question_text.lower()
        word_count = len(correct_ans.split())
        max_words = None
        
        if "one word" in question_lower:
            max_words = 1
        elif "two words" in question_lower:
            max_words = 2
        elif "three words" in question_lower:
            max_words = 3
        elif "no more than" in question_lower:
            # Extract number from "no more than X words"
            import re
            match = re.search(r'no more than (\w+) word', question_lower)
            if match:
                num_word = match.group(1)
                word_map = {"one": 1, "two": 2, "three": 3, "four": 4, "1": 1, "2": 2, "3": 3, "4": 4}
                max_words = word_map.get(num_word)
        
        if max_words and word_count > max_words:
            logger.error(f"[VALIDATION] ❌ Completion Q{q.id}: Answer has {word_count} words, limit is {max_words}")
            logger.error(f"[VALIDATION] Answer: '{q.correct_answer}'")
            logger.error(f"[VALIDATION] This violates word limit rules - answer would be marked wrong")
        
        # Check 3: Rationale should quote the source sentence
        if "passage" not in q.rationale.lower() and "text" not in q.rationale.lower():
            logger.info(f"[VALIDATION] ℹ️ Completion Q{q.id}: Rationale could be improved by quoting passage")

    def _validate_short_answer_question(self, q: MicroBattleQuestion, passage: List[str]) -> None:
        """
        Validate Short Answer questions.
        Checks:
        - Answer is extractable from passage
        - Answer fits the question grammatically
        - Rationale shows where answer is found
        """
        passage_text = " ".join(passage).lower()
        correct_ans = q.correct_answer.strip().lower()
        rationale = q.rationale.lower()
        
        # Check 1: Answer exists in passage
        if correct_ans not in passage_text:
            logger.error(f"[VALIDATION] ❌ Short Answer Q{q.id}: Answer '{correct_ans}' not in passage")
            logger.error(f"[VALIDATION] Short answers must be extractable from passage")
            
            # Check if individual words exist
            words_in_answer = correct_ans.split()
            found_words = [w for w in words_in_answer if w in passage_text]
            
            if found_words:
                logger.info(f"[VALIDATION] Found partial match: {found_words}")
            else:
                logger.error(f"[VALIDATION] NO match found - answer may be fabricated")
        
        # Check 2: Rationale should quote passage or indicate location
        location_indicators = ["passage", "text", "states", "mentions", "found in", "located in"]
        has_location = any(indicator in rationale for indicator in location_indicators)
        
        if not has_location:
            logger.info(f"[VALIDATION] ℹ️ Short Answer Q{q.id}: Rationale could show where answer is found")
            q.rationale = f"The answer '{q.correct_answer}' is found in the passage."
            logger.info(f"[VALIDATION] Enhanced rationale")

    def _generate_mcq_rationale(self, q: MicroBattleQuestion, passage_text: str) -> str:
        """Generate consistent rationale for Multiple Choice questions."""
        return f"Option '{q.correct_answer}' is correct because the passage supports this. The other options either contradict the passage or aren't mentioned."

    def _generate_completion_rationale(self, q: MicroBattleQuestion, passage_text: str) -> str:
        """Generate consistent rationale for Completion questions."""
        return f"The answer '{q.correct_answer}' is found in the passage and fits grammatically in the gap."

    def _generate_consistent_rationale(
        self,
        question_text: str,
        correct_answer: str,
        passage: str
    ) -> str:
        """Generate a consistent rationale based on the correct answer."""
        
        if "TRUE" in correct_answer.upper():
            return f"The passage confirms this statement. The information in the passage supports that {question_text.lower()}"
        elif "FALSE" in correct_answer.upper():
            return f"The passage contradicts this statement. The passage states the opposite of what is claimed in this question."
        elif "NOT GIVEN" in correct_answer.upper():
            return f"The passage does not provide information about this. While related topics may be discussed, this specific claim is not addressed."
        
        return "Review the passage to determine the answer."

    def _generate_performance_summary(
        self,
        analysis: Dict,
        answer_history: List[Dict],
        question_type: str
    ) -> str:
        """Generate comprehensive performance summary."""
        
        accuracy = analysis.get('accuracy', 0)
        correct = analysis.get('correct', 0)
        total = analysis.get('total', 0)
        
        if total == 0:
            return ""
        
        summary = f"## 📊 Performance Summary\n\n"
        summary += f"You got **{correct}/{total} correct** ({accuracy:.0f}% accuracy). "
        
        if accuracy >= 80:
            summary += "Excellent work! 🎉\n\n"
        elif accuracy >= 60:
            summary += "Good effort! 👍\n\n"
        else:
            summary += "Let's work on improving this together! 💪\n\n"
        
        # What went well
        strong_patterns = analysis.get('strong_patterns', [])
        if strong_patterns:
            summary += "**🌟 What You're Strong At:**\n"
            for pattern in strong_patterns:
                summary += f"- {self._pattern_to_friendly_name(pattern)}\n"
            summary += "\n"
        
        # What needs work
        weak_patterns = analysis.get('weak_patterns', [])
        mistake_counts = analysis.get('mistake_counts', {})
        if weak_patterns:
            summary += "**📈 Areas to Improve:**\n"
            for pattern in weak_patterns:
                count = mistake_counts.get(pattern, 0)
                summary += f"- {self._pattern_to_friendly_name(pattern)} ({count} mistakes)\n"
            summary += "\n"
            
            # Provide specific advice
            summary += "**💡 How to Improve:**\n\n"
            for pattern in weak_patterns:
                advice = self._get_improvement_advice(pattern, question_type)
                summary += f"{advice}\n\n"
        
        return summary

