import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookMarked, RotateCcw, Check, X, Volume2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "../contexts/UserContext";
import backend from "~backend/client";

export default function VocabularyBuilder() {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: topics } = useQuery({
    queryKey: ["vocabularyTopics"],
    queryFn: backend.ielts.getVocabularyTopics,
  });

  const { data: wordsData, refetch: refetchWords } = useQuery({
    queryKey: ["vocabularyWords", user?.id, selectedTopic],
    queryFn: () => user ? backend.ielts.getVocabularyWords({ 
      userId: user.id, 
      topic: selectedTopic === "all" ? undefined : selectedTopic,
      limit: 10 
    }) : null,
    enabled: !!user,
    onSuccess: () => {
      setCurrentWordIndex(0);
      setShowAnswer(false);
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["vocabularyProgress", user?.id],
    queryFn: () => user ? backend.ielts.getVocabularyProgress({ userId: user.id }) : null,
    enabled: !!user,
  });

  const updateStatusMutation = useMutation({
    mutationFn: backend.ielts.updateVocabularyStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabularyProgress"] });
      nextWord();
    },
    onError: (error) => {
      console.error("Failed to update vocabulary status:", error);
      toast({
        title: "Error",
        description: "Failed to update word status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const currentWord = wordsData?.words[currentWordIndex];

  const nextWord = () => {
    if (!wordsData) return;
    
    if (currentWordIndex < wordsData.words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      // Get new set of words
      refetchWords();
    }
    setShowAnswer(false);
  };

  const handleWordStatus = (status: string) => {
    if (!user || !currentWord) return;

    updateStatusMutation.mutate({
      userId: user.id,
      wordId: currentWord.id,
      status,
    });
  };

  const playAudio = () => {
    // Mock audio playback - in a real app, this would play the actual audio
    toast({
      title: "🔊 Audio",
      description: `Playing pronunciation for "${currentWord?.word}"`,
    });
  };

  const getNewWords = () => {
    refetchWords();
  };

  const progressPercentage = progress 
    ? Math.round((progress.knownWords / Math.max(progress.totalWords, 1)) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Vocabulary Builder
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Expand your IELTS vocabulary with spaced repetition learning.
        </p>
      </div>

      {/* Progress Overview */}
      {progress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sky-600" />
              Your Vocabulary Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Words Mastered</span>
                  <span>{progress.knownWords} / {progress.totalWords}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">{progress.knownWords}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Known</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{progress.learningWords}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Learning</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{progress.reviewWords}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Review</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Topic Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Topic:</label>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics?.topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={getNewWords}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              New Words
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vocabulary Card */}
      {currentWord && (
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookMarked className="h-5 w-5" />
                Vocabulary Practice
              </span>
              <Badge variant="outline">
                {currentWordIndex + 1} / {wordsData?.words.length || 0}
              </Badge>
            </CardTitle>
            <CardDescription>
              {currentWord.topic} • Level {currentWord.difficultyLevel}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-4">
                <h2 className="text-4xl font-bold text-sky-600 dark:text-sky-400">
                  {currentWord.word}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={playAudio}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>

              {!showAnswer && (
                <Button
                  onClick={() => setShowAnswer(true)}
                  className="mt-6"
                >
                  Show Definition
                </Button>
              )}

              {showAnswer && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Definition:</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {currentWord.definition}
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Example:</h3>
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      "{currentWord.exampleSentence}"
                    </p>
                  </div>

                  <div className="flex justify-center gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => handleWordStatus("review")}
                      disabled={updateStatusMutation.isPending}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Review Later
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleWordStatus("learning")}
                      disabled={updateStatusMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Still Learning
                    </Button>
                    <Button
                      onClick={() => handleWordStatus("known")}
                      disabled={updateStatusMutation.isPending}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      I Know This
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!currentWord && wordsData && (
        <Card>
          <CardContent className="text-center py-12">
            <BookMarked className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No more words to practice
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You've completed all available words for this topic.
            </p>
            <Button onClick={getNewWords}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Get New Words
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
