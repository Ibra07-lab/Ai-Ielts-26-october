import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';
import { calculateProbability } from '../utils/probabilityCalculator';
import {
  ChevronRight, ChevronLeft, Target, CalendarDays, Award,
  BookOpen, GraduationCap, Clock, Calendar,
  CheckCircle2, Headphones, PenTool, Search, Speech,
  Sparkles, Loader2
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SkillScores {
  L: number;
  R: number;
  W: number;
  S?: number; // Added Speaking
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
  test_date_type: 'exact' | 'within_2' | 'within_3' | 'within_4' | null;
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
  calculated_targets?: { L: number; R: number; W: number; S: number } | null;
}

const SELF_ASSESSMENT_SCORES: Record<string, SkillScores> = {
  A2: { L: 4.0, R: 4.0, W: 4.0 },
  B1: { L: 5.0, R: 5.0, W: 4.5 },
  B2: { L: 5.5, R: 6.0, W: 5.5 },
  C1: { L: 7.0, R: 7.0, W: 6.5 },
};

const BAND_OPTIONS = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];
const TARGET_BAND_OPTIONS = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];
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
  const MAX_PLAN_WEEKS = 10;
  if (data.test_date_type === 'exact' && data.test_date) {
    const diff = new Date(data.test_date).getTime() - Date.now();
    return Math.min(MAX_PLAN_WEEKS, Math.max(1, Math.floor(diff / (7 * 24 * 60 * 60 * 1000))));
  }
  switch (data.test_date_type) {
    case 'within_2': return 8;
    case 'within_3': return 10;
    case 'within_4': return 10; // capped at 10
    default: return 10;
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
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${selected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>{tag}</span>
          )}
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? 'border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500' : 'border-slate-300 dark:border-slate-600'
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
    calculated_targets: null,
  });

  // Calculate actual IELTS overall band
  const calculateOverallBand = (scores: { L: number; R: number; W: number; S: number }) => {
    const sum = scores.L + scores.R + scores.W + scores.S;
    const avg = sum / 4;
    const remainder = avg % 1;
    if (remainder >= 0.75) return Math.floor(avg) + 1.0;
    if (remainder >= 0.25) return Math.floor(avg) + 0.5;
    return Math.floor(avg);
  };

  // Step management: compute visible steps based on answers
  const stepKeys = useMemo(() => {
    const steps: string[] = ['q1', 'q2', 'q3_current_scores', 'q4_calculator'];
    steps.push('q6', 'q8', 'q9', 'summary');
    return steps;
  }, []);

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
      case 'q3_current_scores': return data.current_scores !== null;
      case 'q4_calculator':
        return !!data.calculated_targets &&
          data.target_overall !== null &&
          calculateOverallBand(data.calculated_targets) >= data.target_overall;
      case 'q6': return data.weakest_skill !== null;
      case 'q8': return data.daily_minutes !== null;
      case 'q9': return data.days_per_week !== null;
      case 'summary': return true;
      default: return false;
    }
  };

  const goNext = () => {
    // Derive values before advancing
    if (currentStep === 'q2') {
      setData(prev => ({
        ...prev,
        weeks_available: calcWeeksAvailable(prev),
        // Pre-populate current_scores with B2 defaults so q3 has values ready
        current_scores: prev.current_scores || { L: 5.5, R: 5.5, W: 5.5, S: 5.5 }
      }));
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
      current_scores: {
        L: data.current_scores?.L ?? 5.5,
        R: data.current_scores?.R ?? 5.5,
        W: data.current_scores?.W ?? 5.5,
      },
      has_minimums: false,
      min_sections: null,
      university_name: null,
      weakest_skill: data.weakest_skill,
      specific_challenges: [],
      daily_minutes: data.daily_minutes,
      days_per_week: data.days_per_week,
      weekly_minutes: (data.daily_minutes || 0) * (data.days_per_week || 0),
      strategy_preference: data.strategy_preference || 'custom',
      calculated_targets: data.calculated_targets,
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
          current_scores: {
            L: data.current_scores?.L ?? 5.5,
            R: data.current_scores?.R ?? 5.5,
            W: data.current_scores?.W ?? 5.5,
          },
          has_minimums: false,
          min_sections: null,
          university_name: null,
          weakest_skill: data.weakest_skill,
          specific_challenges: [],
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

        const API_BASE = import.meta.env.VITE_FASTAPI_WRITING_URL || "";
        const res = await fetch(`${API_BASE}/api/onboarding/generate`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => 'Unknown error');
          console.error('Roadmap generation failed:', res.status, errText);
          throw new Error(`Roadmap generation failed: ${res.status}`);
        }

        // Update auth metadata to clear the onboarding gate + save target band
        await supabase.auth.updateUser({
          data: { onboardingCompleted: true, targetBand: data.target_overall }
        });
      }

      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/plan');
        // Force reload so ProtectedRoute and UserProvider sync immediately if context is stale
        window.location.reload();
      }, 2500);
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

                <div className="space-y-3">
                  {([
                    { key: 'within_2' as const, label: 'Within 2 months' },
                    { key: 'within_3' as const, label: 'Within 3 months' },
                    { key: 'within_4' as const, label: 'Within 4 months' },
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

              {/* Honest note about plan limits */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  We currently support study plans up to <span className="font-bold text-slate-800 dark:text-slate-200">10 weeks</span>.
                  We are adding new materials every week.
                </p>
              </div>
            </div>
          </StepContainer>
        );

      // ═══ Q3: Current Scores ═══
      case 'q3_current_scores': {
        const currentScores = data.current_scores || { L: 5.5, R: 5.5, W: 5.5, S: 5.5 };
        const updateCurrent = (skill: keyof SkillScores, val: number) => {
          setData(prev => ({
            ...prev,
            current_scores: { ...currentScores, [skill]: val }
          }));
        };

        return (
          <StepContainer 
            title="What are your current scores?" 
            subtitle="Select your current or estimated band scores for each section."
            icon={<Target className="w-6 h-6" />}
          >
            <div className="space-y-4 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <BandSelect label="Listening" value={currentScores.L} onChange={v => updateCurrent('L', v)} />
              <BandSelect label="Reading" value={currentScores.R} onChange={v => updateCurrent('R', v)} />
              <BandSelect label="Writing" value={currentScores.W} onChange={v => updateCurrent('W', v)} />
              <BandSelect label="Speaking" value={currentScores.S || 5.5} onChange={v => updateCurrent('S', v)} />
            </div>
          </StepContainer>
        );
      }

      // ═══ Q4_CALCULATOR: Interactive Path Builder ═══
      case 'q4_calculator': {
        const startScores = data.current_scores || { L: 5.5, R: 5.5, W: 5.5, S: 5.5 };
        const targetOverall = data.target_overall || 7.0;

        // Initialize sliders on first mount of this step
        if (!data.calculated_targets) {
          setTimeout(() => setData(prev => ({ ...prev, calculated_targets: { ...startScores, S: startScores.S || 5.5 } })), 0);
          return null; // wait for next tick
        }

        const currentT = data.calculated_targets;
        const sum = currentT.L + currentT.R + currentT.W + currentT.S;
        const currentOverallResult = calculateOverallBand(currentT);
        const reached = currentOverallResult >= targetOverall;

        // Target * 4 is approximate strict sum needed before rounding kicks in. 
        // e.g., for 7.5, need sum >= 29 (29/4 = 7.25 -> 7.5).
        // Let's dynamically calculate how much sum is needed practically based on the current sliders.
        let neededSum = targetOverall * 4;
        if (targetOverall % 1 === 0.5) neededSum -= 1; // e.g. 7.5 requires sum 29 (29/4=7.25 -> 7.5)
        else if (targetOverall % 1 === 0) neededSum -= 1; // e.g. 7.0 requires sum 27 (27/4=6.75 -> 7.0)

        const gapPoints = Math.max(0, neededSum - sum);
        const startSum = startScores.L + startScores.R + startScores.W + (startScores.S || 5.5);
        const totalPointsToGrow = Math.max(0, sum - startSum);
        // Estimate approx 1 month per 2 total points of growth across all skills (0.5 gap average)
        const estMonths = Math.max(1, Math.round(totalPointsToGrow / 2));

        const updateTarget = (skill: 'L' | 'R' | 'W' | 'S', val: number) => {
          setData(prev => ({
            ...prev,
            calculated_targets: { ...prev.calculated_targets!, [skill]: val }
          }));
        };

        const renderSlider = (label: string, skill: 'L' | 'R' | 'W' | 'S', currentVal: number) => {
          const val = currentT[skill];
          return (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-700 dark:text-slate-300 w-20">{label}</span>
                <span className="font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full">{val.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={1.0} // IELTS scores start at 1.0
                max={9.0}
                step={0.5}
                value={val}
                onChange={e => {
                  const newVal = parseFloat(e.target.value);
                  updateTarget(skill, newVal);
                }}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Baseline: {currentVal.toFixed(1)}</span>
                <span>Max: 9.0</span>
              </div>
            </div>
          );
        };

        return (
          <StepContainer title={`Build your path to ${targetOverall.toFixed(1)}`} icon={<Target className="w-6 h-6" />}>
            <div className="space-y-8 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">

              {renderSlider('Listening', 'L', startScores.L)}
              {renderSlider('Reading', 'R', startScores.R)}
              {renderSlider('Writing', 'W', startScores.W)}
              {renderSlider('Speaking', 'S', startScores.S || 5.5)}

              {/* Status Box */}
              <div className={`p-5 rounded-2xl border-2 transition-colors ${reached
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50'
                  : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Current Setup:</span>
                  {reached ? (
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Target reached!</span>
                  ) : (
                    <span className="text-sm font-bold text-rose-500">{gapPoints.toFixed(1)} more points needed</span>
                  )}
                </div>

                <div className="flex items-end gap-3 mb-1">
                  <span className={`text-4xl font-black ${reached ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>
                    {currentOverallResult.toFixed(1)}
                  </span>
                  <span className="text-sm font-semibold text-slate-400 pb-1">Overall Band</span>
                </div>

                <div className="text-sm font-medium text-slate-500 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50 flex justify-between">
                  <span>Total sum: {sum.toFixed(1)}</span>
                </div>
              </div>


            </div>
          </StepContainer>
        );
      }


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
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all outline-none flex items-center gap-4 ${data.weakest_skill === skill.key
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${data.weakest_skill === skill.key ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
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



      // ═══ Summary / Trust Screen ═══
      case 'summary': {
        // Calculate metrics for the trust screen
        const startBand = data.current_scores
          ? (data.current_scores.L + data.current_scores.R + data.current_scores.W) / 3
          : data.self_assessment_level === 'A2' ? 4.0
            : data.self_assessment_level === 'B1' ? 5.0
              : data.self_assessment_level === 'B2' ? 6.0
                : data.self_assessment_level === 'C1' ? 7.0
                  : 5.5; // default fallback

        const targetBand = data.target_overall || 7.0;
        const gap = Math.max(0, targetBand - startBand);

        const weeks = data.weeks_available || calcWeeksAvailable(data);
        const months = Math.max(1, Math.round(weeks / 4));

        const dailyHours = (data.daily_minutes || 60) / 60;
        const dailyStr = dailyHours % 1 === 0 ? `${dailyHours} hour${dailyHours > 1 ? 's' : ''}` : `${dailyHours.toFixed(1)} hours`;

        // Generate dynamic title based on slider choices
        let strategyTitle = "Balanced Specialist";
        if (data.calculated_targets) {
          const t = data.calculated_targets;
          if (t.R > t.W && t.L > t.W) strategyTitle = "Compensatory (Weak Writing)";
          if (t.W >= 7.0 && t.W > t.R) strategyTitle = "Writing Focused";
          if (t.S > t.W && t.L > t.R) strategyTitle = "Communicator (Speaking/Listening priority)";
        }

        return (
          <div className="w-full max-w-xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">Based on your answers, here is your situation:</h2>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 overflow-hidden space-y-4 text-base font-semibold text-slate-800 dark:text-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Current estimated band:</span>
                <span>~{startBand.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Target band:</span>
                <span>{targetBand.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Gap to close:</span>
                <span>{gap.toFixed(1)} bands</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Time available:</span>
                <span>{months} month{months > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Daily study:</span>
                <span>{dailyStr}</span>
              </div>

              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 pt-2 font-bold text-lg">
                <CheckCircle2 className="w-6 h-6" />
                This is achievable.
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  Your Smart Strategy
                </h3>
              </div>

              <div className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-transparent flex items-center justify-between">
                  <div className="text-lg font-black text-blue-700 dark:text-blue-400 tracking-tight">
                    {strategyTitle}
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {data.calculated_targets && (
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Calculated Target Map</p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: 'L', icon: <Headphones className="w-4 h-4" />, score: data.calculated_targets.L, color: 'text-emerald-500' },
                          { label: 'R', icon: <BookOpen className="w-4 h-4" />, score: data.calculated_targets.R, color: 'text-indigo-500' },
                          { label: 'W', icon: <PenTool className="w-4 h-4" />, score: data.calculated_targets.W, color: 'text-amber-500' },
                          { label: 'S', icon: <Speech className="w-4 h-4" />, score: data.calculated_targets.S || '-', color: 'text-rose-500' },
                        ].map((skill) => (
                          <div key={skill.label} className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2 transition-transform hover:scale-[1.02]">
                            <div className={`${skill.color} opacity-80`}>{skill.icon}</div>
                            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">{skill.label}</div>
                            <div className="text-xl font-black text-slate-900 dark:text-white">
                              {typeof skill.score === 'number' ? skill.score.toFixed(1) : skill.score}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  // ─── Main Layout ────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Full-screen Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-2 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-blue-500/30">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Building Your Plan...</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Analyzing your diagnostic data and generating a custom day-by-day roadmap.
              </p>
            </div>

            {/* Steps simulation */}
            <div className="w-full space-y-4 mt-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-left">
              <div className="flex items-center gap-3 text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Processing diagnostic data...
              </div>
              <div className="flex items-center gap-3 text-[13px] font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                Optimizing strategy engine...
              </div>
              <div className="flex items-center gap-3 text-[13px] font-bold text-slate-400 dark:text-slate-500">
                <div className="w-4 h-4 shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-700" />
                Generating daily tasks...
              </div>
            </div>
          </div>
        </div>
      )}

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
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${currentStepIdx === 0
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
                <>Start My Plan <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext()}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${canGoNext()
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
