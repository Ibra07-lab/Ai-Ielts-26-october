import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all transform disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xs: "h-7 px-2.5 text-xs has-[>svg]:px-1.5", // New extra small size
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  // Check if button has discernible text content
  const hasTextContent = React.useMemo(() => {
    if (typeof children === 'string' && children.trim()) return true;
    if (React.isValidElement(children)) {
      const childProps = (children as React.ReactElement<any, any>).props as { children?: React.ReactNode };
      if (typeof childProps?.children === 'string' && childProps.children.trim()) return true;
    }
    if (Array.isArray(children)) {
      return children.some(child =>
        (typeof child === 'string' && child.trim()) ||
        (React.isValidElement(child) &&
          typeof (child.props as any)?.children === 'string' &&
          (child.props as any).children.trim())
      );
    }
    return false;
  }, [children]);

  // For icon-only buttons, ensure aria-label is present
  const accessibilityProps = React.useMemo(() => {
    if (!hasTextContent && !props['aria-label'] && !props['aria-labelledby']) {
      console.warn('Button with only icon content should have an aria-label for accessibility');
    }
    return {};
  }, [hasTextContent, props]);

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...accessibilityProps}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { Button, buttonVariants }
