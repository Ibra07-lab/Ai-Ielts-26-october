/**
 * Demo Seed — Simulates a student learning Education vocabulary over 14 days.
 * 
 * Scenario:
 *   Day 0:  Student starts learning 10 words (IDs 1–10, Band 6 speaking)
 *   Day 1:  First review — remembers 8/10 well, 2 hard
 *   Day 3:  Second review — remembers 9/10, forgot 1
 *   Day 7:  Third review — all 10 correct
 *   Day 14: Fourth review — 9 easy, 1 good
 * 
 * This gives a realistic sawtooth curve on the dashboard.
 */

import { UserWordProgress } from '@/data/vocabulary/types';
import { SRSGrade } from './srs-engine';
import { STORAGE_KEY } from '@/contexts/VocabularyContext';

const DAY_MS = 24 * 60 * 60 * 1000;

interface SimulatedReview {
    dayOffset: number;        // Days from start
    grades: SRSGrade[];       // One grade per word (index matches word order)
}

export function generateEducationDemoData(): Record<number, UserWordProgress> {
    const now = Date.now();
    const startDate = now - (14 * DAY_MS); // Started 14 days ago

    // 10 words being studied (Education Band 6, IDs 1–10)
    const wordIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Review schedule with realistic grades
    const reviews: SimulatedReview[] = [
        {
            dayOffset: 0, // Day 0 — first learn
            grades: [
                SRSGrade.GOOD, SRSGrade.GOOD, SRSGrade.HARD, SRSGrade.GOOD, SRSGrade.EASY,
                SRSGrade.GOOD, SRSGrade.HARD, SRSGrade.GOOD, SRSGrade.GOOD, SRSGrade.GOOD
            ]
        },
        {
            dayOffset: 1, // Day 1 — first review
            grades: [
                SRSGrade.GOOD, SRSGrade.EASY, SRSGrade.HARD, SRSGrade.GOOD, SRSGrade.EASY,
                SRSGrade.GOOD, SRSGrade.AGAIN, SRSGrade.GOOD, SRSGrade.EASY, SRSGrade.GOOD
            ]
        },
        {
            dayOffset: 3, // Day 3 — second review
            grades: [
                SRSGrade.EASY, SRSGrade.EASY, SRSGrade.GOOD, SRSGrade.GOOD, SRSGrade.EASY,
                SRSGrade.EASY, SRSGrade.GOOD, SRSGrade.EASY, SRSGrade.EASY, SRSGrade.GOOD
            ]
        },
        {
            dayOffset: 7, // Day 7 — third review
            grades: [
                SRSGrade.EASY, SRSGrade.EASY, SRSGrade.EASY, SRSGrade.GOOD, SRSGrade.EASY,
                SRSGrade.EASY, SRSGrade.GOOD, SRSGrade.EASY, SRSGrade.EASY, SRSGrade.EASY
            ]
        },
        {
            dayOffset: 14, // Day 14 — fourth review (today)
            grades: [
                SRSGrade.EASY, SRSGrade.EASY, SRSGrade.GOOD, SRSGrade.EASY, SRSGrade.EASY,
                SRSGrade.EASY, SRSGrade.EASY, SRSGrade.EASY, SRSGrade.GOOD, SRSGrade.EASY
            ]
        }
    ];

    const progress: Record<number, UserWordProgress> = {};

    for (let w = 0; w < wordIds.length; w++) {
        const wordId = wordIds[w];
        const history: { date: number; grade: number }[] = [];

        // SRS state tracking
        let interval = 0;
        let repetition = 0;
        let easeFactor = 2.5;
        let lastReviewDate = 0;

        for (const review of reviews) {
            const reviewDate = startDate + (review.dayOffset * DAY_MS);
            const grade = review.grades[w];
            history.push({ date: reviewDate, grade });

            // Simple SM-2 update
            if (grade >= SRSGrade.GOOD) {
                if (repetition === 0) interval = 1;
                else if (repetition === 1) interval = 6;
                else interval = Math.round(interval * easeFactor);
                repetition++;
            } else {
                repetition = 0;
                interval = 1;
            }

            // Update ease factor
            let sm2Grade = 0;
            if (grade === SRSGrade.HARD) sm2Grade = 3;
            if (grade === SRSGrade.GOOD) sm2Grade = 4;
            if (grade === SRSGrade.EASY) sm2Grade = 5;
            easeFactor = easeFactor + (0.1 - (5 - sm2Grade) * (0.08 + (5 - sm2Grade) * 0.02));
            if (easeFactor < 1.3) easeFactor = 1.3;

            lastReviewDate = reviewDate;
        }

        const nextReview = lastReviewDate + (interval * DAY_MS);

        progress[wordId] = {
            wordId,
            srs: {
                interval,
                repetition,
                easeFactor,
                nextReview: w >= 7 ? now - 1000 : nextReview // Force last 3 words to be due now
            },
            lastReviewed: lastReviewDate,
            history
        };
    }

    return progress;
}

/**
 * Seed the demo data into localStorage and reload the page.
 */
export function seedDemoData(): void {
    const demoData = generateEducationDemoData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
    window.location.reload();
}

/**
 * Clear all demo/progress data.
 */
export function clearDemoData(): void {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
}
