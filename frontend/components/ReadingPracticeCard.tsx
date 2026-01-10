import React from 'react';
import { BookOpen, Newspaper, FileText, PenTool, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReadingPracticeCard = () => {
    const navigate = useNavigate();

    return (
        <div className="relative group w-full max-w-sm mx-auto h-full">
            {/* 
        Container 
        - Dark slate blue background
        - Rounded corners
        - Subtle border
        - Overflow hidden to contain the floating icons
      */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-emerald-500/50 h-full flex flex-col group-hover:shadow-emerald-500/20">

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
                    <div className="flex justify-between items-start mb-6">
                        {/* Icon Box */}
                        <div className="w-12 h-12 rounded-xl bg-teal-900/50 flex items-center justify-center border border-teal-800/50 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                            <BookOpen className="w-6 h-6" />
                        </div>

                    </div>

                    {/* Typography */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-white/90 transition-colors">
                            Reading Practice
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Enhance comprehension with practice passages designed to improve your reading speed and accuracy.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-auto space-y-3">
                        <button
                            onClick={() => navigate('/reading')}
                            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group/btn"
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

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => navigate('/reading/theory')}
                                className="py-2.5 px-4 rounded-xl border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 hover:text-white transition-colors text-sm hover:border-slate-500"
                            >
                                Basics
                            </button>
                            <button
                                onClick={() => navigate('/reading/tutor-chat')}
                                className="py-2.5 px-4 rounded-xl border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 hover:text-white transition-colors text-sm hover:border-slate-500"
                            >
                                AI Tutor
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
