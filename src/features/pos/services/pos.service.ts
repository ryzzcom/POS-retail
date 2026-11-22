import { apiClient } from "@/lib/api-client";
import {
  PosProduct,
  PosCustomer,
  PosHeldBill,
  PosTender,
  PosSaleResult,
  PosCartItem,
} from "../types";

export interface CheckoutPayload {
  counterId?: string;
  shiftId?: string;
  customerId?: string;
  items: Array<{
    variantId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }>;
  billDiscount?: number;
  pointsRedeemed?: number;
  couponCode?: string;
  payments: Array<{
    method: "CASH" | "CARD" | "WALLET" | "KHATA";
    amount: number;
    cashTendered?: number;
    changeDue?: number;
    referenceNo?: string;
  }>;
  notes?: string;
}

export const posService = {
  getProducts: async (category?: string, search?: string): Promise<PosProduct[]> => {
    const params = new URLSearchParams();
    if (category && category !== "all") params.set("category", category);
    if (search) params.set("search", search);

    const res = await apiClient.get<PosProduct[]>(
      `/pos/products${params.toString() ? `?${params.toString()}` : ""}`
    );
    return Array.isArray(res) ? res : [];
  },

  searchCustomers: async (search?: string): Promise<PosCustomer[]> => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);

    const res = await apiClient.get<PosCustomer[]>(
      `/pos/customers${params.toString() ? `?${params.toString()}` : ""}`
    );
    return Array.isArray(res) ? res : [];
  },

  quickRegisterCustomer: async (data: {
    name: string;
    phone: string;
    email?: string;
  }): Promise<PosCustomer> => {
    return apiClient.post<PosCustomer>("/pos/customers/quick", {
      fullName: data.name,
      name: data.name,
      phoneNumber: data.phone,
      phone: data.phone,
      email: data.email || undefined,
    });
  },

  checkout: async (payload: CheckoutPayload): Promise<{
    receiptNo: string;
    orderId: string;
    totalAmount: number;
    pointsEarned: number;
    newPointsBalance?: number;
  }> => {
    const idempotencyKey = `pos-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const headers = { "x-idempotency-key": idempotencyKey };

    return apiClient.post("/pos/checkout", payload, { headers });
  },

  holdBill: async (data: {
    customerName?: string;
    customerPhone?: string;
    items: PosCartItem[];
    subtotal: number;
    notes?: string;
  }): Promise<{ id: string }> => {
    return apiClient.post("/pos/hold", data);
  },

  getHeldBills: async (): Promise<PosHeldBill[]> => {
    const res = await apiClient.get<PosHeldBill[]>("/pos/held-bills");
    return Array.isArray(res) ? res : [];
  },

  deleteHeldBill: async (id: string): Promise<{ success: boolean }> => {
    await apiClient.delete(`/pos/held-bills/${id}`);
    return { success: true };
  },
};
