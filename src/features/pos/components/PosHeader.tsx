"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ScanLine,
  Printer,
  Receipt,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface PosHeaderProps {
  counterName?: string;
  shiftInfo?: string;
  cashierName?: string;
  onCloseShift?: () => void;
  onOpenMySales?: () => void;
  onExit?: () => void;
}

/**
 * Top bar header for POS Terminal matching Figma node 3422:36302.
 */
export function PosHeader({
  counterName = "Counter 1",
  shiftInfo = "Shift opened 10:02 AM by Bilal Ahmed",
  onCloseShift,
  onOpenMySales,
  onExit,
}: PosHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const handleExit = () => {
    if (onExit) {
      onExit();
    } else if (from === "owner") {
      router.push("/dashboard");
    } else if (from === "cashier") {
      router.push("/noor-pret/counter/1/shift");
    } else {
      router.back();
    }
  };

  return (
    <header className="w-full bg-card rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs border border-default/50 select-none shrink-0 gap-3">
      {/* Left Section: Exit, Counter Name, Shift Info */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleExit}
          className="h-8 px-2 sm:px-2.5 rounded-full text-heading hover:text-primary hover:bg-subtle/40 font-sans text-xs sm:text-sm font-medium gap-1.5 shrink-0"
          title="Exit POS Terminal"
        >
          <ArrowLeft className="size-4 shrink-0" />
          <span>Exit POS</span>
        </Button>

        <span className="h-4 w-[1px] bg-default shrink-0" aria-hidden="true" />

        <div className="flex items-center gap-2 truncate">
          <span className="font-heading font-semibold text-xs sm:text-sm text-heading shrink-0">
            {counterName}
          </span>
          <span className="hidden md:inline font-sans text-xs text-body truncate">
            {shiftInfo}
          </span>
        </div>
      </div>

      {/* Right Section: My Sales, Scanner Ready, Print Mode, Close Shift */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {onOpenMySales && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenMySales}
            className="hidden sm:inline-flex items-center gap-1.5 font-sans text-xs text-body hover:text-heading px-2.5 h-8 rounded-full"
          >
            <Receipt className="size-3.5 text-body" />
            <span>My sales</span>
          </Button>
        )}

        <Badge
          variant="outline"
          size="sm"
          className="hidden lg:inline-flex items-center gap-1.5 font-sans text-xs text-body border-default/60 bg-subtle/30 font-normal"
        >
          <ScanLine className="size-3.5 text-accent" />
          <span>Scanner ready</span>
        </Badge>

        <Badge
          variant="outline"
          size="sm"
          className="hidden xl:inline-flex items-center gap-1.5 font-sans text-xs text-body border-default/60 bg-subtle/30 font-normal"
        >
          <Printer className="size-3.5 text-body" />
          <span>Browser print · 80mm</span>
        </Badge>

        {onCloseShift && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCloseShift}
            className="rounded-full h-8 px-3 text-xs gap-1.5 border-default hover:bg-subtle/40"
          >
            <Lock className="size-3.5 shrink-0" />
            <span>Close shift</span>
          </Button>
        )}
      </div>
    </header>
  );
}
