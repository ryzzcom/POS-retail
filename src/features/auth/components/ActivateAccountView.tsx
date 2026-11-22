"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Store,
  Lock,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Phone,
  Globe,
  Building2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { authService } from "../services/auth.service";

export function ActivateAccountView() {
  const router = useRouter();

  // Form State
  const [pin, setPin] = React.useState("");
  const [confirmPin, setConfirmPin] = React.useState("");
  const [storeName, setStoreName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [whatsappNumber, setWhatsappNumber] = React.useState("");
  const [city, setCity] = React.useState("Lahore");
  const [address, setAddress] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);

  // Status & Validation
  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submissionError, setSubmissionError] = React.useState<string | null>(null);
  const [logoError, setLogoError] = React.useState<string | null>(null);

  // File input ref
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Pre-fill initial store name from storage or user session if available
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedStore = localStorage.getItem("active_store");
        if (storedStore) {
          const parsed = JSON.parse(storedStore);
          if (parsed.name) setStoreName(parsed.name);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.city) setCity(parsed.city);
          if (parsed.address) setAddress(parsed.address);
        }
        const storedUser = localStorage.getItem("user");
        if (storedUser && !storeName) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.fullName) {
            setStoreName(`${parsedUser.fullName.trim()}'s Boutique`);
          }
        }
      } catch {
        // Storage access error ignored
      }
    }
  }, []);

  // Handle Logo Upload
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLogoError(null);
      setIsUploadingLogo(true);
      const secureUrl = await uploadToCloudinary(file);
      setLogoUrl(secureUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload logo";
      setLogoError(msg);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Validation
  const isPinValid = /^\d{4}$/.test(pin);
  const isPinMatch = isPinValid && pin === confirmPin;
  const isStoreNameValid = storeName.trim().length >= 2;
  const canSubmit = isPinMatch && isStoreNameValid && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmissionError(null);
      setIsSubmitting(true);

      const res = await authService.activateAccount({
        pin,
        confirmPin,
        storeName: storeName.trim(),
        phone: phone.trim() || undefined,
        whatsappNumber: whatsappNumber.trim() || phone.trim() || undefined,
        city: city.trim() || undefined,
        address: address.trim() || undefined,
        website: website.trim() || undefined,
        logoUrl: logoUrl || undefined,
      });

      if (res.success) {
        // Redirect directly to the Store Owner Dashboard
        router.push("/dashboard");
      } else {
        setSubmissionError(res.message || "Failed to setup store. Please try again.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred while setting up your store.";
      setSubmissionError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-page flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-default">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
            POS
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-heading font-heading leading-tight">
              POS Retail Boutique
            </h1>
            <p className="text-xs text-body">Store Onboarding & Setup</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-status-success-bg text-status-success border border-status-success/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Email Verified
          </span>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-2xl mx-auto w-full my-auto py-6 sm:py-8">
        <div className="bg-card rounded-2xl border border-default shadow-sm p-6 sm:p-8">
          {/* Form Header */}
          <div className="mb-6 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-subtle text-xs font-semibold text-primary mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Final Step: Store Activation
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-heading font-heading">
              Setup Your Store & Security PIN
            </h2>
            <p className="text-sm text-body mt-1">
              Choose your memorable 4-digit PIN for instant terminal unlocks and customize your boutique details.
            </p>
          </div>

          {/* Submission Error Banner */}
          {submissionError && (
            <div
              role="alert"
              className="mb-6 rounded-xl bg-status-error-bg border border-status-error/30 p-3.5 text-xs sm:text-sm text-status-error flex items-start gap-2.5"
            >
              <div className="font-semibold shrink-0">Error:</div>
              <div>{submissionError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* SECTION 1: 4-DIGIT SECURITY PIN */}
            <div className="p-4 sm:p-5 rounded-xl bg-theme border border-default/80 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-heading font-heading">
                    Choose Your 4-Digit Security PIN
                  </h3>
                  <p className="text-xs text-body">
                    You will use this PIN to quickly unlock your profile at any cashier counter.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-heading mb-1">
                    4-Digit Security PIN <span className="text-status-error">*</span>
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="e.g. 1234"
                    value={pin}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setPin(val);
                    }}
                    className="w-full h-11 px-3.5 text-center tracking-[8px] text-lg font-bold rounded-lg border border-default bg-card text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:tracking-normal placeholder:text-xs placeholder:font-normal placeholder:text-muted"
                  />
                  {pin && !isPinValid && (
                    <p className="text-[11px] text-status-error mt-1">
                      Must be exactly 4 numeric digits
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-heading mb-1">
                    Confirm Security PIN <span className="text-status-error">*</span>
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Re-enter 4-digit PIN"
                    value={confirmPin}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setConfirmPin(val);
                    }}
                    className={cn(
                      "w-full h-11 px-3.5 text-center tracking-[8px] text-lg font-bold rounded-lg border bg-card text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:tracking-normal placeholder:text-xs placeholder:font-normal placeholder:text-muted",
                      confirmPin && pin !== confirmPin
                        ? "border-status-error text-status-error"
                        : "border-default"
                    )}
                  />
                  {confirmPin && pin !== confirmPin && (
                    <p className="text-[11px] text-status-error mt-1">
                      PINs do not match
                    </p>
                  )}
                  {isPinMatch && (
                    <p className="text-[11px] text-status-success mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> PIN verified & matching
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: STORE INFORMATION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-heading font-heading">
                    Boutique & Contact Details
                  </h3>
                  <p className="text-xs text-body">
                    Appears on sales receipts, customer invoices, and reports.
                  </p>
                </div>
              </div>

              {/* Store Name */}
              <div>
                <label className="block text-xs font-medium text-heading mb-1">
                  Boutique / Store Name <span className="text-status-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Raiyan Luxury Pret & Fabrics"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-lg border border-default bg-card text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted"
                  />
                  <Building2 className="w-4 h-4 text-muted absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Phone & City Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-heading mb-1">
                    Store Contact Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="e.g. +92 300 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 pl-10 pr-3.5 text-sm rounded-lg border border-default bg-card text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted"
                    />
                    <Phone className="w-4 h-4 text-muted absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-heading mb-1">
                    City / Region
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Lahore, Karachi, Islamabad"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 pl-10 pr-3.5 text-sm rounded-lg border border-default bg-card text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted"
                    />
                    <MapPin className="w-4 h-4 text-muted absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-medium text-heading mb-1">
                  Shop Address / Market
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Shop #14, MM Alam Road, Gulberg III"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-lg border border-default bg-card text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted"
                  />
                  <MapPin className="w-4 h-4 text-muted absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Social / Website Link */}
              <div>
                <label className="block text-xs font-medium text-heading mb-1">
                  Website or Instagram Handle (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. @raiyanboutique or https://raiyan.pk"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 text-sm rounded-lg border border-default bg-card text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted"
                  />
                  <Globe className="w-4 h-4 text-muted absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Store Logo Upload (Cloudinary) */}
              <div>
                <label className="block text-xs font-medium text-heading mb-1">
                  Store Logo (Optional)
                </label>
                <div className="flex items-center gap-4 p-3.5 rounded-xl border border-dashed border-default bg-theme">
                  {logoUrl ? (
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-default bg-white shrink-0">
                      <Image
                        src={logoUrl}
                        alt="Store Logo"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-subtle/60 flex items-center justify-center text-muted shrink-0">
                      <Store className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-heading">
                      {logoUrl ? "Logo uploaded successfully" : "Upload your brand logo for receipts"}
                    </p>
                    <p className="text-[11px] text-body">
                      PNG, JPG or WebP up to 5MB
                    </p>
                    {logoError && (
                      <p className="text-[11px] text-status-error mt-0.5">{logoError}</p>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleLogoFileChange}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploadingLogo}
                    onClick={() => fileInputRef.current?.click()}
                    className="shrink-0 text-xs"
                  >
                    {isUploadingLogo ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                        {logoUrl ? "Change" : "Browse"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-default flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-body text-center sm:text-left">
                Security PIN & details can be updated anytime in Store Settings.
              </p>

              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full sm:w-auto min-w-[200px] h-11 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Activating Store...
                  </>
                ) : (
                  <>
                    Complete Setup & Open Store
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center pt-6 text-xs text-muted">
        © 2026 POS Retail & Inventory SaaS. All rights reserved.
      </footer>
    </div>
  );
}
