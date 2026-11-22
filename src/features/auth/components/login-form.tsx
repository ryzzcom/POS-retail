"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { loginSchema, type LoginInput } from "../schemas/login.schema";
import { authService } from "../services/auth.service";

export function LoginForm() {
  const router = useRouter();
  const [submissionError, setSubmissionError] = React.useState<string | null>(null);
  const [successNotice, setSuccessNotice] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("reset") === "success" || params.get("reset") === "true") {
        setSuccessNotice("Your password has been reset successfully. Please sign in with your new password.");
      } else if (params.get("verified") === "true") {
        setSuccessNotice("Your account has been verified successfully. Please sign in.");
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  // Watch field values to drive the interactive disabled-to-active button transition
  const emailValue = watch("email");
  const passwordValue = watch("password");
  const isFormFilled = Boolean(emailValue?.trim() && passwordValue?.trim());
  const isButtonActive = isFormFilled && isValid;

  const onSubmit = async (data: LoginInput) => {
    try {
      setSubmissionError(null);
      const res = await authService.login(data);

      if (typeof window !== "undefined") {
        if (res.token) {
          localStorage.setItem("auth_token", res.token);
        }
        if (res.user) {
          localStorage.setItem("user", JSON.stringify(res.user));
        }
        if (res.store) {
          localStorage.setItem("active_store", JSON.stringify(res.store));
        }
        if (res.profiles) {
          localStorage.setItem("store_profiles", JSON.stringify(res.profiles));
        }
      }

      // If store has no profiles configured yet, guide owner to Store Setup & PIN creation
      if (!res.profiles || res.profiles.length === 0) {
        router.push("/activate-account");
      } else {
        router.push("/select-profile");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("EMAIL_NOT_VERIFIED")) {
          if (typeof window !== "undefined") {
            try {
              sessionStorage.setItem("auth_pending_email", data.email.trim().toLowerCase());
              sessionStorage.setItem("auth_otp_purpose", "SIGNUP");
            } catch {
              // Ignore session storage errors
            }
          }
          setSubmissionError(
            "Your email has not been verified yet. Please check your Gmail inbox/spam for the OTP verification code."
          );
        } else {
          setSubmissionError(err.message || "Invalid email or password. Please try again.");
        }
      } else {
        setSubmissionError("Invalid email or password. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 sm:gap-3.5 w-full"
      noValidate
    >
      {successNotice && (
        <div
          role="status"
          className="rounded-[12px] bg-status-success-bg border border-status-success/30 p-2.5 text-xs text-status-success flex items-center gap-2"
        >
          <span>{successNotice}</span>
        </div>
      )}

      {submissionError && (
        <div
          role="alert"
          className="rounded-[12px] bg-status-error-bg border border-status-error/30 p-2.5 text-xs text-status-error"
        >
          {submissionError}
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

      {/* Password Input with show/hide toggle */}
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        autoComplete="current-password"
        showPasswordToggle
        error={errors.password?.message}
        {...register("password")}
      />

      {/* Remember me & Forgot password row */}
      <div className="flex items-center justify-between pt-0.5">
        <Checkbox
          label="Remember me"
          {...register("rememberMe")}
        />

        <Link
          href="/forgot-password"
          className="font-sans font-medium text-xs sm:text-sm text-body hover:text-primary transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button: Dynamically toggles between disabled (mutes) and active (primary) */}
      <div className="pt-1">
        <Button
          type="submit"
          fullWidth
          variant={isButtonActive ? "primary" : "mutes"}
          disabled={!isButtonActive || isSubmitting}
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="size-4" />}
        >
          Sign In
        </Button>
      </div>

      {/* "or" Divider */}
      <div className="relative flex items-center justify-center py-1">
        <div className="w-full border-t border-default" />
        <span className="absolute bg-theme border border-default px-2.5 py-0.5 rounded-[8px] font-sans text-[11px] text-body tracking-wider">
          or
        </span>
      </div>

      {/* Social Google Sign-In */}
      <GoogleAuthButton />

      {/* Sign Up / Account Link */}
      <div className="flex items-center justify-center gap-1.5 pt-1 text-center">
        <span className="font-sans text-xs text-body">Don&apos;t have an account?</span>
        <Link
          href="/signup"
          className="font-sans font-semibold text-xs tracking-wider uppercase text-primary hover:underline transition-all"
        >
          Create an account
        </Link>
      </div>

      {/* Legal Disclaimer */}
      <p className="font-sans text-[11px] text-body/80 text-center pt-0.5 leading-tight">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
}

export default LoginForm;
