import { Task } from "@/api/progress";
import { Check } from "lucide-react";

export default function TaskCard({
	task,
	onToggleComplete,
}: {
	task: Task;
	onToggleComplete: (task: Task) => void;
}) {
	const isCompleted = task.status === "completed" || task.progress >= 100;

	return (
		<div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
			<button
				onClick={() => onToggleComplete(task)}
				className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isCompleted
					? "bg-primary border-primary"
					: "border-muted-foreground/30 hover:border-primary"
					}`}
				aria-label="Toggle complete"
			>
				{isCompleted && <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />}
			</button>
			<span
				className={`flex-1 text-sm ${isCompleted
					? "text-muted-foreground line-through"
					: "text-foreground"
					}`}
			>
				{task.name}
			</span>
		</div>
	);
}
