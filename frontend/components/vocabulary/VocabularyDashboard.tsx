import { useState } from "react";
import { Search, Sparkles, TrendingUp, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Topic } from "@/data/vocabulary";

interface VocabularyDashboardProps {
    topics: Topic[];
    onTopicSelect: (topicId: number) => void;
}

// Color mapping for topics
const colorMap: Record<string, string> = {
    "bg-blue-500": "bg-blue-200 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100",
    "bg-green-500": "bg-emerald-200 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100",
    "bg-purple-500": "bg-purple-200 dark:bg-purple-900/40 text-purple-900 dark:text-purple-100",
    "bg-red-500": "bg-rose-200 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100",
    "bg-yellow-500": "bg-amber-200 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100",
    "bg-pink-500": "bg-pink-200 dark:bg-pink-900/40 text-pink-900 dark:text-pink-100",
    "bg-indigo-500": "bg-indigo-200 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-100",
    "bg-lime-500": "bg-lime-200 dark:bg-lime-900/40 text-lime-900 dark:text-lime-100",
};

export default function VocabularyDashboard({ topics, onTopicSelect }: VocabularyDashboardProps) {
    const [search, setSearch] = useState("");

    const filteredTopics = topics.filter(topic =>
        topic.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Smart Header */}
            <div className="relative bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 rounded-3xl p-8 overflow-hidden border border-sky-100 dark:border-sky-900/30 shadow-sm dark:shadow-none">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-sky-200 dark:bg-sky-900/30 blur-3xl"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <BookOpen className="h-7 w-7 text-sky-500" />
                        Vocabulary Dashboard
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Expand your lexical resource with targeted learning</p>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Search topics..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-white dark:bg-neutral-900 border-gray-200 dark:border-white/10 focus:ring-sky-500 dark:focus:ring-sky-400 shadow-sm dark:shadow-none"
                        />
                    </div>

                    {/* Word of the Day - Compact */}
                    <div className="mt-4 p-4 bg-white dark:bg-neutral-900/50 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-none">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">Word of the Day</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">Ubiquitous</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Existing or being everywhere</p>
                            </div>
                            <div className="text-4xl">💡</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommended for You */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-amber-500" />
                    Recommended for You
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 mask-fade-right scrollbar-hide">
                    {filteredTopics.slice(0, 4).map((topic) => (
                        <Card
                            key={topic.id}
                            onClick={() => onTopicSelect(topic.id)}
                            className="min-w-[280px] cursor-pointer bg-white dark:bg-neutral-900/50 border-gray-200 dark:border-white/5 hover:border-sky-300 dark:hover:border-sky-500/30 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 shadow-sm dark:shadow-none"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={cn("p-2.5 rounded-lg", colorMap[topic.color] || "bg-gray-200 dark:bg-gray-800")}>
                                        <span className="text-2xl">{topic.icon}</span>
                                    </div>
                                    <Badge variant="secondary" className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs">
                                        {topic.wordsCount} words
                                    </Badge>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{topic.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{topic.description}</p>
                                <Progress value={0} className="h-1.5 bg-gray-100 dark:bg-white/5" />
                                <p className="text-xs text-gray-400 mt-2">0/{topic.wordsCount} learned</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Explore Topics - Bento Box */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                    Explore Topics
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredTopics.map((topic) => (
                        <Card
                            key={topic.id}
                            onClick={() => onTopicSelect(topic.id)}
                            className="group cursor-pointer bg-white dark:bg-neutral-900/50 border-gray-200 dark:border-white/5 hover:border-sky-300 dark:hover:border-sky-500/30 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 shadow-sm dark:shadow-none"
                        >
                            <CardContent className="p-5 text-center">
                                <div className={cn("inline-flex p-3 rounded-xl mb-3", colorMap[topic.color] || "bg-gray-200 dark:bg-gray-800")}>
                                    <span className="text-3xl">{topic.icon}</span>
                                </div>
                                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                    {topic.name}
                                </h3>
                                <Badge variant="secondary" className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[10px] mt-2">
                                    {topic.wordsCount} words
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
