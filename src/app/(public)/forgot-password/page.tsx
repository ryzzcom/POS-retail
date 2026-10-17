import type { Metadata } from "next";
import { ForgotPasswordView } from "@/features/auth";

export const metadata: Metadata = {
  title: "Forgot Password | POS Retail",
  description:
    "Reset your store account password or request an OTP verification code.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
