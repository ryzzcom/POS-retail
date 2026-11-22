import { apiClient } from "@/lib/api-client";
import type { LoginInput } from "../schemas/login.schema";
import type { SignupInput } from "../schemas/signup.schema";
import type { ForgotPasswordInput } from "../schemas/forgot-password.schema";
import type { OtpInput } from "../schemas/otp.schema";
import type { ResetPasswordInput } from "../schemas/reset-password.schema";
import type {
  LoginResponse,
  UnlockProfileInput,
  UnlockProfileResponse,
  StaffProfile,
  UserContext,
  StoreContext,
  AuthActionResponse,
} from "../types/auth.types";

export const authService = {
  /**
   * 1. Store Owner / Cashier Login (POST /api/v1/auth/login)
   */
  login: async (credentials: LoginInput): Promise<LoginResponse> => {
    const res = await apiClient.post<{
      accessToken: string;
      user: UserContext;
      store: StoreContext;
      profiles: Array<{
        id: string;
        displayName: string;
        role: "OWNER" | "CASHIER";
        maxDiscountPct?: number;
        assignedCounterId?: string | null;
        assignedCounter?: {
          id: string;
          name: string;
          code: string;
        } | null;
      }>;
    }>("/auth/login", {
      email: credentials.email.trim(),
      password: credentials.password,
      rememberMe: credentials.rememberMe ?? false,
    });

    // Save token in client memory / localStorage
    apiClient.setToken(res.accessToken);

    const profiles: StaffProfile[] = (res.profiles || []).map((p) => ({
      id: p.id,
      displayName: p.displayName,
      role: p.role,
      isPinSet: true,
      maxDiscountPct: p.maxDiscountPct,
      assignedCounterId: p.assignedCounterId || p.assignedCounter?.id || null,
      assignedCounter: p.assignedCounter || null,
    }));

    return {
      success: true,
      token: res.accessToken,
      user: res.user,
      store: res.store,
      profiles,
    };
  },

  /**
   * 2. Profile PIN Unlock / Elevate Session (POST /api/v1/auth/profile/unlock)
   */
  unlockProfile: async (data: UnlockProfileInput): Promise<UnlockProfileResponse> => {
    try {
      const res = await apiClient.post<{
        profile: {
          id: string;
          displayName: string;
          role: "OWNER" | "CASHIER";
          maxDiscountPct?: number;
        };
        landingPath: string;
      }>("/auth/profile/unlock", {
        profileId: data.profileId,
        pin: data.pin,
      });

      return {
        success: true,
        sessionToken: apiClient.getToken() || undefined,
        landingPath: res.landingPath,
        profile: {
          id: res.profile.id,
          displayName: res.profile.displayName,
          role: res.profile.role,
          isPinSet: true,
          maxDiscountPct: res.profile.maxDiscountPct,
        },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Incorrect 4-digit PIN. Please try again.";
      return {
        success: false,
        error: message,
      };
    }
  },

  /**
   * 3. Owner Registration (POST /api/v1/auth/signup)
   */
  signup: async (
    data: SignupInput & { storeName?: string }
  ): Promise<AuthActionResponse> => {
    const derivedStoreName =
      (data as Record<string, unknown>).storeName?.toString() ||
      (data.fullName.trim() ? `${data.fullName.trim()}'s Boutique` : "Boutique Retail");

    const res = await apiClient.post<{ message: string; email: string; otp?: string }>("/auth/signup", {
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      confirmPassword: data.confirmPassword,
      storeName: derivedStoreName,
    });

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("auth_pending_email", data.email.trim().toLowerCase());
        sessionStorage.setItem("auth_otp_purpose", "SIGNUP");
        if (res.otp) {
          sessionStorage.setItem("auth_debug_otp", res.otp);
        }
      } catch {
        // Ignore session storage errors
      }
    }

    return {
      success: true,
      message: res.message,
      email: res.email,
    };
  },

  /**
   * 4. Verify Registration OTP (POST /api/v1/auth/verify-otp)
   */
  verifyOtp: async (
    data: OtpInput & { email?: string }
  ): Promise<AuthActionResponse> => {
    let email = data.email;
    if (!email && typeof window !== "undefined") {
      email = sessionStorage.getItem("auth_pending_email") || undefined;
    }

    if (!email) {
      throw new Error("No pending verification email found. Please sign up or request a new code.");
    }

    const res = await apiClient.post<{ message: string }>("/auth/verify-otp", {
      email: email.trim().toLowerCase(),
      otp: data.otp.trim(),
    });

    return {
      success: true,
      message: res.message,
      email,
    };
  },

  /**
   * 5. Resend OTP (POST /api/v1/auth/resend-otp)
   */
  resendOtp: async (
    email?: string,
    type?: "SIGNUP" | "FORGOT_PASSWORD"
  ): Promise<AuthActionResponse> => {
    let targetEmail = email;
    if (!targetEmail && typeof window !== "undefined") {
      targetEmail = sessionStorage.getItem("auth_pending_email") || undefined;
    }

    if (!targetEmail) {
      throw new Error("No recipient email found for OTP resend.");
    }

    let purpose = type;
    if (!purpose && typeof window !== "undefined") {
      purpose = (sessionStorage.getItem("auth_otp_purpose") as "SIGNUP" | "FORGOT_PASSWORD") || "SIGNUP";
    }

    const res = await apiClient.post<{ message: string }>("/auth/resend-otp", {
      email: targetEmail.trim().toLowerCase(),
      type: purpose || "SIGNUP",
    });

    return {
      success: true,
      message: res.message,
      email: targetEmail,
    };
  },

  /**
   * 6. Forgot Password Request (POST /api/v1/auth/forgot-password)
   */
  forgotPassword: async (
    data: ForgotPasswordInput
  ): Promise<AuthActionResponse> => {
    const res = await apiClient.post<{ message: string }>("/auth/forgot-password", {
      email: data.email.trim().toLowerCase(),
    });

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("auth_pending_email", data.email.trim().toLowerCase());
        sessionStorage.setItem("auth_otp_purpose", "FORGOT_PASSWORD");
      } catch {
        // Ignore session storage errors
      }
    }

    return {
      success: true,
      message: res.message,
      email: data.email,
    };
  },

  /**
   * 7. Reset Password (POST /api/v1/auth/reset-password)
   */
  resetPassword: async (
    data: ResetPasswordInput & { email?: string; otp?: string }
  ): Promise<AuthActionResponse> => {
    let email = data.email;
    let otp = data.otp;

    if (typeof window !== "undefined") {
      if (!email) email = sessionStorage.getItem("auth_pending_email") || undefined;
      if (!otp) otp = sessionStorage.getItem("auth_reset_otp") || undefined;
    }

    if (!email) {
      throw new Error("Email context missing. Please restart the password reset process.");
    }
    if (!otp) {
      throw new Error("Verification OTP code missing. Please verify your OTP first.");
    }

    const res = await apiClient.post<{ message: string }>("/auth/reset-password", {
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
      newPassword: data.password,
      confirmNewPassword: data.confirmPassword,
    });

    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("auth_pending_email");
        sessionStorage.removeItem("auth_reset_otp");
        sessionStorage.removeItem("auth_otp_purpose");
      } catch {
        // Ignore session storage errors
      }
    }

    return {
      success: true,
      message: res.message,
    };
  },

  /**
   * 8. Current Session Profile (GET /api/v1/auth/me)
   */
  getMe: async (): Promise<{ user: UserContext; store: StoreContext; profiles?: StaffProfile[] }> => {
    return apiClient.get<{ user: UserContext; store: StoreContext; profiles?: StaffProfile[] }>("/auth/me");
  },

  /**
   * 9. Logout & Revoke Session (POST /api/v1/auth/logout)
   */
  logout: async (): Promise<{ success: boolean; message: string }> => {
    try {
      await apiClient.post<{ success: boolean; message: string }>("/auth/logout");
    } catch {
      // Backend token invalidation failure shouldn't block local logout
    } finally {
      apiClient.clearToken();
    }

    return {
      success: true,
      message: "Logged out successfully",
    };
  },
};
