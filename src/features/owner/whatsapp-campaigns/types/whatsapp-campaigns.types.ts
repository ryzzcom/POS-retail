export type WhatsappTabId =
  | "log"
  | "campaigns"
  | "templates"
  | "automated"
  | "connection"
  | "credits";

export type MessageLogFilter = "all" | "sent" | "delivered" | "failed";

export type MessageDeliveryStatus = "delivered" | "failed" | "sent" | "read";

export interface MessageLogItem {
  id: string;
  customerName: string;
  customerPhone: string;
  receiptRef: string;
  templateName: string;
  message: string;
  status: MessageDeliveryStatus;
  updatedAt: string;
  failureReason?: string;
  category: "Digital receipt" | "Khata reminder" | "Back in stock" | "Campaign" | "Review";
}

export type CampaignStatus = "Active" | "Completed" | "Draft" | "Scheduled";

export interface CampaignItem {
  id: string;
  title: string;
  purpose: string;
  couponCode: string;
  discount: string;
  validity: string;
  messagesSent: number;
  posRedeemed: number;
  status: CampaignStatus;
  audienceSegment: string;
  templateName: string;
  revenueAttributedPKR?: number;
}

export type TemplateCategory =
  | "Digital receipt"
  | "Loyalty update"
  | "New arrivals"
  | "Khata reminder"
  | "Review request"
  | "Marketing";

export interface TemplateItem {
  id: string;
  name: string;
  category: TemplateCategory;
  metaCategory: "Utility" | "Marketing" | "Authentication";
  body: string;
  variables: string[];
  language: string;
  status: "Approved" | "In Review" | "Rejected";
}

export interface AutomatedMessageRule {
  id: string;
  title: string;
  timing: string;
  trigger: string;
  templateName: string;
  lastRun: string;
  enabled: boolean;
}

export interface ConnectionConsentConfig {
  phoneNumberId: string;
  businessDisplayName: string;
  googleReviewLink: string;
  isApiEnabled: boolean;
  requireExplicitOptIn: boolean;
  enforceQuietHours: boolean;
  autoUnsubscribeKeyword: boolean;
}

export interface CreditUsageBreakdown {
  digitalReceipts: number;
  khataReminders: number;
  promoCampaigns: number;
  backInStock: number;
}

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  pricePKR: number;
  featured?: boolean;
}

export interface WhatsAppMetricsSummary {
  connectedStatus: string;
  queuedCount: number;
  failedCount: number;
  availableCredits: number;
  monthlyAllowance: number;
  reservedCredits: number;
  purchasedCredits: number;
  nextRenewalDate: string;
}
