"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  widthClass?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  hideCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
}

/**
 * Reusable Right-Side Slide-Over Drawer primitive matching the warm boutique design system.
 * Supports dark backdrop overlay, Escape-key dismissal, body scroll locking, and smooth slide animation.
 */
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  header,
  footer,
  children,
  widthClass = "w-full sm:max-w-[480px] md:max-w-[540px]",
  className,
  headerClassName,
  bodyClassName,
  hideCloseButton = false,
  closeOnBackdropClick = true,
  closeOnEsc = true,
}: DrawerProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  // Mount on client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Handle animation frame for smooth slide-in/out
  React.useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
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

  const drawerContent = (
    <div
      className={cn(
        "fixed inset-0 z-50 flex justify-end select-none",
        !open && "pointer-events-none"
      )}
      role="dialog"
      aria-modal="true"
    >
      {/* 1. Dark Backdrop Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-heading/40 backdrop-blur-[1px] transition-opacity duration-300 ease-out",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={() => {
          if (closeOnBackdropClick) {
            onClose();
          }
        }}
        aria-hidden="true"
      />

      {/* 2. Slide-Over Panel Container */}
      <div
        className={cn(
          "relative z-10 flex flex-col w-full h-full bg-theme border-l border-default shadow-2xl transition-transform duration-300 ease-out sm:rounded-tl-[12px] sm:rounded-bl-[12px] overflow-hidden",
          widthClass,
          open ? "translate-x-0" : "translate-x-full",
          className
        )}
      >
        {/* Fixed Header */}
        {header ? (
          header
        ) : (title || subtitle) ? (
          <div
            className={cn(
              "bg-page border-b border-default px-6 py-3.5 flex items-start justify-between gap-4 shrink-0",
              headerClassName
            )}
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              {title && (
                <h3 className="font-heading font-semibold text-lg text-heading leading-tight truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="font-sans text-xs sm:text-sm text-body leading-normal line-clamp-2">
                  {subtitle}
                </p>
              )}
            </div>
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="size-7 rounded-md flex items-center justify-center text-heading hover:bg-subtle/50 transition-colors shrink-0 -mr-1 mt-0.5 cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        ) : null}

        {/* Scrollable Content Body */}
        <div
          className={cn(
            "flex-1 overflow-y-auto bg-theme custom-scrollbar",
            bodyClassName
          )}
        >
          {children}
        </div>

        {/* Optional Fixed Footer */}
        {footer && (
          <div className="border-t border-default bg-page px-6 py-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}
