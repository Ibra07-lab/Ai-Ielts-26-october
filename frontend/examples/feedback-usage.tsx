// ============================================================================
// WRITING FEEDBACK SYSTEM - USAGE EXAMPLES
// ============================================================================
// This file demonstrates how to use the enhanced feedback types and utilities

import type {
    EnhancedFeedbackResponse,
    RawBackendFeedback,
    Highlight,
    EvaluationResult,
    CoachingResult,
} from "@/types/writing-feedback";

import {
    transformToHighlights,
    mergeOverlappingHighlights,
    getHighlightStats,
    groupHighlightsByType,
} from "@/utils/feedback-transform";

// ============================================================================
// EXAMPLE 1: Processing Backend Response
// ============================================================================

/**
 * Example function showing how to process a raw backend response
 * and transform it into highlights for the frontend
 */
export function processBackendFeedback(
    essay: string,
    backendResponse: RawBackendFeedback
): EnhancedFeedbackResponse {
    // Extract evaluation and coaching from backend
    const { evaluation, coaching } = backendResponse;

    // Transform coaching feedback into highlights
    const rawHighlights = transformToHighlights(essay, coaching);

    // Merge overlapping highlights (optional, based on UI preference)
    const highlights = mergeOverlappingHighlights(rawHighlights);

    // Return complete enhanced feedback
    return {
        evaluation,
        coaching,
        highlights,
        timestamp: new Date().toISOString(),
    };
}

// ============================================================================
// EXAMPLE 2: Mock Backend Response
// ============================================================================

export const MOCK_BACKEND_RESPONSE: RawBackendFeedback = {
    evaluation: {
        overall_band: 6.5,
        band_range: { low: 6.0, high: 7.0 },
        criterion_scores: [
            {
                criterion: "task_response",
                band: 7.0,
                justification: "Addresses all parts of the task with relevant ideas",
            },
            {
                criterion: "coherence_cohesion",
                band: 6.5,
                justification: "Information organized logically but some linking could be improved",
            },
            {
                criterion: "lexical_resource",
                band: 6.0,
                justification: "Adequate vocabulary range with some errors in word choice",
            },
            {
                criterion: "grammatical_range_accuracy",
                band: 6.5,
                justification: "Mix of simple and complex structures with good control",
            },
        ],
        word_count: 267,
        word_count_ok: true,
    },
    coaching: {
        action_plan: [
            "Replace basic vocabulary with more academic alternatives (e.g., 'big' → 'significant')",
            "Add more cohesive devices between paragraphs (Furthermore, Moreover, In contrast)",
            "Vary sentence structures by using more complex sentences with subordinate clauses",
        ],
        weaknesses: [
            "Limited range of vocabulary - too many basic words",
            "Some paragraphs lack clear transitions",
            "Occasional grammatical errors with articles",
        ],
        grammar_errors: [
            {
                original: "the technology is very important",
                corrected: "technology is very important",
                explanation: "No article needed before 'technology' when used in general sense",
                tip: "Remember: uncountable nouns in general statements don't need 'the'",
            },
            {
                original: "people has more opportunities",
                corrected: "people have more opportunities",
                explanation: "Subject-verb agreement: 'people' is plural",
                tip: "People = plural, Person = singular",
            },
        ],
        vocabulary_suggestions: [
            {
                original: "very important",
                better_options: ["crucial", "vital", "essential", "significant"],
                context: "Use more academic vocabulary to express importance",
            },
            {
                original: "a lot of",
                better_options: ["numerous", "a considerable number of", "many"],
                context: "Avoid informal phrases in academic writing",
            },
        ],
        coherence_issues: [
            {
                text: "However, this is good. People can learn.",
                suggestion: "However, this is beneficial as it enables people to learn.",
                reason: "Connect ideas more smoothly within sentences",
            },
        ],
    },
};

// ============================================================================
// EXAMPLE 3: Using Highlights in UI Component
// ============================================================================

/**
 * Example React component showing how to render highlighted essay
 */
export function EssayWithHighlights({
    essay,
    highlights,
}: {
    essay: string;
    highlights: Highlight[];
}) {
    // Sort highlights by position
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

    // Build segments of text with highlights
    const segments: Array<{ text: string; highlight?: Highlight }> = [];
    let currentPos = 0;

    sortedHighlights.forEach((highlight) => {
        // Add text before highlight
        if (currentPos < highlight.start) {
            segments.push({
                text: essay.substring(currentPos, highlight.start),
            });
        }

        // Add highlighted text
        segments.push({
            text: essay.substring(highlight.start, highlight.end),
            highlight,
        });

        currentPos = highlight.end;
    });

    // Add remaining text
    if (currentPos < essay.length) {
        segments.push({
            text: essay.substring(currentPos),
        });
    }

    return (
        <div className="essay-container">
            {segments.map((segment, index) => {
                if (segment.highlight) {
                    return (
                        <HighlightedText
                            key={index}
                            text={segment.text}
                            highlight={segment.highlight}
                        />
                    );
                }
                return <span key={index}>{segment.text}</span>;
            })}
        </div>
    );
}

/**
 * Component for rendering individual highlighted text
 */
function HighlightedText({ text, highlight }: { text: string; highlight: Highlight }) {
    const colorMap = {
        grammar: "bg-red-100 border-red-300",
        vocabulary: "bg-blue-100 border-blue-300",
        coherence: "bg-yellow-100 border-yellow-300",
    };

    return (
        <span
            className={`highlight ${colorMap[highlight.type]} border-b-2 cursor-pointer`}
            data-highlight-id={highlight.id}
            title={highlight.reason}
        >
            {text}
        </span>
    );
}

// ============================================================================
// EXAMPLE 4: Highlight Statistics Display
// ============================================================================

export function HighlightStatsPanel({ highlights }: { highlights: Highlight[] }) {
    const stats = getHighlightStats(highlights);

    return (
        <div className="stats-panel">
            <h3>Feedback Summary</h3>
            <div className="stats-grid">
                <StatItem label="Grammar Issues" count={stats.grammar} color="red" />
                <StatItem label="Vocabulary" count={stats.vocabulary} color="blue" />
                <StatItem label="Coherence" count={stats.coherence} color="yellow" />
            </div>
        </div>
    );
}

function StatItem({ label, count, color }: { label: string; count: number; color: string }) {
    return (
        <div className={`stat-item border-l-4 border-${color}-500 pl-3`}>
            <div className="text-2xl font-bold">{count}</div>
            <div className="text-sm text-gray-600">{label}</div>
        </div>
    );
}

// ============================================================================
// EXAMPLE 5: Filtering Highlights by Type
// ============================================================================

export function FilteredHighlightsList({
    highlights,
    activeFilter,
}: {
    highlights: Highlight[];
    activeFilter: "all" | "grammar" | "vocabulary" | "coherence";
}) {
    const grouped = groupHighlightsByType(highlights);

    const filteredHighlights =
        activeFilter === "all" ? highlights : grouped[activeFilter] || [];

    return (
        <div className="highlights-list">
            {filteredHighlights.map((highlight) => (
                <HighlightCard key={highlight.id} highlight={highlight} />
            ))}
        </div>
    );
}

function HighlightCard({ highlight }: { highlight: Highlight }) {
    return (
        <div className="highlight-card p-4 border rounded-lg mb-2">
            <div className="flex items-center gap-2 mb-2">
                <span className={`badge badge-${highlight.type}`}>{highlight.type}</span>
                {highlight.improvement_tip && (
                    <span className="text-xs text-gray-500">{highlight.improvement_tip}</span>
                )}
            </div>

            <div className="original text-red-700 line-through mb-1">{highlight.original}</div>

            {highlight.corrected && (
                <div className="corrected text-green-700 font-medium mb-2">
                    → {highlight.corrected}
                </div>
            )}

            <div className="reason text-sm text-gray-600 mb-1">{highlight.reason}</div>
            <div className="tip text-xs text-blue-600 italic">{highlight.tip}</div>
        </div>
    );
}

// ============================================================================
// EXAMPLE 6: Complete Usage Flow
// ============================================================================

export async function handleEssaySubmission(essay: string, question: string, taskType: "task1" | "task2") {
    try {
        // 1. Send essay to backend
        const response = await fetch("/api/writing/evaluate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                task_type: taskType,
                question,
                essay,
                target_band: 7.0,
            }),
        });

        const backendData: RawBackendFeedback = await response.json();

        // 2. Transform backend response into enhanced feedback
        const enhancedFeedback = processBackendFeedback(essay, backendData);

        // 3. Log statistics
        const stats = getHighlightStats(enhancedFeedback.highlights);
        console.log("Feedback generated:", stats);

        // 4. Return for UI rendering
        return enhancedFeedback;
    } catch (error) {
        console.error("Failed to get feedback:", error);
        throw error;
    }
}
