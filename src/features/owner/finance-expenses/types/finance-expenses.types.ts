export type ExpenseCategory =
  | "Shop rent"
  | "Utilities"
  | "Salaries"
  | "Petty cash"
  | "Packaging/shopping bags"
  | "Bank/payment processing fees"
  | "Repairs and maintenance"
  | "Staff food & tea"
  | "Marketing"
  | "Other";

export type PaymentStatus = "paid" | "partial" | "unpaid";

export type PaymentSource = "Cash drawer" | "Bank" | "Petty cash" | "Not paid";

export interface ExpenseItem {
  id: string;
  title: string;
  category: ExpenseCategory | string;
  vendor: string;
  date: string;
  paidFrom: PaymentSource | string;
  status: PaymentStatus;
  amount: number;
  paidAmount?: number;
  referenceNo?: string;
  repeatsMonthly?: boolean;
  notes?: string;
}

export interface BillItem {
  id: string;
  vendor: string;
  dueDate: string;
  amount: number;
  category: string;
  status: PaymentStatus;
  expenseId?: string;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  lastMonthAmount: number;
}

export interface FinanceSummary {
  totalExpensesRecorded: number;
  percentVsPreviousMonth: number;
  isIncrease: boolean;
  actuallyPaid: number;
  stillOwed: number;
  paidFromBank: number;
  paidFromCashDrawer: number;
  paidFromPettyCash: number;
  breakdowns: CategoryBreakdown[];
}
