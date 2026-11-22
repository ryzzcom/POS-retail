"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Store as StoreIcon,
  Award,
  Search,
  Gift,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { CustomerHeader } from "@/features/customer/components/CustomerHeader";
import { StoreCard } from "@/features/customer/components/StoreCard";
import { customerService } from "@/features/customer/services/customer.service";
import { useCustomerAuth } from "@/features/customer/hooks/useCustomerAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CustomerStore } from "@/features/customer/types/customer.types";

export default function CustomerHubPage() {
  const { user, memberships, isAuthenticated } = useCustomerAuth();
  const [stores, setStores] = React.useState<CustomerStore[]>([]);
  const [search, setSearch] = React.useState("");
  const [giftCodeInput, setGiftCodeInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStores() {
      try {
        setIsLoading(true);
        const data = await customerService.getStores();
        setStores(data);
      } catch (err) {
        console.error("Failed to load stores", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStores();
  }, []);

  const filteredStores = React.useMemo(() => {
    if (!search.trim()) return stores;
    const q = search.toLowerCase();
    return stores.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.tagline && s.tagline.toLowerCase().includes(q)) ||
        (s.city && s.city.toLowerCase().includes(q))
    );
  }, [stores, search]);

  const totalPoints = React.useMemo(
    () => memberships.reduce((acc, m) => acc + (m.loyaltyPoints || 0), 0),
    [memberships]
  );

  const totalCredits = React.useMemo(
    () => memberships.reduce((acc, m) => acc + (m.tryOnCredits || 0), 0),
    [memberships]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />

      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 w-full space-y-6 sm:space-y-8">
        {/* Hero Banner: Universal Customer Account */}
        <div className="relative rounded-[24px] bg-gradient-to-br from-primary via-[#243329] to-[#141d17] text-dark-primary p-6 sm:p-8 overflow-hidden shadow-lg border border-border-dark">
          {/* Subtle Ambient Background Accent */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-theme/10 border border-theme/20 text-xs font-medium text-dark-secondary">
              <Sparkles className="size-3.5 text-accent" />
              <span>Universal Fashion Identity · Multi-Boutique Network</span>
            </div>

            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-dark-primary tracking-tight">
              {isAuthenticated && user?.fullName
                ? `Welcome back, ${user.fullName}`
                : "Shop, Try On & Connect Across Pakistan's Finest Boutiques"}
            </h1>

            <p className="text-xs sm:text-sm text-dark-secondary font-sans leading-relaxed">
              One account connects you to independent designer fashion stores. Earn per-boutique
              loyalty points, simulate outfits virtually with AI, and collect electronic receipts.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-3">
              <div className="p-3 rounded-[14px] bg-theme/10 border border-theme/15 flex flex-col">
                <span className="text-[11px] text-dark-secondary flex items-center gap-1">
                  <StoreIcon className="size-3 text-accent" />
                  Connected Shops
                </span>
                <span className="font-heading font-bold text-dark-primary text-lg sm:text-xl mt-0.5">
                  {memberships.length}
                </span>
              </div>

              <div className="p-3 rounded-[14px] bg-theme/10 border border-theme/15 flex flex-col">
                <span className="text-[11px] text-dark-secondary flex items-center gap-1">
                  <Sparkles className="size-3 text-accent" />
                  Try-On Credits
                </span>
                <span className="font-heading font-bold text-dark-primary text-lg sm:text-xl mt-0.5">
                  {isAuthenticated ? totalCredits : "5 Free"}
                </span>
              </div>

              <div className="p-3 rounded-[14px] bg-theme/10 border border-theme/15 flex flex-col">
                <span className="text-[11px] text-dark-secondary flex items-center gap-1">
                  <Award className="size-3 text-status-warning" />
                  Loyalty Points
                </span>
                <span className="font-heading font-bold text-dark-primary text-lg sm:text-xl mt-0.5">
                  {totalPoints}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Gift Code Lookup Bar */}
        <div className="p-4 sm:p-5 rounded-[18px] bg-card border border-default/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-[12px] bg-status-warning-bg border border-status-warning/30 flex items-center justify-center text-status-warning shrink-0">
              <Gift className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-heading text-sm sm:text-base">
                Have a Secret Gift Code?
              </h3>
              <p className="text-xs text-body font-sans">
                Unbox a surprise garment sent by a friend without seeing their purchase price.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="e.g. GIFT-9X2A-44"
              value={giftCodeInput}
              onChange={(e) => setGiftCodeInput(e.target.value.toUpperCase())}
              className="px-3 py-2 rounded-[10px] bg-theme border border-default/70 text-xs font-mono uppercase text-heading focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-44"
            />
            {giftCodeInput.trim() ? (
              <Link href={`/customer/gifts/${giftCodeInput.trim()}`}>
                <Button variant="primary" size="sm" className="h-9 whitespace-nowrap text-xs">
                  Unbox Gift
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled className="h-9 whitespace-nowrap text-xs">
                Unbox Gift
              </Button>
            )}
          </div>
        </div>

        {/* Boutiques Directory Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-bold text-heading text-xl sm:text-2xl">
                Boutiques on Platform
              </h2>
              <p className="text-xs text-body font-sans">
                Browse official brand stores, view catalogs, and try clothes on virtually.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="size-4 text-muted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search boutiques..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-[12px] bg-card border border-default/70 text-xs text-heading focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-[20px] bg-card border border-default/40 animate-pulse"
                />
              ))}
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-[20px] border border-default/50 space-y-2">
              <StoreIcon className="size-8 text-muted mx-auto" />
              <p className="font-heading font-medium text-heading text-sm">No boutiques matched</p>
              <p className="text-xs text-body">Try clearing your search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStores.map((store) => {
                const mem = memberships.find((m) => m.storeSlug === store.slug);
                return <StoreCard key={store.id} store={store} membership={mem} />;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
