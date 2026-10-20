"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import { TablePagination, TablePaginationProps } from "./table-pagination";
import { Skeleton } from "@/components/feedback/skeleton";

export type ColumnAlign = "left" | "center" | "right";

export interface ColumnDef<T> {
  id: string;
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T, index: number) => React.ReactNode;
  align?: ColumnAlign;
  width?: string;
  className?: string;
  headerClassName?: string;
}

export type TablePaginationConfig = Omit<TablePaginationProps, "className">;

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor?: (item: T, index: number) => string;
  onRowClick?: (item: T) => void;
  renderExpandedRow?: (item: T, index: number) => React.ReactNode;
  isRowExpanded?: (item: T, index: number) => boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyState?: React.ReactNode;
  isLoading?: boolean;
  skeletonRows?: number;
  pagination?: TablePaginationConfig;
  className?: string;
  roundedTop?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor = (_, index) => index.toString(),
  onRowClick,
  renderExpandedRow,
  isRowExpanded,
  emptyTitle = "No records found",
  emptyDescription = "There are no entries to display matching your criteria.",
  emptyState,
  isLoading = false,
  skeletonRows = 5,
  pagination,
  className,
  roundedTop = true,
}: DataTableProps<T>) {
  const getAlignmentClass = (align?: ColumnAlign) => {
    switch (align) {
      case "center":
        return "text-center justify-center";
      case "right":
        return "text-right justify-end";
      case "left":
      default:
        return "text-left justify-start";
    }
  };

  return (
    <div
      className={cn(
        "w-full bg-theme overflow-hidden select-none flex flex-col",
        roundedTop
          ? "border border-default/40 rounded-[22px] shadow-xs"
          : "border-0 border-t border-default/40 rounded-none shadow-none",
        className
      )}
    >
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[680px] border-collapse text-left">
          {/* Table Header Row (Figma Node 3386:16477) */}
          <thead>
            <tr className="bg-subtle/30 border-b border-default/40">
              {columns.map((col) => (
                <th
                  key={col.id}
                  scope="col"
                  style={{ width: col.width }}
                  className={cn(
                    "px-5 py-4 sm:px-6 font-sans font-medium text-sm text-heading tracking-normal whitespace-nowrap",
                    getAlignmentClass(col.align),
                    col.headerClassName
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center",
                      getAlignmentClass(col.align)
                    )}
                  >
                    {col.header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-default/30">
            {isLoading ? (
              /* Built-in Skeleton Rows (Preserves Column Geometry and Widths) */
              Array.from({ length: skeletonRows }).map((_, rowIdx) => (
                <tr key={`skeleton-row-${rowIdx}`} className="bg-theme">
                  {columns.map((col, colIdx) => (
                    <td
                      key={`skeleton-cell-${rowIdx}-${col.id}`}
                      style={{ width: col.width }}
                      className={cn(
                        "px-5 py-4 sm:py-5 sm:px-6 align-middle",
                        col.className
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center",
                          getAlignmentClass(col.align)
                        )}
                      >
                        {colIdx === 0 ? (
                          <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-3 w-2/3 rounded-sm" />
                          </div>
                        ) : colIdx === columns.length - 2 ? (
                          <Skeleton className="h-7 w-20 rounded-full" />
                        ) : colIdx === columns.length - 1 ? (
                          <Skeleton className="h-4 w-16 rounded-md" />
                        ) : (
                          <Skeleton className="h-4 w-24 rounded-md" />
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  {emptyState || (
                    <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                      <div className="size-12 rounded-full bg-subtle/40 flex items-center justify-center text-muted mb-3">
                        <Inbox className="size-6" />
                      </div>
                      <p className="font-heading font-medium text-base text-heading mb-1">
                        {emptyTitle}
                      </p>
                      <p className="font-sans text-xs sm:text-sm text-body leading-relaxed">
                        {emptyDescription}
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const rowKey = keyExtractor(item, index);
                const isClickable = Boolean(onRowClick);
                const isExpanded = Boolean(isRowExpanded?.(item, index));

                return (
                  <React.Fragment key={rowKey}>
                    <tr
                      onClick={() => onRowClick?.(item)}
                      className={cn(
                        "bg-theme transition-colors",
                        isClickable && "cursor-pointer hover:bg-subtle/20",
                        isExpanded && "bg-subtle/10"
                      )}
                    >
                      {columns.map((col) => {
                        let cellContent: React.ReactNode = null;
                        if (col.cell) {
                          cellContent = col.cell(item, index);
                        } else if (col.accessorKey) {
                          cellContent = String(item[col.accessorKey] ?? "");
                        }

                        return (
                          <td
                            key={col.id}
                            style={{ width: col.width }}
                            className={cn(
                              "px-5 py-4 sm:py-5 sm:px-6 font-sans text-sm text-heading align-middle",
                              col.className
                            )}
                          >
                            <div
                              className={cn(
                                "flex items-center",
                                getAlignmentClass(col.align)
                              )}
                            >
                              {cellContent}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    {renderExpandedRow && isExpanded && (
                      <tr className="bg-subtle/15 border-b border-default/30">
                        <td
                          colSpan={columns.length}
                          className="px-5 py-4 sm:px-6"
                        >
                          {renderExpandedRow(item, index)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Integrated Footer Pagination Bar (or Loading Placeholder) */}
      {isLoading && pagination ? (
        <div className="w-full flex items-center justify-between px-5 py-3.5 sm:px-6 bg-theme/80 border-t border-default/40 select-none">
          <Skeleton className="h-4 w-36 sm:w-48 rounded-md" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>
      ) : (
        pagination && <TablePagination {...pagination} />
      )}
    </div>
  );
}
