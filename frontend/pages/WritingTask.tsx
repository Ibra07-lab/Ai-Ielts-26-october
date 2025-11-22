import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PenTool, RotateCcw, Send, Clock, TrendingUp, Star, Target, Sparkles, BookOpen, GraduationCap, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "../contexts/UserContext";
import backend from "~backend/client";

// Mock Data for Writing Tests
const writingTests = [
  { id: 1, title: "Test 1", subtitle: "Academic Task 1", type: "Task 1", difficulty: "Medium", questions: 1, time: 20, taskType: 1 },
  { id: 2, title: "Test 2", subtitle: "Academic Task 2", type: "Task 2", difficulty: "Hard", questions: 1, time: 40, taskType: 2 },
  { id: 3, title: "Test 3", subtitle: "Academic Task 1", type: "Task 1", difficulty: "Easy", questions: 1, time: 20, taskType: 1 },
  { id: 4, title: "Test 4", subtitle: "Academic Task 2", type: "Task 2", difficulty: "Hard", questions: 1, time: 40, taskType: 2 },
  { id: 5, title: "Test 5", subtitle: "Academic Task 1", type: "Task 1", difficulty: "Medium", questions: 1, time: 20, taskType: 1 },
  { id: 6, title: "Test 6", subtitle: "Academic Task 2", type: "Task 2", difficulty: "Medium", questions: 1, time: 40, taskType: 2 },
  { id: 7, title: "Test 7", subtitle: "Academic Task 1", type: "Task 1", difficulty: "Hard", questions: 1, time: 20, taskType: 1 },
  { id: 8, title: "Test 8", subtitle: "Academic Task 2", type: "Task 2", difficulty: "Easy", questions: 1, time: 40, taskType: 2 },
];

export default function WritingTask() {
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analysisMode, setAnalysisMode] = useState<"basic" | "ai">("basic");

  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const selectedTest = writingTests.find(t => t.id === selectedTestId);
  const taskType = selectedTest?.taskType || 1;

  const { data: prompt, refetch: getNewPrompt } = useQuery({
    queryKey: ["writingPrompt", taskType],
    queryFn: () => backend.ielts.getWritingPrompt(taskType),
    enabled: !!selectedTest,
  });

  const submitWritingMutation = useMutation({
    mutationFn: backend.ielts.submitWriting,
    onSuccess: (data) => {
      setFeedback(data);
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      toast({
        title: "Writing submitted successfully!",
        description: `Your estimated band score: ${data.bandScore}`,
      });
    },
    onError: (error) => {
      console.error("Failed to submit writing:", error);
      toast({
        title: "Error",
        description: "Failed to submit your writing. Please try again.",
        variant: "destructive",
      });
    },
  });

  // AI Essay Analysis Mutation
  const aiAnalysisMutation = useMutation({
    mutationFn: backend.ielts.analyzeEssay,
    onSuccess: (data) => {
      setAiAnalysis(data);
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      toast({
        title: "AI Analysis Complete!",
        description: `Overall score: ${data.overallScore}`,
      });
    },
    onError: (error) => {
      console.error("Failed to analyze essay:", error);
      toast({
        title: "Error",
        description: "Failed to analyze your essay. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!user || !prompt || !content.trim()) {
      toast({
        title: "Error",
        description: "Please write your response before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (analysisMode === "ai") {
      aiAnalysisMutation.mutate({
        essay: content.trim(),
        taskType: taskType,
        userId: user.id,
      });
    } else {
      submitWritingMutation.mutate({
        userId: user.id,
        taskType: taskType,
        prompt: prompt.prompt,
        content: content.trim(),
      });
    }
  };

  const handleAIAnalysis = () => {
    if (!user || !content.trim()) {
      toast({
        title: "Error",
        description: "Please write your response before analysis.",
        variant: "destructive",
      });
      return;
    }

    aiAnalysisMutation.mutate({
      essay: content.trim(),
      taskType: taskType,
      userId: user.id,
    });
  };

  const getNewQuestion = () => {
    getNewPrompt();
    setContent("");
    setFeedback(null);
    setAiAnalysis(null);
  };

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
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

  const handleStartTest = () => {
    setIsTestStarted(true);
    setContent("");
    setFeedback(null);
    setAiAnalysis(null);
    getNewPrompt();
  };

  const handleBackToMenu = () => {
    setIsTestStarted(false);
    setSelectedTestId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32">
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
            {writingTests.map((test) => {
              const isSelected = selectedTestId === test.id;
              const difficultyColor = test.difficulty === "Hard" ? "text-rose-600 bg-rose-50 border-rose-200" : test.difficulty === "Medium" ? "text-amber-600 bg-amber-50 border-amber-200" : "text-emerald-600 bg-emerald-50 border-emerald-200";

              return (
                <Card
                  key={test.id}
                  onClick={() => setSelectedTestId(test.id)}
                  className={`cursor-pointer group relative overflow-hidden transition-all duration-300 border-2
                  ${isSelected
                      ? "border-blue-500 shadow-lg ring-2 ring-blue-200 dark:ring-blue-900"
                      : "border-transparent hover:border-blue-200 hover:shadow-md dark:bg-slate-800 dark:hover:border-slate-600"
                    }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                        <PenTool className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full border ${difficultyColor} dark:bg-opacity-10`}>
                        {test.difficulty}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                      {test.title}
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-1 mt-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{test.subtitle}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        {test.time} mins
                        <span>•</span>
                        {test.questions} Question
                      </div>
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
                              handleStartTest();
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

      {/* Writing Interface - Show when test is started */}
      {isTestStarted && selectedTest && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={handleBackToMenu} className="gap-2 pl-0 hover:pl-2 transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to Tests
            </Button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedTest.title}: {selectedTest.subtitle}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column: Prompt */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Task Prompt</CardTitle>
                <CardDescription>{getTaskDescription(taskType)}</CardDescription>
              </CardHeader>
              <CardContent>
                {prompt ? (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Question
                    </h3>
                    <p className="text-blue-800 dark:text-blue-200 whitespace-pre-wrap leading-relaxed text-lg">
                      {prompt.prompt}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    Loading prompt...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right Column: Writing Area */}
            <div className="space-y-6">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Your Response</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={wordCount >= minWords ? "default" : "secondary"}>
                        {wordCount} words
                      </Badge>
                      <span className="text-xs text-slate-500">Min: {minWords}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <Textarea
                    placeholder={`Start writing your response for ${selectedTest.subtitle}...`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 min-h-[400px] resize-none text-lg leading-relaxed p-4"
                  />

                  <div className="flex justify-between items-center pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={getNewQuestion}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      New Prompt
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleSubmit}
                        disabled={!content.trim() || submitWritingMutation.isPending}
                        variant="outline"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {submitWritingMutation.isPending ? "Submitting..." : "Basic Feedback"}
                      </Button>
                      <Button
                        onClick={handleAIAnalysis}
                        disabled={!content.trim() || aiAnalysisMutation.isPending}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        {aiAnalysisMutation.isPending ? "Analyzing..." : "AI Analysis"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Section */}
              {feedback && (
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 animate-in slide-in-from-bottom-4 duration-500">
                  <CardHeader>
                    <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Basic Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center p-4 bg-white dark:bg-green-900/40 rounded-xl border border-green-100 dark:border-green-800/50">
                      <p className="text-sm font-medium text-green-600 dark:text-green-300 uppercase tracking-wider mb-1">Estimated Band Score</p>
                      <p className="text-4xl font-bold text-green-700 dark:text-green-200">
                        {feedback.bandScore}
                      </p>
                    </div>

                    <div className="grid gap-4">
                      <div className="p-4 bg-white dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800/30">
                        <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Grammar & Accuracy</h4>
                        <p className="text-slate-700 dark:text-slate-300">{feedback.grammarFeedback}</p>
                      </div>
                      <div className="p-4 bg-white dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800/30">
                        <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Vocabulary</h4>
                        <p className="text-slate-700 dark:text-slate-300">{feedback.vocabularyFeedback}</p>
                      </div>
                      <div className="p-4 bg-white dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800/30">
                        <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Structure</h4>
                        <p className="text-slate-700 dark:text-slate-300">{feedback.structureFeedback}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {aiAnalysis && (
                <Card className="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 animate-in slide-in-from-bottom-4 duration-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
                      <Sparkles className="h-5 w-5" />
                      Advanced AI Analysis
                    </CardTitle>
                    <CardDescription className="text-indigo-700 dark:text-indigo-300">
                      Detailed IELTS scoring based on official criteria
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center p-6 bg-white dark:bg-indigo-900/40 rounded-xl border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider mb-1">Overall Band Score</p>
                      <p className="text-5xl font-bold text-indigo-700 dark:text-indigo-200">
                        {aiAnalysis.overallScore}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Task Response", score: aiAnalysis.taskResponse },
                        { label: "Coherence", score: aiAnalysis.coherenceCohesion },
                        { label: "Lexical Resource", score: aiAnalysis.lexicalResource },
                        { label: "Grammar", score: aiAnalysis.grammaticalRange }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-2 p-3 bg-white dark:bg-indigo-900/30 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">{item.score}</Badge>
                          </div>
                          <Progress
                            value={(item.score / 9) * 100}
                            className="h-1.5 bg-indigo-100 dark:bg-indigo-900"
                          // indicatorClassName="bg-indigo-600 dark:bg-indigo-400"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-3 text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Detailed Feedback
                        </h4>
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-indigo-100 dark:border-gray-700 shadow-sm">
                          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {aiAnalysis.feedback}
                          </p>
                        </div>
                      </div>

                      {aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            Key Improvements
                          </h4>
                          <div className="grid gap-3">
                            {aiAnalysis.suggestions.map((suggestion: string, index: number) => (
                              <div key={index} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-indigo-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-[1.01]">
                                <Badge variant="secondary" className="mt-0.5 h-6 w-6 flex items-center justify-center rounded-full p-0 shrink-0 bg-indigo-100 text-indigo-700">
                                  {index + 1}
                                </Badge>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {suggestion}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
