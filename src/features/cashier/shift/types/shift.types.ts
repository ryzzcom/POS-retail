export type ShiftStatus = "open" | "closed";

export interface ShiftSummary {
  status: ShiftStatus;
  openedAt: string;
  openedBy: string;
  startingFloatPKR: number;
  netSalesPKR: number;
  receiptsCount: number;
  cashCollectedPKR: number;
  cardDigitalCollectedPKR: number;
  cashInTotalPKR: number;
  cashOutTotalPKR: number;
  expectedCashInDrawerPKR: number;
}

export interface ShiftTransaction {
  id: string;
  time: string;
  customerName: string;
  amountPKR: number;
  paymentMethod: string;
  itemsCount: number;
}

export type CashDrawerAdjustmentType = "cash_in" | "cash_out";

export interface CashDrawerEntry {
  id: string;
  type: CashDrawerAdjustmentType;
  amountPKR: number;
  reason: string;
  notes?: string;
  createdAt: string;
}

export interface CashDrawerFormValues {
  type: CashDrawerAdjustmentType;
  amount: number;
  reason: string;
  notes?: string;
}

export interface CloseShiftFormValues {
  actualCash: number;
  notes?: string;
}

export interface QuickCustomerFormValues {
  fullName: string;
  phoneNumber: string;
  email?: string;
  notes?: string;
}
