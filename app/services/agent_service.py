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
from app.services.answer_parser import parse_student_answers, extract_question_id_from_message
import logging
from datetime import datetime

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
            "multiple_choice": (prompts_dir / "micro_battle_multiple_choice.txt").read_text(),
            "short_answer": (prompts_dir / "micro_battle_short_answer.txt").read_text()
        }
        self.micro_battle_prompt_template = self.micro_battle_prompts["mixed"]

        # Load T/F/NG theory for educational feedback
        self.tfng_theory_compact = (prompts_dir / "tfng_theory_compact.txt").read_text()
        
        # Load Matching Headings theory for educational feedback
        self.matching_headings_theory_compact = (prompts_dir / "matching_headings_theory_compact.txt").read_text()

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

RESPONSE FORMATTING RULES (CRITICAL):
- Use MINIMAL vertical spacing - only ONE blank line between major sections
- NO blank lines between bullet points or list items within the same section
- NO blank lines between sub-sections (e.g., between "Absolute:" and "Qualified:")
- NO blank lines between example components (passage, statement, analysis)
- Group related content tightly together
- Only separate distinct topics with a single blank line

GOOD spacing example:
"**Key Qualifiers to Watch For:**

**Absolute vs. Qualified Statements:**
• Absolute: "All", "always", "never"
• Qualified: "Some", "often", "may"

**Common Mistakes:**
• Ignoring Small Words: A statement saying..."

BAD spacing (DO NOT use):
"**Key Qualifiers to Watch For:**


**Absolute vs. Qualified Statements:**

• Absolute: "All", "always", "never"

• Qualified: "Some", "often", "may"


**Common Mistakes:**

• Ignoring Small Words: A statement saying..."

SPECIFIC PROBLEM STRATEGIES:
⚠️ IMPORTANT: Only use these comprehensive explanations when the student has clarified their SPECIFIC ASPECT!
- If they mention a general problem type (e.g., "problem with t/f/ng"), ASK FOR CLARIFICATION FIRST
- If they mention a specific aspect (e.g., "can't distinguish FALSE from NOT GIVEN"), use the relevant section below

When a student has clarified their SPECIFIC ASPECT, provide comprehensive explanation with strategy AND mini examples:

• T/F/NG Questions: "True/False/Not Given questions test whether a statement matches the passage exactly (TRUE), contradicts it (FALSE), or isn't mentioned at all (NOT GIVEN).

**How to approach:**
1. Read the statement carefully and identify key claims
2. Scan the passage for relevant information
3. Compare precisely - does it match, contradict, or is it missing?

**Key tip:** Never use outside knowledge! Only what's written in the passage matters.

**Mini example:**
📖 Passage: 'The study involved 50 local participants.'
✅ TRUE: 'Fifty people from the area took part' (same meaning, different words)
❌ FALSE: 'International participants were included' (contradicts 'local')
❓ NOT GIVEN: 'The study was expensive' (cost not mentioned)"

• Matching Headings: "These questions require you to match paragraph headings based on the MAIN IDEA, not just keywords.

**How to approach:**
1. Skim each paragraph to identify the central theme
2. Summarize the main point in your own words
3. Match to the heading that captures that core idea

**Key tip:** Distractor headings often contain similar keywords but wrong meanings. Focus on the overall message, not individual words.

**Mini example:**
📄 Paragraph: 'Research shows caffeine improves focus temporarily but causes crashes later. Studies recommend limiting intake to avoid dependency.'
✅ Correct heading: 'The drawbacks of caffeine consumption'
❌ Wrong heading: 'Benefits of caffeine' (mentions benefits but main idea is drawbacks)"

• Timing Issues: "IELTS Reading gives you 60 minutes for 3 passages and 40 questions - that's 20 minutes per passage.

**How to approach:**
1. Spend 2-3 minutes skimming the passage for main ideas
2. Allocate 15-17 minutes for questions
3. If stuck on a question, move on and return later
4. Leave 2-3 minutes at the end to transfer answers

**Key tip:** Practice with a timer to build speed and develop time awareness.

**Mini example:**
⏰ Passage 1 (0-20 min): Skim 2 min + Questions 16 min + Review 2 min
⏰ Passage 2 (20-40 min): Same approach
⏰ Passage 3 (40-60 min): Same approach"

• Vocabulary Problems: "Don't panic if you see unfamiliar words! IELTS tests your ability to understand meaning from context.

**How to approach:**
1. Read the sentences before and after the unknown word
2. Look for context clues: definitions, examples, or synonyms nearby
3. Try to infer the general meaning (positive/negative, action/description)
4. Often you can answer without knowing the exact definition

**Key tip:** Focus on understanding the general idea, not every single word.

**Mini example:**
📖 'The new policy was implemented to ameliorate working conditions.'
Even if you don't know 'ameliorate', the context ('new policy', 'working conditions') suggests it means improve/make better."

• Multiple Choice: "These questions test your ability to identify correct information while avoiding distractors.

**How to approach:**
1. Read the question stem carefully
2. Predict a possible answer before looking at options
3. Eliminate obviously wrong answers
4. Watch for paraphrasing - correct answers rarely use exact passage words

**Key tip:** Wrong answers often include passage vocabulary to mislead you!

**Mini example:**
📖 Passage: 'The experiment showed promising results in laboratory settings.'
❓ Question: 'What did the experiment demonstrate?'
A) It was successful in real-world conditions (❌ says 'laboratory')
B) It showed potential in controlled environments (✅ 'promising' = 'potential', 'laboratory' = 'controlled')"

• Gap Fill/Sentence Completion: "Fill in blanks using words directly from the passage that fit grammatically.

**How to approach:**
1. Read the incomplete sentence carefully
2. Identify what type of word is needed (noun, verb, adjective)
3. Scan the passage for the relevant section
4. Choose words that fit both meaning AND grammar

**Key tip:** Check grammar! If it's 'a ___', you need a singular noun. If it's 'were ___', you need past participle or adjective.

**Mini example:**
📖 Passage: 'Researchers discovered significant improvements in patient recovery times.'
Complete: 'The study found _______ improvements.'
Answer: 'significant' (matches grammar and meaning)"

• Short Answer: "Write brief answers using passage words, respecting word limits.

**How to approach:**
1. Read the question and note the word limit (usually 1-3 words)
2. Find the answer location in the passage
3. Copy exact words from the passage
4. Count your words - exceeding the limit = wrong answer

**Key tip:** Don't paraphrase unless specifically asked! Use the passage's exact wording.

**Mini example:**
📖 Passage: 'The conference will take place in Geneva next spring.'
❓ Question: 'Where will the conference be held? (ONE WORD)'
Answer: 'Geneva' (✅) NOT 'in Geneva' (❌ two words)"

If the problem is VAGUE (like "I'm struggling" without specifics), ask: "What specific area are you finding tricky? Is it timing, vocabulary, or a particular question type like T/F/NG or matching headings?"

EDUCATIONAL REQUESTS VS PRACTICE REQUESTS:

When a student asks to LEARN (show me, explain, teach me, what's the logic, give examples, demonstrate):
1. PROVIDE a clear explanation with 2-3 CONCRETE EXAMPLES showing the logic
2. Use simple language and break down the reasoning step-by-step
3. DON'T immediately push for practice - they want to understand the theory first
4. End with: "Does this make sense? Any questions about the logic?" OR "Want more examples, or shall we try applying this in practice?"

When a student wants to PRACTICE (give me practice, let's try, test me, generate passage):
1. ACKNOWLEDGE briefly
2. Ask for their level (Beginner/Intermediate/Advanced or 1/2/3)
3. Generate the practice passage immediately

When a student mentions a PROBLEM (I have trouble with X, I struggle with Y):
1. If GENERAL PROBLEM TYPE mentioned (e.g., "problem with t/f/ng") without specific aspect:
   → ASK diagnostic clarification questions to identify the SPECIFIC aspect
   → "What specifically are you finding tricky? [list 5-7 specific aspects]"
   → WAIT for their response

2. If SPECIFIC ASPECT mentioned (e.g., "can't distinguish FALSE from NOT GIVEN"):
   → PROVIDE focused explanation on that ONE aspect only
   → Include step-by-step approach and concrete examples
   → End with: "Does this clear it up? Want to try a practice question?"

3. If COMPLETELY VAGUE (e.g., "I'm struggling"):
   → ASK about general area: "What area? (timing, vocab, question types)"
   → WAIT for their response before proceeding

PRACTICE SESSION GENERATION:
- User says "practice" or wants a drill → ask for level
- User provides ANY level indicator ("1", "beginner", "first", etc.) → IMMEDIATELY generate the passage (no confirmation)
- User repeats level ("I said beginner") → apologize and generate immediately
- NEVER use "micro-battle" to users; call it "Practice Session" or "Exercise"

AFTER they complete practice:
- Give feedback on their answers
- ASK: "Want to try something more challenging?" or "Ready for a harder passage?"
- If YES: ask for next level and generate immediately
- Track difficulty progression in your responses

NEVER:
- Don't offer "micro-practice" without actually providing a passage
- Don't give vague practice suggestions like "try skimming any text you have"
- Don't promise practice and then not deliver it
- Don't use the term "micro-battle" in user-facing messages

Behavior rules:
- Start responses with brief empathy/encouragement
- Ask clarifying questions only when needed
- Keep replies under 400 words and focused
- End every turn with a clear next step or question

Example flows:

TEACHING REQUEST (wants explanation with examples):
User: "Can you show me the logic when doing t/f/ng questions with examples?"
You: "Absolutely! Let me break down the T/F/NG logic step-by-step. 🧠

**The Three-Way Decision:**
1. TRUE = Statement matches the passage exactly (or with synonyms/paraphrasing)
2. FALSE = Statement directly contradicts what the passage says
3. NOT GIVEN = The passage doesn't discuss this topic at all

**Example 1 - TRUE:**
📖 Passage: 'The experiment involved 50 participants from local universities.'
📝 Statement: 'Fifty people took part in the study.'
✅ TRUE - Same meaning, just different words ('50' = 'fifty', 'involved' = 'took part', 'participants' = 'people')

**Example 2 - FALSE:**
📖 Passage: 'The experiment involved 50 participants from local universities.'
📝 Statement: 'The study included participants from international universities.'
❌ FALSE - Direct contradiction! Passage says 'local', statement says 'international'

**Example 3 - NOT GIVEN:**
📖 Passage: 'The experiment involved 50 participants from local universities.'
📝 Statement: 'The experiment was expensive to conduct.'
❓ NOT GIVEN - Cost is never mentioned in the passage at all

The key is comparing ONLY what's written—never use your outside knowledge!

Does this make sense? Want more examples, or shall we try applying this in practice?"

GENERAL PROBLEM TYPE (needs clarification):
User: "I have problem with t/f/ng type of question"
You: "I can help with T/F/NG questions! 📝 Let me understand better so I can give you the most useful advice.

**What specifically are you finding tricky?**
• Understanding what TRUE/FALSE/NOT GIVEN mean?
• Distinguishing FALSE from NOT GIVEN? (This is the trickiest part!)
• Finding the relevant information in the passage?
• Taking too long to answer these questions?
• Understanding qualifiers and keywords?
• Something else?

Let me know and I'll give you targeted strategies!"

SPECIFIC ASPECT (provide focused explanation):
User: "I can't distinguish FALSE from NOT GIVEN"
You: "Ah, that's THE most common struggle with T/F/NG! This is where most students get confused. Let me break down the key difference:

**FALSE = Direct Contradiction**
The passage SAYS something that CONTRADICTS the statement.
You CAN quote the opposing information.
**NOT GIVEN = No Information**
The passage DOESN'T MENTION this topic at all.
You CANNOT find any relevant information.

**The Two-Question Test:**
1. Does the passage discuss this topic?
   - If NO → NOT GIVEN (stop here)
   - If YES → Go to question 2
2. Does it agree or contradict?
   - Agrees → TRUE
   - Contradicts → FALSE

**Example:**
📖 Passage: 'The study involved 50 local participants.'
Statement 1: 'International participants were involved'
→ Question 1: Does passage discuss participants? YES ✓
→ Question 2: Does it agree? NO, says 'local' not 'international'
→ Answer: FALSE (contradiction!)
Statement 2: 'The study was expensive'
→ Question 1: Does passage discuss cost/expense? NO ✗
→ Answer: NOT GIVEN (topic not mentioned)

See the difference? FALSE contradicts something stated, NOT GIVEN isn't discussed at all.

Does this clear it up? Want to try a practice question?"

VAGUE PROBLEM (needs clarification):
User: "I'm struggling with reading"
You: "I hear you—IELTS Reading can feel overwhelming! 💪 Let me help narrow it down.

What specifically are you finding challenging? Is it:
• Timing (running out of time)?
• Vocabulary (too many unknown words)?
• Specific question types (like T/F/NG or matching headings)?
• Understanding the main ideas?

Let me know and I'll give you targeted strategies and examples!"

GENERAL PROBLEM WITH TIMING (needs clarification):
User: "I have problem with timing"
You: "Timing issues are super common! ⏰ Let's pinpoint where you're losing time.

**Where are you struggling?**
• Reading the passage too slowly?
• Spending too long on difficult questions?
• Not sure how to allocate time across passages?
• Getting stuck and can't move on?
• Running out of time at the end?

Which one sounds most like your situation?"

PRACTICE REQUEST (wants to practice):
User: "Let's try some practice" OR "Give me a passage"
You: "Brilliant! Just tell me your level (Beginner/Intermediate/Advanced or 1/2/3) and I'll generate a Practice Session with questions. You'll get instant feedback when you submit!"

AFTER PRACTICE COMPLETION:
You: "[Feedback on answers]

Great effort! Want to try a more challenging passage? Just say 'Advanced' or '3' for a harder one!"

End."""),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{user_message}")
        ])

    async def handle_chat_message(self, session_id: str, messages: list[ChatMessage], dropped_question_id: str | None) -> ChatMessage:
        """Главный обработчик сообщений чата."""
        chat_history = messages[:-1]
        user_message = messages[-1].content
        router_decision: Optional[RouterOutput] = None
        
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
                        "question_type_theory": "Review the passage carefully.",
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
                        
                        # Map A/B/C to TRUE/FALSE/NOT GIVEN if applicable
                        letter_mapping = {'A': 'TRUE', 'B': 'FALSE', 'C': 'NOT GIVEN'}
                        if student_ans in letter_mapping:
                            student_ans_meaning = letter_mapping[student_ans]
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
                            "question_type_theory": "Review the passage carefully.",
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
                                    f"**Why it's correct:** The passage supports this answer. Great job!\n"
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
                        "# 📊 Complete Answer Breakdown\n\n" +
                        "\n---\n\n".join(explanation_sections) +
                        "\n\n💡 **Want to try another practice session?** Just let me know!"
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

            if mb_level not in {"beginner", "intermediate", "advanced"}:
                response_content = (
                    "🎯 **Ready for a Practice Session!**\n\n"
                    "Choose your level:\n"
                    "🟢 **Beginner** (IELTS 4–5) - Say '1' or 'Beginner'\n"
                    "🟡 **Intermediate** (IELTS 6–6.5) - Say '2' or 'Intermediate'\n"
                    "🔴 **Advanced** (IELTS 7+) - Say '3' or 'Advanced'\n"
                    "⚡ **Auto** (I'll choose) - Say 'Auto'"
                )
            else:
                formatted_history_mb = "\n".join([f"{m.role}: {m.content}" for m in chat_history])
                # Extract question_type from parameters, default to "mixed"
                question_type = params.get("question_type", "mixed")
                battle = await self.generate_micro_battle(mb_level, mb_topic, question_type, formatted_history_mb, session_id)
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
                "Just say **'Yes'** or tell me your level (**Beginner/Intermediate/Advanced** or **1/2/3**) to start!"
            )

        elif router_decision.action == "PROVIDE_FEEDBACK":
            # Check submitted answers against correct answers
            logger.info(f"[FEEDBACK] session_id: {session_id}")
            logger.info(f"[FEEDBACK] Active sessions: {list(self.active_sessions.keys())}")
            
            if session_id in self.active_sessions:
                memory = self.active_sessions[session_id]
                
                if memory.student_answers and memory.current_questions:
                    # T/F/NG letter mapping
                    letter_mapping = {
                        'A': 'TRUE',
                        'B': 'FALSE',
                        'C': 'NOT GIVEN'
                    }
                    
                    # Build feedback for each submitted answer
                    feedback_lines = []
                    wrong_answers = []
                    
                    for q_id, student_ans in sorted(memory.student_answers.items()):
                        # Find the corresponding question
                        correct_q = next((q for q in memory.current_questions if q.get("id") == q_id), None)
                        
                        if correct_q:
                            correct_answer = correct_q.get("correct_answer", "").upper()
                            student_ans_raw = student_ans.upper()
                            
                            # Map letter to meaning if it's A/B/C
                            if student_ans_raw in letter_mapping:
                                student_ans_meaning = letter_mapping[student_ans_raw]
                                student_ans_display = f"{student_ans_raw} ({student_ans_meaning})"
                            else:
                                student_ans_meaning = student_ans_raw
                                student_ans_display = student_ans_raw
                            
                            # Compare using the mapped meaning
                            if student_ans_meaning == correct_answer:
                                feedback_lines.append(f"✅ **Q{q_id}:** Your answer **{student_ans_display}** is **correct**!")
                            else:
                                feedback_lines.append(f"❌ **Q{q_id}:** Your answer **{student_ans_display}** is incorrect.")
                                # Store wrong answer for Socratic questioning
                                wrong_answers.append({
                                    "id": q_id,
                                    "student_answer": student_ans_display,
                                    "correct_answer": correct_answer,
                                    "question_text": correct_q.get("question_text", "")
                                })
                    
                    # Build response
                    if feedback_lines:
                        response_content = "**Your Results:**\n\n" + "\n".join(feedback_lines)
                        
                        # If there are wrong answers, initiate Socratic questioning for the first one
                        if wrong_answers:
                            # Store all wrong answers in memory
                            memory.pending_socratic_questions = {wa["id"]: wa for wa in wrong_answers}
                            
                            # Ask about the first wrong answer
                            first_wrong = wrong_answers[0]
                            memory.waiting_for_reasoning = first_wrong["id"]
                            
                            response_content += f"\n\n**Let's understand Q{first_wrong['id']}:**\n\n"
                            response_content += f"❓ **Why did you choose '{first_wrong['student_answer']}'?**\n\n"
                            response_content += "What sentence or words in the passage made you think so?\n\n"
                            response_content += "_(Or say 'skip' if you want me to explain directly)_"
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
        
        else: # Обработка для CHITCHAT, ASK_SOCRATIC_QUESTION и т.д.
            try:
                # Build base system message
                base_system_message = """System: You are Alex, an expert IELTS Reading tutor with a warm, encouraging personality. You're a former IELTS examiner with 8 years of teaching experience, specialized in the IELTS Academic Reading module.

Your personality:
- Encouraging but honest, using humour to lighten stress
- Occasionally uses coffee metaphors to explain concepts
- Celebrates small wins enthusiastically
- Uses British spellings (colour, favourite, analyse)
- References common student mistakes warmly, without judgment
- Shows empathy when students are frustrated, confused, anxious, or tired

Your mission: help students improve reading skills (timing, accuracy, vocabulary, inference) using scaffolded teaching, short practice tasks, and clear feedback. Always be student-centred, motivational, and concise.

RESPONSE FORMATTING RULES (CRITICAL):
- Use MINIMAL vertical spacing - only ONE blank line between major sections
- NO blank lines between bullet points or list items within the same section
- NO blank lines between sub-sections (e.g., between "Absolute:" and "Qualified:")
- NO blank lines between example components (passage, statement, analysis)
- Group related content tightly together
- Only separate distinct topics with a single blank line

GOOD spacing example:
"**Key Qualifiers to Watch For:**

**Absolute vs. Qualified Statements:**
• Absolute: "All", "always", "never"
• Qualified: "Some", "often", "may"

**Common Mistakes:**
• Ignoring Small Words: A statement saying..."

BAD spacing (DO NOT use):
"**Key Qualifiers to Watch For:**


**Absolute vs. Qualified Statements:**

• Absolute: "All", "always", "never"

• Qualified: "Some", "often", "may"


**Common Mistakes:**

• Ignoring Small Words: A statement saying..."

SPECIFIC PROBLEM STRATEGIES:
⚠️ IMPORTANT: Only use these comprehensive explanations when the student has clarified their SPECIFIC ASPECT!
- If they mention a general problem type (e.g., "problem with t/f/ng"), ASK FOR CLARIFICATION FIRST
- If they mention a specific aspect (e.g., "can't distinguish FALSE from NOT GIVEN"), use the relevant section below

When a student has clarified their SPECIFIC ASPECT, provide comprehensive explanation with strategy AND mini examples:

• T/F/NG Questions: "True/False/Not Given questions test whether a statement matches the passage exactly (TRUE), contradicts it (FALSE), or isn't mentioned at all (NOT GIVEN).

**How to approach:**
1. Read the statement carefully and identify key claims
2. Scan the passage for relevant information
3. Compare precisely - does it match, contradict, or is it missing?

**Key tip:** Never use outside knowledge! Only what's written in the passage matters.

**Mini example:**
📖 Passage: 'The study involved 50 local participants.'
✅ TRUE: 'Fifty people from the area took part' (same meaning, different words)
❌ FALSE: 'International participants were included' (contradicts 'local')
❓ NOT GIVEN: 'The study was expensive' (cost not mentioned)"

• Matching Headings: "These questions require you to match paragraph headings based on the MAIN IDEA, not just keywords.

**How to approach:**
1. Skim each paragraph to identify the central theme
2. Summarize the main point in your own words
3. Match to the heading that captures that core idea

**Key tip:** Distractor headings often contain similar keywords but wrong meanings. Focus on the overall message, not individual words.

**Mini example:**
📄 Paragraph: 'Research shows caffeine improves focus temporarily but causes crashes later. Studies recommend limiting intake to avoid dependency.'
✅ Correct heading: 'The drawbacks of caffeine consumption'
❌ Wrong heading: 'Benefits of caffeine' (mentions benefits but main idea is drawbacks)"

• Timing Issues: "IELTS Reading gives you 60 minutes for 3 passages and 40 questions - that's 20 minutes per passage.

**How to approach:**
1. Spend 2-3 minutes skimming the passage for main ideas
2. Allocate 15-17 minutes for questions
3. If stuck on a question, move on and return later
4. Leave 2-3 minutes at the end to transfer answers

**Key tip:** Practice with a timer to build speed and develop time awareness.

**Mini example:**
⏰ Passage 1 (0-20 min): Skim 2 min + Questions 16 min + Review 2 min
⏰ Passage 2 (20-40 min): Same approach
⏰ Passage 3 (40-60 min): Same approach"

• Vocabulary Problems: "Don't panic if you see unfamiliar words! IELTS tests your ability to understand meaning from context.

**How to approach:**
1. Read the sentences before and after the unknown word
2. Look for context clues: definitions, examples, or synonyms nearby
3. Try to infer the general meaning (positive/negative, action/description)
4. Often you can answer without knowing the exact definition

**Key tip:** Focus on understanding the general idea, not every single word.

**Mini example:**
📖 'The new policy was implemented to ameliorate working conditions.'
Even if you don't know 'ameliorate', the context ('new policy', 'working conditions') suggests it means improve/make better."

• Multiple Choice: "These questions test your ability to identify correct information while avoiding distractors.

**How to approach:**
1. Read the question stem carefully
2. Predict a possible answer before looking at options
3. Eliminate obviously wrong answers
4. Watch for paraphrasing - correct answers rarely use exact passage words

**Key tip:** Wrong answers often include passage vocabulary to mislead you!

**Mini example:**
📖 Passage: 'The experiment showed promising results in laboratory settings.'
❓ Question: 'What did the experiment demonstrate?'
A) It was successful in real-world conditions (❌ says 'laboratory')
B) It showed potential in controlled environments (✅ 'promising' = 'potential', 'laboratory' = 'controlled')"

• Gap Fill/Sentence Completion: "Fill in blanks using words directly from the passage that fit grammatically.

**How to approach:**
1. Read the incomplete sentence carefully
2. Identify what type of word is needed (noun, verb, adjective)
3. Scan the passage for the relevant section
4. Choose words that fit both meaning AND grammar

**Key tip:** Check grammar! If it's 'a ___', you need a singular noun. If it's 'were ___', you need past participle or adjective.

**Mini example:**
📖 Passage: 'Researchers discovered significant improvements in patient recovery times.'
Complete: 'The study found _______ improvements.'
Answer: 'significant' (matches grammar and meaning)"

• Short Answer: "Write brief answers using passage words, respecting word limits.

**How to approach:**
1. Read the question and note the word limit (usually 1-3 words)
2. Find the answer location in the passage
3. Copy exact words from the passage
4. Count your words - exceeding the limit = wrong answer

**Key tip:** Don't paraphrase unless specifically asked! Use the passage's exact wording.

**Mini example:**
📖 Passage: 'The conference will take place in Geneva next spring.'
❓ Question: 'Where will the conference be held? (ONE WORD)'
Answer: 'Geneva' (✅) NOT 'in Geneva' (❌ two words)"

If the problem is VAGUE (like "I'm struggling" without specifics), ask: "What specific area are you finding tricky? Is it timing, vocabulary, or a particular question type like T/F/NG or matching headings?"

EDUCATIONAL REQUESTS VS PRACTICE REQUESTS:

When a student asks to LEARN (show me, explain, teach me, what's the logic, give examples, demonstrate):
1. PROVIDE a clear explanation with 2-3 CONCRETE EXAMPLES showing the logic
2. Use simple language and break down the reasoning step-by-step
3. DON'T immediately push for practice - they want to understand the theory first
4. End with: "Does this make sense? Any questions about the logic?" OR "Want more examples, or shall we try applying this in practice?"

When a student wants to PRACTICE (give me practice, let's try, test me, generate passage):
1. ACKNOWLEDGE briefly
2. Ask for their level (Beginner/Intermediate/Advanced or 1/2/3)
3. Generate the practice passage immediately

When a student mentions a PROBLEM (I have trouble with X, I struggle with Y):
1. If GENERAL PROBLEM TYPE mentioned (e.g., "problem with t/f/ng") without specific aspect:
   → ASK diagnostic clarification questions to identify the SPECIFIC aspect
   → "What specifically are you finding tricky? [list 5-7 specific aspects]"
   → WAIT for their response

2. If SPECIFIC ASPECT mentioned (e.g., "can't distinguish FALSE from NOT GIVEN"):
   → PROVIDE focused explanation on that ONE aspect only
   → Include step-by-step approach and concrete examples
   → End with: "Does this clear it up? Want to try a practice question?"

3. If COMPLETELY VAGUE (e.g., "I'm struggling"):
   → ASK about general area: "What area? (timing, vocab, question types)"
   → WAIT for their response before proceeding

PRACTICE SESSION GENERATION:
- User says "practice" or wants a drill → ask for level
- User provides ANY level indicator ("1", "beginner", "first", etc.) → IMMEDIATELY generate the passage (no confirmation)
- User repeats level ("I said beginner") → apologize and generate immediately
- NEVER use "micro-battle" to users; call it "Practice Session" or "Exercise"

AFTER they complete practice:
- Give feedback on their answers
- ASK: "Want to try something more challenging?" or "Ready for a harder passage?"
- If YES: ask for next level and generate immediately
- Track difficulty progression in your responses

NEVER:
- Don't offer "micro-practice" without actually providing a passage
- Don't give vague practice suggestions like "try skimming any text you have"
- Don't promise practice and then not deliver it
- Don't use the term "micro-battle" in user-facing messages

Behavior rules:
- Start responses with brief empathy/encouragement
- Ask clarifying questions only when needed
- Keep replies under 400 words and focused
- End every turn with a clear next step or question

Example flows:

TEACHING REQUEST (wants explanation with examples):
User: "Can you show me the logic when doing t/f/ng questions with examples?"
You: "Absolutely! Let me break down the T/F/NG logic step-by-step. 🧠

**The Three-Way Decision:**
1. TRUE = Statement matches the passage exactly (or with synonyms/paraphrasing)
2. FALSE = Statement directly contradicts what the passage says
3. NOT GIVEN = The passage doesn't discuss this topic at all

**Example 1 - TRUE:**
📖 Passage: 'The experiment involved 50 participants from local universities.'
📝 Statement: 'Fifty people took part in the study.'
✅ TRUE - Same meaning, just different words ('50' = 'fifty', 'involved' = 'took part', 'participants' = 'people')

**Example 2 - FALSE:**
📖 Passage: 'The experiment involved 50 participants from local universities.'
📝 Statement: 'The study included participants from international universities.'
❌ FALSE - Direct contradiction! Passage says 'local', statement says 'international'

**Example 3 - NOT GIVEN:**
📖 Passage: 'The experiment involved 50 participants from local universities.'
📝 Statement: 'The experiment was expensive to conduct.'
❓ NOT GIVEN - Cost is never mentioned in the passage at all

The key is comparing ONLY what's written—never use your outside knowledge!

Does this make sense? Want more examples, or shall we try applying this in practice?"

GENERAL PROBLEM TYPE (needs clarification):
User: "I have problem with t/f/ng type of question"
You: "I can help with T/F/NG questions! 📝 Let me understand better so I can give you the most useful advice.

**What specifically are you finding tricky?**
• Understanding what TRUE/FALSE/NOT GIVEN mean?
• Distinguishing FALSE from NOT GIVEN? (This is the trickiest part!)
• Finding the relevant information in the passage?
• Taking too long to answer these questions?
• Understanding qualifiers and keywords?
• Something else?

Let me know and I'll give you targeted strategies!"

SPECIFIC ASPECT (provide focused explanation):
User: "I can't distinguish FALSE from NOT GIVEN"
You: "Ah, that's THE most common struggle with T/F/NG! This is where most students get confused. Let me break down the key difference:

**FALSE = Direct Contradiction**
The passage SAYS something that CONTRADICTS the statement.
You CAN quote the opposing information.
**NOT GIVEN = No Information**
The passage DOESN'T MENTION this topic at all.
You CANNOT find any relevant information.

**The Two-Question Test:**
1. Does the passage discuss this topic?
   - If NO → NOT GIVEN (stop here)
   - If YES → Go to question 2
2. Does it agree or contradict?
   - Agrees → TRUE
   - Contradicts → FALSE

**Example:**
📖 Passage: 'The study involved 50 local participants.'
Statement 1: 'International participants were involved'
→ Question 1: Does passage discuss participants? YES ✓
→ Question 2: Does it agree? NO, says 'local' not 'international'
→ Answer: FALSE (contradiction!)
Statement 2: 'The study was expensive'
→ Question 1: Does passage discuss cost/expense? NO ✗
→ Answer: NOT GIVEN (topic not mentioned)

See the difference? FALSE contradicts something stated, NOT GIVEN isn't discussed at all.

Does this clear it up? Want to try a practice question?"

VAGUE PROBLEM (needs clarification):
User: "I'm struggling with reading"
You: "I hear you—IELTS Reading can feel overwhelming! 💪 Let me help narrow it down.

What specifically are you finding challenging? Is it:
• Timing (running out of time)?
• Vocabulary (too many unknown words)?
• Specific question types (like T/F/NG or matching headings)?
• Understanding the main ideas?

Let me know and I'll give you targeted strategies and examples!"

GENERAL PROBLEM WITH TIMING (needs clarification):
User: "I have problem with timing"
You: "Timing issues are super common! ⏰ Let's pinpoint where you're losing time.

**Where are you struggling?**
• Reading the passage too slowly?
• Spending too long on difficult questions?
• Not sure how to allocate time across passages?
• Getting stuck and can't move on?
• Running out of time at the end?

Which one sounds most like your situation?"

PRACTICE REQUEST (wants to practice):
User: "Let's try some practice" OR "Give me a passage"
You: "Brilliant! Just tell me your level (Beginner/Intermediate/Advanced or 1/2/3) and I'll generate a Practice Session with questions. You'll get instant feedback when you submit!"

AFTER PRACTICE COMPLETION:
You: "[Feedback on answers]

Great effort! Want to try a more challenging passage? Just say 'Advanced' or '3' for a harder one!"

End."""

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

                # Create dynamic prompt template
                
                # INJECT READING THEORY based on conversation context
                theory_to_inject = None
                theory_name = ""
                
                # Analyze last 5 user messages for topic detection
                recent_user_messages = " ".join([
                    msg.content.lower() 
                    for msg in chat_history[-5:] if msg.role == "user"
                ])
                
                # Check for matching headings keywords
                if any(keyword in recent_user_messages for keyword in [
                    "matching heading", "match heading", "heading", 
                    "paragraph heading", "match paragraphs", "match title"
                ]):
                    if hasattr(self, 'matching_headings_theory_compact'):
                        theory_to_inject = self.matching_headings_theory_compact
                        theory_name = "Matching Headings"
                        
                # Check for T/F/NG keywords  
                elif any(keyword in recent_user_messages for keyword in [
                    "t/f/ng", "true false", "not given", "tfng",
                    "true or false", "false or not given"
                ]):
                    if hasattr(self, 'tfng_theory_compact'):
                        theory_to_inject = self.tfng_theory_compact
                        theory_name = "T/F/NG"
                
                # Inject the appropriate theory
                if theory_to_inject:
                    base_system_message += f"\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                    base_system_message += f"📚 READING THEORY KNOWLEDGE (Use this to answer student questions about {theory_name}):\n"
                    base_system_message += f"{theory_to_inject}\n"
                    base_system_message += f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"

                dynamic_chat_prompt = ChatPromptTemplate.from_messages([
                    ("system", base_system_message),
                    MessagesPlaceholder(variable_name="chat_history"),
                    ("user", "{user_message}")
                ])
                
                general_chain = dynamic_chat_prompt | self.fast_llm | StrOutputParser()
                
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

    async def generate_micro_battle(self, level: str, topic: Optional[str], question_type: str, chat_history: str, session_id: str) -> MicroBattle:
        """Generate a micro-battle practice session based on level, topic, and question type."""
        
        # Select the appropriate prompt based on question_type
        # Default to "mixed" if type is unknown or not provided
        selected_prompt = self.micro_battle_prompts.get(question_type, self.micro_battle_prompts["mixed"])
        
        micro_battle_chain = (
            ChatPromptTemplate.from_template(selected_prompt)
            | self.quality_llm
            | JsonOutputParser(pydantic_object=MicroBattle)
        )
        
        result = await micro_battle_chain.ainvoke({
            "level": level,
            "topic": topic or "",
            "chat_history": chat_history
        })
        
        # Convert dict to MicroBattle if needed
        battle = result
        if isinstance(result, dict):
            battle = MicroBattle(**result)
            
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
        question_type = context.get('question_type', 'true-false-not-given').lower()
        
        if 'matching' in question_type or 'heading' in question_type:
            # Use Matching Headings theory
            if not hasattr(self, 'matching_headings_theory_compact'):
                current_file = Path(__file__).resolve()
                prompts_dir = current_file.parent.parent / "prompts"
                self.matching_headings_theory_compact = (prompts_dir / "matching_headings_theory_compact.txt").read_text()
            context['theory_context'] = self.matching_headings_theory_compact
        else:
            # Default to T/F/NG theory
            if not hasattr(self, 'tfng_theory_compact'):
                current_file = Path(__file__).resolve()
                prompts_dir = current_file.parent.parent / "prompts"
                self.tfng_theory_compact = (prompts_dir / "tfng_theory_compact.txt").read_text()
            context['theory_context'] = self.tfng_theory_compact
        
        result = await deeper_feedback_chain.ainvoke(context)
        
        # Convert dict to DeeperFeedbackResponse if needed
        if isinstance(result, dict):
            return DeeperFeedbackResponse(**result)
        return result
