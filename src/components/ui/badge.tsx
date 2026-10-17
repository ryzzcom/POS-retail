import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center border font-sans font-normal transition-colors select-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        /* Standard Solid Badges */
        default:
          "border-transparent bg-primary text-dark-primary shadow-xs hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-white hover:bg-secondary/90",
        gold:
          "border-transparent bg-accent text-white hover:bg-accent/90",
        accent:
          "border-transparent bg-accent text-white hover:bg-accent/90",
        destructive:
          "border-transparent bg-status-error text-white shadow-xs hover:bg-status-error/90",
        outline:
          "text-heading border-default bg-transparent",

        /* Figma Semantic Status Pill Badges (Node 3386:16504, 3386:16522, 3386:16540) */
        error:
          "border-status-error bg-status-error-bg text-status-error",
        failed:
          "border-status-error bg-status-error-bg text-status-error",
        success:
          "border-status-success bg-status-success-bg text-status-success",
        delivered:
          "border-status-success bg-status-success-bg text-status-success",
        neutral:
          "border-body/50 bg-card text-body",
        "not-sent":
          "border-body/50 bg-card text-body",
        warning:
          "border-status-warning bg-status-warning-bg text-status-warning",
      },
      size: {
        /* Figma standard pill height: 32px, px 16px, rounded 50px */
        default: "h-[32px] px-4 text-sm rounded-full",
        sm: "h-6 px-2.5 text-xs rounded-full",
        lg: "h-9 px-5 text-sm rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
