"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Gift,
  Sparkles,
  MapPin,
  Lock,
  CheckCircle2,
  Calendar,
  Phone,
  ArrowRight,
  PackageOpen,
} from "lucide-react";
import { CustomerHeader } from "@/features/customer/components/CustomerHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { customerService } from "@/features/customer/services/customer.service";
import type { GiftOrder } from "@/features/customer/types/customer.types";

export default function GiftUnboxPage() {
  const params = useParams();
  const redemptionCode = params?.code as string;

  const [gift, setGift] = React.useState<GiftOrder | null>(null);
  const [isUnboxed, setIsUnboxed] = React.useState<boolean>(false);
  const [isClaimed, setIsClaimed] = React.useState<boolean>(false);
  const [deliveryAddress, setDeliveryAddress] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!redemptionCode) return;

    async function loadGift() {
      try {
        setIsLoading(true);
        const data = await customerService.getGiftByCode(redemptionCode);
        setGift(data);
        if (data.status === "CLAIMED") {
          setIsUnboxed(true);
          setIsClaimed(true);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gift code not found";
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
      }
    }

    loadGift();
  }, [redemptionCode]);

  const handleClaimGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gift) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await customerService.claimGift(gift.redemptionCode, deliveryAddress.trim() || undefined);
      setIsClaimed(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to claim gift";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />

      <div className="max-w-xl mx-auto px-4 py-8 w-full space-y-6">
        {isLoading ? (
          <div className="h-96 rounded-[24px] bg-card border border-default/40 animate-pulse" />
        ) : errorMessage || !gift ? (
          <div className="text-center py-16 p-6 rounded-[24px] bg-card border border-default/50 space-y-3">
            <Gift className="size-12 text-muted mx-auto" />
            <h2 className="font-heading font-bold text-heading text-lg">
              Gift Code Not Found
            </h2>
            <p className="text-xs text-body font-sans">
              Please double check the redemption code or contact the person who sent it.
            </p>
            <Link href="/customer">
              <Button variant="outline" size="sm" className="mt-2 text-xs">
                Go to Boutiques
              </Button>
            </Link>
          </div>
        ) : !isUnboxed ? (
          /* Step 1: Mystery Gift Box Ready for Unboxing */
          <div className="text-center py-12 p-6 sm:p-8 rounded-[28px] bg-card border border-default/60 shadow-lg space-y-5">
            <div className="relative size-24 mx-auto rounded-[20px] bg-status-warning-bg border border-status-warning/30 flex items-center justify-center text-status-warning animate-bounce">
              <Gift className="size-12" />
              <Sparkles className="size-5 text-accent absolute -top-1 -right-1 animate-pulse" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-muted font-sans font-medium">
                Surprise Fashion Gift
              </span>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-heading mt-1">
                You Have a Surprise Gift, {gift.recipientName}!
              </h1>
              <p className="text-xs sm:text-sm text-body font-sans max-w-md mx-auto mt-2 leading-relaxed">
                <strong>{gift.senderName}</strong> has sent you a curated luxury garment from{" "}
                <strong>{gift.storeName}</strong>.
              </p>
            </div>

            {/* Secret Pricing Banner */}
            <div className="p-3.5 rounded-[14px] bg-theme border border-default/50 flex items-center justify-center gap-2 text-xs text-body max-w-sm mx-auto">
              <Lock className="size-4 text-accent shrink-0" />
              <span>Secret Pricing: 100% price-free digital gift receipt</span>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => setIsUnboxed(true)}
              className="w-full max-w-sm h-12 text-sm shadow-md"
            >
              <PackageOpen className="size-4 mr-2" />
              Tap to Unbox Your Gift 🎁
            </Button>
          </div>
        ) : (
          /* Step 2: Unboxed Gift Card & Garment Reveal */
          <div className="rounded-[28px] bg-card border border-default/60 shadow-lg overflow-hidden space-y-5">
            {/* Top Unboxed Banner */}
            <div className="p-6 bg-gradient-to-r from-theme via-card to-theme border-b border-default/40 text-center space-y-1.5">
              <Badge variant="accent" className="text-[10px] font-sans">
                {gift.status === "CLAIMED" || isClaimed ? "Gift Claimed" : "Ready to Claim"}
              </Badge>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-heading">
                A Gift from {gift.senderName}
              </h2>
              <p className="text-xs text-body font-mono">Code: {gift.redemptionCode}</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Personal Greeting Card */}
              <div className="p-4 rounded-[16px] bg-theme border border-accent/25 space-y-1 relative">
                <span className="text-[10px] uppercase font-sans font-bold text-accent tracking-wider block">
                  Personal Message
                </span>
                <p className="text-xs sm:text-sm text-heading italic font-sans leading-relaxed">
                  &ldquo;{gift.giftMessage}&rdquo;
                </p>
                <span className="text-[11px] text-body block text-right font-medium">
                  — {gift.senderName}
                </span>
              </div>

              {/* Garment Details Card (NO PRICE ANYWHERE) */}
              <div className="p-4 rounded-[18px] bg-card border border-default/60 flex items-center gap-4">
                <div className="size-20 sm:size-24 rounded-[14px] overflow-hidden bg-subtle shrink-0">
                  {gift.productImage ? (
                    <img
                      src={gift.productImage}
                      alt={gift.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold">
                      {gift.productName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-body font-sans">
                    {gift.storeName}
                  </span>
                  <h3 className="font-heading font-semibold text-heading text-sm sm:text-base line-clamp-1">
                    {gift.productName}
                  </h3>

                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-2 py-0.5 rounded-[6px] bg-theme border border-default/50 font-medium text-heading">
                      Size: {gift.selectedSize || "Standard"}
                    </span>
                    <span className="px-2 py-0.5 rounded-[6px] bg-theme border border-default/50 font-medium text-heading">
                      Color: {gift.selectedColor || "Standard"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fulfillment / Claiming Stage */}
              {isClaimed ? (
                <div className="p-4 rounded-[16px] bg-status-success-bg border border-status-success/30 text-status-success space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-5" />
                    <h4 className="font-heading font-semibold text-sm">
                      Gift Accepted & Confirmed!
                    </h4>
                  </div>
                  <p className="text-xs text-status-success/90 font-sans leading-relaxed">
                    {gift.deliveryMethod === "STORE_PICKUP"
                      ? `Show code ${gift.redemptionCode} at ${gift.storeName} (${gift.storeAddress || "store counter"}) to collect your packaged garment.`
                      : "Your gift is scheduled for dispatch to your address. You will receive an SMS tracking alert."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleClaimGift} className="space-y-4 pt-1">
                  <div className="p-4 rounded-[16px] bg-theme border border-default/60 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-heading">
                      <MapPin className="size-4 text-accent" />
                      <span>
                        Fulfillment:{" "}
                        {gift.deliveryMethod === "STORE_PICKUP"
                          ? "Boutique In-Store Pickup"
                          : "Home Courier Delivery"}
                      </span>
                    </div>

                    {gift.deliveryMethod === "STORE_PICKUP" ? (
                      <p className="text-xs text-body leading-relaxed">
                        Pickup ready at: <strong>{gift.storeName}</strong>,{" "}
                        {gift.storeAddress || "Pakistan"}.
                      </p>
                    ) : (
                      <Input
                        label="Your Delivery Address"
                        placeholder="House / Apartment #, Street, City"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        required
                        helperText="Where should the boutique courier dispatch your gift?"
                      />
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full h-11"
                    isLoading={isSubmitting}
                  >
                    <CheckCircle2 className="size-4 mr-2" />
                    Accept & Claim Gift
                  </Button>
                </form>
              )}

              {/* Enter Store Link */}
              <div className="pt-2 text-center">
                <Link
                  href={`/customer/${gift.storeSlug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-heading hover:text-primary transition-colors"
                >
                  <span>Explore more outfits at {gift.storeName}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
