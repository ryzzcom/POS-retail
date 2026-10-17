"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MetricTooltipProps {
  label: string;
  explanation: string;
  className?: string;
  labelClassName?: string;
}

export function MetricTooltip({
  label,
  explanation,
  className,
  labelClassName,
}: MetricTooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      className={cn("relative inline-flex items-center group", className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "font-sans text-sm text-body cursor-help underline decoration-dotted decoration-body/60 underline-offset-4 hover:decoration-heading hover:text-heading transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm text-left",
          labelClassName
        )}
        aria-label={`${label}: ${explanation}`}
        tabIndex={0}
      >
        {label}
      </button>

      {/* Floating Tooltip Box */}
      {isOpen && (
        <div
          role="tooltip"
          className="absolute bottom-full left-0 mb-2 z-50 w-64 p-2.5 rounded-lg bg-card border border-default shadow-xl text-xs font-sans text-heading leading-relaxed pointer-events-none animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <div className="font-medium text-heading mb-1">{label}</div>
          <p className="text-body text-[11px] leading-normal">{explanation}</p>
          <div className="absolute top-full left-4 -mt-px border-4 border-transparent border-t-card" />
        </div>
      )}
    </div>
  );
}
