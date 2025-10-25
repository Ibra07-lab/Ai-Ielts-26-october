import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mic, MicOff, Play, RotateCcw, Clock, TrendingUp, BarChart, Star, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "../contexts/UserContext";
import backend from "~backend/client";

export default function SpeakingPractice() {
  const [selectedPart, setSelectedPart] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [feedback, setFeedback] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [transcription, setTranscription] = useState<string>("");
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: question, refetch: getNewQuestion } = useQuery({
    queryKey: ["speakingQuestion", selectedPart],
    queryFn: () => backend.ielts.getSpeakingQuestion(selectedPart),
    enabled: true,
  });

  const submitSpeakingMutation = useMutation({
    mutationFn: backend.ielts.submitSpeaking,
    onSuccess: (data) => {
      setFeedback(data);
      setIsRecording(false);
      setRecordingTime(0);
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      toast({
        title: "Speaking submitted successfully!",
        description: `Your estimated band score: ${data.bandScore}`,
      });
    },
    onError: (error) => {
      console.error("Failed to submit speaking:", error);
      toast({
        title: "Error",
        description: "Failed to submit your speaking response. Please try again.",
        variant: "destructive",
      });
    },
  });

  // AI Speaking Analysis Mutation
  const aiSpeakingAnalysisMutation = useMutation({
    mutationFn: backend.ielts.analyzeSpeaking,
    onSuccess: (data) => {
      setAiAnalysis(data);
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      toast({
        title: "AI Analysis Complete!",
        description: `Overall band score: ${data.overallBand}`,
      });
    },
    onError: (error) => {
      console.error("Failed to analyze speaking:", error);
      toast({
        title: "Error",
        description: "Failed to analyze your speaking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const startRecording = () => {
    if (!question || !user) return;
    
    setIsRecording(true);
    setRecordingTime(0);
    setCurrentQuestion(question.question);
    setFeedback(null);
    
    // Start timer
    const timer = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 120) { // 2 minutes max
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    // Store timer reference
    (window as any).recordingTimer = timer;
  };

  const stopRecording = () => {
    if (!user || !currentQuestion) return;

    setIsRecording(false);
    clearInterval((window as any).recordingTimer);

    // Mock transcription - in a real app, this would use speech-to-text
    const mockTranscription = "This is a mock transcription of the user's speaking response. In a real application, this would be generated using speech-to-text technology.";
    
    setTranscription(mockTranscription);

    submitSpeakingMutation.mutate({
      userId: user.id,
      part: selectedPart,
      question: currentQuestion,
      transcription: mockTranscription,
    });
  };

  const handleAiAnalysis = () => {
    if (!user || !question || !transcription) return;

    aiSpeakingAnalysisMutation.mutate({
      transcription: transcription,
      question: question.question,
      part: selectedPart,
      userId: user.id,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPartDescription = (part: number) => {
    switch (part) {
      case 1:
        return "Introduction and interview (4-5 minutes) - Answer questions about yourself, your home, work, studies, and familiar topics.";
      case 2:
        return "Long turn (3-4 minutes) - Speak for 1-2 minutes on a given topic after 1 minute of preparation.";
      case 3:
        return "Discussion (4-5 minutes) - Discuss more abstract ideas and issues related to Part 2 topic.";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6 pb-32">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Speaking Practice
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Practice IELTS speaking with AI-powered feedback and band score estimation.
          </p>
        </div>

        <Tabs value={selectedPart.toString()} onValueChange={(value) => setSelectedPart(parseInt(value))}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="1">Part 1</TabsTrigger>
            <TabsTrigger value="2">Part 2</TabsTrigger>
            <TabsTrigger value="3">Part 3</TabsTrigger>
          </TabsList>

          {[1, 2, 3].map((part) => (
            <TabsContent key={part} value={part.toString()}>
              <Card>
                <CardHeader>
                  <CardTitle>Speaking Part {part}</CardTitle>
                  <CardDescription>{getPartDescription(part)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {question && (
                    <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-sky-900 dark:text-sky-100 mb-2">
                        Question:
                      </h3>
                      <p className="text-sky-800 dark:text-sky-200">
                        {question.question}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col items-center space-y-4">
                    {isRecording && (
                      <div className="flex items-center gap-2 text-red-600">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                        <span className="font-medium">Recording...</span>
                        <Clock className="h-4 w-4" />
                        <span className="font-mono">{formatTime(recordingTime)}</span>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        size="lg"
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={!question || submitSpeakingMutation.isPending}
                        className={isRecording ? "bg-red-600 hover:bg-red-700" : ""}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="h-5 w-5 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="h-5 w-5 mr-2" />
                            Start Recording
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => getNewQuestion()}
                        disabled={isRecording}
                      >
                        <RotateCcw className="h-5 w-5 mr-2" />
                        New Question
                      </Button>
                      
                      {transcription && (
                        <Button
                          onClick={handleAiAnalysis}
                          disabled={aiSpeakingAnalysisMutation.isPending || isRecording}
                        >
                          <TrendingUp className="h-5 w-5 mr-2" />
                          {aiSpeakingAnalysisMutation.isPending ? "Analyzing..." : "AI Analysis"}
                        </Button>
                      )}
                    </div>

                    {part === 2 && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 text-center">
                        <p>💡 Tip: Take 1 minute to prepare, then speak for 1-2 minutes</p>
                      </div>
                    )}
                  </div>

                  {feedback && (
                    <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                      <CardHeader>
                        <CardTitle className="text-green-800 dark:text-green-200">
                          Basic Feedback
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="text-center">
                            <Badge variant="secondary" className="mb-1">
                              Overall
                            </Badge>
                            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                              {feedback.bandScore}
                            </p>
                          </div>
                          <div className="text-center">
                            <Badge variant="outline" className="mb-1">
                              Fluency
                            </Badge>
                            <p className="text-lg font-semibold">
                              {feedback.fluencyScore}
                            </p>
                          </div>
                          <div className="text-center">
                            <Badge variant="outline" className="mb-1">
                              Grammar
                            </Badge>
                            <p className="text-lg font-semibold">
                              {feedback.grammarScore}
                            </p>
                          </div>
                          <div className="text-center">
                            <Badge variant="outline" className="mb-1">
                              Pronunciation
                            </Badge>
                            <p className="text-lg font-semibold">
                              {feedback.pronunciationScore}
                            </p>
                          </div>
                          <div className="text-center">
                            <Badge variant="outline" className="mb-1">
                              Coherence
                            </Badge>
                            <p className="text-lg font-semibold">
                              {feedback.coherenceScore}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Detailed Feedback:</h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            {feedback.feedback}
                          </p>
                        </div>

                        {feedback.transcription && (
                          <div>
                            <h4 className="font-semibold mb-2">Transcription:</h4>
                            <p className="text-gray-700 dark:text-gray-300 italic">
                              "{feedback.transcription}"
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {aiAnalysis && (
                    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                          <BarChart className="h-5 w-5" />
                          Advanced AI Analysis
                        </CardTitle>
                        <CardDescription className="text-blue-700 dark:text-blue-300">
                          Detailed IELTS speaking assessment
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="text-center">
                          <Badge className="mb-2 bg-blue-600 text-white">Overall Band Score</Badge>
                          <p className="text-4xl font-bold text-blue-700 dark:text-blue-300">
                            {aiAnalysis.overallBand}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Fluency & Coherence</span>
                              <Badge variant="outline">{aiAnalysis.fluencyCoherence}</Badge>
                            </div>
                            <Progress 
                              value={(aiAnalysis.fluencyCoherence / 9) * 100} 
                              className="h-2"
                              aria-label={`Fluency & Coherence score: ${aiAnalysis.fluencyCoherence} out of 9`}
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

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Pronunciation</span>
                              <Badge variant="outline">{aiAnalysis.pronunciation}</Badge>
                            </div>
                            <Progress 
                              value={(aiAnalysis.pronunciation / 9) * 100} 
                              className="h-2"
                              aria-label={`Pronunciation score: ${aiAnalysis.pronunciation} out of 9`}
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

                        {aiAnalysis.strengths && aiAnalysis.strengths.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200 flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              Strengths:
                            </h4>
                            <div className="grid gap-2">
                              {aiAnalysis.strengths.map((strength: string, index: number) => (
                                <div key={index} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                  <Badge variant="secondary" className="mt-0.5 text-xs bg-green-600 text-white">
                                    ✓
                                  </Badge>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {strength}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {aiAnalysis.improvements && aiAnalysis.improvements.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200 flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Areas for Improvement:
                            </h4>
                            <div className="grid gap-2">
                              {aiAnalysis.improvements.map((improvement: string, index: number) => (
                                <div key={index} className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                  <Badge variant="secondary" className="mt-0.5 text-xs bg-orange-600 text-white">
                                    {index + 1}
                                  </Badge>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {improvement}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
}
