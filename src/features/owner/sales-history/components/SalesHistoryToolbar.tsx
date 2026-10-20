"use client";

import {
  SalesToolbar,
  SalesToolbarProps,
} from "@/components/common/SalesToolbar";
import { PaymentMethod } from "../types/sales-history.types";
import { PAYMENT_METHOD_FILTER_OPTIONS } from "../constants/sales-history-mock";

export interface SalesHistoryToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  className?: string;
}

/**
 * Re-export wrapper for Store Owner SalesHistoryToolbar pointing to unified SalesToolbar.
 */
export function SalesHistoryToolbar({
  searchQuery,
  onSearchChange,
  selectedMethod,
  onMethodChange,
  className,
}: SalesHistoryToolbarProps) {
  return (
    <SalesToolbar
      search={searchQuery}
      onSearchChange={onSearchChange}
      selectedMethod={selectedMethod}
      onMethodChange={(val) => onMethodChange(val as PaymentMethod)}
      options={PAYMENT_METHOD_FILTER_OPTIONS}
      className={className}
    />
  );
}
