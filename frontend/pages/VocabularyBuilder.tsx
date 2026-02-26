import { useState } from "react";
import VocabularyDashboard from "@/components/vocabulary/VocabularyDashboard";
import TopicWordList from "@/components/vocabulary/TopicWordList";
import WordDeck from "@/components/vocabulary/WordDeck";
import SynonymSwap from "@/components/vocabulary/exercises/SynonymSwap";
import ContextTetris from "@/components/vocabulary/exercises/ContextTetris";
import SpeakToUnlock from "@/components/vocabulary/exercises/SpeakToUnlock";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getAllTopics, getWordsByTopicId, getExercisesByTopicId } from "@/data/vocabulary";

type ViewState = "dashboard" | "wordList" | "deck" | "exercise";
type ExerciseType = "synonym" | "tetris" | "speak";

export default function VocabularyBuilder() {
  const [view, setView] = useState<ViewState>("dashboard");
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [currentExercise, setCurrentExercise] = useState<ExerciseType | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [learningQueue, setLearningQueue] = useState<any[]>([]);
  const [filterMode, setFilterMode] = useState<"all" | "speaking" | "writing">("all");

  // Get all topics from the data files
  const topics = getAllTopics();

  // Get words and exercises for selected topic
  const selectedWords = selectedTopicId ? getWordsByTopicId(selectedTopicId) : [];

  // Filter words based on mode
  const filteredWords = selectedWords.filter(word => {
    if (filterMode === "speaking") {
      // Show idioms, phrasal verbs, and words with speaking context
      return (
        word.type === "idiom" ||
        word.type === "phrasal_verb" ||
        word.context?.toLowerCase().includes("speaking") ||
        word.speakingExample
      );
    }
    if (filterMode === "writing") {
      // Show academic words and words with writing context
      return (
        word.type === "academic" ||
        word.context?.toLowerCase().includes("writing") ||
        word.writingExample
      );
    }
    return true;
  });

  const selectedExercises = selectedTopicId ? getExercisesByTopicId(selectedTopicId) : { synonymSwap: [], contextTetris: [], speakToUnlock: [] };

  const handleTopicSelect = (topicId: number, mode: "all" | "speaking" | "writing" = "all") => {
    setSelectedTopicId(topicId);
    setFilterMode(mode);
    setView("wordList");
    setCurrentExerciseIndex(0);
  };

  const handleStartLearning = () => {
    // Initialize queue with filtered words
    setLearningQueue([...filteredWords]);
    setView("deck");
  };

  const handleStartExercise = (type: ExerciseType) => {
    setCurrentExercise(type);
    setView("exercise");
    setCurrentExerciseIndex(0);
  };

  const handleKnow = () => {
    // Remove current word from queue
    const newQueue = [...learningQueue];
    newQueue.shift(); // Remove the first item (current word)

    if (newQueue.length === 0) {
      // All words learned!
      setView("wordList");
    } else {
      setLearningQueue(newQueue);
    }
  };

  const handleDontKnow = () => {
    // Move current word to the end of the queue
    const newQueue = [...learningQueue];
    const currentWord = newQueue.shift();
    if (currentWord) {
      newQueue.push(currentWord);
    }
    setLearningQueue(newQueue);
  };

  const handleBackFromDeck = () => {
    setView("wordList");
  };

  const handleExerciseComplete = () => {
    const exerciseArray = currentExercise === "synonym"
      ? selectedExercises.synonymSwap
      : currentExercise === "tetris"
        ? selectedExercises.contextTetris
        : selectedExercises.speakToUnlock;

    if (currentExerciseIndex < exerciseArray.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      setView("wordList");
      setCurrentExercise(null);
      setCurrentExerciseIndex(0);
    }
  };

  const handleBackToDashboard = () => {
    setView("dashboard");
    setSelectedTopicId(null);
    setCurrentExercise(null);
    setFilterMode("all");
  };

  const selectedTopic = topics.find(t => t.id === selectedTopicId);

  // Get all words for global SRS review
  const allWords = topics.flatMap(t => getWordsByTopicId(t.id));

  return (
    <div className="h-full overflow-hidden bg-gray-50 dark:bg-background">
      <div className="w-full h-full">
        {view === "dashboard" && (
          <VocabularyDashboard
            topics={topics}
            allWords={allWords}
            onTopicSelect={handleTopicSelect}
          />
        )}

        {view === "wordList" && selectedTopic && (
          <div className="p-6 sm:p-8 h-full">
            <TopicWordList
              topicName={selectedTopic.name + (filterMode !== "all" ? ` (${filterMode.charAt(0).toUpperCase() + filterMode.slice(1)})` : "")}
              words={filteredWords}
              onBack={handleBackToDashboard}
              onStartLearning={handleStartLearning}
              onStartExercise={handleStartExercise}
            />
          </div>
        )}

        {view === "deck" && learningQueue.length > 0 && (
          <div className="p-6 sm:p-8 h-full flex flex-col">
            <WordDeck
              word={learningQueue[0]}
              onKnow={handleKnow}
              onDontKnow={handleDontKnow}
              onBack={handleBackFromDeck}
              remainingCount={learningQueue.length}
            />
          </div>
        )}

        {view === "exercise" && (
          <div className="h-full overflow-y-auto px-3 sm:px-5 py-3 pb-24">
            <Button
              variant="ghost"
              onClick={() => {
                setView("wordList");
                setCurrentExercise(null);
              }}
              className="mb-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Word List
            </Button>

            <div>
              {currentExercise === "synonym" && selectedExercises.synonymSwap.length > 0 && (
                <SynonymSwap
                  {...selectedExercises.synonymSwap[currentExerciseIndex]}
                  onComplete={handleExerciseComplete}
                />
              )}

              {currentExercise === "tetris" && selectedExercises.contextTetris.length > 0 && (
                <ContextTetris
                  {...selectedExercises.contextTetris[currentExerciseIndex]}
                  onComplete={handleExerciseComplete}
                />
              )}

              {currentExercise === "speak" && selectedExercises.speakToUnlock.length > 0 && (
                <SpeakToUnlock
                  {...selectedExercises.speakToUnlock[currentExerciseIndex]}
                  onComplete={handleExerciseComplete}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
