"use client";

import React from "react";
import { Dialog } from "@/components/ui/dialog";
import { formatPKR } from "@/lib/formatters";
import { PosProduct, ProductVariant } from "../types";

export interface PosVariantModalProps {
  product: PosProduct | null;
  open: boolean;
  onClose: () => void;
  onSelectVariant: (product: PosProduct, variant: ProductVariant) => void;
}

/**
 * Variant Selection Matrix Modal matching Figma node 3432:38029.
 * Shows Colour vs Size grid with real-time stock counts and prices per variant.
 */
export function PosVariantModal({
  product,
  open,
  onClose,
  onSelectVariant,
}: PosVariantModalProps) {
  if (!product) return null;

  // Extract unique colors and sizes from variants
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));

  const handleCellClick = (variant: ProductVariant) => {
    if (variant.stock <= 0) return;
    onSelectVariant(product, variant);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={product.name}
      subtitle={`${product.code} · ${product.fabric} · choose colour and size`}
      maxWidthClass="sm:max-w-[620px]"
    >
      <div className="flex flex-col gap-5 select-none py-1">
        {/* Variant Matrix Table */}
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-default/40">
                <th className="py-2.5 px-3 text-left font-sans text-xs font-medium text-body w-28">
                  Colour
                </th>
                {sizes.map((size) => (
                  <th
                    key={size}
                    className="py-2.5 px-3 text-center font-sans text-xs font-semibold text-heading min-w-[140px]"
                  >
                    {size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-default/20">
              {colors.map((color) => (
                <tr key={color}>
                  {/* Color Label */}
                  <td className="py-3 px-3 font-sans text-xs sm:text-sm font-medium text-heading">
                    {color}
                  </td>

                  {/* Size Cells */}
                  {sizes.map((size) => {
                    const variant = product.variants.find(
                      (v) => v.color === color && v.size === size
                    );

                    if (!variant) {
                      return (
                        <td key={size} className="p-2 text-center">
                          <div className="h-14 rounded-[12px] border border-dashed border-default/40 flex items-center justify-center text-muted text-xs">
                            —
                          </div>
                        </td>
                      );
                    }

                    const isOutOfStock = variant.stock <= 0;

                    return (
                      <td key={size} className="p-2">
                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => handleCellClick(variant)}
                          className={`w-full h-14 rounded-[12px] border px-3 py-1.5 flex flex-col items-center justify-center transition-all ${
                            isOutOfStock
                              ? "border-default/40 bg-subtle/20 text-muted opacity-60 cursor-not-allowed"
                              : "border-default bg-card hover:border-primary hover:bg-subtle/30 text-heading cursor-pointer shadow-2xs hover:shadow-xs"
                          }`}
                        >
                          <span className="font-sans text-xs font-medium leading-tight">
                            {isOutOfStock ? "Out of stock" : `${variant.stock} left`}
                          </span>
                          <span className="font-heading text-xs font-semibold text-heading/80 mt-0.5">
                            {formatPKR(variant.price || product.price)}
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Guidance Note */}
        <p className="font-sans text-xs text-body leading-relaxed pt-2 border-t border-default/40">
          Attach a customer to save out-of-stock sizes to their wishlist.
          Wishlists don&apos;t reserve stock.
        </p>
      </div>
    </Dialog>
  );
}
