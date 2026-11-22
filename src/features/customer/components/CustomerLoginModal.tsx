"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";
import { customerService } from "../services/customer.service";
import { useCustomerAuth } from "../hooks/useCustomerAuth";
import type { CustomerStore } from "../types/customer.types";

interface CustomerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStore?: CustomerStore | null;
  onSuccess?: () => void;
}

export function CustomerLoginModal({
  isOpen,
  onClose,
  activeStore,
  onSuccess,
}: CustomerLoginModalProps) {
  const { loginWithOtp } = useCustomerAuth();
  const [step, setStep] = React.useState<"phone" | "otp">("phone");
  const [phone, setPhone] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [testOtp, setTestOtp] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      setStep("phone");
      setOtp("");
      setError(null);
      setTestOtp(null);
    }
  }, [isOpen]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Please enter your mobile phone number");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await customerService.sendOtp(phone.trim());
      if (res.testOtp) {
        setTestOtp(res.testOtp);
        setOtp(res.testOtp); // Auto-fill for friction-free dev/testing
      }
      setStep("otp");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to send verification code";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await loginWithOtp(phone.trim(), otp.trim(), fullName.trim() || undefined);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Invalid verification code. Please try again.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={step === "phone" ? "Universal Customer Pass" : "Verify Phone Number"}
      subtitle={
        step === "phone"
          ? "One universal account across all boutique shops. Earn loyalty points, get digital thermal receipts, and unlock AI Virtual Try-On."
          : `We sent a 6-digit verification code to ${phone}.`
      }
      maxWidthClass="w-full sm:max-w-[480px]"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-[12px] bg-status-error-bg border border-status-error/30 text-status-error text-xs font-medium">
            {error}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-4 pt-1">
            <Input
              label="Your Mobile Phone Number"
              placeholder="0300 1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              helperText="Pakistani phone number (e.g. 03001234567 or +923001234567)"
              autoFocus
            />

            <Input
              label="Your Full Name (Optional)"
              placeholder="e.g. Raiyan Jawaid"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              helperText="Used on personalized digital receipts and gift messages"
            />

            {activeStore && (
              <div className="p-3 rounded-[12px] bg-theme border border-default/50 flex items-center gap-2.5 text-xs text-body">
                <CheckCircle2 className="size-4 text-status-success shrink-0" />
                <span>
                  Joining <strong>{activeStore.name}</strong> grants{" "}
                  <strong>+{activeStore.tryOnSignupCredits || 5} AI Try-On Credits</strong> instantly!
                </span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full h-11"
              isLoading={isLoading}
            >
              Send Verification Code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
            <Input
              label="6-Digit Verification Code"
              placeholder="123456"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              helperText="Enter the 6-digit SMS code"
              autoFocus
            />

            {testOtp && (
              <div className="p-2.5 rounded-[10px] bg-theme border border-accent/30 text-xs text-body flex items-center justify-between">
                <span>Auto-filled Test OTP: <strong>{testOtp}</strong></span>
                <span className="text-[11px] text-accent font-medium">Ready</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full h-11"
              isLoading={isLoading}
            >
              Verify & Sign In
            </Button>

            <button
              type="button"
              onClick={() => setStep("phone")}
              className="w-full text-center text-xs text-body hover:text-heading underline pt-1"
            >
              Change phone number
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-default/40 flex items-center justify-center gap-2 text-[11px] text-body">
          <ShieldCheck className="size-3.5 text-status-success" />
          <span>Strict Tenant Isolation · Your shopping history is private per store</span>
        </div>
      </div>
    </Dialog>
  );
}
