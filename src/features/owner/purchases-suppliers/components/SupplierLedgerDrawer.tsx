"use client";

import * as React from "react";
import { SupplierItem, SupplierLedgerEntry } from "../types/purchases-suppliers.types";
import { Drawer } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SegmentedFilter, SegmentedFilterOption } from "@/components/ui/segmented-filter";
import { formatPKR } from "@/lib/formatters";
import { Phone, MapPin, CreditCard, Plus, Clock, FileText } from "lucide-react";

interface SupplierLedgerDrawerProps {
  open: boolean;
  onClose: () => void;
  supplier: SupplierItem | null;
  ledgerEntries: SupplierLedgerEntry[];
  onOpenRecordPayment: (supplier: SupplierItem) => void;
  onOpenNewPurchase: (supplier: SupplierItem) => void;
}

const LEDGER_FILTERS: SegmentedFilterOption[] = [
  { label: "All Transactions", value: "all" },
  { label: "Purchases", value: "PURCHASE" },
  { label: "Payments", value: "PAYMENT" },
];

export function SupplierLedgerDrawer({
  open,
  onClose,
  supplier,
  ledgerEntries,
  onOpenRecordPayment,
  onOpenNewPurchase,
}: SupplierLedgerDrawerProps) {
  const [filter, setFilter] = React.useState("all");

  if (!supplier) return null;

  const filteredEntries = React.useMemo(() => {
    if (filter === "all") return ledgerEntries;
    return ledgerEntries.filter((e) => e.type === filter);
  }, [ledgerEntries, filter]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={supplier.name}
      subtitle={supplier.category}
      widthClass="w-full sm:max-w-[560px] md:max-w-[640px]"
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

          <div className="flex items-center gap-2">
            {supplier.outstandingBalance > 0 && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => onOpenRecordPayment(supplier)}
                className="gap-1.5 rounded-full px-4 font-medium"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay Supplier</span>
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenNewPurchase(supplier)}
              className="gap-1.5 rounded-full px-4 font-medium bg-card"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New PO</span>
            </Button>
          </div>
        </div>
      }
    >
      {/* Scrollable Body Content with Uniform Inner Padding */}
      <div className="px-4 sm:px-6 py-5 space-y-5 sm:space-y-6 select-none">
        {/* 1. Outstanding Balance Hero Card */}
        <div className="rounded-[14px] sm:rounded-[16px] bg-theme border border-primary/30 p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-xs text-body font-medium">
              Outstanding Payable Balance
            </span>
            <span
              className={`font-heading font-bold text-2xl sm:text-3xl ${
                supplier.outstandingBalance > 0 ? "text-status-error" : "text-heading"
              }`}
            >
              {formatPKR(supplier.outstandingBalance)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {supplier.outstandingBalance > 0 && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => onOpenRecordPayment(supplier)}
                className="gap-1.5 font-medium shrink-0"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay</span>
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenNewPurchase(supplier)}
              className="gap-1.5 font-medium shrink-0 bg-card"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>PO</span>
            </Button>
          </div>
        </div>

        {/* 2. Supplier Details & Terms Card */}
        <div className="rounded-[14px] sm:rounded-[16px] bg-card border border-default/50 p-4 sm:p-5 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-muted">Contact Person</span>
            <span className="font-sans text-xs font-semibold text-heading">
              {supplier.contactPerson}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-muted flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              Phone Number
            </span>
            <span className="font-sans text-xs font-medium text-heading">
              {supplier.phone}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-muted flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Location
            </span>
            <span className="font-sans text-xs font-medium text-heading truncate max-w-[260px]">
              {supplier.city} {supplier.address ? `· ${supplier.address}` : ""}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-default/30">
            <span className="font-sans text-xs text-muted flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Payment Terms
            </span>
            <Badge variant="outline" size="sm" className="text-xs">
              {supplier.paymentTerms}
            </Badge>
          </div>
        </div>

        {/* 3. Transaction Statement & Ledger Section */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <h4 className="font-heading font-semibold text-sm sm:text-base text-heading">
              Statement & Ledger
            </h4>

            {/* Segmented Filter Pills */}
            <SegmentedFilter
              options={LEDGER_FILTERS}
              value={filter}
              onChange={setFilter}
              sizeVariant="sm"
              aria-label="Filter ledger entries by transaction type"
            />
          </div>

          {filteredEntries.length === 0 ? (
            <div className="rounded-[14px] sm:rounded-[16px] p-6 text-center border border-default/40 bg-card text-xs text-body font-sans">
              No transactions match the selected filter.
            </div>
          ) : (
            <div className="rounded-[14px] sm:rounded-[16px] bg-card border border-default/50 overflow-hidden divide-y divide-default/30 shadow-xs">
              {filteredEntries.map((entry) => {
                const isPayment = entry.type === "PAYMENT";
                const isPurchase = entry.type === "PURCHASE";

                return (
                  <div
                    key={entry.id}
                    className="p-3.5 sm:p-4 flex flex-col gap-1.5 hover:bg-subtle/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={isPayment ? "delivered" : "gold"}
                          size="sm"
                          className="text-[11px]"
                        >
                          {entry.type}
                        </Badge>
                        <span className="font-sans text-xs font-semibold text-heading">
                          {entry.reference}
                        </span>
                      </div>
                      <span className="font-sans text-xs text-muted">
                        {entry.date}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-sans pt-1">
                      <span className="text-body text-[11px] line-clamp-1 max-w-[240px]">
                        {entry.notes || "—"}
                      </span>
                      <div className="flex items-center gap-3">
                        {isPurchase && (
                          <span className="text-heading font-medium">
                            +{formatPKR(entry.credit)}
                          </span>
                        )}
                        {isPayment && (
                          <span className="text-status-success font-medium">
                            -{formatPKR(entry.debit)}
                          </span>
                        )}
                        <span className="text-muted text-[11px]">
                          Bal: {formatPKR(entry.balance)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
