import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PenTool, RotateCcw, Send, Clock, TrendingUp, Star, Target, Sparkles, BookOpen, GraduationCap, ArrowLeft, CheckCircle, Timer as TimerIcon, Maximize2, X, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "../contexts/UserContext";
import backend from "~backend/client";
import { FeedbackSummaryView } from "@/components/writing/FeedbackSummaryView";
import { FeedbackContainer } from "@/components/writing/FeedbackContainer";
import { WritingFeedback } from "@/components/writing/WritingFeedback";
import type { EvaluationResult } from "@/types/writing-feedback";
import { TaskTypeIcon } from "@/components/writing/TaskTypeIcon";
import TradeConferenceMap from "@/components/writing/TradeConferenceMap";
import TownEvolutionMap from "@/components/writing/TownEvolutionMap";



// Mock Data for Writing Tests
const writingTests = [
  { id: 1, title: "Test 1", subtitle: "Academic Task 1", type: "Task 1", difficulty: "Medium", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/line_graph_internet.png", chartType: "Line Graph" },
  { id: 2, title: "Test 1", subtitle: "Academic Task 2", type: "Task 2", difficulty: "Hard", questions: 1, time: 40, taskType: 2, chartType: "Essay" },
  { id: 3, title: "Test 2", subtitle: "Academic Task 1", type: "Task 1", difficulty: "Easy", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/bar_chart_teenagers.png", chartType: "Bar Chart" },
  { id: 4, title: "Test 2", subtitle: "Academic Task 2", type: "Task 2", difficulty: "Hard", questions: 1, time: 40, taskType: 2, chartType: "Essay" },
  { id: 5, title: "Test 3", subtitle: "Academic Task 1", type: "Task 1", difficulty: "Medium", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/task1_bar_water_use_2010_2020.png", chartType: "Bar Chart" },
  { id: 6, title: "Test 3", subtitle: "Academic Task 2", type: "Task 2", difficulty: "Medium", questions: 1, time: 40, taskType: 2, chartType: "Essay" },
  { id: 7, title: "Test 4", subtitle: "Academic Task 1", type: "Task 1", difficulty: "Hard", questions: 1, time: 20, taskType: 1, chartType: "Map" },
  { id: 8, title: "Test 4", subtitle: "Academic Task 2", type: "Task 2", difficulty: "Easy", questions: 1, time: 40, taskType: 2, chartType: "Essay" },
  { id: 9, title: "Test 5", subtitle: "Academic Task 1", type: "Task 1", difficulty: "Medium", questions: 1, time: 20, taskType: 1, chartType: "Map", component: "TradeConferenceMap" },
  { id: 10, title: "Test 6", subtitle: "Academic Task 1", type: "Task 1", difficulty: "Medium", questions: 1, time: 20, taskType: 1, chartType: "Map", component: "TownEvolutionMap" },
];



interface WritingTaskProps {
  defaultTab?: "task-1" | "task-2";
}

export default function WritingTask({ defaultTab }: WritingTaskProps) {
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [content, setContent] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  // New State
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"editor" | "feedback">("editor");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const selectedTest = writingTests.find(t => t.id === selectedTestId);
  const taskType = selectedTest?.taskType || 1;

  const { data: prompt, refetch: getNewPrompt } = useQuery({
    queryKey: ["writingPrompt", taskType, selectedTest?.id],
    queryFn: () => {
      // @ts-ignore: Adding test_id to supported extended backend
      return backend.ielts.getWritingPrompt({ taskType, test_id: selectedTest?.id });
    },
    enabled: !!selectedTest,
  });

  // New: Split Feedback Flow State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  // 1. QUICK SCORE (Examiner Only)
  const handleQuickAnalysis = async () => {
    if (!user || !content.trim()) {
      toast({
        title: "Error",
        description: "Please write your response before analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAiAnalysis(null);

    try {
      // Use evaluate endpoint for Task 1, legacy for Task 2
      const isTask1 = taskType === 1;
      const endpoint = isTask1
        ? "http://localhost:8002/task1/evaluate"
        : "http://localhost:8001/ielts_writing/evaluate"; // Legacy fallback

      const requestBody = isTask1
        ? {
          essay: content.trim(),
          question: prompt?.prompt || "",
          student_name: user?.name || "Student",
          chart_type: selectedTest?.chartType || null,
          image_url: selectedTest?.imageUrl || null,
          previous_errors: null,
          attempt_number: 1,
          include_teacher_feedback: true,
          include_markdown: true
        }
        : {
          // Task 2 legacy body
          task_type: "task2",
          question: prompt?.prompt || "",
          essay: content.trim(),
          target_band: 7.0,
          user_id: user.id.toString(),
        };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();

      // Normalize Result
      let result: any = {};
      if (isTask1) {
        // Full evaluation response includes scores + teacher feedback
        result = {
          evaluation: {
            ...data.scores,
            word_count: content.split(/\s+/).length,
            word_count_ok: true,
            teacher_feedback_status: data.teacher_feedback_status, // Don't override! Backend sends correct status
            feedback_markdown: data.feedback_markdown || null,
            teacher_feedback: data.teacher_feedback || null,
            timing: data.timing || { examiner: 15.0, teacher: 30.0 }
          },
        };
      } else {
        // Legacy Task 2 (already full result)
        result = {
          evaluation: data.examiner_result,
          coaching: data.teacher_feedback, // Map if needed
          teacher_feedback_status: 'complete'
        };
      }

      setAiAnalysis(result);
      setViewMode("feedback");
      toast({ title: "Score Ready!", description: `Band ${result.evaluation?.overall_band}` });
      queryClient.invalidateQueries({ queryKey: ["progress"] });

    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Analysis failed. Please try again.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 2. DETAILED FEEDBACK (Teacher Agent)
  const handleGetDetailedFeedback = async () => {
    if (!aiAnalysis || !aiAnalysis.evaluation) return;

    setIsGeneratingFeedback(true);

    // Optimistic update
    setAiAnalysis((prev: any) => ({
      ...prev,
      evaluation: {
        ...prev.evaluation,
        teacher_feedback_status: 'loading'
      }
    }));

    try {
      const endpoint = "http://localhost:8002/task1/evaluate";
      const requestBody = {
        essay: content.trim(),
        question: prompt?.prompt || "",
        student_name: "Student",
        chart_type: selectedTest?.chartType || null,
        image_url: selectedTest?.imageUrl || null,
        include_teacher_feedback: true,
        include_markdown: true
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Feedback generation failed");

      const data = await response.json();

      if (data.success) {
        setAiAnalysis((prev: any) => ({
          ...prev,
          evaluation: {
            ...prev.evaluation,
            teacher_feedback: data.teacher_feedback,
            feedback_markdown: data.feedback_markdown,
            teacher_feedback_status: 'complete'
          }
        }));
      } else {
        throw new Error(data.error || "Unknown error");
      }

    } catch (error) {
      console.error(error);
      setAiAnalysis((prev: any) => ({
        ...prev,
        evaluation: {
          ...prev.evaluation,
          teacher_feedback_status: 'error',
          teacher_feedback_message: error instanceof Error ? error.message : "Failed to generate feedback"
        }
      }));
      toast({ title: "Error", description: "Could not generate detailed feedback.", variant: "destructive" });
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const getNewQuestion = () => {
    getNewPrompt();
    setContent("");
    setAiAnalysis(null);
    // Reset timer
    if (selectedTest) {
      setTimeLeft(selectedTest.time * 60);
    }
  };

  // Timer Logic
  useEffect(() => {
    if (isTestStarted && timeLeft > 0 && !aiAnalysis) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev: number) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTestStarted, timeLeft, aiAnalysis]);

  // Autosave Simulation
  useEffect(() => {
    if (content) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        setLastSaved(new Date());
      }, 1000);
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [content]);

  // Format Time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const wordCount = content.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
  // Dynamic color for word count
  const wordCountColor = wordCount >= (taskType === 1 ? 150 : 250)
    ? "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
    : "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800";
  const minWords = taskType === 1 ? 150 : 250;

  const getTaskDescription = (task: number) => {
    switch (task) {
      case 1:
        return "Academic Writing Task 1 (20 minutes) - Describe, summarize or explain information in a graph, table, chart or diagram. Minimum 150 words.";
      case 2:
        return "Writing Task 2 (40 minutes) - Write an essay in response to a point of view, argument or problem. Minimum 250 words.";
      default:
        return "";
    }
  };

  const handleStartTest = (testId?: number) => {
    setIsTestStarted(true);
    setContent("");
    setAiAnalysis(null);
    getNewPrompt();

    // Determine which test to start (passed ID or currently selected)
    const targetTestId = testId || selectedTestId;
    const testToStart = writingTests.find(t => t.id === targetTestId);

    // Start Timer
    if (testToStart) {
      setTimeLeft(testToStart.time * 60);
    }
  };

  const handleBackToMenu = () => {
    setIsTestStarted(false);
    setSelectedTestId(null);
  };

  return (
    <div className="max-w-[95vw] mx-auto space-y-8 pb-32">
      {/* Hero Section - Only show when not in a test */}
      {!isTestStarted && (
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
                Master IELTS Writing
              </h1>
              <p className="text-lg text-blue-100 leading-relaxed">
                Practice with authentic writing tasks, get instant AI analysis, and track your improvements.
                Receive detailed feedback on grammar, vocabulary, and coherence.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                  <PenTool className="w-5 h-5 text-blue-200" />
                  <span className="font-medium">{writingTests.length} Practice Tests</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                  <Clock className="w-5 h-5 text-blue-200" />
                  <span className="font-medium">20-40 Min / Task</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                  <GraduationCap className="w-5 h-5 text-blue-200" />
                  <span className="font-medium">Academic & General</span>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-2xl rotate-12 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                <PenTool className="w-16 h-16 text-white/90" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Selection Grid */}
      {!isTestStarted && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <PenTool className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Available Tests
            </h2>
            <div className="flex gap-2">
              <Badge variant="outline" className="px-3 py-1">All Levels</Badge>
              <Badge variant="outline" className="px-3 py-1">Academic</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {writingTests
              .filter(test => {
                if (defaultTab === "task-1") return test.taskType === 1;
                if (defaultTab === "task-2") return test.taskType === 2;
                return true;
              })
              .map((test) => {
                const isSelected = selectedTestId === test.id;
                // @ts-ignore
                const chartType = test.chartType || (test.taskType === 1 ? "Generic" : "Essay");

                // Dynamic accents based on difficulty/type
                const accentColor = test.difficulty === "Hard" ? "ring-rose-500/50" : test.difficulty === "Medium" ? "ring-amber-500/50" : "ring-emerald-500/50";

                return (

                  <div
                    key={test.id}
                    onClick={() => {
                      setSelectedTestId(test.id);
                      handleStartTest(test.id);
                    }}
                    className={`group relative h-[360px] rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden border
                      ${isSelected
                        ? "border-blue-500 bg-[#1e293b] shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/20"
                        : "border-slate-700 bg-[#1e293b] hover:border-slate-600 hover:shadow-lg hover:shadow-blue-900/5"
                      }
                    `}
                  >
                    {/* Content Container */}
                    <div className="relative h-full p-6 flex flex-col z-10">

                      {/* Header: Type Label */}
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase font-mono">
                          {chartType}
                        </span>
                        <Badge
                          variant="outline"
                          className={`border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-md
                              ${test.difficulty === "Hard" ? "border-rose-200/20 text-rose-300 bg-rose-500/5" :
                              test.difficulty === "Medium" ? "border-amber-200/20 text-amber-300 bg-amber-500/5" :
                                "border-emerald-200/20 text-emerald-300 bg-emerald-500/5"}
                            `}
                        >
                          {test.difficulty}
                        </Badge>
                      </div>

                      {/* Hero Visual - Centered */}
                      <div className="flex-1 flex items-center justify-center p-2">
                        <div className={`w-full h-full transition-all duration-500 transform ${isSelected ? "scale-105" : "grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105"}`}>
                          <TaskTypeIcon type={chartType} />
                        </div>
                      </div>

                      {/* Footer: Title & Layout */}
                      <div className="mt-6 pt-6 border-t border-slate-700/50">
                        <div className="flex justify-between items-end">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1.5 tracking-tight group-hover:text-blue-100 transition-colors">
                              {test.title}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium line-clamp-1">
                              {test.subtitle}
                            </p>
                          </div>

                          {/* Action Button - Minimal Arrow */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                ${isSelected ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40" : "bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-white"}`}
                          >
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                          </div>
                        </div>

                        {/* Metadata Row */}
                        <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-4">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{test.time} MIN</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Target className="w-3 h-3 text-slate-400" />
                            <span>{test.questions} Ques</span>
                          </div>
                        </div>

                        {/* Interactive Overlay for Start */}
                        {isSelected && (
                          <div className="absolute inset-0 z-20 cursor-pointer" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleStartTest(); }}></div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Writing Interface - Show when test is started */}
      {isTestStarted && selectedTest && (
        <div className="h-[calc(100vh-140px)] min-h-[600px] max-w-[1600px] mx-auto animate-in fade-in duration-500 flex flex-col">

          {/* Top Bar Navigation (Minimal) */}
          <div className="flex items-center justify-between mb-4 flex-none px-1">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBackToMenu} className="gap-2 pl-0 hover:pl-2 transition-all text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                Back to Tests
              </Button>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[300px] lg:max-w-none">
                {selectedTest.title}: {selectedTest.subtitle}
              </h2>
            </div>

            {/* Stats (Timer & Word Count) - Always Visible */}
            <div className="flex items-center gap-4">
              {/* Word Count Pill */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-colors ${wordCountColor}`}>
                <span className="text-xs font-bold uppercase tracking-wider">Words</span>
                <span className="text-base font-mono font-bold leading-none">{wordCount}</span>
                <span className="text-[10px] opacity-60 font-semibold">/ {minWords}</span>
              </div>

              {/* Timer Pill */}
              <div className={`flex items-center gap-3 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm ${timeLeft < 300 ? "animate-pulse border-rose-200 dark:border-rose-900" : ""}`}>
                <TimerIcon className={`w-4 h-4 ${timeLeft < 300 ? "text-rose-500" : "text-slate-400"}`} />
                <span className={`text-base font-mono font-bold leading-none ${timeLeft < 300 ? "text-rose-600 dark:text-rose-400" : "text-slate-700 dark:text-slate-200"}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          {viewMode === "feedback" && aiAnalysis && aiAnalysis.evaluation ? (
            <div className="h-full overflow-y-auto pr-2">
              <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" onClick={() => setViewMode("editor")} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Editor
                </Button>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    Analysis Complete: {aiAnalysis.evaluation.overall_band} Band
                  </span>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                {taskType === 1 ? (
                  <WritingFeedback
                    result={aiAnalysis.evaluation as EvaluationResult}
                    onRetryFeedback={handleGetDetailedFeedback}
                    isLoadingFeedback={isGeneratingFeedback}
                  />
                ) : (
                  <FeedbackContainer
                    evaluation={aiAnalysis.evaluation as EvaluationResult}
                    coaching={aiAnalysis.coaching}
                    essay={content.trim()}
                    taskType="task2"
                  />
                )}
              </div>
            </div>
          ) : (
            /* Main Split Layout */
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-8 h-full overflow-hidden pb-6">

              {/* Left Column: Prompt & Chart (Scrollable, Sticky behavior via internal scroll) */}
              <div className="lg:w-[45%] h-full overflow-y-auto pr-1 scrollbar-hide space-y-6">
                <Card className="border-0 shadow-none bg-transparent">
                  <div className="space-y-6">
                    {/* Collapsible Prompt Info */}
                    <details className="group bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 open:pb-4 transition-all">
                      <summary className="p-4 cursor-pointer flex items-center justify-between list-none text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                        <span>Task Instructions</span>
                        <span className="group-open:rotate-180 transition-transform duration-200">
                          <ArrowLeft className="w-4 h-4 -rotate-90" />
                        </span>
                      </summary>
                      <p className="px-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                        {getTaskDescription(taskType)}
                      </p>
                    </details>

                    {prompt ? (
                      <div className="space-y-6">
                        {/* Task Image - Enhanced Visuals */}
                        {
                          // @ts-ignore
                          selectedTest.imageUrl && (
                            <div
                              className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-black/40 shadow-sm transition-all duration-300 hover:shadow-md"
                              onClick={() => setIsImageZoomed(true)}
                            >
                              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Badge variant="secondary" className="cursor-pointer shadow-sm"><Maximize2 className="w-3 h-3 mr-1" /> Zoom</Badge>
                              </div>
                              <img
                                // @ts-ignore
                                src={selectedTest.imageUrl}
                                alt="Task Chart"
                                className="w-full h-auto object-contain max-h-[500px] opacity-90 group-hover:opacity-100 transition-opacity"
                              />
                              {/* Inner Shadow Overlay for depth */}
                              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl pointer-events-none"></div>
                            </div>
                          )
                        }

                        {/* Custom Component Mapping */}
                        {
                          // @ts-ignore
                          selectedTest.component === "TradeConferenceMap" && (
                            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-black/40 shadow-sm transition-all duration-300">
                              <TradeConferenceMap />
                            </div>
                          )
                        }

                        {
                          // @ts-ignore
                          selectedTest.component === "TownEvolutionMap" && (
                            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-black/40 shadow-sm transition-all duration-300">
                              <TownEvolutionMap />
                            </div>
                          )
                        }



                        {/* Question Box */}
                        <div className="bg-blue-50/50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/40 shadow-sm">
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Question
                          </h3>
                          <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed text-base font-serif">
                            {prompt.prompt}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-500">
                        Loading prompt...
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Right Column: Editor Area (Wide & Clean) */}
              <div className="lg:w-[55%] h-full flex flex-col min-h-0">

                {/* Editor Container (Centered & Constrained) */}
                <Card className="flex-1 flex flex-col h-full border border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden bg-white dark:bg-slate-900 rounded-xl">
                  <div className="flex-1 relative overflow-hidden flex flex-col">
                    <Textarea
                      placeholder="Start writing your response here..."
                      value={content}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                      className="flex-1 w-full mx-auto resize-none border-0 focus-visible:ring-0 p-8 text-lg leading-loose font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700 bg-transparent custom-scrollbar"
                      spellCheck={false}
                    />
                    {/* Floating Gradient Bottom Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none"></div>
                  </div>

                  {/* Editor Footer Action Bar - Redesigned */}
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between">
                    <div className="text-xs text-slate-400 flex items-center gap-2 font-medium">
                      {lastSaved && <span className="flex items-center gap-1.5"><Save className="w-3.5 h-3.5 text-emerald-500" /> Saved {lastSaved.toLocaleTimeString()}</span>}
                    </div>
                    <div className="flex gap-4">
                      {aiAnalysis && (
                        <Button
                          variant="ghost"
                          onClick={() => setViewMode("feedback")}
                          className="h-10 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                          View Previous Feedback
                        </Button>
                      )}
                      <Button
                        onClick={handleQuickAnalysis}
                        disabled={!content.trim() || isAnalyzing}
                        className="h-10 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold uppercase tracking-wide shadow-lg shadow-purple-500/20 rounded-lg transition-all transform hover:scale-[1.02]"
                      >
                        {isAnalyzing ? (
                          <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 animate-spin" /> Analyzing... (~30-45s)
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Analyze Essay
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>

              </div>
            </div>
          )}

          {/* Zoom Modal Re-implementation for Full Screen */}
          {isImageZoomed && selectedTest.imageUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={() => setIsImageZoomed(false)}>
              <button
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                aria-label="Close zoomed image"
              >
                <X className="w-8 h-8" />
              </button>
              {/* @ts-ignore */}
              <img src={selectedTest.imageUrl} alt="Zoomed Chart" className="max-w-full max-h-[95vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
