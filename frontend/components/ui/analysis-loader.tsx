"use client"
import { useState, useEffect } from "react"
import { TextShimmerWave } from "./text-shimmer-wave"
import { Sparkles } from "lucide-react"

const MESSAGES = [
    "Reading your work...",
    "Spotting mistakes...",
    "Writing feedback...",
    "Almost done..."
]

export function AnalysisLoader() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % MESSAGES.length)
        }, 2500) // Switch every 2.5 seconds for better pacing
        return () => clearInterval(interval)
    }, [])

    return (
        <span className="flex items-center gap-2 min-w-[140px]">
            <Sparkles className="w-4 h-4 animate-spin" />
            <TextShimmerWave
                key={MESSAGES[index]}
                className='font-mono text-sm'
                duration={1}
            >
                {MESSAGES[index]}
            </TextShimmerWave>
        </span>
    )
}
