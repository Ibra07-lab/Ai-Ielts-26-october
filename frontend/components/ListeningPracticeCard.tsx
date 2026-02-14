import React from 'react';
import { Headphones, Music, Radio, Volume2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListeningPracticeCard = () => {
    const navigate = useNavigate();

    return (
        <div className="relative group w-full max-w-sm mx-auto h-full">
            {/* Container */}
            <div
                onClick={() => navigate('/listening')}
                className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-xl h-full flex flex-col cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >

                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-violet-500/20 via-transparent to-transparent rounded-2xl pointer-events-none" />

                {/* Background Animation Layer */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    {[
                        { Icon: Headphones, left: '10%', delay: '0s', duration: '15s', size: 'w-12 h-12' },
                        { Icon: Music, left: '60%', delay: '2s', duration: '18s', size: 'w-10 h-10' },
                        { Icon: Radio, left: '30%', delay: '5s', duration: '20s', size: 'w-14 h-14' },
                        { Icon: Volume2, left: '80%', delay: '1s', duration: '12s', size: 'w-8 h-8' },
                        { Icon: Headphones, left: '20%', delay: '8s', duration: '16s', size: 'w-10 h-10' },
                        { Icon: Music, left: '85%', delay: '12s', duration: '22s', size: 'w-12 h-12' },
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
                        <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center border border-violet-100 dark:border-violet-800/50 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform duration-300">
                            <Headphones className="w-6 h-6" />
                        </div>

                    </div>

                    {/* Typography */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                            Listening Practice
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Sharpen your listening skills with diverse audio clips, transcripts, and comprehension questions.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-auto space-y-3">
                        <button
                            className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium border border-violet-500 flex items-center justify-center gap-2 transition-colors"
                        >
                            Start Practice
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ListeningPracticeCard;

