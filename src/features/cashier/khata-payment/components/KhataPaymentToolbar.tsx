"use client";

import React from "react";
import { SearchInput } from "@/components/ui/search-input";
import { STATUS_FILTER_OPTIONS } from "../constants";
import { CashierKhataStatusFilter } from "../types";

export interface KhataPaymentToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedStatus: CashierKhataStatusFilter;
  onStatusChange: (status: CashierKhataStatusFilter) => void;
}

export function KhataPaymentToolbar({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}: KhataPaymentToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full select-none">
      {/* Left: Search Bar */}
      <div className="w-full sm:max-w-[380px] lg:max-w-[440px]">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="customer or phone"
          className="w-full bg-theme"
        />
      </div>

      {/* Right: Status Filter Pills */}
      <div className="bg-theme border border-default p-1 rounded-full flex items-center gap-1 overflow-x-auto custom-scrollbar shadow-xs shrink-0 max-w-full">
        {STATUS_FILTER_OPTIONS.map((opt) => {
          const isActive = selectedStatus === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onStatusChange(opt.value)}
              className={`px-3.5 py-1.5 rounded-full font-sans text-xs sm:text-sm transition-all whitespace-nowrap ${
                isActive
                  ? "bg-primary text-dark-primary font-medium shadow-xs"
                  : "text-body hover:text-heading hover:bg-subtle/50 font-normal"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
