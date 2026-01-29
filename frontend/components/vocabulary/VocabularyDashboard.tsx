import { useState } from "react";
import { Search, Sparkles, TrendingUp, BookOpen, Clock, Calendar, Trophy, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TopicCard } from "./TopicCard";
import type { Topic } from "@/data/vocabulary";

interface VocabularyDashboardProps {
    topics: Topic[];
    onTopicSelect: (topicId: number) => void;
}

export default function VocabularyDashboard({ topics, onTopicSelect }: VocabularyDashboardProps) {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("learn");

    const filteredTopics = topics.filter(topic =>
        topic.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-20">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-4 mb-2">
                        <BookOpen className="h-9 w-9 text-blue-600 dark:text-sky-500" />
                        Vocabulary Builder
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-slate-400">Master IELTS vocabulary with spaced repetition.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Find a word..."
                            className="pl-9 h-10 rounded-xl bg-white/50 dark:bg-[#151B2B] border-slate-200 dark:border-white/10 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="bg-slate-100 dark:bg-[#151B2B] p-1.5 rounded-full border border-slate-200 dark:border-white/5 shadow-inner w-full sm:w-auto">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="bg-transparent border-0 h-auto p-0 gap-1 rounded-full w-full justify-between sm:justify-start">
                                {["learn", "topics", "review"].map((tab) => (
                                    <TabsTrigger
                                        key={tab}
                                        value={tab}
                                        className="px-6 py-2 rounded-full text-gray-600 dark:text-slate-400 data-[state=active]:bg-blue-600 dark:data-[state=active]:bg-sky-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 capitalize font-medium flex-1 sm:flex-none"
                                    >
                                        {tab === "learn" ? "Learn" : tab === "topics" ? "Topics" : "Review"}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* LEARN TAB CONTENT */}
            {activeTab === "learn" && (
                <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">

                    {/* Stats Cards - Refined */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="rounded-2xl border-slate-100 dark:border-white/5 bg-white dark:bg-[#151B2B] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                            <CardContent className="p-6 flex items-center gap-5">
                                <div className="p-4 bg-amber-50 dark:bg-amber-500/15 rounded-2xl text-amber-500">
                                    <Trophy className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-1">Daily Streak</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">5 Days</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-slate-100 dark:border-white/5 bg-white dark:bg-[#151B2B] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                            <CardContent className="p-6 flex items-center gap-5">
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/15 rounded-2xl text-emerald-500">
                                    <TrendingUp className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider mb-1">Words Mastered</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">142</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-slate-100 dark:border-white/5 bg-white dark:bg-[#151B2B] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                            <CardContent className="p-6 flex items-center gap-5">
                                <div className="p-4 bg-blue-50 dark:bg-sky-500/15 rounded-2xl text-blue-500 dark:text-sky-500">
                                    <Clock className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-blue-600 dark:text-sky-500 uppercase tracking-wider mb-1">Time Spent</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">2.5 hrs</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Grid: 5 Columns (3 Left : 2 Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                        {/* LEFT COLUMN (Span 3) - Today's Queue */}
                        <div className="lg:col-span-3 space-y-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-slate-400" />
                                Today's Queue
                            </h2>

                            {/* Word of the Day Hero */}
                            <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 dark:bg-[#0B0F19] border border-white/10 shadow-xl p-10 group">
                                {/* Decorative Blur Circles */}
                                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] group-hover:bg-blue-600/30 transition-all duration-700"></div>
                                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[80px]"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-semibold shadow-sm">
                                            Word of the Day
                                        </div>
                                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-blue-200 text-xs font-medium">
                                            High Academic • Writing Task 2
                                        </div>
                                    </div>

                                    <h3 className="text-6xl font-bold mb-4 tracking-tight text-white drop-shadow-md">Ubiquitous</h3>

                                    <div className="space-y-1 mb-10">
                                        <p className="text-xl text-slate-200 font-light italic leading-relaxed">"Existing or being everywhere at the same time."</p>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-300 hover:shadow-blue-600/40 hover:-translate-y-0.5 border-0 text-base">
                                            Learn Now
                                        </Button>
                                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 h-12 rounded-xl backdrop-blur-sm px-6 font-medium">
                                            Mark as Known
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Coming Up Next Queue */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Coming Up Next</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Queue Item 1 */}
                                    <div className="group bg-white dark:bg-[#151B2B] rounded-2xl p-5 border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all cursor-pointer shadow-sm hover:shadow-md">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="secondary" className="bg-slate-100 dark:bg-white/5 text-slate-500 rounded-lg px-2 text-[10px]">#2</Badge>
                                            <div className="h-6 w-6 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-500/20 transition-colors">
                                                <Sparkles className="h-3 w-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Serendipity</h4>
                                        <p className="text-sm text-slate-500 truncate">The occurrence of events by chance...</p>
                                    </div>

                                    {/* Queue Item 2 */}
                                    <div className="group bg-white dark:bg-[#151B2B] rounded-2xl p-5 border border-slate-100 dark:border-white/5 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all cursor-pointer shadow-sm hover:shadow-md">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="secondary" className="bg-slate-100 dark:bg-white/5 text-slate-500 rounded-lg px-2 text-[10px]">#3</Badge>
                                            <div className="h-6 w-6 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-purple-50 dark:group-hover:bg-purple-500/20 transition-colors">
                                                <Sparkles className="h-3 w-3 text-slate-400 group-hover:text-purple-500 transition-colors" />
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Ephemeral</h4>
                                        <p className="text-sm text-slate-500 truncate">Lasting for a very short time...</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN (Span 2) - Continue Learning */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Continue Learning</h2>
                                <Button variant="ghost" size="sm" className="text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 hover:bg-blue-50 dark:hover:bg-sky-500/10 h-8 rounded-lg text-xs font-semibold">
                                    View All
                                </Button>
                            </div>

                            <div className="grid gap-5">
                                {topics.slice(0, 3).map((topic) => (
                                    <TopicCard
                                        key={topic.id}
                                        topic={topic}
                                        onClick={() => onTopicSelect(topic.id)}
                                    />
                                ))}

                                <Button variant="outline" className="w-full h-14 rounded-2xl border-dashed border-2 border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/5 text-slate-500 dark:text-slate-400 font-medium transition-all group">
                                    <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">View All Topics</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TOPICS TAB CONTENT */}
            {activeTab === "topics" && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-500" />
                            Explore Topics
                        </h2>

                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search topics..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-white dark:bg-neutral-900 border-gray-200 dark:border-white/10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTopics.map((topic) => (
                            <TopicCard
                                key={topic.id}
                                topic={topic}
                                onClick={() => onTopicSelect(topic.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* REVIEW TAB CONTENT */}
            {activeTab === "review" && (
                <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-24 h-24 bg-sky-100 dark:bg-sky-500/10 rounded-full flex items-center justify-center mb-6 text-sky-500">
                        <RotateCcw className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Review Session</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
                        You have 12 words due for review today based on your spaced repetition schedule.
                    </p>
                    <Button size="lg" className="px-8 h-12 bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20 text-lg font-bold rounded-2xl">
                        Start Review Session
                    </Button>
                </div>
            )}

        </div>
    );
}
