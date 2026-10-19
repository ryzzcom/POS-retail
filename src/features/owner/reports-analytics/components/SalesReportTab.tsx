"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/data-display/data-table";
import { exportToCsv } from "@/lib/export";
import { formatPKR } from "@/lib/formatters";
import {
  MOCK_SALES_SUMMARY,
  MOCK_DAILY_SALES,
  MOCK_PAYMENT_METHODS,
  MOCK_CASHIER_SALES,
  MOCK_BEST_SELLING_VARIANTS,
  MOCK_TRANSACTIONS,
} from "../constants";
import {
  DailySalesRow,
  PaymentMethodRow,
  CashierSalesRow,
  BestSellingVariantRow,
  ReportTransactionRow,
} from "../types";
import { Download } from "lucide-react";

export function SalesReportTab() {
  const summary = MOCK_SALES_SUMMARY;

  // 1. Daily Sales Columns
  const dailySalesColumns: ColumnDef<DailySalesRow>[] = [
    {
      id: "date",
      header: "Date",
      accessorKey: "date",
      cell: (row) => <span className="font-medium text-heading">{row.date}</span>,
    },
    {
      id: "orders",
      header: "Orders",
      accessorKey: "orders",
      align: "center",
      cell: (row) => <span className="text-body">{row.orders}</span>,
    },
    {
      id: "netSales",
      header: "Net sales",
      accessorKey: "netSales",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-heading">{formatPKR(row.netSales)}</span>
      ),
    },
    {
      id: "grossProfit",
      header: "Gross profit",
      accessorKey: "grossProfit",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-status-success">{formatPKR(row.grossProfit)}</span>
      ),
    },
  ];

  // 2. Payment Methods Columns
  const paymentMethodColumns: ColumnDef<PaymentMethodRow>[] = [
    {
      id: "method",
      header: "Method",
      accessorKey: "method",
      cell: (row) => <span className="font-medium text-heading">{row.method}</span>,
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-heading">{formatPKR(row.amount)}</span>
      ),
    },
    {
      id: "share",
      header: "Share",
      accessorKey: "share",
      align: "right",
      cell: (row) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-subtle/80 text-body">
          {row.share}%
        </span>
      ),
    },
  ];

  // 3. Cashier-wise Sales Columns
  const cashierSalesColumns: ColumnDef<CashierSalesRow>[] = [
    {
      id: "cashier",
      header: "Cashier",
      accessorKey: "cashier",
      cell: (row) => <span className="font-medium text-heading">{row.cashier}</span>,
    },
    {
      id: "orders",
      header: "Orders",
      accessorKey: "orders",
      align: "center",
      cell: (row) => <span className="text-body">{row.orders}</span>,
    },
    {
      id: "discounts",
      header: "Discounts",
      accessorKey: "discounts",
      align: "right",
      cell: (row) => (
        <span className="text-status-error font-medium">{formatPKR(row.discounts)}</span>
      ),
    },
    {
      id: "netSales",
      header: "Net sales",
      accessorKey: "netSales",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-heading">{formatPKR(row.netSales)}</span>
      ),
    },
    {
      id: "aov",
      header: "AOV",
      accessorKey: "aov",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-body">{formatPKR(row.aov)}</span>
      ),
    },
  ];

  // 4. Best-selling Variants Columns
  const variantColumns: ColumnDef<BestSellingVariantRow>[] = [
    {
      id: "variant",
      header: "Variant",
      accessorKey: "variant",
      cell: (row) => (
        <div>
          <p className="font-medium text-heading text-xs sm:text-sm">{row.variant}</p>
        </div>
      ),
    },
    {
      id: "sku",
      header: "SKU",
      accessorKey: "sku",
      cell: (row) => <span className="text-xs text-muted font-mono">{row.sku}</span>,
    },
    {
      id: "qty",
      header: "Qty",
      accessorKey: "qty",
      align: "center",
      cell: (row) => <span className="text-body font-medium">{row.qty}</span>,
    },
    {
      id: "revenue",
      header: "Revenue",
      accessorKey: "revenue",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-heading">{formatPKR(row.revenue)}</span>
      ),
    },
    {
      id: "margin",
      header: "Margin",
      accessorKey: "margin",
      align: "right",
      cell: (row) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-status-success-bg text-status-success">
          {row.margin}%
        </span>
      ),
    },
  ];

  // 5. Transactions Columns
  const transactionColumns: ColumnDef<ReportTransactionRow>[] = [
    {
      id: "receiptNo",
      header: "Receipt",
      accessorKey: "receiptNo",
      cell: (row) => (
        <span className="font-medium text-heading font-mono text-xs">
          {row.receiptNo}
        </span>
      ),
    },
    {
      id: "time",
      header: "Time",
      accessorKey: "time",
      cell: (row) => <span className="text-xs text-body">{row.time}</span>,
    },
    {
      id: "cashier",
      header: "Cashier",
      accessorKey: "cashier",
      cell: (row) => <span className="text-body text-xs sm:text-sm">{row.cashier}</span>,
    },
    {
      id: "customer",
      header: "Customer",
      accessorKey: "customer",
      cell: (row) => (
        <span className="font-medium text-heading text-xs sm:text-sm">
          {row.customer}
        </span>
      ),
    },
    {
      id: "total",
      header: "Total",
      accessorKey: "total",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-heading">{formatPKR(row.total)}</span>
      ),
    },
  ];

  // CSV Export Handlers
  const handleExportDailySales = () => {
    exportToCsv(
      "daily_sales_report",
      ["Date", "Orders", "Net Sales", "Gross Profit"],
      MOCK_DAILY_SALES.map((d) => [d.date, d.orders, d.netSales, d.grossProfit])
    );
  };

  const handleExportPaymentMethods = () => {
    exportToCsv(
      "payment_methods_report",
      ["Method", "Amount", "Share %"],
      MOCK_PAYMENT_METHODS.map((p) => [p.method, p.amount, `${p.share}%`])
    );
  };

  const handleExportCashierSales = () => {
    exportToCsv(
      "cashier_sales_report",
      ["Cashier", "Orders", "Discounts", "Net Sales", "AOV"],
      MOCK_CASHIER_SALES.map((c) => [c.cashier, c.orders, c.discounts, c.netSales, c.aov])
    );
  };

  const handleExportVariants = () => {
    exportToCsv(
      "best_selling_variants",
      ["Variant", "SKU", "Quantity", "Revenue", "Margin %"],
      MOCK_BEST_SELLING_VARIANTS.map((v) => [v.variant, v.sku, v.qty, v.revenue, `${v.margin}%`])
    );
  };

  const handleExportTransactions = () => {
    exportToCsv(
      "sales_transactions",
      ["Receipt No", "Time", "Cashier", "Customer", "Total"],
      MOCK_TRANSACTIONS.map((t) => [t.receiptNo, t.time, t.cashier, t.customer, t.total])
    );
  };

  return (
    <div className="space-y-6">
      {/* 6-Metric KPI Summary Strip */}
      <div className="bg-card rounded-[18px] border border-default/50 p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 divide-y sm:divide-y-0 divide-default/40">
          <div>
            <p className="text-xs font-sans text-body">Gross sales</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {formatPKR(summary.grossSales)}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">Discounts & points</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {formatPKR(summary.discountsAndPoints)}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">Net sales</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {formatPKR(summary.netSales)}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">COGS</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {formatPKR(summary.cogs)}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">Gross profit</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1 flex items-baseline gap-1.5 flex-wrap">
              <span>{formatPKR(summary.grossProfit)}</span>
              <span className="text-xs font-sans font-medium text-body">
                · {summary.grossProfitMargin}%
              </span>
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">Orders · AOV</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1 flex items-baseline gap-1.5 flex-wrap">
              <span>{summary.ordersCount}</span>
              <span className="text-xs font-sans font-medium text-body">
                · {formatPKR(summary.aov)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Daily Sales + Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Card */}
        <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
          <div className="flex items-center p-4 sm:p-5 justify-between">
            <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
              Daily sales
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportDailySales}
              className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
            >
              <Download className="size-3 text-body" />
              <span>CSV</span>
            </Button>
          </div>
          <DataTable
            data={MOCK_DAILY_SALES}
            columns={dailySalesColumns}
            keyExtractor={(item) => item.id}
            roundedTop={false}
          />
        </div>

        {/* Payment Methods Card */}
        <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
          <div className="flex items-center p-4 sm:p-5 justify-between">
            <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
              Payment methods
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPaymentMethods}
              className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
            >
              <Download className="size-3 text-body" />
              <span>CSV</span>
            </Button>
          </div>
          <DataTable
            data={MOCK_PAYMENT_METHODS}
            columns={paymentMethodColumns}
            keyExtractor={(item) => item.id}
            roundedTop={false}
          />
        </div>
      </div>

      {/* Cashier-wise Sales Card */}
      <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
        <div className="flex items-center p-4 sm:p-5 justify-between">
          <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
            Cashier-wise sales
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCashierSales}
            className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
          >
            <Download className="size-3 text-body" />
            <span>CSV</span>
          </Button>
        </div>
        <DataTable
          data={MOCK_CASHIER_SALES}
          columns={cashierSalesColumns}
          keyExtractor={(item) => item.id}
          roundedTop={false}
        />
      </div>

      {/* Best-selling Variants Card */}
      <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
        <div className="flex items-center p-4 sm:p-5 justify-between">
          <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
            Best-selling variants
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportVariants}
            className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
          >
            <Download className="size-3 text-body" />
            <span>CSV</span>
          </Button>
        </div>
        <DataTable
          data={MOCK_BEST_SELLING_VARIANTS}
          columns={variantColumns}
          keyExtractor={(item) => item.id}
          roundedTop={false}
        />
      </div>

      {/* Transactions Card */}
      <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
        <div className="flex items-center p-4 sm:p-5 justify-between">
          <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
            Transactions
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportTransactions}
            className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
          >
            <Download className="size-3 text-body" />
            <span>CSV</span>
          </Button>
        </div>
        <DataTable
          data={MOCK_TRANSACTIONS}
          columns={transactionColumns}
          keyExtractor={(item) => item.id}
          roundedTop={false}
        />
        {/* Footer Summary Strip */}
        <div className="flex items-center justify-between p-4 sm:p-5 pt-2 border-t border-default/40 text-xs text-body">
          <span>{MOCK_TRANSACTIONS.length} sales</span>
          <span className="font-heading font-semibold text-heading text-sm">
            {formatPKR(summary.netSales)}
          </span>
        </div>
      </div>
    </div>
  );
}
