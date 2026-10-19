import {
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

// ========================================================
// Tab 1: Sales & Revenue Mock Data
// ========================================================
export const MOCK_SALES_SUMMARY: SalesReportSummary = {
  grossSales: 18790,
  discountsAndPoints: 500,
  netSales: 18290,
  cogs: 11220,
  grossProfit: 7070,
  grossProfitMargin: 39,
  ordersCount: 3,
  aov: 6097,
};

export const MOCK_DAILY_SALES: DailySalesRow[] = [
  {
    id: "ds-1",
    date: "11 Oct 2026",
    orders: 3,
    netSales: 18290,
    grossProfit: 7070,
  },
  {
    id: "ds-2",
    date: "10 Oct 2026",
    orders: 4,
    netSales: 24500,
    grossProfit: 9800,
  },
  {
    id: "ds-3",
    date: "09 Oct 2026",
    orders: 2,
    netSales: 12800,
    grossProfit: 4950,
  },
];

export const MOCK_PAYMENT_METHODS: PaymentMethodRow[] = [
  {
    id: "pm-1",
    method: "Cash",
    amount: 4500,
    share: 25,
  },
  {
    id: "pm-2",
    method: "Card",
    amount: 9000,
    share: 49,
  },
  {
    id: "pm-3",
    method: "Customer khata / credit",
    amount: 4790,
    share: 26,
  },
];

export const MOCK_CASHIER_SALES: CashierSalesRow[] = [
  {
    id: "cs-1",
    cashier: "Amina Bilal",
    orders: 2,
    discounts: 300,
    netSales: 12200,
    aov: 6100,
  },
  {
    id: "cs-2",
    cashier: "Hamza Sheikh",
    orders: 1,
    discounts: 200,
    netSales: 6090,
    aov: 6090,
  },
];

export const MOCK_BEST_SELLING_VARIANTS: BestSellingVariantRow[] = [
  {
    id: "bs-1",
    variant: "Lawn 3-Piece Embroidered · M",
    sku: "LWN-3PC-001",
    qty: 1,
    revenue: 7500,
    margin: 45,
  },
  {
    id: "bs-2",
    variant: "Silk Dupatta Floral · Standard",
    sku: "SLK-DUP-012",
    qty: 2,
    revenue: 5400,
    margin: 38,
  },
  {
    id: "bs-3",
    variant: "Cotton Kurti Printed · S",
    sku: "CTN-KRT-045",
    qty: 1,
    revenue: 5390,
    margin: 32,
  },
  {
    id: "bs-4",
    variant: "Khaddar Shawl Suit · L",
    sku: "KHD-SHW-089",
    qty: 1,
    revenue: 4950,
    margin: 40,
  },
];

export const MOCK_TRANSACTIONS: ReportTransactionRow[] = [
  {
    id: "tx-1",
    receiptNo: "REC-001042",
    time: "11 Oct, 03:45 PM",
    cashier: "Amina Bilal",
    customer: "Fatima Raza",
    total: 7500,
  },
  {
    id: "tx-2",
    receiptNo: "REC-001041",
    time: "11 Oct, 02:15 PM",
    cashier: "Hamza Sheikh",
    customer: "Mehwish Akhtar",
    total: 5400,
  },
  {
    id: "tx-3",
    receiptNo: "REC-001040",
    time: "11 Oct, 11:30 AM",
    cashier: "Amina Bilal",
    customer: "Hira Siddiqui",
    total: 5390,
  },
];

// ========================================================
// Tab 2: Inventory Valuation Mock Data
// ========================================================
export const MOCK_INVENTORY_SUMMARY: InventoryReportSummary = {
  unitsOnHand: 199,
  stockAtCost: 406860,
  stockAtRetail: 697510,
  lowStockCount: 9,
  deadStockCount: 23,
};

export const MOCK_STOCK_VALUATION: StockValuationRow[] = [
  {
    id: "sv-1",
    product: "Raw Silk Embroidered Frock",
    sku: "RS-EMB-008",
    onHand: 14,
    unitCost: 3200,
    value: 44800,
  },
  {
    id: "sv-2",
    product: "Chiffon 3-Piece Festive",
    sku: "CHF-FST-021",
    onHand: 8,
    unitCost: 4500,
    value: 36000,
  },
  {
    id: "sv-3",
    product: "Velvet Shawl Luxury",
    sku: "VLV-SHW-004",
    onHand: 5,
    unitCost: 6800,
    value: 34000,
  },
  {
    id: "sv-4",
    product: "Lawn Digital Print Kurti",
    sku: "LWN-DIG-055",
    onHand: 28,
    unitCost: 1150,
    value: 32200,
  },
  {
    id: "sv-5",
    product: "Khaddar 2-Piece Winter",
    sku: "KHD-WNT-019",
    onHand: 19,
    unitCost: 1600,
    value: 30400,
  },
  {
    id: "sv-6",
    product: "Embroidered Organza Dupatta",
    sku: "ORG-DUP-007",
    onHand: 12,
    unitCost: 1850,
    value: 22200,
  },
  {
    id: "sv-7",
    product: "Jacquard Straight Pants",
    sku: "JCD-PNT-015",
    onHand: 22,
    unitCost: 950,
    value: 20900,
  },
];

export const MOCK_LOW_STOCK: LowStockRow[] = [
  {
    id: "ls-1",
    variant: "Silk Dupatta Floral · Emerald",
    onHand: 2,
    reorderAt: 5,
  },
  {
    id: "ls-2",
    variant: "Organza Wrap · Silver",
    onHand: 1,
    reorderAt: 4,
  },
  {
    id: "ls-3",
    variant: "Embroidered Trouser · M",
    onHand: 2,
    reorderAt: 6,
  },
  {
    id: "ls-4",
    variant: "Velvet Shawl Luxury · Black",
    onHand: 1,
    reorderAt: 3,
  },
];

export const MOCK_DEAD_STOCK: DeadStockRow[] = [
  {
    id: "ds-1",
    product: "Winter Jacquard Shawl",
    unitCost: 3500,
    value: 14000,
  },
  {
    id: "ds-2",
    product: "Georgette Kurti Classic",
    unitCost: 1400,
    value: 9800,
  },
  {
    id: "ds-3",
    product: "Linen Solid 2-Piece",
    unitCost: 2100,
    value: 8400,
  },
  {
    id: "ds-4",
    product: "Embossed Velvet Stole",
    unitCost: 2800,
    value: 11200,
  },
];

export const MOCK_STOCK_MOVEMENTS: StockMovementRow[] = [];

// ========================================================
// Tab 3: Finance & P&L Mock Data
// ========================================================
export const MOCK_FINANCE_SUMMARY: FinanceReportSummary = {
  netSales: 18290,
  grossProfit: 7070,
  operatingExpenses: 389800,
  estOperatingProfit: -382730,
  customersOweYou: 68860,
  youOweSuppliers: 178900,
};

export const MOCK_EXPENSES_BY_CATEGORY: ExpenseCategoryRow[] = [
  {
    id: "ec-1",
    category: "Shop rent",
    recorded: 185000,
    paid: 185000,
  },
  {
    id: "ec-2",
    category: "Employee salaries",
    recorded: 112000,
    paid: 102000,
  },
  {
    id: "ec-3",
    category: "Electricity bill",
    recorded: 15000,
    paid: 15000,
  },
  {
    id: "ec-4",
    category: "Employee advances",
    recorded: 6500,
    paid: 0,
  },
  {
    id: "ec-5",
    category: "Packaging & Bags",
    recorded: 4500,
    paid: 4500,
  },
];

export const MOCK_CASH_DRAWER_MOVEMENTS: CashDrawerMovementRow[] = [
  {
    id: "cd-1",
    time: "11 Oct 2026, 2:58 PM",
    type: "cash sale",
    reference: "14 cash sales before 3 PM",
    amount: 41850,
  },
  {
    id: "cd-2",
    time: "11 Oct 2026, 12:20 PM",
    type: "khata collection",
    reference: "COL-00244 · Hira Siddiqui",
    amount: 3000,
  },
  {
    id: "cd-3",
    time: "11 Oct 2026, 12:20 PM",
    type: "cash refund",
    reference: "RT-000431",
    amount: -2990,
  },
  {
    id: "cd-4",
    time: "11 Oct 2026, 1:05 PM",
    type: "cash expense",
    reference: "Shopping bags · Shah Packages",
    amount: -1500,
  },
];

export const MOCK_RECEIVABLES_AGING: ReceivablesAgingRow[] = [
  {
    id: "ra-1",
    customer: "Fatima Raza",
    balance: 22300,
    current: 9800,
    overdue1to30: 12500,
    overdue31to60: 0,
  },
  {
    id: "ra-2",
    customer: "Hira Siddiqui",
    balance: 7000,
    current: 0,
    overdue1to30: 7000,
    overdue31to60: 0,
  },
  {
    id: "ra-3",
    customer: "Mehwish Akhtar",
    balance: 28210,
    current: 11200,
    overdue1to30: 0,
    overdue31to60: 17010,
  },
  {
    id: "ra-4",
    customer: "Zainab Qureshi",
    balance: 6400,
    current: 6400,
    overdue1to30: 0,
    overdue31to60: 0,
  },
];

export const MOCK_SUPPLIER_PAYABLES: SupplierPayableRow[] = [
  {
    id: "sp-1",
    supplier: "Al-Karam Textiles (Wholesale)",
    balance: 168800,
  },
  {
    id: "sp-2",
    supplier: "Zeenat Embroidery House",
    balance: 10100,
  },
  {
    id: "sp-3",
    supplier: "Gul Ahmed Fabrics",
    balance: 0,
  },
];

// ========================================================
// Tab 4: Customer & Staff Retention Mock Data
// ========================================================
export const MOCK_CUSTOMER_SUMMARY: CustomerReportSummary = {
  customersWhoBought: 2,
  newProfiles: 0,
  repeatRate: 100,
  pointsIssued: 248,
  pointsRedeemed: 200,
  referralConversion: "1/2",
  wishlistToPurchaseRate: 0,
};

export const MOCK_TOP_CUSTOMERS: TopCustomerRow[] = [
  {
    id: "tc-1",
    customer: "Mehwish Akhtar",
    tier: "Gold",
    lifetimeSpend: 251900,
    points: 1240,
    lastVisit: "8 Oct 2026",
  },
  {
    id: "tc-2",
    customer: "Fatima Raza",
    tier: "Gold",
    lifetimeSpend: 184500,
    points: 640,
    lastVisit: "11 Oct 2026",
  },
  {
    id: "tc-3",
    customer: "Hira Siddiqui",
    tier: "Silver",
    lifetimeSpend: 62300,
    points: 85,
    lastVisit: "11 Oct 2026",
  },
  {
    id: "tc-4",
    customer: "Usman Tariq",
    tier: "Regular",
    lifetimeSpend: 8980,
    points: 95,
    lastVisit: "3 Sep 2026",
  },
];

export const MOCK_COUPON_USAGE: CouponUsageRow[] = [
  {
    id: "cu-1",
    code: "WINTER10",
    uses: 1,
    totalDiscount: 1120,
  },
  {
    id: "cu-2",
    code: "WELCOME500",
    uses: 0,
    totalDiscount: 0,
  },
  {
    id: "cu-3",
    code: "EID25",
    uses: 0,
    totalDiscount: 0,
  },
];

export const MOCK_COUPON_REDEMPTIONS: CouponRedemptionRow[] = [
  {
    id: "cr-1",
    customer: "Mehwish Akhtar",
    purchase: "PO-000041",
    status: "Delivered",
    boughtAfter: "Rs. 1,120 saved",
  },
  {
    id: "cr-2",
    customer: "Fatima Raza",
    purchase: "REC-001038",
    status: "Redeemed",
    boughtAfter: "Rs. 500 saved",
  },
];

export const MOCK_STAFF_PERFORMANCE: StaffPerformanceRow[] = [
  {
    id: "sp-1",
    staffName: "Amina Bilal",
    counter: "Counter 1",
    shiftCount: 8,
    totalOrders: 42,
    totalSales: 218500,
    returnRate: "1.2%",
    commissionEarned: 6550,
  },
  {
    id: "sp-2",
    staffName: "Hamza Sheikh",
    counter: "Counter 2",
    shiftCount: 7,
    totalOrders: 35,
    totalSales: 184200,
    returnRate: "0.8%",
    commissionEarned: 5520,
  },
  {
    id: "sp-3",
    staffName: "Zainab Tariq",
    counter: "Counter 1",
    shiftCount: 6,
    totalOrders: 29,
    totalSales: 142000,
    returnRate: "2.1%",
    commissionEarned: 4260,
  },
];
