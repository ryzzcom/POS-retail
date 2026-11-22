import { apiClient } from "@/lib/api-client";
import { getActiveStoreName } from "@/lib";
import {
  MessageLogItem,
  CampaignItem,
  TemplateItem,
  AutomatedMessageRule,
  ConnectionConsentConfig,
  WhatsAppMetricsSummary,
} from "../types/whatsapp-campaigns.types";
import {
  NewCouponFormValues,
  NewCampaignFormValues,
} from "../schemas/whatsapp-campaigns.schemas";

interface BackendOverviewResponse {
  isConnected: boolean;
  displayPhoneNumber: string;
  qualityRating: string;
  availableCredits: number;
  isVerified: boolean;
  wabaId: string;
  autoSendReceipts: boolean;
  isApiEnabled: boolean;
  metrics: {
    connectedStatus: string;
    queuedCount: number;
    failedCount: number;
    deliveredCount: number;
    availableCredits: number;
    monthlyAllowance: number;
    reservedCredits: number;
    purchasedCredits: number;
    nextRenewalDate: string;
  };
}

export const whatsappCampaignsService = {
  fetchOverview: async (): Promise<{
    metrics: WhatsAppMetricsSummary;
    isConnected: boolean;
    displayPhoneNumber: string;
    availableCredits: number;
  }> => {
    const res = await apiClient.get<BackendOverviewResponse>("/whatsapp/overview");
    return {
      metrics: {
        connectedStatus: res?.metrics?.connectedStatus || (res?.isConnected ? "Connected" : "Disconnected"),
        queuedCount: res?.metrics?.queuedCount || 0,
        failedCount: res?.metrics?.failedCount || 0,
        availableCredits: res?.availableCredits || 0,
        monthlyAllowance: res?.metrics?.monthlyAllowance || 1000,
        reservedCredits: res?.metrics?.reservedCredits || 0,
        purchasedCredits: res?.metrics?.purchasedCredits || 0,
        nextRenewalDate: res?.metrics?.nextRenewalDate || "End of month",
      },
      isConnected: !!res?.isConnected,
      displayPhoneNumber: res?.displayPhoneNumber || "",
      availableCredits: res?.availableCredits || 0,
    };
  },

  fetchMessageLogs: async (): Promise<MessageLogItem[]> => {
    const res = await apiClient.get<{ items: MessageLogItem[] }>("/whatsapp/logs");
    return res?.items || [];
  },

  retryMessage: async (logId: string): Promise<{ success: boolean }> => {
    await apiClient.post(`/whatsapp/logs/${logId}/resend`, {});
    return { success: true };
  },

  fetchCampaigns: async (): Promise<CampaignItem[]> => {
    const res = await apiClient.get<CampaignItem[]>("/whatsapp/campaigns");
    return Array.isArray(res) ? res : [];
  },

  createCoupon: async (values: NewCouponFormValues): Promise<{ success: boolean }> => {
    // Also registered via loyalty/coupons or campaigns
    const payload = {
      title: values.couponName,
      purpose: values.description || "Promotional Discount Coupon",
      audienceSegment: "all",
      templateId: "tmpl-promo",
      couponCode: values.couponCode,
    };
    await apiClient.post("/whatsapp/campaigns", payload);
    return { success: true };
  },

  launchCampaign: async (values: NewCampaignFormValues): Promise<{ success: boolean }> => {
    const payload = {
      title: values.title,
      purpose: values.purpose,
      audienceSegment: values.audienceSegment,
      templateId: values.templateId || "tmpl-promo",
      couponCode: values.couponCode,
    };
    await apiClient.post("/whatsapp/campaigns", payload);
    return { success: true };
  },

  fetchTemplates: async (): Promise<TemplateItem[]> => {
    const res = await apiClient.get<TemplateItem[]>("/whatsapp/templates");
    return Array.isArray(res) ? res : [];
  },

  fetchAutomations: async (): Promise<AutomatedMessageRule[]> => {
    const res = await apiClient.get<AutomatedMessageRule[]>("/whatsapp/automations");
    return Array.isArray(res) ? res : [];
  },

  toggleAutomation: async (
    ruleId: string,
    enabled: boolean
  ): Promise<{ success: boolean }> => {
    await apiClient.patch(`/whatsapp/automations/${ruleId}/toggle`, { enabled });
    return { success: true };
  },

  fetchConnectionSettings: async (): Promise<ConnectionConsentConfig> => {
    const res = await apiClient.get<ConnectionConsentConfig>("/whatsapp/connection");
    return {
      phoneNumberId: res?.phoneNumberId || "",
      businessDisplayName: res?.businessDisplayName || getActiveStoreName("Retail Boutique"),
      googleReviewLink: res?.googleReviewLink || "https://g.page/r/example",
      isApiEnabled: res?.isApiEnabled ?? true,
      requireExplicitOptIn: res?.requireExplicitOptIn ?? true,
      enforceQuietHours: res?.enforceQuietHours ?? true,
      autoUnsubscribeKeyword: res?.autoUnsubscribeKeyword ?? true,
    };
  },

  saveConnectionSettings: async (
    config: ConnectionConsentConfig
  ): Promise<{ success: boolean }> => {
    await apiClient.patch("/whatsapp/connection", config);
    return { success: true };
  },
};
