"use client";

import React from "react";
import { Download, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ShiftGreetingHeaderProps {
  cashierName?: string;
  activeProfilesCount?: number;
  promoProfilesCount?: number;
  onExport: () => void;
  onNewCustomer: () => void;
}

export function ShiftGreetingHeader({
  cashierName = "Bilal Ahmed",
  activeProfilesCount = 7,
  promoProfilesCount = 5,
  onExport,
  onNewCustomer,
}: ShiftGreetingHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full select-none">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading font-semibold text-2xl sm:text-[28px] text-heading tracking-[-0.4px]">
          Hello, {cashierName}
        </h1>
        <p className="font-sans text-sm text-body">
          {activeProfilesCount} active profiles · {promoProfilesCount} accept promotions
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Button
          type="button"
          variant="white"
          onClick={onExport}
          className="rounded-full px-5 py-2.5 font-sans font-medium text-sm flex items-center gap-2 shadow-xs border-default hover:bg-subtle/40"
        >
          <Download className="size-4 shrink-0" />
          <span>Export</span>
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={onNewCustomer}
          className="rounded-full px-5 py-2.5 font-sans font-medium text-sm flex items-center gap-2 shadow-xs"
        >
          <PlusCircle className="size-4 shrink-0" />
          <span>New Customers</span>
        </Button>
      </div>
    </div>
  );
}
