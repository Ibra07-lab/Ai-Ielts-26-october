import { TopicData } from "./types";

/**
 * ENVIRONMENT VOCABULARY
 * 
 * This file contains all words and exercises for the Environment topic.
 * 
 * HOW TO ADD NEW WORDS:
 * 1. Add a new object to the 'words' array below
 * 2. Fill in all required fields (id, word, definition, etc.)
 * 3. The word will automatically appear in the vocabulary builder
 * 
 * HOW TO ADD NEW EXERCISES:
 * 1. Choose which exercise type (synonymSwap, contextTetris, or speakToUnlock)
 * 2. Add a new object to that exercise array
 * 3. Follow the existing format for that exercise type
 */

export const environmentTopicData: TopicData = {
    topic: {
        id: 2,
        name: "Environment",
        icon: "🌍",
        description: "Key environmental and sustainability vocabulary",
        wordsCount: 5,
        color: "bg-green-500",
    },

    words: [
        {
            id: 6,
            word: "sustainable",
            definition: "Able to be maintained at a certain rate or level without depleting resources",
            exampleSentence: "Sustainable development is crucial for future generations.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "adjective",
            context: "Essential for Writing Task 2 environmental essays.",
            collocations: ["Sustainable development", "Sustainable practices", "Sustainable solutions"],
            synonyms: [
                { word: "Eco-friendly", level: "Basic" },
                { word: "Environmentally sound", level: "Better" },
                { word: "Sustainable", level: "Band 9" }
            ]
        },
        {
            id: 7,
            word: "mitigate",
            definition: "Make less severe, serious, or painful",
            exampleSentence: "We need to mitigate the impact of climate change.",
            difficultyLevel: 9,
            topic: "Environment",
            partOfSpeech: "verb",
            context: "Perfect for discussing solutions to environmental problems.",
            collocations: ["Mitigate risks", "Mitigate effects", "Mitigate damage"],
            synonyms: [
                { word: "Reduce", level: "Basic" },
                { word: "Alleviate", level: "Better" },
                { word: "Mitigate", level: "Band 9" }
            ]
        },
        {
            id: 8,
            word: "biodiversity",
            definition: "The variety of plant and animal life in a particular habitat",
            exampleSentence: "Protecting biodiversity is essential for ecosystem health.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "noun",
            context: "Important for environmental discussions in Speaking Part 3.",
            collocations: ["Preserve biodiversity", "Biodiversity loss", "Rich biodiversity"],
            synonyms: [
                { word: "Different species", level: "Basic" },
                { word: "Ecological variety", level: "Better" },
                { word: "Biodiversity", level: "Band 9" }
            ]
        },
        {
            id: 9,
            word: "renewable",
            definition: "Not depleted when used; capable of being replenished",
            exampleSentence: "Renewable energy sources like solar and wind are becoming more affordable.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "adjective",
            context: "Key term for energy and environment topics.",
            collocations: ["Renewable energy", "Renewable resources", "Renewable power"],
            synonyms: [
                { word: "Clean energy", level: "Basic" },
                { word: "Green energy", level: "Better" },
                { word: "Renewable", level: "Band 9" }
            ]
        },
        {
            id: 10,
            word: "conservation",
            definition: "The action of conserving something, especially the environment",
            exampleSentence: "Wildlife conservation efforts have helped protect endangered species.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun",
            context: "Frequently used in environmental protection discussions.",
            collocations: ["Conservation efforts", "Environmental conservation", "Conservation measures"],
            synonyms: [
                { word: "Protection", level: "Basic" },
                { word: "Preservation", level: "Better" },
                { word: "Conservation", level: "Band 9" }
            ]
        }
    ],

    exercises: {
        synonymSwap: [
            {
                sentence: "We need to reduce the negative effects of pollution on our environment.",
                targetWord: "reduce",
                options: [
                    {
                        id: "1",
                        text: "mitigate",
                        isCorrect: true,
                        feedback: "Perfect! 'Mitigate' is a sophisticated way to say 'reduce the severity of'."
                    },
                    {
                        id: "2",
                        text: "make less",
                        isCorrect: false,
                        feedback: "Too simple! Use more academic vocabulary for higher band scores."
                    },
                    {
                        id: "3",
                        text: "stop",
                        isCorrect: false,
                        feedback: "'Stop' changes the meaning too much. 'Mitigate' means to reduce, not eliminate."
                    }
                ]
            }
        ],

        contextTetris: [
            {
                paragraph: "Climate change is a pressing issue that requires {gap-1} solutions. Governments must invest in {gap-2} energy sources and implement {gap-3} programs to protect endangered species.",
                gaps: [
                    { id: "gap-1", correctWordId: "word-1", placeholder: "long-term" },
                    { id: "gap-2", correctWordId: "word-2", placeholder: "clean" },
                    { id: "gap-3", correctWordId: "word-3", placeholder: "protection" }
                ],
                bubbles: [
                    { id: "word-1", text: "sustainable", isCorrect: true, feedback: "Correct! Sustainable means long-term and environmentally sound." },
                    { id: "word-2", text: "renewable", isCorrect: true, feedback: "Perfect! Renewable energy is clean and doesn't deplete resources." },
                    { id: "word-3", text: "conservation", isCorrect: true, feedback: "Excellent! Conservation refers to protection of the environment." },
                    { id: "word-4", text: "expensive", isCorrect: false, feedback: "This doesn't fit the environmental context." },
                    { id: "word-5", text: "difficult", isCorrect: false, feedback: "Too general and doesn't use academic vocabulary." }
                ]
            }
        ],

        speakToUnlock: [
            {
                question: "What can individuals do to protect the environment?",
                targetWords: ["sustainable", "renewable", "conservation"]
            },
            {
                question: "How can governments address climate change?",
                targetWords: ["mitigate", "biodiversity", "sustainable"]
            }
        ]
    }
};
