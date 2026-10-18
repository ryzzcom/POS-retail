"use client";

import * as React from "react";
import { DataTable, ColumnDef } from "@/components/data-display";
import { Badge } from "@/components/ui/badge";
import { formatPKR } from "@/lib/formatters";
import { CustomerItem } from "../types/customers.types";
import { ChevronRight } from "lucide-react";

interface CustomersTableProps {
  customers: CustomerItem[];
  isLoading?: boolean;
  onSelectCustomer: (customer: CustomerItem) => void;
  page?: number;
  pageSize?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

export function CustomersTable({
  customers,
  isLoading = false,
  onSelectCustomer,
  page = 1,
  pageSize = 10,
  totalRecords = 0,
  onPageChange,
  onPageSizeChange,
  className,
}: CustomersTableProps) {
  const columns: ColumnDef<CustomerItem>[] = [
    {
      id: "customer",
      header: "Customer",
      align: "left",
      cell: (item) => (
        <div className="flex flex-col gap-0.5 min-w-0 pr-2">
          <span className="font-sans font-medium text-sm text-heading leading-tight truncate">
            {item.name}
          </span>
          <div className="flex items-center gap-1.5 font-sans text-xs text-body leading-tight">
            <span>{item.phone}</span>
            {item.tag && (
              <>
                <span className="text-muted">·</span>
                <span className="truncate">{item.tag}</span>
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "tier",
      header: "Tier",
      align: "center",
      cell: (item) => {
        if (item.tier === "Gold") {
          return (
            <Badge
              variant="gold"
              size="sm"
              className="bg-accent/15 text-accent border border-accent/40 font-medium"
            >
              Gold
            </Badge>
          );
        }
        if (item.tier === "Silver") {
          return (
            <span className="font-sans text-sm text-heading font-normal">
              Silver
            </span>
          );
        }
        return (
          <span className="font-sans text-sm text-body font-normal">
            {item.tier}
          </span>
        );
      },
    },
    {
      id: "lifetimeSpend",
      header: "Lifetime spend",
      align: "center",
      cell: (item) => (
        <span className="font-sans text-sm text-heading font-normal whitespace-nowrap">
          {formatPKR(item.lifetimeSpend)}
        </span>
      ),
    },
    {
      id: "points",
      header: "Points",
      align: "center",
      cell: (item) => (
        <span className="font-sans text-sm text-heading font-normal">
          {item.points.toLocaleString()}
        </span>
      ),
    },
    {
      id: "khata",
      header: "Khata",
      align: "center",
      cell: (item) => {
        if (item.khataBalance > 0) {
          return (
            <span className="font-sans text-sm text-status-error font-medium whitespace-nowrap">
              {formatPKR(item.khataBalance)}
            </span>
          );
        }
        return <span className="font-sans text-sm text-heading/70">-</span>;
      },
    },
    {
      id: "lastVisit",
      header: "Last visit",
      align: "center",
      cell: (item) => (
        <span className="font-sans text-sm text-heading font-normal whitespace-nowrap">
          {item.lastVisit}
        </span>
      ),
    },
    {
      id: "messaging",
      header: "Messaging",
      align: "center",
      cell: (item) => {
        const isOptedOut = item.messaging === "Opted out";
        return (
          <span
            className={
              isOptedOut
                ? "font-sans text-xs text-muted font-normal tracking-wide"
                : "font-sans text-xs text-body font-normal tracking-wide"
            }
          >
            {item.messaging}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      align: "right",
      cell: () => (
        <div className="flex items-center justify-end">
          <ChevronRight className="size-4 text-muted group-hover:text-heading group-hover:translate-x-0.5 transition-all" />
        </div>
      ),
    },
  ];

  return (
    <div className={className}>
      <DataTable
        data={customers}
        columns={columns}
        isLoading={isLoading}
        emptyTitle="No customers found"
        emptyDescription="No customer profiles match your current search or filters."
        onRowClick={(row) => onSelectCustomer(row)}
        pagination={
          totalRecords > 0
            ? {
                currentPage: page,
                totalPages: Math.max(1, Math.ceil(totalRecords / pageSize)),
                totalItems: totalRecords,
                pageSize,
                onPageChange: onPageChange || (() => {}),
                onPageSizeChange,
                itemLabel: "customers",
              }
            : undefined
        }
      />
    </div>
  );
}
