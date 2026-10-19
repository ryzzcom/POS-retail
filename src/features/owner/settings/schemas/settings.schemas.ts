import { z } from "zod";

export const storeProfileSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  branchCode: z.string().min(2, "Branch code is required"),
  tagline: z.string().optional(),
  storeCategory: z.string().min(2, "Store category is required"),
  primaryPhone: z.string().min(10, "Please enter a valid phone number"),
  whatsappNumber: z.string().optional(),
  officialEmail: z.string().email("Please enter a valid email address"),
  streetAddress: z.string().min(3, "Street address is required"),
  areaMarket: z.string().min(2, "Area or market is required"),
  city: z.string().min(2, "City is required"),
  currency: z.string().min(1),
  timezone: z.string().min(1),
  operatingHours: z.string().min(2, "Operating hours are required"),
  ntnNumber: z.string().optional(),
  strnNumber: z.string().optional(),
  fbrIntegrationEnabled: z.boolean(),
  posRegistrationId: z.string().optional(),
  defaultGstRate: z.string().min(1),
});

export type StoreProfileSchemaType = z.infer<typeof storeProfileSchema>;

export const staffMemberSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Enter a valid phone number (03XX-XXXXXXX)"),
  email: z.string().email("Enter a valid email address"),
  role: z.enum(["owner", "manager", "cashier", "inventory_clerk"]),
  pin: z.string().regex(/^\d{4}$/, "PIN must be exactly 4 numeric digits"),
  maxDiscountPercent: z.coerce.number().min(0).max(100, "Max discount is 100%"),
  assignedTerminal: z.string().min(1, "Please assign a counter terminal"),
});

export type StaffMemberSchemaType = z.infer<typeof staffMemberSchema>;

export const receiptPrinterSchema = z.object({
  paperSize: z.enum(["80mm", "58mm", "a4"]),
  autoPrintReceipt: z.boolean(),
  openDrawerOnCash: z.boolean(),
  printMerchantCopy: z.boolean(),
  printBarcodeOnBottom: z.boolean(),
  headerBusinessName: z.string().min(2, "Header business name is required"),
  branchAddressLine: z.string().min(2, "Branch address line is required"),
  phoneOnReceipt: z.string().min(5, "Contact phone is required"),
  showCashierName: z.boolean(),
  showCustomerLoyaltyPoints: z.boolean(),
  showKhataRemainingBalance: z.boolean(),
  exchangePolicyFooter: z.string().min(5, "Exchange policy text is required"),
  instagramWebsiteHandle: z.string().optional(),
});

export type ReceiptPrinterSchemaType = z.infer<typeof receiptPrinterSchema>;

export const salesStockCreditSchema = z.object({
  allowNegativeInventory: z.boolean(),
  requireCustomerPhoneOnSale: z.boolean(),
  autoRoundToNearestRupee: z.boolean(),
  defaultPaymentMethod: z.enum([
    "Cash",
    "Card",
    "JazzCash/Easypaisa",
    "Bank Transfer",
  ]),
  maxDiscountWithoutManagerPin: z.coerce.number().min(0).max(100),
  returnExchangeWindowDays: z.coerce.number().min(0).max(365),
  lowStockThresholdUnits: z.coerce.number().min(1),
  autoGenerateSkuPrefix: z.string().min(1),
  enableVariantMatrix: z.boolean(),
  warnDeadStockDays: z.coerce.number().min(1),
  enableKhataCreditAtPos: z.boolean(),
  defaultCreditLimit: z.coerce.number().min(0),
  defaultPaymentDueDays: z.coerce.number().min(1),
  blockNewCreditWhenOverdue: z.boolean(),
  autoSendWhatsAppReminder: z.boolean(),
});

export type SalesStockCreditSchemaType = z.infer<typeof salesStockCreditSchema>;
