"use client";

import * as React from "react";
import Link from "next/link";
import { ScanLine, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface OwnerHeaderProps {
  /**
   * Display date string. Defaults to "Sunday, 11 October 2026" or current date.
   */
  date?: string;
  /**
   * Active store owner's name. Defaults to "Ayesha Khan".
   */
  userName?: string;
  /**
   * User role description. Defaults to "Store Owner".
   */
  userRole?: string;
  /**
   * Destination URL for the Open POS button.
   */
  posHref?: string;
  /**
   * Logout destination or handler.
   */
  onLogout?: () => void;
  className?: string;
}

export function OwnerHeader({
  date = "Sunday, 11 October 2026",
  userName = "Ayesha Khan",
  userRole = "Store Owner",
  posHref = "/counter/1",
  onLogout,
  className,
}: OwnerHeaderProps) {
  return (
    <header
      className={cn(
        "w-full flex items-center justify-between py-2 shrink-0 select-none",
        className
      )}
      aria-label="Owner workspace top bar"
    >
      {/* Left: Formatted Date */}
      <div>
        <time
          dateTime="2026-10-11"
          className="font-sans text-base text-body tracking-normal"
        >
          {date}
        </time>
      </div>

      {/* Right Action Cluster */}
      <div className="flex items-center gap-6">
        {/* Open POS CTA Pill */}
        <Link href={posHref} tabIndex={-1}>
          <Button
            type="button"
            variant="primary"
            size="default"
            className="rounded-[22px] px-[22px] h-[47px] gap-2.5 font-sans font-medium text-sm text-dark-primary shadow-sm hover:opacity-95"
            aria-label="Open POS counter"
          >
            <ScanLine className="size-[18px] shrink-0" aria-hidden="true" />
            <span>Open POS</span>
          </Button>
        </Link>

        {/* User Identity & Logout Button */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end text-right">
            <span className="font-sans font-medium text-sm text-heading leading-tight">
              {userName}
            </span>
            <span className="font-sans text-xs text-body leading-tight">
              {userRole}
            </span>
          </div>

          {/* Square Outline Logout Button */}
          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="size-[30px] rounded-[6px] border border-default bg-theme flex items-center justify-center text-body hover:text-heading hover:bg-subtle/50 transition-colors cursor-pointer"
              aria-label="Log out of owner account"
              title="Log out"
            >
              <LogOut className="size-4 shrink-0" aria-hidden="true" />
            </button>
          ) : (
            <Link
              href="/login"
              className="size-[30px] rounded-[6px] border border-default bg-theme flex items-center justify-center text-body hover:text-heading hover:bg-subtle/50 transition-colors cursor-pointer"
              aria-label="Log out of owner account"
              title="Log out"
            >
              <LogOut className="size-4 shrink-0" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
