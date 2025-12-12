import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
    BookOpen,
    CheckCircle,
    XCircle,
    AlertCircle,
    Lightbulb,
    Clock, ArrowLeft
} from "lucide-react";

export default function TFNGTheory() {
    const [expandedSection, setExpandedSection] = useState<string | null>("section-1");

    // Fetch detailed comprehensive theory
    const { data: theoryData, isLoading } = useQuery({
        queryKey: ['tfng-detailed-theory'],
        queryFn: async () => {
            const response = await fetch('/backend/data/tfng-detailed-theory.json');
            return response.json();
        }
    });

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">Loading comprehensive theory...</p>
                </div>
            </div>
        );
    }

    if (!theoryData) return null;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 pb-24">
            {/* Header */}
            <div className="space-y-4">
                <Link to="/reading/theory">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Theory List
                    </Button>
                </Link>

                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        {theoryData.title}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        A complete strategy guide to master the most challenging question type in IELTS Reading
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-200/70 dark:bg-slate-700/50" />

            {/* Sections */}
            <div className="space-y-6">
                {theoryData.sections?.map((section: any) => (
                    <Card
                        key={section.id}
                        className={`border-l-4 transition-all ${expandedSection === section.id
                                ? 'border-l-emerald-500 shadow-lg'
                                : 'border-l-slate-300 dark:border-l-slate-700'
                            }`}
                    >
                        <CardHeader>
                            <button
                                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                                className="w-full text-left"
                            >
                                <CardTitle className="text-2xl flex items-center justify-between group">
                                    <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {section.title}
                                    </span>
                                    <div className={`transform transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`}>
                                        ▼
                                    </div>
                                </CardTitle>
                            </button>
                        </CardHeader>

                        {expandedSection === section.id && (
                            <CardContent className="space-y-6">
                                {/* Subsections */}
                                {section.subsections?.map((subsection: any, idx: number) => (
                                    <div key={subsection.id || idx} className="space-y-4">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                            {subsection.title}
                                        </h3>

                                        {/* Overview Content */}
                                        {subsection.content && typeof subsection.content === 'string' && (
                                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {subsection.content}
                                            </p>
                                        )}

                                        {/* Answer Meanings */}
                                        {subsection.answerMeanings && (
                                            <div className="grid gap-3">
                                                {subsection.answerMeanings
                                                    .filter((item: any) => item.answer !== "NOT GIVEN")
                                                    .map((item: any, i: number) => (
                                                        <div key={i} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                                            <div className="font-bold text-lg text-emerald-600 dark:text-emerald-400 mb-1">
                                                                {item.answer}
                                                            </div>
                                                            <div className="text-slate-700 dark:text-slate-300">
                                                                {item.meaning}
                                                            </div>
                                                        </div>
                                                    ))}</div>
                                        )}

                                        {/* Important Note */}
                                        {subsection.importantNote && (
                                            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                                <CardContent className="pt-6 space-y-3">
                                                    <h4className="font-bold text-blue-900 dark:text-blue-100">
                                                    {subsection.importantNote.title}
                                                </h4>
                                                <p className="text-blue-800 dark:text-blue-200">
                                                    {subsection.importantNote.description}
                                                </p>
                                                {subsection.importantNote.comparison && (
                                                    <div className="grid md:grid-cols-2 gap-2">
                                                        {subsection.importantNote.comparison.map((c: any, i: number) => (
                                                            <div key={i} className="p-2 bg-white dark:bg-slate-900 rounded border border-blue-200 dark:border-blue-800">
                                                                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                                                                    {c.type}
                                                                </div>
                                                                <div className="text-sm text-slate-700 dark:text-slate-300">
                                                                    → Tests {c.tests}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </CardContent>
                      </Card>
                                )}

                                {/* Skills Tested */}
                                {subsection.skills && (
                                    <div className="grid gap-2">
                                        {subsection.skills.map((skill: any, i: number) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10">
                                                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {skill.skill}
                                                    </div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                                        {skill.meaning}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Key Insight */}
                                {subsection.keyInsight && (
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex gap-3">
                                        <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                                        <p className="text-yellow-900 dark:text-yellow-100">
                                            <span className="font-bold">Key Insight:</span> {subsection.keyInsight}
                                        </p>
                                    </div>
                                )}

                                {/* Description */}
                                {subsection.description && typeof subsection.description === 'string' && (
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {subsection.description}
                                    </p>
                                )}

                                {/* Criteria Lists */}
                                {subsection.criteria && (
                                    <ul className="space-y-2">
                                        {subsection.criteria.map((criterion: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                                <span className="text-slate-700 dark:text-slate-300">{criterion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Example Card */}
                                {subsection.example && (
                                    <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
                                        <CardContent className="pt-6 space-y-3">
                                            {subsection.example.passage && (
                                                <div>
                                                    <div className="text-xs font-bold text-slate-500 uppercase mb-2">Passage</div>
                                                    <blockquote className="italic text-slate-700 dark:text-slate-300 border-l-2 border-slate-300 pl-3">
                                                        "{subsection.example.passage}"
                                                    </blockquote>
                                                </div>
                                            )}
                                            {subsection.example.statement && (
                                                <div>
                                                    <div className="text-xs font-bold text-slate-500 uppercase mb-2">Statement</div>
                                                    <p className="text-slate-800 dark:text-slate-200">
                                                        {subsection.example.statement}
                                                    </p>
                                                </div>
                                            )}
                                            {subsection.example.answer && (
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-emerald-600">
                                                        Answer: {subsection.example.answer}
                                                    </Badge>
                                                </div>
                                            )}
                                            {subsection.example.explanation && (
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    💡 {subsection.example.explanation}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Critical Point */}
                                {subsection.criticalPoint && (
                                    <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg flex gap-3">
                                        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                                        <p className="text-rose-900 dark:text-rose-100">
                                            <span className="font-bold">Critical Point:</span> {subsection.criticalPoint}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Content Object (for section-3 and section-4) */}
                        {section.content && (
                            <div className="space-y-6">
                                {/* Description */}
                                {section.content.description && (
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {section.content.description}
                                    </p>
                                )}

                                {/* Core Difference Comparison */}
                                {section.content.coreDifference && (
                                    <div className="grid md:grid-cols-1 gap-4">
                                        <Card className="border-rose-200 dark:border-rose-800">
                                            <CardHeader>
                                                <CardTitle className="text-rose-600 dark:text-rose-400">FALSE</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="space-y-2">
                                                    {section.content.coreDifference.FALSE?.map((item: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm">
                                                            <XCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>
        ))}
        </div>

      {/* Bottom CTA */ }
    <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-none shadow-xl">
        <CardContent className="p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold">Ready to Practice?</h3>
            <p className="text-emerald-50">
                Now that you understand the theory, test your knowledge with practice questions
            </p>
            <Link to="/reading/practice">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                    Start Practicing →
                </Button>
            </Link>
        </CardContent>
    </Card>
    </div >
  );
}
