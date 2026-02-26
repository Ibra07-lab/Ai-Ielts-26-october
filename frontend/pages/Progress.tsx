import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Target,
  BookOpen,
  Mic,
  PenTool,
  Headphones,
  ChevronRight,
  BarChart3,
  Flame,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
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
    queryFn: () => (user ? backend.ielts.getProgress({ userId: user.id }) : null),
    enabled: !!user,
  });

  const { data: speakingSessions } = useQuery({
    queryKey: ["speakingSessions", user?.id],
    queryFn: () => (user ? backend.ielts.getSpeakingSessions({ userId: user.id }) : null),
    enabled: !!user,
  });

  const { data: writingSessions } = useQuery({
    queryKey: ["writingSessions", user?.id],
    queryFn: () => (user ? backend.ielts.getWritingSessions({ userId: user.id }) : null),
    enabled: !!user,
  });

  const { data: readingSessions } = useQuery({
    queryKey: ["readingSessions", user?.id],
    queryFn: () => (user ? backend.ielts.getReadingSessions({ userId: user.id }) : null),
    enabled: !!user,
  });

  const { data: listeningSessions } = useQuery({
    queryKey: ["listeningSessions", user?.id],
    queryFn: () => (user ? backend.ielts.getListeningSessions({ userId: user.id }) : null),
    enabled: !!user,
  });

  const { data: vocabularyProgress } = useQuery({
    queryKey: ["vocabularyProgress", user?.id],
    queryFn: () => (user ? backend.ielts.getVocabularyProgress({ userId: user.id }) : null),
    enabled: !!user,
  });

  const { data: tasksData } = useQuery({
    queryKey: ["glow-tasks", user?.id, "monthly", "all"],
    queryFn: () => (user ? progressApi.listTasks(user.id, "monthly", "all") : { tasks: [] }),
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-300">
          Please set up your profile to view progress.
        </p>
      </div>
    );
  }

  // Aggregate daily progress data for the activity chart
  const getDailyProgress = (days: number) => {
    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      const fullDate = date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

      const isSameDay = (d: any) => {
        if (!d) return false;
        const dDate = new Date(d);
        return dDate.toDateString() === date.toDateString();
      };

      const listeningSes = listeningSessions?.sessions.filter((s: any) => isSameDay(s.createdAt)).length || 0;
      const readingSes = readingSessions?.sessions.filter((s: any) => isSameDay(s.createdAt)).length || 0;
      const writingSes = writingSessions?.sessions.filter((s: any) => isSameDay(s.createdAt)).length || 0;
      const speakingSes = speakingSessions?.sessions.filter((s: any) => isSameDay(s.createdAt)).length || 0;

      const dailyTasksAll = tasksData?.tasks || [];
      const dailyCompletedTasks = dailyTasksAll.filter((t) => {
        if (t.status === "completed") {
          return isSameDay(t.completedAt || t.updatedAt);
        }
        return false;
      });

      const plannedCount = dailyTasksAll.filter((t) => {
        if (t.dueAt) return isSameDay(t.dueAt);
        return isSameDay(t.createdAt);
      }).length;

      let goal = plannedCount > 0 ? plannedCount : 5;
      const totalDailyCompleted = dailyCompletedTasks.length;
      if (goal < totalDailyCompleted) goal = totalDailyCompleted;

      const taskReading = dailyCompletedTasks.filter((t) => t.category === "reading").length;
      const taskWriting = dailyCompletedTasks.filter((t) => t.category === "writing").length;
      const taskListening = dailyCompletedTasks.filter((t) => t.category === "listening").length;
      const taskSpeaking = dailyCompletedTasks.filter((t) => t.category === "speaking").length;
      const taskVocab = dailyCompletedTasks.filter((t) => t.category === "vocabulary").length;
      const taskGrammar = dailyCompletedTasks.filter((t) => t.category === "grammar").length;

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
        goal,
      });
    }
    return data;
  };

  const dailyData = getDailyProgress(viewDays);

  // Quick stats
  const totalSessions =
    (writingSessions?.sessions?.length || 0) +
    (readingSessions?.sessions?.length || 0) +
    (listeningSessions?.sessions?.length || 0) +
    (speakingSessions?.sessions?.length || 0);

  const currentStreak = (() => {
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < dailyData.length; i++) {
      const dayData = dailyData[dailyData.length - 1 - i];
      if (i === 0 && dayData.total === 0) continue; // Today might not have activity yet
      if (dayData.total > 0) streak++;
      else break;
    }
    return streak;
  })();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 py-8 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto font-sans">

      {/* ═══ PAGE HEADER ═══ */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Your Progress
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your IELTS preparation journey
            </p>
          </div>
        </div>
      </div>

      {/* ═══ QUICK STATS ROW ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={<Flame className="w-4 h-4" />}
          iconBg="from-orange-400 to-red-500"
          label="Current Streak"
          value={`${currentStreak} day${currentStreak !== 1 ? "s" : ""}`}
        />
        <StatCard
          icon={<CalendarDays className="w-4 h-4" />}
          iconBg="from-blue-400 to-indigo-500"
          label="Total Sessions"
          value={totalSessions.toString()}
        />
        <StatCard
          icon={<PenTool className="w-4 h-4" />}
          iconBg="from-emerald-400 to-teal-500"
          label="Writing Tests"
          value={(writingSessions?.sessions?.length || 0).toString()}
        />
        <StatCard
          icon={<Headphones className="w-4 h-4" />}
          iconBg="from-violet-400 to-purple-500"
          label="Listening Tests"
          value={(listeningSessions?.sessions?.length || 0).toString()}
        />
      </div>

      {/* ═══ ACTIVITY CHART ═══ */}
      <div className="mb-10 rounded-2xl border border-border/60 bg-white/80 dark:bg-white/[0.04] overflow-hidden shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 sm:px-8 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Daily Activity</h3>
              <p className="text-xs text-muted-foreground">Practice sessions per day</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-muted-foreground">Live</span>
          </div>
        </div>
        <div className="h-[420px]">
          <DailyProgressChart data={dailyData} days={viewDays} onDaysChange={setViewDays} />
        </div>
      </div>

      {/* ═══ READING SKILLS ═══ */}
      <div className="mb-10">
        <ReadingProgressTracker />
      </div>

      {/* ═══ SESSION ARCHIVES ═══ */}
      <div className="rounded-2xl border border-border/60 bg-white/80 dark:bg-white/[0.04] overflow-hidden backdrop-blur-sm">
        <div className="px-6 sm:px-8 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Session History</h3>
              <p className="text-xs text-muted-foreground">Recent practice results</p>
            </div>
          </div>

          <Tabs defaultValue="writing" className="w-full">
            <TabsList className="bg-slate-100 dark:bg-white/[0.06] rounded-xl p-1 h-auto w-auto inline-flex gap-1">
              {[
                { value: "writing", label: "Writing", icon: <PenTool className="w-3.5 h-3.5" /> },
                { value: "reading", label: "Reading", icon: <BookOpen className="w-3.5 h-3.5" /> },
                { value: "listening", label: "Listening", icon: <Headphones className="w-3.5 h-3.5" /> },
                { value: "speaking", label: "Speaking", icon: <Mic className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-muted-foreground
                    data-[state=active]:bg-background data-[state=active]:text-foreground
                    data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/60
                    transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-4 min-h-[300px]">
              <TabsContent value="writing" className="m-0 focus-visible:outline-none">
                <SessionList
                  data={writingSessions?.sessions}
                  emptyMsg="No writing sessions yet"
                  emptyHint="Submit a Task 1 or Task 2 essay to see your results here."
                  renderRow={(session: any) => (
                    <SessionRow
                      key={session.id}
                      label={`Task ${session.taskType} Essay`}
                      date={session.createdAt}
                      score={session.bandScore || "—"}
                      scoreLabel="Band"
                      accentColor="from-cyan-400 to-blue-500"
                      onClick={() => navigate(`/writing/feedback/${session.id}`)}
                    />
                  )}
                />
              </TabsContent>

              <TabsContent value="reading" className="m-0 focus-visible:outline-none">
                <SessionList
                  data={readingSessions?.sessions}
                  emptyMsg="No reading sessions yet"
                  emptyHint="Complete a reading practice to see your results here."
                  renderRow={(session: any) => (
                    <SessionRow
                      key={session.id}
                      label={session.passageTitle || "Reading Practice"}
                      date={session.createdAt}
                      score={`${session.score}/${session.totalQuestions}`}
                      scoreLabel="Score"
                      accentColor="from-emerald-400 to-teal-500"
                      onClick={() => navigate(`/reading/feedback/${session.id}`)}
                    />
                  )}
                />
              </TabsContent>

              <TabsContent value="listening" className="m-0 focus-visible:outline-none">
                <SessionList
                  data={listeningSessions?.sessions}
                  emptyMsg="No listening sessions yet"
                  emptyHint="Complete a listening practice to see your results here."
                  renderRow={(session: any) => (
                    <SessionRow
                      key={session.id}
                      label={session.testTitle || "Listening Test"}
                      date={session.createdAt}
                      score={`${session.score}/${session.totalQuestions}`}
                      scoreLabel={`Band ${session.bandScore}`}
                      accentColor="from-violet-400 to-purple-500"
                    />
                  )}
                />
              </TabsContent>

              <TabsContent value="speaking" className="m-0 focus-visible:outline-none">
                <SessionList
                  data={speakingSessions?.sessions}
                  emptyMsg="No speaking sessions yet"
                  emptyHint="Complete a speaking practice to see your results here."
                  renderRow={(session: any) => (
                    <SessionRow
                      key={session.id}
                      label={session.topic || "Speaking Practice"}
                      date={session.createdAt}
                      score={session.bandScore || "—"}
                      scoreLabel="Band"
                      accentColor="from-orange-400 to-red-500"
                    />
                  )}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// ─── STAT CARD ─────────────────────────────────────────────────────
function StatCard({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white/80 dark:bg-white/[0.04] p-4 sm:p-5 flex flex-col gap-3 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20 transition-shadow duration-300 backdrop-blur-sm">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${iconBg} flex items-center justify-center text-white shadow-sm`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
        <p className="text-xl font-bold text-foreground tabular-nums tracking-tight">{value}</p>
      </div>
    </div>
  );
}

// ─── SESSION ROW ───────────────────────────────────────────────────
function SessionRow({
  label,
  date,
  score,
  scoreLabel,
  accentColor,
  onClick,
}: {
  label: string;
  date: string;
  score: string | number;
  scoreLabel: string;
  accentColor: string;
  onClick?: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between py-4 group cursor-pointer hover:bg-muted/30 transition-colors rounded-xl px-4 -mx-2"
      onClick={onClick}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className={`w-2 h-10 rounded-full bg-gradient-to-b ${accentColor} opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0`} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {label}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {new Date(date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right">
          <p className="text-base font-bold text-foreground tabular-nums">{score}</p>
          <p className="text-[10px] text-muted-foreground font-medium">{scoreLabel}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-blue-500 transition-all transform group-hover:translate-x-0.5" />
      </div>
    </div>
  );
}

// ─── SESSION LIST ──────────────────────────────────────────────────
function SessionList({
  data,
  emptyMsg = "No sessions found",
  emptyHint = "Complete a practice to see results here.",
  renderRow,
}: {
  data: any;
  emptyMsg?: string;
  emptyHint?: string;
  renderRow: (session: any) => React.ReactNode;
}) {
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-slate-400 dark:text-slate-500" />
        </div>
        <p className="text-sm font-semibold text-foreground mb-1">{emptyMsg}</p>
        <p className="text-xs text-muted-foreground max-w-xs">{emptyHint}</p>
      </div>
    );
  }
  return (
    <div className="divide-y divide-border/30">
      {data.slice(0, 8).map(renderRow)}
    </div>
  );
}
