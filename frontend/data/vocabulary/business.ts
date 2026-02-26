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
        wordsCount: 34,
        color: "bg-blue-500",
        ieltsSection: "writing",
        status: "in_progress",
        previewWords: ["lucrative", "entrepreneurial", "monopolise"],
        progress: 12,
    },

    words: [
        // ===== ACADEMIC WORDS =====
        {
            id: 1,
            word: "lucrative",
            definition: "Producing a lot of profit or money.",
            exampleSentence: "She found a lucrative job in the tech industry.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "adjective",
            type: "academic",
            cefrLevel: "C1",
            context: "Often used in Speaking Part 1 (Work) or Writing Task 2.",
            collocations: ["lucrative market", "lucrative contract", "highly lucrative"],
            synonyms: [
                { word: "Good money", level: "Basic" },
                { word: "Profitable", level: "Better" },
                { word: "Lucrative", level: "Band 9" }
            ],
            speakingExample: "My friend left his job because he found a really lucrative opportunity in digital marketing, and he's earning much more now.",
            writingExample: "Governments may prioritise lucrative industries such as finance, even when they contribute relatively little to social welfare.",
            antonyms: ["unprofitable", "loss-making"],
            relatedPhrasalVerbs: ["cash in on", "scale up", "roll out"]
        },
        {
            id: 2,
            word: "entrepreneurial",
            definition: "Willing to take risks to start and run businesses.",
            exampleSentence: "Her entrepreneurial spirit led her to start three successful companies.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "adjective",
            type: "academic",
            cefrLevel: "C1",
            context: "Excellent for discussing business culture and innovation.",
            collocations: ["entrepreneurial spirit", "entrepreneurial mindset", "entrepreneurial skills"],
            synonyms: [
                { word: "Business-minded", level: "Basic" },
                { word: "Enterprising", level: "Better" },
                { word: "Entrepreneurial", level: "Band 9" }
            ],
            speakingExample: "I don't see myself as very entrepreneurial because I get nervous about taking big financial risks.",
            writingExample: "An entrepreneurial culture encourages innovation and can stimulate long-term economic growth.",
            antonyms: ["risk-averse", "conservative"],
            relatedPhrasalVerbs: ["branch out", "roll out", "take over"]
        },
        {
            id: 3,
            word: "monopolise",
            definition: "To control all or most of a market so that others cannot compete fairly.",
            exampleSentence: "The company managed to monopolise the smartphone market in just five years.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "C1",
            context: "Used when discussing market competition and corporate power.",
            collocations: ["monopolise the market", "monopolise resources", "effectively monopolise"],
            synonyms: [
                { word: "Control", level: "Basic" },
                { word: "Dominate", level: "Better" },
                { word: "Monopolise", level: "Band 9" }
            ],
            speakingExample: "Some people think big tech companies monopolise too many online services, and smaller start-ups don't stand a chance.",
            writingExample: "When a single corporation monopolises an industry, consumer choice is restricted and prices tend to rise.",
            antonyms: ["share", "liberalise"],
            relatedPhrasalVerbs: ["take over", "cash in on", "phase out"]
        },
        {
            id: 4,
            word: "diversification",
            definition: "The process of adding new products or activities in order to reduce risk.",
            exampleSentence: "The company's diversification strategy helped it survive the economic downturn.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "Essential for discussing business strategy and economics.",
            collocations: ["business diversification", "diversification strategy", "portfolio diversification"],
            synonyms: [
                { word: "Variety", level: "Basic" },
                { word: "Expansion", level: "Better" },
                { word: "Diversification", level: "Band 9" }
            ],
            speakingExample: "In my country, a lot of farmers are trying diversification, so they don't rely only on rice any more.",
            writingExample: "Economic diversification reduces dependence on a single sector and strengthens a country's resilience to global shocks.",
            antonyms: ["specialisation", "concentration"],
            relatedPhrasalVerbs: ["branch out", "scale up", "roll out"]
        },
        {
            id: 5,
            word: "profitability",
            definition: "The degree to which a business makes a profit.",
            exampleSentence: "The CEO focused on improving the company's profitability.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "Key term for business and financial discussions.",
            collocations: ["improve profitability", "long-term profitability", "profitability ratio"],
            synonyms: [
                { word: "Profit level", level: "Basic" },
                { word: "Earnings", level: "Better" },
                { word: "Profitability", level: "Band 9" }
            ],
            speakingExample: "Start-ups often focus on growth first, and they're not really worried about profitability at the beginning.",
            writingExample: "Shareholders increasingly demand short-term profitability, which may discourage firms from investing in sustainable practices.",
            antonyms: ["losses", "unprofitability"],
            relatedPhrasalVerbs: ["break even", "cash in on", "scale up"]
        },
        {
            id: 6,
            word: "viability",
            definition: "The ability of a plan or business to work successfully.",
            exampleSentence: "We need to assess the viability of this project before investing.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "Used for evaluating business plans and proposals.",
            collocations: ["commercial viability", "assess viability", "question the viability"],
            synonyms: [
                { word: "Workability", level: "Basic" },
                { word: "Feasibility", level: "Better" },
                { word: "Viability", level: "Band 9" }
            ],
            speakingExample: "Before opening a café, you've really got to check the financial viability of the idea.",
            writingExample: "The long-term viability of small local shops is threatened by the expansion of large supermarket chains.",
            antonyms: ["impracticality", "unsustainability"],
            relatedPhrasalVerbs: ["break even", "roll out", "phase out"]
        },
        {
            id: 7,
            word: "synergy",
            definition: "Extra advantages that result when two companies or activities work together.",
            exampleSentence: "The merger created synergy between the two companies' research departments.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "Important for discussing partnerships and mergers.",
            collocations: ["create synergy", "synergy between departments", "synergy effects"],
            synonyms: [
                { word: "Cooperation", level: "Basic" },
                { word: "Combined effect", level: "Better" },
                { word: "Synergy", level: "Band 9" }
            ],
            speakingExample: "When two creative people work together, there's often a real synergy and the ideas just flow.",
            writingExample: "Corporate mergers are frequently justified on the basis of expected synergies in production and marketing.",
            antonyms: ["conflict", "disconnect"],
            relatedPhrasalVerbs: ["branch out", "scale up", "take over"]
        },
        {
            id: 8,
            word: "benchmark",
            definition: "A standard used to compare performance or quality.",
            exampleSentence: "This report sets the benchmark for future industry standards.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "Used for discussing standards and comparisons.",
            collocations: ["industry benchmark", "set a benchmark", "benchmark against competitors"],
            synonyms: [
                { word: "Standard", level: "Basic" },
                { word: "Criterion", level: "Better" },
                { word: "Benchmark", level: "Band 9" }
            ],
            speakingExample: "When I look for a job, salary isn't my only benchmark; I also care about work-life balance.",
            writingExample: "International rankings often serve as benchmarks for evaluating a country's competitiveness.",
            antonyms: ["anomaly", "outlier"],
            relatedPhrasalVerbs: ["scale up", "roll out", "break even"]
        },
        {
            id: 9,
            word: "incentivise",
            definition: "To encourage someone to do something by offering rewards.",
            exampleSentence: "The company incentivises employees with performance bonuses.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "C1",
            context: "Common in discussions about motivation and policy.",
            collocations: ["incentivise innovation", "incentivise employees", "financially incentivise"],
            synonyms: [
                { word: "Encourage", level: "Basic" },
                { word: "Motivate", level: "Better" },
                { word: "Incentivise", level: "Band 9" }
            ],
            speakingExample: "My company tries to incentivise staff with bonuses if we hit our sales targets, so we're all quite competitive.",
            writingExample: "Governments can incentivise environmentally friendly behaviour through targeted tax reductions.",
            antonyms: ["discourage", "deter"],
            relatedPhrasalVerbs: ["cash in on", "roll out", "scale up"]
        },
        {
            id: 10,
            word: "remuneration",
            definition: "Payment or salary received for work.",
            exampleSentence: "The remuneration package includes health insurance and pension contributions.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "Formal term for discussing salaries and compensation.",
            collocations: ["executive remuneration", "remuneration package", "fair remuneration"],
            synonyms: [
                { word: "Pay", level: "Basic" },
                { word: "Compensation", level: "Better" },
                { word: "Remuneration", level: "Band 9" }
            ],
            speakingExample: "Many graduates feel their remuneration doesn't match the cost of their education.",
            writingExample: "Transparent remuneration policies help reduce inequality within organisations.",
            antonyms: ["non-payment", "underpayment"],
            relatedPhrasalVerbs: ["break even", "cash in on", "bail out"]
        },
        {
            id: 11,
            word: "liquidity",
            definition: "The ability of a company to pay its debts using available cash.",
            exampleSentence: "The bank maintained strong liquidity throughout the crisis.",
            difficultyLevel: 9,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "Essential for financial and economic discussions.",
            collocations: ["liquidity crisis", "maintain liquidity", "liquidity ratio"],
            synonyms: [
                { word: "Cash flow", level: "Basic" },
                { word: "Solvency", level: "Better" },
                { word: "Liquidity", level: "Band 9" }
            ],
            speakingExample: "During the pandemic, a lot of small shops had serious liquidity problems and they couldn't survive without bank loans.",
            writingExample: "Central banks often intervene in financial markets to provide liquidity during periods of instability.",
            antonyms: ["illiquidity", "insolvency"],
            relatedPhrasalVerbs: ["bail out", "break even", "cash in on"]
        },
        {
            id: 12,
            word: "outsourcing",
            definition: "Paying another company to do part of a business's work.",
            exampleSentence: "The company reduced costs through outsourcing its IT department.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "Common topic in business strategy discussions.",
            collocations: ["IT outsourcing", "outsourcing strategy", "outsource production"],
            synonyms: [
                { word: "Subcontracting", level: "Basic" },
                { word: "Offshoring", level: "Better" },
                { word: "Outsourcing", level: "Band 9" }
            ],
            speakingExample: "Many companies in my city are cutting costs, so they're outsourcing customer service to other countries.",
            writingExample: "While outsourcing can reduce expenses, it may also lead to job losses in the domestic labour market.",
            antonyms: ["in-house production", "insourcing"],
            relatedPhrasalVerbs: ["phase out", "scale up", "roll out"]
        },
        {
            id: 13,
            word: "saturation",
            definition: "The point at which no more of a product can be sold because everyone who wants it already has it.",
            exampleSentence: "The smartphone market is approaching saturation in developed countries.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "Used when discussing market conditions and growth limits.",
            collocations: ["market saturation", "reach saturation", "saturation point"],
            synonyms: [
                { word: "Full coverage", level: "Basic" },
                { word: "Overcrowding", level: "Better" },
                { word: "Saturation", level: "Band 9" }
            ],
            speakingExample: "The smartphone market has almost reached saturation, so they're focusing on tiny upgrades now.",
            writingExample: "In saturated markets, firms must innovate constantly in order to maintain or increase their market share.",
            antonyms: ["scarcity", "shortage"],
            relatedPhrasalVerbs: ["branch out", "roll out", "cash in on"]
        },
        {
            id: 14,
            word: "merger",
            definition: "The process of two companies joining to form a single company.",
            exampleSentence: "The merger between the two banks created one of the largest financial institutions.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "Essential for corporate and business news discussions.",
            collocations: ["corporate merger", "proposed merger", "merger and acquisition"],
            synonyms: [
                { word: "Union", level: "Basic" },
                { word: "Amalgamation", level: "Better" },
                { word: "Merger", level: "Band 9" }
            ],
            speakingExample: "When the two airlines announced their merger, a lot of staff said they're really worried about losing their jobs.",
            writingExample: "Regulators should carefully examine large mergers to prevent excessive concentration of market power.",
            antonyms: ["split", "divestment"],
            relatedPhrasalVerbs: ["take over", "bail out", "scale up"]
        },
        {
            id: 15,
            word: "acquisition",
            definition: "The act of one company buying another company.",
            exampleSentence: "The acquisition of the startup cost the tech giant over one billion dollars.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            context: "Common in business and corporate discussions.",
            collocations: ["hostile acquisition", "strategic acquisition", "acquisition target"],
            synonyms: [
                { word: "Purchase", level: "Basic" },
                { word: "Takeover", level: "Better" },
                { word: "Acquisition", level: "Band 9" }
            ],
            speakingExample: "That small app became famous after a huge acquisition by a global tech giant, and now it's known all over the world.",
            writingExample: "Cross-border acquisitions can facilitate the transfer of technology and management expertise.",
            antonyms: ["sale", "disposal"],
            relatedPhrasalVerbs: ["take over", "cash in on", "break even"]
        },
        {
            id: 16,
            word: "subsidise",
            definition: "To pay part of the cost of something to keep its price low.",
            exampleSentence: "The government subsidises public transportation to keep it affordable.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "C1",
            context: "Important for economic and policy discussions.",
            collocations: ["subsidise agriculture", "state-subsidised industry", "government-subsidised housing"],
            synonyms: [
                { word: "Fund", level: "Basic" },
                { word: "Support financially", level: "Better" },
                { word: "Subsidise", level: "Band 9" }
            ],
            speakingExample: "I think the government should subsidise public transport so young people don't rely on cars so much.",
            writingExample: "When governments subsidise uncompetitive industries, public funds may be diverted from essential services.",
            antonyms: ["tax heavily", "withdraw support"],
            relatedPhrasalVerbs: ["bail out", "phase out", "roll out"]
        },
        {
            id: 17,
            word: "streamline",
            definition: "To make a system or process simpler and more efficient.",
            exampleSentence: "The new software will streamline our workflow significantly.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "C1",
            context: "Used for discussing efficiency improvements.",
            collocations: ["streamline operations", "streamline procedures", "streamline the process"],
            synonyms: [
                { word: "Simplify", level: "Basic" },
                { word: "Rationalise", level: "Better" },
                { word: "Streamline", level: "Band 9" }
            ],
            speakingExample: "My manager is always trying to streamline our meetings so we don't waste time.",
            writingExample: "By streamlining administrative processes, companies can reduce costs and respond more quickly to market changes.",
            antonyms: ["complicate", "slow down"],
            relatedPhrasalVerbs: ["scale up", "roll out", "phase out"]
        },
        {
            id: 18,
            word: "consolidate",
            definition: "To make a business stronger by combining it with others or by making it more effective.",
            exampleSentence: "The company consolidated its position in the market through strategic partnerships.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "C1",
            context: "Important for discussing business growth and strategy.",
            collocations: ["consolidate market position", "consolidate resources", "consolidate control"],
            synonyms: [
                { word: "Strengthen", level: "Basic" },
                { word: "Stabilise", level: "Better" },
                { word: "Consolidate", level: "Band 9" }
            ],
            speakingExample: "After a few successful years, the company tried to consolidate its position before expanding abroad, so it didn't rush into new markets.",
            writingExample: "Large retailers have consolidated their power, making it difficult for independent shops to survive.",
            antonyms: ["weaken", "fragment"],
            relatedPhrasalVerbs: ["take over", "scale up", "branch out"]
        },

        // ===== PHRASAL VERBS =====
        {
            id: 19,
            word: "break even",
            definition: "To earn enough money to cover costs but not make a profit.",
            exampleSentence: "It took the startup two years to break even.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "phrasal verb",
            type: "phrasal_verb",
            cefrLevel: "C1",
            context: "Essential for discussing business finances.",
            collocations: ["break even point", "manage to break even", "barely break even"],
            synonyms: [
                { word: "Cover costs", level: "Basic" },
                { word: "Reach balance", level: "Better" },
                { word: "Break even", level: "Band 9" }
            ],
            speakingExample: "My online shop isn't making much yet, but at least it breaks even most months so I don't lose money.",
            writingExample: "New enterprises typically require several years to break even and begin generating consistent profits.",
            antonyms: ["make a loss", "generate a deficit"],
            relatedPhrasalVerbs: ["cash in on", "scale up", "branch out"]
        },
        {
            id: 20,
            word: "branch out",
            definition: "To start doing a new type of business.",
            exampleSentence: "The restaurant successfully branched out into catering services.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "phrasal verb",
            type: "phrasal_verb",
            cefrLevel: "C1",
            context: "Used for discussing business expansion.",
            collocations: ["branch out into", "decide to branch out", "encourage firms to branch out"],
            synonyms: [
                { word: "Expand", level: "Basic" },
                { word: "Diversify", level: "Better" },
                { word: "Branch out", level: "Band 9" }
            ],
            speakingExample: "Our family business started with clothes, and we've branched out into accessories and cosmetics.",
            writingExample: "In order to remain competitive, companies increasingly branch out into digital services.",
            antonyms: ["focus", "narrow down"],
            relatedPhrasalVerbs: ["roll out", "scale up", "take over"]
        },
        {
            id: 21,
            word: "scale up",
            definition: "To increase the size or amount of something, especially production.",
            exampleSentence: "The factory plans to scale up production next quarter.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "phrasal verb",
            type: "phrasal_verb",
            cefrLevel: "C1",
            context: "Common in discussions about growth and expansion.",
            collocations: ["scale up production", "scale up operations", "plan to scale up"],
            synonyms: [
                { word: "Increase", level: "Basic" },
                { word: "Expand", level: "Better" },
                { word: "Scale up", level: "Band 9" }
            ],
            speakingExample: "If the new product works and it's popular, the company will scale up quickly to meet demand.",
            writingExample: "Governments must scale up investment in renewable energy to meet international climate targets.",
            antonyms: ["scale down", "reduce", "cut back"],
            relatedPhrasalVerbs: ["roll out", "branch out", "break even"]
        },
        {
            id: 22,
            word: "take over",
            definition: "To gain control of another company by buying enough of its shares.",
            exampleSentence: "The multinational corporation took over its main competitor last month.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "phrasal verb",
            type: "phrasal_verb",
            cefrLevel: "C1",
            context: "Essential for corporate and business news.",
            collocations: ["take over a rival", "attempt to take over", "take over the company"],
            synonyms: [
                { word: "Buy out", level: "Basic" },
                { word: "Acquire", level: "Better" },
                { word: "Take over", level: "Band 9" }
            ],
            speakingExample: "A big multinational took over my friend's small start-up, and now he's suddenly very rich.",
            writingExample: "When foreign corporations take over local firms, cultural and management conflicts may arise.",
            antonyms: ["sell off", "give up control"],
            relatedPhrasalVerbs: ["bail out", "scale up", "cash in on"]
        },
        {
            id: 23,
            word: "bail out",
            definition: "To help a person or organisation in financial difficulty by giving or lending money.",
            exampleSentence: "The government had to bail out several major banks during the financial crisis.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "phrasal verb",
            type: "phrasal_verb",
            cefrLevel: "C1",
            context: "Common in financial crisis discussions.",
            collocations: ["government bail out", "bail out a bank", "refuse to bail out"],
            synonyms: [
                { word: "Save", level: "Basic" },
                { word: "Rescue", level: "Better" },
                { word: "Bail out", level: "Band 9" }
            ],
            speakingExample: "During the crisis, the government bailed out several airlines so thousands of people wouldn't lose their jobs.",
            writingExample: "Critics argue that states should not bail out irresponsible financial institutions with taxpayers' money.",
            antonyms: ["let fail", "abandon"],
            relatedPhrasalVerbs: ["break even", "take over", "phase out"]
        },
        {
            id: 24,
            word: "cash in on",
            definition: "To use a situation to gain money or advantage, often in an unfair way.",
            exampleSentence: "Many companies are trying to cash in on the health food trend.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "phrasal verb",
            type: "phrasal_verb",
            cefrLevel: "C1",
            context: "Used for discussing opportunistic business behaviour.",
            collocations: ["cash in on a trend", "eager to cash in on", "try to cash in on"],
            synonyms: [
                { word: "Profit from", level: "Basic" },
                { word: "Exploit", level: "Better" },
                { word: "Cash in on", level: "Band 9" }
            ],
            speakingExample: "A lot of companies are cashing in on the fitness trend by selling expensive health apps, and they're making huge profits.",
            writingExample: "Some corporations attempt to cash in on environmental concerns through misleading 'green' marketing.",
            antonyms: ["miss out on", "ignore"],
            relatedPhrasalVerbs: ["roll out", "branch out", "scale up"]
        },
        {
            id: 25,
            word: "roll out",
            definition: "To introduce a new product or service to the market.",
            exampleSentence: "The company will roll out its new software platform next month.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "phrasal verb",
            type: "phrasal_verb",
            cefrLevel: "C1",
            context: "Common for product launches and introductions.",
            collocations: ["roll out a product", "nationwide roll out", "plan to roll out"],
            synonyms: [
                { word: "Bring out", level: "Basic" },
                { word: "Launch", level: "Better" },
                { word: "Roll out", level: "Band 9" }
            ],
            speakingExample: "My company is rolling out a new app next month, so we're really busy testing it.",
            writingExample: "Many banks are rolling out digital platforms in order to reduce dependence on physical branches.",
            antonyms: ["withdraw", "phase out"],
            relatedPhrasalVerbs: ["scale up", "cash in on", "branch out"]
        },
        {
            id: 26,
            word: "phase out",
            definition: "To gradually stop using or providing something.",
            exampleSentence: "The manufacturer is phasing out its older product lines.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "phrasal verb",
            type: "phrasal_verb",
            cefrLevel: "C1",
            context: "Used for discussing gradual discontinuation.",
            collocations: ["phase out subsidies", "phase out old equipment", "plan to phase out"],
            synonyms: [
                { word: "Withdraw", level: "Basic" },
                { word: "Eliminate gradually", level: "Better" },
                { word: "Phase out", level: "Band 9" }
            ],
            speakingExample: "Some countries are slowly phasing out coal, and they're investing more in solar energy.",
            writingExample: "Governments should phase out tax breaks for polluting industries and redirect support towards cleaner alternatives.",
            antonyms: ["phase in", "introduce", "expand"],
            relatedPhrasalVerbs: ["roll out", "bail out", "scale up"]
        },

        // ===== IDIOMS =====
        {
            id: 27,
            word: "in the red",
            definition: "Owing more money than you have; operating at a loss.",
            exampleSentence: "The company has been in the red for three consecutive quarters.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "idiom",
            type: "idiom",
            cefrLevel: "C1",
            context: "Common idiom for describing financial losses.",
            collocations: ["deep in the red", "fall into the red", "remain in the red"],
            synonyms: [
                { word: "Unprofitable", level: "Basic" },
                { word: "Loss-making", level: "Better" },
                { word: "In the red", level: "Band 9" }
            ],
            speakingExample: "My first business stayed in the red for two years, and I'd almost given up on it.",
            writingExample: "If public hospitals operate in the red for prolonged periods, service quality is likely to decline.",
            antonyms: ["in the black", "profitable"],
            relatedPhrasalVerbs: ["bail out", "break even", "cash in on"]
        },
        {
            id: 28,
            word: "in the black",
            definition: "Having money in your account; making a profit.",
            exampleSentence: "After years of losses, the company is finally in the black.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "idiom",
            type: "idiom",
            cefrLevel: "C1",
            context: "Common idiom for describing profitable operations.",
            collocations: ["stay in the black", "firmly in the black", "keep the company in the black"],
            synonyms: [
                { word: "Profitable", level: "Basic" },
                { word: "Solvent", level: "Better" },
                { word: "In the black", level: "Band 9" }
            ],
            speakingExample: "After a tough start, my friend's bakery is finally doing well and it's in the black.",
            writingExample: "Small enterprises that remain in the black during recessions often display cautious financial management.",
            antonyms: ["in the red", "insolvent"],
            relatedPhrasalVerbs: ["break even", "scale up", "roll out"]
        },
        {
            id: 29,
            word: "cut corners",
            definition: "To save time or money by doing something in a cheap or lazy way.",
            exampleSentence: "The contractor cut corners on materials, resulting in safety issues.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "idiom",
            type: "idiom",
            cefrLevel: "C1",
            context: "Used when discussing quality vs cost trade-offs.",
            collocations: ["cut corners on safety", "tempted to cut corners", "habit of cutting corners"],
            synonyms: [
                { word: "Take shortcuts", level: "Basic" },
                { word: "Skimp", level: "Better" },
                { word: "Cut corners", level: "Band 9" }
            ],
            speakingExample: "Some factories cut corners on safety, and it's really dangerous for workers.",
            writingExample: "When firms cut corners in order to reduce costs, consumers may suffer from lower product quality.",
            antonyms: ["follow standards", "do properly"],
            relatedPhrasalVerbs: ["phase out", "roll out", "cash in on"]
        },
        {
            id: 30,
            word: "the bottom line",
            definition: "The most important fact or result, especially the final profit or loss.",
            exampleSentence: "The bottom line is that we need to increase sales by 20%.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "idiom",
            type: "idiom",
            cefrLevel: "C1",
            context: "Common in business and financial discussions.",
            collocations: ["improve the bottom line", "focus on the bottom line", "bottom-line result"],
            synonyms: [
                { word: "Key point", level: "Basic" },
                { word: "Final result", level: "Better" },
                { word: "The bottom line", level: "Band 9" }
            ],
            speakingExample: "In my company, the bottom line is profit, so managers don't care much about work-life balance.",
            writingExample: "When executives focus only on the bottom line, social and environmental responsibilities are often neglected.",
            antonyms: ["secondary issue", "side effect"],
            relatedPhrasalVerbs: ["break even", "cash in on", "scale up"]
        },
        {
            id: 31,
            word: "corner the market",
            definition: "To become so successful that you control most of the sales of a product.",
            exampleSentence: "The company has effectively cornered the market for organic baby food.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "idiom",
            type: "idiom",
            cefrLevel: "C1",
            context: "Used when discussing market dominance.",
            collocations: ["try to corner the market", "almost corner the market", "corner the global market"],
            synonyms: [
                { word: "Dominate", level: "Basic" },
                { word: "Monopolise", level: "Better" },
                { word: "Corner the market", level: "Band 9" }
            ],
            speakingExample: "Big online retailers have grown so fast that they've almost cornered the market for books in my country.",
            writingExample: "Digital platforms that corner the market in a particular sector can pose serious challenges for regulators.",
            antonyms: ["share the market", "compete fairly"],
            relatedPhrasalVerbs: ["take over", "scale up", "cash in on"]
        },
        {
            id: 32,
            word: "a win-win situation",
            definition: "A situation where everyone involved gets benefits.",
            exampleSentence: "The partnership proved to be a win-win situation for both companies.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "idiom",
            type: "idiom",
            cefrLevel: "C1",
            context: "Common for describing mutually beneficial outcomes.",
            collocations: ["create a win-win situation", "genuinely win-win", "win-win outcome"],
            synonyms: [
                { word: "Advantageous for all", level: "Basic" },
                { word: "Mutually beneficial", level: "Better" },
                { word: "Win-win situation", level: "Band 9" }
            ],
            speakingExample: "Working from home can be a win-win situation because staff save time and it's great for companies too.",
            writingExample: "Investing in renewable energy often represents a win-win situation for both the economy and the environment.",
            antonyms: ["zero-sum game", "lose-lose situation"],
            relatedPhrasalVerbs: ["branch out", "roll out", "scale up"]
        },
        {
            id: 33,
            word: "get down to business",
            definition: "To start dealing seriously with the important part of something.",
            exampleSentence: "After the introductions, the CEO suggested they get down to business.",
            difficultyLevel: 6,
            topic: "Business & Work",
            partOfSpeech: "idiom",
            type: "idiom",
            cefrLevel: "C1",
            context: "Used in meetings and negotiations.",
            collocations: ["finally get down to business", "ready to get down to business", "let us get down to business"],
            synonyms: [
                { word: "Start working seriously", level: "Basic" },
                { word: "Focus", level: "Better" },
                { word: "Get down to business", level: "Band 9" }
            ],
            speakingExample: "After some small talk in meetings, my boss always says we should get down to business so we don't waste time.",
            writingExample: "Once initial negotiations conclude, both sides must get down to business and address specific contractual terms.",
            antonyms: ["waste time", "delay"],
            relatedPhrasalVerbs: ["roll out", "scale up", "branch out"]
        },
        {
            id: 34,
            word: "ahead of the curve",
            definition: "More advanced or innovative than others.",
            exampleSentence: "The company stays ahead of the curve by investing heavily in R&D.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "idiom",
            type: "idiom",
            cefrLevel: "C1",
            context: "Used for discussing innovation and leadership.",
            collocations: ["stay ahead of the curve", "remain ahead of the curve", "keep ahead of the curve"],
            synonyms: [
                { word: "Leading", level: "Basic" },
                { word: "Innovative", level: "Better" },
                { word: "Ahead of the curve", level: "Band 9" }
            ],
            speakingExample: "Tech companies have to stay ahead of the curve or customers will switch to new apps really quickly.",
            writingExample: "Firms that invest heavily in research and development often remain ahead of the curve in highly competitive markets.",
            antonyms: ["behind the curve", "outdated"],
            relatedPhrasalVerbs: ["roll out", "branch out", "cash in on"]
        }
    ],

    exercises: {
        synonymSwap: [
            // ===== NEW ENHANCED FORMAT =====
            {
                id: 1,
                target_word: "lucrative",
                instruction: "Replace the highlighted phrase with the C1 word \"lucrative\" without changing the meaning.",
                sentence_original: "Starting a small online shop can be very profitable if you find the right niche.",
                replace_this: "very profitable",
                sentence_answer: "Starting a small online shop can be very lucrative if you find the right niche."
            },
            {
                id: 2,
                target_word: "entrepreneurial",
                instruction: "Replace the highlighted phrase with the C1 word \"entrepreneurial\".",
                sentence_original: "Universities should help students who are willing to start businesses by offering training and mentoring.",
                replace_this: "students who are willing to start businesses",
                sentence_answer: "Universities should help entrepreneurial students by offering training and mentoring."
            },
            {
                id: 3,
                target_word: "monopolise",
                instruction: "Replace the highlighted phrase with the C1 verb \"monopolise\".",
                sentence_original: "Many people worry that a few large companies control almost all online advertising.",
                replace_this: "control almost all",
                sentence_answer: "Many people worry that a few large companies monopolise online advertising."
            },
            {
                id: 4,
                target_word: "diversification",
                instruction: "Replace the highlighted phrase with the C1 noun \"diversification\".",
                sentence_original: "The farming community is trying to reduce risk by adding different types of crops and activities.",
                replace_this: "adding different types of crops and activities",
                sentence_answer: "The farming community is trying to reduce risk through diversification."
            },
            {
                id: 5,
                target_word: "profitability",
                instruction: "Replace the highlighted phrase with the C1 noun \"profitability\".",
                sentence_original: "In many companies, managers care more about the level of profit than about employee welfare.",
                replace_this: "the level of profit",
                sentence_answer: "In many companies, managers care more about profitability than about employee welfare."
            },
            {
                id: 6,
                target_word: "viability",
                instruction: "Replace the highlighted phrase with the C1 noun \"viability\".",
                sentence_original: "Before opening a new branch, the owner must check whether the plan is really possible in financial terms.",
                replace_this: "really possible in financial terms",
                sentence_answer: "Before opening a new branch, the owner must check the financial viability of the plan."
            },
            {
                id: 7,
                target_word: "streamline",
                instruction: "Replace the highlighted phrase with the C1 verb \"streamline\".",
                sentence_original: "The firm wants to make its internal procedures simpler and more efficient.",
                replace_this: "make its internal procedures simpler and more efficient",
                sentence_answer: "The firm wants to streamline its internal procedures."
            },
            {
                id: 8,
                target_word: "consolidate",
                instruction: "Replace the highlighted phrase with the C1 verb \"consolidate\".",
                sentence_original: "After rapid growth, the organisation needs to make its position in the market stronger.",
                replace_this: "make its position in the market stronger",
                sentence_answer: "After rapid growth, the organisation needs to consolidate its position in the market."
            },
            {
                id: 9,
                target_word: "subsidise",
                instruction: "Replace the highlighted phrase with the C1 verb \"subsidise\".",
                sentence_original: "Some governments still pay part of the cost of fossil fuels, which slows the move towards cleaner energy.",
                replace_this: "pay part of the cost of fossil fuels",
                sentence_answer: "Some governments still subsidise fossil fuels, which slows the move towards cleaner energy."
            },
            {
                id: 10,
                target_word: "outsourcing",
                instruction: "Replace the highlighted phrase with the C1 noun \"outsourcing\".",
                sentence_original: "By paying another company to perform customer service, the firm reduced its labour costs.",
                replace_this: "paying another company to perform customer service",
                sentence_answer: "By outsourcing customer service, the firm reduced its labour costs."
            },
            {
                id: 11,
                target_word: "break even",
                instruction: "Replace the highlighted phrase with the C1 phrasal verb \"break even\".",
                sentence_original: "Most new restaurants only manage to cover their costs after one or two years.",
                replace_this: "cover their costs",
                sentence_answer: "Most new restaurants only manage to break even after one or two years."
            },
            {
                id: 12,
                target_word: "in the red",
                instruction: "Replace the highlighted phrase with the C1 idiom \"in the red\".",
                sentence_original: "Due to the lockdown, many small shops were operating at a loss for months.",
                replace_this: "operating at a loss",
                sentence_answer: "Due to the lockdown, many small shops were in the red for months."
            }
        ],

        contextTetris: [
            // ===== NEW ENHANCED FORMAT =====
            {
                id: 1,
                set_name: "Academic_nouns_1",
                instruction: "Choose the correct word from the word bank to complete each sentence. Each word is used once.",
                word_bank: ["diversification", "outsourcing", "liquidity", "acquisition", "benchmark"],
                items: [
                    { item_id: 1, gap_sentence: "Many schools use international rankings as a ___ to measure their performance.", answer: "benchmark" },
                    { item_id: 2, gap_sentence: "The government is worried about the bank's low ___, because it may struggle to pay its short term debts.", answer: "liquidity" },
                    { item_id: 3, gap_sentence: "To reduce dependence on oil, the country is pursuing economic ___ in tourism and technology.", answer: "diversification" },
                    { item_id: 4, gap_sentence: "The sudden ___ of a rival firm gave the company instant access to new markets.", answer: "acquisition" },
                    { item_id: 5, gap_sentence: "By moving technical support to another country, the company increased its profits through ___.", answer: "outsourcing" }
                ]
            },
            {
                id: 2,
                set_name: "Phrasal_verbs_1",
                instruction: "Insert the correct phrasal verb from the word bank. Use each item once.",
                word_bank: ["break even", "scale up", "roll out", "branch out", "phase out"],
                items: [
                    { item_id: 1, gap_sentence: "Once the start-up finally managed to ___, the founders began to pay themselves a salary.", answer: "break even" },
                    { item_id: 2, gap_sentence: "The factory plans to ___ production next year in order to meet growing demand.", answer: "scale up" },
                    { item_id: 3, gap_sentence: "The bank will ___ its new mobile app across all regions next month.", answer: "roll out" },
                    { item_id: 4, gap_sentence: "After ten years in the clothing business, the firm decided to ___ into home accessories.", answer: "branch out" },
                    { item_id: 5, gap_sentence: "Many countries aim to ___ coal power plants over the next two decades.", answer: "phase out" }
                ]
            },
            {
                id: 3,
                set_name: "Idioms_1",
                instruction: "Complete each sentence with one idiom from the word bank. Each idiom is used once.",
                word_bank: ["in the red", "cut corners", "get down to business", "ahead of the curve", "a win-win situation"],
                items: [
                    { item_id: 1, gap_sentence: "The company had been ___ for several years before a larger competitor bought it.", answer: "in the red" },
                    { item_id: 2, gap_sentence: "The builder refused to ___ on safety, even when the client asked for a cheaper price.", answer: "cut corners" },
                    { item_id: 3, gap_sentence: "After a few minutes of polite conversation, the manager suggested that everyone should ___ and start the negotiation.", answer: "get down to business" },
                    { item_id: 4, gap_sentence: "Firms that invest in artificial intelligence now will be ___ when the technology becomes mainstream.", answer: "ahead of the curve" },
                    { item_id: 5, gap_sentence: "Allowing staff to work from home can create ___, because employees gain flexibility and employers save on office costs.", answer: "a win-win situation" }
                ]
            }
        ],
        speakToUnlock: []
    }
};
