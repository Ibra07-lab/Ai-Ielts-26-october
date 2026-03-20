import os
import json

reading_dir = r"c:\Users\Honor\Desktop\Новая папка (4)\Ai-Ielts-26-october\backend\data\reading-tests"
reading_topics = set()

for f in os.listdir(reading_dir):
    if f.endswith(".json") and f != "backend-response.json":
        try:
            with open(os.path.join(reading_dir, f), encoding="utf-8") as file:
                data = json.load(file)
                for part in data.get("parts", []):
                    if "title" in part: 
                        reading_topics.add(part["title"].strip())
        except Exception: 
            pass

print("--- READING TOPICS ---")
for t in list(reading_topics)[:15]: 
    print(t)

listening_dir = r"c:\Users\Honor\Desktop\Новая папка (4)\Ai-Ielts-26-october\backend\data\listening-tests"
listening_context = []

for f in os.listdir(listening_dir):
    if f.endswith(".json"):
        try:
            with open(os.path.join(listening_dir, f), encoding="utf-8") as file:
                data = json.load(file)
                for t in data.get("transcripts", []):
                    if "lines" in t and len(t["lines"]) > 0:
                        text_start = t["lines"][0].get("text", "")[:100]
                        listening_context.append(f"{t.get('title', '')}: {text_start}")
        except Exception: 
            pass

print("\n--- LISTENING EXAMPLES ---")
for t in listening_context[:10]: 
    print(t)
