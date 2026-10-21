"use client";

import React, { useState } from "react";
import { CheckCircle2, RotateCw, Printer, MessageCircle, Check } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPKR } from "@/lib/formatters";
import { PosSaleResult } from "../types";

export interface PosSaleCompletedModalProps {
  saleResult: PosSaleResult | null;
  open: boolean;
  onStartNewSale: () => void;
}

/**
 * Sale Completed & Thermal Receipt Confirmation Modal matching Figma node 3448:41645.
 */
export function PosSaleCompletedModal({
  saleResult,
  open,
  onStartNewSale,
}: PosSaleCompletedModalProps) {
  const [paperWidth, setPaperWidth] = useState<"80mm" | "58mm">("80mm");
  const [printCount, setPrintCount] = useState<number>(1);
  const [whatsAppSent, setWhatsAppSent] = useState<boolean>(false);

  if (!saleResult) return null;

  const handleReprint = () => {
    setPrintCount((prev) => prev + 1);
  };

  const handleSendWhatsApp = () => {
    setWhatsAppSent(true);
  };

  return (
    <Dialog
      open={open}
      onClose={onStartNewSale}
      title="Sale completed"
      subtitle="Stock and payments were updated together."
      maxWidthClass="sm:max-w-[780px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 select-none py-1">
        {/* Left Column: Authentic Thermal Paper Receipt (6 cols) */}
        <div className="md:col-span-6 bg-theme border border-default p-4 rounded-[14px] shadow-sm font-mono text-xs text-heading flex flex-col gap-2 max-h-[480px] overflow-y-auto custom-scrollbar">
          {/* Receipt Store Header */}
          <div className="text-center pb-2 border-b border-dashed border-default">
            <h4 className="font-bold text-sm uppercase tracking-wide">
              Noor Pret & Boutique
            </h4>
            <p className="text-[11px] text-body mt-0.5">
              Shop 14, MM Alam Road, Gulberg III, Lahore
            </p>
            <p className="text-[11px] text-body">
              Tel 0321-4567890 · NTN 4471902-3
            </p>
          </div>

          {/* Receipt Metadata */}
          <div className="text-[11px] py-1 border-b border-dashed border-default flex flex-col gap-0.5 text-body">
            <div className="flex justify-between">
              <span>Receipt:</span>
              <span className="font-bold text-heading">
                {saleResult.receiptNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>
                {saleResult.completedAt} · {saleResult.cashierName}
              </span>
            </div>
            {saleResult.customer && (
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-medium text-heading">
                  {saleResult.customer.name} ({saleResult.customer.phone})
                </span>
              </div>
            )}
          </div>

          {/* Line Items */}
          <div className="py-2 border-b border-dashed border-default flex flex-col gap-1.5">
            {saleResult.items.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-0.5 text-[11px]">
                <div className="flex justify-between font-medium text-heading">
                  <span className="truncate pr-2">{item.productName}</span>
                  <span>{formatPKR(item.lineTotal)}</span>
                </div>
                <div className="flex justify-between text-body text-[10px]">
                  <span>
                    {item.size} / {item.color} · {item.quantity} x{" "}
                    {formatPKR(item.unitPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Totals */}
          <div className="py-2 border-b border-dashed border-default flex flex-col gap-1 text-[11px]">
            <div className="flex justify-between text-body">
              <span>Subtotal:</span>
              <span>{formatPKR(saleResult.subtotal)}</span>
            </div>

            {saleResult.billDiscountPKR > 0 && (
              <div className="flex justify-between text-status-error">
                <span>Discount:</span>
                <span>-{formatPKR(saleResult.billDiscountPKR)}</span>
              </div>
            )}

            {saleResult.pointsDiscountPKR > 0 && (
              <div className="flex justify-between text-status-error">
                <span>Loyalty ({saleResult.pointsRedeemed} pts):</span>
                <span>-{formatPKR(saleResult.pointsDiscountPKR)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-heading text-sm pt-1 border-t border-dashed border-default">
              <span>TOTAL:</span>
              <span>{formatPKR(saleResult.grandTotalPKR)}</span>
            </div>
          </div>

          {/* Payments & Change */}
          <div className="py-1 border-b border-dashed border-default flex flex-col gap-0.5 text-[11px]">
            {saleResult.tenders.map((t, idx) => (
              <div key={idx} className="flex justify-between capitalize text-body">
                <span>Paid ({t.method.replace("_", " ")}):</span>
                <span>{formatPKR(t.cashTendered || t.amount)}</span>
              </div>
            ))}
            {saleResult.changeDuePKR > 0 && (
              <div className="flex justify-between font-bold text-status-success">
                <span>Change Given:</span>
                <span>{formatPKR(saleResult.changeDuePKR)}</span>
              </div>
            )}
          </div>

          {/* Points & Policy */}
          {saleResult.customer && (
            <div className="text-[10px] text-body py-1 border-b border-dashed border-default">
              <p>Points earned on bill: +{saleResult.pointsEarned}</p>
              <p>New points balance: {saleResult.newPointsBalance}</p>
            </div>
          )}

          <div className="text-center text-[10px] text-body pt-1 leading-tight">
            <p>Exchange within 7 days with receipt and tags attached.</p>
            <p className="mt-1 font-semibold">Thank you for shopping with Noor!</p>
          </div>
        </div>

        {/* Right Column: Actions & Change Confirmation (6 cols) */}
        <div className="md:col-span-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-4">
            {/* Success Summary Header */}
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="size-6 text-status-success shrink-0" />
              <div className="flex flex-col">
                <span className="font-heading font-semibold text-base text-heading">
                  {saleResult.receiptNumber} saved ·{" "}
                  {formatPKR(saleResult.grandTotalPKR)}
                </span>
                <span className="font-sans text-xs text-body">
                  Stock and payments were updated together.
                </span>
              </div>
            </div>

            {/* Give Change Highlight Box */}
            <div className="p-4 rounded-[16px] bg-status-success-bg border border-status-success/60 flex flex-col gap-0.5">
              <span className="font-sans text-xs font-medium text-status-success">
                Give change
              </span>
              <span className="font-heading font-bold text-2xl text-status-success">
                {formatPKR(saleResult.changeDuePKR)}
              </span>
            </div>

            {/* Paper Width Selector */}
            <div className="flex items-center gap-2">
              <span className="font-sans text-xs text-body">Paper width:</span>
              <div className="flex items-center gap-1 bg-subtle/50 p-0.5 rounded-full border border-default/40">
                <button
                  type="button"
                  onClick={() => setPaperWidth("80mm")}
                  className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer ${
                    paperWidth === "80mm"
                      ? "bg-primary text-dark-primary shadow-xs"
                      : "text-body hover:text-heading"
                  }`}
                >
                  80mm
                </button>
                <button
                  type="button"
                  onClick={() => setPaperWidth("58mm")}
                  className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer ${
                    paperWidth === "58mm"
                      ? "bg-primary text-dark-primary shadow-xs"
                      : "text-body hover:text-heading"
                  }`}
                >
                  58mm
                </button>
              </div>
            </div>

            {/* Action Row 1: Reprint Receipt */}
            <div className="p-3 rounded-[12px] border border-default bg-card flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-sans text-heading font-medium">
                <Printer className="size-4 text-body" />
                <span>Reprint receipt</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReprint}
                className="h-7 px-3 text-xs rounded-full border-default hover:bg-subtle/50"
              >
                {printCount} printed
              </Button>
            </div>

            {/* Action Row 2: WhatsApp Receipt */}
            <div className="p-3 rounded-[12px] border border-default bg-card flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-sans text-heading font-medium">
                <MessageCircle className="size-4 text-status-success" />
                <span>WhatsApp receipt</span>
              </div>
              {whatsAppSent ? (
                <Badge variant="delivered" size="sm">
                  Delivered
                </Badge>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSendWhatsApp}
                  className="h-7 px-3 text-xs rounded-full border-default hover:bg-subtle/50"
                >
                  Send Now
                </Button>
              )}
            </div>

            <p className="font-sans text-[11px] text-muted leading-tight">
              Status only changes to &quot;Delivered&quot; after the WhatsApp
              provider confirms (Phase 6).
            </p>
          </div>

          {/* Primary CTA: Start New Sale */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onStartNewSale}
            className="w-full rounded-full h-12 text-sm font-sans font-medium flex items-center justify-center gap-2 shadow-xs"
          >
            <RotateCw className="size-4" />
            <span>New Sale</span>
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
