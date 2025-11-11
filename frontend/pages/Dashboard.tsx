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

  const progressPercentage = 100;

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
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl p-8 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-3">
                Good {timeOfDay}, {user.name}! 👋
              </h1>
              <p className="text-sky-100 text-lg mb-2">
                Ready to continue your IELTS preparation journey?
              </p>
              <p className="text-sky-200 font-medium">
                {dailyMessage}
              </p>
            </div>
            {progress?.studyStreak && progress.studyStreak > 0 && (
              <div className="text-center bg-white/20 rounded-lg p-3">
                <div className="text-2xl">🔥</div>
                <div className="text-sm font-bold">{progress.studyStreak} days</div>
                <div className="text-xs text-sky-200">streak</div>
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

        {/* Removed Study Tasks block as per new design */}

        {/* Practice Areas */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            📚 <span>Practice Areas</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practiceAreas.map((area, index) => {
              const Icon = area.icon;
              const bgGradients = [
                "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20",
                "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
                "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
                "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20"
              ];
              const isReadingPractice = area.title === "Reading Practice";
              
              return (
                <Card key={area.title} className={`hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-gray-200 ${bgGradients[index]}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl ${area.color} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {area.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
                      {area.description}
                    </p>
                    
                    {/* Special handling for Reading Practice - two buttons */}
                    {isReadingPractice ? (
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => navigate(area.href)}
                          className={`flex-1 font-semibold py-2 px-3 text-sm ${area.color} hover:opacity-90 transition-opacity`} 
                          size="default"
                        >
                          Start Practice →
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/reading/theory');
                          }}
                          variant="outline"
                          className="flex-1 font-semibold py-2 px-3 text-sm border-2 border-green-500 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30"
                          size="default"
                        >
                          Learn Basics →
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => navigate(area.href)}
                        className={`w-full font-semibold py-2 px-4 ${area.color} hover:opacity-90 transition-opacity`} 
                        size="default"
                      >
                        Start Practice →
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
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
    </>
  );
}
