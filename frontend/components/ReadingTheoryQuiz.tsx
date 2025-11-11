import { useMemo, useState, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

type QuizType =
  | 'true-false-not-given'
  | 'multiple-choice'
  | 'matching-headings'
  | 'short-answer'
  | 'gap-fill';

type QuizQuestion = {
  id: number;
  type: QuizType;
  text: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
};

export type TheoryQuiz = {
  passage?: string;
  questions: QuizQuestion[];
};

function normalize(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, ' ');
}

function isCorrect(correct: string | string[], user: string | undefined) {
  if (!user) return false;
  if (Array.isArray(correct)) return correct.some(c => normalize(c) === normalize(user));
  return normalize(correct) === normalize(user);
}

export default function ReadingTheoryQuiz({ quiz }: { quiz: TheoryQuiz }) {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<number, string | undefined>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = useMemo(
    () => quiz.questions.every(q => answers[q.id] != null && String(answers[q.id]).length > 0),
    [answers, quiz.questions]
  );

  const score = useMemo(
    () => (submitted ? quiz.questions.filter(q => isCorrect(q.correctAnswer, answers[q.id])).length : 0),
    [submitted, answers, quiz.questions]
  );

  const handleSubmit = () => {
    if (!allAnswered) {
      toast({ title: "Please answer all questions", description: "Some items are unanswered." });
      return;
    }
    setSubmitted(true);
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {(() => {
              const anchorIdx = quiz.passage
                ? quiz.questions.findIndex(q => q.type === 'true-false-not-given' || (typeof q.id === 'number' && q.id >= 5))
                : -1;
              return quiz.questions.map((q, idx) => (
                <Fragment key={q.id}>
                  {quiz.passage && anchorIdx === idx && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Passage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{quiz.passage}</div>
                      </CardContent>
                    </Card>
                  )}
                  <Card>
                <CardContent className="pt-6 space-y-4">
                  <p className="font-medium">{q.id}. {q.text}</p>

                  {q.type === 'true-false-not-given' && (
                    <RadioGroup
                      value={answers[q.id]}
                      onValueChange={v => !submitted && setAnswers(prev => ({ ...prev, [q.id]: v }))}
                      className="gap-2"
                    >
                      {['TRUE', 'FALSE', 'NOT GIVEN'].map(opt => (
                        <div key={opt} className="flex items-center gap-3">
                          <RadioGroupItem id={`q-${q.id}-${opt}`} value={opt} disabled={submitted} />
                          <Label htmlFor={`q-${q.id}-${opt}`}>{opt}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {q.type === 'multiple-choice' && q.options && (
                    <RadioGroup
                      value={answers[q.id]}
                      onValueChange={v => !submitted && setAnswers(prev => ({ ...prev, [q.id]: v }))}
                      className="gap-2"
                    >
                      {q.options.map(opt => (
                        <div key={opt} className="flex items-center gap-3">
                          <RadioGroupItem id={`q-${q.id}-${opt}`} value={opt} disabled={submitted} />
                          <Label htmlFor={`q-${q.id}-${opt}`}>{opt}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {q.type === 'matching-headings' && q.options && (
                    <div className="flex items-center gap-3">
                      <Select
                        value={(answers[q.id] as string) || undefined}
                        onValueChange={v => !submitted && setAnswers(prev => ({ ...prev, [q.id]: v }))}
                        disabled={submitted}
                      >
                        <SelectTrigger><SelectValue placeholder="Select heading" /></SelectTrigger>
                        <SelectContent>
                          {q.options.map(h => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(q.type === 'short-answer' || q.type === 'gap-fill') && (
                    <Input
                      value={(answers[q.id] as string) || ''}
                      onChange={e => !submitted && setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder="Type your answer"
                      disabled={submitted}
                    />
                  )}

                  {submitted && (
                    <div className="text-sm">
                      {isCorrect(q.correctAnswer, answers[q.id]) ? (
                        <p className="text-emerald-700 dark:text-emerald-400">Correct</p>
                      ) : (
                        <p className="text-red-700 dark:text-red-400">
                          Incorrect. Correct answer: {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(' / ') : q.correctAnswer}
                        </p>
                      )}
                      {q.explanation && (
                        <p className="text-slate-600 dark:text-slate-400 mt-1">{q.explanation}</p>
                      )}
                    </div>
                  )}
                </CardContent>
                  </Card>
                </Fragment>
              ));
            })()}
          </div>

          <div className="flex items-center gap-3">
            {!submitted ? (
              <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">Submit</Button>
            ) : (
              <>
                <Button onClick={reset} variant="secondary">Reset</Button>
                <div className="ml-auto font-medium">Score: {score} / {quiz.questions.length}</div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


