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

  // Get all topics from the data files
  const topics = getAllTopics();

  // Get words and exercises for selected topic
  const selectedWords = selectedTopicId ? getWordsByTopicId(selectedTopicId) : [];
  const selectedExercises = selectedTopicId ? getExercisesByTopicId(selectedTopicId) : { synonymSwap: [], contextTetris: [], speakToUnlock: [] };

  const handleTopicSelect = (topicId: number) => {
    setSelectedTopicId(topicId);
    setView("wordList");
    setCurrentExerciseIndex(0);
  };

  const handleStartLearning = () => {
    // Initialize queue with all words
    setLearningQueue([...selectedWords]);
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
  };

  const selectedTopic = topics.find(t => t.id === selectedTopicId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-6">
      <div className="max-w-6xl mx-auto">
        {view === "dashboard" && (
          <VocabularyDashboard
            topics={topics}
            onTopicSelect={handleTopicSelect}
          />
        )}

        {view === "wordList" && selectedTopic && (
          <TopicWordList
            topicName={selectedTopic.name}
            words={selectedWords}
            onBack={handleBackToDashboard}
            onStartLearning={handleStartLearning}
            onStartExercise={handleStartExercise}
          />
        )}

        {view === "deck" && learningQueue.length > 0 && (
          <WordDeck
            word={learningQueue[0]}
            onKnow={handleKnow}
            onDontKnow={handleDontKnow}
            onBack={handleBackFromDeck}
            remainingCount={learningQueue.length}
          />
        )}

        {view === "exercise" && currentExercise === "synonym" && selectedExercises.synonymSwap.length > 0 && (
          <>
            <Button
              variant="ghost"
              onClick={() => setView("wordList")}
              className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Word List
            </Button>
            <SynonymSwap
              {...selectedExercises.synonymSwap[currentExerciseIndex]}
              onComplete={handleExerciseComplete}
            />
          </>
        )}

        {view === "exercise" && currentExercise === "tetris" && selectedExercises.contextTetris.length > 0 && (
          <>
            <Button
              variant="ghost"
              onClick={() => setView("wordList")}
              className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Word List
            </Button>
            <ContextTetris
              {...selectedExercises.contextTetris[currentExerciseIndex]}
              onComplete={handleExerciseComplete}
            />
          </>
        )}

        {view === "exercise" && currentExercise === "speak" && selectedExercises.speakToUnlock.length > 0 && (
          <>
            <Button
              variant="ghost"
              onClick={() => setView("wordList")}
              className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Word List
            </Button>
            <SpeakToUnlock
              {...selectedExercises.speakToUnlock[currentExerciseIndex]}
              onComplete={handleExerciseComplete}
            />
          </>
        )}
      </div>
    </div>
  );
}
