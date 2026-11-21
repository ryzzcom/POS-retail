"use client";

import * as React from "react";
import Link from "next/link";
import { ScanLine, Users, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";

export interface OwnerHeaderProps {
  /**
   * Display date string. Defaults to formatted current date.
   */
  date?: string;
  /**
   * Active store owner's name.
   */
  userName?: string;
  /**
   * User role description.
   */
  userRole?: string;
  /**
   * Destination URL for the Open POS button.
   */
  posHref?: string;
  /**
   * Optional custom profile switch or logout handler.
   */
  onLogout?: () => void;
  /**
   * Optional open handler for mobile hamburger drawer menu.
   */
  onOpenMobileMenu?: () => void;
  /**
   * Optional toggle handler for mobile hamburger drawer menu.
   */
  onToggleMobileMenu?: () => void;
  className?: string;
}

export function OwnerHeader({
  date,
  userName = "Ayesha Khan",
  userRole = "Store Owner",
  posHref = "/pos?from=owner",
  onLogout,
  onOpenMobileMenu,
  onToggleMobileMenu,
  className,
}: OwnerHeaderProps) {
  const { user, activeProfile, activeRole } = useAuth();
  const handleMobileMenuClick = onOpenMobileMenu || onToggleMobileMenu;

  // Format dynamic today's date if date prop not explicitly supplied
  const todayFormatted = React.useMemo(() => {
    if (date) return date;
    try {
      return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());
    } catch {
      return "Sunday, 11 October 2026";
    }
  }, [date]);

  // Read active profile / user context
  const effectiveName = activeProfile?.displayName || user?.fullName || userName;
  const effectiveRole =
    activeRole === "OWNER"
      ? "Store Owner"
      : activeRole === "CASHIER"
      ? "Cashier"
      : userRole;

  return (
    <header
      className={cn(
        "w-full flex items-center justify-between py-1 sm:py-2 shrink-0 select-none gap-2",
        className
      )}
      aria-label="Owner workspace top bar"
    >
      {/* Left: Hamburger menu trigger (mobile only) & Formatted Date */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {handleMobileMenuClick && (
          <button
            type="button"
            onClick={handleMobileMenuClick}
            className="lg:hidden size-9 rounded-xl border border-default bg-card flex items-center justify-center text-heading hover:bg-subtle/40 transition-colors cursor-pointer shrink-0"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="size-4.5" />
          </button>
        )}

        <time
          dateTime={new Date().toISOString().split("T")[0]}
          className="font-sans text-xs sm:text-sm lg:text-base text-body tracking-normal truncate"
        >
          {todayFormatted}
        </time>
      </div>

      {/* Right Action Cluster */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
        {/* Open POS CTA Pill */}
        <Link href={posHref} tabIndex={-1}>
          <Button
            type="button"
            variant="primary"
            size="default"
            className="rounded-full px-3 sm:px-[22px] h-9 sm:h-[47px] gap-1.5 sm:gap-2.5 font-sans font-medium text-xs sm:text-sm text-dark-primary shadow-sm hover:opacity-95 shrink-0"
            aria-label="Open POS counter"
          >
            <ScanLine className="size-4 sm:size-[18px] shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Open POS</span>
            <span className="sm:hidden">POS</span>
          </Button>
        </Link>

        {/* User Identity & Switch Profile Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-end text-right">
            <span className="font-sans font-medium text-xs sm:text-sm text-heading leading-tight truncate max-w-[85px] sm:max-w-none">
              {effectiveName}
            </span>
            <span className="hidden sm:block font-sans text-xs text-body leading-tight">
              {effectiveRole}
            </span>
          </div>

          {/* Switch Profile / Staff Selection Button */}
          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="size-8 sm:size-[30px] rounded-[6px] border border-default bg-theme flex items-center justify-center text-body hover:text-heading hover:bg-subtle/50 transition-colors cursor-pointer shrink-0"
              aria-label="Switch staff profile"
              title="Switch Staff Profile"
            >
              <Users className="size-3.5 sm:size-4 shrink-0" aria-hidden="true" />
            </button>
          ) : (
            <Link
              href="/select-profile"
              className="size-8 sm:size-[30px] rounded-[6px] border border-default bg-theme flex items-center justify-center text-body hover:text-heading hover:bg-subtle/50 transition-colors cursor-pointer shrink-0"
              aria-label="Switch staff profile"
              title="Switch Staff Profile"
            >
              <Users className="size-3.5 sm:size-4 shrink-0" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
