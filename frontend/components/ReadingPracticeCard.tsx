import React from 'react';
import { BookOpen, Newspaper, FileText, PenTool, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReadingPracticeCard = () => {
    const navigate = useNavigate();

    return (
        <div className="relative group w-full mx-auto h-full">
            {/* 
            {/* Container */}
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 xl:p-5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-emerald-500/50 h-full flex flex-col group-hover:shadow-emerald-500/20">

                {/* Hover Gradient Effect - The "Old Green Color Animation" */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent rounded-2xl pointer-events-none" />

                {/* Background Animation Layer */}
                {/* 
          - Sits behind text (z-0)
          - Pointer events none
          - Consists of floating icons that fade in on hover
        */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    {/* We map specific icons with custom random positions and delays */}
                    {[
                        { Icon: BookOpen, left: '10%', delay: '0s', duration: '15s', size: 'w-12 h-12' },
                        { Icon: Newspaper, left: '60%', delay: '2s', duration: '18s', size: 'w-10 h-10' },
                        { Icon: FileText, left: '30%', delay: '5s', duration: '20s', size: 'w-14 h-14' },
                        { Icon: PenTool, left: '80%', delay: '1s', duration: '12s', size: 'w-8 h-8' },
                        { Icon: Book, left: '20%', delay: '8s', duration: '16s', size: 'w-10 h-10' },
                        { Icon: FileText, left: '85%', delay: '12s', duration: '22s', size: 'w-12 h-12' },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className={`absolute bottom-[-50px] text-slate-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out`}
                            style={{
                                left: item.left,
                                animation: `floatUp ${item.duration} linear infinite`,
                                animationDelay: item.delay,
                            }}
                        >
                            <item.Icon className={item.size} strokeWidth={1.5} />
                        </div>
                    ))}
                </div>

                {/* Content Layer */}
                <div className="relative z-10 flex flex-col h-full">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        {/* Icon Box */}
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-teal-900/50 flex items-center justify-center border border-emerald-100 dark:border-teal-800/50 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                            <BookOpen className="w-5 h-5" />
                        </div>

                    </div>

                    {/* Typography */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight group-hover:text-slate-800 dark:group-hover:text-white/90 transition-colors line-clamp-1">
                            Reading Practice
                        </h3>
                    </div>

                    {/* Buttons */}
                    <div className="mt-auto space-y-3">
                        <button
                            onClick={() => navigate('/reading')}
                            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group/btn text-xs sm:text-sm"
                        >
                            Start Practice
                            {/* Subtle arrow that moves on hover */}
                            <svg
                                className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>

                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <button
                                onClick={() => navigate('/reading/theory')}
                                className="py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors text-xs hover:border-slate-300"
                            >
                                Basics
                            </button>
                            <button
                                onClick={() => navigate('/reading/tutor-chat')}
                                className="relative inline-flex h-full w-full overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-50 group/magic"
                            >
                                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#34d399_0%,#6366f1_50%,#34d399_100%)]" />
                                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-2 py-1.5 text-xs font-bold text-emerald-100 backdrop-blur-3xl transition-colors group-hover/magic:bg-slate-800">
                                    AI Tutor
                                </span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Styles for the floating animation */}
            <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(100px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1; /* Target opacity is set by tailwind class, this maintains it */
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-400px) rotate(20deg);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
};

export default ReadingPracticeCard;
