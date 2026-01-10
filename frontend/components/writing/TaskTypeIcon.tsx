
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
                        {/* Document centered */}
                        <rect x="65" y="30" width="70" height="100" rx="4" fill={fillColor} stroke={strokeColor} strokeWidth="2" />

                        {/* Lines */}
                        <line x1="80" y1="50" x2="120" y2="50" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
                        <line x1="80" y1="70" x2="120" y2="70" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
                        <line x1="80" y1="90" x2="105" y2="90" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />

                        {/* Floating Badge */}
                        <circle cx="130" cy="120" r="16" fill="#1e293b" stroke={accentColor} strokeWidth="3" />
                        <path d="M125 125 L135 115 M135 125 L125 115" stroke={accentColor} strokeWidth="2" />
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
