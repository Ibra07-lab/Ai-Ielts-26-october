import re
import json

raw_data = """
🔵 Band 6 Speaking Words (Q1–Q20)
📝 Word 1: JOB SATISFACTION
Question 1:
"My mum has worked as a nurse for over twenty years and she still has incredibly high levels of the pleasure and fulfilment she gets from her work because she genuinely loves helping people every single day."

👉 Replace "the pleasure and fulfilment she gets from her work" with the correct phrase:

Options:

A) Work-life balance
B) Job satisfaction ✅
C) Career prospects
D) Salary package
✅ Answer: B) Job satisfaction

Question 2:
"I think feeling genuinely happy and fulfilled in what you do professionally is far more important than earning a high salary because if you hate your job, no amount of money can truly compensate for that."

👉 Replace "feeling genuinely happy and fulfilled in what you do professionally" with the correct phrase:

Options:

A) Work-life balance
B) Career development
C) Job satisfaction ✅
D) Team player mentality
✅ Answer: C) Job satisfaction

📝 Word 2: WORK-LIFE BALANCE
Question 3:
"My friend recently quit his extremely well-paying job at a major investment bank because the ability to fairly divide his time between his job and personal life was completely non-existent — he was regularly working past midnight."

👉 Replace "the ability to fairly divide his time between his job and personal life" with the correct phrase:

Options:

A) Job satisfaction
B) Career prospects
C) Work-life balance ✅
D) Flexible working
✅ Answer: C) Work-life balance

Question 4:
"Honestly, I think finding an equal division between professional responsibilities and personal time is one of the biggest daily challenges facing people of my generation right now."

👉 Replace "finding an equal division between professional responsibilities and personal time" with the correct phrase:

Options:

A) Getting promoted
B) Work-life balance ✅
C) Making a living
D) Burning out
✅ Answer: B) Work-life balance

📝 Word 3: GET PROMOTED
Question 5:
"My older sister worked incredibly hard for three years and was finally moved to a higher and more senior position at her company last month — the entire family is absolutely thrilled for her."

👉 Replace "moved to a higher and more senior position at her company" with the correct phrase:

Options:

A) Made a living
B) Burned out
C) Got promoted ✅
D) Landed a job
✅ Answer: C) Got promoted

Question 6:
"In many traditional companies in my country, people tend to advance to higher positions based on how long they have worked somewhere rather than how talented or hardworking they actually are, which I personally find quite unfair."

👉 Replace "advance to higher positions" with the correct phrase:

Options:

A) Burn out
B) Get promoted ✅
C) Go the extra mile
D) Climb down the ladder
✅ Answer: B) Get promoted

📝 Word 4: DEAD-END JOB
Question 7:
"My cousin felt completely and utterly trapped in a job with absolutely no opportunities for advancement or personal growth for several years before he finally gathered the courage to go back to university and completely retrain."

👉 Replace "a job with absolutely no opportunities for advancement or personal growth" with the correct phrase:

Options:

A) A nine-to-five
B) A dead-end job ✅
C) A team player role
D) A steep learning curve
✅ Answer: B) A dead-end job

Question 8:
"I think one of the deepest fears that young people entering the workforce today have is the prospect of ending up in a position where there is simply no path forward and no opportunity to develop professionally."

👉 Replace "a position where there is simply no path forward and no opportunity to develop professionally" with the correct phrase:

Options:

A) A flexible working arrangement
B) A make or break situation
C) A dead-end job ✅
D) A hands-on experience
✅ Answer: C) A dead-end job

📝 Word 5: BOSS
Question 9:
"I had a genuinely terrible person in charge of my team at my very first part-time job who never gave any feedback or recognition, which made the entire working experience deeply demoralising."

👉 Replace "person in charge of my team" with the correct word:

Options:

A) Colleague
B) Teammate
C) Boss ✅
D) Customer
✅ Answer: C) Boss

Question 10:
"I genuinely think that having a supportive and encouraging manager who oversees your work makes an absolutely enormous difference to how much you enjoy coming to work every single day."

👉 Replace "manager who oversees your work" with the correct word:

Options:

A) Client
B) Boss ✅
C) Colleague
D) Shareholder
✅ Answer: B) Boss

📝 Word 6: BURN OUT
Question 11:
"One of my closest university friends became completely exhausted mentally and physically from overworking during his final year because he was simultaneously studying full-time and working a part-time job to cover his rent."

👉 Replace "became completely exhausted mentally and physically from overworking" with the correct phrase:

Options:

A) Climbed the ladder
B) Landed a job
C) Burned out ✅
D) Got promoted
✅ Answer: C) Burned out

Question 12:
"I think a lot of ambitious young professionals in high-pressure industries like law and medicine end up collapsing from exhaustion due to excessive work demands by their early thirties because the culture of overworking is so completely and dangerously normalised."

👉 Replace "collapsing from exhaustion due to excessive work demands" with the correct phrase:

Options:

A) Going the extra mile
B) Burning out ✅
C) Thinking outside the box
D) Making a living
✅ Answer: B) Burning out

📝 Word 7: NINE-TO-FIVE
Question 13:
"My dad has worked a completely conventional standard office job with regular fixed hours from morning to late afternoon his entire professional life and he genuinely loves it because he always knows exactly when he will be home."

👉 Replace "standard office job with regular fixed hours from morning to late afternoon" with the correct phrase:

Options:

A) Dead-end job
B) Nine-to-five ✅
C) Hands-on experience
D) Steep learning curve
✅ Answer: B) Nine-to-five

Question 14:
"I personally don't think the traditional model of working fixed standard hours every weekday suits every type of personality or working style — many people are genuinely far more creative and productive working flexible hours."

👉 Replace "the traditional model of working fixed standard hours every weekday" with the correct phrase:

Options:

A) The make or break approach
B) The nine-to-five ✅
C) The corporate culture
D) The glass ceiling
✅ Answer: B) The nine-to-five

📝 Word 8: MAKE A LIVING
Question 15:
"It is becoming increasingly difficult for young artists, musicians, and writers to earn enough money from their creative work to support themselves without relying on a second income source or significant financial support from their family."

👉 Replace "earn enough money from their creative work to support themselves" with the correct phrase:

Options:

A) Climb the ladder
B) Make a living ✅
C) Go the extra mile
D) Get promoted
✅ Answer: B) Make a living

Question 16:
"I think as long as a person can generate sufficient income from something they are genuinely passionate about, that is truly the most ideal and enviable career situation anyone could possibly hope for."

👉 Replace "generate sufficient income" with the correct phrase:

Options:

A) Land a job
B) Burn out
C) Make a living ✅
D) Give it their all
✅ Answer: C) Make a living

📝 Word 9: TEAM PLAYER
Question 17:
"During my part-time job at a busy café, I very quickly learned just how important it is to be someone who works effectively and cooperatively with others because when even one person refuses to cooperate, the entire operation suffers immediately."

👉 Replace "someone who works effectively and cooperatively with others" with the correct phrase:

Options:

A) A self-employed person
B) A team player ✅
C) A skilled worker
D) An entrepreneur
✅ Answer: B) A team player

Question 18:
"I would definitely and confidently describe myself as a person who genuinely prefers collaborative working over individual effort — I find that I produce significantly better results when I can share ideas and work alongside other motivated people."

👉 Replace "a person who genuinely prefers collaborative working over individual effort" with the correct phrase:

Options:

A) A nine-to-five worker
B) A glass ceiling breaker
C) A team player ✅
D) An independent thinker
✅ Answer: C) A team player

📝 Word 10: CLIMB THE LADDER
Question 19:
"My aunt started her career as a junior hotel receptionist and spent fifteen extraordinarily dedicated years steadily progressing to higher and more senior positions until she eventually became the general manager of the entire property."

👉 Replace "progressing to higher and more senior positions" with the correct phrase:

Options:

A) Making a living
B) Burning out
C) Climbing the ladder ✅
D) Going the extra mile
✅ Answer: C) Climbing the ladder

Question 20:
"The intense pressure to rapidly advance through the ranks of a company in highly competitive industries like finance and management consulting can have genuinely damaging and lasting effects on young professionals' personal relationships and mental wellbeing."

👉 Replace "rapidly advance through the ranks of a company" with the correct phrase:

Options:

A) Land a job quickly
B) Climb the ladder ✅
C) Think outside the box
D) Push the boundaries
✅ Answer: B) Climb the ladder

🟡 Band 7 Speaking Words (Q21–Q40)
📝 Word 11: CAREER PROSPECTS
Question 21:
"I specifically chose to study computer science as my university major because the future opportunities for advancement and success in the technology sector are genuinely outstanding and consistently growing at an impressive rate."

👉 Replace "the future opportunities for advancement and success in the technology sector" with the correct phrase:

Options:

A) The job satisfaction levels
B) The career prospects ✅
C) The work-life balance
D) The hands-on experience
✅ Answer: B) The career prospects

Question 22:
"I strongly believe that the likelihood of future professional advancement should be one of the most carefully considered factors when young people are choosing which university degree to pursue alongside their genuine personal interests."

👉 Replace "the likelihood of future professional advancement" with the correct phrase:

Options:

A) The salary package
B) The career prospects ✅
C) The corporate culture
D) The learning curve
✅ Answer: B) The career prospects

📝 Word 12: SELF-EMPLOYED
Question 23:
"My uncle made the life-changing decision to become someone who works for himself and runs his own business five years ago when he established his own plumbing company, and he consistently says it is the best professional decision he has ever made."

👉 Replace "someone who works for himself and runs his own business" with the correct word:

Options:

A) Motivated
B) Flexible
C) Self-employed ✅
D) Promoted
✅ Answer: C) Self-employed

Question 24:
"The idea of being working independently without an employer genuinely appeals to me enormously because I love the thought of having complete control over my own schedule and the overall direction of my professional life."

👉 Replace "working independently without an employer" with the correct word:

Options:

A) Under pressure
B) Self-employed ✅
C) At the forefront
D) In the same boat
✅ Answer: B) Self-employed

📝 Word 13: MOTIVATE
Question 25:
"My secondary school football coach had a truly remarkable and almost magical ability to give the team a strong reason and desire to perform at their very best even during those difficult moments when we were losing by a significant margin."

👉 Replace "give the team a strong reason and desire to perform at their very best" with the correct word:

Options:

A) Promote
B) Employ
C) Motivate ✅
D) Restructure
✅ Answer: C) Motivate

Question 26:
"I genuinely believe the most effective and respected managers are those who truly understand how to inspire their team members to work harder and more creatively by recognising individual strengths and contributions rather than simply demanding better results."

👉 Replace "inspire their team members to work harder and more creatively" with the correct word:

Options:

A) Employ
B) Restructure
C) Automate
D) Motivate ✅
✅ Answer: D) Motivate

📝 Word 14: FLEXIBLE WORKING
Question 27:
"My mother's company introduced arrangements that allow employees to choose when and where they work following the pandemic, and she reports that her overall productivity and job satisfaction have both increased dramatically as a direct result."

👉 Replace "arrangements that allow employees to choose when and where they work" with the correct phrase:

Options:

A) Dead-end jobs
B) Flexible working ✅
C) Nine-to-five schedules
D) Steep learning curves
✅ Answer: B) Flexible working

Question 28:
"I honestly think the ability to choose your own working hours and location is one of the most genuinely positive and meaningful developments in modern employment culture because it allows people to manage both their professional and personal lives far more effectively."

👉 Replace "the ability to choose your own working hours and location" with the correct phrase:

Options:

A) Climbing the ladder
B) Burning out
C) Flexible working ✅
D) Going the extra mile
✅ Answer: C) Flexible working

📝 Word 15: SKILLED WORKER
Question 29:
"There is a genuinely serious and growing shortage of people with specific training and expertise needed to perform particular types of work in the construction industry in my country, which is making property development increasingly slow and prohibitively expensive."

👉 Replace "people with specific training and expertise needed to perform particular types of work" with the correct phrase:

Options:

A) Team players
B) Skilled workers ✅
C) Self-employed individuals
D) Nine-to-five employees
✅ Answer: B) Skilled workers

Question 30:
"I genuinely believe that governments have a clear responsibility to invest heavily in both university education and vocational training to ensure there is always an adequate supply of highly trained and qualified people in specialist fields across all essential industries."

👉 Replace "highly trained and qualified people in specialist fields" with the correct phrase:

Options:

A) Flexible workers
B) Corporate employees
C) Skilled workers ✅
D) Self-employed professionals
✅ Answer: C) Skilled workers

📝 Word 16: UNDER PRESSURE
Question 31:
"My sister works as an emergency room doctor and is required to make incredibly critical and consequential life-or-death decisions on a daily basis while operating in a state of extreme stress and high demand."

👉 Replace "in a state of extreme stress and high demand" with the correct phrase:

Options:

A) At the forefront
B) In the same boat
C) Under pressure ✅
D) On a steep learning curve
✅ Answer: C) Under pressure

Question 32:
"Honestly, I think I actually perform quite well when I am experiencing stress because of high expectations and tight deadlines — I find that having a clear and immovable deadline actually helps me focus and consistently produce my best quality work."

👉 Replace "experiencing stress because of high expectations and tight deadlines" with the correct phrase:

Options:

A) Making a living
B) Under pressure ✅
C) At the forefront
D) Pushing boundaries
✅ Answer: B) Under pressure

📝 Word 17: HANDS-ON EXPERIENCE
Question 33:
"I completed a summer internship at a digital marketing agency last year and the practical experience I gained by actually doing real work was genuinely far more valuable and educational than anything I had previously learned sitting in a university lecture theatre."

👉 Replace "practical experience I gained by actually doing real work" with the correct phrase:

Options:

A) Corporate culture
B) Career prospects
C) Hands-on experience ✅
D) Flexible working
✅ Answer: C) Hands-on experience

Question 34:
"I think one of the most significant and persistent problems with traditional university education is that it focuses overwhelmingly on abstract theory and does not provide students with nearly enough real practical experience in their chosen professional field."

👉 Replace "real practical experience in their chosen professional field" with the correct phrase:

Options:

A) Job satisfaction
B) Hands-on experience ✅
C) Work-life balance
D) Career development
✅ Answer: B) Hands-on experience

📝 Word 18: GIVE IT YOUR ALL
Question 35:
"My father always taught me from a very young age that no matter what job you happen to be doing in life — whether sweeping floors or running an entire company — you should always put in the maximum possible effort and dedication."

👉 Replace "put in the maximum possible effort and dedication" with the correct phrase:

Options:

A) Think outside the box
B) Go the extra mile
C) Give it your all ✅
D) Make or break it
✅ Answer: C) Give it your all

Question 36:
"I genuinely and wholeheartedly believe that if you are going to commit to doing something professionally, you should always work with complete and total dedication — putting in only a half-hearted effort never produces results that you can feel genuinely proud of."

👉 Replace "work with complete and total dedication" with the correct phrase:

Options:

A) Climb the ladder
B) Burn out
C) Land the job
D) Give it your all ✅
✅ Answer: D) Give it your all

📝 Word 19: LAND A JOB
Question 37:
"My absolute best friend spent nearly six months sending out hundreds of job applications to companies in his field before he finally successfully obtained a position at a highly prestigious engineering firm — his incredible perseverance ultimately paid off."

👉 Replace "successfully obtained a position" with the correct phrase:

Options:

A) Got promoted
B) Burned out
C) Landed a job ✅
D) Made a living
✅ Answer: C) Landed a job

Question 38:
"I genuinely think that having exceptionally strong communication and interpersonal skills is now absolutely essential for securing good employment in virtually any competitive industry, regardless of what specific technical qualifications you might have."

👉 Replace "securing good employment" with the correct phrase:

Options:

A) Climbing the ladder
B) Landing a job ✅
C) Making a living
D) Going the extra mile
✅ Answer: B) Landing a job

📝 Word 20: IN THE SAME BOAT
Question 39:
"During the severe economic recession, millions of workers across the country suddenly found themselves in the identical difficult situation — deeply worried about their job security and genuinely struggling to meet their basic financial obligations."

👉 Replace "in the identical difficult situation" with the correct phrase:

Options:

A) At the forefront
B) Under pressure
C) In the same boat ✅
D) On a steep learning curve
✅ Answer: C) In the same boat

Question 40:
"I honestly think most young graduates are completely facing the same challenge when it comes to finding their very first professional job — everyone has a degree on paper but virtually no real work experience to offer employers."

👉 Replace "facing the same challenge" with the correct phrase:

Options:

A) Going the extra mile
B) In the same boat ✅
C) At the forefront
D) Pushing the boundaries
✅ Answer: B) In the same boat

🔴 Band 8+ Speaking Words (Q41–Q60)
📝 Word 21: CORPORATE CULTURE
Question 41:
"One of the primary and most compelling reasons I would absolutely love to work for that particular company is that the shared values, attitudes, and practices that define how the organisation operates is completely and genuinely built around creativity, innovation, and authentic employee wellbeing."

👉 Replace "the shared values, attitudes, and practices that define how the organisation operates" with the correct phrase:

Options:

A) The labour market
B) The corporate culture ✅
C) The remuneration package
D) The glass ceiling
✅ Answer: B) The corporate culture

Question 42:
"I think the toxic environment of values and behaviours that exists in some organisations — where chronic overworking is glorified, mental health struggles are completely ignored, and results are valued above everything else — is one of the most serious and dangerously underacknowledged problems in modern business."

👉 Replace "the toxic environment of values and behaviours that exists in some organisations" with the correct phrase:

Options:

A) The cutthroat competition
B) The steep learning curve
C) The corporate culture ✅
D) The entrepreneurial spirit
✅ Answer: C) The corporate culture

📝 Word 22: GLASS CEILING
Question 43:
"Despite decades of undeniable social progress and significant legislative reform, many highly qualified and deeply experienced women still consistently report hitting the invisible barrier that prevents certain groups from reaching the highest levels of an organisation when they attempt to advance to the most senior leadership positions."

👉 Replace "the invisible barrier that prevents certain groups from reaching the highest levels of an organisation" with the correct phrase:

Options:

A) The steep learning curve
B) The glass ceiling ✅
C) The corporate culture
D) The make or break moment
✅ Answer: B) The glass ceiling

Question 44:
"I strongly believe that the invisible professional barrier that stops women and minorities from advancing still very much exists across many industries — the persistent underrepresentation of women in the most senior corporate leadership positions is compelling evidence of this."

👉 Replace "the invisible professional barrier that stops women and minorities from advancing" with the correct phrase:

Options:

A) The cutthroat competition
B) The entrepreneurial spirit
C) The glass ceiling ✅
D) The forefront position
✅ Answer: C) The glass ceiling

📝 Word 23: ENTREPRENEURIAL SPIRIT
Question 45:
"My grandmother possessed a truly extraordinary and inspiring mindset and drive to create and build something of her own despite the risks involved — she built an incredibly successful tailoring business entirely from nothing during a time when very few women owned their own companies."

👉 Replace "mindset and drive to create and build something of her own despite the risks involved" with the correct phrase:

Options:

A) Corporate culture
B) Glass ceiling mentality
C) Entrepreneurial spirit ✅
D) Steep learning curve
✅ Answer: C) Entrepreneurial spirit

Question 46:
"I genuinely believe that schools and universities should actively and deliberately nurture the desire and courage to start new things and take calculated risks in students from the earliest possible age rather than simply and narrowly training them to be obedient and compliant employees."

👉 Replace "nurture the desire and courage to start new things and take calculated risks" with the correct phrase:

Options:

A) Promote cutthroat competition
B) Nurture entrepreneurial spirit ✅
C) Break the glass ceiling
D) Push the boundaries of learning
✅ Answer: B) Nurture entrepreneurial spirit

📝 Word 24: CUTTHROAT COMPETITION
Question 47:
"The fashion industry is widely and justifiably known for its extremely fierce, aggressive, and ruthless rivalry between brands — companies are constantly and relentlessly fighting for the same pool of consumers, and any significant mistake can be absolutely and permanently fatal to a business."

👉 Replace "extremely fierce, aggressive, and ruthless rivalry between brands" with the correct phrase:

Options:

A) Steep learning curve
B) Cutthroat competition ✅
C) Corporate culture
D) Glass ceiling
✅ Answer: B) Cutthroat competition

Question 48:
"I genuinely think that the ruthless and unforgiving competitive environment that characterises certain high-stakes industries like investment banking and management consulting places enormous, often unsustainable, and deeply unhealthy psychological pressure on young professionals who are just beginning their careers."

👉 Replace "the ruthless and unforgiving competitive environment" with the correct phrase:

Options:

A) The entrepreneurial spirit
B) The work-life balance
C) The cutthroat competition ✅
D) The corporate ladder
✅ Answer: C) The cutthroat competition

📝 Word 25: THINK OUTSIDE THE BOX
Question 49:
"My absolute favourite teacher in secondary school always passionately encouraged all of us to approach problems creatively and unconventionally rather than following standard methods instead of simply memorising textbook information, and I firmly believe that approach genuinely prepared us far better for real working life."

👉 Replace "approach problems creatively and unconventionally rather than following standard methods" with the correct phrase:

Options:

A) Go the extra mile
B) Climb the ladder
C) Think outside the box ✅
D) Give it our all
✅ Answer: C) Think outside the box

Question 50:
"In today's extraordinarily fast-changing and unpredictable business environment, I genuinely believe the capacity to generate creative and unconventional solutions and adapt rapidly to entirely new challenges is far more commercially valuable than simply possessing an impressive list of academic qualifications."

👉 Replace "the capacity to generate creative and unconventional solutions" with the correct phrase:

Options:

A) The ability to make or break decisions
B) The ability to think outside the box ✅
C) The forefront position
D) The entrepreneurial ladder
✅ Answer: B) The ability to think outside the box

📝 Word 26: PUSHING THE BOUNDARIES
Question 51:
"Companies like Tesla and SpaceX have become so extraordinarily influential and admired precisely because they are constantly and fearlessly going beyond existing limits of what is considered technologically possible or commercially viable."

👉 Replace "going beyond existing limits of what is considered technologically possible or commercially viable" with the correct phrase:

Options:

A) Going the extra mile
B) Pushing the boundaries ✅
C) Thinking outside the box
D) Making or breaking the market
✅ Answer: B) Pushing the boundaries

Question 52:
"I deeply admire professionals who are genuinely willing to keep challenging conventional limits and expectations in their field even when they face considerable scepticism, intense criticism, and strong resistance from more traditionally minded colleagues and institutions."

👉 Replace "challenging conventional limits and expectations in their field" with the correct phrase:

Options:

A) Climbing the corporate ladder
B) Going the extra mile
C) Pushing the boundaries ✅
D) Making a living differently
✅ Answer: C) Pushing the boundaries

📝 Word 27: MAKE OR BREAK
Question 53:
"The critically important first three to six months of launching any new restaurant business are truly a situation that will either lead to great success or total failure with no middle ground — if you cannot build a loyal and returning customer base extremely quickly, the business will almost certainly not survive."

👉 Replace "a situation that will either lead to great success or total failure with no middle ground" with the correct phrase:

Options:

A) A steep learning curve
B) A make or break moment ✅
C) A glass ceiling situation
D) A cutthroat competition
✅ Answer: B) A make or break moment

Question 54:
"I genuinely think the very first formal job interview a young person attends after finishing university is truly a decisive moment that determines either great success or damaging failure for their long-term professional confidence — the outcome can either launch a career brilliantly or significantly undermine self-belief."

👉 Replace "a decisive moment that determines either great success or damaging failure" with the correct phrase:

Options:

A) A nine-to-five situation
B) A dead-end opportunity
C) A make or break moment ✅
D) An extra mile situation
✅ Answer: C) A make or break moment

📝 Word 28: AT THE FOREFRONT
Question 55:
"Companies like Google, Apple, and Amazon have managed to remain in the leading and most important position in their respective industries for multiple decades by continuously and fearlessly reinventing themselves and maintaining extraordinary levels of investment in research and development."

👉 Replace "in the leading and most important position in their respective industries" with the correct phrase:

Options:

A) In the same boat
B) Under enormous pressure
C) At the forefront ✅
D) On a steep learning curve
✅ Answer: C) At the forefront

Question 56:
"I would love nothing more than to work for a company that is genuinely and demonstrably leading and pioneering in its field because I truly believe that being surrounded daily by the most ambitious, creative, and innovative people in any industry pushes you to continuously grow and improve."

👉 Replace "leading and pioneering in its field" with the correct phrase:

Options:

A) Making or breaking in its field
B) At the forefront of its field ✅
C) Pushing the boundaries of its field
D) Thinking outside the box of its field
✅ Answer: B) At the forefront of its field

📝 Word 29: STEEP LEARNING CURVE
Question 57:
"Starting my very first proper full-time office job was a genuinely challenging period in which I had to rapidly learn an enormous amount of new and complex information and skills — there was so much to absorb simultaneously about the systems, the people, the processes, and the unspoken workplace culture."

👉 Replace "period in which I had to rapidly learn an enormous amount of new and complex information and skills" with the correct phrase:

Options:

A) Glass ceiling
B) Corporate culture shift
C) Steep learning curve ✅
D) Make or break moment
✅ Answer: C) Steep learning curve

Question 58:
"I genuinely think every significant new job inevitably involves a challenging period of rapid learning and adjustment at the beginning, but I personally find that kind of intense intellectual challenge genuinely exciting rather than intimidating because it means you are constantly and meaningfully developing as a professional."

👉 Replace "a challenging period of rapid learning and adjustment" with the correct phrase:

Options:

A) A dead-end situation
B) A nine-to-five challenge
C) A steep learning curve ✅
D) A make or break period
✅ Answer: C) A steep learning curve

📝 Word 30: GO THE EXTRA MILE
Question 59:
"The primary reason that particular restaurant has developed such an outstanding and well-deserved reputation is that absolutely every member of the team consistently makes more effort than is expected or required to ensure every single customer feels genuinely welcomed, valued, and well cared for."

👉 Replace "makes more effort than is expected or required" with the correct phrase:

Options:

A) Thinks outside the box
B) Goes the extra mile ✅
C) Pushes the boundaries
D) Climbs the ladder
✅ Answer: B) Goes the extra mile

Question 60:
"I have the deepest and most genuine admiration for people who consistently do significantly more than the minimum that is required of them in their professional life — not because they are forced or incentivised to do so, but because they take authentic and deep personal pride in doing absolutely everything to the very highest possible standard."

👉 Replace "do significantly more than the minimum that is required of them" with the correct phrase:

Options:

A) Make or break their career
B) Go the extra mile ✅
C) Climb the corporate ladder
D) Give their all to burning out
✅ Answer: B) Go the extra mile
"""

import re
import json

def parse_exercises(text):
    questions = re.split(r'Question \d+:', text)
    exercises = []
    
    # Drop the first split as it's the preamble
    for q in questions[1:]:
        q = q.strip()
        if not q:
            continue
            
        # Extract the original sentence (in quotes)
        sentence_match = re.search(r'^"(.*?)"', q)
        if not sentence_match:
            continue
            
        sentence_original = sentence_match.group(1)
        
        # Extract the phrase to replace
        replace_match = re.search(r'Replace "(.*?)" with the correct (word|phrase):', q)
        if not replace_match:
            continue
            
        replace_this = replace_match.group(1)
        
        # Extract the correct answer from the specific ✅ Answer line, taking the text after the ')'
        answer_match = re.search(r'✅ Answer: [A-D]\)\s*(.*?)$', q, re.MULTILINE)
        if not answer_match:
            continue
            
        target_word = answer_match.group(1).strip()
        # lowercase the target word since it is usually capital in the answer line
        target_word = target_word.lower()
        
        exercises.append({
            "instruction": "Replace the highlighted phrase with the correct vocabulary word.",
            "sentence_original": sentence_original.replace('"', '\\"'),
            "replace_this": replace_this.replace('"', '\\"'),
            "target_word": target_word
        })
        
    return exercises

exercises_data = parse_exercises(raw_data)

ts_objects = []
for i, ex in enumerate(exercises_data):
    ts_objects.append(f"""            {{
                id: {i+1},
                instruction: "{ex['instruction']}",
                sentence_original: "{ex['sentence_original']}",
                replace_this: "{ex['replace_this']}",
                target_word: "{ex['target_word']}"
            }}""")

ts_array_content = ",\n".join(ts_objects)

ts_replacement = f"synonymSwap: [\n{ts_array_content}\n        ],"

file_path = "c:\\\\Users\\\\Honor\\\\Desktop\\\\Новая папка (4)\\\\Ai-Ielts-26-october\\\\frontend\\\\data\\\\vocabulary\\\\business.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the empty synonymSwap array
# Note: In TS it is currently synonymSwap: [],
content = content.replace("synonymSwap: [],", ts_replacement)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Appended {len(exercises_data)} synonym swap exercises to business.ts!")
