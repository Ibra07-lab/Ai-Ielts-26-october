import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Headphones, Play, Pause, RotateCcw, Send, Volume2 } from "lucide-react";
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

export default function ListeningPractice() {
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

  const { data: audio, refetch: getNewAudio } = useQuery({
    queryKey: ["listeningAudio"],
    queryFn: backend.ielts.getListeningAudio,
    onSuccess: () => {
      setAnswers({});
      setResult(null);
      setCurrentTime(0);
      setIsPlaying(false);
    },
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
      audioTitle: audio.title,
      audioUrl: audio.audioUrl,
      questions: audio.questions,
      userAnswers: answers,
      timeTaken: Math.floor(currentTime),
    });
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div key={question.id} className="space-y-3">
            <h4 className="font-medium">{question.id}. {question.question}</h4>
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              {question.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q${question.id}-${index}`} />
                  <Label htmlFor={`q${question.id}-${index}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "fill-in-blank":
        return (
          <div key={question.id} className="space-y-3">
            <h4 className="font-medium">{question.id}. {question.question}</h4>
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Listening Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Practice IELTS listening comprehension with audio recordings and questions.
        </p>
      </div>

      {audio && (
        <div className="space-y-6">
          {/* Audio Player */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                {audio.title}
              </CardTitle>
              <CardDescription>
                Listen to the audio and answer the questions. You can replay the audio as needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mock audio element - in a real app, this would be a real audio file */}
              <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                style={{ display: 'none' }}
              >
                <source src={audio.audioUrl} type="audio/mpeg" />
              </audio>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlayback}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <div className="flex-1">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleSeek}
                    className="w-full"
                  />
                </div>

                <span className="text-sm text-gray-600 dark:text-gray-300 min-w-[80px]">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <span className="text-sm">Speed:</span>
                  <Slider
                    value={[playbackSpeed]}
                    min={0.5}
                    max={2}
                    step={0.25}
                    onValueChange={handleSpeedChange}
                    className="w-20"
                  />
                  <span className="text-sm min-w-[30px]">{playbackSpeed}x</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={getNewAudio}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Audio
                </Button>
              </div>

              {/* Mock audio simulation */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-sm">
                <p className="text-yellow-800 dark:text-yellow-200">
                  📢 This is a demo version. In the real app, you would hear actual IELTS listening recordings here.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>
                Answer the questions based on what you hear in the audio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <Badge variant={answeredQuestions === totalQuestions ? "default" : "secondary"}>
                  {answeredQuestions}/{totalQuestions} answered
                </Badge>
              </div>

              <div className="space-y-6">
                {audio.questions.map(renderQuestion)}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={answeredQuestions === 0 || submitListeningMutation.isPending}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {submitListeningMutation.isPending ? "Submitting..." : "Submit Answers"}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200">
                  Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge className="mb-2">Score</Badge>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {result.score}/{result.totalQuestions}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {Math.round((result.score / result.totalQuestions) * 100)}% correct
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-green-800 dark:text-green-200">
                    Answer Review:
                  </h4>
                  {audio.questions.map((question) => (
                    <div key={question.id} className="border-l-4 border-gray-200 pl-4">
                      <p className="font-medium text-sm">
                        Question {question.id}: {question.question}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Your answer: {answers[question.id] || "Not answered"}
                      </p>
                      <p className="text-sm">
                        <span className={answers[question.id] === result.correctAnswers[question.id] ? "text-green-600" : "text-red-600"}>
                          {result.explanations[question.id]}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
