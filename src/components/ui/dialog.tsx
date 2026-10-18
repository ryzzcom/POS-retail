"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  maxWidthClass?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  hideCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
}

/**
 * Reusable Centered Modal / Dialog primitive matching the warm boutique design system.
 * Features dark blurred backdrop overlay, smooth center scale animation, Escape key dismissal,
 * body scroll lock, and rounded-[24px] container styling.
 */
export function Dialog({
  open,
  onClose,
  title,
  subtitle,
  header,
  footer,
  children,
  maxWidthClass = "w-full sm:max-w-[600px]",
  className,
  headerClassName,
  bodyClassName,
  hideCloseButton = false,
  closeOnBackdropClick = true,
  closeOnEsc = true,
}: DialogProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  // Mount on client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Handle animation frame for smooth open/close
  React.useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Handle ESC key listener & body scroll lock
  React.useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeOnEsc, onClose]);

  if (!mounted || (!open && !isVisible)) {
    return null;
  }

  const dialogContent = (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none",
        !open && "pointer-events-none"
      )}
      role="dialog"
      aria-modal="true"
    >
      {/* 1. Dark Blurred Backdrop Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-heading/40 backdrop-blur-[1px] transition-opacity duration-200 ease-out",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={() => {
          if (closeOnBackdropClick) {
            onClose();
          }
        }}
        aria-hidden="true"
      />

      {/* 2. Dialog Card Container */}
      <div
        className={cn(
          "relative z-10 w-full max-w-[calc(100vw-24px)] max-h-[90vh] bg-card rounded-[20px] sm:rounded-[24px] shadow-xl border border-default flex flex-col overflow-hidden transition-all duration-200 ease-out",
          maxWidthClass,
          open
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-2",
          className
        )}
      >
        {/* Header */}
        {header ? (
          header
        ) : (title || subtitle) ? (
          <div
            className={cn(
              "px-6 pt-6 pb-4 border-b border-default/60 flex items-start justify-between gap-4 shrink-0",
              headerClassName
            )}
          >
            <div className="flex flex-col gap-1 min-w-0">
              {title && (
                <h3 className="font-heading font-semibold text-lg text-heading leading-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="font-sans text-xs sm:text-sm text-body leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="size-7 rounded-md flex items-center justify-center text-heading hover:bg-subtle/50 transition-colors shrink-0 -mr-1 mt-0.5 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        ) : null}

        {/* Content Body */}
        <div
          className={cn(
            "p-6 flex-1 overflow-y-auto max-h-[calc(85vh-130px)] custom-scrollbar",
            bodyClassName
          )}
        >
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="border-t border-default/60 bg-page/40 px-6 py-4 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
