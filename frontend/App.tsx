import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import SpeakingPractice from "./pages/SpeakingPractice";
import WritingTask from "./pages/WritingTask";
import ReadingPractice from "./pages/ReadingPractice";
import ListeningPractice from "./pages/ListeningPractice";
import VocabularyBuilder from "./pages/VocabularyBuilder";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import AICoach from "./pages/AICoach";
import Subscription from "./pages/Subscription";
import Register from "./pages/Register";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function AppInner() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/speaking" element={<SpeakingPractice />} />
          <Route path="/writing" element={<WritingTask />} />
          <Route path="/reading" element={<ReadingPractice />} />
          <Route path="/listening" element={<ListeningPractice />} />
          <Route path="/vocabulary" element={<VocabularyBuilder />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/coach" element={<AICoach />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <ErrorBoundary>
            <AppInner />
          </ErrorBoundary>
          <Toaster />
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
