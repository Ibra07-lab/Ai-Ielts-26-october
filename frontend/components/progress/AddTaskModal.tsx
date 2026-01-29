import { useState } from "react";
import { Plus } from "lucide-react";
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

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
			<Card className="relative w-full max-w-md mx-4 overflow-hidden border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl">
				<CardContent className="p-6">
					<h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
						<div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
							<Plus className="h-4 w-4" />
						</div>
						Add Task
					</h3>
					<div className="space-y-3">
						<div className="space-y-1">
							<Label htmlFor="name">Task name</Label>
							<Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Complete Reading Practice Test 5" />
						</div>
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
					</div>
					<div className="mt-6 flex justify-end gap-2">
						<Button variant="outline" onClick={onClose}>Cancel</Button>
						<Button
							className="bg-indigo-500 hover:bg-indigo-400 text-white transition-all shadow-lg shadow-indigo-500/20"
							onClick={() => {
								onSubmit({ name, category, difficulty: "medium", estimatedMinutes: 30, dueAt: undefined });
								onClose();
								setName("");
								setCategory("reading");
							}}>Add</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}


