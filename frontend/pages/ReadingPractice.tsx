import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Clock, Send, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "../contexts/UserContext";
import backend from "~backend/client";

export default function ReadingPractice() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: passage, refetch: refetchPassage } = useQuery({
    queryKey: ["readingPassage"],
    queryFn: backend.ielts.getReadingPassage,
    onSuccess: () => {
      setStartTime(Date.now());
      setAnswers({});
      setResult(null);
    },
  });

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
    if (!user || !passage || !startTime) return;

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    submitReadingMutation.mutate({
      userId: user.id,
      passageTitle: passage.title,
      passageContent: passage.content,
      questions: passage.questions,
      userAnswers: answers,
      timeTaken,
    });
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const getNewPassage = () => {
    refetchPassage();
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

      case "true-false-not-given":
        return (
          <div key={question.id} className="space-y-3">
            <h4 className="font-medium">{question.id}. {question.question}</h4>
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              {["True", "False", "Not Given"].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q${question.id}-${option}`} />
                  <Label htmlFor={`q${question.id}-${option}`} className="text-sm">
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
  const totalQuestions = passage?.questions.length || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Reading Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Practice IELTS reading comprehension with authentic passages and questions.
        </p>
      </div>

      {passage && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reading Passage */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {passage.title}
              </CardTitle>
              <CardDescription>
                Read the passage carefully and answer the questions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {passage.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>
                <div className="flex items-center justify-between">
                  <span>Answer all questions based on the passage.</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Recommended: 20 minutes</span>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <Badge variant={answeredQuestions === totalQuestions ? "default" : "secondary"}>
                  {answeredQuestions}/{totalQuestions} answered
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getNewPassage}
                  disabled={submitReadingMutation.isPending}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Passage
                </Button>
              </div>

              <div className="space-y-6">
                {passage.questions.map(renderQuestion)}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={answeredQuestions === 0 || submitReadingMutation.isPending}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {submitReadingMutation.isPending ? "Submitting..." : "Submit Answers"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

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
              {passage?.questions.map((question) => (
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
  );
}
