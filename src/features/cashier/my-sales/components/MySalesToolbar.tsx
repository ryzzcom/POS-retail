"use client";

import {
  SalesToolbar,
  SalesToolbarProps,
} from "@/components/common/SalesToolbar";
import { CashierPaymentMethod } from "../types";
import { PAYMENT_FILTER_OPTIONS } from "../constants";

export interface MySalesToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedMethod: CashierPaymentMethod;
  onMethodChange: (method: CashierPaymentMethod) => void;
  className?: string;
}

/**
 * Re-export wrapper for Cashier MySalesToolbar pointing to unified SalesToolbar.
 */
export function MySalesToolbar({
  search,
  onSearchChange,
  selectedMethod,
  onMethodChange,
  className,
}: MySalesToolbarProps) {
  return (
    <SalesToolbar
      search={search}
      onSearchChange={onSearchChange}
      selectedMethod={selectedMethod}
      onMethodChange={(method) => onMethodChange(method as CashierPaymentMethod)}
      options={PAYMENT_FILTER_OPTIONS}
      className={className}
    />
  );
}
