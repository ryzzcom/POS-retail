"use client";

import * as React from "react";
import { LedgerItem } from "../types/loyalty-referrals.types";
import { DataTable, ColumnDef } from "@/components/data-display/data-table";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, Gift } from "lucide-react";

interface ReferralsLedgerTabProps {
  ledger: LedgerItem[];
}

export function ReferralsLedgerTab({ ledger }: ReferralsLedgerTabProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Filtered ledger records
  const filteredLedger = React.useMemo(() => {
    return ledger.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.customerPhone && item.customerPhone.includes(searchQuery)) ||
        (item.refereeName && item.refereeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.receiptNo && item.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType =
        typeFilter === "all" || item.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [ledger, searchQuery, typeFilter]);

  // Reset page when filter changes
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, typeFilter]);

  // Paginated records
  const paginatedLedger = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLedger.slice(start, start + pageSize);
  }, [filteredLedger, page, pageSize]);

  // Table Columns
  const columns: ColumnDef<LedgerItem>[] = [
    {
      id: "customerName",
      header: "Customer",
      accessorKey: "customerName",
      cell: (item: LedgerItem) => (
        <div className="flex flex-col min-w-0">
          <span className="font-heading font-medium text-xs sm:text-sm text-heading">
            {item.customerName}
          </span>
          {item.customerPhone && (
            <span className="font-sans text-[11px] text-muted mt-0.5">
              {item.customerPhone}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "type",
      header: "Type",
      accessorKey: "type",
      cell: (item: LedgerItem) => {
        switch (item.type) {
          case "earn":
            return (
              <Badge variant="success" size="sm" className="capitalize">
                Earned
              </Badge>
            );
          case "redeem":
            return (
              <Badge variant="neutral" size="sm" className="capitalize">
                Redeemed
              </Badge>
            );
          case "referral":
            return (
              <Badge variant="gold" size="sm" className="capitalize flex items-center gap-1">
                <Gift className="size-3 text-accent" />
                <span>Referral</span>
              </Badge>
            );
          case "adjustment":
            return (
              <Badge variant="default" size="sm" className="capitalize">
                Adjustment
              </Badge>
            );
          default:
            return <Badge size="sm">{item.type}</Badge>;
        }
      },
    },
    {
      id: "details",
      header: "Reference / Details",
      cell: (item: LedgerItem) => (
        <div className="flex flex-col min-w-0">
          <span className="font-sans text-xs text-heading">
            {item.refereeName
              ? `Referred friend: ${item.refereeName}`
              : item.receiptNo
              ? `Receipt ${item.receiptNo}`
              : item.subtitle || "Standard adjustment"}
          </span>
          {item.subtitle && !item.refereeName && (
            <span className="font-sans text-[11px] text-muted mt-0.5 truncate">
              {item.subtitle}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "date",
      header: "Date",
      accessorKey: "date",
      cell: (item: LedgerItem) => (
        <span className="font-sans text-xs text-body whitespace-nowrap">
          {item.date}
        </span>
      ),
    },
    {
      id: "points",
      header: "Points Delta",
      accessorKey: "points",
      cell: (item: LedgerItem) => {
        const isPositive = item.points > 0;
        return (
          <div className="flex items-center gap-1.5">
            {isPositive ? (
              <ArrowUpRight className="size-3.5 text-status-success shrink-0" />
            ) : (
              <ArrowDownLeft className="size-3.5 text-status-error shrink-0" />
            )}
            <span
              className={cn(
                "font-semibold text-xs sm:text-sm whitespace-nowrap",
                isPositive ? "text-status-success" : "text-status-error"
              )}
            >
              {isPositive ? `+${item.points}` : item.points} pts
            </span>
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (item: LedgerItem) => (
        <Badge
          variant={item.status === "completed" ? "success" : "failed"}
          size="sm"
          className="capitalize"
        >
          {item.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Toolbar: Search & Type Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          <div className="w-full sm:w-[320px]">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search customer, phone, referee..."
              sizeVariant="sm"
            />
          </div>

          <div className="w-full sm:w-[180px]">
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              sizeVariant="pill"
              options={[
                { value: "all", label: "All transactions" },
                { value: "earn", label: "Points earned" },
                { value: "redeem", label: "Points redeemed" },
                { value: "referral", label: "Referral bonuses" },
                { value: "adjustment", label: "Manual adjustments" },
              ]}
            />
          </div>
        </div>

        <div className="text-xs font-sans text-muted shrink-0 text-right">
          Total: <span className="font-medium text-heading">{filteredLedger.length}</span> records
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-[20px] border border-default/60 bg-card overflow-hidden shadow-xs">
        <DataTable
          columns={columns}
          data={paginatedLedger}
          keyExtractor={(item) => item.id}
          pagination={{
            currentPage: page,
            pageSize: pageSize,
            totalItems: filteredLedger.length,
            totalPages: Math.max(1, Math.ceil(filteredLedger.length / pageSize)),
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          emptyTitle="No records found"
          emptyDescription="No point transactions or referral records match your filters."
        />
      </div>
    </div>
  );
}
