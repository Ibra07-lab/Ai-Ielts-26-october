// Shared types for vocabulary data

export interface WordData {
    id: number;
    word: string;
    definition: string;
    exampleSentence: string;
    difficultyLevel: number;
    topic: string;
    partOfSpeech: string;
    audioUrl?: string;
    context?: string;
    collocations?: string[];
    synonyms?: { word: string; level: string }[];
}

export interface Topic {
    id: number;
    name: string;
    icon: string;
    description: string;
    wordsCount: number;
    color: string;
}

export interface SynonymSwapExercise {
    sentence: string;
    targetWord: string;
    options: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
        feedback: string;
    }>;
}

export interface ContextTetrisExercise {
    paragraph: string;
    gaps: Array<{
        id: string;
        correctWordId: string;
        placeholder: string;
    }>;
    bubbles: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
        feedback: string;
    }>;
}

export interface SpeakToUnlockExercise {
    question: string;
    targetWords: string[];
}

export interface TopicData {
    topic: Topic;
    words: WordData[];
    exercises: {
        synonymSwap: SynonymSwapExercise[];
        contextTetris: ContextTetrisExercise[];
        speakToUnlock: SpeakToUnlockExercise[];
    };
}
