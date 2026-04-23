"""Quick smoke test for lexical_analysis utilities."""
from ielts_writing.utils.lexical_analysis import (
    detect_paraphrase_overlap,
    detect_word_repetition,
    compute_vocabulary_stats,
)

# Test 1: The EXACT scenario from the user's screenshot
# "bar chart shows average daily water consumption per person in five cities in 2010 and 2020, measured in litres per person per day"
question = "The bar chart shows the average daily water consumption per person in five cities in 2010 and 2020, measured in litres per person per day. Summarise the information by selecting and reporting the main features, and make comparisons where relevant."
essay = "The bar chart show the water use in five city in 2010 and 2020. The water is measure in litres per person per day."
result = detect_paraphrase_overlap(question, essay)
print("=== SCREENSHOT SCENARIO ===")
print(f"  Severity: {result['severity']}")
print(f"  Overlap:  {result['overlap_percentage']*100:.0f}%")
print(f"  Copied:   {result['overlap_words']}")
print()

# These should NOT appear:
bad_words = {'2010', '2020', 'five', 'per', 'day', 'litres', 'person'}
flagged_bad = bad_words & set(result['overlap_words'])
if flagged_bad:
    print(f"  FAIL - still flagging unfair words: {flagged_bad}")
else:
    print(f"  PASS - no years/numbers/units/prepositions flagged")

# These SHOULD appear (meaningful content words copied):
expected = {'water', 'bar', 'chart'}
flagged_good = expected & set(result['overlap_words'])
print(f"  Correctly flagged: {flagged_good}")
print()

# Verify overlap is much lower now
assert result['overlap_percentage'] < 0.6, f"Overlap should be < 60%, got {result['overlap_percentage']*100:.0f}%"
print(f"  Overlap {result['overlap_percentage']*100:.0f}% is reasonable (was 63% before fix)")
print()

# Test 2: Good paraphrase should still be 'none'
question2 = "The graph illustrates changes in population size across five countries."
essay2 = "The line chart depicts demographic shifts observed in five nations over a thirty-year period."
result2 = detect_paraphrase_overlap(question2, essay2)
print("=== GOOD PARAPHRASE ===")
print(f"  Severity: {result2['severity']}")
print(f"  Overlap:  {result2['overlap_percentage']*100:.0f}%")
assert result2["severity"] in ("none", "low"), f"Expected none/low, got {result2['severity']}"
print("  PASS")
print()

# Test 3: Full verbatim copy should still be critical
question3 = "The chart below shows the number of men and women in further education in Britain in three periods."
essay3 = "The chart shows the number of men and women in further education in Britain in three periods. In 1970, there were significantly more men than women."
result3 = detect_paraphrase_overlap(question3, essay3)
print("=== VERBATIM COPY ===")
print(f"  Severity: {result3['severity']}")
print(f"  Overlap:  {result3['overlap_percentage']*100:.0f}%")
print(f"  Copied:   {result3['overlap_words']}")
assert result3["severity"] in ("critical", "high"), f"Expected critical/high, got {result3['severity']}"
print("  PASS")
print()

print("All tests passed!")
