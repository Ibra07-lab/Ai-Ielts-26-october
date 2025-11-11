export default function ProgressTrends({ data }: { data: number[] }) {
	const width = 200;
	const height = 60;
	const max = Math.max(1, ...data);
	const stepX = data.length > 1 ? width / (data.length - 1) : width;
	const points = data.map((v, i) => {
		const x = i * stepX;
		const y = height - (v / max) * height;
		return `${x},${y}`;
	}).join(" ");
	return (
		<svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-label="Weekly progress trend">
			<polyline fill="none" stroke="#0ea5e9" strokeWidth="2" points={points} />
		</svg>
	);
}


