import { useState } from "react";
import {
  BookOpen,
  Lightbulb,
  Clock,
  CheckCircle,
  XCircle,
  ListChecks,
  LayoutList,
  TextCursor,
  PenLine,
  HelpCircle,
  Puzzle,
  ArrowRight,
  AlertCircle,
  Table,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Sparkles,
  Target,
  Zap,
  GraduationCap,
  Search,
  RefreshCw,
  MapPin,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import theoryDataRaw from '~backend/data/reading-theory.json';

const theoryData = theoryDataRaw as any;

// Helper to get icon based on theory ID
const getTheoryIcon = (id: string) => {
  switch (id) {
    case 'true-false-not-given':
    case 'yes-no-not-given':
      return <CheckCircle className="w-6 h-6 text-emerald-500" />;
    case 'matching-headings':
    case 'matching-information':
      return <LayoutList className="w-6 h-6 text-blue-500" />;
    case 'multiple-choice':
      return <ListChecks className="w-6 h-6 text-purple-500" />;
    case 'gap-fill':
    case 'sentence-completion':
    case 'summary-completion':
      return <TextCursor className="w-6 h-6 text-orange-500" />;
    case 'short-answer':
      return <PenLine className="w-6 h-6 text-pink-500" />;
    case 'matching-features':
      return <Puzzle className="w-6 h-6 text-indigo-500" />;
    case 'table-completion':
      return <Table className="w-6 h-6 text-cyan-500" />;
    default:
      return <BookOpen className="w-6 h-6 text-slate-500" />;
  }
};

export default function ReadingTheory() {
  const [selectedTheory, setSelectedTheory] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [userSelections, setUserSelections] = useState<Record<string, string>>({}); // Track user clicks for interactive questions
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({}); // Track quiz answers
  const [quizRevealed, setQuizRevealed] = useState<Record<string, boolean>>({}); // Track revealed quiz explanations

  // Quiz Mode State
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const toggleSection = (id: string) => {
    setCollapsedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAnswer = (id: string) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOptionClick = (questionId: string, option: string, correctAnswer: string) => {
    setUserSelections(prev => ({ ...prev, [questionId]: option }));
    if (option === correctAnswer) {
      // Auto-reveal if correct
      setRevealedAnswers(prev => ({ ...prev, [questionId]: true }));
    }
  };

  const handleQuizAnswer = (quizId: string, answer: string, correctAnswer: string) => {
    setQuizAnswers(prev => ({ ...prev, [quizId]: answer }));
    if (answer === correctAnswer) {
      setQuizRevealed(prev => ({ ...prev, [quizId]: true }));
    }
  };

  const toggleQuizExplanation = (quizId: string) => {
    setQuizRevealed(prev => ({ ...prev, [quizId]: !prev[quizId] }));
  };

  // Quiz Mode Functions
  const startQuiz = () => {
    setQuizMode(true);
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setQuizAnswers({});
    setQuizRevealed({});
  };

  const exitQuiz = () => {
    setQuizMode(false);
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
  };

  const nextQuestion = (totalQuestions: number) => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = (questions: any[]) => {
    let correct = 0;
    questions.forEach((q: any, idx: number) => {
      const quizId = `quiz-${idx}`;
      if (quizAnswers[quizId] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  // Get the selected theory content
  const theoryContent = selectedTheory
    ? theoryData.questionTypes.find((t: any) => t.id === selectedTheory)
    : null;

  // Handle different JSON structures for different question types
  // Some types have detailedTheory.sections, others have sections directly
  // Define Strict Interfaces
  interface TheoryExample {
    passage?: string;
    question?: string;
    options?: string[];
    answer?: string;
    correct?: string;
    wrong?: string | string[];
    explanation?: string | Record<string, string>;
    distractor?: string;
    analysis?: string | string[];
    // Legacy fields for backward compatibility
    validInference?: string;
    invalidAssumption?: string;
    wrongThinking?: string;
    correctThinking?: string;
    optionB?: string;
    optionC?: string;
    [key: string]: any;
  }

  interface TheoryRule {
    rule?: string;
    title?: string;
    description?: string;
    examples?: string[];
    example?: TheoryExample | string;
  }

  interface TheorySubsection {
    id?: string;
    title: string;
    content?: string;
    description?: string;
    examples?: TheoryExample[];
    rules?: TheoryRule[];
    // ... catch-all for other specific fields
    [key: string]: any;
  }

  // Helper to normalize examples to array
  const normalizeExamples = (sub: any): TheoryExample[] => {
    if (sub.examples && Array.isArray(sub.examples)) return sub.examples;
    if (sub.example && typeof sub.example === 'object') return [sub.example];
    return [];
  };

  const sections = theoryContent?.detailedTheory?.sections || theoryContent?.sections;
  const mc = theoryContent as any;

  // Dev mode warning helper
  const RENDERED_KEYS = ['id', 'title', 'content', 'description', 'examples', 'example', 'rules', 'steps', 'flowchart', 'comparison', 'levels', 'formats', 'predictions', 'list', 'questionWords', 'grammarClues', 'signalPatterns', 'categories', 'recommendations', 'average', 'rationale', 'comparisonTable', 'criticalPoint', 'types', 'typicalInstructions', 'paraphrasePatterns', 'answerMeanings', 'skills', 'keyInsight', 'criteria', 'intro', 'subsections', 'passage'];


  // Show theory list
  if (!selectedTheory) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
            📚 Reading Theory
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Master the strategies for every IELTS Reading question type.
          </p>
        </div>

        {/* Enhanced Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 shadow-xl">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex gap-5 items-start">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Lightbulb className="w-8 h-8 text-yellow-300" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                Why Study Theory?
              </h3>
              <p className="text-blue-100 leading-relaxed max-w-3xl">
                Understanding question types <span className="font-semibold text-white">BEFORE</span> practicing helps you recognize patterns, avoid common traps, and answer with precision. It's the fastest way to improve your score.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {theoryData.questionTypes.map((theory: any) => (
            <Card
              key={theory.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-400/50 hover:-translate-y-1 bg-white dark:bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setSelectedTheory(theory.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                    {getTheoryIcon(theory.id)}
                  </div>
                  <Badge variant="outline" className="text-xs font-medium text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700">
                    {theory.category.replace('-', ' ')}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {theory.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                  Start Learning <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!theoryContent) return null;

  // Quiz Mode View
  if (quizMode && theoryContent.quiz && theoryContent.quiz.length > 0) {
    const quizQuestions = theoryContent.quiz;
    const totalQuestions = quizQuestions.length;
    const currentQ = quizQuestions[currentQuestionIndex];
    const quizId = `quiz-${currentQuestionIndex}`;
    const userAnswer = quizAnswers[quizId];
    const isCorrect = userAnswer === currentQ.correctAnswer;
    const isRevealed = quizRevealed[quizId];
    const score = calculateScore(quizQuestions);
    const percentage = Math.round((score / totalQuestions) * 100);

    // Quiz Completed View
    if (quizCompleted) {
      return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Quiz Complete!</h2>
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              {score}/{totalQuestions}
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              You scored <span className="font-bold text-emerald-600">{percentage}%</span>
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => startQuiz()}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Retry Quiz
              </button>
              <button
                onClick={exitQuiz}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Back to Theory
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Quiz Question View
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={exitQuiz}
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            ← Exit Quiz
          </button>
          <Badge variant="outline" className="text-indigo-600 border-indigo-300">
            {theoryContent.name}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg">
          <CardContent className="p-6 space-y-6">
            {/* Question Type Badge */}
            <Badge
              variant="outline"
              className={currentQ.type === 'concept-check'
                ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400"
                : "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400"
              }
            >
              {currentQ.type === 'concept-check' ? '💡 Concept Check' : '📝 Mini Practice'}
            </Badge>

            {/* Mini-Practice: Micro Text & Statement */}
            {currentQ.type === 'mini-practice' && currentQ.microText && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 italic text-slate-700 dark:text-slate-300">
                "{currentQ.microText}"
              </div>
            )}
            {currentQ.type === 'mini-practice' && currentQ.statement && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 rounded-r-lg">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block mb-1">Statement:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{currentQ.statement}</span>
              </div>
            )}

            {/* Question */}
            <p className="text-lg font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
              {currentQ.question}
            </p>

            {/* Options */}
            <div className="grid gap-3">
              {currentQ.options?.map((opt: string, optIdx: number) => {
                const isSelected = userAnswer === opt;
                const isThisCorrect = opt === currentQ.correctAnswer;
                let optClass = "w-full p-4 rounded-xl border-2 text-left font-medium transition-all";

                if (isSelected) {
                  if (isThisCorrect) {
                    optClass += " border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400";
                  } else {
                    optClass += " border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400";
                  }
                } else {
                  optClass += " border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/10";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleQuizAnswer(quizId, opt, currentQ.correctAnswer)}
                    className={optClass}
                    disabled={isCorrect}
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {userAnswer && !isCorrect && (
              <div className="p-3 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-700 dark:text-rose-400 text-sm font-medium">
                Not quite — try again!
              </div>
            )}

            {/* Explanation (shown after correct answer or on reveal) */}
            {(isCorrect || isRevealed) && currentQ.explanation && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-emerald-500 rounded-r-lg">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                      Correct Answer: {currentQ.correctAnswer}
                    </span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Show Explanation Button (if not answered correctly yet) */}
            {!isCorrect && !isRevealed && (
              <button
                onClick={() => toggleQuizExplanation(quizId)}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
              >
                Show Answer
              </button>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={() => nextQuestion(totalQuestions)}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next →'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-12 pb-24">
      {/* Back button */}
      <button
        onClick={() => setSelectedTheory(null)}
        className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
      >
        ← Back to Theory List
      </button>

      {/* Premium Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 border border-slate-800 shadow-2xl p-8 mb-10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
              {getTheoryIcon(theoryContent.id)}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-200 border-blue-500/30 px-3 py-1">
                  {theoryContent.category.replace('-', ' ')}
                </Badge>
                {theoryContent.whatIsIt?.skillTested && (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-200 border-emerald-500/30 px-3 py-1">
                    <Target className="w-3 h-3 mr-1" /> Skill Building
                  </Badge>
                )}
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
                  {theoryContent.name}
                </h1>
                <p className="text-lg text-blue-100/80 leading-relaxed max-w-2xl">
                  {theoryContent.whatIsIt?.description || "Master this question type with our comprehensive guide."}
                </p>
              </div>

              {theoryContent.whatIsIt?.skillTested && (
                <div className="flex items-start gap-2 text-sm text-slate-300 bg-black/20 p-3 rounded-lg border border-white/5">
                  <Sparkles className="w-4 h-4 text-yellow-300 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-semibold text-white">Core Skill:</span> {theoryContent.whatIsIt.skillTested}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* Detailed Theory Sections */}
      {sections && sections.length > 0 && (
        <div className="space-y-8">
          {sections.map((section: any) => (
            <Card
              key={section.id}
              className={`transition-all duration-300 ${collapsedSections[section.id] ? 'border-l-4 border-l-slate-300 dark:border-l-slate-700 bg-slate-50 dark:bg-slate-900/50' : 'border-l-4 border-l-emerald-500 shadow-lg'}`}
            >
              <CardHeader
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className={`text-xl ${collapsedSections[section.id] ? 'text-slate-500 dark:text-slate-400' : 'text-emerald-900 dark:text-emerald-100'}`}>
                      {section.title}
                    </CardTitle>
                    {section.intro && !collapsedSections[section.id] && (
                      <p className="text-slate-600 dark:text-slate-400 mt-2">{section.intro}</p>
                    )}
                  </div>
                  <div className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    {collapsedSections[section.id] ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronUp className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {!collapsedSections[section.id] && (
                <CardContent className="space-y-8 animate-in slide-in-from-top-2 duration-200">
                  {section.subsections?.map((sub: any, idx: number) => (
                    <div key={idx} className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                        {sub.title}
                      </h3>

                      {sub.content && <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg max-w-[800px]">{sub.content}</p>}
                      {sub.description && <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg max-w-[800px]">{sub.description}</p>}

                      {/* Analysis (List) - ENHANCED with Visual Anchors */}
                      {sub.analysis && Array.isArray(sub.analysis) && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                          <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-200 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Search className="w-4 h-4" /> Analysis
                          </h4>
                          <ul className="space-y-3">
                            {sub.analysis.map((point: string, i: number) => {
                              // Visual Anchors Logic
                              let Icon = CheckCircle;
                              let iconColor = "text-indigo-500";

                              if (point.toLowerCase().includes("scanning")) { Icon = Search; iconColor = "text-blue-500"; }
                              else if (point.toLowerCase().includes("paraphrase")) { Icon = RefreshCw; iconColor = "text-purple-500"; }
                              else if (point.toLowerCase().includes("detail")) { Icon = MapPin; iconColor = "text-rose-500"; }

                              return (
                                <li key={i} className="flex items-start gap-3 text-base text-indigo-900 dark:text-indigo-100 leading-relaxed">
                                  <div className={`mt-1 flex-shrink-0 ${iconColor}`}>
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <span>{point}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {sub.passage && (
                        <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-xl border-l-4 border-slate-500 italic text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-serif">
                          "{sub.passage}"
                        </div>
                      )}

                      {/* Generic Examples Renderer (Simple Lists) */}
                      {sub.examples && !sub.passage && !sub.examples[0]?.stepByStep && Array.isArray(sub.examples) && (
                        <div className="my-4 space-y-3">
                          {sub.examples.map((ex: any, i: number) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                              <div className="mt-1">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              </div>
                              <div className="text-sm text-slate-700 dark:text-slate-300">
                                {typeof ex === 'string' ? (
                                  <span dangerouslySetInnerHTML={{ __html: ex.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                ) : (
                                  <div>
                                    {ex.statement && <div className="font-medium mb-1">{ex.statement}</div>}
                                    {ex.demo && <div className="text-slate-500 dark:text-slate-400 text-xs mt-1">Example: {ex.demo}</div>}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Table Renderer - REFINED */}
                      {sub.tables && sub.tables.length > 0 && (
                        <div className="space-y-8 my-6">
                          {sub.tables.map((table: any, tblIdx: number) => {
                            const isDifficult = table.headers && table.headers.some((h: string) => h.includes('Matching Information'));

                            return (
                              <div key={tblIdx} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900">
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left border-collapse">
                                    <thead>
                                      <tr className="bg-slate-800 dark:bg-slate-950 text-white">
                                        {table.headers.map((header: string, hIdx: number) => (
                                          <th key={hIdx} className="p-5 font-bold uppercase tracking-wider text-xs border-r border-slate-700 last:border-r-0">
                                            <div className="flex items-center gap-2">
                                              {header}
                                              {header.includes('Matching Information') && (
                                                <Badge variant="destructive" className="ml-2 bg-rose-500 hover:bg-rose-600 border-0 text-[10px] px-2">
                                                  Most Difficult
                                                </Badge>
                                              )}
                                            </div>
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {table.rows.map((row: string[], rIdx: number) => (
                                        <tr key={rIdx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors last:border-b-0">
                                          {row.map((cell: string, cIdx: number) => (
                                            <td key={cIdx} className="p-5 border-r border-slate-100 dark:border-slate-800 last:border-r-0 text-slate-700 dark:text-slate-300 text-base leading-relaxed align-top">
                                              {cell.includes('Gap') || cell.includes('[') ? (
                                                <span className="inline-block font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded text-sm border border-indigo-100 dark:border-indigo-800">
                                                  {cell}
                                                </span>
                                              ) : (
                                                <span dangerouslySetInnerHTML={{ __html: cell.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                              )}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Answer Meanings */}
                      {sub.answerMeanings && (
                        <div className="grid gap-3">
                          {sub.answerMeanings.map((am: any, i: number) => (
                            <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">{am.answer}</span>
                              <span className="text-slate-700 dark:text-slate-300">{am.meaning}</span>
                              {am.whenToChoose && (
                                <ul className="mt-2 list-disc ml-4 text-sm text-slate-600 dark:text-slate-400">
                                  {am.whenToChoose.map((w: string, k: number) => <li key={k}>{w}</li>)}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Skills */}
                      {sub.skills && (
                        <div className="grid sm:grid-cols-2 gap-2">
                          {sub.skills.map((skill: any, i: number) => (
                            <div key={i} className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/10 rounded">
                              <CheckCircle className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                              <div>
                                <span className="font-semibold text-blue-900 dark:text-blue-100 block">{skill.skill}</span>
                                <span className="text-xs text-blue-800 dark:text-blue-200">{skill.meaning}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Key Insight */}
                      {sub.keyInsight && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded flex gap-3">
                          <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                          <p className="text-sm text-yellow-900 dark:text-yellow-100">
                            <span className="font-bold">Key Insight:</span> {sub.keyInsight}
                          </p>
                        </div>
                      )}

                      {/* Criteria Lists */}
                      {sub.criteria && (
                        <ul className="space-y-1 ml-5 list-disc text-slate-700 dark:text-slate-300">
                          {sub.criteria.map((c: string, i: number) => <li key={i}>{c}</li>)}
                        </ul>
                      )}

                      {/* Rules - ENHANCED */}
                      {sub.rules && Array.isArray(sub.rules) && (
                        <div className="space-y-4 my-6">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                            </div>
                            <h4 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest text-sm">Critical Rules</h4>
                          </div>
                          {sub.rules.map((ruleItem: any, i: number) => (
                            <div key={i} className="relative overflow-hidden p-0.5 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-sm hover:shadow-md transition-shadow">
                              <div className="h-full bg-white dark:bg-slate-900 rounded-[10px] p-5">
                                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                                  {ruleItem.rule || ruleItem.title}
                                </h4>
                                {ruleItem.description && (
                                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{ruleItem.description}</p>
                                )}
                                {ruleItem.examples && Array.isArray(ruleItem.examples) && (
                                  <ul className="mt-3 space-y-2">
                                    {ruleItem.examples.map((ex: string, j: number) => (
                                      <li key={j} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                        <span dangerouslySetInnerHTML={{ __html: ex.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                {ruleItem.example && typeof ruleItem.example === 'object' && (
                                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <div className="space-y-3 text-sm">
                                      {ruleItem.example.passage && (
                                        <div className="pl-3 border-l-2 border-slate-300 dark:border-slate-600 italic text-slate-600 dark:text-slate-400">
                                          "{ruleItem.example.passage}"
                                        </div>
                                      )}
                                      <div className="space-y-2">
                                        {Object.entries(ruleItem.example).map(([key, value]) => {
                                          if (key === 'passage') return null;
                                          if (Array.isArray(value)) return null;
                                          return (
                                            <div key={key} className="flex gap-2">
                                              <span className="font-bold capitalize text-slate-500 dark:text-slate-500 select-none min-w-[80px] text-right">{key}:</span>
                                              <span className={key === 'correct' ? 'text-emerald-600 font-medium' : key === 'wrong' ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}>
                                                {value as string}
                                              </span>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Flowchart (Two Question Test - T/F/NG only) */}
                      {sub.flowchart && Array.isArray(sub.flowchart) && sub.flowchart[0]?.question && (
                        <div className="space-y-2">
                          {sub.flowchart.map((step: any, i: number) => (
                            <div key={i} className="p-3 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded text-center">
                              <div className="font-bold text-indigo-800 dark:text-indigo-200 mb-1">Step {step.step}: {step.question}</div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="text-emerald-600 dark:text-emerald-400">Yes/Agrees → {step.ifYes || step.ifAgrees}</div>
                                <div className="text-rose-600 dark:text-rose-400">No/Contradicts → {step.ifNo || step.ifContradicts}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comparison Examples (T/F/NG only - not Short Answer) */}
                      {sub.examples && sub.passage && !sub.examples[0]?.stepByStep && (
                        <div className="space-y-3">
                          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded italic text-slate-700 dark:text-slate-300">
                            "{sub.passage}"
                          </div>
                          <div className="grid gap-2">
                            {sub.examples.map((ex: any, i: number) => (
                              <div key={i} className={`p-3 border-l-4 rounded-lg ${ex.answer === 'CORRECT'
                                ? 'border-emerald-500 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/20'
                                : 'border-rose-500 dark:border-rose-600 bg-rose-50/50 dark:bg-rose-900/20'
                                }`}>
                                <div className="space-y-2">
                                  <div className="flex items-start justify-between gap-3">
                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex-1">
                                      {ex.heading || ex.statement}
                                    </span>
                                    <span className={`font-bold text-xs px-2 py-1 rounded whitespace-nowrap ${ex.answer === 'CORRECT' ? 'bg-emerald-600 dark:bg-emerald-700 text-white' :
                                      ex.answer === 'TRUE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                                        ex.answer === 'FALSE' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' :
                                          ex.answer === 'WRONG' ? 'bg-rose-600 dark:bg-rose-700 text-white' :
                                            'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                                      }`}>{ex.answer}</span>
                                  </div>
                                  {ex.analysis && (
                                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                                      💡 {ex.analysis}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Steps (Strategy) - REFINED with Badges & Progress */}
                      {sub.steps && (
                        <div className="relative space-y-12 pl-6 my-10 before:absolute before:left-[21px] before:top-4 before:bottom-4 before:w-0.5 before:bg-indigo-100 dark:before:bg-indigo-900/50">
                          {sub.steps.map((step: any, i: number) => (
                            <div key={i} className="relative pl-8">
                              {/* Connector & Badge */}
                              <div className="absolute -left-[14px] top-0 flex items-center">
                                <span className="relative flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full shadow-lg ring-4 ring-white dark:ring-slate-950 z-10 font-bold text-lg">
                                  {i + 1}
                                </span>
                              </div>

                              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                  <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-200 border-0 px-3 py-1">
                                    STEP {step.step}
                                  </Badge>
                                  <h4 className="font-bold text-xl text-slate-900 dark:text-white">
                                    {step.title}
                                  </h4>
                                </div>

                                {step.actions && (
                                  <ul className="space-y-3">
                                    {step.actions.map((a: string, k: number) => (
                                      <li key={k} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0" />
                                        <span dangerouslySetInnerHTML={{ __html: a.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-900 dark:text-indigo-100 font-bold">$1</strong>') }} />
                                      </li>
                                    ))}
                                  </ul>
                                )}

                                {step.list && (
                                  <div className="mt-5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-base text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                                    {step.list.map((l: string, k: number) => (
                                      <div key={k} className="flex gap-2 mb-2 last:mb-0">
                                        <span className="text-indigo-400">•</span>
                                        <span dangerouslySetInnerHTML={{ __html: l.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}


                      {/* Flowchart (Short Answer Strategy) */}
                      {sub.flowchart && Array.isArray(sub.flowchart) && sub.flowchart[0]?.title && (
                        <div className="space-y-3">
                          {sub.flowchart.map((step: any, i: number) => (
                            <div key={i} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 rounded-lg">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white font-bold">
                                  {step.step}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-bold text-blue-900 dark:text-blue-100 mb-1">{step.title}</h5>
                                  {step.description && (
                                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">{step.description}</p>
                                  )}
                                  {step.actions && Array.isArray(step.actions) && (
                                    <ul className="list-disc ml-5 space-y-1 text-sm text-blue-700 dark:text-blue-300">
                                      {step.actions.map((action: string, j: number) => (
                                        <li key={j}>{action}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Critical Point */}
                      {sub.criticalPoint && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-900/10 border-l-4 border-rose-500 text-sm text-rose-900 dark:text-rose-100">
                          <span className="font-bold">Critical:</span> {sub.criticalPoint}
                        </div>
                      )}



                      {/* Types (Question types, etc.) */}
                      {sub.types && Array.isArray(sub.types) && (
                        <div className="space-y-3">
                          {sub.types.map((typeItem: any, i: number) => (
                            <div key={i} className="p-3 bg-indigo-50 dark:bg-indigo-900/10 border-l-4 border-indigo-500 rounded">
                              <h5 className="font-bold text-indigo-900 dark:text-indigo-100 mb-1">{typeItem.type || typeItem.title}</h5>
                              {typeItem.description && (
                                <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-2">{typeItem.description}</p>
                              )}
                              {typeItem.examples && Array.isArray(typeItem.examples) && (
                                <ul className="list-disc ml-5 space-y-1 text-sm text-indigo-700 dark:text-indigo-300">
                                  {typeItem.examples.map((ex: string, j: number) => (
                                    <li key={j}>{ex}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Question Words Strategy */}
                      {sub.questionWords && Array.isArray(sub.questionWords) && (
                        <div className="grid md:grid-cols-2 gap-3">
                          {sub.questionWords.map((qw: any, i: number) => (
                            <div key={i} className="p-3 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg">
                              <div className="font-bold text-purple-900 dark:text-purple-100 mb-2">
                                {qw.questionWord}
                              </div>
                              <div className="space-y-1 text-xs">
                                <div>
                                  <span className="font-semibold text-purple-700 dark:text-purple-300">Answer type:</span>{' '}
                                  <span className="text-purple-600 dark:text-purple-400">{qw.answerType}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-purple-700 dark:text-purple-300">Signal words:</span>{' '}
                                  <span className="text-purple-600 dark:text-purple-400">{qw.signalWords}</span>
                                </div>
                                {qw.example && (
                                  <div className="mt-2 p-2 bg-purple-100 dark:bg-purple-900/20 rounded italic text-purple-800 dark:text-purple-200">
                                    {qw.example}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Predictions */}
                      {sub.predictions && Array.isArray(sub.predictions) && (
                        <ul className="space-y-1 ml-5 list-disc text-slate-700 dark:text-slate-300">
                          {sub.predictions.map((p: string, i: number) => <li key={i}>{p}</li>)}
                        </ul>
                      )}

                      {/* Simple List */}
                      {sub.list && (
                        <ul className="list-disc ml-5 space-y-1 text-slate-700 dark:text-slate-300">
                          {sub.list.map((item: string, i: number) => <li key={i}>{item}</li>)}
                        </ul>
                      )}

                      {/* Callouts (Info/Warning Boxes) */}
                      {sub.callouts && Array.isArray(sub.callouts) && (
                        <div className="space-y-4 my-4">
                          {sub.callouts.map((callout: any, i: number) => (
                            <div
                              key={i}
                              className={`p-6 border-l-4 rounded-r-lg shadow-sm ${callout.type === 'warning'
                                ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-500 text-amber-900 dark:text-amber-100'
                                : callout.type === 'tip'
                                  ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 text-emerald-900 dark:text-emerald-100'
                                  : 'bg-blue-50 dark:bg-blue-900/10 border-blue-500 text-blue-900 dark:text-blue-100'
                                }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                  {callout.type === 'warning' ? <AlertCircle className="w-5 h-5" /> :
                                    callout.type === 'tip' ? <Lightbulb className="w-5 h-5" /> :
                                      <BookOpen className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                  {callout.title && <h4 className="font-bold mb-2 text-base">{callout.title}</h4>}
                                  <div className="text-sm leading-relaxed opacity-90 space-y-2">
                                    {(callout.content || '').split('\n').map((line: string, idx: number) => {
                                      // Render list items
                                      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                                        return (
                                          <div key={idx} className="flex gap-2 ml-1">
                                            <span className="font-bold">•</span>
                                            <span dangerouslySetInnerHTML={{
                                              __html: line.replace(/^[•-]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            }} />
                                          </div>
                                        );
                                      }
                                      // Render sub-headers (lines ending in colon or bold formatting implies)
                                      if (line.includes('Why not others?') || line.includes('Why?')) {
                                        return (
                                          <div key={idx} className="font-bold text-xs uppercase tracking-wider opacity-80 mt-2 mb-1">
                                            {line}
                                          </div>
                                        )
                                      }
                                      // Render standard lines
                                      if (line.trim() === '') return <br key={idx} />;
                                      return (
                                        <div key={idx} dangerouslySetInnerHTML={{
                                          __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        }} />
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Interactive Questions (New!) */}
                      {sub.interactiveQuestions && Array.isArray(sub.interactiveQuestions) && (
                        <div className="space-y-6 my-6">
                          {sub.interactiveQuestions.map((q: any, i: number) => {
                            const qId = q.id || `q-${i}`;
                            const isRevealed = revealedAnswers[qId];
                            const userSelect = userSelections[qId];
                            const isCorrect = userSelect === q.correctAnswer;

                            return (
                              <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all duration-300">
                                {/* Header / Question */}
                                <div className="p-6 border-b border-slate-100 dark:border-slate-700/50">
                                  <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                      <BookOpen className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="text-lg font-medium text-slate-800 dark:text-slate-200 leading-snug">
                                        {q.statement}
                                      </h4>
                                    </div>
                                  </div>

                                  {/* Interaction Buttons */}
                                  {q.options && (
                                    <div className="flex gap-3 mt-4 ml-10">
                                      {q.options.map((opt: string) => {
                                        const isSelected = userSelect === opt;
                                        const isThisCorrect = opt === q.correctAnswer;
                                        let btnClass = "px-4 py-2 rounded-lg font-bold text-sm transition-all border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400";

                                        if (isSelected) {
                                          if (isThisCorrect) {
                                            btnClass = "px-4 py-2 rounded-lg font-bold text-sm transition-all border border-emerald-500 bg-emerald-500 text-white shadow-md transform scale-105";
                                          } else {
                                            btnClass = "px-4 py-2 rounded-lg font-bold text-sm transition-all border border-rose-500 bg-rose-500 text-white shadow-md";
                                          }
                                        }

                                        return (
                                          <button
                                            key={opt}
                                            onClick={() => handleOptionClick(qId, opt, q.correctAnswer)}
                                            className={btnClass}
                                          >
                                            {opt}
                                          </button>
                                        )
                                      })}
                                    </div>
                                  )}

                                  {/* Feedback Message (Immediate) */}
                                  {userSelect && userSelect !== q.correctAnswer && (
                                    <div className="mt-3 ml-10 text-sm font-medium text-rose-600 dark:text-rose-400 animate-in fade-in slide-in-from-top-1">
                                      Not quite. Try again!
                                    </div>
                                  )}
                                </div>

                                {/* Reveal Toggle */}
                                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-2 border-t border-slate-100 dark:border-slate-700/50">
                                  <button
                                    onClick={() => toggleAnswer(qId)}
                                    className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                  >
                                    {isRevealed ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                                    {isRevealed ? "Hide Explanation" : "Show Explanation"}
                                  </button>
                                </div>

                                {/* Revealed Content (Teacher's Note Style) */}
                                {isRevealed && (
                                  <div className="p-6 bg-emerald-50/50 dark:bg-emerald-900/10 border-t-2 border-emerald-500/20 animate-in slide-in-from-top-2 duration-300">
                                    <div className="flex gap-4">
                                      <div className="flex-shrink-0 mt-1">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                                          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                      </div>
                                      <div className="space-y-4 flex-1">
                                        <div>
                                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Correct Answer</span>
                                          <div className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">
                                            {q.answerText}
                                          </div>
                                        </div>

                                        <div>
                                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Teacher's Note</span>
                                          <div className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                                            {(q.reasoning || '').split('\n').map((line: string, idx: number) => {
                                              if (line.trim().startsWith('•')) {
                                                return (
                                                  <div key={idx} className="flex gap-2 mb-1">
                                                    <span className="text-emerald-500 font-bold">•</span>
                                                    <span>{line.replace(/^[•]\s*/, '')}</span>
                                                  </div>
                                                )
                                              }
                                              return <p key={idx} className="mb-2">{line}</p>
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Visual Process Map */}
                      {sub.visualMap && Array.isArray(sub.visualMap) && (
                        <div className="my-6">
                          <div className="flex flex-col md:flex-row items-center gap-4 justify-between bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
                            {sub.visualMap.map((step: any, i: number) => (
                              <div key={i} className="flex flex-col md:flex-row items-center flex-1 w-full md:w-auto">
                                <div className="flex flex-col items-center text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/50 min-w-[140px] w-full md:w-auto hover:scale-105 transition-transform">
                                  <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold mb-2">
                                    {i + 1}
                                  </span>
                                  <span className="font-bold text-indigo-900 dark:text-indigo-100 text-sm">{step.title}</span>
                                  {step.description && <span className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">{step.description}</span>}
                                </div>
                                {i < sub.visualMap.length - 1 && (
                                  <ArrowRight className="w-6 h-6 text-slate-300 dark:text-slate-600 my-2 md:my-0 md:mx-4 transform rotate-90 md:rotate-0 flex-shrink-0" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interactive Checklist */}
                      {sub.checklist && Array.isArray(sub.checklist) && (
                        <div className="my-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                          <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            {sub.checklistTitle || "Action Checklist"}
                          </h4>
                          <div className="space-y-3">
                            {sub.checklist.map((item: string, i: number) => (
                              <label key={i} className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors group">
                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                                <span className="text-slate-700 dark:text-slate-300 text-sm group-hover:text-emerald-900 dark:group-hover:text-emerald-100 transition-colors" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Formats (Multiple Choice) - existing renderer, keep it or move it below new ones */}
                      {sub.formats && Array.isArray(sub.formats) && (
                        <div className="grid gap-3 mt-4">
                          {sub.formats.map((fmt: any, i: number) => (
                            <div key={i} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{fmt.format}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{fmt.description}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Levels (Stated/Implied/Assumed) */}
                      {sub.levels && Array.isArray(sub.levels) && (
                        <div className="space-y-3 mt-4">
                          {sub.levels.map((lvl: any, i: number) => (
                            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 border-l-4 border-indigo-500 rounded">
                              <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">{lvl.level}</h4>
                              {lvl.characteristics && (
                                <ul className="list-disc ml-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                                  {lvl.characteristics.map((c: string, k: number) => (
                                    <li key={k}>{c}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* UNIFIED EXAMPLES RENDERER */}
                      {normalizeExamples(sub).length > 0 && !sub.comparison && !sub.grammerClues && !sub.formats && !sub.paraphrasePatterns && (
                        <div className="space-y-6 mt-4">
                          {normalizeExamples(sub).map((ex: TheoryExample, i: number) => {
                            const answerId = `${section.id}-sub-${idx}-ex-${i}`;
                            const isRevealed = revealedAnswers[answerId];

                            return (
                              <div key={i} className="space-y-3">
                                {/* Example Passage context */}
                                {(ex.passage || (i === 0 && sub.passage)) && (
                                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded italic text-slate-700 dark:text-slate-300 border-l-4 border-slate-400">
                                    "{ex.passage || sub.passage}"
                                  </div>
                                )}

                                {/* Question Text */}
                                {ex.question && (
                                  <div className="font-medium text-slate-900 dark:text-slate-100 px-1">
                                    {ex.questionNumber ? `Q${ex.questionNumber}: ` : 'Q: '}{ex.question}
                                  </div>
                                )}

                                {/* Reveal Button */}
                                <div className="flex justify-end">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleAnswer(answerId)}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                  >
                                    {isRevealed ? (
                                      <>
                                        <EyeOff className="w-4 h-4 mr-2" /> Hide Answer
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="w-4 h-4 mr-2" /> Show Answer
                                      </>
                                    )}
                                  </Button>
                                </div>



                                {/* Instruction */}
                                {ex.instruction && (
                                  <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded">
                                    <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase mb-1">Instruction</div>
                                    <p className="text-sm text-amber-800 dark:text-amber-200">{ex.instruction}</p>
                                  </div>
                                )}

                                {/* 1. Inference Type (Valid/Invalid) */}
                                {ex.validInference && (
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded">
                                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Valid Inference</div>
                                      <p className="text-sm text-emerald-800 dark:text-emerald-200">{ex.validInference}</p>
                                    </div>
                                    <div className="p-3 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 rounded">
                                      <div className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase mb-1">Invalid Assumption</div>
                                      <p className="text-sm text-rose-800 dark:text-rose-200">{ex.invalidAssumption}</p>
                                    </div>
                                  </div>
                                )}

                                {/* 2. Gap Fill / Analysis Type */}
                                {ex.analysis && typeof ex.analysis === 'string' && (
                                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                    <div className="text-sm text-slate-600 dark:text-slate-400 bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded mb-2">
                                      <strong>Analysis:</strong> {ex.analysis}
                                    </div>
                                    {ex.answer && isRevealed && (
                                      <div className="font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-300">
                                        Answer: {ex.answer}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* 3. MCQ Options Type */}
                                {ex.options && (
                                  <div className="space-y-2 mb-4">
                                    {ex.options.map((opt: string, k: number) => (
                                      <div key={k} className={`p-2 rounded text-sm border ${isRevealed && ((ex.correctAnswer && opt.startsWith(ex.correctAnswer)) || (ex.answer && opt.startsWith(ex.answer)))
                                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-medium transition-colors duration-300"
                                        : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400"
                                        }`}>
                                        {opt}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Explanation / Why */}
                                {ex.explanation && isRevealed && (
                                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/10 p-2 rounded animate-in zoom-in-95 duration-200">
                                    <span className="font-bold text-blue-700 dark:text-blue-300">Explanation:</span>{' '}
                                    {typeof ex.explanation === 'string' ? ex.explanation : JSON.stringify(ex.explanation)}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Typical Instructions */}
                      {sub.typicalInstructions && (
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                          <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Typical Instructions:</h4>
                          <ul className="list-disc ml-5 space-y-1 text-slate-600 dark:text-slate-400 italic">
                            {sub.typicalInstructions.map((inst: string, i: number) => (
                              <li key={i}>"{inst}"</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Paraphrase Patterns Table */}
                      {sub.paraphrasePatterns && (
                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                          <table className="w-full text-sm text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                <th className="p-3 border-b border-slate-200 dark:border-slate-700">Passage Says</th>
                                <th className="p-3 border-b border-slate-200 dark:border-slate-700">Sentence Stem Says</th>
                                <th className="p-3 border-b border-slate-200 dark:border-slate-700">Type of Paraphrase</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sub.paraphrasePatterns.map((row: any, i: number) => (
                                <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                  <td className="p-3 border-r border-slate-100 dark:border-slate-800 font-medium text-rose-700 dark:text-rose-400">"{row.passage}"</td>
                                  <td className="p-3 border-r border-slate-100 dark:border-slate-800 font-medium text-emerald-700 dark:text-emerald-400">"{row.stem}"</td>
                                  <td className="p-3 text-slate-600 dark:text-slate-400">{row.type}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Detailed Example Analysis (Gap Fill / General) */}
                      {sub.example && sub.example.passage && sub.example.analysis && (
                        <div className="space-y-3">
                          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded italic text-slate-700 dark:text-slate-300">
                            "{sub.example.passage}"
                          </div>
                          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <p className="font-medium text-slate-900 dark:text-slate-100 mb-2">{sub.example.question}</p>
                            <div className="text-sm text-slate-600 dark:text-slate-400 bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded mb-2">
                              <strong>Analysis:</strong> {sub.example.analysis}
                            </div>
                            <div className="font-bold text-emerald-600 dark:text-emerald-400">
                              Answer: {sub.example.answer}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Grammar Clues */}
                      {sub.grammarClues && (
                        <div className="space-y-6">
                          {sub.grammarClues.beforeGap && (
                            <div>
                              <h5 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Before the gap:</h5>
                              <div className="overflow-x-auto rounded-lg border border-blue-100 dark:border-blue-800">
                                <table className="w-full text-sm text-left border-collapse">
                                  <thead>
                                    <tr className="bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100">
                                      <th className="p-2 border-b border-blue-100 dark:border-blue-800">What Comes Before</th>
                                      <th className="p-2 border-b border-blue-100 dark:border-blue-800">Gap Needs</th>
                                      <th className="p-2 border-b border-blue-100 dark:border-blue-800">Example</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sub.grammarClues.beforeGap.map((row: any, i: number) => (
                                      <tr key={i} className="border-b border-blue-50 dark:border-blue-900/10">
                                        <td className="p-2 border-r border-blue-50 dark:border-blue-900/10 font-medium text-blue-800 dark:text-blue-200">{row.clue}</td>
                                        <td className="p-2 border-r border-blue-50 dark:border-blue-900/10 text-slate-700 dark:text-slate-300">{row.needs}</td>
                                        <td className="p-2 text-slate-500 dark:text-slate-400 italic">{row.example}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                          {sub.grammarClues.afterGap && (
                            <div>
                              <h5 className="font-bold text-slate-700 dark:text-slate-300 mb-2">After the gap:</h5>
                              <div className="overflow-x-auto rounded-lg border border-purple-100 dark:border-purple-800">
                                <table className="w-full text-sm text-left border-collapse">
                                  <thead>
                                    <tr className="bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-100">
                                      <th className="p-2 border-b border-purple-100 dark:border-purple-800">What Comes After</th>
                                      <th className="p-2 border-b border-purple-100 dark:border-purple-800">Gap Needs</th>
                                      <th className="p-2 border-b border-purple-100 dark:border-purple-800">Example</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sub.grammarClues.afterGap.map((row: any, i: number) => (
                                      <tr key={i} className="border-b border-purple-50 dark:border-purple-900/10">
                                        <td className="p-2 border-r border-purple-50 dark:border-purple-900/10 font-medium text-purple-800 dark:text-purple-200">{row.clue}</td>
                                        <td className="p-2 border-r border-purple-50 dark:border-purple-900/10 text-slate-700 dark:text-slate-300">{row.needs}</td>
                                        <td className="p-2 text-slate-500 dark:text-slate-400 italic">{row.example}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Signal Patterns */}
                      {sub.signalPatterns && (
                        <div className="overflow-x-auto rounded-lg border border-amber-100 dark:border-amber-800">
                          <table className="w-full text-sm text-left border-collapse">
                            <thead>
                              <tr className="bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100">
                                <th className="p-2 border-b border-amber-100 dark:border-amber-800">Sentence Pattern</th>
                                <th className="p-2 border-b border-amber-100 dark:border-amber-800">Look For in Passage</th>
                                <th className="p-2 border-b border-amber-100 dark:border-amber-800">Example/Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sub.signalPatterns.map((row: any, i: number) => (
                                <tr key={i} className="border-b border-amber-50 dark:border-amber-900/10">
                                  <td className="p-2 border-r border-amber-50 dark:border-amber-900/10 font-medium text-amber-800 dark:text-amber-200">"{row.pattern}"</td>
                                  <td className="p-2 border-r border-amber-50 dark:border-amber-900/10 text-slate-700 dark:text-slate-300 italic">{row.lookFor}</td>
                                  <td className="p-2 text-slate-600 dark:text-slate-400">{row.type}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Categories (Signal Words & Phrases to Watch) */}
                      {sub.categories && Array.isArray(sub.categories) && (
                        <div className="grid gap-3">
                          {sub.categories.map((cat: any, i: number) => (
                            <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 font-bold text-indigo-900 dark:text-indigo-100 border-b border-slate-200 dark:border-slate-800">
                                {cat.category}
                              </div>
                              <div className="p-3 space-y-2">
                                {cat.examples && Array.isArray(cat.examples) && (
                                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                                    {cat.examples.map((ex: any, k: number) => (
                                      <li key={k} className="list-none">
                                        {typeof ex === 'string' ? (
                                          <div className="flex gap-2">
                                            <span className="text-slate-400">•</span>
                                            <span>{ex}</span>
                                          </div>
                                        ) : (
                                          <div className="flex flex-col sm:flex-row gap-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded border border-slate-100 dark:border-slate-800 mb-1">
                                            {ex.passageSays && (
                                              <div className="flex-1">
                                                <div className="text-[10px] uppercase text-slate-400 font-bold">Passage</div>
                                                <div className="font-medium text-slate-700 dark:text-slate-300">"{ex.passageSays}"</div>
                                              </div>
                                            )}
                                            {ex.questionClaims && (
                                              <div className="flex-1 border-l sm:border-l-0 sm:border-t-0 border-slate-200 dark:border-slate-700 pl-2 sm:pl-0">
                                                <div className="text-[10px] uppercase text-indigo-400 font-bold">Question</div>
                                                <div className="font-medium text-indigo-700 dark:text-indigo-300">"{ex.questionClaims}"</div>
                                              </div>
                                            )}
                                            {ex.answer && (
                                              <div className="flex items-center">
                                                <div className={`text-xs font-bold px-2 py-1 rounded ${ex.answer.includes('FALSE') ? 'bg-rose-100 text-rose-800' :
                                                  ex.answer.includes('TRUE') ? 'bg-emerald-100 text-emerald-800' :
                                                    'bg-slate-200 text-slate-800'
                                                  }`}>
                                                  {ex.answer}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                {cat.lookFor && (
                                  <div className="text-sm bg-indigo-50 dark:bg-indigo-900/10 p-2 rounded text-indigo-800 dark:text-indigo-200">
                                    <span className="font-semibold">Look For:</span> {cat.lookFor}
                                  </div>
                                )}
                                {cat.rule && (
                                  <div className="text-sm bg-blue-50 dark:bg-blue-900/10 p-2 rounded text-blue-800 dark:text-blue-200">
                                    <span className="font-semibold">Rule:</span> {cat.rule}
                                  </div>
                                )}
                                {cat.example && typeof cat.example === 'string' && (
                                  <div className="text-sm italic text-slate-500 dark:text-slate-400">
                                    Ex: {cat.example}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Walkthrough Examples (Multiple Choice) */}
                      {sub.examples && Array.isArray(sub.examples) && sub.examples[0]?.options && (
                        <div className="space-y-6">
                          {/* Global passage for the section if exists */}
                          {sub.passage && (
                            <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded border-l-4 border-slate-400 text-slate-700 dark:text-slate-300 italic mb-4">
                              <span className="block font-bold text-xs text-slate-500 not-italic mb-1">PASSAGE EXCERPT</span>
                              "{sub.passage}"
                            </div>
                          )}

                          {sub.examples.map((ex: any, i: number) => (
                            <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
                              <div className="font-bold text-slate-900 dark:text-slate-100 mb-3">
                                <span className="text-indigo-500 mr-2">Q{ex.questionNumber}.</span>
                                {ex.question}
                              </div>
                              <div className="space-y-2 mb-4">
                                {ex.options.map((opt: string, k: number) => (
                                  <div key={k} className={`p-2 rounded text-sm border ${ex.correctAnswer && opt.startsWith(ex.correctAnswer)
                                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-medium"
                                    : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400"
                                    }`}>
                                    {opt}
                                  </div>
                                ))}
                              </div>

                              {ex.explanation && (
                                <div className="text-sm space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                  <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">Explanation:</div>
                                  {typeof ex.explanation === 'object' ? (
                                    <div className="grid gap-2">
                                      {Object.entries(ex.explanation).map(([key, desc]: [string, any]) => (
                                        <div key={key} className={`flex gap-2 ${key === ex.correctAnswer ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-500'}`}>
                                          <span className="font-bold w-4">{key}:</span>
                                          <span>{desc}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-slate-600 dark:text-slate-400">{ex.explanation}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Recommendations (Time Management) */}
                      {sub.recommendations && Array.isArray(sub.recommendations) && (
                        <div className="grid gap-2">
                          {sub.recommendations.map((rec: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded">
                              <Clock className="w-4 h-4 text-slate-500" />
                              <span className="font-semibold text-slate-700 dark:text-slate-300">{rec.questionCount || rec.count}:</span>
                              <span className="text-sm text-slate-600 dark:text-slate-400">{rec.recommendedTime || rec.time}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Average/Rationale */}
                      {sub.average && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded">
                          <span className="font-semibold text-amber-900 dark:text-amber-100">Average: </span>
                          <span className="text-amber-800 dark:text-amber-200">{sub.average}</span>
                        </div>
                      )}
                      {sub.rationale && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 rounded">
                          <p className="text-sm text-blue-800 dark:text-blue-200">{sub.rationale}</p>
                        </div>
                      )}

                      {/* Generic Comparison Table (Main Idea vs Supporting Detail, etc.) */}
                      {sub.comparison && typeof sub.comparison === 'object' && !Array.isArray(sub.comparison) && !sub.comparison.FALSE && (
                        <div className="grid md:grid-cols-2 gap-4">
                          {Object.entries(sub.comparison).map(([key, values]: [string, any]) => (
                            <div key={key} className="p-3 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800">
                              <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">{key}</h4>
                              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                                {Array.isArray(values) && values.map((v: string, i: number) => (
                                  <li key={i} className="flex gap-2">
                                    <span className="text-emerald-500">•</span>
                                    <span>{v}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comparison Table (for Short Answer Direct vs Indirect, etc.) */}
                      {sub.comparisonTable && Array.isArray(sub.comparisonTable) && (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-slate-100 dark:bg-slate-800">
                                <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left font-bold text-slate-700 dark:text-slate-300">Aspect</th>
                                <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left font-bold text-emerald-600 dark:text-emerald-400">Direct</th>
                                <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left font-bold text-blue-600 dark:text-blue-400">Indirect</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sub.comparisonTable.map((row: any, i: number) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                  <td className="border border-slate-300 dark:border-slate-600 px-4 py-2 font-semibold text-slate-800 dark:text-slate-200">{row.aspect}</td>
                                  <td className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm text-slate-700 dark:text-slate-300">{row.direct}</td>
                                  <td className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm text-slate-700 dark:text-slate-300">{row.indirect}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Examples with headings analysis (Matching Headings format) */}
                      {sub.examples && !sub.passage && sub.examples[0]?.heading && (
                        <div className="space-y-3">
                          {sub.headings && (
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800">
                              <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-2">Available Headings:</h4>
                              <ul className="text-sm space-y-1">
                                {sub.headings.map((h: string, i: number) => (
                                  <li key={i} className="text-purple-800 dark:text-purple-200">{h}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {sub.question && (
                            <p className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{sub.question}</p>
                          )}
                          <div className="grid gap-3">
                            {sub.examples.map((ex: any, i: number) => (
                              <div key={i} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">{ex.heading}</span>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{ex.analysis}</p>
                                  </div>
                                  <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${ex.answer === 'CORRECT' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                                    'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                                    }`}>{ex.answer}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Example with heading/requirement format */}
                      {sub.example && sub.example.heading && (
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-800">
                          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2">Example:</p>
                          <p className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">{sub.example.heading}</p>
                          {sub.example.requirement && (
                            <p className="text-sm text-indigo-800 dark:text-indigo-200">{sub.example.requirement}</p>
                          )}
                        </div>
                      )}

                      {/* Walkthrough Examples with Step-by-Step (Short Answer Section 5) */}
                      {sub.passage && sub.examples && Array.isArray(sub.examples) && sub.examples[0]?.stepByStep && (
                        <div className="space-y-6">
                          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Passage</h4>
                            <p className="italic text-slate-700 dark:text-slate-300 leading-relaxed">"{sub.passage}"</p>
                          </div>
                          {sub.examples.map((ex: any, i: number) => (
                            <div key={i} className="border border-emerald-200 dark:border-emerald-800 rounded-lg overflow-hidden">
                              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase mb-1">
                                      Question {ex.questionNumber}
                                    </div>
                                    <p className="font-semibold text-emerald-900 dark:text-emerald-100 mb-1">{ex.question}</p>
                                    {ex.instruction && (
                                      <p className="text-xs text-emerald-700 dark:text-emerald-300 italic">({ex.instruction})</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="p-4 bg-white dark:bg-slate-900 space-y-3">
                                {ex.stepByStep && Array.isArray(ex.stepByStep) && (
                                  <div>
                                    <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Step-by-Step Solution:</h5>
                                    <ol className="space-y-1.5">
                                      {ex.stepByStep.map((step: string, j: number) => (
                                        <li key={j} className="flex gap-2 text-sm">
                                          <span className="text-blue-500 font-semibold">{j + 1}.</span>
                                          <span className="text-slate-700 dark:text-slate-300">{step}</span>
                                        </li>
                                      ))}
                                    </ol>
                                  </div>
                                )}
                                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                  <div className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <span className="font-bold text-emerald-700 dark:text-emerald-300">Answer: </span>
                                      <span className="text-slate-900 dark:text-slate-100 font-medium">{ex.answer}</span>
                                    </div>
                                  </div>
                                  {ex.commonError && (
                                    <div className="flex items-start gap-2 mt-2">
                                      <XCircle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <span className="font-bold text-rose-700 dark:text-rose-300">Common Error: </span>
                                        <span className="text-slate-700 dark:text-slate-300 text-sm">{ex.commonError}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Mistakes Array (Short Answer Section 6) */}
                      {sub.mistakes && Array.isArray(sub.mistakes) && (
                        <div className="space-y-4">
                          {sub.mistakes.map((mistake: any, i: number) => (
                            <div key={i} className="border-l-4 border-rose-500 bg-rose-50 dark:bg-rose-900/10 rounded-lg p-4">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-600 dark:bg-rose-700 flex items-center justify-center text-white font-bold">
                                  {mistake.id}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-bold text-rose-900 dark:text-rose-100 mb-1">{mistake.title}</h5>
                                  {mistake.trap && (
                                    <p className="text-sm text-rose-800 dark:text-rose-200 mb-2">
                                      <span className="font-semibold">The Trap: </span>{mistake.trap}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {mistake.example && (
                                <div className="space-y-2 bg-white dark:bg-slate-900 rounded p-3">
                                  {mistake.example.passage && (
                                    <div>
                                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Passage: </span>
                                      <span className="text-sm italic text-slate-700 dark:text-slate-300">"{mistake.example.passage}"</span>
                                    </div>
                                  )}
                                  {mistake.example.question && (
                                    <div>
                                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Question: </span>
                                      <span className="text-sm text-slate-700 dark:text-slate-300">{mistake.example.question}</span>
                                    </div>
                                  )}
                                  {mistake.example.instruction && (
                                    <div>
                                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Instruction: </span>
                                      <span className="text-sm text-slate-700 dark:text-slate-300">{mistake.example.instruction}</span>
                                    </div>
                                  )}
                                  {mistake.example.wrong && (
                                    <div className="flex items-start gap-2">
                                      <XCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                                      <div className="flex-1">
                                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Wrong: </span>
                                        {Array.isArray(mistake.example.wrong) ? (
                                          <ul className="list-disc ml-4 text-sm text-rose-700 dark:text-rose-300">
                                            {mistake.example.wrong.map((w: string, j: number) => (
                                              <li key={j}>{w}</li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <span className="text-sm text-rose-700 dark:text-rose-300">{mistake.example.wrong}</span>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  {mistake.example.correct && (
                                    <div className="flex items-start gap-2">
                                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Correct: </span>
                                        <span className="text-sm text-emerald-700 dark:text-emerald-300">{mistake.example.correct}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              {mistake.betterExample && (
                                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">Better Example:</p>
                                  <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                                    {mistake.betterExample.question && <div><span className="font-semibold">Q:</span> {mistake.betterExample.question}</div>}
                                    {mistake.betterExample.passage && <div><span className="font-semibold">Passage:</span> {mistake.betterExample.passage}</div>}
                                    {mistake.betterExample.answer && <div><span className="font-semibold">A:</span> {mistake.betterExample.answer}</div>}
                                  </div>
                                </div>
                              )}
                              {mistake.rule && (
                                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded">
                                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                                    <span className="text-amber-600 dark:text-amber-400">💡 Rule:</span> {mistake.rule}
                                  </p>
                                </div>
                              )}
                              {mistake.correct && !mistake.example && (
                                <div className="mt-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded">
                                  <p className="text-sm text-emerald-800 dark:text-emerald-200">{mistake.correct}</p>
                                </div>
                              )}
                              {mistake.why && (
                                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">Why? {mistake.why}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Direct Section Content (e.g. Multiple Choice Section 5 Walkthrough) - Unified */}
                  {normalizeExamples(section).length > 0 && (
                    <div className="space-y-6 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                      {/* Section-level passage */}
                      {section.passage && (
                        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded border-l-4 border-slate-400 text-slate-700 dark:text-slate-300 italic mb-4">
                          <span className="block font-bold text-xs text-slate-500 not-italic mb-1">PASSAGE EXCERPT</span>
                          "{section.passage}"
                        </div>
                      )}

                      {normalizeExamples(section).map((ex: TheoryExample, i: number) => (
                        <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
                          <div className="font-bold text-slate-900 dark:text-slate-100 mb-3">
                            <span className="text-indigo-500 mr-2">{ex.questionNumber ? `Q${ex.questionNumber}.` : 'Q.'}</span>
                            {ex.question}
                          </div>
                          <div className="space-y-2 mb-4">
                            {ex.options?.map((opt: string, k: number) => (
                              <div key={k} className={`p-2 rounded text-sm border ${(ex.correctAnswer && opt.startsWith(ex.correctAnswer))
                                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-medium"
                                : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400"
                                }`}>
                                {opt}
                              </div>
                            ))}
                          </div>

                          {ex.explanation && (
                            <div className="text-sm space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                              <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">Explanation:</div>
                              {typeof ex.explanation === 'object' ? (
                                <div className="grid gap-2">
                                  {Object.entries(ex.explanation).map(([key, desc]: [string, any]) => (
                                    <div key={key} className={`flex gap-2 ${key === ex.correctAnswer ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-500'}`}>
                                      <span className="font-bold w-4">{key}:</span>
                                      <span>{desc}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-slate-600 dark:text-slate-400">{ex.explanation}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Section Quiz - Concept Check & Mini Practice */}
                  {section.quiz && Array.isArray(section.quiz) && section.quiz.length > 0 && (
                    <div className="mt-8 pt-8 border-t-2 border-dashed border-indigo-200 dark:border-indigo-800">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                          <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                          Quick Quiz — Test Your Understanding
                        </h4>
                      </div>

                      <div className="space-y-6">
                        {section.quiz.map((q: any, qIdx: number) => {
                          const quizId = `${section.id}-quiz-${qIdx}`;
                          const userAnswer = quizAnswers[quizId];
                          const isCorrect = userAnswer === q.correctAnswer;
                          const isRevealed = quizRevealed[quizId];

                          return (
                            <div
                              key={qIdx}
                              className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                            >
                              {/* Question Header */}
                              <div className="p-5 border-b border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-500 text-white text-sm font-bold flex items-center justify-center">
                                    {qIdx + 1}
                                  </span>
                                  <div className="flex-1">
                                    {q.type === 'concept-check' && (
                                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2 block">
                                        Concept Check
                                      </span>
                                    )}
                                    {q.type === 'mini-practice' && (
                                      <>
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-2 block">
                                          Mini Practice
                                        </span>
                                        {q.microText && (
                                          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg mb-3 italic text-slate-700 dark:text-slate-300 text-sm">
                                            "{q.microText}"
                                          </div>
                                        )}
                                        {q.statement && (
                                          <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 rounded-r-lg mb-3">
                                            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block mb-1">Statement:</span>
                                            <span className="text-slate-800 dark:text-slate-200 font-medium">{q.statement}</span>
                                          </div>
                                        )}
                                      </>
                                    )}
                                    <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                                      {q.question}
                                    </p>
                                  </div>
                                </div>

                                {/* Answer Options */}
                                <div className="flex flex-wrap gap-3 mt-4 ml-10">
                                  {q.options?.map((opt: string) => {
                                    const isSelected = userAnswer === opt;
                                    const isThisCorrect = opt === q.correctAnswer;
                                    let btnClass = "px-4 py-2 rounded-lg font-semibold text-sm transition-all border-2";

                                    if (isSelected) {
                                      if (isThisCorrect) {
                                        btnClass += " border-emerald-500 bg-emerald-500 text-white shadow-lg scale-105";
                                      } else {
                                        btnClass += " border-rose-500 bg-rose-500 text-white";
                                      }
                                    } else {
                                      btnClass += " border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20";
                                    }

                                    return (
                                      <button
                                        key={opt}
                                        onClick={() => handleQuizAnswer(quizId, opt, q.correctAnswer)}
                                        className={btnClass}
                                        disabled={isCorrect}
                                      >
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Feedback */}
                                {userAnswer && !isCorrect && (
                                  <div className="mt-3 ml-10 text-sm font-medium text-rose-600 dark:text-rose-400">
                                    Not quite — try again!
                                  </div>
                                )}
                              </div>

                              {/* Reveal Toggle */}
                              <div className="bg-slate-100/50 dark:bg-slate-800/30 px-5 py-2">
                                <button
                                  onClick={() => toggleQuizExplanation(quizId)}
                                  className="flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                                >
                                  {isRevealed ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                                  {isRevealed ? "Hide Explanation" : "Show Explanation"}
                                </button>
                              </div>

                              {/* Explanation */}
                              {isRevealed && (
                                <div className="p-5 bg-emerald-50/50 dark:bg-emerald-900/10 border-t-2 border-emerald-500/20">
                                  <div className="flex gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <div className="space-y-2">
                                      <div>
                                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                                          Correct Answer
                                        </span>
                                        <div className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">
                                          {q.correctAnswer}
                                        </div>
                                      </div>
                                      {q.explanation && (
                                        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/30">
                                          {q.explanation}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))
          }
        </div >
      )
      }


      {/* 2. Example */}
      {
        theoryContent.example && (
          <Card className="border-l-4 border-l-purple-500 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-500" />
                Example
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-0 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                {/* Passage Side */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Passage Excerpt</h3>
                  {typeof theoryContent.example.passage === 'string' ? (
                    <p className="text-slate-800 dark:text-slate-200 font-serif leading-loose">
                      "{theoryContent.example.passage}"
                    </p>
                  ) : typeof theoryContent.example.passage === 'object' ? (
                    <div className="space-y-4">
                      {Object.entries(theoryContent.example.passage as Record<string, string>)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([paraKey, paraText]) => (
                          <div key={paraKey}>
                            <span className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                              {paraKey.replace(/^paragraph/i, 'Paragraph ')}
                            </span>
                            <p className="text-slate-800 dark:text-slate-200 font-serif leading-loose">{paraText}</p>
                          </div>
                        ))}
                    </div>
                  ) : null}
                </div>

                {/* Question Side */}
                <div className="p-6 bg-white dark:bg-slate-900">
                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Questions & Answers</h3>

                  {theoryContent.example.headings && (
                    <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">List of Headings</h4>
                      <ul className="space-y-1">
                        {theoryContent.example.headings.map((heading: string, idx: number) => (
                          <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex gap-2">
                            <span className="font-mono text-slate-400">{['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'][idx]}</span>
                            {heading}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-6">
                    {theoryContent.example.questions.map((q: any) => (
                      <div key={q.id} className="space-y-3">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          <span className="text-slate-400 mr-2">{q.id}.</span>
                          {q.text}
                        </div>

                        {q.options && (
                          <ul className="ml-6 space-y-1">
                            {q.options.map((opt: string, idx: number) => (
                              <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 list-disc">{opt}</li>
                            ))}
                          </ul>
                        )}

                        <div className="mt-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                                Answer: {q.correctAnswer}
                              </p>
                              {q.explanation && (
                                <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                                  {q.explanation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }

      {/* 3. Common Mistakes */}
      {
        theoryContent.commonMistakes && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-rose-500" />
              Common Mistakes
            </h2>
            <div className="grid gap-3">
              {theoryContent.commonMistakes.map((mistake: any, idx: number) => (
                <div key={idx} className="flex gap-4 p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-lg">
                  <div className="text-rose-500 font-bold text-lg">!</div>
                  <div>
                    <p className="font-bold text-rose-900 dark:text-rose-100">{mistake.title}</p>
                    <p className="text-rose-800 dark:text-rose-200 text-sm mt-1">{mistake.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      }

      {/* 4. Strategy & Tips */}
      {
        theoryContent.strategyTips && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Strategy & Tips</h2>
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {theoryContent.strategyTips.map((tip: any, idx: number) => (
                <div key={tip.step} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-blue-500 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    {tip.step}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{tip.title}</div>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 text-sm">{tip.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      }

      {/* Signal Words (T/F/NG specific) */}
      {
        mc?.signalWords && (
          <section className="space-y-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
                🎯 Signal Words to Watch
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{mc.signalWords.description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              {/* Qualifiers */}
              {mc.signalWords.qualifiers && (
                <Card className="border-l-4 border-l-orange-500 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      1. {mc.signalWords.qualifiers.title.replace('Qualifiers (Often Create FALSE Traps)', 'Absolute vs. Qualified Statements')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-1">
                      {mc.signalWords.qualifiers.examples?.map((ex: any, i: number) => (
                        <div key={i} className="px-2 py-1.5 bg-orange-50/50 dark:bg-orange-900/10 rounded text-xs leading-snug">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-700 dark:text-slate-300 font-medium flex-1">"{ex.passage}"</span>
                            <span className="text-slate-400 text-[10px]">→</span>
                            <span className="text-slate-700 dark:text-slate-300 font-medium flex-1">"{ex.question}"</span>
                          </div>
                          <div className="mt-0.5 text-[11px] font-bold text-orange-600 dark:text-orange-400">
                            {ex.result}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Comparatives */}
              {mc.signalWords.comparatives && (
                <Card className="border-l-4 border-l-purple-500 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      2. {mc.signalWords.comparatives.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-1">
                      {mc.signalWords.comparatives.examples?.map((ex: any, i: number) => (
                        <div key={i} className="px-2 py-1.5 bg-purple-50/50 dark:bg-purple-900/10 rounded text-xs leading-snug">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-700 dark:text-slate-300 font-medium flex-1">"{ex.passage}"</span>
                            <span className="text-slate-400 text-[10px]">→</span>
                            <span className="text-slate-700 dark:text-slate-300 font-medium flex-1">"{ex.question}"</span>
                          </div>
                          <div className="mt-0.5 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                            {ex.result}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Time & Sequence */}
              {mc.signalWords.timeSequence && (
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      3. {mc.signalWords.timeSequence.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-1">
                      {mc.signalWords.timeSequence.examples?.map((ex: any, i: number) => (
                        <div key={i} className="px-2 py-1.5 bg-blue-50/50 dark:bg-blue-900/10 rounded text-xs leading-snug">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-700 dark:text-slate-300 font-medium flex-1">"{ex.passage}"</span>
                            <span className="text-slate-400 text-[10px]">→</span>
                            <span className="text-slate-700 dark:text-slate-300 font-medium flex-1">"{ex.question}"</span>
                          </div>
                          <div className="mt-0.5 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                            {ex.result}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )
      }

      {/* Common Pitfalls (T/F/NG specific) */}
      {
        mc?.commonPitfalls && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
                ⚠️ {mc.commonPitfalls.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">{mc.commonPitfalls.description}</p>
            </div>

            <div className="space-y-4">
              {mc.commonPitfalls.mistakes?.map((mistake: any) => (
                <Card key={mistake.id} className="border-l-4 border-l-rose-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                        <span className="text-rose-600 dark:text-rose-400 font-bold">{mistake.id}</span>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-rose-900 dark:text-rose-100">
                          ❌ Mistake {mistake.id}: {mistake.title}
                        </CardTitle>
                        <p className="text-sm text-rose-700 dark:text-rose-300 mt-1">
                          <span className="font-semibold">The Trap:</span> {mistake.trap}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Singular Example Object */}
                    {mistake.example && (
                      <div className="space-y-3">
                        {/* Context Box (Passage/Question) */}
                        {(mistake.example.passage || mistake.example.question) && (
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded space-y-2">
                            {mistake.example.passage && (
                              <div>
                                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Passage</div>
                                <div className="text-sm italic text-slate-700 dark:text-slate-300">"{mistake.example.passage}"</div>
                              </div>
                            )}
                            {mistake.example.question && (
                              <div>
                                <div className="text-xs font-bold text-indigo-500 uppercase mb-1">Question</div>
                                <div className="text-sm font-medium text-slate-800 dark:text-slate-200">"{mistake.example.question}"</div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Options / Distractors */}
                        {mistake.example.distractor && (
                          <div className="p-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded">
                            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Distractor: </span>
                            <span className="text-sm text-rose-800 dark:text-rose-200">"{mistake.example.distractor}"</span>
                          </div>
                        )}

                        {/* Explicit Options (e.g. Mistake 1) */}
                        {(mistake.example.optionB || mistake.example.optionC) && (
                          <div className="space-y-2">
                            {mistake.example.optionB && (
                              <div className="p-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded text-sm">
                                <strong className="text-amber-800 dark:text-amber-300">Option B:</strong> {mistake.example.optionB}
                              </div>
                            )}
                            {mistake.example.optionC && (
                              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded text-sm">
                                <strong className="text-emerald-800 dark:text-emerald-300">Option C:</strong> {mistake.example.optionC}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Wrong/Correct Comparisons (e.g. Mistake 8) */}
                        {mistake.example.wrong && (
                          <div className="p-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded text-sm">
                            <strong className="text-rose-800 dark:text-rose-300">❌ Wrong:</strong> {mistake.example.wrong}
                          </div>
                        )}
                        {mistake.example.correct && (
                          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded text-sm">
                            <strong className="text-emerald-800 dark:text-emerald-300">✓ Correct:</strong> {mistake.example.correct}
                          </div>
                        )}


                        {/* Legacy: WrongThinking/CorrectThinking */}
                        <div className="grid md:grid-cols-2 gap-2">
                          {mistake.example.wrongThinking && (
                            <div className="p-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded">
                              <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">❌ Wrong</div>
                              <div className="text-xs text-rose-800 dark:text-rose-200">{mistake.example.wrongThinking}</div>
                            </div>
                          )}
                          {mistake.example.correctThinking && (
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded">
                              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">✓ Correct</div>
                              <div className="text-xs text-emerald-800 dark:text-emerald-200">{mistake.example.correctThinking}</div>
                            </div>
                          )}
                        </div>

                        {mistake.example.analysis && Array.isArray(mistake.example.analysis) && (
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-2">Analysis</div>
                            <ul className="space-y-1">
                              {mistake.example.analysis.map((item: string, idx: number) => (
                                <li key={idx} className="text-xs text-slate-700 dark:text-slate-300">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {mistake.example.answer && (
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                            <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                              Answer: {mistake.example.answer}
                            </div>
                          </div>
                        )}
                        {mistake.example.reasoning && (
                          <div className="p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
                            <div className="text-xs text-amber-800 dark:text-amber-200">
                              💭 {mistake.example.reasoning}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Arrays of Examples (Mix of types) */}
                    {mistake.examples && Array.isArray(mistake.examples) && (
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Examples:
                        </div>
                        {mistake.examples.map((ex: any, idx: number) => (
                          <div key={idx} className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded space-y-2">
                            {/* Type A: Passage / Distractor pair */}
                            {ex.passage && (
                              <div>
                                <span className="text-xs font-bold text-slate-500">Passage: </span>
                                <span className="text-sm italic text-slate-700 dark:text-slate-300">"{ex.passage}"</span>
                              </div>
                            )}
                            {ex.distractor && (
                              <div>
                                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Distractor: </span>
                                <span className="text-sm text-rose-800 dark:text-rose-200">"{ex.distractor}"</span>
                              </div>
                            )}

                            {/* Type B: Qualifiers List */}
                            {ex.qualifiers && Array.isArray(ex.qualifiers) && (
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                {ex.qualifiers.map((q: string, k: number) => (
                                  <li key={k} className="text-xs bg-white dark:bg-slate-900 p-1.5 rounded text-center border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-mono">
                                    {q}
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Type C: Legacy T/F (PassageSays/Means) */}
                            {ex.passageSays && (
                              <div>
                                <span className="text-xs font-bold text-slate-500">Passage says: </span>
                                <span className="text-sm italic text-slate-700 dark:text-slate-300">
                                  "{ex.passageSays}"
                                </span>
                              </div>
                            )}
                            {ex.means && (
                              <div>
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Means: </span>
                                <span className="text-sm text-emerald-700 dark:text-emerald-300">
                                  {ex.means}
                                </span>
                              </div>
                            )}
                            {ex.statement && (
                              <div>
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Statement: </span>
                                <span className="text-sm text-blue-900 dark:text-blue-100">
                                  "{ex.statement}"
                                </span>
                              </div>
                            )}
                            {ex.answer && (
                              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                ✓ Answer: {ex.answer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Top Level Explanations / Keys */}
                    {mistake.whyWrong && (
                      <div className="text-sm text-rose-700 dark:text-rose-300 italic flex gap-2">
                        <span className="font-bold">Why Wrong:</span> {mistake.whyWrong}
                      </div>
                    )}

                    {mistake.correct && typeof mistake.correct === 'string' && (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-emerald-500 rounded text-sm text-emerald-800 dark:text-emerald-200">
                        <span className="font-bold block mb-1">✓ Correction/Rule:</span>
                        {mistake.correct}
                      </div>
                    )}

                    {mistake.correctApproach && (
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 border-l-4 border-indigo-500 rounded text-sm text-indigo-800 dark:text-indigo-200">
                        <span className="font-bold block mb-1">Strategy:</span>
                        {mistake.correctApproach}
                      </div>
                    )}

                    {mistake.process && (
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded mt-2">
                        <div className="text-xs font-bold text-slate-500 mb-2 uppercase">Elimination Process</div>
                        <ul className="list-disc ml-4 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                          {mistake.process.map((step: string, i: number) => <li key={i}>{step}</li>)}
                        </ul>
                      </div>
                    )}

                    {mistake.signalWords && (
                      <div className="mt-2">
                        <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">Signal Words:</div>
                        <div className="flex flex-wrap gap-2">
                          {mistake.signalWords.map((word: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded border border-purple-100 dark:border-purple-800">{word}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* commonQualifierTraps - array of trap examples */}
                    {mistake.commonQualifierTraps && Array.isArray(mistake.commonQualifierTraps) && (
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Common Qualifier Traps:
                        </div>
                        {mistake.commonQualifierTraps.map((trap: any, idx: number) => (
                          <div key={idx} className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded space-y-2">
                            <div className="grid md:grid-cols-2 gap-2">
                              <div>
                                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Passage</div>
                                <div className="text-sm italic text-slate-700 dark:text-slate-300">
                                  "{trap.passage}"
                                </div>
                              </div>
                              <div>
                                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">Statement</div>
                                <div className="text-sm text-blue-900 dark:text-blue-100">
                                  "{trap.statement}"
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                                ⚠️ Missed: {trap.missedWord}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Fallback for Rule if not caught by Correct */}
                    {mistake.rule && !mistake.correct && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
                        <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                          💡 Rule: {mistake.rule}
                        </div>
                      </div>
                    )}

                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )
      }

      {/* Warning Sign */}
      {
        mc?.warningSign && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-r-lg">
            <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-1">Warning</h3>
            <p className="text-yellow-700 dark:text-yellow-300">{mc.warningSign}</p>
          </div>
        )
      }

      {/* Key Techniques */}
      {
        mc?.keyTechniques && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Key Techniques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(mc.keyTechniques).map(([k, v]: any) => (
                  <div key={`kt-${k}`} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">{k}</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{String(v)}</p>
                  </div>
                ))}
                <div className="p-3 bg-white/10 rounded-full">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                {theoryContent.timeManagement && (
                  <div>
                    <h3 className="font-bold text-lg">Time Management</h3>
                    <p className="text-slate-300">
                      {theoryContent.timeManagement.timePerQuestion} per question
                    </p>
                  </div>
                )}
              </div>
              {theoryContent.timeManagement?.tip && (
                <div className="text-right max-w-xs hidden md:block">
                  <p className="text-sm text-slate-400 italic">
                    "{theoryContent.timeManagement.tip}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      }

      {/* Take Quiz Button */}
      {
        theoryContent.quiz && theoryContent.quiz.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-dashed border-indigo-200 dark:border-indigo-800">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full text-indigo-700 dark:text-indigo-400 text-sm font-medium">
                <GraduationCap className="w-4 h-4" />
                {theoryContent.quiz.length} Questions
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                Ready to Test Your Knowledge?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Take a quick quiz to reinforce what you've learned about {theoryContent.name}.
              </p>
              <button
                onClick={startQuiz}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all hover:scale-105"
              >
                🎯 Take Quiz
              </button>
            </div>
          </div>
        )
      }
    </div >
  );
}
