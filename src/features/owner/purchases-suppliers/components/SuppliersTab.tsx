"use client";

import * as React from "react";
import { SupplierItem } from "../types/purchases-suppliers.types";
import { DataTable, ColumnDef } from "@/components/data-display/data-table";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { SegmentedFilter, SegmentedFilterOption } from "@/components/ui/segmented-filter";
import { formatPKR } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { BookOpen, CreditCard } from "lucide-react";

interface SuppliersTabProps {
  suppliers: SupplierItem[];
  onSelectSupplier: (supplier: SupplierItem) => void;
  onPaySupplier: (supplier: SupplierItem) => void;
}

const CATEGORY_FILTERS: SegmentedFilterOption[] = [
  { label: "All", value: "all" },
  { label: "Fabric Mill", value: "Fabric Mill" },
  { label: "Embroidery", value: "Embroidery" },
  { label: "Stitching", value: "Stitching" },
  { label: "Packaging", value: "Packaging" },
  { label: "Accessories", value: "Accessories" },
];

export function SuppliersTab({
  suppliers,
  onSelectSupplier,
  onPaySupplier,
}: SuppliersTabProps) {
  const [filter, setFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  const filteredSuppliers = React.useMemo(() => {
    return suppliers.filter((item) => {
      if (filter !== "all" && item.category !== filter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesContact = item.contactPerson.toLowerCase().includes(q);
        const matchesPhone = item.phone.toLowerCase().includes(q);
        const matchesCity = item.city.toLowerCase().includes(q);
        if (!matchesName && !matchesContact && !matchesPhone && !matchesCity) {
          return false;
        }
      }
      return true;
    });
  }, [suppliers, filter, searchQuery]);

  const paginatedSuppliers = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSuppliers.slice(start, start + pageSize);
  }, [filteredSuppliers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredSuppliers.length / pageSize) || 1;

  const columns: ColumnDef<SupplierItem>[] = [
    {
      id: "supplier",
      header: "Supplier",
      cell: (item) => (
        <div className="flex flex-col gap-0.5 min-w-[200px]">
          <span className="font-sans font-medium text-sm text-heading leading-snug">
            {item.name}
          </span>
          <span className="font-sans text-xs text-muted leading-tight">
            {item.description}
          </span>
        </div>
      ),
    },
    {
      id: "contact",
      header: "Contact",
      cell: (item) => (
        <div className="flex flex-col gap-0.5 min-w-[130px]">
          <span className="font-sans font-medium text-sm text-heading leading-snug">
            {item.contactPerson}
          </span>
          <span className="font-sans text-xs text-muted leading-tight">
            {item.phone}
          </span>
        </div>
      ),
    },
    {
      id: "openOrders",
      header: "Open orders",
      align: "center",
      cell: (item) => (
        <span className="font-sans text-sm font-medium text-heading">
          {item.openOrdersCount > 0 ? item.openOrdersCount : "—"}
        </span>
      ),
    },
    {
      id: "received",
      header: "Received",
      cell: (item) => (
        <span className="font-sans text-sm text-body whitespace-nowrap">
          {item.lastReceivedDate}
        </span>
      ),
    },
    {
      id: "youOwe",
      header: "You owe",
      align: "right",
      cell: (item) => {
        const hasBalance = item.outstandingBalance > 0;
        return (
          <span
            className={`font-sans text-sm font-semibold whitespace-nowrap ${
              hasBalance ? "text-status-error" : "text-heading"
            }`}
          >
            {formatPKR(item.outstandingBalance)}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      align: "right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          {item.outstandingBalance > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPaySupplier(item);
              }}
              className="h-7 px-2 text-xs text-primary border-primary/30 hover:bg-primary hover:text-dark-primary font-medium gap-1"
            >
              <CreditCard className="w-3 h-3" />
              <span>Pay</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectSupplier(item)}
            className="h-8 px-2.5 text-xs text-body hover:text-heading gap-1 font-medium"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ledger</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* 1. Filter Pills Row matching Figma Node 3525:8563 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SegmentedFilter
          options={CATEGORY_FILTERS}
          value={filter}
          onChange={(val) => {
            setFilter(val);
            setCurrentPage(1);
          }}
          sizeVariant="sm"
          aria-label="Filter suppliers by category"
        />

        <div className="w-full sm:max-w-xs">
          <SearchInput
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search supplier, contact, city..."
          />
        </div>
      </div>

      {/* 2. White Card DataTable Container */}
      <div className="w-full bg-card rounded-2xl border border-default/50 overflow-hidden shadow-xs">
        <DataTable
          data={paginatedSuppliers}
          columns={columns}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => onSelectSupplier(item)}
          emptyTitle="No suppliers found"
          emptyDescription="Add textile mills, master tailors, embroidery houses, or packaging vendors to your directory."
          pagination={{
            currentPage,
            totalPages,
            pageSize,
            totalItems: filteredSuppliers.length,
            onPageChange: (p) => setCurrentPage(p),
          }}
        />
      </div>
    </div>
  );
}
