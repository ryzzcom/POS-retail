import { apiClient } from "@/lib/api-client";
import type {
  DashboardData,
  TimeRangeFilter,
  HourlyTrendPoint,
  FinancialPositionMetric,
  AttentionAlertItem,
  TopSellingVariant,
} from "../types/dashboard.types";

interface BackendOverviewPayload {
  period: string;
  salesProfit: {
    period: string;
    sales: {
      netSales: number;
      grossSales: number;
      discounts: number;
      returns: number;
      ordersCount: number;
      aov: number;
    };
    profit: {
      cogs: number;
      grossProfit: number;
      grossMarginPct: number;
      expenses: number;
      estimatedOperatingProfit: number;
    };
    paymentSplit: {
      cash: number;
      cardDigital: number;
      khata: number;
    };
    chartSeries: Array<{
      label: string;
      revenue: number;
    }>;
  };
  financialPosition: {
    cashDrawerNow: number;
    bankBalance: number;
    pettyCash: number;
    customersOweYou: number;
    youOweSuppliers: number;
  };
  attentionAlerts: {
    lowStockVariants: { count: number; items: string[] };
    overdueKhata: { count: number; subtitle: string };
    unpaidBills: { count: number; totalAmount: number; nextDueLabel: string | null };
    failedWhatsAppReceipts: { count: number; reason: string | null };
    subscriptionTrial: { isTrial: boolean; daysRemaining: number };
    alerts: Array<{
      id: string;
      type: string;
      severity: string;
      title: string;
      description: string;
      count: number;
    }>;
  };
  topVariants: {
    period: string;
    customerLoyalty: {
      newCustomersCount: number;
      repeatCustomersCount: number;
      pointsIssued: number;
      pointsRedeemed: number;
    };
    items: Array<{
      id: string;
      productName: string;
      color: string;
      size: string;
      unitsSold: number;
      revenue: number;
    }>;
  };
}

export const dashboardService = {
  /**
   * Retrieves aggregated live dashboard data for the selected period
   */
  getOverview: async (
    period: TimeRangeFilter = "today",
    ownerName: string = "Store Owner"
  ): Promise<DashboardData> => {
    const rawPeriod = period === "month" ? "mtd" : period;
    const res = await apiClient.get<BackendOverviewPayload>(
      `/dashboard/overview?period=${rawPeriod}`
    );

    const trendPoints: HourlyTrendPoint[] = (res.salesProfit.chartSeries || []).map(
      (p) => ({
        hour: p.label,
        label: p.label,
        revenue: p.revenue,
      })
    );

    const financialMetrics: FinancialPositionMetric[] = [
      {
        id: "metric-cash-drawer",
        label: "Cash in drawer now",
        amount: res.financialPosition.cashDrawerNow,
        explanation: "Physical cash currently inside open cashier drawers across active counters.",
      },
      {
        id: "metric-bank-balance",
        label: "Bank balance",
        amount: res.financialPosition.bankBalance,
        explanation: "Digital card and bank settlements minus operational business bank expenses.",
      },
      {
        id: "metric-petty-cash",
        label: "Petty cash",
        amount: res.financialPosition.pettyCash,
        explanation: "Emergency store petty cash float allocated across shifts.",
      },
      {
        id: "metric-customers-owe",
        label: "Customers owe you",
        amount: res.financialPosition.customersOweYou,
        explanation: "Total outstanding credit balance receivables from boutique Khata customers.",
        href: "/khata-receivables",
      },
      {
        id: "metric-owe-suppliers",
        label: "You owe suppliers",
        amount: res.financialPosition.youOweSuppliers,
        explanation: "Pending procurement invoices payable to wholesale textile mills and designers.",
        href: "/purchases-suppliers",
      },
    ];

    const attentionAlerts: AttentionAlertItem[] = (res.attentionAlerts.alerts || []).map(
      (a) => {
        let href: string | undefined;
        let sev: "warning" | "error" | "info" = "info";

        if (a.type === "LOW_STOCK") {
          href = "/products-inventory";
          sev = "warning";
        } else if (a.type === "OVERDUE_KHATA") {
          href = "/khata-receivables";
          sev = "error";
        } else if (a.type === "UNPAID_SUPPLIER_BILLS") {
          href = "/purchases-suppliers";
          sev = "warning";
        } else if (a.severity === "danger" || a.severity === "error") {
          sev = "error";
        } else if (a.severity === "warning") {
          sev = "warning";
        }

        return {
          id: a.id,
          title: a.title,
          subtitle: a.description,
          severity: sev,
          href,
        };
      }
    );

    const topVariants: TopSellingVariant[] = (res.topVariants.items || []).map((item) => ({
      id: item.id,
      productName: item.productName,
      color: item.color || "Standard",
      size: item.size || "Free Size",
      unitsSold: item.unitsSold,
      revenue: item.revenue,
    }));

    return {
      ownerName,
      greetingSubtitle: "Here is your boutique's operational performance summary.",
      sales: {
        netSales: res.salesProfit.sales.netSales,
        grossSales: res.salesProfit.sales.grossSales,
        discounts: res.salesProfit.sales.discounts,
        returns: res.salesProfit.sales.returns,
        orderCount: res.salesProfit.sales.ordersCount,
        averageOrderValue: res.salesProfit.sales.aov,
        trend: trendPoints,
      },
      profit: {
        grossProfit: res.salesProfit.profit.grossProfit,
        marginPercent: res.salesProfit.profit.grossMarginPct,
        cogs: res.salesProfit.profit.cogs,
        estimatedOperatingProfit: res.salesProfit.profit.estimatedOperatingProfit,
        expenses: res.salesProfit.profit.expenses,
        tenders: {
          cash: res.salesProfit.paymentSplit.cash,
          cardDigital: res.salesProfit.paymentSplit.cardDigital,
          onKhata: res.salesProfit.paymentSplit.khata,
        },
      },
      financialMetrics,
      attentionAlerts,
      customerSummary: {
        newCustomers: res.topVariants.customerLoyalty.newCustomersCount,
        repeatCustomers: res.topVariants.customerLoyalty.repeatCustomersCount,
        pointsIssued: res.topVariants.customerLoyalty.pointsIssued,
        pointsRedeemed: res.topVariants.customerLoyalty.pointsRedeemed,
      },
      topVariants,
    };
  },
};
