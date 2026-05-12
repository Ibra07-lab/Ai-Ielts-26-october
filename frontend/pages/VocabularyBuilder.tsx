import { useState } from "react";
import VocabularyDashboard from "@/components/vocabulary/VocabularyDashboard";
import TopicWordList from "@/components/vocabulary/TopicWordList";
import WordDeck from "@/components/vocabulary/WordDeck";
import SynonymSwap from "@/components/vocabulary/exercises/SynonymSwap";
import ContextTetris from "@/components/vocabulary/exercises/ContextTetris";
import SpeakToUnlock from "@/components/vocabulary/exercises/SpeakToUnlock";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PreviewSignupModal } from "@/components/PreviewSignupModal";
import { getAllTopics, getWordsByTopicId, getExercisesByTopicId } from "@/data/vocabulary";
import { shuffleArray } from "@/lib/utils";

type ViewState = "dashboard" | "wordList" | "deck" | "exercise";
type ExerciseType = "synonym" | "tetris" | "speak" | "flashcards";

export default function VocabularyBuilder({ isPreview = false }: { isPreview?: boolean }) {
  const [view, setView] = useState<ViewState>("dashboard");
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [currentExercise, setCurrentExercise] = useState<ExerciseType | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [learningQueue, setLearningQueue] = useState<any[]>([]);
  const [shuffledExercises, setShuffledExercises] = useState<any[]>([]);
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
    if (isPreview) {
      setShowSignupModal(true);
      return;
    }
    // Initialize queue with filtered words in random order
    setLearningQueue(shuffleArray([...filteredWords]));
    setView("deck");
  };

  const handleStartExercise = (type: ExerciseType) => {
    if (isPreview) {
      setShowSignupModal(true);
      return;
    }

    if (type === "flashcards") {
      handleStartLearning();
      return;
    }

    let originalExercises: any[] = [];
    if (type === "synonym") {
      originalExercises = filterMode === "writing" && selectedExercises.writingSynonymSwap
        ? selectedExercises.writingSynonymSwap
        : selectedExercises.synonymSwap;
    } else if (type === "tetris") {
      originalExercises = selectedExercises.contextTetris;
    } else {
      originalExercises = selectedExercises.speakToUnlock;
    }

    setShuffledExercises(shuffleArray([...originalExercises]));
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
    if (currentExerciseIndex < shuffledExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      setView("wordList");
      setCurrentExercise(null);
      setCurrentExerciseIndex(0);
      setShuffledExercises([]);
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
      <PreviewSignupModal 
        open={showSignupModal} 
        onClose={() => setShowSignupModal(false)} 
      />
      <div className="w-full h-full">
        {view === "dashboard" && (
          <VocabularyDashboard
            topics={topics}
            allWords={allWords}
            onTopicSelect={handleTopicSelect}
            isPreview={isPreview}
            onShowSignupModal={() => setShowSignupModal(true)}
          />
        )}

        {view === "wordList" && selectedTopic && (
          <div className="p-4 sm:p-6 h-full">
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
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setView("wordList");
                  setCurrentExercise(null);
                }}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Word List
              </Button>

              {/* Set Navigation (if multiple sets exist) */}
              {currentExercise === "tetris" && shuffledExercises.length > 1 && (
                <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
                  {shuffledExercises.map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentExerciseIndex(idx)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${currentExerciseIndex === idx
                        ? "bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                    >
                      {ex.set_name || `Set ${idx + 1}`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              {currentExercise === "synonym" && shuffledExercises.length > 0 && (
                <SynonymSwap
                  {...shuffledExercises[currentExerciseIndex]}
                  onComplete={handleExerciseComplete}
                />
              )}

              {currentExercise === "tetris" && shuffledExercises.length > 0 && (
                <ContextTetris
                  {...shuffledExercises[currentExerciseIndex]}
                  onComplete={handleExerciseComplete}
                />
              )}

              {currentExercise === "speak" && shuffledExercises.length > 0 && (
                <SpeakToUnlock
                  {...shuffledExercises[currentExerciseIndex]}
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
