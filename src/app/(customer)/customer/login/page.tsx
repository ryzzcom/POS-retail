"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Phone, ShieldCheck, CheckCircle2 } from "lucide-react";
import { CustomerHeader } from "@/features/customer/components/CustomerHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { customerService } from "@/features/customer/services/customer.service";
import { useCustomerAuth } from "@/features/customer/hooks/useCustomerAuth";

export default function CustomerLoginPage() {
  const router = useRouter();
  const { loginWithOtp, isAuthenticated } = useCustomerAuth();

  const [step, setStep] = React.useState<"phone" | "otp">("phone");
  const [phone, setPhone] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [testOtp, setTestOtp] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/customer");
    }
  }, [isAuthenticated, router]);

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
        setOtp(res.testOtp);
      }
      setStep("otp");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send verification code";
      setError(msg);
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
      router.push("/customer");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid verification code. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />

      <div className="max-w-md mx-auto px-4 py-12 w-full">
        <div className="p-6 sm:p-8 bg-card rounded-[24px] border border-default/60 shadow-lg space-y-5">
          <div className="text-center space-y-2">
            <div className="size-12 rounded-[16px] bg-accent/15 border border-accent/25 flex items-center justify-center text-primary mx-auto">
              <Sparkles className="size-6 text-accent" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-heading">
              {step === "phone" ? "Universal Customer Pass" : "Verify Phone Number"}
            </h1>
            <p className="text-xs sm:text-sm text-body font-sans">
              {step === "phone"
                ? "One universal account across all boutique shops. Earn loyalty points and unlock AI Virtual Try-On."
                : `We sent a 6-digit verification code to ${phone}.`}
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-[12px] bg-status-error-bg border border-status-error/30 text-status-error text-xs font-medium">
              {error}
            </div>
          )}

          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
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
                placeholder="e.g. Daniyal Khan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                helperText="Used on personalized receipts and gift messages"
              />

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
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <Input
                label="6-Digit Verification Code"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                helperText="Enter the 6-digit code sent via SMS"
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
            <span>Strict Tenant Isolation · Data private per boutique</span>
          </div>
        </div>
      </div>
    </div>
  );
}
