import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Target, Calendar, Clock, Award, BookOpen, Mic, PenTool, Headphones } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "../contexts/UserContext";
import backend from "~backend/client";

export default function Progress() {
  const { user } = useUser();

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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-300">Please set up your profile to view progress.</p>
      </div>
    );
  }

  const skillIcons = {
    speaking: Mic,
    writing: PenTool,
    reading: BookOpen,
    listening: Headphones,
  };

  const getSkillProgress = (skill: string) => {
    return progress?.overall.find(p => p.skill === skill);
  };

  const calculateOverallBand = () => {
    if (!progress?.overall.length) return 0;
    
    const validBands = progress.overall
      .filter(p => p.estimatedBand)
      .map(p => p.estimatedBand!);
    
    if (validBands.length === 0) return 0;
    
    return Math.round((validBands.reduce((sum, band) => sum + band, 0) / validBands.length) * 10) / 10;
  };

  const overallBand = calculateOverallBand();
  const targetBand = user.targetBand;
  const progressToTarget = targetBand > 0 ? Math.min((overallBand / targetBand) * 100, 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Progress & Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your IELTS preparation progress and identify areas for improvement.
        </p>
      </div>

      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Current Band
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {overallBand || "N/A"}
                </p>
              </div>
              <Target className="h-8 w-8 text-sky-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Target Band
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {targetBand}
                </p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
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

      {/* Progress to Target */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-sky-600" />
            Progress to Target Band
          </CardTitle>
          <CardDescription>
            Your journey towards achieving band {targetBand}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(progressToTarget)}%</span>
              </div>
              <ProgressBar value={progressToTarget} className="h-3" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {overallBand >= targetBand 
                ? "🎉 Congratulations! You've reached your target band score!"
                : `You need ${(targetBand - overallBand).toFixed(1)} more points to reach your target.`
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Skills Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Breakdown</CardTitle>
          <CardDescription>
            Your performance across all four IELTS skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(skillIcons).map(([skill, Icon]) => {
              const skillData = getSkillProgress(skill);
              return (
                <div key={skill} className="text-center p-4 border rounded-lg">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <h3 className="font-semibold capitalize mb-1">{skill}</h3>
                  <p className="text-2xl font-bold text-sky-600">
                    {skillData?.estimatedBand || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {skillData?.practiceCount || 0} sessions
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Progress Tabs */}
      <Tabs defaultValue="speaking" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="speaking">Speaking</TabsTrigger>
          <TabsTrigger value="writing">Writing</TabsTrigger>
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="listening">Listening</TabsTrigger>
        </TabsList>

        <TabsContent value="speaking">
          <Card>
            <CardHeader>
              <CardTitle>Speaking Practice History</CardTitle>
              <CardDescription>
                Your recent speaking practice sessions and feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              {speakingSessions?.sessions.length ? (
                <div className="space-y-4">
                  {speakingSessions.sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Part {session.part}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">
                          Band {session.bandScore || "N/A"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-center py-8">
                  No speaking sessions yet. Start practicing to see your progress!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="writing">
          <Card>
            <CardHeader>
              <CardTitle>Writing Practice History</CardTitle>
              <CardDescription>
                Your recent writing submissions and scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {writingSessions?.sessions.length ? (
                <div className="space-y-4">
                  {writingSessions.sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Task {session.taskType}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">
                          Band {session.bandScore || "N/A"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-center py-8">
                  No writing sessions yet. Start practicing to see your progress!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reading">
          <Card>
            <CardHeader>
              <CardTitle>Reading Practice History</CardTitle>
              <CardDescription>
                Your recent reading comprehension scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {readingSessions?.sessions.length ? (
                <div className="space-y-4">
                  {readingSessions.sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{session.passageTitle}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">
                          {session.score}/{session.totalQuestions}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-center py-8">
                  No reading sessions yet. Start practicing to see your progress!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listening">
          <Card>
            <CardHeader>
              <CardTitle>Listening Practice History</CardTitle>
              <CardDescription>
                Your recent listening comprehension scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {listeningSessions?.sessions.length ? (
                <div className="space-y-4">
                  {listeningSessions.sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{session.audioTitle}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">
                          {session.score}/{session.totalQuestions}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-center py-8">
                  No listening sessions yet. Start practicing to see your progress!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Vocabulary Progress */}
      {vocabularyProgress && (
        <Card>
          <CardHeader>
            <CardTitle>Vocabulary Progress</CardTitle>
            <CardDescription>
              Your vocabulary learning statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {vocabularyProgress.totalWords}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Words</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {vocabularyProgress.knownWords}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Known</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {vocabularyProgress.learningWords}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Learning</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {vocabularyProgress.reviewWords}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
