"use client";

import * as React from "react";
import { Drawer } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, MessageCircle, Undo2 } from "lucide-react";
import { ReceiptSummary } from "../types/sales-history.types";
import { ReturnExchangeDialog } from "./ReturnExchangeDialog";

export interface SaleReceiptDrawerProps {
  receipt: ReceiptSummary | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Sale Receipt Detail Slide-Over Drawer matching Figma Node 3386:17230 with 100% fidelity.
 * Displays receipt breakdown, tender/customer split, actions, thermal paper copy, and audit timeline.
 */
export function SaleReceiptDrawer({
  receipt,
  open,
  onClose,
}: SaleReceiptDrawerProps) {
  const [isRetryingWhatsApp, setIsRetryingWhatsApp] = React.useState(false);
  const [reprintCount, setReprintCount] = React.useState(1);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = React.useState(false);

  // Fallback data for Figma Receipt NP-010420 if no dynamic receipt is passed
  const receiptNumber = receipt?.receiptNumber ?? "NP-010420";
  const customerName = receipt?.customerName ?? "Fatima Raza";
  const cashierName = receipt?.cashierName ?? "Ayesha Khan";
  const time = receipt?.time ?? "2:05 PM";
  const dateStr = "11 Oct 2026";

  const handleReprint = () => {
    setReprintCount((prev) => prev + 1);
  };

  const handleRetryWhatsApp = () => {
    setIsRetryingWhatsApp(true);
    setTimeout(() => {
      setIsRetryingWhatsApp(false);
    }, 1200);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Receipt ${receiptNumber}`}
      subtitle={`${dateStr}, ${time} · ${cashierName} · ${customerName}`}
      widthClass="w-full sm:max-w-[578px]"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReprint}
              className="rounded-full px-4 text-xs h-9 gap-1.5"
            >
              <Printer className="size-3.5" />
              <span>Reprint ({reprintCount})</span>
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => setIsReturnDialogOpen(true)}
              className="rounded-full px-4 text-xs h-9 gap-1.5"
            >
              <Undo2 className="size-3.5" />
              <span>Return / Exchange</span>
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="rounded-full px-4 text-xs h-9"
          >
            Close
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5 p-4 sm:p-6 select-none">
        {/* Receipt Summary Card */}
        <div className="rounded-[14px] sm:rounded-[16px] bg-card border border-default/60 overflow-hidden shadow-xs divide-y divide-default/50">
          {/* 1. Line Items Section (Figma Node 3386:17240) */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="font-sans text-sm text-heading font-normal">
              Chiffon Formal Shirt
            </p>
            <div className="flex items-center flex-wrap gap-1 font-sans text-xs text-body">
              <span>Maroon</span>
              <span className="text-muted">·</span>
              <span>M</span>
              <span className="text-muted">·</span>
              <span className="font-mono text-[11px]">FM509-MRN-M</span>
              <span className="text-muted">·</span>
              <span>1 × Rs. 9,500</span>
            </div>
          </div>
          <p className="font-sans font-medium text-sm text-heading shrink-0">
            Rs. 9,500
          </p>
        </div>

        {/* 2. Bill Breakdown Section (Figma Node 3386:17256) */}
        <div className="p-4 sm:p-5 flex flex-col gap-3 bg-subtle/10">
          <div className="flex items-center justify-between font-sans text-sm text-body">
            <span>Subtotal</span>
            <span>Rs. 9,500</span>
          </div>
          <div className="flex items-center justify-between font-sans text-sm text-status-success">
            <span>Bill discount</span>
            <span>−Rs. 500</span>
          </div>
          <div className="flex items-center justify-between font-sans text-sm text-status-success">
            <span>Redeem pts</span>
            <span>−300 pts</span>
          </div>
          <div className="flex items-center justify-between font-sans font-medium text-base text-heading pt-0.5">
            <span>Total</span>
            <span className="font-semibold">Rs. 8,700</span>
          </div>
        </div>

        {/* 3. Payments & Customer 2-Column Split (Figma Node 3386:17271) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-5 items-start">
          {/* Left: Payments */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className="font-sans text-xs text-body font-normal tracking-wide">
              Payments
            </span>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-sans text-sm text-heading min-w-0">
                <span className="truncate">Card</span>
                <span className="size-1 rounded-full bg-body/50 shrink-0" />
                <span className="text-xs text-body font-normal shrink-0">
                  TID 402118
                </span>
              </div>
              <span className="font-sans text-sm text-heading shrink-0 font-normal">
                Rs. 9,000
              </span>
            </div>
          </div>

          {/* Right: Customer */}
          <div className="flex flex-col gap-1 min-w-0 border-t sm:border-t-0 sm:border-l border-default/50 pt-3 sm:pt-0 sm:pl-6">
            <span className="font-sans text-xs text-body font-normal tracking-wide">
              Customer
            </span>
            <p className="font-sans text-sm text-heading font-medium truncate">
              {customerName}
            </p>
            <p className="font-sans text-xs text-body">
              +90 pts earned
            </p>
          </div>
        </div>
      </div>

      {/* 4. Action Cards (Figma Node 3386:17286) */}
      <div className="flex flex-col gap-2.5">
        {/* Card 1: Reprint Receipt */}
        <button
          type="button"
          onClick={handleReprint}
          className="w-full rounded-[14px] sm:rounded-[16px] border border-default/60 bg-card p-3.5 flex items-center justify-between hover:bg-subtle/20 active:bg-subtle/30 transition-colors cursor-pointer text-left shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <Printer className="size-4 text-heading shrink-0" />
            <span className="font-sans text-sm text-heading font-normal">
              Reprint receipt
            </span>
          </div>
          <span className="font-sans text-xs text-body">
            {reprintCount} {reprintCount === 1 ? "print" : "prints"}
          </span>
        </button>

        {/* Card 2: WhatsApp Receipt */}
        <div className="w-full rounded-[14px] sm:rounded-[16px] border border-default/60 bg-card p-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <MessageCircle className="size-4 text-heading shrink-0" />
            <span className="font-sans text-sm text-heading font-normal">
              WhatsApp receipt
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Badge variant="failed" size="sm">
              Failed
            </Badge>
            <button
              type="button"
              onClick={handleRetryWhatsApp}
              disabled={isRetryingWhatsApp}
              className="font-sans text-xs font-medium text-primary hover:underline cursor-pointer disabled:opacity-50"
            >
              {isRetryingWhatsApp ? "Sending..." : "Retry"}
            </button>
          </div>
        </div>

        {/* Card 3: Return or Exchange */}
        <button
          type="button"
          onClick={() => setIsReturnDialogOpen(true)}
          className="w-full rounded-[14px] sm:rounded-[16px] border border-default/60 bg-card p-3.5 flex items-center gap-3 hover:bg-subtle/20 active:bg-subtle/30 transition-colors cursor-pointer text-left shadow-2xs"
        >
          <Undo2 className="size-4 text-heading shrink-0" />
          <span className="font-sans text-sm text-heading font-normal">
            Return or exchange items
          </span>
        </button>
      </div>

      {/* 5. Bottom 2-Column Split: Thermal Receipt Paper & History Timeline (Figma Node 3386:17310) */}
      <div className="flex flex-col md:flex-row gap-5 items-start">
        {/* Left Column: Authentic Thermal Receipt Paper Preview */}
        <div className="w-full md:w-[316px] shrink-0 bg-subtle/40 rounded-[14px] sm:rounded-[16px] p-3 border border-default/60">
          <div className="bg-card rounded-[10px] p-3.5 border border-default/40 shadow-xs font-mono text-[11px] leading-relaxed text-heading flex flex-col">
              {/* Store Header */}
              <div className="text-center flex flex-col items-center">
                <p className="font-bold text-[13px] tracking-tight text-heading">
                  NOOR PRET & BOUTIQUE
                </p>
                <p className="text-[10.5px] leading-tight text-heading mt-0.5">
                  Shop 14, MM Alam Road, Gulberg III,
                </p>
                <p className="text-[10.5px] leading-tight text-heading">Lahore</p>
                <p className="text-[10.5px] leading-tight text-heading">Tel 0321-4567890</p>
                <p className="text-[10.5px] leading-tight text-heading">NTN 4471902-3</p>
              </div>

              {/* Duplicate Copy Label */}
              <div className="border-t border-heading/70 my-2" />
              <p className="font-bold text-center text-[10.5px] text-heading">
                *** DUPLICATE COPY ***
              </p>

              {/* Receipt Metadata */}
              <div className="flex flex-col gap-0.5 mt-1.5">
                <p>Receipt {receiptNumber}</p>
                <p>{dateStr}, {time} · {cashierName}</p>
                <p>Customer: {customerName} (0300-***4567)</p>
              </div>

              {/* Line Items */}
              <div className="border-t border-heading/70 my-2" />
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold text-heading">Chiffon Formal Shirt</p>
                <p className="text-body text-[10.5px]">Maroon/M · FM509-MRN-M</p>
                <div className="flex items-center justify-between">
                  <span>1 × Rs. 9,500</span>
                  <span>Rs. 9,500</span>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-heading/70 my-2" />
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. 9,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Discounts</span>
                  <span>-Rs. 500</span>
                </div>
                <div className="flex justify-between font-bold text-heading">
                  <span>TOTAL</span>
                  <span>Rs. 9,000</span>
                </div>
              </div>

              {/* Tender */}
              <div className="border-t border-heading/70 my-2" />
              <div className="flex justify-between">
                <span>Card</span>
                <span>Rs. 9,000</span>
              </div>

              {/* Points */}
              <div className="border-t border-heading/70 my-2" />
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between">
                  <span>Points earned</span>
                  <span>+90</span>
                </div>
                <div className="flex justify-between font-bold text-heading">
                  <span>Points balance</span>
                  <span>640</span>
                </div>
              </div>

              {/* Return Policy & Thanks */}
              <div className="border-t border-heading/70 my-2" />
              <p className="text-[10px] text-center text-body leading-normal">
                Exchange within 7 days with receipt and tags attached. Sale items
                and cut unstitched fabric are non-returnable.
              </p>
              <p className="font-semibold text-center text-[10.5px] text-heading mt-2">
                Thank you for shopping with Noor!
              </p>
            </div>
          </div>

          {/* Right Column: History Timeline (Figma Node 3386:17356) */}
          <div className="flex-1 flex flex-col gap-3 min-w-0 bg-card rounded-[14px] sm:rounded-[16px] p-4 border border-default/60 shadow-xs">
            <h4 className="font-heading font-medium text-sm text-heading">
              History
            </h4>
            <div className="border-l border-default pl-3.5 flex flex-col gap-4">
              {/* Timeline Item 1: Sale Completed */}
              <div className="flex flex-col gap-0.5">
                <p className="font-sans text-xs text-heading font-normal">
                  Sale completed
                </p>
                <div className="flex items-center gap-1.5 font-sans text-xs text-body">
                  <span>{time}</span>
                  <span className="size-1 rounded-full bg-body/50" />
                  <span>{cashierName}</span>
                </div>
                <div className="flex items-center gap-1.5 font-sans text-xs text-body">
                  <span>Rs. 9,000</span>
                  <span className="size-1 rounded-full bg-body/50" />
                  <span className="capitalize">card</span>
                </div>
              </div>

              {/* Timeline Item 2: WhatsApp Failed */}
              <div className="flex flex-col gap-0.5">
                <p className="font-sans text-xs text-heading font-normal">
                  WhatsApp failed
                </p>
                <div className="flex items-center gap-1.5 font-sans text-xs text-body">
                  <span>2:06 PM</span>
                  <span className="size-1 rounded-full bg-body/50" />
                  <span>System</span>
                </div>
                <p className="font-sans text-xs text-body">
                  Provider rate limit (code131048)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Return / Exchange Modal Dialog */}
      <ReturnExchangeDialog
        open={isReturnDialogOpen}
        onClose={() => setIsReturnDialogOpen(false)}
        receiptNumber={receiptNumber}
        customerName={customerName}
      />
    </Drawer>
  );
}
