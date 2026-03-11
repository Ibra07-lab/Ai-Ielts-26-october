import re
import json

raw_data = """
 CONTEXT TETRIS — SPEAKING LIST
🔵 Band 6 Speaking Words
📦 Word Box:

job satisfaction / work-life balance / get promoted / dead-end job / boss / burn out / nine-to-five / make a living / team player / climb the ladder

1. "I think having a truly supportive and genuinely encouraging _____________ makes an absolutely enormous difference to how much you enjoy and look forward to going to work every single day — a great manager can completely transform your entire professional experience."

2. "My cousin spent several deeply frustrating years feeling completely trapped in a _____________ at a local supermarket before she finally gathered enough courage and determination to go back to college and completely retrain in a new field."

3. "I try my absolute best to maintain a healthy _____________ by strictly switching off all work emails after seven in the evening and making sure I dedicate proper quality time to my family and personal hobbies at the weekend."

4. "In highly competitive and fast-moving industries like finance and technology, the immense pressure young professionals feel to _____________ as quickly as possible can have genuinely serious and lasting negative consequences for their personal relationships and long-term mental health."

5. "It is becoming increasingly and worryingly difficult for talented young artists, musicians, and independent writers to _____________ from their creative work alone without also relying on a second source of income or significant family financial support."

6. "I would definitely and confidently describe myself as a _____________ — I genuinely prefer working collaboratively alongside other motivated and talented people rather than tackling every challenge entirely on my own."

7. "My older brother worked with extraordinary dedication and commitment for four years at his company and was finally rewarded when he _____________ to senior project manager last spring — the entire family was absolutely thrilled and incredibly proud of him."

8. "I think a lot of ambitious and talented young professionals in extremely high-pressure fields like emergency medicine and corporate law end up completely _____________ by their early thirties because the culture of chronic overworking is so deeply and dangerously embedded in those industries."

9. "I personally don't think the traditional _____________ model suits every type of worker — many highly creative and independent people are genuinely far more productive and motivated when they have the freedom to choose their own working hours."

10. "I genuinely believe that _____________ is ultimately more important than a high salary because if you dread going to work every single morning, no amount of financial compensation can truly make your working life feel worthwhile or meaningful."

✅ ANSWERS — Band 6 Speaking Context Tetris:

#	Answer
1	boss
2	dead-end job
3	work-life balance
4	climb the ladder
5	make a living
6	team player
7	got promoted
8	burning out
9	nine-to-five
10	job satisfaction
🟡 Band 7 Speaking Words — Context Tetris
📦 Word Box:

career prospects / self-employed / motivate / flexible working / skilled workers / under pressure / hands-on experience / give it your all / land a job / in the same boat

11. "I think strong and effective communication skills combined with genuine emotional intelligence are now absolutely essential qualities for anyone hoping to _____________ in virtually any competitive modern industry, regardless of their specific technical qualifications or academic background."

12. "I specifically and deliberately chose to study data science at university because the _____________ in the technology and artificial intelligence sector are genuinely exceptional and continue to grow at a remarkable and consistent rate."

13. "The summer internship I completed at a law firm last year was genuinely invaluable because the _____________ I gained by working on real client cases was worth so much more than anything I had previously learned from reading textbooks in a lecture hall."

14. "My uncle made the bold and life-changing decision to become _____________ five years ago when he launched his own independent electrical contracting business, and he has never once looked back or regretted that decision."

15. "I honestly think most recent graduates are completely _____________ when it comes to the incredibly frustrating challenge of securing their very first professional position — everyone has a university degree but almost no one has meaningful real-world work experience."

16. "The most effective and truly inspiring managers I have encountered are those who genuinely understand how to _____________ their team not through fear or financial incentives alone, but by recognising individual strengths, fostering genuine purpose, and creating an environment where people feel truly valued."

17. "I personally perform considerably better when I am working _____________ — I find that having a demanding deadline and high expectations actually sharpens my focus and consistently brings out the very best in my work."

18. "My mother's company introduced comprehensive _____________ arrangements after the pandemic ended, and she reports that both her productivity levels and her overall sense of job satisfaction have increased significantly and measurably as a direct result."

19. "There is a genuinely serious and growing shortage of _____________ in the healthcare and construction sectors in my country, which is creating significant operational challenges and pushing up costs across both industries."

20. "I genuinely and wholeheartedly believe that if you are truly committed to doing something professionally and building a meaningful career, you absolutely must _____________ every single day — working half-heartedly or with minimal effort never produces results that you can look back on with genuine pride."

✅ ANSWERS — Band 7 Speaking Context Tetris:

#	Answer
11	land a job
12	career prospects
13	hands-on experience
14	self-employed
15	in the same boat
16	motivate
17	under pressure
18	flexible working
19	skilled workers
20	give it your all
🔴 Band 8+ Speaking Words — Context Tetris
📦 Word Box:

corporate culture / glass ceiling / entrepreneurial spirit / cutthroat competition / think outside the box / pushing the boundaries / make or break / at the forefront / steep learning curve / go the extra mile

21. "I think the first six months of any completely new professional role inevitably presents a genuine _____________ — there is simply so much to learn simultaneously about the technical aspects of the work, the internal processes, and the often complex social dynamics of the team."

22. "Companies that are genuinely _____________ of their industries — constantly innovating, questioning assumptions, and setting new standards — are the ones that consistently attract the most talented and ambitious professionals who want to be part of something truly significant."

23. "I strongly believe that schools and universities have a fundamental responsibility to actively nurture the _____________ in young people from the earliest possible age — teaching them not just to seek employment but to create it, innovate, and build something meaningful of their own."

24. "I think one of the primary reasons that particular company has such a phenomenal reputation as an employer is that their _____________ is genuinely and authentically built around employee wellbeing, creative freedom, and a deep and sincere commitment to continuous learning."

25. "The _____________ that characterises the technology startup world means that companies which fail to innovate rapidly, adapt continuously, and differentiate themselves meaningfully from competitors will simply not survive beyond their first few critical years of operation."

26. "I have the deepest admiration for the professionals and pioneers in any field who are consistently willing to keep _____________ of what is conventionally considered possible — it is precisely that kind of courageous and restless ambition that drives all meaningful human progress."

27. "Despite decades of social progress, legislative reform, and increased public awareness, I genuinely believe the _____________ still exists in a very real and measurable way across many industries — the persistent and striking underrepresentation of women in the most senior executive positions is impossible to explain any other way."

28. "The truly outstanding customer service representatives I have encountered in my life are always the ones who are genuinely and consistently willing to _____________ — not because they are required to by company policy, but because they take authentic personal pride in delivering an exceptional experience every time."

29. "The first major product launch of a new technology startup is truly a _____________ moment — if it resonates with consumers and generates genuine excitement, the company has a future; if it fails to connect, the business may never fully recover its momentum or investor confidence."

30. "In today's extraordinarily complex and rapidly evolving business environment, the professionals who consistently add the most value are those with the rare and precious ability to _____________ — to approach familiar problems from completely unexpected angles and generate solutions that nobody else had previously considered."

✅ ANSWERS — Band 8+ Speaking Context Tetris:

#	Answer
21	steep learning curve
22	at the forefront
23	entrepreneurial spirit
24	corporate culture
25	cutthroat competition
26	pushing the boundaries
27	glass ceiling
28	go the extra mile
29	make or break
30	think outside the box
"""

import re
import json

def parse_set(raw_text, set_idx, set_name):
    res = {
        "id": set_idx,
        "set_name": set_name,
        "instruction": "Drag the correct term to complete each sentence.",
    }
    
    # Extract word box
    word_box_match = re.search(r'📦 Word Box:\n\n(.*?)\n', raw_text)
    words = [w.strip() for w in word_box_match.group(1).split('/')]
    res["word_bank"] = words
    
    # Extract answers
    answers_text = re.search(r'#\tAnswer\n(.*)', raw_text, re.DOTALL)
    if answers_text:
        answers_str = answers_text.group(1).strip()
    else:
        answers_text = re.search(r'# Answers?:\n(.*)', raw_text, re.DOTALL)
        if answers_text:
            answers_str = answers_text.group(1).strip()
        else:
            answers_str = ""

    answers = {}
    for line in answers_str.split('\n'):
        if line.strip():
            # support "1 boss" or "1\tboss"
            parts = line.strip().split(maxsplit=1)
            if len(parts) == 2:
                answers[parts[0]] = parts[1]
                
    # Extract questions
    sentences_data = []
    question_lines = re.findall(r'(\d+)\.\s+"(.*?)"', raw_text)
    
    for q_num, q_text in question_lines:
        ans = answers.get(q_num, "")
        
        # Replace the literal '_____________' with '___'
        gap_sentence = re.sub(r'_{4,}', '___', q_text)
        # Escape quotes
        gap_sentence = gap_sentence.replace('"', '\\"')
        ans = ans.replace('"', '\\"')
        
        item = {
            "item_id": int(q_num),
            "gap_sentence": gap_sentence,
            "answer": ans
        }
        sentences_data.append(item)
        
    res["items"] = sentences_data
    return res

parts = raw_data.split('🟡 Band 7 Speaking Words — Context Tetris')
part1 = parts[0]
part2and3 = parts[1].split('🔴 Band 8+ Speaking Words — Context Tetris')
part2 = part2and3[0]
part3 = part2and3[1]


parsed_sets = [
    parse_set(part1, 1, "Speaking Context Tetris (Band 6)"),
    parse_set(part2, 2, "Speaking Context Tetris (Band 7)"),
    parse_set(part3, 3, "Speaking Context Tetris (Band 8+)")
]

ts_objects = []
for p_set in parsed_sets:
    items_ts = []
    for item in p_set["items"]:
        items_ts.append(f"""                    {{
                        item_id: {item['item_id']},
                        gap_sentence: "{item['gap_sentence']}",
                        answer: "{item['answer']}"
                    }}""")
    items_str = ",\n".join(items_ts)
    word_bank_str = ",\n".join([f'                    "{w}"' for w in p_set["word_bank"]])
    
    ts_objects.append(f"""            {{
                id: {p_set["id"]},
                set_name: "{p_set["set_name"]}",
                instruction: "{p_set["instruction"]}",
                word_bank: [
{word_bank_str}
                ],
                items: [
{items_str}
                ]
            }}""")

ts_array_content = ",\n".join(ts_objects)

ts_replacement = f"contextTetris: [\n{ts_array_content}\n        ],"

file_path = "c:\\\\Users\\\\Honor\\\\Desktop\\\\Новая папка (4)\\\\Ai-Ielts-26-october\\\\frontend\\\\data\\\\vocabulary\\\\business.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I need to replace the ENTIRE existing contextTetris array.
# The previous array started with `contextTetris: []`
# Let's use regex to replace it. Be careful, sometimes it's `contextTetris: []` or `contextTetris: [\n...   ]`
content = re.sub(r'contextTetris:\s*\[\s*\]\s*,?', ts_replacement, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Replaced contextTetris exercises in business.ts!")
