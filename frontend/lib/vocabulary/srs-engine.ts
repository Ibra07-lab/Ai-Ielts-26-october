export interface SRSState {
    interval: number; // Interval in days
    repetition: number; // Number of consecutive correct recalls
    easeFactor: number; // Difficulty factor (starts at 2.5)
}

export enum SRSGrade {
    AGAIN = 0, // Complete blackout
    HARD = 1,  // Correct response with hesitation
    GOOD = 2,  // Perfect response with hesitation
    EASY = 3   // Perfect response without hesitation
}

/**
 * Calculates the next review schedule using a modified SM-2 algorithm.
 * 
 * @param current - Current state of the card
 * @param grade - User's self-assessed grade (0-3)
 * @returns New state with updated interval and ease factor, plus next review date
 */
export function calculateReview(current: SRSState, grade: SRSGrade): SRSState & { nextReviewDate: number } {
    let { interval, repetition, easeFactor } = current;

    if (grade >= SRSGrade.GOOD) {
        // Correct response
        if (repetition === 0) {
            interval = 1;
        } else if (repetition === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * easeFactor);
        }
        repetition += 1;
    } else {
        // Incorrect response or hard struggle
        repetition = 0;
        interval = 1;
    }

    // Update Ease Factor (standard SM-2 formula)
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    // Our grades are 0-3, SM-2 uses 0-5. We map:
    // AGAIN(0) -> 0
    // HARD(1) -> 3
    // GOOD(2) -> 4
    // EASY(3) -> 5

    let sm2Grade = 0;
    if (grade === SRSGrade.HARD) sm2Grade = 3;
    if (grade === SRSGrade.GOOD) sm2Grade = 4;
    if (grade === SRSGrade.EASY) sm2Grade = 5;

    easeFactor = easeFactor + (0.1 - (5 - sm2Grade) * (0.08 + (5 - sm2Grade) * 0.02));

    // Ease Factor lower bound is 1.3
    if (easeFactor < 1.3) easeFactor = 1.3;

    // Calculate next date
    const nextReviewDate = Date.now() + (interval * 24 * 60 * 60 * 1000);

    return {
        interval,
        repetition,
        easeFactor,
        nextReviewDate
    };
}

export const INITIAL_SRS_STATE: SRSState = {
    interval: 0,
    repetition: 0,
    easeFactor: 2.5
};
