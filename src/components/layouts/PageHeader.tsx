import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  children,
  className,
  titleClassName,
  descriptionClassName,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none",
        className
      )}
    >
      {/* Title & Subtitle */}
      <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0">
        <h1
          className={cn(
            "font-heading font-semibold text-2xl sm:text-[28px] text-heading tracking-[-0.4px] leading-tight",
            titleClassName
          )}
        >
          {title}
        </h1>
        {description && (
          <div
            className={cn(
              "font-sans text-xs sm:text-sm text-body leading-normal",
              descriptionClassName
            )}
          >
            {description}
          </div>
        )}
      </div>

      {/* Action Buttons Slot */}
      {(actions || children) && (
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap shrink-0">
          {actions}
          {children}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
