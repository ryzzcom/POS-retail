"use client";

import * as React from "react";
import {
  TemplateItem,
  CreditPack,
} from "../types/whatsapp-campaigns.types";
import {
  MOCK_USAGE_BREAKDOWN,
  MOCK_CREDIT_PACKS,
} from "../constants/whatsapp-mock";
import { useWhatsappCampaigns } from "../hooks/useWhatsappCampaigns";
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
import { Loader2 } from "lucide-react";

export function WhatsappCampaignsView() {
  const {
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
    handleSaveTemplate,
  } = useWhatsappCampaigns();

  const handleEditTemplate = (template: TemplateItem) => {
    setEditingTemplate(template);
    setIsTemplateEditorOpen(true);
  };

  const handleSendTestMessage = (template: TemplateItem, phone: string) => {
    // Handled visually or through API
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl border border-default">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm font-medium text-body">Loading WhatsApp campaigns & logs...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-status-error-bg text-status-error rounded-2xl border border-status-error text-center">
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <>
          {/* 2. Active Tab Content View */}
          {activeTab === "log" && (
            <MessageLogTab
              logs={logs}
              onRetryMessage={handleRetryMessage}
              onSelectMessage={() => {}}
            />
          )}

          {activeTab === "campaigns" && (
            <CampaignsTab
              campaigns={campaigns}
              onOpenNewCampaign={() => setIsCampaignModalOpen(true)}
              onOpenNewCoupon={() => setIsCouponModalOpen(true)}
              onSelectCampaign={() => {
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
              onConfigureRule={() => {}}
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
        </>
      )}

      {/* 3. Modals */}
      {/* A. Create New POS Coupon Modal */}
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
