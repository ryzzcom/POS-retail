"use client";

import * as React from "react";
import { Download, Upload, Plus } from "lucide-react";
import { formatPKR } from "@/lib/formatters";

interface ProductsInventoryHeaderProps {
  productsCount: number;
  totalUnits: number;
  inventoryValuationCost: number;
  onNewProduct: () => void;
  onExport?: () => void;
  onImport?: () => void;
}

export function ProductsInventoryHeader({
  productsCount,
  totalUnits,
  inventoryValuationCost,
  onNewProduct,
  onExport,
  onImport,
}: ProductsInventoryHeaderProps) {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      {/* Title & Dynamic Summary Subtitle (Figma Node 3386:20563) */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <h1 className="font-heading font-semibold text-2xl sm:text-[28px] text-heading tracking-tight leading-tight">
          Products & Inventory
        </h1>
        <p className="font-sans text-xs sm:text-sm text-body leading-normal">
          {productsCount} active products · {totalUnits} units on hand · valued at{" "}
          {formatPKR(inventoryValuationCost)} (cost)
        </p>
      </div>

      {/* Action Buttons: Export, Import, New Product (Figma Node 3386:20585) */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap shrink-0">
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-default bg-card font-sans font-medium text-xs sm:text-sm text-heading hover:bg-subtle/30 transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="size-4 text-heading shrink-0" />
          <span>Export</span>
        </button>

        <button
          type="button"
          onClick={onImport}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-default bg-card font-sans font-medium text-xs sm:text-sm text-heading hover:bg-subtle/30 transition-colors shadow-2xs cursor-pointer"
        >
          <Upload className="size-4 text-heading shrink-0" />
          <span>Import</span>
        </button>

        <button
          type="button"
          onClick={onNewProduct}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary font-sans font-medium text-xs sm:text-sm text-dark-primary hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="size-4 shrink-0" />
          <span>New product</span>
        </button>
      </div>
    </div>
  );
}
