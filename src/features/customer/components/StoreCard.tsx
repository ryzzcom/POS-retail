"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Award, MapPin, ArrowRight, ShieldCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPKR } from "@/lib/formatters";
import type { CustomerStore, StoreMembership } from "../types/customer.types";

interface StoreCardProps {
  store: CustomerStore;
  membership?: StoreMembership;
}

export function StoreCard({ store, membership }: StoreCardProps) {
  const credits = membership?.tryOnCredits ?? store.tryOnSignupCredits ?? 5;
  const points = membership?.loyaltyPoints ?? 0;
  const khata = membership?.khataBalance ?? 0;

  return (
    <div className="bg-card rounded-[20px] border border-default/60 p-5 sm:p-6 shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between gap-5 group">
      <div className="space-y-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="neutral" className="text-[11px] font-sans">
            {store.storeCategory || "Fashion Boutique"}
          </Badge>

          {membership ? (
            <Badge variant="success" className="text-[11px] flex items-center gap-1">
              <ShieldCheck className="size-3" />
              Connected
            </Badge>
          ) : (
            <Badge variant="warning" className="text-[11px]">
              +{store.tryOnSignupCredits || 5} Free Tries
            </Badge>
          )}
        </div>

        {/* Store Title & Tagline */}
        <div>
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-[14px] bg-primary text-theme flex items-center justify-center font-heading font-bold text-lg shrink-0">
              {store.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-heading font-semibold text-heading text-lg sm:text-xl group-hover:text-primary transition-colors">
                {store.name}
              </h3>
              <p className="text-xs text-body font-sans line-clamp-1">
                {store.tagline || "Exclusive Luxury Apparel & Casual Pret"}
              </p>
            </div>
          </div>
        </div>

        {/* Location & Address */}
        <div className="flex items-center gap-1.5 text-xs text-body font-sans">
          <MapPin className="size-3.5 text-muted shrink-0" />
          <span className="truncate">{store.address || store.city || "Pakistan"}</span>
        </div>

        {/* User Balance Chips */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 rounded-[12px] bg-theme border border-default/50 flex flex-col">
            <span className="text-[11px] text-body flex items-center gap-1">
              <Sparkles className="size-3 text-accent" />
              Try-On Credits
            </span>
            <span className="font-heading font-semibold text-heading text-base mt-0.5">
              {credits}
            </span>
          </div>

          <div className="p-2.5 rounded-[12px] bg-theme border border-default/50 flex flex-col">
            <span className="text-[11px] text-body flex items-center gap-1">
              <Award className="size-3 text-status-warning" />
              Loyalty Points
            </span>
            <span className="font-heading font-semibold text-heading text-base mt-0.5">
              {points}
            </span>
          </div>
        </div>

        {khata > 0 && (
          <div className="p-2.5 rounded-[12px] bg-status-warning-bg border border-status-warning/30 flex items-center justify-between text-xs">
            <span className="text-status-warning font-medium flex items-center gap-1">
              <CreditCard className="size-3.5" />
              Khata Due Balance:
            </span>
            <span className="font-heading font-semibold text-status-warning">
              {formatPKR(khata)}
            </span>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <Link href={`/customer/${store.slug}`}>
        <Button variant="primary" className="w-full h-11 justify-between group-hover:shadow-sm">
          <span>Enter Boutique</span>
          <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </Link>
    </div>
  );
}
