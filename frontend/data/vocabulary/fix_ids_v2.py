import re

file_path = "c:\\Users\\Honor\\Desktop\\Новая папка (4)\\Ai-Ielts-26-october\\frontend\\data\\vocabulary\\business.ts"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
current_word_id = 1
in_words_array = False

for line in lines:
    if "words: [" in line:
        in_words_array = True
        new_lines.append(line)
        continue
    
    if in_words_array and re.match(r'^\s*id:\s*\d+,', line):
        new_lines.append(re.sub(r'id:\s*\d+,', f'id: {current_word_id},', line))
        current_word_id += 1
    elif not in_words_array and re.match(r'^\s*id:\s*\d+,', line):
        new_lines.append(re.sub(r'id:\s*\d+,', f'id: 1,', line)) # Keep topic id as 1
    else:
        new_lines.append(line)

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print(f"Successfully renumbered word IDs up to {current_word_id - 1}")
