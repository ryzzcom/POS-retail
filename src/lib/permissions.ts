export const ROLES = {
  OWNER: "owner",
  CASHIER: "cashier",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const OWNER_ROUTES = {
  DASHBOARD: "/dashboard",
  SALES_HISTORY: "/sales-history",
  PRODUCTS_INVENTORY: "/products-inventory",
  PURCHASES_SUPPLIERS: "/purchases-suppliers",
  CUSTOMERS: "/customers",
  LOYALTY_REFERRALS: "/loyalty-referrals",
  FINANCE_EXPENSES: "/finance-expenses",
  KHATA_RECEIVABLES: "/khata-receivables",
  REPORTS_ANALYTICS: "/reports-analytics",
  WHATSAPP_CAMPAIGNS: "/whatsapp-campaigns",
  SETTINGS: "/settings",
} as const;

export const CASHIER_ROUTES = {
  POS: (_storeSlug?: string, _counterId?: string) => "/pos",
  SHIFT: (storeSlug: string, counterId: string) =>
    "/" + storeSlug + "/counter/" + counterId + "/shift",
  MY_SALES: (storeSlug: string, counterId: string) =>
    "/" + storeSlug + "/counter/" + counterId + "/my-sales",
  KHATA_PAYMENT: (storeSlug: string, counterId: string) =>
    "/" + storeSlug + "/counter/" + counterId + "/khata-payment",
} as const;

export const PUBLIC_ROUTES = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  ACTIVATE_ACCOUNT: "/activate-account",
  COUNTER_UNLOCK: (storeSlug: string, counterId: string) =>
    "/" + storeSlug + "/counter/" + counterId + "/unlock",
} as const;
