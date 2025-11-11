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
		<div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
			<button
				onClick={() => onToggleComplete(task)}
				className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
					isCompleted
						? "bg-gray-700 dark:bg-gray-600 border-gray-700 dark:border-gray-600"
						: "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
				}`}
				aria-label="Toggle complete"
			>
				{isCompleted && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
			</button>
			<span
				className={`flex-1 text-sm ${
					isCompleted
						? "text-gray-400 dark:text-gray-500 line-through"
						: "text-gray-700 dark:text-gray-300"
				}`}
			>
				{task.name}
			</span>
		</div>
	);
}


