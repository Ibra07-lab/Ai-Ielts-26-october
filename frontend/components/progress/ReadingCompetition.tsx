import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Swords, Globe, ChevronRight, Zap, Target, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReadingCompetition() {
    const [activeTab, setActiveTab] = useState<'leaderboard' | 'rivals'>('leaderboard');

    const ranking = [
        { rank: 1, name: "Sarah K.", points: 2840, avatar: "SK", trend: "up" },
        { rank: 2, name: "You", points: 2650, avatar: "ME", trend: "up", isMe: true },
        { rank: 3, name: "David M.", points: 2590, avatar: "DM", trend: "down" },
        { rank: 4, name: "Alex R.", points: 2100, avatar: "AR", trend: "same" },
        { rank: 5, name: "Priya S.", points: 1950, avatar: "PS", trend: "up" },
    ];

    const rivals = [
        { name: "Marcus T.", level: "Band 7.0", winRate: "68%", status: "online" },
        { name: "Elena V.", level: "Band 7.5", winRate: "72%", status: "offline" },
    ];

    return (
        <div className="w-full font-sans bg-background border border-border p-1 relative overflow-hidden">
            {/* Background Decor - Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 p-6 pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Arena<span className="text-cyan-500">.Mode</span></h3>
                        <p className="text-[10px] font-mono tracking-widest text-muted-foreground mt-1">GLOBAL COMPETITIVE INDEX</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('leaderboard')}
                            className={cn(
                                "px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border border-transparent",
                                activeTab === 'leaderboard' ? "bg-foreground text-background" : "hover:border-foreground/20 text-muted-foreground"
                            )}
                        >
                            Rankings
                        </button>
                        <button
                            onClick={() => setActiveTab('rivals')}
                            className={cn(
                                "px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border border-transparent",
                                activeTab === 'rivals' ? "bg-cyan-600 text-white" : "hover:border-cyan-600/50 text-muted-foreground"
                            )}
                        >
                            Duel
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 pt-6 relative z-10 min-h-[300px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'leaderboard' ? (
                        <motion.div
                            key="leaderboard"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3"
                        >
                            {ranking.map((user, i) => (
                                <div
                                    key={user.rank}
                                    className={cn(
                                        "flex items-center justify-between p-4 border transition-all hover:translate-x-1 group",
                                        user.isMe ? "border-cyan-500/50 bg-cyan-500/5" : "border-border/50 bg-background/50"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={cn(
                                            "text-lg font-black w-8",
                                            user.rank === 1 ? "text-cyan-500" :
                                                user.rank === 2 ? "text-stone-400" :
                                                    user.rank === 3 ? "text-cyan-700" : "text-muted-foreground"
                                        )}>
                                            #{user.rank}
                                        </span>
                                        <div className="w-8 h-8 rounded-none bg-muted flex items-center justify-center text-xs font-bold border border-foreground/10">
                                            {user.avatar}
                                        </div>
                                        <span className={cn("font-bold text-sm uppercase", user.isMe && "text-cyan-500")}>
                                            {user.name}
                                            {user.rank === 1 && <Crown className="inline w-3 h-3 ml-2 text-cyan-500 mb-1" />}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-xs font-bold">{user.points} XP</span>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-8 p-4 bg-muted/20 border border-dashed border-border flex items-center justify-center gap-3">
                                <Globe className="w-4 h-4 text-muted-foreground" />
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Top 15% of Global Learners</span>
                            </div>

                        </motion.div>
                    ) : (
                        <motion.div
                            key="rivals"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="grid gap-4"
                        >
                            <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 mb-4">
                                <div className="flex items-center gap-3 text-cyan-500 mb-2">
                                    <Swords className="w-5 h-5" />
                                    <h4 className="font-black uppercase tracking-wider text-sm">Active Challenge</h4>
                                </div>
                                <p className="text-xs text-muted-foreground">Beat score <span className="text-foreground font-bold">32/40</span> in Reading Test 5 to claim 500 XP.</p>
                                <button className="mt-3 w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black uppercase py-2 tracking-widest transition-colors">
                                    Accept Challenge
                                </button>
                            </div>

                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Suggested Rivals</h4>
                            {rivals.map((rival, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border border-border bg-background hover:bg-muted/50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <div>
                                            <div className="font-bold text-sm uppercase">{rival.name}</div>
                                            <div className="text-[10px] text-muted-foreground font-mono">{rival.level} | WR: {rival.winRate}</div>
                                        </div>
                                    </div>
                                    <button className="w-8 h-8 flex items-center justify-center border border-foreground/10 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-colors">
                                        <Swords className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
}
