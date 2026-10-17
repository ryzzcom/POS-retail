"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      containerClassName,
      labelClassName,
      label,
      error,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className={cn("flex flex-col gap-1", containerClassName)}>
        <label
          htmlFor={checkboxId}
          className={cn(
            "flex items-center gap-2 cursor-pointer select-none group",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <input
            id={checkboxId}
            ref={ref}
            type="checkbox"
            disabled={disabled}
            className={cn("sr-only peer", className)}
            {...props}
          />
          <div className="size-4.5 rounded-[5px] border border-default bg-theme flex items-center justify-center transition-colors peer-checked:bg-primary peer-checked:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-focus group-hover:border-focus/70 shrink-0">
            <Check className="size-3 text-dark-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
          {label && (
            <span
              className={cn(
                "font-sans font-semibold text-[11px] tracking-wider uppercase text-body group-hover:text-heading transition-colors",
                labelClassName
              )}
            >
              {label}
            </span>
          )}
        </label>
        {error && (
          <p
            role="alert"
            className="font-sans text-xs text-status-error leading-tight"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
