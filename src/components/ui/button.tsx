import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary-gradient)] text-white shadow-md shadow-[var(--primary)]/25 hover:shadow-lg hover:shadow-[var(--primary)]/40 hover:-translate-y-0.5 active:translate-y-0",
        primary:
          "bg-[var(--primary-gradient)] text-white shadow-md shadow-[var(--primary)]/25 hover:shadow-lg hover:shadow-[var(--primary)]/40 hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-[var(--border)] bg-[var(--surface-2)]/80 text-[var(--text)] hover:border-[var(--primary)]/60 hover:bg-[var(--surface-2)] hover:text-[var(--text-bright)] shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-3)] hover:text-[var(--text-bright)] shadow-sm",
        ghost:
          "text-[var(--muted)] hover:text-[var(--text-bright)] hover:bg-[var(--surface-2)]",
        link:
          "text-[var(--primary-light)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-3.5 text-xs rounded-lg",
        lg: "h-12 px-7 text-sm rounded-xl",
        icon: "h-9 w-9 rounded-lg",
        iconRound: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
