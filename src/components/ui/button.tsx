import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-sans font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]",
  {
    variants: {
      variant: {
        /* Figma: Property 1=Primary Button (#1e2b22) */
        default:
          "bg-primary text-dark-primary shadow-sm hover:bg-primary/90 focus-visible:ring-primary",
        primary:
          "bg-primary text-dark-primary shadow-sm hover:bg-primary/90 focus-visible:ring-primary",

        /* Figma: Property 1=Secondary Button (#c9ab6a) */
        secondary:
          "bg-accent text-white border border-accent shadow-sm hover:bg-accent/90 focus-visible:ring-accent",

        /* Brand Secondary Olive (#6b7a5e) */
        "brand-secondary":
          "bg-secondary text-white shadow-sm hover:bg-secondary/90 focus-visible:ring-secondary",

        /* Brand Accent / Gold (#c9ab6a) */
        accent:
          "bg-accent text-white border border-accent shadow-sm hover:bg-accent/90 focus-visible:ring-accent",
        gold:
          "bg-accent text-white border border-accent shadow-sm hover:bg-accent/90 focus-visible:ring-accent",

        /* Figma: Property 1=Success Button (#16a34a) */
        success:
          "bg-status-success text-white shadow-sm hover:bg-status-success/90 focus-visible:ring-status-success",

        /* Figma: Property 1=Danger Button (#dc2626) */
        danger:
          "bg-status-error text-white shadow-sm hover:bg-status-error/90 focus-visible:ring-status-error",
        destructive:
          "bg-status-error text-white shadow-sm hover:bg-status-error/90 focus-visible:ring-status-error",

        /* Figma: Property 1=gradient (Royal Blue Gradient) */
        gradient:
          "bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-900 text-white shadow-sm hover:opacity-95 focus-visible:ring-blue-600",

        /* Figma: Property 1=white (Card background with subtle border) */
        white:
          "bg-card border border-default text-heading shadow-sm hover:bg-subtle/50 focus-visible:ring-primary",
        outline:
          "bg-card border border-default text-heading shadow-sm hover:bg-subtle/50 focus-visible:ring-primary",

        /* Figma: Property 1=Mutes (#d1d5db / subtle surface) */
        mutes:
          "bg-subtle border border-default text-muted shadow-none hover:bg-subtle/80 focus-visible:ring-muted",
        muted:
          "bg-subtle border border-default text-muted shadow-none hover:bg-subtle/80 focus-visible:ring-muted",

        /* Additional Clean Interactive Utilities */
        ghost:
          "bg-transparent text-heading hover:bg-subtle/50 focus-visible:ring-primary shadow-none",
        link:
          "bg-transparent text-primary underline-offset-4 hover:underline shadow-none p-0 h-auto rounded-none",
      },
      size: {
        /* Figma Exact Dimension: Height 47px, px 22px, py 10px, radius 22px, gap 10px, icon 18px */
        default:
          "h-[47px] px-[22px] py-[10px] text-sm rounded-[22px] gap-[10px] [&_svg]:size-[18px]",
        md:
          "h-[47px] px-[22px] py-[10px] text-sm rounded-[22px] gap-[10px] [&_svg]:size-[18px]",

        /* Compact for tables, filters, and modal headers */
        sm:
          "h-9 px-3.5 py-1.5 text-xs rounded-[18px] gap-2 [&_svg]:size-4",

        /* Large touch targets (56px) for POS terminal counters, tender buttons */
        lg:
          "h-14 px-6 py-3 text-base rounded-[24px] gap-3 [&_svg]:size-5",

        /* Extra Large Hero CTA (64px) for Complete Sale / Checkout */
        xl:
          "h-16 px-8 py-4 text-lg font-semibold rounded-[28px] gap-3.5 [&_svg]:size-6",

        /* Icon Button Sizes */
        icon:
          "h-[47px] w-[47px] p-0 rounded-full justify-center gap-0 [&_svg]:size-[18px]",
        "icon-sm":
          "h-9 w-9 p-0 rounded-full justify-center gap-0 [&_svg]:size-4",
        "icon-lg":
          "h-14 w-14 p-0 rounded-full justify-center gap-0 [&_svg]:size-6",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin shrink-0" />
        ) : leftIcon ? (
          <span className="inline-flex shrink-0 items-center justify-center">
            {leftIcon}
          </span>
        ) : null}

        {children}

        {rightIcon && !isLoading ? (
          <span className="inline-flex shrink-0 items-center justify-center">
            {rightIcon}
          </span>
        ) : null}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

