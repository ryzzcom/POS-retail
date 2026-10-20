"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/formatters";

export interface MySalesHeaderProps {
  receiptsCount: number;
  itemsCount: number;
  totalSalesPKR: number;
  onExport?: () => void;
}

export function MySalesHeader({
  receiptsCount,
  itemsCount,
  totalSalesPKR,
  onExport,
}: MySalesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full select-none">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading font-semibold text-2xl sm:text-[28px] text-heading tracking-[-0.4px]">
          My sales today
        </h1>
        <p className="font-sans text-sm text-body">
          {receiptsCount} {receiptsCount === 1 ? "receipt" : "receipts"} · {itemsCount} items · {formatPKR(totalSalesPKR)} · only your own receipts are shown
        </p>
      </div>

      {onExport && (
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
        </div>
      )}
    </div>
  );
}
