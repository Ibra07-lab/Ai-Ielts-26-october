// ============================================================================
// CIRCULAR PROGRESS RING COMPONENT
// ============================================================================
// Displays IELTS band scores as animated circular progress rings

import { useEffect, useState } from "react";

export type CircularProgressSize = "sm" | "md" | "lg";

interface CircularProgressProps {
    value: number; // The band score (e.g., 6.5)
    max?: number; // Maximum band (default 9)
    color: string; // Stroke color based on band level
    size?: CircularProgressSize; // Size variant
    showValue?: boolean; // Whether to show the number in center
    strokeWidth?: number; // Custom stroke width
}

const SIZE_CONFIG = {
    sm: {
        width: 80,
        height: 80,
        strokeWidth: 6,
        fontSize: "text-xl",
    },
    md: {
        width: 120,
        height: 120,
        strokeWidth: 8,
        fontSize: "text-3xl",
    },
    lg: {
        width: 160,
        height: 160,
        strokeWidth: 10,
        fontSize: "text-4xl",
    },
};

export function CircularProgress({
    value,
    max = 9,
    color,
    size = "md",
    showValue = true,
    strokeWidth: customStrokeWidth,
}: CircularProgressProps) {
    const [progress, setProgress] = useState(0);
    const config = SIZE_CONFIG[size];
    const strokeWidth = customStrokeWidth || config.strokeWidth;

    // Calculate dimensions
    const width = config.width;
    const height = config.height;
    const radius = (width - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = width / 2;

    // Calculate progress percentage
    const percentage = Math.min((value / max) * 100, 100);
    const offset = circumference - (progress / 100) * circumference;

    // Animate progress on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(percentage);
        }, 100);

        return () => clearTimeout(timer);
    }, [percentage]);

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                width={width}
                height={height}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* Progress circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-in-out"
                />
            </svg>

            {/* Center value */}
            {showValue && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`font-bold ${config.fontSize}`} style={{ color }}>
                        {value.toFixed(1)}
                    </span>
                </div>
            )}
        </div>
    );
}

// Helper function to get color based on band score
export function getBandColor(band: number): string {
    if (band >= 7.0) return "#10B981"; // Green
    if (band >= 5.5) return "#F59E0B"; // Amber
    return "#EF4444"; // Red
}

// Helper function to get background color based on band score
export function getBandBgColor(band: number): string {
    if (band >= 7.0) return "#D1FAE5"; // Green bg
    if (band >= 5.5) return "#FEF3C7"; // Amber bg
    return "#FEE2E2"; // Red bg
}
