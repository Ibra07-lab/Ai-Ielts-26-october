import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import backend from "~backend/client";
import { Link } from "react-router-dom";

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
    default:
      return <BookOpen className="w-6 h-6 text-slate-500" />;
  }
};

export default function ReadingTheory() {
  const [selectedTheory, setSelectedTheory] = useState<string | null>(null);

  // Fetch all theory types
  const { data: theoriesData, isLoading: loadingList } = useQuery({
    queryKey: ['reading-theories'],
    queryFn: () => backend.ielts.getReadingTheoryList()
  });

  // Fetch specific theory content
  const { data: theoryContent, isLoading: loadingContent } = useQuery({
    queryKey: ['reading-theory', selectedTheory],
    queryFn: () => backend.ielts.getReadingTheoryById({ questionType: selectedTheory! }),
    enabled: !!selectedTheory
  });

  if (loadingList) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading theory content...</p>
        </div>
      </div>
    );
  }

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
          {theoriesData?.theories.map((theory) => (
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

  // Show specific theory content
  if (loadingContent) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <button
          onClick={() => setSelectedTheory(null)}
          className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-8"
        >
          ← Back to Theory List
        </button>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!theoryContent) return null;

  const mc = theoryContent as any;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-12 pb-24">
      {/* Back button */}
      <button
        onClick={() => setSelectedTheory(null)}
        className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
      >
        ← Back to Theory List
      </button>

      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {theoryContent.name}
        </h1>
        <div>
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            {theoryContent.category.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-200/70 dark:bg-slate-700/50" />



      {/* 1. What is it? */}
      <Card className="border-l-4 border-l-blue-500 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-500" />
            What is it?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
            {theoryContent.whatIsIt.description}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Skill tested:</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {theoryContent.whatIsIt.skillTested}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Guide */}
      {mc?.quickStartGuide && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mc.quickStartGuide.title && (
              <p className="font-medium text-slate-900 dark:text-slate-100">{mc.quickStartGuide.title}</p>
            )}
            {Array.isArray(mc.quickStartGuide.essentials) && (
              <div className="grid gap-2">
                {mc.quickStartGuide.essentials.map((e: string, i: number) => (
                  <div key={`ess-${i}`} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{e}</span>
                  </div>
                ))}
              </div>
            )}
            {mc.quickStartGuide.commonTrap && (
              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg flex gap-3">
                <HelpCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  <span className="font-bold">Watch out:</span> {mc.quickStartGuide.commonTrap}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Recognition */}
      {mc?.quickRecognition && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Quick Recognition</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            {Array.isArray(mc.quickRecognition.identifiers) && mc.quickRecognition.identifiers.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Identifiers</h3>
                <ul className="space-y-2">
                  {mc.quickRecognition.identifiers.map((t: string, i: number) => (
                    <li key={`id-${i}`} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-slate-400" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {Array.isArray(mc.quickRecognition.variants) && mc.quickRecognition.variants.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Variants</h3>
                <ul className="space-y-2">
                  {mc.quickRecognition.variants.map((t: string, i: number) => (
                    <li key={`var-${i}`} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center text-[10px] text-slate-500">V</div>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Question Types */}
      {Array.isArray(mc?.questionTypes) && mc.questionTypes.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Question Types</h2>
          <div className="grid gap-4">
            {mc.questionTypes.map((qt: any, i: number) => (
              <Card key={`qt-${i}`} className="overflow-hidden">
                <div className="border-l-4 border-l-purple-500 h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{qt.type}</CardTitle>
                      {qt.difficulty && (
                        <Badge variant={qt.difficulty === 'Hard' ? 'destructive' : 'secondary'}>
                          {qt.difficulty}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Array.isArray(qt.signals) && qt.signals.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {qt.signals.map((s: string, k: number) => (
                          <span key={`qt-s-${i}-${k}`} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-600 dark:text-slate-400 font-mono">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {qt.whatToLookFor && (
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-semibold text-purple-600 dark:text-purple-400">Look for:</span> {qt.whatToLookFor}
                      </p>
                    )}
                    {qt.strategy && (
                      <p className="text-sm text-slate-700 dark:text-slate-300 bg-purple-50 dark:bg-purple-900/10 p-2 rounded">
                        <span className="font-semibold text-purple-600 dark:text-purple-400">Strategy:</span> {qt.strategy}
                      </p>
                    )}
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Paraphrasing Patterns */}
      {mc?.paraphrasingPatterns && (
        <Card className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Puzzle className="w-5 h-5 text-indigo-500" />
              Paraphrasing Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mc.paraphrasingPatterns.description && (
              <p className="text-slate-700 dark:text-slate-300">{mc.paraphrasingPatterns.description}</p>
            )}
            {Array.isArray(mc.paraphrasingPatterns.commonPatterns) && (
              <div className="grid gap-3">
                {mc.paraphrasingPatterns.commonPatterns.map((p: any, i: number) => (
                  <div key={`pp-${i}`} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{p.type}</p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      {p.passageExample && (
                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Passage</span>
                          "{p.passageExample}"
                        </div>
                      )}
                      {Array.isArray(p.optionExamples) && (
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded">
                          <span className="text-xs font-bold text-indigo-500 uppercase block mb-1">Question/Option</span>
                          <ul className="list-disc ml-4">
                            {p.optionExamples.map((ex: string, k: number) => <li key={`pp-ex-${i}-${k}`}>{ex}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                    {p.tip && (
                      <p className="mt-2 text-xs text-slate-500 italic">💡 Tip: {p.tip}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 2. Example */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Example</h2>
        </div>

        <Card className="overflow-hidden border-slate-300 dark:border-slate-700">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
            {/* Passage Side */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Passage Excerpt</h3>
              {typeof theoryContent.example.passage === 'string' ? (
                <blockquote className="text-slate-800 dark:text-slate-200 font-serif leading-loose">
                  "{theoryContent.example.passage}"
                </blockquote>
              ) : theoryContent.example.passage && typeof theoryContent.example.passage === 'object' ? (
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
                    {theoryContent.example.headings.map((heading, idx) => (
                      <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex gap-2">
                        <span className="font-mono text-slate-400">{['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'][idx]}</span>
                        {heading}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-6">
                {theoryContent.example.questions.map((q) => (
                  <div key={q.id} className="space-y-3">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      <span className="text-slate-400 mr-2">{q.id}.</span>
                      {q.text}
                    </div>

                    {q.options && (
                      <ul className="ml-6 space-y-1">
                        {q.options.map((opt, idx) => (
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
        </Card>
      </section>

      {/* Worked Examples */}
      {mc?.examples && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Worked Examples</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {['detailQuestion', 'inferenceQuestion', 'opinionQuestion', 'purposeQuestion'].map((k) => {
              const ex = mc.examples?.[k];
              if (!ex) return null;
              return (
                <Card key={k} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium text-slate-500 uppercase tracking-wider">
                      {ex.difficulty || k.replace('Question', '')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 flex-1">
                    {ex.passage && (
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded italic text-sm text-slate-600 dark:text-slate-400">
                        "{ex.passage}"
                      </div>
                    )}
                    {ex.question && <p className="font-medium text-slate-800 dark:text-slate-200">{ex.question}</p>}
                    {Array.isArray(ex.options) && (
                      <ul className="space-y-1 ml-4 list-disc text-sm text-slate-600 dark:text-slate-400">
                        {ex.options.map((o: string, i: number) => <li key={`${k}-opt-${i}`}>{o}</li>)}
                      </ul>
                    )}
                    <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Answer: {ex.correctAnswer}</p>
                      {ex.explanation && <p className="text-xs text-slate-500 mt-1">{ex.explanation}</p>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Multiple Answer Questions */}
      {mc?.multipleAnswerQuestions && (
        <Card className="border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10">
          <CardHeader>
            <CardTitle className="text-xl text-indigo-900 dark:text-indigo-100">Multiple Answer Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mc.multipleAnswerQuestions.scoringRule && (
              <p className="text-indigo-800 dark:text-indigo-200 font-medium">{mc.multipleAnswerQuestions.scoringRule}</p>
            )}
            {Array.isArray(mc.multipleAnswerQuestions.strategy) && (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-2">Strategy</h4>
                <ul className="space-y-1">
                  {mc.multipleAnswerQuestions.strategy.map((s: string, i: number) => (
                    <li key={`ma-s-${i}`} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <ArrowRight className="w-3 h-3 text-indigo-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {mc.multipleAnswerQuestions.example && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-500 uppercase">Example</h4>
                {mc.multipleAnswerQuestions.example.passage && (
                  <blockquote className="italic text-slate-600 dark:text-slate-400 border-l-2 border-indigo-300 pl-3">
                    "{mc.multipleAnswerQuestions.example.passage}"
                  </blockquote>
                )}
                {mc.multipleAnswerQuestions.example.question && (
                  <p className="font-medium">{mc.multipleAnswerQuestions.example.question}</p>
                )}
                {Array.isArray(mc.multipleAnswerQuestions.example.options) && (
                  <div className="grid grid-cols-2 gap-2">
                    {mc.multipleAnswerQuestions.example.options.map((o: string, i: number) => (
                      <div key={`ma-o-${i}`} className="text-sm p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        {o}
                      </div>
                    ))}
                  </div>
                )}
                {Array.isArray(mc.multipleAnswerQuestions.example.correctAnswers) && (
                  <p className="text-sm font-bold text-emerald-600">Correct: {mc.multipleAnswerQuestions.example.correctAnswers.join(', ')}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 3. Common Mistakes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <XCircle className="w-6 h-6 text-rose-500" />
          Common Mistakes
        </h2>
        <div className="grid gap-3">
          {theoryContent.commonMistakes.map((mistake, idx) => (
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

      {/* 4. Strategy & Tips */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Strategy & Tips</h2>
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {theoryContent.strategyTips.map((tip, idx) => (
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

      {/* Warning Sign */}
      {mc?.warningSign && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-r-lg">
          <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-1">Warning</h3>
          <p className="text-yellow-700 dark:text-yellow-300">{mc.warningSign}</p>
        </div>
      )}

      {/* Key Techniques */}
      {mc?.keyTechniques && (
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Do's and Don'ts */}
      {mc?.dosAndDonts && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Do’s and Don’ts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-t-4 border-t-emerald-500">
              <CardHeader>
                <CardTitle className="text-emerald-600 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mc.dosAndDonts.dos?.map((d: string, i: number) => (
                    <li key={`do-${i}`} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-rose-500">
              <CardHeader>
                <CardTitle className="text-rose-600 flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Don't
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mc.dosAndDonts.donts?.map((d: string, i: number) => (
                    <li key={`dont-${i}`} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <XCircle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Advanced Tips */}
      {Array.isArray(mc?.advancedTips) && mc.advancedTips.length > 0 && (
        <Card className="bg-slate-900 text-white border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Lightbulb className="w-5 h-5" />
              Pro Tips for Band 8.0+
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {mc.advancedTips.map((t: any, i: number) => (
              <div key={`adv-${i}`} className="p-4 rounded bg-white/10 backdrop-blur-sm">
                <p className="font-bold text-lg mb-1">{t.title}</p>
                <p className="text-slate-300 mb-3">{t.description}</p>
                {t.application && (
                  <div className="text-sm text-yellow-200/80 italic border-l-2 border-yellow-500/50 pl-3">
                    How to apply: {t.application}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Emergency Strategy */}
      {mc?.emergencyStrategy && (
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10">
          <CardHeader>
            <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Emergency Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.isArray(mc.emergencyStrategy.whenRunningOutOfTime) && (
              <div>
                <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-2">When running out of time:</h4>
                <ul className="list-disc ml-5 text-orange-800 dark:text-orange-200 space-y-1">
                  {mc.emergencyStrategy.whenRunningOutOfTime.map((s: string, i: number) => <li key={`es-${i}`}>{s}</li>)}
                </ul>
              </div>
            )}
            {Array.isArray(mc['emergencyStrategy']?.['guessing Strategy']) && (
              <div>
                <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-2">Guessing Strategy:</h4>
                <ul className="list-disc ml-5 text-orange-800 dark:text-orange-200 space-y-1">
                  {mc['emergencyStrategy']['guessing Strategy'].map((s: string, i: number) => <li key={`gs-${i}`}>{s}</li>)}
                </ul>
              </div>
            )}
            {mc.emergencyStrategy.confidenceBooster && (
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400 italic text-center mt-4">
                "{mc.emergencyStrategy.confidenceBooster}"
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* 5. Time Management */}
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="shadow-2xl border-blue-200 dark:border-blue-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Target Time</p>
              <p className="font-bold text-lg text-slate-900 dark:text-slate-100">
                {theoryContent.timeManagement.timePerQuestion}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-6 pt-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Ready to Master This?</h3>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {theoryContent.id === 'matching-headings' && (
            <Link to="/reading/quiz-matching-headings">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                Start Matching Headings Quiz
              </Button>
            </Link>
          )}
          <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
            View More Theory
          </Button>
        </div>
      </div>
    </div>
  );
}
