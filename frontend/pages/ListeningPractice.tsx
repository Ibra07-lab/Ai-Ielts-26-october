import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Headphones, Play, Pause, RotateCcw, Send, Volume2, Sparkles, Clock,
  GraduationCap, ArrowLeft, CheckCircle, BookOpen, FileText, Eye, EyeOff,
  Trophy, Target
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "../contexts/UserContext";
import backend from "@/backend";
import ListeningWorksheet from "../components/listening/ListeningWorksheet";
import ErrorBoundary from "../components/ErrorBoundary";
import { useHighlighter } from "../hooks/useHighlighter";

interface ListeningTestMeta {
  id: number;
  title: string;
  section: number;
  difficulty: string;
  questionCount: number;
  duration: number;
}

interface TranscriptLine {
  speaker: string;
  timestamp: string;
  text: string;
}

interface ListeningQuestion {
  id: number;
  type: string;
  questionNumber: number;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

interface ListeningTest {
  id: number;
  title: string;
  section: number;
  difficulty: string;
  audioFile: string;
  duration: number;
  instructions?: string;
  transcript: TranscriptLine[];
  questions: ListeningQuestion[];
}

interface TranscriptSection {
  title: string;
  lines: TranscriptLine[];
}

interface TranscriptResponse {
  transcript: TranscriptLine[];
  transcripts?: TranscriptSection[];
}

export default function ListeningPractice() {
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [result, setResult] = useState<any>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Highlighting Logic
  const { containerRef, contextMenuRef, contextMenu, applyHighlight, clearHighlights, hasHighlights, isSupported } = useHighlighter();

  useEffect(() => {
    if (isTestStarted && !isSupported) {
      toast({
        title: "Highlighting Limited",
        description: "Your browser doesn't support the Highlight API. Highlighting won't be visible, but you can still use the transcript.",
        variant: "destructive"
      });
    } else if (isTestStarted && isSupported && !hasHighlights) {
      toast({
        title: "Pro Tip",
        description: "Select text and right-click to highlight important keywords in the transcript or worksheet!",
        variant: "default"
      });
    }
  }, [isTestStarted, isSupported]);

  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available tests
  const { data: testsData, isLoading: isLoadingTests } = useQuery({
    queryKey: ["listeningTests"],
    queryFn: async () => {
      const data = await backend.ielts.getListeningTests();
      return data;
    },
  });

  const listeningTests = testsData?.tests || [];
  const { id: urlTestId } = useParams<{ id: string }>();

  // Handle deep linking from URL
  useEffect(() => {
    if (urlTestId && listeningTests.length > 0) {
      const testIdNum = parseInt(urlTestId, 10);
      if (!isNaN(testIdNum)) {
        const testExists = listeningTests.some((t: any) => t.id === testIdNum);
        if (testExists && selectedTestId !== testIdNum) {
          console.log("🔗 [DEBUG] Deep linking to test ID:", testIdNum);
          setSelectedTestId(testIdNum);
          setIsTestStarted(true);
        }
      }
    }
  }, [urlTestId, listeningTests, selectedTestId]);

  // Fetch selected test
  const { data: testData, refetch: refetchTest, isLoading: isLoadingTest, error: testError } = useQuery({
    queryKey: ["listeningTest", selectedTestId],
    queryFn: async () => {
      if (!selectedTestId) return null;
      console.log("🔍 [DEBUG] Fetching test with ID:", selectedTestId);
      try {
        const data = await backend.ielts.getListeningTest(selectedTestId);
        console.log("✅ [DEBUG] Test data received:", data);
        console.log("✅ [DEBUG] Test questions:", data?.questions?.length);
        console.log("✅ [DEBUG] Test transcript:", data?.transcript?.length);
        return data as ListeningTest;
      } catch (err) {
        console.error("❌ [DEBUG] Error fetching test:", err);
        throw err;
      }
    },
    enabled: !!selectedTestId && isTestStarted,
  });

  // Fetch transcript (always available when test is started)
  const { data: transcriptData } = useQuery({
    queryKey: ["listeningTranscript", selectedTestId],
    queryFn: async () => {
      if (!selectedTestId) return null;
      const data = await backend.ielts.getListeningTranscript(selectedTestId);
      console.log("📜 [DEBUG] Transcript Data Received:", data);
      return data as TranscriptResponse;
    },
    enabled: !!selectedTestId && isTestStarted, // Always fetch when test starts
  });

  useEffect(() => {
    console.log("📜 [DEBUG] showTranscript:", showTranscript);
    console.log("📜 [DEBUG] transcriptData availability:", !!transcriptData);
    if (transcriptData) {
      console.log("📜 [DEBUG] transcriptData keys:", Object.keys(transcriptData));
    }
  }, [showTranscript, transcriptData]);

  const selectedTest = listeningTests.find((t: ListeningTestMeta) => t.id === selectedTestId);

  const submitListeningMutation = useMutation({
    mutationFn: backend.ielts.submitListening,
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      toast({
        title: "Listening submitted successfully!",
        description: `You scored ${data.score}/${data.totalQuestions} (Band ${data.bandScore})`,
      });
    },
    onError: (error) => {
      console.error("Failed to submit listening:", error);
      toast({
        title: "Error",
        description: "Failed to submit your answers. Please try again.",
        variant: "destructive",
      });
    },
  });

  // DEBUG: Log component lifecycle and state changes
  useEffect(() => {
    console.log("🚀 [DEBUG] ListeningPractice MOUNTED");
    return () => console.log("💀 [DEBUG] ListeningPractice UNMOUNTED");
  }, []);

  useEffect(() => {
    console.log("📊 [DEBUG] State change:", {
      selectedTestId,
      isTestStarted,
      testDataExists: !!testData,
      testError: testError?.message,
      isLoadingTest,
    });
  }, [selectedTestId, isTestStarted, testData, testError, isLoadingTest]);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (error.name !== 'AbortError') {
            console.error("Playback failed:", error);
          }
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleSpeedChange = (value: number[]) => {
    const speed = value[0];
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleSubmit = () => {
    if (!user || !selectedTestId) return;

    submitListeningMutation.mutate({
      userId: user.id,
      testId: selectedTestId,
      userAnswers: answers,
      timeTaken: Math.floor(currentTime),
    });
  };

  // Tests that use the custom worksheet component (Test 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20)
  const isWorksheetTest = (testId: number) => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].includes(testId);
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartTest = (testId: number) => {
    console.log("🎯 [DEBUG] handleStartTest called with testId:", testId);
    setSelectedTestId(testId); // FIX: Set the test ID!
    setIsTestStarted(true);
    setAnswers({});
    setResult(null);
    setCurrentTime(0);
    setIsPlaying(false);
    setShowTranscript(false);
  };

  const handleBackToMenu = () => {
    setIsTestStarted(false);
    setSelectedTestId(null);
    setIsPlaying(false);
    setResult(null);
    setShowTranscript(false);
  };


  const renderQuestion = (question: ListeningQuestion, showResult: boolean = false) => {
    const userAnswer = answers[question.id];
    const correctAns = result?.correctAnswers?.[question.id];
    const isCorrect = (() => {
      if (!correctAns || !userAnswer) return false;
      if (Array.isArray(correctAns)) {
        // Pick-two: user's single letter answer must be in the valid answers array
        return correctAns.map((a: string) => a.toUpperCase()).includes(userAnswer.toUpperCase());
      }
      return correctAns.toLowerCase() === userAnswer.toLowerCase();
    })();

    switch (question.type) {
      case "multiple-choice":
        return (
          <div
            key={question.id}
            className={`space-y-3 p-4 rounded-lg border transition-colors ${showResult
              ? isCorrect
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              : 'bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-700'
              }`}
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {question.questionNumber}. {question.question}
              </h4>
              {showResult && (
                <Badge variant={isCorrect ? "default" : "destructive"} className="ml-2">
                  {isCorrect ? "Correct" : "Incorrect"}
                </Badge>
              )}
            </div>
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
              disabled={!!result}
            >
              {question.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q${question.id}-${index}`} />
                  <Label
                    htmlFor={`q${question.id}-${index}`}
                    className={`text-sm cursor-pointer ${showResult && (() => {
                      const ca = result?.correctAnswers?.[question.id];
                      if (Array.isArray(ca)) {
                        return ca.some((a: string) => option.toUpperCase().startsWith(a.toUpperCase()));
                      }
                      return ca === option;
                    })()
                      ? 'text-green-700 dark:text-green-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300'
                      }`}
                  >
                    {option}
                    {showResult && (() => {
                      const ca = result?.correctAnswers?.[question.id];
                      if (Array.isArray(ca)) {
                        return ca.some((a: string) => option.toUpperCase().startsWith(a.toUpperCase()));
                      }
                      return ca === option;
                    })() && " ✓"}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {showResult && result?.explanations?.[question.id] && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                {result.explanations[question.id]}
              </p>
            )}
          </div>
        );

      case "fill-in-blank":
        return (
          <div
            key={question.id}
            className={`space-y-3 p-4 rounded-lg border transition-colors ${showResult
              ? isCorrect
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              : 'bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-700'
              }`}
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {question.questionNumber}. {question.question}
              </h4>
              {showResult && (
                <Badge variant={isCorrect ? "default" : "destructive"} className="ml-2">
                  {isCorrect ? "Correct" : "Incorrect"}
                </Badge>
              )}
            </div>
            <Input
              placeholder="Type your answer..."
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="max-w-md"
              disabled={!!result}
            />
            {showResult && (
              <div className="text-sm mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                {!isCorrect && (
                  <p className="text-green-700 dark:text-green-400 font-medium">
                    Correct answer: {result?.correctAnswers?.[question.id]}
                  </p>
                )}
                {result?.explanations?.[question.id] && (
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {result.explanations[question.id]}
                  </p>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = testData?.questions.length || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32">
      {/* Hero Section */}
      {!isTestStarted && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-900 dark:to-indigo-900 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/30 border border-purple-400/30 text-purple-100 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Authentic IELTS Practice</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Master IELTS Listening
              </h1>
              <p className="text-lg text-purple-100 leading-relaxed">
                Practice with real audio recordings, view transcripts after submission, and get instant feedback with band score estimates.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                  <Headphones className="w-5 h-5 text-purple-200" />
                  <span className="font-medium">{listeningTests.length} Practice Tests</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                  <FileText className="w-5 h-5 text-purple-200" />
                  <span className="font-medium">Full Transcripts</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                  <Trophy className="w-5 h-5 text-purple-200" />
                  <span className="font-medium">Band Score Estimate</span>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-2xl rotate-12 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                <Headphones className="w-16 h-16 text-white/90" />
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
              <Headphones className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Available Tests
            </h2>
          </div>

          {isLoadingTests ? (
            <div className="text-center py-12 text-slate-500">Loading tests...</div>
          ) : listeningTests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <Headphones className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400">No listening tests available yet.</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                Add JSON test files to backend/data/listening-tests/
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listeningTests.map((test: ListeningTestMeta) => {
                const isSelected = selectedTestId === test.id;

                return (
                  <Card
                    key={test.id}
                    onClick={() => setSelectedTestId(test.id)}
                    className={`cursor-pointer group relative overflow-hidden transition-all duration-300 border h-full flex flex-col justify-between
                    ${isSelected
                        ? "border-purple-500 bg-purple-50/10 shadow-lg ring-1 ring-purple-500/20 dark:ring-purple-400/20"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-purple-200 dark:hover:border-purple-900/50 hover:shadow-md"
                      }`}
                  >
                    <CardHeader className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl transition-colors duration-300 ${isSelected ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-600 dark:group-hover:bg-purple-900/20 dark:group-hover:text-purple-300'}`}>
                          <Headphones className="w-8 h-8" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {test.title}
                        </CardTitle>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Section {test.section}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="mt-auto pt-0">
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-6">
                        <div className="flex items-center gap-1.5 flex-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 justify-center">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{Math.floor(test.duration / 60)} MIN</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 justify-center">
                          <Target className="w-3.5 h-3.5" />
                          <span>{test.questionCount} Qs</span>
                        </div>
                      </div>

                      <div className={`transition-all duration-300 ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartTest(test.id); // FIX: Pass test ID
                          }}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md font-semibold h-11"
                        >
                          Start Test
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Listening Interface */}
      {isTestStarted && selectedTest && (
        <div ref={containerRef} className="space-y-6 animate-in fade-in duration-500 relative pb-24">
          {/* Custom Context Menu */}
          {contextMenu && (
            <div
              ref={contextMenuRef}
              className="fixed z-[100] bg-white border border-slate-200 shadow-xl rounded-lg py-1 min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
              style={{ top: contextMenu.y, left: contextMenu.x }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); applyHighlight(); }}
                disabled={!contextMenu.canHighlight}
                className={`w-full text-left px-4 py-2 text-sm font-medium flex items-center gap-2 
                                ${contextMenu.canHighlight
                    ? 'hover:bg-yellow-50 text-slate-700 hover:text-yellow-700'
                    : 'text-slate-300 cursor-not-allowed'
                  }`}
              >
                <span>🖊️</span> Highlight
              </button>
              {hasHighlights && (
                <button
                  onClick={(e) => { e.stopPropagation(); clearHighlights(e); }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm font-medium flex items-center gap-2 text-red-600 border-t border-slate-100"
                >
                  <span>✕</span> Clear Selection
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={handleBackToMenu} className="gap-2 pl-0 hover:pl-2 transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to Tests
            </Button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedTest.title}
            </h2>
          </div>

          {testData ? (
            <div className="space-y-6">
              {/* Audio Player Bar - Now at top, compact version */}
              <Card className="border-purple-100 dark:border-purple-900/50 shadow-sm bg-white dark:bg-slate-900 sticky top-4 z-40 rounded-2xl">
                <CardContent className="py-2 px-4">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left Column - Audio Play button */}
                    <div className="flex flex-1 items-center gap-4">
                      <div className="relative h-10 w-10 shrink-0">
                        <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-full animate-pulse z-0" style={{ animationDuration: isPlaying ? '2s' : '0s' }}></div>
                        <Button
                          size="icon"
                          className="relative z-10 h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-transform active:scale-95"
                          onClick={togglePlayback}
                        >
                          {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
                        </Button>
                      </div>

                      {/* Visualizer & Scrubber - Fluid width */}
                      <div className="flex-1 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 h-10">
                        <span className="text-[10px] font-mono font-medium text-purple-600 dark:text-purple-400 w-8">{formatTime(currentTime)}</span>

                        <div className="flex-1 flex gap-0.5 h-6 items-end mx-1">
                          {[...Array(60)].map((_, i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-t-[1px] transition-all duration-200 ${i / 60 < currentTime / (duration || 1)
                                ? 'bg-purple-400 dark:bg-purple-500'
                                : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                              style={{
                                height: isPlaying ? `${15 + Math.random() * 85}%` : '25%',
                                opacity: i / 60 < currentTime / (duration || 1) ? 1 : 0.4
                              }}
                            ></div>
                          ))}
                        </div>

                        <span className="text-[10px] font-mono font-medium text-slate-400 w-8 text-right">{formatTime(duration)}</span>

                        <audio
                          ref={audioRef}
                          onTimeUpdate={handleTimeUpdate}
                          onLoadedMetadata={handleLoadedMetadata}
                          onEnded={() => setIsPlaying(false)}
                          style={{ display: 'none' }}
                        >
                          <source src={testData.audioFile} type="audio/mpeg" />
                        </audio>
                      </div>

                      {/* Right Actions - Compact Group */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-md p-0.5">
                          {[1, 1.25, 1.5].map(speed => (
                            <button
                              key={speed}
                              className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition-colors ${playbackSpeed === speed
                                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                              onClick={() => handleSpeedChange([speed])}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                        <Button
                          variant={showTranscript ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setShowTranscript(!showTranscript)}
                          className="h-8 px-2 text-xs gap-1.5 font-medium text-slate-600 dark:text-slate-300"
                        >
                          {showTranscript ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          <span className="hidden sm:inline">Transcript</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Transcript */}
                  {showTranscript && (transcriptData?.transcripts || transcriptData?.transcript) && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2">
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 max-h-[400px] overflow-y-auto space-y-6">
                        {(transcriptData.transcripts || [{ title: "", lines: transcriptData.transcript }]).map((section: any, sectionIndex: number) => (
                          <div key={sectionIndex} className="space-y-3">
                            {section.title && (
                              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2">
                                {section.title}
                              </h4>
                            )}
                            <div className="space-y-3">
                              {(section.lines || []).map((line: TranscriptLine, index: number) => {
                                const parts = line.text.split(/(<mark>.*?<\/mark>)/g);

                                return (
                                  <div key={index} className="text-sm leading-relaxed flex gap-3">
                                    <span className="font-bold text-purple-600 dark:text-purple-400 text-xs shrink-0 w-16 pt-0.5">
                                      {line.speaker}
                                    </span>
                                    <div className="space-y-0.5">
                                      <p className="text-slate-700 dark:text-slate-300">
                                        {parts.map((part, i) => {
                                          if (part.startsWith('<mark>') && part.endsWith('</mark>')) {
                                            const content = part.replace(/<\/?mark>/g, '');
                                            // Only highlight if result is available (test submitted)
                                            return result ? (
                                              <span key={i} className="bg-purple-200 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 font-semibold px-1 rounded mx-0.5">
                                                {content}
                                              </span>
                                            ) : (
                                              <span key={i}>{content}</span>
                                            );
                                          }
                                          return <span key={i}>{part}</span>;
                                        })}
                                      </p>
                                      {line.timestamp && (
                                        <span className="text-slate-400 text-[10px]">
                                          {line.timestamp}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Main Content Area - Full Width */}
              <div className="space-y-6">
                <Card className="border-none shadow-none bg-transparent">
                  <CardContent className="p-0 space-y-6">
                    <div className="space-y-6">
                      {isWorksheetTest(testData.id) ? (
                        <ErrorBoundary fallbackMessage="Error in Listening Worksheet">
                          <ListeningWorksheet
                            test={testData}
                            answers={answers}
                            handleAnswerChange={handleAnswerChange}
                            result={result}
                          />
                        </ErrorBoundary>
                      ) : (
                        testData.questions.map((question: ListeningQuestion) =>
                          renderQuestion(question, !!result)
                        )
                      )}
                    </div>

                    {!result && (
                      <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <Button
                          onClick={handleSubmit}
                          disabled={answeredQuestions === 0 || submitListeningMutation.isPending}
                          className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg px-8 py-6 text-lg rounded-xl transition-transform hover:scale-105"
                        >
                          {submitListeningMutation.isPending ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Submitting...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Send className="h-5 w-5" />
                              <span>Submit Answers</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Results Summary */}
                {result && (
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 animate-in slide-in-from-bottom-4 duration-500">
                    <CardHeader>
                      <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        Test Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-white/50 dark:bg-green-900/30 rounded-xl">
                          <p className="text-sm font-medium text-green-600 dark:text-green-300 uppercase tracking-wider mb-1">Score</p>
                          <p className="text-3xl font-bold text-green-700 dark:text-green-200">
                            {result.score}/{result.totalQuestions}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-white/50 dark:bg-green-900/30 rounded-xl">
                          <p className="text-sm font-medium text-green-600 dark:text-green-300 uppercase tracking-wider mb-1">Percentage</p>
                          <p className="text-3xl font-bold text-green-700 dark:text-green-200">
                            {Math.round((result.score / result.totalQuestions) * 100)}%
                          </p>
                        </div>
                        <div className="text-center p-4 bg-white/50 dark:bg-green-900/30 rounded-xl">
                          <p className="text-sm font-medium text-green-600 dark:text-green-300 uppercase tracking-wider mb-1">Band Score</p>
                          <p className="text-3xl font-bold text-green-700 dark:text-green-200">
                            {result.bandScore}
                          </p>
                        </div>
                      </div>

                      {/* Answer Comparison List */}
                      <div className="mt-6 bg-white/70 dark:bg-green-900/20 rounded-xl p-4">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">Answer Review</h4>
                        <div className="space-y-2">
                          <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-green-700 dark:text-green-300 pb-2 border-b border-green-200 dark:border-green-700">
                            <span>Q#</span>
                            <span>Your Answer</span>
                            <span>Correct Answer</span>
                            <span>Status</span>
                          </div>
                          {Object.entries(result.correctAnswers).map(([qId, correctAns]) => {
                            const studentAns = answers[Number(qId)] || '-';
                            const isCorrect = Array.isArray(correctAns)
                              ? correctAns.map((a: string) => a.toUpperCase()).includes(String(studentAns).toUpperCase())
                              : String(studentAns).toLowerCase() === String(correctAns).toLowerCase();
                            const displayCorrect = Array.isArray(correctAns) ? correctAns.join(', ') : String(correctAns);
                            return (
                              <div key={qId} className={`grid grid-cols-4 gap-2 text-sm py-1.5 rounded px-1 ${isCorrect ? 'bg-green-100 dark:bg-green-800/30' : 'bg-red-100 dark:bg-red-800/30'}`}>
                                <span className="font-bold">{qId}</span>
                                <span className={isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-600 dark:text-red-400'}>{studentAns}</span>
                                <span className="text-green-700 dark:text-green-300 font-medium">{displayCorrect}</span>
                                <span>{isCorrect ? '✓' : '✗'}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <p className="text-center text-green-600 dark:text-green-400 mt-4">
                        Review your answers above. Click the transcript button to see the full audio text.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Loading test...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
