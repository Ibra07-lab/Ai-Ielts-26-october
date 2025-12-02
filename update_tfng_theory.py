import json

# Load both files
with open('backend/data/reading-theory.json', 'r', encoding='utf-8') as f:
    theory_data = json.load(f)

with open('backend/data/tfng-detailed-theory.json', 'r', encoding='utf-8') as f:
    detailed_theory = json.load(f)

# Find the T/F/NG section
tfng_section = None
for i, q_type in enumerate(theory_data['questionTypes']):
    if q_type['id'] == 'true-false-not-given':
        tfng_section = q_type
        tfng_index = i
        break

if tfng_section:
    # Enhanced description
    tfng_section['whatIsIt'] = {
        "description": "True/False/Not Given (T/F/NG) is one of the most common and challenging question types in the IELTS Academic and General Training Reading tests. You are given a series of statements and must decide whether each one agrees with, contradicts, or is not mentioned in the passage.",
        "skillTested": "Distinguishing between stated, contradicted, and missing information with precision."
    }
    
    # Add comprehensive detailed theory section
    tfng_section['detailedTheory'] = {
        "sections": detailed_theory['sections']
    }
    
    # Add 4th example question for NOT GIVEN
    if len(tfng_section['example']['questions']) == 3:
        tfng_section['example']['questions'].append({
            "id": 4,
            "text": "Urban beekeeping can completely solve the bee population crisis.",
            "correctAnswer": "NOT GIVEN",
            "explanation": "The passage says it 'could help stabilize' but doesn't claim it will completely solve the crisis."
        })
    
    # Enhanced strategy tips
    tfng_section['strategyTips'] = [
        {
            "step": 1,
            "title": "Read the Statement Carefully",
            "description": "Identify the KEY CLAIM being made. Note specific details: names, numbers, dates, qualifiers. Underline critical words."
        },
        {
            "step": 2,
            "title": "Locate the Relevant Section",
            "description": "Statements usually follow passage order. Scan for keywords or synonyms. Find the 1-3 sentences that discuss this topic."
        },
        {
            "step": 3,
            "title": "Compare Precisely",
            "description": "Read the relevant passage section carefully. Compare each element against the passage. Pay attention to qualifiers, scope, degree, and time references."
        },
        {
            "step": 4,
            "title": "Apply the Three-Way Test",
            "description": "Can I find text that CONFIRMS this? → TRUE | Can I find text that CONTRADICTS this? → FALSE | Can I find NO relevant information? → NOT GIVEN"
        },
        {
            "step": 5,
            "title": "Verify Your Answer",
            "description": "For TRUE: Can I quote supporting evidence? For FALSE: Can I quote contradicting evidence? For NOT GIVEN: Am I certain this isn't addressed anywhere?"
        }
    ]
    
    # Add signal words section
    tfng_section['signalWords'] = {
        "description": "Critical words that can change the answer completely",
        "qualifiers": {
            "title": "Qualifiers (Often Create FALSE Traps)",
            "examples": [
                {"passage": "some students", "question": "all students", "result": "FALSE - Scope changed"},
                {"passage": "often occurs", "question": "always occurs", "result": "FALSE - Frequency changed"},
                {"passage": "may cause", "question": "definitely causes", "result": "FALSE - Certainty changed"},
                {"passage": "one of the reasons", "question": "the main reason", "result": "FALSE/NOT GIVEN - Importance changed"},
                {"passage": "rarely happens", "question": "never happens", "result": "FALSE - Absolute vs qualified"}
            ]
        },
        "comparatives": {
            "title": "Comparatives & Superlatives",
            "examples": [
                {"passage": "larger than X", "question": "smaller than X", "result": "FALSE"},
                {"passage": "the largest", "question": "one of the largest", "result": "Could be TRUE"},
                {"passage": "more popular", "question": "most popular", "result": "NOT GIVEN unless confirmed"}
            ]
        },
        "time Sequence": {
            "title": "Time & Sequence Words",
            "examples": [
                {"passage": "before 1990", "question": "after 1990", "result": "FALSE"},
                {"passage": "since 2010", "question": "prior to 2010", "result": "FALSE"},
                {"passage": "X then Y", "question": "Y then X", "result": "FALSE - Order matters"}
            ]
        }
    }
    
    # Enhanced common mistakes with more detail
    tfng_section['commonMistakes'] = [
        {
            "title": "Confusing FALSE with NOT GIVEN",
            "description": "FALSE means the passage contradicts the statement. NOT GIVEN means no relevant information exists. Partial or missing information means NOT GIVEN, not FALSE."
        },
        {
            "title": "Using logic or outside knowledge",
            "description": "Only rely on what's explicitly in the passage. Don't use common sense, assumptions, or what you think should be true."
        },
        {
            "title": "Ignoring qualifying words",
            "description": "Words like 'most,' 'some,' 'all,' 'often,' 'always' can completely change the meaning. 'Most students' is NOT the same as 'all students.'"
        },
        {
            "title": "Expecting exact matches",
            "description": "IELTS uses paraphrases; the wording will differ from the passage. Look for meaning, not word-for-word matches."
        }
    ]
    
    # Enhanced trap patterns
    tfng_section['trapPatterns']['examples'].append("Extreme language (always, never, all) when passage uses qualified language")
    tfng_section['trapPatterns']['warningSigns'] = "Absolute terms like 'always,' 'never,' or 'all' often indicate FALSE answers when the passage uses more nuanced language."
    
    # Enhanced advanced tips
    tfng_section['advancedTips']['confidenceBooster'] = "Information for TRUE and FALSE answers will always be clearly stated or clearly contradicted. If you're unsure, it's likely NOT GIVEN."
    
    # Enhanced time management
    tfng_section['timeManagement']['tip'] = "If you're stuck on one question for more than 90 seconds, make your best guess, mark it for review, and move on. NOT GIVEN is statistically common."
    
    # Save updated file
    with open('backend/data/reading-theory.json', 'w', encoding='utf-8') as f:
        json.dump(theory_data, f, indent=2, ensure_ascii=False)
    
    print("✅ Successfully updated T/F/NG theory with comprehensive content!")
    print("📊 Added detailed theory sections from tfng-detailed-theory.json")
    print("✨ Enhanced examples, strategies, signal words, and explanations")
else:
    print("❌ Could not find T/F/NG section in reading-theory.json")
