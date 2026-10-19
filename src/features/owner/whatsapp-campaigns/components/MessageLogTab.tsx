"use client";

import * as React from "react";
import { MessageLogItem, MessageLogFilter } from "../types/whatsapp-campaigns.types";
import { SegmentedFilter, SegmentedFilterOption } from "@/components/ui/segmented-filter";
import { SearchInput } from "@/components/ui/search-input";
import { DataTable, ColumnDef } from "@/components/data-display/data-table";
import { Badge } from "@/components/ui/badge";
import { RotateCw, CheckCircle2 } from "lucide-react";

interface MessageLogTabProps {
  logs: MessageLogItem[];
  onRetryMessage: (logId: string) => void;
  onSelectMessage?: (log: MessageLogItem) => void;
}

const FILTER_OPTIONS: SegmentedFilterOption[] = [
  { label: "All", value: "all" },
  { label: "Sent", value: "sent" },
  { label: "Delivered", value: "delivered" },
  { label: "Failed", value: "failed" },
];

export function MessageLogTab({
  logs,
  onRetryMessage,
  onSelectMessage,
}: MessageLogTabProps) {
  const [filter, setFilter] = React.useState<MessageLogFilter>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;
  const [retryingIds, setRetryingIds] = React.useState<Set<string>>(new Set());

  // Filtered logs
  const filteredLogs = React.useMemo(() => {
    return logs.filter((item) => {
      // Status filter
      if (filter !== "all" && item.status !== filter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.customerName.toLowerCase().includes(q);
        const matchesPhone = item.customerPhone.toLowerCase().includes(q);
        const matchesReceipt = item.receiptRef.toLowerCase().includes(q);
        const matchesMessage = item.message.toLowerCase().includes(q);
        const matchesTemplate = item.templateName.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesReceipt && !matchesMessage && !matchesTemplate) {
          return false;
        }
      }
      return true;
    });
  }, [logs, filter, searchQuery]);

  // Paginated data
  const paginatedLogs = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Total pages
  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;

  const handleRetry = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setRetryingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      onRetryMessage(id);
      setRetryingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 600);
  };

  const columns: ColumnDef<MessageLogItem>[] = [
    {
      id: "customer",
      header: "Customer",
      cell: (item) => (
        <div className="flex flex-col gap-0.5 min-w-[140px]">
          <span className="font-sans font-medium text-sm text-heading leading-snug">
            {item.customerName}
          </span>
          <span className="font-sans text-xs text-muted leading-tight">
            {item.receiptRef}
          </span>
        </div>
      ),
    },
    {
      id: "template",
      header: "Template",
      cell: (item) => (
        <span className="font-sans text-sm text-body whitespace-nowrap">
          {item.templateName}
        </span>
      ),
    },
    {
      id: "message",
      header: "Message",
      cell: (item) => (
        <div
          onClick={() => onSelectMessage?.(item)}
          className="font-sans text-sm text-body leading-relaxed max-w-xl line-clamp-2 hover:text-heading cursor-pointer transition-colors"
          title={item.message}
        >
          {item.message}
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      align: "center",
      cell: (item) => {
        const isFailed = item.status === "failed";
        const isDelivered = item.status === "delivered" || item.status === "read";

        return (
          <Badge
            variant={isFailed ? "failed" : isDelivered ? "delivered" : "neutral"}
            size="default"
            className="capitalize text-xs font-medium"
          >
            {item.status}
          </Badge>
        );
      },
    },
    {
      id: "updated",
      header: "Updated",
      cell: (item) => (
        <span className="font-sans text-sm text-body whitespace-nowrap">
          {item.updatedAt}
        </span>
      ),
    },
    {
      id: "action",
      header: "",
      align: "right",
      cell: (item) => {
        if (item.status === "failed") {
          const isRetrying = retryingIds.has(item.id);
          return (
            <button
              type="button"
              onClick={(e) => handleRetry(e, item.id)}
              disabled={isRetrying}
              className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-heading underline hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
            >
              {isRetrying ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-primary" />
                  <span>Retrying...</span>
                </>
              ) : (
                <span>Retry</span>
              )}
            </button>
          );
        }
        return (
          <span className="inline-flex items-center text-status-success text-xs font-sans gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        );
      },
    },
  ];

  return (
    <div className="w-full bg-card rounded-2xl border border-default/50 overflow-hidden shadow-xs select-none">
      {/* 1. Header Bar matching Figma Node 3457:50829 */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-default/40">
        <h2 className="font-heading font-semibold text-lg text-heading tracking-tight">
          Message Logs
        </h2>

        {/* Right Pill Filter */}
        <SegmentedFilter
          options={FILTER_OPTIONS}
          value={filter}
          onChange={(val) => {
            setFilter(val as MessageLogFilter);
            setCurrentPage(1);
          }}
          sizeVariant="sm"
          aria-label="Filter message logs by delivery status"
        />
      </div>

      {/* 2. Sub-Toolbar with Search */}
      <div className="px-4 py-3 bg-subtle/20 border-b border-default/30 flex items-center gap-3">
        <div className="w-full sm:max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search customer, phone, receipt # or message text..."
          />
        </div>
      </div>

      {/* 3. DataTable */}
      <DataTable
        data={paginatedLogs}
        columns={columns}
        keyExtractor={(item) => item.id}
        emptyTitle="No message logs found"
        emptyDescription={
          searchQuery
            ? "No logs match your search query."
            : "No WhatsApp messages found for the selected filter."
        }
        pagination={{
          currentPage,
          totalPages,
          pageSize,
          totalItems: filteredLogs.length,
          onPageChange: (p) => setCurrentPage(p),
        }}
      />
    </div>
  );
}
