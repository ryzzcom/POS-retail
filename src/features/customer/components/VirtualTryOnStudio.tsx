"use client";

import * as React from "react";
import {
  Sparkles,
  Camera,
  Upload,
  ShieldCheck,
  Share2,
  Clock,
  Heart,
  Gift,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPKR } from "@/lib/formatters";
import { customerService } from "../services/customer.service";
import { useCustomerAuth } from "../hooks/useCustomerAuth";
import { CustomerLoginModal } from "./CustomerLoginModal";
import type { CustomerProduct, CustomerStore, VirtualTryOnJob } from "../types/customer.types";

interface VirtualTryOnStudioProps {
  store?: CustomerStore | null;
  initialProduct?: CustomerProduct | null;
  allProducts?: CustomerProduct[];
  onClose?: () => void;
}

const PRESET_MODELS = [
  {
    id: "model-1",
    label: "Athletic Build (Male, 5'11\")",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "model-2",
    label: "Slim Fit (Male, 5'9\")",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "model-3",
    label: "Classic Build (Male, 6'1\")",
    url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
  },
];

export function VirtualTryOnStudio({
  store,
  initialProduct,
  allProducts = [],
  onClose,
}: VirtualTryOnStudioProps) {
  const { user, memberships, isAuthenticated, refreshProfile } = useCustomerAuth();
  const [selectedProduct, setSelectedProduct] = React.useState<CustomerProduct | null>(
    initialProduct || allProducts[0] || null
  );
  const [selectedColor, setSelectedColor] = React.useState<string>(
    (initialProduct?.colorNames || [])[0] || "Standard"
  );
  const [userPhoto, setUserPhoto] = React.useState<string>(PRESET_MODELS[0].url);
  const [customPhotoSelected, setCustomPhotoSelected] = React.useState<boolean>(false);
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [resultJob, setResultJob] = React.useState<VirtualTryOnJob | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = React.useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = React.useState<boolean>(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Store membership
  const membership = React.useMemo(() => {
    if (!store?.slug) return null;
    return memberships.find((m) => m.storeSlug === store.slug);
  }, [memberships, store?.slug]);

  const availableCredits = membership?.tryOnCredits ?? store?.tryOnSignupCredits ?? 5;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUserPhoto(base64);
      setCustomPhotoSelected(true);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateTryOn = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!selectedProduct) {
      setErrorMessage("Please select a clothing garment to try on.");
      return;
    }

    if (availableCredits <= 0) {
      setErrorMessage(
        "You have 0 AI Try-On credits remaining. Earn +10 credits on your next checkout or ask store staff!"
      );
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage(null);

      const job = await customerService.generateTryOn({
        storeSlug: store?.slug || "",
        productId: selectedProduct.id,
        selectedColor,
        userPhotoBase64: userPhoto,
      });

      setResultJob(job);
      await refreshProfile();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Virtual Try-On generation failed";
      setErrorMessage(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareLook = async () => {
    const shareData = {
      title: `Virtual Try-On: ${selectedProduct?.name || "Apparel"}`,
      text: `Check out how I look in this ${selectedProduct?.name} at ${store?.name || "Boutique"}!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-card rounded-[24px] border border-default/60 shadow-lg overflow-hidden max-w-4xl mx-auto">
      {/* Studio Header Bar */}
      <div className="p-5 sm:p-6 border-b border-default/40 bg-gradient-to-r from-theme to-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-[10px] bg-accent/20 text-accent">
              <Sparkles className="size-5" />
            </span>
            <h2 className="font-heading font-bold text-heading text-lg sm:text-2xl">
              Virtual Try-On AI Studio
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-body font-sans mt-1">
            Simulate high-fashion garments on your own body photo using Google Gemini Multimodal Vision.
          </p>
        </div>

        {/* Credit Counter Pill */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-[12px] bg-theme border border-accent/40 flex items-center gap-2 shadow-2xs">
            <Sparkles className="size-4 text-accent" />
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-wider text-muted font-sans block">
                Your Balance
              </span>
              <span className="text-sm font-heading font-semibold text-heading">
                {availableCredits} Credits
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ephemeral Privacy Notice Banner (R2 24-Hour TTL) */}
      <div className="bg-subtle/60 px-5 py-2.5 border-b border-default/40 flex items-center justify-between gap-3 text-xs text-body">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-accent shrink-0" />
          <span>
            <strong>Cloudflare R2 24-Hour Auto-Deletion:</strong> Photos and generated previews are
            ephemerally stored and automatically erased after 24 hours.
          </span>
        </div>
        <span className="text-[11px] font-mono text-muted hidden md:inline">TTL: 24h</span>
      </div>

      {errorMessage && (
        <div className="m-5 p-4 rounded-[14px] bg-status-error-bg border border-status-error/30 text-status-error text-xs font-medium flex items-center gap-2.5">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {shareSuccess && (
        <div className="m-5 p-3 rounded-[12px] bg-status-success-bg border border-status-success/30 text-status-success text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>Link copied! Share it with your bestie on WhatsApp.</span>
        </div>
      )}

      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Garment Selector & Photo Upload */}
        <div className="space-y-5">
          {/* 1. Garment Info */}
          {selectedProduct && (
            <div className="p-4 rounded-[16px] bg-theme border border-default/60 flex items-center gap-4">
              <div className="size-16 rounded-[12px] overflow-hidden bg-subtle shrink-0">
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold">
                    {selectedProduct.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-body font-sans uppercase tracking-wider">
                  {selectedProduct.brand}
                </span>
                <h4 className="font-heading font-medium text-heading text-sm truncate">
                  {selectedProduct.name}
                </h4>
                <p className="font-heading font-semibold text-heading text-sm mt-0.5">
                  {formatPKR(selectedProduct.price)}
                </p>

                {/* Color Swatches */}
                {(selectedProduct.colorNames || []).length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {(selectedProduct.colorNames || []).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`text-[10px] px-2 py-0.5 rounded-[6px] border ${
                          selectedColor === color
                            ? "bg-primary text-theme border-primary font-medium"
                            : "bg-card text-body border-default/60"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. Photo Stage: Upload or Select Preset Model */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-heading font-semibold text-heading">
                Step 2: Upload Full-Body Photo
              </label>
              <span className="text-[11px] text-muted font-sans">Front-facing works best</span>
            </div>

            {/* Hidden Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-14 flex flex-col items-center justify-center gap-1 border-dashed border-default hover:border-primary"
              >
                <Upload className="size-4 text-primary" />
                <span className="text-xs">Upload My Photo</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-14 flex flex-col items-center justify-center gap-1 border-dashed border-default hover:border-primary"
              >
                <Camera className="size-4 text-primary" />
                <span className="text-xs">Take Camera Photo</span>
              </Button>
            </div>

            {/* Quick Model Presets */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] text-body font-sans">Or choose a sample model:</p>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_MODELS.map((model) => {
                  const isSelected = userPhoto === model.url;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        setUserPhoto(model.url);
                        setCustomPhotoSelected(false);
                      }}
                      className={`relative aspect-[3/4] rounded-[12px] overflow-hidden border-2 transition-all ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
                          : "border-default/60 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={model.url}
                        alt={model.label}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-heading/70 text-dark-primary text-[9px] py-0.5 px-1 truncate text-center">
                        {model.label.split("(")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Trigger Button */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleGenerateTryOn}
            isLoading={isGenerating}
            className="w-full h-12 text-sm shadow-md"
          >
            <Sparkles className="size-4 mr-2 text-accent" />
            {isGenerating ? "Gemini AI Synthesizing Garment..." : "Generate AI Virtual Try-On (1 Credit)"}
          </Button>
        </div>

        {/* Right Column: AI Try-On Canvas & Result View */}
        <div className="bg-theme rounded-[20px] border border-default/60 p-4 sm:p-5 flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-default/40">
              <span className="font-heading font-medium text-heading text-sm flex items-center gap-1.5">
                <Sliders className="size-4 text-accent" />
                Virtual Lookbook Canvas
              </span>
              {resultJob && (
                <Badge variant="success" className="text-[10px]">
                  Simulated via Gemini
                </Badge>
              )}
            </div>

            {/* Canvas Stage */}
            <div className="relative aspect-[3/4] max-w-sm mx-auto my-4 rounded-[16px] overflow-hidden bg-card border border-default/50 shadow-inner flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="size-14 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent animate-spin">
                    <RefreshCw className="size-7" />
                  </div>
                  <div>
                    <p className="font-heading font-medium text-heading text-sm">
                      Rendering Fabric Texture & Fit
                    </p>
                    <p className="text-xs text-body font-sans mt-1">
                      Gemini Multimodal AI is mapping {selectedColor} fabric onto torso coordinates...
                    </p>
                  </div>
                </div>
              ) : resultJob ? (
                <img
                  src={resultJob.resultImageUrl}
                  alt="AI Try-On Result"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={userPhoto}
                    alt="Target Photo"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-heading/20 backdrop-blur-[1px] flex items-center justify-center p-4">
                    <div className="bg-card/90 backdrop-blur-md p-3.5 rounded-[14px] text-center max-w-[220px] shadow-sm">
                      <Sparkles className="size-5 text-accent mx-auto mb-1 animate-pulse" />
                      <p className="text-xs font-heading font-medium text-heading">
                        Ready to simulate
                      </p>
                      <p className="text-[10px] text-body mt-0.5">
                        Tap &apos;Generate AI Virtual Try-On&apos; to view garment fit.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Styling Advice Notes */}
            {resultJob?.stylingAdvice && (
              <div className="p-3.5 rounded-[12px] bg-card border border-accent/30 text-xs text-body space-y-1">
                <span className="font-heading font-semibold text-heading flex items-center gap-1">
                  <Sparkles className="size-3.5 text-accent" />
                  AI Fashion Consultant Advice:
                </span>
                <p className="font-sans leading-relaxed text-[11px]">
                  {resultJob.stylingAdvice}
                </p>
              </div>
            )}
          </div>

          {/* Result Actions */}
          {resultJob && (
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-default/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleShareLook}
                className="text-xs h-9"
              >
                <Share2 className="size-3.5 mr-1" />
                Share with Bestie
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  setShareSuccess(true);
                  setTimeout(() => setShareSuccess(false), 3000);
                }}
                className="text-xs h-9"
              >
                <Heart className="size-3.5 mr-1" />
                Save to My Looks
              </Button>
            </div>
          )}
        </div>
      </div>

      <CustomerLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        activeStore={store}
        onSuccess={() => handleGenerateTryOn()}
      />
    </div>
  );
}
