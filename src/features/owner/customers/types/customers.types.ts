export type CustomerTier = "Gold" | "Silver" | "Regular" | "VIP";

export type MessagingStatus =
  | "All messages"
  | "SMS only"
  | "WhatsApp only"
  | "Opted out";

export interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  tag?: string;
  email?: string;
  tier: CustomerTier;
  lifetimeSpend: number;
  points: number;
  khataBalance: number;
  lastVisit: string;
  messaging: MessagingStatus;
  acceptsMarketing: boolean;
  totalOrders?: number;
  city?: string;
  address?: string;
  notes?: string;
  createdAt?: string;
}

export type CustomerFilterOption =
  | "all"
  | "gold"
  | "silver"
  | "regular"
  | "with_khata"
  | "marketing";

export type CustomerSortOption =
  | "highest_spend"
  | "lowest_spend"
  | "most_points"
  | "recent_visit"
  | "name_asc";

export interface CustomerSummaryMetrics {
  totalProfiles: number;
  acceptsPromotions: number;
  totalKhataReceivable: number;
  goldMembersCount: number;
}

export interface PointHistoryItem {
  id: string;
  type: "earned" | "redeemed" | "manual_add" | "manual_deduct";
  amount: number;
  title: string;
  subtitle: string;
  date: string;
  badgeLabel: string;
  badgeVariant: "success" | "neutral" | "gold" | "failed";
}

