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
  AlertCircle
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
    default:
      return <BookOpen className="w-6 h-6 text-slate-500" />;
  }
};

export default function ReadingTheory() {
  const [selectedTheory, setSelectedTheory] = useState<string | null>(null);

  // Get the selected theory content
  const theoryContent = selectedTheory
    ? theoryData.questionTypes.find((t: any) => t.id === selectedTheory)
    : null;

  const mc = theoryContent as any;

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



      {/* Detailed Theory Sections */}
      {mc?.detailedTheory?.sections && (
        <div className="space-y-8">
          {mc.detailedTheory.sections.map((section: any) => (
            <Card key={section.id} className="border-l-4 border-l-emerald-500 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-900 dark:text-emerald-100">
                  {section.title}
                </CardTitle>
                {section.intro && (
                  <p className="text-slate-600 dark:text-slate-400 mt-2">{section.intro}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-8">
                {section.subsections?.map((sub: any, idx: number) => (
                  <div key={idx} className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                      {sub.title}
                    </h3>

                    {sub.content && <p className="text-slate-700 dark:text-slate-300">{sub.content}</p>}
                    {sub.description && <p className="text-slate-700 dark:text-slate-300">{sub.description}</p>}

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

                    {/* Flowchart (Two Question Test) */}
                    {sub.flowchart && (
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

                    {/* Comparison Examples */}
                    {sub.examples && sub.passage && (
                      <div className="space-y-3">
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded italic text-slate-700 dark:text-slate-300">
                          "{sub.passage}"
                        </div>
                        <div className="grid gap-2">
                          {sub.examples.map((ex: any, i: number) => (
                            <div key={i} className={`p-3 border-l-4 rounded-lg ${
                              ex.answer === 'CORRECT' 
                                ? 'border-emerald-500 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/20' 
                                : 'border-rose-500 dark:border-rose-600 bg-rose-50/50 dark:bg-rose-900/20'
                            }`}>
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-3">
                                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex-1">
                                    {ex.heading || ex.statement}
                                  </span>
                                  <span className={`font-bold text-xs px-2 py-1 rounded whitespace-nowrap ${
                                    ex.answer === 'CORRECT' ? 'bg-emerald-600 dark:bg-emerald-700 text-white' :
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

                    {/* Steps (Strategy) */}
                    {sub.steps && (
                      <div className="space-y-4">
                        {sub.steps.map((step: any, i: number) => (
                          <div key={i} className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold">
                              {step.step}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-slate-100">{step.title}</h4>
                              {step.actions && (
                                <ul className="list-disc ml-4 text-sm text-slate-600 dark:text-slate-400">
                                  {step.actions.map((a: string, k: number) => <li key={k}>{a}</li>)}
                                </ul>
                              )}
                              {step.tests && (
                                <div className="mt-2 grid gap-1">
                                  {step.tests.map((t: string, k: number) => (
                                    <div key={k} className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{t}</div>
                                  ))}
                                </div>
                              )}
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

                    {/* Categories (for Signal Words, etc.) */}
                    {sub.categories && (
                      <div className="space-y-3">
                        {sub.categories.map((cat: any, i: number) => (
                          <div key={i} className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800">
                            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">{cat.category}</h4>
                            {cat.rule && <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">{cat.rule}</p>}
                            {cat.example && <p className="text-xs text-blue-700 dark:text-blue-300 italic bg-blue-100 dark:bg-blue-900/20 p-2 rounded">{cat.example}</p>}
                          </div>
                        ))}
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
                                <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${
                                  ex.answer === 'CORRECT' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : 
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
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Start Guide */}
      {mc?.quickStartGuide && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              Quick Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Do
                </h3>
                <ul className="space-y-2">
                  {mc.quickReferenceCard.do.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Don't
                </h3>
                <ul className="space-y-2">
                  {mc.quickReferenceCard.dont.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. Example */}
      {theoryContent.example && (
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
      )}

      {/* 3. Common Mistakes */}
      {theoryContent.commonMistakes && (
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
      )}

      {/* 4. Strategy & Tips */}
      {theoryContent.strategyTips && (
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
      )}

      {/* Signal Words (T/F/NG specific) */}
      {mc?.signalWords && (
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
      )}

      {/* Common Pitfalls (T/F/NG specific) */}
      {mc?.commonPitfalls && (
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
                  {mistake.example?.passage && (
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">Passage</div>
                        <div className="text-sm italic text-slate-700 dark:text-slate-300">
                          "{mistake.example.passage}"
                        </div>
                      </div>
                      {mistake.example.statement && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">Statement</div>
                          <div className="text-sm text-blue-900 dark:text-blue-100">
                            "{mistake.example.statement}"
                          </div>
                        </div>
                      )}
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
                  
                  {/* examples - array of examples (for negatives, etc) */}
                  {mistake.examples && Array.isArray(mistake.examples) && (
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Examples:
                      </div>
                      {mistake.examples.map((ex: any, idx: number) => (
                        <div key={idx} className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded space-y-2">
                          <div className="grid gap-2">
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
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* reality and strategy fields */}
                  {mistake.reality && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded">
                      <div className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase mb-1">Reality</div>
                      <div className="text-sm text-amber-800 dark:text-amber-200">
                        {mistake.reality}
                      </div>
                    </div>
                  )}
                  
                  {mistake.strategy && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 rounded">
                      <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase mb-1">Strategy</div>
                      <div className="text-sm text-emerald-800 dark:text-emerald-200">
                        💡 {mistake.strategy}
                      </div>
                    </div>
                  )}
                  
                  {mistake.rule && (
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
      )}

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
                <CardTitle className="text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mc.dosAndDonts.do.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-rose-500">
              <CardHeader>
                <CardTitle className="text-rose-700 dark:text-rose-400 flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Don’t
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mc.dosAndDonts.dont.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Time Management */}
      {theoryContent.timeManagement && (
      <Card className="bg-slate-900 text-white border-none">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-full">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Time Management</h3>
              <p className="text-slate-300">
                {theoryContent.timeManagement.timePerQuestion} per question
              </p>
            </div>
          </div>
          <div className="text-right max-w-xs hidden md:block">
            <p className="text-sm text-slate-400 italic">
              "{theoryContent.timeManagement.tip}"
            </p>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
