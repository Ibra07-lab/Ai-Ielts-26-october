import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';
import {
  ChevronRight, ChevronLeft, Target, CalendarDays, Award,
  BookOpen, GraduationCap, Clock, Calendar,
  CheckCircle2, Headphones, PenTool, Search,
  Sparkles, Loader2
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SkillScores {
  L: number;
  R: number;
  W: number;
}

interface StrategyOption {
  id: 'balanced' | 'compensatory';
  title: string;
  description: string;
  targets: SkillScores;
  total_boost_needed: number;
}

interface OnboardingData {
  // Q1
  target_overall: number | null;
  // Q2
  test_date: string | null;
  test_date_type: 'exact' | 'within_2' | 'within_3' | 'within_4_6' | 'flexible' | null;
  weeks_available: number | null;
  // Q3
  has_previous_scores: boolean | null;
  previous_scores: SkillScores | null;
  // Q4 (only if Q3 = false)
  self_assessment_level: 'A2' | 'B1' | 'B2' | 'C1' | null;
  // Derived (from Q3 or Q4)
  current_scores: SkillScores | null;
  // Q5
  has_minimums: boolean | null; // true | false | null (not sure)
  minimums_answer: 'yes' | 'no' | 'not_sure' | null;
  min_sections: SkillScores | null;
  university_name: string | null;
  // Q6
  weakest_skill: 'listening' | 'reading' | 'writing' | null;
  // Q7
  specific_challenges: string[];
  // Q8
  daily_minutes: number | null;
  // Q9
  days_per_week: number | null;
  // Strategy
  strategy_preference: 'balanced' | 'compensatory' | null;
  strategy_options: StrategyOption[] | null;
}

const SELF_ASSESSMENT_SCORES: Record<string, SkillScores> = {
  A2: { L: 4.0, R: 4.0, W: 4.0 },
  B1: { L: 5.0, R: 5.0, W: 4.5 },
  B2: { L: 5.5, R: 6.0, W: 5.5 },
  C1: { L: 7.0, R: 7.0, W: 6.5 },
};

const BAND_OPTIONS = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];
const TARGET_BAND_OPTIONS = [5.5, 6.0, 6.5, 7.0, 7.5, 8.0];
const DAILY_MINUTES_OPTIONS = [
  { value: 20, label: '20 minutes', tag: 'light' },
  { value: 30, label: '30 minutes', tag: '' },
  { value: 45, label: '45 minutes', tag: 'recommended' },
  { value: 60, label: '60 minutes', tag: '' },
  { value: 90, label: '90 minutes', tag: '' },
  { value: 120, label: '120 minutes', tag: 'intensive' },
];
const DAYS_PER_WEEK_OPTIONS = [3, 4, 5, 6, 7];

const CHALLENGES_BY_SKILL: Record<string, string[]> = {
  writing: [
    "I can't structure essays well",
    "I struggle to describe charts",
    "My vocabulary is limited",
    "I make grammar mistakes",
    "I can't finish in time",
    "I don't know what examiners want",
  ],
  reading: [
    "I run out of time",
    "True/False/Not Given confuses me",
    "Academic texts are too hard",
    "I can't find specific info fast",
    "Matching headings is difficult",
    "I read too slowly",
  ],
  listening: [
    "The audio is too fast",
    "I can't understand accents",
    "I make spelling mistakes",
    "I lose my place while listening",
    "Sections 3-4 are too hard",
    "I miss answers and can't recover",
  ],

};



const POPULAR_UNIVERSITIES = [
  'University of Melbourne', 'University of Toronto', 'UCL',
  'University of Edinburgh', 'University of Sydney', 'University of Manchester',
  'University of British Columbia', 'Imperial College London', 'Monash University',
  'University of Leeds',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcWeeksAvailable(data: OnboardingData): number {
  if (data.test_date_type === 'exact' && data.test_date) {
    const diff = new Date(data.test_date).getTime() - Date.now();
    return Math.max(1, Math.floor(diff / (7 * 24 * 60 * 60 * 1000)));
  }
  switch (data.test_date_type) {
    case 'within_2': return 8;
    case 'within_3': return 12;
    case 'within_4_6': return 20;
    case 'flexible': return 16;
    default: return 16;
  }
}

// ─── Step Components ──────────────────────────────────────────────────────────

function StepContainer({ children, title, subtitle, icon }: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function OptionButton({ selected, onClick, children, tag, disabled }: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tag?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all outline-none group
        ${selected
          ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="flex items-center justify-between">
        <span className={`font-semibold text-[15px] ${selected ? 'text-blue-900 dark:text-blue-100' : 'text-slate-700 dark:text-slate-300'}`}>
          {children}
        </span>
        <div className="flex items-center gap-2">
          {tag && (
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
              selected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}>{tag}</span>
          )}
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            selected ? 'border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500' : 'border-slate-300 dark:border-slate-600'
          }`}>
            {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
          </div>
        </div>
      </div>
    </button>
  );
}

function ChipButton({ selected, onClick, children }: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all outline-none
        ${selected
          ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}
      `}
    >
      {children}
    </button>
  );
}

function BandSelect({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 min-w-[80px]">{label}</span>
      <select
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="flex-1 max-w-[120px] bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors"
      >
        {BAND_OPTIONS.map(b => <option key={b} value={b}>{b.toFixed(1)}</option>)}
      </select>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [data, setData] = useState<OnboardingData>({
    target_overall: null,
    test_date: null,
    test_date_type: null,
    weeks_available: null,
    has_previous_scores: null,
    previous_scores: null,
    self_assessment_level: null,
    current_scores: null,
    has_minimums: null,
    minimums_answer: null,
    min_sections: null,
    university_name: null,
    weakest_skill: null,
    specific_challenges: [],
    daily_minutes: null,
    days_per_week: null,
    strategy_preference: null,
    strategy_options: null,
  });

  // Step management: compute visible steps based on answers
  const stepKeys = useMemo(() => {
    const steps: string[] = ['q1', 'q2', 'q3'];
    if (data.has_previous_scores === false) {
      steps.push('q4');
    }
    steps.push('q4_strategy');
    steps.push('q5');
    if (data.minimums_answer === 'yes') steps.push('q5a');
    if (data.minimums_answer === 'not_sure') steps.push('q5b');
    steps.push('q6', 'q7', 'q8', 'q9', 'summary');
    return steps;
  }, [data.has_previous_scores, data.minimums_answer]);

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const currentStep = stepKeys[currentStepIdx] || 'q1';
  const totalSteps = stepKeys.length;
  const progress = ((currentStepIdx) / (totalSteps - 1)) * 100;

  const [universitySearch, setUniversitySearch] = useState('');

  // Navigation
  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 'q1': return data.target_overall !== null;
      case 'q2': return data.test_date_type !== null && (data.test_date_type !== 'exact' || !!data.test_date);
      case 'q3': return data.has_previous_scores !== null && (data.has_previous_scores === false || data.previous_scores !== null);
      case 'q4': return data.self_assessment_level !== null;
      case 'q4_strategy': return data.strategy_preference !== null;
      case 'q5': return data.minimums_answer !== null;
      case 'q5a': return data.min_sections !== null;
      case 'q5b': return true; // can skip
      case 'q6': return data.weakest_skill !== null;
      case 'q7': return data.specific_challenges.length > 0;
      case 'q8': return data.daily_minutes !== null;
      case 'q9': return data.days_per_week !== null;
      case 'summary': return true;
      default: return false;
    }
  };

  const goNext = () => {
    // Derive values before advancing
    if (currentStep === 'q2') {
      setData(prev => ({ ...prev, weeks_available: calcWeeksAvailable(prev) }));
    }
    if (currentStep === 'q3' && data.has_previous_scores && data.previous_scores) {
      setData(prev => ({ ...prev, current_scores: prev.previous_scores }));
    }
    if (currentStep === 'q4' && data.self_assessment_level) {
      setData(prev => ({ ...prev, current_scores: SELF_ASSESSMENT_SCORES[prev.self_assessment_level!] }));
    }

    if (currentStepIdx < totalSteps - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const profile = {
      target_overall: data.target_overall,
      test_date: data.test_date,
      weeks_available: data.weeks_available || calcWeeksAvailable(data),
      has_previous_scores: data.has_previous_scores,
      current_scores: data.current_scores,
      has_minimums: data.minimums_answer === 'yes',
      min_sections: data.min_sections,
      university_name: data.university_name,
      weakest_skill: data.weakest_skill,
      specific_challenges: data.specific_challenges,
      daily_minutes: data.daily_minutes,
      days_per_week: data.days_per_week,
      weekly_minutes: (data.daily_minutes || 0) * (data.days_per_week || 0),
      strategy_preference: data.strategy_preference,
    };

    try {
      // For now, store in localStorage until backend is wired
      localStorage.setItem('onboarding_profile', JSON.stringify(profile));
      localStorage.setItem('onboarding_completed', 'true');

      if (user?.id) {
        // Build payload matching Python OnboardingData
        const payload = {
          userId: user.id,
          target_overall: data.target_overall,
          test_date: data.test_date,
          weeks_available: data.weeks_available || calcWeeksAvailable(data),
          has_previous_scores: !!data.has_previous_scores,
          current_scores: data.current_scores,
          has_minimums: data.minimums_answer === 'yes',
          min_sections: data.min_sections,
          university_name: data.university_name,
          weakest_skill: data.weakest_skill,
          specific_challenges: data.specific_challenges,
          daily_minutes: data.daily_minutes,
          days_per_week: data.days_per_week,
          l1_language: 'en',
          purpose: 'academic',
          strategy_preference: data.strategy_preference
        };

        const { data: { session } } = await supabase.auth.getSession();
        const authHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (session?.access_token) {
          authHeaders['Authorization'] = `Bearer ${session.access_token}`;
        }

        await fetch('http://localhost:8002/api/onboarding/generate', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify(payload)
        });

        // Update auth metadatabase to clear the onboarding gate
        await supabase.auth.updateUser({
          data: { onboardingCompleted: true }
        });
      }

      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/plan');
        // Force reload so ProtectedRoute and UserProvider sync immediately if context is stale
        window.location.reload();
      }, 1500);
    } catch {
      setIsSubmitting(false);
    }
  };

  // ─── Render Steps ─────────────────────────────────────────────────────────

  const renderStep = () => {
    switch (currentStep) {

      // ═══ Q1: Target Band ═══
      case 'q1':
        return (
          <StepContainer title="What overall IELTS band score do you need?" icon={<Target className="w-6 h-6" />}>
            <div className="space-y-3">
              {TARGET_BAND_OPTIONS.map(band => (
                <OptionButton
                  key={band}
                  selected={data.target_overall === band}
                  onClick={() => setData(prev => ({ ...prev, target_overall: band }))}
                  tag={band === 7.0 ? 'most common' : undefined}
                >
                  {band.toFixed(1)}
                </OptionButton>
              ))}
            </div>
          </StepContainer>
        );

      // ═══ Q2: Test Date ═══
      case 'q2':
        return (
          <StepContainer title="When is your IELTS test?" icon={<CalendarDays className="w-6 h-6" />}>
            <div className="space-y-3">
              <OptionButton
                selected={data.test_date_type === 'exact'}
                onClick={() => setData(prev => ({ ...prev, test_date_type: 'exact' }))}
              >
                I have a date
              </OptionButton>
              {data.test_date_type === 'exact' && (
                <div className="pl-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <input
                    type="date"
                    value={data.test_date || ''}
                    onChange={e => setData(prev => ({ ...prev, test_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors"
                  />
                </div>
              )}

              <div className="pt-2">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 pl-1">I haven't booked yet — when do you plan to take it?</p>
                <div className="space-y-3">
                  {([
                    { key: 'within_2' as const, label: 'Within 2 months' },
                    { key: 'within_3' as const, label: 'Within 3 months' },
                    { key: 'within_4_6' as const, label: 'Within 4–6 months' },
                    { key: 'flexible' as const, label: 'No rush / flexible' },
                  ]).map(opt => (
                    <OptionButton
                      key={opt.key}
                      selected={data.test_date_type === opt.key}
                      onClick={() => setData(prev => ({ ...prev, test_date_type: opt.key, test_date: null }))}
                    >
                      {opt.label}
                    </OptionButton>
                  ))}
                </div>
              </div>
            </div>
          </StepContainer>
        );

      // ═══ Q3: Previous Scores ═══
      case 'q3':
        return (
          <StepContainer title="Have you taken IELTS before?" icon={<Award className="w-6 h-6" />}>
            <div className="space-y-3">
              <OptionButton
                selected={data.has_previous_scores === true}
                onClick={() => setData(prev => ({
                  ...prev,
                  has_previous_scores: true,
                  previous_scores: prev.previous_scores || { L: 5.5, R: 5.5, W: 5.0 },
                }))}
              >
                Yes, I have my scores
              </OptionButton>
              {data.has_previous_scores === true && data.previous_scores && (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <BandSelect label="Listening" value={data.previous_scores.L} onChange={v => setData(prev => ({ ...prev, previous_scores: { ...prev.previous_scores!, L: v } }))} />
                  <BandSelect label="Reading" value={data.previous_scores.R} onChange={v => setData(prev => ({ ...prev, previous_scores: { ...prev.previous_scores!, R: v } }))} />
                  <BandSelect label="Writing" value={data.previous_scores.W} onChange={v => setData(prev => ({ ...prev, previous_scores: { ...prev.previous_scores!, W: v } }))} />
                </div>
              )}
              <OptionButton
                selected={data.has_previous_scores === false}
                onClick={() => setData(prev => ({ ...prev, has_previous_scores: false, previous_scores: null }))}
              >
                No, first time
              </OptionButton>
            </div>
          </StepContainer>
        );

      // ═══ Q4: Self Assessment (only if no previous scores) ═══
      case 'q4':
        return (
          <StepContainer title="How would you describe your English level?" icon={<GraduationCap className="w-6 h-6" />} subtitle="We'll use this to estimate your starting point">
            <div className="space-y-3">
              {([
                { level: 'A2' as const, label: 'Elementary (A2)', desc: 'I can handle simple everyday conversations and read short texts.' },
                { level: 'B1' as const, label: 'Intermediate (B1)', desc: 'I can understand main points of clear speech and write simple connected text.' },
                { level: 'B2' as const, label: 'Upper Intermediate (B2)', desc: 'I can understand complex texts and interact with fluency.' },
                { level: 'C1' as const, label: 'Advanced (C1)', desc: 'I can understand demanding texts and express ideas fluently.' },
              ]).map(opt => (
                <button
                  key={opt.level}
                  type="button"
                  onClick={() => setData(prev => ({ ...prev, self_assessment_level: opt.level }))}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all outline-none ${
                    data.self_assessment_level === opt.level
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold text-[15px] ${data.self_assessment_level === opt.level ? 'text-blue-900 dark:text-blue-100' : 'text-slate-800 dark:text-slate-200'}`}>
                      {opt.label}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      data.self_assessment_level === opt.level ? 'border-blue-600 bg-blue-600' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {data.self_assessment_level === opt.level && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </StepContainer>
        );

      // ═══ Q4_STRATEGY: Strategy Options ═══
      case 'q4_strategy':
        // Lazy fetch using useEffect equivalent inline logic via render block:
        // (React 18 safe: we use a protective state check to avoid loops)
        if (!data.strategy_options && data.target_overall && data.current_scores) {
          fetch('http://localhost:8002/api/onboarding/strategy-options', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              target_overall: data.target_overall,
              current_scores: data.current_scores,
              weeks_available: data.weeks_available || calcWeeksAvailable(data)
            })
          }).then(res => res.json()).then(opts => {
            setData(prev => ({ ...prev, strategy_options: opts }));
          }).catch(err => console.error("Strategy options fetch err", err));
        }

        return (
          <StepContainer title="How do you want to reach your Target Band?" icon={<Target className="w-6 h-6" />} subtitle={`Based on your current scores, here are the fastest paths to reach ${data.target_overall?.toFixed(1)}:`}>
            {!data.strategy_options ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-sm font-medium text-slate-500">Calculating optimal paths...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.strategy_options.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setData(prev => ({ ...prev, strategy_preference: opt.id }))}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all outline-none ${
                      data.strategy_preference === opt.id
                        ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className={`font-bold text-[16px] flex items-center gap-2 ${data.strategy_preference === opt.id ? 'text-blue-900 dark:text-blue-100' : 'text-slate-800 dark:text-slate-200'}`}>
                          {opt.title}
                          {opt.id === 'compensatory' && <Sparkles className="w-4 h-4 text-emerald-500" />}
                        </span>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{opt.description}</p>
                      </div>
                      <div className={`w-5 h-5 mt-1 shrink-0 rounded-full border-2 flex items-center justify-center ${
                        data.strategy_preference === opt.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {data.strategy_preference === opt.id && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 flex gap-4">
                      <div className="flex-1 bg-white/50 dark:bg-slate-900/50 rounded-lg p-3 text-center border border-slate-100 dark:border-slate-700">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target List.</span>
                        <span className="text-lg font-black text-slate-800 dark:text-white">{opt.targets.L.toFixed(1)}</span>
                      </div>
                      <div className="flex-1 bg-white/50 dark:bg-slate-900/50 rounded-lg p-3 text-center border border-slate-100 dark:border-slate-700">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Read.</span>
                        <span className="text-lg font-black text-slate-800 dark:text-white">{opt.targets.R.toFixed(1)}</span>
                      </div>
                      <div className="flex-1 bg-white/50 dark:bg-slate-900/50 rounded-lg p-3 text-center border border-slate-100 dark:border-slate-700">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Writ.</span>
                        <span className="text-lg font-black text-slate-800 dark:text-white">{opt.targets.W.toFixed(1)}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </StepContainer>
        );

      // ═══ Q5: Section Minimums ═══
      case 'q5':
        return (
          <StepContainer title="Do you need a minimum score in each section?" icon={<Target className="w-6 h-6" />} subtitle="Many universities require a minimum band in EACH section (e.g., 'no section below 6.0')">
            <div className="space-y-3">
              <OptionButton
                selected={data.minimums_answer === 'yes'}
                onClick={() => setData(prev => ({ ...prev, minimums_answer: 'yes', has_minimums: true }))}
              >
                Yes, I have minimum requirements
              </OptionButton>
              <OptionButton
                selected={data.minimums_answer === 'no'}
                onClick={() => setData(prev => ({ ...prev, minimums_answer: 'no', has_minimums: false, min_sections: null }))}
              >
                No, I only need an overall band
              </OptionButton>
              <OptionButton
                selected={data.minimums_answer === 'not_sure'}
                onClick={() => setData(prev => ({ ...prev, minimums_answer: 'not_sure' }))}
              >
                I'm not sure
              </OptionButton>
            </div>
          </StepContainer>
        );

      // ═══ Q5a: Enter minimums ═══
      case 'q5a':
        return (
          <StepContainer title="Enter your minimum requirements" icon={<Target className="w-6 h-6" />}>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
              {(() => {
                const mins = data.min_sections || { L: 6.0, R: 6.0, W: 6.0 };
                if (!data.min_sections) {
                  setTimeout(() => setData(prev => ({ ...prev, min_sections: { L: 6.0, R: 6.0, W: 6.0 } })), 0);
                }
                return (
                  <>
                    <BandSelect label="Listening" value={mins.L} onChange={v => setData(prev => ({ ...prev, min_sections: { ...(prev.min_sections || { L: 6, R: 6, W: 6 }), L: v } }))} />
                    <BandSelect label="Reading" value={mins.R} onChange={v => setData(prev => ({ ...prev, min_sections: { ...(prev.min_sections || { L: 6, R: 6, W: 6 }), R: v } }))} />
                    <BandSelect label="Writing" value={mins.W} onChange={v => setData(prev => ({ ...prev, min_sections: { ...(prev.min_sections || { L: 6, R: 6, W: 6 }), W: v } }))} />
                  </>
                );
              })()}
            </div>
          </StepContainer>
        );

      // ═══ Q5b: University search ═══
      case 'q5b':
        return (
          <StepContainer title="Which university are you applying to?" icon={<GraduationCap className="w-6 h-6" />} subtitle="We'll try to find the requirements for you">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={universitySearch}
                  onChange={e => setUniversitySearch(e.target.value)}
                  placeholder="Search university..."
                  className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors placeholder:text-slate-400"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 pl-1">Popular</p>
                <div className="space-y-2">
                  {POPULAR_UNIVERSITIES
                    .filter(u => !universitySearch || u.toLowerCase().includes(universitySearch.toLowerCase()))
                    .map(uni => (
                      <OptionButton
                        key={uni}
                        selected={data.university_name === uni}
                        onClick={() => setData(prev => ({ ...prev, university_name: uni }))}
                      >
                        {uni}
                      </OptionButton>
                    ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setData(prev => ({ ...prev, university_name: null }))}
                className="w-full text-center py-3 text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                Skip — I'll check later
              </button>
            </div>
          </StepContainer>
        );

      // ═══ Q6: Weakest Skill ═══
      case 'q6':
        return (
          <StepContainer title="Which skill do you find hardest?" icon={<BookOpen className="w-6 h-6" />}>
            <div className="space-y-3">
              {([
                { key: 'listening' as const, icon: <Headphones className="w-5 h-5" />, label: 'Listening' },
                { key: 'reading' as const, icon: <BookOpen className="w-5 h-5" />, label: 'Reading' },
                { key: 'writing' as const, icon: <PenTool className="w-5 h-5" />, label: 'Writing' },
              ]).map(skill => (
                <button
                  key={skill.key}
                  type="button"
                  onClick={() => setData(prev => ({ ...prev, weakest_skill: skill.key, specific_challenges: [] }))}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all outline-none flex items-center gap-4 ${
                    data.weakest_skill === skill.key
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    data.weakest_skill === skill.key ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {skill.icon}
                  </div>
                  <span className={`font-semibold text-[15px] ${data.weakest_skill === skill.key ? 'text-blue-900 dark:text-blue-100' : 'text-slate-700 dark:text-slate-300'}`}>
                    {skill.label}
                  </span>
                </button>
              ))}
            </div>
          </StepContainer>
        );

      // ═══ Q7: Specific Challenges ═══
      case 'q7':
        return (
          <StepContainer
            title={`What's your biggest challenge with ${data.weakest_skill ? data.weakest_skill.charAt(0).toUpperCase() + data.weakest_skill.slice(1) : ''}?`}
            subtitle="Select up to 3"
            icon={<BookOpen className="w-6 h-6" />}
          >
            <div className="flex flex-wrap gap-3">
              {(CHALLENGES_BY_SKILL[data.weakest_skill || 'writing'] || []).map(challenge => {
                const isSelected = data.specific_challenges.includes(challenge);
                return (
                  <ChipButton
                    key={challenge}
                    selected={isSelected}
                    onClick={() => {
                      setData(prev => {
                        const challenges = [...prev.specific_challenges];
                        if (isSelected) {
                          return { ...prev, specific_challenges: challenges.filter(c => c !== challenge) };
                        }
                        if (challenges.length >= 3) return prev;
                        return { ...prev, specific_challenges: [...challenges, challenge] };
                      });
                    }}
                  >
                    {challenge}
                  </ChipButton>
                );
              })}
            </div>

            <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Or describe your challenge:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your own struggle here..."
                  id="custom-challenge-input"
                  className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget;
                      const val = input.value.trim();
                      if (val && data.specific_challenges.length < 3 && !data.specific_challenges.includes(val)) {
                        setData(prev => ({ ...prev, specific_challenges: [...prev.specific_challenges, val] }));
                        input.value = '';
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('custom-challenge-input') as HTMLInputElement;
                    const val = input?.value.trim();
                    if (val && data.specific_challenges.length < 3 && !data.specific_challenges.includes(val)) {
                      setData(prev => ({ ...prev, specific_challenges: [...prev.specific_challenges, val] }));
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors shrink-0"
                >
                  Add
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 font-medium">
              {data.specific_challenges.length}/3 selected {data.specific_challenges.length >= 3 && '(maximum reached)'}
            </p>
          </StepContainer>
        );

      // ═══ Q8: Daily Minutes ═══
      case 'q8':
        return (
          <StepContainer title="How much time can you study per day?" icon={<Clock className="w-6 h-6" />}>
            <div className="space-y-3">
              {DAILY_MINUTES_OPTIONS.map(opt => (
                <OptionButton
                  key={opt.value}
                  selected={data.daily_minutes === opt.value}
                  onClick={() => setData(prev => ({ ...prev, daily_minutes: opt.value }))}
                  tag={opt.tag || undefined}
                >
                  {opt.label}
                </OptionButton>
              ))}
            </div>
          </StepContainer>
        );

      // ═══ Q9: Days per Week ═══
      case 'q9':
        return (
          <StepContainer title="How many days per week can you study?" icon={<Calendar className="w-6 h-6" />}>
            <div className="space-y-3">
              {DAYS_PER_WEEK_OPTIONS.map(d => (
                <OptionButton
                  key={d}
                  selected={data.days_per_week === d}
                  onClick={() => setData(prev => ({ ...prev, days_per_week: d }))}
                  tag={d === 5 ? 'recommended' : undefined}
                >
                  {d} days
                </OptionButton>
              ))}
            </div>
          </StepContainer>
        );



      // ═══ Summary ═══
      case 'summary':
        return (
          <div className="w-full max-w-xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">Your Study Profile</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Review your information before we build your plan</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm divide-y divide-slate-100 dark:divide-slate-700/50 overflow-hidden">
              <SummaryRow label="Target Band" value={data.target_overall?.toFixed(1) || '—'} />
              <SummaryRow label="Test Date" value={data.test_date || (data.test_date_type === 'flexible' ? 'Flexible' : `~${data.weeks_available || calcWeeksAvailable(data)} weeks`)} />
              <SummaryRow label="Current Level" value={
                data.current_scores
                  ? `L:${data.current_scores.L} R:${data.current_scores.R} W:${data.current_scores.W}`
                  : data.self_assessment_level || '—'
              } />
              {data.has_minimums && data.min_sections && (
                <SummaryRow label="Minimums" value={`L:${data.min_sections.L} R:${data.min_sections.R} W:${data.min_sections.W}`} />
              )}
              {data.university_name && <SummaryRow label="University" value={data.university_name} />}
              <SummaryRow label="Weakest Skill" value={data.weakest_skill ? data.weakest_skill.charAt(0).toUpperCase() + data.weakest_skill.slice(1) : '—'} />
              <SummaryRow label="Challenges" value={data.specific_challenges.join(', ') || '—'} />
              <SummaryRow label="Daily Study" value={`${data.daily_minutes} min × ${data.days_per_week} days`} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Main Layout ────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
            {currentStep === 'summary' ? 'Review' : `Step ${currentStepIdx + 1} of ${totalSteps - 1}`}
          </span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1 bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-8 lg:py-12 overflow-y-auto">
        {renderStep()}
      </div>

      {/* Navigation Footer */}
      <div className="sticky bottom-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 py-4 px-6">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStepIdx === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
              currentStepIdx === 0
                ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {currentStep === 'summary' ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 max-w-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Building your plan...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Build My Plan</>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext()}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                canGoNext()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-[0.98]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Summary Row ──────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between px-5 py-4 gap-4">
      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 shrink-0">{label}</span>
      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 text-right">{value}</span>
    </div>
  );
}
