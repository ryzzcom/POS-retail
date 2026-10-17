"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/formatters";
import {
  TopSellingVariant,
  CustomerLoyaltySummary,
} from "../types/dashboard.types";

interface TopSellingVariantsCardProps {
  variants: TopSellingVariant[];
  customerSummary: CustomerLoyaltySummary;
  className?: string;
}

export function TopSellingVariantsCard({
  variants,
  customerSummary,
  className,
}: TopSellingVariantsCardProps) {
  return (
    <div
      className={cn(
        "w-full bg-theme rounded-[22px] p-5 sm:p-6 border border-default/40 shadow-xs flex flex-col select-none",
        className
      )}
    >
      {/* Header with Title and Customer Summary (Figma Node 3382:12140) */}
      <div className="pb-3 border-b border-default flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h2 className="font-sans font-medium text-sm text-heading tracking-normal">
          Top-selling variants · today
        </h2>
        <div className="font-sans text-xs text-body sm:text-right leading-tight">
          <span>{customerSummary.newCustomers} new</span>
          <span className="mx-1">·</span>
          <span>{customerSummary.repeatCustomers} repeat customers</span>
          <span className="mx-1">·</span>
          <span>
            {customerSummary.pointsIssued.toLocaleString()} pts issued /{" "}
            {customerSummary.pointsRedeemed.toLocaleString()} redeemed
          </span>
        </div>
      </div>

      {/* Table Content (Figma Node 3382:12143) */}
      <div className="flex flex-col mt-3">
        {/* Table Column Headers */}
        <div className="flex items-center justify-between text-xs font-sans text-body pb-2 border-b border-default/30">
          <span className="flex-1">Product</span>
          <span className="w-16 text-right">Units</span>
          <span className="w-24 text-right">Revenue</span>
        </div>

        {/* Product Variant Rows */}
        <div className="flex flex-col divide-y divide-default/30">
          {variants.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2.5 group hover:bg-subtle/25 rounded-lg px-1 transition-colors"
            >
              {/* Product Title & Variant Specs */}
              <div className="flex-1 flex flex-col min-w-0 pr-3">
                <span className="font-sans font-medium text-sm text-heading leading-tight truncate">
                  {item.productName}
                </span>
                <div className="flex items-center gap-1.5 font-sans text-xs text-body mt-0.5">
                  <span>{item.color}</span>
                  <span className="size-1 rounded-full bg-body/40" />
                  <span>{item.size}</span>
                </div>
              </div>

              {/* Units Sold */}
              <div className="w-16 text-right">
                <span className="font-sans text-sm text-heading font-normal">
                  {item.unitsSold}
                </span>
              </div>

              {/* Total Revenue PKR */}
              <div className="w-24 text-right">
                <span className="font-sans text-sm text-heading font-normal whitespace-nowrap">
                  {formatPKR(item.revenue)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
