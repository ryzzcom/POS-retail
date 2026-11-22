"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ShoppingBag, User, LogOut, Store as StoreIcon, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCustomerAuth } from "../hooks/useCustomerAuth";
import { CustomerLoginModal } from "./CustomerLoginModal";
import type { CustomerStore } from "../types/customer.types";

interface CustomerHeaderProps {
  currentStore?: CustomerStore | null;
  activeSlug?: string;
}

export function CustomerHeader({ currentStore, activeSlug }: CustomerHeaderProps) {
  const { user, memberships, isAuthenticated, logout } = useCustomerAuth();
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);

  // Find membership for current store
  const activeMembership = React.useMemo(() => {
    if (!activeSlug || !memberships.length) return null;
    return memberships.find((m) => m.storeSlug === activeSlug);
  }, [activeSlug, memberships]);

  const displayName = currentStore?.name || "Boutique Experience";
  const displayTagline = currentStore?.tagline || "Curated Fashion & AI Try-On Studio";

  return (
    <>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-default/50 px-4 py-3 sm:py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Brand & Store Name */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={activeSlug ? `/customer/${activeSlug}` : "/customer"}
              className="size-9 sm:size-10 rounded-[12px] bg-primary text-theme flex items-center justify-center font-heading font-bold text-base sm:text-lg shrink-0 shadow-xs"
            >
              {displayName.charAt(0)}
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  href={activeSlug ? `/customer/${activeSlug}` : "/customer"}
                  className="font-heading font-semibold text-heading text-sm sm:text-base truncate hover:underline"
                >
                  {displayName}
                </Link>
                {activeSlug && (
                  <Link
                    href="/customer"
                    className="inline-flex items-center gap-1 text-[11px] font-sans text-body hover:text-heading px-1.5 py-0.5 rounded-[6px] bg-subtle/50 transition-colors shrink-0"
                    title="Switch boutique"
                  >
                    <StoreIcon className="size-3" />
                    <span>All Shops</span>
                  </Link>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-body font-sans truncate">
                {displayTagline}
              </p>
            </div>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Store Credits & Points Pill */}
                {activeMembership ? (
                  <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-theme border border-default/60 text-xs">
                    <span className="flex items-center gap-1 font-medium text-heading">
                      <Sparkles className="size-3.5 text-accent" />
                      {activeMembership.tryOnCredits} Credits
                    </span>
                    <span className="text-muted">·</span>
                    <span className="flex items-center gap-1 text-body">
                      <Award className="size-3 text-status-warning" />
                      {activeMembership.loyaltyPoints} Pts
                    </span>
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-[10px] bg-theme border border-default/60 text-xs text-body">
                    <Sparkles className="size-3.5 text-accent" />
                    <span>Universal Account</span>
                  </div>
                )}

                <Link
                  href="/customer/receipts"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] bg-subtle hover:bg-subtle/80 text-heading text-xs font-medium transition-colors"
                >
                  <User className="size-3.5" />
                  <span className="hidden sm:inline">
                    {user?.fullName || user?.phoneNumber}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 rounded-[8px] text-body hover:text-status-error transition-colors"
                  title="Log out"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsLoginOpen(true)}
                className="text-xs h-8 sm:h-9"
              >
                <Sparkles className="size-3.5 mr-1 text-accent" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <CustomerLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        activeStore={currentStore}
      />
    </>
  );
}
