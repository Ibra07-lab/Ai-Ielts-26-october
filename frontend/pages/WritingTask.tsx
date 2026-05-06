import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PenTool, RotateCcw, Send, Clock, TrendingUp, Star, Target, Sparkles, BookOpen, GraduationCap, ArrowLeft, ArrowRight, CheckCircle, Timer as TimerIcon, Maximize2, X, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "../contexts/UserContext";
import backend from "@/backend";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { FeedbackSummaryView } from "@/components/writing/FeedbackSummaryView";
import { FeedbackContainer } from "@/components/writing/FeedbackContainer";
import { WritingFeedback } from "@/components/writing/WritingFeedback";
import type { EvaluationResult } from "@/types/writing-feedback";
import { TaskTypeIcon } from "@/components/writing/TaskTypeIcon";
import TradeConferenceMap from "@/components/writing/TradeConferenceMap";
import TownEvolutionMap from "@/components/writing/TownEvolutionMap";
import CropYieldTable from "@/components/writing/CropYieldTable";
import SecondarySchoolTable from "@/components/writing/SecondarySchoolTable";
import { AnalysisLoader } from "@/components/ui/analysis-loader";



// Mock Data for Writing Tests
const writingTests = [
  // --- Task 1 Tests (20) ---
  { id: 1, title: "Test 1", subtitle: "Academic Task 1", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/line_graph_internet.png", chartType: "Line Graph" },
  { id: 3, title: "Test 2", subtitle: "Academic Task 1", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/bar_chart_teenagers.png", chartType: "Bar Chart" },
  { id: 5, title: "Test 3", subtitle: "Academic Task 1", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/task1_bar_water_use_2010_2020.png", chartType: "Bar Chart" },
  { id: 7, title: "Test 4", subtitle: "Academic Task 1", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/transport_commuters.png", chartType: "Line Graph" },
  { id: 9, title: "Test 5", subtitle: "Test 20: Mixed Charts", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/energy_consumption_costs.png", chartType: "Mixed Chart" },
  { id: 10, title: "Test 6", subtitle: "Academic Task 1", type: "Task 1", questions: 1, time: 20, taskType: 1, chartType: "Table", component: "CropYieldTable" },
  { id: 11, title: "Test 7", subtitle: "Cinema Attendance", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/cinema_attendance_age.png", chartType: "Line Graph" },
  { id: 12, title: "Test 8", subtitle: "Ocean Temperature", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/ocean_temp_anomalies.png", chartType: "Dual Line Graph" },
  { id: 13, title: "Test 9", subtitle: "Screen Time", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/screen_time_comparison.png", chartType: "Dual Axis Graph" },
  { id: 14, title: "Test 10", subtitle: "Carbon Emissions", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/carbon_emissions_sector.png", chartType: "Bar Chart" },
  { id: 15, title: "Test 11", subtitle: "University Apps", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/university_applications_uk.png", chartType: "Bar Chart" },
  { id: 16, title: "Test 12", subtitle: "Waste Composition", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/waste_composition_cities.png", chartType: "Stacked Bar Chart" },
  { id: 17, title: "Test 13", subtitle: "Government Budget", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/government_budget_allocation.png", chartType: "Pie Chart" },
  { id: 18, title: "Test 14", subtitle: "Tourist Spending", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/tourist_spending_patterns.png", chartType: "Pie Chart" },
  { id: 19, title: "Test 15", subtitle: "Marine Pollution", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/marine_pollution_sources.png", chartType: "Pie Chart" },
  { id: 20, title: "Test 16", subtitle: "Healthcare Metrics", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/healthcare_metrics_table.png", chartType: "Table" },
  { id: 21, title: "Test 17", subtitle: "Museum Statistics", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/museum_statistics_table.png", chartType: "Table" },
  { id: 22, title: "Test 18", subtitle: "Rainwater Harvesting", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/rainwater_harvesting_diagram.png", chartType: "Process Diagram" },
  { id: 23, title: "Test 19", subtitle: "Coffee Production", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/coffee_production_simple.png", chartType: "Process Diagram" },
  { id: 24, title: "Test 20", subtitle: "Tech Access", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/tech_access_bar_chart.png", chartType: "Bar Chart" },
  { id: 41, title: "Test 21", subtitle: "The Proportions of Pupils Attending Four Secondary School Types Between Between 2000 and 2009.", type: "Task 1", questions: 1, time: 20, taskType: 1, chartType: "Table", component: "SecondarySchoolTable" },
  { id: 42, title: "Test 22", subtitle: "Meadowside Village and Fonton Maps", type: "Task 1", questions: 1, time: 20, taskType: 1, imageUrl: "/charts/meadowside_fonton_maps.jpg", chartType: "Map" },

  // --- Task 2 Tests (20) ---
  { id: 2, title: "Test 1", subtitle: "Education: Homework", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 4, title: "Test 2", subtitle: "Technology: AI & Jobs", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 6, title: "Test 3", subtitle: "Environment: Carbon Footprint", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 8, title: "Test 4", subtitle: "Health: Sports Facilities", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 25, title: "Test 5", subtitle: "Urbanization: Traffic", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 26, title: "Test 6", subtitle: "Globalization: Local Economies", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 27, title: "Test 7", subtitle: "Education: Foreign Languages", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 28, title: "Test 8", subtitle: "Crime: Purpose of Prison", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 29, title: "Test 9", subtitle: "Technology: Social Media", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 30, title: "Test 10", subtitle: "Work: Remote Work", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 31, title: "Test 11", subtitle: "Education: Online Courses", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 32, title: "Test 12", subtitle: "Tourism: Historic Sites", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 33, title: "Test 13", subtitle: "Environment: Air Pollution", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 34, title: "Test 14", subtitle: "Health: Obesity Rates", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 35, title: "Test 15", subtitle: "Urbanization: Housing", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 36, title: "Test 16", subtitle: "Education: Youth Employment", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 37, title: "Test 17", subtitle: "Technology: Online Shopping", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 38, title: "Test 18", subtitle: "Family: Working Parents", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 39, title: "Test 19", subtitle: "Environment: Water Shortages", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
  { id: 40, title: "Test 20", subtitle: "Culture: Traditional Festivals", type: "Task 2", questions: 1, time: 40, taskType: 2, chartType: "Essay", imageUrl: undefined, component: undefined },
];



interface WritingTaskProps {
  defaultTab?: "task-1" | "task-2";
}

export default function WritingTask({ defaultTab }: WritingTaskProps) {
  const location = useLocation();
  const roadmapTask = location.state?.roadmapTask;

  // Derive a custom test if roadmapTask exists (fallback for old roadmaps)
  const customTest = React.useMemo(() => {
    if (!roadmapTask) return null;
    
    // If backend provided a real contentId, we don't need a custom test
    if (roadmapTask.contentId && !isNaN(Number(roadmapTask.contentId))) {
      return null;
    }

    const isTask1 = defaultTab === "task-1" || (roadmapTask.title || '').toLowerCase().includes('task 1');
    return {
      id: 99999,
      title: roadmapTask.title || (isTask1 ? "Task 1" : "Task 2"),
      subtitle: roadmapTask.subtitle || "Personalized Practice",
      type: isTask1 ? "Task 1" : "Task 2",
      questions: 1,
      time: isTask1 ? 20 : 40,
      taskType: isTask1 ? 1 : 2,
      chartType: "Essay",
      customPrompt: roadmapTask.description || roadmapTask.subtitle || "Practice Question",
      imageUrl: undefined,
    };
  }, [roadmapTask, defaultTab]);

  const initialTestId = roadmapTask?.contentId && !isNaN(Number(roadmapTask.contentId))
    ? Number(roadmapTask.contentId)
    : (customTest ? customTest.id : null);

  const [selectedTestId, setSelectedTestId] = useState<number | null>(initialTestId);
  const [isTestStarted, setIsTestStarted] = useState(!!roadmapTask);
  const [content, setContent] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  // New State
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"editor" | "feedback">("editor");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { user, session } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ─── Essay limits ───────────────────────────────────────────────────────────
  const { data: essayLimits, refetch: refetchLimits } = useQuery({
    queryKey: ["essayLimits", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      // @ts-ignore
      return backend.ielts.getEssayLimits(user.id); // pass string directly
    },
    enabled: !!user?.id,
    staleTime: 0,
  });

  const limitRemaining = essayLimits?.remaining ?? null;
  const limitPlan = essayLimits?.plan ?? "free";
  const limitTotal = essayLimits?.limit ?? 2;
  const limitUsed = essayLimits?.essaysUsed ?? 0;


  const selectedTest = (customTest && selectedTestId === customTest.id) 
    ? customTest 
    : writingTests.find(t => t.id === selectedTestId);
  const taskType = selectedTest?.taskType || 1;
  // @ts-ignore
  const hasVisualContent = taskType === 1 || !!selectedTest?.imageUrl || !!selectedTest?.component;

  const { data: prompt, refetch: getNewPrompt } = useQuery({
    queryKey: ["writingPrompt", taskType, selectedTest?.id],
    queryFn: async () => {
      // @ts-ignore
      if (selectedTest?.customPrompt) {
        // @ts-ignore
        return { prompt: selectedTest.customPrompt, chartMetadata: null };
      }
      // @ts-ignore: Adding test_id to supported extended backend
      return backend.ielts.getWritingPrompt(taskType, { test_id: selectedTest?.id });
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

    // ─── Check & lock BEFORE touching the Python service ──────────────────
    try {
      // @ts-ignore
      await backend.ielts.checkAndLockEssay();
    } catch (lockErr: any) {
      // Check if it's a real limit error (Resource Exhausted) or a connectivity error
      const isLimitError = lockErr?.status === 429 || lockErr?.message?.toLowerCase().includes("limit");
      const isOfflineError = lockErr?.status === 404 || lockErr?.status === 502 || lockErr?.status === 504 || lockErr?.message?.includes("offline");

      toast({
        title: isLimitError ? "Limit reached" : isOfflineError ? "Connection lost" : "System busy",
        description: isOfflineError
          ? "The server seems to be offline or the connection was lost. Please check your internet or refresh the page."
          : (lockErr?.message ?? "Cannot start analysis."),
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAiAnalysis(null);

    let analysisSuccess = false;
    try {
      // Use evaluate endpoint for Task 1, legacy for Task 2
      const isTask1 = taskType === 1;
      const API_BASE = import.meta.env.VITE_FASTAPI_WRITING_URL || "";
      const endpoint = isTask1
        ? `${API_BASE}/task1/evaluate`
        : `${API_BASE}/task2/evaluate`; // Updated to new Task 2 pipeline

      const requestBody = isTask1
        ? {
          essay: content.trim(),
          question: prompt?.prompt || "",
          student_name: user?.name || "Student",
          chart_type: selectedTest?.chartType || null,
          image_url: selectedTest?.imageUrl || null,
          image_description: prompt?.chartMetadata || null,
          previous_errors: null,
          attempt_number: 1,
          include_teacher_feedback: true,
          include_markdown: true
        }
        : {
          // Task 2 new pipeline body
          question: prompt?.prompt || "Practice Question",
          essay: content.trim(),
        };

      // Get auth token for backend
      const { data: { session } } = await supabase.auth.getSession();
      const authHeaders: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (session?.access_token) {
        authHeaders["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        // Try to surface backend error details instead of a generic message
        let message = "Analysis failed";
        try {
          const err = await response.json();
          console.error("Backend Error Details:", err);
          if (err?.detail?.traceback) {
            console.error("BACKEND TRACEBACK:", err.detail.traceback);
            // Dump to alert just to be absolutely sure user sees it if DevTools is closed
            alert("BACKEND CRASH TRACEBACK:\n\n" + (err.detail.traceback.substring(0, 500) + "... Look in console for full trace"));
          }
          message = err?.detail?.message || err?.detail?.error || err?.message || message;
        } catch {
          // ignore parse errors
        }
        throw new Error(message);
      }

      const data = await response.json();

      // Normalize Result
      let result: any = {};

      const evalData = data.evaluation;
      const explainData = data.explanation || {};
      const coachData = data.coaching || {};

      if (isTask1) {
        result = {
          evaluation: {
            overall_band: evalData.overall_band,
            band_range: evalData.band_range,
            criterion_scores: evalData.criterion_scores.map((c: any) => ({
              criterion: c.criterion,
              band: c.band,
              justification: c.justification
            })),
            word_count: evalData.word_count,
            word_count_ok: evalData.word_count_ok,
            score_overview: evalData.score_overview,
            teacher_feedback_status: 'complete',
          },
          coaching: {
            action_plan: coachData?.the_one_big_change ? [
              coachData.the_one_big_change.change_statement,
              coachData.micro_drill ? `Drill: ${coachData.micro_drill.drill_name} (${coachData.micro_drill.time_limit_minutes} min)` : "",
            ].filter(Boolean) : [],
            strengths: [coachData?.diagnosis_summary?.strength_acknowledged].filter(Boolean),
            weaknesses: [coachData?.diagnosis_summary?.core_limitation].filter(Boolean),
            grammar_errors: (explainData.micro_fixes || [])
              .filter((f: any) => f.error_type === 'grammar' || f.error_type === 'punctuation' || f.error_type === 'style')
              .map((f: any) => ({
                original: f.original_sentence,
                corrected: f.corrected_sentence,
                explanation: f.explanation,
                tip: f.specific_error || "Watch out for this error pattern."
              })),
            vocabulary_suggestions: [
              ...(explainData.micro_fixes || [])
                .filter((f: any) => f.error_type === 'vocabulary')
                .map((f: any) => ({
                  original: f.original_sentence,
                  better_options: [f.corrected_sentence].filter(Boolean),
                  context: f.explanation
                })),
              ...(explainData.vocabulary_feedback?.word_upgrades || [])
                .map((u: any) => ({
                  original: u.basic_phrase,
                  better_options: u.upgrade_options && u.upgrade_options.length > 0 ? u.upgrade_options : [u.best_fit],
                  context: `Context: "${u.context_sentence}"\n\nImproved: "${u.improved_sentence}"`
                }))
            ],
            coherence_issues: (explainData.cohesion_fixes || []).map((c: any) => ({
              text: c.original_sentence,
              suggestion: c.improved_sentence,
              reason: c.technique_explanation
            })),
            raw_coach_output: coachData,
            raw_explainer_output: explainData,
            topic_analysis: coachData?.topic_analysis || [],
            topic_vocabulary: coachData?.topic_vocabulary || undefined,
            coherence_advice: coachData?.coherence_advice || undefined,
            score_context: coachData?.score_context,
            root_cause_analysis: coachData?.root_cause_analysis,
            diagnosis_summary: coachData?.diagnosis_summary,
            the_one_big_change: coachData?.the_one_big_change,
            pattern_breaker: coachData?.pattern_breaker,
            micro_drill: coachData?.micro_drill,
            next_essay_plan: coachData?.next_essay_plan,
            motivation: coachData?.motivation,
          }
        };
      } else {
        result = {
          evaluation: {
            overall_band: evalData.band_scores.overall,
            band_range: { low: evalData.band_scores.overall, high: evalData.band_scores.overall },
            criterion_scores: [
              { criterion: "task_response", band: evalData.band_scores.task_response, justification: evalData.analysis.thesis_analysis.thesis_quality ? `Thesis: ${evalData.analysis.thesis_analysis.thesis_quality.replace(/_/g, ' ')}` : "Refer to detailed feedback." },
              { criterion: "coherence_cohesion", band: evalData.band_scores.coherence_cohesion, justification: evalData.analysis.linker_audit.cohesion_verdict ? `Cohesion: ${evalData.analysis.linker_audit.cohesion_verdict.replace(/_/g, ' ')}` : "Refer to detailed feedback." },
              { criterion: "lexical_resource", band: evalData.band_scores.lexical_resource, justification: evalData.analysis.vocabulary_range ? `Vocabulary Range: ${evalData.analysis.vocabulary_range.replace(/_/g, ' ')}` : "Refer to detailed feedback." },
              { criterion: "grammatical_range_accuracy", band: evalData.band_scores.grammatical_range_accuracy, justification: evalData.analysis.grammar_audit.error_type ? `Grammar: ${evalData.analysis.grammar_audit.error_type.replace(/_/g, ' ')}` : "Refer to detailed feedback." },
            ],
            word_count: evalData.word_count,
            word_count_ok: evalData.word_count >= 250,
            teacher_feedback_status: 'complete',
            detailed_feedback: evalData.detailed_feedback
          },
          coaching: {
            action_plan: [
              coachData.the_one_big_change ? coachData.the_one_big_change.change_statement : "",
              coachData.micro_drill ? `Drill: ${coachData.micro_drill.drill_name} (${coachData.micro_drill.time_limit_minutes} min)` : "",
              coachData.score_context?.realistic_next_target ? `Next Target: Band ${coachData.score_context.realistic_next_target}` : "Keep practicing"
            ].filter(Boolean),
            strengths: [coachData.diagnosis_summary?.strength_acknowledged].filter(Boolean),
            weaknesses: explainData.priority_summary
              ? explainData.priority_summary.map((p: any) =>
                `**${p.area}**: ${p.current_problem} ${p.action_step}`
              )
              : [coachData.diagnosis_summary?.core_limitation].filter(Boolean),
            grammar_errors: (explainData.micro_feedback || [])
              .filter((f: any) => (f.error_type === 'grammar' || f.error_type === 'punctuation' || f.issue_type === 'grammar') && f.corrected_sentence)
              .map((f: any) => ({
                original: f.original_sentence || f.quote,
                corrected: f.corrected_sentence || f.correction,
                explanation: f.explanation,
                tip: "Watch for this grammar pattern."
              })),
            vocabulary_suggestions: [
              ...(explainData.micro_feedback || [])
                .filter((f: any) => f.error_type === 'vocabulary' && (f.corrected_sentence || f.correction))
                .map((f: any) => ({
                  original: f.original_sentence || f.quote,
                  better_options: [f.corrected_sentence || f.correction],
                  context: f.explanation
                })),
              ...(explainData.vocabulary_feedback?.word_upgrades || [])
                .filter((u: any) => u.upgrade_options && u.upgrade_options.length > 0)
                .map((u: any) => ({
                  original: u.basic_word,
                  better_options: u.upgrade_options,
                  context: u.why_best_fit
                }))
            ],
            coherence_issues: [
              ...(explainData.micro_feedback || [])
                .filter((f: any) => f.error_type === 'cohesion' || f.error_type === 'coherence')
                .map((f: any) => ({
                  text: f.original_sentence || f.quote,
                  suggestion: f.corrected_sentence || f.correction,
                  reason: f.explanation
                })),
              ...(explainData.cohesion_fixes || []).map((c: any) => ({
                text: c.original_sentence,
                suggestion: c.improved_sentence,
                reason: c.technique_explanation
              }))
            ],
            raw_coach_output: coachData,
            raw_explainer_output: explainData,
            topic_analysis: coachData.topic_analysis || [],
            topic_vocabulary: coachData.topic_vocabulary || undefined,
            coherence_advice: coachData.coherence_advice || undefined,
            score_context: coachData.score_context,
            root_cause_analysis: coachData.root_cause_analysis,
            diagnosis_summary: coachData.diagnosis_summary,
            the_one_big_change: coachData.the_one_big_change,
            pattern_breaker: coachData.pattern_breaker,
            micro_drill: coachData.micro_drill,
            next_essay_plan: coachData.next_essay_plan,
            motivation: coachData.motivation
          },
          teacher_feedback_status: 'complete'
        };
      }

      setAiAnalysis(result);
      setViewMode("feedback");

      // Mark as success only if we got a real band score back
      analysisSuccess = result !== null && result.evaluation?.overall_band !== undefined;

      // Evaluation saving now happens automatically via the Python pipeline API

      toast({ title: "Score Ready!", description: `Band ${result.evaluation?.overall_band}` });
      queryClient.invalidateQueries({ queryKey: ["progress"] });

    } catch (error) {
      console.error(error);
      analysisSuccess = false;
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Analysis failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      // ─── Always unlock, only charge on real success ────────────────────
      try {
        // @ts-ignore
        await backend.ielts.completeEssayAnalysis({ success: analysisSuccess });
        await refetchLimits();
      } catch { /* swallow unlock errors — user is not permanently stuck */ }
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
      const API_BASE = import.meta.env.VITE_FASTAPI_WRITING_URL || "";
      const endpoint = `${API_BASE}/task1/evaluate`;
      const requestBody = {
        essay: content.trim(),
        question: prompt?.prompt || "",
        student_name: user?.name || "Student",
        chart_type: selectedTest?.chartType || null,
        image_url: selectedTest?.imageUrl || null,
        image_description: prompt?.chartMetadata || null,
        include_teacher_feedback: true,
        include_markdown: true
      };

      // Get auth token for backend
      const { data: { session } } = await supabase.auth.getSession();
      const authHeaders: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (session?.access_token) {
        authHeaders["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let message = "Feedback generation failed";
        try {
          const err = await response.json();
          message = err?.detail?.message || err?.detail?.error || err?.message || message;
        } catch {
          // ignore parse errors
        }
        throw new Error(message);
      }

      const data = await response.json();

      if (data?.success) {
        const status = data.teacher_feedback_status || (data.feedback_markdown ? "complete" : "error");
        setAiAnalysis((prev: any) => ({
          ...prev,
          evaluation: {
            ...prev.evaluation,
            teacher_feedback: data.teacher_feedback,
            feedback_markdown: data.feedback_markdown,
            teacher_feedback_status: status,
            teacher_feedback_message: data.teacher_feedback_message || prev.evaluation?.teacher_feedback_message
          }
        }));
      } else {
        throw new Error(data?.error || "Unknown error");
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

  // Set initial timer if loaded from roadmap customTest or backend contentId
  useEffect(() => {
    if (roadmapTask && isTestStarted && timeLeft === 0 && !aiAnalysis) {
      if (customTest) {
        setTimeLeft(customTest.time * 60);
      } else if (selectedTest) {
        setTimeLeft(selectedTest.time * 60);
      }
    }
  }, [customTest, selectedTest, isTestStarted, roadmapTask]);

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
    const targetTestId = testId || selectedTestId;
    if (targetTestId) {
      setSelectedTestId(targetTestId);
    }

    // Skip session guide and start writing immediately
    setContent("");
    setAiAnalysis(null);
    setIsTestStarted(true);

    // Find test to set initial timer
    const test = (customTest && targetTestId === customTest.id) 
      ? customTest 
      : writingTests.find(t => t.id === targetTestId);
    if (test) {
      setTimeLeft(test.time * 60);
    }
  };


  const handleBackToMenu = () => {
    setIsTestStarted(false);
    setSelectedTestId(null);
  };


  return (
    <div className={isTestStarted ? cn("max-w-[95vw] mx-auto", viewMode === "feedback" ? "py-2" : "space-y-8 pb-32") : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-32"}>
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

                return (

                  <div
                    key={test.id}
                    onClick={() => {
                      setSelectedTestId(test.id);
                      handleStartTest(test.id);
                    }}
                    className={`group relative h-[400px] rounded-[32px] transition-all duration-500 cursor-pointer overflow-hidden border
                      ${isSelected
                        ? "border-blue-500 bg-white shadow-2xl shadow-blue-500/10 ring-1 ring-blue-500/20"
                        : "border-slate-100 bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-slate-200/40"
                      }
                      dark:bg-slate-900 dark:border-slate-800
                    `}
                  >
                    {/* Content Container */}
                    <div className="relative h-full p-8 flex flex-col z-10">

                      {/* Header: Type Label */}
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[11px] font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase font-sans">
                          {test.taskType === 2 ? "ESSAY" : chartType}
                        </span>
                      </div>

                      {/* Hero Visual - Large Centered Circle */}
                      <div className="flex-1 flex items-center justify-center">
                        <div className={`aspect-square w-44 rounded-full flex items-center justify-center transition-all duration-700 transform 
                          ${isSelected ? "bg-blue-50 dark:bg-blue-900/10 scale-105" : "bg-blue-50/50 dark:bg-slate-800/50 group-hover:bg-blue-50 group-hover:scale-110"}
                        `}>
                          <div className="w-24 h-24">
                            <TaskTypeIcon type={test.taskType === 2 ? "Essay" : chartType} />
                          </div>
                        </div>
                      </div>

                      {/* Footer: Title & Action */}
                      <div className="mt-8">
                        <div className="flex justify-between items-end">
                          <div className="flex-1 mr-4">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {test.title}
                            </h3>
                            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                              {test.subtitle}
                            </p>
                          </div>

                          {/* Action Button - Premium Pill */}
                          <div className={`px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 font-bold text-xs tracking-wide
                                ${isSelected
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40"
                              : "bg-blue-600/90 text-white opacity-90 group-hover:opacity-100 group-hover:shadow-lg group-hover:shadow-blue-500/30"
                            }`}
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            VIEW
                          </div>
                        </div>

                        {/* Metadata Row */}
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800">
                            <Clock className="w-3 h-3" />
                            <span>{test.time} MIN</span>
                          </div>
                          {test.taskType !== 2 && (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800">
                              <Target className="w-3 h-3" />
                              <span>{test.questions} QUES</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Interactive Overlay for Start */}
                      {isSelected && (
                        <div className="absolute inset-0 z-20 cursor-pointer" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleStartTest(); }}></div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Writing Interface - Show when test is started */}
      {isTestStarted && selectedTest && (
        <div className={cn(
          "w-full animate-in fade-in duration-500 flex flex-col transition-all duration-300",
          viewMode === "feedback" ? "min-h-[100dvh] lg:h-[calc(100vh-130px)]" : "min-h-[100dvh] lg:h-[calc(100vh-140px)] px-4 md:px-8 max-w-full ml-0"
        )}>

          {/* Top Bar Navigation (Minimal) - Hide in feedback mode */}
          {viewMode !== "feedback" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 flex-none px-1 gap-4 sm:gap-0">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={handleBackToMenu} className="gap-2 pl-0 hover:pl-2 transition-all text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white shrink-0">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-[300px] lg:max-w-none">
                  {selectedTest.title}: {selectedTest.subtitle}
                </h2>
              </div>

              {/* Stats (Timer & Word Count & Essay Limit) - Always Visible */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                {/* Word Count Pill */}
                <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border shadow-sm transition-colors ${wordCountColor}`}>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:inline">Words</span>
                  <span className="text-sm sm:text-base font-mono font-bold leading-none">{wordCount}</span>
                  <span className="text-[10px] opacity-60 font-semibold hidden sm:inline">/ {minWords}</span>
                </div>

                {/* Essay Limit Pill */}
                {limitRemaining !== null && (
                  <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border shadow-sm font-bold text-[10px] sm:text-xs ${limitRemaining === 0
                      ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400"
                      : limitRemaining === 1
                        ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}>
                    <span className="uppercase tracking-wider hidden sm:inline">Essays</span>
                    <span className="font-mono text-sm sm:text-base font-black leading-none">{limitUsed}</span>
                    <span className="opacity-60 hidden sm:inline">/ {limitTotal}</span>
                  </div>
                )}

                {/* Timer Pill */}
                <div className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm ${timeLeft < 300 ? "animate-pulse border-rose-200 dark:border-rose-900" : ""}`}>
                  <TimerIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${timeLeft < 300 ? "text-rose-500" : "text-slate-400"}`} />
                  <span className={`text-sm sm:text-base font-mono font-bold leading-none ${timeLeft < 300 ? "text-rose-600 dark:text-rose-400" : "text-slate-700 dark:text-slate-200"}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {viewMode === "feedback" && aiAnalysis && aiAnalysis.evaluation ? (
            <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
              <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
                {taskType === 1 ? (
                  <FeedbackContainer
                    evaluation={aiAnalysis.evaluation as EvaluationResult}
                    coaching={aiAnalysis.coaching}
                    essay={content.trim()}
                    taskType="task1"
                    onBack={() => setViewMode("editor")}
                  />
                ) : (
                  <FeedbackContainer
                    evaluation={aiAnalysis.evaluation as EvaluationResult}
                    coaching={aiAnalysis.coaching}
                    essay={content.trim()}
                    taskType="task2"
                    onBack={() => setViewMode("editor")}
                  />
                )}
              </div>
            </div>
          ) : (
            /* Main Split Layout */
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 lg:gap-8 lg:h-full lg:overflow-hidden pb-6">

              {/* Left Column: Prompt & Chart (Flex Column, No page scroll on LG) */}
              <div className="w-full lg:w-[45%] flex-none lg:flex-shrink-0 min-w-0 h-auto lg:h-full flex flex-col lg:pr-1 gap-2 sm:gap-4">
                <Card className="flex-none lg:flex-1 border-0 shadow-none bg-transparent flex flex-col min-h-0">
                  <div className="flex flex-col h-full gap-4">
                    {/* Collapsible Prompt Info - Compact Header */}
                    <details className="group bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 open:pb-4 transition-all flex-none">
                      <summary className="p-3 cursor-pointer flex items-center justify-between list-none text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                        <span>Task Instructions</span>
                        <span className="group-open:rotate-180 transition-transform duration-200">
                          <ArrowLeft className="w-4 h-4 -rotate-90" />
                        </span>
                      </summary>
                      <p className="px-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {getTaskDescription(taskType)}
                      </p>
                    </details>

                    {prompt ? (
                      <div className="flex-none lg:flex-1 flex flex-col gap-4 min-h-0">
                        {/* 1. VISUAL CONTENT (Main Focus, Flex-1) - Only show if exists */}
                        {hasVisualContent && (
                          <div className="h-[250px] sm:h-[300px] lg:h-auto lg:flex-1 min-h-0 relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-black/40 shadow-sm overflow-hidden flex flex-col">
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                              {/* Task Image */}
                              {
                                // @ts-ignore
                                selectedTest.imageUrl && (
                                  <div
                                    className="group relative h-full w-full flex items-center justify-center bg-white rounded-lg overflow-hidden"
                                    onClick={() => setIsImageZoomed(true)}
                                  >
                                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Badge variant="secondary" className="cursor-pointer shadow-sm"><Maximize2 className="w-3 h-3 mr-1" /> Zoom</Badge>
                                    </div>
                                    <img
                                      // @ts-ignore
                                      src={selectedTest.imageUrl}
                                      alt="Task Chart"
                                      className="w-full h-full object-contain cursor-pointer"
                                    />
                                  </div>
                                )
                              }

                              {/* Custom Components */}
                              {
                                // @ts-ignore
                                selectedTest.component === "TradeConferenceMap" && <TradeConferenceMap />
                              }
                              {
                                // @ts-ignore
                                selectedTest.component === "TownEvolutionMap" && <TownEvolutionMap />
                              }
                              {
                                // @ts-ignore
                                selectedTest.component === "CropYieldTable" && <CropYieldTable />
                              }
                              {
                                // @ts-ignore
                                selectedTest.component === "SecondarySchoolTable" && <SecondarySchoolTable />
                              }
                            </div>
                          </div>
                        )}

                        {/* 2. QUESTION BOX (Bottom) */}
                        {/* If no visual content/Task 2, this expands to fill space (flex-1). Otherwise compact (flex-none) */}
                        <div className={`
                          ${hasVisualContent ? "flex-none max-h-[250px] lg:max-h-[30%]" : "flex-none h-fit w-full"} 
                          bg-blue-50/50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-xl border border-blue-100 dark:border-blue-800/40 shadow-sm overflow-y-auto
                        `}>
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2 text-sm">
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
              <div className="w-full lg:flex-1 flex-none lg:min-w-0 h-[400px] sm:h-[500px] lg:h-full flex flex-col min-h-0 mt-2 sm:mt-0">

                {/* Editor Container (Centered & Constrained) */}
                <Card className="flex-1 flex flex-col h-full border border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden bg-white dark:bg-slate-900 rounded-xl">
                  <div className="flex-1 relative overflow-hidden flex flex-col">
                    <Textarea
                      placeholder="Start writing your response here..."
                      value={content}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                      className="flex-1 w-full mx-auto resize-none border-0 focus-visible:ring-0 p-4 sm:p-8 leading-relaxed sm:leading-loose text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700 bg-transparent custom-scrollbar"
                      style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px' }}
                      spellCheck={false}
                    />
                    {/* Floating Gradient Bottom Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none"></div>
                  </div>

                  {/* Editor Footer Action Bar - Redesigned */}
                  <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                    <div className="text-xs text-slate-400 flex items-center gap-2 font-medium w-full sm:w-auto justify-center sm:justify-start">
                      {lastSaved && <span className="flex items-center gap-1.5"><Save className="w-3.5 h-3.5 text-emerald-500" /> Saved {lastSaved.toLocaleTimeString()}</span>}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                      {aiAnalysis && (
                        <Button
                          variant="ghost"
                          onClick={() => setViewMode("feedback")}
                          className="h-10 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-800 w-full sm:w-auto"
                        >
                          View Previous Feedback
                        </Button>
                      )}

                      {/* Last-essay warning */}
                      {limitRemaining === 1 && (
                        <span className="text-xs font-semibold text-amber-500 dark:text-amber-400 flex items-center justify-center gap-1">
                          ⚠️ Last free analysis
                        </span>
                      )}

                      {/* No essays left — show upgrade link instead of button */}
                      {limitRemaining === 0 ? (
                        <div className="flex flex-col items-center sm:items-end gap-1 w-full sm:w-auto">
                          <Button
                            disabled
                            aria-label="Upgrade to analyze more"
                            className="h-10 px-8 w-full sm:w-auto bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide rounded-lg cursor-not-allowed"
                          >
                            Upgrade to analyze more
                          </Button>
                          <a href="/subscription" className="text-[11px] text-indigo-400 hover:underline">
                            View plans →
                          </a>
                        </div>
                      ) : (
                        <Button
                          onClick={handleQuickAnalysis}
                          disabled={!content.trim() || isAnalyzing}
                          aria-label="Analyze Essay"
                          className="h-10 px-8 w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold uppercase tracking-wide shadow-lg shadow-purple-500/20 rounded-lg transition-all transform hover:scale-[1.02]"
                        >
                          {isAnalyzing ? (
                            <AnalysisLoader />
                          ) : (
                            <span className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4" /> Analyze Essay
                            </span>
                          )}
                        </Button>
                      )}
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
