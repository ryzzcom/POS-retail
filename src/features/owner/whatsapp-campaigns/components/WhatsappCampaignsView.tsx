"use client";

import * as React from "react";
import { exportToCsv } from "@/lib/export";
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
  MOCK_MESSAGE_LOGS,
  MOCK_CAMPAIGNS,
  MOCK_TEMPLATES,
  MOCK_AUTOMATED_RULES,
  MOCK_CONNECTION_CONFIG,
  MOCK_METRICS,
  MOCK_USAGE_BREAKDOWN,
  MOCK_CREDIT_PACKS,
} from "../constants/whatsapp-mock";
import {
  NewCouponFormValues,
  NewCampaignFormValues,
} from "../schemas/whatsapp-campaigns.schemas";
import { WhatsappHeader } from "./WhatsappHeader";
import { MessageLogTab } from "./MessageLogTab";
import { CampaignsTab } from "./CampaignsTab";
import { TemplatesTab } from "./TemplatesTab";
import { AutomatedMessagesTab } from "./AutomatedMessagesTab";
import { ConnectionConsentTab } from "./ConnectionConsentTab";
import { CreditsUsageTab } from "./CreditsUsageTab";
import { NewCouponModal } from "./NewCouponModal";
import { NewCampaignModal } from "./NewCampaignModal";
import { TemplateEditorModal } from "./TemplateEditorModal";
import { TopUpModal } from "./TopUpModal";

export function WhatsappCampaignsView() {
  const [activeTab, setActiveTab] = React.useState<WhatsappTabId>("log");
  const [notification, setNotification] = React.useState<string | null>(null);

  // Core Data State
  const [logs, setLogs] = React.useState<MessageLogItem[]>(MOCK_MESSAGE_LOGS);
  const [campaigns, setCampaigns] = React.useState<CampaignItem[]>(MOCK_CAMPAIGNS);
  const [templates, setTemplates] = React.useState<TemplateItem[]>(MOCK_TEMPLATES);
  const [rules, setRules] = React.useState<AutomatedMessageRule[]>(MOCK_AUTOMATED_RULES);
  const [connectionConfig, setConnectionConfig] = React.useState<ConnectionConsentConfig>(
    MOCK_CONNECTION_CONFIG
  );
  const [metrics, setMetrics] = React.useState<WhatsAppMetricsSummary>(MOCK_METRICS);

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

  // 1. Retry Message Log Handler
  const handleRetryMessage = (logId: string) => {
    setLogs((prev) =>
      prev.map((item) =>
        item.id === logId
          ? {
              ...item,
              status: "delivered",
              updatedAt: "Just now",
              failureReason: undefined,
            }
          : item
      )
    );
    setMetrics((prev) => ({
      ...prev,
      failedCount: Math.max(0, prev.failedCount - 1),
    }));
    showNotification("Message successfully requeued and delivered to customer.");
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
  const handleCreateCoupon = (values: NewCouponFormValues) => {
    const newCouponCampaign: CampaignItem = {
      id: `cmp-${Date.now()}`,
      title: values.couponName,
      purpose: values.description || "POS Promotional Discount Coupon",
      couponCode: values.couponCode,
      discount:
        values.discountType === "percentage"
          ? `${values.discountValue}% Off`
          : `Rs. ${values.discountValue.toLocaleString()} Flat`,
      validity: `${values.startsDate} – ${values.endDate}`,
      messagesSent: 0,
      posRedeemed: 0,
      status: "Active",
      audienceSegment: "All Active Customers",
      templateName: "Promotional Discount & Coupon Offer",
    };

    setCampaigns((prev) => [newCouponCampaign, ...prev]);
    showNotification(
      `Coupon ${values.couponCode} (${values.couponName}) created successfully.`
    );
  };

  // 4. New Campaign Launch Submission
  const handleLaunchCampaign = (values: NewCampaignFormValues) => {
    const audienceCount =
      values.audienceSegment === "vip_tier"
        ? 100
        : values.audienceSegment === "khata_overdue"
        ? 42
        : values.audienceSegment === "inactive_60"
        ? 210
        : 450;

    const newCampaign: CampaignItem = {
      id: `cmp-${Date.now()}`,
      title: values.title,
      purpose: values.purpose,
      couponCode: values.couponCode || "DIRECT",
      discount: "Promotional",
      validity: "Today – 30 Days",
      messagesSent: audienceCount,
      posRedeemed: 0,
      status: "Active",
      audienceSegment: values.audienceSegment,
      templateName: "Broadcast Campaign",
    };

    setCampaigns((prev) => [newCampaign, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      availableCredits: Math.max(0, prev.availableCredits - audienceCount),
    }));

    showNotification(
      `Campaign "${values.title}" launched! ${audienceCount} WhatsApp messages sent.`
    );
  };

  // 5. Toggle Automated Rules
  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled } : r))
    );
    const target = rules.find((r) => r.id === ruleId);
    showNotification(
      `Automated rule "${target?.title}" ${enabled ? "activated" : "paused"}.`
    );
  };

  // 6. Save Connection Settings
  const handleSaveConnection = (newConfig: ConnectionConsentConfig) => {
    setConnectionConfig(newConfig);
    showNotification("WhatsApp Business Cloud API connection settings saved.");
  };

  // 7. Buy Credit Pack
  const handleOpenBuyPack = (pack: CreditPack) => {
    setSelectedTopUpPack(pack);
    setIsTopUpModalOpen(true);
  };

  const handleConfirmTopUp = (pack: CreditPack) => {
    setMetrics((prev) => ({
      ...prev,
      availableCredits: prev.availableCredits + pack.credits,
      purchasedCredits: prev.purchasedCredits + pack.credits,
    }));
    showNotification(
      `${pack.credits.toLocaleString()} credits added to your WhatsApp pool!`
    );
  };

  // 8. Template Edit & Test
  const handleEditTemplate = (template: TemplateItem) => {
    setEditingTemplate(template);
    setIsTemplateEditorOpen(true);
  };

  const handleSaveTemplate = (updated: TemplateItem) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    showNotification(`Template "${updated.name}" updated successfully.`);
  };

  const handleSendTestMessage = (template: TemplateItem, phone: string) => {
    showNotification(`Test message for "${template.name}" sent to ${phone}.`);
  };

  // Available Coupons for Campaign Linking
  const availableCouponOptions = React.useMemo(() => {
    return campaigns
      .filter((c) => c.status === "Active")
      .map((c) => ({
        label: `${c.couponCode} — ${c.discount} (${c.title})`,
        value: c.couponCode,
      }));
  }, [campaigns]);

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-8 pb-6 animate-in fade-in-50 duration-200 select-none">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-dark-primary px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-sans flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <span>✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Header with Title, Status & 6 Underline Tabs */}
      <WhatsappHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenNewCampaign={() => setIsCampaignModalOpen(true)}
        onOpenNewCoupon={() => setIsCouponModalOpen(true)}
        onOpenNewTemplate={() => {
          setEditingTemplate(templates[0]);
          setIsTemplateEditorOpen(true);
        }}
        onOpenTopUp={() => handleOpenBuyPack(MOCK_CREDIT_PACKS[1])}
        onExportLogs={handleExportLogs}
      />

      {/* 2. Active Tab Content View */}
      {activeTab === "log" && (
        <MessageLogTab
          logs={logs}
          onRetryMessage={handleRetryMessage}
          onSelectMessage={(msg) => showNotification(`Message ID: ${msg.receiptRef}`)}
        />
      )}

      {activeTab === "campaigns" && (
        <CampaignsTab
          campaigns={campaigns}
          onOpenNewCampaign={() => setIsCampaignModalOpen(true)}
          onOpenNewCoupon={() => setIsCouponModalOpen(true)}
          onSelectCampaign={(c) => {
            setIsCampaignModalOpen(true);
          }}
        />
      )}

      {activeTab === "templates" && (
        <TemplatesTab
          templates={templates}
          onOpenNewTemplate={() => {
            setEditingTemplate(templates[0]);
            setIsTemplateEditorOpen(true);
          }}
          onEditTemplate={handleEditTemplate}
          onTestTemplate={(tpl) => handleSendTestMessage(tpl, "+92 300 4819201")}
        />
      )}

      {activeTab === "automated" && (
        <AutomatedMessagesTab
          rules={rules}
          onToggleRule={handleToggleRule}
          onConfigureRule={(rule) =>
            showNotification(`Configuration options for "${rule.title}"`)
          }
        />
      )}

      {activeTab === "connection" && (
        <ConnectionConsentTab
          initialConfig={connectionConfig}
          onSaveConfig={handleSaveConnection}
          onCancel={() => setActiveTab("log")}
        />
      )}

      {activeTab === "credits" && (
        <CreditsUsageTab
          metrics={metrics}
          breakdown={MOCK_USAGE_BREAKDOWN}
          creditPacks={MOCK_CREDIT_PACKS}
          onBuyPack={handleOpenBuyPack}
        />
      )}

      {/* 3. Modals */}
      {/* A. Create New POS Coupon Modal (Figma Node 3468:52756) */}
      <NewCouponModal
        open={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        onSubmitCoupon={handleCreateCoupon}
      />

      {/* B. Create New Campaign Modal */}
      <NewCampaignModal
        open={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        availableCredits={metrics.availableCredits}
        availableCoupons={availableCouponOptions}
        onSubmitCampaign={handleLaunchCampaign}
      />

      {/* C. Template Editor / Preview Modal */}
      <TemplateEditorModal
        open={isTemplateEditorOpen}
        onClose={() => setIsTemplateEditorOpen(false)}
        template={editingTemplate}
        onSaveTemplate={handleSaveTemplate}
        onSendTest={handleSendTestMessage}
      />

      {/* D. Buy Credits Top-Up Modal */}
      <TopUpModal
        open={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        pack={selectedTopUpPack}
        onConfirmPurchase={handleConfirmTopUp}
      />
    </div>
  );
}
