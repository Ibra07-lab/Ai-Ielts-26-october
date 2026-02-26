"""
Shared test fixtures for IELTS Writing Tests.

Provides mock LLM responses matching each agent's Pydantic schema,
sample essays and questions, and pre-configured agent instances.
"""

import json
import pytest


# ============================================================
# SAMPLE INPUTS
# ============================================================

SAMPLE_ESSAY = (
    "In today's world, the debate about whether governments should invest more "
    "in public transport has become increasingly relevant. In my opinion, "
    "governments should prioritize investment in public transportation systems. "
    "Firstly, public transport reduces traffic congestion. When more people use "
    "buses and trains, fewer private cars are on the roads. For example, cities "
    "like London and Tokyo have efficient metro systems that significantly reduce "
    "the number of vehicles on the road. Secondly, public transport is more "
    "environmentally friendly. Buses and trains produce fewer emissions per passenger "
    "compared to individual cars. This is crucial in the fight against climate change. "
    "In conclusion, investing in public transport is essential for reducing both "
    "congestion and environmental damage."
)

SAMPLE_QUESTION = (
    "Some people think that governments should invest more money in public transport. "
    "Others believe that there are better ways to spend government money. "
    "Discuss both views and give your own opinion."
)


# ============================================================
# MOCK LLM RESPONSES — Examiner (Agent 1)
# ============================================================

MOCK_EXAMINER_RESPONSE = json.dumps({
    "prompt_analyzed": SAMPLE_QUESTION,
    "task_type_required": "discussion",
    "task_type_detected": "discussion",
    "band_scores": {
        "task_response": 6.0,
        "coherence_cohesion": 6.0,
        "lexical_resource": 6.0,
        "grammatical_range_accuracy": 6.5,
        "overall": 6.0
    },
    "fatal_flaws": ["Circular/Underdeveloped Arguments"],
    "score_caps_applied": [
        {
            "criterion": "TR",
            "cap_value": 6.0,
            "reason": "Body paragraphs lack depth",
            "evidence": "Only one example per paragraph with no elaboration"
        }
    ],
    "analysis": {
        "word_count": 156,
        "paragraph_count": 3,
        "thesis_analysis": {
            "thesis_found": True,
            "thesis_statement": "governments should prioritize investment in public transportation systems",
            "thesis_quality": "clear_and_specific",
            "position_maintained": True
        },
        "task_type_match": True,
        "circular_arguments_detected": False,
        "all_parts_addressed": True,
        "linker_audit": {
            "total_sentences": 10,
            "mechanical_linker_count": 3,
            "mechanical_linker_ratio": 0.3,
            "mechanical_linkers_found": ["Firstly", "Secondly", "In conclusion"],
            "referencing_devices_used": [],
            "cohesion_verdict": "mechanical"
        },
        "cliche_audit": {
            "tier1_cliches": ["In today's world"],
            "tier2_cliches": [],
            "total_cliche_count": 1,
            "penalty_points": 0.5,
            "memorized_language_verdict": "minimal"
        },
        "vocabulary_range": "adequate",
        "grammar_audit": {
            "error_type": "minimal",
            "systematic_errors_identified": [],
            "complex_structures_attempted": True,
            "sentence_variety": "limited"
        }
    },
    "paragraph_breakdown": [
        {
            "paragraph_number": 1,
            "paragraph_type": "introduction",
            "word_count": 35,
            "development_quality": "adequately_developed"
        },
        {
            "paragraph_number": 2,
            "paragraph_type": "body",
            "word_count": 55,
            "development_quality": "underdeveloped"
        }
    ],
    "scoring_justification": "TR capped at 6.0 due to underdeveloped body paragraphs with only a single example per paragraph.",
    "improvement_priorities": [
        "Develop body paragraphs with PEEL method",
        "Replace mechanical linkers with referencing devices",
        "Eliminate Tier 1 clichés"
    ],
    "evaluation_confidence": 0.85
})


# ============================================================
# MOCK LLM RESPONSES — Explainer (Agent 2)
# ============================================================

MOCK_EXPLAINER_RESPONSE = json.dumps({
    "priority_summary": [
        {
            "area": "Task Response",
            "current_impact": "Body paragraph 1 states 'public transport reduces traffic congestion' but only gives one surface-level example (London/Tokyo metros) with no data, explanation, or result — the paragraph ends at 55 words instead of 80-100",
            "recommended_action": "Rewrite each body paragraph using PEEL: Point (topic sentence stating your claim), Explain (why this is true), Example (a specific, named example with data), Link (connect back to your thesis)"
        }
    ],
    "one_thing_done_well": "Clear thesis statement that directly addresses the prompt",
    "immediate_focus": "Paragraph development using PEEL method",
    "micro_feedback": [
        {
            "original_sentence": "In today's world, the debate has become increasingly relevant.",
            "corrected_sentence": "The question of whether governments should prioritise public transport investment is a pressing policy issue.",
            "error_type": "vocabulary",
            "explanation": "Replace cliché opener with topic-specific language",
            "band_impact": "Removing this cliché prevents LR penalty",
            "priority": "P2_important",
            "paragraph_location": 1
        }
    ],
    "cohesion_fixes": [
        {
            "original_sentence": "Firstly, public transport reduces traffic congestion.",
            "improved_sentence": "One of the most immediate benefits of public transport is its capacity to reduce traffic congestion.",
            "technique_used": "thematic_progression",
            "explanation": "Replace mechanical 'Firstly' with content-based opening",
            "preceding_sentence": None
        }
    ],
    "macro_feedback": [
        {
            "paragraph_index": 2,
            "issue_type": "underdeveloped",
            "issue_description": "The paragraph states a claim without sufficient elaboration",
            "original_paragraph": "Firstly, public transport reduces traffic congestion...",
            "improved_paragraph": "One of the most immediate benefits of public transport is its capacity to ease urban congestion...",
            "peel_breakdown": {
                "point": "Public transport reduces traffic congestion",
                "explain": "When cities invest in reliable metro and bus networks...",
                "example": "London's Congestion Charge zone, introduced alongside Tube expansion...",
                "link": "This demonstrates that well-funded public transport directly addresses urban mobility."
            },
            "changes_explained": "Added PEEL structure with specific data",
            "word_count_original": 50,
            "word_count_improved": 90,
            "priority": "P1_critical"
        }
    ],
    "vocabulary_feedback": {
        "cliche_replacements": [
            {
                "cliche_found": "In today's world",
                "tier": "tier1",
                "alternatives": ["Currently", "At present"],
                "best_alternative": "Currently",
                "full_sentence_rewrite": "Currently, the allocation of government funds to public transport is a debated issue.",
                "why_better": "More concise and academic"
            }
        ],
        "upgraded_vocabulary": [],
        "topic_specific_suggestions": []
    },
    "grammar_feedback": {
        "pattern_lessons": [],
        "rule_summary": None
    }
})


# ============================================================
# MOCK LLM RESPONSES — Coach (Agent 3)
# ============================================================

MOCK_COACH_RESPONSE = json.dumps({
    "score_context": {
        "current_overall": 6.0,
        "lowest_criterion": "TR",
        "lowest_score": 6.0,
        "highest_criterion": "GRA",
        "highest_score": 6.5,
        "realistic_next_target": 6.5,
        "if_change_implemented": 6.5,
        "improvement_timeline": "2-3 essays"
    },
    "root_cause_analysis": {
        "root_cause_type": "logic_gap",
        "coaching_priority": "level_1_task_response",
        "blocking_criterion": "TR",
        "score_cap_explanation": "Body paragraphs state ideas without explaining why they are true",
        "evidence_from_essay": "Only one example per paragraph"
    },
    "diagnosis_summary": {
        "strength_acknowledged": "Clear thesis that directly addresses the prompt",
        "core_limitation": "Body paragraphs lack development depth",
        "full_summary": "Your essay shows clear understanding of the topic with a focused thesis. However, your body paragraphs state ideas without sufficient explanation, capping your TR at 6.0."
    },
    "the_one_big_change": {
        "change_statement": "Develop each body paragraph using the PEEL method",
        "why_this_matters_most": "Without paragraph depth, TR cannot exceed 6.0",
        "what_to_stop_doing": "Writing short paragraphs with only one sentence of support",
        "what_to_start_doing": "Using Point-Explain-Example-Link in every body paragraph",
        "visual_reminder": "📝 PEEL every paragraph!"
    },
    "pattern_breaker": {
        "habit_identified": "Mechanical linker addiction",
        "habit_frequency": "3 out of 10 sentences start with Firstly/Secondly/In conclusion",
        "banned_list": [
            {
                "banned_element": "Firstly",
                "why_banned": "Signals Band 6 cohesion",
                "alternative_to_use": "Topic sentence related to content",
                "example_transformation": "Firstly, X → One significant advantage of X is..."
            }
        ],
        "required_list": [
            {
                "required_technique": "Demonstrative referencing",
                "minimum_instances": 2,
                "how_to_implement": "Start 2+ sentences with 'This' or 'Such'",
                "example": "This approach has proven effective in cities like London."
            }
        ]
    },
    "micro_drill": {
        "drill_type": "peel_expansion",
        "drill_name": "PEEL Paragraph Builder",
        "time_limit_minutes": 5,
        "purpose": "Practice developing paragraphs with full PEEL structure",
        "instructions": "Take your weakest body paragraph and rewrite it following P-E-E-L",
        "practice_content": "Rewrite Body Paragraph 1 (public transport reduces congestion)",
        "success_criteria": [
            {"criterion": "Has a clear topic sentence", "how_to_check": "First sentence states the main claim"},
            {"criterion": "Has specific evidence", "how_to_check": "Contains a named example with data"}
        ],
        "variation_for_tomorrow": "Apply PEEL to Body Paragraph 2",
        "alternative_drill": "Write 3 topic sentences for different essay prompts"
    },
    "next_essay_plan": {
        "recommended_prompt": "Some people believe children should have strict rules. Others think they should be free to make their own decisions. Discuss both views.",
        "prompt_type_to_practice": "discussion",
        "rewrite_original": False,
        "constraints": [
            {
                "constraint_id": 1,
                "category": "structural",
                "rule": "Each body paragraph must be 80-100 words",
                "rationale": "Forces adequate development",
                "how_to_verify": "Count words in each body paragraph"
            }
        ],
        "pre_writing_checklist": ["Identify the task type", "Plan PEEL for each body paragraph"],
        "target_word_count": 280,
        "time_allocation": {"planning": "5m", "writing": "30m", "reviewing": "5m"}
    },
    "motivation": {
        "current_level_context": "You are at the threshold of Band 6.5",
        "specific_progress_marker": "Your thesis writing is already at Band 7 level",
        "achievable_next_milestone": "Band 6.5 with improved paragraph development",
        "closing_message": "Focus only on PEEL paragraphs. Everything else can wait."
    },
    "coaching_focus_level": "level_1_task_response",
    "topic_vocabulary": {
        "topic": "Public Transport",
        "useful_words": [{"word": "infrastructure", "example": "Public transport infrastructure requires significant investment."}],
        "useful_collocations": [{"word": "public transit network", "example": "An efficient public transit network reduces car dependency."}]
    },
    "topic_analysis": [
        {
            "topic": "PEEL Paragraphs",
            "count": 10,
            "category": "Task Response",
            "description": "Master the Point-Explain-Example-Link structure",
            "why_it_matters": "Directly unblocks TR score from 6.0 cap"
        }
    ],
    "coherence_advice": {
        "strategy": "Replace mechanical linkers with referencing",
        "specific_direction": "Use 'This' and 'Such' to start sentences",
        "example": "This situation demonstrates → instead of → Furthermore"
    },
    "issues_intentionally_ignored": ["vocabulary", "grammar"],
    "when_to_revisit": "After 3 essays with improved PEEL"
})
