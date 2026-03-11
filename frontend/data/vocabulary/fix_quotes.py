import re
import json

file_path = "c:\\\\Users\\\\Honor\\\\Desktop\\\\Новая папка (4)\\\\Ai-Ielts-26-october\\\\frontend\\\\data\\\\vocabulary\\\\business.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Specifically find the newly added words section block (ID 31 onwards)
start_marker = "        // BAND 6-8+ WRITING VOCABULARY"
start_idx = content.find(start_marker)

if start_idx == -1:
    print("Could not find start marker.")
    exit(1)

pre_content = content[:start_idx]
post_content = content[start_idx:]

# Find context: "..." and escape internal quotes
def replace_unquoted_context(match):
    prefix = match.group(1)
    inner_text = match.group(2)
    # Replace any " with \" inside the string
    # First, temporarily replace already escaped quotes to avoid double escaping
    inner_text = inner_text.replace('\\"', 'QUOTEMARKER')
    # Replace unescaped quotes
    inner_text = inner_text.replace('"', '\\"')
    # Restore escaped quotes
    inner_text = inner_text.replace('QUOTEMARKER', '\\"')
    
    return f'{prefix}"{inner_text}"'

# Context line replacements
post_content = re.sub(r'(context:\s*)"(.*)"', replace_unquoted_context, post_content)

# Same for definition, exampleSentence, speakingExample, writingExample if they have them
post_content = re.sub(r'(definition:\s*)"(.*)"', replace_unquoted_context, post_content)
post_content = re.sub(r'(exampleSentence:\s*)"(.*)"', replace_unquoted_context, post_content)
post_content = re.sub(r'(speakingExample:\s*)"(.*)"', replace_unquoted_context, post_content)
post_content = re.sub(r'(writingExample:\s*)"(.*)"', replace_unquoted_context, post_content)
# Collocations array items
# Better to not touch collocations via regex since it's a JSON array and already json.dumps'd in Python script

new_content = pre_content + post_content

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Fixed quotes in business.ts")
