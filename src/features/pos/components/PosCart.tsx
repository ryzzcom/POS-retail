"use client";

import React, { useState } from "react";
import { ShoppingBag, PauseCircle } from "lucide-react";
import { formatPKR } from "@/lib/formatters";
import {
  PosCartItem,
  PosCustomer,
} from "../types";
import { PosCustomerBar } from "./PosCustomerBar";
import { PosCartItemRow } from "./PosCartItem";
import { PosLoyaltyRedemption } from "./PosLoyaltyRedemption";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface PosCartProps {
  cartItems: PosCartItem[];
  customer: PosCustomer | null;
  subtotal: number;
  itemCount: number;
  pointsRedeemed: number;
  pointsDiscountPKR: number;
  billDiscount: number;
  grandTotal: number;
  pointsEarned: number;
  heldBillsCount: number;
  onUpdateQty: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onSetItemDiscount: (
    cartItemId: string,
    discountType: "percentage" | "fixed",
    value: number
  ) => void;
  onAttachCustomer: (customer: PosCustomer) => void;
  onDetachCustomer: () => void;
  onPointsChange: (points: number) => void;
  onSetBillDiscount: (amount: number) => void;
  onClearCart: () => void;
  onOpenHeldBills: () => void;
  onOpenCheckout: () => void;
}

/**
 * Right Panel Active Cart & Checkout Controller for POS Terminal.
 * Matches Figma nodes 3422:36302, 3432:37518, 3437:39407.
 */
export function PosCart({
  cartItems,
  customer,
  subtotal,
  itemCount,
  pointsRedeemed,
  pointsDiscountPKR,
  billDiscount,
  grandTotal,
  pointsEarned,
  heldBillsCount,
  onUpdateQty,
  onRemoveItem,
  onSetItemDiscount,
  onAttachCustomer,
  onDetachCustomer,
  onPointsChange,
  onSetBillDiscount,
  onClearCart,
  onOpenHeldBills,
  onOpenCheckout,
}: PosCartProps) {
  const [discountInput, setDiscountInput] = useState<string>("");

  const handleApplyBillDiscount = () => {
    const val = parseFloat(discountInput) || 0;
    onSetBillDiscount(val);
  };

  return (
    <div className="w-full lg:w-[410px] xl:w-[440px] shrink-0 bg-theme rounded-[24px] border border-default p-4 sm:p-5 flex flex-col justify-between h-full select-none shadow-xs">
      {/* 1. Customer Selector Top Bar */}
      <div className="flex flex-col gap-3 pb-3 border-b border-default/40">
        <div className="flex items-center justify-between">
          <span className="font-heading font-semibold text-xs sm:text-sm text-heading">
            Active Cart {itemCount > 0 && `(${itemCount})`}
          </span>

          {heldBillsCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onOpenHeldBills}
              className="h-7 px-2.5 rounded-full bg-accent/20 text-accent hover:bg-accent/30 font-sans text-xs font-medium gap-1.5"
            >
              <PauseCircle className="size-3.5" />
              <span>{heldBillsCount} Held</span>
            </Button>
          )}
        </div>

        <PosCustomerBar
          customer={customer}
          onAttachCustomer={onAttachCustomer}
          onDetachCustomer={onDetachCustomer}
        />
      </div>

      {/* 2. Middle: Cart Items List or Empty State */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-3 min-h-[180px] flex flex-col gap-3">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <PosCartItemRow
              key={item.id}
              item={item}
              onUpdateQty={onUpdateQty}
              onRemoveItem={onRemoveItem}
              onSetDiscount={onSetItemDiscount}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-10 gap-2.5">
            <div className="size-12 rounded-full bg-subtle/50 flex items-center justify-center text-muted">
              <ShoppingBag className="size-6" />
            </div>
            <p className="font-heading font-semibold text-sm text-heading">
              Cart is empty
            </p>
            <p className="font-sans text-xs text-body max-w-[200px]">
              Scan a tag or search by name / design code.
            </p>
          </div>
        )}
      </div>

      {/* 3. Bottom Pricing, Loyalty & Charge CTA */}
      <div className="flex flex-col gap-3 pt-3 border-t border-default/50">
        {/* Conditional Loyalty Points Box if Customer attached */}
        {customer && (
          <PosLoyaltyRedemption
            customer={customer}
            subtotal={subtotal}
            pointsRedeemed={pointsRedeemed}
            onPointsChange={onPointsChange}
          />
        )}

        {/* Bill-level Discount Bar */}
        {cartItems.length > 0 && (
          <div className="flex items-center justify-between gap-2 text-xs font-sans">
            <span className="text-body font-medium">Bill discount</span>
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted text-[11px]">
                  Rs.
                </span>
                <input
                  type="number"
                  min={0}
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  placeholder="0"
                  className="w-20 pl-7 pr-2 py-1 rounded-[8px] border border-default bg-card text-xs font-sans text-heading focus:border-focus focus:outline-none"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleApplyBillDiscount}
                className="h-7 px-3 rounded-full text-xs font-sans font-medium border-default hover:bg-subtle/80 text-heading"
              >
                Apply
              </Button>
            </div>
          </div>
        )}

        {/* Line-item Financial Summary */}
        <div className="flex flex-col gap-1.5 text-xs font-sans">
          <div className="flex items-center justify-between text-body">
            <span>Subtotal · {itemCount} items</span>
            <span className="font-heading font-medium text-heading">
              {formatPKR(subtotal)}
            </span>
          </div>

          {pointsDiscountPKR > 0 && (
            <div className="flex items-center justify-between text-status-error">
              <span>Points ({pointsRedeemed})</span>
              <span className="font-heading font-medium">
                -{formatPKR(pointsDiscountPKR)}
              </span>
            </div>
          )}

          {billDiscount > 0 && (
            <div className="flex items-center justify-between text-status-error">
              <span>Discount</span>
              <span className="font-heading font-medium">
                -{formatPKR(billDiscount)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-status-success text-[11px]">
            <span>Earn</span>
            <span className="font-heading font-medium">
              {pointsEarned} pts
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-default/50">
            <span className="font-sans font-medium text-xs sm:text-sm text-heading">
              Total payable
            </span>
            <span className="font-heading font-bold text-xl sm:text-2xl text-heading">
              {formatPKR(grandTotal)}
            </span>
          </div>
        </div>

        {/* Bottom Action Row: Clear / Park & Charge CTA */}
        <div className="flex items-center gap-2.5 mt-1">
          {cartItems.length > 0 && (
            <>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onClearCart}
                className="rounded-full px-4 text-xs font-sans border-default hover:bg-subtle/50"
                title="Clear entire cart"
              >
                Clear
              </Button>

              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onOpenHeldBills}
                className="rounded-full px-3 text-xs font-sans border-default hover:bg-subtle/50"
                title="Park this bill"
              >
                Hold
              </Button>
            </>
          )}

          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={cartItems.length === 0}
            onClick={onOpenCheckout}
            className="flex-1 rounded-full h-11 text-sm font-sans font-medium shadow-xs flex items-center justify-between px-5"
          >
            <span>Charge</span>
            <Badge
              variant="outline"
              size="sm"
              className="h-5 px-2 rounded-full bg-dark-primary/20 text-dark-primary border-transparent text-[10px] font-mono"
            >
              F9
            </Badge>
          </Button>
        </div>
      </div>
    </div>
  );
}
