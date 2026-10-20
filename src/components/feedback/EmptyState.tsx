import * as React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "No items found",
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-[18px] border border-default/50 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-xs",
        className
      )}
    >
      <div className="size-12 rounded-full bg-subtle/50 text-muted mb-4 flex items-center justify-center shrink-0">
        {icon ?? <Inbox className="size-6 text-muted" />}
      </div>
      <h4 className="font-heading font-semibold text-lg sm:text-xl text-heading tracking-tight mb-1">
        {title}
      </h4>
      {description && (
        <p className="font-sans text-xs sm:text-sm text-body leading-relaxed max-w-md mb-5">
          {description}
        </p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
