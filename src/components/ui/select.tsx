"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export type SelectSizeVariant = "sm" | "md" | "pill";

export interface SelectProps {
  options: readonly SelectOption[] | SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: React.ReactNode;
  error?: string;
  sizeVariant?: SelectSizeVariant;
  fullWidth?: boolean;
  className?: string;
  triggerClassName?: string;
  popoverClassName?: string;
  align?: "left" | "right";
  id?: string;
  name?: string;
  "aria-label"?: string;
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder = "Select an option",
      disabled = false,
      label,
      error,
      sizeVariant = "md",
      fullWidth = false,
      className,
      triggerClassName,
      popoverClassName,
      align = "left",
      id,
      name,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string>(
      controlledValue ?? defaultValue ?? options[0]?.value ?? ""
    );
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const isControlled = controlledValue !== undefined;
    const selectedValue = isControlled ? controlledValue : internalValue;

    const selectedOption = React.useMemo(
      () => options.find((opt) => opt.value === selectedValue),
      [options, selectedValue]
    );

    // Sync controlled value changes
    React.useEffect(() => {
      if (isControlled && controlledValue !== undefined) {
        setInternalValue(controlledValue);
      }
    }, [isControlled, controlledValue]);

    // Outside click & ESC dismissal
    React.useEffect(() => {
      if (!isOpen) return;

      const handlePointerDown = (event: MouseEvent | TouchEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handlePointerDown);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen]);

    const handleSelect = (val: string) => {
      if (!isControlled) {
        setInternalValue(val);
      }
      onChange?.(val);
      setIsOpen(false);
    };

    // Keyboard navigation within menu
    const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    // Size variants matching Figma design system tokens
    const sizeClasses = React.useMemo(() => {
      switch (sizeVariant) {
        case "sm":
          return "h-8 px-2.5 text-xs rounded-lg gap-2";
        case "pill":
          return "h-11 px-4 text-xs sm:text-sm font-medium rounded-full gap-3 shadow-xs";
        case "md":
        default:
          return "h-11 px-4 text-xs sm:text-sm rounded-xl gap-3";
      }
    }, [sizeVariant]);

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative flex flex-col gap-1 select-none",
          fullWidth ? "w-full" : "w-auto inline-flex",
          className
        )}
      >
        {label && (
          <label
            htmlFor={id}
            className="font-heading font-medium text-xs sm:text-sm text-heading"
          >
            {label}
          </label>
        )}

        {/* Hidden input to support native form submissions */}
        {name && (
          <input type="hidden" name={name} value={selectedValue} id={id} />
        )}

        {/* Custom Trigger Button */}
        <button
          ref={ref}
          type="button"
          id={id ? `${id}-trigger` : undefined}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={ariaLabel || (typeof label === "string" ? label : undefined)}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            "bg-card border border-default/60 font-sans text-heading transition-colors cursor-pointer",
            "flex items-center justify-between text-left",
            "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary hover:border-default",
            sizeClasses,
            disabled && "opacity-50 cursor-not-allowed",
            isOpen && "border-primary ring-1 ring-primary/30",
            fullWidth && "w-full",
            triggerClassName
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-heading transition-transform duration-200 pointer-events-none",
              isOpen && "rotate-180 text-primary"
            )}
          />
        </button>

        {/* Floating Popover Menu */}
        {isOpen && (
          <div
            role="listbox"
            tabIndex={-1}
            className={cn(
              "absolute z-50 top-[calc(100%+6px)] min-w-full w-max max-w-xs",
              "bg-card border border-default rounded-[12px] shadow-lg p-1.5",
              "overflow-y-auto max-h-60 custom-scrollbar",
              "animate-in fade-in-0 zoom-in-95 duration-150 origin-top",
              align === "right" ? "right-0" : "left-0",
              popoverClassName
            )}
          >
            {options.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  className={cn(
                    "flex items-center justify-between gap-3 px-3 py-2 rounded-[8px]",
                    "font-sans text-xs sm:text-sm transition-colors cursor-pointer",
                    isSelected
                      ? "bg-subtle/60 text-heading font-medium"
                      : "text-heading hover:bg-subtle/30",
                    option.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <Check className="size-3.5 text-primary shrink-0 stroke-[2.5]" />
                  )}
                </div>
              );
            })}
          </div>
        )}

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

Select.displayName = "Select";

export default Select;
