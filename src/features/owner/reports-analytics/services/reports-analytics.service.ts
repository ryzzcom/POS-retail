import { apiClient } from "@/lib/api-client";
import {
  DatePreset,
  SalesReportSummary,
  DailySalesRow,
  PaymentMethodRow,
  CashierSalesRow,
  BestSellingVariantRow,
  ReportTransactionRow,
  InventoryReportSummary,
  StockValuationRow,
  LowStockRow,
  DeadStockRow,
  StockMovementRow,
  FinanceReportSummary,
  ExpenseCategoryRow,
  CashDrawerMovementRow,
  ReceivablesAgingRow,
  SupplierPayableRow,
  CustomerReportSummary,
  TopCustomerRow,
  CouponUsageRow,
  CouponRedemptionRow,
  StaffPerformanceRow,
} from "../types";

export interface FullSalesReportData {
  summary: SalesReportSummary;
  dailySales: DailySalesRow[];
  paymentMethods: PaymentMethodRow[];
  cashierSales: CashierSalesRow[];
  bestSellingVariants: BestSellingVariantRow[];
  transactions: ReportTransactionRow[];
}

export interface FullInventoryReportData {
  summary: InventoryReportSummary;
  stockValuation: StockValuationRow[];
  lowStock: LowStockRow[];
  deadStock: DeadStockRow[];
  stockMovements: StockMovementRow[];
}

export interface FullFinanceReportData {
  summary: FinanceReportSummary;
  expenseCategories: ExpenseCategoryRow[];
  cashDrawerMovements: CashDrawerMovementRow[];
  receivablesAging: ReceivablesAgingRow[];
  supplierPayables: SupplierPayableRow[];
}

export interface FullCustomerReportData {
  summary: CustomerReportSummary;
  topCustomers: TopCustomerRow[];
  couponUsage: CouponUsageRow[];
  couponRedemptions: CouponRedemptionRow[];
  staffPerformance: StaffPerformanceRow[];
}

function mapPeriod(preset: DatePreset): string {
  if (preset === "today") return "today";
  if (preset === "last7days") return "week";
  if (preset === "thismonth") return "month";
  return "month";
}

export const reportsAnalyticsService = {
  getSalesReport: async (
    preset: DatePreset = "thismonth"
  ): Promise<FullSalesReportData> => {
    const period = mapPeriod(preset);
    const res = await apiClient.get<FullSalesReportData>(`/reports/sales?period=${period}`);
    return {
      summary: res?.summary || {
        grossSales: 0,
        discountsAndPoints: 0,
        netSales: 0,
        cogs: 0,
        grossProfit: 0,
        grossProfitMargin: 0,
        ordersCount: 0,
        aov: 0,
      },
      dailySales: res?.dailySales || [],
      paymentMethods: res?.paymentMethods || [],
      cashierSales: res?.cashierSales || [],
      bestSellingVariants: res?.bestSellingVariants || [],
      transactions: res?.transactions || [],
    };
  },

  getInventoryReport: async (): Promise<FullInventoryReportData> => {
    const res = await apiClient.get<FullInventoryReportData>("/reports/inventory");
    return {
      summary: res?.summary || {
        unitsOnHand: 0,
        stockAtCost: 0,
        stockAtRetail: 0,
        lowStockCount: 0,
        deadStockCount: 0,
      },
      stockValuation: res?.stockValuation || [],
      lowStock: res?.lowStock || [],
      deadStock: res?.deadStock || [],
      stockMovements: res?.stockMovements || [],
    };
  },

  getFinanceReport: async (
    preset: DatePreset = "thismonth"
  ): Promise<FullFinanceReportData> => {
    const period = mapPeriod(preset);
    const res = await apiClient.get<FullFinanceReportData>(`/reports/finance?period=${period}`);
    return {
      summary: res?.summary || {
        netSales: 0,
        grossProfit: 0,
        operatingExpenses: 0,
        estOperatingProfit: 0,
        customersOweYou: 0,
        youOweSuppliers: 0,
      },
      expenseCategories: res?.expenseCategories || [],
      cashDrawerMovements: res?.cashDrawerMovements || [],
      receivablesAging: res?.receivablesAging || [],
      supplierPayables: res?.supplierPayables || [],
    };
  },

  getCustomerReport: async (
    preset: DatePreset = "thismonth"
  ): Promise<FullCustomerReportData> => {
    const period = mapPeriod(preset);
    const res = await apiClient.get<FullCustomerReportData>(`/reports/customers?period=${period}`);
    return {
      summary: res?.summary || {
        customersWhoBought: 0,
        newProfiles: 0,
        repeatRate: 0,
        pointsIssued: 0,
        pointsRedeemed: 0,
        referralConversion: "0/0",
        wishlistToPurchaseRate: 0,
      },
      topCustomers: res?.topCustomers || [],
      couponUsage: res?.couponUsage || [],
      couponRedemptions: res?.couponRedemptions || [],
      staffPerformance: res?.staffPerformance || [],
    };
  },
};
