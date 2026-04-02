// WritingSessionGuide.tsx
import { useState } from "react";
import { Clock, ChevronDown, ChevronUp, Play } from "lucide-react";

interface Step {
  step_number: number;
  icon: string;
  name: string;
  duration_minutes: number;
  what: string;
  why: string;
}

type TaskType = "task1" | "task2";

const TASK1_STEPS: Step[] = [
  {
    step_number: 1,
    icon: "✍️",
    name: "Write Your Response",
    duration_minutes: 20,
    what:
      "Write your Task 1 response under strict 20-minute conditions. Do not edit as you write — finish the full response first.",
    why: "Task 1 is worth one third of your writing score but students often spend too long on it. Training yourself to finish in 20 minutes is a skill in itself. Editing while writing breaks your flow and wastes time you do not have.",
  },
  {
    step_number: 2,
    icon: "📊",
    name: "Read Your Scores",
    duration_minutes: 5,
    what:
      "Read your overall band and the four criterion scores — Task Achievement, Coherence, Lexical Resource, and Grammar. Note your lowest score.",
    why: "Your four scores tell you exactly where points are being lost. Students who only look at the overall band miss the pattern. If your Lexical Resource is always your lowest score, that is where your time should go — not random practice.",
  },
  {
    step_number: 3,
    icon: "🔍",
    name: "Study Your Strengths and Priorities",
    duration_minutes: 10,
    what:
      "Read the identified strength in your feedback — your superpower. Then read your number one priority for improvement. These two things together tell you what to protect and what to fix.",
    why: "Most students focus only on what they did wrong. Knowing what you did right is equally important — it tells you what not to change. Your superpower is a habit worth keeping. Your priority is the one thing that will move your score fastest.",
  },
  {
    step_number: 4,
    icon: "📈",
    name: "Analyse Visual Coverage",
    duration_minutes: 10,
    what:
      "Read the feature coverage section. Check which key features of the chart you covered and which you missed. Read the data accuracy breakdown and the overview quality assessment.",
    why: "Task Achievement is the most common reason students get stuck below Band 6. Examiners expect you to cover the main features — not every data point. Understanding exactly what you missed trains you to spot what matters in any chart.",
  },
  {
    step_number: 5,
    icon: "⚡",
    name: "Study the Band Upgrades",
    duration_minutes: 15,
    what:
      "For each criterion, read the Band 6 version versus the Band 7 rewrite shown in your feedback. Read the explanation of why the rewrite is better. Then read the full Band 7 paragraph upgrade of your own writing.",
    why: "Seeing the difference between Band 6 and Band 7 in your own sentences is more valuable than any textbook example. The upgrade shows you the exact gap between where you are and where you need to be — in your own words, not a model answer.",
  },
  {
    step_number: 6,
    icon: "📝",
    name: "Vocabulary and Grammar Upgrades",
    duration_minutes: 10,
    what:
      "Read the vocabulary upgrade list. For every basic word flagged, write down the academic alternative. Read the grammar section and note the tense, passive voice, and article errors identified.",
    why: "Lexical Resource and Grammar together make up half your writing score. The upgrades in your feedback are not generic — they come from your actual essay. Learning the academic version of words you already used is the fastest vocabulary improvement possible.",
  },
  {
    step_number: 7,
    icon: "✅",
    name: "Complete Your Micro-Tasks",
    duration_minutes: 20,
    what:
      "Do the micro-tasks generated for your weakest criterion. Each task takes 5 to 20 minutes. Do at least one fully before moving on.",
    why: "Reading feedback without practising the fix does not improve your score. The micro-tasks are designed specifically for your errors. Doing one focused exercise on your weakness is worth more than writing three new essays without changing anything.",
  },
  {
    step_number: 8,
    icon: "🗓️",
    name: "Follow Your 3-Day Plan",
    duration_minutes: 5,
    what:
      "Read the customised 3-day practice schedule. Write it down or save it. Use the pre-writing checklist before your next Task 1 attempt.",
    why: "Improvement happens between sessions, not just during them. The 3-day plan tells you exactly what to practise on each day so you do not have to decide — you just do it. The pre-writing checklist prevents you from repeating the same mistakes before you even start writing.",
  },
];

const TASK2_STEPS: Step[] = [
  {
    step_number: 1,
    icon: "✍️",
    name: "Write Your Essay",
    duration_minutes: 40,
    what:
      "Write your full Task 2 essay under 40-minute conditions. Use the recommended time split — roughly 10 minutes planning, 28 minutes writing, 2 minutes reviewing.",
    why: "Task 2 is worth two thirds of your writing score. The time split is not optional — students who skip planning write off-topic. Students who skip reviewing lose easy grammar points. Training all three phases together is what exam conditions require.",
  },
  {
    step_number: 2,
    icon: "🎯",
    name: "Read Your Diagnosis",
    duration_minutes: 10,
    what:
      "Read the root cause analysis. Understand what fundamental issue is capping your score — whether that is a logic gap, template dependency, cohesion overuse, or prompt misreading. Read the score reality check and the next-essay projection.",
    why: "Most students think they have many problems. Your feedback identifies one root cause — the single issue that blocks everything else. Fixing that one thing unlocks more score improvement than fixing ten surface errors. Read this section slowly.",
  },
  {
    step_number: 3,
    icon: "🚫",
    name: "Study Your One Big Change",
    duration_minutes: 10,
    what:
      "Read the one big change instruction. Write down exactly what you need to stop doing and what you need to start doing. Write the sticky note mantra somewhere visible.",
    why: "Coaching research shows that one focused behavioural change outperforms ten simultaneous corrections. Your brain cannot track ten new rules while writing under pressure. One change is trackable, testable, and achievable before your next essay.",
  },
  {
    step_number: 4,
    icon: "⛔",
    name: "Read Your Banned and Required List",
    duration_minutes: 5,
    what:
      "Read the banned list — words, phrases, and structures you must not use in your next essay. Read the required list — techniques you must include. Write both lists on paper before your next attempt.",
    why: "Banning a phrase forces your brain to find a better one. This is not punishment — it is the fastest way to break a habit. Students who use banned phrases train weaknesses. Students who follow required techniques train strengths. The constraint is the tool.",
  },
  {
    step_number: 5,
    icon: "⚡",
    name: "Do the Micro-Drill",
    duration_minutes: 15,
    what:
      "Complete the customised micro-drill in your feedback. Set a timer. Follow the step-by-step instructions. Check your output against the success criteria provided.",
    why: "The drill targets your exact root cause — not a generic exercise. If your root cause is logic gaps, the drill forces you to build arguments under constraint. If it is template dependency, the drill bans your template entirely. Five focused minutes on the right drill beats an hour of unfocused writing.",
  },
  {
    step_number: 6,
    icon: "🗺️",
    name: "Read Your Next Essay Flight Plan",
    duration_minutes: 5,
    what:
      "Read the recommended prompt for your next practice essay. Note the custom constraints you must follow. Save the time allocation breakdown.",
    why: "Your next essay is already planned. The prompt is chosen to target your weakness. The constraints force you to apply your one big change. Following the flight plan means your next session starts with purpose — not a blank page.",
  },
  {
    step_number: 7,
    icon: "📚",
    name: "Note the Ignored Issues",
    duration_minutes: 5,
    what:
      "Read the intentionally ignored issues section. These are mistakes your coach noticed but chose not to address today. Make a note of them for a future session.",
    why: "Your coach ignored these issues on purpose. Fixing everything at once is overwhelming and ineffective. Knowing these issues exist — and knowing when to come back to them — is part of the plan. Trust the process and focus on the one big change first.",
  },
];

interface WritingSessionGuideProps {
  onStart: () => void;
  taskType: TaskType;
  taskTitle?: string;
  steps?: Step[];
}

export default function WritingSessionGuide({
  onStart,
  taskType,
  taskTitle,
  steps,
}: WritingSessionGuideProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const defaultSteps = taskType === "task1" ? TASK1_STEPS : TASK2_STEPS;
  const displaySteps = steps && steps.length > 0 ? steps : defaultSteps;

  // Separate writing time (step 1) from review/study time
  const writingStep = displaySteps[0];
  const reviewSteps = displaySteps.slice(1);
  const writingMinutes = writingStep.duration_minutes;
  const reviewMinutes = reviewSteps.reduce((sum, s) => sum + s.duration_minutes, 0);
  const totalMinutes = writingMinutes + reviewMinutes;

  const toggleStep = (step: number) => {
    setExpandedStep(expandedStep === step ? null : step);
  };

  const taskLabel = taskType === "task1" ? "Writing Task 1" : "Writing Task 2";
  const taskDescription =
    taskType === "task1"
      ? "Data report · 20 minutes · 150 words minimum"
      : "Essay · 40 minutes · 250 words minimum";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">
            {taskLabel}
          </p>
          <h1 className="text-2xl font-bold text-white mb-1">
            {taskTitle ?? "Today's Session"}
          </h1>
          <p className="text-gray-600 text-xs mt-1">{taskDescription}</p>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mt-3">
            <Clock size={14} />
            <span className="flex items-center gap-1.5">
              <span>✍️ {writingMinutes} min writing</span>
              <span className="text-gray-600">+</span>
              <span>📋 {reviewMinutes} min review</span>
              <span className="text-gray-600">=</span>
              <span className="text-white font-medium">{totalMinutes} min total</span>
            </span>
          </div>
        </div>

        {/* What this session covers */}
        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {displaySteps.map((s) => (
            <span
              key={s.step_number}
              className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full"
            >
              {s.icon} {s.name}
            </span>
          ))}
        </div>

        {/* Task 2 coaching note */}
        {taskType === "task2" && (
          <div className="mb-6 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
              Coaching philosophy
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your Task 2 coach focuses on{" "}
              <span className="text-white font-medium">one root cause</span> per
              session — not every mistake. This is intentional. One focused
              change improves your score faster than ten corrections at once.
            </p>
          </div>
        )}

        {/* Task 1 coaching note */}
        {taskType === "task1" && (
          <div className="mb-6 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
              How feedback works
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your Task 1 feedback breaks down every criterion with{" "}
              <span className="text-white font-medium">
                band upgrades from your own writing
              </span>
              . Every example comes from your essay — not a model answer.
            </p>
          </div>
        )}

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {displaySteps.map((s) => {
            const isExpanded = expandedStep === s.step_number;

            return (
              <div
                key={s.step_number}
                className="bg-[#13131a] border border-white/5 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleStep(s.step_number)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-gray-600 uppercase tracking-wider mb-0.5">
                        Step {s.step_number}
                      </span>
                      <span className="text-xl">{s.icon}</span>
                    </div>

                    <div>
                      <p className="font-semibold text-white text-sm">
                        {s.name}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">
                        {s.what}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                      {s.duration_minutes} min
                    </span>
                    <span className="text-gray-600">
                      {isExpanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-4 border-t border-white/5">
                    <div className="mt-3 bg-white/[0.03] rounded-lg px-4 py-3">
                      <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">
                        Why this step?
                      </p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {s.why}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-100 transition-colors text-sm"
        >
          <Play size={16} fill="black" />
          Begin Session
        </button>

        <p className="text-center text-gray-600 text-xs mt-4">
          You can pause between steps at any time
        </p>
      </div>
    </div>
  );
}
