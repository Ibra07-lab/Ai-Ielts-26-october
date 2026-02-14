import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useUser } from "../../contexts/UserContext";

interface ReadingSkill {
    type: string;
    total: number;
    correct: number;
    accuracy: number;
}


export default function ReadingProgressTracker() {
    const { user } = useUser();

    // Use default skills for now (static/empty state)
    const skills: ReadingSkill[] = [
        { type: "Matching Headings", total: 0, correct: 0, accuracy: 0 },
        { type: "True/False/Not Given", total: 0, correct: 0, accuracy: 0 },
        { type: "Multiple Choice", total: 0, correct: 0, accuracy: 0 },
        { type: "Gap Fill", total: 0, correct: 0, accuracy: 0 },
        { type: "Sentence Completion", total: 0, correct: 0, accuracy: 0 },
        { type: "Summary Completion", total: 0, correct: 0, accuracy: 0 },
        { type: "Matching Features", total: 0, correct: 0, accuracy: 0 },
        { type: "Short Answer", total: 0, correct: 0, accuracy: 0 },
    ];

    // Sort data: Weakest first for potentially highlighting, then strongest
    const sortedData = [...skills].sort((a, b) => a.accuracy - b.accuracy);
    // Strongest areas (Top 3)
    const strongAreas = [...skills].sort((a, b) => b.accuracy - a.accuracy).slice(0, 3);

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="w-full space-y-12 font-sans">
            {/* SECTION 2: DOMINANCE ZONES (Strong Areas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-foreground uppercase tracking-widest flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Dominance Zones
                    </h3>
                    <div className="space-y-3">
                        {strongAreas.map((skill) => (
                            <div key={skill.type} className="flex flex-col gap-1">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold uppercase text-foreground">{skill.type}</span>
                                    <span className="text-sm font-black text-emerald-500">{skill.accuracy}%</span>
                                </div>
                                <div className="h-6 bg-muted/50 w-full relative overflow-hidden flex items-center px-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${skill.accuracy}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="absolute top-0 left-0 h-full bg-emerald-500 opacity-20"
                                    />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${skill.accuracy}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="absolute bottom-0 left-0 h-0.5 bg-emerald-500"
                                    />
                                    <span className="relative z-10 text-[9px] font-mono text-emerald-500 tracking-widest opacity-0 hover:opacity-100 transition-opacity">
                                        MAX EFFICIENCY
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECTION 3: TACTICAL OVERVIEW (Full Chart) */}
                <div className="relative">
                    <h3 className="text-xl font-black text-foreground uppercase tracking-widest mb-6">
                        Full Spectrum
                    </h3>
                    <div className="flex flex-col gap-1 h-[250px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-foreground/20 scrollbar-track-transparent">
                        {sortedData.reverse().map((skill) => (
                            <div key={skill.type} className="group flex items-center gap-4 text-xs hover:bg-muted/50 p-1 transition-colors">
                                <span className="w-32 truncate font-medium text-muted-foreground group-hover:text-foreground transition-colors">{skill.type}</span>
                                <div className="flex-1 h-1.5 bg-muted overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${skill.accuracy}%` }}
                                        viewport={{ once: true }}
                                        className={`h-full ${skill.accuracy > 80 ? 'bg-emerald-500' : skill.accuracy < 60 ? 'bg-cyan-500' : 'bg-blue-400'}`}
                                    />
                                </div>
                                <span className="w-8 text-right font-mono text-muted-foreground">{skill.accuracy}%</span>
                            </div>
                        ))}
                    </div>
                    {/* Visual Decor */}
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-foreground/20" />
                    <div className="absolute -top-4 -left-4 w-4 h-4 border-t-2 border-l-2 border-foreground/20" />
                </div>
            </div>

        </div>
    );
}

