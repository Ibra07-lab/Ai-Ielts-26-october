import { useEffect, useState } from "react";

export default function Confetti({ trigger }: { trigger: number }) {
	const [shots, setShots] = useState<number[]>([]);
	useEffect(() => {
		if (trigger <= 0) return;
		const ids = Array.from({ length: 18 }).map((_, i) => i + trigger * 1000);
		setShots(ids);
		const t = setTimeout(() => setShots([]), 1200);
		return () => clearTimeout(t);
	}, [trigger]);
	if (!shots.length) return null;
	return (
		<div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
			{shots.map((id) => {
				const left = Math.random() * 100;
				const delay = Math.random() * 0.3;
				const rotate = (Math.random() * 120 - 60).toFixed(0);
				const emoji = Math.random() > 0.5 ? "🎉" : "✨";
				return (
					<span
						key={id}
						className="absolute text-2xl animate-fall"
						style={{
							left: `${left}%`,
							top: `-10%`,
							animationDelay: `${delay}s`,
							transform: `rotate(${rotate}deg)`,
						}}
					>
						{emoji}
					</span>
				);
			})}
			<style>{`
        @keyframes fall {
          0% { transform: translateY(-10%) rotate(0deg); opacity: 1; }
          100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
        }
        .animate-fall {
          animation: fall 1.2s ease-in forwards;
        }
      `}</style>
		</div>
	);
}


