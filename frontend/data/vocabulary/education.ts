import { TopicData } from "./types";

export const educationTopicData: TopicData = {
    topic: {
        id: 3,
        name: "Education",
        icon: "🎓",
        description: "Vocabulary related to schools, universities, and learning",
        wordsCount: 28,
        color: "bg-purple-500",
        ieltsSection: "writing",
        status: "mastered",
        previewWords: ["curriculum", "pedagogy", "literacy"],
        progress: 28,
    },
    words: [
        {
            id: 1,
            word: "curriculum",
            pronunciation: "/kəˈrɪkjələm/",
            definition: "The subjects comprising a course of study in a school or college.",
            exampleSentence: "The school is planning to introduce a new curriculum next year.",
            difficultyLevel: 3,
            partOfSpeech: "noun",
            topic: "Education",
            type: "academic",
            synonyms: [
                { word: "syllabus", level: "B2" },
                { word: "coursework", level: "B1" },
                { word: "program", level: "B1" }
            ],
            collocations: ["core curriculum", "school curriculum"]
        }
    ],
    exercises: {
        synonymSwap: [],
        contextTetris: []
    }
};
