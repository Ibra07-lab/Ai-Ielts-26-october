import { useState } from "react";
import { TaskCategory, TaskDifficulty } from "@/api/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddTaskModal({
	open,
	onClose,
	onSubmit,
	defaultDueISO,
}: {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: { name: string; category: TaskCategory; difficulty: TaskDifficulty; estimatedMinutes: number; dueAt?: string }) => void;
	defaultDueISO?: string;
}) {
	const [name, setName] = useState("");
	const [category, setCategory] = useState<TaskCategory>("reading");
	const [difficulty, setDifficulty] = useState<TaskDifficulty>("medium");
	const [estimatedMinutes, setEstimatedMinutes] = useState<number>(20);
	const [dueAt, setDueAt] = useState<string | undefined>(defaultDueISO);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/30" onClick={onClose} />
			<Card className="relative w-full max-w-md mx-4">
				<CardContent className="p-6">
					<h3 className="text-lg font-semibold mb-4">Add Task</h3>
					<div className="space-y-3">
						<div className="space-y-1">
							<Label htmlFor="name">Task name</Label>
							<Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Complete Reading Practice Test 5" />
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								<Label>Category</Label>
								<Select value={category} onValueChange={(v) => setCategory(v as TaskCategory)}>
									<SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
									<SelectContent>
										<SelectItem value="reading">Reading</SelectItem>
										<SelectItem value="writing">Writing</SelectItem>
										<SelectItem value="speaking">Speaking</SelectItem>
										<SelectItem value="listening">Listening</SelectItem>
										<SelectItem value="vocabulary">Vocabulary</SelectItem>
										<SelectItem value="grammar">Grammar</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-1">
								<Label>Difficulty</Label>
								<Select value={difficulty} onValueChange={(v) => setDifficulty(v as TaskDifficulty)}>
									<SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
									<SelectContent>
										<SelectItem value="easy">Easy</SelectItem>
										<SelectItem value="medium">Medium</SelectItem>
										<SelectItem value="hard">Hard</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								<Label htmlFor="minutes">Estimated minutes</Label>
								<Input id="minutes" type="number" min={5} max={120} value={estimatedMinutes} onChange={(e) => setEstimatedMinutes(Number(e.target.value || 0))} />
							</div>
							<div className="space-y-1">
								<Label htmlFor="due">Due date/time</Label>
								<Input id="due" type="datetime-local" value={dueAt ?? ""} onChange={(e) => setDueAt(e.target.value || undefined)} />
							</div>
						</div>
					</div>
					<div className="mt-6 flex justify-end gap-2">
						<Button variant="outline" onClick={onClose}>Cancel</Button>
						<Button onClick={() => {
							onSubmit({ name, category, difficulty, estimatedMinutes, dueAt });
							onClose();
							setName("");
							setCategory("reading");
							setDifficulty("medium");
							setEstimatedMinutes(20);
							setDueAt(defaultDueISO);
						}}>Add</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}


