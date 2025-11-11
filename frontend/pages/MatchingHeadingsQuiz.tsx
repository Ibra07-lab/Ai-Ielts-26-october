import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import ReadingTheoryQuiz from "@/components/ReadingTheoryQuiz";
import backend, { Local } from "~backend/client";

type TheoryQuizQuestion = {
  id: number;
  type: 'multiple-choice';
  text: string;
  options: string[];
  correctAnswer: string; // letter or full text
  explanation?: string;
};

type PracticalQuestion = {
  id: number;
  type: 'matching-headings';
  text: string; // Paragraph A/B/C/D
  correctAnswer: string; // e.g., "i"
  explanation?: string;
};

export default function MatchingHeadingsQuiz() {
  const { data: theoryContent, isLoading, isError } = useQuery({
    queryKey: ["reading-theory", "matching-headings"],
    queryFn: () => backend.ielts.getReadingTheoryById({ questionType: "matching-headings" })
  });

  const theoryQuiz = useMemo(() => {
    const tq = ((theoryContent as any)?.theoryQuiz || (theoryContent as any)?.quiz) as { title?: string; questions?: TheoryQuizQuestion[] } | undefined;
    if (!tq?.questions) return undefined;
    const normalized = tq.questions.map(q => {
      if (
        q.type === 'multiple-choice' &&
        Array.isArray(q.options) &&
        typeof q.correctAnswer === 'string' &&
        /^[a-d]$/i.test(q.correctAnswer)
      ) {
        const idx = q.correctAnswer.toLowerCase().charCodeAt(0) - 97; // a->0
        const correct = q.options[idx] ?? q.correctAnswer;
        return { ...q, correctAnswer: correct };
      }
      return q;
    });
    return { passage: undefined, questions: normalized };
  }, [theoryContent]);

  const practical = (theoryContent as any)?.practicalQuiz as
    | {
        passage?: Record<string, string>;
        headings: string[];
        questions: PracticalQuestion[];
      }
    | undefined;

  const [mhAnswers, setMhAnswers] = useState<Record<number, string>>({});
  const mhTotal = practical?.questions?.length ?? 0;
  const mhCorrect = useMemo(
    () =>
      (practical?.questions ?? []).reduce((sum, q) => sum + ((mhAnswers[q.id] || '').trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() ? 1 : 0), 0),
    [mhAnswers, practical]
  );

  const [theorySubmitted, setTheorySubmitted] = useState(false);
  const [practicalSubmitted, setPracticalSubmitted] = useState(false);
  const [computedTheoryScore, setComputedTheoryScore] = useState<number | null>(null);
  const [computedPracticalScore, setComputedPracticalScore] = useState<number | null>(null);

  if (isLoading) return <div className="max-w-3xl mx-auto p-6">Loading...</div>;
  if (isError || !theoryContent) return <div className="max-w-3xl mx-auto p-6 text-red-600">Failed to load quiz.</div>;

  // Overall scoring using provided ranges (assume total 8)
  const totalTheory = theoryQuiz?.questions?.length ?? 0;

  // ReadingTheoryQuiz controls its own submitted state; to compute combined score, we can recompute after submission by reading selected answers is non-trivial.
  // Instead, present separate section scores; overall band from mapping when both submitted.

  const scoring = (theoryContent as any)?.scoring as
    | {
        excellent: { range: string; message: string };
        good: { range: string; message: string };
        needsReview: { range: string; message: string };
        needsStudy: { range: string; message: string };
      }
    | undefined;

  function rangeToTuple(range?: string): [number, number] | undefined {
    if (!range) return undefined;
    const m = range.match(/^(\d+)\s*-\s*(\d+)$/);
    if (!m) return undefined;
    return [parseInt(m[1], 10), parseInt(m[2], 10)];
  }

  

  const submitPractical = () => {
    setPracticalSubmitted(true);
    setComputedPracticalScore(mhCorrect);
  };

  const totalOverall = (computedTheoryScore ?? 0) + (computedPracticalScore ?? 0);
  const totalMax = (theoryQuiz?.questions?.length ?? 0) + (practical?.questions?.length ?? 0);

  function getBandMessage(score: number) {
    const entries: Array<{ key: string; range?: [number, number]; msg: string }> = [
      { key: 'excellent', range: rangeToTuple(scoring?.excellent?.range), msg: scoring?.excellent?.message ?? '' },
      { key: 'good', range: rangeToTuple(scoring?.good?.range), msg: scoring?.good?.message ?? '' },
      { key: 'needsReview', range: rangeToTuple(scoring?.needsReview?.range), msg: scoring?.needsReview?.message ?? '' },
      { key: 'needsStudy', range: rangeToTuple(scoring?.needsStudy?.range), msg: scoring?.needsStudy?.message ?? '' },
    ];
    for (const e of entries) {
      if (e.range && score >= e.range[0] && score <= e.range[1]) return e.msg;
    }
    return '';
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Matching Headings Quiz</h1>
        <p className="text-slate-600 dark:text-slate-400">Practice understanding main ideas and selecting the best headings.</p>
      </div>

      {/* Theory MCQs */}
      {theoryQuiz?.questions?.length ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Theory Check</h2>
            {computedTheoryScore != null && (
              <Badge variant="secondary">Score: {computedTheoryScore} / {theoryQuiz.questions.length}</Badge>
            )}
          </div>
          <ReadingTheoryQuiz
            quiz={theoryQuiz}
          />
          {/* Lightweight way to capture theory score: recompute by inspecting DOM would be brittle; instead, provide a manual submission button that computes by re-evaluating with normalized answers is not accessible. For simplicity we omit combined theory score capture. */}
        </div>
      ) : null}

      {/* Practical Matching Headings */}
      {practical?.headings?.length ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Practical</h2>
            {practicalSubmitted && (
              <Badge variant="secondary">Score: {computedPracticalScore} / {mhTotal}</Badge>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Headings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {practical.headings.map((h, idx) => (
                  <div key={idx} className="text-sm"><strong>{h.split('.')[0]}.</strong> {h.replace(/^\w+\.\s*/, '')}</div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Paragraphs + Questions */}
          <div className="space-y-6">
            {(practical.questions ?? []).map(q => {
              const m = q.text.match(/Paragraph\s+([A-Z])/i);
              const letter = m?.[1]?.toUpperCase();
              const para = letter ? practical.passage?.[`paragraph${letter}` as keyof typeof practical.passage] : undefined;
              return (
                <Card key={q.id}>
                  <CardHeader>
                    <CardTitle>{q.text}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {para && (
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{para}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <Label className="text-sm">Choose heading</Label>
                      <Select
                        value={mhAnswers[q.id] || ''}
                        onValueChange={(v) => setMhAnswers(prev => ({ ...prev, [q.id]: v }))}
                        disabled={practicalSubmitted}
                      >
                        <SelectTrigger className="w-80"><SelectValue placeholder="Select heading (i, ii, iii...)" /></SelectTrigger>
                        <SelectContent>
                          {practical.headings.map((h, idx) => (
                            <SelectItem key={idx} value={h.split('.')[0]}>
                              {h}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {practicalSubmitted && (
                      <div className="text-sm">
                        {(mhAnswers[q.id] || '').trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() ? (
                          <p className="text-emerald-700 dark:text-emerald-400">Correct</p>
                        ) : (
                          <p className="text-red-700 dark:text-red-400">Incorrect. Correct: {q.correctAnswer}</p>
                        )}
                        {q.explanation && (
                          <p className="text-slate-600 dark:text-slate-400 mt-1">{q.explanation}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {!practicalSubmitted ? (
              <Button onClick={submitPractical} className="bg-emerald-600 hover:bg-emerald-700">Submit Practical</Button>
            ) : (
              <>
                <Button onClick={() => { setPracticalSubmitted(false); setMhAnswers({}); setComputedPracticalScore(null); }} variant="secondary">Reset</Button>
              </>
            )}
          </div>
        </div>
      ) : null}

      {/* Overall Summary */}
      {practicalSubmitted && (
        <Card>
          <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p>Total score: {totalOverall} / {totalMax}</p>
            {scoring && (
              <p className="text-slate-700 dark:text-slate-300">{getBandMessage(totalOverall)}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


