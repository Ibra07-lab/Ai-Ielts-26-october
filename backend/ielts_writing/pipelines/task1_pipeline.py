"""
Task 1 Pipeline — 3-Agent Architecture (Examiner → Explainer → Coach)

Aligned with Task 2 pipeline structure:
1. Examiner (Agent 1): Scores the essay → dict
2. Explainer (Agent 2): Generates detailed feedback → Task1ExplainerOutput
3. Coach (Agent 3): Creates focused action plan → CoachOutput

Each agent has independent failure handling with explicit status fields.
Coach is skipped if Explainer fails (Coach needs Explainer output).
"""

import logging
import asyncio
import traceback
from typing import Optional, List, Dict, Any
from concurrent.futures import ThreadPoolExecutor

from ..agents.examiner.task1_examiner import Task1Examiner
from ..agents.explainer.task1_explainer import Task1Explainer
from ..agents.coach.task1_coach import Task1Coach

logger = logging.getLogger(__name__)

# Thread pool for running sync code in async context
# 8 workers allows multiple users' pipelines to run concurrently
executor = ThreadPoolExecutor(max_workers=8)


class Task1Pipeline:
    """
    Task 1 evaluation pipeline with 3-agent architecture.
    
    Pipeline flow (sequential — each agent feeds the next):
    1. Examiner → scores, analysis (required)
    2. Explainer → detailed feedback with rewrites (depends on Examiner)
    3. Coach → focused coaching plan (depends on Examiner + Explainer)
    
    Failure handling:
    - Examiner fails → return error (no results possible)
    - Explainer fails → return examiner results; skip Coach
    - Coach fails → return examiner + explainer results
    """
    
    # Timeout configuration
    EXAMINER_TIMEOUT = 30.0      # 30s for examiner
    EXPLAINER_TIMEOUT = 180.0    # 180s for explainer (OpenRouter can take 90-120s for long essays)
    COACH_TIMEOUT = 120.0        # 120s for coach (must match httpx client timeout)
    TOTAL_TIMEOUT = 360.0        # Safety net for entire pipeline
    
    def __init__(self, model: str = None):
        self.examiner = Task1Examiner(model=model)
        self.explainer = Task1Explainer(model=model)
        self.coach = Task1Coach(model=model)
        self.model = model
    
    async def evaluate_async(
        self,
        essay: str,
        question: str,
        student_name: str = "Student",
        chart_type: str = None,
        image_url: str = None,
        image_description: str = None,
        previous_errors: List[str] = None,
        attempt_number: int = 1,
        include_teacher_feedback: bool = True,
        return_markdown: bool = True
    ) -> Dict[str, Any]:
        """
        Full async evaluation with 3-agent pipeline.
        
        Returns dict with:
        - evaluation: examiner scores (always present if success)
        - explanation: explainer output (present or None with status)
        - coaching: coach output (present or None with status)
        - each with independent _status fields
        """
        
        logger.info(f"[Task1Pipeline] Starting 3-agent evaluation for {student_name}")
        
        result = {
            "success": True,
            "task_type": "task1",
            "student_name": student_name,
            "chart_type": chart_type,
            "word_count": len(essay.split()),
            "timing": {}
        }
        
        try:
            # ============== STEP 1: EXAMINER (Agent 1) ==============
            logger.info("[Task1Pipeline] Running examiner...")
            examiner_start = asyncio.get_event_loop().time()
            
            try:
                examiner_result = await asyncio.wait_for(
                    self.examiner.evaluate(
                        essay=essay,
                        question=question,
                        image_url=image_url,
                        chart_type=chart_type,
                        image_description=image_description
                    ),
                    timeout=self.EXAMINER_TIMEOUT
                )
                
                examiner_time = asyncio.get_event_loop().time() - examiner_start
                result["timing"]["examiner_seconds"] = round(examiner_time, 2)
                logger.info(f"[Task1Pipeline] Examiner complete in {examiner_time:.1f}s")
                
            except asyncio.TimeoutError:
                logger.error(f"[Task1Pipeline] Examiner timed out after {self.EXAMINER_TIMEOUT}s")
                return {
                    "success": False,
                    "error": "Examiner timed out. Please try again.",
                    "task_type": "task1",
                    "student_name": student_name
                }
            except Exception as examiner_exc:
                tb_text = traceback.format_exc()
                logger.error(f"[Task1Pipeline] EXAMINER CRASHED:\n{tb_text}")
                try:
                    with open("examiner_crash.txt", "w", encoding="utf-8") as f:
                        f.write(f"EXAMINER CRASH at evaluate_async\n\n{tb_text}")
                except Exception:
                    pass
                raise examiner_exc
            
            # Build evaluation output (backward compatible)
            result["examiner_result"] = examiner_result
            result["scores"] = {
                "overall": examiner_result.get("overall_band"),
                "overall_band": examiner_result.get("overall_band"),
                "band_range": examiner_result.get("band_range"),
                "criterion_scores": examiner_result.get("criterion_scores"),
                "task_achievement": self._get_criterion_band(examiner_result, "task_achievement"),
                "coherence_cohesion": self._get_criterion_band(examiner_result, "coherence_cohesion"),
                "lexical_resource": self._get_criterion_band(examiner_result, "lexical_resource"),
                "grammatical_range_accuracy": self._get_criterion_band(examiner_result, "grammatical_range_accuracy"),
            }
            result["evaluation"] = examiner_result
            result["analysis"] = {
                "word_count_ok": examiner_result.get("word_count_ok"),
                "overview_present": examiner_result.get("overview_present"),
                "overview_quality": examiner_result.get("overview_quality"),
                "data_accuracy": examiner_result.get("data_accuracy"),
                "red_flags": examiner_result.get("red_flags", [])
            }
            
            
            # ============== STEP 2: EXPLAINER (Agent 2) ==============
            logger.info("[Task1Pipeline] Running explainer...")
            explainer_start = asyncio.get_event_loop().time()
            
            explainer_output = None
            explainer_dict = None
            
            try:
                loop = asyncio.get_event_loop()
                explainer_output = await asyncio.wait_for(
                    loop.run_in_executor(
                        executor,
                        lambda: self.explainer.explain(
                            essay=essay,
                            question=question,
                            examiner_scores=examiner_result,
                            chart_type=chart_type,
                            visual_description=examiner_result.get("visual_description")
                        )
                    ),
                    timeout=self.EXPLAINER_TIMEOUT
                )
                
                explainer_time = asyncio.get_event_loop().time() - explainer_start
                result["timing"]["explainer_seconds"] = round(explainer_time, 2)
                logger.info(f"[Task1Pipeline] Explainer complete in {explainer_time:.1f}s")
                
                # Store explainer results — first enrich with deterministic analysis
                try:
                    from ielts_writing.utils.lexical_analysis import (
                        detect_paraphrase_overlap,
                        detect_word_repetition,
                        compute_vocabulary_stats,
                    )
                    
                    # Get the LR band for benchmark selection
                    lr_band = self._get_criterion_band(examiner_result, "lexical_resource") or 6.0
                    
                    # 1. Paraphrase overlap
                    paraphrase = detect_paraphrase_overlap(question, essay)
                    
                    # 1b. If overlap is high, generate an improved intro using LLM
                    if paraphrase.get("overlap_percentage", 0) > 0.30:
                        try:
                            logger.info(f"[Task1Pipeline] Overlap is {paraphrase['overlap_percentage']:.1%}, generating improved intro...")
                            print(f"[IMPROVED_INTRO] Starting generation. Overlap: {paraphrase['overlap_percentage']:.1%}", flush=True)
                            
                            improve_sys = "You are an expert IELTS examiner providing feedback."
                            improve_user = f"""The student copied too many words from the question prompt into their introduction.
                            Show them how a Band 9 level examiner would rewrite it to avoid any direct copying.

Original question prompt:
{question}

Student's introduction:
{paraphrase['student_intro']}

Rewrite the student's introduction with these rules:
1. Paraphrase all content words — no direct copying of nouns, verbs, or adjectives from the prompt
2. You MAY keep: years, numbers, units of measurement (litres, km, %)
3. Keep the same meaning — do not add or remove information
4. Keep it to 1-2 sentences maximum
5. Write at Band 9 level — natural, academic, not robotic

Then list exactly what was changed in this format:
CHANGES:
- original word/phrase → paraphrased version
- original word/phrase → paraphrased version

Return JSON:
{{
  "improved_introduction": "...",
  "changes": [
    {{"original": "original word", "paraphrased": "new word"}},
    {{"original": "original word", "paraphrased": "new word"}}
  ]
}}"""
                            
                            # Using OpenRouter client to hit 4o-mini
                            from agents.direct_llm_client import DirectLLMClient
                            llm_client = DirectLLMClient()
                            print(f"[IMPROVED_INTRO] OpenRouter key present: {bool(llm_client.openrouter_key)}", flush=True)
                            
                            resp_text = await llm_client.call_openrouter_async(
                                model="openai/gpt-4o-mini",
                                system_prompt=improve_sys,
                                user_prompt=improve_user,
                                temperature=0.3,
                                max_tokens=300
                            )
                            print(f"[IMPROVED_INTRO] Got response: {len(resp_text) if resp_text else 'None'} chars", flush=True)
                            
                            if resp_text:
                                import json
                                import re
                                
                                # Extract JSON block if surrounded by markdown or text
                                match = re.search(r'\{[\s\S]*\}', resp_text)
                                if match:
                                    clean_resp = match.group(0)
                                    improved_data = json.loads(clean_resp)
                                    improved_data["overlap_percent"] = int(paraphrase["overlap_percentage"] * 100)
                                    paraphrase["improved"] = improved_data
                                    print(f"[IMPROVED_INTRO] SUCCESS — improved intro attached to paraphrase", flush=True)
                                    logger.info("[Task1Pipeline] Successfully generated improved paraphrase.")
                                else:
                                    print(f"[IMPROVED_INTRO] FAIL — no JSON found in response: {resp_text[:200]}", flush=True)
                                    logger.warning("[Task1Pipeline] LLM response did not contain valid JSON.")
                        except Exception as ai_err:
                            import traceback as tb
                            print(f"[IMPROVED_INTRO] EXCEPTION: {ai_err}\n{tb.format_exc()}", flush=True)
                            logger.warning(f"[Task1Pipeline] Failed to parse improved paraphrase: {ai_err}")

                    # 2. Word repetition
                    repetitions = detect_word_repetition(essay)
                    
                    # 2b. AI-generate synonyms for repeated words missing from the hardcoded bank
                    words_needing_synonyms = [
                        r for r in repetitions 
                        if r["severity"] != "ignore" and len(r.get("synonyms", [])) == 0
                    ]
                    if words_needing_synonyms:
                        try:
                            word_list = ", ".join([f'"{r["word"]}"' for r in words_needing_synonyms])
                            logger.info(f"[Task1Pipeline] Generating AI synonyms for: {word_list}")
                            
                            from agents.direct_llm_client import DirectLLMClient
                            syn_client = DirectLLMClient()
                            
                            syn_prompt = f"""For each word below, provide 3-4 IELTS-appropriate synonyms or alternative phrases that a student could use in an academic essay about charts/graphs/data.

Words: {word_list}

Context from the essay (for accurate alternatives):
"{essay[:300]}"

Return ONLY valid JSON — no markdown, no explanation:
{{
  "word1": ["synonym1", "synonym2", "synonym3"],
  "word2": ["synonym1", "synonym2", "synonym3"]
}}"""
                            
                            syn_resp = await syn_client.call_openrouter_async(
                                model="openai/gpt-4o-mini",
                                system_prompt="You are a vocabulary coach. Return only JSON.",
                                user_prompt=syn_prompt,
                                temperature=0.3,
                                max_tokens=300
                            )
                            
                            if syn_resp:
                                import json as _json
                                import re as _re
                                match = _re.search(r'\{[\s\S]*\}', syn_resp)
                                if match:
                                    syn_data = _json.loads(match.group(0))
                                    # Merge AI synonyms back into repetitions
                                    for rep in repetitions:
                                        if len(rep.get("synonyms", [])) == 0:
                                            ai_syns = syn_data.get(rep["word"], [])
                                            if ai_syns:
                                                rep["synonyms"] = ai_syns[:4]
                                    logger.info(f"[Task1Pipeline] AI synonyms generated for {len(syn_data)} words.")
                        except Exception as syn_err:
                            logger.warning(f"[Task1Pipeline] AI synonym generation failed (non-fatal): {syn_err}")
                    
                    # 3. Vocabulary variety stats
                    vocab_fb = explainer_output.vocabulary_feedback
                    stats = compute_vocabulary_stats(
                        trend_vocabulary_used=vocab_fb.trend_vocabulary_used if vocab_fb else [],
                        comparison_vocabulary_used=vocab_fb.comparison_vocabulary_used if vocab_fb else [],
                        current_band=lr_band,
                    )
                    
                    # Inject into the explainer output
                    if vocab_fb:
                        vocab_fb.paraphrase_analysis = paraphrase
                        vocab_fb.word_repetitions = repetitions
                        vocab_fb.vocabulary_stats = stats
                    
                    logger.info(
                        f"[Task1Pipeline] Lexical analysis: "
                        f"paraphrase={paraphrase['severity']}, "
                        f"repetitions={len(repetitions)}, "
                        f"unique_trends={stats['unique_trend_verbs']}"
                    )
                except Exception as lex_err:
                    logger.warning(f"[Task1Pipeline] Lexical analysis failed (non-fatal): {lex_err}")
                
                explainer_dict = explainer_output.model_dump()
                result["explanation"] = explainer_dict
                result["explanation_status"] = "complete"
                
                # Backward compatibility: populate explanations from explainer
                result["explanations"] = explainer_dict
                result["explanations_status"] = "complete"
                
            except asyncio.TimeoutError:
                explainer_time = asyncio.get_event_loop().time() - explainer_start
                logger.warning(f"[Task1Pipeline] Explainer timed out after {explainer_time:.1f}s")
                
                result["explanation"] = None
                result["explanation_status"] = "timeout"
                result["explanations"] = None
                result["explanations_status"] = "timeout"
                result["timing"]["explainer_seconds"] = round(explainer_time, 2)
                
            except Exception as e:
                tb_text = traceback.format_exc()
                logger.error(f"[Task1Pipeline] EXPLAINER CRASHED:\n{tb_text}")
                try:
                    with open("explainer_crash.txt", "w", encoding="utf-8") as f:
                        f.write(f"EXPLAINER CRASH at evaluate_async\n\n{tb_text}")
                except Exception:
                    pass
                
                result["explanation"] = None
                result["explanation_status"] = "error"
                result["explanation_error"] = str(e)
                result["explanations"] = None
                result["explanations_status"] = "error"
            
            
            # ============== STEP 3: COACH (Agent 3) ==============
            # Coach requires Explainer output — skip if Explainer failed
            if explainer_output is not None:
                logger.info("[Task1Pipeline] Running coach...")
                coach_start = asyncio.get_event_loop().time()
                
                try:
                    loop = asyncio.get_event_loop()
                    coach_output = await asyncio.wait_for(
                        loop.run_in_executor(
                            executor,
                            lambda: self.coach.generate_plan(
                                examiner_data=examiner_result,
                                explainer_data=explainer_dict,
                                essay=essay,
                                question=question
                            )
                        ),
                        timeout=self.COACH_TIMEOUT
                    )
                    
                    coach_time = asyncio.get_event_loop().time() - coach_start
                    result["timing"]["coach_seconds"] = round(coach_time, 2)
                    logger.info(f"[Task1Pipeline] Coach complete in {coach_time:.1f}s")
                    
                    # Store coach results
                    result["coaching"] = coach_output.model_dump()
                    result["coaching_status"] = "complete"
                    
                except asyncio.TimeoutError:
                    coach_time = asyncio.get_event_loop().time() - coach_start
                    logger.warning(f"[Task1Pipeline] Coach timed out after {coach_time:.1f}s")
                    
                    result["coaching"] = None
                    result["coaching_status"] = "timeout"
                    result["timing"]["coach_seconds"] = round(coach_time, 2)
                    
                except Exception as e:
                    tb_text = traceback.format_exc()
                    logger.error(f"[Task1Pipeline] COACH CRASHED:\n{tb_text}")
                    try:
                        with open("coach_crash.txt", "w", encoding="utf-8") as f:
                            f.write(f"COACH CRASH at evaluate_async\n\n{tb_text}")
                    except Exception:
                        pass
                    
                    result["coaching"] = None
                    result["coaching_status"] = "error"
                    result["coaching_error"] = str(e)
            else:
                logger.info("[Task1Pipeline] Skipping coach — explainer failed")
                result["coaching"] = None
                result["coaching_status"] = "skipped"
            
            
            # ============== DEPRECATED FIELDS ==============
            result["teacher_feedback"] = None
            result["teacher_feedback_status"] = "deprecated"
            
            # ============== SUMMARY ==============
            total_time = asyncio.get_event_loop().time() - examiner_start
            result["timing"]["total_seconds"] = round(total_time, 2)
            result["summary"] = {
                "overall_band": examiner_result.get("overall_band"),
                "task_achievement": self._get_criterion_band(examiner_result, "task_achievement"),
                "coherence_cohesion": self._get_criterion_band(examiner_result, "coherence_cohesion"),
                "lexical_resource": self._get_criterion_band(examiner_result, "lexical_resource"),
                "grammatical_range": self._get_criterion_band(examiner_result, "grammatical_range_accuracy"),
                "red_flags": examiner_result.get("red_flags", []),
                "one_big_change": (
                    result.get("coaching", {}).get("the_one_big_change", {}).get("change_statement")
                    if result.get("coaching") else None
                ),
            }
            
            logger.info(
                f"[Task1Pipeline] Complete. Overall: {result['scores']['overall_band']} | "
                f"Explainer: {result['explanation_status']} | "
                f"Coach: {result['coaching_status']} | "
                f"Total: {total_time:.1f}s"
            )
            return result
            
        except Exception as e:
            tb_text = traceback.format_exc()
            logger.error(f"FULL ERROR TRACEBACK:\n{tb_text}")
            try:
                with open("pipeline_crash.txt", "w", encoding="utf-8") as f:
                    f.write(tb_text)
            except Exception:
                pass
            return {
                "success": False,
                "error": str(e),
                "traceback": tb_text,
                "task_type": "task1",
                "student_name": student_name
            }
    
    def _get_criterion_band(self, examiner_result: dict, criterion_name: str) -> Optional[float]:
        """Extract a criterion band score from examiner result."""
        for score in examiner_result.get("criterion_scores", []):
            if score.get("criterion") == criterion_name:
                return score.get("band")
        return None
    
    def evaluate(
        self,
        essay: str,
        question: str,
        student_name: str = "Student",
        chart_type: str = None,
        image_url: str = None,
        image_description: str = None,
        previous_errors: List[str] = None,
        attempt_number: int = 1,
        include_teacher_feedback: bool = True,
        return_markdown: bool = True
    ) -> Dict[str, Any]:
        """
        Sync wrapper for evaluate_async.
        """
        
        # Create new event loop if needed
        try:
            loop = asyncio.get_event_loop()
            if loop.is_closed():
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        
        return loop.run_until_complete(
            self.evaluate_async(
                essay=essay,
                question=question,
                student_name=student_name,
                chart_type=chart_type,
                image_url=image_url,
                image_description=image_description,
                previous_errors=previous_errors,
                attempt_number=attempt_number,
                include_teacher_feedback=include_teacher_feedback,
                return_markdown=return_markdown
            )
        )
    
    async def evaluate_examiner_only(
        self,
        essay: str,
        question: str,
        chart_type: str = None,
        image_url: str = None,
        image_description: str = None
    ) -> Dict[str, Any]:
        """
        Fast evaluation - examiner only, no explainer or coach.
        Use for quick checks (10-15 seconds).
        """
        
        logger.info("[Task1Pipeline] Running examiner-only evaluation")
        
        try:
            result = await asyncio.wait_for(
                self.examiner.evaluate(
                    essay=essay,
                    question=question,
                    image_url=image_url,
                    chart_type=chart_type,
                    image_description=image_description
                ),
                timeout=self.EXAMINER_TIMEOUT
            )
            
            return {
                "success": True,
                "task_type": "task1",
                "scores": result,
                "explanation_status": "not_requested",
                "coaching_status": "not_requested"
            }
            
        except asyncio.TimeoutError:
            logger.error("[Task1Pipeline] Examiner timed out")
            return {
                "success": False,
                "error": "Examiner timed out",
                "task_type": "task1"
            }
        except Exception as e:
            logger.error(f"FULL ERROR TRACEBACK:\n{traceback.format_exc()}")
            return {
                "success": False,
                "error": str(e),
                "task_type": "task1"
            }