export type SettingsTab =
  | "store-profile"
  | "team-permissions"
  | "billing-subscription"
  | "receipt-printer"
  | "sales-stock-credit";

// ========================================================
// Tab 1: Store Profile Types
// ========================================================
export interface StoreProfileFormValues {
  storeName: string;
  branchCode: string;
  tagline: string;
  storeCategory: string;
  primaryPhone: string;
  whatsappNumber: string;
  officialEmail: string;
  streetAddress: string;
  areaMarket: string;
  city: string;
  currency: string;
  timezone: string;
  operatingHours: string;
  ntnNumber: string;
  strnNumber: string;
  fbrIntegrationEnabled: boolean;
  posRegistrationId: string;
  defaultGstRate: string;
}

// ========================================================
// Tab 2: Team & Permissions Types
// ========================================================
export type StaffRole = "owner" | "manager" | "cashier" | "inventory_clerk";
export type StaffStatus = "active" | "suspended";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  assignedTerminal: string;
  pinSet: boolean;
  lastActive: string;
  status: StaffStatus;
  maxDiscountPercent: number;
}

export interface StaffMemberFormValues {
  name: string;
  phone: string;
  email: string;
  role: StaffRole;
  pin: string;
  maxDiscountPercent: number;
  assignedTerminal: string;
}

export interface RolePermissionConfig {
  allowManualDiscount: boolean;
  maxCashierDiscountPercent: number;
  processReturnsWithoutPin: boolean;
  viewCostAndMargins: boolean;
  openDrawerWithoutSale: boolean;
  editKhataCreditLimit: boolean;
}

// ========================================================
// Tab 3: Billing & Subscription Types
// ========================================================
export interface BillingPlan {
  name: string;
  interval: "Monthly" | "Annual";
  price: number;
  renewalDate: string;
  activeRegisters: string;
  whatsappCredits: string;
}

export interface UsageMetric {
  id: string;
  label: string;
  used: number;
  limit: number;
  unit: string;
  percentage: number;
}

export interface SavedPaymentMethod {
  id: string;
  type: "card" | "bank" | "wallet";
  title: string;
  subtitle: string;
  expiry: string;
  isDefault: boolean;
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "failed";
}

// ========================================================
// Tab 4: Receipt & Printer Types
// ========================================================
export type PaperSize = "80mm" | "58mm" | "a4";

export interface ReceiptPrinterFormValues {
  paperSize: PaperSize;
  autoPrintReceipt: boolean;
  openDrawerOnCash: boolean;
  printMerchantCopy: boolean;
  printBarcodeOnBottom: boolean;
  headerBusinessName: string;
  branchAddressLine: string;
  phoneOnReceipt: string;
  showCashierName: boolean;
  showCustomerLoyaltyPoints: boolean;
  showKhataRemainingBalance: boolean;
  exchangePolicyFooter: string;
  instagramWebsiteHandle: string;
}

// ========================================================
// Tab 5: Sales, Stock & Credit Settings Types
// ========================================================
export interface SalesStockCreditFormValues {
  allowNegativeInventory: boolean;
  requireCustomerPhoneOnSale: boolean;
  autoRoundToNearestRupee: boolean;
  defaultPaymentMethod: "Cash" | "Card" | "JazzCash/Easypaisa" | "Bank Transfer";
  maxDiscountWithoutManagerPin: number;
  returnExchangeWindowDays: number;
  lowStockThresholdUnits: number;
  autoGenerateSkuPrefix: string;
  enableVariantMatrix: boolean;
  warnDeadStockDays: number;
  enableKhataCreditAtPos: boolean;
  defaultCreditLimit: number;
  defaultPaymentDueDays: number;
  blockNewCreditWhenOverdue: boolean;
  autoSendWhatsAppReminder: boolean;
}
