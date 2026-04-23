import re

filepath = "c:/Users/Honor/Desktop/Новая папка (4)/Ai-Ielts-26-october/frontend/data/vocabulary/speaking-part3.ts"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace all topic: "General (...)" with topic: "Speaking Part 3"
new_content = re.sub(r'topic:\s*"General.*?"', 'topic: "Speaking Part 3"', content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Replacement successful")
