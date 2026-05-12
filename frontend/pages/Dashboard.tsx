import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Target, Clock, TrendingUp, BookOpen, Mic, PenTool, Headphones, Star, Award, CheckCircle, Plus, Wand2, ArrowRight, ChevronLeft, ChevronRight, X, Info, Eye, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import backend from "@/backend";
import * as progressApi from "@/api/progress";
import AddTaskModal from "@/components/progress/AddTaskModal";
import AISuggestDrawer from "@/components/progress/AISuggestDrawer";
import TaskCard from "@/components/progress/TaskCard";
import GlowingProgressCard from "@/components/progress/GlowingProgressCard";
import ReadingPracticeCard from "@/components/ReadingPracticeCard";
import SpeakingPracticeCard from "@/components/SpeakingPracticeCard";
import WritingPracticeCard from "@/components/WritingPracticeCard";
import ListeningPracticeCard from "@/components/ListeningPracticeCard";
import { PreviewSignupModal } from "@/components/PreviewSignupModal";

const MOCK_USER = { id: "preview", email: "student@newband.ai", name: "Student", plan: "free" } as any;

export default function Dashboard({ isPreview = false }: { isPreview?: boolean }) {
  const { user: authUser } = useUser();
  const user = isPreview ? MOCK_USER : authUser;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [showPaymentNotice, setShowPaymentNotice] = useState(!isPreview);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [range] = useState<"daily">("daily");
  const dueISO = new Date().toISOString();

  // For preview mode, we intercept specific actions, but allow navigating to preview sub-pages.
  const previewNav = (path: string) => {
    if (isPreview) {
      const allowedPreviewPaths = [
        '/reading', '/listening', '/writing', '/speaking',
        '/writing/task-1', '/writing/task-2', '/vocabulary',
        '/reading/theory', '/reading/tutor-chat'
      ];
      const cleanPath = path.split('?')[0].split('#')[0];
      if (allowedPreviewPaths.includes(cleanPath)) {
        navigate(`/preview${cleanPath}`);
      } else {
        setShowSignupModal(true);
      }
    } else {
      navigate(path);
    }
  };

  const { data: progress } = useQuery({
    queryKey: ["progress", user?.id],
    queryFn: () => user ? backend.ielts.getProgress(user.id) : null,
    enabled: !!user && !isPreview,
  });

  const { data: dailyGoal } = useQuery({
    queryKey: ["dailyGoal", user?.id],
    queryFn: () => user ? backend.ielts.getDailyGoal(user.id) : null,
    enabled: !!user && !isPreview,
  });

  // Dashboard tasks (compact list)
  const { data: dashTasksRes } = useQuery({
    queryKey: ["glow-tasks", user?.id, range],
    queryFn: () => user ? progressApi.listTasks(user.id, range, "all") : Promise.resolve({ tasks: [] }),
    enabled: !!user && !isPreview,
  });
  const dashTasks = dashTasksRes?.tasks ?? [];

  const createTask = useMutation({
    mutationFn: progressApi.createTask,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["glow-tasks"] });
    },
  });
  const updateTask = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof progressApi.updateTask>[1] }) => progressApi.updateTask(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["glow-tasks"] });
    },
  });
  const acceptPlan = useMutation({
    mutationFn: progressApi.acceptSuggestions,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["glow-tasks"] });
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  if (!user && !isPreview) {
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

  const totalTasks = dashTasks.length;
  const doneTasks = dashTasks.filter((t: any) => t.status === "completed").length;
  const progressPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

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
  const isFreeTier = !user?.plan || user.plan === 'free' || user.plan === 'basic';

  return (
    <>
      {isPreview && <PreviewSignupModal open={showSignupModal} onClose={() => setShowSignupModal(false)} />}
      {isPreview && (
        <div className="sticky top-16 z-30 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2.5 px-4 flex items-center justify-center gap-3 text-sm font-medium shadow-lg">
          <Eye className="w-4 h-4 shrink-0 opacity-80" />
          <span>You're viewing a preview</span>
          <span className="hidden sm:inline opacity-60">·</span>
          <button onClick={() => navigate("/register")} className="font-bold underline underline-offset-2 hover:opacity-80 transition-opacity">
            Create a free account to start practicing
          </button>
        </div>
      )}
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 mt-6">
        <div className="space-y-6 pb-32">
          
          {showPaymentNotice && (
            <div className="relative rounded-2xl bg-gradient-to-r from-slate-100 via-white to-amber-50 dark:from-slate-700 dark:via-slate-600 dark:to-amber-700/80 border border-slate-300 dark:border-amber-400/50 p-4 sm:p-5 flex items-start gap-4 shadow-md animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="p-2 rounded-full bg-gradient-to-br from-slate-200 to-amber-200 dark:from-slate-400 dark:to-amber-500 text-amber-700 dark:text-white mt-0.5 shrink-0 shadow-sm border border-white/50 dark:border-amber-300/50">
                <Info className="h-5 w-5" />
              </div>
              <div className="flex-1 pr-6">
                <h3 className="text-[15px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-amber-700 dark:from-white dark:to-amber-200">Payment integration coming soon!</h3>
                <p className="text-[14px] text-slate-700 dark:text-slate-100 mt-1 leading-relaxed">
                  We're currently finalizing our payment gateway. All premium features, including the personalized roadmap and video podcasts, will be available for purchase very soon. Stay tuned!
                </p>
              </div>
              <button 
                onClick={() => setShowPaymentNotice(false)} 
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-200 hover:bg-amber-100/50 dark:hover:bg-amber-400/30 transition-colors"
                aria-label="Dismiss notice"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left Column: Featured Video & Progress */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-6">

              {/* Featured Video Section */}
              <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#151624] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl p-4 sm:p-5 transition-colors">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-red-100 dark:bg-red-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-100 dark:bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="relative flex flex-col items-start gap-4 sm:gap-6 w-full max-w-5xl mx-auto">
                  <div className="flex-1 space-y-4 w-full">

                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <div className="p-2 rounded-2xl bg-red-50 dark:bg-[#23141B] text-red-600 dark:text-red-500 border border-red-100 dark:border-white/5 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                      Masterclasses
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-xs sm:text-sm leading-relaxed max-w-2xl mt-1">
                      Begin your practice with these essential video lessons. Watch the insights before moving on to practical exercises to maximize your IELTS score.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end mb-[-10px] sm:mb-[-20px] z-30">
                    <button
                      onClick={() => scrollCarousel('left')}
                      className="p-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1D2B] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-sm hover:scale-110 active:scale-95"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => scrollCarousel('right')}
                      className="p-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1D2B] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-sm hover:scale-110 active:scale-95"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="w-full relative overflow-visible">
                    <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white dark:from-[#151624] to-transparent z-20 pointer-events-none -ml-5 sm:-ml-8 transition-colors"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white dark:from-[#151624] to-transparent z-20 pointer-events-none -mr-5 sm:-mr-8 transition-colors"></div>
                    <div ref={scrollRef} className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 pt-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-[20%]">
                      {[ 
                        { id: 'benefits-of-doing-nothing', yt: 'Y681hXWwhQY?si=FdjQAajOcGjPlTu4', title: 'The benefits of doing nothing', category: 'Listening Practice • 6 mins' },
                        { id: 'inflation-explained', yt: 'FKwmUNffu7M?si=vsIdP35yfvOW9ChB', title: '6 Minute English: Inflation', category: 'Listening Practice • 14 mins' },
                        { id: 'following-your-dreams', yt: '26PrgjTboVQ?si=6dCJb1_0crdo8zu1', title: 'Are you following your dreams?', category: 'Listening Practice • 13 mins' },
                        { id: 'social-media-health', yt: 'g8q-Nq-ajx8?si=Q_cngTG6MqqkJrZr', title: 'Social media and teenage health', category: 'Listening Practice • 6 mins' },
                        { id: 'fast-fashion', yt: '3-icphihD6Y?si=vUbZtotp6FSyG26I', title: 'Could you give up fast fashion?', category: 'Listening Practice • 6 mins' },
                        { id: 'cities-future', yt: '3kS0cMziUJY?si=JvBm9-qF9eBPcxId', title: 'Cities of the future', category: 'Listening Practice • 6 mins' },
                        { id: 'university-worth', yt: '_O48-ao5_40?si=6Y4ak03zak_e5KLj', title: 'Is it still worth going to university?', category: 'Economics • 7 mins' },
                        { id: 'future-work', yt: 's1HxJVusR2w?si=f-2lEo4fhOnFfULz', title: 'What is the future of work?', category: 'Workplace • 6 mins' }
                      ].map((vid, index) => {
                        const isLocked = (!user?.plan || user.plan === 'free') && index >= 2;
                        const content = (
                          <>
                            <div className={`aspect-[16/10] flex items-center justify-center w-full rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-white/10 shadow-md dark:shadow-lg bg-slate-50 dark:bg-[#0c0e14] relative z-10 transition-transform duration-500 ${!isLocked && 'group-hover:scale-[1.02]'}`}>
                              <iframe className="w-full aspect-video pointer-events-none" src={`https://www.youtube.com/embed/${vid.yt}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin" allowFullScreen></iframe>
                              {isLocked && (
                                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                                  <div className="bg-slate-900/80 px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 text-white/90 shadow-lg backdrop-blur-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                    <span className="text-xs font-bold tracking-wide uppercase">Pro</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <h3 className={`font-bold mt-3 text-sm line-clamp-2 leading-tight transition-colors ${isLocked ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400'}`}>{vid.title}</h3>
                            <p className={`text-xs mt-1 ${isLocked ? 'text-slate-400/50 dark:text-slate-500/50' : 'text-slate-500 dark:text-slate-400'}`}>{vid.category}</p>
                          </>
                        );

                        if (isLocked) {
                          return (
                            <div key={vid.id} onClick={() => previewNav('/subscription')} className="shrink-0 w-[200px] sm:w-[240px] snap-start group cursor-pointer grayscale opacity-75 hover:opacity-100 transition-opacity">
                              {content}
                            </div>
                          );
                        }

                        return isPreview ? (
                          <div key={vid.id} onClick={() => setShowSignupModal(true)} className="shrink-0 w-[200px] sm:w-[240px] snap-start group cursor-pointer">
                            {content}
                          </div>
                        ) : (
                          <Link key={vid.id} to={`/video-lesson/${vid.id}`} className="shrink-0 w-[200px] sm:w-[240px] snap-start group cursor-pointer">
                            {content}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Glowing Progress Tracker */}
              <GlowingProgressCard
                title="Project Progress"
                percent={progressPercentage}
                onAiSuggest={() => setAiOpen(true)}
              />

            </div>

            {/* Right Column: Practice Areas */}
            <div className="lg:col-span-6 xl:col-span-5 space-y-4">


              <div className="grid grid-cols-2 gap-3 xl:gap-4">
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


                  if (isReadingPractice) {
                    return (
                      <div key={area.title} className="h-full">
                        <ReadingPracticeCard onNavigate={previewNav} />
                      </div>
                    );
                  }

                  if (area.title === "Speaking Practice") {
                    return (
                      <div key={area.title} className="h-full">
                        <SpeakingPracticeCard />
                      </div>
                    );
                  }

                  if (area.title === "Writing Tasks") {
                    return (
                      <div key={area.title} className="h-full">
                        <WritingPracticeCard onNavigate={previewNav} />
                      </div>
                    );
                  }

                  if (area.title === "Listening Practice") {
                    return (
                      <div key={area.title} className="h-full">
                        <ListeningPracticeCard onNavigate={previewNav} />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={area.title}
                      className={`group relative flex flex-col rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl ${theme.border} ${theme.glow}`}
                    >
                      {/* Hover Gradient Effect */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${theme.gradient} via-transparent to-transparent rounded-2xl pointer-events-none`} />

                      {/* Header */}
                      <div className="relative z-10 flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${theme.bg} ${theme.text} ring-1 ring-inset ring-black/5 dark:ring-white/5 transition-transform group-hover:scale-110 duration-300`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Module 0{index + 1}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 flex-1">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-slate-700 dark:group-hover:text-white/90 transition-colors">
                          {area.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                          {area.description}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="relative z-10 mt-auto space-y-2">
                        {isReadingPractice ? (
                          <>
                            <Button
                              onClick={() => previewNav(area.href)}
                              className={`w-full ${theme.btn} text-white border-0 shadow-lg shadow-black/5 dark:shadow-black/20 text-xs font-medium h-9`}
                            >
                              Start Practice
                            </Button>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); previewNav('/reading/theory'); }}
                                className="border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-[10px] h-7"
                              >
                                Basics
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); previewNav('/reading/tutor-chat'); }}
                                className="border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-[10px] h-7"
                              >
                                AI Tutor
                              </Button>
                            </div>
                          </>
                        ) : (
                          <Button
                            onClick={() => previewNav(area.href)}
                            className={`w-full ${theme.btn} text-white border-0 shadow-lg shadow-black/5 dark:shadow-black/20 text-xs font-medium group-hover:brightness-110 transition-all h-9`}
                          >
                            Start Practice <span className="ml-1 opacity-70 transition-transform group-hover:translate-x-1">→</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                {/* Personalized Plan Button */}
                <Button
                  onClick={() => isFreeTier ? previewNav('/subscription') : previewNav('/plan')}
                  className={`w-full h-14 rounded-2xl border-0 font-bold text-base shadow-xl transition-all ${isFreeTier ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 grayscale opacity-75 hover:opacity-100' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]'}`}
                >
                  {isFreeTier ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  ) : (
                    <Calendar className="h-5 w-5 mr-3" />
                  )}
                  My Personalized Plan
                  <div className={`px-2 py-0.5 ml-3 rounded text-[10px] uppercase tracking-wider ${isFreeTier ? 'bg-slate-400/20 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'bg-white/20 text-white'}`}>{isFreeTier ? 'Pro' : 'New'}</div>
                  <ArrowRight className="h-5 w-5 ml-auto opacity-80" />
                </Button>

                {/* Progress Roadmap Button */}
                <Button
                  onClick={() => previewNav('/progress')}
                  className="w-full h-12 rounded-2xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-white dark:text-slate-300 border-0 font-bold text-sm shadow-lg shadow-slate-900/10 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics & Progress
                  <ArrowRight className="h-4 w-4 ml-2 opacity-60" />
                </Button>
              </div>

            </div>

          </div>

          {/* Vocabulary Builder */}
          <div className="relative group">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
                  <BookOpen className="h-6 w-6" />
                </span>
                <span>Vocabulary Builder</span>
              </h2>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#151624] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl transition-all duration-500 hover:shadow-sky-500/10">
              {/* Animated Background Blobs */}
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-sky-500/10 dark:bg-sky-600/10 rounded-full blur-[100px] group-hover:bg-sky-500/20 dark:group-hover:bg-sky-600/20 transition-all duration-700"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[80px]"></div>

              <div className="relative p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="flex-1 space-y-8 text-center lg:text-left">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-white/5 backdrop-blur-md border border-sky-200 dark:border-white/10 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-widest shadow-sm ring-1 ring-sky-500/20">
                      <Star className="h-3 w-3 fill-current animate-pulse" />
                      Premium Feature
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                      Vocabulary <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500 dark:from-sky-400 dark:to-blue-400">Builder</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-medium">
                      Master high-frequency IELTS words with our scientifically proven spaced repetition system.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 auto-rows-fr">
                    <div className="flex flex-col items-center lg:items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                      <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400">
                        <Target className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Context Learning</span>
                    </div>
                    <div className="flex flex-col items-center lg:items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                        <Clock className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Spaced Repetition</span>
                    </div>
                    <div className="flex flex-col items-center lg:items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                      <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400">
                        <Award className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Smart Tracking</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => isPreview ? navigate("/preview/vocabulary") : navigate("/vocabulary")}
                    size="lg"
                    className="shimmer-btn h-16 px-10 text-lg font-black rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white shadow-xl shadow-sky-500/20 hover:shadow-sky-500/40 hover:-translate-y-1 transition-all duration-300 border-0"
                  >
                    Start Learning Now <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Visual Element: Premium Card Stack */}
                <div className="relative w-full lg:w-80 h-80 perspective-container">
                  <div className="card-stack">
                    {/* Decorative Back Cards */}
                    <div className="card-stack-item card-stack-item-1 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-neutral-800"></div>
                    <div className="card-stack-item card-stack-item-2 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-neutral-800 cursor-pointer"></div>

                    {/* Main Card */}
                    <div className="card-stack-item card-stack-item-3 overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-neutral-800 dark:to-neutral-900 border border-slate-200 dark:border-white/20 shadow-xl dark:shadow-2xl flex flex-col items-center justify-center group/card cursor-pointer">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZmlsdGVyIGlkPSJ4Ij48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCN4KSIgb3BhY2l0eT0iMC40Ii8+PC9zdmc+')] opacity-[0.05] dark:opacity-20 pointer-events-none"></div>
                      <div className="relative z-10 text-center space-y-4 p-8">
                        <div className="inline-block p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-2 transition-transform group-hover/card:scale-110 duration-500">
                          <BookOpen className="h-12 w-12 text-sky-500 dark:text-sky-400" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">Word of the Day</h4>
                          <p className="text-sky-500 dark:text-sky-400 font-bold text-sm tracking-widest uppercase">Click to reveal</p>
                        </div>
                      </div>

                      {/* Floating Premium Badges */}
                      <div className="absolute top-6 right-6 px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 backdrop-blur-lg rounded-full border border-emerald-200 dark:border-emerald-500/30 text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shadow-md dark:shadow-lg animate-bounce">
                        <CheckCircle className="h-3 w-3" /> LEARNED
                      </div>
                      <div className="absolute bottom-6 left-6 px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 backdrop-blur-lg rounded-full border border-indigo-200 dark:border-indigo-500/30 text-[10px] font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1 shadow-md dark:shadow-lg animate-bounce delay-700">
                        <TrendingUp className="h-3 w-3" /> +15 XP
                      </div>
                    </div>
                  </div>

                  {/* Ambient Glow */}
                  <div className="absolute inset-0 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-[60px] -z-10 group-hover:bg-sky-500/10 dark:group-hover:bg-sky-500/20 transition-all duration-700"></div>
                </div>
              </div>
            </div>
          </div>


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
            dueAt: d.dueAt ? new Date(new Date(d.dueAt).setHours(0, 0, 0, 0)).toISOString() : new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
          });
          setAddOpen(false);
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
