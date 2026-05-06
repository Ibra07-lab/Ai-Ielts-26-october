"use client";
import React from "react";
import {
  BarChart3,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  Play,
  Star,
  Target,
  TrendingUp,
  CheckCircle2
} from "lucide-react";

export const DashboardMockup = () => {
  return (
    <div className="w-full h-full bg-[#0c0e14] text-white p-6 font-sans select-none overflow-hidden">
      {/* Top Header Mockup */}
      <div className="flex items-center justify-between mb-8 opacity-80">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <TrendingUp className="text-white h-6 w-6" />
          </div>
          <div>
            <div className="h-4 w-24 bg-slate-800 rounded-md mb-1 animate-pulse"></div>
            <div className="h-3 w-32 bg-slate-800/50 rounded-md"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-800"></div>
          <div className="h-8 w-20 rounded-lg bg-slate-800"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Section: Masterclasses & Progress */}
        <div className="col-span-1 md:col-span-7 space-y-6">
          {/* Masterclasses Mockup */}
          <div className="rounded-[2rem] bg-[#151624] border border-white/10 p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/10 rounded-full blur-[80px]"></div>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-red-500/20 text-red-500 border border-red-500/10">
                <Play size={16} fill="currentColor" />
              </div>
              <h3 className="font-bold text-lg">Masterclasses</h3>
            </div>

            <div className="flex gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex-1 group/item">
                  <div className="aspect-video bg-[#0c0e14] rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover/item:scale-110 transition-transform">
                      <Play size={18} fill="white" className="ml-0.5 text-white" />
                    </div>
                  </div>
                  <div className="mt-3 h-4 w-3/4 bg-slate-800 rounded group-hover/item:bg-slate-700 transition-colors"></div>
                  <div className="mt-2 h-3 w-1/2 bg-slate-800/50 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Card Mockup */}
          <div className="rounded-[2rem] bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-8 relative overflow-hidden hidden sm:block">
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h4 className="text-slate-400 text-sm font-medium mb-1">Weekly Target</h4>
                  <p className="text-4xl font-black text-white">83%</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 text-sm font-bold">12 / 15 Tasks</p>
                </div>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[83%] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Practice Cards */}
        <div className="col-span-1 md:col-span-5 grid grid-cols-2 gap-4">
          {[
            { icon: Mic, color: "text-rose-500", label: "Speaking" },
            { icon: PenTool, color: "text-blue-500", label: "Writing" },
            { icon: BookOpen, color: "text-emerald-500", label: "Reading" },
            { icon: Headphones, color: "text-violet-500", label: "Listening" },
          ].map((item, idx) => (
            <div key={idx} className="aspect-square rounded-[2rem] bg-[#151624] border border-white/10 p-5 flex flex-col justify-between group hover:border-white/20 transition-all">
              <div className={`p-3 rounded-2xl bg-white/5 ${item.color} w-fit`}>
                <item.icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">{item.label}</h4>
                <div className="h-6 w-full bg-white text-[10px] text-black font-bold flex items-center justify-center rounded-lg opacity-80 group-hover:opacity-100 transition-opacity">
                  Practice
                </div>
              </div>
            </div>
          ))}

          {/* Overall Progress pill */}
          <div className="col-span-2 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between px-6 hidden sm:flex">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-blue-400 h-5 w-5" />
              <span className="text-sm font-bold">Overall Progress</span>
            </div>
            <div className="h-8 w-16 bg-white rounded-full flex items-center justify-center text-black text-[10px] font-black">
              OPEN
            </div>
          </div>
        </div>
      </div>

      {/* Vocabulary Builder Preview at Bottom */}
      <div className="mt-8 p-6 rounded-[2.5rem] bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-400/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <h3 className="font-black text-lg">Vocabulary Builder</h3>
            <p className="text-slate-400 text-xs mt-0.5">Spaced repetition learning</p>
          </div>
        </div>
        <div className="h-10 px-6 rounded-xl bg-sky-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-sky-500/20">
          Start Learning
        </div>
      </div>
    </div>
  );
};
