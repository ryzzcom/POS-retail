"use client";

import * as React from "react";
import { Download, Upload, Plus } from "lucide-react";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/formatters";

interface ProductsInventoryHeaderProps {
  productsCount: number;
  totalUnits: number;
  inventoryValuationCost: number;
  onNewProduct: () => void;
  onExport?: () => void;
  onImport?: () => void;
  className?: string;
}

export function ProductsInventoryHeader({
  productsCount,
  totalUnits,
  inventoryValuationCost,
  onNewProduct,
  onExport,
  onImport,
  className,
}: ProductsInventoryHeaderProps) {
  return (
    <PageHeader
      title="Products & Inventory"
      description={`${productsCount} active products · ${totalUnits} units on hand · valued at ${formatPKR(inventoryValuationCost)} (cost)`}
      className={className}
      actions={
        <>
          <Button
            type="button"
            variant="white"
            onClick={onExport}
            leftIcon={<Download className="size-4 text-heading shrink-0" />}
          >
            Export
          </Button>

          <Button
            type="button"
            variant="white"
            onClick={onImport}
            leftIcon={<Upload className="size-4 text-heading shrink-0" />}
          >
            Import
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={onNewProduct}
            leftIcon={<Plus className="size-4 shrink-0" />}
          >
            New product
          </Button>
        </>
      }
    />
  );
}

