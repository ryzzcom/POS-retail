"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Store, Lock, ShieldCheck, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { OtpInput } from "@/components/ui/otp-input";
import type { StaffProfile } from "../types/auth.types";
import { authService } from "../services/auth.service";
import { apiClient } from "@/lib/api-client";
import { settingsService } from "@/features/owner/settings/services/settings.service";

export interface SelectProfileViewProps {
  storeName?: string;
  storeSlug?: string;
  profiles?: StaffProfile[];
  onSelectProfile?: (profile: StaffProfile, pin: string) => Promise<boolean> | boolean;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function SelectProfileView({
  storeName = "Retail Boutique",
  storeSlug = "retail-boutique",
  profiles,
  onSelectProfile,
}: SelectProfileViewProps) {
  const router = useRouter();
  const [activeStoreName, setActiveStoreName] = React.useState(storeName);
  const [activeStoreSlug, setActiveStoreSlug] = React.useState(storeSlug);
  const [activeProfiles, setActiveProfiles] = React.useState<StaffProfile[]>(profiles ?? []);
  const [isLoadingProfiles, setIsLoadingProfiles] = React.useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = React.useState<boolean>(false);

  const [selectedProfile, setSelectedProfile] = React.useState<StaffProfile | null>(null);
  const [pin, setPin] = React.useState<string>("");
  const [pinError, setPinError] = React.useState<string | undefined>(undefined);
  const [isUnlocking, setIsUnlocking] = React.useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  // Hydrate store info and live active staff profiles
  React.useEffect(() => {
    let isMounted = true;

    async function loadData() {
      // 1. Immediate local storage cache hydration
      if (typeof window !== "undefined") {
        try {
          const storedStore = localStorage.getItem("active_store");
          if (storedStore) {
            const parsed = JSON.parse(storedStore);
            if (parsed.name && isMounted) setActiveStoreName(parsed.name);
            if (parsed.slug && isMounted) setActiveStoreSlug(parsed.slug);
          }

          const storedProfiles = localStorage.getItem("store_profiles");
          if (storedProfiles) {
            const parsedProfiles = JSON.parse(storedProfiles);
            if (Array.isArray(parsedProfiles) && parsedProfiles.length > 0 && isMounted) {
              setActiveProfiles(parsedProfiles);
            }
          }
        } catch {
          // Ignore parse errors
        }
      }

      // 2. Fetch live profiles from backend if token exists
      const token = apiClient.getToken();
      if (token) {
        try {
          // Attempt 1: Fetch session context with profiles via getMe()
          const meRes = await authService.getMe();
          if (meRes.store && isMounted) {
            setActiveStoreName(meRes.store.name);
            setActiveStoreSlug(meRes.store.slug);
          }

          if (Array.isArray(meRes.profiles) && meRes.profiles.length > 0 && isMounted) {
            const mappedProfiles: StaffProfile[] = meRes.profiles.map((p) => ({
              id: p.id,
              displayName: p.displayName,
              role: p.role,
              isPinSet: true,
              maxDiscountPct: p.maxDiscountPct,
              assignedCounterId: p.assignedCounterId || p.assignedCounter?.id || null,
              assignedCounter: p.assignedCounter || null,
            }));
            setActiveProfiles(mappedProfiles);
            localStorage.setItem("store_profiles", JSON.stringify(mappedProfiles));
            return;
          }
        } catch {
          // Try fallback to settings staff
        }

        try {
          // Attempt 2: Fetch team members from settings staff endpoint
          const staffList = await settingsService.getStaff();
          if (Array.isArray(staffList) && isMounted) {
            const activeOnly = staffList.filter((s) => s.status === "active");
            const mappedProfiles: StaffProfile[] = activeOnly.map((s) => ({
              id: s.id,
              displayName: s.name,
              role: (s.role.toUpperCase() === "OWNER" ? "OWNER" : "CASHIER") as "OWNER" | "CASHIER",
              isPinSet: s.pinSet,
              maxDiscountPct: s.maxDiscountPercent,
              assignedCounterId: s.assignedTerminal,
            }));
            setActiveProfiles(mappedProfiles);
            localStorage.setItem("store_profiles", JSON.stringify(mappedProfiles));
          }
        } catch (staffErr) {
          console.warn("Could not fetch fresh staff members:", staffErr);
        } finally {
          if (isMounted) setIsLoadingProfiles(false);
        }
      } else {
        if (isMounted) setIsLoadingProfiles(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAccountLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      apiClient.clearToken();
      if (typeof window !== "undefined") {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch {
          // Storage clear error ignored
        }
      }
      router.push("/login");
    }
  };

  const handleOpenPinModal = (profile: StaffProfile) => {
    setSelectedProfile(profile);
    setPin("");
    setPinError(undefined);
    setIsModalOpen(true);
  };

  const handleClosePinModal = () => {
    if (isUnlocking) return;
    setIsModalOpen(false);
    setPin("");
    setPinError(undefined);
    setSelectedProfile(null);
  };

  const handlePinChange = (value: string) => {
    setPin(value);
    if (pinError) {
      setPinError(undefined);
    }
    // Auto-submit immediately when all 4 digits are entered
    if (value.length === 4 && !isUnlocking) {
      handleUnlock(value);
    }
  };

  const handleUnlock = React.useCallback(
    async (pinOverride?: string) => {
      const pinToVerify = pinOverride || pin;
      if (!selectedProfile || pinToVerify.length < 4 || isUnlocking) return;

      setIsUnlocking(true);
      setPinError(undefined);

      try {
        let success = true;
        let errorMessage: string | undefined;

        if (onSelectProfile) {
          const result = await onSelectProfile(selectedProfile, pinToVerify);
          success = Boolean(result);
        } else {
          const verifyRes = await authService.unlockProfile({
            profileId: selectedProfile.id,
            pin: pinToVerify,
          });
          success = verifyRes.success;
          errorMessage = verifyRes.error;
        }

        if (!success) {
          setPinError(errorMessage || "Incorrect 4-digit PIN. Please try again.");
          setPin(""); // Auto-clear inputs for immediate retry
          setIsUnlocking(false);
          return;
        }

        // Snapshot the unlocked profile and clear modal state
        const unlockedProfile = selectedProfile;
        setPin("");
        setPinError(undefined);
        setIsModalOpen(false);

        if (typeof window !== "undefined") {
          localStorage.setItem("active_profile", JSON.stringify(unlockedProfile));
        }

        // Dynamic Role-Based Routing
        if (unlockedProfile.role === "OWNER") {
          if (typeof window !== "undefined") {
            localStorage.setItem("active_role", "OWNER");
            sessionStorage.setItem("active_role", "OWNER");
          }
          router.push("/dashboard");
        } else {
          const cashierSession = {
            profileId: unlockedProfile.id,
            cashierName: unlockedProfile.displayName,
            role: "CASHIER",
            assignedCounterId: unlockedProfile.assignedCounterId || "counter-1",
            storeSlug: activeStoreSlug,
          };
          if (typeof window !== "undefined") {
            localStorage.setItem("cashier_session", JSON.stringify(cashierSession));
            localStorage.setItem("active_role", "CASHIER");
            sessionStorage.setItem("active_role", "CASHIER");
          }
          router.push(`/pos?from=cashier&storeSlug=${activeStoreSlug}`);
        }
      } catch {
        setPinError("An error occurred while verifying your PIN. Please try again.");
        setPin("");
        setIsUnlocking(false);
      }
    },
    [selectedProfile, pin, isUnlocking, onSelectProfile, activeStoreSlug, router]
  );

  return (
    <div className="h-full w-full overflow-y-auto flex flex-col justify-between items-center px-4 py-6 sm:py-10 select-none">
      {/* Top Header: Brand Logo & Right Action Cluster */}
      <header className="w-full max-w-[760px] mx-auto flex items-center justify-between shrink-0">
        <Link
          href="/"
          className="inline-block transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
          aria-label="POS System Home"
        >
          <Image
            src="/image/logo-login.svg"
            alt="POS System"
            width={220}
            height={32}
            priority
            className="w-auto h-[26px] sm:h-[30px]"
          />
        </Link>

        {/* Top-Right Account Logout Option */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAccountLogout}
          disabled={isLoggingOut}
          className="text-body hover:text-status-error gap-1.5 font-sans text-xs sm:text-sm cursor-pointer hover:bg-status-error-bg/30 px-3 py-1.5 rounded-lg transition-colors"
          title="Sign out of store account and return to login"
        >
          {isLoggingOut ? (
            <Loader2 className="size-4 animate-spin shrink-0" aria-hidden="true" />
          ) : (
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
          )}
          <span>{isLoggingOut ? "Signing out..." : "Log Out"}</span>
        </Button>
      </header>

      {/* Center Profile Selection Content */}
      <main className="w-full max-w-[760px] mx-auto my-auto flex flex-col items-center gap-6 sm:gap-8 py-4">
        {/* Header Block */}
        <div className="flex flex-col items-center text-center gap-2">
          {/* Store Name Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle/80 border border-default text-body text-xs font-sans">
            <Store className="size-3.5 text-accent shrink-0" aria-hidden="true" />
            <span className="font-medium text-heading">{activeStoreName}</span>
          </div>

          <h1 className="font-heading font-semibold text-2xl sm:text-3xl lg:text-[32px] text-heading tracking-tight">
            Select Your Profile
          </h1>

          <p className="font-sans text-xs sm:text-sm text-body max-w-md">
            Choose your staff profile and enter your 4-digit PIN to continue to your workspace.
          </p>
        </div>

        {/* Profile Selection Grid */}
        {isLoadingProfiles && activeProfiles.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="size-8 text-primary animate-spin" aria-hidden="true" />
            <span className="font-sans text-xs text-muted">Loading team profiles...</span>
          </div>
        ) : activeProfiles.length === 0 ? (
          <div className="w-full rounded-[18px] border border-default bg-card p-8 flex flex-col items-center text-center gap-3 shadow-xs">
            <p className="font-sans text-sm text-body">
              No staff profiles found for <strong className="text-heading">{activeStoreName}</strong>.
            </p>
            <p className="font-sans text-xs text-muted max-w-sm">
              Please sign out and sign in with the primary Store Owner account to configure staff profiles.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAccountLogout}
              className="text-xs font-sans mt-2"
            >
              Sign out to Login
            </Button>
          </div>
        ) : (
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {activeProfiles.slice(0, 10).map((profile) => {
              const isOwner = profile.role === "OWNER";
              const initials = getInitials(profile.displayName);

              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => handleOpenPinModal(profile)}
                  className={cn(
                    "group relative border border-default hover:border-focus rounded-[18px] bg-card hover:bg-theme/40 p-4 sm:p-5 flex flex-col items-center gap-3 transition-all cursor-pointer shadow-xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "text-left"
                  )}
                  aria-label={`Select profile ${profile.displayName} (${profile.role})`}
                >
                  {/* Avatar Initials Circle */}
                  <div
                    className={cn(
                      "size-14 sm:size-16 rounded-full flex items-center justify-center font-heading font-semibold text-lg sm:text-xl transition-transform duration-200 group-hover:scale-105 shrink-0 select-none",
                      isOwner
                        ? "bg-accent/15 text-accent border border-accent/30"
                        : "bg-primary/10 text-primary border border-primary/20"
                    )}
                  >
                    {initials}
                  </div>

                  {/* Name & Role Details */}
                  <div className="flex flex-col items-center gap-1.5 w-full text-center min-w-0">
                    <span className="font-heading font-semibold text-sm sm:text-base text-heading truncate w-full group-hover:text-primary transition-colors">
                      {profile.displayName}
                    </span>

                    {/* Role Badge */}
                    {isOwner ? (
                      <Badge variant="gold" size="sm">
                        Owner
                      </Badge>
                    ) : (
                      <Badge variant="secondary" size="sm">
                        Cashier
                      </Badge>
                    )}
                  </div>

                  {/* PIN Protected Indicator */}
                  <div className="flex items-center gap-1 text-[11px] text-muted font-sans mt-0.5">
                    <Lock className="size-3 shrink-0" aria-hidden="true" />
                    <span>PIN Protected</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom Actions: Account Logout / Sign Out Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAccountLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 text-xs text-body hover:text-status-error hover:border-status-error/40 hover:bg-status-error-bg/30 transition-all font-sans py-2 px-4 rounded-xl cursor-pointer"
          >
            {isLoggingOut ? (
              <Loader2 className="size-3.5 animate-spin shrink-0" aria-hidden="true" />
            ) : (
              <LogOut className="size-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>{isLoggingOut ? "Signing Out..." : "Sign Out of Store Account"}</span>
          </Button>
        </div>
      </main>

      {/* Footer Branding Note */}
      <footer className="shrink-0 text-center text-[11px] text-muted font-sans py-2">
        <span>Retail POS &bull; Enterprise Boutique Edition</span>
      </footer>

      {/* Dedicated 4-Digit Security PIN Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleClosePinModal}
        maxWidthClass="w-full sm:max-w-[420px]"
        closeOnEsc={!isUnlocking}
        closeOnBackdropClick={!isUnlocking}
        hideCloseButton={isUnlocking}
      >
        {selectedProfile && (
          <div className="flex flex-col items-center text-center gap-4 sm:gap-5 p-2 sm:p-4">
            {/* Modal Avatar & Profile Banner */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "size-16 sm:size-18 rounded-full flex items-center justify-center font-heading font-semibold text-xl sm:text-2xl shrink-0 shadow-xs",
                  selectedProfile.role === "OWNER"
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : "bg-primary/10 text-primary border border-primary/20"
                )}
              >
                {getInitials(selectedProfile.displayName)}
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-heading font-semibold text-lg sm:text-xl text-heading">
                    {selectedProfile.displayName}
                  </h2>
                  {selectedProfile.role === "OWNER" ? (
                    <Badge variant="gold" size="sm">
                      Owner
                    </Badge>
                  ) : (
                    <Badge variant="secondary" size="sm">
                      Cashier
                    </Badge>
                  )}
                </div>
                <p className="font-sans text-xs sm:text-sm text-body">
                  Enter 4-Digit Security PIN for {selectedProfile.displayName}
                </p>
              </div>
            </div>

            {/* Error Message Toast / Alert */}
            {pinError && (
              <div
                role="alert"
                className="w-full rounded-[12px] bg-status-error-bg border border-status-error/30 p-2.5 text-xs text-status-error font-sans text-center"
              >
                {pinError}
              </div>
            )}

            {/* 4-Digit Dedicated OTP / PIN Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUnlock();
              }}
              className="w-full flex flex-col items-center gap-4"
            >
              <div className="w-full max-w-[280px] my-1">
                <OtpInput
                  id="security-pin-input"
                  length={4}
                  value={pin}
                  onChange={handlePinChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && pin.length === 4) {
                      e.preventDefault();
                      handleUnlock();
                    }
                  }}
                  error={pinError}
                  autoFocus
                  disabled={isUnlocking}
                />
              </div>

              {/* Security Notice */}
              <div className="flex items-center gap-1.5 text-[11px] text-muted font-sans">
                <ShieldCheck className="size-3.5 text-secondary shrink-0" aria-hidden="true" />
                <span>Terminal access is verified and logged</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 w-full pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="default"
                  fullWidth
                  disabled={pin.length < 4 || isUnlocking}
                  isLoading={isUnlocking}
                >
                  Unlock Terminal
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  fullWidth
                  disabled={isUnlocking}
                  onClick={handleClosePinModal}
                  className="text-body hover:text-heading"
                >
                  Back to profiles
                </Button>
              </div>
            </form>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default SelectProfileView;
