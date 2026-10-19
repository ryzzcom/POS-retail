"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/data-display/data-table";
import { exportToCsv } from "@/lib/export";
import { formatPKR } from "@/lib/formatters";
import {
  MOCK_FINANCE_SUMMARY,
  MOCK_EXPENSES_BY_CATEGORY,
  MOCK_CASH_DRAWER_MOVEMENTS,
  MOCK_RECEIVABLES_AGING,
  MOCK_SUPPLIER_PAYABLES,
} from "../constants";
import {
  ExpenseCategoryRow,
  CashDrawerMovementRow,
  ReceivablesAgingRow,
  SupplierPayableRow,
} from "../types";
import { Download } from "lucide-react";

function formatPkrWithSign(val: number): string {
  if (val < 0) {
    return `-Rs. ${Math.abs(val).toLocaleString("en-PK")}`;
  }
  return `Rs. ${val.toLocaleString("en-PK")}`;
}

export function FinanceReportTab() {
  const summary = MOCK_FINANCE_SUMMARY;

  // 1. Expenses by Category Columns
  const expenseCategoryColumns: ColumnDef<ExpenseCategoryRow>[] = [
    {
      id: "category",
      header: "Category",
      accessorKey: "category",
      cell: (row) => <span className="font-medium text-heading">{row.category}</span>,
    },
    {
      id: "recorded",
      header: "Recorded",
      accessorKey: "recorded",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-heading">{formatPKR(row.recorded)}</span>
      ),
    },
    {
      id: "paid",
      header: "Paid",
      accessorKey: "paid",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-body">{formatPKR(row.paid)}</span>
      ),
    },
  ];

  // 2. Cash Drawer Movements Columns
  const cashMovementColumns: ColumnDef<CashDrawerMovementRow>[] = [
    {
      id: "time",
      header: "Time",
      accessorKey: "time",
      cell: (row) => <span className="text-xs text-body whitespace-nowrap">{row.time}</span>,
    },
    {
      id: "type",
      header: "Type",
      accessorKey: "type",
      cell: (row) => (
        <span className="text-xs font-medium text-heading capitalize">
          {row.type}
        </span>
      ),
    },
    {
      id: "reference",
      header: "Reference",
      accessorKey: "reference",
      cell: (row) => <span className="text-xs text-body">{row.reference}</span>,
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
      align: "right",
      cell: (row) => {
        const isNegative = row.amount < 0;
        return (
          <span
            className={`font-medium text-xs sm:text-sm whitespace-nowrap ${
              isNegative ? "text-status-error" : "text-status-success"
            }`}
          >
            {formatPkrWithSign(row.amount)}
          </span>
        );
      },
    },
  ];

  // 3. Receivables Aging Columns
  const receivablesAgingColumns: ColumnDef<ReceivablesAgingRow>[] = [
    {
      id: "customer",
      header: "Customer",
      accessorKey: "customer",
      cell: (row) => <span className="font-medium text-heading">{row.customer}</span>,
    },
    {
      id: "balance",
      header: "Balance",
      accessorKey: "balance",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-heading">{formatPKR(row.balance)}</span>
      ),
    },
    {
      id: "current",
      header: "Current",
      accessorKey: "current",
      align: "right",
      cell: (row) => (
        <span className="text-body text-xs sm:text-sm">{formatPKR(row.current)}</span>
      ),
    },
    {
      id: "overdue1to30",
      header: "1–30 overdue",
      accessorKey: "overdue1to30",
      align: "right",
      cell: (row) => (
        <span
          className={`text-xs sm:text-sm ${
            row.overdue1to30 > 0 ? "text-status-warning font-medium" : "text-muted"
          }`}
        >
          {formatPKR(row.overdue1to30)}
        </span>
      ),
    },
    {
      id: "overdue31to60",
      header: "31–60",
      accessorKey: "overdue31to60",
      align: "right",
      cell: (row) => (
        <span
          className={`text-xs sm:text-sm ${
            row.overdue31to60 > 0 ? "text-status-error font-medium" : "text-muted"
          }`}
        >
          {formatPKR(row.overdue31to60)}
        </span>
      ),
    },
  ];

  // 4. Supplier Payables Columns
  const supplierPayableColumns: ColumnDef<SupplierPayableRow>[] = [
    {
      id: "supplier",
      header: "Supplier",
      accessorKey: "supplier",
      cell: (row) => <span className="font-medium text-heading">{row.supplier}</span>,
    },
    {
      id: "balance",
      header: "Balance",
      accessorKey: "balance",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-heading">{formatPKR(row.balance)}</span>
      ),
    },
  ];

  // CSV Handlers
  const handleExportExpenses = () => {
    exportToCsv(
      "expenses_by_category",
      ["Category", "Recorded", "Paid"],
      MOCK_EXPENSES_BY_CATEGORY.map((e) => [e.category, e.recorded, e.paid])
    );
  };

  const handleExportCashMovements = () => {
    exportToCsv(
      "cash_drawer_movements",
      ["Time", "Type", "Reference", "Amount"],
      MOCK_CASH_DRAWER_MOVEMENTS.map((c) => [c.time, c.type, c.reference, c.amount])
    );
  };

  const handleExportReceivables = () => {
    exportToCsv(
      "receivables_aging",
      ["Customer", "Total Balance", "Current", "1-30 Days Overdue", "31-60 Days Overdue"],
      MOCK_RECEIVABLES_AGING.map((r) => [
        r.customer,
        r.balance,
        r.current,
        r.overdue1to30,
        r.overdue31to60,
      ])
    );
  };

  const handleExportPayables = () => {
    exportToCsv(
      "supplier_payables",
      ["Supplier", "Balance Owed"],
      MOCK_SUPPLIER_PAYABLES.map((s) => [s.supplier, s.balance])
    );
  };

  return (
    <div className="space-y-6">
      {/* 6-Metric KPI Summary Strip */}
      <div className="bg-card rounded-[18px] border border-default/50 p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 divide-y sm:divide-y-0 divide-default/40">
          <div>
            <p className="text-xs font-sans text-body">Net sales</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {formatPKR(summary.netSales)}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">Gross profit</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {formatPKR(summary.grossProfit)}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">Operating expenses</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {formatPKR(summary.operatingExpenses)}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">Est. operating profit</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-status-error mt-1">
              {formatPkrWithSign(summary.estOperatingProfit)}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">Customers owe you</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {formatPKR(summary.customersOweYou)}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">You owe suppliers</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {formatPKR(summary.youOweSuppliers)}
            </p>
          </div>
        </div>
      </div>

      {/* Top Grid: Expenses by category + Cash drawer movements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category Card */}
        <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
          <div className="flex items-center p-4 sm:p-5 justify-between">
            <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
              Expenses by category
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExpenses}
              className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
            >
              <Download className="size-3 text-body" />
              <span>CSV</span>
            </Button>
          </div>
          <DataTable
            data={MOCK_EXPENSES_BY_CATEGORY}
            columns={expenseCategoryColumns}
            keyExtractor={(item) => item.id}
            roundedTop={false}
          />
        </div>

        {/* Cash Drawer Movements Card */}
        <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
          <div className="flex items-center p-4 sm:p-5 justify-between">
            <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
              Cash drawer movements (current shift)
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCashMovements}
              className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
            >
              <Download className="size-3 text-body" />
              <span>CSV</span>
            </Button>
          </div>
          <DataTable
            data={MOCK_CASH_DRAWER_MOVEMENTS}
            columns={cashMovementColumns}
            keyExtractor={(item) => item.id}
            roundedTop={false}
          />
        </div>
      </div>

      {/* Bottom Grid: Receivables aging + Supplier payables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receivables Aging Card */}
        <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
          <div className="flex items-center p-4 sm:p-5 justify-between">
            <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
              Receivables aging
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportReceivables}
              className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
            >
              <Download className="size-3 text-body" />
              <span>CSV</span>
            </Button>
          </div>
          <DataTable
            data={MOCK_RECEIVABLES_AGING}
            columns={receivablesAgingColumns}
            keyExtractor={(item) => item.id}
            roundedTop={false}
          />
        </div>

        {/* Supplier Payables Card */}
        <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
          <div className="flex items-center p-4 sm:p-5 justify-between">
            <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
              Supplier payables
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPayables}
              className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
            >
              <Download className="size-3 text-body" />
              <span>CSV</span>
            </Button>
          </div>
          <DataTable
            data={MOCK_SUPPLIER_PAYABLES}
            columns={supplierPayableColumns}
            keyExtractor={(item) => item.id}
            roundedTop={false}
          />
        </div>
      </div>
    </div>
  );
}
