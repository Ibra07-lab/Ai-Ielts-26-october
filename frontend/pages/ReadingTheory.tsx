import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Lightbulb, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import backend from "~backend/client";
import { Link } from "react-router-dom";

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
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            📚 Reading Theory
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Learn about different IELTS Reading question types before you practice
          </p>
        </div>

        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Why Study Theory?
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Understanding question types BEFORE practicing helps you recognize patterns, avoid common mistakes, and answer more efficiently during the real exam.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          {theoriesData?.theories.map((theory) => (
            <Card
              key={theory.id}
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-400"
              onClick={() => setSelectedTheory(theory.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{theory.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {theory.category.replace('-', ' ')}
                    </Badge>
                  </div>
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
                  Learn More →
                </Button>
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
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          What is it?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {theoryContent.whatIsIt.description}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium">Skill tested:</span> {theoryContent.whatIsIt.skillTested}
        </p>
      </section>

      {/* Quick Start Guide */}
      {mc?.quickStartGuide && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Quick Start Guide</h2>
          {mc.quickStartGuide.title && (
            <p className="text-slate-700 dark:text-slate-300">{mc.quickStartGuide.title}</p>
          )}
          {Array.isArray(mc.quickStartGuide.essentials) && (
            <ul className="list-disc ml-6 space-y-1 text-slate-700 dark:text-slate-300">
              {mc.quickStartGuide.essentials.map((e: string, i: number) => (
                <li key={`ess-${i}`}>{e}</li>
              ))}
            </ul>
          )}
          {mc.quickStartGuide.commonTrap && (
            <p className="text-sm text-orange-700 dark:text-orange-300">Note: {mc.quickStartGuide.commonTrap}</p>
          )}
        </section>
      )}

      {/* Quick Recognition */}
      {mc?.quickRecognition && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Quick Recognition</h2>
          {Array.isArray(mc.quickRecognition.identifiers) && mc.quickRecognition.identifiers.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold">Identifiers</h3>
              <ul className="list-disc ml-6 space-y-1 text-slate-700 dark:text-slate-300">
                {mc.quickRecognition.identifiers.map((t: string, i: number) => (
                  <li key={`id-${i}`}>{t}</li>
                ))}
              </ul>
            </div>
          )}
          {Array.isArray(mc.quickRecognition.variants) && mc.quickRecognition.variants.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold">Variants</h3>
              <ul className="list-disc ml-6 space-y-1 text-slate-700 dark:text-slate-300">
                {mc.quickRecognition.variants.map((t: string, i: number) => (
                  <li key={`var-${i}`}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Question Types */}
      {Array.isArray(mc?.questionTypes) && mc.questionTypes.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Question Types</h2>
          <div className="space-y-4">
            {mc.questionTypes.map((qt: any, i: number) => (
              <div key={`qt-${i}`} className="space-y-1">
                <p className="font-medium text-slate-900 dark:text-slate-100">{qt.type}{qt.difficulty ? ` (${qt.difficulty})` : ""}</p>
                {Array.isArray(qt.signals) && qt.signals.length > 0 && (
                  <ul className="list-disc ml-6 text-slate-700 dark:text-slate-300">
                    {qt.signals.map((s: string, k: number) => <li key={`qt-s-${i}-${k}`}>{s}</li>)}
                  </ul>
                )}
                {qt.whatToLookFor && <p className="text-slate-700 dark:text-slate-300"><span className="font-medium">Look for:</span> {qt.whatToLookFor}</p>}
                {qt.strategy && <p className="text-slate-700 dark:text-slate-300"><span className="font-medium">Strategy:</span> {qt.strategy}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Paraphrasing Patterns */}
      {mc?.paraphrasingPatterns && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Paraphrasing Patterns</h2>
          {mc.paraphrasingPatterns.description && (
            <p className="text-slate-700 dark:text-slate-300">{mc.paraphrasingPatterns.description}</p>
          )}
          {Array.isArray(mc.paraphrasingPatterns.commonPatterns) && (
            <div className="space-y-3">
              {mc.paraphrasingPatterns.commonPatterns.map((p: any, i: number) => (
                <div key={`pp-${i}`} className="space-y-1">
                  <p className="font-medium">{p.type}</p>
                  {p.passageExample && <p className="text-slate-700 dark:text-slate-300">Passage: {p.passageExample}</p>}
                  {Array.isArray(p.optionExamples) && (
                    <ul className="list-disc ml-6 text-slate-700 dark:text-slate-300">
                      {p.optionExamples.map((ex: string, k: number) => <li key={`pp-ex-${i}-${k}`}>{ex}</li>)}
                    </ul>
                  )}
                  {p.tip && <p className="text-sm text-slate-600 dark:text-slate-400">Tip: {p.tip}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Divider */}
      <div className="h-px bg-slate-200/70 dark:bg-slate-700/50" />

      {/* 2. Example */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          Example
        </h2>
        {typeof theoryContent.example.passage === 'string' ? (
          <blockquote className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
            "{theoryContent.example.passage}"
          </blockquote>
        ) : theoryContent.example.passage && typeof theoryContent.example.passage === 'object' ? (
          <div className="space-y-3">
            {Object.entries(theoryContent.example.passage as Record<string, string>)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([paraKey, paraText]) => (
                <div key={paraKey} className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {paraKey.replace(/^paragraph/i, 'Paragraph ')}
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{paraText}</p>
                </div>
              ))}
          </div>
        ) : null}

        {theoryContent.example.headings && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Headings</h3>
            <ul className="space-y-1">
              {theoryContent.example.headings.map((heading, idx) => (
                <li key={idx} className="text-slate-700 dark:text-slate-300 pl-4">{heading}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Questions</h3>
          {theoryContent.example.questions.map((q) => (
            <div key={q.id} className="space-y-1">
              <p className="text-slate-700 dark:text-slate-300">
                {q.id}. {q.text}
              </p>
              {q.options && (
                <ul className="ml-4 list-disc space-y-1 text-slate-600 dark:text-slate-400">
                  {q.options.map((opt, idx) => (
                    <li key={idx}>{opt}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Answers</h3>
          <ul className="space-y-2">
            {theoryContent.example.questions.map((q) => (
              <li key={q.id} className="flex gap-3 text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div>
                  <p className="font-medium">{q.id}. {q.correctAnswer}</p>
                  {q.explanation && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">{q.explanation}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Worked Examples */}
      {mc?.examples && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Worked Examples</h2>
          {['detailQuestion','inferenceQuestion','opinionQuestion','purposeQuestion'].map((k) => {
            const ex = mc.examples?.[k];
            if (!ex) return null;
            return (
              <div key={k} className="space-y-2">
                {ex.difficulty && <p className="font-medium">{ex.difficulty} example</p>}
                {ex.passage && <blockquote className="italic text-slate-700 dark:text-slate-300">"{ex.passage}"</blockquote>}
                {ex.question && <p className="text-slate-700 dark:text-slate-300">{ex.question}</p>}
                {Array.isArray(ex.options) && (
                  <ul className="list-disc ml-6 text-slate-700 dark:text-slate-300">
                    {ex.options.map((o: string, i: number) => <li key={`${k}-opt-${i}`}>{o}</li>)}
                  </ul>
                )}
                {ex.correctAnswer && <p className="text-emerald-700 dark:text-emerald-300">Answer: {ex.correctAnswer}</p>}
                {ex.explanation && <p className="text-sm text-slate-600 dark:text-slate-400">{ex.explanation}</p>}
              </div>
            );
          })}
        </section>
      )}

      {/* Multiple Answer Questions */}
      {mc?.multipleAnswerQuestions && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Multiple Answer Questions</h2>
          {mc.multipleAnswerQuestions.scoringRule && (
            <p className="text-slate-700 dark:text-slate-300">{mc.multipleAnswerQuestions.scoringRule}</p>
          )}
          {Array.isArray(mc.multipleAnswerQuestions.strategy) && (
            <ul className="list-disc ml-6 text-slate-700 dark:text-slate-300">
              {mc.multipleAnswerQuestions.strategy.map((s: string, i: number) => <li key={`ma-s-${i}`}>{s}</li>)}
            </ul>
          )}
          {mc.multipleAnswerQuestions.example && (
            <div className="space-y-2">
              {mc.multipleAnswerQuestions.example.passage && (
                <blockquote className="italic text-slate-700 dark:text-slate-300">"{mc.multipleAnswerQuestions.example.passage}"</blockquote>
              )}
              {mc.multipleAnswerQuestions.example.question && (
                <p className="text-slate-700 dark:text-slate-300">{mc.multipleAnswerQuestions.example.question}</p>
              )}
              {Array.isArray(mc.multipleAnswerQuestions.example.options) && (
                <ul className="list-disc ml-6 text-slate-700 dark:text-slate-300">
                  {mc.multipleAnswerQuestions.example.options.map((o: string, i: number) => <li key={`ma-o-${i}`}>{o}</li>)}
                </ul>
              )}
              {Array.isArray(mc.multipleAnswerQuestions.example.correctAnswers) && (
                <p className="text-emerald-700 dark:text-emerald-300">Answers: {mc.multipleAnswerQuestions.example.correctAnswers.join(', ')}</p>
              )}
              {mc.multipleAnswerQuestions.example.explanation && (
                <p className="text-sm text-slate-600 dark:text-slate-400">{mc.multipleAnswerQuestions.example.explanation}</p>
              )}
            </div>
          )}
        </section>
      )}

      {/* Divider */}
      <div className="h-px bg-slate-200/70 dark:bg-slate-700/50" />

      {/* 3. Common Mistakes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          Common Mistakes
        </h2>
        <ul className="space-y-3">
          {theoryContent.commonMistakes.map((mistake, idx) => (
            <li key={idx} className="space-y-1">
              <p className="font-medium text-slate-900 dark:text-slate-100">{mistake.title}</p>
              <p className="text-slate-700 dark:text-slate-300">{mistake.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Divider */}
      <div className="h-px bg-slate-200/70 dark:bg-slate-700/50" />

      {/* 4. Strategy & Tips */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Strategy & Tips</h2>
        <ol className="space-y-3">
          {theoryContent.strategyTips.map((tip) => (
            <li key={tip.step} className="space-y-1">
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {tip.step}. {tip.title}
              </p>
              <p className="text-slate-700 dark:text-slate-300">{tip.description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Warning Sign */}
      {mc?.warningSign && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Warning</h2>
          <p className="text-slate-700 dark:text-slate-300">{mc.warningSign}</p>
        </section>
      )}

      {/* Key Techniques */}
      {mc?.keyTechniques && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Key Techniques</h2>
          <ul className="list-disc ml-6 text-slate-700 dark:text-slate-300">
            {Object.entries(mc.keyTechniques).map(([k, v]: any) => (
              <li key={`kt-${k}`}>
                <span className="font-medium">{k}:</span> {String(v)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Do's and Don'ts */}
      {mc?.dosAndDonts && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Do’s and Don’ts</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold">Do</h3>
              <ul className="list-disc ml-6 text-slate-700 dark:text-slate-300">
                {mc.dosAndDonts.dos?.map((d: string, i: number) => <li key={`do-${i}`}>{d}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Don’t</h3>
              <ul className="list-disc ml-6 text-slate-700 dark:text-slate-300">
                {mc.dosAndDonts.donts?.map((d: string, i: number) => <li key={`dont-${i}`}>{d}</li>)}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Advanced Tips */}
      {Array.isArray(mc?.advancedTips) && mc.advancedTips.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Advanced Tips</h2>
          <ul className="space-y-2">
            {mc.advancedTips.map((t: any, i: number) => (
              <li key={`adv-${i}`} className="text-slate-700 dark:text-slate-300">
                <span className="font-medium">{t.title}:</span> {t.description}
                {t.application && <div className="text-sm text-slate-600 dark:text-slate-400">How to apply: {t.application}</div>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Emergency Strategy */}
      {mc?.emergencyStrategy && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Emergency Strategy</h2>
          {Array.isArray(mc.emergencyStrategy.whenRunningOutOfTime) && (
            <ul className="list-disc ml-6 text-slate-700 dark:text-slate-300">
              {mc.emergencyStrategy.whenRunningOutOfTime.map((s: string, i: number) => <li key={`es-${i}`}>{s}</li>)}
            </ul>
          )}
          {Array.isArray(mc['emergencyStrategy']?.['guessing Strategy']) && (
            <div className="space-y-1">
              <p className="font-medium">Guessing strategy</p>
              <ul className="list-disc ml-6 text-slate-700 dark:text-slate-300">
                {mc['emergencyStrategy']['guessing Strategy'].map((s: string, i: number) => <li key={`gs-${i}`}>{s}</li>)}
              </ul>
            </div>
          )}
          {mc.emergencyStrategy.confidenceBooster && (
            <p className="text-sm text-slate-600 dark:text-slate-400">{mc.emergencyStrategy.confidenceBooster}</p>
          )}
        </section>
      )}

      {/* Divider */}
      <div className="h-px bg-slate-200/70 dark:bg-slate-700/50" />

      {/* 5. Time Management */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Time Management</h2>
        <p className="text-slate-700 dark:text-slate-300">
          ⏱️ Spend {theoryContent.timeManagement.timePerQuestion}
        </p>
        <p className="text-slate-700 dark:text-slate-300">{theoryContent.timeManagement.tip}</p>
        {mc?.timeManagement?.totalTime && (
          <p className="text-slate-700 dark:text-slate-300">Total for set: {mc.timeManagement.totalTime}</p>
        )}
        {mc?.timeManagement?.timePerMultipleAnswer && (
          <p className="text-slate-700 dark:text-slate-300">Choose TWO/THREE: {mc.timeManagement.timePerMultipleAnswer}</p>
        )}
      </section>

      {/* Divider */}
      <div className="h-px bg-slate-200/70 dark:bg-slate-700/50" />

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Ready to Practice?</h3>
        <div className="flex flex-col md:flex-row gap-3 justify-center">
          {theoryContent.id === 'matching-headings' && (
            <Link to="/reading/quiz-matching-headings">
              <Button variant="secondary">
                Start Matching Headings Quiz
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
