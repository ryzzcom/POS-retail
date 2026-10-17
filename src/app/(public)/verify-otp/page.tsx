import type { Metadata } from "next";
import { OtpView } from "@/features/auth";

export const metadata: Metadata = {
  title: "Verify OTP | POS Retail",
  description:
    "Enter the 6-digit verification code sent to your registered email and phone.",
};

export default function VerifyOtpPage() {
  return <OtpView />;
}
