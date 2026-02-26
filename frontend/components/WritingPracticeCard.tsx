import React from 'react';
import { PenTool, FileText, Edit3, Keyboard, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WritingPracticeCard = () => {
    const navigate = useNavigate();

    return (
        <div className="relative group w-full mx-auto h-full">
            {/* Container */}
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-500/50 h-full flex flex-col group-hover:shadow-blue-500/20">

                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/20 via-transparent to-transparent rounded-2xl pointer-events-none" />

                {/* Background Animation Layer */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    {[
                        { Icon: PenTool, left: '10%', delay: '0s', duration: '15s', size: 'w-12 h-12' },
                        { Icon: FileText, left: '60%', delay: '2s', duration: '18s', size: 'w-10 h-10' },
                        { Icon: Edit3, left: '30%', delay: '5s', duration: '20s', size: 'w-14 h-14' },
                        { Icon: Keyboard, left: '80%', delay: '1s', duration: '12s', size: 'w-8 h-8' },
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
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                            <PenTool className="w-6 h-6" />
                        </div>

                    </div>

                    {/* Typography */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-slate-800 dark:group-hover:text-white/90 transition-colors">
                            Writing Tasks
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Improve your writing with instant feedback on grammar, vocabulary, and structure.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-auto flex flex-col gap-3">
                        {/* Task 1 Button */}
                        <button
                            onClick={() => navigate('/writing/task-1')}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-900/20 group/btn1 relative overflow-hidden text-left"
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold flex items-center gap-2">
                                        Start Task 1
                                        <svg className="w-4 h-4 opacity-0 -ml-2 group-hover/btn1:opacity-100 group-hover/btn1:ml-0 transition-all text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                    <span className="text-xs text-blue-100/80 font-normal">Reports & Letters</span>
                                </div>
                                <FileText className="w-5 h-5 text-blue-200 opacity-60 group-hover/btn1:opacity-100 group-hover/btn1:rotate-[-5deg] transition-all" />
                            </div>
                        </button>

                        {/* Task 2 Button */}
                        <button
                            onClick={() => navigate('/writing/task-2')}
                            className="w-full py-3 px-4 bg-transparent hover:bg-blue-50 border-2 border-blue-500/30 hover:border-blue-500 text-blue-600 hover:text-blue-700 rounded-xl font-medium transition-all group/btn2 text-left"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold flex items-center gap-2">
                                        Start Task 2
                                        <svg className="w-4 h-4 opacity-0 -ml-2 group-hover/btn2:opacity-100 group-hover/btn2:ml-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                    <span className="text-xs text-slate-500 group-hover/btn2:text-blue-600/80 font-normal transition-colors">Essay Writing</span>
                                </div>
                                <Edit3 className="w-5 h-5 text-slate-400 group-hover/btn2:text-blue-500 transition-colors" />
                            </div>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WritingPracticeCard;
