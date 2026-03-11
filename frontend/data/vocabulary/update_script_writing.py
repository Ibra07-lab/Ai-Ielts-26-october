import re
import json

raw_data = """
1. EMPLOYMENT (noun)

Definition: The condition of having a paid job; the state of being employed by a company or organisation
Collocation: full employment, employment rate, seek employment, employment opportunities, employment sector
Real Life Example: "The government launched a new initiative aimed at creating thousands of employment opportunities in the renewable energy sector."
IELTS Writing Example: "Governments have a fundamental responsibility to create and sustain stable employment opportunities for all citizens, particularly during periods of economic downturn."
✍️ Examiner's Tip: "Employment" is a key foundational term for any writing task about work — always prefer it over the informal "job" in your Task 2 essays.
2. WORKFORCE (noun)

Definition: All the people engaged in or available for work, either in a country, industry, or company
Collocation: skilled workforce, ageing workforce, diverse workforce, workforce development, enter the workforce
Real Life Example: "The technology company invested heavily in workforce development programmes to ensure all employees had up-to-date digital skills."
IELTS Writing Example: "As automation continues to advance at an unprecedented rate, governments must take urgent steps to retrain and upskill their workforce to meet the demands of a fundamentally transformed economy."
✍️ Examiner's Tip: "Workforce" is far more formal and academically appropriate than "workers" or "employees" and should be used consistently in Task 2 writing.
3. SALARY (noun)

Definition: A fixed regular payment, typically paid monthly, made by an employer to an employee in return for their work
Collocation: competitive salary, salary increase, annual salary, salary package, negotiate a salary
Real Life Example: "After three years of exceptional performance reviews, she successfully negotiated a significant salary increase and a comprehensive benefits package."
IELTS Writing Example: "While a competitive salary is undoubtedly important, research consistently demonstrates that employees who receive meaningful recognition and professional development opportunities tend to be significantly more productive and loyal."
✍️ Examiner's Tip: In writing, always use "salary" rather than "pay" or "money" — the more precise your vocabulary, the higher your Lexical Resource score.
4. UNEMPLOYMENT (noun)

Definition: The state of not having a job despite being willing and able to work; the proportion of people without work in a society
Collocation: unemployment rate, rise in unemployment, tackle unemployment, youth unemployment, long-term unemployment
Real Life Example: "Youth unemployment in the region reached a record high of thirty percent following the closure of several major manufacturing plants."
IELTS Writing Example: "Rising unemployment rates, particularly among young people, represent one of the most pressing social and economic challenges facing governments in the post-pandemic era."
✍️ Examiner's Tip: Always try to add a specific modifier before "unemployment" — such as "youth unemployment" or "long-term unemployment" — to show precision and sophistication.
5. PRODUCTIVITY (noun)

Definition: The efficiency with which goods are produced or tasks are completed; the rate of output per unit of input in a workplace
Collocation: increase productivity, high productivity, low productivity, boost productivity, workplace productivity
Real Life Example: "The introduction of flexible working hours led to a measurable twenty percent increase in overall employee productivity within just six months."
IELTS Writing Example: "It has been widely demonstrated that employees who maintain a healthy work-life balance consistently demonstrate higher levels of productivity and creativity than those who are routinely overworked."
✍️ Examiner's Tip: "Productivity" is an essential academic word for business writing — it belongs to the Academic Word List and will contribute directly to your Lexical Resource score.
6. CAREER DEVELOPMENT (noun phrase)

Definition: The ongoing process of managing and improving one's professional skills, experiences, and advancement throughout a working life
Collocation: invest in career development, career development opportunities, support career development, career development programme
Real Life Example: "The multinational corporation offered all employees an annual budget of two thousand dollars specifically dedicated to career development activities such as courses and conferences."
IELTS Writing Example: "Companies that invest meaningfully in the career development of their employees consistently report higher retention rates, greater staff loyalty, and significantly improved overall performance."
✍️ Examiner's Tip: Using noun phrases like "career development" instead of simpler expressions like "getting better at work" is exactly the kind of lexical upgrade that moves you from Band 6 to Band 7.
7. EMPLOYEE (noun)

Definition: A person who is hired and paid to work for a company, organisation, or individual employer
Collocation: motivate employees, retain employees, employee rights, employee benefits, employee satisfaction
Real Life Example: "The survey revealed that over sixty percent of employees felt their contributions were not adequately recognised or rewarded by their managers."
IELTS Writing Example: "Organisations that prioritise employee wellbeing and professional growth consistently outperform those that treat their workforce purely as a means of generating profit."
✍️ Examiner's Tip: In academic writing, always use "employee" rather than "worker" — and try to use it alongside strong collocations like "employee retention" or "employee satisfaction" to show range.
8. EMPLOYER (noun)

Definition: A person, company, or organisation that hires and pays people to work for them
Collocation: potential employer, employer responsibilities, attract employers, employer expectations, employer-employee relationship
Real Life Example: "Many employers now consider emotional intelligence and communication skills to be just as important as technical qualifications when evaluating job candidates."
IELTS Writing Example: "Employers have a legal and ethical responsibility to provide safe, fair, and non-discriminatory working conditions for all members of their workforce."
✍️ Examiner's Tip: The employer-employee relationship is a very common theme in IELTS Writing Task 2 business questions — having both words ready with strong collocations is essential.
9. WAGES (noun)

Definition: Regular payment made to a worker, typically calculated on an hourly or daily basis for manual or routine work
Collocation: minimum wages, raise wages, low wages, fair wages, wage gap, wage growth
Real Life Example: "The government announced plans to raise the national minimum wage by eight percent in response to growing pressure from trade unions and workers' rights groups."
IELTS Writing Example: "The persistent and widening gap between executive compensation packages and the wages of ordinary frontline workers raises serious and legitimate questions about economic fairness and social justice."
✍️ Examiner's Tip: Understanding the difference between "salary" (monthly, professional) and "wages" (hourly, manual) and using each correctly demonstrates sophisticated lexical awareness.
10. PROFESSION (noun)

Definition: A paid occupation — especially one that requires prolonged training, formal education, and a formal qualification
Collocation: choose a profession, enter a profession, professional qualifications, respected profession, demanding profession
Real Life Example: "Medicine is widely regarded as one of the most rewarding yet simultaneously most demanding and emotionally challenging professions a person can enter."
IELTS Writing Example: "The teaching profession is chronically undervalued and underfunded in many countries, despite the fact that teachers play an absolutely fundamental role in shaping the intellectual and social development of entire generations."
✍️ Examiner's Tip: "Profession" is significantly more formal and appropriate than "job" in academic writing — always make this upgrade in your Task 2 essays.
11. ECONOMIC GROWTH (noun phrase)

Definition: The increase in a country's production of goods and services, typically measured as a rise in Gross Domestic Product
Collocation: stimulate economic growth, sustain economic growth, economic growth rate, drive economic growth
Real Life Example: "The government's decision to invest heavily in infrastructure projects was specifically designed to stimulate economic growth and create thousands of new jobs."
IELTS Writing Example: "While rapid economic growth undoubtedly creates employment opportunities and raises living standards, it frequently comes at a significant and often irreversible environmental cost that future generations will be forced to bear."
✍️ Examiner's Tip: This phrase appears in a huge proportion of IELTS Task 2 business essays — having it ready with strong collocations and a sophisticated sentence structure will serve you extremely well.
12. AUTOMATION (noun)

Definition: The use of largely automatic equipment, technology, or computer systems to perform tasks that were previously carried out by human workers
Collocation: rise of automation, automation replaces jobs, impact of automation, resist automation, embrace automation
Real Life Example: "The widespread automation of assembly line processes in the automotive industry has dramatically reduced production costs while simultaneously eliminating hundreds of thousands of manual jobs."
IELTS Writing Example: "The accelerating rise of automation and artificial intelligence poses a profound and urgent challenge to governments worldwide, as entire categories of employment face the very real threat of becoming obsolete within a generation."
✍️ Examiner's Tip: "Automation" is one of the hottest and most frequently examined topics in recent IELTS Writing Task 2 papers — knowing this word deeply is absolutely essential.
13. GLOBALISATION (noun)

Definition: The process by which businesses, economies, cultures, and governments become increasingly interconnected and integrated across international borders
Collocation: impact of globalisation, accelerate globalisation, globalisation of markets, benefits of globalisation, resist globalisation
Real Life Example: "Globalisation has fundamentally transformed the fashion industry, enabling companies to source materials from dozens of different countries and sell products in markets they could never previously have reached."
IELTS Writing Example: "While globalisation has undeniably created enormous economic opportunities and driven unprecedented levels of international trade, it has simultaneously contributed to the deindustrialisation of many developed economies and the displacement of large sections of the traditional workforce."
✍️ Examiner's Tip: This is a high-value academic word that demonstrates sophisticated understanding of economic and social systems — use it confidently in Task 2 essays about business and work.
14. ENTREPRENEURSHIP (noun)

Definition: The activity of setting up and running a business, taking on financial risks in the hope of generating profit and creating value
Collocation: promote entrepreneurship, support entrepreneurship, culture of entrepreneurship, entrepreneurship education, rise in entrepreneurship
Real Life Example: "The government introduced a range of financial incentives and mentorship programmes specifically designed to promote entrepreneurship among young people from disadvantaged backgrounds."
IELTS Writing Example: "Fostering a culture of entrepreneurship through targeted education programmes and accessible startup funding is essential for driving innovation, creating employment, and sustaining long-term national economic competitiveness."
✍️ Examiner's Tip: Moving from the adjective "entrepreneurial" to the sophisticated noun "entrepreneurship" is exactly the kind of lexical upgrade that pushes writing responses to Band 7 and above.
15. LABOUR MARKET (noun phrase)

Definition: The supply and demand for labour in which employees provide the supply and employers provide the demand
Collocation: competitive labour market, tight labour market, labour market trends, enter the labour market, labour market reforms
Real Life Example: "The rapid growth of the technology sector has significantly transformed the labour market, creating high demand for digital skills while simultaneously reducing the need for many traditional clerical roles."
IELTS Writing Example: "Governments must continuously monitor and respond to shifting labour market trends to ensure that their education and training systems are adequately preparing citizens for the evolving demands of the modern economy."
✍️ Examiner's Tip: "Labour market" is a precise and impressive academic term that immediately signals sophistication — it is far superior to simply writing "job market" in a formal essay.
16. GENDER PAY GAP (noun phrase)

Definition: The difference in average earnings between men and women across an economy or within a specific industry
Collocation: close the gender pay gap, widen the gender pay gap, address the gender pay gap, persistent gender pay gap
Real Life Example: "A major international report revealed that at the current rate of progress, it will take over one hundred years to fully close the global gender pay gap."
IELTS Writing Example: "The persistent gender pay gap in many developed economies reflects deep-rooted structural inequalities in the workplace that cannot be resolved through legislation alone but require fundamental cultural and organisational change."
✍️ Examiner's Tip: This phrase is frequently the central theme of IELTS Task 2 business questions about equality and fairness — having a sophisticated and nuanced understanding of it is extremely valuable.
17. MULTINATIONAL CORPORATION (noun phrase)

Definition: A large company that operates in multiple countries simultaneously, with its headquarters typically based in one nation
Collocation: large multinational corporation, multinational corporation invests, multinational corporation exploits, role of multinational corporations
Real Life Example: "Several major multinational corporations have relocated their regional headquarters to countries with significantly lower corporate tax rates, creating considerable controversy among governments and the public."
IELTS Writing Example: "While multinational corporations undeniably generate employment and stimulate economic activity in the countries where they operate, they have also been widely criticised for exploiting cheaper labour markets, avoiding tax obligations, and undermining local businesses."
✍️ Examiner's Tip: This is an essential term for any Task 2 essay discussing international business, trade, or economic inequality — use it with both positive and negative collocations to demonstrate balance.
18. CORPORATE SOCIAL RESPONSIBILITY (noun phrase)

Definition: The commitment of businesses to behave ethically and contribute positively to society and the environment beyond their core profit-making activities
Collocation: embrace corporate social responsibility, corporate social responsibility programme, corporate social responsibility initiatives, lack of corporate social responsibility
Real Life Example: "As part of their corporate social responsibility programme, the company committed to planting one million trees and achieving carbon neutrality by 2030."
IELTS Writing Example: "There is a growing and compelling argument that corporate social responsibility should be legally mandated rather than left to the discretion of individual companies, many of which prioritise shareholder profit over genuine social and environmental obligation."
✍️ Examiner's Tip: Often shortened to CSR in academic and professional writing — knowing both the full term and the abbreviation demonstrates impressive subject knowledge and sophistication.
19. INCOME INEQUALITY (noun phrase)

Definition: The unequal distribution of income and wealth across a society or economy
Collocation: address income inequality, widen income inequality, reduce income inequality, rising income inequality, income inequality gap
Real Life Example: "Several major economists have argued that the dramatic rise in income inequality over the past four decades is directly linked to the decline of trade unions and the erosion of workers' collective bargaining power."
IELTS Writing Example: "Rising income inequality — in which an increasingly small proportion of the population controls an ever-larger share of total national wealth — poses a fundamental threat to social cohesion, democratic stability, and long-term economic health."
✍️ Examiner's Tip: This is a high-frequency topic in IELTS Writing Task 2 — combining it with sophisticated language about causes, effects, and solutions will generate a very strong response.
20. OCCUPATIONAL HAZARD (noun phrase)

Definition: A risk or danger that is inherent in or associated with a particular type of work or profession
Collocation: face an occupational hazard, common occupational hazard, occupational hazard of the job, occupational hazard in an industry
Real Life Example: "Chronic back pain is a well-documented occupational hazard for nurses, warehouse workers, and others whose jobs require prolonged physical exertion or heavy lifting."
IELTS Writing Example: "Governments and employers share a joint legal and moral responsibility to identify, minimise, and wherever possible eliminate the occupational hazards faced by workers across all industries, particularly those in physically demanding or high-risk environments."
✍️ Examiner's Tip: This phrase demonstrates impressive topic-specific vocabulary that goes beyond the generic — using specialised terms accurately is one of the clearest indicators of Band 7+ writing ability.
21. SOCIOECONOMIC MOBILITY (noun phrase)

Definition: The ability of individuals or families to move between different levels of the economic and social hierarchy, typically through education or work
Collocation: promote socioeconomic mobility, limit socioeconomic mobility, upward socioeconomic mobility, barriers to socioeconomic mobility
Real Life Example: "Access to high-quality education and fair employment practices are widely regarded as the two most powerful drivers of upward socioeconomic mobility in any society."
IELTS Writing Example: "When recruitment processes systematically favour candidates from privileged backgrounds, they actively undermine socioeconomic mobility and perpetuate a deeply entrenched cycle of inequality that no meritocratic society should tolerate."
✍️ Examiner's Tip: This sophisticated compound noun immediately signals Band 8+ lexical awareness — it combines social and economic concepts in a way that demonstrates genuine academic depth.
22. REMUNERATION PACKAGE (noun phrase)

Definition: The complete set of financial and non-financial benefits that an employee receives in exchange for their work, including salary, bonuses, pension, and other perks
Collocation: attractive remuneration package, comprehensive remuneration package, negotiate a remuneration package, generous remuneration package
Real Life Example: "The executive's remuneration package — which included a base salary, performance bonuses, share options, and a company pension — was valued at over five million dollars annually."
IELTS Writing Example: "While an attractive remuneration package undoubtedly plays a significant role in recruiting top talent, research consistently demonstrates that non-financial factors such as meaningful work, autonomy, and professional growth are equally — if not more — important in retaining high-performing employees over the long term."
✍️ Examiner's Tip: Replacing the simple word "pay" or "salary" with the sophisticated term "remuneration package" is a perfect example of the kind of lexical precision that examiners reward at Band 8+.
23. ORGANISATIONAL RESTRUCTURING (noun phrase)

Definition: The significant reorganisation of a company's structure, operations, or workforce, often involving redundancies, mergers, or changes in management
Collocation: undergo organisational restructuring, large-scale organisational restructuring, organisational restructuring leads to job losses, organisational restructuring strategy
Real Life Example: "The company announced a major organisational restructuring programme that would result in the elimination of approximately three thousand positions across its global operations."
IELTS Writing Example: "While organisational restructuring may be a commercially necessary response to changing market conditions or technological disruption, it frequently results in significant human costs that governments and societies are inadequately prepared to absorb."
✍️ Examiner's Tip: This term demonstrates high-level knowledge of business processes and shows the examiner that you can discuss complex corporate topics with genuine precision and sophistication.
24. MERITOCRACY (noun)

Definition: A system in which advancement and success are determined by individual talent, effort, and achievement rather than by wealth, privilege, or social background
Collocation: true meritocracy, promote meritocracy, meritocracy in the workplace, undermine meritocracy, aspire to meritocracy
Real Life Example: "Many Silicon Valley technology companies have built their brand identity around the idea of meritocracy — the belief that the best ideas and the hardest workers will always rise to the top regardless of background."
IELTS Writing Example: "Despite widespread rhetoric about meritocracy in modern business culture, the persistent advantages enjoyed by candidates from elite educational institutions and privileged social networks suggest that many workplaces remain far from truly merit-based in their recruitment and promotion practices."
✍️ Examiner's Tip: This is one of the most intellectually impressive words you can use in an IELTS Writing essay about work and fairness — it elevates your argument to a genuinely sophisticated academic level.
25. PRECARIOUS EMPLOYMENT (noun phrase)

Definition: Work that is insecure, unstable, poorly paid, and lacking in legal protections or benefits — such as zero-hours contracts or informal gig economy work
Collocation: rise of precarious employment, precarious employment conditions, trapped in precarious employment, growth of precarious employment
Real Life Example: "The rapid expansion of the gig economy has created millions of jobs, but critics argue that the vast majority of these represent precarious employment with no sick pay, no pension, and no job security."
IELTS Writing Example: "The alarming proliferation of precarious employment arrangements — including zero-hours contracts, temporary agency work, and gig economy platforms — is eroding the financial security and social protections that previous generations of workers fought hard to establish."
✍️ Examiner's Tip: This is an extremely topical and impressive phrase that demonstrates awareness of contemporary labour market issues — exactly the kind of real-world relevance that makes Task 2 essays stand out at Band 8+.
26. INTELLECTUAL CAPITAL (noun phrase)

Definition: The collective knowledge, expertise, skills, and innovative capacity of an organisation's workforce, considered as a valuable economic asset
Collocation: develop intellectual capital, invest in intellectual capital, protect intellectual capital, intellectual capital drives growth
Real Life Example: "The technology giant's most valuable asset is not its physical infrastructure or financial reserves but the extraordinary intellectual capital represented by its team of world-leading engineers and researchers."
IELTS Writing Example: "In the knowledge-based economy of the twenty-first century, a nation's intellectual capital — the combined expertise, creativity, and innovative capacity of its educated workforce — has become a far more significant driver of competitive advantage than traditional physical or natural resources."
✍️ Examiner's Tip: Using economic concepts like "intellectual capital" demonstrates a sophisticated understanding of modern business that will genuinely impress academic examiners and push your score firmly into Band 8+ territory.
27. EXPLOITATION OF LABOUR (noun phrase)

Definition: The unfair treatment of workers by employers, involving excessive working hours, extremely low pay, dangerous conditions, or the denial of basic rights
Collocation: prevent exploitation of labour, widespread exploitation of labour, exploitation of labour in developing countries, corporate exploitation of labour
Real Life Example: "Several major international clothing brands have faced serious public backlash following investigations that exposed the systematic exploitation of labour in their overseas manufacturing facilities."
IELTS Writing Example: "The exploitation of labour in global supply chains — where workers in developing nations are routinely subjected to poverty wages, dangerous conditions, and systematic denial of basic rights — represents one of the most serious and morally urgent challenges facing international business regulation today."
✍️ Examiner's Tip: This phrase allows you to make powerful ethical arguments in Task 2 essays about business and human rights — combining it with formal academic language creates a genuinely compelling and sophisticated response.
28. COLLECTIVE BARGAINING (noun phrase)

Definition: The process by which trade unions negotiate with employers on behalf of workers to establish fair wages, working conditions, and employment terms
Collocation: right to collective bargaining, collective bargaining agreements, undermine collective bargaining, collective bargaining power
Real Life Example: "The decline in trade union membership across many developed economies over the past three decades has significantly weakened workers' collective bargaining power and contributed to the stagnation of real wages."
IELTS Writing Example: "The systematic erosion of collective bargaining rights — driven by deregulation, the casualisation of the workforce, and the aggressive anti-union stance of many major corporations — has fundamentally shifted the balance of power in the employer-employee relationship in ways that disproportionately disadvantage the most vulnerable workers."
✍️ Examiner's Tip: This is a high-level academic term from the field of labour economics — using it correctly and contextually in a Task 2 essay is a very strong indicator of Band 8+ writing ability.
29. KNOWLEDGE ECONOMY (noun phrase)

Definition: An economic system in which growth is primarily driven by the production, distribution, and application of knowledge, information, and intellectual skills rather than physical labour or raw materials
Collocation: transition to a knowledge economy, knowledge economy demands, thrive in a knowledge economy, knowledge economy skills
Real Life Example: "Countries that have successfully transitioned to a knowledge economy — such as Singapore, South Korea, and Finland — have done so through massive and sustained investment in education, research, and digital infrastructure."
IELTS Writing Example: "In the rapidly evolving knowledge economy, the ability to think critically, collaborate effectively, and adapt continuously to new technologies and information is becoming far more economically valuable than the possession of any single fixed set of technical skills."
✍️ Examiner's Tip: Demonstrating awareness of macro-economic concepts like the knowledge economy shows examiners that your writing reflects genuine intellectual depth and engagement with contemporary global issues.
30. STRUCTURAL UNEMPLOYMENT (noun phrase)

Definition: Long-term unemployment caused by fundamental changes in the economy — such as technological change or industry decline — that make certain skills permanently obsolete
Collocation: rise of structural unemployment, address structural unemployment, structural unemployment caused by automation, structural unemployment crisis
Real Life Example: "The decline of the coal mining industry in many regions of the United Kingdom created severe and long-lasting structural unemployment that entire communities have still not fully recovered from decades later."
IELTS Writing Example: "Structural unemployment — arising from the permanent displacement of workers by automation, artificial intelligence, and the fundamental reorganisation of entire industries — represents a categorically different and far more complex policy challenge than the cyclical unemployment that accompanies ordinary economic downturns."
✍️ Examiner's Tip: Distinguishing between different types of unemployment using precise academic terminology like "structural unemployment" versus "cyclical unemployment" demonstrates exceptional depth of knowledge and will strongly impress any IELTS examiner.
"""

def parse_words(raw_text):
    words = []
    blocks = re.split(r'\n(?=\d+\.\s)', raw_text.strip())
    
    start_id = 31
    current_band = 6
    
    for i, block in enumerate(blocks):
        if not block.strip():
            continue
            
        if i >= 0 and i < 10:
            current_band = 6
            cefr = "B2"
            diff = 6
        elif i >= 10 and i < 20:
            current_band = 7
            cefr = "C1"
            diff = 7
        else:
            current_band = 8
            cefr = "C1"
            diff = 8
            
        word_match = re.search(r'\d+\.\s(.*?)\s\((.*?)\)', block)
        if not word_match:
            continue
            
        word = word_match.group(1).lower()
        pos = word_match.group(2)
        
        type_str = "academic"
        if "idiom" in pos:
            type_str = "idiom"
        elif "phrasal verb" in pos:
            type_str = "phrasal_verb"
            
        # Clean POS
        pos = pos.split('/')[0].strip()
        
        def_match = re.search(r'Definition:\s*(.+)', block)
        col_match = re.search(r'Collocation:\s*(.+)', block)
        real_match = re.search(r'Real Life Example:\s*"(.*?)"', block)
        ielts_match = re.search(r'IELTS Writing Example:\s*"(.*?)"', block)
        tip_match = re.search(r'✍️ Examiner\'s Tip:\s*(.+)', block)
        
        word_obj = {
            "id": start_id + i,
            "word": word,
            "definition": def_match.group(1).strip() if def_match else "",
            "exampleSentence": real_match.group(1).strip() if real_match else "",
            "difficultyLevel": diff,
            "topic": "Business & Work",
            "partOfSpeech": pos,
            "type": type_str,
            "cefrLevel": cefr,
            "context": tip_match.group(1).strip() if tip_match else "",
            "collocations": [c.strip() for c in col_match.group(1).split(',')] if col_match else [],
            "writingExample": ielts_match.group(1).strip() if ielts_match else ""
        }
        words.append(word_obj)
        
    return words

parsed_words = parse_words(raw_data)

ts_objects = []
for w in parsed_words:
    col_str = json.dumps(w['collocations'])
    
    obj_str = f"""        {{
            id: {w['id']},
            word: "{w['word']}",
            definition: "{w['definition']}",
            exampleSentence: "{w['exampleSentence']}",
            difficultyLevel: {w['difficultyLevel']},
            topic: "{w['topic']}",
            partOfSpeech: "{w['partOfSpeech']}",
            type: "{w['type']}",
            cefrLevel: "{w['cefrLevel']}",
            context: "{w['context']}",
            collocations: {col_str},
            writingExample: "{w['writingExample']}"
        }}"""
    ts_objects.append(obj_str)

ts_content = ",\\n".join(ts_objects)

header = """
        },
        // ==========================================
        // BAND 6-8+ WRITING VOCABULARY
        // ==========================================
"""

file_path = "c:\\\\Users\\\\Honor\\\\Desktop\\\\Новая папка (4)\\\\Ai-Ielts-26-october\\\\frontend\\\\data\\\\vocabulary\\\\business.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace ending of words array EXACT MATCH
old_ending = '''        }
    ],
    exercises: {'''

new_ending = header + "\\n" + ts_content + "\\n    ],\\n    exercises: {"

content = content.replace("wordsCount: 60", "wordsCount: 60") # keep 60, don't double replace
content = content.replace(old_ending, new_ending)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Updated business.ts successfully appended the {len(parsed_words)} writing words!")
