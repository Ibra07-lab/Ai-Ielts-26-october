import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Headphones, Play, Pause, RotateCcw, Send, Volume2, Sparkles, Clock, GraduationCap, ArrowLeft, CheckCircle, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "../contexts/UserContext";
import backend from "~backend/client";

// Mock Data for Listening Tests
const listeningTests = [
  { id: 1, title: "Test 1", subtitle: "Section 1: Social Context", difficulty: "Easy", questions: 10, time: 30 },
  { id: 2, title: "Test 2", subtitle: "Section 2: General Context", difficulty: "Medium", questions: 10, time: 30 },
  { id: 3, title: "Test 3", subtitle: "Section 3: Academic Context", difficulty: "Hard", questions: 10, time: 30 },
  { id: 4, title: "Test 4", subtitle: "Section 4: Academic Lecture", difficulty: "Hard", questions: 10, time: 30 },
  { id: 5, title: "Test 5", subtitle: "Full Practice Test A", difficulty: "Medium", questions: 40, time: 30 },
  { id: 6, title: "Test 6", subtitle: "Full Practice Test B", difficulty: "Hard", questions: 40, time: 30 },
  { id: 7, title: "Test 7", subtitle: "Section 1 & 2 Practice", difficulty: "Easy", questions: 20, time: 15 },
  { id: 8, title: "Test 8", subtitle: "Section 3 & 4 Practice", difficulty: "Hard", questions: 20, time: 15 },
];

export default function ListeningPractice() {
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [result, setResult] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const selectedTest = listeningTests.find(t => t.id === selectedTestId);

  const { data: audio, refetch: refetchAudio } = useQuery({
    queryKey: ["listeningAudio", selectedTestId],
    queryFn: async () => {
      const data = await backend.ielts.getListeningAudio();
      setAnswers({});
      setResult(null);
      setCurrentTime(0);
      setIsPlaying(false);
      return data;
    },
    enabled: !!selectedTest,
  });

  const submitListeningMutation = useMutation({
    mutationFn: backend.ielts.submitListening,
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      toast({
        title: "Listening submitted successfully!",
        description: `You scored ${data.score}/${data.totalQuestions}`,
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

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
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
    if (!user || !audio) return;

    submitListeningMutation.mutate({
      userId: user.id,
      audioTitle: audio?.title ?? "",
      audioUrl: audio?.audioUrl ?? "",
      questions: audio?.questions ?? [],
      userAnswers: answers,
      timeTaken: Math.floor(currentTime),
    });
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const getNewAudio = () => {
    refetchAudio();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setIsTestStarted(true);
    setAnswers({});
    setResult(null);
    setCurrentTime(0);
    setIsPlaying(false);
    refetchAudio();
  };

  const handleBackToMenu = () => {
    setIsTestStarted(false);
    setSelectedTestId(null);
    setIsPlaying(false);
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div key={question.id} className="space-y-3 p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">{question.id}. {question.question}</h4>
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              {question.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q${question.id}-${index}`} />
                  <Label htmlFor={`q${question.id}-${index}`} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "fill-in-blank":
        return (
          <div key={question.id} className="space-y-3 p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">{question.id}. {question.question}</h4>
            <Input
              placeholder="Type your answer..."
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="max-w-md"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = audio?.questions.length || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32">
      {/* Hero Section - Only show when not in a test */}
      {!isTestStarted && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-900 dark:to-indigo-900 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/30 border border-purple-400/30 text-purple-100 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>New AI-Powered Analysis Available</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Master IELTS Listening
              </h1>
              <p className="text-lg text-purple-100 leading-relaxed">
                Improve your listening skills with authentic recordings, diverse accents, and instant feedback.
                Practice all 4 sections of the IELTS Listening test.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                  <Headphones className="w-5 h-5 text-purple-200" />
                  <span className="font-medium">{listeningTests.length} Practice Tests</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                  <Clock className="w-5 h-5 text-purple-200" />
                  <span className="font-medium">30 Min / Test</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                  <GraduationCap className="w-5 h-5 text-purple-200" />
                  <span className="font-medium">Academic & General</span>
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
            <div className="flex gap-2">
              <Badge variant="outline" className="px-3 py-1">All Sections</Badge>
              <Badge variant="outline" className="px-3 py-1">Full Tests</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listeningTests.map((test) => {
              const isSelected = selectedTestId === test.id;
              const difficultyColor = test.difficulty === "Hard" ? "text-rose-600 bg-rose-50 border-rose-200" : test.difficulty === "Medium" ? "text-amber-600 bg-amber-50 border-amber-200" : "text-emerald-600 bg-emerald-50 border-emerald-200";

              return (
                <Card
                  key={test.id}
                  onClick={() => setSelectedTestId(test.id)}
                  className={`cursor-pointer group relative overflow-hidden transition-all duration-300 border-2
                  ${isSelected
                      ? "border-purple-500 shadow-lg ring-2 ring-purple-200 dark:ring-purple-900"
                      : "border-transparent hover:border-purple-200 hover:shadow-md dark:bg-slate-800 dark:hover:border-slate-600"
                    }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                        <Headphones className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full border ${difficultyColor} dark:bg-opacity-10`}>
                        {test.difficulty}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 transition-colors">
                      {test.title}
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-1 mt-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{test.subtitle}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        {test.time} mins
                        <span>•</span>
                        {test.questions} Questions
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
                        <div className="h-full bg-purple-500 w-0 rounded-full"></div>
                      </div>

                      {isSelected && (
                        <div className="pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartTest();
                            }}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md group-hover:shadow-lg transition-all"
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

      {/* Listening Interface - Show when test is started */}
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

          {audio ? (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column: Audio Player (Sticky) */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-6">
                  <Card className="border-purple-100 dark:border-purple-900/50 shadow-lg">
                    <CardHeader className="bg-purple-50/50 dark:bg-purple-900/20 pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Headphones className="h-5 w-5 text-purple-600" />
                        Audio Player
                      </CardTitle>
                      <CardDescription>
                        {audio.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      {/* Mock audio element */}
                      <audio
                        ref={audioRef}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={() => setIsPlaying(false)}
                        style={{ display: 'none' }}
                      >
                        <source src={audio.audioUrl} type="audio/mpeg" />
                      </audio>

                      <div className="flex flex-col items-center gap-4">
                        <div className="relative w-full h-32 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden group cursor-pointer" onClick={togglePlayback}>
                          <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
                          {/* Visualizer bars simulation */}
                          <div className="flex items-end gap-1 h-12">
                            {[...Array(12)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1.5 bg-purple-500 rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`}
                                style={{ height: isPlaying ? `${Math.random() * 100}%` : '20%' }}
                              ></div>
                            ))}
                          </div>

                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                            </div>
                          </div>
                        </div>

                        <div className="w-full space-y-2">
                          <Slider
                            value={[currentTime]}
                            max={duration || 100}
                            step={1}
                            onValueChange={handleSeek}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-slate-500 font-medium">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4 text-slate-400" />
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Speed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-7 px-2 text-xs ${playbackSpeed === 1 ? 'bg-purple-100 text-purple-700' : ''}`}
                            onClick={() => handleSpeedChange([1])}
                          >
                            1x
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-7 px-2 text-xs ${playbackSpeed === 1.25 ? 'bg-purple-100 text-purple-700' : ''}`}
                            onClick={() => handleSpeedChange([1.25])}
                          >
                            1.25x
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-7 px-2 text-xs ${playbackSpeed === 1.5 ? 'bg-purple-100 text-purple-700' : ''}`}
                            onClick={() => handleSpeedChange([1.5])}
                          >
                            1.5x
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/50 text-sm">
                    <p className="text-yellow-800 dark:text-yellow-200 flex gap-2">
                      <span className="text-lg">🎧</span>
                      Use headphones for the best experience. You can play the audio only once in the real test.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Questions */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Questions</CardTitle>
                        <CardDescription>
                          Answer as you listen
                        </CardDescription>
                      </div>
                      <Badge variant={answeredQuestions === totalQuestions ? "default" : "secondary"}>
                        {answeredQuestions}/{totalQuestions} Answered
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-6">
                      {audio.questions.map(renderQuestion)}
                    </div>

                    <div className="pt-6 border-t">
                      <Button
                        onClick={handleSubmit}
                        disabled={answeredQuestions === 0 || submitListeningMutation.isPending}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        size="lg"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {submitListeningMutation.isPending ? "Submitting..." : "Submit Answers"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {result && (
                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 animate-in slide-in-from-bottom-4 duration-500">
                    <CardHeader>
                      <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Test Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-6 p-6 bg-white dark:bg-green-900/40 rounded-xl border border-green-100 dark:border-green-800/50">
                        <div className="text-center">
                          <p className="text-sm font-medium text-green-600 dark:text-green-300 uppercase tracking-wider mb-1">Your Score</p>
                          <p className="text-4xl font-bold text-green-700 dark:text-green-200">
                            {result.score}/{result.totalQuestions}
                          </p>
                        </div>
                        <div className="h-12 w-px bg-green-200 dark:bg-green-800"></div>
                        <div>
                          <p className="text-lg font-medium text-green-800 dark:text-green-100">
                            {Math.round((result.score / result.totalQuestions) * 100)}% Correct
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-300">
                            Great job! Review your answers below.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Detailed Review
                        </h4>
                        {audio.questions.map((question: any) => (
                          <div key={question.id} className={`p-4 rounded-lg border ${answers[question.id] === result.correctAnswers[question.id] ? 'bg-green-100/50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                {question.id}. {question.question}
                              </p>
                              {answers[question.id] === result.correctAnswers[question.id] ? (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Correct</Badge>
                              ) : (
                                <Badge variant="destructive">Incorrect</Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                              <div>
                                <span className="text-slate-500 block text-xs mb-1">Your Answer</span>
                                <span className="font-medium">{answers[question.id] || "Not answered"}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-xs mb-1">Correct Answer</span>
                                <span className="font-medium text-green-700">{result.correctAnswers[question.id]}</span>
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-200/50 text-sm text-slate-600">
                              <span className="font-medium text-slate-700 mr-2">Explanation:</span>
                              {result.explanations[question.id]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Loading audio test...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
