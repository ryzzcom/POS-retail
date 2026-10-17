export type TimeRangeFilter = "today" | "week" | "month";

export interface HourlyTrendPoint {
  hour: string;
  label: string;
  revenue: number;
  month?: string;
  isFigmaHighlighted?: boolean;
}

export interface HeroSalesData {
  netSales: number;
  grossSales: number;
  discounts: number;
  returns: number;
  orderCount: number;
  averageOrderValue: number;
  trend: HourlyTrendPoint[];
}

export interface TenderSplitData {
  cash: number;
  cardDigital: number;
  onKhata: number;
}

export interface HeroProfitData {
  grossProfit: number;
  marginPercent: number;
  cogs: number;
  estimatedOperatingProfit: number;
  expenses: number;
  tenders: TenderSplitData;
}

export interface FinancialPositionMetric {
  id: string;
  label: string;
  amount: number;
  explanation: string;
  href?: string;
}

export interface AttentionAlertItem {
  id: string;
  title: string;
  subtitle: string;
  severity: "warning" | "error" | "info";
  href?: string;
}

export interface TopSellingVariant {
  id: string;
  productName: string;
  color: string;
  size: string;
  unitsSold: number;
  revenue: number;
}

export interface CustomerLoyaltySummary {
  newCustomers: number;
  repeatCustomers: number;
  pointsIssued: number;
  pointsRedeemed: number;
}

export interface DashboardData {
  ownerName: string;
  greetingSubtitle: string;
  sales: HeroSalesData;
  profit: HeroProfitData;
  financialMetrics: FinancialPositionMetric[];
  attentionAlerts: AttentionAlertItem[];
  customerSummary: CustomerLoyaltySummary;
  topVariants: TopSellingVariant[];
}
