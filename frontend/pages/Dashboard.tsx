import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Calendar, Target, Clock, TrendingUp, BookOpen, Mic, PenTool, Headphones, Star, Award, CheckCircle, Plus, Wand2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import backend from "~backend/client";
import * as progressApi from "@/api/progress";
import AddTaskModal from "@/components/progress/AddTaskModal";
import AISuggestDrawer from "@/components/progress/AISuggestDrawer";
import TaskCard from "@/components/progress/TaskCard";
import GlowingProgressCard from "@/components/progress/GlowingProgressCard";

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [range] = useState<"daily">("daily");
  const dueISO = new Date().toISOString().slice(0, 16);

  const { data: progress } = useQuery({
    queryKey: ["progress", user?.id],
    queryFn: () => user ? backend.ielts.getProgress({ userId: user.id }) : null,
    enabled: !!user,
  });

  const { data: dailyGoal } = useQuery({
    queryKey: ["dailyGoal", user?.id],
    queryFn: () => user ? backend.ielts.getDailyGoal({ userId: user.id }) : null,
    enabled: !!user,
  });

  // Dashboard tasks (compact list)
  const { data: dashTasks } = useQuery({
    queryKey: ["dashboard-tasks", user?.id, range],
    queryFn: () => user ? progressApi.listTasks(user.id, "daily", "all") : Promise.resolve({ tasks: [] }),
    enabled: !!user,
  });

  const createTask = useMutation({
    mutationFn: progressApi.createTask,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard-tasks"] });
    },
  });
  const updateTask = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof progressApi.updateTask>[1] }) => progressApi.updateTask(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard-tasks"] });
    },
  });
  const acceptPlan = useMutation({
    mutationFn: progressApi.acceptSuggestions,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard-tasks"] });
    },
  });

  if (!user) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to IELTS AI
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please set up your profile to get started with personalized IELTS preparation.
            </p>
            <Button onClick={() => navigate("/settings")}>
              Set Up Profile
            </Button>
          </div>
        </div>
      </>
    );
  }

  const practiceAreas = [
    {
      title: "Speaking Practice",
      description: "Practice with AI-powered speaking exercises",
      icon: Mic,
      href: "/speaking",
      color: "bg-red-500",
    },
    {
      title: "Writing Tasks",
      description: "Improve your writing with instant feedback",
      icon: PenTool,
      href: "/writing",
      color: "bg-blue-500",
    },
    {
      title: "Reading Practice",
      description: "Enhance comprehension with practice passages",
      icon: BookOpen,
      href: "/reading",
      color: "bg-green-500",
    },
    {
      title: "Listening Practice",
      description: "Sharpen your listening skills",
      icon: Headphones,
      href: "/listening",
      color: "bg-purple-500",
    },
  ];

  const progressPercentage = 0;

  const currentHour = new Date().getHours();
  const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 18 ? 'afternoon' : 'evening';

  const motivationalMessages = [
    "You're getting closer to Band 7! 🎯",
    "Consistency is key to IELTS success! 💪",
    "Every minute of practice counts! ⭐",
    "Your progress is impressive! 🚀",
    "Keep up the excellent work! 🌟"
  ];

  const dailyMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <>
      <div className="space-y-6 pb-32">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 p-8 sm:p-10 text-white shadow-2xl isolate">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none"></div>

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-blue-50 backdrop-blur-sm mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                IELTS Prep Dashboard
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                Good {timeOfDay}, {user.name}! <span className="inline-block hover:animate-spin origin-bottom-right cursor-default">👋</span>
              </h1>
              <p className="text-lg text-blue-100 leading-relaxed font-medium">
                Ready to continue your journey to Band 7+?
              </p>
              <div className="pt-2 flex items-center gap-2 text-blue-200 text-sm italic">
                <div className="h-px w-8 bg-blue-400/50"></div>
                "{dailyMessage}"
              </div>
            </div>

            {/* Streak Card */}
            {progress?.studyStreak !== undefined && progress.studyStreak > 0 && (
              <div className="group relative flex flex-col items-center justify-center p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl pointer-events-none"></div>
                <div className="text-4xl mb-1 drop-shadow-lg filter">🔥</div>
                <div className="text-2xl font-bold text-white tracking-tight">{progress.studyStreak} <span className="text-base font-medium text-blue-200">days</span></div>
                <div className="text-xs font-semibold text-blue-100 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full mt-1">
                  Current Streak
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New: Glowing Progress Tracker */}
        <GlowingProgressCard
          title="Project Progress"
          percent={progressPercentage}
          onAiSuggest={() => setAiOpen(true)}
        />

        {/* Practice Areas */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            📚 <span>Practice Areas</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practiceAreas.map((area, index) => {
              const Icon = area.icon;
              const isReadingPractice = area.title === "Reading Practice";

              // Theme mapping for specific colors
              const colorStyles: Record<string, {
                border: string;
                bg: string;
                text: string;
                glow: string;
                btn: string;
                gradient: string;
              }> = {
                "bg-red-500": {
                  border: "group-hover:border-rose-200 dark:group-hover:border-rose-500/50",
                  bg: "bg-rose-50 dark:bg-rose-500/10",
                  text: "text-rose-600 dark:text-rose-400",
                  glow: "group-hover:shadow-rose-500/20",
                  btn: "bg-rose-600 hover:bg-rose-700 dark:hover:bg-rose-500",
                  gradient: "from-rose-500/10 dark:from-rose-500/20"
                },
                "bg-blue-500": {
                  border: "group-hover:border-blue-200 dark:group-hover:border-blue-500/50",
                  bg: "bg-blue-50 dark:bg-blue-500/10",
                  text: "text-blue-600 dark:text-blue-400",
                  glow: "group-hover:shadow-blue-500/20",
                  btn: "bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500",
                  gradient: "from-blue-500/10 dark:from-blue-500/20"
                },
                "bg-green-500": {
                  border: "group-hover:border-emerald-200 dark:group-hover:border-emerald-500/50",
                  bg: "bg-emerald-50 dark:bg-emerald-500/10",
                  text: "text-emerald-600 dark:text-emerald-400",
                  glow: "group-hover:shadow-emerald-500/20",
                  btn: "bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500",
                  gradient: "from-emerald-500/10 dark:from-emerald-500/20"
                },
                "bg-purple-500": {
                  border: "group-hover:border-violet-200 dark:group-hover:border-violet-500/50",
                  bg: "bg-violet-50 dark:bg-violet-500/10",
                  text: "text-violet-600 dark:text-violet-400",
                  glow: "group-hover:shadow-violet-500/20",
                  btn: "bg-violet-600 hover:bg-violet-700 dark:hover:bg-violet-500",
                  gradient: "from-violet-500/10 dark:from-violet-500/20"
                },
              };

              const theme = colorStyles[area.color] || colorStyles["bg-blue-500"];

              return (
                <div
                  key={area.title}
                  className={`group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl ${theme.border} ${theme.glow}`}
                >
                  {/* Hover Gradient Effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${theme.gradient} via-transparent to-transparent rounded-2xl pointer-events-none`} />

                  {/* Header */}
                  <div className="relative z-10 flex items-start justify-between mb-5">
                    <div className={`p-3.5 rounded-xl ${theme.bg} ${theme.text} ring-1 ring-inset ring-black/5 dark:ring-white/5 transition-transform group-hover:scale-110 duration-300`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Module 0{index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-slate-700 dark:group-hover:text-white/90 transition-colors">
                      {area.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                      {area.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="relative z-10 mt-auto space-y-3">
                    {isReadingPractice ? (
                      <>
                        <Button
                          onClick={() => navigate(area.href)}
                          className={`w-full ${theme.btn} text-white border-0 shadow-lg shadow-black/5 dark:shadow-black/20 font-medium`}
                        >
                          Start Practice
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); navigate('/reading/theory'); }}
                            className="border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs h-8"
                          >
                            Basics
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); navigate('/reading/tutor-chat'); }}
                            className="border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs h-8"
                          >
                            AI Tutor
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button
                        onClick={() => navigate(area.href)}
                        className={`w-full ${theme.btn} text-white border-0 shadow-lg shadow-black/5 dark:shadow-black/20 font-medium group-hover:brightness-110 transition-all`}
                      >
                        Start Practice <span className="ml-2 opacity-70 transition-transform group-hover:translate-x-1">→</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vocabulary Builder */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            📖 <span>Vocabulary Builder</span>
          </h2>
          <Card className="hover:shadow-lg hover:scale-102 transition-all duration-300 cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-orange-100">
            <CardContent className="p-8" onClick={() => navigate("/vocabulary")}>
              <div className="flex items-center gap-4 mb-5">
                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">
                    Vocabulary Builder
                  </h3>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Boost your word power</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                Expand your IELTS vocabulary with spaced repetition learning and smart review system
              </p>
              <Button className="w-full font-semibold py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white transition-all duration-300" size="lg">
                Start Learning →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            📊 <span>Your Progress</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 border-2 border-sky-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1">
                      📈 Weekly Activity
                    </p>
                    <p className="text-3xl font-bold text-sky-900 dark:text-sky-100">
                      {progress?.weeklyActivity || 0}%
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {(progress?.weeklyActivity ?? 0) >= 80 && <Award className="h-4 w-4 text-yellow-500" />}
                      <span className="text-xs text-sky-600 dark:text-sky-400">
                        {(progress?.weeklyActivity ?? 0) >= 80 ? 'Excellent!' : 'Keep going!'}
                      </span>
                    </div>
                  </div>
                  <TrendingUp className="h-10 w-10 text-sky-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-1">
                      🔥 Study Streak
                    </p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                      {progress?.studyStreak || 0} days
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {(progress?.studyStreak ?? 0) >= 7 && <Star className="h-4 w-4 text-yellow-500" />}
                      <span className="text-xs text-green-600 dark:text-green-400">
                        {(progress?.studyStreak ?? 0) >= 7 ? 'Amazing streak!' : 'Build momentum!'}
                      </span>
                    </div>
                  </div>
                  <Calendar className="h-10 w-10 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-2 border-purple-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-1">
                      ⏱️ Practice Time
                    </p>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                      {progress?.totalPracticeTime || 0}m
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {(progress?.totalPracticeTime ?? 0) >= 120 && <CheckCircle className="h-4 w-4 text-green-500" />}
                      <span className="text-xs text-purple-600 dark:text-purple-400">
                        {(progress?.totalPracticeTime ?? 0) >= 120 ? 'Great dedication!' : 'Every minute counts!'}
                      </span>
                    </div>
                  </div>
                  <Clock className="h-10 w-10 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Daily Tips */}
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-2 border-amber-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              💡 <span>Daily Coaching Tip</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              <strong>Pro Tip:</strong> Practice speaking for at least 15 minutes daily. Record yourself and listen back to identify areas for improvement in pronunciation and fluency. Consistency beats perfection! 🎯
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inline modals for dashboard */}
      <AddTaskModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={(d) => {
          if (!user) return;
          createTask.mutate({
            userId: user.id,
            name: d.name,
            category: d.category,
            difficulty: d.difficulty,
            estimatedMinutes: d.estimatedMinutes,
            dueAt: d.dueAt ?? dueISO,
          });
        }}
        defaultDueISO={dueISO}
      />
      <AISuggestDrawer
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        initialRange="daily"
        onGenerate={async ({ range, timeAvailableMinutes }) => {
          if (!user) return [];
          const res = await progressApi.generateSuggestions({ userId: user.id, range, timeAvailableMinutes });
          return res.suggestions;
        }}
        onAccept={async (suggestions) => {
          if (!user) return;
          await acceptPlan.mutateAsync({ userId: user.id, suggestions });
        }}
      />
    </>
  );
}
