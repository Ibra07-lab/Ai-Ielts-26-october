interface Change {
  original: string;
  paraphrased: string;
}

interface ImprovedIntroductionProps {
  improvedText: string;
  overlapPercent: number;
  changes: Change[];
}

export function ImprovedIntroduction({
  improvedText,
  overlapPercent,
  changes,
}: ImprovedIntroductionProps) {
  return (
    <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 text-sm">✅</span>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400/90">
            Improved Introduction
          </span>
        </div>
        <span className="text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full shadow-sm">
          {overlapPercent}% overlap
        </span>
      </div>

      {/* Improved text */}
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6 relative z-10 font-medium">
        {improvedText}
      </p>

      {/* What changed */}
      {changes.length > 0 && (
        <div className="relative z-10 bg-white/50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">
            What changed
          </p>
          <div className="space-y-2">
            {changes.map((change, i) => (
              <div key={i} className="flex items-center gap-3 text-[13px] group/change">
                <span className="text-rose-500/70 dark:text-rose-400/70 line-through decoration-rose-500/40 w-1/3 truncate text-right">
                  {change.original}
                </span>
                <span className="text-slate-300 dark:text-slate-600 font-bold shrink-0">→</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium w-[60%] truncate">
                  {change.paraphrased}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
