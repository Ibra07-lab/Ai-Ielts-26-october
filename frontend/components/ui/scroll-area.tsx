import * as React from "react";
import { cn } from "@/lib/utils";

export type ScrollAreaProps = React.HTMLAttributes<HTMLDivElement>;

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					"overflow-auto [scrollbar-color:theme(colors.gray.300)_transparent] [scrollbar-width:thin]",
					className
				)}
				{...props}
			>
				{children}
			</div>
		);
	}
);
ScrollArea.displayName = "ScrollArea";


