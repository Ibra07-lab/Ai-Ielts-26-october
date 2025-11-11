import { useState } from "react";
import { TaskSuggestion, SummaryRange } from "@/api/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AISuggestDrawer({
	open,
	onClose,
	onGenerate,
	onAccept,
	initialRange = "weekly",
}: {
	open: boolean;
	onClose: () => void;
	onGenerate: (opts: { range: SummaryRange; timeAvailableMinutes: number }) => Promise<TaskSuggestion[]>;
	onAccept: (suggestions: TaskSuggestion[]) => Promise<void>;
	initialRange?: SummaryRange;
}) {
	const [range, setRange] = useState<SummaryRange>(initialRange);
	const [time, setTime] = useState<number>(60);
	const [loading, setLoading] = useState(false);
	const [suggestions, setSuggestions] = useState<TaskSuggestion[] | null>(null);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50">
			<div className="absolute inset-0 bg-black/30" onClick={onClose} />
			<div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white dark:bg-gray-900 shadow-xl">
				<div className="p-4 border-b border-gray-200 dark:border-gray-800">
					<h3 className="text-lg font-semibold">AI Suggestions</h3>
					<p className="text-sm text-gray-600 dark:text-gray-300">I can design tasks that can boost your progress.</p>
				</div>
				<div className="p-4 space-y-4">
					<Card>
						<CardContent className="p-4 space-y-3">
							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-1">
									<Label>Range</Label>
									<Select value={range} onValueChange={(v) => setRange(v as SummaryRange)}>
										<SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
										<SelectContent>
											<SelectItem value="daily">Daily</SelectItem>
											<SelectItem value="weekly">Weekly</SelectItem>
											<SelectItem value="monthly">Monthly</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-1">
									<Label htmlFor="time">Available time (minutes)</Label>
									<Input id="time" type="number" min={15} max={180} value={time} onChange={(e) => setTime(Number(e.target.value || 0))} />
								</div>
							</div>
							<div className="flex justify-end">
								<Button
									onClick={async () => {
										setLoading(true);
										try {
											const res = await onGenerate({ range, timeAvailableMinutes: time });
											setSuggestions(res);
										} finally {
											setLoading(false);
										}
									}}
									disabled={loading}
								>
									{loading ? "Generating..." : "Generate"}
								</Button>
							</div>
						</CardContent>
					</Card>
					{sSuggestions(suggestions, async () => {
						if (!suggestions) return;
						await onAccept(suggestions);
						onClose();
					})}
				</div>
			</div>
		</div>
	);
}

function sSuggestions(suggestions: TaskSuggestion[] | null, onAccept: () => void) {
	if (!suggestions) return null;
	return (
		<>
			<div className="space-y-2">
				{suggestions.map((s, idx) => (
					<Card key={idx}>
						<CardContent className="p-3">
							<p className="font-medium">{s.name}</p>
							<p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
								{s.category} • {s.difficulty} • {s.estimatedMinutes}m
							</p>
						</CardContent>
					</Card>
				))}
			</div>
			<div className="flex justify-end">
				<Button onClick={onAccept}>Accept</Button>
			</div>
		</>
	);
}


