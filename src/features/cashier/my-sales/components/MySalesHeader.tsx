"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/formatters";
import { PageHeader } from "@/components/layouts/PageHeader";

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
    <PageHeader
      title="My sales today"
      description={`${receiptsCount} ${
        receiptsCount === 1 ? "receipt" : "receipts"
      } · ${itemsCount} items · ${formatPKR(
        totalSalesPKR
      )} · only your own receipts are shown`}
      actions={
        onExport ? (
          <Button
            type="button"
            variant="white"
            onClick={onExport}
            className="rounded-full px-5 py-2.5 font-sans font-medium text-sm flex items-center gap-2 shadow-xs border-default hover:bg-subtle/40"
          >
            <Download className="size-4 shrink-0" />
            <span>Export</span>
          </Button>
        ) : undefined
      }
    />
  );
}
