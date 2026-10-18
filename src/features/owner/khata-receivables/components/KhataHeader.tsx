"use client";

import * as React from "react";
import { Download, Plus } from "lucide-react";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";

interface KhataHeaderProps {
  onRecordPayment: () => void;
  onExport: () => void;
  className?: string;
}

export function KhataHeader({
  onRecordPayment,
  onExport,
  className,
}: KhataHeaderProps) {
  return (
    <PageHeader
      title="Khata / Receivables"
      description="Every balance is the sum of its ledger entries. Terms: 30 days from each credit sale."
      className={className}
      actions={
        <>
          <Button
            type="button"
            variant="white"
            onClick={onExport}
            leftIcon={<Download className="size-4 text-heading shrink-0" />}
            aria-label="Export Khata accounts to CSV"
          >
            Export
          </Button>

          {/* <Button
            type="button"
            variant="primary"
            onClick={onRecordPayment}
            leftIcon={<Plus className="size-4 shrink-0" />}
            aria-label="Record customer Khata repayment"
          >
            Record payment
          </Button> */}
        </>
      }
    />
  );
}
