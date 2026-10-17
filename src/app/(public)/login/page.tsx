import type { Metadata } from "next";
import { LoginView } from "@/features/auth";

export const metadata: Metadata = {
  title: "Sign In | POS Retail",
  description: "Sign in to your retail store management dashboard and POS terminals",
};

export default function LoginPage() {
  return <LoginView />;
}
