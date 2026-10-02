import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-[var(--primary)] text-white shadow-sm",
        secondary:
          "border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]",
        destructive:
          "border border-transparent bg-rose-500/20 text-rose-300 border-rose-500/30",
        outline:
          "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]",
        primarySubtle:
          "border border-[var(--primary)]/25 bg-[var(--primary)]/10 text-[var(--primary-light)] font-medium",
        pill:
          "rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] px-3 py-1 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
