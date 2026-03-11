import re
import json

raw_data = """
CONTEXT TETRIS — WRITING LIST
🔵 Band 6 Writing Words — Context Tetris
📦 Word Box:

employment / workforce / salary / unemployment / productivity / career development / employees / employers / wages / profession

1. "The teaching _____________ is chronically and scandalously undervalued in many countries, despite the indisputable fact that teachers play an absolutely fundamental and irreplaceable role in shaping the intellectual and social development of entire generations of citizens."

2. "Research consistently and convincingly demonstrates that _____________ who feel genuinely valued, professionally supported, and meaningfully recognised consistently demonstrate significantly higher levels of commitment, creativity, and overall job performance than those who feel overlooked and underappreciated."

3. "Rising youth _____________ rates represent one of the most pressing, urgent, and consequential social and economic challenges currently facing governments across the developed world in the difficult aftermath of the global pandemic."

4. "As automation continues to advance at an unprecedented and accelerating rate, governments have an urgent responsibility to retrain and comprehensively upskill their _____________ to meet the fundamentally transformed demands of the modern economy."

5. "The persistent and deeply troubling gap between the extraordinarily generous compensation of senior executives and the stagnant _____________ of ordinary frontline workers raises profoundly serious questions about economic fairness and social justice in contemporary capitalism."

6. "It has been conclusively and repeatedly demonstrated through peer-reviewed research that _____________ who maintain a genuinely healthy and sustainable work-life balance consistently show significantly higher levels of _____________ and creative output than those who are routinely and chronically overworked."

7. "Companies that invest meaningfully, generously, and consistently in the _____________ of their staff — through targeted training programmes, mentorship opportunities, and clear advancement pathways — consistently report higher retention rates, greater employee loyalty, and measurably improved overall performance."

8. "Governments have a fundamental and non-negotiable responsibility to create and actively sustain stable _____________ opportunities for all citizens, particularly during periods of severe economic downturn and widespread financial instability."

9. "Many _____________ now consider emotional intelligence, adaptability, and strong interpersonal communication skills to be equally or more important than purely technical qualifications when evaluating and selecting candidates for senior professional positions."

10. "While a highly competitive _____________ is undoubtedly an important factor in attracting talented candidates to an organisation, research consistently demonstrates that non-financial factors such as meaningful work and genuine professional autonomy are equally critical in retaining them over the long term."

✅ ANSWERS — Band 6 Writing Context Tetris:

#	Answer
1	profession
2	employees
3	unemployment
4	workforce
5	wages
6	employees / productivity
7	career development
8	employment
9	employers
10	salary
🟡 Band 7 Writing Words — Context Tetris
📦 Word Box:

economic growth / automation / globalisation / entrepreneurship / labour market / gender pay gap / multinational corporations / corporate social responsibility / income inequality / occupational hazard

11. "While rapid _____________ undeniably creates new employment opportunities and raises general living standards, it frequently and inevitably comes at a significant and often irreversible environmental cost that future generations will ultimately be forced to bear."

12. "The accelerating rise of _____________ and artificial intelligence poses a profound, urgent, and deeply complex challenge to governments worldwide, as entire established categories of employment face the very real and imminent threat of becoming permanently obsolete within a single generation."

13. "While _____________ have undeniably generated significant employment and stimulated considerable economic activity in many countries where they operate, they have also been widely and justifiably criticised for exploiting cheaper labour markets, systematically avoiding their full tax obligations, and undermining local businesses."

14. "The persistent _____________ in many developed economies reflects deeply embedded structural inequalities in the workplace that cannot be adequately or lastingly resolved through legislation alone but require fundamental, sustained, and long-term cultural and organisational transformation."

15. "Fostering a genuine and widespread culture of _____________ through carefully targeted education programmes, accessible startup funding mechanisms, and supportive regulatory environments is essential for driving meaningful innovation and sustaining long-term national economic competitiveness."

16. "Governments must continuously, carefully, and responsively monitor shifting _____________ trends to ensure that their national education and vocational training systems are adequately and relevantly preparing citizens for the rapidly evolving demands of the modern working world."

17. "There is a growing, compelling, and increasingly mainstream argument that _____________ should be legally mandated and independently verified rather than left entirely to the voluntary discretion of individual companies, many of which prioritise short-term shareholder profit above genuine social and environmental obligations."

18. "Rising _____________ — in which an increasingly small and privileged proportion of the population controls an ever-larger share of total national wealth — poses a fundamental and potentially destabilising threat to long-term social cohesion, democratic stability, and sustainable economic health."

19. "Chronic back pain, post-traumatic stress disorder, and repetitive strain injuries are extensively documented _____________ across the healthcare, emergency services, and manufacturing sectors respectively — highlighting the urgent need for stronger workplace health and safety regulation."

20. "While _____________ has unquestionably created enormous economic opportunities and driven unprecedented levels of international trade and cultural exchange, it has simultaneously contributed to the deindustrialisation of many developed economies and the painful displacement of large sections of the traditional working class."

✅ ANSWERS — Band 7 Writing Context Tetris:

#	Answer
11	economic growth
12	automation
13	multinational corporations
14	gender pay gap
15	entrepreneurship
16	labour market
17	corporate social responsibility
18	income inequality
19	occupational hazards
20	globalisation
🔴 Band 8+ Writing Words — Context Tetris
📦 Word Box:

socioeconomic mobility / remuneration package / organisational restructuring / meritocracy / precarious employment / intellectual capital / exploitation of labour / collective bargaining / knowledge economy / structural unemployment

21. "In the rapidly evolving and increasingly competitive _____________, the demonstrated ability to think critically, collaborate effectively across diverse teams, and adapt continuously to new technologies is becoming far more economically valuable than the possession of any single fixed or static set of technical skills."

22. "The alarming proliferation of _____________ arrangements — including zero-hours contracts, temporary agency work, and gig economy platform labour — is systematically eroding the financial security and hard-won social protections that previous generations of workers fought long and hard to establish."

23. "While a genuinely attractive _____________ undoubtedly plays an important role in recruiting top-tier talent, research consistently demonstrates that non-financial factors such as meaningful work, genuine autonomy, and clear professional growth pathways are equally — if not more — critical in retaining high-performing employees over the long term."

24. "The systematic erosion of _____________ rights — driven by aggressive deregulation, the rapid casualisation of the workforce, and the openly anti-union stance of many powerful corporations — has fundamentally and perhaps irreversibly shifted the balance of power in the employer-employee relationship to the severe disadvantage of ordinary workers."

25. "Despite the widespread and appealing corporate rhetoric about _____________, the persistent and statistically significant advantages enjoyed by candidates from elite educational institutions and privileged social networks suggest that many workplaces remain far from genuinely merit-based in their actual recruitment and promotion decisions."

26. "_____________ — arising directly from the permanent displacement of workers by advancing automation and the fundamental reorganisation of entire industries — represents a categorically different and far more complex policy challenge than the cyclical unemployment that merely accompanies ordinary economic downturns."

27. "_____________ in global supply chains — where workers in developing nations are routinely subjected to poverty-level wages, genuinely dangerous conditions, and the systematic denial of internationally recognised basic rights — represents one of the most serious and morally urgent challenges facing international business regulation today."

28. "When corporate recruitment processes systematically favour candidates from privileged backgrounds, they actively undermine _____________ and perpetuate a deeply entrenched cycle of inequality that no society genuinely aspiring to fairness and equal opportunity should tolerate."

29. "The world-leading technology company's most commercially valuable and strategically irreplaceable asset is not its vast physical infrastructure or impressive financial reserves, but rather the extraordinary _____________ represented by its exceptional and carefully cultivated team of world-class engineers, designers, and research scientists."

30. "While large-scale _____________ may sometimes be a commercially necessary response to rapidly changing market conditions or disruptive technological change, it frequently results in significant and lasting human costs — including mass redundancies, community decline, and long-term psychological harm — that governments and social systems are woefully underprepared to absorb."

✅ ANSWERS — Band 8+ Writing Context Tetris:

#	Answer
21	knowledge economy
22	precarious employment
23	remuneration package
24	collective bargaining
25	meritocracy
26	structural unemployment
27	exploitation of labour
28	socioeconomic mobility
29	intellectual capital
30	organisational restructuring
"""

import re
import json

sets = [
    {
        "set_name": "Writing Context Tetris (Band 6)",
        "instruction": "Drag the correct term to complete each sentence.",
        "start_marker": "🔵 Band 6",
        "end_marker": "🟡 Band 7",
        "item_id_start": 31
    },
    {
        "set_name": "Writing Context Tetris (Band 7)",
        "instruction": "Drag the correct term to complete each sentence.",
        "start_marker": "🟡 Band 7",
        "end_marker": "🔴 Band 8+",
        "item_id_start": 41
    },
    {
        "set_name": "Writing Context Tetris (Band 8+)",
        "instruction": "Drag the correct term to complete each sentence.",
        "start_marker": "🔴 Band 8+",
        "end_marker": None,
        "item_id_start": 51
    }
]

parsed_sets = []

for s in sets:
    if s["end_marker"]:
        pattern = f"{re.escape(s['start_marker'])}(.*?)(?={re.escape(s['end_marker'])})"
        block_match = re.search(pattern, raw_data, re.DOTALL)
    else:
        pattern = f"{re.escape(s['start_marker'])}(.*)"
        block_match = re.search(pattern, raw_data, re.DOTALL)
        
    if not block_match:
        continue
    
    block = block_match.group(1)
    
    # word bank
    word_bank_match = re.search(r'📦 Word Box:\n\n(.*?)\n', block)
    word_bank_str = word_bank_match.group(1).strip()
    word_bank = [w.strip() for w in word_bank_str.split(' / ')]
    
    # answers table
    ans_text_match = re.search(r'#\tAnswer\n(.*)$', block, re.DOTALL)
    ans_text = ans_text_match.group(1).strip()
    ans_lines = ans_text.split('\n')
    answers = {}
    for line in ans_lines:
        parts = line.split('\t')
        if len(parts) >= 2:
            num = parts[0].strip()
            ans = parts[1].strip()
            # If answer is 'occupational hazards' but 'occupational hazard' is in word bank, we'll keep the one in the answer
            answers[num] = ans

    # questions
    questions = []
    q_matches = re.finditer(r'(\d+)\.\s+"(.*?)"', block)
    for q_match in q_matches:
        num = q_match.group(1)
        sentence = q_match.group(2)
        
        # replace _____________ with ___
        gap_sentence = re.sub(r'_{5,}', '___', sentence)
        
        answer = answers.get(num, '')
        
        # Special case: Q6 has 2 blanks in the user text: "_____________ who maintain ... higher levels of _____________".
        # We need to map it properly or skip. ContextTetris only supports 1 gap per sentence per item in our new format.
        # Wait, the user text for Q6 says:
        # 6. "It has been conclusively and repeatedly demonstrated through peer-reviewed research that _____________ who maintain a genuinely healthy and sustainable work-life balance consistently show significantly higher levels of _____________ and creative output than those who are routinely and chronically overworked."
        # Answer: 6	employees / productivity
        # The new format `item.gap_sentence` actually splits by '___' and replaces it, but only takes one answer. 
        # Actually our React renderer handles this?
        # Let's check ContextTetris.tsx later, but for now we can either split them into 2 items or just keep the answer as 'employees' and assume only 1 gap. 
        # Or I will manually correct Q6 to just have one gap. 
        if num == "6":
             # We make it two items or manually fix it. The word bank has both.
             # Actually, let's keep the raw format and I'll adjust the TS string manually if needed.
             pass
        
        questions.append({
            "num": num,
            "gap_sentence": gap_sentence,
            "answer": answer
        })
        
    parsed_sets.append({
        "set_name": s["set_name"],
        "instruction": s["instruction"],
        "word_bank": word_bank,
        "items": questions
    })

# Format to TS
ts_sets = []
id_counter = 4 # contextTetris in business.ts already has id 1, 2, 3
item_id_counter = 31

for s in parsed_sets:
    word_bank_ts = ",\n".join([f'                    "{w}"' for w in s['word_bank']])
    
    items_ts = []
    for item in s['items']:
        ans = item['answer']
        if item['num'] == '6':
            # Handle the double gap
            items_ts.append(f"""                    {{
                        item_id: {item_id_counter},
                        gap_sentence: "It has been conclusively and repeatedly demonstrated through peer-reviewed research that ___ who maintain a genuinely healthy and sustainable work-life balance consistently show significantly higher levels of productivity and creative output than those who are routinely and chronically overworked.",
                        answer: "employees"
                    }}""")
            item_id_counter += 1
            items_ts.append(f"""                    {{
                        item_id: {item_id_counter},
                        gap_sentence: "It has been conclusively and repeatedly demonstrated through peer-reviewed research that employees who maintain a genuinely healthy and sustainable work-life balance consistently show significantly higher levels of ___ and creative output than those who are routinely and chronically overworked.",
                        answer: "productivity"
                    }}""")
            item_id_counter += 1
        else:
             items_ts.append(f"""                    {{
                        item_id: {item_id_counter},
                        gap_sentence: "{item['gap_sentence']}",
                        answer: "{ans}"
                    }}""")
             item_id_counter += 1
        
    items_array_ts = ",\n".join(items_ts)
    
    ts_sets.append(f"""            {{
                id: {id_counter},
                set_name: "{s['set_name']}",
                instruction: "{s['instruction']}",
                word_bank: [
{word_bank_ts}
                ],
                items: [
{items_array_ts}
                ]
            }}""")
    id_counter += 1

ts_final = ",\n".join(ts_sets)

# Append to contextTetris
file_path = "c:\\\\Users\\\\Honor\\\\Desktop\\\\Новая папка (4)\\\\Ai-Ielts-26-october\\\\frontend\\\\data\\\\vocabulary\\\\business.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I need to find the end of the contextTetris array
# we can look for "speakToUnlock: [" and insert it right before that.
# First, add a comma to the last item if needed.
import re

def insert_before(target_array, new_content):
    global content
    # Find match and insert
    match = re.search(r'(\n\s{8}speakToUnlock:\s*\[)', content)
    if match:
        content = content[:match.start()] + ",\n" + new_content + match.group(0) + content[match.end():]

insert_before('speakToUnlock', ts_final)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Added {len(parsed_sets)} sets to contextTetris.")
