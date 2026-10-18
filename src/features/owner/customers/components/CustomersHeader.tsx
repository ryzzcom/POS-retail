"use client";

import * as React from "react";
import { Download, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomersHeaderProps {
  totalProfiles: number;
  acceptsPromotions: number;
  onExport: () => void;
  onNewCustomer: () => void;
  className?: string;
}

export function CustomersHeader({
  totalProfiles,
  acceptsPromotions,
  onExport,
  onNewCustomer,
  className,
}: CustomersHeaderProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none",
        className
      )}
    >
      {/* Left: Heading & Dynamic Summary Subtitle (Figma Node 3411:29203) */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading font-semibold text-2xl sm:text-[28px] text-heading tracking-[-0.4px] leading-tight">
          Customers
        </h1>
        <p className="font-sans text-xs sm:text-sm text-body leading-normal">
          {totalProfiles} active profiles · {acceptsPromotions} accept promotions
        </p>
      </div>

      {/* Right: Action Buttons (Figma Node 3411:29206) */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Export Outline Button (Figma Node 3411:29207) */}
        <button
          type="button"
          onClick={onExport}
          className="h-10 sm:h-[47px] px-4 sm:px-[22px] rounded-[22px] border border-default bg-card flex items-center justify-center gap-2 font-sans font-medium text-xs sm:text-sm text-heading hover:bg-subtle/25 active:bg-subtle/40 transition-colors cursor-pointer shadow-2xs"
          aria-label="Export customer directory to CSV"
        >
          <Download className="size-4 shrink-0 text-heading" />
          <span>Export</span>
        </button>

        {/* New Customer Primary Button (Figma Node 3411:29209) */}
        <button
          type="button"
          onClick={onNewCustomer}
          className="h-10 sm:h-[47px] px-4 sm:px-[22px] rounded-[22px] bg-primary flex items-center justify-center gap-2 font-sans font-medium text-xs sm:text-sm text-dark-primary hover:bg-primary/90 active:bg-primary/95 transition-opacity cursor-pointer shadow-xs"
          aria-label="Create new customer profile"
        >
          <Plus className="size-4 shrink-0 text-dark-primary" />
          <span>New Customers</span>
        </button>
      </div>
    </div>
  );
}
