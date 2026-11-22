import { apiClient } from "@/lib/api-client";
import type {
  CustomerItem,
  CustomerTier,
  MessagingStatus,
  CustomerSummaryMetrics,
} from "../types/customers.types";

export interface CustomersApiResponse {
  summary: {
    activeProfilesCount: number;
    acceptPromotionsCount: number;
    subtitle: string;
  };
  items: CustomerItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function mapTier(rawTier?: string): CustomerTier {
  if (!rawTier) return "Regular";
  const t = rawTier.toUpperCase();
  if (t === "GOLD") return "Gold";
  if (t === "SILVER") return "Silver";
  if (t === "VIP") return "VIP";
  return "Regular";
}

function mapMessaging(raw?: string): MessagingStatus {
  if (!raw) return "All messages";
  if (raw === "Opted out" || raw === "OPTED_OUT") return "Opted out";
  if (raw === "SMS only") return "SMS only";
  if (raw === "WhatsApp only") return "WhatsApp only";
  return "All messages";
}

export const customersService = {
  /**
   * 1. GET /api/v1/customers
   */
  getCustomers: async (params?: {
    search?: string;
    tier?: string;
    page?: number;
    limit?: number;
  }): Promise<CustomersApiResponse> => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.tier && params.tier !== "all") query.set("tier", params.tier);
    if (params?.page) query.set("page", String(params.page));
    query.set("limit", String(params?.limit || 50));

    const res = await apiClient.get<{
      summary: {
        activeProfilesCount: number;
        acceptPromotionsCount: number;
        subtitle: string;
      };
      items: Array<{
        id: string;
        name: string;
        phone: string;
        email?: string;
        styleTags?: string | null;
        tier?: string;
        tierLabel?: string;
        lifetimeSpend?: number;
        points?: number;
        khataBalance?: number;
        lastVisitFormatted?: string | null;
        messagingStatus?: string;
        acceptsPromotions?: boolean;
        city?: string;
        address?: string;
        notes?: string;
        createdAt?: string;
      }>;
      meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/customers?${query.toString()}`);

    const items: CustomerItem[] = (res.items || []).map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      tag: c.styleTags || undefined,
      email: c.email,
      tier: mapTier(c.tier || c.tierLabel),
      lifetimeSpend: c.lifetimeSpend || 0,
      points: c.points || 0,
      khataBalance: c.khataBalance || 0,
      lastVisit: c.lastVisitFormatted || "No visits yet",
      messaging: mapMessaging(c.messagingStatus),
      acceptsMarketing: c.acceptsPromotions ?? true,
      city: c.city,
      address: c.address,
      notes: c.notes,
      createdAt: c.createdAt,
    }));

    return {
      summary: res.summary || {
        activeProfilesCount: items.length,
        acceptPromotionsCount: items.filter((i) => i.acceptsMarketing).length,
        subtitle: `${items.length} active profiles`,
      },
      items,
      meta: res.meta || {
        page: 1,
        limit: 50,
        total: items.length,
        totalPages: 1,
      },
    };
  },

  /**
   * 2. GET /api/v1/customers/:id
   */
  getCustomerById: async (id: string): Promise<CustomerItem | null> => {
    try {
      const c = await apiClient.get<{
        id: string;
        name: string;
        phone: string;
        email?: string;
        styleTags?: string | null;
        tier?: string;
        lifetimeSpend?: number;
        points?: number;
        khataBalance?: number;
        lastVisitFormatted?: string | null;
        messagingStatus?: string;
        acceptsPromotions?: boolean;
        city?: string;
        address?: string;
        notes?: string;
        createdAt?: string;
      }>(`/customers/${id}`);

      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        tag: c.styleTags || undefined,
        email: c.email,
        tier: mapTier(c.tier),
        lifetimeSpend: c.lifetimeSpend || 0,
        points: c.points || 0,
        khataBalance: c.khataBalance || 0,
        lastVisit: c.lastVisitFormatted || "No visits yet",
        messaging: mapMessaging(c.messagingStatus),
        acceptsMarketing: c.acceptsPromotions ?? true,
        city: c.city,
        address: c.address,
        notes: c.notes,
        createdAt: c.createdAt,
      };
    } catch {
      return null;
    }
  },

  /**
   * 3. POST /api/v1/customers
   */
  createCustomer: async (data: {
    name: string;
    phone: string;
    email?: string;
    city?: string;
    address?: string;
    notes?: string;
    acceptsMarketing?: boolean;
    acceptsPromotions?: boolean;
  }): Promise<CustomerItem> => {
    const payload = {
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      city: data.city || undefined,
      address: data.address || undefined,
      notes: data.notes || undefined,
      acceptsPromotions: data.acceptsPromotions ?? data.acceptsMarketing ?? true,
      acceptsMarketing: data.acceptsMarketing ?? data.acceptsPromotions ?? true,
    };
    const c = await apiClient.post<any>("/customers", payload);
    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      tier: mapTier(c.tier),
      lifetimeSpend: c.lifetimeSpend || 0,
      points: c.points || 0,
      khataBalance: c.khataBalance || 0,
      lastVisit: "Today",
      messaging: "All messages",
      acceptsMarketing: c.acceptsPromotions ?? true,
      city: c.city,
      address: c.address,
      notes: c.notes,
    };
  },

  /**
   * 4. PATCH /api/v1/customers/:id
   */
  updateCustomer: async (id: string, data: Record<string, unknown>): Promise<void> => {
    await apiClient.patch(`/customers/${id}`, data);
  },
};
