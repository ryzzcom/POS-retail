"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  label?: React.ReactNode;
  description?: React.ReactNode;
  id?: string;
  name?: string;
  className?: string;
  "aria-label"?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  size = "md",
  label,
  description,
  id: customId,
  name,
  className,
  "aria-label": ariaLabel,
}: SwitchProps) {
  const generatedId = React.useId();
  const switchId = customId || generatedId;

  const handleToggle = () => {
    if (disabled) return;
    onCheckedChange(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  const switchButton = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel || (typeof label === "string" ? label : undefined)}
      disabled={disabled}
      id={switchId}
      name={name}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        size === "sm" ? "h-5 w-9" : "h-6 w-11",
        checked
          ? "bg-primary border-primary"
          : "bg-subtle/80 border-default hover:bg-subtle",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block rounded-full bg-card shadow-sm transition-transform duration-200 ease-in-out",
          size === "sm"
            ? "size-4"
            : "size-5",
          checked
            ? size === "sm"
              ? "translate-x-4"
              : "translate-x-5"
            : "translate-x-0.5"
        )}
      />
    </button>
  );

  if (label || description) {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-4 py-2",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
      >
        <label
          htmlFor={switchId}
          className="flex flex-col cursor-pointer min-w-0 pr-2 select-none"
        >
          {label && (
            <span className="font-sans font-medium text-xs sm:text-sm text-heading leading-tight">
              {label}
            </span>
          )}
          {description && (
            <span className="font-sans text-xs text-body leading-relaxed mt-0.5">
              {description}
            </span>
          )}
        </label>
        {switchButton}
      </div>
    );
  }

  return switchButton;
}

export { Switch as Toggle };
