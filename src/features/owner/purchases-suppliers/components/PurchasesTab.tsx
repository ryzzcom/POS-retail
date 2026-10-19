"use client";

import * as React from "react";
import { PurchaseItem, PurchaseStatus } from "../types/purchases-suppliers.types";
import { DataTable, ColumnDef } from "@/components/data-display/data-table";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { SegmentedFilter, SegmentedFilterOption } from "@/components/ui/segmented-filter";
import { formatPKR } from "@/lib/formatters";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PurchasesTabProps {
  purchases: PurchaseItem[];
  onSelectPurchase: (purchase: PurchaseItem) => void;
}

const STATUS_FILTERS: SegmentedFilterOption[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "Draft" },
  { label: "Ordered", value: "Ordered" },
  { label: "Partial", value: "Partial" },
  { label: "Received", value: "Received" },
  { label: "Cancelled", value: "Cancelled" },
];

export function PurchasesTab({
  purchases,
  onSelectPurchase,
}: PurchasesTabProps) {
  const [filter, setFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  const filteredPurchases = React.useMemo(() => {
    return purchases.filter((item) => {
      if (filter !== "all" && item.status !== filter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesPo = item.poNumber.toLowerCase().includes(q);
        const matchesSupplier = item.supplierName.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q) || false;
        if (!matchesPo && !matchesSupplier && !matchesNotes) {
          return false;
        }
      }
      return true;
    });
  }, [purchases, filter, searchQuery]);

  const paginatedPurchases = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPurchases.slice(start, start + pageSize);
  }, [filteredPurchases, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredPurchases.length / pageSize) || 1;

  const columns: ColumnDef<PurchaseItem>[] = [
    {
      id: "purchase",
      header: "Purchase",
      cell: (item) => (
        <div className="flex flex-col gap-0.5 min-w-[130px]">
          <span className="font-sans font-medium text-sm text-heading leading-snug">
            {item.poNumber}
          </span>
          <span className="font-sans text-xs text-muted leading-tight">
            {item.orderDate}
          </span>
        </div>
      ),
    },
    {
      id: "supplier",
      header: "Supplier",
      cell: (item) => (
        <span className="font-sans text-sm font-medium text-heading">
          {item.supplierName}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      align: "center",
      cell: (item) => {
        const isReceived = item.status === "Received";
        const isPartial = item.status === "Partial";
        const isCancelled = item.status === "Cancelled";

        return (
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
            {item.status}
          </Badge>
        );
      },
    },
    {
      id: "received",
      header: "Received",
      align: "center",
      cell: (item) => (
        <span className="font-sans text-sm font-medium text-heading">
          {item.receivedItems}
        </span>
      ),
    },
    {
      id: "due",
      header: "Due",
      cell: (item) => (
        <span className="font-sans text-sm text-body whitespace-nowrap">
          {item.dueDate}
        </span>
      ),
    },
    {
      id: "total",
      header: "Total",
      align: "right",
      cell: (item) => (
        <span className="font-sans text-sm font-semibold text-heading whitespace-nowrap">
          {formatPKR(item.totalAmount)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      align: "right",
      cell: (item) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectPurchase(item)}
          className="h-8 px-2.5 text-xs text-body hover:text-heading gap-1 font-medium"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* 1. Filter Pills Row matching Figma Node 3525:8445 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SegmentedFilter
          options={STATUS_FILTERS}
          value={filter}
          onChange={(val) => {
            setFilter(val);
            setCurrentPage(1);
          }}
          sizeVariant="sm"
          aria-label="Filter purchase orders by status"
        />

        <div className="w-full sm:max-w-xs">
          <SearchInput
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search PO #, supplier, or notes..."
          />
        </div>
      </div>

      {/* 2. White Card DataTable Container */}
      <div className="w-full bg-card rounded-2xl border border-default/50 overflow-hidden shadow-xs">
        <DataTable
          data={paginatedPurchases}
          columns={columns}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => onSelectPurchase(item)}
          emptyTitle="No purchases found"
          emptyDescription="Create your first purchase order or goods receipt note to track inventory restocking."
          pagination={{
            currentPage,
            totalPages,
            pageSize,
            totalItems: filteredPurchases.length,
            onPageChange: (p) => setCurrentPage(p),
          }}
        />
      </div>
    </div>
  );
}
