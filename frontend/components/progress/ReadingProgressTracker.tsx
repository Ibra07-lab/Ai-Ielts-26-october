import { motion } from "framer-motion";
import { BookOpen, TrendingUp, TrendingDown, AlertCircle, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import backend from "@/backend";

interface ReadingSkill {
    type: string;
    total: number;
    correct: number;
    accuracy: number;
}

/** All 12 IELTS reading question types (canonical keys). */
const ALL_QUESTION_TYPES = [
    "true-false-not-given",
    "yes-no-not-given",
    "multiple-choice",
    "matching-headings",
    "matching-information",
    "matching-features",
    "matching-sentence-endings",
    "sentence-completion",
    "summary-completion",
    "note-table-flowchart-completion",
    "diagram-label-completion",
    "short-answer",
] as const;

/** Human-readable labels for each question type. */
const TYPE_LABELS: Record<string, string> = {
    "true-false-not-given": "True / False / Not Given",
    "yes-no-not-given": "Yes / No / Not Given",
    "multiple-choice": "Multiple Choice",
    "matching-headings": "Matching Headings",
    "matching-information": "Matching Information",
    "matching-features": "Matching Features",
    "matching-sentence-endings": "Matching Sentence Endings",
    "sentence-completion": "Sentence Completion",
    "summary-completion": "Summary Completion",
    "note-table-flowchart-completion": "Note / Table / Flow-chart",
    "diagram-label-completion": "Diagram Label Completion",
    "short-answer": "Short Answer",
};

/** Map question type keys to training skill slugs. Only types with training prompts are listed. */
const SKILL_SLUGS: Record<string, string> = {
    "true-false-not-given": "tfng",
    "yes-no-not-given": "ynng",
    "matching-headings": "matching_headings",
    "matching-information": "matching_info",
    "sentence-completion": "sentence_completion",
    "summary-completion": "summary_completion",
    "multiple-choice": "multiple_choice",
    "short-answer": "short_answer",
    "matching-features": "matching_features",
    "matching-sentence-endings": "matching_sentence_endings",
    "note-table-flowchart-completion": "note_table_flowchart_completion",
    "diagram-label-completion": "diagram_label_completion"
};

/** Format a raw type key into a readable label. */
function formatLabel(type: string): string {
    if (TYPE_LABELS[type]) return TYPE_LABELS[type];
    // Fallback: capitalize and replace hyphens
    return type
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

/** Mock functions for UI demo purposes. In production, these would be fetched from the backend. */
function getGlobalAverage(type: string): number {
    let hash = 0;
    for (let i = 0; i < type.length; i++) hash += type.charCodeAt(i);
    return 45 + (hash % 30); // 45% to 75%
}

function getPreviousAccuracy(current: number, type: string): number {
    if (current === 0) return 0;
    let hash = 0;
    for (let i = 0; i < type.length; i++) hash += type.charCodeAt(i);
    const offset = Math.floor((hash % 30) - 15); // -15 to +15
    return Math.max(10, Math.min(100, current + offset));
}

export default function ReadingProgressTracker() {
    const { user } = useUser();
    const navigate = useNavigate();

    const { data: skillsData } = useQuery({
        queryKey: ["readingSkills", user?.id],
        queryFn: () => (user ? backend.ielts.getReadingSkills(user.id) : null),
        enabled: !!user,
    });

    const backendSkills = skillsData?.skills ?? [];
    const backendMap = new Map(backendSkills.map(s => [s.type, s]));

    const skills: ReadingSkill[] = ALL_QUESTION_TYPES.map(type => {
        const existing = backendMap.get(type);
        return existing ?? { type, total: 0, correct: 0, accuracy: 0 };
    });

    for (const s of backendSkills) {
        if (!ALL_QUESTION_TYPES.includes(s.type as any)) {
            skills.push(s);
        }
    }

    skills.sort((a, b) => b.total - a.total || a.type.localeCompare(b.type));
    const practicedCount = skills.filter(s => s.total > 0).length;

    const getSemanticColors = (accuracy: number) => {
        if (accuracy >= 75) {
            return { text: "text-teal-600 dark:text-[#5eead4]", bg: "bg-teal-500 dark:bg-[#5eead4]" }; // Teal
        }
        if (accuracy >= 60) {
            return { text: "text-amber-600 dark:text-[#fbbf24]", bg: "bg-amber-500 dark:bg-[#fbbf24]" }; // Amber
        }
        if (accuracy >= 50) {
            return { text: "text-yellow-600 dark:text-[#fde047]", bg: "bg-yellow-400 dark:bg-[#fde047]" }; // Yellow
        }
        return { text: "text-rose-600 dark:text-[#fb7185]", bg: "bg-rose-500 dark:bg-[#fb7185]" }; // Rose
    };

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0b1120] p-6 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex items-center justify-center transition-colors">
                        <BookOpen className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                    </div>
                    <div>
                        <h3 className="text-[17px] font-bold text-slate-900 dark:text-slate-200 tracking-tight transition-colors">Reading Skills Breakdown</h3>
                        <p className="text-sm text-slate-500 font-medium">Accuracy by question type</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {skills.map((skill, i) => {
                    const hasPractice = skill.total > 0;
                    const colors = getSemanticColors(skill.accuracy);
                    const prevAcc = getPreviousAccuracy(skill.accuracy, skill.type);
                    const globalAvg = getGlobalAverage(skill.type);
                    const trendDiff = skill.accuracy - prevAcc;

                    return (
                        <motion.div
                            key={skill.type}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.3 }}
                            className="group relative flex items-center gap-4 bg-slate-50/50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-xl px-4 py-3 hover:bg-slate-50 dark:hover:bg-[#0f172a] transition-colors"
                        >
                            <div className="w-[240px] flex items-center justify-between shrink-0 pr-4">
                                <span className={`text-[15px] font-bold truncate transition-colors ${hasPractice ? colors.text : "text-slate-400 dark:text-slate-600"}`}>
                                    {formatLabel(skill.type)}
                                </span>
                                <span className={`text-[15px] font-medium transition-colors ${hasPractice ? "text-slate-500" : "text-slate-400 dark:text-slate-700"}`}>
                                    {hasPractice ? `${skill.accuracy}%` : "—"}
                                </span>
                            </div>

                            <div className="flex-1 h-3 rounded-full bg-slate-200 dark:bg-[#1e293b] relative transition-colors">
                                {hasPractice && (
                                    <>
                                        {/* Filled Bar */}
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${Math.max(skill.accuracy, 2)}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.04 }}
                                            className={`absolute top-0 left-0 h-full rounded-full ${colors.bg}`}
                                        />
                                        {/* Global Average / Previous Marker */}
                                        <div
                                            className="absolute top-[-2px] bottom-[-2px] w-[2px] bg-slate-400 dark:bg-slate-500 rounded-full z-10 transition-colors"
                                            style={{ left: `${Math.max(prevAcc, 2)}%` }}
                                        />
                                    </>
                                )}
                            </div>

                            {/* Trend Indicator */}
                            <div className="w-6 flex items-center justify-center shrink-0 group relative">
                                {hasPractice && (
                                    trendDiff > 0 ? (
                                        <TrendingUp className="w-4 h-4 text-teal-500 dark:text-[#5eead4]" strokeWidth={2.5} />
                                    ) : trendDiff < 0 ? (
                                        <TrendingDown className="w-4 h-4 text-rose-500 dark:text-[#fb7185]" strokeWidth={2.5} />
                                    ) : (
                                        <div className="w-2 h-[2px] bg-slate-300 dark:bg-slate-500 rounded-full transition-colors" />
                                    )
                                )}

                                {/* Custom Hover Tooltip directly under the row (like the screenshot) */}
                                {hasPractice && (
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-max bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-xl dark:shadow-black/50">
                                        <span className="text-slate-500 dark:text-slate-400">TREND: </span>
                                        {trendDiff > 0 ? (
                                            <span className="text-teal-600 dark:text-[#5eead4] font-medium">↑ +{trendDiff}%</span>
                                        ) : trendDiff < 0 ? (
                                            <span className="text-rose-600 dark:text-[#fb7185] font-medium">↓ {trendDiff}%</span>
                                        ) : (
                                            <span className="text-slate-500 dark:text-slate-300">No change</span>
                                        )}
                                        <span className="text-slate-400 dark:text-slate-500 ml-1">(vs. last attempt)</span>
                                    </div>
                                )}
                            </div>

                            {/* Train Button */}
                            {hasPractice && SKILL_SLUGS[skill.type] && (
                                <button
                                    onClick={() =>
                                        navigate(`/reading/tutor-chat`, {
                                            state: {
                                                skill: SKILL_SLUGS[skill.type],
                                                accuracy: skill.accuracy,
                                                totalAttempted: skill.total,
                                                correct: skill.correct,
                                                studentId: user?.id || "unknown",
                                            },
                                        })
                                    }
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#334155] dark:hover:text-white border border-slate-200 dark:border-[#334155] rounded-md transition-all shrink-0 shadow-sm"
                                >
                                    <Target className="w-3.5 h-3.5" />
                                    Train
                                </button>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {practicedCount === 0 && (
                <div className="mt-8 text-center p-6 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] transition-colors">
                    <p className="text-sm font-medium text-slate-500">
                        Complete reading practice tests to build your personalized skills profile over time.
                    </p>
                </div>
            )}
        </div>
    );
}
