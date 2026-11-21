import { apiClient } from "@/lib/api-client";
import type {
  SettingsData,
  StoreProfileFormValues,
  StaffMember,
  StaffMemberFormValues,
  StaffStatus,
  ReceiptPrinterFormValues,
  SalesStockCreditFormValues,
} from "../types";

export const settingsService = {
  /**
   * 1. GET /api/v1/settings
   * Loads unified settings across all 5 tabs:
   * storeProfile, teamPermissions, billingSubscription, receiptPrinter, salesStockCredit
   */
  getAllSettings: async (): Promise<SettingsData> => {
    return apiClient.get<SettingsData>("/settings");
  },

  /**
   * 2. PATCH /api/v1/settings/store-profile
   * Updates store identity, contact info, operating hours, and NTN/STRN/FBR tax details
   */
  updateStoreProfile: async (
    values: Partial<StoreProfileFormValues>
  ): Promise<Partial<StoreProfileFormValues>> => {
    return apiClient.patch<Partial<StoreProfileFormValues>>("/settings/store-profile", values);
  },

  /**
   * 3. GET /api/v1/settings/staff
   * Retrieves active staff members and assigned terminals
   */
  getStaff: async (): Promise<StaffMember[]> => {
    return apiClient.get<StaffMember[]>("/settings/staff");
  },

  /**
   * 4. POST /api/v1/settings/staff
   * Creates a new staff member with role and POS PIN
   */
  createStaffMember: async (
    member: StaffMemberFormValues
  ): Promise<StaffMember> => {
    return apiClient.post<StaffMember>("/settings/staff", member);
  },

  /**
   * 5. PATCH /api/v1/settings/staff/:id
   * Updates staff role, assigned terminal, discount limit, PIN, or active/suspended status
   */
  updateStaffMember: async (
    id: string,
    member: Partial<StaffMemberFormValues & { status: StaffStatus }>
  ): Promise<StaffMember> => {
    return apiClient.patch<StaffMember>(`/settings/staff/${id}`, member);
  },

  /**
   * 6. DELETE /api/v1/settings/staff/:id
   * Deactivates/suspends a staff member account
   */
  deleteStaffMember: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete<{ success: boolean; message: string }>(`/settings/staff/${id}`);
  },

  /**
   * 7. PATCH /api/v1/settings/receipt-printer
   * Thermal printer paper size, headers, footers, barcode, and drawer triggers
   */
  updateReceiptSettings: async (
    values: Partial<ReceiptPrinterFormValues>
  ): Promise<Partial<ReceiptPrinterFormValues>> => {
    return apiClient.patch<Partial<ReceiptPrinterFormValues>>("/settings/receipt-printer", values);
  },

  /**
   * 8. PATCH /api/v1/settings/sales-stock-credit
   * POS sales, inventory thresholds, dead stock warnings, and Khata credit rules
   */
  updateSalesStockCreditRules: async (
    values: Partial<SalesStockCreditFormValues>
  ): Promise<Partial<SalesStockCreditFormValues>> => {
    return apiClient.patch<Partial<SalesStockCreditFormValues>>("/settings/sales-stock-credit", values);
  },
};
