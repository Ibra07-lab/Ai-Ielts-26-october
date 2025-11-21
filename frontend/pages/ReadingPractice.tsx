import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Clock, Send, RotateCcw, Highlighter, CheckCircle, XCircle, Lightbulb, AlertCircle, Sparkles, GraduationCap } from "lucide-react";
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
import backend, { Local } from "~backend/client";
import { getAIFeedback } from '../services/aiFeedback';
import NoteCompletion from "@/components/questions/NoteCompletion";

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

// Collapsible question result component - Eye-comfortable design
function QuestionResult({
  question,
  answer,
  correctAnswer,
  explanation,
  aiFeedback,
  onGetAIFeedback,
  isLoadingFeedback
}: {
  question: any;
  answer: string;
  correctAnswer: string;
  explanation: string;
  aiFeedback?: any;
  onGetAIFeedback?: () => void;
  isLoadingFeedback?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isCorrect = answer === correctAnswer;

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
          <div className="space-y-4">
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
                <p className="text-slate-700 dark:text-slate-300">
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
                    <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                    <h4 className="font-medium text-slate-700 dark:text-slate-300">Evidence from Passage</h4>
                  </div>
                  <div className="pl-7 border-l-2 border-amber-600/50 dark:border-amber-500/50">
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
                    <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                    <h4 className="font-medium text-slate-700 dark:text-slate-300">Evidence from Passage</h4>
                  </div>
                  <div className="pl-7 border-l-2 border-amber-600/50 dark:border-amber-500/50">
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
                  {!aiFeedback && !isLoadingFeedback && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onGetAIFeedback();
                      }}
                      className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white rounded-md transition-colors font-medium text-base flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      Get Deeper AI Analysis
                    </button>
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
                          <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                          <h4 className="font-medium text-slate-700 dark:text-slate-300">Additional Evidence (AI-Found)</h4>
                        </div>
                        <div className="pl-7 border-l-2 border-amber-600/50 dark:border-amber-500/50 mb-3">
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

                      {/* Strategy Tip (collapsible) */}
                      <div className="pt-6">
                        <details className="cursor-pointer group">
                          <summary className="text-base font-medium text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            View Strategy Tips for This Question Type
                          </summary>
                          <div className="mt-4 pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {aiFeedback.strategy_tip}
                            </p>
                          </div>
                        </details>
                      </div>
                    </div>
                  )}
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
  summaryInputRefs
}: {
  group: any;
  answers: Record<number, string>;
  result: any;
  handleAnswerChange: (qid: number, value: string) => void;
  summaryInputRefs: React.MutableRefObject<Record<number, HTMLInputElement | null>>;
}) {
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
  const stripped = normalized
    .replace(/<\/?div[^>]*>/g, "")
    .replace(/<\/?p[^>]*>/g, "");
  const parts = stripped.split(/(\(\d+\)_____)/g);
  let gapIndex = 0;

  return (
    <div className="space-y-2">
      {group?.word_limit && (
        <p className="text-xs italic text-gray-500">{group.word_limit}</p>
      )}
      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded relative z-0">
        <div className="text-sm leading-6">
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
                  <span className="text-[10px] text-gray-500">{labelNum})</span>
                  <input
                    type="text"
                    tabIndex={0}
                    disabled={!!result}
                    className={`px-2 py-1 border rounded text-xs w-28 bg-white dark:bg-gray-900 relative z-20 pointer-events-auto focus:outline-none focus:ring-2 ${exceeded || hasInvalidNumber ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                      }`}
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
                  {!result && (
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
            return <span key={`txt-${idx}`} dangerouslySetInnerHTML={{ __html: part }} />;
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
  setAnswers
}: {
  group: TableCompletionQuestion;
  answers: Record<number, string>;
  result: any;
  setAnswers: (setter: (prev: Record<number, string>) => Record<number, string>) => void;
}) {
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
                <th key={idx} className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold text-sm">
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
                      <span className="text-sm">{cell.content}</span>
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
  setAnswers
}: {
  group: FlowChartCompletionQuestion;
  answers: Record<number, string>;
  result: any;
  setAnswers: (setter: (prev: Record<number, string>) => Record<number, string>) => void;
}) {
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
                <div className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-800 shadow-sm">
                  <p className="text-sm text-center text-gray-900 dark:text-white">
                    {node.content}
                  </p>
                </div>
              ) : node.type === 'gap' ? (
                // Gap Node - Input box with content
                <div className="w-full space-y-2">
                  <div className="relative">
                    {/* Gap Number Badge */}
                    <div className="absolute -top-2 -left-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-md z-10">
                      {node.gapNumber}
                    </div>

                    {node.content ? (
                      // If content exists, display it with inline gap
                      <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                        <p className="text-sm text-gray-900 dark:text-white flex flex-wrap items-center gap-2">
                          {node.content.split('__________').map((part, idx, arr) => (
                            <span key={idx} className="inline-flex items-center gap-2">
                              <span>{part}</span>
                              {idx < arr.length - 1 && (
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
                                  placeholder="..."
                                  aria-label={`Question ${node.gapNumber}: Enter answer`}
                                  className={`
                                    inline-block min-w-[150px] max-w-[250px] px-3 py-1 text-center rounded transition-all
                                    ${getNodeState(node.gapNumber!) === 'empty' ? 'border-2 border-dashed border-gray-400 bg-white dark:bg-gray-900' : ''}
                                    ${getNodeState(node.gapNumber!) === 'filled' ? 'border-2 border-green-500 bg-green-50 dark:bg-green-900/20' : ''}
                                    ${getNodeState(node.gapNumber!) === 'exceeded' ? 'border-2 border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                                    ${getNodeState(node.gapNumber!) === 'correct' ? 'border-2 border-green-600 bg-green-100 dark:bg-green-900/40' : ''}
                                    ${getNodeState(node.gapNumber!) === 'incorrect' ? 'border-2 border-red-600 bg-red-100 dark:bg-red-900/40' : ''}
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                  `}
                                />
                              )}
                            </span>
                          ))}
                        </p>
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
                          w-full pl-4 pr-4 py-3 text-center rounded-lg transition-all
                          ${getNodeState(node.gapNumber!) === 'empty' ? 'border-2 border-dashed border-gray-400 bg-white dark:bg-gray-900' : ''}
                          ${getNodeState(node.gapNumber!) === 'filled' ? 'border-2 border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm' : ''}
                          ${getNodeState(node.gapNumber!) === 'exceeded' ? 'border-2 border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                          ${getNodeState(node.gapNumber!) === 'correct' ? 'border-2 border-green-600 bg-green-100 dark:bg-green-900/40' : ''}
                          ${getNodeState(node.gapNumber!) === 'incorrect' ? 'border-2 border-red-600 bg-red-100 dark:bg-red-900/40' : ''}
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
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

export default function ReadingPractice() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [questionHighlights, setQuestionHighlights] = useState<Record<number, Highlight[]>>({});
  const [activeTab, setActiveTab] = useState("passage");
  const [viewMode, setViewMode] = useState<"tabs" | "split">("tabs");
  const [selectedTestIndex, setSelectedTestIndex] = useState<number | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(60 * 60);
  const [aiFeedback, setAIFeedback] = useState<Record<number, any>>({});
  const [loadingFeedback, setLoadingFeedback] = useState<Set<number>>(new Set());
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const summaryInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // Per-question highlights helpers (keep question highlights isolated by id)
  const getQHighlights = (qid: number) => questionHighlights[qid] || [];
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

  // Selected test id (initialize after tests list loads)
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

  // When test list arrives, default to first available if none selected
  useEffect(() => {
    if (!selectedTestId && testsData?.tests && testsData.tests.length > 0) {
      setSelectedTestId(testsData.tests[0].testId);
    }
  }, [testsData?.tests, selectedTestId]);

  // Fetch specific test
  const { data: testData, isLoading, isError, error, refetch: refetchPassage } = useQuery({
    queryKey: ["reading-test", selectedTestId],
    queryFn: () => backend.ielts.getReadingTestById({ testId: selectedTestId as number }),
    enabled: selectedTestId != null,
  });

  // Tests list and selected passage
  const tests = testData?.passages || [];
  const totalEstimatedMinutes = Array.isArray(tests)
    ? tests.reduce((sum: number, p: any) => sum + (p?.estimatedTime || 20), 0)
    : 60;
  const passage = selectedTestIndex != null ? tests[activeSlideIndex] : undefined;

  const enterTest = (idx: number) => {
    setRemainingSeconds(60 * 60);
    setStartTime(Date.now());
    setSelectedTestIndex(idx);
    setActiveSlideIndex(0);
    setAnswers({});
    setResult(null);
    setHighlights([]);
    setActiveTab("passage");
  };

  const backToMenu = () => {
    setSelectedTestIndex(null);
    setActiveSlideIndex(0);
    setAnswers({});
    setResult(null);
    setHighlights([]);
    setRemainingSeconds(60 * 60);
    setStartTime(null);
  };

  const handleGetAIFeedback = async (questionId: number, question: any, studentAnswer: string, correctAnswer: string) => {
    setLoadingFeedback(prev => new Set(prev).add(questionId));

    try {
      const feedback = await getAIFeedback({
        passage: passage?.paragraphs?.map(p => p.text).join('\n\n') || '',
        question: question.questionText || question.sentenceBeginning || '',
        question_type: question.type || 'Multiple Choice',
        correct_answer: correctAnswer,
        student_answer: studentAnswer
      });

      setAIFeedback(prev => ({
        ...prev,
        [questionId]: feedback
      }));

      toast({
        title: "AI Feedback Ready",
        description: "Scroll down to see detailed feedback",
      });
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      toast({
        title: "Error",
        description: "Failed to get AI feedback. Please try again.",
        variant: "destructive"
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

  // Load highlights for the current passage
  const { data: highlightsData } = useQuery<{ highlights: Highlight[] }>({
    queryKey: ["readingHighlights", user?.id, passage?.title],
    queryFn: () => user && passage ? backend.ielts.getHighlights({ userId: user.id, passageTitle: passage.title }) : Promise.resolve({ highlights: [] }),
    enabled: !!user && !!passage,
  });

  // Reset view state when passage changes (but keep answers across slides)
  useEffect(() => {
    if (passage) {
      // Don't clear answers - keep them across slides
      setResult(null);
      setHighlights([]);
    }
  }, [passage?.title]);

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

  // Load highlights into state when fetched
  useEffect(() => {
    if (highlightsData?.highlights) {
      setHighlights(highlightsData.highlights);
    }
  }, [highlightsData?.highlights]);

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
    setHighlights(newHighlights);
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case "matching-headings":
        return (
          <div key={question.id} className="space-y-3">
            <TextHighlighter
              content={String(question.questionText || "")}
              passageTitle={`${passage?.title || "Reading"} - Question`}
              highlights={getQHighlights(question.id)}
              onHighlightsChange={setQHighlightsFor(question.id)}
              showLabels={false}
            />
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              {question.options?.map((option: any, index: number) => {
                const optionValue = typeof option === 'object' ? option.letter : option;
                const optionText = typeof option === 'object' ? option.text : option;
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={optionValue} id={`q${question.id}-${index}`} />
                    <Label htmlFor={`q${question.id}-${index}`} className="text-sm">
                      {String.fromCharCode(105 + index)}. {optionText}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
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
              showLabels={false}
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
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => {
                      if (answers[question.id] === optionValue) {
                        handleAnswerChange(question.id, "");
                      }
                    }}
                  >
                    <RadioGroupItem value={optionValue} id={`q${question.id}-${index}`} />
                    <Label htmlFor={`q${question.id}-${index}`} className="text-sm">
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
              showLabels={false}
            />
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
              className="inline-flex flex-wrap items-center gap-2"
            >
              {question.options?.map((option: string) => (
                <div
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => {
                    if (answers[question.id] === option) {
                      handleAnswerChange(question.id, "");
                    }
                  }}
                >
                  <RadioGroupItem value={option} id={`q${question.id}-${option}`} />
                  <Label htmlFor={`q${question.id}-${option}`} className="text-sm">
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
                  showLabels={false}
                />
                <p className="text-sm">
                  {before}
                  <Input
                    placeholder={`Gap ${question.id}`}
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="inline-block w-40 h-8 align-baseline mx-1"
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
                showLabels={false}
              />
              <Input
                placeholder="Type your answer..."
                value={answers[question.id] || ""}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="max-w-md"
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
              showLabels={false}
            />
            <Input
              placeholder="Type your answer..."
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="max-w-md"
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
                <div className="text-sm leading-6">
                  <span>{before}</span>
                  {hasGap ? (
                    <span className="inline-flex items-center gap-1 align-baseline">
                      <input
                        aria-label={`Gap ${question.id}`}
                        type="text"
                        disabled={!!result}
                        className={`px-1 border-b bg-transparent w-40 focus:outline-none ${exceeded || hasInvalidNumber ? 'border-red-500' : 'border-gray-400 focus:border-gray-700'
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
                      className={`${(exceeded || hasInvalidNumber) ? 'border-red-500' : ''} max-w-md inline-block ml-2`}
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
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => {
                      if (answers[question.id] === key) {
                        handleAnswerChange(question.id, "");
                      }
                    }}
                  >
                    <RadioGroupItem value={key} id={`q${question.id}-${key}`} />
                    <Label htmlFor={`q${question.id}-${key}`} className="text-sm">
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
      <div className="max-w-7xl mx-auto space-y-8 pb-32">
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
                const isSelected = selectedTestId === test.testId;
                // Mock difficulty for visual variety
                const difficulty = index % 3 === 0 ? "Hard" : index % 2 === 0 ? "Medium" : "Easy";
                const difficultyColor = difficulty === "Hard" ? "text-rose-600 bg-rose-50 border-rose-200" : difficulty === "Medium" ? "text-amber-600 bg-amber-50 border-amber-200" : "text-emerald-600 bg-emerald-50 border-emerald-200";

                return (
                  <Card
                    key={test.testId}
                    onClick={() => {
                      setSelectedTestId(test.testId);
                      setSelectedTestIndex(null);
                      setActiveSlideIndex(0);
                      setAnswers({});
                      setResult(null);
                      setHighlights([]);
                    }}
                    className={`cursor-pointer group relative overflow-hidden transition-all duration-300 border-2
                    ${isSelected
                        ? "border-blue-500 shadow-lg ring-2 ring-blue-200 dark:ring-blue-900"
                        : "border-transparent hover:border-blue-200 hover:shadow-md dark:bg-slate-800 dark:hover:border-slate-600"
                      }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${difficultyColor} dark:bg-opacity-10`}>
                          {difficulty}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                        {test.testName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        60 mins
                        <span>•</span>
                        {test.totalQuestions} Questions
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                          <span>Completion Rate</span>
                          <span className="font-medium">0%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-0 rounded-full"></div>
                        </div>

                        {isSelected && (
                          <div className="pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                enterTest(0);
                              }}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md group-hover:shadow-lg transition-all"
                            >
                              Start Test Now
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {selectedTestIndex !== null && passage && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              {viewMode === "tabs" ? (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="passage">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Reading Passage
                    </TabsTrigger>
                    <TabsTrigger value="questions">
                      Questions ({answeredQuestionsCurrentSlide}/{totalQuestions})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              ) : (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-semibold">Split View</h2>
                  <Badge variant="outline" className="ml-2">
                    {answeredQuestionsCurrentSlide}/{totalQuestions} answered
                  </Badge>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "tabs" ? "outline" : "default"}
                  size="sm"
                  onClick={() => setViewMode(viewMode === "tabs" ? "split" : "tabs")}
                  className="mr-2"
                >
                  {viewMode === "tabs" ? "Split View" : "Tab View"}
                </Button>
                {tests && tests.length > 1 && (
                  <>
                    <div className="flex gap-1 mr-2" role="tablist" aria-label="Reading slides">
                      {tests.map((_: any, idx: number) => (
                        <Button
                          key={idx}
                          variant={activeSlideIndex === idx ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setActiveSlideIndex(idx);
                            // Keep answers when switching slides
                            setResult(null);
                            setHighlights([]);
                            setActiveTab("passage");
                          }}
                          aria-pressed={activeSlideIndex === idx}
                          aria-label={`Show Slide ${idx + 1}`}
                        >
                          Slide {idx + 1}
                        </Button>
                      ))}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Overall: {answeredQuestionsAllSlides}/{totalQuestionsAllSlides}
                    </Badge>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={backToMenu}>
                  Back to Test Menu
                </Button>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Highlighter className="h-3 w-3" />
                  {highlights.length} highlights
                </Badge>
                <Badge
                  variant="secondary"
                  className="ml-2 font-mono flex items-center gap-1 text-base md:text-lg px-3 py-1.5"
                >
                  <Clock className="h-4 w-4" />
                  {formatTime(remainingSeconds)}
                </Badge>
              </div>
            </div>

            {/* Tab View Mode */}
            {viewMode === "tabs" && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsContent value="passage">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {passage.title}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center justify-between">
                          <span>Select text to highlight, translate, or add to vocabulary.</span>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">Recommended: {passage.estimatedTime || 20} minutes</span>
                          </div>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                        <TextHighlighter
                          content={passage.paragraphs?.map((p: { text: string }) => p.text).join('\n\n') || ''}
                          passageTitle={passage.title}
                          highlights={highlights}
                          onHighlightsChange={handleHighlightsChange}
                        />
                      </div>

                      {highlights.length > 0 && (
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                            💡 Tip: Your highlights are saved automatically
                          </h4>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            You have {highlights.length} highlighted {highlights.length === 1 ? 'item' : 'items'} in this passage.
                            They will be available when you return to this passage.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="questions">
                  <Card>
                    <CardHeader>
                      <CardTitle>Questions</CardTitle>
                      <CardDescription>
                        Answer all questions based on the passage you just read.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex justify-between items-center">
                        <Badge variant={answeredQuestionsCurrentSlide === totalQuestions ? "default" : "secondary"}>
                          {answeredQuestionsCurrentSlide}/{totalQuestions} answered on this slide
                        </Badge>
                      </div>

                      <div className="space-y-8">
                        {Array.isArray(passage?.questions) ? (
                          passage!.questions.map((questionGroup: any) => (
                            <div key={questionGroup.id} className="space-y-4">
                              <div className="border-b pb-2">
                                <h3 className="text-lg font-semibold">{questionGroup.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{questionGroup.instructions}</p>

                                {/* Add explanation for TRUE/FALSE/NOT GIVEN question types */}
                                {questionGroup.type === 'true-false-not-given' && (
                                  <TrueFalseExplanation
                                    format={
                                      questionGroup.questions?.[0]?.correctAnswer === 'TRUE' ||
                                        questionGroup.questions?.[0]?.correctAnswer === 'FALSE'
                                        ? 'TRUE/FALSE'
                                        : 'YES/NO'
                                    }
                                  />
                                )}
                              </div>
                              <div className="space-y-6">
                                {questionGroup.type === "matching-headings" ? (
                                  // Render matching-headings at GROUP level
                                  <div className="space-y-4">
                                    {questionGroup.questions?.map((question: any) => {
                                      const selectedAnswer = answers[question.id] || "";
                                      const usedOptions = Object.entries(answers)
                                        .filter(([qId, _]) => Number(qId) !== question.id)
                                        .map(([_, ans]) => ans);

                                      return (
                                        <div key={question.id} className="space-y-2">
                                          <TextHighlighter
                                            content={String(question.questionText || "")}
                                            passageTitle={`${passage?.title || "Reading"} - Question`}
                                            highlights={getQHighlights(question.id)}
                                            onHighlightsChange={setQHighlightsFor(question.id)}
                                            showLabels={false}
                                          />
                                          <RadioGroup
                                            value={selectedAnswer}
                                            onValueChange={(value) => handleAnswerChange(question.id, value)}
                                          >
                                            {question.options?.map((option: any, index: number) => {
                                              const optionValue = typeof option === 'object' ? option.letter : option;
                                              const optionText = typeof option === 'object' ? option.text : option;
                                              const isUsedElsewhere = usedOptions.includes(optionValue);
                                              return (
                                                <div
                                                  key={index}
                                                  className="flex items-center space-x-2 cursor-pointer"
                                                  onClick={() => {
                                                    if (selectedAnswer === optionValue) {
                                                      handleAnswerChange(question.id, "");
                                                    }
                                                  }}
                                                >
                                                  <RadioGroupItem
                                                    value={optionValue}
                                                    id={`q${question.id}-${index}`}
                                                    disabled={isUsedElsewhere}
                                                  />
                                                  <Label
                                                    htmlFor={`q${question.id}-${index}`}
                                                    className={`text-sm ${isUsedElsewhere ? 'text-red-500 line-through opacity-50' : ''}`}
                                                  >
                                                    {toRomanNumeral(index + 1)}. {optionText}
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
                                  // Render matching-features questions
                                  <div className="space-y-6">
                                    {/* Display available features (people/institutions) */}
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                      <h4 className="font-medium mb-3">List of People/Institutions:</h4>
                                      <div className="space-y-2">
                                        {questionGroup.features?.map((feature: any, idx: number) => (
                                          <div key={idx} className="text-sm">
                                            <strong>{feature.letter}.</strong> {feature.name}
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Statements to match */}
                                    <div className="space-y-4">
                                      {questionGroup.questions?.map((question: any) => (
                                        <div key={question.id} className="space-y-2">
                                          <TextHighlighter
                                            content={`${question.id}. ${String(question.questionText || "")}`}
                                            passageTitle={`${passage?.title || "Reading"} - Question`}
                                            highlights={getQHighlights(question.id)}
                                            onHighlightsChange={setQHighlightsFor(question.id)}
                                            showLabels={false}
                                          />
                                          <Input
                                            placeholder="Enter letter (A, B, C, D)..."
                                            value={answers[question.id] || ""}
                                            onChange={(e) => handleAnswerChange(question.id, e.target.value.toUpperCase())}
                                            className="max-w-md"
                                            maxLength={1}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : questionGroup.type === "matching-sentence-endings" ? (
                                  // Render matching-sentence-endings questions
                                  <div className="space-y-6">
                                    {/* Display available endings (A-E) */}
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                      <h4 className="font-medium mb-3">Possible Endings:</h4>
                                      <div className="space-y-2">
                                        {questionGroup.sentence_endings?.map((ending: any, idx: number) => (
                                          <div key={idx} className="text-sm">
                                            <strong>{ending.letter}.</strong> {ending.text}
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Sentence beginnings to match */}
                                    <div className="space-y-4">
                                      {questionGroup.questions?.map((question: any) => (
                                        <div key={question.id} className="space-y-2">
                                          <TextHighlighter
                                            content={`${question.id}. ${String(question.questionText || "")}`}
                                            passageTitle={`${passage?.title || "Reading"} - Question`}
                                            highlights={getQHighlights(question.id)}
                                            onHighlightsChange={setQHighlightsFor(question.id)}
                                            showLabels={false}
                                          />
                                          <RadioGroup
                                            value={answers[question.id] || ""}
                                            onValueChange={(value) => handleAnswerChange(question.id, value)}
                                            className="inline-flex flex-wrap items-center gap-2"
                                          >
                                            {questionGroup.sentence_endings?.map((ending: any) => (
                                              <div
                                                key={ending.letter}
                                                className="flex items-center space-x-2 cursor-pointer"
                                                onClick={() => {
                                                  if (answers[question.id] === ending.letter) {
                                                    handleAnswerChange(question.id, "");
                                                  }
                                                }}
                                              >
                                                <RadioGroupItem value={ending.letter} id={`q${question.id}-${ending.letter}`} />
                                                <Label htmlFor={`q${question.id}-${ending.letter}`} className="text-sm">
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
                                  />
                                ) : questionGroup.type === "summary-completion" ? (
                                  <SummaryCompletion
                                    group={questionGroup}
                                    answers={answers}
                                    result={result}
                                    handleAnswerChange={handleAnswerChange}
                                    summaryInputRefs={summaryInputRefs}
                                  />
                                ) : questionGroup.type === "note-completion" ? (
                                  <NoteCompletion
                                    group={questionGroup}
                                    answers={answers}
                                    result={result}
                                    onAnswerChange={handleAnswerChange}
                                  />
                                ) : questionGroup.type === "table-completion" ? (
                                  <TableCompletion
                                    group={questionGroup as any}
                                    answers={answers}
                                    result={result}
                                    setAnswers={setAnswers}
                                  />
                                ) : questionGroup.type === "flow-chart-completion" ? (
                                  <FlowChartCompletion
                                    group={questionGroup as any}
                                    answers={answers}
                                    result={result}
                                    setAnswers={setAnswers}
                                  />
                                ) : questionGroup.type === "matching-information" ? (
                                  // Render matching-information questions
                                  <div className="space-y-4">
                                    {/* Paragraph Reference Box */}
                                    {questionGroup.paragraphs_list && (
                                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                          Paragraphs:
                                        </h4>
                                        <div className="flex gap-2 flex-wrap">
                                          {questionGroup.paragraphs_list.map((para: string) => (
                                            <span key={para} className="text-xs text-blue-800 dark:text-blue-200">
                                              {para}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Questions */}
                                    <div className="space-y-3">
                                      {questionGroup.questions?.map((q: any) => (
                                        <div key={q.id} className="matching-info-question-item flex items-start gap-3 p-3 border-l-4 border-gray-300">
                                          <span className="font-medium min-w-[40px]">{q.id}.</span>
                                          <div className="flex-1 text-sm">
                                            <TextHighlighter
                                              content={String(q.questionText || "")}
                                              passageTitle={`${passage?.title || "Reading"} - Q${q.id}`}
                                              highlights={getQHighlights(q.id)}
                                              onHighlightsChange={setQHighlightsFor(q.id)}
                                              showLabels={false}
                                            />
                                          </div>
                                          <select
                                            value={answers[q.id] || ""}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            disabled={!!result}
                                            className="matching-info-select px-3 py-2 border rounded-md min-w-[120px]"
                                          >
                                            <option value="">Select...</option>
                                            {questionGroup.paragraphs_list?.map((para: string) => (
                                              <option key={para} value={para}>
                                                Paragraph {para}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : Array.isArray(questionGroup.questions) ? (
                                  questionGroup.questions.map((question: any) =>
                                    renderQuestion({
                                      ...question,
                                      type: questionGroup.type,
                                      groupWordLimit: questionGroup.word_limit,
                                      options:
                                        questionGroup.type === 'true-false-not-given'
                                          ? (() => {
                                            // Auto-detect format based on first question's correct answer
                                            const firstCorrectAnswer = questionGroup.questions?.[0]?.correctAnswer;
                                            if (firstCorrectAnswer === 'TRUE' || firstCorrectAnswer === 'FALSE') {
                                              return ["TRUE", "FALSE", "NOT GIVEN"];
                                            } else {
                                              return ["YES", "NO", "NOT GIVEN"];
                                            }
                                          })()
                                          : question.options,
                                    })
                                  )
                                ) : (
                                  <p className="text-sm text-red-600">Invalid question group data.</p>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-red-600">Questions are not available.</p>
                        )}
                      </div>

                      {activeSlideIndex === tests.length - 1 && (
                        <Button
                          onClick={handleSubmit}
                          disabled={answeredQuestionsAllSlides === 0 || submitReadingMutation.isPending}
                          className="w-full"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {submitReadingMutation.isPending ? "Submitting..." : "Submit All Answers"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            {/* Split View Mode */}
            {viewMode === "split" && (
              <div className="grid gap-4 h-[calc(100vh-240px)] bg-background" style={{ gridTemplateColumns: '60% 40%' }}>
                {/* Left Pane - Reading Passage */}
                <div className="overflow-y-auto border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-card">
                  <Card className="h-full">
                    <CardHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10 border-b py-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <BookOpen className="h-4 w-4" />
                        {passage.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Select text to highlight, translate, or add to vocabulary.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="p-4 rounded-lg text-sm leading-relaxed">
                        <TextHighlighter
                          content={passage.paragraphs?.map((p: { text: string }) => p.text).join('\n\n') || ''}
                          passageTitle={passage.title}
                          highlights={highlights}
                          onHighlightsChange={handleHighlightsChange}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Pane - Questions */}
                <div className="overflow-y-auto border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-card">
                  <Card className="h-full">
                    <CardHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10 border-b py-3">
                      <CardTitle className="text-base">Questions</CardTitle>
                      <CardDescription className="text-xs">
                        Answer all questions based on the passage.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      {Array.isArray(passage?.questions) ? (
                        passage!.questions.map((questionGroup: any) => (
                          <div key={questionGroup.id} className="space-y-3 pb-4 border-b last:border-b-0">
                            <div className="pb-2">
                              <h3 className="text-sm font-semibold">{questionGroup.title}</h3>
                              <p className="text-xs text-gray-600 dark:text-gray-300">{questionGroup.instructions}</p>

                              {/* Add explanation for TRUE/FALSE/NOT GIVEN question types */}
                              {questionGroup.type === 'true-false-not-given' && (
                                <div className="mt-2 p-2 border-l-4 border-blue-500 rounded">
                                  <h5 className="font-semibold text-xs text-blue-900 dark:text-blue-100 mb-1">
                                    📘 How to answer {(() => {
                                      const firstCorrectAnswer = questionGroup.questions?.[0]?.correctAnswer;
                                      return (firstCorrectAnswer === 'TRUE' || firstCorrectAnswer === 'FALSE') ? 'TRUE/FALSE' : 'YES/NO';
                                    })()}/NOT GIVEN:
                                  </h5>
                                  <div className="text-xs text-blue-800 dark:text-blue-200 space-y-0.5">
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
                                          showLabels={false}
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
                                                className="flex items-center space-x-2 cursor-pointer"
                                                onClick={() => {
                                                  if (selectedAnswer === optionValue) {
                                                    handleAnswerChange(question.id, "");
                                                  }
                                                }}
                                              >
                                                <RadioGroupItem
                                                  value={optionValue}
                                                  id={`split-q${question.id}-${index}`}
                                                  className="h-3 w-3"
                                                  disabled={isUsedElsewhere}
                                                />
                                                <Label
                                                  htmlFor={`split-q${question.id}-${index}`}
                                                  className={`text-xs leading-tight ${isUsedElsewhere ? 'text-red-500 line-through opacity-50' : ''}`}
                                                >
                                                  {toRomanNumeral(index + 1)}. {optionText}
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
                                    <h4 className="font-medium text-xs mb-2">List of People/Institutions:</h4>
                                    <div className="space-y-1">
                                      {questionGroup.features?.map((feature: any, idx: number) => (
                                        <div key={idx} className="text-xs">
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
                                          showLabels={false}
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
                                    <h4 className="font-medium text-xs mb-2">Possible Endings:</h4>
                                    <div className="space-y-1">
                                      {questionGroup.sentence_endings?.map((ending: any, idx: number) => (
                                        <div key={idx} className="text-xs">
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
                                          showLabels={false}
                                        />
                                        <RadioGroup
                                          value={answers[question.id] || ""}
                                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                                          className="inline-flex flex-wrap items-center gap-2"
                                        >
                                          {questionGroup.sentence_endings?.map((ending: any) => (
                                            <div
                                              key={ending.letter}
                                              className="flex items-center space-x-2 cursor-pointer"
                                              onClick={() => {
                                                if (answers[question.id] === ending.letter) {
                                                  handleAnswerChange(question.id, "");
                                                }
                                              }}
                                            >
                                              <RadioGroupItem value={ending.letter} id={`split-q${question.id}-${ending.letter}`} className="h-3 w-3" />
                                              <Label htmlFor={`split-q${question.id}-${ending.letter}`} className="text-xs leading-tight">
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
                                />
                              ) : questionGroup.type === "summary-completion" ? (
                                <SummaryCompletion
                                  group={questionGroup}
                                  answers={answers}
                                  result={result}
                                  handleAnswerChange={handleAnswerChange}
                                  summaryInputRefs={summaryInputRefs}
                                />
                              ) : questionGroup.type === "note-completion" ? (
                                <NoteCompletion
                                  group={questionGroup}
                                  answers={answers}
                                  result={result}
                                  onAnswerChange={handleAnswerChange}
                                />
                              ) : questionGroup.type === "table-completion" ? (
                                <TableCompletion
                                  group={questionGroup as any}
                                  answers={answers}
                                  result={result}
                                  setAnswers={setAnswers}
                                />
                              ) : questionGroup.type === "flow-chart-completion" ? (
                                <FlowChartCompletion
                                  group={questionGroup as any}
                                  answers={answers}
                                  result={result}
                                  setAnswers={setAnswers}
                                />
                              ) : questionGroup.type === "matching-information" ? (
                                // Render matching-information questions (split view)
                                <div className="space-y-3">
                                  {/* Paragraph Reference Box */}
                                  {questionGroup.paragraphs_list && (
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200">
                                      <h4 className="font-semibold text-xs text-blue-900 dark:text-blue-100 mb-1">
                                        Paragraphs:
                                      </h4>
                                      <div className="flex gap-1 flex-wrap">
                                        {questionGroup.paragraphs_list.map((para: string) => (
                                          <span key={para} className="text-xs text-blue-800 dark:text-blue-200">
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
                                        <span className="font-medium text-xs min-w-[20px]">{q.id}.</span>
                                        <div className="flex-1 text-xs">
                                          <TextHighlighter
                                            content={String(q.questionText || "")}
                                            passageTitle={`${passage?.title || "Reading"} - Q${q.id}`}
                                            highlights={getQHighlights(q.id)}
                                            onHighlightsChange={setQHighlightsFor(q.id)}
                                            showLabels={false}
                                          />
                                        </div>
                                        <select
                                          value={answers[q.id] || ""}
                                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                          className="px-2 py-1 border rounded text-xs min-w-[80px] h-6"
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
                                    <h4 className="font-medium text-xs mb-2">List of People/Institutions:</h4>
                                    <div className="space-y-1">
                                      {questionGroup.features?.map((feature: any, idx: number) => (
                                        <div key={idx} className="text-xs">
                                          <strong>{feature.letter}.</strong> {feature.name}
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Statements to match */}
                                  <div className="space-y-3">
                                    {questionGroup.questions?.map((question: any) => (
                                      <div key={question.id} className="space-y-1.5">
                                        <h4 className="font-medium text-xs">{question.id}. {question.questionText}</h4>
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
                                            showLabels={false}
                                          />
                                          <RadioGroup
                                            value={answers[question.id] || ""}
                                            onValueChange={(value) => handleAnswerChange(question.id, value)}
                                            className="space-y-1"
                                          >
                                            {questionOptions?.map((option: string, index: number) => (
                                              <div
                                                key={index}
                                                className="flex items-center space-x-2 cursor-pointer"
                                                onClick={() => {
                                                  if (answers[question.id] === option) {
                                                    handleAnswerChange(question.id, "");
                                                  }
                                                }}
                                              >
                                                <RadioGroupItem value={option} id={`split-q${question.id}-${index}`} className="h-3 w-3" />
                                                <Label htmlFor={`split-q${question.id}-${index}`} className="text-xs leading-tight">
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
                                            showLabels={false}
                                          />
                                          <RadioGroup
                                            value={answers[question.id] || ""}
                                            onValueChange={(value) => handleAnswerChange(question.id, value)}
                                            className="space-y-1"
                                          >
                                            {questionOptions?.map((option: string, index: number) => (
                                              <div
                                                key={index}
                                                className="flex items-center space-x-2 cursor-pointer"
                                                onClick={() => {
                                                  if (answers[question.id] === option) {
                                                    handleAnswerChange(question.id, "");
                                                  }
                                                }}
                                              >
                                                <RadioGroupItem value={option} id={`split-q${question.id}-${index}`} className="h-3 w-3" />
                                                <Label htmlFor={`split-q${question.id}-${index}`} className="text-xs leading-tight">
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
                                            showLabels={false}
                                          />
                                          <RadioGroup
                                            value={answers[question.id] || ""}
                                            onValueChange={(value) => handleAnswerChange(question.id, value)}
                                            className="inline-flex flex-wrap items-center gap-2"
                                          >
                                            {questionOptions?.map((option: string) => (
                                              <div
                                                key={option}
                                                className="flex items-center space-x-1.5 cursor-pointer"
                                                onClick={() => {
                                                  if (answers[question.id] === option) {
                                                    handleAnswerChange(question.id, "");
                                                  }
                                                }}
                                              >
                                                <RadioGroupItem value={option} id={`split-q${question.id}-${option}`} className="h-3 w-3" />
                                                <Label htmlFor={`split-q${question.id}-${option}`} className="text-xs">
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
                                                showLabels={false}
                                              />
                                              <p className="text-xs">
                                                {before}
                                                <Input
                                                  placeholder={`Gap ${question.id}`}
                                                  value={answers[question.id] || ""}
                                                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                  className="inline-block h-7 w-28 align-baseline mx-1 text-xs"
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
                                              showLabels={false}
                                            />
                                            <Input
                                              placeholder="Type your answer..."
                                              value={answers[question.id] || ""}
                                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                              className="h-8 text-sm"
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
                                            showLabels={false}
                                          />
                                          <Input
                                            placeholder="Type your answer..."
                                            value={answers[question.id] || ""}
                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                            className="h-8 text-sm"
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
                                              <div className="text-xs leading-6">
                                                <span>{before}</span>
                                                {hasGap ? (
                                                  <span className="inline-flex items-center gap-1 align-baseline">
                                                    <input
                                                      aria-label={`Gap ${question.id}`}
                                                      type="text"
                                                      disabled={!!result}
                                                      className={`px-1 border-b bg-transparent w-36 focus:outline-none ${exceeded || hasInvalidNumber ? 'border-red-500' : 'border-gray-400 focus:border-gray-700'
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
                                                    className={`h-8 text-sm inline-block ml-2 ${exceeded || hasInvalidNumber ? 'border-red-500' : ''}`}
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
                                                  className="flex items-center space-x-2 cursor-pointer"
                                                  onClick={() => {
                                                    if (answers[question.id] === key) {
                                                      handleAnswerChange(question.id, "");
                                                    }
                                                  }}
                                                >
                                                  <RadioGroupItem value={key} id={`split-q${question.id}-${key}`} className="h-3 w-3" />
                                                  <Label htmlFor={`split-q${question.id}-${key}`} className="text-xs leading-tight">
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
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {result && (
          <Card className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">Test Results</CardTitle>
              <div className="text-center mt-4">
                <Badge className="mb-2 text-base px-4 py-1">Your Score</Badge>
                <p className="text-4xl font-bold text-blue-700 dark:text-blue-300 my-2">
                  {result.score}/{result.totalQuestions}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {Math.round((result.score / result.totalQuestions) * 100)}% correct
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">
                  Answer Review - Click on any question to see details
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Green = Correct ✓ | Red = Incorrect ✗
                </p>
              </div>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {tests.flatMap((passage) =>
                  Array.isArray(passage?.questions)
                    ? passage.questions.flatMap((group: any) =>
                      Array.isArray(group?.questions)
                        ? group.questions.map((q: any) => (
                          <QuestionResult
                            key={q.id}
                            question={q}
                            answer={answers[q.id]}
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
                          />
                        ))
                        : []
                    )
                    : []
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
