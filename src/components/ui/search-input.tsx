"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  containerClassName?: string;
  sizeVariant?: "default" | "sm";
  clearButtonType?: "text" | "icon";
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onClear,
      placeholder = "Search...",
      className,
      containerClassName,
      sizeVariant = "default",
      clearButtonType = "text",
      disabled = false,
      "aria-label": ariaLabel = "Search input",
      ...props
    },
    ref
  ) => {
    const handleClear = () => {
      onChange("");
      onClear?.();
    };

    const isSmall = sizeVariant === "sm";

    return (
      <div
        className={cn(
          "relative flex items-center w-full select-none",
          containerClassName
        )}
      >
        <Search
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-muted pointer-events-none shrink-0",
            isSmall ? "left-3 size-3.5" : "left-4 size-4"
          )}
          aria-hidden="true"
        />

        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(
            "w-full rounded-full bg-card border border-default/60 font-sans text-heading placeholder:text-muted",
            "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-xs transition-colors",
            isSmall
              ? "h-9 sm:h-10 pl-9 pr-12 text-xs"
              : "h-11 pl-11 pr-14 text-xs sm:text-sm",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          {...props}
        />

        {value && !disabled && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
            {clearButtonType === "icon" ? (
              <button
                type="button"
                onClick={handleClear}
                className="size-5 rounded-full flex items-center justify-center text-muted hover:text-heading hover:bg-subtle/50 transition-colors cursor-pointer"
                aria-label="Clear search text"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClear}
                className={cn(
                  "font-sans text-muted hover:text-heading cursor-pointer px-1 py-0.5 rounded transition-colors",
                  isSmall ? "text-[11px]" : "text-xs"
                )}
                aria-label="Clear search text"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
