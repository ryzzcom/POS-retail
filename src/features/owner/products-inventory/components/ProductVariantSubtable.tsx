"use client";

import * as React from "react";
import { formatPKR } from "@/lib/formatters";
import { ProductItem, ProductVariant } from "../types/products-inventory.types";
import { cn } from "@/lib/utils";

interface ProductVariantSubtableProps {
  product: ProductItem;
  onAdjustStock?: (product: ProductItem, variant: ProductVariant) => void;
  onPrintLabels?: (product: ProductItem, variant: ProductVariant) => void;
  onViewLedger?: (product: ProductItem, variant: ProductVariant) => void;
}

export function ProductVariantSubtable({
  product,
  onAdjustStock,
  onPrintLabels,
  onViewLedger,
}: ProductVariantSubtableProps) {
  return (
    <div className="w-full bg-card rounded-xl border border-default/60 shadow-xs overflow-hidden select-none">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left">
          {/* Variant Header Row (Figma Node 3386:22170) */}
          <thead>
            <tr className="bg-subtle/30 border-b border-default/40 text-xs font-sans text-body">
              <th className="py-2.5 px-4 font-medium">Colour / size</th>
              <th className="py-2.5 px-4 font-medium">SKU</th>
              <th className="py-2.5 px-4 font-medium">Barcode</th>
              <th className="py-2.5 px-4 font-medium">Cost</th>
              <th className="py-2.5 px-4 font-medium">Price</th>
              <th className="py-2.5 px-4 font-medium text-center">Reorder at</th>
              <th className="py-2.5 px-4 font-medium text-center">Stock</th>
              <th className="py-2.5 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>

          {/* Variant Rows */}
          <tbody className="divide-y divide-default/20 text-xs font-sans text-heading">
            {product.variants.map((variant) => {
              const isLowStock = variant.onHand <= variant.reorderLevel;

              return (
                <tr
                  key={variant.id}
                  className="hover:bg-subtle/15 transition-colors"
                >
                  {/* Colour / size */}
                  <td className="py-3 px-4 font-medium">
                    {variant.color} • {variant.size}
                  </td>

                  {/* SKU */}
                  <td className="py-3 px-4 font-mono text-muted text-[11px] sm:text-xs">
                    {variant.sku}
                  </td>

                  {/* Barcode */}
                  <td className="py-3 px-4 font-mono text-muted text-[11px] sm:text-xs">
                    {variant.barcode || "—"}
                  </td>

                  {/* Cost */}
                  <td className="py-3 px-4">{formatPKR(variant.costPrice)}</td>

                  {/* Price */}
                  <td className="py-3 px-4 font-medium">
                    {formatPKR(variant.retailPrice)}
                  </td>

                  {/* Reorder at */}
                  <td className="py-3 px-4 text-center text-muted">
                    {variant.reorderLevel}
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={cn(
                        "font-semibold",
                        isLowStock ? "text-status-warning" : "text-heading"
                      )}
                    >
                      {variant.onHand}
                    </span>
                  </td>

                  {/* Quick Variant Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onPrintLabels?.(product, variant)}
                      className="text-heading font-medium hover:underline cursor-pointer"
                    >
                      Labels
                    </button>
                    <button
                      type="button"
                      onClick={() => onAdjustStock?.(product, variant)}
                      className="text-heading font-medium hover:underline cursor-pointer ml-3.5"
                    >
                      Adjust
                    </button>
                    <button
                      type="button"
                      onClick={() => onViewLedger?.(product, variant)}
                      className="text-heading font-medium hover:underline cursor-pointer ml-3.5"
                    >
                      Ledger
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
