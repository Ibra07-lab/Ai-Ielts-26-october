import { sanitizeHtml } from '@/utils/sanitize';
import React, { useState, useEffect, useRef, startTransition, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Clock, Send, RotateCcw, Highlighter, CheckCircle, XCircle, Lightbulb, AlertCircle, Sparkles, GraduationCap, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import TextHighlighter from "../components/TextHighlighter";
import ReadingTheoryQuiz from "@/components/ReadingTheoryQuiz";
import backend, { Local } from "@/backend";
import { getAIFeedback } from '../services/aiFeedback';
import NoteCompletion from "@/components/questions/NoteCompletion";
import { PreviewSignupModal } from "@/components/PreviewSignupModal";

interface Highlight {
  id: number;
  highlightedText: string;
  startPosition: number;
  endPosition: number;
  highlightType: string;
  highlightColor: string;
}

interface TableCell {
  type: 'text' | 'gap';
  content?: string;        // For text cells
  gapNumber?: number;      // For gap cells
  correctAnswer?: string;  // For gap cells
}

interface TableRow {
  cells: TableCell[];
}

interface TableCompletionQuestion {
  id: number;
  type: 'table-completion';
  title: string;
  instructions: string;
  word_limit: string;      // e.g., "NO MORE THAN TWO WORDS"
  headers: string[];
  rows: TableRow[];
  questions: Array<{
    id: number;
    gap_number: number;
    correctAnswer: string;
  }>;
}

function QuestionResult({
  question,
  answer,
  correctAnswer,
  explanation,
  aiFeedback,
  onGetAIFeedback,
  isLoadingFeedback,
  remainingCredits,
  creditsLimit,
  textSize = 'regular'
}: {
  question: any;
  answer: string;
  correctAnswer: string;
  explanation: string;
  aiFeedback?: any;
  onGetAIFeedback?: () => void;
  isLoadingFeedback?: boolean;
  remainingCredits?: number;
  creditsLimit?: number;
  textSize?: TextSizeOption;
}) {
  const [expanded, setExpanded] = useState(false);
  const isCorrect = answer === correctAnswer;

  const getFontSizeClass = () => {
    if (textSize === 'large') return 'text-lg';
    if (textSize === 'extra-large') return 'text-xl';
    return 'text-base';
  };

  return (
    <div
      className={`p-5 rounded-md border-l-2 cursor-pointer transition-colors ${isCorrect
        ? 'bg-slate-50 dark:bg-slate-800/30 border-emerald-600/80 hover:bg-slate-100 dark:hover:bg-slate-800/50'
        : 'bg-slate-50 dark:bg-slate-800/30 border-rose-700/80 hover:bg-slate-100 dark:hover:bg-slate-800/50'
        }`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Sticky Header */}
      <div className={`flex items-center justify-between ${expanded ? 'sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 pb-3 mb-6 -mx-5 px-5' : ''}`}>
        <div className="flex items-center gap-3">
          {isCorrect ? (
            <CheckCircle className="w-5 h-5 text-emerald-600/80 dark:text-emerald-500/80" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-700/80 dark:text-rose-600/80" />
          )}
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Q{question.id}
          </span>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {expanded ? '▼' : '▶'} Click for details
        </span>
      </div>

      {expanded && (
        <div className="space-y-6 text-base leading-relaxed">
          {/* Question Text */}
          <div>
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
              {question.questionText || question.sentenceBeginning}
            </p>
          </div>

          {/* Answer Comparison - Simplified */}
          <div className={`space-y-4 ${getFontSizeClass()}`}>
            <div className="flex items-start gap-3 p-4 border-l-2 border-slate-300 dark:border-slate-600 bg-transparent">
              {isCorrect ? (
                <CheckCircle className="w-4 h-4 text-emerald-600/80 dark:text-emerald-500/80 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-700/80 dark:text-rose-600/80 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Your Answer
                </p>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  {answer || "Not answered"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border-l-2 border-emerald-600/80 bg-transparent">
              <CheckCircle className="w-4 h-4 text-emerald-600/80 dark:text-emerald-500/80 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Correct Answer
                </p>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  {correctAnswer}
                </p>
              </div>
            </div>
          </div>

          {/* For CORRECT answers */}
          {isCorrect && (
            <div className="space-y-6 divide-y divide-slate-200 dark:divide-slate-700">
              <div className="pt-6 first:pt-0">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {explanation}
                </p>
              </div>

              {/* Show evidence quote if available */}
              {question.evidenceQuote && (
                <div className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                    <h4 className="font-medium text-slate-700 dark:text-slate-300">Evidence from Passage</h4>
                  </div>
                  <div className="pl-7 border-l-2 border-emerald-600/50 dark:border-emerald-500/50">
                    <p className="text-slate-700 dark:text-slate-300 leading-loose italic">
                      "{question.evidenceQuote}"
                    </p>
                  </div>
                </div>
              )}

              {/* Show justification if available */}
              {question.justification && (
                <div className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <h4 className="font-medium text-slate-700 dark:text-slate-300">Why This is Correct</h4>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {question.justification}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* For INCORRECT answers */}
          {!isCorrect && (
            <div className="space-y-6 divide-y divide-slate-200 dark:divide-slate-700">
              {/* Basic explanation */}
              <div className="pt-6 first:pt-0">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {explanation}
                </p>
              </div>

              {/* Show evidence quote if available in test data */}
              {question.evidenceQuote && (
                <div className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                    <h4 className="font-medium text-slate-700 dark:text-slate-300">Evidence from Passage</h4>
                  </div>
                  <div className="pl-7 border-l-2 border-emerald-600/50 dark:border-emerald-500/50">
                    <p className="text-slate-700 dark:text-slate-300 leading-loose italic">
                      "{question.evidenceQuote}"
                    </p>
                  </div>
                </div>
              )}

              {/* Show justification if available in test data */}
              {question.justification && (
                <div className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <h4 className="font-medium text-slate-700 dark:text-slate-300">Why the Correct Answer is Right</h4>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {question.justification}
                  </p>
                </div>
              )}

              {/* AI Feedback Section - Deeper Analysis */}
              {onGetAIFeedback && (
                <div className="pt-6">
                  <div className="space-y-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (remainingCredits === 0) {
                          // User should see upgrade toast anyway if backend fails
                        }
                        onGetAIFeedback();
                      }}
                      disabled={remainingCredits === 0}
                      className={`w-full px-6 py-3 rounded-md transition-colors font-medium text-base flex items-center justify-center gap-2 ${remainingCredits === 0
                          ? 'bg-slate-400 cursor-not-allowed text-white/80'
                          : 'bg-slate-700 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white'
                        }`}
                    >
                      <Sparkles className="w-5 h-5" />
                      Get Deeper AI Analysis
                    </button>

                    {creditsLimit !== undefined && (
                      <div className="flex justify-center">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 px-2 border-slate-200 dark:border-slate-800 text-slate-500">
                          {creditsLimit === -1 ? (
                            "Unlimited Credits"
                          ) : (
                            `${remainingCredits} credits remaining`
                          )}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isLoadingFeedback && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-slate-600"></div>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-3">AI is analyzing your answer...</p>
                </div>
              )}

              {aiFeedback && (
                <div className="space-y-6 divide-y divide-slate-200 dark:divide-slate-700">
                  {/* AI Reasoning - Additional analysis */}
                  <div className="pt-6 first:pt-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-500" />
                      <h4 className="font-medium text-slate-700 dark:text-slate-300">AI Tutor's Detailed Analysis</h4>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {aiFeedback.reasoning}
                    </p>
                  </div>

                  {/* Additional Evidence Quote from AI */}
                  <div className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                      <h4 className="font-medium text-slate-700 dark:text-slate-300">Additional Evidence (AI-Found)</h4>
                    </div>
                    <div className="pl-7 border-l-2 border-emerald-600/50 dark:border-emerald-500/50 mb-3">
                      <p className="text-slate-700 dark:text-slate-300 leading-loose italic">
                        "{aiFeedback.passage_reference}"
                      </p>
                    </div>
                    <p className="text-sm text-emerald-600 dark:text-emerald-500 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      This quote supports the correct answer
                    </p>
                  </div>

                  {/* AI Recommendations */}
                  <div className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      <h4 className="font-medium text-slate-700 dark:text-slate-300">AI Tutor's Recommendations</h4>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {aiFeedback.feedback}
                    </p>
                  </div>


                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper explanation for TRUE/FALSE/NOT GIVEN question types
function TrueFalseExplanation({ format }: { format: 'TRUE/FALSE' | 'YES/NO' }) {
  return (
    <div className="mt-3 p-3 border-l-4 border-blue-500 rounded-lg">
      <h5 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
        📘 How to answer {format}/NOT GIVEN questions:
      </h5>
      <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
        <p><strong>{format === 'TRUE/FALSE' ? 'TRUE' : 'YES'}:</strong> The statement agrees with the information in the passage</p>
        <p><strong>{format === 'TRUE/FALSE' ? 'FALSE' : 'NO'}:</strong> The statement contradicts the information in the passage</p>
        <p><strong>NOT GIVEN:</strong> There is no information about this in the passage</p>
      </div>
    </div>
  );
}

// Summary Completion component (moved outside to prevent recreation on re-render)
function SummaryCompletion({
  group,
  answers,
  result,
  handleAnswerChange,
  summaryInputRefs,
  textSize = 'regular'
}: {
  group: any;
  answers: Record<number, string>;
  result: any;
  handleAnswerChange: (qid: number, value: string) => void;
  summaryInputRefs: React.MutableRefObject<Record<number, HTMLInputElement | null>>;
  textSize?: TextSizeOption;
}) {
  const getFontSizeClass = () => {
    if (textSize === 'large') return 'text-lg';
    if (textSize === 'extra-large') return 'text-xl';
    return 'text-sm';
  };
  const getInputSizeClass = () => {
    if (textSize === 'large') return 'text-lg w-44';
    if (textSize === 'extra-large') return 'text-xl w-52';
    return 'text-sm w-32';
  };
  // Parse IELTS-style word limit rules
  const parseWordLimit = (ruleText: string | undefined) => {
    const text = (ruleText || "").toUpperCase();
    let maxWords = 2;
    if (text.includes("ONE WORD")) maxWords = 1;
    else if (text.includes("TWO WORD")) maxWords = 2;
    else if (text.includes("THREE WORD")) maxWords = 3;
    else {
      // Fallback: try to read a number if present
      const n = parseInt((text.match(/\d+/)?.[0] as string) || "", 10);
      if (!isNaN(n)) maxWords = n;
    }
    const allowNumber = text.includes("NUMBER");
    return { maxWords, allowNumber };
  };

  const { maxWords, allowNumber } = parseWordLimit(group?.word_limit);

  // Count words with IELTS rules: hyphenated counts as one; numbers count as one if allowed
  const countTokens = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return { words: 0, hasInvalidNumber: false };
    const tokens = trimmed.split(/\s+/);
    let words = 0;
    let hasInvalidNumber = false;
    for (const token of tokens) {
      const isNumber = /^\d+([.,]\d+)?$/.test(token);
      if (isNumber) {
        if (allowNumber) {
          words += 1;
        } else {
          // Still count it but flag invalid so the UI can warn
          words += 1;
          hasInvalidNumber = true;
        }
        continue;
      }
      // Treat hyphenated compound as one word
      const isWord = /^[A-Za-z]+(?:-[A-Za-z]+)*$/.test(token);
      if (isWord) {
        words += 1;
        continue;
      }
      // Any other token (symbols etc.) does not increase count
    }
    return { words, hasInvalidNumber };
  };

  const raw: string = group?.structure || "";
  const normalized = raw.replace(/<strong>\((\d+)\)_____<\/strong>/g, "($1)_____");
  // Don't strip div/p if it's a note-style completion
  const isNotes = group?.completion_type === "notes" || group?.type === "note-completion";
  const stripped = isNotes
    ? normalized
    : normalized.replace(/<\/?div[^>]*>/g, "").replace(/<\/?p[^>]*>/g, "");

  const parts = stripped.split(/(\(\d+\)_____)/g);
  let gapIndex = 0;

  return (
    <div className="space-y-2">
      {group?.word_limit && !isNotes && (
        <p className="text-xs italic text-gray-500">{group.word_limit}</p>
      )}
      <div className={`${isNotes ? 'completion-notes' : 'bg-gray-50 dark:bg-gray-800 p-3 rounded'} relative z-0`}>
        <div className={`${isNotes ? '' : `${getFontSizeClass()} leading-6`}`}>
          {parts.map((part: string, idx: number) => {
            const match = part.match(/^\((\d+)\)_____$/);
            if (match) {
              const labelNum = match[1];
              const q = Array.isArray(group?.questions) ? group.questions[gapIndex++] : null;
              const qid = q?.id as number | undefined;
              const value = (qid ? (answers[qid] || "") : "") as string;
              const { words, hasInvalidNumber } = countTokens(value);
              const exceeded = words > maxWords;
              return (
                <span
                  key={`gap-${idx}`}
                  className="inline-flex items-center gap-1 mx-1 align-baseline relative z-10 pointer-events-auto"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className={isNotes ? "text-base font-bold mr-1" : "text-[10px] text-gray-500"}>{labelNum})</span>
                  <input
                    type="text"
                    tabIndex={0}
                    disabled={!!result}
                    className={isNotes
                      ? `bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-dotted border-slate-400 focus:border-blue-500 focus:border-solid transition-all ${getInputSizeClass()} px-1`
                      : `px-2 py-1 border rounded ${getFontSizeClass()} w-32 bg-white dark:bg-gray-900 focus:ring-2 relative z-20 pointer-events-auto focus:outline-none ${exceeded || hasInvalidNumber ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`
                    }
                    style={isNotes ? { borderRadius: 0, paddingBottom: 2 } : {}}
                    value={value}
                    ref={(el) => {
                      if (qid != null) summaryInputRefs.current[qid] = el;
                    }}
                    onFocus={(e) => {
                      e.stopPropagation();
                      if (qid != null) summaryInputRefs.current[qid] = e.target;
                    }}
                    onChange={(e) => {
                      if (qid) {
                        handleAnswerChange(qid, e.target.value);
                        requestAnimationFrame(() => summaryInputRefs.current[qid]?.focus());
                      }
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      e.currentTarget.focus();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.currentTarget.focus();
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyUp={(e) => e.stopPropagation()}
                  />
                  {!result && !isNotes && (
                    <span
                      className={`text-[10px] ${exceeded || hasInvalidNumber ? 'text-red-600' : 'text-gray-500'
                        }`}
                      title={
                        hasInvalidNumber && !allowNumber
                          ? 'Numbers are not allowed for this question'
                          : ''
                      }
                    >
                      {words}/{maxWords}
                    </span>
                  )}
                </span>
              );
            }
            return <span key={`txt-${idx}`} dangerouslySetInnerHTML={{ __html: sanitizeHtml(part) }} />;
          })}
        </div>
      </div>
    </div>
  );
}

// Table Completion component
function TableCompletion({
  group,
  answers,
  result,
  setAnswers,
  textSize = 'regular'
}: {
  group: TableCompletionQuestion;
  answers: Record<number, string>;
  result: any;
  setAnswers: (setter: (prev: Record<number, string>) => Record<number, string>) => void;
  textSize?: TextSizeOption;
}) {
  const getFontSizeClass = () => {
    if (textSize === 'large') return 'text-lg';
    if (textSize === 'extra-large') return 'text-xl';
    return 'text-sm';
  };
  const wordLimit = parseInt(group.word_limit.match(/\d+/)?.[0] || "2");

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCellState = (gapNumber: number) => {
    const answer = answers[gapNumber] || "";
    const wordCount = countWords(answer);

    if (result) {
      const correctAnswer = group.questions.find(q => q.gap_number === gapNumber)?.correctAnswer || "";
      return answer.trim().toLowerCase() === correctAnswer.toLowerCase() ? 'correct' : 'incorrect';
    }

    if (!answer) return 'empty';
    if (wordCount > wordLimit) return 'exceeded';
    return 'filled';
  };

  return (
    <div className="space-y-4">
      {/* Sticky Instructions */}
      <div className="sticky top-0 z-10 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 shadow-sm">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
          {group.instructions}
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
          {group.word_limit}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
          {/* Headers */}
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              {group.headers.map((header, idx) => (
                <th key={idx} className={`border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold ${getFontSizeClass()}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {group.rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                {row.cells.map((cell, cellIdx) => (
                  <td key={cellIdx} className="border border-gray-300 dark:border-gray-600 p-3">
                    {cell.type === 'text' ? (
                      <span className={getFontSizeClass()}>{cell.content}</span>
                    ) : (
                      <div className="space-y-1">
                        <Input
                          value={answers[cell.gapNumber!] || ""}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setAnswers(prev => ({
                              ...prev,
                              [cell.gapNumber!]: newValue
                            }));
                          }}
                          disabled={!!result}
                          placeholder={`Gap ${cell.gapNumber}`}
                          className={`
                            ${getCellState(cell.gapNumber!) === 'empty' ? 'border-gray-300' : ''}
                            ${getCellState(cell.gapNumber!) === 'filled' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}
                            ${getCellState(cell.gapNumber!) === 'exceeded' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                            ${getCellState(cell.gapNumber!) === 'correct' ? 'border-green-500 bg-green-100 dark:bg-green-900/40' : ''}
                            ${getCellState(cell.gapNumber!) === 'incorrect' ? 'border-red-500 bg-red-100 dark:bg-red-900/40' : ''}
                          `}
                        />
                        {/* Word count indicator */}
                        {answers[cell.gapNumber!] && (
                          <p className={`text-xs ${countWords(answers[cell.gapNumber!]) > wordLimit
                            ? 'text-red-600 dark:text-red-400 font-semibold'
                            : 'text-gray-500'
                            }`}>
                            {countWords(answers[cell.gapNumber!])} / {wordLimit} words
                          </p>
                        )}
                        {/* Show correct answer in review mode */}
                        {result && getCellState(cell.gapNumber!) === 'incorrect' && (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Correct: {cell.correctAnswer}
                          </p>
                        )}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// FlowChart Completion Component
interface FlowChartNode {
  id: string;
  type: 'stage' | 'gap' | 'decision';
  content?: string;
  gapNumber?: number;
  correctAnswer?: string;
  position?: number;
}

interface FlowChartConnection {
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'dashed';
}

interface FlowChartStructure {
  title: string;
  orientation: 'vertical' | 'horizontal';
  nodes: FlowChartNode[];
  connections: FlowChartConnection[];
}

interface FlowChartCompletionQuestion {
  id: number;
  type: 'flow-chart-completion';
  title: string;
  instructions: string;
  word_limit: string;
  flow_chart: FlowChartStructure;
  questions: Array<{
    id: number;
    gap_number: number;
    correctAnswer: string;
    explanation?: string;
  }>;
}

function FlowChartCompletion({
  group,
  answers,
  result,
  setAnswers,
  textSize = 'regular'
}: {
  group: FlowChartCompletionQuestion;
  answers: Record<number, string>;
  result: any;
  setAnswers: (setter: (prev: Record<number, string>) => Record<number, string>) => void;
  textSize?: TextSizeOption;
}) {
  const getFontSizeClass = () => {
    if (textSize === 'large') return 'text-lg';
    if (textSize === 'extra-large') return 'text-xl';
    return 'text-sm';
  };
  const getSmallFontSizeClass = () => {
    if (textSize === 'large') return 'text-sm';
    if (textSize === 'extra-large') return 'text-base';
    return 'text-[10px]';
  };
  const wordLimit = parseInt(group.word_limit.match(/\d+/)?.[0] || "2");

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getNodeState = (gapNumber: number) => {
    const answer = answers[gapNumber] || "";
    const wordCount = countWords(answer);

    if (result) {
      const correctAnswer = group.questions.find(q => q.gap_number === gapNumber)?.correctAnswer || "";
      return answer.trim().toLowerCase() === correctAnswer.toLowerCase() ? 'correct' : 'incorrect';
    }

    if (!answer) return 'empty';
    if (wordCount > wordLimit) return 'exceeded';
    return 'filled';
  };

  // Sort nodes by position for linear display
  const sortedNodes = [...group.flow_chart.nodes].sort((a, b) => (a.position || 0) - (b.position || 0));

  // Find connection between two nodes
  const getConnection = (fromNodeId: string) => {
    return group.flow_chart.connections.find(conn => conn.from === fromNodeId);
  };

  return (
    <div className="space-y-4">
      {/* Sticky Instructions Banner */}
      <div className="sticky top-0 z-10 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-4 shadow-sm">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
          {group.instructions}
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
          {group.word_limit}
        </p>
      </div>

      {/* Flow Chart Title */}
      {group.flow_chart.title && (
        <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white">
          {group.flow_chart.title}
        </h3>
      )}

      {/* Flow Chart Container */}
      <div
        className={`flex ${group.flow_chart.orientation === 'horizontal' ? 'flex-row overflow-x-auto' : 'flex-col'} items-center gap-3 p-4`}
        role="figure"
        aria-label={`Flow chart: ${group.flow_chart.title}`}
      >
        {sortedNodes.map((node, index) => {
          const connection = getConnection(node.id);

          return (
            <div key={node.id} className="flex flex-col items-center w-full max-w-md">
              {/* Node Box */}
              {node.type === 'stage' ? (
                // Stage Node - Filled box
                <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700/50 p-3 bg-gray-50/50 dark:bg-gray-800/50 shadow-sm">
                  <p className={`text-center text-gray-900 dark:text-white ${getFontSizeClass()}`}>
                    {node.content}
                  </p>
                </div>
              ) : node.type === 'gap' ? (
                // Gap Node - Input box with content
                <div className="w-full space-y-2">
                  <div className="relative">
                    {/* Gap Number Badge */}
                    <div className="absolute -top-2 -left-3 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold shadow-md z-10">
                      {node.gapNumber}
                    </div>

                    {node.content ? (
                      // If content exists, display it with inline gap
                      <div className="border border-gray-200 dark:border-gray-700/50 rounded-lg p-3 bg-gray-50/50 dark:bg-gray-800/50">
                        <div className={`${getFontSizeClass()} text-gray-900 dark:text-white leading-relaxed`}>
                          {node.content.split('__________').map((part, idx, arr) => (
                            <React.Fragment key={`part-${idx}`}>
                              {part}
                              {idx < arr.length - 1 && (
                                <input
                                  type="text"
                                  value={answers[node.gapNumber!] || ""}
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    setAnswers(prev => ({
                                      ...prev,
                                      [node.gapNumber!]: newValue
                                    }));
                                  }}
                                  disabled={!!result}
                                  placeholder="..."
                                  aria-label={`Question ${node.gapNumber}: Enter answer`}
                                  className={`
                                  inline-block w-28 h-6 px-1 mx-1 -translate-y-[1px] align-middle transition-all
                                  bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-dotted
                                  ${getNodeState(node.gapNumber!) === 'empty' ? 'border-slate-400 dark:border-slate-500' : ''}
                                  ${getNodeState(node.gapNumber!) === 'filled' ? 'border-green-500 bg-green-50/20' : ''}
                                  ${getNodeState(node.gapNumber!) === 'exceeded' ? 'border-red-500 bg-red-50/20' : ''}
                                  ${getNodeState(node.gapNumber!) === 'correct' ? 'border-green-600 bg-green-100/20' : ''}
                                  ${getNodeState(node.gapNumber!) === 'incorrect' ? 'border-red-600 bg-red-100/20' : ''}
                                  focus:border-blue-500 focus:border-solid focus:ring-0 focus:outline-none rounded-none
                                  ${getFontSizeClass()} text-center
                                `}
                                />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Fallback: standalone input (backward compatibility)
                      <Input
                        value={answers[node.gapNumber!] || ""}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setAnswers(prev => ({
                            ...prev,
                            [node.gapNumber!]: newValue
                          }));
                        }}
                        disabled={!!result}
                        placeholder="Type your answer..."
                        aria-label={`Question ${node.gapNumber}: Enter answer`}
                        className={`
                          w-full px-4 py-2 text-center transition-all bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-dotted
                          ${getNodeState(node.gapNumber!) === 'empty' ? 'border-slate-400 dark:border-slate-500' : ''}
                          ${getNodeState(node.gapNumber!) === 'filled' ? 'border-green-500 bg-green-50/20 shadow-sm' : ''}
                          ${getNodeState(node.gapNumber!) === 'exceeded' ? 'border-red-500 bg-red-50/20' : ''}
                          ${getNodeState(node.gapNumber!) === 'correct' ? 'border-green-600 bg-green-100/20' : ''}
                          ${getNodeState(node.gapNumber!) === 'incorrect' ? 'border-red-600 bg-red-100/20' : ''}
                          focus:border-blue-500 focus:border-solid focus:ring-0 focus:outline-none rounded-none
                        `}
                      />
                    )}
                  </div>

                  {/* Word Count Indicator */}
                  {answers[node.gapNumber!] && !result && (
                    <div className="flex justify-center">
                      <p className={`text-xs font-medium ${countWords(answers[node.gapNumber!]) > wordLimit
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-green-600 dark:text-green-400'
                        }`}>
                        {countWords(answers[node.gapNumber!])} / {wordLimit} words
                        {countWords(answers[node.gapNumber!]) > wordLimit && ' - Exceeds limit!'}
                      </p>
                    </div>
                  )}

                  {/* Review Mode - Show Correct Answer */}
                  {result && getNodeState(node.gapNumber!) === 'incorrect' && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-sm">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Your answer:</p>
                        <p className="text-sm text-red-600 dark:text-red-400 line-through">
                          {answers[node.gapNumber!]}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Correct answer:</p>
                        <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                          {node.correctAnswer}
                        </p>
                      </div>
                    </div>
                  )}

                  {result && getNodeState(node.gapNumber!) === 'correct' && (
                    <div className="flex justify-center">
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                        <span className="text-base">✓</span> Correct!
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // Decision Node - Diamond shape (future enhancement)
                <div className="w-full rounded-lg border-2 border-yellow-500 p-4 bg-yellow-50 dark:bg-yellow-900/20 shadow-sm">
                  <p className="text-sm text-center text-gray-900 dark:text-white font-semibold">
                    {node.content}
                  </p>
                </div>
              )}

              {/* Connection Arrow (if not last node) */}
              {connection && (
                <div className="flex flex-col items-center my-2">
                  {connection.label && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 italic mb-1">
                      {connection.label}
                    </span>
                  )}
                  <div className={`text-2xl ${connection.style === 'dashed' ? 'opacity-50' : ''} text-blue-600 dark:text-blue-400`}>
                    {group.flow_chart.orientation === 'horizontal' ? '→' : '↓'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Explanations in Review Mode */}
      {result && (
        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">Explanations:</h4>
          {group.questions.map((q) => {
            const isCorrect = getNodeState(q.gap_number) === 'correct';
            return (
              <details key={q.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                <summary className="cursor-pointer font-medium text-sm flex items-center gap-2">
                  <span className={`${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    Q{q.gap_number}: {isCorrect ? '✓' : '✗'}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">View Explanation</span>
                </summary>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 pl-4">
                  <p className="font-medium">Correct answer: <span className="text-green-600">{q.correctAnswer}</span></p>
                  {q.explanation && (
                    <p className="mt-1">{q.explanation}</p>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}

type TextSizeOption = 'regular' | 'large' | 'extra-large';
const TEXT_SIZE_LABELS: Record<TextSizeOption, string> = { regular: 'Regular', large: 'Large', 'extra-large': 'Extra large' };
const TEXT_SIZE_CLASSES: Record<TextSizeOption, string> = {
  regular: 'prose prose-lg max-w-none dark:prose-invert leading-relaxed',
  large: 'prose prose-xl max-w-none dark:prose-invert leading-relaxed [&_p]:text-xl [&_p]:leading-[1.9]',
  'extra-large': 'prose prose-2xl max-w-none dark:prose-invert leading-relaxed [&_p]:text-2xl [&_p]:leading-[2]',
};

const MOCK_USER = { id: "preview", email: "student@newband.ai", name: "Student", plan: "free" } as any;

export default function ReadingPractice({ isPreview = false }: { isPreview?: boolean }) {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [highlightsBySlide, setHighlightsBySlide] = useState<Record<number, Highlight[]>>({});
  const [questionHighlights, setQuestionHighlights] = useState<Record<number, Highlight[]>>({});

  const [selectedTestIndex, setSelectedTestIndex] = useState<number | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(60 * 60);
  const [aiFeedback, setAIFeedback] = useState<Record<number, any>>({});
  const [loadingFeedback, setLoadingFeedback] = useState<Set<number>>(new Set());
  const [showEvidenceHighlights, setShowEvidenceHighlights] = useState(true);

  // Text size preference (persisted to localStorage)
  const [textSize, setTextSize] = useState<TextSizeOption>(() => {
    const saved = localStorage.getItem('reading-text-size');
    return (saved === 'large' || saved === 'extra-large') ? saved : 'regular';
  });
  const [showTextSizeMenu, setShowTextSizeMenu] = useState(false);
  const textSizeRefNormal = useRef<HTMLDivElement>(null);
  const textSizeRefSplit = useRef<HTMLDivElement>(null);

  const getQuestionTextSize = () => {
    if (textSize === 'large') return 'text-xl font-medium leading-[1.8]';
    if (textSize === 'extra-large') return 'text-2xl font-medium leading-[1.9]';
    return 'text-lg font-medium leading-relaxed';
  };

  const getFontSizeClass = () => {
    if (textSize === 'large') return 'text-lg';
    if (textSize === 'extra-large') return 'text-xl';
    return 'text-sm';
  };

  const getInputSizeClass = () => {
    if (textSize === 'large') return 'text-lg w-44 h-10';
    if (textSize === 'extra-large') return 'text-xl w-52 h-12';
    return 'text-sm w-32 h-8';
  };

  const getLabelSizeClass = () => {
    if (textSize === 'large') return 'text-lg font-medium leading-relaxed';
    if (textSize === 'extra-large') return 'text-xl font-medium leading-relaxed';
    return 'text-base font-medium leading-relaxed';
  };

  const getRadioSizeClass = () => {
    if (textSize === 'large') return 'w-5 h-5';
    if (textSize === 'extra-large') return 'w-6 h-6';
    return 'w-4 h-4';
  };

  // Persist text size and close menu on outside click
  useEffect(() => {
    localStorage.setItem('reading-text-size', textSize);
  }, [textSize]);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (textSizeRefNormal.current && !textSizeRefNormal.current.contains(target) &&
        textSizeRefSplit.current && !textSizeRefSplit.current.contains(target)) {
        setShowTextSizeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Draggable split panel ratio (persisted to localStorage)
  const [splitRatio, setSplitRatio] = useState<number>(() => {
    const saved = parseFloat(localStorage.getItem('reading-split-ratio') || '');
    return (saved >= 25 && saved <= 75) ? saved : 50;
  });
  const [isDragging, setIsDragging] = useState(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('reading-split-ratio', String(splitRatio));
  }, [splitRatio]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.min(75, Math.max(25, (x / rect.width) * 100));
      setSplitRatio(pct);
    };
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);
  const { user: authUser } = useUser();
  const user = isPreview ? MOCK_USER : authUser;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const summaryInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // Per-question highlights helpers (keep question highlights isolated by id)
  const EMPTY_HIGHLIGHTS: Highlight[] = [];
  const getQHighlights = (qid: number) => questionHighlights[qid] || EMPTY_HIGHLIGHTS;
  const setQHighlightsFor = (qid: number) => (hs: Highlight[]) =>
    setQuestionHighlights(prev => ({ ...prev, [qid]: hs }));

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Convert number to uppercase Roman numerals
  const toRomanNumeral = (num: number): string => {
    const romanMap: [number, string][] = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let result = '';
    for (const [value, symbol] of romanMap) {
      while (num >= value) {
        result += symbol;
        num -= value;
      }
    }
    return result;
  };

  // Helpers for sentence-completion word limits (IELTS rules)
  const parseSentenceWordLimit = (ruleText?: string) => {
    const text = (ruleText || "").toUpperCase();
    let maxWords = 2;
    if (text.includes("ONE WORD")) maxWords = 1;
    else if (text.includes("TWO WORD")) maxWords = 2;
    else if (text.includes("THREE WORD")) maxWords = 3;
    else {
      const n = parseInt((text.match(/\d+/)?.[0] as string) || "", 10);
      if (!isNaN(n)) maxWords = n;
    }
    const allowNumber = text.includes("NUMBER");
    return { maxWords, allowNumber };
  };

  const countAnswerTokens = (value: string, allowNumber: boolean) => {
    const trimmed = (value || "").trim();
    if (!trimmed) return { words: 0, hasInvalidNumber: false };
    const tokens = trimmed.split(/\s+/);
    let words = 0;
    let hasInvalidNumber = false;
    for (const token of tokens) {
      const isNumber = /^\d+([.,]\d+)?$/.test(token);
      if (isNumber) {
        if (!allowNumber) hasInvalidNumber = true;
        words += 1;
        continue;
      }
      const isWord = /^[A-Za-z]+(?:-[A-Za-z]+)*$/.test(token);
      if (isWord) {
        words += 1;
      }
    }
    return { words, hasInvalidNumber };
  };

  // Fetch available tests
  const { data: testsData } = useQuery({
    queryKey: ["reading-tests"],
    queryFn: () => backend.ielts.getReadingTests(),
  });

  const { data: usageLimits, refetch: refetchUsage } = useQuery({
    queryKey: ["usage-limits", user?.id],
    queryFn: () => user?.id ? backend.ielts.getEssayLimits(user.id) : Promise.resolve(null),
    enabled: !!user?.id,
  });

  const { id: urlId } = useParams<{ id: string }>();

  // Selected test id (initialize after tests list loads)
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

  // Use the enterTest helper which is defined later, but since it depends on state, we might need to inline its logic or move it.
  // Actually, we can just set the states that enterTest sets.

  // When test list arrives, handle deep linking or default selection
  useEffect(() => {
    if (testsData?.tests && testsData.tests.length > 0) {
      if (urlId) {
        const testIdNum = parseInt(urlId, 10);
        if (!isNaN(testIdNum)) {
          const testIndex = testsData.tests.findIndex((t: any) => t.testId === testIdNum);
          if (testIndex !== -1 && selectedTestId !== testIdNum) {
            console.log("🔗 [DEBUG] Deep linking to reading test ID:", testIdNum);
            setSelectedTestId(testIdNum);
            // We need to trigger the test start logic. 
            // enterTest(0) sets selectedTestIndex to 0.
            setRemainingSeconds(60 * 60);
            setStartTime(Date.now());
            setSelectedTestIndex(0);
            setActiveSlideIndex(0);
            setAnswers({});
            setResult(null);
            setHighlightsBySlide({});
            return;
          }
        }
      }

      // Default selection if nothing selected and no URL ID
      if (!selectedTestId && !selectedTestIndex) {
        setSelectedTestId(testsData.tests[0].testId);
      }
    }
  }, [testsData?.tests, selectedTestId, urlId]);

  // Fetch specific test
  const { data: testData, isLoading, isError, error, refetch: refetchPassage } = useQuery({
    queryKey: ["reading-test", selectedTestId],
    queryFn: () => backend.ielts.getReadingTestById(selectedTestId as number),
    enabled: selectedTestId != null,
  });

  // Tests list and selected passage
  const tests = testData?.passages || [];
  const totalEstimatedMinutes = Array.isArray(tests)
    ? tests.reduce((sum: number, p: any) => sum + (p?.estimatedTime || 20), 0)
    : 60;
  const passage = selectedTestIndex != null ? tests[activeSlideIndex] : undefined;

  const enterTest = (idx: number) => {
    if (isPreview) {
      setShowSignupModal(true);
      return;
    }
    setRemainingSeconds(60 * 60);
    setStartTime(Date.now());
    setSelectedTestIndex(idx);
    setActiveSlideIndex(0);
    setAnswers({});
    setResult(null);
    setHighlightsBySlide({});
  };

  const backToMenu = () => {
    setSelectedTestIndex(null);
    setActiveSlideIndex(0);
    setAnswers({});
    setResult(null);
    setHighlightsBySlide({});
    setRemainingSeconds(60 * 60);
    setStartTime(null);
  };

  const handleGetAIFeedback = async (questionId: number, question: any, studentAnswer: string, correctAnswer: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to use AI feedback.",
        variant: "destructive"
      });
      return;
    }
    setLoadingFeedback(prev => new Set(prev).add(questionId));

    try {
      const passageText = passage?.paragraphs?.map(p => p.text).join('\n\n') || "";
      const questionText = question.questionText || question.sentenceBeginning || "";
      const questionType = question.type || "Multiple Choice";

      // Debug info to help track 422 issues
      console.log("Building AI Feedback request:", {
        passageLength: passageText.length,
        questionLength: questionText.length,
        questionType,
        hasCorrectAnswer: !!correctAnswer,
        hasStudentAnswer: !!studentAnswer,
        correctAnswer,
        studentAnswer,
      });

      // Basic client-side validation to avoid obvious 422s
      if (!passageText || passageText.length < 50) {
        throw new Error(`Passage is too short (${passageText.length} characters, need at least 50).`);
      }
      if (!questionText || questionText.length < 5) {
        throw new Error(`Question text is too short (${questionText.length} characters, need at least 5).`);
      }
      if (!correctAnswer) {
        throw new Error("Correct answer is missing for this question.");
      }
      if (!studentAnswer) {
        throw new Error("You need to submit an answer before requesting AI feedback.");
      }

      const feedback = await getAIFeedback({
        userId: user.id,
        passage: passageText,
        question: questionText,
        question_type: questionType,
        correct_answer: correctAnswer,
        student_answer: studentAnswer,
      });

      setAIFeedback(prev => ({
        ...prev,
        [questionId]: feedback,
      }));

      toast({
        title: "AI Feedback Ready",
        description: "Scroll down to see detailed feedback",
      });

      // Refresh usage after credit consumption
      refetchUsage();
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      toast({
        title: "AI Feedback Error",
        description: error instanceof Error ? error.message : "Failed to get AI feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingFeedback(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
  };

  // Build a flat list of questions for rendering and results
  const flatPassageQuestions = Array.isArray(passage?.questions)
    ? passage!.questions.flatMap((group: any) =>
      Array.isArray(group?.questions) ? group.questions : []
    )
    : [];

  // Collect all evidence quotes from current passage's questions
  const evidenceQuotes = useMemo(() => {
    if (!result || !passage?.questions) return [];

    const quotes: Array<{ quote: string; questionId: number }> = [];
    passage.questions.forEach((group: any) => {
      if (Array.isArray(group?.questions)) {
        group.questions.forEach((q: any) => {
          if (q.evidenceQuote) {
            quotes.push({
              quote: q.evidenceQuote,
              questionId: q.id,
            });
          }
        });
      }
    });

    return quotes;
  }, [result, passage?.questions]);



  // Highlights are now stored per-slide, no clearing needed on slide change

  // Countdown timer: tick every second while a test is active; auto-submit at 0
  useEffect(() => {
    if (selectedTestIndex === null || !startTime) return;
    const id = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          // Auto-submit when timer hits zero
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [selectedTestIndex, startTime]);



  const submitReadingMutation = useMutation({
    mutationFn: backend.ielts.submitReading,
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      toast({
        title: "Reading submitted successfully!",
        description: `You scored ${data.score}/${data.totalQuestions}`,
      });
    },
    onError: (error) => {
      console.error("Failed to submit reading:", error);
      toast({
        title: "Error",
        description: "Failed to submit your answers. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!user || !tests || tests.length === 0 || !startTime) return;

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    // Collect all questions from all 3 slides
    const allQuestions = tests.flatMap((passage) =>
      Array.isArray(passage?.questions)
        ? passage.questions.flatMap((group: any) =>
          Array.isArray(group?.questions)
            ? group.questions.map((q: any) => ({
              id: q.id,
              type: group.type,
              questionText: q.questionText || q.sentenceBeginning || q.incompleteSentence || "",
              options: q.options
                ? (typeof q.options === 'object' && !Array.isArray(q.options)
                  ? Object.entries(q.options).map(([key, value]) => `${key}) ${value}`)
                  : q.options)
                : undefined,
              correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer,
            }))
            : []
        )
        : []
    );

    // Validate table-completion word limits
    const allTableGroups = tests.flatMap((passage) =>
      passage?.questions?.filter((g: any) => g.type === 'table-completion') || []
    );
    for (const group of allTableGroups) {
      const wordLimit = parseInt((group as any).word_limit?.match(/\d+/)?.[0] || "2");
      for (const q of (group as any).questions || []) {
        const answer = answers[q.gap_number] || "";
        const wordCount = answer.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
        if (wordCount > wordLimit) {
          toast({
            title: "Word Limit Exceeded",
            description: `Gap ${q.gap_number} exceeds the word limit (${wordCount}/${wordLimit} words)`,
            variant: "destructive"
          });
          return;
        }
      }
    }

    // Validate flow-chart-completion word limits
    const allFlowChartGroups = tests.flatMap((passage) =>
      passage?.questions?.filter((g: any) => g.type === 'flow-chart-completion') || []
    );
    for (const group of allFlowChartGroups) {
      const wordLimit = parseInt((group as any).word_limit?.match(/\d+/)?.[0] || "2");
      for (const q of (group as any).questions || []) {
        const answer = answers[q.gap_number] || "";
        const wordCount = answer.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
        if (wordCount > wordLimit) {
          toast({
            title: "Word Limit Exceeded",
            description: `Gap ${q.gap_number} exceeds the word limit (${wordCount}/${wordLimit} words)`,
            variant: "destructive"
          });
          return;
        }
      }
    }

    // Validate sentence-completion word limits
    const allSentenceGroups = tests.flatMap((passage) =>
      passage?.questions?.filter((g: any) => g.type === 'sentence-completion') || []
    );
    for (const group of allSentenceGroups) {
      const { maxWords, allowNumber } = parseSentenceWordLimit((group as any).word_limit);
      for (const q of (group as any).questions || []) {
        const answer = (answers[q.id] || "").trim();
        const { words, hasInvalidNumber } = countAnswerTokens(answer, allowNumber);
        if (words > maxWords || hasInvalidNumber) {
          toast({
            title: "Word Limit Error",
            description: `Sentence ${q.id} violates the rule (${words}/${maxWords}${hasInvalidNumber ? ', number not allowed' : ''})`,
            variant: "destructive"
          });
          return;
        }
      }
    }

    // Combine all passages content
    const allPassagesContent = tests.map(p => p.paragraphs?.map((par: any) => par.text).join("\n\n")).join("\n\n---\n\n");

    submitReadingMutation.mutate({
      userId: user.id,
      passageTitle: `${testData?.testName || 'Test'} - All Slides`,
      passageContent: allPassagesContent,
      questions: allQuestions,
      userAnswers: answers,
      timeTaken,
    });
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => {
      // If answer is empty string, remove the answer (for unselect functionality)
      if (answer === "") {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      }
      // Otherwise, set the new answer
      return { ...prev, [questionId]: answer };
    });
  };

  const getNewPassage = () => {
    refetchPassage();
  };

  const handleHighlightsChange = (newHighlights: Highlight[]) => {
    setHighlightsBySlide(prev => ({ ...prev, [activeSlideIndex]: newHighlights }));
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case "matching-headings":
        return (
          <div key={question.id} className="space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6 mb-4 last:border-0">
            <TextHighlighter
              content={String(question.questionText || "")}
              passageTitle={`${passage?.title || "Reading"} - Question`}
              highlights={getQHighlights(question.id)}
              onHighlightsChange={setQHighlightsFor(question.id)}
              showLabels={false} className={getQuestionTextSize()}
            />
            <Select
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              <div className="relative">
                <SelectTrigger className="w-full h-auto py-3 pl-4 pr-10 text-left bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                  <SelectValue placeholder="Select Heading..." />
                </SelectTrigger>
              </div>
              <SelectContent className="max-h-[300px]">
                {question.options?.map((option: any, index: number) => {
                  const optionValue = typeof option === 'object' ? option.letter : option;
                  const optionText = typeof option === 'object' ? option.text : option;
                  const roman = toRomanNumeral(index + 1);
                  return (
                    <SelectItem
                      key={index}
                      value={optionValue}
                      className="py-3 px-2 border-b border-slate-100 dark:border-slate-800 last:border-0 cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 font-bold text-blue-600 dark:text-blue-400 min-w-[24px] text-right">
                          {roman}.
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 leading-snug">
                          {optionText}
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        );

      case "multiple-choice":
        return (
          <div key={question.id} className="space-y-3">
            <TextHighlighter
              content={`${question.id}. ${String(question.questionText || "")}`}
              passageTitle={`${passage?.title || "Reading"} - Question`}
              highlights={getQHighlights(question.id)}
              onHighlightsChange={setQHighlightsFor(question.id)}
              showLabels={false} className={getQuestionTextSize()}
            />
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              {question.options?.map((option: any, index: number) => {
                const optionValue = typeof option === 'object' ? option.letter : option;
                const optionText = typeof option === 'object' ? `${option.letter}. ${option.text}` : option;
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-3 cursor-pointer p-1"
                    onClick={() => {
                      if (answers[question.id] === optionValue) {
                        handleAnswerChange(question.id, "");
                      }
                    }}
                  >
                    <div className="pt-0.5">
                      <RadioGroupItem value={optionValue} id={`q${question.id}-${index}`} className={getRadioSizeClass()} />
                    </div>
                    <Label htmlFor={`q${question.id}-${index}`} className={`${getLabelSizeClass()} cursor-pointer`}>
                      {optionText}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );

      case "true-false-not-given":
        return (
          <div key={question.id} className="space-y-3">
            <TextHighlighter
              content={`${question.id}. ${String(question.questionText || "")}`}
              passageTitle={`${passage?.title || "Reading"} - Question`}
              highlights={getQHighlights(question.id)}
              onHighlightsChange={setQHighlightsFor(question.id)}
              showLabels={false} className={getQuestionTextSize()}
            />
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
              className="inline-flex flex-wrap items-center gap-6 mt-2"
            >
              {question.options?.map((option: string) => (
                <div
                  key={option}
                  className="flex items-center space-x-3 cursor-pointer p-1"
                  onClick={() => {
                    if (answers[question.id] === option) {
                      handleAnswerChange(question.id, "");
                    }
                  }}
                >
                  <RadioGroupItem value={option} id={`q${question.id}-${option}`} className={getRadioSizeClass()} />
                  <Label htmlFor={`q${question.id}-${option}`} className={`${getLabelSizeClass()} cursor-pointer`}>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "gap-fill":
      case "fill-in-blank":
        {
          const text: string = question.questionText || "";
          const match = text.match(/_{3,}/);
          if (match) {
            const idx = match.index ?? -1;
            const before = text.slice(0, idx);
            const after = text.slice(idx + match[0].length);
            return (
              <div key={question.id} className="space-y-3">
                <TextHighlighter
                  content={`${question.id}. ${before}_____${after}`}
                  passageTitle={`${passage?.title || "Reading"} - Question`}
                  highlights={getQHighlights(question.id)}
                  onHighlightsChange={setQHighlightsFor(question.id)}
                  showLabels={false} className={getQuestionTextSize()}
                />
                <p className={getFontSizeClass()}>
                  {before}
                  <Input
                    placeholder={`Gap ${question.id}`}
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className={`inline-block align-baseline mx-1 ${getInputSizeClass()}`}
                  />
                  {after}
                </p>
              </div>
            );
          }
          return (
            <div key={question.id} className="space-y-3">
              <TextHighlighter
                content={`${question.id}. ${String(question.questionText || "")}`}
                passageTitle={`${passage?.title || "Reading"} - Question`}
                highlights={getQHighlights(question.id)}
                onHighlightsChange={setQHighlightsFor(question.id)}
                showLabels={false} className={getQuestionTextSize()}
              />
              <Input
                placeholder="Type your answer..."
                value={answers[question.id] || ""}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className={`max-w-md ${getInputSizeClass()}`}
              />
            </div>
          );
        }

      case "short-answer":
        return (
          <div key={question.id} className="space-y-3">
            <TextHighlighter
              content={`${question.id}. ${String(question.questionText || "")}`}
              passageTitle={`${passage?.title || "Reading"} - Question`}
              highlights={getQHighlights(question.id)}
              onHighlightsChange={setQHighlightsFor(question.id)}
              showLabels={false} className={getQuestionTextSize()}
            />
            <Input
              placeholder="Type your answer..."
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className={`max-w-md ${getInputSizeClass()}`}
            />
          </div>
        );

      case "sentence-completion":
        return (
          <div key={question.id} className="space-y-3">
            {/* Inline sentence with embedded gap input */}
            {(() => {
              const full = `${question.id}. ${String(question.questionText || question.sentenceBeginning || question.incompleteSentence || "")}`;
              const match = full.match(/_{3,}/);
              const hasGap = !!match;
              const before = hasGap ? full.slice(0, match!.index as number) : full;
              const after = hasGap ? full.slice((match!.index as number) + (match![0]?.length || 0)) : "";
              const ruleText = (question as any).groupWordLimit || (question as any).wordLimit;
              const { maxWords, allowNumber } = parseSentenceWordLimit(ruleText);
              const value = answers[question.id] || "";
              const { words, hasInvalidNumber } = countAnswerTokens(value, allowNumber);
              const exceeded = words > maxWords;
              return (
                <div className={`${getFontSizeClass()} leading-6`}>
                  <span>{before}</span>
                  {hasGap ? (
                    <span className="inline-flex items-center gap-1 align-baseline">
                      <input
                        aria-label={`Gap ${question.id}`}
                        type="text"
                        disabled={!!result}
                        className={`px-1 border-b bg-transparent focus:outline-none ${getInputSizeClass()} ${exceeded || hasInvalidNumber ? 'border-red-500' : 'border-gray-400 focus:border-gray-700'
                          }`}
                        value={value}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      />
                      <span className={`text-[10px] ${exceeded || hasInvalidNumber ? 'text-red-600' : 'text-gray-500'}`}>
                        {words}/{maxWords}{hasInvalidNumber ? ' • Number not allowed' : ''}
                      </span>
                    </span>
                  ) : (
                    <Input
                      placeholder="Type your answer..."
                      value={value}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className={`${(exceeded || hasInvalidNumber) ? 'border-red-500' : ''} max-w-md inline-block ml-2 ${getInputSizeClass()}`}
                    />
                  )}
                  <span>{after}</span>
                </div>
              );
            })()}
            {question.options ? (
              // Multiple-choice style sentence completion (matching sentence endings)
              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                className="inline-flex flex-wrap items-center gap-2"
              >
                {Object.entries(question.options).map(([key, value]: [string, any]) => (
                  <div
                    key={key}
                    className="flex items-start space-x-3 cursor-pointer p-1"
                    onClick={() => {
                      if (answers[question.id] === key) {
                        handleAnswerChange(question.id, "");
                      }
                    }}
                  >
                    <div className="pt-0.5">
                      <RadioGroupItem value={key} id={`q${question.id}-${key}`} className={getRadioSizeClass()} />
                    </div>
                    <Label htmlFor={`q${question.id}-${key}`} className={`${getLabelSizeClass()} font-medium cursor-pointer leading-relaxed`}>
                      <strong>{key}.</strong> {value}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : null}
          </div>
        );

      default:
        return null;
    }
  };

  // Current slide questions count
  const totalQuestions = Array.isArray(passage?.questions)
    ? passage!.questions.reduce((total: number, group: any) => {
      const count = Array.isArray(group?.questions) ? group.questions.length : 0;
      return total + count;
    }, 0)
    : 0;

  // Get question IDs for current slide
  const currentSlideQuestionIds = Array.isArray(passage?.questions)
    ? passage!.questions.flatMap((group: any) =>
      Array.isArray(group?.questions) ? group.questions.map((q: any) => q.id) : []
    )
    : [];

  // Count answered questions on current slide only
  const answeredQuestionsCurrentSlide = currentSlideQuestionIds.filter(id => answers[id]).length;

  // Calculate total questions across all slides for submission validation
  const totalQuestionsAllSlides = tests.reduce((sum, passage) =>
    sum + (passage?.questions?.reduce((count: number, group: any) =>
      count + (group?.questions?.length || 0), 0) || 0), 0
  );
  const answeredQuestionsAllSlides = Object.keys(answers).length;

  const navigate = useNavigate();
  const [showBasics, setShowBasics] = useState(false);
  const [selectedTheory, setSelectedTheory] = useState<string | null>(null);

  // Learn Basics (Theory) data sourced from backend -> backend/data/reading-theory.json
  const { data: theoriesData, isLoading: loadingTheoryList } = useQuery({
    queryKey: ['reading-theories'],
    queryFn: async () => {
      const resp = await fetch(`${Local}/reading/theory`, { method: 'GET', cache: 'no-store' });
      return resp.json();
    },
    enabled: showBasics,
  });

  const { data: theoryContent, isLoading: loadingTheoryContent } = useQuery({
    queryKey: ['reading-theory', selectedTheory],
    queryFn: async () => {
      const resp = await fetch(`${Local}/reading/theory/${encodeURIComponent(selectedTheory!)}`, { method: 'GET', cache: 'no-store' });
      return resp.json();
    },
    enabled: showBasics && !!selectedTheory,
  });

  // Loading / Error states to prevent blank screens
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">Loading reading passage...</div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-red-600">
        Failed to load reading passage. {String((error as any)?.message || "")}
      </div>
    );
  }

  return (
    <>
      <div className={selectedTestIndex !== null ? `w-full mx-auto ${result ? "py-2" : ""}` : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-32"}>
        {/* Hero Section */}
        {!showBasics && selectedTestIndex === null && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 text-white shadow-xl">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-100 text-sm font-medium backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>New AI-Powered Feedback Available</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                  Master IELTS Reading
                </h1>
                <p className="text-lg text-blue-100 leading-relaxed">
                  Practice with authentic passages, get instant AI analysis, and track your improvements.
                  Highlight text to build your vocabulary as you read.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                    <BookOpen className="w-5 h-5 text-blue-200" />
                    <span className="font-medium">{testsData?.tests?.length || 0} Practice Tests</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                    <Clock className="w-5 h-5 text-blue-200" />
                    <span className="font-medium">60 Min / Test</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                    <GraduationCap className="w-5 h-5 text-blue-200" />
                    <span className="font-medium">Academic & General</span>
                  </div>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/10 rounded-2xl rotate-12 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                  <BookOpen className="w-16 h-16 text-white/90" />
                </div>
              </div>
            </div>
          </div>
        )}

        {showBasics && (
          <div className="space-y-6 mt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">📚 Reading Basics</h2>
                <p className="text-slate-600 dark:text-slate-400">Learn about IELTS Reading question types before you practice</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => { setShowBasics(false); setSelectedTheory(null); }}
              >
                Close
              </Button>
            </div>

            {!selectedTheory && (
              <div>
                {loadingTheoryList ? (
                  <div className="text-center py-8 text-slate-600">Loading theory list...</div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {theoriesData?.theories.map((theory: any) => (
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
                )}
              </div>
            )}

            {selectedTheory && (
              <div className="space-y-12">
                <button
                  onClick={() => setSelectedTheory(null)}
                  className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  ← Back to Theory List
                </button>

                {loadingTheoryContent ? (
                  <div className="text-center py-12 text-slate-600 dark:text-slate-400">Loading content...</div>
                ) : theoryContent ? (
                  <div className="space-y-12">
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
                            {theoryContent.example.headings.map((heading: string, idx: number) => (
                              <li key={idx} className="text-slate-700 dark:text-slate-300 pl-4">{heading}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {!theoryContent?.quiz && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Questions</h3>
                          {theoryContent.example.questions.map((q: any) => (
                            <div key={q.id} className="space-y-1">
                              <p className="text-slate-700 dark:text-slate-300">
                                {q.id}. {q.text}
                              </p>
                              {q.options && (
                                <ul className="ml-4 list-disc space-y-1 text-slate-600 dark:text-slate-400">
                                  {q.options.map((opt: string, idx: number) => (
                                    <li key={idx}>{opt}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {!theoryContent?.quiz && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Answers</h3>
                          <ul className="space-y-2">
                            {theoryContent.example.questions.map((q: any) => (
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
                      )}
                    </section>

                    {/* Divider */}
                    {(theoryContent.commonMistakes?.length ?? 0) > 0 && (
                      <div className="h-px bg-slate-200/70 dark:bg-slate-700/50" />
                    )}

                    {/* 3. Common Mistakes */}
                    {(theoryContent.commonMistakes?.length ?? 0) > 0 && (
                      <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                          Common Mistakes
                        </h2>
                        <ul className="space-y-3">
                          {theoryContent.commonMistakes.map((mistake: any, idx: number) => (
                            <li key={idx} className="space-y-1">
                              <p className="font-medium text-slate-900 dark:text-slate-100">{mistake.title}</p>
                              <p className="text-slate-700 dark:text-slate-300">{mistake.description}</p>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {/* Divider */}
                    {(theoryContent.strategyTips?.length ?? 0) > 0 && (
                      <div className="h-px bg-slate-200/70 dark:bg-slate-700/50" />
                    )}

                    {/* 4. Strategy & Tips */}
                    {(theoryContent.strategyTips?.length ?? 0) > 0 && (
                      <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Strategy & Tips</h2>
                        <ol className="space-y-3">
                          {theoryContent.strategyTips.map((tip: any) => (
                            <li key={tip.step} className="space-y-1">
                              <p className="font-medium text-slate-900 dark:text-slate-100">
                                {tip.step}. {tip.title}
                              </p>
                              <p className="text-slate-700 dark:text-slate-300">{tip.description}</p>
                            </li>
                          ))}
                        </ol>
                      </section>
                    )}

                    {/* Divider */}
                    {theoryContent.timeManagement && (
                      <div className="h-px bg-slate-200/70 dark:bg-slate-700/50" />
                    )}

                    {/* 5. Time Management */}
                    {theoryContent.timeManagement && (
                      <section className="space-y-2">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Time Management</h2>
                        <p className="text-slate-700 dark:text-slate-300">
                          ⏱️ Spend {theoryContent.timeManagement.timePerQuestion}
                        </p>
                        <p className="text-slate-700 dark:text-slate-300">{theoryContent.timeManagement.tip}</p>
                      </section>
                    )}

                    {/* 6. Quick Quiz */}
                    {(() => {
                      const intro = ((theoryContent as any)?.Quiz?.questions ?? (theoryContent as any)?.introQuiz?.questions ?? []) as any[];
                      const normalizeMCQ = (q: any) => {
                        if (
                          q?.type === 'multiple-choice' &&
                          Array.isArray(q.options) &&
                          typeof q.correctAnswer === 'string' &&
                          /^[a-d]$/i.test(q.correctAnswer)
                        ) {
                          const idx = q.correctAnswer.toLowerCase().charCodeAt(0) - 97;
                          const correct = q.options[idx] ?? q.correctAnswer;
                          return { ...q, correctAnswer: correct };
                        }
                        return q;
                      };
                      const introFixed = intro.map(normalizeMCQ);
                      const main = (theoryContent?.quiz?.questions ?? []) as any[];
                      const merged = { passage: theoryContent?.quiz?.passage, questions: [...introFixed, ...main] };
                      return merged.questions.length > 0 ? (
                        <>
                          <div className="h-px bg-slate-200/70 dark:bg-slate-700/50" />
                          <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Quick Quiz</h2>
                            <ReadingTheoryQuiz quiz={merged} />
                          </section>
                        </>
                      ) : null;
                    })()}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* Test Selection Grid */}
        {!showBasics && selectedTestIndex === null && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Available Tests
              </h2>
              <div className="flex gap-2">
                <Badge variant="outline" className="px-3 py-1">All Levels</Badge>
                <Badge variant="outline" className="px-3 py-1">Academic</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {testsData?.tests?.map((test: any, index: number) => {
                // Mock difficulty for visual variety
                // Mock difficulty removed as per user request

                return (
                  <Card
                    key={test.testId}
                    onClick={() => {
                      startTransition(() => {
                        setSelectedTestId(test.testId);
                        setSelectedTestIndex(null);
                        setActiveSlideIndex(0);
                        setAnswers({});
                        setResult(null);
                        setHighlightsBySlide({});
                      });
                      setTimeout(() => enterTest(0), 50);
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Start ${test.testName}, 60 minutes, ${test.totalQuestions} questions`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        startTransition(() => {
                          setSelectedTestId(test.testId);
                          setSelectedTestIndex(null);
                          setActiveSlideIndex(0);
                          setAnswers({});
                          setResult(null);
                          setHighlightsBySlide({});
                        });
                        setTimeout(() => enterTest(0), 50);
                      }
                    }}
                    className="cursor-pointer group relative overflow-hidden transition-all duration-300 border h-full flex flex-col justify-between border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-md"
                  >
                    <CardHeader className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-900/20 dark:group-hover:text-blue-300 transition-colors duration-300">
                          <BookOpen className="w-8 h-8" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {test.testName}
                        </CardTitle>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed min-h-[2.5rem]">
                          Academic & General Training Practice Test
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="mt-auto pt-0">
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-6">
                        <div className="flex items-center gap-1.5 flex-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 justify-center">
                          <Clock className="w-3.5 h-3.5" />
                          <span>60 MIN</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 justify-center">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{test.totalQuestions} Qs</span>
                        </div>
                      </div>

                      <div className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md font-semibold h-11 pointer-events-none"
                        >
                          Start Test
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {selectedTestIndex !== null && passage && (
          <div className={`w-full animate-in fade-in duration-500 flex flex-col transition-all duration-300 ${result ? "" : "min-h-[calc(100vh-140px)] lg:h-[calc(100vh-100px)] max-w-full"}`}>
            <div className="flex items-center justify-start sm:justify-end mb-4 flex-none px-2 lg:px-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Text size selector for Normal View */}
                <div ref={textSizeRefNormal} className="relative z-50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTextSizeMenu(!showTextSizeMenu)}
                    className="flex items-center gap-1.5 h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    title="Text size"
                  >
                    <span className="text-base font-bold">Aa</span>
                    <span className="hidden sm:inline">{TEXT_SIZE_LABELS[textSize]}</span>
                  </Button>
                  {showTextSizeMenu && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                      <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Text size</span>
                      </div>
                      {(['regular', 'large', 'extra-large'] as TextSizeOption[]).map((option) => (
                        <button
                          key={option}
                          onClick={() => { setTextSize(option); setShowTextSizeMenu(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors
                            ${textSize === option
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                        >
                          <span className={option === 'extra-large' ? 'text-lg' : option === 'large' ? 'text-base' : 'text-sm'}>
                            {TEXT_SIZE_LABELS[option]}
                          </span>
                          {textSize === option && <CheckCircle className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {tests && tests.length > 1 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex flex-wrap gap-1" role="tablist" aria-label="Reading slides">
                      {tests.map((_: any, idx: number) => (
                        <Button
                          key={idx}
                          variant={activeSlideIndex === idx ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setActiveSlideIndex(idx);
                          }}
                          aria-pressed={activeSlideIndex === idx}
                          aria-label={`Show Slide ${idx + 1}`}
                          className="h-9 px-3"
                        >
                          Slide {idx + 1}
                        </Button>
                      ))}
                    </div>
                    <Badge variant="outline" className="text-xs h-9 px-3 flex items-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                      Overall: {answeredQuestionsAllSlides}/{totalQuestionsAllSlides}
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-center gap-2 mt-2 sm:mt-0 ml-auto sm:ml-0">
                  <Button variant="outline" size="sm" onClick={backToMenu} className="h-9 px-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    Back
                  </Button>
                  <Badge
                    variant="secondary"
                    className="font-mono flex items-center gap-1.5 text-sm sm:text-base md:text-lg h-9 px-3 sm:px-4"
                  >
                    <Clock className="h-4 w-4" />
                    {formatTime(remainingSeconds)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Split View Mode - Full Width Professional Layout */}
            <div 
              ref={splitContainerRef} 
              className="flex-1 min-h-0 flex flex-col lg:flex-row bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-slate-800"
              style={{ '--split-ratio': `${splitRatio}%` } as React.CSSProperties}
            >
              {/* Left Pane - Reading Passage */}
              <div className="w-full h-[400px] lg:h-full lg:w-[var(--split-ratio)] flex flex-col border-b border-gray-200 dark:border-gray-800 lg:border-b-0">
                {/* Header */}
                <div className="flex-shrink-0 px-4 sm:px-6 py-2 sm:py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="truncate">{passage.title}</span>
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
                    Select text to highlight, translate, or add to vocabulary.
                  </p>
                  {result && evidenceQuotes.length > 0 && (
                    <button
                      onClick={() => setShowEvidenceHighlights(!showEvidenceHighlights)}
                      className="mt-2 flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg
                                 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300
                                 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                    >
                      {showEvidenceHighlights ? (
                        <><Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Hide Evidence</>
                      ) : (
                        <><EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Show Evidence</>
                      )}
                    </button>
                  )}
                </div>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 relative">
                  <TextHighlighter
                    content={passage.paragraphs?.map((p: { text: string }) => p.text).join('\n\n') || ''}
                    passageTitle={passage.title}
                    highlights={highlightsBySlide[activeSlideIndex] || EMPTY_HIGHLIGHTS}
                    onHighlightsChange={handleHighlightsChange}
                    evidenceQuotes={evidenceQuotes}
                    showEvidenceHighlights={showEvidenceHighlights}
                    className={TEXT_SIZE_CLASSES[textSize]}
                  />
                </div>
              </div>

              {/* Draggable Divider (Vertical on LG, hidden on mobile) */}
              <div
                onMouseDown={() => setIsDragging(true)}
                className={`hidden lg:block relative flex-shrink-0 w-[2px] cursor-col-resize group z-30
                    ${isDragging
                    ? 'bg-blue-500 dark:bg-blue-400'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-500'
                  } transition-colors`}
              >
                {/* Invisible wider hit area for easier grabbing */}
                <div className="absolute inset-y-0 -left-2 -right-2" />
              </div>

              {/* Right Pane - Questions / Results */}
              <div className="w-full h-[500px] lg:h-full lg:w-[calc(100%-var(--split-ratio))] flex flex-col bg-slate-50 dark:bg-gray-900">
                {/* Header */}
                <div className="flex-shrink-0 px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{result ? 'Test Results' : 'Questions'}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {result ? `Score: ${result.score}/${result.totalQuestions} (${Math.round((result.score / result.totalQuestions) * 100)}% correct)` : 'Answer all questions based on the passage.'}
                  </p>
                </div>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {result ? (
                    /* Results View */
                    <div className="space-y-4">
                      <div className="text-center py-4">
                        <Badge className="mb-2 text-base px-4 py-1">Your Score</Badge>
                        <p className="text-4xl font-bold text-blue-700 dark:text-blue-300 my-2">
                          {result.score}/{result.totalQuestions}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {Math.round((result.score / result.totalQuestions) * 100)}% correct
                        </p>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">
                          Answer Review
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Green = Correct ✓ | Red = Incorrect ✗
                        </p>
                      </div>
                      <div className="space-y-2">
                        {tests.flatMap((passage) =>
                          Array.isArray(passage?.questions)
                            ? passage.questions.flatMap((group: any) =>
                              Array.isArray(group?.questions)
                                ? group.questions.map((q: any) => (
                                  <QuestionResult
                                    key={q.id}
                                    question={q}
                                    answer={answers[q.id] || ""}
                                    correctAnswer={result.correctAnswers[q.id]}
                                    explanation={result.explanations[q.id]}
                                    aiFeedback={aiFeedback[q.id]}
                                    onGetAIFeedback={() => handleGetAIFeedback(
                                      q.id,
                                      q,
                                      answers[q.id],
                                      result.correctAnswers[q.id]
                                    )}
                                    isLoadingFeedback={loadingFeedback.has(q.id)}
                                    remainingCredits={usageLimits?.readingCreditsRemaining}
                                    creditsLimit={usageLimits?.readingCreditsLimit}
                                    textSize={textSize}
                                  />
                                ))
                                : []
                            )
                            : []
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {Array.isArray(passage?.questions) ? (
                        passage!.questions.map((questionGroup: any, groupIdx: number) => (
                          <div key={`${activeSlideIndex}-${groupIdx}-${questionGroup.id}`} className="space-y-4 pb-6 border-b last:border-b-0">
                            <div className="pb-2">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{questionGroup.title}</h3>
                              <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed">{questionGroup.instructions}</p>

                              {/* Add explanation for TRUE/FALSE/NOT GIVEN question types */}
                              {questionGroup.type === 'true-false-not-given' && (
                                <div className="mt-2 p-2 border-l-4 border-blue-500 rounded">
                                  <h5 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">
                                    📘 How to answer {(() => {
                                      const firstCorrectAnswer = questionGroup.questions?.[0]?.correctAnswer;
                                      return (firstCorrectAnswer === 'TRUE' || firstCorrectAnswer === 'FALSE') ? 'TRUE/FALSE' : 'YES/NO';
                                    })()}/NOT GIVEN:
                                  </h5>
                                  <div className="text-sm text-blue-800 dark:text-blue-200 space-y-0.5">
                                    <p><strong>{(() => {
                                      const firstCorrectAnswer = questionGroup.questions?.[0]?.correctAnswer;
                                      return (firstCorrectAnswer === 'TRUE' || firstCorrectAnswer === 'FALSE') ? 'TRUE' : 'YES';
                                    })()}:</strong> Agrees with the passage</p>
                                    <p><strong>{(() => {
                                      const firstCorrectAnswer = questionGroup.questions?.[0]?.correctAnswer;
                                      return (firstCorrectAnswer === 'TRUE' || firstCorrectAnswer === 'FALSE') ? 'FALSE' : 'NO';
                                    })()}:</strong> Contradicts the passage</p>
                                    <p><strong>NOT GIVEN:</strong> No information in the passage</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="space-y-4">
                              {questionGroup.type === "matching-headings" ? (
                                // Render matching-headings at GROUP level (split view)
                                <div className="space-y-3">
                                  {questionGroup.questions?.map((question: any) => {
                                    const selectedAnswer = answers[question.id] || "";
                                    const usedOptions = Object.entries(answers)
                                      .filter(([qId, _]) => Number(qId) !== question.id)
                                      .map(([_, ans]) => ans);

                                    return (
                                      <div key={question.id} className="space-y-1.5">
                                        <TextHighlighter
                                          content={String(question.questionText || "")}
                                          passageTitle={`${passage?.title || "Reading"} - Q${question.id}`}
                                          highlights={getQHighlights(question.id)}
                                          onHighlightsChange={setQHighlightsFor(question.id)}
                                          showLabels={false} className={getQuestionTextSize()}
                                        />
                                        <RadioGroup
                                          value={selectedAnswer}
                                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                                          className="space-y-1"
                                        >
                                          {question.options?.map((option: any, index: number) => {
                                            const optionValue = typeof option === 'object' ? option.letter : option;
                                            const optionText = typeof option === 'object' ? option.text : option;
                                            const isUsedElsewhere = usedOptions.includes(optionValue);
                                            return (
                                              <div
                                                key={index}
                                                className="flex items-start space-x-3 cursor-pointer p-1"
                                                onClick={() => {
                                                  if (selectedAnswer === optionValue) {
                                                    handleAnswerChange(question.id, "");
                                                  }
                                                }}
                                              >
                                                <div className="pt-0.5">
                                                  <RadioGroupItem
                                                    value={optionValue}
                                                    id={`split-q${question.id}-${index}`}
                                                    className={getRadioSizeClass()}
                                                    disabled={isUsedElsewhere}
                                                  />
                                                </div>
                                                <Label
                                                  htmlFor={`split-q${question.id}-${index}`}
                                                  className={`${getLabelSizeClass()} cursor-pointer ${isUsedElsewhere ? 'text-red-500 line-through opacity-50' : ''}`}
                                                >
                                                  <strong>{toRomanNumeral(index + 1)}.</strong> {optionText}
                                                </Label>
                                              </div>
                                            );
                                          })}
                                        </RadioGroup>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : questionGroup.type === "matching-features" ? (
                                <div className="space-y-4">
                                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    <h4 className="font-medium text-sm mb-2">List of People/Institutions:</h4>
                                    <div className="space-y-1">
                                      {questionGroup.features?.map((feature: any, idx: number) => (
                                        <div key={idx} className={getFontSizeClass()}>
                                          <strong>{feature.letter}.</strong> {feature.name}
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    {questionGroup.questions?.map((question: any) => (
                                      <div key={question.id} className="space-y-1.5">
                                        <TextHighlighter
                                          content={`${question.id}. ${String(question.questionText || "")}`}
                                          passageTitle={`${passage?.title || "Reading"} - Q${question.id}`}
                                          highlights={getQHighlights(question.id)}
                                          onHighlightsChange={setQHighlightsFor(question.id)}
                                          showLabels={false} className={getQuestionTextSize()}
                                        />
                                        <Input
                                          placeholder="Enter letter..."
                                          value={answers[question.id] || ""}
                                          onChange={(e) => handleAnswerChange(question.id, e.target.value.toUpperCase())}
                                          className="h-8 text-sm"
                                          maxLength={1}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : questionGroup.type === "matching-sentence-endings" ? (
                                <div className="space-y-4">
                                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    <h4 className="font-medium text-sm mb-2">Possible Endings:</h4>
                                    <div className="space-y-1">
                                      {questionGroup.sentence_endings?.map((ending: any, idx: number) => (
                                        <div key={idx} className={getFontSizeClass()}>
                                          <strong>{ending.letter}.</strong> {ending.text}
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    {questionGroup.questions?.map((question: any) => (
                                      <div key={question.id} className="space-y-1.5">
                                        <TextHighlighter
                                          content={`${question.id}. ${String(question.questionText || "")}`}
                                          passageTitle={`${passage?.title || "Reading"} - Q${question.id}`}
                                          highlights={getQHighlights(question.id)}
                                          onHighlightsChange={setQHighlightsFor(question.id)}
                                          showLabels={false} className={getQuestionTextSize()}
                                        />
                                        <RadioGroup
                                          value={answers[question.id] || ""}
                                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                                          className="inline-flex flex-wrap items-center gap-2"
                                        >
                                          {questionGroup.sentence_endings?.map((ending: any) => (
                                            <div
                                              key={ending.letter}
                                              className="flex items-start space-x-3 cursor-pointer p-1"
                                              onClick={() => {
                                                if (answers[question.id] === ending.letter) {
                                                  handleAnswerChange(question.id, "");
                                                }
                                              }}
                                            >
                                              <div className="pt-0.5">
                                                <RadioGroupItem value={ending.letter} id={`split-q${question.id}-${ending.letter}`} className={getRadioSizeClass()} />
                                              </div>
                                              <Label htmlFor={`split-q${question.id}-${ending.letter}`} className={`${getLabelSizeClass()} cursor-pointer`}>
                                                {ending.letter}
                                              </Label>
                                            </div>
                                          ))}
                                        </RadioGroup>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (questionGroup.type === "sentence-completion" && (questionGroup as any).structure) ? (
                                <SummaryCompletion
                                  group={questionGroup}
                                  answers={answers}
                                  result={result}
                                  handleAnswerChange={handleAnswerChange}
                                  summaryInputRefs={summaryInputRefs}
                                  textSize={textSize}
                                />
                              ) : questionGroup.type === "summary-completion" || (questionGroup.type === "note-completion" && questionGroup.structure) ? (
                                <SummaryCompletion
                                  group={questionGroup}
                                  answers={answers}
                                  result={result}
                                  handleAnswerChange={handleAnswerChange}
                                  summaryInputRefs={summaryInputRefs}
                                  textSize={textSize}
                                />
                              ) : questionGroup.type === "note-completion" ? (
                                <NoteCompletion
                                  group={questionGroup}
                                  answers={answers}
                                  result={result}
                                  onAnswerChange={handleAnswerChange}
                                  textSize={textSize}
                                />
                              ) : questionGroup.type === "table-completion" ? (
                                <TableCompletion
                                  group={questionGroup as any}
                                  answers={answers}
                                  result={result}
                                  setAnswers={setAnswers}
                                  textSize={textSize}
                                />
                              ) : questionGroup.type === "flow-chart-completion" ? (
                                <FlowChartCompletion
                                  group={questionGroup as any}
                                  answers={answers}
                                  result={result}
                                  setAnswers={setAnswers}
                                  textSize={textSize}
                                />
                              ) : questionGroup.type === "matching-information" ? (
                                // Render matching-information questions (split view)
                                <div className="space-y-3">
                                  {/* Paragraph Reference Box */}
                                  {questionGroup.paragraphs_list && (
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200">
                                      <h4 className={`font-semibold text-blue-900 dark:text-blue-100 mb-1 ${getLabelSizeClass()}`}>
                                        Paragraphs:
                                      </h4>
                                      <div className="flex gap-1 flex-wrap">
                                        {questionGroup.paragraphs_list.map((para: string) => (
                                          <span key={para} className={`${getFontSizeClass()} text-blue-800 dark:text-blue-200`}>
                                            {para}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Questions */}
                                  <div className="space-y-2">
                                    {questionGroup.questions?.map((q: any) => (
                                      <div key={q.id} className="flex items-start gap-2 p-2 border-l-2 border-gray-300">
                                        <span className={`font-medium min-w-[24px] ${getFontSizeClass()}`}>{q.id}.</span>
                                        <div className={`flex-1 ${getFontSizeClass()}`}>
                                          <TextHighlighter
                                            content={String(q.questionText || "")}
                                            passageTitle={`${passage?.title || "Reading"} - Q${q.id}`}
                                            highlights={getQHighlights(q.id)}
                                            onHighlightsChange={setQHighlightsFor(q.id)}
                                            showLabels={false} className={getQuestionTextSize()}
                                          />
                                        </div>
                                        <select value={answers[q.id] || ""} onChange={(e) => handleAnswerChange(q.id, e.target.value)} className={`px-3 py-2 border rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 ${getInputSizeClass()} leading-normal`} style={{ minHeight: "44px", minWidth: "160px", paddingBottom: "4px" }}
                                        >
                                          <option value="">Select...</option>
                                          {questionGroup.paragraphs_list?.map((para: string) => (
                                            <option key={para} value={para}>
                                              {para}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : questionGroup.type === "matching-features" ? (
                                // Render matching-features questions (split view)
                                <div className="space-y-3">
                                  {/* Display available features (people/institutions) */}
                                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    <h4 className="font-medium text-sm mb-2">List of People/Institutions:</h4>
                                    <div className="space-y-1">
                                      {questionGroup.features?.map((feature: any, idx: number) => (
                                        <div key={idx} className="text-sm">
                                          <strong>{feature.letter}.</strong> {feature.name}
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Statements to match */}
                                  <div className="space-y-3">
                                    {questionGroup.questions?.map((question: any) => (
                                      <div key={question.id} className="space-y-1.5">
                                        <h4 className={`font-medium ${getFontSizeClass()}`}>{question.id}. {question.questionText}</h4>
                                        <Input
                                          placeholder="Enter letter..."
                                          value={answers[question.id] || ""}
                                          onChange={(e) => handleAnswerChange(question.id, e.target.value.toUpperCase())}
                                          className={`max-w-xs ${getInputSizeClass()}`}
                                          maxLength={1}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : Array.isArray(questionGroup.questions) ? (
                                questionGroup.questions.map((question: any) => {
                                  const questionType = questionGroup.type;
                                  const questionOptions = questionType === 'true-false-not-given'
                                    ? (() => {
                                      const firstCorrectAnswer = questionGroup.questions?.[0]?.correctAnswer;
                                      if (firstCorrectAnswer === 'TRUE' || firstCorrectAnswer === 'FALSE') {
                                        return ["TRUE", "FALSE", "NOT GIVEN"];
                                      } else {
                                        return ["YES", "NO", "NOT GIVEN"];
                                      }
                                    })()
                                    : question.options;

                                  // Render compact question based on type
                                  switch (questionType) {
                                    case "matching-headings":
                                      return (
                                        <div key={question.id} className="space-y-2">
                                          <TextHighlighter
                                            content={String(question.questionText || "")}
                                            passageTitle={`${passage?.title || "Reading"} - Q${question.id}`}
                                            highlights={getQHighlights(question.id)}
                                            onHighlightsChange={setQHighlightsFor(question.id)}
                                            showLabels={false} className={getQuestionTextSize()}
                                          />
                                          <RadioGroup
                                            value={answers[question.id] || ""}
                                            onValueChange={(value) => handleAnswerChange(question.id, value)}
                                            className="space-y-1"
                                          >
                                            {questionOptions?.map((option: string, index: number) => (
                                              <div
                                                key={index}
                                                className="flex items-start space-x-3 cursor-pointer p-1"
                                                onClick={() => {
                                                  if (answers[question.id] === option) {
                                                    handleAnswerChange(question.id, "");
                                                  }
                                                }}
                                              >
                                                <div className="pt-0.5">
                                                  <RadioGroupItem value={option} id={`split-q${question.id}-${index}`} className={getRadioSizeClass()} />
                                                </div>
                                                <Label htmlFor={`split-q${question.id}-${index}`} className={`${getLabelSizeClass()} cursor-pointer`}>
                                                  {String.fromCharCode(105 + index)}. {option}
                                                </Label>
                                              </div>
                                            ))}
                                          </RadioGroup>
                                        </div>
                                      );

                                    case "multiple-choice":
                                      return (
                                        <div key={question.id} className="space-y-2">
                                          <TextHighlighter
                                            content={`${question.id}. ${String(question.questionText || "")}`}
                                            passageTitle={`${passage?.title || "Reading"} - Q${question.id}`}
                                            highlights={getQHighlights(question.id)}
                                            onHighlightsChange={setQHighlightsFor(question.id)}
                                            showLabels={false} className={getQuestionTextSize()}
                                          />
                                          <RadioGroup
                                            value={answers[question.id] || ""}
                                            onValueChange={(value) => handleAnswerChange(question.id, value)}
                                            className="space-y-1"
                                          >
                                            {questionOptions?.map((option: string, index: number) => (
                                              <div
                                                key={index}
                                                className="flex items-start space-x-3 cursor-pointer p-1"
                                                onClick={() => {
                                                  if (answers[question.id] === option) {
                                                    handleAnswerChange(question.id, "");
                                                  }
                                                }}
                                              >
                                                <div className="pt-0.5">
                                                  <RadioGroupItem value={option} id={`split-q${question.id}-${index}`} className={getRadioSizeClass()} />
                                                </div>
                                                <Label htmlFor={`split-q${question.id}-${index}`} className={`${getLabelSizeClass()} cursor-pointer`}>
                                                  {option}
                                                </Label>
                                              </div>
                                            ))}
                                          </RadioGroup>
                                        </div>
                                      );

                                    case "true-false-not-given":
                                      return (
                                        <div key={question.id} className="space-y-2">
                                          <TextHighlighter
                                            content={`${question.id}. ${String(question.questionText || "")}`}
                                            passageTitle={`${passage?.title || "Reading"} - Q${question.id}`}
                                            highlights={getQHighlights(question.id)}
                                            onHighlightsChange={setQHighlightsFor(question.id)}
                                            showLabels={false} className={getQuestionTextSize()}
                                          />
                                          <RadioGroup
                                            value={answers[question.id] || ""}
                                            onValueChange={(value) => handleAnswerChange(question.id, value)}
                                            className="inline-flex flex-wrap items-center gap-4 mt-1"
                                          >
                                            {questionOptions?.map((option: string) => (
                                              <div
                                                key={option}
                                                className="flex items-start space-x-3 cursor-pointer p-1"
                                                onClick={() => {
                                                  if (answers[question.id] === option) {
                                                    handleAnswerChange(question.id, "");
                                                  }
                                                }}
                                              >
                                                <div className="pt-0.5">
                                                  <RadioGroupItem value={option} id={`split-q${question.id}-${option}`} className={getRadioSizeClass()} />
                                                </div>
                                                <Label htmlFor={`split-q${question.id}-${option}`} className={`${getLabelSizeClass()} cursor-pointer`}>
                                                  {option}
                                                </Label>
                                              </div>
                                            ))}
                                          </RadioGroup>
                                        </div>
                                      );

                                    case "gap-fill":
                                    case "fill-in-blank":
                                      {
                                        const text: string = question.questionText || "";
                                        const match = text.match(/_{3,}/);
                                        if (match) {
                                          const idx = match.index ?? -1;
                                          const before = text.slice(0, idx);
                                          const after = text.slice(idx + match[0].length);
                                          return (
                                            <div key={question.id} className="space-y-1.5">
                                              <TextHighlighter
                                                content={`${question.id}. ${before}_____${after}`}
                                                passageTitle={`${passage?.title || "Reading"} - Q${question.id}`}
                                                highlights={getQHighlights(question.id)}
                                                onHighlightsChange={setQHighlightsFor(question.id)}
                                                showLabels={false} className={getQuestionTextSize()}
                                              />
                                              <p className={getFontSizeClass()}>
                                                {before}
                                                <Input
                                                  placeholder={`Gap ${question.id}`}
                                                  value={answers[question.id] || ""}
                                                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                  className={`inline-block align-baseline mx-1 ${getInputSizeClass()}`}
                                                />
                                                {after}
                                              </p>
                                            </div>
                                          );
                                        }
                                        return (
                                          <div key={question.id} className="space-y-1.5">
                                            <TextHighlighter
                                              content={`${question.id}. ${String(question.questionText || "")}`}
                                              passageTitle={`${passage?.title || "Reading"} - Q${question.id}`}
                                              highlights={getQHighlights(question.id)}
                                              onHighlightsChange={setQHighlightsFor(question.id)}
                                              showLabels={false} className={getQuestionTextSize()}
                                            />
                                            <Input
                                              placeholder="Type your answer..."
                                              value={answers[question.id] || ""}
                                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                              className={`max-w-xs ${getInputSizeClass()}`}
                                            />
                                          </div>
                                        );
                                      }
                                    case "short-answer":
                                      return (
                                        <div key={question.id} className="space-y-1.5">
                                          <TextHighlighter
                                            content={`${question.id}. ${String(question.questionText || "")}`}
                                            passageTitle={`${passage?.title || "Reading"} - Q${question.id}`}
                                            highlights={getQHighlights(question.id)}
                                            onHighlightsChange={setQHighlightsFor(question.id)}
                                            showLabels={false} className={getQuestionTextSize()}
                                          />
                                          <Input
                                            placeholder="Type your answer..."
                                            value={answers[question.id] || ""}
                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                            className={`max-w-xs ${getInputSizeClass()}`}
                                          />
                                        </div>
                                      );

                                    case "sentence-completion":
                                      return (
                                        <div key={question.id} className="space-y-1.5">
                                          {(() => {
                                            const full = `${question.id}. ${String(question.questionText || question.sentenceBeginning || question.incompleteSentence || "")}`;
                                            const match = full.match(/_{3,}/);
                                            const hasGap = !!match;
                                            const before = hasGap ? full.slice(0, match!.index as number) : full;
                                            const after = hasGap ? full.slice((match!.index as number) + (match![0]?.length || 0)) : "";
                                            const ruleText = questionGroup.word_limit || (question as any).wordLimit;
                                            const { maxWords, allowNumber } = parseSentenceWordLimit(ruleText);
                                            const value = answers[question.id] || "";
                                            const { words, hasInvalidNumber } = countAnswerTokens(value, allowNumber);
                                            const exceeded = words > maxWords;
                                            return (
                                              <div className={`${getFontSizeClass()} leading-6`}>
                                                <span>{before}</span>
                                                {hasGap ? (
                                                  <span className="inline-flex items-center gap-1 align-baseline">
                                                    <input
                                                      aria-label={`Gap ${question.id}`}
                                                      type="text"
                                                      disabled={!!result}
                                                      className={`px-1 border-b bg-transparent focus:outline-none ${getInputSizeClass()} ${exceeded || hasInvalidNumber ? 'border-red-500' : 'border-gray-400 focus:border-gray-700'
                                                        }`}
                                                      value={value}
                                                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                    />
                                                    <span className={`text-[10px] ${exceeded || hasInvalidNumber ? 'text-red-600' : 'text-gray-500'}`}>
                                                      {words}/{maxWords}{hasInvalidNumber ? ' • Number not allowed' : ''}
                                                    </span>
                                                  </span>
                                                ) : (
                                                  <Input
                                                    placeholder="Type your answer..."
                                                    value={value}
                                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                    className={`inline-block ml-2 ${getInputSizeClass()} ${exceeded || hasInvalidNumber ? 'border-red-500' : ''}`}
                                                  />
                                                )}
                                                <span>{after}</span>
                                              </div>
                                            );
                                          })()}
                                          {question.options ? (
                                            <RadioGroup
                                              value={answers[question.id] || ""}
                                              onValueChange={(value) => handleAnswerChange(question.id, value)}
                                              className="inline-flex flex-wrap items-center gap-2"
                                            >
                                              {Object.entries(question.options).map(([key, value]: [string, any]) => (
                                                <div
                                                  key={key}
                                                  className="flex items-start space-x-3 cursor-pointer p-1"
                                                  onClick={() => {
                                                    if (answers[question.id] === key) {
                                                      handleAnswerChange(question.id, "");
                                                    }
                                                  }}
                                                >
                                                  <div className="pt-0.5">
                                                    <RadioGroupItem value={key} id={`split-q${question.id}-${key}`} className={getRadioSizeClass()} />
                                                  </div>
                                                  <Label htmlFor={`split-q${question.id}-${key}`} className={`${getLabelSizeClass()} cursor-pointer`}>
                                                    <strong>{key}.</strong> {value}
                                                  </Label>
                                                </div>
                                              ))}
                                            </RadioGroup>
                                          ) : (
                                            (() => {
                                              const { maxWords, allowNumber } = parseSentenceWordLimit(questionGroup.word_limit);
                                              const value = answers[question.id] || "";
                                              const { words, hasInvalidNumber } = countAnswerTokens(value, allowNumber);
                                              const exceeded = words > maxWords;
                                              return (
                                                <div className="space-y-1">
                                                  {questionGroup.word_limit && (
                                                    <p className="text-xs text-gray-500 italic">{questionGroup.word_limit}</p>
                                                  )}
                                                  <Input
                                                    placeholder="Type your answer..."
                                                    value={value}
                                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                    className={`h-8 text-sm ${exceeded || hasInvalidNumber ? 'border-red-500' : ''}`}
                                                  />
                                                  <p className={`text-[10px] ${exceeded || hasInvalidNumber ? 'text-red-600' : 'text-gray-500'}`}>
                                                    {words}/{maxWords} {hasInvalidNumber && ' • Number not allowed'}
                                                  </p>
                                                </div>
                                              );
                                            })()
                                          )}
                                        </div>
                                      );

                                    default:
                                      return null;
                                  }
                                })
                              ) : (
                                <p className="text-xs text-red-600">Invalid question group data.</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-red-600">Questions are not available.</p>
                      )}

                      {activeSlideIndex === tests.length - 1 && (
                        <Button
                          onClick={handleSubmit}
                          disabled={answeredQuestionsAllSlides === 0 || submitReadingMutation.isPending}
                          className="w-full mt-4 h-9 text-sm"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {submitReadingMutation.isPending ? "Submitting..." : "Submit All Answers"}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <PreviewSignupModal open={showSignupModal} onClose={() => setShowSignupModal(false)} />
    </>
  );
}





