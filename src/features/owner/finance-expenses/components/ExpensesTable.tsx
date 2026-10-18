"use client";

import * as React from "react";
import { ExpenseItem, PaymentStatus } from "../types/finance-expenses.types";
import { DataTable, ColumnDef } from "@/components/data-display/data-table";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { SegmentedFilter } from "@/components/ui/segmented-filter";
import { formatPKR } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface ExpensesTableProps {
  expenses: ExpenseItem[];
  onRecordPayment: (expense: ExpenseItem) => void;
}

export function ExpensesTable({
  expenses,
  onRecordPayment,
}: ExpensesTableProps) {
  const [statusFilter, setStatusFilter] = React.useState<"all" | PaymentStatus>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Filtered expenses
  const filteredExpenses = React.useMemo(() => {
    return expenses.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [expenses, searchQuery, statusFilter]);

  // Reset to page 1 on filter changes
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  // Paginated records
  const paginatedExpenses = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredExpenses.slice(start, start + pageSize);
  }, [filteredExpenses, page, pageSize]);

  // Table Columns Definition matching Figma Node 3454:45151
  const columns: ColumnDef<ExpenseItem>[] = [
    {
      id: "title",
      header: "Expense",
      accessorKey: "title",
      cell: (item: ExpenseItem) => (
        <div className="flex flex-col min-w-0 pr-4">
          <span className="font-heading font-medium text-xs sm:text-sm text-heading truncate">
            {item.title}
          </span>
          <span className="font-sans text-[11px] text-body mt-0.5 leading-snug">
            {item.date} · {item.category} · {item.vendor}
          </span>
        </div>
      ),
    },
    {
      id: "paidFrom",
      header: "Paid from",
      accessorKey: "paidFrom",
      cell: (item: ExpenseItem) => (
        <span className="font-sans text-xs text-heading whitespace-nowrap">
          {item.paidFrom}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (item: ExpenseItem) => {
        switch (item.status) {
          case "paid":
            return (
              <Badge variant="success" size="sm" className="capitalize">
                Paid
              </Badge>
            );
          case "unpaid":
            return (
              <Badge variant="error" size="sm" className="capitalize">
                Unpaid
              </Badge>
            );
          case "partial":
            return (
              <Badge variant="warning" size="sm" className="capitalize">
                Partial
              </Badge>
            );
          default:
            return <Badge size="sm">{item.status}</Badge>;
        }
      },
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
      className: "text-right",
      headerClassName: "text-right",
      cell: (item: ExpenseItem) => (
        <div className="flex items-center justify-end gap-2.5">
          <span className="font-heading font-medium text-xs sm:text-sm text-heading whitespace-nowrap">
            {formatPKR(item.amount)}
          </span>

          {/* Record payment quick link for unpaid expenses (Figma Node 3454:45151) */}
          {item.status !== "paid" && (
            <button
              type="button"
              onClick={() => onRecordPayment(item)}
              className="font-sans text-xs text-primary font-medium underline underline-offset-2 hover:opacity-80 cursor-pointer whitespace-nowrap"
            >
              Record payment
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 w-full flex flex-col gap-4 select-none">
      {/* Header Row: Section Title & Segmented Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <h2 className="font-heading font-semibold text-lg sm:text-xl text-heading">
          Entries
        </h2>

        <div className="flex items-center gap-3">
          <div className="w-full sm:w-[220px]">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search expenses..."
              sizeVariant="sm"
            />
          </div>

          {/* Status Filter Pill Bar (Figma Node 3454:45151) */}
          <SegmentedFilter
            sizeVariant="sm"
            options={[
              { label: "All", value: "all" },
              { label: "Paid", value: "paid" },
              { label: "Partial", value: "partial" },
              { label: "Unpaid", value: "unpaid" },
            ]}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as "all" | PaymentStatus)}
            aria-label="Filter expenses by payment status"
          />
        </div>
      </div>

      {/* Expenses Data Table */}
      <div className="rounded-[20px] border border-default/60 bg-card overflow-hidden shadow-xs">
        <DataTable
          columns={columns}
          data={paginatedExpenses}
          keyExtractor={(item) => item.id}
          pagination={{
            currentPage: page,
            pageSize: pageSize,
            totalItems: filteredExpenses.length,
            totalPages: Math.max(1, Math.ceil(filteredExpenses.length / pageSize)),
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          emptyTitle="No expenses found"
          emptyDescription="There are no expense records matching your current search or filter."
        />
      </div>
    </div>
  );
}
