"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "../schemas/forgot-password.schema";
import { authService } from "../services/auth.service";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [submissionError, setSubmissionError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const emailValue = watch("email");
  const isFilled = Boolean(emailValue?.trim());
  const isButtonActive = isFilled && isValid;

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setSubmissionError(null);
      await authService.forgotPassword(data);
      setIsSuccess(true);
      router.push("/verify-otp");
    } catch {
      setSubmissionError("Unable to request OTP. Please check your email and try again.");
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
          An OTP has been sent to your registered email address. Please check your inbox.
        </div>
      )}

      {/* Email Input */}
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      {/* Submit Button: Disabled when input is empty, dynamically active when valid email is entered */}
      <div className="pt-1">
        <Button
          type="submit"
          fullWidth
          variant={isButtonActive ? "primary" : "mutes"}
          disabled={!isButtonActive || isSubmitting}
          isLoading={isSubmitting}
        >
          Request OTP
        </Button>
      </div>

      {/* Navigation Link: Take me back to Sign In (Figma node 3369:2559) */}
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

export default ForgotPasswordForm;
