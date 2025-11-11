import React from "react";
import { Label } from "@/components/ui/label";

type NoteCompletionProps = {
  group: any;
  answers: Record<number, string>;
  result: any;
  onAnswerChange: (qid: number, value: string) => void;
};

// Render IELTS-style Note/Summary completion as bullet items with inline blanks
export default function NoteCompletion({
  group,
  answers,
  result,
  onAnswerChange,
}: NoteCompletionProps) {
  const items = Array.isArray(group?.questions) ? group.questions : [];

  const renderInlineWithBlank = (text: string, qid: number) => {
    // Prefer pattern like "(12)_____"
    const labeled = text.match(/\((\d+)\)_____/);
    if (labeled) {
      const [whole] = labeled;
      const [before, after] = text.split(whole);
      const labelNum = labeled[1];
      return (
        <span className="leading-7">
          {before}
          <span className="inline-flex items-center gap-1 mx-1 align-baseline">
            <span className="text-[10px] text-gray-500">{labelNum})</span>
            <input
              aria-label={`Gap ${labelNum}`}
              type="text"
              disabled={!!result}
              className="px-1 border-b border-gray-400 bg-transparent w-36 focus:outline-none focus:border-gray-700"
              value={answers[qid] || ""}
              onChange={(e) => onAnswerChange(qid, e.target.value)}
            />
          </span>
          {after}
        </span>
      );
    }

    // Fallback: plain underscores "_____"
    const unders = text.match(/_{3,}/);
    if (unders) {
      const idx = unders.index ?? -1;
      const before = text.slice(0, idx);
      const after = text.slice(idx + (unders[0]?.length || 0));
      return (
        <span className="leading-7">
          {before}
          <input
            aria-label={`Gap ${qid}`}
            type="text"
            disabled={!!result}
            className="px-1 border-b border-gray-400 bg-transparent w-36 focus:outline-none focus:border-gray-700 mx-1"
            value={answers[qid] || ""}
            onChange={(e) => onAnswerChange(qid, e.target.value)}
          />
          {after}
        </span>
      );
    }

    // Otherwise, append an inline input at the end
    return (
      <span className="leading-7">
        {text} —{" "}
        <input
          aria-label={`Gap ${qid}`}
          type="text"
          disabled={!!result}
          className="px-1 border-b border-gray-400 bg-transparent w-36 focus:outline-none focus:border-gray-700"
          value={answers[qid] || ""}
          onChange={(e) => onAnswerChange(qid, e.target.value)}
        />
      </span>
    );
  };

  return (
    <div className="space-y-3">
      {group?.word_limit && (
        <p className="text-xs italic text-gray-500">{group.word_limit}</p>
      )}
      <ul className="space-y-2 list-disc pl-6">
        {items.map((q: any) => {
          const context =
            (q?.context as string) ||
            (q?.questionText as string) ||
            "";
          return (
            <li key={q.id} className="text-sm">
              <Label className="sr-only">Gap {q.id}</Label>
              {renderInlineWithBlank(context, q.id)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}


