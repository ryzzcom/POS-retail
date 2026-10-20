import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred while loading this view.",
  onRetry,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "bg-status-error-bg/50 border border-status-error/30 rounded-[18px] p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-xs",
        className
      )}
    >
      <div className="size-12 rounded-full bg-status-error-bg text-status-error mb-4 flex items-center justify-center shrink-0">
        <AlertCircle className="size-6 text-status-error" />
      </div>
      <h4 className="font-heading font-semibold text-lg sm:text-xl text-heading tracking-tight mb-1">
        {title}
      </h4>
      {message && (
        <p className="font-sans text-xs sm:text-sm text-body leading-relaxed max-w-md mb-6">
          {message}
        </p>
      )}
      {action ? (
        <div className="mt-1">{action}</div>
      ) : onRetry ? (
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="rounded-full gap-2 border-status-error/40 hover:bg-status-error-bg/80 text-heading"
        >
          <RotateCcw className="size-3.5" />
          <span>Try Again</span>
        </Button>
      ) : null}
    </div>
  );
}
