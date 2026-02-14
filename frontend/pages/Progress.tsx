import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Target, BookOpen, Mic, PenTool, Headphones, ArrowRight, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "../contexts/UserContext";
import backend from "@/backend";
import * as progressApi from "@/api/progress";
import DailyProgressChart from "../components/progress/DailyProgressChart";
import ReadingProgressTracker from "../components/progress/ReadingProgressTracker";




export default function Progress() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [viewDays, setViewDays] = useState(14);

  const { data: progress } = useQuery({
    queryKey: ["progress", user?.id],
    queryFn: () => user ? backend.ielts.getProgress({ userId: user.id }) : null,
    enabled: !!user,
  });

  const { data: speakingSessions } = useQuery({
    queryKey: ["speakingSessions", user?.id],
    queryFn: () => user ? backend.ielts.getSpeakingSessions({ userId: user.id }) : null,
    enabled: !!user,
  });

  const { data: writingSessions } = useQuery({
    queryKey: ["writingSessions", user?.id],
    queryFn: () => user ? backend.ielts.getWritingSessions({ userId: user.id }) : null,
    enabled: !!user,
  });

  const { data: readingSessions } = useQuery({
    queryKey: ["readingSessions", user?.id],
    queryFn: () => user ? backend.ielts.getReadingSessions({ userId: user.id }) : null,
    enabled: !!user,
  });

  const { data: listeningSessions } = useQuery({
    queryKey: ["listeningSessions", user?.id],
    queryFn: () => user ? backend.ielts.getListeningSessions({ userId: user.id }) : null,
    enabled: !!user,
  });

  const { data: vocabularyProgress } = useQuery({
    queryKey: ["vocabularyProgress", user?.id],
    queryFn: () => user ? backend.ielts.getVocabularyProgress({ userId: user.id }) : null,
    enabled: !!user,
  });

  const { data: tasksData } = useQuery({
    queryKey: ["glow-tasks", user?.id, "monthly", "all"],
    queryFn: () => user ? progressApi.listTasks(user.id, "monthly", "all") : { tasks: [] },
    enabled: !!user,
  });

  if (!user) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600 dark:text-gray-300">Please set up your profile to view progress.</p>
        </div>
      </>
    );
  }

  const getSkillProgress = (skill: string) => {
    return progress?.overall.find(p => p.skill === skill);
  };

  const readingMistakes = [
    { type: "True/False/Not Given", accuracy: 68, prevAccuracy: 60 },
    { type: "Yes/No/Not Given", accuracy: 65, prevAccuracy: 58 },
    { type: "Matching Headings", accuracy: 42, prevAccuracy: 55 },
    { type: "Multiple Choice", accuracy: 82, prevAccuracy: 75 },
    { type: "Summary Completion", accuracy: 88, prevAccuracy: 85 },
    { type: "Sentence Completion", accuracy: 91, prevAccuracy: 88 },
    { type: "Matching Information", accuracy: 54, prevAccuracy: 62 },
    { type: "Matching Features", accuracy: 60, prevAccuracy: 55 },
    { type: "Matching Endings", accuracy: 58, prevAccuracy: 50 },
    { type: "Short Answer", accuracy: 77, prevAccuracy: 70 },
    { type: "Table Completion", accuracy: 85, prevAccuracy: 80 },
    { type: "Flow-chart Completion", accuracy: 79, prevAccuracy: 75 },
    { type: "Diagram Labeling", accuracy: 82, prevAccuracy: 78 },
    { type: "Note Completion", accuracy: 89, prevAccuracy: 85 },
  ];


  // Aggregate daily progress data for the activity chart
  const getDailyProgress = (days: number) => {
    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      const fullDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

      const isSameDay = (d: any) => {
        if (!d) return false;
        // Handle both string and Date objects from API
        const dDate = new Date(d);
        return dDate.toDateString() === date.toDateString();
      };

      // Count core practice sessions (1 point each)
      const listeningSes = listeningSessions?.sessions.filter((s: any) => isSameDay(s.createdAt)).length || 0;
      const readingSes = readingSessions?.sessions.filter((s: any) => isSameDay(s.createdAt)).length || 0;
      const writingSes = writingSessions?.sessions.filter((s: any) => isSameDay(s.createdAt)).length || 0;
      const speakingSes = speakingSessions?.sessions.filter((s: any) => isSameDay(s.createdAt)).length || 0;

      // Filter tasks.
      const dailyTasksAll = tasksData?.tasks || [];
      const dailyCompletedTasks = dailyTasksAll.filter(t => {
        if (t.status === 'completed') {
          return isSameDay(t.completedAt || t.updatedAt);
        }
        return false;
      });

      // Calculate planned count for this day (tasks due this day OR created this day)
      const plannedCount = dailyTasksAll.filter(t => {
        if (t.dueAt) return isSameDay(t.dueAt);
        // If no due date, count it as planned if it was created today
        return isSameDay(t.createdAt);
      }).length;

      // Dynamic Goal: If user has planned tasks, use that count. otherwise default to 5.
      // If planned is 2, goal is 2. If planned is 0, goal is 5 (gamified default).
      let goal = plannedCount > 0 ? plannedCount : 5;

      // Safety: Goal should never be less than completed count (prevents >100% bars if logic drifts)
      const totalDailyCompleted = dailyCompletedTasks.length;
      if (goal < totalDailyCompleted) goal = totalDailyCompleted;

      // Calculate points from completed tasks by category
      const taskReading = dailyCompletedTasks.filter(t => t.category === "reading").length;
      const taskWriting = dailyCompletedTasks.filter(t => t.category === "writing").length;
      const taskListening = dailyCompletedTasks.filter(t => t.category === "listening").length;
      const taskSpeaking = dailyCompletedTasks.filter(t => t.category === "speaking").length;
      const taskVocab = dailyCompletedTasks.filter(t => t.category === "vocabulary").length;
      const taskGrammar = dailyCompletedTasks.filter(t => t.category === "grammar").length;

      const listening = listeningSes + taskListening;
      const reading = readingSes + taskReading;
      const writing = writingSes + taskWriting;
      const speaking = speakingSes + taskSpeaking;
      const vocabulary = taskVocab;
      const grammar = taskGrammar;

      data.push({
        date: dateStr,
        fullDate,
        listening,
        reading,
        writing,
        speaking,
        vocabulary,
        grammar,
        total: listening + reading + writing + speaking + vocabulary + grammar,
        goal
      });
    }
    return data;
  };

  const dailyData = getDailyProgress(viewDays);

  return (
    <div className="text-foreground animate-in fade-in slide-in-from-bottom-6 duration-1000 py-10 font-sans selection:bg-red-500/30 selection:text-red-500">

      {/* Header Section - Brutalist Typography */}
      <div className="mb-20 relative">
        <h1 className="text-6xl font-black text-foreground tracking-tighter sm:text-7xl uppercase leading-[0.8]">
          Combat<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">Analytics</span>
        </h1>
        <p className="mt-6 text-lg font-mono text-muted-foreground max-w-xl uppercase tracking-widest border-l-2 border-cyan-500 pl-4">
          Tactical breakdown of your current IELTS performance capability.
        </p>
      </div>

      {/* SECTOR 1: TACTICAL OPS (Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Activity Chart - Full Width */}
        <div className="lg:col-span-12 flex flex-col h-[500px] border border-border bg-background/50 p-4 relative overflow-hidden">
          {/* Decorator */}
          <div className="absolute top-0 right-0 p-2 opacity-50">
            <Target className="w-12 h-12 text-cyan-500/10" />
          </div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-500" />
              Activity Signatures
            </h3>
            <div className="flex gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Live Feed</span>
            </div>
          </div>
          <div className="flex-grow">
            <DailyProgressChart data={dailyData} days={viewDays} onDaysChange={setViewDays} />
          </div>
        </div>
      </div>

      {/* SECTOR 2: INTELLIGENCE & COMPETITION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">


        {/* Skill Matrix - Full Width */}
        <div className="lg:col-span-12">
          <div className="flex items-end justify-between mb-8 border-b border-foreground/10 pb-4">
            <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter">
              Skill<span className="text-stone-400">Matrix</span>
            </h2>
            <div className="flex gap-4 text-[10px] font-mono tracking-widest text-muted-foreground hidden sm:flex">
              <span>// READING PROTOCOL</span>
              <span>// DIAGNOSTICS: ACTIVE</span>
            </div>
          </div>
          <ReadingProgressTracker />
        </div>
      </div>

      {/* SECTOR 3: LOGS (Retained & Styled) */}
      <div className="space-y-12">
        <div className="flex items-center gap-4 bg-foreground/5 p-4 border-l-4 border-foreground">
          <h2 className="text-xl font-black text-foreground uppercase tracking-wider">Session Archives</h2>
        </div>

        <Tabs defaultValue="writing" className="w-full">
          <TabsList className="bg-transparent w-full flex justify-start gap-8 p-0 h-auto mb-8 border-b border-border/50">
            {['writing', 'reading'].map((skill) => (
              <TabsTrigger
                key={skill}
                value={skill}
                className="bg-transparent p-0 pb-4 text-xs font-black uppercase tracking-widest text-muted-foreground data-[state=active]:text-red-500 data-[state=active]:border-b-2 data-[state=active]:border-red-500 rounded-none transition-all"
              >
                {skill} Protocol
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="min-h-[400px]">
            {/* Content logic remains same, just ensuring style inheritance */}
            <TabsContent value="writing" className="m-0 focus-visible:outline-none">
              <SessionList
                data={writingSessions?.sessions}
                renderRow={(session: any) => (
                  <div key={session.id} className="flex items-center justify-between py-6 group cursor-pointer border-b border-border/40 hover:bg-muted/30 transition-colors px-4" onClick={() => navigate(`/writing/feedback/${session.id}`)}>
                    <div className="flex items-center gap-6">
                      <div className="text-2xl font-black text-stone-300 group-hover:text-red-500 transition-colors">W</div>
                      <div>
                        <div className="text-sm font-bold text-foreground uppercase tracking-wider">Task {session.taskType} Composition</div>
                        <div className="text-[10px] font-mono text-muted-foreground mt-1">
                          {new Date(session.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }).toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-xl font-black text-foreground tabular-nums group-hover:text-red-500 transition-colors">{session.bandScore || "0.0"}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1" />
                    </div>
                  </div>
                )}
              />
            </TabsContent>
            <TabsContent value="reading" className="m-0 focus-visible:outline-none">
              <SessionList
                data={readingSessions?.sessions}
                renderRow={(session: any) => (
                  <div key={session.id} className="flex items-center justify-between py-6 group cursor-pointer border-b border-border/40 hover:bg-muted/30 transition-colors px-4" onClick={() => navigate(`/reading/feedback/${session.id}`)}>
                    <div className="flex items-center gap-6 max-w-[70%]">
                      <div className="text-2xl font-black text-stone-300 group-hover:text-red-500 transition-colors">R</div>
                      <div className="truncate">
                        <div className="text-sm font-bold text-foreground uppercase tracking-wider truncate">{session.passageTitle}</div>
                        <div className="text-[10px] font-mono text-muted-foreground mt-1">
                          {new Date(session.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }).toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-lg font-black text-foreground tabular-nums group-hover:text-red-500 transition-colors">{session.score}/{session.totalQuestions}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1" />
                    </div>
                  </div>
                )}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

function SessionList({ data, emptyMsg = "No session logs found.", renderRow }: any) {
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <div className="p-6 rounded-full bg-muted mb-6 ring-1 ring-border/10">
          <TrendingUp className="w-8 h-8 opacity-20" />
        </div>
        <p className="text-sm font-bold uppercase tracking-widest">{emptyMsg}</p>
      </div>
    );
  }
  return <div className="divide-y divide-border/10">{data.slice(0, 8).map(renderRow)}</div>;
}
