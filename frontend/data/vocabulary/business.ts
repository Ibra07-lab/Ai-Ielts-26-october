import { TopicData } from "./types";

/**
 * BUSINESS & WORK VOCABULARY
 * 
 * This file contains all words and exercises for the Business & Work topic.
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

export const businessTopicData: TopicData = {
    topic: {
        id: 1,
        name: "Business & Work",
        icon: "💼",
        description: "Essential vocabulary for discussing careers, workplace, and business",
        wordsCount: 5,
        color: "bg-blue-500",
    },

    words: [
        {
            id: 1,
            word: "lucrative",
            definition: "Producing a great deal of profit",
            exampleSentence: "She found a lucrative job in the tech industry.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "adjective",
            context: "Often used in Speaking Part 1 (Work) or Writing Task 2.",
            collocations: ["Highly lucrative", "Lucrative market", "Lucrative deal"],
            synonyms: [
                { word: "Good money", level: "Basic" },
                { word: "Profitable", level: "Better" },
                { word: "Lucrative", level: "Band 9" }
            ]
        },
        {
            id: 2,
            word: "collaborate",
            definition: "Work jointly on an activity or project",
            exampleSentence: "We collaborate with international teams on various projects.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "verb",
            context: "Common in Speaking Part 3 when discussing teamwork.",
            collocations: ["Collaborate effectively", "Collaborate closely", "Collaborate on projects"],
            synonyms: [
                { word: "Work together", level: "Basic" },
                { word: "Cooperate", level: "Better" },
                { word: "Collaborate", level: "Band 9" }
            ]
        },
        {
            id: 3,
            word: "meticulous",
            definition: "Showing great attention to detail; very careful and precise",
            exampleSentence: "He is meticulous in his work, ensuring every detail is perfect.",
            difficultyLevel: 8,
            topic: "Business & Work",
            partOfSpeech: "adjective",
            context: "Useful for describing work ethics and professional qualities.",
            collocations: ["Meticulous attention", "Meticulous planning", "Meticulous approach"],
            synonyms: [
                { word: "Careful", level: "Basic" },
                { word: "Thorough", level: "Better" },
                { word: "Meticulous", level: "Band 9" }
            ]
        },
        {
            id: 4,
            word: "initiative",
            definition: "The ability to assess and initiate things independently",
            exampleSentence: "Taking initiative is highly valued in our company culture.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun",
            context: "Excellent for describing desirable employee traits.",
            collocations: ["Take initiative", "Show initiative", "Lack of initiative"],
            synonyms: [
                { word: "Self-motivation", level: "Basic" },
                { word: "Proactiveness", level: "Better" },
                { word: "Initiative", level: "Band 9" }
            ]
        },
        {
            id: 5,
            word: "expertise",
            definition: "Expert skill or knowledge in a particular field",
            exampleSentence: "Her expertise in digital marketing is highly sought after.",
            difficultyLevel: 7,
            topic: "Business & Work",
            partOfSpeech: "noun",
            context: "Perfect for discussing professional qualifications and skills.",
            collocations: ["Technical expertise", "Professional expertise", "Develop expertise"],
            synonyms: [
                { word: "Skills", level: "Basic" },
                { word: "Proficiency", level: "Better" },
                { word: "Expertise", level: "Band 9" }
            ]
        }
    ],

    exercises: {
        synonymSwap: [
            {
                sentence: "This job is very good because it offers excellent career development opportunities.",
                targetWord: "good",
                options: [
                    {
                        id: "1",
                        text: "lucrative",
                        isCorrect: true,
                        feedback: "Perfect! 'Lucrative' is a Band 9 word meaning highly profitable or rewarding."
                    },
                    {
                        id: "2",
                        text: "nice",
                        isCorrect: false,
                        feedback: "Too simple! 'Nice' is too casual for academic IELTS writing."
                    },
                    {
                        id: "3",
                        text: "okay",
                        isCorrect: false,
                        feedback: "Not academic enough. Try to use more sophisticated vocabulary."
                    }
                ]
            },
            {
                sentence: "Employees should work together with their team members to achieve common goals.",
                targetWord: "work together",
                options: [
                    {
                        id: "1",
                        text: "collaborate",
                        isCorrect: true,
                        feedback: "Excellent! 'Collaborate' is the perfect academic synonym for 'work together'."
                    },
                    {
                        id: "2",
                        text: "help each other",
                        isCorrect: false,
                        feedback: "Too basic. This phrase is too simple for high-band IELTS responses."
                    },
                    {
                        id: "3",
                        text: "do stuff",
                        isCorrect: false,
                        feedback: "Far too informal! Never use such casual language in IELTS."
                    }
                ]
            }
        ],

        contextTetris: [
            {
                paragraph: "In today's competitive job market, having {gap-1} in a specialized field is essential. Employers value candidates who can take {gap-2} and demonstrate {gap-3} attention to detail in their work.",
                gaps: [
                    { id: "gap-1", correctWordId: "word-1", placeholder: "specialized knowledge" },
                    { id: "gap-2", correctWordId: "word-2", placeholder: "independent action" },
                    { id: "gap-3", correctWordId: "word-3", placeholder: "careful" }
                ],
                bubbles: [
                    { id: "word-1", text: "expertise", isCorrect: true, feedback: "Correct! 'Expertise' perfectly describes specialized knowledge." },
                    { id: "word-2", text: "initiative", isCorrect: true, feedback: "Perfect! 'Initiative' means taking independent action." },
                    { id: "word-3", text: "meticulous", isCorrect: true, feedback: "Excellent! 'Meticulous' means showing great attention to detail." },
                    { id: "word-4", text: "lazy", isCorrect: false, feedback: "This doesn't fit the positive context of the paragraph." },
                    { id: "word-5", text: "boring", isCorrect: false, feedback: "This is too negative and doesn't match the professional tone." }
                ]
            }
        ],

        speakToUnlock: [
            {
                question: "Why do you think this job would be suitable for you?",
                targetWords: ["lucrative", "expertise", "initiative"]
            },
            {
                question: "How do you work with your colleagues on team projects?",
                targetWords: ["collaborate", "meticulous", "expertise"]
            }
        ]
    }
};
