"use client";

import * as React from "react";
import { CouponItem } from "../types/loyalty-referrals.types";
import { DataTable, ColumnDef } from "@/components/data-display/data-table";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/formatters";
import { Plus } from "lucide-react";

interface CouponsTabProps {
  coupons: CouponItem[];
  onNewCoupon: () => void;
  onEditCoupon: (coupon: CouponItem) => void;
}

export function CouponsTab({
  coupons,
  onNewCoupon,
  onEditCoupon,
}: CouponsTabProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Filtered coupons
  const filteredCoupons = React.useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch =
        searchQuery === "" ||
        coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "live" && coupon.status === "live") ||
        (statusFilter === "expired" && coupon.status === "expired");

      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchQuery, statusFilter]);

  // Reset to page 1 on filter/search change
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  // Paginated records
  const paginatedCoupons = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCoupons.slice(start, start + pageSize);
  }, [filteredCoupons, page, pageSize]);

  // Table Columns Definition matching Figma Node 3451:43511
  const columns: ColumnDef<CouponItem>[] = [
    {
      id: "code",
      header: "Code",
      accessorKey: "code",
      cell: (item: CouponItem) => (
        <span className="font-mono font-semibold text-xs sm:text-sm text-heading tracking-wide uppercase">
          {item.code}
        </span>
      ),
    },
    {
      id: "title",
      header: "Offer",
      accessorKey: "title",
      cell: (item: CouponItem) => (
        <div className="flex flex-col min-w-0 pr-4">
          <span className="font-heading font-medium text-xs sm:text-sm text-heading">
            {item.title}
          </span>
          <span className="font-sans text-[11px] text-body mt-0.5 leading-snug">
            {item.description}
          </span>
        </div>
      ),
    },
    {
      id: "starts",
      header: "Valid",
      accessorKey: "starts",
      cell: (item: CouponItem) => (
        <span className="font-sans text-xs text-body whitespace-nowrap">
          {item.starts}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (item: CouponItem) => (
        <Badge
          variant={item.status === "live" ? "success" : "neutral"}
          size="sm"
          className="capitalize"
        >
          {item.status}
        </Badge>
      ),
    },
    {
      id: "usedCount",
      header: "Used",
      accessorKey: "usedCount",
      cell: (item: CouponItem) => (
        <span className="font-sans text-xs text-heading">
          {item.usedCount}
        </span>
      ),
    },
    {
      id: "discountGiven",
      header: "Discount given",
      accessorKey: "discountGiven",
      cell: (item: CouponItem) => (
        <span className="font-heading font-medium text-xs sm:text-sm text-heading whitespace-nowrap">
          {formatPKR(item.discountGiven)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      className: "text-right",
      cell: (item: CouponItem) => (
        <button
          type="button"
          onClick={() => onEditCoupon(item)}
          className="font-sans font-medium text-xs text-primary hover:underline px-2 py-1 cursor-pointer"
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Toolbar: Search, Status Filter & New Coupon CTA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          <div className="w-full sm:w-[320px]">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search code or offer..."
              className="h-10 bg-card"
            />
          </div>

          <div className="w-full sm:w-[160px]">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              sizeVariant="pill"
              options={[
                { value: "all", label: "All coupons" },
                { value: "live", label: "Live coupons" },
                { value: "expired", label: "Expired" },
              ]}
            />
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={onNewCoupon}
          leftIcon={<Plus className="size-4" />}
          className="h-10 px-5 rounded-full text-xs font-medium shrink-0 shadow-xs"
        >
          New Coupon
        </Button>
      </div>

      {/* Coupons Data Table */}
      <div className="rounded-[20px] border border-default/60 bg-card overflow-hidden shadow-xs">
        <DataTable
          columns={columns}
          data={paginatedCoupons}
          keyExtractor={(item) => item.id}
          pagination={{
            currentPage: page,
            pageSize: pageSize,
            totalItems: filteredCoupons.length,
            totalPages: Math.max(1, Math.ceil(filteredCoupons.length / pageSize)),
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          emptyTitle="No coupons found"
          emptyDescription="No promotional coupons found matching your criteria."
        />
      </div>
    </div>
  );
}
