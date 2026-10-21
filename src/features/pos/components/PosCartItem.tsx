"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trash2, Minus, Plus, Tag, Sparkles } from "lucide-react";
import { formatPKR } from "@/lib/formatters";
import { PosCartItem } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface PosCartItemRowProps {
  item: PosCartItem;
  onUpdateQty: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onSetDiscount: (
    cartItemId: string,
    discountType: "percentage" | "fixed",
    value: number
  ) => void;
}

/**
 * Cart Line Item Card matching Figma node 3432:37518.
 */
export function PosCartItemRow({
  item,
  onUpdateQty,
  onRemoveItem,
  onSetDiscount,
}: PosCartItemRowProps) {
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [discountVal, setDiscountVal] = useState<string>(
    item.discountValue ? String(item.discountValue) : ""
  );

  const handleApplyDiscount = () => {
    const num = parseFloat(discountVal) || 0;
    onSetDiscount(item.id, "fixed", num);
    setShowDiscountInput(false);
  };

  return (
    <div className="w-full bg-card rounded-[16px] p-3 border border-default/50 shadow-xs flex flex-col gap-2.5 select-none transition-all hover:border-default">
      {/* Top Details Row */}
      <div className="flex items-start gap-3 min-w-0">
        {/* Product Thumbnail with Image Fallback */}
        <div className="relative size-14 rounded-[12px] overflow-hidden bg-subtle/30 shrink-0 border border-default/30">
          {!imgError ? (
            <Image
              src={item.image}
              alt={item.productName}
              fill
              sizes="56px"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-subtle/50 text-accent">
              <Sparkles className="size-5" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="flex items-start justify-between gap-1">
            <span className="font-sans font-medium text-xs sm:text-sm text-heading truncate">
              {item.productName}
            </span>

            {/* Remove / Trash Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemoveItem(item.id)}
              className="size-6 rounded-full text-status-error hover:bg-status-error-bg hover:text-status-error shrink-0"
              title="Remove item from cart"
              aria-label="Remove item"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>

          <span className="font-sans text-[11px] text-body truncate">
            {item.color} · {item.size} · {item.sku}
          </span>

          {/* Variant Badges & Discount Trigger */}
          <div className="flex items-center gap-1.5 mt-1">
            <Badge
              variant="outline"
              size="sm"
              className="h-5 px-2 text-[10px] bg-subtle/50 border-default/40 font-medium"
            >
              {item.size}
            </Badge>
            <Badge
              variant="outline"
              size="sm"
              className="h-5 px-2 text-[10px] bg-subtle/50 border-default/40 font-medium"
            >
              {item.color}
            </Badge>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowDiscountInput((prev) => !prev)}
              className="text-[11px] font-sans text-accent hover:text-accent hover:bg-subtle/50 h-5 px-1.5 ml-auto gap-1"
            >
              <Tag className="size-3" />
              <span>
                {item.discountValue ? `Less Rs. ${item.discountValue}` : "Discount"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Inline Item Discount Input */}
      {showDiscountInput && (
        <div className="flex items-center gap-2 pt-1 border-t border-default/30">
          <span className="font-sans text-xs text-body">Item discount (Rs.):</span>
          <input
            type="number"
            min={0}
            value={discountVal}
            onChange={(e) => setDiscountVal(e.target.value)}
            placeholder="0"
            className="w-20 px-2 py-1 rounded-[8px] border border-default bg-theme font-sans text-xs text-heading focus:border-focus focus:outline-none"
          />
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleApplyDiscount}
            className="h-7 px-3 text-xs rounded-full font-sans font-medium"
          >
            Apply
          </Button>
        </div>
      )}

      {/* Bottom Quantity Stepper & Price Row */}
      <div className="flex items-center justify-between pt-1 border-t border-default/30">
        {/* Quantity Stepper */}
        <div className="flex items-center gap-1.5 bg-theme border border-default rounded-full px-1.5 py-0.5 shadow-2xs">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onUpdateQty(item.id, item.quantity - 1)}
            className="size-5 rounded-full text-body hover:text-heading hover:bg-subtle/50 p-0"
            aria-label="Decrease quantity"
          >
            <Minus className="size-3" />
          </Button>

          <span className="font-sans font-medium text-xs text-heading w-4 text-center">
            {item.quantity}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
            className="size-5 rounded-full text-body hover:text-heading hover:bg-subtle/50 p-0"
            aria-label="Increase quantity"
          >
            <Plus className="size-3" />
          </Button>
        </div>

        {/* Line Total */}
        <span className="font-heading font-semibold text-sm sm:text-base text-heading">
          {formatPKR(item.lineTotal)}
        </span>
      </div>
    </div>
  );
}
