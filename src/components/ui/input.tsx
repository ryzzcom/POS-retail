"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      showPasswordToggle,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const [showPassword, setShowPassword] = React.useState(false);

    const isPasswordType = type === "password";
    const shouldShowToggle =
      showPasswordToggle !== undefined
        ? showPasswordToggle
        : isPasswordType && !rightIcon;

    const computedType = isPasswordType && showPassword ? "text" : type;

    const inputElement = (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center justify-center pointer-events-none text-muted shrink-0 [&>svg]:size-5">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          type={computedType}
          disabled={disabled}
          ref={ref}
          className={cn(
            "flex h-[48px] w-full rounded-[12px] border bg-theme px-3.5 py-2.5 font-sans text-sm text-heading placeholder:text-muted transition-all duration-150 focus-visible:outline-none focus-visible:border-focus focus-visible:ring-1 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon ? "pl-11" : "pl-3.5",
            rightIcon || shouldShowToggle ? "pr-11" : "pr-3.5",
            error
              ? "border-status-error focus-visible:border-status-error focus-visible:ring-status-error"
              : "border-default",
            className
          )}
          {...props}
        />

        {shouldShowToggle ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 flex items-center justify-center text-muted hover:text-heading transition-colors cursor-pointer shrink-0 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        ) : rightIcon ? (
          <div className="absolute right-3.5 flex items-center justify-center pointer-events-none text-muted shrink-0 [&>svg]:size-5">
            {rightIcon}
          </div>
        ) : null}
      </div>
    );

    if (!label && !error && !helperText) {
      return inputElement;
    }

    return (
      <div className={cn("w-full flex flex-col gap-2", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="font-sans font-medium text-sm text-body"
          >
            {label}
          </label>
        )}

        {inputElement}

        {error ? (
          <p className="font-sans text-xs text-status-error mt-0.5" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p className="font-sans text-xs text-muted mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
