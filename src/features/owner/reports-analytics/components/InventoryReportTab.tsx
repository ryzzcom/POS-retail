"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/data-display/data-table";
import { exportToCsv } from "@/lib/export";
import { formatPKR } from "@/lib/formatters";
import {
  MOCK_INVENTORY_SUMMARY,
  MOCK_STOCK_VALUATION,
  MOCK_LOW_STOCK,
  MOCK_DEAD_STOCK,
  MOCK_STOCK_MOVEMENTS,
} from "../constants";
import {
  StockValuationRow,
  LowStockRow,
  DeadStockRow,
  StockMovementRow,
} from "../types";
import { Download, PackageOpen } from "lucide-react";

export function InventoryReportTab() {
  const summary = MOCK_INVENTORY_SUMMARY;

  // 1. Current Stock & Valuation Columns
  const valuationColumns: ColumnDef<StockValuationRow>[] = [
    {
      id: "product",
      header: "Product",
      accessorKey: "product",
      cell: (row) => (
        <span className="font-medium text-heading text-xs sm:text-sm">
          {row.product}
        </span>
      ),
    },
    {
      id: "sku",
      header: "SKU",
      accessorKey: "sku",
      cell: (row) => <span className="text-xs text-muted font-mono">{row.sku}</span>,
    },
    {
      id: "onHand",
      header: "On hand",
      accessorKey: "onHand",
      align: "center",
      cell: (row) => (
        <span className="font-medium text-heading text-xs sm:text-sm">
          {row.onHand}
        </span>
      ),
    },
    {
      id: "unitCost",
      header: "Unit cost",
      accessorKey: "unitCost",
      align: "right",
      cell: (row) => (
        <span className="text-body text-xs sm:text-sm">{formatPKR(row.unitCost)}</span>
      ),
    },
    {
      id: "value",
      header: "Value",
      accessorKey: "value",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-heading text-xs sm:text-sm">
          {formatPKR(row.value)}
        </span>
      ),
    },
  ];

  // 2. Low Stock Columns
  const lowStockColumns: ColumnDef<LowStockRow>[] = [
    {
      id: "variant",
      header: "Variant",
      accessorKey: "variant",
      cell: (row) => (
        <span className="font-medium text-heading text-xs sm:text-sm">
          {row.variant}
        </span>
      ),
    },
    {
      id: "onHand",
      header: "On hand",
      accessorKey: "onHand",
      align: "center",
      cell: (row) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-status-error-bg text-status-error">
          {row.onHand} left
        </span>
      ),
    },
    {
      id: "reorderAt",
      header: "Reorder at",
      accessorKey: "reorderAt",
      align: "center",
      cell: (row) => (
        <span className="text-body text-xs sm:text-sm">{row.reorderAt} units</span>
      ),
    },
  ];

  // 3. Dead / Slow Stock Columns
  const deadStockColumns: ColumnDef<DeadStockRow>[] = [
    {
      id: "product",
      header: "Product",
      accessorKey: "product",
      cell: (row) => (
        <span className="font-medium text-heading text-xs sm:text-sm">
          {row.product}
        </span>
      ),
    },
    {
      id: "unitCost",
      header: "Unit cost",
      accessorKey: "unitCost",
      align: "right",
      cell: (row) => (
        <span className="text-body text-xs sm:text-sm">{formatPKR(row.unitCost)}</span>
      ),
    },
    {
      id: "value",
      header: "Value",
      accessorKey: "value",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-status-warning text-xs sm:text-sm">
          {formatPKR(row.value)}
        </span>
      ),
    },
  ];

  // 4. Stock Movements Columns
  const movementColumns: ColumnDef<StockMovementRow>[] = [
    {
      id: "time",
      header: "Time",
      accessorKey: "time",
      cell: (row) => <span className="text-xs text-body">{row.time}</span>,
    },
    {
      id: "type",
      header: "Type",
      accessorKey: "type",
      cell: (row) => <span className="font-medium text-heading">{row.type}</span>,
    },
    {
      id: "product",
      header: "Product",
      accessorKey: "product",
      cell: (row) => <span className="text-heading text-xs sm:text-sm">{row.product}</span>,
    },
    {
      id: "quantity",
      header: "Quantity",
      accessorKey: "quantity",
      align: "center",
      cell: (row) => <span className="text-body font-medium">{row.quantity}</span>,
    },
    {
      id: "reason",
      header: "Reason",
      accessorKey: "reason",
      cell: (row) => <span className="text-xs text-muted">{row.reason}</span>,
    },
  ];

  // CSV Export Handlers
  const handleExportValuation = () => {
    exportToCsv(
      "inventory_stock_valuation",
      ["Product", "SKU", "Units On Hand", "Unit Cost", "Total Value"],
      MOCK_STOCK_VALUATION.map((s) => [s.product, s.sku, s.onHand, s.unitCost, s.value])
    );
  };

  const handleExportLowStock = () => {
    exportToCsv(
      "low_stock_report",
      ["Variant", "On Hand", "Reorder Threshold"],
      MOCK_LOW_STOCK.map((l) => [l.variant, l.onHand, l.reorderAt])
    );
  };

  const handleExportDeadStock = () => {
    exportToCsv(
      "dead_slow_stock_report",
      ["Product", "Unit Cost", "Tied-Up Value"],
      MOCK_DEAD_STOCK.map((d) => [d.product, d.unitCost, d.value])
    );
  };

  const handleExportMovements = () => {
    exportToCsv(
      "stock_movements_report",
      ["Time", "Type", "Product", "Quantity", "Reason"],
      MOCK_STOCK_MOVEMENTS.map((m) => [m.time, m.type, m.product, m.quantity, m.reason])
    );
  };

  return (
    <div className="space-y-6">
      {/* 5-Metric KPI Summary Strip */}
      <div className="bg-card rounded-[18px] border border-default/50 p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 divide-y sm:divide-y-0 divide-default/40">
          <div>
            <p className="text-xs font-sans text-body">Units on hand</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {summary.unitsOnHand}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">Stock at cost</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {formatPKR(summary.stockAtCost)}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">Stock at retail</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {formatPKR(summary.stockAtRetail)}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">Low stock</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-status-warning mt-1">
              {summary.lowStockCount}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">No sale in 90+ days</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-status-error mt-1">
              {summary.deadStockCount}
            </p>
          </div>
        </div>
      </div>

      {/* Current Stock & Valuation Card */}
      <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
        <div className="flex items-center p-4 sm:p-5 justify-between">
          <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
            Current stock & valuation
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportValuation}
            className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
          >
            <Download className="size-3 text-body" />
            <span>CSV</span>
          </Button>
        </div>
        <DataTable
          data={MOCK_STOCK_VALUATION}
          columns={valuationColumns}
          keyExtractor={(item) => item.id}
          roundedTop={false}
        />
      </div>

      {/* Grid: Low Stock + Dead / Slow Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Card */}
        <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
          <div className="flex items-center p-4 sm:p-5 justify-between">
            <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
              Low stock
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportLowStock}
              className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
            >
              <Download className="size-3 text-body" />
              <span>CSV</span>
            </Button>
          </div>
          <DataTable
            data={MOCK_LOW_STOCK}
            columns={lowStockColumns}
            keyExtractor={(item) => item.id}
            roundedTop={false}
          />
        </div>

        {/* Dead / Slow Stock Card */}
        <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
          <div className="flex items-center p-4 sm:p-5 justify-between">
            <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
              Dead / slow stock
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportDeadStock}
              className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
            >
              <Download className="size-3 text-body" />
              <span>CSV</span>
            </Button>
          </div>
          <DataTable
            data={MOCK_DEAD_STOCK}
            columns={deadStockColumns}
            keyExtractor={(item) => item.id}
            roundedTop={false}
          />
        </div>
      </div>

      {/* Stock Movements Card */}
      <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
        <div className="flex items-center p-4 sm:p-5 justify-between">
          <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
            Stock movements
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportMovements}
            className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
          >
            <Download className="size-3 text-body" />
            <span>CSV</span>
          </Button>
        </div>

        {MOCK_STOCK_MOVEMENTS.length > 0 ? (
          <DataTable
            data={MOCK_STOCK_MOVEMENTS}
            columns={movementColumns}
            keyExtractor={(item) => item.id}
            roundedTop={false}
          />
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="size-11 rounded-full bg-subtle/60 flex items-center justify-center mb-2.5">
              <PackageOpen className="size-5 text-muted" />
            </div>
            <p className="text-body font-sans text-xs sm:text-sm">
              No stock movements recorded in this period.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
