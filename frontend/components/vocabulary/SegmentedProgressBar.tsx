import React from "react";
import { cn } from "@/lib/utils";

interface SegmentedProgressBarProps {
    total?: number;
    current: number;
    colorClass?: string;
    className?: string;
}

export function SegmentedProgressBar({
    total = 34,
    current,
    colorClass = "bg-sky-500",
    className
}: SegmentedProgressBarProps) {
    return (
        <div className={cn("flex gap-[2px] w-full", className)}>
            {Array.from({ length: total }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        "h-2 w-full rounded-[1px] transition-all duration-500",
                        index < current
                            ? cn(colorClass, "shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]")
                            : "bg-gray-200 dark:bg-white/[0.03]"
                    )}
                />
            ))}
        </div>
    );
}
