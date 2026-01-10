import React from 'react';
import { Mic, MessageSquare, Users, Volume2, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SpeakingPracticeCard = () => {
    const navigate = useNavigate();

    return (
        <div className="relative group w-full max-w-sm mx-auto h-full">
            {/* Container */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-rose-500/50 h-full flex flex-col group-hover:shadow-rose-500/20">

                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-rose-500/20 via-transparent to-transparent rounded-2xl pointer-events-none" />

                {/* Background Animation Layer */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    {[
                        { Icon: Mic, left: '10%', delay: '0s', duration: '15s', size: 'w-12 h-12' },
                        { Icon: MessageSquare, left: '60%', delay: '2s', duration: '18s', size: 'w-10 h-10' },
                        { Icon: Users, left: '30%', delay: '5s', duration: '20s', size: 'w-14 h-14' },
                        { Icon: Volume2, left: '80%', delay: '1s', duration: '12s', size: 'w-8 h-8' },
                        { Icon: Radio, left: '20%', delay: '8s', duration: '16s', size: 'w-10 h-10' },
                        { Icon: Mic, left: '85%', delay: '12s', duration: '22s', size: 'w-12 h-12' },
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
                        <div className="w-12 h-12 rounded-xl bg-rose-900/50 flex items-center justify-center border border-rose-800/50 text-rose-400 group-hover:scale-110 transition-transform duration-300">
                            <Mic className="w-6 h-6" />
                        </div>

                    </div>

                    {/* Typography */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-white/90 transition-colors">
                            Speaking Practice
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Practice with AI-powered speaking exercises to improve responsiveness and fluency.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-auto space-y-3">
                        <button
                            onClick={() => navigate('/speaking')}
                            className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 group/btn"
                        >
                            Start Practice
                            <svg
                                className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>

                        {/* Secondary buttons can be added later if needed, kept simple now or matching existing style */}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SpeakingPracticeCard;
