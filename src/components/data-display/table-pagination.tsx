"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/select";

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
  className?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20],
  itemLabel = "records",
  className,
}: TablePaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate pagination pages with smart ellipsis
  const visiblePages = React.useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  }, [currentPage, totalPages]);

  if (totalItems === 0) return null;

  return (
    <div
      className={cn(
        "w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 sm:px-6 bg-theme/80 border-t border-default/40 select-none text-xs sm:text-sm font-sans",
        className
      )}
      aria-label="Table pagination navigation"
    >
      {/* Left: Summary Count & Page Size Selector */}
      <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2.5 sm:gap-3 text-body flex-wrap">
        <span>
          Showing <span className="font-medium text-heading">{startItem}</span>
          –<span className="font-medium text-heading">{endItem}</span> of{" "}
          <span className="font-medium text-heading">{totalItems}</span>{" "}
          {itemLabel}
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-default/60">
            <span className="text-xs text-muted">Rows:</span>
            <Select
              options={pageSizeOptions.map((opt) => ({
                label: String(opt),
                value: String(opt),
              }))}
              value={String(pageSize)}
              onChange={(val) => onPageSizeChange(Number(val))}
              sizeVariant="sm"
              aria-label="Select rows per page"
            />
          </div>
        )}
      </div>

      {/* Right: Previous / Number Pills / Next Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="size-8 rounded-full border border-default bg-card text-heading hover:bg-subtle/50 flex items-center justify-center transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="size-4 shrink-0" aria-hidden="true" />
        </button>

        {/* Page Number Pills */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, idx) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="size-8 flex items-center justify-center text-xs text-muted font-sans"
                >
                  …
                </span>
              );
            }

            const pageNum = Number(page);
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "size-8 rounded-full flex items-center justify-center text-xs font-sans transition-all cursor-pointer",
                  isActive
                    ? "bg-primary text-dark-primary font-medium shadow-xs"
                    : "text-body hover:text-heading hover:bg-subtle/40"
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="size-8 rounded-full border border-default bg-card text-heading hover:bg-subtle/50 flex items-center justify-center transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          aria-label="Go to next page"
        >
          <ChevronRight className="size-4 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
