// ============================================================================
// FEEDBACK TRANSFORMATION UTILITIES
// ============================================================================
// This module provides utilities to transform backend feedback responses
// into frontend-ready highlights by finding text positions in the essay.

import type {
    Highlight,
    HighlightType,
    CoachingResult,
    TextPosition,
    HighlightSource,
} from "@/types/writing-feedback";

// ----------------------------------------------------------------------------
// Text Position Finding
// ----------------------------------------------------------------------------

/**
 * Finds the position of a text snippet within an essay
 * @param essay - The full essay text
 * @param searchText - The text to find
 * @param startOffset - Optional offset to start searching from
 * @returns TextPosition object or null if not found
 */
export function findTextPosition(
    essay: string,
    searchText: string,
    startOffset: number = 0
): TextPosition | null {
    // 1. Try exact match first (fastest)
    const exactIndex = essay.indexOf(searchText, startOffset);
    if (exactIndex !== -1) {
        return {
            start: exactIndex,
            end: exactIndex + searchText.length,
            text: essay.substring(exactIndex, exactIndex + searchText.length),
        };
    }

    // 2. Try flexible whitespace match (handles newlines/multiple spaces)
    // Escape regex special characters in searchText
    const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Replace whitespace sequences with \s+ pattern to match any whitespace (space, tab, newline)
    const pattern = escapedSearch.replace(/\s+/g, '\\s+');
    const regex = new RegExp(pattern, 'g');

    regex.lastIndex = startOffset;
    const match = regex.exec(essay);

    if (match) {
        return {
            start: match.index,
            end: match.index + match[0].length,
            text: match[0],
        };
    }

    // 3. Fallback to fuzzy matching if simple whitespace flexibility isn't enough
    return findFuzzyPosition(essay, searchText, startOffset);
}

/**
 * Fuzzy text matching for cases where exact match fails
 * This handles minor variations in whitespace or punctuation
 */
function findFuzzyPosition(
    essay: string,
    searchText: string,
    startOffset: number = 0
): TextPosition | null {
    // Remove all punctuation and normalize
    const cleanEssay = essay.toLowerCase().replace(/[^\w\s]/g, "");
    const cleanSearch = searchText.toLowerCase().replace(/[^\w\s]/g, "");

    const index = cleanEssay.indexOf(cleanSearch, startOffset);

    if (index === -1) {
        return null;
    }

    // Map back to original essay position
    let charCount = 0;
    let originalIndex = 0;

    for (let i = 0; i < essay.length; i++) {
        const char = essay[i].toLowerCase();
        if (/[\w\s]/.test(char)) {
            if (charCount === index) {
                originalIndex = i;
                break;
            }
            charCount++;
        }
    }

    return {
        start: originalIndex,
        end: originalIndex + searchText.length,
        text: essay.substring(originalIndex, originalIndex + searchText.length),
    };
}

// ----------------------------------------------------------------------------
// Highlight ID Generation
// ----------------------------------------------------------------------------

/**
 * Generates a unique ID for a highlight
 */
export function generateHighlightId(type: HighlightType, index: number): string {
    return `${type}-${index}-${Date.now()}`;
}

// ----------------------------------------------------------------------------
// Highlight Transformation
// ----------------------------------------------------------------------------

/**
 * Transforms grammar errors into highlights
 */
function transformGrammarErrors(
    essay: string,
    grammarErrors: CoachingResult["grammar_errors"]
): Highlight[] {
    const highlights: Highlight[] = [];
    let searchOffset = 0;

    grammarErrors.forEach((error, index) => {
        const position = findTextPosition(essay, error.original, searchOffset);

        if (position) {
            highlights.push({
                id: generateHighlightId("grammar", index),
                start: position.start,
                end: position.end,
                type: "grammar",
                original: error.original,
                corrected: error.corrected,
                reason: error.explanation,
                tip: error.tip,
                justification: error.explanation, // Map explanation to justification
                improvement_tip: error.tip || "Review grammar rules for this error type.", // Map tip or default
            });

            // Update offset to avoid duplicate matches
            searchOffset = position.end;
        } else {
            console.warn(`Could not find grammar error in essay: "${error.original}"`);
        }
    });

    return highlights;
}

/**
 * Transforms vocabulary suggestions into highlights
 */
function transformVocabularySuggestions(
    essay: string,
    vocabSuggestions: CoachingResult["vocabulary_suggestions"]
): Highlight[] {
    const highlights: Highlight[] = [];
    let searchOffset = 0;

    vocabSuggestions.forEach((suggestion, index) => {
        const position = findTextPosition(essay, suggestion.original, searchOffset);

        if (position) {
            highlights.push({
                id: generateHighlightId("vocabulary", index),
                start: position.start,
                end: position.end,
                type: "vocabulary",
                original: suggestion.original,
                corrected: suggestion.better_options.join(" / "),
                reason: suggestion.context,
                tip: `Consider using: ${suggestion.better_options.slice(0, 2).join(" or ")}`,
                justification: suggestion.context, // Map context to justification
                improvement_tip: `Try using more precise vocabulary like "${suggestion.better_options[0]}" to enhance meaning.`,
            });

            searchOffset = position.end;
        } else {
            console.warn(`Could not find vocabulary in essay: "${suggestion.original}"`);
        }
    });

    return highlights;
}

/**
 * Transforms coherence issues into highlights
 */
function transformCoherenceIssues(
    essay: string,
    coherenceIssues: CoachingResult["coherence_issues"]
): Highlight[] {
    const highlights: Highlight[] = [];
    let searchOffset = 0;

    coherenceIssues.forEach((issue, index) => {
        const position = findTextPosition(essay, issue.text, searchOffset);

        if (position) {
            highlights.push({
                id: generateHighlightId("coherence", index),
                start: position.start,
                end: position.end,
                type: "coherence",
                original: issue.text,
                corrected: issue.suggestion,
                reason: issue.reason,
                tip: "Improve flow and connection",
                justification: issue.reason, // Map reason to justification
                improvement_tip: "Use appropriate linking words or reference words to connect ideas more smoothly.",
            });

            searchOffset = position.end;
        } else {
            console.warn(`Could not find coherence issue in essay: "${issue.text}"`);
        }
    });

    return highlights;
}

/**
 * Transforms micro_feedback from Explainer into highlights
 * These are sentence-level errors that should be highlighted in red
 */
function transformMicroFeedback(
    essay: string,
    microFeedback: any[]
): Highlight[] {
    const highlights: Highlight[] = [];
    let searchOffset = 0;

    microFeedback.forEach((item, index) => {
        const originalSentence = item.original_sentence || item.quote;
        if (!originalSentence) return;

        const position = findTextPosition(essay, originalSentence, searchOffset);

        if (position) {
            // Determine the highlight type based on error_type
            const highlightType: HighlightType =
                item.error_type === 'grammar' || item.error_type === 'punctuation'
                    ? "grammar"
                    : item.error_type === 'vocabulary'
                        ? "vocabulary"
                        : "coherence";

            highlights.push({
                id: generateHighlightId(highlightType, index),
                start: position.start,
                end: position.end,
                type: highlightType,
                original: originalSentence,
                corrected: item.corrected_sentence || item.correction,
                reason: item.explanation,
                tip: item.specific_error || "Review this sentence",
                justification: item.explanation,
                improvement_tip: item.corrected_sentence
                    ? `Consider: "${item.corrected_sentence}"`
                    : "Review this sentence for improvement.",
            });

            searchOffset = position.end;
        }
    });

    return highlights;
}

// ----------------------------------------------------------------------------
// Main Transformation Function
// ----------------------------------------------------------------------------

/**
 * Transforms macro_feedback (paragraph rewrites) into highlights
 */
function transformMacroFeedback(
    essay: string,
    macroFeedback: any[]
): Highlight[] {
    const highlights: Highlight[] = [];
    let searchOffset = 0;

    macroFeedback.forEach((item, index) => {
        if (!item.original_paragraph) return;

        const position = findTextPosition(essay, item.original_paragraph, searchOffset);

        if (position) {
            highlights.push({
                id: generateHighlightId("coherence", index + 900), // High index to avoid collision
                start: position.start,
                end: position.end,
                type: "coherence",
                original: item.original_paragraph,
                corrected: item.improved_paragraph,
                reason: item.logic_diagnosis,
                tip: "Paragraph-level logic improvement",
                justification: item.logic_diagnosis,
                improvement_tip: "Review the PEEL structure in the improved paragraph.",
            });

            searchOffset = position.end;
        }
    });

    return highlights;
}

/**
 * Transforms cohesion_fixes into highlights
 */
function transformCohesionFixes(
    essay: string,
    cohesionFixes: any[]
): Highlight[] {
    const highlights: Highlight[] = [];
    let searchOffset = 0;

    cohesionFixes.forEach((item, index) => {
        if (!item.original_sentence) return;

        const position = findTextPosition(essay, item.original_sentence, searchOffset);

        if (position) {
            highlights.push({
                id: generateHighlightId("coherence", index + 800),
                start: position.start,
                end: position.end,
                type: "coherence",
                original: item.original_sentence,
                corrected: item.improved_sentence,
                reason: item.technique_explanation,
                tip: `Using ${item.technique_used}`,
                justification: item.technique_explanation,
                improvement_tip: "Avoid mechanical linkers; use thematic progression instead.",
            });

            searchOffset = position.end;
        }
    });

    return highlights;
}

/**
 * Transforms vocabulary_feedback.cliche_replacements into highlights
 */
function transformClicheReplacements(
    essay: string,
    clicheReplacements: any[]
): Highlight[] {
    const highlights: Highlight[] = [];
    let searchOffset = 0;

    clicheReplacements.forEach((item, index) => {
        if (!item.original_sentence) return;

        const position = findTextPosition(essay, item.original_sentence, searchOffset);

        if (position) {
            highlights.push({
                id: generateHighlightId("vocabulary", index + 700),
                start: position.start,
                end: position.end,
                type: "vocabulary",
                original: item.original_sentence,
                corrected: item.improved_sentence,
                reason: item.why_better,
                tip: `Avoid cliche: "${item.cliche_found}"`,
                justification: item.why_better,
                improvement_tip: `Use more precise alternatives: ${item.alternatives.join(", ")}`,
            });

            searchOffset = position.end;
        }
    });

    return highlights;
}

/**
 * Transforms backend coaching result into an array of highlights
 * @param essay - The original essay text
 * @param coaching - The coaching result from backend
 * @returns Array of highlights for essay markup
 */
export function transformToHighlights(
    essay: string,
    coaching: CoachingResult
): Highlight[] {
    const highlights: Highlight[] = [];

    // 1. Transform basic coaching items
    highlights.push(...transformGrammarErrors(essay, coaching.grammar_errors));
    highlights.push(...transformVocabularySuggestions(essay, coaching.vocabulary_suggestions));
    highlights.push(...transformCoherenceIssues(essay, coaching.coherence_issues));

    // 2. Transform Explainer-specific feedback if available
    const explainerData = coaching.raw_explainer_output;
    if (explainerData) {
        if (explainerData.micro_feedback) {
            highlights.push(...transformMicroFeedback(essay, explainerData.micro_feedback));
        }
        if (explainerData.macro_feedback) {
            highlights.push(...transformMacroFeedback(essay, explainerData.macro_feedback));
        }
        if (explainerData.cohesion_fixes) {
            highlights.push(...transformCohesionFixes(essay, explainerData.cohesion_fixes));
        }
        if (explainerData.vocabulary_feedback?.cliche_replacements) {
            highlights.push(...transformClicheReplacements(essay, explainerData.vocabulary_feedback.cliche_replacements));
        }
    }

    // Sort highlights by position for easier rendering
    highlights.sort((a, b) => a.start - b.start);

    // Merge overlapping highlights to avoid duplicates
    return mergeOverlappingHighlights(highlights);
}

// ----------------------------------------------------------------------------
// Highlight Utilities
// ----------------------------------------------------------------------------

/**
 * Checks if two highlights overlap
 */
export function highlightsOverlap(h1: Highlight, h2: Highlight): boolean {
    return !(h1.end <= h2.start || h2.end <= h1.start);
}

/**
 * Merges overlapping highlights (prioritizes by type)
 */
export function mergeOverlappingHighlights(highlights: Highlight[]): Highlight[] {
    if (highlights.length === 0) return [];

    const sorted = [...highlights].sort((a, b) => a.start - b.start);
    const merged: Highlight[] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i];
        const last = merged[merged.length - 1];

        if (highlightsOverlap(current, last)) {
            // Priority: grammar > vocabulary > coherence
            const priority: Record<HighlightType, number> = { grammar: 3, vocabulary: 2, coherence: 1 };
            if (priority[current.type] > priority[last.type]) {
                merged[merged.length - 1] = current;
            }
        } else {
            merged.push(current);
        }
    }

    return merged;
}

/**
 * Groups highlights by type
 */
export function groupHighlightsByType(highlights: Highlight[]): Record<HighlightType, Highlight[]> {
    return highlights.reduce((acc, highlight) => {
        if (!acc[highlight.type]) {
            acc[highlight.type] = [];
        }
        acc[highlight.type].push(highlight);
        return acc;
    }, {} as Record<HighlightType, Highlight[]>);
}

/**
 * Gets highlight statistics
 */
export function getHighlightStats(highlights: Highlight[]) {
    const grouped = groupHighlightsByType(highlights);

    return {
        total: highlights.length,
        grammar: grouped.grammar?.length || 0,
        vocabulary: grouped.vocabulary?.length || 0,
        coherence: grouped.coherence?.length || 0,
    };
}
