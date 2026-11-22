import { apiClient } from "@/lib/api-client";
import type {
  CustomerProfileResponse,
  CustomerStore,
  CustomerProduct,
  OutfitSet,
  VirtualTryOnJob,
  GiftOrder,
  DigitalReceipt,
  StoreMembership,
} from "../types/customer.types";

const CUSTOMER_TOKEN_KEY = "customer_jwt_token";
const CUSTOMER_USER_KEY = "customer_jwt_user";

export function getCustomerToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(CUSTOMER_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setCustomerToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  } catch {}
}

export function clearCustomerToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_USER_KEY);
  } catch {}
}

function getCustomerAuthHeaders(): HeadersInit {
  const token = getCustomerToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const customerService = {
  /**
   * 1. Send OTP to customer's Pakistani mobile phone
   */
  sendOtp: async (phoneNumber: string): Promise<{ success: boolean; message: string; testOtp?: string }> => {
    return apiClient.post("/customer/auth/send-otp", { phoneNumber });
  },

  /**
   * 2. Verify OTP and obtain JWT token
   */
  verifyOtp: async (
    phoneNumber: string,
    otp: string,
    fullName?: string,
  ): Promise<{ accessToken: string; user: { id: string; phoneNumber: string; fullName: string | null; avatarUrl: string | null; preferredSizes: string[] } }> => {
    const res = await apiClient.post<{
      accessToken: string;
      user: { id: string; phoneNumber: string; fullName: string | null; avatarUrl: string | null; preferredSizes: string[] };
    }>("/customer/auth/verify-otp", { phoneNumber, otp, fullName });
    if (res?.accessToken) {
      setCustomerToken(res.accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(res.user));
      }
    }
    return res;
  },

  /**
   * 3. Get Universal Customer Profile & All Connected Shops
   */
  getMe: async (): Promise<CustomerProfileResponse> => {
    return apiClient.get<CustomerProfileResponse>("/customer/auth/me", {
      headers: getCustomerAuthHeaders(),
      skipCache: true,
    });
  },

  /**
   * 4. Browse all active boutiques on the platform
   */
  getStores: async (): Promise<CustomerStore[]> => {
    return apiClient.get<CustomerStore[]>("/customer/stores");
  },

  /**
   * 5. Get store details by slug
   */
  getStoreBySlug: async (slug: string): Promise<CustomerStore> => {
    return apiClient.get<CustomerStore>(`/customer/stores/${slug}`);
  },

  /**
   * 6. Get interactive catalog for a store
   */
  getStoreCatalog: async (slug: string, category?: string, search?: string): Promise<CustomerProduct[]> => {
    const params = new URLSearchParams();
    if (category && category !== "all") params.set("category", category);
    if (search && search.trim()) params.set("search", search.trim());
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiClient.get<CustomerProduct[]>(`/customer/stores/${slug}/catalog${query}`);
  },

  /**
   * 7. Get curated occasion outfits ("Choose My Outfit")
   */
  getStoreOutfits: async (slug: string): Promise<OutfitSet[]> => {
    return apiClient.get<OutfitSet[]>(`/customer/stores/${slug}/outfits`);
  },

  /**
   * 8. Get customer membership details for a specific store (points, credits, khata)
   */
  getStoreMembership: async (slug: string): Promise<StoreMembership> => {
    return apiClient.get<StoreMembership>(`/customer/stores/${slug}/membership`, {
      headers: getCustomerAuthHeaders(),
      skipCache: true,
    });
  },

  /**
   * 9. Generate AI Virtual Try-On
   */
  generateTryOn: async (payload: {
    storeSlug: string;
    productId: string;
    selectedColor?: string;
    userPhotoBase64?: string;
  }): Promise<VirtualTryOnJob> => {
    return apiClient.post<VirtualTryOnJob>("/customer/try-on/generate", payload, {
      headers: getCustomerAuthHeaders(),
    });
  },

  /**
   * 10. Send a Gift
   */
  createGift: async (
    slug: string,
    payload: {
      productId: string;
      variantId?: string;
      selectedSize?: string;
      selectedColor?: string;
      recipientName: string;
      recipientPhone: string;
      giftMessage?: string;
      deliveryMethod: "STORE_PICKUP" | "HOME_DELIVERY";
    },
  ): Promise<{ redemptionCode: string; giftUrl: string; order: GiftOrder }> => {
    return apiClient.post(`/customer/stores/${slug}/gift`, payload, {
      headers: getCustomerAuthHeaders(),
    });
  },

  /**
   * 11. Unbox / View Gift by Redemption Code (Secret Pricing - Zero buyer price exposed!)
   */
  getGiftByCode: async (redemptionCode: string): Promise<GiftOrder> => {
    return apiClient.get<GiftOrder>(`/customer/gifts/${redemptionCode}`);
  },

  /**
   * 12. Claim / Accept Gift
   */
  claimGift: async (
    redemptionCode: string,
    recipientAddress?: string,
  ): Promise<{ success: boolean; message: string; order: GiftOrder }> => {
    return apiClient.post(`/customer/gifts/${redemptionCode}/claim`, { recipientAddress });
  },

  /**
   * 13. Get Digital Receipts across all connected boutiques
   */
  getDigitalReceipts: async (): Promise<DigitalReceipt[]> => {
    return apiClient.get<DigitalReceipt[]>("/customer/receipts", {
      headers: getCustomerAuthHeaders(),
      skipCache: true,
    });
  },

  /**
   * 14. Toggle item in wishlist
   */
  toggleWishlist: async (
    slug: string,
    productId: string,
    notifyOnRestock?: boolean,
  ): Promise<{ wishlisted: boolean }> => {
    return apiClient.post(`/customer/stores/${slug}/wishlist`, { productId, notifyOnRestock }, {
      headers: getCustomerAuthHeaders(),
    });
  },
};
