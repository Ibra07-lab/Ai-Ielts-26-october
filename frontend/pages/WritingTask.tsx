import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PenTool, RotateCcw, Send, Clock, TrendingUp, Star, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "../contexts/UserContext";
import backend from "~backend/client";

export default function WritingTask() {
  const [selectedTask, setSelectedTask] = useState(1);
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analysisMode, setAnalysisMode] = useState<"basic" | "ai">("basic");
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: prompt, refetch: getNewPrompt } = useQuery({
    queryKey: ["writingPrompt", selectedTask],
    queryFn: () => backend.ielts.getWritingPrompt(selectedTask),
    enabled: true,
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
        taskType: selectedTask,
        userId: user.id,
      });
    } else {
      submitWritingMutation.mutate({
        userId: user.id,
        taskType: selectedTask,
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
      taskType: selectedTask,
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
  const minWords = selectedTask === 1 ? 150 : 250;

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

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6 pb-32">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Writing Practice
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Practice IELTS writing tasks with AI-powered feedback and band score estimation.
          </p>
        </div>

        <Tabs value={selectedTask.toString()} onValueChange={(value) => setSelectedTask(parseInt(value))}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="1">Task 1</TabsTrigger>
            <TabsTrigger value="2">Task 2</TabsTrigger>
          </TabsList>

          {[1, 2].map((task) => (
            <TabsContent key={task} value={task.toString()}>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Writing Task {task}</CardTitle>
                    <CardDescription>{getTaskDescription(task)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {prompt && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Task Prompt:
                        </h3>
                        <p className="text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
                          {prompt.prompt}
                        </p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <Badge variant={wordCount >= minWords ? "default" : "secondary"}>
                            {wordCount} words
                          </Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Minimum: {minWords} words
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={getNewQuestion}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          New Prompt
                        </Button>
                      </div>

                      <Textarea
                        placeholder={`Start writing your response for Task ${task}...`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[400px] resize-none"
                      />

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Clock className="h-4 w-4" />
                          <span>Recommended time: {task === 1 ? "20" : "40"} minutes</span>
                        </div>
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
                          >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            {aiAnalysisMutation.isPending ? "Analyzing..." : "AI Analysis"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {feedback && (
                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardHeader>
                      <CardTitle className="text-green-800 dark:text-green-200">
                        Basic Feedback
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <Badge className="mb-2">Overall Band Score</Badge>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                          {feedback.bandScore}
                        </p>
                      </div>

                      <div className="grid gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">
                            Grammar & Accuracy:
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            {feedback.grammarFeedback}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">
                            Vocabulary & Lexical Resource:
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            {feedback.vocabularyFeedback}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">
                            Task Achievement & Structure:
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            {feedback.structureFeedback}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">
                            Coherence & Cohesion:
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            {feedback.coherenceFeedback}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {aiAnalysis && (
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                        <TrendingUp className="h-5 w-5" />
                        Advanced AI Analysis
                      </CardTitle>
                      <CardDescription className="text-blue-700 dark:text-blue-300">
                        Detailed IELTS scoring based on official criteria
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <Badge className="mb-2 bg-blue-600 text-white">Overall Band Score</Badge>
                        <p className="text-4xl font-bold text-blue-700 dark:text-blue-300">
                          {aiAnalysis.overallScore}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Task Response</span>
                            <Badge variant="outline">{aiAnalysis.taskResponse}</Badge>
                          </div>
                          <Progress 
                            value={(aiAnalysis.taskResponse / 9) * 100} 
                            className="h-2"
                            aria-label={`Task Response score: ${aiAnalysis.taskResponse} out of 9`}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Coherence & Cohesion</span>
                            <Badge variant="outline">{aiAnalysis.coherenceCohesion}</Badge>
                          </div>
                          <Progress 
                            value={(aiAnalysis.coherenceCohesion / 9) * 100} 
                            className="h-2"
                            aria-label={`Coherence & Cohesion score: ${aiAnalysis.coherenceCohesion} out of 9`}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Lexical Resource</span>
                            <Badge variant="outline">{aiAnalysis.lexicalResource}</Badge>
                          </div>
                          <Progress 
                            value={(aiAnalysis.lexicalResource / 9) * 100} 
                            className="h-2"
                            aria-label={`Lexical Resource score: ${aiAnalysis.lexicalResource} out of 9`}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Grammatical Range</span>
                            <Badge variant="outline">{aiAnalysis.grammaticalRange}</Badge>
                          </div>
                          <Progress 
                            value={(aiAnalysis.grammaticalRange / 9) * 100} 
                            className="h-2"
                            aria-label={`Grammatical Range score: ${aiAnalysis.grammaticalRange} out of 9`}
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Detailed Feedback:
                        </h4>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {aiAnalysis.feedback}
                          </p>
                        </div>
                      </div>

                      {aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200 flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            Improvement Suggestions:
                          </h4>
                          <div className="grid gap-2">
                            {aiAnalysis.suggestions.map((suggestion: string, index: number) => (
                              <div key={index} className="flex items-start gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                                <Badge variant="secondary" className="mt-0.5 text-xs">
                                  {index + 1}
                                </Badge>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {suggestion}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
}
