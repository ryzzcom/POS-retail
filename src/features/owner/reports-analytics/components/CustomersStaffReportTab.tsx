"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/data-display/data-table";
import { exportToCsv } from "@/lib/export";
import { formatPKR } from "@/lib/formatters";
import {
  MOCK_CUSTOMER_SUMMARY,
  MOCK_TOP_CUSTOMERS,
  MOCK_COUPON_USAGE,
  MOCK_COUPON_REDEMPTIONS,
  MOCK_STAFF_PERFORMANCE,
} from "../constants";
import {
  TopCustomerRow,
  CouponUsageRow,
  CouponRedemptionRow,
  StaffPerformanceRow,
} from "../types";
import { Download } from "lucide-react";

export function CustomersStaffReportTab() {
  const summary = MOCK_CUSTOMER_SUMMARY;

  // 1. Top Customers by Lifetime Spend Columns
  const topCustomerColumns: ColumnDef<TopCustomerRow>[] = [
    {
      id: "customer",
      header: "Customer",
      accessorKey: "customer",
      cell: (row) => <span className="font-medium text-heading">{row.customer}</span>,
    },
    {
      id: "tier",
      header: "Tier",
      accessorKey: "tier",
      cell: (row) => {
        if (row.tier === "Gold") {
          return (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-accent/20 text-accent border border-accent/40">
              Gold
            </span>
          );
        }
        if (row.tier === "Silver") {
          return (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-subtle text-body border border-default">
              Silver
            </span>
          );
        }
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-theme text-muted border border-default/60">
            Regular
          </span>
        );
      },
    },
    {
      id: "lifetimeSpend",
      header: "Lifetime spend",
      accessorKey: "lifetimeSpend",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-heading">{formatPKR(row.lifetimeSpend)}</span>
      ),
    },
    {
      id: "points",
      header: "Points",
      accessorKey: "points",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-body">{row.points.toLocaleString()}</span>
      ),
    },
    {
      id: "lastVisit",
      header: "Last visit",
      accessorKey: "lastVisit",
      align: "right",
      cell: (row) => <span className="text-xs text-body">{row.lastVisit}</span>,
    },
  ];

  // 2. Coupon Usage Columns
  const couponUsageColumns: ColumnDef<CouponUsageRow>[] = [
    {
      id: "code",
      header: "Code",
      accessorKey: "code",
      cell: (row) => (
        <span className="font-mono font-medium text-heading text-xs">
          {row.code}
        </span>
      ),
    },
    {
      id: "uses",
      header: "Uses",
      accessorKey: "uses",
      align: "center",
      cell: (row) => <span className="text-body font-medium">{row.uses}</span>,
    },
    {
      id: "totalDiscount",
      header: "Total discount",
      accessorKey: "totalDiscount",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-heading">{formatPKR(row.totalDiscount)}</span>
      ),
    },
  ];

  // 3. Coupon Redemptions Columns
  const couponRedemptionColumns: ColumnDef<CouponRedemptionRow>[] = [
    {
      id: "customer",
      header: "Customer",
      accessorKey: "customer",
      cell: (row) => <span className="font-medium text-heading">{row.customer}</span>,
    },
    {
      id: "purchase",
      header: "Purchase",
      accessorKey: "purchase",
      cell: (row) => <span className="text-xs font-mono text-muted">{row.purchase}</span>,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <Badge variant="success" className="text-[11px] capitalize">
          {row.status}
        </Badge>
      ),
    },
    {
      id: "boughtAfter",
      header: "Benefit",
      accessorKey: "boughtAfter",
      align: "right",
      cell: (row) => (
        <span className="text-xs font-medium text-status-success">{row.boughtAfter}</span>
      ),
    },
  ];

  // 4. Staff Performance Columns
  const staffPerformanceColumns: ColumnDef<StaffPerformanceRow>[] = [
    {
      id: "staffName",
      header: "Staff Member",
      accessorKey: "staffName",
      cell: (row) => (
        <div>
          <p className="font-medium text-heading text-xs sm:text-sm">{row.staffName}</p>
          <p className="text-[11px] text-muted">{row.counter}</p>
        </div>
      ),
    },
    {
      id: "shiftCount",
      header: "Shifts",
      accessorKey: "shiftCount",
      align: "center",
      cell: (row) => <span className="text-body text-xs sm:text-sm">{row.shiftCount}</span>,
    },
    {
      id: "totalOrders",
      header: "Total orders",
      accessorKey: "totalOrders",
      align: "center",
      cell: (row) => (
        <span className="font-medium text-heading text-xs sm:text-sm">{row.totalOrders}</span>
      ),
    },
    {
      id: "totalSales",
      header: "Sales volume",
      accessorKey: "totalSales",
      align: "right",
      cell: (row) => (
        <span className="font-semibold text-heading text-xs sm:text-sm">
          {formatPKR(row.totalSales)}
        </span>
      ),
    },
    {
      id: "returnRate",
      header: "Return rate",
      accessorKey: "returnRate",
      align: "center",
      cell: (row) => (
        <span className="text-xs font-medium text-body">{row.returnRate}</span>
      ),
    },
    {
      id: "commissionEarned",
      header: "Incentives / Commission",
      accessorKey: "commissionEarned",
      align: "right",
      cell: (row) => (
        <span className="font-semibold text-status-success text-xs sm:text-sm">
          {formatPKR(row.commissionEarned)}
        </span>
      ),
    },
  ];

  // CSV Export Handlers
  const handleExportTopCustomers = () => {
    exportToCsv(
      "top_customers_lifetime_spend",
      ["Customer", "Tier", "Lifetime Spend", "Points", "Last Visit"],
      MOCK_TOP_CUSTOMERS.map((c) => [c.customer, c.tier, c.lifetimeSpend, c.points, c.lastVisit])
    );
  };

  const handleExportCouponUsage = () => {
    exportToCsv(
      "coupon_usage_report",
      ["Code", "Uses Count", "Total Discount Given"],
      MOCK_COUPON_USAGE.map((c) => [c.code, c.uses, c.totalDiscount])
    );
  };

  const handleExportCouponRedemptions = () => {
    exportToCsv(
      "coupon_redemptions_report",
      ["Customer", "Purchase / Order", "Status", "Benefit Saved"],
      MOCK_COUPON_REDEMPTIONS.map((r) => [r.customer, r.purchase, r.status, r.boughtAfter])
    );
  };

  const handleExportStaffPerformance = () => {
    exportToCsv(
      "staff_sales_performance",
      [
        "Staff Member",
        "Counter",
        "Shifts Count",
        "Total Orders Closed",
        "Sales Volume",
        "Return Rate",
        "Commission Earned",
      ],
      MOCK_STAFF_PERFORMANCE.map((s) => [
        s.staffName,
        s.counter,
        s.shiftCount,
        s.totalOrders,
        s.totalSales,
        s.returnRate,
        s.commissionEarned,
      ])
    );
  };

  return (
    <div className="space-y-6">
      {/* 6-Metric KPI Summary Strip */}
      <div className="bg-card rounded-[18px] border border-default/50 p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 divide-y sm:divide-y-0 divide-default/40">
          <div>
            <p className="text-xs font-sans text-body">Customers who bought</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {summary.customersWhoBought}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">New profiles</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {summary.newProfiles}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">Repeat rate</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-status-success mt-1">
              {summary.repeatRate}%
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">Points issued / redeemed</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {summary.pointsIssued} / {summary.pointsRedeemed}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">Referral conversion</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {summary.referralConversion}
            </p>
          </div>

          <div className="pt-3 sm:pt-0">
            <p className="text-xs font-sans text-body">Wishlist → purchase</p>
            <p className="font-heading font-semibold text-lg sm:text-xl text-heading mt-1">
              {summary.wishlistToPurchaseRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Top Customers by Lifetime Spend Card */}
      <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
        <div className="flex items-center p-4 sm:p-5 justify-between">
          <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
            Top customers by lifetime spend
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportTopCustomers}
            className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
          >
            <Download className="size-3 text-body" />
            <span>CSV</span>
          </Button>
        </div>
        <DataTable
          data={MOCK_TOP_CUSTOMERS}
          columns={topCustomerColumns}
          keyExtractor={(item) => item.id}
          roundedTop={false}
        />
      </div>

      {/* Grid: Coupon Usage + Coupon Redemptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coupon Usage Card */}
        <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
          <div className="flex items-center p-4 sm:p-5 justify-between">
            <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
              Coupon usage
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCouponUsage}
              className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
            >
              <Download className="size-3 text-body" />
              <span>CSV</span>
            </Button>
          </div>
          <DataTable
            data={MOCK_COUPON_USAGE}
            columns={couponUsageColumns}
            keyExtractor={(item) => item.id}
            roundedTop={false}
          />
        </div>

        {/* Coupon Redemptions Card */}
        <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
          <div className="flex items-center p-4 sm:p-5 justify-between">
            <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
              Coupon redemptions
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCouponRedemptions}
              className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
            >
              <Download className="size-3 text-body" />
              <span>CSV</span>
            </Button>
          </div>
          <DataTable
            data={MOCK_COUPON_REDEMPTIONS}
            columns={couponRedemptionColumns}
            keyExtractor={(item) => item.id}
            roundedTop={false}
          />
        </div>
      </div>

      {/* Sales Staff Performance & Commission Card */}
      <div className="bg-card rounded-[18px] border border-default/50 shadow-xs space-y-2">
        <div className="flex items-center p-4 sm:p-5 justify-between">
          <div>
            <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
              Sales staff performance & commission
            </h3>
            <p className="text-xs text-body font-sans mt-0.5">
              Shift tracking, sales conversion, returns, and calculated commission payouts.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportStaffPerformance}
            className="h-7 px-2.5 text-xs font-medium border-default/70 hover:bg-subtle/50 gap-1.5"
          >
            <Download className="size-3 text-body" />
            <span>CSV</span>
          </Button>
        </div>
        <DataTable
          data={MOCK_STAFF_PERFORMANCE}
          columns={staffPerformanceColumns}
          keyExtractor={(item) => item.id}
          roundedTop={false}
        />
      </div>
    </div>
  );
}
