import { useState } from "react";
import { Target, Headphones, BookOpen, PenTool, Speech } from "lucide-react";

export function LandingCalculator() {
  const [scores, setScores] = useState({ L: 5.5, R: 5.5, W: 5.5, S: 5.5 });

  const sum = scores.L + scores.R + scores.W + scores.S;
  const avg = sum / 4;
  let currentOverallResult = Math.floor(avg);
  const remainder = avg % 1;
  if (remainder >= 0.75) currentOverallResult = Math.floor(avg) + 1.0;
  else if (remainder >= 0.25) currentOverallResult = Math.floor(avg) + 0.5;

  const updateTarget = (skill: 'L' | 'R' | 'W' | 'S', val: number) => {
    setScores(prev => ({ ...prev, [skill]: val }));
  };

  const renderSlider = (label: string, skill: 'L' | 'R' | 'W' | 'S', icon: React.ReactNode, color: string) => {
    const val = scores[skill];
    return (
      <div className="space-y-3 relative z-10">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <div className={`${color} opacity-80`}>{icon}</div>
            <span className="font-bold text-slate-300 w-20">{label}</span>
          </div>
          <span className="font-black text-blue-400 bg-blue-900/40 border border-blue-500/20 px-3 py-1 rounded-full text-xs">{val.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min={1.0}
          max={9.0}
          step={0.5}
          value={val}
          onChange={e => updateTarget(skill, parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>
    );
  };

  return (
    <div className="bg-[#06080e]/60 backdrop-blur-3xl rounded-[2.5rem] px-4 sm:px-8 md:px-16 py-8 md:py-10 w-full mx-auto shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden text-left">
      {/* Background Aurora */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-r from-blue-600/10 via-emerald-600/10 to-violet-600/10 rounded-full blur-[120px] opacity-70 pointer-events-none"></div>
      
      <style>{`
        @keyframes flowData {
          0% { left: 0%; opacity: 0; transform: scale(0.5); }
          15% { opacity: 1; transform: scale(1); }
          85% { opacity: 1; transform: scale(1); }
          100% { left: 100%; opacity: 0; transform: scale(0.5); }
        }
      `}</style>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h4 className="text-base font-black text-white uppercase tracking-widest">Interactive Path</h4>
            <p className="text-xs font-medium text-blue-400/80 uppercase tracking-widest">Strategy Engine Simulation</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14 relative z-10">
        
        {/* Left: 2x2 Grid with Glass Cards (No borders) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8 flex-1 w-full bg-white/[0.015] px-4 sm:px-8 md:px-12 py-6 md:py-8 rounded-3xl shadow-inner">
          {renderSlider('Listening', 'L', <Headphones className="w-5 h-5" />, 'text-emerald-400')}
          {renderSlider('Reading', 'R', <BookOpen className="w-5 h-5" />, 'text-indigo-400')}
          {renderSlider('Writing', 'W', <PenTool className="w-5 h-5" />, 'text-amber-400')}
          {renderSlider('Speaking', 'S', <Speech className="w-5 h-5" />, 'text-rose-400')}
        </div>

        {/* Middle: Connection Line (Desktop only) */}
        <div className="hidden lg:flex items-center justify-center w-24 relative h-10 flex-shrink-0">
          <div className="w-full h-px bg-gradient-to-r from-white/0 via-blue-500/30 to-white/0"></div>
          {/* Animated data packets */}
          <div style={{ animation: 'flowData 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite', animationDelay: '0s', position: 'absolute', top: '50%', marginTop: '-4px' }} className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_15px_#3b82f6]"></div>
          <div style={{ animation: 'flowData 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite', animationDelay: '0.8s', position: 'absolute', top: '50%', marginTop: '-4px' }} className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_15px_#34d399]"></div>
          <div style={{ animation: 'flowData 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite', animationDelay: '1.6s', position: 'absolute', top: '50%', marginTop: '-4px' }} className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"></div>
        </div>

        {/* Right: Glassmorphism Score Box (No borders) */}
        <div className="w-full lg:w-80 px-6 sm:px-10 py-6 sm:py-8 rounded-[2rem] bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex-shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-[50px]"></div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Simulation Output</span>
          </div>

          <div className="flex items-end gap-5 mb-2 relative z-10">
            <span className="text-[5rem] sm:text-[6rem] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-blue-400 drop-shadow-sm">
              {currentOverallResult.toFixed(1)}
            </span>
            <span className="text-xs sm:text-sm font-bold text-blue-300/80 pb-3 leading-tight uppercase tracking-widest">Overall<br/>Score</span>
          </div>

          <div className="text-sm font-bold text-slate-500/80 mt-6 pt-4 flex justify-between uppercase tracking-widest relative z-10">
            <span>Score Sum: <span className="text-slate-300">{sum.toFixed(1)}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
