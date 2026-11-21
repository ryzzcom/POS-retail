"use client";

import * as React from "react";
import {
  WhatsappTabId,
  MessageLogItem,
  CampaignItem,
  TemplateItem,
  AutomatedMessageRule,
  ConnectionConsentConfig,
  CreditPack,
  WhatsAppMetricsSummary,
} from "../types/whatsapp-campaigns.types";
import {
  MOCK_CONNECTION_CONFIG,
  MOCK_METRICS,
} from "../constants/whatsapp-mock";
import { whatsappCampaignsService } from "../services/whatsapp-campaigns.service";
import { exportToCsv } from "@/lib/export";
import {
  NewCouponFormValues,
  NewCampaignFormValues,
} from "../schemas/whatsapp-campaigns.schemas";

export function useWhatsappCampaigns() {
  const [activeTab, setActiveTab] = React.useState<WhatsappTabId>("log");
  const [logs, setLogs] = React.useState<MessageLogItem[]>([]);
  const [campaigns, setCampaigns] = React.useState<CampaignItem[]>([]);
  const [templates, setTemplates] = React.useState<TemplateItem[]>([]);
  const [rules, setRules] = React.useState<AutomatedMessageRule[]>([]);
  const [connectionConfig, setConnectionConfig] = React.useState<ConnectionConsentConfig>(
    MOCK_CONNECTION_CONFIG
  );
  const [metrics, setMetrics] = React.useState<WhatsAppMetricsSummary>(MOCK_METRICS);

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [notification, setNotification] = React.useState<string | null>(null);

  // Modals & Drawers State
  const [isCouponModalOpen, setIsCouponModalOpen] = React.useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = React.useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = React.useState(false);
  const [selectedTopUpPack, setSelectedTopUpPack] = React.useState<CreditPack | null>(null);
  const [editingTemplate, setEditingTemplate] = React.useState<TemplateItem | null>(null);
  const [isTemplateEditorOpen, setIsTemplateEditorOpen] = React.useState(false);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [overviewData, logsData, campaignsData, templatesData, automationsData, connectionData] =
        await Promise.all([
          whatsappCampaignsService.fetchOverview(),
          whatsappCampaignsService.fetchMessageLogs(),
          whatsappCampaignsService.fetchCampaigns(),
          whatsappCampaignsService.fetchTemplates(),
          whatsappCampaignsService.fetchAutomations(),
          whatsappCampaignsService.fetchConnectionSettings(),
        ]);

      setMetrics(overviewData.metrics);
      setLogs(logsData);
      setCampaigns(campaignsData);
      setTemplates(templatesData);
      setRules(automationsData);
      setConnectionConfig(connectionData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load WhatsApp data";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // 1. Retry Message Log Handler
  const handleRetryMessage = async (logId: string) => {
    try {
      await whatsappCampaignsService.retryMessage(logId);
      showNotification("Message successfully requeued and delivered to customer.");
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend message";
      showNotification(`Error: ${msg}`);
    }
  };

  // 2. Export Logs to CSV
  const handleExportLogs = () => {
    const headers = [
      "Customer Name",
      "Phone Number",
      "Receipt / Order Ref",
      "Template",
      "Message Preview",
      "Status",
      "Category",
      "Timestamp",
    ];

    const rows = logs.map((l) => [
      l.customerName,
      l.customerPhone,
      l.receiptRef,
      l.templateName,
      l.message,
      l.status,
      l.category,
      l.updatedAt,
    ]);

    exportToCsv(`whatsapp_message_logs_${Date.now()}`, headers, rows);
    showNotification("WhatsApp message log successfully exported to CSV.");
  };

  // 3. New Coupon Submission
  const handleCreateCoupon = async (values: NewCouponFormValues) => {
    try {
      await whatsappCampaignsService.createCoupon(values);
      showNotification(
        `Coupon ${values.couponCode} (${values.couponName}) created successfully.`
      );
      setIsCouponModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create coupon";
      showNotification(`Error: ${msg}`);
    }
  };

  // 4. New Campaign Launch Submission
  const handleLaunchCampaign = async (values: NewCampaignFormValues) => {
    try {
      await whatsappCampaignsService.launchCampaign(values);
      showNotification(`Campaign "${values.title}" launched successfully!`);
      setIsCampaignModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to launch campaign";
      showNotification(`Error: ${msg}`);
    }
  };

  // 5. Toggle Automated Rules
  const handleToggleRule = async (ruleId: string, enabled: boolean) => {
    try {
      await whatsappCampaignsService.toggleAutomation(ruleId, enabled);
      setRules((prev) =>
        prev.map((r) => (r.id === ruleId ? { ...r, enabled } : r))
      );
      const target = rules.find((r) => r.id === ruleId);
      showNotification(
        `Automated rule "${target?.title}" ${enabled ? "activated" : "paused"}.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to toggle rule";
      showNotification(`Error: ${msg}`);
    }
  };

  // 6. Save Connection Settings
  const handleSaveConnection = async (newConfig: ConnectionConsentConfig) => {
    try {
      await whatsappCampaignsService.saveConnectionSettings(newConfig);
      setConnectionConfig(newConfig);
      showNotification("WhatsApp Business Cloud API connection settings saved.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save connection settings";
      showNotification(`Error: ${msg}`);
    }
  };

  // 7. Buy Credit Pack
  const handleOpenBuyPack = (pack: CreditPack) => {
    setSelectedTopUpPack(pack);
    setIsTopUpModalOpen(true);
  };

  const handleConfirmTopUp = () => {
    if (!selectedTopUpPack) return;
    setMetrics((prev) => ({
      ...prev,
      availableCredits: prev.availableCredits + selectedTopUpPack.credits,
      purchasedCredits: prev.purchasedCredits + selectedTopUpPack.credits,
    }));
    setIsTopUpModalOpen(false);
    showNotification(
      `Top-up successful! Added ${selectedTopUpPack.credits} WhatsApp credits.`
    );
  };

  // 8. Template Actions
  const handleOpenTemplateEditor = (template?: TemplateItem) => {
    setEditingTemplate(template || null);
    setIsTemplateEditorOpen(true);
  };

  const handleSaveTemplate = (updated: TemplateItem) => {
    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      showNotification(`Template "${updated.name}" updated successfully.`);
    } else {
      setTemplates((prev) => [updated, ...prev]);
      showNotification(`Template "${updated.name}" submitted for Meta review.`);
    }
    setIsTemplateEditorOpen(false);
  };

  return {
    activeTab,
    setActiveTab,
    logs,
    campaigns,
    templates,
    rules,
    connectionConfig,
    metrics,
    isLoading,
    error,
    notification,
    isCouponModalOpen,
    setIsCouponModalOpen,
    isCampaignModalOpen,
    setIsCampaignModalOpen,
    isTopUpModalOpen,
    setIsTopUpModalOpen,
    selectedTopUpPack,
    setSelectedTopUpPack,
    editingTemplate,
    setEditingTemplate,
    isTemplateEditorOpen,
    setIsTemplateEditorOpen,
    handleRetryMessage,
    handleExportLogs,
    handleCreateCoupon,
    handleLaunchCampaign,
    handleToggleRule,
    handleSaveConnection,
    handleOpenBuyPack,
    handleConfirmTopUp,
    handleOpenTemplateEditor,
    handleSaveTemplate,
    refreshData: loadData,
  };
}
