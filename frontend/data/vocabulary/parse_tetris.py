import re
import json

with open("temp_tetris.txt", "r", encoding="utf-8") as f:
    text = f.read()

parts = text.split("PART ")
results = []
set_id = 1

for part in parts[1:]:
    # Determine part index
    part_number = set_id
    set_name = f"Speaking Part {part_number}"
    if part_number == 3:
        set_name = "Speaking Part 3"

    lines = part.split("\n")
    
    # Extract word box
    word_bank = []
    for i, line in enumerate(lines):
        if "Word Box:" in line:
            for j in range(i+1, len(lines)):
                if lines[j].strip():
                    word_bank = [w.strip() for w in lines[j].split("/")]
                    break
            break

    # Extract questions
    items = []
    for i, line in enumerate(lines):
        if re.match(r'^\d+\.', line.strip()):
            item_id = int(re.match(r'^(\d+)\.', line.strip()).group(1))
            sentence = line.split(".", 1)[1].strip()
            # remove quotes if they exist at ends
            if sentence.startswith('"') and sentence.endswith('"'):
                sentence = sentence[1:-1]
            
            # answer on next line or line below
            answer = ""
            if i + 1 < len(lines) and "✅ Answer:" in lines[i+1]:
                answer = lines[i+1].split("✅ Answer:")[1].strip()
            else:
                for j in range(i+1, len(lines)):
                    if "✅ Answer:" in lines[j]:
                        answer = lines[j].split("✅ Answer:")[1].strip()
                        break

            items.append({
                "item_id": item_id,
                "gap_sentence": sentence,
                "answer": answer
            })

    results.append({
        "id": set_id,
        "set_name": set_name,
        "instruction": "Fill in the missing words to complete the sentences.",
        "word_bank": word_bank,
        "items": items
    })
    set_id += 1

# write to pure JS output for pasting
output = "[\n"
for r in results:
    opts = ", ".join([f'"{opt}"' for opt in r["word_bank"]])
    output += f'    {{\n'
    output += f'      id: {r["id"]},\n'
    output += f'      set_name: "{r["set_name"]}",\n'
    output += f'      instruction: "{r["instruction"]}",\n'
    output += f'      word_bank: [{opts}],\n'
    output += f'      items: [\n'
    for item in r["items"]:
        # Escape double quotes inside the sentence
        escaped_sentence = item['gap_sentence'].replace('"', '\\"')
        output += f'        {{ item_id: {item["item_id"]}, gap_sentence: "{escaped_sentence}", answer: "{item["answer"]}" }},\n'
    output += f'      ]\n'
    output += f'    }},\n'
output += "]\n"

with open("tetris_output.js", "w", encoding="utf-8") as f:
    f.write(output)
print("Parsed efficiently")
