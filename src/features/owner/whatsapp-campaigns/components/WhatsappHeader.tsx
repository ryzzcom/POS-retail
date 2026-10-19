"use client";

import * as React from "react";
import {
  MessageSquare,
  Megaphone,
  FileText,
  Sliders,
  Power,
  Coins,
  Plus,
  Download,
  Tag,
} from "lucide-react";
import { PageHeader } from "@/components/layouts/PageHeader";
import { UnderlineTabs, UnderlineTabItem } from "@/components/ui/underline-tabs";
import { Button } from "@/components/ui/button";
import { WhatsappTabId } from "../types/whatsapp-campaigns.types";

interface WhatsappHeaderProps {
  activeTab: WhatsappTabId;
  onTabChange: (tab: WhatsappTabId) => void;
  onOpenNewCampaign: () => void;
  onOpenNewCoupon: () => void;
  onOpenNewTemplate: () => void;
  onOpenTopUp: () => void;
  onExportLogs: () => void;
}

const TABS: UnderlineTabItem<WhatsappTabId>[] = [
  { id: "log", label: "Message log", icon: MessageSquare },
  { id: "campaigns", label: "Campaigns", icon: Megaphone },
  { id: "templates", label: "Templates", icon: FileText },
  { id: "automated", label: "Automated Messages", icon: Sliders },
  { id: "connection", label: "Connection & consent", icon: Power },
  { id: "credits", label: "Credits & Usage", icon: Coins },
];

export function WhatsappHeader({
  activeTab,
  onTabChange,
  onOpenNewCampaign,
  onOpenNewCoupon,
  onOpenNewTemplate,
  onOpenTopUp,
  onExportLogs,
}: WhatsappHeaderProps) {
  return (
    <div className="w-full flex flex-col gap-5 select-none">
      <PageHeader
        title="WhatsApp & Campaigns"
        description={
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-medium text-heading">
              <span className="inline-block w-2 h-2 rounded-full bg-status-success animate-pulse" />
              Connected
            </span>
            <span className="text-muted">·</span>
            <span className="text-body">Cloud API sandbox</span>
            <span className="text-muted">·</span>
            <span className="text-body">0 queued</span>
            <span className="text-muted">·</span>
            <span className="inline-flex items-center font-medium text-status-error">
              1 failed
            </span>
          </div>
        }
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            {activeTab === "log" && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExportLogs}
                className="gap-2 font-medium"
              >
                <Download className="w-4 h-4 text-body" />
                <span>Export CSV</span>
              </Button>
            )}

            {activeTab === "campaigns" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenNewCoupon}
                  className="gap-2 font-medium"
                >
                  <Tag className="w-4 h-4 text-body" />
                  <span>+ New Coupon</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenNewCampaign}
                  className="gap-2 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Campaigns</span>
                </Button>
              </>
            )}

            {activeTab === "templates" && (
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenNewTemplate}
                className="gap-2 font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>New Template</span>
              </Button>
            )}

            {activeTab === "credits" && (
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenTopUp}
                className="gap-2 font-medium"
              >
                <Coins className="w-4 h-4" />
                <span>Top up credits</span>
              </Button>
            )}
          </div>
        }
      />

      {/* 6 Tabs Underline Strip */}
      <UnderlineTabs<WhatsappTabId>
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={onTabChange}
        aria-label="WhatsApp and Campaign modules"
      />
    </div>
  );
}
