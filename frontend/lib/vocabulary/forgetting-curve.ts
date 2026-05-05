/**
 * Forgetting Curve Engine
 * 
 * Calculates memory retention over time using exponential decay:
 *   retention = e^(-t / stability)
 * 
 * Stability increases with successful reviews and resets on failure.
 */

import { UserWordProgress } from '@/data/vocabulary/types';
import { SRSGrade } from './srs-engine';

// ── Core Calculation ──────────────────────────────────────────────

/**
 * Calculate retention (0–1) at a given time since last review.
 * Uses the exponential forgetting formula: R = e^(-t/S)
 */
export function calculateRetention(timeSinceDays: number, stability: number): number {
    if (stability <= 0) return 0;
    if (timeSinceDays <= 0) return 1;
    return Math.exp(-timeSinceDays / stability);
}

/**
 * Derive stability from a word's review history.
 * 
 * Stability starts at 1.0 and changes with each review:
 *   - Correct (EASY):  ×2.2
 *   - Correct (GOOD):  ×1.8
 *   - Hard:            ×1.3
 *   - Forgot (AGAIN):  reset to 1.0
 */
export function calculateStability(history: { date: number; grade: number }[]): number {
    let stability = 1.0;
    for (const review of history) {
        switch (review.grade) {
            case SRSGrade.EASY:
                stability *= 2.2;
                break;
            case SRSGrade.GOOD:
                stability *= 1.8;
                break;
            case SRSGrade.HARD:
                stability *= 1.3;
                break;
            case SRSGrade.AGAIN:
            default:
                stability = 1.0;
                break;
        }
    }
    return stability;
}

// ── Chart Data Generation ─────────────────────────────────────────

export interface CurvePoint {
    day: number;       // Days since learning started
    retention: number; // 0–1
}

export interface ReviewMarker {
    day: number;
    retention: number;
    reviewNumber: number;
    grade: SRSGrade;
}

export interface RetentionCurveData {
    curveSegments: CurvePoint[][]; // Each segment is a curve between two reviews
    reviewMarkers: ReviewMarker[];
    currentRetention: number;      // Current retention right now
    stability: number;
    totalReviews: number;
}

/**
 * Generate chart-ready data for a single word's retention curve.
 * 
 * The curve shows 30 days of history. Each review resets the curve upward,
 * creating the characteristic "sawtooth" pattern of spaced repetition.
 */
export function generateWordCurveData(
    progress: UserWordProgress,
    learningStartDate?: number
): RetentionCurveData {
    const history = progress.history || [];
    const now = Date.now();

    // If no history, return a simple decay from now
    if (history.length === 0) {
        const startDate = learningStartDate || (progress.lastReviewed || now);
        return generateSimpleDecayCurve(startDate, 1.0, now);
    }

    const firstReview = history[0].date;
    const curveSegments: CurvePoint[][] = [];
    const reviewMarkers: ReviewMarker[] = [];
    let stability = 1.0;

    // Generate curve segments between each review
    for (let i = 0; i < history.length; i++) {
        const reviewDate = history[i].date;
        const endDate = i < history.length - 1 ? history[i + 1].date : now;

        // Calculate days from the overall start
        const reviewDayFromStart = (reviewDate - firstReview) / (24 * 60 * 60 * 1000);
        const endDayFromStart = (endDate - firstReview) / (24 * 60 * 60 * 1000);

        // Add review marker (retention jumps to ~100% at review)
        reviewMarkers.push({
            day: reviewDayFromStart,
            retention: 1.0,
            reviewNumber: i + 1,
            grade: history[i].grade as SRSGrade
        });

        // Update stability after this review
        switch (history[i].grade) {
            case SRSGrade.EASY: stability *= 2.2; break;
            case SRSGrade.GOOD: stability *= 1.8; break;
            case SRSGrade.HARD: stability *= 1.3; break;
            case SRSGrade.AGAIN:
            default: stability = 1.0; break;
        }

        // Generate decay curve from this review to the next (or to now)
        const segment: CurvePoint[] = [];
        const segmentDurationDays = endDayFromStart - reviewDayFromStart;
        const numPoints = Math.max(20, Math.ceil(segmentDurationDays * 3));

        for (let j = 0; j <= numPoints; j++) {
            const t = (j / numPoints) * segmentDurationDays;
            segment.push({
                day: reviewDayFromStart + t,
                retention: calculateRetention(t, stability)
            });
        }
        curveSegments.push(segment);
    }

    // Current retention
    const timeSinceLastReview = (now - history[history.length - 1].date) / (24 * 60 * 60 * 1000);
    const currentRetention = calculateRetention(timeSinceLastReview, stability);

    return {
        curveSegments,
        reviewMarkers,
        currentRetention,
        stability,
        totalReviews: history.length
    };
}

/**
 * Generate an aggregate retention curve across all reviewed words.
 * This is the "average" retention — what the dashboard chart shows.
 */
export function generateAggregateCurveData(
    allProgress: Record<number, UserWordProgress>
): RetentionCurveData {
    const entries = Object.values(allProgress);

    const emptyData: RetentionCurveData = {
        curveSegments: [],
        reviewMarkers: [],
        currentRetention: 0,
        stability: 1.0,
        totalReviews: 0
    };

    if (entries.length === 0) {
        return emptyData;
    }

    // Collect all reviews across all words, sorted by date
    const allReviews: { date: number; grade: number; wordId: number }[] = [];
    for (const p of entries) {
        for (const h of p.history) {
            allReviews.push({ date: h.date, grade: h.grade, wordId: p.wordId });
        }
    }
    allReviews.sort((a, b) => a.date - b.date);

    if (allReviews.length === 0) {
        return emptyData;
    }

    // Use the first review as start
    const startDate = allReviews[0].date;
    const now = Date.now();
    const totalDays = Math.max(1, (now - startDate) / (24 * 60 * 60 * 1000));

    // Build average retention at sample points
    const sampleDays = [0, 0.5, 1, 2, 3, 5, 7, 10, 14, 21, 30].filter(d => d <= totalDays + 1);

    // For each word, compute retention at each sample point
    const curvePoints: CurvePoint[] = [];
    const reviewMarkers: ReviewMarker[] = [];

    // Track per-word stability for averaging
    let avgStability = 0;
    let avgRetention = 0;

    for (const day of sampleDays) {
        let totalRet = 0;
        let count = 0;

        for (const p of entries) {
            const wordHistory = p.history.filter(h => {
                const hDay = (h.date - startDate) / (24 * 60 * 60 * 1000);
                return hDay <= day;
            });

            if (wordHistory.length === 0) continue;

            const stability = calculateStability(wordHistory);
            const lastReviewDay = (wordHistory[wordHistory.length - 1].date - startDate) / (24 * 60 * 60 * 1000);
            const timeSince = Math.max(0, day - lastReviewDay);
            totalRet += calculateRetention(timeSince, stability);
            count++;
        }

        if (count > 0) {
            curvePoints.push({ day, retention: totalRet / count });
        }
    }

    // Add review markers (group reviews on same day)
    const reviewsByDay = new Map<number, { count: number; date: number }>();
    for (const r of allReviews) {
        const day = Math.round((r.date - startDate) / (24 * 60 * 60 * 1000));
        const existing = reviewsByDay.get(day);
        if (existing) {
            existing.count++;
        } else {
            reviewsByDay.set(day, { count: 1, date: r.date });
        }
    }

    let reviewNum = 0;
    for (const [day] of reviewsByDay) {
        reviewNum++;
        // Find retention at this day
        const nearestPoint = curvePoints.reduce((prev, curr) =>
            Math.abs(curr.day - day) < Math.abs(prev.day - day) ? curr : prev
            , curvePoints[0]);

        reviewMarkers.push({
            day,
            retention: Math.min(1, (nearestPoint?.retention || 0.8) + 0.15),
            reviewNumber: reviewNum,
            grade: SRSGrade.GOOD
        });
    }

    // Current overall retention
    for (const p of entries) {
        const s = calculateStability(p.history);
        avgStability += s;
        const timeSince = (now - (p.lastReviewed || now)) / (24 * 60 * 60 * 1000);
        avgRetention += calculateRetention(timeSince, s);
    }
    avgStability /= entries.length;
    avgRetention /= entries.length;

    return {
        curveSegments: [curvePoints],
        reviewMarkers,
        currentRetention: avgRetention,
        stability: avgStability,
        totalReviews: allReviews.length
    };
}

// ── Demo / Fallback Data ──────────────────────────────────────────

function generateSimpleDecayCurve(
    startDate: number,
    stability: number,
    now: number
): RetentionCurveData {
    const totalDays = Math.max(1, (now - startDate) / (24 * 60 * 60 * 1000));
    const points: CurvePoint[] = [];
    const numPoints = 50;

    for (let i = 0; i <= numPoints; i++) {
        const day = (i / numPoints) * Math.min(totalDays, 30);
        points.push({ day, retention: calculateRetention(day, stability) });
    }

    return {
        curveSegments: [points],
        reviewMarkers: [],
        currentRetention: calculateRetention(totalDays, stability),
        stability,
        totalReviews: 0
    };
}

/**
 * Generate a realistic demo curve for when there's no real data yet.
 * Shows the "ideal" spaced repetition pattern with reviews at days 1, 3, 7, 14.
 */
export function generateDemoCurveData(): RetentionCurveData {
    const segments: CurvePoint[][] = [];
    const markers: ReviewMarker[] = [];

    // Simulate reviews at day 0, 1, 3, 7, 14
    const reviewDays = [0, 1, 3, 7, 14];
    const stabilityValues = [1.0, 1.8, 3.24, 5.83, 10.5]; // Each ×1.8

    for (let i = 0; i < reviewDays.length; i++) {
        const startDay = reviewDays[i];
        const endDay = i < reviewDays.length - 1 ? reviewDays[i + 1] : 30;
        const stability = stabilityValues[i];

        markers.push({
            day: startDay,
            retention: 1.0,
            reviewNumber: i + 1,
            grade: SRSGrade.GOOD
        });

        const segment: CurvePoint[] = [];
        const numPoints = 30;
        for (let j = 0; j <= numPoints; j++) {
            const t = (j / numPoints) * (endDay - startDay);
            segment.push({
                day: startDay + t,
                retention: calculateRetention(t, stability)
            });
        }
        segments.push(segment);
    }

    return {
        curveSegments: segments,
        reviewMarkers: markers,
        currentRetention: 0.82,
        stability: 10.5,
        totalReviews: 5
    };
}
