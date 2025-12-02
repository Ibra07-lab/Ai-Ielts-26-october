import os

# Calculate prompt sizes
files_to_check = {
    'System Prompt (backend)': 'backend/agents/prompts.py',
    'Feedback Template (app)': 'app/prompts/deeper_feedback.txt',
    'T/F/NG Theory': 'app/prompts/tfng_theory_compact.txt'
}

print("=" * 70)
print("FEEDBACK TOKEN USAGE BREAKDOWN")
print("=" * 70)
print()

sizes = {}
for name, path in files_to_check.items():
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            char_count = len(content)
            token_estimate = char_count // 4
            sizes[name] = {'chars': char_count, 'tokens': token_estimate}
    else:
        sizes[name] = {'chars': 0, 'tokens': 0}

# Display breakdown
total_tokens = 0
for name, data in sizes.items():
    print(f"{name:35} {data['chars']:6,} chars = ~{data['tokens']:5,} tokens")
    total_tokens += data['tokens']

print("-" * 70)
print(f"{'TOTAL PROMPTS':35} ~{total_tokens:6,} tokens")
print()

# Add variable costs per interaction
print("PLUS per interaction (variable):")
print(f"{'  Passage text':35} ~500-800 tokens")
print(f"{'  Question statement':35} ~20-50 tokens")
print(f"{'  Correct answer':35} ~5-10 tokens")
print(f"{'  Student answer':35} ~5-10 tokens")
print("-" * 70)
input_low = total_tokens + 530
input_high = total_tokens + 870
print(f"{'TOTAL INPUT (to LLM)':35} ~{input_low:,}-{input_high:,} tokens")
print()

print("OUTPUT (from LLM):")
print(f"{'  LLM Response (feedback)':35} ~300-500 tokens")
print("=" * 70)
grand_low = input_low + 300
grand_high = input_high + 500
print(f"{'GRAND TOTAL PER FEEDBACK':35} ~{grand_low:,}-{grand_high:,} tokens")
print()

# Cost estimate
input_cost_per_1k = 0.0025  # GPT-4 Turbo input pricing
output_cost_per_1k = 0.01   # GPT-4 Turbo output pricing

input_cost = ((input_low + input_high) / 2 / 1000) * input_cost_per_1k
output_cost = (400 / 1000) * output_cost_per_1k

total_cost = input_cost + output_cost

print(f"Estimated cost per feedback: ${total_cost:.4f}")
print()

# Breakdown by component
print("WHERE THE TOKENS GO:")
print(f"  System Prompt: ~{sizes.get('System Prompt (backend)', {}).get('tokens', 0):,} tokens (fixed)")
print(f"  T/F/NG Theory: ~{sizes.get('T/F/NG Theory', {}).get('tokens', 0):,} tokens (NEWLY ADDED)")
print(f"  Feedback Template: ~{sizes.get('Feedback Template (app)', {}).get('tokens', 0):,} tokens (fixed)")
print(f"  Passage + Q&A: ~500-850 tokens (variable, biggest component)")
print(f"  LLM Output: ~300-500 tokens (variable)")
