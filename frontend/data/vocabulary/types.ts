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
    // New enhanced fields
    type?: "academic" | "phrasal_verb" | "idiom" | "spoken";
    cefrLevel?: string;  // e.g., "C1", "B2"
    speakingExample?: string;
    writingExample?: string;
    antonyms?: string[];
    relatedPhrasalVerbs?: string[];
    pronunciation?: string;
}

export interface UserWordProgress {
    wordId: number;
    srs: {
        interval: number;
        repetition: number;
        easeFactor: number;
        nextReview: number; // timestamp
    };
    lastReviewed: number;
    history: { date: number; grade: number }[];
}

export interface Topic {
    id: number;
    name: string;
    icon: string;
    description: string;
    wordsCount: number;
    color: string;
    // New fields for redesign
    ieltsSection?: "reading" | "writing" | "speaking" | "listening";
    status?: "new" | "in_progress" | "mastered";
    previewWords?: string[];
    progress?: number;
}

export interface SynonymSwapExercise {
    // Legacy format support
    sentence?: string;
    targetWord?: string;
    options?: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
        feedback: string;
    }>;
    // New enhanced format
    id?: number;
    target_word?: string;
    instruction?: string;
    sentence_original?: string;
    replace_this?: string;
    sentence_answer?: string;
}

export interface ContextTetrisExercise {
    // Legacy format support
    paragraph?: string;
    gaps?: Array<{
        id: string;
        correctWordId: string;
        placeholder: string;
    }>;
    bubbles?: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
        feedback: string;
    }>;
    // New enhanced format
    id?: number;
    set_name?: string;
    instruction?: string;
    word_bank?: string[];
    items?: Array<{
        item_id: number;
        gap_sentence: string;
        answer: string | string[];
    }>;
}

export interface SpeakToUnlockExercise {
    id?: number;
    question: string;
    targetWords: string[];
}

export interface TopicData {
    topic: Topic;
    words: WordData[];
    exercises: {
        synonymSwap: SynonymSwapExercise[];
        writingSynonymSwap?: SynonymSwapExercise[];
        contextTetris: ContextTetrisExercise[];
        speakToUnlock: SpeakToUnlockExercise[];
    };
}
