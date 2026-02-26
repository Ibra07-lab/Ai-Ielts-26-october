import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserWordProgress, WordData } from '../data/vocabulary/types';
import { SRSGrade, SRSState, calculateReview, INITIAL_SRS_STATE } from '../lib/vocabulary/srs-engine';

interface VocabularyContextType {
    userProgress: Record<number, UserWordProgress>;
    dueWords: number[]; // IDs of words due for review
    markWordAsReviewed: (wordId: number, grade: SRSGrade) => void;
    getWordProgress: (wordId: number) => UserWordProgress | undefined;
    resetProgress: () => void;
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export const STORAGE_KEY = 'ielts_vocabulary_progress';

export function VocabularyProvider({ children }: { children: React.ReactNode }) {
    const [userProgress, setUserProgress] = useState<Record<number, UserWordProgress>>({});
    const [dueWords, setDueWords] = useState<number[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setUserProgress(parsed);
                updateDueWords(parsed);
            } catch (e) {
                console.error("Failed to parse vocabulary progress", e);
            }
        }
    }, []);

    // Save to localStorage whenever progress changes
    useEffect(() => {
        if (Object.keys(userProgress).length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
        }
    }, [userProgress]);

    const updateDueWords = (progress: Record<number, UserWordProgress>) => {
        const now = Date.now();
        const due = Object.values(progress)
            .filter(p => p.srs.nextReview <= now)
            .map(p => p.wordId);
        setDueWords(due);
    };

    const markWordAsReviewed = (wordId: number, grade: SRSGrade) => {
        setUserProgress(prev => {
            const currentProgress = prev[wordId] || {
                wordId,
                srs: { ...INITIAL_SRS_STATE, nextReview: 0 },
                lastReviewed: 0,
                history: []
            };

            const srsState: SRSState = {
                interval: currentProgress.srs.interval,
                repetition: currentProgress.srs.repetition,
                easeFactor: currentProgress.srs.easeFactor
            };

            const result = calculateReview(srsState, grade);

            const updatedProgress: UserWordProgress = {
                ...currentProgress,
                srs: {
                    interval: result.interval,
                    repetition: result.repetition,
                    easeFactor: result.easeFactor,
                    nextReview: result.nextReviewDate
                },
                lastReviewed: Date.now(),
                history: [
                    ...currentProgress.history,
                    { date: Date.now(), grade }
                ]
            };

            const newProgress = { ...prev, [wordId]: updatedProgress };
            updateDueWords(newProgress); // Update immediate due list
            return newProgress;
        });
    };

    const getWordProgress = (wordId: number) => userProgress[wordId];

    const resetProgress = () => {
        if (confirm("Are you sure you want to reset all vocabulary progress? This cannot be undone.")) {
            setUserProgress({});
            setDueWords([]);
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    return (
        <VocabularyContext.Provider value={{
            userProgress,
            dueWords,
            markWordAsReviewed,
            getWordProgress,
            resetProgress
        }}>
            {children}
        </VocabularyContext.Provider>
    );
}

export function useVocabulary() {
    const context = useContext(VocabularyContext);
    if (context === undefined) {
        throw new Error('useVocabulary must be used within a VocabularyProvider');
    }
    return context;
}
