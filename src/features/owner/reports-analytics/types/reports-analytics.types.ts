export type ReportTab = "sales" | "inventory" | "finance" | "customers";

export type DatePreset = "today" | "last7days" | "thismonth" | "custom";

export interface DateRangeFilter {
  preset: DatePreset;
  startDate: string;
  endDate: string;
}

// ----------------------------------------------------
// Screen 1: Sales & Revenue Tab Types
// ----------------------------------------------------
export interface SalesReportSummary {
  grossSales: number;
  discountsAndPoints: number;
  netSales: number;
  cogs: number;
  grossProfit: number;
  grossProfitMargin: number; // e.g. 39
  ordersCount: number;
  aov: number;
}

export interface DailySalesRow {
  id: string;
  date: string;
  orders: number;
  netSales: number;
  grossProfit: number;
}

export interface PaymentMethodRow {
  id: string;
  method: string;
  amount: number;
  share: number; // percentage e.g. 25, 49
}

export interface CashierSalesRow {
  id: string;
  cashier: string;
  orders: number;
  discounts: number;
  netSales: number;
  aov: number;
}

export interface BestSellingVariantRow {
  id: string;
  variant: string;
  sku: string;
  qty: number;
  revenue: number;
  margin: number; // percentage e.g. 45
}

export interface ReportTransactionRow {
  id: string;
  receiptNo: string;
  time: string;
  cashier: string;
  customer: string;
  total: number;
}

// ----------------------------------------------------
// Screen 2: Inventory & Stock Valuation Tab Types
// ----------------------------------------------------
export interface InventoryReportSummary {
  unitsOnHand: number;
  stockAtCost: number;
  stockAtRetail: number;
  lowStockCount: number;
  deadStockCount: number; // No sale in 90+ days
}

export interface StockValuationRow {
  id: string;
  product: string;
  sku: string;
  onHand: number;
  unitCost: number;
  value: number;
}

export interface LowStockRow {
  id: string;
  variant: string;
  onHand: number;
  reorderAt: number;
}

export interface DeadStockRow {
  id: string;
  product: string;
  unitCost: number;
  value: number;
}

export interface StockMovementRow {
  id: string;
  time: string;
  type: "Purchase" | "Sale" | "Adjustment" | "Return";
  product: string;
  quantity: number;
  reason: string;
}

// ----------------------------------------------------
// Screen 3: Finance & P&L Tab Types
// ----------------------------------------------------
export interface FinanceReportSummary {
  netSales: number;
  grossProfit: number;
  operatingExpenses: number;
  estOperatingProfit: number;
  customersOweYou: number;
  youOweSuppliers: number;
}

export interface ExpenseCategoryRow {
  id: string;
  category: string;
  recorded: number;
  paid: number;
}

export interface CashDrawerMovementRow {
  id: string;
  time: string;
  type: "cash sale" | "khata collection" | "cash refund" | "cash expense" | "opening cash";
  reference: string;
  amount: number; // positive or negative
}

export interface ReceivablesAgingRow {
  id: string;
  customer: string;
  balance: number;
  current: number;
  overdue1to30: number;
  overdue31to60: number;
}

export interface SupplierPayableRow {
  id: string;
  supplier: string;
  balance: number;
}

// ----------------------------------------------------
// Screen 4: Customer & Staff Performance Tab Types
// ----------------------------------------------------
export interface CustomerReportSummary {
  customersWhoBought: number;
  newProfiles: number;
  repeatRate: number; // percentage e.g. 100
  pointsIssued: number;
  pointsRedeemed: number;
  referralConversion: string; // e.g. "1/2"
  wishlistToPurchaseRate: number; // percentage e.g. 0
}

export interface TopCustomerRow {
  id: string;
  customer: string;
  tier: "Gold" | "Silver" | "Bronze" | "Regular";
  lifetimeSpend: number;
  points: number;
  lastVisit: string;
}

export interface CouponUsageRow {
  id: string;
  code: string;
  uses: number;
  totalDiscount: number;
}

export interface CouponRedemptionRow {
  id: string;
  customer: string;
  purchase: string;
  status: string;
  boughtAfter: string;
}

export interface StaffPerformanceRow {
  id: string;
  staffName: string;
  counter: string;
  shiftCount: number;
  totalOrders: number;
  totalSales: number;
  returnRate: string;
  commissionEarned: number;
}
