"use client";

import * as React from "react";
import { Drawer } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SegmentedFilter } from "@/components/ui/segmented-filter";
import { formatPKR } from "@/lib/formatters";
import { KhataAccount } from "../types/khata.types";
import {
  Phone,
  CreditCard,
  MessageCircle,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Sliders,
  Receipt,
  AlertCircle,
} from "lucide-react";

interface KhataDetailDrawerProps {
  account: KhataAccount | null;
  open: boolean;
  onClose: () => void;
  onRecordPayment: (account: KhataAccount) => void;
  onSendWhatsApp: (account: KhataAccount) => void;
  onAdjustLimit: (account: KhataAccount) => void;
}

export function KhataDetailDrawer({
  account,
  open,
  onClose,
  onRecordPayment,
  onSendWhatsApp,
  onAdjustLimit,
}: KhataDetailDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<"ledger" | "details">("ledger");

  if (!account) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={account.customerName}
      subtitle={`Khata Ledger · ${account.customerPhone}`}
      widthClass="w-full sm:max-w-[500px] md:max-w-[560px]"
      footer={
        <div className="flex items-center gap-2.5 w-full">
          {account.balance > 0 ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={() => onRecordPayment(account)}
                leftIcon={<CreditCard className="size-4" />}
                className="flex-1 text-xs sm:text-sm"
              >
                Record payment
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => onSendWhatsApp(account)}
                leftIcon={<MessageCircle className="size-4 text-status-success" />}
                className="flex-1 text-xs sm:text-sm"
              >
                WhatsApp reminder
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => onAdjustLimit(account)}
                leftIcon={<Sliders className="size-4" />}
                className="text-xs sm:text-sm px-3"
              >
                Adjust
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onAdjustLimit(account)}
                leftIcon={<Sliders className="size-4" />}
                className="text-xs sm:text-sm"
              >
                Adjust limit
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-xs sm:text-sm px-5"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-5 p-4 sm:p-6 select-none">
        {/* 1. Account Hero Card */}
        <div className="p-4 sm:p-5 rounded-[14px] sm:rounded-[16px] bg-card border border-default flex flex-col gap-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col">
              <span className="font-sans text-xs text-body">
                Current outstanding balance
              </span>
              <span className="font-heading font-semibold text-2xl sm:text-3xl text-heading mt-0.5">
                {formatPKR(account.balance)}
              </span>
            </div>

            {account.status === "overdue" && (
              <Badge variant="error" size="sm">
                Overdue ({account.oldestOpenDays}d)
              </Badge>
            )}
            {account.status === "within_terms" && (
              <Badge variant="success" size="sm">
                Within terms
              </Badge>
            )}
            {account.status === "settled" && (
              <Badge variant="neutral" size="sm">
                Settled
              </Badge>
            )}
          </div>

          {/* Credit Limit Utilization */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-default/50">
            <div className="flex items-center justify-between font-sans text-xs">
              <span className="text-body">Credit limit utilization</span>
              <span className="font-medium text-heading">
                {account.limitUsedPercent}% of {formatPKR(account.creditLimit)}
              </span>
            </div>
            <div className="h-2 w-full bg-subtle rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(100, account.limitUsedPercent)}%` }}
                className={
                  account.limitUsedPercent > 80
                    ? "h-full bg-status-error transition-all"
                    : "h-full bg-primary transition-all"
                }
              />
            </div>
          </div>
        </div>

        {/* 2. Drawer Tab Switcher */}
        <div className="border-b border-default/50 pb-2">
          <SegmentedFilter
            sizeVariant="sm"
            options={[
              {
                label: "Ledger timeline",
                value: "ledger",
                count: account.ledgerEntries?.length || 0,
              },
              { label: "Account details", value: "details" },
            ]}
            value={activeTab}
            onChange={(val) => setActiveTab(val as "ledger" | "details")}
            aria-label="Khata drawer tabs"
          />
        </div>

        {/* 3. Tab Contents */}
        {activeTab === "ledger" && (
          <div className="flex flex-col gap-3">
            <h3 className="font-heading font-semibold text-xs sm:text-sm text-heading uppercase tracking-wider">
              Transaction History
            </h3>

            {(!account.ledgerEntries || account.ledgerEntries.length === 0) ? (
              <div className="p-8 text-center text-body text-xs sm:text-sm">
                No ledger transactions recorded yet.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {account.ledgerEntries.map((entry) => {
                  const isCreditSale = entry.type === "credit_sale";
                  return (
                    <div
                      key={entry.id}
                      className="p-3 sm:p-3.5 rounded-[14px] sm:rounded-[16px] bg-card border border-default/60 flex items-start justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`size-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isCreditSale
                              ? "bg-status-error-bg text-status-error"
                              : "bg-status-success-bg text-status-success"
                          }`}
                        >
                          {isCreditSale ? (
                            <ArrowUpRight className="size-4" />
                          ) : (
                            <ArrowDownLeft className="size-4" />
                          )}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="font-sans font-medium text-xs sm:text-sm text-heading">
                            {entry.description}
                          </span>
                          <span className="font-sans text-[11px] text-body mt-0.5">
                            {entry.date}
                            {entry.receiptNo && ` · ${entry.receiptNo}`}
                            {entry.paymentMethod && ` · via ${entry.paymentMethod}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span
                          className={`font-heading font-medium text-xs sm:text-sm ${
                            isCreditSale
                              ? "text-status-error"
                              : "text-status-success"
                          }`}
                        >
                          {isCreditSale ? `+${formatPKR(entry.amount)}` : `-${formatPKR(entry.amount)}`}
                        </span>
                        <span className="font-sans text-[11px] text-muted mt-0.5">
                          Bal: {formatPKR(entry.balanceAfter)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "details" && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-[14px] sm:rounded-[16px] bg-card border border-default/60 flex flex-col gap-3 font-sans text-xs sm:text-sm">
              <div className="flex justify-between items-center py-1 border-b border-default/40">
                <span className="text-body flex items-center gap-2">
                  <Clock className="size-4 text-muted" />
                  Oldest Open Invoice
                </span>
                <span className="font-medium text-heading">
                  {account.oldestOpenDate}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-default/40">
                <span className="text-body flex items-center gap-2">
                  <AlertCircle className="size-4 text-muted" />
                  Terms Policy
                </span>
                <span className="font-medium text-heading">
                  30 Days from Sale
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-default/40">
                <span className="text-body flex items-center gap-2">
                  <CreditCard className="size-4 text-muted" />
                  Credit Limit
                </span>
                <span className="font-medium text-heading">
                  {formatPKR(account.creditLimit)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-body flex items-center gap-2">
                  <Receipt className="size-4 text-muted" />
                  Last Payment Recorded
                </span>
                <span className="font-medium text-heading">
                  {account.lastPaymentDate || "No payments recorded"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
