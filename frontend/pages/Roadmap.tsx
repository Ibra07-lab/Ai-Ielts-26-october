import React, { useState } from 'react';
import { 
  CalendarDays, BarChart2, Home, CheckSquare, MoreHorizontal,
  Flame, Zap, BookOpen, PenTool, Headphones, ListFilter, PlayCircle, Trophy, Target, ArrowRight, X, Clock, AlertTriangle, Lightbulb, Map, FileText, CalendarCheck, FileQuestion, BookMarked, Layers, BarChart, FileSignature, Edit3, Speech, RotateCcw, Library, CheckCircle2, Lock, XCircle, RefreshCw, ChevronDown, ChevronUp, TrendingUp
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

type TabType = 'plan' | 'stats' | 'today' | 'tasks' | 'more';
type SkillType = 'reading' | 'writing' | 'vocabulary' | 'listening' | 'strategy';
type TaskStatus = 'done' | 'today' | 'locked' | 'missed';

interface DailyTask {
  id: string;
  type: SkillType;
  title: string;
  subtitle: string;
  duration: number;
  status: TaskStatus;
  score?: string | number;
  detailedScore?: { tr?: number; cc?: number; lr?: number; gra?: number };
  isRecovery?: boolean;
  contentId?: string;
}

interface DayPlan {
  date: string;
  tasks: DailyTask[];
  isToday?: boolean;
  hasRecoveryTask?: boolean;
}

interface WeekPlan {
  week_number: number;
  title: string;
  dateRange: string;
  status: 'done' | 'in_progress' | 'locked';
  progress?: number;
  totalTasks: number;
  completedTasks: number;
  days: DayPlan[];
  goal: string;
}

const MOCK_WEEKS: WeekPlan[] = [
  {
    week_number: 1,
    title: "Foundation",
    dateRange: "Mar 17-23",
    status: 'done',
    totalTasks: 7,
    completedTasks: 7,
    goal: "Establish core reading strategies and baseline writing assessment.",
    days: [
      { date: "MON Mar 17", tasks: [{ id: 'w1d1', type: 'reading', title: 'Diagnostic Test', subtitle: 'Full section 1', duration: 20, status: 'done', score: '6/10', contentId: '1' }] }
    ]
  },
  {
    week_number: 2,
    title: "Writing Focus",
    dateRange: "Mar 24-30",
    status: 'in_progress',
    progress: 75,
    totalTasks: 8,
    completedTasks: 6,
    goal: "Write 3 essays and improve your Task Response score to Band 6.0",
    days: [
      {
        date: "MON Mar 24",
        tasks: [{ id: 't1', type: 'reading', title: 'Reading Passage: Transport', subtitle: 'GT Format', duration: 20, status: 'done', score: '7/10' }]
      },
      {
        date: "TUE Mar 25",
        tasks: [{ id: 't2', type: 'writing', title: 'Writing Task 2', subtitle: '"Some people think..."', duration: 30, status: 'done', score: 'Band 5.5', detailedScore: { tr: 6, cc: 5, lr: 6, gra: 5 } }]
      },
      {
        date: "WED Mar 26",
        tasks: [
          { id: 't3', type: 'vocabulary', title: 'Vocabulary Set 3', subtitle: '40 words', duration: 15, status: 'done', score: '38/40' },
          { id: 't4', type: 'strategy', title: 'Strategy Lesson', subtitle: '"How Writing Task 2 is scored"', duration: 10, status: 'done', score: 'Read' }
        ]
      },
      {
        date: "THU Mar 27",
        tasks: [{ id: 't5', type: 'writing', title: 'Writing Task 1 — Letter', subtitle: '"Write a letter to your landlord..."', duration: 25, status: 'done', score: 'Band 6.0' }]
      },
      {
        date: "FRI Mar 28",
        tasks: [{ id: 't6', type: 'reading', title: 'Reading: Section 2 (Work)', subtitle: '"Workplace Safety Notice"', duration: 20, status: 'missed' }]
      },
      {
        date: "SAT Mar 29",
        isToday: true,
        hasRecoveryTask: true,
        tasks: [
          { id: 't8', type: 'listening', title: 'Listening Section 1 (original)', subtitle: 'Standard Practice', duration: 20, status: 'today' },
          { id: 't8_catchup', type: 'reading', title: 'Reading Catch-up (from Friday)', subtitle: '15 min (shortened version)', duration: 15, status: 'today', isRecovery: true }
        ]
      },
      {
        date: "SUN Mar 30",
        tasks: [{ id: 't9', type: 'strategy', title: 'Weekly Review', subtitle: 'AI analyzes your performance & adjusts Week 3', duration: 15, status: 'locked' }]
      }
    ]
  },
  { week_number: 3, title: "Reading Deep Dive", dateRange: "Mar 31-Apr 6", status: 'locked', totalTasks: 8, completedTasks: 0, days: [], goal: "" },
  { week_number: 4, title: "Grammar + Writing", dateRange: "Apr 7-13", status: 'locked', totalTasks: 7, completedTasks: 0, days: [], goal: "" },
  { week_number: 16, title: "Final Mock + Review", dateRange: "Jun 30-Jul 6", status: 'locked', totalTasks: 5, completedTasks: 0, days: [], goal: "" },
];

const SkillIcon = ({ type, className = "" }: { type: SkillType, className?: string }) => {
  switch (type) {
    case 'reading': return <BookOpen className={`w-5 h-5 text-blue-500 ${className}`} />;
    case 'writing': return <PenTool className={`w-5 h-5 text-purple-500 ${className}`} />;
    case 'vocabulary': return <Library className={`w-5 h-5 text-amber-500 ${className}`} />;
    case 'listening': return <Headphones className={`w-5 h-5 text-teal-500 ${className}`} />;
    case 'strategy': return <Lightbulb className={`w-5 h-5 text-gray-500 ${className}`} />;
  }
};

const SkillAccentColor = (type: SkillType) => {
  switch (type) {
    case 'reading': return 'bg-blue-500';
    case 'writing': return 'bg-purple-500';
    case 'vocabulary': return 'bg-amber-500';
    case 'listening': return 'bg-teal-500';
    case 'strategy': return 'bg-gray-400';
  }
};

export default function Roadmap() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [weeksData, setWeeksData] = useState<WeekPlan[]>(MOCK_WEEKS);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Map task skill type to its route
  const getTaskRoute = (task: DailyTask): string => {
    const type = task.type;
    const title = (task.title || '').toLowerCase();
    const cid = task.contentId;
    
    switch (type) {
      case 'reading': 
        if (title.includes('alex') || title.includes('tutor')) return '/reading/tutor-chat';
        return cid ? `/reading/${cid}` : '/reading';
      case 'writing':
        if (title.includes('task 1') || title.includes('letter') || title.includes('report') || title.includes('chart'))
          return '/writing/task-1';
        return '/writing/task-2';
      case 'listening': return cid ? `/listening/${cid}` : '/listening';
      case 'vocabulary': return '/vocabulary';
      case 'strategy': return '/coach';
      // @ts-ignore - mock might not be in the literal type but exists in backend
      case 'mock': return '/mock-test';
      default:
        if (title.includes('podcast') || title.includes('video'))
          return '/video-lesson/benefits-of-doing-nothing';
        return '/coach';
    }
  };

  // Map backend API week format to frontend WeekPlan format
  const mapApiWeeksToWeekPlans = (apiWeeks: any[]): WeekPlan[] => {
    return apiWeeks.map((week: any, idx: number) => {
      // The API returns flat tasks; group them into days
      const apiTasks = week.tasks || [];
      const totalTasks = apiTasks.length;

      // Map flat tasks into DailyTask format
      const mappedTasks: DailyTask[] = apiTasks.map((t: any, i: number) => ({
        id: t.id || `w${week.week_number || idx + 1}t${i}`,
        type: (t.skill || t.type || 'strategy') as SkillType,
        title: t.title || t.description || 'Task',
        subtitle: t.subtitle || t.details || '',
        duration: t.duration || t.minutes || 20,
        status: (t.status || (idx === 0 ? 'today' : 'locked')) as TaskStatus,
        score: t.score,
        contentId: t.content_id || t.contentId,
      }));

      // Group tasks into days (distribute evenly or put all in one day)
      const daysPerWeek = Math.max(1, Math.ceil(totalTasks / 3)); // ~3 tasks per day
      const days: DayPlan[] = [];
      const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
      for (let d = 0; d < Math.min(daysPerWeek, 7); d++) {
        const dayTasks = mappedTasks.slice(d * 3, (d + 1) * 3);
        if (dayTasks.length > 0) {
          days.push({
            date: dayNames[d] || `Day ${d + 1}`,
            tasks: dayTasks,
            isToday: idx === 0 && d === 0,
          });
        }
      }

      return {
        week_number: week.week_number || idx + 1,
        title: week.title || week.goal || week.focus || `Week ${idx + 1}`,
        dateRange: week.dateRange || week.date_range || '',
        status: week.status || (idx === 0 ? 'in_progress' : 'locked') as 'done' | 'in_progress' | 'locked',
        progress: week.progress,
        totalTasks,
        completedTasks: week.completedTasks || mappedTasks.filter(t => t.status === 'done').length,
        days,
        goal: week.goal || week.ai_coach_message || '',
      };
    });
  };

  React.useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const authHeaders: Record<string, string> = {};
          if (session?.access_token) {
            authHeaders['Authorization'] = `Bearer ${session.access_token}`;
          }

          const res = await fetch(`http://localhost:8002/api/onboarding/${user.id}`, {
            headers: authHeaders
          });
          
          if (!res.ok) throw new Error("Study plan not found");
          const data = await res.json();
          
          if (data && data.weeks) {
            const mapped = mapApiWeeksToWeekPlans(data.weeks);
            setWeeksData(mapped);
            if (mapped.length > 0) {
              const firstWeek = mapped[0].week_number;
              setSelectedDesktopWeek(firstWeek);
              setExpandedWeeks(new Set([firstWeek]));
            }
          }
        } catch (err) {
          console.error("Failed to fetch roadmap:", err);
          setFetchError(true);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [user]);

  const retryGeneration = async () => {
    try {
      setIsRetrying(true);
      const profileData = localStorage.getItem('onboarding_profile');
      if (!profileData || !user?.id) {
        navigate('/onboarding');
        return;
      }
      
      const parsedData = JSON.parse(profileData);
      const payload = { ...parsedData, userId: user.id };
      
      const { data: { session } } = await supabase.auth.getSession();
      const authHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (session?.access_token) {
        authHeaders['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('http://localhost:8002/api/onboarding/generate', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Failed to generate");
      
      const data = await res.json();
      if (data && data.weeks) {
        setWeeksData(mapApiWeeksToWeekPlans(data.weeks));
        setFetchError(false);
      }
    } catch (e) {
      console.error(e);
      navigate('/onboarding');
    } finally {
      setIsRetrying(false);
    }
  };

  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]));
  const [selectedDesktopWeek, setSelectedDesktopWeek] = useState<number>(1);
  const [showUpdateBanner, setShowUpdateBanner] = useState(true);

  const handleRetakeOnboarding = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.updateUser({ data: { onboardingCompleted: false } });
      navigate('/onboarding');
    } catch (e) {
      console.error('Failed to reset onboarding status', e);
      setIsLoading(false);
    }
  };

  const toggleWeek = (id: number) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const jumpToWeekNative = (id: number) => {
     setActiveTab('plan');
     setExpandedWeeks(new Set([id]));
     setTimeout(() => document.getElementById(`week-mob-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const userGoalScore = user?.targetBand || 7.0;
  const userStartScore = Math.max(1, userGoalScore - 1.5); // Fallback assumption
  const currentPlanWeeks = weeksData.length > 0 ? weeksData.length : 16;

  const chartData = React.useMemo(() => {
    const totalW = currentPlanWeeks;
    const points = Array.from(new Set([1, Math.max(2, Math.floor(totalW * 0.25)), Math.max(3, Math.floor(totalW * 0.5)), Math.max(4, Math.floor(totalW * 0.75)), totalW])).sort((a,b) => a-b);
    
    return points.map(w => {
        const progress = totalW <= 1 ? 1 : (w - 1) / (totalW - 1);
        const val = userStartScore + (userGoalScore - userStartScore) * progress;
        const rounded = Math.round(val * 2) / 2;
        return {
           week: `W${w}`,
           current: w === 1 ? userStartScore : (w === 2 ? Math.round((userStartScore + 0.1)*10)/10 : null),
           projected: w === 1 ? userStartScore : rounded
        };
    });
  }, [userStartScore, userGoalScore, currentPlanWeeks]);

  const skillProgress = React.useMemo(() => {
    let rTotal = 0, rDone = 0;
    let wTotal = 0, wDone = 0;
    let vTotal = 0, vDone = 0;
    let lTotal = 0, lDone = 0;

    weeksData.forEach(w => {
      w.days.forEach(d => {
        d.tasks.forEach(t => {
          if (t.type === 'reading') { rTotal++; if (t.status === 'done') rDone++; }
          if (t.type === 'writing') { wTotal++; if (t.status === 'done') wDone++; }
          if (t.type === 'vocabulary') { vTotal++; if (t.status === 'done') vDone++; }
          if (t.type === 'listening') { lTotal++; if (t.status === 'done') lDone++; }
        });
      });
    });

    return {
      reading: rTotal > 0 ? Math.round((rDone / rTotal) * 100) : 0,
      writing: wTotal > 0 ? Math.round((wDone / wTotal) * 100) : 0,
      vocab: vTotal > 0 ? Math.round((vDone / vTotal) * 100) : 0,
      listening: lTotal > 0 ? Math.round((lDone / lTotal) * 100) : 0,
    };
  }, [weeksData]);

  const renderMobileTodayView = () => {
    const todayTasks = weeksData.find(w => w.status === 'in_progress')?.days?.find(d => d.isToday)?.tasks || [];
    const isRecoveryDay = weeksData.find(w => w.status === 'in_progress')?.days?.find(d => d.isToday)?.hasRecoveryTask;
    
    return (
      <div className="flex-1 overflow-y-auto pb-24 bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-300">
        <div className="p-6 max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Good morning, Sardor 👋</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Week 2 · Day 5</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-xl font-semibold border border-orange-100 dark:border-orange-900/30">
              <Flame className="w-5 h-5 fill-current" /> 4-day streak
            </div>
          </div>

          <section>
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-600 dark:bg-blue-500 rounded-full"></span> Today's Plan
              </h2>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Est. time: {isRecoveryDay ? '35 min' : '30 min'}</span>
            </div>

            <div className="mt-8 space-y-4">
              {todayTasks.map((task, idx) => (
                <div key={task.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:border-blue-200 dark:hover:border-blue-500/50 transition-colors">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${SkillAccentColor(task.type)}`} />
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl"><SkillIcon type={task.type} className="w-6 h-6" /></div>
                    <div className="flex-1 pt-1">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight flex items-center flex-wrap gap-2">
                        {task.title}
                        {task.isRecovery && <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded uppercase tracking-wider font-bold">Catch-up</span>}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{task.subtitle}</p>
                      <div className="flex items-center gap-3 mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <span className="bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-300">{task.duration} min</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm">
                    Start {task.type === 'reading' ? 'Reading' : task.type === 'writing' ? 'Writing' : 'Practice'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-blue-900 to-indigo-900 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden border border-blue-800/50 dark:border-blue-900/50">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-8 translate-x-8 blur-2xl"></div>
             <h2 className="text-lg font-bold text-blue-100 mb-4 flex items-center gap-2">
               <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Band Projection
             </h2>
             <div className="space-y-3">
               <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/5">
                 <span className="font-medium text-blue-100">At this pace</span>
                 <span className="font-bold text-xl">Band {(userStartScore + 1.0).toFixed(1)} <span className="text-sm font-medium text-blue-200">by W{Math.max(1, currentPlanWeeks - 2)}</span></span>
               </div>
               <div className="flex justify-between items-center px-3 py-1">
                 <span className="font-medium text-blue-300">Target</span>
                 <span className="font-semibold text-blue-200">Band {userGoalScore.toFixed(1)} by W{currentPlanWeeks}</span>
               </div>
             </div>
          </section>
        </div>
      </div>
    );
  };

  const renderDayTasks = (day: DayPlan) => (
      <div className={`rounded-2xl border p-4 xl:p-6 relative overflow-hidden transition-all ${day.isToday ? 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-[0_2px_15px_-4px_rgba(37,99,235,0.15)]' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'}`}>
         <h4 className={`text-sm font-bold mb-4 flex items-center gap-2 ${day.isToday ? 'text-blue-800 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
            {day.isToday && <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse"></span>}
            {day.date} {day.isToday && "— TODAY"}
         </h4>

         {day.hasRecoveryTask && (
            <div className="mb-5 bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/80 dark:border-amber-800/50 rounded-xl p-4 shadow-sm animate-in zoom-in-95 duration-500 origin-top">
               <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-400 text-sm mb-1.5">
                  <AlertTriangle className="w-4 h-4" /> Yesterday's task was missed
               </div>
               <p className="text-xs font-medium text-amber-700 dark:text-amber-500">Your AI coach adjusted today's load to help you catch up gradually without feeling overwhelmed.</p>
            </div>
         )}

         <div className="space-y-4">
            {day.tasks.map(task => (
               <div key={task.id} className="flex gap-4 group">
                  <div className={`flex-shrink-0 mt-0.5 ${task.status === 'locked' ? 'opacity-40' : task.status === 'missed' ? 'opacity-60' : ''}`}>
                      {task.status === 'locked' ? <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500" /> : 
                       task.status === 'missed' ? <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" /> : <SkillIcon type={task.type} className="w-5 h-5 lg:w-6 lg:h-6" />}
                  </div>
                  <div className="flex-1">
                      <div className={`font-bold text-[15px] xl:text-[16px] flex items-center flex-wrap gap-2 ${task.status === 'missed' ? 'text-red-900 dark:text-red-400 line-through opacity-70' : 'text-slate-800 dark:text-slate-200'}`}>
                          {task.title}
                          {task.isRecovery && <span className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded shadow-sm uppercase tracking-wider font-bold">Catch-up</span>}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 leading-snug mt-1 max-w-md">{task.subtitle}</div>
                      <div className="mt-2 text-xs xl:text-sm flex flex-wrap items-center gap-2 font-medium">
                          <span className={`${task.status === 'missed' ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'} bg-slate-100 dark:bg-slate-800/80 border dark:border-slate-700 px-2 py-0.5 rounded`}>{task.duration} min</span>
                          {task.status === 'done' && <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded font-bold border border-emerald-100 dark:border-emerald-800/50"><CheckCircle2 className="w-3.5 h-3.5" /> {task.score}</span>}
                          {task.status === 'missed' && <span className="flex items-center gap-1 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded font-bold border border-red-100 dark:border-red-800/50"><XCircle className="w-3.5 h-3.5" /> Missed</span>}
                      </div>

                      {task.status === 'done' && (
                          <button onClick={() => navigate(getTaskRoute(task))} className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 w-max">
                              Review <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          </button>
                      )}
                      {task.status === 'locked' && (
                          <button onClick={() => navigate(getTaskRoute(task))} className="mt-4 text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 w-max">
                              Preview <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          </button>
                      )}
                      {task.status === 'today' && day.isToday && (
                          <button onClick={() => navigate(getTaskRoute(task))} className="mt-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm px-5 py-2 rounded-lg transition-colors flex items-center gap-1.5 w-max">
                              Start Task <ArrowRight className="w-4 h-4" />
                          </button>
                      )}
                  </div>
               </div>
            ))}
         </div>
         
         {day.hasRecoveryTask && day.isToday && (
             <div className="mt-5 pt-4 border-t border-amber-200/50 dark:border-amber-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/30 dark:bg-amber-900/10 -mx-4 -mb-4 xl:-mx-6 xl:-mb-6 p-4 xl:p-5 rounded-b-2xl">
                 <span className="font-bold text-amber-900 dark:text-amber-500 text-sm">Total: 35 min <span className="text-amber-700 dark:text-amber-600 font-medium ml-1">(just 15 min extra)</span></span>
                 <button onClick={() => setActiveTab('today')} className="bg-amber-100 hover:bg-amber-200 active:bg-amber-300 dark:bg-amber-600/20 dark:hover:bg-amber-600/30 text-amber-900 dark:text-amber-100 border-amber-200/60 dark:border-amber-500/30 shadow-sm text-sm font-bold px-5 py-2.5 rounded-xl transition-all w-full sm:w-auto text-center">Start Today's Block →</button>
             </div>
         )}
      </div>
  );

  const renderMobilePlanView = () => (
      <div className="flex-1 overflow-y-auto pb-24 bg-slate-50 dark:bg-slate-900 animate-in slide-in-from-right-4 duration-300">
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 pt-8 pb-6 px-4 md:px-8">
          <div className="max-w-2xl mx-auto relative">
            
            {showUpdateBanner && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-4 mb-6 shadow-sm relative animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-300 dark:bg-blue-600 opacity-10 rounded-full blur-2xl -translate-y-10"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm">
                      <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin-slow" />
                  </div>
                  <div>
                      <h4 className="font-bold text-blue-900 dark:text-blue-100">🔄 Your plan was updated</h4>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mt-1">"Reading practice increased for Week 3 based on your Week 2 performance."</p>
                      <button onClick={() => setShowUpdateBanner(false)} className="mt-3 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1">
                          See changes <ArrowRight className="w-4 h-4" />
                      </button>
                  </div>
                </div>
              </div>
            )}

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight text-center mb-6">Your Personalized Plan ✨</h1>
            
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-6 col-span-full shadow-sm">
              <div className="flex items-center justify-between mx-4 mb-4">
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Current</p>
                  <div className="text-3xl font-black text-slate-800 dark:text-slate-100">{userStartScore.toFixed(1)}</div>
                </div>
                <div className="flex-1 flex justify-center items-center">
                  <div className="h-0.5 w-12 bg-slate-300 dark:bg-slate-600 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 border-t-2 border-r-2 border-slate-300 dark:border-slate-600 rotate-45"></div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Target</p>
                  <div className="text-3xl font-black text-blue-600 dark:text-blue-500">{userGoalScore.toFixed(1)}</div>
                </div>
              </div>
            </div>
            
            {/* Priority Bars */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm">
                <div className="flex justify-between items-end mb-2"><span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Write</span><span className="font-semibold text-purple-600 dark:text-purple-400 text-sm">40%</span></div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[40%] rounded-full"></div></div>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm">
                <div className="flex justify-between items-end mb-2"><span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Read</span><span className="font-semibold text-blue-600 dark:text-blue-400 text-sm">30%</span></div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[30%] rounded-full"></div></div>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm">
                <div className="flex justify-between items-end mb-2"><span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Vocab</span><span className="font-semibold text-amber-600 dark:text-amber-400 text-sm">20%</span></div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-[20%] rounded-full"></div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 z-10 px-4 py-3 shadow-sm">
          <div className="max-w-2xl mx-auto flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[1, 2, 3, 4, 16].map((weekNum) => {
              const currentWeek = 2;
              const isCurrent = weekNum === currentWeek;
              const isPast = weekNum < currentWeek;
              return (
                <button 
                  key={weekNum} onClick={() => jumpToWeekNative(weekNum)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap outline-none ${isCurrent ? 'bg-blue-600 text-white shadow-sm' : isPast ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' : 'bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'}`}
                >
                  W{weekNum} {isCurrent && <span className="ml-1 opacity-70">↓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-10"><RefreshCw className="w-8 h-8 animate-spin text-blue-500" /></div>
          ) : weeksData.map((week) => {
            const isExpanded = expandedWeeks.has(week.week_number);
            const isCurrent = week.status === 'in_progress';
            const isDone = week.status === 'done';
            return (
              <div key={week.week_number} id={`week-mob-${week.week_number}`} className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm ${isCurrent ? 'border-blue-300 dark:border-blue-500/50 ring-4 ring-blue-50 dark:ring-blue-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                <button onClick={() => week.status !== 'locked' && toggleWeek(week.week_number)} className={`w-full text-left p-5 flex items-start gap-4 ${week.status === 'locked' ? 'cursor-default opacity-70' : 'cursor-pointer'}`}>
                  <div className="mt-1 flex-shrink-0">
                    {isDone ? <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50 dark:fill-emerald-900/30" /> : isCurrent ? <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 border-4 border-blue-600 dark:border-blue-500 shadow-sm" /> : <Lock className="w-6 h-6 text-slate-300 dark:text-slate-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-lg truncate ${isCurrent ? 'text-blue-900 dark:text-blue-100' : isDone ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>WEEK {week.week_number} — {week.title}</h3>
                    <p className={`text-sm mt-1 font-medium ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>{week.dateRange} <span className="mx-1.5 opacity-50">•</span> {week.status === 'locked' ? 'Locked' : `${week.completedTasks}/${week.totalTasks} tasks`}</p>
                    {isCurrent && (
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden"><div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" style={{ width: `${week.progress}%` }}></div></div>
                        <span className="text-xs font-bold text-blue-800 dark:text-blue-300">{week.progress}%</span>
                      </div>
                    )}
                  </div>
                  {week.status !== 'locked' && <div className="flex-shrink-0 text-slate-400 dark:text-slate-500 mt-1">{isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</div>}
                </button>

                {isExpanded && week.status !== 'locked' && (
                  <div className="px-3 pb-5 border-t border-slate-100 dark:border-slate-700 pt-4 bg-slate-50/30 dark:bg-slate-900/30">
                    {week.goal && (
                      <div className="mb-5 mx-2 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/50">
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">This week's goal</p>
                        <p className="text-indigo-900 dark:text-indigo-200 font-medium italic">"{week.goal}"</p>
                      </div>
                    )}
                    <div className="space-y-4 mx-2">
                      {week.days.map((day, dIdx) => <React.Fragment key={dIdx}>{renderDayTasks(day)}</React.Fragment>)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
  );

  const renderStatsSidebar = () => (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 fade-in w-full pb-8 pr-1 lg:pr-2 h-full">
       
       {/* GOAL CARD */}
       <section className="bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-800 dark:from-indigo-950 dark:via-blue-950 dark:to-blue-900 rounded-3xl p-6 shadow-md border border-blue-800 dark:border-blue-800/50 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -translate-y-8 translate-x-8"></div>
          <div className="relative z-10 flex items-center justify-between">
              <div>
                  <p className="text-blue-200 text-sm font-semibold mb-1 uppercase tracking-widest">Current Band</p>
                  <p className="text-white text-4xl font-black">{userStartScore.toFixed(1)} <span className="text-emerald-400 text-sm font-bold ml-2 bg-emerald-400/20 px-2 py-0.5 rounded align-middle">+0.1 this week</span></p>
              </div>
          </div>
          <div className="h-px w-full bg-blue-800/50 my-5 relative z-10"></div>
          <div className="relative z-10 flex items-center justify-between">
              <div>
                  <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider">Target Band</p>
                  <p className="text-white text-lg font-bold">{userGoalScore.toFixed(1)}</p>
              </div>
              <div className="text-right">
                  <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider">Projected ETA</p>
                  <p className="text-white text-lg font-bold">Week {currentPlanWeeks}</p>
              </div>
          </div>
       </section>

       {/* SKILL PROGRESS */}
       <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
            <span className="w-1 h-5 bg-purple-500 rounded-full"></span> Skill Progress
          </h2>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-end mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300 font-bold text-sm">Writing</span>
                  <div className="text-right">
                      <span className="text-slate-400 dark:text-slate-500 font-medium text-xs mr-2 border-r border-slate-200 dark:border-slate-700 pr-2">{skillProgress.writing}%</span>
                      <span className="text-purple-700 dark:text-purple-300 font-bold text-sm bg-purple-50 dark:bg-purple-900/20 px-1.5 py-0.5 rounded shadow-sm border border-purple-100 dark:border-purple-800/30">+0.25 band</span>
                  </div>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{ width: `${skillProgress.writing}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300 font-bold text-sm">Reading</span>
                  <div className="text-right">
                      <span className="text-slate-400 dark:text-slate-500 font-medium text-xs mr-2 border-r border-slate-200 dark:border-slate-700 pr-2">{skillProgress.reading}%</span>
                      <span className="text-blue-700 dark:text-blue-300 font-bold text-sm bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded shadow-sm border border-blue-100 dark:border-blue-800/30">+5% var.</span>
                  </div>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${skillProgress.reading}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300 font-bold text-sm">Vocabulary</span>
                  <div className="text-right">
                      <span className="text-slate-400 dark:text-slate-500 font-medium text-xs mr-2 border-r border-slate-200 dark:border-slate-700 pr-2">{skillProgress.vocab}%</span>
                      <span className="text-amber-700 dark:text-amber-300 font-bold text-sm bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded shadow-sm border border-amber-100 dark:border-amber-800/30">95% retention</span>
                  </div>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${skillProgress.vocab}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300 font-bold text-sm">Listening</span>
                  <div className="text-right">
                      <span className="text-slate-400 dark:text-slate-500 font-medium text-xs mr-2 border-r border-slate-200 dark:border-slate-700 pr-2">{skillProgress.listening}%</span>
                      <span className="text-teal-700 dark:text-teal-300 font-bold text-sm bg-teal-50 dark:bg-teal-900/20 px-1.5 py-0.5 rounded shadow-sm border border-teal-100 dark:border-teal-800/30">On Track</span>
                  </div>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden"><div className="h-full bg-teal-500 rounded-full transition-all duration-1000" style={{ width: `${skillProgress.listening}%` }}></div></div>
            </div>
          </div>
        </section>

       {/* PREDICTED BAND SCORE */}
       <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2 relative z-10">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> Predicted Band Score
          </h3>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 relative z-10">
              <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 rounded-md font-bold">On track</span> to reach Band {userGoalScore.toFixed(1)} by Week {currentPlanWeeks}.
          </p>
          
          <div className="h-[200px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-20" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} dy={10} />
                    <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}} />
                    
                    <ReferenceLine y={userGoalScore} stroke="#10B981" strokeDasharray="4 4" label={{ position: 'insideTopLeft', value: `Target ${userGoalScore.toFixed(1)}`, fill: '#10B981', fontSize: 11, fontWeight: 'bold', dy: -10 }} />
                    
                    {/* The Projection line */}
                    <Line type="monotone" dataKey="projected" stroke="#cbd5e1" className="dark:opacity-30" strokeWidth={3} strokeDasharray="6 6" dot={false} name="Projected" activeDot={false} />
                    {/* The Actual Realized Data */}
                    <Line type="monotone" dataKey="current" stroke="#2563EB" strokeWidth={4} dot={{r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6, stroke: '#fff', strokeWidth: 3}} name="Current Level" />
                </LineChart>
              </ResponsiveContainer>
          </div>
          
          <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400 relative z-10">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div> Current</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-[3px] border-t-2 border-dashed border-slate-300 dark:border-slate-600"></div> Projection</div>
          </div>
       </section>

    </div>
  );

  if (fetchError) {
    return (
      <div className="h-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 text-center shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">Plan Generation Interrupted</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            We experienced an issue creating your personalized study plan. Don't worry, your answers were saved safely on your device!
          </p>
          <button 
            onClick={retryGeneration}
            disabled={isRetrying}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm"
          >
            {isRetrying ? (
              <><RotateCcw className="w-5 h-5 animate-spin" /> Regenerating Plan...</>
            ) : (
              <><RefreshCw className="w-5 h-5" /> Retry Plan Creation</>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[calc(100vh-4rem)] flex flex-col w-full relative overflow-hidden bg-slate-50 dark:bg-slate-900">
      
      {/* 
        ========================================
        MOBILE LAYOUT (max-width: md)
        ========================================
      */}
      <div className="md:hidden flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-900 shadow-[0_0_40px_rgba(0,0,0,0.05)] dark:shadow-none relative w-full">
        {activeTab === 'today' && renderMobileTodayView()}
        {activeTab === 'plan' && renderMobilePlanView()}
        {activeTab === 'stats' && (
           <div className="flex-1 overflow-y-auto pb-24 bg-slate-50 dark:bg-slate-900 p-4">
               {renderStatsSidebar()}
           </div>
        )}
        
        {['tasks', 'more'].includes(activeTab) && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 pb-24">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4 flex items-center justify-center opacity-50"><CheckSquare className="w-8 h-8" /></div>
            <p className="font-semibold text-lg">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} view coming soon</p>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-none z-50">
          <div className="flex items-center justify-around px-2 py-3">
            <button onClick={() => setActiveTab('plan')} className={`flex flex-col items-center gap-1.5 w-16 transition-colors ${activeTab === 'plan' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
              <CalendarDays className={`w-6 h-6 ${activeTab === 'plan' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className={`text-[10px] font-bold ${activeTab === 'plan' ? 'text-blue-600 dark:text-blue-400' : ''}`}>Plan</span>
            </button>
            <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1.5 w-16 transition-colors ${activeTab === 'stats' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
              <BarChart2 className={`w-6 h-6 ${activeTab === 'stats' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className={`text-[10px] font-bold ${activeTab === 'stats' ? 'text-blue-600 dark:text-blue-400' : ''}`}>Stats</span>
            </button>
            <button onClick={() => setActiveTab('today')} className="relative flex flex-col items-center -mt-6 group outline-none">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-1 shadow-lg transition-transform active:scale-95 ${activeTab === 'today' ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-slate-800 dark:bg-slate-800 text-white hover:bg-slate-700 dark:hover:bg-slate-700'}`}>
                <Home className={`w-6 h-6 ${activeTab === 'today' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] font-bold ${activeTab === 'today' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>Today</span>
            </button>
            <button onClick={() => setActiveTab('tasks')} className={`flex flex-col items-center gap-1.5 w-16 transition-colors ${activeTab === 'tasks' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
              <CheckSquare className={`w-6 h-6 ${activeTab === 'tasks' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className={`text-[10px] font-bold ${activeTab === 'tasks' ? 'text-blue-600 dark:text-blue-400' : ''}`}>Tasks</span>
            </button>
            <button onClick={() => setActiveTab('more')} className={`flex flex-col items-center gap-1.5 w-16 transition-colors ${activeTab === 'more' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
              <MoreHorizontal className={`w-6 h-6 ${activeTab === 'more' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className={`text-[10px] font-bold ${activeTab === 'more' ? 'text-blue-600 dark:text-blue-400' : ''}`}>More</span>
            </button>
          </div>
        </div>
      </div>

      {/* 
        ========================================
        TABLET & DESKTOP LAYOUT (min-width: md)
        ========================================
      */}
      <div className="hidden md:flex flex-1 w-full max-w-[1600px] mx-auto p-4 lg:p-6 xl:p-8 gap-4 lg:gap-6 xl:gap-8 overflow-hidden h-full">
        
        {/* COL 1: Week List (Sidebar) */}
        <div className="w-[280px] lg:w-[320px] flex-shrink-0 flex flex-col overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative z-10">
           
           <div className="p-5 lg:p-6 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
              <div>
                 <h2 className="text-lg lg:text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
                     <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-500" /> My Roadmap
                 </h2>
                 <p className="text-slate-500 dark:text-slate-400 font-medium text-xs lg:text-sm mt-1">Select a week to view plan</p>
              </div>
              
              <button 
                onClick={handleRetakeOnboarding}
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center xl:gap-1.5" 
                title="Retake Onboarding (Generate new roadmap)"
              >
                  <RotateCcw className="w-5 h-5" />
                  <span className="hidden xl:block text-[13px] font-bold">Retake</span>
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto no-scrollbar py-2">
             {weeksData.map((w, i) => {
                const isSelected = selectedDesktopWeek === w.week_number;
                const isDone = w.status === 'done';
                const isCurrent = w.status === 'in_progress';
                const isLocked = w.status === 'locked';

                return (
                 <button 
                  key={w.week_number} 
                  onClick={() => !isLocked && setSelectedDesktopWeek(w.week_number)}
                  className={`w-full text-left p-4 lg:p-5 border-b border-slate-50/50 dark:border-slate-700/50 flex items-start gap-3.5 transition-all outline-none
                    ${isLocked ? 'opacity-60 cursor-default hover:bg-transparent' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30'}
                    ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}
                  `}
                 >
                    {/* Compact Status Indicator */}
                    <div className="mt-0.5 flex-shrink-0">
                      {isDone ? <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'}`} /> :
                       isCurrent ? <div className={`w-3 h-3 mt-1 rounded-full ${isSelected ? 'bg-blue-600 dark:bg-blue-500 shadow-[0_0_0_4px_rgba(37,99,235,0.1)] dark:shadow-[0_0_0_4px_rgba(59,130,246,0.2)]' : 'bg-blue-400 dark:bg-blue-500'}`} /> : 
                       <Lock className="w-4 h-4 text-slate-300 dark:text-slate-600 mt-0.5" />}
                    </div>
                    
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className={`font-bold text-[14px] lg:text-[15px] truncate flex items-center gap-2 ${isSelected ? 'text-blue-900 dark:text-blue-100' : isDone ? 'text-slate-700 dark:text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                        Week {w.week_number}: {w.title}
                        {isLocked && <Lock className="w-3 h-3 text-slate-300 dark:text-slate-600" />}
                      </h3>
                      
                      {isLocked ? (
                        <p className="text-[11px] lg:text-[12px] mt-1 font-medium text-slate-400 dark:text-slate-500">
                           Unlock after Week {w.week_number - 1} · {w.dateRange}
                        </p>
                      ) : (
                        <p className={`text-[11px] lg:text-[12px] mt-1 font-semibold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                           {w.dateRange} <span className="mx-1 opacity-50">•</span> {w.completedTasks} of {w.totalTasks} Tasks
                        </p>
                      )}

                      {/* Single small progress bar only if selected AND in progress */}
                      {isSelected && isCurrent && (
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex-1 h-1 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden"><div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" style={{ width: `${w.progress}%` }}></div></div>
                        </div>
                      )}
                    </div>
                 </button>
                )
             })}
           </div>
        </div>

        {/* COL 2: Day Details (Main View) */}
        <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden min-w-[350px] lg:min-w-[450px]">
           <div className="flex-1 overflow-y-auto p-5 md:p-6 lg:p-8 xl:p-10 space-y-6 xl:space-y-8 bg-gradient-to-b from-white to-transparent dark:from-slate-800/80 dark:to-transparent">
              
              {/* TOP: Week Header Summary */}
              {weeksData.find(w => w.week_number === selectedDesktopWeek) && (() => {
                 const currentWeekInfo = weeksData.find(w => w.week_number === selectedDesktopWeek) || weeksData[0];
                 return (
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                        <div>
                          <h1 className="text-2xl xl:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                            Week {currentWeekInfo.week_number}: {currentWeekInfo.title}
                          </h1>
                          <p className="text-slate-600 dark:text-slate-400 font-medium flex flex-wrap items-center gap-2 lg:gap-3 text-sm lg:text-base">
                             <span>{currentWeekInfo.dateRange}</span>
                             <span className="w-1 h-1 bg-slate-400 dark:bg-slate-600 rounded-full"></span>
                             <span className="font-bold text-slate-800 dark:text-slate-200">{currentWeekInfo.completedTasks}/{currentWeekInfo.totalTasks} tasks complete</span>
                             <span className="w-1 h-1 bg-slate-400 dark:bg-slate-600 rounded-full"></span>
                             <span className="text-blue-700 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">{currentWeekInfo.totalTasks - currentWeekInfo.completedTasks} tasks left</span>
                          </p>
                        </div>
                        {selectedDesktopWeek === 2 && (
                          <div className="inline-flex items-center gap-2 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 text-orange-700 dark:text-orange-400 px-4 py-2 rounded-xl font-bold border border-orange-100/60 dark:border-orange-800/30 shadow-sm animate-in zoom-in-95 shrink-0 hidden sm:flex">
                            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 dark:fill-orange-400 dark:text-orange-400" /> 4-day streak!
                          </div>
                        )}
                    </div>

                    {/* Continue Next Task CTA (Only if current week) */}
                    {currentWeekInfo.status === 'in_progress' && (() => {
                        const nextTask = currentWeekInfo.days.flatMap((d: DayPlan) => d.tasks).find((t: DailyTask) => t.status === 'today');
                        if (!nextTask) return null;
                        return (
                          <div className="bg-white dark:bg-slate-800 border-2 border-blue-600 dark:border-blue-500 rounded-2xl p-5 lg:p-6 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.2)] dark:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.15)] relative overflow-hidden group animate-in slide-in-from-bottom-4 duration-500">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 dark:bg-blue-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                            
                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                               <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span> Continue next task
                            </p>
                            
                            <div className="flex items-start gap-4 mb-6 lg:mb-8 relative z-10">
                               <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 shadow-sm shrink-0">
                                   <SkillIcon type={nextTask.type} className="w-8 h-8 lg:w-10 lg:h-10" />
                               </div>
                               <div>
                                   <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-2">{nextTask.title}</h3>
                                   <div className="flex flex-wrap items-center gap-2 text-[13px] lg:text-sm font-semibold">
                                       <span className="bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md">{nextTask.duration} min</span>
                                       <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-blue-100 dark:border-blue-800/30"><TrendingUp className="w-3.5 h-3.5" /> Recommended next</span>
                                       <span className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-amber-100 dark:border-amber-800/30"><CalendarDays className="w-3.5 h-3.5" /> Due today</span>
                                   </div>
                               </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
                               <button 
                                 onClick={() => navigate(getTaskRoute(nextTask))}
                                 className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3.5 lg:py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                               >
                                   Start task <ArrowRight className="w-4 h-4 ml-0.5" />
                               </button>
                               <button 
                                  onClick={() => document.getElementById(`day-view-start`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                  className="w-full sm:w-auto sm:px-8 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold py-3.5 lg:py-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center gap-2 transition-all"
                               >
                                   View week plan
                               </button>
                            </div>
                          </div>
                        );
                    })()}

                    {/* AI Update Collapsed */}
                    {showUpdateBanner && selectedDesktopWeek === 2 && (
                      <div className="bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100/80 dark:border-indigo-800/50 rounded-2xl p-4 lg:p-5 shadow-sm relative group cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-200 dark:hover:border-indigo-700/50 transition-all animate-in zoom-in-95 duration-500" onClick={() => setShowUpdateBanner(false)}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 lg:gap-4">
                              <div className="bg-white dark:bg-slate-800 p-2 lg:p-2.5 text-indigo-600 dark:text-indigo-400 rounded-full shadow-[0_2px_8px_-2px_rgba(79,70,229,0.2)] dark:shadow-[0_2px_8px_-2px_rgba(99,102,241,0.15)] border border-indigo-50 dark:border-indigo-900/50 shrink-0">
                                  <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 animate-spin-slow" />
                              </div>
                              <div>
                                  <p className="font-bold text-indigo-900 dark:text-indigo-100 text-sm lg:text-[15px]">Study plan updated based on your performance</p>
                                  <p className="text-xs lg:text-sm font-medium text-indigo-600/80 dark:text-indigo-400/80 mt-0.5 max-w-md truncate hidden sm:block">"Based on your performance in Writing Task 1..."</p>
                              </div>
                          </div>
                          <button className="text-[13px] lg:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm shrink-0 whitespace-nowrap">
                              View changes <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                 );
              })()}

              {/* Categorized Days List */}
              <div id="day-view-start" className="space-y-10 xl:space-y-12 pb-12 pt-4">
                {weeksData.find(w => w.week_number === selectedDesktopWeek) && (() => {
                    const days = weeksData.find(w => w.week_number === selectedDesktopWeek)?.days || [];
                    
                    const todayDays = days.filter(d => d.isToday);
                    const completedDays = days.filter(d => !d.isToday && d.tasks.every(t => t.status === 'done' || t.status === 'missed'));
                    const upcomingDays = days.filter(d => !d.isToday && d.tasks.some(t => t.status === 'locked' || t.status === 'today'));

                    return (
                      <>
                        {/* TODAY SECTION */}
                        {todayDays.length > 0 && (
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                 <h3 className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">Today</h3>
                                 <div className="h-px bg-slate-200 dark:bg-slate-700/50 flex-1"></div>
                             </div>
                             <div className="space-y-4">
                               {todayDays.map((day, dIdx) => <React.Fragment key={dIdx}>{renderDayTasks(day)}</React.Fragment>)}
                             </div>
                          </div>
                        )}

                        {/* UPCOMING SECTION */}
                        {upcomingDays.length > 0 && (
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                 <h3 className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">Upcoming</h3>
                                 <div className="h-px bg-slate-200 dark:bg-slate-700/50 flex-1"></div>
                             </div>
                             <div className="space-y-4">
                               {upcomingDays.map((day, dIdx) => <React.Fragment key={dIdx}>{renderDayTasks(day)}</React.Fragment>)}
                             </div>
                          </div>
                        )}

                        {/* COMPLETED SECTION */}
                        {completedDays.length > 0 && (
                          <div className="space-y-4 opacity-80">
                             <div className="flex items-center gap-3">
                                 <h3 className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">Completed</h3>
                                 <div className="h-px bg-slate-200 dark:bg-slate-700/50 flex-1"></div>
                             </div>
                             <div className="space-y-4">
                               {completedDays.map((day, dIdx) => <React.Fragment key={dIdx}>{renderDayTasks(day)}</React.Fragment>)}
                             </div>
                          </div>
                        )}
                      </>
                    );
                })()}
              </div>
           </div>
        </div>

        {/* COL 3: Stats / Band Projection Dashboard */}
        <div className="hidden lg:flex w-[320px] xl:w-[380px] 2xl:w-[420px] flex-shrink-0 flex-col overflow-y-auto no-scrollbar">
            {renderStatsSidebar()}
        </div>

      </div>
    </div>
  );
}
