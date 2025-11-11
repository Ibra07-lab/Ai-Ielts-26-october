import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import ReadingTheoryQuiz from "@/components/ReadingTheoryQuiz";
import { Local } from "~backend/client";

type TFNG = "True" | "False" | "Not Given";

export default function ReadingTFNGQuiz() {
  const { toast } = useToast();
  const { data: theoryContent, isLoading, isError, error } = useQuery({
    queryKey: ["reading-theory", "true-false-not-given"],
    queryFn: async () => {
      const resp = await fetch(`${Local}/reading/theory/true-false-not-given`, { method: "GET", cache: "no-store" });
      return resp.json();
    },
  });

  if (isLoading) {
    return <div className="max-w-3xl mx-auto p-6">Loading...</div>;
  }

  if (isError || !theoryContent) {
    return <div className="max-w-3xl mx-auto p-6 text-red-600">Failed to load quiz.</div>;
  }

  const mergedQuiz = useMemo(() => {
    const intro = ((theoryContent as any).Quiz?.questions ?? (theoryContent as any).introQuiz?.questions ?? []) as any[];
    const normalizeMCQ = (q: any) => {
      if (
        q?.type === 'multiple-choice' &&
        Array.isArray(q.options) &&
        typeof q.correctAnswer === 'string' &&
        /^[a-d]$/i.test(q.correctAnswer)
      ) {
        const idx = q.correctAnswer.toLowerCase().charCodeAt(0) - 97; // a->0
        const correct = q.options[idx] ?? q.correctAnswer;
        return { ...q, correctAnswer: correct };
      }
      return q;
    };
    const introFixed = intro.map(normalizeMCQ);
    const main = (theoryContent.quiz?.questions ?? []) as any[];
    const passage = theoryContent.quiz?.passage;
    return { passage, questions: [...introFixed, ...main] };
  }, [theoryContent]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">True / False / Not Given Quiz</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Choose True if the statement agrees with the passage, False if it contradicts it, and Not Given if the passage does not say.
        </p>
      </div>

      {mergedQuiz?.questions?.length ? (
        <ReadingTheoryQuiz quiz={mergedQuiz} />
      ) : (
        <div className="text-slate-700 dark:text-slate-300">No quiz available.</div>
      )}
    </div>
  );
}


