export interface StudentProfile {
  current: { L: number; R: number; W: number; S: number };
  target: { L: number; R: number; W: number; S: number };
  weeksAvailable: number;
  dailyMinutes: number;
}

export interface StrategyResult {
  probability: number;
  probabilityLabel: string;
  honestNote: string;
  biggestRisk: string;
  biggestAdvantage: string;
  breakdown: SectionBreakdown[];
}

interface SectionBreakdown {
  skill: string;
  current: number;
  target: number;
  gap: number;
  difficulty: string;
  achievable: boolean;
}

// --- Constants ---

// How many bands per week each skill can realistically improve
// Based on typical IELTS improvement rates
const IMPROVEMENT_RATE_PER_WEEK = {
  L: 0.12,  // Listening — fastest to improve
  R: 0.10,  // Reading — fast with practice
  S: 0.07,  // Speaking — slower, needs feedback
  W: 0.06,  // Writing — slowest, needs assessment
};

// Daily minutes multiplier — less time = slower improvement
function getTimeMultiplier(dailyMinutes: number): number {
  if (dailyMinutes >= 120) return 1.0;
  if (dailyMinutes >= 90)  return 0.85;
  if (dailyMinutes >= 60)  return 0.70;
  if (dailyMinutes >= 45)  return 0.55;
  if (dailyMinutes >= 30)  return 0.40;
  return 0.25; // under 30 min — very low
}

// Gap difficulty label
function getGapDifficulty(gap: number): string {
  if (gap <= 0)   return "Already there";
  if (gap <= 0.5) return "Easy";
  if (gap <= 1.0) return "Moderate";
  if (gap <= 1.5) return "Hard";
  if (gap <= 2.0) return "Very hard";
  return "Extremely hard";
}

// Probability label
function getProbabilityLabel(probability: number): string {
  if (probability >= 80) return "Strong chance";
  if (probability >= 65) return "Good chance";
  if (probability >= 50) return "Possible";
  if (probability >= 35) return "Challenging";
  if (probability >= 20) return "Difficult";
  return "Very unlikely";
}

// --- Main calculator ---

export function calculateProbability(profile: StudentProfile): StrategyResult {
  const { current, target, weeksAvailable, dailyMinutes } = profile;
  const timeMultiplier = getTimeMultiplier(dailyMinutes);

  const skills = ["L", "R", "W", "S"] as const;

  // Calculate per-section achievability
  const breakdown: SectionBreakdown[] = skills.map((skill) => {
    const gap = target[skill] - current[skill];
    const maxAchievable =
      IMPROVEMENT_RATE_PER_WEEK[skill] * weeksAvailable * timeMultiplier;
    const achievable = gap <= maxAchievable;

    return {
      skill,
      current: current[skill],
      target: target[skill],
      gap: Math.round(gap * 10) / 10,
      difficulty: getGapDifficulty(gap),
      achievable,
    };
  });

  // Score each section: how close can they get?
  const sectionScores = breakdown.map((s) => {
    if (s.gap <= 0) return 100; // already at or above target

    const maxAchievable =
      IMPROVEMENT_RATE_PER_WEEK[s.skill as keyof typeof IMPROVEMENT_RATE_PER_WEEK] *
      weeksAvailable *
      timeMultiplier;

    // What % of the gap can they close?
    const ratio = Math.min(maxAchievable / s.gap, 1.0);

    // Convert to probability score with a curve
    // Closing 100% of gap = 90 points (not 100 — always some uncertainty)
    // Closing 80% of gap = 70 points
    // Closing 50% of gap = 45 points
    return Math.round(ratio * ratio * 90);
  });

  // Overall probability = weighted average of section scores
  // Weight by gap size — bigger gaps matter more
  const weights = breakdown.map((s) => Math.max(s.gap, 0.1));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const weightedScore = sectionScores.reduce(
    (sum, score, i) => sum + score * (weights[i] / totalWeight),
    0
  );

  // Apply global time pressure penalty
  const totalGap = breakdown.reduce((sum, s) => sum + Math.max(s.gap, 0), 0);
  const timePressure = totalGap / weeksAvailable;
  const timePenalty = timePressure > 0.3 ? Math.min((timePressure - 0.3) * 30, 25) : 0;

  const rawProbability = Math.round(weightedScore - timePenalty);
  const probability = Math.max(5, Math.min(95, rawProbability));

  // Find biggest risk and advantage
  const nonZeroGaps = breakdown.filter((s) => s.gap > 0);
  const biggestRiskSection = nonZeroGaps.sort((a, b) => {
    // Risk = gap size weighted by how hard the skill is to improve
    const rateA = IMPROVEMENT_RATE_PER_WEEK[a.skill as keyof typeof IMPROVEMENT_RATE_PER_WEEK];
    const rateB = IMPROVEMENT_RATE_PER_WEEK[b.skill as keyof typeof IMPROVEMENT_RATE_PER_WEEK];
    return b.gap / rateB - a.gap / rateA;
  })[0];

  const biggestAdvantageSection = breakdown
    .filter((s) => s.gap <= 0.5)
    .sort((a, b) => a.gap - b.gap)[0];

  const skillNames: Record<string, string> = {
    L: "Listening",
    R: "Reading",
    W: "Writing",
    S: "Speaking",
  };

  const biggestRisk = biggestRiskSection
    ? `${skillNames[biggestRiskSection.skill]} needs +${biggestRiskSection.gap.toFixed(1)} bands — ${biggestRiskSection.difficulty.toLowerCase()}`
    : "No major risks identified";

  const biggestAdvantage = biggestAdvantageSection
    ? `${skillNames[biggestAdvantageSection.skill]} is close to target — less work needed here`
    : "All sections need significant work";

  // Honest note
  const honestNote = generateHonestNote(probability, breakdown, weeksAvailable, dailyMinutes);

  return {
    probability,
    probabilityLabel: getProbabilityLabel(probability),
    honestNote,
    biggestRisk,
    biggestAdvantage,
    breakdown,
  };
}

function generateHonestNote(
  probability: number,
  breakdown: SectionBreakdown[],
  weeks: number,
  dailyMinutes: number
): string {
  const hardSections = breakdown.filter(
    (s) => s.gap > 1.5
  );
  const skillNames: Record<string, string> = {
    L: "Listening",
    R: "Reading",
    W: "Writing",
    S: "Speaking",
  };

  if (probability >= 75) {
    return `Your target is realistic. Keep consistent daily practice and you have a strong chance.`;
  }

  if (probability >= 55) {
    if (hardSections.length > 0) {
      const names = hardSections.map((s) => skillNames[s.skill]).join(" and ");
      return `Achievable but ${names} ${hardSections.length > 1 ? "are" : "is"} the main challenge. Focus here daily.`;
    }
    return `Possible with consistent effort. Don't skip days — consistency matters more than intensity.`;
  }

  if (probability >= 35) {
    if (weeks < 6) {
      return `${weeks} weeks is tight for this target. Consider extending your deadline if possible.`;
    }
    if (dailyMinutes < 45) {
      return `Your study time is low. Increasing to 60+ minutes daily would significantly improve your chances.`;
    }
    if (hardSections.length > 0) {
      const names = hardSections.map((s) => skillNames[s.skill]).join(" and ");
      return `${names} gap${hardSections.length > 1 ? "s are" : " is"} large. This strategy is difficult — consider a different path.`;
    }
  }

  return `This target is very challenging in ${weeks} weeks. Consider choosing a strategy with smaller gaps, or extending your deadline.`;
}
