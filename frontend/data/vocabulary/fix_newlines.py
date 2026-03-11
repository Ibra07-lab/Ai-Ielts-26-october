import re

file_path = "c:\\\\Users\\\\Honor\\\\Desktop\\\\Новая папка (4)\\\\Ai-Ielts-26-october\\\\frontend\\\\data\\\\vocabulary\\\\business.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace literal \n followed by spaces and { with actual newline
content = content.replace("}, \\n        {", "},\n        {")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed literal newlines in business.ts")
