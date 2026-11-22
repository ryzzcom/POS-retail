"use client";

import * as React from "react";
import Link from "next/link";
import {
  Receipt,
  Sparkles,
  Award,
  CreditCard,
  Calendar,
  Store,
  ChevronRight,
  ShieldCheck,
  Phone,
  ArrowRight,
} from "lucide-react";
import { CustomerHeader } from "@/features/customer/components/CustomerHeader";
import { DigitalReceiptDrawer } from "@/features/customer/components/DigitalReceiptDrawer";
import { CustomerLoginModal } from "@/features/customer/components/CustomerLoginModal";
import { customerService } from "@/features/customer/services/customer.service";
import { useCustomerAuth } from "@/features/customer/hooks/useCustomerAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPKR, formatDate } from "@/lib/formatters";
import type { DigitalReceipt, StoreMembership } from "@/features/customer/types/customer.types";

export default function ReceiptsPage() {
  const { user, memberships, isAuthenticated } = useCustomerAuth();
  const [receipts, setReceipts] = React.useState<DigitalReceipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = React.useState<DigitalReceipt | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    async function loadReceipts() {
      try {
        setIsLoading(true);
        const data = await customerService.getDigitalReceipts();
        setReceipts(data);
      } catch (err) {
        console.error("Failed to load digital receipts", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadReceipts();
  }, [isAuthenticated]);

  const handleOpenReceipt = (r: DigitalReceipt) => {
    setSelectedReceipt(r);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 w-full space-y-6 sm:space-y-8">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-[10px] bg-accent/20 text-accent">
                <Receipt className="size-5" />
              </span>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-heading">
                Digital Thermal Receipts & Khata
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-body font-sans mt-1">
              Your paperless receipts and store loyalty ledger across all independent boutiques.
            </p>
          </div>

          {!isAuthenticated && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowLoginModal(true)}
              className="text-xs h-9"
            >
              <Sparkles className="size-3.5 mr-1 text-accent" />
              Sign In to View Receipts
            </Button>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="text-center py-16 p-6 rounded-[24px] bg-card border border-default/60 shadow-xs space-y-4">
            <div className="size-16 rounded-[20px] bg-theme border border-default/60 flex items-center justify-center text-muted mx-auto">
              <Receipt className="size-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-heading text-lg sm:text-xl">
                Access Your Digital Receipts
              </h3>
              <p className="text-xs sm:text-sm text-body font-sans max-w-md mx-auto">
                Sign in with your mobile phone to view official thermal receipts, track Khata balances, and claim rewards.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowLoginModal(true)}
              className="h-11 text-xs"
            >
              Sign In with Mobile OTP
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Store Memberships & Balances Grid */}
            {memberships.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-heading font-semibold text-heading text-base">
                  Connected Boutiques & Rewards
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {memberships.map((mem) => (
                    <div
                      key={mem.storeId}
                      className="p-4 rounded-[18px] bg-card border border-default/60 space-y-3 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/customer/${mem.storeSlug}`}
                          className="font-heading font-semibold text-heading text-sm hover:underline truncate"
                        >
                          {mem.storeName}
                        </Link>
                        <Badge variant="neutral" className="text-[10px]">
                          {mem.totalOrdersCount} Orders
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-[10px] bg-theme border border-default/40">
                          <span className="text-[10px] text-body block">Try-On Credits</span>
                          <span className="font-heading font-bold text-heading mt-0.5 block">
                            {mem.tryOnCredits}
                          </span>
                        </div>
                        <div className="p-2 rounded-[10px] bg-theme border border-default/40">
                          <span className="text-[10px] text-body block">Loyalty Pts</span>
                          <span className="font-heading font-bold text-status-warning mt-0.5 block">
                            {mem.loyaltyPoints}
                          </span>
                        </div>
                      </div>

                      {mem.khataBalance > 0 && (
                        <div className="p-2.5 rounded-[10px] bg-status-warning-bg border border-status-warning/30 flex items-center justify-between text-xs">
                          <span className="text-status-warning font-medium">Khata Balance:</span>
                          <span className="font-heading font-bold text-status-warning">
                            {formatPKR(mem.khataBalance)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Receipts List */}
            <div className="space-y-3">
              <h3 className="font-heading font-semibold text-heading text-base">
                Recent Purchase Receipts ({receipts.length})
              </h3>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 rounded-[18px] bg-card border border-default/40 animate-pulse"
                    />
                  ))}
                </div>
              ) : receipts.length === 0 ? (
                <div className="text-center py-12 p-6 rounded-[20px] bg-card border border-default/50 space-y-2">
                  <Receipt className="size-8 text-muted mx-auto" />
                  <p className="font-heading font-medium text-heading text-sm">
                    No receipts found yet
                  </p>
                  <p className="text-xs text-body">
                    When you purchase at any partner boutique counter, your electronic receipt will appear here automatically!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {receipts.map((rec) => (
                    <div
                      key={rec.orderNumber}
                      onClick={() => handleOpenReceipt(rec)}
                      className="p-4 sm:p-5 rounded-[18px] bg-card border border-default/60 hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between gap-4 group shadow-xs"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="size-11 rounded-[14px] bg-theme border border-default/60 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                          <Receipt className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading font-semibold text-heading text-sm sm:text-base group-hover:text-primary transition-colors">
                              {rec.storeName}
                            </h4>
                            <span className="text-[11px] font-mono text-muted">
                              #{rec.orderNumber}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-body font-sans mt-0.5">
                            <span>{rec.date ? formatDate(rec.date) : "Recent"}</span>
                            <span>·</span>
                            <span>{rec.itemsCount} items</span>
                            <span>·</span>
                            <span className="capitalize">{rec.paymentMethod}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="font-heading font-bold text-heading text-base sm:text-lg block">
                            {formatPKR(rec.total)}
                          </span>
                          {rec.tryOnCreditsAwarded > 0 && (
                            <span className="text-[11px] text-accent font-medium flex items-center justify-end gap-0.5">
                              <Sparkles className="size-3" />
                              +{rec.tryOnCreditsAwarded} Credits
                            </span>
                          )}
                        </div>
                        <ChevronRight className="size-5 text-muted group-hover:text-heading group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <DigitalReceiptDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        receipt={selectedReceipt}
      />

      <CustomerLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
