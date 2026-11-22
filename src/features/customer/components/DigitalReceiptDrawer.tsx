"use client";

import * as React from "react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Printer, Share2, Sparkles } from "lucide-react";
import { formatPKR, formatDate } from "@/lib/formatters";
import type { DigitalReceipt } from "../types/customer.types";

interface DigitalReceiptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: DigitalReceipt | null;
}

export function DigitalReceiptDrawer({ isOpen, onClose, receipt }: DigitalReceiptDrawerProps) {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt #${receipt.orderNumber} · ${receipt.storeName}`,
          text: `Digital Thermal Receipt from ${receipt.storeName} · Total: ${formatPKR(receipt.total)}`,
        });
      } catch {}
    }
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title="Official Digital Thermal Receipt"
      subtitle="Verified electronic receipt issued by retail POS counter"
      widthClass="w-full sm:max-w-[480px]"
    >
      <div className="space-y-4">
        {/* Paper Thermal Receipt Simulator */}
        <div className="bg-theme rounded-[16px] border border-default/70 p-5 font-mono text-xs text-heading space-y-4 shadow-sm print:m-0 print:border-none">
          {/* Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-default/70">
            <h3 className="font-bold text-sm tracking-wide uppercase">
              {receipt.storeName}
            </h3>
            <p className="text-[11px] text-body">{receipt.storeAddress}</p>
            <p className="text-[11px] text-body">Tel: {receipt.storePhone}</p>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-1 text-[11px] text-body pb-2 border-b border-dashed border-default/70">
            <div>
              <span>Receipt #: </span>
              <strong className="text-heading font-semibold">{receipt.orderNumber}</strong>
            </div>
            <div className="text-right">
              <span>Date: </span>
              <strong className="text-heading">{receipt.date ? formatDate(receipt.date) : "Recent"}</strong>
            </div>
            <div>
              <span>Payment: </span>
              <strong className="text-heading">{receipt.paymentMethod || "Cash"}</strong>
            </div>
            <div className="text-right">
              <span>Items: </span>
              <strong className="text-heading">{receipt.itemsCount}</strong>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2 py-1">
            <div className="grid grid-cols-12 text-[10px] uppercase font-bold text-muted border-b border-default/40 pb-1">
              <span className="col-span-6">Item</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-4 text-right">Amount</span>
            </div>

            {receipt.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 text-[11px] items-center">
                <div className="col-span-6">
                  <p className="font-medium text-heading truncate">{item.productName}</p>
                  <p className="text-[10px] text-muted">{item.variantName}</p>
                </div>
                <div className="col-span-2 text-center text-body">{item.quantity}</div>
                <div className="col-span-4 text-right font-medium text-heading">
                  {formatPKR(item.total)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1.5 pt-3 border-t border-dashed border-default/70 text-[11px]">
            <div className="flex justify-between text-body">
              <span>Subtotal:</span>
              <span>{formatPKR(receipt.subtotal)}</span>
            </div>
            {receipt.discount > 0 && (
              <div className="flex justify-between text-status-success font-medium">
                <span>Discount:</span>
                <span>-{formatPKR(receipt.discount)}</span>
              </div>
            )}
            {receipt.tax > 0 && (
              <div className="flex justify-between text-body">
                <span>Tax:</span>
                <span>{formatPKR(receipt.tax)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-heading pt-2 border-t border-default/60">
              <span>Total Paid:</span>
              <span>{formatPKR(receipt.total)}</span>
            </div>
          </div>

          {/* Rewards Earned Callout */}
          {(receipt.loyaltyPointsEarned > 0 || receipt.tryOnCreditsAwarded > 0) && (
            <div className="p-2.5 rounded-[10px] bg-card border border-accent/30 text-[11px] space-y-1">
              <span className="font-bold text-heading flex items-center gap-1">
                <Sparkles className="size-3.5 text-accent" />
                Rewards Earned on this Checkout:
              </span>
              <div className="flex items-center gap-3 text-body font-sans text-[11px]">
                {receipt.tryOnCreditsAwarded > 0 && (
                  <span>+{receipt.tryOnCreditsAwarded} AI Try-On Credits</span>
                )}
                {receipt.loyaltyPointsEarned > 0 && (
                  <span>+{receipt.loyaltyPointsEarned} Loyalty Points</span>
                )}
              </div>
            </div>
          )}

          {/* Exchange Policy & Barcode */}
          <div className="text-center pt-2 space-y-2 border-t border-dashed border-default/70">
            <p className="text-[10px] text-body italic leading-relaxed">
              {receipt.exchangePolicy || "Exchange within 7 days with original receipt. No cash refunds."}
            </p>
            <div className="py-2">
              <div className="h-8 max-w-[200px] mx-auto bg-heading flex items-center justify-around px-2">
                {[...Array(30)].map((_, i) => (
                  <span
                    key={i}
                    className={`h-full ${i % 3 === 0 ? "w-1 bg-white" : "w-0.5 bg-white"}`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono tracking-widest text-muted block mt-1">
                *{receipt.orderNumber}*
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="outline" size="default" onClick={handlePrint} className="text-xs">
            <Printer className="size-4 mr-1.5" />
            Print Receipt
          </Button>
          <Button variant="primary" size="default" onClick={handleShare} className="text-xs">
            <Share2 className="size-4 mr-1.5" />
            Share / Save
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
