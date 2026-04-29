import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Layers, Target, FileText, Mic, ChevronRight, Zap, CheckCircle2 } from 'lucide-react';

const topics = [
  { id: 'tech', name: 'Technology & Innovation', progress: 85, icon: Zap, color: 'text-violet-400', bg: 'bg-violet-400/10' },
  { id: 'env', name: 'Environment', progress: 60, icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 'edu', name: 'Education', progress: 40, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-400/10' },
];

const vocabulary = [
  { word: 'Common', level: 'B1', definition: 'Occurring, found, or done often; prevalent.' },
  { word: 'Crucial', level: 'B2', definition: 'Extremely important or necessary.' },
  { word: 'Widespread', level: 'B2', definition: 'Found or distributed over a large area or number of people.' },
];

const exercises = [
  { name: 'Context Tetris', type: 'Matching', status: 'completed' },
  { name: 'Word Collocations', type: 'Fill-in-the-blank', status: 'current' },
  { name: 'Synonym Swap', type: 'Multiple Choice', status: 'locked' },
];

export function VocabularyShowcase() {
  const [activeWord, setActiveWord] = useState(vocabulary[0]);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0c12]/80 backdrop-blur-xl mb-12 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-white/5">
        <div>
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </span>
            IELTS Vocabulary Builder
          </h3>
          <p className="text-sm text-slate-400 mt-1">Master high-band lexicon through topics, interactive exercises, and adaptive context.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
            <Target className="w-3.5 h-3.5" /> Band 7.0+ Guaranteed
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Topics & Exercises */}
        <div className="lg:col-span-5 space-y-6">
          {/* Topics Card */}
          <div className="rounded-xl border border-white/5 bg-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white tracking-wide uppercase">Study Topics</h4>
            </div>
            <div className="space-y-3">
              {topics.map((topic) => (
                <div key={topic.id} className="group relative overflow-hidden rounded-lg bg-black/20 hover:bg-black/40 transition-colors p-3 border border-white/5 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center ${topic.bg}`}>
                      <topic.icon className={`w-4 h-4 ${topic.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{topic.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 h-1.5 rounded-full bg-white/10">
                          <div className={`h-full rounded-full ${topic.color.replace('text-', 'bg-')}`} style={{ width: `${topic.progress}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{topic.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Exercises Card */}
          <div className="rounded-xl border border-white/5 bg-white/5 p-5">
             <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white tracking-wide uppercase">Interactive Exercises</h4>
            </div>
            <div className="space-y-2">
              {exercises.map((ex, i) => (
                <div key={i} className={`flex items-center justify-between p-2.5 rounded-lg border ${ex.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/10' : ex.status === 'current' ? 'bg-blue-500/10 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-black/20 border-white/5 opacity-60'}`}>
                  <div className="flex items-center gap-2.5">
                    {ex.status === 'completed' ? (
                       <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : ex.status === 'current' ? (
                       <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                    ) : (
                       <div className="w-4 h-4 rounded-full border-2 border-slate-700" />
                    )}
                    <div>
                      <p className={`text-xs font-bold ${ex.status === 'completed' ? 'text-emerald-300' : ex.status === 'current' ? 'text-blue-300' : 'text-slate-400'}`}>{ex.name}</p>
                      <p className="text-[10px] text-slate-500">{ex.type}</p>
                    </div>
                  </div>
                  {ex.status === 'current' && (
                    <span className="text-[9px] uppercase tracking-wider font-bold bg-blue-500 text-white px-2 py-0.5 rounded-sm">Playing</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Adaptive Examples */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Selected Word Info */}
          <div className="rounded-xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="flex gap-2 mb-4">
                {vocabulary.map(v => (
                  <button 
                    key={v.word} 
                    onClick={() => setActiveWord(v)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeWord.word === v.word ? 'bg-white text-black shadow-md scale-105' : 'bg-black/30 text-slate-400 hover:text-white hover:bg-black/50'}`}
                  >
                    {v.word}
                  </button>
                ))}
             </div>

             <AnimatePresence mode="wait">
               <motion.div
                 key={activeWord.word}
                 initial={{ opacity: 0, y: 5 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -5 }}
                 transition={{ duration: 0.2 }}
               >
                 <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-black text-white tracking-tight">{activeWord.word}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">{activeWord.level}</span>
                 </div>
                 <p className="text-sm text-slate-400 italic mb-6">"{activeWord.definition}"</p>

                 {/* Adaptive Examples Comparison */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Writing Example */}
                    <div className="rounded-lg bg-[#0f1118]/80 border border-rose-500/20 p-4 relative group">
                       <div className="absolute top-0 right-0 p-2 opacity-50 text-rose-400">
                         <FileText className="w-16 h-16 absolute top-0 right-0 -mr-4 -mt-4 opacity-10 rotate-12" />
                       </div>
                       <div className="flex items-center gap-2 mb-3 relative z-10">
                          <div className="w-6 h-6 rounded bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                            <FileText className="w-3 h-3 text-rose-400" />
                          </div>
                          <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Writing Task 2</span>
                       </div>
                       <p className="text-xs leading-relaxed text-slate-300 relative z-10">
                         "The integration of AI in classrooms is becoming increasingly <span className="text-rose-400 font-bold bg-rose-500/10 px-1 rounded mx-0.5">{activeWord.word.toLowerCase()}</span>, fundamentally transforming traditional <span className="border-b border-dashed border-slate-500">methodologies</span>."
                       </p>
                       <div className="mt-3 inline-block px-2 py-1 rounded bg-black/40 border border-white/5 text-[9px] text-slate-400">
                         Formal • Academic • Complex sentence
                       </div>
                    </div>

                    {/* Speaking Example */}
                    <div className="rounded-lg bg-[#0f1118]/80 border border-violet-500/20 p-4 relative group">
                       <div className="absolute top-0 right-0 p-2 opacity-50 text-violet-400">
                         <Mic className="w-16 h-16 absolute top-0 right-0 -mr-4 -mt-4 opacity-10 -rotate-12" />
                       </div>
                       <div className="flex items-center gap-2 mb-3 relative z-10">
                          <div className="w-6 h-6 rounded bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                            <Mic className="w-3 h-3 text-violet-400" />
                          </div>
                          <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">Speaking Part 3</span>
                       </div>
                       <p className="text-xs leading-relaxed text-slate-300 relative z-10">
                         "Well, smartphones are so <span className="text-violet-400 font-bold bg-violet-500/10 px-1 rounded mx-0.5">{activeWord.word.toLowerCase()}</span> nowadays that it's actually quite <span className="border-b border-dashed border-slate-500">rare</span> to see someone without one on the train."
                       </p>
                       <div className="mt-3 inline-block px-2 py-1 rounded bg-black/40 border border-white/5 text-[9px] text-slate-400">
                         Natural • Conversational • Idiomatic
                       </div>
                    </div>
                 </div>
               </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
