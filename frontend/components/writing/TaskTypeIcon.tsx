
import React from 'react';

export type ChartType = "Line Graph" | "Bar Chart" | "Pie Chart" | "Map" | "Process" | "Table" | "Mixed" | "Generic" | "Essay";

interface TaskTypeIconProps {
    type: ChartType | string;
    className?: string;
    compact?: boolean;
}

export function TaskTypeIcon({ type, className = "" }: TaskTypeIconProps) {
    // Standardized SVG System
    // ViewBox: 0 0 200 160
    // Floor/Baseline: y=140
    // Safe Area: x=20 to x=180

    const strokeColor = "#94a3b8"; // Slate-400
    const fillColor = "#334155";   // Slate-700

    // High contrast accents for visibility against dark bg
    const accentColor = "#3b82f6"; // Blue-500

    const renderVisual = () => {
        switch (type) {
            case "Line Graph":
            case "Dual Axis Graph":
                return (
                    <svg viewBox="0 0 200 160" className="w-full h-full overflow-visible">
                        {/* Grid System - Fixed Baseline */}
                        <line x1="20" y1="140" x2="180" y2="140" stroke={strokeColor} strokeWidth="2" opacity="0.5" />
                        <line x1="20" y1="100" x2="180" y2="100" stroke={strokeColor} strokeWidth="1" opacity="0.2" />
                        <line x1="20" y1="60" x2="180" y2="60" stroke={strokeColor} strokeWidth="1" opacity="0.2" />

                        {/* Vertical Guides */}
                        <line x1="40" y1="140" x2="40" y2="40" stroke={strokeColor} strokeWidth="1" opacity="0.1" />
                        <line x1="80" y1="140" x2="80" y2="40" stroke={strokeColor} strokeWidth="1" opacity="0.1" />
                        <line x1="120" y1="140" x2="120" y2="40" stroke={strokeColor} strokeWidth="1" opacity="0.1" />
                        <line x1="160" y1="140" x2="160" y2="40" stroke={strokeColor} strokeWidth="1" opacity="0.1" />

                        {/* The Line - Straight Segments for "Technical" feel */}
                        <path d="M40 110 L 80 70 L 120 90 L 160 30"
                            fill="none" stroke={accentColor} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Data Points */}
                        <circle cx="40" cy="110" r="6" fill="#1e293b" stroke={accentColor} strokeWidth="3" />
                        <circle cx="80" cy="70" r="6" fill="#1e293b" stroke={accentColor} strokeWidth="3" />
                        <circle cx="120" cy="90" r="6" fill="#1e293b" stroke={accentColor} strokeWidth="3" />
                        <circle cx="160" cy="30" r="6" fill="#1e293b" stroke={accentColor} strokeWidth="3" />

                        {/* Area fill (optional, subtle) */}
                        <path d="M40 140 L 40 110 L 80 70 L 120 90 L 160 30 L 160 140 Z" fill={accentColor} opacity="0.1" />
                    </svg>
                );

            case "Bar Chart":
            case "Stacked Bar Chart":
                return (
                    <svg viewBox="0 0 200 160" className="w-full h-full overflow-visible">
                        <defs>
                            <linearGradient id="barCheck" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2dd4bf" />
                                <stop offset="100%" stopColor="#0f766e" />
                            </linearGradient>
                            <linearGradient id="barBlue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#60a5fa" />
                                <stop offset="100%" stopColor="#2563eb" />
                            </linearGradient>
                            <linearGradient id="barSlate" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#94a3b8" />
                                <stop offset="100%" stopColor="#475569" />
                            </linearGradient>
                        </defs>

                        {/* Floor Line */}
                        <line x1="20" y1="140" x2="180" y2="140" stroke={strokeColor} strokeWidth="2" opacity="0.5" />

                        {/* Bars - Explicit Rects for perfect shape control */}
                        {/* Bar 1 */}
                        <rect x="35" y="80" width="25" height="60" rx="4" fill="url(#barSlate)" stroke="#cbd5e1" strokeWidth="1" opacity="0.8" />

                        {/* Bar 2 (Feature) */}
                        <rect x="75" y="40" width="25" height="100" rx="4" fill="url(#barCheck)" stroke="#ccfbf1" strokeWidth="1" />

                        {/* Bar 3 */}
                        <rect x="115" y="65" width="25" height="75" rx="4" fill="url(#barSlate)" stroke="#cbd5e1" strokeWidth="1" opacity="0.8" />

                        {/* Bar 4 (Feature) */}
                        <rect x="155" y="30" width="25" height="110" rx="4" fill="url(#barBlue)" stroke="#dbeafe" strokeWidth="1" />
                    </svg>
                );

            case "Map":
                return (
                    <svg viewBox="0 0 200 160" className="w-full h-full overflow-visible">
                        {/* Map Silhouette Centered */}
                        <path d="M50 60 Q 60 30, 90 35 T 150 60 Q 170 80, 160 110 T 110 145 Q 70 150, 45 120 T 50 60 Z"
                            fill={fillColor} stroke={strokeColor} strokeWidth="2" opacity="0.4" />

                        {/* Contour Lines */}
                        <path d="M60 70 Q 70 50, 100 55 T 140 70" fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />

                        {/* Pin - Centered geometry */}
                        <g transform="translate(110, 80)">
                            {/* Shadow/Base */}
                            <ellipse cx="0" cy="20" rx="10" ry="4" fill="#000" opacity="0.3" />

                            {/* Pole */}
                            <line x1="0" y1="0" x2="0" y2="20" stroke="#cbd5e1" strokeWidth="3" />

                            {/* Head */}
                            <circle cx="0" cy="0" r="14" fill="#f97316" stroke="white" strokeWidth="3" />
                            <circle cx="0" cy="0" r="5" fill="#fff" />
                        </g>
                    </svg>
                );

            case "Process":
                return (
                    <svg viewBox="0 0 200 160" className="w-full h-full overflow-visible">
                        {/* Center Axis y=70 */}
                        {/* Dashed connector line */}
                        <line x1="55" y1="70" x2="145" y2="70" stroke={strokeColor} strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />

                        {/* Step 1: Input Box */}
                        <rect x="20" y="45" width="50" height="50" rx="10" fill={fillColor} stroke={strokeColor} strokeWidth="3" />
                        <circle cx="45" cy="70" r="6" fill={strokeColor} opacity="0.5" />

                        {/* Step 2: Processing Circle (Center) */}
                        <circle cx="100" cy="70" r="22" fill="#0f172a" stroke={accentColor} strokeWidth="4" />
                        <circle cx="100" cy="70" r="8" fill={accentColor} />

                        {/* Step 3: Output Box */}
                        <rect x="130" y="45" width="50" height="50" rx="10" fill={fillColor} stroke={strokeColor} strokeWidth="3" />
                        <circle cx="155" cy="70" r="6" fill={strokeColor} opacity="0.5" />
                    </svg>
                );

            case "Essay":
                return (
                    <svg viewBox="0 0 200 160" className="w-full h-full overflow-visible">
                        {/* Notebook (centered slightly left) */}
                        <g transform="translate(60, 30)">
                            {/* Notebook Body */}
                            <rect x="0" y="0" width="70" height="100" rx="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                            <rect x="0" y="0" width="12" height="100" rx="2" fill="#475569" /> {/* Side spine */}

                            {/* Rings */}
                            <rect x="-4" y="10" width="8" height="4" rx="1" fill="#1e293b" />
                            <rect x="-4" y="25" width="8" height="4" rx="1" fill="#1e293b" />
                            <rect x="-4" y="40" width="8" height="4" rx="1" fill="#1e293b" />
                            <rect x="-4" y="55" width="8" height="4" rx="1" fill="#1e293b" />
                            <rect x="-4" y="70" width="8" height="4" rx="1" fill="#1e293b" />
                            <rect x="-4" y="85" width="8" height="4" rx="1" fill="#1e293b" />

                            {/* Lines on page */}
                            <line x1="20" y1="20" x2="60" y2="20" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                            <line x1="20" y1="40" x2="60" y2="40" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                            <line x1="20" y1="55" x2="60" y2="55" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                            <line x1="20" y1="70" x2="60" y2="70" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                            <line x1="20" y1="85" x2="45" y2="85" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                        </g>

                        {/* Pen (angled) */}
                        <g transform="translate(145, 80) rotate(-45)">
                            <rect x="-6" y="-30" width="12" height="50" rx="2" fill="#1e293b" />
                            <path d="M-6 20 L 0 35 L 6 20 Z" fill="#1e293b" /> {/* Tip */}
                            <rect x="-2" y="-25" width="4" height="15" rx="1" fill="#64748b" /> {/* Clip */}
                            <circle cx="0" cy="32" r="1.5" fill="#94a3b8" /> {/* point */}
                        </g>
                    </svg>
                );

            case "Mixed Chart":
            case "Mixed":
                return (
                    <svg viewBox="0 0 200 160" className="w-full h-full overflow-visible">
                        <line x1="20" y1="140" x2="180" y2="140" stroke={strokeColor} strokeWidth="2" opacity="0.5" />
                        {/* Bars */}
                        <rect x="35" y="80" width="20" height="60" rx="3" fill="#475569" />
                        <rect x="85" y="50" width="20" height="90" rx="3" fill="#475569" />
                        <rect x="135" y="70" width="20" height="70" rx="3" fill="#475569" />
                        {/* Line overlay */}
                        <path d="M45 60 L 95 35 L 145 50" fill="none" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />
                        <circle cx="45" cy="60" r="5" fill={accentColor} />
                        <circle cx="95" cy="35" r="5" fill={accentColor} />
                        <circle cx="145" cy="50" r="5" fill={accentColor} />
                    </svg>
                );

            case "Table":
                return (
                    <svg viewBox="0 0 200 160" className="w-full h-full overflow-visible">
                        {/* Table grid */}
                        <rect x="30" y="30" width="140" height="100" rx="4" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
                        {/* Header row */}
                        <rect x="30" y="30" width="140" height="25" rx="4" fill="#475569" />
                        {/* Horizontal lines */}
                        <line x1="30" y1="55" x2="170" y2="55" stroke={strokeColor} strokeWidth="1" />
                        <line x1="30" y1="80" x2="170" y2="80" stroke={strokeColor} strokeWidth="1" opacity="0.5" />
                        <line x1="30" y1="105" x2="170" y2="105" stroke={strokeColor} strokeWidth="1" opacity="0.5" />
                        {/* Vertical lines */}
                        <line x1="80" y1="30" x2="80" y2="130" stroke={strokeColor} strokeWidth="1" opacity="0.5" />
                        <line x1="130" y1="30" x2="130" y2="130" stroke={strokeColor} strokeWidth="1" opacity="0.5" />
                    </svg>
                );

            case "Dual Line Graph":
                return (
                    <svg viewBox="0 0 200 160" className="w-full h-full overflow-visible">
                        <line x1="20" y1="140" x2="180" y2="140" stroke={strokeColor} strokeWidth="2" opacity="0.5" />
                        {/* Line 1 */}
                        <path d="M40 100 L 80 60 L 120 80 L 160 40" fill="none" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />
                        <circle cx="40" cy="100" r="5" fill={accentColor} />
                        <circle cx="80" cy="60" r="5" fill={accentColor} />
                        <circle cx="120" cy="80" r="5" fill={accentColor} />
                        <circle cx="160" cy="40" r="5" fill={accentColor} />
                        {/* Line 2 */}
                        <path d="M40 120 L 80 90 L 120 110 L 160 70" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="40" cy="120" r="5" fill="#10b981" />
                        <circle cx="80" cy="90" r="5" fill="#10b981" />
                        <circle cx="120" cy="110" r="5" fill="#10b981" />
                        <circle cx="160" cy="70" r="5" fill="#10b981" />
                    </svg>
                );



            case "Pie Chart":
                return (
                    <svg viewBox="0 0 200 160" className="w-full h-full overflow-visible">
                        <defs>
                            <linearGradient id="pieBlue" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#60a5fa" />
                                <stop offset="100%" stopColor="#2563eb" />
                            </linearGradient>
                            <linearGradient id="pieGreen" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#34d399" />
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                            <linearGradient id="pieAmber" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#fbbf24" />
                                <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                            <linearGradient id="pieSlate" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#94a3b8" />
                                <stop offset="100%" stopColor="#475569" />
                            </linearGradient>
                        </defs>

                        {/* 
                           Donut Chart Construction:
                           Center (100, 80). 
                           Radius approx 40. 
                           Stroke Width 35. (Inner ~22, Outer ~57).
                           Circumference ~251.
                        */}

                        {/* Background Ring (Grey - Remaining 35%) */}
                        <circle cx="100" cy="80" r="40" fill="none" stroke="url(#pieSlate)" strokeWidth="35" opacity="0.3" />

                        {/* Segment 1: Blue (25%) - Top Right 
                            Dash: 25% of 251 ≈ 63. Gap rest.
                            Rotate -90 to start at top. 
                        */}
                        <circle cx="100" cy="80" r="40" fill="none" stroke="url(#pieBlue)" strokeWidth="35"
                            strokeDasharray="63 189" strokeDashoffset="0" transform="rotate(-90 100 80)" />

                        {/* Segment 2: Green (25%) - Bottom Right
                            Starts after Blue (at 90 deg / 25%).
                            Dash: 63.
                            Rotate 0 to start at right (3 o'clock)? No, circle starts at 3 o'clock by default.
                            If Blue is -90 (12 o'clock) to 0 (3 o'clock).
                            Green needs to start at 0 (3 o'clock). 
                        */}
                        <circle cx="100" cy="80" r="40" fill="none" stroke="url(#pieGreen)" strokeWidth="35"
                            strokeDasharray="63 189" strokeDashoffset="0" transform="rotate(0 100 80)" />

                        {/* Segment 3: Amber (15%) - Bottom Left
                            Starts after Green (at 180 deg / 6 o'clock).
                            15% of 251 ≈ 38.
                        */}
                        <circle cx="100" cy="80" r="40" fill="none" stroke="url(#pieAmber)" strokeWidth="35"
                            strokeDasharray="38 213" strokeDashoffset="0" transform="rotate(90 100 80)" />

                    </svg>
                );

            case "Process Diagram":
                return (
                    <svg viewBox="0 0 200 160" className="w-full h-full overflow-visible">
                        {/* Arrows */}
                        <line x1="55" y1="70" x2="75" y2="70" stroke={strokeColor} strokeWidth="3" />
                        <line x1="115" y1="70" x2="135" y2="70" stroke={strokeColor} strokeWidth="3" />
                        <polygon points="75,65 85,70 75,75" fill={strokeColor} />
                        <polygon points="135,65 145,70 135,75" fill={strokeColor} />
                        {/* Step boxes */}
                        <rect x="15" y="45" width="40" height="50" rx="8" fill={accentColor} />
                        <rect x="85" y="45" width="40" height="50" rx="8" fill="#10b981" />
                        <rect x="145" y="45" width="40" height="50" rx="8" fill="#f59e0b" />
                        {/* Labels */}
                        <text x="35" y="75" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">1</text>
                        <text x="105" y="75" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">2</text>
                        <text x="165" y="75" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">3</text>
                    </svg>
                );

            default:
                return (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-slate-500 font-mono text-2xl">?</span>
                    </div>
                );
        }
    };

    return (
        <div className={`relative flex items-center justify-center select-none w-full h-full ${className}`}>
            {renderVisual()}
        </div>
    );
}
