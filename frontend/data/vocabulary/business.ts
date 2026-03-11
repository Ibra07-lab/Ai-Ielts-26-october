import { TopicData } from "./types";

/**
 * BUSINESS & WORK VOCABULARY
 * 
 * This file contains all words and exercises for the Business & Work topic.
 * Includes: Academic Words, Phrasal Verbs, and Idioms
 * 
 * HOW TO ADD NEW WORDS:
 * 1. Add a new object to the 'words' array below
 * 2. Fill in all required fields (id, word, definition, etc.)
 * 3. The word will automatically appear in the vocabulary builder
 */

export const businessTopicData: TopicData = {
    topic: {
        id: 1,
        name: "Business & Work",
        icon: "💼",
        description: "Essential vocabulary for discussing careers, workplace, and business",
        wordsCount: 60,
        color: "bg-blue-500",
        ieltsSection: "writing",
        status: "in_progress",
        previewWords: ["lucrative", "entrepreneurial", "monopolise"],
        progress: 12,
    },

    words: [

        // ===== SPEAKING VOCABULARY =====
        {
            id: 1,
            word: "job satisfaction",
            definition: "The feeling of pleasure and fulfilment you get from your work",
            exampleSentence: "My mum has worked as a nurse for twenty years and she still has incredibly high job satisfaction because she genuinely loves helping people.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "B2",
            context: "This phrase works perfectly in Part 1 questions like \"Do you enjoy your work?\" and Part 3 questions about what makes a good job.",
            collocations: ["high job satisfaction", "lack job satisfaction", "find job satisfaction", "job satisfaction levels"],
            speakingExample: "I think job satisfaction is more important than salary because if you hate what you do every day, no amount of money can really make you happy."
        },
        {
            id: 2,
            word: "work-life balance",
            definition: "The ability to divide your time and energy fairly between your job and your personal life",
            exampleSentence: "My friend recently quit his high-paying job at a bank because the work-life balance was terrible — he was working until midnight every single night.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "B2",
            context: "This is one of the most natural and impressive phrases you can use in Speaking Part 3 when discussing modern working life.",
            collocations: ["good work-life balance", "achieve work-life balance", "struggle with work-life balance", "poor work-life balance"],
            speakingExample: "Honestly, I think work-life balance is one of the biggest challenges for people my age because we feel pressure to work harder but also want time for ourselves."
        },
        {
            id: 3,
            word: "get promoted",
            definition: "To be moved to a higher and more senior position at work",
            exampleSentence: "My older sister worked incredibly hard for three years and finally got promoted to regional manager last month — the whole family is so proud of her.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "verb",
            type: "phrasal_verb",
            cefrLevel: "B2",
            context: "Phrasal verbs like \"get promoted\" sound far more natural in speaking than formal alternatives like \"receive a promotion\" and will impress your examiner.",
            collocations: ["get promoted quickly", "deserve to get promoted", "work hard to get promoted", "recently got promoted"],
            speakingExample: "In my country, people often get promoted based on how long they have worked somewhere rather than how talented they actually are, which I think is quite unfair."
        },
        {
            id: 4,
            word: "dead-end job",
            definition: "A job with no opportunities for career advancement or personal growth",
            exampleSentence: "My cousin felt completely trapped in a dead-end job at a supermarket for years before he finally decided to go back to university and retrain.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "idiom",
            cefrLevel: "B2",
            context: "Using idioms like \"dead-end job\" demonstrates a high level of lexical range and will genuinely impress your examiner in Parts 2 and 3.",
            collocations: ["stuck in a dead-end job", "feel like a dead-end job", "escape a dead-end job"],
            speakingExample: "I think one of the biggest fears young people have is ending up in a dead-end job where there is simply no opportunity to grow, learn, or move forward."
        },
        {
            id: 5,
            word: "boss",
            definition: "The person in charge of a workplace or team; a manager or supervisor",
            exampleSentence: "I had a really difficult boss at my first part-time job who never gave any praise or feedback, which made the whole experience quite demoralising.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "B2",
            context: "\"Boss\" is perfectly natural and appropriate in IELTS Speaking — far better than the overly formal \"superior\" or \"line manager\" which sound unnatural in conversation.",
            collocations: ["good boss", "strict boss", "get along with your boss", "difficult boss", "report to a boss"],
            speakingExample: "I think having a good boss makes an enormous difference to how much you enjoy going to work every day — a supportive manager can completely transform your experience."
        },
        {
            id: 6,
            word: "burn out",
            definition: "To become completely exhausted physically and mentally from working too hard for too long",
            exampleSentence: "One of my university friends burned out completely during his final year because he was studying full-time while also working a part-time job to pay his rent.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "verb",
            type: "phrasal_verb",
            cefrLevel: "B2",
            context: "This is an extremely natural and commonly used expression in everyday English and will sound impressively fluent when used correctly in speaking.",
            collocations: ["completely burn out", "risk burning out", "burned out from work", "on the verge of burning out"],
            speakingExample: "I think a lot of people in high-pressure careers like law or finance end up burning out by their thirties because the culture of overworking is just completely normalised in those industries."
        },
        {
            id: 7,
            word: "nine-to-five",
            definition: "Describing a conventional working day from nine in the morning to five in the afternoon; a standard office job with regular hours",
            exampleSentence: "My dad has worked a nine-to-five office job his entire career and he loves it because he always knows exactly when he will be home for dinner.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "B2",
            context: "Using culturally embedded expressions like \"nine-to-five\" shows the examiner that your English is genuinely natural and not simply memorised from a textbook.",
            collocations: ["nine-to-five job", "typical nine-to-five", "work nine-to-five", "beyond the nine-to-five"],
            speakingExample: "I don't think the traditional nine-to-five model suits everyone — some people are far more productive working flexible hours from home."
        },
        {
            id: 8,
            word: "make a living",
            definition: "To earn enough money from your work to support yourself and pay for your basic needs",
            exampleSentence: "It's becoming increasingly hard for young artists and musicians to make a decent living from their creative work alone without a second source of income.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "phrase",
            type: "academic",
            cefrLevel: "B2",
            context: "This phrase is extremely natural and fluent — the kind of expression that native speakers use automatically and that examiners reward highly.",
            collocations: ["make a decent living", "struggle to make a living", "make a living from something", "hard to make a living"],
            speakingExample: "I think as long as someone can make a comfortable living doing something they genuinely enjoy, that is truly the ideal career situation."
        },
        {
            id: 9,
            word: "team player",
            definition: "Someone who works effectively and cooperatively with other people as part of a group",
            exampleSentence: "During my part-time job at a café, I quickly realised how important it is to be a genuine team player because when one person doesn't cooperate, the whole operation suffers.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "B2",
            context: "This phrase is perfect for Part 2 tasks asking you to describe your work style or a person you admire professionally.",
            collocations: ["be a team player", "good team player", "not a team player", "value team players"],
            speakingExample: "I would definitely describe myself as a team player — I genuinely prefer working collaboratively with others rather than tackling everything on my own."
        },
        {
            id: 10,
            word: "climb the ladder",
            definition: "To gradually progress to higher and more senior positions throughout your career",
            exampleSentence: "My aunt started as a junior receptionist at a hotel and spent fifteen years steadily climbing the ladder until she became the general manager.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "idiom",
            type: "idiom",
            cefrLevel: "B2",
            context: "Career idioms like this are exactly what examiners want to hear in Band 7+ speaking responses — they demonstrate genuine fluency and natural expression.",
            collocations: ["climb the career ladder", "desperate to climb the ladder", "slowly climb the ladder"],
            speakingExample: "In highly competitive industries like finance or consulting, the pressure to climb the ladder quickly can have really damaging effects on people's personal lives and mental health."
        },
        {
            id: 11,
            word: "career prospects",
            definition: "The opportunities available for future advancement and success in a particular job or field",
            exampleSentence: "I chose to study computer science specifically because the career prospects in the technology sector are genuinely outstanding right now.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "This phrase is perfect for Part 3 discussions about education, career choices, and what young people should prioritise when entering the job market.",
            collocations: ["good career prospects", "limited career prospects", "improve career prospects", "career prospects in a field"],
            speakingExample: "I think career prospects should be one of the most important factors young individuals consider when choosing a university degree, alongside their personal interests and passions."
        },
        {
            id: 12,
            word: "self-employed",
            definition: "Working for yourself and running your own business rather than working for an employer",
            exampleSentence: "My uncle became self-employed five years ago when he set up his own plumbing business, and he says it's the best professional decision he has ever made.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "adjective",
            type: "academic",
            cefrLevel: "C1",
            context: "This is a very versatile and natural word that works well across all three parts of the IELTS Speaking test when discussing work and career topics.",
            collocations: ["become self-employed", "be self-employed", "self-employed worker", "self-employed professional"],
            speakingExample: "Being self-employed appeals to me enormously because I love the idea of being completely in control of my own time and the direction of my work."
        },
        {
            id: 13,
            word: "motivate",
            definition: "To give someone a reason or desire to do something; to inspire someone to take action or work harder",
            exampleSentence: "My football coach had an incredible ability to motivate the team even when we were losing badly — his belief in us genuinely changed how we performed.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "C1",
            context: "Using verbs confidently and accurately like this demonstrates strong grammatical range and contributes significantly to your grammatical accuracy score.",
            collocations: ["motivate employees", "motivate yourself", "feel motivated", "highly motivated", "motivate a team"],
            speakingExample: "I think the most effective managers are the ones who know how to genuinely motivate their team by recognising individual strengths rather than simply demanding results."
        },
        {
            id: 14,
            word: "flexible working",
            definition: "A working arrangement that allows employees to choose when, where, or how many hours they work",
            exampleSentence: "My mum's company introduced flexible working after the pandemic and she says her productivity has actually increased dramatically because she can now work at the times when she feels most focused.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "This is an extremely topical and relevant phrase — examiners frequently ask about remote work and flexible arrangements, so having this phrase ready is very valuable.",
            collocations: ["offer flexible working", "flexible working hours", "flexible working arrangements", "demand flexible working"],
            speakingExample: "I think flexible working is genuinely one of the most positive developments in modern employment culture because it allows people to manage both their professional and personal responsibilities much more effectively."
        },
        {
            id: 15,
            word: "skilled worker",
            definition: "Someone who has specific training, expertise, or qualifications needed to perform a particular type of work",
            exampleSentence: "There is a serious shortage of skilled workers in the construction industry in my country, which is making housing development extremely slow and expensive.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "This phrase connects naturally to social and economic discussions in Part 3, where examiners often ask about employment, education, and government responsibility.",
            collocations: ["highly skilled worker", "skilled worker shortage", "train skilled workers", "attract skilled workers"],
            speakingExample: "I think governments have a responsibility to invest heavily in education and vocational training to ensure there is always a sufficient supply of skilled workers in essential industries."
        },
        {
            id: 16,
            word: "under pressure",
            definition: "Experiencing stress or difficulty because of high demands or expectations placed upon you",
            exampleSentence: "My sister works as an emergency room doctor and she has to make critical life-or-death decisions constantly while working under enormous pressure.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "Using this phrase to talk about yourself in Part 1 or Part 2 creates a very natural and authentic-sounding response that examiners find engaging.",
            collocations: ["work under pressure", "perform under pressure", "feel under pressure", "constantly under pressure"],
            speakingExample: "Honestly, I work quite well under pressure — I find that having a deadline actually helps me focus and produce my best work rather than leaving things until the last minute."
        },
        {
            id: 17,
            word: "hands-on experience",
            definition: "Practical experience gained by actually doing something rather than just learning about it theoretically",
            exampleSentence: "I did a summer internship at a marketing agency last year and the hands-on experience I gained was far more valuable than anything I had learned in the classroom.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "This phrase bridges naturally between the education and work topics — two of the most common IELTS Speaking themes — making it doubly useful.",
            collocations: ["gain hands-on experience", "valuable hands-on experience", "lack hands-on experience", "hands-on experience in a field"],
            speakingExample: "I think one of the biggest problems with university education is that it focuses too much on theory and not enough on giving students genuine hands-on experience in their chosen field."
        },
        {
            id: 18,
            word: "give it your all",
            definition: "To put in the maximum possible effort and dedication into something",
            exampleSentence: "My dad always taught me that no matter what job you are doing — whether it is sweeping floors or running a company — you should always give it your all.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "idiom",
            type: "idiom",
            cefrLevel: "C1",
            context: "Idiomatic expressions used naturally and appropriately like this are a strong indicator of Band 7+ lexical resource in Speaking.",
            collocations: ["give it your all at work", "always give it your all", "determined to give it your all"],
            speakingExample: "I genuinely believe that if you are going to do something, you should give it your all — working half-heartedly never produces results you can feel truly proud of."
        },
        {
            id: 19,
            word: "land a job",
            definition: "To successfully obtain or secure a job, usually after a period of searching or competing",
            exampleSentence: "My best friend spent six months sending applications everywhere before he finally landed a job at a top engineering firm — the perseverance paid off.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "verb",
            type: "phrasal_verb",
            cefrLevel: "C1",
            context: "Phrasal verbs like \"land a job\" demonstrate authentic spoken English fluency and are much more natural than saying \"obtain employment\" in a speaking context.",
            collocations: ["land a good job", "land a dream job", "manage to land a job", "land a job in a competitive field"],
            speakingExample: "I think having strong communication skills is absolutely essential for landing a good job nowadays, regardless of what industry you are trying to enter."
        },
        {
            id: 20,
            word: "in the same boat",
            definition: "To be in the same difficult or challenging situation as someone else",
            exampleSentence: "During the economic recession, millions of workers found themselves in the same boat — worried about job security and struggling to pay bills.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "idiom",
            type: "idiom",
            cefrLevel: "C1",
            context: "This idiom is perfect for Part 3 when discussing social issues related to employment, as it shows you can generalise your argument naturally and fluently.",
            collocations: ["be in the same boat", "we are all in the same boat", "find yourself in the same boat"],
            speakingExample: "I think most young graduates are in the same boat when it comes to finding their first job — everyone has a degree but very little actual work experience."
        },
        {
            id: 21,
            word: "corporate culture",
            definition: "The shared values, attitudes, behaviours, and practices that characterise a particular company or organisation",
            exampleSentence: "One of the main reasons I would love to work for that particular company is that their corporate culture is completely built around innovation, creativity, and employee wellbeing.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "Using sophisticated compound nouns like \"corporate culture\" in a natural and contextually appropriate way is a strong signal of Band 8 lexical resource.",
            collocations: ["positive corporate culture", "toxic corporate culture", "build a corporate culture", "corporate culture of overworking"],
            speakingExample: "I think toxic corporate culture — where overworking is glorified and mental health is ignored — is one of the most serious and overlooked problems in modern business."
        },
        {
            id: 22,
            word: "glass ceiling",
            definition: "An invisible barrier that prevents certain groups — particularly women and minorities — from rising to the highest levels of an organisation despite their qualifications",
            exampleSentence: "Despite decades of progress, many highly qualified women still report hitting the glass ceiling when they try to reach the most senior leadership positions in large corporations.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "idiom",
            type: "idiom",
            cefrLevel: "C1",
            context: "This is one of the most powerful and impressive idioms you can use in IELTS Speaking Part 3 discussions about gender equality and workplace fairness.",
            collocations: ["break the glass ceiling", "hit the glass ceiling", "glass ceiling for women", "shatter the glass ceiling"],
            speakingExample: "I think the glass ceiling still very much exists in many industries — women are consistently underrepresented at the highest levels of corporate leadership, and that needs to change urgently."
        },
        {
            id: 23,
            word: "entrepreneurial spirit",
            definition: "The mindset, drive, and willingness to take risks in order to start and build your own business or create new opportunities",
            exampleSentence: "My grandmother had an incredible entrepreneurial spirit — she built a successful tailoring business from nothing during a time when very few women ran their own companies.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "This sophisticated phrase works brilliantly in Part 3 discussions about business, education, and what qualities make people successful in the modern economy.",
            collocations: ["have an entrepreneurial spirit", "nurture entrepreneurial spirit", "strong entrepreneurial spirit", "entrepreneurial spirit drives innovation"],
            speakingExample: "I genuinely believe that schools should actively nurture entrepreneurial spirit in students from a young age rather than simply training them to be good employees."
        },
        {
            id: 24,
            word: "cutthroat competition",
            definition: "Extremely fierce, aggressive, and ruthless competition in which people or companies will do almost anything to succeed",
            exampleSentence: "The fashion industry is known for its cutthroat competition — brands are constantly fighting for the same customers and any mistake can be absolutely fatal to a business.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "Vivid and expressive compound adjectives like \"cutthroat\" demonstrate a sophisticated and genuine command of English that examiners at Band 8+ level love to hear.",
            collocations: ["face cutthroat competition", "survive cutthroat competition", "cutthroat competition in an industry"],
            speakingExample: "I think the cutthroat competition that exists in certain industries like finance and law puts enormous and often unhealthy psychological pressure on young professionals just starting their careers."
        },
        {
            id: 25,
            word: "think outside the box",
            definition: "To think creatively and unconventionally, coming up with new and original ideas that go beyond standard approaches",
            exampleSentence: "My favourite teacher always encouraged us to think outside the box rather than just memorising information, and I believe that approach genuinely prepared me better for real working life.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "idiom",
            type: "idiom",
            cefrLevel: "C1",
            context: "While this is a widely known idiom, using it accurately, naturally, and in the right context still demonstrates strong lexical awareness and communicative competence.",
            collocations: ["ability to think outside the box", "encourage thinking outside the box", "need to think outside the box"],
            speakingExample: "In today's rapidly changing business world, I think the ability to think outside the box and adapt quickly to new challenges is far more valuable than simply having a long list of qualifications."
        },
        {
            id: 26,
            word: "pushing the boundaries",
            definition: "Going beyond existing limits or conventional expectations in order to achieve something new or innovative",
            exampleSentence: "Companies like Tesla and SpaceX have become so influential precisely because they are constantly pushing the boundaries of what people previously thought was technologically possible.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "This phrase conveys intellectual sophistication and passion — two qualities that make Speaking responses much more engaging and memorable for the examiner.",
            collocations: ["pushing the boundaries of innovation", "pushing professional boundaries", "constantly pushing boundaries"],
            speakingExample: "I admire people who are willing to keep pushing the boundaries in their field even when they face enormous scepticism and resistance from more traditional thinkers."
        },
        {
            id: 27,
            word: "make or break",
            definition: "A situation or decision that will either lead to great success or total failure — there is no middle ground",
            exampleSentence: "The first few months of running a new restaurant are truly make or break — if you don't build a loyal customer base quickly, the business almost certainly won't survive.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "idiom",
            type: "idiom",
            cefrLevel: "C1",
            context: "Idioms that express high stakes and critical decisions like this one are particularly impressive in Part 3 discussions about career challenges and business risks.",
            collocations: ["make or break moment", "make or break decision", "make or break year", "make or break situation"],
            speakingExample: "I think the first job interview you attend after university is really a make or break moment for your confidence — if it goes well, it sets you up brilliantly, but if it goes badly it can really knock your self-belief."
        },
        {
            id: 28,
            word: "at the forefront",
            definition: "In the leading or most important position in a particular field or area of activity",
            exampleSentence: "Companies like Google and Apple have managed to remain at the forefront of the technology industry for decades by continuously reinventing themselves and investing heavily in research.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "This phrase allows you to discuss ambition and aspiration in a sophisticated and impressive way — perfect for Part 2 tasks about your ideal job or a company you admire.",
            collocations: ["at the forefront of innovation", "at the forefront of industry", "be at the forefront", "remain at the forefront"],
            speakingExample: "I would love to work for a company that is genuinely at the forefront of its industry because I think being surrounded by the most ambitious and innovative people really pushes you to grow."
        },
        {
            id: 29,
            word: "steep learning curve",
            definition: "A situation in which you have to learn a very large amount of new and complex information or skills in a short period of time",
            exampleSentence: "Starting my first proper office job was a steep learning curve — there was so much to learn about the systems, the people, and the unspoken workplace culture all at once.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "This phrase is very natural, widely used, and impressively specific — it shows the examiner that your vocabulary goes well beyond the basic and generic.",
            collocations: ["face a steep learning curve", "experience a steep learning curve", "it was a steep learning curve"],
            speakingExample: "I think every new job involves a steep learning curve, but I actually find that kind of challenge exciting rather than intimidating because it means you are constantly developing."
        },
        {
            id: 30,
            word: "go the extra mile",
            definition: "To make more effort than is expected or required; to do more than the minimum necessary to achieve something",
            exampleSentence: "The reason that particular restaurant has such an outstanding reputation is that every single member of the staff consistently goes the extra mile to make customers feel genuinely welcome and valued.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "idiom",
            type: "idiom",
            cefrLevel: "C1",
            context: "Finishing a Part 2 or Part 3 answer with a powerful and well-delivered idiom like this leaves a lasting impression on the examiner and strongly signals Band 7-8 lexical resource.",
            collocations: ["always go the extra mile", "willing to go the extra mile", "go the extra mile for customers", "go the extra mile at work"],
            speakingExample: "I really admire people who consistently go the extra mile in their work — not because they are forced to, but because they genuinely take pride in doing everything to the very highest standard they possibly can."

        },
        // ==========================================
        // BAND 6-8+ WRITING VOCABULARY
        // ==========================================

        {
            id: 31,
            word: "employment",
            definition: "The condition of having a paid job; the state of being employed by a company or organisation",
            exampleSentence: "The government launched a new initiative aimed at creating thousands of employment opportunities in the renewable energy sector.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "B2",
            context: "\"Employment\" is a key foundational term for any writing task about work — always prefer it over the informal \"job\" in your Task 2 essays.",
            collocations: ["full employment", "employment rate", "seek employment", "employment opportunities", "employment sector"],
            writingExample: "Governments have a fundamental responsibility to create and sustain stable employment opportunities for all citizens, particularly during periods of economic downturn."
        },
        {
            id: 32,
            word: "workforce",
            definition: "All the people engaged in or available for work, either in a country, industry, or company",
            exampleSentence: "The technology company invested heavily in workforce development programmes to ensure all employees had up-to-date digital skills.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "B2",
            context: "\"Workforce\" is far more formal and academically appropriate than \"workers\" or \"employees\" and should be used consistently in Task 2 writing.",
            collocations: ["skilled workforce", "ageing workforce", "diverse workforce", "workforce development", "enter the workforce"],
            writingExample: "As automation continues to advance at an unprecedented rate, governments must take urgent steps to retrain and upskill their workforce to meet the demands of a fundamentally transformed economy."
        },
        {
            id: 33,
            word: "salary",
            definition: "A fixed regular payment, typically paid monthly, made by an employer to an employee in return for their work",
            exampleSentence: "After three years of exceptional performance reviews, she successfully negotiated a significant salary increase and a comprehensive benefits package.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "B2",
            context: "In writing, always use \"salary\" rather than \"pay\" or \"money\" — the more precise your vocabulary, the higher your Lexical Resource score.",
            collocations: ["competitive salary", "salary increase", "annual salary", "salary package", "negotiate a salary"],
            writingExample: "While a competitive salary is undoubtedly important, research consistently demonstrates that employees who receive meaningful recognition and professional development opportunities tend to be significantly more productive and loyal."
        },
        {
            id: 34,
            word: "unemployment",
            definition: "The state of not having a job despite being willing and able to work; the proportion of people without work in a society",
            exampleSentence: "Youth unemployment in the region reached a record high of thirty percent following the closure of several major manufacturing plants.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "B2",
            context: "Always try to add a specific modifier before \"unemployment\" — such as \"youth unemployment\" or \"long - term unemployment\" — to show precision and sophistication.",
            collocations: ["unemployment rate", "rise in unemployment", "tackle unemployment", "youth unemployment", "long-term unemployment"],
            writingExample: "Rising unemployment rates, particularly among young people, represent one of the most pressing social and economic challenges facing governments in the post-pandemic era."
        },
        {
            id: 35,
            word: "productivity",
            definition: "The efficiency with which goods are produced or tasks are completed; the rate of output per unit of input in a workplace",
            exampleSentence: "The introduction of flexible working hours led to a measurable twenty percent increase in overall employee productivity within just six months.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "B2",
            context: "\"Productivity\" is an essential academic word for business writing — it belongs to the Academic Word List and will contribute directly to your Lexical Resource score.",
            collocations: ["increase productivity", "high productivity", "low productivity", "boost productivity", "workplace productivity"],
            writingExample: "It has been widely demonstrated that employees who maintain a healthy work-life balance consistently demonstrate higher levels of productivity and creativity than those who are routinely overworked."
        },
        {
            id: 36,
            word: "career development",
            definition: "The ongoing process of managing and improving one's professional skills, experiences, and advancement throughout a working life",
            exampleSentence: "The multinational corporation offered all employees an annual budget of two thousand dollars specifically dedicated to career development activities such as courses and conferences.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "B2",
            context: "Using noun phrases like \"career development\" instead of simpler expressions like \"getting better at work\" is exactly the kind of lexical upgrade that moves you from Band 6 to Band 7.",
            collocations: ["invest in career development", "career development opportunities", "support career development", "career development programme"],
            writingExample: "Companies that invest meaningfully in the career development of their employees consistently report higher retention rates, greater staff loyalty, and significantly improved overall performance."
        },
        {
            id: 37,
            word: "employee",
            definition: "A person who is hired and paid to work for a company, organisation, or individual employer",
            exampleSentence: "The survey revealed that over sixty percent of employees felt their contributions were not adequately recognised or rewarded by their managers.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "B2",
            context: "In academic writing, always use \"employee\" rather than \"worker\" — and try to use it alongside strong collocations like \"employee retention\" or \"employee satisfaction\" to show range.",
            collocations: ["motivate employees", "retain employees", "employee rights", "employee benefits", "employee satisfaction"],
            writingExample: "Organisations that prioritise employee wellbeing and professional growth consistently outperform those that treat their workforce purely as a means of generating profit."
        },
        {
            id: 38,
            word: "employer",
            definition: "A person, company, or organisation that hires and pays people to work for them",
            exampleSentence: "Many employers now consider emotional intelligence and communication skills to be just as important as technical qualifications when evaluating job candidates.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "B2",
            context: "The employer-employee relationship is a very common theme in IELTS Writing Task 2 business questions — having both words ready with strong collocations is essential.",
            collocations: ["potential employer", "employer responsibilities", "attract employers", "employer expectations", "employer-employee relationship"],
            writingExample: "Employers have a legal and ethical responsibility to provide safe, fair, and non-discriminatory working conditions for all members of their workforce."
        },
        {
            id: 39,
            word: "wages",
            definition: "Regular payment made to a worker, typically calculated on an hourly or daily basis for manual or routine work",
            exampleSentence: "The government announced plans to raise the national minimum wage by eight percent in response to growing pressure from trade unions and workers' rights groups.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "B2",
            context: "Understanding the difference between \"salary\" (monthly, professional) and \"wages\" (hourly, manual) and using each correctly demonstrates sophisticated lexical awareness.",
            collocations: ["minimum wages", "raise wages", "low wages", "fair wages", "wage gap", "wage growth"],
            writingExample: "The persistent and widening gap between executive compensation packages and the wages of ordinary frontline workers raises serious and legitimate questions about economic fairness and social justice."
        },
        {
            id: 40,
            word: "profession",
            definition: "A paid occupation — especially one that requires prolonged training, formal education, and a formal qualification",
            exampleSentence: "Medicine is widely regarded as one of the most rewarding yet simultaneously most demanding and emotionally challenging professions a person can enter.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "B2",
            context: "\"Profession\" is significantly more formal and appropriate than \"job\" in academic writing — always make this upgrade in your Task 2 essays.",
            collocations: ["choose a profession", "enter a profession", "professional qualifications", "respected profession", "demanding profession"],
            writingExample: "The teaching profession is chronically undervalued and underfunded in many countries, despite the fact that teachers play an absolutely fundamental role in shaping the intellectual and social development of entire generations."
        },
        {
            id: 41,
            word: "economic growth",
            definition: "The increase in a country's production of goods and services, typically measured as a rise in Gross Domestic Product",
            exampleSentence: "The government's decision to invest heavily in infrastructure projects was specifically designed to stimulate economic growth and create thousands of new jobs.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "This phrase appears in a huge proportion of IELTS Task 2 business essays — having it ready with strong collocations and a sophisticated sentence structure will serve you extremely well.",
            collocations: ["stimulate economic growth", "sustain economic growth", "economic growth rate", "drive economic growth"],
            writingExample: "While rapid economic growth undoubtedly creates employment opportunities and raises living standards, it frequently comes at a significant and often irreversible environmental cost that future generations will be forced to bear."
        },
        {
            id: 42,
            word: "automation",
            definition: "The use of largely automatic equipment, technology, or computer systems to perform tasks that were previously carried out by human workers",
            exampleSentence: "The widespread automation of assembly line processes in the automotive industry has dramatically reduced production costs while simultaneously eliminating hundreds of thousands of manual jobs.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "\"Automation\" is one of the hottest and most frequently examined topics in recent IELTS Writing Task 2 papers — knowing this word deeply is absolutely essential.",
            collocations: ["rise of automation", "automation replaces jobs", "impact of automation", "resist automation", "embrace automation"],
            writingExample: "The accelerating rise of automation and artificial intelligence poses a profound and urgent challenge to governments worldwide, as entire categories of employment face the very real threat of becoming obsolete within a generation."
        },
        {
            id: 43,
            word: "globalisation",
            definition: "The process by which businesses, economies, cultures, and governments become increasingly interconnected and integrated across international borders",
            exampleSentence: "Globalisation has fundamentally transformed the fashion industry, enabling companies to source materials from dozens of different countries and sell products in markets they could never previously have reached.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "This is a high-value academic word that demonstrates sophisticated understanding of economic and social systems — use it confidently in Task 2 essays about business and work.",
            collocations: ["impact of globalisation", "accelerate globalisation", "globalisation of markets", "benefits of globalisation", "resist globalisation"],
            writingExample: "While globalisation has undeniably created enormous economic opportunities and driven unprecedented levels of international trade, it has simultaneously contributed to the deindustrialisation of many developed economies and the displacement of large sections of the traditional workforce."
        },
        {
            id: 44,
            word: "entrepreneurship",
            definition: "The activity of setting up and running a business, taking on financial risks in the hope of generating profit and creating value",
            exampleSentence: "The government introduced a range of financial incentives and mentorship programmes specifically designed to promote entrepreneurship among young people from disadvantaged backgrounds.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "Moving from the adjective \"entrepreneurial\" to the sophisticated noun \"entrepreneurship\" is exactly the kind of lexical upgrade that pushes writing responses to Band 7 and above.",
            collocations: ["promote entrepreneurship", "support entrepreneurship", "culture of entrepreneurship", "entrepreneurship education", "rise in entrepreneurship"],
            writingExample: "Fostering a culture of entrepreneurship through targeted education programmes and accessible startup funding is essential for driving innovation, creating employment, and sustaining long-term national economic competitiveness."
        },
        {
            id: 45,
            word: "labour market",
            definition: "The supply and demand for labour in which employees provide the supply and employers provide the demand",
            exampleSentence: "The rapid growth of the technology sector has significantly transformed the labour market, creating high demand for digital skills while simultaneously reducing the need for many traditional clerical roles.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "\"Labour market\" is a precise and impressive academic term that immediately signals sophistication — it is far superior to simply writing \"job market\" in a formal essay.",
            collocations: ["competitive labour market", "tight labour market", "labour market trends", "enter the labour market", "labour market reforms"],
            writingExample: "Governments must continuously monitor and respond to shifting labour market trends to ensure that their education and training systems are adequately preparing citizens for the evolving demands of the modern economy."
        },
        {
            id: 46,
            word: "gender pay gap",
            definition: "The difference in average earnings between men and women across an economy or within a specific industry",
            exampleSentence: "A major international report revealed that at the current rate of progress, it will take over one hundred years to fully close the global gender pay gap.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "This phrase is frequently the central theme of IELTS Task 2 business questions about equality and fairness — having a sophisticated and nuanced understanding of it is extremely valuable.",
            collocations: ["close the gender pay gap", "widen the gender pay gap", "address the gender pay gap", "persistent gender pay gap"],
            writingExample: "The persistent gender pay gap in many developed economies reflects deep-rooted structural inequalities in the workplace that cannot be resolved through legislation alone but require fundamental cultural and organisational change."
        },
        {
            id: 47,
            word: "multinational corporation",
            definition: "A large company that operates in multiple countries simultaneously, with its headquarters typically based in one nation",
            exampleSentence: "Several major multinational corporations have relocated their regional headquarters to countries with significantly lower corporate tax rates, creating considerable controversy among governments and the public.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "This is an essential term for any Task 2 essay discussing international business, trade, or economic inequality — use it with both positive and negative collocations to demonstrate balance.",
            collocations: ["large multinational corporation", "multinational corporation invests", "multinational corporation exploits", "role of multinational corporations"],
            writingExample: "While multinational corporations undeniably generate employment and stimulate economic activity in the countries where they operate, they have also been widely criticised for exploiting cheaper labour markets, avoiding tax obligations, and undermining local businesses."
        },
        {
            id: 48,
            word: "corporate social responsibility",
            definition: "The commitment of businesses to behave ethically and contribute positively to society and the environment beyond their core profit-making activities",
            exampleSentence: "As part of their corporate social responsibility programme, the company committed to planting one million trees and achieving carbon neutrality by 2030.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "Often shortened to CSR in academic and professional writing — knowing both the full term and the abbreviation demonstrates impressive subject knowledge and sophistication.",
            collocations: ["embrace corporate social responsibility", "corporate social responsibility programme", "corporate social responsibility initiatives", "lack of corporate social responsibility"],
            writingExample: "There is a growing and compelling argument that corporate social responsibility should be legally mandated rather than left to the discretion of individual companies, many of which prioritise shareholder profit over genuine social and environmental obligation."
        },
        {
            id: 49,
            word: "income inequality",
            definition: "The unequal distribution of income and wealth across a society or economy",
            exampleSentence: "Several major economists have argued that the dramatic rise in income inequality over the past four decades is directly linked to the decline of trade unions and the erosion of workers' collective bargaining power.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "This is a high-frequency topic in IELTS Writing Task 2 — combining it with sophisticated language about causes, effects, and solutions will generate a very strong response.",
            collocations: ["address income inequality", "widen income inequality", "reduce income inequality", "rising income inequality", "income inequality gap"],
            writingExample: "Rising income inequality — in which an increasingly small proportion of the population controls an ever-larger share of total national wealth — poses a fundamental threat to social cohesion, democratic stability, and long-term economic health."
        },
        {
            id: 50,
            word: "occupational hazard",
            definition: "A risk or danger that is inherent in or associated with a particular type of work or profession",
            exampleSentence: "Chronic back pain is a well-documented occupational hazard for nurses, warehouse workers, and others whose jobs require prolonged physical exertion or heavy lifting.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "This phrase demonstrates impressive topic-specific vocabulary that goes beyond the generic — using specialised terms accurately is one of the clearest indicators of Band 7+ writing ability.",
            collocations: ["face an occupational hazard", "common occupational hazard", "occupational hazard of the job", "occupational hazard in an industry"],
            writingExample: "Governments and employers share a joint legal and moral responsibility to identify, minimise, and wherever possible eliminate the occupational hazards faced by workers across all industries, particularly those in physically demanding or high-risk environments."
        },
        {
            id: 51,
            word: "socioeconomic mobility",
            definition: "The ability of individuals or families to move between different levels of the economic and social hierarchy, typically through education or work",
            exampleSentence: "Access to high-quality education and fair employment practices are widely regarded as the two most powerful drivers of upward socioeconomic mobility in any society.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "This sophisticated compound noun immediately signals Band 8+ lexical awareness — it combines social and economic concepts in a way that demonstrates genuine academic depth.",
            collocations: ["promote socioeconomic mobility", "limit socioeconomic mobility", "upward socioeconomic mobility", "barriers to socioeconomic mobility"],
            writingExample: "When recruitment processes systematically favour candidates from privileged backgrounds, they actively undermine socioeconomic mobility and perpetuate a deeply entrenched cycle of inequality that no meritocratic society should tolerate."
        },
        {
            id: 52,
            word: "remuneration package",
            definition: "The complete set of financial and non-financial benefits that an employee receives in exchange for their work, including salary, bonuses, pension, and other perks",
            exampleSentence: "The executive's remuneration package — which included a base salary, performance bonuses, share options, and a company pension — was valued at over five million dollars annually.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "Replacing the simple word \"pay\" or \"salary\" with the sophisticated term \"remuneration package\" is a perfect example of the kind of lexical precision that examiners reward at Band 8+.",
            collocations: ["attractive remuneration package", "comprehensive remuneration package", "negotiate a remuneration package", "generous remuneration package"],
            writingExample: "While an attractive remuneration package undoubtedly plays a significant role in recruiting top talent, research consistently demonstrates that non-financial factors such as meaningful work, autonomy, and professional growth are equally — if not more — important in retaining high-performing employees over the long term."
        },
        {
            id: 53,
            word: "organisational restructuring",
            definition: "The significant reorganisation of a company's structure, operations, or workforce, often involving redundancies, mergers, or changes in management",
            exampleSentence: "The company announced a major organisational restructuring programme that would result in the elimination of approximately three thousand positions across its global operations.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "This term demonstrates high-level knowledge of business processes and shows the examiner that you can discuss complex corporate topics with genuine precision and sophistication.",
            collocations: ["undergo organisational restructuring", "large-scale organisational restructuring", "organisational restructuring leads to job losses", "organisational restructuring strategy"],
            writingExample: "While organisational restructuring may be a commercially necessary response to changing market conditions or technological disruption, it frequently results in significant human costs that governments and societies are inadequately prepared to absorb."
        },
        {
            id: 54,
            word: "meritocracy",
            definition: "A system in which advancement and success are determined by individual talent, effort, and achievement rather than by wealth, privilege, or social background",
            exampleSentence: "Many Silicon Valley technology companies have built their brand identity around the idea of meritocracy — the belief that the best ideas and the hardest workers will always rise to the top regardless of background.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "This is one of the most intellectually impressive words you can use in an IELTS Writing essay about work and fairness — it elevates your argument to a genuinely sophisticated academic level.",
            collocations: ["true meritocracy", "promote meritocracy", "meritocracy in the workplace", "undermine meritocracy", "aspire to meritocracy"],
            writingExample: "Despite widespread rhetoric about meritocracy in modern business culture, the persistent advantages enjoyed by candidates from elite educational institutions and privileged social networks suggest that many workplaces remain far from truly merit-based in their recruitment and promotion practices."
        },
        {
            id: 55,
            word: "precarious employment",
            definition: "Work that is insecure, unstable, poorly paid, and lacking in legal protections or benefits — such as zero-hours contracts or informal gig economy work",
            exampleSentence: "The rapid expansion of the gig economy has created millions of jobs, but critics argue that the vast majority of these represent precarious employment with no sick pay, no pension, and no job security.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "This is an extremely topical and impressive phrase that demonstrates awareness of contemporary labour market issues — exactly the kind of real-world relevance that makes Task 2 essays stand out at Band 8+.",
            collocations: ["rise of precarious employment", "precarious employment conditions", "trapped in precarious employment", "growth of precarious employment"],
            writingExample: "The alarming proliferation of precarious employment arrangements — including zero-hours contracts, temporary agency work, and gig economy platforms — is eroding the financial security and social protections that previous generations of workers fought hard to establish."
        },
        {
            id: 56,
            word: "intellectual capital",
            definition: "The collective knowledge, expertise, skills, and innovative capacity of an organisation's workforce, considered as a valuable economic asset",
            exampleSentence: "The technology giant's most valuable asset is not its physical infrastructure or financial reserves but the extraordinary intellectual capital represented by its team of world-leading engineers and researchers.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "Using economic concepts like \"intellectual capital\" demonstrates a sophisticated understanding of modern business that will genuinely impress academic examiners and push your score firmly into Band 8+ territory.",
            collocations: ["develop intellectual capital", "invest in intellectual capital", "protect intellectual capital", "intellectual capital drives growth"],
            writingExample: "In the knowledge-based economy of the twenty-first century, a nation's intellectual capital — the combined expertise, creativity, and innovative capacity of its educated workforce — has become a far more significant driver of competitive advantage than traditional physical or natural resources."
        },
        {
            id: 57,
            word: "exploitation of labour",
            definition: "The unfair treatment of workers by employers, involving excessive working hours, extremely low pay, dangerous conditions, or the denial of basic rights",
            exampleSentence: "Several major international clothing brands have faced serious public backlash following investigations that exposed the systematic exploitation of labour in their overseas manufacturing facilities.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "This phrase allows you to make powerful ethical arguments in Task 2 essays about business and human rights — combining it with formal academic language creates a genuinely compelling and sophisticated response.",
            collocations: ["prevent exploitation of labour", "widespread exploitation of labour", "exploitation of labour in developing countries", "corporate exploitation of labour"],
            writingExample: "The exploitation of labour in global supply chains — where workers in developing nations are routinely subjected to poverty wages, dangerous conditions, and systematic denial of basic rights — represents one of the most serious and morally urgent challenges facing international business regulation today."
        },
        {
            id: 58,
            word: "collective bargaining",
            definition: "The process by which trade unions negotiate with employers on behalf of workers to establish fair wages, working conditions, and employment terms",
            exampleSentence: "The decline in trade union membership across many developed economies over the past three decades has significantly weakened workers' collective bargaining power and contributed to the stagnation of real wages.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "This is a high-level academic term from the field of labour economics — using it correctly and contextually in a Task 2 essay is a very strong indicator of Band 8+ writing ability.",
            collocations: ["right to collective bargaining", "collective bargaining agreements", "undermine collective bargaining", "collective bargaining power"],
            writingExample: "The systematic erosion of collective bargaining rights — driven by deregulation, the casualisation of the workforce, and the aggressive anti-union stance of many major corporations — has fundamentally shifted the balance of power in the employer-employee relationship in ways that disproportionately disadvantage the most vulnerable workers."
        },
        {
            id: 59,
            word: "knowledge economy",
            definition: "An economic system in which growth is primarily driven by the production, distribution, and application of knowledge, information, and intellectual skills rather than physical labour or raw materials",
            exampleSentence: "Countries that have successfully transitioned to a knowledge economy — such as Singapore, South Korea, and Finland — have done so through massive and sustained investment in education, research, and digital infrastructure.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "Demonstrating awareness of macro-economic concepts like the knowledge economy shows examiners that your writing reflects genuine intellectual depth and engagement with contemporary global issues.",
            collocations: ["transition to a knowledge economy", "knowledge economy demands", "thrive in a knowledge economy", "knowledge economy skills"],
            writingExample: "In the rapidly evolving knowledge economy, the ability to think critically, collaborate effectively, and adapt continuously to new technologies and information is becoming far more economically valuable than the possession of any single fixed set of technical skills."
        },
        {
            id: 60,
            word: "structural unemployment",
            definition: "Long-term unemployment caused by fundamental changes in the economy — such as technological change or industry decline — that make certain skills permanently obsolete",
            exampleSentence: "The decline of the coal mining industry in many regions of the United Kingdom created severe and long-lasting structural unemployment that entire communities have still not fully recovered from decades later.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            context: "Distinguishing between different types of unemployment using precise academic terminology like \"structural unemployment\" versus \"cyclical unemployment\" demonstrates exceptional depth of knowledge and will strongly impress any IELTS examiner.",
            collocations: ["rise of structural unemployment", "address structural unemployment", "structural unemployment caused by automation", "structural unemployment crisis"],
            writingExample: "Structural unemployment — arising from the permanent displacement of workers by automation, artificial intelligence, and the fundamental reorganisation of entire industries — represents a categorically different and far more complex policy challenge than the cyclical unemployment that accompanies ordinary economic downturns."
        }
    ],
    exercises: {
        synonymSwap: [
            {
                id: 1,
                sentence: "My mum has worked as a nurse for over twenty years and she still has incredibly high levels of the pleasure and fulfilment she gets from her work because she genuinely loves helping people every single day.",
                targetWord: "the pleasure and fulfilment she gets from her work",
                options: [
                    { id: "A", text: "Work-life balance", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Job satisfaction", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Career prospects", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Salary package", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 2,
                sentence: "I think feeling genuinely happy and fulfilled in what you do professionally is far more important than earning a high salary because if you hate your job, no amount of money can truly compensate for that.",
                targetWord: "feeling genuinely happy and fulfilled in what you do professionally",
                options: [
                    { id: "A", text: "Work-life balance", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Career development", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Job satisfaction", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Team player mentality", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 3,
                sentence: "My friend recently quit his extremely well-paying job at a major investment bank because the ability to fairly divide his time between his job and personal life was completely non-existent — he was regularly working past midnight.",
                targetWord: "the ability to fairly divide his time between his job and personal life",
                options: [
                    { id: "A", text: "Job satisfaction", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Career prospects", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Work-life balance", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Flexible working", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 4,
                sentence: "Honestly, I think finding an equal division between professional responsibilities and personal time is one of the biggest daily challenges facing people of my generation right now.",
                targetWord: "finding an equal division between professional responsibilities and personal time",
                options: [
                    { id: "A", text: "Getting promoted", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Work-life balance", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Making a living", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Burning out", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 5,
                sentence: "My older sister worked incredibly hard for three years and was finally moved to a higher and more senior position at her company last month — the entire family is absolutely thrilled for her.",
                targetWord: "moved to a higher and more senior position at her company",
                options: [
                    { id: "A", text: "Made a living", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Burned out", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Got promoted", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Landed a job", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 6,
                sentence: "In many traditional companies in my country, people tend to advance to higher positions based on how long they have worked somewhere rather than how talented or hardworking they actually are, which I personally find quite unfair.",
                targetWord: "advance to higher positions",
                options: [
                    { id: "A", text: "Burn out", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Get promoted", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Go the extra mile", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Climb down the ladder", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 7,
                sentence: "My cousin felt completely and utterly trapped in a job with absolutely no opportunities for advancement or personal growth for several years before he finally gathered the courage to go back to university and completely retrain.",
                targetWord: "a job with absolutely no opportunities for advancement or personal growth",
                options: [
                    { id: "A", text: "A nine-to-five", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "A dead-end job", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "A team player role", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "A steep learning curve", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 8,
                sentence: "I think one of the deepest fears that young people entering the workforce today have is the prospect of ending up in a position where there is simply no path forward and no opportunity to develop professionally.",
                targetWord: "a position where there is simply no path forward and no opportunity to develop professionally",
                options: [
                    { id: "A", text: "A flexible working arrangement", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "A make or break situation", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "A dead-end job", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "A hands-on experience", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 9,
                sentence: "I had a genuinely terrible person in charge of my team at my very first part-time job who never gave any feedback or recognition, which made the entire working experience deeply demoralising.",
                targetWord: "person in charge of my team",
                options: [
                    { id: "A", text: "Colleague", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Teammate", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Boss", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Customer", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 10,
                sentence: "I genuinely think that having a supportive and encouraging manager who oversees your work makes an absolutely enormous difference to how much you enjoy coming to work every single day.",
                targetWord: "manager who oversees your work",
                options: [
                    { id: "A", text: "Client", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Boss", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Colleague", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Shareholder", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 11,
                sentence: "One of my closest university friends became completely exhausted mentally and physically from overworking during his final year because he was simultaneously studying full-time and working a part-time job to cover his rent.",
                targetWord: "became completely exhausted mentally and physically from overworking",
                options: [
                    { id: "A", text: "Climbed the ladder", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Landed a job", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Burned out", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Got promoted", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 12,
                sentence: "I think a lot of ambitious young professionals in high-pressure industries like law and medicine end up collapsing from exhaustion due to excessive work demands by their early thirties because the culture of overworking is so completely and dangerously normalised.",
                targetWord: "collapsing from exhaustion due to excessive work demands",
                options: [
                    { id: "A", text: "Going the extra mile", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Burning out", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Thinking outside the box", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Making a living", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 13,
                sentence: "My dad has worked a completely conventional standard office job with regular fixed hours from morning to late afternoon his entire professional life and he genuinely loves it because he always knows exactly when he will be home.",
                targetWord: "standard office job with regular fixed hours from morning to late afternoon",
                options: [
                    { id: "A", text: "Dead-end job", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Nine-to-five", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Hands-on experience", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Steep learning curve", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 14,
                sentence: "I personally don't think the traditional model of working fixed standard hours every weekday suits every type of personality or working style — many people are genuinely far more creative and productive working flexible hours.",
                targetWord: "the traditional model of working fixed standard hours every weekday",
                options: [
                    { id: "A", text: "The make or break approach", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "The nine-to-five", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "The corporate culture", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "The glass ceiling", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 15,
                sentence: "It is becoming increasingly difficult for young artists, musicians, and writers to earn enough money from their creative work to support themselves without relying on a second income source or significant financial support from their family.",
                targetWord: "earn enough money from their creative work to support themselves",
                options: [
                    { id: "A", text: "Climb the ladder", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Make a living", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Go the extra mile", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Get promoted", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 16,
                sentence: "I think as long as a person can generate sufficient income from something they are genuinely passionate about, that is truly the most ideal and enviable career situation anyone could possibly hope for.",
                targetWord: "generate sufficient income",
                options: [
                    { id: "A", text: "Land a job", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Burn out", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Make a living", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Give it their all", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 17,
                sentence: "During my part-time job at a busy café, I very quickly learned just how important it is to be someone who works effectively and cooperatively with others because when even one person refuses to cooperate, the entire operation suffers immediately.",
                targetWord: "someone who works effectively and cooperatively with others",
                options: [
                    { id: "A", text: "A self-employed person", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "A team player", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "A skilled worker", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "An entrepreneur", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 18,
                sentence: "I would definitely and confidently describe myself as a person who genuinely prefers collaborative working over individual effort — I find that I produce significantly better results when I can share ideas and work alongside other motivated people.",
                targetWord: "a person who genuinely prefers collaborative working over individual effort",
                options: [
                    { id: "A", text: "A nine-to-five worker", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "A glass ceiling breaker", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "A team player", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "An independent thinker", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 19,
                sentence: "My aunt started her career as a junior hotel receptionist and spent fifteen extraordinarily dedicated years steadily progressing to higher and more senior positions until she eventually became the general manager of the entire property.",
                targetWord: "progressing to higher and more senior positions",
                options: [
                    { id: "A", text: "Making a living", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Burning out", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Climbing the ladder", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Going the extra mile", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 20,
                sentence: "The intense pressure to rapidly advance through the ranks of a company in highly competitive industries like finance and management consulting can have genuinely damaging and lasting effects on young professionals' personal relationships and mental wellbeing.",
                targetWord: "rapidly advance through the ranks of a company",
                options: [
                    { id: "A", text: "Land a job quickly", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Climb the ladder", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Think outside the box", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Push the boundaries", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 21,
                sentence: "I specifically chose to study computer science as my university major because the future opportunities for advancement and success in the technology sector are genuinely outstanding and consistently growing at an impressive rate.",
                targetWord: "the future opportunities for advancement and success in the technology sector",
                options: [
                    { id: "A", text: "The job satisfaction levels", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "The career prospects", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "The work-life balance", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "The hands-on experience", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 22,
                sentence: "I strongly believe that the likelihood of future professional advancement should be one of the most carefully considered factors when young people are choosing which university degree to pursue alongside their genuine personal interests.",
                targetWord: "the likelihood of future professional advancement",
                options: [
                    { id: "A", text: "The salary package", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "The career prospects", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "The corporate culture", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "The learning curve", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 23,
                sentence: "My uncle made the life-changing decision to become someone who works for himself and runs his own business five years ago when he established his own plumbing company, and he consistently says it is the best professional decision he has ever made.",
                targetWord: "someone who works for himself and runs his own business",
                options: [
                    { id: "A", text: "Motivated", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Flexible", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Self-employed", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Promoted", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 24,
                sentence: "The idea of being working independently without an employer genuinely appeals to me enormously because I love the thought of having complete control over my own schedule and the overall direction of my professional life.",
                targetWord: "working independently without an employer",
                options: [
                    { id: "A", text: "Under pressure", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Self-employed", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "At the forefront", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "In the same boat", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 25,
                sentence: "My secondary school football coach had a truly remarkable and almost magical ability to give the team a strong reason and desire to perform at their very best even during those difficult moments when we were losing by a significant margin.",
                targetWord: "give the team a strong reason and desire to perform at their very best",
                options: [
                    { id: "A", text: "Promote", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Employ", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Motivate", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Restructure", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 26,
                sentence: "I genuinely believe the most effective and respected managers are those who truly understand how to inspire their team members to work harder and more creatively by recognising individual strengths and contributions rather than simply demanding better results.",
                targetWord: "inspire their team members to work harder and more creatively",
                options: [
                    { id: "A", text: "Employ", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Restructure", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Automate", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Motivate", isCorrect: true, feedback: "Correct!" }
                ]
            },
            {
                id: 27,
                sentence: "My mother's company introduced arrangements that allow employees to choose when and where they work following the pandemic, and she reports that her overall productivity and job satisfaction have both increased dramatically as a direct result.",
                targetWord: "arrangements that allow employees to choose when and where they work",
                options: [
                    { id: "A", text: "Dead-end jobs", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Flexible working", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Nine-to-five schedules", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Steep learning curves", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 28,
                sentence: "I honestly think the ability to choose your own working hours and location is one of the most genuinely positive and meaningful developments in modern employment culture because it allows people to manage both their professional and personal lives far more effectively.",
                targetWord: "the ability to choose your own working hours and location",
                options: [
                    { id: "A", text: "Climbing the ladder", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Burning out", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Flexible working", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Going the extra mile", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 29,
                sentence: "There is a genuinely serious and growing shortage of people with specific training and expertise needed to perform particular types of work in the construction industry in my country, which is making property development increasingly slow and prohibitively expensive.",
                targetWord: "people with specific training and expertise needed to perform particular types of work",
                options: [
                    { id: "A", text: "Team players", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Skilled workers", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Self-employed individuals", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Nine-to-five employees", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 30,
                sentence: "I genuinely believe that governments have a clear responsibility to invest heavily in both university education and vocational training to ensure there is always an adequate supply of highly trained and qualified people in specialist fields across all essential industries.",
                targetWord: "highly trained and qualified people in specialist fields",
                options: [
                    { id: "A", text: "Flexible workers", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Corporate employees", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Skilled workers", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Self-employed professionals", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 31,
                sentence: "My sister works as an emergency room doctor and is required to make incredibly critical and consequential life-or-death decisions on a daily basis while operating in a state of extreme stress and high demand.",
                targetWord: "in a state of extreme stress and high demand",
                options: [
                    { id: "A", text: "At the forefront", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "In the same boat", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Under pressure", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "On a steep learning curve", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 32,
                sentence: "Honestly, I think I actually perform quite well when I am experiencing stress because of high expectations and tight deadlines — I find that having a clear and immovable deadline actually helps me focus and consistently produce my best quality work.",
                targetWord: "experiencing stress because of high expectations and tight deadlines",
                options: [
                    { id: "A", text: "Making a living", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Under pressure", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "At the forefront", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Pushing boundaries", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 33,
                sentence: "I completed a summer internship at a digital marketing agency last year and the practical experience I gained by actually doing real work was genuinely far more valuable and educational than anything I had previously learned sitting in a university lecture theatre.",
                targetWord: "practical experience I gained by actually doing real work",
                options: [
                    { id: "A", text: "Corporate culture", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Career prospects", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Hands-on experience", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Flexible working", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 34,
                sentence: "I think one of the most significant and persistent problems with traditional university education is that it focuses overwhelmingly on abstract theory and does not provide students with nearly enough real practical experience in their chosen professional field.",
                targetWord: "real practical experience in their chosen professional field",
                options: [
                    { id: "A", text: "Job satisfaction", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Hands-on experience", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Work-life balance", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Career development", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 35,
                sentence: "My father always taught me from a very young age that no matter what job you happen to be doing in life — whether sweeping floors or running an entire company — you should always put in the maximum possible effort and dedication.",
                targetWord: "put in the maximum possible effort and dedication",
                options: [
                    { id: "A", text: "Think outside the box", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Go the extra mile", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Give it your all", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Make or break it", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 36,
                sentence: "I genuinely and wholeheartedly believe that if you are going to commit to doing something professionally, you should always work with complete and total dedication — putting in only a half-hearted effort never produces results that you can feel genuinely proud of.",
                targetWord: "work with complete and total dedication",
                options: [
                    { id: "A", text: "Climb the ladder", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Burn out", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Land the job", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Give it your all", isCorrect: true, feedback: "Correct!" }
                ]
            },
            {
                id: 37,
                sentence: "My absolute best friend spent nearly six months sending out hundreds of job applications to companies in his field before he finally successfully obtained a position at a highly prestigious engineering firm — his incredible perseverance ultimately paid off.",
                targetWord: "successfully obtained a position",
                options: [
                    { id: "A", text: "Got promoted", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Burned out", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Landed a job", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Made a living", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 38,
                sentence: "I genuinely think that having exceptionally strong communication and interpersonal skills is now absolutely essential for securing good employment in virtually any competitive industry, regardless of what specific technical qualifications you might have.",
                targetWord: "securing good employment",
                options: [
                    { id: "A", text: "Climbing the ladder", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Landing a job", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Making a living", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Going the extra mile", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 39,
                sentence: "During the severe economic recession, millions of workers across the country suddenly found themselves in the identical difficult situation — deeply worried about their job security and genuinely struggling to meet their basic financial obligations.",
                targetWord: "in the identical difficult situation",
                options: [
                    { id: "A", text: "At the forefront", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Under pressure", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "In the same boat", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "On a steep learning curve", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 40,
                sentence: "I honestly think most young graduates are completely facing the same challenge when it comes to finding their very first professional job — everyone has a degree on paper but virtually no real work experience to offer employers.",
                targetWord: "facing the same challenge",
                options: [
                    { id: "A", text: "Going the extra mile", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "In the same boat", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "At the forefront", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Pushing the boundaries", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 41,
                sentence: "One of the primary and most compelling reasons I would absolutely love to work for that particular company is that the shared values, attitudes, and practices that define how the organisation operates is completely and genuinely built around creativity, innovation, and authentic employee wellbeing.",
                targetWord: "the shared values, attitudes, and practices that define how the organisation operates",
                options: [
                    { id: "A", text: "The labour market", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "The corporate culture", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "The remuneration package", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "The glass ceiling", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 42,
                sentence: "I think the toxic environment of values and behaviours that exists in some organisations — where chronic overworking is glorified, mental health struggles are completely ignored, and results are valued above everything else — is one of the most serious and dangerously underacknowledged problems in modern business.",
                targetWord: "the toxic environment of values and behaviours that exists in some organisations",
                options: [
                    { id: "A", text: "The cutthroat competition", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "The steep learning curve", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "The corporate culture", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "The entrepreneurial spirit", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 43,
                sentence: "Despite decades of undeniable social progress and significant legislative reform, many highly qualified and deeply experienced women still consistently report hitting the invisible barrier that prevents certain groups from reaching the highest levels of an organisation when they attempt to advance to the most senior leadership positions.",
                targetWord: "the invisible barrier that prevents certain groups from reaching the highest levels of an organisation",
                options: [
                    { id: "A", text: "The steep learning curve", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "The glass ceiling", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "The corporate culture", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "The make or break moment", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 44,
                sentence: "I strongly believe that the invisible professional barrier that stops women and minorities from advancing still very much exists across many industries — the persistent underrepresentation of women in the most senior corporate leadership positions is compelling evidence of this.",
                targetWord: "the invisible professional barrier that stops women and minorities from advancing",
                options: [
                    { id: "A", text: "The cutthroat competition", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "The entrepreneurial spirit", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "The glass ceiling", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "The forefront position", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 45,
                sentence: "My grandmother possessed a truly extraordinary and inspiring mindset and drive to create and build something of her own despite the risks involved — she built an incredibly successful tailoring business entirely from nothing during a time when very few women owned their own companies.",
                targetWord: "mindset and drive to create and build something of her own despite the risks involved",
                options: [
                    { id: "A", text: "Corporate culture", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Glass ceiling mentality", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Entrepreneurial spirit", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Steep learning curve", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 46,
                sentence: "I genuinely believe that schools and universities should actively and deliberately nurture the desire and courage to start new things and take calculated risks in students from the earliest possible age rather than simply and narrowly training them to be obedient and compliant employees.",
                targetWord: "nurture the desire and courage to start new things and take calculated risks",
                options: [
                    { id: "A", text: "Promote cutthroat competition", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Nurture entrepreneurial spirit", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Break the glass ceiling", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Push the boundaries of learning", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 47,
                sentence: "The fashion industry is widely and justifiably known for its extremely fierce, aggressive, and ruthless rivalry between brands — companies are constantly and relentlessly fighting for the same pool of consumers, and any significant mistake can be absolutely and permanently fatal to a business.",
                targetWord: "extremely fierce, aggressive, and ruthless rivalry between brands",
                options: [
                    { id: "A", text: "Steep learning curve", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Cutthroat competition", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Corporate culture", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Glass ceiling", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 48,
                sentence: "I genuinely think that the ruthless and unforgiving competitive environment that characterises certain high-stakes industries like investment banking and management consulting places enormous, often unsustainable, and deeply unhealthy psychological pressure on young professionals who are just beginning their careers.",
                targetWord: "the ruthless and unforgiving competitive environment",
                options: [
                    { id: "A", text: "The entrepreneurial spirit", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "The work-life balance", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "The cutthroat competition", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "The corporate ladder", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 49,
                sentence: "My absolute favourite teacher in secondary school always passionately encouraged all of us to approach problems creatively and unconventionally rather than following standard methods instead of simply memorising textbook information, and I firmly believe that approach genuinely prepared us far better for real working life.",
                targetWord: "approach problems creatively and unconventionally rather than following standard methods",
                options: [
                    { id: "A", text: "Go the extra mile", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Climb the ladder", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Think outside the box", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Give it our all", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 50,
                sentence: "In today's extraordinarily fast-changing and unpredictable business environment, I genuinely believe the capacity to generate creative and unconventional solutions and adapt rapidly to entirely new challenges is far more commercially valuable than simply possessing an impressive list of academic qualifications.",
                targetWord: "the capacity to generate creative and unconventional solutions",
                options: [
                    { id: "A", text: "The ability to make or break decisions", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "The ability to think outside the box", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "The forefront position", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "The entrepreneurial ladder", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 51,
                sentence: "Companies like Tesla and SpaceX have become so extraordinarily influential and admired precisely because they are constantly and fearlessly going beyond existing limits of what is considered technologically possible or commercially viable.",
                targetWord: "going beyond existing limits of what is considered technologically possible or commercially viable",
                options: [
                    { id: "A", text: "Going the extra mile", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Pushing the boundaries", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Thinking outside the box", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Making or breaking the market", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 52,
                sentence: "I deeply admire professionals who are genuinely willing to keep challenging conventional limits and expectations in their field even when they face considerable scepticism, intense criticism, and strong resistance from more traditionally minded colleagues and institutions.",
                targetWord: "challenging conventional limits and expectations in their field",
                options: [
                    { id: "A", text: "Climbing the corporate ladder", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Going the extra mile", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Pushing the boundaries", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Making a living differently", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 53,
                sentence: "The critically important first three to six months of launching any new restaurant business are truly a situation that will either lead to great success or total failure with no middle ground — if you cannot build a loyal and returning customer base extremely quickly, the business will almost certainly not survive.",
                targetWord: "a situation that will either lead to great success or total failure with no middle ground",
                options: [
                    { id: "A", text: "A steep learning curve", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "A make or break moment", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "A glass ceiling situation", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "A cutthroat competition", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 54,
                sentence: "I genuinely think the very first formal job interview a young person attends after finishing university is truly a decisive moment that determines either great success or damaging failure for their long-term professional confidence — the outcome can either launch a career brilliantly or significantly undermine self-belief.",
                targetWord: "a decisive moment that determines either great success or damaging failure",
                options: [
                    { id: "A", text: "A nine-to-five situation", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "A dead-end opportunity", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "A make or break moment", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "An extra mile situation", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 55,
                sentence: "Companies like Google, Apple, and Amazon have managed to remain in the leading and most important position in their respective industries for multiple decades by continuously and fearlessly reinventing themselves and maintaining extraordinary levels of investment in research and development.",
                targetWord: "in the leading and most important position in their respective industries",
                options: [
                    { id: "A", text: "In the same boat", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Under enormous pressure", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "At the forefront", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "On a steep learning curve", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 56,
                sentence: "I would love nothing more than to work for a company that is genuinely and demonstrably leading and pioneering in its field because I truly believe that being surrounded daily by the most ambitious, creative, and innovative people in any industry pushes you to continuously grow and improve.",
                targetWord: "leading and pioneering in its field",
                options: [
                    { id: "A", text: "Making or breaking in its field", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "At the forefront of its field", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Pushing the boundaries of its field", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Thinking outside the box of its field", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 57,
                sentence: "Starting my very first proper full-time office job was a genuinely challenging period in which I had to rapidly learn an enormous amount of new and complex information and skills — there was so much to absorb simultaneously about the systems, the people, the processes, and the unspoken workplace culture.",
                targetWord: "period in which I had to rapidly learn an enormous amount of new and complex information and skills",
                options: [
                    { id: "A", text: "Glass ceiling", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Corporate culture shift", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Steep learning curve", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Make or break moment", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 58,
                sentence: "I genuinely think every significant new job inevitably involves a challenging period of rapid learning and adjustment at the beginning, but I personally find that kind of intense intellectual challenge genuinely exciting rather than intimidating because it means you are constantly and meaningfully developing as a professional.",
                targetWord: "a challenging period of rapid learning and adjustment",
                options: [
                    { id: "A", text: "A dead-end situation", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "A nine-to-five challenge", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "A steep learning curve", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "A make or break period", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 59,
                sentence: "The primary reason that particular restaurant has developed such an outstanding and well-deserved reputation is that absolutely every member of the team consistently makes more effort than is expected or required to ensure every single customer feels genuinely welcomed, valued, and well cared for.",
                targetWord: "makes more effort than is expected or required",
                options: [
                    { id: "A", text: "Thinks outside the box", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Goes the extra mile", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Pushes the boundaries", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Climbs the ladder", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 60,
                sentence: "I have the deepest and most genuine admiration for people who consistently do significantly more than the minimum that is required of them in their professional life — not because they are forced or incentivised to do so, but because they take authentic and deep personal pride in doing absolutely everything to the very highest possible standard.",
                targetWord: "do significantly more than the minimum that is required of them",
                options: [
                    { id: "A", text: "Make or break their career", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Go the extra mile", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Climb the corporate ladder", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Give their all to burning out", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            }
        ],
        writingSynonymSwap: [
            {
                id: 1,
                sentence: "Governments have a fundamental and non-negotiable responsibility to create and actively sustain stable the condition of having paid work opportunities for all citizens, particularly during periods of severe economic downturn and financial instability.",
                targetWord: "the condition of having paid work",
                options: [
                    { id: "A", text: "Productivity", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Employment", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Profession", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Wages", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 2,
                sentence: "The dramatic decline of traditional manufacturing industries across many developed economies has created significant and long-lasting the state of people having paid jobs challenges that successive governments have struggled profoundly to address.",
                targetWord: "the state of people having paid jobs",
                options: [
                    { id: "A", text: "Salary", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Workforce", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Employment", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Productivity", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 3,
                sentence: "As automation and artificial intelligence continue to advance at an unprecedented and accelerating rate, governments must take urgent and comprehensive steps to retrain and upskill all the people available and engaged in work in a country to meet the fundamentally transformed demands of the modern economy.",
                targetWord: "all the people available and engaged in work in a country",
                options: [
                    { id: "A", text: "Salary", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Profession", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Wages", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Workforce", isCorrect: true, feedback: "Correct!" }
                ]
            },
            {
                id: 4,
                sentence: "Organisations that invest meaningfully and consistently in the professional development and wellbeing of all the people they employ consistently outperform those that treat their human resources purely and cynically as a means of generating shareholder profit.",
                targetWord: "all the people they employ",
                options: [
                    { id: "A", text: "Workforce", isCorrect: true, feedback: "Correct!" },
                    { id: "B", text: "Employer", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Salary scale", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Career path", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 5,
                sentence: "While a highly competitive fixed regular payment received monthly from an employer is undoubtedly an important factor in attracting talented candidates, research consistently and convincingly demonstrates that non-financial factors such as meaningful work and genuine autonomy are equally critical in retaining them.",
                targetWord: "fixed regular payment received monthly from an employer",
                options: [
                    { id: "A", text: "Wages", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Productivity", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Salary", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Employment", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 6,
                sentence: "The persistent and deeply troubling gap between the extraordinarily generous executive compensation packages and the modest regular monthly payments received by ordinary frontline workers raises serious and entirely legitimate questions about economic fairness and fundamental social justice.",
                targetWord: "regular monthly payments",
                options: [
                    { id: "A", text: "Profession", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Salary", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Career development", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Unemployment", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 7,
                sentence: "Rising the state of people not having jobs despite wanting them rates, particularly among young people entering the job market for the first time, represent one of the most pressing and consequential social and economic challenges facing governments in the difficult post-pandemic era.",
                targetWord: "the state of people not having jobs despite wanting them",
                options: [
                    { id: "A", text: "Productivity", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Workforce", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Unemployment", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Salary", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 8,
                sentence: "The government's comprehensive economic recovery strategy specifically targeted the reduction of youth the condition of being without paid work through a combination of substantial investment in vocational training programmes and targeted financial incentives for businesses that hire young graduates.",
                targetWord: "the condition of being without paid work",
                options: [
                    { id: "A", text: "Employment", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Wages", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Profession", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Unemployment", isCorrect: true, feedback: "Correct!" }
                ]
            },
            {
                id: 9,
                sentence: "It has been widely and consistently demonstrated through multiple peer-reviewed studies that employees who maintain a genuinely healthy work-life balance show significantly higher levels of the efficiency with which tasks are completed and output is generated than those who are routinely and chronically overworked.",
                targetWord: "the efficiency with which tasks are completed and output is generated",
                options: [
                    { id: "A", text: "Employment", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Salary", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Productivity", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Profession", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 10,
                sentence: "The introduction of comprehensive flexible working arrangements across the organisation resulted in a clearly measurable and statistically significant improvement in overall the rate of work output and operational efficiency within just six months of implementation.",
                targetWord: "the rate of work output and operational efficiency",
                options: [
                    { id: "A", text: "Wages", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Productivity", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Unemployment", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Workforce", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 11,
                sentence: "Companies that invest meaningfully and generously in the the ongoing process of improving employees' professional skills and advancing their careers of their staff consistently report significantly higher retention rates, greater levels of employee loyalty, and measurably improved overall organisational performance.",
                targetWord: "the ongoing process of improving employees' professional skills and advancing their careers",
                options: [
                    { id: "A", text: "Salary negotiation", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Career development", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Workforce automation", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Employment legislation", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 12,
                sentence: "The multinational corporation demonstrated its genuine commitment to its employees by allocating a dedicated annual budget specifically for professional growth and skills enhancement activities including external courses, industry conferences, and mentorship programmes with senior leaders.",
                targetWord: "professional growth and skills enhancement activities",
                options: [
                    { id: "A", text: "Salary increases", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Unemployment benefits", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Career development", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Workforce restructuring", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 13,
                sentence: "Organisations that genuinely prioritise the wellbeing, professional growth, and psychological safety of each person hired and paid to work for them consistently outperform those that treat their human resources as nothing more than interchangeable units of productive output.",
                targetWord: "each person hired and paid to work for them",
                options: [
                    { id: "A", text: "Employer", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Shareholder", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Employee", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Contractor", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 14,
                sentence: "The survey of over five thousand workers revealed the deeply concerning finding that more than sixty percent of people working for the company felt that their contributions were not adequately or fairly recognised or rewarded by their line managers.",
                targetWord: "people working for the company",
                options: [
                    { id: "A", text: "Employers", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Employees", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Shareholders", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Contractors", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 15,
                sentence: "The company or person who hires and pays workers has a clear, non-negotiable legal and ethical responsibility to provide safe, fair, non-discriminatory, and genuinely supportive working conditions for every member of their workforce.",
                targetWord: "the company or person who hires and pays workers",
                options: [
                    { id: "A", text: "Employee", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Employer", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Shareholder", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Regulator", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 16,
                sentence: "Many companies and organisations that hire people now consider emotional intelligence, adaptability, and strong communication skills to be equally or more important than purely technical qualifications when evaluating and selecting job candidates for senior positions.",
                targetWord: "companies and organisations that hire people",
                options: [
                    { id: "A", text: "Employees", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Regulators", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Shareholders", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Employers", isCorrect: true, feedback: "Correct!" }
                ]
            },
            {
                id: 17,
                sentence: "The government announced a significant and long-overdue plan to raise the national minimum hourly or daily payment made to workers for their labour by eight percent in direct response to growing and sustained pressure from trade unions and workers' rights advocacy organisations.",
                targetWord: "hourly or daily payment made to workers for their labour",
                options: [
                    { id: "A", text: "Salary", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Wages", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Productivity", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Employment", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 18,
                sentence: "The persistent and deeply troubling gap between the extraordinarily generous compensation packages of senior corporate executives and the stagnant payments received by ordinary manual and frontline workers raises fundamental questions about economic justice and the fairness of contemporary capitalism.",
                targetWord: "payments received by ordinary manual and frontline workers",
                options: [
                    { id: "A", text: "Salaries of executives", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Career development funds", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Wages", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Employment benefits", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 19,
                sentence: "Medicine is universally and justifiably regarded as one of the most intellectually rewarding yet simultaneously most emotionally demanding and personally taxing paid occupations requiring prolonged formal training and qualifications that any individual can choose to enter.",
                targetWord: "paid occupations requiring prolonged formal training and qualifications",
                options: [
                    { id: "A", text: "Salary", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Workforce", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Profession", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Employment", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 20,
                sentence: "The teaching occupation requiring specialised knowledge and formal qualifications is chronically and scandalously undervalued and chronically underfunded in many countries, despite the indisputable fact that teachers play an absolutely fundamental and irreplaceable role in shaping the intellectual, moral, and social development of entire generations.",
                targetWord: "occupation requiring specialised knowledge and formal qualifications",
                options: [
                    { id: "A", text: "Wages", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Profession", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Productivity", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Employment", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 21,
                sentence: "While rapid the increase in a country's total production of goods and services undeniably creates new employment opportunities and raises living standards for many, it frequently and inevitably comes at a significant and often irreversible environmental cost that future generations will be forced to bear.",
                targetWord: "the increase in a country's total production of goods and services",
                options: [
                    { id: "A", text: "Labour market expansion", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Economic growth", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Workforce development", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Income inequality", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 22,
                sentence: "The government's ambitious decision to invest heavily in large-scale infrastructure projects was specifically and strategically designed to stimulate the country's increase in production and wealth and simultaneously create thousands of new skilled employment opportunities across multiple sectors.",
                targetWord: "stimulate the country's increase in production and wealth",
                options: [
                    { id: "A", text: "Reduce income inequality", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Stimulate economic growth", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Address the gender pay gap", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Develop the labour market", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 23,
                sentence: "The accelerating rise of the use of technology and machines to perform tasks previously done by humans and artificial intelligence poses a profound, urgent, and deeply complex challenge to governments worldwide, as entire established categories of employment now face the very real threat of becoming permanently obsolete within a single generation.",
                targetWord: "the use of technology and machines to perform tasks previously done by humans",
                options: [
                    { id: "A", text: "Globalisation", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Entrepreneurship", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Automation", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Restructuring", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 24,
                sentence: "The widespread replacement of human workers by machines and computer systems of assembly line processes across the global automotive industry has dramatically and permanently reduced production costs while simultaneously eliminating hundreds of thousands of manufacturing jobs that communities had depended upon for generations.",
                targetWord: "replacement of human workers by machines and computer systems",
                options: [
                    { id: "A", text: "Globalisation", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Automation", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Entrepreneurship", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Restructuring", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 25,
                sentence: "The process by which economies and businesses become increasingly interconnected across international borders has fundamentally and irreversibly transformed the fashion industry, enabling companies to source materials from dozens of different countries and sell their products in markets they could never previously have reached.",
                targetWord: "the process by which economies and businesses become increasingly interconnected across international borders",
                options: [
                    { id: "A", text: "Automation", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Entrepreneurship", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Globalisation", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Restructuring", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 26,
                sentence: "While the increasing international integration of economies, cultures, and markets has undeniably created enormous and unprecedented economic opportunities, it has simultaneously contributed to the deindustrialisation of many developed economies and the painful displacement of large sections of the traditional working class.",
                targetWord: "the increasing international integration of economies, cultures, and markets",
                options: [
                    { id: "A", text: "Automation", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Labour market reform", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Globalisation", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Corporate restructuring", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 27,
                sentence: "Fostering a genuine and widespread culture of the activity of starting and running new businesses despite financial risks through carefully targeted education programmes and accessible startup funding mechanisms is absolutely essential for driving innovation and sustaining long-term national economic competitiveness.",
                targetWord: "the activity of starting and running new businesses despite financial risks",
                options: [
                    { id: "A", text: "Globalisation", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Automation", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Restructuring", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Entrepreneurship", isCorrect: true, feedback: "Correct!" }
                ]
            },
            {
                id: 28,
                sentence: "The government introduced a comprehensive range of financial incentives and expert mentorship programmes specifically and deliberately designed to promote the creation and running of new business ventures among young people from socioeconomically disadvantaged backgrounds who would otherwise lack the resources and networks to pursue such opportunities.",
                targetWord: "the creation and running of new business ventures",
                options: [
                    { id: "A", text: "Automation", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Entrepreneurship", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Globalisation", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Collective bargaining", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 29,
                sentence: "Governments must continuously, carefully, and responsively monitor shifting the system of supply and demand for workers in an economy trends to ensure that their national education and vocational training systems are adequately and relevantly preparing citizens for the rapidly evolving demands of the modern working world.",
                targetWord: "the system of supply and demand for workers in an economy",
                options: [
                    { id: "A", text: "Income inequality", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Labour market", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Gender pay gap", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Occupational hazard", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 30,
                sentence: "The rapid and transformative growth of the technology sector has significantly reshaped the the overall system matching workers to jobs by creating intense demand for digital and analytical skills while simultaneously and dramatically reducing the need for many traditional clerical and administrative roles.",
                targetWord: "the overall system matching workers to jobs",
                options: [
                    { id: "A", text: "Gender pay gap", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Corporate social responsibility", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Labour market", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Occupational hazard", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 31,
                sentence: "A landmark international report published by the World Economic Forum revealed the deeply troubling finding that at the current painfully slow rate of progress, it will take well over one hundred years to fully and meaningfully close the global the difference in average earnings between men and women.",
                targetWord: "the difference in average earnings between men and women",
                options: [
                    { id: "A", text: "Income inequality", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Gender pay gap", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Labour market disparity", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Occupational hazard", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 32,
                sentence: "The persistent the earnings difference between male and female workers in many developed economies reflects deeply embedded structural inequalities in the workplace that cannot be adequately or lastingly resolved through legislation alone but require fundamental, long-term cultural and organisational transformation.",
                targetWord: "the earnings difference between male and female workers",
                options: [
                    { id: "A", text: "Occupational hazard", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Corporate social responsibility", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Gender pay gap", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Income inequality", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 33,
                sentence: "While large companies that operate simultaneously across multiple countries undeniably generate significant employment opportunities and stimulate economic activity in the nations where they operate, they have also been widely, consistently, and justifiably criticised for exploiting cheaper labour markets and systematically avoiding their full tax obligations.",
                targetWord: "large companies that operate simultaneously across multiple countries",
                options: [
                    { id: "A", text: "Small and medium enterprises", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Local businesses", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Multinational corporations", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Government agencies", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 34,
                sentence: "Several highly prominent businesses with operations spread across many different nations have controversially relocated their regional headquarters to countries with significantly and artificially lower corporate tax rates, creating considerable anger and controversy among governments, tax authorities, and the general public.",
                targetWord: "businesses with operations spread across many different nations",
                options: [
                    { id: "A", text: "Local enterprises", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Multinational corporations", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Small businesses", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Government contractors", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 35,
                sentence: "There is a growing, compelling, and increasingly mainstream argument that the commitment of businesses to contribute positively to society and the environment beyond their profit-making activities should be legally mandated rather than left entirely to the voluntary discretion of individual companies.",
                targetWord: "the commitment of businesses to contribute positively to society and the environment beyond their profit-making activities",
                options: [
                    { id: "A", text: "Income inequality reduction", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Corporate social responsibility", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Collective bargaining rights", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Labour market regulation", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 36,
                sentence: "As part of their publicly announced the ethical obligations companies voluntarily take on toward society and the environment programme, the company formally committed to achieving full carbon neutrality by 2030 and planting one million trees across three continents.",
                targetWord: "the ethical obligations companies voluntarily take on toward society and the environment",
                options: [
                    { id: "A", text: "Occupational hazard management", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Gender pay gap reduction", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Corporate social responsibility", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Structural unemployment policy", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 37,
                sentence: "Rising the unequal distribution of earnings and wealth across society — in which an increasingly small and privileged proportion of the population controls an ever-larger share of total national wealth — poses a fundamental and potentially destabilising threat to long-term social cohesion, democratic stability, and sustainable economic health.",
                targetWord: "the unequal distribution of earnings and wealth across society",
                options: [
                    { id: "A", text: "Labour market imbalance", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Income inequality", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Gender pay disparity", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Occupational hazard levels", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 38,
                sentence: "Several of the world's most prominent and influential economists have compellingly argued that the dramatic and accelerating rise in the gap between the richest and poorest members of society over the past four decades is directly and causally linked to the systematic decline of trade unions and the progressive erosion of workers' collective bargaining power.",
                targetWord: "the gap between the richest and poorest members of society",
                options: [
                    { id: "A", text: "Corporate tax avoidance", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Income inequality", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Structural unemployment", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Precarious employment rates", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 39,
                sentence: "Chronic and debilitating back pain is an extensively documented and widely recognised a risk inherent in a particular type of work for nurses, warehouse operatives, construction workers, and others whose jobs routinely require prolonged physical exertion, awkward postures, or the repeated lifting of heavy loads.",
                targetWord: "a risk inherent in a particular type of work",
                options: [
                    { id: "A", text: "Corporate social responsibility", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Labour market challenge", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Occupational hazard", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Income inequality factor", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 40,
                sentence: "Governments and employers share a joint, non-negotiable legal and profound moral responsibility to systematically identify, effectively minimise, and wherever humanly possible entirely eliminate the dangers and risks associated with specific types of work faced by workers across all industries, particularly those employed in physically demanding or inherently high-risk working environments.",
                targetWord: "dangers and risks associated with specific types of work",
                options: [
                    { id: "A", text: "Income inequality effects", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Collective bargaining issues", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Occupational hazards", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Corporate social obligations", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 41,
                sentence: "When corporate recruitment processes systematically and consistently favour candidates from privileged educational and social backgrounds, they actively and powerfully undermine the ability of individuals to move between different levels of the economic and social hierarchy through their own efforts and perpetuate a deeply entrenched and self-reinforcing cycle of inequality.",
                targetWord: "the ability of individuals to move between different levels of the economic and social hierarchy through their own efforts",
                options: [
                    { id: "A", text: "Corporate social responsibility", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Collective bargaining power", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Socioeconomic mobility", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Structural unemployment", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 42,
                sentence: "Access to genuinely high-quality education at every level and consistently fair employment practices are widely and compellingly regarded by economists and social scientists as the two most powerful and reliable drivers of upward movement between social and economic classes based on individual merit and effort in any society that aspires to be truly just and equitable.",
                targetWord: "movement between social and economic classes based on individual merit and effort",
                options: [
                    { id: "A", text: "Precarious employment", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Socioeconomic mobility", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Intellectual capital", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Meritocracy", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 43,
                sentence: "While a genuinely attractive and comprehensive the complete set of financial and non-financial benefits an employee receives for their work undoubtedly plays a significant and important role in attracting top-tier talent to an organisation, research consistently demonstrates that non-financial factors such as meaningful and purposeful work are equally critical in retaining high performers over the long term.",
                targetWord: "the complete set of financial and non-financial benefits an employee receives for their work",
                options: [
                    { id: "A", text: "Labour market position", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Remuneration package", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Collective bargaining agreement", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Structural employment contract", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 44,
                sentence: "The senior executive's extraordinarily generous total compensation including salary, bonuses, and additional benefits — which included a substantial base salary, substantial performance bonuses, significant share options, and a premium pension arrangement — was valued by financial analysts at well over five million dollars annually.",
                targetWord: "total compensation including salary, bonuses, and additional benefits",
                options: [
                    { id: "A", text: "Collective bargaining settlement", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Meritocratic reward system", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Remuneration package", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Labour market agreement", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 45,
                sentence: "While large-scale the significant reorganisation of a company's structure, workforce, and operations may sometimes be a commercially necessary and strategically rational response to rapidly changing market conditions or disruptive technological change, it frequently results in significant and lasting human costs that governments and social support systems are woefully underprepared to absorb.",
                targetWord: "the significant reorganisation of a company's structure, workforce, and operations",
                options: [
                    { id: "A", text: "Collective bargaining", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Organisational restructuring", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Knowledge economy transition", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Precarious employment", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 46,
                sentence: "The multinational corporation announced a sweeping and large-scale programme of fundamental internal reorganisation that would result in the elimination of approximately three thousand positions across its global operations over an eighteen-month period, triggering significant and understandable concern among employees and trade unions worldwide.",
                targetWord: "programme of fundamental internal reorganisation",
                options: [
                    { id: "A", text: "Collective bargaining initiative", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Precarious employment drive", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Intellectual capital review", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Organisational restructuring", isCorrect: true, feedback: "Correct!" }
                ]
            },
            {
                id: 47,
                sentence: "Despite the widespread and appealing corporate rhetoric about a system where advancement is based purely on talent and effort rather than privilege in modern business culture, the persistent and statistically significant advantages consistently enjoyed by candidates from elite educational institutions suggest that many workplaces remain far from genuinely merit-based in their actual recruitment and promotion practices.",
                targetWord: "a system where advancement is based purely on talent and effort rather than privilege",
                options: [
                    { id: "A", text: "Collective bargaining", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Meritocracy", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Socioeconomic mobility", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Precarious employment", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 48,
                sentence: "Many Silicon Valley technology companies have deliberately and publicly built their entire brand identity and corporate culture around the deeply appealing concept of the principle that hard work and ability alone determine success — the belief that the most innovative ideas and the most determined workers will always rise to the top regardless of their social or economic background.",
                targetWord: "the principle that hard work and ability alone determine success",
                options: [
                    { id: "A", text: "Structural unemployment", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Precarious employment", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Meritocracy", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Collective bargaining", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 49,
                sentence: "The alarming and rapidly accelerating proliferation of insecure, unstable, and poorly protected work arrangements — including zero-hours contracts, temporary agency work, and gig economy platform labour — is systematically eroding the financial security and hard-won social protections that previous generations of workers fought long and hard to establish.",
                targetWord: "insecure, unstable, and poorly protected work arrangements",
                options: [
                    { id: "A", text: "Collective bargaining agreements", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Precarious employment", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Knowledge economy positions", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Organisational restructuring", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 50,
                sentence: "The rapid expansion of the gig economy has unquestionably created millions of new working opportunities, but leading critics and labour economists argue persuasively that the vast majority of these represent unstable work without adequate legal protections or benefits with no sick pay, no pension provision, and no meaningful or enforceable job security.",
                targetWord: "unstable work without adequate legal protections or benefits",
                options: [
                    { id: "A", text: "Structural unemployment", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Intellectual capital positions", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Precarious employment", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Meritocratic work arrangements", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 51,
                sentence: "In the rapidly evolving and increasingly competitive knowledge-based economy of the twenty-first century, a nation's the collective knowledge, expertise, and innovative capacity of its educated workforce has become a far more decisive and significant driver of international competitive advantage than traditional physical infrastructure or finite natural resource endowments.",
                targetWord: "the collective knowledge, expertise, and innovative capacity of its educated workforce",
                options: [
                    { id: "A", text: "Structural unemployment reserve", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Collective bargaining power", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Intellectual capital", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Precarious employment base", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 52,
                sentence: "The world-leading technology company's most commercially valuable and strategically irreplaceable asset is not its vast physical infrastructure, its impressive financial reserves, or its global brand recognition, but rather the extraordinary the combined skills, knowledge, and creative capacity of its employees represented by its exceptional team of world-class engineers, designers, and researchers.",
                targetWord: "the combined skills, knowledge, and creative capacity of its employees",
                options: [
                    { id: "A", text: "Remuneration package value", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Intellectual capital", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Organisational restructuring outcome", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Meritocratic reward system", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 53,
                sentence: "Several of the world's most prominent and commercially successful international clothing brands have faced serious, sustained, and highly damaging public backlash following investigative journalism that exposed the systematic the unfair treatment of workers through extremely low pay, dangerous conditions, and denial of basic rights occurring throughout their overseas manufacturing supply chains.",
                targetWord: "the unfair treatment of workers through extremely low pay, dangerous conditions, and denial of basic rights",
                options: [
                    { id: "A", text: "Collective bargaining failure", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Exploitation of labour", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Structural unemployment crisis", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Precarious employment model", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 54,
                sentence: "The systematic mistreatment and underpayment of workers in global supply chains — where employees in developing nations are routinely subjected to poverty-level wages, genuinely hazardous working conditions, and the systematic denial of internationally recognised basic rights — represents one of the most serious, urgent, and morally indefensible challenges facing international business regulation today.",
                targetWord: "the systematic mistreatment and underpayment of workers",
                options: [
                    { id: "A", text: "The meritocracy failure", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "The knowledge economy gap", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "The exploitation of labour", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "The collective bargaining crisis", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 55,
                sentence: "The dramatic and sustained decline in trade union membership and influence across many developed economies over the past three decades has significantly and measurably weakened workers' the process by which unions negotiate with employers on behalf of workers power and contributed directly to the long-term stagnation of real wages for the majority of the working population.",
                targetWord: "the process by which unions negotiate with employers on behalf of workers",
                options: [
                    { id: "A", text: "Precarious employment", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Collective bargaining", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Meritocratic advancement", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Organisational restructuring", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 56,
                sentence: "The systematic and deliberate erosion of workers' rights to negotiate collectively with employers through trade unions — driven by decades of aggressive deregulation, the rapid casualisation of the workforce, and the openly anti-union stance of many major corporations — has fundamentally and perhaps irreversibly shifted the balance of power in the employer-employee relationship.",
                targetWord: "workers' rights to negotiate collectively with employers through trade unions",
                options: [
                    { id: "A", text: "Intellectual capital rights", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Collective bargaining rights", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Meritocratic advancement rights", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Socioeconomic mobility rights", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 57,
                sentence: "Nations that have most successfully and sustainably transitioned to an economic system driven by information, expertise, and intellectual skills rather than physical labour — including Singapore, South Korea, and Finland — have done so through extraordinarily sustained and strategic investment in education, technological research, and comprehensive digital infrastructure.",
                targetWord: "an economic system driven by information, expertise, and intellectual skills rather than physical labour",
                options: [
                    { id: "A", text: "Structural unemployment system", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Collective bargaining economy", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Knowledge economy", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Precarious employment market", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 58,
                sentence: "In the rapidly and continuously evolving the modern economic system where intellectual skills and information drive growth, the demonstrated ability to think critically, collaborate effectively across diverse teams, and adapt continuously and confidently to new technologies and evolving information is becoming far more economically valuable than the possession of any single fixed or static set of technical skills.",
                targetWord: "the modern economic system where intellectual skills and information drive growth",
                options: [
                    { id: "A", text: "Labour exploitation market", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Knowledge economy", isCorrect: true, feedback: "Correct!" },
                    { id: "C", text: "Precarious employment sector", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Collective bargaining system", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 59,
                sentence: "Long-term unemployment caused by fundamental and permanent changes in the economy that make certain skills obsolete — arising directly from the permanent and large-scale displacement of workers by advancing automation, artificial intelligence systems, and the fundamental reorganisation of entire industries — represents a categorically different and far more complex and intractable policy challenge than the cyclical unemployment that merely accompanies ordinary economic downturns.",
                targetWord: "long-term unemployment caused by fundamental and permanent changes in the economy that make certain skills obsolete",
                options: [
                    { id: "A", text: "Precarious employment crisis", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Collective bargaining breakdown", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Structural unemployment", isCorrect: true, feedback: "Correct!" },
                    { id: "D", text: "Knowledge economy disruption", isCorrect: false, feedback: "Incorrect. Try again." }
                ]
            },
            {
                id: 60,
                sentence: "The devastating and generationally scarring decline of the coal mining and heavy manufacturing industries in many regions of the United Kingdom and the American Rust Belt created severe, deeply entrenched, and heartbreakingly persistent unemployment resulting from permanent economic and industrial transformation that entire communities and local economies have still not fully or meaningfully recovered from, even decades after the initial industrial collapse.",
                targetWord: "unemployment resulting from permanent economic and industrial transformation",
                options: [
                    { id: "A", text: "Precarious employment consequences", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "B", text: "Meritocratic system failures", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "C", text: "Collective bargaining outcomes", isCorrect: false, feedback: "Incorrect. Try again." },
                    { id: "D", text: "Structural unemployment", isCorrect: true, feedback: "Correct!" }
                ]
            }
        ],
        contextTetris: [
            {
                id: 1,
                set_name: "Speaking Context Tetris (Band 6)",
                instruction: "Drag the correct term to complete each sentence.",
                word_bank: [
                    "job satisfaction",
                    "work-life balance",
                    "got promoted",
                    "dead-end job",
                    "boss",
                    "burning out",
                    "nine-to-five",
                    "make a living",
                    "team player",
                    "climb the ladder"
                ],
                items: [
                    {
                        item_id: 1,
                        gap_sentence: "I think having a truly supportive and genuinely encouraging ___ makes an absolutely enormous difference to how much you enjoy and look forward to going to work every single day — a great manager can completely transform your entire professional experience.",
                        answer: "boss"
                    },
                    {
                        item_id: 2,
                        gap_sentence: "My cousin spent several deeply frustrating years feeling completely trapped in a ___ at a local supermarket before she finally gathered enough courage and determination to go back to college and completely retrain in a new field.",
                        answer: "dead-end job"
                    },
                    {
                        item_id: 3,
                        gap_sentence: "I try my absolute best to maintain a healthy ___ by strictly switching off all work emails after seven in the evening and making sure I dedicate proper quality time to my family and personal hobbies at the weekend.",
                        answer: "work-life balance"
                    },
                    {
                        item_id: 4,
                        gap_sentence: "In highly competitive and fast-moving industries like finance and technology, the immense pressure young professionals feel to ___ as quickly as possible can have genuinely serious and lasting negative consequences for their personal relationships and long-term mental health.",
                        answer: "climb the ladder"
                    },
                    {
                        item_id: 5,
                        gap_sentence: "It is becoming increasingly and worryingly difficult for talented young artists, musicians, and independent writers to ___ from their creative work alone without also relying on a second source of income or significant family financial support.",
                        answer: "make a living"
                    },
                    {
                        item_id: 6,
                        gap_sentence: "I would definitely and confidently describe myself as a ___ — I genuinely prefer working collaboratively alongside other motivated and talented people rather than tackling every challenge entirely on my own.",
                        answer: "team player"
                    },
                    {
                        item_id: 7,
                        gap_sentence: "My older brother worked with extraordinary dedication and commitment for four years at his company and was finally rewarded when he ___ to senior project manager last spring — the entire family was absolutely thrilled and incredibly proud of him.",
                        answer: "got promoted"
                    },
                    {
                        item_id: 8,
                        gap_sentence: "I think a lot of ambitious and talented young professionals in extremely high-pressure fields like emergency medicine and corporate law end up completely ___ by their early thirties because the culture of chronic overworking is so deeply and dangerously embedded in those industries.",
                        answer: "burning out"
                    },
                    {
                        item_id: 9,
                        gap_sentence: "I personally don't think the traditional ___ model suits every type of worker — many highly creative and independent people are genuinely far more productive and motivated when they have the freedom to choose their own working hours.",
                        answer: "nine-to-five"
                    },
                    {
                        item_id: 10,
                        gap_sentence: "I genuinely believe that ___ is ultimately more important than a high salary because if you dread going to work every single morning, no amount of financial compensation can truly make your working life feel worthwhile or meaningful.",
                        answer: "job satisfaction"
                    }
                ]
            },
            {
                id: 2,
                set_name: "Speaking Context Tetris (Band 7)",
                instruction: "Drag the correct term to complete each sentence.",
                word_bank: [
                    "career prospects",
                    "self-employed",
                    "motivate",
                    "flexible working",
                    "skilled workers",
                    "under pressure",
                    "hands-on experience",
                    "give it your all",
                    "land a job",
                    "in the same boat"
                ],
                items: [
                    {
                        item_id: 11,
                        gap_sentence: "I think strong and effective communication skills combined with genuine emotional intelligence are now absolutely essential qualities for anyone hoping to ___ in virtually any competitive modern industry, regardless of their specific technical qualifications or academic background.",
                        answer: "land a job"
                    },
                    {
                        item_id: 12,
                        gap_sentence: "I specifically and deliberately chose to study data science at university because the ___ in the technology and artificial intelligence sector are genuinely exceptional and continue to grow at a remarkable and consistent rate.",
                        answer: "career prospects"
                    },
                    {
                        item_id: 13,
                        gap_sentence: "The summer internship I completed at a law firm last year was genuinely invaluable because the ___ I gained by working on real client cases was worth so much more than anything I had previously learned from reading textbooks in a lecture hall.",
                        answer: "hands-on experience"
                    },
                    {
                        item_id: 14,
                        gap_sentence: "My uncle made the bold and life-changing decision to become ___ five years ago when he launched his own independent electrical contracting business, and he has never once looked back or regretted that decision.",
                        answer: "self-employed"
                    },
                    {
                        item_id: 15,
                        gap_sentence: "I honestly think most recent graduates are completely ___ when it comes to the incredibly frustrating challenge of securing their very first professional position — everyone has a university degree but almost no one has meaningful real-world work experience.",
                        answer: "in the same boat"
                    },
                    {
                        item_id: 16,
                        gap_sentence: "The most effective and truly inspiring managers I have encountered are those who genuinely understand how to ___ their team not through fear or financial incentives alone, but by recognising individual strengths, fostering genuine purpose, and creating an environment where people feel truly valued.",
                        answer: "motivate"
                    },
                    {
                        item_id: 17,
                        gap_sentence: "I personally perform considerably better when I am working ___ — I find that having a demanding deadline and high expectations actually sharpens my focus and consistently brings out the very best in my work.",
                        answer: "under pressure"
                    },
                    {
                        item_id: 18,
                        gap_sentence: "My mother's company introduced comprehensive ___ arrangements after the pandemic ended, and she reports that both her productivity levels and her overall sense of job satisfaction have increased significantly and measurably as a direct result.",
                        answer: "flexible working"
                    },
                    {
                        item_id: 19,
                        gap_sentence: "There is a genuinely serious and growing shortage of ___ in the healthcare and construction sectors in my country, which is creating significant operational challenges and pushing up costs across both industries.",
                        answer: "skilled workers"
                    },
                    {
                        item_id: 20,
                        gap_sentence: "I genuinely and wholeheartedly believe that if you are truly committed to doing something professionally and building a meaningful career, you absolutely must ___ every single day — working half-heartedly or with minimal effort never produces results that you can look back on with genuine pride.",
                        answer: "give it your all"
                    }
                ]
            },
            {
                id: 3,
                set_name: "Speaking Context Tetris (Band 8+)",
                instruction: "Drag the correct term to complete each sentence.",
                word_bank: [
                    "corporate culture",
                    "glass ceiling",
                    "entrepreneurial spirit",
                    "cutthroat competition",
                    "think outside the box",
                    "pushing the boundaries",
                    "make or break",
                    "at the forefront",
                    "steep learning curve",
                    "go the extra mile"
                ],
                items: [
                    {
                        item_id: 21,
                        gap_sentence: "I think the first six months of any completely new professional role inevitably presents a genuine ___ — there is simply so much to learn simultaneously about the technical aspects of the work, the internal processes, and the often complex social dynamics of the team.",
                        answer: "steep learning curve"
                    },
                    {
                        item_id: 22,
                        gap_sentence: "Companies that are genuinely ___ of their industries — constantly innovating, questioning assumptions, and setting new standards — are the ones that consistently attract the most talented and ambitious professionals who want to be part of something truly significant.",
                        answer: "at the forefront"
                    },
                    {
                        item_id: 23,
                        gap_sentence: "I strongly believe that schools and universities have a fundamental responsibility to actively nurture the ___ in young people from the earliest possible age — teaching them not just to seek employment but to create it, innovate, and build something meaningful of their own.",
                        answer: "entrepreneurial spirit"
                    },
                    {
                        item_id: 24,
                        gap_sentence: "I think one of the primary reasons that particular company has such a phenomenal reputation as an employer is that their ___ is genuinely and authentically built around employee wellbeing, creative freedom, and a deep and sincere commitment to continuous learning.",
                        answer: "corporate culture"
                    },
                    {
                        item_id: 25,
                        gap_sentence: "The ___ that characterises the technology startup world means that companies which fail to innovate rapidly, adapt continuously, and differentiate themselves meaningfully from competitors will simply not survive beyond their first few critical years of operation.",
                        answer: "cutthroat competition"
                    },
                    {
                        item_id: 26,
                        gap_sentence: "I have the deepest admiration for the professionals and pioneers in any field who are consistently willing to keep ___ of what is conventionally considered possible — it is precisely that kind of courageous and restless ambition that drives all meaningful human progress.",
                        answer: "pushing the boundaries"
                    },
                    {
                        item_id: 27,
                        gap_sentence: "Despite decades of social progress, legislative reform, and increased public awareness, I genuinely believe the ___ still exists in a very real and measurable way across many industries — the persistent and striking underrepresentation of women in the most senior executive positions is impossible to explain any other way.",
                        answer: "glass ceiling"
                    },
                    {
                        item_id: 28,
                        gap_sentence: "The truly outstanding customer service representatives I have encountered in my life are always the ones who are genuinely and consistently willing to ___ — not because they are required to by company policy, but because they take authentic personal pride in delivering an exceptional experience every time.",
                        answer: "go the extra mile"
                    },
                    {
                        item_id: 29,
                        gap_sentence: "The first major product launch of a new technology startup is truly a ___ moment — if it resonates with consumers and generates genuine excitement, the company has a future; if it fails to connect, the business may never fully recover its momentum or investor confidence.",
                        answer: "make or break"
                    },
                    {
                        item_id: 30,
                        gap_sentence: "In today's extraordinarily complex and rapidly evolving business environment, the professionals who consistently add the most value are those with the rare and precious ability to ___ — to approach familiar problems from completely unexpected angles and generate solutions that nobody else had previously considered.",
                        answer: "think outside the box"
                    }
                ]
            },
            {
                id: 4,
                set_name: "Writing Context Tetris (Band 6)",
                word_bank: [
                    "employment",
                    "workforce",
                    "salary",
                    "unemployment",
                    "productivity",
                    "career development",
                    "employees",
                    "employers",
                    "wages",
                    "profession"
                ],
                items: [
                    {
                        item_id: 31,
                        gap_sentence: "The teaching ___ is chronically and scandalously undervalued in many countries, despite the indisputable fact that teachers play an absolutely fundamental and irreplaceable role in shaping the intellectual and social development of entire generations of citizens.",
                        answer: "profession"
                    },
                    {
                        item_id: 32,
                        gap_sentence: "Research consistently and convincingly demonstrates that ___ who feel genuinely valued, professionally supported, and meaningfully recognised consistently demonstrate significantly higher levels of commitment, creativity, and overall job performance than those who feel overlooked and underappreciated.",
                        answer: "employees"
                    },
                    {
                        item_id: 33,
                        gap_sentence: "Rising youth ___ rates represent one of the most pressing, urgent, and consequential social and economic challenges currently facing governments across the developed world in the difficult aftermath of the global pandemic.",
                        answer: "unemployment"
                    },
                    {
                        item_id: 34,
                        gap_sentence: "As automation continues to advance at an unprecedented and accelerating rate, governments have an urgent responsibility to retrain and comprehensively upskill their ___ to meet the fundamentally transformed demands of the modern economy.",
                        answer: "workforce"
                    },
                    {
                        item_id: 35,
                        gap_sentence: "The persistent and deeply troubling gap between the extraordinarily generous compensation of senior executives and the stagnant ___ of ordinary frontline workers raises profoundly serious questions about economic fairness and social justice in contemporary capitalism.",
                        answer: "wages"
                    },
                    {
                        item_id: 36,
                        gap_sentence: "It has been conclusively and repeatedly demonstrated through peer-reviewed research that ___ who maintain a genuinely healthy and sustainable work-life balance consistently show significantly higher levels of productivity and creative output than those who are routinely and chronically overworked.",
                        answer: "employees"
                    },
                    {
                        item_id: 37,
                        gap_sentence: "It has been conclusively and repeatedly demonstrated through peer-reviewed research that employees who maintain a genuinely healthy and sustainable work-life balance consistently show significantly higher levels of ___ and creative output than those who are routinely and chronically overworked.",
                        answer: "productivity"
                    },
                    {
                        item_id: 38,
                        gap_sentence: "Companies that invest meaningfully, generously, and consistently in the ___ of their staff — through targeted training programmes, mentorship opportunities, and clear advancement pathways — consistently report higher retention rates, greater employee loyalty, and measurably improved overall performance.",
                        answer: "career development"
                    },
                    {
                        item_id: 39,
                        gap_sentence: "Governments have a fundamental and non-negotiable responsibility to create and actively sustain stable ___ opportunities for all citizens, particularly during periods of severe economic downturn and widespread financial instability.",
                        answer: "employment"
                    },
                    {
                        item_id: 40,
                        gap_sentence: "Many ___ now consider emotional intelligence, adaptability, and strong interpersonal communication skills to be equally or more important than purely technical qualifications when evaluating and selecting candidates for senior professional positions.",
                        answer: "employers"
                    },
                    {
                        item_id: 41,
                        gap_sentence: "While a highly competitive ___ is undoubtedly an important factor in attracting talented candidates to an organisation, research consistently demonstrates that non-financial factors such as meaningful work and genuine professional autonomy are equally critical in retaining them over the long term.",
                        answer: "salary"
                    }
                ]
            },
            {
                id: 5,
                set_name: "Writing Context Tetris (Band 7)",
                instruction: "Drag the correct term to complete each sentence.",
                word_bank: [
                    "economic growth",
                    "automation",
                    "globalisation",
                    "entrepreneurship",
                    "labour market",
                    "gender pay gap",
                    "multinational corporations",
                    "corporate social responsibility",
                    "income inequality",
                    "occupational hazard"
                ],
                items: [
                    {
                        item_id: 42,
                        gap_sentence: "While rapid ___ undeniably creates new employment opportunities and raises general living standards, it frequently and inevitably comes at a significant and often irreversible environmental cost that future generations will ultimately be forced to bear.",
                        answer: "economic growth"
                    },
                    {
                        item_id: 43,
                        gap_sentence: "The accelerating rise of ___ and artificial intelligence poses a profound, urgent, and deeply complex challenge to governments worldwide, as entire established categories of employment face the very real and imminent threat of becoming permanently obsolete within a single generation.",
                        answer: "automation"
                    },
                    {
                        item_id: 44,
                        gap_sentence: "While ___ have undeniably generated significant employment and stimulated considerable economic activity in many countries where they operate, they have also been widely and justifiably criticised for exploiting cheaper labour markets, systematically avoiding their full tax obligations, and undermining local businesses.",
                        answer: "multinational corporations"
                    },
                    {
                        item_id: 45,
                        gap_sentence: "The persistent ___ in many developed economies reflects deeply embedded structural inequalities in the workplace that cannot be adequately or lastingly resolved through legislation alone but require fundamental, sustained, and long-term cultural and organisational transformation.",
                        answer: "gender pay gap"
                    },
                    {
                        item_id: 46,
                        gap_sentence: "Fostering a genuine and widespread culture of ___ through carefully targeted education programmes, accessible startup funding mechanisms, and supportive regulatory environments is essential for driving meaningful innovation and sustaining long-term national economic competitiveness.",
                        answer: "entrepreneurship"
                    },
                    {
                        item_id: 47,
                        gap_sentence: "Governments must continuously, carefully, and responsively monitor shifting ___ trends to ensure that their national education and vocational training systems are adequately and relevantly preparing citizens for the rapidly evolving demands of the modern working world.",
                        answer: "labour market"
                    },
                    {
                        item_id: 48,
                        gap_sentence: "There is a growing, compelling, and increasingly mainstream argument that ___ should be legally mandated and independently verified rather than left entirely to the voluntary discretion of individual companies, many of which prioritise short-term shareholder profit above genuine social and environmental obligations.",
                        answer: "corporate social responsibility"
                    },
                    {
                        item_id: 49,
                        gap_sentence: "Rising ___ — in which an increasingly small and privileged proportion of the population controls an ever-larger share of total national wealth — poses a fundamental and potentially destabilising threat to long-term social cohesion, democratic stability, and sustainable economic health.",
                        answer: "income inequality"
                    },
                    {
                        item_id: 50,
                        gap_sentence: "Chronic back pain, post-traumatic stress disorder, and repetitive strain injuries are extensively documented ___ across the healthcare, emergency services, and manufacturing sectors respectively — highlighting the urgent need for stronger workplace health and safety regulation.",
                        answer: "occupational hazards"
                    },
                    {
                        item_id: 51,
                        gap_sentence: "While ___ has unquestionably created enormous economic opportunities and driven unprecedented levels of international trade and cultural exchange, it has simultaneously contributed to the deindustrialisation of many developed economies and the painful displacement of large sections of the traditional working class.",
                        answer: "globalisation"
                    }
                ]
            },
            {
                id: 6,
                set_name: "Writing Context Tetris (Band 8+)",
                instruction: "Drag the correct term to complete each sentence.",
                word_bank: [
                    "socioeconomic mobility",
                    "remuneration package",
                    "organisational restructuring",
                    "meritocracy",
                    "precarious employment",
                    "intellectual capital",
                    "exploitation of labour",
                    "collective bargaining",
                    "knowledge economy",
                    "structural unemployment"
                ],
                items: [
                    {
                        item_id: 52,
                        gap_sentence: "In the rapidly evolving and increasingly competitive ___, the demonstrated ability to think critically, collaborate effectively across diverse teams, and adapt continuously to new technologies is becoming far more economically valuable than the possession of any single fixed or static set of technical skills.",
                        answer: "knowledge economy"
                    },
                    {
                        item_id: 53,
                        gap_sentence: "The alarming proliferation of ___ arrangements — including zero-hours contracts, temporary agency work, and gig economy platform labour — is systematically eroding the financial security and hard-won social protections that previous generations of workers fought long and hard to establish.",
                        answer: "precarious employment"
                    },
                    {
                        item_id: 54,
                        gap_sentence: "While a genuinely attractive ___ undoubtedly plays an important role in recruiting top-tier talent, research consistently demonstrates that non-financial factors such as meaningful work, genuine autonomy, and clear professional growth pathways are equally — if not more — critical in retaining high-performing employees over the long term.",
                        answer: "remuneration package"
                    },
                    {
                        item_id: 55,
                        gap_sentence: "The systematic erosion of ___ rights — driven by aggressive deregulation, the rapid casualisation of the workforce, and the openly anti-union stance of many powerful corporations — has fundamentally and perhaps irreversibly shifted the balance of power in the employer-employee relationship to the severe disadvantage of ordinary workers.",
                        answer: "collective bargaining"
                    },
                    {
                        item_id: 56,
                        gap_sentence: "Despite the widespread and appealing corporate rhetoric about ___, the persistent and statistically significant advantages enjoyed by candidates from elite educational institutions and privileged social networks suggest that many workplaces remain far from genuinely merit-based in their actual recruitment and promotion decisions.",
                        answer: "meritocracy"
                    },
                    {
                        item_id: 57,
                        gap_sentence: "___ — arising directly from the permanent displacement of workers by advancing automation and the fundamental reorganisation of entire industries — represents a categorically different and far more complex policy challenge than the cyclical unemployment that merely accompanies ordinary economic downturns.",
                        answer: "structural unemployment"
                    },
                    {
                        item_id: 58,
                        gap_sentence: "___ in global supply chains — where workers in developing nations are routinely subjected to poverty-level wages, genuinely dangerous conditions, and the systematic denial of internationally recognised basic rights — represents one of the most serious and morally urgent challenges facing international business regulation today.",
                        answer: "exploitation of labour"
                    },
                    {
                        item_id: 59,
                        gap_sentence: "When corporate recruitment processes systematically favour candidates from privileged backgrounds, they actively undermine ___ and perpetuate a deeply entrenched cycle of inequality that no society genuinely aspiring to fairness and equal opportunity should tolerate.",
                        answer: "socioeconomic mobility"
                    },
                    {
                        item_id: 60,
                        gap_sentence: "The world-leading technology company's most commercially valuable and strategically irreplaceable asset is not its vast physical infrastructure or impressive financial reserves, but rather the extraordinary ___ represented by its exceptional and carefully cultivated team of world-class engineers, designers, and research scientists.",
                        answer: "intellectual capital"
                    },
                    {
                        item_id: 61,
                        gap_sentence: "While large-scale ___ may sometimes be a commercially necessary response to rapidly changing market conditions or disruptive technological change, it frequently results in significant and lasting human costs — including mass redundancies, community decline, and long-term psychological harm — that governments and social systems are woefully underprepared to absorb.",
                        answer: "organisational restructuring"
                    }
                ]
            }
        ],
        speakToUnlock: []
    }
};
