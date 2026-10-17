import type { Metadata } from "next";
import { ResetPasswordView } from "@/features/auth";

export const metadata: Metadata = {
  title: "Reset Your Password | POS Retail",
  description:
    "Create a new secure password for your POS Retail store account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
}
