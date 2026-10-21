"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPKR } from "@/lib/formatters";
import { ShiftSummary } from "../types";

export interface ShiftHeroCardProps {
  shift: ShiftSummary;
  onCashInOut: () => void;
  onCloseShift: () => void;
}

export function ShiftHeroCard({
  shift,
  onCashInOut,
  onCloseShift,
}: ShiftHeroCardProps) {
  const params = useParams();
  const storeSlug = (params?.storeSlug as string) || "noor-pret";
  const counterId = (params?.counterId as string) || "1";

  return (
    <div className="rounded-[22px] bg-card border border-default/50 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xs select-none">
      {/* Left Column: Status, Opened Info, Big Revenue Figure */}
      <div className="flex flex-col items-start">
        <Badge
          variant="success"
          className="rounded-full px-4 py-1 text-sm font-sans font-normal"
        >
          {shift.status === "open" ? "Shift open" : "Shift closed"}
        </Badge>

        <p className="font-sans text-sm text-body mt-3">
          Opened {shift.openedAt} by {shift.openedBy} · float {formatPKR(shift.startingFloatPKR)}
        </p>

        <div className="flex flex-col mt-2">
          <p className="font-heading font-semibold text-[32px] sm:text-[36px] text-heading tracking-[-0.5px] leading-tight">
            {formatPKR(shift.netSalesPKR)}
          </p>
          <p className="font-sans text-sm text-body mt-1">
            Your net sales today · {shift.receiptsCount} {shift.receiptsCount === 1 ? "receipt" : "receipts"}
          </p>
        </div>
      </div>

      {/* Right Column: 3 Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Button
          type="button"
          variant="white"
          onClick={onCashInOut}
          className="rounded-full px-5 py-2.5 font-sans font-medium text-sm border-default hover:bg-subtle/40 shadow-xs"
        >
          Cash in / out
        </Button>

        <Button
          type="button"
          variant="white"
          onClick={onCloseShift}
          className="rounded-full px-5 py-2.5 font-sans font-medium text-sm border-default hover:bg-subtle/40 shadow-xs"
        >
          Close shift
        </Button>

        <Button
          type="button"
          variant="primary"
          asChild
          className="rounded-full px-5 py-2.5 font-sans font-medium text-sm flex items-center gap-2 shadow-xs"
        >
          <Link href="/pos?from=cashier">
            <ScanLine className="size-4 shrink-0" />
            <span>Start selling</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
