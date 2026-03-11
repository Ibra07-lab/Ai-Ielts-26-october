import re

file_path = "c:\\Users\\Honor\\Desktop\\Новая папка (4)\\Ai-Ielts-26-october\\frontend\\data\\vocabulary\\business.ts"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
current_id = 1

for line in lines:
    if re.match(r'^\s*id:\s*\d+,', line):
        new_lines.append(re.sub(r'id:\s*\d+,', f'id: {current_id},', line))
        current_id += 1
    else:
        new_lines.append(line)

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print(f"Successfully renumbered IDs up to {current_id - 1}")
