import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Clock, Send, RotateCcw, Highlighter } from "lucide-react";
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
import TextHighlighter from "../components/TextHighlighter";
import backend from "~backend/client";

interface Highlight {
  id: number;
  highlightedText: string;
  startPosition: number;
  endPosition: number;
  highlightType: string;
  highlightColor: string;
}

// Collapsible question result component
function QuestionResult({ 
  question, 
  answer, 
  correctAnswer, 
  explanation 
}: { 
  question: any; 
  answer: string; 
  correctAnswer: string; 
  explanation: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isCorrect = answer === correctAnswer;

  return (
    <div 
      className={`p-3 rounded-lg border-l-4 cursor-pointer transition-colors ${
        isCorrect 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-500 hover:bg-green-100 dark:hover:bg-green-900/30' 
          : 'bg-red-50 dark:bg-red-900/20 border-red-500 hover:bg-red-100 dark:hover:bg-red-900/30'
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm ${
            isCorrect ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {isCorrect ? '✓' : '✗'}
          </div>
          <span className="font-medium">
            Q{question.id}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {expanded ? '▼' : '▶'}
        </span>
      </div>
      
      {expanded && (
        <div className="mt-3 pl-8 text-sm space-y-2 border-t pt-3">
          <p><strong>Question:</strong> {question.questionText || question.sentenceBeginning}</p>
          <p><strong>Your answer:</strong> <span className="font-semibold">{answer || "Not answered"}</span></p>
          <p><strong>Correct answer:</strong> <span className="font-semibold text-green-700 dark:text-green-400">{correctAnswer}</span></p>
          <p className={isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
            {explanation}
          </p>
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

export default function ReadingPractice() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [activeTab, setActiveTab] = useState("passage");
  const [viewMode, setViewMode] = useState<"tabs" | "split">("tabs");
  const [selectedTestIndex, setSelectedTestIndex] = useState<number | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(60 * 60);
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
            <h4 className="font-medium">{question.questionText}</h4>
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              {question.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q${question.id}-${index}`} />
                  <Label htmlFor={`q${question.id}-${index}`} className="text-sm">
                    {String.fromCharCode(105 + index)}. {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "multiple-choice":
        return (
          <div key={question.id} className="space-y-3">
            <h4 className="font-medium">{question.id}. {question.questionText}</h4>
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              {question.options?.map((option: string, index: number) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => {
                    if (answers[question.id] === option) {
                      handleAnswerChange(question.id, "");
                    }
                  }}
                >
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
            <h4 className="font-medium">{question.id}. {question.questionText}</h4>
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
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
        return (
          <div key={question.id} className="space-y-3">
            <h4 className="font-medium">{question.id}. {question.questionText}</h4>
            <Input
              placeholder="Type your answer..."
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="max-w-md"
            />
          </div>
        );

      case "short-answer":
        return (
          <div key={question.id} className="space-y-3">
            <h4 className="font-medium">{question.id}. {question.questionText}</h4>
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
            <h4 className="font-medium">
              {question.id}. {question.questionText || question.sentenceBeginning || question.incompleteSentence}
            </h4>
            {question.options ? (
              // Multiple-choice style sentence completion (matching sentence endings)
              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
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
            ) : (
              // Fill-in-the-blank style sentence completion
              <>
                {question.wordLimit && (
                  <p className="text-xs text-gray-500 italic">{question.wordLimit}</p>
                )}
                <Input
                  placeholder="Type your answer..."
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="max-w-md"
                />
              </>
            )}
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
      <div className="max-w-7xl mx-auto space-y-6 pb-32">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reading Practice
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Practice IELTS reading comprehension with authentic passages and questions. Highlight text to add to vocabulary or get translations.
          </p>
        </div>

        {selectedTestIndex === null && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testsData?.tests?.map((test: any) => (
                <div
                  key={test.testId}
                  onClick={() => {
                    setSelectedTestId(test.testId);
                    setSelectedTestIndex(null);
                    setActiveSlideIndex(0);
                    setAnswers({});
                    setResult(null);
                    setHighlights([]);
                  }}
                  className={`cursor-pointer p-6 rounded-2xl text-center shadow-md transition-all 
                  ${
                    selectedTestId === test.testId
                      ? "bg-blue-600 dark:bg-blue-600 scale-105 text-white"
                      : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <h2 className="text-xl font-semibold">{test.testName}</h2>
                  <p className={`text-sm mt-2 ${selectedTestId === test.testId ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                    {test.totalQuestions} questions
                  </p>
                </div>
              ))}
            </div>

            {selectedTestId && (
              <div className="flex justify-center">
                <Button 
                  onClick={() => enterTest(0)} 
                  size="lg"
                  className="px-8 py-6 text-lg"
                  disabled={!tests || tests.length === 0}
                >
                  Start Test {selectedTestId}
                </Button>
              </div>
            )}
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
                                        <h4 className="font-medium">{question.questionText}</h4>
                                        <RadioGroup
                                          value={selectedAnswer}
                                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                                        >
                                          {question.options?.map((option: string, index: number) => {
                                            const isUsedElsewhere = usedOptions.includes(option);
                                            return (
                                              <div 
                                                key={index} 
                                                className="flex items-center space-x-2 cursor-pointer"
                                                onClick={() => {
                                                  if (selectedAnswer === option) {
                                                    handleAnswerChange(question.id, "");
                                                  }
                                                }}
                                              >
                                                <RadioGroupItem 
                                                  value={option} 
                                                  id={`q${question.id}-${index}`}
                                                  disabled={isUsedElsewhere}
                                                />
                                                <Label 
                                                  htmlFor={`q${question.id}-${index}`} 
                                                  className={`text-sm ${isUsedElsewhere ? 'text-red-500 line-through opacity-50' : ''}`}
                                                >
                                                  {toRomanNumeral(index + 1)}. {option}
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
                                      <h4 className="font-medium">{question.id}. {question.questionText}</h4>
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
                                      <p className="flex-1 text-sm">{q.questionText}</p>
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
                                          <h4 className="font-medium text-xs">{question.questionText}</h4>
                                          <RadioGroup
                                            value={selectedAnswer}
                                            onValueChange={(value) => handleAnswerChange(question.id, value)}
                                            className="space-y-1"
                                          >
                                            {question.options?.map((option: string, index: number) => {
                                              const isUsedElsewhere = usedOptions.includes(option);
                                              return (
                                                <div 
                                                  key={index} 
                                                  className="flex items-center space-x-2 cursor-pointer"
                                                  onClick={() => {
                                                    if (selectedAnswer === option) {
                                                      handleAnswerChange(question.id, "");
                                                    }
                                                  }}
                                                >
                                                  <RadioGroupItem 
                                                    value={option} 
                                                    id={`split-q${question.id}-${index}`}
                                                    className="h-3 w-3"
                                                    disabled={isUsedElsewhere}
                                                  />
                                                  <Label 
                                                    htmlFor={`split-q${question.id}-${index}`} 
                                                    className={`text-xs leading-tight ${isUsedElsewhere ? 'text-red-500 line-through opacity-50' : ''}`}
                                                  >
                                                    {toRomanNumeral(index + 1)}. {option}
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
                              ) : questionGroup.type === "summary-completion" || 
                                 questionGroup.type === "note-completion" || 
                                 questionGroup.type === "table-completion" || 
                                 questionGroup.type === "flow-chart-completion" ||
                                questionGroup.type === "matching-information" ? (
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
                                        <p className="flex-1 text-xs">{q.questionText}</p>
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
                                          <h4 className="font-medium text-xs">{question.questionText}</h4>
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
                                          <h4 className="font-medium text-xs">{question.id}. {question.questionText}</h4>
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
                                          <h4 className="font-medium text-xs">{question.id}. {question.questionText}</h4>
                                          <RadioGroup
                                            value={answers[question.id] || ""}
                                            onValueChange={(value) => handleAnswerChange(question.id, value)}
                                            className="flex gap-3"
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
                                    case "short-answer":
                                      return (
                                        <div key={question.id} className="space-y-1.5">
                                          <h4 className="font-medium text-xs">{question.id}. {question.questionText}</h4>
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
                                          <h4 className="font-medium text-xs">
                                            {question.id}. {question.questionText || question.sentenceBeginning || question.incompleteSentence}
                                          </h4>
                                          {question.options ? (
                                            <RadioGroup
                                              value={answers[question.id] || ""}
                                              onValueChange={(value) => handleAnswerChange(question.id, value)}
                                              className="space-y-1"
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
                                            <>
                                              {question.wordLimit && (
                                                <p className="text-xs text-gray-500 italic">{question.wordLimit}</p>
                                              )}
                                              <Input
                                                placeholder="Type your answer..."
                                                value={answers[question.id] || ""}
                                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                className="h-8 text-sm"
                                              />
                                            </>
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
