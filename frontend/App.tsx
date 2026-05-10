import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import { VocabularyProvider } from "./contexts/VocabularyContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import SpeakingPractice from "./pages/SpeakingPractice";
import WritingTask from "./pages/WritingTask";
import WritingFeedbackHistory from "./pages/WritingFeedbackHistory";
import ReadingPractice from "./pages/ReadingPractice";
import ReadingTheory from "./pages/ReadingTheory";
import ListeningPractice from "./pages/ListeningPractice";
import VocabularyBuilder from "./pages/VocabularyBuilder";
import Progress from "./pages/Progress";
import ProgressTracker from "./pages/ProgressTracker";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReadingTFNGQuiz from "./pages/ReadingTFNGQuiz";
import MatchingHeadingsQuiz from "./pages/MatchingHeadingsQuiz";
import ReadingTutor from "./pages/ReadingTutor";
import VideoLesson from "./pages/VideoLesson";
import FeedbackSummaryDemo from "./pages/FeedbackSummaryDemo";
import Roadmap from "./pages/Roadmap";
import Onboarding from "./pages/Onboarding";
import AdminDashboard from "./pages/AdminDashboard";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      retryDelay: 500, // ✅ Wait 500ms before retrying
    },
  },
});

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

function AppInner() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/preview" element={<Dashboard isPreview />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/speaking" element={<ProtectedRoute><SpeakingPractice /></ProtectedRoute>} />
          <Route path="/writing" element={<ProtectedRoute><WritingTask /></ProtectedRoute>} />
          <Route path="/writing/task-1" element={<ProtectedRoute><WritingTask defaultTab="task-1" /></ProtectedRoute>} />
          <Route path="/writing/task-2" element={<ProtectedRoute><WritingTask defaultTab="task-2" /></ProtectedRoute>} />
          <Route path="/writing/feedback-demo" element={<ProtectedRoute><FeedbackSummaryDemo /></ProtectedRoute>} />
          <Route path="/writing/feedback/:id" element={<ProtectedRoute><WritingFeedbackHistory /></ProtectedRoute>} />
          <Route path="/reading" element={<ProtectedRoute><ReadingPractice /></ProtectedRoute>} />
          <Route path="/reading/:id" element={<ProtectedRoute><ReadingPractice /></ProtectedRoute>} />
          <Route path="/reading/quiz-tfng" element={<ProtectedRoute><ReadingTFNGQuiz /></ProtectedRoute>} />
          <Route path="/reading/quiz-matching-headings" element={<ProtectedRoute><MatchingHeadingsQuiz /></ProtectedRoute>} />
          <Route path="/reading/theory" element={<ProtectedRoute><ReadingTheory /></ProtectedRoute>} />
          <Route path="/reading/tutor-chat" element={<ProtectedRoute><ReadingTutor /></ProtectedRoute>} />
          <Route path="/tutor" element={<ProtectedRoute><ReadingTutor /></ProtectedRoute>} />
          <Route path="/listening" element={<ProtectedRoute><ListeningPractice /></ProtectedRoute>} />
          <Route path="/listening/:id" element={<ProtectedRoute><ListeningPractice /></ProtectedRoute>} />
          <Route path="/vocabulary" element={<ProtectedRoute><VocabularyBuilder /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/progress-tracker" element={<ProtectedRoute><ProgressTracker /></ProtectedRoute>} />
          <Route path="/plan" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
          <Route path="/video-lesson/:id" element={<ProtectedRoute><VideoLesson /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for initial session load before rendering the app
    supabase.auth.getSession().then(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <VocabularyProvider>
            <ErrorBoundary>
              <AppInner />
            </ErrorBoundary>
            <Toaster />
          </VocabularyProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
