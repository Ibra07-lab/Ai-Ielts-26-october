import { useEffect, useMemo, useRef, useState } from "react";

export default function CircularProgress({ percent, size = 160, stroke = 12, color = "#0ea5e9" }: { percent: number; size?: number; stroke?: number; color?: string }) {
	const radius = useMemo(() => (size / 2) - stroke - 2, [size, stroke]);
	const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
	const [animated, setAnimated] = useState(0);
	const prev = useRef(0);

	useEffect(() => {
		const start = prev.current;
		const end = Math.max(0, Math.min(100, percent));
		const duration = 500;
		const t0 = performance.now();
		let raf = 0;
		const frame = (t: number) => {
			const p = Math.min(1, (t - t0) / duration);
			const val = start + (end - start) * p;
			setAnimated(val);
			if (p < 1) {
				raf = requestAnimationFrame(frame);
			} else {
				prev.current = end;
			}
		};
		raf = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(raf);
	}, [percent]);

	const dashOffset = useMemo(() => circumference * (1 - animated / 100), [circumference, animated]);

	return (
		<svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={`Progress ${Math.round(animated)}%`}>
			<circle r={radius} cx={size / 2} cy={size / 2} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
			<circle
				r={radius}
				cx={size / 2}
				cy={size / 2}
				stroke={color}
				strokeWidth={stroke}
				fill="none"
				strokeDasharray={`${circumference} ${circumference}`}
				strokeDashoffset={dashOffset}
				strokeLinecap="round"
				style={{ transition: "stroke-dashoffset 0.3s ease" }}
			/>
			<text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize={Math.round(size * 0.18)} fill="#111827" className="dark:fill-white">
				{Math.round(animated)}%
			</text>
		</svg>
	);
}


