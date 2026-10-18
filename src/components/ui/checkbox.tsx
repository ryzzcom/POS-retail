"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  error?: string;
  indeterminate?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  boxClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      containerClassName,
      labelClassName,
      boxClassName,
      label,
      error,
      id,
      checked,
      defaultChecked,
      indeterminate = false,
      disabled = false,
      onChange,
      ...props
    },
    forwardedRef
  ) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;
    const internalRef = React.useRef<HTMLInputElement | null>(null);

    // Sync forwarded ref with internal ref
    React.useImperativeHandle(forwardedRef, () => internalRef.current as HTMLInputElement);

    // Sync indeterminate property on the underlying DOM element
    React.useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate]);

    const isChecked = Boolean(checked);
    const isIndeterminate = Boolean(indeterminate && !isChecked);
    const isMarked = isChecked || isIndeterminate;

    return (
      <div className={cn("inline-flex flex-col gap-1 select-none", containerClassName)}>
        <label
          htmlFor={checkboxId}
          className={cn(
            "inline-flex items-center gap-2 cursor-pointer group",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <input
            id={checkboxId}
            ref={internalRef}
            type="checkbox"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            onChange={onChange}
            className={cn("sr-only peer", className)}
            {...props}
          />

          {/* Crisp Centered Custom Checkbox Box */}
          <div
            className={cn(
              "size-4.5 rounded-[5px] border transition-all duration-150 flex items-center justify-center shrink-0",
              isMarked
                ? "bg-primary border-primary text-dark-primary shadow-2xs"
                : "bg-theme border-default group-hover:border-focus/70",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-page",
              boxClassName
            )}
          >
            {isIndeterminate ? (
              <Minus className="size-3 text-dark-primary stroke-[3]" />
            ) : isChecked ? (
              <Check className="size-3 text-dark-primary stroke-[3]" />
            ) : (
              /* Support peer-checked for uncontrolled forms (e.g., standard react-hook-form register without controlled checked) */
              <Check className="size-3 text-dark-primary stroke-[3] opacity-0 peer-checked:opacity-100 transition-opacity" />
            )}
          </div>

          {label && (
            <span
              className={cn(
                "font-sans text-xs sm:text-sm text-heading transition-colors group-hover:text-heading",
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
            className="font-sans text-xs text-status-error leading-tight mt-0.5"
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
