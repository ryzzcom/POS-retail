"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "../schemas/reset-password.schema";
import { authService } from "../services/auth.service";

export function ResetPasswordForm() {
  const router = useRouter();
  const [submissionError, setSubmissionError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");

  const isFilled = Boolean(
    passwordValue?.trim() && confirmPasswordValue?.trim()
  );
  const isButtonActive = isFilled && isValid;

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      setSubmissionError(null);
      await authService.resetPassword(data);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login?reset=success");
      }, 1500);
    } catch {
      setSubmissionError("Unable to reset password. Please try again or request a new code.");
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

      {isSuccess && (
        <div
          role="status"
          className="rounded-[12px] bg-status-success-bg border border-status-success/30 p-3 text-xs text-status-success"
        >
          Your password has been reset successfully! Redirecting to sign in...
        </div>
      )}

      {/* New Password (Figma node 3369:2772) */}
      <Input
        label="New Password"
        type="password"
        placeholder="Enter new password"
        autoComplete="new-password"
        showPasswordToggle
        error={errors.password?.message}
        {...register("password")}
      />

      {/* Confirm New Password (Figma node 3369:2775) */}
      <Input
        label="Confirm New Password"
        type="password"
        placeholder="Confirm new password"
        autoComplete="new-password"
        showPasswordToggle
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {/* Submit Button (Figma node 3371:6417):
          Disabled when empty or mismatched, dynamically active when both fields are valid and matching */}
      <div className="pt-1">
        <Button
          type="submit"
          fullWidth
          variant={isButtonActive ? "primary" : "mutes"}
          disabled={!isButtonActive || isSubmitting}
          isLoading={isSubmitting}
        >
          Reset Password
        </Button>
      </div>

      {/* Navigation Link: Take me back to Sign In (Figma node 3369:2779) */}
      <div className="flex items-center justify-center gap-1.5 pt-1 text-center">
        <span className="font-sans text-xs text-body">Take me back to</span>
        <Link
          href="/login"
          className="font-sans font-semibold text-[11px] tracking-wider uppercase text-primary hover:underline transition-colors"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
}

export default ResetPasswordForm;
