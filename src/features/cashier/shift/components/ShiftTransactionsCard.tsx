"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatPKR } from "@/lib/formatters";
import { ShiftTransaction } from "../types";

export interface ShiftTransactionsCardProps {
  transactions: ShiftTransaction[];
  onSelectTransaction?: (transaction: ShiftTransaction) => void;
}

export function ShiftTransactionsCard({
  transactions,
  onSelectTransaction,
}: ShiftTransactionsCardProps) {
  const params = useParams();
  const storeSlug = (params?.storeSlug as string) || "noor-pret";
  const counterId = (params?.counterId as string) || "1";

  return (
    <div className="rounded-[22px] bg-card border border-default/50 flex flex-col justify-between py-4 shadow-xs select-none min-h-[340px] flex-1">
      <div>
        {/* Card Header */}
        <div className="px-6 pb-3 border-b border-default/50 flex items-center justify-between">
          <h2 className="font-sans font-medium text-sm sm:text-base text-heading">
            My transactions
          </h2>
          <Link
            href={`/${storeSlug}/counter/${counterId}/my-sales`}
            className="font-sans text-xs text-primary font-medium hover:underline transition-colors"
          >
            View all & reprint
          </Link>
        </div>

        {/* Transaction Rows List */}
        <div className="flex flex-col">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-muted font-sans text-sm">
              No transactions recorded yet in this shift.
            </div>
          ) : (
            transactions.map((tx, idx) => (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction?.(tx)}
                className={`px-6 py-3.5 flex items-center justify-between hover:bg-subtle/25 cursor-pointer transition-colors ${
                  idx < transactions.length - 1 ? "border-b border-default/40" : ""
                }`}
                title="Click to view & reprint receipt"
              >
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="font-mono font-medium text-sm text-heading shrink-0">
                    {tx.id}
                  </span>
                  <span className="font-sans text-xs text-body truncate">
                    · {tx.time} · {tx.customerName}
                  </span>
                </div>

                <span className="font-heading font-semibold text-sm sm:text-base text-heading shrink-0 ml-4">
                  {formatPKR(tx.amountPKR)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="px-6 pt-3 text-right">
        <span className="font-sans text-xs text-muted">
          Showing {transactions.length} recent transactions
        </span>
      </div>
    </div>
  );
}
