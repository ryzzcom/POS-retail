"use client";

import * as React from "react";
import { Printer } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPKR } from "@/lib/formatters";
import { ProductItem, ProductVariant } from "../types/products-inventory.types";

interface PrintBarcodeModalProps {
  open: boolean;
  onClose: () => void;
  product: ProductItem | null;
  variant: ProductVariant | null;
}

export function PrintBarcodeModal({
  open,
  onClose,
  product,
  variant,
}: PrintBarcodeModalProps) {
  const [labelQty, setLabelQty] = React.useState(10);
  const [includePrice, setIncludePrice] = React.useState(true);

  if (!product || !variant) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Print Barcode Labels"
      subtitle={`${product.name} — ${variant.color} • ${variant.size}`}
      maxWidthClass="sm:max-w-[460px]"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              window.print();
              onClose();
            }}
          >
            <Printer className="size-4 shrink-0" />
            <span>Print {labelQty} Labels</span>
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5 select-none">
        {/* Label Preview Card */}
        <div className="w-full bg-card rounded-2xl border border-default p-4 flex flex-col items-center justify-center text-center shadow-xs">
          <p className="font-heading font-semibold text-xs tracking-wider text-heading uppercase">
            Signature Boutique
          </p>
          <p className="font-sans font-medium text-xs text-heading mt-1">
            {product.name} ({variant.size})
          </p>

          {/* Barcode Graphic Simulation */}
          <div className="my-3 flex flex-col items-center">
            <div className="h-10 flex items-center gap-[2px]">
              {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 4, 2, 1, 3, 2, 4, 1].map(
                (w, i) => (
                  <span
                    key={i}
                    style={{ width: `${w * 1.5}px` }}
                    className="h-full bg-heading inline-block"
                  />
                )
              )}
            </div>
            <span className="font-mono text-[10px] text-body tracking-widest mt-1">
              {variant.barcode || variant.sku}
            </span>
          </div>

          {includePrice && (
            <p className="font-heading font-bold text-sm text-heading">
              {formatPKR(variant.retailPrice)}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs sm:text-sm text-heading">
              Number of labels
            </span>
            <div className="w-24">
              <Input
                type="number"
                min={1}
                max={500}
                value={labelQty}
                onChange={(e) => setLabelQty(parseInt(e.target.value, 10) || 1)}
                className="text-center font-sans text-xs text-heading h-9"
              />
            </div>
          </div>

          <Checkbox
            id="include-price-checkbox"
            label="Include retail price on label"
            checked={includePrice}
            onChange={(e) => setIncludePrice(e.target.checked)}
          />
        </div>
      </div>
    </Dialog>
  );
}
