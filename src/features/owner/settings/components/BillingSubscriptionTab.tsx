"use client";

import * as React from "react";
import { formatPKR } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";
import {
  MOCK_BILLING_PLAN,
  MOCK_USAGE_METRICS,
  MOCK_PAYMENT_METHODS,
  MOCK_BILLING_INVOICES,
} from "../constants";
import { BillingInvoice } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/data-display/data-table";
import {
  CreditCard,
  Sparkles,
  Download,
  Calendar,
  CheckCircle2,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  FileText,
} from "lucide-react";

export function BillingSubscriptionTab() {
  const plan = MOCK_BILLING_PLAN;

  const handleDownloadInvoice = (inv: BillingInvoice) => {
    exportToCsv(
      `invoice_${inv.invoiceNumber}`,
      ["Invoice Number", "Date", "Description", "Amount", "Status"],
      [[inv.invoiceNumber, inv.date, inv.description, formatPKR(inv.amount), inv.status]]
    );
  };

  const invoiceColumns: ColumnDef<BillingInvoice>[] = [
    {
      id: "invoiceNumber",
      header: "Invoice ID",
      accessorKey: "invoiceNumber",
      cell: (row) => (
        <span className="font-mono font-medium text-xs sm:text-sm text-heading">
          {row.invoiceNumber}
        </span>
      ),
    },
    {
      id: "date",
      header: "Billing Date",
      accessorKey: "date",
      cell: (row) => <span className="text-xs text-body">{row.date}</span>,
    },
    {
      id: "description",
      header: "Plan & Add-ons",
      accessorKey: "description",
      cell: (row) => (
        <span className="font-medium text-heading text-xs sm:text-sm">
          {row.description}
        </span>
      ),
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
      align: "right",
      cell: (row) => (
        <span className="font-semibold text-heading text-xs sm:text-sm">
          {formatPKR(row.amount)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      align: "center",
      cell: (row) => (
        <Badge
          variant={row.status === "paid" ? "success" : "failed"}
          className="text-[11px] capitalize"
        >
          {row.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Receipt",
      align: "right",
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownloadInvoice(row)}
          className="h-7 px-2.5 text-xs gap-1.5 border-default/70 hover:bg-subtle/50"
        >
          <Download className="size-3 text-body" />
          <span>PDF / CSV</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 2-Column Top Section: Current Plan + Usage Limits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Active Subscription Plan */}
        <div className="bg-card rounded-[18px] border border-default/50 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-accent/20 text-accent border border-accent/40 flex items-center gap-1.5">
                <Sparkles className="size-3" />
                <span>{plan.name}</span>
              </span>
              <span className="text-xs text-status-success font-medium flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> Active & Verified
              </span>
            </div>

            <div>
              <p className="font-heading font-bold text-2xl sm:text-3xl text-heading">
                {formatPKR(plan.price)}{" "}
                <span className="text-xs font-sans text-body font-normal">/ month</span>
              </p>
              <p className="text-xs text-body font-sans mt-1">
                Billed annually ({formatPKR(plan.price * 12)} / year). Next billing renewal on{" "}
                <strong className="text-heading font-medium">{plan.renewalDate}</strong>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-[12px] bg-theme border border-default/50">
                <p className="text-[11px] text-body">POS Terminals</p>
                <p className="font-heading font-semibold text-heading text-sm sm:text-base mt-0.5">
                  {plan.activeRegisters}
                </p>
              </div>
              <div className="p-3 rounded-[12px] bg-theme border border-default/50">
                <p className="text-[11px] text-body">WhatsApp Quota</p>
                <p className="font-heading font-semibold text-heading text-sm sm:text-base mt-0.5">
                  {plan.whatsappCredits}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-default/40">
            <Button variant="primary" size="sm" className="gap-1.5 text-xs">
              <span>Upgrade Plan</span>
              <ArrowUpRight className="size-3.5" />
            </Button>
            <Button variant="outline" size="sm" className="text-xs border-default/70">
              Manage Add-ons
            </Button>
          </div>
        </div>

        {/* Card 2: Usage & Capacity Limits */}
        <div className="bg-card rounded-[18px] border border-default/50 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-heading text-base sm:text-lg">
              Resource Usage & Quotas
            </h3>
            <span className="text-xs text-body font-sans">Current billing period</span>
          </div>

          <div className="space-y-4 pt-1">
            {MOCK_USAGE_METRICS.map((metric) => (
              <div key={metric.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-heading">{metric.label}</span>
                  <span className="text-body font-sans">
                    {metric.unit === "%"
                      ? `${metric.used}%`
                      : `${metric.used.toLocaleString()} / ${metric.limit.toLocaleString()} ${
                          metric.unit
                        }`}
                  </span>
                </div>
                {/* Progress Track */}
                <div className="h-2 w-full rounded-full bg-subtle overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      metric.percentage > 85
                        ? "bg-status-warning"
                        : "bg-primary"
                    }`}
                    style={{ width: `${Math.min(metric.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card 3: Payment Methods */}
      <div className="bg-card rounded-[18px] border border-default/50 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-default/40 flex-wrap gap-2">
          <div>
            <h3 className="font-heading font-semibold text-heading text-base sm:text-lg">
              Authorized Payment Methods
            </h3>
            <p className="text-xs text-body font-sans mt-0.5">
              Secure billing through Pakistani banking partners and corporate cards.
            </p>
          </div>

          <Button variant="outline" size="sm" className="text-xs border-default/70">
            + Add Payment Method
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOCK_PAYMENT_METHODS.map((pm) => (
            <div
              key={pm.id}
              className={`p-4 rounded-[14px] border flex items-center justify-between gap-4 ${
                pm.isDefault
                  ? "bg-theme border-primary/40 shadow-xs"
                  : "bg-card border-default/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-[10px] bg-subtle/80 flex items-center justify-center text-primary shrink-0">
                  {pm.type === "card" ? (
                    <CreditCard className="size-5" />
                  ) : (
                    <Building2 className="size-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-heading font-medium text-heading text-sm">
                      {pm.title}
                    </p>
                    {pm.isDefault && (
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-primary text-dark-primary font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-body font-sans mt-0.5">{pm.subtitle}</p>
                </div>
              </div>

              <span className="text-xs font-mono text-muted">{pm.expiry}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card 4: Billing & Invoices History Table */}
      <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
        <div className="flex items-center justify-between p-4 sm:p-5">
          <div>
            <h3 className="font-heading font-semibold text-heading text-base sm:text-lg">
              Billing & Invoices History
            </h3>
            <p className="text-xs text-body font-sans mt-0.5">
              Tax receipts, POS subscription statements, and add-on payments.
            </p>
          </div>
        </div>

        <DataTable
          data={MOCK_BILLING_INVOICES}
          columns={invoiceColumns}
          keyExtractor={(item) => item.id}
          roundedTop={false}
        />
      </div>
    </div>
  );
}
