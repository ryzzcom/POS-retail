"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { otpSchema, type OtpInput as OtpSchemaInput } from "../schemas/otp.schema";
import { authService } from "../services/auth.service";

export function OtpForm() {
  const router = useRouter();
  const [submissionError, setSubmissionError] = React.useState<string | null>(null);
  const [resendNotice, setResendNotice] = React.useState<string | null>(null);
  const [countdown, setCountdown] = React.useState(60);
  const [isResending, setIsResending] = React.useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<OtpSchemaInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  const otpValue = watch("otp") || "";
  const isComplete = otpValue.length === 6 && /^\d{6}$/.test(otpValue);
  const isButtonActive = isComplete && isValid;

  // Countdown timer effect
  React.useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formattedTimer = `00:${countdown.toString().padStart(2, "0")}`;

  const onSubmit = async (data: OtpSchemaInput) => {
    try {
      setSubmissionError(null);
      await authService.verifyOtp(data);
      // Navigate to reset-password screen upon successful OTP verification
      router.push("/reset-password");
    } catch {
      setSubmissionError("Invalid or expired verification code. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return;
    try {
      setIsResending(true);
      setSubmissionError(null);
      await authService.resendOtp();
      setResendNotice("A new 6-digit verification code has been sent.");
      setCountdown(60);
      setTimeout(() => setResendNotice(null), 5000);
    } catch {
      setSubmissionError("Failed to resend code. Please try again shortly.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 sm:gap-4.5 w-full"
      noValidate
    >
      {submissionError && (
        <div
          role="alert"
          className="rounded-[12px] bg-status-error-bg border border-status-error/30 p-2.5 text-xs text-status-error"
        >
          {submissionError}
        </div>
      )}

      {resendNotice && (
        <div
          role="status"
          className="rounded-[12px] bg-status-success-bg border border-status-success/30 p-2.5 text-xs text-status-success"
        >
          {resendNotice}
        </div>
      )}

      {/* OTP Field Container (Figma node 3369:2673) */}
      <div className="flex flex-col gap-2 w-full">
        <label
          htmlFor="otp-verification-input"
          className="font-sans font-medium text-sm text-body"
        >
          Enter Verification Code
        </label>

        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <OtpInput
              id="otp-verification-input"
              length={6}
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
              error={errors.otp?.message}
            />
          )}
        />
      </div>

      {/* Submit Button (Figma node 3371:6374):
          Disabled when empty or incomplete (< 6 digits), dynamically active when 6 valid digits entered */}
      <div className="pt-1">
        <Button
          type="submit"
          fullWidth
          variant={isButtonActive ? "primary" : "mutes"}
          disabled={!isButtonActive || isSubmitting}
          isLoading={isSubmitting}
        >
          Verify OTP
        </Button>
      </div>

      {/* Resend OTP Timer Row (Figma node 3371:6347) */}
      <div className="flex items-center justify-center gap-1.5 pt-0.5 text-center">
        <span className="font-sans text-xs text-body">Resend OTP in</span>
        <span className="font-sans font-semibold text-[11px] tracking-wider text-primary">
          {formattedTimer}
        </span>
      </div>

      {/* Resend Action (Figma node 3369:2692) */}
      <div className="flex flex-col items-center justify-center gap-2 pt-0.5 text-center">
        <Button
          type="button"
          variant="link"
          onClick={handleResendOtp}
          disabled={countdown > 0 || isResending}
          className="font-sans font-medium text-sm text-primary hover:underline disabled:text-muted disabled:no-underline disabled:cursor-not-allowed transition-colors"
        >
          {isResending ? "Resending..." : "Resend OTP"}
        </Button>

        <div className="flex items-center gap-1 text-center pt-1">
          <span className="font-sans text-xs text-body">Take me back to</span>
          <Link
            href="/login"
            className="font-sans font-semibold text-[11px] tracking-wider uppercase text-primary hover:underline transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
}

export default OtpForm;
