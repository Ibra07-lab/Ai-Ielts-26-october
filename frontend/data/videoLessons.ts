// Video Lesson Data
// Each lesson contains: video info, comprehension questions, vocabulary, exercises

export interface ComprehensionQuestion {
    id: string;
    type: 'tfng' | 'mcq' | 'sentence-completion';
    question: string;
    options?: string[];       // for MCQ
    correctAnswer: string;    // for T/F/NG: "True" | "False" | "Not Given", for MCQ: the correct option text
    explanation: string;
}

export interface VocabularyItem {
    id: string;
    word: string;
    partOfSpeech: string;
    definition: string;
    example: string;
    tip: string;
    tipType: 'speaking' | 'writing' | 'both';
    speakingExample?: string;
    writingExample?: string;
    collocations?: string[];
    synonyms?: string[];
}

export interface VocabExercise {
    id: string;
    type: 'fill-blank' | 'matching' | 'mcq';
    question: string;
    options?: string[];
    correctAnswer: string;
    hint?: string;
    explanation?: string;
    instruction?: string;
}

export interface VideoLesson {
    id: string;
    title: string;
    embedUrl: string;
    duration: string;
    category: string;
    description: string;
    thumbnail?: string;
    comprehensionQuestions: ComprehensionQuestion[];
    vocabulary: VocabularyItem[];
    vocabExercises: VocabExercise[];
    summaryPrompt: string;
    summaryMinWords: number;
}

// в”Ђв”Ђв”Ђ Lesson 1: The Benefits of Doing Nothing в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
export const videoLessons: VideoLesson[] = [
    {
        id: 'benefits-of-doing-nothing',
        title: 'The Benefits of Doing Nothing',
        embedUrl: 'https://www.youtube.com/embed/Y681hXWwhQY?si=FdjQAajOcGjPlTu4',
        duration: '6 mins',
        category: 'Listening Practice',
        description:
            'Explore why taking time to do nothing can actually boost your productivity, creativity, and mental health. This BBC Learning English video discusses the science behind rest and relaxation.',

        // в”Ђв”Ђ Step 2: Comprehension Questions в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
        comprehensionQuestions: [
            {
                id: 'cq1',
                type: 'tfng',
                question: 'The video suggests that being busy all the time is good for your health.',
                correctAnswer: 'False',
                explanation: 'The video explains that constant busyness can be harmful and that doing nothing has significant benefits for health.',
            },
            {
                id: 'cq2',
                type: 'tfng',
                question: 'Taking breaks can help improve creativity.',
                correctAnswer: 'True',
                explanation: 'The video discusses how rest and doing nothing can actually boost creativity and problem-solving skills.',
            },
            {
                id: 'cq3',
                type: 'tfng',
                question: 'The Dutch concept of "niksen" means being lazy and unproductive.',
                correctAnswer: 'False',
                explanation: '"Niksen" is described as the art of doing nothing purposefully вЂ” it is about deliberate rest, not laziness.',
            },
            {
                id: 'cq4',
                type: 'tfng',
                question: 'The video mentions that most people worldwide work more than 48 hours per week.',
                correctAnswer: 'Not Given',
                explanation: 'While the video discusses overworking, it does not provide a specific statistic about worldwide working hours.',
            },
            {
                id: 'cq5',
                type: 'mcq',
                question: 'According to the video, what is one key benefit of doing nothing?',
                options: [
                    'It helps you earn more money',
                    'It can reduce stress and improve mental health',
                    'It makes you more popular',
                    'It helps you sleep less',
                ],
                correctAnswer: 'It can reduce stress and improve mental health',
                explanation: 'The video emphasises that taking time to rest reduces stress and has positive effects on mental wellbeing.',
            },
            {
                id: 'cq6',
                type: 'mcq',
                question: 'What does the video imply about modern society\'s view of rest?',
                options: [
                    'Society encourages enough rest for everyone',
                    'Rest is seen as equally important to work',
                    'Many people feel guilty about doing nothing',
                    'Employers actively promote rest breaks',
                ],
                correctAnswer: 'Many people feel guilty about doing nothing',
                explanation: 'The video highlights that in modern culture, people often feel guilty when they are not being productive.',
            },
            {
                id: 'cq7',
                type: 'sentence-completion',
                question: 'The practice of deliberately doing nothing to rest is called "______" in Dutch.',
                correctAnswer: 'niksen',
                explanation: '"Niksen" is the Dutch concept of purposeful idleness that the video describes.',
            },
            {
                id: 'cq8',
                type: 'tfng',
                question: 'The video recommends spending at least 2 hours per day doing nothing.',
                correctAnswer: 'Not Given',
                explanation: 'The video does not specify a particular amount of time that should be spent doing nothing.',
            },
        ],

        // в”Ђв”Ђ Step 3: Vocabulary в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
        vocabulary: [
            {
                id: 'v1',
                word: 'productivity',
                partOfSpeech: 'noun',
                definition: 'The rate at which goods are produced or work is completed.',
                example: 'Taking regular breaks can actually increase your productivity at work.',
                tip: 'Use in Writing Task 2 essays about work-life balance: "Excessive working hours do not necessarily lead to higher productivity."',
                tipType: 'writing',
            },
            {
                id: 'v2',
                word: 'burnout',
                partOfSpeech: 'noun',
                definition: 'Physical or mental collapse caused by overwork or stress.',
                example: 'Many employees experience burnout after working long hours without rest.',
                tip: 'Great for Speaking Part 3 discussions about work: "Burnout is becoming increasingly common among young professionals."',
                tipType: 'speaking',
            },
            {
                id: 'v3',
                word: 'well-being',
                partOfSpeech: 'noun',
                definition: 'The state of being comfortable, healthy, or happy.',
                example: 'Mental well-being is just as important as physical health.',
                tip: 'Use in both speaking and writing when discussing health or lifestyle topics.',
                tipType: 'both',
            },
            {
                id: 'v4',
                word: 'deliberate',
                partOfSpeech: 'adjective',
                definition: 'Done consciously and intentionally.',
                example: 'She made a deliberate decision to spend her weekends without any screen time.',
                tip: 'Shows sophisticated vocabulary in Writing: "This was a deliberate attempt to improve public health."',
                tipType: 'writing',
            },
            {
                id: 'v5',
                word: 'recharge',
                partOfSpeech: 'verb',
                definition: 'To restore energy or strength after a period of activity.',
                example: 'Taking a holiday helps people recharge and come back to work refreshed.',
                tip: 'Natural in Speaking Part 2: "I like to recharge by spending time in nature."',
                tipType: 'speaking',
            },
            {
                id: 'v6',
                word: 'mindfulness',
                partOfSpeech: 'noun',
                definition: 'A mental state achieved by focusing awareness on the present moment.',
                example: 'Practising mindfulness can help reduce anxiety and improve focus.',
                tip: 'A strong topic word for essays on mental health: "Mindfulness techniques have been adopted by many schools."',
                tipType: 'writing',
            },
            {
                id: 'v7',
                word: 'overwhelmed',
                partOfSpeech: 'adjective',
                definition: 'Feeling unable to cope because there is too much to deal with.',
                example: 'Students often feel overwhelmed during exam season.',
                tip: 'Useful in Speaking for expressing feelings: "I felt completely overwhelmed by the workload."',
                tipType: 'speaking',
            },
            {
                id: 'v8',
                word: 'idle',
                partOfSpeech: 'adjective',
                definition: 'Not working or in use; doing nothing.',
                example: 'Being idle for a short time can actually help your brain process information.',
                tip: 'Use to contrast views in Writing: "While some consider idle time wasted, research suggests otherwise."',
                tipType: 'writing',
            },
        ],

        // в”Ђв”Ђ Step 4: Vocabulary Exercises в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
        vocabExercises: [
            {
                id: 'ex1',
                type: 'fill-blank',
                question: 'Many employees experience ______ after working long hours without proper rest.',
                correctAnswer: 'burnout',
                hint: 'A noun meaning physical or mental collapse from overwork',
            },
            {
                id: 'ex2',
                type: 'fill-blank',
                question: 'She made a ______ decision to reduce her working hours and focus on her health.',
                correctAnswer: 'deliberate',
                hint: 'An adjective meaning done consciously and intentionally',
            },
            {
                id: 'ex3',
                type: 'mcq',
                question: 'Which word best completes the sentence? "Taking a weekend trip helps me ______ after a stressful week."',
                options: ['burnout', 'recharge', 'overwhelm', 'idle'],
                correctAnswer: 'recharge',
            },
            {
                id: 'ex4',
                type: 'mcq',
                question: 'What does "well-being" refer to?',
                options: [
                    'The amount of money someone earns',
                    'The state of being comfortable, healthy, or happy',
                    'A type of exercise routine',
                    'A medical treatment for stress',
                ],
                correctAnswer: 'The state of being comfortable, healthy, or happy',
            },
            {
                id: 'ex5',
                type: 'fill-blank',
                question: 'Practising ______ can help you stay focused on the present moment and reduce anxiety.',
                correctAnswer: 'mindfulness',
                hint: 'A noun related to awareness and being present',
            },
            {
                id: 'ex6',
                type: 'mcq',
                question: 'Which sentence uses "idle" correctly?',
                options: [
                    'I felt very idle about my exam results.',
                    'The machine has been idle for three days.',
                    'She idle her way to success.',
                    'He is idle working on his project.',
                ],
                correctAnswer: 'The machine has been idle for three days.',
            },
            {
                id: 'ex7',
                type: 'fill-blank',
                question: 'Students often feel ______ during exam season because there is too much to study.',
                correctAnswer: 'overwhelmed',
                hint: 'An adjective meaning unable to cope with too much',
            },
            {
                id: 'ex8',
                type: 'matching',
                question: 'Match: "The rate at which work is completed" в†’ ______',
                correctAnswer: 'productivity',
            },
        ],

        // в”Ђв”Ђ Step 5: Summary Writing в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
        summaryPrompt:
            'Write a summary of the video "The Benefits of Doing Nothing" in your own words. Include the main ideas discussed, any examples or evidence mentioned, and your personal opinion on the topic. Try to use at least 3 vocabulary words from the lesson.\n\nAim for 150вЂ“200 words.',
        summaryMinWords: 100,
    },
    {
        id: 'inflation-explained',
        title: '6 Minute English: Inflation',
        embedUrl: 'https://www.youtube.com/embed/FKwmUNffu7M?si=vsIdP35yfvOW9ChB',
        duration: '14 mins',
        category: 'Listening Practice',
        description: 'A BBC Learning English 6-Minute episode discussing inflation, its causes like the pandemic and the war in Ukraine, and its impact on economies worldwide.',
        comprehensionQuestions: [
            {
                id: 'iq1',
                type: 'tfng',
                question: 'The programme states that the cost of energy and food has been increasing more than other goods.',
                correctAnswer: 'True',
                explanation: 'Rob says "Two things in particular are increasing in price вЂ“ energy, like gas and electricity, and food." The phrase "in particular" confirms these are rising more than other items.'
            },
            {
                id: 'iq2',
                type: 'tfng',
                question: 'According to the programme, the war in Ukraine is the only reason for global price increases.',
                correctAnswer: 'False',
                explanation: 'The programme clearly states TWO main reasons: "the Covid pandemic AND the war in Ukraine." It is not the only cause вЂ” this directly contradicts the transcript.'
            },
            {
                id: 'iq3',
                type: 'tfng',
                question: 'Linda Yueh believes that inflation will definitely end once energy prices fall.',
                correctAnswer: 'False',
                explanation: 'Linda Yueh says the opposite вЂ” "even if energy prices, food prices, come down, we could have inflation now in the system." She warns inflation may continue even after energy prices drop.'
            },
            {
                id: 'iq4',
                type: 'tfng',
                question: 'Vicky Pryce suggests that governments should directly control food prices to reduce inflation.',
                correctAnswer: 'Not Given',
                explanation: 'Vicky Pryce talks about slowing down demand by increasing interest rates. She never mentions government control of food prices вЂ” this topic is simply not discussed.'
            },
            {
                id: 'iq5',
                type: 'mcq',
                question: 'According to the programme, what happens when goods are "in short supply"?',
                options: [
                    'Companies produce more to meet demand',
                    'Prices tend to increase',
                    'Governments reduce interest rates',
                    'Consumers start saving more money'
                ],
                correctAnswer: 'Prices tend to increase',
                explanation: 'Rob explains: "when things are in short supply вЂ“ available in limited quantities - prices go up." The reduced supply from the pandemic and war caused prices to rise.'
            },
            {
                id: 'iq6',
                type: 'mcq',
                question: 'What does Linda Yueh mean when she says price increases are "getting passed through"?',
                options: [
                    'Prices are being shared equally among all consumers',
                    'Companies are charging customers more to cover their own rising costs',
                    'Governments are passing new laws about pricing',
                    'Price increases are moving from one country to another'
                ],
                correctAnswer: 'Companies are charging customers more to cover their own rising costs',
                explanation: 'Linda Yueh explains that sustained price increases are "getting passed through into how companies price their goods and services" вЂ” meaning companies raise their prices to cover the extra costs they face.'
            },
            {
                id: 'iq7',
                type: 'mcq',
                question: 'According to economist Vicky Pryce, how can increasing interest rates help control inflation?',
                options: [
                    'It encourages people to invest in foreign currencies',
                    'It makes people and businesses borrow less, reducing spending',
                    'It forces banks to lower their profits',
                    'It increases government tax revenue'
                ],
                correctAnswer: 'It makes people and businesses borrow less, reducing spending',
                explanation: 'Vicky Pryce says: "if you increase interest rates, what you do is you discourage people from borrowing, whether they are individuals or whether they are businesses." Less borrowing means less spending means reduced demand means lower inflation.'
            },
            {
                id: 'iq8',
                type: 'mcq',
                question: 'Why does Linda Yueh say that inflation is "hugely worrying" for developing countries?',
                options: [
                    'Because they have more advanced financial systems',
                    'Because they export more energy than developed countries',
                    'Because they have less developed industry and lower living standards',
                    'Because their currencies are stronger than those of advanced economies'
                ],
                correctAnswer: 'Because they have less developed industry and lower living standards',
                explanation: 'The programme defines developing economies as "countries which have industry that\'s less developed and have lower living standards." Inflation hits these countries harder because people already have less financial cushion.'
            },
            {
                id: 'iq9',
                type: 'sentence-completion',
                question: 'Complete the sentence: A recession is an economic situation where a country\'s production declines, people\'s incomes fall, and ___.',
                options: [
                    'interest rates go up',
                    'unemployment goes up',
                    'food prices stabilise',
                    'inflation disappears'
                ],
                correctAnswer: 'unemployment goes up',
                explanation: 'The programme defines recession as "a situation where a country\'s production starts going down, people\'s incomes go down and unemployment goes up."'
            },
            {
                id: 'iq10',
                type: 'mcq',
                question: 'What was the annual inflation rate in Venezuela in the 12 months to November 2018, according to the programme?',
                options: [
                    '130%',
                    '1,300%',
                    '130,000%',
                    '1,300,000%'
                ],
                correctAnswer: '1,300,000%',
                explanation: 'Rob reveals: "the annual inflation rate reached 1,300,000% in the 12 months to November 2018." This extreme situation was called hyperinflation.'
            }
        ],
        vocabulary: [
            {
                id: 'iv1',
                word: 'inflation',
                partOfSpeech: 'noun (uncountable)',
                definition: 'A general increase in the prices of goods and services over a period of time, reducing the purchasing power of money.',
                example: 'Inflation has made everyday essentials like bread and milk significantly more expensive than they were two years ago.',
                tip: 'Collocations: high/low inflation, rising inflation, control inflation. Synonyms: price rises, cost increases.',
                tipType: 'both',
            },
            {
                id: 'iv2',
                word: 'hit in the pocket',
                partOfSpeech: 'idiom',
                definition: 'To have less money available to spend; to suffer financially.',
                example: 'Rising energy bills have really hit families in the pocket, forcing many to cut back on non-essential spending.',
                tip: 'Great for Speaking: "People are really being hit in the pocket at the moment, especially when it comes to fuel and electricity."',
                tipType: 'speaking',
            },
            {
                id: 'iv3',
                word: 'volatile',
                partOfSpeech: 'adjective',
                definition: 'Liable to change rapidly and unpredictably, especially for the worse. Often used to describe markets, prices, or situations.',
                example: 'Oil prices have been extremely volatile this year, swinging between record highs and unexpected lows.',
                tip: 'Collocations: volatile market, volatile prices. Synonyms: unpredictable, unstable, fluctuating, erratic.',
                tipType: 'both',
            },
            {
                id: 'iv4',
                word: 'sustained',
                partOfSpeech: 'adjective',
                definition: 'Continuing at the same level or intensity for an extended period of time without weakening.',
                example: 'The sustained rise in house prices has made it nearly impossible for young people to buy their first home.',
                tip: 'Collocations: sustained growth, sustained increase, sustained period. Synonyms: prolonged, continuous, ongoing.',
                tipType: 'writing',
            },
            {
                id: 'iv5',
                word: 'in short supply',
                partOfSpeech: 'phrase',
                definition: 'Available only in limited quantities; not enough to meet demand.',
                example: 'During the pandemic, face masks and hand sanitiser were in short supply, causing prices to skyrocket.',
                tip: 'Collocations: goods in short supply, remain in short supply. Synonyms: scarce, limited, insufficient.',
                tipType: 'both',
            },
            {
                id: 'iv6',
                word: 'interest rate',
                partOfSpeech: 'noun',
                definition: 'The percentage charged by a bank or financial institution for lending money, or the percentage paid to savers for depositing money.',
                example: 'When the central bank raised interest rates, mortgage payments increased dramatically, putting pressure on homeowners.',
                tip: 'Collocations: raise/increase interest rates, cut/lower interest rates. Synonyms: borrowing rate, lending rate.',
                tipType: 'both',
            },
            {
                id: 'iv7',
                word: 'recession',
                partOfSpeech: 'noun',
                definition: 'A period of temporary economic decline during which trade and industrial activity are reduced, generally identified by a fall in GDP over two consecutive quarters.',
                example: 'The country entered a deep recession, with thousands of businesses closing and unemployment reaching record levels.',
                tip: 'Collocations: economic recession, deep/severe recession, enter/fall into a recession, recover from a recession.',
                tipType: 'both',
            },
            {
                id: 'iv8',
                word: 'effective',
                partOfSpeech: 'adjective',
                definition: 'Successful in producing a desired or intended result; working well.',
                example: 'Raising interest rates is considered one of the most effective methods of controlling inflation.',
                tip: 'Collocations: highly effective, most effective, cost-effective, effective measures/methods.',
                tipType: 'both',
            }
        ],
        vocabExercises: [
            {
                id: 'iex1',
                type: 'fill-blank',
                instruction: 'Complete the sentence with the correct vocabulary word or phrase from this lesson.',
                question: 'During the energy crisis, natural gas was ___ ___ ___, causing heating bills to double.',
                correctAnswer: 'in short supply',
            },
            {
                id: 'iex2',
                type: 'fill-blank',
                question: 'The central bank decided to raise ___ ___ to discourage borrowing and slow down consumer spending.',
                correctAnswer: 'interest rates',
            },
            {
                id: 'iex3',
                type: 'fill-blank',
                question: 'Food prices have been extremely ______ this year, changing dramatically from week to week.',
                correctAnswer: 'volatile',
            },
            {
                id: 'iex4',
                type: 'fill-blank',
                question: 'The ______ rise in living costs has forced many families to cut back on essentials.',
                correctAnswer: 'sustained',
            },
            {
                id: 'iex5',
                type: 'mcq',
                question: 'In the podcast, Rob says consumers are being "hit in the pocket." What does he mean?',
                options: [
                    'Someone physically hit their pocket',
                    'People have less money available to spend',
                    'People are finding money in their pockets',
                    'Banks are taking money from people\'s accounts'
                ],
                correctAnswer: 'People have less money available to spend',
            },
            {
                id: 'iex6',
                type: 'mcq',
                question: 'Which word correctly completes this sentence? "The government introduced several measures to combat ______, which had reached 8% annually."',
                options: ['recession', 'inflation', 'interest', 'volatility'],
                correctAnswer: 'inflation',
            },
            {
                id: 'iex7',
                type: 'mcq',
                question: 'Which sentence uses "effective" CORRECTLY?',
                options: [
                    'The effective of the new policy was immediate.',
                    'Raising interest rates proved to be an effective strategy.',
                    'She effective completed the project on time.',
                    'The team worked in an effective of three people.'
                ],
                correctAnswer: 'Raising interest rates proved to be an effective strategy.',
            },
            {
                id: 'iex8',
                type: 'mcq',
                question: 'What is the difference between a "recession" and "inflation"?',
                options: [
                    'They mean the same thing',
                    'Inflation is rising prices; a recession is a broader economic decline with falling production and rising unemployment',
                    'A recession is about prices; inflation is about unemployment',
                    'Inflation only affects developing countries; recession affects all countries'
                ],
                correctAnswer: 'Inflation is rising prices; a recession is a broader economic decline with falling production and rising unemployment',
            },
            {
                id: 'iex9',
                type: 'mcq',
                question: 'The economy entered a ______ recession after two quarters of negative growth.',
                options: ['large', 'deep', 'tall', 'wide'],
                correctAnswer: 'deep',
            },
            {
                id: 'iex10',
                type: 'mcq',
                question: 'The government needs to find a cost-______ solution to the housing crisis.',
                options: ['effective', 'efficient', 'effected', 'affecting'],
                correctAnswer: 'effective',
            },
            {
                id: 'iex11_1',
                type: 'matching',
                instruction: 'Match each vocabulary word or phrase with its correct definition.',
                question: '"A general increase in prices over time" в†’ ______',
                correctAnswer: 'inflation',
            },
            {
                id: 'iex11_2',
                type: 'matching',
                question: '"Unpredictable and liable to change suddenly" в†’ ______',
                correctAnswer: 'volatile',
            },
            {
                id: 'iex11_3',
                type: 'matching',
                question: '"Continuing at the same level for a long period" в†’ ______',
                correctAnswer: 'sustained',
            },
            {
                id: 'iex11_4',
                type: 'matching',
                question: '"Economic decline with falling production and rising unemployment" в†’ ______',
                correctAnswer: 'recession',
            },
            {
                id: 'iex11_5',
                type: 'matching',
                question: '"Available only in limited quantities" в†’ ______',
                correctAnswer: 'in short supply',
            },
            {
                id: 'iex11_6',
                type: 'matching',
                question: '"The fee charged by banks for lending money" в†’ ______',
                correctAnswer: 'interest rate',
            },
            {
                id: 'iex12',
                type: 'mcq',
                question: 'Which sentence contains a vocabulary ERROR?',
                options: [
                    'Rising inflation has reduced people\'s purchasing power.',
                    'Oil prices have been very volatile recently, changing daily.',
                    'The sustained drop in prices ended after just two days.',
                    'Higher interest rates discourage people from borrowing.'
                ],
                correctAnswer: 'The sustained drop in prices ended after just two days.',
                explanation: 'If the drop "ended after just two days," it cannot be described as "sustained." Sustained means continuing for a long period.',
            },
            {
                id: 'iex13',
                type: 'mcq',
                question: 'Which sentence contains a vocabulary ERROR?',
                options: [
                    'The recession led to widespread unemployment across the country.',
                    'Clean water is in short supply in many developing regions.',
                    'The inflation of the balloon took about five minutes.',
                    'The new policy proved highly effective in reducing crime.'
                ],
                correctAnswer: 'The inflation of the balloon took about five minutes.',
                explanation: 'While "inflation" can technically mean blowing something up, in an economics context this is misleading and shows incorrect usage of the target vocabulary. The correct word here would be "inflating" (verb form) rather than "inflation" (economic noun).',
            },
            {
                id: 'iex14',
                type: 'fill-blank',
                question: 'The country fell into a severe ______ after years of economic mismanagement, with factories closing and millions losing their jobs.',
                correctAnswer: 'recession',
            }
        ],
        summaryPrompt: 'Summarise the video "6 Minute English: Inflation" in your own words. Discuss the causes of inflation mentioned, how it impacts ordinary people, and the ways governments try to control it.',
        summaryMinWords: 150,
    },
    {
        id: 'following-your-dreams',
        title: 'Are you following your dreams?',
        embedUrl: 'https://www.youtube.com/embed/26PrgjTboVQ?si=6dCJb1_0crdo8zu1',
        duration: '6 mins',
        category: 'Listening Practice',
        description: 'Do you have a childhood dream that you still follow? In this 6 Minute English, Sam and Neil discuss the Riverside community and the Zapp family, who have spent 22 years travelling the world.',
        comprehensionQuestions: [
            {
                id: 'q1',
                type: 'tfng',
                question: 'The programme says that most people successfully follow their childhood dreams into adulthood.',
                correctAnswer: 'False',
                explanation: 'The programme states the opposite: "as we grow up these childhood dreams often get lost in the adult world of jobs, money, families and careers." The word "often" confirms most people do NOT follow their dreams.'
            },
            {
                id: 'q2',
                type: 'tfng',
                question: 'Daisy was born in New Zealand and has lived at Riverside her entire life.',
                correctAnswer: 'False',
                explanation: 'The programme clearly states that "Daisy, who was born in East Germany, joined Riverside in 2004." She was born in Germany, not New Zealand, and she joined the community in 2004, not at birth.'
            },
            {
                id: 'q3',
                type: 'tfng',
                question: 'The Zapp family have visited more than one hundred countries during their journey.',
                correctAnswer: 'True',
                explanation: 'Herman\'s story says "twenty-two years and three children later they have visited over a hundred countries." "Over a hundred" confirms more than one hundred.'
            },
            {
                id: 'q4',
                type: 'tfng',
                question: 'Herman Zapp says he regrets spending so many years travelling instead of building a traditional career.',
                correctAnswer: 'False',
                explanation: 'Herman says the opposite: "I am so happy with the Herman there is now." He does not express regret about travelling. He describes how travelling changed him for the better.'
            },
            {
                id: 'q5',
                type: 'tfng',
                question: 'Candelaria Zapp had a professional career as a journalist before the trip began.',
                correctAnswer: 'Not Given',
                explanation: 'The programme describes Candelaria as Herman\'s "childhood sweetheart" but never mentions her profession or career before the trip. This information is simply not discussed.'
            },
            {
                id: 'q6',
                type: 'mcq',
                question: 'According to the programme, how does Riverside community handle money?',
                options: [
                    'A) Each person keeps what they earn from their own job',
                    'B) All money earned is collected and shared between everyone equally',
                    'C) The community leader decides how money is distributed',
                    'D) Members donate a percentage of their income to a shared fund'
                ],
                correctAnswer: 'B) All money earned is collected and shared between everyone equally',
                explanation: 'Daisy explains: "it doesn\'t matter how many hours you work or what work you do, everyone is getting the same amount." All earnings are pooled and divided equally.'
            },
            {
                id: 'q7',
                type: 'mcq',
                question: 'Why do some local people outside Riverside attach the label "communism" to the community?',
                options: [
                    'A) Because the community follows communist political leaders',
                    'B) Because all members vote for the same political party',
                    'C) Because the idea of sharing everything equally seems very strange to them',
                    'D) Because the community was originally founded by communist immigrants'
                ],
                correctAnswer: 'C) Because the idea of sharing everything equally seems very strange to them',
                explanation: 'Daisy says people "struggle with" the idea of equal sharing and call it communism because "it seems so outlandish for people." She also clarifies that Riverside is NOT a communist community and people with many different political views live there.'
            },
            {
                id: 'q8',
                type: 'mcq',
                question: 'How much money did Herman and Candelaria Zapp have when they started their journey?',
                options: [
                    'A) Less than $350',
                    'B) Less than $3,500',
                    'C) Less than $35,000',
                    'D) The programme does not mention a specific amount'
                ],
                correctAnswer: 'B) Less than $3,500',
                explanation: 'The programme states they "set off from Argentina to travel around the world with less than 3,500 dollars in their pockets."'
            },
            {
                id: 'q9',
                type: 'mcq',
                question: 'What does Herman mean when he says he was "conquered by the world"?',
                options: [
                    'A) He was defeated by the difficulties of travelling',
                    'B) He was changed and humbled by his experiences and the people he met',
                    'C) He was forced to return home because of problems',
                    'D) He lost control of his travel plans'
                ],
                correctAnswer: 'B) He was changed and humbled by his experiences and the people he met',
                explanation: 'Herman contrasts his earlier desire to "conquer the world" (control it) with being "conquered by the world" вЂ” meaning his experiences and the people he met transformed him into a more humble person. He says "the more you meet people... how much more humble you become."'
            },
            {
                id: 'q10',
                type: 'mcq',
                question: 'According to Bronnie Ware\'s book, what was the number one regret of terminally ill patients?',
                options: [
                    'A) I wish I hadn\'t worked so hard',
                    'B) I wish I had followed my dreams',
                    'C) I wish I had made more money',
                    'D) I wish I had spent more time with family'
                ],
                correctAnswer: 'B) I wish I had followed my dreams',
                explanation: 'Neil reveals at the end: "Not having the courage to follow your dreams was listed as the top life regret."'
            }
        ],
        vocabulary: [
            {
                id: 'v1',
                word: 'utopia',
                partOfSpeech: 'noun',
                definition: 'An imagined perfect world or society where everyone is happy, equal, and lives in harmony.',
                example: 'The idea of creating a utopia where there is no poverty or conflict has inspired philosophers for centuries.',
                tip: '',
                tipType: 'both',
                speakingExample: 'I don\'t think a true utopia is actually possible in reality because human beings are naturally diverse and have different needs. However, trying to build a better community, like the one in Riverside, is a noble goal.',
                writingExample: 'While critics argue that communal living is an attempt to create an unrealistic utopia, proponents suggest it offers a viable alternative to the isolation of modern urban life.',
                collocations: ['create a utopia', 'vision of utopia', 'utopian society', 'unrealistic utopia'],
                synonyms: ['paradise', 'ideal world', 'perfect society']
            },
            {
                id: 'v2',
                word: 'struggle with',
                partOfSpeech: 'phrasal verb',
                definition: 'To find something difficult to accept, understand, or deal with.',
                example: 'Many people struggle with the idea of working for free, even if it benefits the wider community.',
                tip: '',
                tipType: 'both',
                speakingExample: 'Many of my friends struggle with the pressure of high-stress jobs. They want to pursue their passions but are afraid of losing their financial security.',
                writingExample: 'Governments often struggle with the challenge of balancing economic growth with environmental preservation.',
                collocations: ['struggle with an idea', 'struggle with a decision', 'struggle with depression'],
                synonyms: ['grapple with', 'wrestle with', 'find difficult']
            },
            {
                id: 'v3',
                word: 'outlandish',
                partOfSpeech: 'adjective',
                definition: 'Strange, unusual, and difficult to accept because it is so different from what is normal.',
                example: 'His plan to quit his job and sail around the world alone seemed completely outlandish to his family.',
                tip: '',
                tipType: 'both',
                speakingExample: 'Some people might find the idea of travelling for 22 years in a vintage car quite outlandish, but for the Zapp family, it became a way of life.',
                writingExample: 'In the past, the idea of universal wireless communication was considered outlandish, yet today it is an essential part of daily life.',
                collocations: ['outlandish idea', 'outlandish claim', 'outlandish costume'],
                synonyms: ['bizarre', 'eccentric', 'quirky', 'peculiar']
            },
            {
                id: 'v4',
                word: 'conquer',
                partOfSpeech: 'verb',
                definition: 'To take control of something by force; or to overcome a difficulty.',
                example: 'Instead of trying to conquer the world, Herman discovered that the world had conquered him through his experiences.',
                tip: '',
                tipType: 'both',
                speakingExample: 'I finally managed to conquer my fear of public speaking after taking a course and practicing every day.',
                writingExample: 'Humanity has managed to conquer many deadly diseases through scientific innovation and international cooperation.',
                collocations: ['conquer a fear', 'conquer the world', 'conquer a mountain'],
                synonyms: ['overcome', 'defeat', 'master', 'triumph over']
            },
            {
                id: 'v5',
                word: 'humble',
                partOfSpeech: 'adjective',
                definition: 'Not proud or arrogant; having a modest view of one\'s own importance.',
                example: 'Meeting people from so many different backgrounds made Herman a more humble person.',
                tip: '',
                tipType: 'both',
                speakingExample: 'The most successful people I know are often the most humble; they don\'t feel the need to brag about their achievements.',
                writingExample: 'Despite his global fame, the scientist remained humble and always credited his research team for their contributions.',
                collocations: ['humble beginnings', 'humble attitude', 'stay humble'],
                synonyms: ['modest', 'unassuming', 'meek']
            },
            {
                id: 'v6',
                word: 'a grain of sand',
                partOfSpeech: 'phrase',
                definition: 'Something very small and seemingly insignificant on its own, yet part of something larger.',
                example: 'Each individual is just a grain of sand on a vast beach, but without every single grain, the beach would not exist.',
                tip: '',
                tipType: 'both',
                speakingExample: 'Sometimes I feel like just a grain of sand in a huge city, but then I realize that my actions can still make a difference to the people around me.',
                writingExample: 'While a single vote may seem like a grain of sand in a national election, the collective power of individual choices determines the future of a country.',
                collocations: ['just a grain of sand', 'like a grain of sand'],
                synonyms: ['speck', 'tiny part', 'insignificant element']
            }
        ],
        vocabExercises: [
            {
                id: 'e1',
                type: 'fill-blank',
                question: 'Many people ______ the idea of giving up a stable career to pursue an uncertain dream.',
                hint: 'Phrasal verb: to find something difficult to accept',
                correctAnswer: 'struggle with'
            },
            {
                id: 'e2',
                type: 'fill-blank',
                question: 'Her friends thought her plan to live in a remote village without electricity was completely ______.',
                hint: 'Adjective: strange, unusual, and difficult to accept',
                correctAnswer: 'outlandish'
            },
            {
                id: 'e3',
                type: 'fill-blank',
                question: 'Years of travelling and meeting people from different cultures made him a much more ______ person.',
                hint: 'Adjective: not proud or arrogant',
                correctAnswer: 'humble'
            },
            {
                id: 'e4',
                type: 'fill-blank',
                question: 'The community tried to create a ______ where everyone was equal and there was no poverty or conflict.',
                hint: 'Noun: an imagined perfect world or society',
                correctAnswer: 'utopia'
            },
            {
                id: 'e5',
                type: 'mcq',
                question: 'In the podcast, Herman says he no longer wants to "conquer the world." What did he originally mean by this?',
                options: [
                    'A) He wanted to travel to every country',
                    'B) He wanted to control and dominate everything around him',
                    'C) He wanted to learn every language in the world',
                    'D) He wanted to become a military leader'
                ],
                correctAnswer: 'B',
                explanation: 'Herman explains he wanted to control things, which he contrasts with being "conquered" (changed/humbled) by the world.'
            },
            {
                id: 'e6',
                type: 'mcq',
                question: 'Daisy says local people call Riverside "outlandish." Based on the podcast, why?',
                options: [
                    'A) Because Riverside is located in a remote area',
                    'B) Because the community members speak different languages',
                    'C) Because sharing everything equally seems very strange and unusual to outsiders',
                    'D) Because the community does not allow visitors'
                ],
                correctAnswer: 'C',
                explanation: 'Daisy says people struggle with the idea of equal sharing because it seems so outlandish (unusual) to them.'
            },
            {
                id: 'e7',
                type: 'mcq',
                question: 'Herman describes himself as "a grain of sand." What is he trying to express?',
                options: [
                    'A) He feels completely worthless and unimportant',
                    'B) He is one small but meaningful part of something much larger',
                    'C) He wants to live on a beach',
                    'D) He thinks human life is meaningless'
                ],
                correctAnswer: 'B',
                explanation: 'He means he is just one small part of a vast world of people.'
            },
            {
                id: 'e8',
                type: 'mcq',
                question: 'Which sentence uses "struggle with" CORRECTLY?',
                options: [
                    'A) She struggled with the heavy suitcase up the stairs.',
                    'B) Many older employees struggle with adapting to new technology.',
                    'C) He struggled with his friend in the park yesterday.',
                    'D) The team struggled with winning the championship easily.'
                ],
                correctAnswer: 'B',
                explanation: 'In this context, it refers to finding a concept or change difficult to deal with.'
            },
            {
                id: 'e9',
                type: 'mcq',
                question: 'Complete the collocation: She had very ______ beginnings, growing up in a small village with no running water.',
                options: ['A) humble', 'B) outlandish', 'C) utopian', 'D) conquered'],
                correctAnswer: 'A',
                explanation: '"Humble beginnings" is a common collocation for a modest/poor start in life.'
            },
            {
                id: 'e10',
                type: 'mcq',
                question: 'Complete the collocation: The young entrepreneur had a burning desire to ______ the business world.',
                options: ['A) struggle', 'B) humble', 'C) conquer', 'D) outlandish'],
                correctAnswer: 'C',
                explanation: '"Conquer the world" or "conquer a field" means to become highly successful and dominant.'
            },
            {
                id: 'e11-1',
                type: 'matching',
                question: 'An imagined perfect world or society where everyone is happy.',
                correctAnswer: 'utopia'
            },
            {
                id: 'e11-2',
                type: 'matching',
                question: 'To find something difficult to accept or deal with.',
                correctAnswer: 'struggle with'
            },
            {
                id: 'e11-3',
                type: 'matching',
                question: 'Strange, unusual, and difficult to accept.',
                correctAnswer: 'outlandish'
            },
            {
                id: 'e11-4',
                type: 'matching',
                question: 'To overcome a difficulty or master a challenge.',
                correctAnswer: 'conquer'
            },
            {
                id: 'e11-5',
                type: 'matching',
                question: 'Having a modest view of oneвЂ™s importance; not arrogant.',
                correctAnswer: 'humble'
            },
            {
                id: 'e11-6',
                type: 'matching',
                question: 'A tiny and seemingly insignificant part of something larger.',
                correctAnswer: 'a grain of sand'
            }
        ],
        summaryPrompt: 'Summarise the video "Are you following your dreams?" in your own words. Discuss the different approaches to following dreams mentioned (Riverside community vs. Zapp family), the challenges they face, and what lesson Herman learned from his travels.',
        summaryMinWords: 150,
    },
    {
        id: 'social-media-health',
        title: 'Social media and teenage health',
        embedUrl: 'https://www.youtube.com/embed/g8q-Nq-ajx8?si=Q_cngTG6MqqkJrZr',
        duration: '6:13',
        category: 'Listening Practice',
        description: 'Explore the impact of social media on teenage mental health, including the role of algorithms and the responsibility of platforms and parents.',
        comprehensionQuestions: [
            {
                id: 'q1',
                type: 'tfng',
                question: 'The programme states that research in the US found teenagers who use social media for more than three hours daily are twice as likely to develop depression and anxiety.',
                correctAnswer: 'True',
                explanation: 'The programme says: "Research in the US has found that adolescents who spend more than three hours a day on social media have double the risk of developing depression and anxiety." Double the risk means twice as likely.'
            },
            {
                id: 'q2',
                type: 'tfng',
                question: 'According to the programme, the UK has already introduced laws to regulate social media use among teenagers.',
                correctAnswer: 'False',
                explanation: 'The programme says the US is "currently in the process of regulating social media apps for teenagers" and that "some scientists think the UK should do the same." The word "should" tells us the UK has NOT done it yet.'
            },
            {
                id: 'q3',
                type: 'tfng',
                question: 'Professor Sridhar believes that parents have found effective ways to manage their children\'s social media use.',
                correctAnswer: 'False',
                explanation: 'Professor Sridhar describes it as "a losing battle" and says parents have to "find solutions on their own." The phrase "losing battle" directly implies their efforts are NOT effective.'
            },
            {
                id: 'q4',
                type: 'tfng',
                question: 'TikTok has more teenage users than Snapchat worldwide.',
                correctAnswer: 'Not Given',
                explanation: 'The programme mentions that 90% of 13 to 24 year olds use Snapchat, but it never provides a comparison figure for TikTok.'
            },
            {
                id: 'q5',
                type: 'tfng',
                question: 'Surveys have shown that 64% of teenagers say they are regularly exposed to hate-based content on social media.',
                correctAnswer: 'True',
                explanation: 'The programme directly states: "64% of teens have said they are regularly exposed to hate-based content."'
            },
            {
                id: 'q6',
                type: 'mcq',
                question: 'According to Professor Sridhar, why do social media platforms keep showing similar content to users?',
                options: [
                    'A) Because they want to educate users about specific topics',
                    'B) Because they want to keep users on their phones so they can earn advertising money',
                    'C) Because users specifically request to see similar content',
                    'D) Because government regulations require them to do so'
                ],
                correctAnswer: 'B) Because they want to keep users on their phones so they can earn advertising money',
                explanation: 'Professor Sridhar explains: "...their revenue comes from advertising."'
            },
            {
                id: 'q7',
                type: 'mcq',
                question: 'What specific concern does Professor Sridhar raise about young girls and social media algorithms?',
                options: [
                    'A) Young girls are spending too much money on online shopping',
                    'B) Young girls are being fed content about eating disorders in an addictive way',
                    'C) Young girls are communicating with strangers online',
                    'D) Young girls are posting too many personal photos'
                ],
                correctAnswer: 'B) Young girls are being fed content about eating disorders in an addictive way',
                explanation: 'Professor Sridhar says: "...with young girls and eating disorders, that they\'re being fed that in an addictive way..."'
            },
            {
                id: 'q8',
                type: 'mcq',
                question: 'Why does the programme describe Snapchat as particularly popular with teenagers?',
                options: [
                    'A) Because it is free to download',
                    'B) Because it has the best video quality',
                    'C) Because messages and photos disappear after a certain time period',
                    'D) Because parents cannot monitor what is shared'
                ],
                correctAnswer: 'C) Because messages and photos disappear after a certain time period',
                explanation: 'The programme states: "This is partly because messages and photos disappear after a certain time period."'
            },
            {
                id: 'q9',
                type: 'mcq',
                question: 'What percentage of people aged thirteen to twenty-four use Snapchat, according to the programme?',
                options: ['A) 70%', 'B) 80%', 'C) 90%', 'D) 95%'],
                correctAnswer: 'C) 90%',
                explanation: 'Neil reveals: "Actually 90% of people aged between thirteen and twenty-four use Snapchat."'
            },
            {
                id: 'q10',
                type: 'mcq',
                question: 'Professor Sridhar describes the situation for parents as "a losing battle." What does she mean by this?',
                options: [
                    'A) Parents are not interested in helping their children',
                    'B) Parents are winning the fight against social media companies',
                    'C) Parents face a fight they cannot win because social media is their children\'s entire social life',
                    'D) Parents should stop trying to help their children'
                ],
                correctAnswer: 'C) Parents face a fight they cannot win because social media is their children\'s entire social life',
                explanation: 'Professor Sridhar explains: "it\'s a losing battle because it\'s their entire social network."'
            }
        ],
        vocabulary: [
            {
                id: 'v1',
                word: 'adolescent',
                partOfSpeech: 'noun / adjective',
                definition: 'A young person aged between ten and nineteen, in the stage of life between childhood and adulthood.',
                example: 'Research shows that adolescents who spend excessive time on social media are more likely to experience anxiety and low self-esteem.',
                tip: '',
                tipType: 'both',
                speakingExample: 'I think adolescents are particularly vulnerable to social media pressure because at that age you are still figuring out who you are. When I was an adolescent, we didn\'t have Instagram or TikTok, so the pressure to look a certain way or act a certain way was much less intense than it is today.',
                writingExample: 'Studies consistently indicate that adolescents who are exposed to idealised body images on social media platforms are significantly more likely to develop negative self-perception and, in severe cases, eating disorders.',
                collocations: ['adolescent behaviour', 'adolescent health', 'adolescent development', 'troubled adolescent', 'adolescent mental health'],
                synonyms: ['teenager', 'young person', 'youth', 'minor']
            },
            {
                id: 'v2',
                word: 'fed (content)',
                partOfSpeech: 'verb (past participle)',
                definition: 'Given something automatically and continuously, without asking for it (pushed by an algorithm).',
                example: 'Teenagers are being fed a constant stream of content that the algorithm has selected based on their previous viewing habits.',
                tip: '',
                tipType: 'both',
                speakingExample: 'The problem is that young people are being fed content they didn\'t actually search for. The app just decides what they should see next, and often it pushes things that are actually quite harmful, like extreme dieting videos or unrealistic beauty standards, because those topics get the most engagement.',
                writingExample: 'One of the most significant concerns regarding social media is that users, particularly young people, are passively fed content by algorithms rather than actively choosing what they consume, which reduces their control over the information they receive.',
                collocations: ['fed content', 'fed information', 'fed data', 'constantly fed', 'being fed'],
                synonyms: ['given', 'served', 'supplied', 'pushed', 'delivered']
            },
            {
                id: 'v3',
                word: 'algorithm',
                partOfSpeech: 'noun',
                definition: 'A complex set of rules used by computers to decide what content each user sees.',
                example: 'Social media algorithms are designed to show you content that keeps you scrolling for as long as possible, regardless of whether that content is good for you.',
                tip: '',
                tipType: 'both',
                speakingExample: 'I think most people don\'t really understand how algorithms work. They think they\'re just seeing random posts, but actually everything they see has been carefully selected by an algorithm that knows exactly what will keep them looking at their screen. It\'s quite unsettling when you think about it.',
                writingExample: 'The algorithms employed by social media platforms prioritise content that generates maximum engagement, which frequently means promoting sensational, controversial, or emotionally provocative material over balanced and factual information.',
                collocations: ['social media algorithm', 'algorithm-driven', 'the algorithm decides', 'algorithm-based recommendations', 'manipulate the algorithm'],
                synonyms: ['formula', 'set of rules', 'automated process', 'computational method']
            },
            {
                id: 'v4',
                word: 'revenue',
                partOfSpeech: 'noun (uncountable)',
                definition: 'The total amount of money that a company earns from its business activities, especially from advertising.',
                example: 'Social media platforms generate billions in revenue each year by selling advertising space to companies who want to reach their users.',
                tip: '',
                tipType: 'both',
                speakingExample: 'I think the real issue is that social media companies make their revenue from advertising, which means they need people to stay on the app for as long as possible. So they have no real motivation to make the experience healthier or shorter, because that would directly reduce their income.',
                writingExample: 'Since social media platforms derive the vast majority of their revenue from advertising, there is an inherent conflict of interest between maximising user engagement and protecting users\' mental health.',
                collocations: ['advertising revenue', 'annual revenue', 'generate revenue', 'revenue growth', 'revenue stream', 'a source of revenue'],
                synonyms: ['income', 'earnings', 'turnover', 'profits']
            },
            {
                id: 'v5',
                word: 'onus',
                partOfSpeech: 'noun',
                definition: 'The responsibility or duty to do something, especially when it is difficult or unwanted.',
                example: 'Professor Sridhar argues that the onus has unfairly been placed on parents to protect their children from harmful content, rather than on the companies creating it.',
                tip: '',
                tipType: 'both',
                speakingExample: 'Personally, I don\'t think the onus should be entirely on parents. They can\'t monitor everything their child does online. I believe the onus should be on the social media companies themselves to design platforms that are safer for young users, because they are the ones making money from it.',
                writingExample: 'Rather than placing the onus solely on individual users to manage their screen time, governments should hold technology companies accountable for the design choices that deliberately encourage excessive and addictive usage patterns.',
                collocations: ['the onus is on', 'place the onus on', 'shift the onus', 'the onus falls on', 'the onus of responsibility'],
                synonyms: ['responsibility', 'duty', 'obligation', 'burden']
            },
            {
                id: 'v6',
                word: 'a losing battle',
                partOfSpeech: 'idiom / noun phrase',
                definition: 'A struggle or effort that is very unlikely to succeed, no matter how hard you try.',
                example: 'Trying to stop teenagers from using social media completely is a losing battle because their entire social life exists on these platforms.',
                tip: '',
                tipType: 'both',
                speakingExample: 'My parents tried to limit my screen time when I was younger, but honestly it was a losing battle. All my friends were on Instagram and WhatsApp, and if I wasn\'t on there too, I would completely miss out on everything happening in my social group. I think that\'s the reality most parents face.',
                writingExample: 'Without meaningful government intervention and industry self-regulation, parents who attempt to shield their children from harmful online content will continue to fight a losing battle against platforms specifically designed to capture and retain young users\' attention.',
                collocations: ['fight a losing battle', 'face a losing battle', 'it\'s a losing battle', 'seems like a losing battle'],
                synonyms: ['hopeless struggle', 'futile effort', 'uphill battle', 'impossible fight']
            }
        ],
        vocabExercises: [
            {
                id: 'e1',
                type: 'fill-blank',
                question: 'Social media companies earn most of their ___ from selling advertising space.',
                correctAnswer: 'revenue'
            },
            {
                id: 'e2',
                type: 'fill-blank',
                question: 'Users are often ___ videos selected by platforms based on their previous behavior.',
                correctAnswer: 'fed'
            },
            {
                id: 'e3',
                type: 'fill-blank',
                question: 'Many parents feel the ___ should be on companies to make platforms safer.',
                correctAnswer: 'onus'
            },
            {
                id: 'e4',
                type: 'fill-blank',
                question: 'Health experts are concerned about the impact of social media on ___.',
                correctAnswer: 'adolescents'
            },
            {
                id: 'e5',
                type: 'mcq',
                question: 'What does Professor Sridhar mean by being "fed content"?',
                options: [
                    'A) Choosing harmful content deliberately',
                    'B) Platform pushing content automatically',
                    'C) Sharing food-related content',
                    'D) Parents showing specific posts'
                ],
                correctAnswer: 'B'
            },
            {
                id: 'e6',
                type: 'mcq',
                question: 'Why is it "a losing battle" for parents?',
                options: [
                    'A) Parents don\'t care',
                    'B) Apps are too expensive',
                    'C) Social media is the child\'s entire social life',
                    'D) Government bans monitoring'
                ],
                correctAnswer: 'C'
            },
            {
                id: 'e7',
                type: 'mcq',
                question: 'Which sentence uses "revenue" correctly?',
                options: [
                    'A) Company revenue increased by 30%',
                    'B) She paid a revenue of $50',
                    'C) Server served revenue',
                    'D) He felt a revenue to visit'
                ],
                correctAnswer: 'A'
            },
            {
                id: 'e8',
                type: 'mcq',
                question: 'What is the role of an algorithm?',
                options: [
                    'A) Send private messages',
                    'B) Block all advertising',
                    'C) Decide what user sees',
                    'D) Count friends'
                ],
                correctAnswer: 'C'
            },
            {
                id: 'e9',
                type: 'mcq',
                question: 'Complete the collocation: place the ___ on companies.',
                options: ['A) battle', 'B) onus', 'C) revenue', 'D) algorithm'],
                correctAnswer: 'B'
            },
            {
                id: 'e10',
                type: 'mcq',
                question: 'Complete: generates most of its ___ revenue.',
                options: ['A) losing', 'B) adolescent', 'C) advertising', 'D) fed'],
                correctAnswer: 'C'
            },
            {
                id: 'e11-1',
                type: 'matching',
                question: 'A young person between 10 and 19 years old.',
                correctAnswer: 'adolescent'
            },
            {
                id: 'e11-2',
                type: 'matching',
                question: 'Given content automatically by a platform algorithm.',
                correctAnswer: 'fed'
            },
            {
                id: 'e11-3',
                type: 'matching',
                question: 'A complex set of computer rules that determines what you see.',
                correctAnswer: 'algorithm'
            },
            {
                id: 'e11-4',
                type: 'matching',
                question: 'The total income earned by a company, especially from ads.',
                correctAnswer: 'revenue'
            },
            {
                id: 'e11-5',
                type: 'matching',
                question: 'The responsibility or duty to do something difficult.',
                correctAnswer: 'onus'
            },
            {
                id: 'e11-6',
                type: 'matching',
                question: 'A struggle that is extremely unlikely to succeed.',
                correctAnswer: 'a losing battle'
            },
            {
                id: 'e12',
                type: 'mcq',
                question: 'Which sentence contains a vocabulary ERROR?',
                options: [
                    'A) Adolescents are vulnerable',
                    'B) Algorithm selects posts',
                    'C) Revenue fell sharply',
                    'D) Parents fighting an onus battle'
                ],
                correctAnswer: 'D'
            },
            {
                id: 'e13',
                type: 'mcq',
                question: 'Which sentence contains a vocabulary ERROR?',
                options: [
                    'A) Onus is on companies',
                    'B) Constantly being fed content',
                    'C) Earned impressive algorithms',
                    'D) Banning is a losing battle'
                ],
                correctAnswer: 'C'
            },
            {
                id: 'e14',
                type: 'fill-blank',
                question: 'The social media ___ noticed the user watched cooking videos.',
                correctAnswer: 'algorithm'
            }
        ],
        summaryPrompt: 'Discuss the impact of social media on adolescent mental health as described in the video. Mention the role of algorithms and who bears the responsibility for addressing these issues.',
        summaryMinWords: 150
    },
    {
        id: 'fast-fashion',
        title: 'Could you give up fast fashion?',
        thumbnail: 'https://img.youtube.com/vi/3-icphihD6Y/maxresdefault.jpg',
        duration: '6:12',
        category: 'Lifestyle',
        description: 'Is it possible to stop buying new clothes every week? Discover the impact of the fashion industry and how to be more sustainable.',
        embedUrl: 'https://www.youtube.com/embed/3-icphihD6Y?si=vUbZtotp6FSyG26I',
        comprehensionQuestions: [
            {
                id: 'q1',
                type: 'tfng',
                question: 'The programme says that the average number of times a person wears an item of clothing is just seven.',
                correctAnswer: 'True',
                explanation: 'Georgina says: "I\'ve heard the average time someone wears something is just seven!" This directly matches the statement.'
            },
            {
                id: 'q2',
                type: 'tfng',
                question: 'According to the programme, clothes in the UK have become more expensive because they are now produced in developing countries.',
                correctAnswer: 'False',
                explanation: 'The programme states the opposite. Lauren Bravo explains that because production was outsourced to developing countries, clothes have become "cheaper and cheaper and cheaper."'
            },
            {
                id: 'q3',
                type: 'tfng',
                question: 'Lauren Bravo says that fast fashion companies deliberately use low-quality materials to make clothes fall apart quickly.',
                correctAnswer: 'Not Given',
                explanation: 'Lauren discusses price undercutting and outsourcing, but never mentions deliberate use of low-quality materials or making clothes fall apart on purpose.'
            },
            {
                id: 'q4',
                type: 'tfng',
                question: 'The programme states that fibre fragments from washed clothing are flowing into the sea.',
                correctAnswer: 'True',
                explanation: 'Neil says: "fibre fragments are flowing into the sea when clothes are washed." This is mentioned as one of the environmental problems caused by fast fashion.'
            },
            {
                id: 'q5',
                type: 'tfng',
                question: 'Neil says he buys new shirts every year to keep up with current fashion trends.',
                correctAnswer: 'False',
                explanation: 'Neil says the opposite: "I for one am wearing the same shirt I bought seven years ago."'
            },
            {
                id: 'q6',
                type: 'mcq',
                question: 'According to Lauren Bravo, what does the expression "chasing the cheapest needle" mean?',
                options: [
                    'A) Fashion designers are searching for the best sewing equipment',
                    'B) The fashion industry constantly looks for companies that can produce clothes at the lowest cost',
                    'C) Consumers are looking for the cheapest clothes in shops',
                    'D) Developing countries are competing to produce the highest quality clothing'
                ],
                correctAnswer: 'B',
                explanation: 'Lauren explains: "the fashion industry constantly looking to undercut competitors, and with that clothes getting cheaper and cheaper."'
            },
            {
                id: 'q7',
                type: 'mcq',
                question: 'According to Lauren Bravo, what is the main reason people feel they cannot wear the same outfit twice?',
                options: [
                    'A) Clothes are made with poor quality materials that wear out quickly',
                    'B) Fashion magazines publish new style guides every week',
                    'C) Social media creates pressure to be seen in new clothes constantly',
                    'D) Shops only sell new styles each season'
                ],
                correctAnswer: 'C',
                explanation: 'Lauren says: "that feeling that you can\'t be seen in the same thing twice, it really stems from social media, particularly."'
            },
            {
                id: 'q8',
                type: 'mcq',
                question: 'How many items of clothing were sent to landfill in the UK in 2017?',
                options: [
                    'A) 23 million items',
                    'B) 234 million items',
                    'C) 2.3 billion items',
                    'D) 1.2 billion items'
                ],
                correctAnswer: 'B',
                explanation: 'Georgina reveals: "It\'s actually 234 million items вЂ” that\'s according to the Enviro Audit Committee."'
            },
            {
                id: 'q9',
                type: 'mcq',
                question: 'What does Lauren Bravo mean when she says buying new things has become "a trend in itself"?',
                options: [
                    'A) People only buy clothes that are currently fashionable',
                    'B) The act of buying something new has become more important than what you actually buy',
                    'C) New trends change too quickly for people to follow',
                    'D) Teenagers set all the fashion trends'
                ],
                correctAnswer: 'B',
                explanation: 'Lauren means that for certain generations, the experience of purchasing something new is what matters most.'
            },
            {
                id: 'q10',
                type: 'mcq',
                question: 'What does the programme describe as a "backlash" against fast fashion?',
                options: [
                    'A) People are protesting outside clothing shops',
                    'B) Governments are banning fast fashion companies',
                    'C) People are promising to buy second-hand clothes, repair what they have, and stop buying new things unnecessarily',
                    'D) Fashion magazines are refusing to advertise cheap clothing'
                ],
                correctAnswer: 'C',
                explanation: 'Georgina says: "Some people are now promising to buy second-hand clothes, or \'vintage clothes\', or make do with the clothes they have and mend the ones they need."'
            }
        ],
        vocabulary: [
            {
                id: 'v1',
                word: 'pledge',
                partOfSpeech: 'verb / noun',
                definition: 'To make a public promise to do something. As a noun, a pledge is the promise itself.',
                example: 'Thousands of people have pledged to buy no new clothes this year.',
                tip: 'Commonly used in formal contexts or environmental movements.',
                tipType: 'both',
                speakingExample: 'I actually made a pledge at the beginning of this year to stop buying fast fashion. It was really difficult at first because I was so used to picking up cheap t-shirts.',
                writingExample: 'In recent years, a growing number of consumers have pledged to reduce their consumption of fast fashion, driven by increasing awareness of environmental damage.',
                collocations: ['pledge to do something', 'make a pledge', 'fulfil a pledge', 'public pledge', 'pledge support'],
                synonyms: ['promise', 'vow', 'commit', 'guarantee']
            },
            {
                id: 'v2',
                word: 'outsource',
                partOfSpeech: 'verb',
                definition: 'To give work previously done within a company to another company, often in a different country, to reduce costs.',
                example: 'Most major fashion brands outsource their production to factories in countries where labour costs are lower.',
                tip: 'Key term for business, economics, and globalization topics.',
                tipType: 'both',
                speakingExample: 'A lot of big clothing companies outsource their manufacturing to countries like Bangladesh because labour is much cheaper there.',
                writingExample: 'The decision to outsource manufacturing to developing nations has enabled fashion companies to reduce production costs dramatically.',
                collocations: ['outsource production', 'outsource work', 'outsource jobs', 'outsource overseas'],
                synonyms: ['contract out', 'subcontract', 'offshore']
            },
            {
                id: 'v3',
                word: 'undercut',
                partOfSpeech: 'verb',
                definition: 'To offer goods or services at a lower price than a competitor, making it difficult for them to compete.',
                example: 'Factories in developing countries can undercut local manufacturers because their operating costs are lower.',
                tip: 'Useful for discussing competition and market dynamics.',
                tipType: 'both',
                speakingExample: 'The problem with fast fashion is that companies are always trying to undercut each other. It\'s a race to the bottom.',
                writingExample: 'The fashion industry\'s relentless drive to undercut competitors has led to a continuous decline in garment prices.',
                collocations: ['undercut competitors', 'undercut prices', 'undercut the market'],
                synonyms: ['underprice', 'undersell', 'charge less than']
            },
            {
                id: 'v4',
                word: 'stem from',
                partOfSpeech: 'phrasal verb',
                definition: 'To be caused by something; to have something as the origin or root cause.',
                example: 'The pressure to constantly buy new outfits stems from social media.',
                tip: 'A sophisticated way to describe cause and effect.',
                tipType: 'both',
                speakingExample: 'I think a lot of the anxiety young people feel about their appearance stems from social media.',
                writingExample: 'The rapid growth of fast fashion stems from a combination of factors, including the outsourcing of production and the influence of social media.',
                collocations: ['stems from social media', 'stems from a lack of', 'problem stems from'],
                synonyms: ['is caused by', 'originates from', 'is rooted in']
            },
            {
                id: 'v5',
                word: 'illogical',
                partOfSpeech: 'adjective',
                definition: 'Not reasonable or sensible; driven by emotions rather than practical thinking.',
                example: 'Buying a new outfit just for one photo seems completely illogical.',
                tip: 'Use to criticize behavior that doesn\'t make sense.',
                tipType: 'both',
                speakingExample: 'I know it sounds illogical, but I used to buy clothes that I never even wore. It was completely driven by emotion.',
                writingExample: 'While the practice of purchasing garments solely for a single social media photograph may appear illogical, it reflects a broader cultural shift.',
                collocations: ['seems illogical', 'completely illogical', 'illogical behaviour', 'illogical decision'],
                synonyms: ['irrational', 'unreasonable', 'senseless']
            },
            {
                id: 'v6',
                word: 'backlash',
                partOfSpeech: 'noun',
                definition: 'A strong negative reaction from a large number of people against something that has happened or a recent trend.',
                example: 'The growing backlash against fast fashion has led many consumers to switch to second-hand clothing.',
                tip: 'Perfect for tasks about societal trends or public opinion.',
                tipType: 'both',
                speakingExample: 'There\'s been a real backlash against fast fashion in the last few years, especially among younger people.',
                writingExample: 'The increasing backlash against the fast fashion industry has manifested in various forms, from consumer boycotts to the growth of second-hand platforms.',
                collocations: ['backlash against', 'public backlash', 'growing backlash', 'face a backlash'],
                synonyms: ['reaction', 'resistance', 'opposition', 'pushback']
            },
            {
                id: 'v7',
                word: 'landfill',
                partOfSpeech: 'noun',
                definition: 'A site where waste is buried under the ground.',
                example: 'Hundreds of millions of clothing items are sent to landfill every year.',
                tip: 'Essential vocabulary for environmental and pollution topics.',
                tipType: 'both',
                speakingExample: 'What really shocked me was learning how many clothes end up in landfill every year. We\'re talking about hundreds of millions.',
                writingExample: 'The volume of textile waste sent to landfill each year has reached alarming levels, with many garments containing synthetic fibres that take centuries to decompose.',
                collocations: ['sent to landfill', 'end up in landfill', 'landfill site', 'landfill waste'],
                synonyms: ['dump', 'waste site', 'rubbish tip']
            }
        ],
        vocabExercises: [
            {
                id: 'e1',
                type: 'fill-blank',
                question: 'The fashion company decided to ___ its manufacturing to Vietnam because production costs there were 60% lower.',
                correctAnswer: 'outsource'
            },
            {
                id: 'e2',
                type: 'fill-blank',
                question: 'Our obsession with buying cheap clothes ___ ___ the pressure we feel on social media to always look different.',
                correctAnswer: 'stems from'
            },
            {
                id: 'e3',
                type: 'fill-blank',
                question: 'There has been a growing ___ against fast fashion, with many young consumers choosing to buy second-hand instead.',
                correctAnswer: 'backlash'
            },
            {
                id: 'e4',
                type: 'fill-blank',
                question: 'Every year, hundreds of millions of clothing items are sent to ___, where they take decades to decompose.',
                correctAnswer: 'landfill'
            },
            {
                id: 'e5',
                type: 'mcq',
                question: 'In the podcast, Lauren Bravo says the fashion industry is always "chasing the cheapest needle." She means that companies constantly try to ___ their competitors.',
                options: ['A) outsource', 'B) pledge', 'C) undercut', 'D) backlash'],
                correctAnswer: 'C'
            },
            {
                id: 'e6',
                type: 'mcq',
                question: 'Lauren says people\'s desire to never be seen in the same outfit twice "stems from social media." What does "stems from" mean?',
                options: ['A) Is prevented by', 'B) Is caused by', 'C) Is unrelated to', 'D) Is improved by'],
                correctAnswer: 'B'
            },
            {
                id: 'e7',
                type: 'mcq',
                question: 'Which sentence uses "pledge" CORRECTLY?',
                options: [
                    'A) The mayor pledged to reduce textile waste in the city by 50% within five years.',
                    'B) She pledged her car to work every morning.',
                    'C) The students pledged their homework to the teacher.',
                    'D) He pledged the door open with a heavy book.'
                ],
                correctAnswer: 'A'
            },
            {
                id: 'e8',
                type: 'mcq',
                question: 'The programme describes buying new clothes just for one Instagram photo as "illogical." What does this mean?',
                options: [
                    'A) Very fashionable and trendy',
                    'B) Extremely expensive and unaffordable',
                    'C) Not reasonable or sensible',
                    'D) Illegal and against the law'
                ],
                correctAnswer: 'C'
            },
            {
                id: 'e9',
                type: 'mcq',
                question: 'Complete the collocation: The company faced a huge public ___ after workers were found to be underpaid.',
                options: ['A) pledge', 'B) landfill', 'C) backlash', 'D) outsource'],
                correctAnswer: 'C'
            },
            {
                id: 'e10',
                type: 'mcq',
                question: 'Complete the collocation: Over 300 million tonnes of plastic waste ___ up in landfill every year.',
                options: ['A) end', 'B) stem', 'C) pledge', 'D) undercut'],
                correctAnswer: 'A'
            },
            {
                id: 'e11-1',
                type: 'matching',
                question: 'A firm promise or agreement to do something.',
                correctAnswer: 'pledge'
            },
            {
                id: 'e11-2',
                type: 'matching',
                question: 'To pay to have part of a companyвЂ™s work done by another company.',
                correctAnswer: 'outsource'
            },
            {
                id: 'e11-3',
                type: 'matching',
                question: 'To sell goods or services at a lower price than your competitors.',
                correctAnswer: 'undercut'
            },
            {
                id: 'e11-4',
                type: 'matching',
                question: 'To be caused by something or start from something.',
                correctAnswer: 'stem from'
            },
            {
                id: 'e11-5',
                type: 'matching',
                question: 'Not sensible or reasonable; not following the rules of logic.',
                correctAnswer: 'illogical'
            },
            {
                id: 'e11-6',
                type: 'matching',
                question: 'A strong negative reaction by a large number of people.',
                correctAnswer: 'backlash'
            },
            {
                id: 'e11-7',
                type: 'matching',
                question: 'An area of land where large amounts of waste material are buried.',
                correctAnswer: 'landfill'
            },
            {
                id: 'e12',
                type: 'mcq',
                question: 'Which sentence contains a vocabulary ERROR?',
                options: [
                    'A) The rise in online shopping stems from convenience.',
                    'B) Several celebrities have pledged to stop promoting fast fashion.',
                    'C) The new factory was able to undercut local businesses.',
                    'D) Many consumers feel a strong backlash to buy latest trends.'
                ],
                correctAnswer: 'D'
            },
            {
                id: 'e13',
                type: 'mcq',
                question: 'Which sentence contains a vocabulary ERROR?',
                options: [
                    'A) The brand outsourced production to Bangladesh.',
                    'B) It seems completely illogical to throw away a good jacket.',
                    'C) She outsourced her opinion during discussion.',
                    'D) 234 million items were sent to landfill.'
                ],
                correctAnswer: 'C'
            },
            {
                id: 'e14',
                type: 'fill-blank',
                question: 'Buying a brand new dress just to wear it once for a photograph and then throwing it away is completely ___.',
                correctAnswer: 'illogical'
            }
        ],
        summaryPrompt: 'Summarize the main arguments for and against fast fashion as discussed in the video. What are some ways consumers can become more sustainable?',
        summaryMinWords: 150
    },
    {
        id: 'cities-future',
        title: 'Cities of the future',
        thumbnail: 'https://img.youtube.com/vi/3kS0cMziUJY/maxresdefault.jpg',
        duration: '6:00',
        category: 'Technology',
        description: 'How will we live in the cities of tomorrow? Explore urban planning, smart technology, and sustainable living in future metropolises.',
        embedUrl: 'https://www.youtube.com/embed/3kS0cMziUJY?si=JvBm9-qF9eBPcxId',
        comprehensionQuestions: [
            {
                id: 'q1',
                type: 'tfng',
                question: "According to a United Nations report mentioned in the programme, more than half of the world's population currently lives in cities.",
                correctAnswer: 'True',
                explanation: 'Alice says: "today 54% of the world\'s population lives in urban areas." 54% is more than half.'
            },
            {
                id: 'q2',
                type: 'tfng',
                question: 'The programme says that Copenhagen has serious air pollution problems similar to Beijing.',
                correctAnswer: 'False',
                explanation: 'Copenhagen is described as having "clean air", whereas Beijing is described as having "constant smog or air pollution".'
            },
            {
                id: 'q3',
                type: 'tfng',
                question: 'Dr Janice Perlman says that informal communities built on unoccupied land are shrinking in size in Brazilian cities.',
                correctAnswer: 'False',
                explanation: 'Dr Perlman says: "these communities are becoming in some places the majority not the minority." They are growing.'
            },
            {
                id: 'q4',
                type: 'tfng',
                question: 'The programme states that Los Angeles has already solved its traffic and urban sprawl problems using smart city technology.',
                correctAnswer: 'False',
                explanation: 'The programme says "today\'s Los Angeles has terrible urban sprawl and traffic problems," implying they are not yet solved.'
            },
            {
                id: 'q5',
                type: 'tfng',
                question: 'John Rossant believes that smart city technology will only benefit wealthy developed nations, not cities in the developing world.',
                correctAnswer: 'False',
                explanation: 'John Rossant says technology "will transform our cities whether they\'re in the global south or the developed world."'
            },
            {
                id: 'q6',
                type: 'mcq',
                question: 'According to Dr Janice Perlman, why do people in Brazilian cities end up building their own houses on unoccupied land?',
                options: [
                    'A) Because they prefer to design their own homes',
                    'B) Because there is no housing available that they can afford to rent or buy',
                    'C) Because the government gives them free land to build on',
                    'D) Because they want to live outside the city centre'
                ],
                correctAnswer: 'B',
                explanation: 'Dr Perlman explains that people end up building their own communities because they can\'t afford to rent or buy existing housing.'
            },
            {
                id: 'q7',
                type: 'mcq',
                question: 'What does the programme mean when it says informal communities are "off the grid"?',
                options: [
                    'A) They are located far from the city centre',
                    'B) They are built in a grid pattern',
                    'C) They do not have access to basic services like electricity, water, or healthcare',
                    'D) They are not shown on city maps'
                ],
                correctAnswer: 'C',
                explanation: 'The programme explains that "off the grid" refers to a lack of water, sanitation, and electricity.'
            },
            {
                id: 'q8',
                type: 'mcq',
                question: 'According to the programme, what does improving urban infrastructure involve?',
                options: [
                    'A) Only building better roads and highways',
                    'B) Improving housing, communication, transport, water, electricity, education, and employment',
                    'C) Demolishing informal communities and replacing them with modern apartments',
                    'D) Moving people from cities back to rural areas'
                ],
                correctAnswer: 'B',
                explanation: 'Infrastructure refers to basic facilities like communication and transport, but also includes education and employment.'
            },
            {
                id: 'q9',
                type: 'mcq',
                question: 'What is the idea behind "smart cities" as described by John Rossant?',
                options: [
                    'A) Cities where only smart people are allowed to live',
                    'B) Cities that ban all cars and use only bicycles',
                    'C) Cities that use technology and data to improve how they function',
                    'D) Cities that are designed entirely by artificial intelligence'
                ],
                correctAnswer: 'C',
                explanation: 'Smart cities use technologies like cloud computing and 5G to collect data and improve city performance.'
            },
            {
                id: 'q10',
                type: 'mcq',
                question: "According to the programme, what percentage of the world's population is expected to live in cities by 2050?",
                options: ['A) 10%', 'B) 50%', 'C) 54%', 'D) 70%'],
                correctAnswer: 'D',
                explanation: 'Alice reveals the answer is 70%, according to a UN report.'
            }
        ],
        vocabulary: [
            {
                id: 'v1',
                word: 'congested',
                partOfSpeech: 'adjective',
                definition: 'So crowded with traffic or people that movement is difficult or impossible.',
                example: "The city's roads are so congested during rush hour.",
                tip: 'Useful for topics related to traffic and overpopulation.',
                tipType: 'both',
                speakingExample: "The traffic in my city is absolutely terrible... The main roads get so congested that sometimes I just walk.",
                writingExample: "Heavily congested urban roads not only waste commuters' time but also contribute significantly to air pollution.",
                collocations: ['congested roads', 'congested streets', 'heavily congested', 'congested traffic'],
                synonyms: ['overcrowded', 'blocked', 'jammed', 'gridlocked']
            },
            {
                id: 'v2',
                word: 'urban sprawl',
                partOfSpeech: 'noun (uncountable)',
                definition: 'The uncontrolled expansion of a city into the surrounding countryside.',
                example: 'Los Angeles is often cited as a classic example of urban sprawl.',
                tip: 'A high-level term for environmental and urban development essays.',
                tipType: 'writing',
                speakingExample: "One of the biggest problems in my city is urban sprawl. The city just keeps expanding outwards.",
                writingExample: "Unchecked urban sprawl places enormous strain on a city's infrastructure.",
                collocations: ['prevent urban sprawl', 'control urban sprawl', 'problem of urban sprawl'],
                synonyms: ['suburban spread', 'city expansion', 'unplanned growth']
            },
            {
                id: 'v3',
                word: 'migrate',
                partOfSpeech: 'verb',
                definition: 'To move from one place to another, especially from the countryside to a city.',
                example: 'Millions of people migrate from rural areas to cities every year.',
                tip: 'Fundamental for discussing demography and social changes.',
                tipType: 'both',
                speakingExample: "In my country, a lot of young people migrate from small villages to big cities like the capital.",
                writingExample: "As increasing numbers of people migrate from rural regions to urban centres... cities face mounting pressure.",
                collocations: ['migrate to cities', 'migrate from rural areas', 'people migrate', 'workers migrate'],
                synonyms: ['move', 'relocate', 'resettle']
            },
            {
                id: 'v4',
                word: 'shanty town',
                partOfSpeech: 'noun',
                definition: 'A poor area on the edge of a city where people live in roughly built houses made from cheap materials.',
                example: 'Rapid migration has led to the growth of shanty towns on the outskirts.',
                tip: 'Use when discussing poverty, social inequality, or urban challenges.',
                tipType: 'both',
                speakingExample: "I watched a documentary about shanty towns... Despite having no running water, they've built entire communities.",
                writingExample: "The proliferation of shanty towns... reflects a fundamental failure of urban planning.",
                collocations: ['live in a shanty town', 'shanty town residents', 'urban shanty towns'],
                synonyms: ['slum', 'informal settlement', 'favela']
            },
            {
                id: 'v5',
                word: 'off the grid',
                partOfSpeech: 'phrase',
                definition: 'Not connected to or served by public utilities such as electricity or water.',
                example: 'Many informal communities are completely off the grid.',
                tip: 'Effective for talking about energy and basic rights.',
                tipType: 'both',
                speakingExample: "Whole neighbourhoods were completely off the grid. They had no electricity, no running water.",
                writingExample: "Communities that exist off the grid face a double disadvantage... they are also frequently excluded from social programmes.",
                collocations: ['live off the grid', 'communities off the grid', 'go off the grid'],
                synonyms: ['disconnected', 'unserviced', 'without utilities']
            },
            {
                id: 'v6',
                word: 'infrastructure',
                partOfSpeech: 'noun (uncountable)',
                definition: 'The basic physical and organisational systems that a city or country needs in order to function.',
                example: 'The government has committed to investing $50 billion in infrastructure.',
                tip: 'A very common academic word in IELTS.',
                tipType: 'both',
                speakingExample: "I think the most important thing a government can do... is invest in infrastructure.",
                writingExample: "Sustained investment in urban infrastructure is essential for accommodating population growth.",
                collocations: ['basic infrastructure', 'transport infrastructure', 'improve infrastructure'],
                synonyms: ['facilities', 'systems', 'framework']
            },
            {
                id: 'v7',
                word: 'ubiquitous',
                partOfSpeech: 'adjective',
                definition: 'Found or present everywhere; extremely widespread and common.',
                example: 'Smartphones have become ubiquitous in modern life.',
                tip: 'An excellent band 7+ word to describe widespread technology or trends.',
                tipType: 'both',
                speakingExample: "Smartphones are completely ubiquitous now... Everywhere you look, people are staring at screens.",
                writingExample: "The ubiquitous availability of high-speed internet... has created unprecedented opportunities.",
                collocations: ['ubiquitous internet', 'ubiquitous technology', 'increasingly ubiquitous'],
                synonyms: ['everywhere', 'omnipresent', 'widespread']
            },
            {
                id: 'v8',
                word: 'game changer',
                partOfSpeech: 'noun',
                definition: 'Something that significantly affects or transforms the way things are done.',
                example: 'Smart city technology could be a real game changer.',
                tip: 'A great idiomatic expression for speaking and some writing types.',
                tipType: 'both',
                speakingExample: "I honestly think electric cars are going to be a real game changer for cities.",
                writingExample: "The integration of artificial intelligence... has the potential to be a game changer for cities worldwide.",
                collocations: ['real game changer', 'potential game changer', 'prove to be a game changer'],
                synonyms: ['breakthrough', 'turning point', 'revolution']
            }
        ],
        vocabExercises: [
            {
                id: 'e1',
                type: 'fill-blank',
                question: "The city's main roads are heavily ___ during morning rush hour.",
                correctAnswer: 'congested'
            },
            {
                id: 'e2',
                type: 'fill-blank',
                question: 'Every year, millions of workers ___ from rural villages to large cities.',
                correctAnswer: 'migrate'
            },
            {
                id: 'e3',
                type: 'fill-blank',
                question: 'The informal community on the edge of the city was completely ___ ___ ___ ___ .',
                correctAnswer: 'off the grid'
            },
            {
                id: 'e4',
                type: 'fill-blank',
                question: 'The government announced a major investment in transport ___ .',
                correctAnswer: 'infrastructure'
            },
            {
                id: 'e5',
                type: 'mcq',
                question: 'Alice says that Los Angeles has "terrible urban sprawl." What does this mean?',
                options: [
                    'A) Many tall buildings in centre',
                    'B) Expanded outwards in an uncontrolled way',
                    'C) Too many parks',
                    'D) Efficient public transport'
                ],
                correctAnswer: 'B'
            },
            {
                id: 'e6',
                type: 'mcq',
                question: 'John Rossant describes technology as "a game changer." What does he mean?',
                options: [
                    'A) Life more entertaining',
                    'B) Fundamentally transform how cities are designed',
                    'C) Play more video games',
                    'D) No effect'
                ],
                correctAnswer: 'B'
            },
            {
                id: 'e7',
                type: 'mcq',
                question: 'Which sentence uses "ubiquitous" CORRECTLY?',
                options: [
                    'A) Served a delicious ubiquitous.',
                    'B) Coffee shops have become ubiquitous in major cities.',
                    'C) She ubiquitous walked to office.',
                    'D) Team played a ubiquitous match.'
                ],
                correctAnswer: 'B'
            },
            {
                id: 'e8',
                type: 'mcq',
                question: 'What is the main consequence of being "off the grid"?',
                options: [
                    'A) Quiet and peaceful',
                    'B) No access to basic services like water and electricity',
                    'C) Hidden from satellites',
                    'D) No rent needed'
                ],
                correctAnswer: 'B'
            },
            {
                id: 'e9',
                type: 'mcq',
                question: 'Complete: The government needs to invest in ___ infrastructure.',
                options: ['A) transport', 'B) congested', 'C) sprawl', 'D) shanty'],
                correctAnswer: 'A'
            },
            {
                id: 'e10',
                type: 'mcq',
                question: 'Complete: Uncontrolled ___ sprawl has destroyed farmland.',
                options: ['A) grid', 'B) migration', 'C) urban', 'D) infrastructure'],
                correctAnswer: 'C'
            },
            {
                id: 'e11-1',
                type: 'matching',
                question: 'Found everywhere, extremely widespread.',
                correctAnswer: 'ubiquitous'
            },
            {
                id: 'e11-2',
                type: 'matching',
                question: 'Something that significantly transforms the way things are done.',
                correctAnswer: 'game changer'
            },
            {
                id: 'e11-3',
                type: 'matching',
                question: 'So crowded that movement is difficult.',
                correctAnswer: 'congested'
            },
            {
                id: 'e11-4',
                type: 'matching',
                question: 'The basic systems a city needs to function such as transport and water.',
                correctAnswer: 'infrastructure'
            },
            {
                id: 'e11-5',
                type: 'matching',
                question: 'The uncontrolled spread of a city into surrounding countryside.',
                correctAnswer: 'urban sprawl'
            },
            {
                id: 'e11-6',
                type: 'matching',
                question: 'To move from one place to another in search of better opportunities.',
                correctAnswer: 'migrate'
            },
            {
                id: 'e11-7',
                type: 'matching',
                question: 'A poor area with houses built from cheap materials.',
                correctAnswer: 'shanty town'
            },
            {
                id: 'e11-8',
                type: 'matching',
                question: 'Not connected to public utilities like electricity and water.',
                correctAnswer: 'off the grid'
            },
            {
                id: 'e12',
                type: 'mcq',
                question: 'Which sentence contains a vocabulary ERROR?',
                options: [
                    'A) People migrate to cities.',
                    'B) Roads are heavily congested.',
                    'C) Build new infrastructure.',
                    'D) Urban sprawl is a game changer that cities must encourage.'
                ],
                correctAnswer: 'D'
            },
            {
                id: 'e13',
                type: 'mcq',
                question: 'Which sentence contains a vocabulary ERROR?',
                options: [
                    'A) Smartphones ubiquitous.',
                    'B) Lived off the grid.',
                    'C) Reduce congested in centre.',
                    'D) Real game changer.'
                ],
                correctAnswer: 'C'
            },
            {
                id: 'e14',
                type: 'fill-blank',
                question: 'Families living in shelters built from cheap materials often end up in ___ ___ .',
                correctAnswer: 'shanty towns'
            }
        ],
        summaryPrompt: 'Describe how technology and sustainability might shape the cities of the future according to the video. What are the potential benefits and drawbacks?',
        summaryMinWords: 150
    },
    {
        id: 'university-worth',
        title: 'Is it still worth going to university?',
        thumbnail: 'https://img.youtube.com/vi/_O48-ao5_40/maxresdefault.jpg',
        duration: '7:15',
        category: 'Economics',
        description: 'Is a university degree still the golden ticket to a successful career? Explore how AI and a changing job market are affecting the value of higher education.',
        embedUrl: 'https://www.youtube.com/embed/_O48-ao5_40?si=6Y4ak03zak_e5KLj',
        comprehensionQuestions: [
            {
                id: 'q1',
                type: 'tfng',
                question: 'The programme states that the unemployment gap between young graduates and young people without degrees in America has become much smaller in recent years.',
                correctAnswer: 'True',
                explanation: 'The programme says: "In 2010 there was around a six percentage-point difference in unemployment between young people and young graduates. But now there\'s just a one percentage-point difference between them." The gap has shrunk from six points to one.'
            },
            {
                id: 'q2',
                type: 'tfng',
                question: 'According to the programme, universities in America have been deliberately lowering their teaching quality to save money.',
                correctAnswer: 'Not Given',
                explanation: 'The programme mentions one theory that "universities are accepting less-talented applicants, and then they aren\'t teaching them very well." However, it does not say this is being done deliberately to save money. It is presented as a theory, not a fact, and no motivation is given.'
            },
            {
                id: 'q3',
                type: 'tfng',
                question: 'The programme says that AI and ChatGPT are the main causes of the decline in graduate jobs.',
                correctAnswer: 'False',
                explanation: 'The programme says the opposite: "It\'s tempting to blame AI for these waning opportunities. Yet the decline in graduate jobs started long before ChatGPT." It explicitly says AI is NOT the main cause.'
            },
            {
                id: 'q4',
                type: 'tfng',
                question: 'The number of Americans enrolled in bachelor\'s programmes increased by 5% between 2013 and 2022.',
                correctAnswer: 'False',
                explanation: 'The programme says: "The number of Americans enrolled in bachelor\'s programmes fell by 5% from 2013вЂ“2022." It fell, not increased.'
            },
            {
                id: 'q5',
                type: 'tfng',
                question: 'The programme suggests that journalism is a subject with strong employment prospects for graduates.',
                correctAnswer: 'False',
                explanation: 'The programme mentions journalism with the word "inexplicably" вЂ” meaning it is surprising and hard to explain that students are still choosing it. The tone suggests journalism does NOT have strong prospects.'
            },
            {
                id: 'q6',
                type: 'mcq',
                question: 'According to the programme, what is happening to graduate-level jobs in industries like finance and law?',
                options: [
                    'A) They are growing rapidly because of new technology',
                    'B) They are decreasing in number',
                    'C) They are moving from Europe to America',
                    'D) They are being replaced entirely by AI systems'
                ],
                correctAnswer: 'B',
                explanation: 'The programme states: "the number of 15-to-24-year-olds who are employed in finance and insurance fell by 16% from 2009вЂ“2024" and "the number of British twentysomethings in law and finance has fallen by 10%."'
            },
            {
                id: 'q7',
                type: 'mcq',
                question: 'Why are university enrolment numbers still rising in most rich countries outside America?',
                options: [
                    'A) Because these countries have more universities',
                    'B) Because education is cheaper as the state plays a larger role in funding it',
                    'C) Because employers in these countries require degrees for every job',
                    'D) Because these countries have higher unemployment rates'
                ],
                correctAnswer: 'B',
                explanation: 'The programme says: "in most rich countries, where education is cheaper because the state plays a larger role, young people are still applying to universities in droves."'
            },
            {
                id: 'q8',
                type: 'mcq',
                question: 'According to the programme, what types of skills are most likely to remain valuable as AI improves?',
                options: [
                    'A) Coding and computer programming',
                    'B) Skills in finance and banking',
                    'C) Soft skills like communication, critical thinking, empathy, and building relationships',
                    'D) Skills in manufacturing and factory work'
                ],
                correctAnswer: 'C',
                explanation: 'The programme says: "what\'s more important for students than studying a specific subject is to focus on learning soft skills instead. Things like communication, critical thinking and reliability, as well as empathy and being able to build relationships."'
            },
            {
                id: 'q9',
                type: 'mcq',
                question: 'What did research find about graduates who completed internships before graduating in 2022?',
                options: [
                    'A) They earned 23% higher salaries than other graduates',
                    'B) They were 23% more likely to start a full-time position within six months of graduation',
                    'C) They were 23% more likely to continue to postgraduate study',
                    'D) They were 23% less likely to leave their first job'
                ],
                correctAnswer: 'B',
                explanation: 'The programme states: "those who graduated in 2022 and completed internships were 23% more likely to start a full-time position within six months of graduation."'
            },
            {
                id: 'q10',
                type: 'mcq',
                question: 'According to the programme, which types of practical jobs are less likely to be replaced by AI?',
                options: [
                    'A) Banking and accounting',
                    'B) Journalism and social media',
                    'C) Plumbing and carpentry',
                    'D) Data entry and administration'
                ],
                correctAnswer: 'C',
                explanation: 'The programme says: "practical jobs, like plumbing and carpentry, are less likely to be taken over by AI and will remain valued by society."'
            }
        ],
        vocabulary: [
            {
                id: 'v1',
                word: 'employment opportunities',
                partOfSpeech: 'noun phrase',
                definition: 'The availability of jobs and chances to work, particularly in a specific field, area, or for a specific group of people.',
                example: 'Despite holding a master\'s degree in literature, Maria found very few employment opportunities in her field and eventually retrained as a data analyst.',
                tip: 'Use this phrase for both speaking and writing to discuss job markets.',
                tipType: 'both',
                speakingExample: 'One of the main reasons people move from small towns to big cities in my country is the lack of employment opportunities in rural areas. There are simply no factories, offices, or businesses to work for, so young people have no choice but to move somewhere with more options.',
                writingExample: 'Governments seeking to reduce youth unemployment should focus on creating employment opportunities in emerging industries such as renewable energy and digital technology, rather than relying solely on traditional sectors that are in decline.',
                collocations: ['limited employment opportunities', 'create employment opportunities', 'employment opportunities for graduates', 'lack of employment opportunities', 'seek employment opportunities'],
                synonyms: ['job prospects', 'career openings', 'work opportunities', 'job availability']
            },
            {
                id: 'v2',
                word: 'tertiary education',
                partOfSpeech: 'noun phrase',
                definition: 'Education at university or college level, after completing secondary school. Includes bachelor\'s degrees, master\'s degrees, and other higher qualifications.',
                example: 'In many European countries, tertiary education is either free or heavily subsidised by the government, making it accessible to a much wider range of students.',
                tip: 'A high-level academic term for university-level study.',
                tipType: 'both',
                speakingExample: 'In my country, tertiary education is really expensive, and many students end up with huge debts that take them years to pay off. I think the government should do more to make university affordable, because right now it feels like higher education is only for people from wealthy families.',
                writingExample: 'While access to tertiary education has expanded considerably in recent decades, concerns remain about whether the quality of instruction has kept pace with the rapid increase in student numbers.',
                collocations: ['access to tertiary education', 'tertiary education institutions', 'complete tertiary education', 'enrolment in tertiary education', 'the cost of tertiary education'],
                synonyms: ['higher education', 'university education', 'post-secondary education']
            },
            {
                id: 'v3',
                word: 'qualifications',
                partOfSpeech: 'noun (plural)',
                definition: 'Official records of achievement, such as degrees, diplomas, or certificates, that show someone has completed a course of study or training and has the skills needed for a particular job.',
                example: 'Many employers now say they value practical experience as much as formal qualifications when choosing who to hire.',
                tip: 'Always plural in this context. Avoid saying "a qualification" when referring to academic credentials.',
                tipType: 'both',
                speakingExample: 'I think there\'s been a big shift in how employers view qualifications. Ten or fifteen years ago, you almost couldn\'t get a decent job without a university degree. But now, a lot of companies care more about what you can actually do than what piece of paper you have.',
                writingExample: 'The declining value of graduate-level qualifications in certain industries suggests that the labour market is increasingly rewarding practical competence and demonstrable skills over academic credentials alone.',
                collocations: ['graduate-level qualifications', 'professional qualifications', 'academic qualifications', 'formal qualifications', 'gain/obtain qualifications', 'required qualifications'],
                synonyms: ['credentials', 'certificates', 'degrees', 'certifications']
            },
            {
                id: 'v4',
                word: 'waning',
                partOfSpeech: 'adjective / verb',
                definition: 'Gradually decreasing in strength, importance, or size. Becoming weaker or less significant over time.',
                example: 'There is growing evidence of waning demand for graduates in traditional industries such as banking, insurance, and law.',
                tip: 'Often used with "interest", "demand", "influence", or "opportunities".',
                tipType: 'both',
                speakingExample: 'I\'ve noticed a waning interest in traditional degrees like law and finance among my friends. A lot of people my age are now more interested in learning practical skills like coding or digital marketing.',
                writingExample: 'The waning availability of graduate-level positions in established industries has prompted many young people to reconsider whether the financial investment required for a university education is justified by the likely returns.',
                collocations: ['waning interest', 'waning enthusiasm', 'waning influence', 'waning demand', 'waning opportunities'],
                synonyms: ['declining', 'diminishing', 'decreasing', 'fading', 'shrinking']
            },
            {
                id: 'v5',
                word: 'obsolete',
                partOfSpeech: 'adjective',
                definition: 'No longer useful or relevant because something newer or more effective has replaced it.',
                example: 'Some technology experts predict that certain programming languages will become obsolete within a decade as AI tools take over much of the coding process.',
                tip: 'Frequently used in discussions about technology, jobs, and the future.',
                tipType: 'both',
                speakingExample: 'I studied graphic design at university, and even during my three-year course, some of the software we learned in the first year had already become obsolete by the time we graduated.',
                writingExample: 'As artificial intelligence continues to advance, skills that were once considered essential, such as manual data analysis and basic programming, risk becoming obsolete, compelling workers to continuously update their expertise.',
                collocations: ['become obsolete', 'render something obsolete', 'skills becoming obsolete', 'virtually obsolete'],
                synonyms: ['outdated', 'outmoded', 'redundant', 'antiquated', 'old-fashioned']
            },
            {
                id: 'v6',
                word: 'soft skills',
                partOfSpeech: 'noun phrase',
                definition: 'Personal qualities and interpersonal abilities that help people interact effectively with others, such as communication, teamwork, critical thinking, empathy, adaptability, and problem-solving. Unlike technical skills, soft skills are transferable across all jobs and industries.',
                example: 'Employers increasingly report that graduates who possess strong soft skills such as communication and teamwork are more valuable than those with purely technical knowledge.',
                tip: 'Often contrasted with "hard skills" or "technical skills" in IELTS writing.',
                tipType: 'both',
                speakingExample: 'Honestly, I think the most useful things I learned at university weren\'t from lectures or textbooks. They came from group projects and presentations, where I had to learn how to communicate clearly, work with people I disagreed with, and manage my time properly.',
                writingExample: 'In an era of rapid technological change, the development of soft skills such as critical thinking, adaptability, and emotional intelligence is arguably more important than the acquisition of technical expertise.',
                collocations: ['develop soft skills', 'transferable soft skills', 'essential soft skills', 'soft skills training', 'value soft skills'],
                synonyms: ['interpersonal skills', 'people skills', 'transferable skills', 'human skills']
            },
            {
                id: 'v7',
                word: 'apprenticeship',
                partOfSpeech: 'noun',
                definition: 'A system of training where a person learns a practical skill or trade by working alongside an experienced professional, often while earning a wage, as an alternative to attending university.',
                example: 'Rather than going to university, James chose to do a plumbing apprenticeship and was earning a full salary within two years, while his university friends were still accumulating debt.',
                tip: 'A great alternative to "vocational training" in IELTS writing.',
                tipType: 'both',
                speakingExample: 'In my country, apprenticeships are becoming a lot more popular because people are starting to realise that not everyone needs to go to university. My cousin did an apprenticeship in electrical engineering straight after school, and he\'s already earning a really good salary.',
                writingExample: 'Expanding access to high-quality apprenticeship programmes would provide young people with an alternative pathway to skilled employment, reducing their reliance on expensive university degrees while simultaneously addressing critical labour shortages.',
                collocations: ['do/complete an apprenticeship', 'an apprenticeship programme', 'apprenticeship scheme', 'offer apprenticeships', 'start an apprenticeship'],
                synonyms: ['traineeship', 'vocational training', 'on-the-job training', 'work-based learning']
            },
            {
                id: 'v8',
                word: 'internship',
                partOfSpeech: 'noun',
                definition: 'A period of work experience, often temporary and sometimes unpaid, where a student or recent graduate works in a company to gain practical skills and professional connections in their chosen field.',
                example: 'Research shows that graduates who completed an internship during their studies were 23% more likely to secure full-time employment within six months of graduating.',
                tip: 'In IELTS speaking, sharing a personal internship story is a great way to give detail.',
                tipType: 'both',
                speakingExample: 'I did a three-month internship at a marketing agency during my second year at university, and it completely changed my perspective. I realised that the theoretical knowledge from lectures was only a small part of what I actually needed.',
                writingExample: 'The significant correlation between internship completion and subsequent employment success underscores the importance of integrating practical work experience into tertiary education programmes.',
                collocations: ['complete/do an internship', 'summer internship', 'paid/unpaid internship', 'internship programme', 'gain an internship'],
                synonyms: ['work placement', 'work experience', 'practicum', 'traineeship']
            }
        ],
        vocabExercises: [
            {
                id: 'e1',
                type: 'fill-blank',
                question: 'Many young graduates are finding that ___ ___ in traditional industries like banking and law are becoming increasingly scarce.',
                correctAnswer: 'employment opportunities'
            },
            {
                id: 'e2',
                type: 'fill-blank',
                question: 'Some experts predict that basic coding skills could become ___ within a few years as AI tools take over much of the programming process.',
                correctAnswer: 'obsolete'
            },
            {
                id: 'e3',
                type: 'fill-blank',
                question: 'Employers consistently say they value ___ ___ like communication, teamwork, and critical thinking more than specific technical knowledge.',
                correctAnswer: 'soft skills'
            },
            {
                id: 'e4',
                type: 'fill-blank',
                question: 'Rather than spending three years at university, she decided to do an ___ in electrical engineering, earning a wage while learning practical skills.',
                correctAnswer: 'apprenticeship'
            },
            {
                id: 'e5',
                type: 'mcq',
                question: 'The programme describes graduate job opportunities as "waning." What does this mean?',
                options: [
                    'A) They are growing rapidly',
                    'B) They are staying the same',
                    'C) They are gradually decreasing',
                    'D) They are becoming more competitive but still available'
                ],
                correctAnswer: 'C'
            },
            {
                id: 'e6',
                type: 'mcq',
                question: 'According to the programme, why are graduates who completed internships more successful at finding jobs?',
                options: [
                    'A) Because internships give them higher exam scores',
                    'B) Because internships provide practical work experience and professional connections that employers value',
                    'C) Because internships allow them to skip the final year of university',
                    'D) Because companies are legally required to hire their former interns'
                ],
                correctAnswer: 'B'
            },
            {
                id: 'e7',
                type: 'mcq',
                question: 'Which sentence uses "tertiary education" CORRECTLY?',
                options: [
                    'A) My son is in tertiary education at his local primary school.',
                    'B) The government has increased funding for tertiary education, including universities and vocational colleges.',
                    'C) She completed her tertiary education at the age of twelve.',
                    'D) Tertiary education refers to the first three years of a child\'s schooling.'
                ],
                correctAnswer: 'B'
            },
            {
                id: 'e8',
                type: 'mcq',
                question: 'The programme says some skills are at risk of becoming "obsolete." What does this mean in context?',
                options: [
                    'A) More valuable than ever before',
                    'B) Difficult to learn but still important',
                    'C) No longer useful because something better has replaced them',
                    'D) Available only to people with university degrees'
                ],
                correctAnswer: 'C'
            },
            {
                id: 'e9',
                type: 'mcq',
                question: 'Complete the collocation: Many companies now offer paid summer ___ to university students who want to gain practical experience before graduating.',
                options: ['A) apprenticeships', 'B) qualifications', 'C) internships', 'D) soft skills'],
                correctAnswer: 'C'
            },
            {
                id: 'e10',
                type: 'mcq',
                question: 'Complete the collocation: There is ___ demand for graduates in the finance sector, with fewer entry-level positions available each year.',
                options: ['A) waning', 'B) obsolete', 'C) tertiary', 'D) soft'],
                correctAnswer: 'A'
            },
            {
                id: 'e11-1',
                type: 'matching',
                question: 'The availability of jobs in a particular area or field.',
                correctAnswer: 'employment opportunities'
            },
            {
                id: 'e11-2',
                type: 'matching',
                question: 'Education at university or college level after secondary school.',
                correctAnswer: 'tertiary education'
            },
            {
                id: 'e11-3',
                type: 'matching',
                question: 'Official records of achievement like degrees and certificates.',
                correctAnswer: 'qualifications'
            },
            {
                id: 'e11-4',
                type: 'matching',
                question: 'Gradually decreasing in strength or importance.',
                correctAnswer: 'waning'
            },
            {
                id: 'e11-5',
                type: 'matching',
                question: 'No longer useful because something newer has replaced it.',
                correctAnswer: 'obsolete'
            },
            {
                id: 'e11-6',
                type: 'matching',
                question: 'Personal abilities like communication and teamwork that work across all industries.',
                correctAnswer: 'soft skills'
            },
            {
                id: 'e11-7',
                type: 'matching',
                question: 'Learning a trade by working alongside an experienced professional.',
                correctAnswer: 'apprenticeship'
            },
            {
                id: 'e11-8',
                type: 'matching',
                question: 'A period of work experience at a company, often temporary.',
                correctAnswer: 'internship'
            },
            {
                id: 'e12',
                type: 'mcq',
                question: 'Which sentence contains a vocabulary ERROR?',
                options: [
                    'A) The government is investing in apprenticeship programmes to reduce youth unemployment.',
                    'B) Many traditional manufacturing skills have become obsolete due to automation.',
                    'C) She gained excellent soft skills during her time as a university lecturer.',
                    'D) His waning qualifications made it difficult for him to get promoted.'
                ],
                correctAnswer: 'D'
            },
            {
                id: 'e13',
                type: 'mcq',
                question: 'Which sentence contains a vocabulary ERROR?',
                options: [
                    'A) There are fewer employment opportunities for graduates in the banking sector than there were a decade ago.',
                    'B) She completed a six-month internship at a law firm before graduating.',
                    'C) Tertiary education includes primary school and secondary school.',
                    'D) Employers value soft skills like adaptability and problem-solving.'
                ],
                correctAnswer: 'C'
            },
            {
                id: 'e14',
                type: 'fill-blank',
                question: 'As artificial intelligence continues to develop, workers whose skills become ___ will need to retrain in order to remain competitive in the job market.',
                correctAnswer: 'obsolete'
            }
        ],
        summaryPrompt: 'Based on the video, discuss whether you believe a university degree is still worth the investment in the modern era. Consider the impact of AI, the importance of soft skills and work experience, and the declining "graduate premium" in sectors like finance and law.',
        summaryMinWords: 150
    },
    {
        id: 'future-work',
        title: 'What is the future of work?',
        thumbnail: 'https://img.youtube.com/vi/s1HxJVusR2w/maxresdefault.jpg',
        duration: '6:22',
        category: 'Workplace',
        description: 'In this BBC 6 Minute English episode, Neil and Beth discuss the evolving landscape of the workplace, technological advancements, and the four-day working week trial.',
        embedUrl: 'https://www.youtube.com/embed/s1HxJVusR2w?si=f-2lEo4fhOnFfULz',
        comprehensionQuestions: [],
        vocabulary: [],
        vocabExercises: [],
        summaryPrompt: 'Based on the video, discuss the future of work. Consider the impact of technology and the possibility of a four-day working week.',
        summaryMinWords: 150
    }
];

// Helper to get a lesson by ID
export function getLessonById(id: string): VideoLesson | undefined {
    return videoLessons.find((lesson) => lesson.id === id);
}

