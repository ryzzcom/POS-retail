"use client";

import React from "react";
import { Download, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layouts/PageHeader";

export interface KhataPaymentHeaderProps {
  onExport: () => void;
  onRecordPayment: () => void;
}

export function KhataPaymentHeader({
  onExport,
  onRecordPayment,
}: KhataPaymentHeaderProps) {
  return (
    <PageHeader
      title="Khata payments"
      description="Find the customer, check their balance and record what they pay you."
      actions={
        <>
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
        </>
      }
    />
  );
}
