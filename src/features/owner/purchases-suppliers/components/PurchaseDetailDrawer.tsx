"use client";

import * as React from "react";
import { PurchaseItem } from "../types/purchases-suppliers.types";
import { Drawer } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/formatters";
import { Clock, Calendar, Truck, PackageCheck } from "lucide-react";

interface PurchaseDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  purchase: PurchaseItem | null;
  onMarkReceived: (purchaseId: string) => void;
}

export function PurchaseDetailDrawer({
  open,
  onClose,
  purchase,
  onMarkReceived,
}: PurchaseDetailDrawerProps) {
  if (!purchase) return null;

  const isReceived = purchase.status === "Received";
  const isPartial = purchase.status === "Partial";
  const isCancelled = purchase.status === "Cancelled";

  const progressPercent =
    purchase.totalItems > 0
      ? Math.min(100, Math.round((purchase.receivedItems / purchase.totalItems) * 100))
      : 0;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={purchase.poNumber}
      subtitle={`Supplier: ${purchase.supplierName}`}
      widthClass="w-full sm:max-w-[560px] md:max-w-[620px]"
      headerClassName="px-4 sm:px-6 py-4 border-b border-default/50"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-full px-5"
          >
            Close
          </Button>

          {!isReceived && !isCancelled && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                onMarkReceived(purchase.id);
                onClose();
              }}
              className="gap-1.5 rounded-full px-5"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Receive All</span>
            </Button>
          )}
        </div>
      }
    >
      {/* Scrollable Body Content with Uniform Inner Padding */}
      <div className="px-4 sm:px-6 py-5 space-y-5 sm:space-y-6 select-none">
        {/* 1. Order Status & Delivery Progress Card */}
        <div className="rounded-[14px] sm:rounded-[16px] bg-card border border-default/50 p-4 sm:p-5 flex flex-col gap-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-muted">Order Status</span>
            <Badge
              variant={
                isReceived
                  ? "delivered"
                  : isPartial
                  ? "warning"
                  : isCancelled
                  ? "failed"
                  : "neutral"
              }
              size="default"
              className="text-xs font-medium"
            >
              {purchase.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs font-sans">
            <span className="text-muted flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Order Date
            </span>
            <span className="font-medium text-heading">{purchase.orderDate}</span>
          </div>

          <div className="flex items-center justify-between text-xs font-sans">
            <span className="text-muted flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Expected / Due Date
            </span>
            <span className="font-medium text-heading">{purchase.dueDate}</span>
          </div>

          {/* Delivery Progress Bar */}
          <div className="flex flex-col gap-1.5 pt-1 border-t border-default/30">
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="text-muted flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                Delivery Progress
              </span>
              <span className="font-semibold text-heading">
                {purchase.receivedItems} / {purchase.totalItems} items ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-subtle/50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. Goods Consignment Arrival Banner (if not fully received) */}
        {!isReceived && !isCancelled && (
          <div className="rounded-[14px] sm:rounded-[16px] bg-theme border border-primary/30 p-4 sm:p-5 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-xs font-medium text-heading">
                Goods Consignment Arrival
              </span>
              <span className="font-sans text-[11px] text-body">
                Confirm stock intake to update inventory quantities.
              </span>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                onMarkReceived(purchase.id);
                onClose();
              }}
              className="gap-1.5 font-medium shrink-0"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Receive All</span>
            </Button>
          </div>
        )}

        {/* 3. Ordered Line Items Table Card */}
        <div className="flex flex-col gap-2.5">
          <h4 className="font-heading font-semibold text-sm sm:text-base text-heading">
            Ordered Line Items
          </h4>

          <div className="rounded-[14px] sm:rounded-[16px] bg-card border border-default/50 overflow-hidden divide-y divide-default/30 shadow-xs">
            {purchase.lineItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 flex flex-col gap-1.5 hover:bg-subtle/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-sans text-xs sm:text-sm font-medium text-heading leading-snug">
                    {item.description}
                  </span>
                  <span className="font-sans text-xs sm:text-sm font-semibold text-heading whitespace-nowrap">
                    {formatPKR(item.total)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted font-sans pt-0.5">
                  <span>
                    Qty: {item.quantity} × {formatPKR(item.unitPrice)}
                  </span>
                  {item.receivedQuantity !== undefined && (
                    <span className="text-status-success font-medium">
                      Received: {item.receivedQuantity} / {item.quantity}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Cost & Financial Summary Card */}
        <div className="rounded-[14px] sm:rounded-[16px] bg-card border border-default/50 p-4 sm:p-5 flex flex-col gap-2.5 font-sans text-xs sm:text-sm shadow-xs">
          <div className="flex items-center justify-between text-body">
            <span>Payment Status:</span>
            <Badge variant="outline" size="sm" className="font-medium text-xs">
              {purchase.paymentStatus}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-body">
            <span>Total Bill Amount:</span>
            <span className="font-bold text-heading text-sm sm:text-base">
              {formatPKR(purchase.totalAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between text-body">
            <span>Amount Paid:</span>
            <span className="font-medium text-status-success">
              {formatPKR(purchase.paidAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between text-body pt-1.5 border-t border-default/30">
            <span>Remaining Due:</span>
            <span className="font-semibold text-status-error">
              {formatPKR(Math.max(0, purchase.totalAmount - purchase.paidAmount))}
            </span>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
