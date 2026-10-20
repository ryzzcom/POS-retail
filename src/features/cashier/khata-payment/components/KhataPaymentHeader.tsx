"use client";

import React from "react";
import { Download, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface KhataPaymentHeaderProps {
  onExport: () => void;
  onRecordPayment: () => void;
}

export function KhataPaymentHeader({
  onExport,
  onRecordPayment,
}: KhataPaymentHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full select-none">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading font-semibold text-2xl sm:text-[28px] text-heading tracking-[-0.4px]">
          Khata payments
        </h1>
        <p className="font-sans text-sm text-body">
          Find the customer, check their balance and record what they pay you.
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
          onClick={onRecordPayment}
          className="rounded-full px-5 py-2.5 font-sans font-medium text-sm flex items-center gap-2 shadow-xs"
        >
          <CreditCard className="size-4 shrink-0" />
          <span>Record payment</span>
        </Button>
      </div>
    </div>
  );
}
