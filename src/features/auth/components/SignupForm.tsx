"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { signupSchema, type SignupInput } from "../schemas/signup.schema";
import { authService } from "../services/auth.service";

export function SignupForm() {
  const router = useRouter();
  const [submissionError, setSubmissionError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    mode: "onChange",
  });

  // Watch field values to drive interactive disabled-to-active button transition
  const fullName = watch("fullName");
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const isFormFilled = Boolean(
    fullName?.trim() &&
    email?.trim() &&
    password?.trim() &&
    confirmPassword?.trim()
  );
  const isButtonActive = isFormFilled && isValid;

  const onSubmit = async (data: SignupInput) => {
    try {
      setSubmissionError(null);
      await authService.signup(data);
      // Navigate to dashboard or activation screen
      router.push("/dashboard");
    } catch {
      setSubmissionError("Unable to create account. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2.5 sm:gap-3 w-full"
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

      {/* Full Name */}
      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        autoComplete="name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      {/* Email */}
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      {/* Password */}
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        autoComplete="new-password"
        showPasswordToggle
        error={errors.password?.message}
        {...register("password")}
      />

      {/* Confirm Password */}
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Enter your confirm password"
        autoComplete="new-password"
        showPasswordToggle
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {/* Submit Button */}
      <div className="pt-0.5">
        <Button
          type="submit"
          fullWidth
          variant={isButtonActive ? "primary" : "mutes"}
          disabled={!isButtonActive || isSubmitting}
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="size-4" />}
        >
          Create an account
        </Button>
      </div>

      {/* "or" Divider */}
      <div className="relative flex items-center justify-center py-0.5">
        <div className="w-full border-t border-default" />
        <span className="absolute bg-theme border border-default px-2.5 py-0.5 rounded-[8px] font-sans text-[11px] text-body tracking-wider">
          or
        </span>
      </div>

      {/* Social Google Sign-Up */}
      <GoogleAuthButton />

      {/* Existing account link */}
      <div className="flex items-center justify-center gap-1.5 pt-0.5 text-center">
        <span className="font-sans text-xs text-body">Already have an account?</span>
        <Link
          href="/login"
          className="font-sans font-semibold text-xs tracking-wider uppercase text-primary hover:underline transition-all"
        >
          Sign In
        </Link>
      </div>

      {/* Legal Disclaimer */}
      <p className="font-sans text-[11px] text-body/80 text-center leading-tight">
        By creating an account, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
}

export default SignupForm;
