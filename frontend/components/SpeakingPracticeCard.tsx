import React from 'react';
import { Mic, MessageSquare, Users, Volume2, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SpeakingPracticeCard = () => {
    const navigate = useNavigate();

    return (
        <div className="relative group w-full max-w-sm mx-auto h-full">
            {/* Container */}
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-xl h-full flex flex-col opacity-75 grayscale-[0.3]">

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
                        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center border border-rose-100 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform duration-300">
                            <Mic className="w-6 h-6" />
                        </div>

                    </div>

                    {/* Typography */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-slate-800 dark:group-hover:text-white/90 transition-colors">
                            Speaking Practice
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Practice with AI-powered speaking exercises to improve responsiveness and fluency.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-auto space-y-3">
                        <button
                            disabled
                            className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 rounded-xl font-medium cursor-not-allowed border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
                        >
                            <span className="relative flex h-2 w-2 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            In Progress
                        </button>

                        {/* Secondary buttons can be added later if needed, kept simple now or matching existing style */}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SpeakingPracticeCard;
