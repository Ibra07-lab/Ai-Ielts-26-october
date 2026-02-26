import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { RetentionCurveData, CurvePoint, ReviewMarker, generateDemoCurveData } from "@/lib/vocabulary/forgetting-curve";
import type { WordData, Topic } from "@/data/vocabulary/types";
import { ArrowRight, Brain, Clock, Layers } from "lucide-react";

interface RetentionCurveProps {
    data?: RetentionCurveData;
    className?: string;
    studyList?: WordData[];
    topics?: Topic[];
}

// Chart dimensions
const CHART_W = 680;
const CHART_H = 280;
const PADDING = { top: 30, right: 10, bottom: 40, left: 45 };
const PLOT_W = CHART_W - PADDING.left - PADDING.right;
const PLOT_H = CHART_H - PADDING.top - PADDING.bottom;

// X-axis tick days (non-linear spacing)
const X_TICKS = [1, 3, 7, 14, 30];
const Y_TICKS = [0.25, 0.50, 0.75, 1.0];

// Scale functions
function scaleX(day: number): number {
    // Use sqrt scale for better visual distribution
    const maxDay = 30;
    const normalized = Math.sqrt(Math.max(0, day)) / Math.sqrt(maxDay);
    return PADDING.left + normalized * PLOT_W;
}

function scaleY(retention: number): number {
    return PADDING.top + (1 - retention) * PLOT_H;
}

// Generate smooth SVG path from points
function pointsToPath(points: CurvePoint[]): string {
    if (points.length === 0) return "";

    const coords = points.map(p => ({ x: scaleX(p.day), y: scaleY(p.retention) }));

    if (coords.length === 1) return `M${coords[0].x},${coords[0].y}`;

    // Catmull-Rom to cubic bezier for smooth curves
    let d = `M${coords[0].x},${coords[0].y}`;

    for (let i = 0; i < coords.length - 1; i++) {
        const p0 = coords[Math.max(0, i - 1)];
        const p1 = coords[i];
        const p2 = coords[i + 1];
        const p3 = coords[Math.min(coords.length - 1, i + 2)];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    return d;
}

// Generate fill path (curve + bottom edge)
function pointsToFillPath(points: CurvePoint[]): string {
    if (points.length === 0) return "";

    const curvePath = pointsToPath(points);
    const lastX = scaleX(points[points.length - 1].day);
    const firstX = scaleX(points[0].day);
    const bottomY = scaleY(0);

    return `${curvePath} L${lastX},${bottomY} L${firstX},${bottomY} Z`;
}

export default function RetentionCurve({ data, className, studyList = [], topics = [] }: RetentionCurveProps) {
    const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);

    const curveData = useMemo(() => data || generateDemoCurveData(), [data]);

    // Flatten all segments into one continuous set for the fill
    const allPoints = useMemo(() => {
        return curveData.curveSegments.flat();
    }, [curveData]);

    // Group due words by topic
    const dueByTopic = useMemo(() => {
        if (!studyList.length) return [];

        const groups: Record<number, { topic: Topic | undefined, count: number, words: WordData[] }> = {};

        studyList.forEach(word => {
            // Find topic - loosely matching string ID to helper mapping or just grouping by string
            // Assuming word.topic is a string ID like 'environment', 'education'.
            // And topics prop has definitions.

            // We need to map word.topic (string) to Topic (object)
            const topicObj = topics.find(t => t.id.toString() === word.topic || t.name.toLowerCase() === word.topic.toLowerCase())
                || topics.find(t => t.name.toLowerCase().includes(word.topic.toLowerCase()));

            const topicId = topicObj?.id || 0; // 0 for misc

            if (!groups[topicId]) {
                groups[topicId] = { topic: topicObj, count: 0, words: [] };
            }
            groups[topicId].count++;
            groups[topicId].words.push(word);
        });

        // Filter out misc group if topic not found, or keep with default name
        return Object.values(groups)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3); // Take top 3
    }, [studyList, topics]);

    return (
        <div className={cn(
            "p-5 border rounded-xl shadow-lg glass-panel border-slate-200 dark:border-white/10 flex",
            className
        )}>
            {/* Chart Section - Takes full width if no due words, else 2/3 */}
            <div className={cn(
                "flex flex-col h-full",
                studyList.length > 0 ? "w-2/3 pr-5 border-r border-slate-100 dark:border-white/5" : "w-full"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Retention Curve</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Review effectiveness over time</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"></span>
                            Review Points
                        </span>
                    </div>
                </div>

                {/* SVG Chart */}
                <div className="flex-1 min-h-0 flex items-end">
                    <svg
                        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                        className="w-full h-auto max-h-full"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            {/* Gradient fill under curve */}
                            <linearGradient id="retentionFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgb(14, 165, 233)" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="rgb(14, 165, 233)" stopOpacity="0.02" />
                            </linearGradient>

                            {/* Glow filter for review dots */}
                            <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="2" result="glow" />
                                <feMerge>
                                    <feMergeNode in="glow" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Grid lines */}
                        {Y_TICKS.map((tick) => (
                            <g key={tick}>
                                <line
                                    x1={PADDING.left}
                                    y1={scaleY(tick)}
                                    x2={PADDING.left + PLOT_W}
                                    y2={scaleY(tick)}
                                    stroke="currentColor"
                                    className="text-slate-200 dark:text-white/5"
                                    strokeWidth="0.5"
                                    strokeDasharray="4,4"
                                />
                                <text
                                    x={PADDING.left - 8}
                                    y={scaleY(tick) + 3}
                                    textAnchor="end"
                                    className="text-[10px]"
                                    fill="rgb(148, 163, 184)"
                                >
                                    {Math.round(tick * 100)}%
                                </text>
                            </g>
                        ))}

                        {/* X-axis ticks */}
                        {X_TICKS.map((day) => (
                            <g key={day}>
                                <line
                                    x1={scaleX(day)}
                                    y1={PADDING.top}
                                    x2={scaleX(day)}
                                    y2={PADDING.top + PLOT_H}
                                    stroke="currentColor"
                                    className="text-slate-200 dark:text-white/5"
                                    strokeWidth="0.5"
                                    strokeDasharray="4,4"
                                />
                                <text
                                    x={scaleX(day)}
                                    y={CHART_H - 8}
                                    textAnchor="middle"
                                    className="text-[10px]"
                                    fill="rgb(148, 163, 184)"
                                >
                                    Day {day}
                                </text>
                            </g>
                        ))}

                        {/* Fill under curves */}
                        {curveData.curveSegments.map((segment, i) => (
                            <path
                                key={`fill-${i}`}
                                d={pointsToFillPath(segment)}
                                fill="url(#retentionFill)"
                            />
                        ))}

                        {/* Curve lines */}
                        {curveData.curveSegments.map((segment, i) => (
                            <path
                                key={`line-${i}`}
                                d={pointsToPath(segment)}
                                fill="none"
                                stroke="rgb(14, 165, 233)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        ))}

                        {/* Review Points (Markers) */}
                        {curveData.reviewMarkers.map((marker, i) => (
                            <g
                                key={i}
                                onMouseEnter={() => setHoveredMarker(i)}
                                onMouseLeave={() => setHoveredMarker(null)}
                                className="cursor-pointer"
                            >
                                <circle
                                    cx={scaleX(marker.day)}
                                    cy={scaleY(marker.retention)}
                                    r="4"
                                    fill="white"
                                    stroke="rgb(16, 185, 129)"
                                    strokeWidth="2"
                                    filter="url(#dotGlow)"
                                />
                                {hoveredMarker === i && (
                                    <g>
                                        <rect
                                            x={scaleX(marker.day) - 40}
                                            y={scaleY(marker.retention) - 35}
                                            width="80"
                                            height="25"
                                            rx="4"
                                            fill="rgb(15, 23, 42)"
                                            className="dark:fill-slate-800"
                                        />
                                        <text
                                            x={scaleX(marker.day)}
                                            y={scaleY(marker.retention) - 18}
                                            textAnchor="middle"
                                            fill="white"
                                            className="text-[10px] font-medium"
                                        >
                                            Review #{marker.reviewNumber}: {Math.round(marker.retention * 100)}%
                                        </text>
                                    </g>
                                )}
                            </g>
                        ))}

                        {/* X-axis line */}
                        <line
                            x1={PADDING.left}
                            y1={PADDING.top + PLOT_H}
                            x2={PADDING.left + PLOT_W}
                            y2={PADDING.top + PLOT_H}
                            stroke="currentColor"
                            className="text-slate-300 dark:text-white/10"
                            strokeWidth="1"
                        />

                        {/* Y-axis line */}
                        <line
                            x1={PADDING.left}
                            y1={PADDING.top}
                            x2={PADDING.left}
                            y2={PADDING.top + PLOT_H}
                            stroke="currentColor"
                            className="text-slate-300 dark:text-white/10"
                            strokeWidth="1"
                        />
                    </svg>
                </div>
            </div>

            {/* Focus Areas Section - Only visible if there are words to study */}
            {studyList.length > 0 && (
                <div className="w-1/3 pl-5 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Focus Areas</h3>
                        <span className="text-xs font-medium text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-100 dark:border-rose-500/20">
                            {studyList.length} Due
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-4">
                        {dueByTopic.map((group, idx) => (
                            <div key={idx} className="bg-slate-50/50 dark:bg-white/5 rounded-lg p-3 border border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="text-lg">{group.topic?.icon || '📚'}</div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                                            {group.topic?.name || 'General'}
                                        </h4>
                                        <p className="text-[10px] text-slate-400">
                                            {group.count} words due
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {group.words.slice(0, 3).map(word => (
                                        <span key={word.id} className="text-[10px] px-1.5 py-0.5 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded text-slate-600 dark:text-slate-300">
                                            {word.word}
                                        </span>
                                    ))}
                                    {group.count > 3 && (
                                        <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                                            +{group.count - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Button */}
                    <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-medium transition-colors shadow-lg shadow-sky-500/20 dark:shadow-none">
                        <Brain className="w-4 h-4" />
                        Start Smart Review
                    </button>
                </div>
            )}
        </div>
    );
}
