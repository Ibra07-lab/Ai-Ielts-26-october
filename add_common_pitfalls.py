import json

# Load the theory file
with open('backend/data/reading-theory.json', 'r', encoding='utf-8') as f:
    theory_data = json.load(f)

# Find T/F/NG section
for q_type in theory_data['questionTypes']:
    if q_type['id'] == 'true-false-not-given':
        # Add comprehensive common pitfalls section
        q_type['commonPitfalls'] = {
            "title": "Common Mistakes & Pitfalls",
            "description": "The 10 Most Common Errors Students Make",
            "mistakes": [
                {
                    "id": 1,
                    "title": "Using Outside Knowledge",
                    "trap": "You know something is true in real life, so you mark it TRUE.",
                    "example": {
                        "passage": "Passage discusses climate change but doesn't mention CO2.",
                        "statement": "Carbon dioxide is a greenhouse gas.",
                        "wrongThinking": "I know CO2 is a greenhouse gas, so TRUE.",
                        "correctThinking": "The passage doesn't mention CO2 at all → NOT GIVEN"
                    },
                    "rule": "Only use information IN the passage. Your knowledge is irrelevant."
                },
                {
                    "id": 2,
                    "title": "Confusing FALSE and NOT GIVEN",
                    "trap": "The statement seems wrong, so you choose FALSE—but the passage never discusses it.",
                    "example": {
                        "passage": "The experiment used 50 participants over three months.",
                        "statement": "The experiment was expensive to conduct.",
                        "wrongThinking": "50 participants sounds expensive, but the passage doesn't say it was expensive, so FALSE.",
                        "correctThinking": "Cost is never mentioned → NOT GIVEN"
                    },
                    "rule": "FALSE needs a contradiction. No information = NOT GIVEN."
                },
                {
                    "id": 3,
                    "title": "Over-Inferencing for TRUE",
                    "trap": "You make a logical assumption and treat it as confirmed.",
                    "example": {
                        "passage": "The CEO announced the company would expand into Asian markets.",
                        "statement": "The company expects expansion to be profitable.",
                        "wrongThinking": "Why would they expand if not for profit? TRUE.",
                        "correctThinking": "Profitability expectations are never stated → NOT GIVEN"
                    },
                    "rule": "TRUE requires explicit support, not logical assumptions."
                },
                {
                    "id": 4,
                    "title": "Missing Paraphrases",
                    "trap": "You don't recognize that the passage says the same thing differently.",
                    "example": {
                        "passage": "The population declined rapidly.",
                        "statement": "The number of inhabitants fell quickly.",
                        "wrongThinking": "I can't find the words 'inhabitants' or 'fell' → NOT GIVEN.",
                        "correctThinking": "'population' = 'number of inhabitants'; 'declined rapidly' = 'fell quickly' → TRUE"
                    },
                    "rule": "Learn to recognize synonyms and paraphrases."
                },
                {
                    "id": 5,
                    "title": "Ignoring Qualifiers",
                    "trap": "You miss small words that change meaning significantly.",
                    "commonQualifierTraps": [
                        {
                            "passage": "Some experts believe...",
                            "statement": "Experts believe...",
                            "answer": "NOT GIVEN",
                            "missedWord": "'Some' vs. general"
                        },
                        {
                            "passage": "This may lead to...",
                            "statement": "This leads to...",
                            "answer": "FALSE",
                            "missedWord": "'may' = possibility"
                        },
                        {
                            "passage": "One of the causes...",
                            "statement": "The cause...",
                            "answer": "FALSE",
                            "missedWord": "'One of' vs. 'The'"
                        },
                        {
                            "passage": "...was rarely seen",
                            "statement": "...was never seen",
                            "answer": "FALSE",
                            "missedWord": "'rarely' vs. 'never'"
                        }
                    ]
                },
                {
                    "id": 6,
                    "title": "Reversing Comparisons",
                    "trap": "You confuse which item is greater/lesser/earlier/later.",
                    "example": {
                        "passage": "Method A was more effective than Method B.",
                        "statement": "Method B produced better results than Method A.",
                        "wrongThinking": "It's comparing the two methods, so TRUE.",
                        "correctThinking": "The passage says A > B, but statement says B > A → FALSE"
                    }
                },
                {
                    "id": 7,
                    "title": "Scope Errors",
                    "trap": "The statement makes a broader or narrower claim than the passage.",
                    "example": {
                        "passage": "The study found that children who read daily performed better in school.",
                        "statement": "Reading daily improves academic performance for all age groups.",
                        "wrongThinking": "Reading helps performance, TRUE.",
                        "correctThinking": "Passage is about children only; statement claims ALL age groups → NOT GIVEN"
                    }
                },
                {
                    "id": 8,
                    "title": "Partial Matches",
                    "trap": "Part of the statement is true, but another part is false or unconfirmed.",
                    "example": {
                        "passage": "Dr. Smith, a biologist from Oxford, published the findings in 2020.",
                        "statement": "Dr. Smith, a chemist from Oxford, published the findings in 2020.",
                        "analysis": [
                            "✓ From Oxford — TRUE",
                            "✓ Published in 2020 — TRUE",
                            "✗ Chemist — FALSE (passage says 'biologist')"
                        ],
                        "answer": "FALSE",
                        "reasoning": "One contradiction makes the whole statement false"
                    },
                    "rule": "Every part of the statement must be verified. One wrong element = FALSE."
                },
                {
                    "id": 9,
                    "title": "Misreading Negatives",
                    "trap": "Double negatives or negative constructions confuse you.",
                    "examples": [
                        {
                            "passageSays": "It is not impossible",
                            "means": "It IS possible",
                            "statement": "It is possible",
                            "answer": "TRUE"
                        },
                        {
                            "passageSays": "Few would disagree",
                            "means": "Most agree",
                            "statement": "Most people agree",
                            "answer": "TRUE"
                        },
                        {
                            "passageSays": "He was not unaware",
                            "means": "He WAS aware",
                            "statement": "He knew about it",
                            "answer": "TRUE"
                        },
                        {
                            "passageSays": "Not all students passed",
                            "means": "Some failed",
                            "statement": "Some students failed",
                            "answer": "TRUE"
                        }
                    ]
                },
                {
                    "id": 10,
                    "title": "Position Assumption",
                    "trap": "You assume statements at the end of the question set relate to the end of the passage.",
                    "reality": "While questions generally follow passage order, this isn't guaranteed. Always verify the location.",
                    "strategy": "Use keywords to locate the relevant section, don't rely on position alone."
                }
            ]
        }
        break

# Save updated file
with open('backend/data/reading-theory.json', 'w', encoding='utf-8') as f:
    json.dump(theory_data, f, indent=2, ensure_ascii=False)

print("✅ Successfully added Common Pitfalls section to T/F/NG theory!")
print("📊 Added 10 detailed mistake examples with explanations")
