// ReadingSessionGuide.tsx
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

interface ReadingSessionGuideProps {
  onStart: () => void;
  taskTitle?: string;
  passageTopic?: string;
  /** If provided, only these steps are shown (from backend). Otherwise all 6 are shown. */
  steps?: Step[];
}

const ALL_READING_STEPS: Step[] = [
  {
    step_number: 1,
    icon: "📖",
    name: "Full Passage Read",
    duration_minutes: 20,
    what:
      "Read the single passage and answer all questions under strict 20-minute timed conditions. Do not look up words or re-read sections more than once.",
    why: "IELTS gives you 60 minutes for 3 passages, so you have exactly 20 minutes per passage. Training under this exact time pressure builds the speed and focus you need on exam day.",
  },
  {
    step_number: 2,
    icon: "🔍",
    name: "Review Answers & Analyze",
    duration_minutes: 20,
    what:
      "Check each answer. Read the evidence shown for correct answers. For wrong answers, find the exact sentence in the passage that contains the answer.",
    why: "IELTS reading answers always come directly from the passage. Training yourself to locate evidence — not guess — is the single most important reading skill. Analyzing your mistakes deeply is where the real learning happens.",
  },
  {
    step_number: 3,
    icon: "🤖",
    name: "AI Explanation",
    duration_minutes: 10,
    what:
      "For any answer you still do not understand after reading the evidence, use the AI explanation. Ask it to clarify why that specific answer is correct.",
    why: "Sometimes the evidence is clear but the reasoning is not. The AI explains the logic behind the answer — why this word means that, why this option is wrong, why paraphrasing makes it tricky. Understanding the reasoning prevents the same mistake next time.",
  },
  {
    step_number: 4,
    icon: "📊",
    name: "Skill Breakdown & Theory",
    duration_minutes: 15,
    what:
      "Open your reading skill breakdown. Find any question type where your accuracy is below 40% (or your lowest score). Go to the Theory section and read the strategy, tips, and common mistakes for that specific type.",
    why: "Most reading mistakes come from not knowing the specific strategy for a question type (like True/False/Not Given or Matching). Identifying your critical weak area (<40%) and learning its strategy fixes a pattern that costs you points.",
  },
  {
    step_number: 5,
    icon: "💬",
    name: "Practice with Alex",
    duration_minutes: 20,
    what:
      "Open Alex. Tell him the weak area you just identified (<40%) and ask for 10 focused practice questions on that specific type to apply the theory you just learned.",
    why: "Random practice improves slowly. Targeted practice on your proven weak area improves fast. Alex gives you questions, explains mistakes in real time, and helps you apply the theory directly.",
  },
];

export default function ReadingSessionGuide({
  onStart,
  taskTitle,
  passageTopic,
  steps,
}: ReadingSessionGuideProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const displaySteps = steps && steps.length > 0 ? steps : ALL_READING_STEPS;
  const totalMinutes = displaySteps.reduce((sum, s) => sum + s.duration_minutes, 0);

  const toggleStep = (step: number) => {
    setExpandedStep(expandedStep === step ? null : step);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">
            Reading Practice
          </p>
          <h1 className="text-2xl font-bold text-white mb-1">
            {taskTitle ?? "Today's Session"}
          </h1>
          {passageTopic && (
            <p className="text-gray-500 text-sm mt-1">{passageTopic}</p>
          )}
          <div className="flex items-center justify-center gap-1 text-gray-400 text-sm mt-3">
            <Clock size={14} />
            <span>{displaySteps.length} steps · {totalMinutes} minutes total</span>
          </div>
        </div>

        {/* What you will use today */}
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
