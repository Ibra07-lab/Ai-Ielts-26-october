import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLessonById, VideoLesson as VideoLessonType, ComprehensionQuestion, VocabularyItem, VocabExercise } from '../data/videoLessons';
import { supabase } from '../lib/supabase';

// ─── Step Status Types ─────────────────────────────────────────────────
type StepStatus = 'locked' | 'current' | 'completed';

interface StepDef {
    id: number;
    label: string;
    icon: string;
}

const STEPS: StepDef[] = [
    { id: 1, label: 'Watch Video', icon: '🎥' },
    { id: 2, label: 'Comprehension', icon: '📖' },
    { id: 3, label: 'Vocabulary', icon: '📝' },
    { id: 4, label: 'Exercises', icon: '🧩' },
    { id: 5, label: 'Summary', icon: '✍️' },
];

// ─── Main Component ────────────────────────────────────────────────────
export default function VideoLesson() {
    const { id } = useParams<{ id: string }>();
    const lesson = getLessonById(id || '');

    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

    if (!lesson) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#151624] text-white">
                <div className="text-center space-y-4">
                    <div className="text-6xl">📹</div>
                    <h1 className="text-2xl font-bold">Lesson not found</h1>
                    <p className="text-slate-400">The video lesson you're looking for doesn't exist.</p>
                    <Link to="/dashboard" className="inline-block mt-4 px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors font-medium">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    function getStepStatus(stepId: number): StepStatus {
        if (completedSteps.has(stepId)) return 'completed';
        if (stepId === currentStep) return 'current';
        return 'locked';
    }

    function completeStep(stepId: number) {
        setCompletedSteps((prev) => {
            const next = new Set(prev);
            next.add(stepId);
            return next;
        });
        if (stepId < 5) {
            setCurrentStep(stepId + 1);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#030712] pb-32">
            {/* Header */}
            <div className="bg-white dark:bg-[#0F172A] border-b border-gray-200 dark:border-[#1E293B] sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </Link>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">{lesson.title}</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{lesson.category} • {lesson.duration}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Stepper */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-6">
                <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-gray-200 dark:border-[#1E293B] p-4">
                    <div className="flex items-center justify-between relative max-w-4xl mx-auto">
                        {/* Connecting line */}
                        <div className="absolute top-4 left-6 right-6 h-[2px] bg-slate-200 dark:bg-[#1E293B]"></div>
                        <div
                            className="absolute top-4 left-6 h-[2px] bg-blue-500 transition-all duration-700"
                            style={{ width: `${Math.max(0, ((Math.max(...Array.from(completedSteps), 0)) / 4) * (100 - 10))}%` }}
                        ></div>

                        {STEPS.map((step) => {
                            const status = getStepStatus(step.id);
                            return (
                                <div
                                    key={step.id}
                                    className="flex flex-col items-center relative z-10 cursor-pointer group"
                                    onClick={() => {
                                        if (status === 'completed' || status === 'current') {
                                            setCurrentStep(step.id);
                                        }
                                    }}
                                >
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${status === 'completed'
                                            ? 'bg-blue-500/20 text-blue-400'
                                            : status === 'current'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-slate-100 dark:bg-[#0F172A] border-2 border-slate-200 dark:border-[#1E293B] text-slate-400'
                                            }`}
                                    >
                                        {status === 'completed' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : status === 'locked' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                        ) : (
                                            <span className="text-sm">{step.icon}</span>
                                        )}
                                    </div>
                                    <span
                                        className={`mt-2 text-xs font-medium text-center transition-colors ${status === 'completed'
                                            ? 'text-blue-400'
                                            : status === 'current'
                                                ? 'text-blue-500 font-bold'
                                                : 'text-slate-500'
                                            }`}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-6 mb-12">
                {currentStep === 1 && <VideoStep lesson={lesson} onComplete={() => completeStep(1)} isCompleted={completedSteps.has(1)} />}
                {currentStep === 2 && <ComprehensionStep questions={lesson.comprehensionQuestions} onComplete={() => completeStep(2)} isCompleted={completedSteps.has(2)} />}
                {currentStep === 3 && <VocabularyStep vocabulary={lesson.vocabulary} onComplete={() => completeStep(3)} isCompleted={completedSteps.has(3)} />}
                {currentStep === 4 && <VocabExercisesStep exercises={lesson.vocabExercises} vocabulary={lesson.vocabulary} onComplete={() => completeStep(4)} isCompleted={completedSteps.has(4)} />}
                {currentStep === 5 && <SummaryStep lesson={lesson} onComplete={() => completeStep(5)} isCompleted={completedSteps.has(5)} />}
            </div>

            {/* Completion Banner */}
            {completedSteps.size === 5 && (
                <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-6 mb-12">
                    <div className="relative overflow-hidden rounded-[12px] bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#1E293B] p-8 text-center text-gray-900 dark:text-white">
                        <div className="relative">
                            <div className="text-[40px] mb-4">🎉</div>
                            <h2 className="text-[32px] font-bold mb-2">Lesson Complete!</h2>
                            <p className="text-[15px] text-slate-500 dark:text-[#94A3B8] mb-6">Outstanding work! You've completed all 5 steps of this lesson.</p>
                            <Link to="/dashboard" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-[12px] font-bold hover:bg-blue-500 transition-colors">
                                ← Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════
// STEP 1: Watch Video
// ═══════════════════════════════════════════════════════════════════════
function VideoStep({ lesson, onComplete, isCompleted }: { lesson: VideoLessonType; onComplete: () => void; isCompleted: boolean }) {
    return (
        <div className="text-gray-900 dark:text-[#F8FAFC]">
            {/* Video */}
            <div className="aspect-video w-full bg-[#0F172A] rounded-[12px] overflow-hidden">
                <iframe
                    className="w-full h-full"
                    src={lesson.embedUrl}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                ></iframe>
            </div>

            {/* Info + Button */}
            <div className="pt-6 sm:pt-8 pb-4">
                <h2 className="text-[32px] font-bold text-gray-900 dark:text-white mb-2 leading-tight">{lesson.title}</h2>
                <p className="text-[15px] text-slate-500 dark:text-[#94A3B8] leading-relaxed mb-6">{lesson.description}</p>

                <div className="bg-blue-50 dark:bg-[#0F172A] border border-blue-200 dark:border-[#1E293B] rounded-[12px] p-5 mb-6">
                    <div className="flex items-start gap-3">
                        <div className="text-blue-500 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[15px] font-semibold text-blue-700 dark:text-blue-400">Watch carefully!</p>
                            <p className="text-[14px] text-blue-600 dark:text-blue-500 mt-1">Pay attention to the main ideas and new vocabulary. You'll answer comprehension questions and learn key words in the next steps.</p>
                        </div>
                    </div>
                </div>

                {!isCompleted ? (
                    <button
                        onClick={onComplete}
                        className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-[12px] font-bold transition-colors"
                    >
                        ✓ I've watched this video — Continue
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Step completed
                    </div>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════
// STEP 2: Comprehension Questions
// ═══════════════════════════════════════════════════════════════════════
function ComprehensionStep({ questions, onComplete, isCompleted }: { questions: ComprehensionQuestion[]; onComplete: () => void; isCompleted: boolean }) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const score = useMemo(() => {
        if (!submitted) return 0;
        return questions.filter((q) => answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()).length;
    }, [submitted, answers, questions]);

    const passMark = Math.ceil(questions.length * 0.6);

    function handleSubmit() {
        setSubmitted(true);
        if (score >= passMark) {
            // auto-complete not needed here; user sees results first
        }
    }

    return (
        <div className="text-gray-900 dark:text-[#F8FAFC]">
            <div className="mb-6">
                <h2 className="text-[24px] font-bold text-gray-900 dark:text-white">Comprehension Check</h2>
                <p className="text-[15px] text-slate-500 dark:text-[#94A3B8]">Answer the questions to test your understanding of the video.</p>
            </div>

            <div className="space-y-0">
                {questions.map((q, i) => (
                    <div key={q.id} className="py-5 border-b border-gray-200 dark:border-[#1E293B]">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            <span className="text-blue-500 mr-2">{i + 1}.</span>
                            {q.question}
                        </p>

                        {q.type === 'tfng' && (
                            <div className="flex flex-wrap gap-2">
                                {['True', 'False', 'Not Given'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => !submitted && setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                                        disabled={submitted}
                                        className={`px-5 py-2.5 rounded-[12px] text-[15px] font-medium border transition-all ${answers[q.id] === opt
                                            ? submitted
                                                ? opt === q.correctAnswer
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-500'
                                                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-500'
                                                : 'bg-blue-50 dark:bg-[#0F172A] text-blue-600 dark:text-blue-400 border-blue-500'
                                            : submitted && opt === q.correctAnswer
                                                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-[#1E293B] text-gray-700 dark:text-[#F8FAFC] hover:border-[#60A5FA] cursor-pointer'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {q.type === 'mcq' && (
                            <div className="space-y-2">
                                {q.options?.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => !submitted && setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                                        disabled={submitted}
                                        className={`w-full text-left px-4 py-3 rounded-[12px] text-[15px] border transition-all ${answers[q.id] === opt
                                            ? submitted
                                                ? opt === q.correctAnswer
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-500'
                                                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-500'
                                                : 'bg-blue-50 dark:bg-[#0F172A] text-blue-600 dark:text-blue-400 border-blue-500'
                                            : submitted && opt === q.correctAnswer
                                                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-[#1E293B] text-gray-700 dark:text-[#F8FAFC] hover:border-[#60A5FA] cursor-pointer'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {q.type === 'sentence-completion' && (
                            <input
                                type="text"
                                value={answers[q.id] || ''}
                                onChange={(e) => !submitted && setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                                disabled={submitted}
                                placeholder="Type your answer..."
                                className={`w-full px-3 py-2.5 rounded-[12px] border text-[15px] transition-all bg-white dark:bg-[#0F172A] text-gray-900 dark:text-[#F8FAFC] ${submitted
                                    ? answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()
                                        ? 'border-emerald-500'
                                        : 'border-red-500'
                                    : 'border-slate-300 dark:border-[#1E293B] focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                    } outline-none`}
                            />
                        )}

                        {submitted && (
                            <div className="mt-4 text-[14px] rounded-[12px] p-4 border bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-[#1E293B] text-slate-700 dark:text-slate-300">
                                {answers[q.id]?.toLowerCase().trim() !== q.correctAnswer.toLowerCase().trim() && (
                                    <p className="font-semibold mb-2 text-emerald-600 dark:text-emerald-400">Correct answer: {q.correctAnswer}</p>
                                )}
                                <p className="leading-relaxed">{q.explanation}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {!submitted ? (
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-[12px] font-bold transition-colors"
                    >
                        Check Answers {Object.keys(answers).length > 0 && `(${Object.keys(answers).length}/${questions.length})`}
                    </button>
                ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                        <div className={`px-5 py-2.5 rounded-[12px] font-bold text-[15px] border ${score >= passMark
                            ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                            : 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                            }`}>
                            Score: {score}/{questions.length} {score >= passMark ? '✓ Great job!' : '— Review the explanations above'}
                        </div>
                        {!isCompleted && (
                            <button
                                onClick={onComplete}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-[12px] font-bold transition-colors"
                            >
                                Continue to Vocabulary →
                            </button>
                        )}
                        {isCompleted && (
                            <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                Step completed
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════
// STEP 3: Vocabulary
// ═══════════════════════════════════════════════════════════════════════
function VocabularyStep({ vocabulary, onComplete, isCompleted }: { vocabulary: VocabularyItem[]; onComplete: () => void; isCompleted: boolean }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [maxReachedIndex, setMaxReachedIndex] = useState(0);

    const v = vocabulary[currentIndex];
    const isLast = currentIndex === vocabulary.length - 1;
    const canContinue = isCompleted || maxReachedIndex >= vocabulary.length - 1;

    const handleNext = () => {
        if (currentIndex < vocabulary.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setMaxReachedIndex(prev => Math.max(prev, nextIndex));
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="text-gray-900 dark:text-[#F8FAFC] max-w-5xl mx-auto">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-[24px] font-bold text-gray-900 dark:text-white">Key Vocabulary</h2>
                    <span className="text-[14px] font-medium px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">
                        Word {currentIndex + 1} of {vocabulary.length}
                    </span>
                </div>
                <p className="text-[15px] text-slate-500 dark:text-[#94A3B8]">Review each word carefully. You'll be able to continue once you've seen all words.</p>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-blue-500 transition-all duration-300 ease-out"
                    style={{ width: `${((maxReachedIndex + 1) / vocabulary.length) * 100}%` }}
                />
            </div>

            {/* Vocabulary Card */}
            <div className="bg-white dark:bg-[#0F172A] rounded-[24px] border border-gray-200 dark:border-[#1E293B] overflow-hidden shadow-sm">
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                        <div>
                            <h3 className="text-[42px] font-bold text-gray-900 dark:text-white leading-tight">{v.word}</h3>
                            <span className="text-[16px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">{v.partOfSpeech}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-[14px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Definition</h4>
                            <p className="text-[24px] text-gray-700 dark:text-slate-200 leading-relaxed font-semibold">
                                {v.definition}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-[14px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Standard Example</h4>
                            <p className="text-[18px] text-gray-600 dark:text-slate-300 leading-relaxed border-l-4 border-blue-400 pl-5 py-2">
                                "{v.example}"
                            </p>
                        </div>

                        {(v.speakingExample || v.writingExample) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                {v.writingExample && (
                                    <div className="p-6 rounded-[20px] bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100/50 dark:border-amber-500/10">
                                        <h4 className="text-[14px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-1.5">
                                            <span>✍️</span> Writing Usage
                                        </h4>
                                        <p className="text-[16px] text-slate-700 dark:text-slate-200 leading-relaxed italic">
                                            {v.writingExample}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {(v.collocations || v.synonyms) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-gray-100 dark:border-slate-800">
                                {v.collocations && v.collocations.length > 0 && (
                                    <div>
                                        <h4 className="text-[14px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Collocations</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {v.collocations.map((c, i) => (
                                                <span key={i} className="text-[14px] px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {v.synonyms && v.synonyms.length > 0 && (
                                    <div>
                                        <h4 className="text-[14px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Synonyms</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {v.synonyms.map((s, i) => (
                                                <span key={i} className="text-[14px] px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg italic font-medium">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {v.tip && (
                            <div className="p-6 rounded-[20px] bg-blue-50/30 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 flex gap-4">
                                <span className="text-2xl">💡</span>
                                <div>
                                    <h4 className="text-[14px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                                        {v.tipType === 'writing' ? 'Writing Tip' : 'Pro Tip'}
                                    </h4>
                                    <p className="text-[16px] text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                                        {v.tip}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Card Footer Navigation */}
                <div className="bg-slate-50/50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-800 p-6 flex justify-between items-center">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-[14px] font-semibold transition-all ${currentIndex === 0
                            ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                            }`}
                    >
                        ← Prev
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={isLast}
                        className={`flex items-center gap-2 px-6 py-2 rounded-[12px] text-[14px] font-bold transition-all ${isLast
                            ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                            : 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-500/20 hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                    >
                        {isLast ? 'Last Word' : 'Next Word →'}
                    </button>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 flex justify-center">
                {!isCompleted ? (
                    <button
                        onClick={onComplete}
                        disabled={!canContinue}
                        className={`px-10 py-4 rounded-[16px] font-bold text-[16px] transition-all duration-300 ${canContinue
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:translate-y-[-2px]'
                            : 'bg-slate-100 dark:bg-[#111827] text-slate-400 cursor-not-allowed opacity-60'
                            }`}
                    >
                        {canContinue
                            ? "I've mastered all words — Continue →"
                            : `Review all words to continue (${maxReachedIndex + 1}/${vocabulary.length})`
                        }
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-6 py-3 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        Vocabulary Review Completed
                    </div>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════
// STEP 4: Vocabulary Exercises
// ═══════════════════════════════════════════════════════════════════════
function VocabExercisesStep({ exercises, vocabulary, onComplete, isCompleted }: { exercises: VocabExercise[]; vocabulary: VocabularyItem[]; onComplete: () => void; isCompleted: boolean }) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const score = useMemo(() => {
        if (!submitted) return 0;
        return exercises.filter((e) => answers[e.id]?.toLowerCase().trim() === e.correctAnswer.toLowerCase().trim()).length;
    }, [submitted, answers, exercises]);

    const passMark = Math.ceil(exercises.length * 0.6);

    return (
        <div className="text-gray-900 dark:text-[#F8FAFC]">
            <div className="mb-6">
                <h2 className="text-[24px] font-bold text-gray-900 dark:text-white">Vocabulary Exercises</h2>
                <p className="text-[15px] text-slate-500 dark:text-[#94A3B8]">Test your understanding of the new vocabulary.</p>
            </div>

            <div className="space-y-0">
                {exercises.map((ex, i) => (
                    <div key={ex.id} className="py-5 border-b border-gray-200 dark:border-[#1E293B]">
                        {ex.instruction && (
                            <p className="text-[15px] text-slate-500 dark:text-[#94A3B8] mb-3 font-normal">
                                {ex.instruction}
                            </p>
                        )}
                        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            <span className="text-blue-500 mr-2">{i + 1}.</span>
                            {ex.question}
                        </p>

                        {ex.hint && !submitted && (
                            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium mb-3">💡 Hint: {ex.hint}</p>
                        )}

                        {ex.type === 'fill-blank' && (
                            <input
                                type="text"
                                value={answers[ex.id] || ''}
                                onChange={(e) => !submitted && setAnswers((prev) => ({ ...prev, [ex.id]: e.target.value }))}
                                disabled={submitted}
                                placeholder="Type your answer..."
                                className={`w-full px-3 py-2.5 rounded-[12px] border text-[15px] transition-all bg-white dark:bg-[#0F172A] text-gray-900 dark:text-[#F8FAFC] ${submitted
                                    ? answers[ex.id]?.toLowerCase().trim() === ex.correctAnswer.toLowerCase().trim()
                                        ? 'border-emerald-500'
                                        : 'border-red-500'
                                    : 'border-slate-300 dark:border-[#1E293B] focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                    } outline-none`}
                            />
                        )}

                        {ex.type === 'matching' && (
                            <select
                                value={answers[ex.id] || ''}
                                onChange={(e) => !submitted && setAnswers((prev) => ({ ...prev, [ex.id]: e.target.value }))}
                                disabled={submitted}
                                className={`w-full px-3 py-2.5 rounded-[12px] border text-[15px] transition-all bg-white dark:bg-[#0F172A] text-gray-900 dark:text-[#F8FAFC] cursor-pointer ${submitted
                                    ? answers[ex.id]?.toLowerCase().trim() === ex.correctAnswer.toLowerCase().trim()
                                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                        : 'border-red-500 text-red-600 dark:text-red-400'
                                    : 'border-slate-300 dark:border-[#1E293B] focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                    } outline-none`}
                            >
                                <option value="" disabled>Select your answer...</option>
                                {vocabulary.map((v) => (
                                    <option key={v.id} value={v.word} className="bg-white dark:bg-[#0F172A]">
                                        {v.word}
                                    </option>
                                ))}
                            </select>
                        )}

                        {ex.type === 'mcq' && (
                            <div className="space-y-2">
                                {ex.options?.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => !submitted && setAnswers((prev) => ({ ...prev, [ex.id]: opt }))}
                                        disabled={submitted}
                                        className={`w-full text-left px-4 py-3 rounded-[12px] text-[15px] border transition-all ${answers[ex.id] === opt
                                            ? submitted
                                                ? opt === ex.correctAnswer
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-500'
                                                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-500'
                                                : 'bg-blue-50 dark:bg-[#0F172A] text-blue-600 dark:text-blue-400 border-blue-500'
                                            : submitted && opt === ex.correctAnswer
                                                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-[#1E293B] text-gray-700 dark:text-[#F8FAFC] hover:border-[#60A5FA] cursor-pointer'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {submitted && answers[ex.id]?.toLowerCase().trim() !== ex.correctAnswer.toLowerCase().trim() && (
                            <p className="mt-3 text-[14px] font-semibold text-emerald-600 dark:text-emerald-400">
                                Correct answer: {ex.correctAnswer}
                            </p>
                        )}
                        {submitted && ex.explanation && (
                            <div className="mt-3 text-[14px] rounded-[12px] p-4 border bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-[#1E293B] text-slate-700 dark:text-slate-300">
                                <p className="leading-relaxed">{ex.explanation}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {!submitted ? (
                    <button
                        onClick={() => setSubmitted(true)}
                        className="px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-teal-600/25"
                    >
                        Check Answers {Object.keys(answers).length > 0 && `(${Object.keys(answers).length}/${exercises.length})`}
                    </button>
                ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                        <div className={`px-5 py-2.5 rounded-[12px] font-bold text-[15px] border ${score >= passMark
                            ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                            : 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                            }`}>
                            Score: {score}/{exercises.length} {score >= passMark ? '✓ Great job!' : '— Review the correct answers above'}
                        </div>
                        {!isCompleted && (
                            <button onClick={onComplete} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-[12px] font-bold transition-colors">
                                Continue to Summary Writing →
                            </button>
                        )}
                        {isCompleted && (
                            <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                Step completed
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════
// STEP 5: Summary Writing (AI-Powered Evaluation via Gemini 2.0 Flash)
// ═══════════════════════════════════════════════════════════════════════
function SummaryStep({ lesson, onComplete, isCompleted }: { lesson: VideoLessonType; onComplete: () => void; isCompleted: boolean }) {
    const [summary, setSummary] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [evaluation, setEvaluation] = useState<any>(null);

    const wordCount = summary.trim().split(/\s+/).filter(Boolean).length;
    const meetsMinimum = wordCount >= lesson.summaryMinWords;
    const maxWords = lesson.summaryMaxWords || 200;

    async function handleSubmit() {
        setLoading(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const authHeaders: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (session?.access_token) {
                authHeaders['Authorization'] = `Bearer ${session.access_token}`;
            }

            const response = await fetch('http://localhost:8002/podcast-summary/evaluate', {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({
                    summary_text: summary,
                    lesson_title: lesson.title,
                    summary_prompt: lesson.summaryPrompt,
                    vocabulary_words: lesson.vocabulary.map(v => v.word),
                    summary_requirements: lesson.summaryRequirements || [],
                    transcript_phrases: lesson.transcriptPhrases || [],
                    full_transcript: lesson.fullTranscript || '',
                    min_words: lesson.summaryMinWords,
                    max_words: maxWords,
                }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail?.message || errData.detail?.error || `Server error: ${response.status}`);
            }

            const result = await response.json();
            setEvaluation(result);
            setSubmitted(true);
            onComplete();
        } catch (err: any) {
            setError(err.message || 'Failed to evaluate summary. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    // ─── Score color helpers ─────────────────────────────────────────
    function getScoreColor(score: number, max: number) {
        const pct = (score / max) * 100;
        if (pct >= 80) return { bg: 'bg-emerald-50 dark:bg-emerald-900/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/20', ring: 'stroke-emerald-500' };
        if (pct >= 60) return { bg: 'bg-blue-50 dark:bg-blue-900/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-500/20', ring: 'stroke-blue-500' };
        if (pct >= 40) return { bg: 'bg-amber-50 dark:bg-amber-900/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/20', ring: 'stroke-amber-500' };
        return { bg: 'bg-red-50 dark:bg-red-900/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-500/20', ring: 'stroke-red-500' };
    }

    function getLabelColor(label: string) {
        const l = label?.toLowerCase() || '';
        if (l === 'excellent' || l === 'outstanding') return 'text-emerald-500';
        if (l === 'good' || l === 'very good') return 'text-blue-500';
        if (l === 'fair' || l === 'average') return 'text-amber-500';
        return 'text-red-500';
    }

    const categoryLabels: Record<string, string> = {
        contentComprehension: '📖 Content & Comprehension',
        vocabularyUse: '📝 Vocabulary Use',
        ownWords: '✍️ Own Words',
        languageAccuracy: '🔤 Language Accuracy',
        structureFlow: '🔗 Structure & Flow',
    };

    // ─── Writing Phase ───────────────────────────────────────────────
    if (!submitted || !evaluation) {
        return (
            <div className="text-gray-900 dark:text-[#F8FAFC]">
                <div className="mb-6">
                    <h2 className="text-[24px] font-bold text-gray-900 dark:text-white">Summary Writing</h2>
                    <p className="text-[15px] text-slate-500 dark:text-[#94A3B8]">Write a summary of the video in your own words. AI will evaluate your writing.</p>
                </div>

                <div className="pb-4 mb-6 border-b border-gray-200 dark:border-[#1E293B]">
                    <p className="text-[15px] text-gray-700 dark:text-[#F8FAFC] leading-relaxed whitespace-pre-line">{lesson.summaryPrompt}</p>
                </div>

                {/* Vocabulary reminder */}
                <div className="bg-slate-50 dark:bg-[#0F172A]/50 border border-gray-200 dark:border-[#1E293B] rounded-[12px] p-4 mb-6">
                    <p className="text-[14px] font-semibold text-slate-700 dark:text-[#F8FAFC] mb-3">Remember to use these vocabulary words:</p>
                    <div className="flex flex-wrap gap-2">
                        {lesson.vocabulary.map((v) => (
                            <span key={v.id} className="px-3 py-1 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#1E293B] text-gray-700 dark:text-slate-300 rounded-[12px] text-[13px] font-medium">
                                {v.word}
                            </span>
                        ))}
                    </div>
                </div>

                <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    disabled={loading}
                    rows={10}
                    placeholder="Write your summary here..."
                    className="w-full px-5 py-4 rounded-[12px] border border-slate-300 dark:border-[#1E293B] bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white text-[15px] leading-relaxed outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none disabled:opacity-60"
                />

                <div className="flex items-center justify-between mt-3 mb-6">
                    <p className={`text-[14px] font-medium ${meetsMinimum ? 'text-blue-500' : 'text-slate-400'}`}>
                        {wordCount} words {meetsMinimum ? '✓' : `(minimum ${lesson.summaryMinWords})`}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-[12px] bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-[14px]">
                        <p className="font-semibold mb-1">⚠️ Evaluation Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-8 py-3 rounded-[12px] font-bold transition-all flex items-center gap-3 ${!loading
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-slate-200 dark:bg-[#111827] text-slate-400 cursor-not-allowed'
                    }`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Evaluating with AI...
                        </>
                    ) : (
                        'Submit Summary for AI Evaluation'
                    )}
                </button>
            </div>
        );
    }

    // ─── Results Phase ───────────────────────────────────────────────
    const totalColor = getScoreColor(evaluation.totalScore, 100);

    return (
        <div className="text-gray-900 dark:text-[#F8FAFC] space-y-6">
            {/* ── Total Score Card ── */}
            <div className={`relative overflow-hidden rounded-[16px] border ${totalColor.border} ${totalColor.bg} p-8 text-center`}>
                <div className="relative">
                    <div className="inline-flex items-center justify-center mb-4">
                        <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-700" />
                            <circle
                                cx="60" cy="60" r="52" fill="none" strokeWidth="8" strokeLinecap="round"
                                className={totalColor.ring}
                                strokeDasharray={`${(evaluation.totalScore / 100) * 327} 327`}
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className={`text-[36px] font-bold ${totalColor.text}`}>{evaluation.totalScore}</span>
                            <span className="text-[13px] text-slate-400 font-medium">/100</span>
                        </div>
                    </div>
                    <h3 className={`text-[22px] font-bold ${getLabelColor(evaluation.scoreLabel)}`}>{evaluation.scoreLabel}</h3>
                    <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-1">{evaluation.wordCount} words written</p>
                </div>
            </div>

            {/* ── Category Scores ── */}
            <div className="space-y-3">
                <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">Score Breakdown</h3>
                {evaluation.scores && Object.entries(evaluation.scores).map(([key, cat]: [string, any]) => {
                    const c = getScoreColor(cat.score, cat.maxScore);
                    const pct = (cat.score / cat.maxScore) * 100;
                    return (
                        <div key={key} className={`rounded-[12px] border ${c.border} ${c.bg} p-4`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[15px] font-semibold text-gray-900 dark:text-white">{categoryLabels[key] || key}</span>
                                <span className={`text-[15px] font-bold ${c.text}`}>{cat.score}/{cat.maxScore}</span>
                            </div>
                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                                <div className={`h-full rounded-full transition-all duration-700 ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                            </div>
                            <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">{cat.comment}</p>
                        </div>
                    );
                })}
            </div>

            {/* ── Vocabulary Analysis ── */}
            <div className="rounded-[12px] border border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#0F172A] p-5 space-y-4">
                <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">📝 Vocabulary Analysis</h3>

                {evaluation.vocabularyUsed?.length > 0 && (
                    <div>
                        <p className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 mb-2">✅ Used Correctly</p>
                        <div className="flex flex-wrap gap-2">
                            {evaluation.vocabularyUsed.map((w: string, i: number) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[13px] font-medium">{w}</span>
                            ))}
                        </div>
                    </div>
                )}

                {evaluation.vocabularyMissed?.length > 0 && (
                    <div>
                        <p className="text-[13px] font-semibold text-amber-600 dark:text-amber-400 mb-2">⚠️ Not Used</p>
                        <div className="flex flex-wrap gap-2">
                            {evaluation.vocabularyMissed.map((w: string, i: number) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-[13px] font-medium">{w}</span>
                            ))}
                        </div>
                    </div>
                )}

                {evaluation.vocabularyUsedIncorrectly?.length > 0 && (
                    <div>
                        <p className="text-[13px] font-semibold text-red-600 dark:text-red-400 mb-2">❌ Used Incorrectly</p>
                        <div className="flex flex-wrap gap-2">
                            {evaluation.vocabularyUsedIncorrectly.map((w: string, i: number) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-[13px] font-medium">{w}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Strengths ── */}
            {evaluation.strengths?.length > 0 && (
                <div className="rounded-[12px] border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-900/10 p-5">
                    <h3 className="text-[18px] font-bold text-emerald-700 dark:text-emerald-400 mb-4">💪 What You Did Well</h3>
                    <div className="space-y-3">
                        {evaluation.strengths.map((s: string, i: number) => (
                            <div key={i} className="flex items-start gap-3">
                                <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                                <p className="text-[14px] text-emerald-800 dark:text-emerald-300 leading-relaxed">{s}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Improvements ── */}
            {evaluation.improvements?.length > 0 && (
                <div className="rounded-[12px] border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-900/10 p-5">
                    <h3 className="text-[18px] font-bold text-amber-700 dark:text-amber-400 mb-4">🎯 Areas to Improve</h3>
                    <div className="space-y-5">
                        {evaluation.improvements.map((imp: any, i: number) => (
                            <div key={i} className="bg-white dark:bg-[#0F172A] rounded-[12px] p-4 border border-amber-100 dark:border-amber-500/10">
                                <p className="text-[14px] font-semibold text-amber-800 dark:text-amber-300 mb-3">{imp.issue}</p>
                                <div className="space-y-2 text-[13px]">
                                    <div className="flex items-start gap-2">
                                        <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                                        <p className="text-red-700 dark:text-red-400 line-through">{imp.originalSentence}</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                                        <p className="text-emerald-700 dark:text-emerald-400 font-medium">{imp.correctedSentence}</p>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 mt-2 pl-5 italic">{imp.explanation}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Copied Phrases ── */}
            {evaluation.copiedPhrases?.length > 0 && (
                <div className="rounded-[12px] border border-violet-200 dark:border-violet-500/20 bg-violet-50 dark:bg-violet-900/10 p-5">
                    <h3 className="text-[18px] font-bold text-violet-700 dark:text-violet-400 mb-4">📋 Phrases from the Podcast</h3>
                    <p className="text-[13px] text-violet-600 dark:text-violet-400 mb-4">These phrases appear to be copied directly from the podcast. Try paraphrasing them:</p>
                    <div className="space-y-4">
                        {evaluation.copiedPhrases.map((cp: any, i: number) => (
                            <div key={i} className="bg-white dark:bg-[#0F172A] rounded-[12px] p-4 border border-violet-100 dark:border-violet-500/10 space-y-2 text-[13px]">
                                <div className="flex items-start gap-2">
                                    <span className="text-violet-400 mt-0.5 flex-shrink-0">You wrote:</span>
                                    <p className="text-violet-700 dark:text-violet-300 italic">"{cp.studentPhrase}"</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-slate-400 mt-0.5 flex-shrink-0">Original:</span>
                                    <p className="text-slate-500 dark:text-slate-400 italic">"{cp.originalPhrase}"</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">Try this:</span>
                                    <p className="text-emerald-700 dark:text-emerald-400 font-medium">"{cp.suggestedParaphrase}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Overall Feedback ── */}
            {evaluation.overallFeedback && (
                <div className="rounded-[12px] border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-900/10 p-5">
                    <div className="flex items-start gap-3">
                        <span className="text-[24px]">🌟</span>
                        <div>
                            <h3 className="text-[16px] font-bold text-blue-700 dark:text-blue-400 mb-2">Overall Feedback</h3>
                            <p className="text-[15px] text-blue-800 dark:text-blue-300 leading-relaxed">{evaluation.overallFeedback}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

