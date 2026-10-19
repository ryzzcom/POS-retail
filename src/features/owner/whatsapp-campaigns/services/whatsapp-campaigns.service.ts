import {
  MessageLogItem,
  CampaignItem,
  TemplateItem,
  ConnectionConsentConfig,
} from "../types/whatsapp-campaigns.types";
import {
  NewCouponFormValues,
  NewCampaignFormValues,
} from "../schemas/whatsapp-campaigns.schemas";

export const whatsappCampaignsService = {
  fetchMessageLogs: async (): Promise<MessageLogItem[]> => {
    return Promise.resolve([]);
  },

  retryMessage: async (logId: string): Promise<{ success: boolean }> => {
    return Promise.resolve({ success: true });
  },

  fetchCampaigns: async (): Promise<CampaignItem[]> => {
    return Promise.resolve([]);
  },

  createCoupon: async (values: NewCouponFormValues): Promise<{ success: boolean }> => {
    return Promise.resolve({ success: true });
  },

  launchCampaign: async (values: NewCampaignFormValues): Promise<{ success: boolean }> => {
    return Promise.resolve({ success: true });
  },

  fetchTemplates: async (): Promise<TemplateItem[]> => {
    return Promise.resolve([]);
  },

  saveConnectionSettings: async (config: ConnectionConsentConfig): Promise<{ success: boolean }> => {
    return Promise.resolve({ success: true });
  },
};
