import json
from pathlib import Path

# Load the full theory
theory_path = Path('backend/data/reading-theory.json')
with open(theory_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find T/F/NG theory
tfng = None
for qt in data['questionTypes']:
    if qt['id'] == 'true-false-not-given':
        tfng = qt
        break

if not tfng:
    print("Error: T/F/NG theory not found")
    exit(1)

# Extract compact theory
compact_theory = []

# 1. FALSE vs NOT GIVEN Distinction
compact_theory.append("=" * 60)
compact_theory.append("CRITICAL DISTINCTION: FALSE vs NOT GIVEN")
compact_theory.append("=" * 60)

if 'detailedTheory' in tfng and 'sections' in tfng['detailedTheory']:
    for section in tfng['detailedTheory']['sections']:
        if section['id'] == 'section-3':  # FALSE vs NOT GIVEN section
            for subsection in section.get('subsections', []):
                if subsection['id'] == 'core-difference':
                    compact_theory.append("\nFALSE:")
                    for item in subsection.get('comparison', {}).get('FALSE', []):
                        compact_theory.append(f"  • {item}")
                    compact_theory.append("\nNOT GIVEN:")
                    for item in subsection.get('comparison', {}).get('NOT_GIVEN', []):
                        compact_theory.append(f"  • {item}")
                
                elif subsection['id'] == 'two-question-test':
                    compact_theory.append("\nTWO-QUESTION TEST:")
                    for step in subsection.get('flowchart', []):
                        compact_theory.append(f"Step {step['step']}: {step['question']}")
                        if 'ifYes' in step:
                            compact_theory.append(f"  → If YES: {step['ifYes']}")
                        if 'ifNo' in step:
                            compact_theory.append(f"  → If NO: {step['ifNo']}")
                        if 'ifAgrees' in step:
                            compact_theory.append(f"  → If AGREES: {step['ifAgrees']}")
                        if 'ifContradicts' in step:
                            compact_theory.append(f"  → If CONTRADICTS: {step['ifContradicts']}")

# 2. Signal Words
compact_theory.append("\n" + "=" * 60)
compact_theory.append("CRITICAL SIGNAL WORDS")
compact_theory.append("=" * 60)

if 'signalWords' in tfng:
    sw = tfng['signalWords']
    
    # Qualifiers
    if 'qualifiers' in sw:
        compact_theory.append(f"\n{sw['qualifiers']['title']}:")
        for ex in sw['qualifiers'].get('examples', [])[:5]:  # Top 5
            compact_theory.append(f"  • \"{ex['passage']}\" → \"{ex['question']}\" = {ex['result']}")
    
    # Comparatives
    if 'comparatives' in sw:
        compact_theory.append(f"\n{sw['comparatives']['title']}:")
        for ex in sw['comparatives'].get('examples', []):
            compact_theory.append(f"  • \"{ex['passage']}\" → \"{ex['question']}\" = {ex['result']}")
    
    # Time Sequence
    if 'timeSequence' in sw:
        compact_theory.append(f"\n{sw['timeSequence']['title']}:")
        for ex in sw['timeSequence'].get('examples', []):
            compact_theory.append(f"  • \"{ex['passage']}\" → \"{ex['question']}\" = {ex['result']}")

# 3. Top 5 Common Mistakes
compact_theory.append("\n" + "=" * 60)
compact_theory.append("TOP 5 COMMON MISTAKES")
compact_theory.append("=" * 60)

if 'commonPitfalls' in tfng and 'mistakes' in tfng['commonPitfalls']:
    for mistake in tfng['commonPitfalls']['mistakes'][:5]:  # Top 5
        compact_theory.append(f"\n{mistake['id']}. {mistake['title']}")
        compact_theory.append(f"   Trap: {mistake['trap']}")
        if 'rule' in mistake:
            compact_theory.append(f"   Rule: {mistake['rule']}")
        if 'example' in mistake:
            ex = mistake['example']
            if 'wrongThinking' in ex and 'correctThinking' in ex:
                compact_theory.append(f"   ❌ Wrong: {ex['wrongThinking']}")
                compact_theory.append(f"   ✓ Correct: {ex['correctThinking']}")

# 4. Strategy Tips
compact_theory.append("\n" + "=" * 60)
compact_theory.append("5-STEP STRATEGY")
compact_theory.append("=" * 60)

if 'strategyTips' in tfng:
    for tip in tfng['strategyTips']:
        compact_theory.append(f"\nStep {tip['step']}: {tip['title']}")
        compact_theory.append(f"  {tip['description']}")

# Write to file
output_path = Path('app/prompts/tfng_theory_compact.txt')
output_content = '\n'.join(compact_theory)

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(output_content)

# Calculate size
char_count = len(output_content)
estimated_tokens = char_count // 4

print(f"✅ Compact theory created: {output_path}")
print(f"   Characters: {char_count:,}")
print(f"   Estimated tokens: ~{estimated_tokens:,}")
print(f"\nFirst 500 characters:")
print(output_content[:500])
