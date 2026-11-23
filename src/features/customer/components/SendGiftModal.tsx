"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gift, Lock, Send, CheckCircle2, Copy } from "lucide-react";
import { formatPKR } from "@/lib/formatters";
import { customerService } from "../services/customer.service";
import { useCustomerAuth } from "../hooks/useCustomerAuth";
import { CustomerLoginModal } from "./CustomerLoginModal";
import type { CustomerProduct, CustomerStore, GiftOrder } from "../types/customer.types";

interface SendGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CustomerProduct | null;
  store?: CustomerStore | null;
}

export function SendGiftModal({ isOpen, onClose, product, store }: SendGiftModalProps) {
  const { user, isAuthenticated } = useCustomerAuth();
  const [recipientName, setRecipientName] = React.useState("");
  const [recipientPhone, setRecipientPhone] = React.useState("");
  const [giftMessage, setGiftMessage] = React.useState(
    "Hope you love this as much as I do! Wear it in good health ✨"
  );
  const [selectedSize, setSelectedSize] = React.useState<string>("");
  const [selectedColor, setSelectedColor] = React.useState<string>("");
  const [deliveryMethod, setDeliveryMethod] = React.useState<"STORE_PICKUP" | "HOME_DELIVERY">(
    "STORE_PICKUP"
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [createdGift, setCreatedGift] = React.useState<{
    redemptionCode: string;
    giftUrl: string;
    order: GiftOrder;
  } | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);

  React.useEffect(() => {
    if (product) {
      setSelectedSize((product.availableSizes || [])[0] || "M");
      setSelectedColor((product.colorNames || [])[0] || "Standard");
      setCreatedGift(null);
      setErrorMessage(null);
      setCopied(false);
    }
  }, [product, isOpen]);

  if (!product) return null;

  const handleCreateGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!recipientName.trim() || !recipientPhone.trim()) {
      setErrorMessage("Please enter recipient name and mobile phone number.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await customerService.createGift(store?.slug || "", {
        productId: product.id,
        selectedSize,
        selectedColor,
        recipientName: recipientName.trim(),
        recipientPhone: recipientPhone.trim(),
        giftMessage: giftMessage.trim(),
        deliveryMethod,
      });

      setCreatedGift(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create gift order";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!createdGift) return;
    const url = `${window.location.origin}/customer/gifts/${createdGift.redemptionCode}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    if (!createdGift) return;
    const url = `${window.location.origin}/customer/gifts/${createdGift.redemptionCode}`;
    const text = `Hey ${recipientName}! 🎁 You have received a luxury surprise gift from ${user?.fullName || "a friend"} from ${store?.name || "Boutique"}! Tap here to unbox and view it: ${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${recipientPhone.replace(/[^0-9]/g, "")}&text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        title="Send as a Gift 🎁"
        subtitle={`Send ${product.name} to a friend with secret pricing and digital unboxing.`}
        maxWidthClass="w-full sm:max-w-[500px]"
      >
        <div className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-[12px] bg-status-error-bg border border-status-error/30 text-status-error text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {createdGift ? (
            <div className="space-y-4 pt-1">
              <div className="p-4 rounded-[16px] bg-status-success-bg border border-status-success/30 text-status-success flex items-center gap-3">
                <CheckCircle2 className="size-6 shrink-0" />
                <div>
                  <h4 className="font-heading font-semibold text-sm">
                    Gift Prepared Successfully!
                  </h4>
                  <p className="text-xs text-status-success/90 font-sans mt-0.5">
                    Redemption Code: <strong>{createdGift.redemptionCode}</strong>
                  </p>
                </div>
              </div>

              {/* Secret Pricing Guarantee Card */}
              <div className="p-4 rounded-[14px] bg-theme border border-default/60 flex items-start gap-3">
                <Lock className="size-4 text-accent shrink-0 mt-0.5" />
                <div className="text-xs text-body font-sans leading-relaxed">
                  <span className="font-medium text-heading">100% Secret Pricing Guarantee:</span>{" "}
                  The recipient will see this beautiful garment, your personal note, and store collection details. Your purchase amount is strictly omitted.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="h-11 text-xs"
                >
                  <Copy className="size-4 mr-1.5" />
                  {copied ? "Copied!" : "Copy Unbox Link"}
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleShareWhatsApp}
                  className="h-11 text-xs bg-status-success hover:bg-status-success/90 text-theme border-0"
                >
                  <Send className="size-4 mr-1.5" />
                  Send via WhatsApp
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateGift} className="space-y-4 pt-1">
              {/* Product Preview Row */}
              <div className="p-3.5 rounded-[14px] bg-theme border border-default/60 flex items-center gap-3">
                <div className="size-14 rounded-[10px] overflow-hidden bg-subtle shrink-0">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold">
                      {product.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-heading font-medium text-heading text-xs sm:text-sm truncate">
                    {product.name}
                  </p>
                  <p className="font-heading font-semibold text-heading text-xs mt-0.5">
                    {formatPKR(product.price)}
                  </p>
                </div>
              </div>

              {/* Size & Color Choice */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-heading font-medium text-heading block mb-1">
                    Select Size
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(product.availableSizes || []).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`text-xs px-2.5 py-1 rounded-[8px] border ${
                          selectedSize === size
                            ? "bg-primary text-theme border-primary font-medium"
                            : "bg-card text-body border-default/60"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-heading font-medium text-heading block mb-1">
                    Select Color
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(product.colorNames || []).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`text-[11px] px-2 py-0.5 rounded-[8px] border ${
                          selectedColor === color
                            ? "bg-primary text-theme border-primary font-medium"
                            : "bg-card text-body border-default/60"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Recipient Full Name"
                  placeholder="e.g. Daniyal Khan"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  required
                />
                <Input
                  label="Recipient Phone Number"
                  placeholder="0321 9876543"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  required
                />
              </div>

              {/* Gift Note */}
              <div>
                <label className="text-xs font-heading font-medium text-heading block mb-1">
                  Personal Greeting Message
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 rounded-[12px] bg-card border border-default/60 text-xs font-sans text-heading focus:outline-none focus:ring-1 focus:ring-primary"
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                />
              </div>

              {/* Fulfillment Method */}
              <div>
                <label className="text-xs font-heading font-medium text-heading block mb-1">
                  Collection / Delivery Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("STORE_PICKUP")}
                    className={`p-2.5 rounded-[12px] border text-left text-xs ${
                      deliveryMethod === "STORE_PICKUP"
                        ? "bg-theme border-primary font-medium text-heading"
                        : "bg-card border-default/60 text-body"
                    }`}
                  >
                    <p className="font-semibold">Boutique Pickup</p>
                    <p className="text-[11px] text-muted">Recipient collects in store</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("HOME_DELIVERY")}
                    className={`p-2.5 rounded-[12px] border text-left text-xs ${
                      deliveryMethod === "HOME_DELIVERY"
                        ? "bg-theme border-primary font-medium text-heading"
                        : "bg-card border-default/60 text-body"
                    }`}
                  >
                    <p className="font-semibold">Home Courier</p>
                    <p className="text-[11px] text-muted">Delivered to recipient address</p>
                  </button>
                </div>
              </div>

              {/* Secret Pricing Notice */}
              <div className="p-3 rounded-[12px] bg-theme border border-default/50 flex items-center gap-2 text-xs text-body">
                <Lock className="size-4 text-accent shrink-0" />
                <span>
                  Secret Pricing: Recipient unboxes the gift without seeing how much you spent.
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full h-11"
                isLoading={isSubmitting}
              >
                <Gift className="size-4 mr-2" />
                Prepare Gift & Generate Redemption Link
              </Button>
            </form>
          )}
        </div>
      </Dialog>

      <CustomerLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        activeStore={store}
      />
    </>
  );
}
