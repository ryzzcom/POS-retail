"use client";

import * as React from "react";
import { CampaignItem } from "../types/whatsapp-campaigns.types";
import { DataTable, ColumnDef } from "@/components/data-display/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { SegmentedFilter, SegmentedFilterOption } from "@/components/ui/segmented-filter";
import { Plus, Tag, Send } from "lucide-react";

interface CampaignsTabProps {
  campaigns: CampaignItem[];
  onOpenNewCampaign: () => void;
  onOpenNewCoupon: () => void;
  onSelectCampaign?: (campaign: CampaignItem) => void;
}

const STATUS_FILTERS: SegmentedFilterOption[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Completed", value: "Completed" },
  { label: "Scheduled", value: "Scheduled" },
];

export function CampaignsTab({
  campaigns,
  onOpenNewCampaign,
  onOpenNewCoupon,
  onSelectCampaign,
}: CampaignsTabProps) {
  const [filter, setFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  const filteredCampaigns = React.useMemo(() => {
    return campaigns.filter((item) => {
      if (filter !== "all" && item.status !== filter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesPurpose = item.purpose.toLowerCase().includes(q);
        const matchesCode = item.couponCode.toLowerCase().includes(q);
        if (!matchesTitle && !matchesPurpose && !matchesCode) {
          return false;
        }
      }
      return true;
    });
  }, [campaigns, filter, searchQuery]);

  const paginatedCampaigns = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCampaigns.slice(start, start + pageSize);
  }, [filteredCampaigns, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredCampaigns.length / pageSize) || 1;

  const columns: ColumnDef<CampaignItem>[] = [
    {
      id: "campaign",
      header: "Campaign & Purpose",
      cell: (item) => (
        <div className="flex flex-col gap-0.5 min-w-[200px]">
          <span className="font-sans font-medium text-sm text-heading leading-snug">
            {item.title}
          </span>
          <span className="font-sans text-xs text-muted leading-tight">
            {item.purpose}
          </span>
        </div>
      ),
    },
    {
      id: "couponCode",
      header: "Coupon Code",
      cell: (item) => (
        <Badge
          variant="outline"
          size="sm"
          className="font-mono text-xs font-semibold tracking-wider text-heading border-default bg-subtle/40 px-2.5 py-1"
        >
          {item.couponCode}
        </Badge>
      ),
    },
    {
      id: "discount",
      header: "Discount",
      cell: (item) => (
        <span className="font-sans text-sm font-medium text-heading whitespace-nowrap">
          {item.discount}
        </span>
      ),
    },
    {
      id: "validity",
      header: "Validity",
      cell: (item) => (
        <span className="font-sans text-sm text-body whitespace-nowrap">
          {item.validity}
        </span>
      ),
    },
    {
      id: "messagesSent",
      header: "Messages Sent",
      align: "center",
      cell: (item) => (
        <span className="font-sans text-sm font-medium text-heading">
          {item.messagesSent.toLocaleString()}
        </span>
      ),
    },
    {
      id: "posRedeemed",
      header: "POS Redeemed",
      align: "center",
      cell: (item) => (
        <span className="font-sans text-sm font-semibold text-status-success">
          {item.posRedeemed.toLocaleString()}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      align: "center",
      cell: (item) => {
        const isActive = item.status === "Active";
        const isCompleted = item.status === "Completed";
        const isScheduled = item.status === "Scheduled";

        return (
          <Badge
            variant={isActive ? "delivered" : isScheduled ? "warning" : "neutral"}
            size="default"
            className="text-xs font-medium"
          >
            {item.status}
          </Badge>
        );
      },
    },
    {
      id: "action",
      header: "",
      align: "right",
      cell: (item) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectCampaign?.(item)}
          className="h-8 px-2.5 text-xs text-body hover:text-heading gap-1 font-medium"
        >
          <Send className="w-3.5 h-3.5 text-body" />
          <span>Broadcast</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full bg-card rounded-2xl border border-default/50 overflow-hidden shadow-xs select-none">
      {/* 1. Header Toolbar matching Figma Node 3468:53547 */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-default/40">
        <div className="flex items-center gap-3">
          <SegmentedFilter
            options={STATUS_FILTERS}
            value={filter}
            onChange={(val) => {
              setFilter(val);
              setCurrentPage(1);
            }}
            sizeVariant="sm"
            aria-label="Filter campaigns by status"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenNewCoupon}
            className="gap-1.5 font-medium"
          >
            <Tag className="w-4 h-4 text-body" />
            <span>+ New Coupon</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenNewCampaign}
            className="gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>New Campaigns</span>
          </Button>
        </div>
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
            placeholder="Search campaigns by name, coupon code or purpose..."
          />
        </div>
      </div>

      {/* 3. DataTable */}
      <DataTable
        data={paginatedCampaigns}
        columns={columns}
        keyExtractor={(item) => item.id}
        emptyTitle="No campaigns found"
        emptyDescription="Create your first WhatsApp promo campaign or coupon to engage retail shoppers."
        pagination={{
          currentPage,
          totalPages,
          pageSize,
          totalItems: filteredCampaigns.length,
          onPageChange: (p) => setCurrentPage(p),
        }}
      />
    </div>
  );
}
