"use client";

import * as React from "react";
import { BillItem } from "../types/finance-expenses.types";
import { formatPKR } from "@/lib/formatters";
import { AlertCircle } from "lucide-react";

interface BillsToPayCardProps {
  bills: BillItem[];
  onPayBill: (bill: BillItem) => void;
}

export function BillsToPayCard({ bills, onPayBill }: BillsToPayCardProps) {
  const unpaidBills = bills.filter((b) => b.status !== "paid");

  return (
    <div className="w-full lg:w-[330px] xl:w-[360px] shrink-0 bg-card rounded-2xl p-5 sm:p-6 border border-default/60 shadow-xs flex flex-col justify-between gap-5 select-none">
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex items-center justify-between pb-1 border-b border-default/30">
          <h3 className="font-heading font-semibold text-base sm:text-lg text-heading">
            Bills to pay
          </h3>
          <span className="font-sans text-xs text-muted">
            {unpaidBills.length} pending
          </span>
        </div>

        {/* Bill Rows List */}
        <div className="flex flex-col divide-y divide-default/30">
          {unpaidBills.length === 0 ? (
            <p className="font-sans text-xs text-muted py-4 text-center">
              All outstanding vendor bills are settled.
            </p>
          ) : (
            unpaidBills.map((bill) => (
              <div
                key={bill.id}
                className="py-3 flex items-start justify-between gap-3 text-xs sm:text-sm font-sans"
              >
                {/* Left: Vendor & Due Date */}
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="font-medium text-heading truncate">
                    {bill.vendor}
                  </span>
                  <span className="text-[11px] text-body mt-0.5">
                    {bill.dueDate}
                  </span>
                </div>

                {/* Right: Amount & Pay Action */}
                <div className="flex flex-col items-end shrink-0">
                  <span className="font-heading font-semibold text-heading">
                    {formatPKR(bill.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onPayBill(bill)}
                    className="font-sans text-xs text-primary font-medium hover:underline mt-0.5 cursor-pointer"
                  >
                    Pay
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footnote matching Figma Node 3454:45151 */}
      <div className="pt-3 border-t border-default/40">
        <p className="font-sans text-[11px] text-muted leading-relaxed">
          Recurring rent, salaries with advances and the petty-cash register ship with Phase 4.
        </p>
      </div>
    </div>
  );
}
