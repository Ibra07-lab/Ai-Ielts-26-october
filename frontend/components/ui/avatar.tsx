import * as React from "react";
import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Avatar({ className, children, ...props }: DivProps) {
	return (
		<div
			className={cn(
				"inline-flex h-10 w-10 select-none items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function AvatarFallback({ className, children, ...props }: DivProps) {
	return (
		<div
			className={cn(
				"flex h-full w-full items-center justify-center text-xs font-medium",
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}


