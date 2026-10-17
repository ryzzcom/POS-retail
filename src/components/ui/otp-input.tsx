"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  error?: string;
  className?: string;
  id?: string;
}

export const OtpInput = React.forwardRef<HTMLDivElement, OtpInputProps>(
  (
    {
      length = 6,
      value = "",
      onChange,
      disabled = false,
      autoFocus = true,
      error,
      className,
      id,
    },
    ref
  ) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    // Focus first input on mount if autoFocus
    React.useEffect(() => {
      if (autoFocus && inputRefs.current[0] && !disabled) {
        inputRefs.current[0].focus();
      }
    }, [autoFocus, disabled]);

    // Ensure array of values matches length
    const digits = React.useMemo(() => {
      const chars = value.split("");
      return Array.from({ length }, (_, i) => chars[i] || "");
    }, [value, length]);

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      const val = e.target.value;
      const cleanVal = val.replace(/\D/g, "");

      if (!cleanVal) {
        // Handled via backspace or cleared
        const nextDigits = [...digits];
        nextDigits[index] = "";
        onChange(nextDigits.join(""));
        return;
      }

      // If user typed a single character or multiple
      const lastChar = cleanVal.slice(-1);
      const nextDigits = [...digits];
      nextDigits[index] = lastChar;
      const nextValue = nextDigits.join("");
      onChange(nextValue);

      // Advance focus to next input
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      index: number
    ) => {
      if (e.key === "Backspace") {
        if (!digits[index] && index > 0) {
          // If current is empty, move back and clear previous
          e.preventDefault();
          const nextDigits = [...digits];
          nextDigits[index - 1] = "";
          onChange(nextDigits.join(""));
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text/plain").trim();
      const numericDigits = pastedData.replace(/\D/g, "").slice(0, length);

      if (numericDigits.length > 0) {
        onChange(numericDigits);
        const targetIndex = Math.min(numericDigits.length, length) - 1;
        inputRefs.current[targetIndex]?.focus();
      }
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-1.5 w-full", className)}>
        <div
          id={id}
          role="group"
          aria-label="OTP verification code"
          className="flex items-center gap-2 sm:gap-2.5 w-full justify-between"
        >
          {Array.from({ length }).map((_, index) => {
            const digit = digits[index] || "";
            const isFilled = Boolean(digit);
            const hasError = Boolean(error);

            return (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`Digit ${index + 1} of ${length}`}
                value={digit}
                disabled={disabled}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                className={cn(
                  "h-[48px] flex-1 min-w-0 rounded-[12px] bg-theme border text-center font-sans text-base sm:text-lg font-semibold text-heading transition-all duration-150 outline-none select-none",
                  "hover:border-focus/60 focus:border-focus focus:ring-2 focus:ring-primary/15",
                  isFilled && !hasError && "border-focus/80",
                  !isFilled && !hasError && "border-default",
                  hasError && "border-status-error focus:border-status-error focus:ring-status-error/15 text-status-error",
                  disabled && "opacity-50 cursor-not-allowed bg-subtle/50"
                )}
              />
            );
          })}
        </div>

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

OtpInput.displayName = "OtpInput";
