import {
  StoreProfileFormValues,
  StaffMember,
  ReceiptPrinterFormValues,
  SalesStockCreditFormValues,
} from "../types";

export const settingsService = {
  updateStoreProfile: async (_values: StoreProfileFormValues): Promise<void> => {
    return Promise.resolve();
  },
  createStaffMember: async (_member: Partial<StaffMember>): Promise<void> => {
    return Promise.resolve();
  },
  updateStaffMember: async (_id: string, _member: Partial<StaffMember>): Promise<void> => {
    return Promise.resolve();
  },
  deleteStaffMember: async (_id: string): Promise<void> => {
    return Promise.resolve();
  },
  updateReceiptSettings: async (_values: ReceiptPrinterFormValues): Promise<void> => {
    return Promise.resolve();
  },
  updateSalesStockCreditRules: async (
    _values: SalesStockCreditFormValues
  ): Promise<void> => {
    return Promise.resolve();
  },
};
