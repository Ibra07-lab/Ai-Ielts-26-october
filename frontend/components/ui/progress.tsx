import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  "aria-label"?: string;
  "aria-labelledby"?: string;
}) {
  // Ensure progress has an accessible name
  const accessibilityProps = React.useMemo(() => {
    if (!ariaLabel && !ariaLabelledBy) {
      console.warn('Progress component should have an aria-label or aria-labelledby for accessibility');
    }
    
    return {
      "aria-label": ariaLabel || (value !== undefined ? `Progress ${Math.round(value)}%` : "Progress"),
      "aria-labelledby": ariaLabelledBy,
      "aria-valuetext": value !== undefined ? `${Math.round(value)} percent` : undefined,
    };
  }, [ariaLabel, ariaLabelledBy, value]);

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...accessibilityProps}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
