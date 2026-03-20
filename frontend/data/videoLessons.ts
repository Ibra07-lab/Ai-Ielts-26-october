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
    summaryMaxWords?: number;
    summaryRequirements?: string[];
    transcriptPhrases?: string[];
    fullTranscript?: string;
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
        summaryMaxWords: 250,
        fullTranscript: `Hello. This is 6 Minute English from BBC Learning English. I’m Rob. And I’m Beth. In this programme, we’re talking about money - and Beth, as the old saying goes, money makes the world go round! You mean it’s very important and lots of things couldn’t happen without it. Well, we all need money – but have you noticed how our money doesn’t seem to buy so much these days? Yes, I have Beth.
It seems like consumers like us are being hit in the pocket at the moment – and by that, I mean we have less money to spend. Now, I’m no economist, but I know this has a lot to do with inflation - the increase in prices of things over time. It’s a big problem globally, and Beth my question for you is about inflation. According to one report, what was the annual inflation rate in Venezuela between November 2017 and 2018? Was it: a) 130% b) 1,300% or c) 1,300,000%? I’ll say b) 1,300%.
OK. We’ll find out if you’re right later on. But let’s talk more about money and inflation now. Around the world, prices of things are rising more than normal, and more worrying is that prices keep going up. Two things in particular are increasing in price – energy, like gas  and electricity, and food. These are things we need and depend on.
So, what’s causing the rises? There seem to be two main reasons – the Covid pandemic and the war in Ukraine, which has reduced the supply in things we need. And when things are in short supply – available in limited quantities - prices go up. The BBC World Service programme The Real Story discussed this in much more detail.
One expert, economist, writer and broadcaster, Linda Yueh, explained how price rises could be around for a while… Even if you take out some of these volatile items like food and energy, the sustained price increases we've had, it is actually getting passed through into how companies price their goods and services.
and that's where it gets extremely worrying because that suggests that even if energy prices, food prices, come down, we could have inflation now in the system and I think that for advanced economies is worrying, for developing countries, that's hugely worrying. Linda Yueh used some interesting language there.
She talked about food and energy being volatile items – something that is volatile is unpredictable and can change suddenly. And that’s what we’ve experienced with food and energy prices. Yes, and she said these price increases have been sustained – so, continuing at the same level for a long period of time.
But Linda Yueh says that even if energy and food prices eventually come down, companies will pass on the extra costs they have already faced by charging more for their goods and services. And this could cause inflation – there’s that word again. Continuing price rises aren’t good for anyone but especially for people in developing economies – countries which have industry that’s less developed and have lower living standards.
Another possible consequence of inflation is recession – this economic term describes a situation where a country’s production starts going down, people’s incomes go down and unemployment goes up. This all sounds like a very bleak economic outlook. So, what can be done? Well, that’s the million-dollar question, and economists are trying to work it out.
Speaking on The Real Story programme, economist Vicky Pryce gave an overview of how to control inflation. One of them, something that is actually most effective, is by slowing down demand. And if you increase interest rates, what you do is you discourage people from borrowing, whether they are individuals or whether they are businesses - and of course the economy starts slowing down.
So, she says what is most effective – meaning what works well and gets the best results – is slowing down demand. Increasing interest rates can do this because people will borrow less money. Interest rates are fees banks and financial institutions charge you for borrowing money. And if we borrow less money, we buy fewer things, which can reduce inflation.
I think it makes sense now! And if you were in Venezuela in 2018, you would really want inflation to go down, wouldn’t you? Yes. Now, earlier I asked you what one report said the inflation rate was there between November 2017 and 2018. And I said a very high 1,300%. Well, it was even higher, Beth. According to a study by the opposition-controlled National Assembly, the annual inflation rate reached 1,300,000% in the 12 months to November 2018.
This extreme financial situation was known as hyperinflation. That’s not good at all. In this programme, we have been talking about inflation – that’s the  increase in prices over time. Other vocabulary we used included the expression hit in the pocket – which means you have less money to spend. Volatile describes something that is unpredictable and can change suddenly.
Something that is sustained continues at the same level for a long period of time. And something that is effective works well and gets the best results. And interest rates are fees banks and financial institutions charge you for borrowing money. Well, we hope you’ve found our brief lesson about the economy useful.
Thanks for listening. Goodbye for now! Bye bye!`,
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
        summaryMaxWords: 250,
        fullTranscript: `Hello. This is 6 Minute English from BBC Learning English. I’m Neil. And I’m Beth. When I was a boy, I wanted to be a fireman when I grew up. How about you, Beth? Did you have any childhood dreams? I wanted to be an astronaut and fly to the Moon… When we’re young most of us have big dreams and plans for the future.
Unfortunately, as we grow up these childhood dreams often get lost in the adult world of jobs, money, families and careers. But not for everyone… Daisy, from New Zealand, and, Herman, from Argentina are two people who decided to follow their childhood dreams. They wanted the world to become a utopia – a perfect, ideal society where everyone is happy and gets along with each other.
In this programme, we’ll be hearing how Daisy and Herman made their dreams come true – not by changing the world, but by changing themselves. And, as usual, we’ll be learning some new vocabulary too. But before that I have a question for you, Beth. Following your dreams can be tough, but not following them can leave you regretting all the things you wanted to do but didn’t.
In 2012, Australian nurse, Bronnie Ware, wrote her bestselling book, The Top Five Regrets of the Dying, after interviewing terminally ill patients about their life regrets. So, what do you think their top regret was? Was it: a) I wish I hadn’t worked so hard? b) I wish I had followed my dreams? or c) I wish I’d made more money? Well, I’ll guess it’s b) they wish they had followed their dreams.
OK, Beth. I’ll reveal the correct answer at the end of the programme. The first dreamer we’re going to meet lives in Riverside, a peace-loving community in New Zealand where everyone shares everything. Riverside members work for the community’s businesses, including a farm, a hotel and a café. All the money they earn is collected and shared between everyone equally.
Daisy, who was born in East Germany, joined Riverside in 2004. Here she explains her belief in sharing to BBC World Service programme, The Documentary. What I think I always believed in is that the sharing of resources can provide a group of people with quite a great advantage, but it doesn’t matter how many hours you work or what work you do, everyone is getting the same amount.
And that is something that many people outside of Riverside struggle with, and where we’re often getting this ‘communism’ label attached to us, because it’s so… it seems so outlandish for people. Riverside isn’t a communist community. In fact, people with many different political views live there. But Daisy says that local people struggle with the idea that everything is shared.
If you struggle with an idea, you find it difficult to accept or think about it. Daisy also says some local people call Riverside outlandish – strange and unusual. Our second group of dreamers are a family - the Zapps. In 2000, childhood sweethearts, Herman and Candelaria Zapp, bought a vintage car and set off from Argentina to travel around the world with less than 3.
500 dollars in their pockets. Twenty-two years and three children later they have visited over a hundred countries, meeting with countless people and experiences on the way. Here, Herman Zapp explains to BBC World Service’s, The Documentary, how following his dream has changed him for the better. I am so happy with the Herman there is now, that I know now – not the one who wanted to conquer the world, but the one who was conquered by the world.
I learn so much from people, and it’s amazing how the more you meet people, the more you know stories, how much more humble you become because you notice that you are a beautiful, tiny piece of sand, but a very important piece of sand like everyone is, right? After many years travelling, meeting new people and hearing their stories, Herman is more humble – not proud or arrogant.
He no longer wants to conquer the world – to control it by force; rather, he has been conquered by his experiences. Herman compares himself to a beautiful but tiny piece of sand and uses the phrase 'a grain of sand' to describe things which are insignificant in themselves, but at the same time are an important part of the whole.
Daisy and Herman are rare examples of dreamers who followed their dream and found a happy life, lived without regret – which reminds me of your question, Neil. Yes, I asked about Bronnie Ware’s book, The Top Five Regrets of the Dying. What do you think the number one regret was, Beth? I guessed it was b) not following your dreams.
Which was the right answer! Not having the courage to follow your dreams was listed as the top life regret. At least we have people like Daisy and Herman to remind us dreams can come true! OK, let’s recap the vocabulary from this programme, starting with 'utopia' – a perfect world where everyone is happy. If you 'struggle with an idea', you find it difficult to accept.
The adjective, outlandish, means strange and unusual. 'To conquer' something means to control it by force. Someone who is 'humble' is not proud or arrogant. And finally, the phrase 'a grain of sand' describes something which is both insignificant yet somehow important. Once again, our six minutes are up. Bye for now! Goodbye!`,
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
        summaryMinWords: 150,
        summaryMaxWords: 250,
        fullTranscript: `Hello. This is Six Minute English from BBC Learning English. I'm Neil. Beth? What are you doing? Get off your phone! Oh, sorry! And I'm Beth. Are you addicted to social media? It wouldn't be a surprise. With so many different apps out there, Snapchat, TikTok, and the latest, Threads, it's easy to spend a lot more time on your phone than ever before.
Yes, I don't think I'm addicted, but I definitely spend more time on social media than I'd like to. However, there are plenty of studies out there looking at how social media affects mental health with some saying it can be as addictive as gambling. Research in the US has found that adolescents who spend more than three hours a day on social media have double the risk of developing depression and anxiety.
An adolescent is someone aged ten to nineteen, between childhood and adulthood. With that in mind, it's no wonder parents are worried. To help with this, the US is currently in the process of regulating social media apps for teenagers. Some scientists think the UK should do the same. There has been growing agreement among health experts about the negative chronic health effects of social media use on teenagers.
They have revealed in surveys that social media makes them feel worse about their body image and 64% of teens have said they are regularly exposed to hate-based content. In this programme, we'll be discussing how social media affects teenagers and, as usual, we'll be learning some useful new vocabulary as well.
But first I have a question for you, Beth. The app Snapchat is a very common way that teenagers communicate these days. This is partly because messages and photos disappear after a certain time period. But what percentage of thirteen to twenty-four year olds use Snapchat? Is it: a) 70%, b) 80% or c) 90%. Hmm, I'll guess 80%.
OK, Beth. I'll reveal the answer later in the programme. A lot of social media platforms, such as TikTok, work by showing and suggesting similar accounts and content to those someone has already searched for. Professor Devi Sridhar, the Chair of global public health at the University of Edinburgh, thinks this can be concerning, as she told BBC World Service Programme, Inside Science.
And this is worrying, for example, with young girls and eating disorders, that they're being fed that in an addictive way and the algorithm saying, 'Oh, they like that content. We want to keep giving it to them because it keeps them on their phones and I think that's the really vital message here, of any of these apps, is that their revenue comes from advertising.
Teenagers are being fed content in a way that is addictive. If you are fed something, it means you're given something. In this case, it refers to content, not food. The content is addictive because social media users algorithms. Algorithms are a complex set of rules and calculations that prioritise and personalise the content a user sees.
But we need to remember that social media platforms use algorithms to keep users on the platforms for as long as possible because their revenue comes from advertising. Revenue is the money a company earns. They're paid by other companies to use the social media space to promote their products. This could be seen as social media platforms prioritising making money over the mental health of users – a worry for parents.
Professor Debbie Sridhar talked about the challenges of having a teenager addicted to social media on BBC   World Service Programme, Inside Science. And so I think the challenge here, as a parent, listening to this is what you do about it. And I think the onus has been put on parents and concerned adults to find solutions on their own.
And that means debates with your child over what are you are on, are you using this, but it's a losing battle because it's their entire social network. Professor Sridhar says that, when it comes to helping teenagers navigate social media, the onus has been put on parents to find solutions. The onus means the responsibility or duty.
Parents need to be able to challenge their children when they need to, even if this is a losing battle, a fight they cannot win as teenagers have their entire life on social networks. OK Beth. I think it's time I reveal the answer to my question. I asked you what percentage of thirteen to twenty-four year olds use Snapchat.
And I said it was 80%. And that was, I'm sorry to say, the wrong answer. Actually 90% of people aged between thirteen and twenty four use Snapchat – quite a lot. OK, let's recap the vocabulary we have learned from this programme, starting with adolescent – a person aged ten to nineteen, between childhood and adulthood.
If you are fed content, you are given content. This is what the social media platform offers you automatically rather than what you search for yourself. Algorithms are a complex set of rules and calculations that prioritise and personalise the content a user sees. Revenue is the money a company earns which could come from sales or advertising.
If the onus is on someone, it's their responsibility or duty. And finally, a losing battle is a fight you cannot win. Once again our six minutes are up. Join us again soon for more useful vocabulary here at Six Minute English. Goodbye for now. Bye.`,
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
        summaryMinWords: 150,
        summaryMaxWords: 250,
        fullTranscript: `Hello. This is 6 Minute English from BBC Learning English. I'm Georgina... Neil: And I'm Neil. Georgina: In this programme, we're talking about buying clothes and only wearing them a few times before buying more clothes! Neil: This is something known as fast fashion - it's popular, it might make us feel good, but it's not great for the environment.
Georgina: Which is why lots of people this year are pledging - or promising publicly - to buy no new clothes. Neil: I for one am wearing the same shirt I bought seven years ago. Georgina: You're certainly not a fashion victim, Neil! But first, let's test your knowledge of fast fashion with a question. Do you know how many items of clothing were sent to landfill in the UK in 2017? Was it...
a) 23 million items, b) 234 million items or c) 2.3 billion items? What do you think, Neil? Neil: I'm sure it's lots, but not billions, so I'm going to say 23 million items. Georgina: I shall tell you if you're right at the end of the programme. Let's talk more about fast fashion, which is being blamed for contributing to global warming.
Neil: And discarded clothes - that means ones that are thrown away - are also piling up in landfill sites, and fibre fragments are flowing into the sea when clothes are washed. Georgina: It's not great - and I've heard the average time someone wears something is just seven! So why is this, and what is driving our desire to keep buying more clothes? Neil: I think we should hear from fashion journalist Lauren Bravo, who's been speaking on the BBC Radio 4 programme, You and Yours.
She explained that clothes today are relatively cheaper than those from her parents' days... Lauren Bravo: A lot of clothing production got outsourced - offshored over to the developing world, so countries like Indonesia, India, Bangladesh and China are now responsible for making the vast bulk of all the clothes that are sold in the UK.
And with that, we've seen what we call 'chasing the cheapest needle' around the world, so the fashion industry constantly looking to undercut competitors, and with that clothes getting cheaper and cheaper and cheaper. Georgina: Right, so clothes - in the developed world at least - have become cheaper because they are produced in developing countries.
These are countries which are trying to become more advanced economically and socially. Neil: So production is outsourced - that means work usually done in one company is given to another company to do, often because that company has the skills to do it. And in the case of fashion production, it can be done cheaper by another company based in a developing country.
Georgina: Lauren used an interesting expression 'chasing the cheapest needle' - so the fashion industry is always looking to find the company which can make clothes cheaper - a company that can undercut another one means they can do the same job cheaper. Neil: Therefore the price of clothes gets cheaper for us.
Georgina: OK, so it might be good to be able to buy cheaper clothes. But why do we have to buy more - and only wear items a few times? Neil: It's all about our obsession with shopping and fashion. It's something Lauren Bravo goes on to explain on the You and Yours radio programme. See if you can hear what she blames for this obsession...
Lauren Bravo: Buying new things has almost become a trend in itself for certain generations. I think that feeling that you can't be seen in the same thing twice, it really stems from social media, particularly. And quite often people are buying those outfits to take a photo to put on Instagram. It sounds illogical, but I think when all of your friends are doing it there is this invisible pressure there.
Georgina: Lauren makes some interesting points. Firstly, for some generations, there is just a trend for buying things. Neil: It does seem very wasteful, but, as Lauren says, some people don't like to be seen wearing the same thing twice. And this idea is caused by social media - she uses the expression 'stems from'.
Georgina: She describes the social pressure of needing to be seen wearing new clothes on Instagram. And the availability of cheap clothes means it's possible to post new images of yourself wearing new clothes very regularly. Neil: Hmm, it sounds very wasteful and to me, illogical - not reasonable or sensible and more driven by emotions rather than any practical reason.
Georgina: But, there is a bit of a backlash now - that's a strong negative reaction to what is happening. Some people are now promising to buy second-hand clothes, or 'vintage clothes', or make do with the clothes they have and mend the ones they need. It could be the start of a new fashion trend. Neil: Yes, and for once, I will be on trend! And it could reduce the amount of clothes sent to landfill that you mentioned earlier.
Georgina: Yes, I asked if you knew how many items of clothing were sent to landfill in the UK in 2017? Was it... a) 23 million items, b) 234 million items or c) 2.3 billion items? What did you say, Neil? Neil: I said a) 23 million items. Georgina: And you're wrong. It's actually 234 million items - that's according to the Enviro Audit Committee.
It also found that 1.2 billion tonnes of carbon emissions is released by the global fashion industry. Neil: Well, we're clearly throwing away too many clothes but perhaps we can recycle some of the vocabulary we've mentioned today? Georgina: I think we can, starting with pledging - that means publicly promising to do something.
You can make a pledge to do something. Neil: When something is outsourced, it is given to another company to do, often because that company has the skills to do it or it can be done cheaper. Georgina: And if one company undercuts another, it charges less to do a job than its competitor. Neil: The expression stems from means 'is caused by' or 'a result of'.
We mentioned that rise in fast fashion stems from sharing images on Instagram. Georgina: And we mentioned this being illogical. So it seems unreasonable - not sensible, and more driven by emotions rather than any practical reason. Neil: And a backlash is a strong negative reaction to what is happening. Georgina: And that brings us to the end of our discussion about fast fashion! Please join us again next time. Bye.
Neil: Bye.`,
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
        summaryMinWords: 150,
        summaryMaxWords: 250,
        fullTranscript: `Hello and welcome to 6 Minute English. I'm Alice and I'm Neil. Have you ever played Sim City, Neil - the city-building computer game? Yes, but I wasn't very good at it. I didn't build enough houses which created a lot of homeless Sims - those are characters in the game - and then I didn't deal effectively with a flood. Really! Well, I suppose managing a city is quite a challenge, which is the subject of today's show: Cities of the Future.
An important subject as so many of us now live in urban areas. I want to start with our quiz question: what is the percentage of the world's population that will be living in cities in 2050? We are dealing with approximates here. Is it: a) 10%, b) 50% or c) 70%? I think that it's a) 10%. Well, we'll find out if you're right or wrong later on in the show.
Now, you've encountered a couple of issues that might face urban planners when designing a city, Neil. Housing and dealing with a flood. Can you think of any others? Yes, having decent cycle lanes, good transport networks are very important. Yes indeed. And if people could get around easily on foot or by bike or by public transport, roads would be less congested - or overcrowded - and less polluted.
That sounds rather utopian to me though. A Utopia is an imaginary place where everything is perfect. But Copenhagen is pretty utopian, Alice. The air is clean, there are bike lanes everywhere. Oh that sounds fantastic! But what about somewhere like Beijing with its constant smog - or air pollution - hanging over the city? A lot of people ride bikes there too.
So which city is going to be the model for the future? Maybe like the future Los Angeles in the movie Blade Runner... you know, glittering high-rises, gigantic neon billboards, flying cars. Well, today's Los Angeles has terrible urban sprawl and traffic problems. Urban sprawl is the way a city spreads into undeveloped land around it, often without planning permission.
Dr Janice Perlman can explain why this happens. She is the founder and president of the Mega-Cities Project, a non-profit organization in Rio de Janeiro, and knows a lot about urban sprawl in Brazilian cities. People are coming massively into the cities which have no housing that's affordable to them. So they can't rent and they can't buy, and they end up building their own communities and houses on unoccupied land.
And these communities are becoming in some places the majority, not the minority. And they're off the grid, so they're not often serviced by either the social services but also many of them don't have water, sanitation and electricity. People migrate - or move from the countryside to the city - to get better opportunities, but end up with nowhere to live, so they build their own housing on unoccupied land.
These shanty towns - poor communities where the houses are built out of cheap materials like corrugated iron and plastic sheeting - are often off the grid, which means they don't have an electricity or water supply or access to healthcare and education. And these communities are growing, so the problem's getting bigger. So are there any solutions, Alice?
Well, it's all about improving the infrastructure - that's the basic facilities a town or city needs, for example, communication, transport, water and electricity. But this shouldn't only mean improving housing conditions but also promoting education and employment among the inhabitants and building better communities. That sounds like a real headache for the urban planners!
You're right there. And one thing urban planners are talking about at the moment is creating smart cities. John Rossant, founder and chairman of the non-profit organization New Cities Foundation, explains what it is. I think, you know, generally it's accepted that cloud computing, ubiquitous internet, robust 5G networks, etc., will transform our cities whether they're in the global south or the developed world.
And technology is really a game changer, I think, in urbanization. John Rossant there. What's ubiquitous, Alice? It means available everywhere. So the idea behind smart cities is to use technology to collect large amounts of data about how a city is performing, and that will be a game changer - significantly affecting the way our cities function. Hope for the future, Alice!
Fingers crossed. Now I think it's time for the answer to today's quiz question, Neil. I asked what is the percentage of the world's population that will be living in cities in 2050? And remember I said we're dealing with approximates here. Is it: a) 10%, b) 50% or c) 70%? And I said a) 10%. Yes, and you underestimated there, Neil. The right answer is actually c) 70%.
This is according to a report by the United Nations. Today, 54% of the world's population lives in urban areas. A lot, really. Yeah. Well, I know we're running out of time so let me repeat the words we learned today. They were: congested, Utopia, smog, urban sprawl, migrate, shanty towns, off the grid, infrastructure, ubiquitous, game changer.
Well, that's the end of this edition of 6 Minute English. Join us again soon. Meanwhile, visit our website bbclearningenglish.com where you'll find guides to grammar, exercises, videos and articles to read and improve your English. Bye! Bye-bye.`,
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
        summaryMinWords: 150,
        summaryMaxWords: 250,
        fullTranscript: `Earning a degree used to lead to a steady job with a good salary. But today, young graduates in the West are finding fewer employment opportunities. So, is it still worth going to university? The unemployment rate of young graduates in America is now approaching the same rate for the age group as a whole. In 2010 there was around a six percentage-point difference in unemployment between young people and young graduates. But now there's just a one percentage-point difference between them.
It's not just in America. In the European Union, the unemployment rate of young people with tertiary education is now approaching the overall rate for that age group. One theory for this is that universities are accepting less-talented applicants, and then they aren't teaching them very well. This could lead to employers not expecting much of a difference between the average graduate and then someone who didn't go to university.
Another theory is that fewer jobs need graduate-level qualifications. For example, in the past you often needed to attend a university in order to understand how to use a computer. On the frontiers of science the strange world of the computer. But today almost everyone can use tech, regardless of whether or not they went to university. The number of jobs in graduate-friendly industries is also decreasing.
Across the EU the number of 15-to-24-year olds who are employed in finance and insurance fell by 16% from 2009-2024. And, since 2016, the number of British twentysomethings in law and finance has fallen by 10%. It's tempting to blame AI for these waning opportunities. Yet the decline in graduate jobs started long before ChatGPT. What's more likely is that the industries that traditionally employed graduates have had a tough time lately.
Since the global financial crisis of 2007-2009, the golden age of investment banking is over, so they're spending less money on hiring graduates. In America all this is affecting young people's decision on whether or not to attend college. The number of Americans enrolled in bachelor's programmes fell by 5% from 2013-2022, according to data from the OECD. Yet in most rich countries, where education is cheaper because the state plays a larger role, young people are still applying to universities in droves.
Excluding America, enrolment across the OECD rose from 28m to 31m in the decade to 2022. Perhaps students simply aren't picking the right subjects. Arts, humanities and social sciences are still proving popular. Even, inexplicably, journalism. If these trends say anything about young people's ideas about the future of work, they truly are in trouble. So, in the age of AI what should you study at university?
As technology improves, the future of work is changing, too. Many of the jobs that graduates will have don't even exist yet. Some young people worry that certain skills they learn might become outdated as technology changes. Coding, for example, is at risk of becoming obsolete within only a few years. According to one study the percentage of American and British IT professionals who worry that AI tools will make many of their day-to-day skills obsolete increased from 74% to 91% in just one year.
There are some subjects which are likely to stay relevant. Robotics, for example, will help people maximise the benefits of technological change. And practical jobs, like plumbing and carpentry, are less likely to be taken over by AI and will remain valued by society. These professions often don't require a university qualification and can be learnt in other ways, like on apprenticeships.
But arguably what's more important for students than studying a specific subject is to focus on learning soft skills instead. Things like communication, critical thinking and reliability, as well as empathy and being able to build relationships. All are transferable across multiple industries. OECD findings from 2019 demonstrate that people will need to rely on their currently unique human skills to succeed. Understanding how to learn will be key to developing new skills and adapting in changing times.
The research also suggests that jobs with complex social interactions, such as care, will still need humans, so developing skills like negotiation and persuasion will be vital. Currently AI isn't very good at these soft skills. I understand emotions have a deep meaning, but I can't experience them like you can. So if workers can plug the gaps, while also being able to transition into emerging industries, then it will help humans to compete with machines.
Nearly all degrees will allow you to gain these skills through group projects, presentations and extra-curricular activities. Ultimately it doesn't really matter which degree you choose to study. Perhaps what's even more important is that a student gains work experience or an internship. Research finds that those who graduated in 2022 and completed internships were 23% more likely to start a full-time position within six months of graduation.
This gap increases further in certain fields, like oil, gas and mining, where it rose to 65%. Although it's hard to predict how improving technology will change the world of work over the coming decades, one thing is for sure: a student with a variety of skills, a lifelong desire to learn and a good attitude will go far.`,
    },
    {
        id: 'future-work',
        title: 'What is the future of work?',
        thumbnail: 'https://img.youtube.com/vi/s1HxJVusR2w/maxresdefault.jpg',
        duration: '6:22',
        category: 'Workplace',
        description: 'In this BBC 6 Minute English episode, Neil and Beth discuss the evolving landscape of the workplace, technological advancements, and the four-day working week trial.',
        embedUrl: 'https://www.youtube.com/embed/s1HxJVusR2w?si=f-2lEo4fhOnFfULz',
        comprehensionQuestions: [
            {
                id: 'fw-cq1',
                type: 'tfng',
                question: 'The programme states that Elon Musk predicted artificial intelligence will eventually mean that nobody will need to work.',
                correctAnswer: 'True',
                explanation: 'The programme says: "tech billionaire Elon Musk, who recently predicted that artificial intelligence will eventually mean that no one will have to work." This matches the statement exactly.'
            },
            {
                id: 'fw-cq2',
                type: 'tfng',
                question: 'According to Professor Burchell, predictions about dramatic changes to working time have generally been accurate throughout history.',
                correctAnswer: 'False',
                explanation: "Professor Burchell says the opposite: \"the track record for economists and other social scientists isn't good\" and \"those predictions of very, very large changes in working time just haven't come to pass.\" He clearly states that predictions have been inaccurate, not accurate."
            },
            {
                id: 'fw-cq3',
                type: 'tfng',
                question: 'The programme states that the four-day working week trial in 2023 was only offered to technology companies.',
                correctAnswer: 'Not Given',
                explanation: 'The programme mentions that 60 companies took part in the trial but never specifies what type of companies they were. It does not say whether they were technology companies, service companies, or any other sector. This information is simply not discussed.'
            },
            {
                id: 'fw-cq4',
                type: 'tfng',
                question: 'Andrew Palmer believes that AI will completely eliminate all human jobs in the near future.',
                correctAnswer: 'False',
                explanation: "Andrew Palmer says: \"I'm not a tech dystopian, I don't think that machines or AI are going to get rid of all jobs.\" He explicitly rejects the idea that AI will eliminate all jobs."
            },
            {
                id: 'fw-cq5',
                type: 'tfng',
                question: 'Professor Burchell acknowledges that working hours have been reducing very gradually over time.',
                correctAnswer: 'True',
                explanation: 'Professor Burchell says: "although we\'re heading very gradually in that direction." He accepts the trend exists but emphasises it is happening much more slowly than predictions suggest.'
            },
            {
                id: 'fw-cq6',
                type: 'mcq',
                question: 'What happened during the four-day working week trial in 2023?',
                options: [
                    '52% of companies continued with the shorter week',
                    '72% of companies continued with the shorter week',
                    '92% of companies continued with the shorter week',
                    'All companies abandoned the idea and returned to five days'
                ],
                correctAnswer: '92% of companies continued with the shorter week',
                explanation: 'Neil reveals: "a whopping 92% of the companies plan on keeping a four-day week because it was so popular, with bosses as well as workers!"'
            },
            {
                id: 'fw-cq7',
                type: 'mcq',
                question: 'When Professor Burchell says predictions should be taken "with a pinch of salt," he means that people should:',
                options: [
                    'Add salt to their food while reading predictions',
                    'Trust predictions completely because experts made them',
                    'Not completely believe what they are told about the future',
                    'Ignore all predictions entirely and stop thinking about the future'
                ],
                correctAnswer: 'Not completely believe what they are told about the future',
                explanation: "The programme explains: \"To take something with a pinch of salt is an idiom meaning to doubt that what you've been told is accurate or likely to come true.\""
            },
            {
                id: 'fw-cq8',
                type: 'mcq',
                question: "What is Andrew Palmer's main concern about AI and jobs?",
                options: [
                    'That AI will make all products more expensive',
                    'That new jobs will appear at the same time as old ones disappear',
                    'That there will be a timing gap between jobs being lost and new ones appearing',
                    'That governments will ban AI in the workplace'
                ],
                correctAnswer: 'That there will be a timing gap between jobs being lost and new ones appearing',
                explanation: "Andrew says he worries about \"a sequencing risk\" and that \"although economists like to say new jobs will crop up, they won't necessarily be aligned at the same time вЂ” there won't be coordination.\" His concern is about the GAP between job losses and new job creation, not that jobs will disappear forever."
            },
            {
                id: 'fw-cq9',
                type: 'mcq',
                question: 'Which 1930s prediction mentioned at the start of the programme has NOT come true?',
                options: [
                    'People will watch television at home',
                    'A miracle pill will cure all diseases',
                    'People will work from home',
                    'Robots will do factory work'
                ],
                correctAnswer: 'A miracle pill will cure all diseases',
                explanation: 'The programme opens by mentioning "smell-o-vision" and "a miracle pill which cures all diseases" as 1930s predictions that "haven\'t come true."'
            },
            {
                id: 'fw-cq10',
                type: 'mcq',
                question: 'Which prediction about work DID come true, according to the programme?',
                options: [
                    'Robots took over most jobs',
                    'Everyone started working a four-day week',
                    'Millions of people worked from home during Covid',
                    'Artificial intelligence replaced all office workers'
                ],
                correctAnswer: 'Millions of people worked from home during Covid',
                explanation: 'The programme says: "During Covid, one of these predictions came true. Millions were forced to work from home."'
            }
        ],
        vocabulary: [
            {
                id: 'fw-v1',
                word: 'take something with a pinch of salt',
                partOfSpeech: 'idiom',
                definition: 'To not completely believe what you have been told because you think it is unlikely to be true or accurate.',
                example: 'When my friend told me he had been offered a job paying $200,000 a year, I took it with a pinch of salt because he tends to exaggerate.',
                tip: 'Whenever I see headlines about technology completely replacing all human workers, I take it with a pinch of salt. People have been making those kinds of predictions for decades and they never quite come true.',
                tipType: 'speaking',
                collocations: ['take it with a pinch of salt', 'take predictions with a pinch of salt', 'should be taken with a pinch of salt', 'take claims with a pinch of salt'],
                synonyms: ['be sceptical about', 'doubt', 'question', 'not fully believe', 'treat with caution']
            },
            {
                id: 'fw-v2',
                word: 'track record',
                partOfSpeech: 'noun',
                definition: 'All the achievements, successes, or failures that a person, organisation, or field has had in the past, used to judge how reliable or effective they are likely to be in the future.',
                example: 'The company has an excellent track record of promoting employees from within rather than hiring externally.',
                tip: 'When evaluating proposals for radical workplace reform, it is essential to consider the track record of similar initiatives in the past, as many ambitious predictions about the future of work have failed to materialise.',
                tipType: 'writing',
                collocations: ['good/bad/poor track record', 'proven track record', 'track record of success', 'impressive track record', 'track record in something'],
                synonyms: ['past performance', 'history', 'reputation', 'record of achievement']
            },
            {
                id: 'fw-v3',
                word: 'come to pass',
                partOfSpeech: 'phrase',
                definition: 'To happen or take place, especially something that was predicted or expected.',
                example: 'Many of the dramatic changes to working life that economists predicted in the 1970s never came to pass.',
                tip: 'Despite numerous forecasts predicting the complete automation of manufacturing within two decades, such predictions have largely failed to come to pass.',
                tipType: 'writing',
                collocations: ['never came to pass', 'predictions that came to pass', 'unlikely to come to pass', 'eventually came to pass', 'if this comes to pass'],
                synonyms: ['happen', 'occur', 'take place', 'materialise', 'become reality']
            },
            {
                id: 'fw-v4',
                word: 'dystopian',
                partOfSpeech: 'adjective',
                definition: 'Relating to an imagined future world where there is great suffering, injustice, and terrible living conditions.',
                example: 'Some people have a dystopian view of artificial intelligence, imagining a future where machines control every aspect of human life.',
                tip: "I don't really have a dystopian view of technology. I think technology has always created new opportunities alongside the problems it causes.",
                tipType: 'speaking',
                collocations: ['dystopian future', 'dystopian vision', 'dystopian world', 'dystopian scenario', 'dystopian view', 'tech dystopian'],
                synonyms: ['nightmarish', 'bleak', 'apocalyptic', 'grim']
            },
            {
                id: 'fw-v5',
                word: 'get rid of',
                partOfSpeech: 'phrasal verb',
                definition: 'To remove something or someone that you no longer want or need. In the context of work, it means to eliminate jobs or make them unnecessary.',
                example: 'The company got rid of 500 factory positions after installing automated machinery on the production line.',
                tip: 'While automation has the capacity to eliminate a significant number of routine positions, it is unlikely to eradicate the need for human workers entirely.',
                tipType: 'writing',
                collocations: ['get rid of jobs', 'get rid of workers', 'get rid of old equipment', 'get rid of a problem', 'want to get rid of', 'need to get rid of'],
                synonyms: ['eliminate', 'remove', 'dispose of', 'do away with', 'abolish']
            },
            {
                id: 'fw-v6',
                word: 'crop up',
                partOfSpeech: 'phrasal verb',
                definition: 'To appear or happen unexpectedly, without being planned.',
                example: 'Although AI may replace some existing roles, economists believe that entirely new types of jobs will crop up in industries that we cannot yet imagine.',
                tip: 'Thirty years ago nobody could have imagined jobs like YouTuber or drone operator. These things just crop up as technology changes.',
                tipType: 'speaking',
                collocations: ['new jobs crop up', 'problems crop up', 'opportunities crop up', 'issues crop up', 'things keep cropping up', 'something crops up unexpectedly'],
                synonyms: ['appear', 'emerge', 'arise', 'come about', 'spring up', 'materialise']
            }
        ],
        vocabExercises: [
            {
                id: 'fw-ex1',
                type: 'fill-blank',
                instruction: 'Complete the sentence with the correct vocabulary word or phrase from this lesson.',
                question: 'Economists have a poor ___ ___ when it comes to predicting major changes in the way people work.',
                correctAnswer: 'track record'
            },
            {
                id: 'fw-ex2',
                type: 'fill-blank',
                instruction: 'Complete the sentence with the correct vocabulary word or phrase from this lesson.',
                question: 'When someone tells you that robots will replace all human workers within five years, you should take it with a ___ ___ ___ ___ ___ ___ ___.',
                correctAnswer: 'pinch of salt'
            },
            {
                id: 'fw-ex3',
                type: 'fill-blank',
                instruction: 'Complete the sentence with the correct vocabulary word or phrase from this lesson.',
                question: 'Andrew Palmer does not have a ___ view of AI. He believes it will create new opportunities, not just destroy existing ones.',
                correctAnswer: 'dystopian'
            },
            {
                id: 'fw-ex4',
                type: 'fill-blank',
                instruction: 'Complete the sentence with the correct vocabulary word or phrase from this lesson.',
                question: 'Although AI may eliminate some current positions, new and unexpected types of work will ___ ___ to replace them.',
                correctAnswer: 'crop up'
            },
            {
                id: 'fw-ex5',
                type: 'mcq',
                question: 'Professor Burchell says predictions about working hours should be taken "with a pinch of salt." What does he mean?',
                options: [
                    'The predictions need more scientific research',
                    'The predictions should not be completely believed because they have often been wrong',
                    'The predictions are definitely going to come true eventually',
                    'The predictions only apply to certain countries'
                ],
                correctAnswer: 'The predictions should not be completely believed because they have often been wrong',
                explanation: 'To take something with a pinch of salt is an idiom meaning to doubt that what you’ve been told is accurate or likely to come true.'
            },
            {
                id: 'fw-ex6',
                type: 'mcq',
                question: 'Andrew Palmer says he is "not a tech dystopian." What is he telling us about his views?',
                options: [
                    'He does not understand technology',
                    'He does not imagine a nightmarish future where AI destroys all jobs',
                    'He thinks technology is completely harmless',
                    'He does not use any technology himself'
                ],
                correctAnswer: 'He does not imagine a nightmarish future where AI destroys all jobs',
                explanation: 'A dystopian future is an imagined world where there is great suffering or injustice.'
            },
            {
                id: 'fw-ex7',
                type: 'mcq',
                question: 'Which sentence uses "come to pass" CORRECTLY?',
                options: [
                    'The professor came to pass along the corridor on his way to the lecture.',
                    'She came to pass her driving test on the third attempt.',
                    'Many of the bold predictions made about flying cars in the 1960s never came to pass.',
                    'He came to pass the ball to his teammate during the match.'
                ],
                correctAnswer: 'Many of the bold predictions made about flying cars in the 1960s never came to pass.',
                explanation: '"Come to pass" means to happen or materialise, especially a prediction or expectation.'
            },
            {
                id: 'fw-ex8',
                type: 'mcq',
                question: 'Andrew Palmer says new jobs will "crop up" as AI changes the workplace. What does he mean?',
                options: [
                    'New jobs will be carefully planned by governments',
                    'New jobs will appear unexpectedly in ways nobody predicted',
                    'New jobs will only be available in agriculture',
                    'New jobs will disappear as quickly as they appear'
                ],
                correctAnswer: 'New jobs will appear unexpectedly in ways nobody predicted',
                explanation: '"Crop up" means to appear or happen unexpectedly.'
            },
            {
                id: 'fw-ex9',
                type: 'mcq',
                question: 'Complete the collocation: The company has a proven ___ ___ of delivering projects on time and within budget.',
                options: [
                    'come to pass',
                    'track record',
                    'pinch of salt',
                    'crop up'
                ],
                correctAnswer: 'track record',
                explanation: '"Track record" refers to a history of past performance.'
            },
            {
                id: 'fw-ex10',
                type: 'mcq',
                question: 'Complete the collocation: The factory decided to ___ ___ ___ 200 workers and replace them with automated machines.',
                options: [
                    'crop up for',
                    'come to pass',
                    'get rid of',
                    'take a pinch of'
                ],
                correctAnswer: 'get rid of',
                explanation: '"Get rid of" means to eliminate or remove.'
            },
            {
                id: 'fw-ex11-1',
                type: 'matching',
                instruction: 'Match each vocabulary word or phrase with its correct definition.',
                question: 'To appear or happen unexpectedly',
                correctAnswer: 'crop up'
            },
            {
                id: 'fw-ex11-2',
                type: 'matching',
                instruction: 'Match each vocabulary word or phrase with its correct definition.',
                question: 'To not completely believe what you have been told',
                correctAnswer: 'take something with a pinch of salt'
            },
            {
                id: 'fw-ex11-3',
                type: 'matching',
                instruction: 'Match each vocabulary word or phrase with its correct definition.',
                question: 'To happen or take place, especially a prediction becoming reality',
                correctAnswer: 'come to pass'
            },
            {
                id: 'fw-ex11-4',
                type: 'matching',
                instruction: 'Match each vocabulary word or phrase with its correct definition.',
                question: 'All the past achievements or failures of a person or organisation',
                correctAnswer: 'track record'
            },
            {
                id: 'fw-ex11-5',
                type: 'matching',
                instruction: 'Match each vocabulary word or phrase with its correct definition.',
                question: 'Relating to a nightmarish imagined future of suffering',
                correctAnswer: 'dystopian'
            },
            {
                id: 'fw-ex11-6',
                type: 'matching',
                instruction: 'Match each vocabulary word or phrase with its correct definition.',
                question: 'To remove something you no longer want or need',
                correctAnswer: 'get rid of'
            },
            {
                id: 'fw-ex12',
                type: 'mcq',
                question: 'Which sentence contains a vocabulary ERROR?',
                options: [
                    'Many experts\' predictions about the future of work have never come to pass.',
                    'New career opportunities are likely to crop up as technology evolves.',
                    'The company got rid of its oldest employees to save money.',
                    'I always take weather forecasts with a pinch of sugar because they are often wrong.'
                ],
                correctAnswer: 'I always take weather forecasts with a pinch of sugar because they are often wrong.',
                explanation: "The correct idiom is \"a pinch of salt,\" not \"a pinch of sugar.\" \"Take something with a pinch of salt\" means to not completely believe something."
            },
            {
                id: 'fw-ex13',
                type: 'mcq',
                question: 'Which sentence contains a vocabulary ERROR?',
                options: [
                    'The politician has a strong track record of keeping his campaign promises.',
                    'She has a very dystopian outlook on life, always expecting the worst to happen.',
                    'Unexpected problems always seem to crop up at the worst possible moment.',
                    'The team came to pass the ball very effectively during the match.'
                ],
                correctAnswer: 'The team came to pass the ball very effectively during the match.',
                explanation: "\"Came to pass\" is being confused with \"passing\" a ball. \"Come to pass\" means to happen or take place, especially when something predicted becomes reality."
            },
            {
                id: 'fw-ex14',
                type: 'fill-blank',
                instruction: 'Complete the sentence with the correct vocabulary word or phrase from this lesson.',
                question: 'Although many people predicted that email would completely ___ ___ ___ traditional postal services, letters and packages are still delivered to millions of homes every day.',
                correctAnswer: 'get rid of'
            }
        ],
        summaryPrompt: 'Based on the video, discuss the future of work. Consider the impact of technology and the possibility of a four-day working week.',
        summaryMinWords: 150,
        summaryMaxWords: 250,
        fullTranscript: `Hello. This is 6 Minute English from BBC Learning English. I'm Neil. And I'm Beth. Smell-o-vision, a television, which allows you to smell things as well as see them; and a miracle pill which cures all diseases. These predictions for the future were made in the 1930s, but so far they haven't come true.
Making predictions for the future isn't easy. Just ask tech billionaire Elon Musk, who recently predicted that artificial intelligence will eventually mean that no one will have to work. In fact, there have been many predictions about the future of work. For example, that robots will take over most jobs, and that everyone will work from home.
During Covid, one of these predictions came true. Millions were forced to work from home. So, what will work be like in the future? That's what we'll be discussing in this programme and, as usual, we'll be learning some useful new vocabulary too. But first I have a question for you, Beth. Another idea for the future is the 'four-day working week' where employees work four days for the same money as five.
After Covid, many British companies gave the idea a go, but out of the 60 companies taking part in a four-day working week trial in 2023, how many said they plan to continue with a shorter work week? Was it: a) 52%?, b) 72%? or c) 92%?    Hmm, I guess 52% of the company's plan to continue with a four day week. OK, Beth.
I'll reveal the answer later in the programme. Now, whatever Elon Musk thinks, as we've seen, it's difficult to make your predictions accurate. Here Shaun Ley, presenter of BBC World Service programme, The Real Story, asking University of Cambridge professor, Brendan Burchell, what he thinks about predictions for the future of work: Brendan Burchell, when you look at all the predictions that have been made, certainly in your working lifetime, do you take some of the things that are being predicted now with a large pinch of salt?
I do. I think we have to be sceptical. I think the track record for economists and other social scientists isn't good when we look… you know, for hundreds of years, a hundred years now, people have been predicting that they'll be really quite dramatic reductions in working time, like Elon Musk has just made, and previously those predictions - although we're heading very gradually in that direction - those predictions of very, very large changes in working time just haven't come to pass.
Shaun asks if we should take predictions with a pinch of salt. To take something with a pinch of salt is an idiom meaning to doubt that what you've been told is accurate or likely to come true. For example, if your friend always lies, you take what they say with a pinch of salt. Professor Burchell thinks predictions for the future of work have a bad track record.
A track record means all the achievements or failures that someone has had in the past. When it comes to predicting the future of work, most predictions simply haven't come to pass, an old-fashioned way of saying saying ‘happened’ or ‘come true’. So, are predictions for a future of leisure, relaxing by the pool while robots do all the work just a dream? Let's hear from Andrew Palmer, business editor for The Economist magazine, talking to BBC World Service programme, The Real Story: I'm not a tech dystopian, I don't think that machines or AI are going to get rid of all jobs,
but I do worry about a sequencing risk. So, there will be some disruption from AI. Some jobs, some professions are at risk. And, although economists like to say new jobs will crop up, they won't necessarily be aligned at the same time – there won't be coordination. Andrew is not a dystopian, someone who imagines a nightmarish future of suffering and injustice.
He doesn't think AI will get rid of all jobs. To get rid of something means to remove it because you no longer want it. Andrew predicts that AI Will replace some jobs, and those workers will need support, but he also thinks new jobs will crop up, they will appear unexpectedly. And that's exactly the problem – the future is hard to predict because it's so unexpected! Anyway, I reckon a shorter working week is something we can all agree on, right Neil? Absolutely.
I think it's time to reveal the answer to my question about the 60 companies trying out a shorter working week in 2023. I asked how many of them planned to continue a four-day week at the end of the trials. And I guessed 52%. So, was I right? That was...the wrong answer, I'm afraid, Beth! Actually, a whopping 92% of the companies plan on keeping a four-day week because it was so popular, with bosses as well as workers! Right, let's recap the vocabulary we've learned from this programme, starting with the idiom
take it with a pinch of salt, meaning don't completely believe what you're told is true. A track record means the achievements or failures of someone's past performance. Come to pass is an old-fashioned way of saying take place or happen. A dystopian is someone who foresees a nightmarish future where there's great suffering and injustice in society.
If you get rid of something, you remove something that you no longer want. And finally if something crops up, it appears or happens unexpectedly. Once again our six minutes are up. Join us again soon for more trending topics and useful vocabulary here at 6 Minute English. Goodbye for now! Goodbye!`
    }
];

// Helper to get a lesson by ID
export function getLessonById(id: string): VideoLesson | undefined {
    return videoLessons.find((lesson) => lesson.id === id);
}

