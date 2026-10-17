import type { LoginInput } from "../schemas/login.schema";
import type { SignupInput } from "../schemas/signup.schema";
import type { ForgotPasswordInput } from "../schemas/forgot-password.schema";
import type { OtpInput } from "../schemas/otp.schema";
import type { ResetPasswordInput } from "../schemas/reset-password.schema";

export const authService = {
  login: async (_credentials: LoginInput): Promise<{ success: boolean }> => {
    return Promise.resolve({ success: true });
  },
  signup: async (_data: SignupInput): Promise<{ success: boolean }> => {
    return Promise.resolve({ success: true });
  },
  forgotPassword: async (
    _data: ForgotPasswordInput
  ): Promise<{ success: boolean }> => {
    return Promise.resolve({ success: true });
  },
  verifyOtp: async (_data: OtpInput): Promise<{ success: boolean }> => {
    return Promise.resolve({ success: true });
  },
  resendOtp: async (_email?: string): Promise<{ success: boolean }> => {
    return Promise.resolve({ success: true });
  },
  resetPassword: async (
    _data: ResetPasswordInput
  ): Promise<{ success: boolean }> => {
    return Promise.resolve({ success: true });
  },
};
