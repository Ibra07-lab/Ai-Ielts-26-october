import re

raw_data = """
SYNONYM SWAP — WRITING LIST
🔵 Band 6 Writing Words (Q1–Q20)
📝 Word 1: EMPLOYMENT
Question 1:
"Governments have a fundamental and non-negotiable responsibility to create and actively sustain stable the condition of having paid work opportunities for all citizens, particularly during periods of severe economic downturn and financial instability."

👉 Replace "the condition of having paid work" with the correct word:

Options:

A) Productivity
B) Employment ✅
C) Profession
D) Wages
✅ Answer: B) Employment

Question 2:
"The dramatic decline of traditional manufacturing industries across many developed economies has created significant and long-lasting the state of people having paid jobs challenges that successive governments have struggled profoundly to address."

👉 Replace "the state of people having paid jobs" with the correct word:

Options:

A) Salary
B) Workforce
C) Employment ✅
D) Productivity
✅ Answer: C) Employment

📝 Word 2: WORKFORCE
Question 3:
"As automation and artificial intelligence continue to advance at an unprecedented and accelerating rate, governments must take urgent and comprehensive steps to retrain and upskill all the people available and engaged in work in a country to meet the fundamentally transformed demands of the modern economy."

👉 Replace "all the people available and engaged in work in a country" with the correct word:

Options:

A) Salary
B) Profession
C) Wages
D) Workforce ✅
✅ Answer: D) Workforce

Question 4:
"Organisations that invest meaningfully and consistently in the professional development and wellbeing of all the people they employ consistently outperform those that treat their human resources purely and cynically as a means of generating shareholder profit."

👉 Replace "all the people they employ" with the correct word:

Options:

A) Workforce ✅
B) Employer
C) Salary scale
D) Career path
✅ Answer: A) Workforce

📝 Word 3: SALARY
Question 5:
"While a highly competitive fixed regular payment received monthly from an employer is undoubtedly an important factor in attracting talented candidates, research consistently and convincingly demonstrates that non-financial factors such as meaningful work and genuine autonomy are equally critical in retaining them."

👉 Replace "fixed regular payment received monthly from an employer" with the correct word:

Options:

A) Wages
B) Productivity
C) Salary ✅
D) Employment
✅ Answer: C) Salary

Question 6:
"The persistent and deeply troubling gap between the extraordinarily generous executive compensation packages and the modest regular monthly payments received by ordinary frontline workers raises serious and entirely legitimate questions about economic fairness and fundamental social justice."

👉 Replace "regular monthly payments" with the correct word:

Options:

A) Profession
B) Salary ✅
C) Career development
D) Unemployment
✅ Answer: B) Salary

📝 Word 4: UNEMPLOYMENT
Question 7:
"Rising the state of people not having jobs despite wanting them rates, particularly among young people entering the job market for the first time, represent one of the most pressing and consequential social and economic challenges facing governments in the difficult post-pandemic era."

👉 Replace "the state of people not having jobs despite wanting them" with the correct word:

Options:

A) Productivity
B) Workforce
C) Unemployment ✅
D) Salary
✅ Answer: C) Unemployment

Question 8:
"The government's comprehensive economic recovery strategy specifically targeted the reduction of youth the condition of being without paid work through a combination of substantial investment in vocational training programmes and targeted financial incentives for businesses that hire young graduates."

👉 Replace "the condition of being without paid work" with the correct word:

Options:

A) Employment
B) Wages
C) Profession
D) Unemployment ✅
✅ Answer: D) Unemployment

📝 Word 5: PRODUCTIVITY
Question 9:
"It has been widely and consistently demonstrated through multiple peer-reviewed studies that employees who maintain a genuinely healthy work-life balance show significantly higher levels of the efficiency with which tasks are completed and output is generated than those who are routinely and chronically overworked."

👉 Replace "the efficiency with which tasks are completed and output is generated" with the correct word:

Options:

A) Employment
B) Salary
C) Productivity ✅
D) Profession
✅ Answer: C) Productivity

Question 10:
"The introduction of comprehensive flexible working arrangements across the organisation resulted in a clearly measurable and statistically significant improvement in overall the rate of work output and operational efficiency within just six months of implementation."

👉 Replace "the rate of work output and operational efficiency" with the correct word:

Options:

A) Wages
B) Productivity ✅
C) Unemployment
D) Workforce
✅ Answer: B) Productivity

📝 Word 6: CAREER DEVELOPMENT
Question 11:
"Companies that invest meaningfully and generously in the the ongoing process of improving employees' professional skills and advancing their careers of their staff consistently report significantly higher retention rates, greater levels of employee loyalty, and measurably improved overall organisational performance."

👉 Replace "the ongoing process of improving employees' professional skills and advancing their careers" with the correct phrase:

Options:

A) Salary negotiation
B) Career development ✅
C) Workforce automation
D) Employment legislation
✅ Answer: B) Career development

Question 12:
"The multinational corporation demonstrated its genuine commitment to its employees by allocating a dedicated annual budget specifically for professional growth and skills enhancement activities including external courses, industry conferences, and mentorship programmes with senior leaders."

👉 Replace "professional growth and skills enhancement activities" with the correct phrase:

Options:

A) Salary increases
B) Unemployment benefits
C) Career development ✅
D) Workforce restructuring
✅ Answer: C) Career development

📝 Word 7: EMPLOYEE
Question 13:
"Organisations that genuinely prioritise the wellbeing, professional growth, and psychological safety of each person hired and paid to work for them consistently outperform those that treat their human resources as nothing more than interchangeable units of productive output."

👉 Replace "each person hired and paid to work for them" with the correct word:

Options:

A) Employer
B) Shareholder
C) Employee ✅
D) Contractor
✅ Answer: C) Employee

Question 14:
"The survey of over five thousand workers revealed the deeply concerning finding that more than sixty percent of people working for the company felt that their contributions were not adequately or fairly recognised or rewarded by their line managers."

👉 Replace "people working for the company" with the correct word:

Options:

A) Employers
B) Employees ✅
C) Shareholders
D) Contractors
✅ Answer: B) Employees

📝 Word 8: EMPLOYER
Question 15:
"The company or person who hires and pays workers has a clear, non-negotiable legal and ethical responsibility to provide safe, fair, non-discriminatory, and genuinely supportive working conditions for every member of their workforce."

👉 Replace "the company or person who hires and pays workers" with the correct word:

Options:

A) Employee
B) Employer ✅
C) Shareholder
D) Regulator
✅ Answer: B) Employer

Question 16:
"Many companies and organisations that hire people now consider emotional intelligence, adaptability, and strong communication skills to be equally or more important than purely technical qualifications when evaluating and selecting job candidates for senior positions."

👉 Replace "companies and organisations that hire people" with the correct word:

Options:

A) Employees
B) Regulators
C) Shareholders
D) Employers ✅
✅ Answer: D) Employers

📝 Word 9: WAGES
Question 17:
"The government announced a significant and long-overdue plan to raise the national minimum hourly or daily payment made to workers for their labour by eight percent in direct response to growing and sustained pressure from trade unions and workers' rights advocacy organisations."

👉 Replace "hourly or daily payment made to workers for their labour" with the correct word:

Options:

A) Salary
B) Wages ✅
C) Productivity
D) Employment
✅ Answer: B) Wages

Question 18:
"The persistent and deeply troubling gap between the extraordinarily generous compensation packages of senior corporate executives and the stagnant payments received by ordinary manual and frontline workers raises fundamental questions about economic justice and the fairness of contemporary capitalism."

👉 Replace "payments received by ordinary manual and frontline workers" with the correct word:

Options:

A) Salaries of executives
B) Career development funds
C) Wages ✅
D) Employment benefits
✅ Answer: C) Wages

📝 Word 10: PROFESSION
Question 19:
"Medicine is universally and justifiably regarded as one of the most intellectually rewarding yet simultaneously most emotionally demanding and personally taxing paid occupations requiring prolonged formal training and qualifications that any individual can choose to enter."

👉 Replace "paid occupations requiring prolonged formal training and qualifications" with the correct word:

Options:

A) Salary
B) Workforce
C) Profession ✅
D) Employment
✅ Answer: C) Profession

Question 20:
"The teaching occupation requiring specialised knowledge and formal qualifications is chronically and scandalously undervalued and chronically underfunded in many countries, despite the indisputable fact that teachers play an absolutely fundamental and irreplaceable role in shaping the intellectual, moral, and social development of entire generations."

👉 Replace "occupation requiring specialised knowledge and formal qualifications" with the correct word:

Options:

A) Wages
B) Profession ✅
C) Productivity
D) Employment
✅ Answer: B) Profession

🟡 Band 7 Writing Words (Q21–Q40)
📝 Word 11: ECONOMIC GROWTH
Question 21:
"While rapid the increase in a country's total production of goods and services undeniably creates new employment opportunities and raises living standards for many, it frequently and inevitably comes at a significant and often irreversible environmental cost that future generations will be forced to bear."

👉 Replace "the increase in a country's total production of goods and services" with the correct phrase:

Options:

A) Labour market expansion
B) Economic growth ✅
C) Workforce development
D) Income inequality
✅ Answer: B) Economic growth

Question 22:
"The government's ambitious decision to invest heavily in large-scale infrastructure projects was specifically and strategically designed to stimulate the country's increase in production and wealth and simultaneously create thousands of new skilled employment opportunities across multiple sectors."

👉 Replace "stimulate the country's increase in production and wealth" with the correct phrase:

Options:

A) Reduce income inequality
B) Stimulate economic growth ✅
C) Address the gender pay gap
D) Develop the labour market
✅ Answer: B) Stimulate economic growth

📝 Word 12: AUTOMATION
Question 23:
"The accelerating rise of the use of technology and machines to perform tasks previously done by humans and artificial intelligence poses a profound, urgent, and deeply complex challenge to governments worldwide, as entire established categories of employment now face the very real threat of becoming permanently obsolete within a single generation."

👉 Replace "the use of technology and machines to perform tasks previously done by humans" with the correct word:

Options:

A) Globalisation
B) Entrepreneurship
C) Automation ✅
D) Restructuring
✅ Answer: C) Automation

Question 24:
"The widespread replacement of human workers by machines and computer systems of assembly line processes across the global automotive industry has dramatically and permanently reduced production costs while simultaneously eliminating hundreds of thousands of manufacturing jobs that communities had depended upon for generations."

👉 Replace "replacement of human workers by machines and computer systems" with the correct word:

Options:

A) Globalisation
B) Automation ✅
C) Entrepreneurship
D) Restructuring
✅ Answer: B) Automation

📝 Word 13: GLOBALISATION
Question 25:
"The process by which economies and businesses become increasingly interconnected across international borders has fundamentally and irreversibly transformed the fashion industry, enabling companies to source materials from dozens of different countries and sell their products in markets they could never previously have reached."

👉 Replace "the process by which economies and businesses become increasingly interconnected across international borders" with the correct word:

Options:

A) Automation
B) Entrepreneurship
C) Globalisation ✅
D) Restructuring
✅ Answer: C) Globalisation

Question 26:
"While the increasing international integration of economies, cultures, and markets has undeniably created enormous and unprecedented economic opportunities, it has simultaneously contributed to the deindustrialisation of many developed economies and the painful displacement of large sections of the traditional working class."

👉 Replace "the increasing international integration of economies, cultures, and markets" with the correct word:

Options:

A) Automation
B) Labour market reform
C) Globalisation ✅
D) Corporate restructuring
✅ Answer: C) Globalisation

📝 Word 14: ENTREPRENEURSHIP
Question 27:
"Fostering a genuine and widespread culture of the activity of starting and running new businesses despite financial risks through carefully targeted education programmes and accessible startup funding mechanisms is absolutely essential for driving innovation and sustaining long-term national economic competitiveness."

👉 Replace "the activity of starting and running new businesses despite financial risks" with the correct word:

Options:

A) Globalisation
B) Automation
C) Restructuring
D) Entrepreneurship ✅
✅ Answer: D) Entrepreneurship

Question 28:
"The government introduced a comprehensive range of financial incentives and expert mentorship programmes specifically and deliberately designed to promote the creation and running of new business ventures among young people from socioeconomically disadvantaged backgrounds who would otherwise lack the resources and networks to pursue such opportunities."

👉 Replace "the creation and running of new business ventures" with the correct word:

Options:

A) Automation
B) Entrepreneurship ✅
C) Globalisation
D) Collective bargaining
✅ Answer: B) Entrepreneurship

📝 Word 15: LABOUR MARKET
Question 29:
"Governments must continuously, carefully, and responsively monitor shifting the system of supply and demand for workers in an economy trends to ensure that their national education and vocational training systems are adequately and relevantly preparing citizens for the rapidly evolving demands of the modern working world."

👉 Replace "the system of supply and demand for workers in an economy" with the correct phrase:

Options:

A) Income inequality
B) Labour market ✅
C) Gender pay gap
D) Occupational hazard
✅ Answer: B) Labour market

Question 30:
"The rapid and transformative growth of the technology sector has significantly reshaped the the overall system matching workers to jobs by creating intense demand for digital and analytical skills while simultaneously and dramatically reducing the need for many traditional clerical and administrative roles."

👉 Replace "the overall system matching workers to jobs" with the correct phrase:

Options:

A) Gender pay gap
B) Corporate social responsibility
C) Labour market ✅
D) Occupational hazard
✅ Answer: C) Labour market

📝 Word 16: GENDER PAY GAP
Question 31:
"A landmark international report published by the World Economic Forum revealed the deeply troubling finding that at the current painfully slow rate of progress, it will take well over one hundred years to fully and meaningfully close the global the difference in average earnings between men and women."

👉 Replace "the difference in average earnings between men and women" with the correct phrase:

Options:

A) Income inequality
B) Gender pay gap ✅
C) Labour market disparity
D) Occupational hazard
✅ Answer: B) Gender pay gap

Question 32:
"The persistent the earnings difference between male and female workers in many developed economies reflects deeply embedded structural inequalities in the workplace that cannot be adequately or lastingly resolved through legislation alone but require fundamental, long-term cultural and organisational transformation."

👉 Replace "the earnings difference between male and female workers" with the correct phrase:

Options:

A) Occupational hazard
B) Corporate social responsibility
C) Gender pay gap ✅
D) Income inequality
✅ Answer: C) Gender pay gap

📝 Word 17: MULTINATIONAL CORPORATION
Question 33:
"While large companies that operate simultaneously across multiple countries undeniably generate significant employment opportunities and stimulate economic activity in the nations where they operate, they have also been widely, consistently, and justifiably criticised for exploiting cheaper labour markets and systematically avoiding their full tax obligations."

👉 Replace "large companies that operate simultaneously across multiple countries" with the correct phrase:

Options:

A) Small and medium enterprises
B) Local businesses
C) Multinational corporations ✅
D) Government agencies
✅ Answer: C) Multinational corporations

Question 34:
"Several highly prominent businesses with operations spread across many different nations have controversially relocated their regional headquarters to countries with significantly and artificially lower corporate tax rates, creating considerable anger and controversy among governments, tax authorities, and the general public."

👉 Replace "businesses with operations spread across many different nations" with the correct phrase:

Options:

A) Local enterprises
B) Multinational corporations ✅
C) Small businesses
D) Government contractors
✅ Answer: B) Multinational corporations

📝 Word 18: CORPORATE SOCIAL RESPONSIBILITY
Question 35:
"There is a growing, compelling, and increasingly mainstream argument that the commitment of businesses to contribute positively to society and the environment beyond their profit-making activities should be legally mandated rather than left entirely to the voluntary discretion of individual companies."

👉 Replace "the commitment of businesses to contribute positively to society and the environment beyond their profit-making activities" with the correct phrase:

Options:

A) Income inequality reduction
B) Corporate social responsibility ✅
C) Collective bargaining rights
D) Labour market regulation
✅ Answer: B) Corporate social responsibility

Question 36:
"As part of their publicly announced the ethical obligations companies voluntarily take on toward society and the environment programme, the company formally committed to achieving full carbon neutrality by 2030 and planting one million trees across three continents."

👉 Replace "the ethical obligations companies voluntarily take on toward society and the environment" with the correct phrase:

Options:

A) Occupational hazard management
B) Gender pay gap reduction
C) Corporate social responsibility ✅
D) Structural unemployment policy
✅ Answer: C) Corporate social responsibility

📝 Word 19: INCOME INEQUALITY
Question 37:
"Rising the unequal distribution of earnings and wealth across society — in which an increasingly small and privileged proportion of the population controls an ever-larger share of total national wealth — poses a fundamental and potentially destabilising threat to long-term social cohesion, democratic stability, and sustainable economic health."

👉 Replace "the unequal distribution of earnings and wealth across society" with the correct phrase:

Options:

A) Labour market imbalance
B) Income inequality ✅
C) Gender pay disparity
D) Occupational hazard levels
✅ Answer: B) Income inequality

Question 38:
"Several of the world's most prominent and influential economists have compellingly argued that the dramatic and accelerating rise in the gap between the richest and poorest members of society over the past four decades is directly and causally linked to the systematic decline of trade unions and the progressive erosion of workers' collective bargaining power."

👉 Replace "the gap between the richest and poorest members of society" with the correct phrase:

Options:

A) Corporate tax avoidance
B) Income inequality ✅
C) Structural unemployment
D) Precarious employment rates
✅ Answer: B) Income inequality

📝 Word 20: OCCUPATIONAL HAZARD
Question 39:
"Chronic and debilitating back pain is an extensively documented and widely recognised a risk inherent in a particular type of work for nurses, warehouse operatives, construction workers, and others whose jobs routinely require prolonged physical exertion, awkward postures, or the repeated lifting of heavy loads."

👉 Replace "a risk inherent in a particular type of work" with the correct phrase:

Options:

A) Corporate social responsibility
B) Labour market challenge
C) Occupational hazard ✅
D) Income inequality factor
✅ Answer: C) Occupational hazard

Question 40:
"Governments and employers share a joint, non-negotiable legal and profound moral responsibility to systematically identify, effectively minimise, and wherever humanly possible entirely eliminate the dangers and risks associated with specific types of work faced by workers across all industries, particularly those employed in physically demanding or inherently high-risk working environments."

👉 Replace "dangers and risks associated with specific types of work" with the correct phrase:

Options:

A) Income inequality effects
B) Collective bargaining issues
C) Occupational hazards ✅
D) Corporate social obligations
✅ Answer: C) Occupational hazards

🔴 Band 8+ Writing Words (Q41–Q60)
📝 Word 21: SOCIOECONOMIC MOBILITY
Question 41:
"When corporate recruitment processes systematically and consistently favour candidates from privileged educational and social backgrounds, they actively and powerfully undermine the ability of individuals to move between different levels of the economic and social hierarchy through their own efforts and perpetuate a deeply entrenched and self-reinforcing cycle of inequality."

👉 Replace "the ability of individuals to move between different levels of the economic and social hierarchy through their own efforts" with the correct phrase:

Options:

A) Corporate social responsibility
B) Collective bargaining power
C) Socioeconomic mobility ✅
D) Structural unemployment
✅ Answer: C) Socioeconomic mobility

Question 42:
"Access to genuinely high-quality education at every level and consistently fair employment practices are widely and compellingly regarded by economists and social scientists as the two most powerful and reliable drivers of upward movement between social and economic classes based on individual merit and effort in any society that aspires to be truly just and equitable."

👉 Replace "movement between social and economic classes based on individual merit and effort" with the correct phrase:

Options:

A) Precarious employment
B) Socioeconomic mobility ✅
C) Intellectual capital
D) Meritocracy
✅ Answer: B) Socioeconomic mobility

📝 Word 22: REMUNERATION PACKAGE
Question 43:
"While a genuinely attractive and comprehensive the complete set of financial and non-financial benefits an employee receives for their work undoubtedly plays a significant and important role in attracting top-tier talent to an organisation, research consistently demonstrates that non-financial factors such as meaningful and purposeful work are equally critical in retaining high performers over the long term."

👉 Replace "the complete set of financial and non-financial benefits an employee receives for their work" with the correct phrase:

Options:

A) Labour market position
B) Remuneration package ✅
C) Collective bargaining agreement
D) Structural employment contract
✅ Answer: B) Remuneration package

Question 44:
"The senior executive's extraordinarily generous total compensation including salary, bonuses, and additional benefits — which included a substantial base salary, substantial performance bonuses, significant share options, and a premium pension arrangement — was valued by financial analysts at well over five million dollars annually."

👉 Replace "total compensation including salary, bonuses, and additional benefits" with the correct phrase:

Options:

A) Collective bargaining settlement
B) Meritocratic reward system
C) Remuneration package ✅
D) Labour market agreement
✅ Answer: C) Remuneration package

📝 Word 23: ORGANISATIONAL RESTRUCTURING
Question 45:
"While large-scale the significant reorganisation of a company's structure, workforce, and operations may sometimes be a commercially necessary and strategically rational response to rapidly changing market conditions or disruptive technological change, it frequently results in significant and lasting human costs that governments and social support systems are woefully underprepared to absorb."

👉 Replace "the significant reorganisation of a company's structure, workforce, and operations" with the correct phrase:

Options:

A) Collective bargaining
B) Organisational restructuring ✅
C) Knowledge economy transition
D) Precarious employment
✅ Answer: B) Organisational restructuring

Question 46:
"The multinational corporation announced a sweeping and large-scale programme of fundamental internal reorganisation that would result in the elimination of approximately three thousand positions across its global operations over an eighteen-month period, triggering significant and understandable concern among employees and trade unions worldwide."

👉 Replace "programme of fundamental internal reorganisation" with the correct phrase:

Options:

A) Collective bargaining initiative
B) Precarious employment drive
C) Intellectual capital review
D) Organisational restructuring ✅
✅ Answer: D) Organisational restructuring

📝 Word 24: MERITOCRACY
Question 47:
"Despite the widespread and appealing corporate rhetoric about a system where advancement is based purely on talent and effort rather than privilege in modern business culture, the persistent and statistically significant advantages consistently enjoyed by candidates from elite educational institutions suggest that many workplaces remain far from genuinely merit-based in their actual recruitment and promotion practices."

👉 Replace "a system where advancement is based purely on talent and effort rather than privilege" with the correct word:

Options:

A) Collective bargaining
B) Meritocracy ✅
C) Socioeconomic mobility
D) Precarious employment
✅ Answer: B) Meritocracy

Question 48:
"Many Silicon Valley technology companies have deliberately and publicly built their entire brand identity and corporate culture around the deeply appealing concept of the principle that hard work and ability alone determine success — the belief that the most innovative ideas and the most determined workers will always rise to the top regardless of their social or economic background."

👉 Replace "the principle that hard work and ability alone determine success" with the correct word:

Options:

A) Structural unemployment
B) Precarious employment
C) Meritocracy ✅
D) Collective bargaining
✅ Answer: C) Meritocracy

📝 Word 25: PRECARIOUS EMPLOYMENT
Question 49:
"The alarming and rapidly accelerating proliferation of insecure, unstable, and poorly protected work arrangements — including zero-hours contracts, temporary agency work, and gig economy platform labour — is systematically eroding the financial security and hard-won social protections that previous generations of workers fought long and hard to establish."

👉 Replace "insecure, unstable, and poorly protected work arrangements" with the correct phrase:

Options:

A) Collective bargaining agreements
B) Precarious employment ✅
C) Knowledge economy positions
D) Organisational restructuring
✅ Answer: B) Precarious employment

Question 50:
"The rapid expansion of the gig economy has unquestionably created millions of new working opportunities, but leading critics and labour economists argue persuasively that the vast majority of these represent unstable work without adequate legal protections or benefits with no sick pay, no pension provision, and no meaningful or enforceable job security."

👉 Replace "unstable work without adequate legal protections or benefits" with the correct phrase:

Options:

A) Structural unemployment
B) Intellectual capital positions
C) Precarious employment ✅
D) Meritocratic work arrangements
✅ Answer: C) Precarious employment

📝 Word 26: INTELLECTUAL CAPITAL
Question 51:
"In the rapidly evolving and increasingly competitive knowledge-based economy of the twenty-first century, a nation's the collective knowledge, expertise, and innovative capacity of its educated workforce has become a far more decisive and significant driver of international competitive advantage than traditional physical infrastructure or finite natural resource endowments."

👉 Replace "the collective knowledge, expertise, and innovative capacity of its educated workforce" with the correct phrase:

Options:

A) Structural unemployment reserve
B) Collective bargaining power
C) Intellectual capital ✅
D) Precarious employment base
✅ Answer: C) Intellectual capital

Question 52:
"The world-leading technology company's most commercially valuable and strategically irreplaceable asset is not its vast physical infrastructure, its impressive financial reserves, or its global brand recognition, but rather the extraordinary the combined skills, knowledge, and creative capacity of its employees represented by its exceptional team of world-class engineers, designers, and researchers."

👉 Replace "the combined skills, knowledge, and creative capacity of its employees" with the correct phrase:

Options:

A) Remuneration package value
B) Intellectual capital ✅
C) Organisational restructuring outcome
D) Meritocratic reward system
✅ Answer: B) Intellectual capital

📝 Word 27: EXPLOITATION OF LABOUR
Question 53:
"Several of the world's most prominent and commercially successful international clothing brands have faced serious, sustained, and highly damaging public backlash following investigative journalism that exposed the systematic the unfair treatment of workers through extremely low pay, dangerous conditions, and denial of basic rights occurring throughout their overseas manufacturing supply chains."

👉 Replace "the unfair treatment of workers through extremely low pay, dangerous conditions, and denial of basic rights" with the correct phrase:

Options:

A) Collective bargaining failure
B) Exploitation of labour ✅
C) Structural unemployment crisis
D) Precarious employment model
✅ Answer: B) Exploitation of labour

Question 54:
"The systematic mistreatment and underpayment of workers in global supply chains — where employees in developing nations are routinely subjected to poverty-level wages, genuinely hazardous working conditions, and the systematic denial of internationally recognised basic rights — represents one of the most serious, urgent, and morally indefensible challenges facing international business regulation today."

👉 Replace "the systematic mistreatment and underpayment of workers" with the correct phrase:

Options:

A) The meritocracy failure
B) The knowledge economy gap
C) The exploitation of labour ✅
D) The collective bargaining crisis
✅ Answer: C) The exploitation of labour

📝 Word 28: COLLECTIVE BARGAINING
Question 55:
"The dramatic and sustained decline in trade union membership and influence across many developed economies over the past three decades has significantly and measurably weakened workers' the process by which unions negotiate with employers on behalf of workers power and contributed directly to the long-term stagnation of real wages for the majority of the working population."

👉 Replace "the process by which unions negotiate with employers on behalf of workers" with the correct phrase:

Options:

A) Precarious employment
B) Collective bargaining ✅
C) Meritocratic advancement
D) Organisational restructuring
✅ Answer: B) Collective bargaining

Question 56:
"The systematic and deliberate erosion of workers' rights to negotiate collectively with employers through trade unions — driven by decades of aggressive deregulation, the rapid casualisation of the workforce, and the openly anti-union stance of many major corporations — has fundamentally and perhaps irreversibly shifted the balance of power in the employer-employee relationship."

👉 Replace "workers' rights to negotiate collectively with employers through trade unions" with the correct phrase:

Options:

A) Intellectual capital rights
B) Collective bargaining rights ✅
C) Meritocratic advancement rights
D) Socioeconomic mobility rights
✅ Answer: B) Collective bargaining rights

📝 Word 29: KNOWLEDGE ECONOMY
Question 57:
"Nations that have most successfully and sustainably transitioned to an economic system driven by information, expertise, and intellectual skills rather than physical labour — including Singapore, South Korea, and Finland — have done so through extraordinarily sustained and strategic investment in education, technological research, and comprehensive digital infrastructure."

👉 Replace "an economic system driven by information, expertise, and intellectual skills rather than physical labour" with the correct phrase:

Options:

A) Structural unemployment system
B) Collective bargaining economy
C) Knowledge economy ✅
D) Precarious employment market
✅ Answer: C) Knowledge economy

Question 58:
"In the rapidly and continuously evolving the modern economic system where intellectual skills and information drive growth, the demonstrated ability to think critically, collaborate effectively across diverse teams, and adapt continuously and confidently to new technologies and evolving information is becoming far more economically valuable than the possession of any single fixed or static set of technical skills."

👉 Replace "the modern economic system where intellectual skills and information drive growth" with the correct phrase:

Options:

A) Labour exploitation market
B) Knowledge economy ✅
C) Precarious employment sector
D) Collective bargaining system
✅ Answer: B) Knowledge economy

📝 Word 30: STRUCTURAL UNEMPLOYMENT
Question 59:
"Long-term unemployment caused by fundamental and permanent changes in the economy that make certain skills obsolete — arising directly from the permanent and large-scale displacement of workers by advancing automation, artificial intelligence systems, and the fundamental reorganisation of entire industries — represents a categorically different and far more complex and intractable policy challenge than the cyclical unemployment that merely accompanies ordinary economic downturns."

👉 Replace "long-term unemployment caused by fundamental and permanent changes in the economy that make certain skills obsolete" with the correct phrase:

Options:

A) Precarious employment crisis
B) Collective bargaining breakdown
C) Structural unemployment ✅
D) Knowledge economy disruption
✅ Answer: C) Structural unemployment

Question 60:
"The devastating and generationally scarring decline of the coal mining and heavy manufacturing industries in many regions of the United Kingdom and the American Rust Belt created severe, deeply entrenched, and heartbreakingly persistent unemployment resulting from permanent economic and industrial transformation that entire communities and local economies have still not fully or meaningfully recovered from, even decades after the initial industrial collapse."

👉 Replace "unemployment resulting from permanent economic and industrial transformation" with the correct phrase:

Options:

A) Precarious employment consequences
B) Meritocratic system failures
C) Collective bargaining outcomes
D) Structural unemployment ✅
✅ Answer: D) Structural unemployment
"""

def parse_questions(text):
    questions = []
    
    # Split by Question blocks
    q_blocks = re.split(r'Question \d+:\n', text)
    
    for i in range(1, len(q_blocks)):
        block = q_blocks[i]
        
        # Extract sentence
        sentence_match = re.search(r'"(.*?)"', block, re.DOTALL)
        if not sentence_match:
            continue
        sentence = sentence_match.group(1).replace('\n', ' ').replace('"', '\\"')
        
        # Extract target phrase
        target_match = re.search(r'👉 Replace "(.*?)"', block)
        if not target_match:
            continue
        target_word = target_match.group(1).replace('"', '\\"')
        
        # We only want A) B) C) D) before "✅ Answer:"
        options_section = re.search(r'Options:\n\n([\s\S]*?)✅ Answer:', block)
        if not options_section:
            continue
        options_text = options_section.group(1)
        
        # Extract Options A-D from the options text only
        options = []
        op_blocks = re.findall(r'([A-D])\)\s(.*?)(?=\n[A-D]\)|$)', options_text, re.DOTALL)
        for op in op_blocks:
            is_correct = "✅" in op[1]
            text_without_check = op[1].replace("✅", "").strip()
            
            feedback = "Correct!" if is_correct else "Incorrect. Try again."
            
            options.append({
                "id": op[0],
                "text": text_without_check,
                "isCorrect": str(is_correct).lower(),
                "feedback": feedback
            })
            
        questions.append({
            "sentence": sentence,
            "targetWord": target_word,
            "options": options
        })
        
    return questions

parsed = parse_questions(raw_data)

ts_objects = []
for idx, q in enumerate(parsed):
    options_ts = []
    for o in q['options']:
        options_ts.append(f"""                    {{ id: "{o['id']}", text: "{o['text']}", isCorrect: {o['isCorrect']}, feedback: "{o['feedback']}" }}""")
    
    options_str = ",\n".join(options_ts)
    
    ts_objects.append(f"""            {{
                id: {idx + 1},
                sentence: "{q['sentence']}",
                targetWord: "{q['targetWord']}",
                options: [
{options_str}
                ]
            }}""")

ts_array_content = ",\n".join(ts_objects)

ts_replacement = f"writingSynonymSwap: [\n{ts_array_content}\n        ],"

file_path = "c:\\\\Users\\\\Honor\\\\Desktop\\\\Новая папка (4)\\\\Ai-Ielts-26-october\\\\frontend\\\\data\\\\vocabulary\\\\business.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the existing writingSynonymSwap array which spans from "writingSynonymSwap: [" to its matching closing "]," (which is followed by contextTetris or something else)
# We can find the start of writingSynonymSwap: [ and replace everything up to contextTetris: [
import re
content = re.sub(r'writingSynonymSwap:\s*\[[\s\S]*?\n\s{8}\],\n\s{8}contextTetris:\s*\[', ts_replacement + '\n        contextTetris: [', content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Re-added writingSynonymSwap exercises ({len(parsed)} items) to business.ts! Fixed regex loop.")
