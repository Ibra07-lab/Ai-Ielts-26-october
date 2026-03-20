
import re

with open("c:/Users/Honor/Desktop/Новая папка (4)/Ai-Ielts-26-october/frontend/pages/ReadingPractice.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# Replace RadioGroupItem classes
code = code.replace(
    "className=\"h-5 w-5\"", 
    "className={getRadioSizeClass()}"
)

# Replace Label classes
code = code.replace(
    "className=\"text-base font-medium cursor-pointer leading-relaxed\"", 
    "className={`${getLabelSizeClass()} cursor-pointer`}"
)
code = code.replace(
    "className={`text-base font-medium leading-relaxed cursor-pointer ${isUsedElsewhere ? 'text-red-500 line-through opacity-50' : '}`}", 
    "className={`${getLabelSizeClass()} cursor-pointer ${isUsedElsewhere ? 'text-red-500 line-through opacity-50' : '}`}"
)
code = code.replace(
    "className=\"text-base font-medium leading-relaxed cursor-pointer\"", 
    "className={`${getLabelSizeClass()} cursor-pointer`}"
)

# Replace TextHighlighter in questions with scaling class
code = re.sub(
    r"(<TextHighlighter\s+content=\{.*?\}\s+passageTitle=\{.*?\}\s+highlights=\{.*?\}\s+onHighlightsChange=\{.*?\}\s+showLabels=\{false\}\s+)",
    r"\1className={getQuestionTextSize()}\n              ",
    code
)

with open("c:/Users/Honor/Desktop/Новая папка (4)/Ai-Ielts-26-october/frontend/pages/ReadingPractice.tsx", "w", encoding="utf-8") as f:
    f.write(code)

print("Done")

