import { useQuery } from "@tanstack/react-query";
import { Calendar, Target, Clock, TrendingUp, BookOpen, Mic, PenTool, Headphones } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import backend from "~backend/client";

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

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

  if (!user) {
    return (
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

  const progressPercentage = dailyGoal 
    ? Math.round((dailyGoal.completedMinutes / dailyGoal.targetMinutes) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Good morning, {user.name}! 👋
        </h1>
        <p className="text-sky-100">
          Ready to continue your IELTS preparation journey?
        </p>
      </div>

      {/* Daily Goal Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-sky-600" />
            Today's Study Goal
          </CardTitle>
          <CardDescription>
            Track your daily progress towards your target band score of {user.targetBand}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Study Time</span>
                <span>{dailyGoal?.completedMinutes || 0} / {dailyGoal?.targetMinutes || 30} minutes</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{dailyGoal?.completedMinutes || 0} min completed</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span>{progress?.studyStreak || 0} day streak</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Areas */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Practice Areas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {practiceAreas.map((area) => {
            const Icon = area.icon;
            return (
              <Card key={area.title} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6" onClick={() => navigate(area.href)}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${area.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {area.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {area.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Weekly Activity
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {progress?.weeklyActivity || 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-sky-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Study Streak
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {progress?.studyStreak || 0} days
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Practice Time
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {progress?.totalPracticeTime || 0}m
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Daily Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            Practice speaking for at least 15 minutes daily. Record yourself and listen back to identify areas for improvement in pronunciation and fluency.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
